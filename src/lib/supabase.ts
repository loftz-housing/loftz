import { createClient } from "@supabase/supabase-js";

// Public, read-only Supabase client (publishable/anon key). Used from server
// components for catalog reads and from route handlers to call RPCs. RLS keeps
// guest data private; writes go through the submit_request() RPC (0003).
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  // Fail loudly in dev; in prod the env must be set in Vercel.
  console.warn(
    "[supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY missing"
  );
}

export const supabase = createClient(url ?? "", key ?? "", {
  auth: { persistSession: false, autoRefreshToken: false },
});
