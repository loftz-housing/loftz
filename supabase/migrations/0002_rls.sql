-- Row Level Security (kickoff: "Enable RLS").
-- Catalog tables: public READ only. Guest data: NO public read/write — all writes
-- go through the submit_request() SECURITY DEFINER function (0003), because Phase 1
-- only has the publishable/anon key (no secret key captured).

alter table public.residences            enable row level security;
alter table public.rooms                  enable row level security;
alter table public.photos                 enable row level security;
alter table public.availability           enable row level security;
alter table public.eligibility_conditions enable row level security;
alter table public.guest_profiles         enable row level security;
alter table public.requests               enable row level security;

-- Public catalog: read-only for anon + authenticated. (idempotent)
drop policy if exists "public read residences" on public.residences;
create policy "public read residences" on public.residences
  for select using (true);
drop policy if exists "public read rooms" on public.rooms;
create policy "public read rooms" on public.rooms
  for select using (status = 'active');
drop policy if exists "public read photos" on public.photos;
create policy "public read photos" on public.photos
  for select using (true);
drop policy if exists "public read availability" on public.availability;
create policy "public read availability" on public.availability
  for select using (true);
drop policy if exists "public read eligibility" on public.eligibility_conditions;
create policy "public read eligibility" on public.eligibility_conditions
  for select using (true);

-- guest_profiles + requests: no policies at all → RLS denies all anon access.
-- Inserts happen only via submit_request() (definer, bypasses RLS).
