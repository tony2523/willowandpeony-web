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
import { TIERS, bridalFrom, money } from "@/lib/estimate";
import { FULL_SERVICE_FROM } from "../../../content/calculator";

const calculatorStyles = TIERS.map((t, i) => ({
  name: t.name,
  photo: `calculator-bridal-${t.name.toLowerCase()}-1`,
  from: money(bridalFrom(i) ?? 0),
}));

export const metadata: Metadata = pageMetadata({
  title: "Wedding Florist Auckland | Bridal Flowers",
  description:
    "Boutique Auckland wedding florist creating romantic, sculptural and artful wedding flowers. Estimate your bouquets and styling with our flower calculator.",
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
              "Bespoke wedding flowers and floral styling across Auckland: bridal bouquets, ceremony flowers and reception styling, with full-service wedding design from $2,500.",
            path: "/wedding-flowers-auckland/",
            serviceType: "Wedding florist",
            offers: [
              {
                name: "Full-service wedding floral design",
                price: FULL_SERVICE_FROM,
                description: "Starting price in NZD, excluding GST. Vase and plinth hire included.",
              },
            ],
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
            Wedding flowers, <em>designed around you</em>
          </>
        }
        intro="Romantic, sculptural and artful flowers for your wedding day, from intimate elopements to full ceremony and reception styling."
        cta={{ label: "Estimate your flowers", href: "/wedding-flower-calculator/" }}
        secondaryCta={{ label: "Start an enquiry", href: "#enquire" }}
      />

      {/* Intro */}
      <section className="mx-auto mt-20 grid max-w-[1280px] gap-10 px-5 sm:px-6 md:mt-28 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-20">
        <h2 className="display-2 text-ink">
          Weddings are deeply personal — <em>your flowers should be too.</em>
        </h2>
        <p className="max-w-[440px] self-center text-[14px] leading-[1.75] text-ink-soft">
          Based on Auckland&rsquo;s North Shore, Willow &amp; Peony is a boutique floral studio
          creating wedding flowers for couples across Auckland and beyond. We bring together
          seasonal blooms, unexpected textures and the details that matter to you.
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

      {/* The process — moved up, starts with the calculator */}
      <section className="mx-auto mt-24 max-w-[1280px] px-5 sm:px-6 md:mt-[140px]">
        <ProcessSteps />
      </section>

      {/* Wedding flower calculator — paper split (replaces the packages split) */}
      <section className="mt-24 bg-paper md:mt-[140px]">
        <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="order-2 flex flex-col justify-center px-5 py-14 sm:px-10 md:order-1 md:px-16 md:py-20">
            <p className="eyebrow text-muted">Wedding flower calculator</p>
            <h2 className="display-3 mt-3 text-ink">
              See what your flowers <em>could cost</em>
            </h2>
            <p className="mt-5 max-w-[480px] text-[15px] leading-[1.7] font-light text-ink-soft">
              Choose a floral tier, add the pieces you&rsquo;d love and see an itemised estimate as
              you go, from your bouquet to ceremony and reception flowers. When it feels right,
              send it to Ivy and she&rsquo;ll shape it into a personal proposal.
            </p>
            <div className="mt-8">
              <Link href="/wedding-flower-calculator/" className="btn-solid">
                Estimate your flowers
              </Link>
            </div>
            <p className="mt-5 text-[13px] text-muted">
              Full-service wedding design starts from {money(FULL_SERVICE_FROM)}. Vase and plinth
              hire is included.
            </p>
          </div>
          <div className="order-1 grid grid-cols-3 gap-2 px-5 pt-10 sm:gap-3 sm:px-10 md:order-2 md:px-16 md:py-20">
            {calculatorStyles.map((t) => (
              <figure key={t.name}>
                <Pic
                  name={t.photo}
                  alt={`${t.name} tier bridal bouquet by Willow & Peony`}
                  sizes="(max-width: 768px) 33vw, 220px"
                  aspect="4/5"
                  className="h-auto w-full object-cover"
                />
                <figcaption className="mt-2.5 text-[10.5px] tracking-[0.14em] text-muted uppercase">
                  {t.name}
                  <span className="mt-0.5 block text-[12px] tracking-normal normal-case">
                    Bridal bouquet from {t.from}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
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
          eyebrow="Real weddings"
          title="Recent celebrations"
          href="/work/?type=weddings"
        />
      </div>

      {/* Editorial copy — two columns, as on the design */}
      <section className="mx-auto mt-24 grid max-w-[1080px] gap-14 px-5 sm:px-6 md:mt-[140px] md:grid-cols-2 md:gap-20">
        <div>
          <h2 className="display-3 text-ink">Premium wedding floral styling</h2>
          <div className="mt-6 space-y-4 text-[15px] leading-[1.75] font-light text-ink-soft">
            <p>
              At Willow &amp; Peony, we believe flowers should feel as magical as the moment you
              say &ldquo;I do.&rdquo; We create wedding flowers shaped around your ideas and your
              venue. We love seasonal blooms, interesting textures and an unexpected detail or
              two. From your bridal bouquet to ceremony and reception flowers, we work with you to
              bring it all together.
            </p>
            <p>
              Start with our{" "}
              <Link href="/wedding-flower-calculator/" className="underline underline-offset-2">
                flower calculator
              </Link>{" "}
              for an itemised estimate, or simply tell us about your day. Full-service wedding
              design starts from {money(FULL_SERVICE_FROM)} and includes Ivy&rsquo;s design time,
              premium seasonal sourcing and every vase and plinth. Browse our{" "}
              <Link href="/venues/" className="underline underline-offset-2">
                venue guides
              </Link>{" "}
              to see what works beautifully at Auckland&rsquo;s loveliest wedding venues.
            </p>
          </div>
        </div>
        <div>
          <h2 className="display-3 text-ink">Why couples choose us</h2>
          <div className="mt-6 space-y-4 text-[15px] leading-[1.75] font-light text-ink-soft">
            <p>
              Every couple is different — and so is every wedding we design. We take a boutique,
              collaborative approach, starting with a deep understanding of your style, vision,
              and priorities. Our floral designs are created with heart, artistry, and a touch of
              the unexpected, ensuring your flowers feel as special as the day itself.
            </p>
            <p>
              Where the designs and timing allow, we also love finding ways to repurpose your
              flowers wherever possible, helping you make the most of them throughout your day.{" "}
              <Link
                href="/journal/repurposing-ceremony-flowers-reception/"
                className="underline underline-offset-2"
              >
                How we repurpose ceremony flowers
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Enquiry — paper band with the full wedding form */}
      <section id="enquire" className="mt-24 scroll-mt-24 border-t border-hairline bg-paper md:mt-[140px]">
        <div className="mx-auto max-w-[820px] px-5 py-16 sm:px-6 md:py-24">
          <div className="text-center">
            <p className="eyebrow text-muted">Start an enquiry</p>
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
