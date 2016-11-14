"use strict";

module.exports = {
	bootJS: "\n\tvar Ext = Ext || {};\n\tExt.Boot = Ext.Boot || (function (emptyFn) {\n\t\tvar _tags = (Ext.platformTags = {});\n\t\tvar Boot = {\n\t\t\tbrowserNames: {ie:'IE',firefox:'Firefox',safari:'Safari',chrome:'Chrome',edge:'Edge',chromeMobile:'ChromeMobile',chromeiOS:'ChromeiOS',other:'Other'},\n\t\t\tosNames: {ios:'iOS',android:'Android',mac:'MacOS',win:'Windows',linux:'Linux',chromeOS:'ChromeOS',other:'Other'},\n\t\t\tbrowserPrefixes: {ie:'MSIE ',edge:'Edge/',firefox:'Firefox/',chrome:'Chrome/',safari:'Version/',chromeMobile:'CrMo/',chromeiOS:'CriOS/'}\n\t\t};\n\t\treturn Boot;\n\t}(function () {}));\n\t",
	miscCSS: "\n\t\t.x-float-wrap > .x-mask { z-index: 3 !important; pointer-events: all; }\n\t\t.x-floated { z-index: 10000 !important; }\n\t"
};