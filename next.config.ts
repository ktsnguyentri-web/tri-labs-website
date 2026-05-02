import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // ── Current mock data source ──────────────────────────────────────────
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      // ── Sanity CMS CDN ────────────────────────────────────────────────────
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
      // ── Cloudinary ────────────────────────────────────────────────────────
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      // ── Prismic ───────────────────────────────────────────────────────────
      {
        protocol: "https",
        hostname: "**.prismic.io",
        pathname: "/**",
      },
      // ── Contentful ────────────────────────────────────────────────────────
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
