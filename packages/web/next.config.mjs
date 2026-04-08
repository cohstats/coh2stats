/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for Node.js deployment
  output: "standalone",

  // Ant Design and Nivo compatibility
  transpilePackages: [
    "antd",
    "@ant-design",
    "@nivo/bar",
    "@nivo/pie",
    "@nivo/geo",
    "@nivo/heatmap",
    "@nivo/core",
  ],

  // Image optimization
  images: {
    unoptimized: false,
  },

  // Disable link prefetching
  experimental: {
    prefetching: false,
  },
};

export default nextConfig;
