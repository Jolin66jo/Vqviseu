import { createClient } from 'npm:@supabase/supabase-js@2';
import Stripe from 'npm:stripe@17.7.0';
import { corsHeaders, isAllowedOrigin } from '../_shared/cors.ts';

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

const supabaseUrl = requiredEnv('SUPABASE_URL');
const serviceRoleKey = requiredEnv('SUPABASE_SERVICE_ROLE_KEY');
const stripe = new Stripe(requiredEnv('STRIPE_SECRET_KEY'));
const appUrl = new URL(requiredEnv('APP_URL'));
if (appUrl.pathname !== '/' || appUrl.search || appUrl.hash) {
  throw new Error('APP_URL must be an origin such as https://example.com');
}
if (appUrl.protocol !== 'https:' && appUrl.hostname !== 'localhost') {
  throw new Error('APP_URL must use HTTPS outside localhost');
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

Deno.serve(async (request) => {
  const origin = request.headers.get('Origin');
  const headers = corsHeaders(origin);

  if (!isAllowedOrigin(origin)) return jsonResponse({ error: 'Origin is not allowed.' }, 403, headers);
  if (request.method === 'OPTIONS') return new Response('ok', { headers });
  if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed.' }, 405, headers);

  const authorization = request.headers.get('Authorization') || '';
  const tokenMatch = authorization.match(/^Bearer\s+(.+)$/i);
  if (!tokenMatch) return jsonResponse({ error: 'Sign in to start checkout.' }, 401, headers);

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: 'Request body must be valid JSON.' }, 400, headers);
  }
  if (!payload || typeof payload !== 'object') {
    return jsonResponse({ error: 'Request body must include an itemSlug and userId.' }, 400, headers);
  }
  const { itemSlug, userId } = payload as { itemSlug?: unknown; userId?: unknown };
  if (typeof itemSlug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(itemSlug)
      || typeof userId !== 'string') {
    return jsonResponse({ error: 'A valid itemSlug and userId are required.' }, 400, headers);
  }

  try {
    const { data: { user }, error: authError } = await admin.auth.getUser(tokenMatch[1]);
    if (authError || !user) return jsonResponse({ error: 'Your sign-in has expired. Sign in again.' }, 401, headers);
    if (user.id !== userId) return jsonResponse({ error: 'The signed-in user does not match the request.' }, 403, headers);

    const { data: item, error: itemError } = await admin
      .from('store_items')
      .select('slug,title,stripe_price_id,is_active,price_eur_cents')
      .eq('slug', itemSlug)
      .eq('is_active', true)
      .maybeSingle();
    if (itemError) throw new Error(`Could not load store item: ${itemError.message}`);
    if (!item) return jsonResponse({ error: 'This item is no longer available.' }, 404, headers);
    if (!item.price_eur_cents || !item.stripe_price_id) {
      return jsonResponse({ error: 'This item is not configured for Stripe Checkout yet.' }, 409, headers);
    }
    const stripePrice = await stripe.prices.retrieve(item.stripe_price_id);
    if (!stripePrice.active || stripePrice.type !== 'one_time'
        || stripePrice.currency !== 'eur' || stripePrice.unit_amount !== item.price_eur_cents) {
      return jsonResponse({ error: 'Stripe price is inactive or does not match the listed EUR price.' }, 409, headers);
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: item.stripe_price_id, quantity: 1 }],
      client_reference_id: user.id,
      metadata: { userId: user.id, itemSlug: item.slug },
      success_url: `${appUrl.origin}/?studio_checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl.origin}/?studio_checkout=cancelled`
    });
    if (!session.url) throw new Error('Stripe did not return a Checkout URL.');
    return jsonResponse({ url: session.url }, 200, headers);
  } catch (error) {
    console.error('Stripe Checkout session creation failed:', error);
    return jsonResponse({ error: 'Could not create a secure checkout session.' }, 500, headers);
  }
});
