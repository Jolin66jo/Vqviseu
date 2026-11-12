import { createClient } from '@supabase/supabase-js';
import { Rive } from '@rive-app/canvas';

const demoProducts = [
  {
    slug: 'founder-pass',
    title: 'Founder Pass',
    description: 'A golden badge for the first Viseu Quest explorers.',
    category: 'founder_pass',
    price_eur_cents: 199,
    coin_price: null,
    rive_asset_url: null
  },
  {
    slug: 'grao-vasco-art-pack',
    title: 'Grão Vasco Art Pack',
    description: 'Museum-inspired colors for your next little adventure.',
    category: 'grao_vasco_art_packs',
    price_eur_cents: 299,
    coin_price: null,
    rive_asset_url: null
  },
  {
    slug: 'azulejo-board-theme',
    title: 'Azulejo Board Theme',
    description: 'Blue-and-white tilework for your game board.',
    category: 'grao_vasco_art_packs',
    price_eur_cents: null,
    coin_price: 90,
    rive_asset_url: null
  },
  {
    slug: 'streak-boost',
    title: 'Streak Boost',
    description: 'A little golden nudge to keep your streak going.',
    category: 'streak_boosts',
    price_eur_cents: null,
    coin_price: 60,
    rive_asset_url: null
  },
  {
    slug: 'viseu-coins-100',
    title: 'Viseu Coin Pack',
    description: 'Add 100 Viseu Coins to your Studio wallet.',
    category: 'viseu_coins',
    price_eur_cents: 199,
    coin_price: null,
    rive_asset_url: null
  }
];

const reusableSlugs = new Set(['viseu-coins-100']);
const catalogCacheKey = 'viseu-studio-shop-catalog-v1';
const categories = new Map([
  ['all', null],
  ['founder_pass', 'Founder Pass'],
  ['grao_vasco_art_packs', 'Grão Vasco Art Packs'],
  ['streak_boosts', 'Streak Boosts']
]);
const euro = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' });
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
let supabase = null;
let supabaseConfigError = '';
if (supabaseUrl && supabaseAnonKey) {
  try {
    const url = new URL(supabaseUrl);
    if (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))) {
      throw new Error('Supabase URL must use HTTPS outside localhost.');
    }
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true }
    });
  } catch (error) {
    supabaseConfigError = error instanceof Error ? error.message : 'Invalid Supabase configuration.';
    console.error('Studio Shop Supabase configuration is invalid.', error);
  }
}

const state = {
  user: null,
  balance: 0,
  owned: new Set(),
  founderPass: false,
  products: [],
  category: 'all',
  previewRuns: new Map(),
  isOpen: false,
  trigger: null,
  drawer: null,
  status: null,
  productsNode: null
};

function setStatus(message, isError = false) {
  state.status.textContent = message;
  state.status.classList.toggle('is-error', isError);
}

function getLocalPreviewBalance() {
  try {
    const saved = JSON.parse(localStorage.getItem('viseu-quest-v1') || 'null');
    return Number.isFinite(saved?.coins) ? Math.max(0, saved.coins) : 0;
  } catch (error) {
    console.warn('Could not read the local Viseu Quest balance for shop preview.', error);
    return 0;
  }
}

function getCachedCatalog() {
  try {
    const catalog = JSON.parse(localStorage.getItem(catalogCacheKey) || 'null');
    return Array.isArray(catalog) ? catalog.filter((item) => (
      typeof item?.slug === 'string'
      && typeof item?.title === 'string'
      && typeof item?.description === 'string'
      && typeof item?.category === 'string'
      && (Number.isInteger(item?.price_eur_cents) || Number.isInteger(item?.coin_price))
    )) : [];
  } catch (error) {
    console.warn('Could not read the cached Studio Shop catalog.', error);
    return [];
  }
}

function cacheCatalog(catalog) {
  try {
    localStorage.setItem(catalogCacheKey, JSON.stringify(catalog));
  } catch (error) {
    console.warn('Could not cache the Studio Shop catalog for offline viewing.', error);
  }
}

function clearPreviews() {
  for (const run of state.previewRuns.values()) {
    if (run.frame) cancelAnimationFrame(run.frame);
    if (run.rive) run.rive.cleanup();
  }
  state.previewRuns.clear();
}

function roundRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

