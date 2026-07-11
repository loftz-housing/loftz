import "server-only";
import { Pool } from "pg";

// Direct Postgres pool for admin writes (D-27) — no Supabase service key needed.
// Uses DATABASE_URL (server-only env). A module-level pool is reused across
// requests in the Node runtime.
declare global {
  // eslint-disable-next-line no-var
  var _loftzPool: Pool | undefined;
}

export const pool =
  global._loftzPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 3,
  });

if (process.env.NODE_ENV !== "production") global._loftzPool = pool;

export async function query<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const res = await pool.query(text, params);
  return res.rows as T[];
}
