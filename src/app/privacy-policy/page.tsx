import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How Willow & Peony, Auckland wedding and event florist, collects, uses and protects your personal information under the New Zealand Privacy Act 2020.",
  path: "/privacy-policy/",
});

export default function PrivacyPage() {
  return <LegalPage file="privacy-policy.md" title="Privacy policy" />;
}
