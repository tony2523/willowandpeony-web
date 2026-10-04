"use client";

import { useEffect, useState } from "react";
import { getImage, imageSrc, imageSrcSet } from "@/lib/images";
import { site } from "../../content/site";

type FeedItem = {
  id: string;
  /** Local manifest name (curated fallback) or absolute URL (live feed). */
  src: string;
  permalink: string;
  caption: string;
  local: boolean;
};

/**
 * Instagram section, as on the original home page: centred 15px "Follow Us"
 * line, a flush grid of square tiles (6 across desktop, 2 across mobile,
 * matching the live site), and a click-to-preview popup with a close button.
 *
 * Tries the site's own Worker (/api/instagram — live feed, cached at the
 * edge) and falls back to the curated tiles below until the Instagram token
 * is configured (see CLAUDE.md).
 */
const curated: FeedItem[] = [
  ["willow-and-peony-bouquet-romantic-grace-09", "Romantic pastel bouquet"],
  ["willow-and-peony-bouquet-citrus-delight-06", "Bright citrus-toned bouquet"],
  ["willow-and-peony-bouquet-peach-serenade-05", "Peach hand-tied bouquet"],
  ["willow-and-peony-bouquet-pure-grace-05", "White rose and orchid bouquet"],
  ["willow-and-peony-bouquet-florist-schoice01", "Florist's choice arrangement"],
  ["willow-and-peony-bouquet-oneofakind01", "Sculptural floral arrangement"],
  ["willow-and-peony-bouquet-pink-blossom-large-05", "Pink blossom bouquet"],
  ["willow-and-peony-bouquet-deluxe-floral-cake-10", "Fresh floral cake"],
  ["wedding-flowers-auckland-scarlet-style-shoot3", "Deep red rose bouquet"],
  ["event-flowers-auckland-dsc03608-2", "Sculptural event centrepiece"],
  ["wedding-flowers-auckland-img-3926", "Romantic ceremony flowers"],
  ["willow-and-peony-bouquet-deluxe-floral-cake-09", "Floral cake with garden roses"],
].map(([name, caption], i) => ({
  id: `c${i}`,
  src: name,
  permalink: site.instagram,
  caption,
  local: true,
}));

function TileImage({ item, sizes }: { item: FeedItem; sizes: string }) {
  if (!item.local) {
    return (
      <img
        src={item.src}
        alt={item.caption}
        loading="lazy"
        decoding="async"
        className="aspect-square h-auto w-full object-cover"
      />
    );
  }
  const entry = getImage(item.src);
  if (!entry) return null;
  return (
    <img
      src={imageSrc(item.src, 480)}
      srcSet={imageSrcSet(item.src)}
      sizes={sizes}
      width={entry.w}
      height={entry.h}
      alt={item.caption}
      loading="lazy"
      decoding="async"
      className="aspect-square h-auto w-full object-cover"
    />
  );
}

export default function InstagramFeed() {
  const [items, setItems] = useState<FeedItem[]>(curated);
  const [open, setOpen] = useState<FeedItem | null>(null);

  useEffect(() => {
    fetch("/api/instagram")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.items?.length >= 4) {
          setItems(
            data.items.slice(0, 12).map(
              (m: { id: string; src: string; permalink: string; caption: string }) => ({
                ...m,
                local: false,
              }),
            ),
          );
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <section aria-label="Instagram">
      <div className="text-center">
        <a
          href={site.instagram}
          target="_blank"
          rel="noopener"
          className="eyebrow text-ink hover:underline hover:underline-offset-4"
        >
          @{site.instagramHandle}
        </a>
        <p className="mt-3 text-[12px] text-muted">Tap any tile to preview</p>
        <a href={site.instagram} target="_blank" rel="noopener" className="btn-outline mt-6">
          Follow along
        </a>
      </div>
      {/* Full-bleed, flush tiles: 2 across mobile, 3 tablet, 6 desktop */}
      <div className="mt-9 grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setOpen(item)}
            aria-label={`Preview Instagram post: ${item.caption.slice(0, 60)}`}
            className={`group block cursor-pointer overflow-hidden ${i > 3 ? "max-sm:hidden" : ""}`}
          >
            <TileImage item={item} sizes="(max-width: 640px) 50vw, 17vw" />
          </button>
        ))}
      </div>

      {/* Post preview popup */}
      {open && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Instagram post preview"
        >
          <div
            className="relative max-h-[90vh] w-full max-w-[480px] overflow-hidden bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label="Close preview"
              className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center bg-white/90 text-2xl font-light text-ink"
            >
              <span aria-hidden>×</span>
            </button>
            <TileImage item={open} sizes="480px" />
            <div className="flex items-center justify-between gap-4 p-4">
              <p className="line-clamp-2 text-[12.6px] leading-relaxed text-ink-soft">
                {open.caption}
              </p>
              <a
                href={open.permalink}
                target="_blank"
                rel="noopener"
                className="link-text shrink-0 text-ink"
              >
                View on Instagram
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
