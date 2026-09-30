import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import Eyebrow from "./Eyebrow";

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
    <section className="mx-auto max-w-3xl px-4 pt-16 sm:px-6">
      <Eyebrow>Policies</Eyebrow>
      <h1 className="mt-3 font-serif text-4xl text-ink">{title}</h1>
      {intro && <p className="mt-4 leading-relaxed text-muted">{intro}</p>}
      <div className="prose-wp mt-8" dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  );
}
