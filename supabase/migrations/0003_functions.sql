-- submit_request(): atomic guest-profile + request insert, callable by anon.
-- SECURITY DEFINER so it can write to RLS-protected tables. Eligibility is
-- evaluated in the app (server) and passed in; we still store the verdict.

create or replace function public.submit_request(
  p_room_id            uuid,
  p_type               text,
  p_full_name          text,
  p_email              text,
  p_nationality        text default null,
  p_date_of_birth      date  default null,
  p_phone              text  default null,
  p_occupation         text  default null,
  p_gender             text  default null,
  p_check_in           date  default null,
  p_check_out          date  default null,
  p_visit_at           timestamptz default null,
  p_message            text  default null,
  p_accepted_house_rules boolean default false,
  p_eligibility_passed boolean default null,
  p_eligibility_notes  text  default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile_id uuid;
  v_request_id uuid;
begin
  if p_type not in ('booking', 'visit') then
    raise exception 'invalid request type: %', p_type;
  end if;
  if p_full_name is null or length(trim(p_full_name)) = 0 then
    raise exception 'full_name is required';
  end if;
  if p_email is null or p_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'valid email is required';
  end if;

  insert into public.guest_profiles
    (full_name, nationality, date_of_birth, email, phone, occupation, gender)
  values
    (trim(p_full_name), p_nationality, p_date_of_birth, lower(trim(p_email)),
     p_phone, p_occupation, p_gender)
  returning id into v_profile_id;

  insert into public.requests
    (room_id, guest_profile_id, type, check_in, check_out, visit_at, message,
     accepted_house_rules, eligibility_passed, eligibility_notes)
  values
    (p_room_id, v_profile_id, p_type, p_check_in, p_check_out, p_visit_at,
     p_message, p_accepted_house_rules, p_eligibility_passed, p_eligibility_notes)
  returning id into v_request_id;

  return v_request_id;
end;
$$;

revoke all on function public.submit_request from public;
grant execute on function public.submit_request to anon, authenticated;

-- Lightweight stats for the homepage numbers block (public read).
create or replace function public.site_stats()
returns table (residences bigint, rooms bigint, neighborhoods bigint)
language sql
stable
security definer
set search_path = public
as $$
  select
    (select count(*) from public.residences),
    (select count(*) from public.rooms where status = 'active'),
    (select count(distinct neighborhood) from public.residences where neighborhood is not null);
$$;

revoke all on function public.site_stats from public;
grant execute on function public.site_stats to anon, authenticated;
