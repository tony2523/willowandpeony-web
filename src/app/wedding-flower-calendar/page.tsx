import type { Metadata } from "next";
import Pic from "@/components/Pic";
import Eyebrow from "@/components/Eyebrow";
import CalendarSignup from "@/components/CalendarSignup";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Free Wedding Flower Calendar — NZ Seasonal Blooms",
  description:
    "Download the free Willow & Peony Wedding Flower Calendar: a month-by-month guide to New Zealand's seasonal wedding flowers, so you know exactly what will be in bloom on your date.",
  path: "/wedding-flower-calendar/",
});

const perks = [
  "Month-by-month guide to New Zealand's seasonal blooms",
  "Know what will be at its best (and best value) on your date",
  "Palette and texture inspiration for every season",
  "A4 printable PDF — 17 beautiful pages",
];

export default function CalendarPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Wedding Flower Calendar", path: "/wedding-flower-calendar/" },
        ])}
      />
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <Eyebrow>Free download</Eyebrow>
            <h1 className="mt-3 font-serif text-4xl leading-[1.12] text-ink sm:text-5xl">
              The Wedding Flower Calendar
            </h1>
            <p className="mt-6 leading-relaxed text-ink-soft">
              Wondering what flowers will be in season on your wedding date? Our free calendar is
              a month-by-month guide to New Zealand&rsquo;s seasonal blooms — created by Ivy to
              help you plan florals that are beautiful, in-season and great value.
            </p>
            <ul className="mt-6 space-y-2.5 text-[0.95rem] text-ink-soft">
              {perks.map((p) => (
                <li key={p} className="flex gap-3">
                  <span aria-hidden className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-rose" />
                  {p}
                </li>
              ))}
            </ul>
            <CalendarSignup />
            <p className="mt-3 text-xs text-muted">
              We&rsquo;ll email you occasional seasonal inspiration too — unsubscribe any time.
            </p>
          </div>
          <div className="overflow-hidden">
            <Pic
              name="wedding-flowers-auckland-new-zealand-auckland-wedding-photographer-cbd-emma-443"
              alt="Bride holding a seasonal bouquet — Willow & Peony wedding flower calendar"
              sizes="(max-width: 768px) 100vw, 50vw"
              aspect="4/5"
              priority
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>
    </>
  );
}
