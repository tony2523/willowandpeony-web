#!/usr/bin/env node
/**
 * Post-build step for the static export:
 *  1. Writes redirect stub pages for every legacy Shopify URL
 *     (meta refresh + canonical + JS replace — GitHub Pages has no server
 *     redirects; on Cloudflare the _redirects file below takes priority).
 *  2. Writes Cloudflare Pages _redirects (real 301s) and _headers
 *     (immutable caching + security headers).
 *  3. Adds .nojekyll so GitHub Pages serves _next/* assets.
 *  4. Writes CNAME when DEPLOY_CNAME is set (GitHub Pages custom-domain builds).
 */
import fs from "node:fs";
import path from "node:path";

const OUT = "out";
const BASE = process.env.PAGES_BASE_PATH || "";
const CNAME = process.env.DEPLOY_CNAME || "";

const redirects = JSON.parse(fs.readFileSync("content/redirects.json", "utf8"));

function stub(target) {
  const href = `${BASE}${target}`;
  return `<!DOCTYPE html>
<html lang="en-NZ">
<head>
<meta charset="utf-8">
<title>Redirecting…</title>
<meta http-equiv="refresh" content="0;url=${href}">
<link rel="canonical" href="https://willowandpeony.co.nz${target}">
<meta name="robots" content="noindex">
<script>location.replace(${JSON.stringify(href)});</script>
</head>
<body>
<p>This page has moved to <a href="${href}">willowandpeony.co.nz${target}</a>.</p>
</body>
</html>
`;
}

let count = 0;
for (const [from, to] of Object.entries(redirects)) {
  const dir = path.join(OUT, ...from.split("/").filter(Boolean));
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, "index.html");
  if (fs.existsSync(file)) {
    console.warn(`skip (exists): ${from}`);
    continue;
  }
  fs.writeFileSync(file, stub(to));
  count++;
}

fs.writeFileSync(path.join(OUT, ".nojekyll"), "");
if (CNAME) fs.writeFileSync(path.join(OUT, "CNAME"), CNAME + "\n");

// Cloudflare Pages: real 301 redirects (evaluated before static assets,
// so they win over the stub pages above).
const redirectLines = Object.entries(redirects)
  .map(([from, to]) => `${from} ${to} 301\n${from}/ ${to} 301`)
  .join("\n");
// Catch-alls for old Shopify URLs not in redirects.json (deleted products,
// unseen collections/posts, system pages). Cloudflare applies the first
// matching rule, so these must come after the exact redirects above.
const catchAll = [
  "/agents.md /llms.txt 301",
  "/policies/contact-information /contact/ 301",
  "/products/* / 301",
  "/collections/* / 301",
  "/blogs/weddings-events/* /work/ 301",
  "/blogs/events/* /work/ 301",
  "/blogs/news/* /journal/ 301",
  "/pages/* / 301",
  "/policies/* / 301",
  "/cart / 301",
  "/account/* / 301",
  "/search / 301",
].join("\n");
fs.writeFileSync(path.join(OUT, "_redirects"), redirectLines + "\n" + catchAll + "\n");

// Cloudflare Pages: long-lived caching for assets + baseline security headers.
// NOTE: /images/ files are cached for a year — never re-use a filename for a
// different photo; give replacements a new name (see CLAUDE.md).
fs.writeFileSync(
  path.join(OUT, "_headers"),
  `/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

/images/*
  Cache-Control: public, max-age=31536000, immutable

/brand/*
  Cache-Control: public, max-age=604800

/downloads/*
  Cache-Control: public, max-age=86400

/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN

https://*.workers.dev/*
  X-Robots-Tag: noindex
`,
);

console.log(
  `postbuild: ${count} redirect stubs, _redirects (${Object.keys(redirects).length} rules), _headers, .nojekyll${CNAME ? ", CNAME=" + CNAME : ""}`,
);
