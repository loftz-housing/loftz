# LOFTZ — Overnight Assignment (single unattended pass)

Run this end-to-end, unattended, without stopping. Commit + push after every topic.
LOFTZ only (no Erasmus Lisboa). No token cap — go until you can't.

## Read first
`CLAUDE.md`, `AGENTS.md` (Next 16 differences), `NEXT.md`, and this file. Constitution +
D-numbers live in the `loftz-housing/workspace` repo at `../../` (BACKLOG.md).

## Branch + deploy (IMPORTANT)
- Work on a branch: **`git checkout -b build/phase-2`** off `main`. Commit + push there.
- **Never push to `main`.** Pushing `build/phase-2` gives a Vercel **preview URL** Henrique
  reviews in the morning; `main`/loftz.net stays stable. He merges later.
- After each topic: `npm run build` AND `npm run lint` must pass, then commit + push.

## Hard guardrails (a stop = failure)
- **Never** run commands that prompt: `rm`/`rmdir`/`git rm`/`git clean`/`Remove-Item`,
  `gh`/`curl`/`wget`/`Invoke-*`, `npm publish`. Use Node `fetch` for HTTP. **No deletes —
  overwrite files only** (to "remove" a route, empty/redirect it, don't delete).
- Never write into `Website/` (hook blocks it). Never commit secrets/`.env*`/`*-sa.json`.
- Secrets stay in `~/.claude/secrets` + `.env.local`. DB writes via direct pg (`DATABASE_URL`)
  or the definer RPCs — no service key exists.
- If blocked/rate-limited: commit progress, update `NEXT.md` (state + next steps), stop clean.
- Next 16: read `node_modules/next/dist/docs/` when unsure (proxy.ts, async params, Turbopack).

## Locked decisions (do NOT re-ask)
- Design = **faithful refinement** of the 2020 wireframe (reference `/test/home`, `/test/room`),
  keep **teal + coral**. Apply this to the live site.
- **Palette-options deliverable:** produce **up to 3 alternative palettes** applied to a home
  mockup → `content/palette-options.pdf` (review-only; do NOT change the site — teal+coral ships).
- Illustrations = keep illustrated figures, **flat style**, hand-made inline SVGs (no external stock).
- Logo = refined **wordmark + a small symbol/mark**. Site ships the wordmark; final art swaps in
  after Henrique picks. **Logo-options deliverable:** **up to 10 variations** → `content/logo-options.pdf`.
- PDFs: generate real PDFs if a headless renderer/pdf skill is available; else output print-ready
  HTML + SVG in `content/` and note it. Non-blocking — never stop the pass for these.
- Extra languages = **ES, IT, FR, DE**, full-site translation.
- Stats numbers = placeholders. Testimonials = omit. **No blog/guides.**

## Work order (priority; each = its own commit(s))
1. **Design pass** — apply the wireframe-faithful skin (teal+coral) across every page +
   component (header, hero, 8 value props, stats band, residences, book-now list, room detail
   incl. sticky booking bar + availability calendar, landlords, about, faq, footer, legal,
   forms) + flat illustrations + refined wordmark. Mobile-first, light mode. Reuse/extend
   tokens in `globals.css`; don't hardcode hex. Then produce the two review deliverables:
   `content/logo-options.pdf` (≤10 logo variations) and `content/palette-options.pdf`
   (≤3 alt palettes on a home mockup). Site stays teal+coral + wordmark regardless.
2. **Room pages** — bring to wireframe fidelity (gallery, facts, contents grid, transports,
   location, availability, similar rooms, also-featured-in).
3. **MA2 photos** — MA2 folder now exists in Drive `2. Apartments` (name may be `MA2`, `MA 2`
   or `LOFTZ | MA2`). Add matching keys to `scripts/migrate_photos.py` `CODE_MAP`
   (`"MA2"` and `"MA 2"` → `("MA2","ma-2")`); log folders found so a mismatch is visible. Then run:
   `setup-storage.mjs --open` → `migrate_photos.py` → `load-photos.mjs` → `setup-storage.mjs --close`.
   Verify MA2's 7 rooms get photos.
4. **Languages ES/IT/FR/DE** — add to `src/i18n/routing.ts`; create `messages/{es,it,fr,de}.json`
   (translate from `en.json`, full parity); language switcher already scales. Verify build.
5. **Automated tests** — unit tests for `lib/eligibility.ts` + `lib/ical.ts` (add a runner,
   e.g. `vitest`); a smoke test hitting key routes. Wire `npm test`.
6. **Dynamic OG images** — per-room + per-residence `opengraph-image` (Next 16 file convention,
   async params). Verify they render and are referenced in metadata.
7. **Availability-aware booking** — use the synced `availability` data to block/flag
   unavailable check-in/out dates in the booking form + show them on the room calendar
   (min date, disable/mark busy ranges). Server-validate in `/api/requests`.
8. **Abuse guard on public writes** — add lightweight rate-limiting / basic validation to
   `submit_request` + `/api/contact` (e.g. per-IP throttle via a small table or in-memory +
   honeypot field). Closes the security residual. No new external service.
9. **Admin upgrades** — requests **CSV export**; **photo reorder + upload** (via the
   `room-photos` bucket, admin-only, direct-pg + storage); **iCal sync status** (last-synced /
   busy-count per room).
10. **Polish** — `loading.tsx` skeletons for data routes; branded `not-found` + `error.tsx`;
    image blur placeholders (`placeholder="blur"` where feasible).
11. **Deeper tests (e2e)** — Playwright flows for home → book-now → room → submit request
    (mock/guard the email), language switch, admin login. Wire into `npm test` or `npm run e2e`.
12. **A11y/perf sweep** — alt text, labels, focus, heading order, image sizes; fix findings.
    Do this LAST (sweeps everything above).

## Verify before "done"
`npm run build` + `npm run lint` green; drive changed pages on a local prod server
(`npm run start`) via Node `fetch`. Update `NEXT.md` + `docs/08-LOFTZ-DESIGN-FEEDBACK.md`
as work lands. Leave the tree building-green at all times.
