"use strict";

module.exports = {
	createIndexHTML: function(indexHtmlTitle, extThemeAppPathAndName, build, extThemeAppName, rootSelector) {
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
	},

	bootJS: `
	var Ext = Ext || {};
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

	miscCSS: `
		.x-float-wrap > .x-mask { z-index: 3 !important; pointer-events: all; }
		.x-floated { z-index: 10000 !important; }
	`
}
