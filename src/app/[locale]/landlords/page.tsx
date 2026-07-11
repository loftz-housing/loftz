import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/ContactForm";
import {
  IconShield,
  IconBuilding,
  IconChart,
  IconSparkle,
  IconDocument,
  IconWrench,
  IconCheck,
  IconArrowRight,
} from "@/components/icons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landlords" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

const WHY = [
  { key: "why1", Icon: IconChart },
  { key: "why2", Icon: IconSparkle },
  { key: "why3", Icon: IconDocument },
  { key: "why4", Icon: IconWrench },
] as const;

export default async function LandlordsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("landlords");

  const guaranteedPoints = t.raw("guaranteed_points") as string[];
  const managedPoints = t.raw("managed_points") as string[];

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line bg-surface">
        <div className="container-page py-16 md:py-24">
          <div className="max-w-3xl">
            <p className="eyebrow">{t("eyebrow")}</p>
            <h1 className="mt-3 text-4xl md:text-6xl">{t("title")}</h1>
            <p className="prose-muted mt-5 text-lg md:text-xl">{t("subtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#proposal" className="btn btn-primary btn-lg">
                {t("primaryCta")}
              </a>
              <a href="#how" className="btn btn-outline btn-lg">
                {t("secondaryCta")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="section">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl md:text-4xl">{t("programsTitle")}</h2>
            <p className="prose-muted mt-3">{t("programsSubtitle")}</p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {[
              { key: "guaranteed", Icon: IconShield, points: guaranteedPoints, featured: true },
              { key: "managed", Icon: IconBuilding, points: managedPoints, featured: false },
            ].map(({ key, Icon, points, featured }) => (
              <div
                key={key}
                className={`card flex flex-col p-7 ${featured ? "ring-2 ring-accent" : ""}`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-2xl text-accent">
                  <Icon />
                </div>
                <h3 className="mt-5 text-2xl">{t(`${key}_title`)}</h3>
                <p className="mt-1 text-sm font-semibold text-accent">{t(`${key}_tagline`)}</p>
                <p className="prose-muted mt-3 text-sm">{t(`${key}_body`)}</p>
                <ul className="mt-5 space-y-2.5">
                  {points.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-ink-soft">
                      <IconCheck className="mt-0.5 flex-shrink-0 text-accent" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <a href="#proposal" className="btn btn-primary mt-6 self-start">
                  {t("primaryCta")}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why LOFTZ */}
      <section className="section bg-surface">
        <div className="container-page">
          <h2 className="text-center text-3xl md:text-4xl">{t("whyTitle")}</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map(({ key, Icon }) => (
              <div key={key}>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-bg text-xl text-accent shadow-[var(--shadow-card)]">
                  <Icon />
                </div>
                <h3 className="mt-4 text-lg font-medium">{t(`${key}_title`)}</h3>
                <p className="prose-muted mt-1.5 text-sm">{t(`${key}_body`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="section">
        <div className="container-page">
          <h2 className="text-center text-3xl md:text-4xl">{t("howTitle")}</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {["how1", "how2", "how3", "how4"].map((k, i) => (
              <div key={k} className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent font-display text-lg font-semibold text-white">
                  {i + 1}
                </div>
                <h3 className="mt-4 text-lg font-medium">{t(`${k}_title`)}</h3>
                <p className="prose-muted mt-1.5 text-sm">{t(`${k}_body`)}</p>
                {i < 3 && (
                  <IconArrowRight className="absolute -right-3 top-1 hidden text-line-strong md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proposal / contact */}
      <section id="proposal" className="section bg-surface scroll-mt-20">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl md:text-4xl">{t("ctaTitle")}</h2>
            <p className="prose-muted mt-3 text-lg">{t("ctaBody")}</p>
          </div>
          <ContactForm topic="landlord" />
        </div>
      </section>
    </>
  );
}
