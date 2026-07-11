import { useTranslations } from "next-intl";
import {
  IconCoins,
  IconSparkle,
  IconWifi,
  IconKitchen,
  IconTrain,
  IconShop,
  IconWrench,
  IconDocument,
} from "@/components/icons";

const ITEMS = [
  { key: "rent", Icon: IconCoins },
  { key: "cleaning", Icon: IconSparkle },
  { key: "wifi", Icon: IconWifi },
  { key: "kitchen", Icon: IconKitchen },
  { key: "transport", Icon: IconTrain },
  { key: "amenities", Icon: IconShop },
  { key: "maintenance", Icon: IconWrench },
  { key: "contract", Icon: IconDocument },
] as const;

export function ValueProps() {
  const t = useTranslations("expect");
  const home = useTranslations("home");

  return (
    <section className="section bg-surface">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl">{home("expectTitle")}</h2>
          <p className="prose-muted mt-3">{home("expectSubtitle")}</p>
        </div>

        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ key, Icon }) => (
            <div key={key} className="text-center sm:text-left">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-2xl text-accent sm:mx-0">
                <Icon />
              </div>
              <h3 className="mt-4 text-lg font-medium">{t(`${key}_title`)}</h3>
              <p className="prose-muted mt-1.5 text-sm">{t(`${key}_body`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
