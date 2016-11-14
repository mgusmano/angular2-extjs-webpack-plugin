"use strict";

var fs = require("fs");
var extractFromNG2 = require("./extractFromNG2");
var execSync = require('child_process').execSync;
var bootJS = require('./artifacts').bootJS;
var miscCSS = require('./artifacts').miscCSS;
var createIndexHTML = require('./artifacts').createIndexHTML;
var chalk = require('chalk');

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
	var extThemeAppPathAndName = extThemeAppPath + '/' + extThemeAppName;
	var extFrameworkPath = Angular2ExtJSWebpackPlugin.prototype.extFrameworkPath;
	var build = Angular2ExtJSWebpackPlugin.prototype.build;
	var indexHtmlLocation = Angular2ExtJSWebpackPlugin.prototype.indexHtmlLocation;
	var indexHtmlTitle = Angular2ExtJSWebpackPlugin.prototype.indexHtmlTitle;
	var rootSelector = Angular2ExtJSWebpackPlugin.prototype.rootSelector;
	var watch = false;

	compiler.plugin('run', function (compiler, cb) {
		console.log(chalk.red('Text in red'));
		//console.log('*** run');
		try {
			var stats = fs.lstatSync(extFrameworkPath);
			if (stats.isDirectory()) {
				if (debug === true) console.log('***** ' + extFrameworkPath + ' exists');
				cb();
			}
		} catch (e) {
			console.log('***** Ext JS framework path ' + extFrameworkPath + ' does NOT exist');
			console.log('***** Stop this run and install Ext JS ');
			console.log('***** also set extFrameworkPath plugin parameter ');
			console.log('\n');
			return;
		}
	});

	compiler.plugin('watch-run', function (watching, cb) {
		try {
			var stats = fs.lstatSync(extFrameworkPath);
			if (stats.isDirectory()) {
				if (debug === true) console.log('\n\n***** ' + extFrameworkPath + ' exists');
				cb();
			}
		} catch (e) {
			console.log('***** Ext JS framework path ' + extFrameworkPath + ' does NOT exist');
			console.log('***** Stop this run and install Ext JS ');
			console.log('***** also set extFrameworkPath plugin parameter ');
			console.log('\n');
			return;
		}

		// watch = true;
		// try {
		// 	if(debug === true) console.log('***** checking for ' + process.cwd() + '/' +extThemeAppPathAndName);
		// 	var stats = fs.lstatSync(process.cwd() + '/' + extThemeAppPathAndName);
		// 	if (stats.isDirectory()) {
		// 		if(debug === true) console.log('***** ' + process.cwd() + '/' +extThemeAppPathAndName + ' already exists.\n');
		// 	}
		// }
		// catch (e) {
		// 	//console.log(e);
		// 	console.log('***** Ext JS theme project does not exist.');
		// 	console.log('***** Ext JS Project will be created.');
		// 	console.log('\n');
		// }
		// cb();
	});

	compiler.plugin('emit', function (compilation, callback) {
		console.log('************* emit');
		callback();
	});

	compiler.plugin('after-emit', function (compilation, callback) {
		try {
			var stats = fs.lstatSync(extFrameworkPath);
			if (stats.isDirectory()) {
				if (debug === true) console.log('\n\n***** ' + './' + extFrameworkPath + ' exists');
			}
		} catch (e) {
			console.log('\n\n***** Ext JS framework path ' + extFrameworkPath + ' does NOT exist');
			console.log('***** Stop this run and install Ext JS ');
			console.log('***** also set extFrameworkPath plugin parameter ');
			return;
		}

		try {
			var stats = fs.lstatSync('./' + extThemeAppPathAndName);
			if (stats.isDirectory()) {
				if (debug === true) console.log('\n\n***** ' + './' + extThemeAppPathAndName + ' already exists');
			}
		} catch (e) {
			if (debug === true) console.log('\n\n***** creating Ext JS app named ' + extThemeAppName + '');
			var theCreateCommand = 'sencha -sdk ' + extFrameworkPath + ' generate app -modern -starter=false ' + extThemeAppName + ' ./' + extThemeAppName;
			if (debug === true) console.log('\n***** ' + theCreateCommand);
			execSync(theCreateCommand, { cwd: output, stdio: 'inherit' });
			if (debug === true) console.log('***** Ext JS app named ' + extThemeAppName + ' is created');

			//if (watch === false) {
			fs.writeFileSync(extThemeAppPathAndName + "/boot.js", bootJS);
			if (debug === true) console.log('\n***** ' + extThemeAppPathAndName + '/boot.js' + ' is created.');
			fs.writeFileSync(extThemeAppPathAndName + "/misc.css", miscCSS);
			if (debug === true) console.log('***** ' + extThemeAppPathAndName + '/misc.css' + ' is created.');
			var indexHTML = createIndexHTML(indexHtmlTitle, extThemeAppPathAndName, build, extThemeAppName, rootSelector);
			fs.writeFileSync(indexHtmlLocation + '/index.html', indexHTML);
			if (debug === true) console.log('***** ' + indexHtmlLocation + '/index.html' + ' is created.');
			//}
		}
		var dependencies = Angular2ExtJSWebpackPlugin.prototype.dependencies;
		var uniqueDependencies = [];
		for (var i = 0; i < dependencies.length; i++) {
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
		fs.writeFileSync(extThemeAppPathAndName + "/app.js", theFile);
		if (debug === true) console.log('\n***** ' + './' + extThemeAppPathAndName + '/' + 'app.js file created:');
		if (debug === true) console.log(theFile);

		var output = './' + extThemeAppPathAndName;

		var theBuildCommand = 'sencha app build ' + build;
		if (debug === true) console.log('\n***** ' + theBuildCommand);
		execSync(theBuildCommand, { cwd: output, stdio: 'inherit' });

		callback();
	});

	compiler.plugin('compilation', function (compilation, params) {

		compilation.mainTemplate.plugin('startup', function (source, module, hash) {
			console.log('startup');
			return source;
		});

		compilation.plugin('normal-module-loader', function (loaderContext, module) {
			console.log('normal-module-loader');
			//console.log(module.resource);
		});

		compilation.plugin('succeed-module', function (module) {
			console.log('succeed module');
			//console.log(module);
		});

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