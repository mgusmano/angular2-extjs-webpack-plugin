var fs = require("fs");
var extractFromNG2 = require("./extractFromNG2");
const execSync = require('child_process').execSync;
const bootJS = require('./artifacts').bootJS;
const miscCSS = require('./artifacts').miscCSS;
const createIndexHTML = require('./artifacts').createIndexHTML;
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

Angular2ExtJSWebpackPlugin.prototype.apply = function(compiler) {
	var detail = Angular2ExtJSWebpackPlugin.prototype.detail;
	var debug;
	if (detail === true) {
		debug = true;
	}
	else {
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

	var checkIfSenchaSetupGood = function(cb) {
		commandExists('sencha', function(err, commandExists) {
			if(!commandExists) {
				console.log(chalk.red('***** ERROR') + ' Sencha Cmd is not installed');
				console.log(chalk.red('***** ERROR') + ' Stop this run and install Sencha Cmd ');
				console.log(chalk.red('***** ERROR') + ' download from: ' + chalk.green('https://www.sencha.com/products/extjs/cmd-download '));
				return;
			}
			else {
				try {
					var stats = fs.lstatSync(extFrameworkPath);
					if (stats.isDirectory()) {
						if(debug === true) console.log(chalk.green('***** Sencha Ext JS framework folder ' + extFrameworkPath + ' exists\n'));
						cb();
					}
				}
				catch (e) {
					console.log(chalk.red('***** ERROR') + ' Sencha Ext JS framework path ' + extFrameworkPath + ' does NOT exist');
					console.log(chalk.red('***** ERROR') + ' Stop this run and install Sencha Ext JS ');
					console.log(chalk.red('***** ERROR') + ' download from: ' + chalk.green('https://www.sencha.com/products/extjs '));
					console.log(chalk.red('***** ERROR') + ' also set or check extFrameworkPath webpack plugin parameter ');
					return;
				}
			}
		});
	}

	compiler.plugin('run', (compiler, cb) => {checkIfSenchaSetupGood(cb);});
	compiler.plugin('watch-run', (watching, cb) => {checkIfSenchaSetupGood(cb);});

	compiler.plugin('compilation', function(compilation, params) {
		compilation.plugin("build-module", function(module) {
			this.currentFile = module.resource;
			if (module.resource && module.resource.endsWith('.ts')) {
				try {
					const contents = fs.readFileSync(module.resource, 'utf8');
					var statements = extractFromNG2(module.context, contents, this.prefix, debug, module.resource);
					if (statements.length) {
						if(debug === true) console.log(chalk.green('\n\n***** Found Ext JS requires in: ' + this.currentFile + ''));
						for (let statement of statements) {
							if(detail === true) console.log(chalk.blue(JSON.stringify(statement)));
						}
						if(debug === true) console.log('');
					}
					if (statements.length) {
						Angular2ExtJSWebpackPlugin.prototype.dependencies =
						Angular2ExtJSWebpackPlugin.prototype.dependencies.concat(statements);
					}
				} catch (e) {
					console.error('error parsing this: ' + this.currentFile);
				}
			}
		});
	});

	compiler.plugin('after-emit', function(compilation, cb) {
		console.log('\n');
		try {
			var stats = fs.lstatSync('./' + extThemeAppPathAndName);
			if (stats.isDirectory()) {
				if(debug === true) console.log(chalk.green('***** Ext JS theme project named ' + extThemeAppName + ' exists'))
			}
		}
		catch (e) {
			var theCreateCommand = 'sencha -sdk ' + extFrameworkPath + ' generate app -modern -starter=false ' + extThemeAppName + ' ./' + extThemeAppName;
			if(debug === true) console.log(chalk.green('\n***** Running the Sencha Cmd: ' + theCreateCommand));
			execSync( theCreateCommand, { cwd: output, stdio: 'inherit' });
			if(debug === true) console.log(chalk.green('***** Ext JS app named ' + extThemeAppName + ' is created'))

			fs.writeFileSync(extThemeAppPathAndName + "/boot.js", bootJS); 
			if(debug === true) console.log(chalk.green('\n***** ' + extThemeAppPathAndName + '/boot.js' + ' is created.'))
			fs.writeFileSync(extThemeAppPathAndName + "/misc.css", miscCSS); 
			if(debug === true) console.log(chalk.green('***** ' + extThemeAppPathAndName + '/misc.css' + ' is created.'))
			var indexHTML = createIndexHTML(indexHtmlTitle, extThemeAppPathAndName, build, extThemeAppName, rootSelector)
			fs.writeFileSync(indexHtmlLocation + '/index.html', indexHTML); 
			if(debug === true) console.log(chalk.green('***** ' + indexHtmlLocation + '/index.html' + ' is created.'))
		}
		var dependencies = Angular2ExtJSWebpackPlugin.prototype.dependencies;
		var uniqueDependencies = [];
		for ( var i = 0; i < dependencies.length; i++ ) {
			var current = dependencies[i];
			if (uniqueDependencies.indexOf(current) < 0) uniqueDependencies.push(current);
		}
		var theFile = '';
		theFile += 'Ext.require([' + '\n';
		for (let dependency of uniqueDependencies) {
			theFile += "\t'" + dependency + "'," + "\n";
		}
		var n=theFile.lastIndexOf(",");
		theFile=theFile.substring(0,n) 
		theFile += '\n' + ']);' + '\n';
		fs.writeFileSync(extThemeAppPathAndName + "/app.js", theFile); 
		if(debug === true) console.log(chalk.green('\n***** ' + extThemeAppPathAndName + '/' + 'app.js file created:'))
		if(detail === true) console.log(chalk.blue(theFile));

		var output = './' + extThemeAppPathAndName;
		var theBuildCommand = 'sencha app build ' + build;
		if(debug === true) console.log(chalk.green('\n***** Running the Sencha Cmd: ' + theBuildCommand + '\n'));
		var rc = execSync( theBuildCommand, { cwd: output, stdio: 'inherit' });
		if(debug === true) console.log(chalk.green('***** Sencha Cmd: ' + theBuildCommand + ' is completed\n'));

		cb();
	});

};

module.exports = Angular2ExtJSWebpackPlugin;