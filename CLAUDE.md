# loftz.net — repo guide

Public marketing + direct-booking site for **LOFTZ** (65 rooms / 9 residences, Lisbon).
Phase 1 of the plan in `../../docs/01-DEVELOPMENT-PLAN.md`. Project constitution:
`../../CLAUDE.md` and `../../BACKLOG.md` (decisions D-*, questions Q-*) still govern.

## Repo layout & where outputs go (D-30)
This is the **`loftz-housing/loftz`** repo. The **Next.js app is at the repo root** (this
folder). Business artifacts live in siblings — put new outputs there, not in the app:
- `research/` — competitor/market research (+ screenshots)
- `ops/` — ops & process notes · `content/` — copy & brand assets · `data/` — data extracts

Company-wide **decisions/specs/questions** are NOT here — they live in the **`loftz-housing/workspace`**
repo (`../../` from this clone): `BACKLOG.md` there is the **source of truth for D-/Q- numbers**.
Add a decision there, then reference it here.

> ⚠️ **Next.js 16 — read `AGENTS.md`.** APIs differ from older Next: middleware is now
> `proxy.ts`; `params`/`searchParams`/`cookies`/`headers` are async (Promises); Turbopack
> is the default builder. When unsure, read `node_modules/next/dist/docs/`.

## Stack

- **Next.js 16** (App Router, TypeScript, React 19, Turbopack)
- **Tailwind CSS v4** — design tokens in `src/app/globals.css` (`@theme`). Neutral system
  (D-22); a future brand skin overrides tokens only. Light-mode only by design.
- **next-intl v4** — EN (default) + PT, `localePrefix: 'always'` → `/en`, `/pt`.
  Routing `src/i18n/routing.ts`; request config `src/i18n/request.ts`; copy in `messages/`.
- **Supabase** (`loftz` project) — Postgres. Public reads via publishable key + RLS.
  Writes go through the `submit_request` **SECURITY DEFINER** RPC (no secret key in use).
- **Resend** — booking/visit emails (owner notify + guest confirmation).
- **GA4** (`G-KXHFGFR7CB`) — Consent Mode v2, gated behind the cookie banner (EEA).

## Commands

```bash
npm run dev            # dev server (http://localhost:3000 → /en)
npm run build          # production build — MUST pass before "done"
npm run start          # serve the production build
npm run lint           # eslint

node scripts/apply-migrations.mjs        # apply supabase/migrations/*.sql (direct pg)
node scripts/seed-data.mjs               # seed residences + rooms + prices + OTA links
node scripts/setup-storage.mjs --open    # create room-photos bucket + temp upload policy
python scripts/migrate_photos.py         # Drive → downscale → Supabase Storage (resumable)
node scripts/load-photos.mjs             # insert photo rows from uploaded_photos.json
node scripts/setup-storage.mjs --close   # drop the temporary anon upload policy
```

Secrets are read at runtime from `~/.claude/secrets/` (never committed). Runtime env is in
`.env.local` (gitignored); see `.env.example`. Set the same vars in Vercel.

## Layout

- `src/app/[locale]/` — all pages (home, residences, book-now, rooms/[slug], landlords,
  partnerships, faq, about, legal/[doc]). Root `app/layout.tsx` is a pass-through.
- `src/app/api/requests/route.ts` — booking/visit submission (eligibility → RPC → email).
- `src/components/` — UI + feature components. `src/lib/` — data access, types, eligibility,
  format, supabase client, email. `src/content/legal.ts` — draft legal copy (D-23).
- `supabase/migrations/` — schema (0001), RLS (0002), functions (0003).

## Verify before declaring done

`npm run build` must pass, **and** drive the change in the running app
(`npm run dev`, open the affected page) — don't rely on the build alone.

## Guardrails

- Never commit secrets, `.env*`, or `*-sa.json`. Only publishable Supabase key + `G-` id
  are client-side.
- Legal pages are **draft-for-review** (D-23) — don't present as binding.
