import type { SVGProps } from "react";

/**
 * LOFTZ wordmark + mark (refined from the 2020 wireframe, D-29).
 *
 * The mark is a rounded "roundel" (a stylised residence/door) with a coral
 * window dot — teal identity + coral action, the two brand colours. The
 * wordmark text is set in the display font by the consuming element.
 *
 * `tone`:
 *  - "brand"  → teal roundel, ink text (light header / on white)
 *  - "onDark" → white roundel outline, white text (teal footer / on colour)
 *
 * Ships as the wordmark per the assignment; final art swaps in later.
 */
export function Wordmark({
  tone = "brand",
  showText = true,
  className,
  markSize = 28,
  ...props
}: SVGProps<SVGSVGElement> & {
  tone?: "brand" | "onDark";
  showText?: boolean;
  markSize?: number;
}) {
  const onDark = tone === "onDark";
  return (
    <span
      className={`inline-flex items-center gap-2 ${className ?? ""}`}
      aria-label="LOFTZ"
    >
      <LoftzMark tone={tone} width={markSize} height={markSize} {...props} />
      {showText && (
        <span
          className="font-display text-2xl font-semibold tracking-tight"
          style={{ color: onDark ? "#ffffff" : "var(--color-ink)" }}
          aria-hidden="true"
        >
          LOFTZ
        </span>
      )}
    </span>
  );
}

/** The standalone mark (roundel), usable as a favicon-scale glyph. */
export function LoftzMark({
  tone = "brand",
  ...props
}: SVGProps<SVGSVGElement> & { tone?: "brand" | "onDark" }) {
  const onDark = tone === "onDark";
  const roundel = onDark ? "none" : "var(--color-accent)";
  const stroke = onDark ? "#ffffff" : "none";
  const house = onDark ? "#ffffff" : "#ffffff";
  const dot = "var(--color-coral)";
  return (
    <svg
      viewBox="0 0 32 32"
      width="1em"
      height="1em"
      role="img"
      aria-label="LOFTZ"
      {...props}
    >
      <rect
        x="1.25"
        y="1.25"
        width="29.5"
        height="29.5"
        rx="9"
        fill={roundel}
        stroke={stroke}
        strokeWidth={onDark ? 2 : 0}
      />
      {/* Stylised residence: roofline + body, flat */}
      <path
        d="M16 7.5 L24.5 14 V24 a1 1 0 0 1-1 1 H8.5 a1 1 0 0 1-1-1 V14 Z"
        fill={house}
        opacity={onDark ? 0.16 : 0.18}
      />
      <path
        d="M16 7 L25 14"
        fill="none"
        stroke={house}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M16 7 L7 14"
        fill="none"
        stroke={house}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Coral window/door dot = the "action" accent */}
      <rect x="13.6" y="16.4" width="4.8" height="7.6" rx="1.4" fill={dot} />
    </svg>
  );
}
