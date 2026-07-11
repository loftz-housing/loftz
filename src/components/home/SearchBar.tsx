"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { IconSearch } from "@/components/icons";
import { track } from "@/lib/track";

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
    track("search_rooms", { from, to });
    router.push(`/book-now${qs ? `?${qs}` : ""}`);
  }

  return (
    <form onSubmit={submit} className="card p-4">
      <div className="grid grid-cols-2 gap-3">
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
      </div>
      <button type="submit" className="btn btn-primary btn-lg mt-3 w-full">
        <IconSearch />
        <span>{t("searchSubmit")}</span>
      </button>
    </form>
  );
}
