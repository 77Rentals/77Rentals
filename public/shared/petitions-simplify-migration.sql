-- Simplify petitions: drop coefficient-based tracking (owners rarely have
-- their exact % on hand) in favor of a plain signer headcount, and replace
-- the free-text coefficient input with a structured "Tipo de Propiedad"
-- (A/B/C/D) + apartment count per signer.

drop function if exists public.sign_petition(uuid, text, text, text, numeric, text, text, text, text);
drop function if exists public.get_petition(uuid);

alter table public.petition_signatures drop column if exists coefficient_pct;

alter table public.petition_signatures
  add column property_type text not null default 'A' check (property_type in ('A', 'B', 'C', 'D')),
  add column apartment_count integer not null default 1 check (apartment_count > 0);

alter table public.petition_signatures alter column property_type drop default;
alter table public.petition_signatures alter column apartment_count drop default;

alter table public.petitions drop column if exists threshold_pct;

-- Public, no-login read: the document text plus a live headcount, never the
-- individual signer rows (those stay admin-only via existing RLS policies).
create or replace function public.get_petition(p_id uuid)
returns table (
  id uuid,
  status text,
  title text,
  document_text text,
  signed_count bigint,
  total_apartments bigint
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
    coalesce(s.signed_count, 0),
    coalesce(s.total_apartments, 0)
  from public.petitions p
  left join (
    select petition_id, count(*) as signed_count, sum(apartment_count) as total_apartments
    from public.petition_signatures
    group by petition_id
  ) s on s.petition_id = p.id
  where p.id = p_id;
$$;

grant execute on function public.get_petition(uuid) to anon, authenticated;

-- Public, no-login signing: one row per unit, same duplicate-prevention as
-- before (unique(petition_id, unit_number)), now recording property type
-- and apartment count instead of a self-reported coefficient percentage.
create or replace function public.sign_petition(
  p_id uuid,
  p_unit_number text,
  p_signer_name text,
  p_signer_id_number text,
  p_property_type text,
  p_apartment_count integer,
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
      property_type, apartment_count, consent_method, signature_image, document_hash, user_agent
    ) values (
      p_id, upper(trim(p_unit_number)), p_signer_name, p_signer_id_number,
      p_property_type, p_apartment_count,
      coalesce(p_consent_method, 'Firma electrónica en línea (77Rentals)'),
      p_signature_image, p_document_hash, p_user_agent
    );
  exception when unique_violation then
    raise exception 'La unidad % ya firmó esta solicitud.', upper(trim(p_unit_number));
  end;
end;
$$;

grant execute on function public.sign_petition(
  uuid, text, text, text, text, integer, text, text, text, text
) to anon, authenticated;
