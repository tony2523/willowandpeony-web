import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/journal";
import { site } from "../../content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString().slice(0, 10);
  const staticPages: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/wedding-flowers-auckland/", priority: 0.9, changeFrequency: "monthly" },
    { path: "/wedding-flower-packages/", priority: 0.9, changeFrequency: "monthly" },
    { path: "/event-flowers-auckland/", priority: 0.9, changeFrequency: "monthly" },
    { path: "/journal/", priority: 0.8, changeFrequency: "weekly" },
    { path: "/journal/weddings/", priority: 0.7, changeFrequency: "weekly" },
    { path: "/journal/events/", priority: 0.7, changeFrequency: "weekly" },
    { path: "/about/", priority: 0.6, changeFrequency: "yearly" },
    { path: "/contact/", priority: 0.7, changeFrequency: "yearly" },
    { path: "/faq/", priority: 0.6, changeFrequency: "monthly" },
    { path: "/flower-delivery-auckland/", priority: 0.6, changeFrequency: "monthly" },
    { path: "/wedding-flower-calendar/", priority: 0.6, changeFrequency: "yearly" },
    { path: "/refund-policy/", priority: 0.2, changeFrequency: "yearly" },
    { path: "/privacy-policy/", priority: 0.1, changeFrequency: "yearly" },
    { path: "/terms-of-service/", priority: 0.1, changeFrequency: "yearly" },
  ];

  return [
    ...staticPages.map((p) => ({
      url: `${site.domain}${p.path}`,
      lastModified: now,
      changeFrequency: p.changeFrequency,
      priority: p.priority,
    })),
    ...getPosts().map((post) => ({
      url: `${site.domain}/journal/${post.slug}/`,
      lastModified: post.date,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
