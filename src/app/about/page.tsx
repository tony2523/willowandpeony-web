import type { Metadata } from "next";
import Pic from "@/components/Pic";
import PageHero from "@/components/PageHero";
import Gallery from "@/components/Gallery";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { site } from "../../../content/site";

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
  { name: "willow-and-peony-bouquet-pink-blossom-large-05", alt: "Pink blossom bouquet with premium roses" },
  { name: "willow-and-peony-bouquet-deluxe-floral-cake-09", alt: "Fresh floral cake with garden roses" },
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

      <PageHero
        image="willow-and-peony-bouquet-scarlet-styled-shoot-2-copy"
        alt="Willow & Peony floral styling with rich romantic blooms"
        title="Our Story"
        intro="Welcome to Willow & Peony, where every floral creation tells a story of elegance, creativity, and a deep love for nature's beauty."
      />

      {/* Half-bleed image with text (measured: 720px image, 520px text col) */}
      <section className="mt-[2px] flex flex-col md:flex-row">
        <div className="w-full md:w-1/2">
          <Pic
            name="willow-and-peony-bouquet-ivy-willow-peony-copy-a677a82d-5fc6-4fcd-b72d-c0884402c2e5"
            alt="Ivy, founder of Willow & Peony, boutique florist in Auckland"
            sizes="(max-width: 768px) 100vw, 50vw"
            aspect="720/900"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex w-full items-center justify-center px-5 py-14 sm:px-6 md:w-1/2 md:py-0">
          <div className="max-w-[520px]">
            <h2 className="h-page text-ink">Hi I&rsquo;m Ivy, your florist</h2>
            <div className="mt-6 space-y-4 text-[15px] leading-[1.4] text-ink">
              <p>
                My passion for flowers blossomed back in 2012 with my first rose, the beautiful{" "}
                <em>Blue Moon</em>, planted in a small garden that quickly became my sanctuary.
                From that moment on, I knew flowers were more than just decoration—they were a
                way to celebrate life&rsquo;s most meaningful moments.
              </p>
              <p>
                At Willow &amp; Peony, I am dedicated to crafting premium, bespoke floral designs
                that are as unique and refined as the people they&rsquo;re made for. Whether
                you&rsquo;re looking for a stunning bouquet or a custom floral arrangement, my
                mission is to create something that is not only visually stunning but also deeply
                personal and meaningful. With a focus on luxury and personalised service, I aim
                to provide floral creations that bring joy and beauty to every occasion.
              </p>
              <p>
                From classic blooms to artistic arrangements, Willow &amp; Peony offers more than
                just flowers—I offer an experience tailored to you, making every moment with our
                creations truly special.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bouquet strip — horizontal carousel, ~4 slides per view (measured 331×425) */}
      <div className="mt-[88px]">
        <Gallery images={bouquets} perView={4} />
      </div>

      {/* Sign-off */}
      <section className="mx-auto mt-[88px] max-w-[608px] px-5 text-center sm:px-6">
        <h2 className="h-card text-ink">Thank you for dropping by</h2>
        <p className="mt-4 text-[15px] leading-[1.4] text-ink">
          Whether it&rsquo;s a wedding, an event or a custom arrangement, we&rsquo;d love to
          create something beautiful for you. Email{" "}
          <a href={`mailto:${site.email}`} className="underline underline-offset-2">
            {site.email}
          </a>{" "}
          or get in touch through our contact page.
        </p>
      </section>
    </>
  );
}
