"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "../../content/site";
import { withBase } from "@/lib/images";
import MobileNav from "./MobileNav";

/**
 * Header measured from the original site:
 *  - 51px bar; desktop nav links Chivo 400 13.5px, 24px apart, starting at
 *    x=24, padded to full bar height; centred logo 250×30 (160×19 mobile)
 *  - transparent (white text/logo) over the hero banner on home, weddings,
 *    packages, events and our story; hovering the bar turns it white with
 *    black links and the dark logo (as on the live site)
 *  - hover shows the theme's animated underline on nav links
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

  // Transparent state only at the top of overlay pages; hovering the bar
  // switches it to the solid palette via CSS (group-hover) below.
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
      <div className="relative mx-auto grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 sm:px-6">
        {/* Left: desktop nav / mobile burger */}
        <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
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
        <div className="-ml-2 py-[15px] md:hidden">
          <MobileNav light={transparent} />
        </div>

        {/* Centre: logo — dark/white variants swapped by header state */}
        <Link href="/" aria-label="Willow & Peony — home" className="block justify-self-center">
          <img
            src={withBase("/brand/willow-and-peony-logo-white.png")}
            alt="Willow & Peony"
            width={250}
            height={30}
            className={`h-[19px] w-auto sm:h-[30px] ${transparent ? "block group-hover:hidden" : "hidden"}`}
          />
          <img
            src={withBase("/brand/willow-and-peony-logo.png")}
            alt="Willow & Peony"
            width={250}
            height={30}
            className={`h-[19px] w-auto sm:h-[30px] ${transparent ? "hidden group-hover:block" : "block"}`}
          />
        </Link>

        {/* Right: enquire */}
        <div className="flex items-center justify-end">
          <Link href="/contact/" className={linkCls}>
            Enquire
          </Link>
        </div>
      </div>
    </header>
  );
}
