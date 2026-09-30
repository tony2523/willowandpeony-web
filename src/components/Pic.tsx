import { getImage, imageSrc, imageSrcSet } from "@/lib/images";

type Props = {
  name: string;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
  aspect?: string; // e.g. "3/4" — crops via CSS
};

/**
 * Responsive <img> backed by the pre-generated WebP variants.
 * Emits width/height (no CLS), lazy-loads by default.
 */
export default function Pic({
  name,
  alt,
  sizes = "100vw",
  className = "",
  priority = false,
  aspect,
}: Props) {
  const entry = getImage(name);
  if (!entry) return null;
  return (
    <img
      src={imageSrc(name, 960)}
      srcSet={imageSrcSet(name)}
      sizes={sizes}
      width={entry.w}
      height={entry.h}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding={priority ? "sync" : "async"}
      className={className}
      style={aspect ? { aspectRatio: aspect, objectFit: "cover" } : undefined}
    />
  );
}
