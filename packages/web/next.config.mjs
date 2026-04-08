/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for Node.js deployment
  output: "standalone",

  // Image optimization
  images: {
    minimumCacheTTL: 86400, // 24 hours
    unoptimized: false,
  },
};

export default nextConfig;
