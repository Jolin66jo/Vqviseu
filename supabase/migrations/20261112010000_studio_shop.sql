create table if not exists public.store_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  category text not null check (category in ('founder_pass', 'grao_vasco_art_packs', 'streak_boosts', 'viseu_coins')),
  price_eur_cents integer check (price_eur_cents is null or price_eur_cents > 0),
  stripe_price_id text unique,
  coin_price integer check (coin_price is null or coin_price >= 0),
  rive_asset_url text,
  cross_app_reward_slug text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint store_items_exactly_one_price check (num_nonnulls(price_eur_cents, coin_price) = 1)
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  viseu_coins bigint not null default 0 check (viseu_coins >= 0),
  founder_pass boolean not null default false,
  streak_boosts integer not null default 0 check (streak_boosts >= 0),
  created_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists viseu_coins bigint not null default 0,
  add column if not exists founder_pass boolean not null default false,
  add column if not exists streak_boosts integer not null default 0;

create table if not exists public.user_collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_slug text not null references public.store_items(slug),
  stripe_session_id text unique,
  purchased_at timestamptz not null default now()
);

create index if not exists user_collections_user_id_idx
  on public.user_collections(user_id);

alter table public.store_items enable row level security;
alter table public.user_collections enable row level security;
alter table public.profiles enable row level security;

drop policy if exists "Active store items are readable" on public.store_items;
create policy "Active store items are readable"
  on public.store_items for select
  to anon, authenticated
  using (is_active);

drop policy if exists "Users read their own collections" on public.user_collections;
create policy "Users read their own collections"
  on public.user_collections for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users read their own store profile" on public.profiles;
create policy "Users read their own store profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

grant select on public.store_items to anon, authenticated;
grant select on public.user_collections, public.profiles to authenticated;

create or replace function public.ensure_store_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists ensure_store_profile_after_signup on auth.users;
create trigger ensure_store_profile_after_signup
  after insert on auth.users
  for each row execute function public.ensure_store_profile();

insert into public.profiles (id)
select id from auth.users
on conflict (id) do nothing;

create or replace function public.grant_store_item_reward(
  p_user_id uuid,
  p_reward_slug text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (p_user_id)
  on conflict (id) do nothing;

  if p_reward_slug = 'viseu-coins-100' then
    update public.profiles
    set viseu_coins = viseu_coins + 100
    where id = p_user_id;
  elsif p_reward_slug = 'founder-pass' then
    update public.profiles
    set founder_pass = true
    where id = p_user_id;
  elsif p_reward_slug = 'streak-boost' then
    update public.profiles
    set streak_boosts = streak_boosts + 1
    where id = p_user_id;
  end if;
end;
$$;

revoke all on function public.grant_store_item_reward(uuid, text) from public, anon, authenticated;

create or replace function public.fulfill_store_purchase(
  p_user_id uuid,
  p_item_slug text,
  p_stripe_session_id text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_reward_slug text;
  v_collection_id uuid;
begin
  if p_user_id is null or p_stripe_session_id is null or p_stripe_session_id = '' then
    raise exception 'A user and Stripe session are required';
  end if;

  select cross_app_reward_slug into v_reward_slug
  from public.store_items
  where slug = p_item_slug;

  if not found then
    raise exception 'Store item does not exist';
  end if;

  insert into public.user_collections (user_id, item_slug, stripe_session_id)
  values (p_user_id, p_item_slug, p_stripe_session_id)
  on conflict (stripe_session_id) do nothing
  returning id into v_collection_id;

  if v_collection_id is null then
    return false;
  end if;

  perform public.grant_store_item_reward(p_user_id, v_reward_slug);
  return true;
end;
$$;

revoke all on function public.fulfill_store_purchase(uuid, text, text) from public, anon, authenticated;
grant execute on function public.fulfill_store_purchase(uuid, text, text) to service_role;

create or replace function public.purchase_store_item_with_coins(p_item_slug text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_coin_price integer;
  v_reward_slug text;
  v_balance bigint;
begin
  if v_user_id is null then
    raise exception 'Sign in to spend Viseu Coins';
  end if;

  select coin_price, cross_app_reward_slug
  into v_coin_price, v_reward_slug
  from public.store_items
  where slug = p_item_slug and is_active;

  if not found or v_coin_price is null then
    raise exception 'This item cannot be purchased with Viseu Coins';
  end if;

  insert into public.profiles (id) values (v_user_id)
  on conflict (id) do nothing;

  update public.profiles
  set viseu_coins = viseu_coins - v_coin_price
  where id = v_user_id and viseu_coins >= v_coin_price
  returning viseu_coins into v_balance;

  if not found then
    raise exception 'Not enough Viseu Coins';
  end if;

  insert into public.user_collections (user_id, item_slug)
  values (v_user_id, p_item_slug);

  perform public.grant_store_item_reward(v_user_id, v_reward_slug);
  return jsonb_build_object('item_slug', p_item_slug, 'viseu_coins', v_balance);
end;
$$;

revoke all on function public.purchase_store_item_with_coins(text) from public, anon;
grant execute on function public.purchase_store_item_with_coins(text) to authenticated;

insert into public.store_items
  (slug, title, description, category, price_eur_cents, stripe_price_id, coin_price, rive_asset_url, cross_app_reward_slug)
values
  ('founder-pass', 'Founder Pass', 'A golden badge for the first Viseu Quest explorers.', 'founder_pass', 199, null, null, null, 'founder-pass'),
  ('grao-vasco-art-pack', 'Grão Vasco Art Pack', 'Museum-inspired colors for your next little adventure.', 'grao_vasco_art_packs', 299, null, null, null, 'grao-vasco-art-pack'),
  ('azulejo-board-theme', 'Azulejo Board Theme', 'Blue-and-white tilework for your game board.', 'grao_vasco_art_packs', null, null, 90, null, 'azulejo-board-theme'),
  ('streak-boost', 'Streak Boost', 'A little golden nudge to keep your streak going.', 'streak_boosts', null, null, 60, null, 'streak-boost'),
  ('viseu-coins-100', 'Viseu Coin Pack', 'Add 100 Viseu Coins to your Studio wallet.', 'viseu_coins', 199, null, null, null, 'viseu-coins-100')
on conflict (slug) do nothing;
