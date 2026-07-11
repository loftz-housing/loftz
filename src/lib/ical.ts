// Minimal iCal (RFC 5545) helpers shared by the export route and the sync script.

export interface BusyEvent {
  start: string; // YYYY-MM-DD (inclusive)
  end: string; // YYYY-MM-DD (exclusive, as in iCal all-day DTEND)
  summary?: string;
}

function unfold(text: string): string[] {
  // RFC 5545 line folding: a leading space/tab continues the previous line.
  const raw = text.split(/\r?\n/);
  const out: string[] = [];
  for (const line of raw) {
    if ((line.startsWith(" ") || line.startsWith("\t")) && out.length) {
      out[out.length - 1] += line.slice(1);
    } else {
      out.push(line);
    }
  }
  return out;
}

function toISO(val: string): string | null {
  // Accepts 20260901 or 20260901T130000Z / 20260901T130000
  const m = val.match(/(\d{4})(\d{2})(\d{2})/);
  if (!m) return null;
  return `${m[1]}-${m[2]}-${m[3]}`;
}

// Parse an iCal document into busy events (VEVENT DTSTART/DTEND).
export function parseIcs(text: string): BusyEvent[] {
  const lines = unfold(text);
  const events: BusyEvent[] = [];
  let cur: Partial<BusyEvent> | null = null;
  for (const line of lines) {
    if (line.startsWith("BEGIN:VEVENT")) cur = {};
    else if (line.startsWith("END:VEVENT")) {
      if (cur?.start) {
        events.push({
          start: cur.start,
          end: cur.end ?? cur.start,
          summary: cur.summary,
        });
      }
      cur = null;
    } else if (cur) {
      const idx = line.indexOf(":");
      if (idx === -1) continue;
      const key = line.slice(0, idx);
      const value = line.slice(idx + 1);
      if (key.startsWith("DTSTART")) cur.start = toISO(value) ?? undefined;
      else if (key.startsWith("DTEND")) cur.end = toISO(value) ?? undefined;
      else if (key.startsWith("SUMMARY")) cur.summary = value.trim().slice(0, 200);
    }
  }
  return events;
}

// Build an iCal document from busy events (for per-room export feeds).
export function buildIcs(opts: {
  name: string;
  events: BusyEvent[];
}): string {
  const stamp = "20260101T000000Z"; // static DTSTAMP (build-time neutral)
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//LOFTZ//loftz.net//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${opts.name}`,
  ];
  opts.events.forEach((e, i) => {
    lines.push(
      "BEGIN:VEVENT",
      `UID:loftz-${i}-${e.start}@loftz.net`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${e.start.replace(/-/g, "")}`,
      `DTEND;VALUE=DATE:${e.end.replace(/-/g, "")}`,
      `SUMMARY:${e.summary ?? "Booked"}`,
      "END:VEVENT"
    );
  });
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
