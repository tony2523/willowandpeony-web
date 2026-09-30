import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Pic from "@/components/Pic";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { getPost, getPosts } from "@/lib/journal";
import { site } from "../../../../content/site";

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
  const inCategory = all.filter((p) => p.category === post.category);
  const idx = inCategory.findIndex((p) => p.slug === post.slug);
  const newer = idx > 0 ? inCategory[idx - 1] : undefined;
  const older = idx >= 0 && idx < inCategory.length - 1 ? inCategory[idx + 1] : undefined;
  const date = new Date(post.date + "T00:00:00");
  const nice = date.toLocaleDateString("en-NZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
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
        {/* Header, as on the original: date + author caption above a centred
            28.6px title in a 608px column */}
        <header className="mx-auto max-w-[640px] px-5 pt-14 text-center sm:px-6">
          <p className="text-[15px] text-ink-soft">
            <time dateTime={post.date}>{nice}</time>{" "}
            <span className="ml-2">{site.founder}</span>
          </p>
          <h1 className="h-page mt-3 text-ink">{post.title}</h1>
        </header>

        {/* Cover — 972px wide on the original */}
        <div className="mx-auto mt-10 max-w-[972px] px-5 sm:px-6">
          <Pic
            name={post.cover}
            alt={post.title}
            sizes="(max-width: 1000px) 100vw, 972px"
            priority
            className="h-auto w-full"
          />
        </div>

        {/* Body — 608px column (measured) */}
        <div
          className="prose-wp mx-auto max-w-[608px] px-5 pt-2 sm:px-6"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        <footer className="mx-auto mt-14 max-w-[608px] px-5 sm:px-6">
          <p className="text-[15px] leading-[1.4] text-ink-soft">
            Planning {post.category === "weddings" ? "your wedding flowers" : "an event"} in
            Auckland?{" "}
            <Link href="/contact/" className="text-ink underline underline-offset-2">
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
                    <span className="label text-ink-soft">← Previous post</span>
                    <span className="h-card mt-1.5 block text-ink group-hover:underline">
                      {older.title}
                    </span>
                  </Link>
                )}
              </div>
              <div className="sm:max-w-[46%] sm:text-right">
                {newer && (
                  <Link href={`/journal/${newer.slug}/`} className="group block">
                    <span className="label text-ink-soft">Next post →</span>
                    <span className="h-card mt-1.5 block text-ink group-hover:underline">
                      {newer.title}
                    </span>
                  </Link>
                )}
              </div>
            </nav>
          )}
        </footer>
      </article>
    </>
  );
}
