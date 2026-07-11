import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageIntro } from "@/components/PageIntro";
import { RoomsBrowser } from "@/components/book/RoomsBrowser";
import { getRooms, getResidences, getRoomCoverPhotos } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "book" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function BookNowPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ residence?: string }>;
}) {
  const { locale } = await params;
  const { residence } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("book");

  const [rooms, residences, covers] = await Promise.all([
    getRooms(),
    getResidences(),
    getRoomCoverPhotos(),
  ]);

  return (
    <>
      <PageIntro title={t("title")} subtitle={t("subtitle", { count: rooms.length })} />
      <section className="section">
        <div className="container-page">
          <RoomsBrowser
            rooms={rooms}
            residences={residences}
            covers={covers}
            initialResidence={residence ?? ""}
          />
        </div>
      </section>
    </>
  );
}
