"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { GalleryItem } from "@/lib/gallery";

type Filter = "all" | "weddings" | "events";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "weddings", label: "Weddings" },
  { value: "events", label: "Events" },
];

/**
 * Filterable portfolio grid with a plain full-screen lightbox:
 * tap an image, flick or arrow through, close with × or Escape.
 * The active filter carries into the lightbox sequence.
 */
export default function GalleryLightbox({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<number | null>(null);
  const [shown, setShown] = useState(24);

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.cat === filter)),
    [items, filter],
  );
  const visible = filtered.slice(0, shown);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setOpen((i) => (i === null ? null : (i + dir + filtered.length) % filtered.length)),
    [filtered.length],
  );

  useEffect(() => {
    if (open === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, step]);

  return (
    <div>
      <div className="flex flex-wrap gap-2.5" role="group" aria-label="Filter gallery">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => {
              setFilter(f.value);
              setShown(24);
            }}
            aria-pressed={filter === f.value}
            className={`px-4 py-2.5 text-[11px] tracking-[0.14em] uppercase transition-colors ${
              filter === f.value
                ? "bg-ink text-white"
                : "border border-hairline text-ink-soft hover:border-ink"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-10 columns-2 gap-3 md:columns-3 lg:columns-4 [&>button]:mb-3">
        {visible.map((item, i) => (
          <button
            key={item.name}
            type="button"
            onClick={() => setOpen(i)}
            className="block w-full cursor-zoom-in overflow-hidden bg-paper"
            aria-label={`View larger: ${item.alt}`}
          >
            <img
              src={item.src}
              srcSet={item.srcSet}
              sizes="(max-width: 768px) 50vw, 25vw"
              width={item.w}
              height={item.h}
              alt={item.alt}
              loading={i < 8 ? "eager" : "lazy"}
              decoding="async"
              className="h-auto w-full transition-transform duration-700 ease-out hover:scale-[1.02]"
            />
          </button>
        ))}
      </div>

      {shown < filtered.length && (
        <div className="mt-12 text-center">
          <button type="button" onClick={() => setShown((s) => s + 24)} className="btn-outline">
            Load more
          </button>
          <p className="mt-3.5 text-[12px] text-muted">
            Showing {visible.length} of {filtered.length} images
          </p>
        </div>
      )}

      {open !== null && filtered[open] && (
        <div
          className="fixed inset-0 z-[90] flex animate-[fadein_0.25s_ease] items-center justify-center bg-[rgba(15,13,11,0.96)]"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close viewer"
            className="absolute top-4 right-5 z-10 flex h-11 w-11 items-center justify-center text-3xl font-light text-white/90 hover:text-white"
          >
            <span aria-hidden>×</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Previous image"
            className="absolute left-2 z-10 flex h-12 w-12 items-center justify-center text-2xl text-white/80 hover:text-white sm:left-5"
          >
            <span aria-hidden>←</span>
          </button>
          <img
            key={filtered[open].name}
            src={filtered[open].src}
            srcSet={filtered[open].srcSet}
            sizes="100vw"
            alt={filtered[open].alt}
            className="max-h-[92vh] max-w-[94vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Next image"
            className="absolute right-2 z-10 flex h-12 w-12 items-center justify-center text-2xl text-white/80 hover:text-white sm:right-5"
          >
            <span aria-hidden>→</span>
          </button>
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[12px] tracking-[0.14em] text-white/70">
            {open + 1} / {filtered.length}
          </p>
        </div>
      )}
    </div>
  );
}
