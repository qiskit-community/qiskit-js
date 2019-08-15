const path = require('path');

module.exports = {
  entry: './src/index.js',
  mode: "development",
  target: 'web',
  node: {
    fs: 'empty'
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        loader: `transform-loader?brfs`,
      },
    ],
  },
};
