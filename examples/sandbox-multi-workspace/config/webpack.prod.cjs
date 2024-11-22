/* eslint-disable @typescript-eslint/no-var-requires */
const baseConfig = require('./webpack.base.cjs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
//import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const createPages = (pages) => {
  return pages.map(({ filename, template, chunk }) => {
    return new HtmlWebpackPlugin({
      filename,
      template,
      inject: 'body',
      chunks: chunk,
    })
  })
}

module.exports = {
  ...baseConfig,
  mode: 'production',
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css',
    }),
    ...createPages([
      {
        filename: 'index.html',
        template: path.resolve(__dirname, './template.ejs'),
        chunk: ['playground'],
      },
    ]),
  ],
  optimization: {
    minimize: true,
  },
}
