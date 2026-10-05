// The site's only server code, running on Cloudflare Workers:
//
//  1. POST /api/enquiry  — enquiry forms, emailed to the studio.
//  2. POST /api/calendar — Wedding Flower Calendar signups: emails the
//     download link to the visitor, with Ivy (ivy@) BCC'd on every one so
//     she can see who downloaded.
//
// Every email is sent from hello@ (the only address customers see or reply
// to); enquiries and calendar copies are delivered to ivy@.
//  3. GET /api/instagram — live Instagram feed (see below).
//  5. POST /api/estimate — wedding flower calculator: "email" sends the
//     couple their estimate (Ivy BCC'd), "enquire" sends it to Ivy with the
//     couple's details. Totals are recomputed here from content/calculator.ts
//     (bundled via src/lib/estimate.ts), never trusted from the browser.
//  4. Next.js navigation data files (`__next.journal.$d$slug...`): static
//     assets answer a literal "$" with a 307 to "%24" which Safari rejects,
//     so we fetch the encoded path directly.
//
// Email goes out through Resend (resend.com, free tier) and needs the
// RESEND_API_KEY secret, with willowandpeony.co.nz verified in Resend.
// Without it the enquiry endpoint answers 503 (the form falls back to a
// pre-filled mail draft) and the calendar endpoint answers emailed:false
// (the visitor still downloads it on the next page), so nothing is lost.

import {
  GST,
  compute,
  decodeSelection,
  encodeSelection,
  money,
  quotedExtras,
  tierSummary,
} from "../src/lib/estimate";
import { FULL_SERVICE_FROM } from "../content/calculator";
import { formatDate } from "../src/lib/dates";
import { site } from "../content/site";

const MAX = { name: 200, email: 254, message: 5000, other: 300 };
const CALENDAR_PDF = "/downloads/willow-and-peony-wedding-flower-calendar.pdf";

