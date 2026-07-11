import { useTranslations } from "next-intl";
import type { SiteStats } from "@/lib/types";

export function Stats({ stats }: { stats: SiteStats }) {
  const t = useTranslations("home");

  const items = [
    { value: stats.residences, label: t("statResidences") },
    { value: stats.rooms, label: t("statRooms") },
    { value: stats.neighborhoods, label: t("statNeighborhoods") },
    { value: "8+", label: t("statYears") },
  ];

  return (
    <section className="section">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl">{t("statsTitle")}</h2>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((it, i) => (
            <div
              key={i}
              className="rounded-xl border border-line bg-surface px-4 py-8 text-center"
            >
              <div className="font-display text-4xl font-semibold text-accent md:text-5xl">
                {it.value}
              </div>
              <div className="mt-2 text-sm font-medium text-muted">{it.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
