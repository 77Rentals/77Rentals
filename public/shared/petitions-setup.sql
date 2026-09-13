-- Multi-signer petitions (e.g. "Solicitud de Convocatoria de Asamblea
-- Extraordinaria" for a propiedad horizontal) — one shared public link,
-- many independent signers, each contributing their own unit/coefficient/
-- signature. Mirrors the SECURITY DEFINER RPC pattern used by
-- client_signing_links, but for a one-document-to-many-signers shape
-- instead of one-document-to-one-signer.

create table if not exists public.petitions (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'open' check (status in ('open', 'closed')),
  title text not null,
  document_text text not null,
  threshold_pct numeric(6, 3) not null default 20,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.petition_signatures (
  id uuid primary key default gen_random_uuid(),
  petition_id uuid not null references public.petitions(id) on delete cascade,
  unit_number text not null,
  signer_name text not null,
  signer_id_number text,
  coefficient_pct numeric(6, 3) not null check (coefficient_pct > 0 and coefficient_pct <= 100),
  consent_method text not null default 'Firma electrónica en línea (77Rentals)',
  signature_image text not null,
  document_hash text,
  user_agent text,
  signed_at timestamptz not null default now(),
  unique (petition_id, unit_number)
);

alter table public.petitions enable row level security;
alter table public.petition_signatures enable row level security;

-- Admin-only direct table access. Anon never touches these tables directly —
-- only through the two SECURITY DEFINER functions below.
create policy "Admins manage petitions" on public.petitions
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admins read petition signatures" on public.petition_signatures
  for select
  using (auth.role() = 'authenticated');

create policy "Admins delete petition signatures" on public.petition_signatures
  for delete
  using (auth.role() = 'authenticated');

-- Public, no-login read: the document text plus a live tally, never the
-- individual signer rows (those stay admin-only via RLS above).
create or replace function public.get_petition(p_id uuid)
returns table (
  id uuid,
  status text,
  title text,
  document_text text,
  threshold_pct numeric,
  signed_count bigint,
  total_coefficient_pct numeric
)
language sql
security definer
set search_path = public
as $$
  select
    p.id,
    p.status,
    p.title,
    p.document_text,
    p.threshold_pct,
    coalesce(s.signed_count, 0),
    coalesce(s.total_coefficient_pct, 0)
  from public.petitions p
  left join (
    select petition_id, count(*) as signed_count, sum(coefficient_pct) as total_coefficient_pct
    from public.petition_signatures
    group by petition_id
  ) s on s.petition_id = p.id
  where p.id = p_id;
$$;

grant execute on function public.get_petition(uuid) to anon, authenticated;

-- Public, no-login signing: one row per unit. The unique(petition_id,
-- unit_number) constraint is the only duplicate-prevention mechanism —
-- deliberately no upsert, so a second attempt is rejected rather than
-- silently overwriting a first signature.
create or replace function public.sign_petition(
  p_id uuid,
  p_unit_number text,
  p_signer_name text,
  p_signer_id_number text,
  p_coefficient_pct numeric,
  p_consent_method text,
  p_signature_image text,
  p_document_hash text,
  p_user_agent text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status text;
begin
  select status into v_status from public.petitions where id = p_id;

  if v_status is null then
    raise exception 'Esta solicitud no existe.';
  end if;

  if v_status <> 'open' then
    raise exception 'Esta solicitud ya fue cerrada y no admite más firmas.';
  end if;

  begin
    insert into public.petition_signatures (
      petition_id, unit_number, signer_name, signer_id_number,
      coefficient_pct, consent_method, signature_image, document_hash, user_agent
    ) values (
      p_id, upper(trim(p_unit_number)), p_signer_name, p_signer_id_number,
      p_coefficient_pct, coalesce(p_consent_method, 'Firma electrónica en línea (77Rentals)'),
      p_signature_image, p_document_hash, p_user_agent
    );
  exception when unique_violation then
    raise exception 'La unidad % ya firmó esta solicitud.', upper(trim(p_unit_number));
  end;
end;
$$;

grant execute on function public.sign_petition(
  uuid, text, text, text, numeric, text, text, text, text
) to anon, authenticated;
