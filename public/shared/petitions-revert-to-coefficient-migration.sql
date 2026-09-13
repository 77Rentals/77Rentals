-- Revert petitions from "Tipo de Propiedad (A/B/C/D) + apartment count"
-- back to the coefficient percentage, now that the signing form explains
-- where to find it (certificado de tradición y libertad / reglamento de
-- propiedad horizontal). Re-adds cumulative percentage tracking against a
-- per-petition threshold.

drop function if exists public.sign_petition(uuid, text, text, text, text, integer, text, text, text, text);
drop function if exists public.get_petition(uuid);
drop function if exists public.get_petition_roster(uuid);

alter table public.petition_signatures drop column if exists property_type;
alter table public.petition_signatures drop column if exists apartment_count;

-- Add nullable first, since any pre-existing rows (e.g. leftover test
-- signatures from the A/B/C/D version) have no coefficient value — a plain
-- NOT NULL column add fails on those. They predate the coefficient model
-- entirely, so they're stale test data rather than something to backfill.
alter table public.petition_signatures add column if not exists coefficient_pct numeric(6, 3);
delete from public.petition_signatures where coefficient_pct is null;
alter table public.petition_signatures alter column coefficient_pct set not null;
alter table public.petition_signatures
  add constraint petition_signatures_coefficient_pct_check check (coefficient_pct > 0 and coefficient_pct <= 100);

alter table public.petitions add column if not exists threshold_pct numeric(6, 3) not null default 20;

create or replace function public.get_petition(p_id uuid)
returns table (
  id uuid,
  status text,
  title text,
  document_text text,
  threshold_pct numeric,
  signed_count bigint,
  total_coefficient_pct numeric,
  roster_public boolean
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
    coalesce(s.total_coefficient_pct, 0),
    p.roster_public
  from public.petitions p
  left join (
    select petition_id, count(*) as signed_count, sum(coefficient_pct) as total_coefficient_pct
    from public.petition_signatures
    group by petition_id
  ) s on s.petition_id = p.id
  where p.id = p_id;
$$;

grant execute on function public.get_petition(uuid) to anon, authenticated;

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

create or replace function public.get_petition_roster(p_id uuid)
returns table (
  unit_number text,
  signer_name text,
  coefficient_pct numeric,
  signed_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select s.unit_number, s.signer_name, s.coefficient_pct, s.signed_at
  from public.petition_signatures s
  join public.petitions p on p.id = s.petition_id
  where p.id = p_id and p.roster_public = true
  order by s.unit_number;
$$;

grant execute on function public.get_petition_roster(uuid) to anon, authenticated;
