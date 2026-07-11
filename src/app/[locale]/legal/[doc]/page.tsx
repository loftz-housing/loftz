import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageIntro } from "@/components/PageIntro";
import { routing } from "@/i18n/routing";
import { LEGAL_CONTENT, LEGAL_DOCS, type LegalDoc } from "@/content/legal";

const TITLE_KEY: Record<LegalDoc, string> = {
  privacy: "privacyTitle",
  terms: "termsTitle",
  cookies: "cookiesTitle",
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    LEGAL_DOCS.map((doc) => ({ locale, doc }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; doc: string }>;
}): Promise<Metadata> {
  const { locale, doc } = await params;
  if (!LEGAL_DOCS.includes(doc as LegalDoc)) return {};
  const t = await getTranslations({ locale, namespace: "legal" });
  return { title: t(TITLE_KEY[doc as LegalDoc]), robots: { index: false } };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string; doc: string }>;
}) {
  const { locale, doc } = await params;
  if (!LEGAL_DOCS.includes(doc as LegalDoc)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("legal");
  const key = doc as LegalDoc;
  const sections = LEGAL_CONTENT[key][locale === "pt" ? "pt" : "en"];

  return (
    <>
      <PageIntro title={t(TITLE_KEY[key])} />
      <section className="section">
        <div className="container-page max-w-3xl">
          <div className="mb-8 rounded-lg border border-[var(--color-line-strong)] bg-surface-2 p-4 text-sm text-ink-soft">
            ⚠️ {t("draftNotice")}
          </div>

          <div className="space-y-8">
            {sections.map((s, i) => (
              <div key={i}>
                <h2 className="text-xl">{s.heading}</h2>
                {s.body.map((p, j) => (
                  <p key={j} className="prose-muted mt-2">{p}</p>
                ))}
              </div>
            ))}
          </div>

          {key !== "privacy" && (
            <p className="prose-muted mt-10 text-sm">
              {t("complaintsBookNote")}{" "}
              <a
                href="https://www.livroreclamacoes.pt/inicio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline underline-offset-2"
              >
                {t("complaintsBook")}
              </a>
              .
            </p>
          )}
        </div>
      </section>
    </>
  );
}
