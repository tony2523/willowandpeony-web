import Link from "next/link";
import Pic from "@/components/Pic";
import type { FeatureImage } from "@/lib/gallery";

/**
 * Editorial gallery teaser (home, Weddings, Events): five photos in an
 * asymmetric mosaic, almost edge to edge like the gallery page, linking to
 * the matching gallery filter. Laptops and up: a big portrait on the left,
 * two near-square shots stacked in the middle, a tall portrait over a small
 * landscape on the right. Phones: a big lead photo, then two by two.
 * Pick photos whose shape suits the slot: portrait, landscape, portrait,
 * landscape, landscape.
 */
const SLOTS = [
  { cls: "col-span-2 aspect-[4/5] md:aspect-auto md:col-[1/6] md:row-[1/7]", sizes: "(max-width: 767px) 100vw, 42vw" },
  { cls: "aspect-square md:aspect-auto md:col-[6/10] md:row-[1/4]", sizes: "(max-width: 767px) 50vw, 34vw" },
  { cls: "aspect-square md:aspect-auto md:col-[10/13] md:row-[1/5]", sizes: "(max-width: 767px) 50vw, 25vw" },
  { cls: "aspect-square md:aspect-auto md:col-[6/10] md:row-[4/7]", sizes: "(max-width: 767px) 50vw, 34vw" },
  { cls: "aspect-square md:aspect-auto md:col-[10/13] md:row-[5/7]", sizes: "(max-width: 767px) 50vw, 25vw" },
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
      <div className="mx-auto flex max-w-[80rem] flex-wrap items-end justify-between gap-x-10 gap-y-5 px-5 sm:px-6">
        <div>
          <p className="eyebrow text-muted">{eyebrow}</p>
          <h2 className="display-2 mt-3 text-ink">{title}</h2>
        </div>
        <Link href={href} className="t-link text-ink">
          {linkLabel}
        </Link>
      </div>
      <div className="mx-auto mt-10 max-w-[120rem] px-2 sm:px-4 md:mt-12 lg:px-6">
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:aspect-[3/2] md:grid-cols-12 md:grid-rows-6 lg:aspect-[16/9]">
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
