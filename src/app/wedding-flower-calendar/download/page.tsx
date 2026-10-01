import type { Metadata } from "next";
import Link from "next/link";
import Pic from "@/components/Pic";
import CalendarSentNote from "@/components/CalendarSentNote";
import { pageMetadata } from "@/lib/seo";
import { withBase } from "@/lib/images";
import { site } from "../../../../content/site";

export const metadata: Metadata = pageMetadata({
  title: "Your Wedding Flower Calendar is Ready",
  description: "Download your free Willow & Peony Wedding Flower Calendar.",
  path: "/wedding-flower-calendar/download/",
  noindex: true,
});

const next = [
  {
    title: "Find your month",
    body: "Open your wedding month and note the flowers that catch your eye.",
    link: { label: "Spring wedding flowers guide", href: "/journal/spring-wedding-flowers-new-zealand/" },
  },
  {
    title: "Set your budget",
    body: "Seasonal flowers go further. Here is where the money really goes.",
    link: { label: "Wedding flower budget guide", href: "/journal/wedding-flower-budget-nz-guide/" },
  },
  {
    title: "Talk to Ivy",
    body: "Bring your favourites to a relaxed, obligation-free conversation.",
    link: { label: "Start an enquiry", href: "/contact/" },
  },
];

export default function CalendarDownloadPage() {
  return (
    <>
      <section className="mx-auto max-w-[1280px] px-5 pt-14 sm:px-6 md:pt-20">
        <div className="grid items-center gap-12 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-20">
          <div>
            <p className="eyebrow text-muted">Thank you</p>
            <h1 className="display-1 mt-4 text-ink">
              Your calendar is <em>ready</em>
            </h1>
            <p className="mt-5 max-w-[480px] text-[15px] leading-[1.7] font-light text-ink-soft">
              Thank you for inviting Willow &amp; Peony into your wedding planning. Your seasonal
              flower inspiration starts here.
            </p>
            <CalendarSentNote />
            <div className="mt-9">
              <a
                href={withBase("/downloads/willow-and-peony-wedding-flower-calendar.pdf")}
                target="_blank"
                rel="noopener"
                className="btn-solid"
              >
                Download your calendar
              </a>
              <p className="mt-3.5 text-[12px] text-muted">
                A4 portrait PDF · 17 pages · 4.5 MB · opens in a new tab, ready to save to your
                phone or computer
              </p>
            </div>
          </div>
          <div className="bg-paper px-10 py-12 sm:px-16 sm:py-16">
            <Pic
              name="wedding-flower-calendar-cover"
              alt="Cover of the Willow & Peony Wedding Flower Calendar"
              sizes="(max-width: 768px) 75vw, 420px"
              priority
              className="mx-auto h-auto w-[78%] max-w-[420px] shadow-[0_24px_60px_rgba(26,24,21,0.16)]"
            />
          </div>
        </div>
      </section>

      {/* What next */}
      <section className="mx-auto mt-24 max-w-[1280px] px-5 sm:px-6 md:mt-[140px]">
        <p className="eyebrow text-muted">What next</p>
        <h2 className="display-2 mt-3 text-ink">
          A little inspiration <em>for your day</em>
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {next.map((n, i) => (
            <div key={n.title} className="border border-hairline p-7">
              <span className="font-serif text-[30px] leading-none font-light text-hairline" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-serif text-[21px] font-light text-ink">{n.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{n.body}</p>
              <Link href={n.link.href} className="t-link mt-6 inline-block text-ink">
                {n.link.label}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Sign-off */}
      <section className="mt-24 border-t border-hairline bg-paper md:mt-[140px]">
        <div className="mx-auto max-w-[680px] px-5 py-16 text-center sm:px-6 md:py-20">
          <p className="text-[14px] leading-[1.75] text-ink-soft">
            Explore your wedding month, save your favourite flowers, and bring your ideas along
            when we chat. Tell us your wedding date, venue and the feeling you would love to
            create at{" "}
            <a href={`mailto:${site.email}`} className="underline underline-offset-2 hover:text-ink">
              {site.email}
            </a>
            .
          </p>
          <p className="mt-6 font-serif text-[22px] font-light text-ink italic">With love, Ivy</p>
        </div>
      </section>
    </>
  );
}
