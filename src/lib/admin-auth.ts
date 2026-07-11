import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";

// Server-side admin gate (D-27): a password compared against ADMIN_PASSWORD sets
// a signed httpOnly cookie (HMAC of a constant with ADMIN_SESSION_SECRET). No
// database, no external auth provider, no new credentials.
const COOKIE = "loftz_admin";
const SECRET = process.env.ADMIN_SESSION_SECRET ?? "";
const PASSWORD = process.env.ADMIN_PASSWORD ?? "";

function token(): string {
  return crypto.createHmac("sha256", SECRET).update("loftz-admin-v1").digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export async function verifyPassword(input: string): Promise<boolean> {
  if (!PASSWORD || !SECRET) return false;
  return safeEqual(input, PASSWORD);
}

export async function startSession() {
  const jar = await cookies();
  jar.set(COOKIE, token(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 12, // 12h
  });
}

export async function endSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function isAuthed(): Promise<boolean> {
  if (!SECRET) return false;
  const jar = await cookies();
  const c = jar.get(COOKIE)?.value;
  return !!c && safeEqual(c, token());
}

// Use at the top of every protected admin page/action.
export async function requireAdmin() {
  if (!(await isAuthed())) redirect("/admin/login");
}
