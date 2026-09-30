import Link from "next/link";
import type { Metadata } from "next";
import Pic from "@/components/Pic";
import PostCard from "@/components/PostCard";
import CtaBand from "@/components/CtaBand";
import Eyebrow from "@/components/Eyebrow";
import EnquiryForm from "@/components/EnquiryForm";
import HowWeWork from "@/components/HowWeWork";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { getPostsByCategory } from "@/lib/journal";
import { weddingPackages } from "../../../content/site";

export const metadata: Metadata = pageMetadata({
  title: "Wedding Florist Auckland | Bespoke Wedding Flowers",
  description:
    "Boutique wedding florist on Auckland's North Shore. Romantic, timeless bridal bouquets, ceremony and reception flowers — curated packages from $500 or fully bespoke design.",
  path: "/wedding-flowers-auckland/",
  ogImage: "wedding-flowers-auckland-new-zealand-auckland-wedding-photographer-cbd-271",
});

const gallery = [
  { name: "wedding-flowers-auckland-new-zealand-auckland-wedding-photographer-cbd-271", alt: "Bridal bouquet with soft peach and cream roses, Auckland wedding" },
  { name: "wedding-flowers-auckland-new-zealand-auckland-wedding-photographer-cbd-emma-443", alt: "Bride holding a joyful pastel bouquet in Auckland city" },
  { name: "wedding-flowers-auckland-img-3926", alt: "Romantic ceremony arrangement with garden roses and orchids" },
  { name: "wedding-flowers-auckland-dsc03988", alt: "Sculptural white and blush wedding flowers on a plinth" },
  { name: "wedding-flowers-auckland-scarlet-style-shoot4", alt: "Bold crimson and blush bridal bouquet styled at The Narrows Landing" },
  { name: "wedding-flowers-auckland-willowandpeony-1-13", alt: "Delicate bud vases and candles styled for a wedding reception" },
  { name: "wedding-flowers-auckland-80bdd7b3b17e99d8a7325420cb8fb9c7", alt: "Garden-inspired ceremony flowers in blush and white" },
  { name: "wedding-flowers-auckland-dsc02433-4", alt: "Textural bridal bouquet with premium seasonal blooms" },
];

export default function WeddingsPage() {
  const posts = getPostsByCategory("weddings").slice(0, 3);
  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd({
            name: "Wedding Floral Design",
            description:
              "Bespoke wedding flowers and floral styling across Auckland: bridal bouquets, ceremony flowers, reception styling and curated wedding packages.",
            path: "/wedding-flowers-auckland/",
            serviceType: "Wedding florist",
            offers: weddingPackages.map((p) => ({
              name: `${p.name} Package`,
              price: p.priceNumber,
              description: p.ideal,
            })),
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Wedding Flowers Auckland", path: "/wedding-flowers-auckland/" },
          ]),
        ]}
      />

      {/* Hero */}
      <section className="relative h-[62vh] min-h-[400px] w-full overflow-hidden">
        <Pic
          name="wedding-flowers-auckland-2c760fef1a83095d5abd94ee51e4041a"
          alt="Bridal party with blush and ivory wedding bouquets by Willow & Peony"
          sizes="100vw"
          priority
          className="absolute inset-0 h-full w-full object-cover"
        />
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-3xl px-4 pt-16 text-center sm:px-6">
        <h1 className="font-serif text-3xl leading-snug text-ink sm:text-4xl">
          Wedding Florals
        </h1>
        <p className="mt-3 text-[0.85rem] tracking-[0.08em] text-muted uppercase">
          Thoughtful · Romantic · Timeless
        </p>
        <p className="mt-8 font-serif text-xl leading-relaxed text-ink">
          Weddings are deeply personal — your flowers should be too.
        </p>
        <p className="mt-6 leading-relaxed text-ink-soft">
          Based on Auckland&rsquo;s North Shore, Willow &amp; Peony is a boutique wedding florist
          specialising in romantic, modern arrangements for weddings and intimate celebrations
          across Auckland. Our work is soft, feminine and artfully composed — premium seasonal
          blooms with unexpected textural details, designed to feel uniquely yours.
        </p>
      </section>

      {/* What we offer */}
      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="bg-ivory-deep p-8 sm:p-10">
            <h2 className="font-serif text-2xl text-ink">Wedding flower packages</h2>
            <p className="mt-4 leading-relaxed text-ink-soft">
              Three thoughtfully designed tiers — Petite, Classic and Luxe — covering the floral
              essentials from bridal bouquet to ceremony and reception styling, in our signature
              romantic aesthetic. Perfect for couples who want beautiful blooms without the
              overwhelm.
            </p>
            <Link
              href="/wedding-flower-packages/"
              className="mt-6 inline-block border border-ink px-6 py-2.5 text-[0.78rem] tracking-[0.16em] uppercase text-ink transition-colors hover:bg-ink hover:text-ivory"
            >
              View packages &amp; pricing
            </Link>
          </div>
          <div className="bg-ivory-deep p-8 sm:p-10">
            <h2 className="font-serif text-2xl text-ink">Bespoke floral design</h2>
            <p className="mt-4 leading-relaxed text-ink-soft">
              For couples dreaming of something entirely unique, our bespoke service is a fully
              customised floral experience. We work closely with you — and your planner or stylist
              — to design intentional, artful arrangements tailored to your vision, venue and
              priorities, from dramatic installations to delicate details.
            </p>
            <Link
              href="/contact/"
              className="mt-6 inline-block border border-ink px-6 py-2.5 text-[0.78rem] tracking-[0.16em] uppercase text-ink transition-colors hover:bg-ink hover:text-ivory"
            >
              Enquire about bespoke
            </Link>
          </div>
        </div>
        <p className="mx-auto mt-12 max-w-2xl text-center leading-relaxed text-ink-soft">
          Every couple is different — and so is every wedding we design. We take a boutique,
          collaborative approach, starting with a deep understanding of your style, vision and
          priorities, so your flowers feel as special as the day itself.
        </p>
      </section>

      {/* Gallery */}
      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6" aria-label="Wedding flower gallery">
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

      <HowWeWork />

      {/* Latest weddings */}
      <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="font-serif text-3xl text-ink">Recent weddings</h2>
          <Link
            href="/journal/weddings/"
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
      <section id="enquire" className="mx-auto mt-24 max-w-3xl scroll-mt-24 px-4 sm:px-6">
        <div className="text-center">
          <Eyebrow>Enquire</Eyebrow>
          <h2 className="mt-3 font-serif text-3xl text-ink">
            Ready to bring your vision to life — bloom by bloom?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted">
            Tell us about your day — your style, your venue, your dream florals — and we&rsquo;ll
            be in touch within 1–2 business days.
          </p>
        </div>
        <div className="mt-10">
          <EnquiryForm kind="wedding" />
        </div>
      </section>

      <CtaBand
        title="Not sure what's in season for your date?"
        body="Download our free Wedding Flower Calendar — a month-by-month guide to New Zealand's seasonal blooms."
        buttonLabel="Get the calendar"
        buttonHref="/wedding-flower-calendar/"
      />
    </>
  );
}
