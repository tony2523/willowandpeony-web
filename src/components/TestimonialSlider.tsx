"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { googleRating, sliderReviews } from "../../content/reviews";

/**
 * Testimonial slider — fades through the studio's Google reviews.
 * Auto-advances only while on screen; pauses on hover or keyboard focus and
 * stops for good once the visitor uses the arrows or dots. Screen readers
 * hear a new review only when the visitor changes it.
 */
export default function TestimonialSlider({ kind }: { kind?: "wedding" | "event" }) {
  const items = sliderReviews(kind);
  const [index, setIndex] = useState(0);
  const [manual, setManual] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const paused = useRef(false);

  const advance = useCallback(() => setIndex((i) => (i + 1) % items.length), [items.length]);
  const next = useCallback(() => {
    setManual(true);
    advance();
  }, [advance]);
  const prev = useCallback(() => {
    setManual(true);
    setIndex((i) => (i - 1 + items.length) % items.length);
  }, [items.length]);
  const goTo = (i: number) => {
    setManual(true);
    setIndex(i);
  };

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      threshold: 0.4,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (manual || !onScreen) return;
    const timer = setInterval(() => {
      if (!paused.current) advance();
    }, 7000);
    return () => clearInterval(timer);
  }, [manual, onScreen, advance]);

  const review = items[index];

  return (
    <div
      ref={root}
      className="mx-auto max-w-[860px] text-center"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onFocus={() => (paused.current = true)}
      onBlur={() => (paused.current = false)}
    >
      <div aria-live={manual ? "polite" : "off"} className="relative">
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
              onClick={() => goTo(i)}
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
