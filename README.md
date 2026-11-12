# Viseu Quest

Viseu Quest is a vanilla JavaScript Vite PWA. Adventure progress continues to
use the existing browser-local `viseu-quest-v1` key. Studio Shop balances and
purchases use the separate, server-authoritative Supabase profile wallet.

**Checklist reviewed and dated: 2026-11-12 (UTC).**

## Completed checklist

- [x] Vite production build, installable PWA manifest/icons, automatic service-worker updates, and offline app-shell caching.
- [x] Preserve the original SVG map, landmark quests, avatar, collectibles, passport, localStorage key, and existing avatar shop.
- [x] Responsive home map and fixed, safe-area-aware bottom navigation for Map, Passport, Collection, Avatar, and Studio.
- [x] English and European Portuguese language selector for the main navigation, quick tour, key game screens, landmark quizzes, trails, map controls, and Studio Shop interface; language preference is stored separately from game progress.
- [x] Accessible slide-up screens for Passport, Collection, Avatar Shop, and Studio Shop; full-screen map uses the same live player/map state.
- [x] Add an OpenStreetMap street-map view centered on Viseu while preserving the original illustrated game map and its gameplay.
- [x] Add five Viseu city-map coin discoveries linked to existing landmark quests; claims add coins, XP, collection status, daily challenge progress, and trail progress to the existing local save.
- [x] Add “Explore in game” from each city-map discovery and retain the original game-map mode.
- [x] Add opt-in, device-only location display: the browser is asked only after enabling the Profile setting and tapping “Locate me”; tracking stops and the position is cleared when the map closes.
- [x] Add approximate-location display, location permission/error states, visible OpenStreetMap attribution, and an offline notice with the illustrated map as fallback.
- [x] Add an editable local explorer name/badge and clearly labeled, device-only map privacy preferences.
- [x] Add manual UTC-day check-ins, non-punitive streaks, a seven-day Perfect Week reward, three rotating claimable daily challenges, XP/coin rewards, and four Viseu trail chapters with collectible stickers.
- [x] Keep trails honest to the current PWA: progression uses game stamps, quizzes, pickups, and map discoveries, not claimed step counts or verified physical visits.
- [x] Pause the game animation/collection loop while the document is hidden or an app screen/dialog is open; resume it when visible again.
- [x] Report browser storage write failures in the app's accessible live region instead of silently ignoring them.
- [x] Studio Shop catalog, category filters, animated canvas previews with optional Rive files, and offline catalog cache.
- [x] Supabase sign-in/catalog/collection scaffolding, RLS migration, server-side coin purchases, Stripe Checkout, and signature-verified idempotent fulfillment scaffolding.
- [x] Build and production-preview checks passed for the app, navigation, manifest, icons, and service worker.

## Development

```sh
npm install
cp .env.example .env.local
npm run dev
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local` to connect
the Studio Shop. Without them, the drawer runs in preview mode and does not
perform purchases.

The homepage language control switches the supported interface text between
English and European Portuguese. It stores the choice in `viseu-quest-lang`;
game progress remains under `viseu-quest-v1`. Product copy supplied by a
configured Supabase catalog is managed by that catalog and may need its own
Portuguese content.

## Production

```sh
npm run build
npm run preview
```

The PWA precaches the app shell and caches loaded Rive files for offline use.
Installability requires HTTPS (or localhost).

## City map and location

The fullscreen map uses OpenStreetMap raster tiles centered on Viseu. Tile
requests require a network connection; city tiles are intentionally not
precached or cached by the service worker. When offline, close the street-map
view to return to the illustrated game map. The public OpenStreetMap tile
service is suitable for development and light evaluation, not an unrestricted
production tile backend. Before launch, choose a tile provider or host tiles
that meets expected usage, availability, licensing, and attribution
requirements.

Location is off by default. A player must enable “Allow location on city map”
in Profile and tap “Locate me”; browser permission is also required. Location
is used only to render a marker on the device, is not stored or sent to Viseu
Quest, and is cleared when the fullscreen map closes. Approximate mode rounds
the displayed position to a coarse area. Browser tile requests can still
reveal requested map areas and network metadata (such as IP address) to the
selected tile provider; this is separate from the GPS coordinates used for the
marker. Location updates pause while the page is hidden.

Five city-map coin discoveries are defined in `src/city-map-items.js` using
OpenStreetMap landmark coordinates and linked to existing in-game landmarks.
Claiming one updates the existing `viseu-quest-v1` save, coin inventory,
collection count, XP, daily challenges, and trail progress. Claims are
available as a local prototype and do not request GPS or verify that a player
physically visited the landmark; localStorage is user-editable. Keep rewards
non-cash and local until a server-backed claim and anti-abuse design is
implemented.

## Studio Shop launch checklist

