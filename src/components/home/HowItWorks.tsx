import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { IconArrowRight } from "@/components/icons";
import {
  IllusDiscover,
  IllusResidence,
  IllusLandlord,
} from "@/components/illustrations";

// Three-step "how it works" band with flat, hand-made illustrations — echoes
// the circular step figures in the 2020 wireframe (D-29).
const STEPS = [
  { key: "how1", href: "/book-now", Illus: IllusDiscover },
  { key: "how2", href: "/book-now", Illus: IllusResidence },
  { key: "how3", href: "/landlords", Illus: IllusLandlord },
] as const;

export function HowItWorks() {
  const t = useTranslations("home");

  return (
    <section className="section">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{t("howTitle")}</p>
          <h2 className="mt-2 text-3xl md:text-4xl">{t("howSubtitle")}</h2>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {STEPS.map(({ key, href, Illus }, i) => (
            <div key={key} className="flex flex-col items-center text-center">
              <div className="relative">
                <Illus className="h-36 w-36" />
                <span className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-coral font-display text-sm font-semibold text-white shadow-card">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-6 text-xl">{t(`${key}_title`)}</h3>
              <p className="prose-muted mt-2 max-w-xs text-sm">
                {t(`${key}_body`)}
              </p>
              <Link
                href={href}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-hover"
              >
                {t(`${key}_cta`)}
                <IconArrowRight className="text-base" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