function clean(value, cap) {
  return String(value ?? "")
    .replace(/[\r\n]+/g, " ")
    .trim()
    .slice(0, cap);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/** Canonical origin for links in emails; preview hosts link to themselves. */
function siteOrigin(request) {
  const url = new URL(request.url);
  if (url.hostname === "willowandpeony.co.nz" || url.hostname === "www.willowandpeony.co.nz") {
    return "https://willowandpeony.co.nz";
  }
  return url.origin;
}

async function sendEmail(env, message) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
  if (!r.ok) throw new Error(`Resend ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return r.json();
}

async function verifyTurnstile(request, env, token) {
  if (!env.TURNSTILE_SECRET) return true;
  const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: env.TURNSTILE_SECRET,
      response: token ?? "",
      remoteip: request.headers.get("CF-Connecting-IP") ?? undefined,
    }),
  }).then((r) => r.json());
  return !!verify.success;
}

async function handleEnquiry(request, env) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: "invalid request" }, 400);
  }

  // Honeypot: bots fill it, humans never see it. Pretend success.
  if (data._gotcha) return json({ ok: true });

  const email = clean(data.email, MAX.email);
  const message = cleanBlock(data.message, MAX.message);
  // Wedding comments are optional (date, venue, budget and the checklist carry the brief).
  if (!isEmail(email) || (!message && data.kind !== "wedding")) {
    return json({ error: "email and message are required" }, 400);
  }
  if (!(await verifyTurnstile(request, env, data.turnstileToken))) {
    return json({ error: "verification failed" }, 400);
  }
  if (!env.RESEND_API_KEY) return json({ error: "email not configured yet" }, 503);

  const name = clean(data.name, MAX.name);
  const kind = ["wedding", "event"].includes(data.kind) ? data.kind : "general";
  const { subject, text, html } = enquiryEmail(data, { name, email, message, kind });

  try {
    await sendEmail(env, {
      from: `Willow & Peony Website <${env.EMAIL_FROM}>`,
      to: [env.NOTIFY_TO],
      // Replying in Ivy's inbox goes straight to the customer.
      reply_to: name ? `${name.replace(/[<>",]/g, "")} <${email}>` : email,
      subject,
      text,
      html,
    });
  } catch (e) {
    return json({ error: `send failed: ${e.message}` }, 502);
  }
  return json({ ok: true });
}

/** Multi-line user text: keep line breaks, trim, cap. */
function cleanBlock(value, cap) {
  return String(value ?? "")
    .replace(/\r\n?/g, "\n")
    .trim()
    .slice(0, cap);
}

const PAGE_NAMES = {
  "/contact/": "Contact page",
  "/wedding-flowers-auckland/": "Weddings page",
  "/event-flowers-auckland/": "Events page",
};

/** Formatted notification for Ivy: who, how to reach them, what they asked. */
function enquiryEmail(data, { name, email, message, kind }) {
  const typeLabel = { wedding: "Wedding enquiry", event: "Event enquiry", general: "General enquiry" }[kind];
  const date = formatDate(clean(data.date, MAX.other));
  const page = clean(data.page, 100);
  const pageName = PAGE_NAMES[page] || (page ? page : "Website");
  const received = new Date().toLocaleString("en-NZ", {
    timeZone: "Pacific/Auckland",
    dateStyle: "medium",
    timeStyle: "short",
  });
  const firstName = name.split(" ")[0] || "them";

  const phone = clean(data.phone, MAX.other);
  const details = [];
  const add = (label, value) => {
    const v = clean(value, MAX.other);
    if (v) details.push([label, v]);
  };
  if (kind === "wedding") {
    add("Wedding date", data.date && formatDate(String(data.date)));
    add("Venue", data.venue);
    add("Budget", data.budget);
    add("Guests", data.guests);
    add("Found us via", data.found_us);
    add("Inspiration", data.inspo);
  } else if (kind === "event") {
    add("Company", data.company);
    add("Event date", data.date && formatDate(String(data.date)));
    add("Venue", data.venue);
    add("Event type", data.event_type);
    add("Budget", data.budget);
    add("Inspiration", data.inspo);
  }

  const requirements = (Array.isArray(data.requirements)
    ? data.requirements
    : String(data.requirements ?? "").split(/,\s*/)
  )
    .map((r) => clean(r, 100))
    .filter(Boolean)
    .slice(0, 30);

  const messageLabel = kind === "wedding" ? "Additional comments" : "Their message";
  const blocks = message ? [[messageLabel, message]] : [];
  const comments = cleanBlock(data.comments, MAX.message);
  if (comments) blocks.push(["Additional comments", comments]);

  const subject = `${typeLabel}: ${name || email}${date ? ` · ${date}` : ""}`.replace(/[\r\n]/g, " ");

  // ---- plain text ----
  const text = [
    `NEW ${typeLabel.toUpperCase()} · via the ${pageName}`,
    "",
    `Name:   ${name || "(not given)"}`,
    `Email:  ${email}`,
    ...(phone ? [`Phone:  ${phone}`] : []),
    "",
    ...details.map(([l, v]) => `${l}: ${v}`),
    ...(requirements.length
      ? ["", "Floral requirements:", ...requirements.map((r) => `  - ${r}`)]
      : []),
    ...blocks.flatMap(([l, v]) => ["", `${l}:`, v]),
    "",
    "----",
    `Reply to this email to respond to ${firstName} directly (${email}).`,
    `Received ${received} (NZ time) via willowandpeony.co.nz${page ? page : ""}`,
  ].join("\n");

  // ---- HTML ----
  const e = escapeHtml;
  const label = (t) =>
    `<p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#8a847b">${t}</p>`;
  const row = (l, v) =>
    `<tr><td style="padding:10px 16px 10px 0;border-top:1px solid #e6e2da;font-family:Arial,sans-serif;font-size:13px;color:#8a847b;white-space:nowrap;vertical-align:top;width:120px">${e(l)}</td><td style="padding:10px 0;border-top:1px solid #e6e2da;font-family:Arial,sans-serif;font-size:14px;color:#1a1815">${v}</td></tr>`;
  const contactRows = [
    row("Name", `<strong style="font-weight:bold">${e(name || "(not given)")}</strong>`),
    row("Email", `<a href="mailto:${e(email)}" style="color:#1a1815">${e(email)}</a>`),
    phone ? row("Phone", `<a href="tel:${e(phone.replace(/[^+\d]/g, ""))}" style="color:#1a1815">${e(phone)}</a>`) : "",
  ].join("");
  const isUrl = (v) => /^https?:\/\/\S+$/i.test(v);
  const rows = details
    .map(([l, v]) =>
      row(l, l === "Inspiration" && isUrl(v) ? `<a href="${e(v)}" style="color:#1a1815;word-break:break-all">${e(v)}</a>` : e(v)),
    )
    .join("");
  const detailsLabel = kind === "wedding" ? "Wedding details" : kind === "event" ? "Event details" : "Details";
  const reqHtml = requirements.length
    ? `<tr><td style="padding:22px 32px 0">${label(`Floral requirements (${requirements.length})`)}<p style="margin:0;font-family:Arial,sans-serif;font-size:14px;line-height:1.9;color:#1a1815">${requirements.map((r) => `&#10003;&nbsp;${e(r)}`).join("<br>")}</p></td></tr>`
    : "";
  const blockHtml = blocks
    .map(
      ([l, v]) =>
        `<tr><td style="padding:22px 32px 0">${label(e(l))}<div style="background:#f7f5f0;border-left:3px solid #1a1815;padding:14px 16px;font-family:Arial,sans-serif;font-size:14px;line-height:1.65;color:#1a1815;white-space:pre-wrap">${e(v)}</div></td></tr>`,
    )
    .join("");
  const replySubject = encodeURIComponent(
    kind === "wedding" ? "Your wedding flowers" : kind === "event" ? "Flowers for your event" : "Your enquiry",
  );

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(subject)}</title></head>
<body style="margin:0;padding:0;background:#f7f5f0">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #e6e2da">
<tr><td style="padding:26px 32px 0">
${label(`Via the ${e(pageName.toLowerCase())}`)}
<h1 style="margin:4px 0 0;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:26px;line-height:1.25;color:#1a1815">New ${e(typeLabel.toLowerCase())}</h1>
</td></tr>
<tr><td style="padding:22px 32px 0">${label("Contact")}<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${contactRows}</table>
<p style="margin:18px 0 0"><a href="mailto:${e(email)}?subject=${replySubject}" style="display:inline-block;background:#1a1815;color:#ffffff;text-decoration:none;font-family:Arial,sans-serif;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;padding:12px 20px">Reply to ${e(firstName)}</a></p>
</td></tr>
${rows ? `<tr><td style="padding:26px 32px 0">${label(detailsLabel)}<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table></td></tr>` : ""}
${reqHtml}
${blockHtml}
<tr><td style="padding:26px 32px 26px"><p style="margin:0;padding-top:16px;border-top:1px solid #e6e2da;font-family:Arial,sans-serif;font-size:12px;line-height:1.7;color:#8a847b">Hitting reply sends your answer straight to ${e(firstName)} at ${e(email)}.<br>Received ${e(received)} (NZ time) via the ${e(pageName.toLowerCase())}.</p></td></tr>
</table></td></tr></table>
</body></html>`;

  return { subject, text, html };
}

/* ---------- Wedding Flower Calendar ---------- */

function calendarEmail({ firstName, consult, origin }) {
  const hi = firstName ? `Hi ${escapeHtml(firstName)},` : "Hello,";
  const pdfUrl = `${origin}${CALENDAR_PDF}`;
  const consultLine = consult
    ? "You asked about a free consultation, so I’ll be in touch personally within a couple of business days."
    : "When you’re ready to talk flowers, simply reply to this email. I’d love to hear your date, your venue and the feeling you want to create.";

  const text = [
    firstName ? `Hi ${firstName},` : "Hello,",
    "",
    "Thank you for requesting the Willow & Peony Wedding Flower Calendar. You can download it any time here:",
    pdfUrl,
    "",
    "Start with your wedding month: you’ll find twelve flowers at their best in that season, followed by the flowers available all year round and a few of my personal favourites.",
    "",
    consultLine,
    "",
    "With love,",
    "Ivy",
    "Willow & Peony · Auckland",
    `${origin}/`,
  ].join("\n");

  const p = (body) =>
    `<p style="margin:0 0 18px;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.7;color:#57524b">${body}</p>`;
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Your Wedding Flower Calendar</title></head>
<body style="margin:0;padding:0;background:#f7f5f0">
<div style="display:none;max-height:0;overflow:hidden">A year of New Zealand wedding flowers, month by month.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e6e2da">
<tr><td align="center" style="padding:36px 32px 8px"><img src="${origin}/brand/willow-and-peony-logo.png" width="200" alt="Willow &amp; Peony" style="display:block;width:200px;height:auto;border:0"></td></tr>
<tr><td style="padding:28px 40px 0">
<p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8a847b">Your free calendar</p>
<h1 style="margin:0 0 24px;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:30px;line-height:1.2;color:#1a1815">Your Wedding Flower Calendar is here</h1>
${p(hi)}
${p("Thank you for requesting the Willow &amp; Peony Wedding Flower Calendar. Download it with the button below, and keep this email to download it again any time.")}
</td></tr>
<tr><td align="center" style="padding:8px 40px 28px"><img src="${origin}/email/wedding-flower-calendar-cover.jpg" width="240" alt="The Willow &amp; Peony Wedding Flower Calendar" style="display:block;width:240px;height:auto;border:1px solid #e6e2da"></td></tr>
<tr><td align="center" style="padding:0 40px 32px"><a href="${pdfUrl}" style="display:inline-block;background:#1a1815;color:#ffffff;text-decoration:none;font-family:Arial,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;padding:16px 30px">Download your calendar</a></td></tr>
<tr><td style="padding:0 40px 8px">
${p("Start with your wedding month: you&rsquo;ll find twelve flowers at their best in that season, followed by the flowers available all year round and a few of my personal favourites.")}
${p(escapeHtml(consultLine))}
${p("With love,<br><span style=\"font-style:italic;color:#1a1815\">Ivy</span>")}
</td></tr>
<tr><td style="padding:20px 40px 32px;border-top:1px solid #e6e2da">
<p style="margin:0;font-family:Arial,sans-serif;font-size:12px;line-height:1.7;color:#8a847b">Willow &amp; Peony · Wedding &amp; event florist, Auckland<br><a href="${origin}/" style="color:#8a847b">willowandpeony.co.nz</a> · <a href="https://www.instagram.com/willowandpeony.nz" style="color:#8a847b">Instagram</a><br>You&rsquo;re receiving this one-off email because you requested the calendar on our website.</p>
</td></tr>
</table></td></tr></table>
</body></html>`;
  return { text, html, pdfUrl };
}

