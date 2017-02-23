"use strict";
const acorn = require('acorn-object-spread/inject')(require('acorn-jsx'));
const traverse = require("ast-traverse");
const astring = require('astring');
var fs = require("fs");
var typescript = require("typescript");

module.exports = function extractFromNG2(moduleContext, ts, prefix='x-', debug, moduleResource) {
	var statements = [];
	let result = typescript.transpileModule(ts, { compilerOptions: { module: typescript.ModuleKind.CommonJS } });
	var js = result.outputText;
	try {
		const ast = acorn.parse(js, { ecmaVersion: 6, sourceType: 'module' });
		traverse(ast, {
			pre: function(node) {

				if (node.type === 'ExpressionStatement') {
					if (node.expression.type === 'CallExpression') {
						if (node.expression.callee.object != undefined) {
							if (node.expression.callee.object.name === 'Ext') {
								for (let attribute of node.expression.arguments[0].elements) {
									//statements.push( { xclass: attribute.value } );
									console.log('a.v: ' + attribute.value)
									statements.push( attribute.value );
								}
							}
						}
					}
				}

				if (node.type === 'Property') {
					if (node.key != undefined && node.key.name != undefined && node.value.value != undefined) {
						var template = '';
						if (node.key.name === 'template') {
							template = node.value.value;
						}
						// work to do here to handle all paths
						if (node.key.name === 'templateUrl') {
							var file = node.value.value;
							var prefix = file.substring(0, 2);
							if (prefix === './') {
									file = file.substring(2)
							}
							var fileAndPath = moduleContext + '/' + file;
							template = fs.readFileSync(fileAndPath, 'utf8').toString();
						}
						if (template != '') {
							var tab = RegExp("\\t", "g");
							var nl = RegExp("\\n", "g");
							var template = template.replace(tab,' ');
							var template = template.replace(nl,' ');
							console.log(chalk.red('t: ' + template))
							//fix this
							var w = '<x-'
							var searchpoint = 0;
							var found = 0;
							while (found != -1) {
								found = template.indexOf(w,searchpoint);
								if (found != -1) {
									searchpoint = found + 1;
									var end = template.indexOf(' ',found);
									var xtype = template.substring(found + 3, end);
									//statements.push( { xtype: xtype } );
									statements.push( 'widget.' + xtype );
								}
							}
						}
					}
				}

			},
		});

		return statements;

	} catch (e) {
		console.error('error parsing: ' + e);
	}

};
