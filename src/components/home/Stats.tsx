import { useTranslations } from "next-intl";

// Real counts (residences, rooms) come from the DB. The rest are PLACEHOLDERS
// until Henrique supplies real figures (feedback pass 1) — kept here so they're
// trivial to swap.
const PLACEHOLDER = {
  guests: "2,000+",
  nationalities: "50+",
  rating: "4.9",
};

export function Stats({
  residences,
  rooms,
}: {
  residences: number;
  rooms: number;
}) {
  const t = useTranslations("home");

  const items = [
    { value: String(residences || 9), label: t("statResidences") },
    { value: String(rooms || 65), label: t("statRooms") },
    { value: PLACEHOLDER.guests, label: t("statGuests") },
    { value: PLACEHOLDER.nationalities, label: t("statNationalities") },
    { value: `★ ${PLACEHOLDER.rating}`, label: t("statRating") },
    { value: "8+", label: t("statYears") },
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
