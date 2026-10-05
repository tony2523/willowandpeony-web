import { getImage, imageSrc, imageSrcSet } from "@/lib/images";

/**
 * Banner photo. Phones held upright get the pipeline's portrait
 * "<name>-mobile" crop (see scripts/optimize-images.mjs HERO), so they load
 * a fraction of the bytes at the same sharpness; everything else gets the
 * full photo. Banners without a crop fall back to the plain image.
 */
export default function HeroImage({
  name,
  alt,
  sizes,
  mobileSizes,
  className = "",
}: {
  name: string;
  alt: string;
  /** Drawn width of the full photo (object-cover banners are often wider than the screen). */
  sizes: string;
  /** Drawn width of the 3:5 phone crop. */
  mobileSizes: string;
  className?: string;
}) {
  const entry = getImage(name);
  if (!entry) return null;
  const mobile = getImage(`${name}-mobile`);
  return (
    <picture>
      {mobile && (
        <source
          media="(max-width: 767px) and (orientation: portrait)"
          srcSet={imageSrcSet(`${name}-mobile`)}
          sizes={mobileSizes}
          width={mobile.w}
          height={mobile.h}
        />
      )}
      <img
        src={imageSrc(name, 1600)}
        srcSet={imageSrcSet(name)}
        sizes={sizes}
        width={entry.w}
        height={entry.h}
        alt={alt}
        fetchPriority="high"
        decoding="async"
        className={className}
      />
    </picture>
  );
}
