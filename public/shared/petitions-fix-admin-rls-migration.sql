-- Fix admin RLS on petitions/petition_signatures: they were written with
-- auth.role() = 'authenticated' (true for ANY logged-in user), instead of
-- this project's actual admin-check convention, public.is_admin() (checks
-- membership in the admins table), used by every other admin-only table.
-- This mismatch is what made the Admin Dashboard's petitions list fail to
-- load.

drop policy if exists "Admins manage petitions" on public.petitions;
drop policy if exists "Admins read petition signatures" on public.petition_signatures;
drop policy if exists "Admins delete petition signatures" on public.petition_signatures;

create policy "admin can manage petitions"
  on public.petitions for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin can read petition signatures"
  on public.petition_signatures for select to authenticated
  using (public.is_admin());

create policy "admin can delete petition signatures"
  on public.petition_signatures for delete to authenticated
  using (public.is_admin());