function drawDice(context, time) {
  context.save();
  context.translate(120, 78 + Math.sin(time * 2.2) * 4);
  context.rotate(Math.sin(time * 1.4) * .1);
  context.scale(1, .78);
  context.beginPath();
  context.moveTo(0, -42); context.lineTo(42, -20); context.lineTo(0, 3); context.lineTo(-42, -20); context.closePath();
  context.fillStyle = '#dbe8ff'; context.fill();
  context.beginPath();
  context.moveTo(-42, -20); context.lineTo(0, 3); context.lineTo(0, 48); context.lineTo(-42, 24); context.closePath();
  context.fillStyle = '#1d4ed8'; context.fill();
  context.beginPath();
  context.moveTo(0, 3); context.lineTo(42, -20); context.lineTo(42, 24); context.lineTo(0, 48); context.closePath();
  context.fillStyle = '#ea580c'; context.fill();
  context.strokeStyle = '#17213c'; context.lineWidth = 3; context.lineJoin = 'round'; context.stroke();
  context.fillStyle = '#fff';
  for (const [x, y] of [[-25, -14], [-15, 11], [-25, 27], [20, 5], [30, 18]]) {
    context.beginPath(); context.arc(x, y, 3.2, 0, Math.PI * 2); context.fill();
  }
  context.restore();
}

function drawBoard(context, time) {
  context.save();
  context.translate(120, 72);
  context.rotate(Math.sin(time * 1.3) * .035);
  roundRect(context, -49, -42, 98, 84, 15);
  context.fillStyle = '#1d4ed8'; context.fill();
  roundRect(context, -41, -34, 82, 68, 11);
  context.fillStyle = '#fffdf7'; context.fill();
  context.strokeStyle = '#1d4ed8'; context.lineWidth = 2;
  for (let x = -26; x <= 26; x += 17) {
    context.beginPath(); context.moveTo(x, -25); context.lineTo(x, 25); context.stroke();
  }
  for (let y = -25; y <= 25; y += 17) {
    context.beginPath(); context.moveTo(-33, y); context.lineTo(33, y); context.stroke();
  }
  context.fillStyle = '#ea580c';
  context.beginPath(); context.arc(0, 0, 8, 0, Math.PI * 2); context.fill();
  context.fillStyle = '#10b981';
  context.beginPath(); context.arc(-25, 17, 5, 0, Math.PI * 2); context.fill();
  context.restore();
}

function drawBadge(context, time) {
  context.save();
  context.translate(120, 71 + Math.sin(time * 2) * 4);
  context.rotate(Math.sin(time * 1.1) * .04);
  context.beginPath();
  for (let i = 0; i < 20; i++) {
    const angle = -Math.PI / 2 + i * Math.PI / 10;
    const radius = i % 2 ? 31 : 42;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (!i) context.moveTo(x, y); else context.lineTo(x, y);
  }
  context.closePath();
  context.fillStyle = '#f59e0b'; context.fill();
  context.strokeStyle = '#17213c'; context.lineWidth = 3; context.stroke();
  context.beginPath(); context.arc(0, 0, 27, 0, Math.PI * 2);
  context.fillStyle = '#fff8e7'; context.fill();
  context.strokeStyle = '#ea580c'; context.lineWidth = 2; context.stroke();
  context.fillStyle = '#1d4ed8';
  context.beginPath();
  context.moveTo(0, -19); context.lineTo(5, -5); context.lineTo(20, -5); context.lineTo(8, 4);
  context.lineTo(12, 18); context.lineTo(0, 10); context.lineTo(-12, 18); context.lineTo(-8, 4);
  context.lineTo(-20, -5); context.lineTo(-5, -5); context.closePath(); context.fill();
  context.restore();
}

function paintFallback(canvas, slug) {
  const context = canvas.getContext('2d');
  if (!context) return;
  const scale = 2;
  context.setTransform(scale, 0, 0, scale, 0, 0);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const preview = slug.includes('board') || slug.includes('art-pack')
    ? drawBoard
    : slug.includes('dice') || slug.includes('streak')
      ? drawDice
      : drawBadge;
  const run = { frame: 0, rive: null };
  state.previewRuns.set(canvas, run);
  const draw = (timestamp) => {
    if (!canvas.isConnected || state.previewRuns.get(canvas) !== run) return;
    context.clearRect(0, 0, 240, 140);
    preview(context, reducedMotion ? 0 : timestamp / 1000);
    if (!reducedMotion) run.frame = requestAnimationFrame(draw);
  };
  draw(0);
}

function safeRiveUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(value, window.location.href);
    return url.protocol === 'https:' || url.origin === window.location.origin ? url.href : null;
  } catch {
    return null;
  }
}

function startPreview(canvas, product) {
  const src = safeRiveUrl(product.rive_asset_url);
  if (!src) {
    paintFallback(canvas, product.slug);
    return;
  }

  const run = { frame: 0, rive: null };
  state.previewRuns.set(canvas, run);
  try {
    run.rive = new Rive({
      src,
      canvas,
      autoplay: true,
      onLoad: () => run.rive?.resizeDrawingSurfaceToCanvas(),
      onLoadError: () => {
        run.rive?.cleanup();
        if (state.previewRuns.get(canvas) === run) paintFallback(canvas, product.slug);
      }
    });
  } catch (error) {
    console.warn(`Could not load Rive preview for ${product.slug}.`, error);
    paintFallback(canvas, product.slug);
  }
}

function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'studio-product-card rounded-3xl';

  const previewWrap = document.createElement('div');
  previewWrap.className = 'studio-preview-wrap';
  const canvas = document.createElement('canvas');
  canvas.className = 'studio-preview';
  canvas.width = 480;
  canvas.height = 280;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', `${product.title} animated preview`);
  previewWrap.append(canvas);

  const copy = document.createElement('div');
  copy.className = 'studio-product-copy';
  const title = document.createElement('h3');
  title.className = 'studio-product-title';
  title.textContent = product.title;
  const description = document.createElement('p');
  description.className = 'studio-product-description';
  description.textContent = product.description;
  copy.append(title, description);

  const reusable = reusableSlugs.has(product.slug);
  const owned = state.owned.has(product.slug) && !reusable;
  if (owned) {
    const label = document.createElement('span');
    label.className = 'studio-owned';
    label.textContent = 'In your collection';
    copy.append(label);
  } else {
    const button = document.createElement('button');
    const kind = Number.isInteger(product.price_eur_cents) ? 'checkout' : 'coins';
    button.className = 'studio-price-button';
    button.type = 'button';
    button.dataset.shopAction = kind;
    button.dataset.slug = product.slug;
    button.dataset.kind = kind;
    button.setAttribute('aria-label', kind === 'checkout'
      ? `Buy ${product.title} for ${euro.format(product.price_eur_cents / 100)}`
      : `Buy ${product.title} for ${product.coin_price} Viseu Coins`);

    const label = document.createElement('span');
    label.textContent = kind === 'checkout'
      ? euro.format(product.price_eur_cents / 100)
      : `${product.coin_price} Viseu Coins`;
    const spinner = document.createElement('span');
    spinner.className = 'studio-spinner';
    spinner.hidden = true;
    spinner.setAttribute('aria-hidden', 'true');
    button.append(label, spinner);
    copy.append(button);
  }

  card.append(previewWrap, copy);
  if (state.isOpen) startPreview(canvas, product);
  return card;
}

function renderProducts() {
  clearPreviews();
  const category = categories.get(state.category);
  const products = state.products.filter((product) => !category || product.category === state.category);
  state.productsNode.replaceChildren();
  if (!products.length) {
    const empty = document.createElement('p');
    empty.className = 'studio-empty';
    empty.textContent = 'Nothing on this shelf just yet. Check back soon.';
    state.productsNode.append(empty);
    return;
  }
  state.productsNode.append(...products.map(createProductCard));
}

function renderBalance() {
  document.querySelector('#studioShopBalance').textContent = state.balance.toLocaleString();
}

function setButtonLoading(button, loading) {
  button.disabled = loading;
  button.setAttribute('aria-busy', String(loading));
  const spinner = button.querySelector('.studio-spinner');
  spinner.hidden = !loading;
}

