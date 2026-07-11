import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Hero } from "@/components/home/Hero";
import { SearchBar } from "@/components/home/SearchBar";
import { ValueProps } from "@/components/home/ValueProps";
import { Stats } from "@/components/home/Stats";
import { ResidenceMap } from "@/components/ResidenceMap";
import { getResidences, getStats, getHeroPhotos } from "@/lib/data";
import type { Metadata } from "next";

// ISR: catalog data lives in Supabase and changes outside deploys (admin, iCal
// sync). Revalidate hourly so pages stay fresh without a rebuild.
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const [residences, stats, heroImages] = await Promise.all([
    getResidences(),
    getStats(),
    getHeroPhotos(),
  ]);

  return (
    <>
      <Hero images={heroImages}>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/80">
            LOFTZ · Lisbon
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl md:text-6xl">
            {t("heroTagline")}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/90">
            {t("heroSubtitle")}
          </p>
        </div>
        <div className="mt-8">
          <p className="mb-3 text-sm font-medium text-white/80">
            {t("searchTitle")}
          </p>
          <SearchBar residences={residences} />
        </div>
      </Hero>

      <ValueProps />
      <Stats stats={stats} />
      <ResidenceMap residences={residences} />

      {/* SEO text + CTA */}
      <section className="section">
        <div className="container-page grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-3xl md:text-4xl">{t("seoTitle")}</h2>
            <p className="prose-muted mt-4">{t("seoBody")}</p>
          </div>
          <div className="rounded-2xl bg-accent px-8 py-12 text-center text-white">
            <h2 className="text-2xl text-white md:text-3xl">{t("ctaTitle")}</h2>
            <p className="mx-auto mt-3 max-w-md text-white/90">{t("ctaBody")}</p>
            <Link
              href="/book-now"
              className="btn btn-lg mt-6 bg-white text-accent hover:bg-white/90"
            >
              {t("ctaButton")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
