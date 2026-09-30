import Link from "next/link";
import Pic from "./Pic";
import type { Post } from "@/lib/journal";

export function postMeta(post: Post): string {
  const date = new Date(post.date + "T00:00:00");
  const nice = date.toLocaleDateString("en-NZ", { month: "short", year: "numeric" });
  return `${post.category === "weddings" ? "Weddings" : "Events"} · ${nice}`;
}

/** Editorial story card: portrait cover, serif title, small caps meta. */
export default function PostCard({ post, priority = false }: { post: Post; priority?: boolean }) {
  return (
    <article className="group">
      <Link href={`/journal/${post.slug}/`} className="block">
        <div className="overflow-hidden bg-paper">
          <Pic
            name={post.cover}
            alt={post.title}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            aspect="4/5"
            priority={priority}
            className="h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
        </div>
        <h3 className="h-card mt-4 text-ink group-hover:underline group-hover:decoration-[1px] group-hover:underline-offset-[5px]">
          {post.title}
        </h3>
      </Link>
      <p className="mt-2 text-[10.5px] tracking-[0.14em] text-muted uppercase">{postMeta(post)}</p>
    </article>
  );
}
