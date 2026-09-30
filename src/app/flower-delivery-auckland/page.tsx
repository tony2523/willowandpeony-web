import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo";
import { delivery, site } from "../../../content/site";

export const metadata: Metadata = pageMetadata({
  title: "Flower Delivery Auckland — Same-Day & Next-Day",
  description:
    "Same-day flower delivery across Auckland, Monday to Saturday, for orders before 12pm. $15 flat rate, free over $150. Custom arrangements delivered from Hatfields Beach to Tuakau.",
  path: "/flower-delivery-auckland/",
});

export default function DeliveryPage() {
  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd({
            name: "Flower Delivery Auckland",
            description:
              "Same-day and next-day delivery of custom floral arrangements across Auckland, Monday to Saturday.",
            path: "/flower-delivery-auckland/",
            serviceType: "Flower delivery",
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Flower Delivery Auckland", path: "/flower-delivery-auckland/" },
          ]),
        ]}
      />
      {/* Full-width page template, as on the original (21.6px left title) */}
      <section className="px-5 pt-12 sm:px-6">
        <h1 className="h-card text-ink">Delivery Information</h1>
        <div className="mt-6 max-w-[820px] space-y-4 text-[15px] leading-[1.4] text-ink">
          <p>
            At Willow &amp; Peony, we offer <strong className="font-normal">same-day flower delivery</strong>{" "}
            across Auckland on selected arrangements,{" "}
            <strong className="font-normal">Monday to Saturday</strong>, for orders placed{" "}
            <strong className="font-normal">before 12PM</strong>.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            {delivery.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p>We lovingly deliver to a wide area across Auckland, and our delivery boundaries are:</p>
          <ul className="list-disc space-y-1.5 pl-5">
            {delivery.boundaries.map((b) => (
              <li key={b.compass}>
                <strong className="font-normal">{b.compass}</strong>: {b.to}
              </li>
            ))}
          </ul>
          <p>
            <strong className="font-normal">Please note</strong>: We do not offer Sunday delivery
            (with the exception of Mother&rsquo;s Day). If you have specific delivery requests,
            feel free to get in touch — we&rsquo;ll do our best to help.
          </p>
          <p>
            If you&rsquo;re sending flowers to an outer or rural part of Auckland and aren&rsquo;t
            sure if it falls within our delivery area, please get in touch. You can email us at{" "}
            <a href={`mailto:${site.email}`} className="underline underline-offset-2">
              {site.email}
            </a>{" "}
            or call us at{" "}
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="underline underline-offset-2">
              {site.phoneDisplay}
            </a>{" "}
            between 9:00 am and 5:00 pm.
          </p>
        </div>
      </section>
    </>
  );
}
