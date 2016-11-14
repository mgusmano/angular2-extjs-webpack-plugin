var path = require("path");
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');
const ExtJSAngular2WebpackPlugin = require('../plugin/extjs-angular2-webpack-plugin');

module.exports = webpackMerge(commonConfig, {
	devtool: 'cheap-module-eval-source-map',

	output: {
		path: helpers.root('dist'),
		publicPath: 'http://localhost:8080',
		filename: '[name].js',
		chunkFilename: '[id].chunk.js'
	},

	plugins: [
		new ExtractTextPlugin('[name].css'),
		new ExtJSAngular2WebpackPlugin({
			indexHtmlLocation: 'src',
			indexHtmlTitle: 'Angular2 Webpack',
			rootSelector: 'my-app',
			build: 'testing',	// testing, production
			extThemeAppPath: '.',
			extThemeAppName: 'Theme',
			extFrameworkPath2: '~/desktop/sencha/ext-6.2.0',
			extFrameworkPath: '~/Downloads/ext-6.2.0',
			debug: false
		})
	],

	devServer: {
		historyApiFallback: true,
		stats: 'minimal'
	}
});
