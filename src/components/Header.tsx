"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "../../content/site";
import { withBase } from "@/lib/images";
import MobileNav from "./MobileNav";

/**
 * Header matched to the original site: nav links left, centred logo,
 * enquire link right. Transparent with the white logo over the home hero;
 * solid white with the dark logo everywhere else.
 */
export default function Header() {
  const pathname = usePathname() || "/";
  const overlay = pathname === "/";

  const linkCls = overlay
    ? "text-[0.72rem] tracking-[0.08em] uppercase text-white/95 transition-opacity hover:opacity-70"
    : "text-[0.72rem] tracking-[0.08em] uppercase text-ink transition-opacity hover:opacity-60";

  return (
    <header
      className={
        overlay
          ? "absolute inset-x-0 top-0 z-50"
          : "sticky top-0 z-50 border-b border-hairline bg-white"
      }
    >
      <div className="relative mx-auto grid max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center px-4 py-5 sm:px-8">
        {/* Left: desktop nav / mobile burger */}
        <nav aria-label="Main" className="hidden items-center gap-5 md:flex">
          {nav.slice(0, 5).map((item) => (
            <Link key={item.href} href={item.href} className={linkCls}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="md:hidden">
          <MobileNav light={overlay} />
        </div>

        {/* Centre: logo */}
        <Link href="/" aria-label="Willow & Peony — home" className="block justify-self-center">
          <img
            src={withBase(
              overlay
                ? "/brand/willow-and-peony-logo-white.png"
                : "/brand/willow-and-peony-logo.png",
            )}
            alt="Willow & Peony"
            width={250}
            height={30}
            className="h-[22px] w-auto sm:h-[26px]"
          />
        </Link>

        {/* Right: enquire */}
        <div className="flex items-center justify-end">
          <Link href="/contact/" className={`hidden md:block ${linkCls}`}>
            Enquire
          </Link>
        </div>
      </div>
    </header>
  );
}
