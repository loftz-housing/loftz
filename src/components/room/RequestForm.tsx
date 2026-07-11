"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { IconCheck } from "@/components/icons";
import { track } from "@/lib/track";
import type { EligibilityReason } from "@/lib/eligibility";
import {
  type BusyRange,
  isValidRange,
  rangeOverlapsBusy,
  minCheckIn,
} from "@/lib/availability";

type Mode = "booking" | "visit";
type Result =
  | { status: "ok" }
  | { status: "blocked"; reasons: EligibilityReason[] }
  | { status: "unavailable" }
  | { status: "error" }
  | null;

export function RequestForm({
  roomId,
  defaultMode = "booking",
  busy = [],
  availableFrom = null,
}: {
  roomId: string;
  defaultMode?: Mode;
  busy?: BusyRange[];
  availableFrom?: string | null;
}) {
  const t = useTranslations("forms");
  const el = useTranslations("eligibility");
  const footer = useTranslations("footer");
  const locale = useLocale();
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const minIn = minCheckIn(availableFrom);
  // Local date validity: order + no overlap with a booked night.
  const dateOrderBad =
    mode === "booking" && checkIn !== "" && checkOut !== "" && !isValidRange(checkIn, checkOut);
  const overlapsBusy =
    mode === "booking" && isValidRange(checkIn, checkOut) && rangeOverlapsBusy(checkIn, checkOut, busy);
  const datesBlocked = dateOrderBad || overlapsBusy;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (mode === "booking" && datesBlocked) {
      setResult({ status: "unavailable" });
      return;
    }
    setSubmitting(true);
    setResult(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      roomId,
      type: mode,
      locale,
      full_name: String(fd.get("full_name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || "") || null,
      nationality: String(fd.get("nationality") || "") || null,
      date_of_birth: String(fd.get("date_of_birth") || "") || null,
      occupation: String(fd.get("occupation") || "") || null,
      gender: String(fd.get("gender") || "") || null,
      check_in: mode === "booking" ? String(fd.get("check_in") || "") || null : null,
      check_out: mode === "booking" ? String(fd.get("check_out") || "") || null : null,
      visit_date: mode === "visit" ? String(fd.get("visit_date") || "") || null : null,
      visit_time: mode === "visit" ? String(fd.get("visit_time") || "") || null : null,
      message: String(fd.get("message") || "") || null,
      accepted_house_rules: fd.get("accept_rules") === "on",
    };

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.status === "ok") {
        track(mode === "booking" ? "booking_request" : "visit_request", { room_id: roomId });
        setResult({ status: "ok" });
      }
      else if (data.status === "blocked")
        setResult({ status: "blocked", reasons: data.reasons ?? [] });
      else if (data.status === "unavailable")
        setResult({ status: "unavailable" });
      else setResult({ status: "error" });
    } catch {
      setResult({ status: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  if (result?.status === "ok") {
    return (
      <div className="card p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-2xl text-accent">
          <IconCheck />
        </div>
        <h3 className="mt-4 text-xl">{t("successTitle")}</h3>
        <p className="prose-muted mt-2 text-sm">
          {mode === "booking" ? t("successBooking") : t("successVisit")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card p-5 sm:p-6">
      {/* Tabs */}
      <div className="mb-5 grid grid-cols-2 gap-1 rounded-lg bg-surface-2 p-1">
        {(["booking", "visit"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setResult(null);
            }}
            className={`rounded-md py-2 text-sm font-medium transition-colors ${
              mode === m ? "bg-bg shadow-sm" : "text-muted hover:text-ink"
            }`}
          >
            {m === "booking" ? t("tabBooking") : t("tabVisit")}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        <Field name="full_name" label={t("fullName")} required />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="email" type="email" label={t("email")} required />
          <Field name="phone" label={t("phone")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="nationality" label={t("nationality")} />
          <Field name="date_of_birth" type="date" label={t("dateOfBirth")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="occupation">{t("occupation")}</label>
            <select id="occupation" name="occupation" className="field" defaultValue="">
              <option value="" disabled>—</option>
              <option value="student">{t("occupationStudent")}</option>
              <option value="worker">{t("occupationWorker")}</option>
              <option value="other">{t("occupationOther")}</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="gender">{t("gender")}</label>
            <select id="gender" name="gender" className="field" defaultValue="">
              <option value="" disabled>—</option>
              <option value="male">{t("genderMale")}</option>
              <option value="female">{t("genderFemale")}</option>
              <option value="other">{t("genderOther")}</option>
              <option value="prefer_not">{t("genderPreferNot")}</option>
            </select>
          </div>
        </div>

        {mode === "booking" ? (
          <div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="check_in">
                  {t("checkIn")}
                  <span className="text-[var(--color-danger)]"> *</span>
                </label>
                <input
                  id="check_in"
                  name="check_in"
                  type="date"
                  required
                  className="field"
                  min={minIn}
                  value={checkIn}
                  onChange={(e) => {
                    setCheckIn(e.target.value);
                    if (checkOut && e.target.value >= checkOut) setCheckOut("");
                  }}
                />
              </div>
              <div>
                <label className="label" htmlFor="check_out">
                  {t("checkOut")}
                  <span className="text-[var(--color-danger)]"> *</span>
                </label>
                <input
                  id="check_out"
                  name="check_out"
                  type="date"
                  required
                  className="field"
                  min={checkIn || minIn}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>
            </div>
            {dateOrderBad && (
              <p className="mt-2 text-sm text-[var(--color-danger)]">
                {t("dateOrderError")}
              </p>
            )}
            {overlapsBusy && (
              <div className="mt-3 rounded-lg border border-[var(--color-danger)] bg-danger-soft p-3 text-sm">
                <p className="font-medium text-[var(--color-danger)]">
                  {t("unavailableTitle")}
                </p>
                <p className="mt-1 text-ink-soft">{t("unavailableBody")}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="visit_date" type="date" label={t("visitDate")} required />
            <Field name="visit_time" type="time" label={t("visitTime")} />
          </div>
        )}

        <div>
          <label className="label" htmlFor="message">{t("message")}</label>
          <textarea
            id="message"
            name="message"
            rows={3}
            className="field"
            placeholder={t("messagePlaceholder")}
          />
        </div>

        <label className="flex items-start gap-2 text-sm text-ink-soft">
          <input type="checkbox" name="accept_rules" required className="mt-1" />
          <span>{t("acceptHouseRules")}</span>
        </label>
        <label className="flex items-start gap-2 text-sm text-ink-soft">
          <input type="checkbox" name="accept_privacy" required className="mt-1" />
          <span>{t("acceptPrivacy")}</span>
        </label>

        {result?.status === "blocked" && (
          <div className="rounded-lg border border-[var(--color-danger)] bg-danger-soft p-4 text-sm">
            <p className="font-medium text-[var(--color-danger)]">{el("blockedTitle")}</p>
            <p className="mt-1 text-ink-soft">{el("blockedIntro")}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-ink-soft">
              {result.reasons.map((r) => (
                <li key={r}>{el(r)}</li>
              ))}
            </ul>
            <p className="mt-2 text-ink-soft">{el("adjust")}</p>
          </div>
        )}
        {result?.status === "unavailable" && (
          <div className="rounded-lg border border-[var(--color-danger)] bg-danger-soft p-4 text-sm">
            <p className="font-medium text-[var(--color-danger)]">{t("unavailableTitle")}</p>
            <p className="mt-1 text-ink-soft">{t("unavailableBody")}</p>
          </div>
        )}
        {result?.status === "error" && (
          <div className="rounded-lg border border-[var(--color-danger)] bg-danger-soft p-4 text-sm">
            <p className="font-medium text-[var(--color-danger)]">{t("errorTitle")}</p>
            <p className="mt-1 text-ink-soft">{t("error")}</p>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary btn-lg w-full"
          disabled={submitting || (mode === "booking" && datesBlocked)}
        >
          {submitting
            ? t("submitting")
            : mode === "booking"
              ? t("submitBooking")
              : t("submitVisit")}
        </button>

        <p className="text-center text-xs text-muted">
          <Link href="/legal/privacy" className="underline underline-offset-2 hover:text-accent">
            {footer("privacy")}
          </Link>
        </p>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}
        {required && <span className="text-[var(--color-danger)]"> *</span>}
      </label>
      <input id={name} name={name} type={type} required={required} className="field" />
    </div>
  );
}
