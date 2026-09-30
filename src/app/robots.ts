import type { MetadataRoute } from "next";
import { site } from "../../content/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/thank-you/", "/wedding-flower-calendar/download/"],
      },
    ],
    sitemap: `${site.domain}/sitemap.xml`,
  };
}
