import type { Metadata } from "next";
import Eyebrow from "@/components/Eyebrow";
import { pageMetadata } from "@/lib/seo";
import { site } from "../../../content/site";

export const metadata: Metadata = pageMetadata({
  title: "Refund Policy",
  description:
    "Willow & Peony's quality guarantee and refund policy for flower orders and deliveries in Auckland.",
  path: "/refund-policy/",
});

const sections = [
  {
    h: "Quality guarantee",
    p: "We are committed to delivering fresh, high-quality flowers. If your flowers arrive in unsatisfactory condition, please contact us within 24 hours with a photo of the arrangement. We'll work with you to either replace the item or issue a partial or full refund, depending on the situation.",
  },
  {
    h: "Delivery issues",
    p: "If an order isn't delivered to the specified location or recipient on the expected date due to an error on our part, we will reattempt delivery at no additional cost or provide a full refund.",
  },
  {
    h: "Refunds for undeliverable orders",
    p: "If we're unable to deliver due to incorrect or incomplete address information provided by the customer, we will reach out to resolve the issue. However, refunds may not be provided in cases where we cannot complete delivery due to customer error.",
  },
  {
    h: "Seasonal and availability substitutions",
    p: "Occasionally, specific flowers may be unavailable due to seasonal or regional supply conditions. In such cases, we reserve the right to make substitutions with flowers of equal or greater value while preserving the style and overall look of the arrangement.",
  },
  {
    h: "Change of mind",
    p: "Due to the perishable nature of flowers, we're unable to offer refunds for change-of-mind cancellations once an order is processed. However, if you need adjustments, please reach out within one hour of placing your order and we'll do our best to accommodate.",
  },
];

export default function RefundPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 pt-16 sm:px-6">
      <Eyebrow>Policies</Eyebrow>
      <h1 className="mt-3 font-serif text-4xl text-ink">Refund policy</h1>
      <div className="mt-10 space-y-8">
        {sections.map((s) => (
          <div key={s.h}>
            <h2 className="font-serif text-xl text-ink">{s.h}</h2>
            <p className="mt-2.5 leading-relaxed text-ink-soft">{s.p}</p>
          </div>
        ))}
        <p className="border-t border-hairline pt-6 text-sm text-muted">
          Questions about an order? Email{" "}
          <a href={`mailto:${site.email}`} className="text-rose-deep underline underline-offset-2">
            {site.email}
          </a>{" "}
          or call{" "}
          <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="text-rose-deep underline underline-offset-2">
            {site.phoneDisplay}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
