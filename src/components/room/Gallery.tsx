"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { BLUR_DATA_URL } from "@/lib/blur";
import type { Photo } from "@/lib/types";
import { IconClose, IconChevronRight } from "@/components/icons";

export function Gallery({ photos }: { photos: Photo[] }) {
  const t = useTranslations("room");
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (open === null) return;
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i! + 1) % photos.length);
      if (e.key === "ArrowLeft")
        setOpen((i) => (i! - 1 + photos.length) % photos.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, photos.length]);

  if (photos.length === 0) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center rounded-xl border border-line bg-surface-2">
        <span className="text-sm text-muted">{t("noPhotos")}</span>
      </div>
    );
  }

  const [hero, ...rest] = photos;

  return (
    <>
      <div className="grid gap-2 overflow-hidden rounded-xl sm:grid-cols-4 sm:grid-rows-2">
        <button
          type="button"
          onClick={() => setOpen(0)}
          className="relative col-span-2 row-span-2 aspect-[4/3] overflow-hidden sm:aspect-auto"
        >
          <Image
            src={hero.url}
            alt={hero.alt ?? ""}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover transition-transform duration-500 hover:scale-105"
            priority
          />
        </button>
        {rest.slice(0, 4).map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setOpen(i + 1)}
            className="relative hidden aspect-[4/3] overflow-hidden sm:block"
          >
            <Image
              src={p.url}
              alt={p.alt ?? ""}
              fill
              sizes="300px"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
            {i === 3 && photos.length > 5 && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-lg font-medium text-white">
                +{photos.length - 5}
              </span>
            )}
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpen(null)}
        >
          <button
            className="absolute right-4 top-4 text-3xl text-white/80 hover:text-white"
            aria-label={t("gallery")}
            onClick={() => setOpen(null)}
          >
            <IconClose />
          </button>
          <button
            className="absolute left-3 text-4xl text-white/70 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((i) => (i! - 1 + photos.length) % photos.length);
            }}
            aria-label="Previous"
          >
            <span className="inline-block rotate-180"><IconChevronRight /></span>
          </button>
          <div
            className="relative h-[80vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[open].url}
              alt={photos[open].alt ?? ""}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          <button
            className="absolute right-3 text-4xl text-white/70 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((i) => (i! + 1) % photos.length);
            }}
            aria-label="Next"
          >
            <IconChevronRight />
          </button>
        </div>
      )}
    </>
  );
}
