import type { Metadata } from "next";
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
      {/* Full-width page template, as on the original (21.6px left title) */}
      <section className="px-5 pt-12 sm:px-6">
        <h1 className="h-card text-ink">Wedding Flower Calendar</h1>
        <div className="mt-6 max-w-[608px]">
          <p className="text-[15px] leading-[1.4] text-ink">
            Wondering what flowers will be in season on your wedding date? Our free calendar is a
            month-by-month guide to New Zealand&rsquo;s seasonal blooms — created by Ivy to help
            you plan florals that are beautiful, in-season and great value.
          </p>
          <ul className="mt-4 list-disc space-y-1.5 pl-5 text-[15px] leading-[1.4] text-ink">
            {perks.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <div className="mt-8 max-w-[440px]">
            <CalendarSignup />
            <p className="mt-3 text-[12.6px] text-ink-soft">
              We&rsquo;ll email you occasional seasonal inspiration too — unsubscribe any time.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
