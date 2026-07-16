import type { SVGProps } from "react";

/**
 * LOFTZ logo — the canonical identity (D-31), traced from the brand kit in
 * `public/brand/loftz-logo.svg` ("Alternativa C"): navy L-O-F-T-Z letterforms
 * with a single coral smile under the "O" (the keyhole/face). No crescent on
 * the "Z" — that two-crescent variant is retired.
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
      viewBox="0 0 354.089 110.541"
      role="img"
      aria-label="LOFTZ"
      className={`h-7 w-auto ${className ?? ""}`}
      {...props}
    >
      <title>LOFTZ</title>
      <path
        fill={ink}
        d="M 93.106 62.059 C 81.029 62.059, 71.203 52.233, 71.203 40.156 C 71.203 28.079, 81.029 18.253, 93.106 18.253 C 105.184 18.253, 115.009 28.079, 115.009 40.156 C 115.009 52.233, 105.184 62.059, 93.106 62.059 M 93.106 0.000 C 70.964 0.000, 52.951 18.014, 52.951 40.156 C 52.951 62.298, 70.964 80.311, 93.106 80.311 C 115.248 80.311, 133.262 62.298, 133.262 40.156 C 133.262 18.014, 115.248 0.000, 93.106 0.000 M 354.089 0.112 L 279.048 0.107 L 279.048 18.240 L 320.657 18.250 C 320.657 18.250, 279.470 79.482, 279.133 80.293 L 279.125 80.305 L 279.128 80.305 C 279.128 80.307, 279.126 80.310, 279.125 80.312 L 353.922 80.312 L 353.922 62.174 L 312.557 62.174 C 313.992 60.059, 354.081 0.131, 354.081 0.131 L 354.089 0.119 L 354.086 0.119 Z M 206.445 0.102 L 206.445 18.235 L 228.393 18.235 L 228.393 18.319 L 228.393 80.365 L 246.530 80.365 L 246.530 18.319 L 246.530 18.235 L 269.388 18.240 L 269.388 0.106 Z M 45.904 62.174 L 18.138 62.174 L 18.138 0.098 L 0.000 0.098 L 0.000 80.312 L 59.817 80.312 C 53.935 75.397, 49.160 69.207, 45.904 62.174 M 139.658 0.098 L 139.658 80.366 L 157.795 80.366 L 157.795 53.301 L 172.043 53.301 L 172.043 35.163 L 157.795 35.163 L 157.795 18.235 L 196.785 18.235 L 196.785 0.102 Z"
      />
      <path
        fill={coral}
        d="M 93.106 92.403 C 83.447 92.403, 74.019 89.735, 65.841 84.687 L 56.313 100.120 C 67.356 106.937, 80.079 110.541, 93.106 110.541 C 106.133 110.541, 118.856 106.937, 129.899 100.120 L 120.372 84.687 C 112.194 89.735, 102.766 92.403, 93.106 92.403"
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
    <svg viewBox="0 0 80.311 110.541" role="img" aria-label="LOFTZ" width="1em" height="1em" {...props}>
      <title>LOFTZ</title>
      <path
        fill={ink}
        d="M 40.155 62.059 C 28.078 62.059, 18.252 52.233, 18.252 40.156 C 18.252 28.079, 28.078 18.253, 40.155 18.253 C 52.233 18.253, 62.058 28.079, 62.058 40.156 C 62.058 52.233, 52.233 62.059, 40.155 62.059 M 40.155 0.000 C 18.013 0.000, 0.000 18.014, 0.000 40.156 C 0.000 62.298, 18.013 80.311, 40.155 80.311 C 62.297 80.311, 80.311 62.298, 80.311 40.156 C 80.311 18.014, 62.297 0.000, 40.155 0.000"
      />
      <path
        fill={coral}
        d="M 40.155 92.403 C 30.496 92.403, 21.068 89.735, 12.890 84.687 L 3.362 100.120 C 14.405 106.937, 27.128 110.541, 40.155 110.541 C 53.182 110.541, 65.905 106.937, 76.948 100.120 L 67.421 84.687 C 59.243 89.735, 49.815 92.403, 40.155 92.403"
      />
    </svg>
  );
}
