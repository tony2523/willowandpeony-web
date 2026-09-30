import Link from "next/link";
import type { Metadata } from "next";
import Pic from "@/components/Pic";
import Hero from "@/components/Hero";
import EnquiryForm from "@/components/EnquiryForm";
import JsonLd from "@/components/JsonLd";
import LatestWork from "@/components/LatestWork";
import TestimonialSlider from "@/components/TestimonialSlider";
import { pageMetadata, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { getPostsByCategory } from "@/lib/journal";

export const metadata: Metadata = pageMetadata({
  title: "Corporate & Event Florist Auckland | Event Flowers",
  description:
    "Impactful event florals in Auckland — corporate events, product launches, gala dinners and private celebrations. Boutique floral styling designed to transform spaces and leave a lasting impression.",
  path: "/event-flowers-auckland/",
  ogImage: "event-flowers-auckland-uca-17",
});

const offers = [
  {
    number: "01",
    title: "Corporate events",
    body: "Reception styling, gala dinners, awards nights, product launches and conferences — florals that align with your brand and vision.",
  },
  {
    number: "02",
    title: "Private celebrations",
    body: "Milestone birthdays, anniversaries and engagements — beauty and atmosphere brought to life through flowers.",
  },
  {
    number: "03",
    title: "Styled shoots",
    body: "Bold, dreamy, editorial-worthy floral stories built with fellow creatives.",
  },
  {
    number: "04",
    title: "Client gifting",
    body: "Custom arrangements and curated gift bundles that impress your guests or show appreciation in style.",
  },
];

export default function EventsPage() {
  const posts = getPostsByCategory("events").slice(0, 3);
  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd({
            name: "Event Floral Styling",
            description:
              "Floral design for corporate events, product launches, gala dinners, conferences and private celebrations across Auckland.",
            path: "/event-flowers-auckland/",
            serviceType: "Event florist",
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Event Flowers Auckland", path: "/event-flowers-auckland/" },
          ]),
        ]}
      />

      <Hero
        image="event-flowers-auckland-uca-17"
        alt="Large sculptural floral installation at a corporate event in Auckland"
        eyebrow="Corporate & event florals · Auckland"
        title={
          <>
            Flowers that make a room <em>unforgettable</em>
          </>
        }
        intro="Impactful floral design for corporate events, launches, gala dinners and private celebrations — styled to your brand, your space and your moment."
        cta={{ label: "Enquire for your event", href: "#enquire" }}
      />

      {/* Trusted by */}
      <section aria-label="Clients" className="mx-auto mt-16 max-w-[1280px] px-5 text-center sm:px-6 md:mt-20">
        <p className="eyebrow text-muted">Trusted for events by</p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-3 font-serif text-[17px] font-light text-ink-soft sm:text-[19px]">
          <li>Shopify</li>
          <li>NZ Post</li>
          <li>Moustache Republic</li>
          <li>The Gut Group</li>
        </ul>
      </section>

      {/* Intro */}
      <section className="mx-auto mt-20 grid max-w-[1280px] gap-10 px-5 sm:px-6 md:mt-28 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-20">
        <h2 className="display-2 text-ink">
          Event flowers that go <em>beyond decoration</em>
        </h2>
        <p className="max-w-[440px] self-center text-[14px] leading-[1.75] text-ink-soft">
          They transform spaces, capture attention and leave a lasting impression. Each
          arrangement is thoughtfully styled with premium seasonal blooms, combining elegance with
          unexpected details so your event feels distinctive, polished and unforgettable — no
          cookie-cutter florals here.
        </p>
      </section>

      {/* Case study */}
      <section className="mx-auto mt-24 max-w-[1280px] px-5 sm:px-6 md:mt-[140px]">
        <div className="grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-16">
          <div className="md:pt-6">
            <p className="eyebrow text-muted">Case study</p>
            <h2 className="display-3 mt-3 text-ink">
              Unified Commerce Assembly — sculpture, citrus and the unexpected
            </h2>
            <p className="mt-5 max-w-[480px] text-[15px] leading-[1.7] font-light text-ink-soft">
              Two contemporary installations for Moustache Republic and NZ Post — anthuriums,
              orchids, spider gerberas, limes and cascading red radishes, designed to bring colour
              and conversation into a commerce conference.
            </p>
            <Link
              href="/journal/unified-commerce-assembly-2026-event-flowers/"
              className="t-link mt-7 inline-block text-ink"
            >
              Read the case study
            </Link>
            <div className="mt-9 flex gap-3">
              {[
                "event-flowers-auckland-dsc03608-2",
                "unified-commerce-assembly-2024-event-flo-uca-18-2",
                "unified-commerce-assembly-2026-event-flo-uca-2026-by-w-p-1",
              ].map((name) => (
                <Pic
                  key={name}
                  name={name}
                  alt=""
                  sizes="130px"
                  aspect="4/5"
                  className="h-auto w-[90px] object-cover sm:w-[130px]"
                />
              ))}
            </div>
          </div>
          <Pic
            name="unified-commerce-assembly-2026-event-flo-uca-2026-by-annupam-5"
            alt="Sculptural floral installation with citrus at Unified Commerce Assembly 2026"
            sizes="(max-width: 768px) 100vw, 55vw"
            className="h-auto w-full object-cover"
          />
        </div>
      </section>

      {/* What we create — paper band */}
      <section className="mt-24 border-t border-hairline bg-paper md:mt-[140px]">
        <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-6 md:py-24">
          <p className="eyebrow text-muted">What we create</p>
          <div className="mt-10 grid gap-x-12 gap-y-8 sm:grid-cols-2">
            {offers.map((o) => (
              <div key={o.number} className="border border-hairline bg-white px-6 py-5">
                <div className="flex items-baseline gap-4">
                  <span className="font-serif text-[24px] font-light text-hairline" aria-hidden>
                    {o.number}
                  </span>
                  <h3 className="font-serif text-[19px] font-normal text-ink">{o.title}</h3>
                </div>
                <p className="mt-2 pl-11 text-[13.5px] leading-relaxed text-ink-soft">{o.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews slider */}
      <section
        aria-label="Client reviews"
        className="mt-24 bg-white px-5 sm:px-6 md:mt-[140px]"
      >
        <TestimonialSlider kind="event" />
      </section>

      {/* Recent events */}
      <div className="mt-24 md:mt-[140px]">
        <LatestWork
          posts={posts}
          eyebrow="The journal"
          title="Recent events"
          href="/work/?type=events"
        />
      </div>

      {/* Enquiry — paper band with the event form */}
      <section
        id="enquire"
        className="mt-24 scroll-mt-24 border-t border-hairline bg-paper md:mt-[140px]"
      >
        <div className="mx-auto max-w-[820px] px-5 py-16 sm:px-6 md:py-24">
          <div className="text-center">
            <p className="eyebrow text-muted">Enquire for your event</p>
            <h2 className="display-3 mt-3 text-ink">Tell us about the occasion</h2>
          </div>
          <div className="mt-10">
            <EnquiryForm kind="event" />
          </div>
        </div>
      </section>
    </>
  );
}
