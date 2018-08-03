const path = require('path');
const pkg = require('./package.json');
const webpack = require('webpack');

const resolve = function(dir) {
	return path.join(__dirname, dir);
};

const CleanWebpackPlugin = require('clean-webpack-plugin');

const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = {

	entry: {
		webmetry: './index.js'
	},

	output: {
		path: resolve('dist'),
		filename: '[name].min.js'
	},

	module: {
		rules: [

			{
				test: /\.(js|vue)$/,
				use: 'eslint-loader',
				enforce: 'pre'
			},

			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			},

			{
				test: /\.scss$/,
				use: [
					{ loader: 'css-loader', options: { sourceMap: true } },
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: true,
							ident: 'postcss',
							plugins: () => [
								autoprefixer(),
								cssnano()
							]
						}
					},
					{ loader: 'sass-loader', options: { sourceMap: true } }
				]
			},

			{
				test: /\.html$/,
				exclude: /node_modules/,
				use: {
					loader: 'html-loader',
					options: {
						attrs: [':src', ':data-src', 'object:data']
					}
				}
			}

		]
	},

	plugins: [
		new CleanWebpackPlugin([ resolve('dist') ]),
		new webpack.BannerPlugin({
			banner: `[name]@${pkg.version}\nhash:[hash]`
		})
	],

	resolve: {
		extensions: [ '.js', '.jsx', '.json', '.scss' ],
		alias: {
			'src': resolve('src')
		}
	}

};
