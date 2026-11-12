# Viseu Quest

Viseu Quest is a vanilla JavaScript Vite PWA. Adventure progress continues to
use the existing browser-local `viseu-quest-v1` key. Studio Shop balances and
purchases use the separate, server-authoritative Supabase profile wallet.

## Development

```sh
npm install
cp .env.example .env.local
npm run dev
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local` to connect
the Studio Shop. Without them, the drawer runs in preview mode and does not
perform purchases.

## Production

```sh
npm run build
npm run preview
```

The PWA precaches the app shell and caches loaded Rive files for offline use.
Installability requires HTTPS (or localhost).

## Studio Shop checklist

### Implemented

- [x] Responsive bottom-sheet drawer with Viseu Coins balance and the requested category filters.
- [x] Pastel product cards, EUR/coin price pills, loading spinner, and Stripe Checkout redirect.
- [x] Tailwind CSS utilities and Rive canvas runtime integration. Product previews use animated canvas artwork until a Rive asset URL is configured.
- [x] Public catalog cache for offline browsing; account actions and purchases require a connection.
- [x] Supabase email-link sign-in, active catalog loading, collection display, and server-side coin purchases.
- [x] `store_items`, `user_collections`, and `profiles` schema with RLS; coin deductions are checked and applied by a database function.
- [x] Authenticated Checkout-session creation and Stripe-signature-verified, idempotent purchase fulfillment.
- [x] Existing map, avatar shop, game mechanics, and localStorage key are retained.

### Configure before enabling live purchases

- [ ] Create a Supabase project, set the two `VITE_SUPABASE_*` values in `.env.local`, and apply the migration with `npx supabase db push`.
- [ ] Allow the app origin in Supabase Auth URL configuration so email sign-in links return to the PWA.
- [ ] Create matching one-time EUR Stripe prices for the EUR products, then set each corresponding `store_items.stripe_price_id`. The Stripe Price must be active, one-time, in EUR, and match `price_eur_cents`.
- [ ] Set the Edge Function secrets `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `APP_URL`, and `ALLOWED_ORIGINS` (comma-separated exact origins), then deploy `create-stripe-checkout` and `stripe-webhook`.
- [ ] Register the Stripe webhook endpoint at `/functions/v1/stripe-webhook` for `checkout.session.completed`.
- [ ] Upload the badge, art-pack, board-theme, and dice/streak `.riv` files to a public HTTPS location and set their URLs in `store_items.rive_asset_url`. Until then, animated canvas previews are shown.
- [ ] Test email sign-in, coin purchases, Stripe test-mode checkout, webhook retries, and account collection updates before launch.
- [ ] Decide whether gameplay-earned local coins should ever be bridged to the Studio wallet. They are intentionally separate: browser localStorage is editable and is not accepted as a payment balance.

The Edge Functions use Supabase's server-side `SUPABASE_URL` and
`SUPABASE_SERVICE_ROLE_KEY` environment values. Never expose the Stripe secret,
webhook secret, or service-role key through a `VITE_*` variable.
