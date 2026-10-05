import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import WorkGrid, { type WorkItem } from "@/components/WorkGrid";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { getPosts } from "@/lib/journal";
import { getImage, imageSrc, imageSrcSet } from "@/lib/images";
import { postMeta } from "@/components/PostCard";
import { site } from "../../../content/site";

export const metadata: Metadata = pageMetadata({
  title: "Our Work | Real Weddings & Events",
  description:
    "Every wedding and event Willow & Peony has flowered, in one place — real celebrations at Auckland's loveliest venues, filterable by weddings and events.",
  path: "/work/",
});

export default function WorkPage() {
  const items: WorkItem[] = getPosts().map((post) => {
    const entry = getImage(post.cover)!;
    return {
      slug: post.slug,
      title: post.title,
      meta: postMeta(post),
      cat: post.category,
      src: imageSrc(post.cover, 480),
      srcSet: imageSrcSet(post.cover),
      w: entry.w,
      h: entry.h,
    };
  });

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Our Work", path: "/work/" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": `${site.domain}/work/#page`,
            name: "Our Work — Willow & Peony",
            url: `${site.domain}/work/`,
            hasPart: items.map((i) => ({
              "@type": "Article",
              headline: i.title,
              url: `${site.domain}/work/${i.slug}/`,
            })),
          },
        ]}
      />

      <section className="mx-auto mt-16 max-w-(--site-column) px-5 sm:px-6 md:mt-24">
        <p className="eyebrow text-muted">Our work</p>
        <h1 className="display-1 mt-3 text-ink">
          Every story, in <em>bloom</em>
        </h1>
      </section>

      <section className="mx-auto mt-10 max-w-(--site-column) px-5 sm:px-6 md:mt-14">
        <WorkGrid items={items} />
      </section>

      <section className="mt-24 border-t border-hairline bg-paper md:mt-[8.75rem]">
        <div className="mx-auto flex max-w-[56.25rem] flex-col items-center px-5 py-16 text-center sm:py-20">
          <p className="eyebrow text-muted">Yours could be next</p>
          <h2 className="display-3 mt-4 text-ink">
            Let&rsquo;s add <em>your story</em>
          </h2>
          <div className="mt-8">
            <Link href="/contact/" className="btn-solid">
              Start an enquiry
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