async function loadCatalog() {
  if (!supabase) {
    state.products = demoProducts;
    state.balance = getLocalPreviewBalance();
    renderBalance();
    setStatus(supabaseConfigError
      ? `${supabaseConfigError} Shop is in preview mode.`
      : 'Preview mode: connect Supabase to enable sign-in and purchases.',
    Boolean(supabaseConfigError));
    renderProducts();
    return;
  }
  const { data, error } = await supabase
    .from('store_items')
    .select('slug,title,description,category,price_eur_cents,stripe_price_id,coin_price,rive_asset_url,cross_app_reward_slug')
    .eq('is_active', true)
    .order('title');
  if (error) {
    state.products = getCachedCatalog();
    setStatus(state.products.length
      ? 'Offline: showing the saved catalog. Purchases require a connection.'
      : `Could not load the shop catalog: ${error.message}`,
    !state.products.length);
  } else {
    state.products = data;
    cacheCatalog(data);
  }
  renderProducts();
}

async function loadAccount() {
  if (!supabase || !state.user) {
    state.balance = supabase ? 0 : getLocalPreviewBalance();
    state.owned.clear();
    state.founderPass = false;
    renderBalance();
    renderProducts();
    return;
  }

  const [profileResult, collectionResult] = await Promise.all([
    supabase.from('profiles').select('viseu_coins,founder_pass').eq('id', state.user.id).maybeSingle(),
    supabase.from('user_collections').select('item_slug').eq('user_id', state.user.id)
  ]);
  if (profileResult.error) setStatus(`Could not load your Viseu Coins: ${profileResult.error.message}`, true);
  if (collectionResult.error) setStatus(`Could not load your collection: ${collectionResult.error.message}`, true);
  state.balance = Number(profileResult.data?.viseu_coins || 0);
  state.founderPass = Boolean(profileResult.data?.founder_pass);
  state.owned = new Set((collectionResult.data || []).map((item) => item.item_slug));
  if (state.founderPass) state.owned.add('founder-pass');
  renderBalance();
  renderProducts();
}

async function checkout(button, product) {
  if (!supabase) {
    setStatus(supabaseConfigError || 'Connect Supabase and Stripe to enable checkout.', true);
    return;
  }
  if (!state.user) {
    setStatus('Sign in before starting checkout.');
    document.querySelector('#studioShopAuthForm').hidden = false;
    document.querySelector('#studioShopEmail').focus();
    return;
  }
  setButtonLoading(button, true);
  setStatus(`Opening secure checkout for ${product.title}…`);
  try {
    const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
      body: { itemSlug: product.slug, userId: state.user.id }
    });
    if (error) {
      const response = error.context;
      if (response instanceof Response) {
        const detail = await response.clone().json().catch(() => null);
        if (typeof detail?.error === 'string') throw new Error(detail.error);
      }
      throw new Error(error.message);
    }
    if (!data?.url) throw new Error(data?.error || 'Checkout did not return a URL.');
    const checkoutUrl = new URL(data.url);
    if (checkoutUrl.protocol !== 'https:' || checkoutUrl.hostname !== 'checkout.stripe.com') {
      throw new Error('Checkout returned an unexpected destination.');
    }
    window.location.assign(checkoutUrl.href);
  } catch (error) {
    setStatus(error instanceof Error ? error.message : 'Could not start checkout.', true);
    setButtonLoading(button, false);
  }
}

async function purchaseWithCoins(button, product) {
  if (!supabase) {
    setStatus(supabaseConfigError || 'Sign in and connect Supabase to spend Viseu Coins.', true);
    return;
  }
  if (!state.user) {
    setStatus('Sign in before spending Viseu Coins.');
    document.querySelector('#studioShopAuthForm').hidden = false;
    document.querySelector('#studioShopEmail').focus();
    return;
  }
  setButtonLoading(button, true);
  setStatus(`Unlocking ${product.title}…`);
  try {
    const { error } = await supabase.rpc('purchase_store_item_with_coins', { p_item_slug: product.slug });
    if (error) throw new Error(error.message);
    setStatus(`${product.title} added to your collection.`);
    await loadAccount();
  } catch (error) {
    setStatus(error instanceof Error ? error.message : 'Could not complete the coin purchase.', true);
  } finally {
    if (button.isConnected) setButtonLoading(button, false);
  }
}

async function submitEmailLink(event) {
  event.preventDefault();
  const email = document.querySelector('#studioShopEmail').value.trim();
  if (!supabase) {
    setStatus(supabaseConfigError || 'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable sign-in.', true);
    return;
  }
  const button = event.currentTarget.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    });
    if (error) throw error;
    setStatus('Sign-in link sent. Check your email to continue.');
  } catch (error) {
    setStatus(error instanceof Error ? error.message : 'Could not send the sign-in link.', true);
  } finally {
    button.disabled = false;
  }
}

