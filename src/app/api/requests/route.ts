import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { checkEligibility } from "@/lib/eligibility";
import { isValidRange, rangeOverlapsBusy } from "@/lib/availability";
import { sendOwnerNotification, sendGuestConfirmation } from "@/lib/email";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://loftz.net";

interface Body {
  roomId: string;
  type: "booking" | "visit";
  locale?: string;
  full_name: string;
  email: string;
  phone?: string | null;
  nationality?: string | null;
  date_of_birth?: string | null;
  occupation?: string | null;
  gender?: string | null;
  check_in?: string | null;
  check_out?: string | null;
  visit_date?: string | null;
  visit_time?: string | null;
  message?: string | null;
  accepted_house_rules?: boolean;
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ status: "error" }, { status: 400 });
  }

  const locale = body.locale === "pt" ? "pt" : "en";

  // Validation
  if (
    !body.roomId ||
    (body.type !== "booking" && body.type !== "visit") ||
    !body.full_name?.trim() ||
    !EMAIL_RE.test(body.email ?? "")
  ) {
    return NextResponse.json({ status: "error" }, { status: 422 });
  }
  if (body.type === "booking" && (!body.check_in || !body.check_out)) {
    return NextResponse.json({ status: "error" }, { status: 422 });
  }
  if (body.type === "visit" && !body.visit_date) {
    return NextResponse.json({ status: "error" }, { status: 422 });
  }

  // Fetch room + residence + conditions
  const { data: room } = await supabase
    .from("rooms")
    .select("id, name, slug, residence:residences(name)")
    .eq("id", body.roomId)
    .maybeSingle();

  if (!room) {
    return NextResponse.json({ status: "error" }, { status: 404 });
  }

  // Availability check (booking only): reject invalid ranges or dates that
  // overlap a synced busy period. Mirrors the client-side guard so a stale or
  // hand-crafted request can't slip a booked room through.
  if (body.type === "booking") {
    if (!isValidRange(body.check_in, body.check_out)) {
      return NextResponse.json({ status: "error" }, { status: 422 });
    }
    const { data: busy } = await supabase
      .from("availability")
      .select("start_date, end_date")
      .eq("room_id", body.roomId);
    if (rangeOverlapsBusy(body.check_in, body.check_out, busy ?? [])) {
      return NextResponse.json({ status: "unavailable" });
    }
  }

  const { data: conditions } = await supabase
    .from("eligibility_conditions")
    .select("*")
    .eq("room_id", body.roomId)
    .maybeSingle();

  // Eligibility at request time (D-18/D-19)
  const elig = checkEligibility(conditions, {
    dateOfBirth: body.date_of_birth,
    gender: body.gender,
    checkIn: body.check_in,
    checkOut: body.check_out,
  });

  if (!elig.passed) {
    return NextResponse.json({ status: "blocked", reasons: elig.reasons });
  }

  // Build visit timestamp (date + optional time)
  let visitAt: string | null = null;
  if (body.type === "visit" && body.visit_date) {
    visitAt = body.visit_time
      ? `${body.visit_date}T${body.visit_time}:00`
      : `${body.visit_date}T10:00:00`;
  }

  // Persist via SECURITY DEFINER RPC (anon can't write tables directly)
  const { error: rpcError } = await supabase.rpc("submit_request", {
    p_room_id: body.roomId,
    p_type: body.type,
    p_full_name: body.full_name,
    p_email: body.email,
    p_nationality: body.nationality ?? null,
    p_date_of_birth: body.date_of_birth || null,
    p_phone: body.phone ?? null,
    p_occupation: body.occupation ?? null,
    p_gender: body.gender ?? null,
    p_check_in: body.check_in || null,
    p_check_out: body.check_out || null,
    p_visit_at: visitAt,
    p_message: body.message ?? null,
    p_accepted_house_rules: !!body.accepted_house_rules,
    p_eligibility_passed: elig.passed,
    p_eligibility_notes: elig.notes,
  });

  if (rpcError) {
    console.error("[requests] rpc error", rpcError.message);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }

  // Emails (best-effort — never fail the request if email is down)
  const residenceName =
    (room.residence as { name?: string } | null)?.name ?? "LOFTZ";
  const emailData = {
    type: body.type,
    roomName: room.name,
    residenceName,
    roomUrl: `${SITE_URL}/${locale}/rooms/${room.slug}`,
    fullName: body.full_name,
    email: body.email,
    phone: body.phone,
    nationality: body.nationality,
    dateOfBirth: body.date_of_birth,
    occupation: body.occupation,
    gender: body.gender,
    checkIn: body.check_in,
    checkOut: body.check_out,
    visitDate: body.visit_date,
    visitTime: body.visit_time,
    message: body.message,
    locale,
  };
  try {
    await Promise.allSettled([
      sendOwnerNotification(emailData),
      sendGuestConfirmation(emailData),
    ]);
  } catch (e) {
    console.error("[requests] email error", e);
  }

  return NextResponse.json({ status: "ok" });
}
