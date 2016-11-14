"use strict";

var fs = require("fs");
var extractFromNG2 = require("./extractFromNG2");
var execSync = require('child_process').execSync;
var bootJS = require('./artifacts').bootJS;
var miscCSS = require('./artifacts').miscCSS;

function Angular2ExtJSWebpackPlugin(options) {

	Angular2ExtJSWebpackPlugin.prototype.indexHtmlLocation = options.indexHtmlLocation;
	Angular2ExtJSWebpackPlugin.prototype.indexHtmlTitle = options.indexHtmlTitle;
	Angular2ExtJSWebpackPlugin.prototype.rootSelector = options.rootSelector;

	Angular2ExtJSWebpackPlugin.prototype.build = options.build;
	Angular2ExtJSWebpackPlugin.prototype.extThemeAppPath = options.extThemeAppPath;
	Angular2ExtJSWebpackPlugin.prototype.extThemeAppName = options.extThemeAppName;
	Angular2ExtJSWebpackPlugin.prototype.extFrameworkPath = options.extFrameworkPath;
	Angular2ExtJSWebpackPlugin.prototype.debug = options.debug;
	Angular2ExtJSWebpackPlugin.prototype.dependencies = [];
}

Angular2ExtJSWebpackPlugin.prototype.apply = function (compiler) {
	var debug = Angular2ExtJSWebpackPlugin.prototype.debug;
	var extThemeAppPath = Angular2ExtJSWebpackPlugin.prototype.extThemeAppPath;
	var extThemeAppName = Angular2ExtJSWebpackPlugin.prototype.extThemeAppName;
	var extFrameworkPath = Angular2ExtJSWebpackPlugin.prototype.extFrameworkPath;
	var build = Angular2ExtJSWebpackPlugin.prototype.build;

	var indexHtmlLocation = Angular2ExtJSWebpackPlugin.prototype.indexHtmlLocation;
	var indexHtmlTitle = Angular2ExtJSWebpackPlugin.prototype.indexHtmlTitle;
	var rootSelector = Angular2ExtJSWebpackPlugin.prototype.rootSelector;

	compiler.plugin('after-emit', function (compilation, callback) {
		try {
			stats = fs.lstatSync('./' + extThemeAppPath + '/' + extThemeAppName);
			if (stats.isDirectory()) {
				if (debug === true) console.log('\n\n***** ' + './' + extThemeAppPath + '/' + extThemeAppName + ' already exists');
			}
		} catch (e) {
			if (debug === true) console.log('\n\n***** creating Ext JS app named ' + extThemeAppPath + '/' + extThemeAppName + '');
			var outputBase = '/';
			var theCreateCommand = 'sencha -sdk ' + extFrameworkPath + ' generate app -modern -starter=false ' + extThemeAppName + ' ./' + extThemeAppPath + '/' + extThemeAppName;
			if (debug === true) console.log('\n***** ' + theCreateCommand);
			execSync(theCreateCommand, { cwd: output, stdio: 'inherit' });
			if (debug === true) console.log('***** Ext JS app named ' + extThemeAppPath + '/' + extThemeAppName + ' is created');

			fs.writeFileSync(extThemeAppPath + '/' + extThemeAppName + "/boot.js", bootJS);
			fs.writeFileSync(extThemeAppPath + '/' + extThemeAppName + "/misc.css", miscCSS);

			var indexHTML = '<!DOCTYPE html>' + '\n' + '<html>' + '\n' + '	<head>' + '\n' + '		<base href="/">' + '\n' + '		<title>' + indexHtmlTitle + '</title>' + '\n' + '		<meta http-equiv="X-UA-Compatible" content="IE=edge">' + '\n' + '		<meta charset="UTF-8">' + '\n' + '		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=10, user-scalable=yes">' + '\n' + '		<script src="../' + extThemeAppPath + '/' + extThemeAppName + '/Boot.js"></script>' + '\n' + '		<script src="../' + extThemeAppPath + '/' + extThemeAppName + '/build/' + build + '/' + extThemeAppName + '/app.js"></script>' + '\n' + '		<link rel="stylesheet" href="../' + extThemeAppPath + '/' + extThemeAppName + '/misc.css">' + '\n' + '		<link rel="stylesheet" href="../' + extThemeAppPath + '/' + extThemeAppName + '/build/' + build + '/' + extThemeAppName + '/resources/' + extThemeAppName + '-all.css">' + '\n' + '	</head>' + '\n' + '	<body>' + '\n' + '		<' + rootSelector + '>Loading...</' + rootSelector + '>' + '\n' + '	</body>' + '\n' + '</html>';
			fs.writeFileSync(indexHtmlLocation + '/' + 'index.html', indexHTML);
		}

		var dependencies = Angular2ExtJSWebpackPlugin.prototype.dependencies;
		var uniqueDependencies = [];
		for (i = 0; i < dependencies.length; i++) {
			var current = dependencies[i];
			if (uniqueDependencies.indexOf(current) < 0) uniqueDependencies.push(current);
		}
		var theFile = '';
		theFile += 'Ext.require([' + '\n';
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = uniqueDependencies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var dependency = _step.value;

				theFile += "\t'" + dependency + "'," + "\n";
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		var n = theFile.lastIndexOf(",");
		theFile = theFile.substring(0, n);
		theFile += '\n' + ']);' + '\n';
		fs.writeFileSync(extThemeAppPath + '/' + extThemeAppName + "/app.js", theFile);
		if (debug === true) console.log('\n***** ' + './' + extThemeAppPath + '/' + extThemeAppName + '/' + 'app.js file created:');
		if (debug === true) console.log(theFile);

		var output = './' + extThemeAppPath + '/' + extThemeAppName;
		console.log('\n');
		execSync('sencha app build ' + build, { cwd: output, stdio: 'inherit' });

		callback();
	});

	compiler.plugin('compilation', function (compilation, params) {
		compilation.plugin("build-module", function (module) {
			this.currentFile = module.resource;
			if (module.resource && module.resource.endsWith('.ts')) {
				try {
					var contents = fs.readFileSync(module.resource, 'utf8');
					var statements = extractFromNG2(module.context, contents, this.prefix, debug, module.resource);
					if (statements.length) {
						if (debug === true) console.log('\n\n***** Ext JS requires in: ' + this.currentFile + '');
						var _iteratorNormalCompletion2 = true;
						var _didIteratorError2 = false;
						var _iteratorError2 = undefined;

						try {
							for (var _iterator2 = statements[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
								var statement = _step2.value;

								if (debug === true) console.log(JSON.stringify(statement));
							}
						} catch (err) {
							_didIteratorError2 = true;
							_iteratorError2 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion2 && _iterator2.return) {
									_iterator2.return();
								}
							} finally {
								if (_didIteratorError2) {
									throw _iteratorError2;
								}
							}
						}

						if (debug === true) console.log('');
					}
					if (statements.length) {
						Angular2ExtJSWebpackPlugin.prototype.dependencies = Angular2ExtJSWebpackPlugin.prototype.dependencies.concat(statements);
					}
				} catch (e) {
					console.error('error parsing this: ' + this.currentFile);
				}
			}
		});
	});
};

module.exports = Angular2ExtJSWebpackPlugin;