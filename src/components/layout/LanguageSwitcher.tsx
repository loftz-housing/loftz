"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { IconGlobe } from "@/components/icons";

const LABELS: Record<string, string> = { en: "EN", pt: "PT" };

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchTo(next: string) {
    if (next === locale) return;
    // pathname (from next-intl) is locale-agnostic; router re-adds the prefix.
    router.replace(pathname, { locale: next });
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-line-strong px-1 py-1">
      <IconGlobe className="mx-1 text-muted" style={{ fontSize: "1rem" }} />
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          aria-current={l === locale ? "true" : undefined}
          className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
            l === locale
              ? "bg-ink text-white"
              : "text-muted hover:text-ink"
          }`}
        >
          {LABELS[l] ?? l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
