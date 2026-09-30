import Link from "next/link";
import PostCard from "./PostCard";
import type { Post } from "@/lib/journal";

/** Journal listing — editorial header with category chips, 3-up card grid. */
export default function JournalListing({
  title,
  posts,
  active,
}: {
  title: string;
  posts: Post[];
  active: "all" | "weddings" | "events";
}) {
  const filters = [
    { key: "all", label: "All", href: "/journal/" },
    { key: "weddings", label: "Weddings", href: "/journal/weddings/" },
    { key: "events", label: "Events", href: "/journal/events/" },
  ] as const;
  return (
    <section className="mx-auto max-w-[1280px] px-5 pt-16 sm:px-6 md:pt-24">
      <p className="eyebrow text-muted">The journal</p>
      <h1 className="display-1 mt-3 text-ink">{title}</h1>
      <nav aria-label="Journal categories" className="mt-8 flex flex-wrap gap-2.5">
        {filters.map((f) =>
          f.key === active ? (
            <span
              key={f.key}
              className="bg-ink px-4 py-2.5 text-[11px] tracking-[0.14em] text-white uppercase"
              aria-current="page"
            >
              {f.label}
            </span>
          ) : (
            <Link
              key={f.key}
              href={f.href}
              className="border border-hairline px-4 py-2.5 text-[11px] tracking-[0.14em] text-ink-soft uppercase transition-colors hover:border-ink"
            >
              {f.label}
            </Link>
          ),
        )}
      </nav>
      <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <PostCard key={post.slug} post={post} priority={i < 3} />
        ))}
      </div>
    </section>
  );
}
