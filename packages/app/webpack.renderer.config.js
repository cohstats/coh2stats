const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

/*rules.push({
  test: /\.(svg|ico|icns)$/,
  loader: "file-loader",
  options: {
      name: "[path][name].[ext]",
  },
});

rules.push({
  test: /\.(jpg|png|woff|woff2|eot|ttf)$/,
  loader: "url-loader",
  options: {
      name: "[path][name].[ext]",
  },
}); */

module.exports = {
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
};
