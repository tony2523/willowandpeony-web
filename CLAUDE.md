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
1b. **Email (Resend, free tier) is LIVE** (domain verified, key set,
   tested 2026-10-01). For reference, it was set up like this: verify `willowandpeony.co.nz` in Resend (its "Sign in to
   Cloudflare" button adds three records on subdomains only), create a
   sending-only API key, and add it as the `RESEND_API_KEY` secret on the
   worker. Test with a real submission. NEVER enable Cloudflare Email
   Routing on this zone: it rewrites the apex MX and breaks Ivy's Google
   Workspace inbox.
2. Workers & Pages → willowandpeony → Settings → Domains & Routes → add
   custom domains `willowandpeony.co.nz` and `www.willowandpeony.co.nz`.
3. Verify the 52 legacy Shopify URLs 301 correctly on the live domain.
4. Submit `https://willowandpeony.co.nz/sitemap.xml` in Google Search Console;
   set up Cloudflare Web Analytics.
5. GitHub Pages already retired — optionally flip the repo private
   (verify Workers Builds still deploys afterwards).

## Where content lives (edit these, not the page components, for routine updates)

- `content/site.ts` — business facts: contact details, nav, the consultation
  booking link (`site.consultationUrl`, Ivy's Calendly), FAQs. FAQs are also
  emitted as FAQPage structured data and into llms.txt; the cost and delivery
  answers read their numbers from content/calculator.ts.
- `content/journal/*.md` — one file per journal post (real weddings/events).
  Frontmatter: `title`, `description` (meta description, ≤155 chars), `date`
  (YYYY-MM-DD), `category` (`weddings` | `events`), `venue`, `cover` (image
  name from the manifest, no extension), optional `seoTitle` (search title
  when the display title is over ~43 chars). Journal articles in
  `content/blog/` also take `seoDescription` (their `description` shows on
  the /journal/ listing). Plain `&` in frontmatter, never `&amp;`. Body is markdown; images are
  `![alt](/images/<image-name>)` — alt text doubles as SEO, write it well.
- `content/redirects.json` — legacy URL → new URL map. Post-build script
  writes a meta-refresh stub for every entry.
- `content/legal/*.md` — privacy policy & terms (rendered by LegalPage).
- `content/calculator.ts` — wedding flower calculator prices, services,
  styles and photos (single source of truth for the page AND the Worker's
  estimate emails). See "Wedding flower calculator" below.

## Wedding flower calculator (/wedding-flower-calculator/)

Ivy's itemised estimator (built from her handoff, Oct 2026). Prices are NZD,
exclude GST, and display as "from" prices everywhere.

- Change a price: edit `content/calculator.ts`, build, push. The page,
  JSON-LD price catalogue, llms.txt price list and estimate emails all
  update from that one file.
- Add photos: drop `calculator-<id>-<tier>-<n>.jpg` (or
  `calculator-<id>-<n>.jpg` for untiered items) into `assets/img-src/`, run
  `npm run images` (calculator photos get no OG card), then list them in
  `PHOTOS`. An item only shows once it has photos; flower girl bouquet,
  flower girl crown, hair flowers and aisle petals are waiting on photos.
- Guided journey (Tony, 5 Oct 2026): one category at a time as numbered
  accordion steps (Bridal party, Ceremony, Reception, Details & petals,
  Delivery & services, Review & send). Starts EMPTY at step 1. Every card
  lists its options as radio-style rows: "Not required" (selected by
  default), then Essential / Signature / Luxe, each with its tier note and
  price ("Not offered" when a tier isn't available). Untiered pieces show
  "Not required" and a single "Signature" option. Choosing an option adds
  one and only then shows the quantity row at the foot of the card; stepping down past 1 (or
  clearing the box) returns the piece to Not required. Cards are one
  per row: photo left and options right from sm up, stacked with a square photo
  on phones (Tony, 6 Oct 2026: show more of the flowers; the options then run below the
  fold on phones, which he accepted over the earlier one-screen fit). No separate tier explainer and
  no tier comparison at Review (Tony, 5 Oct 2026: each piece carries its
  own tier). Each step ends with one "Next" button (no skip link: Next
  already moves on). Finished steps collapse to "N pieces · from $X", or
  "Skipped" when nothing was chosen. Collapsed steps stay in the DOM (hidden) so every price is
  crawlable. Desktop keeps a sticky running estimate; phones a bottom bar.
- Logic lives in `src/lib/estimate.ts` (pure, relative imports only:
  wrangler bundles it into the Worker). Regression check: Ivy's typical
  Signature wedding (`exampleSelection()`, no longer shown on the page)
  totals from $4,680 (florals $4,090 + services $590).
- `?e=<code>` reopens an estimate at Review & send (used by the emailed link).
- Worker `POST /api/estimate`: `email` sends the couple their estimate from
  hello@ with ivy@ BCC'd; `enquire` sends Ivy the estimate plus the couple's
  details, reply-to the couple, then sends the couple a confirmation from
  "Ivy" with the Calendly booking button and their estimate (a failure of
  that second email is logged, not reported, since Ivy has the lead).
- "Ready to talk it through?" is two steps (Tony, 5 Oct 2026): 01 send your
  details to Ivy, 02 book your consultation. No booking link before sending;
  on success only that box swaps to the thank-you with the booking button. Totals are recomputed server-side from the
  share code, so the form can't relay arbitrary content.
- Ivy's answers (5 Oct 2026): vase and plinth hire is included; full-service
  wedding design "starts from $2,500" (`FULL_SERVICE_FROM`, stated in the
  fine print, emails, FAQ and Weddings page, never enforced); tier notes are
  "Petite · Balanced · Seasonal" / "Fuller · Layered · Premium" /
  "Abundant · Luxurious · Statement". She calls the levels "floral tiers".

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
  title ≤ 60 chars (the ` | Willow & Peony` suffix is dropped automatically
  when it would overflow), description 110–155 chars, canonical on the
  production domain. Venue guides read `metaDescription` from
  content/venues.ts.
- JSON-LD: Florist + WebSite ship site-wide from the layout; Service/Offer on
  service pages; Article on posts; FAQPage on /faq/; BreadcrumbList on inner
  pages. Builders live in `src/lib/seo.ts`.
- AEO: `/llms.txt` (route handler) regenerates from content on every build;
  keep `content/site.ts` facts accurate and it stays accurate.
- Images: always through the `Pic` component or markdown (posts) so width/
  height/srcset/lazy-loading are emitted. LCP/hero images set `priority`.
  Variants: 480/768/960/1200/1600w WebP (768 and 1200 fit 2x/3x phones).
  `npm run images` only encodes missing variants and keeps hand-made extras
  (home hero 1800w/2400w). Card thumbnails inside a titled link use
  `alt=""` (the title names the link); story pages carry the real alt.


## Design contract — editorial redesign (BUILT, 2026-10-01)

The approved editorial redesign from the Design canvas
(https://claude.ai/artifact/VsGEFc7EbBNXMYr2MDMNYq, 26 boards incl. full
mobile set) is now the LIVE design. The old pixel-copy-of-Shopify contract
is retired. The system:

- Palette (globals.css tokens): ink #1a1815 · soft #57524b · muted #756f66
  (darkened from #8a847b for WCAG AA on white and paper — don't lighten) ·
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
- Nav: Weddings · Events · Our Story · Gallery + Enquire button from 1024px
  (`lg`); below that the burger drawer (four links wrap at tablet widths).
  Drawer carries the extended set (`drawerNav`), is `inert` and shadowless
  when closed (it's portalled to <body>).
- No wedding packages (Ivy discontinued them, 5 Oct 2026): no packages page,
  copy or structured data. /wedding-flower-packages/ and the old Shopify
  /pages/wedding-packages 301 to the calculator. Pricing language is the
  calculator's "from" prices plus "full-service wedding design starts from
  $2,500". Required form fields carry an asterisk with a "* Required" note.
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
- Header clearance: on pages with the solid white header (everything except
  the photo-hero pages: home, weddings, events, venue guides),
  content must start at least 56px below the header line; desktop split
  heroes use `md:pt-20`. Never place a photo flush against the header line
  (Tony, 2026-10-01).
- Never redesign the logo (public/brand/ PNGs are the originals — keep as is).
- Reviews: content/reviews.ts holds the 14 Google reviews verbatim + the
  profile URL. Update by re-reading the Google Business Profile.
- Motion (6 Oct 2026, keep it subtle): tokens `--ease-out`, `--ease-soft`,
  `--dur-wipe` in globals.css. Buttons sweep their fill left to right with
  the label colour split exactly at the fill edge (three background layers,
  label clipped to text); Firefox gets a plain fill sweep plus a colour
  change at the midpoint (`@supports (-moz-appearance: none)`). Links:
  `.t-link` redraws its line, footer `.link-sweep` grows one in, nav lines
  go in from the left and out to the right. Heros: `hero-settle` (photo
  eases from 1.06 scale) and `hero-in` (text staggers up; the h1 moves but
  never fades, so LCP is untouched). EVERY page's top copy block (eyebrow,
  h1, intro) carries `hero-in`, with the h1 as a direct child: Tony wants the
  same entrance on every page, so give new pages and templates it too, and
  wrap only the title part when long body text follows (FAQ, LegalPage). `src/components/Motion.tsx` fades in
  content that starts BELOW the fold as it scrolls into view, fades lazy
  images in once loaded and smooth-scrolls same-page # links. No fade on
  page changes (it blinks: Tony removed it). Opt an element out with
  `data-no-reveal`; carousels, sideways scrollers, `details`, fixed/sticky
  and the header/footer are skipped already. All of it is off under
  prefers-reduced-motion. Never fade anything above the fold.

## Constraints

- **Static export** (`output: "export"`) — no server code, no API routes
  (route handlers must stay `force-static`), no next/image optimizer. GitHub
  Pages serves flat files.
- Email: one Resend helper in `worker/index.js` sends everything
  (`RESEND_API_KEY` secret; vars in wrangler.jsonc: `EMAIL_FROM` =
  hello@, `NOTIFY_TO` = ivy@). Rule (Tony, 2026-10-01): every email is
  sent from hello@, the only address customers see or reply to; all
  notifications and copies go to ivy@. There is no enquiries@ mailbox,
  never use it.
  - `POST /api/enquiry` (EnquiryForm) emails ivy@, reply-to the customer. Without the key it
    answers 503 and the form falls back to a pre-filled mail draft.
  - `POST /api/calendar` (CalendarSignup: first/last name, email,
    consultation tickbox) emails the visitor the download link (template in
    `calendarEmail()`; no attachment), reply-to hello@, with ivy@ BCC'd on every one, the
    visitor's full name on the To line so Ivy sees who downloaded. The
    consultation tick adds a line to that email. Klaviyo is deliberately not
    involved (Tony, 2026-10-01). The visitor is then sent to
    `/wedding-flower-calendar/download/` (`?sent=1` shows the "emailed you
    the link" note). Without the key: `emailed:false`, download page only.
  - Optional hardening: a free Turnstile widget + `TURNSTILE_SECRET`; both
    endpoints enforce it automatically when the secret exists.
  - The calendar PDF (`public/downloads/`) was recompressed, visually identical,
    from 9.3 MB to 4.5 MB (PyMuPDF `rewrite_images` quality 85, no
    downsampling; downsampling broke the circular flower images). Preview
    images in `assets/img-src/wedding-flower-calendar-*.png` are rendered
    from the PDF; re-render them if Ivy updates the calendar.
- Keep third-party scripts at zero. Page speed is a feature.

## Commands

- `npm run dev` — dev server (note: llms.txt/feed routes behave slightly
  differently in dev; trust the static build).
- `npm run build` — static export to `out/` + postbuild (redirect stubs).
- `npm run images` — (re)generate image variants after adding photos.
- `npx serve out -l 4173` — preview the real static output.

## Instagram feed (home page grid)

- The grid shows Ivy's own posts captioned with **#willowandpeony** (exact
  tag; #willowandpeonynz etc. don't count), newest first, 12 tiles, or 6
  when only 6–11 are tagged. Fewer than 6 → the curated tiles in
  `InstagramFeed.tsx`. The Worker (`/api/instagram`) reads up to 200 of her
  recent posts and filters on the caption, edge-cached 6 hours.
- Every Instagram API call needs a token; there is no public, tokenless API
  (unauthenticated oEmbed ended Oct 2020, Basic Display ended Dec 2024).
  Instagram's own hashtag search is the wrong tool: Meta app review,
  Facebook-linked account, any account's posts, and only the last 24 hours.
- Token: "Instagram API with Instagram Login" long-lived user token for
  @willowandpeony.nz (a professional account), stored as the Worker secret
  `INSTAGRAM_TOKEN` (Cloudflare dashboard → Workers → willowandpeony-web →
  Settings → Variables and Secrets). Tony or Ivy sets it; Claude never
  handles tokens. It expires after 60 days unless refreshed
  (`graph.instagram.com/refresh_access_token`); when it lapses the grid
  quietly falls back to the curated tiles.

## Gallery

- `/gallery/` has two filters, Weddings (default) and Events; no "All" (Tony, 6 Oct 2026).
- Weddings are Ivy's curated photos, `assets/img-src/gallery-<wedding>-NN.jpg`,
  grouped in `content/gallery.ts` (one alt text per wedding). Add a photo with the
  next number and run `npm run images`; gallery photos get no OG card. Imported
  photos are normalised first: auto-oriented JPEG, max 2400px wide.
- Events are every inline image from the event stories in `content/journal`.
- One continuous gallery per filter (Tony, 6 Oct 2026): each wedding's or event's
  photos sit side by side, no labels or sections; weddings in `content/gallery.ts`
  order, events newest story first. Justified rows sized to each photo's shape. No pagination on the gallery page (Tony,
  6 Oct 2026): all photos render, native lazy loading plus an observer that starts each
  image two screens ahead. Our Work still loads 48 at a time.
- Gallery teasers (`GalleryFeature`): an editorial nine-photo mosaic (six on phones), almost
  edge to edge, sized so heading and photos fit one screen, on the home page
  and the Weddings page (wedding photos, link to `/gallery/`) and the Events page
  (event photos, link to `/gallery/?type=events`, which opens the gallery on Events).
  Photos are picked by name in each page; slot shapes, in order: portrait, landscape,
  landscape, portrait, portrait, portrait, landscape, portrait, portrait. It replaced the home featured wedding and the
  Weddings photo strip (Tony, 6 Oct 2026).
- Large screens: all sizes are rem. Above 1760px the root grows to 17.44px (109%) at
  2240px (24" iMac) and stays there; wider screens only widen the content column,
  `--site-column: max(80rem, 62.3vw)` in globals.css, used as `max-w-(--site-column)`
  everywhere the site column was 80rem (Tony, 6 Oct 2026). Nothing changes below 2240px.
- The full gallery uses the same nine-photo mosaic as the teasers (`src/components/mosaic.ts`):
  blocks of nine, alternate blocks mirrored, photos slotted by shape within a block, a
  last partial block as justified rows. Teaser photos open the shared `Lightbox`
  (also used by the gallery page) instead of linking away; only the heading link goes to
  the gallery (Tony, 6 Oct 2026).
- Insets (Tony, 6 Oct 2026): an image that has padding beside it on large screens keeps
  it at every width, phones to laptops (sit it inside `max-w-(--site-column) px-5 sm:px-6`).
  Only full-bleed heroes, strips and gallery mosaics run edge to edge, and they do so at
  every width. `scripts`-style check: no image may touch a screen edge at 768-1920px
  while being inset at 2560px.
- Split-section photos stay portrait at every width: wrap in `@container` and use
  `h-[clamp(110cqw,calc(100svh-8rem),125cqw)] w-full object-cover`, i.e. 4:5 when there
  is room, trimmed top and bottom to fit one screen, never squarer than 10:11.
- Banners: object-cover fills a fixed-height box, so `sizes` must give the drawn width
  (home: `(max-aspect-ratio: 3/2) 150vh, 100vw`; Hero computes it). Banner photos are
  in the pipeline's HERO list (quality 86, full-width size). They are 2000px wide, so
  retina Macs show them at 2x; only a larger original makes them sharper there.
- Date fields (`DateInput`): the site's own calendar, not the browser's. Clicking anywhere
  in the box opens it underneath at the box's width (short month names under 260px).
  The field holds "Saturday 14 March 2027" under its `name`, so FormData, emails and
  `required` work; typing is blocked; past dates disabled; keyboard: Enter/arrows/PageUp/
  PageDown/Escape. Tests pick a date by clicking a day, not by typing.
- Emails per form: Contact/Weddings/Events enquiries go to Ivy (reply-to the person);
  wedding enquiries (Contact Wedding + Weddings page) also send the person "Thank you,
  your enquiry is with Ivy" with the Calendly button (Tony, 6 Oct 2026). Calculator
  "Send to Ivy" sends the same thank-you plus their estimate; "Email me my estimate" and
  the Flower Calendar go to the person with Ivy BCC'd. Event/general send the person nothing.
- Banner phone crops: the pipeline's HERO map (name -> focal x) also writes a 3:5
  "<name>-mobile" crop; `HeroImage` serves it to portrait phones via <picture>. Change a
  banner photo: replace the source, run `npm run images` (the crop regenerates).
- Gallery preloading starts after window load so the first screen gets bandwidth first.
- LIVE since 6 Oct 2026, 12:40 NZT: willowandpeony.co.nz and www are Worker custom domains
  (wrangler.jsonc routes); Shopify's apex A/AAAA and www CNAME were deleted. The Worker
  301s www and plain http to https on the apex. staging.* still serves the same build with
  noindex. Keep the zone's MX (Google Workspace), SPF/DMARC/google-site-verification TXT
  and the send/rsend/resend records (Resend) untouched.
- Image alt text for story photos lives in the markdown (`![alt](/images/name)`); the gallery and
  gallery sections reuse it via `post.imageAlts`. Write specific alts (flowers, setting, event,
  venue), never the old generic "<title> — florals by Willow & Peony". Event stories done 6 Oct 2026.
