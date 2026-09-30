import { getImage, imageSrc, imageSrcSet } from "./images";
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

/**
 * The gallery portfolio: every inline image from every journal story,
 * categorised by the story it came from, newest first. Covers are
 * excluded (they already lead the story cards).
 */
export function getGalleryItems(): GalleryItem[] {
  const seen = new Set<string>();
  const items: GalleryItem[] = [];
  for (const post of getPosts()) {
    for (const name of post.images) {
      if (seen.has(name) || /-cover$/.test(name)) continue;
      seen.add(name);
      const entry = getImage(name);
      if (!entry) continue;
      items.push({
        name,
        src: imageSrc(name, 480),
        srcSet: imageSrcSet(name),
        w: entry.w,
        h: entry.h,
        alt: altFromName(name),
        cat: post.category,
      });
    }
  }
  return items;
}
