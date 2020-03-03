/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		// Test for IE <= 9 as proposed by Browserhacks
		// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
		// Tests for existence of standard globals is to allow style-loader 
		// to operate correctly into non-standard environments
		// @see https://github.com/webpack-contrib/style-loader/issues/177
		return window && document && document.all && !window.atob;
	}),
	getElement = (function(fn) {
		var memo = {};
		return function(selector) {
			if (typeof memo[selector] === "undefined") {
				memo[selector] = fn.call(this, selector);
			}
			return memo[selector]
		};
	})(function (styleTarget) {
		return document.querySelector(styleTarget)
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [],
	fixUrls = __webpack_require__(18);

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (typeof options.insertInto === "undefined") options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list, options);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list, options) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var styleTarget = getElement(options.insertInto)
	if (!styleTarget) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			styleTarget.insertBefore(styleElement, styleTarget.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			styleTarget.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			styleTarget.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		styleTarget.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	options.attrs.type = "text/css";

	attachTagAttrs(styleElement, options.attrs);
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	attachTagAttrs(linkElement, options.attrs);
	insertStyleElement(options, linkElement);
	return linkElement;
}

function attachTagAttrs(element, attrs) {
	Object.keys(attrs).forEach(function (key) {
		element.setAttribute(key, attrs[key]);
	});
}

function addStyle(obj, options) {
	var styleElement, update, remove, transformResult;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    transformResult = options.transform(obj.css);
	    
	    if (transformResult) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = transformResult;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css. 
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement, options);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/* If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
	and there is no publicPath defined then lets turn convertToAbsoluteUrls
	on by default.  Otherwise default to the convertToAbsoluteUrls option
	directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls){
		css = fixUrls(css);
	}

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_cropperjs_dist_cropper_css__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_cropperjs_dist_cropper_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_cropperjs_dist_cropper_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_cropperjs__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_cropperjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_cropperjs__);
__webpack_require__(3);



var SDK = __webpack_require__(22);
var sdk = new SDK(null, null, true); // 3rd argument true bypassing https requirement: not prod worthy

var imageURL, imageWidth, imageHeight, aspectRatio, x, y;
var fillWidth = false;
var image;
var cropper;
var options = {
	aspectRatio: aspectRatio,
	
	viewMode: 3,
	crop: onCrop,
	zoom: onZoom,
	cropend: onCropEnd,
	ready: function(e) {
		updateContent();
	}
};
var loadingFromSDK = false;

function debounce (func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

function paintSettings () {
	console.log("Updating UI elements");

	document.getElementById('text-input-id-0').value = imageURL;
	document.getElementById('hidden-input-id-0').value = x;
	document.getElementById('hidden-input-id-1').value = y;
	document.getElementById('input-01').value = imageWidth;
	document.getElementById('input-02').value = imageHeight;

	document.getElementById("checkbox-fillwidth").checked = fillWidth;

	document.getElementById('example-unique-id-122').setAttribute('checked', false);
	document.getElementById('example-unique-id-123').setAttribute('checked', false);
	document.getElementById('example-unique-id-124').setAttribute('checked', false);
	document.getElementById('example-unique-id-125').setAttribute('checked', false);
	document.getElementById('example-unique-id-126').setAttribute('checked', false);
	switch (aspectRatio) {
		case NaN:
			document.getElementById('example-unique-id-122').checked = true;
			break;
		case 1.77:
			document.getElementById('example-unique-id-123').checked = true;
			break;
		case 1.33:
			document.getElementById('example-unique-id-124').checked = true;
			break;
		case 1:
			document.getElementById('example-unique-id-125').checked = true;
			break;
		case 0.66:
			document.getElementById('example-unique-id-126').checked = true;
			break;
	}
}

function loadImage() {
	if (!loadingFromSDK) {
		imageURL = document.getElementById('text-input-id-0').value;
		x = 0;
		y = 0;
	}
	
	if (!imageURL) {
		document.getElementById("img-container").hidden = true;
		return;
	}
	document.getElementById("img-container").hidden = false;
	image.setAttribute('src', imageURL);
}

function paintCropper() {
	console.log("Loading cropper...");

	aspectRatio = parseFloat(document.querySelector('input[name="aspectRatio"]:checked').value);
	x = parseInt(document.getElementById('hidden-input-id-0').value);
	y = parseInt(document.getElementById('hidden-input-id-1').value);
	imageWidth = parseInt(document.getElementById('input-01').value);
	imageHeight = parseInt(document.getElementById('input-02').value);
	fillWidth = document.getElementById("checkbox-fillwidth").checked;

	if (!imageURL) {
		return;
	}

	options.aspectRatio = aspectRatio;
	if (cropper) cropper.destroy();
	
	if (loadingFromSDK) {
		var data = {
			"rotate": 0,
			"scaleX": 1,
			"scaleY": 1,
			"x": x,
			"y": y,
			"width": imageWidth,
			"height": imageHeight
		};

		loadingFromSDK = false;
		options.data = data;
	}

	cropper = new __WEBPACK_IMPORTED_MODULE_1_cropperjs___default.a(image, options);
	console.log(options);
}

function updateContent() {
	var imgData = cropper.getCroppedCanvas({
		imageSmoothingEnabled: false
	}).toDataURL();
	var html = '<img';
	if (fillWidth) html += ' style="width:100%;height:auto"';
	html += ' src="' + imgData + '" />';
	var data = {
		imageURL: imageURL,
		imageWidth: imageWidth,
		imageHeight: imageHeight,
		x: x,
		y: y,
		aspectRatio: aspectRatio,
		fillWidth: fillWidth
	};
	sdk.setContent(html);
	sdk.setData(data);

	console.log("Updating content...");
	console.log(data);
}

function onZoom(e) {
	console.log("Zoom: " + e.detail.ratio);
}

function onCropEnd(e) {
	updateContent();
}

function onCrop(e) {
	var data = e.detail;
	x = Math.round(data.x);
	y = Math.round(data.y);
	imageHeight = Math.round(data.height);
	imageWidth = Math.round(data.width);

	paintSettings();
}

function onInputChangeW(e) {
	imageWidth = parseInt(document.getElementById('input-01').value);
	var cropbox = cropper.getCropBoxData();
	var canvasData = cropper.getCanvasData();
	var ratio = canvasData.width / canvasData.naturalWidth;
	cropbox.width = imageWidth * ratio;
	cropper.setCropBoxData(cropbox);
	updateContent();
}

function onInputChangeH(e) {
	imageHeight = parseInt(document.getElementById('input-02').value);
	var cropbox = cropper.getCropBoxData();
	var canvasData = cropper.getCanvasData();
	var ratio = canvasData.width / canvasData.naturalWidth;
	cropbox.height = imageHeight * ratio;
	cropper.setCropBoxData(cropbox);
	updateContent();
}

function onFillWidthInput(e) {
	fillWidth = document.getElementById("checkbox-fillwidth").checked;
	updateContent();
}

function processSDKData(data) {
	console.log("Getting data from SDK:");
	console.log(data);

	imageURL = data.imageURL || '';
	imageWidth = data.imageWidth || 0;
	imageHeight = data.imageHeight || 0;
	x = data.x || 0;
	y = data.y || 0;
	aspectRatio = data.aspectRatio || NaN;
	fillWidth = data.fillWidth || false;
	document.getElementById("img-container").hidden = imageURL != '';

	loadingFromSDK = true;
	loadImage();
}

sdk.getData(processSDKData);

[...document.querySelectorAll('input[name="aspectRatio"]')].forEach((button) => {
	button.addEventListener('change', (e) => {
		var target = e.target || e.srcElement;
		aspectRatio = options.aspectRatio = parseFloat(target.value);
	
		console.log('Setting aspect ratio to ' + aspectRatio);
		cropper.setAspectRatio(aspectRatio);
		updateContent();
	});
});

document.getElementById('loadImage').onclick = function (e) {
	loadImage();
}

image = document.getElementById('image');
image.onload = function(e) {
	if (!loadingFromSDK) {
		imageWidth = e.naturalWidth;
		imageHeight = e.naturalHeight;
	}

	paintSettings();
	paintCropper();
};

document.getElementById('input-01').onchange = onInputChangeW;
document.getElementById('input-02').onchange = onInputChangeH;
document.getElementById("checkbox-fillwidth").onchange = onFillWidthInput;

var test_data = {
	imageURL: "https://fengyuanchen.github.io/cropperjs/images/picture.jpg",
	imageWidth: 18,
	imageHeight: 18,
	x: 790,
	y: 207,
	aspectRatio: 1,
	fillWidth: true
};

processSDKData(test_data);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(4);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../css-loader/index.js!./salesforce-lightning-design-system.css", function() {
			var newContent = require("!!../../../../css-loader/index.js!./salesforce-lightning-design-system.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(5);
exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "/*! Lightning Design System 2.5.2 */\n@charset \"UTF-8\";\n/*!\n * Copyright (c) 2015-present, Salesforce.com, Inc. - All rights reserved.\n * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:\n * - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.\n * - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.\n * - Neither the name of the Salesforce.com nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.\n * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n */\n@font-face {\n  font-family: 'Salesforce Sans';\n  src: url(" + escape(__webpack_require__(6)) + ") format(\"woff2\"), url(" + escape(__webpack_require__(7)) + ") format(\"woff\");\n  font-weight: 300; }\n\n@font-face {\n  font-family: 'Salesforce Sans';\n  src: url(" + escape(__webpack_require__(8)) + ") format(\"woff2\"), url(" + escape(__webpack_require__(9)) + ") format(\"woff\");\n  font-style: italic;\n  font-weight: 300; }\n\n@font-face {\n  font-family: 'Salesforce Sans';\n  src: url(" + escape(__webpack_require__(10)) + ") format(\"woff2\"), url(" + escape(__webpack_require__(11)) + ") format(\"woff\");\n  font-weight: 400; }\n\n@font-face {\n  font-family: 'Salesforce Sans';\n  src: url(" + escape(__webpack_require__(12)) + ") format(\"woff2\"), url(" + escape(__webpack_require__(13)) + ") format(\"woff\");\n  font-style: italic;\n  font-weight: 400; }\n\n@font-face {\n  font-family: 'Salesforce Sans';\n  src: url(" + escape(__webpack_require__(14)) + ") format(\"woff2\"), url(" + escape(__webpack_require__(15)) + ") format(\"woff\");\n  font-weight: 700; }\n\n@font-face {\n  font-family: 'Salesforce Sans';\n  src: url(" + escape(__webpack_require__(16)) + ") format(\"woff2\"), url(" + escape(__webpack_require__(17)) + ") format(\"woff\");\n  font-style: italic;\n  font-weight: 700; }\n\n/*! normalize.css v3.0.2 | MIT License | git.io/normalize */\nhtml {\n  font-family: sans-serif;\n  -ms-text-size-adjust: 100%;\n  -webkit-text-size-adjust: 100%; }\n\nbody {\n  margin: 0; }\n\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmain,\nmenu,\nnav,\nsection,\nsummary {\n  display: block; }\n\naudio,\ncanvas,\nprogress,\nvideo {\n  display: inline-block;\n  vertical-align: baseline; }\n\naudio:not([controls]) {\n  display: none;\n  height: 0; }\n\ntemplate {\n  display: none; }\n\na {\n  background-color: transparent; }\n\na:active,\na:hover {\n  outline: 0; }\n\nabbr[title] {\n  border-bottom: 1px dotted; }\n\nb,\nstrong {\n  font-weight: bold; }\n\ndfn {\n  font-style: italic; }\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0; }\n\nmark {\n  background: #ff0;\n  color: #000; }\n\nsmall {\n  font-size: 80%; }\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline; }\n\nsup {\n  top: -0.5em; }\n\nsub {\n  bottom: -0.25em; }\n\nimg {\n  border: 0; }\n\nsvg:not(:root) {\n  overflow: hidden; }\n\nfigure {\n  margin: 1em 40px; }\n\nhr {\n  -moz-box-sizing: content-box;\n  box-sizing: content-box;\n  height: 0; }\n\npre {\n  overflow: auto; }\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: monospace, monospace;\n  font-size: 1em; }\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  color: inherit;\n  font: inherit;\n  margin: 0; }\n\nbutton {\n  overflow: visible; }\n\nbutton,\nselect {\n  text-transform: none; }\n\nbutton,\nhtml input[type=\"button\"],\ninput[type=\"reset\"],\ninput[type=\"submit\"] {\n  -webkit-appearance: button;\n  cursor: pointer; }\n\nbutton[disabled],\nhtml input[disabled] {\n  cursor: default; }\n\nbutton::-moz-focus-inner,\ninput::-moz-focus-inner {\n  border: 0;\n  padding: 0; }\n\ninput {\n  line-height: normal; }\n\ninput[type=\"checkbox\"],\ninput[type=\"radio\"] {\n  box-sizing: border-box;\n  padding: 0; }\n\ninput[type=\"number\"]::-webkit-inner-spin-button,\ninput[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto; }\n\ninput[type=\"search\"] {\n  -webkit-appearance: textfield;\n  -moz-box-sizing: content-box;\n  -webkit-box-sizing: content-box;\n  box-sizing: content-box; }\n\ninput[type=\"search\"]::-webkit-search-cancel-button,\ninput[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none; }\n\nfieldset {\n  border: 1px solid #c0c0c0;\n  margin: 0 2px;\n  padding: 0.35em 0.625em 0.75em; }\n\nlegend {\n  border: 0;\n  padding: 0; }\n\ntextarea {\n  overflow: auto; }\n\noptgroup {\n  font-weight: bold; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n\ntd,\nth {\n  padding: 0; }\n\n*,\n*:before,\n*:after {\n  box-sizing: border-box; }\n\n:-ms-input-placeholder {\n  color: #706e6b;\n  font-weight: 400;\n  font-size: 0.8125rem; }\n\n::placeholder {\n  color: #706e6b;\n  font-weight: 400;\n  font-size: 0.8125rem; }\n\n::-moz-selection {\n  background: #d8edff;\n  text-shadow: none;\n  color: #3e3e3c; }\n\n::selection {\n  background: #d8edff;\n  text-shadow: none;\n  color: #3e3e3c; }\n\nhtml {\n  font-family: \"Salesforce Sans\", Arial, sans-serif;\n  font-size: 100%;\n  line-height: 1.5;\n  background: #fafaf9;\n  color: #3e3e3c;\n  -webkit-tap-highlight-color: transparent; }\n\nbody {\n  font-size: 0.8125rem;\n  background: transparent; }\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\np,\nol,\nul,\ndl,\nfieldset {\n  margin: 0;\n  padding: 0; }\n\ndd,\nfigure {\n  margin: 0; }\n\nabbr[title] {\n  text-decoration: none; }\n\nabbr[title],\nfieldset,\nhr {\n  border: 0; }\n\nhr {\n  padding: 0; }\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-weight: inherit;\n  font-size: 1em; }\n\nol,\nul {\n  list-style: none; }\n\na {\n  color: #0070d2;\n  text-decoration: none;\n  transition: color 0.1s linear; }\n\na:hover, a:focus {\n  text-decoration: underline;\n  color: #005fb2; }\n\na:active {\n  color: #005fb2; }\n\na,\nbutton {\n  cursor: pointer; }\n\nb,\nstrong,\ndfn {\n  font-weight: 700; }\n\nmark {\n  background-color: #fff03f;\n  color: #3e3e3c; }\n\nabbr[title] {\n  cursor: help; }\n\ninput[type=\"search\"] {\n  box-sizing: border-box; }\n\ntable {\n  width: 100%; }\n\ncaption,\nth,\ntd {\n  text-align: left; }\n\nhr {\n  display: block;\n  margin: 2rem 0;\n  border-top: 1px solid #dddbda;\n  height: 1px;\n  clear: both; }\n\naudio,\ncanvas,\niframe,\nimg,\nsvg,\nvideo {\n  vertical-align: middle; }\n\nimg {\n  max-width: 100%;\n  height: auto; }\n\n.slds-modal_form .slds-modal__header,\n.slds-modal_form .slds-modal__content:last-child,\n.slds-modal--form .slds-modal__header,\n.slds-modal--form .slds-modal__content:last-child {\n  border-radius: 0;\n  box-shadow: none; }\n\n.slds-modal_form .slds-modal__container,\n.slds-modal--form .slds-modal__container {\n  margin: 0;\n  padding: 0; }\n\n.slds-modal_form .slds-modal__header .slds-text-heading_medium,\n.slds-modal_form .slds-modal__header .slds-text-heading--medium,\n.slds-modal--form .slds-modal__header .slds-text-heading_medium,\n.slds-modal--form .slds-modal__header .slds-text-heading--medium {\n  line-height: 1.5; }\n\n.slds-modal_form .slds-modal__header .slds-button,\n.slds-modal--form .slds-modal__header .slds-button {\n  display: inline-block;\n  width: auto; }\n\n.slds-modal_form .slds-modal__header .slds-button:first-child,\n.slds-modal--form .slds-modal__header .slds-button:first-child {\n  float: left;\n  margin-right: 0.5rem; }\n\n.slds-modal_form .slds-modal__header .slds-button:first-child + .slds-button,\n.slds-modal--form .slds-modal__header .slds-button:first-child + .slds-button {\n  float: right;\n  margin-top: 0;\n  margin-left: 0.5rem; }\n\n.slds-action-overflow_touch,\n.slds-action-overflow--touch {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 9001; }\n\n.slds-action-overflow_touch__container,\n.slds-action-overflow--touch__container {\n  position: relative;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n      flex-direction: column;\n  -ms-flex-pack: end;\n      justify-content: flex-end;\n  height: 100%; }\n\n.slds-action-overflow_touch__content,\n.slds-action-overflow--touch__content {\n  padding-top: 33.33333333333333%;\n  overflow: hidden;\n  overflow-y: auto; }\n\n.slds-action-overflow_touch__body,\n.slds-action-overflow--touch__body {\n  position: relative;\n  top: 2rem;\n  background: white;\n  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.07); }\n\n.slds-action-overflow_touch__footer,\n.slds-action-overflow--touch__footer {\n  position: relative;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  border-top: 1px solid #dddbda;\n  padding: 0.75rem 1rem;\n  background-color: #f3f2f2;\n  box-shadow: 0 -2px 4px #fafaf9; }\n\n/**\n * @summary Create each activity timeline item in a list\n *\n * @selector .slds-timeline__media\n * @restrict .slds-media\n * @support dev-ready\n */\n.slds-timeline__media,\n.slds-media_timeline,\n.slds-media--timeline {\n  position: relative;\n  padding-bottom: 1.5rem; }\n\n.slds-timeline__media:before,\n.slds-media_timeline:before,\n.slds-media--timeline:before {\n  content: '';\n  background: #dddbda;\n  height: 100%;\n  width: 2px;\n  position: absolute;\n  left: 0.75rem;\n  top: 0;\n  bottom: 0;\n  margin-left: -1px;\n  z-index: -1; }\n\n.slds-timeline__media:before,\n.slds-media_timeline:before,\n.slds-media--timeline:before {\n  margin-left: 1px;\n  top: 2px; }\n\n/**\n * @selector .slds-timeline__title\n * @restrict .slds-timeline__media h3\n * @deprecated\n */\n.slds-timeline__title {\n  position: relative; }\n\n.slds-timeline__title-content {\n  position: relative;\n  top: -1px;\n  padding-right: 1rem;\n  background: white;\n  z-index: 2; }\n\n.slds-timeline__title:after {\n  position: absolute;\n  right: 0;\n  bottom: 0.5rem;\n  left: 0;\n  border-bottom: 1px dashed #dddbda;\n  content: ' ';\n  z-index: 1; }\n\n/**\n * @name call\n * @selector .slds-timeline__media_call\n * @restrict .slds-timeline__media\n */\n.slds-timeline__media_call:before,\n.slds-timeline__media--call:before {\n  background: #48c3cc; }\n\n/**\n * @name email\n * @selector .slds-timeline__media_email\n * @restrict .slds-timeline__media\n */\n.slds-timeline__media_email:before,\n.slds-timeline__media--email:before {\n  background: #95aec5; }\n\n/**\n * @name event\n * @selector .slds-timeline__media_event\n * @restrict .slds-timeline__media\n */\n.slds-timeline__media_event:before,\n.slds-timeline__media--event:before {\n  background: #eb7092; }\n\n/**\n * @name task\n * @selector .slds-timeline__media_task\n * @restrict .slds-timeline__media\n */\n.slds-timeline__media_task:before,\n.slds-timeline__media--task:before {\n  background: #4bc076; }\n\n/**\n * @summary Create each expandable activity timeline item in a list\n *\n * @name base\n * @selector .slds-timeline__item_expandable\n * @restrict .slds-timeline div\n * @variant\n */\n.slds-timeline__item_expandable {\n  position: relative;\n  padding-bottom: 1rem;\n  /**\n   * @summary Class to show and hide details\n   *\n   * @selector .slds-timeline__item_details\n   * @restrict .slds-timeline__item_expandable article\n   */\n  /**\n   * @selector .slds-is-open\n   * @restrict .slds-timeline__item_expandable\n   */ }\n\n.slds-timeline__item_expandable:before {\n  content: '';\n  background: #dddbda;\n  height: 100%;\n  width: 2px;\n  position: absolute;\n  left: 2.25rem;\n  top: 0;\n  bottom: 0;\n  margin-left: 1px; }\n\n.slds-timeline__item_expandable .slds-media__figure {\n  margin-right: 0.25rem;\n  z-index: 1; }\n\n.slds-timeline__item_expandable .slds-media__figure .slds-button_icon {\n  margin-right: 0.5rem; }\n\n.slds-timeline__item_expandable .slds-media__body {\n  padding: 0 0.25rem; }\n\n.slds-timeline__item_expandable .slds-checkbox {\n  margin-right: 0.25rem; }\n\n.slds-timeline__item_expandable .slds-timeline__actions_inline {\n  -ms-flex-flow: row nowrap;\n      flex-flow: row nowrap;\n  -ms-flex-align: center;\n      align-items: center;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  margin-left: 0.5rem; }\n\n.slds-timeline__item_expandable .slds-timeline__actions_inline .slds-timeline__date {\n  padding-right: 0.5rem;\n  margin-bottom: 0; }\n\n.slds-timeline__item_expandable .slds-timeline__item_details {\n  visibility: hidden;\n  opacity: 0;\n  height: 0;\n  padding: 0; }\n\n.slds-timeline__item_expandable.slds-is-open .slds-timeline__item_details {\n  visibility: visible;\n  opacity: 1;\n  height: auto;\n  padding: 1rem; }\n\n.slds-timeline__item_expandable.slds-is-open .slds-timeline__details-action-icon {\n  transform: rotate(0);\n  transform-origin: 45%; }\n\n/**\n * @selector .slds-timeline__item_call\n * @restrict .slds-timeline__item_expandable\n */\n.slds-timeline__item_call:before {\n  background: #48c3cc; }\n\n/**\n * @selector .slds-timeline__item_email\n * @restrict .slds-timeline__item_expandable\n */\n.slds-timeline__item_email:before {\n  background: #95aec5; }\n\n/**\n * @selector .slds-timeline__item_event\n * @restrict .slds-timeline__item_expandable\n */\n.slds-timeline__item_event:before {\n  background: #eb7092; }\n\n/**\n * @selector .slds-timeline__item_task\n * @restrict .slds-timeline__item_expandable\n */\n.slds-timeline__item_task:before {\n  background: #4bc076; }\n\n/*\n * @selector .slds-timeline__trigger\n * @restrict .slds-timeline__media_expandable div\n */\n.slds-timeline__trigger {\n  padding: 0.25rem; }\n\n.slds-timeline__trigger:hover {\n  background-color: #f4f6f9; }\n\n/**\n * Icon associated with timeline item\n *\n * @selector .slds-timeline__icon\n * @restrict .slds-timeline__media .slds-media__figure, .slds-timeline__media .slds-icon_container, .slds-timeline__item_expandable .slds-icon_container\n */\n.slds-timeline__icon {\n  border: 2px solid #fff; }\n\n/**\n * Container for date and action overflow on the right of a timeline item\n *\n * @selector .slds-timeline__actions\n * @restrict .slds-timeline__item div, .slds-timeline__trigger div\n * @notes This is directly inside the `.slds-media--reverse` > `.slds-media__figure`\n */\n.slds-timeline__actions {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-flow: column nowrap;\n      flex-flow: column nowrap;\n  -ms-flex-align: end;\n      align-items: flex-end; }\n\n/**\n * Styles the date inside `.slds-timeline__actions`\n *\n * @selector .slds-timeline__date\n * @restrict .slds-timeline__actions p\n */\n.slds-timeline__date {\n  margin-bottom: 0.25rem;\n  font-size: 0.75rem;\n  color: #706e6b; }\n\n/**\n * @summary Icon inside of actionable button within an expandable timeline item\n *\n * @selector .slds-timeline__details-action-icon\n * @restrict .slds-timeline__item_expandable svg\n */\n.slds-timeline__details-action-icon {\n  transform: rotate(-90deg); }\n\n/**\n * @summary Create badge component\n *\n * @name base\n * @selector .slds-badge\n * @restrict span\n * @variant\n */\n.slds-badge {\n  background-color: #ecebea;\n  padding: 0.25rem 0.5rem;\n  border-radius: 15rem;\n  font-size: 0.625rem;\n  line-height: normal;\n  text-transform: uppercase;\n  letter-spacing: 0.0625em;\n  color: #3e3e3c;\n  vertical-align: bottom;\n  white-space: nowrap; }\n\n.slds-badge + .slds-badge {\n  margin-left: 0.5rem; }\n\n.slds-badge:empty {\n  padding: 0; }\n\n.slds-badge .slds-icon_container {\n  vertical-align: middle; }\n\n/**\n * @summary Inverse badge component\n *\n * @name inverse\n * @selector .slds-badge_inverse\n * @restrict .slds-badge\n */\n.slds-badge_inverse {\n  background-color: #706e6b;\n  color: white; }\n\n/**\n * @summary Light badge with icon\n *\n * @name lightest\n * @selector .slds-badge_lightest\n * @restrict .slds-badge\n */\n.slds-badge_lightest {\n  border: 1px solid #dddbda;\n  background-color: white;\n  font-size: 0.75rem;\n  text-transform: none;\n  letter-spacing: normal; }\n\n/**\n * @summary Create breadcrumbs component\n *\n * @name base\n * @selector .slds-breadcrumb\n * @restrict ol\n * @support dev-ready\n * @variant\n */\n.slds-breadcrumb {\n  /**\n   * Item of the breadcrumb list\n   *\n   * @selector .slds-breadcrumb__item\n   * @restrict .slds-breadcrumb li\n   * @required\n   */ }\n\n.slds-breadcrumb .slds-list__item, .slds-breadcrumb__item {\n  position: relative; }\n\n.slds-breadcrumb .slds-list__item:before, .slds-breadcrumb__item:before {\n  content: '>';\n  position: absolute;\n  left: -0.25rem; }\n\n.slds-breadcrumb .slds-list__item > a, .slds-breadcrumb__item > a {\n  display: block;\n  padding: 0 0.5rem; }\n\n.slds-breadcrumb .slds-list__item > a:hover, .slds-breadcrumb__item > a:hover {\n  text-decoration: none; }\n\n.slds-breadcrumb .slds-list__item:first-child > a, .slds-breadcrumb__item:first-child > a {\n  padding-left: 0; }\n\n.slds-breadcrumb .slds-list__item:first-child:before, .slds-breadcrumb__item:first-child:before {\n  content: ''; }\n\n.slds-breadcrumb .slds-dropdown-trigger {\n  margin-right: 0.5rem; }\n\n/**\n * @summary Creates button group container\n *\n * @name base\n * @selector .slds-button-group\n * @restrict div\n * @variant\n */\n.slds-button-group,\n.slds-button-group-list {\n  display: -ms-inline-flexbox;\n  display: inline-flex; }\n\n.slds-button-group .slds-button,\n.slds-button-group-list .slds-button {\n  border-radius: 0;\n  border-width: 1px; }\n\n.slds-button-group .slds-button:focus,\n.slds-button-group-list .slds-button:focus {\n  z-index: 1; }\n\n.slds-button-group .slds-button + .slds-button,\n.slds-button-group .slds-button + .slds-button_last .slds-button,\n.slds-button-group .slds-button + .slds-button--last .slds-button,\n.slds-button-group-list li + li .slds-button {\n  margin-left: -1px; }\n\n.slds-button-group-list li:first-child .slds-button,\n.slds-button-group .slds-button:first-child {\n  border-radius: 0.25rem 0 0 0.25rem; }\n\n/**\n * These selectors must remain in long hand in order to zero out borders that\n * we don't want on last-child or :only-child wrapped buttons\n *\n * @selector .slds-button_last\n * @restrict .slds-button-group div, .slds-button-group-list div\n */\n.slds-button-group .slds-button:last-child,\n.slds-button-group-list li:last-child .slds-button,\n.slds-button-group .slds-button_last .slds-button,\n.slds-button-group .slds-button--last .slds-button,\n.slds-button-group .slds-button.slds-button_last,\n.slds-button-group .slds-button.slds-button--last,\n.slds-button-group .slds-button_last .slds-button:only-child,\n.slds-button-group .slds-button--last .slds-button:only-child,\n.slds-button-group .slds-button.slds-button_last,\n.slds-button-group .slds-button.slds-button--last {\n  border-radius: 0 0.25rem 0.25rem 0; }\n\n.slds-button-group .slds-button:only-child,\n.slds-button-group-list li:only-child .slds-button {\n  border-radius: 0.25rem; }\n\n.slds-button-group + .slds-button-group,\n.slds-button-group + .slds-button-group-list,\n.slds-button-group + .slds-button,\n.slds-button-group-list + .slds-button-group-list,\n.slds-button-group-list + .slds-button-group,\n.slds-button-group-list + .slds-button {\n  margin-left: 0.25rem; }\n\n/**\n * The base `.slds-button` looks like a plain text link. It removes all the\n * styling of the native button. It’s typically used to trigger a modal or\n * display a “like” link. All button variations are built by adding another\n * class to `.slds-button`.\n *\n * Add the `.slds-button_neutral` class to create a neutral button, which\n * has a white background and gray border.\n *\n * Use a neutral icon button is for buttons with an icon on the left or\n * right (not for stateful buttons). Add the `.slds-button_neutral` class\n * to `.slds-button`.\n *\n * The SVG inside receives the `.slds-button__icon` class. You can position\n * the icon on the right or the left using `.slds-button__icon_right` or\n * `.slds-button__icon_left` , which apply the correct amount of space\n * between the icon and the text.\n *\n * To create the brand button, add the `.slds-button_brand` class to\n * the `.slds-button` class.\n *\n * To create the destructive button, add the `.slds-button_destructive`\n * class to the `.slds-button` class.\n *\n * Use the inverse button on dark backgrounds. Add the `.slds-button_inverse`\n * class to the `.slds-button` class.\n *\n * @summary This neutralizes all the base styles making it look like a text link\n *\n * @name base\n * @selector .slds-button\n * @restrict button, a, span\n * @variant\n */\n.slds-button {\n  position: relative;\n  display: inline-block;\n  padding: 0;\n  background: transparent;\n  background-clip: border-box;\n  border: 1px solid transparent;\n  border-radius: 0.25rem;\n  line-height: 1.875rem;\n  text-decoration: none;\n  color: #0070d2;\n  -webkit-appearance: none;\n  white-space: normal;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none; }\n\n.slds-button:hover, .slds-button:focus, .slds-button:active, .slds-button:visited {\n  text-decoration: none; }\n\n.slds-button:hover, .slds-button:focus {\n  color: #005fb2; }\n\n.slds-button:focus {\n  outline: 0;\n  box-shadow: 0 0 3px #0070D2; }\n\n.slds-button:active {\n  color: #005fb2; }\n\n.slds-button[disabled] {\n  color: #dddbda; }\n\n.slds-button[disabled] * {\n  pointer-events: none; }\n\n.slds-button a {\n  color: currentColor; }\n\n.slds-button:hover .slds-button__icon, .slds-button:focus .slds-button__icon, .slds-button:active .slds-button__icon, .slds-button[disabled] .slds-button__icon {\n  fill: currentColor;\n  pointer-events: none; }\n\n.slds-button + .slds-button-group,\n.slds-button + .slds-button-group-list {\n  margin-left: 0.25rem; }\n\n.slds-button + .slds-button {\n  margin-left: 0.25rem; }\n\na.slds-button {\n  text-align: center; }\n\na.slds-button:focus {\n  outline: 0;\n  box-shadow: 0 0 3px #0070D2; }\n\na.slds-button--inverse:focus {\n  outline: none;\n  box-shadow: 0 0 3px #ecebea; }\n\n/**\n * Resets attributes of .slds-button back to the browser default\n *\n * @selector .slds-button_reset\n * @restrict button\n * @modifier\n */\n.slds-button_reset,\n.slds-button--reset {\n  font-size: inherit;\n  color: inherit;\n  line-height: inherit;\n  padding: 0;\n  background: transparent;\n  border: 0;\n  text-align: inherit; }\n\n/**\n * Creates the gray border with white background default style\n *\n * @selector .slds-button_neutral\n * @restrict .slds-button\n * @modifier\n * @group theme\n */\n.slds-button_neutral,\n.slds-button--neutral {\n  padding-left: 1rem;\n  padding-right: 1rem;\n  text-align: center;\n  vertical-align: middle;\n  border: 1px solid #dddbda;\n  transition: border 0.15s linear;\n  border-color: #dddbda;\n  background-color: white; }\n\n.slds-button_neutral:hover, .slds-button_neutral:focus,\n.slds-button--neutral:hover,\n.slds-button--neutral:focus {\n  background-color: #f4f6f9; }\n\n.slds-button_neutral:active,\n.slds-button--neutral:active {\n  background-color: #eef1f6; }\n\n.slds-button_neutral[disabled],\n.slds-button--neutral[disabled] {\n  background-color: white;\n  cursor: default; }\n\n/**\n * Creates the brand blue Salesforce style\n *\n * @selector .slds-button_brand\n * @restrict .slds-button\n * @modifier\n * @group theme\n */\n.slds-button_brand,\n.slds-button--brand {\n  padding-left: 1rem;\n  padding-right: 1rem;\n  text-align: center;\n  vertical-align: middle;\n  border: 1px solid #dddbda;\n  transition: border 0.15s linear;\n  background-color: #0070d2;\n  border-color: #0070d2;\n  color: white; }\n\n.slds-button_brand:link, .slds-button_brand:visited, .slds-button_brand:active,\n.slds-button--brand:link,\n.slds-button--brand:visited,\n.slds-button--brand:active {\n  color: white; }\n\n.slds-button_brand:hover, .slds-button_brand:focus,\n.slds-button--brand:hover,\n.slds-button--brand:focus {\n  background-color: #005fb2;\n  border-color: #005fb2;\n  color: white; }\n\n.slds-button_brand:active,\n.slds-button--brand:active {\n  background-color: #005fb2;\n  border-color: #005fb2; }\n\n.slds-button_brand[disabled],\n.slds-button--brand[disabled] {\n  background: #c9c7c5;\n  border-color: #c9c7c5;\n  color: white; }\n\n/**\n * Creates the inverse style for dark backgrounds\n *\n * @selector .slds-button_inverse\n * @restrict .slds-button\n * @modifier\n * @group theme\n */\n.slds-button_inverse,\n.slds-button--inverse {\n  padding-left: 1rem;\n  padding-right: 1rem;\n  text-align: center;\n  vertical-align: middle;\n  border: 1px solid #dddbda;\n  transition: border 0.15s linear;\n  background-color: transparent;\n  border-color: #dddbda; }\n\n.slds-button_inverse[disabled],\n.slds-button--inverse[disabled] {\n  background-color: transparent;\n  border-color: rgba(255, 255, 255, 0.15); }\n\n.slds-button_inverse, .slds-button_inverse:link, .slds-button_inverse:visited,\n.slds-button--inverse,\n.slds-button--inverse:link,\n.slds-button--inverse:visited,\n.slds-button_icon-border-inverse,\n.slds-button_icon-border-inverse:link,\n.slds-button_icon-border-inverse:visited,\n.slds-button--icon-border-inverse,\n.slds-button--icon-border-inverse:link,\n.slds-button--icon-border-inverse:visited {\n  color: #ecebea; }\n\n.slds-button_inverse:hover, .slds-button_inverse:focus, .slds-button_inverse:active,\n.slds-button--inverse:hover,\n.slds-button--inverse:focus,\n.slds-button--inverse:active,\n.slds-button_icon-border-inverse:hover,\n.slds-button_icon-border-inverse:focus,\n.slds-button_icon-border-inverse:active,\n.slds-button--icon-border-inverse:hover,\n.slds-button--icon-border-inverse:focus,\n.slds-button--icon-border-inverse:active {\n  color: #0070d2; }\n\n.slds-button_inverse:focus,\n.slds-button--inverse:focus,\n.slds-button_icon-border-inverse:focus,\n.slds-button--icon-border-inverse:focus {\n  outline: none;\n  box-shadow: 0 0 3px #ecebea; }\n\n.slds-button_inverse[disabled],\n.slds-button--inverse[disabled],\n.slds-button_icon-border-inverse[disabled],\n.slds-button--icon-border-inverse[disabled] {\n  color: rgba(255, 255, 255, 0.15); }\n\n/**\n * Creates a red button style\n *\n * @selector .slds-button_destructive\n * @restrict .slds-button\n * @group theme\n * @modifier\n */\n.slds-button_destructive,\n.slds-button--destructive {\n  padding-left: 1rem;\n  padding-right: 1rem;\n  text-align: center;\n  vertical-align: middle;\n  border: 1px solid #dddbda;\n  transition: border 0.15s linear;\n  background-color: #c23934;\n  border-color: #c23934;\n  color: white; }\n\n.slds-button_destructive:link, .slds-button_destructive:visited, .slds-button_destructive:active,\n.slds-button--destructive:link,\n.slds-button--destructive:visited,\n.slds-button--destructive:active {\n  color: white; }\n\n.slds-button_destructive:hover, .slds-button_destructive:focus,\n.slds-button--destructive:hover,\n.slds-button--destructive:focus {\n  background-color: #a61a14;\n  color: white; }\n\n.slds-button_destructive:active,\n.slds-button--destructive:active {\n  background-color: #870500;\n  border-color: #870500; }\n\n.slds-button_destructive[disabled],\n.slds-button--destructive[disabled] {\n  background: #e0e5ee;\n  border-color: transparent;\n  color: white; }\n\n/**\n * Creates a green button style\n *\n * @selector .slds-button_success\n * @restrict .slds-button\n * @group theme\n * @modifier\n */\n.slds-button_success,\n.slds-button--success {\n  padding-left: 1rem;\n  padding-right: 1rem;\n  text-align: center;\n  vertical-align: middle;\n  border: 1px solid #dddbda;\n  transition: border 0.15s linear;\n  background-color: #4bca81;\n  border-color: #4bca81;\n  color: #3e3e3c; }\n\n.slds-button_success:link, .slds-button_success:visited, .slds-button_success:active,\n.slds-button--success:link,\n.slds-button--success:visited,\n.slds-button--success:active {\n  color: #3e3e3c; }\n\n.slds-button_success:hover, .slds-button_success:focus,\n.slds-button--success:hover,\n.slds-button--success:focus {\n  background-color: #04844b;\n  border-color: #04844b;\n  color: white; }\n\n.slds-button_success:active,\n.slds-button--success:active {\n  background-color: #04844b;\n  border-color: #04844b; }\n\n/**\n * Creates a smaller button style\n *\n * @selector .slds-button_small\n * @restrict .slds-button\n * @deprecated\n */\n.slds-button_small,\n.slds-button--small {\n  line-height: 1.75rem;\n  min-height: 2rem; }\n\n/**\n * @selector .slds-button-space-left\n * @deprecated\n */\n.slds-button-space-left {\n  margin-left: 0.25rem; }\n\n.slds-button_hint,\n.slds-button--hint {\n  color: #b0adab; }\n\n.slds-button_hint:hover, .slds-button_hint:focus, .slds-button_hint:active,\n.slds-button--hint:hover,\n.slds-button--hint:focus,\n.slds-button--hint:active {\n  color: #0070d2; }\n\n.slds-hint-parent:hover .slds-button--hint, .slds-hint-parent:focus .slds-button--hint {\n  color: #0070d2; }\n\n/**\n * @summary Sizing for icon that sits inside button__icon\n * @selector .slds-button__icon\n * @restrict .slds-button svg\n */\n.slds-button__icon {\n  width: 0.875rem;\n  height: 0.875rem;\n  fill: currentColor;\n  /**\n   * @summary Large size button icon svg\n   * @selector .slds-button__icon_large\n   * @restrict .slds-button__icon\n   */\n  /**\n   * @summary Small size button icon svg\n   * @selector .slds-button__icon_small\n   * @restrict .slds-button__icon\n   */\n  /**\n   * @summary x-small size button icon svg\n   * @selector .slds-button__icon_x-small\n   * @restrict .slds-button__icon\n   */ }\n\n.slds-button__icon_large, .slds-button__icon--large {\n  width: 1.5rem;\n  height: 1.5rem; }\n\n.slds-button__icon_small, .slds-button__icon--small {\n  width: 0.75rem;\n  height: 0.75rem; }\n\n.slds-button__icon_x-small, .slds-button__icon--x-small {\n  width: 0.5rem;\n  height: 0.5rem; }\n\n/**\n * @summary Position of icon when sitting to the left side of the text when inside a button\n * @selector .slds-button__icon_left\n * @restrict .slds-button__icon, .slds-button__icon_stateful\n */\n.slds-button__icon_left,\n.slds-button__icon--left {\n  margin-right: 0.5rem; }\n\n/**\n * @summary Position of icon when sitting to the right side of the text when inside a button\n * @selector .slds-button__icon_right\n * @restrict .slds-button__icon, .slds-button__icon_stateful\n */\n.slds-button__icon_right,\n.slds-button__icon--right {\n  margin-left: 0.5rem; }\n\n/**\n * The stateful button requires the `.slds-button--neutral` class in addition to the `.slds-button` class.\n *\n * The stateful inverse button works just like the stateful button. It requires the `.slds-button--inverse` class in addition to the `.slds-button` class.\n *\n * It uses the class `.slds-not-selected` in its initial state. When the user activates the button, use JavaScript to toggle the class to `.slds-is-selected`. The button contains three spans with classes that hide or show the content of the spans based on the class on the button. Each span contains text and a corresponding icon. The SVG will have the `.slds-button__icon--stateful` class as well as the `.slds-button__icon--left` class setting the icon on the left.\n *\n * Stateful icons can be toggled on and off and retain their state. Like stateful buttons, the initial state is `.slds-not-selected`, and JavaScript is used to toggle it to `.slds-is-selected` when activated.\n *\n * #### Accessibility\n *\n * For accessibility, include the attribute `aria-live=\"assertive\"` on the button. The `aria-live=\"assertive\"` attribute means the value of the `<span>` inside the button will be spoken whenever it changes.\n *\n * @summary Initiates a stateful button\n *\n * @name stateful\n * @selector .slds-button_stateful\n * @restrict button, a, span\n * @variant\n */\n.slds-button_neutral.slds-is-selected,\n.slds-button--neutral.slds-is-selected {\n  border-color: transparent;\n  background-color: transparent; }\n\n.slds-button_neutral.slds-is-selected:hover:not([disabled]), .slds-button_neutral.slds-is-selected:focus:not([disabled]),\n.slds-button--neutral.slds-is-selected:hover:not([disabled]),\n.slds-button--neutral.slds-is-selected:focus:not([disabled]) {\n  border-color: #dddbda;\n  background-color: #f4f6f9; }\n\n.slds-button_neutral.slds-is-selected:active:not([disabled]),\n.slds-button--neutral.slds-is-selected:active:not([disabled]) {\n  background-color: #eef1f6; }\n\n.slds-button__icon_stateful,\n.slds-button__icon--stateful {\n  width: 0.75rem;\n  height: 0.75rem;\n  fill: currentColor; }\n\n.slds-button_inverse.slds-is-selected,\n.slds-button--inverse.slds-is-selected {\n  border-color: transparent; }\n\n/**\n * Default state of a stateful button\n *\n * @selector .slds-not-selected\n * @restrict .slds-button_stateful\n * @notes This class should be toggled with JavaScript\n * @modifier\n * @group interaction\n */\n.slds-not-selected .slds-text-selected {\n  display: none; }\n\n.slds-not-selected .slds-text-selected-focus {\n  display: none; }\n\n.slds-not-selected .slds-text-not-selected {\n  display: block; }\n\n/**\n * When button is selected and still has focus from click\n *\n * @selector .slds-is-selected-clicked\n * @restrict .slds-button_stateful\n * @notes This class should be toggled with JavaScript\n * @modifier\n * @group interaction\n */\n.slds-is-selected-clicked .slds-text-selected,\n.slds-is-selected[disabled] .slds-text-selected,\n.slds-is-selected[disabled]:hover .slds-text-selected,\n.slds-is-selected[disabled]:focus .slds-text-selected {\n  display: block; }\n\n.slds-is-selected-clicked .slds-text-selected-focus,\n.slds-is-selected[disabled] .slds-text-selected-focus,\n.slds-is-selected[disabled]:hover .slds-text-selected-focus,\n.slds-is-selected[disabled]:focus .slds-text-selected-focus {\n  display: none; }\n\n.slds-is-selected-clicked .slds-text-not-selected,\n.slds-is-selected[disabled] .slds-text-not-selected,\n.slds-is-selected[disabled]:hover .slds-text-not-selected,\n.slds-is-selected[disabled]:focus .slds-text-not-selected {\n  display: none; }\n\n/**\n * When button is pressed and selected\n *\n * @selector .slds-is-selected\n * @restrict .slds-button_stateful\n * @notes This class should be toggled with JavaScript\n * @modifier\n * @group interaction\n */\n.slds-is-selected .slds-text-not-selected {\n  display: none; }\n\n.slds-is-selected .slds-text-selected {\n  display: block; }\n\n.slds-is-selected .slds-text-selected-focus {\n  display: none; }\n\n.slds-is-selected:hover .slds-text-not-selected, .slds-is-selected:focus .slds-text-not-selected {\n  display: none; }\n\n.slds-is-selected:hover .slds-text-selected, .slds-is-selected:focus .slds-text-selected {\n  display: none; }\n\n.slds-is-selected:hover .slds-text-selected-focus, .slds-is-selected:focus .slds-text-selected-focus {\n  display: block; }\n\n.slds-button_icon-bare,\n.slds-button--icon-bare {\n  line-height: 1;\n  vertical-align: middle;\n  color: #706e6b; }\n\n/**\n * @summary Creates a button that looks like a plain icon\n *\n * @name base\n * @selector .slds-button_icon\n * @restrict button\n * @variant\n */\n.slds-button_icon,\n.slds-button--icon,\n.slds-button_icon-inverse,\n.slds-button--icon-inverse,\n.slds-button_icon-container,\n.slds-button--icon-container,\n.slds-button_icon-border,\n.slds-button--icon-border,\n.slds-button_icon-border-filled,\n.slds-button--icon-border-filled,\n.slds-button_icon-border-inverse,\n.slds-button--icon-border-inverse,\n.slds-button_icon-more,\n.slds-button--icon-more,\n.slds-button_icon-error,\n.slds-button--icon-error {\n  line-height: 1;\n  vertical-align: middle;\n  color: #706e6b; }\n\n/**\n * @summary Default width + height for button icon with containers\n * @selector .slds-button_icon-container\n * @restrict .slds-button_icon\n */\n.slds-button_icon-container,\n.slds-button--icon-container,\n.slds-button_icon-border,\n.slds-button--icon-border,\n.slds-button_icon-border-filled,\n.slds-button--icon-border-filled,\n.slds-button_icon-border-inverse,\n.slds-button--icon-border-inverse,\n.slds-button_icon-brand,\n.slds-button_icon-more,\n.slds-button--icon-more,\n.slds-button_icon-container-more,\n.slds-button--icon-container-more {\n  width: 2rem;\n  height: 2rem; }\n\n/**\n * @summary Transparent themed button icon - Button icon has a border with a transparent background\n * @selector .slds-button_icon-border\n * @restrict .slds-button_icon\n */\n.slds-button_icon-border-filled,\n.slds-button--icon-border-filled,\n.slds-button_icon-border,\n.slds-button--icon-border {\n  line-height: 1;\n  vertical-align: middle;\n  color: #706e6b;\n  border: 1px solid #dddbda;\n  transition: border 0.15s linear;\n  border-color: #dddbda; }\n\n.slds-button_icon-border-filled[disabled],\n.slds-button--icon-border-filled[disabled],\n.slds-button_icon-border[disabled],\n.slds-button--icon-border[disabled] {\n  color: #dddbda; }\n\n/**\n * @summary Button icon with border and transparent background, to be used on an inversed background\n * @selector .slds-button_icon-border-inverse\n * @restrict .slds-button_icon\n */\n.slds-button_icon-border-inverse,\n.slds-button--icon-border-inverse {\n  background-color: transparent;\n  border-color: #dddbda; }\n\n.slds-button_icon-border-inverse[disabled],\n.slds-button--icon-border-inverse[disabled] {\n  background-color: transparent;\n  border-color: rgba(255, 255, 255, 0.15); }\n\n/**\n * @summary Branded button icon - Button icon has a filled background with the brand color\n * @selector .slds-button_icon-brand\n * @restrict .slds-button_icon\n */\n.slds-button_icon-brand {\n  background-color: #0070d2;\n  border-color: #0070d2;\n  color: white; }\n\n.slds-button_icon-brand:link, .slds-button_icon-brand:visited, .slds-button_icon-brand:active {\n  color: white; }\n\n.slds-button_icon-brand:hover, .slds-button_icon-brand:focus {\n  background-color: #005fb2;\n  border-color: #005fb2;\n  color: white; }\n\n.slds-button_icon-brand:active {\n  background-color: #005fb2;\n  border-color: #005fb2; }\n\n.slds-button_icon-brand[disabled] {\n  background: #c9c7c5;\n  border-color: #c9c7c5;\n  color: white; }\n\n/**\n * @summary Neutral themed button icon - Button icon has a border with a filled background\n * @selector .slds-button_icon-border-filled\n * @restrict .slds-button_icon\n */\n.slds-button_icon-border-filled,\n.slds-button--icon-border-filled {\n  background-color: white; }\n\n.slds-button_icon-border-filled[disabled],\n.slds-button--icon-border-filled[disabled] {\n  border-color: #dddbda;\n  background-color: white; }\n\n/**\n * @summary Bare button icon with no border or background, to be used on an inversed background\n * @selector .slds-button_icon-inverse\n * @restrict .slds-button_icon\n */\n.slds-button_icon-inverse,\n.slds-button--icon-inverse,\n.slds-button_icon-border-inverse,\n.slds-button--icon-border-inverse {\n  color: white; }\n\n.slds-button_icon-inverse:hover, .slds-button_icon-inverse:focus,\n.slds-button--icon-inverse:hover,\n.slds-button--icon-inverse:focus,\n.slds-button_icon-border-inverse:hover,\n.slds-button_icon-border-inverse:focus,\n.slds-button--icon-border-inverse:hover,\n.slds-button--icon-border-inverse:focus {\n  color: rgba(255, 255, 255, 0.75); }\n\n.slds-button_icon-inverse:focus,\n.slds-button--icon-inverse:focus,\n.slds-button_icon-border-inverse:focus,\n.slds-button--icon-border-inverse:focus {\n  outline: none;\n  box-shadow: 0 0 3px #ecebea; }\n\n.slds-button_icon-inverse:active,\n.slds-button--icon-inverse:active,\n.slds-button_icon-border-inverse:active,\n.slds-button--icon-border-inverse:active {\n  color: rgba(255, 255, 255, 0.5); }\n\n.slds-button_icon-inverse[disabled],\n.slds-button--icon-inverse[disabled],\n.slds-button_icon-border-inverse[disabled],\n.slds-button--icon-border-inverse[disabled] {\n  color: rgba(255, 255, 255, 0.15); }\n\n/**\n * @summary Error state - Typically used in conjunction with an error toolip\n * @selector .slds-button_icon-error\n * @restrict .slds-button_icon\n */\n.slds-button_icon-error, .slds-button_icon-error:hover, .slds-button_icon-error:active, .slds-button_icon-error:focus,\n.slds-button--icon-error,\n.slds-button--icon-error:hover,\n.slds-button--icon-error:active,\n.slds-button--icon-error:focus {\n  color: #c23934; }\n\n/**\n * @summary Changes a button icon container to be 24x24px\n * @name small\n * @selector .slds-button_icon-small\n * @restrict .slds-button_icon\n * @group size\n */\n.slds-button_icon-small,\n.slds-button--icon-small {\n  width: 1.5rem;\n  height: 1.5rem; }\n\n/**\n * @summary Changes a button icon container to be 20x20px\n * @name x-small\n * @selector .slds-button_icon-x-small\n * @restrict .slds-button_icon\n * @group size\n */\n.slds-button_icon-x-small,\n.slds-button--icon-x-small {\n  width: 1.25rem;\n  height: 1.25rem;\n  line-height: 1; }\n\n.slds-button_icon-x-small .slds-button__icon,\n.slds-button--icon-x-small .slds-button__icon {\n  width: 0.75rem;\n  height: 0.75rem; }\n\n/**\n * @summary Changes a button icon container to be 16x16px\n * @name xx-small\n * @selector .slds-button_icon-xx-small\n * @restrict .slds-button_icon\n * @group size\n */\n.slds-button_icon-xx-small,\n.slds-button--icon-xx-small {\n  width: 1rem;\n  height: 1rem;\n  line-height: 1; }\n\n.slds-button_icon-xx-small .slds-button__icon,\n.slds-button--icon-xx-small .slds-button__icon {\n  width: 0.5rem;\n  height: 0.5rem; }\n\n/**\n * @summary Creates a button menu icon container that has borders and a filled background\n * @selector .slds-button_icon-more\n * @restrict .slds-button_icon\n */\n.slds-button_icon-more,\n.slds-button--icon-more {\n  width: auto;\n  line-height: 1.875rem;\n  padding: 0 0.5rem;\n  background-color: white;\n  border-color: #dddbda;\n  color: #706e6b; }\n\n.slds-button_icon-more:hover .slds-button__icon, .slds-button_icon-more:focus .slds-button__icon,\n.slds-button--icon-more:hover .slds-button__icon,\n.slds-button--icon-more:focus .slds-button__icon {\n  fill: #0070d2; }\n\n.slds-button_icon-more:active .slds-button__icon,\n.slds-button--icon-more:active .slds-button__icon {\n  fill: #005fb2; }\n\n.slds-button_icon-more[disabled],\n.slds-button--icon-more[disabled] {\n  cursor: default; }\n\n.slds-button_icon-more[disabled] .slds-button__icon,\n.slds-button--icon-more[disabled] .slds-button__icon {\n  fill: #dddbda; }\n\n/**\n * @summary Creates a button menu icon container that has no borders\n * @selector .slds-button_icon-container-more\n * @restrict .slds-button_icon\n */\n.slds-button_icon-container-more,\n.slds-button--icon-container-more {\n  width: auto;\n  line-height: 1.875rem;\n  padding: 0 0.5rem;\n  vertical-align: middle; }\n\n/**\n * @summary A parent class must be put on anything that contains a .slds-button__icon_hint so that the child reacts when the parent is hovered.\n * @selector .slds-button__icon_hint\n * @restrict .slds-button_icon .slds-button__icon\n */\n.slds-button__icon_hint,\n.slds-button__icon--hint {\n  fill: #b0adab; }\n\n/**\n * @summary A parent class must be put on anything that contains a .slds-button__icon_inverse-hint so that the child reacts when the parent is hovered. This is for a dark background.\n * @selector .slds-button__icon_inverse-hint\n * @restrict .slds-button_icon .slds-button__icon\n */\n.slds-button__icon_inverse-hint,\n.slds-button__icon--inverse-hint {\n  fill: rgba(255, 255, 255, 0.5); }\n\n.slds-hint-parent .slds-button_icon-border-inverse,\n.slds-hint-parent .slds-button--icon-border-inverse {\n  border-color: rgba(255, 255, 255, 0.5); }\n\n.slds-hint-parent .slds-button_icon-border-inverse:focus,\n.slds-hint-parent .slds-button--icon-border-inverse:focus {\n  border-color: rgba(255, 255, 255, 0.75); }\n\n.slds-hint-parent:hover .slds-button_icon-border-inverse,\n.slds-hint-parent:hover .slds-button--icon-border-inverse, .slds-hint-parent:focus .slds-button_icon-border-inverse,\n.slds-hint-parent:focus .slds-button--icon-border-inverse {\n  border-color: rgba(255, 255, 255, 0.75); }\n\n.slds-hint-parent:hover .slds-button__icon_hint,\n.slds-hint-parent:hover .slds-button__icon--hint, .slds-hint-parent:focus .slds-button__icon_hint,\n.slds-hint-parent:focus .slds-button__icon--hint {\n  fill: #706e6b; }\n\n.slds-hint-parent:hover .slds-button__icon_inverse-hint,\n.slds-hint-parent:hover .slds-button__icon--inverse-hint, .slds-hint-parent:focus .slds-button__icon_inverse-hint,\n.slds-hint-parent:focus .slds-button__icon--inverse-hint {\n  fill: rgba(255, 255, 255, 0.75); }\n\n.slds-hint-parent:hover .slds-button:disabled .slds-button__icon_hint,\n.slds-hint-parent:hover .slds-button:disabled .slds-button__icon--hint, .slds-hint-parent:focus .slds-button:disabled .slds-button__icon_hint,\n.slds-hint-parent:focus .slds-button:disabled .slds-button__icon--hint {\n  fill: currentColor; }\n\n/**\n * @summary Creates a brand button icon\n *\n * @name brand\n * @selector .slds-button_icon-brand\n * @restrict button\n * @variant\n */\n/**\n * The stateful button requires the `.slds-button--icon-border` class in addition to the `.slds-button` class.\n *\n * The stateful inverse button works just like the stateful button. It requires the `.slds-button--icon-border-inverse` class in addition to the `.slds-button` class.\n *\n * Stateful icons can be toggled on and off and retain their state. JavaScript is used to add the `.slds-is-selected` class to the button when activated.\n *\n * #### Accessibility\n *\n * For accessibility, implement the [ARIA Toggle Button](http://w3c.github.io/aria-practices/#button) concept.\n * - Similar to a mute button, the button represents a pressed or unpressed state.\n * - Button text doesn't change per state\n * - `aria-pressed` is set to `true` or `false`, depending its state\n *\n * @summary Stateful Button Icon\n * @name stateful\n * @selector .slds-is-selected\n * @restrict .slds-button_icon\n * @variant\n */\n.slds-button_icon-container.slds-is-selected,\n.slds-button--icon-container.slds-is-selected,\n.slds-button_icon-border.slds-is-selected,\n.slds-button--icon-border.slds-is-selected,\n.slds-button_icon-border-filled.slds-is-selected {\n  background-color: #0070d2;\n  border-color: #0070d2;\n  color: white; }\n\n.slds-button_icon-container.slds-is-selected:link, .slds-button_icon-container.slds-is-selected:visited, .slds-button_icon-container.slds-is-selected:active,\n.slds-button--icon-container.slds-is-selected:link,\n.slds-button--icon-container.slds-is-selected:visited,\n.slds-button--icon-container.slds-is-selected:active,\n.slds-button_icon-border.slds-is-selected:link,\n.slds-button_icon-border.slds-is-selected:visited,\n.slds-button_icon-border.slds-is-selected:active,\n.slds-button--icon-border.slds-is-selected:link,\n.slds-button--icon-border.slds-is-selected:visited,\n.slds-button--icon-border.slds-is-selected:active,\n.slds-button_icon-border-filled.slds-is-selected:link,\n.slds-button_icon-border-filled.slds-is-selected:visited,\n.slds-button_icon-border-filled.slds-is-selected:active {\n  color: white; }\n\n.slds-button_icon-container.slds-is-selected:hover, .slds-button_icon-container.slds-is-selected:focus,\n.slds-button--icon-container.slds-is-selected:hover,\n.slds-button--icon-container.slds-is-selected:focus,\n.slds-button_icon-border.slds-is-selected:hover,\n.slds-button_icon-border.slds-is-selected:focus,\n.slds-button--icon-border.slds-is-selected:hover,\n.slds-button--icon-border.slds-is-selected:focus,\n.slds-button_icon-border-filled.slds-is-selected:hover,\n.slds-button_icon-border-filled.slds-is-selected:focus {\n  background-color: #005fb2;\n  border-color: #005fb2;\n  color: white; }\n\n.slds-button_icon-container.slds-is-selected:active,\n.slds-button--icon-container.slds-is-selected:active,\n.slds-button_icon-border.slds-is-selected:active,\n.slds-button--icon-border.slds-is-selected:active,\n.slds-button_icon-border-filled.slds-is-selected:active {\n  background-color: #005fb2;\n  border-color: #005fb2; }\n\n.slds-button_icon-container.slds-is-selected .slds-button__icon,\n.slds-button--icon-container.slds-is-selected .slds-button__icon,\n.slds-button_icon-border.slds-is-selected .slds-button__icon,\n.slds-button--icon-border.slds-is-selected .slds-button__icon,\n.slds-button_icon-border-filled.slds-is-selected .slds-button__icon {\n  fill: white; }\n\n.slds-button_icon-container.slds-is-selected:hover .slds-button__icon, .slds-button_icon-container.slds-is-selected:focus .slds-button__icon,\n.slds-button--icon-container.slds-is-selected:hover .slds-button__icon,\n.slds-button--icon-container.slds-is-selected:focus .slds-button__icon,\n.slds-button_icon-border.slds-is-selected:hover .slds-button__icon,\n.slds-button_icon-border.slds-is-selected:focus .slds-button__icon,\n.slds-button--icon-border.slds-is-selected:hover .slds-button__icon,\n.slds-button--icon-border.slds-is-selected:focus .slds-button__icon,\n.slds-button_icon-border-filled.slds-is-selected:hover .slds-button__icon,\n.slds-button_icon-border-filled.slds-is-selected:focus .slds-button__icon {\n  fill: white; }\n\n/**\n * The base variant is the fully featured color picker, with a direct text\n * input, and a button-triggered popover, which has tabs with both a list\n * of predefined color options (swatches), as well as an interactive tool\n * for custom color configuration.\n *\n * @summary Fully featured color picker, with swatches and a custom color config\n *\n * @variant\n * @name base\n * @selector .slds-color-picker\n * @restrict div\n */\n.slds-color-picker {\n  position: relative; }\n\n.slds-color-picker .slds-form-error {\n  padding-top: 0.5rem;\n  color: #c23934;\n  font-size: 0.75rem; }\n\n/**\n * @summary 'Summary' element for color selection.\n *\n * @selector .slds-color-picker__summary\n * @restrict .slds-color-picker > div\n */\n/**\n * @summary Label for summary input\n *\n * @selector .slds-color-picker__summary-label\n * @restrict .slds-color-picker__summary > label\n */\n.slds-color-picker__summary-label {\n  display: block; }\n\n/**\n * @summary Button that toggles the Color Picker Selector\n *\n * @selector .slds-color-picker__button\n * @restrict .slds-color-picker__summary .slds-button\n */\n.slds-color-picker__summary-button {\n  vertical-align: top;\n  padding: 0.3rem 0.5rem;\n  line-height: 1;\n  background: white;\n  margin-right: 0.25rem; }\n\n/**\n * @summary Input field for summary UI\n *\n * @selector .slds-color-picker__summary-input\n * @restrict .slds-color-picker__summary > div\n */\n.slds-color-picker__summary-input {\n  display: inline-block; }\n\n.slds-color-picker__summary-input .slds-input {\n  width: 6rem; }\n\n/**\n * @summary The selector subcomponent. Extends upon a .slds-popover\n *\n * @selector .slds-color-picker__selector\n * @restrict .slds-color-picker div, .slds-color-picker section\n */\n.slds-color-picker__selector {\n  margin-top: 0.5rem; }\n\n.slds-color-picker__selector.slds-popover {\n  width: 14rem; }\n\n.slds-color-picker__selector .slds-popover__footer {\n  background: #f3f2f2; }\n\n.slds-color-picker__selector .slds-tabs_default__item {\n  text-transform: uppercase;\n  letter-spacing: 0.05rem; }\n\n.slds-color-picker__selector .slds-tabs_default__content {\n  padding: 0.5rem 0 0.25rem; }\n\n/**\n * @summary Swatch container\n *\n * @selector .slds-color-picker__swatches\n * @restrict .slds-color-picker__selector ul\n */\n.slds-color-picker__swatches {\n  font-size: 0; }\n\n.slds-color-picker__swatches.slds-swatch {\n  cursor: pointer; }\n\n/**\n * @summary Color Picker swatch\n *\n * @selector .slds-color-picker__swatch\n * @restrict .slds-color-picker__swatches li\n */\n.slds-color-picker__swatch {\n  display: inline-block;\n  margin: 0.25rem; }\n\n.slds-color-picker__swatch-trigger {\n  display: inline-block; }\n\n.slds-color-picker__swatch-trigger:focus, .slds-color-picker__swatch-trigger:active {\n  outline: none;\n  box-shadow: 0 0 3px #0070D2;\n  border-radius: 0.25rem; }\n\n/**\n * @summary Custom picker selection container\n *\n * @selector .slds-color-picker__custom\n * @restrict .slds-color-picker__selector div\n */\n.slds-color-picker__custom {\n  padding: 0.25rem 0; }\n\n/**\n * @summary Custom picker range element\n *\n * @selector .slds-color-picker__custom-range\n * @restrict .slds-color-picker__custom div\n */\n.slds-color-picker__custom-range {\n  position: relative;\n  margin-bottom: 0.25rem;\n  height: 5rem;\n  border: 1px solid #dddbda;\n  border-radius: 0.25rem;\n  overflow: hidden; }\n\n.slds-color-picker__custom-range:before {\n  content: '';\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  background: linear-gradient(to top, black, rgba(0, 0, 0, 0.9) 1%, transparent 99%), linear-gradient(to right, white 1%, rgba(255, 255, 255, 0)); }\n\n/**\n * @summary\n *\n * @selector .slds-color-picker__range-indicator\n * @restrict .slds-color-picker__custom-range > a\n */\n.slds-color-picker__range-indicator {\n  transform: translate3d(-0.375rem, 0.375rem, 0);\n  cursor: pointer;\n  position: absolute;\n  height: 0.75rem;\n  width: 0.75rem;\n  border: 2px solid white;\n  border-radius: 50%;\n  box-shadow: 0 2px 4px 4px rgba(0, 0, 0, 0.16), inset 0 2px 4px 4px rgba(0, 0, 0, 0.16); }\n\n.slds-color-picker__range-indicator:focus {\n  outline: none;\n  box-shadow: 0 0 3px #0070D2; }\n\n/**\n * @summary Container element for the hue slider and preview swatch\n *\n * @selector .slds-color-picker__hue-and-preview\n * @restrict .slds-color-picker__custom div\n */\n.slds-color-picker__hue-and-preview {\n  display: -ms-flexbox;\n  display: flex; }\n\n.slds-color-picker__hue-and-preview .slds-swatch {\n  margin-left: 0.25rem;\n  height: 1.5rem;\n  width: 1.5rem;\n  border: 1px solid #dddbda;\n  border-radius: 0.25rem; }\n\n/**\n * @summary The slide input that controls the hue\n *\n * @selector .slds-color-picker__hue-slider\n * @restrict .slds-color-picker__hue-and-preview input\n */\n.slds-color-picker__hue-slider {\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n  -ms-flex: 1;\n      flex: 1;\n  padding: 0;\n  height: 1.5rem;\n  width: 100%;\n  border: 1px solid #dddbda;\n  border-radius: 0.25rem;\n  background: linear-gradient(to right, red, #ff1500, #ff2b00, #ff4000, #ff5500, #ff6a00, #ff8000, #ff9500, #ffaa00, #ffbf00, #ffd500, #ffea00, yellow, #eaff00, #d5ff00, #bfff00, #aaff00, #95ff00, #80ff00, #6aff00, #55ff00, #40ff00, #2bff00, #15ff00, lime, #00ff15, #00ff2b, #00ff40, #00ff55, #00ff6a, #00ff80, #00ff95, #00ffaa, #00ffbf, #00ffd5, #00ffea, cyan, #00eaff, #00d5ff, deepskyblue, #00aaff, #0095ff, #0080ff, #006aff, #0055ff, #0040ff, #002bff, #0015ff, blue, #1500ff, #2b00ff, #4000ff, #5500ff, #6a00ff, #8000ff, #9500ff, #aa00ff, #bf00ff, #d500ff, #ea00ff, magenta, #ff00ea, #ff00d5, #ff00bf, #ff00aa, #ff0095, #ff0080, #ff006a, #ff0055, #ff0040, #ff002b, #ff0015); }\n\n.slds-color-picker__hue-slider::-webkit-slider-thumb {\n  -webkit-appearance: none;\n          appearance: none;\n  cursor: pointer;\n  height: calc(1.5rem - (1px * 2));\n  width: 0.375rem;\n  border: 1px solid #514f4d;\n  border-radius: 0.125rem;\n  background: #f3f2f2; }\n\n.slds-color-picker__hue-slider::-moz-range-thumb {\n  -moz-appearance: none;\n       appearance: none;\n  cursor: pointer;\n  height: calc(1.5rem - (1px * 2));\n  width: 0.375rem;\n  border: 1px solid #514f4d;\n  border-radius: 0.125rem;\n  background: #f3f2f2; }\n\n.slds-color-picker__hue-slider::-ms-thumb {\n  appearance: none;\n  cursor: pointer;\n  height: calc(1.5rem - (1px * 2));\n  width: 0.375rem;\n  border: 1px solid #514f4d;\n  border-radius: 0.125rem;\n  background: #f3f2f2;\n  height: 1.5rem; }\n\n.slds-color-picker__hue-slider:focus {\n  outline: none; }\n\n.slds-color-picker__hue-slider:focus::-webkit-slider-thumb {\n  border-color: #1589ee;\n  box-shadow: 0 0 3px #0070D2; }\n\n.slds-color-picker__hue-slider:focus::-moz-range-thumb {\n  border-color: #1589ee;\n  box-shadow: 0 0 3px #0070D2; }\n\n.slds-color-picker__hue-slider:focus::-ms-thumb {\n  border-color: #1589ee;\n  box-shadow: 0 0 3px #0070D2; }\n\n.slds-color-picker__hue-slider::-moz-range-track {\n  height: 0; }\n\n.slds-color-picker__hue-slider::-ms-track {\n  height: 0;\n  border: 0;\n  background: transparent;\n  color: transparent; }\n\n/**\n * @summary The group of direct input elements\n *\n * @selector .slds-color-picker__custom-inputs\n * @restrict .slds-color-picker__custom > div\n */\n.slds-color-picker__custom-inputs {\n  display: -ms-flexbox;\n  display: flex;\n  padding-top: 0.5rem; }\n\n.slds-color-picker__custom-inputs .slds-form-element {\n  -ms-flex: flex-grow;\n      flex: flex-grow; }\n\n.slds-color-picker__custom-inputs .slds-form-element:not(:first-child) {\n  margin-left: 0.25rem; }\n\n.slds-color-picker__custom-inputs input {\n  padding: 0 0.25rem; }\n\n.slds-color-picker__custom-inputs abbr {\n  cursor: text;\n  text-decoration: none; }\n\n.slds-color-picker__input-custom-hex {\n  -ms-flex: none;\n      flex: none;\n  width: 4.2rem; }\n\n.slds-color-picker__input-custom-hex input {\n  font-size: 0.75rem; }\n\n/**\n * @summary Footer for the Color Selector Picker\n *\n * @selector .slds-color-picker__selector-footer\n * @restrict .slds-color-picker__selector div\n */\n.slds-color-picker__selector-footer {\n  display: -ms-flexbox;\n  display: flex; }\n\n.slds-color-picker__selector-footer .slds-button {\n  -ms-flex: 1;\n      flex: 1; }\n\n/**\n * @summary A swatch\n *\n * @selector .slds-swatch\n * @restrict .slds-color-picker__swatch span, .slds-color-picker__summary-button span, .slds-color-picker__hue-and-preview span\n */\n.slds-swatch {\n  display: inline-block;\n  vertical-align: middle;\n  height: 1.25rem;\n  width: 1.25rem;\n  border-radius: 0.125rem; }\n\n/**\n * The Custom-Only variant should only render the custom color selection tool\n * in the Color Picker popover. It should not be inside a tabset.\n *\n * @summary Swatches Only UI\n *\n * @name custom-only\n * @selector .slds-color-picker_custom-only\n * @restrict .slds-color-picker\n * @variant\n */\n/**\n * The Predefined Only variant should only render the predefined colors\n * selection in the Color Picker popover. It should not be inside a tabset.\n *\n * @summary Swatches Only UI\n *\n * @name predefined-only\n * @selector .slds-color-picker_predefined-only\n * @restrict .slds-color-picker\n * @variant\n */\n/**\n * The Swatches Only variant should only render a group of individual swatches.\n * It should not render any of the main chrome of the color picker UI (no Summary\n * section, no Popover, no Tabset), it should only render the Color Picker swatches\n * selector. This component should be rendered inside a menu.\n *\n * ### Accessibility Notes\n *\n * The accessibility requirements for this Variant are slightly different from\n * the others:\n *\n * #### `.slds-color-picker__swatches`\n *\n * This element _needs_ a `role` of `menu`.\n *\n * #### `.slds-color-picker__swatch-trigger`\n *\n * This element _needs_ a `role` of `option`\n *\n * @summary Swatches Only UI\n *\n * @name swatches-only\n * @selector .slds-color-picker_swatches-only\n * @restrict .slds-color-picker\n * @variant\n */\n.slds-color-picker.slds-color-picker_swatches-only {\n  width: 13.3rem;\n  padding: 0.5rem; }\n\n.slds-color-picker.slds-color-picker_swatches-only .slds-color-picker__selector {\n  margin: 0; }\n\n/**\n * @summary Container for icons\n *\n * @name base\n * @selector .slds-icon_container\n * @restrict span, div\n * @notes Used when an icon with a background color is accompanied by `.slds-assistive-text` and also receives a `background-color` class\n * @variant\n */\n.slds-icon_container,\n.slds-icon__container {\n  display: inline-block;\n  border-radius: 0.25rem;\n  /**\n   * @summary Circle container for icons\n   * @selector .slds-icon_container_circle\n   * @restrict .slds-icon_container\n   */ }\n\n.slds-icon_container_circle, .slds-icon_container--circle,\n.slds-icon__container_circle,\n.slds-icon__container--circle {\n  padding: 0.5rem;\n  border-radius: 50%; }\n\n[class*='slds-icon-action-'] {\n  padding: 0.5rem;\n  border-radius: 50%; }\n\n.slds-icon-action-new-custom18 {\n  background-color: #4dca76; }\n\n.slds-icon-action-new-custom29 {\n  background-color: #bdd25f; }\n\n.slds-icon-action-edit-groups {\n  background-color: #34becd; }\n\n.slds-icon-action-new-custom9 {\n  background-color: #6b9ee2; }\n\n.slds-icon-action-log-a-call {\n  background-color: #48c3cc; }\n\n.slds-icon-action-new-custom19 {\n  background-color: #3abeb1; }\n\n.slds-icon-action-filter {\n  background-color: #fd90b5; }\n\n.slds-icon-action-user-activation {\n  background-color: #54698d; }\n\n.slds-icon-action-opportunity-competitor {\n  background-color: #fcb95b; }\n\n.slds-icon-action-canvas {\n  background-color: #8199af; }\n\n.slds-icon-action-change-record-type {\n  background-color: #54698d; }\n\n.slds-icon-action-new-notebook {\n  background-color: #e6d478; }\n\n.slds-icon-action-docusign {\n  background-color: #5080db; }\n\n.slds-icon-action-share-link {\n  background-color: #7a9ae6; }\n\n.slds-icon-action-add-file {\n  background-color: #7e8be4; }\n\n.slds-icon-action-edit-relationship {\n  background-color: #1dccbf; }\n\n.slds-icon-action-notebook {\n  background-color: #e6d478; }\n\n.slds-icon-action-new-lead {\n  background-color: #f88962; }\n\n.slds-icon-action-new-custom-object {\n  background-color: #a7d44d; }\n\n.slds-icon-action-new-account {\n  background-color: #7f8de1; }\n\n.slds-icon-action-question-post-action {\n  background-color: #32af5c; }\n\n.slds-icon-action-share-file {\n  background-color: #baac93; }\n\n.slds-icon-action-default-custom-object {\n  background-color: #8199af; }\n\n.slds-icon-action-opportunity-team-member {\n  background-color: #fcb95b; }\n\n.slds-icon-action-add-photo-video {\n  background-color: #00cdc0; }\n\n.slds-icon-action-sort {\n  background-color: #fab9a5; }\n\n.slds-icon-action-call {\n  background-color: #1fcaa0; }\n\n.slds-icon-action-concur {\n  background-color: #4cc3c7; }\n\n.slds-icon-action-reject {\n  background-color: #00c6b7; }\n\n.slds-icon-action-share-poll {\n  background-color: #699be1; }\n\n.slds-icon-action-following {\n  background-color: #7dcf64; }\n\n.slds-icon-action-defer {\n  background-color: #ef7ead; }\n\n.slds-icon-action-opportunity-line-item {\n  background-color: #fcb95b; }\n\n.slds-icon-action-social-post {\n  background-color: #ea74a2; }\n\n.slds-icon-action-share-post {\n  background-color: #65cae4; }\n\n.slds-icon-action-view-relationship {\n  background-color: #3c97dd; }\n\n.slds-icon-action-upload {\n  background-color: #54698d; }\n\n.slds-icon-action-remove-relationship {\n  background-color: #ef6e64; }\n\n.slds-icon-action-freeze-user {\n  background-color: #54698d; }\n\n.slds-icon-action-new-person-account {\n  background-color: #7f8de1; }\n\n.slds-icon-action-apex {\n  background-color: #696e71; }\n\n.slds-icon-action-new-opportunity {\n  background-color: #fcb95b; }\n\n.slds-icon-action-fallback {\n  background-color: #9895ee; }\n\n.slds-icon-action-dial-in {\n  background-color: #8b9ae3; }\n\n.slds-icon-action-approval {\n  background-color: #00c6b7; }\n\n.slds-icon-action-change-owner {\n  background-color: #54698d; }\n\n.slds-icon-action-new-task {\n  background-color: #4bc076; }\n\n.slds-icon-action-priority {\n  background-color: #fbb439; }\n\n.slds-icon-action-remove {\n  background-color: #54698d; }\n\n.slds-icon-action-web-link {\n  background-color: #56aadf; }\n\n.slds-icon-action-leave-group {\n  background-color: #f39e58; }\n\n.slds-icon-action-manage-perm-sets {\n  background-color: #54698d; }\n\n.slds-icon-action-close {\n  background-color: #ef6e64; }\n\n.slds-icon-action-google-news {\n  background-color: #f5675b; }\n\n.slds-icon-action-announcement {\n  background-color: #fe8f60; }\n\n.slds-icon-action-back {\n  background-color: #0dc2d9; }\n\n.slds-icon-action-new-custom90 {\n  background-color: #22a48a; }\n\n.slds-icon-action-download {\n  background-color: #54698d; }\n\n.slds-icon-action-new-custom80 {\n  background-color: #659ad5; }\n\n.slds-icon-action-new-custom91 {\n  background-color: #bf7b66; }\n\n.slds-icon-action-search {\n  background-color: #48adeb; }\n\n.slds-icon-action-new-event {\n  background-color: #eb7092; }\n\n.slds-icon-action-new-custom70 {\n  background-color: #e769b4; }\n\n.slds-icon-action-new-custom81 {\n  background-color: #da627f; }\n\n.slds-icon-action-new-custom92 {\n  background-color: #517e82; }\n\n.slds-icon-action-refresh {\n  background-color: #54698d; }\n\n.slds-icon-action-share-thanks {\n  background-color: #e9696e; }\n\n.slds-icon-action-update {\n  background-color: #81b4d6; }\n\n.slds-icon-action-email {\n  background-color: #95aec5; }\n\n.slds-icon-action-join-group {\n  background-color: #779ef2; }\n\n.slds-icon-action-new-custom60 {\n  background-color: #bf5a88; }\n\n.slds-icon-action-new-custom71 {\n  background-color: #e36ee3; }\n\n.slds-icon-action-new-custom82 {\n  background-color: #d15b97; }\n\n.slds-icon-action-new-custom93 {\n  background-color: #904d4c; }\n\n.slds-icon-action-edit {\n  background-color: #1dccbf; }\n\n.slds-icon-action-quote {\n  background-color: #88c651; }\n\n.slds-icon-action-dropbox {\n  background-color: #52aef9; }\n\n.slds-icon-action-description {\n  background-color: #7dc37d; }\n\n.slds-icon-action-map {\n  background-color: #76c6ee; }\n\n.slds-icon-action-user {\n  background-color: #65cae4; }\n\n.slds-icon-action-reset-password {\n  background-color: #54698d; }\n\n.slds-icon-action-new-custom50 {\n  background-color: #49bcd3; }\n\n.slds-icon-action-new-custom61 {\n  background-color: #f57376; }\n\n.slds-icon-action-new-custom72 {\n  background-color: #8d9bfb; }\n\n.slds-icon-action-new-custom83 {\n  background-color: #e7806f; }\n\n.slds-icon-action-new-custom94 {\n  background-color: #439cba; }\n\n.slds-icon-action-clone {\n  background-color: #6ca1e9; }\n\n.slds-icon-action-delete {\n  background-color: #e6717c; }\n\n.slds-icon-action-new-custom40 {\n  background-color: #83c75e; }\n\n.slds-icon-action-new-custom51 {\n  background-color: #d8c760; }\n\n.slds-icon-action-new-custom62 {\n  background-color: #6b92dc; }\n\n.slds-icon-action-new-custom73 {\n  background-color: #679ef0; }\n\n.slds-icon-action-new-custom84 {\n  background-color: #f6707b; }\n\n.slds-icon-action-new-custom95 {\n  background-color: #8bcf6a; }\n\n.slds-icon-action-share {\n  background-color: #54698d; }\n\n.slds-icon-action-new-custom30 {\n  background-color: #f59f71; }\n\n.slds-icon-action-new-custom41 {\n  background-color: #43b5b5; }\n\n.slds-icon-action-new-custom52 {\n  background-color: #ee8e6f; }\n\n.slds-icon-action-new-custom63 {\n  background-color: #7ccf60; }\n\n.slds-icon-action-new-custom74 {\n  background-color: #41c8a0; }\n\n.slds-icon-action-new-custom85 {\n  background-color: #f26891; }\n\n.slds-icon-action-new-custom96 {\n  background-color: #6d9de3; }\n\n.slds-icon-action-log-event {\n  background-color: #6ca1e9; }\n\n.slds-icon-action-new-group {\n  background-color: #83b6ff; }\n\n.slds-icon-action-new-custom20 {\n  background-color: #48c7c8; }\n\n.slds-icon-action-new-custom31 {\n  background-color: #eb687f; }\n\n.slds-icon-action-new-custom42 {\n  background-color: #cfd05b; }\n\n.slds-icon-action-info {\n  background-color: #54698d; }\n\n.slds-icon-action-new-custom53 {\n  background-color: #f36e83; }\n\n.slds-icon-action-new-custom64 {\n  background-color: #618fd8; }\n\n.slds-icon-action-new-custom75 {\n  background-color: #cd9f65; }\n\n.slds-icon-action-new-custom86 {\n  background-color: #e260ab; }\n\n.slds-icon-action-flow {\n  background-color: #0079bc; }\n\n.slds-icon-action-new-custom97 {\n  background-color: #dd6085; }\n\n.slds-icon-action-submit-for-approval {\n  background-color: #50cc7a; }\n\n.slds-icon-action-new {\n  background-color: #33bce7; }\n\n.slds-icon-action-new-campaign {\n  background-color: #f49756; }\n\n.slds-icon-action-new-custom10 {\n  background-color: #6488e3; }\n\n.slds-icon-action-new-custom21 {\n  background-color: #8a7aed; }\n\n.slds-icon-action-new-custom32 {\n  background-color: #38c393; }\n\n.slds-icon-action-new-custom43 {\n  background-color: #7f93f9; }\n\n.slds-icon-action-new-custom54 {\n  background-color: #ea70b1; }\n\n.slds-icon-action-new-custom65 {\n  background-color: #f279ab; }\n\n.slds-icon-action-new-custom76 {\n  background-color: #db6d7a; }\n\n.slds-icon-action-new-custom87 {\n  background-color: #d876e5; }\n\n.slds-icon-action-new-custom98 {\n  background-color: #e1be5c; }\n\n.slds-icon-action-new-case {\n  background-color: #f2cf5b; }\n\n.slds-icon-action-new-custom100 {\n  background-color: #e15d76; }\n\n.slds-icon-action-new-custom1 {\n  background-color: #ff7b84; }\n\n.slds-icon-action-new-contact {\n  background-color: #a094ed; }\n\n.slds-icon-action-office-365 {\n  background-color: #ff8041; }\n\n.slds-icon-action-new-custom11 {\n  background-color: #8784ea; }\n\n.slds-icon-action-new-custom22 {\n  background-color: #8b85f9; }\n\n.slds-icon-action-new-custom33 {\n  background-color: #97cf5d; }\n\n.slds-icon-action-new-custom44 {\n  background-color: #c8ca58; }\n\n.slds-icon-action-new-custom55 {\n  background-color: #d66ee0; }\n\n.slds-icon-action-new-custom66 {\n  background-color: #d8be5f; }\n\n.slds-icon-action-new-custom77 {\n  background-color: #b55d5b; }\n\n.slds-icon-action-new-custom88 {\n  background-color: #996fe6; }\n\n.slds-icon-action-new-custom99 {\n  background-color: #f0856e; }\n\n.slds-icon-action-add-contact {\n  background-color: #a094ed; }\n\n.slds-icon-action-evernote {\n  background-color: #86c86f; }\n\n.slds-icon-action-new-custom2 {\n  background-color: #cfd05c; }\n\n.slds-icon-action-lead-convert {\n  background-color: #f88962; }\n\n.slds-icon-action-new-custom12 {\n  background-color: #dc71d1; }\n\n.slds-icon-action-new-custom23 {\n  background-color: #b070e6; }\n\n.slds-icon-action-new-custom34 {\n  background-color: #d58a6a; }\n\n.slds-icon-action-new-custom45 {\n  background-color: #d95879; }\n\n.slds-icon-action-new-custom56 {\n  background-color: #718deb; }\n\n.slds-icon-action-new-custom67 {\n  background-color: #f87d76; }\n\n.slds-icon-action-recall {\n  background-color: #4a698d; }\n\n.slds-icon-action-new-custom78 {\n  background-color: #5a95dd; }\n\n.slds-icon-action-new-custom89 {\n  background-color: #3e99be; }\n\n.slds-icon-action-follow {\n  background-color: #31b9f8; }\n\n.slds-icon-action-record {\n  background-color: #7dc37d; }\n\n.slds-icon-action-new-custom3 {\n  background-color: #ecb46c; }\n\n.slds-icon-action-new-note {\n  background-color: #e6d478; }\n\n.slds-icon-action-new-custom13 {\n  background-color: #df6184; }\n\n.slds-icon-action-new-custom24 {\n  background-color: #e56798; }\n\n.slds-icon-action-new-custom35 {\n  background-color: #e9637e; }\n\n.slds-icon-action-new-custom46 {\n  background-color: #67a5e7; }\n\n.slds-icon-action-new-custom57 {\n  background-color: #5a9cdd; }\n\n.slds-icon-action-new-custom68 {\n  background-color: #f26979; }\n\n.slds-icon-action-new-custom79 {\n  background-color: #8ed363; }\n\n.slds-icon-action-new-child-case {\n  background-color: #fa975c; }\n\n.slds-icon-action-new-custom4 {\n  background-color: #e1d951; }\n\n.slds-icon-action-new-custom14 {\n  background-color: #3cc2b3; }\n\n.slds-icon-action-new-custom25 {\n  background-color: #e46fbe; }\n\n.slds-icon-action-new-custom36 {\n  background-color: #d472d4; }\n\n.slds-icon-action-new-custom47 {\n  background-color: #5fcc64; }\n\n.slds-icon-action-new-custom58 {\n  background-color: #34b59d; }\n\n.slds-icon-action-new-custom69 {\n  background-color: #ed6387; }\n\n.slds-icon-action-new-custom5 {\n  background-color: #9fdb66; }\n\n.slds-icon-action-goal {\n  background-color: #56aadf; }\n\n.slds-icon-action-new-custom15 {\n  background-color: #f77e75; }\n\n.slds-icon-action-new-custom26 {\n  background-color: #7698f0; }\n\n.slds-icon-action-new-custom37 {\n  background-color: #8c89f2; }\n\n.slds-icon-action-new-custom48 {\n  background-color: #ef697f; }\n\n.slds-icon-action-new-custom59 {\n  background-color: #e3d067; }\n\n.slds-icon-action-new-custom6 {\n  background-color: #54c473; }\n\n.slds-icon-action-log-this-event {\n  background-color: #eb7092; }\n\n.slds-icon-action-new-custom16 {\n  background-color: #e9af67; }\n\n.slds-icon-action-new-custom27 {\n  background-color: #5ab0d2; }\n\n.slds-icon-action-new-custom38 {\n  background-color: #53b6d7; }\n\n.slds-icon-action-new-custom49 {\n  background-color: #e25c80; }\n\n.slds-icon-action-new-custom7 {\n  background-color: #6a89e5; }\n\n.slds-icon-action-more {\n  background-color: #62b7ed; }\n\n.slds-icon-action-add-relationship {\n  background-color: #62b7ed; }\n\n.slds-icon-action-new-custom17 {\n  background-color: #acd360; }\n\n.slds-icon-action-new-custom28 {\n  background-color: #89c059; }\n\n.slds-icon-action-new-custom39 {\n  background-color: #4fbe75; }\n\n.slds-icon-action-password-unlock {\n  background-color: #54698d; }\n\n.slds-icon-action-check {\n  background-color: #54698d; }\n\n.slds-icon-action-update-status {\n  background-color: #1ec7be; }\n\n.slds-icon-action-preview {\n  background-color: #7f8de1; }\n\n.slds-icon-action-new-custom8 {\n  background-color: #50ceb9; }\n\n.slds-icon-custom-custom110,\n.slds-icon-custom-110 {\n  background-color: #f28b00;\n  color: white; }\n\n.slds-icon-custom-custom100,\n.slds-icon-custom-100 {\n  background-color: #e15d76;\n  color: white; }\n\n.slds-icon-custom-custom111,\n.slds-icon-custom-111 {\n  background-color: #f28b00;\n  color: white; }\n\n.slds-icon-custom-custom1,\n.slds-icon-custom-1 {\n  background-color: #ff7b84;\n  color: white; }\n\n.slds-icon-custom-custom101,\n.slds-icon-custom-101 {\n  background-color: #f28b00;\n  color: white; }\n\n.slds-icon-custom-custom112,\n.slds-icon-custom-112 {\n  background-color: #f28b00;\n  color: white; }\n\n.slds-icon-custom-custom2,\n.slds-icon-custom-2 {\n  background-color: #cfd05c;\n  color: white; }\n\n.slds-icon-custom-custom102,\n.slds-icon-custom-102 {\n  background-color: #f28b00;\n  color: white; }\n\n.slds-icon-custom-custom113,\n.slds-icon-custom-113 {\n  background-color: #f28b00;\n  color: white; }\n\n.slds-icon-custom-custom90,\n.slds-icon-custom-90 {\n  background-color: #22a48a;\n  color: white; }\n\n.slds-icon-custom-custom3,\n.slds-icon-custom-3 {\n  background-color: #ecb46c;\n  color: white; }\n\n.slds-icon-custom-custom103,\n.slds-icon-custom-103 {\n  background-color: #f28b00;\n  color: white; }\n\n.slds-icon-custom-custom80,\n.slds-icon-custom-80 {\n  background-color: #659ad5;\n  color: white; }\n\n.slds-icon-custom-custom91,\n.slds-icon-custom-91 {\n  background-color: #bf7b66;\n  color: white; }\n\n.slds-icon-custom-custom4,\n.slds-icon-custom-4 {\n  background-color: #e1d951;\n  color: white; }\n\n.slds-icon-custom-custom104,\n.slds-icon-custom-104 {\n  background-color: #f28b00;\n  color: white; }\n\n.slds-icon-custom-custom70,\n.slds-icon-custom-70 {\n  background-color: #e769b4;\n  color: white; }\n\n.slds-icon-custom-custom81,\n.slds-icon-custom-81 {\n  background-color: #da627f;\n  color: white; }\n\n.slds-icon-custom-custom92,\n.slds-icon-custom-92 {\n  background-color: #517e82;\n  color: white; }\n\n.slds-icon-custom-custom5,\n.slds-icon-custom-5 {\n  background-color: #9fdb66;\n  color: white; }\n\n.slds-icon-custom-custom105,\n.slds-icon-custom-105 {\n  background-color: #f28b00;\n  color: white; }\n\n.slds-icon-custom-custom60,\n.slds-icon-custom-60 {\n  background-color: #bf5a88;\n  color: white; }\n\n.slds-icon-custom-custom71,\n.slds-icon-custom-71 {\n  background-color: #e36ee3;\n  color: white; }\n\n.slds-icon-custom-custom82,\n.slds-icon-custom-82 {\n  background-color: #d15b97;\n  color: white; }\n\n.slds-icon-custom-custom93,\n.slds-icon-custom-93 {\n  background-color: #904d4c;\n  color: white; }\n\n.slds-icon-custom-custom6,\n.slds-icon-custom-6 {\n  background-color: #54c473;\n  color: white; }\n\n.slds-icon-custom-custom106,\n.slds-icon-custom-106 {\n  background-color: #f28b00;\n  color: white; }\n\n.slds-icon-custom-custom50,\n.slds-icon-custom-50 {\n  background-color: #49bcd3;\n  color: white; }\n\n.slds-icon-custom-custom61,\n.slds-icon-custom-61 {\n  background-color: #f57376;\n  color: white; }\n\n.slds-icon-custom-custom72,\n.slds-icon-custom-72 {\n  background-color: #8d9bfb;\n  color: white; }\n\n.slds-icon-custom-custom83,\n.slds-icon-custom-83 {\n  background-color: #e7806f;\n  color: white; }\n\n.slds-icon-custom-custom94,\n.slds-icon-custom-94 {\n  background-color: #439cba;\n  color: white; }\n\n.slds-icon-custom-custom7,\n.slds-icon-custom-7 {\n  background-color: #6a89e5;\n  color: white; }\n\n.slds-icon-custom-custom107,\n.slds-icon-custom-107 {\n  background-color: #f28b00;\n  color: white; }\n\n.slds-icon-custom-custom40,\n.slds-icon-custom-40 {\n  background-color: #83c75e;\n  color: white; }\n\n.slds-icon-custom-custom51,\n.slds-icon-custom-51 {\n  background-color: #d8c760;\n  color: white; }\n\n.slds-icon-custom-custom62,\n.slds-icon-custom-62 {\n  background-color: #6b92dc;\n  color: white; }\n\n.slds-icon-custom-custom73,\n.slds-icon-custom-73 {\n  background-color: #679ef0;\n  color: white; }\n\n.slds-icon-custom-custom84,\n.slds-icon-custom-84 {\n  background-color: #f6707b;\n  color: white; }\n\n.slds-icon-custom-custom95,\n.slds-icon-custom-95 {\n  background-color: #8bcf6a;\n  color: white; }\n\n.slds-icon-custom-custom8,\n.slds-icon-custom-8 {\n  background-color: #50ceb9;\n  color: white; }\n\n.slds-icon-custom-custom108,\n.slds-icon-custom-108 {\n  background-color: #f28b00;\n  color: white; }\n\n.slds-icon-custom-custom30,\n.slds-icon-custom-30 {\n  background-color: #f59f71;\n  color: white; }\n\n.slds-icon-custom-custom41,\n.slds-icon-custom-41 {\n  background-color: #43b5b5;\n  color: white; }\n\n.slds-icon-custom-custom52,\n.slds-icon-custom-52 {\n  background-color: #ee8e6f;\n  color: white; }\n\n.slds-icon-custom-custom63,\n.slds-icon-custom-63 {\n  background-color: #7ccf60;\n  color: white; }\n\n.slds-icon-custom-custom74,\n.slds-icon-custom-74 {\n  background-color: #41c8a0;\n  color: white; }\n\n.slds-icon-custom-custom85,\n.slds-icon-custom-85 {\n  background-color: #f26891;\n  color: white; }\n\n.slds-icon-custom-custom96,\n.slds-icon-custom-96 {\n  background-color: #6d9de3;\n  color: white; }\n\n.slds-icon-custom-custom9,\n.slds-icon-custom-9 {\n  background-color: #6b9ee2;\n  color: white; }\n\n.slds-icon-custom-custom109,\n.slds-icon-custom-109 {\n  background-color: #f28b00;\n  color: white; }\n\n.slds-icon-custom-custom20,\n.slds-icon-custom-20 {\n  background-color: #48c7c8;\n  color: white; }\n\n.slds-icon-custom-custom31,\n.slds-icon-custom-31 {\n  background-color: #eb687f;\n  color: white; }\n\n.slds-icon-custom-custom42,\n.slds-icon-custom-42 {\n  background-color: #cfd05b;\n  color: white; }\n\n.slds-icon-custom-custom53,\n.slds-icon-custom-53 {\n  background-color: #f36e83;\n  color: white; }\n\n.slds-icon-custom-custom64,\n.slds-icon-custom-64 {\n  background-color: #618fd8;\n  color: white; }\n\n.slds-icon-custom-custom75,\n.slds-icon-custom-75 {\n  background-color: #cd9f65;\n  color: white; }\n\n.slds-icon-custom-custom86,\n.slds-icon-custom-86 {\n  background-color: #e260ab;\n  color: white; }\n\n.slds-icon-custom-custom97,\n.slds-icon-custom-97 {\n  background-color: #dd6085;\n  color: white; }\n\n.slds-icon-custom-custom10,\n.slds-icon-custom-10 {\n  background-color: #6488e3;\n  color: white; }\n\n.slds-icon-custom-custom21,\n.slds-icon-custom-21 {\n  background-color: #8a7aed;\n  color: white; }\n\n.slds-icon-custom-custom32,\n.slds-icon-custom-32 {\n  background-color: #38c393;\n  color: white; }\n\n.slds-icon-custom-custom43,\n.slds-icon-custom-43 {\n  background-color: #7f93f9;\n  color: white; }\n\n.slds-icon-custom-custom54,\n.slds-icon-custom-54 {\n  background-color: #ea70b1;\n  color: white; }\n\n.slds-icon-custom-custom65,\n.slds-icon-custom-65 {\n  background-color: #f279ab;\n  color: white; }\n\n.slds-icon-custom-custom76,\n.slds-icon-custom-76 {\n  background-color: #db6d7a;\n  color: white; }\n\n.slds-icon-custom-custom87,\n.slds-icon-custom-87 {\n  background-color: #d876e5;\n  color: white; }\n\n.slds-icon-custom-custom98,\n.slds-icon-custom-98 {\n  background-color: #e1be5c;\n  color: white; }\n\n.slds-icon-custom-custom11,\n.slds-icon-custom-11 {\n  background-color: #8784ea;\n  color: white; }\n\n.slds-icon-custom-custom22,\n.slds-icon-custom-22 {\n  background-color: #8b85f9;\n  color: white; }\n\n.slds-icon-custom-custom33,\n.slds-icon-custom-33 {\n  background-color: #97cf5d;\n  color: white; }\n\n.slds-icon-custom-custom44,\n.slds-icon-custom-44 {\n  background-color: #c8ca58;\n  color: white; }\n\n.slds-icon-custom-custom55,\n.slds-icon-custom-55 {\n  background-color: #d66ee0;\n  color: white; }\n\n.slds-icon-custom-custom66,\n.slds-icon-custom-66 {\n  background-color: #d8be5f;\n  color: white; }\n\n.slds-icon-custom-custom77,\n.slds-icon-custom-77 {\n  background-color: #b55d5b;\n  color: white; }\n\n.slds-icon-custom-custom88,\n.slds-icon-custom-88 {\n  background-color: #996fe6;\n  color: white; }\n\n.slds-icon-custom-custom99,\n.slds-icon-custom-99 {\n  background-color: #f0856e;\n  color: white; }\n\n.slds-icon-custom-custom12,\n.slds-icon-custom-12 {\n  background-color: #dc71d1;\n  color: white; }\n\n.slds-icon-custom-custom23,\n.slds-icon-custom-23 {\n  background-color: #b070e6;\n  color: white; }\n\n.slds-icon-custom-custom34,\n.slds-icon-custom-34 {\n  background-color: #d58a6a;\n  color: white; }\n\n.slds-icon-custom-custom45,\n.slds-icon-custom-45 {\n  background-color: #d95879;\n  color: white; }\n\n.slds-icon-custom-custom56,\n.slds-icon-custom-56 {\n  background-color: #718deb;\n  color: white; }\n\n.slds-icon-custom-custom67,\n.slds-icon-custom-67 {\n  background-color: #f87d76;\n  color: white; }\n\n.slds-icon-custom-custom78,\n.slds-icon-custom-78 {\n  background-color: #5a95dd;\n  color: white; }\n\n.slds-icon-custom-custom89,\n.slds-icon-custom-89 {\n  background-color: #3e99be;\n  color: white; }\n\n.slds-icon-custom-custom13,\n.slds-icon-custom-13 {\n  background-color: #df6184;\n  color: white; }\n\n.slds-icon-custom-custom24,\n.slds-icon-custom-24 {\n  background-color: #e56798;\n  color: white; }\n\n.slds-icon-custom-custom35,\n.slds-icon-custom-35 {\n  background-color: #e9637e;\n  color: white; }\n\n.slds-icon-custom-custom46,\n.slds-icon-custom-46 {\n  background-color: #67a5e7;\n  color: white; }\n\n.slds-icon-custom-custom57,\n.slds-icon-custom-57 {\n  background-color: #5a9cdd;\n  color: white; }\n\n.slds-icon-custom-custom68,\n.slds-icon-custom-68 {\n  background-color: #f26979;\n  color: white; }\n\n.slds-icon-custom-custom79,\n.slds-icon-custom-79 {\n  background-color: #8ed363;\n  color: white; }\n\n.slds-icon-custom-custom14,\n.slds-icon-custom-14 {\n  background-color: #3cc2b3;\n  color: white; }\n\n.slds-icon-custom-custom25,\n.slds-icon-custom-25 {\n  background-color: #e46fbe;\n  color: white; }\n\n.slds-icon-custom-custom36,\n.slds-icon-custom-36 {\n  background-color: #d472d4;\n  color: white; }\n\n.slds-icon-custom-custom47,\n.slds-icon-custom-47 {\n  background-color: #5fcc64;\n  color: white; }\n\n.slds-icon-custom-custom58,\n.slds-icon-custom-58 {\n  background-color: #34b59d;\n  color: white; }\n\n.slds-icon-custom-custom69,\n.slds-icon-custom-69 {\n  background-color: #ed6387;\n  color: white; }\n\n.slds-icon-custom-custom15,\n.slds-icon-custom-15 {\n  background-color: #f77e75;\n  color: white; }\n\n.slds-icon-custom-custom26,\n.slds-icon-custom-26 {\n  background-color: #7698f0;\n  color: white; }\n\n.slds-icon-custom-custom37,\n.slds-icon-custom-37 {\n  background-color: #8c89f2;\n  color: white; }\n\n.slds-icon-custom-custom48,\n.slds-icon-custom-48 {\n  background-color: #ef697f;\n  color: white; }\n\n.slds-icon-custom-custom59,\n.slds-icon-custom-59 {\n  background-color: #e3d067;\n  color: white; }\n\n.slds-icon-custom-custom16,\n.slds-icon-custom-16 {\n  background-color: #e9af67;\n  color: white; }\n\n.slds-icon-custom-custom27,\n.slds-icon-custom-27 {\n  background-color: #5ab0d2;\n  color: white; }\n\n.slds-icon-custom-custom38,\n.slds-icon-custom-38 {\n  background-color: #53b6d7;\n  color: white; }\n\n.slds-icon-custom-custom49,\n.slds-icon-custom-49 {\n  background-color: #e25c80;\n  color: white; }\n\n.slds-icon-custom-custom17,\n.slds-icon-custom-17 {\n  background-color: #acd360;\n  color: white; }\n\n.slds-icon-custom-custom28,\n.slds-icon-custom-28 {\n  background-color: #89c059;\n  color: white; }\n\n.slds-icon-custom-custom39,\n.slds-icon-custom-39 {\n  background-color: #4fbe75;\n  color: white; }\n\n.slds-icon-custom-custom18,\n.slds-icon-custom-18 {\n  background-color: #4dca76;\n  color: white; }\n\n.slds-icon-custom-custom29,\n.slds-icon-custom-29 {\n  background-color: #bdd25f;\n  color: white; }\n\n.slds-icon-custom-custom19,\n.slds-icon-custom-19 {\n  background-color: #3abeb1;\n  color: white; }\n\n.slds-icon-standard-task-2 {\n  background-color: #4bc076; }\n\n.slds-icon-standard-contact {\n  background-color: #a094ed; }\n\n.slds-icon-standard-work-order {\n  background-color: #50e3c2; }\n\n.slds-icon-standard-post {\n  background-color: #65cae4; }\n\n.slds-icon-standard-carousel {\n  background-color: #6bbd6e; }\n\n.slds-icon-standard-resource-skill {\n  background-color: #45c173; }\n\n.slds-icon-standard-goals {\n  background-color: #56aadf; }\n\n.slds-icon-standard-investment-account {\n  background-color: #4bc076; }\n\n.slds-icon-standard-default {\n  background-color: #8199af; }\n\n.slds-icon-standard-case-milestone {\n  background-color: #f2cf5b; }\n\n.slds-icon-standard-today {\n  background-color: #ef7ead; }\n\n.slds-icon-standard-lead-list {\n  background-color: #f88962; }\n\n.slds-icon-standard-product-item-transaction {\n  background-color: #f88962; }\n\n.slds-icon-standard-answer-private {\n  background-color: #f2cf5b; }\n\n.slds-icon-standard-channel-program-members {\n  background-color: #0eb58a; }\n\n.slds-icon-standard-apps-admin {\n  background-color: #9895ee; }\n\n.slds-icon-standard-datadotcom {\n  background-color: #1589ee; }\n\n.slds-icon-standard-product-item {\n  background-color: #769ed9; }\n\n.slds-icon-standard-metrics {\n  background-color: #56aadf; }\n\n.slds-icon-standard-topic2 {\n  background-color: #56aad0; }\n\n.slds-icon-standard-partner-fund-allocation {\n  background-color: #0eb58a; }\n\n.slds-icon-standard-approval {\n  background-color: #50cc7a; }\n\n.slds-icon-standard-iot-orchestrations {\n  background-color: #2a739e; }\n\n.slds-icon-standard-person-account {\n  background-color: #7f8de1; }\n\n.slds-icon-standard-entity {\n  background-color: #f88962; }\n\n.slds-icon-standard-service-territory-location {\n  background-color: #7e8be4; }\n\n.slds-icon-standard-maintenance-asset {\n  background-color: #2a739e; }\n\n.slds-icon-standard-marketing-actions {\n  background-color: #6bbd6e; }\n\n.slds-icon-standard-case-transcript {\n  background-color: #f2cf5b; }\n\n.slds-icon-standard-timesheet-entry {\n  background-color: #7dc37d; }\n\n.slds-icon-standard-task {\n  background-color: #4bc076; }\n\n.slds-icon-standard-answer-best {\n  background-color: #f2cf5b; }\n\n.slds-icon-standard-orders {\n  background-color: #769ed9; }\n\n.slds-icon-standard-past-chat {\n  background-color: #f88960; }\n\n.slds-icon-standard-feedback {\n  background-color: #6da1ea; }\n\n.slds-icon-standard-opportunity-splits {\n  background-color: #fcb95b; }\n\n.slds-icon-standard-messaging-user {\n  background-color: #34becd; }\n\n.slds-icon-standard-entitlements {\n  background-color: #b781d3; }\n\n.slds-icon-standard-case-log-a-call {\n  background-color: #f2cf5b; }\n\n.slds-icon-standard-thanks-loading {\n  background-color: #b8c3ce; }\n\n.slds-icon-standard-channel-program-levels {\n  background-color: #0eb58a; }\n\n.slds-icon-standard-email-chatter {\n  background-color: #f2cf5b; }\n\n.slds-icon-standard-announcement {\n  background-color: #62b7ed; }\n\n.slds-icon-standard-bot {\n  background-color: #54698f; }\n\n.slds-icon-standard-macros {\n  background-color: #47cfd2; }\n\n.slds-icon-standard-asset-relationship {\n  background-color: #fa975c; }\n\n.slds-icon-standard-coaching {\n  background-color: #f67594; }\n\n.slds-icon-standard-search {\n  background-color: #62b7ed; }\n\n.slds-icon-standard-connected-apps {\n  background-color: #9895ee; }\n\n.slds-icon-standard-work-type {\n  background-color: #54698d; }\n\n.slds-icon-standard-environment-hub {\n  background-color: #54698d; }\n\n.slds-icon-standard-cms {\n  background-color: #88c651; }\n\n.slds-icon-standard-thanks {\n  background-color: #e9696e; }\n\n.slds-icon-standard-service-territory-member {\n  background-color: #7e8be4; }\n\n.slds-icon-standard-campaign-members {\n  background-color: #f49756; }\n\n.slds-icon-standard-calibration {\n  background-color: #47cfd2; }\n\n.slds-icon-standard-answer-public {\n  background-color: #f2cf5b; }\n\n.slds-icon-standard-unmatched {\n  background-color: #62b7ed; }\n\n.slds-icon-standard-partners {\n  background-color: #0eb58a; }\n\n.slds-icon-standard-email-iq {\n  background-color: #a094ed; }\n\n.slds-icon-standard-service-crew {\n  background-color: #fa975c; }\n\n.slds-icon-standard-resource-capacity {\n  background-color: #45c173; }\n\n.slds-icon-standard-channel-programs {\n  background-color: #0eb58a; }\n\n.slds-icon-standard-quip {\n  background-color: #25b4e9; }\n\n.slds-icon-standard-quip-sheet {\n  background-color: #30c85a; }\n\n.slds-icon-standard-timeslot {\n  background-color: #fab24c; }\n\n.slds-icon-standard-live-chat {\n  background-color: #f88960; }\n\n.slds-icon-standard-user {\n  background-color: #34becd; }\n\n.slds-icon-standard-client {\n  background-color: #00d2be; }\n\n.slds-icon-standard-portal {\n  background-color: #aec770; }\n\n.slds-icon-standard-partner-fund-request {\n  background-color: #0eb58a; }\n\n.slds-icon-standard-resource-preference {\n  background-color: #45c173; }\n\n.slds-icon-standard-resource-absence {\n  background-color: #45c173; }\n\n.slds-icon-standard-entitlement-template {\n  background-color: #7e8be4; }\n\n.slds-icon-standard-entitlement {\n  background-color: #7e8be4; }\n\n.slds-icon-standard-empty {\n  background-color: #8199af; }\n\n.slds-icon-standard-case-email {\n  background-color: #f2cf5b; }\n\n.slds-icon-standard-account {\n  background-color: #7f8de1; }\n\n.slds-icon-standard-task2 {\n  background-color: #4bc076; }\n\n.slds-icon-standard-social {\n  background-color: #ea74a2; }\n\n.slds-icon-standard-endorsement {\n  background-color: #8b9ae3; }\n\n.slds-icon-standard-folder {\n  background-color: #8b9ae3; }\n\n.slds-icon-standard-service-crew-member {\n  background-color: #7e8be4; }\n\n.slds-icon-standard-flow {\n  background-color: #0079bc; }\n\n.slds-icon-standard-omni-supervisor {\n  background-color: #8a76f0; }\n\n.slds-icon-standard-product {\n  background-color: #b781d3; }\n\n.slds-icon-standard-topic {\n  background-color: #56aadf; }\n\n.slds-icon-standard-product-required {\n  background-color: #ef6e64; }\n\n.slds-icon-standard-process {\n  background-color: #0079bc; }\n\n.slds-icon-standard-people {\n  background-color: #34becd; }\n\n.slds-icon-standard-reward {\n  background-color: #e9696e; }\n\n.slds-icon-standard-performance {\n  background-color: #f8b156; }\n\n.slds-icon-standard-case-comment {\n  background-color: #f2cf5b; }\n\n.slds-icon-standard-campaign {\n  background-color: #f49756; }\n\n.slds-icon-standard-business-hours {\n  background-color: #7dc37d; }\n\n.slds-icon-standard-evernote {\n  background-color: #86c86f; }\n\n.slds-icon-standard-service-territory {\n  background-color: #7e8be4; }\n\n.slds-icon-standard-case {\n  background-color: #f2cf5b; }\n\n.slds-icon-standard-record {\n  background-color: #7dc37d; }\n\n.slds-icon-standard-contract-line-item {\n  background-color: #6ec06e; }\n\n.slds-icon-standard-skill-entity {\n  background-color: #8b9ae3; }\n\n.slds-icon-standard-skill {\n  background-color: #fa975c; }\n\n.slds-icon-standard-operating-hours {\n  background-color: #6b9ee2; }\n\n.slds-icon-standard-custom {\n  background-color: #8199af; }\n\n.slds-icon-standard-related-list {\n  background-color: #59bcab; }\n\n.slds-icon-standard-case-change-status {\n  background-color: #f2cf5b; }\n\n.slds-icon-standard-contract {\n  background-color: #6ec06e; }\n\n.slds-icon-standard-photo {\n  background-color: #d7d1d1; }\n\n.slds-icon-standard-apps {\n  background-color: #3c97dd; }\n\n.slds-icon-standard-timesheet {\n  background-color: #7e8be4; }\n\n.slds-icon-standard-drafts {\n  background-color: #6ca1e9; }\n\n.slds-icon-standard-work-order-item {\n  background-color: #33a8dc; }\n\n.slds-icon-standard-pricebook {\n  background-color: #b781d3; }\n\n.slds-icon-standard-scan-card {\n  background-color: #f39e58; }\n\n.slds-icon-standard-note {\n  background-color: #e6d478; }\n\n.slds-icon-standard-opportunity {\n  background-color: #fcb95b; }\n\n.slds-icon-standard-news {\n  background-color: #7f8de1; }\n\n.slds-icon-standard-call-history {\n  background-color: #f2cf5b; }\n\n.slds-icon-standard-report {\n  background-color: #2ecbbe; }\n\n.slds-icon-standard-groups {\n  background-color: #779ef2; }\n\n.slds-icon-standard-dashboard {\n  background-color: #ef6e64; }\n\n.slds-icon-standard-generic-loading {\n  background-color: #b8c3ce; }\n\n.slds-icon-standard-address {\n  background-color: #4bc076; }\n\n.slds-icon-standard-entity-milestone {\n  background-color: #f49756; }\n\n.slds-icon-standard-customers {\n  background-color: #0eb58a; }\n\n.slds-icon-standard-service-appointment {\n  background-color: #7e8be4; }\n\n.slds-icon-standard-maintenance-plan {\n  background-color: #2a739e; }\n\n.slds-icon-standard-hierarchy {\n  background-color: #34becd; }\n\n.slds-icon-standard-partner-marketing-budget {\n  background-color: #0eb58a; }\n\n.slds-icon-standard-skill-requirement {\n  background-color: #fa975c; }\n\n.slds-icon-standard-location {\n  background-color: #4bc076; }\n\n.slds-icon-standard-avatar-loading {\n  background-color: #b8c3ce; }\n\n.slds-icon-standard-article {\n  background-color: #f2cf5b; }\n\n.slds-icon-standard-log-a-call {\n  background-color: #48c3cc; }\n\n.slds-icon-standard-quotes {\n  background-color: #88c651; }\n\n.slds-icon-standard-question-feed {\n  background-color: #f2cf5b; }\n\n.slds-icon-standard-merge {\n  background-color: #f2cf5b; }\n\n.slds-icon-standard-product-consumed {\n  background-color: #55bc9c; }\n\n.slds-icon-standard-canvas {\n  background-color: #8199af; }\n\n.slds-icon-standard-forecasts {\n  background-color: #6bbd6e; }\n\n.slds-icon-standard-relationship {\n  background-color: #3c97dd; }\n\n.slds-icon-standard-service-resource {\n  background-color: #7e8be4; }\n\n.slds-icon-standard-sales-path {\n  background-color: #2a739e; }\n\n.slds-icon-standard-rtc-presence {\n  background-color: #47cfd2; }\n\n.slds-icon-standard-avatar {\n  background-color: #62b7ed; }\n\n.slds-icon-standard-solution {\n  background-color: #8fc972; }\n\n.slds-icon-standard-partner-fund-claim {\n  background-color: #0eb58a; }\n\n.slds-icon-standard-custom-notification {\n  background-color: #6bb7e4; }\n\n.slds-icon-standard-template {\n  background-color: #3c97dd; }\n\n.slds-icon-standard-shipment {\n  background-color: #7e8be4; }\n\n.slds-icon-standard-event {\n  background-color: #eb7092; }\n\n.slds-icon-standard-survey {\n  background-color: #319fd6; }\n\n.slds-icon-standard-link {\n  background-color: #7a9ae6; }\n\n.slds-icon-standard-messaging-session {\n  background-color: #34becd; }\n\n.slds-icon-standard-list-email {\n  background-color: #8baeb5; }\n\n.slds-icon-standard-document {\n  background-color: #baac93; }\n\n.slds-icon-standard-product-transfer {\n  background-color: #f88962; }\n\n.slds-icon-standard-recent {\n  background-color: #6ca1e9; }\n\n.slds-icon-standard-insights {\n  background-color: #ec94ed; }\n\n.slds-icon-standard-dropbox {\n  background-color: #52aef9; }\n\n.slds-icon-standard-file {\n  background-color: #baac93; }\n\n.slds-icon-standard-team-member {\n  background-color: #f2cf5b; }\n\n.slds-icon-standard-group-loading {\n  background-color: #b8c3ce; }\n\n.slds-icon-standard-lead {\n  background-color: #f88962; }\n\n.slds-icon-standard-email {\n  background-color: #95aec5; }\n\n.slds-icon-standard-service-contract {\n  background-color: #8a76f0; }\n\n.slds-icon-standard-entitlement-process {\n  background-color: #7e8be4; }\n\n.slds-icon-standard-contact-list {\n  background-color: #a094ed; }\n\n.slds-icon-standard-channel-program-history {\n  background-color: #0eb58a; }\n\n.slds-icon-standard-question-best {\n  background-color: #f2cf5b; }\n\n.slds-icon-standard-lead-insights {\n  background-color: #22b0e6; }\n\n.slds-icon-standard-concur {\n  background-color: #4cc3c7; }\n\n.slds-icon-standard-feed {\n  background-color: #62b7ed; }\n\n.slds-icon-standard-messaging-conversation {\n  background-color: #34becd; }\n\n.slds-icon-standard-service-report {\n  background-color: #7e8be4; }\n\n.slds-icon-standard-call {\n  background-color: #f2cf5b; }\n\n.slds-icon-standard-product-request-line-item {\n  background-color: #88c651; }\n\n.slds-icon-standard-return-order-line-item {\n  background-color: #009688; }\n\n.slds-icon-standard-quick-text {\n  background-color: #62b7e5; }\n\n.slds-icon-standard-home {\n  background-color: #ef7ead; }\n\n.slds-icon-standard-sossession {\n  background-color: #54698d; }\n\n.slds-icon-standard-product-request {\n  background-color: #88c651; }\n\n.slds-icon-standard-assigned-resource {\n  background-color: #45c173; }\n\n.slds-icon-standard-return-order {\n  background-color: #009688; }\n\n.slds-icon-standard-poll {\n  background-color: #699be1; }\n\n.slds-icon-standard-household {\n  background-color: #00afa0; }\n\n/**\n * @selector .slds-icon\n * @restrict .slds-icon_container svg, svg\n */\n.slds-icon {\n  width: 2rem;\n  height: 2rem;\n  fill: white; }\n\n[class*='slds-icon-standard-'] .slds-icon, [class*='slds-icon-standard-'].slds-icon,\n[class*='slds-icon-action-'] .slds-icon,\n[class*='slds-icon-action-'].slds-icon,\n[class*='slds-icon-custom-'] .slds-icon,\n[class*='slds-icon-custom-'].slds-icon {\n  border-radius: 0.25rem; }\n\n.slds-icon_xx-small,\n.slds-icon--xx-small {\n  width: 0.875rem;\n  height: 0.875rem;\n  line-height: 1; }\n\n/**\n * @selector .slds-icon_x-small\n * @restrict .slds-icon\n * @modifier\n * @group size\n */\n.slds-icon_x-small,\n.slds-icon--x-small {\n  width: 1rem;\n  height: 1rem;\n  line-height: 1; }\n\n/**\n * @selector .slds-icon_small\n * @restrict .slds-icon\n * @modifier\n * @group size\n */\n.slds-icon_small,\n.slds-icon--small {\n  width: 1.5rem;\n  height: 1.5rem;\n  line-height: 1; }\n\n/**\n * @selector .slds-icon_large\n * @restrict .slds-icon\n * @modifier\n * @group size\n */\n.slds-icon_large,\n.slds-icon--large {\n  width: 3rem;\n  height: 3rem; }\n\n/**\n * @selector .slds-icon-text-default\n * @restrict .slds-icon\n * @modifier\n * @group color\n */\n.slds-icon-text-default {\n  fill: #706e6b; }\n\n/**\n * @selector .slds-icon-text-warning\n * @restrict .slds-icon\n * @modifier\n * @group color\n */\n.slds-icon-text-warning {\n  fill: #ffb75d; }\n\n/**\n * @selector .slds-icon-text-error\n * @restrict .slds-icon\n * @modifier\n * @group color\n */\n.slds-icon-text-error {\n  fill: #c23934; }\n\n/**\n * @selector .slds-icon-text-light\n * @restrict .slds-icon, svg\n * @modifier\n * @group color\n */\n.slds-icon-text-light {\n  fill: #b0adab; }\n\n/**\n * @selector .slds-current-color\n * @restrict *\n */\n.slds-current-color .slds-icon {\n  fill: currentColor; }\n\n/**\n * @summary Initializes an accordion list with more than one section that will have its display toggled by invoking an interaction on the summary title\n *\n * @name base\n * @selector .slds-accordion\n * @restrict ul\n * @variant\n * @required\n * @support dev-ready\n */\n.slds-accordion {\n  position: relative; }\n\n/**\n * List item for each accordion section\n *\n * @selector .slds-accordion__list-item\n * @restrict .slds-accordion li\n * @required\n */\n.slds-accordion__list-item {\n  border-top: 1px solid #dddbda; }\n\n.slds-accordion__list-item:first-child {\n  border-top: 0; }\n\n/**\n * Summary title for each expandable panel inside of an accordion\n *\n * @selector .slds-accordion__summary\n * @restrict .slds-accordion__section div\n * @required\n */\n.slds-accordion__summary {\n  display: -ms-flexbox;\n  display: flex; }\n\n/**\n * Summary title for each expandable panel inside of an accordion\n *\n * @selector .slds-accordion__summary-heading\n * @restrict .slds-accordion__section h3\n * @required\n */\n.slds-accordion__summary-heading {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-positive: 1;\n      flex-grow: 1; }\n\n.slds-accordion__summary-heading .slds-button:focus {\n  text-decoration: underline;\n  box-shadow: none; }\n\n/**\n * Actionable button inside of accordion summary that would toggle the visibility of each section\n *\n * @selector .slds-accordion__summary-action\n * @restrict .slds-accordion__summary button\n * @required\n */\n.slds-accordion__summary-action {\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  -ms-flex-positive: 1;\n      flex-grow: 1;\n  -ms-flex-align: center;\n      align-items: center;\n  min-width: 0; }\n\n/**\n * Icon inside of actionable button within an accordion section\n *\n * @selector .slds-accordion__summary-action-icon\n * @restrict .slds-accordion__summary-action svg\n * @required\n */\n.slds-accordion__summary-action-icon {\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  transform: rotate(-90deg); }\n\n/**\n * Each expandable panel inside of an accordion\n *\n * @selector .slds-accordion__section\n * @restrict .slds-accordion section\n * @required\n */\n.slds-accordion__section {\n  padding: 0.75rem; }\n\n/**\n * Each expandable panel inside of an accordion\n *\n * @selector .slds-accordion__content\n * @restrict .slds-accordion__section div\n * @required\n */\n.slds-accordion__content {\n  overflow: hidden;\n  visibility: hidden;\n  opacity: 0;\n  height: 0; }\n\n/**\n * Toggle visibility of accordion section + rotate icon\n *\n * @selector .slds-is-open\n * @restrict .slds-accordion__section\n * @modifier\n */\n.slds-is-open > .slds-accordion__summary {\n  margin-bottom: 0.75rem; }\n\n.slds-is-open > .slds-accordion__summary .slds-accordion__summary-action-icon {\n  transform: rotate(0deg); }\n\n.slds-is-open > .slds-accordion__content {\n  overflow: visible;\n  visibility: visible;\n  opacity: 1;\n  height: auto; }\n\n/**\n * @name ellie\n * @selector .slds-icon-ellie\n * @restrict span\n * @variant\n */\n.slds-icon-ellie {\n  width: calc(14rem / 16);\n  height: calc(14rem / 16);\n  display: inline-block;\n  overflow: hidden;\n  /**\n   * @summary Add .slds-is-animated to the SVG to enhance the icon with an animation.\n   *\n   * @selector .slds-is-animated\n   * @restrict .slds-icon-ellie\n   */\n  /**\n   * @summary Add .slds-is-paused to the SVG to pause the icon with an animation.\n   *\n   * @selector .slds-is-paused\n   * @restrict .slds-icon-ellie\n   */ }\n\n.slds-icon-ellie.slds-is-animated {\n  will-change: transform;\n  animation: slds-icon-ellie-pop 0.3s ease-in 2s 1 both; }\n\n.slds-icon-ellie.slds-is-animated svg {\n  will-change: transform;\n  animation: slds-icon-ellie 1.2s steps(20) 2.3s 2 alternate; }\n\n.slds-icon-ellie.slds-is-paused,\n.slds-icon-ellie.slds-is-paused svg {\n  animation-play-state: paused; }\n\n.slds-icon-ellie svg {\n  width: 17.5rem;\n  vertical-align: top;\n  color: #00a0e3; }\n\n.slds-icon-ellie circle:nth-child(2n + 1) {\n  fill: currentColor;\n  stroke: currentColor;\n  stroke-width: 4px; }\n\n.slds-icon-ellie circle:nth-child(2n) {\n  fill: #fff;\n  stroke: #fff;\n  stroke-width: 1px; }\n\n.slds-icon-ellie circle:nth-child(1),\n.slds-icon-ellie circle:nth-last-child(2) {\n  stroke-width: 4px; }\n\n.slds-icon-ellie circle:nth-child(2),\n.slds-icon-ellie circle:nth-last-child(1) {\n  stroke-width: 1px; }\n\n.slds-icon-ellie circle:nth-child(3),\n.slds-icon-ellie circle:nth-last-child(4) {\n  stroke-width: 3.95px; }\n\n.slds-icon-ellie circle:nth-child(4),\n.slds-icon-ellie circle:nth-last-child(3) {\n  stroke-width: 1.2px; }\n\n.slds-icon-ellie circle:nth-child(5),\n.slds-icon-ellie circle:nth-last-child(6) {\n  stroke-width: 3.85px; }\n\n.slds-icon-ellie circle:nth-child(6),\n.slds-icon-ellie circle:nth-last-child(5) {\n  stroke-width: 1.4px; }\n\n.slds-icon-ellie circle:nth-child(7),\n.slds-icon-ellie circle:nth-last-child(8) {\n  stroke-width: 3.6px; }\n\n.slds-icon-ellie circle:nth-child(8),\n.slds-icon-ellie circle:nth-last-child(7) {\n  stroke-width: 1.7px; }\n\n.slds-icon-ellie circle:nth-child(9),\n.slds-icon-ellie circle:nth-last-child(10) {\n  stroke-width: 3.3px; }\n\n.slds-icon-ellie circle:nth-child(10),\n.slds-icon-ellie circle:nth-last-child(9) {\n  stroke-width: 2px; }\n\n.slds-icon-ellie circle:nth-child(11),\n.slds-icon-ellie circle:nth-last-child(12) {\n  stroke-width: 3.2px; }\n\n.slds-icon-ellie circle:nth-child(12),\n.slds-icon-ellie circle:nth-last-child(11) {\n  stroke-width: 2.4px; }\n\n.slds-icon-ellie circle:nth-child(13),\n.slds-icon-ellie circle:nth-last-child(14) {\n  stroke-width: 3.15px; }\n\n.slds-icon-ellie circle:nth-child(14),\n.slds-icon-ellie circle:nth-last-child(13) {\n  stroke-width: 2.8px; }\n\n.slds-icon-ellie circle:nth-child(15),\n.slds-icon-ellie circle:nth-last-child(16) {\n  stroke-width: 3.1px; }\n\n.slds-icon-ellie circle:nth-child(16),\n.slds-icon-ellie circle:nth-last-child(15) {\n  stroke-width: 3.25px; }\n\n.slds-icon-ellie circle:nth-child(17),\n.slds-icon-ellie circle:nth-last-child(18) {\n  stroke-width: 3.05px; }\n\n.slds-icon-ellie circle:nth-child(18),\n.slds-icon-ellie circle:nth-last-child(17) {\n  stroke-width: 3.7px; }\n\n.slds-icon-ellie circle:nth-child(19),\n.slds-icon-ellie circle:nth-last-child(20) {\n  stroke-width: 3px; }\n\n.slds-icon-ellie circle:nth-child(20),\n.slds-icon-ellie circle:nth-last-child(19) {\n  stroke-width: 4px; }\n\n@keyframes slds-icon-ellie-pop {\n  0% {\n    transform: scale(0.2); }\n  70% {\n    transform: scale(1.1); }\n  90% {\n    transform: scale(0.7); }\n  100% {\n    transform: scale(1); } }\n\n@keyframes slds-icon-ellie {\n  to {\n    transform: translateX(-17.5rem); } }\n\n/**\n * @name eq\n * @selector .slds-icon-eq\n * @restrict div\n * @variant\n */\n.slds-icon-eq {\n  position: relative;\n  width: calc(14rem / 16);\n  height: calc(14rem / 16);\n  /**\n   * @summary Turn animation on for animated icon\n   *\n   * @selector .slds-is-animated\n   * @restrict .slds-icon-eq\n   */ }\n\n.slds-icon-eq.slds-is-animated .slds-icon-eq__bar {\n  animation: slds-icon-eq 0.25s ease-in-out infinite alternate;\n  will-change: transform;\n  height: 0.1875rem; }\n\n.slds-icon-eq.slds-is-animated .slds-icon-eq__bar:nth-of-type(2) {\n  animation-duration: 0.65s; }\n\n.slds-icon-eq.slds-is-animated .slds-icon-eq__bar:nth-of-type(3) {\n  animation-duration: 0.35s; }\n\n/**\n * @summary Vertical bar for equalizer icon\n *\n * @selector .slds-icon-eq__bar\n * @restrict .slds-icon-eq div\n */\n.slds-icon-eq__bar {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: calc(4rem / 16);\n  height: 0.5625rem;\n  background: #0070d2;\n  transform: scaleY(1);\n  transform-origin: bottom; }\n\n.slds-icon-eq__bar:nth-of-type(2) {\n  left: calc(5rem / 16);\n  height: 0.875rem; }\n\n.slds-icon-eq__bar:nth-of-type(3) {\n  left: calc(10rem / 16);\n  height: 0.75rem; }\n\n@keyframes slds-icon-eq {\n  to {\n    transform: scaleY(4.66667); } }\n\n/**\n * @summary Initializes score icon\n *\n * @name score\n * @selector .slds-icon-score\n * @restrict span\n * @variant\n */\n.slds-icon-score {\n  display: inline-block;\n  width: 0.3125rem;\n  height: 0.3125rem;\n  position: relative; }\n\n[class*=\"slds-icon-score__\"] {\n  position: absolute;\n  opacity: 0;\n  transition: opacity 0.4s ease-in-out;\n  will-change: opacity;\n  stroke-width: 1.125px; }\n\n/**\n * @summary Positive score icon\n *\n * @selector .slds-icon-score__positive\n * @restrict .slds-icon-score svg\n */\n.slds-icon-score__positive {\n  fill: #30a664;\n  stroke: #30a664; }\n\n/**\n * @summary Negative score icon\n *\n * @selector .slds-icon-score__negative\n * @restrict .slds-icon-score svg\n */\n.slds-icon-score__negative {\n  fill: transparent;\n  stroke: #d2504c; }\n\n[data-slds-state=\"positive\"] .slds-icon-score__positive,\n[data-slds-state=\"negative\"] .slds-icon-score__negative {\n  opacity: 1; }\n\n/**\n * @summary Initializes strength icon\n *\n * @name strength\n * @selector .slds-icon-strength\n * @restrict span\n * @variant\n */\n.slds-icon-strength {\n  width: 1.6875rem;\n  height: 0.4375rem;\n  display: inline-block;\n  /**\n   * @summary Add .slds-is-animated to the SVG to enhance the icon with an animation.\n   *\n   * @selector .slds-is-animated\n   * @restrict .slds-icon-strength\n   */\n  /**\n   * @summary Add .slds-is-paused to the SVG to pause the icon with an animation.\n   *\n   * @selector .slds-is-paused\n   * @restrict .slds-icon-strength\n   */ }\n\n.slds-icon-strength circle {\n  stroke-width: 0.95px;\n  fill: transparent;\n  stroke: #ccc;\n  transition: fill 0.4s ease-in-out, stroke 0.4s ease-in-out;\n  will-change: fill, stroke; }\n\n.slds-icon-strength[data-slds-strength=\"1\"] circle:nth-child(1),\n.slds-icon-strength[data-slds-strength=\"2\"] circle:nth-child(1),\n.slds-icon-strength[data-slds-strength=\"2\"] circle:nth-child(2),\n.slds-icon-strength[data-slds-strength=\"3\"] circle:nth-child(1),\n.slds-icon-strength[data-slds-strength=\"3\"] circle:nth-child(2),\n.slds-icon-strength[data-slds-strength=\"3\"] circle:nth-child(3) {\n  fill: #04844b;\n  stroke: #04844b; }\n\n.slds-icon-strength[data-slds-strength=\"-1\"] circle:nth-child(1),\n.slds-icon-strength[data-slds-strength=\"-2\"] circle:nth-child(1),\n.slds-icon-strength[data-slds-strength=\"-2\"] circle:nth-child(2),\n.slds-icon-strength[data-slds-strength=\"-3\"] circle:nth-child(1),\n.slds-icon-strength[data-slds-strength=\"-3\"] circle:nth-child(2),\n.slds-icon-strength[data-slds-strength=\"-3\"] circle:nth-child(3) {\n  fill: #ffdde1;\n  stroke: #c23934; }\n\n.slds-icon-strength.slds-is-animated circle {\n  animation: slds-icon-strength-positive-load 0.4s 1s ease-in-out alternate both paused; }\n\n.slds-icon-strength.slds-is-animated circle:nth-child(2) {\n  animation-delay: 1.4s; }\n\n.slds-icon-strength.slds-is-animated circle:nth-child(3) {\n  animation-delay: 1.8s; }\n\n.slds-icon-strength.slds-is-animated[data-slds-strength^=\"-\"] circle {\n  animation-name: slds-icon-strength-negative-load; }\n\n.slds-icon-strength.slds-is-animated[data-slds-strength=\"-1\"] circle:nth-child(1),\n.slds-icon-strength.slds-is-animated[data-slds-strength=\"-2\"] circle:nth-child(1),\n.slds-icon-strength.slds-is-animated[data-slds-strength=\"-2\"] circle:nth-child(2),\n.slds-icon-strength.slds-is-animated[data-slds-strength=\"-3\"] circle:nth-child(1),\n.slds-icon-strength.slds-is-animated[data-slds-strength=\"-3\"] circle:nth-child(2),\n.slds-icon-strength.slds-is-animated[data-slds-strength=\"-3\"] circle:nth-child(3),\n.slds-icon-strength.slds-is-animated[data-slds-strength=\"1\"] circle:nth-child(1),\n.slds-icon-strength.slds-is-animated[data-slds-strength=\"2\"] circle:nth-child(1),\n.slds-icon-strength.slds-is-animated[data-slds-strength=\"2\"] circle:nth-child(2),\n.slds-icon-strength.slds-is-animated[data-slds-strength=\"3\"] circle:nth-child(1),\n.slds-icon-strength.slds-is-animated[data-slds-strength=\"3\"] circle:nth-child(2),\n.slds-icon-strength.slds-is-animated[data-slds-strength=\"3\"] circle:nth-child(3) {\n  animation-play-state: running; }\n\n.slds-icon-strength.slds-is-paused circle {\n  /* stylelint-disable declaration-no-important */\n  animation-play-state: paused !important;\n  /* stylelint-enable declaration-no-important */ }\n\n@keyframes slds-icon-strength-positive-load {\n  0% {\n    fill: transparent;\n    stroke: #ccc; }\n  100% {\n    fill: #04844b;\n    stroke: #04844b; } }\n\n@keyframes slds-icon-strength-negative-load {\n  0% {\n    fill: transparent;\n    stroke: #ccc; }\n  100% {\n    fill: #ffdde1;\n    stroke: #c23934; } }\n\n/**\n * @summary Initializes trend icon\n *\n * @name trend\n * @selector .slds-icon-trend\n * @restrict span\n * @variant\n */\n.slds-icon-trend {\n  width: 1rem;\n  height: 1rem;\n  display: inline-block;\n  /**\n   * @summary Add .slds-is-animated to the SVG to enhance the icon with an animation.\n   *\n   * @selector .slds-is-animated\n   * @restrict .slds-icon-trend\n   */\n  /**\n   * @summary Add .slds-is-paused to the SVG to pause the icon with an animation.\n   *\n   * @selector .slds-is-paused\n   * @restrict .slds-icon-trend\n   */ }\n\n.slds-icon-trend.slds-is-animated .slds-icon-trend__arrow {\n  animation: slds-icon-trend-arrow 0.8s 0.4s ease-in-out both; }\n\n.slds-icon-trend.slds-is-animated .slds-icon-trend__circle {\n  animation: slds-icon-trend-circle 0.8s ease-in-out both; }\n\n.slds-icon-trend.slds-is-paused .slds-icon-trend__arrow,\n.slds-icon-trend.slds-is-paused .slds-icon-trend__circle {\n  animation-play-state: paused; }\n\n.slds-icon-trend[data-slds-trend=\"down\"] {\n  color: #c23934;\n  transform: rotate(45deg); }\n\n.slds-icon-trend[data-slds-trend=\"neutral\"] {\n  color: #979797; }\n\n.slds-icon-trend[data-slds-trend=\"up\"] {\n  color: #028048;\n  transform: rotate(-45deg); }\n\n.slds-icon-trend__arrow,\n.slds-icon-trend__circle {\n  stroke: currentColor;\n  fill: none;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n  stroke-width: 1.125px; }\n\n/**\n * @summary Arrow element inside of trend icon\n *\n * @selector .slds-icon-trend__arrow\n * @restrict .slds-icon-trend path\n */\n.slds-icon-trend__arrow {\n  stroke-dashoffset: 0.1px;\n  stroke-dasharray: 39.175px; }\n\n/**\n * @summary Circle element inside of trend icon\n *\n * @selector .slds-icon-trend__circle\n * @restrict .slds-icon-trend circle\n */\n.slds-icon-trend__circle {\n  stroke-dasharray: 42.3385px, 46.3385px; }\n\n@keyframes slds-icon-trend-arrow {\n  from {\n    stroke-dashoffset: 40.3px; } }\n\n@keyframes slds-icon-trend-circle {\n  from {\n    stroke-dasharray: 0.1px, 46.3385px; } }\n\n/**\n * @summary Containing actionable element that holds the waffle icon\n *\n * @name waffle\n * @selector .slds-icon-waffle_container\n * @restrict button\n * @variant\n */\n.slds-icon-waffle_container {\n  border: 0;\n  outline: 0; }\n\n.slds-icon-waffle_container:hover [class*=\"slds-r\"], .slds-icon-waffle_container:focus [class*=\"slds-r\"] {\n  animation: slds-icon-waffle-throb 2 200ms alternate; }\n\n.slds-icon-waffle_container:hover .slds-r1,\n.slds-icon-waffle_container:hover .slds-r2,\n.slds-icon-waffle_container:hover .slds-r3, .slds-icon-waffle_container:focus .slds-r1,\n.slds-icon-waffle_container:focus .slds-r2,\n.slds-icon-waffle_container:focus .slds-r3 {\n  background-color: #418fde; }\n\n.slds-icon-waffle_container:hover .slds-r4,\n.slds-icon-waffle_container:hover .slds-r5,\n.slds-icon-waffle_container:hover .slds-r7, .slds-icon-waffle_container:focus .slds-r4,\n.slds-icon-waffle_container:focus .slds-r5,\n.slds-icon-waffle_container:focus .slds-r7 {\n  background-color: #ed8b00; }\n\n.slds-icon-waffle_container:hover .slds-r6,\n.slds-icon-waffle_container:hover .slds-r8,\n.slds-icon-waffle_container:hover .slds-r9, .slds-icon-waffle_container:focus .slds-r6,\n.slds-icon-waffle_container:focus .slds-r8,\n.slds-icon-waffle_container:focus .slds-r9 {\n  background-color: #ffb60f; }\n\n.slds-icon-waffle_container:hover .slds-r2,\n.slds-icon-waffle_container:hover .slds-r4, .slds-icon-waffle_container:focus .slds-r2,\n.slds-icon-waffle_container:focus .slds-r4 {\n  transition-delay: 50ms;\n  animation-delay: 50ms; }\n\n.slds-icon-waffle_container:hover .slds-r3,\n.slds-icon-waffle_container:hover .slds-r5,\n.slds-icon-waffle_container:hover .slds-r7, .slds-icon-waffle_container:focus .slds-r3,\n.slds-icon-waffle_container:focus .slds-r5,\n.slds-icon-waffle_container:focus .slds-r7 {\n  transition-delay: 100ms;\n  animation-delay: 100ms; }\n\n.slds-icon-waffle_container:hover .slds-r6,\n.slds-icon-waffle_container:hover .slds-r8, .slds-icon-waffle_container:focus .slds-r6,\n.slds-icon-waffle_container:focus .slds-r8 {\n  transition-delay: 150ms;\n  animation-delay: 150ms; }\n\n.slds-icon-waffle_container:hover .slds-r9, .slds-icon-waffle_container:focus .slds-r9 {\n  transition-delay: 200ms;\n  animation-delay: 200ms; }\n\n/**\n * @summary Element container circles for the waffle icon\n *\n * @selector .slds-icon-waffle\n * @restrict .slds-icon-waffle_container > span\n */\n.slds-icon-waffle {\n  width: 1.3125rem;\n  height: 1.3125rem;\n  position: relative;\n  display: block;\n  cursor: pointer; }\n\n.slds-icon-waffle [class*=\"slds-r\"] {\n  width: 0.3125rem;\n  height: 0.3125rem;\n  background-color: #706e6b;\n  display: inline-block;\n  position: absolute;\n  border-radius: 50%;\n  transition: background-color 100ms;\n  transform-origin: 50% 50%;\n  will-change: scale, background-color; }\n\n.slds-icon-waffle .slds-r1 {\n  top: 0;\n  left: 0; }\n\n.slds-icon-waffle .slds-r2 {\n  top: 0;\n  left: 0.5rem; }\n\n.slds-icon-waffle .slds-r3 {\n  top: 0;\n  right: 0; }\n\n.slds-icon-waffle .slds-r4 {\n  top: 0.5rem;\n  left: 0; }\n\n.slds-icon-waffle .slds-r5 {\n  top: 0.5rem;\n  left: 0.5rem; }\n\n.slds-icon-waffle .slds-r6 {\n  top: 0.5rem;\n  right: 0; }\n\n.slds-icon-waffle .slds-r7 {\n  bottom: 0;\n  left: 0; }\n\n.slds-icon-waffle .slds-r8 {\n  bottom: 0;\n  left: 0.5rem; }\n\n.slds-icon-waffle .slds-r9 {\n  bottom: 0;\n  right: 0; }\n\n.slds-icon-waffle .slds-r1 {\n  transition-delay: 200ms; }\n\n.slds-icon-waffle .slds-r2,\n.slds-icon-waffle .slds-r4 {\n  transition-delay: 150ms; }\n\n.slds-icon-waffle .slds-r3,\n.slds-icon-waffle .slds-r5,\n.slds-icon-waffle .slds-r7 {\n  transition-delay: 100ms; }\n\n.slds-icon-waffle .slds-r6,\n.slds-icon-waffle .slds-r8 {\n  transition-delay: 50ms; }\n\n@keyframes slds-icon-waffle-throb {\n  to {\n    transform: scale(1.5); } }\n\n/**\n * @summary Hover and click animations for help icon\n *\n * @variant\n * @name global-action-help\n * @selector .slds-icon-help\n * @restrict button, a\n */\n.slds-icon-help {\n  width: 1.5rem;\n  height: 1.5rem;\n  fill: #b0adab; }\n\n.slds-icon-help:hover .slds-icon-help_hover {\n  opacity: 1;\n  transform: scale(1); }\n\n.slds-icon-help:focus {\n  animation: slds-click-global-action 80ms cubic-bezier(1, 1.9, 0.94, 0.98); }\n\n.slds-icon-help:focus .slds-icon-help_focus {\n  opacity: 1;\n  transform: scale(1); }\n\n.slds-icon-help mask {\n  mask-type: alpha; }\n\n/**\n * @summary Modifies hover effect of global help icon\n * @selector .slds-icon-help_hover\n * @restrict .slds-icon-help circle\n */\n.slds-icon-help_hover {\n  opacity: 0;\n  transform: scale(0.1, 0.1);\n  transform-origin: 45px 47px;\n  transition: all 200ms ease-out;\n  fill: #005fb2; }\n\n/**\n * @summary Modifies focus effect of global help icon\n * @selector .slds-icon-help_focus\n * @restrict .slds-icon-help circle\n */\n.slds-icon-help_focus {\n  opacity: 0;\n  transform: scale(0.1, 0.1);\n  transform-origin: 45px 47px;\n  transition: all 200ms ease-out;\n  fill: #0070d2; }\n\n.slds-icon-help svg {\n  width: 1.5rem;\n  height: 1.5rem; }\n\n.slds-icon-help g {\n  -webkit-mask: url(#questionMark);\n          mask: url(#questionMark); }\n\n@keyframes slds-click-global-action {\n  25% {\n    transform: scale(0.95, 0.95); }\n  100% {\n    transform: scale(0.98, 0.98); } }\n\n/**\n * @summary Initializes typing icon\n *\n * @name typing\n * @selector .slds-icon-typing\n * @restrict span\n * @variant\n */\n.slds-icon-typing {\n  display: inline-block;\n  padding: 0.25rem 0;\n  /**\n   * @summary Add when you wish to animate the dots\n   *\n   * @selector .slds-is-animated\n   * @restrict .slds-icon-typing\n   * @modifier\n   */\n  /**\n   * @summary Add when you wish to pause the dots animation\n   *\n   * @selector .slds-is-paused\n   * @restrict .slds-icon-typing\n   * @modifier\n   */ }\n\n.slds-icon-typing.slds-is-animated .slds-icon-typing__dot {\n  animation: slds-icon-typing__dot-first 1.2s infinite ease-in-out; }\n\n.slds-icon-typing.slds-is-animated .slds-icon-typing__dot:nth-child(1) {\n  animation-name: slds-icon-typing__dot-first; }\n\n.slds-icon-typing.slds-is-animated .slds-icon-typing__dot:nth-child(2) {\n  animation-name: slds-icon-typing__dot-second; }\n\n.slds-icon-typing.slds-is-animated .slds-icon-typing__dot:nth-child(3) {\n  animation-name: slds-icon-typing__dot-third; }\n\n.slds-icon-typing.slds-is-paused .slds-icon-typing__dot {\n  animation-play-state: paused; }\n\n/**\n * @summary Dots within the typing icon\n *\n * @selector .slds-icon-typing__dot\n * @restrict .slds-icon-typing span\n */\n.slds-icon-typing__dot {\n  background-color: #dddbda;\n  border-radius: 50%;\n  display: inline-block;\n  height: 0.5rem;\n  margin: 0 0.125rem;\n  width: 0.5rem; }\n\n@keyframes slds-icon-typing__dot-first {\n  0% {\n    background-color: #dddbda; }\n  16% {\n    background-color: #c9c7c5; }\n  33%,\n  100% {\n    background-color: #dddbda; } }\n\n@keyframes slds-icon-typing__dot-second {\n  0%,\n  33% {\n    background-color: #dddbda; }\n  50% {\n    background-color: #c9c7c5; }\n  67%,\n  100% {\n    background-color: #dddbda; } }\n\n@keyframes slds-icon-typing__dot-third {\n  0%,\n  67% {\n    background-color: #dddbda; }\n  83% {\n    background-color: #c9c7c5; }\n  100% {\n    background-color: #dddbda; } }\n\n/**\n * @summary Initiates a carousel component\n * @name base\n * @selector .slds-carousel\n * @restrict div\n * @variant\n */\n.slds-carousel {\n  display: -ms-flexbox;\n  display: flex;\n  position: relative; }\n\n/**\n * @summary Main stage for carousel's tab-panels and tab-list inidicators\n * @selector .slds-carousel__stage\n * @restrict .slds-carousel div\n */\n.slds-carousel__stage {\n  position: relative;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n      flex-direction: column;\n  overflow: hidden; }\n\n/**\n * @summary Tabpanel region that contains all carousel panels\n * @selector .slds-carousel__panels\n * @restrict .slds-carousel__stage div\n */\n.slds-carousel__panels {\n  display: -ms-flexbox;\n  display: flex;\n  transition: transform 250ms ease-in; }\n\n/**\n * @summary Tabpanel region that contains all carousel panels\n * @selector .slds-carousel__panels\n * @restrict .slds-carousel__stage div\n */\n.slds-carousel__panel {\n  -ms-flex: 0 0 100%;\n      flex: 0 0 100%;\n  max-width: 100%; }\n\n/**\n * @summary Actionable element that contains the carousel's tab-panel content\n * @selector .slds-carousel__panel-action\n * @restrict .slds-carousel__stage a\n */\n.slds-carousel__panel-action {\n  display: block;\n  border: 1px solid #dddbda;\n  border-radius: 0.25rem; }\n\n.slds-carousel__panel-action:focus {\n  outline: 0;\n  box-shadow: 0 0 3px #0070D2;\n  border-color: #005fb2;\n  outline: 0; }\n\n/**\n * @summary Element that contains the image inside the carousel's tab-panel\n * @selector .slds-carousel__image\n * @restrict .slds-carousel__panel-action div\n */\n.slds-carousel__image {\n  border-top-left-radius: 0.25rem;\n  border-top-right-radius: 0.25rem;\n  overflow: hidden; }\n\n.slds-carousel__image > img {\n  width: 100%; }\n\n/**\n * @summary Element that contains the content inside the carousel's tab-panel\n * @selector .slds-carousel__content\n * @restrict .slds-carousel__panel-action div\n */\n.slds-carousel__content {\n  background: white;\n  padding: 0.75rem;\n  border-bottom-left-radius: 0.25rem;\n  border-bottom-right-radius: 0.25rem;\n  text-align: center;\n  height: 6.625rem;\n  overflow-x: hidden;\n  overflow-y: auto; }\n\n/**\n * @summary Heading element that contains the title of the carousel's tab-panel\n * @selector .slds-carousel__content-title\n * @restrict .slds-carousel__content h2\n */\n.slds-carousel__content-title {\n  font-size: 1rem;\n  font-weight: 600; }\n\n/**\n * @summary List element that contains the carousel's tab-list inidicators\n * @selector .slds-carousel__indicators\n * @restrict .slds-carousel ul\n */\n.slds-carousel__indicators {\n  -ms-flex-item-align: center;\n      -ms-grid-row-align: center;\n      align-self: center;\n  margin: 0.5rem 0; }\n\n/**\n * @summary Carousel's tab-list inidicator items\n * @selector .slds-carousel__indicator\n * @restrict .slds-carousel__indicators li\n */\n.slds-carousel__indicator {\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  margin: 0 0.25rem; }\n\n/**\n * @summary Actionable element inside of each tab-list indicator\n * @selector .slds-carousel__indicator-action\n * @restrict .slds-carousel__indicator a\n */\n.slds-carousel__indicator-action {\n  width: 1rem;\n  height: 1rem;\n  background: white;\n  border: 1px solid #dddbda;\n  border-radius: 50%;\n  /**\n   * @summary Active state notifying the tab that its current panel is active\n   * @selector .slds-is-active\n   * @restrict .slds-carousel__indicator-action\n   */ }\n\n.slds-carousel__indicator-action.slds-is-active, .slds-carousel__indicator-action.slds-is-active:hover {\n  background: #0070d2;\n  border-color: #0070d2; }\n\n.slds-carousel__indicator-action:hover {\n  background-color: #fafaf9; }\n\n.slds-carousel__indicator-action:focus {\n  outline: 0;\n  box-shadow: 0 0 3px #0070D2;\n  background-color: #005fb2;\n  border-color: #005fb2;\n  outline: 0; }\n\n/**\n * @summary Element that contains the auto-play button icon to toggle on/off\n * @selector .slds-carousel__autoplay\n * @restrict .slds-carousel__stage span\n */\n.slds-carousel__autoplay {\n  position: absolute;\n  left: 0;\n  bottom: 0.25rem; }\n\n/**\n* The base card is used primarily on desktop within a &ldquo;wide&rdquo; column\n* or &ldquo;main content area&rdquo;, which uses two-thirds of the viewport.\n* In addition, the `.slds-card` class is used for layout purposes\n* when a card has an adjacent card, those proceeding the initial will provide margin\n* to give the cards spacing between each other.\n*\n* @summary Initializes card\n*\n* @name base\n* @selector .slds-card\n* @restrict article, div\n* @variant\n*/\n.slds-card {\n  position: relative;\n  padding: 0;\n  background: white;\n  border: 1px solid #dddbda;\n  border-radius: 0.25rem;\n  background-clip: padding-box;\n  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1);\n  /**\n   * Initializes card header\n   *\n   * @selector .slds-card__header\n   * @restrict .slds-card div\n   */\n  /**\n   * Initializes card body\n   *\n   * @selector .slds-card__body\n   * @restrict .slds-card div\n   */\n  /**\n   * Initializes card footer\n   *\n   * @selector .slds-card__footer\n   * @restrict .slds-card footer\n   */ }\n\n.slds-card + .slds-card {\n  margin-top: 0.75rem; }\n\n.slds-card__body_inner, .slds-card__body--inner {\n  padding: 0 1rem; }\n\n.slds-card__header {\n  padding: 0.75rem 1rem 0;\n  margin: 0 0 0.75rem; }\n\n.slds-card__header-link {\n  color: inherit;\n  font-weight: 700; }\n\n.slds-card__body {\n  margin-bottom: 0.75rem; }\n\n.slds-card__body:empty, .slds-card__footer:empty {\n  display: none; }\n\n.slds-card__footer {\n  padding: 0.75rem 1rem;\n  margin-top: 0.75rem;\n  text-align: center;\n  font-size: 0.8125rem;\n  border-top: 1px solid #dddbda; }\n\n.slds-card .slds-card_empty .slds-card__body,\n.slds-card .slds-card--empty .slds-card__body {\n  text-align: center; }\n\n/**\n * Use class if card consumes any form of a tile\n *\n * @selector .slds-card__tile\n * @restrict .slds-tile\n */\n.slds-card__tile {\n  margin-top: 0.5rem; }\n\n.slds-region__pinned-left .slds-card,\n.slds-region__pinned-left .slds-card-wrapper,\n.slds-region__pinned-left .slds-card_boundary,\n.slds-region__pinned-left .slds-tabs_card {\n  border-radius: 0;\n  border: 0;\n  border-bottom: 1px solid #dddbda;\n  box-shadow: none; }\n\n.slds-region__pinned-left .slds-card:last-child,\n.slds-region__pinned-left .slds-card-wrapper:last-child,\n.slds-region__pinned-left .slds-card_boundary:last-child,\n.slds-region__pinned-left .slds-tabs_card:last-child {\n  border-bottom: 0; }\n\n.slds-card-wrapper {\n  padding: 1rem;\n  background: white;\n  border: 1px solid #dddbda;\n  border-radius: 0.25rem;\n  background-clip: padding-box;\n  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1); }\n\n.slds-card-wrapper .slds-card__header,\n.slds-card-wrapper .slds-card__body,\n.slds-card-wrapper .slds-card__footer {\n  padding-left: 0;\n  padding-right: 0; }\n\n.slds-card .slds-card,\n.slds-card .slds-card-wrapper,\n.slds-card-wrapper .slds-card,\n.slds-card-wrapper .slds-card-wrapper,\n.slds-modal .slds-card,\n.slds-modal .slds-card-wrapper,\n.slds-tabs_default .slds-card,\n.slds-tabs_default .slds-card-wrapper,\n.slds-tabs--default .slds-card,\n.slds-tabs--default .slds-card-wrapper,\n.slds-tabs_card .slds-card,\n.slds-tabs_card .slds-card-wrapper,\n.slds-tabs_card.slds-tabs_card .slds-card,\n.slds-tabs_card.slds-tabs_card .slds-card-wrapper {\n  background: white;\n  border: 0;\n  box-shadow: none; }\n\n.slds-card .slds-card_boundary,\n.slds-modal .slds-card_boundary,\n.slds-tabs_default .slds-card_boundary,\n.slds-tabs--default .slds-card_boundary {\n  border: 1px solid #dddbda;\n  border-radius: 0.25rem; }\n\n/**\n * This class allows default tabs to appear to be in a card\n *\n * .slds-tabs_card\n * .slds-tabs_default\n */\n.slds-tabs_card,\n.slds-tabs_card.slds-tabs_card {\n  padding: 1rem;\n  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1);\n  border: 1px solid #dddbda;\n  border-radius: 0.25rem; }\n\n.slds-tabs_card .slds-card,\n.slds-tabs_card .slds-card-wrapper,\n.slds-tabs_card.slds-tabs_card .slds-card,\n.slds-tabs_card.slds-tabs_card .slds-card-wrapper {\n  padding-left: 0;\n  padding-right: 0; }\n\n.slds-tabs_card .slds-card__header,\n.slds-tabs_card .slds-card__body,\n.slds-tabs_card .slds-card__footer,\n.slds-tabs_card.slds-tabs_card .slds-card__header,\n.slds-tabs_card.slds-tabs_card .slds-card__body,\n.slds-tabs_card.slds-tabs_card .slds-card__footer {\n  padding-left: 0;\n  padding-right: 0;\n  margin-left: 0;\n  margin-right: 0; }\n\n.slds-tabs_card .slds-card_boundary,\n.slds-tabs_card.slds-tabs_card .slds-card_boundary,\n.slds-card-wrapper .slds-card_boundary {\n  border: 1px solid #dddbda;\n  border-radius: 0.25rem; }\n\n.slds-tabs_card .slds-card_boundary .slds-card__header,\n.slds-tabs_card.slds-tabs_card .slds-card_boundary .slds-card__header,\n.slds-card-wrapper .slds-card_boundary .slds-card__header {\n  padding: 0.75rem 1rem 0; }\n\n.slds-tabs_card .slds-card_boundary .slds-card__body_inner,\n.slds-tabs_card .slds-card_boundary .slds-card__body--inner,\n.slds-tabs_card.slds-tabs_card .slds-card_boundary .slds-card__body_inner,\n.slds-tabs_card.slds-tabs_card .slds-card_boundary .slds-card__body--inner,\n.slds-card-wrapper .slds-card_boundary .slds-card__body_inner,\n.slds-card-wrapper .slds-card_boundary .slds-card__body--inner {\n  padding: 0 1rem; }\n\n.slds-tabs_card .slds-card_boundary .slds-card__footer,\n.slds-tabs_card.slds-tabs_card .slds-card_boundary .slds-card__footer,\n.slds-card-wrapper .slds-card_boundary .slds-card__footer {\n  padding: 0.75rem 1rem; }\n\n/**\n * This component is used to display a current or past chat session between a customer and a service agent.\n * It appears in the form of a \"Log\"\n *\n * @summary Root container of a chat session\n *\n * @name base\n * @selector .slds-chat\n * @restrict section[role=\"log\"]\n * @variant\n */\n.slds-chat {\n  margin-bottom: 0.75rem; }\n\n/**\n * The chat payload should be displayed in the form of a list. Each item in the list has a number of vertical and horizontal spacing rules based on its type\n *\n * @summary Handles the display of chat items within a list\n *\n * @selector .slds-chat-list\n * @restrict .slds-chat ul\n */\n.slds-chat-list {\n  padding: 0 0.75rem; }\n\n/**\n * @summary Handles spacing and direction of items in the list\n *\n * @selector .slds-chat-listitem\n * @restrict .slds-chat-list li\n */\n.slds-chat-listitem {\n  display: -ms-flexbox;\n  display: flex;\n  margin-top: 0.75rem; }\n\n/**\n * @summary Modifier used to style outbound message list items\n *\n * @selector .slds-chat-listitem_outbound\n * @restrict .slds-chat-listitem\n * @modifier\n */\n.slds-chat-listitem_outbound {\n  -ms-flex-pack: end;\n      justify-content: flex-end; }\n\n/**\n * @summary Modifier used to style inbound message list items\n *\n * @selector .slds-chat-listitem_inbound\n * @restrict .slds-chat-listitem\n * @modifier\n */\n/**\n * @summary Selector to style sibling, same type message list items\n *\n * @selector .slds-chat-listitem_inbound + .slds-chat-listitem_inbound, .slds-chat-listitem_outbound + .slds-chat-listitem_outbound\n */\n.slds-chat-listitem_inbound + .slds-chat-listitem_inbound,\n.slds-chat-listitem_outbound + .slds-chat-listitem_outbound {\n  margin-top: 0.25rem; }\n\n/**\n * @summary Modifier used for spacing bookend items\n *\n * @selector .slds-chat-listitem_bookend\n * @restrict .slds-chat-listitem\n * @modifier\n */\n.slds-chat-listitem_bookend {\n  margin: 1rem 0; }\n\n.slds-chat-listitem_bookend + .slds-chat-listitem_bookend {\n  margin-top: 3rem; }\n\n/**\n * @summary Modifier used for spacing event items\n *\n * @selector .slds-chat-listitem_event\n * @restrict .slds-chat-listitem\n * @modifier\n */\n.slds-chat-listitem_event {\n  margin: 1.5rem 0; }\n\n/**\n * @summary Used to style icons with a chat log\n *\n * @selector .slds-chat-icon\n * @restrict .slds-chat-message__text .slds-icon_container, .slds-chat-event__body .slds-icon_container, .slds-chat-bookend .slds-icon_container\n */\n.slds-chat-icon {\n  margin-right: 0.5rem; }\n\n.slds-chat-icon .slds-icon {\n  fill: #706e6b; }\n\n/**\n * Chat logs are mainly made up of chat messages between an agent and a customer\n *\n * @summary styles the outter part of a chat message\n *\n * @selector .slds-chat-message\n * @restrict .slds-chat-listitem div\n */\n.slds-chat-message {\n  display: -ms-flexbox;\n  display: flex; }\n\n/**\n * @summary Used for when customer avatars are used in consequtive inbound messages to align the message body with the previous message\n *\n * @selector .slds-chat-message_faux-avatar\n * @restrict .slds-chat-message\n * @modifier\n */\n.slds-chat-message_faux-avatar {\n  padding-left: 2.5rem; }\n\n/**\n * @summary Used to style avatars in chat logs\n *\n * @selector .slds-chat-avatar\n * @restrict .slds-chat-message .slds-avatar\n */\n.slds-chat-avatar {\n  margin-right: 0.5rem;\n  min-width: 2rem; }\n\n/**\n * @summary Used to style the avatar intials for chat\n *\n * @selector .slds-chat-avatar__intials\n * @restrict .slds-chat-avatar .slds-avatar__initials\n */\n.slds-chat-avatar__intials {\n  background-color: #f2f2f3;\n  color: #706e6b; }\n\n.slds-chat-avatar__intials.slds-chat-avatar__intials:hover {\n  color: #706e6b; }\n\n/**\n * @summary Used to contain and align chat messages with their avatars\n *\n * @selector .slds-chat-message__body\n * @restrict .slds-chat-message div\n */\n/**\n * @summary Used to style the chat text from agent or customer\n *\n * @selector .slds-chat-message__text\n * @restrict .slds-chat-message__body div\n */\n.slds-chat-message__text {\n  overflow-wrap: break-word;\n  word-wrap: break-word;\n  word-break: break-word;\n  font-size: 0.8125rem;\n  max-width: 420px;\n  white-space: pre-line; }\n\n.slds-chat-message__text a {\n  color: #005fb2;\n  text-decoration: underline; }\n\n.slds-chat-message__text a:hover {\n  text-decoration: none; }\n\n.slds-chat-message__text_inbound,\n.slds-chat-message__text_outbound,\n.slds-chat-message__text_outbound-agent {\n  border-radius: 0.5rem 0.5rem 0;\n  color: white;\n  min-height: 2rem;\n  padding: 0.5rem; }\n\n/**\n * @summary Used for any specific inbound text styling\n *\n * @selector .slds-chat-message__text_inbound\n * @restrict .slds-chat-message__text\n * @modifier\n */\n.slds-chat-message__text_inbound {\n  background-color: #f2f2f3;\n  border-radius: 0.5rem 0.5rem 0.5rem 0;\n  color: #3e3e3c; }\n\n/**\n * @summary Used for any specific outbound text styling\n *\n * @selector .slds-chat-message__text_outbound\n * @restrict .slds-chat-message__text\n * @modifier\n */\n.slds-chat-message__text_outbound {\n  background-color: #005fb2; }\n\n/**\n * @summary Used for any specific outbound (from another agent) text styling\n *\n * @selector .slds-chat-message__text_outbound-agent\n * @restrict .slds-chat-message__text\n * @modifier\n */\n.slds-chat-message__text_outbound-agent {\n  background-color: #6b6d70; }\n\n.slds-chat-message__text_outbound a,\n.slds-chat-message__text_outbound-agent a {\n  color: white;\n  text-decoration: underline; }\n\n/**\n * @summary Used when sneak peak is enabled for customer messages\n *\n * @selector .slds-chat-message__text_sneak-peak\n * @restrict .slds-chat-message__text\n * @modifier\n */\n.slds-chat-message__text_sneak-peak {\n  font-style: italic; }\n\n.slds-chat-message__text_sneak-peak .slds-icon-typing {\n  margin-right: 0.5rem; }\n\n/**\n * @summary Used to style chat message meta data\n *\n * @selector .slds-chat-message__meta\n * @restrict .slds-chat-message div\n */\n.slds-chat-message__meta {\n  color: #706e6b;\n  font-size: 0.75rem;\n  margin: 0.125rem 0 0 0.5rem; }\n\n/**\n * During any chat, certain events can occur which need to be displayed to the user\n *\n * @selector .slds-chat-event\n * @restrict .slds-chat-listitem div\n */\n.slds-chat-event {\n  -ms-flex-align: center;\n      align-items: center;\n  color: #706e6b;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n  -ms-flex-pack: center;\n      justify-content: center;\n  font-size: 0.8125rem;\n  text-align: center;\n  width: 100%;\n  /**\n    * @summary Modifier to indicate the event was an error\n    *\n    * @selector .slds-has-error\n    * @restrict .slds-chat-event[role=\"alert\"]\n    * @modifier\n    */ }\n\n.slds-chat-event.slds-has-error {\n  color: #c23934; }\n\n.slds-chat-event.slds-has-error svg {\n  fill: #c23934; }\n\n/**\n  * @summary Used to style the horizontal rules on an event\n  *\n  * @selector .slds-chat-event__rule\n  * @restrict .slds-chat-event div\n  */\n.slds-chat-event__rule {\n  border-top: 1px #dddbda solid;\n  height: 1px;\n  -ms-flex-positive: 1;\n      flex-grow: 1; }\n\n/**\n  * @summary Used for styling the event body text\n  *\n  * @selector .slds-chat-event__body\n  * @restrict .slds-chat-event div\n  */\n.slds-chat-event__body {\n  -ms-flex-align: center;\n      align-items: center;\n  display: -ms-flexbox;\n  display: flex;\n  margin: 0 0.5rem; }\n\n/**\n  * @summary Used to style any messages from an agent in the event\n  *\n  * @selector .slds-chat-event__agent-message\n  * @restrict .slds-chat-event div\n  */\n.slds-chat-event__agent-message {\n  -ms-flex-positive: 3;\n      flex-grow: 3;\n  font-size: 0.75rem;\n  font-style: italic;\n  margin-top: 0.5rem;\n  width: 100%; }\n\n/**\n * Chat sessions are started and stopped with bookends to the conversation\n *\n * @summary Used to style a chat bookend\n *\n * @selector .slds-chat-bookend\n * @restrict .slds-chat-listitem div\n */\n.slds-chat-bookend {\n  -ms-flex-align: center;\n      align-items: center;\n  border: #dddbda 0 solid;\n  border-bottom-width: 1px;\n  color: #706e6b;\n  display: -ms-flexbox;\n  display: flex;\n  font-size: 0.8125rem;\n  -ms-flex-pack: center;\n      justify-content: center;\n  padding: 0.5rem 0;\n  width: 100%; }\n\n/**\n * @summary Modifier for bookends which stop a chat session\n *\n * @selector .slds-chat-bookend_stop\n * @restrict .slds-chat-bookend\n * @modifier\n */\n.slds-chat-bookend_stop {\n  border-width: 1px 0 0; }\n\n/**\n *  Past chat logs are displayed differently for ease of scanning\n *\n * @summary Apply when displaying chat logs that appeared in the past\n *\n * @variant\n * @name past\n * @selector .slds-chat_past\n * @restrict section[role=\"log\"]\n */\n.slds-chat_past .slds-chat-listitem_event {\n  margin: 1rem 0; }\n\n.slds-chat_past .slds-chat-message__meta {\n  margin: 0.25rem 0 0; }\n\n.slds-chat_past .slds-chat-message__meta b {\n  color: #3e3e3c; }\n\n/**\n * @summary Creates layout for a form element\n *\n * @name base\n * @selector .slds-form-element\n * @restrict div, fieldset, li\n * @variant\n */\n.slds-form-element {\n  position: relative;\n  /**\n   * Creates label styles for our form elements\n   *\n   * @selector .slds-form-element__label\n   * @restrict .slds-form-element label, .slds-form-element span, .slds-form-element legend, [class*='slds-checkbox'] span, [class*='slds-radio'] span, span\n   */\n  /**\n   * Wrapper to any form display element\n   *\n   * @selector .slds-form-element__control\n   * @restrict .slds-form-element div\n   */\n  /**\n   * When an icon sits within a form element wrapper and adjacent to another\n   * element inside that wrapper such as a .form-element__label\n   *\n   * @selector .slds-form-element__icon\n   * @restrict .slds-form-element div\n   */\n  /**\n   * Creates inline help styles, sits below .form-element__control\n   *\n   * @selector .slds-form-element__help\n   * @restrict .slds-form-element div\n   */ }\n\n.slds-form-element__helper {\n  font-size: 0.75rem; }\n\n.slds-form-element__label {\n  display: inline-block;\n  color: #706e6b;\n  font-size: 0.75rem;\n  line-height: 1.5;\n  margin-right: 0.75rem;\n  margin-bottom: 0.125rem; }\n\n.slds-form-element__label:empty {\n  margin: 0; }\n\n.slds-form-element__control .slds-radio,\n.slds-form-element__control .slds-checkbox {\n  display: block; }\n\n.slds-form-element__icon {\n  display: inline-block;\n  position: relative; }\n\n.slds-form-element__help {\n  font-size: 0.75rem;\n  margin-top: 0.5rem;\n  display: block; }\n\n.slds-form-element_edit .slds-form-element__static, .slds-form-element--edit .slds-form-element__static {\n  width: calc(100% - 1.5rem); }\n\n/**\n * Required Star\n *\n * @selector .slds-required\n * @restrict .slds-form-element abbr, abbr\n */\n.slds-required {\n  color: #c23934;\n  margin: 0 0.125rem; }\n\n/**\n * Error styles for form element\n *\n * @selector .slds-has-error\n * @restrict .slds-form-element\n * @modifier\n * @group feedback\n */\n.slds-has-error .slds-form-element__help {\n  color: #c23934; }\n\n/**\n * @summary Initializes text input\n *\n * @name base\n * @selector .slds-input\n * @restrict input\n * @required\n * @variant\n */\n.slds-input {\n  background-color: white;\n  border: 1px solid #dddbda;\n  border-radius: 0.25rem;\n  width: 100%;\n  transition: border 0.1s linear, background-color 0.1s linear;\n  display: inline-block;\n  padding: 0 1rem 0 0.75rem;\n  line-height: 1.875rem;\n  min-height: calc(1.875rem + (1px * 2));\n  /**\n   * @selector [readonly]\n   * @restrict .slds-input\n   */\n  /**\n   * Removes aesthetic nature from an input\n   *\n   * @selector .slds-input_bare\n   * @restrict .slds-input, input, textarea\n   * @modifier\n   */\n  /**\n   * Used to apply an input size to another element thats a non input\n   * Because sometimes I need elements the same height as inputs\n   *\n   * @selector .slds-input_height\n   * @restrict .slds-input\n   */ }\n\n.slds-input:focus, .slds-input:active {\n  outline: 0;\n  border-color: #1589ee;\n  background-color: white;\n  box-shadow: 0 0 3px #0070D2; }\n\n.slds-input[disabled], .slds-input.slds-is-disabled {\n  background-color: #ecebea;\n  border-color: #c9c7c5;\n  cursor: not-allowed;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none; }\n\n.slds-input[disabled]:focus, .slds-input[disabled]:active, .slds-input.slds-is-disabled:focus, .slds-input.slds-is-disabled:active {\n  box-shadow: none; }\n\n.slds-input[readonly] {\n  padding-left: 0;\n  border-color: transparent;\n  background-color: transparent;\n  font-size: 0.875rem;\n  font-weight: 400; }\n\n.slds-input[type=\"search\"]::-ms-clear {\n  display: none;\n  width: 0;\n  height: 0; }\n\n.slds-input_bare, .slds-input--bare {\n  background-color: transparent;\n  border: 0;\n  padding-top: 0;\n  padding-bottom: 0;\n  padding-left: 0.75rem;\n  color: #3e3e3c;\n  line-height: 1.875rem; }\n\n.slds-input_bare:focus, .slds-input_bare:active, .slds-input--bare:focus, .slds-input--bare:active {\n  outline: 0;\n  box-shadow: none; }\n\n.slds-input_height, .slds-input--height {\n  min-height: calc(1.875rem + (1px * 2)); }\n\n/**\n * @summary Modifier to allow a [readonly] input to have borders\n *\n * @selector .slds-input_borders\n * @restrict .slds-input\n */\n.slds-input_borders {\n  padding-left: 0.75rem;\n  border-color: #dddbda; }\n\n/**\n * @summary Modifier if text input has svg icon adjacent to input\n *\n * @selector .slds-input-has-icon\n * @restrict .slds-form-element div\n */\n.slds-input-has-icon {\n  position: relative;\n  /**\n   * Hook for .slds-input-has-icon\n   *\n   * @selector .slds-input__icon\n   * @restrict .slds-input-has-icon svg, .slds-input-has-icon button, .slds-input-has-icon span\n   */\n  /**\n   * Positions .slds-input__icon to the left of the text input\n   *\n   * @selector .slds-input-has-icon_left\n   * @restrict .slds-input-has-icon\n   */\n  /**\n   * Positions .slds-input__icon to the right of the text input\n   *\n   * @selector .slds-input-has-icon_right\n   * @restrict .slds-input-has-icon\n   */\n  /**\n   * Positions .slds-input__icon_left to the left of the text input and .slds-input__icon_right to the right of the text input\n   *\n   * @selector .slds-input-has-icon_left-right\n   * @restrict .slds-input-has-icon\n   */ }\n\n.slds-input-has-icon .slds-input__icon {\n  width: 0.875rem;\n  height: 0.875rem;\n  position: absolute;\n  top: 50%;\n  margin-top: -0.4375rem;\n  line-height: 1;\n  border: 0;\n  /* @Todo - we need to be sure this is deprecated since the color sems to be the correct gray I see in specs */\n  fill: #b0adab; }\n\n.slds-input-has-icon_left .slds-input__icon, .slds-input-has-icon--left .slds-input__icon {\n  left: 0.75rem; }\n\n.slds-input-has-icon_left .slds-input,\n.slds-input-has-icon_left .slds-input_bare,\n.slds-input-has-icon_left .slds-input--bare, .slds-input-has-icon--left .slds-input,\n.slds-input-has-icon--left .slds-input_bare,\n.slds-input-has-icon--left .slds-input--bare {\n  padding-left: 2rem; }\n\n.slds-input-has-icon_right .slds-input__icon, .slds-input-has-icon--right .slds-input__icon {\n  right: 0.75rem; }\n\n.slds-input-has-icon_right .slds-input,\n.slds-input-has-icon_right .slds-input_bare,\n.slds-input-has-icon_right .slds-input--bare, .slds-input-has-icon--right .slds-input,\n.slds-input-has-icon--right .slds-input_bare,\n.slds-input-has-icon--right .slds-input--bare {\n  padding-right: 2rem; }\n\n.slds-input-has-icon_left-right, .slds-input-has-icon--left-right {\n  /**\n     * Hook for .slds-input-has-icon--left-right\n     *\n     * @selector .slds-input__icon_left\n     * @restrict .slds-input__icon\n     */\n  /**\n     * Hook for .slds-input-has-icon_left-right\n     *\n     * @selector .slds-input__icon_right\n     * @restrict .slds-input__icon\n     */ }\n\n.slds-input-has-icon_left-right .slds-input__icon_left,\n.slds-input-has-icon_left-right .slds-input__icon--left, .slds-input-has-icon--left-right .slds-input__icon_left,\n.slds-input-has-icon--left-right .slds-input__icon--left {\n  left: 0.75rem; }\n\n.slds-input-has-icon_left-right .slds-input__icon_right,\n.slds-input-has-icon_left-right .slds-input__icon--right, .slds-input-has-icon--left-right .slds-input__icon_right,\n.slds-input-has-icon--left-right .slds-input__icon--right {\n  right: 0.75rem; }\n\n.slds-input-has-icon_left-right .slds-input,\n.slds-input-has-icon_left-right .slds-input_bare,\n.slds-input-has-icon_left-right .slds-input--bare, .slds-input-has-icon--left-right .slds-input,\n.slds-input-has-icon--left-right .slds-input_bare,\n.slds-input-has-icon--left-right .slds-input--bare {\n  padding: 0 2rem; }\n\n/**\n * Positions two items (icons and/or spinners) on one side or the other of the input\n *\n * @selector .slds-input__icon-group\n * @restrict .slds-input-has-icon div\n */\n.slds-input__icon-group {\n  position: absolute;\n  height: 1rem;\n  margin-top: -0.5rem; }\n\n/**\n * Positions the close icon and spinner on the right side of the input while searching\n *\n * @selector .slds-input__icon-group_right\n * @restrict .slds-input__icon-group\n */\n.slds-input__icon-group_right {\n  right: 0;\n  top: 50%; }\n\n.slds-input__icon-group_right .slds-input__icon_right,\n.slds-input__icon-group_right .slds-input__icon--right {\n  right: 0.5rem; }\n\n.slds-input__icon-group_right .slds-input__spinner {\n  right: 1.5rem;\n  left: auto; }\n\n/**\n * @summary Use on input container to let it know there is fixed text to the left or right of the input\n *\n * @selector .slds-input-has-fixed-addon\n * @restrict .slds-form-element .slds-form-element__control\n */\n.slds-input-has-fixed-addon {\n  display: -ms-flexbox;\n  display: flex; }\n\n/**\n * Fixed text that sits to the left or right of an input\n *\n * @selector .slds-form-element__addon\n * @restrict .slds-form-element span\n */\n.slds-form-element__addon {\n  display: inline-block;\n  margin: 0 0.5rem;\n  -ms-flex-item-align: center;\n      -ms-grid-row-align: center;\n      align-self: center; }\n\n/**\n * Read-only components are used to display immutable data within a form\n *\n * @summary Initializes read-only form element\n *\n * @selector .slds-form-element__static\n * @restrict .slds-form-element span, .slds-form-element div\n */\n.slds-form-element__static {\n  display: inline-block;\n  padding-top: 0.25rem;\n  padding-bottom: 0.25rem;\n  min-height: calc(1.875rem + 2px);\n  font-size: 0.875rem;\n  font-weight: 400;\n  color: #2b2826;\n  /**\n   * Inline Edit on static form element\n   *\n   * @selector .slds-form-element__static_edit\n   * @restrict .slds-form-element__static\n   */ }\n\n.slds-form-element__static.slds-text-longform {\n  line-height: 1.5; }\n\n.slds-form-element__static--edit {\n  width: calc(100% - 1.5rem); }\n\n.slds-has-error .slds-input {\n  background-color: white;\n  border-color: #c23934;\n  box-shadow: #c23934 0 0 0 1px inset;\n  background-clip: padding-box; }\n\n.slds-has-error .slds-input:focus, .slds-has-error .slds-input:active {\n  box-shadow: #c23934 0 0 0 1px inset, 0 0 3px #0070D2; }\n\n.slds-has-error .slds-input__icon {\n  fill: #c23934;\n  color: #c23934; }\n\n/**\n * @summary Initialize textarea\n *\n * @name base\n * @selector .slds-textarea\n * @restrict textarea\n * @required\n * @variant\n */\n.slds-textarea {\n  background-color: white;\n  border: 1px solid #dddbda;\n  border-radius: 0.25rem;\n  width: 100%;\n  transition: border 0.1s linear, background-color 0.1s linear;\n  resize: vertical;\n  padding: 0.5rem 0.75rem; }\n\n.slds-textarea:focus, .slds-textarea:active {\n  outline: 0;\n  border-color: #1589ee;\n  background-color: white;\n  box-shadow: 0 0 3px #0070D2; }\n\n.slds-textarea[disabled], .slds-textarea.slds-is-disabled {\n  background-color: #ecebea;\n  border-color: #c9c7c5;\n  cursor: not-allowed;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none; }\n\n.slds-textarea[disabled]:focus, .slds-textarea[disabled]:active, .slds-textarea.slds-is-disabled:focus, .slds-textarea.slds-is-disabled:active {\n  box-shadow: none; }\n\n.slds-has-error .slds-textarea {\n  background-color: white;\n  border-color: #c23934;\n  box-shadow: #c23934 0 0 0 1px inset;\n  background-clip: padding-box; }\n\n.slds-has-error .slds-textarea:focus, .slds-has-error .slds-textarea:active {\n  box-shadow: #c23934 0 0 0 1px inset, 0 0 3px #0070D2; }\n\n/**\n * @summary Initializes radio button\n *\n * @name base\n * @selector .slds-radio\n * @restrict span\n * @variant\n */\n.slds-radio {\n  display: inline-block;\n  /**\n   * Creates a custom styled radio button\n   *\n   * @selector .slds-radio_faux\n   * @restrict [class*='slds-radio'] span\n   */ }\n\n.slds-radio .slds-radio_faux,\n.slds-radio .slds-radio--faux {\n  width: 1rem;\n  height: 1rem;\n  display: inline-block;\n  position: relative;\n  vertical-align: middle;\n  border: 1px solid #dddbda;\n  border-radius: 50%;\n  background: white;\n  transition: border 0.1s linear, background-color 0.1s linear; }\n\n.slds-radio .slds-form-element__label {\n  display: inline;\n  vertical-align: middle;\n  font-size: 0.8125rem; }\n\n.slds-radio [type=\"radio\"] {\n  width: 1px;\n  height: 1px;\n  border: 0;\n  clip: rect(0 0 0 0);\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute; }\n\n.slds-radio [type=\"radio\"]:checked + .slds-radio_faux,\n.slds-radio [type=\"radio\"]:checked + .slds-radio--faux,\n.slds-radio [type=\"radio\"]:checked ~ .slds-radio_faux,\n.slds-radio [type=\"radio\"]:checked ~ .slds-radio--faux,\n.slds-radio [type=\"radio\"]:checked + .slds-radio__label .slds-radio_faux,\n.slds-radio [type=\"radio\"]:checked + .slds-radio__label .slds-radio--faux {\n  background: white; }\n\n.slds-radio [type=\"radio\"]:checked + .slds-radio_faux:after,\n.slds-radio [type=\"radio\"]:checked + .slds-radio--faux:after,\n.slds-radio [type=\"radio\"]:checked ~ .slds-radio_faux:after,\n.slds-radio [type=\"radio\"]:checked ~ .slds-radio--faux:after,\n.slds-radio [type=\"radio\"]:checked + .slds-radio__label .slds-radio_faux:after,\n.slds-radio [type=\"radio\"]:checked + .slds-radio__label .slds-radio--faux:after {\n  width: 0.5rem;\n  height: 0.5rem;\n  content: '';\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate3d(-50%, -50%, 0);\n  border-radius: 50%;\n  background: #0070d2; }\n\n.slds-radio [type=\"radio\"]:focus + .slds-radio_faux,\n.slds-radio [type=\"radio\"]:focus + .slds-radio--faux,\n.slds-radio [type=\"radio\"]:focus ~ .slds-radio_faux,\n.slds-radio [type=\"radio\"]:focus ~ .slds-radio--faux,\n.slds-radio [type=\"radio\"]:focus + .slds-radio__label .slds-radio_faux,\n.slds-radio [type=\"radio\"]:focus + .slds-radio__label .slds-radio--faux {\n  border-color: #1589ee;\n  box-shadow: 0 0 3px #0070D2; }\n\n.slds-radio [type=\"radio\"][disabled] {\n  cursor: not-allowed;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none; }\n\n.slds-radio [type=\"radio\"][disabled] ~ .slds-radio_faux,\n.slds-radio [type=\"radio\"][disabled] ~ .slds-radio--faux,\n.slds-radio [type=\"radio\"][disabled] + .slds-radio__label .slds-radio_faux,\n.slds-radio [type=\"radio\"][disabled] + .slds-radio__label .slds-radio--faux {\n  background-color: #ecebea;\n  border-color: #c9c7c5; }\n\n.slds-has-error .slds-radio [type='radio'] + .slds-radio_faux,\n.slds-has-error .slds-radio [type='radio'] + .slds-radio--faux,\n.slds-has-error .slds-radio [type='radio'] ~ .slds-radio_faux,\n.slds-has-error .slds-radio [type='radio'] ~ .slds-radio--faux,\n.slds-has-error .slds-radio [type='radio'] + .slds-radio__label .slds-radio_faux,\n.slds-has-error .slds-radio [type='radio'] + .slds-radio__label .slds-radio--faux {\n  border-color: #c23934;\n  border-width: 2px; }\n\n.slds-has-error .slds-radio [type='radio']:checked + .slds-radio_faux,\n.slds-has-error .slds-radio [type='radio']:checked + .slds-radio--faux,\n.slds-has-error .slds-radio [type='radio']:checked ~ .slds-radio_faux,\n.slds-has-error .slds-radio [type='radio']:checked ~ .slds-radio--faux,\n.slds-has-error .slds-radio [type='radio']:checked + .slds-radio__label .slds-radio_faux,\n.slds-has-error .slds-radio [type='radio']:checked + .slds-radio__label .slds-radio--faux {\n  background: white; }\n\n.slds-has-error .slds-radio [type='radio']:checked + .slds-radio_faux:after,\n.slds-has-error .slds-radio [type='radio']:checked + .slds-radio--faux:after,\n.slds-has-error .slds-radio [type='radio']:checked ~ .slds-radio_faux:after,\n.slds-has-error .slds-radio [type='radio']:checked ~ .slds-radio--faux:after,\n.slds-has-error .slds-radio [type='radio']:checked + .slds-radio__label .slds-radio_faux:after,\n.slds-has-error .slds-radio [type='radio']:checked + .slds-radio__label .slds-radio--faux:after {\n  background: #d4504c; }\n\n.slds-form-element .slds-radio [type='radio'] + .slds-radio_faux,\n.slds-form-element .slds-radio [type='radio'] + .slds-radio--faux,\n.slds-form-element .slds-radio [type='radio'] ~ .slds-radio_faux,\n.slds-form-element .slds-radio [type='radio'] ~ .slds-radio--faux,\n.slds-radio [type='radio'] + .slds-radio__label .slds-radio_faux,\n.slds-radio [type='radio'] + .slds-radio__label .slds-radio--faux {\n  margin-right: 0.5rem; }\n\n/**\n * @summary Initializes radio button\n *\n * @name base\n * @selector .slds-radio_button-group\n * @restrict div\n * @required\n * @variant\n */\n.slds-radio_button-group,\n.slds-radio--button-group {\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  border: 1px solid #dddbda;\n  border-radius: 0.25rem; }\n\n/**\n * @selector .slds-radio_button\n * @restrict .slds-radio_button-group span\n */\n.slds-radio_button,\n.slds-radio--button {\n  display: -ms-flexbox;\n  display: flex;\n  border: 0;\n  border-radius: 0;\n  background-clip: padding-box;\n  /**\n   * Create styled button when adjacent to the input[radio] element\n   *\n   * @selector .slds-radio_faux\n   * @restrict .slds-radio_button span\n   */ }\n\n.slds-radio_button .slds-radio_faux,\n.slds-radio_button .slds-radio--faux,\n.slds-radio--button .slds-radio_faux,\n.slds-radio--button .slds-radio--faux {\n  padding-left: 1rem;\n  padding-right: 1rem;\n  text-align: center;\n  vertical-align: middle; }\n\n.slds-radio_button + .slds-radio_button,\n.slds-radio_button + .slds-radio--button,\n.slds-radio--button + .slds-radio_button,\n.slds-radio--button + .slds-radio--button {\n  border-left: 1px solid #dddbda;\n  margin: 0; }\n\n.slds-radio_button:first-child > .slds-radio_faux,\n.slds-radio_button:first-child > .slds-radio--faux,\n.slds-radio_button:first-child > .slds-radio_button__label,\n.slds-radio_button:first-child > .slds-radio--button__label,\n.slds-radio--button:first-child > .slds-radio_faux,\n.slds-radio--button:first-child > .slds-radio--faux,\n.slds-radio--button:first-child > .slds-radio_button__label,\n.slds-radio--button:first-child > .slds-radio--button__label {\n  border-radius: 0.25rem 0 0 0.25rem; }\n\n.slds-radio_button:last-child > .slds-radio_faux,\n.slds-radio_button:last-child > .slds-radio--faux,\n.slds-radio_button .slds-button_last > .slds-radio_faux,\n.slds-radio_button .slds-button--last > .slds-radio--faux,\n.slds-radio_button:last-child > .slds-radio_button__label,\n.slds-radio_button:last-child > .slds-radio--button__label,\n.slds-radio--button:last-child > .slds-radio_faux,\n.slds-radio--button:last-child > .slds-radio--faux,\n.slds-radio--button .slds-button_last > .slds-radio_faux,\n.slds-radio--button .slds-button--last > .slds-radio--faux,\n.slds-radio--button:last-child > .slds-radio_button__label,\n.slds-radio--button:last-child > .slds-radio--button__label {\n  border-radius: 0 0.25rem 0.25rem 0; }\n\n.slds-radio_button [type=\"radio\"],\n.slds-radio--button [type=\"radio\"] {\n  width: 1px;\n  height: 1px;\n  border: 0;\n  clip: rect(0 0 0 0);\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute; }\n\n.slds-radio_button [type=\"radio\"]:checked + .slds-radio_faux,\n.slds-radio_button [type=\"radio\"]:checked + .slds-radio--faux,\n.slds-radio_button [type=\"radio\"]:checked ~ .slds-radio_faux,\n.slds-radio_button [type=\"radio\"]:checked ~ .slds-radio--faux,\n.slds-radio_button [type=\"radio\"]:checked + .slds-radio_button__label,\n.slds-radio_button [type=\"radio\"]:checked + .slds-radio--button__label,\n.slds-radio--button [type=\"radio\"]:checked + .slds-radio_faux,\n.slds-radio--button [type=\"radio\"]:checked + .slds-radio--faux,\n.slds-radio--button [type=\"radio\"]:checked ~ .slds-radio_faux,\n.slds-radio--button [type=\"radio\"]:checked ~ .slds-radio--faux,\n.slds-radio--button [type=\"radio\"]:checked + .slds-radio_button__label,\n.slds-radio--button [type=\"radio\"]:checked + .slds-radio--button__label {\n  background-color: #0070d2;\n  color: white; }\n\n.slds-radio_button [type=\"radio\"]:checked + .slds-radio_faux:hover, .slds-radio_button [type=\"radio\"]:checked + .slds-radio_faux:focus,\n.slds-radio_button [type=\"radio\"]:checked + .slds-radio--faux:hover,\n.slds-radio_button [type=\"radio\"]:checked + .slds-radio--faux:focus,\n.slds-radio_button [type=\"radio\"]:checked ~ .slds-radio_faux:hover,\n.slds-radio_button [type=\"radio\"]:checked ~ .slds-radio_faux:focus,\n.slds-radio_button [type=\"radio\"]:checked ~ .slds-radio--faux:hover,\n.slds-radio_button [type=\"radio\"]:checked ~ .slds-radio--faux:focus,\n.slds-radio_button [type=\"radio\"]:checked + .slds-radio_button__label:hover,\n.slds-radio_button [type=\"radio\"]:checked + .slds-radio_button__label:focus,\n.slds-radio_button [type=\"radio\"]:checked + .slds-radio--button__label:hover,\n.slds-radio_button [type=\"radio\"]:checked + .slds-radio--button__label:focus,\n.slds-radio--button [type=\"radio\"]:checked + .slds-radio_faux:hover,\n.slds-radio--button [type=\"radio\"]:checked + .slds-radio_faux:focus,\n.slds-radio--button [type=\"radio\"]:checked + .slds-radio--faux:hover,\n.slds-radio--button [type=\"radio\"]:checked + .slds-radio--faux:focus,\n.slds-radio--button [type=\"radio\"]:checked ~ .slds-radio_faux:hover,\n.slds-radio--button [type=\"radio\"]:checked ~ .slds-radio_faux:focus,\n.slds-radio--button [type=\"radio\"]:checked ~ .slds-radio--faux:hover,\n.slds-radio--button [type=\"radio\"]:checked ~ .slds-radio--faux:focus,\n.slds-radio--button [type=\"radio\"]:checked + .slds-radio_button__label:hover,\n.slds-radio--button [type=\"radio\"]:checked + .slds-radio_button__label:focus,\n.slds-radio--button [type=\"radio\"]:checked + .slds-radio--button__label:hover,\n.slds-radio--button [type=\"radio\"]:checked + .slds-radio--button__label:focus {\n  background-color: #005fb2; }\n\n.slds-radio_button [type=\"radio\"]:focus + .slds-radio_faux,\n.slds-radio_button [type=\"radio\"]:focus + .slds-radio--faux,\n.slds-radio_button [type=\"radio\"]:focus ~ .slds-radio_faux,\n.slds-radio_button [type=\"radio\"]:focus ~ .slds-radio--faux,\n.slds-radio_button [type=\"radio\"]:focus + .slds-radio_button__label,\n.slds-radio_button [type=\"radio\"]:focus + .slds-radio--button__label,\n.slds-radio--button [type=\"radio\"]:focus + .slds-radio_faux,\n.slds-radio--button [type=\"radio\"]:focus + .slds-radio--faux,\n.slds-radio--button [type=\"radio\"]:focus ~ .slds-radio_faux,\n.slds-radio--button [type=\"radio\"]:focus ~ .slds-radio--faux,\n.slds-radio--button [type=\"radio\"]:focus + .slds-radio_button__label,\n.slds-radio--button [type=\"radio\"]:focus + .slds-radio--button__label {\n  outline: 0;\n  box-shadow: 0 0 3px #0070D2;\n  z-index: 1; }\n\n.slds-radio_button [type=\"radio\"][disabled] + .slds-radio_faux,\n.slds-radio_button [type=\"radio\"][disabled] + .slds-radio--faux,\n.slds-radio_button [type=\"radio\"][disabled] ~ .slds-radio_faux,\n.slds-radio_button [type=\"radio\"][disabled] ~ .slds-radio--faux,\n.slds-radio_button [type=\"radio\"][disabled] + .slds-radio_button__label,\n.slds-radio_button [type=\"radio\"][disabled] + .slds-radio--button__label,\n.slds-radio--button [type=\"radio\"][disabled] + .slds-radio_faux,\n.slds-radio--button [type=\"radio\"][disabled] + .slds-radio--faux,\n.slds-radio--button [type=\"radio\"][disabled] ~ .slds-radio_faux,\n.slds-radio--button [type=\"radio\"][disabled] ~ .slds-radio--faux,\n.slds-radio--button [type=\"radio\"][disabled] + .slds-radio_button__label,\n.slds-radio--button [type=\"radio\"][disabled] + .slds-radio--button__label {\n  background-color: white;\n  color: #dddbda; }\n\n.slds-radio_button [type=\"radio\"][disabled] + .slds-radio_faux:hover, .slds-radio_button [type=\"radio\"][disabled] + .slds-radio_faux:focus,\n.slds-radio_button [type=\"radio\"][disabled] + .slds-radio--faux:hover,\n.slds-radio_button [type=\"radio\"][disabled] + .slds-radio--faux:focus,\n.slds-radio_button [type=\"radio\"][disabled] ~ .slds-radio_faux:hover,\n.slds-radio_button [type=\"radio\"][disabled] ~ .slds-radio_faux:focus,\n.slds-radio_button [type=\"radio\"][disabled] ~ .slds-radio--faux:hover,\n.slds-radio_button [type=\"radio\"][disabled] ~ .slds-radio--faux:focus,\n.slds-radio_button [type=\"radio\"][disabled] + .slds-radio_button__label:hover,\n.slds-radio_button [type=\"radio\"][disabled] + .slds-radio_button__label:focus,\n.slds-radio_button [type=\"radio\"][disabled] + .slds-radio--button__label:hover,\n.slds-radio_button [type=\"radio\"][disabled] + .slds-radio--button__label:focus,\n.slds-radio--button [type=\"radio\"][disabled] + .slds-radio_faux:hover,\n.slds-radio--button [type=\"radio\"][disabled] + .slds-radio_faux:focus,\n.slds-radio--button [type=\"radio\"][disabled] + .slds-radio--faux:hover,\n.slds-radio--button [type=\"radio\"][disabled] + .slds-radio--faux:focus,\n.slds-radio--button [type=\"radio\"][disabled] ~ .slds-radio_faux:hover,\n.slds-radio--button [type=\"radio\"][disabled] ~ .slds-radio_faux:focus,\n.slds-radio--button [type=\"radio\"][disabled] ~ .slds-radio--faux:hover,\n.slds-radio--button [type=\"radio\"][disabled] ~ .slds-radio--faux:focus,\n.slds-radio--button [type=\"radio\"][disabled] + .slds-radio_button__label:hover,\n.slds-radio--button [type=\"radio\"][disabled] + .slds-radio_button__label:focus,\n.slds-radio--button [type=\"radio\"][disabled] + .slds-radio--button__label:hover,\n.slds-radio--button [type=\"radio\"][disabled] + .slds-radio--button__label:focus {\n  cursor: default; }\n\n.slds-radio_button [type=\"radio\"][disabled]:checked + .slds-radio_faux:hover, .slds-radio_button [type=\"radio\"][disabled]:checked + .slds-radio_faux:focus,\n.slds-radio_button [type=\"radio\"][disabled]:checked + .slds-radio--faux:hover,\n.slds-radio_button [type=\"radio\"][disabled]:checked + .slds-radio--faux:focus,\n.slds-radio_button [type=\"radio\"][disabled]:checked ~ .slds-radio_faux:hover,\n.slds-radio_button [type=\"radio\"][disabled]:checked ~ .slds-radio_faux:focus,\n.slds-radio_button [type=\"radio\"][disabled]:checked ~ .slds-radio--faux:hover,\n.slds-radio_button [type=\"radio\"][disabled]:checked ~ .slds-radio--faux:focus,\n.slds-radio_button [type=\"radio\"][disabled]:checked + .slds-radio_button__label:hover,\n.slds-radio_button [type=\"radio\"][disabled]:checked + .slds-radio_button__label:focus,\n.slds-radio_button [type=\"radio\"][disabled]:checked + .slds-radio--button__label:hover,\n.slds-radio_button [type=\"radio\"][disabled]:checked + .slds-radio--button__label:focus,\n.slds-radio--button [type=\"radio\"][disabled]:checked + .slds-radio_faux:hover,\n.slds-radio--button [type=\"radio\"][disabled]:checked + .slds-radio_faux:focus,\n.slds-radio--button [type=\"radio\"][disabled]:checked + .slds-radio--faux:hover,\n.slds-radio--button [type=\"radio\"][disabled]:checked + .slds-radio--faux:focus,\n.slds-radio--button [type=\"radio\"][disabled]:checked ~ .slds-radio_faux:hover,\n.slds-radio--button [type=\"radio\"][disabled]:checked ~ .slds-radio_faux:focus,\n.slds-radio--button [type=\"radio\"][disabled]:checked ~ .slds-radio--faux:hover,\n.slds-radio--button [type=\"radio\"][disabled]:checked ~ .slds-radio--faux:focus,\n.slds-radio--button [type=\"radio\"][disabled]:checked + .slds-radio_button__label:hover,\n.slds-radio--button [type=\"radio\"][disabled]:checked + .slds-radio_button__label:focus,\n.slds-radio--button [type=\"radio\"][disabled]:checked + .slds-radio--button__label:hover,\n.slds-radio--button [type=\"radio\"][disabled]:checked + .slds-radio--button__label:focus {\n  background-color: white;\n  color: #dddbda; }\n\n/**\n * Label element inside of a radio button\n *\n * @selector .slds-radio_button__label\n * @restrict .slds-radio_button label\n */\n.slds-radio_button__label,\n.slds-radio--button__label {\n  background-color: white; }\n\n.slds-radio_button__label:hover, .slds-radio_button__label:focus,\n.slds-radio--button__label:hover,\n.slds-radio--button__label:focus {\n  cursor: pointer; }\n\n/**\n * @summary Initializes checkbox\n *\n * @name base\n * @selector .slds-checkbox\n * @restrict span, label\n * @required\n * @variant\n */\n.slds-checkbox {\n  display: inline-block;\n  /**\n   * @summary stacks label over checkbox\n   *\n   * @selector .slds-checkbox_stacked\n   * @restrict .slds-checkbox\n   * @modifier\n   * @group layout\n   */\n  /**\n   * Creates a custom styled checkbox\n   *\n   * @selector .slds-checkbox_faux\n   * @restrict [class*='slds-checkbox'] span, [class*='slds-checkbox'] label\n   * @required\n   */ }\n\n.slds-checkbox.slds-checkbox_stacked .slds-checkbox__label {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n      flex-direction: column; }\n\n.slds-checkbox.slds-checkbox_stacked .slds-checkbox_faux {\n  -ms-flex-order: 1;\n      order: 1; }\n\n.slds-checkbox .slds-checkbox_faux,\n.slds-checkbox .slds-checkbox--faux {\n  width: 1rem;\n  height: 1rem;\n  display: inline-block;\n  position: relative;\n  vertical-align: middle;\n  border: 1px solid #dddbda;\n  border-radius: 0.125rem;\n  background: white;\n  transition: border 0.1s linear, background-color 0.1s linear; }\n\n.slds-checkbox .slds-form-element__label {\n  display: inline;\n  vertical-align: middle;\n  font-size: 0.8125rem; }\n\n.slds-checkbox [type=\"checkbox\"] {\n  width: 1px;\n  height: 1px;\n  border: 0;\n  clip: rect(0 0 0 0);\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute; }\n\n.slds-checkbox [type=\"checkbox\"]:checked + .slds-checkbox_faux:after,\n.slds-checkbox [type=\"checkbox\"]:checked + .slds-checkbox--faux:after,\n.slds-checkbox [type=\"checkbox\"]:checked ~ .slds-checkbox_faux:after,\n.slds-checkbox [type=\"checkbox\"]:checked ~ .slds-checkbox--faux:after,\n.slds-checkbox [type=\"checkbox\"]:checked + .slds-checkbox__label .slds-checkbox_faux:after,\n.slds-checkbox [type=\"checkbox\"]:checked + .slds-checkbox__label .slds-checkbox--faux:after {\n  display: block;\n  content: '';\n  height: 0.25rem;\n  width: 0.5rem;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate3d(-50%, -50%, 0) rotate(-45deg);\n  border-bottom: 2px solid #0070d2;\n  border-left: 2px solid #0070d2; }\n\n.slds-checkbox [type=\"checkbox\"]:focus + .slds-checkbox_faux,\n.slds-checkbox [type=\"checkbox\"]:focus + .slds-checkbox--faux,\n.slds-checkbox [type=\"checkbox\"]:focus ~ .slds-checkbox_faux,\n.slds-checkbox [type=\"checkbox\"]:focus ~ .slds-checkbox--faux,\n.slds-checkbox [type=\"checkbox\"]:focus + .slds-checkbox__label .slds-checkbox_faux,\n.slds-checkbox [type=\"checkbox\"]:focus + .slds-checkbox__label .slds-checkbox--faux {\n  content: '';\n  border-color: #1589ee;\n  box-shadow: 0 0 3px #0070D2; }\n\n.slds-checkbox [type=\"checkbox\"]:focus:checked > .slds-checkbox_faux,\n.slds-checkbox [type=\"checkbox\"]:focus:checked > .slds-checkbox--faux,\n.slds-checkbox [type=\"checkbox\"]:focus:checked ~ .slds-checkbox_faux,\n.slds-checkbox [type=\"checkbox\"]:focus:checked ~ .slds-checkbox--faux,\n.slds-checkbox [type=\"checkbox\"]:focus:checked + .slds-checkbox__label .slds-checkbox_faux,\n.slds-checkbox [type=\"checkbox\"]:focus:checked + .slds-checkbox__label .slds-checkbox--faux {\n  border-color: #1589ee;\n  background-color: white; }\n\n.slds-checkbox [type=\"checkbox\"]:indeterminate + .slds-checkbox_faux:after,\n.slds-checkbox [type=\"checkbox\"]:indeterminate + .slds-checkbox--faux:after,\n.slds-checkbox [type=\"checkbox\"]:indeterminate ~ .slds-checkbox_faux:after,\n.slds-checkbox [type=\"checkbox\"]:indeterminate ~ .slds-checkbox--faux:after,\n.slds-checkbox [type=\"checkbox\"]:indeterminate + .slds-checkbox__label .slds-checkbox_faux:after,\n.slds-checkbox [type=\"checkbox\"]:indeterminate + .slds-checkbox__label .slds-checkbox--faux:after {\n  content: '';\n  display: block;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 0.5rem;\n  height: 2px;\n  background: #0070d2;\n  border: 0;\n  transform: translate3d(-50%, -50%, 0); }\n\n.slds-checkbox [type=\"checkbox\"][disabled] + .slds-checkbox_faux,\n.slds-checkbox [type=\"checkbox\"][disabled] + .slds-checkbox--faux,\n.slds-checkbox [type=\"checkbox\"][disabled] ~ .slds-checkbox_faux,\n.slds-checkbox [type=\"checkbox\"][disabled] ~ .slds-checkbox--faux,\n.slds-checkbox [type=\"checkbox\"][disabled] + .slds-checkbox__label .slds-checkbox_faux,\n.slds-checkbox [type=\"checkbox\"][disabled] + .slds-checkbox__label .slds-checkbox--faux {\n  background-color: #ecebea;\n  border-color: #c9c7c5; }\n\n.slds-checkbox [type=\"checkbox\"][disabled] + .slds-checkbox_faux:after,\n.slds-checkbox [type=\"checkbox\"][disabled] + .slds-checkbox--faux:after,\n.slds-checkbox [type=\"checkbox\"][disabled] ~ .slds-checkbox_faux:after,\n.slds-checkbox [type=\"checkbox\"][disabled] ~ .slds-checkbox--faux:after,\n.slds-checkbox [type=\"checkbox\"][disabled] + .slds-checkbox__label .slds-checkbox_faux:after,\n.slds-checkbox [type=\"checkbox\"][disabled] + .slds-checkbox__label .slds-checkbox--faux:after {\n  border-color: white; }\n\n.slds-has-error .slds-checkbox [type=\"checkbox\"] + .slds-checkbox_faux,\n.slds-has-error .slds-checkbox [type=\"checkbox\"] + .slds-checkbox--faux,\n.slds-has-error .slds-checkbox [type=\"checkbox\"] ~ .slds-checkbox_faux,\n.slds-has-error .slds-checkbox [type=\"checkbox\"] ~ .slds-checkbox--faux,\n.slds-has-error .slds-checkbox [type=\"checkbox\"] + .slds-checkbox__label .slds-checkbox_faux,\n.slds-has-error .slds-checkbox [type=\"checkbox\"] + .slds-checkbox__label .slds-checkbox--faux {\n  border-color: #c23934;\n  border-width: 2px; }\n\n.slds-has-error .slds-checkbox [type=\"checkbox\"]:checked + .slds-checkbox_faux,\n.slds-has-error .slds-checkbox [type=\"checkbox\"]:checked + .slds-checkbox--faux,\n.slds-has-error .slds-checkbox [type=\"checkbox\"]:checked ~ .slds-checkbox_faux,\n.slds-has-error .slds-checkbox [type=\"checkbox\"]:checked ~ .slds-checkbox--faux,\n.slds-has-error .slds-checkbox [type=\"checkbox\"]:checked + .slds-checkbox__label .slds-checkbox_faux,\n.slds-has-error .slds-checkbox [type=\"checkbox\"]:checked + .slds-checkbox__label .slds-checkbox--faux {\n  border-color: #c23934;\n  background-color: white; }\n\n.slds-has-error .slds-checkbox [type=\"checkbox\"]:checked + .slds-checkbox_faux:after,\n.slds-has-error .slds-checkbox [type=\"checkbox\"]:checked + .slds-checkbox--faux:after,\n.slds-has-error .slds-checkbox [type=\"checkbox\"]:checked ~ .slds-checkbox_faux:after,\n.slds-has-error .slds-checkbox [type=\"checkbox\"]:checked ~ .slds-checkbox--faux:after,\n.slds-has-error .slds-checkbox [type=\"checkbox\"]:checked + .slds-checkbox__label .slds-checkbox_faux:after,\n.slds-has-error .slds-checkbox [type=\"checkbox\"]:checked + .slds-checkbox__label .slds-checkbox--faux:after {\n  border-color: #d4504c; }\n\n.slds-form-element .slds-checkbox [type=\"checkbox\"] + .slds-checkbox_faux,\n.slds-form-element .slds-checkbox [type=\"checkbox\"] + .slds-checkbox--faux,\n.slds-form-element .slds-checkbox [type=\"checkbox\"] ~ .slds-checkbox_faux,\n.slds-form-element .slds-checkbox [type=\"checkbox\"] ~ .slds-checkbox--faux,\n.slds-form-element .slds-checkbox [type=\"checkbox\"] + .slds-checkbox__label .slds-checkbox_faux,\n.slds-form-element .slds-checkbox [type=\"checkbox\"] + .slds-checkbox__label .slds-checkbox--faux {\n  margin-right: 0.5rem; }\n\n/**\n * @summary Initializes checkbox toggle\n *\n * @name base\n * @selector .slds-checkbox_toggle\n * @restrict label\n * @variant\n */\n.slds-checkbox_toggle,\n.slds-checkbox--toggle {\n  width: 100%; }\n\n.slds-checkbox_toggle .slds-checkbox_faux,\n.slds-checkbox_toggle .slds-checkbox--faux,\n.slds-checkbox--toggle .slds-checkbox_faux,\n.slds-checkbox--toggle .slds-checkbox--faux {\n  display: block;\n  position: relative;\n  width: 3rem;\n  height: 1.5rem;\n  border: 1px solid #b0adab;\n  padding: 0.125rem;\n  background-color: #b0adab;\n  border-radius: 15rem;\n  transition: background-color 0.2s cubic-bezier(0.75, 0, 0.08, 1); }\n\n.slds-checkbox_toggle .slds-checkbox_faux:hover, .slds-checkbox_toggle .slds-checkbox_faux:focus,\n.slds-checkbox_toggle .slds-checkbox--faux:hover,\n.slds-checkbox_toggle .slds-checkbox--faux:focus,\n.slds-checkbox--toggle .slds-checkbox_faux:hover,\n.slds-checkbox--toggle .slds-checkbox_faux:focus,\n.slds-checkbox--toggle .slds-checkbox--faux:hover,\n.slds-checkbox--toggle .slds-checkbox--faux:focus {\n  cursor: pointer;\n  background-color: #969492; }\n\n.slds-checkbox_toggle .slds-checkbox_faux:after,\n.slds-checkbox_toggle .slds-checkbox--faux:after,\n.slds-checkbox--toggle .slds-checkbox_faux:after,\n.slds-checkbox--toggle .slds-checkbox--faux:after {\n  content: '';\n  position: absolute;\n  top: 1px;\n  left: 1px;\n  width: 1.25rem;\n  height: 1.25rem;\n  background-color: white;\n  border-radius: 15rem; }\n\n.slds-checkbox_toggle [type=\"checkbox\"],\n.slds-checkbox--toggle [type=\"checkbox\"] {\n  width: 1px;\n  height: 1px;\n  border: 0;\n  clip: rect(0 0 0 0);\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute; }\n\n.slds-checkbox_toggle [type=\"checkbox\"] + .slds-checkbox_faux_container,\n.slds-checkbox_toggle [type=\"checkbox\"] + .slds-checkbox--faux_container,\n.slds-checkbox--toggle [type=\"checkbox\"] + .slds-checkbox_faux_container,\n.slds-checkbox--toggle [type=\"checkbox\"] + .slds-checkbox--faux_container {\n  font-size: 0.625rem;\n  color: #706e6b; }\n\n.slds-checkbox_toggle [type=\"checkbox\"] + .slds-checkbox_faux_container .slds-checkbox_off,\n.slds-checkbox_toggle [type=\"checkbox\"] + .slds-checkbox_faux_container .slds-checkbox--off,\n.slds-checkbox_toggle [type=\"checkbox\"] + .slds-checkbox--faux_container .slds-checkbox_off,\n.slds-checkbox_toggle [type=\"checkbox\"] + .slds-checkbox--faux_container .slds-checkbox--off,\n.slds-checkbox--toggle [type=\"checkbox\"] + .slds-checkbox_faux_container .slds-checkbox_off,\n.slds-checkbox--toggle [type=\"checkbox\"] + .slds-checkbox_faux_container .slds-checkbox--off,\n.slds-checkbox--toggle [type=\"checkbox\"] + .slds-checkbox--faux_container .slds-checkbox_off,\n.slds-checkbox--toggle [type=\"checkbox\"] + .slds-checkbox--faux_container .slds-checkbox--off {\n  display: block; }\n\n.slds-checkbox_toggle [type=\"checkbox\"] + .slds-checkbox_faux_container .slds-checkbox_on,\n.slds-checkbox_toggle [type=\"checkbox\"] + .slds-checkbox_faux_container .slds-checkbox--on,\n.slds-checkbox_toggle [type=\"checkbox\"] + .slds-checkbox--faux_container .slds-checkbox_on,\n.slds-checkbox_toggle [type=\"checkbox\"] + .slds-checkbox--faux_container .slds-checkbox--on,\n.slds-checkbox--toggle [type=\"checkbox\"] + .slds-checkbox_faux_container .slds-checkbox_on,\n.slds-checkbox--toggle [type=\"checkbox\"] + .slds-checkbox_faux_container .slds-checkbox--on,\n.slds-checkbox--toggle [type=\"checkbox\"] + .slds-checkbox--faux_container .slds-checkbox_on,\n.slds-checkbox--toggle [type=\"checkbox\"] + .slds-checkbox--faux_container .slds-checkbox--on {\n  display: none; }\n\n.slds-checkbox_toggle [type=\"checkbox\"]:focus + .slds-checkbox_faux,\n.slds-checkbox_toggle [type=\"checkbox\"]:focus + .slds-checkbox--faux,\n.slds-checkbox_toggle [type=\"checkbox\"]:focus ~ .slds-checkbox_faux,\n.slds-checkbox_toggle [type=\"checkbox\"]:focus ~ .slds-checkbox--faux,\n.slds-checkbox_toggle [type=\"checkbox\"]:focus + .slds-checkbox_faux_container .slds-checkbox_faux,\n.slds-checkbox_toggle [type=\"checkbox\"]:focus + .slds-checkbox--faux_container .slds-checkbox--faux,\n.slds-checkbox--toggle [type=\"checkbox\"]:focus + .slds-checkbox_faux,\n.slds-checkbox--toggle [type=\"checkbox\"]:focus + .slds-checkbox--faux,\n.slds-checkbox--toggle [type=\"checkbox\"]:focus ~ .slds-checkbox_faux,\n.slds-checkbox--toggle [type=\"checkbox\"]:focus ~ .slds-checkbox--faux,\n.slds-checkbox--toggle [type=\"checkbox\"]:focus + .slds-checkbox_faux_container .slds-checkbox_faux,\n.slds-checkbox--toggle [type=\"checkbox\"]:focus + .slds-checkbox--faux_container .slds-checkbox--faux {\n  background-color: #969492;\n  border-color: #1589ee;\n  box-shadow: 0 0 3px #0070D2; }\n\n.slds-checkbox_toggle [type=\"checkbox\"]:checked + .slds-checkbox_faux_container .slds-checkbox_off,\n.slds-checkbox_toggle [type=\"checkbox\"]:checked + .slds-checkbox--faux_container .slds-checkbox--off,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked + .slds-checkbox_faux_container .slds-checkbox_off,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked + .slds-checkbox--faux_container .slds-checkbox--off {\n  display: none; }\n\n.slds-checkbox_toggle [type=\"checkbox\"]:checked + .slds-checkbox_faux_container .slds-checkbox_on,\n.slds-checkbox_toggle [type=\"checkbox\"]:checked + .slds-checkbox--faux_container .slds-checkbox--on,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked + .slds-checkbox_faux_container .slds-checkbox_on,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked + .slds-checkbox--faux_container .slds-checkbox--on {\n  display: block; }\n\n.slds-checkbox_toggle [type=\"checkbox\"]:checked + .slds-checkbox_faux,\n.slds-checkbox_toggle [type=\"checkbox\"]:checked + .slds-checkbox--faux,\n.slds-checkbox_toggle [type=\"checkbox\"]:checked ~ .slds-checkbox_faux,\n.slds-checkbox_toggle [type=\"checkbox\"]:checked ~ .slds-checkbox--faux,\n.slds-checkbox_toggle [type=\"checkbox\"]:checked + .slds-checkbox_faux_container .slds-checkbox_faux,\n.slds-checkbox_toggle [type=\"checkbox\"]:checked + .slds-checkbox--faux_container .slds-checkbox--faux,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked + .slds-checkbox_faux,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked + .slds-checkbox--faux,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked ~ .slds-checkbox_faux,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked ~ .slds-checkbox--faux,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked + .slds-checkbox_faux_container .slds-checkbox_faux,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked + .slds-checkbox--faux_container .slds-checkbox--faux {\n  border-color: #0070d2;\n  background-color: #0070d2; }\n\n.slds-checkbox_toggle [type=\"checkbox\"]:checked + .slds-checkbox_faux:hover, .slds-checkbox_toggle [type=\"checkbox\"]:checked + .slds-checkbox_faux:focus,\n.slds-checkbox_toggle [type=\"checkbox\"]:checked + .slds-checkbox--faux:hover,\n.slds-checkbox_toggle [type=\"checkbox\"]:checked + .slds-checkbox--faux:focus,\n.slds-checkbox_toggle [type=\"checkbox\"]:checked ~ .slds-checkbox_faux:hover,\n.slds-checkbox_toggle [type=\"checkbox\"]:checked ~ .slds-checkbox_faux:focus,\n.slds-checkbox_toggle [type=\"checkbox\"]:checked ~ .slds-checkbox--faux:hover,\n.slds-checkbox_toggle [type=\"checkbox\"]:checked ~ .slds-checkbox--faux:focus,\n.slds-checkbox_toggle [type=\"checkbox\"]:checked + .slds-checkbox_faux_container .slds-checkbox_faux:hover,\n.slds-checkbox_toggle [type=\"checkbox\"]:checked + .slds-checkbox_faux_container .slds-checkbox_faux:focus,\n.slds-checkbox_toggle [type=\"checkbox\"]:checked + .slds-checkbox--faux_container .slds-checkbox--faux:hover,\n.slds-checkbox_toggle [type=\"checkbox\"]:checked + .slds-checkbox--faux_container .slds-checkbox--faux:focus,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked + .slds-checkbox_faux:hover,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked + .slds-checkbox_faux:focus,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked + .slds-checkbox--faux:hover,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked + .slds-checkbox--faux:focus,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked ~ .slds-checkbox_faux:hover,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked ~ .slds-checkbox_faux:focus,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked ~ .slds-checkbox--faux:hover,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked ~ .slds-checkbox--faux:focus,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked + .slds-checkbox_faux_container .slds-checkbox_faux:hover,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked + .slds-checkbox_faux_container .slds-checkbox_faux:focus,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked + .slds-checkbox--faux_container .slds-checkbox--faux:hover,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked + .slds-checkbox--faux_container .slds-checkbox--faux:focus {\n  background-color: #005fb2; }\n\n.slds-checkbox_toggle [type=\"checkbox\"]:checked + .slds-checkbox_faux:before,\n.slds-checkbox_toggle [type=\"checkbox\"]:checked + .slds-checkbox--faux:before,\n.slds-checkbox_toggle [type=\"checkbox\"]:checked ~ .slds-checkbox_faux:before,\n.slds-checkbox_toggle [type=\"checkbox\"]:checked ~ .slds-checkbox--faux:before,\n.slds-checkbox_toggle [type=\"checkbox\"]:checked + .slds-checkbox_faux_container .slds-checkbox_faux:before,\n.slds-checkbox_toggle [type=\"checkbox\"]:checked + .slds-checkbox--faux_container .slds-checkbox--faux:before,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked + .slds-checkbox_faux:before,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked + .slds-checkbox--faux:before,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked ~ .slds-checkbox_faux:before,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked ~ .slds-checkbox--faux:before,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked + .slds-checkbox_faux_container .slds-checkbox_faux:before,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked + .slds-checkbox--faux_container .slds-checkbox--faux:before {\n  content: '';\n  position: absolute;\n  top: 1px;\n  right: 1px;\n  width: 1.25rem;\n  height: 1.25rem;\n  background-color: white;\n  border-radius: 15rem;\n  transition: transform 0.2s cubic-bezier(0.75, 0, 0.08, 1); }\n\n.slds-checkbox_toggle [type=\"checkbox\"]:checked + .slds-checkbox_faux:after,\n.slds-checkbox_toggle [type=\"checkbox\"]:checked + .slds-checkbox--faux:after,\n.slds-checkbox_toggle [type=\"checkbox\"]:checked ~ .slds-checkbox_faux:after,\n.slds-checkbox_toggle [type=\"checkbox\"]:checked ~ .slds-checkbox--faux:after,\n.slds-checkbox_toggle [type=\"checkbox\"]:checked + .slds-checkbox_faux_container .slds-checkbox_faux:after,\n.slds-checkbox_toggle [type=\"checkbox\"]:checked + .slds-checkbox--faux_container .slds-checkbox--faux:after,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked + .slds-checkbox_faux:after,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked + .slds-checkbox--faux:after,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked ~ .slds-checkbox_faux:after,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked ~ .slds-checkbox--faux:after,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked + .slds-checkbox_faux_container .slds-checkbox_faux:after,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked + .slds-checkbox--faux_container .slds-checkbox--faux:after {\n  content: ' ';\n  position: absolute;\n  top: 0.25rem;\n  left: 0.6rem;\n  height: 0.7rem;\n  width: 0.45rem;\n  border-bottom: 2px solid white;\n  border-right: 2px solid white;\n  border-radius: 0;\n  background-color: transparent;\n  transform: rotate(45deg); }\n\n.slds-checkbox_toggle [type=\"checkbox\"]:checked:focus + .slds-checkbox_faux,\n.slds-checkbox_toggle [type=\"checkbox\"]:checked:focus + .slds-checkbox--faux,\n.slds-checkbox_toggle [type=\"checkbox\"]:checked:focus ~ .slds-checkbox_faux,\n.slds-checkbox_toggle [type=\"checkbox\"]:checked:focus ~ .slds-checkbox--faux,\n.slds-checkbox_toggle [type=\"checkbox\"]:checked:focus + .slds-checkbox_faux_container .slds-checkbox_faux,\n.slds-checkbox_toggle [type=\"checkbox\"]:checked:focus + .slds-checkbox--faux_container .slds-checkbox--faux,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked:focus + .slds-checkbox_faux,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked:focus + .slds-checkbox--faux,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked:focus ~ .slds-checkbox_faux,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked:focus ~ .slds-checkbox--faux,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked:focus + .slds-checkbox_faux_container .slds-checkbox_faux,\n.slds-checkbox--toggle [type=\"checkbox\"]:checked:focus + .slds-checkbox--faux_container .slds-checkbox--faux {\n  background-color: #005fb2; }\n\n.slds-checkbox_toggle [type=\"checkbox\"][disabled] + .slds-checkbox_faux,\n.slds-checkbox_toggle [type=\"checkbox\"][disabled] + .slds-checkbox--faux,\n.slds-checkbox_toggle [type=\"checkbox\"][disabled] ~ .slds-checkbox_faux,\n.slds-checkbox_toggle [type=\"checkbox\"][disabled] ~ .slds-checkbox--faux,\n.slds-checkbox_toggle [type=\"checkbox\"][disabled] + .slds-checkbox_faux_container .slds-checkbox_faux,\n.slds-checkbox_toggle [type=\"checkbox\"][disabled] + .slds-checkbox--faux_container .slds-checkbox--faux,\n.slds-checkbox--toggle [type=\"checkbox\"][disabled] + .slds-checkbox_faux,\n.slds-checkbox--toggle [type=\"checkbox\"][disabled] + .slds-checkbox--faux,\n.slds-checkbox--toggle [type=\"checkbox\"][disabled] ~ .slds-checkbox_faux,\n.slds-checkbox--toggle [type=\"checkbox\"][disabled] ~ .slds-checkbox--faux,\n.slds-checkbox--toggle [type=\"checkbox\"][disabled] + .slds-checkbox_faux_container .slds-checkbox_faux,\n.slds-checkbox--toggle [type=\"checkbox\"][disabled] + .slds-checkbox--faux_container .slds-checkbox--faux {\n  background-color: #b0adab;\n  pointer-events: none; }\n\n.slds-checkbox_toggle [type=\"checkbox\"][disabled] + .slds-checkbox_faux:after,\n.slds-checkbox_toggle [type=\"checkbox\"][disabled] + .slds-checkbox--faux:after,\n.slds-checkbox_toggle [type=\"checkbox\"][disabled] ~ .slds-checkbox_faux:after,\n.slds-checkbox_toggle [type=\"checkbox\"][disabled] ~ .slds-checkbox--faux:after,\n.slds-checkbox_toggle [type=\"checkbox\"][disabled] + .slds-checkbox_faux_container .slds-checkbox_faux:after,\n.slds-checkbox_toggle [type=\"checkbox\"][disabled] + .slds-checkbox--faux_container .slds-checkbox--faux:after,\n.slds-checkbox--toggle [type=\"checkbox\"][disabled] + .slds-checkbox_faux:after,\n.slds-checkbox--toggle [type=\"checkbox\"][disabled] + .slds-checkbox--faux:after,\n.slds-checkbox--toggle [type=\"checkbox\"][disabled] ~ .slds-checkbox_faux:after,\n.slds-checkbox--toggle [type=\"checkbox\"][disabled] ~ .slds-checkbox--faux:after,\n.slds-checkbox--toggle [type=\"checkbox\"][disabled] + .slds-checkbox_faux_container .slds-checkbox_faux:after,\n.slds-checkbox--toggle [type=\"checkbox\"][disabled] + .slds-checkbox--faux_container .slds-checkbox--faux:after {\n  background-color: #dddbda; }\n\n.slds-checkbox_toggle [type=\"checkbox\"][disabled] + .slds-checkbox_faux:hover, .slds-checkbox_toggle [type=\"checkbox\"][disabled] + .slds-checkbox_faux:focus,\n.slds-checkbox_toggle [type=\"checkbox\"][disabled] + .slds-checkbox--faux:hover,\n.slds-checkbox_toggle [type=\"checkbox\"][disabled] + .slds-checkbox--faux:focus,\n.slds-checkbox_toggle [type=\"checkbox\"][disabled] ~ .slds-checkbox_faux:hover,\n.slds-checkbox_toggle [type=\"checkbox\"][disabled] ~ .slds-checkbox_faux:focus,\n.slds-checkbox_toggle [type=\"checkbox\"][disabled] ~ .slds-checkbox--faux:hover,\n.slds-checkbox_toggle [type=\"checkbox\"][disabled] ~ .slds-checkbox--faux:focus,\n.slds-checkbox_toggle [type=\"checkbox\"][disabled] + .slds-checkbox_faux_container .slds-checkbox_faux:hover,\n.slds-checkbox_toggle [type=\"checkbox\"][disabled] + .slds-checkbox_faux_container .slds-checkbox_faux:focus,\n.slds-checkbox_toggle [type=\"checkbox\"][disabled] + .slds-checkbox--faux_container .slds-checkbox--faux:hover,\n.slds-checkbox_toggle [type=\"checkbox\"][disabled] + .slds-checkbox--faux_container .slds-checkbox--faux:focus,\n.slds-checkbox--toggle [type=\"checkbox\"][disabled] + .slds-checkbox_faux:hover,\n.slds-checkbox--toggle [type=\"checkbox\"][disabled] + .slds-checkbox_faux:focus,\n.slds-checkbox--toggle [type=\"checkbox\"][disabled] + .slds-checkbox--faux:hover,\n.slds-checkbox--toggle [type=\"checkbox\"][disabled] + .slds-checkbox--faux:focus,\n.slds-checkbox--toggle [type=\"checkbox\"][disabled] ~ .slds-checkbox_faux:hover,\n.slds-checkbox--toggle [type=\"checkbox\"][disabled] ~ .slds-checkbox_faux:focus,\n.slds-checkbox--toggle [type=\"checkbox\"][disabled] ~ .slds-checkbox--faux:hover,\n.slds-checkbox--toggle [type=\"checkbox\"][disabled] ~ .slds-checkbox--faux:focus,\n.slds-checkbox--toggle [type=\"checkbox\"][disabled] + .slds-checkbox_faux_container .slds-checkbox_faux:hover,\n.slds-checkbox--toggle [type=\"checkbox\"][disabled] + .slds-checkbox_faux_container .slds-checkbox_faux:focus,\n.slds-checkbox--toggle [type=\"checkbox\"][disabled] + .slds-checkbox--faux_container .slds-checkbox--faux:hover,\n.slds-checkbox--toggle [type=\"checkbox\"][disabled] + .slds-checkbox--faux_container .slds-checkbox--faux:focus {\n  background-color: #b0adab;\n  cursor: default; }\n\n.slds-checkbox_toggle [type=\"checkbox\"][disabled]:checked + .slds-checkbox_faux_container .slds-checkbox_faux:before,\n.slds-checkbox_toggle [type=\"checkbox\"][disabled]:checked + .slds-checkbox--faux_container .slds-checkbox--faux:before,\n.slds-checkbox--toggle [type=\"checkbox\"][disabled]:checked + .slds-checkbox_faux_container .slds-checkbox_faux:before,\n.slds-checkbox--toggle [type=\"checkbox\"][disabled]:checked + .slds-checkbox--faux_container .slds-checkbox--faux:before {\n  background-color: #dddbda; }\n\n.slds-checkbox_toggle [type=\"checkbox\"][disabled]:checked + .slds-checkbox_faux_container .slds-checkbox_faux:after,\n.slds-checkbox_toggle [type=\"checkbox\"][disabled]:checked + .slds-checkbox--faux_container .slds-checkbox--faux:after,\n.slds-checkbox--toggle [type=\"checkbox\"][disabled]:checked + .slds-checkbox_faux_container .slds-checkbox_faux:after,\n.slds-checkbox--toggle [type=\"checkbox\"][disabled]:checked + .slds-checkbox--faux_container .slds-checkbox--faux:after {\n  background-color: transparent; }\n\n/**\n * @summary Initializes checkbox add button\n *\n * @name base\n * @selector .slds-checkbox_add-button\n * @restrict div\n * @variant\n */\n.slds-checkbox_add-button .slds-checkbox_faux,\n.slds-checkbox_add-button .slds-checkbox--faux,\n.slds-checkbox--add-button .slds-checkbox_faux,\n.slds-checkbox--add-button .slds-checkbox--faux {\n  width: 2rem;\n  height: 2rem;\n  position: relative;\n  display: inline-block;\n  border: 1px solid #dddbda;\n  border-radius: 0.25rem;\n  background-color: white;\n  cursor: pointer; }\n\n.slds-checkbox_add-button .slds-checkbox_faux:before, .slds-checkbox_add-button .slds-checkbox_faux:after,\n.slds-checkbox_add-button .slds-checkbox--faux:before,\n.slds-checkbox_add-button .slds-checkbox--faux:after,\n.slds-checkbox--add-button .slds-checkbox_faux:before,\n.slds-checkbox--add-button .slds-checkbox_faux:after,\n.slds-checkbox--add-button .slds-checkbox--faux:before,\n.slds-checkbox--add-button .slds-checkbox--faux:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  height: 0.875rem;\n  width: 0.125rem;\n  margin: auto;\n  background: #0070d2; }\n\n.slds-checkbox_add-button .slds-checkbox_faux:after,\n.slds-checkbox_add-button .slds-checkbox--faux:after,\n.slds-checkbox--add-button .slds-checkbox_faux:after,\n.slds-checkbox--add-button .slds-checkbox--faux:after {\n  width: 0.875rem;\n  height: 0.125rem; }\n\n.slds-checkbox_add-button .slds-checkbox_faux:hover:not([disabled]), .slds-checkbox_add-button .slds-checkbox_faux:focus:not([disabled]),\n.slds-checkbox_add-button .slds-checkbox--faux:hover:not([disabled]),\n.slds-checkbox_add-button .slds-checkbox--faux:focus:not([disabled]),\n.slds-checkbox--add-button .slds-checkbox_faux:hover:not([disabled]),\n.slds-checkbox--add-button .slds-checkbox_faux:focus:not([disabled]),\n.slds-checkbox--add-button .slds-checkbox--faux:hover:not([disabled]),\n.slds-checkbox--add-button .slds-checkbox--faux:focus:not([disabled]) {\n  border: 1px solid #dddbda;\n  background-color: #f4f6f9; }\n\n.slds-checkbox_add-button .slds-checkbox_faux:active,\n.slds-checkbox_add-button .slds-checkbox--faux:active,\n.slds-checkbox--add-button .slds-checkbox_faux:active,\n.slds-checkbox--add-button .slds-checkbox--faux:active {\n  background-color: #eef1f6; }\n\n.slds-checkbox_add-button input[type=\"checkbox\"]:checked ~ .slds-checkbox_faux,\n.slds-checkbox_add-button input[type=\"checkbox\"]:checked ~ .slds-checkbox--faux,\n.slds-checkbox_add-button input[type=\"checkbox\"]:checked + .slds-checkbox_faux,\n.slds-checkbox_add-button input[type=\"checkbox\"]:checked + .slds-checkbox--faux,\n.slds-checkbox--add-button input[type=\"checkbox\"]:checked ~ .slds-checkbox_faux,\n.slds-checkbox--add-button input[type=\"checkbox\"]:checked ~ .slds-checkbox--faux,\n.slds-checkbox--add-button input[type=\"checkbox\"]:checked + .slds-checkbox_faux,\n.slds-checkbox--add-button input[type=\"checkbox\"]:checked + .slds-checkbox--faux {\n  border-color: transparent;\n  background: #4bca81; }\n\n.slds-checkbox_add-button input[type=\"checkbox\"]:checked ~ .slds-checkbox_faux:before, .slds-checkbox_add-button input[type=\"checkbox\"]:checked ~ .slds-checkbox_faux:after,\n.slds-checkbox_add-button input[type=\"checkbox\"]:checked ~ .slds-checkbox--faux:before,\n.slds-checkbox_add-button input[type=\"checkbox\"]:checked ~ .slds-checkbox--faux:after,\n.slds-checkbox_add-button input[type=\"checkbox\"]:checked + .slds-checkbox_faux:before,\n.slds-checkbox_add-button input[type=\"checkbox\"]:checked + .slds-checkbox_faux:after,\n.slds-checkbox_add-button input[type=\"checkbox\"]:checked + .slds-checkbox--faux:before,\n.slds-checkbox_add-button input[type=\"checkbox\"]:checked + .slds-checkbox--faux:after,\n.slds-checkbox--add-button input[type=\"checkbox\"]:checked ~ .slds-checkbox_faux:before,\n.slds-checkbox--add-button input[type=\"checkbox\"]:checked ~ .slds-checkbox_faux:after,\n.slds-checkbox--add-button input[type=\"checkbox\"]:checked ~ .slds-checkbox--faux:before,\n.slds-checkbox--add-button input[type=\"checkbox\"]:checked ~ .slds-checkbox--faux:after,\n.slds-checkbox--add-button input[type=\"checkbox\"]:checked + .slds-checkbox_faux:before,\n.slds-checkbox--add-button input[type=\"checkbox\"]:checked + .slds-checkbox_faux:after,\n.slds-checkbox--add-button input[type=\"checkbox\"]:checked + .slds-checkbox--faux:before,\n.slds-checkbox--add-button input[type=\"checkbox\"]:checked + .slds-checkbox--faux:after {\n  background: white; }\n\n.slds-checkbox_add-button input[type=\"checkbox\"]:checked ~ .slds-checkbox_faux:before,\n.slds-checkbox_add-button input[type=\"checkbox\"]:checked ~ .slds-checkbox--faux:before,\n.slds-checkbox_add-button input[type=\"checkbox\"]:checked + .slds-checkbox_faux:before,\n.slds-checkbox_add-button input[type=\"checkbox\"]:checked + .slds-checkbox--faux:before,\n.slds-checkbox--add-button input[type=\"checkbox\"]:checked ~ .slds-checkbox_faux:before,\n.slds-checkbox--add-button input[type=\"checkbox\"]:checked ~ .slds-checkbox--faux:before,\n.slds-checkbox--add-button input[type=\"checkbox\"]:checked + .slds-checkbox_faux:before,\n.slds-checkbox--add-button input[type=\"checkbox\"]:checked + .slds-checkbox--faux:before {\n  top: -0.125rem;\n  left: 0.4375rem;\n  width: 0.1875rem;\n  height: 1.0625rem;\n  transform: rotate(40deg); }\n\n.slds-checkbox_add-button input[type=\"checkbox\"]:checked ~ .slds-checkbox_faux:after,\n.slds-checkbox_add-button input[type=\"checkbox\"]:checked ~ .slds-checkbox--faux:after,\n.slds-checkbox_add-button input[type=\"checkbox\"]:checked + .slds-checkbox_faux:after,\n.slds-checkbox_add-button input[type=\"checkbox\"]:checked + .slds-checkbox--faux:after,\n.slds-checkbox--add-button input[type=\"checkbox\"]:checked ~ .slds-checkbox_faux:after,\n.slds-checkbox--add-button input[type=\"checkbox\"]:checked ~ .slds-checkbox--faux:after,\n.slds-checkbox--add-button input[type=\"checkbox\"]:checked + .slds-checkbox_faux:after,\n.slds-checkbox--add-button input[type=\"checkbox\"]:checked + .slds-checkbox--faux:after {\n  top: 0.3125rem;\n  left: -0.625rem;\n  width: 0.625rem;\n  height: 0.1875rem;\n  transform: rotate(36deg); }\n\n.slds-checkbox_add-button input[type=\"checkbox\"]:focus ~ .slds-checkbox_faux,\n.slds-checkbox_add-button input[type=\"checkbox\"]:focus ~ .slds-checkbox--faux,\n.slds-checkbox_add-button input[type=\"checkbox\"]:focus + .slds-checkbox_faux,\n.slds-checkbox_add-button input[type=\"checkbox\"]:focus + .slds-checkbox--faux,\n.slds-checkbox--add-button input[type=\"checkbox\"]:focus ~ .slds-checkbox_faux,\n.slds-checkbox--add-button input[type=\"checkbox\"]:focus ~ .slds-checkbox--faux,\n.slds-checkbox--add-button input[type=\"checkbox\"]:focus + .slds-checkbox_faux,\n.slds-checkbox--add-button input[type=\"checkbox\"]:focus + .slds-checkbox--faux {\n  outline: 0;\n  box-shadow: 0 0 3px #0070D2;\n  border-color: #1589ee; }\n\n.slds-checkbox_add-button input[type=\"checkbox\"][disabled] ~ .slds-checkbox_faux,\n.slds-checkbox_add-button input[type=\"checkbox\"][disabled] ~ .slds-checkbox--faux,\n.slds-checkbox_add-button input[type=\"checkbox\"][disabled] + .slds-checkbox_faux,\n.slds-checkbox_add-button input[type=\"checkbox\"][disabled] + .slds-checkbox--faux,\n.slds-checkbox--add-button input[type=\"checkbox\"][disabled] ~ .slds-checkbox_faux,\n.slds-checkbox--add-button input[type=\"checkbox\"][disabled] ~ .slds-checkbox--faux,\n.slds-checkbox--add-button input[type=\"checkbox\"][disabled] + .slds-checkbox_faux,\n.slds-checkbox--add-button input[type=\"checkbox\"][disabled] + .slds-checkbox--faux {\n  background-color: #e0e5ee;\n  border-color: transparent;\n  color: white; }\n\n.slds-checkbox_add-button input[type=\"checkbox\"][disabled] ~ .slds-checkbox_faux:before, .slds-checkbox_add-button input[type=\"checkbox\"][disabled] ~ .slds-checkbox_faux:after,\n.slds-checkbox_add-button input[type=\"checkbox\"][disabled] ~ .slds-checkbox--faux:before,\n.slds-checkbox_add-button input[type=\"checkbox\"][disabled] ~ .slds-checkbox--faux:after,\n.slds-checkbox_add-button input[type=\"checkbox\"][disabled] + .slds-checkbox_faux:before,\n.slds-checkbox_add-button input[type=\"checkbox\"][disabled] + .slds-checkbox_faux:after,\n.slds-checkbox_add-button input[type=\"checkbox\"][disabled] + .slds-checkbox--faux:before,\n.slds-checkbox_add-button input[type=\"checkbox\"][disabled] + .slds-checkbox--faux:after,\n.slds-checkbox--add-button input[type=\"checkbox\"][disabled] ~ .slds-checkbox_faux:before,\n.slds-checkbox--add-button input[type=\"checkbox\"][disabled] ~ .slds-checkbox_faux:after,\n.slds-checkbox--add-button input[type=\"checkbox\"][disabled] ~ .slds-checkbox--faux:before,\n.slds-checkbox--add-button input[type=\"checkbox\"][disabled] ~ .slds-checkbox--faux:after,\n.slds-checkbox--add-button input[type=\"checkbox\"][disabled] + .slds-checkbox_faux:before,\n.slds-checkbox--add-button input[type=\"checkbox\"][disabled] + .slds-checkbox_faux:after,\n.slds-checkbox--add-button input[type=\"checkbox\"][disabled] + .slds-checkbox--faux:before,\n.slds-checkbox--add-button input[type=\"checkbox\"][disabled] + .slds-checkbox--faux:after {\n  background: white; }\n\n/**\n * @summary Initializes checkbox button group\n *\n * @name base\n * @selector .slds-checkbox_button-group\n * @restrict div, span\n * @required\n * @variant\n */\n.slds-checkbox_button-group,\n.slds-checkbox--button-group {\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  background-color: white;\n  border: 1px solid #dddbda;\n  border-radius: 0.25rem; }\n\n/**\n * Initializes checkbox inside a button group\n *\n * @selector .slds-checkbox_button\n * @restrict .slds-checkbox_button-group span\n * @required\n */\n.slds-checkbox_button,\n.slds-checkbox--button {\n  display: -ms-flexbox;\n  display: flex;\n  border: 0;\n  border-radius: 0;\n  background-clip: padding-box;\n  /**\n   * Creates a custom styled checkbox\n   *\n   * @selector .slds-checkbox_faux\n   * @restrict .slds-checkbox__label span, .slds-checkbox_button__label span\n   * @required\n   */\n  /**\n   * Creates a custom styled checkbox\n   *\n   * @selector .slds-checkbox_button__label\n   * @restrict .slds-checkbox_button label\n   * @required\n   */ }\n\n.slds-checkbox_button .slds-checkbox_faux,\n.slds-checkbox_button .slds-checkbox--faux,\n.slds-checkbox--button .slds-checkbox_faux,\n.slds-checkbox--button .slds-checkbox--faux {\n  padding-left: 1rem;\n  padding-right: 1rem;\n  text-align: center;\n  vertical-align: middle;\n  position: relative;\n  background-color: white;\n  transition: border 0.1s linear, background-color 0.1s linear; }\n\n.slds-checkbox_button .slds-checkbox_faux:hover, .slds-checkbox_button .slds-checkbox_faux:focus,\n.slds-checkbox_button .slds-checkbox--faux:hover,\n.slds-checkbox_button .slds-checkbox--faux:focus,\n.slds-checkbox--button .slds-checkbox_faux:hover,\n.slds-checkbox--button .slds-checkbox_faux:focus,\n.slds-checkbox--button .slds-checkbox--faux:hover,\n.slds-checkbox--button .slds-checkbox--faux:focus {\n  cursor: pointer;\n  background-color: #f4f6f9; }\n\n.slds-checkbox_button .slds-checkbox_button__label .slds-checkbox_faux,\n.slds-checkbox_button .slds-checkbox--button__label .slds-checkbox--faux,\n.slds-checkbox_button [type=\"checkbox\"]:checked + .slds-checkbox--button__label .slds-checkbox--faux,\n.slds-checkbox--button .slds-checkbox_button__label .slds-checkbox_faux,\n.slds-checkbox--button .slds-checkbox--button__label .slds-checkbox--faux,\n.slds-checkbox--button [type=\"checkbox\"]:checked + .slds-checkbox--button__label .slds-checkbox--faux {\n  background-color: transparent; }\n\n.slds-checkbox_button + .slds-checkbox_button,\n.slds-checkbox_button + .slds-checkbox--button,\n.slds-checkbox--button + .slds-checkbox_button,\n.slds-checkbox--button + .slds-checkbox--button {\n  border-left: 1px solid #dddbda;\n  border-radius: 0;\n  margin: 0; }\n\n.slds-checkbox_button:first-child > .slds-checkbox_faux,\n.slds-checkbox_button:first-child > .slds-checkbox--faux,\n.slds-checkbox_button:first-child > .slds-checkbox_button__label,\n.slds-checkbox_button:first-child > .slds-checkbox--button__label,\n.slds-checkbox--button:first-child > .slds-checkbox_faux,\n.slds-checkbox--button:first-child > .slds-checkbox--faux,\n.slds-checkbox--button:first-child > .slds-checkbox_button__label,\n.slds-checkbox--button:first-child > .slds-checkbox--button__label {\n  border-radius: 0.25rem 0 0 0.25rem; }\n\n.slds-checkbox_button:last-child > .slds-checkbox_faux,\n.slds-checkbox_button:last-child > .slds-checkbox--faux,\n.slds-checkbox_button .slds-button_last > .slds-checkbox_faux,\n.slds-checkbox_button .slds-button--last > .slds-checkbox--faux,\n.slds-checkbox_button:last-child > .slds-checkbox_button__label,\n.slds-checkbox_button:last-child > .slds-checkbox--button__label,\n.slds-checkbox--button:last-child > .slds-checkbox_faux,\n.slds-checkbox--button:last-child > .slds-checkbox--faux,\n.slds-checkbox--button .slds-button_last > .slds-checkbox_faux,\n.slds-checkbox--button .slds-button--last > .slds-checkbox--faux,\n.slds-checkbox--button:last-child > .slds-checkbox_button__label,\n.slds-checkbox--button:last-child > .slds-checkbox--button__label {\n  border-radius: 0 0.25rem 0.25rem 0; }\n\n.slds-checkbox_button [type=\"checkbox\"],\n.slds-checkbox--button [type=\"checkbox\"] {\n  width: 1px;\n  height: 1px;\n  border: 0;\n  clip: rect(0 0 0 0);\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute; }\n\n.slds-checkbox_button [type=\"checkbox\"]:checked + .slds-checkbox_faux,\n.slds-checkbox_button [type=\"checkbox\"]:checked + .slds-checkbox--faux,\n.slds-checkbox_button [type=\"checkbox\"]:checked ~ .slds-checkbox_faux,\n.slds-checkbox_button [type=\"checkbox\"]:checked ~ .slds-checkbox--faux,\n.slds-checkbox_button [type=\"checkbox\"]:checked + .slds-checkbox_button__label,\n.slds-checkbox_button [type=\"checkbox\"]:checked + .slds-checkbox--button__label,\n.slds-checkbox--button [type=\"checkbox\"]:checked + .slds-checkbox_faux,\n.slds-checkbox--button [type=\"checkbox\"]:checked + .slds-checkbox--faux,\n.slds-checkbox--button [type=\"checkbox\"]:checked ~ .slds-checkbox_faux,\n.slds-checkbox--button [type=\"checkbox\"]:checked ~ .slds-checkbox--faux,\n.slds-checkbox--button [type=\"checkbox\"]:checked + .slds-checkbox_button__label,\n.slds-checkbox--button [type=\"checkbox\"]:checked + .slds-checkbox--button__label {\n  background-color: #0070d2;\n  color: white; }\n\n.slds-checkbox_button [type=\"checkbox\"]:checked + .slds-checkbox_faux:hover, .slds-checkbox_button [type=\"checkbox\"]:checked + .slds-checkbox_faux:focus,\n.slds-checkbox_button [type=\"checkbox\"]:checked + .slds-checkbox--faux:hover,\n.slds-checkbox_button [type=\"checkbox\"]:checked + .slds-checkbox--faux:focus,\n.slds-checkbox_button [type=\"checkbox\"]:checked ~ .slds-checkbox_faux:hover,\n.slds-checkbox_button [type=\"checkbox\"]:checked ~ .slds-checkbox_faux:focus,\n.slds-checkbox_button [type=\"checkbox\"]:checked ~ .slds-checkbox--faux:hover,\n.slds-checkbox_button [type=\"checkbox\"]:checked ~ .slds-checkbox--faux:focus,\n.slds-checkbox_button [type=\"checkbox\"]:checked + .slds-checkbox_button__label:hover,\n.slds-checkbox_button [type=\"checkbox\"]:checked + .slds-checkbox_button__label:focus,\n.slds-checkbox_button [type=\"checkbox\"]:checked + .slds-checkbox--button__label:hover,\n.slds-checkbox_button [type=\"checkbox\"]:checked + .slds-checkbox--button__label:focus,\n.slds-checkbox--button [type=\"checkbox\"]:checked + .slds-checkbox_faux:hover,\n.slds-checkbox--button [type=\"checkbox\"]:checked + .slds-checkbox_faux:focus,\n.slds-checkbox--button [type=\"checkbox\"]:checked + .slds-checkbox--faux:hover,\n.slds-checkbox--button [type=\"checkbox\"]:checked + .slds-checkbox--faux:focus,\n.slds-checkbox--button [type=\"checkbox\"]:checked ~ .slds-checkbox_faux:hover,\n.slds-checkbox--button [type=\"checkbox\"]:checked ~ .slds-checkbox_faux:focus,\n.slds-checkbox--button [type=\"checkbox\"]:checked ~ .slds-checkbox--faux:hover,\n.slds-checkbox--button [type=\"checkbox\"]:checked ~ .slds-checkbox--faux:focus,\n.slds-checkbox--button [type=\"checkbox\"]:checked + .slds-checkbox_button__label:hover,\n.slds-checkbox--button [type=\"checkbox\"]:checked + .slds-checkbox_button__label:focus,\n.slds-checkbox--button [type=\"checkbox\"]:checked + .slds-checkbox--button__label:hover,\n.slds-checkbox--button [type=\"checkbox\"]:checked + .slds-checkbox--button__label:focus {\n  background-color: #005fb2; }\n\n.slds-checkbox_button [type=\"checkbox\"]:focus + .slds-checkbox_faux,\n.slds-checkbox_button [type=\"checkbox\"]:focus + .slds-checkbox--faux,\n.slds-checkbox_button [type=\"checkbox\"]:focus ~ .slds-checkbox_faux,\n.slds-checkbox_button [type=\"checkbox\"]:focus ~ .slds-checkbox--faux,\n.slds-checkbox_button [type=\"checkbox\"]:focus + .slds-checkbox_button__label,\n.slds-checkbox_button [type=\"checkbox\"]:focus + .slds-checkbox--button__label,\n.slds-checkbox--button [type=\"checkbox\"]:focus + .slds-checkbox_faux,\n.slds-checkbox--button [type=\"checkbox\"]:focus + .slds-checkbox--faux,\n.slds-checkbox--button [type=\"checkbox\"]:focus ~ .slds-checkbox_faux,\n.slds-checkbox--button [type=\"checkbox\"]:focus ~ .slds-checkbox--faux,\n.slds-checkbox--button [type=\"checkbox\"]:focus + .slds-checkbox_button__label,\n.slds-checkbox--button [type=\"checkbox\"]:focus + .slds-checkbox--button__label {\n  outline: 0;\n  box-shadow: 0 0 3px #0070D2;\n  z-index: 1; }\n\n.slds-checkbox_button [type=\"checkbox\"][disabled] + .slds-checkbox_faux,\n.slds-checkbox_button [type=\"checkbox\"][disabled] + .slds-checkbox--faux,\n.slds-checkbox_button [type=\"checkbox\"][disabled] ~ .slds-checkbox_faux,\n.slds-checkbox_button [type=\"checkbox\"][disabled] ~ .slds-checkbox--faux,\n.slds-checkbox_button [type=\"checkbox\"][disabled] + .slds-checkbox_button__label,\n.slds-checkbox_button [type=\"checkbox\"][disabled] + .slds-checkbox--button__label,\n.slds-checkbox--button [type=\"checkbox\"][disabled] + .slds-checkbox_faux,\n.slds-checkbox--button [type=\"checkbox\"][disabled] + .slds-checkbox--faux,\n.slds-checkbox--button [type=\"checkbox\"][disabled] ~ .slds-checkbox_faux,\n.slds-checkbox--button [type=\"checkbox\"][disabled] ~ .slds-checkbox--faux,\n.slds-checkbox--button [type=\"checkbox\"][disabled] + .slds-checkbox_button__label,\n.slds-checkbox--button [type=\"checkbox\"][disabled] + .slds-checkbox--button__label {\n  background-color: white;\n  color: #dddbda;\n  cursor: default; }\n\n.slds-checkbox_button [type=\"checkbox\"][disabled]:checked + .slds-checkbox_faux,\n.slds-checkbox_button [type=\"checkbox\"][disabled]:checked + .slds-checkbox--faux,\n.slds-checkbox_button [type=\"checkbox\"][disabled]:checked ~ .slds-checkbox_faux,\n.slds-checkbox_button [type=\"checkbox\"][disabled]:checked ~ .slds-checkbox--faux,\n.slds-checkbox_button [type=\"checkbox\"][disabled]:checked + .slds-checkbox_button__label,\n.slds-checkbox_button [type=\"checkbox\"][disabled]:checked + .slds-checkbox--button__label,\n.slds-checkbox--button [type=\"checkbox\"][disabled]:checked + .slds-checkbox_faux,\n.slds-checkbox--button [type=\"checkbox\"][disabled]:checked + .slds-checkbox--faux,\n.slds-checkbox--button [type=\"checkbox\"][disabled]:checked ~ .slds-checkbox_faux,\n.slds-checkbox--button [type=\"checkbox\"][disabled]:checked ~ .slds-checkbox--faux,\n.slds-checkbox--button [type=\"checkbox\"][disabled]:checked + .slds-checkbox_button__label,\n.slds-checkbox--button [type=\"checkbox\"][disabled]:checked + .slds-checkbox--button__label {\n  background-color: white;\n  color: #dddbda;\n  cursor: default; }\n\n/**\n * @summary Initializes select\n *\n * @name base\n * @selector .slds-select\n * @restrict select\n * @required\n * @variant\n */\n.slds-select {\n  background-color: white;\n  border: 1px solid #dddbda;\n  border-radius: 0.25rem;\n  width: 100%;\n  transition: border 0.1s linear, background-color 0.1s linear;\n  height: calc(1.875rem + (1px * 2));\n  /**\n   * Initializes select container for custom styling\n   *\n   * @selector .slds-select_container\n   * @restrict div\n   */ }\n\n.slds-select:focus, .slds-select:active {\n  outline: 0;\n  border-color: #1589ee;\n  background-color: white;\n  box-shadow: 0 0 3px #0070D2; }\n\n.slds-select[disabled], .slds-select.slds-is-disabled {\n  background-color: #ecebea;\n  border-color: #c9c7c5;\n  cursor: not-allowed;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none; }\n\n.slds-select[disabled]:focus, .slds-select[disabled]:active, .slds-select.slds-is-disabled:focus, .slds-select.slds-is-disabled:active {\n  box-shadow: none; }\n\n.slds-select[size], .slds-select[multiple] {\n  min-height: calc(1.875rem + (1px * 2));\n  height: inherit; }\n\n.slds-select[size] option, .slds-select[multiple] option {\n  padding: 0.5rem; }\n\n.slds-select_container {\n  position: relative; }\n\n.slds-select_container .slds-select {\n  -moz-appearance: none;\n  -webkit-appearance: none;\n  padding-left: 0.5rem;\n  padding-right: 1.5rem; }\n\n.slds-select_container .slds-select::-ms-expand {\n  display: none; }\n\n.slds-select_container:before, .slds-select_container:after {\n  position: absolute;\n  content: '';\n  display: block;\n  right: 0.5rem;\n  width: 0;\n  height: 0;\n  border-left: 3px solid transparent;\n  border-right: 3px solid transparent; }\n\n.slds-select_container:before {\n  border-bottom: 5px solid #061c3f;\n  top: calc((1.75rem / 2) - 6px); }\n\n.slds-select_container:after {\n  border-top: 5px solid #061c3f;\n  bottom: calc((1.75rem / 2) - 6px); }\n\n.slds-has-error .slds-select {\n  background-color: white;\n  border-color: #c23934;\n  box-shadow: #c23934 0 0 0 1px inset;\n  background-clip: padding-box; }\n\n.slds-has-error .slds-select:focus, .slds-has-error .slds-select:active {\n  box-shadow: #c23934 0 0 0 1px inset, 0 0 3px #0070D2; }\n\n/**\n * @name base\n * @selector .slds-form\n * @restrict form, div, fieldset\n * @variant\n */\n/**\n * Vertically aligns form label and control, provides spacing between form elements\n *\n * @selector .slds-form_stacked\n * @restrict .slds-form:not(.slds-form_compound)\n * @modifier\n * @group layout\n */\n.slds-form_stacked .slds-form-element,\n.slds-form--stacked .slds-form-element {\n  display: block; }\n\n.slds-form_stacked .slds-form-element + .slds-form-element,\n.slds-form--stacked .slds-form-element + .slds-form-element {\n  margin-top: 0.75rem; }\n\n@media (min-width: 30em) {\n  .slds-form_stacked .slds-form-element + .slds-form-element,\n  .slds-form--stacked .slds-form-element + .slds-form-element {\n    margin-top: 0.5rem; } }\n\n.slds-form_stacked .slds-form-element .slds-checkbox,\n.slds-form_stacked .slds-form-element .slds-radio,\n.slds-form--stacked .slds-form-element .slds-checkbox,\n.slds-form--stacked .slds-form-element .slds-radio {\n  display: block; }\n\n/**\n * Horizontally aligns a single form label and control on the same line\n *\n * @selector .slds-form_horizontal\n * @restrict .slds-form:not(.slds-form_compound)\n * @modifier\n * @group layout\n */\n@media (min-width: 48em) {\n  .slds-form_horizontal,\n  .slds-form--horizontal {\n    text-align: right; } }\n\n@media (min-width: 48em) {\n  .slds-form_horizontal .slds-form-element > .slds-form-element__legend,\n  .slds-form_horizontal .slds-form-element > .slds-form-element__label,\n  .slds-form--horizontal .slds-form-element > .slds-form-element__legend,\n  .slds-form--horizontal .slds-form-element > .slds-form-element__label {\n    float: left;\n    text-align: right;\n    display: inline-block;\n    width: 33%;\n    vertical-align: top;\n    position: relative;\n    top: 0.1875rem;\n    margin-right: 0;\n    margin-bottom: 0; } }\n\n.slds-form_horizontal .slds-form-element + .slds-form-element,\n.slds-form--horizontal .slds-form-element + .slds-form-element {\n  margin-top: 0.75rem; }\n\n@media (min-width: 30em) {\n  .slds-form_horizontal .slds-form-element + .slds-form-element,\n  .slds-form--horizontal .slds-form-element + .slds-form-element {\n    margin-top: 0.5rem; } }\n\n.slds-form_horizontal .slds-form-element__control,\n.slds-form--horizontal .slds-form-element__control {\n  width: 100%; }\n\n@media (min-width: 48em) {\n  .slds-form_horizontal .slds-form-element__control,\n  .slds-form--horizontal .slds-form-element__control {\n    width: 66%;\n    display: inline-block;\n    text-align: left; } }\n\n/**\n * Horizontally align multiple form elements on the same axis\n *\n * @selector .slds-form_inline\n * @restrict .slds-form\n */\n.slds-form_inline .slds-form-element,\n.slds-form_inline .slds-form-element__label,\n.slds-form_inline .slds-form-element__control,\n.slds-form--inline .slds-form-element,\n.slds-form--inline .slds-form-element__label,\n.slds-form--inline .slds-form-element__control {\n  display: block; }\n\n.slds-form_inline .slds-form-element + .slds-form-element,\n.slds-form--inline .slds-form-element + .slds-form-element {\n  margin-top: 0.75rem; }\n\n@media (min-width: 30em) {\n  .slds-form_inline .slds-form-element,\n  .slds-form--inline .slds-form-element {\n    margin-right: 0.5rem; }\n  .slds-form_inline .slds-form-element + .slds-form-element,\n  .slds-form--inline .slds-form-element + .slds-form-element {\n    margin-top: 0; }\n  .slds-form_inline .slds-form-element,\n  .slds-form_inline .slds-form-element__label,\n  .slds-form_inline .slds-form-element__control,\n  .slds-form--inline .slds-form-element,\n  .slds-form--inline .slds-form-element__label,\n  .slds-form--inline .slds-form-element__control {\n    display: inline-block;\n    vertical-align: middle;\n    margin-bottom: 0; } }\n\n/**\n * @summary Creates a form that consists of multiple form groups\n *\n * @name compound\n * @selector .slds-form_compound\n * @restrict .slds-form\n * @variant\n */\n.slds-form_compound .slds-form-element__row,\n.slds-form--compound .slds-form-element__row {\n  display: -ms-flexbox;\n  display: flex;\n  margin-bottom: 0.5rem; }\n\n.slds-form_compound .slds-form-element__row + .slds-form-element__row,\n.slds-form--compound .slds-form-element__row + .slds-form-element__row {\n  clear: both; }\n\n.slds-form_compound .slds-form-element__row .slds-form-element + .slds-form-element,\n.slds-form--compound .slds-form-element__row .slds-form-element + .slds-form-element {\n  margin-left: 0.5rem; }\n\n.slds-form_compound .slds-form-element__control,\n.slds-form--compound .slds-form-element__control {\n  position: relative; }\n\n.slds-form_compound .slds-form-element__control + .slds-form-element__control,\n.slds-form--compound .slds-form-element__control + .slds-form-element__control {\n  padding-left: 0.5rem; }\n\n/**\n * The popover should be positioned with JavaScript.\n *\n * When errors are found within a form, the user will be notified with a popover\n * with the page-level errors listed out. Please provide a contextually specific\n * title for the dialog with the aria-label attribute. e.g. \"Acme Global edit\n * form errors\"\n *\n * @summary Creates a docked form footer\n *\n * @name base\n * @selector .slds-docked-form-footer\n * @restrict div\n * @required\n * @variant\n */\n.slds-docked-form-footer {\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  background: #f3f2f2;\n  box-shadow: 0 -2px 2px 0 rgba(0, 0, 0, 0.16);\n  z-index: 8000;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: center;\n      justify-content: center;\n  padding: 0.5rem 0; }\n\n/**\n * @summary Initializes slider component\n *\n * @name base\n * @selector .slds-slider\n * @restrict div\n * @variant\n */\n.slds-slider {\n  display: -ms-flexbox;\n  display: flex;\n  position: relative; }\n\n/**\n * @summary Range track for slider\n *\n * @selector .slds-slider__range\n * @restrict input\n */\n.slds-slider__range {\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n  width: 100%;\n  margin: 0.5rem 0;\n  background: transparent;\n  border-radius: 0.125rem; }\n\n.slds-slider__range:focus {\n  outline: 0; }\n\n.slds-slider__range::-webkit-slider-thumb {\n  -webkit-appearance: none;\n          appearance: none;\n  width: 1rem;\n  height: 1rem;\n  border-radius: 50%;\n  background: #0070d2;\n  border: 0;\n  box-shadow: rgba(0, 0, 0, 0.16) 0 2px 3px;\n  cursor: pointer;\n  transition: background 0.15s ease-in-out;\n  margin-top: calc(((1rem / 2) - (4px / 2)) * -1); }\n\n.slds-slider__range::-webkit-slider-thumb:hover {\n  background-color: #005fb2; }\n\n.slds-slider__range::-webkit-slider-runnable-track {\n  width: 100%;\n  height: 4px;\n  cursor: pointer;\n  background: #ecebea;\n  border-radius: 0.125rem; }\n\n.slds-slider__range::-moz-range-thumb {\n  -moz-appearance: none;\n       appearance: none;\n  width: 1rem;\n  height: 1rem;\n  border-radius: 50%;\n  background: #0070d2;\n  border: 0;\n  box-shadow: rgba(0, 0, 0, 0.16) 0 2px 3px;\n  cursor: pointer;\n  transition: background 0.15s ease-in-out; }\n\n.slds-slider__range::-moz-range-thumb:hover {\n  background-color: #005fb2; }\n\n.slds-slider__range::-moz-range-track {\n  width: 100%;\n  height: 4px;\n  cursor: pointer;\n  background: #ecebea;\n  border-radius: 0.125rem; }\n\n.slds-slider__range::-ms-track {\n  width: 100%;\n  height: 4px;\n  cursor: pointer;\n  background: #ecebea;\n  border-radius: 0.125rem;\n  width: 100%;\n  background: transparent;\n  border-color: transparent;\n  color: transparent;\n  cursor: pointer; }\n\n.slds-slider__range::-ms-thumb {\n  appearance: none;\n  width: 1rem;\n  height: 1rem;\n  border-radius: 50%;\n  background: #0070d2;\n  border: 0;\n  box-shadow: rgba(0, 0, 0, 0.16) 0 2px 3px;\n  cursor: pointer;\n  transition: background 0.15s ease-in-out; }\n\n.slds-slider__range::-ms-thumb:hover {\n  background-color: #005fb2; }\n\n.slds-slider__range:focus::-webkit-slider-thumb {\n  background-color: #005fb2;\n  box-shadow: 0 0 3px #0070D2; }\n\n.slds-slider__range:active::-webkit-slider-thumb {\n  background-color: #005fb2; }\n\n.slds-slider__range:focus::-moz-range-thumb {\n  background-color: #005fb2;\n  box-shadow: 0 0 3px #0070D2; }\n\n.slds-slider__range:active::-moz-range-thumb {\n  background-color: #005fb2; }\n\n.slds-slider__range[disabled]::-webkit-slider-thumb {\n  background-color: #ecebea;\n  cursor: default; }\n\n.slds-slider__range[disabled]::-webkit-slider-runnable-track {\n  background-color: #ecebea;\n  cursor: default; }\n\n.slds-slider__range[disabled]::-moz-range-thumb {\n  background-color: #ecebea;\n  cursor: default; }\n\n.slds-slider__range[disabled]::-moz-range-track {\n  background-color: #ecebea; }\n\n.slds-slider__range[disabled]::-ms-thumb {\n  background-color: #ecebea;\n  cursor: default; }\n\n.slds-slider__range[disabled]::-ms-track {\n  background-color: #ecebea;\n  cursor: default; }\n\n/**\n * @summary Element that contains value of input range\n *\n * @selector .slds-slider__value\n * @restrict .slds-slider span\n */\n.slds-slider__value {\n  padding: 0 0.5rem; }\n\n/**\n * @summary Contains the label and range for the slider label - not required\n *\n * @selector .slds-slider-label\n * @restrict span\n */\n/**\n * @summary Contains the label for the slider and adds a hook for adding `.slds-assistive-text` class to visually hide the label, but not the range\n *\n * @selector .slds-slider-label__label\n * @restrict .slds-slider-label span\n */\n.slds-slider-label__label {\n  display: block; }\n\n/**\n * @summary Contains the range for the slider\n *\n * @selector .slds-slider-label__range\n * @restrict .slds-slider-label span\n */\n/**\n * @summary Modifier that makes the slider vertical\n *\n * @selector .slds-slider_vertical\n * @restrict .slds-slider\n * @modifier\n */\n.slds-slider_vertical {\n  height: 13.875rem; }\n\n.slds-slider_vertical .slds-slider__range {\n  width: 12rem;\n  height: 1rem;\n  transform: rotate(-90deg);\n  transform-origin: 6rem 6rem; }\n\n.slds-slider_vertical .slds-slider__value {\n  position: absolute;\n  left: 0;\n  bottom: 0;\n  padding: 0; }\n\n/**\n * @name base\n * @selector .slds-file-selector\n * @restrict div\n * @variant\n */\n.slds-file-selector {\n  display: -ms-inline-flexbox;\n  display: inline-flex; }\n\n/**\n * Region that a file can be dropped within\n *\n * @selector .slds-file-selector__dropzone\n * @restrict .slds-file-selector div\n * @required\n */\n.slds-file-selector__dropzone {\n  padding: 0.125rem;\n  border: 1px dashed #dddbda;\n  border-radius: 0.25rem;\n  /**\n   * @selector .slds-has-drag-over\n   * @restrict .slds-file-selector__dropzone\n   * @modifier\n   */ }\n\n.slds-file-selector__dropzone.slds-has-drag-over {\n  outline: 0;\n  border-color: #1589ee;\n  box-shadow: 0 0 3px #0070D2;\n  border-style: solid; }\n\n/**\n * Hidden input element\n *\n * @selector .slds-file-selector__input\n * @restrict .slds-file-selector input\n * @required\n */\n.slds-file-selector__input:focus ~ .slds-file-selector__body > .slds-file-selector__button {\n  box-shadow: 0 0 3px #0070D2; }\n\n.slds-file-selector__input[disabled] ~ .slds-file-selector__body {\n  color: #dddbda; }\n\n.slds-file-selector__input[disabled] ~ .slds-file-selector__body > .slds-file-selector__button {\n  background: #e0e5ee;\n  border-color: transparent;\n  color: white; }\n\n.slds-file-selector__input[disabled] ~ .slds-file-selector__body > .slds-file-selector__body-icon {\n  fill: currentColor; }\n\n/**\n * Faux button\n *\n * @selector .slds-file-selector__button\n * @restrict .slds-file-selector button, .slds-file-selector span\n * @required\n */\n.slds-file-selector__button {\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  -ms-flex-align: center;\n      align-items: center; }\n\n/**\n * Modifications based on context\n *\n * Single Line\n * Dedicated dropzone when there are multiple dropzones in the form or when\n * the input is positioned among other form inputs.\n *\n * @selector .slds-file-selector_files\n * @restrict .slds-file-selector\n * @required\n */\n.slds-file-selector_files,\n.slds-file-selector--files {\n  /**\n   * Container for file selector content, specifically within the dropzone\n   *\n   * @selector .slds-file-selector__body\n   * @restrict .slds-file-selector label\n   * @required\n   */\n  /**\n   * Descriptive call back text\n   *\n   * @selector .slds-file-selector__text\n   * @restrict .slds-file-selector span\n   * @required\n   */ }\n\n.slds-file-selector_files .slds-file-selector__body,\n.slds-file-selector--files .slds-file-selector__body {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n      align-items: center; }\n\n.slds-file-selector_files .slds-file-selector__button,\n.slds-file-selector--files .slds-file-selector__button {\n  max-height: 1.625rem;\n  line-height: 1.625rem; }\n\n.slds-file-selector_files .slds-file-selector__text,\n.slds-file-selector--files .slds-file-selector__text {\n  margin-left: 0.5rem;\n  margin-right: 0.75rem; }\n\n/**\n * Multi Line / Image\n *\n * Use as a dedicated dropzone for image files only. May require a\n * cropping control.\n *\n * @name image\n * @selector .slds-file-selector_images\n * @restrict .slds-file-selector\n * @required\n * @variant\n */\n.slds-file-selector_images,\n.slds-file-selector--images {\n  display: block; }\n\n.slds-file-selector_images .slds-file-selector__dropzone,\n.slds-file-selector--images .slds-file-selector__dropzone {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: center;\n      justify-content: center;\n  -ms-flex-line-pack: center;\n      align-content: center;\n  -ms-flex-align: center;\n      align-items: center;\n  margin: auto; }\n\n.slds-file-selector_images .slds-file-selector__dropzone:after,\n.slds-file-selector--images .slds-file-selector__dropzone:after {\n  content: '';\n  padding-top: 100%;\n  display: table; }\n\n.slds-file-selector_images .slds-file-selector__body,\n.slds-file-selector--images .slds-file-selector__body {\n  text-align: center; }\n\n.slds-file-selector_images .slds-file-selector__text,\n.slds-file-selector--images .slds-file-selector__text {\n  margin-top: 0.75rem; }\n\n/**\n * Invisible Dropzone (Container)\n *\n * Use when an entire container should be droppable.\n * The container should have a visible boundary, like a modal, composer, or page.\n *\n * @name integrated\n * @selector .slds-file-selector_integrated\n * @restrict .slds-file-selector\n * @required\n * @variant\n */\n.slds-file-selector_integrated,\n.slds-file-selector--integrated {\n  width: 100%;\n  height: 100%;\n  position: relative;\n  display: block; }\n\n/**\n * Specific to integrated file selector — region that a file can be dropped within\n *\n * @selector .slds-file-selector__dropzone_integrated\n * @restrict .slds-file-selector_integrated div\n * @required\n */\n.slds-file-selector__dropzone_integrated,\n.slds-file-selector__dropzone--integrated {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: center;\n      justify-content: center;\n  -ms-flex-line-pack: center;\n      align-content: center;\n  -ms-flex-align: center;\n      align-items: center;\n  margin: auto;\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  border: 0;\n  opacity: 0;\n  z-index: -1;\n  /**\n   * Informs dropzone that file has been dragged into the viewport\n   *\n   * @selector .slds-has-drag\n   * @restrict .slds-file-selector__dropzone_integrated\n   * @notes To be added with JavaScript\n   * @required\n   * @modifier\n   */\n  /**\n   * Informs dropzone that file has been dragged into its region\n   *\n   * @selector .slds-has-drag-over\n   * @restrict .slds-file-selector__dropzone_integrated\n   * @notes To be added with JavaScript\n   * @required\n   * @modifier\n   */ }\n\n.slds-file-selector__dropzone_integrated.slds-has-drag,\n.slds-file-selector__dropzone--integrated.slds-has-drag {\n  background: rgba(255, 255, 255, 0.75);\n  opacity: 1;\n  z-index: 8000; }\n\n.slds-file-selector__dropzone_integrated.slds-has-drag-over,\n.slds-file-selector__dropzone--integrated.slds-has-drag-over {\n  background: #fafaf9;\n  box-shadow: 0 0 0 4px #1589ee inset; }\n\n/**\n * Specific to integrated file selector — container for file selector\n * content, specifically within the dropzone\n *\n * @selector .slds-file-selector__body_integrated\n * @restrict .slds-file-selector_integrated label\n * @required\n */\n.slds-file-selector__body_integrated,\n.slds-file-selector__body--integrated {\n  width: 12rem;\n  height: 12rem;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: center;\n      justify-content: center;\n  -ms-flex-line-pack: center;\n      align-content: center;\n  -ms-flex-align: center;\n      align-items: center;\n  margin: auto;\n  background: white;\n  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.16);\n  border: 1px solid #dddbda;\n  border-radius: 0.25rem;\n  -ms-flex-direction: column;\n      flex-direction: column; }\n\n/**\n * Specific to integrated file selector — Descriptive call back text\n *\n * @selector .slds-file-selector__text_integrated\n * @restrict .slds-file-selector_integrated span\n * @required\n */\n.slds-file-selector__text_integrated,\n.slds-file-selector__text--integrated {\n  margin-top: 0.75rem; }\n\n/**\n * The page header is a masthead that contains the Title of the page, and supporting details. For large form factors, it may include actions.\n *\n * @summary Initializes page header\n *\n * @variant\n * @name base\n * @selector .slds-page-header\n * @restrict div\n * @support dev-ready\n */\n.slds-page-header {\n  padding: 1rem;\n  border-bottom: 1px solid #dddbda;\n  border-radius: 0.25rem;\n  background: #f3f2f2;\n  background-clip: padding-box;\n  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1);\n  border: 1px solid #dddbda; }\n\n/**\n * Page title (header text).\n *\n * @selector .slds-page-header__title\n * @restrict .slds-page-header h1\n */\n.slds-page-header__title {\n  font-size: 1.125rem;\n  font-weight: 700;\n  line-height: 1.25; }\n\n.slds-page-header__title .slds-icon {\n  fill: currentColor; }\n\n.slds-page-header_joined,\n.slds-page-header.slds-has-bottom-magnet {\n  border-bottom: 1px solid #dddbda;\n  border-radius: 0.25rem 0.25rem 0 0;\n  box-shadow: none; }\n\n.slds-tabs_card .slds-page-header,\n.slds-card .slds-page-header {\n  border: 0;\n  box-shadow: none;\n  border-radius: 0.25rem; }\n\n/**\n * Page header record home contains up to four\n * compact layout fields. They're contained in the `.slds-page-header__detail-row` div.\n * That div contains the top and bottom spacing needed for this version of the page header.\n *\n * When text is truncated, the full text should be placed in\n * a tooltip on hover (currently shown in the title\n * attribute). One line truncation is created by using the\n * `.slds-truncate` class. Two line truncation must be achieved\n * using JavaScript.\n *\n * The page header is located at the top of every record home. It includes the record title and compact layout for a record. Excluding the title, the page header displays 4 compact layout fields. Similar data types can be rolled up and be displayed as a single field.\n *\n * **Record Title**\n *\n * - Display Record Type icon to the left of the title\n * - Record Type is displayed above the title\n * - When required, follow action is displayed to the right of the record title\n * - Display one line of text, truncate when the length conflicts with the page level actions\n *\n * As shown in Field 3, web addresses and email addresses should be parsed and displayed as hyperlinks linking to the appropriate mailto: or web url. Do not modify the user's input, display as intended.\n *\n * When text is truncated, display full field text in browser tooltip on hover.\n *\n * Display addresses in two lines. Street address on first line, City, State and Postal Code on line 2. For lengthy addresses, truncate each line individually based on the available width of the area using the `.slds-truncate` class. Display the full address via browser tooltip.\n *\n * @summary Bottom section containing record details\n *\n * @variant\n * @name record-home\n * @selector .slds-page-header__detail\n * @restrict .slds-page-header div\n * @support dev-ready\n * @required\n */\n.slds-page-header__detail {\n  /**\n   * Creates margins around the detail section of record home\n   *\n   * @selector .slds-page-header__detail-row\n   * @restrict .slds-page-header ul\n   * @notes Only the record home page header contains this detail area\n   */\n  /**\n   * Creates margins around the detail section of record home\n   *\n   * @selector .slds-page-header__detail-block\n   * @restrict .slds-page-header__detail-row li\n   * @notes Only the record home page header contains this detail area\n   */ }\n\n.slds-page-header__detail-row {\n  margin: 0.75rem -1rem -1rem;\n  padding: 0.75rem 1rem;\n  border-radius: 0 0 0.25rem 0.25rem;\n  background-color: white;\n  position: relative;\n  z-index: 2; }\n\n.slds-page-header__detail-block {\n  padding-right: 2rem;\n  padding-left: 2rem;\n  max-width: 25%; }\n\n.slds-page-header__detail-block:first-child {\n  padding-left: 0; }\n\n.slds-page-header__detail-block:last-child {\n  padding-right: 0; }\n\n/**\n * Vertical page header record home contains up to seven compact layout fields. They're contained in the `.slds-page-header__detail-row` div.\n * The heading does not truncate. This is typically used in more compact layouts where more vertical space is desired.\n *\n * @summary Initializes vertical page header\n *\n * @variant\n * @name record-home-vertical\n * @selector .slds-page-header_vertical\n * @restrict .slds-page-header\n * @support dev-ready\n */\n.slds-page-header_vertical,\n.slds-page-header--vertical {\n  padding: 0.75rem;\n  background: white;\n  border-bottom: 0; }\n\n/**\n * The title for the Object Home page header is sorting component.\n * The `.slds-text-focus` class is placed on the media object that\n * contains the title and down icon to simulate a hover and\n * focus state of a link.\n *\n * This component is created entirely of existing components\n * like grids, buttons, button groups, and\n * icons.\n *\n * @summary Initializes object home page header\n *\n * @variant\n * @name object-home\n * @selector .slds-page-header_object-home\n * @restrict .slds-page-header\n * @support dev-ready\n */\n.slds-page-header_object-home,\n.slds-page-header--object-home {\n  padding-bottom: 0.75rem; }\n\n/**\n * @variant\n * @name base\n * @selector .slds-brand-band\n * @restrict div\n * @support dev-ready\n */\n.slds-brand-band {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n      flex-direction: column;\n  position: relative;\n  height: 100%;\n  width: 100%;\n  /**\n   * @summary Changes background image to be set to cover rather than contain\n   * @selector .slds-brand-band_cover\n   * @restrict .slds-brand-band\n   * @modifier\n   */\n  /**\n   * @summary Sets height of brand band to\n   * @selector .slds-brand-band_small\n   * @restrict .slds-brand-band\n   * @modifier\n   * @group sizing\n   */\n  /**\n   * @summary Sets height of brand band to\n   * @selector .slds-brand-band_medium\n   * @restrict .slds-brand-band\n   * @modifier\n   * @group sizing\n   */\n  /**\n   * @summary Sets height of brand band to\n   * @selector .slds-brand-band_large\n   * @restrict .slds-brand-band\n   * @modifier\n   * @group sizing\n   */\n  /**\n   * @summary Removes image but keeps page background\n   * @selector .slds-brand-band_none\n   * @restrict .slds-brand-band\n   * @modifier\n   */ }\n\n.slds-brand-band:before {\n  content: '';\n  display: block;\n  position: absolute;\n  z-index: -1;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  background-image: url(\"/assets/images/themes/oneSalesforce/banner-brand-default.png\"), linear-gradient(to top, rgba(221, 219, 218, 0) 0, #e8e8e8);\n  background-repeat: repeat-x;\n  background-position: top left; }\n\n.slds-brand-band:after {\n  content: none;\n  display: block;\n  position: absolute;\n  z-index: -1;\n  left: 0;\n  right: 0;\n  top: 0;\n  width: 100%;\n  height: 3.125rem;\n  background-image: linear-gradient(to bottom, rgba(250, 250, 249, 0) 60%, #fafaf9); }\n\n.slds-brand-band.slds-brand-band_cover:before {\n  background-repeat: no-repeat;\n  background-size: cover; }\n\n.slds-brand-band.slds-brand-band_small:before {\n  height: 6rem; }\n\n.slds-brand-band.slds-brand-band_small:after {\n  content: '';\n  top: 2.875rem; }\n\n.slds-brand-band.slds-brand-band_medium:before {\n  height: 12.5rem; }\n\n.slds-brand-band.slds-brand-band_medium:after {\n  content: '';\n  top: 9.375rem; }\n\n.slds-brand-band.slds-brand-band_large:before {\n  height: 18.75rem; }\n\n.slds-brand-band.slds-brand-band_large:after {\n  content: '';\n  top: 15.625rem; }\n\n.slds-brand-band.slds-brand-band_full:before {\n  height: 100%; }\n\n.slds-brand-band.slds-brand-band_bottom:before {\n  background-position: bottom;\n  top: initial; }\n\n.slds-brand-band.slds-brand-band_none:before {\n  height: 0; }\n\n.slds-brand-band .slds-brand-band_blank {\n  background: white; }\n\n.slds-brand-band .slds-brand-band_blank:before, .slds-brand-band .slds-brand-band_blank:after {\n  background: none; }\n\n.slds-template__container {\n  position: relative;\n  height: 100%;\n  width: 100%; }\n\n.slds-template_default {\n  padding: 0.75rem; }\n\n.slds-template_default.slds-brand-band:before {\n  position: fixed;\n  top: 5.625rem; }\n\n.slds-template_default.slds-brand-band.slds-brand-band_medium:after {\n  position: fixed;\n  top: 15rem; }\n\n.slds-template_bottom-magnet {\n  padding: 0.75rem 0.75rem 0 0.75rem; }\n\n.slds-template_profile {\n  padding: 8rem 0.75rem 0.75rem; }\n\n.slds-template__content {\n  padding: 0.75rem 0.75rem 0 0.75rem; }\n\n.slds-template_app {\n  padding: 0.75rem 0 0 0.75rem; }\n\n.slds-template_iframe {\n  width: calc(100% + (0.75rem * 2));\n  height: calc(100% + (0.75rem * 2));\n  margin: -0.75rem;\n  background-color: white; }\n\n/**\n * @summary Initiates a panel\n *\n * @name detail\n * @selector .slds-panel\n * @restrict div\n * @variant\n */\n.slds-panel {\n  background: white;\n  border-radius: 0.25rem;\n  /**\n   * Contains sub sections of a panel\n   *\n   * @selector .slds-panel__section\n   * @restrict .slds-panel div\n   * @required\n   */\n  /**\n   * Contains form actions at the bottom of a panel\n   *\n   * @selector .slds-panel__actions\n   * @restrict .slds-panel div\n   * @required\n   */ }\n\n.slds-panel__section {\n  padding: 1rem; }\n\n.slds-panel__actions {\n  padding: 0.75rem; }\n\n.slds-panel.slds-is-editing {\n  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.16); }\n\n/**\n * @name filtering\n * @selector .slds-panel_filters\n * @restrict .slds-panel\n * @variant\n * @s1 false\n */\n.slds-panel_filters,\n.slds-panel--filters {\n  margin-left: 1rem;\n  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.16);\n  border-radius: 0; }\n\n/**\n * @selector .slds-filters\n * @restrict .slds-panel_filters div\n * @required\n */\n.slds-filters {\n  position: relative; }\n\n/**\n * Filters Header\n *\n * @selector .slds-filters__header\n * @restrict .slds-panel_filters div\n * @required\n */\n.slds-filters__header {\n  padding: 0.5rem 0.75rem; }\n\n/**\n * Filters Body\n *\n * @selector .slds-filters__body\n * @restrict .slds-panel_filters div\n * @required\n */\n.slds-filters__body {\n  padding: 0.5rem 0.75rem; }\n\n/**\n * Filters Footer\n *\n * @selector .slds-filters__footer\n * @restrict .slds-panel_filters div\n * @required\n */\n.slds-filters__footer {\n  padding: 0.5rem 1rem; }\n\n/**\n * Filterable Item\n *\n * @selector .slds-filters__item\n * @restrict .slds-panel_filters li div\n * @required\n */\n.slds-filters__item {\n  padding: 0.75rem;\n  background: white;\n  border: 1px solid #dddbda;\n  border-radius: 0.25rem;\n  /**\n   * Indicates that a filter is new and hasn't been saved\n   *\n   * @selector .slds-is-new\n   * @restrict .slds-filters__item\n   * @modifier\n   */\n  /**\n   * Indicates that a filter has an error\n   *\n   * @selector .slds-has-error\n   * @restrict .slds-filters__item\n   * @modifier\n   */\n  /**\n   * Indicates that a filter is locked\n   *\n   * @selector .slds-is-locked\n   * @restrict .slds-filters__item\n   * @modifier\n   */ }\n\n.slds-filters__item.slds-is-new {\n  background: #faffbd;\n  color: #3e3e3c; }\n\n.slds-filters__item.slds-has-error {\n  border-color: #c23934; }\n\n.slds-filters__item.slds-is-locked {\n  background: #f3f2f2; }\n\n.slds-filters__item + .slds-filters__item {\n  margin-top: 0.5rem; }\n\n.slds-filters__item:hover {\n  background: #f4f6f9; }\n\n/**\n * A dialog popover, `.slds-popover`, can be applied to all variants of a dialog\n * popover. It initiates the styles of the popover and enables `.slds-nubbin` to be applied.\n *\n * A dialog popover requires at least one focusable element.\n *\n * @name base\n * @selector .slds-popover\n * @restrict [role=\"dialog\"], [role=\"tooltip\"]\n * @variant\n */\n.slds-popover {\n  position: relative;\n  border-radius: 0.25rem;\n  width: 20rem;\n  min-height: 2rem;\n  z-index: 6000;\n  background-color: white;\n  display: inline-block;\n  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.16);\n  border: 1px solid #dddbda;\n  /**\n   * @summary Applies syles for primary content area of popover\n   * @selector .slds-popover__body\n   * @restrict .slds-popover div\n   */\n  /**\n   * @summary Applies styles for top area of popover\n   * @selector .slds-popover__header\n   * @restrict .slds-popover header, .slds-popover div\n   */\n  /**\n   * @summary Applies styles for footer area of popover\n   * @selector .slds-popover__footer\n   * @restrict .slds-popover footer\n   */\n  /**\n   * @summary Close button within a popover\n   * @selector .slds-popover__close\n   * @restrict .slds-popover button\n   */\n  /**\n   * @summary Width modifier for popover - small\n   * @selector .slds-popover_small\n   * @restrict .slds-popover\n   * @modifier\n   * @group width\n   */\n  /**\n   * @summary Width modifier for popover - medium\n   * @selector .slds-popover_medium\n   * @restrict .slds-popover\n   * @modifier\n   * @group width\n   */\n  /**\n   * @summary Width modifier for popover - large\n   * @selector .slds-popover_large\n   * @restrict .slds-popover\n   * @modifier\n   * @group width\n   */ }\n\n.slds-popover__body, .slds-popover__header, .slds-popover__footer {\n  position: relative;\n  padding: 0.5rem 0.75rem; }\n\n.slds-popover__header {\n  border-bottom: 1px solid #dddbda; }\n\n.slds-popover__footer {\n  border-top: 1px solid #dddbda; }\n\n.slds-popover__close {\n  position: relative;\n  margin: 0.25rem;\n  z-index: 6001; }\n\n.slds-popover_small, .slds-popover--small {\n  min-width: 15rem; }\n\n.slds-popover_medium, .slds-popover--medium {\n  min-width: 20rem; }\n\n.slds-popover_large, .slds-popover--large {\n  min-width: 25rem;\n  max-width: 512px; }\n\n.slds-popover[class*=\"theme_\"], .slds-popover[class*=\"theme--\"] {\n  border: 0; }\n\n.slds-popover *:last-child {\n  margin-bottom: 0; }\n\n/**\n * @name panels\n * @selector .slds-popover_panel\n * @restrict .slds-popover\n * @variant\n */\n.slds-popover_panel .slds-popover__header,\n.slds-popover--panel .slds-popover__header {\n  background: #f3f2f2;\n  padding: 1.5rem 1.5rem 0.75rem;\n  border-top-left-radius: calc(0.25rem - 1px);\n  border-top-right-radius: calc(0.25rem - 1px);\n  border-bottom: 0; }\n\n.slds-popover_panel .slds-popover__body,\n.slds-popover--panel .slds-popover__body {\n  padding: 0; }\n\n.slds-popover_panel .slds-popover__body-list,\n.slds-popover--panel .slds-popover__body-list {\n  padding: 1rem 1.5rem;\n  border-top: 1px solid #dddbda; }\n\n.slds-popover_panel.slds-nubbin_left-top:before, .slds-popover_panel.slds-nubbin_left-top:after, .slds-popover_panel.slds-nubbin--left-top:before, .slds-popover_panel.slds-nubbin--left-top:after, .slds-popover_panel.slds-nubbin_right-top:before, .slds-popover_panel.slds-nubbin_right-top:after, .slds-popover_panel.slds-nubbin--right-top:before, .slds-popover_panel.slds-nubbin--right-top:after, .slds-popover_panel.slds-nubbin_top-left:before, .slds-popover_panel.slds-nubbin_top-left:after, .slds-popover_panel.slds-nubbin--top-left:before, .slds-popover_panel.slds-nubbin--top-left:after, .slds-popover_panel.slds-nubbin_top-right:before, .slds-popover_panel.slds-nubbin_top-right:after, .slds-popover_panel.slds-nubbin--top-right:before, .slds-popover_panel.slds-nubbin--top-right:after,\n.slds-popover--panel.slds-nubbin_left-top:before,\n.slds-popover--panel.slds-nubbin_left-top:after,\n.slds-popover--panel.slds-nubbin--left-top:before,\n.slds-popover--panel.slds-nubbin--left-top:after,\n.slds-popover--panel.slds-nubbin_right-top:before,\n.slds-popover--panel.slds-nubbin_right-top:after,\n.slds-popover--panel.slds-nubbin--right-top:before,\n.slds-popover--panel.slds-nubbin--right-top:after,\n.slds-popover--panel.slds-nubbin_top-left:before,\n.slds-popover--panel.slds-nubbin_top-left:after,\n.slds-popover--panel.slds-nubbin--top-left:before,\n.slds-popover--panel.slds-nubbin--top-left:after,\n.slds-popover--panel.slds-nubbin_top-right:before,\n.slds-popover--panel.slds-nubbin_top-right:after,\n.slds-popover--panel.slds-nubbin--top-right:before,\n.slds-popover--panel.slds-nubbin--top-right:after {\n  background: #f3f2f2; }\n\n.slds-popover_panel.slds-nubbin_left-top:before, .slds-popover_panel.slds-nubbin_left-top:after, .slds-popover_panel.slds-nubbin--left-top:before, .slds-popover_panel.slds-nubbin--left-top:after, .slds-popover_panel.slds-nubbin_right-top:before, .slds-popover_panel.slds-nubbin_right-top:after, .slds-popover_panel.slds-nubbin--right-top:before, .slds-popover_panel.slds-nubbin--right-top:after,\n.slds-popover--panel.slds-nubbin_left-top:before,\n.slds-popover--panel.slds-nubbin_left-top:after,\n.slds-popover--panel.slds-nubbin--left-top:before,\n.slds-popover--panel.slds-nubbin--left-top:after,\n.slds-popover--panel.slds-nubbin_right-top:before,\n.slds-popover--panel.slds-nubbin_right-top:after,\n.slds-popover--panel.slds-nubbin--right-top:before,\n.slds-popover--panel.slds-nubbin--right-top:after {\n  top: 2.25rem; }\n\n/**\n   * @selector .slds-nubbin_top\n   * @restrict .slds-popover, .slds-dropdown\n   * @modifier\n   * @group nubbins\n   */\n.slds-nubbin_top:before,\n.slds-nubbin--top:before {\n  width: 1rem;\n  height: 1rem;\n  position: absolute;\n  transform: rotate(45deg);\n  content: '';\n  background-color: inherit;\n  left: 50%;\n  top: -0.5rem;\n  margin-left: -0.5rem; }\n\n.slds-nubbin_top:after,\n.slds-nubbin--top:after {\n  width: 1rem;\n  height: 1rem;\n  position: absolute;\n  transform: rotate(45deg);\n  content: '';\n  background-color: inherit;\n  left: 50%;\n  top: -0.5rem;\n  margin-left: -0.5rem; }\n\n.slds-nubbin_top:after,\n.slds-nubbin--top:after {\n  box-shadow: -1px -1px 0 0 rgba(0, 0, 0, 0.16);\n  z-index: -1; }\n\n/**\n   * @selector .slds-nubbin_top-left\n   * @restrict .slds-popover, .slds-dropdown\n   * @modifier\n   * @group nubbins\n   */\n.slds-nubbin_top-left:before,\n.slds-nubbin--top-left:before {\n  width: 1rem;\n  height: 1rem;\n  position: absolute;\n  transform: rotate(45deg);\n  content: '';\n  background-color: inherit;\n  left: 50%;\n  top: -0.5rem;\n  margin-left: -0.5rem; }\n\n.slds-nubbin_top-left:after,\n.slds-nubbin--top-left:after {\n  width: 1rem;\n  height: 1rem;\n  position: absolute;\n  transform: rotate(45deg);\n  content: '';\n  background-color: inherit;\n  left: 50%;\n  top: -0.5rem;\n  margin-left: -0.5rem; }\n\n.slds-nubbin_top-left:after,\n.slds-nubbin--top-left:after {\n  box-shadow: -1px -1px 0 0 rgba(0, 0, 0, 0.16);\n  z-index: -1; }\n\n.slds-nubbin_top-left:before, .slds-nubbin_top-left:after,\n.slds-nubbin--top-left:before,\n.slds-nubbin--top-left:after {\n  left: 1.5rem;\n  top: -0.5rem; }\n\n/**\n   * @selector .slds-nubbin_top-right\n   * @restrict .slds-popover, .slds-dropdown\n   * @modifier\n   * @group nubbins\n   */\n.slds-nubbin_top-right:before,\n.slds-nubbin--top-right:before {\n  width: 1rem;\n  height: 1rem;\n  position: absolute;\n  transform: rotate(45deg);\n  content: '';\n  background-color: inherit;\n  left: 50%;\n  top: -0.5rem;\n  margin-left: -0.5rem; }\n\n.slds-nubbin_top-right:after,\n.slds-nubbin--top-right:after {\n  width: 1rem;\n  height: 1rem;\n  position: absolute;\n  transform: rotate(45deg);\n  content: '';\n  background-color: inherit;\n  left: 50%;\n  top: -0.5rem;\n  margin-left: -0.5rem; }\n\n.slds-nubbin_top-right:after,\n.slds-nubbin--top-right:after {\n  box-shadow: -1px -1px 0 0 rgba(0, 0, 0, 0.16);\n  z-index: -1; }\n\n.slds-nubbin_top-right:before, .slds-nubbin_top-right:after,\n.slds-nubbin--top-right:before,\n.slds-nubbin--top-right:after {\n  left: auto;\n  right: 1.5rem;\n  top: -0.5rem;\n  margin-right: -0.5rem; }\n\n/**\n   * @selector .slds-nubbin_bottom\n   * @restrict .slds-popover, .slds-dropdown\n   * @modifier\n   * @group nubbins\n   */\n.slds-nubbin_bottom:before,\n.slds-nubbin--bottom:before {\n  width: 1rem;\n  height: 1rem;\n  position: absolute;\n  transform: rotate(45deg);\n  content: '';\n  background-color: inherit;\n  left: 50%;\n  bottom: -0.5rem;\n  margin-left: -0.5rem; }\n\n.slds-nubbin_bottom:after,\n.slds-nubbin--bottom:after {\n  width: 1rem;\n  height: 1rem;\n  position: absolute;\n  transform: rotate(45deg);\n  content: '';\n  background-color: inherit;\n  left: 50%;\n  bottom: -0.5rem;\n  margin-left: -0.5rem; }\n\n.slds-nubbin_bottom:after,\n.slds-nubbin--bottom:after {\n  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.16);\n  z-index: -1; }\n\n/**\n   * @selector .slds-nubbin_bottom-left\n   * @restrict .slds-popover, .slds-dropdown\n   * @modifier\n   * @group nubbins\n   */\n.slds-nubbin_bottom-left:before,\n.slds-nubbin--bottom-left:before {\n  width: 1rem;\n  height: 1rem;\n  position: absolute;\n  transform: rotate(45deg);\n  content: '';\n  background-color: inherit;\n  left: 50%;\n  bottom: -0.5rem;\n  margin-left: -0.5rem; }\n\n.slds-nubbin_bottom-left:after,\n.slds-nubbin--bottom-left:after {\n  width: 1rem;\n  height: 1rem;\n  position: absolute;\n  transform: rotate(45deg);\n  content: '';\n  background-color: inherit;\n  left: 50%;\n  bottom: -0.5rem;\n  margin-left: -0.5rem; }\n\n.slds-nubbin_bottom-left:after,\n.slds-nubbin--bottom-left:after {\n  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.16);\n  z-index: -1; }\n\n.slds-nubbin_bottom-left:before, .slds-nubbin_bottom-left:after,\n.slds-nubbin--bottom-left:before,\n.slds-nubbin--bottom-left:after {\n  left: 1.5rem;\n  top: 100%;\n  margin-top: -0.5rem; }\n\n/**\n   * @selector .slds-nubbin_bottom-right\n   * @restrict .slds-popover, .slds-dropdown\n   * @modifier\n   * @group nubbins\n   */\n.slds-nubbin_bottom-right:before,\n.slds-nubbin--bottom-right:before {\n  width: 1rem;\n  height: 1rem;\n  position: absolute;\n  transform: rotate(45deg);\n  content: '';\n  background-color: inherit;\n  left: 50%;\n  bottom: -0.5rem;\n  margin-left: -0.5rem; }\n\n.slds-nubbin_bottom-right:after,\n.slds-nubbin--bottom-right:after {\n  width: 1rem;\n  height: 1rem;\n  position: absolute;\n  transform: rotate(45deg);\n  content: '';\n  background-color: inherit;\n  left: 50%;\n  bottom: -0.5rem;\n  margin-left: -0.5rem; }\n\n.slds-nubbin_bottom-right:after,\n.slds-nubbin--bottom-right:after {\n  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.16);\n  z-index: -1; }\n\n.slds-nubbin_bottom-right:before, .slds-nubbin_bottom-right:after,\n.slds-nubbin--bottom-right:before,\n.slds-nubbin--bottom-right:after {\n  left: auto;\n  right: 1.5rem;\n  top: 100%;\n  margin-top: -0.5rem;\n  margin-right: -0.5rem; }\n\n/**\n   * @selector .slds-nubbin_left\n   * @restrict .slds-popover, .slds-dropdown\n   * @modifier\n   * @group nubbins\n   */\n.slds-nubbin_left:before,\n.slds-nubbin--left:before {\n  width: 1rem;\n  height: 1rem;\n  position: absolute;\n  transform: rotate(45deg);\n  content: '';\n  background-color: inherit;\n  top: 50%;\n  left: -0.5rem;\n  margin-top: -0.5rem; }\n\n.slds-nubbin_left:after,\n.slds-nubbin--left:after {\n  width: 1rem;\n  height: 1rem;\n  position: absolute;\n  transform: rotate(45deg);\n  content: '';\n  background-color: inherit;\n  top: 50%;\n  left: -0.5rem;\n  margin-top: -0.5rem; }\n\n.slds-nubbin_left:after,\n.slds-nubbin--left:after {\n  box-shadow: -1px 1px 2px 0 rgba(0, 0, 0, 0.16);\n  z-index: -1; }\n\n/**\n   * @selector .slds-nubbin_left-top\n   * @restrict .slds-popover, .slds-dropdown\n   * @modifier\n   * @group nubbins\n   */\n.slds-nubbin_left-top:before,\n.slds-nubbin--left-top:before {\n  width: 1rem;\n  height: 1rem;\n  position: absolute;\n  transform: rotate(45deg);\n  content: '';\n  background-color: inherit;\n  top: 50%;\n  left: -0.5rem;\n  margin-top: -0.5rem; }\n\n.slds-nubbin_left-top:after,\n.slds-nubbin--left-top:after {\n  width: 1rem;\n  height: 1rem;\n  position: absolute;\n  transform: rotate(45deg);\n  content: '';\n  background-color: inherit;\n  top: 50%;\n  left: -0.5rem;\n  margin-top: -0.5rem; }\n\n.slds-nubbin_left-top:after,\n.slds-nubbin--left-top:after {\n  box-shadow: -1px 1px 2px 0 rgba(0, 0, 0, 0.16);\n  z-index: -1; }\n\n.slds-nubbin_left-top:before, .slds-nubbin_left-top:after,\n.slds-nubbin--left-top:before,\n.slds-nubbin--left-top:after {\n  top: 1.5rem; }\n\n/**\n   * @selector .slds-nubbin_left-bottom\n   * @restrict .slds-popover, .slds-dropdown\n   * @modifier\n   * @group nubbins\n   */\n.slds-nubbin_left-bottom:before,\n.slds-nubbin--left-bottom:before {\n  width: 1rem;\n  height: 1rem;\n  position: absolute;\n  transform: rotate(45deg);\n  content: '';\n  background-color: inherit;\n  top: 50%;\n  left: -0.5rem;\n  margin-top: -0.5rem; }\n\n.slds-nubbin_left-bottom:after,\n.slds-nubbin--left-bottom:after {\n  width: 1rem;\n  height: 1rem;\n  position: absolute;\n  transform: rotate(45deg);\n  content: '';\n  background-color: inherit;\n  top: 50%;\n  left: -0.5rem;\n  margin-top: -0.5rem; }\n\n.slds-nubbin_left-bottom:before,\n.slds-nubbin--left-bottom:before {\n  margin-bottom: -1px; }\n\n.slds-nubbin_left-bottom:after,\n.slds-nubbin--left-bottom:after {\n  box-shadow: -1px 2px 3px 0 rgba(0, 0, 0, 0.16);\n  z-index: -1; }\n\n.slds-nubbin_left-bottom:before, .slds-nubbin_left-bottom:after,\n.slds-nubbin--left-bottom:before,\n.slds-nubbin--left-bottom:after {\n  top: auto;\n  bottom: 1rem; }\n\n/**\n   * @selector .slds-nubbin_right\n   * @restrict .slds-popover, .slds-dropdown\n   * @modifier\n   * @group nubbins\n   */\n.slds-nubbin_right:before,\n.slds-nubbin--right:before {\n  width: 1rem;\n  height: 1rem;\n  position: absolute;\n  transform: rotate(45deg);\n  content: '';\n  background-color: inherit;\n  top: 50%;\n  right: -0.5rem;\n  margin-top: -0.5rem; }\n\n.slds-nubbin_right:after,\n.slds-nubbin--right:after {\n  width: 1rem;\n  height: 1rem;\n  position: absolute;\n  transform: rotate(45deg);\n  content: '';\n  background-color: inherit;\n  top: 50%;\n  right: -0.5rem;\n  margin-top: -0.5rem; }\n\n.slds-nubbin_right:after,\n.slds-nubbin--right:after {\n  box-shadow: 1px -1px 2px 0 rgba(0, 0, 0, 0.16);\n  z-index: -1; }\n\n/**\n   * @selector .slds-nubbin_right-top\n   * @restrict .slds-popover, .slds-dropdown\n   * @modifier\n   * @group nubbins\n   */\n.slds-nubbin_right-top:before,\n.slds-nubbin--right-top:before {\n  width: 1rem;\n  height: 1rem;\n  position: absolute;\n  transform: rotate(45deg);\n  content: '';\n  background-color: inherit;\n  top: 50%;\n  right: -0.5rem;\n  margin-top: -0.5rem; }\n\n.slds-nubbin_right-top:after,\n.slds-nubbin--right-top:after {\n  width: 1rem;\n  height: 1rem;\n  position: absolute;\n  transform: rotate(45deg);\n  content: '';\n  background-color: inherit;\n  top: 50%;\n  right: -0.5rem;\n  margin-top: -0.5rem; }\n\n.slds-nubbin_right-top:after,\n.slds-nubbin--right-top:after {\n  box-shadow: 1px -1px 2px 0 rgba(0, 0, 0, 0.16);\n  z-index: -1; }\n\n.slds-nubbin_right-top:before, .slds-nubbin_right-top:after,\n.slds-nubbin--right-top:before,\n.slds-nubbin--right-top:after {\n  top: 1.5rem; }\n\n/**\n   * @selector .slds-nubbin_right-bottom\n   * @restrict .slds-popover, .slds-dropdown\n   * @modifier\n   * @group nubbins\n   */\n.slds-nubbin_right-bottom:before,\n.slds-nubbin--right-bottom:before {\n  width: 1rem;\n  height: 1rem;\n  position: absolute;\n  transform: rotate(45deg);\n  content: '';\n  background-color: inherit;\n  top: 50%;\n  right: -0.5rem;\n  margin-top: -0.5rem; }\n\n.slds-nubbin_right-bottom:after,\n.slds-nubbin--right-bottom:after {\n  width: 1rem;\n  height: 1rem;\n  position: absolute;\n  transform: rotate(45deg);\n  content: '';\n  background-color: inherit;\n  top: 50%;\n  right: -0.5rem;\n  margin-top: -0.5rem; }\n\n.slds-nubbin_right-bottom:before,\n.slds-nubbin--right-bottom:before {\n  margin-bottom: -1px; }\n\n.slds-nubbin_right-bottom:after,\n.slds-nubbin--right-bottom:after {\n  box-shadow: 2px -1px 3px 0 rgba(0, 0, 0, 0.16);\n  z-index: -1; }\n\n.slds-nubbin_right-bottom:before, .slds-nubbin_right-bottom:after,\n.slds-nubbin--right-bottom:before,\n.slds-nubbin--right-bottom:after {\n  top: auto;\n  bottom: 1rem; }\n\n/**\n * Walkthrough components are used to provide an interactive and educational prospect experience for setup.\n *\n * @summary Initializes a walkthrough non-modal dialog\n *\n * @name walkthrough\n * @selector .slds-popover_walkthrough\n * @restrict .slds-popover\n * @variant\n */\n.slds-popover_walkthrough,\n.slds-popover--walkthrough {\n  border-color: #061c3f;\n  color: white;\n  background: #032e61;\n  border-color: #032e61; }\n\n.slds-popover_walkthrough .slds-text-title,\n.slds-popover_walkthrough .slds-text-title_caps,\n.slds-popover_walkthrough .slds-text-title--caps,\n.slds-popover--walkthrough .slds-text-title,\n.slds-popover--walkthrough .slds-text-title_caps,\n.slds-popover--walkthrough .slds-text-title--caps {\n  color: #b0adab; }\n\n.slds-popover_walkthrough .slds-icon,\n.slds-popover--walkthrough .slds-icon {\n  fill: currentColor; }\n\n.slds-popover_walkthrough a,\n.slds-popover--walkthrough a {\n  color: currentColor; }\n\n.slds-popover_walkthrough a:hover, .slds-popover_walkthrough a:focus,\n.slds-popover--walkthrough a:hover,\n.slds-popover--walkthrough a:focus {\n  color: rgba(255, 255, 255, 0.75);\n  text-decoration: none;\n  outline: 0; }\n\n.slds-popover_walkthrough a:active,\n.slds-popover--walkthrough a:active {\n  color: rgba(255, 255, 255, 0.5); }\n\n.slds-popover_walkthrough a[disabled],\n.slds-popover--walkthrough a[disabled] {\n  color: rgba(255, 255, 255, 0.15); }\n\n.slds-popover_walkthrough a,\n.slds-popover--walkthrough a {\n  text-decoration: underline; }\n\n.slds-popover_walkthrough .slds-popover__header,\n.slds-popover--walkthrough .slds-popover__header {\n  background-color: #164a85;\n  background-image: url(\"/assets/images/popovers/popover-header.png\");\n  background-repeat: no-repeat;\n  background-position: bottom;\n  background-size: contain;\n  border-color: inherit;\n  padding: 0.75rem 1rem;\n  text-shadow: 0 0 4px #032e61; }\n\n.slds-popover_walkthrough .slds-popover__body,\n.slds-popover_walkthrough .slds-popover__footer,\n.slds-popover--walkthrough .slds-popover__body,\n.slds-popover--walkthrough .slds-popover__footer {\n  padding: 1rem; }\n\n.slds-popover_walkthrough .slds-popover__footer,\n.slds-popover--walkthrough .slds-popover__footer {\n  border: 0; }\n\n.slds-popover_walkthrough .slds-popover__close,\n.slds-popover--walkthrough .slds-popover__close {\n  margin-top: 0.5rem;\n  margin-right: 0.5rem; }\n\n.slds-popover_walkthrough .slds-text-title,\n.slds-popover--walkthrough .slds-text-title {\n  color: #d9dbdd; }\n\n.slds-popover_walkthrough.slds-nubbin_top:before, .slds-popover_walkthrough.slds-nubbin--top:before, .slds-popover_walkthrough.slds-nubbin_top-left:before, .slds-popover_walkthrough.slds-nubbin--top-left:before, .slds-popover_walkthrough.slds-nubbin_top-right:before, .slds-popover_walkthrough.slds-nubbin--top-right:before, .slds-popover_walkthrough.slds-nubbin_left-top:before, .slds-popover_walkthrough.slds-nubbin--left-top:before, .slds-popover_walkthrough.slds-nubbin_right-top:before, .slds-popover_walkthrough.slds-nubbin--right-top:before,\n.slds-popover--walkthrough.slds-nubbin_top:before,\n.slds-popover--walkthrough.slds-nubbin--top:before,\n.slds-popover--walkthrough.slds-nubbin_top-left:before,\n.slds-popover--walkthrough.slds-nubbin--top-left:before,\n.slds-popover--walkthrough.slds-nubbin_top-right:before,\n.slds-popover--walkthrough.slds-nubbin--top-right:before,\n.slds-popover--walkthrough.slds-nubbin_left-top:before,\n.slds-popover--walkthrough.slds-nubbin--left-top:before,\n.slds-popover--walkthrough.slds-nubbin_right-top:before,\n.slds-popover--walkthrough.slds-nubbin--right-top:before {\n  background-color: #164a85; }\n\n/**\n * Alternate background for walkthrough non-modal dialog\n *\n * @selector .slds-popover_walkthrough-alt\n * @restrict .slds-popover_walkthrough\n * @modifier\n */\n.slds-popover_walkthrough-alt,\n.slds-popover_feature {\n  border-color: #164a85;\n  background-color: #164a85;\n  background-image: url(\"/assets/images/popovers/popover-action.png\");\n  background-repeat: no-repeat;\n  background-size: 100% 2.25rem;\n  background-position: bottom;\n  padding-bottom: 1.5rem;\n  color: white; }\n\n.slds-popover_walkthrough-alt .slds-text-heading_small,\n.slds-popover_feature .slds-text-heading_small {\n  margin-bottom: 0.5rem; }\n\n.slds-popover_walkthrough-alt.slds-nubbin_bottom:before, .slds-popover_walkthrough-alt.slds-nubbin--bottom:before, .slds-popover_walkthrough-alt.slds-nubbin_bottom-left:before, .slds-popover_walkthrough-alt.slds-nubbin--bottom-left:before, .slds-popover_walkthrough-alt.slds-nubbin_bottom-right:before, .slds-popover_walkthrough-alt.slds-nubbin--bottom-right:before,\n.slds-popover_feature.slds-nubbin_bottom:before,\n.slds-popover_feature.slds-nubbin--bottom:before,\n.slds-popover_feature.slds-nubbin_bottom-left:before,\n.slds-popover_feature.slds-nubbin--bottom-left:before,\n.slds-popover_feature.slds-nubbin_bottom-right:before,\n.slds-popover_feature.slds-nubbin--bottom-right:before {\n  background-color: #215ca0; }\n\n/**\n * Einstein components are used to provide an interactive experience with Einstein features\n *\n * @summary Initializes a Einstein non-modal dialog\n *\n * @name einstein\n * @selector .slds-popover\n * @restrict [role=\"dialog\"], [role=\"tooltip\"]\n * @variant\n */\n/**\n * The tooltip should be positioned with JavaScript.\n *\n * You can include inline help tooltips for form elements and any focusable items, such as anchor links, buttons, etc. If your tooltips are available on hover, also make sure that they’re available on keyboard focus. To allow screen readers to access the tooltip, the HTML form field element must  have an `aria-describedby` attribute that points to the tooltip `ID` of the tooltip.\n *\n * @summary Initializes a tooltip\n *\n * @variant\n * @name base\n * @selector .slds-popover_tooltip\n * @restrict [role=\"tooltip\"]\n * @support dev-ready\n */\n.slds-popover_tooltip,\n.slds-popover--tooltip {\n  width: auto;\n  max-width: 20rem;\n  background: #16325c;\n  border: 0; }\n\n.slds-popover_tooltip .slds-popover__body,\n.slds-popover--tooltip .slds-popover__body {\n  font-size: 0.75rem;\n  color: white; }\n\n/**\n * @selector .slds-rise-from-ground\n * @restrict .slds-popover_tooltip\n * @modifier\n * @group toggle\n */\n.slds-rise-from-ground {\n  visibility: visible;\n  opacity: 1;\n  transform: translate(0%, 0%);\n  transition: opacity 0.1s linear, visibility 0.1s linear, transform 0.1s linear;\n  will-change: transform; }\n\n/**\n * @selector .slds-fall-into-ground\n * @restrict .slds-popover_tooltip\n * @modifier\n * @group toggle\n */\n.slds-fall-into-ground {\n  visibility: hidden;\n  opacity: 0;\n  transform: translate(0%, 0%);\n  transition: opacity 0.1s linear, visibility 0.1s linear, transform 0.1s linear;\n  will-change: transform; }\n\n.slds-slide-from-bottom-to-top {\n  transform: translateY(10%);\n  will-change: transform; }\n\n.slds-slide-from-top-to-bottom {\n  transform: translateY(-10%);\n  will-change: transform; }\n\n.slds-slide-from-right-to-left {\n  transform: translateX(5%);\n  will-change: transform; }\n\n.slds-slide-from-left-to-right {\n  transform: translateX(-5%);\n  will-change: transform; }\n\n.slds-tooltip {\n  position: relative;\n  border-radius: 0.25rem;\n  width: 20rem;\n  min-height: 2rem;\n  z-index: 6000;\n  background-color: #061c3f;\n  display: inline-block; }\n\n.slds-tooltip__body {\n  padding: 0.5rem 0.75rem;\n  font-size: 0.75rem;\n  color: white; }\n\n/**\n *\n * @summary Initializes a trigger element around the dropdown\n * @name dropdown\n * @selector .slds-dropdown-trigger\n * @restrict div, span, li\n * @variant\n */\n.slds-dropdown-trigger {\n  position: relative;\n  display: inline-block;\n  /**\n   * @summary If someone is using javascript for click to toggle - this modifier will help\n   * @selector .slds-dropdown-trigger_hover\n   * @restrict .slds-dropdown-trigger\n   */\n  /**\n   * @summary If someone is using javascript for click to toggle - this modifier will help\n   * @selector .slds-dropdown-trigger_click\n   * @restrict .slds-dropdown-trigger\n   */ }\n\n.slds-dropdown-trigger .slds-dropdown {\n  top: 100%; }\n\n.slds-dropdown-trigger .slds-dropdown_bottom,\n.slds-dropdown-trigger .slds-dropdown--bottom {\n  top: auto; }\n\n.slds-dropdown-trigger .slds-dropdown {\n  visibility: hidden;\n  opacity: 0;\n  transition: opacity 0.1s linear, visibility 0.1s linear; }\n\n.slds-dropdown-trigger:hover, .slds-dropdown-trigger:focus {\n  outline: 0; }\n\n.slds-dropdown-trigger:hover .slds-dropdown, .slds-dropdown-trigger:focus .slds-dropdown {\n  visibility: visible;\n  opacity: 1;\n  transition: opacity 0.1s linear, visibility 0.1s linear; }\n\n.slds-dropdown-trigger_hover .slds-dropdown, .slds-dropdown-trigger--hover .slds-dropdown {\n  visibility: hidden;\n  opacity: 0;\n  transition: opacity 0.1s linear, visibility 0.1s linear; }\n\n.slds-dropdown-trigger_hover:hover, .slds-dropdown-trigger_hover:focus, .slds-dropdown-trigger--hover:hover, .slds-dropdown-trigger--hover:focus {\n  outline: 0; }\n\n.slds-dropdown-trigger_hover:hover .slds-dropdown, .slds-dropdown-trigger_hover:focus .slds-dropdown, .slds-dropdown-trigger--hover:hover .slds-dropdown, .slds-dropdown-trigger--hover:focus .slds-dropdown {\n  visibility: visible;\n  opacity: 1;\n  transition: opacity 0.1s linear, visibility 0.1s linear; }\n\n.slds-dropdown-trigger_click, .slds-dropdown-trigger--click {\n  /**\n     * @summary Opens dropdown menu when invoked on click\n     * @selector .slds-is-open\n     * @restrict .slds-dropdown-trigger_click\n     * @modifier\n     * @group visibility\n     */ }\n\n.slds-dropdown-trigger_click .slds-dropdown, .slds-dropdown-trigger--click .slds-dropdown {\n  display: none; }\n\n.slds-dropdown-trigger_click.slds-is-open .slds-dropdown, .slds-dropdown-trigger--click.slds-is-open .slds-dropdown {\n  display: block;\n  visibility: visible;\n  opacity: 1; }\n\n.slds-dropdown-trigger > [class*=\"slds-button_icon\"] ~ .slds-dropdown_left[class*=\"slds-nubbin\"],\n.slds-dropdown-trigger > [class*=\"slds-button_icon\"] ~ .slds-dropdown--left[class*=\"slds-nubbin\"],\n.slds-dropdown-trigger > [class*=\"slds-button--icon\"] ~ .slds-dropdown_left[class*=\"slds-nubbin\"],\n.slds-dropdown-trigger > [class*=\"slds-button--icon\"] ~ .slds-dropdown--left[class*=\"slds-nubbin\"] {\n  left: -0.5rem; }\n\n.slds-dropdown-trigger > [class*=\"slds-button_icon\"] ~ .slds-dropdown_right[class*=\"slds-nubbin\"],\n.slds-dropdown-trigger > [class*=\"slds-button_icon\"] ~ .slds-dropdown--right[class*=\"slds-nubbin\"],\n.slds-dropdown-trigger > [class*=\"slds-button--icon\"] ~ .slds-dropdown_right[class*=\"slds-nubbin\"],\n.slds-dropdown-trigger > [class*=\"slds-button--icon\"] ~ .slds-dropdown--right[class*=\"slds-nubbin\"] {\n  right: -0.5rem; }\n\n/**\n * @summary Initializes dropdown\n * @selector .slds-dropdown\n * @restrict .slds-dropdown-trigger div, .slds-dropdown-trigger ul, .slds-docked-composer_overflow div\n * @notes Applies positioning and container styles, by default, dropdown appears below and center of target\n */\n.slds-dropdown {\n  position: absolute;\n  z-index: 7000;\n  left: 50%;\n  float: left;\n  min-width: 6rem;\n  max-width: 20rem;\n  margin-top: 0.125rem;\n  margin-bottom: 0.125rem;\n  border: 1px solid #dddbda;\n  border-radius: 0.25rem;\n  padding: 0.25rem 0;\n  font-size: 0.75rem;\n  background: white;\n  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.16);\n  transform: translateX(-50%);\n  /**\n   * @summary Positions dropdown to left side of target\n   * @selector .slds-dropdown_left\n   * @restrict .slds-dropdown\n   * @modifier\n   * @group menu position\n   */\n  /**\n   * @summary Positions dropdown to right side of target\n   * @selector .slds-dropdown_right\n   * @restrict .slds-dropdown\n   * @modifier\n   * @group menu position\n   */\n  /**\n   * @summary Positions dropdown to above target\n   * @selector .slds-dropdown_bottom\n   * @restrict .slds-dropdown\n   * @modifier\n   * @group menu position\n   */\n  /**\n   * @summary Sets min-width of 6rem/96px\n   * @selector .slds-dropdown_xx-small\n   * @restrict .slds-dropdown\n   * @modifier\n   * @group width\n   */\n  /**\n   * @summary Sets min-width of 12rem/192px\n   * @selector .slds-dropdown_x-small\n   * @restrict .slds-dropdown\n   * @modifier\n   * @group width\n   */\n  /**\n   * @summary Sets min-width of 15rem/240px\n   * @selector .slds-dropdown_small\n   * @restrict .slds-dropdown\n   * @modifier\n   * @group width\n   */\n  /**\n   * @summary Sets min-width of 20rem/320px\n   * @selector .slds-dropdown_medium\n   * @restrict .slds-dropdown\n   * @modifier\n   * @group width\n   */\n  /**\n   * @summary Sets min-width of 25rem/400px\n   * @selector .slds-dropdown_large\n   * @restrict .slds-dropdown\n   * @modifier\n   * @group width\n   */\n  /**\n   * @summary Sets min-width of 25rem/400px\n   * @selector .slds-dropdown_large\n   * @restrict .slds-dropdown\n   * @modifier\n   * @group width\n   */\n  /**\n   * @summary Forces overflow scrolling after 5 list items\n   * @selector .slds-dropdown_length-5\n   * @restrict .slds-dropdown, .slds-dropdown__list, .slds-listbox\n   * @modifier\n   * @group height\n   */\n  /**\n   * @summary Forces overflow scrolling after 7 list items\n   * @selector .slds-dropdown_length-7\n   * @restrict .slds-dropdown, .slds-dropdown__list, .slds-listbox\n   * @modifier\n   * @group height\n   */\n  /**\n   * @summary Forces overflow scrolling after 10 list items\n   * @selector .slds-dropdown_length-10\n   * @restrict .slds-dropdown, .slds-dropdown__list, .slds-listbox\n   * @modifier\n   * @group height\n   */\n  /**\n   * @summary Forces overflow scrolling after 5 list items with an icon\n   * @selector .slds-dropdown_length-with-icon-5\n   * @restrict .slds-dropdown, .slds-dropdown__list, .slds-listbox\n   * @modifier\n   * @group height\n   */\n  /**\n   * @summary Forces overflow scrolling after 7 list items with an icon\n   * @selector .slds-dropdown_length-with-icon-7\n   * @restrict .slds-dropdown, .slds-dropdown__list, .slds-listbox\n   * @modifier\n   * @group height\n   */\n  /**\n   * @summary Forces overflow scrolling after 10 list items with an icon\n   * @selector .slds-dropdown_length-with-icon-10\n   * @restrict .slds-dropdown, .slds-dropdown__list, .slds-listbox\n   * @modifier\n   * @group height\n   */\n  /**\n   * @summary Theme\n   * @selector .slds-dropdown_inverse\n   * @restrict .slds-dropdown\n   * @modifier\n   * @group theme\n   */\n  /**\n   * @summary Adds padding to area above dropdown menu list\n   * @selector .slds-dropdown__header\n   * @restrict .slds-dropdown li\n   */\n  /**\n   * @summary Initializes dropdown item\n   * @selector .slds-dropdown__item\n   * @restrict .slds-dropdown li\n   * @required\n   */ }\n\n.slds-dropdown_left, .slds-dropdown--left {\n  left: 0;\n  transform: translateX(0); }\n\n.slds-dropdown_right, .slds-dropdown--right {\n  left: auto;\n  right: 0;\n  transform: translateX(0); }\n\n.slds-dropdown_bottom, .slds-dropdown--bottom {\n  bottom: 100%; }\n\n.slds-dropdown_xx-small, .slds-dropdown--xx-small {\n  min-width: 6rem; }\n\n.slds-dropdown_x-small, .slds-dropdown--x-small {\n  min-width: 12rem; }\n\n.slds-dropdown_small, .slds-dropdown--small {\n  min-width: 15rem; }\n\n.slds-dropdown_medium, .slds-dropdown--medium {\n  min-width: 20rem; }\n\n.slds-dropdown_large, .slds-dropdown--large {\n  min-width: 25rem;\n  max-width: 512px; }\n\n.slds-dropdown_fluid, .slds-dropdown--fluid {\n  min-width: auto;\n  max-width: 100%;\n  width: 100%; }\n\n.slds-dropdown_length-5, .slds-dropdown--length-5 {\n  -webkit-overflow-scrolling: touch;\n  max-height: calc(((0.8125rem * 1.5) + 1rem) * 5);\n  overflow-y: auto; }\n\n.slds-dropdown_length-7, .slds-dropdown--length-7 {\n  -webkit-overflow-scrolling: touch;\n  max-height: calc(((0.8125rem * 1.5) + 1rem) * 7);\n  overflow-y: auto; }\n\n.slds-dropdown_length-10, .slds-dropdown--length-10 {\n  -webkit-overflow-scrolling: touch;\n  max-height: calc(((0.8125rem * 1.5) + 1rem) * 10);\n  overflow-y: auto; }\n\n.slds-dropdown_length-with-icon-5, .slds-dropdown--length-with-icon-5 {\n  -webkit-overflow-scrolling: touch;\n  max-height: calc((1.5rem + 1rem) * 5);\n  overflow-y: auto; }\n\n.slds-dropdown_length-with-icon-7, .slds-dropdown--length-with-icon-7 {\n  -webkit-overflow-scrolling: touch;\n  max-height: calc((1.5rem + 1rem) * 7);\n  overflow-y: auto; }\n\n.slds-dropdown_length-with-icon-10, .slds-dropdown--length-with-icon-10 {\n  -webkit-overflow-scrolling: touch;\n  max-height: calc((1.5rem + 1rem) * 10);\n  overflow-y: auto; }\n\n.slds-dropdown_inverse, .slds-dropdown--inverse {\n  background: #061c3f;\n  border-color: #061c3f; }\n\n.slds-dropdown_inverse .slds-dropdown__item > a, .slds-dropdown--inverse .slds-dropdown__item > a {\n  color: white; }\n\n.slds-dropdown_inverse .slds-dropdown__item > a:hover, .slds-dropdown_inverse .slds-dropdown__item > a:focus, .slds-dropdown--inverse .slds-dropdown__item > a:hover, .slds-dropdown--inverse .slds-dropdown__item > a:focus {\n  color: rgba(255, 255, 255, 0.75);\n  background-color: transparent; }\n\n.slds-dropdown_inverse .slds-dropdown__item > a:active, .slds-dropdown--inverse .slds-dropdown__item > a:active {\n  color: rgba(255, 255, 255, 0.5);\n  background-color: transparent; }\n\n.slds-dropdown_inverse .slds-dropdown__item > a[aria-disabled=\"true\"], .slds-dropdown--inverse .slds-dropdown__item > a[aria-disabled=\"true\"] {\n  color: rgba(255, 255, 255, 0.15);\n  cursor: default; }\n\n.slds-dropdown_inverse .slds-dropdown__item > a[aria-disabled=\"true\"]:hover, .slds-dropdown--inverse .slds-dropdown__item > a[aria-disabled=\"true\"]:hover {\n  background-color: transparent; }\n\n.slds-dropdown mark {\n  font-weight: 700;\n  background-color: transparent;\n  color: inherit; }\n\n.slds-dropdown[class*=\"slds-nubbin_top\"], .slds-dropdown[class*=\"slds-nubbin--top\"] {\n  margin-top: 0.5rem; }\n\n.slds-dropdown[class*=\"slds-nubbin_bottom\"], .slds-dropdown[class*=\"slds-nubbin--bottom\"] {\n  margin-bottom: 0.5rem; }\n\n.slds-dropdown_nubbin-top, .slds-dropdown--nubbin-top {\n  margin-top: 0.5rem; }\n\n.slds-dropdown_nubbin-top:before, .slds-dropdown--nubbin-top:before {\n  width: 1rem;\n  height: 1rem;\n  position: absolute;\n  transform: rotate(45deg);\n  content: '';\n  background-color: white;\n  left: 50%;\n  top: -0.5rem;\n  margin-left: -0.5rem; }\n\n.slds-dropdown_nubbin-top:after, .slds-dropdown--nubbin-top:after {\n  width: 1rem;\n  height: 1rem;\n  position: absolute;\n  transform: rotate(45deg);\n  content: '';\n  background-color: white;\n  left: 50%;\n  top: -0.5rem;\n  margin-left: -0.5rem; }\n\n.slds-dropdown_nubbin-top:before, .slds-dropdown--nubbin-top:before {\n  background: white; }\n\n.slds-dropdown_nubbin-top:after, .slds-dropdown--nubbin-top:after {\n  background: white;\n  box-shadow: -1px -1px 0 0 rgba(0, 0, 0, 0.16);\n  z-index: -1; }\n\n.slds-dropdown_nubbin-top.slds-dropdown_left, .slds-dropdown_nubbin-top.slds-dropdown--left, .slds-dropdown--nubbin-top.slds-dropdown_left, .slds-dropdown--nubbin-top.slds-dropdown--left {\n  left: -1rem; }\n\n.slds-dropdown_nubbin-top.slds-dropdown_left:before, .slds-dropdown_nubbin-top.slds-dropdown_left:after, .slds-dropdown_nubbin-top.slds-dropdown--left:before, .slds-dropdown_nubbin-top.slds-dropdown--left:after, .slds-dropdown--nubbin-top.slds-dropdown_left:before, .slds-dropdown--nubbin-top.slds-dropdown_left:after, .slds-dropdown--nubbin-top.slds-dropdown--left:before, .slds-dropdown--nubbin-top.slds-dropdown--left:after {\n  left: 1.5rem;\n  margin-left: 0; }\n\n.slds-dropdown_nubbin-top.slds-dropdown_right, .slds-dropdown_nubbin-top.slds-dropdown--right, .slds-dropdown--nubbin-top.slds-dropdown_right, .slds-dropdown--nubbin-top.slds-dropdown--right {\n  right: -1rem; }\n\n.slds-dropdown_nubbin-top.slds-dropdown_right:before, .slds-dropdown_nubbin-top.slds-dropdown_right:after, .slds-dropdown_nubbin-top.slds-dropdown--right:before, .slds-dropdown_nubbin-top.slds-dropdown--right:after, .slds-dropdown--nubbin-top.slds-dropdown_right:before, .slds-dropdown--nubbin-top.slds-dropdown_right:after, .slds-dropdown--nubbin-top.slds-dropdown--right:before, .slds-dropdown--nubbin-top.slds-dropdown--right:after {\n  left: auto;\n  right: 1.5rem;\n  margin-left: 0; }\n\n.slds-dropdown__header {\n  padding: 0.5rem 0.75rem; }\n\n.slds-dropdown__item {\n  line-height: 1.5;\n  /**\n     * @summary If menu contains menuitemcheckbox then this toggles the selected icon when it is selected\n     * @selector .slds-icon_selected\n     * @restrict .slds-dropdown__item svg\n     */\n  /**\n     * @summary If menu contains menuitemcheckbox then this handles the selected states\n     * @selector .slds-is-selected\n     * @restrict .slds-dropdown__item\n     * @modifier\n     */ }\n\n.slds-dropdown__item > a {\n  position: relative;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: justify;\n      justify-content: space-between;\n  -ms-flex-align: center;\n      align-items: center;\n  padding: 0.5rem 0.75rem;\n  color: #3e3e3c;\n  white-space: nowrap;\n  cursor: pointer; }\n\n.slds-dropdown__item > a:hover, .slds-dropdown__item > a:focus {\n  outline: 0;\n  text-decoration: none;\n  background-color: #f3f2f2; }\n\n.slds-dropdown__item > a:active {\n  text-decoration: none;\n  background-color: #ecebea; }\n\n.slds-dropdown__item > a[aria-disabled=\"true\"] {\n  color: #dddbda;\n  cursor: default; }\n\n.slds-dropdown__item > a[aria-disabled=\"true\"]:hover {\n  background-color: transparent; }\n\n.slds-dropdown__item > a[aria-disabled=\"true\"] .slds-icon {\n  fill: #dddbda; }\n\n.slds-dropdown__item .slds-icon_selected,\n.slds-dropdown__item .slds-icon--selected {\n  opacity: 0;\n  transition: opacity 0.05s ease; }\n\n.slds-dropdown__item.slds-is-selected .slds-icon_selected,\n.slds-dropdown__item.slds-is-selected .slds-icon--selected {\n  opacity: 1; }\n\n.slds-dropdown__item.slds-has-notification .slds-indicator_unsaved {\n  top: -0.375rem; }\n\n.slds-dropdown .slds-has-icon {\n  position: relative; }\n\n.slds-dropdown .slds-has-icon_left > a,\n.slds-dropdown .slds-has-icon--left > a,\n.slds-dropdown .slds-has-icon_left > span,\n.slds-dropdown .slds-has-icon--left > span {\n  padding-left: 2rem; }\n\n.slds-dropdown .slds-has-icon_right > a,\n.slds-dropdown .slds-has-icon--right > a,\n.slds-dropdown .slds-has-icon_right > span,\n.slds-dropdown .slds-has-icon--right > span {\n  padding-right: 2rem; }\n\n.slds-dropdown .slds-has-icon_left-right > a,\n.slds-dropdown .slds-has-icon--left-right > a,\n.slds-dropdown .slds-has-icon_left-right > span,\n.slds-dropdown .slds-has-icon--left-right > span {\n  padding-left: 2rem;\n  padding-right: 2rem; }\n\n.slds-dropdown .slds-has-icon .slds-icon {\n  width: 1rem;\n  height: 1rem;\n  position: absolute;\n  top: 50%;\n  margin-top: -0.5rem;\n  fill: #706e6b; }\n\n.slds-dropdown .slds-has-icon .slds-icon_left, .slds-dropdown .slds-has-icon .slds-icon--left {\n  left: 0.75rem; }\n\n.slds-dropdown .slds-has-icon .slds-icon_right, .slds-dropdown .slds-has-icon .slds-icon--right {\n  right: 0.75rem; }\n\n.slds-dropdown_actions a,\n.slds-dropdown--actions a {\n  color: #0070d2; }\n\n/**\n * @name submenu\n * @summary\n * @selector .slds-has-submenu\n * @restrict .slds-dropdown__item\n * @variant\n * @release 2.5.0\n */\n.slds-has-submenu {\n  position: relative;\n  /**\n   * @summary\n   * @selector .slds-dropdown_submenu\n   * @restrict .slds-has-submenu div\n   */\n  /**\n   * @summary Open submenu to the left of the parent menu item\n   * @selector .slds-dropdown_submenu-left\n   * @restrict .slds-dropdown_submenu\n   * @modifier\n   * @group submenu position\n   */\n  /**\n   * @summary Open submenu to the right of the parent menu item\n   * @selector .slds-dropdown_submenu-right\n   * @restrict .slds-dropdown_submenu\n   * @modifier\n   * @group submenu position\n   */\n  /**\n   * @summary Open submenu along the bottom of the parent menu item\n   * @selector .slds-dropdown_submenu-bottom\n   * @restrict .slds-dropdown_submenu\n   */ }\n\n.slds-has-submenu .slds-dropdown_submenu {\n  top: 0;\n  transform: none; }\n\n.slds-has-submenu .slds-dropdown_submenu-left {\n  left: auto;\n  right: 100%;\n  margin-right: 0.25rem; }\n\n.slds-has-submenu .slds-dropdown_submenu-right {\n  left: 100%;\n  margin-left: 0.25rem; }\n\n.slds-has-submenu .slds-dropdown_submenu-bottom {\n  top: auto;\n  bottom: 0;\n  margin-bottom: -0.25rem; }\n\n.slds-has-submenu.slds-dropdown__item .slds-dropdown_submenu {\n  display: none; }\n\n.slds-has-submenu [role=\"menuitem\"][aria-expanded=\"true\"] + .slds-dropdown_submenu {\n  display: block; }\n\n/**\n * @name base\n * @selector .slds-combobox-picklist\n * @restrict div\n * @variant\n * @s1 false\n */\n.slds-picklist {\n  position: relative;\n  /**\n     * Resets explicit width on picklist to be fluid to its parent element\n     *\n     * @selector .slds-picklist_fluid\n     * @restrict .slds-picklist\n     * @modifier\n     */ }\n\n.slds-picklist .slds-dropdown {\n  width: 15rem; }\n\n.slds-picklist li {\n  /**\n       * Set default state of icon for when a listbox option is selected\n       *\n       * @selector .slds-icon_selected\n       * @restrict .slds-picklist li svg\n       * @required\n       */\n  /**\n       * Toggles state of icon for when a listbox option is selected\n       *\n       * @selector .slds-is-selected\n       * @restrict .slds-picklist li\n       * @modifier\n       * @required\n       */ }\n\n.slds-picklist li .slds-icon_selected,\n.slds-picklist li .slds-icon--selected {\n  opacity: 0;\n  transition: opacity 0.05s ease; }\n\n.slds-picklist li.slds-is-selected .slds-icon_selected,\n.slds-picklist li.slds-is-selected .slds-icon--selected {\n  fill: #0070d2;\n  opacity: 1; }\n\n.slds-picklist_fluid .slds-picklist__input,\n.slds-picklist_fluid .slds-picklist__label,\n.slds-picklist_fluid .slds-dropdown,\n.slds-picklist_fluid .slds-lookup, .slds-picklist--fluid .slds-picklist__input,\n.slds-picklist--fluid .slds-picklist__label,\n.slds-picklist--fluid .slds-dropdown,\n.slds-picklist--fluid .slds-lookup {\n  width: auto;\n  min-width: 0;\n  max-width: 15rem; }\n\n/**\n   * Read-only input element for picklist\n   *\n   * @selector .slds-picklist__input\n   * @restrict .slds-picklist .slds-form-element__control\n   * @required\n   */\n.slds-picklist__input {\n  width: 15rem; }\n\n.slds-picklist__input .slds-button {\n  line-height: 0; }\n\n.slds-picklist__label {\n  padding-right: 2rem;\n  width: 15rem;\n  color: #3e3e3c;\n  text-align: left; }\n\n.slds-picklist__label .slds-icon {\n  width: 0.75rem;\n  height: 0.75rem;\n  position: absolute;\n  right: 1rem;\n  top: 50%;\n  margin-top: -0.375rem;\n  fill: #706e6b; }\n\n.slds-picklist__label .slds-truncate {\n  display: block; }\n\n/**\n * A Combobox is a composite widget that lets a user select one or more optons, from a\n * predefined or autocompleted searchable list. The result of that selection\n * is then shown as the value of an input, inside the Combobox widget.\n *\n * The multi-select Combobox can have more than one selected option.\n * When more than one option has been selected, the value of the input should\n * be updated with the total number of selected items, such as \"3 options selected\".\n * When a Combobox with multiple selected options is closed,\n * a listbox of pills is also used to represent those selected options.\n * The listbox of pills is positioned below the read-only input, each pill represents a selected option.\n * This allows a user to easily see and remove selected items from the Combobox.\n *\n * The Combobox comes with 2 distinct variations of functionality. A \"Read-Only and an \"Autocomplete\" Combobox.\n * A read-only Combobox allows a user to select an option from a pre-defined list of options. It does not allow\n * free form user input, nor does it allow the user to modify the selected value.\n * An autocomplete Combobox also allows a user to select an option from a list\n * but, that list can be affected by what the user types into the input of the Combobox. This can be\n * useful when the list of options a user can choose from is very large, as user input can start\n * to only display options that match the text the user has entered, effectively performing a search.\n * If no option matches, the user can complete the value of the combobox by finishing their own text entry.\n *\n * The listbox of options can be displayed as just a simple single list, or that list can be grouped with\n * headings, to better organise the options.\n *\n * The target HTML element, `slds-combobox` and dropdown need to be wrapped in the class\n * `.slds-dropdown-trigger dropdown-trigger--click`.\n *\n * #### Accessibility\n *\n * We follow the ARIA Combobox widget pattern to implement this component. Comboboxes allows the user to have\n * dual keyboard focus enabling them to select an option from the list with arrow keys, whilst leaving browser focus inside\n * the `input`.\n *\n * Implementing a multi-select pattern with a Combobox is not standard, nor is it technically supported by the specification.\n * Therefore great care should be paid to the extra steps we take to try and communicate multi-selection.\n *\n * We have decided to implement the Combobox based on the [ARIA 1.1 specification](http://w3c.github.io/aria/aria/aria.html#combobox).\n * The Combobox from ARIA 1.1 is a composite widget, in that it is a widget that is composed of other widgets or concepts.\n * In this implementation the `combobox` now owns (by means of parent / child relationships) a `textbox` and a `listbox` of `option`'s.\n *\n * **Expected markup:**\n *\n * ##### Combobox\n *\n * - A Combobox must come with an associated `label` element, with an appropriate `for` attribute\n * - `slds-combobox` acts as the root node to the composite Combobox widget. It takes the `role=\"combobox\"` attribute as a result\n *   - `aria-haspopup=\"listbox\"` attribute is then applied to indicate the Combobox will display a popup, of type `listbox`\n *   - `aria-expanded=\"true|false\"` attribute is applied to describe whether the popup of `listbox` is currently visible or not\n *\n * ##### Textbox\n *\n * - The Textbox is an `input` with a role of `textbox`. The role is implicit on inputs, but in this case it doesn't hurt to be explicit\n * - The Textbox has `autocomplete=\"off\"` to remove the browsers suggestions from the `input`\n * - The Textbox has `aria-controls=\"\"` which points to the ID of the `listbox`. It informs Assistive Technology what DOM node the input controls, in display or content\n * - The Textbox has the `type` attribute set to be `text` as it's not a search field\n * - The Textbox has `aria-activedescendant` attribute applied only when an option is in \"dual focus\" via keyboard navigation, otherwise it should be removed\n * - The Textbox gets a `value` set to reflect that that option has been selected by the user\n *\n * ##### Textbox - Read-only\n *\n * - The Textbox has `readonly` attribute applied\n *\n * ##### Textbox - Autocomplete\n *\n * - The Textbox has `aria-autocomplete=\"list\"` attribute applied\n *\n * ##### Listbox\n *\n * - The `listbox` has `role=\"listbox\"` applied\n * - The `listbox` can have child `option`'s. We place `role=\"option\"` on a `span` element, inside a list item. As such the list item `li` needs to be removed from the Accessibility Tree with `role=\"presentation\"`\n * - A `listbox` has the ability to group options together under a visual heading or label. This means the `role=\"listbox\"` attribute is placed on a common parent element, which can wrap multiple lists (or groups) of options\n *   - When a `listbox` has no option groups\n *     - The `ul` element has `role=\"presentation\"` to remove it from the Accessibility Tree\n *   - When a `listbox` has option groups, each group gets a visual label. Exactly like `optgroup` in a `select` element\n *     - The `ul` element in this case has `role=\"group\"` with an `aria-label` that describes the group\n *     - Display the group label visually, but due to the way a listbox works it can only be marked as `role=\"presentation\"`, as a `listbox` can only have `option` children. This allows us to communicate the group label visually and programmatically to a screen reader\n * - Every `option` has `aria-selected=\"false\"` by default\n * - Disabled `option`s should have `aria-disabled=\"true\"` applied\n *\n * ##### Listbox - Multi-select\n *\n * - To represent multi-selection on a `listbox` to a screen reader, we must describe previously selected options with hidden assistive text, to represent the check mark\n *\n * **Expected keyboard interactions:**\n *\n * - Focus is placed into the `input` by the user\n * - The `listbox` is show on `input` focus, and `aria-expanded` is set to `true` on the `combobox` element to reflect that\n * - Up and Down arrow keys cycle through the available `option`s by setting and updating `aria-activedescendant=\"id_of_option\"` on the `input`, each time you press the arrow key\n *   - `aria-selected` on the current `option` is changed to `true`\n *   - Disabled options should be skipped\n * - Esc key closes the `listbox` and sets `aria-expanded` to `false` on the `combobox`\n * - Enter key confirms selection, sets `value` if not already set, and closes the `listbox` and sets `aria-expanded` to `false` on the `combobox`\n *\n * ##### Read-only\n *\n * - Up and Down arrows also **must** update the `input` value as you navigate through the list, to reflect the currently selected option\n * - Any character key updates `aria-activedescendant` to the next `option` that starts with that character, if applicable\n *\n * ##### Autocomplete (when not allowing free form text as a valid value)\n *\n * - Up and Down arrows also **should** update the `input` value as you navigate through the list, to reflect the currently selected option\n * - Enter key, with an option selected should also set `readonly` on the `input`\n * - Esc key with an option selected should remove `readonly` and clear the `value` of the `input`\n *\n * @summary A widget that provides a user with an input field that is either an autocomplete or readonly, accompanied with a listbox of pre-defined options.\n *\n * @base\n * @name combobox\n * @selector .slds-combobox_container\n * @support dev-ready\n * @category experience\n * @type user-input\n * @layout adaptive\n * @role combobox\n * @scroller\n */\n/**\n * @summary Container that manages layout when a listbox of pill options sit next to a combobox search input\n *\n * @name base\n * @selector .slds-combobox_container\n * @restrict div\n * @variant\n */\n.slds-combobox_container {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n      flex-direction: column;\n  position: relative;\n  /**\n   * Opens listbox dropdown\n   *\n   * @selector .slds-is-open\n   * @restrict .slds-combobox\n   * @modifier\n   */ }\n\n.slds-combobox_container.slds-is-open .slds-dropdown {\n  display: block; }\n\n/**\n * Container around form element with combobox input\n *\n * @selector .slds-combobox\n * @restrict .slds-combobox_container > div\n */\n.slds-combobox {\n  position: static;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n      flex-direction: column;\n  -ms-flex: 1 1 auto;\n      flex: 1 1 auto; }\n\n/**\n * Form element with combobox input\n *\n * @selector .slds-combobox__form-element\n * @restrict .slds-combobox > div\n */\n.slds-combobox__form-element {\n  -ms-flex: 1 1 auto;\n      flex: 1 1 auto; }\n\n[role=\"combobox\"] input[readonly] {\n  padding-left: 0.75rem;\n  border-color: #dddbda;\n  background-color: white;\n  font-size: inherit;\n  font-weight: 400; }\n\n[role=\"combobox\"] input[readonly]:focus {\n  border-color: #0070d2; }\n\n[role=\"combobox\"] input[readonly][disabled] {\n  background-color: #ecebea;\n  border-color: #c9c7c5; }\n\n/**\n * Listbox container\n *\n * @selector .slds-listbox\n * @restrict ul\n */\n.slds-listbox {\n  font-size: 0.8125rem; }\n\n/**\n * Inline listbox\n *\n * @selector .slds-listbox_inline\n * @restrict .slds-listbox\n * @modifier\n */\n.slds-listbox_inline,\n.slds-listbox--inline {\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  -ms-flex-align: center;\n      align-items: center;\n  margin-left: 0.125rem;\n  margin-right: 0.125rem; }\n\n.slds-listbox_inline li,\n.slds-listbox--inline li {\n  display: -ms-flexbox;\n  display: flex; }\n\n.slds-listbox_inline li + li,\n.slds-listbox--inline li + li {\n  padding-left: 0.125rem; }\n\n/**\n * Horizontal listbox\n *\n * @selector .slds-listbox_horizontal\n * @restrict .slds-listbox\n * @modifier\n */\n.slds-listbox_horizontal,\n.slds-listbox--horizontal {\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n  -ms-flex-align: center;\n      align-items: center; }\n\n.slds-listbox_horizontal li + li,\n.slds-listbox--horizontal li + li {\n  padding-left: 0.125rem; }\n\n/**\n * Choosable option within listbox\n *\n * @selector .slds-listbox__option\n * @restrict .slds-listbox__item > div\n */\n.slds-listbox__option:hover {\n  cursor: pointer; }\n\n.slds-listbox__option:focus {\n  outline: 0; }\n\n.slds-listbox__option .slds-truncate {\n  display: inline-block;\n  vertical-align: middle; }\n\n/**\n * Creates a vertical listbox\n *\n * @selector .slds-listbox_vertical\n * @restrict .slds-listbox\n * @modifier\n */\n.slds-listbox_vertical,\n.slds-listbox--vertical {\n  /**\n   * Focus state of a vertical listbox option\n   *\n   * @selector .slds-has-focus\n   * @restrict .slds-listbox__option\n   * @modifier\n   */\n  /**\n   * Modifies the listbox option if it contains an plain object or string\n   *\n   * @selector .slds-listbox__option_plain\n   * @restrict .slds-listbox__option\n   */\n  /**\n   * Modifies the listbox option if it contains an entity object\n   *\n   * @selector .slds-listbox__option_entity\n   * @restrict .slds-listbox__option\n   */\n  /**\n   * If the listbox option has metadata or secondary information that sits below its primary text\n   *\n   * @selector .slds-listbox__option_has-meta\n   * @restrict .slds-listbox__option\n   */ }\n\n.slds-listbox_vertical .slds-listbox__option:focus,\n.slds-listbox_vertical .slds-listbox__option:hover,\n.slds-listbox_vertical .slds-listbox__option.slds-has-focus,\n.slds-listbox--vertical .slds-listbox__option:focus,\n.slds-listbox--vertical .slds-listbox__option:hover,\n.slds-listbox--vertical .slds-listbox__option.slds-has-focus {\n  background-color: #f3f2f2;\n  text-decoration: none; }\n\n.slds-listbox_vertical .slds-listbox__option[role=\"presentation\"]:hover,\n.slds-listbox--vertical .slds-listbox__option[role=\"presentation\"]:hover {\n  background-color: transparent;\n  cursor: default; }\n\n.slds-listbox_vertical .slds-listbox__option_plain,\n.slds-listbox_vertical .slds-listbox__option--plain,\n.slds-listbox--vertical .slds-listbox__option_plain,\n.slds-listbox--vertical .slds-listbox__option--plain {\n  padding: 0.5rem 0.75rem; }\n\n.slds-listbox_vertical .slds-listbox__option_entity,\n.slds-listbox_vertical .slds-listbox__option--entity,\n.slds-listbox--vertical .slds-listbox__option_entity,\n.slds-listbox--vertical .slds-listbox__option--entity {\n  padding: 0.25rem 0.75rem; }\n\n.slds-listbox_vertical .slds-listbox__option_entity .slds-media__figure,\n.slds-listbox_vertical .slds-listbox__option--entity .slds-media__figure,\n.slds-listbox--vertical .slds-listbox__option_entity .slds-media__figure,\n.slds-listbox--vertical .slds-listbox__option--entity .slds-media__figure {\n  margin-right: 0.5rem; }\n\n.slds-listbox_vertical .slds-listbox__option_has-meta .slds-media__figure,\n.slds-listbox_vertical .slds-listbox__option--has-meta .slds-media__figure,\n.slds-listbox--vertical .slds-listbox__option_has-meta .slds-media__figure,\n.slds-listbox--vertical .slds-listbox__option--has-meta .slds-media__figure {\n  margin-top: 0.25rem; }\n\n/**\n * Class to target styling the value of a combobox input\n *\n * @selector .slds-combobox__input-value\n * @restrict .slds-combobox input\n */\n[class*=\"slds-input-has-icon_left\"] .slds-combobox__input[value],\n[class*=\"slds-input-has-icon--left\"] .slds-combobox__input[value],\n[class*=\"slds-input-has-icon_left\"] .slds-combobox__input.slds-combobox__input-value,\n[class*=\"slds-input-has-icon--left\"] .slds-combobox__input.slds-combobox__input-value {\n  padding-left: 2.25rem; }\n\n/**\n * If readonly selection is an entity, use this class\n *\n * @selector .slds-combobox__input-entity-icon\n * @restrict .slds-combobox__form-element span\n */\n.slds-combobox__input-entity-icon {\n  width: 1.25rem;\n  height: 1.25rem;\n  position: absolute;\n  top: 50%;\n  left: calc(0.25rem + 1px);\n  transform: translateY(-50%); }\n\n.slds-combobox__input-entity-icon .slds-icon {\n  width: 1.25rem;\n  height: 1.25rem; }\n\n/**\n * Icon that is a direct sibling of a combobox container. This is not the same as an input icon.\n *\n * @selector .slds-combobox_container__icon\n * @restrict .slds-combobox_container svg\n */\n.slds-combobox_container__icon {\n  color: #b0adab; }\n\n/**\n * The icon within a plain listbox that indicates if an option has been selected or not.\n *\n * @selector .slds-listbox__icon-selected\n * @restrict .slds-listbox__item svg\n */\n.slds-listbox__icon-selected {\n  opacity: 0;\n  fill: #0070d2; }\n\n/**\n * Modifier that makes selected icon visible\n *\n * @selector .slds-is-selected\n * @restrict .slds-listbox__option\n * @modifier\n */\n.slds-listbox__option.slds-is-selected .slds-listbox__icon-selected {\n  opacity: 1; }\n\n/**\n * The main text of an entity listbox\n *\n * @selector .slds-listbox__option-text_entity\n * @restrict .slds-listbox__option span\n */\n.slds-listbox__option-text_entity,\n.slds-listbox__option-text--entity {\n  max-width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  display: block;\n  margin-bottom: 0.125rem; }\n\n/**\n * The metadata or secondary text of an entity listbox\n *\n * @selector .slds-listbox__option-meta_entity\n * @restrict .slds-listbox__option span\n */\n.slds-listbox__option-meta_entity,\n.slds-listbox__option-meta--entity {\n  display: block;\n  margin-top: -0.25rem;\n  color: #706e6b; }\n\n.slds-listbox_object-switcher,\n.slds-listbox--object-switcher {\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  padding: 0.125rem; }\n\n/**\n * If combo has a selection model that requires a listbox of pills to be displayed\n * inside of a combobox\n *\n * @selector .slds-has-inline-listbox\n * @restrict .slds-combobox_container\n */\n.slds-has-inline-listbox,\n.slds-has-object-switcher {\n  -ms-flex-direction: row;\n      flex-direction: row;\n  background: white;\n  border: 1px solid #dddbda;\n  border-radius: 0.25rem;\n  /**\n   * Input field within a combobox\n   *\n   * @selector .slds-combobox__input\n   * @restrict .slds-combobox input\n   */\n  /**\n   * Modifier to the combobox when an SVG icon sits adjacent to the combobox form element\n   *\n   * @selector .slds-has-icon_left\n   * @restrict .slds-combobox\n   */ }\n\n.slds-has-inline-listbox .slds-combobox__input,\n.slds-has-object-switcher .slds-combobox__input {\n  min-height: 1.625rem;\n  line-height: 1.625rem;\n  border: 0;\n  padding-top: 0.125rem;\n  padding-bottom: 0.125rem; }\n\n.slds-has-inline-listbox .slds-combobox__input:focus, .slds-has-inline-listbox .slds-combobox__input:active,\n.slds-has-object-switcher .slds-combobox__input:focus,\n.slds-has-object-switcher .slds-combobox__input:active {\n  outline: 0;\n  box-shadow: none; }\n\n.slds-has-inline-listbox .slds-listbox_object-switcher ~ .slds-listbox_inline,\n.slds-has-inline-listbox .slds-listbox--object-switcher ~ .slds-listbox--inline,\n.slds-has-inline-listbox .slds-combobox_container__icon ~ .slds-listbox_inline,\n.slds-has-inline-listbox .slds-combobox_container__icon ~ .slds-listbox--inline,\n.slds-has-object-switcher .slds-listbox_object-switcher ~ .slds-listbox_inline,\n.slds-has-object-switcher .slds-listbox--object-switcher ~ .slds-listbox--inline,\n.slds-has-object-switcher .slds-combobox_container__icon ~ .slds-listbox_inline,\n.slds-has-object-switcher .slds-combobox_container__icon ~ .slds-listbox--inline {\n  margin-left: 0.5rem; }\n\n.slds-has-inline-listbox.slds-has-icon_left,\n.slds-has-object-switcher.slds-has-icon_left {\n  padding-left: 2.25rem;\n  /**\n     * SVG icon that sits adjacent to the combobox form element\n     *\n     * @selector .slds-combobox_container__icon\n     * @restrict .slds-combobox_container svg\n     */ }\n\n.slds-has-inline-listbox.slds-has-icon_left .slds-combobox_container__icon,\n.slds-has-object-switcher.slds-has-icon_left .slds-combobox_container__icon {\n  width: 1rem;\n  height: 1rem;\n  position: absolute;\n  left: 1.125rem;\n  top: 50%;\n  margin-top: -0.5rem; }\n\n.slds-has-inline-listbox [role=\"listbox\"] {\n  display: -ms-inline-flexbox;\n  display: inline-flex; }\n\n.slds-has-inline-listbox .slds-combobox__input[value],\n.slds-has-inline-listbox .slds-combobox__input-value {\n  box-shadow: 0 0 0 2px #fff inset, 0 0 0 3px #dddbda inset; }\n\n/**\n * A dueling picklist inherits styles from the listbox component\n * @summary Initializes a dueling picklist\n *\n * @name base\n * @selector .slds-dueling-list\n * @restrict div\n * @variant\n */\n.slds-dueling-list {\n  display: -ms-flexbox;\n  display: flex; }\n\n/**\n * @summary Handles the layout of the dueling picklist\n *\n * @selector .slds-dueling-list__column\n * @restrict .slds-dueling-list div\n */\n.slds-dueling-list__column {\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  -ms-flex-direction: column;\n      flex-direction: column; }\n\n.slds-dueling-list__column .slds-button {\n  margin: 0.25rem; }\n\n.slds-dueling-list__column .slds-button:first-of-type {\n  margin-top: 1.5rem; }\n\n/**\n * @summary Bounding visual container for listbox of options\n *\n * @selector .slds-dueling-list__options\n * @restrict .slds-dueling-list div\n */\n.slds-dueling-list__options,\n.slds-picklist__options {\n  border: 1px solid #dddbda;\n  border-radius: 0.25rem;\n  padding: 0.25rem 0;\n  width: 15rem;\n  height: 15rem;\n  background-color: white;\n  overflow: auto;\n  /**\n   * @summary Selected/dragging state of a listbox option\n   * @selector .slds-is-grabbed\n   * @restrict .slds-dueling-list__options div\n   */\n  /**\n   * @summary Disabled state of a picklist option\n   * @selector .slds-is-disabled\n   * @restrict .slds-dueling-list__options\n   */ }\n\n.slds-dueling-list__options [aria-selected=\"true\"],\n.slds-picklist__options [aria-selected=\"true\"] {\n  background-color: #0070d2;\n  color: white; }\n\n.slds-dueling-list__options [aria-selected=\"true\"]:hover, .slds-dueling-list__options [aria-selected=\"true\"]:focus,\n.slds-picklist__options [aria-selected=\"true\"]:hover,\n.slds-picklist__options [aria-selected=\"true\"]:focus {\n  background: #005fb2;\n  color: white; }\n\n.slds-dueling-list__options.slds-is-disabled,\n.slds-picklist__options.slds-is-disabled {\n  background-color: #ecebea;\n  border-color: #c9c7c5;\n  color: #706e6b; }\n\n.slds-dueling-list__options.slds-is-disabled:hover,\n.slds-picklist__options.slds-is-disabled:hover {\n  cursor: not-allowed; }\n\n.slds-dueling-list__options.slds-is-disabled .slds-listbox__option:hover,\n.slds-picklist__options.slds-is-disabled .slds-listbox__option:hover {\n  cursor: not-allowed;\n  background-color: transparent; }\n\n.slds-dueling-list__options.slds-is-disabled .slds-listbox__option:focus,\n.slds-picklist__options.slds-is-disabled .slds-listbox__option:focus {\n  background-color: transparent; }\n\n.slds-picklist_draggable,\n.slds-picklist--draggable {\n  display: -ms-flexbox;\n  display: flex; }\n\n.slds-picklist_draggable .slds-button,\n.slds-picklist--draggable .slds-button {\n  margin: 0.25rem; }\n\n.slds-picklist_draggable .slds-button:first-of-type,\n.slds-picklist--draggable .slds-button:first-of-type {\n  margin-top: 1.5rem; }\n\n.slds-picklist__item {\n  position: relative;\n  line-height: 1.5; }\n\n.slds-picklist__item > a,\n.slds-picklist__item > span {\n  display: block;\n  padding: 0.5rem 0.75rem; }\n\n.slds-picklist__item > a:hover,\n.slds-picklist__item > span:hover {\n  background-color: #f3f2f2;\n  cursor: pointer; }\n\n.slds-picklist__item > a:active,\n.slds-picklist__item > span:active {\n  background-color: #ecebea; }\n\n.slds-picklist__item[aria-selected=\"true\"] {\n  background-color: #ecebea; }\n\n/**\n * @summary Initiates a datepicker component\n *\n * @name base\n * @selector .slds-datepicker\n * @restrict div\n * @variant\n */\n.slds-datepicker {\n  padding: 0;\n  font-size: 0.75rem;\n  /**\n   * @summary Aligns filter items horizontally\n   *\n   * @selector .slds-datepicker__filter\n   * @restrict .slds-datepicker div\n   */\n  /**\n   * @summary Spaces out month filter\n   *\n   * @selector .slds-datepicker__month_filter\n   * @restrict .slds-datepicker div\n   */\n  /**\n   * @summary Container of the month table\n   *\n   * @selector .slds-datepicker__month\n   * @restrict .slds-datepicker table\n   */ }\n\n.slds-datepicker th,\n.slds-datepicker td {\n  text-align: center; }\n\n.slds-datepicker th {\n  padding: 0.5rem;\n  font-weight: 400;\n  color: #706e6b; }\n\n.slds-datepicker td {\n  padding: 0.25rem;\n  text-align: center;\n  font-size: 0.75rem;\n  /**\n     * @summary Style for calendar days\n     *\n     * @selector .slds-day\n     * @restrict .slds-datepicker td span\n     */\n  /**\n     * @summary Indicates today\n     *\n     * @selector .slds-is-today\n     * @restrict .slds-datepicker td\n     */\n  /**\n     * @summary Indicates selected days\n     *\n     * @selector .slds-is-selected\n     * @restrict .slds-datepicker td\n     */ }\n\n.slds-datepicker td > .slds-day {\n  width: 2rem;\n  height: 2rem;\n  display: block;\n  position: relative;\n  min-width: 2rem;\n  line-height: 2rem;\n  border-radius: 50%;\n  margin: auto; }\n\n.slds-datepicker td:hover:not(.slds-disabled-text) > .slds-day,\n.slds-datepicker td:focus:not(.slds-disabled-text) > .slds-day,\n.slds-datepicker td.slds-is-today > .slds-day {\n  cursor: pointer; }\n\n.slds-datepicker td.slds-is-today > .slds-day {\n  background-color: #ecebea; }\n\n.slds-datepicker td:focus {\n  outline: 0; }\n\n.slds-datepicker td:focus > .slds-day {\n  box-shadow: #0070d2 0 0 0 1px inset; }\n\n.slds-datepicker td.slds-is-selected > .slds-day {\n  background: #0070d2;\n  color: white; }\n\n.slds-datepicker td.slds-is-selected:focus > .slds-day {\n  background: #005fb2;\n  box-shadow: #005fb2 0 0 3px;\n  color: white; }\n\n.slds-datepicker__filter {\n  padding: 0.25rem; }\n\n.slds-datepicker__filter_month, .slds-datepicker__filter--month {\n  padding: 0 0.25rem 0 0; }\n\n.slds-datepicker__month {\n  font-size: 0.75rem; }\n\n/**\n * @summary Indicates days that are in previous/next months\n *\n * @selector .slds-disabled-text\n * @restrict .slds-datepicker td\n */\n.slds-disabled-text {\n  color: #dddbda; }\n\n.slds-datepicker {\n  /**\n   * If you desire a multi-select date range, the selected cell will need to have\n   * `.slds-is-selected-multi` applied to the `<td>`.\n   *\n   * If you are selecting multiple dates within the same week, the class `slds-has-multi-selection`\n   * should be added to the `<tr>`.\n   *\n   * If you are selecting multiple dates spanning over two or more weeks, you will\n   * need to add the class `.slds-has-multi-row-selection` to each `<tr>` that has\n   * selected dates.\n   *\n   * @summary Class on row to notify that more than one date will be selected within the week\n   *\n   * @name range\n   * @selector .slds-has-multi-selection\n   * @restrict .slds-datepicker tr\n   * @variant\n   */\n  /**\n   * @summary Class on row to notify that more than one date will be selected with multiple weeks\n   *\n   * @selector .slds-has-multi-row-selection\n   * @restrict .slds-datepicker tr\n   */\n  /**\n   * @summary Indicates if the selected days are apart of a date range\n   *\n   * @selector .slds-is-selected-multi\n   * @restrict .slds-datepicker td\n   */ }\n\n.slds-datepicker .slds-has-multi-selection .slds-is-selected-multi:last-child > .slds-day:after {\n  left: auto;\n  right: 0;\n  transform: translateX(0.25rem); }\n\n.slds-datepicker .slds-has-multi-row-selection .slds-is-selected-multi:first-child > .slds-day:before,\n.slds-datepicker .slds-has-multi-row-selection .slds-is-selected-multi:last-child > .slds-day:after {\n  content: '';\n  position: absolute;\n  background: #0070d2;\n  top: 0;\n  left: -50%;\n  height: 100%;\n  width: 2.5rem;\n  transform: translateX(-0.5rem);\n  z-index: -1; }\n\n.slds-datepicker .slds-has-multi-row-selection .slds-is-selected-multi:first-child > .slds-day:before {\n  left: 0;\n  transform: translateX(-0.25rem); }\n\n.slds-datepicker .slds-has-multi-row-selection .slds-is-selected-multi:last-child > .slds-day:after {\n  left: auto;\n  right: 0;\n  transform: translateX(0.25rem); }\n\n.slds-datepicker td.slds-is-selected-multi > .slds-day {\n  overflow: visible; }\n\n.slds-datepicker td.slds-is-selected-multi.slds-is-today > .slds-day {\n  box-shadow: white 0 0 0 1px inset; }\n\n.slds-datepicker td.slds-is-selected-multi + .slds-is-selected-multi > .slds-day:before {\n  content: '';\n  position: absolute;\n  background: #0070d2;\n  top: 0;\n  left: -50%;\n  height: 100%;\n  width: 2.5rem;\n  transform: translateX(-0.5rem);\n  z-index: -1; }\n\n/**\n * @summary Initializes a timepicker\n *\n * @name base\n * @selector .slds-timepicker\n * @restrict div\n * @variant\n */\n.slds-datepicker_time,\n.slds-datepicker--time {\n  max-width: 12rem;\n  max-height: 13.5rem;\n  overflow: hidden;\n  overflow-y: auto; }\n\n.slds-datepicker_time__list > li,\n.slds-datepicker--time__list > li {\n  white-space: nowrap;\n  padding: 0.5rem;\n  padding-left: 2rem;\n  padding-right: 2rem; }\n\n.slds-datepicker_time__list > li:hover, .slds-datepicker_time__list > li:focus,\n.slds-datepicker--time__list > li:hover,\n.slds-datepicker--time__list > li:focus {\n  background: #f3f2f2;\n  text-decoration: none;\n  cursor: pointer; }\n\n/**\n * Intializes docked composer container window\n *\n * @selector .slds-docked_container\n * @restrict div\n */\n.slds-docked_container {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: end;\n      align-items: flex-end;\n  position: fixed;\n  bottom: 0;\n  right: 0;\n  padding: 0 1.5rem;\n  height: 2.5rem; }\n\n/**\n * @variant\n * @name base\n * @selector .slds-docked-composer\n * @restrict section, div\n * @support dev-ready\n */\n.slds-docked-composer {\n  position: relative;\n  border-radius: 0.25rem 0.25rem 0 0;\n  width: 480px;\n  height: 2.5rem;\n  float: left;\n  box-shadow: 0 -2px 2px 0 rgba(0, 0, 0, 0.16);\n  border: 1px solid #dddbda;\n  border-bottom: none;\n  background-color: white;\n  /**\n   * @selector .slds-has-focus\n   * @restrict .slds-docked-composer\n   * @modifier\n   * @group interaction\n   */\n  /**\n   * @selector .slds-is-open\n   * @restrict .slds-docked-composer\n   * @modifier\n   * @group visibility\n   */\n  /**\n   * @selector .slds-is-closed\n   * @restrict .slds-docked-composer\n   * @modifier\n   * @group visibility\n   */\n  /**\n   * Bar at the top of the composer that contains actionable items to invoke,\n   * such as minimizing, popping out the composer and removing the composer.\n   *\n   * @selector .slds-docked-composer__header\n   * @restrict .slds-docked-composer header\n   */\n  /**\n   * Primary area within docked composer that contains specific task\n   *\n   * @selector .slds-docked-composer__body\n   * @restrict .slds-docked-composer div\n   */\n  /**\n   * @selector .slds-docked-composer__body_form\n   * @restrict .slds-docked-composer__body\n   */\n  /**\n   * Within the docked composer body, the lead is the first region\n   *\n   * @selector .slds-docked-composer__lead\n   * @restrict .slds-docked-composer div\n   */\n  /**\n   * @selector .slds-docked-composer__toolbar\n   * @restrict .slds-docked-composer div\n   */\n  /**\n   * Bar at the bottom of the composer that contains actionable items to\n   * invoke, such as saving, associating relationships and adding content.\n   *\n   * @selector .slds-docked-composer__footer\n   * @restrict .slds-docked-composer footer\n   */\n  /**\n   * When the number of docked composer exceed the width of the viewport, this class modifies the docked composer styles\n   *\n   * @selector .slds-docked-composer_overflow\n   * @restrict .slds-docked-composer\n   * @required\n   */ }\n\n.slds-docked-composer.slds-has-focus {\n  box-shadow: 0 0 4px 2px #0070d2; }\n\n.slds-docked-composer.slds-is-open {\n  height: 480px; }\n\n.slds-docked-composer.slds-is-closed {\n  height: 2.5rem; }\n\n.slds-docked-composer.slds-is-closed .slds-docked-composer__body,\n.slds-docked-composer.slds-is-closed .slds-docked-composer__footer {\n  display: none; }\n\n.slds-docked-composer + .slds-docked-composer {\n  margin-left: 1.5rem; }\n\n.slds-docked-composer__header {\n  background: white;\n  border-bottom: 2px solid #1589ee;\n  border-radius: 0.25rem 0.25rem 0 0;\n  padding: 0.5rem 0.75rem; }\n\n.slds-docked-composer__actions .slds-button {\n  margin-left: 0.75rem; }\n\n.slds-docked-composer__body {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex: 1 0 auto;\n      flex: 1 0 auto;\n  -ms-flex-direction: column;\n      flex-direction: column;\n  overflow: auto; }\n\n.slds-docked-composer__body_form, .slds-docked-composer__body--form {\n  -ms-flex-pack: start;\n      justify-content: flex-start;\n  padding: 1rem; }\n\n.slds-docked-composer__lead {\n  display: -ms-flexbox;\n  display: flex;\n  background: white;\n  padding: 1rem 0.5rem; }\n\n.slds-docked-composer__toolbar {\n  background: #f3f2f2;\n  padding: 0.25rem 0.5rem;\n  max-height: 60px;\n  overflow-y: auto;\n  border-top: 1px solid #dddbda;\n  border-bottom: 1px solid #dddbda; }\n\n.slds-docked-composer__input {\n  background: white;\n  padding: 1rem;\n  min-height: 6rem;\n  resize: none;\n  line-height: 1.5;\n  overflow: hidden;\n  overflow-y: auto; }\n\n.slds-docked-composer__footer {\n  display: -ms-flexbox;\n  display: flex;\n  background: #f3f2f2;\n  padding: 0.75rem 0.5rem;\n  border-top: 1px solid #dddbda; }\n\n.slds-docked-composer_overflow, .slds-docked-composer--overflow {\n  width: auto; }\n\n.slds-docked-composer_overflow__button, .slds-docked-composer--overflow__button {\n  display: -ms-flexbox;\n  display: flex;\n  background: white;\n  padding: 0 0.75rem;\n  height: inherit;\n  white-space: nowrap;\n  border-bottom-left-radius: 0;\n  border-bottom-right-radius: 0; }\n\n.slds-docked-composer_overflow__pill, .slds-docked-composer--overflow__pill {\n  display: -ms-flexbox;\n  display: flex;\n  padding: 0 0.75rem;\n  height: inherit;\n  white-space: nowrap;\n  border-bottom-left-radius: 0.25rem;\n  border-bottom-right-radius: 0.25rem; }\n\n.slds-docked-composer_overflow__pill:hover, .slds-docked-composer_overflow__pill:focus, .slds-docked-composer--overflow__pill:hover, .slds-docked-composer--overflow__pill:focus {\n  color: white;\n  text-decoration: none; }\n\n.slds-docked-composer_overflow__pill .slds-text-body_small,\n.slds-docked-composer_overflow__pill .slds-text-body--small, .slds-docked-composer--overflow__pill .slds-text-body_small,\n.slds-docked-composer--overflow__pill .slds-text-body--small {\n  color: white;\n  margin-left: 0.5rem; }\n\n.slds-docked-composer-modal .slds-modal__content {\n  border-radius: 0.25rem; }\n\n.slds-docked-composer-modal .slds-docked-composer {\n  width: 100%;\n  height: 100%;\n  border: 0; }\n\n/**\n * @summary Initiazes email composer inside of a docked composer\n *\n * @selector .slds-email-composer\n * @restrict .slds-docked-composer__body div\n */\n.slds-email-composer {\n  position: relative;\n  -ms-flex: 1 1 auto;\n      flex: 1 1 auto; }\n\n.slds-email-composer .slds-rich-text-editor {\n  border: 0;\n  border-top: 1px solid #dddbda;\n  border-radius: 0; }\n\n/**\n * @summary Modifier combobox when used inside of email composer\n *\n * @selector .slds-email-composer__combobox\n * @restrict .slds-email-composer div\n */\n.slds-email-composer__combobox {\n  padding-left: 3rem;\n  border: 0;\n  border-bottom: 1px solid #dddbda;\n  border-radius: 0; }\n\n.slds-email-composer__combobox .slds-form-element__label {\n  position: absolute;\n  left: 0.75rem;\n  top: 50%;\n  transform: translateY(-50%); }\n\n.slds-email-composer__combobox .slds-combobox_container {\n  border: 0; }\n\n/**\n * @summary Provides styles for recipient labels inside of email composer\n *\n * @selector .slds-email-composer__recipient\n * @restrict .slds-email-composer label\n */\n.slds-email-composer__recipient {\n  position: absolute;\n  top: 0;\n  right: 0.75rem; }\n\n/**\n * Fixed bar at the bottom of viewport, contains items\n *\n * @name base\n * @selector .slds-utility-bar_container\n * @restrict footer\n * @support dev-ready\n * @variant\n */\n.slds-utility-bar_container {\n  position: relative; }\n\n/**\n * Fixed bar at the bottom of viewport, contains items\n *\n * @selector .slds-utility-bar\n * @restrict .slds-utility-bar_container ul\n */\n.slds-utility-bar {\n  display: -ms-flexbox;\n  display: flex;\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: 2.5rem;\n  background: white;\n  box-shadow: 0 -2px 2px 0 rgba(0, 0, 0, 0.16);\n  z-index: 4;\n  /**\n   * Notification indicator\n   *\n   * @selector .slds-indicator_unread\n   * @restrict .slds-utility-bar abbr\n   */ }\n\n.slds-utility-bar .slds-indicator_unread,\n.slds-utility-bar .slds-indicator--unread {\n  background: #d4504c;\n  top: 0.5rem; }\n\n/**\n * Items that invoke specific utility bar panel\n *\n * @selector .slds-utility-bar__item\n * @restrict .slds-utility-bar li\n */\n.slds-utility-bar__item {\n  display: -ms-flexbox;\n  display: flex;\n  margin-right: 1px; }\n\n/**\n * Button that invokes utility panel\n *\n * @selector .slds-utility-bar__action\n * @restrict .slds-utility-bar button\n */\n.slds-utility-bar__action {\n  position: relative;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  -ms-flex-align: center;\n      align-items: center;\n  padding: 0 0.75rem;\n  border-radius: 0;\n  border: 0;\n  color: #3e3e3c;\n  /**\n   * @selector .slds-is-active\n   * @restrict .slds-utility-bar__action\n   * @modifier\n   */ }\n\n.slds-utility-bar__action:after {\n  content: '';\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  height: 2px;\n  background: transparent; }\n\n.slds-utility-bar__action:focus, .slds-utility-bar__action:hover {\n  box-shadow: none; }\n\n.slds-utility-bar__action:focus:after {\n  height: 3px;\n  background: #1589ee; }\n\n.slds-utility-bar__action:hover, .slds-utility-bar__action:focus {\n  background: rgba(21, 137, 238, 0.1);\n  color: inherit; }\n\n.slds-utility-bar__action.slds-is-active {\n  background: rgba(21, 137, 238, 0.1);\n  color: inherit; }\n\n.slds-utility-bar__action.slds-is-active:after {\n  background: #1589ee; }\n\n/**\n * Container for utility bar item text, allows for multi-line text output\n *\n * @selector .slds-utility-bar__text\n * @restrict .slds-utility-bar__action > span\n */\n.slds-utility-bar__text {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n      flex-direction: column;\n  line-height: 1;\n  text-align: left; }\n\n/**\n * Creates styles for a utility bar item when it has a notification within its panel\n *\n * @selector .slds-has-notification\n * @restrict .slds-utility-bar__item\n */\n.slds-has-notification .slds-utility-bar__action {\n  background: #706e6b;\n  color: white; }\n\n.slds-has-notification .slds-utility-bar__action:hover, .slds-has-notification .slds-utility-bar__action:focus {\n  background: #16325c; }\n\n.slds-has-notification .slds-utility-bar__action:focus:after {\n  background: #c9c7c5; }\n\n/**\n * Container of the utility panel\n *\n * @selector .slds-utility-panel\n * @restrict .slds-utility-bar_container div\n */\n.slds-utility-panel {\n  position: fixed;\n  bottom: 1.875rem;\n  width: 21.25rem;\n  height: 30rem;\n  border-radius: 0.25rem 0.25rem 0 0;\n  border: 1px solid #dddbda;\n  border-bottom: none;\n  background: white;\n  transform: translateY(100%);\n  /**\n   * @selector .slds-is-open\n   * @restrict .slds-utility-panel\n   * @modifier\n   */\n  /**\n   * Header that contains an icon, title and panel actions such as minimizing the panel\n   *\n   * @selector .slds-utility-panel__header\n   * @restrict div\n   */\n  /**\n   * Area that contains the utility panel feature\n   *\n   * @selector .slds-utility-panel__body\n   * @restrict div\n   */ }\n\n.slds-utility-panel.slds-is-open {\n  box-shadow: 0 -2px 2px 0 rgba(0, 0, 0, 0.16);\n  transform: translateY(0); }\n\n.slds-utility-panel__header {\n  background: white;\n  border-bottom: 2px solid #1589ee;\n  border-radius: 0.25rem 0.25rem 0 0;\n  padding: 0.5rem 0.75rem; }\n\n.slds-utility-panel__body {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex: 1 1 0%;\n      flex: 1 1 0%;\n  -ms-flex-direction: column;\n      flex-direction: column;\n  overflow: auto; }\n\n/**\n * Container that fixes the global header to the top of the viewport,\n * contains global header element\n *\n * @name base\n * @selector .slds-global-header_container\n * @restrict header\n * @variant\n */\n.slds-global-header_container {\n  position: fixed;\n  width: 100%;\n  top: 0;\n  left: 0;\n  z-index: 100; }\n\n.slds-global-header_container .slds-assistive-text_focus,\n.slds-global-header_container .slds-assistive-text--focus {\n  background: white;\n  top: 0; }\n\n/**\n * @selector .slds-global-header\n * @restrict .slds-global-header_container div\n */\n.slds-global-header {\n  background: white;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.07);\n  padding: 0.5rem 0;\n  height: 3.125rem;\n  -ms-flex-align: center;\n      align-items: center;\n  /**\n   * A region within the global header\n   *\n   * @selector .slds-global-header__item\n   * @restrict .slds-global-header div, .slds-global-header ul\n   */\n  /**\n   * Region that contains the search input, handles sizing\n   *\n   * @selector .slds-global-header__item_search\n   * @restrict .slds-global-header__item:nth-child(2)\n   */\n  /**\n   * Container of the global header logo\n   *\n   * @selector .slds-global-header__logo\n   * @restrict .slds-global-header__item div\n   * @required\n   */\n  /**\n   * Button icons on the global header\n   *\n   * @selector .slds-global-header__button_icon\n   * @restrict .slds-global-header__item button\n   * @required\n   */\n  /**\n   * Button icon specifically for global actions\n   *\n   * @selector .slds-global-header__button_icon-actions\n   * @restrict .slds-global-header__item button\n   * @required\n   */\n  /**\n   * Button icon specifically for global actions\n   *\n   * @selector .slds-global-header__button_icon-favorites\n   * @restrict .slds-global-header__item button\n   * @required\n   */\n  /**\n   * Deal with sizing for global header icons\n   *\n   * @selector .global-header__icon\n   * @restrict .slds-global-header__item svg\n   * @required\n   */ }\n\n.slds-global-header__item {\n  padding: 0 1rem; }\n\n.slds-global-header__item_search, .slds-global-header__item--search {\n  -ms-flex: 0 1 27.5rem;\n      flex: 0 1 27.5rem;\n  padding: 0; }\n\n.slds-global-header__item_search .slds-input, .slds-global-header__item--search .slds-input {\n  padding-left: 3rem; }\n\n.slds-global-header__item_search .slds-input__icon_left,\n.slds-global-header__item_search .slds-input__icon--left, .slds-global-header__item--search .slds-input__icon_left,\n.slds-global-header__item--search .slds-input__icon--left {\n  left: 1.25rem; }\n\n.slds-global-header__logo {\n  width: 12.5rem;\n  height: 2.5rem;\n  background-image: url(\"/assets/images/logo.svg\");\n  background-size: contain;\n  background-repeat: no-repeat;\n  background-position: left center; }\n\n.slds-global-header__button_icon, .slds-global-header__button--icon {\n  margin: 0 0.25rem;\n  color: #a6a6a6; }\n\n.slds-global-header__button_icon .slds-icon, .slds-global-header__button--icon .slds-icon {\n  fill: #a6a6a6; }\n\n.slds-global-header__button_icon:hover:not(:disabled), .slds-global-header__button_icon:focus, .slds-global-header__button--icon:hover:not(:disabled), .slds-global-header__button--icon:focus {\n  color: #969696; }\n\n.slds-global-header__button_icon:hover:not(:disabled) .slds-icon,\n.slds-global-header__button_icon:focus .slds-icon, .slds-global-header__button--icon:hover:not(:disabled) .slds-icon,\n.slds-global-header__button--icon:focus .slds-icon {\n  fill: #969696; }\n\n.slds-global-header__button_icon-actions, .slds-global-header__button--icon-actions {\n  background: #a6a6a6;\n  border-radius: 0.25rem;\n  color: white; }\n\n.slds-global-header__button_icon-actions:hover, .slds-global-header__button_icon-actions:focus, .slds-global-header__button--icon-actions:hover, .slds-global-header__button--icon-actions:focus {\n  background-color: #969696;\n  color: white; }\n\n.slds-global-header__button_icon-actions .slds-button__icon, .slds-global-header__button--icon-actions .slds-button__icon {\n  width: 1rem;\n  height: 1rem; }\n\n.slds-global-header__button_icon-favorites, .slds-global-header__button--icon-favorites {\n  color: white;\n  /**\n     * Selected state for favorites button\n     *\n     * @selector .slds-is-selected\n     * @restrict .slds-global-header__button_icon-favorites\n     * @modifier\n     * @group stateful\n     */\n  /**\n     * Disabled state for favorites button\n     *\n     * @selector .slds-is-disabled\n     * @restrict .slds-global-header__button_icon-favorites\n     * @modifier\n     */ }\n\n.slds-global-header__button_icon-favorites .slds-icon,\n.slds-global-header__button_icon-favorites .slds-button__icon, .slds-global-header__button--icon-favorites .slds-icon,\n.slds-global-header__button--icon-favorites .slds-button__icon {\n  color: white;\n  stroke: #a6a6a6;\n  stroke-width: 2px;\n  stroke-linejoin: round;\n  stroke-linecap: round; }\n\n.slds-global-header__button_icon-favorites:hover .slds-icon,\n.slds-global-header__button_icon-favorites:hover .slds-button__icon,\n.slds-global-header__button_icon-favorites:focus .slds-icon,\n.slds-global-header__button_icon-favorites:focus .slds-button__icon, .slds-global-header__button--icon-favorites:hover .slds-icon,\n.slds-global-header__button--icon-favorites:hover .slds-button__icon,\n.slds-global-header__button--icon-favorites:focus .slds-icon,\n.slds-global-header__button--icon-favorites:focus .slds-button__icon {\n  color: white;\n  stroke: #969696; }\n\n.slds-global-header__button_icon-favorites.slds-is-selected .slds-icon,\n.slds-global-header__button_icon-favorites.slds-is-selected .slds-button__icon, .slds-global-header__button--icon-favorites.slds-is-selected .slds-icon,\n.slds-global-header__button--icon-favorites.slds-is-selected .slds-button__icon {\n  color: white;\n  stroke: #0070d2;\n  stroke-width: 1px;\n  fill: white; }\n\n.slds-global-header__button_icon-favorites.slds-is-selected:hover .slds-icon,\n.slds-global-header__button_icon-favorites.slds-is-selected:hover .slds-button__icon,\n.slds-global-header__button_icon-favorites.slds-is-selected:focus .slds-icon,\n.slds-global-header__button_icon-favorites.slds-is-selected:focus .slds-button__icon, .slds-global-header__button--icon-favorites.slds-is-selected:hover .slds-icon,\n.slds-global-header__button--icon-favorites.slds-is-selected:hover .slds-button__icon,\n.slds-global-header__button--icon-favorites.slds-is-selected:focus .slds-icon,\n.slds-global-header__button--icon-favorites.slds-is-selected:focus .slds-button__icon {\n  color: white;\n  stroke: #005fb2;\n  fill: white; }\n\n.slds-global-header__button_icon-favorites.slds-is-selected:active .slds-icon,\n.slds-global-header__button_icon-favorites.slds-is-selected:active .slds-button__icon, .slds-global-header__button--icon-favorites.slds-is-selected:active .slds-icon,\n.slds-global-header__button--icon-favorites.slds-is-selected:active .slds-button__icon {\n  color: white;\n  stroke: #005fb2;\n  fill: white; }\n\n.slds-global-header__button_icon-favorites.slds-is-disabled .slds-icon,\n.slds-global-header__button_icon-favorites.slds-is-disabled .slds-button__icon,\n.slds-global-header__button_icon-favorites:disabled .slds-icon,\n.slds-global-header__button_icon-favorites:disabled .slds-button__icon, .slds-global-header__button--icon-favorites.slds-is-disabled .slds-icon,\n.slds-global-header__button--icon-favorites.slds-is-disabled .slds-button__icon,\n.slds-global-header__button--icon-favorites:disabled .slds-icon,\n.slds-global-header__button--icon-favorites:disabled .slds-button__icon {\n  stroke: rgba(166, 166, 166, 0.25); }\n\n.slds-global-header__icon,\n.slds-global-header__icon .slds-icon,\n.slds-global-header__icon .slds-button__icon {\n  width: 1.25rem;\n  height: 1.25rem; }\n\n/**\n * @summary Handles styling for notification item interactions\n *\n * @name notifications\n * @selector .slds-global-header__notification\n * @restrict .slds-global-header_container li\n * @variant\n */\n.slds-global-header__notification {\n  border-bottom: 1px solid #dddbda; }\n\n.slds-global-header__notification_unread, .slds-global-header__notification--unread {\n  background-color: #ecebea; }\n\n.slds-global-header__notification:hover {\n  background-color: #f3f2f2; }\n\n.slds-global-header__notification:last-child {\n  border-bottom: 0; }\n\n/**\n * @summary Navigation bar wrapper\n *\n * @name navigation-bar\n * @selector .slds-context-bar\n * @restrict div\n * @variant\n */\n.slds-context-bar {\n  display: -ms-flexbox;\n  display: flex;\n  height: 2.5rem;\n  background-color: white;\n  border-bottom: 3px solid #1589ee;\n  color: #3e3e3c;\n  position: relative;\n  padding: 0 0 0 1.5rem;\n  /**\n   * Primary zone\n   *\n   * @selector .slds-context-bar__primary\n   * @restrict .slds-context-bar div\n   */\n  /**\n   * Secondary zone\n   *\n   * @selector .slds-context-bar__secondary\n   * @restrict .slds-context-bar nav, .slds-context-bar div\n   */\n  /**\n   * Manually add a vertical divider between elements\n   *\n   * @selector .slds-context-bar__vertical-divider\n   * @restrict .slds-context-bar div\n   */\n  /** Any item on the horizontal axis of the context nav bar\n   *\n   * Interactions such as hovers + active are defaults, bottom of the\n   * file deals with light / dark theme thresholds\n   *\n   * @selector .slds-context-bar__item\n   * @restrict .slds-context-bar div, .slds-context-bar li\n   */\n  /**\n   * Actionable Text Links\n   *\n   * @selector .slds-context-bar__label-action\n   * @restrict .slds-context-bar__item a, .slds-context-bar__item span, .slds-context-bar__item button\n   */\n  /**\n   * Actionable Icons\n   *\n   * @selector .slds-context-bar__icon-action\n   * @restrict .slds-context-bar div\n   */\n  /**\n   * @summary Tab modifier when using a tabset\n   *\n   * @name navigation-tab-bar\n   * @selector .slds-context-bar_tabs\n   * @restrict .slds-context-bar\n   * @variant\n   */\n  /**\n   *\n   * #### Accessibility\n   *\n   * On the Split View Toggle button, `aria-expanded` is set to `false` by default.\n   * Set `aria-expanded` to `true` when  Split View is active. When Split View is active,\n   * set the value of `aria-controls` on the Split View Toggle button, to the `ID` of the\n   * wrapper element that contains the Split View List.\n   *\n   * @selector .slds-context-bar__item_tab\n   * @restrict .slds-context-bar_tabs .slds-context-bar__item\n   * @notes Only use on tabset version\n   * @required\n   *\n   */\n  /**\n   * @summary Dirty state for a nav item\n   * @selector .slds-is-unsaved\n   * @restrict .slds-context-bar__item, .slds-dropdown__item\n   */\n  /**\n   * @summary Notifications style - Styling a tab or overflow item to indicate the tab has unread activity\n   * @selector .slds-has-notification\n   * @restrict .slds-context-bar__item, .slds-context-bar__item .slds-dropdown__item\n   */ }\n\n.slds-context-bar__primary, .slds-context-bar__secondary, .slds-context-bar__tertiary {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-negative: 0;\n      flex-shrink: 0; }\n\n.slds-context-bar__secondary {\n  -ms-flex: 1 1 0%;\n      flex: 1 1 0%;\n  min-width: 0; }\n\n.slds-context-bar__vertical-divider {\n  width: 0;\n  overflow: hidden;\n  border-left: 1px solid #dddbda; }\n\n.slds-context-bar__item {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-line-pack: center;\n      align-content: center;\n  -ms-flex-align: stretch;\n      align-items: stretch;\n  white-space: nowrap;\n  position: relative;\n  max-width: 15rem;\n  transition: background-color 0.25s cubic-bezier(0.39, 0.575, 0.565, 1);\n  /**\n     * Active state of an item\n     *\n     * @selector .slds-is-active\n     * @restrict .slds-context-bar__item:not(.slds-no-hover)\n     * @modifier\n     */\n  /**\n     * Toggled focused class applied via JavaScript\n     *\n     * @selector .slds-has-focus\n     * @restrict .slds-context-bar__item\n     * @modifier\n     */\n  /**\n     * Add a left border to a context bar item\n     *\n     * @selector .slds-context-bar__item_divider-left\n     * @restrict .slds-context-bar div, .slds-context-bar li\n     */\n  /**\n     * Add a right border to a context bar item\n     *\n     * @selector .slds-context-bar__item_divider-right\n     * @restrict .slds-context-bar div, .slds-context-bar li\n     */ }\n\n.slds-context-bar__item:not(.slds-no-hover):hover, .slds-context-bar__item.slds-is-active {\n  outline: 0;\n  border-radius: 0;\n  background-color: rgba(21, 137, 238, 0.1);\n  text-decoration: none;\n  cursor: pointer; }\n\n.slds-context-bar__item:not(.slds-no-hover):hover:after {\n  content: '';\n  width: 100%;\n  height: 3px;\n  display: block;\n  background: rgba(0, 0, 0, 0.25);\n  position: absolute;\n  bottom: -3px;\n  left: 0;\n  right: 0; }\n\n@supports (mix-blend-mode: soft-light) {\n  .slds-context-bar__item:not(.slds-no-hover):hover:after {\n    background: rgba(0, 0, 0, 0.75);\n    mix-blend-mode: soft-light; } }\n\n.slds-context-bar__item.slds-is-active {\n  animation: bkAnim 0.135s cubic-bezier(0.39, 0.575, 0.565, 1) both; }\n\n@keyframes bkAnim {\n  50% {\n    background-color: white; }\n  100% {\n    background-color: rgba(21, 137, 238, 0.1); } }\n\n.slds-context-bar__item.slds-is-active:before {\n  content: '';\n  height: 3px;\n  display: block;\n  background: #1589ee;\n  position: absolute;\n  top: 0;\n  left: -1px;\n  right: -1px;\n  animation: navBounceIn 0.15s cubic-bezier(0.39, 0.575, 0.565, 1) both; }\n\n@keyframes navBounceIn {\n  0% {\n    transform: translate3d(0, 20px, 0);\n    opacity: 0; }\n  20% {\n    opacity: 0; }\n  90% {\n    transform: translate3d(0, 1px, 0); }\n  100% {\n    transform: translate3d(0, 0, 0); } }\n\n.slds-context-bar__item.slds-is-active:hover {\n  border-bottom-color: rgba(21, 137, 238, 0.1); }\n\n.slds-context-bar__item.slds-has-focus:before, .slds-context-bar__item.slds-has-focus:after, .slds-context-bar__item.slds-has-focus:hover:before, .slds-context-bar__item.slds-has-focus:hover:after {\n  height: 4px; }\n\n.slds-context-bar__item.slds-has-notification {\n  background: rgba(21, 137, 238, 0.1); }\n\n.slds-context-bar__item_divider-left, .slds-context-bar__item--divider-left {\n  border-left: 1px solid #dddbda; }\n\n.slds-context-bar__item_divider-right, .slds-context-bar__item--divider-right {\n  border-right: 1px solid #dddbda; }\n\n.slds-context-bar__label-action {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-line-pack: center;\n      align-content: center;\n  -ms-flex-align: center;\n      align-items: center;\n  -ms-flex-positive: 1;\n      flex-grow: 1;\n  padding: 0 0.75rem;\n  border-radius: 0;\n  min-width: 0%;\n  color: inherit;\n  font-size: 0.8125rem; }\n\n.slds-context-bar__label-action:focus, .slds-context-bar__label-action:focus:hover {\n  outline: 0;\n  text-decoration: underline; }\n\n.slds-context-bar__label-action:hover {\n  text-decoration: none; }\n\n.slds-context-bar__label-action:hover, .slds-context-bar__label-action:focus {\n  color: inherit; }\n\n.slds-context-bar__label-action:active {\n  color: inherit;\n  text-decoration: none; }\n\n.slds-context-bar__icon-action {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n      align-items: center;\n  -ms-flex-line-pack: center;\n      align-content: center;\n  margin-left: -0.25rem;\n  padding: 0 0.5rem;\n  color: #706e6b;\n  border-radius: 0;\n  -ms-flex-negative: 0;\n      flex-shrink: 0; }\n\n.slds-context-bar__icon-action:focus {\n  outline: 0; }\n\n.slds-context-bar__icon-action:focus .slds-context-bar__button {\n  outline: 0;\n  box-shadow: 0 0 3px #0070D2; }\n\n.slds-context-bar__icon-action:focus ~ .slds-dropdown {\n  visibility: visible;\n  opacity: 1; }\n\n.slds-context-bar__icon-action:hover, .slds-context-bar__icon-action:focus {\n  color: #706e6b; }\n\n.slds-context-bar__icon-action:active {\n  color: #706e6b; }\n\n.slds-context-bar__icon-action .slds-icon-waffle_container {\n  width: 2rem;\n  height: 2rem;\n  margin-right: 0.25rem;\n  margin-left: -0.5rem; }\n\n.slds-context-bar__icon-action .slds-icon-waffle {\n  margin-right: auto;\n  margin-left: auto; }\n\n.slds-context-bar .slds-context-bar__button {\n  color: inherit; }\n\n.slds-context-bar .slds-context-bar__icon-action {\n  margin-left: auto; }\n\n.slds-context-bar_tabs, .slds-context-bar--tabs {\n  border-top: 1px solid #dddbda; }\n\n.slds-context-bar__item_tab, .slds-context-bar__item--tab {\n  width: 12rem;\n  border-right: 1px solid #dddbda;\n  /**\n     * Pinned state\n     * Toggles visibility of elements inside of tab\n     *\n     * @selector .slds-is-pinned\n     * @restrict .slds-context-bar__item_tab\n     * @modifier\n     */ }\n\n.slds-context-bar__item_tab .slds-context-bar__label-action, .slds-context-bar__item--tab .slds-context-bar__label-action {\n  padding: 0 0.5rem; }\n\n.slds-context-bar__item_tab.slds-is-pinned, .slds-context-bar__item--tab.slds-is-pinned {\n  width: auto;\n  padding-right: 0.5rem; }\n\n.slds-context-bar__item_tab.slds-is-pinned .slds-context-bar__label-action, .slds-context-bar__item--tab.slds-is-pinned .slds-context-bar__label-action {\n  padding: 0 0.5rem; }\n\n.slds-context-bar .slds-is-unsaved .slds-context-bar__label-action {\n  position: relative;\n  font-style: italic;\n  line-height: normal; }\n\n.slds-context-bar .slds-is-unsaved .slds-indicator_unread {\n  margin-left: -0.35rem; }\n\n.slds-context-bar .slds-has-notification {\n  /**\n     * @summary Unread notification icon\n     * @selector .slds-indicator_unread\n     * @restrict .slds-has-notification span\n     */ }\n\n.slds-context-bar .slds-has-notification .slds-indicator_unread {\n  display: inline-block;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  height: 6px;\n  width: 6px;\n  left: auto;\n  position: relative;\n  top: auto; }\n\n.slds-context-bar .slds-has-notification .slds-indicator_unsaved,\n.slds-context-bar .slds-has-notification .slds-indicator--unsaved {\n  top: -0.375rem; }\n\n/**\n * @summary Modifier that notifies a parent component that it has sub tabs inside of it\n * @selector .slds-has-sub-tabs\n * @restrict .slds-context-bar__item_tab\n */\n.slds-context-bar__item_tab.slds-has-sub-tabs.slds-is-active,\n.slds-context-bar__item_tab.slds-has-sub-tabs.slds-is-active:hover {\n  animation: none;\n  background-color: transparent; }\n\n.slds-context-bar__item_tab.slds-has-sub-tabs.slds-is-active:after,\n.slds-context-bar__item_tab.slds-has-sub-tabs.slds-is-active:hover:after {\n  content: '';\n  display: block;\n  position: absolute;\n  left: 0;\n  bottom: -3px;\n  height: 3px;\n  width: 100%;\n  background-color: white;\n  border: 0;\n  mix-blend-mode: unset; }\n\n/**\n * Unsaved indicator - This can probably be used in other locations as well\n *\n * @selector .slds-indicator_unsaved\n * @restrict .slds-context-bar__item span, abbr\n */\n.slds-indicator_unsaved,\n.slds-indicator--unsaved {\n  color: #1589ee;\n  -ms-flex-item-align: center;\n      -ms-grid-row-align: center;\n      align-self: center;\n  position: relative; }\n\n.slds-context-bar__dropdown-trigger .slds-dropdown {\n  margin-top: 3px; }\n\n.slds-context-bar__dropdown-trigger .slds-dropdown:before {\n  content: '';\n  position: absolute;\n  bottom: 100%;\n  width: 100%;\n  height: 3px; }\n\n/**\n * Styles for application name region\n *\n * @selector .slds-context-bar__app-name\n * @restrict .slds-context-bar__label-action\n */\n.slds-context-bar__app-name {\n  padding: 0 1.5rem 0 0;\n  font-size: 1.125rem;\n  font-weight: 300;\n  line-height: 1.25; }\n\n/**\n * Styles for object switcher region\n *\n * @selector .slds-context-bar__object-switcher\n * @restrict .slds-context-bar__item\n * @required\n */\n.slds-context-bar__object-switcher {\n  min-width: 9rem;\n  max-width: 12rem;\n  border-left: 1px solid #dddbda;\n  border-right: 1px solid #dddbda; }\n\n.slds-context-bar_theme-marketing,\n.slds-context-bar--theme-marketing {\n  border-bottom-color: #f59331; }\n\n.slds-context-bar_theme-marketing .slds-context-bar__item:not(.slds-no-hover):hover,\n.slds-context-bar--theme-marketing .slds-context-bar__item:not(.slds-no-hover):hover {\n  border-bottom-color: #f59331; }\n\n.slds-context-bar_theme-marketing .slds-context-bar__item.slds-is-active:before,\n.slds-context-bar--theme-marketing .slds-context-bar__item.slds-is-active:before {\n  background: #f59331; }\n\n/**\n * The discussion feed publisher is found at the top of a feed stream. It contains\n * basic and advanced publishing capibilities.\n *\n * The discussion feed is in a collapsed state by default. There are 3 states\n * of the discussion feed that provide different feedback to the user. First,\n * the collapsed state, this indicates the user has not interacted with the\n * discussion feed publisher. When the user initiates an interaction with the\n * publisher, by either focusing of the textara or clicking the \"Share\" button,\n * through javascript the class of `slds-is-active` should be applied to the\n * `slds-publisher` div. This class will expand the publisher box and display\n * additional publisher actions.\n *\n * During the active state, before the user has begun typing or attaching\n * additional content, the \"Share\" button should be disabled by applying the\n * `disabled` attribute to the `<textarea>`. When the user begins typing, the\n * `disabled` attribute should be toggled off.\n *\n * @summary Initializes a publisher\n *\n * @name base\n * @selector .slds-publisher\n * @restrict div\n * @variant\n */\n.slds-publisher {\n  display: -ms-flexbox;\n  display: flex;\n  /**\n   * @selector .slds-is-active\n   * @restrict .slds-publisher\n   * @modifier\n   */\n  /**\n   * Abstraction of the text input styles\n   *\n   * @selector .slds-publisher__input\n   * @restrict .slds-publisher textarea\n   * @required\n   */\n  /**\n   * Bottom row of actionable items\n   *\n   * @selector .slds-publisher__actions\n   * @restrict .slds-publisher div\n   * @required\n   */\n  /**\n   *\n   *\n   * @selector .slds-publisher__toggle-visibility\n   * @restrict .slds-publisher label, .slds-publisher ul\n   * @required\n   */ }\n\n.slds-publisher.slds-is-active {\n  display: block; }\n\n.slds-publisher.slds-is-active .slds-publisher__toggle-visibility {\n  display: inherit; }\n\n.slds-publisher.slds-is-active .slds-publisher__input {\n  line-height: 1.5;\n  height: auto;\n  max-height: 10rem;\n  resize: vertical;\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem; }\n\n.slds-publisher__input {\n  line-height: 1.875rem;\n  padding: 0 1rem;\n  resize: none;\n  min-height: calc(1.875rem + 2px);\n  max-height: calc(1.875rem + 2px);\n  width: 100%; }\n\n.slds-publisher__actions > .slds-button {\n  margin-left: 0.75rem; }\n\n.slds-publisher .slds-publisher__toggle-visibility {\n  display: none; }\n\n/**\n * The comment publisher is found at the bottom of a discussion feed comment\n * thread. It contains basic publishing capibilities.\n *\n * The comment publisher is in a collapsed state by default. There are 4 states\n * of the discussion feed that provide different feedback to the user. First,\n * the collapsed state, this indicates the user has not interacted with the\n * comment publisher. When the user initiates an interaction with the publisher,\n * by either focusing of the textara or clicking the \"Comment\" button, through\n * javascript the class of `slds-is-active` should be applied to the\n * `slds-publisher` element. This class will expand the publisher box and\n * display additional publisher actions.\n *\n * Due to the implementation of the comment publisher design, we used a faux\n * textarea container and we'll need to apply the our focus state to that custom\n * container. Using javascript, the class `slds-has-focus` should be applied to\n * the `slds-publisher` element when the user interacts with `<textarea>`. When\n * the user loses focus on the `<textarea>`, the class `slds-has-focus` should\n * be toggled off from the `slds-publisher` element.\n *\n * During the active state, before the user has begun typing or attaching\n * additional content, the \"Comment\" button should be disabled by applying the\n * `disabled` attribute to the `<textarea>`. When the user begins typing, the\n * `disabled` attribute should be toggled off.\n *\n * @summary Initiates publisher that is specific to commenting in threads\n *\n * @name comment\n * @selector .slds-publisher_comment\n * @restrict .slds-publisher\n * @required\n * @variant\n */\n.slds-publisher_comment,\n.slds-publisher--comment {\n  background-color: white;\n  border: 1px solid #dddbda;\n  border-radius: 0.25rem;\n  width: 100%;\n  position: relative;\n  min-height: calc(1.875rem + 2px);\n  max-height: calc(1.875rem + 2px);\n  /**\n   * Applies focus to comment publisher container when inside `textarea`\n   *\n   * @selector .slds-has-focus\n   * @restrict .slds-publisher_comment\n   * @notes Added through JavaScript\n   * @modifier\n   */ }\n\n.slds-publisher_comment.slds-is-active,\n.slds-publisher--comment.slds-is-active {\n  min-height: 6rem;\n  max-height: 15rem; }\n\n.slds-publisher_comment.slds-is-active .slds-publisher__actions,\n.slds-publisher--comment.slds-is-active .slds-publisher__actions {\n  display: -ms-flexbox;\n  display: flex; }\n\n.slds-publisher_comment.slds-has-focus,\n.slds-publisher--comment.slds-has-focus {\n  outline: 0;\n  border-color: #1589ee;\n  background-color: white;\n  box-shadow: 0 0 3px #0070D2; }\n\n.slds-publisher_comment .slds-publisher__actions,\n.slds-publisher--comment .slds-publisher__actions {\n  display: none;\n  padding: 0 0.75rem 0.75rem; }\n\n.slds-publisher_comment .slds-attachments,\n.slds-publisher--comment .slds-attachments {\n  padding: 0.5rem 0.75rem; }\n\n/**\n * A discussion feed consists of a list of posts. A `.slds-feed__item` contains a post and comments related to that post.\n *\n * @name base\n * @selector .slds-feed\n * @restrict div\n * @support dev-ready\n * @variant\n */\n.slds-feed {\n  position: relative;\n  max-width: 49rem;\n  margin: auto;\n  /**\n   * @selector .slds-feed__list\n   * @restrict .slds-feed ul\n   * @required\n   */\n  /**\n   * @selector .slds-feed__item\n   * @restrict .slds-feed__list li\n   * @required\n   */ }\n\n.slds-feed__list {\n  margin: 0;\n  padding: 0; }\n\n.slds-feed__item {\n  padding: 0.5rem 0; }\n\n@media (min-width: 48em) {\n  .slds-feed__item {\n    padding: 0.75rem 0; } }\n\n.slds-comment__content {\n  padding: 0.25rem 0; }\n\n.slds-comment__replies {\n  padding-top: 1rem;\n  margin-left: 3.75rem; }\n\n.slds-comment__replies > :last-child,\n.slds-comment__replies > :last-child .slds-comment {\n  padding-bottom: 0; }\n\n.slds-comment__replies > :last-child:before,\n.slds-comment__replies > :last-child .slds-comment:before {\n  content: none; }\n\n.slds-comment__replies .slds-comment {\n  position: relative;\n  margin-bottom: 0;\n  padding-bottom: 1rem; }\n\n.slds-comment__replies .slds-comment:before {\n  content: '';\n  background: #dddbda;\n  height: 100%;\n  width: 1px;\n  position: absolute;\n  left: 1.125rem;\n  top: 0;\n  bottom: 0;\n  margin-left: -0.5px;\n  z-index: -1; }\n\n.slds-comment__replies .slds-avatar {\n  border: 2px solid white; }\n\n.slds-tags {\n  display: -ms-flexbox;\n  display: flex; }\n\n.slds-tags__list {\n  display: -ms-flexbox;\n  display: flex; }\n\n.slds-tags__item {\n  margin-left: 0.25rem; }\n\n.slds-tags__item:after {\n  content: ', '; }\n\n.slds-tags__item:last-child:after {\n  content: none; }\n\n.slds-attachments {\n  padding-bottom: 0.5rem; }\n\n.slds-attachments:empty {\n  padding: 0; }\n\n.slds-attachments__item + .slds-attachments__item {\n  margin-top: 1rem; }\n\n/**\n * Container for feed item comments\n *\n * @selector .slds-feed__item-comments\n * @restrict .slds-feed__item div\n * @notes Contains comment replies and publisher\n * @required\n */\n.slds-feed__item-comments {\n  background: #fafaf9;\n  border-top: 1px solid #dddbda;\n  border-bottom: 1px solid #dddbda; }\n\n.slds-feed__item-comments .slds-comment {\n  padding: 0.5rem 1rem; }\n\n/**\n * @name post\n * @selector .slds-post\n * @restrict .slds-feed article\n * @variant\n */\n.slds-post {\n  background: white;\n  padding: 0.75rem 1rem;\n  /**\n   * Header region of a feed post\n   *\n   * @selector .slds-post__header\n   * @restrict .slds-post header\n   */\n  /**\n   * Content region of a feed post\n   *\n   * @selector .slds-post__content\n   * @restrict .slds-post div\n   */\n  /**\n   * Footer region of a feed post\n   *\n   * @selector .slds-post__footer\n   * @restrict .slds-post footer\n   */ }\n\n@media (max-width: 48em) {\n  .slds-post {\n    border-top: 1px solid #dddbda; } }\n\n@media (min-width: 64em) {\n  .slds-post {\n    padding: 0 1rem 0.5rem; } }\n\n.slds-post__header {\n  margin-bottom: 0.75rem; }\n\n.slds-post__content {\n  margin-bottom: 0.75rem; }\n\n@media (min-width: 48em) {\n  .slds-post__content {\n    margin-bottom: 1.5rem; } }\n\n.slds-post__footer {\n  display: -ms-flexbox;\n  display: flex;\n  font-size: 0.75rem;\n  -ms-flex-direction: column;\n      flex-direction: column; }\n\n@media (min-width: 48em) {\n  .slds-post__footer {\n    -ms-flex-direction: row;\n        flex-direction: row; } }\n\n/**\n * Footer region that contains quick action items for post\n *\n * @selector .slds-post__footer-actions-list\n * @restrict .slds-post__footer ul\n */\n.slds-post__footer-actions-list {\n  -ms-flex-pack: justify;\n      justify-content: space-between;\n  text-align: center;\n  -ms-flex-order: 1;\n      order: 1; }\n\n@media (max-width: 30em) {\n  .slds-post__footer-actions-list {\n    border-top: 1px solid #dddbda;\n    margin: 0 -0.75rem -0.75rem;\n    padding: 0 1rem; } }\n\n@media (min-width: 48em) {\n  .slds-post__footer-actions-list {\n    -ms-flex-order: 0;\n        order: 0; } }\n\n/**\n * Action items within the feed post footer\n *\n * @selector .slds-post__footer-action\n * @restrict .slds-post__footer-actions-list button\n */\n.slds-post__footer-action {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n      align-items: center;\n  -ms-flex-pack: center;\n      justify-content: center;\n  color: #3e3e3c;\n  padding: 0.75rem 0;\n  line-height: 1;\n  /**\n   * Active state for like button\n   *\n   * @selector .slds-is-active\n   * @restrict .slds-post__footer-action\n   * @modifier\n   */ }\n\n@media (min-width: 48em) {\n  .slds-post__footer-action {\n    margin-right: 1rem;\n    padding: 0; } }\n\n.slds-post__footer-action .slds-icon {\n  margin-right: 0.25rem; }\n\n.slds-post__footer-action:hover, .slds-post__footer-action:focus, .slds-post__footer-action.slds-is-active {\n  color: #005fb2;\n  text-decoration: none; }\n\n.slds-post__footer-action:hover .slds-icon, .slds-post__footer-action:focus .slds-icon, .slds-post__footer-action.slds-is-active .slds-icon {\n  fill: currentColor; }\n\n/**\n * Footer region that contains read only items for post\n *\n * @selector .slds-post__footer-meta-list\n * @restrict .slds-post__footer ul\n */\n.slds-post__footer-meta-list {\n  margin-bottom: 1rem; }\n\n@media (min-width: 48em) {\n  .slds-post__footer-meta-list {\n    margin-left: auto;\n    margin-bottom: 0; } }\n\n.slds-region_narrow .slds-post,\n.slds-region--narrow .slds-post {\n  border: 0;\n  padding: 0.75rem 1rem; }\n\n.slds-region_narrow .slds-post__content,\n.slds-region--narrow .slds-post__content {\n  margin-bottom: 0.75rem; }\n\n.slds-region_narrow .slds-post__footer,\n.slds-region--narrow .slds-post__footer {\n  -ms-flex-direction: column;\n      flex-direction: column; }\n\n.slds-region_narrow .slds-post__footer-action,\n.slds-region--narrow .slds-post__footer-action {\n  padding: 0.75rem 0; }\n\n.slds-region_narrow .slds-post__footer-actions-list,\n.slds-region--narrow .slds-post__footer-actions-list {\n  -ms-flex-order: 1;\n      order: 1;\n  border-top: 1px solid #dddbda;\n  margin: 0 -0.75rem -0.75rem;\n  padding: 0 1rem; }\n\n.slds-region_narrow .slds-post__footer-meta-list,\n.slds-region--narrow .slds-post__footer-meta-list {\n  margin-left: 0;\n  margin-bottom: 1rem; }\n\n.slds-post__payload {\n  padding: 0 0 1rem; }\n\n.slds-post__payload:empty {\n  padding: 0;\n  border: 0; }\n\n/**\n * @name base\n * @selector .slds-modal\n * @restrict section\n * @variant\n */\n.slds-modal {\n  opacity: 0;\n  visibility: hidden;\n  transition: transform 0.1s linear, opacity 0.1s linear;\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 9001;\n  /**\n   * Centers and sizes the modal horizontally and confines modal within viewport height\n   *\n   * @selector .slds-modal__container\n   * @restrict .slds-modal div\n   * @notes This should be nested immediately inside `.slds-modal` with nothing else nested on the same level.\n   * @required\n   */\n  /**\n   * Creates the Modal Header container.\n   *\n   * @selector .slds-modal__header\n   * @restrict .slds-modal header\n   * @notes This should be nested immediately inside `.slds-modal__container` as the first element.\n   * @required\n   */\n  /**\n   * Use when modal header has no content\n   *\n   * @selector .slds-modal__header_empty\n   * @restrict .slds-modal__header\n   */\n  /**\n   * Creates the scrollable content area for the modal.\n   *\n   * @selector .slds-modal__content\n   * @restrict .slds-modal div\n   * @required\n   */\n  /**\n   * Creates the shaded menu area for the modal.\n   *\n   * @selector .slds-modal__menu\n   * @restrict .slds-modal div\n   * @notes Either `.slds-modal__menu` or `.slds-modal__content` must be used. If you’re using this class, you do not need the other. This should be nested immediately inside `.slds-modal_container` and immediately after `.slds-modal__header`.\n   * @required\n   */\n  /**\n   * Creates the Modal Footer container.\n   *\n   * @selector .slds-modal__footer\n   * @restrict .slds-modal footer\n   * @notes This should be nested immediately inside `.slds-modal_container` and immediately after `.slds-modal__container`. Nothing should follow it. Note that by default, elements will be aligned to the right.\n   * @required\n   */\n  /**\n   * Positions the close button to the top right outside of the modal.\n   *\n   * @selector .slds-modal__close\n   * @restrict .slds-modal button\n   * @notes Either `.slds-modal__content` or `.slds-modal__menu` must be used. If you’re using this class, you do not need the other. This should be nested immediately inside `.slds-modal_container` and immediately after `.slds-modal__header`.\n   * @required\n   */ }\n\n.slds-modal__container {\n  position: relative;\n  transform: translate(0, 0);\n  transition: transform 0.1s linear, opacity 0.1s linear;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n      flex-direction: column;\n  -ms-flex-pack: center;\n      justify-content: center;\n  margin: 0 2rem;\n  height: 100%;\n  padding: 3rem 0;\n  border-radius: 0.25rem; }\n\n@media (min-width: 48em) {\n  .slds-modal__container {\n    margin: 0 auto;\n    width: 50%;\n    max-width: 40rem;\n    min-width: 20rem; } }\n\n.slds-modal__header, .slds-modal__content {\n  background: white; }\n\n.slds-modal__header, .slds-modal__footer {\n  -ms-flex-negative: 0;\n      flex-shrink: 0; }\n\n.slds-modal__header {\n  position: relative;\n  border-top-right-radius: 0.25rem;\n  border-top-left-radius: 0.25rem;\n  border-bottom: 2px solid #dddbda;\n  padding: 1rem;\n  text-align: center; }\n\n.slds-modal__header + .slds-modal__menu {\n  border-top-left-radius: 0;\n  border-top-right-radius: 0; }\n\n.slds-modal__header_empty, .slds-modal__header--empty {\n  padding: 0;\n  border-bottom: 0; }\n\n.slds-modal__header_empty + .slds-modal__content,\n.slds-modal__header--empty + .slds-modal__content {\n  border-top-right-radius: 0.25rem;\n  border-top-left-radius: 0.25rem; }\n\n.slds-modal__content {\n  overflow: hidden;\n  overflow-y: auto; }\n\n.slds-modal__content:last-child {\n  border-bottom-right-radius: 0.25rem;\n  border-bottom-left-radius: 0.25rem;\n  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.16); }\n\n.slds-modal__menu {\n  position: relative;\n  border-radius: 0.25rem;\n  padding: 1rem;\n  background-color: #f3f2f2; }\n\n@media (max-width: 48em) {\n  .slds-modal__menu .slds-button {\n    width: 100%;\n    margin: 0.125rem 0; } }\n\n.slds-modal__footer {\n  border-top: 2px solid #dddbda;\n  border-bottom-right-radius: 0.25rem;\n  border-bottom-left-radius: 0.25rem;\n  padding: 0.75rem 1rem;\n  background-color: #f3f2f2;\n  text-align: right;\n  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.16);\n  /**\n     * Makes buttons inside the footer spread to both left and right.\n     *\n     * @selector .slds-modal__footer_directional\n     * @restrict .slds-modal__footer\n     * @notes This is only needed when you have two buttons that indicate a back and forward navigation.\n     * @modifier\n     * @group direction\n     */ }\n\n.slds-modal__footer_directional .slds-button:first-child,\n.slds-modal__footer--directional .slds-button:first-child {\n  float: left; }\n\n.slds-modal__footer .slds-button + .slds-button {\n  margin-left: 0.5rem; }\n\n.slds-modal__close {\n  width: 2rem;\n  height: 2rem;\n  position: absolute;\n  top: -2.5rem;\n  right: -0.5rem; }\n\n/**\n * Widens the modal to take more horizontal space\n *\n * @selector .slds-modal_medium\n * @restrict .slds-modal\n * @modifier\n * @group size\n */\n@media (min-width: 48em) {\n  .slds-modal_medium .slds-modal__container {\n    width: 90%;\n    max-width: 75rem;\n    min-width: 40rem; } }\n\n/**\n * Widens the modal to take more horizontal space\n *\n * @selector .slds-modal_large\n * @restrict .slds-modal\n * @modifier\n * @group size\n */\n@media (min-width: 48em) {\n  .slds-modal_large .slds-modal__container,\n  .slds-modal--large .slds-modal__container {\n    width: 90%;\n    max-width: none;\n    min-width: 40rem; } }\n\n.slds-modal-backdrop {\n  transition-duration: 0.4s;\n  width: 100%;\n  height: 100%;\n  opacity: 0;\n  visibility: hidden;\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  background: rgba(43, 40, 38, 0.6);\n  z-index: 9000;\n  /**\n   * Allows the backdrop to be visible.\n   *\n   * @selector .slds-backdrop_open\n   * @restrict .slds-backdrop\n   * @notes Apply this class to a modal backdrop with JavaScript to make it visible.\n   * @modifier\n   * @required\n   */ }\n\n.slds-modal-backdrop_open, .slds-modal-backdrop--open {\n  visibility: visible;\n  opacity: 1;\n  transition: opacity 0.4s linear; }\n\n/**\n * Creates the shaded backdrop used behind the modal.\n *\n * @selector .slds-backdrop\n * @restrict .slds-modal ~ div\n * @notes This should follow after the `.slds-modal` as an empty element.\n * @required\n */\n.slds-backdrop {\n  transition-duration: 0.4s;\n  width: 100%;\n  height: 100%;\n  opacity: 0;\n  visibility: hidden;\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  background: rgba(43, 40, 38, 0.6);\n  z-index: 9000;\n  /**\n   * Allows the backdrop to be visible.\n   *\n   * @selector .slds-backdrop_open\n   * @restrict .slds-backdrop\n   * @notes Apply this class to a modal backdrop with JavaScript to make it visible.\n   * @modifier\n   * @required\n   */ }\n\n.slds-backdrop_open, .slds-backdrop--open {\n  visibility: visible;\n  opacity: 1;\n  transition: opacity 0.4s linear; }\n\n/**\n * Allows the modal to be visible.\n *\n * @selector .slds-fade-in-open\n * @restrict .slds-modal\n * @notes Apply this class to a modal with JavaScript to make it visible.\n * @modifier\n * @group animation\n */\n.slds-fade-in-open {\n  opacity: 1;\n  visibility: visible;\n  transition: opacity 0.1s linear; }\n\n.slds-fade-in-open .slds-modal__container-reset {\n  opacity: 1;\n  visibility: visible;\n  transform: translate(0, 0); }\n\n/**\n *\n *\n * @selector .slds-slide-up-open\n * @restrict .slds-modal\n * @modifier\n * @group animation\n */\n.slds-slide-up-open {\n  opacity: 1;\n  visibility: visible;\n  transform: translate(0, 0);\n  transition: opacity 0.1s linear, transform 0.2s linear; }\n\n.slds-slide-up-open .slds-modal__container-reset {\n  opacity: 0;\n  visibility: hidden;\n  transform: translate(0, 1rem);\n  transition: opacity 0.2s linear, transform 0.2s linear; }\n\n/**\n *\n *\n * @selector .slds-slide-up-saving\n * @restrict .slds-modal\n * @modifier\n * @group animation\n */\n.slds-slide-up-saving {\n  opacity: 1;\n  visibility: visible;\n  transform: translate(0, -1rem); }\n\n/**\n *\n *\n * @selector .slds-slide-down-cancel\n * @restrict .slds-modal\n * @modifier\n * @group animation\n */\n.slds-slide-down-cancel {\n  opacity: 1;\n  visibility: visible;\n  transform: translate(0, 1rem); }\n\n/**\n * @summary Base variant\n * @name base\n * @selector .slds-map\n * @restrict div\n * @variant\n */\n.slds-map {\n  position: relative;\n  width: 100%; }\n\n.slds-map:before {\n  content: '';\n  display: block;\n  height: 0;\n  width: 100%;\n  padding-top: 56.25%; }\n\n.slds-map iframe {\n  height: 100%;\n  width: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0; }\n\n/**\n * @summary Modifier that informs the parent grid container the coordinates panel is active\n * @selector .slds-has-coordinates\n */\n.slds-has-coordinates {\n  max-height: 660px; }\n\n.slds-has-coordinates .slds-map:before {\n  padding-top: 75%; }\n\n/**\n * @summary Element inside the coordinates panel that contains the title of the panel\n * @selector .slds-coordinates\n * @restrict .slds-has-coordinates div\n */\n.slds-coordinates {\n  overflow: auto; }\n\n/**\n * @summary Element inside the coordinates panel that contains the title of the panel\n * @selector .slds-coordinates__header\n * @restrict .slds-coordinates div\n */\n.slds-coordinates__header {\n  padding: 1rem; }\n\n/**\n * @summary Title inside the coordinates panel\n * @selector .slds-coordinates__title\n * @restrict .slds-coordinates h2\n */\n.slds-coordinates__title {\n  font-size: 1rem;\n  font-weight: 700; }\n\n/**\n * @summary Actionable items inside of the coordinates list\n * @selector .slds-coordinates__item-action\n * @restrict .slds-coordinates li button\n */\n.slds-coordinates__item-action {\n  padding: 0.5rem 1rem;\n  width: 100%; }\n\n.slds-coordinates__item-action .slds-text-link {\n  display: block; }\n\n.slds-coordinates__item-action:hover, .slds-coordinates__item-action:focus {\n  background-color: #f3f2f2;\n  outline: 0; }\n\n.slds-coordinates__item-action:hover .slds-text-link, .slds-coordinates__item-action:focus .slds-text-link {\n  text-decoration: underline; }\n\n.slds-coordinates__item-action:active {\n  background-color: #ecebea; }\n\n.slds-coordinates__item-action[aria-pressed=\"true\"] {\n  background-color: #ecebea; }\n\n/**\n * @summary Creates styles for app-launcher\n *\n * @name base\n * @selector .slds-app-launcher\n * @restrict section\n * @support prototype\n * @variant\n */\n.slds-app-launcher {\n  /**\n   * @summary Sets styles to search box, things like width and such\n   * @selector .slds-app-launcher__header-search\n   * @restrict .slds-app-launcher__header div\n   */\n  /**\n   * @summary Defines the body region of the app launcher modal\n   * @selector .slds-app-launcher__content\n   * @restrict .slds-app-launcher div\n   */\n  /**\n   * @summary Tile cards that contains the app information, the icon and description\n   * @selector .slds-app-launcher__tile\n   * @restrict .slds-app-launcher a\n   */\n  /**\n   * @summary App image or icon\n   * @selector .slds-app-launcher__tile-figure\n   * @restrict .slds-app-launcher__tile div\n   */\n  /**\n   * @summary App title and description\n   * @selector .slds-app-launcher__tile-body\n   * @restrict .slds-app-launcher__tile div\n   */\n  /**\n   * @summary Tile card that containes the just app icon and title\n   * @selector .slds-app-launcher__tile_small\n   * @restrict .slds-app-launcher__tile\n   * @deprecated\n   */\n  /**\n   * @summary App image or icon of a small tile\n   * @selector .slds-app-launcher__tile-figure_small\n   * @restrict .slds-app-launcher__tile-figure\n   * @deprecated\n   */\n  /**\n   * @summary App title, no description\n   * @selector .slds-app-launcher__tile-body_small\n   * @restrict .slds-app-launcher__tile-body\n   * @deprecated\n   */ }\n\n.slds-app-launcher__header-search {\n  -ms-flex: 0 1 25rem;\n      flex: 0 1 25rem;\n  padding: 0 1rem; }\n\n.slds-app-launcher__content {\n  -ms-flex: 1 1 auto;\n      flex: 1 1 auto; }\n\n.slds-app-launcher__content .slds-section__title-action {\n  background: transparent; }\n\n.slds-app-launcher__tile {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: stretch;\n      align-items: stretch;\n  margin: 0.5rem 0;\n  border: 1px solid #dddbda;\n  border-radius: 0.25rem;\n  cursor: move;\n  /**\n     * @summary Add styles associated with drag and drop of a tile\n     * @selector .slds-is-draggable\n     * @restrict .slds-app-launcher__tile\n     */\n  /**\n     * Add styles associated with a tile being grabbed in drag and drop interaction\n     *\n     * @selector .slds-is-grabbed\n     * @restrict .slds-app-launcher__tile\n     * @modifier\n     */ }\n\n.slds-app-launcher__tile:hover, .slds-app-launcher__tile:focus {\n  outline: 0;\n  border-color: #1589ee; }\n\n.slds-app-launcher__tile.slds-is-draggable .slds-app-launcher__tile-figure {\n  padding-bottom: 0.25rem; }\n\n.slds-app-launcher__tile.slds-is-grabbed {\n  transform: rotate(3deg); }\n\n.slds-app-launcher__tile-figure {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n      flex-direction: column;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  padding: 0.75rem;\n  color: white;\n  border-radius: 0.25rem 0 0 0.25rem;\n  text-align: center; }\n\n.slds-app-launcher__tile-body {\n  -ms-flex: 1 1 auto;\n      flex: 1 1 auto;\n  background: #f3f2f2;\n  padding: 0.5rem 0.75rem;\n  border-radius: 0 0.25rem 0.25rem 0; }\n\n.slds-app-launcher__tile_small, .slds-app-launcher__tile--small {\n  -ms-flex-direction: column;\n      flex-direction: column;\n  border: 0;\n  border-radius: 0;\n  text-align: center;\n  cursor: pointer; }\n\n.slds-app-launcher__tile_small:hover .slds-app-launcher__tile-figure_small,\n.slds-app-launcher__tile_small:hover .slds-app-launcher__tile-figure--small, .slds-app-launcher__tile_small:focus .slds-app-launcher__tile-figure_small,\n.slds-app-launcher__tile_small:focus .slds-app-launcher__tile-figure--small, .slds-app-launcher__tile--small:hover .slds-app-launcher__tile-figure_small,\n.slds-app-launcher__tile--small:hover .slds-app-launcher__tile-figure--small, .slds-app-launcher__tile--small:focus .slds-app-launcher__tile-figure_small,\n.slds-app-launcher__tile--small:focus .slds-app-launcher__tile-figure--small {\n  border-color: #1589ee; }\n\n.slds-app-launcher__tile-figure_small, .slds-app-launcher__tile-figure--small {\n  border: 1px solid #dddbda;\n  border-radius: 0.25rem; }\n\n.slds-app-launcher__tile-body_small, .slds-app-launcher__tile-body--small {\n  background: transparent;\n  padding: 0.5rem 0;\n  border: 0;\n  border-radius: 0; }\n\n/**\n * @summary Initializes a visual picker component\n *\n * @name coverable-content\n * @selector .slds-visual-picker\n * @restrict div\n * @variant\n */\n.slds-visual-picker {\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  position: relative;\n  -ms-flex-direction: column;\n      flex-direction: column;\n  border: 0;\n  border-radius: 0;\n  text-align: center;\n  cursor: pointer; }\n\n.slds-visual-picker:active .slds-visual-picker__figure {\n  border: 1px solid #1589ee;\n  box-shadow: 0 0 0 1px #1589ee inset; }\n\n.slds-visual-picker:hover .slds-visual-picker__figure {\n  cursor: pointer; }\n\n.slds-visual-picker input:not(:disabled) ~ label:hover .slds-visual-picker__figure {\n  cursor: pointer;\n  outline: 0;\n  border: 1px solid #1589ee;\n  box-shadow: 0 0 0 1px #1589ee inset; }\n\n.slds-visual-picker input {\n  width: 1px;\n  height: 1px;\n  border: 0;\n  clip: rect(0 0 0 0);\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n  /**\n     * @summary Non-selected state\n     * @selector .slds-is-not-selected\n     * @restrict .slds-visual-picker__figure > span\n     */\n  /**\n     * @summary Selected state\n     * @selector .slds-is-selected\n     * @restrict .slds-visual-picker__figure > span\n     */\n  /* stylelint-disable max-nesting-depth */ }\n\n.slds-visual-picker input:focus ~ label .slds-visual-picker__figure {\n  border: 1px solid #1589ee;\n  box-shadow: 0 0 0 1px #1589ee inset; }\n\n.slds-visual-picker input:checked ~ label .slds-visual-picker__figure {\n  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.16); }\n\n.slds-visual-picker input:checked ~ label .slds-is-not-selected {\n  display: none; }\n\n.slds-visual-picker input:checked ~ label .slds-is-selected {\n  display: block; }\n\n.slds-visual-picker input:checked ~ label .slds-visual-picker__icon {\n  background-color: #1589ee;\n  border: 1px solid #1589ee; }\n\n.slds-visual-picker input:checked ~ label .slds-visual-picker__text {\n  border: 1px solid #1589ee;\n  box-shadow: 0 0 0 1px #1589ee inset; }\n\n.slds-visual-picker input:checked ~ label .slds-visual-picker__text:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  right: 0;\n  border-color: transparent;\n  border-style: solid;\n  border-radius: 0.5rem;\n  border-width: 1rem;\n  border-right-color: #1589ee;\n  border-top-color: #1589ee; }\n\n.slds-visual-picker input[disabled] {\n  cursor: not-allowed;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none; }\n\n.slds-visual-picker input[disabled] ~ label .slds-icon {\n  opacity: 0.5; }\n\n.slds-visual-picker input[disabled] ~ label .slds-visual-picker__body,\n.slds-visual-picker input[disabled] ~ label .slds-visual-picker__text {\n  color: #706e6b; }\n\n.slds-visual-picker input[disabled] ~ label .slds-visual-picker__figure {\n  border: 1px solid #dddbda;\n  box-shadow: none; }\n\n.slds-visual-picker input[disabled] ~ label .slds-visual-picker__figure:hover {\n  cursor: not-allowed;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  border: 1px solid #dddbda;\n  box-shadow: none; }\n\n/**\n * @summary Visual container for icon and text\n * @selector .slds-visual-picker__figure\n * @restrict .slds-visual-picker div, .slds-visual-picker span\n */\n.slds-visual-picker__figure {\n  display: block;\n  background: white;\n  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.05);\n  border: 1px solid #dddbda;\n  border-radius: 0.25rem;\n  text-align: center; }\n\n.slds-visual-picker__figure .slds-icon-action-check {\n  background-color: #1589ee; }\n\n.slds-visual-picker__figure span {\n  display: block; }\n\n.slds-visual-picker__figure .slds-is-selected {\n  display: none; }\n\n/**\n * @summary Size modifier to adjust to the default size of medium\n * @selector .slds-visual-picker_medium\n * @restrict .slds-visual-picker\n * @modifier\n * @group size\n */\n.slds-visual-picker_medium .slds-visual-picker__figure,\n.slds-visual-picker_medium .slds-visual-picker__body {\n  width: 12rem; }\n\n.slds-visual-picker_medium .slds-visual-picker__figure {\n  height: 12rem; }\n\n/**\n * @summary Size modifier to adjust to the size of large\n * @selector .slds-visual-picker_large\n * @restrict .slds-visual-picker\n * @modifier\n * @group size\n */\n.slds-visual-picker_large .slds-visual-picker__figure,\n.slds-visual-picker_large .slds-visual-picker__body {\n  width: 15rem; }\n\n.slds-visual-picker_large .slds-visual-picker__figure {\n  height: 15rem; }\n\n/**\n * @summary Text area that sits outside the visual picker\n * @selector .slds-visual-picker__body\n * @restrict .slds-visual-picker span\n */\n.slds-visual-picker__body {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n      flex-direction: column;\n  background: transparent;\n  padding: 1rem 0.5rem;\n  border: 0;\n  border-radius: 0; }\n\n/**\n * Checkmark that is visibily toggled when input is checked\n *\n * @name non-coverable-content\n * @selector .slds-visual-picker__text-check\n * @restrict .slds-visual-picker span\n * @variant\n */\n.slds-visual-picker__text-check {\n  position: absolute;\n  top: -0.0625rem;\n  right: 0.625rem;\n  width: 0.5rem;\n  height: 0.5rem; }\n\n/**\n * @summary Initializes pill\n *\n * @name base\n * @selector .slds-pill\n * @restrict span\n * @support dev-ready\n * @variant\n */\n.slds-pill {\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  -ms-flex-align: center;\n      align-items: center;\n  -ms-flex-pack: justify;\n      justify-content: space-between;\n  max-width: 100%;\n  padding: 0.125rem;\n  border: 1px solid #dddbda;\n  border-radius: 0.25rem;\n  background-color: white;\n  position: relative;\n  min-height: 1.625rem;\n  /**\n   * Modifier that removes border and background from a pill\n   *\n   * @selector .slds-pill_bare\n   * @restrict .slds-pill\n   * @modifier\n   */\n  /**\n   * Container to hold pill(s) with borders\n   *\n   * @selector .slds-pill_container\n   * @restrict div\n   */\n  /**\n   * Container to hold pill(s) with no borders\n   *\n   * @selector .slds-pill_container_bare\n   * @restrict .slds-pill_container\n   * @modifier\n   * @deprecated\n   */\n  /**\n   * Line of text inside a pill\n   *\n   * @selector .slds-pill__label\n   * @restrict .slds-pill a, .slds-pill span\n   */\n  /**\n   * Initializes pill icon or avatar that sits to the left of the label\n   *\n   * @selector .slds-pill__icon_container\n   * @restrict .slds-pill span\n   */\n  /**\n   * Initializes remove icon in pill that sits to the right of the label\n   *\n   * @selector .slds-pill__remove\n   * @restrict .slds-pill button, .slds-pill span\n   */ }\n\n.slds-pill + .slds-pill {\n  margin-left: 0.125rem; }\n\n.slds-pill:hover {\n  background-color: #f4f6f9; }\n\n.slds-pill:focus {\n  outline: 0;\n  border-radius: 0.25rem;\n  border-color: #1589ee;\n  box-shadow: 0 0 3px #0070D2; }\n\n.slds-pill a {\n  text-decoration: none; }\n\n.slds-pill_bare, .slds-pill--bare {\n  background-color: transparent;\n  border: 0; }\n\n.slds-pill_bare:hover, .slds-pill--bare:hover {\n  background-color: transparent; }\n\n.slds-pill__container, .slds-pill-container, .slds-pill_container {\n  display: -ms-flexbox;\n  display: flex;\n  min-height: calc(1.875rem + 2px);\n  padding: 0.125rem;\n  border: 1px solid #dddbda;\n  border-radius: 0.25rem;\n  background-color: white; }\n\n.slds-pill__container .slds-listbox_inline, .slds-pill-container .slds-listbox_inline, .slds-pill_container .slds-listbox_inline {\n  margin-left: 0;\n  margin-right: 0; }\n\n.slds-pill__container_bare, .slds-pill__container--bare, .slds-pill_container_bare, .slds-pill_container--bare {\n  display: -ms-flexbox;\n  display: flex;\n  padding: 0.125rem;\n  border: 0;\n  border-radius: 0;\n  background-color: transparent; }\n\n.slds-pill__label {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis; }\n\n.slds-pill__label:focus {\n  outline: 0;\n  border-radius: 0.25rem;\n  box-shadow: 0 0 3px #0070D2; }\n\n.slds-pill__icon, .slds-pill__icon_container {\n  width: 1.25rem;\n  height: 1.25rem;\n  margin-right: 0.25rem; }\n\n.slds-pill__icon .slds-icon,\n.slds-pill__icon .slds-avatar, .slds-pill__icon_container .slds-icon,\n.slds-pill__icon_container .slds-avatar {\n  width: 1.25rem;\n  height: 1.25rem;\n  display: block;\n  font-size: 0.625rem; }\n\n.slds-pill__icon ~ .slds-pill__action, .slds-pill__icon_container ~ .slds-pill__action {\n  padding-left: calc(1.25rem + 0.25rem + 2px); }\n\n.slds-pill__remove {\n  width: 1rem;\n  height: 1rem;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  -ms-flex-align: center;\n      align-items: center;\n  -ms-flex-pack: center;\n      justify-content: center;\n  margin-left: 0.25rem;\n  border-radius: 0.125rem; }\n\n.slds-pill__remove svg {\n  width: 0.875rem;\n  height: 0.875rem; }\n\n/**\n * Creates a pill with a hyperlink\n *\n * @selector .slds-pill_link\n * @restrict .slds-pill\n */\n.slds-pill_link,\n.slds-pill--link {\n  border: 0;\n  padding: 0; }\n\n.slds-pill_link .slds-pill__icon_container,\n.slds-pill--link .slds-pill__icon_container {\n  display: inline-block;\n  position: absolute;\n  top: 50%;\n  left: 0.125rem;\n  transform: translateY(-50%); }\n\n.slds-pill_link .slds-pill__remove,\n.slds-pill--link .slds-pill__remove {\n  position: absolute;\n  top: 50%;\n  right: 0.125rem;\n  transform: translateY(-50%); }\n\n/**\n * Actionable element inside of pill with hyperlink\n *\n * @selector .slds-pill__action\n * @restrict .slds-pill_link a\n */\n.slds-pill__action {\n  padding: 0.125rem;\n  padding-right: calc(1rem + 0.25rem + 2px);\n  border: 1px solid #dddbda;\n  border-radius: 0.25rem;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  -ms-flex-positive: 1;\n      flex-grow: 1; }\n\n.slds-pill__action:focus {\n  outline: 0;\n  border-color: #1589ee;\n  box-shadow: 0 0 3px #0070D2; }\n\n/**\n * Pill error styles\n *\n * @selector .slds-has-error\n * @restrict .slds-pill\n * @modifier\n */\n.slds-has-error {\n  border-color: #c23934; }\n\n.slds-has-error .slds-pill__label {\n  font-weight: 700;\n  color: #c23934; }\n\n.slds-has-error .slds-pill__action {\n  border-color: #c23934; }\n\n.slds-wizard {\n  position: relative; }\n\n.slds-wizard__list {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: justify;\n      justify-content: space-between;\n  position: relative;\n  margin: auto; }\n\n.slds-wizard__item {\n  -ms-flex: 2 0 auto;\n      flex: 2 0 auto;\n  text-align: center;\n  width: 0%;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none; }\n\n.slds-wizard__item:first-child {\n  text-align: left;\n  -ms-flex-positive: 1;\n      flex-grow: 1; }\n\n.slds-wizard__item:last-child {\n  text-align: right;\n  -ms-flex-positive: 1;\n      flex-grow: 1; }\n\n.slds-wizard__item a:hover,\n.slds-wizard__item a:focus {\n  outline: 0;\n  text-decoration: none; }\n\n.slds-wizard__item a:hover .slds-wizard__marker,\n.slds-wizard__item a:focus .slds-wizard__marker {\n  background: #d8dde6; }\n\n.slds-wizard__link {\n  display: block; }\n\n.slds-wizard__marker {\n  width: 1.5rem;\n  height: 1.5rem;\n  border-radius: 50%;\n  background: #ecebea;\n  display: inline-block;\n  vertical-align: middle;\n  z-index: 1;\n  position: relative; }\n\n.slds-wizard__label {\n  display: block;\n  margin-top: 0.75rem; }\n\n.slds-wizard__progress {\n  position: absolute;\n  left: 0;\n  top: 0.625rem;\n  height: 0.25rem;\n  display: block;\n  width: 100%;\n  z-index: -1;\n  background: #ecebea; }\n\n.slds-wizard__progress-bar {\n  position: absolute;\n  left: 0;\n  top: 0;\n  height: 100%;\n  background: #0076de;\n  transition: width 0.2s ease; }\n\n.slds-wizard .slds-is-active .slds-wizard__marker {\n  background: #0076de; }\n\n.slds-wizard .slds-is-active a:hover .slds-wizard__marker,\n.slds-wizard .slds-is-active a:focus .slds-wizard__marker {\n  background: #005fb2; }\n\n.slds-path-coach {\n  border: transparent 1px solid;\n  border-top: 0; }\n\n.slds-path-coach.slds-is-expanded {\n  border-color: #dddbda;\n  padding-bottom: 1rem; }\n\n.slds-tabs_path,\n.slds-tabs--path {\n  display: block;\n  width: 100%; }\n\n.slds-tabs_path__nav,\n.slds-tabs--path__nav {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: start;\n      align-items: flex-start; }\n\n.slds-tabs_path .slds-is-complete,\n.slds-tabs--path .slds-is-complete {\n  background-color: #4bca81; }\n\n.slds-tabs_path .slds-is-complete .slds-tabs_path__stage,\n.slds-tabs_path .slds-is-complete .slds-tabs--path__stage,\n.slds-tabs--path .slds-is-complete .slds-tabs_path__stage,\n.slds-tabs--path .slds-is-complete .slds-tabs--path__stage {\n  transform: rotateX(0deg); }\n\n.slds-tabs_path .slds-is-complete .slds-tabs_path__title,\n.slds-tabs_path .slds-is-complete .slds-tabs--path__title,\n.slds-tabs--path .slds-is-complete .slds-tabs_path__title,\n.slds-tabs--path .slds-is-complete .slds-tabs--path__title {\n  transform: rotateX(180deg); }\n\n.slds-tabs_path .slds-is-complete .slds-tabs_path__link,\n.slds-tabs_path .slds-is-complete .slds-tabs--path__link,\n.slds-tabs--path .slds-is-complete .slds-tabs_path__link,\n.slds-tabs--path .slds-is-complete .slds-tabs--path__link {\n  color: #3e3e3c; }\n\n.slds-tabs_path .slds-is-complete:hover,\n.slds-tabs--path .slds-is-complete:hover {\n  background-color: #04844b; }\n\n.slds-tabs_path .slds-is-complete:hover .slds-tabs_path__stage,\n.slds-tabs_path .slds-is-complete:hover .slds-tabs--path__stage,\n.slds-tabs--path .slds-is-complete:hover .slds-tabs_path__stage,\n.slds-tabs--path .slds-is-complete:hover .slds-tabs--path__stage {\n  transform: rotateX(-180deg); }\n\n.slds-tabs_path .slds-is-complete:hover .slds-tabs_path__title,\n.slds-tabs_path .slds-is-complete:hover .slds-tabs--path__title,\n.slds-tabs--path .slds-is-complete:hover .slds-tabs_path__title,\n.slds-tabs--path .slds-is-complete:hover .slds-tabs--path__title {\n  transform: rotateX(0deg); }\n\n.slds-tabs_path .slds-is-complete:hover .slds-tabs_path__link,\n.slds-tabs_path .slds-is-complete:hover .slds-tabs--path__link,\n.slds-tabs--path .slds-is-complete:hover .slds-tabs_path__link,\n.slds-tabs--path .slds-is-complete:hover .slds-tabs--path__link {\n  color: white; }\n\n.slds-tabs_path .slds-is-current,\n.slds-tabs--path .slds-is-current {\n  background-color: #0070d2; }\n\n.slds-tabs_path .slds-is-current:hover,\n.slds-tabs--path .slds-is-current:hover {\n  background-color: #005fb2; }\n\n.slds-tabs_path .slds-is-current + .slds-is-incomplete:before,\n.slds-tabs--path .slds-is-current + .slds-is-incomplete:before {\n  background-color: #0070d2; }\n\n.slds-tabs_path .slds-is-current:hover + .slds-is-incomplete:before,\n.slds-tabs--path .slds-is-current:hover + .slds-is-incomplete:before {\n  background-color: #005fb2; }\n\n.slds-tabs_path .slds-is-incomplete,\n.slds-tabs--path .slds-is-incomplete {\n  background-color: #ecebea; }\n\n.slds-tabs_path .slds-is-incomplete:hover,\n.slds-tabs--path .slds-is-incomplete:hover {\n  background-color: #dddbda; }\n\n.slds-tabs_path .slds-is-incomplete .slds-tabs_path__link,\n.slds-tabs_path .slds-is-incomplete .slds-tabs--path__link,\n.slds-tabs--path .slds-is-incomplete .slds-tabs_path__link,\n.slds-tabs--path .slds-is-incomplete .slds-tabs--path__link {\n  color: #3e3e3c; }\n\n.slds-tabs_path .slds-is-lost,\n.slds-tabs_path .slds-is-lost:hover,\n.slds-tabs--path .slds-is-lost,\n.slds-tabs--path .slds-is-lost:hover {\n  background-color: #c23934; }\n\n.slds-tabs_path .slds-is-current .slds-tabs_path__link,\n.slds-tabs_path .slds-is-current .slds-tabs--path__link,\n.slds-tabs_path .slds-is-lost .slds-tabs_path__link,\n.slds-tabs_path .slds-is-lost .slds-tabs--path__link,\n.slds-tabs--path .slds-is-current .slds-tabs_path__link,\n.slds-tabs--path .slds-is-current .slds-tabs--path__link,\n.slds-tabs--path .slds-is-lost .slds-tabs_path__link,\n.slds-tabs--path .slds-is-lost .slds-tabs--path__link {\n  color: white; }\n\n.slds-tabs_path .slds-is-active,\n.slds-tabs--path .slds-is-active {\n  background-color: #061c3f; }\n\n.slds-tabs_path .slds-is-active .slds-tabs_path__link,\n.slds-tabs_path .slds-is-active .slds-tabs--path__link,\n.slds-tabs--path .slds-is-active .slds-tabs_path__link,\n.slds-tabs--path .slds-is-active .slds-tabs--path__link {\n  color: white; }\n\n.slds-tabs_path .slds-is-active:hover,\n.slds-tabs--path .slds-is-active:hover {\n  background-color: #16325c; }\n\n.slds-tabs_path .slds-is-active:hover + .slds-tabs_path__item:before,\n.slds-tabs_path .slds-is-active:hover + .slds-tabs--path__item:before,\n.slds-tabs--path .slds-is-active:hover + .slds-tabs_path__item:before,\n.slds-tabs--path .slds-is-active:hover + .slds-tabs--path__item:before {\n  background-color: #16325c; }\n\n.slds-tabs_path .slds-is-active + .slds-tabs_path__item:before,\n.slds-tabs_path .slds-is-active + .slds-tabs--path__item:before,\n.slds-tabs--path .slds-is-active + .slds-tabs_path__item:before,\n.slds-tabs--path .slds-is-active + .slds-tabs--path__item:before {\n  background-color: #061c3f; }\n\n.slds-tabs_path .slds-is-active .slds-tabs_path__title,\n.slds-tabs_path .slds-is-active .slds-tabs--path__title,\n.slds-tabs_path .slds-is-won .slds-tabs_path__title,\n.slds-tabs_path .slds-is-won .slds-tabs--path__title,\n.slds-tabs--path .slds-is-active .slds-tabs_path__title,\n.slds-tabs--path .slds-is-active .slds-tabs--path__title,\n.slds-tabs--path .slds-is-won .slds-tabs_path__title,\n.slds-tabs--path .slds-is-won .slds-tabs--path__title {\n  transform: rotateX(0deg); }\n\n.slds-tabs_path .slds-is-active .slds-tabs_path__stage,\n.slds-tabs_path .slds-is-active .slds-tabs--path__stage,\n.slds-tabs_path .slds-is-won .slds-tabs_path__stage,\n.slds-tabs_path .slds-is-won .slds-tabs--path__stage,\n.slds-tabs--path .slds-is-active .slds-tabs_path__stage,\n.slds-tabs--path .slds-is-active .slds-tabs--path__stage,\n.slds-tabs--path .slds-is-won .slds-tabs_path__stage,\n.slds-tabs--path .slds-is-won .slds-tabs--path__stage {\n  transform: rotateX(-180deg); }\n\n.slds-tabs_path__item,\n.slds-tabs--path__item {\n  overflow: hidden;\n  position: relative;\n  -ms-flex: 1 1 0%;\n      flex: 1 1 0%;\n  min-width: 5rem;\n  text-align: center;\n  perspective: 500px;\n  transition: transform 0.1s ease-in-out, background-color 0.1s linear; }\n\n.slds-tabs_path__item:first-child,\n.slds-tabs--path__item:first-child {\n  border-radius: 15rem 0 0 15rem; }\n\n.slds-tabs_path__item:last-child,\n.slds-tabs--path__item:last-child {\n  border-radius: 0 15rem 15rem 0;\n  border-right: 0; }\n\n.slds-tabs_path__item:before,\n.slds-tabs--path__item:before {\n  content: '';\n  display: block;\n  position: absolute;\n  top: 2px;\n  left: -1rem;\n  width: calc(2rem - (2px * 2));\n  height: calc(2rem - (2px * 2));\n  border: 2px solid white;\n  border-left: 0;\n  border-bottom: 0;\n  background-clip: padding-box;\n  transform: scale3d(0.8, 1.1, 1) rotate(45deg);\n  transition: transform 0.1s ease-in-out, background-color 0.1s linear; }\n\n.slds-tabs_path__item:first-child:before,\n.slds-tabs--path__item:first-child:before {\n  display: none; }\n\n.slds-tabs_path__item + .slds-is-complete:before,\n.slds-tabs_path__item + .slds-is-current:before,\n.slds-tabs--path__item + .slds-is-complete:before,\n.slds-tabs--path__item + .slds-is-current:before {\n  background-color: #4bca81; }\n\n.slds-tabs_path__item:hover + .slds-is-complete:before,\n.slds-tabs_path__item:hover + .slds-is-current:before,\n.slds-tabs--path__item:hover + .slds-is-complete:before,\n.slds-tabs--path__item:hover + .slds-is-current:before {\n  background-color: #04844b; }\n\n.slds-tabs_path__item + .slds-is-incomplete:before,\n.slds-tabs_path__item + .slds-is-lost:before,\n.slds-tabs--path__item + .slds-is-incomplete:before,\n.slds-tabs--path__item + .slds-is-lost:before {\n  background-color: #ecebea; }\n\n.slds-tabs_path__item:hover + .slds-is-incomplete:before,\n.slds-tabs_path__item:hover + .slds-is-lost:before,\n.slds-tabs--path__item:hover + .slds-is-incomplete:before,\n.slds-tabs--path__item:hover + .slds-is-lost:before {\n  background-color: #dddbda; }\n\n.slds-tabs_path__title,\n.slds-tabs--path__title {\n  max-width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap; }\n\n.slds-tabs_path__stage,\n.slds-tabs--path__stage {\n  position: absolute;\n  top: 50%;\n  left: 0.5rem;\n  width: 100%;\n  margin-top: -0.75rem;\n  transform: rotateX(-180deg); }\n\n.slds-tabs_path__link,\n.slds-tabs--path__link {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: center;\n      justify-content: center;\n  position: relative;\n  padding: 0.25rem 0.25rem 0.25rem 1.25rem;\n  line-height: 1.5rem;\n  text-decoration: none;\n  cursor: pointer; }\n\n.slds-tabs_path__link:hover,\n.slds-tabs--path__link:hover {\n  text-decoration: none; }\n\n.slds-tabs_path__link:focus,\n.slds-tabs--path__link:focus {\n  outline: 0; }\n\n.slds-tabs_path__title,\n.slds-tabs--path__title,\n.slds-tabs_path__stage,\n.slds-tabs--path__stage {\n  display: block;\n  transition: transform 0.2s linear;\n  -webkit-backface-visibility: hidden;\n  backface-visibility: hidden; }\n\n.slds-tabs_path__content,\n.slds-tabs--path__content {\n  position: relative;\n  padding-left: 1.5rem;\n  padding-right: 1rem; }\n\n.slds-coach__keys {\n  padding-left: 0.75rem; }\n\n.slds-coach__guidance {\n  padding-left: 1.5rem;\n  padding-bottom: 0.25rem;\n  background-color: white; }\n\n.slds-coach__keys,\n.slds-coach__guidance {\n  margin-top: 1rem;\n  padding-top: 1rem;\n  padding-right: 1.5rem; }\n\n.slds-coach__item {\n  border-top: #dddbda 1px solid;\n  padding: 1rem 0;\n  color: #706e6b; }\n\n.slds-coach__value {\n  border-top: #dddbda 1px solid;\n  padding-top: 1rem;\n  color: #3e3e3c; }\n\n/**\n * @name base\n * @selector .slds-path\n * @restrict div\n * @variant\n * @s1 false\n */\n.slds-path {\n  margin-top: 1rem;\n  border: transparent 1px solid;\n  /**\n   * @summary Indicates the coaching section is expanded\n   *\n   * @selector .slds-is-expanded\n   * @restrict .slds-path\n   */ }\n\n.slds-path.slds-is-expanded {\n  padding-bottom: 1rem;\n  border-color: #dddbda;\n  background-color: white; }\n\n/**\n * @summary Allows the path itself to be responsive\n *\n * @selector .slds-path__track\n * @restrict .slds-path div\n */\n.slds-path__track {\n  position: relative;\n  top: -1rem;\n  /**\n   * Indicates the scroller is in the overflow state\n   *\n   * @selector .slds-has-overflow\n   * @restrict .slds-path__track\n   */ }\n\n.slds-path__track.slds-has-overflow {\n  /**\n     *\n     * @summary Allows the path to scroll when necessary\n     *\n     * @selector .slds-path__scroller_inner\n     * @restrict .slds-path__scroller div\n     */ }\n\n.slds-path__track.slds-has-overflow .slds-path__scroller_inner {\n  overflow: hidden; }\n\n.slds-path__track.slds-has-overflow .slds-path__scroller-container {\n  position: relative;\n  min-width: 0%;\n  -ms-flex-positive: 1;\n      flex-grow: 1;\n  width: calc(100% - 4.75rem);\n  padding-right: 4.75rem; }\n\n.slds-path__track.slds-has-overflow .slds-path__scroll-controls {\n  display: -ms-flexbox;\n  display: flex;\n  position: absolute;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  margin-right: 0.5rem;\n  padding-left: 0.5rem;\n  background-color: white; }\n\n/**\n * @summary Creates the scrolling container for tab overflow\n *\n * @selector .slds-path__scroller\n * @restrict .slds-path__track div\n */\n.slds-path__scroller {\n  width: 100%; }\n\n/**\n * @summary Container for the buttons that control the scrolling\n *\n * @selector .slds-path__scroll-controls\n * @restrict .slds-path__track div\n *\n */\n.slds-path__scroll-controls {\n  display: none; }\n\n/**\n * @summary Shows the stage name when in the smaller state\n *\n * @selector .slds-path__stage-name\n * @restrict .slds-path__track span\n *\n */\n.slds-path__stage-name {\n  display: none; }\n\n/**\n * @summary Creates the container for toggle button and path\n *\n * @selector .slds-path__scroller_container\n * @restrict .slds-path__scroller div\n */\n.slds-path__scroller-container {\n  width: 100%; }\n\n.slds-path__action {\n  -ms-flex-negative: 0;\n      flex-shrink: 0; }\n\n/**\n * @summary Horizontal list of stages in path component\n *\n * @selector .slds-path__nav\n * @restrict .slds-path__scroller_inner ul\n */\n.slds-path__nav {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: start;\n      align-items: flex-start;\n  margin-right: 0.75rem;\n  /**\n  * @summary Creates the incomplete stage of the path\n  *\n  * @selector .slds-is-incomplete\n  * @restrict .slds-path__item\n  */\n  /**\n  * @summary Creates the active stage of the sales path\n  *\n  * @selector .slds-is-active\n  * @restrict .slds-path__item\n  * @notes This class must be placed on the item programatically when the guidance section is activated\n  */\n  /**\n   * @summary Creates success stage of the path\n   *\n   * @selector .slds-is-won\n   * @restrict .slds-path__item\n   */\n  /**\n   * @summary Creates the completed stage of the path\n   *\n   * @selector .slds-is-complete\n   * @restrict .slds-path__item\n   */\n  /**\n   * @summary Creates the current stage of the path\n   *\n   * @selector .slds-is-current\n   * @restrict .slds-path__item\n   */\n  /**\n  * @summary Creates lost stage of the path\n  *\n  * @selector .slds-is-lost\n  * @restrict .slds-path__item\n  * @notes This class must be added to the \"closed\" stage with JS when the Sales Path is complete and the opportunity is lost\n  */ }\n\n.slds-path__nav .slds-is-incomplete {\n  background-color: #ecebea; }\n\n.slds-path__nav .slds-is-incomplete:hover {\n  background-color: #dddbda; }\n\n.slds-path__nav .slds-is-incomplete .slds-path__link {\n  color: #3e3e3c; }\n\n.slds-path__nav .slds-is-active {\n  background-color: #061c3f; }\n\n.slds-path__nav .slds-is-active .slds-path__link {\n  color: white; }\n\n.slds-path__nav .slds-is-active:hover {\n  background-color: #061c3f; }\n\n.slds-path__nav .slds-is-active:hover + .slds-path__item:before {\n  background-color: #061c3f; }\n\n.slds-path__nav .slds-is-active + .slds-path__item:before {\n  background-color: #061c3f; }\n\n.slds-path__nav .slds-is-active .slds-path__title,\n.slds-path__nav .slds-is-active.slds-is-won .slds-path__title {\n  transform: rotateX(0deg); }\n\n.slds-path__nav .slds-is-active .slds-path__stage,\n.slds-path__nav .slds-is-active.slds-is-won .slds-path__stage {\n  transform: rotateX(-180deg); }\n\n.slds-path__nav .slds-is-complete {\n  background-color: #4bca81; }\n\n.slds-path__nav .slds-is-complete .slds-path__stage {\n  transform: translateY(-50%) rotateX(0deg); }\n\n.slds-path__nav .slds-is-complete .slds-path__title {\n  transform: rotateX(180deg); }\n\n.slds-path__nav .slds-is-complete .slds-path__link {\n  color: #3e3e3c; }\n\n.slds-path__nav .slds-is-complete:hover {\n  background-color: #04844b; }\n\n.slds-path__nav .slds-is-complete:hover .slds-path__stage {\n  transform: translateY(-50%) rotateX(-180deg); }\n\n.slds-path__nav .slds-is-complete:hover .slds-path__title {\n  transform: rotateX(0deg); }\n\n.slds-path__nav .slds-is-complete:hover .slds-path__link {\n  color: white; }\n\n.slds-path__nav .slds-is-current {\n  background-color: #0070d2; }\n\n.slds-path__nav .slds-is-current:hover {\n  background-color: #005fb2; }\n\n.slds-path__nav .slds-is-current + .slds-is-incomplete:before {\n  background-color: #0070d2; }\n\n.slds-path__nav .slds-is-current:hover + .slds-is-incomplete:before {\n  background-color: #005fb2; }\n\n.slds-path__nav .slds-is-lost,\n.slds-path__nav .slds-is-lost:hover {\n  background-color: #c23934; }\n\n.slds-path__nav .slds-is-current .slds-path__link,\n.slds-path__nav .slds-is-lost .slds-path__link {\n  color: white; }\n\n.slds-path__nav .slds-is-won {\n  background-color: #4bca81; }\n\n.slds-path__nav .slds-is-won .slds-path__link {\n  color: #3e3e3c; }\n\n.slds-path__nav .slds-is-won:hover {\n  background-color: #4bca81; }\n\n.slds-path__nav .slds-is-won:hover .slds-path__link {\n  color: currentColor; }\n\n/**\n * @summary Individual stages of a path\n *\n * @selector .slds-path__item\n * @restrict .slds-path__nav li\n */\n.slds-path__item {\n  overflow: hidden;\n  position: relative;\n  -ms-flex: 1 1 0%;\n      flex: 1 1 0%;\n  min-width: 5rem;\n  text-align: center;\n  perspective: 500px;\n  transition: transform 0.1s ease-in-out, background-color 0.1s linear; }\n\n.slds-path__item:first-child {\n  border-radius: 15rem 0 0 15rem; }\n\n.slds-path__item:last-child {\n  border-radius: 0 15rem 15rem 0;\n  border-right: 0; }\n\n.slds-path__item:before {\n  content: '';\n  display: block;\n  position: absolute;\n  top: 2px;\n  left: -1rem;\n  width: calc(2rem - (2px * 2));\n  height: calc(2rem - (2px * 2));\n  border: 2px solid white;\n  border-left: 0;\n  border-bottom: 0;\n  background-clip: padding-box;\n  transform: scale3d(0.8, 1.1, 1) rotate(45deg);\n  transition: transform 0.1s ease-in-out, background-color 0.1s linear; }\n\n.slds-path__item:first-child:before {\n  display: none; }\n\n.slds-path__item + .slds-is-complete:before,\n.slds-path__item + .slds-is-current:before {\n  background-color: #4bca81; }\n\n.slds-path__item + .slds-is-won:before {\n  background-color: #4bca81; }\n\n.slds-path__item:hover + .slds-is-complete:before,\n.slds-path__item:hover + .slds-is-current:before {\n  background-color: #04844b; }\n\n.slds-path__item + .slds-is-incomplete:before,\n.slds-path__item + .slds-is-lost:before {\n  background-color: #ecebea; }\n\n.slds-path__item:hover + .slds-is-incomplete:before,\n.slds-path__item:hover + .slds-is-lost:before {\n  background-color: #dddbda; }\n\n/**\n * @summary Contains the name of the stage\n *\n * @selector .slds-path__title\n * @restrict .slds-path__link span\n */\n.slds-path__title {\n  max-width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap; }\n\n/**\n * @summary Contains the check mark when the stage is completed\n *\n * @selector .slds-path__stage\n * @restrict .slds-path__link span\n */\n.slds-path__stage {\n  position: absolute;\n  top: 50%;\n  left: 0.5rem;\n  width: 100%;\n  transform: translateY(-50%) rotateX(-180deg); }\n\n/**\n * @summary Creates actionable element inside of each path item\n *\n * @selector .slds-path__link\n * @restrict .slds-path__item a\n */\n.slds-path__link {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: center;\n      justify-content: center;\n  position: relative;\n  padding: 0.25rem 0.25rem 0.25rem 1.25rem;\n  line-height: 1.5rem;\n  text-decoration: none;\n  cursor: pointer; }\n\n.slds-path__link:hover {\n  text-decoration: none; }\n\n.slds-path__link:focus {\n  outline: 0; }\n\n.slds-path__title,\n.slds-path__stage {\n  display: block;\n  transition: transform 0.2s linear;\n  -webkit-backface-visibility: hidden;\n  backface-visibility: hidden; }\n\n/**\n * @summary Button that toggles visibility of stage's tabpanel\n *\n * @selector .slds-path__trigger\n * @restrict .slds-path button\n */\n.slds-path__trigger {\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  margin: 0 0.75rem;\n  border-radius: 50%;\n  transition: 0.1s transform ease-in-out; }\n\n.slds-flip_vertical,\n.slds-flip--vertical {\n  transform: rotateX(180deg); }\n\n.slds-flip_horizontal,\n.slds-flip--horizontal {\n  transform: rotateY(180deg); }\n\n/**\n * @summary Actionable button that invokes a completion of the path\n *\n * @selector .slds-path__mark-complete\n * @restrict .slds-path button\n */\n.slds-path__mark-complete {\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  margin-right: 0.75rem;\n  border-radius: 15rem; }\n\n/**\n * @summary Actionable button that invokes a current stage of the path\n *\n * @selector .slds-path__mark-current\n * @restrict .slds-path button, .slds-path-coach button\n */\n.slds-path__mark-current {\n  border-color: #0070d2;\n  background-color: #0070d2; }\n\n.slds-path__mark-current:hover, .slds-path__mark-current:focus {\n  background-color: #005fb2; }\n\n/**\n * @summary Tabpanel of each stage of the path\n *\n * @selector .slds-path__content\n * @restrict .slds-path div\n */\n.slds-path__content {\n  position: relative;\n  top: -1rem;\n  padding: 0 0.5rem; }\n\n/**\n * @summary Key field section of expanded tabpanel\n *\n * @selector .slds-path__keys\n * @restrict .slds-path__content div\n */\n.slds-path__keys {\n  padding-left: 0.75rem; }\n\n/**\n * @summary Guidance section of expanded tabpanel\n *\n * @selector .slds-path__guidance\n * @restrict .slds-path__content div\n */\n.slds-path__guidance {\n  margin-right: 0.5rem;\n  padding-left: 0.75rem;\n  padding-bottom: 0.25rem;\n  background-color: white; }\n\n.slds-path__keys,\n.slds-path__guidance {\n  width: 50%;\n  margin-top: 1rem;\n  padding-top: 0.5rem;\n  padding-right: 0.75rem; }\n\n/**\n * @summary This creates the underlined titles in the coaching area\n *\n * @selector .slds-path__coach-title\n * @restrict .slds-path__keys div, .slds-path__guidance h2\n */\n.slds-path__coach-title {\n  margin-bottom: 0.5rem;\n  border-bottom: #dddbda 1px solid;\n  padding-bottom: 0.5rem;\n  font-size: 0.75rem;\n  text-transform: uppercase;\n  letter-spacing: 0.0625rem;\n  line-height: 1.125; }\n\n/**\n * @summary This creates the space at the top of the guidance area\n *\n * @selector .slds-path__guidance-content\n * @restrict .slds-path__guidance div\n */\n.slds-path__guidance-content {\n  padding-top: 0.5rem; }\n\n/**\n * @summary This class should be placed on a containing div when the Path container is between 565px and 1280px\n *\n * @selector .slds-region_medium\n * @restrict div\n */\n/**\n * @summary This class should be placed on a containing div when the Path container is between 360px and 564px\n *\n * @selector .slds-region_medium\n * @restrict div\n */\n.slds-region_small .slds-path__track,\n.slds-region_small .slds-path__coach {\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n  -ms-flex-align: start;\n      align-items: flex-start; }\n\n.slds-region_small .slds-path__stage-name {\n  display: block;\n  margin-left: 0.75rem; }\n\n.slds-region_small .slds-path__action {\n  -ms-flex-pack: justify;\n      justify-content: space-between;\n  -ms-flex-align: center;\n      align-items: center;\n  -ms-flex-line-pack: center;\n      align-content: center;\n  width: 100%;\n  margin-top: 0.5rem;\n  padding-right: 0.5rem;\n  padding-left: 0.5rem; }\n\n.slds-region_small .slds-path__mark-complete {\n  margin-right: 0; }\n\n.slds-region_small .slds-path__keys,\n.slds-region_small .slds-path__guidance {\n  width: 100%;\n  margin-right: 0; }\n\n/**\n * @name base\n * @selector .slds-progress-bar\n * @restrict div\n * @variant\n */\n.slds-progress-bar {\n  display: block;\n  width: 100%;\n  height: 0.5rem;\n  background: #dddbda;\n  border: 0;\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n  position: relative;\n  /**\n   * @summary Creates a progress bar height at the smaller .125rem (2px) size\n   *\n   * @selector .slds-progress-bar_x-small\n   * @restrict .slds-progress-bar\n   * @modifier\n   * @group height\n   */\n  /**\n   * @summary Creates a progress bar height at the smaller .25rem (4px) size\n   *\n   * @selector .slds-progress-bar_small\n   * @restrict .slds-progress-bar\n   * @modifier\n   * @group height\n   */\n  /**\n   * @summary Creates a progress bar height at the smaller .5rem (8px) size\n   *\n   * @selector .slds-progress-bar_medium\n   * @restrict .slds-progress-bar\n   * @modifier\n   * @group height\n   */\n  /**\n   * @summary Creates a progress bar height at the smaller .75rem (12px) size\n   *\n   * @selector .slds-progress-bar_large\n   * @restrict .slds-progress-bar\n   * @modifier\n   * @group height\n   */\n  /**\n   * @summary Adds a border radius to the progress bar to give it a circular look\n   *\n   * @selector .slds-progress-bar_circular\n   * @restrict .slds-progress-bar\n   * @modifier\n   * @group radius\n   */ }\n\n.slds-progress-bar_x-small, .slds-progress-bar--x-small {\n  height: 0.125rem; }\n\n.slds-progress-bar_small, .slds-progress-bar--small {\n  height: 0.25rem; }\n\n.slds-progress-bar_medium, .slds-progress-bar--medium {\n  height: 0.5rem; }\n\n.slds-progress-bar_large, .slds-progress-bar--large {\n  height: 0.75rem; }\n\n.slds-progress-bar_circular, .slds-progress-bar--circular {\n  border-radius: 0.5rem; }\n\n.slds-progress-bar_circular .slds-progress-bar__value, .slds-progress-bar--circular .slds-progress-bar__value {\n  border-radius: 0.5rem; }\n\n/**\n * @summary Fill up blue bar inside of the progress bar\n *\n * @selector .slds-progress-bar__value\n * @restrict .slds-progress-bar span\n */\n.slds-progress-bar__value {\n  display: block;\n  background: #5eb4ff;\n  height: 100%; }\n\n/**\n * @summary Create a green progress bar\n *\n * @selector .slds-progress-bar__value_success\n * @restrict .slds-progress-bar__value\n * @modifier\n * @group color\n */\n.slds-progress-bar__value_success {\n  background: #4bca81; }\n\n/**\n * @name base\n * @selector .slds-progress\n * @restrict div\n * @variant\n */\n.slds-progress {\n  position: relative;\n  max-width: 70%;\n  -ms-flex: 1 1 auto;\n      flex: 1 1 auto;\n  margin: auto;\n  /**\n   * When on a shaded background such as the modal footer\n   *\n   * @selector .slds-progress_shade\n   * @restrict .slds-progress\n   * @modifier\n   */ }\n\n.slds-progress_shade .slds-progress__item.slds-is-completed .slds-progress__marker,\n.slds-progress_shade .slds-progress__item.slds-is-active .slds-progress__marker, .slds-progress--shade .slds-progress__item.slds-is-completed .slds-progress__marker,\n.slds-progress--shade .slds-progress__item.slds-is-active .slds-progress__marker {\n  background: #f3f2f2; }\n\n.slds-progress_shade .slds-progress__item.slds-is-completed .slds-progress__marker_icon,\n.slds-progress_shade .slds-progress__item.slds-is-completed .slds-progress__marker--icon, .slds-progress--shade .slds-progress__item.slds-is-completed .slds-progress__marker_icon,\n.slds-progress--shade .slds-progress__item.slds-is-completed .slds-progress__marker--icon {\n  border-color: #f3f2f2; }\n\n.slds-progress_shade .slds-progress__item.slds-is-active .slds-progress__marker, .slds-progress--shade .slds-progress__item.slds-is-active .slds-progress__marker {\n  box-shadow: #f3f2f2 0 0 0 4px; }\n\n.slds-progress_shade .slds-progress__item.slds-is-active .slds-progress__marker:focus, .slds-progress--shade .slds-progress__item.slds-is-active .slds-progress__marker:focus {\n  box-shadow: #f3f2f2 0 0 0 4px, 0 0 3px 4px #0070d2; }\n\n.slds-progress_shade .slds-progress__item.slds-has-error .slds-progress__marker, .slds-progress_shade .slds-progress__item.slds-has-error .slds-progress__marker:hover, .slds-progress_shade .slds-progress__item.slds-has-error .slds-progress__marker:focus, .slds-progress--shade .slds-progress__item.slds-has-error .slds-progress__marker, .slds-progress--shade .slds-progress__item.slds-has-error .slds-progress__marker:hover, .slds-progress--shade .slds-progress__item.slds-has-error .slds-progress__marker:focus {\n  background: #f3f2f2; }\n\n.slds-progress_shade .slds-progress__item .slds-progress__marker, .slds-progress--shade .slds-progress__item .slds-progress__marker {\n  border-color: #f3f2f2; }\n\n.slds-progress .slds-progress-bar {\n  position: absolute;\n  top: 50%;\n  margin-top: -0.0625rem; }\n\n/**\n * An ordered list containing steps of a process\n *\n * @selector .slds-progress__list\n * @restrict .slds-progress ol\n * @required\n */\n.slds-progress__list {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: justify;\n      justify-content: space-between;\n  -ms-flex-align: center;\n      align-items: center;\n  margin: auto;\n  position: relative;\n  z-index: 1; }\n\n/**\n * A list item for each step of the process\n *\n * @selector .slds-progress__item\n * @restrict .slds-progress ol li\n * @required\n */\n.slds-progress__item {\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  -ms-flex-item-align: center;\n      align-self: center;\n  /**\n   * Stateful class for a completed step, `.slds-progress__item` should receive a success icon at this point\n   *\n   * @selector .slds-is-completed\n   * @restrict .slds-progress__item\n   * @notes Class should be applied thought JavaScript\n   * @required\n   * @modifier\n   * @group state\n   */\n  /**\n   * Stateful class for the active step\n   *\n   * @selector .slds-is-active\n   * @restrict .slds-progress__item\n   * @notes Class should be applied thought JavaScript\n   * @required\n   * @modifier\n   * @group state\n   */\n  /**\n   * Indicates error state for a step in the progress\n   *\n   * @selector .slds-has-error\n   * @restrict .slds-progress__item\n   * @required\n   * @modifier\n   */ }\n\n.slds-progress__item.slds-is-completed .slds-progress__marker,\n.slds-progress__item.slds-is-active .slds-progress__marker {\n  background: white;\n  border-color: #1589ee; }\n\n.slds-progress__item.slds-is-completed .slds-progress__marker_icon,\n.slds-progress__item.slds-is-completed .slds-progress__marker--icon {\n  border-color: white;\n  color: #5eb4ff; }\n\n.slds-progress__item.slds-is-active .slds-progress__marker {\n  box-shadow: white 0 0 0 4px; }\n\n.slds-progress__item.slds-is-active .slds-progress__marker:hover, .slds-progress__item.slds-is-active .slds-progress__marker:focus {\n  border-color: #0070d2; }\n\n.slds-progress__item.slds-is-active .slds-progress__marker:focus {\n  box-shadow: white 0 0 0 4px, 0 0 3px 4px #0070d2; }\n\n.slds-progress__item.slds-has-error .slds-progress__marker, .slds-progress__item.slds-has-error .slds-progress__marker:hover, .slds-progress__item.slds-has-error .slds-progress__marker:focus {\n  color: #c23934;\n  background: white;\n  border-color: transparent;\n  box-shadow: none; }\n\n.slds-progress__item.slds-has-error .slds-progress__marker:focus {\n  box-shadow: 0 0 3px 0 #c23934; }\n\n/**\n * Dot indicator for each step\n *\n * @selector .slds-progress__marker\n * @restrict .slds-progress ol li button\n * @required\n */\n.slds-progress__marker {\n  width: 1rem;\n  height: 1rem;\n  position: relative;\n  border-radius: 50%;\n  background: #dddbda;\n  border: 4px solid white;\n  vertical-align: middle;\n  /**\n   * Modifier that notifies the marker indicator that the step has been completed and its getting an icon\n   *\n   * @selector .slds-progress__marker_icon\n   * @restrict .slds-progress__marker\n   * @required\n   */ }\n\n.slds-progress__marker_icon, .slds-progress__marker--icon {\n  width: auto;\n  height: auto; }\n\n/**\n * @summary Progress Ring component\n *\n * @variant\n * @name base\n * @selector .slds-progress-ring\n * @restrict div\n */\n.slds-progress-ring {\n  position: relative;\n  display: inline-block;\n  height: 1.5rem;\n  width: 1.5rem;\n  border-radius: 1.5rem;\n  background: #dddbda; }\n\n.slds-progress-ring .slds-icon_container {\n  line-height: 0; }\n\n/**\n * @summary Progress indicator\n *\n * @selector .slds-progress-ring__progress\n * @restrict .slds-progress-ring div\n */\n.slds-progress-ring__progress {\n  transform: scale(-1, 1) rotate(-90deg); }\n\n.slds-progress-ring__progress svg {\n  width: 100%; }\n\n/**\n *\n * @selector .slds-progress-ring__path\n * @restrict .slds-progress-ring__progress path\n */\n.slds-progress-ring__path {\n  fill: #4bca81; }\n\n/**\n * @summary Progress ring content area\n *\n * @selector .slds-progress-ring__content\n * @restrict .slds-progress-ring > div\n */\n.slds-progress-ring__content {\n  position: absolute;\n  top: 0.1875rem;\n  right: 0.1875rem;\n  bottom: 0.1875rem;\n  left: 0.1875rem;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n      align-items: center;\n  -ms-flex-pack: center;\n      justify-content: center;\n  border-radius: 1.5rem;\n  background: white; }\n\n.slds-progress-ring__content .slds-icon {\n  width: 0.75rem; }\n\n/**\n * @summary Warning colors\n *\n * @selector .slds-progress-ring_warning\n * @restrict .slds-progress-ring\n * @modifier\n * @group theme\n */\n.slds-progress-ring_warning .slds-progress-ring__content {\n  background: white; }\n\n.slds-progress-ring_warning .slds-icon,\n.slds-progress-ring_warning .slds-progress-ring__path {\n  fill: #ffb75d; }\n\n/**\n * @summary Expired colors\n *\n * @selector .slds-progress-ring_expired\n * @restrict .slds-progress-ring\n * @modifier\n * @group theme\n */\n.slds-progress-ring_expired .slds-progress-ring__content {\n  background: white; }\n\n.slds-progress-ring_expired .slds-icon,\n.slds-progress-ring_expired .slds-progress-ring__path {\n  fill: #d4504c; }\n\n/**\n * @summary Complete colors\n *\n * @selector .slds-progress-ring_complete\n * @restrict .slds-progress-ring\n * @modifier\n * @group theme\n */\n.slds-progress-ring_complete .slds-icon {\n  fill: white; }\n\n.slds-progress-ring_complete .slds-progress-ring__path {\n  fill: #4bca81; }\n\n.slds-progress-ring_complete .slds-progress-ring__content {\n  background: #4bca81; }\n\n/**\n * The default rich text editor contains a minimal amount of text formatting capabilities.\n *\n * @name base\n * @selector .slds-rich-text-editor\n * @restrict div\n * @variant\n */\n.slds-rich-text-editor {\n  border: 1px solid #dddbda;\n  border-radius: 0.25rem; }\n\n/**\n * Container for Rich Text Editor Toolbar\n *\n * @selector .slds-rich-text-editor__toolbar\n * @restrict .slds-rich-text-editor div\n */\n.slds-rich-text-editor__toolbar {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n  -ms-flex-align: start;\n      align-items: flex-start;\n  white-space: nowrap;\n  position: relative;\n  padding: 0.5rem 0.5rem 0.25rem 0.5rem;\n  border-top-left-radius: 0.25rem;\n  border-top-right-radius: 0.25rem;\n  border-bottom: 1px solid #dddbda;\n  background-color: #f3f2f2; }\n\n/**\n * Container for Rich Text Editor Bottom Toolbar\n *\n * @selector .slds-rich-text-editor__toolbar-bottom\n * @restrict .slds-rich-text-editor__toolbar\n */\n.slds-rich-text-editor__toolbar_bottom {\n  border-radius: 0 0 0.25rem 0.25rem;\n  border-top: 1px solid #dddbda;\n  border-bottom: 0; }\n\n.slds-rich-text-editor .slds-button-group-list {\n  margin-right: 0.25rem;\n  margin-bottom: 0.25rem;\n  margin-left: 0; }\n\n.slds-rich-text-editor .slds-button-group-list:last-child {\n  margin-right: 0; }\n\n/**\n * Container for Rich Text Editor Combobox\n *\n * @selector .slds-rich-text-editor__select\n * @restrict .slds-rich-text-editor__toolbar div\n */\n.slds-rich-text-editor__select {\n  margin-right: 0.25rem; }\n\n.slds-region_narrow .slds-combobox {\n  max-width: 11rem; }\n\n.slds-region_narrow .slds-rich-text-editor__spacing-wrapper {\n  margin-bottom: 0.25rem; }\n\n/**\n * Focus state for rich text editor\n *\n * @selector .slds-has-focus\n * @restrict .slds-rich-text-editor\n * @modifier\n */\n.slds-rich-text-editor.slds-has-focus {\n  border-color: #1589ee;\n  box-shadow: 0 0 3px #0070D2; }\n\n/**\n * Error state for rich text editor\n *\n * @selector .slds-has-error\n * @restrict .slds-rich-text-editor\n * @modifier\n */\n.slds-rich-text-editor.slds-has-error {\n  border: 2px solid #c23934; }\n\n/**\n * Textarea for Rich Text Editor which is an editable div\n *\n * @selector .slds-textarea__content\n * @restrict .slds-rich-text-editor__textarea div\n */\n.slds-rich-text-area__content {\n  overflow-y: auto;\n  min-height: 6rem;\n  max-height: 15rem;\n  padding: 1rem;\n  border-radius: 0.25rem;\n  background-color: white; }\n\n.slds-picklist__label[disabled] .slds-icon {\n  fill: #dddbda; }\n\n[contenteditable]:focus {\n  outline: none; }\n\n/**\n * These are the overrides for both input and output from the RTE.\n * We may need to add or adjust these later based on further input.\n */\n.slds-rich-text-editor__textarea .ql-editor {\n  white-space: pre-wrap;\n  word-wrap: break-word;\n  -webkit-user-select: text;\n     -moz-user-select: text;\n      -ms-user-select: text;\n          user-select: text; }\n\n.slds-rich-text-editor__textarea .ql-editor.ql-blank:before {\n  color: #54698d;\n  content: attr(data-placeholder);\n  pointer-events: none;\n  position: absolute; }\n\n.slds-rich-text-editor__textarea .ql-editor a {\n  text-decoration: underline; }\n\n.slds-rich-text-editor__textarea .overflow-menu {\n  z-index: 2; }\n\n.slds-rich-text-editor__textarea .ql-active {\n  background-color: #eef1f6; }\n\n.slds-rich-text-editor__textarea .ql-clipboard {\n  position: absolute !important;\n  margin: -1px !important;\n  border: 0 !important;\n  padding: 0 !important;\n  width: 1px !important;\n  height: 1px !important;\n  overflow: hidden !important;\n  clip: rect(0 0 0 0) !important; }\n\n.slds-rich-text-editor__textarea,\n.slds-rich-text-editor__output {\n  line-height: 1.5;\n  overflow-wrap: break-word;\n  word-wrap: break-word;\n  -webkit-hyphens: manual;\n      -ms-hyphens: manual;\n          hyphens: manual; }\n\n.slds-rich-text-editor__textarea h1,\n.slds-rich-text-editor__output h1 {\n  font-size: 1.5rem; }\n\n.slds-rich-text-editor__textarea h2,\n.slds-rich-text-editor__output h2 {\n  font-size: 1.125rem;\n  font-weight: 700; }\n\n.slds-rich-text-editor__textarea h3,\n.slds-rich-text-editor__output h3 {\n  font-size: 1.125rem; }\n\n.slds-rich-text-editor__textarea h4,\n.slds-rich-text-editor__output h4 {\n  font-size: 0.875rem;\n  font-weight: 700; }\n\n.slds-rich-text-editor__textarea h5,\n.slds-rich-text-editor__output h5 {\n  font-size: 0.875rem; }\n\n.slds-rich-text-editor__textarea h6,\n.slds-rich-text-editor__output h6 {\n  font-size: 0.75rem;\n  font-weight: 700; }\n\n.slds-rich-text-editor__textarea h1,\n.slds-rich-text-editor__textarea h2,\n.slds-rich-text-editor__textarea h3,\n.slds-rich-text-editor__textarea h4,\n.slds-rich-text-editor__textarea h5,\n.slds-rich-text-editor__textarea h6,\n.slds-rich-text-editor__textarea ul,\n.slds-rich-text-editor__textarea ol,\n.slds-rich-text-editor__textarea dl,\n.slds-rich-text-editor__textarea img,\n.slds-rich-text-editor__output h1,\n.slds-rich-text-editor__output h2,\n.slds-rich-text-editor__output h3,\n.slds-rich-text-editor__output h4,\n.slds-rich-text-editor__output h5,\n.slds-rich-text-editor__output h6,\n.slds-rich-text-editor__output ul,\n.slds-rich-text-editor__output ol,\n.slds-rich-text-editor__output dl,\n.slds-rich-text-editor__output img {\n  margin-bottom: 0.75rem; }\n\n.slds-rich-text-editor__textarea blockquote,\n.slds-rich-text-editor__output blockquote {\n  margin: 2rem 1.5rem; }\n\n.slds-rich-text-editor__textarea ul,\n.slds-rich-text-editor__output ul {\n  margin-left: 1.5rem;\n  list-style: disc; }\n\n.slds-rich-text-editor__textarea ul ul,\n.slds-rich-text-editor__output ul ul {\n  list-style: circle; }\n\n.slds-rich-text-editor__textarea ul ul ul,\n.slds-rich-text-editor__output ul ul ul {\n  list-style: square; }\n\n.slds-rich-text-editor__textarea ul ol,\n.slds-rich-text-editor__output ul ol {\n  margin-left: 1.5rem;\n  list-style: decimal; }\n\n.slds-rich-text-editor__textarea ol,\n.slds-rich-text-editor__output ol {\n  margin-left: 1.5rem;\n  list-style: decimal; }\n\n.slds-rich-text-editor__textarea ol ol,\n.slds-rich-text-editor__output ol ol {\n  list-style: lower-alpha; }\n\n.slds-rich-text-editor__textarea ol ol ol,\n.slds-rich-text-editor__output ol ol ol {\n  list-style: lower-roman; }\n\n.slds-rich-text-editor__textarea ol ul,\n.slds-rich-text-editor__output ol ul {\n  margin-left: 1.5rem;\n  list-style: disc; }\n\n.slds-rich-text-editor__textarea dd,\n.slds-rich-text-editor__output dd {\n  margin-left: 2.5rem; }\n\n.slds-rich-text-editor__textarea abbr[title],\n.slds-rich-text-editor__textarea acronym[title],\n.slds-rich-text-editor__output abbr[title],\n.slds-rich-text-editor__output acronym[title] {\n  border-bottom: 1px dotted;\n  cursor: help; }\n\n.slds-rich-text-editor__textarea table,\n.slds-rich-text-editor__output table {\n  width: auto; }\n\n.slds-rich-text-editor__textarea table caption,\n.slds-rich-text-editor__output table caption {\n  text-align: center; }\n\n.slds-rich-text-editor__textarea th,\n.slds-rich-text-editor__textarea td,\n.slds-rich-text-editor__output th,\n.slds-rich-text-editor__output td {\n  padding: 0.5rem; }\n\n.slds-rich-text-editor__textarea .sans-serif,\n.slds-rich-text-editor__output .sans-serif {\n  font-family: sans-serif; }\n\n.slds-rich-text-editor__textarea .courier,\n.slds-rich-text-editor__output .courier {\n  font-family: courier; }\n\n.slds-rich-text-editor__textarea .verdana,\n.slds-rich-text-editor__output .verdana {\n  font-family: verdana; }\n\n.slds-rich-text-editor__textarea .tahoma,\n.slds-rich-text-editor__output .tahoma {\n  font-family: tahoma; }\n\n.slds-rich-text-editor__textarea .garamond,\n.slds-rich-text-editor__output .garamond {\n  font-family: garamond; }\n\n.slds-rich-text-editor__textarea .serif,\n.slds-rich-text-editor__output .serif {\n  font-family: serif; }\n\n.slds-rich-text-editor__textarea p,\n.slds-rich-text-editor__textarea ol,\n.slds-rich-text-editor__textarea ul,\n.slds-rich-text-editor__textarea pre,\n.slds-rich-text-editor__textarea blockquote,\n.slds-rich-text-editor__textarea h1,\n.slds-rich-text-editor__textarea h2,\n.slds-rich-text-editor__textarea h3,\n.slds-rich-text-editor__textarea h4,\n.slds-rich-text-editor__textarea h5,\n.slds-rich-text-editor__textarea h6,\n.slds-rich-text-editor__output p,\n.slds-rich-text-editor__output ol,\n.slds-rich-text-editor__output ul,\n.slds-rich-text-editor__output pre,\n.slds-rich-text-editor__output blockquote,\n.slds-rich-text-editor__output h1,\n.slds-rich-text-editor__output h2,\n.slds-rich-text-editor__output h3,\n.slds-rich-text-editor__output h4,\n.slds-rich-text-editor__output h5,\n.slds-rich-text-editor__output h6 {\n  counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9; }\n\n.slds-rich-text-editor__textarea ol,\n.slds-rich-text-editor__textarea ul,\n.slds-rich-text-editor__output ol,\n.slds-rich-text-editor__output ul {\n  margin: 0;\n  padding: 0;\n  padding-left: 1.5em; }\n\n.slds-rich-text-editor__textarea ol > li,\n.slds-rich-text-editor__output ol > li {\n  list-style-type: none; }\n\n.slds-rich-text-editor__textarea ul > li,\n.slds-rich-text-editor__output ul > li {\n  list-style-type: none; }\n\n.slds-rich-text-editor__textarea ul > li:before,\n.slds-rich-text-editor__output ul > li:before {\n  content: '\\2022';\n  font-size: 1.4em;\n  vertical-align: middle;\n  display: inline-block;\n  line-height: normal; }\n\n.slds-rich-text-editor__textarea ul[data-checked=\"true\"], .slds-rich-text-editor__textarea ul[data-checked=\"false\"],\n.slds-rich-text-editor__output ul[data-checked=\"true\"],\n.slds-rich-text-editor__output ul[data-checked=\"false\"] {\n  pointer-events: none; }\n\n.slds-rich-text-editor__textarea ul[data-checked=\"true\"] > li:before,\n.slds-rich-text-editor__output ul[data-checked=\"true\"] > li:before {\n  color: #777;\n  cursor: pointer;\n  pointer-events: all; }\n\n.slds-rich-text-editor__textarea ul[data-checked=\"false\"] > li:before,\n.slds-rich-text-editor__output ul[data-checked=\"false\"] > li:before {\n  color: #777;\n  cursor: pointer;\n  pointer-events: all; }\n\n.slds-rich-text-editor__textarea ul[data-checked=\"true\"] > li:before,\n.slds-rich-text-editor__output ul[data-checked=\"true\"] > li:before {\n  content: '\\2611'; }\n\n.slds-rich-text-editor__textarea ul[data-checked=\"false\"] > li:before,\n.slds-rich-text-editor__output ul[data-checked=\"false\"] > li:before {\n  content: '\\2610'; }\n\n.slds-rich-text-editor__textarea li:before,\n.slds-rich-text-editor__output li:before {\n  display: inline-block;\n  margin-right: 0.3em;\n  text-align: right;\n  white-space: nowrap;\n  width: 1.2em; }\n\n.slds-rich-text-editor__textarea li:not(.ql-direction-rtl):before,\n.slds-rich-text-editor__output li:not(.ql-direction-rtl):before {\n  margin-left: -1.5em; }\n\n.slds-rich-text-editor__textarea ol li,\n.slds-rich-text-editor__textarea ul li,\n.slds-rich-text-editor__output ol li,\n.slds-rich-text-editor__output ul li {\n  padding-left: 1.5em; }\n\n.slds-rich-text-editor__textarea ol li,\n.slds-rich-text-editor__output ol li {\n  counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;\n  counter-increment: list-num; }\n\n.slds-rich-text-editor__textarea ol li:before,\n.slds-rich-text-editor__output ol li:before {\n  content: counter(list-num, decimal) \". \"; }\n\n.slds-rich-text-editor__textarea ol li.ql-indent-1,\n.slds-rich-text-editor__output ol li.ql-indent-1 {\n  counter-increment: list-1;\n  counter-reset: list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9; }\n\n.slds-rich-text-editor__textarea ol li.ql-indent-1:before,\n.slds-rich-text-editor__output ol li.ql-indent-1:before {\n  content: counter(list-1, lower-alpha) \". \"; }\n\n.slds-rich-text-editor__textarea ol li.ql-indent-2,\n.slds-rich-text-editor__output ol li.ql-indent-2 {\n  counter-increment: list-2;\n  counter-reset: list-3 list-4 list-5 list-6 list-7 list-8 list-9; }\n\n.slds-rich-text-editor__textarea ol li.ql-indent-2:before,\n.slds-rich-text-editor__output ol li.ql-indent-2:before {\n  content: counter(list-2, lower-roman) \". \"; }\n\n.slds-rich-text-editor__textarea ol li.ql-indent-3,\n.slds-rich-text-editor__output ol li.ql-indent-3 {\n  counter-increment: list-3;\n  counter-reset: list-4 list-5 list-6 list-7 list-8 list-9; }\n\n.slds-rich-text-editor__textarea ol li.ql-indent-3:before,\n.slds-rich-text-editor__output ol li.ql-indent-3:before {\n  content: counter(list-3, decimal) \". \"; }\n\n.slds-rich-text-editor__textarea ol li.ql-indent-4,\n.slds-rich-text-editor__output ol li.ql-indent-4 {\n  counter-increment: list-4;\n  counter-reset: list-5 list-6 list-7 list-8 list-9; }\n\n.slds-rich-text-editor__textarea ol li.ql-indent-4:before,\n.slds-rich-text-editor__output ol li.ql-indent-4:before {\n  content: counter(list-4, lower-alpha) \". \"; }\n\n.slds-rich-text-editor__textarea ol li.ql-indent-5,\n.slds-rich-text-editor__output ol li.ql-indent-5 {\n  counter-increment: list-5;\n  counter-reset: list-6 list-7 list-8 list-9; }\n\n.slds-rich-text-editor__textarea ol li.ql-indent-5:before,\n.slds-rich-text-editor__output ol li.ql-indent-5:before {\n  content: counter(list-5, lower-roman) \". \"; }\n\n.slds-rich-text-editor__textarea ol li.ql-indent-6,\n.slds-rich-text-editor__output ol li.ql-indent-6 {\n  counter-increment: list-6;\n  counter-reset: list-7 list-8 list-9; }\n\n.slds-rich-text-editor__textarea ol li.ql-indent-6:before,\n.slds-rich-text-editor__output ol li.ql-indent-6:before {\n  content: counter(list-6, decimal) \". \"; }\n\n.slds-rich-text-editor__textarea ol li.ql-indent-7,\n.slds-rich-text-editor__output ol li.ql-indent-7 {\n  counter-increment: list-7;\n  counter-reset: list-8 list-9; }\n\n.slds-rich-text-editor__textarea ol li.ql-indent-7:before,\n.slds-rich-text-editor__output ol li.ql-indent-7:before {\n  content: counter(list-7, lower-alpha) \". \"; }\n\n.slds-rich-text-editor__textarea ol li.ql-indent-8,\n.slds-rich-text-editor__output ol li.ql-indent-8 {\n  counter-increment: list-8;\n  counter-reset: list-9; }\n\n.slds-rich-text-editor__textarea ol li.ql-indent-8:before,\n.slds-rich-text-editor__output ol li.ql-indent-8:before {\n  content: counter(list-8, lower-roman) \". \"; }\n\n.slds-rich-text-editor__textarea ol li.ql-indent-9,\n.slds-rich-text-editor__output ol li.ql-indent-9 {\n  counter-increment: list-9; }\n\n.slds-rich-text-editor__textarea ol li.ql-indent-9:before,\n.slds-rich-text-editor__output ol li.ql-indent-9:before {\n  content: counter(list-9, decimal) \". \"; }\n\n.slds-rich-text-editor__textarea ul li.ql-indent-1:before,\n.slds-rich-text-editor__output ul li.ql-indent-1:before {\n  content: '\\25E6'; }\n\n.slds-rich-text-editor__textarea ul li.ql-indent-2:before, .slds-rich-text-editor__textarea ul li.ql-indent-3:before, .slds-rich-text-editor__textarea ul li.ql-indent-4:before, .slds-rich-text-editor__textarea ul li.ql-indent-5:before, .slds-rich-text-editor__textarea ul li.ql-indent-6:before, .slds-rich-text-editor__textarea ul li.ql-indent-7:before, .slds-rich-text-editor__textarea ul li.ql-indent-8:before,\n.slds-rich-text-editor__output ul li.ql-indent-2:before,\n.slds-rich-text-editor__output ul li.ql-indent-3:before,\n.slds-rich-text-editor__output ul li.ql-indent-4:before,\n.slds-rich-text-editor__output ul li.ql-indent-5:before,\n.slds-rich-text-editor__output ul li.ql-indent-6:before,\n.slds-rich-text-editor__output ul li.ql-indent-7:before,\n.slds-rich-text-editor__output ul li.ql-indent-8:before {\n  content: '\\25AA'; }\n\n.slds-rich-text-editor__textarea .ql-indent-1:not(.ql-direction-rtl),\n.slds-rich-text-editor__output .ql-indent-1:not(.ql-direction-rtl) {\n  padding-left: 3em; }\n\n.slds-rich-text-editor__textarea li.ql-indent-1:not(.ql-direction-rtl),\n.slds-rich-text-editor__output li.ql-indent-1:not(.ql-direction-rtl) {\n  padding-left: 4.5em; }\n\n.slds-rich-text-editor__textarea .ql-indent-1.ql-direction-rtl.ql-align-right,\n.slds-rich-text-editor__output .ql-indent-1.ql-direction-rtl.ql-align-right {\n  padding-right: 3em; }\n\n.slds-rich-text-editor__textarea li.ql-indent-1.ql-direction-rtl.ql-align-right,\n.slds-rich-text-editor__output li.ql-indent-1.ql-direction-rtl.ql-align-right {\n  padding-right: 4.5em; }\n\n.slds-rich-text-editor__textarea .ql-indent-2:not(.ql-direction-rtl),\n.slds-rich-text-editor__output .ql-indent-2:not(.ql-direction-rtl) {\n  padding-left: 6em; }\n\n.slds-rich-text-editor__textarea li.ql-indent-2:not(.ql-direction-rtl),\n.slds-rich-text-editor__output li.ql-indent-2:not(.ql-direction-rtl) {\n  padding-left: 7.5em; }\n\n.slds-rich-text-editor__textarea .ql-indent-2.ql-direction-rtl.ql-align-right,\n.slds-rich-text-editor__output .ql-indent-2.ql-direction-rtl.ql-align-right {\n  padding-right: 6em; }\n\n.slds-rich-text-editor__textarea li.ql-indent-2.ql-direction-rtl.ql-align-right,\n.slds-rich-text-editor__output li.ql-indent-2.ql-direction-rtl.ql-align-right {\n  padding-right: 7.5em; }\n\n.slds-rich-text-editor__textarea .ql-indent-3:not(.ql-direction-rtl),\n.slds-rich-text-editor__output .ql-indent-3:not(.ql-direction-rtl) {\n  padding-left: 9em; }\n\n.slds-rich-text-editor__textarea li.ql-indent-3:not(.ql-direction-rtl),\n.slds-rich-text-editor__output li.ql-indent-3:not(.ql-direction-rtl) {\n  padding-left: 10.5em; }\n\n.slds-rich-text-editor__textarea .ql-indent-3.ql-direction-rtl.ql-align-right,\n.slds-rich-text-editor__output .ql-indent-3.ql-direction-rtl.ql-align-right {\n  padding-right: 9em; }\n\n.slds-rich-text-editor__textarea li.ql-indent-3.ql-direction-rtl.ql-align-right,\n.slds-rich-text-editor__output li.ql-indent-3.ql-direction-rtl.ql-align-right {\n  padding-right: 10.5em; }\n\n.slds-rich-text-editor__textarea .ql-indent-4:not(.ql-direction-rtl),\n.slds-rich-text-editor__output .ql-indent-4:not(.ql-direction-rtl) {\n  padding-left: 12em; }\n\n.slds-rich-text-editor__textarea li.ql-indent-4:not(.ql-direction-rtl),\n.slds-rich-text-editor__output li.ql-indent-4:not(.ql-direction-rtl) {\n  padding-left: 13.5em; }\n\n.slds-rich-text-editor__textarea .ql-indent-4.ql-direction-rtl.ql-align-right,\n.slds-rich-text-editor__output .ql-indent-4.ql-direction-rtl.ql-align-right {\n  padding-right: 12em; }\n\n.slds-rich-text-editor__textarea li.ql-indent-4.ql-direction-rtl.ql-align-right,\n.slds-rich-text-editor__output li.ql-indent-4.ql-direction-rtl.ql-align-right {\n  padding-right: 13.5em; }\n\n.slds-rich-text-editor__textarea .ql-indent-5:not(.ql-direction-rtl),\n.slds-rich-text-editor__output .ql-indent-5:not(.ql-direction-rtl) {\n  padding-left: 15em; }\n\n.slds-rich-text-editor__textarea li.ql-indent-5:not(.ql-direction-rtl),\n.slds-rich-text-editor__output li.ql-indent-5:not(.ql-direction-rtl) {\n  padding-left: 16.5em; }\n\n.slds-rich-text-editor__textarea .ql-indent-5.ql-direction-rtl.ql-align-right,\n.slds-rich-text-editor__output .ql-indent-5.ql-direction-rtl.ql-align-right {\n  padding-right: 15em; }\n\n.slds-rich-text-editor__textarea li.ql-indent-5.ql-direction-rtl.ql-align-right,\n.slds-rich-text-editor__output li.ql-indent-5.ql-direction-rtl.ql-align-right {\n  padding-right: 16.5em; }\n\n.slds-rich-text-editor__textarea .ql-indent-6:not(.ql-direction-rtl),\n.slds-rich-text-editor__output .ql-indent-6:not(.ql-direction-rtl) {\n  padding-left: 18em; }\n\n.slds-rich-text-editor__textarea li.ql-indent-6:not(.ql-direction-rtl),\n.slds-rich-text-editor__output li.ql-indent-6:not(.ql-direction-rtl) {\n  padding-left: 19.5em; }\n\n.slds-rich-text-editor__textarea .ql-indent-6.ql-direction-rtl.ql-align-right,\n.slds-rich-text-editor__output .ql-indent-6.ql-direction-rtl.ql-align-right {\n  padding-right: 18em; }\n\n.slds-rich-text-editor__textarea li.ql-indent-6.ql-direction-rtl.ql-align-right,\n.slds-rich-text-editor__output li.ql-indent-6.ql-direction-rtl.ql-align-right {\n  padding-right: 19.5em; }\n\n.slds-rich-text-editor__textarea .ql-indent-7:not(.ql-direction-rtl),\n.slds-rich-text-editor__output .ql-indent-7:not(.ql-direction-rtl) {\n  padding-left: 21em; }\n\n.slds-rich-text-editor__textarea li.ql-indent-7:not(.ql-direction-rtl),\n.slds-rich-text-editor__output li.ql-indent-7:not(.ql-direction-rtl) {\n  padding-left: 22.5em; }\n\n.slds-rich-text-editor__textarea .ql-indent-7.ql-direction-rtl.ql-align-right,\n.slds-rich-text-editor__output .ql-indent-7.ql-direction-rtl.ql-align-right {\n  padding-right: 21em; }\n\n.slds-rich-text-editor__textarea li.ql-indent-7.ql-direction-rtl.ql-align-right,\n.slds-rich-text-editor__output li.ql-indent-7.ql-direction-rtl.ql-align-right {\n  padding-right: 22.5em; }\n\n.slds-rich-text-editor__textarea .ql-indent-8:not(.ql-direction-rtl),\n.slds-rich-text-editor__output .ql-indent-8:not(.ql-direction-rtl) {\n  padding-left: 24em; }\n\n.slds-rich-text-editor__textarea li.ql-indent-8:not(.ql-direction-rtl),\n.slds-rich-text-editor__output li.ql-indent-8:not(.ql-direction-rtl) {\n  padding-left: 25.5em; }\n\n.slds-rich-text-editor__textarea .ql-indent-8.ql-direction-rtl.ql-align-right,\n.slds-rich-text-editor__output .ql-indent-8.ql-direction-rtl.ql-align-right {\n  padding-right: 24em; }\n\n.slds-rich-text-editor__textarea li.ql-indent-8.ql-direction-rtl.ql-align-right,\n.slds-rich-text-editor__output li.ql-indent-8.ql-direction-rtl.ql-align-right {\n  padding-right: 25.5em; }\n\n.slds-rich-text-editor__textarea .ql-indent-9:not(.ql-direction-rtl),\n.slds-rich-text-editor__output .ql-indent-9:not(.ql-direction-rtl) {\n  padding-left: 27em; }\n\n.slds-rich-text-editor__textarea li.ql-indent-9:not(.ql-direction-rtl),\n.slds-rich-text-editor__output li.ql-indent-9:not(.ql-direction-rtl) {\n  padding-left: 28.5em; }\n\n.slds-rich-text-editor__textarea .ql-indent-9.ql-direction-rtl.ql-align-right,\n.slds-rich-text-editor__output .ql-indent-9.ql-direction-rtl.ql-align-right {\n  padding-right: 27em; }\n\n.slds-rich-text-editor__textarea li.ql-indent-9.ql-direction-rtl.ql-align-right,\n.slds-rich-text-editor__output li.ql-indent-9.ql-direction-rtl.ql-align-right {\n  padding-right: 28.5em; }\n\n.slds-spinner_container {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 9050;\n  background-color: rgba(255, 255, 255, 0.75);\n  visibility: visible;\n  opacity: 1;\n  transition: opacity 0.2s ease, visibility 0s;\n  transition-delay: 0s, 0.3s; }\n\n/* Follow production class names (not starting with slds-) */\n/* stylelint-disable selector-class-pattern */\n.slds-spinner_container.is-hidden {\n  visibility: hidden;\n  opacity: 0;\n  transition: opacity 0.2s ease, visibility 0s;\n  transition-delay: 0s, 0s; }\n\n.slds-spinner_container.hide {\n  display: none; }\n\n/* stylelint-enable selector-class-pattern */\n/**\n * @name base\n * @selector .slds-spinner\n * @restrict div\n * @variant\n */\n.slds-spinner {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%) rotate(90deg); }\n\n.slds-spinner,\n.slds-spinner__dot-a,\n.slds-spinner__dot-b {\n  transform-origin: 50% 50%; }\n\n/**\n * This creates two of the circles\n *\n * @selector .slds-spinner__dot-a\n * @restrict .slds-spinner div\n * @required\n */\n/**\n * This creates two of the circles\n *\n * @selector .slds-spinner__dot-b\n * @restrict .slds-spinner div\n * @required\n */\n.slds-spinner__dot-a,\n.slds-spinner__dot-b {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%; }\n\n.slds-spinner:before,\n.slds-spinner:after,\n.slds-spinner__dot-a:before,\n.slds-spinner__dot-b:before,\n.slds-spinner__dot-a:after,\n.slds-spinner__dot-b:after {\n  position: absolute;\n  content: '';\n  background: #b0adab;\n  border-radius: 50%;\n  animation-duration: 1000ms;\n  animation-iteration-count: infinite; }\n\n.slds-spinner__dot-a {\n  transform: rotate(60deg) translateY(0); }\n\n.slds-spinner__dot-b {\n  transform: rotate(120deg) translateY(0); }\n\n.slds-spinner:before {\n  animation-delay: -83.33333ms; }\n\n.slds-spinner__dot-a:before {\n  animation-delay: 83.33333ms; }\n\n.slds-spinner__dot-b:before {\n  animation-delay: 250ms; }\n\n.slds-spinner:after {\n  animation-delay: 416.66667ms; }\n\n.slds-spinner__dot-a:after {\n  animation-delay: 583.33333ms; }\n\n.slds-spinner__dot-b:after {\n  animation-delay: 750ms; }\n\n/**\n * @summary Set a delay of 300ms on spinner\n * @selector .slds-spinner_delayed\n * @restrict .slds-spinner\n * @modifier\n * @group timing\n */\n.slds-spinner_delayed:before {\n  animation-delay: 216.66667ms; }\n\n.slds-spinner_delayed .slds-spinner__dot-a:before {\n  animation-delay: 383.33333ms; }\n\n.slds-spinner_delayed .slds-spinner__dot-b:before {\n  animation-delay: 550ms; }\n\n.slds-spinner_delayed:after {\n  animation-delay: 716.66667ms; }\n\n.slds-spinner_delayed .slds-spinner__dot-a:after {\n  animation-delay: 883.33333ms; }\n\n.slds-spinner_delayed .slds-spinner__dot-b:after {\n  animation-delay: 1050ms; }\n\n/**\n * This creates the blue brand spinner\n *\n * @selector .slds-spinner_brand\n * @restrict .slds-spinner\n * @modifier\n * @group color\n */\n.slds-spinner_brand.slds-spinner:before, .slds-spinner_brand.slds-spinner:after,\n.slds-spinner_brand .slds-spinner__dot-a:before,\n.slds-spinner_brand .slds-spinner__dot-b:before,\n.slds-spinner_brand .slds-spinner__dot-a:after,\n.slds-spinner_brand .slds-spinner__dot-b:after,\n.slds-spinner--brand.slds-spinner:before,\n.slds-spinner--brand.slds-spinner:after,\n.slds-spinner--brand .slds-spinner__dot-a:before,\n.slds-spinner--brand .slds-spinner__dot-b:before,\n.slds-spinner--brand .slds-spinner__dot-a:after,\n.slds-spinner--brand .slds-spinner__dot-b:after {\n  background-color: #1589ee; }\n\n/**\n * This creates the inverse spinner\n *\n * @selector .slds-spinner_inverse\n * @restrict .slds-spinner\n */\n.slds-spinner_inverse.slds-spinner:before, .slds-spinner_inverse.slds-spinner:after,\n.slds-spinner_inverse .slds-spinner__dot-a:before,\n.slds-spinner_inverse .slds-spinner__dot-b:before,\n.slds-spinner_inverse .slds-spinner__dot-a:after,\n.slds-spinner_inverse .slds-spinner__dot-b:after,\n.slds-spinner--inverse.slds-spinner:before,\n.slds-spinner--inverse.slds-spinner:after,\n.slds-spinner--inverse .slds-spinner__dot-a:before,\n.slds-spinner--inverse .slds-spinner__dot-b:before,\n.slds-spinner--inverse .slds-spinner__dot-a:after,\n.slds-spinner--inverse .slds-spinner__dot-b:after {\n  background-color: white; }\n\n/**\n * This is the extra extra small spinner\n *\n * @selector .slds-spinner_xx-small\n * @restrict .slds-spinner\n * @modifier\n * @group size\n */\n.slds-spinner_xx-small,\n.slds-spinner--xx-small {\n  width: 0.5rem; }\n\n.slds-spinner_xx-small.slds-spinner:before, .slds-spinner_xx-small.slds-spinner:after,\n.slds-spinner_xx-small .slds-spinner__dot-a:before,\n.slds-spinner_xx-small .slds-spinner__dot-b:before,\n.slds-spinner_xx-small .slds-spinner__dot-a:after,\n.slds-spinner_xx-small .slds-spinner__dot-b:after,\n.slds-spinner--xx-small.slds-spinner:before,\n.slds-spinner--xx-small.slds-spinner:after,\n.slds-spinner--xx-small .slds-spinner__dot-a:before,\n.slds-spinner--xx-small .slds-spinner__dot-b:before,\n.slds-spinner--xx-small .slds-spinner__dot-a:after,\n.slds-spinner--xx-small .slds-spinner__dot-b:after {\n  width: 0.125rem;\n  height: 0.125rem; }\n\n.slds-spinner_xx-small.slds-spinner:before,\n.slds-spinner_xx-small .slds-spinner__dot-a:before,\n.slds-spinner_xx-small .slds-spinner__dot-b:before,\n.slds-spinner--xx-small.slds-spinner:before,\n.slds-spinner--xx-small .slds-spinner__dot-a:before,\n.slds-spinner--xx-small .slds-spinner__dot-b:before {\n  top: -0.0625rem;\n  left: -0.0625rem;\n  animation-name: dotsBounceBefore-extraExtraSmall; }\n\n.slds-spinner_xx-small.slds-spinner:after,\n.slds-spinner_xx-small .slds-spinner__dot-a:after,\n.slds-spinner_xx-small .slds-spinner__dot-b:after,\n.slds-spinner--xx-small.slds-spinner:after,\n.slds-spinner--xx-small .slds-spinner__dot-a:after,\n.slds-spinner--xx-small .slds-spinner__dot-b:after {\n  top: -0.0625rem;\n  right: -0.0625rem;\n  animation-name: dotsBounceAfter-extraExtraSmall; }\n\n@keyframes dotsBounceBefore-extraExtraSmall {\n  60% {\n    transform: translateX(0);\n    animation-timing-function: cubic-bezier(0.275, 0.0425, 0.34, 0.265); }\n  80% {\n    animation-timing-function: cubic-bezier(0, 0.555, 0.35, 0.715);\n    transform: translateX(-0.125rem); }\n  100% {\n    transform: translateX(0); } }\n\n@keyframes dotsBounceAfter-extraExtraSmall {\n  60% {\n    animation-timing-function: cubic-bezier(0.275, 0.0425, 0.34, 0.265);\n    transform: translateX(0); }\n  80% {\n    animation-timing-function: cubic-bezier(0, 0.555, 0.35, 0.715);\n    transform: translateX(0.125rem); }\n  100% {\n    transform: translateX(0); } }\n\n/**\n * This is the extra small spinner\n *\n * @selector .slds-spinner_x-small\n * @restrict .slds-spinner\n * @modifier\n * @group size\n */\n.slds-spinner_x-small,\n.slds-spinner--x-small {\n  width: 1rem; }\n\n.slds-spinner_x-small.slds-spinner:before, .slds-spinner_x-small.slds-spinner:after,\n.slds-spinner_x-small .slds-spinner__dot-a:before,\n.slds-spinner_x-small .slds-spinner__dot-b:before,\n.slds-spinner_x-small .slds-spinner__dot-a:after,\n.slds-spinner_x-small .slds-spinner__dot-b:after,\n.slds-spinner--x-small.slds-spinner:before,\n.slds-spinner--x-small.slds-spinner:after,\n.slds-spinner--x-small .slds-spinner__dot-a:before,\n.slds-spinner--x-small .slds-spinner__dot-b:before,\n.slds-spinner--x-small .slds-spinner__dot-a:after,\n.slds-spinner--x-small .slds-spinner__dot-b:after {\n  width: 0.25rem;\n  height: 0.25rem; }\n\n.slds-spinner_x-small.slds-spinner:before,\n.slds-spinner_x-small .slds-spinner__dot-a:before,\n.slds-spinner_x-small .slds-spinner__dot-b:before,\n.slds-spinner--x-small.slds-spinner:before,\n.slds-spinner--x-small .slds-spinner__dot-a:before,\n.slds-spinner--x-small .slds-spinner__dot-b:before {\n  top: -0.125rem;\n  left: -0.125rem;\n  animation-name: dotsBounceBefore-extraSmall; }\n\n.slds-spinner_x-small.slds-spinner:after,\n.slds-spinner_x-small .slds-spinner__dot-a:after,\n.slds-spinner_x-small .slds-spinner__dot-b:after,\n.slds-spinner--x-small.slds-spinner:after,\n.slds-spinner--x-small .slds-spinner__dot-a:after,\n.slds-spinner--x-small .slds-spinner__dot-b:after {\n  top: -0.125rem;\n  right: -0.125rem;\n  animation-name: dotsBounceAfter-extraSmall; }\n\n@keyframes dotsBounceBefore-extraSmall {\n  60% {\n    transform: translateX(0);\n    animation-timing-function: cubic-bezier(0.55, 0.085, 0.68, 0.53); }\n  80% {\n    animation-timing-function: cubic-bezier(0, 1.11, 0.7, 1.43);\n    transform: translateX(-0.25rem); }\n  100% {\n    transform: translateX(0); } }\n\n@keyframes dotsBounceAfter-extraSmall {\n  60% {\n    animation-timing-function: cubic-bezier(0.55, 0.085, 0.68, 0.53);\n    transform: translateX(0); }\n  80% {\n    animation-timing-function: cubic-bezier(0, 1.11, 0.7, 1.43);\n    transform: translateX(0.25rem); }\n  100% {\n    transform: translateX(0); } }\n\n/**\n * This is the small spinner\n *\n * @selector .slds-spinner_small\n * @restrict .slds-spinner\n * @modifier\n * @group size\n */\n.slds-spinner_small,\n.slds-spinner--small {\n  width: 1.25rem; }\n\n.slds-spinner_small.slds-spinner:before, .slds-spinner_small.slds-spinner:after,\n.slds-spinner_small .slds-spinner__dot-a:before,\n.slds-spinner_small .slds-spinner__dot-b:before,\n.slds-spinner_small .slds-spinner__dot-a:after,\n.slds-spinner_small .slds-spinner__dot-b:after,\n.slds-spinner--small.slds-spinner:before,\n.slds-spinner--small.slds-spinner:after,\n.slds-spinner--small .slds-spinner__dot-a:before,\n.slds-spinner--small .slds-spinner__dot-b:before,\n.slds-spinner--small .slds-spinner__dot-a:after,\n.slds-spinner--small .slds-spinner__dot-b:after {\n  width: 0.25rem;\n  height: 0.25rem; }\n\n.slds-spinner_small.slds-spinner:before,\n.slds-spinner_small .slds-spinner__dot-a:before,\n.slds-spinner_small .slds-spinner__dot-b:before,\n.slds-spinner--small.slds-spinner:before,\n.slds-spinner--small .slds-spinner__dot-a:before,\n.slds-spinner--small .slds-spinner__dot-b:before {\n  top: -0.125rem;\n  left: -0.125rem;\n  animation-name: dotsBounceBefore-small; }\n\n.slds-spinner_small.slds-spinner:after,\n.slds-spinner_small .slds-spinner__dot-a:after,\n.slds-spinner_small .slds-spinner__dot-b:after,\n.slds-spinner--small.slds-spinner:after,\n.slds-spinner--small .slds-spinner__dot-a:after,\n.slds-spinner--small .slds-spinner__dot-b:after {\n  top: -0.125rem;\n  right: -0.125rem;\n  animation-name: dotsBounceAfter-small; }\n\n@keyframes dotsBounceBefore-small {\n  60% {\n    transform: translateX(0);\n    animation-timing-function: cubic-bezier(0.55, 0.085, 0.68, 0.53); }\n  80% {\n    animation-timing-function: cubic-bezier(0, 1.11, 0.7, 1.43);\n    transform: translateX(-0.375rem); }\n  100% {\n    transform: translateX(0); } }\n\n@keyframes dotsBounceAfter-small {\n  60% {\n    animation-timing-function: cubic-bezier(0.55, 0.085, 0.68, 0.53);\n    transform: translateX(0); }\n  80% {\n    animation-timing-function: cubic-bezier(0, 1.11, 0.7, 1.43);\n    transform: translateX(0.375rem); }\n  100% {\n    transform: translateX(0); } }\n\n/**\n * This is the medium spinner\n *\n * @selector .slds-spinner_medium\n * @restrict .slds-spinner\n * @modifier\n * @group size\n */\n.slds-spinner_medium,\n.slds-spinner--medium {\n  width: 2rem; }\n\n.slds-spinner_medium.slds-spinner:before, .slds-spinner_medium.slds-spinner:after,\n.slds-spinner_medium .slds-spinner__dot-a:before,\n.slds-spinner_medium .slds-spinner__dot-b:before,\n.slds-spinner_medium .slds-spinner__dot-a:after,\n.slds-spinner_medium .slds-spinner__dot-b:after,\n.slds-spinner--medium.slds-spinner:before,\n.slds-spinner--medium.slds-spinner:after,\n.slds-spinner--medium .slds-spinner__dot-a:before,\n.slds-spinner--medium .slds-spinner__dot-b:before,\n.slds-spinner--medium .slds-spinner__dot-a:after,\n.slds-spinner--medium .slds-spinner__dot-b:after {\n  width: 0.5rem;\n  height: 0.5rem; }\n\n.slds-spinner_medium.slds-spinner:before,\n.slds-spinner_medium .slds-spinner__dot-a:before,\n.slds-spinner_medium .slds-spinner__dot-b:before,\n.slds-spinner--medium.slds-spinner:before,\n.slds-spinner--medium .slds-spinner__dot-a:before,\n.slds-spinner--medium .slds-spinner__dot-b:before {\n  animation-name: dotsBounceBefore-medium;\n  top: -0.25rem;\n  left: -0.25rem; }\n\n.slds-spinner_medium.slds-spinner:after,\n.slds-spinner_medium .slds-spinner__dot-a:after,\n.slds-spinner_medium .slds-spinner__dot-b:after,\n.slds-spinner--medium.slds-spinner:after,\n.slds-spinner--medium .slds-spinner__dot-a:after,\n.slds-spinner--medium .slds-spinner__dot-b:after {\n  animation-name: dotsBounceAfter-medium;\n  top: -0.25rem;\n  right: -0.25rem; }\n\n@keyframes dotsBounceBefore-medium {\n  60% {\n    transform: translateX(0);\n    animation-timing-function: cubic-bezier(0.55, 0.085, 0.68, 0.53); }\n  80% {\n    animation-timing-function: cubic-bezier(0, 1.11, 0.7, 1.43);\n    transform: translateX(-0.5rem); }\n  100% {\n    transform: translateX(0); } }\n\n@keyframes dotsBounceAfter-medium {\n  60% {\n    animation-timing-function: cubic-bezier(0.55, 0.085, 0.68, 0.53);\n    transform: translateX(0); }\n  80% {\n    animation-timing-function: cubic-bezier(0, 1.11, 0.7, 1.43);\n    transform: translateX(0.5rem); }\n  100% {\n    transform: translateX(0); } }\n\n/**\n * This is the large spinner\n *\n * @selector .slds-spinner_large\n * @restrict .slds-spinner\n * @modifier\n * @group size\n */\n.slds-spinner_large,\n.slds-spinner--large {\n  width: 2.75rem; }\n\n.slds-spinner_large.slds-spinner:before, .slds-spinner_large.slds-spinner:after,\n.slds-spinner_large .slds-spinner__dot-a:before,\n.slds-spinner_large .slds-spinner__dot-b:before,\n.slds-spinner_large .slds-spinner__dot-a:after,\n.slds-spinner_large .slds-spinner__dot-b:after,\n.slds-spinner--large.slds-spinner:before,\n.slds-spinner--large.slds-spinner:after,\n.slds-spinner--large .slds-spinner__dot-a:before,\n.slds-spinner--large .slds-spinner__dot-b:before,\n.slds-spinner--large .slds-spinner__dot-a:after,\n.slds-spinner--large .slds-spinner__dot-b:after {\n  width: 0.625rem;\n  height: 0.625rem; }\n\n.slds-spinner_large.slds-spinner:before,\n.slds-spinner_large .slds-spinner__dot-a:before,\n.slds-spinner_large .slds-spinner__dot-b:before,\n.slds-spinner--large.slds-spinner:before,\n.slds-spinner--large .slds-spinner__dot-a:before,\n.slds-spinner--large .slds-spinner__dot-b:before {\n  animation-name: dotsBounceBefore-medium;\n  top: -0.3125rem;\n  left: -0.3125rem; }\n\n.slds-spinner_large.slds-spinner:after,\n.slds-spinner_large .slds-spinner__dot-a:after,\n.slds-spinner_large .slds-spinner__dot-b:after,\n.slds-spinner--large.slds-spinner:after,\n.slds-spinner--large .slds-spinner__dot-a:after,\n.slds-spinner--large .slds-spinner__dot-b:after {\n  animation-name: dotsBounceAfter-medium;\n  top: -0.3125rem;\n  right: -0.3125rem; }\n\n@keyframes dotsBounceBefore-large {\n  60% {\n    transform: translateX(0);\n    animation-timing-function: cubic-bezier(0.55, 0.085, 0.68, 0.53); }\n  80% {\n    animation-timing-function: cubic-bezier(0, 1.11, 0.7, 1.43);\n    transform: translateX(-0.75rem); }\n  100% {\n    transform: translateX(0); } }\n\n@keyframes dotsBounceAfter-large {\n  60% {\n    animation-timing-function: cubic-bezier(0.55, 0.085, 0.68, 0.53);\n    transform: translateX(0); }\n  80% {\n    animation-timing-function: cubic-bezier(0, 1.11, 0.7, 1.43);\n    transform: translateX(0.75rem); }\n  100% {\n    transform: translateX(0); } }\n\n/**\n * @summary Wrapper of split view\n *\n * @name base\n * @selector .slds-split-view_container\n * @restrict div\n * @variant\n */\n.slds-split-view_container {\n  position: relative;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n      flex-direction: column;\n  min-width: 0;\n  /**\n   * @summary Modifier to rotate the left arrow icon on close\n   * @selector .slds-is-closed\n   * @restrict .slds-split-view_container, .slds-split-view__toggle-button\n   * @modifier\n   * @group toggle\n   */\n  /**\n   * @summary Toggles open/close state of split view container\n   * @selector .slds-is-open\n   * @restrict .slds-split-view_container, .slds-split-view__toggle-button\n   * @modifier\n   * @group toggle\n   */ }\n\n.slds-split-view_container.slds-is-closed .slds-split-view {\n  display: none; }\n\n.slds-split-view_container.slds-is-closed .slds-split-view__toggle-button .slds-button__icon {\n  transform: rotate(180deg); }\n\n.slds-split-view_container.slds-is-open {\n  -ms-flex: 1 1 auto;\n      flex: 1 1 auto; }\n\n.slds-split-view_container.slds-is-open .slds-split-view {\n  display: inherit; }\n\n.slds-split-view_container.slds-is-open .slds-split-view__toggle-button .slds-button__icon {\n  transform: rotate(0); }\n\n/**\n * @selector .slds-split-view\n * @restrict .slds-split-view_container article\n */\n.slds-split-view {\n  background: #fafaf9;\n  color: #706e6b; }\n\n/**\n * @summary Header of split view\n * @selector .slds-split-view__header\n * @restrict .slds-split-view header\n * @notes Contains elements such as the list filter, view switcher and refresh button\n */\n.slds-split-view__header {\n  padding: 1rem 1rem 0.5rem 1.5rem; }\n\n/**\n * @summary Column headers\n * @selector .slds-split-view__list-header\n * @restrict .slds-split-view div\n */\n.slds-split-view__list-header {\n  border-top: 1px solid #dddbda;\n  border-bottom: 1px solid #dddbda;\n  padding: 0.5rem 1rem 0.5rem 1.5rem; }\n\n/**\n * @summary Each row of the list of split view\n * @selector .slds-split-view__list-item\n * @restrict .slds-split-view li\n */\n.slds-split-view__list-item {\n  display: -ms-flexbox;\n  display: flex;\n  position: relative;\n  border-bottom: 1px solid #dddbda;\n  font-size: 0.75rem; }\n\n.slds-split-view__list-item:hover, .slds-split-view__list-item:focus {\n  background: white; }\n\n.slds-split-view__list-item .slds-indicator_unread,\n.slds-split-view__list-item .slds-indicator--unread {\n  background: #1589ee; }\n\n/**\n * @summary Unread states\n * @selector .slds-indicator_unread\n * @restrict .slds-split-view__list-item abbr\n */\n.slds-indicator_unread,\n.slds-indicator--unread {\n  width: 8px;\n  height: 8px;\n  position: absolute;\n  top: 1rem;\n  left: 0.5rem;\n  display: block;\n  border-radius: 50%;\n  background: #c23934; }\n\n/**\n * @summary Actionable row of split view\n * @selector .slds-split-view__list-item-action\n * @restrict .slds-split-view__list-item a\n */\n.slds-split-view__list-item-action {\n  color: currentColor;\n  padding: 0.75rem 1rem 0.75rem 1.5rem; }\n\n.slds-split-view__list-item-action:hover, .slds-split-view__list-item-action:focus {\n  outline: none;\n  background: white;\n  color: currentColor;\n  text-decoration: none; }\n\n.slds-split-view__list-item-action:focus {\n  box-shadow: inset 0 0 0 1px #1589ee; }\n\n.slds-split-view__list-item-action[aria-selected=\"true\"] {\n  box-shadow: inset 4px 0 0 #0070d2; }\n\n.slds-split-view__list-item-action[aria-selected=\"true\"]:focus {\n  box-shadow: inset 4px 0 0 #0070d2, inset 0 0 0 1px #0070d2; }\n\n/**\n * @summary Expand/Collapse button to toggle open/close state of split view\n * @selector .slds-split-view__toggle-button\n * @restrict .slds-split-view_container button\n */\n.slds-split-view__toggle-button {\n  position: absolute;\n  right: -0.75rem;\n  height: 100%;\n  width: 0.75rem;\n  background: white;\n  border-radius: 0;\n  border: 1px solid #dddbda; }\n\n.slds-split-view__toggle-button:hover, .slds-split-view__toggle-button:focus {\n  background: white; }\n\n.slds-split-view__toggle-button.slds-is-closed .slds-button__icon {\n  transform: rotate(180deg); }\n\n/**\n * @summary Initializes tile\n *\n * @name base\n * @selector .slds-tile\n * @restrict article\n * @variant\n */\n.slds-tile {\n  /**\n   * @selector .slds-tile__detail\n   * @restrict .slds-tile div\n   */\n  /**\n   * @selector .slds-tile__meta\n   * @restrict .slds-tile div\n   */ }\n\n.slds-tile + .slds-tile {\n  margin-top: 0.5rem; }\n\n.slds-tile__detail {\n  position: relative; }\n\n.slds-tile__meta {\n  color: #3e3e3c; }\n\n.slds-tile_board,\n.slds-tile--board {\n  position: relative; }\n\n.slds-tile_board__icon,\n.slds-tile--board__icon {\n  width: 1rem;\n  height: 1rem;\n  position: absolute;\n  bottom: 0.25rem;\n  right: 0.25rem; }\n\n.slds-tile_board .slds-has-alert,\n.slds-tile--board .slds-has-alert {\n  padding-right: 1.5rem; }\n\n/**\n * The default tab set style encapsulates everything that is underneath it\n * without enclosing it visually. Initialize a default tab set by applying the\n * `.slds-tab_default` class to the containing `<div>` around the tab list and\n * tab panels. The `<ul>` element also requires the class `.slds-tab_default__nav`\n * to prevent styles from bleeding into nested tabs.\n *\n * The overflow tab style is provided as a tab item type that acts as a menu\n * component and appears as a tab item. It could contain those tab items that\n * don't all fit in a horizontal orientation. Initialize a default tab set and\n * in the last tab item of the set, apply the additional classes `slds-dropdown-trigger`\n * and `.slds-tabs__item_overflow`. Include an `<a>` element to contain the\n * tab item label like the other tab items. After the `<a>` element, the\n * `.slds-dropdown` segment of a search overflow menu component is used. The\n * `slds-dropdown__list` element also then requires a `slds-dropdown_length-X`\n * class, where X is the number of items to show in it.\n *\n * @summary Initializes a default tablist\n *\n * @name base\n * @selector .slds-tabs_default\n * @restrict div\n * @variant\n */\n.slds-tabs_default,\n.slds-tabs--default {\n  display: block;\n  width: 100%;\n  background-color: white;\n  /**\n   * @summary Creates the container for the default tabs\n   * @selector .slds-tabs_default__nav\n   * @restrict .slds-tabs_default ul\n   */\n  /**\n   * @summary A tab item that has an overflow menu\n   * @selector .slds-tabs__item_overflow\n   * @restrict .slds-tabs_default__item\n   */ }\n\n.slds-tabs_default__nav,\n.slds-tabs--default__nav {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: start;\n      align-items: flex-start;\n  border-bottom: 2px solid #dddbda; }\n\n@media (min-width: 48em) {\n  .slds-tabs_default .slds-tabs__item + .slds-tabs__item,\n  .slds-tabs--default .slds-tabs__item + .slds-tabs__item {\n    margin-left: 1.5rem; } }\n\n.slds-tabs_default .slds-tabs__item > a,\n.slds-tabs--default .slds-tabs__item > a {\n  max-width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  display: block;\n  text-decoration: none;\n  cursor: pointer;\n  height: 2.5rem;\n  line-height: 2.5rem;\n  border-bottom: 2px solid transparent;\n  padding: 0 0.5rem;\n  color: #706e6b; }\n\n.slds-tabs_default .slds-tabs__item > a:focus,\n.slds-tabs--default .slds-tabs__item > a:focus {\n  outline: 0; }\n\n@media (min-width: 48em) {\n  .slds-tabs_default .slds-tabs__item > a,\n  .slds-tabs--default .slds-tabs__item > a {\n    padding: 0 1rem; } }\n\n.slds-tabs_default .slds-tabs__item > a:hover, .slds-tabs_default .slds-tabs__item > a:focus,\n.slds-tabs--default .slds-tabs__item > a:hover,\n.slds-tabs--default .slds-tabs__item > a:focus {\n  text-decoration: none;\n  border-color: #0070d2;\n  color: #3e3e3c; }\n\n.slds-tabs_default .slds-tabs__item.slds-active a,\n.slds-tabs--default .slds-tabs__item.slds-active a {\n  border-color: #1589ee;\n  color: #3e3e3c; }\n\n.slds-tabs_default .slds-tabs__item.slds-active a:focus,\n.slds-tabs--default .slds-tabs__item.slds-active a:focus {\n  color: #0070d2; }\n\n.slds-tabs_default > .slds-tabs__content,\n.slds-tabs--default > .slds-tabs__content {\n  position: relative;\n  padding: 1rem 0; }\n\n.slds-tabs_default .slds-tabs__item_overflow,\n.slds-tabs_default .slds-tabs__item--overflow,\n.slds-tabs--default .slds-tabs__item_overflow,\n.slds-tabs--default .slds-tabs__item--overflow {\n  overflow: visible; }\n\n/**\n * @summary Styles each list item as a single tab\n * @selector .slds-tabs_default__item\n * @restrict .slds-tabs_default ul li\n */\n.slds-tabs_default__item,\n.slds-tabs--default__item {\n  color: #706e6b;\n  position: relative;\n  padding: 0 0.75rem;\n  margin-bottom: -2px;\n  text-transform: uppercase;\n  letter-spacing: 0.0625em;\n  /**\n   * @summary Active state for a tab item\n   * @selector .slds-is-active\n   * @restrict .slds-tabs_default__item\n   * @notes Required on the `<li>` element that is associated with the active tab panel\n   * @modifier\n   */\n  /**\n   * @summary Focus state for a tab item\n   * @selector .slds-has-focus\n   * @restrict .slds-tabs_default__item\n   * @modifier\n   */\n  /**\n  * @summary Creates styles for a Tab Item when its tab has new activity in\n  * @selector .slds-has-notification\n  * @restrict .slds-tabs_default__item, .slds-dropdown__item\n  */\n  /**\n   * @summary Creates styles for a Tab Item when its in an unsaved or dirty state\n   * @selector .slds-is-unsaved\n   * @restrict .slds-tabs_default__item\n   */ }\n\n.slds-tabs_default__item:after,\n.slds-tabs--default__item:after {\n  display: block;\n  content: '';\n  bottom: 0;\n  left: 0;\n  right: 0;\n  position: absolute;\n  height: 2px; }\n\n.slds-tabs_default__item.slds-active, .slds-tabs_default__item.slds-is-active,\n.slds-tabs--default__item.slds-active,\n.slds-tabs--default__item.slds-is-active {\n  color: #3e3e3c; }\n\n.slds-tabs_default__item.slds-active:after, .slds-tabs_default__item.slds-is-active:after,\n.slds-tabs--default__item.slds-active:after,\n.slds-tabs--default__item.slds-is-active:after {\n  background-color: #1589ee; }\n\n.slds-tabs_default__item.slds-active .slds-tabs_default__link,\n.slds-tabs_default__item.slds-active .slds-tabs--default__link, .slds-tabs_default__item.slds-is-active .slds-tabs_default__link,\n.slds-tabs_default__item.slds-is-active .slds-tabs--default__link,\n.slds-tabs--default__item.slds-active .slds-tabs_default__link,\n.slds-tabs--default__item.slds-active .slds-tabs--default__link,\n.slds-tabs--default__item.slds-is-active .slds-tabs_default__link,\n.slds-tabs--default__item.slds-is-active .slds-tabs--default__link {\n  font-weight: 700; }\n\n.slds-tabs_default__item.slds-active .slds-tabs_default__link:hover,\n.slds-tabs_default__item.slds-active .slds-tabs--default__link:hover, .slds-tabs_default__item.slds-is-active .slds-tabs_default__link:hover,\n.slds-tabs_default__item.slds-is-active .slds-tabs--default__link:hover,\n.slds-tabs--default__item.slds-active .slds-tabs_default__link:hover,\n.slds-tabs--default__item.slds-active .slds-tabs--default__link:hover,\n.slds-tabs--default__item.slds-is-active .slds-tabs_default__link:hover,\n.slds-tabs--default__item.slds-is-active .slds-tabs--default__link:hover {\n  color: #005fb2; }\n\n.slds-tabs_default__item:hover:after,\n.slds-tabs--default__item:hover:after {\n  background-color: #007add; }\n\n.slds-tabs_default__item:focus, .slds-tabs_default__item.slds-has-focus,\n.slds-tabs--default__item:focus,\n.slds-tabs--default__item.slds-has-focus {\n  outline: 0;\n  color: #0070d2; }\n\n.slds-tabs_default__item:focus:after, .slds-tabs_default__item.slds-has-focus:after,\n.slds-tabs--default__item:focus:after,\n.slds-tabs--default__item.slds-has-focus:after {\n  height: 3px;\n  background-color: #1589ee; }\n\n.slds-tabs_default__item .slds-tabs_default__link:focus,\n.slds-tabs_default__item .slds-tabs--default__link:focus,\n.slds-tabs--default__item .slds-tabs_default__link:focus,\n.slds-tabs--default__item .slds-tabs--default__link:focus {\n  box-shadow: none; }\n\n.slds-tabs_default__item.slds-has-notification,\n.slds-tabs--default__item.slds-has-notification {\n  background: #f3f2f2; }\n\n.slds-tabs_default__item.slds-has-notification:after,\n.slds-tabs--default__item.slds-has-notification:after {\n  background-color: #dddbda; }\n\n.slds-tabs_default__item.slds-has-notification:hover:after,\n.slds-tabs--default__item.slds-has-notification:hover:after {\n  background-color: #0070d2; }\n\n.slds-tabs_default__item.slds-has-notification .slds-indicator_unread,\n.slds-tabs--default__item.slds-has-notification .slds-indicator_unread {\n  display: inline-block;\n  height: 0.375rem;\n  width: 0.375rem;\n  position: relative;\n  top: auto;\n  left: auto; }\n\n.slds-tabs_default__item.slds-is-unsaved .slds-indicator_unread,\n.slds-tabs--default__item.slds-is-unsaved .slds-indicator_unread {\n  margin-left: -0.35rem; }\n\n.slds-tabs_default__item.slds-has-notification .slds-indicator_unsaved,\n.slds-tabs--default__item.slds-has-notification .slds-indicator_unsaved {\n  top: -0.25rem; }\n\n/**\n * @summary Styles each actionable element inside each tab item\n * @selector .slds-tabs_default__link\n * @restrict .slds-tabs_default__item a, .slds-tabs_default__item button\n */\n.slds-tabs_default__link,\n.slds-tabs--default__link {\n  max-width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  display: block;\n  text-decoration: none;\n  cursor: pointer;\n  height: 2.5rem;\n  line-height: 2.5rem;\n  color: currentColor;\n  border: 0; }\n\n.slds-tabs_default__link:focus,\n.slds-tabs--default__link:focus {\n  outline: 0; }\n\n.slds-tabs_default__link:hover, .slds-tabs_default__link:focus,\n.slds-tabs--default__link:hover,\n.slds-tabs--default__link:focus {\n  text-decoration: none;\n  box-shadow: none; }\n\n/**\n * @summary Styles each tab content wrapper\n * @selector .slds-tabs_default__content\n * @restrict .slds-tabs_default div\n */\n.slds-tabs_default__content,\n.slds-tabs--default__content {\n  position: relative;\n  padding: 1rem 0; }\n\n/**\n * A scoped tabset style has a closed container with a defined border. Initialize\n * a scoped tab set by applying the `.slds-tab_scoped` class to the containing\n * `<div>` around the tab list and tab panels. The `<ul>` element also requires\n * the class `.slds-tab_scoped__nav` to prevent styles from bleeding into nested tabs.\n *\n * @summary Initializes scoped tabs\n *\n * @name base\n * @selector .slds-tabs_scoped\n * @restrict div\n * @required\n * @variant\n */\n.slds-tabs_scoped,\n.slds-tabs--scoped {\n  display: block;\n  width: 100%;\n  /**\n   * Creates the container for the default tabs\n   *\n   * @selector .slds-tabs_scoped__nav\n   * @restrict .slds-tabs_scoped ul\n   * @required\n   */ }\n\n.slds-tabs_scoped__nav,\n.slds-tabs--scoped__nav {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: start;\n      align-items: flex-start;\n  background-color: #f3f2f2;\n  border: 1px solid #dddbda;\n  border-radius: 0.25rem 0.25rem 0 0; }\n\n.slds-tabs_scoped .slds-tabs__item,\n.slds-tabs--scoped .slds-tabs__item {\n  position: relative;\n  margin-bottom: -1px; }\n\n.slds-tabs_scoped .slds-tabs__item + .slds-tabs__item,\n.slds-tabs--scoped .slds-tabs__item + .slds-tabs__item {\n  margin-left: -1px; }\n\n.slds-tabs_scoped .slds-tabs__item:first-child > a,\n.slds-tabs--scoped .slds-tabs__item:first-child > a {\n  border-left: 0;\n  border-radius: 0.25rem 0 0 0; }\n\n.slds-tabs_scoped .slds-tabs__item > a,\n.slds-tabs--scoped .slds-tabs__item > a {\n  max-width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  display: block;\n  text-decoration: none;\n  cursor: pointer;\n  height: 2.5rem;\n  line-height: 2.5rem;\n  padding: 0 1.5rem;\n  color: #706e6b;\n  background-clip: padding-box;\n  border-left: 1px solid transparent;\n  border-right: 1px solid transparent; }\n\n.slds-tabs_scoped .slds-tabs__item > a:focus,\n.slds-tabs--scoped .slds-tabs__item > a:focus {\n  outline: 0; }\n\n.slds-tabs_scoped .slds-tabs__item > a:hover, .slds-tabs_scoped .slds-tabs__item > a:focus,\n.slds-tabs--scoped .slds-tabs__item > a:hover,\n.slds-tabs--scoped .slds-tabs__item > a:focus {\n  text-decoration: none;\n  color: #005fb2;\n  border-color: #dddbda; }\n\n.slds-tabs_scoped .slds-tabs__item .slds-active > a,\n.slds-tabs--scoped .slds-tabs__item .slds-active > a {\n  background-color: white;\n  color: #0070d2;\n  border-color: #dddbda; }\n\n.slds-tabs_scoped .slds-tabs__item .slds-active > a:focus,\n.slds-tabs--scoped .slds-tabs__item .slds-active > a:focus {\n  text-decoration: underline; }\n\n.slds-tabs_scoped > .slds-tabs__content,\n.slds-tabs--scoped > .slds-tabs__content {\n  background-color: white;\n  border: 1px solid #dddbda;\n  border-top: 0;\n  border-radius: 0 0 0.25rem 0.25rem;\n  padding: 1rem; }\n\n/**\n * Styles each list item as a single tab\n *\n * @selector .slds-tabs_scoped__item\n * @restrict .slds-tabs_scoped ul li\n * @required\n */\n.slds-tabs_scoped__item,\n.slds-tabs--scoped__item {\n  position: relative;\n  margin-bottom: -1px; }\n\n.slds-tabs_scoped__item + .slds-tabs_scoped__item,\n.slds-tabs_scoped__item + .slds-tabs--scoped__item,\n.slds-tabs--scoped__item + .slds-tabs_scoped__item,\n.slds-tabs--scoped__item + .slds-tabs--scoped__item {\n  margin-left: -1px; }\n\n.slds-tabs_scoped__item:first-child .slds-tabs_scoped__link,\n.slds-tabs_scoped__item:first-child .slds-tabs--scoped__link,\n.slds-tabs--scoped__item:first-child .slds-tabs_scoped__link,\n.slds-tabs--scoped__item:first-child .slds-tabs--scoped__link {\n  border-left: 0;\n  border-radius: 0.25rem 0 0 0; }\n\n/**\n * Styles each tab content wrapper\n *\n * @selector .slds-tabs_scoped__content\n * @restrict .slds-tabs_scoped div\n * @required\n */\n.slds-tabs_scoped__content,\n.slds-tabs--scoped__content {\n  background-color: white;\n  border: 1px solid #dddbda;\n  border-top: 0;\n  border-radius: 0 0 0.25rem 0.25rem;\n  padding: 1rem; }\n\n/**\n * Styles each actionable element inside each tab item\n *\n * @selector .slds-tabs_scoped__link\n * @restrict .slds-tabs_scoped__item a\n * @required\n */\n.slds-tabs_scoped__link,\n.slds-tabs--scoped__link {\n  max-width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  display: block;\n  text-decoration: none;\n  cursor: pointer;\n  height: 2.5rem;\n  line-height: 2.5rem;\n  padding: 0 1rem;\n  color: #706e6b;\n  background-clip: padding-box;\n  border-left: 1px solid transparent;\n  border-right: 1px solid transparent; }\n\n.slds-tabs_scoped__link:focus,\n.slds-tabs--scoped__link:focus {\n  outline: 0; }\n\n.slds-tabs_scoped__link:hover, .slds-tabs_scoped__link:focus,\n.slds-tabs--scoped__link:hover,\n.slds-tabs--scoped__link:focus {\n  text-decoration: none;\n  color: #0070d2;\n  border-color: #dddbda; }\n\n/**\n * Active state for a tab item\n *\n * @selector .slds-is-active\n * @restrict .slds-tabs_scoped__item\n * @notes Required on the `<li>` element that is associated with the active tab panel\n * @modifier\n */\n.slds-active .slds-tabs_scoped__link,\n.slds-active .slds-tabs--scoped__link,\n.slds-is-active .slds-tabs_scoped__link,\n.slds-is-active .slds-tabs--scoped__link {\n  background-color: white;\n  color: #0070d2;\n  border-color: #dddbda;\n  font-weight: 700; }\n\n.slds-active .slds-tabs_scoped__link:focus,\n.slds-active .slds-tabs--scoped__link:focus,\n.slds-is-active .slds-tabs_scoped__link:focus,\n.slds-is-active .slds-tabs--scoped__link:focus {\n  text-decoration: underline; }\n\n.slds-tabs__nav-scroller.slds-has-overflow {\n  position: relative;\n  padding-right: 4.7rem; }\n\n.slds-tab__scroll-controls {\n  display: none; }\n\n.slds-has-overflow .slds-tabs__nav-scroller_inner,\n.slds-has-overflow .slds-tabs__nav-scroller--inner {\n  overflow: hidden; }\n\n.slds-has-overflow .slds-tabs_scoped__nav,\n.slds-has-overflow .slds-tabs--scoped__nav,\n.slds-has-overflow .slds-tabs_default__nav,\n.slds-has-overflow .slds-tabs--default__nav {\n  border: 0; }\n\n.slds-has-overflow .slds-tab__scroll-controls {\n  display: -ms-flexbox;\n  display: flex;\n  position: absolute;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  background-color: white; }\n\n.slds-tabs_default .slds-has-overflow .slds-tabs__nav-scroller_inner,\n.slds-tabs_default .slds-has-overflow .slds-tabs__nav-scroller--inner,\n.slds-tabs--default .slds-has-overflow .slds-tabs__nav-scroller_inner,\n.slds-tabs--default .slds-has-overflow .slds-tabs__nav-scroller--inner {\n  border-bottom: 1px solid #dddbda; }\n\n.slds-tabs_default .slds-tab__scroll-controls,\n.slds-tabs--default .slds-tab__scroll-controls {\n  padding: calc(0.25rem - 1px) 1px calc(0.25rem - 1px) 0.5rem;\n  border-bottom: 1px solid #dddbda; }\n\n.slds-tabs_scoped .slds-has-overflow .slds-tabs__nav-scroller_inner,\n.slds-tabs_scoped .slds-has-overflow .slds-tabs__nav-scroller--inner,\n.slds-tabs--scoped .slds-has-overflow .slds-tabs__nav-scroller_inner,\n.slds-tabs--scoped .slds-has-overflow .slds-tabs__nav-scroller--inner {\n  border: 1px solid #dddbda;\n  border-bottom: 0;\n  border-radius: 0.25rem 0.25rem 0 0;\n  background-color: #f3f2f2; }\n\n.slds-tabs_scoped .slds-has-overflow .slds-tabs_scoped__item,\n.slds-tabs_scoped .slds-has-overflow .slds-tabs--scoped__item,\n.slds-tabs--scoped .slds-has-overflow .slds-tabs_scoped__item,\n.slds-tabs--scoped .slds-has-overflow .slds-tabs--scoped__item {\n  margin-bottom: 0;\n  border-bottom: 1px solid #dddbda; }\n\n.slds-tabs_scoped .slds-has-overflow .slds-tabs_scoped__item.slds-active,\n.slds-tabs_scoped .slds-has-overflow .slds-tabs--scoped__item.slds-active,\n.slds-tabs--scoped .slds-has-overflow .slds-tabs_scoped__item.slds-active,\n.slds-tabs--scoped .slds-has-overflow .slds-tabs--scoped__item.slds-active {\n  border-bottom-color: white; }\n\n.slds-tabs_scoped .slds-tab__scroll-controls,\n.slds-tabs--scoped .slds-tab__scroll-controls {\n  padding: calc(0.25rem - 1px) 0.25rem;\n  border: 1px solid #dddbda;\n  border-radius: 0 0.25rem 0 0; }\n\n/**\n * Sub Tabs are used to provide an additional level of navigation below the\n * Global Navigation Tab Bar. Use these tabs when users need to work across\n * multiple sub-pages within a single navigation item.\n *\n * ----\n *\n * The first tab within the Sub Tab Bar is always the default content for the\n * parent navigation item. To differentiate this tab from other sub-navigation\n * tabs, this tab cannot be closed.\n *\n * When opening a navigation item for the first time, the default sub-navigation\n * tab can be assumed; don’t show the Sub Tab Bar.\n *\n * When opening the first additional sub-navigation tab a new tab bar is inserted\n * containing both the default tab and the new sub-navigation tab.\n *\n * All sub tabs are closed when the parent navigation item is closed.\n *\n * Sub Tabs can optionally include a tab menu for additional controls.\n *\n * @summary Sub tabs\n *\n * @name sub-tabs\n * @selector .slds-sub-tabs\n * @restrict .slds-tabs_default\n * @variant\n */\n.slds-sub-tabs .slds-tabs_default__nav {\n  border-bottom-width: 1px; }\n\n/**\n * @summary Sub tab item\n * @selector .slds-sub-tabs__item\n * @restrict .slds-sub-tabs li\n */\n.slds-sub-tabs__item {\n  text-transform: none;\n  letter-spacing: 0;\n  margin-bottom: 0; }\n\n.slds-sub-tabs__item.slds-active, .slds-sub-tabs__item.slds-is-open {\n  background: rgba(21, 137, 238, 0.1); }\n\n.slds-sub-tabs__item:after {\n  content: none; }\n\n.slds-sub-tabs__item .slds-tabs_default__link:focus, .slds-sub-tabs__item.slds-has-focus {\n  text-decoration: underline; }\n\n.slds-has-pinned-regions .slds-sub-tabs__item.slds-active:before, .slds-has-pinned-regions .slds-sub-tabs__item.slds-is-open:before {\n  content: '';\n  height: 3px;\n  display: block;\n  background: #1589ee;\n  position: absolute;\n  top: 0;\n  left: -1px;\n  right: -1px; }\n\n/**\n * @name list\n * @selector .slds-nav-vertical\n * @restrict nav, fieldset\n * @variant\n */\n.slds-nav-vertical {\n  position: relative; }\n\n/**\n * Modifer to reduce spacing between navigation items\n *\n * @selector .slds-nav-vertical_compact\n * @restrict .slds-nav-vertical\n * @modifier\n */\n.slds-nav-vertical_compact .slds-nav-vertical__title,\n.slds-nav-vertical_compact .slds-nav-vertical__action {\n  padding: 0.25rem 1.5rem; }\n\n/**\n * Modifier to adjust list item when vertical navigation is sitting on top of a shaded background\n *\n * @selector .slds-nav-vertical_shade\n * @restrict .slds-nav-vertical\n * @modifier\n */\n.slds-nav-vertical_shade .slds-nav-vertical__action:hover {\n  background-color: #f3f2f2; }\n\n.slds-nav-vertical_shade .slds-nav-vertical__action:active {\n  background-color: #ecebea; }\n\n.slds-nav-vertical_shade .slds-is-active .slds-nav-vertical__action {\n  background-color: white;\n  border-color: #dddbda; }\n\n/**\n * Section title of the vertical navigation\n *\n * @selector .slds-nav-vertical__title\n * @restrict .slds-nav-vertical h2, .slds-nav-vertical legend\n */\n.slds-nav-vertical__title {\n  padding: 0.5rem 1rem;\n  padding-left: 1.5rem; }\n\n.slds-nav-vertical__title:not(:first-of-type) {\n  margin-top: 0.5rem; }\n\n.slds-nav-vertical__section:not(:first-of-type) {\n  margin-top: 0.5rem; }\n\n/**\n * List of the vertical navigation\n *\n * @selector .slds-nav-vertical__item\n * @restrict .slds-nav-vertical li, .slds-nav-vertical span\n */\n.slds-nav-vertical__item {\n  position: relative; }\n\n.slds-nav-vertical__item.slds-is-active:before {\n  content: '';\n  width: 4px;\n  left: 0;\n  top: 0;\n  bottom: 0;\n  position: absolute;\n  background: #1589ee; }\n\n/**\n * Actionable element inside of vertical navigation list item\n *\n * @selector .slds-nav-vertical__action\n * @restrict .slds-nav-vertical a, .slds-nav-vertical button, .slds-nav-vertical label\n */\n.slds-nav-vertical__action {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n      align-items: center;\n  width: 100%;\n  padding: 0.5rem 1.5rem;\n  border-top: 1px solid transparent;\n  border-bottom: 1px solid transparent;\n  border-radius: 0; }\n\n.slds-nav-vertical__action, .slds-nav-vertical__action:active, .slds-nav-vertical__action:hover, .slds-nav-vertical__action:focus {\n  color: currentColor; }\n\n.slds-nav-vertical__action:hover {\n  background-color: #f3f2f2;\n  text-decoration: none; }\n\n.slds-nav-vertical__action:focus {\n  outline: 0;\n  box-shadow: none;\n  text-decoration: underline; }\n\n.slds-nav-vertical__action:active {\n  background-color: #ecebea; }\n\n.slds-nav-vertical__action:active:focus {\n  text-decoration: none; }\n\n/**\n * Active state of a list item within a vertical navigation\n *\n * @selector .slds-is-active\n * @restrict .slds-nav-vertical__item\n * @modifier\n */\n.slds-nav-vertical__item.slds-is-active .slds-nav-vertical__action {\n  background-color: rgba(21, 137, 238, 0.1); }\n\n/**\n * @name base\n * @selector .slds-navigation-list_vertical\n * @restrict div\n * @variant\n * @deprecated\n */\n.slds-navigation-list-vertical,\n.slds-navigation-list--vertical {\n  /**\n     * Active item in vertical navigation list\n     *\n     * @selector .slds-is-active\n     * @restrict .slds-navigation-list-vertical li\n     * @modifier\n     */ }\n\n.slds-navigation-list-vertical .slds-is-active,\n.slds-navigation-list--vertical .slds-is-active {\n  color: #3e3e3c; }\n\n.slds-navigation-list-vertical .slds-is-active .slds-navigation-list-vertical__action,\n.slds-navigation-list-vertical .slds-is-active .slds-navigation-list--vertical__action,\n.slds-navigation-list--vertical .slds-is-active .slds-navigation-list-vertical__action,\n.slds-navigation-list--vertical .slds-is-active .slds-navigation-list--vertical__action {\n  background-color: rgba(21, 137, 238, 0.1);\n  border-color: #dddbda;\n  border-left-color: #1589ee; }\n\n.slds-navigation-list-vertical .slds-is-active .slds-navigation-list-vertical__action:focus,\n.slds-navigation-list-vertical .slds-is-active .slds-navigation-list--vertical__action:focus,\n.slds-navigation-list--vertical .slds-is-active .slds-navigation-list-vertical__action:focus,\n.slds-navigation-list--vertical .slds-is-active .slds-navigation-list--vertical__action:focus {\n  border-left-width: 0.5rem;\n  color: #005fb2; }\n\n/**\n   * Vertical Navigation on tinted background\n   *\n   * @selector .slds-navigation-list-vertical_shade\n   * @restrict .slds-navigation-list-vertical\n   * @modifier\n   * @group theme\n   */\n.slds-navigation-list-vertical_shade .slds-is-active .slds-navigation-list-vertical__action,\n.slds-navigation-list-vertical_shade .slds-is-active .slds-navigation-list--vertical__action,\n.slds-navigation-list-vertical--shade .slds-is-active .slds-navigation-list-vertical__action,\n.slds-navigation-list-vertical--shade .slds-is-active .slds-navigation-list--vertical__action,\n.slds-navigation-list--vertical-inverse .slds-is-active .slds-navigation-list-vertical__action,\n.slds-navigation-list--vertical-inverse .slds-is-active .slds-navigation-list--vertical__action {\n  background-color: white; }\n\n/**\n   * Actionable item inside a vertical navigation list\n   *\n   * @selector .slds-navigation-list-vertical__action\n   * @restrict .slds-navigation-list-vertical a\n   * @required\n   */\n.slds-navigation-list-vertical__action,\n.slds-navigation-list--vertical__action {\n  display: block;\n  border-left: 0.25rem solid transparent;\n  border-top: 1px solid transparent;\n  border-bottom: 1px solid transparent;\n  padding: 0.5rem 1.5rem; }\n\n.slds-navigation-list-vertical__action:hover, .slds-navigation-list-vertical__action:focus,\n.slds-navigation-list--vertical__action:hover,\n.slds-navigation-list--vertical__action:focus {\n  outline: 0;\n  background-color: #f3f2f2; }\n\n.slds-navigation-list-vertical__action:active,\n.slds-navigation-list--vertical__action:active {\n  background-color: #ecebea; }\n\n/**\n * @name radio-group\n * @summary Version of vertical nav that uses radio buttons\n * @selector .slds-nav-vertical__item [type=\"radio\"]\n * @restrict .slds-nav-vertical\n * @variant\n * @release 2.5.0\n */\n.slds-nav-vertical__item [type=\"radio\"] {\n  width: 1px;\n  height: 1px;\n  border: 0;\n  clip: rect(0 0 0 0);\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute; }\n\n.slds-nav-vertical__item [type=\"radio\"]:focus + .slds-nav-vertical__action {\n  /**\n       * Used for styling the radio button\n       *\n       * @selector .slds-nav-vertical_radio-faux\n       * @restrict .slds-nav-vertical__action span\n       */ }\n\n.slds-nav-vertical__item [type=\"radio\"]:focus + .slds-nav-vertical__action .slds-nav-vertical_radio-faux {\n  text-decoration: underline; }\n\n.slds-nav-vertical__item [type=\"radio\"]:checked + .slds-nav-vertical__action {\n  background-color: rgba(21, 137, 238, 0.1); }\n\n.slds-nav-vertical__item [type=\"radio\"]:checked + .slds-nav-vertical__action:before {\n  content: '';\n  width: 4px;\n  left: 0;\n  top: 0;\n  bottom: 0;\n  position: absolute;\n  background: #1589ee; }\n\n.slds-nav-vertical_shade .slds-nav-vertical__item [type=\"radio\"]:checked + .slds-nav-vertical__action {\n  background-color: rgba(21, 137, 238, 0.1);\n  border-color: #dddbda; }\n\n/**\n * Actionable element that toggles visibility of overflown list items\n *\n * @selector .slds-nav-vertical__action_overflow\n * @restrict .slds-nav-vertical__action\n */\n.slds-nav-vertical__action_overflow {\n  color: #706e6b; }\n\n.slds-nav-vertical__action_overflow[aria-expanded=\"true\"] .slds-button__icon {\n  transform: rotate(90deg); }\n\n/**\n * Text inside of actionable element that toggles visibility of overflown list items\n *\n * @selector .slds-nav-vertical__action-text\n * @restrict .slds-nav-vertical__action_overflow span\n */\n.slds-nav-vertical__action-text {\n  color: #0070d2; }\n\n/**\n * @summary Initializes alert notification\n *\n * @name base\n * @selector .slds-notify_alert\n * @restrict div\n * @variant\n */\n.slds-notify_alert,\n.slds-notify--alert {\n  color: white;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  -ms-flex-align: center;\n      align-items: center;\n  -ms-flex-pack: center;\n      justify-content: center;\n  position: relative;\n  background: rgba(112, 110, 107, 0.95);\n  font-weight: 300;\n  padding: 0.5rem 2rem 0.5rem 0.5rem;\n  text-align: center;\n  width: 100%;\n  /**\n   * Alert close button\n   *\n   * @selector .slds-notify__close\n   * @restrict .slds-notify button\n   */ }\n\n.slds-notify_alert a,\n.slds-notify--alert a {\n  color: currentColor; }\n\n.slds-notify_alert a:hover, .slds-notify_alert a:focus,\n.slds-notify--alert a:hover,\n.slds-notify--alert a:focus {\n  color: rgba(255, 255, 255, 0.75);\n  text-decoration: none;\n  outline: 0; }\n\n.slds-notify_alert a:active,\n.slds-notify--alert a:active {\n  color: rgba(255, 255, 255, 0.5); }\n\n.slds-notify_alert a[disabled],\n.slds-notify--alert a[disabled] {\n  color: rgba(255, 255, 255, 0.15); }\n\n.slds-notify_alert .slds-notify__close,\n.slds-notify--alert .slds-notify__close {\n  float: right;\n  position: absolute;\n  top: 50%;\n  right: 0.75rem;\n  margin-left: 0.25rem;\n  transform: translateY(-50%); }\n\n/**\n * @summary Initializes Prompt style notification\n *\n * @name base\n * @selector .slds-modal_prompt\n * @restrict .slds-modal\n * @required\n * @variant\n */\n.slds-modal_prompt .slds-modal__header,\n.slds-modal--prompt .slds-modal__header {\n  border-bottom: 0; }\n\n.slds-modal_prompt .slds-modal__content,\n.slds-modal--prompt .slds-modal__content {\n  padding-left: 2rem;\n  padding-right: 2rem; }\n\n.slds-modal_prompt .slds-modal__footer,\n.slds-modal--prompt .slds-modal__footer {\n  border-top: 0;\n  text-align: center; }\n\n.slds-modal_prompt .slds-modal__close,\n.slds-modal--prompt .slds-modal__close {\n  display: none; }\n\n/**\n * @name base\n * @selector .slds-notify_container\n * @restrict div\n * @variant\n */\n.slds-notify-container,\n.slds-notify_container {\n  position: fixed;\n  width: 100%;\n  left: 0;\n  top: 0;\n  z-index: 10000;\n  text-align: center; }\n\n/**\n * Initializes toast notification\n *\n * @selector .slds-notify_toast\n * @restrict .slds-notify_container div\n * @required\n */\n.slds-notify_toast,\n.slds-notify--toast {\n  color: white;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  -ms-flex-align: center;\n      align-items: center;\n  position: relative;\n  background: #706e6b;\n  font-weight: 300;\n  border-radius: 0.25rem;\n  margin: 0.5rem;\n  padding: 0.75rem 3rem 0.75rem 1.5rem;\n  min-width: 30rem;\n  text-align: left;\n  -ms-flex-pack: start;\n      justify-content: flex-start;\n  /**\n   * Alert close button\n   *\n   * @selector .slds-notify__close\n   * @restrict .slds-notify_toast button\n   * @required\n   */ }\n\n.slds-notify_toast a,\n.slds-notify--toast a {\n  color: currentColor; }\n\n.slds-notify_toast a:hover, .slds-notify_toast a:focus,\n.slds-notify--toast a:hover,\n.slds-notify--toast a:focus {\n  color: rgba(255, 255, 255, 0.75);\n  text-decoration: none;\n  outline: 0; }\n\n.slds-notify_toast a:active,\n.slds-notify--toast a:active {\n  color: rgba(255, 255, 255, 0.5); }\n\n.slds-notify_toast a[disabled],\n.slds-notify--toast a[disabled] {\n  color: rgba(255, 255, 255, 0.15); }\n\n.slds-notify_toast .slds-notify__close,\n.slds-notify--toast .slds-notify__close {\n  float: right;\n  position: absolute;\n  top: 0.75rem;\n  right: 0.75rem;\n  margin-left: 0.25rem;\n  transform: translateY(-0.125rem); }\n\n.slds-region_narrow .slds-notify_toast,\n.slds-region_narrow .slds-notify--toast {\n  min-width: auto;\n  width: 100%;\n  margin-left: 0; }\n\n/**\n *\n * @name base\n * @selector .slds-scoped-notification\n * @restrict div\n * @variant\n */\n.slds-scoped-notification {\n  padding: 0.75rem; }\n\n/**\n * @summary This renders a light notification\n *\n * @selector .slds-scoped-notification_light\n * @restrict .slds-scoped-notification\n * @modifier\n */\n.slds-scoped-notification_light {\n  background-color: #f3f2f2; }\n\n/**\n * @summary This renders the dark notification\n *\n * @selector .slds-scoped-notification_dark\n * @restrict .slds-scoped-notification\n * @modifier\n */\n.slds-scoped-notification_dark {\n  background-color: #706e6b;\n  color: white; }\n\n.slds-scoped-notification_dark a {\n  color: white;\n  text-decoration: underline; }\n\n.slds-scoped-notification_dark a:hover, .slds-scoped-notification_dark a:active {\n  text-decoration: none; }\n\n/**\n *\n * @selector .slds-notification-container\n * @restrict div\n */\n.slds-notification-container {\n  position: fixed;\n  display: block;\n  width: 20.5rem;\n  right: 0.25rem;\n  top: 0.25rem;\n  padding: 0.25rem 0.25rem 0.5rem;\n  z-index: 8500; }\n\n/**\n *\n * @name base\n * @selector .slds-notification\n * @restrict .slds-notification-container section, .slds-notification-container div\n * @variant\n */\n.slds-notification {\n  position: relative;\n  width: 20rem;\n  border: 1px solid #ecebea;\n  border-radius: 0.25rem;\n  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);\n  transition-duration: 0.4s;\n  transition-timing-function: ease-in-out;\n  transition-property: margin, max-height, opacity, top; }\n\n.slds-notification .slds-media__body {\n  opacity: 1;\n  transition-property: opacity;\n  transition-duration: 0.4s;\n  transition-timing-function: ease-in-out; }\n\n.slds-notification + .slds-notification {\n  margin-top: 0.5rem; }\n\n.slds-notification:nth-of-type(1) {\n  z-index: 4; }\n\n.slds-notification:nth-of-type(2) {\n  z-index: 3; }\n\n.slds-notification:nth-of-type(3) {\n  z-index: 2; }\n\n.slds-notification:nth-of-type(4) {\n  z-index: 1; }\n\n.slds-notification:nth-of-type(n+3) {\n  overflow: hidden; }\n\n.slds-notification:nth-of-type(n+4) {\n  margin-top: 0;\n  transform: scaleX(0.95) translateY(-90%); }\n\n.slds-notification:nth-of-type(n+4) .slds-media__body, .slds-notification:nth-of-type(n+5) {\n  opacity: 0; }\n\n.slds-notification:nth-of-type(n+6) {\n  display: none; }\n\n/**\n * @summary The body of the notification\n *\n * @selector .slds-notification__body\n * @restrict .slds-notification div\n */\n/**\n * @summary Main reminder component\n *\n * @selector .slds-notification__target\n * @restrict .slds-notification__body a\n */\n.slds-notification__target {\n  padding: 0.75rem;\n  border-radius: 0.25rem;\n  background-color: #f4f6f9;\n  color: #3e3e3c; }\n\n.slds-notification__target:hover, .slds-notification__target:focus {\n  background-color: white;\n  text-decoration: none; }\n\n/**\n * @summary Optional notification footer\n *\n * @selector .slds-notification__footer\n * @restrict .slds-notification div\n */\n.slds-notification__footer {\n  padding: 0.75rem 0.75rem 1rem 0.75rem; }\n\n/**\n * @summary Notification close button\n *\n * @selector .slds-notification__close\n * @restrict .slds-notification__body button\n */\n.slds-notification__close {\n  position: absolute;\n  top: 0;\n  right: 0; }\n\n.slds-modal__header .slds-notify-container,\n.slds-modal__header .slds-notify_container {\n  position: absolute; }\n\n.slds-modal__header .slds-notify_toast,\n.slds-modal__header .slds-notify--toast {\n  display: block; }\n\n/**\n * @summary Sets styles for trial header bar\n * @name header\n * @selector .slds-trial-header\n * @restrict div\n * @variant\n */\n.slds-trial-header {\n  color: white;\n  height: 3.125rem;\n  background: #061c3f;\n  padding: 0 1rem; }\n\n.slds-trial-header .slds-icon {\n  fill: currentColor; }\n\n.slds-trial-header a:not(.slds-button--neutral), .slds-trial-header button:not(.slds-button--neutral) {\n  color: currentColor; }\n\n.slds-trial-header a:not(.slds-button--neutral):hover, .slds-trial-header a:not(.slds-button--neutral):focus, .slds-trial-header button:not(.slds-button--neutral):hover, .slds-trial-header button:not(.slds-button--neutral):focus {\n  color: rgba(255, 255, 255, 0.75);\n  text-decoration: none;\n  outline: 0; }\n\n.slds-trial-header a:not(.slds-button--neutral):active, .slds-trial-header button:not(.slds-button--neutral):active {\n  color: rgba(255, 255, 255, 0.5); }\n\n.slds-trial-header a:not(.slds-button--neutral)[disabled], .slds-trial-header button:not(.slds-button--neutral)[disabled] {\n  color: rgba(255, 255, 255, 0.15); }\n\n.slds-trial-header .slds-icon_selected,\n.slds-trial-header .slds-icon--selected {\n  fill: #4bca81; }\n\n/**\n * @summary Container that manages layout when a listbox of pill options sit next to a combobox search input\n *\n * @name base\n * @selector .slds-combobox-lookup\n * @restrict div\n * @variant\n */\n.slds-lookup {\n  position: relative;\n  width: 100%;\n  /**\n   * Initializes lookup results list\n   *\n   * @selector .slds-lookup__list\n   * @restrict .slds-lookup ul\n   */\n  /**\n   * Initializes lookup results list container\n   *\n   * @selector .slds-lookup__menu\n   * @restrict .slds-lookup div\n   * @notes Applies positioning and container styles\n   * @required\n   */\n  /**\n   * Non-actionable label inside of a lookup item\n   *\n   * @selector .slds-lookup__item_label\n   * @restrict .slds-lookup h3\n   */\n  /**\n   * Actionable element inside of a lookup item\n   *\n   * @selector .slds-lookup__item-action\n   * @restrict .slds-lookup a, .slds-lookup button, .slds-lookup span\n   */\n  /**\n   * Actionable element inside of a lookup item that's output is single line text\n   *\n   * @selector .slds-lookup__item-action_label\n   * @restrict .slds-lookup__item-action\n   */\n  /**\n   * Search input inside of lookup\n   *\n   * @selector .slds-lookup__search-input\n   * @restrict .slds-lookup input\n   */\n  /**\n   * Primary entity name within lookup item\n   *\n   * @selector .slds-lookup__result-text\n   * @restrict .slds-lookup__item-action span\n   */\n  /**\n   * Secondary info of primary entity name within lookup item\n   *\n   * @selector .slds-lookup__result-meta\n   * @restrict .slds-lookup__item-action span\n   */\n  /**\n   * Deal with Lookup when user activates the lookup\n   *\n   * @selector .slds-is-open\n   * @restrict .slds-lookup\n   * @modifier\n   */\n  /**\n   * Deal with lookup if selection has been made\n   *\n   * @selector .slds-has-selection\n   * @restrict .slds-lookup\n   */ }\n\n.slds-lookup__list {\n  max-height: calc((((1.5 * 0.8125rem) + (1.5 * 0.75rem) - 0.25rem) + (0.25rem * 2)) * 8);\n  overflow-y: auto; }\n\n.slds-lookup__menu {\n  background: white;\n  border: 1px solid #dddbda;\n  border-radius: 0.25rem;\n  z-index: 7000;\n  position: absolute;\n  width: 100%;\n  padding: 0.5rem 0;\n  display: none; }\n\n.slds-lookup__item > a,\n.slds-lookup__item > span,\n.slds-lookup__item > button {\n  display: block;\n  padding: 0.5rem;\n  color: #3e3e3c;\n  text-align: left;\n  width: 100%;\n  line-height: 1.5;\n  border-radius: 0; }\n\n.slds-lookup__item > a:hover, .slds-lookup__item > a:focus,\n.slds-lookup__item > span:hover,\n.slds-lookup__item > span:focus,\n.slds-lookup__item > button:hover,\n.slds-lookup__item > button:focus {\n  outline: 0;\n  background-color: #f3f2f2;\n  color: #3e3e3c;\n  text-decoration: none; }\n\n.slds-lookup__item > a .slds-icon,\n.slds-lookup__item > span .slds-icon,\n.slds-lookup__item > button .slds-icon {\n  margin-right: 0.5rem; }\n\n.slds-lookup__item_label, .slds-lookup__item--label {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n      align-items: center;\n  padding: 0.5rem 1rem; }\n\n.slds-lookup__item-action {\n  font-size: 0.8125rem;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n      align-items: center;\n  padding: 0.25rem 1rem;\n  color: #3e3e3c;\n  text-align: left;\n  width: 100%;\n  line-height: 1.5;\n  border-radius: 0;\n  /**\n     * Hover/focus state for actionable lookup item\n     *\n     * @selector .slds-has-focus\n     * @restrict .slds-lookup__item-action\n     * @modifier\n     */ }\n\n.slds-lookup__item-action:hover, .slds-lookup__item-action:focus, .slds-lookup__item-action.slds-has-focus {\n  outline: 0;\n  cursor: pointer;\n  background-color: #f3f2f2;\n  color: #3e3e3c;\n  text-decoration: none; }\n\n.slds-lookup__item-action .slds-media__figure {\n  margin-right: 0.5rem;\n  margin-top: 0.25rem; }\n\n.slds-lookup__item-action_label, .slds-lookup__item-action--label {\n  padding: 0.5rem 1rem; }\n\n.slds-lookup__item-action_label > .slds-icon, .slds-lookup__item-action--label > .slds-icon {\n  margin-left: 0.25rem;\n  margin-right: 0.75rem; }\n\n.slds-lookup__search-input {\n  width: 100%; }\n\n.slds-lookup__result-text {\n  max-width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  display: block;\n  margin-bottom: 0.125rem; }\n\n.slds-lookup__result-meta {\n  display: block;\n  margin-top: -0.25rem;\n  color: #706e6b; }\n\n.slds-lookup__pill-container {\n  padding: 0 0.5rem 0.25rem; }\n\n.slds-lookup mark {\n  font-weight: 700;\n  background-color: transparent;\n  color: inherit; }\n\n.slds-lookup.slds-is-open .slds-lookup__menu {\n  display: block; }\n\n.slds-lookup.slds-has-selection .slds-input,\n.slds-lookup.slds-has-selection .slds-input__icon,\n.slds-lookup.slds-has-selection .slds-lookup__search-input {\n  display: none; }\n\n.slds-lookup.slds-has-selection .slds-pill {\n  display: -ms-flexbox;\n  display: flex; }\n\n.slds-lookup.slds-has-selection .slds-pill__remove {\n  margin-left: auto; }\n\n/**\n * An image is the preferred format for an avatar\n *\n * @summary Creates an avatar component\n * @name base\n * @selector .slds-avatar\n * @restrict div, span, a\n * @variant\n */\n.slds-avatar {\n  width: 2rem;\n  height: 2rem;\n  overflow: hidden;\n  display: inline-block;\n  vertical-align: middle;\n  border-radius: 0.25rem;\n  line-height: 1;\n  color: white; }\n\n.slds-avatar:hover, .slds-avatar:focus:hover {\n  color: currentColor; }\n\n/**\n * Size modifier for avatars - x-small\n *\n * @selector .slds-avatar_x-small\n * @restrict .slds-avatar\n * @modifier\n * @group size\n */\n.slds-avatar_x-small,\n.slds-avatar--x-small {\n  width: 1.25rem;\n  height: 1.25rem;\n  font-size: 0.625rem; }\n\n.slds-avatar_x-small .slds-icon,\n.slds-avatar--x-small .slds-icon {\n  width: 1.25rem;\n  height: 1.25rem; }\n\n/**\n * Size modifier for avatars - small\n *\n * @selector .slds-avatar_small\n * @restrict .slds-avatar\n * @modifier\n * @group size\n */\n.slds-avatar_small,\n.slds-avatar--small {\n  width: 1.5rem;\n  height: 1.5rem;\n  font-size: 0.625rem; }\n\n.slds-avatar_small .slds-icon,\n.slds-avatar--small .slds-icon {\n  width: 1.5rem;\n  height: 1.5rem; }\n\n/**\n * Size modifier for avatars - medium\n *\n * @selector .slds-avatar_medium\n * @restrict .slds-avatar\n * @modifier\n * @group size\n */\n.slds-avatar_medium,\n.slds-avatar--medium {\n  width: 2rem;\n  height: 2rem;\n  font-size: 0.875rem; }\n\n.slds-avatar_medium .slds-icon,\n.slds-avatar--medium .slds-icon {\n  width: 2rem;\n  height: 2rem; }\n\n/**\n * Size modifier for avatars - large\n *\n * @selector .slds-avatar_large\n * @restrict .slds-avatar\n * @modifier\n * @group size\n */\n.slds-avatar_large,\n.slds-avatar--large {\n  width: 3rem;\n  height: 3rem;\n  font-size: 1.125rem;\n  font-weight: 300;\n  line-height: 1.25; }\n\n.slds-avatar_large .slds-icon,\n.slds-avatar--large .slds-icon {\n  width: 3rem;\n  height: 3rem; }\n\n/**\n * Make avatar a circle\n *\n * @selector .slds-avatar_circle\n * @restrict .slds-avatar\n * @modifier\n */\n.slds-avatar_circle,\n.slds-avatar--circle {\n  border-radius: 50%; }\n\n.slds-avatar_empty,\n.slds-avatar--empty {\n  border: 1px dashed #dddbda; }\n\n/**\n * If an image is unavailable, up to two letters can be used instead.\n * If the record name contains two words, like first and last name, use\n * the first capitalized letter of each. For records that only have a\n * single word name, use the first two letters of that word using one\n * capital and one lower case letter. The background color should match\n * the entity or object icon. If no image or initials are available,\n * the fallback should be the icon for the entity or object.\n *\n * @summary Used for initials inside an avatar\n * @selector .slds-avatar__initials\n * @restrict .slds-avatar abbr\n */\n.slds-avatar__initials {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: center;\n      justify-content: center;\n  -ms-flex-line-pack: center;\n      align-content: center;\n  -ms-flex-align: center;\n      align-items: center;\n  margin: auto;\n  height: 100%; }\n\n.slds-avatar__initials[title] {\n  cursor: default;\n  text-decoration: none; }\n\n.slds-avatar__initials:hover {\n  color: white;\n  cursor: default; }\n\n/**\n * A figure component is a self-contained unit of content, such as an image with an optional caption. The figure component should NOT be used with icons or logos. A figure can optionally be cropped to a specific ratio such as 16x9, 4x3 and 1x1 with the use of `.slds-image__crop` and passing in a ratio class such as `.slds-image__crop_16-by-9`.\n *\n * @summary Initializes a file component\n *\n * @name base\n * @selector .slds-file\n * @restrict figure, div\n * @variant\n */\n.slds-image,\n.slds-file {\n  display: block;\n  position: relative;\n  /**\n   * Set crop boundaries to a file component, set to 16:9 by default\n   *\n   * @selector .slds-file__crop\n   * @restrict .slds-file div, .slds-file a\n   */\n  /**\n   * Image caption associated to a file\n   *\n   * @selector .slds-file__title\n   * @restrict .slds-file figcaption, .slds-file div\n   */\n  /**\n   * Hack to accomodate for text truncation next to actions menu buttons\n   *\n   * @selector .slds-file-has-actions\n   * @restrict .slds-file__title\n   */\n  /**\n   * If text sits on top of image, apply an overlay with this class\n   *\n   * @selector .slds-file_overlay\n   * @restrict .slds-file div\n   */\n  /**\n   * Change style of image to a card look\n   *\n   * @selector .slds-file_card\n   * @restrict .slds-file\n   */\n  /**\n   * When only image type is available, this class help position the file type icon\n   *\n   * @selector .slds-file__icon\n   * @restrict .slds-file div, .slds-file span\n   */\n  /**\n   * This positions the action menu on the title bar\n   *\n   * @selector .slds-file__actions-menu\n   * @restrict .slds-file div\n   */\n  /**\n   * This adds an external icon to the top left side of the card\n   *\n   * @selector .slds-file__external-icon\n   * @restrict .slds-file div\n   * @required\n   */\n  /**\n   * This changes the color of the loading icon\n   *\n   * @selector .slds-file__loading-icon\n   * @restrict .slds-file svg\n   * @required\n   */\n  /**\n   * This vertically centers the icon when there is no title bar\n   *\n   * @selector .slds-file_center-icon\n   * @restrict .slds-file\n   */ }\n\n.slds-image:hover,\n.slds-file:hover {\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n  transition: box-shadow 0.2s ease-in-out; }\n\n.slds-image:focus,\n.slds-file:focus {\n  border: 1px solid #0070d2;\n  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.16); }\n\n.slds-image__crop,\n.slds-file__crop {\n  display: block;\n  position: relative;\n  overflow: hidden;\n  padding-top: 56.25%;\n  /**\n     * Crops file to a ratio of 1:1\n     *\n     * @selector .slds-file__crop_1-by-1\n     * @restrict .slds-file__crop\n     * @modifier\n     * @group ratio\n     */\n  /**\n     * Crops file to a ratio of 16:9\n     *\n     * @selector .slds-file__crop_16-by-9\n     * @restrict .slds-file__crop\n     * @modifier\n     * @group ratio\n     */\n  /**\n     * Crops file to a ratio of 4:3\n     *\n     * @selector .slds-file__crop_4-by-3\n     * @restrict .slds-file__crop\n     * @modifier\n     * @group ratio\n     */ }\n\n.slds-image__crop img,\n.slds-file__crop img {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate3d(-50%, -50%, 0);\n  max-width: 200%; }\n\n.slds-image__crop:after,\n.slds-file__crop:after {\n  content: '';\n  display: block; }\n\n.slds-image__crop_1-by-1, .slds-image__crop--1-by-1,\n.slds-file__crop_1-by-1,\n.slds-file__crop--1-by-1 {\n  padding-top: 100%; }\n\n.slds-image__crop_16-by-9, .slds-image__crop--16-by-9,\n.slds-file__crop_16-by-9,\n.slds-file__crop--16-by-9 {\n  padding-top: 56.25%; }\n\n.slds-image__crop_4-by-3, .slds-image__crop--4-by-3,\n.slds-file__crop_4-by-3,\n.slds-file__crop--4-by-3 {\n  padding-top: 75%; }\n\n.slds-image__title,\n.slds-file__title {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n      align-items: center;\n  padding: 0.5rem;\n  /**\n     * Adds overlay to file\n     *\n     * @selector .slds-file__title_overlay\n     * @restrict .slds-file__title\n     */\n  /**\n     * Creates card title bar on file\n     *\n     * @selector .slds-file__title_card\n     * @restrict .slds-file__title\n     */\n  /**\n     * Creates gradient scrim bar on file\n     *\n     * @selector .slds-file__title_scrim\n     * @restrict .slds-file__title\n     */ }\n\n.slds-image__title_overlay, .slds-image__title--overlay,\n.slds-file__title_overlay,\n.slds-file__title--overlay {\n  color: white;\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0; }\n\n.slds-image__title_overlay .slds-media__body, .slds-image__title--overlay .slds-media__body,\n.slds-file__title_overlay .slds-media__body,\n.slds-file__title--overlay .slds-media__body {\n  z-index: 1; }\n\n.slds-image__title_card, .slds-image__title--card,\n.slds-file__title_card,\n.slds-file__title--card {\n  background: #f3f2f2;\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0; }\n\n.slds-image__title_scrim,\n.slds-file__title_scrim {\n  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.5));\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  padding: 1rem; }\n\n.slds-image-has-actions,\n.slds-file-has-actions {\n  padding-right: 3rem; }\n\n.slds-image_overlay, .slds-image--overlay,\n.slds-file_overlay,\n.slds-file--overlay {\n  content: '';\n  background: rgba(0, 0, 0, 0.4);\n  color: white;\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 1; }\n\n.slds-image_card, .slds-image--card,\n.slds-file_card,\n.slds-file--card {\n  background: white;\n  border: 1px solid rgba(0, 0, 0, 0.16); }\n\n.slds-image__icon,\n.slds-file__icon {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate3d(-50%, -50%, 0);\n  margin-top: -1rem; }\n\n.slds-image__actions-menu,\n.slds-file__actions-menu {\n  position: absolute;\n  bottom: 0.5rem;\n  right: 0.25rem; }\n\n.slds-image__external-icon,\n.slds-file__external-icon {\n  position: absolute;\n  top: 2.5rem;\n  left: 1.5rem; }\n\n.slds-image__loading-icon,\n.slds-file__loading-icon {\n  fill: #dddbda; }\n\n.slds-image_center-icon .slds-file__icon,\n.slds-file_center-icon .slds-file__icon {\n  margin-top: 0; }\n\n/**\n * @summary Initializes data table\n *\n * @name base\n * @selector .slds-table\n * @restrict table\n * @required\n * @variant\n */\n.slds-table {\n  background-color: white;\n  font-size: inherit;\n  /**\n   * Default Table Row Hover\n   *\n   * @selector .slds-no-row-hover\n   * @restrict .slds-table\n   * @modifier\n   */\n  /**\n   * Selected Table Row + Hover\n   *\n   * @selector .slds-is-selected\n   * @restrict .slds-table tr\n   * @modifier\n   */\n  /**\n   * By default, nowrap is applied\n   *\n   * @selector .slds-cell-wrap\n   * @restrict .slds-table th, .slds-table td\n   * @modifier\n   */\n  /**\n   * Use to add a left padding buffer to cells\n   *\n   * @selector .slds-cell-buffer_left\n   * @restrict .slds-table th, .slds-table td\n   * @modifier\n   */\n  /**\n   * Use to add a right padding buffer to cells\n   *\n   * @selector .slds-cell-buffer_right\n   * @restrict .slds-table th, .slds-table td\n   * @modifier\n   */\n  /**\n   * Focus state on a cell\n   *\n   * @selector .slds-has-focus\n   * @restrict .slds-table th, .slds-table td\n   * @modifier\n   */ }\n\n.slds-table th,\n.slds-table td {\n  padding: 0.25rem 0.5rem;\n  white-space: nowrap;\n  position: relative; }\n\n.slds-table th {\n  font-weight: 400; }\n\n.slds-table th:focus {\n  outline: 0; }\n\n.slds-table thead th {\n  background-color: #fafaf9;\n  color: #514f4d;\n  padding: 0.25rem 0.5rem; }\n\n.slds-table:not(.slds-no-row-hover) tbody tr:hover,\n.slds-table:not(.slds-no-row-hover) tbody tr:focus {\n  outline: 0; }\n\n.slds-table:not(.slds-no-row-hover) tbody tr:hover > td,\n.slds-table:not(.slds-no-row-hover) tbody tr:hover > th,\n.slds-table:not(.slds-no-row-hover) tbody tr:focus > td,\n.slds-table:not(.slds-no-row-hover) tbody tr:focus > th {\n  background-color: #f3f2f2; }\n\n.slds-table tbody tr.slds-is-selected > td,\n.slds-table tbody tr.slds-is-selected > th,\n.slds-table:not(.slds-no-row-hover) tr.slds-is-selected:hover > td,\n.slds-table:not(.slds-no-row-hover) tr.slds-is-selected:hover > th {\n  background-color: #ecebea; }\n\n.slds-table .slds-cell-wrap {\n  white-space: normal;\n  overflow-wrap: break-word;\n  word-wrap: break-word; }\n\n.slds-table .slds-cell-shrink {\n  width: 1%; }\n\n.slds-table .slds-cell-buffer_left,\n.slds-table .slds-cell-buffer--left {\n  padding-left: 1.5rem; }\n\n.slds-table .slds-cell-buffer_right,\n.slds-table .slds-cell-buffer--right {\n  padding-right: 1.5rem; }\n\n.slds-table tbody tr {\n  counter-increment: row-number; }\n\n.slds-table .slds-row-number:after {\n  content: counter(row-number); }\n\n.slds-table th:focus,\n.slds-table [role=\"gridcell\"]:focus {\n  outline: 0; }\n\n.slds-table th:focus,\n.slds-table th.slds-has-focus,\n.slds-table [role=\"gridcell\"]:focus,\n.slds-table [role=\"gridcell\"].slds-has-focus {\n  box-shadow: #0070d2 0 0 0 1px inset; }\n\n.slds-table th:active,\n.slds-table [role=\"gridcell\"]:active {\n  box-shadow: none; }\n\n.slds-table .slds-radio [type='radio'] + .slds-radio__label .slds-radio_faux {\n  margin-right: 0; }\n\n/**\n * Add left and right padding to the first and last cells of a table\n *\n * @selector .slds-table_cell-buffer\n * @restrict .slds-table\n * @required\n * @modifier\n */\n.slds-table_cell-buffer tr > th:first-child,\n.slds-table_cell-buffer tr > td:first-child,\n.slds-table--cell-buffer tr > th:first-child,\n.slds-table--cell-buffer tr > td:first-child {\n  padding-left: 1.5rem; }\n\n.slds-table_cell-buffer tr > th:last-child,\n.slds-table_cell-buffer tr > td:last-child,\n.slds-table--cell-buffer tr > th:last-child,\n.slds-table--cell-buffer tr > td:last-child {\n  padding-right: 1.5rem; }\n\n/**\n * Add vertical borders to a table\n *\n * @selector .slds-table_bordered\n * @restrict .slds-table\n * @modifier\n */\n.slds-table_bordered,\n.slds-table--bordered {\n  border-collapse: separate;\n  border-top: 1px solid #dddbda;\n  border-bottom: 1px solid #dddbda; }\n\n.slds-table_bordered thead > tr + tr > th,\n.slds-table--bordered thead > tr + tr > th {\n  border-top: 1px solid #dddbda; }\n\n.slds-table_bordered tbody td,\n.slds-table_bordered tbody th,\n.slds-table--bordered tbody td,\n.slds-table--bordered tbody th {\n  border-top: 1px solid #dddbda; }\n\n.slds-table_bordered:not(.slds-no-row-hover) tbody tr:hover > td:not(.slds-is-selected),\n.slds-table_bordered:not(.slds-no-row-hover) tbody tr:hover > th:not(.slds-is-selected),\n.slds-table_bordered:not(.slds-no-row-hover) tbody tr:focus > td:not(.slds-is-selected),\n.slds-table_bordered:not(.slds-no-row-hover) tbody tr:focus > th:not(.slds-is-selected),\n.slds-table--bordered:not(.slds-no-row-hover) tbody tr:hover > td:not(.slds-is-selected),\n.slds-table--bordered:not(.slds-no-row-hover) tbody tr:hover > th:not(.slds-is-selected),\n.slds-table--bordered:not(.slds-no-row-hover) tbody tr:focus > td:not(.slds-is-selected),\n.slds-table--bordered:not(.slds-no-row-hover) tbody tr:focus > th:not(.slds-is-selected) {\n  box-shadow: #dddbda 0 -1px 0 inset, #dddbda 0 1px 0 inset; }\n\n/**\n * Add column borders\n *\n * @selector .slds-table_col-bordered\n * @restrict .slds-table\n * @modifier\n */\n.slds-table_col-bordered td + td,\n.slds-table_col-bordered th + th,\n.slds-table_col-bordered th + td,\n.slds-table_col-bordered td + th,\n.slds-table--col-bordered td + td,\n.slds-table--col-bordered th + th,\n.slds-table--col-bordered th + td,\n.slds-table--col-bordered td + th {\n  border-left: 1px solid #dddbda; }\n\n/**\n * Add alternating strips to rows\n *\n * @selector .slds-table_striped\n * @restrict .slds-table\n * @modifier\n */\n.slds-table_striped tbody tr:nth-of-type(even) > td,\n.slds-table_striped tbody tr:nth-of-type(even) > th,\n.slds-table--striped tbody tr:nth-of-type(even) > td,\n.slds-table--striped tbody tr:nth-of-type(even) > th {\n  background-color: #f3f2f2; }\n\n/**\n * @summary Set table to use fixed layout for width and truncation purposes\n *\n * @name advanced\n * @selector .slds-table_fixed-layout\n * @restrict .slds-table\n * @variant\n */\n.slds-table_fixed-layout,\n.slds-table--fixed-layout {\n  table-layout: fixed;\n  width: 100%;\n  white-space: nowrap; }\n\n.slds-table_fixed-layout thead,\n.slds-table--fixed-layout thead {\n  background-color: white; }\n\n.slds-table_fixed-layout tbody,\n.slds-table--fixed-layout tbody {\n  transform: translateZ(0); }\n\n.slds-table_fixed-layout .slds-cell-shrink,\n.slds-table--fixed-layout .slds-cell-shrink {\n  width: 3rem; }\n\n.slds-table_fixed-layout .slds-cell-shrink:nth-child(n),\n.slds-table--fixed-layout .slds-cell-shrink:nth-child(n) {\n  padding-left: 0;\n  padding-right: 0; }\n\n.slds-table_fixed-layout .slds-cell-shrink:first-child,\n.slds-table--fixed-layout .slds-cell-shrink:first-child {\n  text-align: right;\n  padding-right: 0.5rem; }\n\n.slds-table_fixed-layout .slds-cell-shrink:last-child,\n.slds-table--fixed-layout .slds-cell-shrink:last-child {\n  text-align: left;\n  padding-left: 0.5rem; }\n\n/**\n * If the column is sortable, then let's handle the actionable\n * region of the `<th>` cell\n *\n * @selector .slds-is-sortable\n * @restrict .slds-table_fixed-layout th\n */\n.slds-is-sortable .slds-th__action:hover,\n.slds-is-sortable .slds-th__action:focus,\n.slds-is-sortable.slds-has-focus .slds-th__action,\n.slds-is-sortable.slds-has-focus .slds-th__action:hover,\n.slds-is-sortable.slds-has-focus .slds-th__action:focus {\n  background-color: white;\n  color: currentColor; }\n\n.slds-is-sortable .slds-th__action:hover .slds-is-sortable__icon,\n.slds-is-sortable .slds-th__action:focus .slds-is-sortable__icon,\n.slds-is-sortable.slds-has-focus .slds-th__action .slds-is-sortable__icon,\n.slds-is-sortable.slds-has-focus .slds-th__action:hover .slds-is-sortable__icon,\n.slds-is-sortable.slds-has-focus .slds-th__action:focus .slds-is-sortable__icon {\n  display: inline-block;\n  fill: #0070d2; }\n\n/**\n * Actionable area inside th\n *\n * @selector .slds-th__action\n * @restrict .slds-table_fixed-layout th div, .slds-table_fixed-layout th a\n */\n.slds-th__action {\n  display: -ms-flexbox;\n  display: flex;\n  padding: 0.25rem 0.5rem;\n  height: 2rem;\n  -ms-flex-align: center;\n      align-items: center;\n  /**\n   * Allows for alignment of form element, such as a checkbox\n   *\n   * @selector .slds-th__action_form\n   * @restrict .slds-th__action\n   */\n  /**\n   * Allows for alignment of button, such as a menu\n   *\n   * @selector .slds-th__action-button\n   * @restrict .slds-has-button-menu .slds-button_icon\n   */ }\n\n.slds-th__action:focus, .slds-th__action:hover {\n  outline: 0;\n  background-color: white; }\n\n.slds-th__action_form, .slds-th__action--form {\n  display: -ms-inline-flexbox;\n  display: inline-flex; }\n\n.slds-th__action-button {\n  position: absolute;\n  top: 50%;\n  right: 0.25rem;\n  transform: translateY(-50%); }\n\n/**\n * If the column header has a menu button, then let's add right padding to the\n * header to preserve truncation\n *\n * @selector .slds-has-button-menu\n * @restrict .slds-table_fixed-layout th\n */\n.slds-has-button-menu .slds-th__action {\n  padding-right: 1.5rem; }\n\n/**\n * Icon inside sortable th\n *\n * @selector .slds-is-sortable__icon\n * @restrict .slds-is-sortable .slds-icon\n */\n.slds-is-sortable__icon {\n  width: 0.75rem;\n  height: 0.75rem;\n  margin-left: 0.25rem;\n  display: none; }\n\n/**\n * Active state of sorted column\n *\n * @selector .slds-is-sorted\n * @restrict .slds-table_fixed-layout th\n */\n.slds-is-sorted {\n  /**\n   * Change direction of arrow\n   *\n   * @name sorted-ascending\n   * @selector .slds-is-sorted_asc\n   * @restrict .slds-is-sorted\n   * @modifier\n   */ }\n\n.slds-is-sorted .slds-is-sortable__icon {\n  display: inline-block; }\n\n.slds-is-sorted_asc .slds-is-sortable__icon,\n.slds-is-sorted--asc .slds-is-sortable__icon {\n  transform: rotate(180deg); }\n\n.slds-table_column-1-wrap tbody tr > *:nth-child(1) .slds-truncate {\n  overflow-wrap: break-word;\n  word-wrap: break-word;\n  -webkit-hyphens: none;\n      -ms-hyphens: none;\n          hyphens: none;\n  white-space: normal; }\n\n.slds-table_column-2-wrap tbody tr > *:nth-child(2) .slds-truncate {\n  overflow-wrap: break-word;\n  word-wrap: break-word;\n  -webkit-hyphens: none;\n      -ms-hyphens: none;\n          hyphens: none;\n  white-space: normal; }\n\n.slds-table_column-3-wrap tbody tr > *:nth-child(3) .slds-truncate {\n  overflow-wrap: break-word;\n  word-wrap: break-word;\n  -webkit-hyphens: none;\n      -ms-hyphens: none;\n          hyphens: none;\n  white-space: normal; }\n\n.slds-table_column-4-wrap tbody tr > *:nth-child(4) .slds-truncate {\n  overflow-wrap: break-word;\n  word-wrap: break-word;\n  -webkit-hyphens: none;\n      -ms-hyphens: none;\n          hyphens: none;\n  white-space: normal; }\n\n.slds-table_column-5-wrap tbody tr > *:nth-child(5) .slds-truncate {\n  overflow-wrap: break-word;\n  word-wrap: break-word;\n  -webkit-hyphens: none;\n      -ms-hyphens: none;\n          hyphens: none;\n  white-space: normal; }\n\n.slds-table_column-6-wrap tbody tr > *:nth-child(6) .slds-truncate {\n  overflow-wrap: break-word;\n  word-wrap: break-word;\n  -webkit-hyphens: none;\n      -ms-hyphens: none;\n          hyphens: none;\n  white-space: normal; }\n\n.slds-table_column-7-wrap tbody tr > *:nth-child(7) .slds-truncate {\n  overflow-wrap: break-word;\n  word-wrap: break-word;\n  -webkit-hyphens: none;\n      -ms-hyphens: none;\n          hyphens: none;\n  white-space: normal; }\n\n.slds-table_column-8-wrap tbody tr > *:nth-child(8) .slds-truncate {\n  overflow-wrap: break-word;\n  word-wrap: break-word;\n  -webkit-hyphens: none;\n      -ms-hyphens: none;\n          hyphens: none;\n  white-space: normal; }\n\n.slds-table_column-9-wrap tbody tr > *:nth-child(9) .slds-truncate {\n  overflow-wrap: break-word;\n  word-wrap: break-word;\n  -webkit-hyphens: none;\n      -ms-hyphens: none;\n          hyphens: none;\n  white-space: normal; }\n\n.slds-table_column-10-wrap tbody tr > *:nth-child(10) .slds-truncate {\n  overflow-wrap: break-word;\n  word-wrap: break-word;\n  -webkit-hyphens: none;\n      -ms-hyphens: none;\n          hyphens: none;\n  white-space: normal; }\n\n.slds-table_column-11-wrap tbody tr > *:nth-child(11) .slds-truncate {\n  overflow-wrap: break-word;\n  word-wrap: break-word;\n  -webkit-hyphens: none;\n      -ms-hyphens: none;\n          hyphens: none;\n  white-space: normal; }\n\n.slds-table_column-12-wrap tbody tr > *:nth-child(12) .slds-truncate {\n  overflow-wrap: break-word;\n  word-wrap: break-word;\n  -webkit-hyphens: none;\n      -ms-hyphens: none;\n          hyphens: none;\n  white-space: normal; }\n\n.slds-table_column-13-wrap tbody tr > *:nth-child(13) .slds-truncate {\n  overflow-wrap: break-word;\n  word-wrap: break-word;\n  -webkit-hyphens: none;\n      -ms-hyphens: none;\n          hyphens: none;\n  white-space: normal; }\n\n.slds-table_column-14-wrap tbody tr > *:nth-child(14) .slds-truncate {\n  overflow-wrap: break-word;\n  word-wrap: break-word;\n  -webkit-hyphens: none;\n      -ms-hyphens: none;\n          hyphens: none;\n  white-space: normal; }\n\n.slds-table_column-15-wrap tbody tr > *:nth-child(15) .slds-truncate {\n  overflow-wrap: break-word;\n  word-wrap: break-word;\n  -webkit-hyphens: none;\n      -ms-hyphens: none;\n          hyphens: none;\n  white-space: normal; }\n\n[class*=\"slds-table_column-\"] tr td .slds-truncate {\n  overflow: hidden;\n  position: relative;\n  max-height: 3.25rem; }\n\n[class*=\"slds-table_column-\"] tr td .slds-truncate:after {\n  content: '';\n  position: absolute;\n  top: 2.25rem;\n  bottom: 0;\n  right: 0;\n  width: 50%;\n  background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, white 69%); }\n\n[class*=\"slds-table_column-\"] tr:hover td .slds-truncate:after {\n  background: linear-gradient(to right, rgba(250, 250, 249, 0) 0%, #fafaf9 69%); }\n\n/**\n * Resizable data table columns\n *\n * @selector .slds-table_resizable-cols\n * @restrict .slds-table_fixed-layout\n */\n.slds-table_resizable-cols thead th,\n.slds-table--resizable-cols thead th {\n  padding: 0; }\n\n/**\n * Provide an indicator that resizing is available\n *\n * @selector .slds-is-resizable\n * @restrict .slds-table_resizable-cols th\n */\n.slds-is-resizable .slds-th__action:hover,\n.slds-is-resizable .slds-th__action:focus {\n  box-shadow: #dddbda -0.25rem 0 0 inset; }\n\n/**\n * Resizable handle\n *\n * @selector .slds-resizable\n * @restrict .slds-is-resizable div\n */\n.slds-resizable {\n  max-width: 100%;\n  /**\n   * Grab handle to resize column\n   *\n   * @selector .slds-resizable__handle\n   * @restrict .slds-resizable span\n   */\n  /**\n   * Grab handle divider indicator when resizing column\n   *\n   * @selector .slds-resizable__divider\n   * @restrict .slds-resizable__handle span\n   */ }\n\n.slds-resizable__handle {\n  position: absolute;\n  right: 0;\n  top: 0;\n  width: 0.25rem;\n  height: 100%;\n  background: #0070d2;\n  display: block;\n  cursor: col-resize;\n  opacity: 0;\n  z-index: 5000; }\n\n.slds-resizable__handle:hover, .slds-resizable__handle:focus, .slds-resizable__handle:active {\n  opacity: 1; }\n\n.slds-resizable__divider {\n  position: absolute;\n  right: 0;\n  height: 100vh;\n  width: 1px;\n  background: #0070d2; }\n\n.slds-resizable__input:focus ~ .slds-resizable__handle {\n  opacity: 1; }\n\n/**\n * @summary Use this class to join a table to a page-header\n */\n.slds-table_joined table,\n.slds-table.slds-has-top-magnet table {\n  border-radius: 0 0 0.25rem 0.25rem;\n  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1); }\n\n.slds-table_joined-wrapper {\n  padding: 1rem 1rem 0 1rem;\n  border-radius: 0.25rem;\n  background-clip: padding-box; }\n\n.slds-table_joined-wrapper .slds-table {\n  border-radius: 0 0 0.25rem 0.25rem;\n  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1); }\n\n/**\n * Responsive tables\n *\n * When a table exceeds the width of its container, one responsive option is to wrap the table in a `.slds-scrollable_x` class so that the user can scroll horizontally. View the example small and medium form factor tabs to see the effect.\n *\n * When `.slds-max-medium-table_stacked` is applied to the &ldquo;Grid&rdquo; table, we generate faux `<th>` labels using the `data-label` applied to each cell, and stack the cells instead of lining them up horizontally. This works up until the **medium form factor** breakpoint. After the breakpoint is triggered, the table will lay out horizontally as normal.\n *\n * When `.slds-max-medium-table_stacked` is applied to the &ldquo;Grid&rdquo; table, we generate faux `<th>` labels using the `data-label` applied to each cell, and stack the cells instead of lining them up horizontally. This works up until the **medium form factor** breakpoint. After the breakpoint is triggered, the table will lay out horizontally as normal.\n *\n * @summary Creates stacked row with stacked cells\n *\n * @name responsive\n * @selector .slds-max-medium-table_stacked\n * @restrict .slds-table\n * @variant\n * @layout responsive\n * @prototype\n */\n@media (max-width: 48em) {\n  .slds-max-medium-table_stacked,\n  .slds-max-medium-table--stacked {\n    border: 0; }\n  .slds-max-medium-table_stacked thead,\n  .slds-max-medium-table--stacked thead {\n    /* stylelint-disable declaration-no-important */\n    position: absolute !important;\n    margin: -1px !important;\n    border: 0 !important;\n    padding: 0 !important;\n    width: 1px !important;\n    height: 1px !important;\n    overflow: hidden !important;\n    clip: rect(0 0 0 0) !important;\n    /* stylelint-enable declaration-no-important */ }\n  .slds-max-medium-table_stacked th,\n  .slds-max-medium-table--stacked th {\n    border-top: 0; }\n  .slds-max-medium-table_stacked tr,\n  .slds-max-medium-table--stacked tr {\n    display: block;\n    border-top: 2px solid #dddbda; }\n  .slds-max-medium-table_stacked th,\n  .slds-max-medium-table_stacked td,\n  .slds-max-medium-table--stacked th,\n  .slds-max-medium-table--stacked td {\n    display: block;\n    padding: 0.75rem;\n    max-width: 100%;\n    width: 100%;\n    clear: both;\n    white-space: normal;\n    overflow: hidden;\n    text-align: left; }\n  .slds-max-medium-table_stacked th.slds-truncate,\n  .slds-max-medium-table_stacked td.slds-truncate,\n  .slds-max-medium-table--stacked th.slds-truncate,\n  .slds-max-medium-table--stacked td.slds-truncate {\n    max-width: 100%; }\n  .slds-max-medium-table_stacked th:before,\n  .slds-max-medium-table_stacked td:before,\n  .slds-max-medium-table--stacked th:before,\n  .slds-max-medium-table--stacked td:before {\n    font-size: 0.75rem;\n    line-height: 1.25;\n    color: #706e6b;\n    text-transform: uppercase;\n    letter-spacing: 0.0625rem;\n    display: block;\n    padding-bottom: 0.25rem;\n    content: attr(data-label); }\n  .slds-max-medium-table_stacked tr > td:first-child,\n  .slds-max-medium-table_stacked tr > td:last-child,\n  .slds-max-medium-table--stacked tr > td:first-child,\n  .slds-max-medium-table--stacked tr > td:last-child {\n    padding: 0.75rem; }\n  .slds-max-medium-table_stacked:not(.slds-no-row-hover) tbody tr:hover,\n  .slds-max-medium-table--stacked:not(.slds-no-row-hover) tbody tr:hover {\n    /* stylelint-disable declaration-no-important */\n    /* stylelint-enable declaration-no-important */ }\n  .slds-max-medium-table_stacked:not(.slds-no-row-hover) tbody tr:hover td,\n  .slds-max-medium-table_stacked:not(.slds-no-row-hover) tbody tr:hover th,\n  .slds-max-medium-table--stacked:not(.slds-no-row-hover) tbody tr:hover td,\n  .slds-max-medium-table--stacked:not(.slds-no-row-hover) tbody tr:hover th {\n    background-color: inherit !important;\n    box-shadow: none !important; }\n  .slds-max-medium-table_stacked .slds-is-interactive .slds-button,\n  .slds-max-medium-table--stacked .slds-is-interactive .slds-button {\n    visibility: visible; }\n  .slds-max-medium-table_stacked .slds-cell-shrink,\n  .slds-max-medium-table--stacked .slds-cell-shrink {\n    width: auto; } }\n\n@media (max-width: 48em) {\n  .slds-max-medium-table_stacked td:before,\n  .slds-max-medium-table_stacked th:before,\n  .slds-max-medium-table--stacked td:before,\n  .slds-max-medium-table--stacked th:before {\n    padding-bottom: 0.25rem; } }\n\n/**\n * @summary Creates stacked rows with horizontal cells\n *\n * @selector .slds-max-medium-table_stacked-horizontal\n * @restrict .slds-table\n * @modifier\n * @layout responsive\n * @prototype\n */\n@media (max-width: 48em) {\n  .slds-max-medium-table_stacked-horizontal,\n  .slds-max-medium-table--stacked-horizontal {\n    border: 0; }\n  .slds-max-medium-table_stacked-horizontal thead,\n  .slds-max-medium-table--stacked-horizontal thead {\n    /* stylelint-disable declaration-no-important */\n    position: absolute !important;\n    margin: -1px !important;\n    border: 0 !important;\n    padding: 0 !important;\n    width: 1px !important;\n    height: 1px !important;\n    overflow: hidden !important;\n    clip: rect(0 0 0 0) !important;\n    /* stylelint-enable declaration-no-important */ }\n  .slds-max-medium-table_stacked-horizontal th,\n  .slds-max-medium-table--stacked-horizontal th {\n    border-top: 0; }\n  .slds-max-medium-table_stacked-horizontal tr,\n  .slds-max-medium-table--stacked-horizontal tr {\n    display: block;\n    border-top: 2px solid #dddbda; }\n  .slds-max-medium-table_stacked-horizontal th,\n  .slds-max-medium-table_stacked-horizontal td,\n  .slds-max-medium-table--stacked-horizontal th,\n  .slds-max-medium-table--stacked-horizontal td {\n    display: block;\n    padding: 0.75rem;\n    max-width: 100%;\n    width: 100%;\n    clear: both;\n    white-space: normal;\n    overflow: hidden;\n    text-align: left; }\n  .slds-max-medium-table_stacked-horizontal th.slds-truncate,\n  .slds-max-medium-table_stacked-horizontal td.slds-truncate,\n  .slds-max-medium-table--stacked-horizontal th.slds-truncate,\n  .slds-max-medium-table--stacked-horizontal td.slds-truncate {\n    max-width: 100%; }\n  .slds-max-medium-table_stacked-horizontal th:before,\n  .slds-max-medium-table_stacked-horizontal td:before,\n  .slds-max-medium-table--stacked-horizontal th:before,\n  .slds-max-medium-table--stacked-horizontal td:before {\n    font-size: 0.75rem;\n    line-height: 1.25;\n    color: #706e6b;\n    text-transform: uppercase;\n    letter-spacing: 0.0625rem;\n    display: block;\n    padding-bottom: 0.25rem;\n    content: attr(data-label); }\n  .slds-max-medium-table_stacked-horizontal tr > td:first-child,\n  .slds-max-medium-table_stacked-horizontal tr > td:last-child,\n  .slds-max-medium-table--stacked-horizontal tr > td:first-child,\n  .slds-max-medium-table--stacked-horizontal tr > td:last-child {\n    padding: 0.75rem; }\n  .slds-max-medium-table_stacked-horizontal:not(.slds-no-row-hover) tbody tr:hover,\n  .slds-max-medium-table--stacked-horizontal:not(.slds-no-row-hover) tbody tr:hover {\n    /* stylelint-disable declaration-no-important */\n    /* stylelint-enable declaration-no-important */ }\n  .slds-max-medium-table_stacked-horizontal:not(.slds-no-row-hover) tbody tr:hover td,\n  .slds-max-medium-table_stacked-horizontal:not(.slds-no-row-hover) tbody tr:hover th,\n  .slds-max-medium-table--stacked-horizontal:not(.slds-no-row-hover) tbody tr:hover td,\n  .slds-max-medium-table--stacked-horizontal:not(.slds-no-row-hover) tbody tr:hover th {\n    background-color: inherit !important;\n    box-shadow: none !important; }\n  .slds-max-medium-table_stacked-horizontal .slds-is-interactive .slds-button,\n  .slds-max-medium-table--stacked-horizontal .slds-is-interactive .slds-button {\n    visibility: visible; }\n  .slds-max-medium-table_stacked-horizontal .slds-cell-shrink,\n  .slds-max-medium-table--stacked-horizontal .slds-cell-shrink {\n    width: auto; } }\n\n@media (max-width: 48em) {\n  .slds-max-medium-table_stacked-horizontal td,\n  .slds-max-medium-table--stacked-horizontal td {\n    text-align: right; }\n  .slds-max-medium-table_stacked-horizontal td:before,\n  .slds-max-medium-table--stacked-horizontal td:before {\n    float: left;\n    margin-top: 0.125rem; }\n  .slds-max-medium-table_stacked-horizontal .slds-truncate,\n  .slds-max-medium-table--stacked-horizontal .slds-truncate {\n    max-width: 100%; } }\n\n.slds-table_edit_container:focus,\n.slds-table--edit_container:focus {\n  outline: none; }\n\n.slds-table_edit_container:focus:before,\n.slds-table--edit_container:focus:before {\n  content: ' ';\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1;\n  background-color: #fafaf9;\n  box-shadow: 0 0 0 4px #1589ee inset; }\n\n.slds-table_edit_container:focus .slds-table_edit_container-message,\n.slds-table_edit_container:focus .slds-table--edit_container-message,\n.slds-table--edit_container:focus .slds-table_edit_container-message,\n.slds-table--edit_container:focus .slds-table--edit_container-message {\n  display: block;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 20rem;\n  margin-top: -2.25rem;\n  margin-left: -10rem;\n  background-color: white;\n  text-align: center;\n  z-index: 1; }\n\n.slds-table_edit_container-message,\n.slds-table--edit_container-message {\n  display: none; }\n\n/**\n * Inline edit plugin for advanced tables\n *\n * #### Accessibility\n * The Advanced Data Table and Inline Edit Data Table are based on the semantics,\n * roles and interaction model of the [ARIA Grid](http://w3c.github.io/aria/practices/aria-practices.html#grid).\n * In SLDS we overlay the ARIA Grid on top of native HTML table semantics.\n *\n * The role of Grid comes with 2 distinct modes, Navigation mode and Actionable\n * mode. Both come with very specific keyboard interaction modals. Navigation\n * mode is the default mode of the Grid.\n *\n * **Navigation Mode**\n * - Tabbing into the grid focuses the first data cell in the table.\n * - The second tab key press takes the user focus out of the grid onto the next focusable element on the page.\n * - Once the user has tabbed out of the grid, tabbing back into the grid will return focus to the last cell the user was focused on.\n * - Navigation in the grid is accomplished via the arrow keys.\n * - No actionable items in cell contents are focusable.\n * - Pressing the Enter key on a chosen grid cell, places the entire Grid into Actionable mode.\n *\n * **Actionable Mode**\n * - Once in Actionable mode, all focusable items in the entire grid can be tabbed to.\n * - Arrow navigation still takes the user cell to cell in any direction, but focuses on the first actionable item in the cell, if there is one.\n * - Pressing the Escape key exits Actionable mode, placing the user back into Navigation mode, keeping the users cursor on the same cell they were focused in.\n * - When interacting with a component in a cell, such as a Menu, that also uses the Escape key as an exit action, pressing Escape will take the user back to the triggering element in the current cell. A subsequent press of Escape will return the user to Navigation mode.\n *\n * For the purposes of these docs, the Default state of Inline Edit is\n * representative of Navigation mode, all other states are assumed to be in Actionable Mode.\n *\n * @summary Initiates inline-edit mode for data-tables\n *\n * @name inline-edit\n * @selector .slds-table_edit\n * @restrict .slds-table_fixed-layout\n * @required\n * @variant\n */\n.slds-table_edit,\n.slds-table--edit {\n  /**\n   * Cell that has error icon appear within\n   *\n   * @selector .slds-cell-error\n   * @restrict .slds-table_edit td\n   * @required\n   */ }\n\n.slds-table_edit thead th,\n.slds-table--edit thead th {\n  padding: 0; }\n\n.slds-table_edit .slds-cell-error,\n.slds-table--edit .slds-cell-error {\n  padding-left: 0; }\n\n.slds-table_edit:not(.slds-no-cell-focus) tbody tr:hover > .slds-cell-edit.slds-has-focus,\n.slds-table--edit:not(.slds-no-cell-focus) tbody tr:hover > .slds-cell-edit.slds-has-focus {\n  background-color: white;\n  box-shadow: #0070d2 0 0 0 1px inset; }\n\n.slds-table_edit.slds-table tbody tr:hover > .slds-cell-edit:hover,\n.slds-table--edit.slds-table tbody tr:hover > .slds-cell-edit:hover {\n  background-color: white; }\n\n.slds-table_edit.slds-table tbody tr:hover > .slds-cell-edit.slds-is-edited,\n.slds-table--edit.slds-table tbody tr:hover > .slds-cell-edit.slds-is-edited {\n  background-color: #faffbd; }\n\n.slds-table_edit.slds-table tbody tr:hover > .slds-cell-edit.slds-has-error,\n.slds-table--edit.slds-table tbody tr:hover > .slds-cell-edit.slds-has-error {\n  background-color: #faffbd;\n  box-shadow: #c23934 0 0 0 2px inset; }\n\n.slds-table_edit .slds-button__icon_edit:focus,\n.slds-table_edit .slds-button__icon--edit:focus,\n.slds-table--edit .slds-button__icon_edit:focus,\n.slds-table--edit .slds-button__icon--edit:focus {\n  fill: #1589ee; }\n\n.slds-has-focus .slds-th__action {\n  background-color: white;\n  box-shadow: #005fb2 0 0 0 1px inset; }\n\n.slds-has-focus.slds-is-resizable .slds-th__action,\n.slds-has-focus.slds-is-resizable .slds-th__action:focus,\n.slds-has-focus.slds-is-resizable .slds-th__action:hover,\n.slds-has-focus.slds-is-resizable .slds-th__action:focus:hover,\n.slds-is-resizable .slds-th__action:focus,\n.slds-is-resizable .slds-th__action:focus:hover {\n  background-color: white;\n  box-shadow: #005fb2 0 0 0 1px inset, #005fb2 -0.25rem 0 0 inset; }\n\n/**\n * Informs a table cell that it has editing capabilities\n *\n * @selector .slds-cell-edit\n * @restrict .slds-table_edit th, .slds-table_edit td\n */\n.slds-cell-edit {\n  outline: 0;\n  /**\n   * Informs a cell that it has been edited but not saved\n   *\n   * @selector .slds-is-edited\n   * @restrict .slds-cell-edit\n   * @modifier\n   */\n  /**\n   * Informs a cell that it has an error inside of it\n   *\n   * @selector .slds-has-error\n   * @restrict .slds-cell-edit\n   * @modifier\n   */ }\n\n.slds-cell-edit.slds-has-focus {\n  background-color: white;\n  box-shadow: #005fb2 0 0 0 1px inset; }\n\n.slds-cell-edit.slds-has-focus .slds-button__icon_edit,\n.slds-cell-edit.slds-has-focus .slds-button__icon--edit,\n.slds-cell-edit.slds-has-focus .slds-button__icon_lock,\n.slds-cell-edit.slds-has-focus .slds-button__icon--lock {\n  opacity: 1; }\n\n.slds-cell-edit.slds-has-focus:hover {\n  box-shadow: #005fb2 0 0 0 1px inset; }\n\n.slds-cell-edit.slds-has-focus a:focus {\n  text-decoration: underline;\n  outline: none; }\n\n.slds-cell-edit.slds-is-edited, .slds-cell-edit.slds-is-edited:hover {\n  background-color: #faffbd; }\n\n.slds-cell-edit.slds-has-error, .slds-cell-edit.slds-has-error:hover {\n  background-color: #faffbd;\n  box-shadow: #c23934 0 0 0 2px inset; }\n\n/**\n * @selector .slds-cell-edit__button\n * @restrict .slds-cell-edit button\n */\n.slds-cell-edit__button {\n  width: 1.25rem;\n  height: 1.25rem;\n  -ms-flex-negative: 0;\n      flex-shrink: 0; }\n\n.slds-cell-edit__button:focus .slds-button__icon_edit,\n.slds-cell-edit__button:focus .slds-button__icon--edit {\n  opacity: 1; }\n\n/**\n * Handles children of the table where we don't want any focusable cells\n *\n * @selector .slds-no-cell-focus\n * @restrict .slds-table_edit\n * @modifier\n */\n.slds-no-cell-focus .slds-has-focus {\n  background: #f3f2f2;\n  box-shadow: none; }\n\n.slds-no-cell-focus .slds-has-focus .slds-th__action,\n.slds-no-cell-focus .slds-has-focus .slds-th__action:hover,\n.slds-no-cell-focus .slds-has-focus .slds-th__action:focus,\n.slds-no-cell-focus .slds-has-focus .slds-th__action:focus:hover {\n  color: inherit;\n  background-color: white;\n  box-shadow: none; }\n\n.slds-no-cell-focus .slds-has-focus .slds-button__icon_edit,\n.slds-no-cell-focus .slds-has-focus .slds-button__icon--edit {\n  opacity: 1; }\n\n.slds-no-cell-focus .slds-has-focus.slds-is-resizable:hover .slds-th__action {\n  background-color: white;\n  box-shadow: #dddbda -0.25rem 0 0 inset; }\n\n.slds-no-cell-focus .slds-is-sortable.slds-has-focus .slds-is-sortable__icon {\n  display: none; }\n\n.slds-no-cell-focus .slds-is-sorted.slds-has-focus .slds-is-sortable__icon {\n  display: inline-block;\n  fill: #706e6b; }\n\n.slds-no-cell-focus .slds-is-edited, .slds-no-cell-focus .slds-is-edited:hover {\n  background-color: #faffbd; }\n\n.slds-no-cell-focus .slds-has-error, .slds-no-cell-focus .slds-has-error:hover {\n  background-color: #faffbd;\n  box-shadow: #c23934 0 0 0 2px inset; }\n\n.slds-no-cell-focus thead .slds-has-focus:hover {\n  color: #0070d2; }\n\n.slds-no-cell-focus thead .slds-has-focus:hover .slds-is-sortable__icon {\n  display: inline-block;\n  fill: #0070d2; }\n\n.slds-hint-parent .slds-cell-edit .slds-button__icon_edit,\n.slds-hint-parent .slds-cell-edit .slds-button__icon--edit,\n.slds-hint-parent .slds-cell-edit .slds-button__icon_lock,\n.slds-hint-parent .slds-cell-edit .slds-button__icon--lock {\n  opacity: 0; }\n\n.slds-hint-parent .slds-cell-edit:hover .slds-button__icon_edit,\n.slds-hint-parent .slds-cell-edit:hover .slds-button__icon--edit, .slds-hint-parent .slds-cell-edit:focus .slds-button__icon_edit,\n.slds-hint-parent .slds-cell-edit:focus .slds-button__icon--edit {\n  opacity: 0.5; }\n\n.slds-hint-parent .slds-cell-edit:hover .slds-button__icon_edit:hover, .slds-hint-parent .slds-cell-edit:hover .slds-button__icon_edit:focus,\n.slds-hint-parent .slds-cell-edit:hover .slds-button__icon--edit:hover,\n.slds-hint-parent .slds-cell-edit:hover .slds-button__icon--edit:focus, .slds-hint-parent .slds-cell-edit:focus .slds-button__icon_edit:hover, .slds-hint-parent .slds-cell-edit:focus .slds-button__icon_edit:focus,\n.slds-hint-parent .slds-cell-edit:focus .slds-button__icon--edit:hover,\n.slds-hint-parent .slds-cell-edit:focus .slds-button__icon--edit:focus {\n  fill: #1589ee;\n  opacity: 1; }\n\n.slds-hint-parent .slds-cell-edit:hover .slds-button__icon_lock,\n.slds-hint-parent .slds-cell-edit:hover .slds-button__icon--lock, .slds-hint-parent .slds-cell-edit:focus .slds-button__icon_lock,\n.slds-hint-parent .slds-cell-edit:focus .slds-button__icon--lock {\n  opacity: 0.5; }\n\n.slds-hint-parent .slds-cell-edit.slds-has-focus .slds-button__icon_edit,\n.slds-hint-parent .slds-cell-edit.slds-has-focus .slds-button__icon--edit {\n  fill: #706e6b;\n  opacity: 1; }\n\n/**\n * @selector .slds-form-element__label_edit\n * @restrict .slds-popover_edit label\n */\n.slds-form-element__label_edit,\n.slds-form-element__label--edit {\n  margin: 0 0.125rem 0; }\n\n/**\n * Dialog specific for inline-edit popover\n *\n * @selector .slds-popover_edit\n * @restrict .slds-popover\n * @required\n */\n.slds-popover_edit,\n.slds-popover--edit {\n  border-top: 0;\n  border-top-left-radius: 0;\n  border-top-right-radius: 0; }\n\n.slds-popover_edit .slds-popover__body,\n.slds-popover--edit .slds-popover__body {\n  padding: 0.25rem 0.25rem 0.25rem 0; }\n\n.slds-popover_edit .slds-form-element__help,\n.slds-popover--edit .slds-form-element__help {\n  width: 100%;\n  padding-left: 0.75rem; }\n\n.slds-table_header-fixed_container,\n.slds-table--header-fixed_container {\n  position: relative;\n  padding-top: 2rem;\n  background-color: #fafaf9;\n  overflow: hidden; }\n\n.slds-table_header-fixed_container:before,\n.slds-table--header-fixed_container:before {\n  border-bottom: 1px solid #dddbda;\n  content: '';\n  display: block;\n  position: relative;\n  width: 100%; }\n\n.slds-cell-fixed {\n  background-color: #fafaf9;\n  position: absolute;\n  top: 0;\n  min-height: 2rem; }\n\n.slds-table_header-fixed,\n.slds-table--header-fixed {\n  border-top: 0; }\n\n.slds-table_header-fixed thead th,\n.slds-table--header-fixed thead th {\n  position: static;\n  padding: 0;\n  border-top: 0; }\n\n.slds-table_header-fixed tbody tr:first-child td,\n.slds-table_header-fixed tbody tr:first-child th,\n.slds-table--header-fixed tbody tr:first-child td,\n.slds-table--header-fixed tbody tr:first-child th {\n  border: 0; }\n\n/**\n * A tree is composed of two core elements `.slds-tree` and `.slds-tree__item`. The tree wrapper, the outer most parent `ul`, will receive the class `.slds-tree`. This class will be used for scoping a tree, which allows for particular styling based on states in which the tree may enter.\n *\n * A tree will need helper classes added and removed to help structure the layout. Each child node list item needs an `aria-level` attribute with its value being the number of levels deep it is nested to indicate the distinct grouping is nested within.\n *\n * Whenever the tree has a nested group, the nested `ul` element should receive the ARIA role `group`. The parent `li[role=\"treeitem\"]` requires the `aria-expanded` attribute to be applied. Toggling `aria-expanded` to `true` or `false` will show or hide the child `group`. The parent `li[role=\"treeitem\"]` also requires `aria-label` to be applied and set to the tree items text value, this ensures child groups are't announced to screen readers as you interact with that branch.\n *\n * When ever a `role=\"treeitem\"` node is selected, `aria-selected=\"true\"` needs to be applied to display the selected styles.\n *\n * In our example, we are using a chevron icon on tree branches to help indicate to the user what action clicking the tree branch will perform, whether opening or closing it. The effect of rotating the icon 90° to indicate open/closed status is achieved by applying the ARIA attribute `aria-expanded` to the `treeitem`. `aria-hidden=\"true\"` and `tabindex=\"-1\"` must be placed on the toggle button.\n *\n * Tree items can only contain text values, no actionable elements, apart from our toggle button, can be placed inside a Tree item.\n *\n * Trees can only contain a single focusable tree item and `tabindex=\"0\"` must be placed on the `li[role=\"treeitem]` that takes current focus. Every other actionable and non-actionable element must be made unfocusable by adding `tabindex=\"-1\"` or removing `tabindex`, respectively.\n *\n * When implementing collapsed rows, we suggest showing the content DOM nodes within each collapsed row only once the row is expanded for performance reasons. You can additionally toggle the hidden row with `slds-show` and `slds-hide` if you intend to keep all of the content in the DOM.\n *\n * You can add metatext (see: metatext state) to any tree item, which adds a smaller, second line of text below tree node labels to provide supplemental information (to provide users with added context, aid with identification/disambiguation). To add metatext, include an additional `span` within the treeitem with the class `slds-tree__item-meta`. We've added an additional parent span around the label/title and metatext to ensure the spacing works properly when metatext is included. If adding metatext to a tree item with child nodes (i.e. a branch), be sure to update the `aria-label` to include the metatext. For example: `aria-label=\"Tree Branch Label: Tree Branch Metatext\"`\n *\n * #### Accessibility\n *\n * **Interaction requirements**\n *\n * - Only a single action per tree item\n * - Only 1 focusabled item per Tree\n * - Actionable elements in a tree item are mouse only and should not be focusable, they should be presentational and should be hidden from screen readers and keyboard users\n * - Focus is placed on the entire `li[role=\"treeitem\"]`. If that item has child items, focus must include those as well.\n *\n * **Notable attributes**\n *\n * - `role=\"tree\"` is placed on the `ul`\n * - `role=\"tree\"` element also has `aria-labelledby` applied which points to the trees heading element\n * - `role=\"treeitem\"` is placed on the tree `li` elements\n * - `aria-level` is applied to `treeitem` elements to indicate their nesting depth\n * - `aria-expanded` is applied to `treeitem` elements that have child tree nodes. It is set to `true` or `false`\n * - `aria-label` is applied to `treeitem` elements that have child tree nodes. Be sure to add any metatext to the label, if applicable\n * - `aria-selected=\"true\"` is applied to `treeitem` elements that are selected\n * - `tabindex=\"0\"` is applied to the `treeitem` that is in focus\n * - `role=\"group\"` is applied to child tree node containers, `ul`\n *\n * **Keyboard navigation**\n *\n * - Clicking on a tree item creates a selection\n * - `Up` and `Down` arrow keys move `:focus` **and** `aria-selected`. Previous selections are cleared\n * - `Right` arrow key to expand collapsed node.\n * - `Left` arrow key to collapse expanded node.\n * - `Left` arrow key on an end child node, collapses the group and moves `:focus` and `aria-selected` to the parent `treeitem`\n * - `Enter` performs the default action on an end tree item (if there is one).\n * - `Ctrl` + `Up` and `Ctrl` + `Down` moves focus. Current selection is maintained\n * - `Ctrl` + `Space` will add or remove the currently focused tree item to the selection\n *\n * @summary A tree is visualization of a structure hierarchy. A branch can be expanded or collapsed.\n *\n * @name base\n * @selector .slds-tree_container\n * @restrict div\n * @support dev-ready\n * @variant\n * @s1 false\n */\n.slds-tree-container,\n.slds-tree_container {\n  min-width: 7.5rem;\n  max-width: 25rem; }\n\n.slds-tree-container > .slds-text-heading_label,\n.slds-tree-container > .slds-text-heading--label,\n.slds-tree_container > .slds-text-heading_label,\n.slds-tree_container > .slds-text-heading--label {\n  margin-bottom: 0.5rem; }\n\n/**\n * @selector .slds-tree\n * @restrict .slds-tree_container ul, table\n */\n.slds-tree {\n  /**\n   * @selector .slds-tree__item\n   * @restrict .slds-tree div, .slds-tree th\n   */\n  /**\n   * The label text of a tree item or tree branch\n   *\n   * @selector .slds-tree__item-label\n   * @restrict .slds-tree__item span\n   */\n  /**\n   * The meta text or secondary text of a tree item\n   *\n   * @selector .slds-tree__item-meta\n   * @restrict .slds-tree__item span\n   */\n  /**\n   * Styles the focus and selected state for any tree item that has role=\"treeitem\"\n   *\n   * @selector [role=\"treeitem\"]\n   * @restrict .slds-tree li\n   */\n  /**\n   * Selected state for a tree item\n   *\n   * @selector .slds-is-selected\n   * @restrict .slds-tree__item\n   * @notes Class should be applied via Javascript\n   * @modifier\n   */\n  /**\n   * Focus state for a tree item\n   *\n   * @selector .slds-is-focused\n   * @restrict .slds-tree__item\n   * @modifier\n   */ }\n\n.slds-tree__item {\n  display: -ms-flexbox;\n  display: flex;\n  line-height: 1.875rem;\n  padding-left: 1rem;\n  /**\n     * When a branch doesn't have children, apply slds-is-disabled to the button icon\n     *\n     * @selector .slds-is-disabled\n     * @restrict .slds-tree__item button\n     * @modifier\n     */\n  /**\n     * Hover state for a tree item\n     *\n     * @selector .slds-is-hovered\n     * @restrict .slds-tree__item\n     * @notes Class should be applied via Javascript\n     * @modifier\n     */ }\n\n.slds-tree__item .slds-is-disabled {\n  visibility: hidden; }\n\n.slds-tree__item a {\n  color: #3e3e3c; }\n\n.slds-tree__item a:hover {\n  text-decoration: none; }\n\n.slds-tree__item a:focus {\n  outline: 0;\n  text-decoration: underline; }\n\n.slds-tree__item.slds-is-hovered, .slds-tree__item:hover {\n  background: #f3f2f2;\n  cursor: pointer; }\n\n.slds-tree .slds-tree__item-label {\n  display: block; }\n\n.slds-tree .slds-tree__item-meta {\n  display: block;\n  margin-top: -0.75rem;\n  color: #706e6b; }\n\n.slds-tree [role=\"treeitem\"]:focus {\n  outline: 0; }\n\n.slds-tree [role=\"treeitem\"]:focus > .slds-tree__item {\n  background: #f3f2f2;\n  cursor: pointer;\n  text-decoration: underline; }\n\n.slds-tree [role=\"treeitem\"][aria-selected=\"true\"] > .slds-tree__item {\n  background: rgba(21, 137, 238, 0.1);\n  box-shadow: #1589ee 4px 0 0 inset; }\n\n.slds-tree [role=\"treeitem\"] > [role=\"group\"] {\n  display: none; }\n\n.slds-tree [role=\"treeitem\"][aria-expanded=\"true\"] > [role=\"group\"] {\n  display: block; }\n\n.slds-tree .slds-is-selected {\n  background: #ecebea;\n  box-shadow: #0070d2 4px 0 0 inset; }\n\n.slds-tree .slds-is-focused {\n  text-decoration: underline; }\n\n.slds-tree [aria-level=\"1\"] > .slds-tree__item {\n  padding-left: 1rem; }\n\n.slds-tree [aria-level=\"2\"] > .slds-tree__item {\n  padding-left: 2rem; }\n\n.slds-tree [aria-level=\"3\"] > .slds-tree__item {\n  padding-left: 3rem; }\n\n.slds-tree [aria-level=\"4\"] > .slds-tree__item {\n  padding-left: 4rem; }\n\n.slds-tree [aria-level=\"5\"] > .slds-tree__item {\n  padding-left: 5rem; }\n\n.slds-tree [aria-level=\"6\"] > .slds-tree__item {\n  padding-left: 6rem; }\n\n.slds-tree [aria-level=\"7\"] > .slds-tree__item {\n  padding-left: 7rem; }\n\n.slds-tree [aria-level=\"8\"] > .slds-tree__item {\n  padding-left: 8rem; }\n\n.slds-tree [aria-level=\"9\"] > .slds-tree__item {\n  padding-left: 9rem; }\n\n.slds-tree [aria-level=\"10\"] > .slds-tree__item {\n  padding-left: 10rem; }\n\n.slds-tree [aria-level=\"11\"] > .slds-tree__item {\n  padding-left: 11rem; }\n\n.slds-tree [aria-level=\"12\"] > .slds-tree__item {\n  padding-left: 12rem; }\n\n.slds-tree [aria-level=\"13\"] > .slds-tree__item {\n  padding-left: 13rem; }\n\n.slds-tree [aria-level=\"14\"] > .slds-tree__item {\n  padding-left: 14rem; }\n\n.slds-tree [aria-level=\"15\"] > .slds-tree__item {\n  padding-left: 15rem; }\n\n.slds-tree [aria-level=\"16\"] > .slds-tree__item {\n  padding-left: 16rem; }\n\n.slds-tree [aria-level=\"17\"] > .slds-tree__item {\n  padding-left: 17rem; }\n\n.slds-tree [aria-level=\"18\"] > .slds-tree__item {\n  padding-left: 18rem; }\n\n.slds-tree [aria-level=\"19\"] > .slds-tree__item {\n  padding-left: 19rem; }\n\n.slds-tree [aria-level=\"20\"] > .slds-tree__item {\n  padding-left: 20rem; }\n\n.slds-tree [aria-expanded=\"false\"] > .slds-tree__item > .slds-button[aria-controls] > .slds-button__icon,\n.slds-tree [aria-expanded=\"false\"] > .slds-tree__item > .slds-button[aria-controls] > span > .slds-button__icon {\n  transition: 0.2s transform ease-in-out;\n  transform: rotate(0deg); }\n\n.slds-tree [aria-expanded=\"true\"] > .slds-tree__item > .slds-button[aria-controls] > .slds-button__icon,\n.slds-tree [aria-expanded=\"true\"] > .slds-tree__item > .slds-button[aria-controls] > span > .slds-button__icon {\n  transition: 0.2s transform ease-in-out;\n  transform: rotate(90deg); }\n\n.slds-tree [aria-expanded=\"false\"] > .slds-tree__item .slds-button__icon {\n  transition: 0.2s transform ease-in-out;\n  transform: rotate(0deg); }\n\n.slds-tree [aria-expanded=\"true\"] > .slds-tree__item .slds-button__icon {\n  transition: 0.2s transform ease-in-out;\n  transform: rotate(90deg); }\n\n.slds-tree .slds-button {\n  -ms-flex-item-align: start;\n      align-self: flex-start;\n  margin-top: 0.5rem; }\n\n.slds-tree .slds-pill {\n  margin-left: 0.75rem; }\n\n/**\n * A tree grid is additional semantics that are laid on top of a grid based component via ARIA attributes, to enable hierarchically structured tabular data.\n * The tree grid comes with a very specific keyboard interaction model which **must** be implemented for the component to be screen reader accessible.\n *\n * #### Accessibility\n *\n * **Notable attributes**\n *\n * - `role=\"treegrid\"` should be applied to the `table` element\n * - `aria-readonly=\"true\"` should be applied to the `table` element\n * - `aria-level=\"n\"` where `n` represents the nesting level of a particular grid row, should be applied to the `tr` element\n * - `aria-setsize=\"n\"` where `n` is the number of items for that specific `aria-level` should be applied to the `tr` element\n * - `aria-posinset=\"n\"` where `n` represents the position in the `aria-level` set the row is placed at, should be applied to the `tr` element\n * - `aria-expanded=\"false\"` should be placed on rows that are collapsed and have child rows\n * - `aria-expanded=\"true\"` should be placed on rows that are expanded and have child rows\n * - `tabindex=\"0\"` should be placed on the first `tr` in the grid on load, to make the row focusable\n * - Every actionable element in the grid should have `tabindex=\"-1\" applied to make them not focusable in the grids navigation mode\n *\n * **Keyboard interaction**\n *\n * - Overall keyboard interaction should follow the same keyboard modal as the [Advanced and Inline Edit Data Table](/components/data-tables) with some additions\n *   - Navigation mode is the default mode. The grid only has a single focusable element at any time and it is either the `tr` or the `td`\n *   - Actionable mode is enabled when the user presses the `Enter` key, where actionable elements become focusable in the cell\n *   - Actionable mode is exited when the user presses the `Escape` key, and the user is placed back into Navigation Mode on the last cell they were in\n * - User focus is initially placed on the first row in the tree grid\n * - `Down` arrow key moves the user down one row and moves `tabindex=\"0\"` with it\n * - `Up` arrow key moves the user up one row and moves `tabindex=\"0\"` with it\n * - `Right` arrow key on a collapsed row, will expand it and update `aria-expanded`\n * - `Right` arrow key on an expanded or end row will move the user to the first cell in the row and move `tabindex=\"0\"` with it\n * - `Right` arrow key on a cell will move the user to the next cell in the row and move `tabindex=\"0\"` with it\n * - `Left` arrow key on a collapsed or end row will move the user to it's parent row and collapse it, if it has one\n * - `Left` arrow key on an expanded row will collapse it and update `aria-expanded`\n * - `Left` arrow key on a cell will move the user to the previous cell in the row and moves `tabindex=\"0\"` with it\n * - `Left` arrow key on the first cell of a row will move the user back to the row  and moves `tabindex=\"0\"` with it\n *\n * @summary A tree grid is a way to structure tabular data that has a hierarchical structure. A tree grid row can be expanded or collapsed.\n *\n * @name grid\n * @selector .slds-table_tree\n * @restrict .slds-tree\n * @variant\n * @s1 false\n */\n.slds-table_tree .slds-tree__item,\n.slds-table--tree .slds-tree__item {\n  line-height: 1.5rem; }\n\n.slds-table_tree .slds-tree__item a,\n.slds-table--tree .slds-tree__item a {\n  color: #0070d2; }\n\n.slds-table_tree .slds-tree__item a:hover,\n.slds-table--tree .slds-tree__item a:hover {\n  text-decoration: underline; }\n\n.slds-table_tree .slds-button,\n.slds-table--tree .slds-button {\n  -ms-flex-item-align: center;\n      -ms-grid-row-align: center;\n      align-self: center;\n  margin-top: 0; }\n\n.slds-table_tree [aria-level=\"1\"] > .slds-tree__item,\n.slds-table--tree [aria-level=\"1\"] > .slds-tree__item {\n  padding-left: 1.5rem; }\n\n.slds-table_tree [aria-level=\"2\"] > .slds-tree__item,\n.slds-table--tree [aria-level=\"2\"] > .slds-tree__item {\n  padding-left: 2.5rem; }\n\n.slds-table_tree [aria-level=\"3\"] > .slds-tree__item,\n.slds-table--tree [aria-level=\"3\"] > .slds-tree__item {\n  padding-left: 3.5rem; }\n\n.slds-table_tree [aria-level=\"4\"] > .slds-tree__item,\n.slds-table--tree [aria-level=\"4\"] > .slds-tree__item {\n  padding-left: 4.5rem; }\n\n.slds-table_tree [aria-level=\"5\"] > .slds-tree__item,\n.slds-table--tree [aria-level=\"5\"] > .slds-tree__item {\n  padding-left: 5.5rem; }\n\n.slds-table_tree [aria-level=\"6\"] > .slds-tree__item,\n.slds-table--tree [aria-level=\"6\"] > .slds-tree__item {\n  padding-left: 6.5rem; }\n\n.slds-table_tree [aria-level=\"7\"] > .slds-tree__item,\n.slds-table--tree [aria-level=\"7\"] > .slds-tree__item {\n  padding-left: 7.5rem; }\n\n.slds-table_tree [aria-level=\"8\"] > .slds-tree__item,\n.slds-table--tree [aria-level=\"8\"] > .slds-tree__item {\n  padding-left: 8.5rem; }\n\n.slds-table_tree [aria-level=\"9\"] > .slds-tree__item,\n.slds-table--tree [aria-level=\"9\"] > .slds-tree__item {\n  padding-left: 9.5rem; }\n\n.slds-table_tree [aria-level=\"10\"] > .slds-tree__item,\n.slds-table--tree [aria-level=\"10\"] > .slds-tree__item {\n  padding-left: 10.5rem; }\n\n.slds-table_tree [aria-level=\"11\"] > .slds-tree__item,\n.slds-table--tree [aria-level=\"11\"] > .slds-tree__item {\n  padding-left: 11.5rem; }\n\n.slds-table_tree [aria-level=\"12\"] > .slds-tree__item,\n.slds-table--tree [aria-level=\"12\"] > .slds-tree__item {\n  padding-left: 12.5rem; }\n\n.slds-table_tree [aria-level=\"13\"] > .slds-tree__item,\n.slds-table--tree [aria-level=\"13\"] > .slds-tree__item {\n  padding-left: 13.5rem; }\n\n.slds-table_tree [aria-level=\"14\"] > .slds-tree__item,\n.slds-table--tree [aria-level=\"14\"] > .slds-tree__item {\n  padding-left: 14.5rem; }\n\n.slds-table_tree [aria-level=\"15\"] > .slds-tree__item,\n.slds-table--tree [aria-level=\"15\"] > .slds-tree__item {\n  padding-left: 15.5rem; }\n\n.slds-table_tree [aria-level=\"16\"] > .slds-tree__item,\n.slds-table--tree [aria-level=\"16\"] > .slds-tree__item {\n  padding-left: 16.5rem; }\n\n.slds-table_tree [aria-level=\"17\"] > .slds-tree__item,\n.slds-table--tree [aria-level=\"17\"] > .slds-tree__item {\n  padding-left: 17.5rem; }\n\n.slds-table_tree [aria-level=\"18\"] > .slds-tree__item,\n.slds-table--tree [aria-level=\"18\"] > .slds-tree__item {\n  padding-left: 18.5rem; }\n\n.slds-table_tree [aria-level=\"19\"] > .slds-tree__item,\n.slds-table--tree [aria-level=\"19\"] > .slds-tree__item {\n  padding-left: 19.5rem; }\n\n.slds-table_tree [aria-level=\"20\"] > .slds-tree__item,\n.slds-table--tree [aria-level=\"20\"] > .slds-tree__item {\n  padding-left: 20.5rem; }\n\n.slds-einstein-header {\n  position: relative;\n  background-color: #95cbfc;\n  background-image: url(\"/assets/images/einstein-headers/einstein-header-background.svg\");\n  background-repeat: no-repeat;\n  background-position: left top;\n  background-size: cover;\n  border-radius: calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0;\n  border-bottom: 1px solid #dddbda;\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n  text-shadow: 0 0 4px #9EDAFF; }\n\n.slds-einstein-header .slds-popover__close {\n  color: currentColor; }\n\n.slds-einstein-header__figure, .slds-einstein-header__figure:last-child {\n  margin-bottom: calc((0.75rem + 5px) * -1);\n  height: 4.75rem;\n  background-image: url(\"/assets/images/einstein-headers/einstein-figure.svg\");\n  background-position: right bottom;\n  background-repeat: no-repeat; }\n\n.slds-einstein-header__actions {\n  padding-left: 1rem;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n      align-items: center; }\n\n.slds-einstein-header .slds-popover__close {\n  position: absolute;\n  top: 0;\n  right: 0; }\n\n.slds-popover_einstein.slds-nubbin_top:before, .slds-popover_einstein.slds-nubbin--top:before, .slds-popover_einstein.slds-nubbin_top-left:before, .slds-popover_einstein.slds-nubbin--top-left:before, .slds-popover_einstein.slds-nubbin_top-right:before, .slds-popover_einstein.slds-nubbin--top-right:before, .slds-popover_einstein.slds-nubbin_left-top:before, .slds-popover_einstein.slds-nubbin--left-top:before, .slds-popover_einstein.slds-nubbin_right-top:before, .slds-popover_einstein.slds-nubbin--right-top:before {\n  background-color: #95cbfc; }\n\n/**\n * @summary Container for a expandable section\n *\n * @name base\n * @selector .slds-section\n * @restrict article, div\n * @variant\n */\n.slds-section {\n  margin-top: 0.5rem;\n  margin-bottom: 0.5rem;\n  /**\n   * @summary Element containing the title of a section\n   *\n   * @selector .slds-section__title\n   * @restrict .slds-section h3\n   */\n  /**\n   * @summary Element containing the action inside of an expandable section title\n   *\n   * @selector .slds-section__title-action\n   * @restrict .slds-section__title button\n   */\n  /**\n   * @summary Element containing the content of an expandable section\n   *\n   * @selector .slds-section__content\n   * @restrict .slds-section div\n   */\n  /**\n   * @summary Toggle visibility of section content\n   *\n   * @selector .slds-is-open\n   * @restrict .slds-section\n   * @modifier\n   * @group visibility\n   */ }\n\n.slds-section__title {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n      align-items: center;\n  font-size: 1rem;\n  line-height: 1.875rem;\n  border: 1px solid transparent;\n  border-radius: 0.25rem; }\n\n.slds-section__title-action {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n      align-items: center;\n  background: #f3f2f2;\n  cursor: pointer;\n  width: 100%;\n  text-align: left;\n  color: currentColor;\n  font-size: inherit;\n  padding: 0 0.5rem; }\n\n.slds-section__title-action:hover, .slds-section__title-action:focus, .slds-section__title-action:active {\n  background: #eef1f6;\n  color: inherit; }\n\n.slds-section__content {\n  overflow: hidden;\n  visibility: hidden;\n  opacity: 0;\n  height: 0; }\n\n.slds-section__title-action-icon {\n  transform: rotate(-90deg); }\n\n.slds-section.slds-is-open .slds-section__title-action-icon {\n  transform: rotate(0deg);\n  transform-origin: 45%; }\n\n.slds-section.slds-is-open .slds-section__content {\n  padding-top: 0.75rem;\n  overflow: visible;\n  visibility: visible;\n  opacity: 1;\n  height: auto; }\n\n.slds-section-title {\n  font-size: 1rem; }\n\n.slds-section-title > a {\n  display: inline-block;\n  color: #3e3e3c; }\n\n.slds-section-title > a:hover, .slds-section-title > a:focus {\n  color: #005fb2; }\n\n.slds-section-title > a:focus {\n  box-shadow: 0 0 3px #0070D2; }\n\n.slds-section-title > a:active {\n  color: #3e3e3c; }\n\n.slds-section-title .slds-icon {\n  width: 1rem;\n  height: 1rem;\n  fill: currentColor; }\n\n.slds-section-title .slds-section-group_is-closed .slds-icon,\n.slds-section-title .slds-section-group--is-closed .slds-icon {\n  transform: rotate(-90deg); }\n\n.slds-section-title_divider,\n.slds-section-title--divider {\n  font-size: 0.75rem;\n  line-height: 1.25;\n  color: #706e6b;\n  text-transform: uppercase;\n  letter-spacing: 0.0625rem;\n  padding: 0.75rem 1rem;\n  background: #f3f2f2; }\n\n/**\n * @summary A region that can be inside of a layout\n *\n * @name base\n * @selector .slds-region\n * @restrict div\n * @variant\n */\n.slds-region {\n  background-color: white; }\n\n/**\n * @summary A region that can be pinned on the top of a layout\n *\n * @selector .slds-region__pinned-top\n * @restrict .slds-region\n */\n.slds-region__pinned-top {\n  background-color: white;\n  border-bottom: 1px solid #dddbda; }\n\n/**\n * @summary A region that can be pinned on the left side of a layout\n *\n * @selector .slds-region__pinned-top\n * @restrict .slds-region\n */\n.slds-region__pinned-left {\n  background-color: white;\n  border-right: 1px solid #dddbda; }\n\n/**\n * The default Vertical Tabs component renders a list of tabs and their\n * related content. The tab list is not truncated by default, but truncation\n * can be added with a modifier class on the link elements.\n *\n * @summary Renders a vertical tablist.\n *\n * @name base\n * @selector .slds-vertical-tabs\n * @restrict div, section\n * @variant\n */\n.slds-vertical-tabs {\n  display: -ms-flexbox;\n  display: flex;\n  overflow: hidden;\n  border: 1px solid #dddbda;\n  border-radius: 0.25rem; }\n\n/**\n * @summary Tab navigation container element\n *\n * @selector .slds-vertical-tabs__nav\n * @restrict .slds-vertical-tabs > ul\n */\n.slds-vertical-tabs__nav {\n  width: 12rem;\n  border-right: 1px solid #dddbda;\n  background: #f3f2f2; }\n\n/**\n * @summary Tab navigation item\n *\n * @selector .slds-vertical-tabs__nav-item\n * @restrict .slds-vertical-tabs__nav li\n */\n.slds-vertical-tabs__nav-item {\n  overflow: hidden;\n  border-bottom: 1px solid #dddbda;\n  color: #706e6b; }\n\n.slds-vertical-tabs__nav-item:last-child {\n  margin-bottom: -1px; }\n\n/**\n * @summary Tab Navigation Link\n *\n * @selector .slds-vertical-tabs__link\n * @restrict .slds-vertical-tabs__nav-item a\n */\n.slds-vertical-tabs__link {\n  display: block;\n  padding: 0.75rem;\n  color: currentColor; }\n\n.slds-vertical-tabs__link:hover {\n  background: #dddbda;\n  color: #3e3e3c;\n  text-decoration: none; }\n\n/**\n * @summary Tab Content Container\n *\n * @selector .slds-vertical-tabs__content\n * @restrict .slds-vertical-tabs div\n */\n.slds-vertical-tabs__content {\n  -ms-flex: 1;\n      flex: 1;\n  padding: 1rem;\n  background: white; }\n\n/**\n * @summary Active state for a tab navigation item\n *\n * @selector .slds-is-active\n * @restrict .slds-vertical-tabs__nav-item\n * @notes Required on the `<li>` element that is associated with the current active tab\n * @modifier\n */\n.slds-vertical-tabs__nav-item.slds-is-active {\n  margin-right: -1px;\n  border-right: 0;\n  background: white;\n  color: #0070d2; }\n\n.slds-vertical-tabs__nav-item.slds-is-active .slds-vertical-tabs__link:hover {\n  background: white;\n  color: currentColor; }\n\n/**\n * @summary Focus state for a tab navigation item\n *\n * @selector .slds-has-focus\n * @restrict .slds-vertical-tabs__nav-item\n * @modifier\n */\n.slds-vertical-tabs__nav-item.slds-has-focus {\n  text-decoration: underline; }\n\n@media (min-width: 30em) {\n  .slds-nowrap_small,\n  .slds-nowrap--small {\n    -ms-flex: 1 1 auto;\n        flex: 1 1 auto;\n    -ms-flex-wrap: nowrap;\n        flex-wrap: nowrap;\n    -ms-flex-align: stretch;\n        align-items: stretch; } }\n\n@media (min-width: 48em) {\n  .slds-nowrap_medium,\n  .slds-nowrap--medium {\n    -ms-flex: 1 1 auto;\n        flex: 1 1 auto;\n    -ms-flex-wrap: nowrap;\n        flex-wrap: nowrap;\n    -ms-flex-align: stretch;\n        align-items: stretch; } }\n\n@media (min-width: 64em) {\n  .slds-nowrap_large,\n  .slds-nowrap--large {\n    -ms-flex: 1 1 auto;\n        flex: 1 1 auto;\n    -ms-flex-wrap: nowrap;\n        flex-wrap: nowrap;\n    -ms-flex-align: stretch;\n        align-items: stretch; } }\n\n.slds-col_padded,\n.slds-col--padded {\n  padding-right: 0.75rem;\n  padding-left: 0.75rem; }\n\n.slds-col_padded-medium,\n.slds-col--padded-medium {\n  padding-right: 1rem;\n  padding-left: 1rem; }\n\n.slds-col_padded-large,\n.slds-col--padded-large {\n  padding-right: 1.5rem;\n  padding-left: 1.5rem; }\n\n.slds-col_padded-around,\n.slds-col--padded-around {\n  padding: 0.75rem; }\n\n.slds-col_padded-around-medium,\n.slds-col--padded-around-medium {\n  padding: 1rem; }\n\n.slds-col_padded-around-large,\n.slds-col--padded-around-large {\n  padding: 1.5rem; }\n\n@media (min-width: 64em) {\n  .slds-col-rule_top, .slds-col-rule--top {\n    border-top: 1px solid #f3f2f2; }\n  .slds-col-rule_right, .slds-col-rule--right {\n    border-right: 1px solid #f3f2f2; }\n  .slds-col-rule_bottom, .slds-col-rule--bottom {\n    border-bottom: 1px solid #f3f2f2; }\n  .slds-col-rule_left, .slds-col-rule--left {\n    border-left: 1px solid #f3f2f2; } }\n\n.slds-align-content-center {\n  -ms-flex: 1;\n      flex: 1;\n  -ms-flex-item-align: center;\n      -ms-grid-row-align: center;\n      align-self: center;\n  -ms-flex-pack: center;\n      justify-content: center; }\n\n/**\n * @summary Initializes grid\n *\n * @selector .slds-grid\n * @modifier\n */\n.slds-grid {\n  display: -ms-flexbox;\n  display: flex; }\n\n/**\n * @summary Initializes grid\n *\n * @selector .slds-grid_frame\n * @modifier\n */\n.slds-grid_frame,\n.slds-grid--frame {\n  min-width: 100vw;\n  min-height: 100vh;\n  overflow: hidden; }\n\n/**\n * @summary Initializes grid\n *\n * @selector .slds-grid_vertical\n * @modifier\n */\n.slds-grid_vertical,\n.slds-grid--vertical {\n  -ms-flex-direction: column;\n      flex-direction: column; }\n\n/**\n * @summary Initializes grid\n *\n * @selector .slds-grid_vertical-reverse\n * @modifier\n */\n.slds-grid_vertical-reverse,\n.slds-grid--vertical-reverse {\n  -ms-flex-direction: column-reverse;\n      flex-direction: column-reverse; }\n\n/**\n * @summary Initializes grid\n *\n * @selector .slds-grid_reverse\n * @modifier\n */\n.slds-grid_reverse,\n.slds-grid--reverse {\n  -ms-flex-direction: row-reverse;\n      flex-direction: row-reverse; }\n\n/**\n * @summary Allows columns to wrap when they exceed 100% of their parent’s width\n *\n * @selector .slds-wrap\n * @modifier\n */\n.slds-wrap {\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n  -ms-flex-align: start;\n      align-items: flex-start; }\n\n/**\n * @summary Keeps columns on one line. Allows columns to stretch and fill 100% of the parent&rsquo;s width and height.\n *\n * @selector .slds-nowrap\n * @modifier\n */\n.slds-nowrap {\n  -ms-flex: 1 1 auto;\n      flex: 1 1 auto;\n  -ms-flex-wrap: nowrap;\n      flex-wrap: nowrap;\n  -ms-flex-align: stretch;\n      align-items: stretch; }\n\n/**\n * @summary .slds-{size}-nowrap used for responsive design\n *\n * @selector [class*='-nowrap']\n * @modifier\n */\n@media (min-width: 20em) {\n  .slds-x-small-nowrap {\n    -ms-flex: 1 1 auto;\n        flex: 1 1 auto;\n    -ms-flex-wrap: nowrap;\n        flex-wrap: nowrap;\n    -ms-flex-align: stretch;\n        align-items: stretch; } }\n\n@media (min-width: 30em) {\n  .slds-small-nowrap {\n    -ms-flex: 1 1 auto;\n        flex: 1 1 auto;\n    -ms-flex-wrap: nowrap;\n        flex-wrap: nowrap;\n    -ms-flex-align: stretch;\n        align-items: stretch; } }\n\n@media (min-width: 48em) {\n  .slds-medium-nowrap {\n    -ms-flex: 1 1 auto;\n        flex: 1 1 auto;\n    -ms-flex-wrap: nowrap;\n        flex-wrap: nowrap;\n    -ms-flex-align: stretch;\n        align-items: stretch; } }\n\n@media (min-width: 64em) {\n  .slds-large-nowrap {\n    -ms-flex: 1 1 auto;\n        flex: 1 1 auto;\n    -ms-flex-wrap: nowrap;\n        flex-wrap: nowrap;\n    -ms-flex-align: stretch;\n        align-items: stretch; } }\n\n/**\n * @summary Apply 12px gutters to each grid column when you add this class to an `slds-grid` element\n * @selector .slds-gutters\n * @modifier\n */\n.slds-gutters {\n  margin-right: -0.75rem;\n  margin-left: -0.75rem; }\n\n.slds-gutters .slds-col {\n  padding-right: 0.75rem;\n  padding-left: 0.75rem; }\n\n/**\n * @summary Apply 2px gutters to each grid column when you add this class to an `slds-grid` element\n * @selector .slds-gutters_xxx-small\n * @modifier\n */\n.slds-gutters_xxx-small {\n  margin-right: -0.125rem;\n  margin-left: -0.125rem; }\n\n.slds-gutters_xxx-small .slds-col {\n  padding-right: 0.125rem;\n  padding-left: 0.125rem; }\n\n/**\n * @summary Apply 4px gutters to each grid column when you add this class to an `slds-grid` element\n * @selector .slds-gutters_xx-small\n * @modifier\n */\n.slds-gutters_xx-small {\n  margin-right: -0.25rem;\n  margin-left: -0.25rem; }\n\n.slds-gutters_xx-small .slds-col {\n  padding-right: 0.25rem;\n  padding-left: 0.25rem; }\n\n/**\n * @summary Apply 8px gutters to each grid column when you add this class to an `slds-grid` element\n * @selector .slds-gutters_x-small\n * @modifier\n */\n.slds-gutters_x-small {\n  margin-right: -0.5rem;\n  margin-left: -0.5rem; }\n\n.slds-gutters_x-small .slds-col {\n  padding-right: 0.5rem;\n  padding-left: 0.5rem; }\n\n/**\n * @summary Apply 12px gutters to each grid column when you add this class to an `slds-grid` element\n * @selector .slds-gutters_small\n * @modifier\n */\n.slds-gutters_small {\n  margin-right: -0.75rem;\n  margin-left: -0.75rem; }\n\n.slds-gutters_small .slds-col {\n  padding-right: 0.75rem;\n  padding-left: 0.75rem; }\n\n/**\n * @summary Apply 16px gutters to each grid column when you add this class to an `slds-grid` element\n * @selector .slds-gutters_medium\n * @modifier\n */\n.slds-gutters_medium {\n  margin-right: -1rem;\n  margin-left: -1rem; }\n\n.slds-gutters_medium .slds-col {\n  padding-right: 1rem;\n  padding-left: 1rem; }\n\n/**\n * @summary Apply 24px gutters to each grid column when you add this class to an `slds-grid` element\n * @selector .slds-gutters_large\n * @modifier\n */\n.slds-gutters_large {\n  margin-right: -1.5rem;\n  margin-left: -1.5rem; }\n\n.slds-gutters_large .slds-col {\n  padding-right: 1.5rem;\n  padding-left: 1.5rem; }\n\n/**\n * @summary Apply 48px gutters to each grid column when you add this class to an `slds-grid` element\n * @selector .slds-gutters_x-large\n * @modifier\n */\n.slds-gutters_xx-large {\n  margin-right: -3rem;\n  margin-left: -3rem; }\n\n.slds-gutters_xx-large .slds-col {\n  padding-right: 3rem;\n  padding-left: 3rem; }\n\n/**\n * @summary Apply 32px gutters to each grid column when you add this class to an `slds-grid` element\n * @selector .slds-gutters_xx-large\n * @modifier\n */\n.slds-gutters_x-large {\n  margin-right: -2rem;\n  margin-left: -2rem; }\n\n.slds-gutters_x-large .slds-col {\n  padding-right: 2rem;\n  padding-left: 2rem; }\n\n/**\n * @summary Normalizes the 0.75rem of padding when nesting a grid in a region with `.slds-p-horizontal_small`\n *\n * @selector .slds-grid_pull-padded\n * @modifier\n */\n.slds-grid_pull-padded,\n.slds-grid--pull-padded {\n  margin-right: -0.75rem;\n  margin-left: -0.75rem; }\n\n/**\n * @summary Normalizes the 0.125rem of padding when nesting a grid in a region with `.slds-p-horizontal_xxx-small`\n *\n * @selector .slds-grid_pull-padded-xxx-small\n * @modifier\n */\n.slds-grid_pull-padded-xxx-small,\n.slds-grid--pull-padded-xxx-small {\n  margin-right: -0.125rem;\n  margin-left: -0.125rem; }\n\n/**\n * @summary Normalizes the 0.25rem of padding when nesting a grid in a region with `.slds-p-horizontal_xx-small`\n *\n * @selector .slds-grid_pull-padded-xx-small\n * @modifier\n */\n.slds-grid_pull-padded-xx-small,\n.slds-grid--pull-padded-xx-small {\n  margin-right: -0.25rem;\n  margin-left: -0.25rem; }\n\n/**\n * @summary Normalizes the 0.5rem of padding when nesting a grid in a region with `.slds-p-horizontal_x-small`\n *\n * @selector .slds-grid_pull-padded-x-small\n * @modifier\n */\n.slds-grid_pull-padded-x-small,\n.slds-grid--pull-padded-x-small {\n  margin-right: -0.5rem;\n  margin-left: -0.5rem; }\n\n/**\n * @summary Normalizes the 0.75rem of padding when nesting a grid in a region with `.slds-p-horizontal_small`\n *\n * @selector .slds-grid_pull-padded-small\n * @modifier\n */\n.slds-grid_pull-padded-small,\n.slds-grid--pull-padded-small {\n  margin-right: -0.75rem;\n  margin-left: -0.75rem; }\n\n/**\n * @summary Normalizes the 1rem of padding when nesting a grid in a region with `.slds-p-horizontal_medium`\n *\n * @selector .slds-grid_pull-padded-medium\n * @modifier\n */\n.slds-grid_pull-padded-medium,\n.slds-grid--pull-padded-medium {\n  margin-right: -1rem;\n  margin-left: -1rem; }\n\n/**\n * @summary Normalizes the 1.5rem of padding when nesting a grid in a region with `.slds-p-horizontal_large`\n *\n * @selector .slds-grid_pull-padded-large\n * @modifier\n */\n.slds-grid_pull-padded-large,\n.slds-grid--pull-padded-large {\n  margin-right: -1.5rem;\n  margin-left: -1.5rem; }\n\n/**\n * @summary Normalizes the 1.5rem of padding when nesting a grid in a region with `.slds-p-horizontal_x-large`\n *\n * @selector .slds-grid_pull-padded-x-large\n * @modifier\n */\n.slds-grid_pull-padded-x-large,\n.slds-grid--pull-padded-x-large {\n  margin-right: -2rem;\n  margin-left: -2rem; }\n\n/**\n * @summary Normalizes the 1.5rem of padding when nesting a grid in a region with `.slds-p-horizontal_xx-large`\n *\n * @selector .slds-grid_pull-padded-xx-large\n * @modifier\n */\n.slds-grid_pull-padded-xx-large,\n.slds-grid--pull-padded-xx-large {\n  margin-right: -3rem;\n  margin-left: -3rem; }\n\n/**\n * @summary Initializes a grid column\n *\n * @selector .slds-col\n * @modifier\n */\n.slds-col,\n[class*=\"slds-col_padded\"],\n[class*=\"slds-col--padded\"] {\n  -ms-flex: 1 1 auto;\n      flex: 1 1 auto; }\n\n/**\n * @summary Adds border to top side of column\n *\n * @selector .slds-col_rule-top\n * @restrict .slds-col\n * @modifier\n */\n@media (min-width: 64em) {\n  .slds-col_rule-top,\n  .slds-col--rule-top {\n    border-top: 1px solid #f3f2f2; } }\n\n/**\n * @summary Adds border to right side of column\n *\n * @selector .slds-col_rule-right\n * @restrict .slds-col\n * @modifier\n */\n@media (min-width: 64em) {\n  .slds-col_rule-right,\n  .slds-col--rule-right {\n    border-right: 1px solid #f3f2f2; } }\n\n/**\n * @summary Adds border to bottom side of column\n *\n * @selector .slds-col_rule-bottom\n * @restrict .slds-col\n * @modifier\n */\n@media (min-width: 64em) {\n  .slds-col_rule-bottom,\n  .slds-col--rule-bottom {\n    border-bottom: 1px solid #f3f2f2; } }\n\n/**\n * @summary Adds border to left side of column\n *\n * @selector .slds-col_rule-left\n * @restrict .slds-col\n * @modifier\n */\n@media (min-width: 64em) {\n  .slds-col_rule-left,\n  .slds-col--rule-left {\n    border-left: 1px solid #f3f2f2; } }\n\n/**\n * @summary Needed when truncation is nested in a flexible container in a grid\n *\n * @selector .slds-has-flexi-truncate\n * @modifier\n */\n.slds-has-flexi-truncate {\n  -ms-flex: 1 1 0%;\n      flex: 1 1 0%;\n  min-width: 0; }\n\n/**\n * @summary Removes flexbox from grid column\n *\n * @selector .slds-no-flex\n * @modifier\n */\n.slds-no-flex {\n  -ms-flex: none;\n      flex: none; }\n\n/**\n * @summary Sets the column to a min-width of 0\n *\n * @selector .slds-no-space\n * @modifier\n */\n.slds-no-space {\n  min-width: 0; }\n\n/**\n * @summary Allows column to grow to children&rsquo;s content\n *\n * @selector .slds-grow\n * @modifier\n */\n.slds-grow {\n  -ms-flex-positive: 1;\n      flex-grow: 1; }\n\n/**\n * @summary Prevents column from growing to children&rsquo;s content\n *\n * @selector .slds-grow-none\n * @modifier\n */\n.slds-grow-none {\n  -ms-flex-positive: 0;\n      flex-grow: 0; }\n\n/**\n * @summary Allows column to shrink to children's content\n *\n * @selector .slds-shrink\n * @modifier\n */\n.slds-shrink {\n  -ms-flex-negative: 1;\n      flex-shrink: 1; }\n\n/**\n * @summary Prevents column from shrinking to children's content\n *\n * @selector .slds-shrink-none\n * @modifier\n */\n.slds-shrink-none {\n  -ms-flex-negative: 0;\n      flex-shrink: 0; }\n\n.slds-text-longform ul.slds-grid {\n  margin-left: 0;\n  list-style: none; }\n\n/**\n * @summary Columns align in the center to the main axis and expand in each direction\n *\n * @selector .slds-grid_align-center\n * @modifier\n */\n.slds-grid_align-center,\n.slds-grid--align-center {\n  -ms-flex-pack: center;\n      justify-content: center; }\n\n.slds-grid_align-center .slds-col,\n.slds-grid_align-center [class*=\"slds-col_padded\"],\n.slds-grid_align-center [class*=\"slds-col--padded\"],\n.slds-grid--align-center .slds-col,\n.slds-grid--align-center [class*=\"slds-col_padded\"],\n.slds-grid--align-center [class*=\"slds-col--padded\"] {\n  -ms-flex-positive: 0;\n      flex-grow: 0; }\n\n/**\n * @summary Columns are evenly distributed with equal space around them all\n *\n * @selector .slds-grid_align-space\n * @modifier\n */\n.slds-grid_align-space,\n.slds-grid--align-space {\n  -ms-flex-pack: distribute;\n      justify-content: space-around; }\n\n.slds-grid_align-space .slds-col,\n.slds-grid_align-space [class*=\"slds-col_padded\"],\n.slds-grid_align-space [class*=\"slds-col--padded\"],\n.slds-grid--align-space .slds-col,\n.slds-grid--align-space [class*=\"slds-col_padded\"],\n.slds-grid--align-space [class*=\"slds-col--padded\"] {\n  -ms-flex-positive: 0;\n      flex-grow: 0; }\n\n/**\n * @summary Columns align to the left and right followed by center. Space is equal between them\n *\n * @selector .slds-grid_align-spread\n * @notes With only two columns &mdash; you can get a similar effect by setting one of the columns to `.slds-no-flex`\n * @modifier\n */\n.slds-grid_align-spread,\n.slds-grid--align-spread {\n  -ms-flex-pack: justify;\n      justify-content: space-between; }\n\n.slds-grid_align-spread .slds-col,\n.slds-grid_align-spread [class*=\"slds-col_padded\"],\n.slds-grid_align-spread [class*=\"slds-col--padded\"],\n.slds-grid--align-spread .slds-col,\n.slds-grid--align-spread [class*=\"slds-col_padded\"],\n.slds-grid--align-spread [class*=\"slds-col--padded\"] {\n  -ms-flex-positive: 0;\n      flex-grow: 0; }\n\n/**\n * @summary Columns start on the opposite end of the grid's main axis\n *\n * @selector .slds-grid_align-end\n * @modifier\n */\n.slds-grid_align-end,\n.slds-grid--align-end {\n  -ms-flex-pack: end;\n      justify-content: flex-end; }\n\n.slds-grid_align-end .slds-col,\n.slds-grid_align-end [class*=\"slds-col_padded\"],\n.slds-grid_align-end [class*=\"slds-col--padded\"],\n.slds-grid--align-end .slds-col,\n.slds-grid--align-end [class*=\"slds-col_padded\"],\n.slds-grid--align-end [class*=\"slds-col--padded\"] {\n  -ms-flex-positive: 0;\n      flex-grow: 0; }\n\n/**\n * @summary Columns start at the beginning of the grid's cross axis\n *\n * @selector .slds-grid_vertical-align-start\n * @modifier\n */\n.slds-grid_vertical-align-start,\n.slds-grid--vertical-align-start {\n  -ms-flex-align: start;\n      align-items: flex-start;\n  -ms-flex-line-pack: start;\n      align-content: flex-start; }\n\n/**\n * @summary Columns align in the center to the cross axis and expand it each direction\n *\n * @selector .slds-grid_vertical-align-center\n * @modifier\n */\n.slds-grid_vertical-align-center,\n.slds-grid--vertical-align-center {\n  -ms-flex-align: center;\n      align-items: center;\n  -ms-flex-line-pack: center;\n      align-content: center; }\n\n/**\n * @summary Columns start on the opposite end of the grid's cross axis\n *\n * @selector .slds-grid_vertical-align-end\n * @modifier\n */\n.slds-grid_vertical-align-end,\n.slds-grid--vertical-align-end {\n  -ms-flex-align: end;\n      align-items: flex-end;\n  -ms-flex-line-pack: end;\n      align-content: flex-end; }\n\n/**\n * @summary Vertically aligns element to top of `.slds-grid`\n *\n * @selector .slds-align-top\n * @modifier\n */\n.slds-align-top {\n  vertical-align: top;\n  -ms-flex-item-align: start;\n      align-self: flex-start; }\n\n/**\n * @summary Vertically aligns element to middle of `.slds-grid`\n *\n * @selector .slds-align-middle\n * @modifier\n */\n.slds-align-middle {\n  vertical-align: middle;\n  -ms-flex-item-align: center;\n      -ms-grid-row-align: center;\n      align-self: center; }\n\n/**\n * @summary Vertically aligns element to bottom of `.slds-grid`\n *\n * @selector .slds-align-bottom\n * @modifier\n */\n.slds-align-bottom {\n  vertical-align: bottom;\n  -ms-flex-item-align: end;\n      align-self: flex-end; }\n\n/**\n * @summary Bumps grid item(s) away from the other grid items to sit at the top, taking up the remaining white-space of the grid container\n *\n * @selector .slds-col_bump-top\n * @modifier\n */\n.slds-col_bump-top,\n.slds-col--bump-top {\n  margin-top: auto; }\n\n/**\n * @summary Bumps grid item(s) away from the other grid items to sit to the right, taking up the remaining white-space of the grid container\n *\n * @selector .slds-col_bump-right\n * @modifier\n */\n.slds-col_bump-right,\n.slds-col--bump-right {\n  margin-right: auto; }\n\n/**\n * @summary Bumps grid item(s) away from the other grid items to sit at the bottom, taking up the remaining white-space of the grid container\n *\n * @selector .slds-col_bump-bottom\n * @modifier\n */\n.slds-col_bump-bottom,\n.slds-col--bump-bottom {\n  margin-right: auto; }\n\n/**\n * @summary Bumps grid item(s) away from the other grid items to sit to the left, taking up the remaining white-space of the grid container\n *\n * @selector .slds-col_bump-left\n * @modifier\n */\n.slds-col_bump-left,\n.slds-col--bump-left {\n  margin-left: auto; }\n\n/**\n * @summary Stretch the grid items for both single row and multi-line rows to fill the height of the parent grid container\n *\n * @selector .slds-grid_vertical-stretch\n * @notes Grid items will stretch the height of the parent grid container by default, unless `&lt;wrap&gt;` is used\n * @modifier\n */\n.slds-grid_vertical-stretch,\n.slds-grid--vertical-stretch {\n  -ms-flex-align: stretch;\n      align-items: stretch;\n  -ms-flex-line-pack: stretch;\n      align-content: stretch; }\n\n/**\n * @summary Restrict width of containers to a maximum of 480px\n *\n * @selector .slds-container_small\n * @modifier\n */\n.slds-container_small,\n.slds-container--small {\n  max-width: 30rem; }\n\n/**\n * @summary Restrict width of containers to a maximum of 768px\n *\n * @selector .slds-container_medium\n * @modifier\n */\n.slds-container_medium,\n.slds-container--medium {\n  max-width: 48rem; }\n\n/**\n * @summary Restrict width of containers to a maximum of 1024px\n *\n * @selector .slds-container_large\n * @modifier\n */\n.slds-container_large,\n.slds-container--large {\n  max-width: 64rem; }\n\n/**\n * @summary Restrict width of containers to a maximum of 1280px\n *\n * @selector .slds-container_x-large\n * @modifier\n */\n.slds-container_x-large,\n.slds-container--x-large {\n  max-width: 80rem; }\n\n/**\n * @summary Width of container takes up 100% of viewport\n *\n * @selector .slds-container_fluid\n * @modifier\n */\n.slds-container_fluid,\n.slds-container--fluid {\n  width: 100%; }\n\n/**\n * @summary Horizontally positions containers in the center of the viewport\n *\n * @selector .slds-container_center\n * @modifier\n */\n.slds-container_center,\n.slds-container--center {\n  margin-left: auto;\n  margin-right: auto; }\n\n/**\n * @summary Horizontally positions containers to the left of the viewport\n *\n * @selector .slds-container_left\n * @modifier\n */\n.slds-container_left,\n.slds-container--left {\n  margin-right: auto; }\n\n/**\n * @summary Horizontally positions containers to the right of the viewport\n *\n * @selector .slds-container_right\n * @modifier\n */\n.slds-container_right,\n.slds-container--right {\n  margin-left: auto; }\n\n.slds-grid_overflow,\n.slds-grid--overflow {\n  -ms-flex-flow: row nowrap;\n      flex-flow: row nowrap; }\n\n.slds-grid_overflow .slds-col,\n.slds-grid--overflow .slds-col {\n  min-width: 11.25em;\n  max-width: 22.5em; }\n\n/**\n * @summary Class will absolutely center children content\n *\n * @name absolute-center\n * @selector .slds-align_absolute-center\n * @modifier\n */\n.slds-align_absolute-center,\n.slds-align--absolute-center {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: center;\n      justify-content: center;\n  -ms-flex-line-pack: center;\n      align-content: center;\n  -ms-flex-align: center;\n      align-items: center;\n  margin: auto; }\n\n/**\n * @summary Creates media object\n *\n * @selector .slds-media\n * @modifier\n */\n.slds-media {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: start;\n      align-items: flex-start;\n  /**\n   * Defines the figure area\n   *\n   * @selector .slds-media__figure\n   */\n  /**\n   * Defines the body area\n   *\n   * @selector .slds-media__body\n   * @modifier\n   */ }\n\n.slds-media__figure {\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  margin-right: 0.75rem; }\n\n.slds-media__figure_fixed-width {\n  min-width: 3rem; }\n\n.slds-media__body {\n  -ms-flex: 1;\n      flex: 1;\n  min-width: 0; }\n\n.slds-media__body,\n.slds-media__body > :last-child {\n  margin-bottom: 0; }\n\n.slds-media-body-iefix {\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  -ms-flex-preferred-size: auto;\n      flex-basis: auto; }\n\n/**\n * Adjusts whitespace on smaller media objects\n *\n * @selector .slds-media_small\n * @modifier\n */\n.slds-media_small .slds-media__figure,\n.slds-media--small .slds-media__figure {\n  margin-right: 0.25rem; }\n\n.slds-media_small .slds-media__figure_reverse,\n.slds-media--small .slds-media__figure--reverse {\n  margin-left: 0.25rem; }\n\n/**\n * Adjusts whitespace on larger media objects\n *\n * @selector .slds-media_large\n * @modifier\n */\n.slds-media_large .slds-media__figure,\n.slds-media--large .slds-media__figure {\n  margin-right: 1.5rem; }\n\n.slds-media_large .slds-media__figure_reverse,\n.slds-media--large .slds-media__figure--reverse {\n  margin-left: 1.5rem; }\n\n/**\n * Aligns the figure and body to be inline-block of each other\n *\n * @selector .slds-media_inline\n * @modifier\n */\n.slds-media_inline .slds-media__body {\n  -ms-flex: 0 1 auto;\n      flex: 0 1 auto; }\n\n/**\n * Aligns the content in the .slds-media__body to the middle of the .slds-media__figure\n *\n * @selector .slds-media_center\n * @modifier\n */\n.slds-media_center,\n.slds-media--center {\n  -ms-flex-align: center;\n      align-items: center; }\n\n/**\n * Defines the figure area on the other side\n *\n * @selector .slds-media__figure_reverse\n * @modifier\n */\n.slds-media__figure_reverse,\n.slds-media__figure--reverse {\n  margin: 0 0 0 0.75rem; }\n\n.slds-media_reverse > .slds-media__figure,\n.slds-media--reverse > .slds-media__figure {\n  -ms-flex-order: 1;\n      order: 1; }\n\n.slds-media_reverse.slds-media_small .slds-media__figure,\n.slds-media_reverse.slds-media--small .slds-media__figure,\n.slds-media--reverse.slds-media_small .slds-media__figure,\n.slds-media--reverse.slds-media--small .slds-media__figure {\n  margin-left: 0.25rem; }\n\n.slds-media_double > .slds-media__figure,\n.slds-media--double > .slds-media__figure {\n  -ms-flex-order: 1;\n      order: 1; }\n\n.slds-media_double .slds-media__figure_reverse,\n.slds-media_double .slds-media__figure--reverse,\n.slds-media--double .slds-media__figure_reverse,\n.slds-media--double .slds-media__figure--reverse {\n  -ms-flex-order: 3;\n      order: 3;\n  margin: 0 0 0 1rem; }\n\n.slds-media_double .slds-media__body,\n.slds-media--double .slds-media__body {\n  -ms-flex-order: 2;\n      order: 2; }\n\n@media (max-width: 48em) {\n  /**\n   * @summary .slds-media__figure and .slds-media__body stack on smaller screens\n   *\n   * @selector .slds-media_responsive\n   * @modifer\n   */\n  .slds-media_responsive,\n  .slds-media--responsive {\n    display: block; }\n  .slds-media_responsive .slds-media__figure,\n  .slds-media--responsive .slds-media__figure {\n    margin: 0 0 0.75rem; } }\n\n/**\n * Adds .125rem margin to the side specified\n *\n * @selector .slds-m-*_xxx-small\n * @modifier\n */\n/**\n * Adds .25rem margin to the side specified\n *\n * @selector .slds-m-*_xx-small\n * @modifier\n */\n/**\n * Adds .5rem margin to the side specified\n *\n * @selector .slds-m-*_x-small\n * @modifier\n */\n/**\n * Adds .75rem margin to the side specified\n *\n * @selector .slds-m-*_small\n * @modifier\n */\n/**\n * Adds 1rem margin to the side specified\n *\n * @selector .slds-m-*_medium\n * @modifier\n */\n/**\n * Adds 1.5rem margin to the side specified\n *\n * @selector .slds-m-*_large\n * @modifier\n */\n/**\n * Adds 2rem margin to the side specified\n *\n * @selector .slds-m-*_x-large\n * @modifier\n */\n/**\n * Adds 3rem margin to the side specified\n *\n * @selector .slds-m-*_xx-large\n * @modifier\n */\n/**\n * Adds the specified margin to both top and bottom\n *\n * @selector .slds-m-*-vertical_*\n * @modifier\n */\n/**\n * Adds the specified margin to both sides\n *\n * @selector .slds-m-*-horizontal_*\n * @modifier\n */\n/**\n * Adds the specified margin all the way around the element\n *\n * @selector .slds-m-*-around_*\n * @modifier\n */\n.slds-m-top_x-small,\n.slds-m-top--x-small {\n  margin-top: 0.5rem; }\n\n.slds-m-right_x-small,\n.slds-m-right--x-small {\n  margin-right: 0.5rem; }\n\n.slds-m-bottom_x-small,\n.slds-m-bottom--x-small {\n  margin-bottom: 0.5rem; }\n\n.slds-m-left_x-small,\n.slds-m-left--x-small {\n  margin-left: 0.5rem; }\n\n.slds-m-vertical_x-small,\n.slds-m-vertical--x-small {\n  margin-top: 0.5rem;\n  margin-bottom: 0.5rem; }\n\n.slds-m-horizontal_x-small,\n.slds-m-horizontal--x-small {\n  margin-right: 0.5rem;\n  margin-left: 0.5rem; }\n\n.slds-m-around_x-small,\n.slds-m-around--x-small {\n  margin: 0.5rem; }\n\n.slds-m-top_xxx-small,\n.slds-m-top--xxx-small {\n  margin-top: 0.125rem; }\n\n.slds-m-right_xxx-small,\n.slds-m-right--xxx-small {\n  margin-right: 0.125rem; }\n\n.slds-m-bottom_xxx-small,\n.slds-m-bottom--xxx-small {\n  margin-bottom: 0.125rem; }\n\n.slds-m-left_xxx-small,\n.slds-m-left--xxx-small {\n  margin-left: 0.125rem; }\n\n.slds-m-vertical_xxx-small,\n.slds-m-vertical--xxx-small {\n  margin-top: 0.125rem;\n  margin-bottom: 0.125rem; }\n\n.slds-m-horizontal_xxx-small,\n.slds-m-horizontal--xxx-small {\n  margin-right: 0.125rem;\n  margin-left: 0.125rem; }\n\n.slds-m-around_xxx-small,\n.slds-m-around--xxx-small {\n  margin: 0.125rem; }\n\n.slds-m-top_xx-small,\n.slds-m-top--xx-small {\n  margin-top: 0.25rem; }\n\n.slds-m-right_xx-small,\n.slds-m-right--xx-small {\n  margin-right: 0.25rem; }\n\n.slds-m-bottom_xx-small,\n.slds-m-bottom--xx-small {\n  margin-bottom: 0.25rem; }\n\n.slds-m-left_xx-small,\n.slds-m-left--xx-small {\n  margin-left: 0.25rem; }\n\n.slds-m-vertical_xx-small,\n.slds-m-vertical--xx-small {\n  margin-top: 0.25rem;\n  margin-bottom: 0.25rem; }\n\n.slds-m-horizontal_xx-small,\n.slds-m-horizontal--xx-small {\n  margin-right: 0.25rem;\n  margin-left: 0.25rem; }\n\n.slds-m-around_xx-small,\n.slds-m-around--xx-small {\n  margin: 0.25rem; }\n\n.slds-m-top_card-wrapper-spacing,\n.slds-m-top--card-wrapper-spacing {\n  margin-top: 1rem; }\n\n.slds-m-right_card-wrapper-spacing,\n.slds-m-right--card-wrapper-spacing {\n  margin-right: 1rem; }\n\n.slds-m-bottom_card-wrapper-spacing,\n.slds-m-bottom--card-wrapper-spacing {\n  margin-bottom: 1rem; }\n\n.slds-m-left_card-wrapper-spacing,\n.slds-m-left--card-wrapper-spacing {\n  margin-left: 1rem; }\n\n.slds-m-vertical_card-wrapper-spacing,\n.slds-m-vertical--card-wrapper-spacing {\n  margin-top: 1rem;\n  margin-bottom: 1rem; }\n\n.slds-m-horizontal_card-wrapper-spacing,\n.slds-m-horizontal--card-wrapper-spacing {\n  margin-right: 1rem;\n  margin-left: 1rem; }\n\n.slds-m-around_card-wrapper-spacing,\n.slds-m-around--card-wrapper-spacing {\n  margin: 1rem; }\n\n.slds-m-top_small,\n.slds-m-top--small {\n  margin-top: 0.75rem; }\n\n.slds-m-right_small,\n.slds-m-right--small {\n  margin-right: 0.75rem; }\n\n.slds-m-bottom_small,\n.slds-m-bottom--small {\n  margin-bottom: 0.75rem; }\n\n.slds-m-left_small,\n.slds-m-left--small {\n  margin-left: 0.75rem; }\n\n.slds-m-vertical_small,\n.slds-m-vertical--small {\n  margin-top: 0.75rem;\n  margin-bottom: 0.75rem; }\n\n.slds-m-horizontal_small,\n.slds-m-horizontal--small {\n  margin-right: 0.75rem;\n  margin-left: 0.75rem; }\n\n.slds-m-around_small,\n.slds-m-around--small {\n  margin: 0.75rem; }\n\n.slds-m-top_medium,\n.slds-m-top--medium {\n  margin-top: 1rem; }\n\n.slds-m-right_medium,\n.slds-m-right--medium {\n  margin-right: 1rem; }\n\n.slds-m-bottom_medium,\n.slds-m-bottom--medium {\n  margin-bottom: 1rem; }\n\n.slds-m-left_medium,\n.slds-m-left--medium {\n  margin-left: 1rem; }\n\n.slds-m-vertical_medium,\n.slds-m-vertical--medium {\n  margin-top: 1rem;\n  margin-bottom: 1rem; }\n\n.slds-m-horizontal_medium,\n.slds-m-horizontal--medium {\n  margin-right: 1rem;\n  margin-left: 1rem; }\n\n.slds-m-around_medium,\n.slds-m-around--medium {\n  margin: 1rem; }\n\n.slds-m-top_none,\n.slds-m-top--none {\n  margin-top: 0 !important; }\n\n.slds-m-right_none,\n.slds-m-right--none {\n  margin-right: 0 !important; }\n\n.slds-m-bottom_none,\n.slds-m-bottom--none {\n  margin-bottom: 0 !important; }\n\n.slds-m-left_none,\n.slds-m-left--none {\n  margin-left: 0 !important; }\n\n.slds-m-vertical_none,\n.slds-m-vertical--none {\n  margin-top: 0;\n  margin-bottom: 0; }\n\n.slds-m-horizontal_none,\n.slds-m-horizontal--none {\n  margin-right: 0;\n  margin-left: 0; }\n\n.slds-m-around_none,\n.slds-m-around--none {\n  margin: 0; }\n\n.slds-m-top_table-cell-spacing,\n.slds-m-top--table-cell-spacing {\n  margin-top: 0.5rem; }\n\n.slds-m-right_table-cell-spacing,\n.slds-m-right--table-cell-spacing {\n  margin-right: 0.5rem; }\n\n.slds-m-bottom_table-cell-spacing,\n.slds-m-bottom--table-cell-spacing {\n  margin-bottom: 0.5rem; }\n\n.slds-m-left_table-cell-spacing,\n.slds-m-left--table-cell-spacing {\n  margin-left: 0.5rem; }\n\n.slds-m-vertical_table-cell-spacing,\n.slds-m-vertical--table-cell-spacing {\n  margin-top: 0.5rem;\n  margin-bottom: 0.5rem; }\n\n.slds-m-horizontal_table-cell-spacing,\n.slds-m-horizontal--table-cell-spacing {\n  margin-right: 0.5rem;\n  margin-left: 0.5rem; }\n\n.slds-m-around_table-cell-spacing,\n.slds-m-around--table-cell-spacing {\n  margin: 0.5rem; }\n\n.slds-m-top_x-large,\n.slds-m-top--x-large {\n  margin-top: 2rem; }\n\n.slds-m-right_x-large,\n.slds-m-right--x-large {\n  margin-right: 2rem; }\n\n.slds-m-bottom_x-large,\n.slds-m-bottom--x-large {\n  margin-bottom: 2rem; }\n\n.slds-m-left_x-large,\n.slds-m-left--x-large {\n  margin-left: 2rem; }\n\n.slds-m-vertical_x-large,\n.slds-m-vertical--x-large {\n  margin-top: 2rem;\n  margin-bottom: 2rem; }\n\n.slds-m-horizontal_x-large,\n.slds-m-horizontal--x-large {\n  margin-right: 2rem;\n  margin-left: 2rem; }\n\n.slds-m-around_x-large,\n.slds-m-around--x-large {\n  margin: 2rem; }\n\n.slds-m-top_xx-large,\n.slds-m-top--xx-large {\n  margin-top: 3rem; }\n\n.slds-m-right_xx-large,\n.slds-m-right--xx-large {\n  margin-right: 3rem; }\n\n.slds-m-bottom_xx-large,\n.slds-m-bottom--xx-large {\n  margin-bottom: 3rem; }\n\n.slds-m-left_xx-large,\n.slds-m-left--xx-large {\n  margin-left: 3rem; }\n\n.slds-m-vertical_xx-large,\n.slds-m-vertical--xx-large {\n  margin-top: 3rem;\n  margin-bottom: 3rem; }\n\n.slds-m-horizontal_xx-large,\n.slds-m-horizontal--xx-large {\n  margin-right: 3rem;\n  margin-left: 3rem; }\n\n.slds-m-around_xx-large,\n.slds-m-around--xx-large {\n  margin: 3rem; }\n\n.slds-m-top_large,\n.slds-m-top--large {\n  margin-top: 1.5rem; }\n\n.slds-m-right_large,\n.slds-m-right--large {\n  margin-right: 1.5rem; }\n\n.slds-m-bottom_large,\n.slds-m-bottom--large {\n  margin-bottom: 1.5rem; }\n\n.slds-m-left_large,\n.slds-m-left--large {\n  margin-left: 1.5rem; }\n\n.slds-m-vertical_large,\n.slds-m-vertical--large {\n  margin-top: 1.5rem;\n  margin-bottom: 1.5rem; }\n\n.slds-m-horizontal_large,\n.slds-m-horizontal--large {\n  margin-right: 1.5rem;\n  margin-left: 1.5rem; }\n\n.slds-m-around_large,\n.slds-m-around--large {\n  margin: 1.5rem; }\n\n.slds-m-bottom_none,\n.slds-m-bottom--none {\n  margin-bottom: 0; }\n\n/**\n * Adds .125rem padding to the side specified\n *\n * @selector .slds-p-*_xxx-small\n * @modifier\n */\n/**\n * Adds .25rem padding to the side specified\n *\n * @selector .slds-p-*_xx-small\n * @modifier\n */\n/**\n * Adds .5rem padding to the side specified\n *\n * @selector .slds-p-*_x-small\n * @modifier\n */\n/**\n * Adds .75rem padding to the side specified\n *\n * @selector .slds-p-*_small\n * @modifier\n */\n/**\n * Adds 1rem padding to the side specified\n *\n * @selector .slds-p-*_medium\n * @modifier\n */\n/**\n * Adds 1.5rem padding to the side specified\n *\n * @selector .slds-p-*_large\n * @modifier\n */\n/**\n * Adds 2rem padding to the side specified\n *\n * @selector .slds-p-*_x-large\n * @modifier\n */\n/**\n * Adds 3rem padding to the side specified\n *\n * @selector .slds-p-*_xx-large\n * @modifier\n */\n/**\n * Adds the specified padding to both top and bottom\n *\n * @selector .slds-p-*-vertical_*\n * @modifier\n */\n/**\n * Adds the specified padding to both sides\n *\n * @selector .slds-p-*-horizontal_*\n * @modifier\n */\n/**\n * Adds the specified padding all the way around the element\n *\n * @selector .slds-p-*-around_*\n * @modifier\n */\n.slds-p-top_x-small,\n.slds-p-top--x-small {\n  padding-top: 0.5rem; }\n\n.slds-p-right_x-small,\n.slds-p-right--x-small {\n  padding-right: 0.5rem; }\n\n.slds-p-bottom_x-small,\n.slds-p-bottom--x-small {\n  padding-bottom: 0.5rem; }\n\n.slds-p-left_x-small,\n.slds-p-left--x-small {\n  padding-left: 0.5rem; }\n\n.slds-p-vertical_x-small,\n.slds-p-vertical--x-small {\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem; }\n\n.slds-p-horizontal_x-small,\n.slds-p-horizontal--x-small {\n  padding-right: 0.5rem;\n  padding-left: 0.5rem; }\n\n.slds-p-around_x-small,\n.slds-p-around--x-small {\n  padding: 0.5rem; }\n\n.slds-p-top_xxx-small,\n.slds-p-top--xxx-small {\n  padding-top: 0.125rem; }\n\n.slds-p-right_xxx-small,\n.slds-p-right--xxx-small {\n  padding-right: 0.125rem; }\n\n.slds-p-bottom_xxx-small,\n.slds-p-bottom--xxx-small {\n  padding-bottom: 0.125rem; }\n\n.slds-p-left_xxx-small,\n.slds-p-left--xxx-small {\n  padding-left: 0.125rem; }\n\n.slds-p-vertical_xxx-small,\n.slds-p-vertical--xxx-small {\n  padding-top: 0.125rem;\n  padding-bottom: 0.125rem; }\n\n.slds-p-horizontal_xxx-small,\n.slds-p-horizontal--xxx-small {\n  padding-right: 0.125rem;\n  padding-left: 0.125rem; }\n\n.slds-p-around_xxx-small,\n.slds-p-around--xxx-small {\n  padding: 0.125rem; }\n\n.slds-p-top_xx-small,\n.slds-p-top--xx-small {\n  padding-top: 0.25rem; }\n\n.slds-p-right_xx-small,\n.slds-p-right--xx-small {\n  padding-right: 0.25rem; }\n\n.slds-p-bottom_xx-small,\n.slds-p-bottom--xx-small {\n  padding-bottom: 0.25rem; }\n\n.slds-p-left_xx-small,\n.slds-p-left--xx-small {\n  padding-left: 0.25rem; }\n\n.slds-p-vertical_xx-small,\n.slds-p-vertical--xx-small {\n  padding-top: 0.25rem;\n  padding-bottom: 0.25rem; }\n\n.slds-p-horizontal_xx-small,\n.slds-p-horizontal--xx-small {\n  padding-right: 0.25rem;\n  padding-left: 0.25rem; }\n\n.slds-p-around_xx-small,\n.slds-p-around--xx-small {\n  padding: 0.25rem; }\n\n.slds-p-top_card-wrapper-spacing,\n.slds-p-top--card-wrapper-spacing {\n  padding-top: 1rem; }\n\n.slds-p-right_card-wrapper-spacing,\n.slds-p-right--card-wrapper-spacing {\n  padding-right: 1rem; }\n\n.slds-p-bottom_card-wrapper-spacing,\n.slds-p-bottom--card-wrapper-spacing {\n  padding-bottom: 1rem; }\n\n.slds-p-left_card-wrapper-spacing,\n.slds-p-left--card-wrapper-spacing {\n  padding-left: 1rem; }\n\n.slds-p-vertical_card-wrapper-spacing,\n.slds-p-vertical--card-wrapper-spacing {\n  padding-top: 1rem;\n  padding-bottom: 1rem; }\n\n.slds-p-horizontal_card-wrapper-spacing,\n.slds-p-horizontal--card-wrapper-spacing {\n  padding-right: 1rem;\n  padding-left: 1rem; }\n\n.slds-p-around_card-wrapper-spacing,\n.slds-p-around--card-wrapper-spacing {\n  padding: 1rem; }\n\n.slds-p-top_small,\n.slds-p-top--small {\n  padding-top: 0.75rem; }\n\n.slds-p-right_small,\n.slds-p-right--small {\n  padding-right: 0.75rem; }\n\n.slds-p-bottom_small,\n.slds-p-bottom--small {\n  padding-bottom: 0.75rem; }\n\n.slds-p-left_small,\n.slds-p-left--small {\n  padding-left: 0.75rem; }\n\n.slds-p-vertical_small,\n.slds-p-vertical--small {\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem; }\n\n.slds-p-horizontal_small,\n.slds-p-horizontal--small {\n  padding-right: 0.75rem;\n  padding-left: 0.75rem; }\n\n.slds-p-around_small,\n.slds-p-around--small {\n  padding: 0.75rem; }\n\n.slds-p-top_medium,\n.slds-p-top--medium {\n  padding-top: 1rem; }\n\n.slds-p-right_medium,\n.slds-p-right--medium {\n  padding-right: 1rem; }\n\n.slds-p-bottom_medium,\n.slds-p-bottom--medium {\n  padding-bottom: 1rem; }\n\n.slds-p-left_medium,\n.slds-p-left--medium {\n  padding-left: 1rem; }\n\n.slds-p-vertical_medium,\n.slds-p-vertical--medium {\n  padding-top: 1rem;\n  padding-bottom: 1rem; }\n\n.slds-p-horizontal_medium,\n.slds-p-horizontal--medium {\n  padding-right: 1rem;\n  padding-left: 1rem; }\n\n.slds-p-around_medium,\n.slds-p-around--medium {\n  padding: 1rem; }\n\n.slds-p-top_none,\n.slds-p-top--none {\n  padding-top: 0 !important; }\n\n.slds-p-right_none,\n.slds-p-right--none {\n  padding-right: 0 !important; }\n\n.slds-p-bottom_none,\n.slds-p-bottom--none {\n  padding-bottom: 0 !important; }\n\n.slds-p-left_none,\n.slds-p-left--none {\n  padding-left: 0 !important; }\n\n.slds-p-vertical_none,\n.slds-p-vertical--none {\n  padding-top: 0;\n  padding-bottom: 0; }\n\n.slds-p-horizontal_none,\n.slds-p-horizontal--none {\n  padding-right: 0;\n  padding-left: 0; }\n\n.slds-p-around_none,\n.slds-p-around--none {\n  padding: 0; }\n\n.slds-p-top_table-cell-spacing,\n.slds-p-top--table-cell-spacing {\n  padding-top: 0.5rem; }\n\n.slds-p-right_table-cell-spacing,\n.slds-p-right--table-cell-spacing {\n  padding-right: 0.5rem; }\n\n.slds-p-bottom_table-cell-spacing,\n.slds-p-bottom--table-cell-spacing {\n  padding-bottom: 0.5rem; }\n\n.slds-p-left_table-cell-spacing,\n.slds-p-left--table-cell-spacing {\n  padding-left: 0.5rem; }\n\n.slds-p-vertical_table-cell-spacing,\n.slds-p-vertical--table-cell-spacing {\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem; }\n\n.slds-p-horizontal_table-cell-spacing,\n.slds-p-horizontal--table-cell-spacing {\n  padding-right: 0.5rem;\n  padding-left: 0.5rem; }\n\n.slds-p-around_table-cell-spacing,\n.slds-p-around--table-cell-spacing {\n  padding: 0.5rem; }\n\n.slds-p-top_x-large,\n.slds-p-top--x-large {\n  padding-top: 2rem; }\n\n.slds-p-right_x-large,\n.slds-p-right--x-large {\n  padding-right: 2rem; }\n\n.slds-p-bottom_x-large,\n.slds-p-bottom--x-large {\n  padding-bottom: 2rem; }\n\n.slds-p-left_x-large,\n.slds-p-left--x-large {\n  padding-left: 2rem; }\n\n.slds-p-vertical_x-large,\n.slds-p-vertical--x-large {\n  padding-top: 2rem;\n  padding-bottom: 2rem; }\n\n.slds-p-horizontal_x-large,\n.slds-p-horizontal--x-large {\n  padding-right: 2rem;\n  padding-left: 2rem; }\n\n.slds-p-around_x-large,\n.slds-p-around--x-large {\n  padding: 2rem; }\n\n.slds-p-top_xx-large,\n.slds-p-top--xx-large {\n  padding-top: 3rem; }\n\n.slds-p-right_xx-large,\n.slds-p-right--xx-large {\n  padding-right: 3rem; }\n\n.slds-p-bottom_xx-large,\n.slds-p-bottom--xx-large {\n  padding-bottom: 3rem; }\n\n.slds-p-left_xx-large,\n.slds-p-left--xx-large {\n  padding-left: 3rem; }\n\n.slds-p-vertical_xx-large,\n.slds-p-vertical--xx-large {\n  padding-top: 3rem;\n  padding-bottom: 3rem; }\n\n.slds-p-horizontal_xx-large,\n.slds-p-horizontal--xx-large {\n  padding-right: 3rem;\n  padding-left: 3rem; }\n\n.slds-p-around_xx-large,\n.slds-p-around--xx-large {\n  padding: 3rem; }\n\n.slds-p-top_large,\n.slds-p-top--large {\n  padding-top: 1.5rem; }\n\n.slds-p-right_large,\n.slds-p-right--large {\n  padding-right: 1.5rem; }\n\n.slds-p-bottom_large,\n.slds-p-bottom--large {\n  padding-bottom: 1.5rem; }\n\n.slds-p-left_large,\n.slds-p-left--large {\n  padding-left: 1.5rem; }\n\n.slds-p-vertical_large,\n.slds-p-vertical--large {\n  padding-top: 1.5rem;\n  padding-bottom: 1.5rem; }\n\n.slds-p-horizontal_large,\n.slds-p-horizontal--large {\n  padding-right: 1.5rem;\n  padding-left: 1.5rem; }\n\n.slds-p-around_large,\n.slds-p-around--large {\n  padding: 1.5rem; }\n\n/**\n * @summary Global padding that can be applied to any element\n *\n * @selector .slds-has-cushion\n * @modifier\n */\n.slds-has-cushion {\n  padding: 1rem; }\n\n/**\n * @summary Contains floats and stops wrapping of elements following it.\n *\n * @name clearfix\n * @selector .slds-clearfix\n * @modifier\n */\n.slds-clearfix:after {\n  content: '';\n  display: table;\n  clear: both; }\n\n.slds-clear {\n  clear: both; }\n\n/**\n * @summary Pulls element from document flow and floats left. Text and other elements wrap around it.\n *\n * @name float-left\n * @selector .slds-float_left\n * @modifier\n */\n.slds-float_left,\n.slds-float--left {\n  float: left; }\n\n/**\n * @summary Removes float from an element that has attribute already\n *\n * @name float-none\n * @selector .slds-float_none\n * @modifier\n */\n.slds-float_none,\n.slds-float--none {\n  float: none; }\n\n/**\n * @summary Pulls element from document flow and floats right. Text and other elements wrap around it.\n *\n * @name float-right\n * @selector .slds-float_right\n * @modifier\n */\n.slds-float_right,\n.slds-float--right {\n  float: right; }\n\n/**\n * @summary Makes links and buttons appear as regular text\n *\n * @selector .slds-text-link_reset\n * @modifier\n */\n.slds-text-link_reset,\n.slds-text-link--reset {\n  cursor: pointer;\n  line-height: inherit;\n  font-size: inherit; }\n\n.slds-text-link_reset:active,\n.slds-text-link--reset:active {\n  outline: none; }\n\n.slds-text-link_reset, .slds-text-link_reset:active, .slds-text-link_reset:focus, .slds-text-link_reset:hover,\n.slds-text-link--reset,\n.slds-text-link--reset:active,\n.slds-text-link--reset:focus,\n.slds-text-link--reset:hover {\n  color: inherit;\n  text-decoration: inherit; }\n\n/**\n * Used in combination with `.slds-text-link--reset`, you can apply the class `.slds-text-link` to a child element to reset its styles back to that of a link.\n *\n * @summary Makes text inside of .slds-text-link_reset to appear as a link.\n *\n * @selector .slds-text-link\n * @modifier\n */\n.slds-text-link {\n  color: #0070d2;\n  text-decoration: none;\n  transition: color 0.1s linear; }\n\n.slds-text-link:hover, .slds-text-link:focus {\n  text-decoration: underline;\n  color: #005fb2; }\n\n.slds-text-link:active {\n  color: #005fb2; }\n\n/**\n * Faux links are used on areas that can't be wrapped in an `a` element, but need to appear to be a link with an underline on hover. An example is in the page header for Object home. The `H1` and `button` that sit next to each other have the `.slds-text-link--faux` class on their parent element.\n *\n * @summary Creates a faux link with hover interactions\n *\n * @selector .slds-text-link_faux\n * @notes This is used when an actual anchor element can not be used. For example &mdash; when a heading and button are next to each other and both need the text underline\n * @modifier\n */\n.slds-text-link--faux,\n.slds-text-link_faux,\n.slds-type-focus {\n  border-bottom: 1px solid transparent;\n  border-radius: 0;\n  color: currentColor;\n  cursor: pointer; }\n\n.slds-text-link--faux:hover, .slds-text-link--faux:focus,\n.slds-text-link_faux:hover,\n.slds-text-link_faux:focus,\n.slds-type-focus:hover,\n.slds-type-focus:focus {\n  color: currentColor;\n  border-bottom: 1px solid currentColor; }\n\n/**\n * @summary Blur focus is an accessibility class that will add a blurred border to an element when it is focused.\n *\n * @selector .slds-has-blur-focus\n * @modifier\n */\n.slds-has-blur-focus {\n  color: currentColor; }\n\n.slds-has-blur-focus:hover, .slds-has-blur-focus:focus, .slds-has-blur-focus:active {\n  color: currentColor;\n  text-decoration: none; }\n\n.slds-has-blur-focus:focus {\n  outline: 0;\n  box-shadow: 0 0 3px #0070D2; }\n\n/**\n * Input focus styles, this is applied via JavaScript when needing to apply focus styles to a containing element when the input gets focus\n *\n * @selector .slds-has-input-focus\n * @modifier\n */\n.slds-has-input-focus {\n  outline: 0;\n  border-color: #1589ee;\n  background-color: white;\n  box-shadow: 0 0 3px #0070D2; }\n\n.slds-has-block-links a {\n  display: block;\n  text-decoration: none; }\n\n.slds-has-block-links .slds-is-nested {\n  margin-left: 1rem; }\n\n.slds-has-block-links_space .slds-list__item,\n.slds-has-block-links_space .slds-item, .slds-has-block-links--space .slds-list__item,\n.slds-has-block-links--space .slds-item {\n  padding: 0; }\n\n.slds-has-block-links_space a, .slds-has-block-links--space a {\n  display: block;\n  text-decoration: none;\n  padding: 0.75rem; }\n\n@media (min-width: 48em) {\n  .slds-has-block-links_space a, .slds-has-block-links--space a {\n    padding: 0.5rem; } }\n\n.slds-has-inline-block-links a {\n  display: inline-block;\n  text-decoration: none; }\n\n.slds-has-inline-block-links_space a,\n.slds-has-inline-block-links--space a {\n  display: inline-block;\n  text-decoration: none;\n  padding: 0.75rem; }\n\n@media (min-width: 48em) {\n  .slds-has-inline-block-links_space a,\n  .slds-has-inline-block-links--space a {\n    padding: 0.5rem; } }\n\n/**\n * @summary Marks a vertical list with .5rem spacing around\n *\n * @selector .slds-list_vertical-space\n * @modifier\n */\n.slds-list_vertical-space .slds-list__item + .slds-list__item,\n.slds-list_vertical-space .slds-item + .slds-item,\n.slds-list--vertical-space .slds-list__item + .slds-list__item,\n.slds-list--vertical-space .slds-item + .slds-item {\n  margin-top: 0.5rem; }\n\n/**\n * @summary Marks a vertical list with 1rem spacing around\n *\n * @selector .slds-list_vertical-space-medium\n * @modifier\n */\n.slds-list_vertical-space-medium .slds-list__item + .slds-list__item,\n.slds-list_vertical-space-medium .slds-item + .slds-item,\n.slds-list--vertical-space-medium .slds-list__item + .slds-list__item,\n.slds-list--vertical-space-medium .slds-item + .slds-item {\n  margin-top: 1rem; }\n\n/**\n * @summary Provides styles for a nested lists\n *\n * @selector .slds-is-nested\n * @modifier\n */\n.slds-is-nested {\n  margin-left: 1rem; }\n\n/**\n * @summary Creates an unordered list with markers\n *\n * @selector .slds-list_dotted\n * @modifier\n */\n.slds-list_dotted,\n.slds-list--dotted {\n  margin-left: 1.5rem;\n  list-style: disc; }\n\n/**\n * @summary Creates an ordered list with decimals\n *\n * @selector .slds-list_ordered\n * @modifier\n */\n.slds-list_ordered,\n.slds-list--ordered {\n  margin-left: 1.5rem;\n  list-style: decimal; }\n\n/**\n * @summary Adds 1px border divider above list items\n *\n * @selector .slds-has-dividers_top\n * @modifier\n */\n.slds-has-dividers_top,\n.slds-has-dividers--top {\n  /**\n   * @summary Adds 1px border divider above list items and 0.5rem padding between items\n   *\n   * @selector .slds-has-dividers_top-space\n   * @modifier\n   */ }\n\n.slds-has-dividers_top > .slds-list__item,\n.slds-has-dividers_top > .slds-item,\n.slds-has-dividers--top > .slds-list__item,\n.slds-has-dividers--top > .slds-item {\n  border-top: 1px solid #dddbda; }\n\n.slds-has-dividers_top-space > .slds-list__item,\n.slds-has-dividers_top-space > .slds-item,\n.slds-has-dividers--top-space > .slds-list__item,\n.slds-has-dividers--top-space > .slds-item {\n  border-top: 1px solid #dddbda;\n  padding: 0.75rem; }\n\n@media (min-width: 30em) {\n  .slds-has-dividers_top-space > .slds-list__item,\n  .slds-has-dividers_top-space > .slds-item,\n  .slds-has-dividers--top-space > .slds-list__item,\n  .slds-has-dividers--top-space > .slds-item {\n    padding: 0.5rem; } }\n\n/**\n * @summary Adds 1px border divider below list items\n *\n * @selector .slds-has-dividers_top\n * @modifier\n */\n.slds-has-dividers_bottom,\n.slds-has-dividers--bottom {\n  /**\n   * @summary Adds 1px border divider below list items and 0.5rem padding between items\n   *\n   * @selector .slds-has-dividers_bottom-space\n   * @modifier\n   */ }\n\n.slds-has-dividers_bottom > .slds-list__item,\n.slds-has-dividers_bottom > .slds-item,\n.slds-has-dividers--bottom > .slds-list__item,\n.slds-has-dividers--bottom > .slds-item {\n  border-bottom: 1px solid #dddbda; }\n\n.slds-has-dividers_bottom-space > .slds-list__item,\n.slds-has-dividers_bottom-space > .slds-item,\n.slds-has-dividers--bottom-space > .slds-list__item,\n.slds-has-dividers--bottom-space > .slds-item {\n  border-bottom: 1px solid #dddbda;\n  padding: 0.75rem; }\n\n@media (min-width: 30em) {\n  .slds-has-dividers_bottom-space > .slds-list__item,\n  .slds-has-dividers_bottom-space > .slds-item,\n  .slds-has-dividers--bottom-space > .slds-list__item,\n  .slds-has-dividers--bottom-space > .slds-item {\n    padding: 0.5rem; } }\n\n/**\n * @summary Adds 1px border divider around list items\n *\n * @selector .slds-has-dividers_around\n * @modifier\n */\n.slds-has-dividers_around,\n.slds-has-dividers--around {\n  /**\n   * @summary Adds 1px border divider around list items and 0.5rem padding between items\n   *\n   * @selector .slds-has-dividers_around-space\n   * @modifier\n   */ }\n\n.slds-has-dividers_around > .slds-item,\n.slds-has-dividers--around > .slds-item {\n  border: 1px solid #dddbda;\n  border-radius: 0.25rem;\n  background-clip: padding-box; }\n\n.slds-has-dividers_around > .slds-item + .slds-item,\n.slds-has-dividers--around > .slds-item + .slds-item {\n  margin-top: 0.5rem; }\n\n.slds-has-dividers_around-space > .slds-item,\n.slds-has-dividers--around-space > .slds-item {\n  border: 1px solid #dddbda;\n  border-radius: 0.25rem;\n  background-clip: padding-box;\n  padding: 0.75rem; }\n\n@media (min-width: 30em) {\n  .slds-has-dividers_around-space > .slds-item,\n  .slds-has-dividers--around-space > .slds-item {\n    padding: 0.5rem; } }\n\n.slds-has-dividers_around-space > .slds-item + .slds-item,\n.slds-has-dividers--around-space > .slds-item + .slds-item {\n  margin-top: 0.5rem; }\n\n.slds-has-list-interactions > .slds-list__item:hover,\n.slds-has-list-interactions > .slds-item:hover {\n  background-color: #f3f2f2;\n  border-color: #dddbda;\n  cursor: pointer; }\n\n.slds-has-list-interactions > .slds-list__item:active,\n.slds-has-list-interactions > .slds-item:active {\n  background-color: #ecebea;\n  box-shadow: #dddbda 0 -1px 0 inset; }\n\n.slds-has-list-interactions > .slds-list__item.slds-is-selected,\n.slds-has-list-interactions > .slds-item.slds-is-selected {\n  box-shadow: #0070d2 0 0 0 1px inset;\n  background-color: #ecebea; }\n\n.slds-has-list-interactions > .slds-list__item.slds-is-selected:hover, .slds-has-list-interactions > .slds-list__item.slds-is-selected:focus,\n.slds-has-list-interactions > .slds-item.slds-is-selected:hover,\n.slds-has-list-interactions > .slds-item.slds-is-selected:focus {\n  box-shadow: #1589ee 0 -2px 0 inset, #1589ee 0 0 0 1px inset; }\n\n.slds-list_vertical.slds-has-dividers > .slds-list__item,\n.slds-list--vertical.slds-has-dividers > .slds-list__item {\n  padding: 0.5rem;\n  border-bottom: 1px solid #dddbda; }\n\n.slds-list_vertical.slds-has-dividers > .slds-list__item:hover,\n.slds-list--vertical.slds-has-dividers > .slds-list__item:hover {\n  background-color: #f3f2f2;\n  border-color: #dddbda;\n  cursor: pointer; }\n\n.slds-list_vertical.slds-has-dividers > .slds-list__item:active,\n.slds-list--vertical.slds-has-dividers > .slds-list__item:active {\n  background-color: #ecebea;\n  box-shadow: #dddbda 0 -1px 0 inset; }\n\n.slds-list_vertical.slds-has-dividers > .slds-list__item.slds-is-selected,\n.slds-list--vertical.slds-has-dividers > .slds-list__item.slds-is-selected {\n  box-shadow: #0070d2 0 0 0 1px inset;\n  background-color: #ecebea; }\n\n.slds-list_vertical.slds-has-dividers > .slds-list__item.slds-is-selected:hover, .slds-list_vertical.slds-has-dividers > .slds-list__item.slds-is-selected:focus,\n.slds-list--vertical.slds-has-dividers > .slds-list__item.slds-is-selected:hover,\n.slds-list--vertical.slds-has-dividers > .slds-list__item.slds-is-selected:focus {\n  box-shadow: #1589ee 0 -2px 0 inset, #1589ee 0 0 0 1px inset; }\n\n.slds-has-cards > .slds-list__item {\n  border: 1px solid #dddbda;\n  border-radius: 0.25rem;\n  background-clip: padding-box; }\n\n.slds-has-cards > .slds-list__item + .slds-list__item {\n  margin-top: 0.5rem; }\n\n.slds-has-cards_space > .slds-list__item, .slds-has-cards--space > .slds-list__item {\n  border: 1px solid #dddbda;\n  border-radius: 0.25rem;\n  background-clip: padding-box;\n  padding: 0.75rem; }\n\n@media (min-width: 30em) {\n  .slds-has-cards_space > .slds-list__item, .slds-has-cards--space > .slds-list__item {\n    padding: 0.5rem; } }\n\n.slds-has-cards_space > .slds-list__item + .slds-list__item, .slds-has-cards--space > .slds-list__item + .slds-list__item {\n  margin-top: 0.5rem; }\n\n.slds-has-divider {\n  margin-top: 0.5rem;\n  padding-top: 0.5rem;\n  border-top: 1px solid #dddbda;\n  /**\n   * @summary Adds 1px border divider above an HTML element\n   *\n   * @selector .slds-has-divider_top\n   * @restrict li\n   * @modifier\n   */\n  /**\n   * @summary Adds dot separator to the right of an HTML element\n   *\n   * @selector .slds-has-divider_right\n   * @restrict li\n   * @modifier\n   */\n  /**\n   * @summary Adds 1px border divider below an HTML element\n   *\n   * @selector .slds-has-divider_bottom\n   * @restrict li\n   * @modifier\n   */\n  /**\n   * @summary Adds dot separator to the left of an HTML element\n   *\n   * @selector .slds-has-divider_left\n   * @restrict li\n   * @modifier\n   */ }\n\n.slds-has-divider_top, .slds-has-divider--top {\n  border-top: 1px solid #dddbda; }\n\n.slds-has-divider_top-space, .slds-has-divider--top-space {\n  border-top: 1px solid #dddbda;\n  margin-top: 0.5rem;\n  padding-top: 0.5rem; }\n\n.slds-has-divider_right, .slds-has-divider--right {\n  position: relative;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n      align-items: center; }\n\n.slds-has-divider_right:after, .slds-has-divider--right:after {\n  width: 2px;\n  height: 2px;\n  content: '';\n  margin-left: 0.5rem;\n  margin-right: 0.5rem;\n  border-radius: 50%;\n  background-color: #16325c; }\n\n.slds-has-divider_right:last-child, .slds-has-divider--right:last-child {\n  margin-right: 0;\n  padding-right: 0; }\n\n.slds-has-divider_right:last-child:after, .slds-has-divider--right:last-child:after {\n  content: none; }\n\n.slds-has-divider_bottom, .slds-has-divider--bottom {\n  border-bottom: 1px solid #dddbda; }\n\n.slds-has-divider_bottom-space, .slds-has-divider--bottom-space {\n  border-bottom: 1px solid #dddbda;\n  margin-bottom: 0.5rem;\n  padding-bottom: 0.5rem; }\n\n.slds-has-divider_left, .slds-has-divider--left {\n  position: relative;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n      align-items: center; }\n\n.slds-has-divider_left:before, .slds-has-divider--left:before {\n  width: 2px;\n  height: 2px;\n  content: '';\n  display: inline-block;\n  vertical-align: middle;\n  margin-left: 0.5rem;\n  margin-right: 0.5rem;\n  border-radius: 50%;\n  background-color: #16325c; }\n\n.slds-has-divider_left:first-child, .slds-has-divider--left:first-child {\n  margin-right: 0;\n  padding-right: 0; }\n\n.slds-has-divider_left:first-child:before, .slds-has-divider--left:first-child:before {\n  content: none; }\n\n/**\n * @summary Causes items of a list to display horizontally\n *\n * @selector .slds-list_horizontal\n * @modifier\n */\n.slds-list_horizontal,\n.slds-list--horizontal {\n  display: -ms-flexbox;\n  display: flex; }\n\n.slds-list_horizontal > .slds-list__item,\n.slds-list--horizontal > .slds-list__item {\n  -ms-flex-item-align: center;\n      -ms-grid-row-align: center;\n      align-self: center; }\n\n.slds-list_horizontal-large > .slds-list__item > a,\n.slds-list--horizontal-large > .slds-list__item > a {\n  padding: 0.75rem 1rem; }\n\n/**\n * @summary Adds dot separators to the left of horizontal list items\n *\n * @selector .slds-has-dividers_left\n * @modifier\n */\n.slds-has-dividers_left > .slds-list__item,\n.slds-has-dividers--left > .slds-list__item,\n.slds-has-dividers_left > .slds-item,\n.slds-has-dividers--left > .slds-item {\n  position: relative;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n      align-items: center; }\n\n.slds-has-dividers_left > .slds-list__item:before,\n.slds-has-dividers--left > .slds-list__item:before,\n.slds-has-dividers_left > .slds-item:before,\n.slds-has-dividers--left > .slds-item:before {\n  width: 2px;\n  height: 2px;\n  content: '';\n  display: inline-block;\n  vertical-align: middle;\n  margin-left: 0.5rem;\n  margin-right: 0.5rem;\n  border-radius: 50%;\n  background-color: #16325c; }\n\n.slds-has-dividers_left > .slds-list__item:first-child,\n.slds-has-dividers--left > .slds-list__item:first-child,\n.slds-has-dividers_left > .slds-item:first-child,\n.slds-has-dividers--left > .slds-item:first-child {\n  margin-right: 0;\n  padding-right: 0; }\n\n.slds-has-dividers_left > .slds-list__item:first-child:before,\n.slds-has-dividers--left > .slds-list__item:first-child:before,\n.slds-has-dividers_left > .slds-item:first-child:before,\n.slds-has-dividers--left > .slds-item:first-child:before {\n  content: none; }\n\n/**\n * @summary Adds dot separators to the right of horizontal list items\n *\n * @selector .slds-has-dividers_right\n * @modifier\n */\n.slds-has-dividers_right > .slds-list__item,\n.slds-has-dividers--right > .slds-list__item,\n.slds-has-dividers_right > .slds-item,\n.slds-has-dividers--right > .slds-item {\n  position: relative;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n      align-items: center; }\n\n.slds-has-dividers_right > .slds-list__item:after,\n.slds-has-dividers--right > .slds-list__item:after,\n.slds-has-dividers_right > .slds-item:after,\n.slds-has-dividers--right > .slds-item:after {\n  width: 2px;\n  height: 2px;\n  content: '';\n  margin-left: 0.5rem;\n  margin-right: 0.5rem;\n  border-radius: 50%;\n  background-color: #16325c; }\n\n.slds-has-dividers_right > .slds-list__item:last-child,\n.slds-has-dividers--right > .slds-list__item:last-child,\n.slds-has-dividers_right > .slds-item:last-child,\n.slds-has-dividers--right > .slds-item:last-child {\n  margin-right: 0;\n  padding-right: 0; }\n\n.slds-has-dividers_right > .slds-list__item:last-child:after,\n.slds-has-dividers--right > .slds-list__item:last-child:after,\n.slds-has-dividers_right > .slds-item:last-child:after,\n.slds-has-dividers--right > .slds-item:last-child:after {\n  content: none; }\n\n.slds-list_horizontal.slds-has-dividers > .slds-list__item,\n.slds-list--horizontal.slds-has-dividers > .slds-list__item {\n  position: relative;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n      align-items: center; }\n\n.slds-list_horizontal.slds-has-dividers > .slds-list__item:after,\n.slds-list--horizontal.slds-has-dividers > .slds-list__item:after {\n  width: 2px;\n  height: 2px;\n  content: '';\n  margin-left: 0.5rem;\n  margin-right: 0.5rem;\n  border-radius: 50%;\n  background-color: #16325c; }\n\n.slds-list_horizontal.slds-has-dividers > .slds-list__item:last-child,\n.slds-list--horizontal.slds-has-dividers > .slds-list__item:last-child {\n  margin-right: 0;\n  padding-right: 0; }\n\n.slds-list_horizontal.slds-has-dividers > .slds-list__item:last-child:after,\n.slds-list--horizontal.slds-has-dividers > .slds-list__item:last-child:after {\n  content: none; }\n\n/**\n * @summary Causes description list to display horizontally with `dt` followed immediately by the `dd`.\n *\n * @selector .slds-dl_inline\n * @modifier\n */\n.slds-dl_inline:after,\n.slds-dl--inline:after {\n  content: '';\n  display: table;\n  clear: both; }\n\n@media (min-width: 48em) {\n  .slds-dl_inline,\n  .slds-dl--inline {\n    /**\n     * Marks a term\n     *\n     * @selector .slds-dl_inline__label\n     * @modifier\n     */\n    /**\n     * Marks a description\n     *\n     * @selector .slds-dl_inline__detail\n     * @modifier\n     */ }\n  .slds-dl_inline__label,\n  .slds-dl--inline__label {\n    float: left;\n    clear: left; }\n  .slds-dl_inline__detail,\n  .slds-dl--inline__detail {\n    float: left;\n    padding-left: 0.25rem; } }\n\n/**\n * @summary Causes description list to display horizontally with `dt` consuming 33% of the space and the `dd` taking up the rest.\n *\n * @selector .slds-dl_horizontal\n * @modifier\n */\n@media (min-width: 48em) {\n  .slds-dl_horizontal,\n  .slds-dl--horizontal {\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap;\n    -ms-flex-align: start;\n        align-items: flex-start;\n    display: -ms-flexbox;\n    display: flex;\n    /**\n     * Marks a term\n     *\n     * @selector .slds-dl_horizontal__label\n     * @modifier\n     */\n    /**\n     * Marks a description\n     *\n     * @selector .slds-dl_horizontal__detail\n     * @modifier\n     */ }\n  .slds-dl_horizontal__label,\n  .slds-dl--horizontal__label {\n    width: 30%;\n    padding-right: 0.75rem; }\n  .slds-dl_horizontal__detail,\n  .slds-dl--horizontal__detail {\n    width: 70%; } }\n\n.slds-list_horizontal,\n.slds-list--horizontal {\n  /**\n   * @summary Label of the name-value pair variant. Layout is modified by its parent class.\n   *\n   * @selector .slds-item_label\n   * @modifier\n   */\n  /**\n   * @summary Label of the name-value pair variant. Layout is modified by its parent class.\n   *\n   * @selector .slds-item_detail\n   * @modifier\n   */ }\n\n.slds-list_horizontal .slds-item_label,\n.slds-list_horizontal .slds-item--label,\n.slds-list--horizontal .slds-item_label,\n.slds-list--horizontal .slds-item--label {\n  width: 30%;\n  padding-right: 0.75rem; }\n\n.slds-list_horizontal .slds-item_detail,\n.slds-list_horizontal .slds-item--detail,\n.slds-list--horizontal .slds-item_detail,\n.slds-list--horizontal .slds-item--detail {\n  width: 70%; }\n\n.slds-list_vertical .slds-item_label,\n.slds-list_vertical .slds-item--label,\n.slds-list_vertical .slds-item_detail,\n.slds-list_vertical .slds-item--detail,\n.slds-list--vertical .slds-item_label,\n.slds-list--vertical .slds-item--label,\n.slds-list--vertical .slds-item_detail,\n.slds-list--vertical .slds-item--detail {\n  display: block; }\n\n.slds-list_inline,\n.slds-list--inline {\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  max-width: 100%; }\n\n.slds-list_inline .slds-item_label,\n.slds-list_inline .slds-item--label,\n.slds-list--inline .slds-item_label,\n.slds-list--inline .slds-item--label {\n  max-width: 180px;\n  padding-right: 0.75rem;\n  -ms-flex-negative: 0;\n      flex-shrink: 0; }\n\n.slds-list_inline .slds-item_label ~ .slds-item_label,\n.slds-list_inline .slds-item_label ~ .slds-item--label,\n.slds-list_inline .slds-item--label ~ .slds-item_label,\n.slds-list_inline .slds-item--label ~ .slds-item--label,\n.slds-list--inline .slds-item_label ~ .slds-item_label,\n.slds-list--inline .slds-item_label ~ .slds-item--label,\n.slds-list--inline .slds-item--label ~ .slds-item_label,\n.slds-list--inline .slds-item--label ~ .slds-item--label {\n  padding-left: 1rem; }\n\n.slds-list_inline .slds-item_detail,\n.slds-list_inline .slds-item--detail,\n.slds-list--inline .slds-item_detail,\n.slds-list--inline .slds-item--detail {\n  min-width: 0; }\n\n/**\n * @summary Adds a bottom border to an element\n *\n * @selector .slds-border_bottom\n * @modifier\n * @group position\n */\n.slds-border_bottom,\n.slds-border--bottom {\n  border-bottom: 1px solid #dddbda; }\n\n/**\n * @summary Adds a left border to an element\n *\n * @selector .slds-border_left\n * @modifier\n * @group position\n */\n.slds-border_left,\n.slds-border--left {\n  border-left: 1px solid #dddbda; }\n\n/**\n * @summary Adds a right border to an element\n *\n * @selector .slds-border_right\n * @modifier\n * @group position\n */\n.slds-border_right,\n.slds-border--right {\n  border-right: 1px solid #dddbda; }\n\n/**\n * @summary Adds a top border to an element\n *\n * @selector .slds-border_top\n * @modifier\n * @group position\n */\n.slds-border_top,\n.slds-border--top {\n  border-top: 1px solid #dddbda; }\n\n/**\n * The truncation class can be used on an element, or the truncation\n * include can be added to an existing class.\n *\n * @summary Creates truncated text\n *\n * @selector .slds-truncate\n * @restrict [title]\n * @modifier\n */\n.slds-truncate {\n  max-width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap; }\n\n/**\n * @summary Truncates text at 25% of its parent container\n *\n * @selector .slds-truncate_container_25\n * @modifier\n */\n.slds-truncate_container_25,\n.slds-truncate_container--25 {\n  max-width: 25%; }\n\n/**\n * @summary Truncates text at 50% of its parent container\n *\n * @selector .slds-truncate_container_50\n * @modifier\n */\n.slds-truncate_container_50,\n.slds-truncate_container--50 {\n  max-width: 50%; }\n\n/**\n * @summary Truncates text at 75% of its parent container\n *\n * @selector .slds-truncate_container_75\n * @modifier\n */\n.slds-truncate_container_75,\n.slds-truncate_container--75 {\n  max-width: 75%; }\n\n/**\n * @summary Truncates text at 33% of its parent container\n *\n * @selector .slds-truncate_container_33\n * @modifier\n */\n.slds-truncate_container_33,\n.slds-truncate_container--33 {\n  max-width: 33%; }\n\n/**\n * @summary Truncates text at 66% of its parent container\n *\n * @selector .slds-truncate_container_66\n * @modifier\n */\n.slds-truncate_container_66,\n.slds-truncate_container--66 {\n  max-width: 66%; }\n\n/**\n * The truncation class can be used on an element, or the truncation include can be added to an existing class.\n *\n * @summary Creates hyphenated text\n *\n * @selector .slds-hyphenate\n * @notes Hyphenation will occur at the parent width if a width is not specified\n * @modifier\n */\n.slds-hyphenate {\n  overflow-wrap: break-word;\n  word-wrap: break-word;\n  -webkit-hyphens: auto;\n      -ms-hyphens: auto;\n          hyphens: auto; }\n\n/**\n * @summary Provides 1rem base padding and borders\n *\n * @selector .slds-box\n * @modifier\n */\n.slds-box {\n  padding: 1rem;\n  border-radius: 0.25rem;\n  border: 1px solid #dddbda;\n  /**\n   * @summary Changes padding to .25rem\n   *\n   * @selector .slds-box_xx-small\n   * @restrict .slds-box\n   * @modifier\n   */\n  /**\n   * @summary Changes padding to .5rem\n   *\n   * @selector .slds-box_x-small\n   * @restrict .slds-box\n   * @modifier\n   */\n  /**\n   * @summary Changes padding to .75rem\n   *\n   * @selector .slds-box_small\n   * @restrict .slds-box\n   * @modifier\n   */ }\n\n.slds-box_xx-small, .slds-box--xx-small {\n  padding: 0.25rem; }\n\n.slds-box_x-small, .slds-box--x-small {\n  padding: 0.5rem; }\n\n.slds-box_small, .slds-box--small {\n  padding: 0.75rem; }\n\n.slds-box_border, .slds-box--border {\n  padding: 0;\n  border-radius: 0.25rem;\n  border: 1px solid #dddbda; }\n\n/**\n * @summary Handles interactions if the box is applied to an actionable element\n *\n * @selector .slds-box_link\n * @restrict .slds-box\n * @modifier\n * @notes Requires a block display property, e.g. block, inline-block, flex\n */\n.slds-box_link, .slds-box_link:active, .slds-box_link:focus, .slds-box_link:hover {\n  color: inherit;\n  text-decoration: inherit; }\n\n.slds-box_link:hover, .slds-box_link:focus {\n  cursor: pointer;\n  outline: 0;\n  border: 1px solid #1589ee;\n  box-shadow: 0 0 0 1px #1589ee inset; }\n\n.slds-theme {\n  /**\n   * @summary Sets the background color to white\n   *\n   * @selector .slds-theme_default\n   * @modifier\n   */\n  /**\n   * @summary Sets the background color to gray\n   *\n   * @selector .slds-theme_shade\n   * @modifier\n   */\n  /**\n   * @summary Sets the background color to dark blue\n   *\n   * @selector .slds-theme_inverse\n   * @modifier\n   */\n  /**\n   * @summary Sets the background color to darker blue\n   *\n   * @selector .slds-theme_alt-inverse\n   * @modifier\n   */\n  /**\n   * @summary Sets the background color to green\n   *\n   * @selector .slds-theme_success\n   * @modifier\n   */\n  /**\n   * @summary Sets the background color to gray-ish blue\n   *\n   * @selector .slds-theme_info\n   * @modifier\n   */\n  /**\n   * @summary Sets the background color to yellow\n   *\n   * @selector .slds-theme_warning\n   * @modifier\n   */\n  /**\n   * @summary Sets the background color to red\n   *\n   * @selector .slds-theme_error\n   * @modifier\n   */\n  /**\n   * @summary Sets the background color to black\n   *\n   * @selector .slds-theme_offline\n   * @modifier\n   */\n  /**\n   * @summary Adds striped background\n   *\n   * @selector .slds-theme_alert-texture\n   * @modifier\n   */ }\n\n.slds-theme_default, .slds-theme--default {\n  background-color: white;\n  color: #3e3e3c; }\n\n.slds-theme_shade, .slds-theme--shade {\n  background-color: #f3f2f2; }\n\n.slds-theme_inverse, .slds-theme--inverse {\n  color: white;\n  background-color: #061c3f;\n  border-color: #061c3f; }\n\n.slds-theme_inverse a:not(.slds-button--neutral), .slds-theme--inverse a:not(.slds-button--neutral) {\n  color: white;\n  text-decoration: underline; }\n\n.slds-theme_inverse a:not(.slds-button--neutral):link, .slds-theme_inverse a:not(.slds-button--neutral):visited, .slds-theme--inverse a:not(.slds-button--neutral):link, .slds-theme--inverse a:not(.slds-button--neutral):visited {\n  color: white; }\n\n.slds-theme_inverse a:not(.slds-button--neutral):hover, .slds-theme_inverse a:not(.slds-button--neutral):focus, .slds-theme--inverse a:not(.slds-button--neutral):hover, .slds-theme--inverse a:not(.slds-button--neutral):focus {\n  color: rgba(255, 255, 255, 0.75); }\n\n.slds-theme_inverse a:not(.slds-button--neutral):active, .slds-theme--inverse a:not(.slds-button--neutral):active {\n  color: rgba(255, 255, 255, 0.5); }\n\n.slds-theme_inverse a:not(.slds-button--neutral)[disabled], .slds-theme--inverse a:not(.slds-button--neutral)[disabled] {\n  color: rgba(255, 255, 255, 0.15); }\n\n.slds-theme_alt-inverse, .slds-theme--alt-inverse {\n  color: white;\n  background-color: #16325c;\n  border-color: #16325c; }\n\n.slds-theme_alt-inverse a:not(.slds-button--neutral), .slds-theme--alt-inverse a:not(.slds-button--neutral) {\n  color: white;\n  text-decoration: underline; }\n\n.slds-theme_alt-inverse a:not(.slds-button--neutral):link, .slds-theme_alt-inverse a:not(.slds-button--neutral):visited, .slds-theme--alt-inverse a:not(.slds-button--neutral):link, .slds-theme--alt-inverse a:not(.slds-button--neutral):visited {\n  color: white; }\n\n.slds-theme_alt-inverse a:not(.slds-button--neutral):hover, .slds-theme_alt-inverse a:not(.slds-button--neutral):focus, .slds-theme--alt-inverse a:not(.slds-button--neutral):hover, .slds-theme--alt-inverse a:not(.slds-button--neutral):focus {\n  color: rgba(255, 255, 255, 0.75); }\n\n.slds-theme_alt-inverse a:not(.slds-button--neutral):active, .slds-theme--alt-inverse a:not(.slds-button--neutral):active {\n  color: rgba(255, 255, 255, 0.5); }\n\n.slds-theme_alt-inverse a:not(.slds-button--neutral)[disabled], .slds-theme--alt-inverse a:not(.slds-button--neutral)[disabled] {\n  color: rgba(255, 255, 255, 0.15); }\n\n.slds-theme_success, .slds-theme--success {\n  color: white;\n  background-color: #04844b; }\n\n.slds-theme_success a:not(.slds-button--neutral), .slds-theme--success a:not(.slds-button--neutral) {\n  color: white;\n  text-decoration: underline; }\n\n.slds-theme_success a:not(.slds-button--neutral):link, .slds-theme_success a:not(.slds-button--neutral):visited, .slds-theme--success a:not(.slds-button--neutral):link, .slds-theme--success a:not(.slds-button--neutral):visited {\n  color: white; }\n\n.slds-theme_success a:not(.slds-button--neutral):hover, .slds-theme_success a:not(.slds-button--neutral):focus, .slds-theme--success a:not(.slds-button--neutral):hover, .slds-theme--success a:not(.slds-button--neutral):focus {\n  color: rgba(255, 255, 255, 0.75); }\n\n.slds-theme_success a:not(.slds-button--neutral):active, .slds-theme--success a:not(.slds-button--neutral):active {\n  color: rgba(255, 255, 255, 0.5); }\n\n.slds-theme_success a:not(.slds-button--neutral)[disabled], .slds-theme--success a:not(.slds-button--neutral)[disabled] {\n  color: rgba(255, 255, 255, 0.15); }\n\n.slds-theme_info, .slds-theme--info {\n  color: white;\n  background-color: #706e6b; }\n\n.slds-theme_info a:not(.slds-button--neutral), .slds-theme--info a:not(.slds-button--neutral) {\n  color: white;\n  text-decoration: underline; }\n\n.slds-theme_info a:not(.slds-button--neutral):link, .slds-theme_info a:not(.slds-button--neutral):visited, .slds-theme--info a:not(.slds-button--neutral):link, .slds-theme--info a:not(.slds-button--neutral):visited {\n  color: white; }\n\n.slds-theme_info a:not(.slds-button--neutral):hover, .slds-theme_info a:not(.slds-button--neutral):focus, .slds-theme--info a:not(.slds-button--neutral):hover, .slds-theme--info a:not(.slds-button--neutral):focus {\n  color: rgba(255, 255, 255, 0.75); }\n\n.slds-theme_info a:not(.slds-button--neutral):active, .slds-theme--info a:not(.slds-button--neutral):active {\n  color: rgba(255, 255, 255, 0.5); }\n\n.slds-theme_info a:not(.slds-button--neutral)[disabled], .slds-theme--info a:not(.slds-button--neutral)[disabled] {\n  color: rgba(255, 255, 255, 0.15); }\n\n.slds-theme_warning, .slds-theme--warning {\n  background-color: #ffb75d;\n  color: #3e3e3c; }\n\n.slds-theme_warning .slds-icon,\n.slds-theme_warning .slds-button__icon, .slds-theme--warning .slds-icon,\n.slds-theme--warning .slds-button__icon {\n  fill: #706e6b; }\n\n.slds-theme_warning a:not(.slds-button--neutral),\n.slds-theme_warning button:not(.slds-button--neutral), .slds-theme--warning a:not(.slds-button--neutral),\n.slds-theme--warning button:not(.slds-button--neutral) {\n  color: #3e3e3c;\n  text-decoration: underline; }\n\n.slds-theme_error, .slds-theme--error {\n  color: white;\n  background-color: #c23934; }\n\n.slds-theme_error a:not(.slds-button--neutral), .slds-theme--error a:not(.slds-button--neutral) {\n  color: white;\n  text-decoration: underline; }\n\n.slds-theme_error a:not(.slds-button--neutral):link, .slds-theme_error a:not(.slds-button--neutral):visited, .slds-theme--error a:not(.slds-button--neutral):link, .slds-theme--error a:not(.slds-button--neutral):visited {\n  color: white; }\n\n.slds-theme_error a:not(.slds-button--neutral):hover, .slds-theme_error a:not(.slds-button--neutral):focus, .slds-theme--error a:not(.slds-button--neutral):hover, .slds-theme--error a:not(.slds-button--neutral):focus {\n  color: rgba(255, 255, 255, 0.75); }\n\n.slds-theme_error a:not(.slds-button--neutral):active, .slds-theme--error a:not(.slds-button--neutral):active {\n  color: rgba(255, 255, 255, 0.5); }\n\n.slds-theme_error a:not(.slds-button--neutral)[disabled], .slds-theme--error a:not(.slds-button--neutral)[disabled] {\n  color: rgba(255, 255, 255, 0.15); }\n\n.slds-theme_offline, .slds-theme--offline {\n  color: white;\n  background-color: #444; }\n\n.slds-theme_offline a:not(.slds-button--neutral), .slds-theme--offline a:not(.slds-button--neutral) {\n  color: white;\n  text-decoration: underline; }\n\n.slds-theme_offline a:not(.slds-button--neutral):link, .slds-theme_offline a:not(.slds-button--neutral):visited, .slds-theme--offline a:not(.slds-button--neutral):link, .slds-theme--offline a:not(.slds-button--neutral):visited {\n  color: white; }\n\n.slds-theme_offline a:not(.slds-button--neutral):hover, .slds-theme_offline a:not(.slds-button--neutral):focus, .slds-theme--offline a:not(.slds-button--neutral):hover, .slds-theme--offline a:not(.slds-button--neutral):focus {\n  color: rgba(255, 255, 255, 0.75); }\n\n.slds-theme_offline a:not(.slds-button--neutral):active, .slds-theme--offline a:not(.slds-button--neutral):active {\n  color: rgba(255, 255, 255, 0.5); }\n\n.slds-theme_offline a:not(.slds-button--neutral)[disabled], .slds-theme--offline a:not(.slds-button--neutral)[disabled] {\n  color: rgba(255, 255, 255, 0.15); }\n\n.slds-theme_alert-texture, .slds-theme--alert-texture {\n  background-image: linear-gradient(45deg, rgba(0, 0, 0, 0.025) 25%, transparent 25%, transparent 50%, rgba(0, 0, 0, 0.025) 50%, rgba(0, 0, 0, 0.025) 75%, transparent 75%, transparent);\n  background-size: 64px 64px; }\n\n.slds-theme_inverse-text, .slds-theme--inverse-text {\n  color: white; }\n\n.slds-theme_inverse-text a:not(.slds-button--neutral), .slds-theme--inverse-text a:not(.slds-button--neutral) {\n  color: white;\n  text-decoration: underline; }\n\n.slds-theme_inverse-text a:not(.slds-button--neutral):link, .slds-theme_inverse-text a:not(.slds-button--neutral):visited, .slds-theme--inverse-text a:not(.slds-button--neutral):link, .slds-theme--inverse-text a:not(.slds-button--neutral):visited {\n  color: white; }\n\n.slds-theme_inverse-text a:not(.slds-button--neutral):hover, .slds-theme_inverse-text a:not(.slds-button--neutral):focus, .slds-theme--inverse-text a:not(.slds-button--neutral):hover, .slds-theme--inverse-text a:not(.slds-button--neutral):focus {\n  color: rgba(255, 255, 255, 0.75); }\n\n.slds-theme_inverse-text a:not(.slds-button--neutral):active, .slds-theme--inverse-text a:not(.slds-button--neutral):active {\n  color: rgba(255, 255, 255, 0.5); }\n\n.slds-theme_inverse-text a:not(.slds-button--neutral)[disabled], .slds-theme--inverse-text a:not(.slds-button--neutral)[disabled] {\n  color: rgba(255, 255, 255, 0.15); }\n\n/**\n * @summary Creates the 13px regular body copy\n *\n * @selector .slds-text-body_regular\n * @modifier\n */\n.slds-text-body_regular,\n.slds-text-body--regular {\n  font-size: 0.8125rem; }\n\n/**\n * @summary Creates a more pale-colored 12px copy\n *\n * @selector .slds-text-body_small\n * @modifier\n */\n.slds-text-body_small,\n.slds-text-body--small {\n  font-size: 0.75rem; }\n\n/**\n * @summary Very large 28px heading\n *\n * @selector .slds-text-heading_large\n * @modifier\n */\n.slds-text-heading_large,\n.slds-text-heading--large {\n  font-weight: 300;\n  font-size: 1.75rem;\n  line-height: 1.25; }\n\n/**\n * @summary Large 20px heading\n *\n * @selector .slds-text-heading_medium\n * @modifier\n */\n.slds-text-heading_medium,\n.slds-text-heading--medium {\n  font-weight: 300;\n  font-size: 1.25rem;\n  line-height: 1.25; }\n\n/**\n * @summary Smaller 16px heading\n *\n * @selector .slds-text-heading_small\n * @modifier\n */\n.slds-text-heading_small,\n.slds-text-heading--small {\n  font-size: 1rem;\n  line-height: 1.25; }\n\n.slds-text-heading_label,\n.slds-text-heading--label {\n  font-size: 0.75rem;\n  line-height: 1.25;\n  color: #706e6b;\n  text-transform: uppercase;\n  letter-spacing: 0.0625rem; }\n\n.slds-text-heading_label-normal,\n.slds-text-heading--label-normal {\n  font-size: 0.75rem;\n  line-height: 1.25;\n  color: #706e6b; }\n\n/**\n * @summary 12px heading that is not all caps\n *\n * @selector .slds-text-title\n * @notes Usually labels small content areas like list sections.\n * @modifier\n */\n.slds-text-title {\n  font-size: 0.75rem;\n  line-height: 1.25;\n  color: #706e6b; }\n\n/**\n * @summary All caps 12px heading\n *\n * @selector .slds-text-title_caps\n * @notes Usually labels small content areas like tabs and page header titles.\n * @modifier\n */\n.slds-text-title_caps,\n.slds-text-title--caps {\n  font-size: 0.75rem;\n  line-height: 1.25;\n  color: #706e6b;\n  text-transform: uppercase;\n  letter-spacing: 0.0625rem; }\n\n/**\n * @summary Resets line-height to browser default\n *\n * @selector .slds-line-height_reset\n * @modifier\n */\n.slds-line-height_reset,\n.slds-line-height--reset {\n  line-height: 1; }\n\n/**\n * @summary Default color of text\n *\n * @selector .slds-text-color_default\n * @modifier\n */\n.slds-text-color_default,\n.slds-text-color--default {\n  color: #3e3e3c; }\n\n/**\n * @summary Weak color of text\n *\n * @selector .slds-text-color_weak\n * @modifier\n */\n.slds-text-color_weak,\n.slds-text-color--weak {\n  color: #706e6b; }\n\n/**\n * @summary Error color of text\n *\n * @selector .slds-text-color_error\n * @modifier\n */\n.slds-text-color_error,\n.slds-text-color--error {\n  color: #c23934; }\n\n/**\n * @summary Success color of text\n *\n * @selector .slds-text-color_success\n * @modifier\n */\n.slds-text-color_success {\n  color: #028048; }\n\n/**\n * @summary Default color of text on inversed background\n *\n * @selector .slds-text-color_inverse\n * @modifier\n */\n.slds-text-color_inverse,\n.slds-text-color--inverse {\n  color: white; }\n\n/**\n * @summary Weak color of text on inversed background\n *\n * @selector .slds-text-color_inverse-weak\n * @modifier\n */\n.slds-text-color_inverse-weak,\n.slds-text-color--inverse-weak {\n  color: #b0adab; }\n\n/**\n * @summary Aligns text left\n *\n * @selector .slds-text-align_left\n * @modifier\n */\n.slds-text-align_left,\n.slds-text-align--left {\n  text-align: left; }\n\n/**\n * @summary Aligns text center\n *\n * @selector .slds-text-align_center\n * @modifier\n */\n.slds-text-align_center,\n.slds-text-align--center {\n  text-align: center; }\n\n/**\n * @summary Aligns text right\n *\n * @selector .slds-text-align_right\n * @modifier\n */\n.slds-text-align_right,\n.slds-text-align--right {\n  text-align: right; }\n\n/**\n * @summary Adds default spacing and list styling within a wrapper\n *\n * @selector .slds-text-longform\n * @notes Our application framework removes default text styling. This adds in margins to large areas\n * @modifier\n */\n.slds-text-longform h1,\n.slds-text-longform h2,\n.slds-text-longform h3,\n.slds-text-longform p,\n.slds-text-longform ul,\n.slds-text-longform ol,\n.slds-text-longform dl,\n.slds-text-longform img {\n  margin-bottom: 0.75rem; }\n\n.slds-text-longform ul {\n  margin-left: 1.5rem;\n  list-style: disc; }\n\n.slds-text-longform ul ul {\n  list-style: circle; }\n\n.slds-text-longform ul ul ul {\n  list-style: square; }\n\n.slds-text-longform ol {\n  margin-left: 1.5rem;\n  list-style: decimal; }\n\n.slds-text-longform ol ol {\n  list-style: lower-alpha; }\n\n.slds-text-longform ol ol ol {\n  list-style: lower-roman; }\n\n.slds-text-longform .slds-video {\n  display: block;\n  max-width: 100%; }\n\n.slds-text-longform .slds-video.slds-video_center, .slds-text-longform .slds-video.slds-video--center {\n  margin: 0 auto; }\n\n.slds-text-longform .slds-video.slds-video_right, .slds-text-longform .slds-video.slds-video--right {\n  margin: 0 0 0 auto; }\n\n/**\n * @summary Text color utility class for Palette Gray #1\n *\n * @selector .slds-color__text_gray-1\n * @modifier\n * @group text-grays\n */\n.slds-color__text_gray-1 {\n  color: white !important; }\n\n/**\n * @summary Text color utility class for Palette Gray #2\n *\n * @selector .slds-color__text_gray-2\n * @modifier\n * @group text-grays\n */\n.slds-color__text_gray-2 {\n  color: #fafaf9 !important; }\n\n/**\n * @summary Text color utility class for Palette Gray #3\n *\n * @selector .slds-color__text_gray-3\n * @modifier\n * @group text-grays\n */\n.slds-color__text_gray-3 {\n  color: #f3f2f2 !important; }\n\n/**\n * @summary Text color utility class for Palette Gray #4\n *\n * @selector .slds-color__text_gray-4\n * @modifier\n * @group text-grays\n */\n.slds-color__text_gray-4 {\n  color: #ecebea !important; }\n\n/**\n * @summary Text color utility class for Palette Gray #5\n *\n * @selector .slds-color__text_gray-5\n * @modifier\n * @group text-grays\n */\n.slds-color__text_gray-5 {\n  color: #dddbda !important; }\n\n/**\n * @summary Text color utility class for Palette Gray #6\n *\n * @selector .slds-color__text_gray-6\n * @modifier\n * @group text-grays\n */\n.slds-color__text_gray-6 {\n  color: #c9c7c5 !important; }\n\n/**\n * @summary Text color utility class for Palette Gray #7\n *\n * @selector .slds-color__text_gray-7\n * @modifier\n * @group text-grays\n */\n.slds-color__text_gray-7 {\n  color: #b0adab !important; }\n\n/**\n * @summary Text color utility class for Palette Gray #8\n *\n * @selector .slds-color__text_gray-8\n * @modifier\n * @group text-grays\n */\n.slds-color__text_gray-8 {\n  color: #969492 !important; }\n\n/**\n * @summary Text color utility class for Palette Gray #9\n *\n * @selector .slds-color__text_gray-9\n * @modifier\n * @group text-grays\n */\n.slds-color__text_gray-9 {\n  color: #706e6b !important; }\n\n/**\n * @summary Text color utility class for Palette Gray #10\n *\n * @selector .slds-color__text_gray-10\n * @modifier\n * @group text-grays\n */\n.slds-color__text_gray-10 {\n  color: #514f4d !important; }\n\n/**\n * @summary Text color utility class for Palette Gray #11\n *\n * @selector .slds-color__text_gray-11\n * @modifier\n * @group text-grays\n */\n.slds-color__text_gray-11 {\n  color: #3e3e3c !important; }\n\n/**\n * @summary Text color utility class for Palette Gray #12\n *\n * @selector .slds-color__text_gray-12\n * @modifier\n * @group text-grays\n */\n.slds-color__text_gray-12 {\n  color: #2b2826 !important; }\n\n/**\n * @summary Background color utility class for Palette Gray #1\n *\n * @selector .slds-color__background_gray-1\n * @modifier\n * @group background-grays\n */\n.slds-color__background_gray-1 {\n  background-color: white !important; }\n\n/**\n * @summary Background color utility class for Palette Gray #2\n *\n * @selector .slds-color__background_gray-2\n * @modifier\n * @group background-grays\n */\n.slds-color__background_gray-2 {\n  background-color: #fafaf9 !important; }\n\n/**\n * @summary Background color utility class for Palette Gray #3\n *\n * @selector .slds-color__background_gray-3\n * @modifier\n * @group background-grays\n */\n.slds-color__background_gray-3 {\n  background-color: #f3f2f2 !important; }\n\n/**\n * @summary Background color utility class for Palette Gray #4\n *\n * @selector .slds-color__background_gray-4\n * @modifier\n * @group background-grays\n */\n.slds-color__background_gray-4 {\n  background-color: #ecebea !important; }\n\n/**\n * @summary Background color utility class for Palette Gray #5\n *\n * @selector .slds-color__background_gray-5\n * @modifier\n * @group background-grays\n */\n.slds-color__background_gray-5 {\n  background-color: #dddbda !important; }\n\n/**\n * @summary Background color utility class for Palette Gray #6\n *\n * @selector .slds-color__background_gray-6\n * @modifier\n * @group background-grays\n */\n.slds-color__background_gray-6 {\n  background-color: #c9c7c5 !important; }\n\n/**\n * @summary Background color utility class for Palette Gray #7\n *\n * @selector .slds-color__background_gray-7\n * @modifier\n * @group background-grays\n */\n.slds-color__background_gray-7 {\n  background-color: #b0adab !important; }\n\n/**\n * @summary Background color utility class for Palette Gray #8\n *\n * @selector .slds-color__background_gray-8\n * @modifier\n * @group background-grays\n */\n.slds-color__background_gray-8 {\n  background-color: #969492 !important; }\n\n/**\n * @summary Background color utility class for Palette Gray #9\n *\n * @selector .slds-color__background_gray-9\n * @modifier\n * @group background-grays\n */\n.slds-color__background_gray-9 {\n  background-color: #706e6b !important; }\n\n/**\n * @summary Background color utility class for Palette Gray #10\n *\n * @selector .slds-color__background_gray-10\n * @modifier\n * @group background-grays\n */\n.slds-color__background_gray-10 {\n  background-color: #514f4d !important; }\n\n/**\n * @summary Background color utility class for Palette Gray #11\n *\n * @selector .slds-color__background_gray-11\n * @modifier\n * @group background-grays\n */\n.slds-color__background_gray-11 {\n  background-color: #3e3e3c !important; }\n\n/**\n * @summary Background color utility class for Palette Gray #12\n *\n * @selector .slds-color__background_gray-12\n * @modifier\n * @group background-grays\n */\n.slds-color__background_gray-12 {\n  background-color: #2b2826 !important; }\n\n/**\n * @summary Border color utility class for Palette Gray #1\n *\n * @selector .slds-color__border_gray-1\n * @modifier\n * @group border-grays\n */\n.slds-color__border_gray-1 {\n  border-color: white !important; }\n\n/**\n * @summary Border color utility class for Palette Gray #2\n *\n * @selector .slds-color__border_gray-2\n * @modifier\n * @group border-grays\n */\n.slds-color__border_gray-2 {\n  border-color: #fafaf9 !important; }\n\n/**\n * @summary Border color utility class for Palette Gray #3\n *\n * @selector .slds-color__border_gray-3\n * @modifier\n * @group border-grays\n */\n.slds-color__border_gray-3 {\n  border-color: #f3f2f2 !important; }\n\n/**\n * @summary Border color utility class for Palette Gray #4\n *\n * @selector .slds-color__border_gray-4\n * @modifier\n * @group border-grays\n */\n.slds-color__border_gray-4 {\n  border-color: #ecebea !important; }\n\n/**\n * @summary Border color utility class for Palette Gray #5\n *\n * @selector .slds-color__border_gray-5\n * @modifier\n * @group border-grays\n */\n.slds-color__border_gray-5 {\n  border-color: #dddbda !important; }\n\n/**\n * @summary Border color utility class for Palette Gray #6\n *\n * @selector .slds-color__border_gray-6\n * @modifier\n * @group border-grays\n */\n.slds-color__border_gray-6 {\n  border-color: #c9c7c5 !important; }\n\n/**\n * @summary Border color utility class for Palette Gray #7\n *\n * @selector .slds-color__border_gray-7\n * @modifier\n * @group border-grays\n */\n.slds-color__border_gray-7 {\n  border-color: #b0adab !important; }\n\n/**\n * @summary Border color utility class for Palette Gray #8\n *\n * @selector .slds-color__border_gray-8\n * @modifier\n * @group border-grays\n */\n.slds-color__border_gray-8 {\n  border-color: #969492 !important; }\n\n/**\n * @summary Border color utility class for Palette Gray #9\n *\n * @selector .slds-color__border_gray-9\n * @modifier\n * @group border-grays\n */\n.slds-color__border_gray-9 {\n  border-color: #706e6b !important; }\n\n/**\n * @summary Border color utility class for Palette Gray #10\n *\n * @selector .slds-color__border_gray-10\n * @modifier\n * @group border-grays\n */\n.slds-color__border_gray-10 {\n  border-color: #514f4d !important; }\n\n/**\n * @summary Border color utility class for Palette Gray #11\n *\n * @selector .slds-color__border_gray-11\n * @modifier\n * @group border-grays\n */\n.slds-color__border_gray-11 {\n  border-color: #3e3e3c !important; }\n\n/**\n * @summary Border color utility class for Palette Gray #12\n *\n * @selector .slds-color__border_gray-12\n * @modifier\n * @group border-grays\n */\n.slds-color__border_gray-12 {\n  border-color: #2b2826 !important; }\n\n/**\n * @summary SVG Fill color utility class for Palette Gray #1\n *\n * @selector .slds-color__fill_gray-1\n * @modifier\n * @group fill-grays\n */\n.slds-color__fill_gray-1 {\n  fill: white !important; }\n\n/**\n * @summary SVG Fill color utility class for Palette Gray #2\n *\n * @selector .slds-color__fill_gray-2\n * @modifier\n * @group fill-grays\n */\n.slds-color__fill_gray-2 {\n  fill: #fafaf9 !important; }\n\n/**\n * @summary SVG Fill color utility class for Palette Gray #3\n *\n * @selector .slds-color__fill_gray-3\n * @modifier\n * @group fill-grays\n */\n.slds-color__fill_gray-3 {\n  fill: #f3f2f2 !important; }\n\n/**\n * @summary SVG Fill color utility class for Palette Gray #4\n *\n * @selector .slds-color__fill_gray-4\n * @modifier\n * @group fill-grays\n */\n.slds-color__fill_gray-4 {\n  fill: #ecebea !important; }\n\n/**\n * @summary SVG Fill color utility class for Palette Gray #5\n *\n * @selector .slds-color__fill_gray-5\n * @modifier\n * @group fill-grays\n */\n.slds-color__fill_gray-5 {\n  fill: #dddbda !important; }\n\n/**\n * @summary SVG Fill color utility class for Palette Gray #6\n *\n * @selector .slds-color__fill_gray-6\n * @modifier\n * @group fill-grays\n */\n.slds-color__fill_gray-6 {\n  fill: #c9c7c5 !important; }\n\n/**\n * @summary SVG Fill color utility class for Palette Gray #7\n *\n * @selector .slds-color__fill_gray-7\n * @modifier\n * @group fill-grays\n */\n.slds-color__fill_gray-7 {\n  fill: #b0adab !important; }\n\n/**\n * @summary SVG Fill color utility class for Palette Gray #8\n *\n * @selector .slds-color__fill_gray-8\n * @modifier\n * @group fill-grays\n */\n.slds-color__fill_gray-8 {\n  fill: #969492 !important; }\n\n/**\n * @summary SVG Fill color utility class for Palette Gray #9\n *\n * @selector .slds-color__fill_gray-9\n * @modifier\n * @group fill-grays\n */\n.slds-color__fill_gray-9 {\n  fill: #706e6b !important; }\n\n/**\n * @summary SVG Fill color utility class for Palette Gray #10\n *\n * @selector .slds-color__fill_gray-10\n * @modifier\n * @group fill-grays\n */\n.slds-color__fill_gray-10 {\n  fill: #514f4d !important; }\n\n/**\n * @summary SVG Fill color utility class for Palette Gray #11\n *\n * @selector .slds-color__fill_gray-11\n * @modifier\n * @group fill-grays\n */\n.slds-color__fill_gray-11 {\n  fill: #3e3e3c !important; }\n\n/**\n * @summary SVG Fill color utility class for Palette Gray #12\n *\n * @selector .slds-color__fill_gray-12\n * @modifier\n * @group fill-grays\n */\n.slds-color__fill_gray-12 {\n  fill: #2b2826 !important; }\n\n/**\n * @summary Forces element to scroll horizontally and vertically when content exceeds element's width and height\n *\n * @selector .slds-scrollable\n * @modifier\n */\n.slds-scrollable {\n  -webkit-overflow-scrolling: touch;\n  overflow: auto; }\n\n/**\n * @summary Forces overflow items to not scroll within element's width and height\n *\n * @selector .slds-scrollable_none\n * @modifier\n */\n.slds-scrollable_none,\n.slds-scrollable--none {\n  overflow: hidden; }\n\n/**\n * @summary Forces element to scroll vertically when content exceeds element's height\n *\n * @selector .slds-scrollable_y\n * @modifier\n */\n.slds-scrollable_y,\n.slds-scrollable--y {\n  -webkit-overflow-scrolling: touch;\n  max-height: 100%;\n  overflow: hidden;\n  overflow-y: auto; }\n\n/**\n * @summary Forces element to scroll horizontally when content exceeds element's width\n *\n * @selector .slds-scrollable_x\n * @modifier\n */\n.slds-scrollable_x,\n.slds-scrollable--x {\n  -webkit-overflow-scrolling: touch;\n  max-width: 100%;\n  overflow: hidden;\n  overflow-x: auto; }\n\n/**\n * @selector .slds-size_small\n * @modifier\n */\n/*\n   * @selector .slds-size_xxx-small,\n   * @modifier\n   */\n.slds-size_xxx-small,\n.slds-size--xxx-small {\n  width: 3rem; }\n\n/*\n   * @selector .slds-size_xx-small\n   * @modifier\n   */\n.slds-size_xx-small,\n.slds-size--xx-small {\n  width: 6rem; }\n\n/*\n   * @selector .slds-size_x-small\n   * @modifier\n   */\n.slds-size_x-small,\n.slds-size--x-small {\n  width: 12rem; }\n\n/*\n   * @selector .slds-size_small\n   * @modifier\n   */\n.slds-size_small,\n.slds-size--small {\n  width: 15rem; }\n\n/*\n   * @selector .slds-size_medium\n   * @modifier\n   */\n.slds-size_medium,\n.slds-size--medium {\n  width: 20rem; }\n\n/*\n   * @selector .slds-size_large\n   * @modifier\n   */\n.slds-size_large,\n.slds-size--large {\n  width: 25rem; }\n\n/*\n   * @selector .slds-size_x-large\n   * @modifier\n   */\n.slds-size_x-large,\n.slds-size--x-large {\n  width: 40rem; }\n\n/*\n   * @selector .slds-size_xx-large\n   * @modifier\n   */\n.slds-size_xx-large,\n.slds-size--xx-large {\n  width: 60rem; }\n\n.slds-size_1-of-1,\n.slds-size--1-of-1 {\n  width: 100%; }\n\n.slds-size_1-of-2,\n.slds-size--1-of-2 {\n  width: 50%; }\n\n.slds-size_2-of-2,\n.slds-size--2-of-2 {\n  width: 100%; }\n\n.slds-size_1-of-3,\n.slds-size--1-of-3 {\n  width: 33.3333333333%; }\n\n.slds-size_2-of-3,\n.slds-size--2-of-3 {\n  width: 66.6666666667%; }\n\n.slds-size_3-of-3,\n.slds-size--3-of-3 {\n  width: 100%; }\n\n.slds-size_1-of-4,\n.slds-size--1-of-4 {\n  width: 25%; }\n\n.slds-size_2-of-4,\n.slds-size--2-of-4 {\n  width: 50%; }\n\n.slds-size_3-of-4,\n.slds-size--3-of-4 {\n  width: 75%; }\n\n.slds-size_4-of-4,\n.slds-size--4-of-4 {\n  width: 100%; }\n\n.slds-size_1-of-5,\n.slds-size--1-of-5 {\n  width: 20%; }\n\n.slds-size_2-of-5,\n.slds-size--2-of-5 {\n  width: 40%; }\n\n.slds-size_3-of-5,\n.slds-size--3-of-5 {\n  width: 60%; }\n\n.slds-size_4-of-5,\n.slds-size--4-of-5 {\n  width: 80%; }\n\n.slds-size_5-of-5,\n.slds-size--5-of-5 {\n  width: 100%; }\n\n.slds-size_1-of-6,\n.slds-size--1-of-6 {\n  width: 16.6666666667%; }\n\n.slds-size_2-of-6,\n.slds-size--2-of-6 {\n  width: 33.3333333333%; }\n\n.slds-size_3-of-6,\n.slds-size--3-of-6 {\n  width: 50%; }\n\n.slds-size_4-of-6,\n.slds-size--4-of-6 {\n  width: 66.6666666667%; }\n\n.slds-size_5-of-6,\n.slds-size--5-of-6 {\n  width: 83.3333333333%; }\n\n.slds-size_6-of-6,\n.slds-size--6-of-6 {\n  width: 100%; }\n\n.slds-size_1-of-7,\n.slds-size--1-of-7 {\n  width: 14.2857142857%; }\n\n.slds-size_2-of-7,\n.slds-size--2-of-7 {\n  width: 28.5714285714%; }\n\n.slds-size_3-of-7,\n.slds-size--3-of-7 {\n  width: 42.8571428571%; }\n\n.slds-size_4-of-7,\n.slds-size--4-of-7 {\n  width: 57.1428571429%; }\n\n.slds-size_5-of-7,\n.slds-size--5-of-7 {\n  width: 71.4285714286%; }\n\n.slds-size_6-of-7,\n.slds-size--6-of-7 {\n  width: 85.7142857143%; }\n\n.slds-size_7-of-7,\n.slds-size--7-of-7 {\n  width: 100%; }\n\n.slds-size_1-of-8,\n.slds-size--1-of-8 {\n  width: 12.5%; }\n\n.slds-size_2-of-8,\n.slds-size--2-of-8 {\n  width: 25%; }\n\n.slds-size_3-of-8,\n.slds-size--3-of-8 {\n  width: 37.5%; }\n\n.slds-size_4-of-8,\n.slds-size--4-of-8 {\n  width: 50%; }\n\n.slds-size_5-of-8,\n.slds-size--5-of-8 {\n  width: 62.5%; }\n\n.slds-size_6-of-8,\n.slds-size--6-of-8 {\n  width: 75%; }\n\n.slds-size_7-of-8,\n.slds-size--7-of-8 {\n  width: 87.5%; }\n\n.slds-size_8-of-8,\n.slds-size--8-of-8 {\n  width: 100%; }\n\n.slds-size_1-of-12,\n.slds-size--1-of-12 {\n  width: 8.3333333333%; }\n\n.slds-size_2-of-12,\n.slds-size--2-of-12 {\n  width: 16.6666666667%; }\n\n.slds-size_3-of-12,\n.slds-size--3-of-12 {\n  width: 25%; }\n\n.slds-size_4-of-12,\n.slds-size--4-of-12 {\n  width: 33.3333333333%; }\n\n.slds-size_5-of-12,\n.slds-size--5-of-12 {\n  width: 41.6666666667%; }\n\n.slds-size_6-of-12,\n.slds-size--6-of-12 {\n  width: 50%; }\n\n.slds-size_7-of-12,\n.slds-size--7-of-12 {\n  width: 58.3333333333%; }\n\n.slds-size_8-of-12,\n.slds-size--8-of-12 {\n  width: 66.6666666667%; }\n\n.slds-size_9-of-12,\n.slds-size--9-of-12 {\n  width: 75%; }\n\n.slds-size_10-of-12,\n.slds-size--10-of-12 {\n  width: 83.3333333333%; }\n\n.slds-size_11-of-12,\n.slds-size--11-of-12 {\n  width: 91.6666666667%; }\n\n.slds-size_12-of-12,\n.slds-size--12-of-12 {\n  width: 100%; }\n\n.slds-order_1,\n.slds-order--1 {\n  -ms-flex-order: 1;\n      order: 1; }\n\n.slds-order_2,\n.slds-order--2 {\n  -ms-flex-order: 2;\n      order: 2; }\n\n.slds-order_3,\n.slds-order--3 {\n  -ms-flex-order: 3;\n      order: 3; }\n\n.slds-order_4,\n.slds-order--4 {\n  -ms-flex-order: 4;\n      order: 4; }\n\n.slds-order_5,\n.slds-order--5 {\n  -ms-flex-order: 5;\n      order: 5; }\n\n.slds-order_6,\n.slds-order--6 {\n  -ms-flex-order: 6;\n      order: 6; }\n\n.slds-order_7,\n.slds-order--7 {\n  -ms-flex-order: 7;\n      order: 7; }\n\n.slds-order_8,\n.slds-order--8 {\n  -ms-flex-order: 8;\n      order: 8; }\n\n.slds-order_9,\n.slds-order--9 {\n  -ms-flex-order: 9;\n      order: 9; }\n\n.slds-order_10,\n.slds-order--10 {\n  -ms-flex-order: 10;\n      order: 10; }\n\n.slds-order_11,\n.slds-order--11 {\n  -ms-flex-order: 11;\n      order: 11; }\n\n.slds-order_12,\n.slds-order--12 {\n  -ms-flex-order: 12;\n      order: 12; }\n\n@media (min-width: 20em) {\n  [class*=\"slds-x-small-size_\"],\n  [class*=\"slds-x-small-size--\"] {\n    -ms-flex: none;\n        flex: none; }\n  .slds-x-small-size_xxx-small,\n  .slds-x-small-size--xxx-small {\n    width: 3rem; }\n  .slds-x-small-size_xx-small,\n  .slds-x-small-size--xx-small {\n    width: 6rem; }\n  .slds-x-small-size_x-small,\n  .slds-x-small-size--x-small {\n    width: 12rem; }\n  .slds-x-small-size_small,\n  .slds-x-small-size--small {\n    width: 15rem; }\n  .slds-x-small-size_medium,\n  .slds-x-small-size--medium {\n    width: 20rem; }\n  .slds-x-small-size_large,\n  .slds-x-small-size--large {\n    width: 25rem; }\n  .slds-x-small-size_x-large,\n  .slds-x-small-size--x-large {\n    width: 40rem; }\n  .slds-x-small-size_xx-large,\n  .slds-x-small-size--xx-large {\n    width: 60rem; }\n  .slds-x-small-size_1-of-1,\n  .slds-x-small-size--1-of-1 {\n    width: 100%; }\n  .slds-x-small-size_1-of-2,\n  .slds-x-small-size--1-of-2 {\n    width: 50%; }\n  .slds-x-small-size_2-of-2,\n  .slds-x-small-size--2-of-2 {\n    width: 100%; }\n  .slds-x-small-size_1-of-3,\n  .slds-x-small-size--1-of-3 {\n    width: 33.3333333333%; }\n  .slds-x-small-size_2-of-3,\n  .slds-x-small-size--2-of-3 {\n    width: 66.6666666667%; }\n  .slds-x-small-size_3-of-3,\n  .slds-x-small-size--3-of-3 {\n    width: 100%; }\n  .slds-x-small-size_1-of-4,\n  .slds-x-small-size--1-of-4 {\n    width: 25%; }\n  .slds-x-small-size_2-of-4,\n  .slds-x-small-size--2-of-4 {\n    width: 50%; }\n  .slds-x-small-size_3-of-4,\n  .slds-x-small-size--3-of-4 {\n    width: 75%; }\n  .slds-x-small-size_4-of-4,\n  .slds-x-small-size--4-of-4 {\n    width: 100%; }\n  .slds-x-small-size_1-of-5,\n  .slds-x-small-size--1-of-5 {\n    width: 20%; }\n  .slds-x-small-size_2-of-5,\n  .slds-x-small-size--2-of-5 {\n    width: 40%; }\n  .slds-x-small-size_3-of-5,\n  .slds-x-small-size--3-of-5 {\n    width: 60%; }\n  .slds-x-small-size_4-of-5,\n  .slds-x-small-size--4-of-5 {\n    width: 80%; }\n  .slds-x-small-size_5-of-5,\n  .slds-x-small-size--5-of-5 {\n    width: 100%; }\n  .slds-x-small-size_1-of-6,\n  .slds-x-small-size--1-of-6 {\n    width: 16.6666666667%; }\n  .slds-x-small-size_2-of-6,\n  .slds-x-small-size--2-of-6 {\n    width: 33.3333333333%; }\n  .slds-x-small-size_3-of-6,\n  .slds-x-small-size--3-of-6 {\n    width: 50%; }\n  .slds-x-small-size_4-of-6,\n  .slds-x-small-size--4-of-6 {\n    width: 66.6666666667%; }\n  .slds-x-small-size_5-of-6,\n  .slds-x-small-size--5-of-6 {\n    width: 83.3333333333%; }\n  .slds-x-small-size_6-of-6,\n  .slds-x-small-size--6-of-6 {\n    width: 100%; }\n  .slds-x-small-size_1-of-7,\n  .slds-x-small-size--1-of-7 {\n    width: 14.2857142857%; }\n  .slds-x-small-size_2-of-7,\n  .slds-x-small-size--2-of-7 {\n    width: 28.5714285714%; }\n  .slds-x-small-size_3-of-7,\n  .slds-x-small-size--3-of-7 {\n    width: 42.8571428571%; }\n  .slds-x-small-size_4-of-7,\n  .slds-x-small-size--4-of-7 {\n    width: 57.1428571429%; }\n  .slds-x-small-size_5-of-7,\n  .slds-x-small-size--5-of-7 {\n    width: 71.4285714286%; }\n  .slds-x-small-size_6-of-7,\n  .slds-x-small-size--6-of-7 {\n    width: 85.7142857143%; }\n  .slds-x-small-size_7-of-7,\n  .slds-x-small-size--7-of-7 {\n    width: 100%; }\n  .slds-x-small-size_1-of-8,\n  .slds-x-small-size--1-of-8 {\n    width: 12.5%; }\n  .slds-x-small-size_2-of-8,\n  .slds-x-small-size--2-of-8 {\n    width: 25%; }\n  .slds-x-small-size_3-of-8,\n  .slds-x-small-size--3-of-8 {\n    width: 37.5%; }\n  .slds-x-small-size_4-of-8,\n  .slds-x-small-size--4-of-8 {\n    width: 50%; }\n  .slds-x-small-size_5-of-8,\n  .slds-x-small-size--5-of-8 {\n    width: 62.5%; }\n  .slds-x-small-size_6-of-8,\n  .slds-x-small-size--6-of-8 {\n    width: 75%; }\n  .slds-x-small-size_7-of-8,\n  .slds-x-small-size--7-of-8 {\n    width: 87.5%; }\n  .slds-x-small-size_8-of-8,\n  .slds-x-small-size--8-of-8 {\n    width: 100%; }\n  .slds-x-small-size_1-of-12,\n  .slds-x-small-size--1-of-12 {\n    width: 8.3333333333%; }\n  .slds-x-small-size_2-of-12,\n  .slds-x-small-size--2-of-12 {\n    width: 16.6666666667%; }\n  .slds-x-small-size_3-of-12,\n  .slds-x-small-size--3-of-12 {\n    width: 25%; }\n  .slds-x-small-size_4-of-12,\n  .slds-x-small-size--4-of-12 {\n    width: 33.3333333333%; }\n  .slds-x-small-size_5-of-12,\n  .slds-x-small-size--5-of-12 {\n    width: 41.6666666667%; }\n  .slds-x-small-size_6-of-12,\n  .slds-x-small-size--6-of-12 {\n    width: 50%; }\n  .slds-x-small-size_7-of-12,\n  .slds-x-small-size--7-of-12 {\n    width: 58.3333333333%; }\n  .slds-x-small-size_8-of-12,\n  .slds-x-small-size--8-of-12 {\n    width: 66.6666666667%; }\n  .slds-x-small-size_9-of-12,\n  .slds-x-small-size--9-of-12 {\n    width: 75%; }\n  .slds-x-small-size_10-of-12,\n  .slds-x-small-size--10-of-12 {\n    width: 83.3333333333%; }\n  .slds-x-small-size_11-of-12,\n  .slds-x-small-size--11-of-12 {\n    width: 91.6666666667%; }\n  .slds-x-small-size_12-of-12,\n  .slds-x-small-size--12-of-12 {\n    width: 100%; }\n  .slds-x-small-order_1,\n  .slds-x-small-order--1 {\n    -ms-flex-order: 1;\n        order: 1; }\n  .slds-x-small-order_2,\n  .slds-x-small-order--2 {\n    -ms-flex-order: 2;\n        order: 2; }\n  .slds-x-small-order_3,\n  .slds-x-small-order--3 {\n    -ms-flex-order: 3;\n        order: 3; }\n  .slds-x-small-order_4,\n  .slds-x-small-order--4 {\n    -ms-flex-order: 4;\n        order: 4; }\n  .slds-x-small-order_5,\n  .slds-x-small-order--5 {\n    -ms-flex-order: 5;\n        order: 5; }\n  .slds-x-small-order_6,\n  .slds-x-small-order--6 {\n    -ms-flex-order: 6;\n        order: 6; }\n  .slds-x-small-order_7,\n  .slds-x-small-order--7 {\n    -ms-flex-order: 7;\n        order: 7; }\n  .slds-x-small-order_8,\n  .slds-x-small-order--8 {\n    -ms-flex-order: 8;\n        order: 8; }\n  .slds-x-small-order_9,\n  .slds-x-small-order--9 {\n    -ms-flex-order: 9;\n        order: 9; }\n  .slds-x-small-order_10,\n  .slds-x-small-order--10 {\n    -ms-flex-order: 10;\n        order: 10; }\n  .slds-x-small-order_11,\n  .slds-x-small-order--11 {\n    -ms-flex-order: 11;\n        order: 11; }\n  .slds-x-small-order_12,\n  .slds-x-small-order--12 {\n    -ms-flex-order: 12;\n        order: 12; } }\n\n@media (max-width: 20em) {\n  [class*=\"slds-max-x-small-size_\"],\n  [class*=\"slds-max-x-small-size--\"] {\n    -ms-flex: none;\n        flex: none; }\n  .slds-max-x-small-size_xxx-small,\n  .slds-max-x-small-size--xxx-small {\n    width: 3rem; }\n  .slds-max-x-small-size_xx-small,\n  .slds-max-x-small-size--xx-small {\n    width: 6rem; }\n  .slds-max-x-small-size_x-small,\n  .slds-max-x-small-size--x-small {\n    width: 12rem; }\n  .slds-max-x-small-size_small,\n  .slds-max-x-small-size--small {\n    width: 15rem; }\n  .slds-max-x-small-size_medium,\n  .slds-max-x-small-size--medium {\n    width: 20rem; }\n  .slds-max-x-small-size_large,\n  .slds-max-x-small-size--large {\n    width: 25rem; }\n  .slds-max-x-small-size_x-large,\n  .slds-max-x-small-size--x-large {\n    width: 40rem; }\n  .slds-max-x-small-size_xx-large,\n  .slds-max-x-small-size--xx-large {\n    width: 60rem; }\n  .slds-max-x-small-size_1-of-1,\n  .slds-max-x-small-size--1-of-1 {\n    width: 100%; }\n  .slds-max-x-small-size_1-of-2,\n  .slds-max-x-small-size--1-of-2 {\n    width: 50%; }\n  .slds-max-x-small-size_2-of-2,\n  .slds-max-x-small-size--2-of-2 {\n    width: 100%; }\n  .slds-max-x-small-size_1-of-3,\n  .slds-max-x-small-size--1-of-3 {\n    width: 33.3333333333%; }\n  .slds-max-x-small-size_2-of-3,\n  .slds-max-x-small-size--2-of-3 {\n    width: 66.6666666667%; }\n  .slds-max-x-small-size_3-of-3,\n  .slds-max-x-small-size--3-of-3 {\n    width: 100%; }\n  .slds-max-x-small-size_1-of-4,\n  .slds-max-x-small-size--1-of-4 {\n    width: 25%; }\n  .slds-max-x-small-size_2-of-4,\n  .slds-max-x-small-size--2-of-4 {\n    width: 50%; }\n  .slds-max-x-small-size_3-of-4,\n  .slds-max-x-small-size--3-of-4 {\n    width: 75%; }\n  .slds-max-x-small-size_4-of-4,\n  .slds-max-x-small-size--4-of-4 {\n    width: 100%; }\n  .slds-max-x-small-size_1-of-5,\n  .slds-max-x-small-size--1-of-5 {\n    width: 20%; }\n  .slds-max-x-small-size_2-of-5,\n  .slds-max-x-small-size--2-of-5 {\n    width: 40%; }\n  .slds-max-x-small-size_3-of-5,\n  .slds-max-x-small-size--3-of-5 {\n    width: 60%; }\n  .slds-max-x-small-size_4-of-5,\n  .slds-max-x-small-size--4-of-5 {\n    width: 80%; }\n  .slds-max-x-small-size_5-of-5,\n  .slds-max-x-small-size--5-of-5 {\n    width: 100%; }\n  .slds-max-x-small-size_1-of-6,\n  .slds-max-x-small-size--1-of-6 {\n    width: 16.6666666667%; }\n  .slds-max-x-small-size_2-of-6,\n  .slds-max-x-small-size--2-of-6 {\n    width: 33.3333333333%; }\n  .slds-max-x-small-size_3-of-6,\n  .slds-max-x-small-size--3-of-6 {\n    width: 50%; }\n  .slds-max-x-small-size_4-of-6,\n  .slds-max-x-small-size--4-of-6 {\n    width: 66.6666666667%; }\n  .slds-max-x-small-size_5-of-6,\n  .slds-max-x-small-size--5-of-6 {\n    width: 83.3333333333%; }\n  .slds-max-x-small-size_6-of-6,\n  .slds-max-x-small-size--6-of-6 {\n    width: 100%; }\n  .slds-max-x-small-size_1-of-7,\n  .slds-max-x-small-size--1-of-7 {\n    width: 14.2857142857%; }\n  .slds-max-x-small-size_2-of-7,\n  .slds-max-x-small-size--2-of-7 {\n    width: 28.5714285714%; }\n  .slds-max-x-small-size_3-of-7,\n  .slds-max-x-small-size--3-of-7 {\n    width: 42.8571428571%; }\n  .slds-max-x-small-size_4-of-7,\n  .slds-max-x-small-size--4-of-7 {\n    width: 57.1428571429%; }\n  .slds-max-x-small-size_5-of-7,\n  .slds-max-x-small-size--5-of-7 {\n    width: 71.4285714286%; }\n  .slds-max-x-small-size_6-of-7,\n  .slds-max-x-small-size--6-of-7 {\n    width: 85.7142857143%; }\n  .slds-max-x-small-size_7-of-7,\n  .slds-max-x-small-size--7-of-7 {\n    width: 100%; }\n  .slds-max-x-small-size_1-of-8,\n  .slds-max-x-small-size--1-of-8 {\n    width: 12.5%; }\n  .slds-max-x-small-size_2-of-8,\n  .slds-max-x-small-size--2-of-8 {\n    width: 25%; }\n  .slds-max-x-small-size_3-of-8,\n  .slds-max-x-small-size--3-of-8 {\n    width: 37.5%; }\n  .slds-max-x-small-size_4-of-8,\n  .slds-max-x-small-size--4-of-8 {\n    width: 50%; }\n  .slds-max-x-small-size_5-of-8,\n  .slds-max-x-small-size--5-of-8 {\n    width: 62.5%; }\n  .slds-max-x-small-size_6-of-8,\n  .slds-max-x-small-size--6-of-8 {\n    width: 75%; }\n  .slds-max-x-small-size_7-of-8,\n  .slds-max-x-small-size--7-of-8 {\n    width: 87.5%; }\n  .slds-max-x-small-size_8-of-8,\n  .slds-max-x-small-size--8-of-8 {\n    width: 100%; }\n  .slds-max-x-small-size_1-of-12,\n  .slds-max-x-small-size--1-of-12 {\n    width: 8.3333333333%; }\n  .slds-max-x-small-size_2-of-12,\n  .slds-max-x-small-size--2-of-12 {\n    width: 16.6666666667%; }\n  .slds-max-x-small-size_3-of-12,\n  .slds-max-x-small-size--3-of-12 {\n    width: 25%; }\n  .slds-max-x-small-size_4-of-12,\n  .slds-max-x-small-size--4-of-12 {\n    width: 33.3333333333%; }\n  .slds-max-x-small-size_5-of-12,\n  .slds-max-x-small-size--5-of-12 {\n    width: 41.6666666667%; }\n  .slds-max-x-small-size_6-of-12,\n  .slds-max-x-small-size--6-of-12 {\n    width: 50%; }\n  .slds-max-x-small-size_7-of-12,\n  .slds-max-x-small-size--7-of-12 {\n    width: 58.3333333333%; }\n  .slds-max-x-small-size_8-of-12,\n  .slds-max-x-small-size--8-of-12 {\n    width: 66.6666666667%; }\n  .slds-max-x-small-size_9-of-12,\n  .slds-max-x-small-size--9-of-12 {\n    width: 75%; }\n  .slds-max-x-small-size_10-of-12,\n  .slds-max-x-small-size--10-of-12 {\n    width: 83.3333333333%; }\n  .slds-max-x-small-size_11-of-12,\n  .slds-max-x-small-size--11-of-12 {\n    width: 91.6666666667%; }\n  .slds-max-x-small-size_12-of-12,\n  .slds-max-x-small-size--12-of-12 {\n    width: 100%; }\n  .slds-max-x-small-order_1,\n  .slds-max-x-small-order--1 {\n    -ms-flex-order: 1;\n        order: 1; }\n  .slds-max-x-small-order_2,\n  .slds-max-x-small-order--2 {\n    -ms-flex-order: 2;\n        order: 2; }\n  .slds-max-x-small-order_3,\n  .slds-max-x-small-order--3 {\n    -ms-flex-order: 3;\n        order: 3; }\n  .slds-max-x-small-order_4,\n  .slds-max-x-small-order--4 {\n    -ms-flex-order: 4;\n        order: 4; }\n  .slds-max-x-small-order_5,\n  .slds-max-x-small-order--5 {\n    -ms-flex-order: 5;\n        order: 5; }\n  .slds-max-x-small-order_6,\n  .slds-max-x-small-order--6 {\n    -ms-flex-order: 6;\n        order: 6; }\n  .slds-max-x-small-order_7,\n  .slds-max-x-small-order--7 {\n    -ms-flex-order: 7;\n        order: 7; }\n  .slds-max-x-small-order_8,\n  .slds-max-x-small-order--8 {\n    -ms-flex-order: 8;\n        order: 8; }\n  .slds-max-x-small-order_9,\n  .slds-max-x-small-order--9 {\n    -ms-flex-order: 9;\n        order: 9; }\n  .slds-max-x-small-order_10,\n  .slds-max-x-small-order--10 {\n    -ms-flex-order: 10;\n        order: 10; }\n  .slds-max-x-small-order_11,\n  .slds-max-x-small-order--11 {\n    -ms-flex-order: 11;\n        order: 11; }\n  .slds-max-x-small-order_12,\n  .slds-max-x-small-order--12 {\n    -ms-flex-order: 12;\n        order: 12; } }\n\n@media (min-width: 30em) {\n  [class*=\"slds-small-size_\"],\n  [class*=\"slds-small-size--\"] {\n    -ms-flex: none;\n        flex: none; }\n  .slds-small-size_xxx-small,\n  .slds-small-size--xxx-small {\n    width: 3rem; }\n  .slds-small-size_xx-small,\n  .slds-small-size--xx-small {\n    width: 6rem; }\n  .slds-small-size_x-small,\n  .slds-small-size--x-small {\n    width: 12rem; }\n  .slds-small-size_small,\n  .slds-small-size--small {\n    width: 15rem; }\n  .slds-small-size_medium,\n  .slds-small-size--medium {\n    width: 20rem; }\n  .slds-small-size_large,\n  .slds-small-size--large {\n    width: 25rem; }\n  .slds-small-size_x-large,\n  .slds-small-size--x-large {\n    width: 40rem; }\n  .slds-small-size_xx-large,\n  .slds-small-size--xx-large {\n    width: 60rem; }\n  .slds-small-size_1-of-1,\n  .slds-small-size--1-of-1 {\n    width: 100%; }\n  .slds-small-size_1-of-2,\n  .slds-small-size--1-of-2 {\n    width: 50%; }\n  .slds-small-size_2-of-2,\n  .slds-small-size--2-of-2 {\n    width: 100%; }\n  .slds-small-size_1-of-3,\n  .slds-small-size--1-of-3 {\n    width: 33.3333333333%; }\n  .slds-small-size_2-of-3,\n  .slds-small-size--2-of-3 {\n    width: 66.6666666667%; }\n  .slds-small-size_3-of-3,\n  .slds-small-size--3-of-3 {\n    width: 100%; }\n  .slds-small-size_1-of-4,\n  .slds-small-size--1-of-4 {\n    width: 25%; }\n  .slds-small-size_2-of-4,\n  .slds-small-size--2-of-4 {\n    width: 50%; }\n  .slds-small-size_3-of-4,\n  .slds-small-size--3-of-4 {\n    width: 75%; }\n  .slds-small-size_4-of-4,\n  .slds-small-size--4-of-4 {\n    width: 100%; }\n  .slds-small-size_1-of-5,\n  .slds-small-size--1-of-5 {\n    width: 20%; }\n  .slds-small-size_2-of-5,\n  .slds-small-size--2-of-5 {\n    width: 40%; }\n  .slds-small-size_3-of-5,\n  .slds-small-size--3-of-5 {\n    width: 60%; }\n  .slds-small-size_4-of-5,\n  .slds-small-size--4-of-5 {\n    width: 80%; }\n  .slds-small-size_5-of-5,\n  .slds-small-size--5-of-5 {\n    width: 100%; }\n  .slds-small-size_1-of-6,\n  .slds-small-size--1-of-6 {\n    width: 16.6666666667%; }\n  .slds-small-size_2-of-6,\n  .slds-small-size--2-of-6 {\n    width: 33.3333333333%; }\n  .slds-small-size_3-of-6,\n  .slds-small-size--3-of-6 {\n    width: 50%; }\n  .slds-small-size_4-of-6,\n  .slds-small-size--4-of-6 {\n    width: 66.6666666667%; }\n  .slds-small-size_5-of-6,\n  .slds-small-size--5-of-6 {\n    width: 83.3333333333%; }\n  .slds-small-size_6-of-6,\n  .slds-small-size--6-of-6 {\n    width: 100%; }\n  .slds-small-size_1-of-7,\n  .slds-small-size--1-of-7 {\n    width: 14.2857142857%; }\n  .slds-small-size_2-of-7,\n  .slds-small-size--2-of-7 {\n    width: 28.5714285714%; }\n  .slds-small-size_3-of-7,\n  .slds-small-size--3-of-7 {\n    width: 42.8571428571%; }\n  .slds-small-size_4-of-7,\n  .slds-small-size--4-of-7 {\n    width: 57.1428571429%; }\n  .slds-small-size_5-of-7,\n  .slds-small-size--5-of-7 {\n    width: 71.4285714286%; }\n  .slds-small-size_6-of-7,\n  .slds-small-size--6-of-7 {\n    width: 85.7142857143%; }\n  .slds-small-size_7-of-7,\n  .slds-small-size--7-of-7 {\n    width: 100%; }\n  .slds-small-size_1-of-8,\n  .slds-small-size--1-of-8 {\n    width: 12.5%; }\n  .slds-small-size_2-of-8,\n  .slds-small-size--2-of-8 {\n    width: 25%; }\n  .slds-small-size_3-of-8,\n  .slds-small-size--3-of-8 {\n    width: 37.5%; }\n  .slds-small-size_4-of-8,\n  .slds-small-size--4-of-8 {\n    width: 50%; }\n  .slds-small-size_5-of-8,\n  .slds-small-size--5-of-8 {\n    width: 62.5%; }\n  .slds-small-size_6-of-8,\n  .slds-small-size--6-of-8 {\n    width: 75%; }\n  .slds-small-size_7-of-8,\n  .slds-small-size--7-of-8 {\n    width: 87.5%; }\n  .slds-small-size_8-of-8,\n  .slds-small-size--8-of-8 {\n    width: 100%; }\n  .slds-small-size_1-of-12,\n  .slds-small-size--1-of-12 {\n    width: 8.3333333333%; }\n  .slds-small-size_2-of-12,\n  .slds-small-size--2-of-12 {\n    width: 16.6666666667%; }\n  .slds-small-size_3-of-12,\n  .slds-small-size--3-of-12 {\n    width: 25%; }\n  .slds-small-size_4-of-12,\n  .slds-small-size--4-of-12 {\n    width: 33.3333333333%; }\n  .slds-small-size_5-of-12,\n  .slds-small-size--5-of-12 {\n    width: 41.6666666667%; }\n  .slds-small-size_6-of-12,\n  .slds-small-size--6-of-12 {\n    width: 50%; }\n  .slds-small-size_7-of-12,\n  .slds-small-size--7-of-12 {\n    width: 58.3333333333%; }\n  .slds-small-size_8-of-12,\n  .slds-small-size--8-of-12 {\n    width: 66.6666666667%; }\n  .slds-small-size_9-of-12,\n  .slds-small-size--9-of-12 {\n    width: 75%; }\n  .slds-small-size_10-of-12,\n  .slds-small-size--10-of-12 {\n    width: 83.3333333333%; }\n  .slds-small-size_11-of-12,\n  .slds-small-size--11-of-12 {\n    width: 91.6666666667%; }\n  .slds-small-size_12-of-12,\n  .slds-small-size--12-of-12 {\n    width: 100%; }\n  .slds-small-order_1,\n  .slds-small-order--1 {\n    -ms-flex-order: 1;\n        order: 1; }\n  .slds-small-order_2,\n  .slds-small-order--2 {\n    -ms-flex-order: 2;\n        order: 2; }\n  .slds-small-order_3,\n  .slds-small-order--3 {\n    -ms-flex-order: 3;\n        order: 3; }\n  .slds-small-order_4,\n  .slds-small-order--4 {\n    -ms-flex-order: 4;\n        order: 4; }\n  .slds-small-order_5,\n  .slds-small-order--5 {\n    -ms-flex-order: 5;\n        order: 5; }\n  .slds-small-order_6,\n  .slds-small-order--6 {\n    -ms-flex-order: 6;\n        order: 6; }\n  .slds-small-order_7,\n  .slds-small-order--7 {\n    -ms-flex-order: 7;\n        order: 7; }\n  .slds-small-order_8,\n  .slds-small-order--8 {\n    -ms-flex-order: 8;\n        order: 8; }\n  .slds-small-order_9,\n  .slds-small-order--9 {\n    -ms-flex-order: 9;\n        order: 9; }\n  .slds-small-order_10,\n  .slds-small-order--10 {\n    -ms-flex-order: 10;\n        order: 10; }\n  .slds-small-order_11,\n  .slds-small-order--11 {\n    -ms-flex-order: 11;\n        order: 11; }\n  .slds-small-order_12,\n  .slds-small-order--12 {\n    -ms-flex-order: 12;\n        order: 12; } }\n\n@media (max-width: 30em) {\n  [class*=\"slds-max-small-size_\"],\n  [class*=\"slds-max-small-size--\"] {\n    -ms-flex: none;\n        flex: none; }\n  .slds-max-small-size_xxx-small,\n  .slds-max-small-size--xxx-small {\n    width: 3rem; }\n  .slds-max-small-size_xx-small,\n  .slds-max-small-size--xx-small {\n    width: 6rem; }\n  .slds-max-small-size_x-small,\n  .slds-max-small-size--x-small {\n    width: 12rem; }\n  .slds-max-small-size_small,\n  .slds-max-small-size--small {\n    width: 15rem; }\n  .slds-max-small-size_medium,\n  .slds-max-small-size--medium {\n    width: 20rem; }\n  .slds-max-small-size_large,\n  .slds-max-small-size--large {\n    width: 25rem; }\n  .slds-max-small-size_x-large,\n  .slds-max-small-size--x-large {\n    width: 40rem; }\n  .slds-max-small-size_xx-large,\n  .slds-max-small-size--xx-large {\n    width: 60rem; }\n  .slds-max-small-size_1-of-1,\n  .slds-max-small-size--1-of-1 {\n    width: 100%; }\n  .slds-max-small-size_1-of-2,\n  .slds-max-small-size--1-of-2 {\n    width: 50%; }\n  .slds-max-small-size_2-of-2,\n  .slds-max-small-size--2-of-2 {\n    width: 100%; }\n  .slds-max-small-size_1-of-3,\n  .slds-max-small-size--1-of-3 {\n    width: 33.3333333333%; }\n  .slds-max-small-size_2-of-3,\n  .slds-max-small-size--2-of-3 {\n    width: 66.6666666667%; }\n  .slds-max-small-size_3-of-3,\n  .slds-max-small-size--3-of-3 {\n    width: 100%; }\n  .slds-max-small-size_1-of-4,\n  .slds-max-small-size--1-of-4 {\n    width: 25%; }\n  .slds-max-small-size_2-of-4,\n  .slds-max-small-size--2-of-4 {\n    width: 50%; }\n  .slds-max-small-size_3-of-4,\n  .slds-max-small-size--3-of-4 {\n    width: 75%; }\n  .slds-max-small-size_4-of-4,\n  .slds-max-small-size--4-of-4 {\n    width: 100%; }\n  .slds-max-small-size_1-of-5,\n  .slds-max-small-size--1-of-5 {\n    width: 20%; }\n  .slds-max-small-size_2-of-5,\n  .slds-max-small-size--2-of-5 {\n    width: 40%; }\n  .slds-max-small-size_3-of-5,\n  .slds-max-small-size--3-of-5 {\n    width: 60%; }\n  .slds-max-small-size_4-of-5,\n  .slds-max-small-size--4-of-5 {\n    width: 80%; }\n  .slds-max-small-size_5-of-5,\n  .slds-max-small-size--5-of-5 {\n    width: 100%; }\n  .slds-max-small-size_1-of-6,\n  .slds-max-small-size--1-of-6 {\n    width: 16.6666666667%; }\n  .slds-max-small-size_2-of-6,\n  .slds-max-small-size--2-of-6 {\n    width: 33.3333333333%; }\n  .slds-max-small-size_3-of-6,\n  .slds-max-small-size--3-of-6 {\n    width: 50%; }\n  .slds-max-small-size_4-of-6,\n  .slds-max-small-size--4-of-6 {\n    width: 66.6666666667%; }\n  .slds-max-small-size_5-of-6,\n  .slds-max-small-size--5-of-6 {\n    width: 83.3333333333%; }\n  .slds-max-small-size_6-of-6,\n  .slds-max-small-size--6-of-6 {\n    width: 100%; }\n  .slds-max-small-size_1-of-7,\n  .slds-max-small-size--1-of-7 {\n    width: 14.2857142857%; }\n  .slds-max-small-size_2-of-7,\n  .slds-max-small-size--2-of-7 {\n    width: 28.5714285714%; }\n  .slds-max-small-size_3-of-7,\n  .slds-max-small-size--3-of-7 {\n    width: 42.8571428571%; }\n  .slds-max-small-size_4-of-7,\n  .slds-max-small-size--4-of-7 {\n    width: 57.1428571429%; }\n  .slds-max-small-size_5-of-7,\n  .slds-max-small-size--5-of-7 {\n    width: 71.4285714286%; }\n  .slds-max-small-size_6-of-7,\n  .slds-max-small-size--6-of-7 {\n    width: 85.7142857143%; }\n  .slds-max-small-size_7-of-7,\n  .slds-max-small-size--7-of-7 {\n    width: 100%; }\n  .slds-max-small-size_1-of-8,\n  .slds-max-small-size--1-of-8 {\n    width: 12.5%; }\n  .slds-max-small-size_2-of-8,\n  .slds-max-small-size--2-of-8 {\n    width: 25%; }\n  .slds-max-small-size_3-of-8,\n  .slds-max-small-size--3-of-8 {\n    width: 37.5%; }\n  .slds-max-small-size_4-of-8,\n  .slds-max-small-size--4-of-8 {\n    width: 50%; }\n  .slds-max-small-size_5-of-8,\n  .slds-max-small-size--5-of-8 {\n    width: 62.5%; }\n  .slds-max-small-size_6-of-8,\n  .slds-max-small-size--6-of-8 {\n    width: 75%; }\n  .slds-max-small-size_7-of-8,\n  .slds-max-small-size--7-of-8 {\n    width: 87.5%; }\n  .slds-max-small-size_8-of-8,\n  .slds-max-small-size--8-of-8 {\n    width: 100%; }\n  .slds-max-small-size_1-of-12,\n  .slds-max-small-size--1-of-12 {\n    width: 8.3333333333%; }\n  .slds-max-small-size_2-of-12,\n  .slds-max-small-size--2-of-12 {\n    width: 16.6666666667%; }\n  .slds-max-small-size_3-of-12,\n  .slds-max-small-size--3-of-12 {\n    width: 25%; }\n  .slds-max-small-size_4-of-12,\n  .slds-max-small-size--4-of-12 {\n    width: 33.3333333333%; }\n  .slds-max-small-size_5-of-12,\n  .slds-max-small-size--5-of-12 {\n    width: 41.6666666667%; }\n  .slds-max-small-size_6-of-12,\n  .slds-max-small-size--6-of-12 {\n    width: 50%; }\n  .slds-max-small-size_7-of-12,\n  .slds-max-small-size--7-of-12 {\n    width: 58.3333333333%; }\n  .slds-max-small-size_8-of-12,\n  .slds-max-small-size--8-of-12 {\n    width: 66.6666666667%; }\n  .slds-max-small-size_9-of-12,\n  .slds-max-small-size--9-of-12 {\n    width: 75%; }\n  .slds-max-small-size_10-of-12,\n  .slds-max-small-size--10-of-12 {\n    width: 83.3333333333%; }\n  .slds-max-small-size_11-of-12,\n  .slds-max-small-size--11-of-12 {\n    width: 91.6666666667%; }\n  .slds-max-small-size_12-of-12,\n  .slds-max-small-size--12-of-12 {\n    width: 100%; }\n  .slds-max-small-order_1,\n  .slds-max-small-order--1 {\n    -ms-flex-order: 1;\n        order: 1; }\n  .slds-max-small-order_2,\n  .slds-max-small-order--2 {\n    -ms-flex-order: 2;\n        order: 2; }\n  .slds-max-small-order_3,\n  .slds-max-small-order--3 {\n    -ms-flex-order: 3;\n        order: 3; }\n  .slds-max-small-order_4,\n  .slds-max-small-order--4 {\n    -ms-flex-order: 4;\n        order: 4; }\n  .slds-max-small-order_5,\n  .slds-max-small-order--5 {\n    -ms-flex-order: 5;\n        order: 5; }\n  .slds-max-small-order_6,\n  .slds-max-small-order--6 {\n    -ms-flex-order: 6;\n        order: 6; }\n  .slds-max-small-order_7,\n  .slds-max-small-order--7 {\n    -ms-flex-order: 7;\n        order: 7; }\n  .slds-max-small-order_8,\n  .slds-max-small-order--8 {\n    -ms-flex-order: 8;\n        order: 8; }\n  .slds-max-small-order_9,\n  .slds-max-small-order--9 {\n    -ms-flex-order: 9;\n        order: 9; }\n  .slds-max-small-order_10,\n  .slds-max-small-order--10 {\n    -ms-flex-order: 10;\n        order: 10; }\n  .slds-max-small-order_11,\n  .slds-max-small-order--11 {\n    -ms-flex-order: 11;\n        order: 11; }\n  .slds-max-small-order_12,\n  .slds-max-small-order--12 {\n    -ms-flex-order: 12;\n        order: 12; } }\n\n@media (min-width: 48em) {\n  [class*=\"slds-medium-size_\"],\n  [class*=\"slds-medium-size--\"] {\n    -ms-flex: none;\n        flex: none; }\n  .slds-medium-size_xxx-small,\n  .slds-medium-size--xxx-small {\n    width: 3rem; }\n  .slds-medium-size_xx-small,\n  .slds-medium-size--xx-small {\n    width: 6rem; }\n  .slds-medium-size_x-small,\n  .slds-medium-size--x-small {\n    width: 12rem; }\n  .slds-medium-size_small,\n  .slds-medium-size--small {\n    width: 15rem; }\n  .slds-medium-size_medium,\n  .slds-medium-size--medium {\n    width: 20rem; }\n  .slds-medium-size_large,\n  .slds-medium-size--large {\n    width: 25rem; }\n  .slds-medium-size_x-large,\n  .slds-medium-size--x-large {\n    width: 40rem; }\n  .slds-medium-size_xx-large,\n  .slds-medium-size--xx-large {\n    width: 60rem; }\n  .slds-medium-size_1-of-1,\n  .slds-medium-size--1-of-1 {\n    width: 100%; }\n  .slds-medium-size_1-of-2,\n  .slds-medium-size--1-of-2 {\n    width: 50%; }\n  .slds-medium-size_2-of-2,\n  .slds-medium-size--2-of-2 {\n    width: 100%; }\n  .slds-medium-size_1-of-3,\n  .slds-medium-size--1-of-3 {\n    width: 33.3333333333%; }\n  .slds-medium-size_2-of-3,\n  .slds-medium-size--2-of-3 {\n    width: 66.6666666667%; }\n  .slds-medium-size_3-of-3,\n  .slds-medium-size--3-of-3 {\n    width: 100%; }\n  .slds-medium-size_1-of-4,\n  .slds-medium-size--1-of-4 {\n    width: 25%; }\n  .slds-medium-size_2-of-4,\n  .slds-medium-size--2-of-4 {\n    width: 50%; }\n  .slds-medium-size_3-of-4,\n  .slds-medium-size--3-of-4 {\n    width: 75%; }\n  .slds-medium-size_4-of-4,\n  .slds-medium-size--4-of-4 {\n    width: 100%; }\n  .slds-medium-size_1-of-5,\n  .slds-medium-size--1-of-5 {\n    width: 20%; }\n  .slds-medium-size_2-of-5,\n  .slds-medium-size--2-of-5 {\n    width: 40%; }\n  .slds-medium-size_3-of-5,\n  .slds-medium-size--3-of-5 {\n    width: 60%; }\n  .slds-medium-size_4-of-5,\n  .slds-medium-size--4-of-5 {\n    width: 80%; }\n  .slds-medium-size_5-of-5,\n  .slds-medium-size--5-of-5 {\n    width: 100%; }\n  .slds-medium-size_1-of-6,\n  .slds-medium-size--1-of-6 {\n    width: 16.6666666667%; }\n  .slds-medium-size_2-of-6,\n  .slds-medium-size--2-of-6 {\n    width: 33.3333333333%; }\n  .slds-medium-size_3-of-6,\n  .slds-medium-size--3-of-6 {\n    width: 50%; }\n  .slds-medium-size_4-of-6,\n  .slds-medium-size--4-of-6 {\n    width: 66.6666666667%; }\n  .slds-medium-size_5-of-6,\n  .slds-medium-size--5-of-6 {\n    width: 83.3333333333%; }\n  .slds-medium-size_6-of-6,\n  .slds-medium-size--6-of-6 {\n    width: 100%; }\n  .slds-medium-size_1-of-7,\n  .slds-medium-size--1-of-7 {\n    width: 14.2857142857%; }\n  .slds-medium-size_2-of-7,\n  .slds-medium-size--2-of-7 {\n    width: 28.5714285714%; }\n  .slds-medium-size_3-of-7,\n  .slds-medium-size--3-of-7 {\n    width: 42.8571428571%; }\n  .slds-medium-size_4-of-7,\n  .slds-medium-size--4-of-7 {\n    width: 57.1428571429%; }\n  .slds-medium-size_5-of-7,\n  .slds-medium-size--5-of-7 {\n    width: 71.4285714286%; }\n  .slds-medium-size_6-of-7,\n  .slds-medium-size--6-of-7 {\n    width: 85.7142857143%; }\n  .slds-medium-size_7-of-7,\n  .slds-medium-size--7-of-7 {\n    width: 100%; }\n  .slds-medium-size_1-of-8,\n  .slds-medium-size--1-of-8 {\n    width: 12.5%; }\n  .slds-medium-size_2-of-8,\n  .slds-medium-size--2-of-8 {\n    width: 25%; }\n  .slds-medium-size_3-of-8,\n  .slds-medium-size--3-of-8 {\n    width: 37.5%; }\n  .slds-medium-size_4-of-8,\n  .slds-medium-size--4-of-8 {\n    width: 50%; }\n  .slds-medium-size_5-of-8,\n  .slds-medium-size--5-of-8 {\n    width: 62.5%; }\n  .slds-medium-size_6-of-8,\n  .slds-medium-size--6-of-8 {\n    width: 75%; }\n  .slds-medium-size_7-of-8,\n  .slds-medium-size--7-of-8 {\n    width: 87.5%; }\n  .slds-medium-size_8-of-8,\n  .slds-medium-size--8-of-8 {\n    width: 100%; }\n  .slds-medium-size_1-of-12,\n  .slds-medium-size--1-of-12 {\n    width: 8.3333333333%; }\n  .slds-medium-size_2-of-12,\n  .slds-medium-size--2-of-12 {\n    width: 16.6666666667%; }\n  .slds-medium-size_3-of-12,\n  .slds-medium-size--3-of-12 {\n    width: 25%; }\n  .slds-medium-size_4-of-12,\n  .slds-medium-size--4-of-12 {\n    width: 33.3333333333%; }\n  .slds-medium-size_5-of-12,\n  .slds-medium-size--5-of-12 {\n    width: 41.6666666667%; }\n  .slds-medium-size_6-of-12,\n  .slds-medium-size--6-of-12 {\n    width: 50%; }\n  .slds-medium-size_7-of-12,\n  .slds-medium-size--7-of-12 {\n    width: 58.3333333333%; }\n  .slds-medium-size_8-of-12,\n  .slds-medium-size--8-of-12 {\n    width: 66.6666666667%; }\n  .slds-medium-size_9-of-12,\n  .slds-medium-size--9-of-12 {\n    width: 75%; }\n  .slds-medium-size_10-of-12,\n  .slds-medium-size--10-of-12 {\n    width: 83.3333333333%; }\n  .slds-medium-size_11-of-12,\n  .slds-medium-size--11-of-12 {\n    width: 91.6666666667%; }\n  .slds-medium-size_12-of-12,\n  .slds-medium-size--12-of-12 {\n    width: 100%; }\n  .slds-medium-order_1,\n  .slds-medium-order--1 {\n    -ms-flex-order: 1;\n        order: 1; }\n  .slds-medium-order_2,\n  .slds-medium-order--2 {\n    -ms-flex-order: 2;\n        order: 2; }\n  .slds-medium-order_3,\n  .slds-medium-order--3 {\n    -ms-flex-order: 3;\n        order: 3; }\n  .slds-medium-order_4,\n  .slds-medium-order--4 {\n    -ms-flex-order: 4;\n        order: 4; }\n  .slds-medium-order_5,\n  .slds-medium-order--5 {\n    -ms-flex-order: 5;\n        order: 5; }\n  .slds-medium-order_6,\n  .slds-medium-order--6 {\n    -ms-flex-order: 6;\n        order: 6; }\n  .slds-medium-order_7,\n  .slds-medium-order--7 {\n    -ms-flex-order: 7;\n        order: 7; }\n  .slds-medium-order_8,\n  .slds-medium-order--8 {\n    -ms-flex-order: 8;\n        order: 8; }\n  .slds-medium-order_9,\n  .slds-medium-order--9 {\n    -ms-flex-order: 9;\n        order: 9; }\n  .slds-medium-order_10,\n  .slds-medium-order--10 {\n    -ms-flex-order: 10;\n        order: 10; }\n  .slds-medium-order_11,\n  .slds-medium-order--11 {\n    -ms-flex-order: 11;\n        order: 11; }\n  .slds-medium-order_12,\n  .slds-medium-order--12 {\n    -ms-flex-order: 12;\n        order: 12; } }\n\n@media (max-width: 48em) {\n  [class*=\"slds-max-medium-size_\"],\n  [class*=\"slds-max-medium-size--\"] {\n    -ms-flex: none;\n        flex: none; }\n  .slds-max-medium-size_xxx-small,\n  .slds-max-medium-size--xxx-small {\n    width: 3rem; }\n  .slds-max-medium-size_xx-small,\n  .slds-max-medium-size--xx-small {\n    width: 6rem; }\n  .slds-max-medium-size_x-small,\n  .slds-max-medium-size--x-small {\n    width: 12rem; }\n  .slds-max-medium-size_small,\n  .slds-max-medium-size--small {\n    width: 15rem; }\n  .slds-max-medium-size_medium,\n  .slds-max-medium-size--medium {\n    width: 20rem; }\n  .slds-max-medium-size_large,\n  .slds-max-medium-size--large {\n    width: 25rem; }\n  .slds-max-medium-size_x-large,\n  .slds-max-medium-size--x-large {\n    width: 40rem; }\n  .slds-max-medium-size_xx-large,\n  .slds-max-medium-size--xx-large {\n    width: 60rem; }\n  .slds-max-medium-size_1-of-1,\n  .slds-max-medium-size--1-of-1 {\n    width: 100%; }\n  .slds-max-medium-size_1-of-2,\n  .slds-max-medium-size--1-of-2 {\n    width: 50%; }\n  .slds-max-medium-size_2-of-2,\n  .slds-max-medium-size--2-of-2 {\n    width: 100%; }\n  .slds-max-medium-size_1-of-3,\n  .slds-max-medium-size--1-of-3 {\n    width: 33.3333333333%; }\n  .slds-max-medium-size_2-of-3,\n  .slds-max-medium-size--2-of-3 {\n    width: 66.6666666667%; }\n  .slds-max-medium-size_3-of-3,\n  .slds-max-medium-size--3-of-3 {\n    width: 100%; }\n  .slds-max-medium-size_1-of-4,\n  .slds-max-medium-size--1-of-4 {\n    width: 25%; }\n  .slds-max-medium-size_2-of-4,\n  .slds-max-medium-size--2-of-4 {\n    width: 50%; }\n  .slds-max-medium-size_3-of-4,\n  .slds-max-medium-size--3-of-4 {\n    width: 75%; }\n  .slds-max-medium-size_4-of-4,\n  .slds-max-medium-size--4-of-4 {\n    width: 100%; }\n  .slds-max-medium-size_1-of-5,\n  .slds-max-medium-size--1-of-5 {\n    width: 20%; }\n  .slds-max-medium-size_2-of-5,\n  .slds-max-medium-size--2-of-5 {\n    width: 40%; }\n  .slds-max-medium-size_3-of-5,\n  .slds-max-medium-size--3-of-5 {\n    width: 60%; }\n  .slds-max-medium-size_4-of-5,\n  .slds-max-medium-size--4-of-5 {\n    width: 80%; }\n  .slds-max-medium-size_5-of-5,\n  .slds-max-medium-size--5-of-5 {\n    width: 100%; }\n  .slds-max-medium-size_1-of-6,\n  .slds-max-medium-size--1-of-6 {\n    width: 16.6666666667%; }\n  .slds-max-medium-size_2-of-6,\n  .slds-max-medium-size--2-of-6 {\n    width: 33.3333333333%; }\n  .slds-max-medium-size_3-of-6,\n  .slds-max-medium-size--3-of-6 {\n    width: 50%; }\n  .slds-max-medium-size_4-of-6,\n  .slds-max-medium-size--4-of-6 {\n    width: 66.6666666667%; }\n  .slds-max-medium-size_5-of-6,\n  .slds-max-medium-size--5-of-6 {\n    width: 83.3333333333%; }\n  .slds-max-medium-size_6-of-6,\n  .slds-max-medium-size--6-of-6 {\n    width: 100%; }\n  .slds-max-medium-size_1-of-7,\n  .slds-max-medium-size--1-of-7 {\n    width: 14.2857142857%; }\n  .slds-max-medium-size_2-of-7,\n  .slds-max-medium-size--2-of-7 {\n    width: 28.5714285714%; }\n  .slds-max-medium-size_3-of-7,\n  .slds-max-medium-size--3-of-7 {\n    width: 42.8571428571%; }\n  .slds-max-medium-size_4-of-7,\n  .slds-max-medium-size--4-of-7 {\n    width: 57.1428571429%; }\n  .slds-max-medium-size_5-of-7,\n  .slds-max-medium-size--5-of-7 {\n    width: 71.4285714286%; }\n  .slds-max-medium-size_6-of-7,\n  .slds-max-medium-size--6-of-7 {\n    width: 85.7142857143%; }\n  .slds-max-medium-size_7-of-7,\n  .slds-max-medium-size--7-of-7 {\n    width: 100%; }\n  .slds-max-medium-size_1-of-8,\n  .slds-max-medium-size--1-of-8 {\n    width: 12.5%; }\n  .slds-max-medium-size_2-of-8,\n  .slds-max-medium-size--2-of-8 {\n    width: 25%; }\n  .slds-max-medium-size_3-of-8,\n  .slds-max-medium-size--3-of-8 {\n    width: 37.5%; }\n  .slds-max-medium-size_4-of-8,\n  .slds-max-medium-size--4-of-8 {\n    width: 50%; }\n  .slds-max-medium-size_5-of-8,\n  .slds-max-medium-size--5-of-8 {\n    width: 62.5%; }\n  .slds-max-medium-size_6-of-8,\n  .slds-max-medium-size--6-of-8 {\n    width: 75%; }\n  .slds-max-medium-size_7-of-8,\n  .slds-max-medium-size--7-of-8 {\n    width: 87.5%; }\n  .slds-max-medium-size_8-of-8,\n  .slds-max-medium-size--8-of-8 {\n    width: 100%; }\n  .slds-max-medium-size_1-of-12,\n  .slds-max-medium-size--1-of-12 {\n    width: 8.3333333333%; }\n  .slds-max-medium-size_2-of-12,\n  .slds-max-medium-size--2-of-12 {\n    width: 16.6666666667%; }\n  .slds-max-medium-size_3-of-12,\n  .slds-max-medium-size--3-of-12 {\n    width: 25%; }\n  .slds-max-medium-size_4-of-12,\n  .slds-max-medium-size--4-of-12 {\n    width: 33.3333333333%; }\n  .slds-max-medium-size_5-of-12,\n  .slds-max-medium-size--5-of-12 {\n    width: 41.6666666667%; }\n  .slds-max-medium-size_6-of-12,\n  .slds-max-medium-size--6-of-12 {\n    width: 50%; }\n  .slds-max-medium-size_7-of-12,\n  .slds-max-medium-size--7-of-12 {\n    width: 58.3333333333%; }\n  .slds-max-medium-size_8-of-12,\n  .slds-max-medium-size--8-of-12 {\n    width: 66.6666666667%; }\n  .slds-max-medium-size_9-of-12,\n  .slds-max-medium-size--9-of-12 {\n    width: 75%; }\n  .slds-max-medium-size_10-of-12,\n  .slds-max-medium-size--10-of-12 {\n    width: 83.3333333333%; }\n  .slds-max-medium-size_11-of-12,\n  .slds-max-medium-size--11-of-12 {\n    width: 91.6666666667%; }\n  .slds-max-medium-size_12-of-12,\n  .slds-max-medium-size--12-of-12 {\n    width: 100%; }\n  .slds-max-medium-order_1,\n  .slds-max-medium-order--1 {\n    -ms-flex-order: 1;\n        order: 1; }\n  .slds-max-medium-order_2,\n  .slds-max-medium-order--2 {\n    -ms-flex-order: 2;\n        order: 2; }\n  .slds-max-medium-order_3,\n  .slds-max-medium-order--3 {\n    -ms-flex-order: 3;\n        order: 3; }\n  .slds-max-medium-order_4,\n  .slds-max-medium-order--4 {\n    -ms-flex-order: 4;\n        order: 4; }\n  .slds-max-medium-order_5,\n  .slds-max-medium-order--5 {\n    -ms-flex-order: 5;\n        order: 5; }\n  .slds-max-medium-order_6,\n  .slds-max-medium-order--6 {\n    -ms-flex-order: 6;\n        order: 6; }\n  .slds-max-medium-order_7,\n  .slds-max-medium-order--7 {\n    -ms-flex-order: 7;\n        order: 7; }\n  .slds-max-medium-order_8,\n  .slds-max-medium-order--8 {\n    -ms-flex-order: 8;\n        order: 8; }\n  .slds-max-medium-order_9,\n  .slds-max-medium-order--9 {\n    -ms-flex-order: 9;\n        order: 9; }\n  .slds-max-medium-order_10,\n  .slds-max-medium-order--10 {\n    -ms-flex-order: 10;\n        order: 10; }\n  .slds-max-medium-order_11,\n  .slds-max-medium-order--11 {\n    -ms-flex-order: 11;\n        order: 11; }\n  .slds-max-medium-order_12,\n  .slds-max-medium-order--12 {\n    -ms-flex-order: 12;\n        order: 12; } }\n\n@media (min-width: 64em) {\n  [class*=\"slds-large-size_\"],\n  [class*=\"slds-large-size--\"] {\n    -ms-flex: none;\n        flex: none; }\n  .slds-large-size_xxx-small,\n  .slds-large-size--xxx-small {\n    width: 3rem; }\n  .slds-large-size_xx-small,\n  .slds-large-size--xx-small {\n    width: 6rem; }\n  .slds-large-size_x-small,\n  .slds-large-size--x-small {\n    width: 12rem; }\n  .slds-large-size_small,\n  .slds-large-size--small {\n    width: 15rem; }\n  .slds-large-size_medium,\n  .slds-large-size--medium {\n    width: 20rem; }\n  .slds-large-size_large,\n  .slds-large-size--large {\n    width: 25rem; }\n  .slds-large-size_x-large,\n  .slds-large-size--x-large {\n    width: 40rem; }\n  .slds-large-size_xx-large,\n  .slds-large-size--xx-large {\n    width: 60rem; }\n  .slds-large-size_1-of-1,\n  .slds-large-size--1-of-1 {\n    width: 100%; }\n  .slds-large-size_1-of-2,\n  .slds-large-size--1-of-2 {\n    width: 50%; }\n  .slds-large-size_2-of-2,\n  .slds-large-size--2-of-2 {\n    width: 100%; }\n  .slds-large-size_1-of-3,\n  .slds-large-size--1-of-3 {\n    width: 33.3333333333%; }\n  .slds-large-size_2-of-3,\n  .slds-large-size--2-of-3 {\n    width: 66.6666666667%; }\n  .slds-large-size_3-of-3,\n  .slds-large-size--3-of-3 {\n    width: 100%; }\n  .slds-large-size_1-of-4,\n  .slds-large-size--1-of-4 {\n    width: 25%; }\n  .slds-large-size_2-of-4,\n  .slds-large-size--2-of-4 {\n    width: 50%; }\n  .slds-large-size_3-of-4,\n  .slds-large-size--3-of-4 {\n    width: 75%; }\n  .slds-large-size_4-of-4,\n  .slds-large-size--4-of-4 {\n    width: 100%; }\n  .slds-large-size_1-of-5,\n  .slds-large-size--1-of-5 {\n    width: 20%; }\n  .slds-large-size_2-of-5,\n  .slds-large-size--2-of-5 {\n    width: 40%; }\n  .slds-large-size_3-of-5,\n  .slds-large-size--3-of-5 {\n    width: 60%; }\n  .slds-large-size_4-of-5,\n  .slds-large-size--4-of-5 {\n    width: 80%; }\n  .slds-large-size_5-of-5,\n  .slds-large-size--5-of-5 {\n    width: 100%; }\n  .slds-large-size_1-of-6,\n  .slds-large-size--1-of-6 {\n    width: 16.6666666667%; }\n  .slds-large-size_2-of-6,\n  .slds-large-size--2-of-6 {\n    width: 33.3333333333%; }\n  .slds-large-size_3-of-6,\n  .slds-large-size--3-of-6 {\n    width: 50%; }\n  .slds-large-size_4-of-6,\n  .slds-large-size--4-of-6 {\n    width: 66.6666666667%; }\n  .slds-large-size_5-of-6,\n  .slds-large-size--5-of-6 {\n    width: 83.3333333333%; }\n  .slds-large-size_6-of-6,\n  .slds-large-size--6-of-6 {\n    width: 100%; }\n  .slds-large-size_1-of-7,\n  .slds-large-size--1-of-7 {\n    width: 14.2857142857%; }\n  .slds-large-size_2-of-7,\n  .slds-large-size--2-of-7 {\n    width: 28.5714285714%; }\n  .slds-large-size_3-of-7,\n  .slds-large-size--3-of-7 {\n    width: 42.8571428571%; }\n  .slds-large-size_4-of-7,\n  .slds-large-size--4-of-7 {\n    width: 57.1428571429%; }\n  .slds-large-size_5-of-7,\n  .slds-large-size--5-of-7 {\n    width: 71.4285714286%; }\n  .slds-large-size_6-of-7,\n  .slds-large-size--6-of-7 {\n    width: 85.7142857143%; }\n  .slds-large-size_7-of-7,\n  .slds-large-size--7-of-7 {\n    width: 100%; }\n  .slds-large-size_1-of-8,\n  .slds-large-size--1-of-8 {\n    width: 12.5%; }\n  .slds-large-size_2-of-8,\n  .slds-large-size--2-of-8 {\n    width: 25%; }\n  .slds-large-size_3-of-8,\n  .slds-large-size--3-of-8 {\n    width: 37.5%; }\n  .slds-large-size_4-of-8,\n  .slds-large-size--4-of-8 {\n    width: 50%; }\n  .slds-large-size_5-of-8,\n  .slds-large-size--5-of-8 {\n    width: 62.5%; }\n  .slds-large-size_6-of-8,\n  .slds-large-size--6-of-8 {\n    width: 75%; }\n  .slds-large-size_7-of-8,\n  .slds-large-size--7-of-8 {\n    width: 87.5%; }\n  .slds-large-size_8-of-8,\n  .slds-large-size--8-of-8 {\n    width: 100%; }\n  .slds-large-size_1-of-12,\n  .slds-large-size--1-of-12 {\n    width: 8.3333333333%; }\n  .slds-large-size_2-of-12,\n  .slds-large-size--2-of-12 {\n    width: 16.6666666667%; }\n  .slds-large-size_3-of-12,\n  .slds-large-size--3-of-12 {\n    width: 25%; }\n  .slds-large-size_4-of-12,\n  .slds-large-size--4-of-12 {\n    width: 33.3333333333%; }\n  .slds-large-size_5-of-12,\n  .slds-large-size--5-of-12 {\n    width: 41.6666666667%; }\n  .slds-large-size_6-of-12,\n  .slds-large-size--6-of-12 {\n    width: 50%; }\n  .slds-large-size_7-of-12,\n  .slds-large-size--7-of-12 {\n    width: 58.3333333333%; }\n  .slds-large-size_8-of-12,\n  .slds-large-size--8-of-12 {\n    width: 66.6666666667%; }\n  .slds-large-size_9-of-12,\n  .slds-large-size--9-of-12 {\n    width: 75%; }\n  .slds-large-size_10-of-12,\n  .slds-large-size--10-of-12 {\n    width: 83.3333333333%; }\n  .slds-large-size_11-of-12,\n  .slds-large-size--11-of-12 {\n    width: 91.6666666667%; }\n  .slds-large-size_12-of-12,\n  .slds-large-size--12-of-12 {\n    width: 100%; }\n  .slds-large-order_1,\n  .slds-large-order--1 {\n    -ms-flex-order: 1;\n        order: 1; }\n  .slds-large-order_2,\n  .slds-large-order--2 {\n    -ms-flex-order: 2;\n        order: 2; }\n  .slds-large-order_3,\n  .slds-large-order--3 {\n    -ms-flex-order: 3;\n        order: 3; }\n  .slds-large-order_4,\n  .slds-large-order--4 {\n    -ms-flex-order: 4;\n        order: 4; }\n  .slds-large-order_5,\n  .slds-large-order--5 {\n    -ms-flex-order: 5;\n        order: 5; }\n  .slds-large-order_6,\n  .slds-large-order--6 {\n    -ms-flex-order: 6;\n        order: 6; }\n  .slds-large-order_7,\n  .slds-large-order--7 {\n    -ms-flex-order: 7;\n        order: 7; }\n  .slds-large-order_8,\n  .slds-large-order--8 {\n    -ms-flex-order: 8;\n        order: 8; }\n  .slds-large-order_9,\n  .slds-large-order--9 {\n    -ms-flex-order: 9;\n        order: 9; }\n  .slds-large-order_10,\n  .slds-large-order--10 {\n    -ms-flex-order: 10;\n        order: 10; }\n  .slds-large-order_11,\n  .slds-large-order--11 {\n    -ms-flex-order: 11;\n        order: 11; }\n  .slds-large-order_12,\n  .slds-large-order--12 {\n    -ms-flex-order: 12;\n        order: 12; } }\n\n@media (max-width: 64em) {\n  [class*=\"slds-max-large-size_\"],\n  [class*=\"slds-max-large-size--\"] {\n    -ms-flex: none;\n        flex: none; }\n  .slds-max-large-size_xxx-small,\n  .slds-max-large-size--xxx-small {\n    width: 3rem; }\n  .slds-max-large-size_xx-small,\n  .slds-max-large-size--xx-small {\n    width: 6rem; }\n  .slds-max-large-size_x-small,\n  .slds-max-large-size--x-small {\n    width: 12rem; }\n  .slds-max-large-size_small,\n  .slds-max-large-size--small {\n    width: 15rem; }\n  .slds-max-large-size_medium,\n  .slds-max-large-size--medium {\n    width: 20rem; }\n  .slds-max-large-size_large,\n  .slds-max-large-size--large {\n    width: 25rem; }\n  .slds-max-large-size_x-large,\n  .slds-max-large-size--x-large {\n    width: 40rem; }\n  .slds-max-large-size_xx-large,\n  .slds-max-large-size--xx-large {\n    width: 60rem; }\n  .slds-max-large-size_1-of-1,\n  .slds-max-large-size--1-of-1 {\n    width: 100%; }\n  .slds-max-large-size_1-of-2,\n  .slds-max-large-size--1-of-2 {\n    width: 50%; }\n  .slds-max-large-size_2-of-2,\n  .slds-max-large-size--2-of-2 {\n    width: 100%; }\n  .slds-max-large-size_1-of-3,\n  .slds-max-large-size--1-of-3 {\n    width: 33.3333333333%; }\n  .slds-max-large-size_2-of-3,\n  .slds-max-large-size--2-of-3 {\n    width: 66.6666666667%; }\n  .slds-max-large-size_3-of-3,\n  .slds-max-large-size--3-of-3 {\n    width: 100%; }\n  .slds-max-large-size_1-of-4,\n  .slds-max-large-size--1-of-4 {\n    width: 25%; }\n  .slds-max-large-size_2-of-4,\n  .slds-max-large-size--2-of-4 {\n    width: 50%; }\n  .slds-max-large-size_3-of-4,\n  .slds-max-large-size--3-of-4 {\n    width: 75%; }\n  .slds-max-large-size_4-of-4,\n  .slds-max-large-size--4-of-4 {\n    width: 100%; }\n  .slds-max-large-size_1-of-5,\n  .slds-max-large-size--1-of-5 {\n    width: 20%; }\n  .slds-max-large-size_2-of-5,\n  .slds-max-large-size--2-of-5 {\n    width: 40%; }\n  .slds-max-large-size_3-of-5,\n  .slds-max-large-size--3-of-5 {\n    width: 60%; }\n  .slds-max-large-size_4-of-5,\n  .slds-max-large-size--4-of-5 {\n    width: 80%; }\n  .slds-max-large-size_5-of-5,\n  .slds-max-large-size--5-of-5 {\n    width: 100%; }\n  .slds-max-large-size_1-of-6,\n  .slds-max-large-size--1-of-6 {\n    width: 16.6666666667%; }\n  .slds-max-large-size_2-of-6,\n  .slds-max-large-size--2-of-6 {\n    width: 33.3333333333%; }\n  .slds-max-large-size_3-of-6,\n  .slds-max-large-size--3-of-6 {\n    width: 50%; }\n  .slds-max-large-size_4-of-6,\n  .slds-max-large-size--4-of-6 {\n    width: 66.6666666667%; }\n  .slds-max-large-size_5-of-6,\n  .slds-max-large-size--5-of-6 {\n    width: 83.3333333333%; }\n  .slds-max-large-size_6-of-6,\n  .slds-max-large-size--6-of-6 {\n    width: 100%; }\n  .slds-max-large-size_1-of-7,\n  .slds-max-large-size--1-of-7 {\n    width: 14.2857142857%; }\n  .slds-max-large-size_2-of-7,\n  .slds-max-large-size--2-of-7 {\n    width: 28.5714285714%; }\n  .slds-max-large-size_3-of-7,\n  .slds-max-large-size--3-of-7 {\n    width: 42.8571428571%; }\n  .slds-max-large-size_4-of-7,\n  .slds-max-large-size--4-of-7 {\n    width: 57.1428571429%; }\n  .slds-max-large-size_5-of-7,\n  .slds-max-large-size--5-of-7 {\n    width: 71.4285714286%; }\n  .slds-max-large-size_6-of-7,\n  .slds-max-large-size--6-of-7 {\n    width: 85.7142857143%; }\n  .slds-max-large-size_7-of-7,\n  .slds-max-large-size--7-of-7 {\n    width: 100%; }\n  .slds-max-large-size_1-of-8,\n  .slds-max-large-size--1-of-8 {\n    width: 12.5%; }\n  .slds-max-large-size_2-of-8,\n  .slds-max-large-size--2-of-8 {\n    width: 25%; }\n  .slds-max-large-size_3-of-8,\n  .slds-max-large-size--3-of-8 {\n    width: 37.5%; }\n  .slds-max-large-size_4-of-8,\n  .slds-max-large-size--4-of-8 {\n    width: 50%; }\n  .slds-max-large-size_5-of-8,\n  .slds-max-large-size--5-of-8 {\n    width: 62.5%; }\n  .slds-max-large-size_6-of-8,\n  .slds-max-large-size--6-of-8 {\n    width: 75%; }\n  .slds-max-large-size_7-of-8,\n  .slds-max-large-size--7-of-8 {\n    width: 87.5%; }\n  .slds-max-large-size_8-of-8,\n  .slds-max-large-size--8-of-8 {\n    width: 100%; }\n  .slds-max-large-size_1-of-12,\n  .slds-max-large-size--1-of-12 {\n    width: 8.3333333333%; }\n  .slds-max-large-size_2-of-12,\n  .slds-max-large-size--2-of-12 {\n    width: 16.6666666667%; }\n  .slds-max-large-size_3-of-12,\n  .slds-max-large-size--3-of-12 {\n    width: 25%; }\n  .slds-max-large-size_4-of-12,\n  .slds-max-large-size--4-of-12 {\n    width: 33.3333333333%; }\n  .slds-max-large-size_5-of-12,\n  .slds-max-large-size--5-of-12 {\n    width: 41.6666666667%; }\n  .slds-max-large-size_6-of-12,\n  .slds-max-large-size--6-of-12 {\n    width: 50%; }\n  .slds-max-large-size_7-of-12,\n  .slds-max-large-size--7-of-12 {\n    width: 58.3333333333%; }\n  .slds-max-large-size_8-of-12,\n  .slds-max-large-size--8-of-12 {\n    width: 66.6666666667%; }\n  .slds-max-large-size_9-of-12,\n  .slds-max-large-size--9-of-12 {\n    width: 75%; }\n  .slds-max-large-size_10-of-12,\n  .slds-max-large-size--10-of-12 {\n    width: 83.3333333333%; }\n  .slds-max-large-size_11-of-12,\n  .slds-max-large-size--11-of-12 {\n    width: 91.6666666667%; }\n  .slds-max-large-size_12-of-12,\n  .slds-max-large-size--12-of-12 {\n    width: 100%; }\n  .slds-max-large-order_1,\n  .slds-max-large-order--1 {\n    -ms-flex-order: 1;\n        order: 1; }\n  .slds-max-large-order_2,\n  .slds-max-large-order--2 {\n    -ms-flex-order: 2;\n        order: 2; }\n  .slds-max-large-order_3,\n  .slds-max-large-order--3 {\n    -ms-flex-order: 3;\n        order: 3; }\n  .slds-max-large-order_4,\n  .slds-max-large-order--4 {\n    -ms-flex-order: 4;\n        order: 4; }\n  .slds-max-large-order_5,\n  .slds-max-large-order--5 {\n    -ms-flex-order: 5;\n        order: 5; }\n  .slds-max-large-order_6,\n  .slds-max-large-order--6 {\n    -ms-flex-order: 6;\n        order: 6; }\n  .slds-max-large-order_7,\n  .slds-max-large-order--7 {\n    -ms-flex-order: 7;\n        order: 7; }\n  .slds-max-large-order_8,\n  .slds-max-large-order--8 {\n    -ms-flex-order: 8;\n        order: 8; }\n  .slds-max-large-order_9,\n  .slds-max-large-order--9 {\n    -ms-flex-order: 9;\n        order: 9; }\n  .slds-max-large-order_10,\n  .slds-max-large-order--10 {\n    -ms-flex-order: 10;\n        order: 10; }\n  .slds-max-large-order_11,\n  .slds-max-large-order--11 {\n    -ms-flex-order: 11;\n        order: 11; }\n  .slds-max-large-order_12,\n  .slds-max-large-order--12 {\n    -ms-flex-order: 12;\n        order: 12; } }\n\n[class*=\"slds-size_\"],\n[class*=\"slds-size--\"] {\n  -ms-flex: none;\n      flex: none; }\n\n/**\n * @summary Global margin that can be applied to any element\n *\n * @selector .slds-has-buffer\n * @modifier\n */\n.slds-has-buffer {\n  margin: 0.75rem; }\n\n/**\n * @summary Global margin reset that can be applied to any element\n *\n * @selector .slds-has-full-bleed\n * @modifier\n */\n.slds-has-full-bleed {\n  margin: 0; }\n\n/**\n * @summary Assumes element below is connected\n *\n * @selector .slds-has-bottom-magnet\n * @modifier\n */\n.slds-has-bottom-magnet {\n  margin-bottom: 0 !important;\n  border-bottom-left-radius: 0 !important;\n  border-bottom-right-radius: 0 !important; }\n\n/**\n * @summary Assumes element above is connected\n *\n * @selector .slds-has-top-magnet\n * @modifier\n */\n.slds-has-top-magnet {\n  margin-top: 0 !important;\n  border-top-left-radius: 0 !important;\n  border-top-right-radius: 0 !important; }\n\n.slds-has-top-magnet.slds-has-buffer {\n  margin-bottom: 0;\n  border-radius: 0;\n  border-top: 0;\n  box-shadow: none; }\n\n/**\n * @summary Reset positioning back to normal behavior\n *\n * @name static\n * @selector .slds-is-static\n * @modifier\n */\n.slds-is-static {\n  position: static; }\n\n/**\n * @summary Used to contain children if children are absolutely positioned and out of flow. Also used to position element without changing layout.\n *\n * @name relative\n * @selector .slds-is-relative\n * @modifier\n */\n.slds-is-relative {\n  position: relative; }\n\n/**\n * @summary Used to position an element relative to the viewport.\n *\n * @name fixed\n * @selector .slds-is-fixed\n * @modifier\n */\n.slds-is-fixed {\n  position: fixed; }\n\n/**\n * @summary Used to position an element relative to its closest ancestor with relative positioning.\n *\n * @name absolute\n * @selector .slds-is-absolute\n * @modifier\n */\n.slds-is-absolute {\n  position: absolute; }\n\n/* stylelint-disable declaration-no-important */\n/**\n * @summary Hides an element yet enables a screen reader to read the element that is hidden\n *\n * @selector .slds-assistive-text\n * @notes This should be used over other methods when you don't want to hide from screenreaders\n * @modifier\n */\n.slds-assistive-text {\n  position: absolute !important;\n  margin: -1px !important;\n  border: 0 !important;\n  padding: 0 !important;\n  width: 1px !important;\n  height: 1px !important;\n  overflow: hidden !important;\n  clip: rect(0 0 0 0) !important;\n  text-transform: none !important;\n  white-space: nowrap !important; }\n\n/**\n * @summary Enables `.slds-assistive-text` to become visible on focus\n *\n * @selector .slds-assistive-text_focus\n * @restrict .slds-assistive-text\n * @modifier\n */\n.slds-assistive-text_focus:focus,\n.slds-assistive-text--focus:focus {\n  margin: inherit !important;\n  border: inherit !important;\n  padding: inherit !important;\n  width: auto !important;\n  height: auto !important;\n  overflow: visible !important;\n  clip: auto !important; }\n\n/**\n * @summary Hides elements inside a parent\n *\n * @selector .slds-is-collapsed\n * @modifier\n */\n.slds-is-collapsed {\n  height: 0;\n  overflow: hidden; }\n\n.slds-collapsed {\n  height: 0;\n  overflow: hidden; }\n\n/**\n * @summary Shows the elements inside the parent\n *\n * @selector .slds-is-collapsed\n * @modifier\n */\n.slds-is-expanded {\n  height: auto;\n  overflow: visible; }\n\n.slds-expanded {\n  height: auto;\n  overflow: visible; }\n\n/**\n * @summary Hides an element from the page by setting the visibility property to `hidden`\n *\n * @selector .slds-hidden\n * @notes An element hidden with this class will reserve the normal space on the page and will not be announced by screenreaders.\n * @modifier\n */\n.slds-hidden {\n  visibility: hidden; }\n\n/**\n * @summary Shows the element by setting the visibility property to `visible`\n *\n * @selector .slds-visible\n * @notes This is toggled on the element. `.slds-hidden` class is removed and `.slds-visible` is added.\n * @modifier\n */\n.slds-visible {\n  visibility: visible; }\n\n/**\n * @summary Hides an element from the page by setting display propery to `none`\n *\n * @selector .slds-hide\n * @notes An element hidden with this class will take up no space on the page and will not be announced by screenreaders.\n * @modifier\n */\n.slds-hide {\n  display: none; }\n\n/**\n * @summary Shows the element by setting display property to `block`\n *\n * @selector .slds-show\n * @notes This is toggled on the element. `.slds-hide` class is removed and `.slds-show` is added.\n * @modifier\n */\n.slds-show {\n  display: block; }\n\n/**\n * @summary Shows the element by setting display to `inline-block`\n *\n * @selector .slds-show_inline-block\n * @notes This is toggled on the element. `.slds-hide` class is removed and `.slds-show--inline-block` is added.\n * @modifier\n */\n.slds-show_inline-block,\n.slds-show--inline-block {\n  display: inline-block; }\n\n/**\n * @summary Shows the element by setting display to `inline`\n *\n * @selector .slds-show_inline\n * @notes This is toggled on the element. `.slds-hide` class is removed and `.slds-show--inline` is added.\n * @modifier\n */\n.slds-show_inline,\n.slds-show--inline {\n  display: inline; }\n\n/**\n * @summary Hides an element from the page by setting the opacity property set to `0`\n *\n * @selector .transition-hide\n * @notes This works like the `.slds-hidden` class and reserves the space but allows you to add the `transition` property to transition the speed that it is shown or hidden.\n * @modifier\n */\n.slds-transition-hide {\n  opacity: 0; }\n\n/**\n * @summary Shows the element using the opacity property set to `1`\n *\n * @selector .transition-show\n * @notes This is toggled on the element. `.slds-transition-hide` class is removed and `.slds-transition-show` is added.\n * @modifier\n */\n.slds-transition-show {\n  opacity: 1; }\n\n.slds-x-small {\n  /* Allow class interpolation with parent selector for easier utility class generation */\n  /* stylelint-disable selector-class-pattern */\n  /* stylelint-enable selector-class-pattern */ }\n\n.slds-x-small-show {\n  display: none; }\n\n@media (min-width: 320px) {\n  .slds-x-small-show {\n    display: block; }\n  .slds-x-small-show_inline-block, .slds-x-small-show--inline-block {\n    display: inline-block; }\n  .slds-x-small-show_inline, .slds-x-small-show--inline {\n    display: inline; } }\n\n.slds-x-small-show-only {\n  display: none; }\n\n@media (min-width: 320px) and (max-width: 479px) {\n  .slds-x-small-show-only {\n    display: block; }\n  .slds-x-small-show-only_inline-block, .slds-x-small-show-only--inline-block {\n    display: inline-block; }\n  .slds-x-small-show-only_inline, .slds-x-small-show-only--inline {\n    display: inline; } }\n\n@media (max-width: 479px) {\n  .slds-max-x-small-hide {\n    display: none; } }\n\n.slds-small {\n  /* Allow class interpolation with parent selector for easier utility class generation */\n  /* stylelint-disable selector-class-pattern */\n  /* stylelint-enable selector-class-pattern */ }\n\n.slds-small-show {\n  display: none; }\n\n@media (min-width: 480px) {\n  .slds-small-show {\n    display: block; }\n  .slds-small-show_inline-block, .slds-small-show--inline-block {\n    display: inline-block; }\n  .slds-small-show_inline, .slds-small-show--inline {\n    display: inline; } }\n\n.slds-small-show-only {\n  display: none; }\n\n@media (min-width: 480px) and (max-width: 767px) {\n  .slds-small-show-only {\n    display: block; }\n  .slds-small-show-only_inline-block, .slds-small-show-only--inline-block {\n    display: inline-block; }\n  .slds-small-show-only_inline, .slds-small-show-only--inline {\n    display: inline; } }\n\n@media (max-width: 767px) {\n  .slds-max-small-hide {\n    display: none; } }\n\n.slds-medium {\n  /* Allow class interpolation with parent selector for easier utility class generation */\n  /* stylelint-disable selector-class-pattern */\n  /* stylelint-enable selector-class-pattern */ }\n\n.slds-medium-show {\n  display: none; }\n\n@media (min-width: 768px) {\n  .slds-medium-show {\n    display: block; }\n  .slds-medium-show_inline-block, .slds-medium-show--inline-block {\n    display: inline-block; }\n  .slds-medium-show_inline, .slds-medium-show--inline {\n    display: inline; } }\n\n.slds-medium-show-only {\n  display: none; }\n\n@media (min-width: 768px) and (max-width: 1023px) {\n  .slds-medium-show-only {\n    display: block; }\n  .slds-medium-show-only_inline-block, .slds-medium-show-only--inline-block {\n    display: inline-block; }\n  .slds-medium-show-only_inline, .slds-medium-show-only--inline {\n    display: inline; } }\n\n@media (max-width: 1023px) {\n  .slds-max-medium-hide {\n    display: none; } }\n\n.slds-large {\n  /* Allow class interpolation with parent selector for easier utility class generation */\n  /* stylelint-disable selector-class-pattern */\n  /* stylelint-enable selector-class-pattern */ }\n\n.slds-large-show {\n  display: none; }\n\n@media (min-width: 1024px) {\n  .slds-large-show {\n    display: block; }\n  .slds-large-show_inline-block, .slds-large-show--inline-block {\n    display: inline-block; }\n  .slds-large-show_inline, .slds-large-show--inline {\n    display: inline; } }\n\n@media (min-width: 320px) {\n  /**\n     * @summary Hides the element when the window is bigger than the specific size. Sizes can be: x-small, small, medium, large, and * x-large.\n     *\n     * @selector .slds-hide_*\n     * @notes Element will be displayed normally when the window is smaller\n     * @modifier\n     */\n  .slds-hide_x-small,\n  .slds-hide--x-small {\n    display: none !important; } }\n\n@media (max-width: 319px) {\n  /**\n     * @summary Shows the element when the window is bigger than the specific size. Sizes can be: x-small, small, medium, large, and * x-large.\n     *\n     * @selector .slds-show_*\n     * @notes Element will be displayed normally when the window is bigger\n     * @modifier\n     */\n  .slds-show_x-small,\n  .slds-show--x-small {\n    display: none !important; } }\n\n@media (min-width: 480px) {\n  /**\n     * @summary Hides the element when the window is bigger than the specific size. Sizes can be: x-small, small, medium, large, and * x-large.\n     *\n     * @selector .slds-hide_*\n     * @notes Element will be displayed normally when the window is smaller\n     * @modifier\n     */\n  .slds-hide_small,\n  .slds-hide--small {\n    display: none !important; } }\n\n@media (max-width: 479px) {\n  /**\n     * @summary Shows the element when the window is bigger than the specific size. Sizes can be: x-small, small, medium, large, and * x-large.\n     *\n     * @selector .slds-show_*\n     * @notes Element will be displayed normally when the window is bigger\n     * @modifier\n     */\n  .slds-show_small,\n  .slds-show--small {\n    display: none !important; } }\n\n@media (min-width: 768px) {\n  /**\n     * @summary Hides the element when the window is bigger than the specific size. Sizes can be: x-small, small, medium, large, and * x-large.\n     *\n     * @selector .slds-hide_*\n     * @notes Element will be displayed normally when the window is smaller\n     * @modifier\n     */\n  .slds-hide_medium,\n  .slds-hide--medium {\n    display: none !important; } }\n\n@media (max-width: 767px) {\n  /**\n     * @summary Shows the element when the window is bigger than the specific size. Sizes can be: x-small, small, medium, large, and * x-large.\n     *\n     * @selector .slds-show_*\n     * @notes Element will be displayed normally when the window is bigger\n     * @modifier\n     */\n  .slds-show_medium,\n  .slds-show--medium {\n    display: none !important; } }\n\n@media (min-width: 1024px) {\n  /**\n     * @summary Hides the element when the window is bigger than the specific size. Sizes can be: x-small, small, medium, large, and * x-large.\n     *\n     * @selector .slds-hide_*\n     * @notes Element will be displayed normally when the window is smaller\n     * @modifier\n     */\n  .slds-hide_large,\n  .slds-hide--large {\n    display: none !important; } }\n\n@media (max-width: 1023px) {\n  /**\n     * @summary Shows the element when the window is bigger than the specific size. Sizes can be: x-small, small, medium, large, and * x-large.\n     *\n     * @selector .slds-show_*\n     * @notes Element will be displayed normally when the window is bigger\n     * @modifier\n     */\n  .slds-show_large,\n  .slds-show--large {\n    display: none !important; } }\n\n@media (min-width: 1280px) {\n  /**\n     * @summary Hides the element when the window is bigger than the specific size. Sizes can be: x-small, small, medium, large, and * x-large.\n     *\n     * @selector .slds-hide_*\n     * @notes Element will be displayed normally when the window is smaller\n     * @modifier\n     */\n  .slds-hide_x-large,\n  .slds-hide--x-large {\n    display: none !important; } }\n\n@media (max-width: 1279px) {\n  /**\n     * @summary Shows the element when the window is bigger than the specific size. Sizes can be: x-small, small, medium, large, and * x-large.\n     *\n     * @selector .slds-show_*\n     * @notes Element will be displayed normally when the window is bigger\n     * @modifier\n     */\n  .slds-show_x-large,\n  .slds-show--x-large {\n    display: none !important; } }\n\n/*! HTML5 Boilerplate v5.2.0 | MIT License | https://html5boilerplate.com/ */\n@media print {\n  *,\n  *:before,\n  *:after {\n    background: transparent !important;\n    color: #000 !important;\n    box-shadow: none !important;\n    text-shadow: none !important; }\n  a,\n  a:visited {\n    text-decoration: underline; }\n  a[href]:after {\n    content: \" (\" attr(href) \")\"; }\n  abbr[title]:after {\n    content: \" (\" attr(title) \")\"; }\n  a[href^=\"#\"]:after,\n  a[href^=\"javascript:\"]:after {\n    content: ''; }\n  pre,\n  blockquote {\n    border: 1px solid #999;\n    page-break-inside: avoid; }\n  thead {\n    display: table-header-group; }\n  tr,\n  img {\n    page-break-inside: avoid; }\n  img {\n    max-width: 100% !important; }\n  p,\n  h2,\n  h3 {\n    orphans: 3;\n    widows: 3; }\n  h2,\n  h3 {\n    page-break-after: avoid; } }\n", ""]);

// exports


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = function escape(url) {
    if (typeof url !== 'string') {
        return url
    }
    // If url is already wrapped in quotes, remove them
    if (/^['"].*['"]$/.test(url)) {
        url = url.slice(1, -1);
    }
    // Should url be wrapped?
    // See https://drafts.csswg.org/css-values-3/#urls
    if (/["'() \t\n]/.test(url)) {
        return '"' + url.replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"'
    }

    return url
}


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/SalesforceSans-Light.woff2";

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/SalesforceSans-Light.woff";

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/SalesforceSans-LightItalic.woff2";

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/SalesforceSans-LightItalic.woff";

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/SalesforceSans-Regular.woff2";

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/SalesforceSans-Regular.woff";

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/SalesforceSans-Italic.woff2";

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/SalesforceSans-Italic.woff";

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/SalesforceSans-Bold.woff2";

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/SalesforceSans-Bold.woff";

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/SalesforceSans-BoldItalic.woff2";

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/SalesforceSans-BoldItalic.woff";

/***/ }),
/* 18 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(20);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../css-loader/index.js!./cropper.css", function() {
			var newContent = require("!!../../css-loader/index.js!./cropper.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "/*!\n * Cropper.js v1.5.6\n * https://fengyuanchen.github.io/cropperjs\n *\n * Copyright 2015-present Chen Fengyuan\n * Released under the MIT license\n *\n * Date: 2019-10-04T04:33:44.164Z\n */\n\n.cropper-container {\n  direction: ltr;\n  font-size: 0;\n  line-height: 0;\n  position: relative;\n  -ms-touch-action: none;\n  touch-action: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.cropper-container img {\n  display: block;\n  height: 100%;\n  image-orientation: 0deg;\n  max-height: none !important;\n  max-width: none !important;\n  min-height: 0 !important;\n  min-width: 0 !important;\n  width: 100%;\n}\n\n.cropper-wrap-box,\n.cropper-canvas,\n.cropper-drag-box,\n.cropper-crop-box,\n.cropper-modal {\n  bottom: 0;\n  left: 0;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n\n.cropper-wrap-box,\n.cropper-canvas {\n  overflow: hidden;\n}\n\n.cropper-drag-box {\n  background-color: #fff;\n  opacity: 0;\n}\n\n.cropper-modal {\n  background-color: #000;\n  opacity: 0.5;\n}\n\n.cropper-view-box {\n  display: block;\n  height: 100%;\n  outline: 1px solid #39f;\n  outline-color: rgba(51, 153, 255, 0.75);\n  overflow: hidden;\n  width: 100%;\n}\n\n.cropper-dashed {\n  border: 0 dashed #eee;\n  display: block;\n  opacity: 0.5;\n  position: absolute;\n}\n\n.cropper-dashed.dashed-h {\n  border-bottom-width: 1px;\n  border-top-width: 1px;\n  height: calc(100% / 3);\n  left: 0;\n  top: calc(100% / 3);\n  width: 100%;\n}\n\n.cropper-dashed.dashed-v {\n  border-left-width: 1px;\n  border-right-width: 1px;\n  height: 100%;\n  left: calc(100% / 3);\n  top: 0;\n  width: calc(100% / 3);\n}\n\n.cropper-center {\n  display: block;\n  height: 0;\n  left: 50%;\n  opacity: 0.75;\n  position: absolute;\n  top: 50%;\n  width: 0;\n}\n\n.cropper-center::before,\n.cropper-center::after {\n  background-color: #eee;\n  content: ' ';\n  display: block;\n  position: absolute;\n}\n\n.cropper-center::before {\n  height: 1px;\n  left: -3px;\n  top: 0;\n  width: 7px;\n}\n\n.cropper-center::after {\n  height: 7px;\n  left: 0;\n  top: -3px;\n  width: 1px;\n}\n\n.cropper-face,\n.cropper-line,\n.cropper-point {\n  display: block;\n  height: 100%;\n  opacity: 0.1;\n  position: absolute;\n  width: 100%;\n}\n\n.cropper-face {\n  background-color: #fff;\n  left: 0;\n  top: 0;\n}\n\n.cropper-line {\n  background-color: #39f;\n}\n\n.cropper-line.line-e {\n  cursor: ew-resize;\n  right: -3px;\n  top: 0;\n  width: 5px;\n}\n\n.cropper-line.line-n {\n  cursor: ns-resize;\n  height: 5px;\n  left: 0;\n  top: -3px;\n}\n\n.cropper-line.line-w {\n  cursor: ew-resize;\n  left: -3px;\n  top: 0;\n  width: 5px;\n}\n\n.cropper-line.line-s {\n  bottom: -3px;\n  cursor: ns-resize;\n  height: 5px;\n  left: 0;\n}\n\n.cropper-point {\n  background-color: #39f;\n  height: 5px;\n  opacity: 0.75;\n  width: 5px;\n}\n\n.cropper-point.point-e {\n  cursor: ew-resize;\n  margin-top: -3px;\n  right: -3px;\n  top: 50%;\n}\n\n.cropper-point.point-n {\n  cursor: ns-resize;\n  left: 50%;\n  margin-left: -3px;\n  top: -3px;\n}\n\n.cropper-point.point-w {\n  cursor: ew-resize;\n  left: -3px;\n  margin-top: -3px;\n  top: 50%;\n}\n\n.cropper-point.point-s {\n  bottom: -3px;\n  cursor: s-resize;\n  left: 50%;\n  margin-left: -3px;\n}\n\n.cropper-point.point-ne {\n  cursor: nesw-resize;\n  right: -3px;\n  top: -3px;\n}\n\n.cropper-point.point-nw {\n  cursor: nwse-resize;\n  left: -3px;\n  top: -3px;\n}\n\n.cropper-point.point-sw {\n  bottom: -3px;\n  cursor: nesw-resize;\n  left: -3px;\n}\n\n.cropper-point.point-se {\n  bottom: -3px;\n  cursor: nwse-resize;\n  height: 20px;\n  opacity: 1;\n  right: -3px;\n  width: 20px;\n}\n\n@media (min-width: 768px) {\n  .cropper-point.point-se {\n    height: 15px;\n    width: 15px;\n  }\n}\n\n@media (min-width: 992px) {\n  .cropper-point.point-se {\n    height: 10px;\n    width: 10px;\n  }\n}\n\n@media (min-width: 1200px) {\n  .cropper-point.point-se {\n    height: 5px;\n    opacity: 0.75;\n    width: 5px;\n  }\n}\n\n.cropper-point.point-se::before {\n  background-color: #39f;\n  bottom: -50%;\n  content: ' ';\n  display: block;\n  height: 200%;\n  opacity: 0;\n  position: absolute;\n  right: -50%;\n  width: 200%;\n}\n\n.cropper-invisible {\n  opacity: 0;\n}\n\n.cropper-bg {\n  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');\n}\n\n.cropper-hide {\n  display: block;\n  height: 0;\n  position: absolute;\n  width: 0;\n}\n\n.cropper-hidden {\n  display: none !important;\n}\n\n.cropper-move {\n  cursor: move;\n}\n\n.cropper-crop {\n  cursor: crosshair;\n}\n\n.cropper-disabled .cropper-drag-box,\n.cropper-disabled .cropper-face,\n.cropper-disabled .cropper-line,\n.cropper-disabled .cropper-point {\n  cursor: not-allowed;\n}\n", ""]);

// exports


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * Cropper.js v1.5.6
 * https://fengyuanchen.github.io/cropperjs
 *
 * Copyright 2015-present Chen Fengyuan
 * Released under the MIT license
 *
 * Date: 2019-10-04T04:33:48.372Z
 */

(function (global, factory) {
   true ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Cropper = factory());
}(this, function () { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(source, true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(source).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  var IS_BROWSER = typeof window !== 'undefined' && typeof window.document !== 'undefined';
  var WINDOW = IS_BROWSER ? window : {};
  var IS_TOUCH_DEVICE = IS_BROWSER ? 'ontouchstart' in WINDOW.document.documentElement : false;
  var HAS_POINTER_EVENT = IS_BROWSER ? 'PointerEvent' in WINDOW : false;
  var NAMESPACE = 'cropper'; // Actions

  var ACTION_ALL = 'all';
  var ACTION_CROP = 'crop';
  var ACTION_MOVE = 'move';
  var ACTION_ZOOM = 'zoom';
  var ACTION_EAST = 'e';
  var ACTION_WEST = 'w';
  var ACTION_SOUTH = 's';
  var ACTION_NORTH = 'n';
  var ACTION_NORTH_EAST = 'ne';
  var ACTION_NORTH_WEST = 'nw';
  var ACTION_SOUTH_EAST = 'se';
  var ACTION_SOUTH_WEST = 'sw'; // Classes

  var CLASS_CROP = "".concat(NAMESPACE, "-crop");
  var CLASS_DISABLED = "".concat(NAMESPACE, "-disabled");
  var CLASS_HIDDEN = "".concat(NAMESPACE, "-hidden");
  var CLASS_HIDE = "".concat(NAMESPACE, "-hide");
  var CLASS_INVISIBLE = "".concat(NAMESPACE, "-invisible");
  var CLASS_MODAL = "".concat(NAMESPACE, "-modal");
  var CLASS_MOVE = "".concat(NAMESPACE, "-move"); // Data keys

  var DATA_ACTION = "".concat(NAMESPACE, "Action");
  var DATA_PREVIEW = "".concat(NAMESPACE, "Preview"); // Drag modes

  var DRAG_MODE_CROP = 'crop';
  var DRAG_MODE_MOVE = 'move';
  var DRAG_MODE_NONE = 'none'; // Events

  var EVENT_CROP = 'crop';
  var EVENT_CROP_END = 'cropend';
  var EVENT_CROP_MOVE = 'cropmove';
  var EVENT_CROP_START = 'cropstart';
  var EVENT_DBLCLICK = 'dblclick';
  var EVENT_TOUCH_START = IS_TOUCH_DEVICE ? 'touchstart' : 'mousedown';
  var EVENT_TOUCH_MOVE = IS_TOUCH_DEVICE ? 'touchmove' : 'mousemove';
  var EVENT_TOUCH_END = IS_TOUCH_DEVICE ? 'touchend touchcancel' : 'mouseup';
  var EVENT_POINTER_DOWN = HAS_POINTER_EVENT ? 'pointerdown' : EVENT_TOUCH_START;
  var EVENT_POINTER_MOVE = HAS_POINTER_EVENT ? 'pointermove' : EVENT_TOUCH_MOVE;
  var EVENT_POINTER_UP = HAS_POINTER_EVENT ? 'pointerup pointercancel' : EVENT_TOUCH_END;
  var EVENT_READY = 'ready';
  var EVENT_RESIZE = 'resize';
  var EVENT_WHEEL = 'wheel';
  var EVENT_ZOOM = 'zoom'; // Mime types

  var MIME_TYPE_JPEG = 'image/jpeg'; // RegExps

  var REGEXP_ACTIONS = /^e|w|s|n|se|sw|ne|nw|all|crop|move|zoom$/;
  var REGEXP_DATA_URL = /^data:/;
  var REGEXP_DATA_URL_JPEG = /^data:image\/jpeg;base64,/;
  var REGEXP_TAG_NAME = /^img|canvas$/i; // Misc
  // Inspired by the default width and height of a canvas element.

  var MIN_CONTAINER_WIDTH = 200;
  var MIN_CONTAINER_HEIGHT = 100;

  var DEFAULTS = {
    // Define the view mode of the cropper
    viewMode: 0,
    // 0, 1, 2, 3
    // Define the dragging mode of the cropper
    dragMode: DRAG_MODE_CROP,
    // 'crop', 'move' or 'none'
    // Define the initial aspect ratio of the crop box
    initialAspectRatio: NaN,
    // Define the aspect ratio of the crop box
    aspectRatio: NaN,
    // An object with the previous cropping result data
    data: null,
    // A selector for adding extra containers to preview
    preview: '',
    // Re-render the cropper when resize the window
    responsive: true,
    // Restore the cropped area after resize the window
    restore: true,
    // Check if the current image is a cross-origin image
    checkCrossOrigin: true,
    // Check the current image's Exif Orientation information
    checkOrientation: true,
    // Show the black modal
    modal: true,
    // Show the dashed lines for guiding
    guides: true,
    // Show the center indicator for guiding
    center: true,
    // Show the white modal to highlight the crop box
    highlight: true,
    // Show the grid background
    background: true,
    // Enable to crop the image automatically when initialize
    autoCrop: true,
    // Define the percentage of automatic cropping area when initializes
    autoCropArea: 0.8,
    // Enable to move the image
    movable: true,
    // Enable to rotate the image
    rotatable: true,
    // Enable to scale the image
    scalable: true,
    // Enable to zoom the image
    zoomable: true,
    // Enable to zoom the image by dragging touch
    zoomOnTouch: true,
    // Enable to zoom the image by wheeling mouse
    zoomOnWheel: true,
    // Define zoom ratio when zoom the image by wheeling mouse
    wheelZoomRatio: 0.1,
    // Enable to move the crop box
    cropBoxMovable: true,
    // Enable to resize the crop box
    cropBoxResizable: true,
    // Toggle drag mode between "crop" and "move" when click twice on the cropper
    toggleDragModeOnDblclick: true,
    // Size limitation
    minCanvasWidth: 0,
    minCanvasHeight: 0,
    minCropBoxWidth: 0,
    minCropBoxHeight: 0,
    minContainerWidth: 200,
    minContainerHeight: 100,
    // Shortcuts of events
    ready: null,
    cropstart: null,
    cropmove: null,
    cropend: null,
    crop: null,
    zoom: null
  };

  var TEMPLATE = '<div class="cropper-container" touch-action="none">' + '<div class="cropper-wrap-box">' + '<div class="cropper-canvas"></div>' + '</div>' + '<div class="cropper-drag-box"></div>' + '<div class="cropper-crop-box">' + '<span class="cropper-view-box"></span>' + '<span class="cropper-dashed dashed-h"></span>' + '<span class="cropper-dashed dashed-v"></span>' + '<span class="cropper-center"></span>' + '<span class="cropper-face"></span>' + '<span class="cropper-line line-e" data-cropper-action="e"></span>' + '<span class="cropper-line line-n" data-cropper-action="n"></span>' + '<span class="cropper-line line-w" data-cropper-action="w"></span>' + '<span class="cropper-line line-s" data-cropper-action="s"></span>' + '<span class="cropper-point point-e" data-cropper-action="e"></span>' + '<span class="cropper-point point-n" data-cropper-action="n"></span>' + '<span class="cropper-point point-w" data-cropper-action="w"></span>' + '<span class="cropper-point point-s" data-cropper-action="s"></span>' + '<span class="cropper-point point-ne" data-cropper-action="ne"></span>' + '<span class="cropper-point point-nw" data-cropper-action="nw"></span>' + '<span class="cropper-point point-sw" data-cropper-action="sw"></span>' + '<span class="cropper-point point-se" data-cropper-action="se"></span>' + '</div>' + '</div>';

  /**
   * Check if the given value is not a number.
   */

  var isNaN = Number.isNaN || WINDOW.isNaN;
  /**
   * Check if the given value is a number.
   * @param {*} value - The value to check.
   * @returns {boolean} Returns `true` if the given value is a number, else `false`.
   */

  function isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
  }
  /**
   * Check if the given value is a positive number.
   * @param {*} value - The value to check.
   * @returns {boolean} Returns `true` if the given value is a positive number, else `false`.
   */

  var isPositiveNumber = function isPositiveNumber(value) {
    return value > 0 && value < Infinity;
  };
  /**
   * Check if the given value is undefined.
   * @param {*} value - The value to check.
   * @returns {boolean} Returns `true` if the given value is undefined, else `false`.
   */

  function isUndefined(value) {
    return typeof value === 'undefined';
  }
  /**
   * Check if the given value is an object.
   * @param {*} value - The value to check.
   * @returns {boolean} Returns `true` if the given value is an object, else `false`.
   */

  function isObject(value) {
    return _typeof(value) === 'object' && value !== null;
  }
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  /**
   * Check if the given value is a plain object.
   * @param {*} value - The value to check.
   * @returns {boolean} Returns `true` if the given value is a plain object, else `false`.
   */

  function isPlainObject(value) {
    if (!isObject(value)) {
      return false;
    }

    try {
      var _constructor = value.constructor;
      var prototype = _constructor.prototype;
      return _constructor && prototype && hasOwnProperty.call(prototype, 'isPrototypeOf');
    } catch (error) {
      return false;
    }
  }
  /**
   * Check if the given value is a function.
   * @param {*} value - The value to check.
   * @returns {boolean} Returns `true` if the given value is a function, else `false`.
   */

  function isFunction(value) {
    return typeof value === 'function';
  }
  var slice = Array.prototype.slice;
  /**
   * Convert array-like or iterable object to an array.
   * @param {*} value - The value to convert.
   * @returns {Array} Returns a new array.
   */

  function toArray(value) {
    return Array.from ? Array.from(value) : slice.call(value);
  }
  /**
   * Iterate the given data.
   * @param {*} data - The data to iterate.
   * @param {Function} callback - The process function for each element.
   * @returns {*} The original data.
   */

  function forEach(data, callback) {
    if (data && isFunction(callback)) {
      if (Array.isArray(data) || isNumber(data.length)
      /* array-like */
      ) {
          toArray(data).forEach(function (value, key) {
            callback.call(data, value, key, data);
          });
        } else if (isObject(data)) {
        Object.keys(data).forEach(function (key) {
          callback.call(data, data[key], key, data);
        });
      }
    }

    return data;
  }
  /**
   * Extend the given object.
   * @param {*} target - The target object to extend.
   * @param {*} args - The rest objects for merging to the target object.
   * @returns {Object} The extended object.
   */

  var assign = Object.assign || function assign(target) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (isObject(target) && args.length > 0) {
      args.forEach(function (arg) {
        if (isObject(arg)) {
          Object.keys(arg).forEach(function (key) {
            target[key] = arg[key];
          });
        }
      });
    }

    return target;
  };
  var REGEXP_DECIMALS = /\.\d*(?:0|9){12}\d*$/;
  /**
   * Normalize decimal number.
   * Check out {@link http://0.30000000000000004.com/}
   * @param {number} value - The value to normalize.
   * @param {number} [times=100000000000] - The times for normalizing.
   * @returns {number} Returns the normalized number.
   */

  function normalizeDecimalNumber(value) {
    var times = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100000000000;
    return REGEXP_DECIMALS.test(value) ? Math.round(value * times) / times : value;
  }
  var REGEXP_SUFFIX = /^width|height|left|top|marginLeft|marginTop$/;
  /**
   * Apply styles to the given element.
   * @param {Element} element - The target element.
   * @param {Object} styles - The styles for applying.
   */

  function setStyle(element, styles) {
    var style = element.style;
    forEach(styles, function (value, property) {
      if (REGEXP_SUFFIX.test(property) && isNumber(value)) {
        value = "".concat(value, "px");
      }

      style[property] = value;
    });
  }
  /**
   * Check if the given element has a special class.
   * @param {Element} element - The element to check.
   * @param {string} value - The class to search.
   * @returns {boolean} Returns `true` if the special class was found.
   */

  function hasClass(element, value) {
    return element.classList ? element.classList.contains(value) : element.className.indexOf(value) > -1;
  }
  /**
   * Add classes to the given element.
   * @param {Element} element - The target element.
   * @param {string} value - The classes to be added.
   */

  function addClass(element, value) {
    if (!value) {
      return;
    }

    if (isNumber(element.length)) {
      forEach(element, function (elem) {
        addClass(elem, value);
      });
      return;
    }

    if (element.classList) {
      element.classList.add(value);
      return;
    }

    var className = element.className.trim();

    if (!className) {
      element.className = value;
    } else if (className.indexOf(value) < 0) {
      element.className = "".concat(className, " ").concat(value);
    }
  }
  /**
   * Remove classes from the given element.
   * @param {Element} element - The target element.
   * @param {string} value - The classes to be removed.
   */

  function removeClass(element, value) {
    if (!value) {
      return;
    }

    if (isNumber(element.length)) {
      forEach(element, function (elem) {
        removeClass(elem, value);
      });
      return;
    }

    if (element.classList) {
      element.classList.remove(value);
      return;
    }

    if (element.className.indexOf(value) >= 0) {
      element.className = element.className.replace(value, '');
    }
  }
  /**
   * Add or remove classes from the given element.
   * @param {Element} element - The target element.
   * @param {string} value - The classes to be toggled.
   * @param {boolean} added - Add only.
   */

  function toggleClass(element, value, added) {
    if (!value) {
      return;
    }

    if (isNumber(element.length)) {
      forEach(element, function (elem) {
        toggleClass(elem, value, added);
      });
      return;
    } // IE10-11 doesn't support the second parameter of `classList.toggle`


    if (added) {
      addClass(element, value);
    } else {
      removeClass(element, value);
    }
  }
  var REGEXP_CAMEL_CASE = /([a-z\d])([A-Z])/g;
  /**
   * Transform the given string from camelCase to kebab-case
   * @param {string} value - The value to transform.
   * @returns {string} The transformed value.
   */

  function toParamCase(value) {
    return value.replace(REGEXP_CAMEL_CASE, '$1-$2').toLowerCase();
  }
  /**
   * Get data from the given element.
   * @param {Element} element - The target element.
   * @param {string} name - The data key to get.
   * @returns {string} The data value.
   */

  function getData(element, name) {
    if (isObject(element[name])) {
      return element[name];
    }

    if (element.dataset) {
      return element.dataset[name];
    }

    return element.getAttribute("data-".concat(toParamCase(name)));
  }
  /**
   * Set data to the given element.
   * @param {Element} element - The target element.
   * @param {string} name - The data key to set.
   * @param {string} data - The data value.
   */

  function setData(element, name, data) {
    if (isObject(data)) {
      element[name] = data;
    } else if (element.dataset) {
      element.dataset[name] = data;
    } else {
      element.setAttribute("data-".concat(toParamCase(name)), data);
    }
  }
  /**
   * Remove data from the given element.
   * @param {Element} element - The target element.
   * @param {string} name - The data key to remove.
   */

  function removeData(element, name) {
    if (isObject(element[name])) {
      try {
        delete element[name];
      } catch (error) {
        element[name] = undefined;
      }
    } else if (element.dataset) {
      // #128 Safari not allows to delete dataset property
      try {
        delete element.dataset[name];
      } catch (error) {
        element.dataset[name] = undefined;
      }
    } else {
      element.removeAttribute("data-".concat(toParamCase(name)));
    }
  }
  var REGEXP_SPACES = /\s\s*/;

  var onceSupported = function () {
    var supported = false;

    if (IS_BROWSER) {
      var once = false;

      var listener = function listener() {};

      var options = Object.defineProperty({}, 'once', {
        get: function get() {
          supported = true;
          return once;
        },

        /**
         * This setter can fix a `TypeError` in strict mode
         * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Getter_only}
         * @param {boolean} value - The value to set
         */
        set: function set(value) {
          once = value;
        }
      });
      WINDOW.addEventListener('test', listener, options);
      WINDOW.removeEventListener('test', listener, options);
    }

    return supported;
  }();
  /**
   * Remove event listener from the target element.
   * @param {Element} element - The event target.
   * @param {string} type - The event type(s).
   * @param {Function} listener - The event listener.
   * @param {Object} options - The event options.
   */


  function removeListener(element, type, listener) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var handler = listener;
    type.trim().split(REGEXP_SPACES).forEach(function (event) {
      if (!onceSupported) {
        var listeners = element.listeners;

        if (listeners && listeners[event] && listeners[event][listener]) {
          handler = listeners[event][listener];
          delete listeners[event][listener];

          if (Object.keys(listeners[event]).length === 0) {
            delete listeners[event];
          }

          if (Object.keys(listeners).length === 0) {
            delete element.listeners;
          }
        }
      }

      element.removeEventListener(event, handler, options);
    });
  }
  /**
   * Add event listener to the target element.
   * @param {Element} element - The event target.
   * @param {string} type - The event type(s).
   * @param {Function} listener - The event listener.
   * @param {Object} options - The event options.
   */

  function addListener(element, type, listener) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var _handler = listener;
    type.trim().split(REGEXP_SPACES).forEach(function (event) {
      if (options.once && !onceSupported) {
        var _element$listeners = element.listeners,
            listeners = _element$listeners === void 0 ? {} : _element$listeners;

        _handler = function handler() {
          delete listeners[event][listener];
          element.removeEventListener(event, _handler, options);

          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          listener.apply(element, args);
        };

        if (!listeners[event]) {
          listeners[event] = {};
        }

        if (listeners[event][listener]) {
          element.removeEventListener(event, listeners[event][listener], options);
        }

        listeners[event][listener] = _handler;
        element.listeners = listeners;
      }

      element.addEventListener(event, _handler, options);
    });
  }
  /**
   * Dispatch event on the target element.
   * @param {Element} element - The event target.
   * @param {string} type - The event type(s).
   * @param {Object} data - The additional event data.
   * @returns {boolean} Indicate if the event is default prevented or not.
   */

  function dispatchEvent(element, type, data) {
    var event; // Event and CustomEvent on IE9-11 are global objects, not constructors

    if (isFunction(Event) && isFunction(CustomEvent)) {
      event = new CustomEvent(type, {
        detail: data,
        bubbles: true,
        cancelable: true
      });
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(type, true, true, data);
    }

    return element.dispatchEvent(event);
  }
  /**
   * Get the offset base on the document.
   * @param {Element} element - The target element.
   * @returns {Object} The offset data.
   */

  function getOffset(element) {
    var box = element.getBoundingClientRect();
    return {
      left: box.left + (window.pageXOffset - document.documentElement.clientLeft),
      top: box.top + (window.pageYOffset - document.documentElement.clientTop)
    };
  }
  var location = WINDOW.location;
  var REGEXP_ORIGINS = /^(\w+:)\/\/([^:/?#]*):?(\d*)/i;
  /**
   * Check if the given URL is a cross origin URL.
   * @param {string} url - The target URL.
   * @returns {boolean} Returns `true` if the given URL is a cross origin URL, else `false`.
   */

  function isCrossOriginURL(url) {
    var parts = url.match(REGEXP_ORIGINS);
    return parts !== null && (parts[1] !== location.protocol || parts[2] !== location.hostname || parts[3] !== location.port);
  }
  /**
   * Add timestamp to the given URL.
   * @param {string} url - The target URL.
   * @returns {string} The result URL.
   */

  function addTimestamp(url) {
    var timestamp = "timestamp=".concat(new Date().getTime());
    return url + (url.indexOf('?') === -1 ? '?' : '&') + timestamp;
  }
  /**
   * Get transforms base on the given object.
   * @param {Object} obj - The target object.
   * @returns {string} A string contains transform values.
   */

  function getTransforms(_ref) {
    var rotate = _ref.rotate,
        scaleX = _ref.scaleX,
        scaleY = _ref.scaleY,
        translateX = _ref.translateX,
        translateY = _ref.translateY;
    var values = [];

    if (isNumber(translateX) && translateX !== 0) {
      values.push("translateX(".concat(translateX, "px)"));
    }

    if (isNumber(translateY) && translateY !== 0) {
      values.push("translateY(".concat(translateY, "px)"));
    } // Rotate should come first before scale to match orientation transform


    if (isNumber(rotate) && rotate !== 0) {
      values.push("rotate(".concat(rotate, "deg)"));
    }

    if (isNumber(scaleX) && scaleX !== 1) {
      values.push("scaleX(".concat(scaleX, ")"));
    }

    if (isNumber(scaleY) && scaleY !== 1) {
      values.push("scaleY(".concat(scaleY, ")"));
    }

    var transform = values.length ? values.join(' ') : 'none';
    return {
      WebkitTransform: transform,
      msTransform: transform,
      transform: transform
    };
  }
  /**
   * Get the max ratio of a group of pointers.
   * @param {string} pointers - The target pointers.
   * @returns {number} The result ratio.
   */

  function getMaxZoomRatio(pointers) {
    var pointers2 = _objectSpread2({}, pointers);

    var ratios = [];
    forEach(pointers, function (pointer, pointerId) {
      delete pointers2[pointerId];
      forEach(pointers2, function (pointer2) {
        var x1 = Math.abs(pointer.startX - pointer2.startX);
        var y1 = Math.abs(pointer.startY - pointer2.startY);
        var x2 = Math.abs(pointer.endX - pointer2.endX);
        var y2 = Math.abs(pointer.endY - pointer2.endY);
        var z1 = Math.sqrt(x1 * x1 + y1 * y1);
        var z2 = Math.sqrt(x2 * x2 + y2 * y2);
        var ratio = (z2 - z1) / z1;
        ratios.push(ratio);
      });
    });
    ratios.sort(function (a, b) {
      return Math.abs(a) < Math.abs(b);
    });
    return ratios[0];
  }
  /**
   * Get a pointer from an event object.
   * @param {Object} event - The target event object.
   * @param {boolean} endOnly - Indicates if only returns the end point coordinate or not.
   * @returns {Object} The result pointer contains start and/or end point coordinates.
   */

  function getPointer(_ref2, endOnly) {
    var pageX = _ref2.pageX,
        pageY = _ref2.pageY;
    var end = {
      endX: pageX,
      endY: pageY
    };
    return endOnly ? end : _objectSpread2({
      startX: pageX,
      startY: pageY
    }, end);
  }
  /**
   * Get the center point coordinate of a group of pointers.
   * @param {Object} pointers - The target pointers.
   * @returns {Object} The center point coordinate.
   */

  function getPointersCenter(pointers) {
    var pageX = 0;
    var pageY = 0;
    var count = 0;
    forEach(pointers, function (_ref3) {
      var startX = _ref3.startX,
          startY = _ref3.startY;
      pageX += startX;
      pageY += startY;
      count += 1;
    });
    pageX /= count;
    pageY /= count;
    return {
      pageX: pageX,
      pageY: pageY
    };
  }
  /**
   * Get the max sizes in a rectangle under the given aspect ratio.
   * @param {Object} data - The original sizes.
   * @param {string} [type='contain'] - The adjust type.
   * @returns {Object} The result sizes.
   */

  function getAdjustedSizes(_ref4) // or 'cover'
  {
    var aspectRatio = _ref4.aspectRatio,
        height = _ref4.height,
        width = _ref4.width;
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'contain';
    var isValidWidth = isPositiveNumber(width);
    var isValidHeight = isPositiveNumber(height);

    if (isValidWidth && isValidHeight) {
      var adjustedWidth = height * aspectRatio;

      if (type === 'contain' && adjustedWidth > width || type === 'cover' && adjustedWidth < width) {
        height = width / aspectRatio;
      } else {
        width = height * aspectRatio;
      }
    } else if (isValidWidth) {
      height = width / aspectRatio;
    } else if (isValidHeight) {
      width = height * aspectRatio;
    }

    return {
      width: width,
      height: height
    };
  }
  /**
   * Get the new sizes of a rectangle after rotated.
   * @param {Object} data - The original sizes.
   * @returns {Object} The result sizes.
   */

  function getRotatedSizes(_ref5) {
    var width = _ref5.width,
        height = _ref5.height,
        degree = _ref5.degree;
    degree = Math.abs(degree) % 180;

    if (degree === 90) {
      return {
        width: height,
        height: width
      };
    }

    var arc = degree % 90 * Math.PI / 180;
    var sinArc = Math.sin(arc);
    var cosArc = Math.cos(arc);
    var newWidth = width * cosArc + height * sinArc;
    var newHeight = width * sinArc + height * cosArc;
    return degree > 90 ? {
      width: newHeight,
      height: newWidth
    } : {
      width: newWidth,
      height: newHeight
    };
  }
  /**
   * Get a canvas which drew the given image.
   * @param {HTMLImageElement} image - The image for drawing.
   * @param {Object} imageData - The image data.
   * @param {Object} canvasData - The canvas data.
   * @param {Object} options - The options.
   * @returns {HTMLCanvasElement} The result canvas.
   */

  function getSourceCanvas(image, _ref6, _ref7, _ref8) {
    var imageAspectRatio = _ref6.aspectRatio,
        imageNaturalWidth = _ref6.naturalWidth,
        imageNaturalHeight = _ref6.naturalHeight,
        _ref6$rotate = _ref6.rotate,
        rotate = _ref6$rotate === void 0 ? 0 : _ref6$rotate,
        _ref6$scaleX = _ref6.scaleX,
        scaleX = _ref6$scaleX === void 0 ? 1 : _ref6$scaleX,
        _ref6$scaleY = _ref6.scaleY,
        scaleY = _ref6$scaleY === void 0 ? 1 : _ref6$scaleY;
    var aspectRatio = _ref7.aspectRatio,
        naturalWidth = _ref7.naturalWidth,
        naturalHeight = _ref7.naturalHeight;
    var _ref8$fillColor = _ref8.fillColor,
        fillColor = _ref8$fillColor === void 0 ? 'transparent' : _ref8$fillColor,
        _ref8$imageSmoothingE = _ref8.imageSmoothingEnabled,
        imageSmoothingEnabled = _ref8$imageSmoothingE === void 0 ? true : _ref8$imageSmoothingE,
        _ref8$imageSmoothingQ = _ref8.imageSmoothingQuality,
        imageSmoothingQuality = _ref8$imageSmoothingQ === void 0 ? 'low' : _ref8$imageSmoothingQ,
        _ref8$maxWidth = _ref8.maxWidth,
        maxWidth = _ref8$maxWidth === void 0 ? Infinity : _ref8$maxWidth,
        _ref8$maxHeight = _ref8.maxHeight,
        maxHeight = _ref8$maxHeight === void 0 ? Infinity : _ref8$maxHeight,
        _ref8$minWidth = _ref8.minWidth,
        minWidth = _ref8$minWidth === void 0 ? 0 : _ref8$minWidth,
        _ref8$minHeight = _ref8.minHeight,
        minHeight = _ref8$minHeight === void 0 ? 0 : _ref8$minHeight;
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var maxSizes = getAdjustedSizes({
      aspectRatio: aspectRatio,
      width: maxWidth,
      height: maxHeight
    });
    var minSizes = getAdjustedSizes({
      aspectRatio: aspectRatio,
      width: minWidth,
      height: minHeight
    }, 'cover');
    var width = Math.min(maxSizes.width, Math.max(minSizes.width, naturalWidth));
    var height = Math.min(maxSizes.height, Math.max(minSizes.height, naturalHeight)); // Note: should always use image's natural sizes for drawing as
    // imageData.naturalWidth === canvasData.naturalHeight when rotate % 180 === 90

    var destMaxSizes = getAdjustedSizes({
      aspectRatio: imageAspectRatio,
      width: maxWidth,
      height: maxHeight
    });
    var destMinSizes = getAdjustedSizes({
      aspectRatio: imageAspectRatio,
      width: minWidth,
      height: minHeight
    }, 'cover');
    var destWidth = Math.min(destMaxSizes.width, Math.max(destMinSizes.width, imageNaturalWidth));
    var destHeight = Math.min(destMaxSizes.height, Math.max(destMinSizes.height, imageNaturalHeight));
    var params = [-destWidth / 2, -destHeight / 2, destWidth, destHeight];
    canvas.width = normalizeDecimalNumber(width);
    canvas.height = normalizeDecimalNumber(height);
    context.fillStyle = fillColor;
    context.fillRect(0, 0, width, height);
    context.save();
    context.translate(width / 2, height / 2);
    context.rotate(rotate * Math.PI / 180);
    context.scale(scaleX, scaleY);
    context.imageSmoothingEnabled = imageSmoothingEnabled;
    context.imageSmoothingQuality = imageSmoothingQuality;
    context.drawImage.apply(context, [image].concat(_toConsumableArray(params.map(function (param) {
      return Math.floor(normalizeDecimalNumber(param));
    }))));
    context.restore();
    return canvas;
  }
  var fromCharCode = String.fromCharCode;
  /**
   * Get string from char code in data view.
   * @param {DataView} dataView - The data view for read.
   * @param {number} start - The start index.
   * @param {number} length - The read length.
   * @returns {string} The read result.
   */

  function getStringFromCharCode(dataView, start, length) {
    var str = '';
    length += start;

    for (var i = start; i < length; i += 1) {
      str += fromCharCode(dataView.getUint8(i));
    }

    return str;
  }
  var REGEXP_DATA_URL_HEAD = /^data:.*,/;
  /**
   * Transform Data URL to array buffer.
   * @param {string} dataURL - The Data URL to transform.
   * @returns {ArrayBuffer} The result array buffer.
   */

  function dataURLToArrayBuffer(dataURL) {
    var base64 = dataURL.replace(REGEXP_DATA_URL_HEAD, '');
    var binary = atob(base64);
    var arrayBuffer = new ArrayBuffer(binary.length);
    var uint8 = new Uint8Array(arrayBuffer);
    forEach(uint8, function (value, i) {
      uint8[i] = binary.charCodeAt(i);
    });
    return arrayBuffer;
  }
  /**
   * Transform array buffer to Data URL.
   * @param {ArrayBuffer} arrayBuffer - The array buffer to transform.
   * @param {string} mimeType - The mime type of the Data URL.
   * @returns {string} The result Data URL.
   */

  function arrayBufferToDataURL(arrayBuffer, mimeType) {
    var chunks = []; // Chunk Typed Array for better performance (#435)

    var chunkSize = 8192;
    var uint8 = new Uint8Array(arrayBuffer);

    while (uint8.length > 0) {
      // XXX: Babel's `toConsumableArray` helper will throw error in IE or Safari 9
      // eslint-disable-next-line prefer-spread
      chunks.push(fromCharCode.apply(null, toArray(uint8.subarray(0, chunkSize))));
      uint8 = uint8.subarray(chunkSize);
    }

    return "data:".concat(mimeType, ";base64,").concat(btoa(chunks.join('')));
  }
  /**
   * Get orientation value from given array buffer.
   * @param {ArrayBuffer} arrayBuffer - The array buffer to read.
   * @returns {number} The read orientation value.
   */

  function resetAndGetOrientation(arrayBuffer) {
    var dataView = new DataView(arrayBuffer);
    var orientation; // Ignores range error when the image does not have correct Exif information

    try {
      var littleEndian;
      var app1Start;
      var ifdStart; // Only handle JPEG image (start by 0xFFD8)

      if (dataView.getUint8(0) === 0xFF && dataView.getUint8(1) === 0xD8) {
        var length = dataView.byteLength;
        var offset = 2;

        while (offset + 1 < length) {
          if (dataView.getUint8(offset) === 0xFF && dataView.getUint8(offset + 1) === 0xE1) {
            app1Start = offset;
            break;
          }

          offset += 1;
        }
      }

      if (app1Start) {
        var exifIDCode = app1Start + 4;
        var tiffOffset = app1Start + 10;

        if (getStringFromCharCode(dataView, exifIDCode, 4) === 'Exif') {
          var endianness = dataView.getUint16(tiffOffset);
          littleEndian = endianness === 0x4949;

          if (littleEndian || endianness === 0x4D4D
          /* bigEndian */
          ) {
              if (dataView.getUint16(tiffOffset + 2, littleEndian) === 0x002A) {
                var firstIFDOffset = dataView.getUint32(tiffOffset + 4, littleEndian);

                if (firstIFDOffset >= 0x00000008) {
                  ifdStart = tiffOffset + firstIFDOffset;
                }
              }
            }
        }
      }

      if (ifdStart) {
        var _length = dataView.getUint16(ifdStart, littleEndian);

        var _offset;

        var i;

        for (i = 0; i < _length; i += 1) {
          _offset = ifdStart + i * 12 + 2;

          if (dataView.getUint16(_offset, littleEndian) === 0x0112
          /* Orientation */
          ) {
              // 8 is the offset of the current tag's value
              _offset += 8; // Get the original orientation value

              orientation = dataView.getUint16(_offset, littleEndian); // Override the orientation with its default value

              dataView.setUint16(_offset, 1, littleEndian);
              break;
            }
        }
      }
    } catch (error) {
      orientation = 1;
    }

    return orientation;
  }
  /**
   * Parse Exif Orientation value.
   * @param {number} orientation - The orientation to parse.
   * @returns {Object} The parsed result.
   */

  function parseOrientation(orientation) {
    var rotate = 0;
    var scaleX = 1;
    var scaleY = 1;

    switch (orientation) {
      // Flip horizontal
      case 2:
        scaleX = -1;
        break;
      // Rotate left 180°

      case 3:
        rotate = -180;
        break;
      // Flip vertical

      case 4:
        scaleY = -1;
        break;
      // Flip vertical and rotate right 90°

      case 5:
        rotate = 90;
        scaleY = -1;
        break;
      // Rotate right 90°

      case 6:
        rotate = 90;
        break;
      // Flip horizontal and rotate right 90°

      case 7:
        rotate = 90;
        scaleX = -1;
        break;
      // Rotate left 90°

      case 8:
        rotate = -90;
        break;

      default:
    }

    return {
      rotate: rotate,
      scaleX: scaleX,
      scaleY: scaleY
    };
  }

  var render = {
    render: function render() {
      this.initContainer();
      this.initCanvas();
      this.initCropBox();
      this.renderCanvas();

      if (this.cropped) {
        this.renderCropBox();
      }
    },
    initContainer: function initContainer() {
      var element = this.element,
          options = this.options,
          container = this.container,
          cropper = this.cropper;
      addClass(cropper, CLASS_HIDDEN);
      removeClass(element, CLASS_HIDDEN);
      var containerData = {
        width: Math.max(container.offsetWidth, Number(options.minContainerWidth) || 200),
        height: Math.max(container.offsetHeight, Number(options.minContainerHeight) || 100)
      };
      this.containerData = containerData;
      setStyle(cropper, {
        width: containerData.width,
        height: containerData.height
      });
      addClass(element, CLASS_HIDDEN);
      removeClass(cropper, CLASS_HIDDEN);
    },
    // Canvas (image wrapper)
    initCanvas: function initCanvas() {
      var containerData = this.containerData,
          imageData = this.imageData;
      var viewMode = this.options.viewMode;
      var rotated = Math.abs(imageData.rotate) % 180 === 90;
      var naturalWidth = rotated ? imageData.naturalHeight : imageData.naturalWidth;
      var naturalHeight = rotated ? imageData.naturalWidth : imageData.naturalHeight;
      var aspectRatio = naturalWidth / naturalHeight;
      var canvasWidth = containerData.width;
      var canvasHeight = containerData.height;

      if (containerData.height * aspectRatio > containerData.width) {
        if (viewMode === 3) {
          canvasWidth = containerData.height * aspectRatio;
        } else {
          canvasHeight = containerData.width / aspectRatio;
        }
      } else if (viewMode === 3) {
        canvasHeight = containerData.width / aspectRatio;
      } else {
        canvasWidth = containerData.height * aspectRatio;
      }

      var canvasData = {
        aspectRatio: aspectRatio,
        naturalWidth: naturalWidth,
        naturalHeight: naturalHeight,
        width: canvasWidth,
        height: canvasHeight
      };
      canvasData.left = (containerData.width - canvasWidth) / 2;
      canvasData.top = (containerData.height - canvasHeight) / 2;
      canvasData.oldLeft = canvasData.left;
      canvasData.oldTop = canvasData.top;
      this.canvasData = canvasData;
      this.limited = viewMode === 1 || viewMode === 2;
      this.limitCanvas(true, true);
      this.initialImageData = assign({}, imageData);
      this.initialCanvasData = assign({}, canvasData);
    },
    limitCanvas: function limitCanvas(sizeLimited, positionLimited) {
      var options = this.options,
          containerData = this.containerData,
          canvasData = this.canvasData,
          cropBoxData = this.cropBoxData;
      var viewMode = options.viewMode;
      var aspectRatio = canvasData.aspectRatio;
      var cropped = this.cropped && cropBoxData;

      if (sizeLimited) {
        var minCanvasWidth = Number(options.minCanvasWidth) || 0;
        var minCanvasHeight = Number(options.minCanvasHeight) || 0;

        if (viewMode > 1) {
          minCanvasWidth = Math.max(minCanvasWidth, containerData.width);
          minCanvasHeight = Math.max(minCanvasHeight, containerData.height);

          if (viewMode === 3) {
            if (minCanvasHeight * aspectRatio > minCanvasWidth) {
              minCanvasWidth = minCanvasHeight * aspectRatio;
            } else {
              minCanvasHeight = minCanvasWidth / aspectRatio;
            }
          }
        } else if (viewMode > 0) {
          if (minCanvasWidth) {
            minCanvasWidth = Math.max(minCanvasWidth, cropped ? cropBoxData.width : 0);
          } else if (minCanvasHeight) {
            minCanvasHeight = Math.max(minCanvasHeight, cropped ? cropBoxData.height : 0);
          } else if (cropped) {
            minCanvasWidth = cropBoxData.width;
            minCanvasHeight = cropBoxData.height;

            if (minCanvasHeight * aspectRatio > minCanvasWidth) {
              minCanvasWidth = minCanvasHeight * aspectRatio;
            } else {
              minCanvasHeight = minCanvasWidth / aspectRatio;
            }
          }
        }

        var _getAdjustedSizes = getAdjustedSizes({
          aspectRatio: aspectRatio,
          width: minCanvasWidth,
          height: minCanvasHeight
        });

        minCanvasWidth = _getAdjustedSizes.width;
        minCanvasHeight = _getAdjustedSizes.height;
        canvasData.minWidth = minCanvasWidth;
        canvasData.minHeight = minCanvasHeight;
        canvasData.maxWidth = Infinity;
        canvasData.maxHeight = Infinity;
      }

      if (positionLimited) {
        if (viewMode > (cropped ? 0 : 1)) {
          var newCanvasLeft = containerData.width - canvasData.width;
          var newCanvasTop = containerData.height - canvasData.height;
          canvasData.minLeft = Math.min(0, newCanvasLeft);
          canvasData.minTop = Math.min(0, newCanvasTop);
          canvasData.maxLeft = Math.max(0, newCanvasLeft);
          canvasData.maxTop = Math.max(0, newCanvasTop);

          if (cropped && this.limited) {
            canvasData.minLeft = Math.min(cropBoxData.left, cropBoxData.left + (cropBoxData.width - canvasData.width));
            canvasData.minTop = Math.min(cropBoxData.top, cropBoxData.top + (cropBoxData.height - canvasData.height));
            canvasData.maxLeft = cropBoxData.left;
            canvasData.maxTop = cropBoxData.top;

            if (viewMode === 2) {
              if (canvasData.width >= containerData.width) {
                canvasData.minLeft = Math.min(0, newCanvasLeft);
                canvasData.maxLeft = Math.max(0, newCanvasLeft);
              }

              if (canvasData.height >= containerData.height) {
                canvasData.minTop = Math.min(0, newCanvasTop);
                canvasData.maxTop = Math.max(0, newCanvasTop);
              }
            }
          }
        } else {
          canvasData.minLeft = -canvasData.width;
          canvasData.minTop = -canvasData.height;
          canvasData.maxLeft = containerData.width;
          canvasData.maxTop = containerData.height;
        }
      }
    },
    renderCanvas: function renderCanvas(changed, transformed) {
      var canvasData = this.canvasData,
          imageData = this.imageData;

      if (transformed) {
        var _getRotatedSizes = getRotatedSizes({
          width: imageData.naturalWidth * Math.abs(imageData.scaleX || 1),
          height: imageData.naturalHeight * Math.abs(imageData.scaleY || 1),
          degree: imageData.rotate || 0
        }),
            naturalWidth = _getRotatedSizes.width,
            naturalHeight = _getRotatedSizes.height;

        var width = canvasData.width * (naturalWidth / canvasData.naturalWidth);
        var height = canvasData.height * (naturalHeight / canvasData.naturalHeight);
        canvasData.left -= (width - canvasData.width) / 2;
        canvasData.top -= (height - canvasData.height) / 2;
        canvasData.width = width;
        canvasData.height = height;
        canvasData.aspectRatio = naturalWidth / naturalHeight;
        canvasData.naturalWidth = naturalWidth;
        canvasData.naturalHeight = naturalHeight;
        this.limitCanvas(true, false);
      }

      if (canvasData.width > canvasData.maxWidth || canvasData.width < canvasData.minWidth) {
        canvasData.left = canvasData.oldLeft;
      }

      if (canvasData.height > canvasData.maxHeight || canvasData.height < canvasData.minHeight) {
        canvasData.top = canvasData.oldTop;
      }

      canvasData.width = Math.min(Math.max(canvasData.width, canvasData.minWidth), canvasData.maxWidth);
      canvasData.height = Math.min(Math.max(canvasData.height, canvasData.minHeight), canvasData.maxHeight);
      this.limitCanvas(false, true);
      canvasData.left = Math.min(Math.max(canvasData.left, canvasData.minLeft), canvasData.maxLeft);
      canvasData.top = Math.min(Math.max(canvasData.top, canvasData.minTop), canvasData.maxTop);
      canvasData.oldLeft = canvasData.left;
      canvasData.oldTop = canvasData.top;
      setStyle(this.canvas, assign({
        width: canvasData.width,
        height: canvasData.height
      }, getTransforms({
        translateX: canvasData.left,
        translateY: canvasData.top
      })));
      this.renderImage(changed);

      if (this.cropped && this.limited) {
        this.limitCropBox(true, true);
      }
    },
    renderImage: function renderImage(changed) {
      var canvasData = this.canvasData,
          imageData = this.imageData;
      var width = imageData.naturalWidth * (canvasData.width / canvasData.naturalWidth);
      var height = imageData.naturalHeight * (canvasData.height / canvasData.naturalHeight);
      assign(imageData, {
        width: width,
        height: height,
        left: (canvasData.width - width) / 2,
        top: (canvasData.height - height) / 2
      });
      setStyle(this.image, assign({
        width: imageData.width,
        height: imageData.height
      }, getTransforms(assign({
        translateX: imageData.left,
        translateY: imageData.top
      }, imageData))));

      if (changed) {
        this.output();
      }
    },
    initCropBox: function initCropBox() {
      var options = this.options,
          canvasData = this.canvasData;
      var aspectRatio = options.aspectRatio || options.initialAspectRatio;
      var autoCropArea = Number(options.autoCropArea) || 0.8;
      var cropBoxData = {
        width: canvasData.width,
        height: canvasData.height
      };

      if (aspectRatio) {
        if (canvasData.height * aspectRatio > canvasData.width) {
          cropBoxData.height = cropBoxData.width / aspectRatio;
        } else {
          cropBoxData.width = cropBoxData.height * aspectRatio;
        }
      }

      this.cropBoxData = cropBoxData;
      this.limitCropBox(true, true); // Initialize auto crop area

      cropBoxData.width = Math.min(Math.max(cropBoxData.width, cropBoxData.minWidth), cropBoxData.maxWidth);
      cropBoxData.height = Math.min(Math.max(cropBoxData.height, cropBoxData.minHeight), cropBoxData.maxHeight); // The width/height of auto crop area must large than "minWidth/Height"

      cropBoxData.width = Math.max(cropBoxData.minWidth, cropBoxData.width * autoCropArea);
      cropBoxData.height = Math.max(cropBoxData.minHeight, cropBoxData.height * autoCropArea);
      cropBoxData.left = canvasData.left + (canvasData.width - cropBoxData.width) / 2;
      cropBoxData.top = canvasData.top + (canvasData.height - cropBoxData.height) / 2;
      cropBoxData.oldLeft = cropBoxData.left;
      cropBoxData.oldTop = cropBoxData.top;
      this.initialCropBoxData = assign({}, cropBoxData);
    },
    limitCropBox: function limitCropBox(sizeLimited, positionLimited) {
      var options = this.options,
          containerData = this.containerData,
          canvasData = this.canvasData,
          cropBoxData = this.cropBoxData,
          limited = this.limited;
      var aspectRatio = options.aspectRatio;

      if (sizeLimited) {
        var minCropBoxWidth = Number(options.minCropBoxWidth) || 0;
        var minCropBoxHeight = Number(options.minCropBoxHeight) || 0;
        var maxCropBoxWidth = limited ? Math.min(containerData.width, canvasData.width, canvasData.width + canvasData.left, containerData.width - canvasData.left) : containerData.width;
        var maxCropBoxHeight = limited ? Math.min(containerData.height, canvasData.height, canvasData.height + canvasData.top, containerData.height - canvasData.top) : containerData.height; // The min/maxCropBoxWidth/Height must be less than container's width/height

        minCropBoxWidth = Math.min(minCropBoxWidth, containerData.width);
        minCropBoxHeight = Math.min(minCropBoxHeight, containerData.height);

        if (aspectRatio) {
          if (minCropBoxWidth && minCropBoxHeight) {
            if (minCropBoxHeight * aspectRatio > minCropBoxWidth) {
              minCropBoxHeight = minCropBoxWidth / aspectRatio;
            } else {
              minCropBoxWidth = minCropBoxHeight * aspectRatio;
            }
          } else if (minCropBoxWidth) {
            minCropBoxHeight = minCropBoxWidth / aspectRatio;
          } else if (minCropBoxHeight) {
            minCropBoxWidth = minCropBoxHeight * aspectRatio;
          }

          if (maxCropBoxHeight * aspectRatio > maxCropBoxWidth) {
            maxCropBoxHeight = maxCropBoxWidth / aspectRatio;
          } else {
            maxCropBoxWidth = maxCropBoxHeight * aspectRatio;
          }
        } // The minWidth/Height must be less than maxWidth/Height


        cropBoxData.minWidth = Math.min(minCropBoxWidth, maxCropBoxWidth);
        cropBoxData.minHeight = Math.min(minCropBoxHeight, maxCropBoxHeight);
        cropBoxData.maxWidth = maxCropBoxWidth;
        cropBoxData.maxHeight = maxCropBoxHeight;
      }

      if (positionLimited) {
        if (limited) {
          cropBoxData.minLeft = Math.max(0, canvasData.left);
          cropBoxData.minTop = Math.max(0, canvasData.top);
          cropBoxData.maxLeft = Math.min(containerData.width, canvasData.left + canvasData.width) - cropBoxData.width;
          cropBoxData.maxTop = Math.min(containerData.height, canvasData.top + canvasData.height) - cropBoxData.height;
        } else {
          cropBoxData.minLeft = 0;
          cropBoxData.minTop = 0;
          cropBoxData.maxLeft = containerData.width - cropBoxData.width;
          cropBoxData.maxTop = containerData.height - cropBoxData.height;
        }
      }
    },
    renderCropBox: function renderCropBox() {
      var options = this.options,
          containerData = this.containerData,
          cropBoxData = this.cropBoxData;

      if (cropBoxData.width > cropBoxData.maxWidth || cropBoxData.width < cropBoxData.minWidth) {
        cropBoxData.left = cropBoxData.oldLeft;
      }

      if (cropBoxData.height > cropBoxData.maxHeight || cropBoxData.height < cropBoxData.minHeight) {
        cropBoxData.top = cropBoxData.oldTop;
      }

      cropBoxData.width = Math.min(Math.max(cropBoxData.width, cropBoxData.minWidth), cropBoxData.maxWidth);
      cropBoxData.height = Math.min(Math.max(cropBoxData.height, cropBoxData.minHeight), cropBoxData.maxHeight);
      this.limitCropBox(false, true);
      cropBoxData.left = Math.min(Math.max(cropBoxData.left, cropBoxData.minLeft), cropBoxData.maxLeft);
      cropBoxData.top = Math.min(Math.max(cropBoxData.top, cropBoxData.minTop), cropBoxData.maxTop);
      cropBoxData.oldLeft = cropBoxData.left;
      cropBoxData.oldTop = cropBoxData.top;

      if (options.movable && options.cropBoxMovable) {
        // Turn to move the canvas when the crop box is equal to the container
        setData(this.face, DATA_ACTION, cropBoxData.width >= containerData.width && cropBoxData.height >= containerData.height ? ACTION_MOVE : ACTION_ALL);
      }

      setStyle(this.cropBox, assign({
        width: cropBoxData.width,
        height: cropBoxData.height
      }, getTransforms({
        translateX: cropBoxData.left,
        translateY: cropBoxData.top
      })));

      if (this.cropped && this.limited) {
        this.limitCanvas(true, true);
      }

      if (!this.disabled) {
        this.output();
      }
    },
    output: function output() {
      this.preview();
      dispatchEvent(this.element, EVENT_CROP, this.getData());
    }
  };

  var preview = {
    initPreview: function initPreview() {
      var element = this.element,
          crossOrigin = this.crossOrigin;
      var preview = this.options.preview;
      var url = crossOrigin ? this.crossOriginUrl : this.url;
      var alt = element.alt || 'The image to preview';
      var image = document.createElement('img');

      if (crossOrigin) {
        image.crossOrigin = crossOrigin;
      }

      image.src = url;
      image.alt = alt;
      this.viewBox.appendChild(image);
      this.viewBoxImage = image;

      if (!preview) {
        return;
      }

      var previews = preview;

      if (typeof preview === 'string') {
        previews = element.ownerDocument.querySelectorAll(preview);
      } else if (preview.querySelector) {
        previews = [preview];
      }

      this.previews = previews;
      forEach(previews, function (el) {
        var img = document.createElement('img'); // Save the original size for recover

        setData(el, DATA_PREVIEW, {
          width: el.offsetWidth,
          height: el.offsetHeight,
          html: el.innerHTML
        });

        if (crossOrigin) {
          img.crossOrigin = crossOrigin;
        }

        img.src = url;
        img.alt = alt;
        /**
         * Override img element styles
         * Add `display:block` to avoid margin top issue
         * Add `height:auto` to override `height` attribute on IE8
         * (Occur only when margin-top <= -height)
         */

        img.style.cssText = 'display:block;' + 'width:100%;' + 'height:auto;' + 'min-width:0!important;' + 'min-height:0!important;' + 'max-width:none!important;' + 'max-height:none!important;' + 'image-orientation:0deg!important;"';
        el.innerHTML = '';
        el.appendChild(img);
      });
    },
    resetPreview: function resetPreview() {
      forEach(this.previews, function (element) {
        var data = getData(element, DATA_PREVIEW);
        setStyle(element, {
          width: data.width,
          height: data.height
        });
        element.innerHTML = data.html;
        removeData(element, DATA_PREVIEW);
      });
    },
    preview: function preview() {
      var imageData = this.imageData,
          canvasData = this.canvasData,
          cropBoxData = this.cropBoxData;
      var cropBoxWidth = cropBoxData.width,
          cropBoxHeight = cropBoxData.height;
      var width = imageData.width,
          height = imageData.height;
      var left = cropBoxData.left - canvasData.left - imageData.left;
      var top = cropBoxData.top - canvasData.top - imageData.top;

      if (!this.cropped || this.disabled) {
        return;
      }

      setStyle(this.viewBoxImage, assign({
        width: width,
        height: height
      }, getTransforms(assign({
        translateX: -left,
        translateY: -top
      }, imageData))));
      forEach(this.previews, function (element) {
        var data = getData(element, DATA_PREVIEW);
        var originalWidth = data.width;
        var originalHeight = data.height;
        var newWidth = originalWidth;
        var newHeight = originalHeight;
        var ratio = 1;

        if (cropBoxWidth) {
          ratio = originalWidth / cropBoxWidth;
          newHeight = cropBoxHeight * ratio;
        }

        if (cropBoxHeight && newHeight > originalHeight) {
          ratio = originalHeight / cropBoxHeight;
          newWidth = cropBoxWidth * ratio;
          newHeight = originalHeight;
        }

        setStyle(element, {
          width: newWidth,
          height: newHeight
        });
        setStyle(element.getElementsByTagName('img')[0], assign({
          width: width * ratio,
          height: height * ratio
        }, getTransforms(assign({
          translateX: -left * ratio,
          translateY: -top * ratio
        }, imageData))));
      });
    }
  };

  var events = {
    bind: function bind() {
      var element = this.element,
          options = this.options,
          cropper = this.cropper;

      if (isFunction(options.cropstart)) {
        addListener(element, EVENT_CROP_START, options.cropstart);
      }

      if (isFunction(options.cropmove)) {
        addListener(element, EVENT_CROP_MOVE, options.cropmove);
      }

      if (isFunction(options.cropend)) {
        addListener(element, EVENT_CROP_END, options.cropend);
      }

      if (isFunction(options.crop)) {
        addListener(element, EVENT_CROP, options.crop);
      }

      if (isFunction(options.zoom)) {
        addListener(element, EVENT_ZOOM, options.zoom);
      }

      addListener(cropper, EVENT_POINTER_DOWN, this.onCropStart = this.cropStart.bind(this));

      if (options.zoomable && options.zoomOnWheel) {
        addListener(cropper, EVENT_WHEEL, this.onWheel = this.wheel.bind(this), {
          passive: false,
          capture: true
        });
      }

      if (options.toggleDragModeOnDblclick) {
        addListener(cropper, EVENT_DBLCLICK, this.onDblclick = this.dblclick.bind(this));
      }

      addListener(element.ownerDocument, EVENT_POINTER_MOVE, this.onCropMove = this.cropMove.bind(this));
      addListener(element.ownerDocument, EVENT_POINTER_UP, this.onCropEnd = this.cropEnd.bind(this));

      if (options.responsive) {
        addListener(window, EVENT_RESIZE, this.onResize = this.resize.bind(this));
      }
    },
    unbind: function unbind() {
      var element = this.element,
          options = this.options,
          cropper = this.cropper;

      if (isFunction(options.cropstart)) {
        removeListener(element, EVENT_CROP_START, options.cropstart);
      }

      if (isFunction(options.cropmove)) {
        removeListener(element, EVENT_CROP_MOVE, options.cropmove);
      }

      if (isFunction(options.cropend)) {
        removeListener(element, EVENT_CROP_END, options.cropend);
      }

      if (isFunction(options.crop)) {
        removeListener(element, EVENT_CROP, options.crop);
      }

      if (isFunction(options.zoom)) {
        removeListener(element, EVENT_ZOOM, options.zoom);
      }

      removeListener(cropper, EVENT_POINTER_DOWN, this.onCropStart);

      if (options.zoomable && options.zoomOnWheel) {
        removeListener(cropper, EVENT_WHEEL, this.onWheel, {
          passive: false,
          capture: true
        });
      }

      if (options.toggleDragModeOnDblclick) {
        removeListener(cropper, EVENT_DBLCLICK, this.onDblclick);
      }

      removeListener(element.ownerDocument, EVENT_POINTER_MOVE, this.onCropMove);
      removeListener(element.ownerDocument, EVENT_POINTER_UP, this.onCropEnd);

      if (options.responsive) {
        removeListener(window, EVENT_RESIZE, this.onResize);
      }
    }
  };

  var handlers = {
    resize: function resize() {
      var options = this.options,
          container = this.container,
          containerData = this.containerData;
      var minContainerWidth = Number(options.minContainerWidth) || MIN_CONTAINER_WIDTH;
      var minContainerHeight = Number(options.minContainerHeight) || MIN_CONTAINER_HEIGHT;

      if (this.disabled || containerData.width <= minContainerWidth || containerData.height <= minContainerHeight) {
        return;
      }

      var ratio = container.offsetWidth / containerData.width; // Resize when width changed or height changed

      if (ratio !== 1 || container.offsetHeight !== containerData.height) {
        var canvasData;
        var cropBoxData;

        if (options.restore) {
          canvasData = this.getCanvasData();
          cropBoxData = this.getCropBoxData();
        }

        this.render();

        if (options.restore) {
          this.setCanvasData(forEach(canvasData, function (n, i) {
            canvasData[i] = n * ratio;
          }));
          this.setCropBoxData(forEach(cropBoxData, function (n, i) {
            cropBoxData[i] = n * ratio;
          }));
        }
      }
    },
    dblclick: function dblclick() {
      if (this.disabled || this.options.dragMode === DRAG_MODE_NONE) {
        return;
      }

      this.setDragMode(hasClass(this.dragBox, CLASS_CROP) ? DRAG_MODE_MOVE : DRAG_MODE_CROP);
    },
    wheel: function wheel(event) {
      var _this = this;

      var ratio = Number(this.options.wheelZoomRatio) || 0.1;
      var delta = 1;

      if (this.disabled) {
        return;
      }

      event.preventDefault(); // Limit wheel speed to prevent zoom too fast (#21)

      if (this.wheeling) {
        return;
      }

      this.wheeling = true;
      setTimeout(function () {
        _this.wheeling = false;
      }, 50);

      if (event.deltaY) {
        delta = event.deltaY > 0 ? 1 : -1;
      } else if (event.wheelDelta) {
        delta = -event.wheelDelta / 120;
      } else if (event.detail) {
        delta = event.detail > 0 ? 1 : -1;
      }

      this.zoom(-delta * ratio, event);
    },
    cropStart: function cropStart(event) {
      var buttons = event.buttons,
          button = event.button;

      if (this.disabled // Handle mouse event and pointer event and ignore touch event
      || (event.type === 'mousedown' || event.type === 'pointerdown' && event.pointerType === 'mouse') && ( // No primary button (Usually the left button)
      isNumber(buttons) && buttons !== 1 || isNumber(button) && button !== 0 // Open context menu
      || event.ctrlKey)) {
        return;
      }

      var options = this.options,
          pointers = this.pointers;
      var action;

      if (event.changedTouches) {
        // Handle touch event
        forEach(event.changedTouches, function (touch) {
          pointers[touch.identifier] = getPointer(touch);
        });
      } else {
        // Handle mouse event and pointer event
        pointers[event.pointerId || 0] = getPointer(event);
      }

      if (Object.keys(pointers).length > 1 && options.zoomable && options.zoomOnTouch) {
        action = ACTION_ZOOM;
      } else {
        action = getData(event.target, DATA_ACTION);
      }

      if (!REGEXP_ACTIONS.test(action)) {
        return;
      }

      if (dispatchEvent(this.element, EVENT_CROP_START, {
        originalEvent: event,
        action: action
      }) === false) {
        return;
      } // This line is required for preventing page zooming in iOS browsers


      event.preventDefault();
      this.action = action;
      this.cropping = false;

      if (action === ACTION_CROP) {
        this.cropping = true;
        addClass(this.dragBox, CLASS_MODAL);
      }
    },
    cropMove: function cropMove(event) {
      var action = this.action;

      if (this.disabled || !action) {
        return;
      }

      var pointers = this.pointers;
      event.preventDefault();

      if (dispatchEvent(this.element, EVENT_CROP_MOVE, {
        originalEvent: event,
        action: action
      }) === false) {
        return;
      }

      if (event.changedTouches) {
        forEach(event.changedTouches, function (touch) {
          // The first parameter should not be undefined (#432)
          assign(pointers[touch.identifier] || {}, getPointer(touch, true));
        });
      } else {
        assign(pointers[event.pointerId || 0] || {}, getPointer(event, true));
      }

      this.change(event);
    },
    cropEnd: function cropEnd(event) {
      if (this.disabled) {
        return;
      }

      var action = this.action,
          pointers = this.pointers;

      if (event.changedTouches) {
        forEach(event.changedTouches, function (touch) {
          delete pointers[touch.identifier];
        });
      } else {
        delete pointers[event.pointerId || 0];
      }

      if (!action) {
        return;
      }

      event.preventDefault();

      if (!Object.keys(pointers).length) {
        this.action = '';
      }

      if (this.cropping) {
        this.cropping = false;
        toggleClass(this.dragBox, CLASS_MODAL, this.cropped && this.options.modal);
      }

      dispatchEvent(this.element, EVENT_CROP_END, {
        originalEvent: event,
        action: action
      });
    }
  };

  var change = {
    change: function change(event) {
      var options = this.options,
          canvasData = this.canvasData,
          containerData = this.containerData,
          cropBoxData = this.cropBoxData,
          pointers = this.pointers;
      var action = this.action;
      var aspectRatio = options.aspectRatio;
      var left = cropBoxData.left,
          top = cropBoxData.top,
          width = cropBoxData.width,
          height = cropBoxData.height;
      var right = left + width;
      var bottom = top + height;
      var minLeft = 0;
      var minTop = 0;
      var maxWidth = containerData.width;
      var maxHeight = containerData.height;
      var renderable = true;
      var offset; // Locking aspect ratio in "free mode" by holding shift key

      if (!aspectRatio && event.shiftKey) {
        aspectRatio = width && height ? width / height : 1;
      }

      if (this.limited) {
        minLeft = cropBoxData.minLeft;
        minTop = cropBoxData.minTop;
        maxWidth = minLeft + Math.min(containerData.width, canvasData.width, canvasData.left + canvasData.width);
        maxHeight = minTop + Math.min(containerData.height, canvasData.height, canvasData.top + canvasData.height);
      }

      var pointer = pointers[Object.keys(pointers)[0]];
      var range = {
        x: pointer.endX - pointer.startX,
        y: pointer.endY - pointer.startY
      };

      var check = function check(side) {
        switch (side) {
          case ACTION_EAST:
            if (right + range.x > maxWidth) {
              range.x = maxWidth - right;
            }

            break;

          case ACTION_WEST:
            if (left + range.x < minLeft) {
              range.x = minLeft - left;
            }

            break;

          case ACTION_NORTH:
            if (top + range.y < minTop) {
              range.y = minTop - top;
            }

            break;

          case ACTION_SOUTH:
            if (bottom + range.y > maxHeight) {
              range.y = maxHeight - bottom;
            }

            break;

          default:
        }
      };

      switch (action) {
        // Move crop box
        case ACTION_ALL:
          left += range.x;
          top += range.y;
          break;
        // Resize crop box

        case ACTION_EAST:
          if (range.x >= 0 && (right >= maxWidth || aspectRatio && (top <= minTop || bottom >= maxHeight))) {
            renderable = false;
            break;
          }

          check(ACTION_EAST);
          width += range.x;

          if (width < 0) {
            action = ACTION_WEST;
            width = -width;
            left -= width;
          }

          if (aspectRatio) {
            height = width / aspectRatio;
            top += (cropBoxData.height - height) / 2;
          }

          break;

        case ACTION_NORTH:
          if (range.y <= 0 && (top <= minTop || aspectRatio && (left <= minLeft || right >= maxWidth))) {
            renderable = false;
            break;
          }

          check(ACTION_NORTH);
          height -= range.y;
          top += range.y;

          if (height < 0) {
            action = ACTION_SOUTH;
            height = -height;
            top -= height;
          }

          if (aspectRatio) {
            width = height * aspectRatio;
            left += (cropBoxData.width - width) / 2;
          }

          break;

        case ACTION_WEST:
          if (range.x <= 0 && (left <= minLeft || aspectRatio && (top <= minTop || bottom >= maxHeight))) {
            renderable = false;
            break;
          }

          check(ACTION_WEST);
          width -= range.x;
          left += range.x;

          if (width < 0) {
            action = ACTION_EAST;
            width = -width;
            left -= width;
          }

          if (aspectRatio) {
            height = width / aspectRatio;
            top += (cropBoxData.height - height) / 2;
          }

          break;

        case ACTION_SOUTH:
          if (range.y >= 0 && (bottom >= maxHeight || aspectRatio && (left <= minLeft || right >= maxWidth))) {
            renderable = false;
            break;
          }

          check(ACTION_SOUTH);
          height += range.y;

          if (height < 0) {
            action = ACTION_NORTH;
            height = -height;
            top -= height;
          }

          if (aspectRatio) {
            width = height * aspectRatio;
            left += (cropBoxData.width - width) / 2;
          }

          break;

        case ACTION_NORTH_EAST:
          if (aspectRatio) {
            if (range.y <= 0 && (top <= minTop || right >= maxWidth)) {
              renderable = false;
              break;
            }

            check(ACTION_NORTH);
            height -= range.y;
            top += range.y;
            width = height * aspectRatio;
          } else {
            check(ACTION_NORTH);
            check(ACTION_EAST);

            if (range.x >= 0) {
              if (right < maxWidth) {
                width += range.x;
              } else if (range.y <= 0 && top <= minTop) {
                renderable = false;
              }
            } else {
              width += range.x;
            }

            if (range.y <= 0) {
              if (top > minTop) {
                height -= range.y;
                top += range.y;
              }
            } else {
              height -= range.y;
              top += range.y;
            }
          }

          if (width < 0 && height < 0) {
            action = ACTION_SOUTH_WEST;
            height = -height;
            width = -width;
            top -= height;
            left -= width;
          } else if (width < 0) {
            action = ACTION_NORTH_WEST;
            width = -width;
            left -= width;
          } else if (height < 0) {
            action = ACTION_SOUTH_EAST;
            height = -height;
            top -= height;
          }

          break;

        case ACTION_NORTH_WEST:
          if (aspectRatio) {
            if (range.y <= 0 && (top <= minTop || left <= minLeft)) {
              renderable = false;
              break;
            }

            check(ACTION_NORTH);
            height -= range.y;
            top += range.y;
            width = height * aspectRatio;
            left += cropBoxData.width - width;
          } else {
            check(ACTION_NORTH);
            check(ACTION_WEST);

            if (range.x <= 0) {
              if (left > minLeft) {
                width -= range.x;
                left += range.x;
              } else if (range.y <= 0 && top <= minTop) {
                renderable = false;
              }
            } else {
              width -= range.x;
              left += range.x;
            }

            if (range.y <= 0) {
              if (top > minTop) {
                height -= range.y;
                top += range.y;
              }
            } else {
              height -= range.y;
              top += range.y;
            }
          }

          if (width < 0 && height < 0) {
            action = ACTION_SOUTH_EAST;
            height = -height;
            width = -width;
            top -= height;
            left -= width;
          } else if (width < 0) {
            action = ACTION_NORTH_EAST;
            width = -width;
            left -= width;
          } else if (height < 0) {
            action = ACTION_SOUTH_WEST;
            height = -height;
            top -= height;
          }

          break;

        case ACTION_SOUTH_WEST:
          if (aspectRatio) {
            if (range.x <= 0 && (left <= minLeft || bottom >= maxHeight)) {
              renderable = false;
              break;
            }

            check(ACTION_WEST);
            width -= range.x;
            left += range.x;
            height = width / aspectRatio;
          } else {
            check(ACTION_SOUTH);
            check(ACTION_WEST);

            if (range.x <= 0) {
              if (left > minLeft) {
                width -= range.x;
                left += range.x;
              } else if (range.y >= 0 && bottom >= maxHeight) {
                renderable = false;
              }
            } else {
              width -= range.x;
              left += range.x;
            }

            if (range.y >= 0) {
              if (bottom < maxHeight) {
                height += range.y;
              }
            } else {
              height += range.y;
            }
          }

          if (width < 0 && height < 0) {
            action = ACTION_NORTH_EAST;
            height = -height;
            width = -width;
            top -= height;
            left -= width;
          } else if (width < 0) {
            action = ACTION_SOUTH_EAST;
            width = -width;
            left -= width;
          } else if (height < 0) {
            action = ACTION_NORTH_WEST;
            height = -height;
            top -= height;
          }

          break;

        case ACTION_SOUTH_EAST:
          if (aspectRatio) {
            if (range.x >= 0 && (right >= maxWidth || bottom >= maxHeight)) {
              renderable = false;
              break;
            }

            check(ACTION_EAST);
            width += range.x;
            height = width / aspectRatio;
          } else {
            check(ACTION_SOUTH);
            check(ACTION_EAST);

            if (range.x >= 0) {
              if (right < maxWidth) {
                width += range.x;
              } else if (range.y >= 0 && bottom >= maxHeight) {
                renderable = false;
              }
            } else {
              width += range.x;
            }

            if (range.y >= 0) {
              if (bottom < maxHeight) {
                height += range.y;
              }
            } else {
              height += range.y;
            }
          }

          if (width < 0 && height < 0) {
            action = ACTION_NORTH_WEST;
            height = -height;
            width = -width;
            top -= height;
            left -= width;
          } else if (width < 0) {
            action = ACTION_SOUTH_WEST;
            width = -width;
            left -= width;
          } else if (height < 0) {
            action = ACTION_NORTH_EAST;
            height = -height;
            top -= height;
          }

          break;
        // Move canvas

        case ACTION_MOVE:
          this.move(range.x, range.y);
          renderable = false;
          break;
        // Zoom canvas

        case ACTION_ZOOM:
          this.zoom(getMaxZoomRatio(pointers), event);
          renderable = false;
          break;
        // Create crop box

        case ACTION_CROP:
          if (!range.x || !range.y) {
            renderable = false;
            break;
          }

          offset = getOffset(this.cropper);
          left = pointer.startX - offset.left;
          top = pointer.startY - offset.top;
          width = cropBoxData.minWidth;
          height = cropBoxData.minHeight;

          if (range.x > 0) {
            action = range.y > 0 ? ACTION_SOUTH_EAST : ACTION_NORTH_EAST;
          } else if (range.x < 0) {
            left -= width;
            action = range.y > 0 ? ACTION_SOUTH_WEST : ACTION_NORTH_WEST;
          }

          if (range.y < 0) {
            top -= height;
          } // Show the crop box if is hidden


          if (!this.cropped) {
            removeClass(this.cropBox, CLASS_HIDDEN);
            this.cropped = true;

            if (this.limited) {
              this.limitCropBox(true, true);
            }
          }

          break;

        default:
      }

      if (renderable) {
        cropBoxData.width = width;
        cropBoxData.height = height;
        cropBoxData.left = left;
        cropBoxData.top = top;
        this.action = action;
        this.renderCropBox();
      } // Override


      forEach(pointers, function (p) {
        p.startX = p.endX;
        p.startY = p.endY;
      });
    }
  };

  var methods = {
    // Show the crop box manually
    crop: function crop() {
      if (this.ready && !this.cropped && !this.disabled) {
        this.cropped = true;
        this.limitCropBox(true, true);

        if (this.options.modal) {
          addClass(this.dragBox, CLASS_MODAL);
        }

        removeClass(this.cropBox, CLASS_HIDDEN);
        this.setCropBoxData(this.initialCropBoxData);
      }

      return this;
    },
    // Reset the image and crop box to their initial states
    reset: function reset() {
      if (this.ready && !this.disabled) {
        this.imageData = assign({}, this.initialImageData);
        this.canvasData = assign({}, this.initialCanvasData);
        this.cropBoxData = assign({}, this.initialCropBoxData);
        this.renderCanvas();

        if (this.cropped) {
          this.renderCropBox();
        }
      }

      return this;
    },
    // Clear the crop box
    clear: function clear() {
      if (this.cropped && !this.disabled) {
        assign(this.cropBoxData, {
          left: 0,
          top: 0,
          width: 0,
          height: 0
        });
        this.cropped = false;
        this.renderCropBox();
        this.limitCanvas(true, true); // Render canvas after crop box rendered

        this.renderCanvas();
        removeClass(this.dragBox, CLASS_MODAL);
        addClass(this.cropBox, CLASS_HIDDEN);
      }

      return this;
    },

    /**
     * Replace the image's src and rebuild the cropper
     * @param {string} url - The new URL.
     * @param {boolean} [hasSameSize] - Indicate if the new image has the same size as the old one.
     * @returns {Cropper} this
     */
    replace: function replace(url) {
      var hasSameSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (!this.disabled && url) {
        if (this.isImg) {
          this.element.src = url;
        }

        if (hasSameSize) {
          this.url = url;
          this.image.src = url;

          if (this.ready) {
            this.viewBoxImage.src = url;
            forEach(this.previews, function (element) {
              element.getElementsByTagName('img')[0].src = url;
            });
          }
        } else {
          if (this.isImg) {
            this.replaced = true;
          }

          this.options.data = null;
          this.uncreate();
          this.load(url);
        }
      }

      return this;
    },
    // Enable (unfreeze) the cropper
    enable: function enable() {
      if (this.ready && this.disabled) {
        this.disabled = false;
        removeClass(this.cropper, CLASS_DISABLED);
      }

      return this;
    },
    // Disable (freeze) the cropper
    disable: function disable() {
      if (this.ready && !this.disabled) {
        this.disabled = true;
        addClass(this.cropper, CLASS_DISABLED);
      }

      return this;
    },

    /**
     * Destroy the cropper and remove the instance from the image
     * @returns {Cropper} this
     */
    destroy: function destroy() {
      var element = this.element;

      if (!element[NAMESPACE]) {
        return this;
      }

      element[NAMESPACE] = undefined;

      if (this.isImg && this.replaced) {
        element.src = this.originalUrl;
      }

      this.uncreate();
      return this;
    },

    /**
     * Move the canvas with relative offsets
     * @param {number} offsetX - The relative offset distance on the x-axis.
     * @param {number} [offsetY=offsetX] - The relative offset distance on the y-axis.
     * @returns {Cropper} this
     */
    move: function move(offsetX) {
      var offsetY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : offsetX;
      var _this$canvasData = this.canvasData,
          left = _this$canvasData.left,
          top = _this$canvasData.top;
      return this.moveTo(isUndefined(offsetX) ? offsetX : left + Number(offsetX), isUndefined(offsetY) ? offsetY : top + Number(offsetY));
    },

    /**
     * Move the canvas to an absolute point
     * @param {number} x - The x-axis coordinate.
     * @param {number} [y=x] - The y-axis coordinate.
     * @returns {Cropper} this
     */
    moveTo: function moveTo(x) {
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;
      var canvasData = this.canvasData;
      var changed = false;
      x = Number(x);
      y = Number(y);

      if (this.ready && !this.disabled && this.options.movable) {
        if (isNumber(x)) {
          canvasData.left = x;
          changed = true;
        }

        if (isNumber(y)) {
          canvasData.top = y;
          changed = true;
        }

        if (changed) {
          this.renderCanvas(true);
        }
      }

      return this;
    },

    /**
     * Zoom the canvas with a relative ratio
     * @param {number} ratio - The target ratio.
     * @param {Event} _originalEvent - The original event if any.
     * @returns {Cropper} this
     */
    zoom: function zoom(ratio, _originalEvent) {
      var canvasData = this.canvasData;
      ratio = Number(ratio);

      if (ratio < 0) {
        ratio = 1 / (1 - ratio);
      } else {
        ratio = 1 + ratio;
      }

      return this.zoomTo(canvasData.width * ratio / canvasData.naturalWidth, null, _originalEvent);
    },

    /**
     * Zoom the canvas to an absolute ratio
     * @param {number} ratio - The target ratio.
     * @param {Object} pivot - The zoom pivot point coordinate.
     * @param {Event} _originalEvent - The original event if any.
     * @returns {Cropper} this
     */
    zoomTo: function zoomTo(ratio, pivot, _originalEvent) {
      var options = this.options,
          canvasData = this.canvasData;
      var width = canvasData.width,
          height = canvasData.height,
          naturalWidth = canvasData.naturalWidth,
          naturalHeight = canvasData.naturalHeight;
      ratio = Number(ratio);

      if (ratio >= 0 && this.ready && !this.disabled && options.zoomable) {
        var newWidth = naturalWidth * ratio;
        var newHeight = naturalHeight * ratio;

        if (dispatchEvent(this.element, EVENT_ZOOM, {
          ratio: ratio,
          oldRatio: width / naturalWidth,
          originalEvent: _originalEvent
        }) === false) {
          return this;
        }

        if (_originalEvent) {
          var pointers = this.pointers;
          var offset = getOffset(this.cropper);
          var center = pointers && Object.keys(pointers).length ? getPointersCenter(pointers) : {
            pageX: _originalEvent.pageX,
            pageY: _originalEvent.pageY
          }; // Zoom from the triggering point of the event

          canvasData.left -= (newWidth - width) * ((center.pageX - offset.left - canvasData.left) / width);
          canvasData.top -= (newHeight - height) * ((center.pageY - offset.top - canvasData.top) / height);
        } else if (isPlainObject(pivot) && isNumber(pivot.x) && isNumber(pivot.y)) {
          canvasData.left -= (newWidth - width) * ((pivot.x - canvasData.left) / width);
          canvasData.top -= (newHeight - height) * ((pivot.y - canvasData.top) / height);
        } else {
          // Zoom from the center of the canvas
          canvasData.left -= (newWidth - width) / 2;
          canvasData.top -= (newHeight - height) / 2;
        }

        canvasData.width = newWidth;
        canvasData.height = newHeight;
        this.renderCanvas(true);
      }

      return this;
    },

    /**
     * Rotate the canvas with a relative degree
     * @param {number} degree - The rotate degree.
     * @returns {Cropper} this
     */
    rotate: function rotate(degree) {
      return this.rotateTo((this.imageData.rotate || 0) + Number(degree));
    },

    /**
     * Rotate the canvas to an absolute degree
     * @param {number} degree - The rotate degree.
     * @returns {Cropper} this
     */
    rotateTo: function rotateTo(degree) {
      degree = Number(degree);

      if (isNumber(degree) && this.ready && !this.disabled && this.options.rotatable) {
        this.imageData.rotate = degree % 360;
        this.renderCanvas(true, true);
      }

      return this;
    },

    /**
     * Scale the image on the x-axis.
     * @param {number} scaleX - The scale ratio on the x-axis.
     * @returns {Cropper} this
     */
    scaleX: function scaleX(_scaleX) {
      var scaleY = this.imageData.scaleY;
      return this.scale(_scaleX, isNumber(scaleY) ? scaleY : 1);
    },

    /**
     * Scale the image on the y-axis.
     * @param {number} scaleY - The scale ratio on the y-axis.
     * @returns {Cropper} this
     */
    scaleY: function scaleY(_scaleY) {
      var scaleX = this.imageData.scaleX;
      return this.scale(isNumber(scaleX) ? scaleX : 1, _scaleY);
    },

    /**
     * Scale the image
     * @param {number} scaleX - The scale ratio on the x-axis.
     * @param {number} [scaleY=scaleX] - The scale ratio on the y-axis.
     * @returns {Cropper} this
     */
    scale: function scale(scaleX) {
      var scaleY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : scaleX;
      var imageData = this.imageData;
      var transformed = false;
      scaleX = Number(scaleX);
      scaleY = Number(scaleY);

      if (this.ready && !this.disabled && this.options.scalable) {
        if (isNumber(scaleX)) {
          imageData.scaleX = scaleX;
          transformed = true;
        }

        if (isNumber(scaleY)) {
          imageData.scaleY = scaleY;
          transformed = true;
        }

        if (transformed) {
          this.renderCanvas(true, true);
        }
      }

      return this;
    },

    /**
     * Get the cropped area position and size data (base on the original image)
     * @param {boolean} [rounded=false] - Indicate if round the data values or not.
     * @returns {Object} The result cropped data.
     */
    getData: function getData() {
      var rounded = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var options = this.options,
          imageData = this.imageData,
          canvasData = this.canvasData,
          cropBoxData = this.cropBoxData;
      var data;

      if (this.ready && this.cropped) {
        data = {
          x: cropBoxData.left - canvasData.left,
          y: cropBoxData.top - canvasData.top,
          width: cropBoxData.width,
          height: cropBoxData.height
        };
        var ratio = imageData.width / imageData.naturalWidth;
        forEach(data, function (n, i) {
          data[i] = n / ratio;
        });

        if (rounded) {
          // In case rounding off leads to extra 1px in right or bottom border
          // we should round the top-left corner and the dimension (#343).
          var bottom = Math.round(data.y + data.height);
          var right = Math.round(data.x + data.width);
          data.x = Math.round(data.x);
          data.y = Math.round(data.y);
          data.width = right - data.x;
          data.height = bottom - data.y;
        }
      } else {
        data = {
          x: 0,
          y: 0,
          width: 0,
          height: 0
        };
      }

      if (options.rotatable) {
        data.rotate = imageData.rotate || 0;
      }

      if (options.scalable) {
        data.scaleX = imageData.scaleX || 1;
        data.scaleY = imageData.scaleY || 1;
      }

      return data;
    },

    /**
     * Set the cropped area position and size with new data
     * @param {Object} data - The new data.
     * @returns {Cropper} this
     */
    setData: function setData(data) {
      var options = this.options,
          imageData = this.imageData,
          canvasData = this.canvasData;
      var cropBoxData = {};

      if (this.ready && !this.disabled && isPlainObject(data)) {
        var transformed = false;

        if (options.rotatable) {
          if (isNumber(data.rotate) && data.rotate !== imageData.rotate) {
            imageData.rotate = data.rotate;
            transformed = true;
          }
        }

        if (options.scalable) {
          if (isNumber(data.scaleX) && data.scaleX !== imageData.scaleX) {
            imageData.scaleX = data.scaleX;
            transformed = true;
          }

          if (isNumber(data.scaleY) && data.scaleY !== imageData.scaleY) {
            imageData.scaleY = data.scaleY;
            transformed = true;
          }
        }

        if (transformed) {
          this.renderCanvas(true, true);
        }

        var ratio = imageData.width / imageData.naturalWidth;

        if (isNumber(data.x)) {
          cropBoxData.left = data.x * ratio + canvasData.left;
        }

        if (isNumber(data.y)) {
          cropBoxData.top = data.y * ratio + canvasData.top;
        }

        if (isNumber(data.width)) {
          cropBoxData.width = data.width * ratio;
        }

        if (isNumber(data.height)) {
          cropBoxData.height = data.height * ratio;
        }

        this.setCropBoxData(cropBoxData);
      }

      return this;
    },

    /**
     * Get the container size data.
     * @returns {Object} The result container data.
     */
    getContainerData: function getContainerData() {
      return this.ready ? assign({}, this.containerData) : {};
    },

    /**
     * Get the image position and size data.
     * @returns {Object} The result image data.
     */
    getImageData: function getImageData() {
      return this.sized ? assign({}, this.imageData) : {};
    },

    /**
     * Get the canvas position and size data.
     * @returns {Object} The result canvas data.
     */
    getCanvasData: function getCanvasData() {
      var canvasData = this.canvasData;
      var data = {};

      if (this.ready) {
        forEach(['left', 'top', 'width', 'height', 'naturalWidth', 'naturalHeight'], function (n) {
          data[n] = canvasData[n];
        });
      }

      return data;
    },

    /**
     * Set the canvas position and size with new data.
     * @param {Object} data - The new canvas data.
     * @returns {Cropper} this
     */
    setCanvasData: function setCanvasData(data) {
      var canvasData = this.canvasData;
      var aspectRatio = canvasData.aspectRatio;

      if (this.ready && !this.disabled && isPlainObject(data)) {
        if (isNumber(data.left)) {
          canvasData.left = data.left;
        }

        if (isNumber(data.top)) {
          canvasData.top = data.top;
        }

        if (isNumber(data.width)) {
          canvasData.width = data.width;
          canvasData.height = data.width / aspectRatio;
        } else if (isNumber(data.height)) {
          canvasData.height = data.height;
          canvasData.width = data.height * aspectRatio;
        }

        this.renderCanvas(true);
      }

      return this;
    },

    /**
     * Get the crop box position and size data.
     * @returns {Object} The result crop box data.
     */
    getCropBoxData: function getCropBoxData() {
      var cropBoxData = this.cropBoxData;
      var data;

      if (this.ready && this.cropped) {
        data = {
          left: cropBoxData.left,
          top: cropBoxData.top,
          width: cropBoxData.width,
          height: cropBoxData.height
        };
      }

      return data || {};
    },

    /**
     * Set the crop box position and size with new data.
     * @param {Object} data - The new crop box data.
     * @returns {Cropper} this
     */
    setCropBoxData: function setCropBoxData(data) {
      var cropBoxData = this.cropBoxData;
      var aspectRatio = this.options.aspectRatio;
      var widthChanged;
      var heightChanged;

      if (this.ready && this.cropped && !this.disabled && isPlainObject(data)) {
        if (isNumber(data.left)) {
          cropBoxData.left = data.left;
        }

        if (isNumber(data.top)) {
          cropBoxData.top = data.top;
        }

        if (isNumber(data.width) && data.width !== cropBoxData.width) {
          widthChanged = true;
          cropBoxData.width = data.width;
        }

        if (isNumber(data.height) && data.height !== cropBoxData.height) {
          heightChanged = true;
          cropBoxData.height = data.height;
        }

        if (aspectRatio) {
          if (widthChanged) {
            cropBoxData.height = cropBoxData.width / aspectRatio;
          } else if (heightChanged) {
            cropBoxData.width = cropBoxData.height * aspectRatio;
          }
        }

        this.renderCropBox();
      }

      return this;
    },

    /**
     * Get a canvas drawn the cropped image.
     * @param {Object} [options={}] - The config options.
     * @returns {HTMLCanvasElement} - The result canvas.
     */
    getCroppedCanvas: function getCroppedCanvas() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (!this.ready || !window.HTMLCanvasElement) {
        return null;
      }

      var canvasData = this.canvasData;
      var source = getSourceCanvas(this.image, this.imageData, canvasData, options); // Returns the source canvas if it is not cropped.

      if (!this.cropped) {
        return source;
      }

      var _this$getData = this.getData(),
          initialX = _this$getData.x,
          initialY = _this$getData.y,
          initialWidth = _this$getData.width,
          initialHeight = _this$getData.height;

      var ratio = source.width / Math.floor(canvasData.naturalWidth);

      if (ratio !== 1) {
        initialX *= ratio;
        initialY *= ratio;
        initialWidth *= ratio;
        initialHeight *= ratio;
      }

      var aspectRatio = initialWidth / initialHeight;
      var maxSizes = getAdjustedSizes({
        aspectRatio: aspectRatio,
        width: options.maxWidth || Infinity,
        height: options.maxHeight || Infinity
      });
      var minSizes = getAdjustedSizes({
        aspectRatio: aspectRatio,
        width: options.minWidth || 0,
        height: options.minHeight || 0
      }, 'cover');

      var _getAdjustedSizes = getAdjustedSizes({
        aspectRatio: aspectRatio,
        width: options.width || (ratio !== 1 ? source.width : initialWidth),
        height: options.height || (ratio !== 1 ? source.height : initialHeight)
      }),
          width = _getAdjustedSizes.width,
          height = _getAdjustedSizes.height;

      width = Math.min(maxSizes.width, Math.max(minSizes.width, width));
      height = Math.min(maxSizes.height, Math.max(minSizes.height, height));
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      canvas.width = normalizeDecimalNumber(width);
      canvas.height = normalizeDecimalNumber(height);
      context.fillStyle = options.fillColor || 'transparent';
      context.fillRect(0, 0, width, height);
      var _options$imageSmoothi = options.imageSmoothingEnabled,
          imageSmoothingEnabled = _options$imageSmoothi === void 0 ? true : _options$imageSmoothi,
          imageSmoothingQuality = options.imageSmoothingQuality;
      context.imageSmoothingEnabled = imageSmoothingEnabled;

      if (imageSmoothingQuality) {
        context.imageSmoothingQuality = imageSmoothingQuality;
      } // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.drawImage


      var sourceWidth = source.width;
      var sourceHeight = source.height; // Source canvas parameters

      var srcX = initialX;
      var srcY = initialY;
      var srcWidth;
      var srcHeight; // Destination canvas parameters

      var dstX;
      var dstY;
      var dstWidth;
      var dstHeight;

      if (srcX <= -initialWidth || srcX > sourceWidth) {
        srcX = 0;
        srcWidth = 0;
        dstX = 0;
        dstWidth = 0;
      } else if (srcX <= 0) {
        dstX = -srcX;
        srcX = 0;
        srcWidth = Math.min(sourceWidth, initialWidth + srcX);
        dstWidth = srcWidth;
      } else if (srcX <= sourceWidth) {
        dstX = 0;
        srcWidth = Math.min(initialWidth, sourceWidth - srcX);
        dstWidth = srcWidth;
      }

      if (srcWidth <= 0 || srcY <= -initialHeight || srcY > sourceHeight) {
        srcY = 0;
        srcHeight = 0;
        dstY = 0;
        dstHeight = 0;
      } else if (srcY <= 0) {
        dstY = -srcY;
        srcY = 0;
        srcHeight = Math.min(sourceHeight, initialHeight + srcY);
        dstHeight = srcHeight;
      } else if (srcY <= sourceHeight) {
        dstY = 0;
        srcHeight = Math.min(initialHeight, sourceHeight - srcY);
        dstHeight = srcHeight;
      }

      var params = [srcX, srcY, srcWidth, srcHeight]; // Avoid "IndexSizeError"

      if (dstWidth > 0 && dstHeight > 0) {
        var scale = width / initialWidth;
        params.push(dstX * scale, dstY * scale, dstWidth * scale, dstHeight * scale);
      } // All the numerical parameters should be integer for `drawImage`
      // https://github.com/fengyuanchen/cropper/issues/476


      context.drawImage.apply(context, [source].concat(_toConsumableArray(params.map(function (param) {
        return Math.floor(normalizeDecimalNumber(param));
      }))));
      return canvas;
    },

    /**
     * Change the aspect ratio of the crop box.
     * @param {number} aspectRatio - The new aspect ratio.
     * @returns {Cropper} this
     */
    setAspectRatio: function setAspectRatio(aspectRatio) {
      var options = this.options;

      if (!this.disabled && !isUndefined(aspectRatio)) {
        // 0 -> NaN
        options.aspectRatio = Math.max(0, aspectRatio) || NaN;

        if (this.ready) {
          this.initCropBox();

          if (this.cropped) {
            this.renderCropBox();
          }
        }
      }

      return this;
    },

    /**
     * Change the drag mode.
     * @param {string} mode - The new drag mode.
     * @returns {Cropper} this
     */
    setDragMode: function setDragMode(mode) {
      var options = this.options,
          dragBox = this.dragBox,
          face = this.face;

      if (this.ready && !this.disabled) {
        var croppable = mode === DRAG_MODE_CROP;
        var movable = options.movable && mode === DRAG_MODE_MOVE;
        mode = croppable || movable ? mode : DRAG_MODE_NONE;
        options.dragMode = mode;
        setData(dragBox, DATA_ACTION, mode);
        toggleClass(dragBox, CLASS_CROP, croppable);
        toggleClass(dragBox, CLASS_MOVE, movable);

        if (!options.cropBoxMovable) {
          // Sync drag mode to crop box when it is not movable
          setData(face, DATA_ACTION, mode);
          toggleClass(face, CLASS_CROP, croppable);
          toggleClass(face, CLASS_MOVE, movable);
        }
      }

      return this;
    }
  };

  var AnotherCropper = WINDOW.Cropper;

  var Cropper =
  /*#__PURE__*/
  function () {
    /**
     * Create a new Cropper.
     * @param {Element} element - The target element for cropping.
     * @param {Object} [options={}] - The configuration options.
     */
    function Cropper(element) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Cropper);

      if (!element || !REGEXP_TAG_NAME.test(element.tagName)) {
        throw new Error('The first argument is required and must be an <img> or <canvas> element.');
      }

      this.element = element;
      this.options = assign({}, DEFAULTS, isPlainObject(options) && options);
      this.cropped = false;
      this.disabled = false;
      this.pointers = {};
      this.ready = false;
      this.reloading = false;
      this.replaced = false;
      this.sized = false;
      this.sizing = false;
      this.init();
    }

    _createClass(Cropper, [{
      key: "init",
      value: function init() {
        var element = this.element;
        var tagName = element.tagName.toLowerCase();
        var url;

        if (element[NAMESPACE]) {
          return;
        }

        element[NAMESPACE] = this;

        if (tagName === 'img') {
          this.isImg = true; // e.g.: "img/picture.jpg"

          url = element.getAttribute('src') || '';
          this.originalUrl = url; // Stop when it's a blank image

          if (!url) {
            return;
          } // e.g.: "http://example.com/img/picture.jpg"


          url = element.src;
        } else if (tagName === 'canvas' && window.HTMLCanvasElement) {
          url = element.toDataURL();
        }

        this.load(url);
      }
    }, {
      key: "load",
      value: function load(url) {
        var _this = this;

        if (!url) {
          return;
        }

        this.url = url;
        this.imageData = {};
        var element = this.element,
            options = this.options;

        if (!options.rotatable && !options.scalable) {
          options.checkOrientation = false;
        } // Only IE10+ supports Typed Arrays


        if (!options.checkOrientation || !window.ArrayBuffer) {
          this.clone();
          return;
        } // Detect the mime type of the image directly if it is a Data URL


        if (REGEXP_DATA_URL.test(url)) {
          // Read ArrayBuffer from Data URL of JPEG images directly for better performance
          if (REGEXP_DATA_URL_JPEG.test(url)) {
            this.read(dataURLToArrayBuffer(url));
          } else {
            // Only a JPEG image may contains Exif Orientation information,
            // the rest types of Data URLs are not necessary to check orientation at all.
            this.clone();
          }

          return;
        } // 1. Detect the mime type of the image by a XMLHttpRequest.
        // 2. Load the image as ArrayBuffer for reading orientation if its a JPEG image.


        var xhr = new XMLHttpRequest();
        var clone = this.clone.bind(this);
        this.reloading = true;
        this.xhr = xhr; // 1. Cross origin requests are only supported for protocol schemes:
        // http, https, data, chrome, chrome-extension.
        // 2. Access to XMLHttpRequest from a Data URL will be blocked by CORS policy
        // in some browsers as IE11 and Safari.

        xhr.onabort = clone;
        xhr.onerror = clone;
        xhr.ontimeout = clone;

        xhr.onprogress = function () {
          // Abort the request directly if it not a JPEG image for better performance
          if (xhr.getResponseHeader('content-type') !== MIME_TYPE_JPEG) {
            xhr.abort();
          }
        };

        xhr.onload = function () {
          _this.read(xhr.response);
        };

        xhr.onloadend = function () {
          _this.reloading = false;
          _this.xhr = null;
        }; // Bust cache when there is a "crossOrigin" property to avoid browser cache error


        if (options.checkCrossOrigin && isCrossOriginURL(url) && element.crossOrigin) {
          url = addTimestamp(url);
        }

        xhr.open('GET', url);
        xhr.responseType = 'arraybuffer';
        xhr.withCredentials = element.crossOrigin === 'use-credentials';
        xhr.send();
      }
    }, {
      key: "read",
      value: function read(arrayBuffer) {
        var options = this.options,
            imageData = this.imageData; // Reset the orientation value to its default value 1
        // as some iOS browsers will render image with its orientation

        var orientation = resetAndGetOrientation(arrayBuffer);
        var rotate = 0;
        var scaleX = 1;
        var scaleY = 1;

        if (orientation > 1) {
          // Generate a new URL which has the default orientation value
          this.url = arrayBufferToDataURL(arrayBuffer, MIME_TYPE_JPEG);

          var _parseOrientation = parseOrientation(orientation);

          rotate = _parseOrientation.rotate;
          scaleX = _parseOrientation.scaleX;
          scaleY = _parseOrientation.scaleY;
        }

        if (options.rotatable) {
          imageData.rotate = rotate;
        }

        if (options.scalable) {
          imageData.scaleX = scaleX;
          imageData.scaleY = scaleY;
        }

        this.clone();
      }
    }, {
      key: "clone",
      value: function clone() {
        var element = this.element,
            url = this.url;
        var crossOrigin = element.crossOrigin;
        var crossOriginUrl = url;

        if (this.options.checkCrossOrigin && isCrossOriginURL(url)) {
          if (!crossOrigin) {
            crossOrigin = 'anonymous';
          } // Bust cache when there is not a "crossOrigin" property (#519)


          crossOriginUrl = addTimestamp(url);
        }

        this.crossOrigin = crossOrigin;
        this.crossOriginUrl = crossOriginUrl;
        var image = document.createElement('img');

        if (crossOrigin) {
          image.crossOrigin = crossOrigin;
        }

        image.src = crossOriginUrl || url;
        image.alt = element.alt || 'The image to crop';
        this.image = image;
        image.onload = this.start.bind(this);
        image.onerror = this.stop.bind(this);
        addClass(image, CLASS_HIDE);
        element.parentNode.insertBefore(image, element.nextSibling);
      }
    }, {
      key: "start",
      value: function start() {
        var _this2 = this;

        var image = this.image;
        image.onload = null;
        image.onerror = null;
        this.sizing = true; // Match all browsers that use WebKit as the layout engine in iOS devices,
        // such as Safari for iOS, Chrome for iOS, and in-app browsers.

        var isIOSWebKit = WINDOW.navigator && /(?:iPad|iPhone|iPod).*?AppleWebKit/i.test(WINDOW.navigator.userAgent);

        var done = function done(naturalWidth, naturalHeight) {
          assign(_this2.imageData, {
            naturalWidth: naturalWidth,
            naturalHeight: naturalHeight,
            aspectRatio: naturalWidth / naturalHeight
          });
          _this2.sizing = false;
          _this2.sized = true;

          _this2.build();
        }; // Most modern browsers (excepts iOS WebKit)


        if (image.naturalWidth && !isIOSWebKit) {
          done(image.naturalWidth, image.naturalHeight);
          return;
        }

        var sizingImage = document.createElement('img');
        var body = document.body || document.documentElement;
        this.sizingImage = sizingImage;

        sizingImage.onload = function () {
          done(sizingImage.width, sizingImage.height);

          if (!isIOSWebKit) {
            body.removeChild(sizingImage);
          }
        };

        sizingImage.src = image.src; // iOS WebKit will convert the image automatically
        // with its orientation once append it into DOM (#279)

        if (!isIOSWebKit) {
          sizingImage.style.cssText = 'left:0;' + 'max-height:none!important;' + 'max-width:none!important;' + 'min-height:0!important;' + 'min-width:0!important;' + 'opacity:0;' + 'position:absolute;' + 'top:0;' + 'z-index:-1;';
          body.appendChild(sizingImage);
        }
      }
    }, {
      key: "stop",
      value: function stop() {
        var image = this.image;
        image.onload = null;
        image.onerror = null;
        image.parentNode.removeChild(image);
        this.image = null;
      }
    }, {
      key: "build",
      value: function build() {
        if (!this.sized || this.ready) {
          return;
        }

        var element = this.element,
            options = this.options,
            image = this.image; // Create cropper elements

        var container = element.parentNode;
        var template = document.createElement('div');
        template.innerHTML = TEMPLATE;
        var cropper = template.querySelector(".".concat(NAMESPACE, "-container"));
        var canvas = cropper.querySelector(".".concat(NAMESPACE, "-canvas"));
        var dragBox = cropper.querySelector(".".concat(NAMESPACE, "-drag-box"));
        var cropBox = cropper.querySelector(".".concat(NAMESPACE, "-crop-box"));
        var face = cropBox.querySelector(".".concat(NAMESPACE, "-face"));
        this.container = container;
        this.cropper = cropper;
        this.canvas = canvas;
        this.dragBox = dragBox;
        this.cropBox = cropBox;
        this.viewBox = cropper.querySelector(".".concat(NAMESPACE, "-view-box"));
        this.face = face;
        canvas.appendChild(image); // Hide the original image

        addClass(element, CLASS_HIDDEN); // Inserts the cropper after to the current image

        container.insertBefore(cropper, element.nextSibling); // Show the image if is hidden

        if (!this.isImg) {
          removeClass(image, CLASS_HIDE);
        }

        this.initPreview();
        this.bind();
        options.initialAspectRatio = Math.max(0, options.initialAspectRatio) || NaN;
        options.aspectRatio = Math.max(0, options.aspectRatio) || NaN;
        options.viewMode = Math.max(0, Math.min(3, Math.round(options.viewMode))) || 0;
        addClass(cropBox, CLASS_HIDDEN);

        if (!options.guides) {
          addClass(cropBox.getElementsByClassName("".concat(NAMESPACE, "-dashed")), CLASS_HIDDEN);
        }

        if (!options.center) {
          addClass(cropBox.getElementsByClassName("".concat(NAMESPACE, "-center")), CLASS_HIDDEN);
        }

        if (options.background) {
          addClass(cropper, "".concat(NAMESPACE, "-bg"));
        }

        if (!options.highlight) {
          addClass(face, CLASS_INVISIBLE);
        }

        if (options.cropBoxMovable) {
          addClass(face, CLASS_MOVE);
          setData(face, DATA_ACTION, ACTION_ALL);
        }

        if (!options.cropBoxResizable) {
          addClass(cropBox.getElementsByClassName("".concat(NAMESPACE, "-line")), CLASS_HIDDEN);
          addClass(cropBox.getElementsByClassName("".concat(NAMESPACE, "-point")), CLASS_HIDDEN);
        }

        this.render();
        this.ready = true;
        this.setDragMode(options.dragMode);

        if (options.autoCrop) {
          this.crop();
        }

        this.setData(options.data);

        if (isFunction(options.ready)) {
          addListener(element, EVENT_READY, options.ready, {
            once: true
          });
        }

        dispatchEvent(element, EVENT_READY);
      }
    }, {
      key: "unbuild",
      value: function unbuild() {
        if (!this.ready) {
          return;
        }

        this.ready = false;
        this.unbind();
        this.resetPreview();
        this.cropper.parentNode.removeChild(this.cropper);
        removeClass(this.element, CLASS_HIDDEN);
      }
    }, {
      key: "uncreate",
      value: function uncreate() {
        if (this.ready) {
          this.unbuild();
          this.ready = false;
          this.cropped = false;
        } else if (this.sizing) {
          this.sizingImage.onload = null;
          this.sizing = false;
          this.sized = false;
        } else if (this.reloading) {
          this.xhr.onabort = null;
          this.xhr.abort();
        } else if (this.image) {
          this.stop();
        }
      }
      /**
       * Get the no conflict cropper class.
       * @returns {Cropper} The cropper class.
       */

    }], [{
      key: "noConflict",
      value: function noConflict() {
        window.Cropper = AnotherCropper;
        return Cropper;
      }
      /**
       * Change the default options.
       * @param {Object} options - The new default options.
       */

    }, {
      key: "setDefaults",
      value: function setDefaults(options) {
        assign(DEFAULTS, isPlainObject(options) && options);
      }
    }]);

    return Cropper;
  }();

  assign(Cropper.prototype, render, preview, events, handlers, change, methods);

  return Cropper;

}));


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

/* 
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license. 
 * For full license text, see LICENSE.txt file in the repo root  or https://opensource.org/licenses/BSD-3-Clause
 */

var SDK = function (whitelistOverride, sslOverride) {

	// the custom block should verify it is being called from
	// the marketing cloud
	this._validateOrigin = function (origin) {
		// Make sure to escape periods since these strings are used in a regular expression
		var allowedDomains = whitelistOverride || ['marketingcloudapps\\.com', 'blocktester\\.herokuapp\\.com'];
		for (var i = 0; i < allowedDomains.length; i++) {
			// Makes the s optional in https
			var optionalSsl = sslOverride ? '?' : '';
			var whitelistRegex = new RegExp('^https' + optionalSsl + '://([a-zA-Z0-9-]+\\.)*' + allowedDomains[i] + '(:[0-9]+)?$', 'i');
			if (whitelistRegex.test(origin)) {
				return true;
			}
		}

		return false;
	};

	this._messageId = 1;
	this._messages = {
		0: function () {}
	};

	this._receiveMessage = function (message) {
		message = message || {};
		var data = message.data || {};
		if (data.method === 'handShake') {
			if (this._validateOrigin(data.origin)) {
				this._parentOrigin = data.origin;
				return;
			}
		}
		// if the message is not from the validated origin it gets ignored
		if (!this._parentOrigin || this._parentOrigin !== message.origin) {
			return;
		}
		// when the message has been received, we execute its callback
		(this._messages[data.id || 0] || function () {})(data.payload);
		delete this._messages[data.id];
	};

	window.addEventListener('message', this._receiveMessage.bind(this), false);

	this._postToEditor = function (payload, callback, ttl) {
		var self = this;
		// we only message up if we have
		// validated the origin
		if (!this._parentOrigin) {
			if (ttl === undefined || ttl > 0) {
				window.setTimeout(function () {
					self._postToEditor(payload, callback, (ttl || 5) - 1);
				}, 20);
			}
			return;
		}
		this._messages[this._messageId] = callback;
		payload.id = this._messageId;
		this._messageId += 1;
		// the actual postMessage always uses
		// the validated origin
		window.parent.postMessage(payload, this._parentOrigin);
	};

	this.getContent = function (cb) {
		this._postToEditor({
			method: 'getContent'
		}, cb);
	};

	this.setContent = function (content, cb) {
		this._postToEditor({
			method: 'setContent',
			payload: content
		}, cb);
	};

	this.setSuperContent = function (content, cb) {
		this._postToEditor({
			method: 'setSuperContent',
			payload: content
		}, cb);
	};

	this.getData = function (cb) {
		this._postToEditor({
			method: 'getData'
		}, cb);
	};

	this.setData = function (dataObj, cb) {
		this._postToEditor({
			method: 'setData',
			payload: dataObj
		}, cb);
	};

	this.getCentralData = function (cb) {
		this._postToEditor({
			method: 'getCentralData'
		}, cb);
	};

	this.setCentralData = function (dataObj, cb) {
		this._postToEditor({
			method: 'setCentralData',
			payload: dataObj
		}, cb);
	};

	window.parent.postMessage({
		method: 'handShake',
		origin: window.location.origin
	}, '*');
};

if (typeof(window) === 'object') {
	window.sfdc = window.sfdc || {};
	window.sfdc.BlockSDK = SDK;
}
if (true) {
	module.exports = SDK;
}


/***/ })
/******/ ]);