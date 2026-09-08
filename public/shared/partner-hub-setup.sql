-- Run this once in the Supabase SQL Editor for the Partner Hub feature.
-- This is a NEW, DEDICATED Supabase project (separate from the guest-experiences
-- board project) — see src/lib/supabaseClient.ts for where the resulting
-- project URL + anon key go (via VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY env vars).
--
-- Architecture notes:
--   - Real users (admins AND owners) are Supabase Auth users. Owners self-register
--     (sign-up stays ENABLED in Auth settings — unlike the guest-experiences project).
--   - "Admin" is NOT a role anyone can claim at signup. It is controlled entirely by
--     membership in the `admins` table below, which only we can edit (via SQL editor
--     or dashboard). A self-registered owner can never become admin by themselves.
--   - New owners start with owner_profiles.approved = false. They cannot browse
--     requirements or submit offers until an admin flips that flag to true.
--
-- Safe to re-run from scratch: this script drops its own tables/functions first
-- (in dependency order), so you can paste and run the whole file again if you
-- need to change something during setup. Do NOT re-run this after real data
-- exists — it will delete it.

create extension if not exists "pgcrypto";

-- ── Reset (idempotent re-run support) ──
drop table if exists public.contract_signatures cascade;
drop table if exists public.nda_signatures cascade;
drop table if exists public.partner_offers cascade;
drop table if exists public.partner_requirements cascade;
drop table if exists public.owner_properties cascade;
drop table if exists public.owner_profiles cascade;
drop table if exists public.admins cascade;
drop function if exists public.is_admin();
drop function if exists public.is_approved_owner();
drop function if exists public.protect_owner_approval();

-- ── Admins allowlist ──
-- After creating your admin account in Authentication → Users, find its UUID
-- and insert it here: insert into public.admins (user_id) values ('<uuid>');
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Only admins can see who else is an admin. No insert/update/delete policies for
-- anon/authenticated — managed exclusively via the Supabase dashboard/SQL editor.
create policy "admins can read admins"
  on public.admins for select to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- ── owner_profiles ──
-- One row per owner, id = their auth.users id. Created on first login/signup.
-- (Created before the helper functions below, since is_approved_owner() reads it.)

create table public.owner_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  phone text not null,
  email text not null,
  del_venttto_id text not null default '',
  approved boolean not null default false,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Helper functions (used by RLS policies below) ──

create function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

create function public.is_approved_owner()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.owner_profiles o
    where o.id = auth.uid() and o.approved = true
  );
$$;

-- ── owner_profiles RLS ──

alter table public.owner_profiles enable row level security;

create policy "owner can read own profile"
  on public.owner_profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());

create policy "owner can insert own profile"
  on public.owner_profiles for insert to authenticated
  with check (id = auth.uid() and approved = false);

-- Owners can update their own profile at any time (name/phone/etc), but a
-- trigger below strips out any change to approved/approved_at unless the
-- actor is an admin -- so an owner can never self-approve by just re-saving
-- their profile with approved: true in the payload.
create policy "owner can update own profile"
  on public.owner_profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "admin can update any profile"
  on public.owner_profiles for update to authenticated
  using (public.is_admin())
  with check (true);

create function public.protect_owner_approval()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    new.approved := old.approved;
    new.approved_at := old.approved_at;
  end if;
  return new;
end;
$$;

create trigger protect_owner_approval_trigger
  before update on public.owner_profiles
  for each row execute function public.protect_owner_approval();

-- ── owner_properties ──

create table public.owner_properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  property_name text not null,
  apartment_type text not null check (apartment_type in ('Tipo A', 'Tipo B', 'Tipo C', 'Tipo D')),
  google_drive_link text not null,
  ical_link text,
  -- Listing details (self-serve "register and offer" flow, auto-live once the
  -- owner account is approved -- no separate per-listing review step).
  city text not null default '',
  address text not null default '',
  max_guests integer not null default 1 check (max_guests > 0),
  bedrooms integer not null default 1 check (bedrooms >= 0),
  bathrooms integer not null default 1 check (bathrooms >= 0),
  nightly_rate numeric check (nightly_rate is null or nightly_rate >= 0),
  description text not null default '',
  amenities text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index owner_properties_owner_idx on public.owner_properties (owner_id);

