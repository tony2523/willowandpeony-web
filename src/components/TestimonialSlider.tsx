"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { googleRating, sliderReviews } from "../../content/reviews";

/**
 * Testimonial slider — fades through the studio's Google reviews.
 * Auto-advances; arrows and dots for manual control; pauses on hover.
 */
export default function TestimonialSlider({ kind }: { kind?: "wedding" | "event" }) {
  const items = sliderReviews(kind);
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const paused = useRef(false);

  const next = useCallback(() => setIndex((i) => (i + 1) % items.length), [items.length]);
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + items.length) % items.length),
    [items.length],
  );

  useEffect(() => {
    timer.current = setInterval(() => {
      if (!paused.current) next();
    }, 7000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [next]);

  const review = items[index];

  return (
    <div
      className="mx-auto max-w-[860px] text-center"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <div aria-live="polite" className="relative">
        <blockquote key={index} className="animate-[fadein_0.6s_ease]">
          <p className="font-serif text-[clamp(19px,2vw,26px)] leading-[1.55] font-light text-ink italic">
            &ldquo;{review.short ?? review.text}&rdquo;
          </p>
          <footer className="eyebrow mt-6 text-muted">
            — {review.name} · Google review
          </footer>
        </blockquote>
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous review"
          className="flex h-9 w-9 items-center justify-center border border-hairline text-ink-soft transition-colors hover:border-ink hover:text-ink"
        >
          <span aria-hidden>←</span>
        </button>
        <p className="min-w-[3.5rem] text-center text-[12px] tracking-[0.14em] text-muted sm:hidden">
          {index + 1} / {items.length}
        </p>
        <div className="hidden sm:flex" role="group" aria-label="Choose a review">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Review ${i + 1}`}
              aria-current={i === index}
              className="group flex h-6 w-6 items-center justify-center"
            >
              <span
                aria-hidden
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  i === index ? "bg-ink" : "bg-hairline group-hover:bg-muted"
                }`}
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          aria-label="Next review"
          className="flex h-9 w-9 items-center justify-center border border-hairline text-ink-soft transition-colors hover:border-ink hover:text-ink"
        >
          <span aria-hidden>→</span>
        </button>
      </div>

      <p className="mt-6 text-[12.5px] text-muted">
        <span aria-hidden>★★★★★</span>{" "}
        <a
          href={googleRating.url}
          target="_blank"
          rel="noopener"
          className="underline underline-offset-4 hover:text-ink"
        >
          {googleRating.value.toFixed(1)} from {googleRating.count} Google reviews
        </a>
      </p>

    </div>
  );
}
