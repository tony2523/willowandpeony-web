import Link from "next/link";
import type { Metadata } from "next";
import Eyebrow from "@/components/Eyebrow";
import JsonLd from "@/components/JsonLd";
import CtaBand from "@/components/CtaBand";
import { pageMetadata, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { faqs } from "../../../content/site";

export const metadata: Metadata = pageMetadata({
  title: "FAQ — Wedding, Event & Delivery Questions",
  description:
    "Answers to common questions about Willow & Peony's wedding and event florals, custom orders, flower care and Auckland delivery.",
  path: "/faq/",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={[
          faqJsonLd([...faqs]),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "FAQ", path: "/faq/" },
          ]),
        ]}
      />
      <section className="mx-auto max-w-3xl px-4 pt-16 sm:px-6">
        <div className="text-center">
          <Eyebrow>Help &amp; advice</Eyebrow>
          <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">
            Frequently asked questions
          </h1>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-ink-soft">
            Everything you need to know about our wedding and event florals, custom orders, flower
            care and delivery. Can&rsquo;t find your answer?{" "}
            <Link href="/contact/" className="text-rose-deep underline underline-offset-2">
              Get in touch
            </Link>
            .
          </p>
        </div>

        <div className="mt-12 divide-y divide-hairline border-y border-hairline">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-serif text-lg text-ink [&::-webkit-details-marker]:hidden">
                <h2 className="text-lg font-normal">{f.q}</h2>
                <span
                  aria-hidden
                  className="shrink-0 text-2xl font-light text-rose-deep transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <CtaBand
        title="Still have questions?"
        body="Email us or send an enquiry — we reply within 24 hours on weekdays."
        buttonLabel="Contact us"
        buttonHref="/contact/"
      />
    </>
  );
}
