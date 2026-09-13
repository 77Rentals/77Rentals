-- Make the coefficient percentage optional: some owners won't have it on
-- hand right away, and requiring it was blocking signatures. The headcount
-- (signed_count) already doesn't depend on it; total_coefficient_pct now
-- only sums the signers who provided one.

-- Reset test signers on the Delventto petition before relaxing the schema.
delete from public.petition_signatures
where petition_id = 'b39ac98a-b172-4e65-9df9-4629afd3b87f';

alter table public.petition_signatures drop constraint if exists petition_signatures_coefficient_pct_check;
alter table public.petition_signatures alter column coefficient_pct drop not null;
alter table public.petition_signatures
  add constraint petition_signatures_coefficient_pct_check
  check (coefficient_pct is null or (coefficient_pct > 0 and coefficient_pct <= 100));

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

  if p_coefficient_pct is not null and p_coefficient_pct > v_max_coefficient_pct then
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
