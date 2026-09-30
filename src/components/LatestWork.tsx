import Link from "next/link";
import Pic from "./Pic";
import { postMeta } from "./PostCard";
import type { Post } from "@/lib/journal";

/**
 * Reusable "Latest work" module (Home, Weddings, Events, Our Story):
 * two large cards per row, per the approved boards. The heading link
 * lands on /work/, pre-filtered by origin.
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
      <div className="grid gap-x-6 gap-y-12 md:grid-cols-2">
        {posts.slice(0, 2).map((post) => (
          <article key={post.slug} className="group">
            <Link href={`/journal/${post.slug}/`} className="block">
              <div className="overflow-hidden bg-paper">
                <Pic
                  name={post.cover}
                  alt={post.title}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  aspect="4/3"
                  className="h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
              </div>
              <h3 className="mt-4 font-serif text-[21px] leading-[1.3] font-light text-ink group-hover:underline group-hover:underline-offset-4 md:text-[23px]">
                {post.title}
              </h3>
            </Link>
            <p className="mt-2 text-[10.5px] tracking-[0.14em] text-muted uppercase">
              {postMeta(post)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
