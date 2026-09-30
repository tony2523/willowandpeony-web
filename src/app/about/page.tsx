import Link from "next/link";
import type { Metadata } from "next";
import Pic from "@/components/Pic";
import Eyebrow from "@/components/Eyebrow";
import CtaBand from "@/components/CtaBand";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Our Story — Ivy, Boutique Florist in Auckland",
  description:
    "Meet Ivy, founder of Willow & Peony. A boutique Auckland floral studio crafting romantic, modern and impactful floral design for weddings, events and special occasions.",
  path: "/about/",
  ogImage: "willow-and-peony-bouquet-ivy-willow-peony-copy-a677a82d-5fc6-4fcd-b72d-c0884402c2e5",
});

const bouquets = [
  { name: "a-person-holding-a-luxurious-flower-hat-box-with-a-variety-of-blooms-i", alt: "Luxurious flower hat box with protea, peonies and seasonal blooms" },
  { name: "willow-and-peony-bouquet-romantic-grace-09", alt: "Romantic pastel bouquet with garden roses" },
  { name: "willow-and-peony-bouquet-citrus-delight-06", alt: "Bright citrus-toned bouquet with seasonal flowers" },
  { name: "willow-and-peony-bouquet-florist-schoice01", alt: "Florist's choice arrangement with premium seasonal blooms" },
  { name: "willow-and-peony-bouquet-deluxe-floral-cake-10", alt: "Deluxe floral cake arrangement with fresh flowers" },
  { name: "willow-and-peony-bouquet-peach-serenade-05", alt: "Peach and cream hand-tied bouquet" },
  { name: "willow-and-peony-bouquet-pure-grace-05", alt: "Pure white bouquet with roses and orchids" },
  { name: "willow-and-peony-bouquet-oneofakind01", alt: "One-of-a-kind sculptural floral arrangement" },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Our Story", path: "/about/" },
        ])}
      />

      <section className="relative h-[52vh] min-h-[360px] w-full overflow-hidden">
        <Pic
          name="willow-and-peony-bouquet-scarlet-styled-shoot-2-copy"
          alt="Willow & Peony floral styling with rich romantic blooms"
          sizes="100vw"
          priority
          className="absolute inset-0 h-full w-full object-cover"
        />
      </section>

      <section className="mx-auto max-w-3xl px-4 pt-16 text-center sm:px-6">
        <h1 className="font-serif text-3xl leading-snug text-ink sm:text-4xl">Our Story</h1>
        <p className="mt-8 font-serif text-xl leading-relaxed text-ink">
          Welcome to Willow &amp; Peony, where every floral creation tells a story of elegance,
          creativity and a deep love for nature&rsquo;s beauty.
        </p>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-10 md:grid-cols-[2fr_3fr]">
          <div className="overflow-hidden">
            <Pic
              name="willow-and-peony-bouquet-ivy-willow-peony-copy-a677a82d-5fc6-4fcd-b72d-c0884402c2e5"
              alt="Ivy, founder of Willow & Peony, boutique florist in Auckland"
              sizes="(max-width: 768px) 100vw, 40vw"
              className="h-auto w-full"
            />
          </div>
          <div>
            <Eyebrow>The founder</Eyebrow>
            <h2 className="mt-4 font-serif text-3xl text-ink sm:text-4xl">
              Hi, I&rsquo;m Ivy — your florist
            </h2>
            <div className="mt-6 space-y-4 leading-relaxed text-ink-soft">
              <p>
                My passion for flowers blossomed back in 2012 with my first rose — the beautiful{" "}
                <em>Blue Moon</em> — planted in a small garden that quickly became my sanctuary.
                From that moment on, I knew flowers were more than decoration: they were a way to
                celebrate life&rsquo;s most meaningful moments.
              </p>
              <p>
                At Willow &amp; Peony, I&rsquo;m dedicated to crafting premium, bespoke floral
                designs that are as unique and refined as the people they&rsquo;re made for.
                Whether it&rsquo;s a wedding, an event or a custom arrangement, my mission is to
                create something that is not only visually stunning but deeply personal and
                meaningful.
              </p>
              <p>
                From classic blooms to artistic arrangements, Willow &amp; Peony offers more than
                flowers — it&rsquo;s an experience tailored to you, making every moment truly
                special.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/wedding-flowers-auckland/"
                className="border border-ink px-6 py-2.5 text-[0.78rem] tracking-[0.16em] uppercase text-ink transition-colors hover:bg-ink hover:text-ivory"
              >
                Wedding flowers
              </Link>
              <Link
                href="/journal/"
                className="border border-hairline px-6 py-2.5 text-[0.78rem] tracking-[0.16em] uppercase text-muted transition-colors hover:border-ink hover:text-ink"
              >
                See our work
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6" aria-label="Signature arrangements">
        <div className="columns-2 gap-4 md:columns-4 [&>*]:mb-4">
          {bouquets.map((b) => (
            <Pic
              key={b.name}
              name={b.name}
              alt={b.alt}
              sizes="(max-width: 768px) 50vw, 25vw"
              className="w-full break-inside-avoid"
            />
          ))}
        </div>
      </section>

      <CtaBand
        title="Thank you for dropping by"
        body="Whether it's a wedding, an event or a custom arrangement — we'd love to create something beautiful for you."
        buttonLabel="Get in touch"
        buttonHref="/contact/"
      />
    </>
  );
}
