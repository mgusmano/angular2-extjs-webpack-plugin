"use strict";

module.exports = {

	getIndexHTML: function getIndexHTML(indexHtmlTitle, extThemeAppPathAndName, build, extThemeAppName, rootSelector) {
		return "<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<base href=\"/\">\n\t\t<title>" + indexHtmlTitle + "</title>\n\t\t<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n\t\t<meta charset=\"UTF-8\">\n\t\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=10, user-scalable=yes\">\n\t\t<script src=\"../" + extThemeAppPathAndName + "/build/Boot.js\"></script>\n\t\t<script src=\"../" + extThemeAppPathAndName + "/build/" + build + "/" + extThemeAppName + "/app.js\"></script>\n\t\t<link rel=\"stylesheet\" href=\"../" + extThemeAppPathAndName + "/build/misc.css\">\n\t\t<link rel=\"stylesheet\" href=\"../" + extThemeAppPathAndName + "/build/" + build + "/" + extThemeAppName + "/resources/" + extThemeAppName + "-all.css\">\n\t</head>\n\t<body>\n\t\t<" + rootSelector + ">Loading...</" + rootSelector + ">\n\t</body>\n</html>\n";
	},

	bootJS2: "var Ext = Ext || {};\nExt.Boot = Ext.Boot || (function (emptyFn) {\n\tvar _tags = (Ext.platformTags = {});\n\tvar Boot = {\n\t\tbrowserNames: {ie:'IE',firefox:'Firefox',safari:'Safari',chrome:'Chrome',edge:'Edge',chromeMobile:'ChromeMobile',chromeiOS:'ChromeiOS',other:'Other'},\n\t\tosNames: {ios:'iOS',android:'Android',mac:'MacOS',win:'Windows',linux:'Linux',chromeOS:'ChromeOS',other:'Other'},\n\t\tbrowserPrefixes: {ie:'MSIE ',edge:'Edge/',firefox:'Firefox/',chrome:'Chrome/',safari:'Version/',chromeMobile:'CrMo/',chromeiOS:'CriOS/'}\n\t};\n\treturn Boot;\n}(function () {}));\n\t",

	bootJS: "var Ext = Ext || {};\nExt.platformTags = {};\nExt.Boot = {\n\tbrowserNames: {ie:'IE',firefox:'Firefox',safari:'Safari',chrome:'Chrome',edge:'Edge',chromeMobile:'ChromeMobile',chromeiOS:'ChromeiOS',other:'Other'},\n\tosNames: {ios:'iOS',android:'Android',mac:'MacOS',win:'Windows',linux:'Linux',chromeOS:'ChromeOS',other:'Other'},\n\tbrowserPrefixes: {ie:'MSIE ',edge:'Edge/',firefox:'Firefox/',chrome:'Chrome/',safari:'Version/',chromeMobile:'CrMo/',chromeiOS:'CriOS/'}\n};\n",

	miscCSS: ".x-float-wrap > .x-mask { z-index: 3 !important; pointer-events: all; }\n.x-floated { z-index: 10000 !important; }\n\t"
};