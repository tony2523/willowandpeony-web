import Link from "next/link";
import { getImage, imageSrc, imageSrcSet } from "@/lib/images";

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
}: {
  image: string;
  alt?: string;
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  cta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  compact?: boolean;
}) {
  const entry = getImage(image);
  return (
    <section className={`relative ${compact ? "h-[480px]" : "h-[560px] md:h-[640px]"}`}>
      {entry && (
        <img
          src={imageSrc(image, 1600)}
          srcSet={imageSrcSet(image)}
          sizes="100vw"
          width={entry.w}
          height={entry.h}
          alt={alt}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-[rgba(20,18,16,0.6)] via-[rgba(20,18,16,0.12)] to-[rgba(20,18,16,0.25)]"
      />
      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto max-w-[1280px] px-5 pb-14 sm:px-6 md:pb-20">
          <p className="eyebrow text-white/85">{eyebrow}</p>
          <h1 className="display-1 mt-3 max-w-[820px] text-white">{title}</h1>
          {intro && (
            <p className="mt-5 max-w-[560px] text-[15px] leading-relaxed font-light text-white/90">
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
