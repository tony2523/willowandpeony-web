import Link from "next/link";
import Pic from "./Pic";
import type { Post } from "@/lib/journal";
import { site } from "../../content/site";

export default function PostCard({ post, priority = false }: { post: Post; priority?: boolean }) {
  const date = new Date(post.date + "T00:00:00");
  const nice = date.toLocaleDateString("en-NZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return (
    <article className="group">
      <Link href={`/journal/${post.slug}/`} className="block">
        <div className="overflow-hidden bg-blush">
          <Pic
            name={post.cover}
            alt={post.title}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            aspect="4/5"
            priority={priority}
            className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
        </div>
        <h3 className="mt-4 font-serif text-[1.05rem] leading-snug text-ink group-hover:underline">
          {post.title}
        </h3>
      </Link>
      <p className="mt-1.5 text-xs text-muted">
        <time dateTime={post.date}>{nice}</time> · {site.founder}
      </p>
    </article>
  );
}
