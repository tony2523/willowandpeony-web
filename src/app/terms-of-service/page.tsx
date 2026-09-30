import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description: "The terms and conditions for using the Willow & Peony website and services.",
  path: "/terms-of-service/",
});

export default function TermsPage() {
  return <LegalPage file="terms-of-service.md" title="Terms of service" />;
}
