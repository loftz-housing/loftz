import Link from "next/link";
import { query } from "@/lib/admin-db";

export const dynamic = "force-dynamic";

interface SyncRow {
  residence: string;
  room: string;
  has_feed: boolean;
  periods: string;
  last_synced: string | null;
}

function fmtDateTime(d: string | null) {
  return d ? new Date(d).toLocaleString("en-GB") : "—";
}

export default async function Dashboard() {
  const [counts] = await query<{ residences: string; rooms: string; new_requests: string }>(
    `select
       (select count(*) from residences) as residences,
       (select count(*) from rooms) as rooms,
       (select count(*) from requests where status='new') as new_requests`
  );

  // iCal sync status: busy-period count + last sync per room (availability rows
  // are re-created each nightly sync, so max(created_at) is the last-synced time).
  const sync = await query<SyncRow>(
    `select res.name as residence, rm.name as room,
            (rm.ical_url is not null) as has_feed,
            count(a.id) as periods, max(a.created_at) as last_synced
     from rooms rm
     join residences res on res.id = rm.residence_id
     left join availability a on a.room_id = rm.id
     group by res.name, rm.name, rm.ical_url, rm.sort_index
     having (rm.ical_url is not null) or count(a.id) > 0
     order by max(a.created_at) desc nulls last, res.name, rm.name`
  );
  const lastOverall = sync.reduce<string | null>(
    (acc, r) => (r.last_synced && (!acc || r.last_synced > acc) ? r.last_synced : acc),
    null
  );

  const tiles = [
    { label: "Residences", value: counts.residences, href: "/admin/residences" },
    { label: "Rooms", value: counts.rooms, href: "/admin/rooms" },
    { label: "New requests", value: counts.new_requests, href: "/admin/requests" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {tiles.map((t) => (
          <Link key={t.label} href={t.href} className="card p-6 hover:border-accent">
            <div className="font-display text-4xl font-semibold text-accent">{t.value}</div>
            <div className="mt-1 text-sm text-muted">{t.label}</div>
          </Link>
        ))}
      </div>

      <section className="mt-10">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-medium">iCal sync status</h2>
          <span className="text-xs text-muted">
            Last sync: {fmtDateTime(lastOverall)}
          </span>
        </div>
        <div className="card mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-2.5">Room</th>
                <th className="px-4 py-2.5">Feed</th>
                <th className="px-4 py-2.5">Busy periods</th>
                <th className="px-4 py-2.5">Last synced</th>
              </tr>
            </thead>
            <tbody>
              {sync.length === 0 && (
                <tr>
                  <td className="px-4 py-3 text-muted" colSpan={4}>
                    No feeds configured yet.
                  </td>
                </tr>
              )}
              {sync.map((r, i) => (
                <tr key={i} className="border-b border-line last:border-0">
                  <td className="px-4 py-2.5">
                    <span className="text-muted">{r.residence} · </span>
                    {r.room}
                  </td>
                  <td className="px-4 py-2.5">
                    {r.has_feed ? (
                      <span className="chip chip-accent">feed</span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">{r.periods}</td>
                  <td className="px-4 py-2.5 text-muted">{fmtDateTime(r.last_synced)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
