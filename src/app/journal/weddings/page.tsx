import type { Metadata } from "next";
import JournalListing from "@/components/JournalListing";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { getPostsByCategory } from "@/lib/journal";

export const metadata: Metadata = pageMetadata({
  title: "Real Weddings — Auckland Wedding Flower Stories",
  description:
    "Real Auckland weddings with flowers by Willow & Peony — bridal bouquets, ceremony and reception styling at The Hotel Britomart, Allely Estate, Rydges Formosa and more.",
  path: "/journal/weddings/",
});

export default function WeddingJournalPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Journal", path: "/journal/" },
          { name: "Weddings", path: "/journal/weddings/" },
        ])}
      />
      <JournalListing title="Weddings" posts={getPostsByCategory("weddings")} active="weddings" />
    </>
  );
}
