"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { IconCheck } from "@/components/icons";
import { track } from "@/lib/track";

const OWNER_EMAIL = "henriquesantana@loftz.net";

// Reusable contact form (About, FAQ, landlord CTA). Posts to /api/contact.
export function ContactForm({ topic }: { topic?: string }) {
  const t = useTranslations("contact");
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          message: fd.get("message"),
          company_website: fd.get("company_website"), // honeypot
          topic,
        }),
      });
      if (res.ok) track("contact_message", { topic });
      setState(res.ok ? "ok" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "ok") {
    return (
      <div className="card p-6 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-xl text-accent">
          <IconCheck />
        </div>
        <h3 className="mt-3 text-lg">{t("successTitle")}</h3>
        <p className="prose-muted mt-1 text-sm">{t("success")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-5 sm:p-6">
      {/* Honeypot: hidden from humans, tempting to bots. */}
      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="c-name">{t("name")}</label>
          <input id="c-name" name="name" required className="field" />
        </div>
        <div>
          <label className="label" htmlFor="c-email">{t("email")}</label>
          <input id="c-email" name="email" type="email" required className="field" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="c-msg">{t("message")}</label>
        <textarea
          id="c-msg"
          name="message"
          rows={4}
          required
          className="field"
          placeholder={t("messagePlaceholder")}
        />
      </div>
      {state === "error" && (
        <p className="text-sm text-[var(--color-danger)]">{t("error")}</p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="submit" className="btn btn-primary" disabled={state === "sending"}>
          {state === "sending" ? t("sending") : t("send")}
        </button>
        <p className="text-sm text-muted">
          {t("orEmail")}{" "}
          <a href={`mailto:${OWNER_EMAIL}`} className="text-accent hover:underline">
            {OWNER_EMAIL}
          </a>
        </p>
      </div>
    </form>
  );
}
