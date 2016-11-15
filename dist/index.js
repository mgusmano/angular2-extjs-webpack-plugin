"use strict";

var fs = require("fs");
var extractFromNG2 = require("./extractFromNG2");
var execSync = require('child_process').execSync;
var bootJS = require('./artifacts').bootJS;
var miscCSS = require('./artifacts').miscCSS;
var createIndexHTML = require('./artifacts').createIndexHTML;
var chalk = require('chalk');
var commandExists = require('command-exists');

function Angular2ExtJSWebpackPlugin(options) {
	Angular2ExtJSWebpackPlugin.prototype.detail = options.detail;
	Angular2ExtJSWebpackPlugin.prototype.debug = options.debug;
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
	var detail = Angular2ExtJSWebpackPlugin.prototype.detail;
	var debug;
	if (detail === true) {
		debug = true;
	} else {
		debug = Angular2ExtJSWebpackPlugin.prototype.debug;;
	}
	var extThemeAppPath = Angular2ExtJSWebpackPlugin.prototype.extThemeAppPath;
	var extThemeAppName = Angular2ExtJSWebpackPlugin.prototype.extThemeAppName;
	var extThemeAppPathAndName = extThemeAppPath + '/' + extThemeAppName;
	var extFrameworkPath = Angular2ExtJSWebpackPlugin.prototype.extFrameworkPath;
	var build = Angular2ExtJSWebpackPlugin.prototype.build;
	var indexHtmlLocation = Angular2ExtJSWebpackPlugin.prototype.indexHtmlLocation;
	var indexHtmlTitle = Angular2ExtJSWebpackPlugin.prototype.indexHtmlTitle;
	var rootSelector = Angular2ExtJSWebpackPlugin.prototype.rootSelector;

	var checkIfFrameworkFileExists = function checkIfFrameworkFileExists(cb) {

		commandExists('sencha2', function (err, commandExists) {
			if (commandExists) {
				console.log('yes');
			} else {
				console.log('no');
			}
		});

		try {
			var stats = fs.lstatSync(extFrameworkPath);
			if (stats.isDirectory()) {
				if (debug === true) console.log(chalk.green('***** Ext JS framework folder ' + extFrameworkPath + ' exists\n'));
				cb();
			}
		} catch (e) {
			console.log(chalk.red('***** ERROR') + ' Ext JS framework path ' + extFrameworkPath + ' does NOT exist');
			console.log(chalk.red('***** ERROR') + ' Stop this run and install Ext JS ');
			console.log(chalk.red('***** ERROR') + ' also set or check extFrameworkPath webpack plugin parameter ');
			console.log('\n');
			return;
		}
	};

	compiler.plugin('run', function (compiler, cb) {
		checkIfFrameworkFileExists(cb);
	});
	compiler.plugin('watch-run', function (watching, cb) {
		checkIfFrameworkFileExists(cb);
	});

	compiler.plugin('compilation', function (compilation, params) {
		compilation.plugin("build-module", function (module) {
			this.currentFile = module.resource;
			if (module.resource && module.resource.endsWith('.ts')) {
				try {
					var contents = fs.readFileSync(module.resource, 'utf8');
					var statements = extractFromNG2(module.context, contents, this.prefix, debug, module.resource);
					if (statements.length) {
						if (debug === true) console.log(chalk.green('\n\n***** Found Ext JS requires in: ' + this.currentFile + ''));
						var _iteratorNormalCompletion = true;
						var _didIteratorError = false;
						var _iteratorError = undefined;

						try {
							for (var _iterator = statements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
								var statement = _step.value;

								if (detail === true) console.log(chalk.blue(JSON.stringify(statement)));
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

	compiler.plugin('after-emit', function (compilation, cb) {
		console.log('\n');
		try {
			var stats = fs.lstatSync('./' + extThemeAppPathAndName);
			if (stats.isDirectory()) {
				if (debug === true) console.log(chalk.green('***** Ext JS theme project named ' + extThemeAppName + ' exists'));
			}
		} catch (e) {
			var theCreateCommand = 'sencha -sdk ' + extFrameworkPath + ' generate app -modern -starter=false ' + extThemeAppName + ' ./' + extThemeAppName;
			if (debug === true) console.log(chalk.green('\n***** Running the Sencha Cmd: ' + theCreateCommand));
			execSync(theCreateCommand, { cwd: output, stdio: 'inherit' });
			if (debug === true) console.log(chalk.green('***** Ext JS app named ' + extThemeAppName + ' is created'));

			fs.writeFileSync(extThemeAppPathAndName + "/boot.js", bootJS);
			if (debug === true) console.log(chalk.green('\n***** ' + extThemeAppPathAndName + '/boot.js' + ' is created.'));
			fs.writeFileSync(extThemeAppPathAndName + "/misc.css", miscCSS);
			if (debug === true) console.log(chalk.green('***** ' + extThemeAppPathAndName + '/misc.css' + ' is created.'));
			var indexHTML = createIndexHTML(indexHtmlTitle, extThemeAppPathAndName, build, extThemeAppName, rootSelector);
			fs.writeFileSync(indexHtmlLocation + '/index.html', indexHTML);
			if (debug === true) console.log(chalk.green('***** ' + indexHtmlLocation + '/index.html' + ' is created.'));
		}
		var dependencies = Angular2ExtJSWebpackPlugin.prototype.dependencies;
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

				theFile += "\t'" + dependency + "'," + "\n";
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
		theFile += '\n' + ']);' + '\n';
		fs.writeFileSync(extThemeAppPathAndName + "/app.js", theFile);
		if (debug === true) console.log(chalk.green('\n***** ' + extThemeAppPathAndName + '/' + 'app.js file created:'));
		if (detail === true) console.log(chalk.blue(theFile));

		var output = './' + extThemeAppPathAndName;
		var theBuildCommand = 'sencha app build ' + build;
		if (debug === true) console.log(chalk.green('\n***** Running the Sencha Cmd: ' + theBuildCommand + '\n'));
		var rc = execSync(theBuildCommand, { cwd: output, stdio: 'inherit' });
		console.log('*** rc: ' + rc);
		if (debug === true) console.log(chalk.green('***** Sencha Cmd: ' + theBuildCommand + ' is completed\n'));

		cb();
	});
};

module.exports = Angular2ExtJSWebpackPlugin;