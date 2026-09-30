import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import GalleryLightbox from "@/components/GalleryLightbox";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { getGalleryItems } from "@/lib/gallery";
import { site } from "../../../content/site";

export const metadata: Metadata = pageMetadata({
  title: "Gallery | Wedding & Event Flowers Auckland",
  description:
    "A portfolio of Willow & Peony's wedding and event floral design across Auckland — bridal bouquets, ceremony installations, reception styling and corporate florals.",
  path: "/gallery/",
});

export default function GalleryPage() {
  const items = getGalleryItems();
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Gallery", path: "/gallery/" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": `${site.domain}/gallery/#page`,
            name: "Willow & Peony Gallery",
            description:
              "Portfolio of wedding and event floral design across Auckland by Willow & Peony.",
            url: `${site.domain}/gallery/`,
          },
        ]}
      />

      <section className="mx-auto mt-16 max-w-[1280px] px-5 sm:px-6 md:mt-24">
        <p className="eyebrow text-muted">Gallery</p>
        <h1 className="display-1 mt-3 text-ink">
          A portfolio of <em>love and light</em>
        </h1>
        <p className="mt-5 max-w-[560px] text-[15px] leading-[1.7] font-light text-ink-soft">
          Every image below is our own work, photographed at real weddings and events across
          Auckland. Tap any image to view it full screen.
        </p>
      </section>

      <section className="mx-auto mt-12 max-w-[1280px] px-5 sm:px-6 md:mt-16">
        <GalleryLightbox items={items} />
      </section>

      <section className="mt-24 border-t border-hairline bg-paper md:mt-[140px]">
        <div className="mx-auto flex max-w-[900px] flex-col items-center px-5 py-16 text-center sm:py-20">
          <p className="eyebrow text-muted">Love what you see?</p>
          <h2 className="display-3 mt-4 text-ink">
            Let&rsquo;s create this for <em>your day</em>
          </h2>
          <div className="mt-8">
            <Link href="/contact/" className="btn-solid">
              Start an enquiry
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
