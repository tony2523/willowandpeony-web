import Link from "next/link";
import type { Metadata } from "next";
import EnquiryForm from "@/components/EnquiryForm";
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
      {/* Two columns as on the original: 608px text left, compact form right */}
      <section className="mx-auto max-w-[1200px] px-5 pt-14 sm:px-6">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="max-w-[608px]">
            <h1 className="h-card text-ink">Contact Us</h1>
            <div className="mt-5 space-y-4 text-[15px] leading-[1.4] text-ink">
              <p>
                Thank you for visiting Willow &amp; Peony! We&rsquo;re delighted to assist with
                any questions, custom floral requests, or order details. Simply complete the form
                on the page, and our team will get back to you promptly.
              </p>
              <p>
                <strong className="font-normal">What to Expect:</strong>
              </p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>Personalised responses within 24 hours on weekdays.</li>
                <li>Assistance with custom arrangements, event flowers, or bulk orders.</li>
                <li>Advice on flower care, delivery options, and thoughtful gift ideas.</li>
              </ul>
              <p>
                We look forward to helping you bring a touch of natural beauty into your day with
                our handcrafted blooms. Let us know how we can make your Willow &amp; Peony
                experience even more memorable!
              </p>
              <p className="text-ink-soft">
                <a href={`mailto:${site.email}`} className="hover:underline">
                  {site.email}
                </a>
                <br />
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:underline">
                  {site.phoneDisplay}
                </a>{" "}
                ({site.phoneHours})
              </p>
            </div>
          </div>
          <div className="w-full md:max-w-[442px]">
            <EnquiryForm kind="general" compact />
          </div>
        </div>
        {/* Breadcrumb, as on the original */}
        <nav aria-label="Breadcrumb" className="mt-16 text-[12.6px] text-ink-soft">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span aria-hidden> / </span>
          <span>Contact</span>
        </nav>
      </section>
    </>
  );
}
