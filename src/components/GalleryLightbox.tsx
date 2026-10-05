"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { GalleryItem } from "@/lib/gallery";
import ArrowButton, { CloseIcon, iconButton } from "./ArrowButton";

type Filter = "weddings" | "events";

/** Images per page (and per "Load more"). */
const PAGE = 48;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "weddings", label: "Weddings" },
  { value: "events", label: "Events" },
];

/**
 * Weddings / Events portfolio (Weddings by default, no All), each wedding's
 * or event's photos side by side, with a plain full-screen lightbox:
 * tap an image, flick or arrow through, close with × or Escape.
 * The active filter carries into the lightbox sequence.
 */
export default function GalleryLightbox({ items }: { items: GalleryItem[] }) {
  // ?type=events (the Events page links here) opens on Events; otherwise Weddings.
  const urlType = useSyncExternalStore(
    () => () => {},
    () => new URLSearchParams(window.location.search).get("type"),
    () => null,
  );
  const [override, setOverride] = useState<Filter | null>(null);
  const filter: Filter = override ?? (urlType === "events" ? "events" : "weddings");
  const setFilter = (f: Filter) => {
    setOverride(f);
    // Keep the address in step so a refresh or a shared link shows the same filter.
    window.history.replaceState(null, "", f === "events" ? "?type=events" : window.location.pathname);
  };
  const [open, setOpen] = useState<number | null>(null);
  const [shown, setShown] = useState(PAGE);

  const filtered = useMemo(
    () => items.filter((i) => i.cat === filter),
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
      {/* Filters line up with the heading's column, not the wider grid. */}
      <div className="mx-auto flex max-w-[77rem] flex-wrap gap-2.5 px-3 sm:px-2 lg:px-0" role="group" aria-label="Filter gallery">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => {
              setFilter(f.value);
              setShown(PAGE);
            }}
            aria-pressed={filter === f.value}
            className={`px-4 py-2.5 text-[0.6875rem] tracking-[0.14em] uppercase transition-colors ${
              filter === f.value
                ? "bg-ink text-white"
                : "border border-hairline text-ink-soft hover:border-ink"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/*
        Justified rows: each image's share of a row is its own width-to-height
        ratio, so every row fills the width at one height and nothing is
        cropped. --row is the target row height: big enough that phones show
        one image per row, tablets about three, laptops and up three to five.
      */}
      <div className="mt-10 flex flex-wrap gap-2 [--row:22rem] sm:gap-3 sm:[--row:18rem] md:[--row:20rem] lg:[--row:26rem] 2xl:[--row:28rem]">
        {visible.map((item, i) => {
          const ar = item.w / item.h;
          return (
            <button
              key={item.name}
              type="button"
              onClick={() => setOpen(i)}
              style={{ flexGrow: ar, flexBasis: `calc(var(--row) * ${ar.toFixed(4)})`, aspectRatio: `${item.w} / ${item.h}` }}
              className="group relative block min-w-0 cursor-zoom-in overflow-hidden bg-paper"
              aria-label={`View larger: ${item.alt}`}
            >
              <img
                src={item.src}
                srcSet={item.srcSet}
                sizes={`(max-width: 639px) 100vw, (min-width: 1760px) ${Math.round(ar * 620)}px, ${Math.round(ar * 440)}px`}
                width={item.w}
                height={item.h}
                alt={item.alt}
                loading={i < 12 ? "eager" : "lazy"}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            </button>
          );
        })}
        {/* Keeps the last row at the target height instead of stretching it. */}
        <span aria-hidden className="h-0 grow-[100000] basis-0" />
      </div>

      {shown < filtered.length && (
        <div className="mt-12 text-center">
          <button type="button" onClick={() => setShown((s) => s + PAGE)} className="btn-outline">
            Load more
          </button>
          <p className="mt-3.5 text-[0.75rem] text-muted">
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
            className={`absolute top-4 right-4 z-10 sm:right-5 ${iconButton("dark")}`}
          >
            <CloseIcon />
          </button>
          <ArrowButton
            dir="prev"
            tone="dark"
            label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            className="absolute left-3 z-10 sm:left-5"
          />
          <img
            key={filtered[open].name}
            src={filtered[open].src}
            srcSet={filtered[open].srcSet}
            sizes="100vw"
            alt={filtered[open].alt}
            className="max-h-[92vh] max-w-[94vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <ArrowButton
            dir="next"
            tone="dark"
            label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            className="absolute right-3 z-10 sm:right-5"
          />
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[0.75rem] tracking-[0.14em] text-white/70">
            {open + 1} / {filtered.length}
          </p>
        </div>
      )}
    </div>
  );
}
