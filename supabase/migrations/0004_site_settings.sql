-- Editable homepage stat numbers (admin). Public read; admin writes via direct pg.
create table if not exists public.site_settings (
  key         text primary key,
  value       text,
  updated_at  timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "public read settings" on public.site_settings;
create policy "public read settings" on public.site_settings
  for select using (true);

insert into public.site_settings (key, value) values
  ('stat_guests', '2,000+'),
  ('stat_nationalities', '50+'),
  ('stat_rating', '4.9'),
  ('stat_years', '8+')
on conflict (key) do nothing;
