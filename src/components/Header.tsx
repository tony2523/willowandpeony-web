"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "../../content/site";
import { withBase } from "@/lib/images";
import MobileNav from "./MobileNav";

/**
 * Header matched to the original site: nav links left, centred logo,
 * enquire link right.
 *
 * On the home page it sits transparent over the hero (white logo). Once the
 * visitor scrolls down it hides; scrolling back up brings it in as a solid
 * white bar, so navigation is always within reach mid-page.
 * Every other page gets the plain sticky white header.
 */
export default function Header() {
  const pathname = usePathname() || "/";
  const overlay = pathname === "/";

  // Home-only scroll state: "top" (transparent), "hidden", "solid" (scrolling up)
  const [scrollState, setScrollState] = useState<"top" | "hidden" | "solid">("top");
  const lastY = useRef(0);

  useEffect(() => {
    if (!overlay) return;
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
  }, [overlay]);

  const light = overlay && scrollState === "top";

  const colorCls = light
    ? "text-white/95 transition-opacity hover:opacity-70"
    : "text-ink transition-opacity hover:opacity-60";
  const linkCls = `text-[0.72rem] tracking-[0.08em] uppercase ${colorCls}`;
  // Slightly smaller on phones so logo / burger / enquire breathe.
  const enquireCls = `py-2 text-[0.68rem] tracking-[0.05em] uppercase sm:text-[0.72rem] sm:tracking-[0.08em] ${colorCls}`;

  const headerCls = overlay
    ? `fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-300 ${
        scrollState === "hidden" ? "-translate-y-full" : "translate-y-0"
      } ${
        scrollState === "solid"
          ? "border-b border-hairline bg-white"
          : "border-b border-transparent bg-transparent"
      }`
    : "sticky top-0 z-50 border-b border-hairline bg-white";

  return (
    <header className={headerCls}>
      <div className="relative mx-auto grid max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-4 sm:gap-6 sm:px-8 sm:py-5">
        {/* Left: desktop nav / mobile burger */}
        <nav aria-label="Main" className="hidden items-center gap-5 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={linkCls}
              aria-current={pathname === item.href ? "page" : undefined}
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
            className="h-[17px] w-auto sm:h-[26px]"
          />
        </Link>

        {/* Right: enquire (all breakpoints) */}
        <div className="flex items-center justify-end">
          <Link href="/contact/" className={enquireCls}>
            Enquire
          </Link>
        </div>
      </div>
    </header>
  );
}
