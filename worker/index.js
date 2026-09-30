// The site's only server code, running on Cloudflare Workers:
//
//  1. POST /api/enquiry — receives the enquiry forms and emails them to the
//     studio via Cloudflare Email Routing's free send_email binding
//     (100% Cloudflare, no third-party services). Until the zone is active
//     and the binding works it returns 503 and the frontend falls back to a
//     pre-filled mail draft, so no enquiry is ever lost.
//  2. Next.js navigation data files (`__next.journal.$d$slug...`): static
//     assets answer a literal "$" with a 307 to "%24" which Safari rejects,
//     so we fetch the encoded path directly. Everything else is served
//     straight from static assets (see run_worker_first in wrangler.jsonc).

import { EmailMessage } from "cloudflare:email";

const MAX = { name: 200, email: 254, message: 5000, other: 300 };

function clean(value, cap) {
  return String(value ?? "")
    .replace(/[\r\n]+/g, " ")
    .trim()
    .slice(0, cap);
}

async function handleEnquiry(request, env) {
  const json = (body, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    });

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
  if (!email.includes("@") || !message) {
    return json({ error: "email and message are required" }, 400);
  }

  // Turnstile (optional hardening): enforced once TURNSTILE_SECRET is set.
  if (env.TURNSTILE_SECRET) {
    const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET,
        response: data.turnstileToken ?? "",
        remoteip: request.headers.get("CF-Connecting-IP") ?? undefined,
      }),
    }).then((r) => r.json());
    if (!verify.success) return json({ error: "verification failed" }, 400);
  }

  if (!env.SEND_EMAIL) return json({ error: "email not configured yet" }, 503);

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
    `Email: ${email}`,
    data.phone && `Phone: ${clean(data.phone, MAX.other)}`,
    data.date && `Date: ${clean(data.date, MAX.other)}`,
    data.venue && `Venue: ${clean(data.venue, MAX.other)}`,
    data.guests && `Guests: ${clean(data.guests, MAX.other)}`,
    data.budget && `Budget: ${clean(data.budget, MAX.other)}`,
    data.found_us && `Found us via: ${clean(data.found_us, MAX.other)}`,
    "",
    "Message:",
    message,
  ].filter((l) => l !== undefined && l !== null && l !== false);

  const from = env.ENQUIRY_FROM;
  const to = env.ENQUIRY_TO;
  const raw = [
    `From: Willow & Peony Website <${from}>`,
    `To: <${to}>`,
    `Reply-To: ${name ? `"${name.replace(/"/g, "")}" ` : ""}<${email}>`,
    `Subject: ${subject.replace(/[\r\n]/g, " ")}`,
    `Message-ID: <${Date.now()}.${crypto.randomUUID()}@${from.split("@")[1]}>`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    `Date: ${new Date().toUTCString()}`,
    "",
    lines.join("\r\n"),
  ].join("\r\n");

  try {
    await env.SEND_EMAIL.send(new EmailMessage(from, to, raw));
  } catch (e) {
    return json({ error: `send failed: ${e.message}` }, 502);
  }
  return json({ ok: true });
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
    if (url.pathname === "/api/instagram") {
      if (request.method === "GET") return handleInstagram(request, env, ctx);
      return new Response("Method not allowed", { status: 405 });
    }
    if (url.pathname.includes("$")) url.pathname = url.pathname.replaceAll("$", "%24");
    return env.ASSETS.fetch(new Request(url, request));
  },
};

export default worker;
