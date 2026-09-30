import type { Metadata } from "next";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import Eyebrow from "@/components/Eyebrow";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { getPosts } from "@/lib/journal";

export const metadata: Metadata = pageMetadata({
  title: "Journal — Real Weddings & Events",
  description:
    "Real weddings and events by Willow & Peony — floral stories from Auckland venues including The Hotel Britomart, Allely Estate, Bridgewater Estate and more.",
  path: "/journal/",
});

export default function JournalPage() {
  const posts = getPosts();
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Journal", path: "/journal/" },
        ])}
      />
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
        <div className="text-center">
          <Eyebrow>The journal</Eyebrow>
          <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">Our latest work</h1>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-ink-soft">
            Real weddings, events and styled shoots — the stories behind our favourite floral
            moments across Auckland and beyond.
          </p>
          <nav aria-label="Journal categories" className="mt-8 flex justify-center gap-3">
            <span className="border border-ink bg-ink px-5 py-2 text-[0.75rem] tracking-[0.16em] uppercase text-ivory">
              All
            </span>
            <Link
              href="/journal/weddings/"
              className="border border-hairline px-5 py-2 text-[0.75rem] tracking-[0.16em] uppercase text-ink-soft hover:border-ink"
            >
              Weddings
            </Link>
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
