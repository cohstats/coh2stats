module.exports = [
  // Add support for native node modules
  {
    // We're specifying native_modules in the test because the asset relocator loader generates a
    // "fake" .node file which is really a cjs file.
    test: /native_modules\/.+\.node$/,
    use: 'node-loader',
  },
  {
    test: /\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: '@vercel/webpack-asset-relocator-loader',
      options: {
        outputAssetBase: 'native_modules',
      },
    },
  },
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
      },
    },
  },
  {
    test: /\.(jpg|png|woff|woff2|eot|ttf)$/,
    loader: "url-loader",
    options: {
        name: "[path][name].[ext]",
    },
  },
  {
    test: /\.(svg|ico|icns)$/,
    loader: "file-loader",
    options: {
        name: "[path][name].[ext]",
    },
  }
  /*{
    test: /\.(png|svg|jpg|jpeg|gif|woff|woff2|eot|ttf|otf)$/i,
    type: "assets",
    generator: {
      filename: "assets/[hash][ext]",
    },
    parser: {
      dataUrlCondition: {
        maxSize: 4 * 1024, // 4 KB
      },
    },
  }, */
];
