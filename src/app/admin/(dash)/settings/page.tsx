import { query } from "@/lib/admin-db";
import { updateSettings } from "../../actions";

export const dynamic = "force-dynamic";

const FIELDS = [
  ["stat_guests", "Guests hosted"],
  ["stat_nationalities", "Nationalities"],
  ["stat_rating", "Average rating"],
  ["stat_years", "Years hosting"],
] as const;

export default async function AdminSettings({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const rows = await query<{ key: string; value: string }>(`select key, value from site_settings`);
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  return (
    <div>
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="prose-muted mt-1 text-sm">Homepage statistics band.</p>
      {saved && <p className="mt-2 text-sm text-[var(--color-success)]">Saved.</p>}

      <form action={updateSettings} className="card mt-6 grid max-w-xl gap-4 p-6 sm:grid-cols-2">
        {FIELDS.map(([key, label]) => (
          <div key={key}>
            <label className="label">{label}</label>
            <input name={key} defaultValue={map[key] ?? ""} className="field" />
          </div>
        ))}
        <div className="sm:col-span-2"><button className="btn btn-primary">Save</button></div>
      </form>
    </div>
  );
}
