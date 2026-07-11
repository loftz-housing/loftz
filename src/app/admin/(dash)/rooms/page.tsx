import { query } from "@/lib/admin-db";
import { updateRoom } from "../../actions";

export const dynamic = "force-dynamic";

interface Row {
  id: string; slug: string; name: string; residence_name: string; residence_sort: number;
  monthly_price: number | null; size_m2: number | null; bed_type: string | null;
  private_bathroom: boolean; features: string[]; description: string | null;
  room_contents: string[]; available_from: string | null; ical_url: string | null;
  status: string; sort_index: number;
  age_min: number | null; age_max: number | null; gender: string | null;
  allow_smoking: boolean | null; allow_parties: boolean | null; allow_pets: boolean | null;
  min_stay_months: number | null; max_stay_months: number | null; turnover_gap_days: number | null;
  house_rules: string[] | null;
}

export default async function AdminRooms({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const rows = await query<Row>(
    `select rm.*, res.name as residence_name, res.sort_index as residence_sort,
            e.age_min, e.age_max, e.gender, e.allow_smoking, e.allow_parties, e.allow_pets,
            e.min_stay_months, e.max_stay_months, e.turnover_gap_days, e.house_rules
     from rooms rm
     join residences res on res.id = rm.residence_id
     left join eligibility_conditions e on e.room_id = rm.id
     order by res.sort_index, rm.sort_index`
  );

  const groups = new Map<string, Row[]>();
  for (const r of rows) {
    if (!groups.has(r.residence_name)) groups.set(r.residence_name, []);
    groups.get(r.residence_name)!.push(r);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Rooms</h1>
      {saved && <p className="mt-2 text-sm text-[var(--color-success)]">Saved.</p>}

      <div className="mt-6 space-y-8">
        {[...groups.entries()].map(([res, list]) => (
          <section key={res}>
            <h2 className="mb-3 font-display text-lg font-semibold">{res}</h2>
            <div className="space-y-3">
              {list.map((r) => (
                <details key={r.id} className="card p-0 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center justify-between px-5 py-4">
                    <span className="font-medium">{r.name}</span>
                    <span className="text-sm text-muted">
                      {r.monthly_price ? `€${r.monthly_price}` : "—"} · {r.status}
                    </span>
                  </summary>
                  <form action={updateRoom} className="border-t border-line p-5">
                    <input type="hidden" name="id" value={r.id} />
                    <div className="grid gap-4 sm:grid-cols-3">
                      <L label="Name"><input name="name" defaultValue={r.name ?? ""} className="field" /></L>
                      <L label="Price €/mo"><input name="monthly_price" type="number" step="1" defaultValue={r.monthly_price ?? ""} className="field" /></L>
                      <L label="Size m²"><input name="size_m2" type="number" step="0.1" defaultValue={r.size_m2 ?? ""} className="field" /></L>
                      <L label="Bed type">
                        <select name="bed_type" defaultValue={r.bed_type ?? ""} className="field">
                          <option value="">—</option>
                          <option value="single">single</option>
                          <option value="double">double</option>
                        </select>
                      </L>
                      <L label="Available from"><input name="available_from" type="date" defaultValue={r.available_from ?? ""} className="field" /></L>
                      <L label="Status">
                        <select name="status" defaultValue={r.status} className="field">
                          <option value="active">active</option>
                          <option value="hidden">hidden</option>
                        </select>
                      </L>
                      <Check name="private_bathroom" label="Private bathroom" checked={r.private_bathroom} />
                      <L label="Features (comma)" ><input name="features" defaultValue={(r.features ?? []).join(", ")} className="field" /></L>
                      <L label="iCal URL"><input name="ical_url" defaultValue={r.ical_url ?? ""} className="field" /></L>
                      <L label="Room contents (comma)" full><input name="room_contents" defaultValue={(r.room_contents ?? []).join(", ")} className="field" /></L>
                      <L label="Description" full><textarea name="description" rows={2} defaultValue={r.description ?? ""} className="field" /></L>
                    </div>

                    <div className="mt-5 rounded-lg bg-surface p-4">
                      <div className="mb-3 text-sm font-semibold">Eligibility conditions</div>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <L label="Age min"><input name="age_min" type="number" defaultValue={r.age_min ?? ""} className="field" /></L>
                        <L label="Age max"><input name="age_max" type="number" defaultValue={r.age_max ?? ""} className="field" /></L>
                        <L label="Gender">
                          <select name="gender" defaultValue={r.gender ?? "any"} className="field">
                            <option value="any">any</option>
                            <option value="male">male</option>
                            <option value="female">female</option>
                          </select>
                        </L>
                        <L label="Min stay (months)"><input name="min_stay_months" type="number" defaultValue={r.min_stay_months ?? ""} className="field" /></L>
                        <L label="Max stay (months)"><input name="max_stay_months" type="number" defaultValue={r.max_stay_months ?? ""} className="field" /></L>
                        <L label="Turnover gap (days)"><input name="turnover_gap_days" type="number" defaultValue={r.turnover_gap_days ?? ""} className="field" /></L>
                        <Check name="allow_smoking" label="Allow smoking" checked={!!r.allow_smoking} />
                        <Check name="allow_parties" label="Allow parties" checked={!!r.allow_parties} />
                        <Check name="allow_pets" label="Allow pets" checked={!!r.allow_pets} />
                        <L label="House rules (comma)" full><input name="house_rules" defaultValue={(r.house_rules ?? []).join(", ")} className="field" /></L>
                      </div>
                    </div>

                    <div className="mt-4"><button className="btn btn-primary">Save</button></div>
                  </form>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function L({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-3" : ""}>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
function Check({ name, label, checked }: { name: string; label: string; checked: boolean }) {
  return (
    <label className="flex items-center gap-2 self-end pb-2 text-sm">
      <input type="checkbox" name={name} defaultChecked={checked} /> {label}
    </label>
  );
}
