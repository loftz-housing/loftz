"use client";

// Minimal consent store (no library). Choice persists in localStorage; a custom
// event lets the analytics loader react without a full reload.
export type ConsentChoice = "granted" | "denied";

const KEY = "loftz-consent";
export const CONSENT_EVENT = "loftz-consent-change";

export function getConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(KEY);
  return v === "granted" || v === "denied" ? v : null;
}

export function setConsent(choice: ConsentChoice) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, choice);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: choice }));
}
