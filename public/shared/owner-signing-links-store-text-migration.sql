-- Run once in the Supabase SQL Editor. Additive only -- does NOT drop the
-- table or delete any existing rows (unlike owner-signing-links-setup.sql).
--
-- Fixes a bug: reopening an already-signed link regenerated the contract/NDA
-- text from partial data, so the "Descargar" buttons could show blank/
-- placeholder fields (cédula, contact info) instead of what was actually
-- signed. Now the exact signed text is stored once and always redisplayed
-- verbatim.

alter table public.owner_signing_links
  add column if not exists contract_text text,
  add column if not exists nda_text text;

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
  nda_text text
)
language sql
security definer
stable
set search_path = public
as $$
  select l.id, l.unit_type, l.status, l.owner_name, l.building_name,
         l.apartment_number, l.unit_count, l.signed_at, l.contract_text, l.nda_text
  from public.owner_signing_links l
  where l.id = p_id;
$$;

grant execute on function public.get_owner_signing_link(uuid) to anon, authenticated;

drop function if exists public.sign_owner_signing_link(uuid, text, text, text, text, text, text, integer, text, text, text);

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
  p_nda_text text
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
      signed_at = now()
  where id = p_id and status = 'pending';

  if not found then
    raise exception 'Este link ya fue firmado o no existe.';
  end if;
end;
$$;

grant execute on function public.sign_owner_signing_link(uuid, text, text, text, text, text, text, integer, text, text, text, text, text) to anon, authenticated;
