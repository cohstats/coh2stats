/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for Node.js deployment
  output: "standalone",

  // Ant Design compatibility
  transpilePackages: ["antd", "@ant-design"],

  // Image optimization
  images: {
    unoptimized: false,
  },

  // Webpack configuration
  webpack: (config, { webpack }) => {
    // Ignore old page components during migration
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp:
          /^(react-router|react-router-dom|react-router-dom-v5-compat|connected-react-router|redux|react-redux)$/,
      }),
    );

    return config;
  },
};

export default nextConfig;
