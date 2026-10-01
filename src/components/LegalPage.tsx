import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

/** Policy pages (privacy, terms): markdown from content/legal/. */
export default function LegalPage({
  file,
  title,
  intro,
}: {
  file: string;
  title: string;
  intro?: string;
}) {
  const md = fs.readFileSync(path.join(process.cwd(), "content", "legal", file), "utf8");
  const [first, ...rest] = md.split("\n");
  const updated = first.startsWith("Last updated") ? first.trim() : null;
  const html = marked.parse(updated ? rest.join("\n") : md, { async: false }) as string;
  return (
    <section className="mx-auto max-w-[760px] px-5 pt-16 sm:px-6 md:pt-24">
      <p className="eyebrow text-muted">Willow &amp; Peony</p>
      <h1 className="display-1 mt-3 text-ink">{title}</h1>
      {updated && <p className="mt-4 text-[13px] text-muted">{updated}</p>}
      {intro && <p className="mt-5 text-[15px] leading-[1.7] text-ink-soft">{intro}</p>}
      <div className="prose-wp mt-10" dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  );
}
