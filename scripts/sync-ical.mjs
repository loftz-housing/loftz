// Fetches each room's Google Calendar iCal feed, parses busy periods, and writes
// them to availability via the replace_availability RPC (anon/publishable key —
// no DB credential). Run manually now; n8n runs the same logic nightly.
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const s = fs.readFileSync(path.join(os.homedir(), ".claude", "secrets", "supabase.txt"), "utf8");
const URL = s.match(/SUPABASE_URL=(.*)/)[1].trim();
const KEY = s.match(/SUPABASE_PUBLISHABLE_KEY=(.*)/)[1].trim();
const sb = createClient(URL, KEY, { auth: { persistSession: false } });

function unfold(text) {
  const out = [];
  for (const line of text.split(/\r?\n/)) {
    if ((line.startsWith(" ") || line.startsWith("\t")) && out.length) out[out.length - 1] += line.slice(1);
    else out.push(line);
  }
  return out;
}
function toISO(v) {
  const m = v.match(/(\d{4})(\d{2})(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
}
function parseIcs(text) {
  const events = [];
  let cur = null;
  for (const line of unfold(text)) {
    if (line.startsWith("BEGIN:VEVENT")) cur = {};
    else if (line.startsWith("END:VEVENT")) {
      if (cur?.start) events.push({ start: cur.start, end: cur.end ?? cur.start, summary: cur.summary });
      cur = null;
    } else if (cur) {
      const i = line.indexOf(":");
      if (i === -1) continue;
      const k = line.slice(0, i), v = line.slice(i + 1);
      if (k.startsWith("DTSTART")) cur.start = toISO(v);
      else if (k.startsWith("DTEND")) cur.end = toISO(v);
      else if (k.startsWith("SUMMARY")) cur.summary = v.trim().slice(0, 200);
    }
  }
  return events;
}

async function main() {
  const { data: rooms, error } = await sb.from("rooms").select("id, slug, ical_url");
  if (error) throw new Error(error.message);

  let ok = 0, skipped = 0, failed = 0, total = 0;
  for (const r of rooms) {
    if (!r.ical_url) { skipped++; continue; }
    try {
      const res = await fetch(r.ical_url, { redirect: "follow" });
      if (!res.ok) { console.warn(`  ${r.slug}: HTTP ${res.status}`); failed++; continue; }
      const events = parseIcs(await res.text());
      const { data, error: rpcErr } = await sb.rpc("replace_availability", {
        p_room: r.id, p_source: "google", p_events: events,
      });
      if (rpcErr) { console.warn(`  ${r.slug}: ${rpcErr.message}`); failed++; continue; }
      total += data ?? 0;
      ok++;
    } catch (e) {
      console.warn(`  ${r.slug}: ${e.message}`);
      failed++;
    }
  }
  console.log(`iCal sync: ${ok} rooms ok (${total} busy periods), ${skipped} no-feed, ${failed} failed.`);
}

main().catch((e) => { console.error("sync-ical failed:", e.message); process.exit(1); });
