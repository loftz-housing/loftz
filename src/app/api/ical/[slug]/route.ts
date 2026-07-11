import { supabase } from "@/lib/supabase";
import { buildIcs, type BusyEvent } from "@/lib/ical";

// Per-room iCal export feed: loftz.net/api/ical/{room-slug}.ics
// Serves the room's merged busy periods so OTAs can subscribe.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug: raw } = await params;
  const slug = raw.replace(/\.ics$/i, "");

  const { data: room } = await supabase
    .from("rooms")
    .select("id, name, residence:residences(name)")
    .eq("slug", slug)
    .maybeSingle();

  if (!room) return new Response("Not found", { status: 404 });

  const { data: avail } = await supabase
    .from("availability")
    .select("start_date, end_date, summary")
    .eq("room_id", room.id)
    .order("start_date");

  const events: BusyEvent[] = (avail ?? []).map((a) => ({
    start: a.start_date,
    end: a.end_date,
    summary: a.summary ?? "Booked",
  }));

  const residenceName = (room.residence as { name?: string } | null)?.name ?? "LOFTZ";
  const ics = buildIcs({ name: `LOFTZ · ${residenceName} · ${room.name}`, events });

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `inline; filename="${slug}.ics"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
