import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const COMPLAINTS_URL = "https://www.livroreclamacoes.pt/inicio";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  const year = 2026; // Date.now unavailable at build in some tooling; static year.

  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <div className="font-display text-2xl font-semibold">LOFTZ</div>
          <p className="prose-muted mt-3 max-w-xs text-sm">{t("tagline")}</p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">{t("explore")}</h3>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link className="hover:text-accent" href="/residences">{nav("residences")}</Link></li>
            <li><Link className="hover:text-accent" href="/book-now">{nav("bookNow")}</Link></li>
            <li><Link className="hover:text-accent" href="/landlords">{nav("landlords")}</Link></li>
            <li><Link className="hover:text-accent" href="/partnerships">{nav("partnerships")}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">{t("company")}</h3>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link className="hover:text-accent" href="/about">{nav("about")}</Link></li>
            <li><Link className="hover:text-accent" href="/faq">{nav("faq")}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">{t("legalHeading")}</h3>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link className="hover:text-accent" href="/legal/privacy">{t("privacy")}</Link></li>
            <li><Link className="hover:text-accent" href="/legal/terms">{t("terms")}</Link></li>
            <li><Link className="hover:text-accent" href="/legal/cookies">{t("cookies")}</Link></li>
            <li>
              <a
                className="hover:text-accent"
                href={COMPLAINTS_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("complaints")}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted sm:flex-row">
          <p>© {year} LOFTZ. {t("rights")}</p>
          <p>{t("entity")}</p>
        </div>
      </div>
    </footer>
  );
}
