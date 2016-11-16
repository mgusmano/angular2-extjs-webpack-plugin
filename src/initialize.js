const fs = require("fs");
const chalk = require('chalk');
const commandExists = require('command-exists');
const getIndexHTML = require('./artifacts').getIndexHTML;

module.exports = {

	Init: function(options, debug, cb) {
			module.exports.checkIfSenchaSetupGood(options, debug)
			.then(function() {
					module.exports.doIndexHTML(options, debug);
					cb();
			})
			// .catch(function(err) {
			// 		console.log('not cool');
			// });
	},

	checkIfSenchaSetupGood: function(options, debug) {
		return new Promise(function(resolve, reject){
			commandExists('sencha', function(err, commandExists) {
				if(!commandExists) {
					console.log(chalk.red('***** ERROR') + ' Sencha Cmd is not installed');
					console.log(chalk.red('***** ERROR') + ' Stop this run and install Sencha Cmd ');
					console.log(chalk.red('***** ERROR') + ' download from: ' + chalk.green('https://www.sencha.com/products/extjs/cmd-download '));
					reject('err');
				}
				else {
					if(debug === true) console.log(chalk.green('***** Sencha Cmd is installed'));
					try {
						var stats = fs.lstatSync(options.extFrameworkPath);
						if (stats.isDirectory()) {
							if(debug === true) console.log(chalk.green('***** Sencha Ext JS framework folder ' + options.extFrameworkPath + ' exists'));
							resolve(0);
						}
					}
					catch (e) {
						console.log(chalk.red('***** ERROR') + ' Sencha Ext JS framework path ' + options.extFrameworkPath + ' does NOT exist');
						console.log(chalk.red('***** ERROR') + ' Stop this run and install Sencha Ext JS ');
						console.log(chalk.red('***** ERROR') + ' download from: ' + chalk.green('https://www.sencha.com/products/extjs '));
						console.log(chalk.red('***** ERROR') + ' also set or check extFrameworkPath webpack plugin parameter ');
						reject(0);
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