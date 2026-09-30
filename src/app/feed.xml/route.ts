import { getPosts } from "@/lib/journal";
import { site } from "../../../content/site";

export const dynamic = "force-static";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const posts = getPosts();
  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${site.domain}/journal/${p.slug}/</link>
      <guid isPermaLink="true">${site.domain}/journal/${p.slug}/</guid>
      <pubDate>${new Date(p.date + "T09:00:00+12:00").toUTCString()}</pubDate>
      <description>${esc(p.description)}</description>
      <category>${p.category}</category>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.name)} — Journal</title>
    <link>${site.domain}/journal/</link>
    <atom:link href="${site.domain}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Real weddings and events by ${esc(site.name)}, boutique florist in Auckland.</description>
    <language>en-nz</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
