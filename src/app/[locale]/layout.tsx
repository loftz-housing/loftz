import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConsentBanner } from "@/components/analytics/ConsentBanner";
import { Analytics } from "@/components/analytics/Analytics";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://loftz.net";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("metaTitle"),
      template: "%s | LOFTZ",
    },
    description: t("metaDescription"),
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `/${l}`])
      ),
    },
    openGraph: {
      type: "website",
      siteName: "LOFTZ",
      locale: locale === "pt" ? "pt_PT" : "en_GB",
      url: `${SITE_URL}/${locale}`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "LOFTZ",
                url: SITE_URL,
                sameAs: [
                  "https://www.facebook.com/loftzhousing",
                  "https://www.linkedin.com/company/loftzhousing",
                ],
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "LOFTZ",
                url: SITE_URL,
                inLanguage: locale,
              },
            ]),
          }}
        />
        <NextIntlClientProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ConsentBanner />
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
