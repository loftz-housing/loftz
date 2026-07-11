import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-6xl font-semibold text-accent">404</p>
      <h1 className="mt-4 text-3xl">{t("title")}</h1>
      <p className="prose-muted mt-3 max-w-md">{t("body")}</p>
      <Link href="/" className="btn btn-primary mt-6">
        {t("home")}
      </Link>
    </div>
  );
}
