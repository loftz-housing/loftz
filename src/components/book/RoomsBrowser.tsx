"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { RoomCard } from "@/components/RoomCard";
import { ROOM_FEATURES } from "@/lib/format";
import type { Room, Residence, Photo } from "@/lib/types";

type Sort = "default" | "price_asc" | "price_desc";

export function RoomsBrowser({
  rooms,
  residences,
  covers,
  initialResidence = "",
}: {
  rooms: Room[];
  residences: Residence[];
  covers: Record<string, Photo>;
  initialResidence?: string;
}) {
  const t = useTranslations("book");
  const ft = useTranslations("features");

  const residenceById = useMemo(
    () => Object.fromEntries(residences.map((r) => [r.id, r])),
    [residences]
  );
  const neighborhoods = useMemo(
    () =>
      Array.from(
        new Set(residences.map((r) => r.neighborhood).filter(Boolean))
      ) as string[],
    [residences]
  );
  const maxPriceAvailable = useMemo(
    () => Math.max(0, ...rooms.map((r) => r.monthly_price ?? 0)),
    [rooms]
  );

  const [residenceSlug, setResidenceSlug] = useState(initialResidence);
  const [neighborhood, setNeighborhood] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(maxPriceAvailable);
  const [sort, setSort] = useState<Sort>("default");

  function toggleFeature(f: string) {
    setFeatures((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  }

  function clear() {
    setResidenceSlug("");
    setNeighborhood("");
    setFeatures([]);
    setMaxPrice(maxPriceAvailable);
    setSort("default");
  }

  const filtered = useMemo(() => {
    let list = rooms.filter((room) => {
      const res = residenceById[room.residence_id];
      if (residenceSlug && res?.slug !== residenceSlug) return false;
      if (neighborhood && res?.neighborhood !== neighborhood) return false;
      if (maxPrice && (room.monthly_price ?? 0) > maxPrice) return false;
      if (features.length) {
        for (const f of features) {
          if (f === "private_bathroom") {
            if (!room.private_bathroom) return false;
          } else if (f === "single_bed") {
            if (room.bed_type && room.bed_type !== "single") return false;
          } else if (f === "double_bed") {
            if (room.bed_type !== "double") return false;
          } else if (!room.features?.includes(f)) {
            return false;
          }
        }
      }
      return true;
    });

    if (sort === "price_asc")
      list = [...list].sort(
        (a, b) => (a.monthly_price ?? Infinity) - (b.monthly_price ?? Infinity)
      );
    if (sort === "price_desc")
      list = [...list].sort(
        (a, b) => (b.monthly_price ?? 0) - (a.monthly_price ?? 0)
      );
    return list;
  }, [rooms, residenceById, residenceSlug, neighborhood, maxPrice, features, sort]);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      {/* Filters */}
      <aside className="lg:sticky lg:top-20 lg:h-fit">
        <div className="card space-y-5 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">{t("filters")}</h2>
            <button
              type="button"
              className="text-xs font-medium text-accent hover:underline"
              onClick={clear}
            >
              {t("clearFilters")}
            </button>
          </div>

          <div>
            <label className="label">{t("filterResidence")}</label>
            <select
              className="field"
              value={residenceSlug}
              onChange={(e) => setResidenceSlug(e.target.value)}
            >
              <option value="">{t("filterAll")}</option>
              {residences.map((r) => (
                <option key={r.id} value={r.slug}>{r.name}</option>
              ))}
            </select>
          </div>

          {neighborhoods.length > 1 && (
            <div>
              <label className="label">{t("filterNeighborhood")}</label>
              <select
                className="field"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
              >
                <option value="">{t("filterAll")}</option>
                {neighborhoods.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          )}

          {maxPriceAvailable > 0 && (
            <div>
              <label className="label">
                {t("filterPriceMax")}: €{maxPrice}
              </label>
              <input
                type="range"
                min={Math.min(...rooms.map((r) => r.monthly_price ?? 0).filter(Boolean))}
                max={maxPriceAvailable}
                step={10}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[var(--color-accent)]"
              />
            </div>
          )}

          <div>
            <label className="label">{t("filterFeatures")}</label>
            <div className="flex flex-wrap gap-2">
              {ROOM_FEATURES.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggleFeature(f)}
                  className={`chip cursor-pointer ${
                    features.includes(f) ? "chip-accent" : ""
                  }`}
                >
                  {ft(f)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Results */}
      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm text-muted">
            {t("resultsCount", { count: filtered.length })}
          </p>
          <select
            className="field w-auto"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
          >
            <option value="default">{t("sortDefault")}</option>
            <option value="price_asc">{t("sortPriceAsc")}</option>
            <option value="price_desc">{t("sortPriceDesc")}</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="font-medium">{t("noResults")}</p>
            <p className="prose-muted mt-1 text-sm">{t("noResultsHint")}</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                residence={residenceById[room.residence_id]}
                cover={covers[room.id]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
