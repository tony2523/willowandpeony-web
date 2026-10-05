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
    ? `group fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-300 ${
        scrollState === "hidden" ? "-translate-y-full" : "translate-y-0"
      } ${
        transparent
          ? "border-b border-transparent bg-transparent hover:border-hairline hover:bg-white"
          : "border-b border-hairline bg-white"
      }`
    : `group sticky top-0 z-50 border-b border-hairline bg-white transition-transform duration-300 ${
        scrollState === "hidden" ? "-translate-y-full" : "translate-y-0"
      }`;

  const linkCls = `nav-link transition-colors ${
    transparent ? "text-white group-hover:text-ink" : "text-ink"
  }`;

  return (
    <header className={headerCls}>
      <div className="relative mx-auto grid max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 sm:px-8">
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
        <div className="-ml-2 py-[15px] lg:hidden">
          <MobileNav light={transparent} />
        </div>

        {/* Centre: logo — dark/white variants swapped by header state */}
        <Link href="/" aria-label="Willow & Peony — home" className="block justify-self-center">
          <img
            src={withBase("/brand/willow-and-peony-logo-white.png")}
            alt="Willow & Peony"
            width={250}
            height={30}
            className={`h-[19px] w-auto sm:h-[28px] ${transparent ? "block group-hover:hidden" : "hidden"}`}
          />
          <img
            src={withBase("/brand/willow-and-peony-logo.png")}
            alt="Willow & Peony"
            width={250}
            height={30}
            className={`h-[19px] w-auto sm:h-[28px] ${transparent ? "hidden group-hover:block" : "block"}`}
          />
        </Link>

        {/* Right: enquire */}
        <div className="flex items-center justify-end">
          <Link
            href="/contact/"
            className={`hidden border px-5 py-2.5 text-[13px] tracking-[0.02em] transition-colors lg:inline-block ${
              transparent
                ? "border-white/85 text-white group-hover:border-ink group-hover:text-ink hover:bg-white hover:text-ink"
                : "border-ink text-ink hover:bg-ink hover:text-white"
            }`}
          >
            Enquire
          </Link>
          <Link href="/contact/" className={`${linkCls} lg:hidden`}>
            Enquire
          </Link>
        </div>
      </div>
    </header>
  );
}
