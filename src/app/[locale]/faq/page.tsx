import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageIntro } from "@/components/PageIntro";
import { IconChevronDown } from "@/components/icons";

interface FaqItem {
  q: string;
  a: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faq");
  const items = t.raw("items") as FaqItem[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageIntro title={t("title")} subtitle={t("subtitle")} />
      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-3">
            {items.map((it, i) => (
              <details
                key={i}
                className="card group overflow-hidden [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 font-medium">
                  {it.q}
                  <IconChevronDown className="flex-shrink-0 text-muted transition-transform group-open:rotate-180" />
                </summary>
                <div className="prose-muted px-5 pb-5 text-sm">{it.a}</div>
              </details>
            ))}
          </div>

          <aside className="lg:sticky lg:top-20 lg:h-fit">
            <div className="card bg-surface p-6">
              <h2 className="text-xl">{t("stillTitle")}</h2>
              <p className="prose-muted mt-2 text-sm">{t("stillBody")}</p>
              <a
                href="mailto:henriquesantana@loftz.net"
                className="btn btn-primary mt-4 w-full"
              >
                {t("stillTitle")}
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
