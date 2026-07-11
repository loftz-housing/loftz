"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { IconMenu, IconClose } from "@/components/icons";

const NAV = [
  { href: "/residences", key: "residences" },
  { href: "/book-now", key: "bookNow" },
  { href: "/landlords", key: "landlords" },
  { href: "/partnerships", key: "partnerships" },
  { href: "/faq", key: "faq" },
  { href: "/about", key: "about" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="font-display text-2xl font-semibold tracking-tight"
          onClick={() => setOpen(false)}
        >
          LOFTZ
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-accent ${
                isActive(item.href) ? "text-accent" : "text-ink-soft"
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <Link href="/book-now" className="btn btn-primary">
            {t("bookNow")}
          </Link>
        </div>

        <button
          type="button"
          className="btn btn-ghost -mr-2 p-2 text-2xl lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <IconClose /> : <IconMenu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-bg lg:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-2.5 text-base font-medium ${
                  isActive(item.href)
                    ? "bg-accent-soft text-accent"
                    : "text-ink hover:bg-surface"
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="mt-3 flex items-center justify-between gap-3 px-1">
              <LanguageSwitcher />
              <Link
                href="/book-now"
                onClick={() => setOpen(false)}
                className="btn btn-primary flex-1"
              >
                {t("bookNow")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
