import type { Metadata } from "next";
import Link from "next/link";
import Pic from "@/components/Pic";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { getArticles } from "@/lib/blog";
import { site } from "../../../content/site";

export const metadata: Metadata = pageMetadata({
  title: "The Journal: Notes from the Studio",
  description:
    "Florist's notes from Willow & Peony: seasonal flower guides, honest planning advice and the stories behind Auckland weddings and events, by Ivy Diao.",
  path: "/journal/",
});

function nice(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function JournalPage() {
  const articles = getArticles();
  const [featured, ...rest] = articles;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Journal", path: "/journal/" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            "@id": `${site.domain}/journal/#blog`,
            name: `${site.name} — The Journal`,
            url: `${site.domain}/journal/`,
            author: { "@type": "Person", name: site.founder },
            blogPost: articles.map((a) => ({
              "@type": "BlogPosting",
              headline: a.title,
              url: `${site.domain}/journal/${a.slug}/`,
              datePublished: a.date,
            })),
          },
        ]}
      />

      <section className="mx-auto max-w-[1080px] px-5 pt-16 sm:px-6 md:pt-24">
        <p className="eyebrow text-muted">The journal</p>
        <h1 className="display-1 mt-3 text-ink">
          Notes from the <em>studio</em>
        </h1>
        <p className="mt-5 max-w-[560px] text-[15px] leading-[1.7] font-light text-ink-soft">
          Seasonal guides, honest planning advice and the thinking behind the designs — written
          by {site.founder}. Looking for real weddings and events? They live in{" "}
          <Link href="/work/" className="underline underline-offset-2">
            our work
          </Link>
          .
        </p>
      </section>

      {/* Featured latest article */}
      {featured && (
        <section className="mx-auto mt-14 max-w-[1080px] px-5 sm:px-6 md:mt-20">
          <Link href={`/journal/${featured.slug}/`} className="group grid gap-8 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:items-center md:gap-12">
            <div className="overflow-hidden bg-paper">
              <Pic
                name={featured.cover}
                alt=""
                sizes="(max-width: 768px) 100vw, 620px"
                aspect="4/3"
                priority
                className="h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
            </div>
            <div>
              <p className="eyebrow text-muted">
                Latest · {featured.tag}
              </p>
              <h2 className="mt-4 font-serif text-[26px] leading-[1.22] font-light text-ink group-hover:underline group-hover:decoration-[1px] group-hover:underline-offset-[5px] md:text-[32px]">
                {featured.title}
              </h2>
              <p className="mt-4 max-w-[440px] text-[14px] leading-[1.7] text-ink-soft">
                {featured.description}
              </p>
              <p className="mt-5 text-[12px] text-muted">
                {nice(featured.date)} · {featured.readMinutes} min read
              </p>
            </div>
          </Link>
        </section>
      )}

      {/* Article rows */}
      <section className="mx-auto mt-16 max-w-[1080px] px-5 sm:px-6 md:mt-24">
        <div className="divide-y divide-hairline border-t border-hairline">
          {rest.map((a) => (
            <Link
              key={a.slug}
              href={`/journal/${a.slug}/`}
              className="group grid gap-6 py-10 sm:grid-cols-[240px_minmax(0,1fr)] sm:items-center"
            >
              <div className="overflow-hidden bg-paper">
                <Pic
                  name={a.cover}
                  alt=""
                  sizes="(max-width: 640px) 100vw, 240px"
                  aspect="4/3"
                  className="h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
              </div>
              <div>
                <p className="text-[10.5px] tracking-[0.16em] text-muted uppercase">{a.tag}</p>
                <h2 className="mt-2 font-serif text-[22px] leading-[1.28] font-light text-ink group-hover:underline group-hover:decoration-[1px] group-hover:underline-offset-[5px]">
                  {a.title}
                </h2>
                <p className="mt-2.5 max-w-[560px] text-[13.5px] leading-[1.65] text-ink-soft">
                  {a.description}
                </p>
                <p className="mt-3 text-[12px] text-muted">
                  {nice(a.date)} · {a.readMinutes} min read
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </>
  );
}
