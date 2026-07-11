// Creates the public `room-photos` bucket and (with --open) a TEMPORARY anon
// upload policy for the one-time migration; --close drops it again.
// Run: node scripts/setup-storage.mjs --open   (before migrate_photos.py)
//      node scripts/setup-storage.mjs --close  (after)
import pg from "pg";
import { pgConnectionString } from "./_secrets.mjs";

const mode = process.argv[2] ?? "--open";

const OPEN_SQL = `
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('room-photos','room-photos', true, 6291456,
        array['image/jpeg','image/webp','image/png'])
on conflict (id) do update set public = true;

drop policy if exists "migrate anon insert" on storage.objects;
drop policy if exists "migrate anon update" on storage.objects;
drop policy if exists "migrate public write" on storage.objects;
create policy "migrate public write" on storage.objects
  for all to public using (bucket_id = 'room-photos')
  with check (bucket_id = 'room-photos');
`;

const CLOSE_SQL = `
drop policy if exists "migrate anon insert" on storage.objects;
drop policy if exists "migrate anon update" on storage.objects;
drop policy if exists "migrate public write" on storage.objects;
`;

async function main() {
  const client = new pg.Client({
    connectionString: pgConnectionString(),
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });
  await client.connect();
  await client.query(mode === "--close" ? CLOSE_SQL : OPEN_SQL);
  await client.end();
  console.log(mode === "--close" ? "Storage upload policy removed." : "Bucket ready + anon upload policy open.");
}
main().catch((e) => {
  console.error("setup-storage failed:", e.message);
  process.exit(1);
});
