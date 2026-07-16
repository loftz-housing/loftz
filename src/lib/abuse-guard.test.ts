import { describe, it, expect } from "vitest";
import {
  rateLimit,
  isHoneypotTripped,
  withinLengthCaps,
} from "@/lib/abuse-guard";

describe("rateLimit", () => {
  it("allows up to the cap then blocks within the window", () => {
    const ip = "1.2.3.4";
    const t0 = 1_000_000;
    // MAX_HITS = 6
    for (let i = 0; i < 6; i++) {
      expect(rateLimit(ip, "test-a", t0 + i).ok).toBe(true);
    }
    const blocked = rateLimit(ip, "test-a", t0 + 6);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("resets after the window elapses", () => {
    const ip = "5.6.7.8";
    const t0 = 2_000_000;
    for (let i = 0; i < 6; i++) rateLimit(ip, "test-b", t0);
    expect(rateLimit(ip, "test-b", t0).ok).toBe(false);
    // 11 minutes later
    expect(rateLimit(ip, "test-b", t0 + 11 * 60 * 1000).ok).toBe(true);
  });

  it("keeps separate buckets per route and per IP", () => {
    const t0 = 3_000_000;
    for (let i = 0; i < 6; i++) rateLimit("9.9.9.9", "route-x", t0);
    expect(rateLimit("9.9.9.9", "route-x", t0).ok).toBe(false);
    expect(rateLimit("9.9.9.9", "route-y", t0).ok).toBe(true); // other route
    expect(rateLimit("8.8.8.8", "route-x", t0).ok).toBe(true); // other IP
  });
});

describe("isHoneypotTripped", () => {
  it("trips only when a non-empty string is present", () => {
    expect(isHoneypotTripped("bot-filled")).toBe(true);
    expect(isHoneypotTripped("   ")).toBe(false);
    expect(isHoneypotTripped("")).toBe(false);
    expect(isHoneypotTripped(undefined)).toBe(false);
    expect(isHoneypotTripped(null)).toBe(false);
  });
});

describe("withinLengthCaps", () => {
  it("passes when all fields are within their caps", () => {
    expect(
      withinLengthCaps({ name: "Ana", email: "a@b.co" }, { name: 120, email: 160 })
    ).toBe(true);
  });

  it("fails when any field exceeds its cap", () => {
    expect(
      withinLengthCaps({ message: "x".repeat(3000) }, { message: 2000 })
    ).toBe(false);
  });
});
