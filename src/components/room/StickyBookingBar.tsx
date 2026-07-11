"use client";

import { useTranslations } from "next-intl";
import { IconArrowRight } from "@/components/icons";

// Mobile-only sticky bottom booking bar (2020 wireframe). On desktop the
// booking form lives in a sticky sidebar, so this only shows below `lg`.
// The button scrolls to the request form (#request).
export function StickyBookingBar({
  price,
  availableLabel,
}: {
  price: string | null;
  availableLabel: string | null;
}) {
  const t = useTranslations("room");
  const common = useTranslations("common");

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.06)] lg:hidden">
      <div className="container-page flex items-center justify-between gap-3 py-3">
        <div className="min-w-0">
          {price ? (
            <>
              <div className="font-display text-lg font-semibold leading-tight text-ink">
                {price}
                <span className="text-sm font-normal text-muted">
                  {" "}
                  {common("perMonth")}
                </span>
              </div>
              {availableLabel && (
                <div className="truncate text-xs text-accent">
                  {availableLabel}
                </div>
              )}
            </>
          ) : (
            <div className="text-sm font-medium text-ink">
              {common("priceOnRequest")}
            </div>
          )}
        </div>
        <a href="#request" className="btn btn-primary shrink-0">
          {t("requestThisRoom")}
          <IconArrowRight />
        </a>
      </div>
    </div>
  );
}
