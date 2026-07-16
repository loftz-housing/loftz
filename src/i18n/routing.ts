import { defineRouting } from "next-intl/routing";

// EN primary (international audience), then PT + the four largest inbound-student
// languages (ES/IT/FR/DE). Same scaffold, message files in messages/<locale>.json.
export const routing = defineRouting({
  locales: ["en", "pt", "es", "it", "fr", "de"],
  defaultLocale: "en",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
