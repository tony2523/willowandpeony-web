import type { NextConfig } from "next";

// When deploying to <user>.github.io/<repo> (before the custom domain is live),
// set PAGES_BASE_PATH=/willowandpeony-web in the workflow. For the production
// custom domain build, leave it empty.
const basePath = process.env.PAGES_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  ...(basePath ? { basePath } : {}),
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    // Preview deploys (basePath set) are marked noindex to avoid duplicate
    // content against the production domain.
    NEXT_PUBLIC_IS_PREVIEW: basePath ? "1" : "",
  },
};

export default nextConfig;
