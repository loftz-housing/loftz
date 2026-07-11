-- replace_availability(): upsert a room's busy periods for one source (e.g.
-- 'google'). SECURITY DEFINER so the iCal sync (script + n8n) can write via the
-- anon/publishable key — no DB credential needed in n8n.
create or replace function public.replace_availability(
  p_room   uuid,
  p_source text,
  p_events jsonb
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  n integer;
begin
  delete from public.availability where room_id = p_room and source = p_source;

  insert into public.availability (room_id, start_date, end_date, source, summary)
  select
    p_room,
    (e->>'start')::date,
    (e->>'end')::date,
    p_source,
    e->>'summary'
  from jsonb_array_elements(coalesce(p_events, '[]'::jsonb)) e
  where (e->>'start') is not null and (e->>'end') is not null;

  get diagnostics n = row_count;
  return n;
end;
$$;

revoke all on function public.replace_availability from public;
grant execute on function public.replace_availability to anon, authenticated;
