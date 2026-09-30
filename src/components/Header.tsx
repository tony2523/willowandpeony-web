"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "../../content/site";
import { withBase } from "@/lib/images";
import MobileNav from "./MobileNav";

/**
 * Header measured from the original site:
 *  - nav links left (Newsreader 400, 16.8px, -0.02em, normal case),
 *    logo centred (250×30 desktop / 160×19 mobile), enquire right
 *  - 51px total height, transparent over the hero banner on pages that have
 *    one (home, weddings, packages, events, our story) with the white logo
 *  - approved UX addition (invisible at rest): scrolling back up mid-page
 *    brings the header in as a solid white bar
 */
const OVERLAY_PATHS = new Set([
  "/",
  "/wedding-flowers-auckland",
  "/wedding-flower-packages",
  "/event-flowers-auckland",
  "/about",
]);

export default function Header() {
  const pathname = (usePathname() || "/").replace(/\/$/, "") || "/";
  const overlay = OVERLAY_PATHS.has(pathname);

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

  const light = overlay && scrollState === "top";

  const linkCls = `font-serif text-[16.8px] font-normal tracking-[-0.02em] transition-opacity hover:opacity-60 ${
    light ? "text-white" : "text-ink"
  }`;

  const headerCls = overlay
    ? `fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-300 ${
        scrollState === "hidden" ? "-translate-y-full" : "translate-y-0"
      } ${
        scrollState === "solid"
          ? "border-b border-hairline bg-white"
          : "border-b border-transparent bg-transparent"
      }`
    : `sticky top-0 z-50 border-b border-hairline bg-white transition-transform duration-300 ${
        scrollState === "hidden" ? "-translate-y-full" : "translate-y-0"
      }`;

  return (
    <header className={headerCls}>
      <div className="relative mx-auto grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-[15px] sm:px-6 sm:py-[10px]">
        {/* Left: desktop nav / mobile burger */}
        <nav aria-label="Main" className="hidden items-center gap-5 md:flex">
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
        <div className="-ml-2 md:hidden">
          <MobileNav light={light} />
        </div>

        {/* Centre: logo */}
        <Link href="/" aria-label="Willow & Peony — home" className="block justify-self-center">
          <img
            src={withBase(
              light ? "/brand/willow-and-peony-logo-white.png" : "/brand/willow-and-peony-logo.png",
            )}
            alt="Willow & Peony"
            width={250}
            height={30}
            className="h-[19px] w-auto sm:h-[30px]"
          />
        </Link>

        {/* Right: enquire */}
        <div className="flex items-center justify-end">
          <Link href="/contact/" className={`${linkCls} py-1 text-[15px] sm:text-[16.8px]`}>
            Enquire
          </Link>
        </div>
      </div>
    </header>
  );
}
