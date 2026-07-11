import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageIntro } from "@/components/PageIntro";
import { ResidenceBlock } from "@/components/ResidenceBlock";
import { getResidences, getRooms, getRoomCoverPhotos } from "@/lib/data";

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
    getRoomCoverPhotos(),
  ]);
  const roomsByResidence = rooms.reduce<Record<string, typeof rooms>>((acc, r) => {
    (acc[r.residence_id] ??= []).push(r);
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
            <div className="space-y-12">
              {residences.map((r) => (
                <ResidenceBlock
                  key={r.id}
                  residence={r}
                  rooms={roomsByResidence[r.id] ?? []}
                  covers={covers}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
