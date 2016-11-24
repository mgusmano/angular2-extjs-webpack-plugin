"use strict";

module.exports = {

	getAppJson: function(options) { return JSON.stringify(
{
	"name": "${options.Theme}x",
	"version": "1.0.0.0",
	"indexHtmlPath": "index.html",
	"classpath": [
			"app"
	],
	"overrides": [
			"overrides"
	],
	"framework": "ext",
	"toolkit": "modern",
	"theme": "theme-material",
	"requires": [
		"calendar",
		"charts",
		"d3",
		"ux",
		"pivot",
		"pivot-d3",
		"font-awesome"
	],
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
			"etc": [
					"sass/etc/all.scss"
			],
			"var": [
					"sass/var/all.scss",
					"sass/var"
			],
			"src": [
					"sass/src"
			]
	},
	"js": [
			{
					"path": "${framework.dir}/build/ext-modern-all-debug.js"
			},
			{
					"path": "app.js",
					"bundle": true
			}
	],
	"css": [
			{
					"path": "${build.out.css.path}",
					"bundle": true,
					"exclude": ["fashion"]
			}
	],
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
	"testing": {
	},
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
			"cache": [
					"index.html"
			],
			"network": [
					"*"
			],
			"fallback": []
	},
	"resources": [
			{
					"path": "resources",
					"output": "shared"
			}
	],
	"archivePath": "archive",
	"slicer": null,
	"ignore": [
			"(^|/)CVS(/?$|/.*?$)"
	],
	"id": "9cbb1487-acb8-4265-8440-1d31445a14b5"
}
)},


	bootJS2: `var Ext = Ext || {};
Ext.Boot = Ext.Boot || (function (emptyFn) {
	var _tags = (Ext.platformTags = {});
	var Boot = {
		browserNames: {ie:'IE',firefox:'Firefox',safari:'Safari',chrome:'Chrome',edge:'Edge',chromeMobile:'ChromeMobile',chromeiOS:'ChromeiOS',other:'Other'},
		osNames: {ios:'iOS',android:'Android',mac:'MacOS',win:'Windows',linux:'Linux',chromeOS:'ChromeOS',other:'Other'},
		browserPrefixes: {ie:'MSIE ',edge:'Edge/',firefox:'Firefox/',chrome:'Chrome/',safari:'Version/',chromeMobile:'CrMo/',chromeiOS:'CriOS/'}
	};
	return Boot;
}(function () {}));
`,

	bootJS: `var Ext = Ext || {};
Ext.platformTags = {};
Ext.Boot = {
	browserNames: {ie:'IE',firefox:'Firefox',safari:'Safari',chrome:'Chrome',edge:'Edge',chromeMobile:'ChromeMobile',chromeiOS:'ChromeiOS',other:'Other'},
	osNames: {ios:'iOS',android:'Android',mac:'MacOS',win:'Windows',linux:'Linux',chromeOS:'ChromeOS',other:'Other'},
	browserPrefixes: {ie:'MSIE ',edge:'Edge/',firefox:'Firefox/',chrome:'Chrome/',safari:'Version/',chromeMobile:'CrMo/',chromeiOS:'CriOS/'}
};
`,

	miscCSS: `.x-float-wrap > .x-mask { z-index: 3 !important; pointer-events: all; }
.x-floated { z-index: 10000 !important; }
`,

	getIndexHTML: function(indexHtmlTitle, extThemeAppPathAndName, build, extThemeAppName, rootSelector) {
	return `<!DOCTYPE html>
<html>
	<head>
		<base href="/">
		<title>${indexHtmlTitle}</title>
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=10, user-scalable=yes">
		<script src="build/Boot.js"></script>
		<script src="build/${build}/${extThemeAppName}/app.js"></script>
		<link rel="stylesheet" href="build/misc.css">
		<link rel="stylesheet" href="build/${build}/${extThemeAppName}/resources/${extThemeAppName}-all.css">
	</head>
	<body>
		<${rootSelector}>Loading...</${rootSelector}>
<script type="text/javascript" src="inline.js"></script>
<script type="text/javascript" src="styles.bundle.js"></script>
<script type="text/javascript" src="main.bundle.js"></script>
	</body>
</html>
`
	},

	getIndexHTML2: function(indexHtmlTitle, extThemeAppPathAndName, build, extThemeAppName, rootSelector) {
	return `<!DOCTYPE html>
<html>
	<head>
		<base href="/">
		<title>${indexHtmlTitle}</title>
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=10, user-scalable=yes">
		<script src="../${extThemeAppPathAndName}/build/Boot.js"></script>
		<script src="../${extThemeAppPathAndName}/build/${build}/${extThemeAppName}/app.js"></script>
		<link rel="stylesheet" href="../${extThemeAppPathAndName}/build/misc.css">
		<link rel="stylesheet" href="../${extThemeAppPathAndName}/build/${build}/${extThemeAppName}/resources/${extThemeAppName}-all.css">
	</head>
	<body>
		<${rootSelector}>Loading...</${rootSelector}>
	</body>
</html>
`
	}

}
