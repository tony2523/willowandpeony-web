# Willow & Peony — willowandpeony.co.nz

Static Next.js site for Willow & Peony, a boutique wedding & event florist in
Auckland (founder: Ivy Diao). Information site only — no e-commerce. Rebuilt
from the original Shopify store in September 2026.

## The workflow (how updates ship)

1. Edit content (see below) → `npm run build` locally if you want to verify.
2. Commit and push to `main`.
3. GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys to
   GitHub Pages automatically. Nothing else to do.

Repo: `tony2523/willowandpeony-web`. TWO deploy targets run from every push
during the transition (2026-09-30):

- **Cloudflare Workers static assets (the keeper)** — same pattern as
  moustacherepublic-web: **Workers Builds** is connected to the GitHub repo in
  the Cloudflare dashboard (Tony's t@tonyhou.com account, id
  c4a3b32fddc9a1621a097c0c1a61f810), so Cloudflare itself builds and deploys
  on every push to main. Worker name `willowandpeony`; config `wrangler.jsonc`
  (assets from `out/`, `worker/index.js` only rewrites Next's `$` nav-data
  paths); build command `npm run build`, deploy command `npx wrangler deploy`,
  build variable `NODE_VERSION=22`. No API token or GitHub secret involved.
  Real 301s come from the generated `_redirects`; caching + security headers
  from `_headers` (both written by scripts/postbuild.mjs; workers.dev hosts
  get X-Robots-Tag noindex).
- **GitHub Pages (legacy, retire after Cloudflare is confirmed)** —
  `.github/workflows/deploy.yml`, preview under tonyhou.com/willowandpeony-web/
  via repo vars `PAGES_BASE_PATH` / `DEPLOY_CNAME`. When retiring: delete that
  workflow, disable Pages in repo settings, then the repo can go PRIVATE.

**Image caching rule:** `_headers` gives `/images/*` a one-year immutable
cache. Never re-use an image filename for a different photo — replacements get
a new descriptive name.

**Go-live checklist — Cloudflare** (when Tony says to point the domain):
1. Add `willowandpeony.co.nz` as a zone in the t@tonyhou.com Cloudflare
   account; update the nameservers at the registrar to the ones Cloudflare
   assigns (this moves DNS off Shopify).
2. Workers & Pages → willowandpeony → Settings → Domains & Routes → add
   custom domains `willowandpeony.co.nz` and `www.willowandpeony.co.nz`.
3. Verify the 52 legacy Shopify URLs 301 correctly on the live domain.
4. Submit `https://willowandpeony.co.nz/sitemap.xml` in Google Search Console;
   set up Cloudflare Web Analytics.
5. Retire GitHub Pages (see above) and flip the repo private.

## Where content lives (edit these, not the page components, for routine updates)

- `content/site.ts` — business facts: contact details, nav, wedding packages
  (names/prices/inclusions), FAQs, delivery info. FAQs here are also emitted
  as FAQPage structured data and into llms.txt automatically.
- `content/journal/*.md` — one file per journal post (real weddings/events).
  Frontmatter: `title`, `description` (meta description), `date`
  (YYYY-MM-DD), `category` (`weddings` | `events`), `venue`, `cover` (image
  name from the manifest, no extension). Body is markdown; images are
  `![alt](/images/<image-name>)` — alt text doubles as SEO, write it well.
- `content/redirects.json` — legacy URL → new URL map. Post-build script
  writes a meta-refresh stub for every entry.
- `content/legal/*.md` — privacy policy & terms (rendered by LegalPage).

## Adding a new journal post (the most common task)

1. Drop the photos into `assets/img-src/` with descriptive kebab-case
   filenames (they become the public filenames — good image SEO), e.g.
   `mudbrick-waiheke-wedding-bridal-bouquet.jpg`.
2. `npm run images` — generates WebP variants + OG jpg into `public/images/`
   and updates `src/lib/image-manifest.json`. Commit the generated files.
3. Create `content/journal/<seo-slug>.md` — slug should carry the venue +
   "wedding-flowers" keywords, e.g. `mudbrick-waiheke-wedding-flowers.md`.
4. Reference images by manifest name: `![Bride holding…](/images/mudbrick-waiheke-wedding-bridal-bouquet)`.
5. Build, commit, push. The post appears on /journal/, the home page,
   category pages, sitemap, RSS and llms.txt automatically.

