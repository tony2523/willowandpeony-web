# Willow & Peony — project log

State of the project as of **2026-09-30**. Written so any fresh Claude session
(or human) can pick up exactly where things stand. Read alongside
[CLAUDE.md](../CLAUDE.md), which holds the working conventions.

## What this project is

willowandpeony.co.nz (Ivy's boutique Auckland wedding/event florist) rebuilt
from Shopify into a static Next.js 16 site. Information site only — no
e-commerce (Tony, 2026-09-30). Content lives in `content/` (markdown journal
posts + one facts file); every push to `main` deploys automatically.

## Timeline of what was done (all 2026-09-30)

1. **Migration** — crawled the live Shopify site (33 pages, 217 images,
   policies, Klaviyo id), rebuilt everything as Next.js static export:
   SEO URLs + 52 legacy-URL redirects, full metadata/JSON-LD/sitemap/robots/
   llms.txt/RSS, images renamed descriptively and pre-optimised to WebP.
2. **Pixel-fidelity pass** — measured the original with computed-style probes
   at 1440×900 and 375×812; matched every template to the numbers. The full
   measured spec is in CLAUDE.md ("Design contract"). Landmark deltas ≤4px.
3. **Hosting** — GitHub repo `tony2523/willowandpeony-web`; dual deploys:
   - **Cloudflare Workers Builds** (the keeper): repo connected in the
     Cloudflare dashboard (t@tonyhou.com account,
     c4a3b32fddc9a1621a097c0c1a61f810), worker `willowandpeony-web`. No API
     token anywhere. Real 301s via `_redirects`, caching/security via
     `_headers`. workers.dev URL: ask Tony or see dash (couldn't derive
     the account subdomain).
   - **GitHub Pages** (legacy, retire after Cloudflare confirmed):
     tonyhou.com/willowandpeony-web/ — noindexed preview. After retiring,
     flip the repo private.
4. **Enquiry email, 100% Cloudflare, $0** — `POST /api/enquiry` in
   `worker/index.js` sends via Email Routing's free `send_email` binding
   (to hello@, Reply-To enquirer, honeypot + optional Turnstile). Activates
   at go-live (zone + Email Routing + verify hello@ — checklist in
   CLAUDE.md). Until then the form falls back to a mail draft. Do NOT buy
   "Email Sending"/Workers Paid — different product, not needed.
   `/api/instagram` also exists: live IG feed via Graph API once the
   `INSTAGRAM_TOKEN` secret is set (edge-cached 6h); page falls back to
   curated tiles meanwhile.
5. **Redesign (IN REVIEW — not built)** — full editorial redesign on the
   Design canvas: **https://claude.ai/artifact/VsGEFc7EbBNXMYr2MDMNYq**
   11 boards: design language, Home, Weddings, Investment, Events,
   Gallery (new), Venue-guides index (new), Journal story, Our Story,
   Venue guide template (new), Contact.

## Redesign decisions locked by Tony's feedback (v2, on the canvas)

- Nav: **Weddings · Events · Our Story · Gallery** + Enquire. Journal and
  Investment demoted to footer/inline links.
- **Gallery page (new)**: filterable (All/Weddings/Events) image portfolio;
  tiles open a full-screen lightbox (flick-through, filters carry in).
- **Venue guides**: index page + per-venue template (SEO play:
  "[venue] wedding flowers").
- Buttons on photography: **white solid / white ghost** (never black on
  image). CTA bands: **warm paper #f7f5f0**, never black.
- Uniform rhythm: 140px section top-padding, 80px gutters, 24px grid gaps.
- Hero heights: home full-screen; all interior page banners 640px.
- Reusable "Latest work" 3-card block (Home, Weddings, Our Story — replaces
  the old bouquet strip on Our Story).
- Contact: enquiry-type selector (Wedding/Event/Something else) that swaps
  the field set; Ivy's portrait (not a bride) beside the form.
- Instagram: 6×2 grid desktop, 2-across mobile, tap → popup preview.
- Weddings page keeps ALL original copy (content-rich for SEO) + process.
- Editorial voice: Newsreader Light display with italic emphasis, 76/44/21
  scale, monochrome + paper.

## Still needed from Tony (bracketed placeholders on the boards)

- 2–3 real testimonials (couple + venue) · Google rating confirmation ·
  event client-logo permissions · photographer names/links for vendor
  credits · Instagram Graph API token (for the live feed) · workers.dev URL.

## Next steps

1. Tony reviews v2 boards → approves per page (or more feedback rounds).
2. Build approved designs into the Next.js site (design tokens exist in
   `System.dc.html`; components map cleanly onto existing ones).
3. Add new routes: /gallery/, /venues/, /venues/<slug>/ (+ redirects file
   entries if any URLs change).
4. Go-live: domain → Cloudflare zone, Email Routing, custom domain on
   worker, retire GH Pages, repo private, Search Console. (Checklist in
   CLAUDE.md.)

## Gotchas learned

- Pushing from the Claude sandbox fails on >~5MB packs (proxy); disable
  sandbox for pushes. Keep commits <10MB on slow uplinks.
- The Shopify original serves two nav DOMs — the visible desktop menu is
  Chivo 13.5px (hidden drawer set is Newsreader 16.8) — probe visible
  elements only (`getBoundingClientRect().width > 0`).
- Cloudflare Workers Builds worker name comes from the dashboard import
  (willowandpeony-web), overriding wrangler.jsonc's name.
