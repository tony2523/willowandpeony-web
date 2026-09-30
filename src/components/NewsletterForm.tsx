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
        className="input-wp"
      />
      <button type="submit" className="btn-wp mt-2.5 w-full">
        Subscribe
      </button>
    </form>
  );
}
