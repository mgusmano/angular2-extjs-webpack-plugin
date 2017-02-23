const fs = require("fs");
const chalk = require('chalk');
require("babel-polyfill");
const execSync = require('child_process').execSync;
const extractFromNG2 = require("./extractFromNG2");
const Init = require('./initialize').Init;

function Angular2ExtJSWebpackPlugin(options) {
	Angular2ExtJSWebpackPlugin.prototype.options = options;
}

Angular2ExtJSWebpackPlugin.prototype.apply = function(compiler) {
	var options = Angular2ExtJSWebpackPlugin.prototype.options;
	if (options.detail === true) { options.debug = true; }
	var debug = options.debug;
	var extThemeAppPathAndName = options.extThemeAppPath + '/' + options.extThemeAppName;
	var prefix = '<x-';
	options.dependencies = [];
	options.senchaCmdOut = '';
	if (options.senchaCmdOutputShow === false) { optiond.senchaCmdOut = ' > ' + options.senchaCmdOutputFile;}

	var firstFound = true;
	var c = compiler;
	var y = chalk.yellow;

	c.plugin('run', (compiler, cb) => {
		Init(options, debug, cb);
	});

	compiler.plugin('watch-run', (watching, cb) => {
		Init(options, debug, cb);
	});

	compiler.plugin('compilation', function(compilation, params) {

		compilation.plugin('normal-module-loader', function(loaderContext, module) {
			firstFound = true;
			if (module.resource && module.resource.endsWith('.ts')) {
				try {
					const contents = fs.readFileSync(module.resource, 'utf8');
					var statements = extractFromNG2(module.context, contents, prefix, debug, module.resource);
					if (statements.length) {
						var n=''; 
						if (firstFound === true)
							{n = '\n';firstFound = false;};
						if(debug === true) console.log(chalk.green(n + '***** Found Ext JS requires in: ' + module.resource + ''));
						for (let statement of statements) {
							if(options.detail === true) console.log(chalk.blue(JSON.stringify(statement)));
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

	compiler.plugin('after-emit', function(compilation, cb) {

		var dependencies = options.dependencies;
		var uniqueDependencies = [];
		for ( var i = 0; i < dependencies.length; i++ ) {
			var current = dependencies[i];
			if (uniqueDependencies.indexOf(current) < 0) uniqueDependencies.push(current);
		}
		var theFile = '';
		theFile += 'Ext.require([' + '\n';
		for (let dependency of uniqueDependencies) {
			theFile += "'" + dependency + "'," + "\n";
		}
		var n=theFile.lastIndexOf(",");
		theFile=theFile.substring(0,n) 
		theFile += '\n' + ']);';

		if (fs.existsSync(extThemeAppPathAndName + "/app.js")) {
			var appJsFileContents = fs.readFileSync(extThemeAppPathAndName + "/app.js", 'utf8');
			if (appJsFileContents === theFile) {
				if (debug === true) console.log(chalk.green('\n***** ' + extThemeAppPathAndName + '/app.js has no changes'));
			}
			else {
				fs.writeFileSync(extThemeAppPathAndName + "/app.js", theFile);
				if (debug === true) console.log(chalk.green('\n***** ' + extThemeAppPathAndName + '/app.js is created'));
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