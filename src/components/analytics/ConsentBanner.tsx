"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getConsent, setConsent } from "./consent";

export function ConsentBanner() {
  const t = useTranslations("consent");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getConsent() === null);
  }, []);

  if (!visible) return null;

  function choose(choice: "granted" | "denied") {
    setConsent(choice);
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-label={t("title")}
      className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4"
    >
      <div className="card container-page mx-auto flex max-w-3xl flex-col gap-4 p-5 shadow-[var(--shadow-lift)] sm:flex-row sm:items-center">
        <div className="flex-1">
          <p className="font-medium">{t("title")}</p>
          <p className="prose-muted mt-1 text-sm">
            {t("body")}{" "}
            <Link href="/legal/cookies" className="text-accent underline underline-offset-2">
              {t("learnMore")}
            </Link>
          </p>
        </div>
        <div className="flex flex-shrink-0 flex-col gap-2 sm:flex-row">
          <button className="btn btn-outline" onClick={() => choose("denied")}>
            {t("reject")}
          </button>
          <button className="btn btn-primary" onClick={() => choose("granted")}>
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
