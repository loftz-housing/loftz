// Lightweight abuse guard for public write endpoints (booking/visit + contact).
// Closes the accepted MVP residual (anon-executable RPCs) without a new service:
//   1. Honeypot — a hidden field bots tend to fill; humans never see it.
//   2. Per-IP fixed-window rate limit — in-memory (see caveat below).
//   3. Payload sanity caps — reject absurdly long fields early.
//
// Caveat: the rate-limit store is per-instance. On serverless (Vercel) each
// warm instance keeps its own window, so this throttles the common case
// (bursts hitting one instance) but is not a global limiter. The honeypot and
// caps are instance-independent. A durable limiter (KV / a Postgres table via a
// definer RPC) is the upgrade path when abuse actually materialises.

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_HITS = 6; // per IP per route per window

type Bucket = { count: number; resetAt: number };
const store = new Map<string, Bucket>();

export interface RateLimitResult {
  ok: boolean;
  retryAfterSeconds: number;
}

export function rateLimit(
  ip: string,
  route: string,
  now: number = Date.now()
): RateLimitResult {
  const key = `${route}:${ip}`;
  const b = store.get(key);
  if (!b || now >= b.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, retryAfterSeconds: 0 };
  }
  if (b.count >= MAX_HITS) {
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((b.resetAt - now) / 1000)),
    };
  }
  b.count += 1;
  return { ok: true, retryAfterSeconds: 0 };
}

/** Best-effort client IP from proxy headers (Vercel sets x-forwarded-for). */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/** True when the hidden honeypot field was filled → treat as a bot. */
export function isHoneypotTripped(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

/** Reject fields longer than a sane cap (basic payload hardening). */
export function withinLengthCaps(
  fields: Record<string, unknown>,
  caps: Record<string, number>
): boolean {
  for (const [name, cap] of Object.entries(caps)) {
    const v = fields[name];
    if (typeof v === "string" && v.length > cap) return false;
  }
  return true;
}

// Field name used as the honeypot across forms.
export const HONEYPOT_FIELD = "company_website";
