import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageIntro } from "@/components/PageIntro";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const nav = await getTranslations("nav");

  return (
    <>
      <PageIntro title={t("title")} subtitle={t("lead")} />
      <section className="section">
        <div className="container-page max-w-2xl space-y-5 text-lg leading-relaxed text-ink-soft">
          <p>{t("body1")}</p>
          <p>{t("body2")}</p>
          <p>{t("body3")}</p>
          <div className="pt-4">
            <Link href="/book-now" className="btn btn-primary btn-lg">
              {nav("bookNow")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
