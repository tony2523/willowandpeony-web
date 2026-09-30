import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How Willow & Peony collects, uses and protects your personal information when you use our website and services.",
  path: "/privacy-policy/",
});

export default function PrivacyPage() {
  return <LegalPage file="privacy-policy.md" title="Privacy policy" />;
}
