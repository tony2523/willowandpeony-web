import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked, type Tokens } from "marked";
import { getImage, imageSrc, imageSrcSet } from "./images";

export type Article = {
  slug: string;
  title: string;
  /** Search-result title/description when the display ones run long. */
  seoTitle?: string;
  seoDescription?: string;
  description: string;
  date: string; // ISO yyyy-mm-dd
  tag: string; // e.g. "Seasonal", "Planning", "Behind the design"
  cover: string; // image manifest name
  readMinutes: number;
  html: string;
  plain: string;
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function renderer() {
  const r = new marked.Renderer();
  r.image = ({ href, text }: Tokens.Image) => {
    const name = (href || "").replace(/^\/images\//, "");
    const entry = getImage(name);
    if (!entry) return "";
    const alt = (text || "").replace(/"/g, "&quot;");
    return `<figure><img src="${imageSrc(name, 960)}" srcset="${imageSrcSet(
      name,
    )}" sizes="(max-width: 800px) 100vw, 760px" width="${entry.w}" height="${
      entry.h
    }" alt="${alt}" loading="lazy" decoding="async" /></figure>`;
  };
  return r;
}

let cache: Article[] | null = null;

export function getArticles(): Article[] {
  if (cache) return cache;
  const files = fs.existsSync(BLOG_DIR)
    ? fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"))
    : [];
  const articles = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const html = marked.parse(content, { renderer: renderer(), async: false }) as string;
    const plain = content
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[#*_>`]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return {
      slug,
      title: data.title as string,
      seoTitle: (data.seoTitle as string) || undefined,
      seoDescription: (data.seoDescription as string) || undefined,
      description: data.description as string,
      date: data.date as string,
      tag: (data.tag as string) || "Journal",
      cover: data.cover as string,
      readMinutes: Math.max(2, Math.round(plain.split(" ").length / 200)),
      html,
      plain,
    };
  });
  articles.sort((a, b) => (a.date < b.date ? 1 : -1));
  cache = articles;
  return articles;
}

export function getArticle(slug: string): Article | undefined {
  return getArticles().find((a) => a.slug === slug);
}
