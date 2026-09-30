import Link from "next/link";
import type { Metadata } from "next";
import Pic from "@/components/Pic";
import PostCard from "@/components/PostCard";
import Eyebrow from "@/components/Eyebrow";
import EnquiryForm from "@/components/EnquiryForm";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { getPostsByCategory } from "@/lib/journal";
import { weddingPackages } from "../../../content/site";

export const metadata: Metadata = pageMetadata({
  title: "Wedding Flower Packages & Pricing Auckland",
  description:
    "Curated wedding flower packages from a boutique Auckland florist: Petite $500, Classic $2,500 and Luxe $5,000. Bouquets, ceremony and reception styling — transparent pricing, stress-free planning.",
  path: "/wedding-flower-packages/",
  ogImage: "wedding-flower-package-auckland-image-41-copy",
});

export default function PackagesPage() {
  const posts = getPostsByCategory("weddings").slice(0, 3);
  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd({
            name: "Wedding Flower Packages",
            description:
              "Curated wedding floral packages for Auckland weddings — three tiers covering bouquets, buttonholes, ceremony and reception styling.",
            path: "/wedding-flower-packages/",
            serviceType: "Wedding florist",
            offers: weddingPackages.map((p) => ({
              name: `${p.name} Package`,
              price: p.priceNumber,
              description: p.ideal,
            })),
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Wedding Flowers Auckland", path: "/wedding-flowers-auckland/" },
            { name: "Wedding Flower Packages", path: "/wedding-flower-packages/" },
          ]),
        ]}
      />

      {/* Hero */}
      <section className="relative">
        <div className="relative h-[48vh] min-h-[360px] w-full overflow-hidden">
          <Pic
            name="wedding-flower-package-auckland-image-41-copy"
            alt="Romantic wedding reception styling with flowers and candles in Auckland"
            sizes="100vw"
            priority
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-12 sm:px-6">
            <Eyebrow>
              <span className="text-ivory/80">Effortless · Romantic · Unforgettable</span>
            </Eyebrow>
            <h1 className="mt-3 font-serif text-4xl leading-[1.1] text-ivory sm:text-5xl">
              Wedding flower packages
            </h1>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-3xl px-4 pt-16 text-center sm:px-6">
        <p className="font-serif text-2xl leading-relaxed text-ink">
          Beautiful wedding flowers, stress-free.
        </p>
        <p className="mt-6 leading-relaxed text-ink-soft">
          Planning your wedding should feel joyful, not overwhelming. Our curated wedding floral
          packages make it effortless to achieve a cohesive, romantic look across your entire day
          — from your bouquet to ceremony features and reception styling, each tier delivers
          premium, artful florals that feel seamless, elegant and unforgettable.
        </p>
      </section>

      {/* Packages */}
      <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          {weddingPackages.map((pkg, i) => (
            <article
              key={pkg.name}
              className={`flex flex-col border border-hairline bg-white ${
                i === 1 ? "lg:-mt-4 lg:shadow-lg" : ""
              }`}
            >
              <div className="overflow-hidden">
                <Pic
                  name={pkg.image}
                  alt={`${pkg.name} wedding flower package by Willow & Peony`}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  aspect="4/3"
                  className="h-auto w-full"
                />
              </div>
              <div className="flex flex-1 flex-col p-7">
                {i === 1 && (
                  <p className="mb-2 text-[0.7rem] tracking-[0.2em] uppercase text-rose-deep">
                    Most popular
                  </p>
                )}
                <h2 className="font-serif text-2xl text-ink">
                  {pkg.name} <span className="text-rose-deep">— {pkg.price}</span>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{pkg.ideal}</p>
                <ul className="mt-5 space-y-2 text-sm leading-relaxed text-ink-soft">
                  {pkg.includes.map((inc) => (
                    <li key={inc} className="flex gap-2.5">
                      <span aria-hidden className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-rose" />
                      {inc}
                    </li>
                  ))}
                </ul>
                {pkg.options && (
                  <div className="mt-5 border-t border-hairline pt-5">
                    <p className="text-[0.72rem] tracking-[0.16em] uppercase text-muted">
                      Choose one styling option
                    </p>
                    <ul className="mt-3 space-y-3 text-sm text-ink-soft">
                      {pkg.options.map((o) => (
                        <li key={o.label}>
                          <span className="font-medium text-ink">{o.label}:</span>{" "}
                          {o.items.join(" · ")}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {pkg.note && <p className="mt-4 text-xs italic text-muted">{pkg.note}</p>}
                <div className="mt-auto pt-7">
                  <Link
                    href="#enquire"
                    className="block border border-ink px-6 py-2.5 text-center text-[0.78rem] tracking-[0.16em] uppercase text-ink transition-colors hover:bg-ink hover:text-ivory"
                  >
                    Enquire about {pkg.name}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-muted">
          Dreaming of something beyond a package? We also design fully{" "}
          <Link href="/wedding-flowers-auckland/" className="text-rose-deep underline underline-offset-2">
            bespoke wedding florals
          </Link>{" "}
          tailored to your vision, venue and budget.
        </p>
      </section>

      {/* Recent work */}
      <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="font-serif text-3xl text-ink">Our latest work</h2>
          <Link
            href="/journal/weddings/"
            className="text-[0.78rem] tracking-[0.16em] uppercase text-rose-deep hover:text-ink"
          >
            View all →
          </Link>
        </div>
        <div className="mt-9 grid gap-x-7 gap-y-12 sm:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {/* Enquiry */}
      <section id="enquire" className="mx-auto mt-24 max-w-3xl scroll-mt-24 px-4 pb-8 sm:px-6">
        <div className="text-center">
          <Eyebrow>Enquire</Eyebrow>
          <h2 className="mt-3 font-serif text-3xl text-ink">Tell us about your day</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted">
            Share your date, venue and the package you have in mind — we&rsquo;ll confirm
            availability and next steps within 1–2 business days.
          </p>
        </div>
        <div className="mt-10">
          <EnquiryForm kind="wedding" />
        </div>
      </section>
    </>
  );
}
