"use client";

import { useEffect, useState } from "react";
import Pic from "./Pic";

/**
 * Auto-cycling image slideshow, as on the original weddings/events pages
 * (left half of the split section, 720×922, gentle fade, no controls).
 * Only the active and next slide are mounted, so the other photos aren't
 * downloaded until needed.
 */
export default function Slideshow({
  images,
  interval = 4000,
}: {
  images: { name: string; alt: string }[];
  interval?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const t = setInterval(() => setIndex((v) => (v + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [images.length, interval]);

  const next = (index + 1) % images.length;

  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: "720/922" }}>
      {images.map((img, idx) => {
        if (idx !== index && idx !== next) return null;
        return (
          <div
            key={img.name}
            className={idx === index ? "absolute inset-0 animate-[slidefade_1s_ease]" : "absolute inset-0 opacity-0"}
            aria-hidden={idx !== index}
          >
            <Pic
              name={img.name}
              alt={img.alt}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={idx === 0}
              className="h-full w-full object-cover"
            />
          </div>
        );
      })}
      <style>{`@keyframes slidefade { from { opacity: 0.35 } to { opacity: 1 } }`}</style>
    </div>
  );
}
