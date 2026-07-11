// Loads uploaded_photos.json into the photos table (idempotent: clears existing
// rows first, then inserts in order). Maps residence_slug + room_no -> ids.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { pgConnectionString } from "./_secrets.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const rows = JSON.parse(
    fs.readFileSync(path.join(__dirname, "uploaded_photos.json"), "utf8")
  );
  const client = new pg.Client({
    connectionString: pgConnectionString(),
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });
  await client.connect();

  const residences = (
    await client.query("select id, slug from residences")
  ).rows.reduce((m, r) => ((m[r.slug] = r.id), m), {});
  const roomsRes = await client.query("select id, slug from rooms");
  const roomBySlug = roomsRes.rows.reduce((m, r) => ((m[r.slug] = r.id), m), {});

  await client.query("delete from photos");

  let inserted = 0;
  let skipped = 0;
  for (const row of rows) {
    const residenceId = residences[row.residence_slug];
    if (!residenceId) {
      skipped++;
      continue;
    }
    let roomId = null;
    if (row.category === "room" && row.room_no != null) {
      roomId = roomBySlug[`${row.residence_slug}-room-${row.room_no}`] ?? null;
      if (!roomId) {
        skipped++;
        continue;
      }
    }
    await client.query(
      `insert into photos (residence_id, room_id, category, storage_path, url, sort_index)
       values ($1,$2,$3,$4,$5,$6)`,
      [residenceId, roomId, row.category, row.storage_path, row.url, row.order]
    );
    inserted++;
  }

  await client.end();
  console.log(`Photos loaded: ${inserted} inserted, ${skipped} skipped.`);
}

main().catch((e) => {
  console.error("load-photos failed:", e.message);
  process.exit(1);
});
