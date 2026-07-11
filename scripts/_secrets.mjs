// Reads credentials from C:\Users\santa\.claude\secrets\ at runtime.
// Secrets NEVER live in the repo (guardrail). This file only holds paths.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const SECRETS_DIR = path.join(os.homedir(), ".claude", "secrets");

function parseEnvFile(file) {
  const out = {};
  const text = fs.readFileSync(file, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) out[m[1]] = m[2].trim();
  }
  return out;
}

export function supabaseSecrets() {
  return parseEnvFile(path.join(SECRETS_DIR, "supabase.txt"));
}

export function resendSecrets() {
  return parseEnvFile(path.join(SECRETS_DIR, "resend.txt"));
}

// Direct Postgres connection string (pooler tenant lookup failed in this region;
// the direct db.<ref>.supabase.co:5432 host works).
export function pgConnectionString() {
  const s = supabaseSecrets();
  const ref = s.SUPABASE_PROJECT_REF;
  const pw = encodeURIComponent(s.SUPABASE_DB_PASSWORD);
  return `postgresql://postgres:${pw}@db.${ref}.supabase.co:5432/postgres`;
}

export const SA_KEY_PATH = path.join(SECRETS_DIR, "loftz-drive-sa.json");
