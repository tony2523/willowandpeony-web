import Link from "next/link";
import type { Metadata } from "next";
import Pic from "@/components/Pic";
import { pageMetadata } from "@/lib/seo";
import { getPosts } from "@/lib/journal";
import InstagramFeed from "@/components/InstagramFeed";
import TestimonialSlider from "@/components/TestimonialSlider";
import LatestWork from "@/components/LatestWork";
import { googleRating } from "../../content/reviews";
import GalleryFeature from "@/components/GalleryFeature";
import { featureImages } from "@/lib/gallery";

export const metadata: Metadata = pageMetadata({
  title: "Wedding & Event Florist Auckland | Willow & Peony",
  description:
    "Boutique Auckland florist on the North Shore, creating romantic, artful flowers for weddings, corporate events and celebrations across Auckland.",
  path: "/",
});

const services = [
  {
    number: "01",
    label: "Weddings",
    href: "/wedding-flowers-auckland/",
    image: "willow-and-peony-florist-auckland-new-zealand-auckland-wedding-photographer-cbd-emma-445",
    alt: "Bride holding a romantic pastel bridal bouquet in Auckland",
    copy: "Bouquets, ceremony and reception styling for romantic, timeless celebrations.",
  },
  {
    number: "02",
    label: "Private events",
    href: "/event-flowers-auckland/",
    image: "elevating-others-dinner-event-by-the-gut-group",
    alt: "Gala dinner table styled with sculptural florals",
    copy: "Milestones, dinners and celebrations styled with atmosphere and intent.",
  },
  {
    number: "03",
    label: "Corporate",
    href: "/event-flowers-auckland/",
    image: "event-flowers-auckland-dsc03608-2",
    alt: "Statement corporate event flowers at an Auckland venue",
    copy: "Launches, galas and conferences with florals that carry your brand.",
  },
];

