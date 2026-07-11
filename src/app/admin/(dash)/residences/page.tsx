import { query } from "@/lib/admin-db";
import { updateResidence } from "../../actions";

export const dynamic = "force-dynamic";

interface R {
  id: string; code: string; name: string; neighborhood: string | null;
  address: string | null; latitude: number | null; longitude: number | null;
  bathrooms: number | null; cleaning_frequency: string | null;
  facilities: string[]; description: string | null; video_url: string | null;
}

export default async function AdminResidences({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const rows = await query<R>(`select * from residences order by sort_index`);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Residences</h1>
      {saved && <p className="mt-2 text-sm text-[var(--color-success)]">Saved.</p>}

      <div className="mt-6 space-y-3">
        {rows.map((r) => (
          <details key={r.id} className="card p-0 [&_summary::-webkit-details-marker]:hidden">
            <summary className="cursor-pointer px-5 py-4 font-medium">
              {r.name} <span className="text-muted">· {r.code}</span>
            </summary>
            <form action={updateResidence} className="grid gap-4 border-t border-line p-5 sm:grid-cols-2">
              <input type="hidden" name="id" value={r.id} />
              <L label="Name"><input name="name" defaultValue={r.name ?? ""} className="field" /></L>
              <L label="Neighborhood"><input name="neighborhood" defaultValue={r.neighborhood ?? ""} className="field" /></L>
              <L label="Address"><input name="address" defaultValue={r.address ?? ""} className="field" /></L>
              <L label="Bathrooms"><input name="bathrooms" type="number" defaultValue={r.bathrooms ?? ""} className="field" /></L>
              <L label="Latitude"><input name="latitude" defaultValue={r.latitude ?? ""} className="field" /></L>
              <L label="Longitude"><input name="longitude" defaultValue={r.longitude ?? ""} className="field" /></L>
              <L label="Cleaning frequency"><input name="cleaning_frequency" defaultValue={r.cleaning_frequency ?? ""} className="field" /></L>
              <L label="Video URL (embed)"><input name="video_url" defaultValue={r.video_url ?? ""} className="field" /></L>
              <L label="Facilities (comma-separated)" full><input name="facilities" defaultValue={(r.facilities ?? []).join(", ")} className="field" /></L>
              <L label="Description" full><textarea name="description" rows={3} defaultValue={r.description ?? ""} className="field" /></L>
              <div className="sm:col-span-2"><button className="btn btn-primary">Save</button></div>
            </form>
          </details>
        ))}
      </div>
    </div>
  );
}

function L({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
