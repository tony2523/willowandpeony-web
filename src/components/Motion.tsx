"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Site-wide motion, kept deliberately quiet (Tony, 6 Oct 2026):
 *  - Scroll reveal: block-level items (headings, text, cards, photos, forms)
 *    that start below the fold fade up once as they come into view, lightly
 *    staggered. Anything visible when the page opens is never hidden, so the
 *    first paint (and the speed scores) are untouched.
 *  - Lazy photos below the fold fade in when they arrive instead of popping.
 *  - In-page links (#enquire) scroll smoothly.
 * All of it is skipped when the visitor prefers reduced motion. Styles live in
 * globals.css ([data-reveal], img[data-img-loading]).
 */
const TARGETS = "h2, h3, .eyebrow, p, li, figure, blockquote, article, img, form, .btn-solid, .btn-outline, .t-link";
// Never reveal: chrome, dialogs, collapsed or sideways-scrolling content (it may
// never cross the screen vertically), fixed bars and the banners (own entrance).
const SKIP =
  'header, footer, nav, [role=dialog], [hidden], details, .carousel, [class*="overflow-x-auto"], [class*="overflow-x-scroll"], .fixed, .sticky, .hero-in, [data-no-reveal]';
function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function fadeWhenLoaded(img: HTMLImageElement) {
  if (img.complete || img.dataset.imgLoading !== undefined) return;
  img.dataset.imgLoading = "";
  const done = () => {
    delete img.dataset.imgLoading;
    img.dataset.imgLoaded = "";
    window.setTimeout(() => delete img.dataset.imgLoaded, 1000);
  };
  img.addEventListener("load", done, { once: true });
  img.addEventListener("error", done, { once: true });
}

export default function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    if (reducedMotion()) return;
    const main = document.querySelector("main");
    if (!main) return;

    // No fade on page changes: it can only start after the new page has
    // painted once, so it reads as a blink (Tony, 6 Oct 2026).
    const vh = window.innerHeight;
    const candidates = [...main.querySelectorAll<HTMLElement>(TARGETS)].filter((el) => !el.closest(SKIP));
    const set = new Set(candidates);
    const targets = candidates.filter((el) => {
      // Reveal the outermost block only (a card animates, not each line in it).
      for (let p = el.parentElement; p && p !== main; p = p.parentElement) if (set.has(p)) return false;
      const r = el.getBoundingClientRect();
      return r.height > 0 && r.top >= vh; // below the fold at load
    });

    const io = new IntersectionObserver(
      (entries) => {
        let n = 0;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          const delay = Math.min(n, 5) * 0.07;
          el.style.setProperty("--reveal-delay", `${delay}s`);
          el.dataset.reveal = "in";
          n++;
          io.unobserve(el);
          // Once revealed, step aside so the element's own transitions (button
          // sweeps, photo hover zooms) work again.
          window.setTimeout(() => {
            delete el.dataset.reveal;
            el.style.removeProperty("--reveal-delay");
          }, (delay + 1) * 1000);
        }
      },
      { rootMargin: "0px 0px -6% 0px" },
    );
    for (const el of targets) {
      el.dataset.reveal = "";
      io.observe(el);
    }

    // Lazy photos below the fold, and any added later (gallery filters, etc.).
    main.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((img) => {
      if (img.getBoundingClientRect().top >= vh) fadeWhenLoaded(img);
    });
    const mo = new MutationObserver((records) => {
      for (const r of records)
        r.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          const imgs = node instanceof HTMLImageElement ? [node] : [...node.querySelectorAll("img")];
          imgs.forEach((img) => img.loading === "lazy" && fadeWhenLoaded(img));
        });
    });
    mo.observe(main, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  // Smooth scrolling for same-page links such as "Start an enquiry" (#enquire).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as Element).closest?.("a[href*='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const url = new URL(a.href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;
      const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
      history.replaceState(null, "", url.hash);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