async function toggleAuth() {
  if (!supabase) {
    setStatus(supabaseConfigError || 'Add the Supabase URL and public anon key to enable shop accounts.', true);
    return;
  }
  if (state.user) {
    const { error } = await supabase.auth.signOut();
    if (error) setStatus(`Could not sign out: ${error.message}`, true);
    return;
  }
  const form = document.querySelector('#studioShopAuthForm');
  form.hidden = !form.hidden;
  if (!form.hidden) document.querySelector('#studioShopEmail').focus();
}

function openDrawer() {
  state.isOpen = true;
  state.drawer.hidden = false;
  document.body.style.overflow = 'hidden';
  state.trigger.setAttribute('aria-expanded', 'true');
  renderProducts();
  document.querySelector('#studioShopClose').focus();
}

function closeDrawer() {
  state.isOpen = false;
  state.drawer.hidden = true;
  document.body.style.overflow = '';
  state.trigger.setAttribute('aria-expanded', 'false');
  clearPreviews();
  state.trigger.focus();
}

function onDrawerKeydown(event) {
  if (event.key === 'Escape') {
    closeDrawer();
    return;
  }
  if (event.key !== 'Tab') return;
  const focusable = [...state.drawer.querySelectorAll('button:not(:disabled), input:not(:disabled), [href], [tabindex]:not([tabindex="-1"])')]
    .filter((element) => element.getClientRects().length > 0);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function showReturnMessage() {
  const params = new URLSearchParams(window.location.search);
  const result = params.get('studio_checkout');
  if (!result) return;
  if (result === 'success') setStatus('Payment received. Your collection updates after Stripe verifies the purchase.');
  if (result === 'cancelled') setStatus('Checkout cancelled. Nothing was charged.');
  params.delete('studio_checkout');
  params.delete('session_id');
  const query = params.toString();
  window.history.replaceState({}, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`);
}

export async function initializeStudioShop() {
  state.trigger = document.querySelector('#studioShopOpen');
  state.drawer = document.querySelector('#studioShopDrawer');
  state.status = document.querySelector('#studioShopStatus');
  state.productsNode = document.querySelector('#studioShopProducts');

  state.trigger.addEventListener('click', openDrawer);
  document.querySelector('#studioShopClose').addEventListener('click', closeDrawer);
  state.drawer.addEventListener('click', (event) => {
    if (event.target === state.drawer) closeDrawer();
  });
  state.drawer.addEventListener('keydown', onDrawerKeydown);
  document.querySelector('#studioShopAuth').addEventListener('click', toggleAuth);
  document.querySelector('#studioShopAuthForm').addEventListener('submit', submitEmailLink);
  document.querySelector('.studio-categories').addEventListener('click', (event) => {
    const button = event.target.closest('button[data-category]');
    if (!button) return;
    state.category = button.dataset.category;
    document.querySelectorAll('.studio-category').forEach((pill) => {
      const active = pill === button;
      pill.classList.toggle('is-active', active);
      pill.setAttribute('aria-pressed', String(active));
    });
    renderProducts();
  });
  state.productsNode.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-shop-action]');
    if (!button) return;
    const product = state.products.find((item) => item.slug === button.dataset.slug);
    if (!product) {
      setStatus('That item is no longer available. Refresh the shop and try again.', true);
      return;
    }
    if (button.dataset.shopAction === 'checkout') void checkout(button, product);
    else void purchaseWithCoins(button, product);
  });

  if (supabase) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      state.user = session?.user || null;
      document.querySelector('#studioShopAuth').textContent = state.user ? 'Sign out' : 'Sign in';
      document.querySelector('#studioShopAuthForm').hidden = Boolean(state.user);
      setTimeout(() => { void loadAccount(); }, 0);
    });
    window.addEventListener('pagehide', () => subscription.unsubscribe(), { once: true });
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) setStatus(`Could not restore your sign-in: ${error.message}`, true);
    state.user = session?.user || null;
    document.querySelector('#studioShopAuth').textContent = state.user ? 'Sign out' : 'Sign in';
    await Promise.all([loadCatalog(), loadAccount()]);
  } else {
    await loadCatalog();
    document.querySelector('#studioShopAuth').textContent = 'Sign in';
  }
  showReturnMessage();
}
