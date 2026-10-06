import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { faqs } from "../../../content/site";

export const metadata: Metadata = pageMetadata({
  title: "FAQ: Wedding & Event Flower Questions",
  description:
    "Answers to common questions about Willow & Peony's wedding and event florals in Auckland: pricing, booking, setup and seasonal flowers.",
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
      {/* Centred title + narrow accordion list, as on the original */}
      <section className="mx-auto max-w-[53.75rem] px-5 pt-16 sm:px-6 md:pt-24">
        <div className="hero-in">
          <p className="eyebrow text-muted">Common questions</p>
          <h1 className="display-1 mt-3 text-ink">FAQ</h1>
        </div>

        <div className="mt-12 divide-y divide-hairline border-y border-hairline">
          {faqs.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left [&::-webkit-details-marker]:hidden">
                <h2 className="font-serif text-[1.05rem] font-normal tracking-[-0.02em] text-ink">
                  {f.q}
                </h2>
                <span
                  aria-hidden
                  className="shrink-0 text-lg font-light text-ink transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-[40rem] text-[0.9375rem] leading-[1.4] text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
