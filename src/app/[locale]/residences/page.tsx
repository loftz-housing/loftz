import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageIntro } from "@/components/PageIntro";
import { ResidenceCard } from "@/components/ResidenceCard";
import { getResidences, getRooms, getResidenceCoverPhotos } from "@/lib/data";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "residences" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function ResidencesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("residences");

  const [residences, rooms, covers] = await Promise.all([
    getResidences(),
    getRooms(),
    getResidenceCoverPhotos(),
  ]);
  const countByResidence = rooms.reduce<Record<string, number>>((acc, r) => {
    acc[r.residence_id] = (acc[r.residence_id] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <PageIntro title={t("title")} subtitle={t("subtitle")} />
      <section className="section">
        <div className="container-page">
          {residences.length === 0 ? (
            <p className="prose-muted">{t("noRooms")}</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {residences.map((r) => (
                <ResidenceCard
                  key={r.id}
                  residence={r}
                  roomCount={countByResidence[r.id] ?? 0}
                  cover={covers[r.id]}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
