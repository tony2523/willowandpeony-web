"use client";

import { useState } from "react";
import { site } from "../../content/site";

type Props = {
  kind?: "wedding" | "event" | "general";
  /** Compact = the original contact-page form: just e-mail + message + Send. */
  compact?: boolean;
};

/**
 * Enquiry form, styled to the original (15px Chivo inputs, 41px tall,
 * hairline borders, small letterspaced outlined Send button).
 *
 * Submits to the site's own Cloudflare Worker (POST /api/enquiry), which
 * emails the studio via Cloudflare Email Routing — free, no third parties.
 * If the API isn't available (GitHub Pages preview, or the zone isn't live
 * on Cloudflare yet) it falls back to opening a pre-filled email draft, so
 * no enquiry is ever lost.
 */
export default function EnquiryForm({ kind = "general", compact = false }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function mailtoFallback(fields: Record<string, string>) {
    const subject = encodeURIComponent(
      kind === "general"
        ? "Enquiry — Willow & Peony"
        : `${kind === "wedding" ? "Wedding" : "Event"} enquiry — ${fields.name || ""}`,
    );
    const body = encodeURIComponent(
      Object.entries(fields)
        .filter(([k]) => k !== "_gotcha")
        .map(([k, v]) => `${k[0].toUpperCase() + k.slice(1)}: ${v}`)
        .join("\n"),
    );
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fields = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, kind }),
      });
      if (res.ok) {
        setStatus("sent");
        form.reset();
        return;
      }
      if (res.status === 400) {
        // Validation/bot-check failure — surface it rather than emailing.
        setStatus("error");
        return;
      }
      throw new Error(String(res.status));
    } catch {
      // API missing (preview host) or email not configured yet → mail draft.
      setStatus("idle");
      mailtoFallback(fields);
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-hairline p-8 text-center">
        <p className="h-card text-ink">Thank you — we&rsquo;ve received your enquiry.</p>
        <p className="mt-2 text-[15px] text-ink-soft">
          We&rsquo;ll be in touch within 1–2 business days.
        </p>
      </div>
    );
  }

  const label = "label mb-1.5 block text-ink-soft";

  if (compact) {
    return (
      <form onSubmit={onSubmit} className="space-y-4">
        <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
        <div>
          <label htmlFor="c-email" className={label}>
            E-mail *
          </label>
          <input id="c-email" name="email" type="email" required autoComplete="email" placeholder="E-mail" className="input-wp" />
        </div>
        <div>
          <label htmlFor="c-message" className={label}>
            Message
          </label>
          <textarea id="c-message" name="message" required rows={4} placeholder="Message" className="input-wp" />
        </div>
        <button type="submit" disabled={status === "sending"} className="btn-wp disabled:opacity-50">
          {status === "sending" ? "Sending…" : "Send"}
        </button>
        {status === "error" && (
          <p className="text-[13px] text-ink-soft">
            Something went wrong — please email{" "}
            <a href={`mailto:${site.email}`} className="underline">
              {site.email}
            </a>
            .
          </p>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div>
        <label htmlFor="f-name" className={label}>
          Name *
        </label>
        <input id="f-name" name="name" required autoComplete="name" className="input-wp" />
      </div>
      <div>
        <label htmlFor="f-email" className={label}>
          E-mail *
        </label>
        <input id="f-email" name="email" type="email" required autoComplete="email" className="input-wp" />
      </div>
      <div>
        <label htmlFor="f-phone" className={label}>
          Phone
        </label>
        <input id="f-phone" name="phone" type="tel" autoComplete="tel" className="input-wp" />
      </div>
      <div>
        <label htmlFor="f-date" className={label}>
          {kind === "event" ? "Event date" : "Wedding date"}
        </label>
        <input id="f-date" name="date" type="date" className="input-wp" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="f-venue" className={label}>
          Venue (or venues you&rsquo;re considering)
        </label>
        <input id="f-venue" name="venue" className="input-wp" />
      </div>
      <div>
        <label htmlFor="f-guests" className={label}>
          Approximate guest numbers
        </label>
        <input id="f-guests" name="guests" inputMode="numeric" className="input-wp" placeholder="e.g. 80" />
      </div>
      <div>
        <label htmlFor="f-budget" className={label}>
          Floral budget
        </label>
        <select id="f-budget" name="budget" className="input-wp" defaultValue="Not sure yet">
          <option>Under $1,000</option>
          <option>$1,000 – $2,500</option>
          <option>$2,500 – $5,000</option>
          <option>$5,000+</option>
          <option>Not sure yet</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="f-message" className={label}>
          Message *
        </label>
        <textarea
          id="f-message"
          name="message"
          required
          rows={5}
          className="input-wp"
          placeholder={
            kind === "wedding"
              ? "Your style, palette, must-have flowers…"
              : "The occasion, the space, the atmosphere you want to create…"
          }
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="f-found" className={label}>
          How did you find us?
        </label>
        <select id="f-found" name="found_us" className="input-wp" defaultValue="Google search">
          <option>Google search</option>
          <option>Instagram</option>
          <option>Referral from a friend or vendor</option>
          <option>Saw our flowers at a wedding or event</option>
          <option>Other</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <button type="submit" disabled={status === "sending"} className="btn-wp disabled:opacity-50">
          {status === "sending" ? "Sending…" : "Send"}
        </button>
        <p className="mt-3 text-[12.6px] text-ink-soft">
          We reply to every enquiry within 1–2 business days.
        </p>
        {status === "error" && (
          <p className="mt-3 text-[13px] text-ink-soft">
            Something went wrong — please email us directly at{" "}
            <a href={`mailto:${site.email}`} className="underline">
              {site.email}
            </a>
            .
          </p>
        )}
      </div>
    </form>
  );
}
