"use client";

import { useState } from "react";
import { site } from "../../content/site";
import DateInput from "./DateInput";

type Kind = "wedding" | "event" | "general";

type Props = {
  kind?: Kind;
  /** Show the Wedding / Event / Something else selector (contact page). */
  selector?: boolean;
  /** Compact = short form: name, email, message. */
  compact?: boolean;
};

/** The floral requirements Ivy collects on the live wedding form. */
const REQUIREMENTS = [
  "Bridal bouquet",
  "Bridesmaids bouquets",
  "Buttonholes",
  "Corsages",
  "Arch or arbor installation",
  "Plinths flowers",
  "Aisle flowers",
  "Grounded floral meadow",
  "Welcome sign flowers",
  "Bud vase flowers",
  "Table centrepieces",
  "Head table flowers",
  "Bar arrangement",
  "Cake flowers",
  "Others",
] as const;

const BUDGETS = [
  "Personal flowers only",
  "$2,500 – $4,000",
  "$4,000 – $6,000",
  "$6,000 – $8,000",
  "$8,000+",
  "Not sure yet",
] as const;

const EVENT_TYPES = [
  "Corporate event",
  "Gala dinner",
  "Conference",
  "Product launch",
  "Private celebration",
  "Styled shoot",
  "Other",
] as const;

const FOUND_US = [
  "Google search",
  "Instagram",
  "Facebook",
  "Referral from a friend",
  "Venue or planner recommendation",
  "Attended an event we flowered",
  "Other",
] as const;

function Field({
  label,
  children,
  className = "",
  required = false,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  /** Shows an asterisk; the input itself carries `required`. */
  required?: boolean;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[0.75rem] tracking-[0.06em] text-muted uppercase">
        {label}
        {required && <span aria-hidden className="text-ink"> *</span>}
      </span>
      {children}
    </label>
  );
}

/**
 * Enquiry form matching the live site's Shopify forms field-for-field.
 * Submits to the site's Cloudflare Worker (POST /api/enquiry) which emails
 * the studio via Cloudflare Email Routing; if the API isn't available it
 * falls back to a pre-filled email draft so no enquiry is ever lost.
 */
