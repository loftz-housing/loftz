import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BLUR_DATA_URL } from "@/lib/blur";
import type { Residence, Room, Photo } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { IconMapPin, IconArrowRight, IconBath } from "@/components/icons";

// A residence "block" for the residences list: rich summary + small room cards
// that link straight to each room (so guests reach a room in one click).
export function ResidenceBlock({
  residence,
  rooms,
  covers,
}: {
  residence: Residence;
  rooms: Room[];
  covers: Record<string, Photo>;
}) {
  const t = useTranslations("residences");
  const common = useTranslations("common");
  const locale = useLocale();

  const prices = rooms
    .map((r) => r.monthly_price)
    .filter((p): p is number => p != null);
  const min = prices.length ? Math.min(...prices) : null;
  const max = prices.length ? Math.max(...prices) : null;
  const priceLabel =
    min == null
      ? null
      : min === max
        ? formatPrice(min, locale)
        : `${formatPrice(min, locale)} – ${formatPrice(max, locale)}`;

  return (
    <div className="border-b border-line pb-12 last:border-0">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          {residence.neighborhood && (
            <div className="mb-1 flex items-center gap-1 text-sm text-muted">
              <IconMapPin style={{ fontSize: "0.95rem" }} />
              {residence.neighborhood}
            </div>
          )}
          <h2 className="font-display text-2xl md:text-3xl">
            <Link href={`/residences/${residence.slug}`} className="hover:text-accent">
              {residence.name}
            </Link>
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="chip">{t("roomsCount", { count: rooms.length })}</span>
            {residence.bathrooms != null && (
              <span className="chip">
                <IconBath style={{ fontSize: "0.9rem" }} />
                {t("bathrooms", { count: residence.bathrooms })}
              </span>
            )}
            {priceLabel && (
              <span className="chip chip-accent">
                {priceLabel} {common("perMonth")}
              </span>
            )}
          </div>
        </div>
        <Link
          href={`/residences/${residence.slug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
        >
          {common("viewResidence")}
          <IconArrowRight />
        </Link>
      </div>

      {/* Room mini-cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {rooms.map((room) => {
          const cover = covers[room.id];
          const price = formatPrice(room.monthly_price, locale);
          return (
            <Link
              key={room.id}
              href={`/rooms/${room.slug}`}
              className="card group overflow-hidden transition-shadow hover:shadow-[var(--shadow-lift)]"
            >
              <div className="relative aspect-square overflow-hidden bg-surface-2">
                {cover ? (
                  <Image
                    src={cover.url}
                    alt={cover.alt ?? `${residence.name} ${room.name}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 220px"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="font-display text-lg opacity-30">
                      {residence.code}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-2.5">
                <div className="text-sm font-medium">{room.name}</div>
                {price && (
                  <div className="text-xs text-muted">
                    {price} {common("perMonth")}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
