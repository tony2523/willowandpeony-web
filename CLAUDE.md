# Willow & Peony — willowandpeony.co.nz

Static Next.js site for Willow & Peony, a boutique wedding & event florist in
Auckland (founder: Ivy Diao). Information site only — no e-commerce. Rebuilt
from the original Shopify store in September 2026.

## The workflow (how updates ship)

1. Edit content (see below) → `npm run build` locally if you want to verify.
2. Commit and push to `main`.
3. GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys to
   Cloudflare automatically. Nothing else to do.

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
- **GitHub Pages: RETIRED (2026-10-01)** — the workflow and the Pages site
  at tonyhou.com/willowandpeony-web/ were deleted. Cloudflare is the only
  deploy target; previews live on workers.dev and staging.willowandpeony.co.nz
  (both stamped X-Robots-Tag: noindex by the Worker).

**Image caching rule:** `_headers` gives `/images/*` a one-year immutable
cache. Never re-use an image filename for a different photo — replacements get
a new descriptive name.

**Go-live checklist — Cloudflare** (when Tony says to point the domain):
1. Add `willowandpeony.co.nz` as a zone in the t@tonyhou.com Cloudflare
   account; update the nameservers at the registrar to the ones Cloudflare
   assigns (this moves DNS off Shopify).
1b. **Email Routing** (makes the enquiry form live): zone → Email → Email
   Routing → enable; add `hello@willowandpeony.co.nz` as a destination
   address and click the verification email; create a route or catch-all so
   hello@ forwards wherever Ivy reads mail. The form then sends via the
   Worker with zero third parties. Test with a real submission.
2. Workers & Pages → willowandpeony → Settings → Domains & Routes → add
   custom domains `willowandpeony.co.nz` and `www.willowandpeony.co.nz`.
3. Verify the 52 legacy Shopify URLs 301 correctly on the live domain.
4. Submit `https://willowandpeony.co.nz/sitemap.xml` in Google Search Console;
   set up Cloudflare Web Analytics.
5. GitHub Pages already retired — optionally flip the repo private
   (verify Workers Builds still deploys afterwards).

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


## Design contract — editorial redesign (BUILT, 2026-10-01)

The approved editorial redesign from the Design canvas
(https://claude.ai/artifact/VsGEFc7EbBNXMYr2MDMNYq, 26 boards incl. full
mobile set) is now the LIVE design. The old pixel-copy-of-Shopify contract
is retired. The system:

- Palette (globals.css tokens): ink #1a1815 · soft #57524b · muted #8a847b ·
  hairline #e6e2da · paper #f7f5f0 · white. CTA bands are always warm paper,
  never black. Buttons: `.btn-solid` (ink), `.btn-white` / `.btn-ghost-white`
  on photos, `.btn-outline` for load-more.
- Type: Newsreader Light display (`.display-hero/-1/-2/-3`, clamp scales,
  italic `<em>` accents), Chivo 300 body 15px/1.6, `.eyebrow` 11.5px caps
  ls .18em, `.t-link` 12px caps with bottom border.
- Spacing system (Tony's margin rule): every section owns its gaps —
  `mt-24 md:mt-[140px]` between sections, and a coloured band never sits
  flush against content; the white gap comes BEFORE the band, identical
  whatever the colours. Interior page heros are 640px (`Hero`), home is
  100svh.
- Nav: Weddings · Events · Our Story · Gallery + Enquire button; drawer
  carries the extended set (`drawerNav`). "Wedding packages" everywhere —
  never "wedding investment".
- Reusable modules: `LatestWork` (3 cards → /work/ pre-filtered),
  `TestimonialSlider` (real Google reviews from content/reviews.ts, 5.0/14),
  `ProcessSteps`, `CtaBand`, `WorkGrid` (filters + load more),
  `GalleryLightbox` (filters + full-screen flick-through), `EnquiryForm`
  (field sets copied from the live Shopify forms: 15-item floral
  requirements checklist etc.; contact page adds the type selector).
- New routes: /gallery/, /work/, /venues/ + /venues/<slug>/ (data in
  content/venues.ts — facts researched from venue sites, photos are W&P's
  own work at each venue). Journal posts render as story pages (details
  rail, credits band, keep-reading, category-flavoured CTA).
- Never redesign the logo (public/brand/ PNGs are the originals — keep as is).
- Reviews: content/reviews.ts holds the 14 Google reviews verbatim + the
  profile URL. Update by re-reading the Google Business Profile.

## Constraints

- **Static export** (`output: "export"`) — no server code, no API routes
  (route handlers must stay `force-static`), no next/image optimizer. GitHub
  Pages serves flat files.
- Forms: `EnquiryForm` posts JSON to the site's own Worker
  (`POST /api/enquiry` in `worker/index.js`), which emails the studio via
  Cloudflare Email Routing's free `send_email` binding (wrangler.jsonc:
  `SEND_EMAIL`, vars `ENQUIRY_TO`/`ENQUIRY_FROM`). 100% Cloudflare, $0.
  Until the zone + Email Routing are live the Worker answers 503 and the
  form falls back to a pre-filled mail draft. Optional hardening once live:
  create a Turnstile widget (free) and `wrangler secret put TURNSTILE_SECRET`
  — the Worker enforces it automatically when the secret exists.
- Calendar signup posts the email to Klaviyo (company id in `content/site.ts`)
  client-side, then routes to the download page. No Klaviyo JS is loaded.
- Keep third-party scripts at zero. Page speed is a feature.

## Commands

- `npm run dev` — dev server (note: llms.txt/feed routes behave slightly
  differently in dev; trust the static build).
- `npm run build` — static export to `out/` + postbuild (redirect stubs).
- `npm run images` — (re)generate image variants after adding photos.
- `npx serve out -l 4173` — preview the real static output.
