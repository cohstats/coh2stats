/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for Node.js deployment
  output: "standalone",

  // Enable React Compiler
  reactCompiler: true,

  // Image optimization
  images: {
    minimumCacheTTL: 86400, // 24 hours
    // Only allowed quality; next/image snaps to the closest one. Keep in sync with src/utils/image-url.ts
    qualities: [85],
    unoptimized: false,
  },

  // Redirects for backward compatibility
  async redirects() {
    return [
      {
        source: "/search/:searchParam",
        destination: "/search?q=:searchParam",
        permanent: true,
      },
    ];
  },

  // Note: I fucking hate Next 15+, this is so fucking stupid
  // that you can't set up headers directly on the page.
  // Custom headers for CDN caching
  async headers() {
    return [
      {
        source: "/players/:steamid*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=60, stale-while-revalidate=180",
          },
        ],
      },
      {
        source: "/live-matches/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=90, stale-while-revalidate=120",
          },
        ],
      },
      {
        source: "/live-matches",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=90, stale-while-revalidate=120",
          },
        ],
      },
    ];
  },
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);
