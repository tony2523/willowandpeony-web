import Link from "next/link";
import Pic from "@/components/Pic";
import type { FeatureImage } from "@/lib/gallery";

/**
 * Editorial gallery teaser (home, Weddings, Events): nine photos in an
 * asymmetric mosaic, almost edge to edge like the gallery page, linking to
 * the matching gallery filter. The mosaic is half as tall as it is wide
 * (square on phones), capped at the window height less the header and
 * heading, so the heading and every photo fit in one view.
 * Laptops and tablets: 12 columns by 6 rows. Phones: three columns, the
 * lead photo two by two and five square ones (the last three photos are
 * left out so the section is three rows and fits one phone screen).
 * Slot shapes, in order: portrait, landscape, landscape, portrait, portrait,
 * portrait, landscape, portrait, portrait. Pick photos to match.
 */
const SLOTS = [
  { cls: "col-span-2 row-span-2 md:col-[1/4] md:row-[1/5]", sizes: "(max-width: 767px) 67vw, 25vw" },
  { cls: "md:col-[1/4] md:row-[5/7]", sizes: "(max-width: 767px) 33vw, 25vw" },
  { cls: "md:col-[4/8] md:row-[1/4]", sizes: "(max-width: 767px) 33vw, 34vw" },
  { cls: "md:col-[4/6] md:row-[4/7]", sizes: "(max-width: 767px) 33vw, 17vw" },
  { cls: "md:col-[6/8] md:row-[4/7]", sizes: "(max-width: 767px) 33vw, 17vw" },
  { cls: "md:col-[8/11] md:row-[1/5]", sizes: "(max-width: 767px) 33vw, 25vw" },
  { cls: "max-md:hidden md:col-[8/11] md:row-[5/7]", sizes: "(max-width: 767px) 33vw, 25vw" },
  { cls: "max-md:hidden md:col-[11/13] md:row-[1/4]", sizes: "(max-width: 767px) 33vw, 17vw" },
  { cls: "max-md:hidden md:col-[11/13] md:row-[4/7]", sizes: "(max-width: 767px) 33vw, 17vw" },
];

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
          {images.slice(0, SLOTS.length).map((img, i) => (
            <Link
              key={img.name}
              href={href}
              className={`group relative block overflow-hidden bg-paper ${SLOTS[i].cls}`}
            >
              <Pic
                name={img.name}
                alt={img.alt}
                sizes={SLOTS[i].sizes}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
