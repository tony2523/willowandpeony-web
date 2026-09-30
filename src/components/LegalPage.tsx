import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

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
  const html = marked.parse(md, { async: false }) as string;
  return (
    <section className="mx-auto max-w-[568px] px-5 pt-12 sm:px-0">
      <h1 className="h-page text-ink">{title}</h1>
      {intro && <p className="mt-4 text-[15px] leading-[1.4] text-ink-soft">{intro}</p>}
      <div className="prose-wp mt-6" dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  );
}
