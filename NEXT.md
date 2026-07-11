# LOFTZ — build state & next steps

**Status: Phase 1 (1.1–1.6) + Phase 2 (admin, iCal, availability) complete + brand skin.**
Branch **`main`** on `loftz-housing/loftz` (production branch; Vercel auto-deploys on push).
`npm run build` passes; verified on a local prod server.

## 🌙 Overnight pass — branch `build/phase-2` (2026-07-12)
Unattended run against `OVERNIGHT-ASSIGNMENT.md` (12 topics). Preview branch only — never `main`.
Each topic: build + lint green, then commit + push. Progress:

- [x] **1. Design pass** — refined wordmark **+ mark** (`Wordmark.tsx`, teal roundel + coral door),
      flat hand-made SVG illustrations (`illustrations.tsx`), new **How-it-works** 3-step band on home,
      defined the site-wide `.prose-muted` utility (was referenced everywhere but undefined → muted body
      copy now actually renders). Deliverables: `content/logo-options.pdf` (10 variations) +
      `content/palette-options.pdf` (teal+coral baseline + 3 alternatives). Teal+coral + wordmark still ship.
- [x] **2. Room pages** — added an "at a glance" facts grid (location/type/occupancy/size),
      an "In the apartment" facilities list, a single-pin **Location map** (`RoomMap.tsx`) +
      Get-directions link, a check-grid for room contents, and a mobile **sticky booking bar**
      (`StickyBookingBar.tsx` → scrolls to `#request`). Also fixed a site-wide SEO bug: page
      titles double-suffixed (`… | LOFTZ | LOFTZ`) because meta strings *and* the layout template
      both added the brand — removed the suffix from the strings (EN+PT). Transports section skipped
      (no distance data in the schema).
- [x] **3. MA2 photos** — the folder is `11. LOFTZ MA2` (**no pipe**), so the old label split
      missed it. Added a `norm_label()` (strips `N.` numbering + a leading `LOFTZ` token) + MA2
      `CODE_MAP` keys + folder logging + a `--dry-run`. Ran the full chain (open → migrate → load →
      close): **45 photos uploaded, all 7 MA2 rooms now have photos** (2–6 each). DB photos 381 → 426.
- [x] **4. Languages ES/IT/FR/DE** — added the 4 locales to `routing.ts`; created
      `messages/{es,it,fr,de}.json` at **full parity** (326 keys each, 0 missing/extra, ICU tokens
      intact). Layout `alternates.languages` now derives from `routing.locales`. Build prerenders
      **509 static pages** across 6 locales, no ICU errors; switcher already scales.
- [x] **5. Automated tests** — added **vitest** (`vitest.config.ts`, `@` alias). Unit tests:
      `eligibility.test.ts` (13) + `ical.test.ts` (7) = **20 passing** (one caught a wrong test
      assumption about RFC 5545 unfolding — fixed the test, lib was right). Route **smoke test**
      (`test/smoke.test.ts`) boots `next start` and asserts 10 public routes + a room page + a 404 =
      12 passing. Scripts: `npm test` (unit, fast), `test:watch`, `test:smoke`.
- [x] **6. Dynamic OG images** — branded 1200×630 cards via the Next 16 `opengraph-image` file
      convention (async params) for **rooms** and **residences** (`src/lib/og.tsx` shared card:
      real photo + teal gradient + wordmark + eyebrow + coral price pill). Removed the room page's
      manual `openGraph.images` so the dynamic card is the referenced image. Verified: both routes
      return valid `image/png`, `og:image` meta points at them.
- [ ] 7. Availability-aware booking · [ ] 8. Abuse guard · [ ] 9. Admin upgrades · [ ] 10. Polish
- [ ] 11. E2E tests · [ ] 12. A11y/perf sweep (last)

## Tracking + hardening (2026-07-11, pass A+B)
- **GA4 conversion events:** `booking_request`, `visit_request`, `contact_message`,
  `search_rooms` (consent-mode safe) — `src/lib/track.ts`.
- **Structured data:** Organization + WebSite (site-wide), Accommodation+Offer (rooms),
  FAQPage (FAQ); per-room canonical + OG image.
- **Daily DB backup:** `.github/workflows/backup.yml` (pg_dump → gzip → 90-day artifact).
  ⚠️ Add repo secret **`DATABASE_URL`** (Settings → Secrets → Actions) to arm it.
- **Security pass:** RLS on all tables ✓, temp storage upload policy dropped ✓, no secrets
  tracked ✓, admin actions all `requireAdmin` + parameterized SQL ✓. Accepted MVP residual:
  `submit_request`/`replace_availability` are anon-executable (spam/overwrite; low value,
  nightly-refreshed) — revisit with rate-limiting/secret when it matters. Lint clean.

## Phase 2 + brand (2026-07-11)
- **Brand skin (D-29):** teal + coral, Poppins headings, pill CTAs, teal footer.
- **Admin at `/admin`** — password gate (D-27). Credentials in `.env.local` +
  `~/.claude/secrets/loftz-admin.txt` (also set `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`,
  `DATABASE_URL` in Vercel at deploy). CRUD: rooms, residences, per-room eligibility,
  requests inbox, editable homepage stats.
- **iCal:** export `/api/ical/{slug}.ics`; `replace_availability` RPC; `scripts/sync-ical.mjs`
  (ran: 141 busy periods). Room pages show an 8-month availability calendar.
- **n8n nightly sync** (Flatio n8n cloud, workflow `Cu8QRLVDygjuXjyi`, **active**, daily
  04:00 Lisbon) — fetches 65 Google feeds → `replace_availability`. Verified via a manual run.
- **1:1 wireframe mockups** at `/test/home` and `/test/room` (comparison only).

## Phase 1

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

## ⚠️ CRUCIAL pre-launch (A-15)
The repo was made **PUBLIC** on 2026-07-11 to deploy free on Vercel **Hobby**. Before real
commercial launch, both MUST happen: **(1) upgrade Vercel to Pro** (Hobby is non-commercial
per ToS) and **(2) set the repo PRIVATE again** (reverts D-10). Same for EL at its launch.

## Follow-ups (in rough priority)

1. **Resend domain verification (blocks real emails).** `.env.local` uses
   `onboarding@resend.dev`, which only delivers to the Resend account owner. Verify
   `loftz.net` in Resend (needs DNS — tied to the Cloudflare move, plan 0.6) and set
   `BOOKING_FROM_EMAIL` to e.g. `bookings@loftz.net`. Until then, guest confirmations
   won't reach arbitrary addresses.
2. ~~**MA2 photos missing (7 rooms).**~~ **RESOLVED (2026-07-12, build/phase-2.)** Folder is
   `11. LOFTZ MA2` (no pipe). Added `norm_label()` + MA2 `CODE_MAP` keys and ran the full chain —
   45 photos, all 7 rooms covered. DB photos 381 → 426.
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
