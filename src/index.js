const fs = require("fs");
const chalk = require('chalk');
require("babel-polyfill");
const execSync = require('child_process').execSync;

const extractFromNG2 = require("./extractFromNG2");
const Init = require('./initialize').Init;
const bootJS = require('./artifacts').bootJS;
const miscCSS = require('./artifacts').miscCSS;

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

var c = compiler;
var y = chalk.yellow;

	c.plugin('run', (compiler, cb) => {
		console.log(y('\n***** runx'));
		Init(options, debug, cb);
	});

	compiler.plugin('watch-run', (watching, cb) => {
		Init(options, debug, cb);
	});

	compiler.plugin('compilation', function(compilation, params) {

		// compilation.plugin('normal-module-loader', function(loaderContext, module) {
		// 	console.log(chalk.yellow('\n***** normal-module-loader'));
		// 	console.log(chalk.yellow(module.resource));
		// });

		compilation.plugin('normal-module-loader', function(loaderContext, module) {
			if (module.resource && module.resource.endsWith('.ts')) {
				try {
					const contents = fs.readFileSync(module.resource, 'utf8');
					var statements = extractFromNG2(module.context, contents, prefix, debug, module.resource);
					if (statements.length) {
						if(debug === true) console.log(chalk.green('***** Found Ext JS requires in: ' + module.resource + ''));
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

	compiler.plugin('compilation', function(compilation, params) {

		compilation.plugin("after-emit", function() {
			//console.log("\ncccccThe compilation is starting to optimize files...");

			var senchaCmdOut = '';
			if (options.senchaCmdOutputShow === false) { senchaCmdOut = ' > ' + options.senchaCmdOutputFile;}
			try {
				var stats = fs.lstatSync('./' + extThemeAppPathAndName);
				if (stats.isDirectory()) {
					if(debug === true) console.log(chalk.green('***** Ext JS theme project named ' + options.extThemeAppName + ' exists'))
				}
			}
			catch (e) {
				var theCreateCommand = 'sencha -sdk ' + options.extFrameworkPath + ' generate app -modern -starter=false ' + options.extThemeAppName + ' ./' + options.extThemeAppName + senchaCmdOut;
				if(debug === true) console.log(chalk.green('***** Running the Sencha Cmd: ' + theCreateCommand));
				execSync( theCreateCommand, { cwd: output, stdio: 'inherit' });
				if(debug === true) console.log(chalk.green('***** Ext JS app named ' + options.extThemeAppName + ' is created'))

				if (!fs.existsSync(extThemeAppPathAndName + "/build/")){fs.mkdirSync(extThemeAppPathAndName + "/build/");}
				fs.writeFileSync(extThemeAppPathAndName + "/build/" + "boot.js", bootJS); 
				if(debug === true) console.log(chalk.green('***** ' + extThemeAppPathAndName + "/build/" + '/boot.js' + ' is created'))
				fs.writeFileSync(extThemeAppPathAndName + "/build/" + "misc.css", miscCSS); 
				if(debug === true) console.log(chalk.green('***** ' + extThemeAppPathAndName + "/build/" + '/misc.css' + ' is created'))
			}

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
			fs.writeFileSync(extThemeAppPathAndName + "/app.js", theFile); 
			if(debug === true) console.log(chalk.green('***** ' + extThemeAppPathAndName + '/' + 'app.js is created'))
			if(options.detail === true) console.log(chalk.blue(theFile));

			var theBuildCommand = 'sencha app build ' + options.build + senchaCmdOut;
			if(debug === true) console.log(chalk.green('***** Running the Sencha Cmd: ' + theBuildCommand));
			var output = './' + extThemeAppPathAndName;
			var rc = execSync( theBuildCommand, { cwd: output, stdio: 'inherit' });
			if(debug === true) console.log(chalk.green('***** Sencha Cmd: ' + theBuildCommand + ' is completed'));
		});


	});


	// compiler.plugin('emit', function(compilation, cb) {



	// 	var senchaCmdOut = '';
	// 	if (options.senchaCmdOutputShow === false) { senchaCmdOut = ' > ' + options.senchaCmdOutputFile;}
	// 	try {
	// 		var stats = fs.lstatSync('./' + extThemeAppPathAndName);
	// 		if (stats.isDirectory()) {
	// 			if(debug === true) console.log(chalk.green('***** Ext JS theme project named ' + options.extThemeAppName + ' exists'))
	// 		}
	// 	}
	// 	catch (e) {
	// 		var theCreateCommand = 'sencha -sdk ' + options.extFrameworkPath + ' generate app -modern -starter=false ' + options.extThemeAppName + ' ./' + options.extThemeAppName + senchaCmdOut;
	// 		if(debug === true) console.log(chalk.green('***** Running the Sencha Cmd: ' + theCreateCommand));
	// 		execSync( theCreateCommand, { cwd: output, stdio: 'inherit' });
	// 		if(debug === true) console.log(chalk.green('***** Ext JS app named ' + options.extThemeAppName + ' is created'))

	// 		if (!fs.existsSync(extThemeAppPathAndName + "/build/")){fs.mkdirSync(extThemeAppPathAndName + "/build/");}
	// 		fs.writeFileSync(extThemeAppPathAndName + "/build/" + "boot.js", bootJS); 
	// 		if(debug === true) console.log(chalk.green('***** ' + extThemeAppPathAndName + "/build/" + '/boot.js' + ' is created'))
	// 		fs.writeFileSync(extThemeAppPathAndName + "/build/" + "misc.css", miscCSS); 
	// 		if(debug === true) console.log(chalk.green('***** ' + extThemeAppPathAndName + "/build/" + '/misc.css' + ' is created'))
	// 	}

	// 	var dependencies = options.dependencies;
	// 	var uniqueDependencies = [];
	// 	for ( var i = 0; i < dependencies.length; i++ ) {
	// 		var current = dependencies[i];
	// 		if (uniqueDependencies.indexOf(current) < 0) uniqueDependencies.push(current);
	// 	}
	// 	var theFile = '';
	// 	theFile += 'Ext.require([' + '\n';
	// 	for (let dependency of uniqueDependencies) {
	// 		theFile += "'" + dependency + "'," + "\n";
	// 	}
	// 	var n=theFile.lastIndexOf(",");
	// 	theFile=theFile.substring(0,n) 
	// 	theFile += '\n' + ']);';
	// 	fs.writeFileSync(extThemeAppPathAndName + "/app.js", theFile); 
	// 	if(debug === true) console.log(chalk.green('***** ' + extThemeAppPathAndName + '/' + 'app.js is created'))
	// 	if(options.detail === true) console.log(chalk.blue(theFile));

	// 	var theBuildCommand = 'sencha app build ' + options.build + senchaCmdOut;
	// 	if(debug === true) console.log(chalk.green('***** Running the Sencha Cmd: ' + theBuildCommand));
	// 	var output = './' + extThemeAppPathAndName;
	// 	var rc = execSync( theBuildCommand, { cwd: output, stdio: 'inherit' });
	// 	if(debug === true) console.log(chalk.green('***** Sencha Cmd: ' + theBuildCommand + ' is completed'));


	// 	cb();




	// });

};

module.exports = Angular2ExtJSWebpackPlugin;