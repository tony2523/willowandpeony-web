import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Slideshow from "@/components/Slideshow";
import PostCard from "@/components/PostCard";
import EnquiryForm from "@/components/EnquiryForm";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { getPostsByCategory } from "@/lib/journal";

export const metadata: Metadata = pageMetadata({
  title: "Corporate & Event Florist Auckland | Event Flowers",
  description:
    "Impactful event florals in Auckland — corporate events, product launches, gala dinners and private celebrations. Boutique floral styling designed to transform spaces and leave a lasting impression.",
  path: "/event-flowers-auckland/",
  ogImage: "event-flowers-auckland-uca-17",
});

const gallery = [
  { name: "event-flowers-auckland-dsc03608-2", alt: "Sculptural centrepiece with anthuriums and citrus at a corporate dinner" },
  { name: "event-flowers-auckland-dsc03601", alt: "Table florals with fresh fruit accents at The French Café Auckland" },
  { name: "event-flowers-auckland-dsc03544", alt: "Elegant dinner table styling with lush floral centrepieces" },
  { name: "event-flowers-auckland-img-2587", alt: "Contemporary floral installation at an Auckland event venue" },
  { name: "event-flowers-auckland-dsc03584", alt: "Premium event florals styled for a leadership dinner" },
  { name: "event-flowers-auckland-dsc03511", alt: "Sophisticated corporate event table arrangement" },
  { name: "event-flowers-auckland-uca-17-copy-2", alt: "Statement stage installation at Unified Commerce Assembly" },
  { name: "event-flowers-auckland-uca-18-2", alt: "Colourful sculptural event flowers with orchids and tropical blooms" },
];

const offers = [
  {
    title: "Corporate Events & Functions",
    body: "Reception styling, gala dinners, awards nights, product launches, or conferences — we'll help set the tone with florals that align with your brand and vision.",
  },
  {
    title: "Private Celebrations",
    body: "Whether it's a milestone birthday, anniversary, or engagement party, we bring beauty and atmosphere to life through flowers.",
  },
  {
    title: "Styled Shoots & Creative Collaborations",
    body: "We love working with other creatives to build floral stories that are bold, dreamy, and editorial-worthy.",
  },
  {
    title: "Client & Team Gifting",
    body: "Custom floral arrangements and curated gift bundles to impress your guests or show appreciation in style.",
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

      <PageHero
        image="event-flowers-auckland-uca-17"
        alt="Large sculptural floral installation at a corporate event in Auckland"
        title="Event Florals"
      />

      {/* Split section, as on the original: auto-cycling slideshow left,
          left-aligned text column right */}
      <section className="mt-[88px] flex flex-col md:flex-row">
        <div className="w-full px-5 md:w-1/2 md:px-0">
          <Slideshow images={gallery} aspect="720/900" />
        </div>
        <div className="flex w-full items-center justify-center px-5 py-14 sm:px-6 md:w-1/2 md:py-8">
          <div className="w-full max-w-[520px]">
        <h2 className="h-page text-ink">Impactful Events Floral Styling</h2>
        <p className="h-card mt-2 text-ink-soft">Intentional. Artful. Memorable.</p>
        <div className="mt-6 space-y-4 text-[15px] leading-[1.4] text-ink">
          <p>
            At Willow &amp; Peony, we create event flowers that go beyond decoration — they
            transform spaces, capture attention, and leave a lasting impression. Based in
            Auckland, our boutique floral studio specialises in impactful floral design for
            corporate events, product launches, gala dinners, and private celebrations.
          </p>
          <p>
            Each arrangement is thoughtfully styled with premium seasonal blooms, combining
            elegance with unexpected details to ensure your event feels distinctive, polished,
            and unforgettable.
          </p>
        </div>

        <h3 className="mt-10 font-serif text-[16.8px] font-bold tracking-[-0.02em] text-ink">
          What We Offer
        </h3>
        <ul className="mt-4 list-disc space-y-3 pl-5 text-[15px] leading-[1.4] text-ink">
          {offers.map((o) => (
            <li key={o.title}>
              <strong className="font-normal">{o.title}</strong>
              <br />
              {o.body}
            </li>
          ))}
        </ul>

        <h3 className="mt-10 font-serif text-[16.8px] font-bold tracking-[-0.02em] text-ink">
          Why Choose Us
        </h3>
        <p className="mt-4 text-[15px] leading-[1.4] text-ink">
          We bring a thoughtful, boutique approach to every project — no cookie-cutter florals
          here. Every event is different, and we take the time to understand your needs and
          aesthetic, crafting florals that feel just right for the moment.
        </p>
          </div>
        </div>
      </section>

      <section className="mt-[88px] px-5 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="h-page text-ink">Our Latest Work</h2>
          <Link href="/journal/events/" className="link-text text-ink">
            View All
          </Link>
        </div>
        <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section id="enquire" className="mx-auto mt-[88px] max-w-[720px] scroll-mt-24 px-5 sm:px-6">
        <div className="text-center">
          <h2 className="h-page text-ink">Ready to bring your vision to life—bloom by bloom?</h2>
          <p className="mx-auto mt-4 max-w-[580px] text-[15px] leading-[1.4] text-ink-soft">
            Simply fill out the enquiry form below to get started!
          </p>
        </div>
        <div className="mt-10">
          <EnquiryForm kind="event" />
        </div>
      </section>
    </>
  );
}
