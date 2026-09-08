-- Run this once in the Supabase SQL Editor, in the SAME project as
-- partner-hub-setup.sql (this file reuses the public.is_admin() helper
-- function defined there — run that file first if you haven't).
--
-- Purpose: let 77Rentals send a property owner a single public link to
-- review and sign the Contrato de Arriendo a Tarifa Fija + NDA for the
-- Galcol booking (Tipo B / Tipo D units), WITHOUT the owner creating any
-- account or logging in. The link's UUID is the only "credential" -- it is
-- unguessable, but anyone holding it can view/sign that one record, so treat
-- it like a bearer token (send it privately, e.g. WhatsApp/email, not posted
-- publicly).
--
-- Security model:
--   - The base table has NO policies for the "anon" role at all -- it is only
--     reachable by admins (via is_admin()), directly from the app.
--   - The owner-facing page never talks to the table directly. It calls two
--     SECURITY DEFINER functions instead, granted EXECUTE to anon:
--       * get_owner_signing_link(id)   -- read one row by its exact id
--       * sign_owner_signing_link(...) -- fill in the owner's fields, once
--         (it raises an error if the link was already signed, so a stolen
--         or reused link can't silently overwrite a real signature).
--
-- Safe to re-run from scratch (drops its own objects first). Do NOT re-run
-- after real signatures exist -- it will delete them.

drop function if exists public.sign_owner_signing_link(uuid, text, text, text, text, text, text, integer, text, text, text, text, text, text);
drop function if exists public.get_owner_signing_link(uuid);
drop table if exists public.owner_signing_links cascade;

-- ── owner_signing_links ──

create table public.owner_signing_links (
  id uuid primary key default gen_random_uuid(),
  unit_type text not null check (unit_type in ('B', 'D')),
  status text not null default 'pending' check (status in ('pending', 'signed')),
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  -- Filled in by the owner at signing time
  owner_name text,
  owner_id_number text,
  owner_contact_email text,
  owner_contact_phone text,
  building_name text,
  apartment_number text,
  unit_count integer,
  contract_hash text,
  nda_hash text,
  -- The exact rendered contract/NDA text at signing time, stored verbatim so
  -- re-reading a signed link (e.g. a page reload) never has to regenerate
  -- the document from partial data -- and so contract_hash always matches
  -- exactly what's shown/downloaded, with no drift from "today's date"
  -- being re-evaluated on a later render.
  contract_text text,
  nda_text text,
  -- PNG data URL from the canvas signature pad, captured alongside the
  -- typed name for a more traditional "signed by hand" record.
  signature_image text,
  user_agent text,
  signed_at timestamptz
);

create index owner_signing_links_status_idx on public.owner_signing_links (status);

alter table public.owner_signing_links enable row level security;

-- Only admins can list/create links, from the Admin dashboard link generator.
-- No policies at all for anon/authenticated-non-admin -- all owner-facing
-- access goes through the SECURITY DEFINER functions below instead.
create policy "admin can read signing links"
  on public.owner_signing_links for select to authenticated
  using (public.is_admin());

create policy "admin can create signing links"
  on public.owner_signing_links for insert to authenticated
  with check (public.is_admin());

-- ── Public, token-gated access functions ──

-- Returns the public-safe state of one link for the owner-facing page.
-- Anyone who calls this without the exact (unguessable) id gets no rows.
create function public.get_owner_signing_link(p_id uuid)
returns table (
  id uuid,
  unit_type text,
  status text,
  owner_name text,
  building_name text,
  apartment_number text,
  unit_count integer,
  signed_at timestamptz,
  contract_text text,
  nda_text text,
  signature_image text
)
language sql
security definer
stable
set search_path = public
as $$
  select l.id, l.unit_type, l.status, l.owner_name, l.building_name,
         l.apartment_number, l.unit_count, l.signed_at, l.contract_text, l.nda_text,
         l.signature_image
  from public.owner_signing_links l
  where l.id = p_id;
$$;

grant execute on function public.get_owner_signing_link(uuid) to anon, authenticated;

-- Records the owner's signature. Only succeeds once per link (status must
-- still be 'pending'), so a link can never be re-signed with different data.
create function public.sign_owner_signing_link(
  p_id uuid,
  p_owner_name text,
  p_owner_id_number text,
  p_owner_contact_email text,
  p_owner_contact_phone text,
  p_building_name text,
  p_apartment_number text,
  p_unit_count integer,
  p_contract_hash text,
  p_nda_hash text,
  p_user_agent text,
  p_contract_text text,
  p_nda_text text,
  p_signature_image text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.owner_signing_links
  set status = 'signed',
      owner_name = p_owner_name,
      owner_id_number = p_owner_id_number,
      owner_contact_email = p_owner_contact_email,
      owner_contact_phone = p_owner_contact_phone,
      building_name = p_building_name,
      apartment_number = p_apartment_number,
      unit_count = p_unit_count,
      contract_hash = p_contract_hash,
      nda_hash = p_nda_hash,
      user_agent = p_user_agent,
      contract_text = p_contract_text,
      nda_text = p_nda_text,
      signature_image = p_signature_image,
      signed_at = now()
  where id = p_id and status = 'pending';

  if not found then
    raise exception 'Este link ya fue firmado o no existe.';
  end if;
end;
$$;

grant execute on function public.sign_owner_signing_link(uuid, text, text, text, text, text, text, integer, text, text, text, text, text, text) to anon, authenticated;

-- ── Base table privileges ──
-- Same reasoning as partner-hub-setup.sql: "Automatically expose new tables"
-- is off, so the authenticated role needs an explicit grant before RLS can
-- even apply. anon gets NO table grant -- it only ever goes through the two
-- functions above, which run as the function owner (security definer).
grant usage on schema public to authenticated;
grant select, insert on public.owner_signing_links to authenticated;
