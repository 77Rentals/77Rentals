-- Per-petition cap on a single signer's coefficient, to catch typos (e.g.
-- someone entering 18.5 instead of 0.185, or an area in m² by mistake).
-- Configurable per petition instead of hardcoded, since different buildings
-- have very different maximum unit coefficients.

alter table public.petitions add column if not exists max_coefficient_pct numeric(6, 3) not null default 100;

-- Delventto: no single unit has more than 1% of the building's coefficients.
update public.petitions set max_coefficient_pct = 1
where id = 'b39ac98a-b172-4e65-9df9-4629afd3b87f';

drop function if exists public.get_petition(uuid);
drop function if exists public.sign_petition(uuid, text, text, text, numeric, text, text, text, text);

create or replace function public.get_petition(p_id uuid)
returns table (
  id uuid,
  status text,
  title text,
  document_text text,
  threshold_pct numeric,
  max_coefficient_pct numeric,
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
    p.max_coefficient_pct,
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
  v_max_coefficient_pct numeric;
begin
  select status, max_coefficient_pct into v_status, v_max_coefficient_pct
  from public.petitions where id = p_id;

  if v_status is null then
    raise exception 'Esta solicitud no existe.';
  end if;

  if v_status <> 'open' then
    raise exception 'Esta solicitud ya fue cerrada y no admite más firmas.';
  end if;

  if p_coefficient_pct > v_max_coefficient_pct then
    raise exception 'El coeficiente ingresado (%) supera el máximo esperado (%) para esta copropiedad. Verifica el valor en tu certificado de tradición y libertad.', p_coefficient_pct, v_max_coefficient_pct;
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
