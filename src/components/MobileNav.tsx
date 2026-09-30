"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { nav, site } from "../../content/site";
import { withBase } from "@/lib/images";

/** Drawer shows the main nav plus Journal (kept out of the top bar to match
 *  the original site's header). */
const drawerLinks = [
  ...nav.slice(0, 3),
  { label: "Journal", href: "/journal/" },
  ...nav.slice(3),
];

/** Slide-in mobile navigation drawer (burger menu). */
export default function MobileNav({ light = false }: { light?: boolean }) {
  const [open, setOpen] = useState(false);
  // true after hydration — the drawer portal can only render client-side
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-drawer"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen(!open)}
        className="relative z-[70] flex h-10 w-10 items-center justify-center"
      >
        <span className="relative block h-3.5 w-6">
          <span
            aria-hidden
            className={`absolute left-0 top-0 h-px w-6 ${light ? "bg-white" : "bg-ink"} transition-transform duration-300 ${
              open ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            aria-hidden
            className={`absolute left-0 top-[7px] h-px w-6 ${light ? "bg-white" : "bg-ink"} transition-opacity duration-200 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            aria-hidden
            className={`absolute left-0 top-[14px] h-px w-6 ${light ? "bg-white" : "bg-ink"} transition-transform duration-300 ${
              open ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      {/* Backdrop + drawer are portalled to <body> — the blurred sticky
          header would otherwise become their containing block. */}
      {mounted &&
        createPortal(
          <>
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[60] bg-ink/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <nav
        id="mobile-drawer"
        aria-label="Mobile"
        className={`fixed inset-y-0 left-0 z-[65] flex w-[85%] max-w-sm flex-col bg-ivory shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-hairline px-6 py-5">
          <Link href="/" onClick={() => setOpen(false)} aria-label="Willow & Peony — home">
            <img
              src={withBase("/brand/willow-and-peony-logo.png")}
              alt="Willow & Peony"
              width={250}
              height={30}
              className="h-[20px] w-auto"
            />
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="-mr-2 flex h-9 w-9 items-center justify-center text-2xl font-light text-ink"
          >
            <span aria-hidden>×</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {drawerLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block border-b border-hairline py-4 font-serif text-[16.8px] tracking-[-0.02em] text-ink"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/wedding-flower-calendar/"
            onClick={() => setOpen(false)}
            className="mt-5 block text-sm text-ink-soft underline underline-offset-4 hover:text-ink"
          >
            Free wedding flower calendar
          </Link>
          <Link
            href="/contact/"
            onClick={() => setOpen(false)}
            className="mt-6 block border border-ink px-6 py-3 text-center text-[0.8rem] tracking-[0.16em] uppercase text-ink transition-colors hover:bg-ink hover:text-ivory"
          >
            Enquire
          </Link>
        </div>
        <div className="border-t border-hairline px-6 py-5 text-sm text-muted">
          <a href={`mailto:${site.email}`} className="block hover:text-rose-deep">
            {site.email}
          </a>
          <a
            href={`tel:${site.phone.replace(/\s/g, "")}`}
            className="mt-1 block hover:text-rose-deep"
          >
            {site.phoneDisplay}
          </a>
        </div>
      </nav>
          </>,
          document.body,
        )}
    </div>
  );
}
