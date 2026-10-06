import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Pic from "@/components/Pic";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { imageOgUrl } from "@/lib/images";
import { getArticle, getArticles } from "@/lib/blog";
import { site } from "../../../../content/site";

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return pageMetadata({
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.description,
    path: `/journal/${article.slug}/`,
    ogImage: article.cover,
    type: "article",
    publishedTime: article.date,
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = getArticles().filter((a) => a.slug !== article.slug).slice(0, 2);
  const nice = new Date(article.date + "T00:00:00").toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: article.title,
            description: article.description,
            url: `${site.domain}/journal/${article.slug}/`,
            datePublished: article.date,
            dateModified: article.date,
            inLanguage: "en-NZ",
            image: imageOgUrl(article.cover, site.domain),
            author: { "@type": "Person", name: site.founder, url: `${site.domain}/about/` },
            publisher: { "@id": `${site.domain}/#florist` },
            mainEntityOfPage: `${site.domain}/journal/${article.slug}/`,
          },
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Journal", path: "/journal/" },
            { name: article.title, path: `/journal/${article.slug}/` },
          ]),
        ]}
      />

      <article>
        {/* Title block */}
        <header className="hero-in mx-auto max-w-[51.25rem] px-5 pt-16 text-center sm:px-6 md:pt-24">
          <p className="eyebrow text-muted">
            The journal · {article.tag}
          </p>
          <h1 className="display-1 mt-5 text-ink">{article.title}</h1>
          <p className="mt-5 text-[0.8125rem] text-muted">
            By {site.founder} · {nice} · {article.readMinutes} min read
          </p>
        </header>

        {/* Cover */}
        <div className="mx-auto mt-12 max-w-[67.5rem] px-5 sm:px-6 md:mt-16">
          <Pic
            name={article.cover}
            alt={article.title}
            sizes="(max-width: 1100px) 100vw, 1032px"
            priority
            className="max-h-[38.75rem] w-full object-cover"
          />
        </div>

        {/* Body */}
        <div
          className="prose-wp mx-auto mt-12 max-w-[42.5rem] px-5 sm:px-6 md:mt-16"
          dangerouslySetInnerHTML={{ __html: article.html }}
        />

        {/* Author */}
        <aside className="mx-auto mt-16 max-w-[42.5rem] px-5 sm:px-6 md:mt-20">
          <div className="flex items-center gap-5 border-y border-hairline py-7">
            <Pic
              name="willow-and-peony-bouquet-ivy-willow-peony-copy-a677a82d-5fc6-4fcd-b72d-c0884402c2e5"
              alt={`${site.founder}, founder of ${site.name}`}
              sizes="72px"
              aspect="1/1"
              className="h-[4.5rem] w-[4.5rem] shrink-0 rounded-full object-cover"
            />
            <div>
              <p className="font-serif text-[1.0625rem] font-light text-ink">
                {site.founder} · founder &amp; lead florist
              </p>
              <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-soft">
                Ivy designs romantic, artful flowers for weddings and events across Auckland.{" "}
                <Link href="/about/" className="underline underline-offset-2">
                  Her story
                </Link>{" "}
                ·{" "}
                <Link href="/work/" className="underline underline-offset-2">
                  her work
                </Link>
              </p>
            </div>
          </div>
        </aside>

        {/* Related articles */}
        {related.length > 0 && (
          <nav aria-label="More from the journal" className="mx-auto mt-20 max-w-[67.5rem] px-5 sm:px-6 md:mt-28">
            <div className="mb-8 flex items-end justify-between">
              <p className="eyebrow text-muted">Keep reading</p>
              <Link href="/journal/" className="t-link text-ink">
                All journal entries
              </Link>
            </div>
            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2">
              {related.map((a) => (
                <Link key={a.slug} href={`/journal/${a.slug}/`} className="group block">
                  <div className="overflow-hidden bg-paper">
                    <Pic
                      name={a.cover}
                      alt=""
                      sizes="(max-width: 640px) 100vw, 50vw"
                      aspect="4/3"
                      className="h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    />
                  </div>
                  <p className="mt-4 text-[0.65625rem] tracking-[0.16em] text-muted uppercase">
                    {a.tag}
                  </p>
                  <h2 className="mt-1.5 font-serif text-[1.25rem] leading-[1.3] font-light text-ink group-hover:underline group-hover:decoration-[1px] group-hover:underline-offset-[0.3125rem]">
                    {a.title}
                  </h2>
                </Link>
              ))}
            </div>
          </nav>
        )}

      </article>
    </>
  );
}
