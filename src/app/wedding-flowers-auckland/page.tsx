import Link from "next/link";
import type { Metadata } from "next";
import Pic from "@/components/Pic";
import Hero from "@/components/Hero";
import EnquiryForm from "@/components/EnquiryForm";
import JsonLd from "@/components/JsonLd";
import LatestWork from "@/components/LatestWork";
import ProcessSteps from "@/components/ProcessSteps";
import TestimonialSlider from "@/components/TestimonialSlider";
import { pageMetadata, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { getPostsByCategory } from "@/lib/journal";
import { weddingPackages } from "../../../content/site";

export const metadata: Metadata = pageMetadata({
  title: "Wedding Florist Auckland | Bridal Flowers",
  description:
    "Boutique Auckland wedding florist. Romantic bridal bouquets, ceremony and reception flowers, with curated packages from $500 or fully bespoke design.",
  path: "/wedding-flowers-auckland/",
  ogImage: "wedding-flowers-auckland-new-zealand-auckland-wedding-photographer-cbd-271",
});

const gallery = [
  { name: "wedding-flowers-auckland-new-zealand-auckland-wedding-photographer-cbd-271", alt: "Bridal bouquet with soft peach and cream roses, Auckland wedding" },
  { name: "wedding-flowers-auckland-img-3926", alt: "Romantic ceremony arrangement with garden roses and orchids" },
  { name: "wedding-flowers-auckland-new-zealand-auckland-wedding-photographer-cbd-emma-443", alt: "Bride holding a joyful pastel bouquet in Auckland city" },
  { name: "wedding-flowers-auckland-dsc03988", alt: "Sculptural white and blush wedding flowers on a plinth" },
  { name: "wedding-flowers-auckland-willowandpeony-1-13", alt: "Bud vases and candles styled for a wedding reception" },
  { name: "wedding-flowers-auckland-scarlet-style-shoot20", alt: "Rich crimson wedding styling at The Narrows Landing" },
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

      <Hero
        image="auckland-bridal-party-blush-bouquets-hero"
        position="object-[50%_62%] md:object-center"
        alt="Bridal party with blush and ivory wedding bouquets by Willow & Peony"
        eyebrow="Wedding florals · Auckland"
        title={
          <>
            Flowers that feel like <em>the way you love</em>
          </>
        }
        intro="Romantic, timeless wedding flowers for ceremonies and receptions across Auckland — curated packages or fully bespoke design."
        cta={{ label: "Check your date", href: "#enquire" }}
      />

      {/* Intro */}
      <section className="mx-auto mt-20 grid max-w-[1280px] gap-10 px-5 sm:px-6 md:mt-28 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-20">
        <h2 className="display-2 text-ink">
          Weddings are deeply personal — <em>your flowers should be too.</em>
        </h2>
        <p className="max-w-[440px] self-center text-[14px] leading-[1.75] text-ink-soft">
          At Willow &amp; Peony, we believe flowers should feel as magical as the moment you say
          &ldquo;I do.&rdquo; Based on Auckland&rsquo;s North Shore, we are a boutique wedding
          florist specialising in romantic, modern arrangements for weddings and intimate
          celebrations across Auckland.
        </p>
      </section>

      {/* Gallery strip */}
      <section aria-label="Wedding flowers gallery" className="mt-24 md:mt-[140px]">
        <p className="eyebrow px-5 text-center text-muted sm:px-6">
          Bouquets · Ceremony · Reception · Installations
        </p>
        <div className="carousel mt-8 gap-3 px-5 sm:px-6">
          {gallery.map((g) => (
            <Pic
              key={g.name}
              name={g.name}
              alt={g.alt}
              sizes="(max-width: 640px) 78vw, 380px"
              aspect="4/5"
              className="h-auto w-[78vw] object-cover sm:w-[380px]"
            />
          ))}
        </div>
      </section>

      {/* Curated packages — paper split */}
      <section className="mt-24 bg-paper md:mt-[140px]">
        <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="order-2 flex flex-col justify-center px-5 py-14 sm:px-10 md:order-1 md:px-16 md:py-20">
            <p className="eyebrow text-muted">Curated packages</p>
            <h2 className="display-3 mt-3 text-ink">The essentials, beautifully handled</h2>
            <p className="mt-5 max-w-[480px] text-[15px] leading-[1.7] font-light text-ink-soft">
              Three thoughtfully designed tiers — Petite, Classic and Luxe — covering everything
              from your bouquet to ceremony and reception styling, from $500 to $5,000. Perfect
              for couples who want beautiful blooms without the overwhelm.
            </p>
            <Link href="/wedding-flower-packages/" className="t-link mt-8 self-start text-ink">
              Explore packages &amp; pricing
            </Link>
          </div>
          <Pic
            name="wedding-flower-package-auckland-scarlet-style-shoot22"
            alt="Curated wedding package styling by Willow & Peony"
            sizes="(max-width: 768px) 100vw, 50vw"
            className="order-1 h-full max-h-[700px] w-full object-cover md:order-2"
          />
        </div>
      </section>

      {/* Fully bespoke — split */}
      <section className="mt-24 md:mt-[140px]">
        <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Pic
            name="wedding-flowers-auckland-scarlet-style-shoot4"
            alt="Bespoke crimson and blush bridal bouquet by Willow & Peony"
            sizes="(max-width: 768px) 100vw, 50vw"
            className="h-full max-h-[700px] w-full object-cover"
          />
          <div className="flex flex-col justify-center px-5 py-14 sm:px-10 md:px-16 md:py-20">
            <p className="eyebrow text-muted">Fully bespoke</p>
            <h2 className="display-3 mt-3 text-ink">Designed entirely around you</h2>
            <p className="mt-5 max-w-[480px] text-[15px] leading-[1.7] font-light text-ink-soft">
              For couples dreaming of something entirely unique, our bespoke service offers a
              fully customised floral experience. We work closely with you — and your planner or
              stylist — to design intentional, artful arrangements tailored to your vision, venue
              and priorities, from dramatic installations to delicate floral details.
            </p>
            <Link href="#enquire" className="t-link mt-8 self-start text-ink">
              Tell us your vision
            </Link>
          </div>
        </div>
      </section>

      {/* The process */}
      <section className="mx-auto mt-24 max-w-[1280px] px-5 sm:px-6 md:mt-[140px]">
        <ProcessSteps />
      </section>

      {/* Reviews slider */}
      <section
        aria-label="Couples' reviews"
        className="mt-24 border-t border-hairline bg-paper px-5 py-16 sm:px-6 md:mt-[140px] md:py-24"
      >
        <TestimonialSlider kind="wedding" />
      </section>

      {/* Recent celebrations */}
      <div className="mt-24 md:mt-[140px]">
        <LatestWork
          posts={posts}
          eyebrow="The journal"
          title="Recent celebrations"
          href="/work/?type=weddings"
        />
      </div>

      {/* SEO copy — the page's full editorial text, kept content-rich */}
      <section className="mx-auto mt-24 max-w-[760px] px-5 sm:px-6 md:mt-[140px]">
        <h2 className="display-3 text-ink">Premium wedding floral styling</h2>
        <div className="mt-6 space-y-4 text-[15px] leading-[1.75] font-light text-ink-soft">
          <p>
            Our work is soft, feminine, and artfully composed — blending premium seasonal blooms
            with unexpected textural details to create wedding flowers that feel uniquely yours.
            Thoughtful. Romantic. Timeless.
          </p>
          <p>
            Every couple is different — and so is every wedding we design. We take a boutique,
            collaborative approach, starting with a deep understanding of your style, vision, and
            priorities. Our floral designs are created with heart, artistry, and a touch of the
            unexpected, ensuring your flowers feel as special as the day itself.
          </p>
          <p>
            Whether you choose one of our{" "}
            <Link href="/wedding-flower-packages/" className="underline underline-offset-2">
              wedding flower packages
            </Link>{" "}
            or a fully bespoke design, each commission includes Ivy&rsquo;s design time and premium
            seasonal sourcing — and our Classic and Luxe packages add consultation, a full design
            proposal, delivery, setup and next-day pack-out anywhere in Auckland. Browse our{" "}
            <Link href="/venues/" className="underline underline-offset-2">
              venue guides
            </Link>{" "}
            to see what works beautifully at Auckland&rsquo;s loveliest wedding venues.
          </p>
        </div>
      </section>

      {/* Enquiry — paper band with the full wedding form */}
      <section id="enquire" className="mt-24 scroll-mt-24 border-t border-hairline bg-paper md:mt-[140px]">
        <div className="mx-auto max-w-[820px] px-5 py-16 sm:px-6 md:py-24">
          <div className="text-center">
            <p className="eyebrow text-muted">Check your date</p>
            <h2 className="display-3 mt-3 text-ink">Tell us about your day</h2>
          </div>
          <div className="mt-10">
            <EnquiryForm kind="wedding" />
          </div>
        </div>
      </section>
    </>
  );
}
