import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { IconFacebook, IconLinkedin } from "@/components/icons";

const COMPLAINTS_URL = "https://www.livroreclamacoes.pt/inicio";
const SOCIALS = [
  { href: "https://www.facebook.com/loftzhousing", label: "Facebook", Icon: IconFacebook },
  { href: "https://www.linkedin.com/company/loftzhousing", label: "LinkedIn", Icon: IconLinkedin },
];

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  const year = 2026; // Date.now unavailable at build in some tooling; static year.

  return (
    <footer className="mt-auto bg-accent text-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <div className="font-display text-2xl font-semibold text-white">LOFTZ</div>
          <p className="mt-3 max-w-xs text-sm text-white/80">{t("tagline")}</p>
          <div className="mt-5 flex gap-3">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-lg text-white transition-colors hover:border-white hover:bg-white/10"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">{t("explore")}</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link className="hover:text-white" href="/residences">{nav("residences")}</Link></li>
            <li><Link className="hover:text-white" href="/book-now">{nav("bookNow")}</Link></li>
            <li><Link className="hover:text-white" href="/landlords">{nav("landlords")}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">{t("company")}</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link className="hover:text-white" href="/about">{nav("about")}</Link></li>
            <li><Link className="hover:text-white" href="/faq">{nav("faq")}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">{t("legalHeading")}</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link className="hover:text-white" href="/legal/privacy">{t("privacy")}</Link></li>
            <li><Link className="hover:text-white" href="/legal/terms">{t("terms")}</Link></li>
            <li><Link className="hover:text-white" href="/legal/cookies">{t("cookies")}</Link></li>
            <li>
              <a
                className="hover:text-white"
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

      <div className="border-t border-white/15">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/70 sm:flex-row">
          <p>© {year} LOFTZ. {t("rights")}</p>
        </div>
      </div>
    </footer>
  );
}
