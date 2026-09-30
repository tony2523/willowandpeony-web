import type { Metadata } from "next";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import Eyebrow from "@/components/Eyebrow";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { getPostsByCategory } from "@/lib/journal";

export const metadata: Metadata = pageMetadata({
  title: "Events — Corporate & Private Event Flower Stories",
  description:
    "Corporate and private events styled by Willow & Peony — sculptural installations, gala dinners and launches at Auckland venues including Park Hyatt and The French Café.",
  path: "/journal/events/",
});

export default function EventJournalPage() {
  const posts = getPostsByCategory("events");
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Journal", path: "/journal/" },
          { name: "Events", path: "/journal/events/" },
        ])}
      />
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
        <div className="text-center">
          <Eyebrow>The journal</Eyebrow>
          <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">Events</h1>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-ink-soft">
            Sculptural installations, gala dinners and corporate functions across Auckland.
          </p>
          <nav aria-label="Journal categories" className="mt-8 flex justify-center gap-3">
            <Link
              href="/journal/"
              className="border border-hairline px-5 py-2 text-[0.75rem] tracking-[0.16em] uppercase text-ink-soft hover:border-ink"
            >
              All
            </Link>
            <Link
              href="/journal/weddings/"
              className="border border-hairline px-5 py-2 text-[0.75rem] tracking-[0.16em] uppercase text-ink-soft hover:border-ink"
            >
              Weddings
            </Link>
            <span className="border border-ink bg-ink px-5 py-2 text-[0.75rem] tracking-[0.16em] uppercase text-ivory">
              Events
            </span>
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
