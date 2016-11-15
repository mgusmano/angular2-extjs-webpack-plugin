"use strict";

module.exports = {
	createIndexHTML: function createIndexHTML(indexHtmlTitle, extThemeAppPathAndName, build, extThemeAppName, rootSelector) {
		return "\n<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<base href=\"/\">\n\t\t<title>" + indexHtmlTitle + "</title>\n\t\t<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n\t\t<meta charset=\"UTF-8\">\n\t\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=10, user-scalable=yes\">\n\t\t<script src=\"../" + extThemeAppPathAndName + "/Boot.js\"></script>\n\t\t<script src=\"../" + extThemeAppPathAndName + "/build/" + build + "/" + extThemeAppName + "/app.js\"></script>\n\t\t<link rel=\"stylesheet\" href=\"../" + extThemeAppPathAndName + "/misc.css\">\n\t\t<link rel=\"stylesheet\" href=\"../" + extThemeAppPathAndName + "/build/" + build + "/" + extThemeAppName + "/resources/" + extThemeAppName + "-all.css\">\n\t</head>\n\t<body>\n\t\t<" + rootSelector + ">Loading...</" + rootSelector + ">\n\t</body>\n</html>\n";
	},

	bootJS: "\n\tvar Ext = Ext || {};\n\tExt.Boot = Ext.Boot || (function (emptyFn) {\n\t\tvar _tags = (Ext.platformTags = {});\n\t\tvar Boot = {\n\t\t\tbrowserNames: {ie:'IE',firefox:'Firefox',safari:'Safari',chrome:'Chrome',edge:'Edge',chromeMobile:'ChromeMobile',chromeiOS:'ChromeiOS',other:'Other'},\n\t\t\tosNames: {ios:'iOS',android:'Android',mac:'MacOS',win:'Windows',linux:'Linux',chromeOS:'ChromeOS',other:'Other'},\n\t\t\tbrowserPrefixes: {ie:'MSIE ',edge:'Edge/',firefox:'Firefox/',chrome:'Chrome/',safari:'Version/',chromeMobile:'CrMo/',chromeiOS:'CriOS/'}\n\t\t};\n\t\treturn Boot;\n\t}(function () {}));\n\t",

	miscCSS: "\n\t\t.x-float-wrap > .x-mask { z-index: 3 !important; pointer-events: all; }\n\t\t.x-floated { z-index: 10000 !important; }\n\t"
};