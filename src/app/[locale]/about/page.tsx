import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageIntro } from "@/components/PageIntro";
import { ContactForm } from "@/components/ContactForm";
import { IconShield, IconSparkle, IconWrench } from "@/components/icons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

const VALUES = [
  { key: "value1", Icon: IconShield },
  { key: "value2", Icon: IconSparkle },
  { key: "value3", Icon: IconWrench },
] as const;

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <>
      <PageIntro title={t("title")} subtitle={t("lead")} />

      <section className="section">
        <div className="container-page max-w-2xl space-y-5 text-lg leading-relaxed text-ink-soft">
          <p>{t("body1")}</p>
          <p>{t("body2")}</p>
          <p>{t("body3")}</p>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="container-page">
          <h2 className="text-center text-3xl md:text-4xl">{t("valuesTitle")}</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {VALUES.map(({ key, Icon }) => (
              <div key={key} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-2xl text-accent">
                  <Icon />
                </div>
                <h3 className="mt-4 text-lg font-medium">{t(`${key}_title`)}</h3>
                <p className="prose-muted mt-1.5 text-sm">{t(`${key}_body`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl md:text-4xl">{t("contactTitle")}</h2>
            <p className="prose-muted mt-3">{t("contactBody")}</p>
          </div>
          <ContactForm topic="about" />
        </div>
      </section>
    </>
  );
}
