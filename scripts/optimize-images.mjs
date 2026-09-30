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
 *   public/images/<name>-{480,960,1600}w.webp
 *   public/images/<name>-og.jpg
 *   src/lib/image-manifest.json
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = "assets/img-src";
const OUT = "public/images";
const MANIFEST = "src/lib/image-manifest.json";
const WIDTHS = [480, 960, 1600];
const QUALITY = { 480: 70, 960: 72, 1600: 74 };

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
  const allExist =
    existing &&
    existing.w === w &&
    sizes.every((s) => fs.existsSync(path.join(OUT, `${name}-${s}w.webp`))) &&
    fs.existsSync(path.join(OUT, `${name}-og.jpg`));
  if (allExist) {
    skipped++;
    return;
  }

  for (const size of sizes) {
    await sharp(srcPath, { failOn: "none" })
      .rotate()
      .resize({ width: size, withoutEnlargement: true })
      .webp({ quality: QUALITY[size] ?? 72 })
      .toFile(path.join(OUT, `${name}-${size}w.webp`));
  }
  await sharp(srcPath, { failOn: "none" })
    .rotate()
    .resize({ width: 1200, height: 630, fit: "cover", position: "attention" })
    .jpeg({ quality: 76, mozjpeg: true })
    .toFile(path.join(OUT, `${name}-og.jpg`));

  manifest[name] = { w, h, sizes };
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
