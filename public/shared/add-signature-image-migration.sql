-- Run once in the Supabase SQL Editor. Additive/idempotent -- safe to
-- re-run, does not drop or delete anything.
--
-- Adds a drawn-signature image (PNG data URL from a canvas signature pad)
-- alongside the existing typed-name signature, for both signing flows:
--   1. Galcol owner_signing_links (public, no-login links)
--   2. Partner Hub marketplace nda_signatures / contract_signatures

-- ── 1. Galcol owner_signing_links ──

alter table public.owner_signing_links
  add column if not exists signature_image text;

drop function if exists public.get_owner_signing_link(uuid);

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

drop function if exists public.sign_owner_signing_link(uuid, text, text, text, text, text, text, integer, text, text, text, text, text);

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

-- ── 2. Partner Hub marketplace: nda_signatures / contract_signatures ──

alter table public.nda_signatures add column if not exists signature_image text;
alter table public.contract_signatures add column if not exists signature_image text;

drop function if exists public.sign_nda(uuid, text, text);

create function public.sign_nda(p_offer_id uuid, p_signed_by text, p_signer_name text, p_signature_image text default null)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner_id uuid;
  v_other_signed boolean;
  v_new_status text;
begin
  if p_signed_by not in ('admin', 'owner') then
    raise exception 'invalid signed_by: %', p_signed_by;
  end if;

  select owner_id into v_owner_id from public.partner_offers where id = p_offer_id;
  if v_owner_id is null then
    raise exception 'offer not found';
  end if;

  if p_signed_by = 'admin' and not public.is_admin() then
    raise exception 'not authorized to sign as admin';
  end if;
  if p_signed_by = 'owner' and v_owner_id <> auth.uid() then
    raise exception 'not authorized to sign as this owner';
  end if;

  insert into public.nda_signatures (offer_id, signed_by, signer_name, signature_image)
  values (p_offer_id, p_signed_by, p_signer_name, p_signature_image);

  select exists (
    select 1 from public.nda_signatures
    where offer_id = p_offer_id
      and signed_by = (case when p_signed_by = 'admin' then 'owner' else 'admin' end)
  ) into v_other_signed;

  v_new_status := case when v_other_signed then 'both_signed' else p_signed_by || '_signed' end;

  update public.partner_offers set nda_status = v_new_status where id = p_offer_id;
  return v_new_status;
end;
$$;

grant execute on function public.sign_nda(uuid, text, text, text) to authenticated;

drop function if exists public.sign_contract(uuid, text, text, text, text, text);

create function public.sign_contract(
  p_offer_id uuid,
  p_signed_by text,
  p_signer_name text,
  p_signer_id_number text,
  p_contract_hash text,
  p_user_agent text,
  p_signature_image text default null
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner_id uuid;
  v_other_signed boolean;
  v_new_status text;
begin
  if p_signed_by not in ('admin', 'owner') then
    raise exception 'invalid signed_by: %', p_signed_by;
  end if;

  select owner_id into v_owner_id from public.partner_offers where id = p_offer_id;
  if v_owner_id is null then
    raise exception 'offer not found';
  end if;

  if p_signed_by = 'admin' and not public.is_admin() then
    raise exception 'not authorized to sign as admin';
  end if;
  if p_signed_by = 'owner' and v_owner_id <> auth.uid() then
    raise exception 'not authorized to sign as this owner';
  end if;

  insert into public.contract_signatures (offer_id, signed_by, signer_name, signer_id_number, contract_hash, user_agent, signature_image)
  values (p_offer_id, p_signed_by, p_signer_name, p_signer_id_number, p_contract_hash, p_user_agent, p_signature_image);

  select exists (
    select 1 from public.contract_signatures
    where offer_id = p_offer_id
      and signed_by = (case when p_signed_by = 'admin' then 'owner' else 'admin' end)
  ) into v_other_signed;

  v_new_status := case when v_other_signed then 'both_signed' else p_signed_by || '_signed' end;

  update public.partner_offers set contract_status = v_new_status where id = p_offer_id;
  return v_new_status;
end;
$$;

grant execute on function public.sign_contract(uuid, text, text, text, text, text, text) to authenticated;
