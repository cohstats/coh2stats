/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for Node.js deployment
  output: "standalone",

  // Image optimization
  images: {
    minimumCacheTTL: 86400, // 24 hours
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
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);
