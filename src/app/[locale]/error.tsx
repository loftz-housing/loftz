"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

// Branded error boundary for the localized app segment. Rendered inside the
// locale layout, so next-intl translations are available.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error("[app error]", error);
  }, [error]);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-coral-soft text-2xl text-coral">
        !
      </div>
      <h1 className="mt-6 text-3xl">{t("title")}</h1>
      <p className="prose-muted mt-3 max-w-md">{t("body")}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button onClick={reset} className="btn btn-primary">
          {t("retry")}
        </button>
        <Link href="/" className="btn btn-outline">
          {t("home")}
        </Link>
      </div>
    </div>
  );
}