export default function EnquiryForm({ kind = "general", selector = false, compact = false }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [mode, setMode] = useState<Kind>(kind);

  function mailtoFallback(fields: Record<string, string>) {
    const subject = encodeURIComponent(
      mode === "general"
        ? "Enquiry — Willow & Peony"
        : `${mode === "wedding" ? "Wedding" : "Event"} enquiry — ${fields.name || ""}`,
    );
    const body = encodeURIComponent(
      Object.entries(fields)
        .filter(([k]) => k !== "_gotcha")
        .map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`)
        .join("\n"),
    );
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const fields = Object.fromEntries(data.entries()) as Record<string, string>;
    const requirements = data.getAll("requirements").map(String);
    delete fields.requirements;
    if (requirements.length) fields.requirements = requirements.join(", ");

    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          ...(requirements.length ? { requirements } : {}),
          kind: mode,
          page: window.location.pathname,
        }),
      });
      if (res.ok) {
        setStatus("sent");
        form.reset();
        return;
      }
      if (res.status === 400) {
        setStatus("error");
        return;
      }
      throw new Error(String(res.status));
    } catch {
      setStatus("idle");
      mailtoFallback(fields);
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-hairline bg-white p-10 text-center">
        <p className="h-card text-ink">Thank you — we&rsquo;ve received your enquiry.</p>
        <p className="mt-2 text-[0.875rem] text-ink-soft">
          We&rsquo;ll be in touch within 1–2 business days.
        </p>
        {mode === "wedding" && (
          <a href={site.consultationUrl} target="_blank" rel="noopener" className="btn-outline mt-6">
            Book your free 30-minute consultation
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      {/* Honeypot */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      {selector && (
        <div className="mb-7">
          <p className="eyebrow text-muted">I&rsquo;m enquiring about</p>
          <div className="mt-3 flex flex-wrap gap-2.5" role="group" aria-label="Enquiry type">
            {(
              [
                ["wedding", "Wedding"],
                ["event", "Event"],
                ["general", "Something else"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                aria-pressed={mode === value}
                className={`px-4 py-2.5 text-[0.6875rem] tracking-[0.14em] uppercase transition-colors ${
                  mode === value
                    ? "bg-ink text-white"
                    : "border border-hairline text-ink-soft hover:border-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {compact || mode === "general" ? (
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Your name" required>
              <input name="name" required autoComplete="name" className="input-wp" />
            </Field>
            <Field label="Email" required>
              <input type="email" name="email" required autoComplete="email" className="input-wp" />
            </Field>
          </div>
          <Field label="Phone" required>
            <input type="tel" name="phone" required autoComplete="tel" className="input-wp" />
          </Field>
          <Field label="Your message" required>
            <textarea name="message" required rows={5} className="input-wp" />
          </Field>
        </div>
      ) : mode === "wedding" ? (
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Your name" required>
              <input name="name" required autoComplete="name" className="input-wp" />
            </Field>
            <Field label="Email" required>
              <input type="email" name="email" required autoComplete="email" className="input-wp" />
            </Field>
            <Field label="Phone" required>
              <input type="tel" name="phone" required autoComplete="tel" className="input-wp" />
            </Field>
            <Field label="Wedding date" required>
              <DateInput name="date" required className="input-wp" />
            </Field>
            <Field label="Venue (or shortlist)" required>
              <input name="venue" required className="input-wp" />
            </Field>
            <Field label="Budget" required>
              <select name="budget" required defaultValue="" className="input-wp">
                <option value="" disabled>
                  Select a range
                </option>
                {BUDGETS.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </Field>
          </div>

          <fieldset className="mt-3">
            <legend className="eyebrow text-muted">
              Floral requirements — tick all that apply
            </legend>
            <div className="mt-4 grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {REQUIREMENTS.map((r) => (
                <label
                  key={r}
                  className="flex cursor-pointer items-center gap-2.5 text-[0.8125rem] text-ink-soft"
                >
                  <input type="checkbox" name="requirements" value={r} className="check-wp" />
                  {r}
                </label>
              ))}
            </div>
          </fieldset>

          <Field label="Additional comments" className="mt-3">
            <textarea
              name="message"
              rows={4}
              placeholder="Your style, palette, must-have flowers…"
              className="input-wp"
            />
          </Field>
          <Field label="Pinterest board or inspiration link">
            <input name="inspo" type="url" inputMode="url" placeholder="https://" className="input-wp" />
          </Field>
          <Field label="How did you hear about us?">
            <select name="found_us" defaultValue="" className="input-wp">
              <option value="" disabled>
                Select one
              </option>
              {FOUND_US.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </Field>
        </div>
      ) : (
        <div className="grid gap-4">
          <p role="note" className="border border-hairline bg-white px-4 py-3 text-[0.8125rem] leading-relaxed text-ink-soft">
            Event floral styling is currently available across Auckland only.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Key contact name" required>
              <input name="name" required autoComplete="name" className="input-wp" />
            </Field>
            <Field label="Company (if applicable)">
              <input name="company" autoComplete="organization" className="input-wp" />
            </Field>
            <Field label="Email" required>
              <input type="email" name="email" required autoComplete="email" className="input-wp" />
            </Field>
            <Field label="Phone" required>
              <input type="tel" name="phone" required autoComplete="tel" className="input-wp" />
            </Field>
            <Field label="Event date" required>
              <DateInput name="date" required className="input-wp" />
            </Field>
            <Field label="Event type">
              <select name="event_type" defaultValue="" className="input-wp">
                <option value="" disabled>
                  Select one
                </option>
                {EVENT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Event venue" required>
              <input name="venue" required className="input-wp" />
            </Field>
            <Field label="Budget" required>
              <input name="budget" required className="input-wp" />
            </Field>
          </div>
          <Field label="Your message" required>
            <textarea
              name="message"
              required
              rows={4}
              placeholder="The occasion, the space, the atmosphere you want to create…"
              className="input-wp"
            />
          </Field>
          <Field label="Pinterest board or inspiration link">
            <input name="inspo" type="url" inputMode="url" placeholder="https://" className="input-wp" />
          </Field>
        </div>
      )}

      {status === "error" && (
        <p className="mt-4 text-[0.8125rem] text-ink" role="alert">
          Something wasn&rsquo;t right — please check your email address and message, then try
          again.
        </p>
      )}

      <div className="mt-7">
        <button type="submit" disabled={status === "sending"} className="btn-solid disabled:opacity-60">
          {status === "sending" ? "Sending…" : "Send enquiry"}
        </button>
        <p className="mt-3.5 text-[0.75rem] text-muted">* Required. We reply within 1–2 business days.</p>
      </div>
    </form>
  );
}
