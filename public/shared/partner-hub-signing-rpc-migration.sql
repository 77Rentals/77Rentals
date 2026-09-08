-- Run once in the Supabase SQL Editor, in the same project as
-- partner-hub-setup.sql. Additive only -- does not drop any table or delete
-- any rows.
--
-- Bug fixed: when an OWNER signed the NDA or contract before the admin did,
-- the signature row inserted fine (owners have insert rights on
-- nda_signatures/contract_signatures), but the subsequent
-- `update partner_offers set nda_status = ...` from the client silently
-- affected 0 rows -- there was no RLS policy letting an owner update
-- partner_offers at all (only "admin can update offers" existed). Supabase
-- doesn't error on a 0-row update, so the UI showed success while the
-- status stayed stuck at its old value forever, and the "both signed"
-- reveal (owner contact info, WhatsApp link) never appeared for the owner.
-- Separately, the client-side status logic mislabeled "owner signed, admin
-- hasn't yet" as 'not_started' instead of a real "owner signed" state.
--
-- Fix: two SECURITY DEFINER RPC functions do the insert + status recompute
-- together, authorizing each call explicitly instead of relying on a
-- broader UPDATE policy. Status is always recomputed from the actual
-- signature rows in the same transaction, so it can never drift or race.

alter table public.partner_offers drop constraint if exists partner_offers_nda_status_check;
alter table public.partner_offers add constraint partner_offers_nda_status_check
  check (nda_status in ('not_started', 'admin_signed', 'owner_signed', 'both_signed'));

alter table public.partner_offers drop constraint if exists partner_offers_contract_status_check;
alter table public.partner_offers add constraint partner_offers_contract_status_check
  check (contract_status in ('not_started', 'admin_signed', 'owner_signed', 'both_signed'));

drop function if exists public.sign_nda(uuid, text, text);

create function public.sign_nda(p_offer_id uuid, p_signed_by text, p_signer_name text)
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

  insert into public.nda_signatures (offer_id, signed_by, signer_name)
  values (p_offer_id, p_signed_by, p_signer_name);

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

grant execute on function public.sign_nda(uuid, text, text) to authenticated;

drop function if exists public.sign_contract(uuid, text, text, text, text, text);

create function public.sign_contract(
  p_offer_id uuid,
  p_signed_by text,
  p_signer_name text,
  p_signer_id_number text,
  p_contract_hash text,
  p_user_agent text
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

  insert into public.contract_signatures (offer_id, signed_by, signer_name, signer_id_number, contract_hash, user_agent)
  values (p_offer_id, p_signed_by, p_signer_name, p_signer_id_number, p_contract_hash, p_user_agent);

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

grant execute on function public.sign_contract(uuid, text, text, text, text, text) to authenticated;
