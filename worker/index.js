// Runs only for Next.js navigation data files (see run_worker_first in wrangler.jsonc); everything else is
// served straight from static assets without this code.
//
// Next.js names dynamic-route data `__next.journal.$d$slug.__PAGE__.txt`. Workers static assets answers a
// literal "$" in a path with a 307 redirect to "%24". Chrome follows it (one wasted round trip per prefetch);
// Safari rejects the redirected fetch ("access control checks") and logs errors. Asking for the encoded path
// directly returns the file with no redirect.
const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.includes("$")) url.pathname = url.pathname.replaceAll("$", "%24");
    return env.ASSETS.fetch(new Request(url, request));
  },
};

export default worker;
