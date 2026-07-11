# LOFTZ — build state & next steps

**Status: Phase 1 build scope (plan items 1.1–1.6) complete.** Branch `build/phase-1`
pushed to `loftz-housing/website`. `npm run build` passes; app verified end-to-end on a
local production server (all pages render with real photos in EN + PT; booking/visit
pipeline writes to the DB via the `submit_request` RPC).

## What's live in this repo
- Next.js 16 (App Router, TS, Turbopack) + Tailwind v4 neutral design system (D-22).
- next-intl EN/PT (`/en`, `/pt`); full bilingual copy in `messages/`.
- Supabase `loftz`: schema + RLS + RPC in `supabase/migrations/`. **9 residences /
  65 rooms** seeded with real monthly prices, OTA links, and iCal feeds. **381 room/
  common-area photos** migrated from Drive (downscaled) to the public `room-photos` bucket.
- Pages: home, residences (+detail), book-now (filters), rooms/[slug] (gallery, conditions,
  also-featured-in, booking+visit forms), landlords, partnerships, FAQ, about, legal.
- Booking + visit forms → eligibility check (D-18/19) → DB → Resend emails.
- GA4 Consent Mode + cookie banner, sitemap, robots, per-page meta/OG, FAQ JSON-LD.

## Follow-ups (in rough priority)

1. **Resend domain verification (blocks real emails).** `.env.local` uses
   `onboarding@resend.dev`, which only delivers to the Resend account owner. Verify
   `loftz.net` in Resend (needs DNS — tied to the Cloudflare move, plan 0.6) and set
   `BOOKING_FROM_EMAIL` to e.g. `bookings@loftz.net`. Until then, guest confirmations
   won't reach arbitrary addresses.
2. **MA2 photos missing (7 rooms).** The Drive `2. Apartments` folder has `ET1`/`ET2`
   instead of an `MA2` folder; mapping is ambiguous, so MA2 rooms currently have no
   photos (they render the neutral placeholder). Ask Henrique which Drive folder(s) are
   MA2, add the mapping in `scripts/migrate_photos.py` (`CODE_MAP`), re-run
   `setup-storage --open` → `migrate_photos.py` → `load-photos.mjs` → `--close`.
3. **Deploy (plan 1.7/1.8).** Connect the repo to Vercel; set env vars from `.env.example`
   (Supabase URL + publishable key, `RESEND_API_KEY`, `BOOKING_*`, `NEXT_PUBLIC_GA_ID`,
   `NEXT_PUBLIC_SITE_URL`). Then DNS → Cloudflare (Q-01/0.6) and point loftz.net at Vercel.
4. **Daily DB backup (1.7 / D-20).** `pg_dump` → object storage (n8n or GitHub Action).
5. **Search Console + Meta/Google pixels (finish 1.6).** Search Console verification needs
   DNS. Pixels + conversion events (request submitted) to wire once ad accounts exist.
6. **Supabase secret key.** Not captured (Management API PAT is scope-limited → 403). The
   site works without it (public reads + definer RPC). Grab it from the dashboard when an
   admin area (Phase 2) needs privileged writes; then the migration scripts could use it
   instead of the temporary anon storage policy.
7. **Admin (Phase 2).** Rooms carry fields for `size_m2`, `bed_type`, `description`,
   `features`, `available_from`, and per-room eligibility — all nullable now, to be filled
   via the Phase 2 admin. Availability table + iCal import (2.2–2.4) not yet built.

## Gotchas discovered
- **Next 16 build cache** reused stale prerenders when only external DB data changed
  (photos looked missing until `.next` was cleared). Catalog pages now use ISR
  (`revalidate = 3600`); a clean deploy rebuilds fresh anyway.
- Direct Postgres connection works (`db.<ref>.supabase.co:5432`); the regional pooler
  hostname did not resolve. Scripts read the DB password from `~/.claude/secrets`.
