import Link from "next/link";
import type { Metadata } from "next";
import Pic from "@/components/Pic";
import PostCard from "@/components/PostCard";
import { pageMetadata } from "@/lib/seo";
import { getPostsByCategory } from "@/lib/journal";
import InstagramFeed from "@/components/InstagramFeed";

export const metadata: Metadata = pageMetadata({
  title: "Wedding & Event Florist Auckland | Willow & Peony",
  description:
    "Willow & Peony is a boutique florist on Auckland's North Shore creating romantic, artful floral styling for weddings, corporate events and celebrations across Auckland.",
  path: "/",
});

const services = [
  {
    label: "Weddings",
    href: "/wedding-flowers-auckland/",
    image: "willow-and-peony-florist-auckland-new-zealand-auckland-wedding-photographer-cbd-emma-445",
    alt: "Bride holding a romantic pastel bridal bouquet in Auckland",
  },
  {
    label: "Private Events",
    href: "/event-flowers-auckland/",
    image: "willow-and-peony-florist-auckland-willowandpeony-1-217",
    alt: "Sculptural floral arrangement styled for a private celebration",
  },
  {
    label: "Corporate Events",
    href: "/event-flowers-auckland/",
    image: "event-flowers-auckland-dsc03608-2",
    alt: "Statement corporate event flowers at an Auckland venue",
  },
];

export default function HomePage() {
  const latest = getPostsByCategory("weddings").slice(0, 4);
  return (
    <>
      {/* Hero — full-viewport image, transparent header floats over it */}
      <section className="relative h-svh w-full overflow-hidden">
        <Pic
          name="wedding-flowers-auckland-2c760fef1a83095d5abd94ee51e4041a"
          alt="Bridesmaids holding blush and ivory bouquets by Willow & Peony, Auckland"
          sizes="100vw"
          priority
          className="absolute inset-0 h-full w-full object-cover"
        />
      </section>

      {/* Intro — heading col 640px, paragraphs 580px (measured) */}
      <section className="mx-auto mt-[88px] max-w-[640px] px-5 text-center sm:px-6">
        <h1 className="h-page text-ink">Artful Florals for Beautifully Considered Events</h1>
        <div className="mx-auto max-w-[580px]">
          <p className="mt-6 text-[15px] leading-[1.4] text-ink">
            Thoughtfully curated florals for weddings and events, designed with premium blooms,
            refined palettes and an artful eye for detail.
          </p>
          <p className="mt-4 text-[15px] leading-[1.4] text-ink">
            Willow &amp; Peony specialises in floral styling for weddings, corporate events and
            beautifully hosted celebrations across Auckland and beyond. Our work is romantic,
            refined and quietly distinctive — designed to complement your venue, elevate the
            atmosphere and create a floral experience that feels personal, polished and memorable.
          </p>
        </div>
      </section>

      {/* Services — 3 columns, 20px gap, labels 12.6px grey (measured) */}
      <section className="mt-[88px] px-5 sm:px-6" aria-labelledby="services-heading">
        <h2 id="services-heading" className="sr-only">
          What we do
        </h2>
        <div className="grid gap-8 md:grid-cols-3 md:gap-5">
          {services.map((s) => (
            <Link key={s.label + s.image} href={s.href} className="group block">
              <div className="overflow-hidden bg-blush">
                <Pic
                  name={s.image}
                  alt={s.alt}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  aspect="452/582"
                  className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
              </div>
              <p className="label mt-3 text-ink-soft group-hover:underline">{s.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Founder — small image (292px) beside a 560px text column (measured) */}
      <section className="mx-auto mt-[88px] px-5 sm:px-6">
        <div className="mx-auto flex max-w-[920px] flex-col items-center gap-10 md:flex-row md:gap-16">
          <div className="w-full max-w-[292px] shrink-0">
            <Pic
              name="willow-and-peony-bouquet-ivy-willow-peony-copy-a677a82d-5fc6-4fcd-b72d-c0884402c2e5"
              alt="Ivy, founder and lead florist of Willow & Peony, holding a bouquet"
              sizes="292px"
              className="h-auto w-full"
            />
          </div>
          <div className="max-w-[560px]">
            <h2 className="h-page text-ink">MEET OUR FOUNDER: IVY</h2>
            <div className="mt-5 space-y-4 text-[15px] leading-[1.4] text-ink-soft">
              <p>
                Willow &amp; Peony was born from a deep love for flowers and a passion for
                creating beauty through thoughtful, refined design.
              </p>
              <p>
                With years of experience across weddings, events and bespoke floral styling, Ivy
                brings an intuitive eye for colour, composition and atmosphere to every project.
              </p>
              <p>
                Her signature style is romantic, artful and quietly distinctive, combining premium
                blooms with carefully layered palettes to create florals that feel elegant,
                memorable and deeply considered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest work — 4 square cards, 24px gap (measured) */}
      <section className="mt-[88px] px-5 sm:px-6" aria-labelledby="latest-heading">
        <div className="flex items-end justify-between">
          <h2 id="latest-heading" className="h-page text-ink">
            Our Latest Work
          </h2>
          <Link href="/journal/weddings/" className="link-text text-ink">
            Go to blogs
          </Link>
        </div>
        <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {latest.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <InstagramFeed />
    </>
  );
}
