import Link from "next/link";
import Pic from "./Pic";
import type { Post } from "@/lib/journal";

export default function PostCard({ post, priority = false }: { post: Post; priority?: boolean }) {
  const date = new Date(post.date + "T00:00:00");
  const nice = date.toLocaleDateString("en-NZ", { day: "numeric", month: "long", year: "numeric" });
  return (
    <article className="group">
      <Link href={`/journal/${post.slug}/`} className="block">
        <div className="overflow-hidden bg-blush">
          <Pic
            name={post.cover}
            alt={post.title}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            aspect="4/5"
            priority={priority}
            className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </div>
        <h3 className="mt-4 font-serif text-lg leading-snug text-ink group-hover:text-rose-deep">
          {post.title}
        </h3>
      </Link>
      <p className="mt-1.5 text-xs tracking-[0.08em] text-muted uppercase">
        {post.venue ? `${post.venue} · ` : ""}
        <time dateTime={post.date}>{nice}</time>
      </p>
    </article>
  );
}
