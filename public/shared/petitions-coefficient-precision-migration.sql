-- Coefficients in a reglamento de propiedad horizontal are usually stated
-- to 4 decimal places (e.g. 0.1514%) — numeric(6,3) was truncating that
-- precision. Widen to numeric(7,4): up to 100.0000%.

alter table public.petition_signatures alter column coefficient_pct type numeric(7, 4);
alter table public.petitions alter column max_coefficient_pct type numeric(7, 4);
alter table public.petitions alter column threshold_pct type numeric(7, 4);
