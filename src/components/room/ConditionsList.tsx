import { useTranslations } from "next-intl";
import type { EligibilityConditions } from "@/lib/types";
import { IconShield } from "@/components/icons";

export function ConditionsList({ c }: { c: EligibilityConditions }) {
  const t = useTranslations("conditions");
  const chips: string[] = [];

  if (c.age_min != null && c.age_max != null)
    chips.push(t("ageRange", { min: c.age_min, max: c.age_max }));
  else if (c.age_min != null) chips.push(t("ageMin", { min: c.age_min }));
  else if (c.age_max != null) chips.push(t("ageMax", { max: c.age_max }));

  if (c.gender === "male") chips.push(t("genderMale"));
  if (c.gender === "female") chips.push(t("genderFemale"));
  if (c.min_stay_months != null)
    chips.push(t("minStay", { months: c.min_stay_months }));
  if (c.max_stay_months != null)
    chips.push(t("maxStay", { months: c.max_stay_months }));
  if (!c.allow_smoking) chips.push(t("noSmoking"));
  if (!c.allow_parties) chips.push(t("noParties"));
  if (!c.allow_pets) chips.push(t("noPets"));
  for (const r of c.house_rules) chips.push(r);

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip, i) => (
        <span key={i} className="chip">
          <IconShield style={{ fontSize: "0.9rem" }} /> {chip}
        </span>
      ))}
    </div>
  );
}
