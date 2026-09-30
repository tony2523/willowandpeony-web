import Link from "next/link";
import { nav } from "../../content/site";
import { withBase } from "@/lib/images";
import MobileNav from "./MobileNav";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-ivory/92 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-[1.15rem] sm:px-6">
        <Link href="/" aria-label="Willow & Peony — home" className="block">
          <img
            src={withBase("/brand/willow-and-peony-logo.png")}
            alt="Willow & Peony"
            width={250}
            height={30}
            className="h-[20px] w-auto sm:h-[26px]"
          />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[0.8rem] tracking-[0.14em] uppercase text-ink-soft transition-colors hover:text-rose-deep"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact/"
            className="border border-ink px-4 py-2 text-[0.8rem] tracking-[0.14em] uppercase text-ink transition-colors hover:bg-ink hover:text-ivory"
          >
            Enquire
          </Link>
        </nav>

        {/* Mobile nav — slide-in burger drawer */}
        <MobileNav />
      </div>
    </header>
  );
}
