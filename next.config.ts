import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  images: {
    // Remote patterns replace the deprecated `domains` key.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "pub-83c5db439b40468498f97946200806f7.r2.dev" },
      { protocol: "https", hostname: "cdn.magicui.design" },
      { protocol: "https", hostname: "cdn.llm.report" },
    ],
  },
};

export default nextConfig;
