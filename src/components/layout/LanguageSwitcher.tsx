"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { IconGlobe, IconChevronDown, IconCheck } from "@/components/icons";

// Full language names — extend as locales are added (ES/IT/FR/DE, plan 5.3).
const LANG_NAMES: Record<string, string> = {
  en: "English",
  pt: "Português",
  es: "Español",
  it: "Italiano",
  fr: "Français",
  de: "Deutsch",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const nav = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function switchTo(next: string) {
    setOpen(false);
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${nav("language")}: ${LANG_NAMES[locale] ?? locale}`}
        className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3 py-2 text-sm font-medium transition-colors hover:border-ink"
      >
        <IconGlobe style={{ fontSize: "1rem" }} className="text-muted" />
        <span className="uppercase">{locale}</span>
        <IconChevronDown
          style={{ fontSize: "0.9rem" }}
          className={`text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <ul
            role="listbox"
            className="card absolute right-0 z-50 mt-2 min-w-[10rem] overflow-hidden p-1"
          >
            {routing.locales.map((l) => (
              <li key={l}>
                <button
                  type="button"
                  role="option"
                  aria-selected={l === locale}
                  onClick={() => switchTo(l)}
                  className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                    l === locale
                      ? "bg-accent-soft text-accent"
                      : "hover:bg-surface"
                  }`}
                >
                  <span>{LANG_NAMES[l] ?? l.toUpperCase()}</span>
                  {l === locale && <IconCheck style={{ fontSize: "0.9rem" }} />}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
