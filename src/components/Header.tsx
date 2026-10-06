"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "../../content/site";
import { withBase } from "@/lib/images";
import MobileNav from "./MobileNav";

/**
 * Site header:
 *  - transparent (white text/logo) over pages that open with a photo hero;
 *    hovering the bar, or scrolling, turns it solid white with ink links
 *  - scrolling back up mid-page brings the header in as a solid bar
 *  - nav: Weddings · Events · Our Story · Gallery, centred logo, Enquire
 */
const OVERLAY_PATHS = new Set([
  "/",
  "/wedding-flowers-auckland",
  "/event-flowers-auckland",
]);

function isOverlay(pathname: string): boolean {
  if (OVERLAY_PATHS.has(pathname)) return true;
  // Venue guides open with a photo hero too (but not the /venues/ index).
  return /^\/venues\/[^/]+$/.test(pathname);
}

export default function Header() {
  const pathname = (usePathname() || "/").replace(/\/$/, "") || "/";
  const overlay = isOverlay(pathname);

  const [scrollState, setScrollState] = useState<"top" | "hidden" | "solid">("top");
  const lastY = useRef(0);

  useEffect(() => {
    const THRESHOLD = 250;
    const update = () => {
      const y = window.scrollY;
      if (y < THRESHOLD) {
        setScrollState("top");
      } else if (y < lastY.current - 4) {
        setScrollState("solid");
      } else if (y > lastY.current + 4) {
        setScrollState("hidden");
      }
      lastY.current = y;
    };
    lastY.current = window.scrollY;
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [pathname]);

  const transparent = overlay && scrollState === "top";

  const headerCls = overlay
    ? `group fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-500 ease-[var(--ease-soft)] ${
        scrollState === "hidden" ? "-translate-y-full" : "translate-y-0"
      } ${
        transparent
          ? "border-b border-transparent bg-transparent hover:border-hairline hover:bg-white"
          : "border-b border-hairline bg-white"
      }`
    : `group sticky top-0 z-50 border-b border-hairline bg-white transition-transform duration-300 ${
        scrollState === "hidden" ? "-translate-y-full" : "translate-y-0"
      }`;

  const linkCls = `nav-link transition-colors duration-500 ease-[var(--ease-soft)] ${
    transparent ? "text-white group-hover:text-ink" : "text-ink"
  }`;

  return (
    <header className={headerCls}>
      <div className="relative mx-auto grid max-w-[90rem] grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 sm:px-8">
        {/* Left: desktop nav / mobile burger */}
        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={linkCls}
              aria-current={pathname === item.href.replace(/\/$/, "") ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="-ml-2 py-[0.9375rem] lg:hidden">
          <MobileNav light={transparent} />
        </div>

        {/* Centre: logo, dark/white variants swapped by header state. translate-y-[9%]
            puts the lettering (not the image box, which includes the y's tail) on the
            same midline as the burger and Enquire. */}
        <Link href="/" aria-label="Willow & Peony — home" className="relative block justify-self-center">
          {/* Black logo in flow; the white one sits on top and crossfades with the header. */}
          <img
            src={withBase("/brand/willow-and-peony-logo.png")}
            alt="Willow & Peony"
            width={250}
            height={30}
            className={`h-[1.1875rem] w-auto translate-y-[9%] transition-opacity duration-500 ease-[var(--ease-soft)] min-[360px]:h-[1.25rem] sm:h-[1.75rem] ${transparent ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}
          />
          <img
            src={withBase("/brand/willow-and-peony-logo-white.png")}
            alt=""
            aria-hidden
            width={250}
            height={30}
            className={`absolute top-0 left-0 h-[1.1875rem] w-auto translate-y-[9%] transition-opacity duration-500 ease-[var(--ease-soft)] min-[360px]:h-[1.25rem] sm:h-[1.75rem] ${transparent ? "opacity-100 group-hover:opacity-0" : "pointer-events-none opacity-0"}`}
          />
        </Link>

        {/* Right: enquire */}
        <div className="flex items-center justify-end">
          <Link
            href="/contact/"
            className={`wipe hidden border px-5 pt-[0.6875rem] pb-[0.5625rem] text-[0.8125rem] tracking-[0.02em] [--wipe-text:#fff] [--wipe:var(--color-ink)] lg:inline-block ${
              transparent ? "border-white/85 text-white group-hover:border-ink group-hover:text-ink" : "border-ink text-ink"
            }`}
          >
            Enquire
          </Link>
          <Link href="/contact/" className={`${linkCls} translate-y-[0.03125rem] lg:hidden`}>
            Enquire
          </Link>
        </div>
      </div>
    </header>
  );
}
