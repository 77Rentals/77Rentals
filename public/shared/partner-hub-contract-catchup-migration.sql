-- Run once in the Supabase SQL Editor. Additive/idempotent -- safe to re-run,
-- does not drop or delete anything.
--
-- Your partner_offers table predates the Contract Signing feature: it has
-- nda_status but is missing contract_status entirely, and the
-- contract_signatures table was never created. This adds both, with the
-- widened status enum (includes 'owner_signed'), then (re)creates the
-- sign_nda / sign_contract RPC functions from
-- partner-hub-signing-rpc-migration.sql so they have something to point at.
--
-- Run this BEFORE (or instead of, since it's a superset) that migration.

-- ── partner_offers: add contract_status, widen both status enums ──

alter table public.partner_offers
  add column if not exists contract_status text not null default 'not_started';

alter table public.partner_offers drop constraint if exists partner_offers_nda_status_check;
alter table public.partner_offers add constraint partner_offers_nda_status_check
  check (nda_status in ('not_started', 'admin_signed', 'owner_signed', 'both_signed'));

alter table public.partner_offers drop constraint if exists partner_offers_contract_status_check;
alter table public.partner_offers add constraint partner_offers_contract_status_check
  check (contract_status in ('not_started', 'admin_signed', 'owner_signed', 'both_signed'));

-- ── contract_signatures (mirrors nda_signatures) ──

create table if not exists public.contract_signatures (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references public.partner_offers (id) on delete cascade,
  signed_by text not null check (signed_by in ('admin', 'owner')),
  signer_name text not null,
  signer_id_number text not null,
  contract_hash text not null,
  user_agent text,
  signed_at timestamptz not null default now()
);

create index if not exists contract_signatures_offer_idx on public.contract_signatures (offer_id);

alter table public.contract_signatures enable row level security;

drop policy if exists "party to offer can read contract signatures" on public.contract_signatures;
create policy "party to offer can read contract signatures"
  on public.contract_signatures for select to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.partner_offers o
      where o.id = offer_id and o.owner_id = auth.uid()
    )
  );

drop policy if exists "admin can insert admin contract signature" on public.contract_signatures;
create policy "admin can insert admin contract signature"
  on public.contract_signatures for insert to authenticated
  with check (signed_by = 'admin' and public.is_admin());

drop policy if exists "owner can insert own contract signature" on public.contract_signatures;
create policy "owner can insert own contract signature"
  on public.contract_signatures for insert to authenticated
  with check (
    signed_by = 'owner'
    and exists (
      select 1 from public.partner_offers o
      where o.id = offer_id and o.owner_id = auth.uid()
    )
  );

grant select, insert, update, delete on public.contract_signatures to authenticated;

-- ── Signing RPCs (same as partner-hub-signing-rpc-migration.sql) ──

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
