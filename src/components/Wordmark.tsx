import type { SVGProps } from "react";

/**
 * LOFTZ logo — faithful recreation of the commissioned "Option 1" identity
 * (dsoares / daniela.soares.design), rebuilt as inline SVG from the brand
 * presentation in `Website/Logos`. The wordmark's "O" is a keyhole ring with a
 * coral smile (keyhole + face); the "Z" carries a coral crescent. Navy ink +
 * coral, matching the shipped palette.
 *
 * `tone`:
 *  - "brand"  → navy ink + coral (light backgrounds: header)
 *  - "onDark" → white ink + coral (dark/teal backgrounds: footer)
 */
export function Wordmark({
  tone = "brand",
  className,
  ...props
}: SVGProps<SVGSVGElement> & { tone?: "brand" | "onDark" }) {
  const ink = tone === "onDark" ? "#ffffff" : "var(--color-ink)";
  const coral = "var(--color-coral)";
  return (
    <svg
      viewBox="0 0 314 104"
      role="img"
      aria-label="LOFTZ"
      className={`h-7 w-auto ${className ?? ""}`}
      {...props}
    >
      {/* L */}
      <path fill={ink} d="M12 18 h19 v50 h27 v18 h-46 z" />
      {/* O — keyhole ring */}
      <circle cx="100" cy="52" r="26" fill="none" stroke={ink} strokeWidth="17" />
      {/* coral smile under O */}
      <path
        d="M80 90 A20 20 0 0 0 120 90"
        fill="none"
        stroke={coral}
        strokeWidth="14"
        strokeLinecap="round"
      />
      {/* F */}
      <path fill={ink} d="M150 18 h19 v68 h-19 z" />
      <path fill={ink} d="M150 18 h42 v17 h-42 z" />
      <path fill={ink} d="M150 46 h35 v16 h-35 z" />
      {/* T */}
      <path fill={ink} d="M198 18 h56 v17 h-56 z" />
      <path fill={ink} d="M217 18 h19 v68 h-19 z" />
      {/* Z */}
      <path fill={ink} d="M258 18 h48 v16 h-48 z M258 70 h48 v16 h-48 z M290 34 h16 L274 70 h-16 z" />
      {/* coral crescent on top of Z */}
      <path
        d="M266 16 A15 15 0 0 0 296 16"
        fill="none"
        stroke={coral}
        strokeWidth="11"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Standalone mark (keyhole ring + coral smile) — favicon / app-icon scale. */
export function LoftzMark({
  tone = "brand",
  ...props
}: SVGProps<SVGSVGElement> & { tone?: "brand" | "onDark" }) {
  const ink = tone === "onDark" ? "#ffffff" : "var(--color-ink)";
  const coral = "var(--color-coral)";
  return (
    <svg viewBox="0 0 100 108" role="img" aria-label="LOFTZ" width="1em" height="1em" {...props}>
      <circle cx="50" cy="44" r="25" fill="none" stroke={ink} strokeWidth="17" />
      <path
        d="M28 84 A24 24 0 0 0 72 84"
        fill="none"
        stroke={coral}
        strokeWidth="15"
        strokeLinecap="round"
      />
    </svg>
  );
}
