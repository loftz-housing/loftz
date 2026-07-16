import { isAuthed } from "@/lib/admin-auth";
import { query } from "@/lib/admin-db";

export const dynamic = "force-dynamic";

interface Row {
  created_at: string;
  type: string;
  status: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  nationality: string | null;
  occupation: string | null;
  gender: string | null;
  residence_name: string | null;
  room_name: string | null;
  check_in: string | null;
  check_out: string | null;
  visit_at: string | null;
  eligibility_passed: boolean | null;
  message: string | null;
}

const COLUMNS: (keyof Row)[] = [
  "created_at",
  "type",
  "status",
  "full_name",
  "email",
  "phone",
  "nationality",
  "occupation",
  "gender",
  "residence_name",
  "room_name",
  "check_in",
  "check_out",
  "visit_at",
  "eligibility_passed",
  "message",
];

function cell(v: unknown): string {
  if (v == null) return "";
  const s = String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// GET /admin/requests/export → CSV of all requests (admin-only).
export async function GET() {
  if (!(await isAuthed())) {
    return new Response("Unauthorized", { status: 401 });
  }
  const rows = await query<Row>(
    `select rq.created_at, rq.type, rq.status,
            g.full_name, g.email, g.phone, g.nationality, g.occupation, g.gender,
            res.name as residence_name, rm.name as room_name,
            rq.check_in, rq.check_out, rq.visit_at, rq.eligibility_passed, rq.message
     from requests rq
     left join guest_profiles g on g.id = rq.guest_profile_id
     left join rooms rm on rm.id = rq.room_id
     left join residences res on res.id = rm.residence_id
     order by rq.created_at desc`
  );

  const header = COLUMNS.join(",");
  const body = rows
    .map((r) => COLUMNS.map((c) => cell(r[c])).join(","))
    .join("\r\n");
  const csv = `${header}\r\n${body}\r\n`;

  const date = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="loftz-requests-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
