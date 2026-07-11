// Fire a GA4 event. No-op if gtag isn't present (e.g. no GA id, or before the
// script loads). Google Consent Mode governs whether it's actually stored.
export function track(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (typeof g === "function") g("event", name, params ?? {});
}
