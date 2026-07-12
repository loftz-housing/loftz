import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BLUR_DATA_URL } from "@/lib/blur";
import type { Residence, Photo } from "@/lib/types";
import { IconMapPin, IconArrowRight } from "@/components/icons";

export function ResidenceCard({
  residence,
  roomCount,
  cover,
}: {
  residence: Residence;
  roomCount: number;
  cover?: Photo;
}) {
  const t = useTranslations("residences");

  return (
    <Link
      href={`/residences/${residence.slug}`}
      className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-[var(--shadow-lift)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-2">
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.alt ?? residence.name}
            fill
            sizes="(max-width: 768px) 100vw, 560px"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-display text-4xl opacity-30">{residence.code}</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {residence.neighborhood && (
          <div className="mb-1 flex items-center gap-1 text-xs text-muted">
            <IconMapPin style={{ fontSize: "0.9rem" }} />
            {residence.neighborhood}
          </div>
        )}
        <h3 className="font-display text-xl font-medium">{residence.name}</h3>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="chip">{t("roomsCount", { count: roomCount })}</span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
            <IconArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
