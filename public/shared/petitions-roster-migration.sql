-- Public transparency roster for petitions: a separate, name+unit-only
-- listing of who has signed (no signature images, no cédula, no consent
-- method/IP/user-agent), gated by a per-petition flag so it can be turned
-- off later without touching the signing link itself.

alter table public.petitions add column if not exists roster_public boolean not null default true;

-- get_petition now also reports whether the roster is public, so the
-- signing page can decide whether to show a "Ver firmantes" link.
drop function if exists public.get_petition(uuid);

create or replace function public.get_petition(p_id uuid)
returns table (
  id uuid,
  status text,
  title text,
  document_text text,
  signed_count bigint,
  total_apartments bigint,
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
    coalesce(s.signed_count, 0),
    coalesce(s.total_apartments, 0),
    p.roster_public
  from public.petitions p
  left join (
    select petition_id, count(*) as signed_count, sum(apartment_count) as total_apartments
    from public.petition_signatures
    group by petition_id
  ) s on s.petition_id = p.id
  where p.id = p_id;
$$;

grant execute on function public.get_petition(uuid) to anon, authenticated;

-- Public, no-login roster read. Column-whitelisted on purpose: never expose
-- signer_id_number, signature_image, consent_method, or user_agent here —
-- those stay admin-only via the existing RLS policies on the base table.
create or replace function public.get_petition_roster(p_id uuid)
returns table (
  unit_number text,
  signer_name text,
  property_type text,
  apartment_count integer,
  signed_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select s.unit_number, s.signer_name, s.property_type, s.apartment_count, s.signed_at
  from public.petition_signatures s
  join public.petitions p on p.id = s.petition_id
  where p.id = p_id and p.roster_public = true
  order by s.unit_number;
$$;

grant execute on function public.get_petition_roster(uuid) to anon, authenticated;
