import { getPosts } from "@/lib/journal";
import { site, weddingPackages, faqs, delivery } from "../../../content/site";
import { venues } from "../../../content/venues";
import { googleRating } from "../../../content/reviews";

export const dynamic = "force-static";

/**
 * llms.txt — AEO (answer-engine optimisation) summary of the site for AI
 * assistants and crawlers. https://llmstxt.org
 */
export async function GET() {
  const posts = getPosts();
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `- Founder and lead florist: Ivy Diao`,
    `- Based: ${site.base}`,
    `- Service area: Auckland, New Zealand (weddings and events also beyond Auckland)`,
    `- Email: ${site.email}`,
    `- Phone: ${site.phone} (${site.phoneHours})`,
    `- This is an information site: enquiries by form, email or phone. No online checkout.`,
    `- Google rating: ${googleRating.value.toFixed(1)} stars from ${googleRating.count} reviews`,
    "",
    "## Services",
    "",
    `- Wedding flowers and floral styling: ${site.domain}/wedding-flowers-auckland/`,
    `- Wedding flower packages (fixed pricing): ${site.domain}/wedding-flower-packages/`,
    ...weddingPackages.map(
      (p) => `  - ${p.name} package, ${p.price} NZD: ${p.ideal}`,
    ),
    `- Corporate and private event flowers: ${site.domain}/event-flowers-auckland/`,
    `- Custom flower orders and Auckland delivery: ${site.domain}/flower-delivery-auckland/`,
    `  - ${delivery.summary} Flat rate $15, free over $150.`,
    "",
    "## Key pages",
    "",
    `- [Gallery](${site.domain}/gallery/): Portfolio of wedding and event florals`,
    `- [Our work](${site.domain}/work/): Every wedding and event story, filterable`,
    `- [Our story](${site.domain}/about/): About founder Ivy and the studio`,
    `- [FAQ](${site.domain}/faq/): Booking, delivery, flower care`,
    `- [Contact](${site.domain}/contact/): Enquiry form, email, phone`,
    `- [Wedding flower calendar](${site.domain}/wedding-flower-calendar/): Free month-by-month NZ seasonal bloom guide (PDF)`,
    "",
    "## Venue guides (wedding flowers by Auckland venue)",
    "",
    ...venues.map(
      (v) => `- [Wedding flowers at ${v.name}](${site.domain}/venues/${v.slug}/): ${v.intro}`,
    ),
    "",
    "## Journal (real weddings & events)",
    "",
    ...posts.map(
      (p) =>
        `- [${p.title}](${site.domain}/journal/${p.slug}/): ${p.description.slice(0, 140)}`,
    ),
    "",
    "## FAQ",
    "",
    ...faqs.flatMap((f) => [`### ${f.q}`, "", f.a, ""]),
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
