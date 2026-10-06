import Link from "next/link";
import Eyebrow from "@/components/Eyebrow";

export default function NotFound() {
  return (
    <section className="hero-in mx-auto max-w-2xl px-4 pt-24 pb-10 text-center sm:px-6">
      <Eyebrow>404</Eyebrow>
      <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">
        This page has wilted away
      </h1>
      <p className="mx-auto mt-6 max-w-md leading-relaxed text-ink-soft">
        The page you&rsquo;re looking for doesn&rsquo;t exist or has moved. Perhaps one of these
        will help:
      </p>
      <nav className="mt-9 flex flex-wrap justify-center gap-4" aria-label="Helpful links">
        <Link
          href="/"
          className="border border-ink px-6 py-2.5 text-[0.78rem] tracking-[0.16em] uppercase text-ink transition-colors hover:bg-ink hover:text-ivory"
        >
          Home
        </Link>
        <Link
          href="/wedding-flowers-auckland/"
          className="border border-hairline px-6 py-2.5 text-[0.78rem] tracking-[0.16em] uppercase text-ink-soft transition-colors hover:border-ink hover:text-ink"
        >
          Wedding flowers
        </Link>
        <Link
          href="/journal/"
          className="border border-hairline px-6 py-2.5 text-[0.78rem] tracking-[0.16em] uppercase text-ink-soft transition-colors hover:border-ink hover:text-ink"
        >
          Journal
        </Link>
        <Link
          href="/contact/"
          className="border border-hairline px-6 py-2.5 text-[0.78rem] tracking-[0.16em] uppercase text-ink-soft transition-colors hover:border-ink hover:text-ink"
        >
          Contact
        </Link>
      </nav>
    </section>
  );
}
