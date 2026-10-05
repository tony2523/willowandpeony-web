import manifest from "./image-manifest.json";

export type ImageEntry = {
  w: number;
  h: number;
  sizes: number[]; // generated variant widths, ascending
};

const entries = manifest as Record<string, ImageEntry>;

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Prefix a public asset path with the deploy base path. */
export function withBase(path: string): string {
  return `${BASE}${path}`;
}

/** Every manifest image whose name starts with `prefix`, in natural number order. */
export function imageNames(prefix: string): string[] {
  return Object.keys(entries)
    .filter((n) => n.startsWith(prefix))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

export function getImage(name: string): ImageEntry | undefined {
  return entries[name.replace(/^\/images\//, "")];
}

export function imageSrc(name: string, width?: number): string {
  const entry = getImage(name);
  if (!entry) return withBase(`/images/${name}.webp`);
  const w = width && entry.sizes.includes(width) ? width : entry.sizes[entry.sizes.length - 1];
  return withBase(`/images/${name}-${w}w.webp`);
}

export function imageSrcSet(name: string): string {
  const entry = getImage(name);
  if (!entry) return "";
  return entry.sizes.map((w) => `${withBase(`/images/${name}-${w}w.webp`)} ${w}w`).join(", ");
}

/** Absolute URL (production domain) for OG/JSON-LD usage. */
export function imageOgUrl(name: string, domain: string): string {
  return `${domain}/images/${name}-og.jpg`;
}
