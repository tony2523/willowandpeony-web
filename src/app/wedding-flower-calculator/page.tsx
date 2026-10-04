import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import FloralCalculator from "@/components/calculator/FloralCalculator";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { SERVICES, TIERS, VISIBLE_SECTIONS } from "@/lib/estimate";
import { site } from "../../../content/site";

export const metadata: Metadata = pageMetadata({
  title: "Wedding Flower Cost Calculator",
  description:
    "Build an itemised wedding flower estimate: bouquets, ceremony and reception pieces in three styles, with Auckland florist Willow & Peony's starting prices.",
  path: "/wedding-flower-calculator/",
});

/** Starting prices as structured data, so search engines and AI assistants can quote them. */
function priceCatalogJsonLd() {
  const offer = (name: string, price: number, unit?: string) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name },
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price,
      priceCurrency: "NZD",
      valueAddedTaxIncluded: false,
      ...(unit ? { unitText: unit } : {}),
    },
  });
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Wedding flowers",
    serviceType: "Wedding florist",
    provider: { "@id": `${site.domain}/#florist` },
    areaServed: { "@type": "City", name: "Auckland" },
    url: `${site.domain}/wedding-flower-calculator/`,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Wedding flower starting prices (NZD, excl. GST)",
      itemListElement: [
        ...VISIBLE_SECTIONS.map((s) => ({
          "@type": "OfferCatalog",
          name: s.title,
          itemListElement: s.items.flatMap((it) =>
            it.tiers
              ? it.tiers.flatMap((p, i) => (p == null ? [] : [offer(`${it.name} (${TIERS[i].name})`, p, it.unit)]))
              : it.price != null || it.from != null
                ? [offer(it.name, (it.price ?? it.from)!, it.unit)]
                : [],
          ),
        })),
        {
          "@type": "OfferCatalog",
          name: "Delivery & services",
          itemListElement: SERVICES.filter((sv) => !sv.quote).map((sv) => offer(sv.name, (sv.price ?? sv.from)!)),
        },
      ],
    },
  };
}

export default function CalculatorPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Wedding flowers", path: "/wedding-flowers-auckland/" },
            { name: "Flower calculator", path: "/wedding-flower-calculator/" },
          ]),
          priceCatalogJsonLd(),
        ]}
      />
      <FloralCalculator />
    </>
  );
}
