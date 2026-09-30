import type { Metadata } from "next";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import Eyebrow from "@/components/Eyebrow";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { getPostsByCategory } from "@/lib/journal";

export const metadata: Metadata = pageMetadata({
  title: "Real Weddings — Auckland Wedding Flower Stories",
  description:
    "Real Auckland weddings with flowers by Willow & Peony — bridal bouquets, ceremony and reception styling at The Hotel Britomart, Allely Estate, Rydges Formosa and more.",
  path: "/journal/weddings/",
});

export default function WeddingJournalPage() {
  const posts = getPostsByCategory("weddings");
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Journal", path: "/journal/" },
          { name: "Weddings", path: "/journal/weddings/" },
        ])}
      />
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
        <div className="text-center">
          <Eyebrow>The journal</Eyebrow>
          <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">Real weddings</h1>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-ink-soft">
            Bridal bouquets, ceremony flowers and reception styling from real Auckland weddings.
          </p>
          <nav aria-label="Journal categories" className="mt-8 flex justify-center gap-3">
            <Link
              href="/journal/"
              className="border border-hairline px-5 py-2 text-[0.75rem] tracking-[0.16em] uppercase text-ink-soft hover:border-ink"
            >
              All
            </Link>
            <span className="border border-ink bg-ink px-5 py-2 text-[0.75rem] tracking-[0.16em] uppercase text-ivory">
              Weddings
            </span>
            <Link
              href="/journal/events/"
              className="border border-hairline px-5 py-2 text-[0.75rem] tracking-[0.16em] uppercase text-ink-soft hover:border-ink"
            >
              Events
            </Link>
          </nav>
        </div>
        <div className="mt-14 grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <PostCard key={post.slug} post={post} priority={i < 3} />
          ))}
        </div>
      </section>
    </>
  );
}
