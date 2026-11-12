import { createClient } from 'npm:@supabase/supabase-js@2';
import Stripe from 'npm:stripe@17.7.0';
import { corsHeaders } from '../_shared/cors.ts';

function requiredEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing required function secret: ${name}`);
  return value;
}

function jsonResponse(body: unknown, status: number, headers: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' }
  });
}

const stripe = new Stripe(requiredEnv('STRIPE_SECRET_KEY'));
const webhookSecret = requiredEnv('STRIPE_WEBHOOK_SECRET');
const supabase = createClient(
  requiredEnv('SUPABASE_URL'),
  requiredEnv('SUPABASE_SERVICE_ROLE_KEY'),
  { auth: { autoRefreshToken: false, persistSession: false } }
);
const cryptoProvider = Stripe.createSubtleCryptoProvider();

Deno.serve(async (request) => {
  const headers = corsHeaders(request.headers.get('Origin'));
  if (request.method === 'OPTIONS') return new Response('ok', { headers });
  if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed.' }, 405, headers);

  const signature = request.headers.get('Stripe-Signature');
  if (!signature) return jsonResponse({ error: 'Missing Stripe-Signature header.' }, 400, headers);

  let event: Stripe.Event;
  try {
    const rawBody = await request.text();
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret, undefined, cryptoProvider);
  } catch (error) {
    console.error('Stripe webhook signature verification failed:', error);
    return jsonResponse({ error: 'Invalid Stripe webhook signature.' }, 400, headers);
  }

  if (event.type !== 'checkout.session.completed') {
    return jsonResponse({ received: true }, 200, headers);
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (session.mode !== 'payment' || session.payment_status !== 'paid') {
    return jsonResponse({ received: true, ignored: 'payment_not_complete' }, 200, headers);
  }

  const userId = session.metadata?.userId;
  const itemSlug = session.metadata?.itemSlug;
  if (!userId || !itemSlug || session.client_reference_id !== userId) {
    console.error('Completed Checkout session has missing or inconsistent metadata.', session.id);
    return jsonResponse({ received: true, ignored: 'invalid_metadata' }, 200, headers);
  }

  let itemResult;
  let lineItemsResult;
  try {
    [itemResult, lineItemsResult] = await Promise.all([
      supabase.from('store_items')
        .select('stripe_price_id,price_eur_cents')
        .eq('slug', itemSlug)
        .maybeSingle(),
      stripe.checkout.sessions.listLineItems(session.id, { limit: 2 })
    ]);
  } catch (error) {
    console.error('Could not verify completed Stripe Checkout items:', error);
    return jsonResponse({ error: 'Could not verify the purchased item; Stripe may retry this event.' }, 500, headers);
  }
  if (itemResult.error) {
    console.error('Could not load the purchased store item:', itemResult.error);
    return jsonResponse({ error: 'Could not verify the purchased item; Stripe may retry this event.' }, 500, headers);
  }
  const item = itemResult.data;
  const lineItem = lineItemsResult.data[0];
  const linePriceId = typeof lineItem?.price === 'string' ? lineItem.price : lineItem?.price?.id;
  if (!item || !item.stripe_price_id || !item.price_eur_cents
      || lineItemsResult.has_more || lineItemsResult.data.length !== 1
      || linePriceId !== item.stripe_price_id || lineItem.quantity !== 1
      || session.currency !== 'eur' || session.amount_total !== item.price_eur_cents) {
    console.error('Completed Checkout session does not match the configured store item.', session.id);
    return jsonResponse({ received: true, ignored: 'item_mismatch' }, 200, headers);
  }

  const { data, error } = await supabase.rpc('fulfill_store_purchase', {
    p_user_id: userId,
    p_item_slug: itemSlug,
    p_stripe_session_id: session.id
  });
  if (error) {
    console.error('Could not fulfill verified Stripe purchase:', error);
    return jsonResponse({ error: 'Purchase fulfillment failed; Stripe may retry this event.' }, 500, headers);
  }

  return jsonResponse({ received: true, fulfilled: Boolean(data) }, 200, headers);
});
