"use client";

import { useCallback, useEffect, useRef } from "react";
import ArrowButton, { CloseIcon, iconButton } from "./ArrowButton";

export type LightboxImage = { name: string; src: string; srcSet: string; alt: string };

/**
 * Full-screen photo viewer shared by the gallery page and the gallery
 * sections on the home, Weddings and Events pages: arrows, swipe, arrow keys,
 * Escape or a tap on the backdrop to close, and an "n / total" counter.
 */
export default function Lightbox({
  images,
  index,
  onClose,
  onIndex,
}: {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const n = images.length;
  const step = useCallback(
    (dir: 1 | -1) => {
      if (index !== null) onIndex((index + dir + n) % n);
    },
    [index, n, onIndex],
  );
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    if (index === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [index, onClose, step]);

  if (index === null || !images[index]) return null;
  const img = images[index];

  return (
    <div
      className="fixed inset-0 z-[90] flex animate-[fadein_0.25s_ease] items-center justify-center bg-[rgba(15,13,11,0.96)]"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={onClose}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close viewer"
        className={`absolute top-4 right-4 z-10 sm:right-5 ${iconButton("dark")}`}
      >
        <CloseIcon />
      </button>
      {n > 1 && (
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
      )}
      <img
        key={img.name}
        src={img.src}
        srcSet={img.srcSet}
        sizes="100vw"
        alt={img.alt}
        className="max-h-[92vh] max-w-[94vw] animate-[fadein_0.45s_var(--ease-soft)] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      {n > 1 && (
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
      )}
      <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[0.75rem] tracking-[0.14em] text-white/70">
        {index + 1} / {n}
      </p>
    </div>
  );
}
