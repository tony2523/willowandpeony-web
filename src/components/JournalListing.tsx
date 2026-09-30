import Link from "next/link";
import PostCard from "./PostCard";
import type { Post } from "@/lib/journal";

/**
 * Blog listing, measured from the original: small left-aligned serif title
 * (21.6px), 4-column grid of square cards with a 24px gap.
 */
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
    <section className="px-5 pt-14 sm:px-6">
      <div className="flex items-end justify-between">
        <h1 className="h-card text-ink">{title}</h1>
        <nav aria-label="Journal categories" className="flex gap-5">
          {filters.map((f) =>
            f.key === active ? (
              <span key={f.key} className="link-text text-ink">
                {f.label}
              </span>
            ) : (
              <Link key={f.key} href={f.href} className="link-text text-ink-soft hover:text-ink">
                {f.label}
              </Link>
            ),
          )}
        </nav>
      </div>
      <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((post, i) => (
          <PostCard key={post.slug} post={post} priority={i < 4} />
        ))}
      </div>
    </section>
  );
}
