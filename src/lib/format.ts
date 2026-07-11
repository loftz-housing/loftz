import type { PlatformKey } from "./types";

export function formatPrice(
  amount: number | null | undefined,
  locale: string,
  currency = "EUR"
): string | null {
  if (amount == null) return null;
  return new Intl.NumberFormat(locale === "pt" ? "pt-PT" : "en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(iso: string | null, locale: string): string | null {
  if (!iso) return null;
  return new Intl.DateTimeFormat(locale === "pt" ? "pt-PT" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export const PLATFORM_LABELS: Record<PlatformKey, string> = {
  uniplaces: "Uniplaces",
  spotahome: "Spotahome",
  housinganywhere: "HousingAnywhere",
  inlife: "InLife",
  erasmuslisboa: "Erasmus Lisboa",
};

// The set of filterable room features (keys must match messages: features.*).
export const ROOM_FEATURES = [
  "single_bed",
  "double_bed",
  "private_bathroom",
  "terrace",
  "balcony",
  "washer",
  "dryer",
] as const;
export type RoomFeature = (typeof ROOM_FEATURES)[number];
