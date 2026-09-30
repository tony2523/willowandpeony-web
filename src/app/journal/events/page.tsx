import type { Metadata } from "next";
import JournalListing from "@/components/JournalListing";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { getPostsByCategory } from "@/lib/journal";

export const metadata: Metadata = pageMetadata({
  title: "Events — Corporate & Private Event Flower Stories",
  description:
    "Corporate and private events styled by Willow & Peony — sculptural installations, gala dinners and launches at Auckland venues including Park Hyatt and The French Café.",
  path: "/journal/events/",
});

export default function EventJournalPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Journal", path: "/journal/" },
          { name: "Events", path: "/journal/events/" },
        ])}
      />
      <JournalListing title="Events" posts={getPostsByCategory("events")} active="events" />
    </>
  );
}
