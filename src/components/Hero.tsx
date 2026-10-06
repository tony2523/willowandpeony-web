import Link from "next/link";
import { getImage } from "@/lib/images";
import HeroImage from "./HeroImage";

/**
 * Interior page hero — 640px image banner with gradient overlay,
 * eyebrow + display title (+ optional intro and CTAs), per the design
 * system. The home page uses its own full-screen variant.
 */
export default function Hero({
  image,
  alt = "",
  eyebrow,
  title,
  intro,
  cta,
  secondaryCta,
  compact = false,
  position = "object-center",
}: {
  image: string;
  alt?: string;
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  cta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  compact?: boolean;
  /** Per-image object-position for portrait crops (see memory: analyze
   *  the composition; e.g. "object-[45%_center] md:object-center"). */
  position?: string;
}) {
  const entry = getImage(image);
  // object-cover fills a fixed-height banner, so on narrow screens a landscape
  // photo is drawn wider than the screen: tell the browser the drawn width.
  const ar = entry ? entry.w / entry.h : 1;
  const coverPhone = Math.max(768, Math.round((compact ? 480 : 560) * ar));
  const coverMd = Math.round((compact ? 480 : 640) * ar);
  const sizes = `(max-width: 767px) ${coverPhone}px, (max-width: ${Math.max(coverMd, 768)}px) ${Math.max(coverMd, 768)}px, 100vw`;
  return (
    <section className={`relative overflow-hidden ${compact ? "h-[30rem]" : "h-[35rem] md:h-[40rem]"}`}>
      {entry && (
        <HeroImage
          name={image}
          alt={alt}
          sizes={sizes}
          // 3:5 phone crop in a box 560px (480px compact) tall: drawn at the
          // screen width, or 0.6 x the height on very narrow screens.
          mobileSizes={`(max-width: ${Math.round((compact ? 480 : 560) * 0.6) - 1}px) ${Math.round((compact ? 480 : 560) * 0.6)}px, 100vw`}
          className={`hero-settle absolute inset-0 h-full w-full object-cover ${position}`}
        />
      )}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-[rgba(20,18,16,0.6)] via-[rgba(20,18,16,0.12)] to-[rgba(20,18,16,0.25)]"
      />
      <div className="absolute inset-x-0 bottom-0">
        <div className="hero-in mx-auto max-w-(--site-column) px-5 pb-14 sm:px-6 md:pb-20">
          <p className="eyebrow text-white/85">{eyebrow}</p>
          <h1 className="display-1 mt-3 max-w-[51.25rem] text-white">{title}</h1>
          {intro && (
            <p className="mt-5 max-w-[35rem] text-[0.9375rem] leading-relaxed font-light text-white/90">
              {intro}
            </p>
          )}
          {(cta || secondaryCta) && (
            <div className="mt-8 flex flex-wrap gap-4">
              {cta && (
                <Link href={cta.href} className="btn-white">
                  {cta.label}
                </Link>
              )}
              {secondaryCta && (
                <Link href={secondaryCta.href} className="btn-ghost-white">
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
