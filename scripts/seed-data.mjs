// Seeds residences + rooms + default eligibility rows from the confirmed inventory
// (docs/data/ota-room-links.json) + monthly prices (LOFTZ Operational Tool →
// Rentabilidades tab, captured 2026-07-11). Idempotent: upserts by slug/code.
// Photos are loaded separately (migrate-photos.mjs).
import fs from "node:fs";
import path from "node:path";
import pg from "pg";
import { pgConnectionString } from "./_secrets.mjs";

const OTA_JSON = path.resolve(
  "C:/Users/santa/Documents/4. AI/Personal/LOFTZ/docs/data/ota-room-links.json"
);

// Per-room monthly rent (EUR), in room order, from the Rentabilidades tab.
const PRICES = {
  "MS 61": [480, 600, 550, 550, 580, 350],
  "MS 56": [500, 500, 550, 550, 550, 550, 550, 550, 500, 550],
  "MA 1": [600, 600, 520, 350, 600, 550, 550, 600],
  MA2: [600, 600, 520, 350, 520, 520, 550],
  MA3: [600, 600, 520, 350, 520, 520, 550],
  MA5: [500, 500, 500, 500, 500, 600, 500],
  GF: [520, 520, 550, 550, 450, 550, 650],
  CA: [550, 550, 550, 550, 450],
  AO: [550, 550, 480, 550, 550, 450, 480, 450],
};

// Residence metadata. Street/coords known for the Morais Soares (MS) and
// Marquês de Abrantes (MA) buildings; others left null for admin to fill.
const RESIDENCE_META = {
  "MS 61": { code: "MS61", slug: "ms-61", neighborhood: "Penha de França", address: "Rua Morais Soares, Lisbon", lat: 38.729, lng: -9.1285 },
  "MS 56": { code: "MS56", slug: "ms-56", neighborhood: "Penha de França", address: "Rua Morais Soares, Lisbon", lat: 38.7292, lng: -9.129 },
  "MA 1": { code: "MA1", slug: "ma-1", neighborhood: "Santos", address: "Calçada do Marquês de Abrantes, Lisbon", lat: 38.7075, lng: -9.1535 },
  MA2: { code: "MA2", slug: "ma-2", neighborhood: "Santos", address: "Calçada do Marquês de Abrantes, Lisbon", lat: 38.7078, lng: -9.1532 },
  MA3: { code: "MA3", slug: "ma-3", neighborhood: "Santos", address: "Calçada do Marquês de Abrantes, Lisbon", lat: 38.7072, lng: -9.1538 },
  MA5: { code: "MA5", slug: "ma-5", neighborhood: "Santos", address: "Calçada do Marquês de Abrantes, Lisbon", lat: 38.708, lng: -9.153 },
  GF: { code: "GF", slug: "gf", neighborhood: "Lisbon", address: null, lat: null, lng: null },
  CA: { code: "CA", slug: "ca", neighborhood: "Lisbon", address: null, lat: null, lng: null },
  AO: { code: "AO", slug: "ao", neighborhood: "Lisbon", address: null, lat: null, lng: null },
};

const RESIDENCE_ORDER = ["MS 61", "MS 56", "MA 1", "MA2", "MA3", "MA5", "GF", "CA", "AO"];

function cleanUrl(u) {
  if (!u || typeof u !== "string") return null;
  // Drop obvious junk (e.g. "http://v/", "http://n/") and doubled URLs.
  if (!/^https:\/\//.test(u)) return null;
  const first = u.split("https://").filter(Boolean)[0];
  return "https://" + first;
}

function roomSlug(resSlug, roomName) {
  const n = roomName.replace(/\D/g, "");
  return `${resSlug}-room-${n}`;
}

async function main() {
  const rows = JSON.parse(fs.readFileSync(OTA_JSON, "utf8"));

  // Group rooms by residence, preserving JSON order.
  const byRes = new Map();
  for (const r of rows) {
    if (!byRes.has(r.residence)) byRes.set(r.residence, []);
    byRes.get(r.residence).push(r);
  }

  const client = new pg.Client({
    connectionString: pgConnectionString(),
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });
  await client.connect();

  let resCount = 0;
  let roomCount = 0;

  for (let ri = 0; ri < RESIDENCE_ORDER.length; ri++) {
    const resName = RESIDENCE_ORDER[ri];
    const meta = RESIDENCE_META[resName];
    const roomsData = byRes.get(resName) || [];
    if (!meta) {
      console.warn("No meta for residence", resName);
      continue;
    }

    const resRes = await client.query(
      `insert into residences (code, slug, name, neighborhood, address, city, latitude, longitude, sort_index)
       values ($1,$2,$3,$4,$5,'Lisbon',$6,$7,$8)
       on conflict (code) do update set
         slug=excluded.slug, name=excluded.name, neighborhood=excluded.neighborhood,
         address=excluded.address, latitude=excluded.latitude, longitude=excluded.longitude,
         sort_index=excluded.sort_index, updated_at=now()
       returning id`,
      [meta.code, meta.slug, resName, meta.neighborhood, meta.address, meta.lat, meta.lng, ri]
    );
    const residenceId = resRes.rows[0].id;
    resCount++;

    const prices = PRICES[resName] || [];
    for (let i = 0; i < roomsData.length; i++) {
      const rd = roomsData[i];
      const price = prices[i] ?? null;
      const slug = roomSlug(meta.slug, rd.room);
      const links = {
        uniplaces: cleanUrl(rd.uniplaces_frontend),
        spotahome: cleanUrl(rd.spotahome_frontend),
        housinganywhere: cleanUrl(rd.housinganywhere_frontend),
        inlife: cleanUrl(rd.inlife_frontend),
        erasmuslisboa: cleanUrl(rd.erasmus_frontend),
      };
      for (const k of Object.keys(links)) if (!links[k]) delete links[k];

      const roomRes = await client.query(
        `insert into rooms (residence_id, slug, name, monthly_price, ical_url, platform_links, sort_index)
         values ($1,$2,$3,$4,$5,$6,$7)
         on conflict (slug) do update set
           residence_id=excluded.residence_id, name=excluded.name,
           monthly_price=excluded.monthly_price, ical_url=excluded.ical_url,
           platform_links=excluded.platform_links, sort_index=excluded.sort_index,
           updated_at=now()
         returning id`,
        [residenceId, slug, rd.room, price, cleanUrl(rd.ical), JSON.stringify(links), i]
      );
      const roomId = roomRes.rows[0].id;
      // Default eligibility row (no restrictions) — Henrique tunes via admin later.
      await client.query(
        `insert into eligibility_conditions (room_id) values ($1)
         on conflict (room_id) do nothing`,
        [roomId]
      );
      roomCount++;
    }
  }

  await client.end();
  console.log(`Seeded ${resCount} residences, ${roomCount} rooms.`);
}

main().catch((e) => {
  console.error("Seed failed:", e.message);
  process.exit(1);
});
