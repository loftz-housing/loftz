"use client";

import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import "leaflet/dist/leaflet.css";
import type { Residence } from "@/lib/types";

// Interactive Leaflet map with branded pins that link to each residence.
// Neutral CARTO basemap for now; recolouring to the brand palette is a design-pass
// item (swap to a vector style). Only residences with coordinates get a pin.
const LISBON: [number, number] = [38.722, -9.139];

export function ResidenceMap({ residences }: { residences: Residence[] }) {
  const t = useTranslations("home");
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const withCoords = residences.filter(
    (r) => r.latitude != null && r.longitude != null
  );

  useEffect(() => {
    let map: import("leaflet").Map | null = null;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !ref.current || withCoords.length === 0) return;

      map = L.map(ref.current, {
        scrollWheelZoom: false,
        attributionControl: true,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 19,
        }
      ).addTo(map);

      const pin = () =>
        L.divIcon({
          className: "loftz-pin",
          html: `<span class="loftz-pin__dot"></span>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
          popupAnchor: [0, -10],
        });

      const bounds: [number, number][] = [];
      for (const r of withCoords) {
        const latlng: [number, number] = [r.latitude!, r.longitude!];
        bounds.push(latlng);
        L.marker(latlng, { icon: pin() })
          .addTo(map!)
          .bindPopup(
            `<a href="/${locale}/residences/${r.slug}" style="font-weight:600;color:#14655b;text-decoration:none">${r.name}${
              r.neighborhood ? ` · ${r.neighborhood}` : ""
            }</a>`
          );
      }

      if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
      } else {
        map.setView(bounds[0] ?? LISBON, 14);
      }
    })();

    return () => {
      cancelled = true;
      if (map) map.remove();
    };
  }, [withCoords, locale]);

  return (
    <section className="section bg-surface">
      <div className="container-page">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl">{t("mapTitle")}</h2>
          <p className="prose-muted mt-3">{t("mapSubtitle")}</p>
        </div>

        <div className="card overflow-hidden">
          <div
            ref={ref}
            className="h-[420px] w-full md:h-[540px]"
            role="img"
            aria-label="Map of LOFTZ residences in Lisbon"
          />
        </div>
      </div>
    </section>
  );
}
