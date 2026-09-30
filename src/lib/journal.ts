import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked, type Tokens } from "marked";
import { getImage, imageSrc, imageSrcSet } from "./images";
import { redirects } from "../../content/site";

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO yyyy-mm-dd
  category: "weddings" | "events";
  venue: string;
  cover: string; // image manifest name
  images: string[]; // manifest names of every inline image, in order
  html: string;
  plain: string; // plain-text body (for AEO / llms.txt)
};

const JOURNAL_DIR = path.join(process.cwd(), "content", "journal");

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
  r.link = ({ href, text }: Tokens.Link) => {
    let url = href || "";
    // Rewrite legacy internal links to the new URL structure.
    if (url.startsWith("/") || url.startsWith("https://willowandpeony.co.nz")) {
      const p = url.replace("https://willowandpeony.co.nz", "").replace(/\/$/, "");
      if (redirects[p]) url = redirects[p];
    }
    const external = /^https?:\/\//.test(url) && !url.startsWith("https://willowandpeony.co.nz");
    return `<a href="${url}"${external ? ' rel="noopener" target="_blank"' : ""}>${text}</a>`;
  };
  return r;
}

let cache: Post[] | null = null;

export function getPosts(): Post[] {
  if (cache) return cache;
  const files = fs.readdirSync(JOURNAL_DIR).filter((f) => f.endsWith(".md"));
  const posts = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(JOURNAL_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const html = marked.parse(content, { renderer: renderer(), async: false }) as string;
    const images = [...content.matchAll(/!\[[^\]]*\]\(\/images\/([^)\s]+)\)/g)]
      .map((m) => m[1])
      .filter((name) => getImage(name));
    const plain = content
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[#*_>`]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return {
      slug,
      title: data.title as string,
      description: data.description as string,
      date: data.date as string,
      category: data.category as "weddings" | "events",
      venue: (data.venue as string) || "",
      cover: data.cover as string,
      images,
      html,
      plain,
    };
  });
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  cache = posts;
  return posts;
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}

export function getPostsByCategory(category: "weddings" | "events"): Post[] {
  return getPosts().filter((p) => p.category === category);
}
