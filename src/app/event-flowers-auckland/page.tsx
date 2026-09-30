import Link from "next/link";
import type { Metadata } from "next";
import Pic from "@/components/Pic";
import PostCard from "@/components/PostCard";
import Eyebrow from "@/components/Eyebrow";
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

const offers = [
  {
    title: "Corporate events & functions",
    body: "Reception styling, gala dinners, awards nights, product launches and conferences — florals that set the tone and align with your brand and vision.",
  },
  {
    title: "Private celebrations",
    body: "Milestone birthdays, anniversaries and engagement parties — beauty and atmosphere brought to life through flowers.",
  },
  {
    title: "Styled shoots & creative collaborations",
    body: "We love working with other creatives to build floral stories that are bold, dreamy and editorial-worthy.",
  },
  {
    title: "Client & team gifting",
    body: "Custom floral arrangements and curated gift bundles to impress your guests or show appreciation in style.",
  },
];

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

      {/* Hero */}
      <section className="relative">
        <div className="relative h-[56vh] min-h-[400px] w-full overflow-hidden">
          <Pic
            name="event-flowers-auckland-uca-17"
            alt="Large sculptural floral installation at a corporate event in Auckland"
            sizes="100vw"
            priority
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-12 sm:px-6">
            <Eyebrow>
              <span className="text-ivory/80">Intentional · Artful · Memorable</span>
            </Eyebrow>
            <h1 className="mt-3 max-w-2xl font-serif text-4xl leading-[1.1] text-ivory sm:text-5xl">
              Event flowers in Auckland
            </h1>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-3xl px-4 pt-16 text-center sm:px-6">
        <p className="font-serif text-2xl leading-relaxed text-ink">
          Event flowers that go beyond decoration — they transform spaces, capture attention and
          leave a lasting impression.
        </p>
        <p className="mt-6 leading-relaxed text-ink-soft">
          Our boutique Auckland studio specialises in impactful floral design for corporate events,
          product launches, gala dinners and private celebrations. Each arrangement is thoughtfully
          styled with premium seasonal blooms, combining elegance with unexpected details so your
          event feels distinctive, polished and unforgettable.
        </p>
      </section>

      {/* What we offer */}
      <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {offers.map((o) => (
            <div key={o.title} className="border border-hairline bg-white p-7">
              <h2 className="font-serif text-xl text-ink">{o.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{o.body}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-2xl text-center leading-relaxed text-ink-soft">
          No cookie-cutter florals here. Every event is different, and we take the time to
          understand your needs and aesthetic — crafting florals that feel just right for the
          moment.
        </p>
      </section>

      {/* Gallery */}
      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6" aria-label="Event flower gallery">
        <div className="columns-2 gap-4 md:columns-4 [&>*]:mb-4">
          {gallery.map((g) => (
            <Pic
              key={g.name}
              name={g.name}
              alt={g.alt}
              sizes="(max-width: 768px) 50vw, 25vw"
              className="w-full break-inside-avoid"
            />
          ))}
        </div>
      </section>

      {/* Latest events */}
      <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="font-serif text-3xl text-ink">Recent events</h2>
          <Link
            href="/journal/events/"
            className="text-[0.78rem] tracking-[0.16em] uppercase text-rose-deep hover:text-ink"
          >
            View all →
          </Link>
        </div>
        <div className="mt-9 grid gap-x-7 gap-y-12 sm:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {/* Enquiry */}
      <section id="enquire" className="mx-auto mt-24 max-w-3xl scroll-mt-24 px-4 pb-8 sm:px-6">
        <div className="text-center">
          <Eyebrow>Enquire</Eyebrow>
          <h2 className="mt-3 font-serif text-3xl text-ink">Planning an event?</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted">
            Tell us about the occasion, the space and the atmosphere you want to create —
            we&rsquo;ll come back with ideas within 1–2 business days.
          </p>
        </div>
        <div className="mt-10">
          <EnquiryForm kind="event" />
        </div>
      </section>
    </>
  );
}
