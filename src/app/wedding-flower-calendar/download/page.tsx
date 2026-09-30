import type { Metadata } from "next";
import Eyebrow from "@/components/Eyebrow";
import { pageMetadata } from "@/lib/seo";
import { withBase } from "@/lib/images";
import { site } from "../../../../content/site";

export const metadata: Metadata = pageMetadata({
  title: "Your Wedding Flower Calendar is Ready",
  description: "Download your free Willow & Peony Wedding Flower Calendar.",
  path: "/wedding-flower-calendar/download/",
  noindex: true,
});

export default function CalendarDownloadPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 pt-20 text-center sm:px-6">
      <Eyebrow>Thank you</Eyebrow>
      <h1 className="mt-3 font-serif text-4xl leading-[1.12] text-ink sm:text-5xl">
        Your Wedding Flower Calendar is ready
      </h1>
      <p className="mx-auto mt-6 max-w-lg leading-relaxed text-ink-soft">
        Thank you for inviting Willow &amp; Peony into your wedding planning. Your seasonal flower
        inspiration starts here.
      </p>
      <a
        href={withBase("/downloads/willow-and-peony-wedding-flower-calendar.pdf")}
        target="_blank"
        rel="noopener"
        className="mt-8 inline-block bg-ink px-8 py-3.5 text-[0.8rem] tracking-[0.16em] uppercase text-ivory transition-opacity hover:opacity-90"
      >
        Download your free calendar
      </a>
      <p className="mt-3 text-xs text-muted">
        A4 portrait PDF · 17 pages · 8.9&nbsp;MB · opens in a new tab — save a copy to your phone
        or computer.
      </p>
      <div className="mt-14 border-t border-hairline pt-10">
        <h2 className="font-serif text-2xl text-ink">A little inspiration for your day</h2>
        <p className="mx-auto mt-4 max-w-lg leading-relaxed text-ink-soft">
          Explore your wedding month, save your favourite flowers, and bring your ideas along when
          we chat. Tell us your wedding date, venue and the feeling you would love to create at{" "}
          <a href={`mailto:${site.email}`} className="text-rose-deep underline underline-offset-2">
            {site.email}
          </a>
          .
        </p>
        <p className="mt-6 font-serif text-lg italic text-ink-soft">With love, Ivy</p>
      </div>
    </section>
  );
}
