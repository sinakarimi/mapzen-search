const path = require('path')
const webpack = require('webpack')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const buildPath = path.join(__dirname, './dist')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'mapzen-search.js',
    path: buildPath,
    library: 'mapzenSearch',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      }
    ]
  },
  plugins: [
    // https://github.com/lodash/lodash-webpack-plugin/issues/53
    new LodashModuleReplacementPlugin({
      currying: true,
      flattening: true,
      placeholders: true,
    }),
  ]
};
