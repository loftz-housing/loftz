# Assignment — Trace the LOFTZ logo perfectly (vector)

**Goal:** Produce a pixel-accurate vector (SVG) of the existing **LOFTZ** brand logo — the
commissioned "Option 1" identity by dsoares (daniela.soares.design) — and wire it into the site.
A previous hand-built approximation was not good enough; this must match the original exactly.

## Source of truth (read these first)
- `Website/Logos/Apresentacao_Logo_LOFTZ.pdf` — the brand deck. **Use "OPÇÃO UM" (Option 1)**:
  - **p.5** — the clean full-colour wordmark on light grey (the master artwork to match).
  - **p.4** — the construction grid (letter geometry, proportions, alignment).
  - **p.6** — the standalone **mark** (ring + crescent), navy.
  - **p.8–9** — approved colour variants (on light / navy / coral).
  - Ignore "OPÇÃO DOIS" (Option 2, the blue lowercase "key" concept, p.15–27) — not chosen.
- `Website/Logos/Apresentacao_Logo_LOFTZ_02B.pdf` — same deck, alt export (cross-check).
- The 2020 site mockup (deck p.14) shows Option 1 in the header — that's the target usage.

> Note: there is **no editable `.AI`/`.SVG`** in the repo, only these PDFs. The PDFs are **vector**,
> so the paths can be extracted rather than eyeballed — do that (see Method).

## What the logo is (anatomy — Option 1)
- Wordmark **"LOFTZ"** in a bold, geometric custom sans. `L`, `F`, `T` are heavy geometric letters.
- **`O`** = a thick perfect-circle **ring** (a keyhole) with a **coral smile/crescent directly
  beneath it** — together they read as a face + keyhole. The coral smile dips **below the baseline**.
- **`Z`** = geometric Z with a small **coral crescent accent at its top**.
- Tight kerning; the two coral crescents are the only non-navy elements.
- **Mark** (icon-only) = the `O` ring + the coral (or navy) smile beneath — the keyhole/face on its own.

## Colours
**Sample the exact hex values from the PDF** (don't trust these approximations):
- Navy ink ≈ `#16232a`  ·  Coral ≈ `#f26a45`.
Deliver with the sampled values, and note them.

## Method (how to get it exact)
1. **Extract the real vector** from the PDF rather than tracing by eye. Options:
   - Open the PDF in Illustrator/Inkscape → isolate the Option-1 lockup + the mark → export as SVG.
   - Or CLI: `pdf2svg` / `mutool draw -o out.svg` / `inkscape --export-type=svg`, then pull the
     relevant `<path>`s.
2. Convert any strokes to filled paths; **merge/clean** with SVGO. Normalise to a tight `viewBox`
   with no stray transforms or clip paths.
3. **Verify by overlay:** place your SVG at ~60% opacity over p.5 at matched scale. Ring thickness,
   letter widths, kerning, smile curvature and the Z accent must line up. Cross-check proportions
   against the construction grid (p.4).

## Deliverables
Put SVGs in `sites/loftz/public/brand/` and update the component:
1. `loftz-logo.svg` — full 2-colour lockup (navy + coral), transparent background, tight viewBox.
2. `loftz-logo-mono.svg` — single-colour lockup using `currentColor` (for 1-colour contexts).
3. `loftz-mark.svg` — standalone mark, 2-colour **and** a mono variant.
4. **Update `src/components/Wordmark.tsx`** — keep the **exact same exports and API** so nothing
   else needs to change:
   - `Wordmark({ tone }: { tone?: "brand" | "onDark" })` and `LoftzMark({ tone })`.
   - `tone="brand"` → ink = `var(--color-ink)`, coral = `var(--color-coral)`.
   - `tone="onDark"` → ink = `#ffffff`, coral = `var(--color-coral)`.
   - Default height `h-7 w-auto`; `role="img"` + `<title>LOFTZ</title>`.
   - Header, footer and the OG card (`src/lib/og.tsx`) already consume these — don't change them.

## Acceptance criteria
- Overlay on the original (p.5) matches within a hair at 100%.
- Renders crisply from **16px favicon** to large hero size; no fuzzy edges.
- Legible on **white, navy `#16232a`, coral `#f26a45`, and teal `#0e9cb8`** backgrounds.
- `npm run build && npm run lint` pass; header/footer/OG show the new logo.
- Regenerate `content/logo-options.pdf` from the new SVG so the deliverable matches.

## Guardrails (from the project)
- Work on branch **`build/phase-2`** (or a new branch off it). **Never push to `main`.**
- **Read-only** on `Website/` (a hook blocks writes there) — extract from it, don't modify it.
- Commit only after build + lint pass.
