import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/blur";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Room, Residence, Photo } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { IconMapPin, IconBed, IconBath } from "@/components/icons";

function bedLabel(bedType: string | null, features: (k: string) => string) {
  if (bedType === "double") return features("double_bed");
  if (bedType === "single") return features("single_bed");
  return features("furnished");
}

export function RoomCard({
  room,
  residence,
  cover,
}: {
  room: Room;
  residence?: Residence;
  cover?: Photo;
}) {
  const locale = useLocale();
  const t = useTranslations("common");
  const features = useTranslations("features");
  const rt = useTranslations("room");
  const price = formatPrice(room.monthly_price, locale);

  return (
    <Link
      href={`/rooms/${room.slug}`}
      className="card group overflow-hidden transition-shadow hover:shadow-[var(--shadow-lift)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.alt ?? `${residence?.name ?? ""} ${room.name}`}
            fill
            sizes="(max-width: 768px) 100vw, 380px"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            <span className="font-display text-3xl opacity-40">LOFTZ</span>
          </div>
        )}
        {price && (
          <div className="absolute bottom-3 left-3 rounded-full bg-bg/95 px-3 py-1.5 text-sm font-semibold shadow-sm">
            {price}
            <span className="font-normal text-muted"> {t("perMonth")}</span>
          </div>
        )}
      </div>

      <div className="p-4">
        {residence && (
          <div className="mb-1 flex items-center gap-1 text-xs text-muted">
            <IconMapPin style={{ fontSize: "0.9rem" }} />
            <span>
              {residence.name}
              {residence.neighborhood ? ` · ${residence.neighborhood}` : ""}
            </span>
          </div>
        )}
        <h3 className="font-display text-lg font-medium">{room.name}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <IconBed style={{ fontSize: "1rem" }} />
            {bedLabel(room.bed_type, features)}
          </span>
          <span className="inline-flex items-center gap-1">
            <IconBath style={{ fontSize: "1rem" }} />
            {room.private_bathroom ? rt("privateBathroom") : rt("sharedBathroom")}
          </span>
        </div>
      </div>
    </Link>
  );
}
