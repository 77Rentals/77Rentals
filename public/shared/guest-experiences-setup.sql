-- Run this once in the Supabase SQL Editor for the "Nuestros huéspedes y sus
-- experiencias" guest board feature. See public/shared/supabase-config.js for
-- where the resulting project URL + anon key go.

create extension if not exists "pgcrypto";

create table public.guest_experiences (
  id uuid primary key default gen_random_uuid(),
  property text not null check (property in ('macondo', 'conquistador')),
  guest_name text not null,
  stay_start date not null,
  stay_end date not null,
  review_text text not null check (char_length(review_text) <= 1000),
  recommendations_text text check (recommendations_text is null or char_length(recommendations_text) <= 400),
  image_paths text[] not null default '{}',
  approved boolean not null default false,
  rejected boolean not null default false,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  hp_field text
);

create index guest_experiences_property_approved_idx
  on public.guest_experiences (property, approved, created_at desc);

alter table public.guest_experiences enable row level security;

-- Public (anon) can insert only a new, pending, non-approved row.
drop policy if exists "anon can insert pending submissions" on public.guest_experiences;
create policy "anon can insert pending submissions"
  on public.guest_experiences for insert to anon
  with check (
    approved = false
    and rejected = false
    and approved_at is null
    and (hp_field is null or hp_field = '')
  );

-- Public (anon) can read only approved rows.
drop policy if exists "anon can read approved submissions" on public.guest_experiences;
create policy "anon can read approved submissions"
  on public.guest_experiences for select to anon
  using (approved = true);

-- No anon update/delete policies exist — denied by default under RLS.

-- Admin (any authenticated user) can see and moderate everything.
drop policy if exists "authenticated can read all submissions" on public.guest_experiences;
create policy "authenticated can read all submissions"
  on public.guest_experiences for select to authenticated
  using (true);

drop policy if exists "authenticated can update submissions" on public.guest_experiences;
create policy "authenticated can update submissions"
  on public.guest_experiences for update to authenticated
  using (true) with check (true);

drop policy if exists "authenticated can delete submissions" on public.guest_experiences;
create policy "authenticated can delete submissions"
  on public.guest_experiences for delete to authenticated
  using (true);

-- ── Storage ──
-- Create a bucket named `guest-experience-photos` via the Supabase dashboard
-- (Storage → New bucket), mark it Public, then run these policies:

drop policy if exists "anon can upload guest photos" on storage.objects;
create policy "anon can upload guest photos"
  on storage.objects for insert to anon
  with check (bucket_id = 'guest-experience-photos');

drop policy if exists "anyone can view guest photos" on storage.objects;
create policy "anyone can view guest photos"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'guest-experience-photos');

drop policy if exists "authenticated can delete guest photos" on storage.objects;
create policy "authenticated can delete guest photos"
  on storage.objects for delete to authenticated
  using (bucket_id = 'guest-experience-photos');

-- ── Admin login ──
-- In Supabase Auth (Authentication → Users), manually add one user
-- (e.g. team@77rentals.com) with a password — this is the admin-experiencias.html
-- login. Then in Authentication → Settings, DISABLE public sign-ups, otherwise
-- anyone could self-register an "authenticated" account and pass the admin
-- policies above.
