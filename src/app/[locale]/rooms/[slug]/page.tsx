import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Gallery } from "@/components/room/Gallery";
import { RequestForm } from "@/components/room/RequestForm";
import { ConditionsList } from "@/components/room/ConditionsList";
import { AvailabilityCalendar } from "@/components/room/AvailabilityCalendar";
import { RoomMap } from "@/components/room/RoomMap";
import { StickyBookingBar } from "@/components/room/StickyBookingBar";
import { RoomCard } from "@/components/RoomCard";
import {
  IconMapPin,
  IconBed,
  IconBath,
  IconRuler,
  IconArrowRight,
  IconCheck,
  IconBuilding,
} from "@/components/icons";
import { routing } from "@/i18n/routing";
import { formatPrice, formatDate, PLATFORM_LABELS } from "@/lib/format";
import { hasConditions } from "@/lib/eligibility";
import type { PlatformKey } from "@/lib/types";
import {
  getRooms,
  getRoomBySlug,
  getResidenceById,
  getRoomsByResidence,
  getPhotosForRoom,
  getEligibilityForRoom,
  getRoomCoverPhotos,
  getAvailabilityForRoom,
} from "@/lib/data";

export const revalidate = 3600;

export async function generateStaticParams() {
  const rooms = await getRooms();
  return routing.locales.flatMap((locale) =>
    rooms.map((r) => ({ locale, slug: r.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const room = await getRoomBySlug(slug);
  if (!room) return {};
  const [residence, photos] = await Promise.all([
    getResidenceById(room.residence_id),
    getPhotosForRoom(room.id),
  ]);
  const t = await getTranslations({ locale, namespace: "room" });
  const title = t("detailMetaTitle", {
    residence: residence?.name ?? "LOFTZ",
    room: room.name,
  });
  return {
    title,
    alternates: { canonical: `/${locale}/rooms/${room.slug}` },
    openGraph: {
      title,
      type: "website",
      images: photos[0]?.url ? [{ url: photos[0].url }] : undefined,
    },
  };
}

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("room");
  const common = await getTranslations("common");
  const feat = await getTranslations("features");

  const room = await getRoomBySlug(slug);
  if (!room || room.status !== "active") notFound();

  const residence = await getResidenceById(room.residence_id);
  const [photos, conditions, siblings, covers, availability] = await Promise.all([
    getPhotosForRoom(room.id),
    getEligibilityForRoom(room.id),
    getRoomsByResidence(room.residence_id),
    getRoomCoverPhotos(),
    getAvailabilityForRoom(room.id),
  ]);
  const related = siblings.filter((r) => r.id !== room.id).slice(0, 3);
  const price = formatPrice(room.monthly_price, locale);

  // Derived facts for the "at a glance" grid.
  const roomTypeLabel =
    room.bed_type === "double"
      ? t("doubleRoom")
      : room.bed_type === "single"
        ? t("singleRoom")
        : t("furnishedRoom");
  const occupancy = room.bed_type === "double" ? 2 : 1;
  const availableFromIso = room.available_from;
  const availableLabel = (() => {
    if (!availableFromIso) return common("availableNow");
    // Compare as dates without importing a clock into the render.
    const from = new Date(availableFromIso);
    const now = new Date();
    if (from <= now) return common("availableNow");
    return `${common("availableFrom")} ${formatDate(availableFromIso, locale)}`;
  })();
  const mapsHref =
    residence?.latitude != null && residence?.longitude != null
      ? `https://www.google.com/maps/search/?api=1&query=${residence.latitude},${residence.longitude}`
      : null;

  const platforms = Object.entries(room.platform_links).filter(
    ([, url]) => !!url
  ) as [PlatformKey, string][];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Accommodation",
    name: `${residence?.name ?? "LOFTZ"} · ${room.name}`,
    description: room.description ?? undefined,
    image: photos[0]?.url,
    ...(residence?.address
      ? { address: { "@type": "PostalAddress", streetAddress: residence.address, addressLocality: "Lisbon", addressCountry: "PT" } }
      : {}),
    ...(room.monthly_price
      ? {
          offers: {
            "@type": "Offer",
            price: room.monthly_price,
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
            url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://loftz.net"}/${locale}/rooms/${room.slug}`,
          },
        }
      : {}),
  };

  return (
    <div className="container-page py-8 pb-28 md:py-12 lg:pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb */}
      <div className="mb-5 flex items-center gap-2 text-sm text-muted">
        <Link href="/book-now" className="hover:text-accent">
          {common("backToRooms")}
        </Link>
      </div>

      {/* Title */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          {residence && (
            <Link
              href={`/residences/${residence.slug}`}
              className="inline-flex items-center gap-1 text-sm text-muted hover:text-accent"
            >
              <IconMapPin style={{ fontSize: "1rem" }} />
              {residence.name}
              {residence.neighborhood ? ` · ${residence.neighborhood}` : ""}
            </Link>
          )}
          <h1 className="mt-1 text-3xl md:text-4xl">
            {residence?.name} · {room.name}
          </h1>
        </div>
        {price && (
          <div className="text-right">
            <div className="font-display text-3xl font-semibold text-accent">
              {price}
            </div>
            <div className="text-sm text-muted">{common("perMonth")}</div>
          </div>
        )}
      </div>

      <Gallery photos={photos} />

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        {/* Main */}
        <div className="space-y-10">
          {/* Facts */}
          <div className="flex flex-wrap gap-3">
            {room.size_m2 != null && (
              <span className="chip"><IconRuler /> {room.size_m2} m²</span>
            )}
            <span className="chip">
              <IconBed />{" "}
              {room.bed_type === "double"
                ? feat("double_bed")
                : room.bed_type === "single"
                  ? feat("single_bed")
                  : feat("furnished")}
            </span>
            <span className="chip">
              <IconBath />{" "}
              {room.private_bathroom ? t("privateBathroom") : t("sharedBathroom")}
            </span>
            {room.internal_ref && (
              <span className="chip">{t("ref")}: {room.internal_ref}</span>
            )}
          </div>

          {/* At a glance — labelled facts grid (wireframe) */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-5 rounded-2xl border border-line bg-surface p-5 sm:grid-cols-4">
            <Fact label={t("location")}>
              {residence?.neighborhood ?? residence?.city ?? "Lisbon"}
            </Fact>
            <Fact label={t("roomType")}>{roomTypeLabel}</Fact>
            <Fact label={t("occupancy")}>
              {t("occupancyValue", { count: occupancy })}
            </Fact>
            <Fact label={t("size")}>
              {room.size_m2 != null ? `${room.size_m2} m²` : "—"}
            </Fact>
          </div>

          {room.description && (
            <div>
              <h2 className="text-2xl">{t("overview")}</h2>
              <p className="prose-muted mt-3 whitespace-pre-line">{room.description}</p>
            </div>
          )}

          {room.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {room.features.map((f) => (
                <span key={f} className="chip chip-accent">{feat(f)}</span>
              ))}
            </div>
          )}

          {room.room_contents.length > 0 && (
            <div>
              <h2 className="text-2xl">{t("roomContents")}</h2>
              <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-ink-soft sm:grid-cols-3">
                {room.room_contents.map((c) => (
                  <li key={c} className="flex items-center gap-2">
                    <IconCheck className="shrink-0 text-base text-accent" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {residence && residence.facilities.length > 0 && (
            <div>
              <h2 className="text-2xl">{t("residenceContents")}</h2>
              <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-ink-soft sm:grid-cols-3">
                {residence.facilities.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <IconBuilding className="shrink-0 text-base text-accent" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {conditions && hasConditions(conditions) && (
            <div>
              <h2 className="text-2xl">{t("conditions")}</h2>
              <div className="mt-3">
                <ConditionsList c={conditions} />
              </div>
            </div>
          )}

          {residence?.video_url && (
            <div>
              <h2 className="text-2xl">{t("videoTour")}</h2>
              <div className="mt-3 aspect-video overflow-hidden rounded-xl">
                <iframe
                  src={residence.video_url}
                  title={t("videoTour")}
                  className="h-full w-full border-0"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          <div>
            <h2 className="text-2xl">{t("availability")}</h2>
            <p className="prose-muted mt-2 mb-4 text-sm">{t("availabilityNote")}</p>
            <AvailabilityCalendar events={availability} />
          </div>

          {residence?.latitude != null && residence?.longitude != null && (
            <div>
              <div className="flex items-end justify-between gap-4">
                <h2 className="text-2xl">{t("location")}</h2>
                {mapsHref && (
                  <a
                    href={mapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-hover"
                  >
                    <IconMapPin className="text-base" />
                    {t("viewOnMap")}
                  </a>
                )}
              </div>
              {residence.address && (
                <p className="prose-muted mt-2 text-sm">{residence.address}</p>
              )}
              <div className="card mt-4 overflow-hidden">
                <RoomMap
                  lat={residence.latitude}
                  lng={residence.longitude}
                  label={`Map showing ${residence.name}`}
                />
              </div>
            </div>
          )}

          {platforms.length > 0 && (
            <div>
              <h2 className="text-2xl">{t("alsoFeaturedIn")}</h2>
              <p className="prose-muted mt-2 text-sm">{t("alsoFeaturedInNote")}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {platforms.map(([key, url]) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                  >
                    {PLATFORM_LABELS[key]}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky booking sidebar */}
        <div id="request" className="scroll-mt-24">
          <div className="lg:sticky lg:top-20">
            <RequestForm roomId={room.id} />
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-16">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl">{t("relatedTitle")}</h2>
            {residence && (
              <Link
                href={`/residences/${residence.slug}`}
                className="inline-flex items-center gap-1 text-sm font-medium text-accent"
              >
                {residence.name} <IconArrowRight />
              </Link>
            )}
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <RoomCard
                key={r.id}
                room={r}
                residence={residence ?? undefined}
                cover={covers[r.id]}
              />
            ))}
          </div>
        </div>
      )}

      <StickyBookingBar price={price} availableLabel={availableLabel} />
    </div>
  );
}

// Labelled key/value cell for the "at a glance" facts grid.
function Fact({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-0.5 font-medium text-ink">{children}</div>
    </div>
  );
}
