import { useTranslations } from "next-intl";

// Real counts (residences, rooms) come from the DB; the softer numbers come from
// site_settings (editable in /admin/settings), with sensible fallbacks.
export function Stats({
  residences,
  rooms,
  settings,
}: {
  residences: number;
  rooms: number;
  settings: Record<string, string>;
}) {
  const t = useTranslations("home");

  const items = [
    { value: String(residences || 9), label: t("statResidences") },
    { value: String(rooms || 65), label: t("statRooms") },
    { value: settings.stat_guests || "2,000+", label: t("statGuests") },
    { value: settings.stat_nationalities || "50+", label: t("statNationalities") },
    { value: `★ ${settings.stat_rating || "4.9"}`, label: t("statRating") },
    { value: settings.stat_years || "8+", label: t("statYears") },
  ];

  return (
    <section className="border-b border-line bg-bg">
      <div className="container-page py-10">
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
          {items.map((it, i) => (
            <div key={i} className="text-center">
              <div className="font-display text-3xl font-semibold text-accent md:text-4xl">
                {it.value}
              </div>
              <div className="mt-1 text-xs font-medium tracking-wide text-muted">
                {it.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
