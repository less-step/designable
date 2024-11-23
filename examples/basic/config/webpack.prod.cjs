const baseConfig = require('./webpack.base.cjs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

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
