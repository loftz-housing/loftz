# LOFTZ — brand context

Shared brand truth for **both Claude Code and Claude Design**. Every value here is
derived from the code (`src/app/globals.css @theme`, `public/brand/`, `src/components/Wordmark.tsx`)
and the project constitution — treat those as source of truth and keep this in step when they change.

## 1. Positioning & audience

LOFTZ is a Lisbon room-rental business renting its **own portfolio — 65 rooms across 9 named
residences** — to **students and young workers, 18–30, Portuguese and international**. The site is
a portfolio + **direct booking requests** (no account needed) and **landlord acquisition (B2B)**.
It is one legal entity with Erasmus Lisboa but a **distinct brand** (see §7).

## 2. Voice & tone

Warm, trustworthy, airy, **premium but approachable**. Speaks plainly to a young international
audience; confident, not corporate.

- **Do:** clear benefit-first lines ("bills, cleaning and fast Wi-Fi included"), friendly, human.
- **Don't:** hype, jargon, pressure tactics, cold real-estate-agent tone.

## 3. Logo

Canonical mark (**D-31**): navy **L-O-F-T-Z** wordmark with a **single coral smile under the "O"**
(keyhole/face). No crescent on the Z — the older two-crescent variant is retired.

- Full kit: `public/brand/` (wordmark + mark, black / white / reversed / mono, SVG + PNG, favicons, OG).
- In app it renders via `src/components/Wordmark.tsx` (`Wordmark` / `LoftzMark`), tone-switchable.
- **Tone:** `brand` = navy ink + coral (light backgrounds, header); `onDark` = white ink + coral (dark/teal, footer).

## 4. Colours (exact, from `@theme`)

| Role | Hex |
|---|---|
| Ink / brand navy | `#1A2D3F` |
| Coral — primary CTA (Book now, submit) | `#E96054` (hover `#d24e3f`) |
| Accent — brand teal (links, eyebrows, section headings) | `#0e9cb8` (hover `#0b7f97`) |
| Background / surfaces | `#ffffff` · `#f3f7f8` · `#e7eef0` |
| Ink-soft / muted / lines | `#3a4a52` · `#6b7a80` · `#e3eaec` |
| Success / danger | `#1f7a44` · `#d23f2a` |

## 5. Typography

- **Display (headings):** Poppins — weight 600, tight letter-spacing (-0.02em).
- **Body:** Geist. **Mono:** Geist Mono.

## 6. Shape & surface

Friendly and rounded. Radius scale `0.5rem → 1.75rem` (sm→xl); **pill CTAs**; soft card + lift
shadows; container max `1200px`. **Light-mode only by design** — a property brochure reads best on
a bright, airy canvas.

## 7. Brand-separation guardrail (D-02)

LOFTZ and Erasmus Lisboa share a legal entity and infra but **not identity**. Keep LOFTZ warm +
teal + Poppins. Never borrow Erasmus Lisboa's indigo / Space Grotesk / marketplace styling, and
never let one brand's assets bleed into the other.

## Source of truth

- Tokens: `src/app/globals.css` (`@theme`)
- Logo files: `public/brand/` · logo component: `src/components/Wordmark.tsx`
- Positioning & rules: `../../CLAUDE.md`, `../../BACKLOG.md` (D-02, D-29, D-31)
