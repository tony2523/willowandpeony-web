import Link from "next/link";
import type { Metadata } from "next";
import Pic from "@/components/Pic";
import PageHero from "@/components/PageHero";
import PostCard from "@/components/PostCard";
import EnquiryForm from "@/components/EnquiryForm";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { getPostsByCategory } from "@/lib/journal";
import { weddingPackages } from "../../../content/site";

export const metadata: Metadata = pageMetadata({
  title: "Wedding Flower Packages & Pricing Auckland",
  description:
    "Curated wedding flower packages from a boutique Auckland florist: Petite $500, Classic $2,500 and Luxe $5,000. Bouquets, ceremony and reception styling — transparent pricing, stress-free planning.",
  path: "/wedding-flower-packages/",
  ogImage: "wedding-flower-package-auckland-image-41-copy",
});

export default function PackagesPage() {
  const posts = getPostsByCategory("weddings").slice(0, 3);
  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd({
            name: "Wedding Flower Packages",
            description:
              "Curated wedding floral packages for Auckland weddings — three tiers covering bouquets, buttonholes, ceremony and reception styling.",
            path: "/wedding-flower-packages/",
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
            { name: "Wedding Flower Packages", path: "/wedding-flower-packages/" },
          ]),
        ]}
      />

      <PageHero
        image="wedding-flower-package-auckland-image-41-copy"
        alt="Romantic wedding reception styling with flowers and candles in Auckland"
        title="Wedding Packages"
      />

      {/* Intro (measured: label line + 28.6 heading + centred 608px copy) */}
      <section className="mx-auto mt-[88px] max-w-[640px] px-5 text-center sm:px-6">
        <p className="label text-ink-soft">Effortless. Romantic. Unforgettable.</p>
        <h2 className="h-page mt-3 text-ink">Beautiful wedding flowers, stress-free.</h2>
        <div className="mx-auto mt-6 max-w-[580px] space-y-4 text-[15px] leading-[1.4] text-ink">
          <p>Planning your wedding should feel joyful, not overwhelming.</p>
          <p>
            At Willow &amp; Peony, our curated wedding floral packages make it effortless to
            achieve a cohesive, romantic look across your entire day.
          </p>
          <p>
            From your bouquet to ceremony features and reception styling, each package is
            thoughtfully designed to deliver premium, artful florals that feel seamless, elegant,
            and unforgettable. Explore below.
          </p>
        </div>
      </section>

      {/* Package rows — alternating image (321×418) and 501px text column */}
      {weddingPackages.map((pkg, i) => (
        <section key={pkg.name} className="mx-auto mt-[88px] max-w-[980px] px-5 sm:px-6">
          <div
            className={`flex flex-col items-center gap-10 md:gap-16 ${
              i % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"
            }`}
          >
            <div className="w-full max-w-[321px] shrink-0">
              <Pic
                name={pkg.image}
                alt={`${pkg.name} wedding flower package by Willow & Peony`}
                sizes="321px"
                aspect="321/418"
                className="h-auto w-full"
              />
            </div>
            <div className="max-w-[501px]">
              <h2 className="h-card text-ink">
                {pkg.name} Package - {pkg.price}
              </h2>
              <p className="mt-3 text-[15px] leading-[1.4] text-ink">{pkg.ideal}</p>
              <p className="mt-4 text-[15px] text-ink">Includes:</p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[15px] leading-[1.4] text-ink">
                {pkg.includes.map((inc) => (
                  <li key={inc}>{inc}</li>
                ))}
              </ul>
              {pkg.options && (
                <>
                  <p className="mt-4 text-[15px] text-ink">
                    <strong className="font-normal">Choose one styling option:</strong>
                  </p>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[15px] leading-[1.4] text-ink">
                    {pkg.options.map((o) => (
                      <li key={o.label}>
                        <strong className="font-normal">{o.label}:</strong> {o.items.join(", ")}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {pkg.note && (
                <p className="mt-4 text-[13px] italic leading-[1.4] text-ink-soft">* {pkg.note}</p>
              )}
            </div>
          </div>
        </section>
      ))}

      {/* Latest work */}
      <section className="mt-[88px] px-5 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="h-page text-ink">Our Latest Work</h2>
          <Link href="/journal/weddings/" className="link-text text-ink">
            View All
          </Link>
        </div>
        <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {/* Enquiry */}
      <section id="enquire" className="mx-auto mt-[88px] max-w-[720px] scroll-mt-24 px-5 sm:px-6">
        <div className="text-center">
          <h2 className="h-page text-ink">Ready to bring your vision to life—bloom by bloom?</h2>
          <p className="mx-auto mt-4 max-w-[580px] text-[15px] leading-[1.4] text-ink-soft">
            We&rsquo;d love to hear more about your day — your style, your venue, your dream
            florals. Simply fill out the form below to get started!
          </p>
        </div>
        <div className="mt-10">
          <EnquiryForm kind="wedding" />
        </div>
      </section>
    </>
  );
}
