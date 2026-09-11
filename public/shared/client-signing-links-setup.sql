-- Run this once in the Supabase SQL Editor, in the same project as
-- partner-hub-setup.sql (reuses public.is_admin() defined there).
--
-- Purpose: let 77Rentals send a CLIENT (e.g. a corporate client like
-- Galcol S.A.S., not an apartment owner) a single public link to review and
-- sign a contract or otrosí, WITHOUT the client creating any account or
-- logging in. Unlike owner_signing_links (which fills in a fixed template),
-- the admin pastes the exact contract text when creating the link, since
-- every client contract is bespoke. The link's UUID is the only
-- "credential" -- unguessable, but treat it like a bearer token.
--
-- Security model mirrors owner_signing_links:
--   - The base table has policies only for admins (direct table access, to
--     create/list/edit links from the Admin dashboard).
--   - The client-facing page never talks to the table directly. It calls
--     two SECURITY DEFINER functions instead, granted EXECUTE to anon:
--       * get_client_signing_link(id)   -- read one row by its exact id
--       * sign_client_signing_link(...) -- fill in the client's fields,
--         once (raises an error if already signed).
--
-- Safe to re-run from scratch (drops its own objects first). Do NOT re-run
-- after real signatures exist -- it will delete them.

drop function if exists public.sign_client_signing_link(uuid, text, text, text, text, text, text, text);
drop function if exists public.get_client_signing_link(uuid);
drop table if exists public.client_signing_links cascade;

create table public.client_signing_links (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'pending' check (status in ('pending', 'signed')),
  title text not null,
  contract_text text not null,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  -- Filled in by the client at signing time
  client_name text,
  client_id_number text,
  client_contact_email text,
  client_contact_phone text,
  signature_image text,
  contract_hash text,
  user_agent text,
  signed_at timestamptz
);

create index client_signing_links_status_idx on public.client_signing_links (status);

alter table public.client_signing_links enable row level security;

-- Only admins can create/list/edit links, from the Admin dashboard.
create policy "admin can read client signing links"
  on public.client_signing_links for select to authenticated
  using (public.is_admin());

create policy "admin can create client signing links"
  on public.client_signing_links for insert to authenticated
  with check (public.is_admin());

-- Admins may only edit the contract text/title while a link is still
-- pending -- once signed, the row is write-once from the app's perspective
-- (matches the immutability the signing RPC enforces for the signature
-- itself).
create policy "admin can update pending client signing links"
  on public.client_signing_links for update to authenticated
  using (public.is_admin() and status = 'pending')
  with check (public.is_admin());

create policy "admin can delete pending client signing links"
  on public.client_signing_links for delete to authenticated
  using (public.is_admin() and status = 'pending');

-- ── Public, token-gated access functions ──

create function public.get_client_signing_link(p_id uuid)
returns table (
  id uuid,
  status text,
  title text,
  contract_text text,
  client_name text,
  signed_at timestamptz,
  signature_image text
)
language sql
security definer
stable
set search_path = public
as $$
  select l.id, l.status, l.title, l.contract_text, l.client_name, l.signed_at, l.signature_image
  from public.client_signing_links l
  where l.id = p_id;
$$;

grant execute on function public.get_client_signing_link(uuid) to anon, authenticated;

create function public.sign_client_signing_link(
  p_id uuid,
  p_client_name text,
  p_client_id_number text,
  p_client_contact_email text,
  p_client_contact_phone text,
  p_signature_image text,
  p_contract_hash text,
  p_user_agent text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.client_signing_links
  set status = 'signed',
      client_name = p_client_name,
      client_id_number = p_client_id_number,
      client_contact_email = p_client_contact_email,
      client_contact_phone = p_client_contact_phone,
      signature_image = p_signature_image,
      contract_hash = p_contract_hash,
      user_agent = p_user_agent,
      signed_at = now()
  where id = p_id and status = 'pending';

  if not found then
    raise exception 'Este link ya fue firmado o no existe.';
  end if;
end;
$$;

grant execute on function public.sign_client_signing_link(uuid, text, text, text, text, text, text, text) to anon, authenticated;

-- ── Base table privileges ──
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.client_signing_links to authenticated;
