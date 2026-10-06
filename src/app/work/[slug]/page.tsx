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
    title: post.seoTitle ?? post.title,
    description: post.description,
    path: `/work/${post.slug}/`,
    ogImage: post.cover,
    type: "article",
    publishedTime: post.date,
  });
}

export default async function WorkStoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const all = getPosts();
  const inCategory = all.filter((p) => p.category === post.category);
  const idx = inCategory.findIndex((p) => p.slug === post.slug);
  const newer = idx > 0 ? inCategory[idx - 1] : undefined;
  const older = idx >= 0 && idx < inCategory.length - 1 ? inCategory[idx + 1] : undefined;
  const date = new Date(post.date + "T00:00:00");
  const nice = date.toLocaleDateString("en-NZ", { month: "long", year: "numeric" });
  const isWedding = post.category === "weddings";
  const venueShort = post.venue.split(",")[0];

  return (
    <>
      <JsonLd
        data={[
          articleJsonLd({
            title: post.title,
            description: post.description,
            path: `/work/${post.slug}/`,
            date: post.date,
            cover: post.cover,
            venue: post.venue,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Our Work", path: "/work/" },
            { name: post.title, path: `/work/${post.slug}/` },
          ]),
        ]}
      />

      <article>
        {/* Title block */}
        <header className="hero-in mx-auto max-w-[61.25rem] px-5 pt-16 text-center sm:px-6 md:pt-24">
          <p className="eyebrow text-muted">
            {isWedding ? "Real wedding" : "Real event"}
            {venueShort ? ` · ${venueShort}` : ""} · {nice}
          </p>
          <h1 className="display-1 mt-5 text-ink">{post.title}</h1>
          <p className="mt-5 text-[0.8125rem] text-muted">
            {isWedding ? "Words & flowers" : "Flowers"} by {site.founder}
          </p>
        </header>

        {/* Full-bleed cover */}
        <div className="mt-14 md:mt-20">
          <Pic
            name={post.cover}
            alt={post.title}
            sizes="100vw"
            priority
            className="max-h-[45rem] w-full object-cover"
          />
        </div>

        {/* Details rail + story */}
        <div className="mx-auto mt-16 grid max-w-[67.5rem] gap-12 px-5 sm:px-6 md:mt-24 md:grid-cols-[17.5rem_minmax(0,1fr)] md:gap-16">
          <aside className="h-fit border-t border-hairline pt-6 md:sticky md:top-24">
            <p className="eyebrow text-muted">The details</p>
            <dl className="mt-5 space-y-4 text-[0.8125rem] text-ink-soft">
              {post.venue && (
                <div>
                  <dt className="text-muted">Venue</dt>
                  <dd>{post.venue}</dd>
                </div>
              )}
              <div>
                <dt className="text-muted">Occasion</dt>
                <dd>{isWedding ? "Wedding" : "Event"}</dd>
              </div>
              <div>
                <dt className="text-muted">Date</dt>
                <dd>{nice}</dd>
              </div>
              {post.palette && (
                <div>
                  <dt className="text-muted">Palette</dt>
                  <dd>{post.palette}</dd>
                </div>
              )}
              {post.blooms && (
                <div>
                  <dt className="text-muted">Signature blooms</dt>
                  <dd>{post.blooms}</dd>
                </div>
              )}
              {post.photographer && (
                <div>
                  <dt className="text-muted">Photography</dt>
                  <dd>
                    {post.photographerUrl ? (
                      <a
                        href={post.photographerUrl}
                        target="_blank"
                        rel="noopener"
                        className="underline underline-offset-2 hover:text-ink"
                      >
                        {post.photographer}
                      </a>
                    ) : (
                      post.photographer
                    )}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-muted">Flowers</dt>
                <dd>{site.name}</dd>
              </div>
            </dl>
          </aside>

          <div
            className="prose-wp max-w-[42.5rem]"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </div>

        {/* Keep reading */}
        {(older || newer) && (
          <nav
            aria-label="More stories"
            className="mx-auto mt-24 max-w-[67.5rem] px-5 sm:px-6 md:mt-[8.75rem]"
          >
            <div className="mb-8 flex items-end justify-between">
              <p className="eyebrow text-muted">Keep reading</p>
              <Link href="/work/" className="t-link text-ink">
                All our work
              </Link>
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                {older && (
                  <Link href={`/work/${older.slug}/`} className="group flex items-center gap-5">
                    <Pic
                      name={older.cover}
                      alt=""
                      sizes="180px"
                      aspect="9/10"
                      className="h-auto w-[7.5rem] shrink-0 object-cover sm:w-[10rem]"
                    />
                    <span>
                      <span className="block text-[0.65625rem] tracking-[0.14em] text-muted uppercase">
                        Previous
                      </span>
                      <span className="mt-2 block font-serif text-[1.1875rem] leading-[1.3] font-light text-ink group-hover:underline group-hover:decoration-[1px] group-hover:underline-offset-[0.3125rem]">
                        {older.title}
                      </span>
                    </span>
                  </Link>
                )}
              </div>
              <div className="sm:justify-self-end">
                {newer && (
                  <Link
                    href={`/work/${newer.slug}/`}
                    className="group flex items-center gap-5 sm:flex-row-reverse sm:text-right"
                  >
                    <Pic
                      name={newer.cover}
                      alt=""
                      sizes="180px"
                      aspect="9/10"
                      className="h-auto w-[7.5rem] shrink-0 object-cover sm:w-[10rem]"
                    />
                    <span>
                      <span className="block text-[0.65625rem] tracking-[0.14em] text-muted uppercase">
                        Next
                      </span>
                      <span className="mt-2 block font-serif text-[1.1875rem] leading-[1.3] font-light text-ink group-hover:underline group-hover:decoration-[1px] group-hover:underline-offset-[0.3125rem]">
                        {newer.title}
                      </span>
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </nav>
        )}

        {/* CTA */}
        <section className="mt-24 border-t border-hairline bg-paper md:mt-[8.75rem]">
          <div className="mx-auto flex max-w-[56.25rem] flex-col items-center px-5 py-16 text-center sm:py-20">
            <p className="eyebrow text-muted">
              {isWedding ? "Dreaming of something like this?" : "Planning an event to remember?"}
            </p>
            <h2 className="display-3 mt-4 text-ink">
              Let&rsquo;s design it for <em>{isWedding ? "your day" : "your event"}</em>
            </h2>
            <div className="mt-8">
              <Link href="/contact/" className="btn-solid">
                Start an enquiry
              </Link>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