async function handleCalendar(request, env) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: "invalid request" }, 400);
  }
  if (data._gotcha) return json({ ok: true, emailed: true });

  const email = clean(data.email, MAX.email);
  if (!isEmail(email)) return json({ error: "a valid email is required" }, 400);
  if (!(await verifyTurnstile(request, env, data.turnstileToken))) {
    return json({ error: "verification failed" }, 400);
  }

  const firstName = clean(data.firstName, MAX.name);
  const lastName = clean(data.lastName, MAX.name);
  const consult = data.consult === true || data.consult === "on" || data.consult === "true";
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const origin = siteOrigin(request);

  if (!env.RESEND_API_KEY) return json({ ok: true, emailed: false });

  const { text, html } = calendarEmail({ firstName, consult, origin });
  let emailed = false;
  try {
    await sendEmail(env, {
      from: `Ivy at Willow & Peony <${env.EMAIL_FROM}>`,
      // Full name on the To line so Ivy's BCC copy shows who downloaded.
      to: [fullName ? `${fullName.replace(/[<>",]/g, "")} <${email}>` : email],
      bcc: [env.NOTIFY_TO],
      reply_to: env.EMAIL_FROM,
      subject: "Your Wedding Flower Calendar is here",
      text,
      html,
    });
    emailed = true;
  } catch (e) {
    console.log("calendar email failed", e.message);
  }

  return json({ ok: true, emailed });
}

