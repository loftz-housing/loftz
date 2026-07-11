import Link from "next/link";
import { query } from "@/lib/admin-db";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [counts] = await query<{ residences: string; rooms: string; new_requests: string }>(
    `select
       (select count(*) from residences) as residences,
       (select count(*) from rooms) as rooms,
       (select count(*) from requests where status='new') as new_requests`
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
    </div>
  );
}