export default function HomePage() {
  const latest = getPosts().slice(0, 3);
  return (
    <>
      {/* Hero — full-viewport image, transparent header floats over it */}
      <section className="relative h-svh min-h-[40rem] w-full overflow-hidden">
        <Pic
          name="auckland-bridal-party-blush-bouquets-hero"
          alt="Bridal party holding blush and ivory bouquets by Willow & Peony, Auckland"
          sizes="100vw"
          priority
          className="absolute inset-0 h-full w-full object-cover object-[50%_62%] md:object-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[rgba(20,18,16,0.72)] via-[rgba(20,18,16,0.3)] to-[rgba(20,18,16,0.15)] md:from-[rgba(20,18,16,0.55)] md:via-[rgba(20,18,16,0.05)]"
        />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-[80rem] px-5 pb-16 sm:px-6 md:pb-24">
            <p className="eyebrow text-white/85">Boutique florist · Auckland</p>
            <h1 className="display-hero mt-4 max-w-[56.25rem] text-white">
              Artful florals for <em>beautifully considered</em> events
            </h1>
            <p className="mt-5 max-w-[35rem] text-[0.9375rem] leading-relaxed font-light text-white/90">
              Bespoke wedding and event flowers, designed with premium seasonal blooms, refined
              palettes and an artful eye for detail.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/wedding-flowers-auckland/" className="btn-white">
                Wedding florals
              </Link>
              <Link href="/event-flowers-auckland/" className="btn-ghost-white">
                Event florals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section
        aria-label="Highlights"
        className="border-b border-hairline bg-white px-5 py-6 sm:px-6"
      >
        <ul className="mx-auto flex max-w-[80rem] flex-wrap items-center justify-center gap-x-10 gap-y-2 text-center text-[0.6875rem] tracking-[0.16em] text-ink-soft uppercase">
          <li>Weddings across Auckland &amp; beyond</li>
          <li className="hidden sm:block" aria-hidden>
            ·
          </li>
          <li>
            <a
              href={googleRating.url}
              target="_blank"
              rel="noopener"
              className="hover:text-ink hover:underline"
            >
              ★ {googleRating.value.toFixed(1)} Google · {googleRating.count} reviews
            </a>
          </li>
          <li className="hidden sm:block" aria-hidden>
            ·
          </li>
          <li>Now booking 2027 and 2028</li>
        </ul>
      </section>

      {/* Intro */}
      <section className="mx-auto mt-20 grid max-w-[80rem] gap-10 px-5 sm:px-6 md:mt-28 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-20">
        <h2 className="display-2 text-ink">
          Romantic, sculptural and <em>artful</em> — designed to complement your venue and
          elevate the atmosphere.
        </h2>
        <div className="max-w-[27.5rem] self-center">
          <p className="text-[0.875rem] leading-[1.75] text-ink-soft">
            Willow &amp; Peony specialises in floral styling for weddings, corporate events and
            beautifully hosted celebrations across Auckland and beyond — thoughtfully curated with
            premium blooms, refined palettes and an artful eye for detail.
          </p>
          <Link href="/about/" className="t-link mt-6 text-ink">
            Our story
          </Link>
        </div>
      </section>

      {/* Three ways we work */}
      <section
        aria-labelledby="services-heading"
        className="mx-auto mt-24 max-w-[80rem] px-5 sm:px-6 md:mt-[8.75rem]"
      >
        <p className="eyebrow text-muted">What we do</p>
        <h2 id="services-heading" className="display-2 mt-3 text-ink">
          Three ways we work
        </h2>
        <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Link
              key={s.number}
              href={s.href}
              className={`group block ${i === 1 ? "lg:mt-14" : ""}`}
            >
              <div className="overflow-hidden bg-paper">
                <Pic
                  name={s.image}
                  alt={s.alt}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  aspect="4/5"
                  className="h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="h-card text-ink group-hover:underline group-hover:decoration-[1px] group-hover:underline-offset-[0.3125rem]">
                  {s.label}
                </h3>
                <span className="text-[0.6875rem] tracking-[0.14em] text-muted" aria-hidden>
                  {s.number}
                </span>
              </div>
              <p className="mt-1.5 max-w-[22.5rem] text-[0.84375rem] leading-relaxed text-ink-soft">
                {s.copy}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Gallery — editorial teaser linking to the wedding gallery */}
      <GalleryFeature
        eyebrow="From the gallery"
        title={
          <>
            Weddings in <em>full bloom</em>
          </>
        }
        href="/gallery/"
        linkLabel="View the wedding gallery"
        images={featureImages([
          "gallery-auckland-city-wedding-02",
          "gallery-amanda-bryan-hotel-britomart-05",
          "gallery-kaelan-tongtong-st-matthew-in-the-city-08",
          "gallery-leah-riley-private-venue-04",
          "gallery-yue-vern-bridgewater-estate-01",
        ])}
      />

      {/* Meet your florist */}
      <section className="mx-auto mt-24 grid max-w-[80rem] gap-12 px-5 sm:px-6 md:mt-[8.75rem] md:grid-cols-[minmax(0,1fr)_25rem] md:gap-24">
        <div>
          <p className="eyebrow text-muted">Meet your florist</p>
          <h2 className="display-2 mt-3 text-ink">Ivy, founder of Willow &amp; Peony</h2>
          <p className="mt-7 max-w-[35rem] font-serif text-[1.375rem] leading-[1.5] font-light text-ink-soft italic sm:text-[1.5625rem]">
            &ldquo;I&rsquo;m drawn to romantic flowers, interesting shapes and the occasional
            unexpected ingredient.&rdquo;
          </p>
          <p className="mt-6 max-w-[33.75rem] text-[0.9375rem] leading-[1.7] font-light text-ink-soft">
            But I also love seeing what each couple brings&mdash;the colours you love, a flower
            that means something to you, or an idea you&rsquo;re not quite sure how to describe.
            We&rsquo;ll work from there, combining your taste with my eye for flowers to create
            something you&rsquo;ll love on the day.
          </p>
          <Link href="/about/" className="t-link mt-8 inline-block text-ink">
            Our story
          </Link>
        </div>
        <div className="self-start">
          <Pic
            name="willow-and-peony-bouquet-ivy-willow-peony-copy-a677a82d-5fc6-4fcd-b72d-c0884402c2e5"
            alt="Ivy Diao, founder and lead florist of Willow & Peony"
            sizes="(max-width: 768px) 100vw, 400px"
            aspect="4/5"
            className="h-auto w-full max-w-[25rem] object-cover"
          />
        </div>
      </section>

      {/* Reviews slider — paper band */}
      <section
        aria-label="Client reviews"
        className="mt-24 border-t border-hairline bg-paper px-5 py-16 sm:px-6 md:mt-[8.75rem] md:py-24"
      >
        <TestimonialSlider />
      </section>

      {/* Latest work */}
      <div className="mt-24 md:mt-[8.75rem]">
        <LatestWork posts={latest} eyebrow="Real weddings & events" />
      </div>

      {/* Instagram — full-bleed strip */}
      <div className="mt-24 md:mt-[8.75rem]">
        <InstagramFeed />
      </div>

      {/* CTA band — flush against the Instagram strip (two full-bleeds read as one) */}
      <section className="border-t border-hairline bg-paper">
        <div className="mx-auto flex max-w-[56.25rem] flex-col items-center px-5 py-16 text-center sm:py-20">
          <p className="eyebrow text-muted">Now booking 2027 and 2028 weddings</p>
          <h2 className="display-3 mt-4 text-ink">
            Let&rsquo;s talk about <em>your day</em>
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/contact/" className="btn-solid">
              Start an enquiry
            </Link>
            <Link href="/wedding-flower-calculator/" className="btn-outline">
              Estimate your flowers
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
