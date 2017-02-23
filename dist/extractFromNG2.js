"use strict";

var acorn = require('acorn-object-spread/inject')(require('acorn-jsx'));
var traverse = require("ast-traverse");
var astring = require('astring');
var fs = require("fs");
var typescript = require("typescript");

module.exports = function extractFromNG2(moduleContext, ts) {
	var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'x-';
	var debug = arguments[3];
	var moduleResource = arguments[4];

	var statements = [];
	var result = typescript.transpileModule(ts, { compilerOptions: { module: typescript.ModuleKind.CommonJS } });
	var js = result.outputText;
	try {
		var ast = acorn.parse(js, { ecmaVersion: 6, sourceType: 'module' });
		traverse(ast, {
			pre: function pre(node) {

				if (node.type === 'ExpressionStatement') {
					if (node.expression.type === 'CallExpression') {
						if (node.expression.callee.object != undefined) {
							if (node.expression.callee.object.name === 'Ext') {
								var _iteratorNormalCompletion = true;
								var _didIteratorError = false;
								var _iteratorError = undefined;

								try {
									for (var _iterator = node.expression.arguments[0].elements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
										var attribute = _step.value;

										//statements.push( { xclass: attribute.value } );
										console.log('a.v: ' + attribute.value);
										statements.push(attribute.value);
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
								file = file.substring(2);
							}
							var fileAndPath = moduleContext + '/' + file;
							template = fs.readFileSync(fileAndPath, 'utf8').toString();
						}
						if (template != '') {
							var tab = RegExp("\\t", "g");
							var nl = RegExp("\\n", "g");
							var template = template.replace(tab, ' ');
							var template = template.replace(nl, ' ');
							console.log(chalk.red('t: ' + template));
							//fix this
							var w = '<x-';
							var searchpoint = 0;
							var found = 0;
							while (found != -1) {
								found = template.indexOf(w, searchpoint);
								if (found != -1) {
									searchpoint = found + 1;
									var end = template.indexOf(' ', found);
									var xtype = template.substring(found + 3, end);
									//statements.push( { xtype: xtype } );
									statements.push('widget.' + xtype);
								}
							}
						}
					}
				}
			}
		});

		return statements;
	} catch (e) {
		console.error('error parsing: ' + e);
	}
};