import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageIntro } from "@/components/PageIntro";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "partnerships" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function PartnershipsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("partnerships");

  // Partner list is data-driven later (plan); empty state for now.
  const partners: { name: string; description: string; url: string }[] = [];

  return (
    <>
      <PageIntro title={t("title")} subtitle={t("subtitle")} />
      <section className="section">
        <div className="container-page">
          {partners.length === 0 ? (
            <div className="card mx-auto max-w-xl p-10 text-center">
              <p className="prose-muted">{t("empty")}</p>
              <a
                href="mailto:henriquesantana@loftz.net?subject=Partnership%20enquiry"
                className="btn btn-primary mt-5"
              >
                {t("becomePartner")}
              </a>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {partners.map((p) => (
                <a key={p.name} href={p.url} className="card p-6">
                  <h3 className="text-lg font-medium">{p.name}</h3>
                  <p className="prose-muted mt-2 text-sm">{p.description}</p>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
