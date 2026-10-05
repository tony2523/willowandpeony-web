"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * Wedding Flower Calendar signup (same fields as the original Shopify form).
 * Posts to the Worker (/api/calendar), which emails the PDF to the visitor,
 * then sends them to the download page. The visitor always reaches the
 * download page, even if email isn't configured or the request fails.
 */
export default function CalendarSignup() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setStatus("sending");
    let emailed = false;
    try {
      const res = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: fd.get("firstName"),
          lastName: fd.get("lastName"),
          email: fd.get("email"),
          consult: fd.get("consult") === "on",
          _gotcha: fd.get("_gotcha"),
        }),
      });
      if (res.status === 400) {
        setStatus("error");
        return;
      }
      if (res.ok) emailed = !!(await res.json()).emailed;
    } catch {
      // Network or preview-host failure: still hand over the calendar.
    }
    router.push(`/wedding-flower-calendar/download/${emailed ? "?sent=1" : ""}`);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[0.75rem] tracking-[0.06em] text-muted uppercase">
                      <span className="mb-1.5 block text-[0.75rem] tracking-[0.06em] text-muted uppercase">
            First name<span aria-hidden className="text-ink"> *</span>
          </span>          </span>
          <input name="firstName" required autoComplete="given-name" className="input-wp" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[0.75rem] tracking-[0.06em] text-muted uppercase">
            Last name
          </span>
          <input name="lastName" autoComplete="family-name" className="input-wp" />
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-[0.75rem] tracking-[0.06em] text-muted uppercase">
                  <span className="mb-1.5 block text-[0.75rem] tracking-[0.06em] text-muted uppercase">
          Email<span aria-hidden className="text-ink"> *</span>
        </span>        </span>
        <input name="email" type="email" required autoComplete="email" className="input-wp" />
      </label>
      <label className="flex cursor-pointer items-start gap-3 text-[0.8125rem] leading-relaxed text-ink-soft">
        <input type="checkbox" name="consult" className="check-wp mt-[0.1875rem]" />
        <span>
          Willow &amp; Peony offers an obligation-free wedding flower consultation via Google Meet.
          Tick this box if you&rsquo;d like Ivy to email you to arrange yours.
        </span>
      </label>

      {status === "error" && (
        <p className="text-[0.8125rem] text-ink" role="alert">
          Please check your email address and try again.
        </p>
      )}

      <div className="mt-1">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-solid w-full disabled:opacity-60 sm:w-auto"
        >
          {status === "sending" ? "One moment…" : "Get my free calendar"}
        </button>
      </div>
      <p className="text-[0.75rem] leading-relaxed text-muted">
        * Required. Your calendar is free whether or not you request a consultation. We&rsquo;ll email you the
        download link and won&rsquo;t add you to any mailing list.{" "}
        <Link href="/privacy-policy/" className="underline underline-offset-2 hover:text-ink">
          Privacy policy
        </Link>
      </p>
    </form>
  );
}
