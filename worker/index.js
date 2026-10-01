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
//  4. Next.js navigation data files (`__next.journal.$d$slug...`): static
//     assets answer a literal "$" with a 307 to "%24" which Safari rejects,
//     so we fetch the encoded path directly.
//
// Email goes out through Resend (resend.com, free tier) and needs the
// RESEND_API_KEY secret, with willowandpeony.co.nz verified in Resend.
// Without it the enquiry endpoint answers 503 (the form falls back to a
// pre-filled mail draft) and the calendar endpoint answers emailed:false
// (the visitor still downloads it on the next page), so nothing is lost.

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
  if (!isEmail(email) || !message) {
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
  const date = clean(data.date, MAX.other);
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
    add("Wedding date", data.date);
    add("Venue", data.venue);
    add("Budget", data.budget);
    add("Guests", data.guests);
    add("Found us via", data.found_us);
  } else if (kind === "event") {
    add("Company", data.company);
    add("Event date", data.date);
    add("Event type", data.event_type);
    add("Budget", data.budget);
  }

  const requirements = (Array.isArray(data.requirements)
    ? data.requirements
    : String(data.requirements ?? "").split(/,\s*/)
  )
    .map((r) => clean(r, 100))
    .filter(Boolean)
    .slice(0, 30);

  const messageLabel = kind === "wedding" ? "Additional comments" : "Their message";
  const blocks = [[messageLabel, message]];
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
  const rows = details.map(([l, v]) => row(l, e(v))).join("");
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
