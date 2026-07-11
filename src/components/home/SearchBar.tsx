"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { IconSearch } from "@/components/icons";

export function SearchBar() {
  const t = useTranslations("home");
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const qs = params.toString();
    router.push(`/book-now${qs ? `?${qs}` : ""}`);
  }

  return (
    <form
      onSubmit={submit}
      className="card grid gap-3 p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
    >
      <div>
        <label className="label" htmlFor="s-in">{t("searchCheckIn")}</label>
        <input
          id="s-in"
          type="date"
          className="field"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
      </div>
      <div>
        <label className="label" htmlFor="s-out">{t("searchCheckOut")}</label>
        <input
          id="s-out"
          type="date"
          className="field"
          value={to}
          min={from || undefined}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary btn-lg h-[46px]">
        <IconSearch />
        <span>{t("searchSubmit")}</span>
      </button>
    </form>
  );
}
