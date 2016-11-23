"use strict";

module.exports = {

		getAppJson: function getAppJson() {
				return JSON.stringify({
						"name": "Theme",
						"version": "1.0.0.0",
						"indexHtmlPath": "index.html",
						"classpath": ["app"],
						"overrides": ["overrides"],
						"framework": "ext",
						"toolkit": "modern",
						"theme": "theme-material",
						"requires": ["calendar", "charts", "d3", "ux", "pivot", "pivot-d3", "font-awesome"],
						"fashion": {
								"inliner": {
										"enable": false
								}
						},
						"sass": {
								"namespace": "Theme",
								"generated": {
										"var": "sass/save.scss",
										"src": "sass/save"
								},
								"etc": ["sass/etc/all.scss"],
								"var": ["sass/var/all.scss", "sass/var"],
								"src": ["sass/src"]
						},
						"js": [{
								"path": "${framework.dir}/build/ext-modern-all-debug.js"
						}, {
								"path": "app.js",
								"bundle": true
						}],
						"css": [{
								"path": "${build.out.css.path}",
								"bundle": true,
								"exclude": ["fashion"]
						}],
						"loader": {
								"cache": false,
								"cacheParam": "_dc"
						},
						"production": {
								"output": {
										"appCache": {
												"enable": true,
												"path": "cache.appcache"
										}
								},
								"loader": {
										"cache": "${build.timestamp}"
								},
								"cache": {
										"enable": true
								},
								"compressor": {
										"type": "yui"
								}
						},
						"testing": {},
						"development": {
								"watch": {
										"delay": 250
								}
						},
						"bootstrap": {
								"base": "${app.dir}",

								"microloader": "bootstrap.js",
								"css": "bootstrap.css"
						},
						"output": {
								"base": "${workspace.build.dir}/${build.environment}/${app.name}",
								"appCache": {
										"enable": false
								}
						},
						"cache": {
								"enable": false,
								"deltas": true
						},
						"appCache": {
								"cache": ["index.html"],
								"network": ["*"],
								"fallback": []
						},
						"resources": [{
								"path": "resources",
								"output": "shared"
						}],
						"archivePath": "archive",
						"slicer": null,
						"ignore": ["(^|/)CVS(/?$|/.*?$)"],
						"id": "9cbb1487-acb8-4265-8440-1d31445a14b5"
				});
		},

		bootJS2: "var Ext = Ext || {};\nExt.Boot = Ext.Boot || (function (emptyFn) {\n\tvar _tags = (Ext.platformTags = {});\n\tvar Boot = {\n\t\tbrowserNames: {ie:'IE',firefox:'Firefox',safari:'Safari',chrome:'Chrome',edge:'Edge',chromeMobile:'ChromeMobile',chromeiOS:'ChromeiOS',other:'Other'},\n\t\tosNames: {ios:'iOS',android:'Android',mac:'MacOS',win:'Windows',linux:'Linux',chromeOS:'ChromeOS',other:'Other'},\n\t\tbrowserPrefixes: {ie:'MSIE ',edge:'Edge/',firefox:'Firefox/',chrome:'Chrome/',safari:'Version/',chromeMobile:'CrMo/',chromeiOS:'CriOS/'}\n\t};\n\treturn Boot;\n}(function () {}));\n",

		bootJS: "var Ext = Ext || {};\nExt.platformTags = {};\nExt.Boot = {\n\tbrowserNames: {ie:'IE',firefox:'Firefox',safari:'Safari',chrome:'Chrome',edge:'Edge',chromeMobile:'ChromeMobile',chromeiOS:'ChromeiOS',other:'Other'},\n\tosNames: {ios:'iOS',android:'Android',mac:'MacOS',win:'Windows',linux:'Linux',chromeOS:'ChromeOS',other:'Other'},\n\tbrowserPrefixes: {ie:'MSIE ',edge:'Edge/',firefox:'Firefox/',chrome:'Chrome/',safari:'Version/',chromeMobile:'CrMo/',chromeiOS:'CriOS/'}\n};\n",

		miscCSS: ".x-float-wrap > .x-mask { z-index: 3 !important; pointer-events: all; }\n.x-floated { z-index: 10000 !important; }\n",

		getIndexHTML: function getIndexHTML(indexHtmlTitle, extThemeAppPathAndName, build, extThemeAppName, rootSelector) {
				return "<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<base href=\"/\">\n\t\t<title>" + indexHtmlTitle + "</title>\n\t\t<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n\t\t<meta charset=\"UTF-8\">\n\t\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=10, user-scalable=yes\">\n\t\t<script src=\"build/Boot.js\"></script>\n\t\t<script src=\"build/" + build + "/" + extThemeAppName + "/app.js\"></script>\n\t\t<link rel=\"stylesheet\" href=\"build/misc.css\">\n\t\t<link rel=\"stylesheet\" href=\"build/" + build + "/" + extThemeAppName + "/resources/" + extThemeAppName + "-all.css\">\n\t</head>\n\t<body>\n\t\t<" + rootSelector + ">Loading...</" + rootSelector + ">\n<script type=\"text/javascript\" src=\"inline.js\"></script>\n<script type=\"text/javascript\" src=\"styles.bundle.js\"></script>\n<script type=\"text/javascript\" src=\"main.bundle.js\"></script>\n\t</body>\n</html>\n";
		},

		getIndexHTML2: function getIndexHTML2(indexHtmlTitle, extThemeAppPathAndName, build, extThemeAppName, rootSelector) {
				return "<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<base href=\"/\">\n\t\t<title>" + indexHtmlTitle + "</title>\n\t\t<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n\t\t<meta charset=\"UTF-8\">\n\t\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=10, user-scalable=yes\">\n\t\t<script src=\"../" + extThemeAppPathAndName + "/build/Boot.js\"></script>\n\t\t<script src=\"../" + extThemeAppPathAndName + "/build/" + build + "/" + extThemeAppName + "/app.js\"></script>\n\t\t<link rel=\"stylesheet\" href=\"../" + extThemeAppPathAndName + "/build/misc.css\">\n\t\t<link rel=\"stylesheet\" href=\"../" + extThemeAppPathAndName + "/build/" + build + "/" + extThemeAppName + "/resources/" + extThemeAppName + "-all.css\">\n\t</head>\n\t<body>\n\t\t<" + rootSelector + ">Loading...</" + rootSelector + ">\n\t</body>\n</html>\n";
		}

};