alter table public.owner_properties enable row level security;

create policy "owner can manage own properties"
  on public.owner_properties for all to authenticated
  using (owner_id = auth.uid() and public.is_approved_owner())
  with check (owner_id = auth.uid() and public.is_approved_owner());

create policy "admin can read all properties"
  on public.owner_properties for select to authenticated
  using (public.is_admin());

-- ── partner_requirements ──
-- Guest requirements posted by admin.

create table public.partner_requirements (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  guest_count integer not null check (guest_count > 0),
  check_in_date date not null,
  check_out_date date not null check (check_out_date > check_in_date),
  budget numeric not null check (budget >= 0),
  notes text not null default '',
  city text not null,
  status text not null default 'open' check (status in ('open', 'successful', 'cancelled')),
  allowed_apartment_types text[] not null default '{}',
  commission_type text not null check (commission_type in ('fixed', 'markup')),
  commission_value numeric,
  admin_contact_name text not null,
  admin_contact_phone text not null,
  admin_contact_email text not null
);

create index partner_requirements_status_idx on public.partner_requirements (status, created_at desc);

alter table public.partner_requirements enable row level security;

create policy "admin can manage requirements"
  on public.partner_requirements for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Approved owners can read all requirements (any status), not just open ones --
-- the app filters to 'open' client-side for the browse view.
create policy "approved owner can read requirements"
  on public.partner_requirements for select to authenticated
  using (public.is_approved_owner());

-- ── partner_offers ──
-- Owner responses to a requirement (PartnershipResponse in the app's TypeScript types).

create table public.partner_offers (
  id uuid primary key default gen_random_uuid(),
  requirement_id uuid not null references public.partner_requirements (id) on delete cascade,
  owner_id uuid not null references auth.users (id),
  property_id uuid references public.owner_properties (id),
  -- Snapshot of the property name at offer time (not a live join) so the
  -- offer keeps its original label even if the owner later renames/deletes
  -- the property -- same denormalized behavior the old localStorage MVP had.
  property_name text not null,
  proposed_price numeric not null check (proposed_price >= 0),
  cleaning_fee numeric not null check (cleaning_fee >= 0),
  commission_percent numeric not null,
  commission_amount numeric not null,
  final_price numeric not null,
  apartment_type text not null check (apartment_type in ('Tipo A', 'Tipo B', 'Tipo C', 'Tipo D')),
  torre_apartamento text not null,
  google_drive_link text not null,
  apartment_bio text not null default '',
  notes text not null default '',
  owner_contact_name text not null,
  owner_contact_phone text not null,
  owner_contact_email text not null,
  ical_link text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  rejection_note text,
  responded_at timestamptz not null default now(),
  nda_status text not null default 'not_started' check (nda_status in ('not_started', 'admin_signed', 'both_signed')),
  contract_status text not null default 'not_started' check (contract_status in ('not_started', 'admin_signed', 'both_signed'))
);

create index partner_offers_requirement_idx on public.partner_offers (requirement_id);
create index partner_offers_owner_idx on public.partner_offers (owner_id);

alter table public.partner_offers enable row level security;

create policy "owner can insert own offers"
  on public.partner_offers for insert to authenticated
  with check (owner_id = auth.uid() and public.is_approved_owner());

create policy "owner can read own offers"
  on public.partner_offers for select to authenticated
  using (owner_id = auth.uid() or public.is_admin());

create policy "admin can update offers"
  on public.partner_offers for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ── nda_signatures ──

create table public.nda_signatures (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references public.partner_offers (id) on delete cascade,
  signed_by text not null check (signed_by in ('admin', 'owner')),
  signer_name text not null,
  signed_at timestamptz not null default now()
);

create index nda_signatures_offer_idx on public.nda_signatures (offer_id);

alter table public.nda_signatures enable row level security;

create policy "party to offer can read nda signatures"
  on public.nda_signatures for select to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.partner_offers o
      where o.id = offer_id and o.owner_id = auth.uid()
    )
  );

