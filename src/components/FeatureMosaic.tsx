"use client";

import { useCallback, useState } from "react";
import Lightbox, { type LightboxImage } from "./Lightbox";

export type MosaicImage = LightboxImage & { w: number; h: number };

/** The gallery section's photo tiles: each opens the shared lightbox, stepping through this section's photos. */
export default function FeatureMosaic({
  images,
  slots,
}: {
  images: MosaicImage[];
  slots: { cls: string; sizes: string }[];
}) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  return (
    <>
      {images.slice(0, slots.length).map((img, i) => (
        <button
          key={img.name}
          type="button"
          onClick={() => setOpen(i)}
          className={`group relative block cursor-zoom-in overflow-hidden bg-paper ${slots[i].cls}`}
          aria-label={`View larger: ${img.alt}`}
        >
          <img
            src={img.src}
            srcSet={img.srcSet}
            sizes={slots[i].sizes}
            width={img.w}
            height={img.h}
            alt={img.alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </button>
      ))}
      <Lightbox images={images.slice(0, slots.length)} index={open} onClose={close} onIndex={setOpen} />
    </>
  );
}
