import type { Metadata } from "next";
import Link from "next/link";
import Pic from "@/components/Pic";
import CalendarSignup from "@/components/CalendarSignup";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { site } from "../../../content/site";

export const metadata: Metadata = pageMetadata({
  title: "Free NZ Wedding Flower Calendar",
  description:
    "Download our free Wedding Flower Calendar: a month-by-month guide to New Zealand's seasonal wedding flowers, so you know what will bloom on your date.",
  path: "/wedding-flower-calendar/",
  ogImage: "wedding-flower-calendar-cover",
});

const inside = [
  {
    image: "wedding-flower-calendar-intro-page",
    title: "Start with your month",
    body: "A short guide to using the calendar, plus Ivy's notes on seasonality and availability in New Zealand.",
  },
  {
    image: "wedding-flower-calendar-october-page",
    title: "Twelve flowers, every month",
    body: "Each month shows twelve flowers at their best in that season, from January roses to December peonies.",
  },
  {
    image: "wedding-flower-calendar-ivys-favourites-page",
    title: "Ivy's favourites",
    body: "The year-round staples and the blooms Ivy loves most, with exactly when to find them.",
  },
];

const perks = [
  { title: "Month by month", body: "New Zealand's seasonal wedding flowers, laid out for all twelve months." },
  { title: "Best value", body: "Know what will be fresh, plentiful and great value on your date." },
  { title: "Palette ideas", body: "Colour and texture inspiration to bring to your florist." },
  { title: "Print or phone", body: "An A4 PDF of 17 pages, made to print or save to your phone." },
];

export default function CalendarPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Wedding Flower Calendar", path: "/wedding-flower-calendar/" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "DigitalDocument",
            name: "Willow & Peony Wedding Flower Calendar",
            description:
              "A free month-by-month guide to New Zealand's seasonal wedding flowers, by florist Ivy Diao.",
            author: { "@type": "Person", name: site.founder },
            publisher: { "@id": `${site.domain}/#florist` },
            encodingFormat: "application/pdf",
            numberOfPages: 17,
            isAccessibleForFree: true,
            url: `${site.domain}/wedding-flower-calendar/`,
          },
        ]}
      />

      {/* Hero: copy + form beside the calendar cover */}
      <section id="get-calendar" className="mx-auto max-w-[1280px] scroll-mt-24 px-5 pt-14 sm:px-6 md:pt-20">
        <div className="grid items-center gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-20">
          <div>
            <p className="eyebrow text-muted">Free download · 17 pages</p>
            <h1 className="display-1 mt-4 text-ink">
              The Wedding Flower <em>Calendar</em>
            </h1>
            <p className="mt-5 max-w-[500px] text-[15px] leading-[1.7] font-light text-ink-soft">
              Wondering what will be in bloom on your wedding date? Ivy&rsquo;s free calendar is a
              month-by-month guide to New Zealand&rsquo;s seasonal flowers. Enter your name and
              email, and we&rsquo;ll send it straight to your inbox.
            </p>
            <div className="mt-9 max-w-[520px]">
              <CalendarSignup />
            </div>
          </div>

          <div className="relative bg-paper px-10 py-12 sm:px-16 sm:py-16">
            <Pic
              name="wedding-flower-calendar-intro-page"
              alt=""
              sizes="(max-width: 768px) 60vw, 300px"
              className="absolute top-10 right-6 hidden h-auto w-[46%] rotate-[4deg] shadow-[0_18px_40px_rgba(26,24,21,0.12)] sm:block"
            />
            <Pic
              name="wedding-flower-calendar-cover"
              alt="Cover of the Willow & Peony Wedding Flower Calendar"
              sizes="(max-width: 768px) 75vw, 420px"
              priority
              className="relative mx-auto h-auto w-[78%] max-w-[420px] shadow-[0_24px_60px_rgba(26,24,21,0.16)] sm:mx-0"
            />
          </div>
        </div>
      </section>

      {/* Inside the calendar */}
      <section className="mx-auto mt-24 max-w-[1280px] px-5 sm:px-6 md:mt-[140px]">
        <p className="eyebrow text-muted">Inside the calendar</p>
        <h2 className="display-2 mt-3 text-ink">
          A year of flowers, <em>month by month</em>
        </h2>
        <div className="-mx-5 mt-12 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:overflow-visible sm:px-0">
          {inside.map((item) => (
            <div key={item.title} className="w-[78%] shrink-0 snap-start sm:w-auto">
              <div className="bg-paper px-8 py-10">
                <Pic
                  name={item.image}
                  alt={`${item.title}, a page from the Wedding Flower Calendar`}
                  sizes="(max-width: 640px) 80vw, 30vw"
                  className="mx-auto h-auto w-full max-w-[300px] shadow-[0_14px_34px_rgba(26,24,21,0.12)]"
                />
              </div>
              <h3 className="mt-5 font-serif text-[21px] font-light text-ink">{item.title}</h3>
              <p className="mt-2 max-w-[360px] text-[13.5px] leading-relaxed text-ink-soft">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Why it helps */}
      <section className="mt-24 border-t border-hairline bg-paper md:mt-[140px]">
        <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-6 md:py-24">
          <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((p) => (
              <div key={p.title}>
                <h3 className="font-serif text-[21px] font-light text-ink">{p.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{p.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 flex flex-col items-start gap-6 border-t border-hairline pt-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-[560px] text-[14px] leading-[1.7] text-ink-soft">
              Planning a spring wedding? Read Ivy&rsquo;s{" "}
              <Link
                href="/journal/spring-wedding-flowers-new-zealand/"
                className="underline underline-offset-2 hover:text-ink"
              >
                guide to spring wedding flowers in New Zealand
              </Link>
              .
            </p>
            <a href="#get-calendar" className="btn-solid shrink-0">
              Get the calendar
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
