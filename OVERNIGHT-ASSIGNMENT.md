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
- Design = refine the 2020 wireframe, **hug it closely**, keep teal+coral (D-29). Reference
  the mockups at `/test/home` and `/test/room`.
- Illustrations = generate **simple in-house inline SVGs** (teal), no external stock/fonts-CDN.
- Logo = "LOFTZ" wordmark.
- Extra languages = **ES, IT, FR, DE**.
- Stats numbers = keep placeholders (admin-editable).
- Testimonials = omit (no fakes).
- Blog = 4–5 Lisbon/"Erasmus in Lisbon" guides, EN+PT, drafted (mark draft).

## Work order (priority; each = its own commit(s))
1. **Design pass** — apply the wireframe-faithful skin across every page + component
   (header, hero, 8 value props, stats band, residences, book-now list, room detail incl.
   sticky booking bar + availability calendar, landlords, about, faq, footer, legal, forms).
   Mobile-first, light mode. Reuse/extend design tokens in `globals.css`; don't hardcode hex.
2. **Room pages** — bring to wireframe fidelity (gallery, facts, contents grid, transports,
   location, availability, similar rooms, also-featured-in). Fold in here.
3. **MA2 photos** — a `MA2` folder now exists in Drive `2. Apartments`. Add it to
   `scripts/migrate_photos.py` `CODE_MAP` (`"MA2": ("MA2","ma-2")`), then run:
   `setup-storage.mjs --open` → `migrate_photos.py` → `load-photos.mjs` → `setup-storage.mjs --close`.
   Verify MA2's 7 rooms get photos.
4. **Languages ES/IT/FR/DE** — add to `src/i18n/routing.ts`; create `messages/{es,it,fr,de}.json`
   (translate from `en.json`, full parity); language switcher already scales. Verify build.
5. **Automated tests** — unit tests for `lib/eligibility.ts` + `lib/ical.ts` (add a test runner,
   e.g. `vitest`); a smoke test hitting key routes. Wire `npm test`.
6. **SEO content** — a `/[locale]/guides` section: 4–5 AI-drafted Lisbon/Erasmus guides
   (EN+PT), linked in nav/footer, in sitemap, per-page meta + Article JSON-LD. Mark draft.
7. **A11y/perf sweep** — alt text, labels, focus, heading order, image sizes; fix findings.

## Verify before "done"
`npm run build` + `npm run lint` green; drive changed pages on a local prod server
(`npm run start`) via Node `fetch`. Update `NEXT.md` + `docs/08-LOFTZ-DESIGN-FEEDBACK.md`
as work lands. Leave the tree building-green at all times.
