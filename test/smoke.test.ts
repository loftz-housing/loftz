import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { spawn, type ChildProcess } from "node:child_process";

// Route smoke test: boots the production server (`next start`) and asserts the
// key public routes respond 200. Requires a prior `npm run build`. Run with
// `npm run test:smoke`. Kept out of `npm test` (unit) so the fast suite needs
// no server or build.
const PORT = Number(process.env.SMOKE_PORT ?? 3199);
const BASE = `http://localhost:${PORT}`;
const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

let server: ChildProcess | null = null;

async function waitForReady(timeoutMs = 90_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const r = await fetch(`${BASE}/en`, { redirect: "manual" });
      if (r.status < 500) return true;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

beforeAll(async () => {
  server = spawn(npmCmd, ["run", "start"], {
    env: { ...process.env, PORT: String(PORT) },
    stdio: "ignore",
    shell: process.platform === "win32",
  });
  const ok = await waitForReady();
  if (!ok) throw new Error(`Server did not become ready on ${BASE}`);
}, 120_000);

afterAll(() => {
  if (!server?.pid) return;
  if (process.platform === "win32") {
    spawn("taskkill", ["/pid", String(server.pid), "/T", "/F"]);
  } else {
    server.kill("SIGTERM");
  }
});

const ROUTES = [
  "/en",
  "/pt",
  "/es",
  "/en/book-now",
  "/en/residences",
  "/en/landlords",
  "/en/faq",
  "/en/about",
  "/robots.txt",
  "/sitemap.xml",
];

describe("route smoke", () => {
  it.each(ROUTES)("GET %s → 200", async (path) => {
    const res = await fetch(`${BASE}${path}`);
    expect(res.status, `${path} returned ${res.status}`).toBe(200);
  });

  it("serves a room detail page", async () => {
    const res = await fetch(`${BASE}/en/rooms/ma-3-room-1`);
    expect([200, 404]).toContain(res.status); // 200 in seeded envs
  });

  it("404s an unknown route", async () => {
    const res = await fetch(`${BASE}/en/this-does-not-exist`);
    expect(res.status).toBe(404);
  });
});
