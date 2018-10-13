const path = require('path');
const pkg = require('../package.json');
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
		path: resolve('../dist'),
		filename: '[name].min.js'
	},

	module: {
		rules: [

			{
				test: /\.jsx?$/,
				use: 'eslint-loader',
				enforce: 'pre'
			},

			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			},

			{
				test: /\.scss$/,
				use: [
					{ loader: 'style-loader' },
					{ loader: 'css-loader' },
					{
						loader: 'postcss-loader',
						options: {
							ident: 'postcss',
							plugins: () => [
								autoprefixer(),
								cssnano()
							]
						}
					},
					{ loader: 'sass-loader' }
				]
			}

		]
	},

	plugins: [
		new CleanWebpackPlugin([ resolve('../dist') ], {
			root: resolve('../')
		}),
		new webpack.BannerPlugin({
			banner: `[name]@${pkg.version}\nhash:[hash]`
		}),
		new webpack.ProvidePlugin({
			dom: resolve('../src/dom.js')
		})
	],

	resolve: {
		extensions: [ '.js', '.jsx', '.json', '.scss' ],
		alias: {
			'src': resolve('../src')
		}
	}

};
