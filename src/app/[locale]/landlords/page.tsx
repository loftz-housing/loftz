import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageIntro } from "@/components/PageIntro";
import { IconShield, IconBuilding, IconChart, IconCheck } from "@/components/icons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landlords" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

const PROGRAMS = [
  { key: "sublet", Icon: IconShield, featured: true },
  { key: "management", Icon: IconBuilding, featured: false },
  { key: "development", Icon: IconChart, featured: false },
] as const;

export default async function LandlordsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("landlords");

  return (
    <>
      <PageIntro title={t("title")} subtitle={t("subtitle")} />

      <section className="section">
        <div className="container-page grid gap-6 lg:grid-cols-3">
          {PROGRAMS.map(({ key, Icon, featured }) => (
            <div
              key={key}
              className={`card flex flex-col p-7 ${
                featured ? "ring-2 ring-accent" : ""
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-2xl text-accent">
                <Icon />
              </div>
              <h2 className="mt-5 text-2xl">{t(`${key}_title`)}</h2>
              {key === "sublet" && (
                <p className="mt-1 text-sm font-semibold text-accent">
                  {t("sublet_tagline")}
                </p>
              )}
              <p className="prose-muted mt-3 flex-1 text-sm">{t(`${key}_body`)}</p>
            </div>
          ))}
        </div>

        <div className="container-page mt-10">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-ink-soft">
            {(["benefit1", "benefit2", "benefit3"] as const).map((b) => (
              <span key={b} className="inline-flex items-center gap-2">
                <IconCheck className="text-accent" /> {t(b)}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-page">
          <div className="rounded-2xl bg-ink px-8 py-14 text-center text-white">
            <h2 className="text-3xl text-white">{t("ctaTitle")}</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/80">{t("ctaBody")}</p>
            <a
              href="mailto:henriquesantana@loftz.net?subject=Landlord%20enquiry"
              className="btn btn-lg mt-6 bg-white text-ink hover:bg-white/90"
            >
              {t("ctaButton")}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
