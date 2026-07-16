import { describe, it, expect } from "vitest";
import { parseIcs, buildIcs, type BusyEvent } from "@/lib/ical";

const SAMPLE = [
  "BEGIN:VCALENDAR",
  "VERSION:2.0",
  "BEGIN:VEVENT",
  "DTSTART;VALUE=DATE:20260901",
  "DTEND;VALUE=DATE:20260908",
  "SUMMARY:Booked via Uniplaces",
  "END:VEVENT",
  "END:VCALENDAR",
].join("\r\n");

describe("parseIcs", () => {
  it("parses a basic all-day VEVENT", () => {
    const events = parseIcs(SAMPLE);
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      start: "2026-09-01",
      end: "2026-09-08",
      summary: "Booked via Uniplaces",
    });
  });

  it("accepts datetime DTSTART and defaults end to start when DTEND is absent", () => {
    const ics = [
      "BEGIN:VEVENT",
      "DTSTART:20260901T130000Z",
      "SUMMARY:No end",
      "END:VEVENT",
    ].join("\r\n");
    const [e] = parseIcs(ics);
    expect(e.start).toBe("2026-09-01");
    expect(e.end).toBe("2026-09-01");
  });

  it("unfolds RFC 5545 folded lines (leading space is the fold marker, removed)", () => {
    // A fold can split mid-word; unfolding strips exactly one leading
    // whitespace and concatenates without inserting a space.
    const ics = [
      "BEGIN:VEVENT",
      "DTSTART;VALUE=DATE:20260101",
      "SUMMARY:Booked for the autumn se",
      " mester",
      "END:VEVENT",
    ].join("\r\n");
    const [e] = parseIcs(ics);
    expect(e.summary).toBe("Booked for the autumn semester");
  });

  it("parses multiple events and ignores stray lines", () => {
    const ics = [
      "RANDOM:ignore me",
      "BEGIN:VEVENT",
      "DTSTART;VALUE=DATE:20260101",
      "DTEND;VALUE=DATE:20260102",
      "END:VEVENT",
      "BEGIN:VEVENT",
      "DTSTART;VALUE=DATE:20260201",
      "DTEND;VALUE=DATE:20260203",
      "END:VEVENT",
    ].join("\n"); // also tolerate LF-only line endings
    expect(parseIcs(ics)).toHaveLength(2);
  });

  it("drops a VEVENT with no DTSTART", () => {
    const ics = [
      "BEGIN:VEVENT",
      "SUMMARY:Missing start",
      "END:VEVENT",
    ].join("\r\n");
    expect(parseIcs(ics)).toHaveLength(0);
  });
});

describe("buildIcs", () => {
  const events: BusyEvent[] = [
    { start: "2026-09-01", end: "2026-09-08", summary: "Booked" },
    { start: "2026-10-01", end: "2026-10-05" },
  ];

  it("emits a well-formed VCALENDAR with DATE values", () => {
    const out = buildIcs({ name: "MS61 · Room A", events });
    expect(out).toContain("BEGIN:VCALENDAR");
    expect(out).toContain("X-WR-CALNAME:MS61 · Room A");
    expect(out).toContain("DTSTART;VALUE=DATE:20260901");
    expect(out).toContain("DTEND;VALUE=DATE:20260908");
    expect(out.match(/BEGIN:VEVENT/g)).toHaveLength(2);
    expect(out).toContain("SUMMARY:Booked");
    // Default summary for events without one.
    expect(out).toContain("SUMMARY:Booked"); // first
    expect(out).toContain("END:VCALENDAR");
    expect(out).toContain("\r\n"); // CRLF line endings per RFC
  });

  it("round-trips through parseIcs", () => {
    const out = buildIcs({ name: "Round trip", events });
    const parsed = parseIcs(out);
    expect(parsed).toHaveLength(2);
    expect(parsed[0]).toMatchObject({ start: "2026-09-01", end: "2026-09-08" });
    expect(parsed[1]).toMatchObject({ start: "2026-10-01", end: "2026-10-05" });
  });
});
