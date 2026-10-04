import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Pic from "@/components/Pic";
import Hero from "@/components/Hero";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { imageOgUrl } from "@/lib/images";
import { venues, getVenue } from "../../../../content/venues";
import { site } from "../../../../content/site";

export function generateStaticParams() {
  return venues.map((v) => ({ slug: v.slug }));
}

/** Venue facts were researched and the guides published on this date. */
const VENUE_GUIDES_PUBLISHED = "2026-10-01";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const venue = getVenue(slug);
  if (!venue) return {};
  return pageMetadata({
    title: `Wedding Flowers at ${venue.name}`,
    description: venue.metaDescription,
    path: `/venues/${venue.slug}/`,
    ogImage: venue.hero,
    type: "article",
  });
}

export default async function VenueGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venue = getVenue(slug);
  if (!venue) notFound();

  const others = venues.filter((v) => v.slug !== venue.slug).slice(0, 4);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Venue Guides", path: "/venues/" },
            { name: venue.name, path: `/venues/${venue.slug}/` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `Wedding flowers at ${venue.name}`,
            description: venue.intro,
            url: `${site.domain}/venues/${venue.slug}/`,
            image: imageOgUrl(venue.hero, site.domain),
            datePublished: VENUE_GUIDES_PUBLISHED,
            dateModified: VENUE_GUIDES_PUBLISHED,
            inLanguage: "en-NZ",
            author: { "@type": "Person", name: site.founder },
            publisher: { "@id": `${site.domain}/#florist` },
            about: {
              "@type": "Place",
              name: venue.name,
              address: { "@type": "PostalAddress", addressLocality: venue.location },
              url: venue.website,
            },
          },
        ]}
      />

      <Hero
        image={venue.hero}
        alt={`Wedding flowers at ${venue.name} by Willow & Peony`}
        eyebrow="Venue guide"
        title={
          <>
            Wedding flowers at <em>{venue.name}</em>
          </>
        }
        compact
      />

      {/* Facts rail */}
      <section className="mx-auto mt-12 max-w-[1280px] px-5 sm:px-6 md:mt-16">
        <dl className="grid gap-x-10 gap-y-6 border-b border-hairline pb-10 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              ["Location", venue.location],
              ["Setting", venue.setting],
              ["Style that sings", venue.style],
              ["We've styled here", venue.post.couple],
            ] as const
          ).map(([k, v]) => (
            <div key={k}>
              <dt className="eyebrow text-muted">{k}</dt>
              <dd className="mt-2 text-[14px] text-ink-soft">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* What works beautifully here */}
      <section className="mx-auto mt-20 grid max-w-[1280px] gap-12 px-5 sm:px-6 md:mt-28 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-20">
        <div>
          <h2 className="display-2 text-ink">
            What works beautifully <em>here</em>
          </h2>
          <p className="mt-6 max-w-[560px] text-[15px] leading-[1.75] font-light text-ink-soft">
            {venue.whatWorks}
          </p>
        </div>
        <div className="self-center">
          <p className="eyebrow text-muted">Florist&rsquo;s notes</p>
          <ul className="mt-4 space-y-2.5">
            {venue.floristNotes.map((n) => (
              <li key={n} className="text-[13.5px] leading-relaxed text-ink-soft">
                · {n}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Image band */}
      <section aria-label={`Florals at ${venue.name}`} className="mt-24 md:mt-[140px]">
        <div className="mx-auto flex max-w-[1280px] items-end gap-4 px-5 sm:gap-6 sm:px-6">
          <Pic
            name={venue.gallery[0]}
            alt={`${venue.name} wedding flowers by Willow & Peony`}
            sizes="(max-width: 768px) 100vw, 55vw"
            className="h-auto w-[60%] object-cover"
          />
          <Pic
            name={venue.gallery[1]}
            alt={`${venue.name} bridal flowers by Willow & Peony`}
            sizes="(max-width: 768px) 45vw, 35vw"
            className="mb-10 h-auto w-[40%] object-cover sm:w-[35%]"
          />
        </div>
      </section>

      {/* About the venue */}
      <section className="mx-auto mt-24 grid max-w-[1280px] gap-12 px-5 sm:px-6 md:mt-[140px] md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-20">
        <div>
          <h2 className="display-3 text-ink">About the venue</h2>
          {venue.about.map((p) => (
            <p key={p.slice(0, 24)} className="mt-5 max-w-[600px] text-[15px] leading-[1.75] font-light text-ink-soft">
              {p}
            </p>
          ))}
          <a
            href={venue.website}
            target="_blank"
            rel="noopener"
            className="t-link mt-7 inline-block text-ink"
          >
            Visit {venue.name}
          </a>
        </div>
        <div className="self-center">
          <p className="eyebrow text-muted">Good to know</p>
          <ul className="mt-4 space-y-2.5">
            {venue.goodToKnow.map((n) => (
              <li key={n} className="text-[13.5px] leading-relaxed text-ink-soft">
                · {n}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* More florals from days at this venue */}
      <section className="mx-auto mt-24 max-w-[1280px] px-5 sm:px-6 md:mt-[140px]">
        <p className="eyebrow text-muted">More florals from days at this venue</p>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {venue.gallery.slice(2, 6).map((name) => (
            <Pic
              key={name}
              name={name}
              alt={`Wedding florals at ${venue.name} by Willow & Peony`}
              sizes="(max-width: 768px) 50vw, 25vw"
              aspect="4/5"
              className="h-auto w-full object-cover"
            />
          ))}
        </div>
      </section>

      {/* Real wedding — paper band */}
      <section className="mt-24 border-t border-hairline bg-paper md:mt-[140px]">
        <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-5 py-16 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-16 md:py-20">
          <Pic
            name={venue.post.cover}
            alt={`Wedding flowers from ${venue.post.couple}'s day at ${venue.name}`}
            sizes="(max-width: 768px) 100vw, 50vw"
            aspect="4/3"
            className="h-auto w-full object-cover"
          />
          <div>
            <p className="eyebrow text-muted">Real wedding at this venue</p>
            <h2 className="display-3 mt-3 text-ink">{venue.post.title}</h2>
            <p className="mt-4 max-w-[480px] text-[14px] leading-[1.7] text-ink-soft">
              {venue.post.blurb}
            </p>
            <Link href={`/work/${venue.post.slug}/`} className="t-link mt-7 inline-block text-ink">
              Read their story
            </Link>
          </div>
        </div>
      </section>

      {/* More venue guides */}
      <section className="mx-auto mt-24 max-w-[1280px] px-5 sm:px-6 md:mt-[140px]">
        <div className="flex items-end justify-between">
          <p className="eyebrow text-muted">More venue guides</p>
          <Link href="/venues/" className="t-link text-ink">
            All venues
          </Link>
        </div>
        <ul className="mt-6 divide-y divide-hairline border-y border-hairline">
          {others.map((v) => (
            <li key={v.slug}>
              <Link
                href={`/venues/${v.slug}/`}
                className="group flex items-center justify-between py-4"
              >
                <span className="font-serif text-[19px] font-light text-ink group-hover:underline group-hover:decoration-[1px] group-hover:underline-offset-[5px]">
                  {v.name}
                </span>
                <span className="text-[10.5px] tracking-[0.14em] text-muted uppercase">
                  {v.area}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section className="mt-24 border-t border-hairline bg-paper md:mt-[140px]">
        <div className="mx-auto flex max-w-[900px] flex-col items-center px-5 py-16 text-center sm:py-20">
          <p className="eyebrow text-muted">Getting married at {venue.name}?</p>
          <h2 className="display-3 mt-4 text-ink">
            Let&rsquo;s design flowers that <em>belong there</em>
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