- [ ] Create a Supabase project, set the two `VITE_SUPABASE_*` values in `.env.local`, and apply the migration with `npx supabase db push`.
- [ ] Allow the app origin in Supabase Auth URL configuration so email sign-in links return to the PWA.
- [ ] Create matching one-time EUR Stripe prices for EUR products and set each `store_items.stripe_price_id`. The Stripe Price must be active, one-time, in EUR, and match `price_eur_cents`.
- [ ] Set Edge Function secrets `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `APP_URL`, and `ALLOWED_ORIGINS` (comma-separated exact origins), then deploy `create-stripe-checkout` and `stripe-webhook`.
- [ ] Register the Stripe webhook endpoint at `/functions/v1/stripe-webhook` for `checkout.session.completed`.
- [ ] Upload the badge, art-pack, board-theme, and dice/streak `.riv` files to public HTTPS storage and set their URLs in `store_items.rive_asset_url`. Canvas previews are used until assets are configured.
- [ ] Test email sign-in, RLS ownership, coin purchases, Stripe test-mode checkout, webhook retries, and account collection updates before launch.
- [ ] Keep local gameplay coins separate from the server wallet unless a trusted, server-validated earning/sync design is implemented. Browser localStorage is user-editable.

Never expose the Stripe secret, webhook secret, or Supabase service-role key
through a `VITE_*` variable. Edge Functions use Supabase's server-side
`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` values.

## Roadmap review and prioritized task list

The supplied roadmap describes an eight-quarter, 24-month plan for a native
React Native product with GPS/step claims, geospatial services, and eventually
social play and payouts. This repository is currently a browser PWA with a
stylized local map; it does not yet collect GPS, health steps, or location-based
rewards. The completed items above are the roadmap work that safely fits this
app today. Native-only or scale-dependent systems are deliberately tasks, not
partially wired features.

### P0 — Release readiness (Q1 foundation / before launch)

- [ ] Deploy the Supabase schema and functions, configure Stripe test products/webhooks, and complete the Studio Shop launch checklist above.
- [ ] Add automated tests for gameplay persistence, reward/coin invariants, navigation/modal behavior, and offline PWA startup.
- [ ] Test disabled/quota-full browser storage and offline/online transitions on supported mobile browsers; document the tested browser/device matrix.
- [ ] Decide whether this product remains a web PWA or will also ship as a native app before committing to native platform work.

### P1 — Trustworthy progress and economy (Q1–Q3)

- [ ] Decide whether daily rewards and trail rewards should remain local-only or migrate to the authenticated server wallet before any launch that advertises cross-device sync or cash value.
- [ ] Define whether progress needs cross-device/server sync. If yes, design a durable offline event queue, retry/idempotency rules, and conflict reconciliation before connecting local rewards to a server balance.
- [ ] Before offering transferable or cash-equivalent rewards, replace direct balance mutations with an append-only, auditable ledger and reconciliation tests.
- [ ] If real-world movement rewards are approved, write a privacy/consent and threat model first; then add explicit opt-in location/step collection, server validation, and abuse monitoring. Do not treat client GPS or localStorage as proof.
- [ ] For native distribution only, evaluate iOS/Android geofencing and health APIs with battery, permission, and background-execution tests.
- [ ] If friends are added, implement actual account-backed friend relationships, visibility lists, blocking, and reporting before enabling location visibility; current privacy controls only store local preferences.
- [ ] Add profile photo upload/cropping and account/email/newsletter management only after an account backend and storage-retention policy are selected.
- [ ] Add push reminders only after opt-in UX, platform capability checks, and server scheduling are implemented; avoid loss-framed notifications or streak penalties.
- [ ] Evaluate an optional, clearly explained streak recovery/freeze only after testing that missed days do not shame or pressure players.

### P2 — Map and live content (Q2; gated on real geospatial data)

- [ ] Before production launch, choose and configure a licensed, appropriately sized city-tile provider or self-hosted tile service; document attribution, privacy, quotas, and availability.
- [ ] Evaluate a compliant offline city-map strategy only after provider licensing and mobile storage limits are confirmed; keep the illustrated map as the offline fallback until then.
- [ ] Measure map performance, data/API cost, and scale needs before selecting MapLibre/vector tiles, H3 indexing, Redis, or a spatial database.
- [ ] If a real-world map and server-backed spawn data are adopted, prototype cached map/spawn data and verify offline behavior and latency on representative devices.
- [ ] Only after location safety and server validation are in place, evaluate weather/time-based spawns with clear availability rules and abuse limits.

### P3 — Social play and operations (Q4–Q6; gated on backend and privacy review)

- [ ] Establish privacy-minimized product telemetry and baseline retention/economy dashboards before setting social or growth targets.
- [ ] Prototype opt-in walk parties only after defining consent, location visibility, blocking/reporting, and server authority.
- [ ] Add friend rankings, location visibility lists, and referral rewards only after real accounts, abuse controls, consent, and privacy review exist.
- [ ] If adding map jackpots or variable rewards, prefer transparent, non-purchase-based rewards and review local rules; do not add gambling-like paid random rewards.
- [ ] Design seasonal quests/promotions as a versioned, validated content schema before considering server-driven UI or A/B testing.
- [ ] Do not add instant payouts until legal/compliance review, ledger reconciliation, and independently reviewed fraud controls are complete.

### P4 — Scale and platform expansion (Q5–Q8; evidence-driven)

- [ ] Benchmark on mid-range mobile devices; optimize measured bottlenecks before adopting Rust/native modules or high-FPS targets.
- [ ] Consider neighborhood leaderboards only after reliable server-validated location/gameplay and anti-cheat controls exist.
- [ ] Treat watchOS/Wear OS support as a separate native-app project with explicit health-data permission and battery requirements.
- [ ] Consider predictive retention models and multi-region infrastructure only after privacy-approved data, proven product traction, and measured scaling requirements justify them.
