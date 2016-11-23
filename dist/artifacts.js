"use strict";

module.exports = {

	appJson: "{\n\tframework: \"ext\",\n\ttoolkit : \"modern\",\n\t\"theme\": \"theme-triton\",\n\t\"requires\": [\n\t\t\"font-awesome\",\n\t\t\"charts\",\n\t\t\"pivot\"\n\t],\n\toutput: {\n\t\tbase: '.',\n\t\tresources: {\n\t\t\tpath: './resources',\n\t\t\tshared: \"./resources\"\n\t\t}\n\t},\n\t\"id\": \"9cbb1487-acb8-4265-8440-1d31445a14b5\"\n}\n",

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