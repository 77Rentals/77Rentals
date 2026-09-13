-- Fix 403 Forbidden on petitions/petition_signatures for the admin: these
-- tables had RLS policies but were missing the underlying GRANT to the
-- `authenticated` role (every other admin table in this project — e.g.
-- client_signing_links — has this explicitly). Without the GRANT, Postgres
-- rejects the query before RLS is even evaluated, which PostgREST surfaces
-- as 403 Forbidden rather than an empty result set.

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.petitions to authenticated;
grant select, delete on public.petition_signatures to authenticated;
