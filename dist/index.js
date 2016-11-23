"use strict";

var fs = require("fs");
var chalk = require('chalk');
require("babel-polyfill");
var execSync = require('child_process').execSync;
var extractFromNG2 = require("./extractFromNG2");
var Init = require('./initialize').Init;

function Angular2ExtJSWebpackPlugin(options) {
	Angular2ExtJSWebpackPlugin.prototype.options = options;
}

Angular2ExtJSWebpackPlugin.prototype.apply = function (compiler) {
	var options = Angular2ExtJSWebpackPlugin.prototype.options;
	if (options.detail === true) {
		options.debug = true;
	}
	var debug = options.debug;
	var extThemeAppPathAndName = options.extThemeAppPath + '/' + options.extThemeAppName;
	var prefix = '<x-';
	options.dependencies = [];
	options.senchaCmdOut = '';
	if (options.senchaCmdOutputShow === false) {
		optiond.senchaCmdOut = ' > ' + options.senchaCmdOutputFile;
	}

	var c = compiler;
	var y = chalk.yellow;

	c.plugin('run', function (compiler, cb) {
		Init(options, debug, cb);
	});

	compiler.plugin('watch-run', function (watching, cb) {
		Init(options, debug, cb);
	});

	compiler.plugin('compilation', function (compilation, params) {

		compilation.plugin('normal-module-loader', function (loaderContext, module) {
			if (module.resource && module.resource.endsWith('.ts')) {
				try {
					var contents = fs.readFileSync(module.resource, 'utf8');
					var statements = extractFromNG2(module.context, contents, prefix, debug, module.resource);
					if (statements.length) {
						if (debug === true) console.log(chalk.green('***** Found Ext JS requires in: ' + module.resource + ''));
						var _iteratorNormalCompletion = true;
						var _didIteratorError = false;
						var _iteratorError = undefined;

						try {
							for (var _iterator = statements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
								var statement = _step.value;

								if (options.detail === true) console.log(chalk.blue(JSON.stringify(statement)));
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
					}
					if (statements.length) {
						options.dependencies = options.dependencies.concat(statements);
					}
				} catch (e) {
					console.error('error parsing this: ' + this.currentFile);
				}
			}
		});
	});

	compiler.plugin('after-emit', function (compilation, cb) {

		var dependencies = options.dependencies;
		var uniqueDependencies = [];
		for (var i = 0; i < dependencies.length; i++) {
			var current = dependencies[i];
			if (uniqueDependencies.indexOf(current) < 0) uniqueDependencies.push(current);
		}
		var theFile = '';
		theFile += 'Ext.require([' + '\n';
		var _iteratorNormalCompletion2 = true;
		var _didIteratorError2 = false;
		var _iteratorError2 = undefined;

		try {
			for (var _iterator2 = uniqueDependencies[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
				var dependency = _step2.value;

				theFile += "'" + dependency + "'," + "\n";
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

		var n = theFile.lastIndexOf(",");
		theFile = theFile.substring(0, n);
		theFile += '\n' + ']);';

		if (fs.existsSync(extThemeAppPathAndName + "/app.js")) {
			var appJsFileContents = fs.readFileSync(extThemeAppPathAndName + "/app.js", 'utf8');
			if (appJsFileContents === theFile) {
				if (debug === true) console.log(chalk.green('***** ' + extThemeAppPathAndName + '/app.js has no changes'));
			} else {
				fs.writeFileSync(extThemeAppPathAndName + "/app.js", theFile);
				if (debug === true) console.log(chalk.green('***** ' + extThemeAppPathAndName + '/app.js is created'));
				if (options.detail === true) console.log(chalk.blue(theFile));

				var theBuildCommand = 'sencha app build ' + options.build + options.senchaCmdOut;
				if (debug === true) console.log(chalk.green('***** Running: ' + theBuildCommand));
				var output = './' + extThemeAppPathAndName;
				var rc = execSync(theBuildCommand, { cwd: output, stdio: 'inherit' });
				if (debug === true) console.log(chalk.green('***** ' + theBuildCommand + ' is completed'));
			}
		}
		cb();
	});
};

module.exports = Angular2ExtJSWebpackPlugin;