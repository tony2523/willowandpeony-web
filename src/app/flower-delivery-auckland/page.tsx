import Link from "next/link";
import type { Metadata } from "next";
import Eyebrow from "@/components/Eyebrow";
import JsonLd from "@/components/JsonLd";
import CtaBand from "@/components/CtaBand";
import { pageMetadata, breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo";
import { delivery, site } from "../../../content/site";

export const metadata: Metadata = pageMetadata({
  title: "Flower Delivery Auckland — Same-Day & Next-Day",
  description:
    "Same-day flower delivery across Auckland, Monday to Saturday, for orders before 12pm. $15 flat rate, free over $150. Custom arrangements delivered from Hatfields Beach to Tuakau.",
  path: "/flower-delivery-auckland/",
});

export default function DeliveryPage() {
  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd({
            name: "Flower Delivery Auckland",
            description:
              "Same-day and next-day delivery of custom floral arrangements across Auckland, Monday to Saturday.",
            path: "/flower-delivery-auckland/",
            serviceType: "Flower delivery",
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Flower Delivery Auckland", path: "/flower-delivery-auckland/" },
          ]),
        ]}
      />
      <section className="mx-auto max-w-3xl px-4 pt-16 sm:px-6">
        <div className="text-center">
          <Eyebrow>Delivery</Eyebrow>
          <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">
            Flower delivery in Auckland
          </h1>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-ink-soft">{delivery.summary}</p>
        </div>

        <div className="mt-12 border border-hairline bg-white p-8">
          <h2 className="font-serif text-xl text-ink">Delivery essentials</h2>
          <ul className="mt-5 space-y-3 text-[0.95rem] leading-relaxed text-ink-soft">
            {delivery.points.map((p) => (
              <li key={p} className="flex gap-3">
                <span aria-hidden className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-rose" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 border border-hairline bg-white p-8">
          <h2 className="font-serif text-xl text-ink">Where we deliver</h2>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
            We lovingly deliver across the wider Auckland region. Our delivery boundaries are:
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {delivery.boundaries.map((b) => (
              <div key={b.compass} className="border-l-2 border-rose pl-3">
                <dt className="text-[0.72rem] tracking-[0.18em] uppercase text-muted">
                  {b.compass}
                </dt>
                <dd className="mt-1 text-sm text-ink">{b.to}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm leading-relaxed text-muted">
            Sending flowers to an outer or rural part of Auckland and not sure if it&rsquo;s
            within our area? Email{" "}
            <a href={`mailto:${site.email}`} className="text-rose-deep underline underline-offset-2">
              {site.email}
            </a>{" "}
            or call{" "}
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="text-rose-deep underline underline-offset-2"
            >
              {site.phoneDisplay}
            </a>{" "}
            between 9am and 5pm — we&rsquo;ll do our best to help.
          </p>
        </div>

        <div className="mt-8 bg-ivory-deep p-8 text-center">
          <h2 className="font-serif text-xl text-ink">Ordering custom flowers</h2>
          <p className="mx-auto mt-3 max-w-md text-[0.95rem] leading-relaxed text-ink-soft">
            We create custom arrangements for any occasion — birthdays, anniversaries, sympathy,
            thank-yous and more. Tell us the occasion, your budget and palette, and we&rsquo;ll
            design something beautiful.
          </p>
          <Link
            href="/contact/"
            className="mt-6 inline-block border border-ink px-7 py-2.5 text-[0.78rem] tracking-[0.16em] uppercase text-ink transition-colors hover:bg-ink hover:text-ivory"
          >
            Order custom flowers
          </Link>
        </div>
      </section>

      <CtaBand
        title="Flowers for a wedding or event?"
        body="Delivery, setup and pack-out are included in our Classic and Luxe wedding packages."
        buttonLabel="Wedding packages"
        buttonHref="/wedding-flower-packages/"
        secondaryLabel="Event flowers"
        secondaryHref="/event-flowers-auckland/"
      />
    </>
  );
}
