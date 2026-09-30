"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { site } from "../../content/site";

/**
 * Wedding Flower Calendar signup. Subscribes the email to the studio's
 * Klaviyo list (client-side, no tracking script), then sends the visitor to
 * the download page. If Klaviyo is unreachable the visitor still gets the
 * calendar — the email is only used for the list.
 */
export default function CalendarSignup() {
  const router = useRouter();
  const [sending, setSending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (new FormData(form).get("email") as string) || "";
    setSending(true);
    try {
      // Klaviyo "client subscription" endpoint — no API key needed, safe in browser.
      await fetch(
        `https://a.klaviyo.com/client/subscriptions/?company_id=${site.klaviyoCompanyId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            revision: "2024-10-15",
          },
          body: JSON.stringify({
            data: {
              type: "subscription",
              attributes: {
                profile: {
                  data: {
                    type: "profile",
                    attributes: { email, properties: { source: "Wedding Flower Calendar" } },
                  },
                },
              },
            },
          }),
        },
      );
    } catch {
      // Non-blocking — the calendar download proceeds regardless.
    }
    router.push("/wedding-flower-calendar/download/");
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
      <label htmlFor="cal-email" className="sr-only">
        Email address
      </label>
      <input
        id="cal-email"
        name="email"
        type="email"
        required
        placeholder="Your email address"
        autoComplete="email"
        className="w-full flex-1 border border-hairline bg-white px-4 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-rose focus:outline-none"
      />
      <button
        type="submit"
        disabled={sending}
        className="bg-ink px-7 py-3 text-[0.78rem] tracking-[0.16em] uppercase text-ivory transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {sending ? "One moment…" : "Get the calendar"}
      </button>
    </form>
  );
}
