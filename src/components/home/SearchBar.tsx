"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { IconSearch } from "@/components/icons";
import type { Residence } from "@/lib/types";

export function SearchBar({ residences }: { residences: Residence[] }) {
  const t = useTranslations("home");
  const router = useRouter();
  const [residence, setResidence] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (residence) params.set("residence", residence);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const qs = params.toString();
    router.push(`/book-now${qs ? `?${qs}` : ""}`);
  }

  return (
    <form
      onSubmit={submit}
      className="card grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:items-end"
    >
      <div>
        <label className="label" htmlFor="s-loc">{t("searchLocation")}</label>
        <select
          id="s-loc"
          className="field"
          value={residence}
          onChange={(e) => setResidence(e.target.value)}
        >
          <option value="">{t("searchLocationAny")}</option>
          {residences.map((r) => (
            <option key={r.id} value={r.slug}>
              {r.name}
              {r.neighborhood ? ` — ${r.neighborhood}` : ""}
            </option>
          ))}
        </select>
      </div>
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
