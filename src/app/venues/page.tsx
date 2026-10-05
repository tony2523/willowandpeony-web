import type { Metadata } from "next";
import Link from "next/link";
import Pic from "@/components/Pic";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { venues } from "../../../content/venues";
import { site } from "../../../content/site";

export const metadata: Metadata = pageMetadata({
  title: "Auckland Wedding Venue Flower Guides",
  description:
    "What works beautifully at Auckland's loveliest wedding venues, with florist's notes, real weddings and honest advice from the days we've styled there.",
  path: "/venues/",
});

export default function VenuesPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Venue Guides", path: "/venues/" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": `${site.domain}/venues/#page`,
            name: "Auckland Wedding Venue Guides",
            url: `${site.domain}/venues/`,
            hasPart: venues.map((v) => ({
              "@type": "Article",
              headline: `Wedding flowers at ${v.name}`,
              url: `${site.domain}/venues/${v.slug}/`,
            })),
          },
        ]}
      />

      <section className="mx-auto mt-16 max-w-(--site-column) px-5 sm:px-6 md:mt-24">
        <p className="eyebrow text-muted">Venue guides</p>
        <h1 className="display-1 mt-3 text-ink">
          Wedding flowers, <em>venue by venue</em>
        </h1>
        <p className="mt-5 max-w-[38.75rem] text-[0.9375rem] leading-[1.7] font-light text-ink-soft">
          What works beautifully at Auckland&rsquo;s loveliest venues — florist&rsquo;s notes,
          real weddings and honest advice from days we&rsquo;ve styled there.
        </p>
      </section>

      <section className="mx-auto mt-14 max-w-(--site-column) px-5 sm:px-6 md:mt-20">
        <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((v) => (
            <Link key={v.slug} href={`/venues/${v.slug}/`} className="group block">
              <div className="overflow-hidden bg-paper">
                <Pic
                  name={v.hero}
                  alt={`Wedding flowers at ${v.name} by Willow & Peony`}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  aspect="4/3"
                  className="h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <h2 className="h-card text-ink group-hover:underline group-hover:decoration-[1px] group-hover:underline-offset-[0.3125rem]">
                  {v.name}
                </h2>
                <span className="t-link shrink-0 text-ink">Guide</span>
              </div>
              <p className="mt-1.5 text-[0.65625rem] tracking-[0.14em] text-muted uppercase">
                {v.area}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-24 border-t border-hairline bg-paper md:mt-[8.75rem]">
        <div className="mx-auto flex max-w-[56.25rem] flex-col items-center px-5 py-16 text-center sm:py-20">
          <p className="eyebrow text-muted">Somewhere else?</p>
          <h2 className="display-3 mt-4 text-ink">
            Don&rsquo;t see <em>your venue?</em> We travel.
          </h2>
          <div className="mt-8">
            <Link href="/contact/" className="btn-solid">
              Tell us about your day
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
