"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

// Single-pin Leaflet map for a room's residence location. Neutral CARTO
// basemap with the branded pin (same style as the residences map).
export function RoomMap({
  lat,
  lng,
  label,
}: {
  lat: number;
  lng: number;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import("leaflet").Map | null = null;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !ref.current) return;

      map = L.map(ref.current, {
        scrollWheelZoom: false,
        attributionControl: true,
      }).setView([lat, lng], 15);

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 19,
        }
      ).addTo(map);

      L.marker([lat, lng], {
        icon: L.divIcon({
          className: "loftz-pin",
          html: `<span class="loftz-pin__dot"></span>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        }),
      }).addTo(map);
    })();

    return () => {
      cancelled = true;
      if (map) map.remove();
    };
  }, [lat, lng]);

  return (
    <div
      ref={ref}
      className="h-64 w-full md:h-80"
      role="img"
      aria-label={label}
    />
  );
}
