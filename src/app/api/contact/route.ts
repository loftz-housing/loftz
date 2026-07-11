import { NextResponse } from "next/server";
import { sendContactMessage } from "@/lib/email";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(req: Request) {
  let body: { name?: string; email?: string; message?: string; topic?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ status: "error" }, { status: 400 });
  }

  if (
    !body.name?.trim() ||
    !EMAIL_RE.test(body.email ?? "") ||
    !body.message?.trim()
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
