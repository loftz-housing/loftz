import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Residence } from "@/lib/types";
import { IconMapPin } from "@/components/icons";

// Lightweight, dependency-free "map": an OpenStreetMap embed of central Lisbon
// (no API key) alongside residence pins that link to each residence page.
// A precise per-marker map (Leaflet) is a future enhancement — noted in NEXT.md.
const LISBON_BBOX = "-9.230,38.690,-9.100,38.760"; // west,south,east,north
const OSM_SRC = `https://www.openstreetmap.org/export/embed.html?bbox=${LISBON_BBOX}&layer=mapnik`;

export function ResidenceMap({ residences }: { residences: Residence[] }) {
  const t = useTranslations("home");

  return (
    <section className="section bg-surface">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl">{t("mapTitle")}</h2>
          <p className="prose-muted mt-3">{t("mapSubtitle")}</p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="card overflow-hidden">
            <iframe
              title="Map of Lisbon"
              src={OSM_SRC}
              loading="lazy"
              className="h-[300px] w-full border-0 md:h-[440px]"
            />
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {residences.map((r) => (
              <Link
                key={r.id}
                href={`/residences/${r.slug}`}
                className="card flex items-center gap-3 p-3 transition-colors hover:border-accent"
              >
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-accent-soft text-lg text-accent">
                  <IconMapPin />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-medium">{r.name}</span>
                  {r.neighborhood && (
                    <span className="block truncate text-xs text-muted">
                      {r.neighborhood}
                    </span>
                  )}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
