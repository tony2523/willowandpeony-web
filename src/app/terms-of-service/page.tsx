import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms & Conditions",
  description:
    "The terms for booking wedding and event flowers with Willow & Peony, Auckland florist: proposals, payment, changes, seasonal flowers, delivery, setup and hire items.",
  path: "/terms-of-service/",
});

export default function TermsPage() {
  return <LegalPage file="terms-of-service.md" title="Terms & conditions" />;
}
