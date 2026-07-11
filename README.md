# loftz.net

LOFTZ — marketing + direct-booking site for the LOFTZ portfolio (65 rooms / 9 residences,
Lisbon). This repo is the Next.js 16 app (at the repo root) plus business folders. A brand of
**Abstract Tomorrow Unip Lda** (D-02). Private.

## Start here
- **`CLAUDE.md`** — stack, commands, repo layout, guardrails (read first).
- **Company decisions / specs / open questions** live in the **`loftz-housing/workspace`**
  repo — `BACKLOG.md` there is the source of truth for `D-`/`Q-` numbers.

## Layout
- App at the repo root (`src/`, `supabase/`, `messages/`, `scripts/`).
- Business artifacts in siblings: `research/` · `ops/` · `content/` (copy & brand) ·
  `data/` (extracts).

## Dev
```bash
npm install
npm run dev      # http://localhost:3000 → /en
npm run build    # must pass before "done"
```
Runtime env in `.env.local` (gitignored); see `.env.example`.
