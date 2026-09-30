# Willow & Peony — willowandpeony.co.nz

Static Next.js site for Willow & Peony, a boutique wedding & event florist in
Auckland (founder: Ivy Diao). Information site only — no e-commerce. Rebuilt
from the original Shopify store in September 2026.

## The workflow (how updates ship)

1. Edit content (see below) → `npm run build` locally if you want to verify.
2. Commit and push to `main`.
3. GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys to
   GitHub Pages automatically. Nothing else to do.

Repo: `tony2523/willowandpeony-web`. Deployment mode is controlled by two
repo variables (`gh variable set …`):

- `PAGES_BASE_PATH` — set to `/willowandpeony-web` while previewing at
  `https://tony2523.github.io/willowandpeony-web/` (also forces noindex).
  Set to empty for the production custom-domain build.
- `DEPLOY_CNAME` — set to `willowandpeony.co.nz` at go-live (writes the CNAME
  file). Empty during preview.

**Go-live checklist** (when Tony says to point the domain):
1. `gh variable set PAGES_BASE_PATH -b ""` and `gh variable set DEPLOY_CNAME -b "willowandpeony.co.nz"`
2. Set the custom domain in repo Settings → Pages (or `gh api repos/tony2523/willowandpeony-web/pages -X PUT -f cname=willowandpeony.co.nz`).
3. DNS: `willowandpeony.co.nz` A records → GitHub Pages IPs (185.199.108.153,
   .109., .110., .111.) or ALIAS/ANAME to `tony2523.github.io`; `www` CNAME →
   `tony2523.github.io`. Enable "Enforce HTTPS" once the cert is issued.
4. Re-run the deploy workflow, then submit `https://willowandpeony.co.nz/sitemap.xml`
   in Google Search Console.

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
