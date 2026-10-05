import Link from "next/link";
import type { FeatureImage } from "@/lib/gallery";
import { MOSAIC, MOSAIC_VW } from "./mosaic";
import FeatureMosaic from "./FeatureMosaic";
import { getImage, imageSrc, imageSrcSet } from "@/lib/images";

/**
 * Editorial gallery teaser (home, Weddings, Events): nine photos in an
 * asymmetric mosaic, almost edge to edge like the gallery page. Tapping a
 * photo opens the lightbox; the heading link goes to the matching gallery. The mosaic is half as tall as it is wide
 * (square on phones), capped at the window height less the header and
 * heading, so the heading and every photo fit in one view.
 * Laptops and tablets: 12 columns by 6 rows. Phones: three columns, the
 * lead photo two by two and five square ones (the last three photos are
 * left out so the section is three rows and fits one phone screen).
 * Slot shapes, in order: portrait, landscape, landscape, portrait, portrait,
 * portrait, landscape, portrait, portrait. Pick photos to match.
 */
// Phones: three columns, the lead photo two by two, the last three left out.
const PHONE = ["col-span-2 row-span-2", "", "", "", "", "", "max-md:hidden", "max-md:hidden", "max-md:hidden"];
const SLOTS = MOSAIC.map((cls, i) => ({
  cls: `${PHONE[i]} ${cls}`,
  sizes: `(max-width: 767px) ${i === 0 ? "67vw" : "33vw"}, ${MOSAIC_VW[i]}`,
}));

export default function GalleryFeature({
  eyebrow,
  title,
  href,
  linkLabel,
  images,
}: {
  eyebrow: string;
  title: React.ReactNode;
  href: string;
  linkLabel: string;
  images: FeatureImage[];
}) {
  // Plain image data for the client tiles and lightbox (keeps the image manifest off the client).
  const tiles = images.flatMap((img) => {
    const entry = getImage(img.name);
    return entry
      ? [{ name: img.name, alt: img.alt, src: imageSrc(img.name, 960), srcSet: imageSrcSet(img.name), w: entry.w, h: entry.h }]
      : [];
  });
  return (
    <section aria-label={eyebrow} className="mt-24 md:mt-[8.75rem]">
      <div className="mx-auto flex max-w-(--site-column) flex-wrap items-end justify-between gap-x-10 gap-y-5 px-5 sm:px-6">
        <div>
          <p className="eyebrow text-muted">{eyebrow}</p>
          <h2 className="display-2 mt-3 text-ink">{title}</h2>
        </div>
        <Link href={href} className="t-link text-ink">
          {linkLabel}
        </Link>
      </div>
      <div className="mx-auto mt-8 max-w-[120rem] px-2 sm:px-4 md:mt-12 lg:px-6">
        <div className="grid aspect-square max-h-[calc(100svh-16rem)] w-full grid-cols-3 grid-rows-3 gap-1 sm:gap-2 md:aspect-[2/1] md:grid-cols-12 md:grid-rows-6 lg:gap-3">
          <FeatureMosaic images={tiles} slots={SLOTS} />
        </div>
      </div>
    </section>
  );
}
