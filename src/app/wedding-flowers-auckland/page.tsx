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
import GalleryFeature from "@/components/GalleryFeature";
import { featureImages } from "@/lib/gallery";

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
        image="wedding-flowers-auckland-hero-bouquet-and-rings"
        position="object-[55%_center] md:object-[50%_60%]"
        alt="Newlyweds' hands with wedding rings beside a pink, peach and ivory bridal bouquet by Willow & Peony"
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
      <section className="mx-auto mt-20 grid max-w-(--site-column) gap-10 px-5 sm:px-6 md:mt-28 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-20">
        <h2 className="display-2 text-ink">
          Weddings are deeply personal — <em>your flowers should be too.</em>
        </h2>
        <p className="max-w-[27.5rem] self-center text-[0.875rem] leading-[1.75] text-ink-soft">
          Based on Auckland&rsquo;s North Shore, Willow &amp; Peony is a boutique floral studio
          creating wedding flowers for couples across Auckland and beyond. We bring together
          seasonal blooms, unexpected textures and the details that matter to you.
        </p>
      </section>

      {/* Gallery — editorial teaser linking to the wedding gallery */}
      <GalleryFeature
        eyebrow="Wedding gallery"
        title={
          <>
            Bouquets, ceremonies and <em>receptions</em>
          </>
        }
        href="/gallery/"
        linkLabel="View the wedding gallery"
        images={featureImages([
          "gallery-claire-dan-allely-estate-09",
          "gallery-amanda-bryan-hotel-britomart-02",
          "gallery-claire-dan-allely-estate-11",
          "gallery-yue-vern-bridgewater-estate-10",
          "gallery-auckland-city-wedding-03",
          "gallery-kaelan-tongtong-st-matthew-in-the-city-07",
          "gallery-auckland-city-wedding-08",
          "gallery-leah-riley-private-venue-02",
          "gallery-amanda-bryan-hotel-britomart-03",
        ])}
      />

      {/* The process — moved up, starts with the calculator */}
      <section className="mx-auto mt-24 max-w-(--site-column) px-5 sm:px-6 md:mt-[8.75rem]">
        <ProcessSteps />
      </section>

      {/* Wedding flower calculator — paper split (replaces the packages split) */}
      <section className="mt-24 bg-paper md:mt-[8.75rem]">
        <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] 2xl:mx-auto 2xl:max-w-(--site-column) 2xl:gap-16 2xl:px-6">
          <div className="order-2 flex flex-col justify-center px-5 py-14 sm:px-10 md:order-1 md:px-16 md:py-20 2xl:px-0">
            <p className="eyebrow text-muted">Wedding flower calculator</p>
            <h2 className="display-3 mt-3 text-ink">
              See what your flowers <em>could cost</em>
            </h2>
            <p className="mt-5 max-w-[30rem] text-[0.9375rem] leading-[1.7] font-light text-ink-soft">
              Choose a floral tier, add the pieces you&rsquo;d love and see an itemised estimate as
              you go, from your bouquet to ceremony and reception flowers. When it feels right,
              send it to Ivy and she&rsquo;ll shape it into a personal proposal.
            </p>
            <div className="mt-8">
              <Link href="/wedding-flower-calculator/" className="btn-solid">
                Estimate your flowers
              </Link>
            </div>
            <p className="mt-5 text-[0.8125rem] text-muted">
              Full-service wedding design starts from {money(FULL_SERVICE_FROM)}. Vase and plinth
              hire is included.
            </p>
          </div>
          <div className="order-1 grid grid-cols-3 gap-2 px-5 pt-10 sm:gap-3 sm:px-10 md:order-2 md:px-16 md:py-20 2xl:px-0">
            {calculatorStyles.map((t) => (
              <figure key={t.name}>
                <Pic
                  name={t.photo}
                  alt={`${t.name} tier bridal bouquet by Willow & Peony`}
                  sizes="(max-width: 768px) 33vw, 220px"
                  aspect="4/5"
                  className="h-auto w-full object-cover"
                />
                <figcaption className="mt-2.5 text-[0.65625rem] tracking-[0.14em] text-muted uppercase">
                  {t.name}
                  <span className="mt-0.5 block text-[0.75rem] tracking-normal normal-case">
                    Bridal bouquet from {t.from}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Fully bespoke — split */}
      <section className="mt-24 md:mt-[8.75rem]">
        {/* Inside the site column at every width; the photo stays portrait (see CLAUDE.md). */}
        <div className="mx-auto grid max-w-(--site-column) items-center gap-10 px-5 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-12 lg:gap-16">
          <div className="@container">
          <Pic
            name="gallery-claire-dan-allely-estate-01"
            alt="Bespoke ceremony installation of anthuriums, gerberas, delphiniums and grasses at Allely Estate by Willow & Peony"
            sizes="(max-width: 768px) 100vw, 50vw"
            className="h-[clamp(110cqw,calc(100svh-8rem),125cqw)] w-full object-cover object-[50%_62%]"
          />
          </div>
          <div className="flex flex-col justify-center">
            <p className="eyebrow text-muted">Fully bespoke</p>
            <h2 className="display-3 mt-3 text-ink">Designed entirely around you</h2>
            <p className="mt-5 max-w-[30rem] text-[0.9375rem] leading-[1.7] font-light text-ink-soft">
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
        className="mt-24 border-t border-hairline bg-paper px-5 py-16 sm:px-6 md:mt-[8.75rem] md:py-24"
      >
        <TestimonialSlider kind="wedding" />
      </section>

      {/* Recent celebrations */}
      <div className="mt-24 md:mt-[8.75rem]">
        <LatestWork
          posts={posts}
          eyebrow="Real weddings"
          title="Recent celebrations"
          href="/work/?type=weddings"
        />
      </div>

      {/* Editorial copy — two columns, as on the design */}
      <section className="mx-auto mt-24 grid max-w-[67.5rem] gap-14 px-5 sm:px-6 md:mt-[8.75rem] md:grid-cols-2 md:gap-20">
        <div>
          <h2 className="display-3 text-ink">Premium wedding floral styling</h2>
          <div className="mt-6 space-y-4 text-[0.9375rem] leading-[1.75] font-light text-ink-soft">
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
          <div className="mt-6 space-y-4 text-[0.9375rem] leading-[1.75] font-light text-ink-soft">
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
      <section id="enquire" className="mt-24 scroll-mt-24 border-t border-hairline bg-paper md:mt-[8.75rem]">
        <div className="mx-auto max-w-[51.25rem] px-5 py-16 sm:px-6 md:py-24">
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
