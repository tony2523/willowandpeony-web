import Link from "next/link";
import type { Metadata } from "next";
import Pic from "@/components/Pic";
import Hero from "@/components/Hero";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, serviceJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { weddingPackages, faqs } from "../../../content/site";

export const metadata: Metadata = pageMetadata({
  title: "Wedding Flower Packages & Pricing Auckland",
  description:
    "Curated wedding flower packages from a boutique Auckland florist: Petite $500, Classic $2,500 and Luxe $5,000. Bouquets, ceremony and reception styling — transparent pricing, stress-free planning.",
  path: "/wedding-flower-packages/",
  ogImage: "blush-and-white-ceremony-plinth-arrangements-at-rydges-formosa-aucklan",
});

/** Pricing questions surfaced on this page (full list on /faq/). */
const pricingFaqs = faqs.filter((f) =>
  [
    "How much do wedding flowers cost in Auckland?",
    "Is delivery, setup and pack-down included?",
    "Can I choose the colours of my flowers?",
    "How far in advance should I book my wedding flowers?",
  ].includes(f.q),
);

export default function PackagesPage() {
  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd({
            name: "Wedding Flower Packages",
            description:
              "Curated wedding floral packages for Auckland weddings — three tiers covering bouquets, buttonholes, ceremony and reception styling.",
            path: "/wedding-flower-packages/",
            serviceType: "Wedding florist",
            offers: weddingPackages.map((p) => ({
              name: `${p.name} Package`,
              price: p.priceNumber,
              description: p.ideal,
            })),
          }),
          faqJsonLd(pricingFaqs),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Wedding Flowers Auckland", path: "/wedding-flowers-auckland/" },
            { name: "Wedding Packages", path: "/wedding-flower-packages/" },
          ]),
        ]}
      />

      <Hero
        image="blush-and-white-ceremony-plinth-arrangements-at-rydges-formosa-aucklan"
        alt="Blush and white ceremony plinth arrangements framing a couple's vows at Rydges Formosa, Auckland"
        eyebrow="Wedding packages"
        title={
          <>
            Beautiful flowers, <em>honest pricing</em>
          </>
        }
        intro="Three curated tiers and a bespoke service — so you know exactly where you stand before we ever get on a call."
        cta={{ label: "Check availability", href: "/contact/" }}
      />

      {/* Intro */}
      <section className="mx-auto mt-20 grid max-w-[1280px] gap-10 px-5 sm:px-6 md:mt-28 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-20">
        <h2 className="display-2 text-ink">
          Planning your wedding should feel <em>joyful, not overwhelming.</em>
        </h2>
        <p className="max-w-[440px] self-center text-[14px] leading-[1.75] text-ink-soft">
          Our curated wedding floral packages make it effortless to achieve a cohesive, romantic
          look across your entire day. From your bouquet to ceremony features and reception
          styling, each package delivers premium, artful florals that feel seamless, elegant and
          unforgettable.
        </p>
      </section>

      {/* Package tiers */}
      <section className="mx-auto mt-24 max-w-[1280px] px-5 sm:px-6 md:mt-[140px]">
        <div className="grid gap-6 md:grid-cols-3">
          {weddingPackages.map((pkg) => (
            <div
              key={pkg.name}
              className={`flex flex-col border p-7 sm:p-8 ${
                pkg.name === "Classic" ? "border-ink" : "border-hairline"
              }`}
            >
              {pkg.name === "Classic" ? (
                <p className="mb-4 self-start bg-ink px-2.5 py-1.5 text-[10px] tracking-[0.16em] text-white uppercase">
                  Most chosen
                </p>
              ) : (
                <p className="mb-4 h-[26px]" aria-hidden />
              )}
              <p className="eyebrow text-muted">{pkg.name}</p>
              <p className="mt-2 font-serif text-[40px] leading-none font-light text-ink">
                {pkg.price}
              </p>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">{pkg.ideal}</p>
              <ul className="mt-5 flex-1">
                {pkg.includes.map((inc) => (
                  <li
                    key={inc}
                    className="border-t border-hairline py-2.5 text-[13px] leading-relaxed text-ink-soft"
                  >
                    {inc}
                  </li>
                ))}
              </ul>
              {pkg.options && (
                <div className="mt-4">
                  <p className="text-[12px] tracking-[0.06em] text-muted uppercase">
                    Choose one styling option
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {pkg.options.map((o) => (
                      <li key={o.label} className="text-[12.5px] leading-relaxed text-ink-soft">
                        <span className="text-ink">{o.label}:</span> {o.items.join(", ")}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {pkg.note && <p className="mt-4 text-[12px] text-muted italic">* {pkg.note}</p>}
              <Link href="/contact/" className="t-link mt-7 self-start text-ink">
                Enquire about {pkg.name}
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-10 grid grid-cols-3 gap-3 max-md:hidden">
          {weddingPackages.map((pkg) => (
            <Pic
              key={pkg.image}
              name={pkg.image}
              alt={`${pkg.name} wedding flower package by Willow & Peony`}
              sizes="33vw"
              aspect="3/4"
              className="h-auto w-full object-cover"
            />
          ))}
        </div>
      </section>

      {/* Dreaming bigger — paper band */}
      <section className="mt-24 border-t border-hairline bg-paper md:mt-[140px]">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-16 sm:px-6 md:grid-cols-3 md:gap-16 md:py-20">
          <div>
            <h2 className="display-3 text-ink">Dreaming bigger?</h2>
            <p className="mt-4 text-[14px] leading-[1.7] text-ink-soft">
              Packages are starting points — most couples use one as the base of a fully bespoke
              design. Tell us your budget and we&rsquo;ll design to it honestly.
            </p>
          </div>
          <div>
            <p className="eyebrow text-muted">What&rsquo;s included</p>
            <p className="mt-3 text-[14px] leading-[1.7] text-ink-soft">
              Every package includes Ivy&rsquo;s design time and premium seasonal sourcing.
              Classic and Luxe add consultation, a full design proposal, delivery, setup,
              next-day pack-out and all vase and plinth hire.
            </p>
          </div>
          <div>
            <p className="eyebrow text-muted">When to book</p>
            <p className="mt-3 text-[14px] leading-[1.7] text-ink-soft">
              We take a limited number of weddings each season. Enquire 6–12 months ahead —
              earlier for peak summer Saturdays.
            </p>
          </div>
        </div>
      </section>

      {/* Common questions */}
      <section className="mx-auto mt-24 max-w-[860px] px-5 sm:px-6 md:mt-[140px]">
        <p className="eyebrow text-muted">Common questions</p>
        <div className="mt-6 divide-y divide-hairline border-y border-hairline">
          {pricingFaqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-serif text-[19px] font-light text-ink [&::-webkit-details-marker]:hidden">
                {f.q}
                <span
                  aria-hidden
                  className="text-[22px] font-light text-muted transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-[680px] text-[14px] leading-[1.75] text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
        <Link href="/faq/" className="t-link mt-7 inline-block text-ink">
          Read all FAQs
        </Link>
      </section>

      {/* CTA */}
      <section className="mt-24 border-t border-hairline bg-paper md:mt-[140px]">
        <div className="mx-auto flex max-w-[900px] flex-col items-center px-5 py-16 text-center sm:py-20">
          <p className="eyebrow text-muted">No pressure, no obligation</p>
          <h2 className="display-3 mt-4 text-ink">
            Get a tailored proposal for <em>your date</em>
          </h2>
          <div className="mt-8">
            <Link href="/contact/" className="btn-solid">
              Start an enquiry
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
