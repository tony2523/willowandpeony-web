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
// Full-screen banners are enlarged on retina screens, so they get higher
// quality and an extra size at the photo's full width (up to 2400px). Each
// also gets a portrait "<name>-mobile" crop for phones (3:5, centred on the
// focal point given here as a fraction of the width): phones only ever show
// that middle part, so they load a third of the bytes at the same sharpness.
const HERO = new Map([
  ["auckland-bridal-party-blush-bouquets-hero", 0.5],
  ["wedding-flowers-auckland-hero-bouquet-and-rings", 0.55],
]);
const HERO_QUALITY = 86;
const MOBILE_QUALITY = 80; // phone crops: smaller files on mobile data

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
  if (HERO.has(name) && w > sizes[sizes.length - 1]) sizes.push(Math.min(w, 2400));

  const existing = manifest[name];
  // Only encode what's missing; keep any extra hand-made sizes (e.g. the
  // home hero's 1800w/2400w) that are already on disk and in the manifest.
  const missing = sizes.filter((s) => !fs.existsSync(path.join(OUT, `${name}-${s}w.webp`)));
  // Calculator and gallery photos are never shared on social, so they get no OG card.
  const ogMissing =
    !name.startsWith("calculator-") && !name.startsWith("gallery-") && !fs.existsSync(path.join(OUT, `${name}-og.jpg`));
  if (existing && existing.w === w && missing.length === 0 && !ogMissing) {
    skipped++;
    return;
  }

  for (const size of missing) {
    await sharp(srcPath, { failOn: "none" })
      .rotate()
      .resize({ width: size, withoutEnlargement: true })
      .webp({ quality: HERO.has(name) ? HERO_QUALITY : (QUALITY[size] ?? 72) })
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

// Portrait phone crops of the banners (regenerated when the source changes).
for (const [name, focalX] of HERO) {
  const file = files.find((f) => f.replace(/\.(jpe?g|png|webp)$/i, "") === name);
  if (!file) continue;
  const srcPath = path.join(SRC, file);
  const srcBytes = fs.statSync(srcPath).size;
  const meta = await sharp(srcPath, { failOn: "none" }).rotate().metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  const cw = Math.min(w, Math.round(h * 0.6));
  const left = Math.max(0, Math.min(w - cw, Math.round(focalX * w - cw / 2)));
  const mobile = `${name}-mobile`;
  const sizes = [...WIDTHS.filter((x) => x < cw && x <= 768), Math.min(cw, 1200)];
  const prev = manifest[mobile];
  const stale = !prev || prev.srcBytes !== srcBytes || prev.left !== left || prev.w !== Math.min(cw, 1200);
  for (const size of sizes) {
    const out = path.join(OUT, `${mobile}-${size}w.webp`);
    if (!stale && fs.existsSync(out)) continue;
    await sharp(srcPath, { failOn: "none" })
      .rotate()
      .extract({ left, top: 0, width: cw, height: h })
      .resize({ width: size, withoutEnlargement: true })
      .webp({ quality: MOBILE_QUALITY })
      .toFile(out);
  }
  manifest[mobile] = { w: Math.min(cw, 1200), h: Math.round((h * Math.min(cw, 1200)) / cw), sizes, srcBytes, left };
}

// prune manifest entries whose source no longer exists (phone crops belong to their banner)
for (const name of Object.keys(manifest)) {
  const base = name.replace(/-mobile$/, "");
  if (name !== base && HERO.has(base)) continue;
  if (!files.some((f) => f.replace(/\.(jpe?g|png|webp)$/i, "") === name)) delete manifest[name];
}

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1));
console.log(`optimized ${done}, skipped ${skipped}, manifest entries ${Object.keys(manifest).length}`);