// Live Instagram feed for the home page grid. Requires the INSTAGRAM_TOKEN
// secret (long-lived "Instagram API with Instagram Login" token — see
// CLAUDE.md). Cached at the edge for 6 hours; returns an empty list until
// the token is configured, and the page falls back to its curated tiles.
async function handleInstagram(request, env, ctx) {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "public, max-age=21600",
  };
  if (!env.INSTAGRAM_TOKEN) {
    return new Response(JSON.stringify({ items: [] }), {
      headers: { ...headers, "Cache-Control": "public, max-age=300" },
    });
  }
  const cacheKey = new Request("https://willowandpeony.co.nz/__cache/instagram-feed");
  const cache = caches.default;
  const hit = await cache.match(cacheKey);
  if (hit) return hit;
  try {
    const r = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&limit=18&access_token=${env.INSTAGRAM_TOKEN}`,
    );
    const data = await r.json();
    const items = (data.data || [])
      .map((m) => ({
        id: m.id,
        src: m.media_type === "VIDEO" ? m.thumbnail_url : m.media_url,
        permalink: m.permalink,
        caption: (m.caption || "").slice(0, 300),
      }))
      .filter((m) => m.src)
      .slice(0, 12);
    const res = new Response(JSON.stringify({ items }), { headers });
    ctx.waitUntil(cache.put(cacheKey, res.clone()));
    return res;
  } catch {
    return new Response(JSON.stringify({ items: [] }), {
      headers: { ...headers, "Cache-Control": "public, max-age=600" },
    });
  }
}

/* ---------- Wedding flower calculator ---------- */

function summariseEstimate(sel, origin) {
  const r = compute(sel);
  return {
    r,
    tier: tierSummary(sel),
    from: r.hasFrom ? "from " : "",
    extras: quotedExtras(r),
    link: `${origin}/wedding-flower-calculator/?e=${encodeURIComponent(encodeSelection(sel))}`,
  };
}

/** The estimate as email HTML (two tables) plus a plain-text version. */
function estimateBlocks(est) {
  const e = escapeHtml;
  const r = est.r;
  const cell = "font-family:Arial,sans-serif;color:#1a1815;vertical-align:top";
  const row = (l) =>
    `<tr><td style="padding:9px 12px 9px 0;border-top:1px solid #e6e2da;${cell};font-size:14px">${e(l.name)}<br><span style="font-size:12px;color:#756f66">${e(l.detail)}</span></td><td style="padding:9px 0;border-top:1px solid #e6e2da;${cell};font-size:14px;text-align:right;white-space:nowrap">${e(l.value)}</td></tr>`;
  const head = (t) =>
    `<tr><td colspan="2" style="padding:16px 0 6px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#756f66">${t}</td></tr>`;
  const sum = (k, v, big) =>
    `<tr><td style="padding:5px 12px 5px 0;font-family:Arial,sans-serif;font-size:${big ? 16 : 13}px;color:${big ? "#1a1815" : "#57524b"}">${k}</td><td style="padding:5px 0;text-align:right;font-family:Arial,sans-serif;font-size:${big ? 16 : 13}px;color:#1a1815;white-space:nowrap">${v}</td></tr>`;
  const html = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${head(est.tier ? `Florals · ${e(est.tier)}` : "Florals")}
${r.lines.length ? r.lines.map(row).join("") : `<tr><td colspan="2" style="padding:9px 0;border-top:1px solid #e6e2da;${cell};font-size:14px;color:#756f66">No pieces selected</td></tr>`}
${r.svcLines.length ? head("Delivery &amp; services") + r.svcLines.map(row).join("") : ""}
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px;border-top:1px solid #1a1815">
<tr><td colspan="2" style="height:8px"></td></tr>
${sum("Florals total", r.florals ? "from " + money(r.florals) : "—")}
${sum("Delivery &amp; services total", r.services ? est.from + money(r.services) : "—")}
${sum("<strong>Estimated total</strong> · excl. GST", `<strong>${est.from}${money(r.total)}</strong>`, true)}
${sum("Including 15% GST", est.from + money(r.total * (1 + GST)))}
</table>
${est.extras ? `<p style="margin:8px 0 0;font-family:Arial,sans-serif;font-size:12px;color:#756f66">${e(est.extras)}</p>` : ""}`;
  const text = [
    ...(est.tier ? [`Florals: ${est.tier}`, ""] : []),
    ...(r.lines.length ? r.lines.map((l) => `- ${l.name} (${l.detail}): ${l.value}`) : ["No pieces selected"]),
    ...(r.svcLines.length ? ["", "Delivery & services:", ...r.svcLines.map((l) => `- ${l.name}: ${l.value}`)] : []),
    "",
    `Florals total: ${r.florals ? "from " + money(r.florals) : "-"}`,
    `Delivery & services total: ${r.services ? est.from + money(r.services) : "-"}`,
    `Estimated total (excl. GST): ${est.from}${money(r.total)}${est.extras ? " " + est.extras : ""}`,
    `Including 15% GST: ${est.from}${money(r.total * (1 + GST))}`,
  ].join("\n");
  return { html, text };
}

const ESTIMATE_FINE_PRINT = [
  "All prices are in NZD and exclude GST. Your final quote is confirmed after a consultation.",
  `Full-service wedding design starts from ${money(FULL_SERVICE_FROM)}. Vase and plinth hire is included.`,
  "All prices are starting prices. Travel beyond Auckland is quoted by venue.",
  "Photos show past work as a guide. Every design is made to order around the season’s best blooms.",
];

/** The couple's copy: their estimate, a link to reopen it, and Ivy's sign-off. */
function estimateEmail(est, origin) {
  const e = escapeHtml;
  const blocks = estimateBlocks(est);
  const subject = "Your Willow & Peony wedding flower estimate";
  const p = (body) =>
    `<p style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.7;color:#57524b">${body}</p>`;
  const next =
    "When it feels right, reply to this email or send it to me from the calculator, and I’ll shape it into a personal proposal. Every enquiring couple is offered a complimentary 30-minute video chat, with no obligation.";
  const text = [
    "Hello,",
    "",
    "Thank you for building your wedding flower estimate. Here’s a copy to keep, or to share with your partner.",
    "",
    blocks.text,
    "",
    `Open and adjust your estimate: ${est.link}`,
    "",
    next,
    `Book your consultation: ${site.consultationUrl}`,
    "",
    ...ESTIMATE_FINE_PRINT.map((l) => `* ${l}`),
    "",
    "With love,",
    "Ivy",
    "Willow & Peony · Auckland",
    `${origin}/`,
  ].join("\n");
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(subject)}</title></head>
<body style="margin:0;padding:0;background:#f7f5f0">
<div style="display:none;max-height:0;overflow:hidden">${e(`${est.from}${money(est.r.total)} excl. GST${est.tier ? ` · ${est.tier}` : ""}`)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #e6e2da">
<tr><td align="center" style="padding:36px 32px 8px"><img src="${origin}/brand/willow-and-peony-logo.png" width="200" alt="Willow &amp; Peony" style="display:block;width:200px;height:auto;border:0"></td></tr>
<tr><td style="padding:28px 40px 0">
<p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#756f66">Your floral estimate</p>
<h1 style="margin:0 0 22px;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:28px;line-height:1.25;color:#1a1815">Here&rsquo;s your wedding flower estimate</h1>
${p("Thank you for building your estimate with us. Here&rsquo;s a copy to keep, or to share with your partner.")}
${blocks.html}
</td></tr>
<tr><td align="center" style="padding:30px 40px 30px"><a href="${e(est.link)}" style="display:inline-block;background:#1a1815;color:#ffffff;text-decoration:none;font-family:Arial,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;padding:16px 28px">Open and adjust your estimate</a></td></tr>
<tr><td style="padding:0 40px 4px">
${p(`${e(next)} <a href="${e(site.consultationUrl)}" style="color:#1a1815">Book your consultation</a>.`)}
<ul style="margin:0 0 22px;padding-left:18px;font-family:Arial,sans-serif;font-size:12px;line-height:1.7;color:#756f66">${ESTIMATE_FINE_PRINT.map((l) => `<li>${e(l)}</li>`).join("")}</ul>
${p('With love,<br><span style="font-style:italic;color:#1a1815">Ivy</span>')}
</td></tr>
<tr><td style="padding:20px 40px 32px;border-top:1px solid #e6e2da">
<p style="margin:0;font-family:Arial,sans-serif;font-size:12px;line-height:1.7;color:#756f66">Willow &amp; Peony · Wedding &amp; event florist, Auckland<br><a href="${origin}/" style="color:#756f66">willowandpeony.co.nz</a> · <a href="https://www.instagram.com/willowandpeony.nz" style="color:#756f66">Instagram</a><br>You&rsquo;re receiving this one-off email because you requested your estimate on our website.</p>
</td></tr>
</table></td></tr></table>
</body></html>`;
  return { subject, text, html };
}

/** The couple's confirmation after a calculator enquiry: it's with Ivy, plus the booking link and their estimate. */
function enquiryConfirmEmail(est, origin, names) {
  const e = escapeHtml;
  const blocks = est ? estimateBlocks(est) : null;
  const subject = "Thank you, your enquiry is with Ivy";
  const who = names.length <= 40 ? names : "";
  const p = (body) =>
    `<p style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.7;color:#57524b">${body}</p>`;
  const intro = "Your details and floral estimate are with me, and I’ll be in touch personally within 1–2 business days.";
  const book =
    "If you haven’t booked already, choose a time for your complimentary 30-minute video chat. There’s no obligation, and it’s the easiest way to talk through your ideas together.";
  const text = [
    `Hello${who ? ` ${who}` : ""},`,
    "",
    `Thank you for your enquiry. ${intro}`,
    "",
    book,
    `Book your consultation: ${site.consultationUrl}`,
    ...(blocks ? ["", "YOUR ESTIMATE", blocks.text, "", `Open your estimate: ${est.link}`] : []),
    "",
    ...ESTIMATE_FINE_PRINT.map((l) => `* ${l}`),
    "",
    "With love,",
    "Ivy",
    "Willow & Peony · Auckland",
    `${origin}/`,
  ].join("\n");
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(subject)}</title></head>
<body style="margin:0;padding:0;background:#f7f5f0">
<div style="display:none;max-height:0;overflow:hidden">${e("Book your complimentary consultation with Ivy")}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #e6e2da">
<tr><td align="center" style="padding:36px 32px 8px"><img src="${origin}/brand/willow-and-peony-logo.png" width="200" alt="Willow &amp; Peony" style="display:block;width:200px;height:auto;border:0"></td></tr>
<tr><td style="padding:28px 40px 0">
<p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#756f66">Enquiry received</p>
<h1 style="margin:0 0 22px;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:28px;line-height:1.25;color:#1a1815">Thank you${who ? `, ${e(who)}` : ""}</h1>
${p(e(intro))}
${p(e(book))}
</td></tr>
<tr><td align="center" style="padding:10px 40px 30px"><a href="${e(site.consultationUrl)}" style="display:inline-block;background:#1a1815;color:#ffffff;text-decoration:none;font-family:Arial,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;padding:16px 28px">Book your consultation</a></td></tr>
${
  blocks
    ? `<tr><td style="padding:0 40px 0">
<p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#756f66">Your estimate</p>
${blocks.html}
<p style="margin:16px 0 0;font-family:Arial,sans-serif;font-size:13px"><a href="${e(est.link)}" style="color:#1a1815">Open and adjust your estimate</a></p>
</td></tr>`
    : ""
}
<tr><td style="padding:26px 40px 4px">
<ul style="margin:0 0 22px;padding-left:18px;font-family:Arial,sans-serif;font-size:12px;line-height:1.7;color:#756f66">${ESTIMATE_FINE_PRINT.map((l) => `<li>${e(l)}</li>`).join("")}</ul>
${p('With love,<br><span style="font-style:italic;color:#1a1815">Ivy</span>')}
</td></tr>
<tr><td style="padding:20px 40px 32px;border-top:1px solid #e6e2da">
<p style="margin:0;font-family:Arial,sans-serif;font-size:12px;line-height:1.7;color:#756f66">Willow &amp; Peony · Wedding &amp; event florist, Auckland<br><a href="${origin}/" style="color:#756f66">willowandpeony.co.nz</a> · <a href="https://www.instagram.com/willowandpeony.nz" style="color:#756f66">Instagram</a><br>You&rsquo;re receiving this one-off email because you sent an enquiry on our website.</p>
</td></tr>
</table></td></tr></table>
</body></html>`;
  return { subject, text, html };
}

/** Ivy's copy of a calculator enquiry: labelled contact details, the estimate, reply-to the couple. */
function estimateEnquiryEmail(data, { names, email }, est) {
  const e = escapeHtml;
  const phone = clean(data.phone, MAX.other);
  const date = formatDate(clean(data.date, MAX.other));
  const venue = clean(data.venue, MAX.other);
  const inspoRaw = clean(data.inspo, 500);
  const inspo = /^https?:\/\/\S+$/i.test(inspoRaw) ? inspoRaw : "";
  const notes = cleanBlock(data.notes, MAX.message);
  const who = names.length <= 32 ? names : names.split(" ")[0];
  const received = new Date().toLocaleString("en-NZ", { timeZone: "Pacific/Auckland", dateStyle: "medium", timeStyle: "short" });
  const blocks = est ? estimateBlocks(est) : null;
  const total = est && est.r.total ? ` · ${est.from}${money(est.r.total)}` : "";
  const subject = `Calculator enquiry: ${names}${date ? ` · ${date}` : ""}${total}`.replace(/[\r\n]/g, " ");

  const label = (t) =>
    `<p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#756f66">${t}</p>`;
  const row = (l, v) =>
    `<tr><td style="padding:10px 16px 10px 0;border-top:1px solid #e6e2da;font-family:Arial,sans-serif;font-size:13px;color:#756f66;white-space:nowrap;vertical-align:top;width:120px">${e(l)}</td><td style="padding:10px 0;border-top:1px solid #e6e2da;font-family:Arial,sans-serif;font-size:14px;color:#1a1815">${v}</td></tr>`;
  const contact = [
    row("Names", `<strong>${e(names)}</strong>`),
    row("Email", `<a href="mailto:${e(email)}" style="color:#1a1815">${e(email)}</a>`),
    phone ? row("Phone", `<a href="tel:${e(phone.replace(/[^+\d]/g, ""))}" style="color:#1a1815">${e(phone)}</a>`) : "",
  ].join("");
  const details = [
    date && row("Wedding date", e(date)),
    venue && row("Venue", e(venue)),
    inspo && row("Inspiration", `<a href="${e(inspo)}" style="color:#1a1815;word-break:break-all">${e(inspo)}</a>`),
  ]
    .filter(Boolean)
    .join("");

  const text = [
    "NEW CALCULATOR ENQUIRY · via the wedding flower calculator",
    "",
    `Names:  ${names}`,
    `Email:  ${email}`,
    ...(phone ? [`Phone:  ${phone}`] : []),
    ...(date ? [`Wedding date: ${date}`] : []),
    ...(venue ? [`Venue: ${venue}`] : []),
    ...(inspo ? [`Inspiration: ${inspo}`] : []),
    "",
    "THEIR ESTIMATE",
    blocks ? blocks.text : "No pieces selected",
    ...(est ? ["", `Open this estimate: ${est.link}`] : []),
    ...(notes ? ["", "Their notes:", notes] : []),
    "",
    "----",
    `Reply to this email to respond to ${who} directly (${email}).`,
    `Received ${received} (NZ time).`,
  ].join("\n");

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(subject)}</title></head>
<body style="margin:0;padding:0;background:#f7f5f0">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #e6e2da">
<tr><td style="padding:26px 32px 0">
${label("Via the wedding flower calculator")}
<h1 style="margin:4px 0 0;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:26px;line-height:1.25;color:#1a1815">New calculator enquiry</h1>
</td></tr>
<tr><td style="padding:22px 32px 0">${label("Contact")}<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${contact}</table>
<p style="margin:18px 0 0"><a href="mailto:${e(email)}?subject=${encodeURIComponent("Your wedding flowers")}" style="display:inline-block;background:#1a1815;color:#ffffff;text-decoration:none;font-family:Arial,sans-serif;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;padding:12px 20px">Reply to ${e(who)}</a></p>
</td></tr>
${details ? `<tr><td style="padding:26px 32px 0">${label("Wedding details")}<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${details}</table></td></tr>` : ""}
<tr><td style="padding:26px 32px 0">${label("Their estimate")}${blocks ? blocks.html : `<p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#756f66">No pieces selected.</p>`}
${est ? `<p style="margin:14px 0 0;font-family:Arial,sans-serif;font-size:13px"><a href="${e(est.link)}" style="color:#1a1815">Open this estimate in the calculator</a></p>` : ""}</td></tr>
${notes ? `<tr><td style="padding:22px 32px 0">${label("Their notes")}<div style="background:#f7f5f0;border-left:3px solid #1a1815;padding:14px 16px;font-family:Arial,sans-serif;font-size:14px;line-height:1.65;color:#1a1815;white-space:pre-wrap">${e(notes)}</div></td></tr>` : ""}
<tr><td style="padding:26px 32px 26px"><p style="margin:0;padding-top:16px;border-top:1px solid #e6e2da;font-family:Arial,sans-serif;font-size:12px;line-height:1.7;color:#756f66">Hitting reply sends your answer straight to ${e(who)} at ${e(email)}.<br>Received ${e(received)} (NZ time) via the wedding flower calculator.</p></td></tr>
</table></td></tr></table>
</body></html>`;
  return { subject, text, html };
}

async function handleEstimate(request, env) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: "invalid request" }, 400);
  }
  if (data._gotcha) return json({ ok: true });
  const action = data.action === "email" || data.action === "enquire" ? data.action : null;
  if (!action) return json({ error: "unknown action" }, 400);
  const email = clean(data.email, MAX.email);
  if (!isEmail(email)) return json({ error: "a valid email is required" }, 400);
  const names = clean(data.names, MAX.name);
  if (action === "enquire" && !names) return json({ error: "names are required" }, 400);
  // Only catalogue pieces can appear in the email: the selection is a code
  // that is decoded and priced here, so the form can't relay arbitrary text.
  const sel = decodeSelection(clean(data.estimate, 2000));
  if (action === "email" && !sel) return json({ error: "empty estimate" }, 400);
  if (!(await verifyTurnstile(request, env, data.turnstileToken))) {
    return json({ error: "verification failed" }, 400);
  }
  if (!env.RESEND_API_KEY) return json({ error: "email not configured yet" }, 503);

  const origin = siteOrigin(request);
  const est = sel ? summariseEstimate(sel, origin) : null;
  try {
    if (action === "email") {
      const { subject, text, html } = estimateEmail(est, origin);
      await sendEmail(env, {
        from: `Ivy at Willow & Peony <${env.EMAIL_FROM}>`,
        to: [email],
        // Ivy sees every estimate that goes out.
        bcc: [env.NOTIFY_TO],
        reply_to: env.EMAIL_FROM,
        subject,
        text,
        html,
      });
    } else {
      const { subject, text, html } = estimateEnquiryEmail(data, { names, email }, est);
      await sendEmail(env, {
        from: `Willow & Peony Website <${env.EMAIL_FROM}>`,
        to: [env.NOTIFY_TO],
        reply_to: `${names.replace(/[<>",]/g, "")} <${email}>`,
        subject,
        text,
        html,
      });
    }
  } catch (e) {
    return json({ error: `send failed: ${e.message}` }, 502);
  }
  if (action === "enquire") {
    // The couple's confirmation with the booking link. Ivy already has the
    // enquiry, so a failure here is logged rather than reported as a failed send.
    try {
      const { subject, text, html } = enquiryConfirmEmail(est, origin, names);
      await sendEmail(env, {
        from: `Ivy at Willow & Peony <${env.EMAIL_FROM}>`,
        to: [email],
        reply_to: env.EMAIL_FROM,
        subject,
        text,
        html,
      });
    } catch (e) {
      console.error("enquiry confirmation failed", e.message);
    }
  }
  return json({ ok: true });
}