create policy "admin can insert admin signature"
  on public.nda_signatures for insert to authenticated
  with check (signed_by = 'admin' and public.is_admin());

create policy "owner can insert own signature"
  on public.nda_signatures for insert to authenticated
  with check (
    signed_by = 'owner'
    and exists (
      select 1 from public.partner_offers o
      where o.id = offer_id and o.owner_id = auth.uid()
    )
  );

-- ── contract_signatures ──
-- Signatures for the Contrato de Arriendo a Tarifa Fija. Mirrors
-- nda_signatures but carries a signer ID number and a SHA-256 hash of the
-- exact contract text the signer agreed to, for evidentiary weight (Ley 527
-- de 1999) given this contract creates payment/penalty obligations. No
-- update/delete policies are defined on purpose -- a signature row is
-- write-once, so it can never be silently altered after the fact.

create table public.contract_signatures (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references public.partner_offers (id) on delete cascade,
  signed_by text not null check (signed_by in ('admin', 'owner')),
  signer_name text not null,
  signer_id_number text not null,
  contract_hash text not null,
  user_agent text,
  signed_at timestamptz not null default now()
);

create index contract_signatures_offer_idx on public.contract_signatures (offer_id);

alter table public.contract_signatures enable row level security;

create policy "party to offer can read contract signatures"
  on public.contract_signatures for select to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.partner_offers o
      where o.id = offer_id and o.owner_id = auth.uid()
    )
  );

create policy "admin can insert admin contract signature"
  on public.contract_signatures for insert to authenticated
  with check (signed_by = 'admin' and public.is_admin());

create policy "owner can insert own contract signature"
  on public.contract_signatures for insert to authenticated
  with check (
    signed_by = 'owner'
    and exists (
      select 1 from public.partner_offers o
      where o.id = offer_id and o.owner_id = auth.uid()
    )
  );

-- ── Base table/function privileges ──
-- "Automatically expose new tables" was left OFF when this project was created
-- (a deliberate security choice), which also means Postgres does NOT auto-grant
-- baseline SELECT/INSERT/UPDATE/DELETE to the authenticated role on new tables.
-- Without these grants, requests fail with "permission denied for table" before
-- RLS policies are even evaluated -- RLS is still the real per-row security
-- boundary, this just unlocks the table for it to apply to.
grant usage on schema public to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant execute on all functions in schema public to authenticated;

-- ── Storage ──
-- Optional: create a bucket named `partner-hub-photos` (Storage → New bucket, Public)
-- if/when we replace Google Drive links with real uploads. Policies:
--
-- create policy "owner can upload property photos"
--   on storage.objects for insert to authenticated
--   with check (bucket_id = 'partner-hub-photos' and public.is_approved_owner());
--
-- create policy "anyone can view property photos"
--   on storage.objects for select to authenticated
--   using (bucket_id = 'partner-hub-photos');

-- ── Setup checklist ──
-- 1. Run this whole file in the SQL Editor.
-- 2. Authentication → Providers: enable Email, keep "Confirm email" ON.
-- 3. Authentication → Settings: leave public sign-ups ENABLED (owners self-register).
-- 4. Create your own admin account by signing up normally through the app once
--    deployed, OR add one manually under Authentication → Users.
-- 5. Copy that user's UUID and run:
--      insert into public.admins (user_id) values ('<paste-uuid-here>');
-- 6. Copy Project URL + anon public key into your .env (see .env.example).
