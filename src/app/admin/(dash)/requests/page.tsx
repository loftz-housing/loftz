import { query } from "@/lib/admin-db";
import { setRequestStatus } from "../../actions";

export const dynamic = "force-dynamic";

interface Req {
  id: string; type: string; status: string; created_at: string;
  check_in: string | null; check_out: string | null; visit_at: string | null;
  message: string | null; eligibility_passed: boolean | null;
  full_name: string | null; email: string | null; phone: string | null;
  nationality: string | null; occupation: string | null;
  room_name: string | null; residence_name: string | null;
}

function fmt(d: string | null) {
  return d ? new Date(d).toLocaleDateString("en-GB") : "—";
}

export default async function AdminRequests() {
  const rows = await query<Req>(
    `select rq.id, rq.type, rq.status, rq.created_at, rq.check_in, rq.check_out,
            rq.visit_at, rq.message, rq.eligibility_passed,
            g.full_name, g.email, g.phone, g.nationality, g.occupation,
            rm.name as room_name, res.name as residence_name
     from requests rq
     left join guest_profiles g on g.id = rq.guest_profile_id
     left join rooms rm on rm.id = rq.room_id
     left join residences res on res.id = rm.residence_id
     order by rq.created_at desc
     limit 200`
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold">Requests</h1>
      {rows.length === 0 && <p className="prose-muted mt-3">No requests yet.</p>}

      <div className="mt-6 space-y-3">
        {rows.map((r) => (
          <div key={r.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`chip ${r.type === "booking" ? "chip-accent" : ""}`}>{r.type}</span>
                  {r.eligibility_passed === false && (
                    <span className="chip" style={{ background: "var(--color-danger-soft)", color: "var(--color-danger)" }}>ineligible</span>
                  )}
                  <span className="text-xs text-muted">{fmt(r.created_at)}</span>
                </div>
                <div className="mt-2 font-medium">{r.full_name} · <span className="font-normal text-muted">{r.email}{r.phone ? ` · ${r.phone}` : ""}</span></div>
                <div className="text-sm text-muted">
                  {r.residence_name} · {r.room_name}
                  {r.type === "booking"
                    ? ` · ${fmt(r.check_in)} → ${fmt(r.check_out)}`
                    : r.visit_at ? ` · visit ${new Date(r.visit_at).toLocaleString("en-GB")}` : ""}
                </div>
                <div className="text-sm text-muted">
                  {[r.nationality, r.occupation].filter(Boolean).join(" · ")}
                </div>
                {r.message && <p className="mt-2 text-sm">{r.message}</p>}
              </div>
              <form action={setRequestStatus} className="flex items-center gap-2">
                <input type="hidden" name="id" value={r.id} />
                <select name="status" defaultValue={r.status} className="field w-auto py-1.5">
                  <option value="new">new</option>
                  <option value="contacted">contacted</option>
                  <option value="closed">closed</option>
                </select>
                <button className="btn btn-outline">Update</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
