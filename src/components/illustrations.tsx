import type { SVGProps } from "react";

/**
 * Flat, hand-made brand illustrations (D-29 / assignment topic 1).
 *
 * Two-tone flat style: teal surfaces + coral accents on a soft surface disc,
 * echoing the circular step figures in the 2020 wireframe. Colours are read
 * from CSS tokens so a palette swap flows through. No external stock.
 */

type Props = SVGProps<SVGSVGElement>;

const teal = "var(--color-accent)";
const tealSoft = "var(--color-accent-soft)";
const coral = "var(--color-coral)";
const ink = "var(--color-ink)";
const disc = "var(--color-surface-2)";

function Frame({ children, ...props }: Props & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 160 160" width="1em" height="1em" role="img" {...props}>
      <circle cx="80" cy="80" r="80" fill={disc} />
      {children}
    </svg>
  );
}

/** "How it works" — a suitcase / discover step. */
export function IllusDiscover(p: Props) {
  return (
    <Frame aria-label="Discover how it works" {...p}>
      <rect x="46" y="58" width="68" height="54" rx="8" fill={teal} />
      <rect x="46" y="58" width="68" height="18" rx="8" fill={tealSoft} />
      <path d="M66 58v-8a6 6 0 0 1 6-6h16a6 6 0 0 1 6 6v8" fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" />
      <rect x="76" y="70" width="8" height="42" rx="4" fill="#fff" opacity="0.85" />
      <circle cx="80" cy="120" r="7" fill={coral} />
    </Frame>
  );
}

/** "How it works" — visit a residence step (a flat house). */
export function IllusResidence(p: Props) {
  return (
    <Frame aria-label="Visit a residence" {...p}>
      <path d="M44 84 80 54l36 30v30a4 4 0 0 1-4 4H48a4 4 0 0 1-4-4Z" fill={teal} />
      <path d="M40 86 80 52l40 34" fill="none" stroke={ink} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="70" y="96" width="20" height="22" rx="3" fill="#fff" />
      <rect x="54" y="92" width="12" height="12" rx="2" fill={tealSoft} />
      <rect x="94" y="92" width="12" height="12" rx="2" fill={tealSoft} />
      <circle cx="86" cy="107" r="2.2" fill={coral} />
    </Frame>
  );
}

/** "How it works" — list your property step (a key). */
export function IllusLandlord(p: Props) {
  return (
    <Frame aria-label="List your property" {...p}>
      <circle cx="66" cy="72" r="20" fill="none" stroke={teal} strokeWidth="10" />
      <circle cx="66" cy="72" r="6" fill={disc} />
      <path d="M80 84 108 112" stroke={teal} strokeWidth="10" strokeLinecap="round" />
      <path d="M98 102l8 8M90 94l6 6" stroke={coral} strokeWidth="8" strokeLinecap="round" />
    </Frame>
  );
}

/** Small inline spot: a location pin over a map card (used in empty states). */
export function IllusMap(p: Props) {
  return (
    <Frame aria-label="Map" {...p}>
      <rect x="40" y="46" width="80" height="68" rx="8" fill="#fff" />
      <path d="M40 92 62 78l24 12 34-20v44a2 2 0 0 1-2 2H42a2 2 0 0 1-2-2Z" fill={tealSoft} />
      <path d="M92 58c9 0 16 7 16 16 0 11-16 24-16 24S76 85 76 74c0-9 7-16 16-16Z" fill={coral} />
      <circle cx="92" cy="74" r="6" fill="#fff" />
    </Frame>
  );
}
