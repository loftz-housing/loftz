// Applies supabase/migrations/*.sql in order via a direct pg connection.
// Idempotent: each migration uses "if not exists" / "create or replace".
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { pgConnectionString } from "./_secrets.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.join(__dirname, "..", "supabase", "migrations");

async function main() {
  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  const client = new pg.Client({
    connectionString: pgConnectionString(),
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });
  await client.connect();
  console.log("Connected. Applying", files.length, "migrations...");

  for (const f of files) {
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, f), "utf8");
    process.stdout.write(`  ${f} ... `);
    await client.query(sql);
    console.log("ok");
  }

  await client.end();
  console.log("All migrations applied.");
}

main().catch((e) => {
  console.error("Migration failed:", e.message);
  process.exit(1);
});
