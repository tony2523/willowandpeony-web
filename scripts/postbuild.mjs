#!/usr/bin/env node
/**
 * Post-build step for the static export:
 *  1. Writes redirect stub pages for every legacy Shopify URL
 *     (meta refresh + canonical + JS replace — Google treats this as a redirect).
 *  2. Adds .nojekyll so GitHub Pages serves _next/* assets.
 *  3. Writes CNAME when DEPLOY_CNAME is set (production custom-domain deploys).
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

console.log(`postbuild: ${count} redirect stubs, .nojekyll${CNAME ? ", CNAME=" + CNAME : ""}`);
