import Link from "next/link";
import PostCard from "./PostCard";
import type { Post } from "@/lib/journal";

/**
 * Reusable "Latest work" three-card module (Home, Weddings, Events,
 * Our Story). The heading link lands on /work/, pre-filtered by origin.
 */
export default function LatestWork({
  posts,
  eyebrow = "The journal",
  title = "Our latest work",
  href = "/work/",
}: {
  posts: Post[];
  eyebrow?: string;
  title?: string;
  href?: string;
}) {
  return (
    <section className="mx-auto max-w-[1280px] px-5 sm:px-6">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-muted">{eyebrow}</p>
          <h2 className="display-2 mt-3 text-ink">{title}</h2>
        </div>
        <Link href={href} className="t-link text-ink">
          All our work
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 3).map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
