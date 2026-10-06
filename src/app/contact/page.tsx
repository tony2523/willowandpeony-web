import type { Metadata } from "next";
import Pic from "@/components/Pic";
import EnquiryForm from "@/components/EnquiryForm";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { site } from "../../../content/site";
import { googleRating } from "../../../content/reviews";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us | Boutique Florist Auckland",
  description:
    "Get in touch with Willow & Peony, boutique wedding and event florist in Auckland. Tell us about your day and we'll reply within 1–2 business days.",
  path: "/contact/",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact/" },
        ])}
      />

      <section className="mx-auto max-w-(--site-column) px-5 pt-16 sm:px-6 md:pt-24">
        <div className="grid gap-14 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-20">
          {/* Form column */}
          <div className="hero-in">
            <p className="eyebrow text-muted">Contact</p>
            <h1 className="display-2 mt-3 text-ink">
              We&rsquo;d love to hear about <em>your day</em>
            </h1>
            <p className="mt-5 max-w-[32.5rem] text-[0.9375rem] leading-[1.7] font-light text-ink-soft">
              Tell us what you&rsquo;re dreaming of — a wedding, an event, or something else
              entirely. We reply personally within 1–2 business days.
            </p>
            <div className="mt-10">
              <EnquiryForm kind="wedding" selector />
            </div>
          </div>

          {/* Ivy + studio details */}
          <aside className="md:pt-24">
            <Pic
              name="willow-and-peony-bouquet-ivy-willow-peony-copy-a677a82d-5fc6-4fcd-b72d-c0884402c2e5"
              alt="Ivy Diao, founder and lead florist of Willow & Peony"
              sizes="(max-width: 768px) 100vw, 480px"
              className="h-auto w-full object-cover"
            />
            <div className="mt-8 space-y-1.5 border-t border-hairline pt-6 text-[0.84375rem] text-ink-soft">
              <p>
                <a href={`mailto:${site.email}`} className="hover:text-ink hover:underline">
                  {site.email}
                </a>
              </p>
              <p>
                <a
                  href={`tel:${site.phone.replace(/\s/g, "")}`}
                  className="hover:text-ink hover:underline"
                >
                  {site.phoneDisplay}
                </a>{" "}
                <span className="text-muted">({site.phoneHours})</span>
              </p>
              <p className="pt-2 text-[0.78125rem] text-muted">
                <span aria-hidden>★★★★★</span>{" "}
                <a
                  href={googleRating.url}
                  target="_blank"
                  rel="noopener"
                  className="underline underline-offset-4 hover:text-ink"
                >
                  {googleRating.value.toFixed(1)} from {googleRating.count} Google reviews
                </a>
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
