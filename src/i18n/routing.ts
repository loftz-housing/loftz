import { defineRouting } from "next-intl/routing";

// EN primary (international audience), PT secondary. More languages are cheap
// to add later on this same scaffold (plan 5.3). Locked bilingual: D-06.
export const routing = defineRouting({
  locales: ["en", "pt"],
  defaultLocale: "en",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
