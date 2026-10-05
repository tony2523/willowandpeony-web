"use client";

import { useRef, useState } from "react";
import { imageSrc, imageSrcSet } from "@/lib/images";
import {
  TIERS,
  money,
  photosFor,
  tierFor,
  unitLabel,
  type CalcItem,
  type Selection,
} from "@/lib/estimate";

const CARD_SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px";

/** 4:5 photo with a "Signature shown" tag, arrows, dots and swipe when there are several. */
function Slides({ name, list, tier }: { name: string; list: string[]; tier: number | null }) {
  const [i, setI] = useState(0);
  const touchX = useRef<number | null>(null);
  const n = list.length;
  const go = (to: number) => setI(((to % n) + n) % n);
  const label = tier != null ? TIERS[tier].name : null;
  const file = `calculator-${list[i]}`;

  return (
    <div
      className="group/ph relative aspect-[4/5] overflow-hidden bg-paper"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null || n < 2) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
      }}
    >
      <img
        src={imageSrc(file, 480)}
        srcSet={imageSrcSet(file)}
        sizes={CARD_SIZES}
        alt={`${name}${label ? `, ${label} tier` : ""}, example ${i + 1} of ${n}`}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
      {label && (
        <span className="absolute top-2.5 left-2.5 bg-white/90 px-2 py-1 text-[10px] tracking-[0.14em] text-ink uppercase">
          {label} shown
        </span>
      )}
      {n > 1 && (
        <>
          {[-1, 1].map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => go(i + dir)}
              aria-label={`${dir < 0 ? "Previous" : "Next"} photo of ${name}`}
              className={`absolute top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-ink/10 bg-white/90 pb-0.5 font-serif text-[22px] leading-none text-ink transition-opacity hover:bg-white [@media(hover:hover)]:opacity-70 [@media(hover:hover)]:group-hover/ph:opacity-100 ${
                dir < 0 ? "left-2" : "right-2"
              }`}
            >
              <span aria-hidden>{dir < 0 ? "‹" : "›"}</span>
            </button>
          ))}
          <div className="absolute inset-x-0 bottom-2 flex justify-center">
            {list.map((_, d) => (
              <button
                key={d}
                type="button"
                onClick={() => go(d)}
                aria-label={`Photo ${d + 1} of ${n}`}
                aria-current={d === i}
                className="grid h-5 w-5 place-items-center"
              >
                <span
                  aria-hidden
                  className={`block h-1.5 w-1.5 rounded-full shadow-[0_0_0_1px_rgba(26,24,21,0.15)] transition-transform ${
                    d === i ? "scale-125 bg-white" : "bg-white/60"
                  }`}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function Stepper({
  name,
  qty,
  onChange,
  onStep,
}: {
  name: string;
  qty: number;
  onChange: (q: number) => void;
  /** ± buttons step from the latest state, so quick taps never get lost. */
  onStep: (delta: number) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const btn = "flex h-9 w-9 items-center justify-center text-[17px] text-ink disabled:opacity-30";
  return (
    <div className="inline-flex items-center border border-hairline bg-white">
      <button type="button" className={btn} disabled={qty <= 0} onClick={() => onStep(-1)} aria-label={`Fewer ${name}`}>
        −
      </button>
      <input
        inputMode="numeric"
        aria-label={`${name} quantity`}
        value={draft ?? String(qty)}
        onFocus={(e) => e.currentTarget.select()}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "").slice(0, 3);
          setDraft(digits);
          onChange(Number(digits) || 0);
        }}
        onBlur={() => setDraft(null)}
        className="h-9 w-11 border-x border-hairline bg-transparent text-center text-[14px] text-ink tabular-nums focus:outline-1 focus:outline-ink"
      />
      <button type="button" className={btn} onClick={() => onStep(1)} aria-label={`More ${name}`}>
        +
      </button>
    </div>
  );
}

export default function ItemCard({
  it,
  sel,
  onQty,
  onStep,
  onTier,
}: {
  it: CalcItem;
  sel: Selection;
  onQty: (q: number) => void;
  onStep: (delta: number) => void;
  onTier: (t: number) => void;
}) {
  const qty = sel.items[it.id]?.qty ?? 0;
  const photos = photosFor(it, sel);
  const current = it.tiers ? tierFor(it, sel) : null;

  return (
    <article
      className={`flex min-w-0 flex-col border bg-white transition-colors duration-200 ${
        qty > 0 ? "border-ink" : "border-hairline"
      }`}
    >
      {photos && <Slides key={photos.list.join(",")} name={it.name} list={photos.list} tier={photos.tier} />}
      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
        <div>
          <h3 className="font-serif text-[19px] leading-[1.25] font-normal tracking-[-0.01em] text-ink">
            {it.name}
          </h3>
          {it.note && <p className="mt-1 text-[12.5px] leading-snug text-muted">{it.note}</p>}
        </div>

        {it.tiers ? (
          <div role="group" aria-label={`Tier for ${it.name}`} className="grid grid-cols-3 gap-1">
            {it.tiers.map((p, t) => {
              const on = current === t;
              return (
                <button
                  key={t}
                  type="button"
                  disabled={p == null}
                  aria-pressed={on}
                  onClick={() => onTier(t)}
                  className={`flex min-w-0 flex-col items-center border px-1 py-2 text-center tabular-nums transition-colors disabled:cursor-not-allowed disabled:line-through disabled:opacity-40 ${
                    on ? "border-ink bg-ink text-white" : "border-hairline text-ink hover:border-ink"
                  }`}
                >
                  <span className={`text-[9.5px] tracking-[0.14em] uppercase ${on ? "text-white/75" : "text-muted"}`}>
                    {TIERS[t].name}
                  </span>
                  {p == null ? (
                    <span className="text-[13px]">—</span>
                  ) : (
                    <span className="text-[13px] leading-tight">
                      <span className={`text-[10px] ${on ? "text-white/75" : "text-muted"}`}>from </span>
                      {money(p)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-[13px] text-ink-soft tabular-nums">
            From <span className="font-medium text-ink">{money(it.price ?? it.from ?? 0)}</span> {unitLabel(it)}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3">
          <span className="text-[11.5px] tracking-[0.14em] text-muted uppercase">
            {it.unit === "metre" ? "Metres" : "Quantity"}
          </span>
          <Stepper name={it.name} qty={qty} onChange={onQty} onStep={onStep} />
        </div>
      </div>
    </article>
  );
}
