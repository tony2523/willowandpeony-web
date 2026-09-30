import Link from "next/link";
import Pic from "./Pic";
import type { Post } from "@/lib/journal";
import { site } from "../../content/site";

/** Journal card, measured from the original: square image, 21.6px serif
 *  title, "26/08/2026 Ivy Diao" meta line in 15px grey. */
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
            aspect="1/1"
            priority={priority}
            className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
        </div>
        <h3 className="h-card mt-4 text-ink group-hover:underline">{post.title}</h3>
      </Link>
      <p className="mt-1.5 text-[15px] text-ink-soft">
        <time dateTime={post.date}>{nice}</time> <span className="ml-2">{site.founder}</span>
      </p>
    </article>
  );
}
