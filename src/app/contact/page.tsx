import type { Metadata } from "next";
import Eyebrow from "@/components/Eyebrow";
import EnquiryForm from "@/components/EnquiryForm";
import HowWeWork from "@/components/HowWeWork";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { site } from "../../../content/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us — Boutique Florist Auckland",
  description:
    "Get in touch with Willow & Peony, boutique florist in Auckland. Wedding and event enquiries, custom floral orders and flower delivery questions — replies within 24 hours on weekdays.",
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
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
        <div className="grid gap-14 md:grid-cols-[2fr_3fr]">
          <div>
            <Eyebrow>Contact</Eyebrow>
            <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">
              We&rsquo;d love to hear from you
            </h1>
            <p className="mt-6 leading-relaxed text-ink-soft">
              Whether it&rsquo;s a wedding, an event, a custom arrangement or a delivery question
              — complete the form and we&rsquo;ll get back to you with a personalised response
              within 24 hours on weekdays.
            </p>
            <dl className="mt-10 space-y-6 text-sm">
              <div>
                <dt className="text-[0.72rem] tracking-[0.18em] uppercase text-muted">Email</dt>
                <dd className="mt-1">
                  <a href={`mailto:${site.email}`} className="text-lg text-ink hover:text-rose-deep">
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[0.72rem] tracking-[0.18em] uppercase text-muted">Phone</dt>
                <dd className="mt-1">
                  <a
                    href={`tel:${site.phone.replace(/\s/g, "")}`}
                    className="text-lg text-ink hover:text-rose-deep"
                  >
                    {site.phoneDisplay}
                  </a>
                  <span className="block text-xs text-muted">{site.phoneHours}</span>
                </dd>
              </div>
              <div>
                <dt className="text-[0.72rem] tracking-[0.18em] uppercase text-muted">Studio</dt>
                <dd className="mt-1 text-ink-soft">{site.base}</dd>
              </div>
            </dl>
            <div className="mt-10 border-t border-hairline pt-6 text-sm leading-relaxed text-muted">
              <p className="font-medium text-ink-soft">What to expect:</p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5">
                <li>Personalised responses within 24 hours on weekdays</li>
                <li>Help with weddings, events, custom arrangements and bulk orders</li>
                <li>Advice on flower care, delivery options and thoughtful gift ideas</li>
              </ul>
            </div>
          </div>
          <div className="bg-ivory-deep p-6 sm:p-10">
            <EnquiryForm kind="general" />
          </div>
        </div>
      </section>
      <HowWeWork />
    </>
  );
}
