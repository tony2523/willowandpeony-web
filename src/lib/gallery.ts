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

/** First of each group, then the second of each, and so on, so the top shows the range of work. */
function interleave(groups: GalleryItem[][]): GalleryItem[] {
  const out: GalleryItem[] = [];
  for (let i = 0; groups.some((g) => i < g.length); i++) {
    for (const g of groups) if (i < g.length) out.push(g[i]);
  }
  return out;
}

/**
 * The gallery portfolio. Weddings: the curated photos in content/gallery.ts,
 * interleaved across weddings. Events: every inline image from the event
 * stories (covers excluded, they already lead the story cards), interleaved
 * across events, newest first.
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

  return [...interleave(weddings), ...interleave(events)];
}
