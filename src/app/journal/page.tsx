import type { Metadata } from "next";
import JournalListing from "@/components/JournalListing";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { getPosts } from "@/lib/journal";

export const metadata: Metadata = pageMetadata({
  title: "Journal — Real Weddings & Events",
  description:
    "Real weddings and events by Willow & Peony — floral stories from Auckland venues including The Hotel Britomart, Allely Estate, Bridgewater Estate and more.",
  path: "/journal/",
});

export default function JournalPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Journal", path: "/journal/" },
        ])}
      />
      <JournalListing title="Journal" posts={getPosts()} active="all" />
    </>
  );
}
