"use client";

import { useState } from "react";
import { site } from "../../content/site";

/** Footer newsletter signup — subscribes to the studio's Klaviyo list. */
export default function NewsletterForm() {
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = (new FormData(e.currentTarget).get("email") as string) || "";
    try {
      await fetch(
        `https://a.klaviyo.com/client/subscriptions/?company_id=${site.klaviyoCompanyId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", revision: "2024-10-15" },
          body: JSON.stringify({
            data: {
              type: "subscription",
              attributes: {
                profile: {
                  data: {
                    type: "profile",
                    attributes: { email, properties: { source: "Website footer" } },
                  },
                },
              },
            },
          }),
        },
      );
    } catch {
      // ignore — confirmation still shown; Klaviyo occasionally rate-limits
    }
    setDone(true);
  }

  if (done) {
    return <p className="mt-4 text-sm text-ink-soft">Thank you for subscribing.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="mt-4">
      <label htmlFor="nl-email" className="sr-only">
        Your e-mail
      </label>
      <input
        id="nl-email"
        name="email"
        type="email"
        required
        placeholder="Your E-mail"
        autoComplete="email"
        className="w-full border border-hairline bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none"
      />
      <button
        type="submit"
        className="mt-2.5 w-full border border-ink px-4 py-2.5 text-[0.72rem] tracking-[0.1em] uppercase text-ink transition-colors hover:bg-ink hover:text-white"
      >
        Subscribe
      </button>
    </form>
  );
}
