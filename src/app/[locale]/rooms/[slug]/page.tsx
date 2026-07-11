import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Gallery } from "@/components/room/Gallery";
import { RequestForm } from "@/components/room/RequestForm";
import { ConditionsList } from "@/components/room/ConditionsList";
import { AvailabilityCalendar } from "@/components/room/AvailabilityCalendar";
import { RoomCard } from "@/components/RoomCard";
import { IconMapPin, IconBed, IconBath, IconRuler, IconArrowRight } from "@/components/icons";
import { routing } from "@/i18n/routing";
import { formatPrice, PLATFORM_LABELS } from "@/lib/format";
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
  const residence = await getResidenceById(room.residence_id);
  const t = await getTranslations({ locale, namespace: "room" });
  return {
    title: t("detailMetaTitle", {
      residence: residence?.name ?? "LOFTZ",
      room: room.name,
    }),
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

  const platforms = Object.entries(room.platform_links).filter(
    ([, url]) => !!url
  ) as [PlatformKey, string][];

  return (
    <div className="container-page py-8 md:py-12">
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
              <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-ink-soft sm:grid-cols-3">
                {room.room_contents.map((c) => (
                  <li key={c}>{c}</li>
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
        <div>
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
    </div>
  );
}
