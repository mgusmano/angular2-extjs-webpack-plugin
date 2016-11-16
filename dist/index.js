"use strict";

var fs = require("fs");
var extractFromNG2 = require("./extractFromNG2");
var execSync = require('child_process').execSync;
var bootJS = require('./artifacts').bootJS;
var miscCSS = require('./artifacts').miscCSS;
var createIndexHTML = require('./artifacts').createIndexHTML;
var chalk = require('chalk');
var commandExists = require('command-exists');
require("babel-polyfill");

var ok;
function checkIfSenchaSetupGood(options, debug) {
	return new Promise(function (resolve, reject) {
		commandExists('sencha', function (err, commandExists) {
			if (!commandExists) {
				console.log(chalk.red('***** ERROR') + ' Sencha Cmd is not installed');
				console.log(chalk.red('***** ERROR') + ' Stop this run and install Sencha Cmd ');
				console.log(chalk.red('***** ERROR') + ' download from: ' + chalk.green('https://www.sencha.com/products/extjs/cmd-download '));
				reject;
				//ok = false;
				//return;
			} else {
				if (debug === true) console.log(chalk.green('\n***** Sencha Cmd is installed\n'));
				try {
					var stats = fs.lstatSync(options.extFrameworkPath);
					if (stats.isDirectory()) {
						if (debug === true) console.log(chalk.green('***** Sencha Ext JS framework folder ' + options.extFrameworkPath + ' exists\n'));
						resolve;
						//ok = true;
						//return true;
					}
				} catch (e) {
					console.log(chalk.red('***** ERROR') + ' Sencha Ext JS framework path ' + options.extFrameworkPath + ' does NOT exist');
					console.log(chalk.red('***** ERROR') + ' Stop this run and install Sencha Ext JS ');
					console.log(chalk.red('***** ERROR') + ' download from: ' + chalk.green('https://www.sencha.com/products/extjs '));
					console.log(chalk.red('***** ERROR') + ' also set or check extFrameworkPath webpack plugin parameter ');
					reject;
					//ok = false;
					//return false;
				}
			}
		});
	});
}

