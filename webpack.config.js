const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    app: './src/index.js',
  },
  devtool: 'source-map',
  devServer: {
    contentBase: './build',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
    }),
  ],
  output: {
    filename: 'input-slider.js',
    path: path.resolve(__dirname, 'build'),
  },
};
