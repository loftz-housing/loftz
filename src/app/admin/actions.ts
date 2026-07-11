"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  verifyPassword,
  startSession,
  endSession,
  requireAdmin,
} from "@/lib/admin-auth";
import { query } from "@/lib/admin-db";

// ---- Auth ----
export async function login(formData: FormData) {
  const pw = String(formData.get("password") ?? "");
  if (await verifyPassword(pw)) {
    await startSession();
    redirect("/admin");
  }
  redirect("/admin/login?error=1");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

// ---- Helpers ----
function str(fd: FormData, k: string): string | null {
  const v = fd.get(k);
  if (v == null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}
function num(fd: FormData, k: string): number | null {
  const s = str(fd, k);
  if (s == null) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}
function bool(fd: FormData, k: string): boolean {
  return fd.get(k) === "on";
}
function list(fd: FormData, k: string): string[] {
  const s = str(fd, k);
  if (!s) return [];
  return s.split(",").map((x) => x.trim()).filter(Boolean);
}

// ---- Residences ----
export async function updateResidence(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await query(
    `update residences set
       name=$2, neighborhood=$3, address=$4, latitude=$5, longitude=$6,
       bathrooms=$7, cleaning_frequency=$8, facilities=$9, description=$10,
       video_url=$11, updated_at=now()
     where id=$1`,
    [
      id,
      str(formData, "name"),
      str(formData, "neighborhood"),
      str(formData, "address"),
      num(formData, "latitude"),
      num(formData, "longitude"),
      num(formData, "bathrooms"),
      str(formData, "cleaning_frequency"),
      list(formData, "facilities"),
      str(formData, "description"),
      str(formData, "video_url"),
    ]
  );
  revalidatePath("/admin/residences");
  redirect("/admin/residences?saved=1");
}

// ---- Rooms ----
export async function updateRoom(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await query(
    `update rooms set
       name=$2, monthly_price=$3, size_m2=$4, bed_type=$5, private_bathroom=$6,
       features=$7, description=$8, room_contents=$9, available_from=$10,
       ical_url=$11, status=$12, updated_at=now()
     where id=$1`,
    [
      id,
      str(formData, "name"),
      num(formData, "monthly_price"),
      num(formData, "size_m2"),
      str(formData, "bed_type"),
      bool(formData, "private_bathroom"),
      list(formData, "features"),
      str(formData, "description"),
      list(formData, "room_contents"),
      str(formData, "available_from"),
      str(formData, "ical_url"),
      str(formData, "status") ?? "active",
    ]
  );
  // eligibility (same form)
  await query(
    `insert into eligibility_conditions
       (room_id, age_min, age_max, gender, allow_smoking, allow_parties, allow_pets,
        min_stay_months, max_stay_months, turnover_gap_days, house_rules, updated_at)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11, now())
     on conflict (room_id) do update set
       age_min=excluded.age_min, age_max=excluded.age_max, gender=excluded.gender,
       allow_smoking=excluded.allow_smoking, allow_parties=excluded.allow_parties,
       allow_pets=excluded.allow_pets, min_stay_months=excluded.min_stay_months,
       max_stay_months=excluded.max_stay_months, turnover_gap_days=excluded.turnover_gap_days,
       house_rules=excluded.house_rules, updated_at=now()`,
    [
      id,
      num(formData, "age_min"),
      num(formData, "age_max"),
      str(formData, "gender") ?? "any",
      bool(formData, "allow_smoking"),
      bool(formData, "allow_parties"),
      bool(formData, "allow_pets"),
      num(formData, "min_stay_months"),
      num(formData, "max_stay_months"),
      num(formData, "turnover_gap_days"),
      list(formData, "house_rules"),
    ]
  );
  revalidatePath("/admin/rooms");
  redirect("/admin/rooms?saved=1");
}

// ---- Requests ----
export async function setRequestStatus(formData: FormData) {
  await requireAdmin();
  await query(`update requests set status=$2 where id=$1`, [
    String(formData.get("id")),
    String(formData.get("status")),
  ]);
  revalidatePath("/admin/requests");
}

// ---- Photos (reorder / cover / remove) ----
// Dense, contiguous sort_index per room so up/down swaps are unambiguous.
async function reindexRoomPhotos(roomId: string) {
  await query(
    `with ordered as (
       select id, row_number() over (order by sort_index, created_at) - 1 as rn
       from photos where room_id = $1
     )
     update photos p set sort_index = o.rn from ordered o where p.id = o.id`,
    [roomId]
  );
}

export async function movePhoto(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const roomId = String(formData.get("room_id"));
  const dir = String(formData.get("dir")); // 'up' | 'down'
  await reindexRoomPhotos(roomId);
  const [cur] = await query<{ sort_index: number }>(
    `select sort_index from photos where id = $1`,
    [id]
  );
  if (!cur) return;
  const op = dir === "up" ? "<" : ">";
  const ord = dir === "up" ? "desc" : "asc";
  const [nb] = await query<{ id: string; sort_index: number }>(
    `select id, sort_index from photos
     where room_id = $1 and sort_index ${op} $2
     order by sort_index ${ord} limit 1`,
    [roomId, cur.sort_index]
  );
  if (!nb) return;
  await query(`update photos set sort_index = $2 where id = $1`, [id, nb.sort_index]);
  await query(`update photos set sort_index = $2 where id = $1`, [nb.id, cur.sort_index]);
  revalidatePath("/admin/photos");
}

export async function setCoverPhoto(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const roomId = String(formData.get("room_id"));
  await query(`update photos set sort_index = -1 where id = $1`, [id]);
  await reindexRoomPhotos(roomId);
  revalidatePath("/admin/photos");
}

export async function removePhoto(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const roomId = String(formData.get("room_id"));
  // Removes the DB row (hides it from the site). The storage object is left in
  // place (harmless orphan) — a full storage delete needs the service key.
  await query(`delete from photos where id = $1`, [id]);
  await reindexRoomPhotos(roomId);
  revalidatePath("/admin/photos");
}

// ---- Settings (homepage stats) ----
export async function updateSettings(formData: FormData) {
  await requireAdmin();
  for (const key of ["stat_guests", "stat_nationalities", "stat_rating", "stat_years"]) {
    await query(
      `insert into site_settings (key, value, updated_at) values ($1,$2, now())
       on conflict (key) do update set value=excluded.value, updated_at=now()`,
      [key, str(formData, key)]
    );
  }
  revalidatePath("/admin/settings");
  redirect("/admin/settings?saved=1");
}
