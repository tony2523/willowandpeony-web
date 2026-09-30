"use client";

import { useState } from "react";
import { site } from "../../content/site";

type Props = {
  kind?: "wedding" | "event" | "general";
};

/**
 * Enquiry form. Posts to site.formEndpoint (Formspree/Web3Forms-compatible)
 * when configured; otherwise opens a pre-filled email draft to the studio.
 */
export default function EnquiryForm({ kind = "general" }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const fields = Object.fromEntries(data.entries()) as Record<string, string>;

    if (!site.formEndpoint) {
      const subject = encodeURIComponent(
        kind === "general" ? "Enquiry — Willow & Peony" : `${kind === "wedding" ? "Wedding" : "Event"} enquiry — ${fields.name || ""}`,
      );
      const body = encodeURIComponent(
        Object.entries(fields)
          .filter(([k]) => k !== "_gotcha")
          .map(([k, v]) => `${k[0].toUpperCase() + k.slice(1)}: ${v}`)
          .join("\n"),
      );
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(site.formEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-hairline bg-ivory-deep p-8 text-center">
        <p className="font-serif text-2xl">Thank you — we&rsquo;ve received your enquiry.</p>
        <p className="mt-2 text-sm text-muted">
          We&rsquo;ll be in touch within 1–2 business days to chat next steps.
        </p>
      </div>
    );
  }

  const input =
    "w-full border border-hairline bg-white px-4 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-rose focus:outline-none";
  const label = "block text-[0.72rem] tracking-[0.16em] uppercase text-muted mb-1.5";

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div>
        <label htmlFor="f-name" className={label}>
          Name *
        </label>
        <input id="f-name" name="name" required autoComplete="name" className={input} />
      </div>
      <div>
        <label htmlFor="f-email" className={label}>
          Email *
        </label>
        <input id="f-email" name="email" type="email" required autoComplete="email" className={input} />
      </div>
      <div>
        <label htmlFor="f-phone" className={label}>
          Phone
        </label>
        <input id="f-phone" name="phone" type="tel" autoComplete="tel" className={input} />
      </div>
      {kind !== "general" ? (
        <>
          <div>
            <label htmlFor="f-date" className={label}>
              {kind === "wedding" ? "Wedding date" : "Event date"}
            </label>
            <input id="f-date" name="date" type="date" className={input} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="f-venue" className={label}>
              Venue (or venues you&rsquo;re considering)
            </label>
            <input id="f-venue" name="venue" className={input} />
          </div>
          <div>
            <label htmlFor="f-guests" className={label}>
              Approximate guest numbers
            </label>
            <input
              id="f-guests"
              name="guests"
              inputMode="numeric"
              className={input}
              placeholder="e.g. 80"
            />
          </div>
          <div>
            <label htmlFor="f-budget" className={label}>
              Floral budget
            </label>
            <select id="f-budget" name="budget" className={input} defaultValue="Not sure yet">
              <option>Under $1,000</option>
              <option>$1,000 – $2,500</option>
              <option>$2,500 – $5,000</option>
              <option>$5,000+</option>
              <option>Not sure yet</option>
            </select>
          </div>
        </>
      ) : (
        <div>
          <label htmlFor="f-subject" className={label}>
            What is it about?
          </label>
          <select id="f-subject" name="subject" className={input} defaultValue="General question">
            <option>Wedding flowers</option>
            <option>Event flowers</option>
            <option>Custom order</option>
            <option>General question</option>
          </select>
        </div>
      )}
      <div className="sm:col-span-2">
        <label htmlFor="f-message" className={label}>
          Tell us about your {kind === "general" ? "enquiry" : "day"} *
        </label>
        <textarea
          id="f-message"
          name="message"
          required
          rows={5}
          className={input}
          placeholder={
            kind === "wedding"
              ? "Your style, palette, must-have flowers, approximate guest numbers…"
              : kind === "event"
                ? "The occasion, the space, the atmosphere you want to create…"
                : "How can we help?"
          }
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="f-found" className={label}>
          How did you find us?
        </label>
        <select id="f-found" name="found_us" className={input} defaultValue="Google search">
          <option>Google search</option>
          <option>Instagram</option>
          <option>Referral from a friend or vendor</option>
          <option>Saw our flowers at a wedding or event</option>
          <option>Other</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full bg-ink px-8 py-3.5 text-[0.8rem] tracking-[0.16em] uppercase text-ivory transition-opacity hover:opacity-90 disabled:opacity-50 sm:w-auto"
        >
          {status === "sending" ? "Sending…" : "Send enquiry"}
        </button>
        <p className="mt-3 text-xs text-muted">We reply to every enquiry within 1–2 business days.</p>
        {status === "error" && (
          <p className="mt-3 text-sm text-rose-deep">
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
