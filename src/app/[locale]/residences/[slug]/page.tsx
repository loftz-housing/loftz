import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { RoomCard } from "@/components/RoomCard";
import { IconMapPin, IconCheck } from "@/components/icons";
import { routing } from "@/i18n/routing";
import {
  getResidences,
  getResidenceBySlug,
  getRoomsByResidence,
  getPhotosForResidence,
  getRoomCoverPhotos,
} from "@/lib/data";

export const revalidate = 3600;

export async function generateStaticParams() {
  const residences = await getResidences();
  return routing.locales.flatMap((locale) =>
    residences.map((r) => ({ locale, slug: r.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "residences" });
  const residence = await getResidenceBySlug(slug);
  if (!residence) return {};
  return {
    title: t("detailMetaTitle", {
      name: residence.name,
      neighborhood: residence.neighborhood ?? "Lisbon",
    }),
  };
}

export default async function ResidenceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("residences");

  const residence = await getResidenceBySlug(slug);
  if (!residence) notFound();

  const [rooms, photos, covers] = await Promise.all([
    getRoomsByResidence(residence.id),
    getPhotosForResidence(residence.id),
    getRoomCoverPhotos(),
  ]);
  const commonPhotos = photos.filter((p) => p.room_id === null);

  const mapQuery = residence.latitude
    ? `${residence.latitude},${residence.longitude}`
    : encodeURIComponent(residence.address ?? `${residence.name}, Lisbon`);
  const mapUrl = `https://www.openstreetmap.org/search?query=${mapQuery}`;

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="container-page py-12 md:py-16">
          {residence.neighborhood && (
            <div className="mb-2 inline-flex items-center gap-1 text-sm text-muted">
              <IconMapPin style={{ fontSize: "1rem" }} />
              {residence.neighborhood}
            </div>
          )}
          <h1 className="text-4xl md:text-5xl">{residence.name}</h1>
          {residence.address && (
            <p className="prose-muted mt-3">{residence.address}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="chip">{t("roomsCount", { count: rooms.length })}</span>
            {residence.bathrooms != null && (
              <span className="chip">{t("bathrooms", { count: residence.bathrooms })}</span>
            )}
            <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="chip chip-accent">
              {t("viewOnMap")}
            </a>
          </div>
        </div>
      </section>

      {commonPhotos.length > 0 && (
        <section className="pt-10">
          <div className="container-page">
            <div className="grid grid-cols-2 gap-2 overflow-hidden rounded-xl md:grid-cols-4">
              {commonPhotos.slice(0, 4).map((p) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={p.id}
                  src={p.url}
                  alt={p.alt ?? residence.name}
                  className="aspect-[4/3] w-full object-cover"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div className="lg:sticky lg:top-20 lg:h-fit">
            {residence.description && (
              <>
                <h2 className="text-2xl">{t("aboutResidence")}</h2>
                <p className="prose-muted mt-3">{residence.description}</p>
              </>
            )}
            {residence.facilities.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium">{t("facilities")}</h3>
                <ul className="mt-3 space-y-2">
                  {residence.facilities.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-ink-soft">
                      <IconCheck className="text-accent" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {residence.cleaning_frequency && (
              <p className="prose-muted mt-6 text-sm">
                <strong className="text-ink">{t("cleaning")}:</strong>{" "}
                {residence.cleaning_frequency}
              </p>
            )}
          </div>

          <div>
            <h2 className="mb-5 text-2xl">{t("roomsHere")}</h2>
            {rooms.length === 0 ? (
              <p className="prose-muted">{t("noRooms")}</p>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {rooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    residence={residence}
                    cover={covers[room.id]}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
