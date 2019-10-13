const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

const purgecss = require('@fullhuman/postcss-purgecss')({

	// Specify the paths to all of the template files in your project 
	content: [
		'./src/**/*.html',
		'./src/**/*.svelte',
		// './src/**/*.jsx',
		// etc.
	],

	// Include any special characters you're using in this regular expression
	defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
});
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');


function recursiveIssuer(m) {
	if (m.issuer) {
		return recursiveIssuer(m.issuer);
	} else if (m.name) {
		return m.name;
	} else {
		return false;
	}
}

module.exports = {
	entry: {
		bundle: './src/main.js',
		common: path.resolve(__dirname, 'src/styles/common.scss'),
	},
	resolve: {
		alias: {
			svelte: path.resolve('node_modules', 'svelte')
		},
		extensions: ['.mjs', '.js', '.svelte', '.scss'],
		mainFields: ['svelte', 'browser', 'module', 'main']
	},
	output: {
		path: __dirname + '/public',
		filename: '[name].js',
		chunkFilename: '[name].[id].js'
	},
	module: {
		rules: [
			{
				test: /\.svelte$/,
				use: {
					loader: 'svelte-loader',
					options: {
						emitCss: true,
						hotReload: true,
						preprocess: require('svelte-preprocess')({
							scss: {
								includePaths: ['src'],
							},
							postcss: {
								plugins: [
									require('autoprefixer')
								],
							},
						})
					}
				}
			},
			{
				test: /\.css$/,
				use: [
					/**
					 * MiniCssExtractPlugin doesn't support HMR.
					 * For developing, use 'style-loader' instead.
					 * */
					prod ? MiniCssExtractPlugin.loader : 'style-loader',
					'css-loader',
				]
			},
			{
				test: /\.scss$/,
				use: [
					/**
					 * MiniCssExtractPlugin doesn't support HMR.
					 * For developing, use 'style-loader' instead.
					 * */
					// prod ? MiniCssExtractPlugin.loader : 'style-loader',
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							// only enable hot in development
							hmr: process.env.NODE_ENV === 'development',
							// if hmr does not work, this is a forceful method.
							reloadAll: true,
						},
					},
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							plugins: [
								require('tailwindcss'),
								require('autoprefixer'),
								...(process.env.NODE_ENV === "production" ? [purgecss] : [])
							],
						}
					},
					{
						loader: 'sass-loader',
						options: {
							// Prefer `dart-sass`
							implementation: require('sass'),
							sassOptions: {
								includePaths: [path.resolve(__dirname, "src/styles/common.scss")]
							},
						},
					},
				]
			},
		]
	},
	mode,
	optimization: {
		splitChunks: {
			cacheGroups: {
				commonStyles: {
					name: 'common',
					test: (m, c, entry = 'common') =>
						m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
					chunks: 'all',
					enforce: true,
				},
			},
		},
		minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css',
		})
	],
	devtool: prod ? false : 'source-map'
};
