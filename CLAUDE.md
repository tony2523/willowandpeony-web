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

- **Cloudflare Pages (the keeper)** — `.github/workflows/deploy-cloudflare.yml`
  deploys to project `willowandpeony` (preview: https://willowandpeony.pages.dev,
  auto-noindexed by Cloudflare). Account: Tony's t@tonyhou.com Cloudflare
  account, id in repo variable `CLOUDFLARE_ACCOUNT_ID`
  (c4a3b32fddc9a1621a097c0c1a61f810). Auth: repo secret `CLOUDFLARE_API_TOKEN`
  (Account → Cloudflare Pages → Edit). The workflow skips politely if the
  secret is missing. Real 301s come from the generated `_redirects`; caching
  and security headers from `_headers` (both written by scripts/postbuild.mjs).
- **GitHub Pages (legacy, retire after Cloudflare is confirmed)** —
  `.github/workflows/deploy.yml`, preview under tonyhou.com/willowandpeony-web/
  via repo vars `PAGES_BASE_PATH` / `DEPLOY_CNAME`. When retiring: delete that
  workflow, disable Pages in repo settings, then the repo can go PRIVATE
  (Cloudflare deploys fine from a private repo).

**Image caching rule:** `_headers` gives `/images/*` a one-year immutable
cache. Never re-use an image filename for a different photo — replacements get
a new descriptive name.

**Go-live checklist — Cloudflare** (when Tony says to point the domain):
1. Add `willowandpeony.co.nz` as a zone in the t@tonyhou.com Cloudflare
   account; update the nameservers at the registrar to the ones Cloudflare
   assigns (this moves DNS off Shopify).
2. Workers & Pages → willowandpeony → Custom domains → add
   `willowandpeony.co.nz` and `www.willowandpeony.co.nz`.
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

The site must look like the ORIGINAL Shopify site as much as possible:
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
