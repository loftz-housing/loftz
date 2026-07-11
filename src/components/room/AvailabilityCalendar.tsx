import { useLocale } from "next-intl";

// Static 12-month availability calendar. Booked days (from merged iCal feeds)
// are shaded; everything else reads as available. Server component.
function daysBooked(events: { start_date: string; end_date: string }[]): Set<string> {
  const set = new Set<string>();
  for (const e of events) {
    const start = new Date(e.start_date + "T00:00:00");
    const end = new Date(e.end_date + "T00:00:00"); // exclusive
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      set.add(d.toISOString().slice(0, 10));
    }
  }
  return set;
}

function iso(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function AvailabilityCalendar({
  events,
  monthsToShow = 8,
}: {
  events: { start_date: string; end_date: string }[];
  monthsToShow?: number;
}) {
  const locale = useLocale();
  const booked = daysBooked(events);
  const now = new Date();
  const months = Array.from({ length: monthsToShow }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    return { y: d.getFullYear(), m: d.getMonth() };
  });
  const fmt = new Intl.DateTimeFormat(locale === "pt" ? "pt-PT" : "en-GB", {
    month: "long",
    year: "numeric",
  });
  // Weekday initials (Mon-first)
  const wd = locale === "pt" ? ["S", "T", "Q", "Q", "S", "S", "D"] : ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {months.map(({ y, m }) => {
        const first = new Date(y, m, 1);
        const startOffset = (first.getDay() + 6) % 7; // Mon=0
        const daysInMonth = new Date(y, m + 1, 0).getDate();
        const cells: (number | null)[] = [
          ...Array(startOffset).fill(null),
          ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
        ];
        return (
          <div key={`${y}-${m}`} className="rounded-xl border border-line p-3">
            <div className="mb-2 text-center text-sm font-medium capitalize">{fmt.format(first)}</div>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted">
              {wd.map((w, i) => <div key={i}>{w}</div>)}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                if (day == null) return <div key={i} />;
                const isBooked = booked.has(iso(y, m, day));
                return (
                  <div
                    key={i}
                    className={`flex h-7 items-center justify-center rounded-md text-xs ${
                      isBooked
                        ? "bg-[var(--color-coral-soft)] text-[var(--color-coral)] line-through"
                        : "bg-accent-soft text-[var(--color-accent-soft-ink)]"
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
