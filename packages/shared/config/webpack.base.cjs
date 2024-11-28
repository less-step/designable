/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
	mode: 'development',
	devtool: 'inline-source-map', // 嵌入到源文件中
	stats: {
		entrypoints: false,
		children: false,
	},
	entry: {
		playground: path.resolve(__dirname, '../main'),
	},
	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: '[name].[hash].bundle.js',
	},
	resolve: {
		modules: ['node_modules'],
		extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: [
					{
						loader: require.resolve('ts-loader'),
						options: {
							transpileOnly: true,
						},
					},
				],
			},
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, require.resolve('css-loader')],
			},
			{
				test: /\.less$/,
				use: [
					MiniCssExtractPlugin.loader,
					{ loader: 'css-loader' },
					{
						loader: 'less-loader',
						options: {
							// modifyVars: getThemeVariables({
							//   dark: true // 开启暗黑模式
							// }),
							lessOptions: {
								javascriptEnabled: true, // 正确
							},
						},
					},
				],
			},
			{
				test: /\.html?$/,
				loader: require.resolve('file-loader'),
				options: {
					name: '[name].[ext]',
				},
			},
		],
	},
}
