import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Pic from "@/components/Pic";
import PostCard from "@/components/PostCard";
import Eyebrow from "@/components/Eyebrow";
import CtaBand from "@/components/CtaBand";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { getPost, getPosts } from "@/lib/journal";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/journal/${post.slug}/`,
    ogImage: post.cover,
    type: "article",
    publishedTime: post.date,
  });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const all = getPosts();
  const related = all
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);
  // Prev/next within the same category (posts are sorted newest-first):
  // "previous" is the older post, "next" the newer one.
  const inCategory = all.filter((p) => p.category === post.category);
  const idx = inCategory.findIndex((p) => p.slug === post.slug);
  const newer = idx > 0 ? inCategory[idx - 1] : undefined;
  const older = idx >= 0 && idx < inCategory.length - 1 ? inCategory[idx + 1] : undefined;
  const date = new Date(post.date + "T00:00:00");
  const nice = date.toLocaleDateString("en-NZ", { day: "numeric", month: "long", year: "numeric" });
  const catLabel = post.category === "weddings" ? "Weddings" : "Events";
  const catPath = `/journal/${post.category}/`;

  return (
    <>
      <JsonLd
        data={[
          articleJsonLd({
            title: post.title,
            description: post.description,
            path: `/journal/${post.slug}/`,
            date: post.date,
            cover: post.cover,
            venue: post.venue,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Journal", path: "/journal/" },
            { name: catLabel, path: catPath },
            { name: post.title, path: `/journal/${post.slug}/` },
          ]),
        ]}
      />

      <article>
        <header className="mx-auto max-w-3xl px-4 pt-14 text-center sm:px-6">
          <nav aria-label="Breadcrumb" className="text-[0.72rem] tracking-[0.14em] uppercase text-muted">
            <Link href="/journal/" className="hover:text-rose-deep">
              Journal
            </Link>
            <span aria-hidden> / </span>
            <Link href={catPath} className="hover:text-rose-deep">
              {catLabel}
            </Link>
          </nav>
          <h1 className="mt-5 font-serif text-3xl leading-[1.15] text-ink sm:text-[2.6rem]">
            {post.title}
          </h1>
          <p className="mt-4 text-xs tracking-[0.1em] uppercase text-muted">
            {post.venue && <>{post.venue} · </>}
            <time dateTime={post.date}>{nice}</time> · By Ivy Diao
          </p>
        </header>

        <div className="mx-auto mt-10 max-w-4xl px-4 sm:px-6">
          <Pic
            name={post.cover}
            alt={post.title}
            sizes="(max-width: 900px) 100vw, 860px"
            priority
            className="h-auto w-full"
          />
        </div>

        <div
          className="prose-wp mx-auto max-w-[760px] px-4 pt-4 sm:px-6"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        <footer className="mx-auto mt-14 max-w-[760px] border-t border-hairline px-4 pt-8 sm:px-6">
          <p className="text-sm leading-relaxed text-muted">
            Planning {post.category === "weddings" ? "your wedding flowers" : "an event"} in
            Auckland?{" "}
            <Link href="/contact/" className="text-rose-deep underline underline-offset-2">
              Get in touch
            </Link>{" "}
            — we&rsquo;d love to hear your plans.
          </p>

          {(older || newer) && (
            <nav
              aria-label="Post navigation"
              className="mt-10 flex flex-col gap-6 border-t border-hairline pt-8 sm:flex-row sm:justify-between sm:gap-10"
            >
              <div className="sm:max-w-[46%]">
                {older && (
                  <Link href={`/journal/${older.slug}/`} className="group block">
                    <span className="text-[0.72rem] tracking-[0.14em] uppercase text-muted">
                      ← Previous post
                    </span>
                    <span className="mt-1.5 block font-serif text-[1.05rem] leading-snug text-ink group-hover:underline">
                      {older.title}
                    </span>
                  </Link>
                )}
              </div>
              <div className="sm:max-w-[46%] sm:text-right">
                {newer && (
                  <Link href={`/journal/${newer.slug}/`} className="group block">
                    <span className="text-[0.72rem] tracking-[0.14em] uppercase text-muted">
                      Next post →
                    </span>
                    <span className="mt-1.5 block font-serif text-[1.05rem] leading-snug text-ink group-hover:underline">
                      {newer.title}
                    </span>
                  </Link>
                )}
              </div>
            </nav>
          )}
        </footer>
      </article>

      {related.length > 0 && (
        <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
          <Eyebrow>Keep reading</Eyebrow>
          <h2 className="mt-3 font-serif text-2xl text-ink sm:text-3xl">
            More {post.category === "weddings" ? "real weddings" : "events"}
          </h2>
          <div className="mt-8 grid gap-x-7 gap-y-12 sm:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}

      <CtaBand
        title={
          post.category === "weddings"
            ? "Dreaming up your own wedding flowers?"
            : "Planning an event that deserves beautiful flowers?"
        }
        buttonLabel="Start an enquiry"
        buttonHref="/contact/"
        secondaryLabel={post.category === "weddings" ? "Wedding packages" : "Event flowers"}
        secondaryHref={
          post.category === "weddings" ? "/wedding-flower-packages/" : "/event-flowers-auckland/"
        }
      />
    </>
  );
}
