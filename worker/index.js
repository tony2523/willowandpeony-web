// The site's only server code, running on Cloudflare Workers:
//
//  1. POST /api/enquiry  — enquiry forms, emailed to the studio.
//  2. POST /api/calendar — Wedding Flower Calendar signups: emails the
//     download link to the visitor, with Ivy (hello@) BCC'd on every one so
//     she can see who downloaded.
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
  const message = String(data.message ?? "").trim().slice(0, MAX.message);
  if (!isEmail(email) || !message) {
    return json({ error: "email and message are required" }, 400);
  }
  if (!(await verifyTurnstile(request, env, data.turnstileToken))) {
    return json({ error: "verification failed" }, 400);
  }
  if (!env.RESEND_API_KEY) return json({ error: "email not configured yet" }, 503);

  const name = clean(data.name, MAX.name);
  const kind = clean(data.kind, 20) || "general";
  const subjectBits = {
    wedding: "Wedding enquiry",
    event: "Event enquiry",
    general: "Website enquiry",
  };
  const subject = `${subjectBits[kind] ?? subjectBits.general}${name ? ` — ${name}` : ""}`;

  const lines = [
    name && `Name: ${name}`,
    data.company && `Company: ${clean(data.company, MAX.other)}`,
    `Email: ${email}`,
    data.phone && `Phone: ${clean(data.phone, MAX.other)}`,
    data.date && `Date: ${clean(data.date, MAX.other)}`,
    data.venue && `Venue: ${clean(data.venue, MAX.other)}`,
    data.event_type && `Event type: ${clean(data.event_type, MAX.other)}`,
    data.guests && `Guests: ${clean(data.guests, MAX.other)}`,
    data.budget && `Budget: ${clean(data.budget, MAX.other)}`,
    data.requirements && `Floral requirements: ${clean(data.requirements, MAX.message)}`,
    data.found_us && `Found us via: ${clean(data.found_us, MAX.other)}`,
    "",
    "Message:",
    message,
    data.comments && "",
    data.comments && `Additional comments: ${clean(data.comments, MAX.message)}`,
  ].filter((l) => l !== undefined && l !== null && l !== false);

  try {
    await sendEmail(env, {
      from: `Willow & Peony Website <${env.ENQUIRY_FROM}>`,
      to: [env.ENQUIRY_TO],
      reply_to: name ? `${name.replace(/[<>"]/g, "")} <${email}>` : email,
      subject,
      text: lines.join("\n"),
    });
  } catch (e) {
    return json({ error: `send failed: ${e.message}` }, 502);
  }
  return json({ ok: true });
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
      from: `Ivy at Willow & Peony <${env.CALENDAR_FROM}>`,
      // Full name on the To line so Ivy's BCC copy shows who downloaded.
      to: [fullName ? `${fullName.replace(/[<>",]/g, "")} <${email}>` : email],
      bcc: [env.ENQUIRY_TO],
      reply_to: env.ENQUIRY_TO,
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
