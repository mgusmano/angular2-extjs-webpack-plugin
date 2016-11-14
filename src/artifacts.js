"use strict";

module.exports = {
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
