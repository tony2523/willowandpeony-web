import Link from "next/link";
import type { Metadata } from "next";
import Pic from "@/components/Pic";
import PostCard from "@/components/PostCard";
import CtaBand from "@/components/CtaBand";
import Eyebrow from "@/components/Eyebrow";
import { pageMetadata } from "@/lib/seo";
import { getPosts } from "@/lib/journal";
import { site } from "../../content/site";

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
    blurb: "Bouquets, ceremony and reception styling for romantic, timeless celebrations.",
  },
  {
    label: "Private Events",
    href: "/event-flowers-auckland/",
    image: "willow-and-peony-florist-auckland-willowandpeony-1-217",
    alt: "Sculptural floral arrangement styled for a private celebration",
    blurb: "Milestones, dinners and celebrations, styled with atmosphere and intent.",
  },
  {
    label: "Corporate Events",
    href: "/event-flowers-auckland/",
    image: "event-flowers-auckland-dsc03608-2",
    alt: "Statement corporate event flowers at an Auckland venue",
    blurb: "Launches, galas and conferences with florals that carry your brand.",
  },
];

export default function HomePage() {
  const latest = getPosts().slice(0, 4);
  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="relative h-[72vh] min-h-[480px] w-full overflow-hidden">
          <Pic
            name="wedding-flowers-auckland-2c760fef1a83095d5abd94ee51e4041a"
            alt="Bridesmaids holding blush and ivory bouquets by Willow & Peony, Auckland"
            sizes="100vw"
            priority
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/10 to-ink/10" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-14 sm:px-6">
            <h1 className="max-w-2xl font-serif text-4xl leading-[1.1] text-ivory sm:text-5xl md:text-6xl">
              Artful florals for <em>beautifully considered</em> events
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-ivory/85 sm:text-base">
              Boutique floral styling for weddings, corporate events and beautifully hosted
              celebrations across Auckland — romantic, refined and quietly distinctive.
            </p>
            <div className="mt-7 flex flex-wrap gap-4">
              <Link
                href="/wedding-flowers-auckland/"
                className="bg-ivory px-7 py-3 text-[0.8rem] tracking-[0.16em] uppercase text-ink transition-opacity hover:opacity-85"
              >
                Wedding flowers
              </Link>
              <Link
                href="/event-flowers-auckland/"
                className="border border-ivory/60 px-7 py-3 text-[0.8rem] tracking-[0.16em] uppercase text-ivory transition-colors hover:border-ivory hover:bg-ivory/10"
              >
                Event flowers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <Eyebrow>Boutique florist · Auckland</Eyebrow>
        <span aria-hidden className="mx-auto mt-6 block h-px w-12 bg-rose/50" />
        <p className="mt-6 font-serif text-2xl leading-relaxed text-ink sm:text-[1.7rem]">
          Willow &amp; Peony designs flowers that complement your venue, elevate the atmosphere and
          make the day feel personal, polished and memorable.
        </p>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6" aria-labelledby="services-heading">
        <h2 id="services-heading" className="sr-only">
          What we do
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {services.map((s) => (
            <Link key={s.label + s.image} href={s.href} className="group block">
              <div className="overflow-hidden bg-blush">
                <Pic
                  name={s.image}
                  alt={s.alt}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  aspect="3/4"
                  className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="mt-5 font-serif text-xl text-ink group-hover:text-rose-deep">
                {s.label}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.blurb}</p>
              <p className="mt-3 text-[0.75rem] tracking-[0.18em] uppercase text-rose-deep">
                Learn more →
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Founder */}
      <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-10 bg-ivory-deep p-6 sm:p-10 md:grid-cols-[2fr_3fr] md:p-14">
          <div className="overflow-hidden">
            <Pic
              name="willow-and-peony-bouquet-ivy-willow-peony-copy-a677a82d-5fc6-4fcd-b72d-c0884402c2e5"
              alt="Ivy, founder and lead florist of Willow & Peony, holding a bouquet"
              sizes="(max-width: 768px) 100vw, 40vw"
              aspect="4/5"
              className="h-auto w-full"
            />
          </div>
          <div>
            <Eyebrow>Meet our founder</Eyebrow>
            <h2 className="mt-4 font-serif text-3xl text-ink sm:text-4xl">Ivy, your florist</h2>
            <p className="mt-5 leading-relaxed text-ink-soft">
              Willow &amp; Peony was born from a deep love of flowers and a passion for creating
              beauty through thoughtful, refined design. With years of experience across weddings,
              events and bespoke floral styling, Ivy brings an intuitive eye for colour, composition
              and atmosphere to every project.
            </p>
            <p className="mt-4 leading-relaxed text-ink-soft">
              Her signature style is romantic, artful and quietly distinctive — premium blooms and
              carefully layered palettes, composed into florals that feel elegant, memorable and
              deeply considered.
            </p>
            <Link
              href="/about/"
              className="mt-7 inline-block border border-ink px-6 py-2.5 text-[0.78rem] tracking-[0.16em] uppercase text-ink transition-colors hover:bg-ink hover:text-ivory"
            >
              Our story
            </Link>
          </div>
        </div>
      </section>

      {/* Latest work */}
      <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6" aria-labelledby="latest-heading">
        <div className="flex items-end justify-between">
          <div>
            <Eyebrow>The journal</Eyebrow>
            <h2 id="latest-heading" className="mt-3 font-serif text-3xl text-ink sm:text-4xl">
              Our latest work
            </h2>
          </div>
          <Link
            href="/journal/"
            className="hidden text-[0.78rem] tracking-[0.16em] uppercase text-rose-deep hover:text-ink sm:block"
          >
            View all →
          </Link>
        </div>
        <div className="mt-9 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {latest.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
        <Link
          href="/journal/"
          className="mt-10 block text-center text-[0.78rem] tracking-[0.16em] uppercase text-rose-deep sm:hidden"
        >
          View all →
        </Link>
      </section>

      <CtaBand
        title="Planning a wedding or event in Auckland?"
        body={`Tell us about your day and we'll come back to you within 1–2 business days. Or email ${site.email} — we'd love to hear your plans.`}
        buttonLabel="Start an enquiry"
        buttonHref="/contact/"
        secondaryLabel="Wedding packages"
        secondaryHref="/wedding-flower-packages/"
      />
    </>
  );
}
