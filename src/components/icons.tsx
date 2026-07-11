import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      width="1em"
      height="1em"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const IconCoins = (p: IconProps) => (
  <Base {...p}>
    <circle cx="9" cy="9" r="6" />
    <path d="M15.5 4.5a6 6 0 0 1 0 15M8 9h2M9 7v4" />
  </Base>
);
export const IconSparkle = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.5 6.5l2 2M15.5 15.5l2 2M17.5 6.5l-2 2M8.5 15.5l-2 2" />
  </Base>
);
export const IconWifi = (p: IconProps) => (
  <Base {...p}>
    <path d="M2 8.5a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0" />
    <circle cx="12" cy="19" r="0.6" fill="currentColor" />
  </Base>
);
export const IconKitchen = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 3h14v18H5zM5 11h14M9 6v2M12 6v2M15 6v2" />
  </Base>
);
export const IconTrain = (p: IconProps) => (
  <Base {...p}>
    <rect x="5" y="3" width="14" height="14" rx="3" />
    <path d="M5 11h14M8 21l2-3M16 21l-2-3" />
    <circle cx="9" cy="14" r="0.6" fill="currentColor" />
    <circle cx="15" cy="14" r="0.6" fill="currentColor" />
  </Base>
);
export const IconShop = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 9h16l-1-5H5zM5 9v11h14V9M9 20v-6h6v6" />
  </Base>
);
export const IconWrench = (p: IconProps) => (
  <Base {...p}>
    <path d="M14.5 5.5a3.5 3.5 0 0 0 4.6 4.6L21 12l-9 9-3-3 9-9z" />
    <path d="M9 15l-4.5 4.5a1.5 1.5 0 0 1-2-2L7 13" />
  </Base>
);
export const IconDocument = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 2h8l4 4v16H6zM14 2v4h4M9 12h6M9 16h6" />
  </Base>
);
export const IconSearch = (p: IconProps) => (
  <Base {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Base>
);
export const IconChevronDown = (p: IconProps) => (
  <Base {...p}>
    <path d="m6 9 6 6 6-6" />
  </Base>
);
export const IconChevronRight = (p: IconProps) => (
  <Base {...p}>
    <path d="m9 6 6 6-6 6" />
  </Base>
);
export const IconArrowRight = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Base>
);
export const IconClose = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Base>
);
export const IconMenu = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </Base>
);
export const IconCheck = (p: IconProps) => (
  <Base {...p}>
    <path d="M20 6 9 17l-5-5" />
  </Base>
);
export const IconMapPin = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" />
    <circle cx="12" cy="9" r="2.5" />
  </Base>
);
export const IconBed = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 8v12M3 12h18v8M21 12v-1a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3M7 12V9" />
  </Base>
);
export const IconBath = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 12V6a2 2 0 0 1 4 0M3 12h18v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4zM6 19l-1 2M18 19l1 2" />
  </Base>
);
export const IconRuler = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="8" width="18" height="8" rx="1.5" />
    <path d="M7 8v3M11 8v4M15 8v3M19 8v4" />
  </Base>
);
export const IconCalendar = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 9h18M8 3v4M16 3v4" />
  </Base>
);
export const IconShare = (p: IconProps) => (
  <Base {...p}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="m8.5 10.5 7-4M8.5 13.5l7 4" />
  </Base>
);
export const IconGlobe = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
  </Base>
);
export const IconPlay = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M10 8.5v7l5-3.5z" fill="currentColor" />
  </Base>
);
export const IconShield = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />
    <path d="m9 12 2 2 4-4" />
  </Base>
);
export const IconChart = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 4v16h16M8 16v-4M12 16V8M16 16v-6" />
  </Base>
);
export const IconBuilding = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M16 21V9h2a2 2 0 0 1 2 2v10M8 7h4M8 11h4M8 15h4M2 21h20" />
  </Base>
);
