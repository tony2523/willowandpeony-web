"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";

export type WorkItem = {
  slug: string;
  title: string;
  meta: string; // "Weddings · Aug 2026"
  cat: "weddings" | "events";
  src: string;
  srcSet: string;
  w: number;
  h: number;
};

type Filter = "all" | "weddings" | "events";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "weddings", label: "Weddings" },
  { value: "events", label: "Events" },
];

const PAGE = 6;

/**
 * The unified Our Work grid: every story with All/Weddings/Events filters
 * and a Load more control. "Recent celebrations" and "Recent events"
 * modules land here pre-filtered via the `initial` prop (?type= links).
 */
export default function WorkGrid({
  items,
  initial = "all",
}: {
  items: WorkItem[];
  initial?: Filter;
}) {
  const [override, setOverride] = useState<Filter | null>(null);
  const [shown, setShown] = useState(PAGE);

  // Pre-filter from ?type=weddings|events (static export: read client-side).
  const urlType = useSyncExternalStore(
    () => () => {},
    () => new URLSearchParams(window.location.search).get("type"),
    () => null,
  );
  const filter: Filter =
    override ?? (urlType === "weddings" || urlType === "events" ? urlType : initial);

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.cat === filter)),
    [items, filter],
  );
  const visible = filtered.slice(0, shown);

  return (
    <div>
      <div className="flex flex-wrap gap-2.5" role="group" aria-label="Filter stories">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => {
              setOverride(f.value);
              setShown(PAGE);
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

      <div className="mt-10 grid gap-x-6 gap-y-14 md:grid-cols-2">
        {visible.map((item) => (
          <article key={item.slug} className="group">
            <Link href={`/journal/${item.slug}/`} className="block">
              <div className="overflow-hidden bg-paper">
                <img
                  src={item.src}
                  srcSet={item.srcSet}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  width={item.w}
                  height={item.h}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
              </div>
              <h3 className="mt-4 font-serif text-[21px] leading-[1.3] font-light text-ink group-hover:underline group-hover:underline-offset-4 md:text-[23px]">
                {item.title}
              </h3>
            </Link>
            <p className="mt-2 text-[10.5px] tracking-[0.14em] text-muted uppercase">{item.meta}</p>
          </article>
        ))}
      </div>

      {shown < filtered.length && (
        <div className="mt-14 text-center">
          <button type="button" onClick={() => setShown((s) => s + PAGE)} className="btn-outline">
            Load more stories
          </button>
          <p className="mt-3.5 text-[12px] text-muted">
            Showing {visible.length} of {filtered.length} stories
          </p>
        </div>
      )}
    </div>
  );
}
