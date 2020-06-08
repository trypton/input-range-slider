const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    'no-deps': './src/index.js',
    lit: './src/lit/index.js',
  },
  devtool: 'source-map',
  devServer: {
    contentBase: './build',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      chunks: ['no-deps'],
      template: 'public/index.html',
    }),
    new HtmlWebpackPlugin({
      chunks: ['lit'],
      filename: 'lit.html',
      template: 'public/index.html',
    }),
  ],
  output: {
    filename: 'input-slider-[name].js',
    path: path.resolve(__dirname, 'build'),
  },
};
