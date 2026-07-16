import { NextResponse } from "next/server";
import { sendContactMessage } from "@/lib/email";
import {
  rateLimit,
  clientIp,
  isHoneypotTripped,
  withinLengthCaps,
} from "@/lib/abuse-guard";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(req: Request) {
  let body: {
    name?: string;
    email?: string;
    message?: string;
    topic?: string;
    company_website?: string; // honeypot
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ status: "error" }, { status: 400 });
  }

  // Abuse guard: honeypot (pretend success), rate limit, size caps.
  if (isHoneypotTripped(body.company_website)) {
    return NextResponse.json({ status: "ok" });
  }
  const rl = rateLimit(clientIp(req), "contact");
  if (!rl.ok) {
    return NextResponse.json(
      { status: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
    );
  }

  if (
    !body.name?.trim() ||
    !EMAIL_RE.test(body.email ?? "") ||
    !body.message?.trim() ||
    !withinLengthCaps(
      { name: body.name, email: body.email, message: body.message },
      { name: 120, email: 160, message: 2000 }
    )
  ) {
    return NextResponse.json({ status: "error" }, { status: 422 });
  }

  try {
    await sendContactMessage({
      name: body.name.trim(),
      email: body.email!.trim(),
      message: body.message.trim(),
      topic: body.topic,
    });
  } catch (e) {
    console.error("[contact] email error", e);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }

  return NextResponse.json({ status: "ok" });
}
