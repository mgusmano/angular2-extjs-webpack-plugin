# Angular2 Ext JS Webpack Plugin

This [Webpack](http://webpack.github.io/) plugin produces a minimized build of the [Sencha Ext JS](https://www.sencha.com/products/extjs) framework containing only those classes used by your Angular2 app.  Use with the angular2-extjs custom renderer for Angular2.

## How it works
The plugin crawls your Angular2 source code looking for selector tags that match Ext JS xtypes as well as calls to Ext.create() and Ext.require() to compile a list of classes used by your app.  It then uses [Sencha Cmd](https://www.sencha.com/products/extjs/cmd-download/) to produce an optimized build of Ext JS containing only those classes and corresponding CSS.  It then includes the built js and css files into your index.html.

## Dependencies
You must have Ext JS 6.2+ and Sencha Cmd 6.2+ to use this plugin.

## Options
The Angular2ExtJSWebpackPlugin constructor takes an object with the following properties:

* indexHtmlLocation [string] The path to the source file index.html.
* indexHtmlTitle [string] The title in the index.html.
* rootSelector [string] the root selector in the index.html file.
* build [string] Which Ext JS build to produce (testing or production).
* extThemeAppPath [string] The path for the Ext JS Theme project that will be created.
* extThemeAppName [string] The name of the Ext JS Theme project that will be created.
* extFrameworkPath [string] The path to the Ext JS framework.
* debug [boolean] True to output debug information.

## Example

```javascript
'use strict';

const path = require('path');
const webpack = require('webpack');
const Angular2ExtJSWebpackPlugin = require('angular2-extjs-webpack-plugin');

module.exports = {
	devtool: 'inline-source-map',
	entry: [
			'./src/index'
	],
	output: {
			path: path.join(__dirname, 'build'),
			filename: 'index.js'
	},
	plugins: [
		new ExtJSAngular2WebpackPlugin({
			indexHtmlLocation: 'src',
			indexHtmlTitle: 'Angular2 Webpack',
			rootSelector: 'my-app',
			build: 'testing',	// testing, production
			extThemeAppPath: '.',
			extThemeAppName: 'Theme',
			extFrameworkPath: '~/Downloads/ext-6.2.0',
			debug: false
		})
	],
	module: {
			loaders: [
					{
							test: /\.js$/,
							loader: 'babel',
							include: [
									path.join(__dirname, 'src')
							]
					},
					{
							test: /\.css$/,
							loader: 'style!css'
					},
					{
							test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
							exclude: /\/favicon.ico$/,
							loader: 'file',
							query: {
									name: 'static/media/[name].[hash:8].[ext]'
							}
					}
			]
	}
};
```
