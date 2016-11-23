'use strict';

var fs = require("fs");
var chalk = require('chalk');
var commandExists = require('command-exists');
var getIndexHTML = require('./artifacts').getIndexHTML;
var appJson = require('./artifacts').appJson;
var bootJS = require('./artifacts').bootJS;
var miscCSS = require('./artifacts').miscCSS;
var execSync = require('child_process').execSync;

module.exports = {

	Init: function Init(options, debug, cb) {
		module.exports.checkIfSenchaSetupGood(options, debug).then(function () {
				var extThemeAppPathAndName = options.extThemeAppPath + '/' + options.extThemeAppName;
				var output = '.';

				try {
					var stats = fs.lstatSync('./' + extThemeAppPathAndName);
					if (stats.isDirectory()) {
						if(debug === true) console.log(chalk.green('***** Ext JS theme project named ' + options.extThemeAppName + ' exists'))
					}
				}
				catch (e) {
					var theCreateCommand = 'sencha -sdk ' + options.extFrameworkPath + ' generate app -modern -starter=false ' + options.extThemeAppName + ' ./' + options.extThemeAppName + options.senchaCmdOut;
					if(debug === true) console.log(chalk.green('***** Running: ' + theCreateCommand));
					execSync( theCreateCommand, { cwd: output, stdio: 'inherit' });
					if(debug === true) console.log(chalk.green('***** Ext JS app named ' + options.extThemeAppName + ' is created'))

					fs.writeFileSync(extThemeAppPathAndName + "app.json", appJson); 
					if(debug === true) console.log(chalk.green('***** ' + extThemeAppPathAndName + 'app.json' + ' is created'))

					var output = './' + extThemeAppPathAndName;

					var theBuildCommand = 'sencha app build ' + 'testing' + options.senchaCmdOut;
					if (debug === true) console.log(chalk.green('***** Running: ' + theBuildCommand));
					var rc = execSync(theBuildCommand, { cwd: output, stdio: 'inherit' });
					if (debug === true) console.log(chalk.green('***** ' + theBuildCommand + ' is completed'));

					var theBuildCommand = 'sencha app build ' + 'production' + options.senchaCmdOut;
					if (debug === true) console.log(chalk.green('***** Running: ' + theBuildCommand));
					var rc = execSync(theBuildCommand, { cwd: output, stdio: 'inherit' });
					if (debug === true) console.log(chalk.green('***** ' + theBuildCommand + ' is completed'));

					if (!fs.existsSync(extThemeAppPathAndName + "/build/")){fs.mkdirSync(extThemeAppPathAndName + "/build/");}
					fs.writeFileSync(extThemeAppPathAndName + "/build/" + "boot.js", bootJS); 
					if(debug === true) console.log(chalk.green('***** ' + extThemeAppPathAndName + "/build/" + 'boot.js' + ' is created'))
					fs.writeFileSync(extThemeAppPathAndName + "/build/" + "misc.css", miscCSS); 
					if(debug === true) console.log(chalk.green('***** ' + extThemeAppPathAndName + "/build/" + 'misc.css' + ' is created'))
				}
//			module.exports.doIndexHTML(options, debug);
			cb();
		}).catch(function (err) {
			console.log(err);
		});
	},

	checkIfSenchaSetupGood: function(options, debug) {
		return new Promise(function(resolve, reject){
			commandExists('sencha', function(err, commandExists) {
				if(!commandExists) {
					console.log(chalk.red('***** ERROR') + ' Sencha Cmd is not installed');
					console.log(chalk.red('***** ERROR') + ' Stop this run and install Sencha Cmd ');
					console.log(chalk.red('***** ERROR') + ' download from: ' + chalk.green('https://www.sencha.com/products/extjs/cmd-download '));
					reject('');
				}
				else {
					if(debug === true) console.log(chalk.green('***** Sencha Cmd is installed'));
					try {
						var stats = fs.lstatSync(options.extFrameworkPath + '/.sencha');
						if (stats.isDirectory()) {
							if(debug === true) console.log(chalk.green('***** Sencha Ext JS framework folder ' + options.extFrameworkPath + ' exists'));
							resolve('');
						}
					}
					catch (e) {
						console.log(chalk.red('***** ERROR') + ' Path ' + options.extFrameworkPath + ' does NOT exist or is NOT a Sencha Ext JS framework folder');
						console.log(chalk.red('***** ERROR') + ' Stop this run and install Sencha Ext JS or configure a valid folder ');
						console.log(chalk.red('***** ERROR') + ' download Ext JS from: ' + chalk.green('https://www.sencha.com/products/extjs '));
						console.log(chalk.red('***** ERROR') + ' also set or check extFrameworkPath webpack plugin parameter ');
						reject('');
					}
				}
			});
		});
	},

	doIndexHTML: function(options, debug) {
		var extThemeAppPathAndName = options.extThemeAppPath + '/' + options.extThemeAppName;
		var indexHTMLPath = options.indexHtmlLocation + '/index.html';
		if(options.indexHtmlReplace === true) {
			if (!fs.existsSync(options.indexHtmlLocation)){
				fs.mkdirSync(options.indexHtmlLocation);
				if(debug === true) console.log(chalk.green('***** folder ' + options.indexHtmlLocation + ' is created'))
			}
			else {
				if(debug === true) console.log(chalk.green('***** folder ' + options.indexHtmlLocation + ' exists'))
			}
			var indexHTMLContents = getIndexHTML(options.indexHtmlTitle, extThemeAppPathAndName, options.build, options.extThemeAppName, options.rootSelector)
			if (fs.existsSync(indexHTMLPath)){
				var fileContents = fs.readFileSync(indexHTMLPath, 'utf8');
				if (fileContents === indexHTMLContents) {
					if(debug === true) console.log(chalk.green('***** file ' + indexHTMLPath + ' no changes'))
				}
				else {
					if(debug === true) console.log(chalk.green('***** file ' + indexHTMLPath + ' has changes'))
					fs.writeFileSync(indexHTMLPath, indexHTMLContents); 
					if(debug === true) console.log(chalk.green('***** file ' + indexHTMLPath + ' replaced'))
				}
			}
			else {
				if(debug === true) console.log(chalk.green('***** file ' + indexHTMLPath + ' does not exist'))
				fs.writeFileSync(indexHTMLPath, indexHTMLContents); 
				if(debug === true) console.log(chalk.green('***** file ' + indexHTMLPath + ' created'))
			}
		}
	}

}