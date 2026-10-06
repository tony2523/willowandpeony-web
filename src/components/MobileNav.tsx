"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { drawerNav } from "../../content/site";
import { withBase } from "@/lib/images";

/** Full-screen mobile menu (burger). Everything fits one phone screen, no scrolling. */
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
    <div className="lg:hidden">
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
            className={`absolute top-0 left-0 h-px w-6 ${light ? "bg-white" : "bg-ink"} transition-transform duration-300 ${
              open ? "translate-y-[0.4375rem] rotate-45" : ""
            }`}
          />
          <span
            aria-hidden
            className={`absolute top-[0.4375rem] left-0 h-px w-6 ${light ? "bg-white" : "bg-ink"} transition-opacity duration-200 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            aria-hidden
            className={`absolute top-[0.875rem] left-0 h-px w-6 ${light ? "bg-white" : "bg-ink"} transition-transform duration-300 ${
              open ? "-translate-y-[0.4375rem] -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      {/* Drawer links don't prefetch: the closed drawer sits just off-canvas,
          inside Next's prefetch margin, so every phone visit would otherwise
          fetch every page (and its hero image) before this page's own LCP. */}
      {/* Backdrop + drawer are portalled to <body> — the blurred sticky
          header would otherwise become their containing block. */}
      {mounted &&
        createPortal(
          <>
            <nav
              id="mobile-drawer"
              aria-label="Mobile"
              inert={!open}
              className={`fixed inset-0 z-[65] flex w-full flex-col bg-white transition-[translate] duration-500 ease-[var(--ease-out)] ${
                open ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="flex items-center justify-between border-b border-hairline px-6 py-5">
                <Link href="/" prefetch={false} onClick={() => setOpen(false)} aria-label="Willow & Peony — home">
                  <img
                    src={withBase("/brand/willow-and-peony-logo.png")}
                    alt="Willow & Peony"
                    width={250}
                    height={30}
                    className="h-[1.25rem] w-auto"
                  />
                </Link>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="-mr-2 flex h-10 w-10 items-center justify-center"
                >
                  {/* Same line weight and width as the burger's three lines. */}
                  <span aria-hidden className="relative block h-3.5 w-6">
                    <span className="absolute top-[0.4375rem] left-0 h-px w-6 rotate-45 bg-ink" />
                    <span className="absolute top-[0.4375rem] left-0 h-px w-6 -rotate-45 bg-ink" />
                  </span>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-2 [@media(min-height:700px)]:py-4">
                {drawerNav.map((item, i) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={false}
                    onClick={() => setOpen(false)}
                    style={{ transitionDelay: open ? `${120 + i * 45}ms` : "0ms" }}
                    className={`block border-b border-hairline py-3 font-serif text-[1.0625rem] font-light tracking-[-0.01em] text-ink transition-[opacity,translate] duration-500 ease-[var(--ease-out)] [@media(max-height:600px)]:py-2.5 [@media(min-height:700px)]:py-4 ${
                      open ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/wedding-flower-calendar/"
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  className="mt-5 block text-sm text-ink-soft underline underline-offset-4 hover:text-ink"
                >
                  Free wedding flower calendar
                </Link>
                <Link
                  href="/contact/"
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  className="btn-solid mt-6 block text-center"
                >
                  Enquire
                </Link>
              </div>
            </nav>
          </>,
          document.body,
        )}
    </div>
  );
}