const worker = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    // One canonical host: www (attached as a custom domain) 301s to the apex.
    if (url.hostname === "www.willowandpeony.co.nz") {
      url.hostname = "willowandpeony.co.nz";
      return Response.redirect(url.toString(), 301);
    }
    if (url.pathname === "/api/enquiry") {
      if (request.method === "POST") return handleEnquiry(request, env);
      return new Response("Method not allowed", { status: 405 });
    }
    if (url.pathname === "/api/calendar") {
      if (request.method === "POST") return handleCalendar(request, env);
      return new Response("Method not allowed", { status: 405 });
    }
    if (url.pathname === "/api/estimate") {
      if (request.method === "POST") return handleEstimate(request, env);
      return new Response("Method not allowed", { status: 405 });
    }
    if (url.pathname === "/api/instagram") {
      if (request.method === "GET") return handleInstagram(request, env, ctx);
      return new Response("Method not allowed", { status: 405 });
    }
    if (url.pathname.includes("$")) url.pathname = url.pathname.replaceAll("$", "%24");
    const res = await env.ASSETS.fetch(new Request(url, request));
    // Preview hosts must never be indexed (the custom domain is the only
    // canonical host). Belt-and-braces alongside _headers.
    if (
      url.hostname.endsWith(".workers.dev") ||
      url.hostname === "staging.willowandpeony.co.nz" ||
      url.hostname.endsWith(".staging.willowandpeony.co.nz")
    ) {
      const marked = new Response(res.body, res);
      marked.headers.set("X-Robots-Tag", "noindex, nofollow");
      return marked;
    }
    return res;
  },
};

export default worker;