function doIndexHTML(options, debug) {
	if (options.indexHtmlReplace === true) {
		if (!fs.existsSync('./' + options.indexHtmlLocation)) {
			fs.mkdirSync('./' + options.indexHtmlLocation);
			if (debug === true) console.log(chalk.green('***** folder ' + './' + options.indexHtmlLocation + ' is created'));
		}
		var indexHTML = createIndexHTML(options.indexHtmlTitle, extThemeAppPathAndName, options.build, options.extThemeAppName, options.rootSelector);
		if (fs.existsSync('./' + options.indexHtmlLocation + '/index.html')) {
			var contents = fs.readFileSync('./' + options.indexHtmlLocation + '/index.html', 'utf8');
			if (contents === indexHTML) {} else {
				fs.writeFileSync('./' + options.indexHtmlLocation + '/index.html', indexHTML);

				if (!fs.existsSync('./' + options.indexHtmlLocation + '/index.html')) {
					console.log('not there..........');
				} else {
					console.log('there..........');
				}

				if (debug === true) console.log(chalk.green('***** file ' + './' + options.indexHtmlLocation + '/index.html' + ' is created'));
			}
		} else {
			fs.writeFileSync('./' + options.indexHtmlLocation + '/index.html', indexHTML);
			if (!fs.existsSync('./' + options.indexHtmlLocation + '/index.html')) {
				console.log('not there..........');
			} else {
				console.log('there..........');
			}
			if (debug === true) console.log(chalk.green('***** file ' + './' + options.indexHtmlLocation + '/index.html' + ' is created'));
		}
	}
}

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

	compiler.plugin('run', function (compiler, cb) {
		console.log('1111');
		checkIfSenchaSetupGood(options, debug).then(function () {
			console.log('cool');
		}).catch(function (err) {
			console.log('not cool');
		});
		// console.log('ok ' + ok);
		// if (ok === true) {
		// 	doIndexHTML(options);
		// 	cb();
		// }
	});
	compiler.plugin('watch-run', function (watching, cb) {
		console.log('1111');
		checkIfSenchaSetupGood(options, debug).then(function () {
			console.log('cool');
		}).catch(function (err) {
			console.log('not cool');
		});
		// console.log('ok ' + ok);
		// if (ok === true) {
		// 	doIndexHTML(options, debug);
		// 	cb();
		// }
	});

	compiler.plugin('compilation', function (compilation, params) {

		compilation.plugin("build-module", function (module) {
			if (module.resource && module.resource.endsWith('.ts')) {
				try {
					var contents = fs.readFileSync(module.resource, 'utf8');
					var statements = extractFromNG2(module.context, contents, prefix, debug, module.resource);
					if (statements.length) {
						if (debug === true) console.log(chalk.green('\n\n***** Found Ext JS requires in: ' + module.resource + ''));
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

						if (debug === true) console.log('');
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
		console.log('\n');

		// if(options.indexHtmlReplace === true) {
		// 	if (!fs.existsSync('./' + options.indexHtmlLocation)){
		// 		fs.mkdirSync('./' + options.indexHtmlLocation);
		// 		if(debug === true) console.log(chalk.green('***** folder ' + './' + options.indexHtmlLocation + ' is created'))
		// 	}
		// 	var indexHTML = createIndexHTML(options.indexHtmlTitle, extThemeAppPathAndName, options.build, options.extThemeAppName, options.rootSelector)
		// 	if (fs.existsSync('./' + options.indexHtmlLocation + '/index.html')){
		// 		var contents = fs.readFileSync('./' + options.indexHtmlLocation + '/index.html', 'utf8');
		// 		if (contents === indexHTML) {
		// 		}
		// 		else {
		// 			fs.writeFileSync('./' + options.indexHtmlLocation + '/index.html', indexHTML); 

		// 		if (!fs.existsSync('./' + options.indexHtmlLocation + '/index.html')){
		// 			console.log('not there..........')
		// 		}
		// 		else {
		// 			console.log('there..........')
		// 		}

		// 			if(debug === true) console.log(chalk.green('***** file ' + './' + options.indexHtmlLocation + '/index.html' + ' is created'))
		// 		}
		// 	}
		// 	else {
		// 		fs.writeFileSync('./' + options.indexHtmlLocation + '/index.html', indexHTML); 


		// 		if (!fs.existsSync('./' + options.indexHtmlLocation + '/index.html')){
		// 			console.log('not there..........')
		// 		}
		// 		else {
		// 			console.log('there..........')
		// 		}


		// 		if(debug === true) console.log(chalk.green('***** file ' + './' + options.indexHtmlLocation + '/index.html' + ' is created'))
		// 	}
		// }

		try {
			var stats = fs.lstatSync('./' + extThemeAppPathAndName);
			if (stats.isDirectory()) {
				if (debug === true) console.log(chalk.green('***** Ext JS theme project named ' + options.extThemeAppName + ' exists'));
			}
		} catch (e) {
			var theCreateCommand = 'sencha -sdk ' + options.extFrameworkPath + ' generate app -modern -starter=false ' + options.extThemeAppName + ' ./' + options.extThemeAppName;
			if (debug === true) console.log(chalk.green('\n***** Running the Sencha Cmd: ' + theCreateCommand));
			execSync(theCreateCommand, { cwd: output, stdio: 'inherit' });
			if (debug === true) console.log(chalk.green('***** Ext JS app named ' + options.extThemeAppName + ' is created'));

			if (!fs.existsSync(extThemeAppPathAndName + "/build/")) {
				fs.mkdirSync(extThemeAppPathAndName + "/build/");
			}
			fs.writeFileSync(extThemeAppPathAndName + "/build/" + "boot.js", bootJS);
			if (debug === true) console.log(chalk.green('\n***** ' + extThemeAppPathAndName + '/boot.js' + ' is created.'));
			fs.writeFileSync(extThemeAppPathAndName + "/build/" + "misc.css", miscCSS);
			if (debug === true) console.log(chalk.green('***** ' + extThemeAppPathAndName + '/misc.css' + ' is created.'));
		}

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
		if (options.detail === true) console.log(chalk.blue(theFile));

		var buildOut = '';
		if (options.senchaCmdOutputShow === true) {
			buildOut = ' > ' + options.senchaCmdOutputFile;
		}
		var output = './' + extThemeAppPathAndName;
		var theBuildCommand = 'sencha app build ' + options.build + buildOut;
		if (debug === true) console.log(chalk.green('\n***** Running the Sencha Cmd: ' + theBuildCommand + '\n'));
		var rc = execSync(theBuildCommand, { cwd: output, stdio: 'inherit' });
		if (debug === true) console.log(chalk.green('***** Sencha Cmd: ' + theBuildCommand + ' is completed\n'));

		cb();
	});
};

module.exports = Angular2ExtJSWebpackPlugin;