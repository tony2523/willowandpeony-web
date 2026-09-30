import type { Metadata } from "next";
import Link from "next/link";
import Eyebrow from "@/components/Eyebrow";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Thank You",
  description: "We've received your enquiry and will be in touch within 1–2 business days.",
  path: "/thank-you/",
  noindex: true,
});

export default function ThankYouPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 pt-24 pb-10 text-center sm:px-6">
      <Eyebrow>Enquiry received</Eyebrow>
      <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">Thank you</h1>
      <p className="mx-auto mt-6 max-w-md leading-relaxed text-ink-soft">
        We&rsquo;re so excited to hear about your plans! We&rsquo;ll be in touch within 1–2
        business days to chat next steps.
      </p>
      <Link
        href="/journal/"
        className="mt-9 inline-block border border-ink px-7 py-2.5 text-[0.78rem] tracking-[0.16em] uppercase text-ink transition-colors hover:bg-ink hover:text-ivory"
      >
        Browse our latest work
      </Link>
    </section>
  );
}
