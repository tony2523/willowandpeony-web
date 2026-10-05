"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import type { GalleryItem } from "@/lib/gallery";
import Lightbox from "./Lightbox";
import { MOSAIC, MOSAIC_MIRROR, MOSAIC_SHAPES, MOSAIC_VW } from "./mosaic";

type Filter = "weddings" | "events";

/** Images per page (and per "Load more"). */
const PAGE = 48;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "weddings", label: "Weddings" },
  { value: "events", label: "Events" },
];

/**
 * Weddings / Events portfolio (Weddings by default, no All), each wedding's
 * or event's photos side by side in the editorial mosaic shared with the
 * home and Weddings teasers, with a plain full-screen lightbox:
 * tap an image, swipe or arrow through, close with × or Escape.
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

  // Blocks of nine in the editorial mosaic, alternate blocks mirrored. Within
  // a block portrait photos take the portrait slots and landscape photos the
  // landscape ones, in order; i stays each photo's place in the filtered list,
  // which the lightbox steps through. A last partial block uses plain rows.
  const blocks = useMemo(() => {
    const tiles = visible.map((item, i) => ({ item, i }));
    const out: { full: boolean; tiles: { item: GalleryItem; i: number }[] }[] = [];
    for (let k = 0; k < tiles.length; k += MOSAIC_SHAPES.length) {
      const chunk = tiles.slice(k, k + MOSAIC_SHAPES.length);
      if (chunk.length < MOSAIC_SHAPES.length) {
        out.push({ full: false, tiles: chunk });
        break;
      }
      const portraits = chunk.filter((t) => t.item.h >= t.item.w);
      const landscapes = chunk.filter((t) => t.item.w > t.item.h);
      const placed = MOSAIC_SHAPES.map(
        (shape) => ((shape === "P" ? portraits : landscapes).shift() ?? portraits.shift() ?? landscapes.shift())!,
      );
      out.push({ full: true, tiles: placed });
    }
    return out;
  }, [visible]);

  const close = useCallback(() => setOpen(null), []);

  return (
    <div>
      {/* Filters line up with the heading's column, not the wider grid. */}
      <div className="mx-auto flex max-w-[calc(var(--site-column)-3rem)] flex-wrap gap-2.5 px-3 sm:px-2 lg:px-0" role="group" aria-label="Filter gallery">
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

      <div className="mt-10 flex flex-col gap-1.5 sm:gap-3">
        {blocks.map((block, b) =>
          block.full ? (
            // Phones: three columns, the lead photo two by two (on the right in
            // alternate blocks; dense flow fills the cell beside it). Tablets
            // and up: the 12 by 6 mosaic, every slot placed explicitly.
            <div
              key={b}
              className="grid aspect-[3/4] grid-flow-row-dense grid-cols-3 grid-rows-4 gap-1.5 sm:gap-3 md:aspect-[2/1] md:grid-cols-12 md:grid-rows-6"
            >
              {block.tiles.map(({ item, i }, slot) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setOpen(i)}
                  className={`group relative block min-w-0 cursor-zoom-in overflow-hidden bg-paper ${
                    slot === 0 ? `col-span-2 row-span-2 ${b % 2 ? "max-md:col-start-2" : ""}` : ""
                  } ${(b % 2 ? MOSAIC_MIRROR : MOSAIC)[slot]}`}
                  aria-label={`View larger: ${item.alt}`}
                >
                  <img
                    src={item.src}
                    srcSet={item.srcSet}
                    sizes={`(max-width: 767px) ${slot === 0 ? "67vw" : "33vw"}, ${MOSAIC_VW[slot]}`}
                    width={item.w}
                    height={item.h}
                    alt={item.alt}
                    loading={i < 9 ? "eager" : "lazy"}
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </button>
              ))}
            </div>
          ) : (
            // Leftover photos: justified rows at the mosaic's scale, each photo's
            // share of the row its own width-to-height ratio, nothing cropped.
            <div key={b} className="flex flex-wrap gap-1.5 [--row:9rem] sm:gap-3 sm:[--row:12rem] lg:[--row:19rem]">
              {block.tiles.map(({ item, i }) => {
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
                      sizes={`(max-width: 767px) 50vw, ${Math.round(ar * 320)}px`}
                      width={item.w}
                      height={item.h}
                      alt={item.alt}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </button>
                );
              })}
              {/* Keeps the last row at the target height instead of stretching it. */}
              <span aria-hidden className="h-0 grow-[100000] basis-0" />
            </div>
          ),
        )}
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

      <Lightbox images={filtered} index={open} onClose={close} onIndex={setOpen} />
    </div>
  );
}
