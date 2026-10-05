import { getImage, imageNames, imageSrc, imageSrcSet } from "./images";
import { WEDDING_GALLERY } from "../../content/gallery";
import { getPosts } from "./journal";

export type GalleryItem = {
  name: string;
  src: string;
  srcSet: string;
  w: number;
  h: number;
  alt: string;
  cat: "weddings" | "events";
};

/** Turn a manifest slug into readable alt text. */
function altFromName(name: string): string {
  const words = name
    .replace(/-cover$/, "")
    .replace(/-\d+w?$/, "")
    .replace(/-/g, " ")
    .replace(/\b(dsc|img|uca|cbd)\s*\d*\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function item(name: string, alt: string, cat: GalleryItem["cat"]): GalleryItem | null {
  const entry = getImage(name);
  if (!entry) return null;
  return { name, src: imageSrc(name, 480), srcSet: imageSrcSet(name), w: entry.w, h: entry.h, alt, cat };
}

/**
 * The gallery portfolio, one continuous gallery with each wedding's or
 * event's photos side by side (Tony, 6 Oct 2026). Weddings: the curated photos in
 * content/gallery.ts, in its order. Events: every inline image from the
 * event stories (covers excluded, they already lead the story cards),
 * newest story first.
 */
export function getGalleryItems(): GalleryItem[] {
  const weddings = WEDDING_GALLERY.map((g) =>
    imageNames(`gallery-${g.slug}-`)
      .map((name) => item(name, g.alt, "weddings"))
      .filter((x): x is GalleryItem => x !== null),
  );

  const seen = new Set<string>();
  const events = getPosts()
    .filter((post) => post.category === "events")
    .map((post) =>
      post.images
        .filter((name) => {
          if (seen.has(name) || /-cover$/.test(name)) return false;
          seen.add(name);
          return true;
        })
        .map((name) => item(name, altFromName(name), "events"))
        .filter((x): x is GalleryItem => x !== null),
    );

  return [...weddings.flat(), ...events.flat()];
}