## SEO conventions (keep these intact)

- URLs: keyword-rich, always trailing slash. Never rename an existing URL
  without adding the old one to `content/redirects.json`.
- Every page defines metadata via `pageMetadata()` (`src/lib/seo.ts`) —
  title ≤ 60 chars, description ~150 chars, canonical on the production
  domain.
- JSON-LD: Florist + WebSite ship site-wide from the layout; Service/Offer on
  service pages; Article on posts; FAQPage on /faq/; BreadcrumbList on inner
  pages. Builders live in `src/lib/seo.ts`.
- AEO: `/llms.txt` (route handler) regenerates from content on every build;
  keep `content/site.ts` facts accurate and it stays accurate.
- Images: always through the `Pic` component or markdown (posts) so width/
  height/srcset/lazy-loading are emitted. LCP/hero images set `priority`.

## Design contract (Tony's explicit instruction, 2026-09-30)

The site must look like the ORIGINAL Shopify site as much as possible.
MEASURED SPEC (2026-09-30, taken from the live original at 1440×900 — do not
eyeball, these are the numbers):
- Body: Chivo 300, 15px/21px, #000; secondary text #4d4d4d; borders #e1e1e1.
- Headings (`globals.css` utilities): `.h-page` 28.6px, `.h-card` 21.6px —
  Newsreader 400, ls -0.02em, same size on mobile. `.label` Chivo 400 12.6px
  ls .08em; `.link-text` 11.7px underlined. Serif-bold body subheads 16.8px.
- Header: 51px tall, logo 250×30 (160×19 mobile), nav links Newsreader 16.8px
  normal case; transparent over the hero on home/weddings/packages/events/about.
- Home: 100svh hero → 88px rhythm between all sections → intro (640/580 cols)
  → 3 service cards (452:582, 20px gap, 12.6px grey labels) → founder (292px
  image + 560px text, centred) → latest work (4 SQUARE cards, 24px gap).
- Page banners: 65vh, centred white 28.6px title on the image.
- Weddings/Events: banner → 2-up 720×922 snap carousel → centred 640px rich
  text → latest work (3 cards) → enquiry form.
- Packages: centred intro → alternating 321×418 image / 501px text rows.
- Our Story: banner with intro on image → half-bleed 720×900 image+text →
  4-up 331×425 bouquet carousel.
- Journal: listing = 21.6px title + 4-col square grid; post = date/author
  caption, centred 28.6px title, 972px cover, 608px body col, 21.6px h2s,
  prev/next links.
- Contact: 608px text left + 442px compact form (E-mail, Message, Send).
- Forms: `.input-wp` (41px, 15px Chivo) and `.btn-wp` (11.7px outlined).

Also:
- Pure white background, black text, grey secondary (#4d4d4d), #e1e1e1 hairlines,
  black buttons. No warm/rose accent colours.
- Header: nav links left, CENTRED logo, enquire right; transparent with the
  white logo over the home hero, solid white elsewhere. Mobile: burger left,
  centred logo, slide-in drawer.
- Home: clean full-height hero (no text overlay), centred serif intro heading,
  3 minimal service cards, white founder section, 4-col "Our Latest Work"
  (weddings category), centred-logo divider above the footer.
- Footer: tagline + Customer Service / About Us / Policies columns + newsletter.
- Never redesign the logo (public/brand/ PNGs are the originals — keep as is).

## Constraints

- **Static export** (`output: "export"`) — no server code, no API routes
  (route handlers must stay `force-static`), no next/image optimizer. GitHub
  Pages serves flat files.
- Forms: `EnquiryForm` posts to `site.formEndpoint` (Formspree/Web3Forms
  style). It is currently EMPTY → falls back to a pre-filled mailto draft.
  To upgrade: create a (free) Formspree form, paste its endpoint into
  `content/site.ts`.
- Calendar signup posts the email to Klaviyo (company id in `content/site.ts`)
  client-side, then routes to the download page. No Klaviyo JS is loaded.
- Keep third-party scripts at zero. Page speed is a feature.

## Commands

- `npm run dev` — dev server (note: llms.txt/feed routes behave slightly
  differently in dev; trust the static build).
- `npm run build` — static export to `out/` + postbuild (redirect stubs).
- `npm run images` — (re)generate image variants after adding photos.
- `npx serve out -l 4173` — preview the real static output.
