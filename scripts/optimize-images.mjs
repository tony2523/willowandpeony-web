#!/usr/bin/env node
/**
 * Pre-optimizes every image in assets/img-src/ into responsive WebP variants
 * plus a 1200×630 JPEG for Open Graph cards, and writes the manifest that
 * src/lib/images.ts reads.
 *
 * Run after adding/replacing photos in assets/img-src/:
 *   npm run images
 *
 * Outputs (committed to the repo so CI builds stay fast):
 *   public/images/<name>-{480,768,960,1200,1600}w.webp
 *   public/images/<name>-og.jpg
 *   src/lib/image-manifest.json
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = "assets/img-src";
const OUT = "public/images";
const MANIFEST = "src/lib/image-manifest.json";
// 768 and 1200 match 2x/3x phone screens, so phones don't jump to 960/1600.
const WIDTHS = [480, 768, 960, 1200, 1600];
const QUALITY = { 480: 70, 768: 72, 960: 72, 1200: 73, 1600: 74 };

fs.mkdirSync(OUT, { recursive: true });
const manifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, "utf8")) : {};

const files = fs
  .readdirSync(SRC)
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  .sort();

let done = 0;
let skipped = 0;

async function processOne(file) {
  const name = file.replace(/\.(jpe?g|png|webp)$/i, "");
  const srcPath = path.join(SRC, file);
  const img = sharp(srcPath, { failOn: "none" }).rotate();
  const meta = await img.metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  const sizes = WIDTHS.filter((x) => x <= w);
  if (sizes.length === 0) sizes.push(Math.min(w, 480) || 480);

  const existing = manifest[name];
  // Only encode what's missing; keep any extra hand-made sizes (e.g. the
  // home hero's 1800w/2400w) that are already on disk and in the manifest.
  const missing = sizes.filter((s) => !fs.existsSync(path.join(OUT, `${name}-${s}w.webp`)));
  const ogMissing = !fs.existsSync(path.join(OUT, `${name}-og.jpg`));
  if (existing && existing.w === w && missing.length === 0 && !ogMissing) {
    skipped++;
    return;
  }

  for (const size of missing) {
    await sharp(srcPath, { failOn: "none" })
      .rotate()
      .resize({ width: size, withoutEnlargement: true })
      .webp({ quality: QUALITY[size] ?? 72 })
      .toFile(path.join(OUT, `${name}-${size}w.webp`));
  }
  if (ogMissing) {
    await sharp(srcPath, { failOn: "none" })
      .rotate()
      .resize({ width: 1200, height: 630, fit: "cover", position: "attention" })
      .jpeg({ quality: 76, mozjpeg: true })
      .toFile(path.join(OUT, `${name}-og.jpg`));
  }

  const kept = (existing?.w === w ? existing.sizes : []).filter((s) =>
    fs.existsSync(path.join(OUT, `${name}-${s}w.webp`)),
  );
  const merged = [...new Set([...kept, ...sizes])].sort((a, b) => a - b);
  manifest[name] = { w, h, sizes: merged };
  done++;
}

const queue = [...files];
const workers = Array.from({ length: 6 }, async () => {
  while (queue.length) {
    const f = queue.shift();
    try {
      await processOne(f);
    } catch (e) {
      console.error(`FAILED ${f}: ${e.message}`);
    }
  }
});
await Promise.all(workers);

// prune manifest entries whose source no longer exists
for (const name of Object.keys(manifest)) {
  if (!files.some((f) => f.replace(/\.(jpe?g|png|webp)$/i, "") === name)) delete manifest[name];
}

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1));
console.log(`optimized ${done}, skipped ${skipped}, manifest entries ${Object.keys(manifest).length}`);
