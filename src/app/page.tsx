import Link from "next/link";
import type { Metadata } from "next";
import Pic from "@/components/Pic";
import PostCard from "@/components/PostCard";
import { pageMetadata } from "@/lib/seo";
import { getPostsByCategory } from "@/lib/journal";

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
      {/* Hero — clean full-bleed image with the transparent header over it */}
      <section className="relative h-[88vh] min-h-[520px] w-full overflow-hidden">
        <Pic
          name="wedding-flowers-auckland-2c760fef1a83095d5abd94ee51e4041a"
          alt="Bridesmaids holding blush and ivory bouquets by Willow & Peony, Auckland"
          sizes="100vw"
          priority
          className="absolute inset-0 h-full w-full object-cover"
        />
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-2xl px-4 pt-16 pb-4 text-center sm:px-6">
        <h1 className="font-serif text-[1.7rem] leading-snug text-ink sm:text-3xl">
          Artful Florals for Beautifully Considered Events
        </h1>
        <p className="mt-6 text-[0.92rem] leading-relaxed text-ink-soft">
          Thoughtfully curated florals for weddings and events, designed with premium blooms,
          refined palettes and an artful eye for detail.
        </p>
        <p className="mt-4 text-[0.92rem] leading-relaxed text-ink-soft">
          Willow &amp; Peony specialises in floral styling for weddings, corporate events and
          beautifully hosted celebrations across Auckland and beyond. Our work is romantic,
          refined and quietly distinctive — designed to complement your venue, elevate the
          atmosphere and create a floral experience that feels personal, polished and memorable.
        </p>
      </section>

      {/* Services */}
      <section
        className="mx-auto max-w-[1400px] px-4 pt-12 sm:px-8"
        aria-labelledby="services-heading"
      >
        <h2 id="services-heading" className="sr-only">
          What we do
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {services.map((s) => (
            <Link key={s.label + s.image} href={s.href} className="group block">
              <div className="overflow-hidden bg-blush">
                <Pic
                  name={s.image}
                  alt={s.alt}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  aspect="3/4"
                  className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
              </div>
              <p className="mt-3 text-[0.85rem] text-ink group-hover:underline">{s.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Founder */}
      <section className="mx-auto max-w-[1200px] px-4 pt-24 sm:px-8">
        <div className="grid items-center gap-10 md:grid-cols-[2fr_3fr] md:gap-16">
          <div className="overflow-hidden">
            <Pic
              name="willow-and-peony-bouquet-ivy-willow-peony-copy-a677a82d-5fc6-4fcd-b72d-c0884402c2e5"
              alt="Ivy, founder and lead florist of Willow & Peony, holding a bouquet"
              sizes="(max-width: 768px) 100vw, 40vw"
              className="h-auto w-full"
            />
          </div>
          <div>
            <h2 className="font-serif text-xl tracking-[0.06em] text-ink uppercase sm:text-2xl">
              Meet our founder: Ivy
            </h2>
            <div className="mt-6 space-y-4 text-[0.92rem] leading-relaxed text-ink-soft">
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
            <Link
              href="/about/"
              className="mt-7 inline-block text-[0.8rem] text-ink underline underline-offset-4 hover:opacity-60"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Latest work */}
      <section
        className="mx-auto max-w-[1400px] px-4 pt-24 sm:px-8"
        aria-labelledby="latest-heading"
      >
        <div className="flex items-end justify-between">
          <h2 id="latest-heading" className="font-serif text-2xl text-ink">
            Our Latest Work
          </h2>
          <Link href="/journal/weddings/" className="text-[0.78rem] text-ink-soft hover:underline">
            Go to blogs
          </Link>
        </div>
        <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {latest.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </>
  );
}
