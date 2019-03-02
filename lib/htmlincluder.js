(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/attributes/index.js":
/*!*********************************!*\
  !*** ./src/attributes/index.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasTagAttribute = hasTagAttribute;
exports.getTagAttribute = getTagAttribute;
exports.setTagAttribute = setTagAttribute;
exports.changeTagAttributeName = changeTagAttributeName;
exports.removeTagAttribute = removeTagAttribute;
exports.addTagAttribute = addTagAttribute;
// does a tag have an attribute? (attributeName="value")
function hasTagAttribute(attr, content) {
  // strip out inner tags
  // check attribute existence
  return content.indexOf(attr + '="') > -1;
}

// get the value of an attribute (attributeName="value")
function getTagAttribute(attr, content) {
  var fndx = -1,
      lndx = -1;

  fndx = content.indexOf(attr + '="');
  if (fndx === -1) {
    console.warn("Warning: no tag of name `" + attr + "` found in the following content: `" + content + "`");
    return "";
  }

  content = content.slice(fndx + attr.length + 2);
  lndx = content.indexOf('"');
  content = content.slice(0, lndx);
  return content;
}

// set the value of an attribute (attributeName="value")
function setTagAttribute(attr, content, value) {
  var fndx = -1,
      lndx = -1,
      left = "",
      right = "";

  fndx = content.indexOf(attr + '="');
  left = content.slice(0, fndx + attr.length + 2);
  content = content.slice(fndx + attr.length + 2);
  lndx = content.indexOf('"');
  right = content.slice(lndx);
  content = left + value + right;
  return content;
}

// rename one attribute name to another (attributeName="value")
function changeTagAttributeName(attr, content, newAttr) {
  var fndx = -1,
      lndx = -1,
      left = "",
      right = "";

  fndx = content.indexOf(attr + '="');
  left = content.slice(0, fndx);
  right = content.slice(fndx + attr.length);
  return left + newAttr + right;
}

// removes an attribute from a tag along with its value (attributeName="value")
function removeTagAttribute(attr, content) {
  var fndx = -1,
      lndx = -1,
      left = "",
      right = "",
      middle = content;

  if (hasTagAttribute(attr, middle)) {
    fndx = middle.indexOf(attr + '="');
    left = middle.slice(0, fndx);
    right = middle.slice(fndx + attr.length + 2);
    // really naive for now - just look for another '"'
    lndx = right.indexOf('"');
    if (lndx === -1) {
      console.error('ERROR: No close `"` in tag ' + content);
      return content;
    } else {
      right = right.slice(lndx + 1);
      middle = "";
    }
  }
  return left + middle + right;
}

// adds an attribute from a tag along with a value (attributeName="value")
function addTagAttribute(attr, content, value) {
  var fndx = -1,
      lndx = -1,
      left = "",
      right = "",
      middle = content;

  lndx = middle.indexOf(" ");
  if (lndx > -1) {
    left = middle.slice(0, lndx);
    right = middle.slice(lndx);
    middle = ' ' + attr + '="' + value + '"';
  }

  return left + middle + right;
}

/***/ }),

/***/ "./src/config.js":
/*!***********************!*\
  !*** ./src/config.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var wrapFiles = exports.wrapFiles = {};
var insertFiles = exports.insertFiles = {};
var pageFiles = exports.pageFiles = [];

var options = exports.options = {};
var devOptions = exports.devOptions = {};
var insertPattern = exports.insertPattern = void 0;
var filePathAttribute = exports.filePathAttribute = void 0;
var jsonPathAttribute = exports.jsonPathAttribute = void 0;

var configureFiles = exports.configureFiles = function configureFiles(file) {
  if (file.name[0] === '_') wrapFiles[file.path] = file;else if (file.name[0] === '-') insertFiles[file.path] = file;else pageFiles.push(file);
};

// @options = (optional) options for configuring htmlIncluder
// options.jsonInput         = A json object used to populate data in files
// options.insertPattern     = The test looked for in order to insert files
//          (this is so ssi includes can be used instead)
// options.filePathAttribute = the name used for the file pathing for #insert
//          and #wrap (default= 'path')
// options.jsonPathAttribute = the name used for the file pathing for #insert
//          , #wrap, #data, #jsonInsert (default= 'jsonPath')
//
//
// options.dev.limitIterations = the number of times processFileWithJsonInput will loop
// options.dev.printIterations = console log each processFileWithJsonInput loop
// options.dev.printResult = console logs the final output
// options.dev.printPaths = console logs the output of buildPathFromRelativePath
var setOptions = exports.setOptions = function setOptions(ops) {
  exports.devOptions = devOptions = ops.dev || {};
  exports.options = options = ops;

  //set text value for insert tags, or default
  exports.insertPattern = insertPattern = options.insertPattern ? '<!--#' + options.insertPattern : '<!--#insert';

  exports.filePathAttribute = filePathAttribute = options.filePathAttribute ? options.filePathAttribute : 'path';

  exports.jsonPathAttribute = jsonPathAttribute = options.jsonPathAttribute ? options.jsonPathAttribute : 'jsonPath';
};

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _clip = __webpack_require__(/*! ./tags/clip */ "./src/tags/clip.js");

var _clip2 = _interopRequireDefault(_clip);

var _tags = __webpack_require__(/*! ./tags */ "./src/tags/index.js");

var _tags2 = _interopRequireDefault(_tags);

var _config = __webpack_require__(/*! ./config */ "./src/config.js");

var _file = __webpack_require__(/*! ./util/file */ "./src/util/file.js");

var _parse = __webpack_require__(/*! ./parse */ "./src/parse/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  initialize: function initialize(options) {
    return (0, _config.setOptions)(options);
  },
  // puts files into hash maps
  hashFile: function hashFile(file) {
    var f = (0, _file.File)(file);

    // removing clip right away does no damage and speeds up later processing
    (0, _clip2.default)(f);

    (0, _config.configureFiles)(f);
  },
  // builds string
  buildFileResult: function buildFileResult(callback) {
    return _config.pageFiles.map(function (file) {
      var AST = (0, _parse.buildAST)(file, _config.options.jsonInput || {});

      file.content = (0, _tags2.default)(file.content, file.path, _config.options.jsonInput || {});

      // When an unknown tag is found it is changed to <!--!unknwn-tag# so that it doesn't
      // continually get found. This will undo those changes
      file.content = file.content.replace(/<!--!unknwn-tag#/g, '<!--#');
      file.processed = true;

      if (callback) callback(file);

      return file;
    });
  }
};

/***/ }),

/***/ "./src/json/index.js":
/*!***************************!*\
  !*** ./src/json/index.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.toSafeJsonString = toSafeJsonString;
exports.processRawJson = processRawJson;
exports.appendJsonParentPath = appendJsonParentPath;
exports.addRawJsonWhereJsonPath = addRawJsonWhereJsonPath;

var _parsing = __webpack_require__(/*! ../util/parsing */ "./src/util/parsing.js");

var _attributes = __webpack_require__(/*! ../attributes */ "./src/attributes/index.js");

var _config = __webpack_require__(/*! ../config */ "./src/config.js");

// given a jsonObj, we can convert it to a string for our purposes
function toSafeJsonString(jsonObj) {
  return JSON.stringify(jsonObj).replace(/\'/g, "\\'").replace(/"/g, "'");
}

// Handles the string value inside of rawJson="" attributes
function processRawJson(jsonString) {
  var jsonData = {};

  if ((typeof jsonString === 'undefined' ? 'undefined' : _typeof(jsonString)) === 'object') jsonString = toSafeJsonString(jsonString);

  try {
    eval('jsonData = ' + jsonString);
  } catch (e) {
    console.error('ERROR: Poorly formatted rawJson string: ' + jsonString + '\n\n This must be valid JavaScript.');
  }

  return jsonData;
}

// add json paths together
function appendJsonParentPath(content, jsonParentPath) {
  var fndx = -1,
      lndx = -1,
      left = "",
      right = "";

  // do nothing if there is no jsonParentPath
  if (jsonParentPath === '' || jsonParentPath === 'this') return content;

  content = (0, _parsing.splitContent)(content, '<!--#data'); // '' => ['']

  // if we have an array larger than 1, then there is at least 1 insert to be made
  if (content.length > 1) {

    // process files
    content = content.map(function (fragment, ndx, arr) {
      if (fragment.indexOf('<!--#data') === 0) {
        fndx = fragment.indexOf(_config.jsonPathAttribute + '="');
        if (fndx > -1) {
          left = fragment.slice(0, fndx + 10);
          fragment = left + jsonParentPath + '.' + fragment.slice(fndx + 10);
        } else {
          console.error("ERROR: '<!--#data' tag with no 'jsonPath'");
        }
      }
      return fragment;
    });
  }
  // re-join content into a string
  content = content.join(''); // [''] => ''
  return content;
}

// splits up content into tags and puts rawJson in (if there isn't already a rawJson)
function addRawJsonWhereJsonPath(content, rawJson, jsonParentPath) {
  var fndx = -1,
      lndx = -1,
      left = "",
      right = "";

  // if we have a parent path, then we need to grab a subset of the rawJson
  if (jsonParentPath && rawJson) {
    var data = processRawJson(rawJson);
    rawJson = (0, _parsing.getDataFromJsonPath)(jsonParentPath, data);
  }

  content = bluntDataTagsInEaches(content);

  content = (0, _parsing.splitContent)(content); // '' => ['']

  // if we have an array larger than 1, then there is at least 1 insert to be made
  if (content.length > 1) {

    // process files
    content = content.map(function (fragment, ndx, arr) {
      if (fragment.indexOf('<!--#') === 0 && (0, _attributes.hasTagAttribute)(_config.jsonPathAttribute, fragment) && !(0, _attributes.hasTagAttribute)("rawJson", fragment)) {
        fragment = (0, _attributes.addTagAttribute)("rawJson", fragment, rawJson);
      }
      return fragment;
    });
  }
  // re-join content into a string
  content = content.join(''); // [''] => ''

  content = unbluntDataTagsInEaches(content);
  return content;
}

function bluntDataTagsInEaches(content) {
  var arr = (0, _parsing.splitContent)(content);
  var eachLevel = 0;

  content = arr.map(function (fragment, ndx, arr) {
    if (fragment.indexOf('<!--#each') === 0) eachLevel++;
    if (fragment.indexOf('<!--#endeach') === 0) eachLevel--;
    if (fragment.indexOf('<!--#data') === 0 && eachLevel > 0) fragment = fragment.replace('<!--#data', '<!--@#data');
    return fragment;
  }).join('');

  if (eachLevel > 0) console.error('Error: Mismatched number of each and endeach tags');

  return content;
}

function unbluntDataTagsInEaches(content) {
  content = content.replace(/<!--@#data/g, '<!--#data');
  return content;
}

/***/ }),

/***/ "./src/parse/index.js":
/*!****************************!*\
  !*** ./src/parse/index.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildAST = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _parsing = __webpack_require__(/*! ../util/parsing */ "./src/util/parsing.js");

var _attributes = __webpack_require__(/*! ../attributes */ "./src/attributes/index.js");

var _json = __webpack_require__(/*! ../json */ "./src/json/index.js");

var _file = __webpack_require__(/*! ../util/file */ "./src/util/file.js");

var _config = __webpack_require__(/*! ../config */ "./src/config.js");

/*

  string           - unparsed file
  object           - node
  array of objects - node list

  1) convert a file (string) to a node
  2) process the node
    1) parse contents of node into a list of content and tags - both strings
    2) resolve nested tags
      - treat the string contents of a tag as a file
    3) resolve tags to string
      - each tag has its own process of being resolved
  3) build string result by combining all child tags contents

 */

// const insertFiles = { '/Users/erik/projects/gulp-htmlincluder/test/html/components/-base-component.html':
//    { name: '-base-component.html',
//      path:
//       '/Users/erik/projects/gulp-htmlincluder/test/html/components/-base-component.html',
//      content:
//       '<div>\n  This is a base component that may inherit something\n  <!--#data jsonPath="inheritedProperty" default="" -->\n</div>',
//      processed: false,
//      file: {
//         cwd: '/Users/erik/projects/gulp-htmlincluder',
//         base:
//          '/Users/erik/projects/gulp-htmlincluder/test/html/components/',
//         },
//       },
//   '/Users/erik/projects/gulp-htmlincluder/test/html/components/-customized-component.html':
//    { name: '-customized-component.html',
//      path:
//       '/Users/erik/projects/gulp-htmlincluder/test/html/components/-customized-component.html',
//      content:
//       `<!--#insert\n  path="./-base-component.html"\n  rawJson="{\n    inheritedProperty: '<!--#data jsonPath="message" default="" -->',\n  }"\n-->`,
//      processed: false,
//      file: {
//         cwd: '/Users/erik/projects/gulp-htmlincluder',
//         base:
//          '/Users/erik/projects/gulp-htmlincluder/test/html/components/',
//         },
//       },
//   '/Users/erik/projects/gulp-htmlincluder/test/html/components/-list.html':
//    { name: '-list.html',
//      path:
//       '/Users/erik/projects/gulp-htmlincluder/test/html/components/-list.html',
//      content:
//       '<!--#each jsonPath="members" -->\n  <div>Name: <!--#data jsonPath="name" --></div>\n<!--#endeach -->',
//      processed: false,
//      file: {
//         cwd: '/Users/erik/projects/gulp-htmlincluder',
//         base:
//          '/Users/erik/projects/gulp-htmlincluder/test/html/components/',
//         },
//       },
//   '/Users/erik/projects/gulp-htmlincluder/test/html/components/-tab-collection.html':
//    { name: '-tab-collection.html',
//      path:
//       '/Users/erik/projects/gulp-htmlincluder/test/html/components/-tab-collection.html',
//      content:
//       '<div class="tab-collection <!--#data jsonPath="className" -->">\n  <div class="tab-collection__tabs">\n    <!--#each jsonPath="tabs" -->\n      <div class="tabs__tab <!--#data jsonPath="className" -->" data-tab-id="<!--#data jsonPath="tabId" -->">\n        <!--#data jsonPath="displayName" -->\n      </div>\n    <!--#endeach -->\n  </div>\n  <div class="tab-collection__contents">\n    <!--#each jsonPath="tabs" -->\n    <div class="contents__container" data-tab-id="<!--#data jsonPath="tabId" -->">\n      <!--#insert path="<!--#data jsonPath="filePath" -->" -->\n    </div>\n    <!--#endeach -->\n  </div>\n</div>',
//      processed: false,
//      file: {
//         cwd: '/Users/erik/projects/gulp-htmlincluder',
//         base:
//          '/Users/erik/projects/gulp-htmlincluder/test/html/components/',
//         },
//       },
//   '/Users/erik/projects/gulp-htmlincluder/test/html/components/-text-insert.html':
//    { name: '-text-insert.html',
//      path:
//       '/Users/erik/projects/gulp-htmlincluder/test/html/components/-text-insert.html',
//      content:
//       'This is just a simple block of text inserted from -test-insert.html',
//      processed: false,
//      file: {
//         cwd: '/Users/erik/projects/gulp-htmlincluder',
//         base:
//          '/Users/erik/projects/gulp-htmlincluder/test/html/components/',
//         },
//       },
//   '/Users/erik/projects/gulp-htmlincluder/test/html/components/-with-json.html':
//    { name: '-with-json.html',
//      path:
//       '/Users/erik/projects/gulp-htmlincluder/test/html/components/-with-json.html',
//      content: '<!--#data jsonPath="text" default="hello world!" -->',
//      processed: false,
//      file: {
//         cwd: '/Users/erik/projects/gulp-htmlincluder',
//         base:
//          '/Users/erik/projects/gulp-htmlincluder/test/html/components/',
//          } }
// };

// const wrapFiles = { '/Users/erik/projects/gulp-htmlincluder/test/html/wrappers/_simple.html':
//    { name: '_simple.html',
//      path:
//       '/Users/erik/projects/gulp-htmlincluder/test/html/wrappers/_simple.html',
//      content:
//       '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Simple Wrapper</title>\n</head>\n<body>\n  <!--#middle -->\n</body>\n</html>',
//      processed: false,
//      file: {
//         cwd: '/Users/erik/projects/gulp-htmlincluder',
//         base: '/Users/erik/projects/gulp-htmlincluder/test/html/wrappers/',
//         },
//       },
//   '/Users/erik/projects/gulp-htmlincluder/test/html/wrappers/_with-json.html':
//    { name: '_with-json.html',
//      path:
//       '/Users/erik/projects/gulp-htmlincluder/test/html/wrappers/_with-json.html',
//      content:
//       '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title><!--#data jsonPath="title" default="Wrapper With JSON" --></title>\n</head>\n<body>\n  <!--#middle -->\n</body>\n</html>',
//      processed: false,
//      file: {
//         cwd: '/Users/erik/projects/gulp-htmlincluder',
//         base: '/Users/erik/projects/gulp-htmlincluder/test/html/wrappers/',
//          }
//        },
// };

// const fakeFile = {
//   name: 'simple.html',
//   path: '/Users/erik/projects/gulp-htmlincluder/test/html/simple.html',
//   content: `<!--#wrap path="./wrappers/_simple.html" -->\n  This is a simple file with a wrap and some inserts\n  <!--#data\n    jsonPath="<!--#jsonInsert jsonPath="hello" default="jarl" -->"\n    rawJson="{jarl : 'hello world'}"\n    default="jarlsense"\n  -->\n  <!--#insert path="./components/-text-insert.html" -->\n<!--#endwrap -->`,
//   processed: false,
//   file: {}
// }

// const fakeJson = {};

// shape of our AST nodes
var defaultNode = {
  type: '',
  file: {},
  originalContent: '',
  content: '',
  parent: {},
  children: [], // list of sequential nodes wrapped in tag (or at topNode)
  processed: false,
  nestedNodes: [], // nested tags - these need to be resolved before this tag is resolved
  attributes: {}, // attributes on tag
  innerScope: {},
  jsonPath: '',
  json: {} // json values used for this tag
};

// entry point for processing files
var buildAST = exports.buildAST = function buildAST(file, json, parentNode) {

  // convert string into object
  var topNode = _extends({}, defaultNode, {
    type: 'topNode',
    file: file,
    originalContent: file.content,
    content: file.content
  }, parentNode ? { parent: parentNode } : {});

  // process children of the node
  processNode(topNode, json);

  console.log('==================================');
  console.log(topNode.content);

  return topNode;
};

//
var processNode = function processNode(node, json) {
  if (node.processed) return;
  console.log('processNode: type = ', node.type);

  // the contents of a node may contain more nested nodes
  // break these up into an array of mixed textContent nodes and tags
  var contentArr = (0, _parsing.splitContent)(node.content).filter(function (c) {
    return c !== '';
  });

  // convert array of strings to nodes
  node.nestedNodes = contentArr[0] !== node.content ? buildNodes(node, contentArr, json) : [];

  resolveNode(node, json);
};

//
var buildNodes = function buildNodes(parent, contentArr, json, closeTag) {
  var nodes = [];

  while (contentArr.length > 0) {
    var content = contentArr.shift();

    // if we find the close tag, then close this
    if (closeTag && content.indexOf(closeTag) === 0) return nodes;

    // lookup type of the tag
    var type = findNodeType(content);

    var node = _extends({}, defaultNode, {
      type: type,
      parent: parent,
      file: parent.file,
      originalContent: content,
      content: content
    });

    // if this is a text node, we're set
    if (type === 'textContent') {
      node.processed = true;
      nodes.push(node);
      continue;
    }

    // remove leading character ('<') so the inner contents can be parsed properly
    node.content = node.originalContent.slice(1);

    // the contents inside a node can be treated like new little documents

    // if this is a node that has children build them up, removing them
    // from the split up array
    node.children = type === 'wrap' ? buildNodes(node, contentArr, json, '<!--#endwrap') : type === 'each' ? buildNodes(node, contentArr, json, '<!--#endeach') : type === 'if' ? buildNodes(node, contentArr, json, '<!--#endif') : [];

    nodes.push(node);
  }

  return nodes;
};

//
var resolveNode = function resolveNode(node, json) {
  if (node.type === 'textContent') return;

  // resolve nested tags
  if (node.nestedNodes.length > 0) {
    node.nestedNodes.forEach(function (node) {
      return processNode(node, json);
    });
    node.content = joinContent(node.nestedNodes);
  }

  // load and resolve attribute values
  loadNodeAttributes(node);

  // process node so that content is resolved
  var processor = nodeProcessors[node.type] || function () {};
  processor(node, json);

  node.processed = true;
};

// loads values for tags into node object
var loadNodeAttributes = function loadNodeAttributes(node) {
  var attrs = nodeAttributes[node.type] || [];
  attrs.forEach(function (attr) {
    if ((0, _attributes.hasTagAttribute)(attr, node.content)) {
      var value = (0, _attributes.getTagAttribute)(attr, node.content);
      node.attributes[attr] = attr === 'rawJson' ? (0, _json.processRawJson)(value) : value;
    }
  });
};

// check for tag and return node type
var findNodeType = function findNodeType(content) {
  return content.indexOf('<!--#insert') === 0 ? 'insert' : content.indexOf('<!--#data') === 0 ? 'data' : content.indexOf('<!--#jsonInsert') === 0 ? 'jsonInsert' : content.indexOf('<!--#wrap') === 0 ? 'wrap' : content.indexOf('<!--#middle') === 0 ? 'middle' : content.indexOf('<!--#each') === 0 ? 'each' : content.indexOf('<!--#if') === 0 ? 'if' : 'textContent';
};

var joinContent = function joinContent(nodeList) {
  return nodeList.map(function (c) {
    return c.content;
  }).join('');
};

// the functions that processes each node
// these assume that they have all their nested nodes resolved and attributes loaded
var nodeProcessors = {
  //
  topNode: function topNode(node, json) {
    node.content = joinContent(node.nestedNodes);
  },
  //
  textContent: function textContent(node, json) {
    console.warn('WARNING: Why are we processing a textContent?');
  },
  //
  insert: function insert(node, json) {
    console.log('processing insert');
    var file = node.file;
    var _node$attributes = node.attributes,
        path = _node$attributes.path,
        jsonPath = _node$attributes.jsonPath,
        rawJson = _node$attributes.rawJson;

    if (!path) {
      console.warn('WARNING while processing file \'' + file.path + '\': insert tag with no path attribute');
      node.content = '';
      return;
    }
    // set scope for inserted file
    node.innerScope = jsonPath ? getDataFromJsonPath(jsonPath, json) : rawJson ? rawJson : {};

    // get filename for inserted file
    var filename = (0, _file.buildPathFromRelativePath)(file.path, path);

    // see if file we are loading exists
    if (!_config.insertFiles[filename]) {
      console.warn('WARNING while processing file \'' + file.path + '\': insert file \'' + filename + '\' does not exist');
      node.content = '';
      return;
    }

    // load contents from file
    node.content = _config.insertFiles[filename].content;
    node.type = 'top-node';

    // process contents to get children
    processNode(node, json);
  },
  //
  wrap: function wrap(node, json) {
    console.log('processing wrap');
    var file = node.file;
    var _node$attributes2 = node.attributes,
        path = _node$attributes2.path,
        jsonPath = _node$attributes2.jsonPath,
        rawJson = _node$attributes2.rawJson;

    if (!path) {
      console.warn('WARNING while processing file \'' + file.path + '\': wrap tag with no path attribute');
      node.content = '';
      return;
    }

    // set scope for inserted file
    node.innerScope = jsonPath ? getDataFromJsonPath(jsonPath, json) : rawJson ? rawJson : {};

    // get filename for inserted file
    var filename = (0, _file.buildPathFromRelativePath)(file.path, path);

    // see if file we are loading exists
    if (!_config.wrapFiles[filename]) {
      console.warn('WARNING while processing file \'' + file.path + '\': wrap file \'' + filename + '\' does not exist');
      node.content = '';
      return;
    }

    // we need to process the children before we bring in the file

    // handle children content
    node.children.forEach(function (childNode) {
      return processNode(childNode, json);
    });
    node.content = joinContent(node.children);
    console.log(node.content);

    // load contents from file
    var wrapFile = _config.wrapFiles[filename];
    var wrapNode = buildAST(wrapFile, json, node);

    // process contents to get children
    node.content = wrapNode.content;
  },
  //
  middle: function middle(node, json) {
    console.log('processing middle');
    node.content = node.parent.parent.content;
  },
  data: function data(node, json) {
    console.log('processing data');
    var _node$attributes3 = node.attributes,
        jsonPath = _node$attributes3.jsonPath,
        rawJson = _node$attributes3.rawJson;

    var defaultVal = node.attributes.default;
    if (!rawJson || !jsonPath) {
      node.content = '';
      return;
    }
    var data = getDataFromJsonPath(jsonPath, rawJson);
    node.content = data || defaultVal || '';
  },
  jsonInsert: function jsonInsert(node, json) {
    console.log('processing jsonInsert');
    var jsonPath = node.attributes.jsonPath;

    var defaultVal = node.attributes.default;
    if (!jsonPath) {
      node.content = '';
      return;
    }
    var data = getDataFromJsonPath(jsonPath, json);
    node.content = data || defaultVal || '';
  },
  each: function each(node, json) {
    console.log('processing each');
  },
  if: function _if(node, json) {
    console.log('processing if');
  }

  // the legal attributes for each element
};var nodeAttributes = {
  insert: ['path', 'jsonPath', 'rawJson'],
  data: ['jsonPath', 'rawJson', 'default'],
  jsonInsert: ['jsonPath', 'default'],
  wrap: ['path', 'jsonPath', 'rawJson'],
  middle: [],
  each: ['count', 'jsonPath', 'rawJson'],
  if: ['jsonPath', 'rawJson'],
  textContent: []

  // given a jsonObject and a path, return the data pointed at
};var getDataFromJsonPath = function getDataFromJsonPath(jsonPath, json) {
  if (jsonPath === 'this') return json;

  var result = jsonPath.split('.').reduce(function (acc, cur) {
    return acc ? acc[cur] : '';
  }, json);

  if (!Array.isArray(result) && (typeof result === 'undefined' ? 'undefined' : _typeof(result)) === 'object') result = toSafeJsonString(result);

  return result;
};

//
var toSafeJsonString = function toSafeJsonString(jsonObj) {
  return JSON.stringify(jsonObj).replace(/\'/g, "\\'").replace(/"/g, "'");
};

/***/ }),

/***/ "./src/tags/clip.js":
/*!**************************!*\
  !*** ./src/tags/clip.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = processClip;
// <!--#clipbefore -->
// <!--#clipafter -->
// <!--#clipbetween -->
// <!--#endclipbetween -->
// This runs first, since all of the clipped areas will completely be removed
function processClip(file) {
  var tmp;

  if (file.content.indexOf('<!--#clipbefore') > -1) {

    file.content = file.content.split(/<!--#clipbefore\s*-->/).splice(1)[0].split('<!--#clipafter').splice(0, 1)[0];
  }

  if (file.content.indexOf('<!--#clipbetween') > -1) {

    tmp = file.content.split(/<!--#clipbetween\s*-->/);

    file.content = tmp[0] + tmp[1].split(/<!--#endclipbetween\s*-->/)[1];
  }
}

/***/ }),

/***/ "./src/tags/data.js":
/*!**************************!*\
  !*** ./src/tags/data.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = processDataTag;

var _attributes = __webpack_require__(/*! ../attributes */ "./src/attributes/index.js");

var _json = __webpack_require__(/*! ../json */ "./src/json/index.js");

var _parsing = __webpack_require__(/*! ../util/parsing */ "./src/util/parsing.js");

var _config = __webpack_require__(/*! ../config */ "./src/config.js");

// <!--#data jsonPath="" default="" -->
function processDataTag(tag, jsonContext) {
  var jsonPath = "",
      rawJson = "",
      defaultValue = "",
      jsonData = "";

  jsonPath = (0, _attributes.getTagAttribute)(_config.jsonPathAttribute, tag);

  if ((0, _attributes.hasTagAttribute)("default", tag)) defaultValue = (0, _attributes.getTagAttribute)('default', tag);

  if ((0, _attributes.hasTagAttribute)('rawJson', tag)) {
    rawJson = (0, _attributes.getTagAttribute)('rawJson', tag);
    rawJson = (0, _json.processRawJson)(rawJson);
  } else if (jsonContext) rawJson = (0, _json.processRawJson)(jsonContext);

  jsonData = (0, _parsing.getDataFromJsonPath)(jsonPath, rawJson);
  var result = jsonData || defaultValue;

  return typeof result === 'string' ? result : JSON.stringify(result).replace(/"/g, "'");
}

/***/ }),

/***/ "./src/tags/each.js":
/*!**************************!*\
  !*** ./src/tags/each.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = processEach;

var _attributes = __webpack_require__(/*! ../attributes */ "./src/attributes/index.js");

var _json = __webpack_require__(/*! ../json */ "./src/json/index.js");

var _parsing = __webpack_require__(/*! ../util/parsing */ "./src/util/parsing.js");

var _config = __webpack_require__(/*! ../config */ "./src/config.js");

// <!--#each count="" jsonPath="" rawJson="" -->
// <!--#endeach -->
function processEach(file, ndx, arr, jsonContext) {
  var endNdx = -1,
      startNdx = ndx + 1,
      content = arr[ndx],
      jsonPath = '',
      rawJson = '',
      jsonData = '',
      count = false;

  // find the closing tag for this each
  endNdx = (0, _parsing.findIndexOfClosingTag)('<!--#each', '<!--#endeach', ndx, arr);

  // If we have no closing tag, then this is an error
  if (endNdx === -1) {
    console.error("ERROR: in file " + file.path + ": <!--#each --> with no <!--#endeach -->");
    return;
  }

  // Maybe don't allow empty each tags
  if (endNdx === ndx - 1) console.warn("WARNING: in file " + file.path + ": <!--#each --> with no content");

  // look up the jsonPath used for this
  if ((0, _attributes.hasTagAttribute)(_config.jsonPathAttribute, content)) jsonPath = (0, _attributes.getTagAttribute)(_config.jsonPathAttribute, content);

  // see if there is rawJson on this, or get the jsonContext intead
  if ((0, _attributes.hasTagAttribute)('rawJson', content)) {
    rawJson = (0, _attributes.getTagAttribute)('rawJson', content);
    rawJson = (0, _json.processRawJson)(rawJson);
  } else if (jsonContext) rawJson = (0, _json.processRawJson)(jsonContext);

  // if we have a path to look up data with, then use it
  if (jsonPath) jsonData = (0, _parsing.getDataFromJsonPath)(jsonPath, rawJson);

  // see if there is a hard coded loop count
  if ((0, _attributes.hasTagAttribute)('count', content)) count = parseInt((0, _attributes.getTagAttribute)('count', content), 10);

  // Check if the jsonData is an array, if it is we should use it for the count
  if (Array.isArray(jsonData)) {
    // if we don't have a count, set it to length,
    // else we will constrain how many items we will loop on
    if (!count) count = jsonData.length;else if (count > jsonData.length) {
      console.warn("WARNING: in file " + file.path + ": <!--#each --> with count attribute higher than array input's length. Changing to length of array");
      count = jsonData.length;
    }
  }

  // If there is no count and no jsonPath, then there is probably something forgotten
  if (!count && !jsonPath) {
    console.error("ERROR: in file " + file.path + ": <!--#each --> with no count attribute, and no array as json object.");
    return;
  }

  ///
  /// At this point we have the start and end indexes, and the data we are using
  /// to render the content between the statements.
  ///
  /// The strategy used is to get this content, and then to duplicate it as many
  /// times as the count. The content is all now within an array that replaces
  /// everything from the current index to the index of the ending each tag.
  ///

  // clear end tag
  arr[ndx] = '';
  arr[endNdx] = '';

  var middleMaster = arr.splice(startNdx, endNdx - startNdx).join('');

  content = [];

  // create all the duplicates of the data with the proper inserted data
  for (var i = 0; i < count; i++) {
    if (jsonData) content.push([jsonData[i], middleMaster]);else content.push(middleMaster);
  } // cut out original each, and replace with array
  arr.splice(ndx, 2, content);
}

/***/ }),

/***/ "./src/tags/if.js":
/*!************************!*\
  !*** ./src/tags/if.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = processIf;

var _attributes = __webpack_require__(/*! ../attributes */ "./src/attributes/index.js");

var _json = __webpack_require__(/*! ../json */ "./src/json/index.js");

var _parsing = __webpack_require__(/*! ../util/parsing */ "./src/util/parsing.js");

var _config = __webpack_require__(/*! ../config */ "./src/config.js");

// <!--#if jsonPath="" rawJson="" -->
// <!--#endif -->
function processIf(file, ndx, arr, jsonContext) {
  var endNdx = -1,
      content = arr[ndx],
      rawJson = "",
      jsonPath = "",
      jsonData = void 0;

  if ((0, _attributes.hasTagAttribute)(_config.jsonPathAttribute, content)) jsonPath = (0, _attributes.getTagAttribute)(_config.jsonPathAttribute, content);

  if ((0, _attributes.hasTagAttribute)('rawJson', content)) {
    rawJson = (0, _attributes.getTagAttribute)('rawJson', content);
    rawJson = (0, _json.processRawJson)(rawJson);
  } else if (jsonContext) rawJson = (0, _json.processRawJson)(jsonContext);

  jsonData = (0, _parsing.getDataFromJsonPath)(jsonPath, rawJson);

  // clear if statement
  arr[ndx] = "";

  endNdx = (0, _parsing.findIndexOfClosingTag)('<!--#if', '<!--#endif', ndx, arr);

  // If we have no closing tag, then this is an error
  if (endNdx === -1) {
    console.error("ERROR: in file " + file.path + ": <!--#if . . . --> with no <!--#endif . . . -->");
    return;
  }

  // clear endif statement
  arr[endNdx] = "";

  // If there is no jsonPath we have no way to check the data ...
  if (!jsonPath) {
    console.error("ERROR: in file " + file.path + ": <!--#if --> with no jsonPath");
    return;
  }

  // if undefined jsonData or false, then we eliminate the section
  if (typeof jsonData === 'undefined' || jsonData == false) arr.splice(ndx, endNdx - ndx);
}

/***/ }),

/***/ "./src/tags/index.js":
/*!***************************!*\
  !*** ./src/tags/index.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// all the different tags we are going to process


exports.default = processContent;

var _parsing = __webpack_require__(/*! ../util/parsing */ "./src/util/parsing.js");

var _file = __webpack_require__(/*! ../util/file */ "./src/util/file.js");

var _attributes = __webpack_require__(/*! ../attributes */ "./src/attributes/index.js");

var _json = __webpack_require__(/*! ../json */ "./src/json/index.js");

var _data = __webpack_require__(/*! ./data */ "./src/tags/data.js");

var _data2 = _interopRequireDefault(_data);

var _each = __webpack_require__(/*! ./each */ "./src/tags/each.js");

var _each2 = _interopRequireDefault(_each);

var _if = __webpack_require__(/*! ./if */ "./src/tags/if.js");

var _if2 = _interopRequireDefault(_if);

var _insert = __webpack_require__(/*! ./insert */ "./src/tags/insert.js");

var _insert2 = _interopRequireDefault(_insert);

var _jsonInsert = __webpack_require__(/*! ./jsonInsert */ "./src/tags/jsonInsert.js");

var _jsonInsert2 = _interopRequireDefault(_jsonInsert);

var _wrap = __webpack_require__(/*! ./wrap */ "./src/tags/wrap.js");

var _wrap2 = _interopRequireDefault(_wrap);

var _config = __webpack_require__(/*! ../config */ "./src/config.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Recursive function that does the major systematic work of htmlincluder
 *
 * 1) split content into an array of tags and non-tags
 * 2) if there are any tags (array.length > 1) loop until the parsing is finished
 *
 * @param  {String} content The text that we are processing the tags of
 * @param  {String} path    The current file path
 * @return {String}         The content, now parsed and with all tags replaces
 */
function processContent(content, path, jsonContext) {
  var splitArr = [];
  var itterCount = 0;

  // create a tmp version of content to see if we actually do any work on it
  var contentBeforeProcessing = content;

  // prime loop: split content into all insertion points
  splitArr = (0, _parsing.splitContent)(content); // '' => ['']

  // if we have an array larger than 1, then there is at least 1 insert to be made
  while (splitArr.length > 1) {

    splitArr = processSplitArray(splitArr, path, jsonContext);

    // At this point we should have a mix of strings and arrays
    // We need to loop through again and process each of the arrays

    // re-join content into a string, and repeat
    content = splitArr.join(''); // [''] => ''

    // We split the string, so there should have been work. Was there?
    if (content === contentBeforeProcessing) {
      console.error('Content was split, but no change was made in it: ' + content);
      console.error('Something in your tagging may be making it impossible to process correctly');
      console.error('Returning the content without further processing');
      return content;
    }

    // split file into all insertion points
    splitArr = (0, _parsing.splitContent)(content); // '' => ['']

    // debug features
    if (_config.devOptions.printIterations) console.log(content);

    if (_config.devOptions.limitIterations) {
      itterCount++;
      if (itterCount >= _config.devOptions.limitIterations) break;
    }
  }

  if (_config.devOptions.printResult) console.log(content);

  return content;
}

/**
 * Loops through split content. For each tag, it makes a call back up to
 * processContent in order to take care of any inner tags.
 *
 * Once there are no more inner tags, we look at the tag, and depending on its
 * kind, we run a different tag processor on it.
 *
 * @param  {Array}  splitArr    The array of split up tags
 * @param  {String} path        The file path we are currently using for relative paths
 * @param  {Object} jsonContext The json data consumable by tags in this context
 * @return {Array}              The array, having made one pass to process it
 */
function processSplitArray(splitArr, path, jsonContext) {
  var tempDirectory = void 0;
  var pathStack = path;
  // iterate through content
  for (var i = 0; i < splitArr.length; i++) {
    var fragment = splitArr[i];

    if (fragment.indexOf('<!--#') === 0) {
      // process any tags inside of this tag
      fragment = '<' + processContent(fragment.substr(0, fragment.length - 1).substr(1), path, jsonContext) + '>';

      //
      // At this point we can assume that the tag we are working with has no
      // embedded tags.
      //

      // See if this has a file path, or absolute file path. If we don't have
      // an absolute path, then we need to build one.
      var hasPath = (0, _attributes.hasTagAttribute)(_config.filePathAttribute, fragment);
      var hasAbsPath = (0, _attributes.hasTagAttribute)("absPath", fragment);

      // get or build paths
      if (hasPath) tempDirectory = (0, _file.buildPathFromRelativePath)(pathStack, (0, _attributes.getTagAttribute)(_config.filePathAttribute, fragment));else if (hasAbsPath) {
        tempDirectory = (0, _attributes.getTagAttribute)("absPath", fragment);
        pathStack = tempDirectory;
      }

      var curFile = {
        content: fragment,
        path: pathStack,
        tmpPath: tempDirectory
      };

      // handle loading each particular kind of tag
      if (fragment.indexOf('<!--#data') === 0) {
        splitArr[i] = (0, _data2.default)(fragment, jsonContext);
      } else if (fragment.indexOf('<!--#jsonInsert') === 0) {
        splitArr[i] = (0, _jsonInsert2.default)(fragment);
      } else if (fragment.indexOf(_config.insertPattern) === 0) {
        var fileInfo = (0, _insert2.default)(curFile, jsonContext);
        splitArr[i] = flattenInsertedContent(fileInfo);
      } else if (fragment.indexOf('<!--#wrap') === 0) {
        var _processWraps = (0, _wrap2.default)(curFile, i, splitArr, jsonContext),
            _processWraps2 = _slicedToArray(_processWraps, 2),
            openNdx = _processWraps2[0],
            closeNdx = _processWraps2[1];

        splitArr[openNdx] = flattenInsertedContent(splitArr[openNdx]);
        splitArr[closeNdx] = flattenInsertedContent(splitArr[closeNdx]);
      } else if (fragment.indexOf('<!--#if') === 0) {
        (0, _if2.default)(curFile, i, splitArr, jsonContext);
      } else if (fragment.indexOf('<!--#each') === 0) {
        (0, _each2.default)(curFile, i, splitArr, jsonContext);
        splitArr[i] = flattenEach(splitArr[i], pathStack);
      } else {
        console.error('An unidentified tag is being used: ' + fragment);
        splitArr[i] = fragment.replace('<!--#', '<!--!unknwn-tag#');
      }

      pathStack = path;
    }
  }

  return splitArr;
}

/**
 * The result of each tags produce an array that lumps together the expanded
 * content between the two tags.
 *
 * It does this by running through the array, and if data is needed, it runs
 * it through processContent. Otherwise it simply adds it to a string.
 *
 * @param  {Array}  fragment The collection of content between the each tags
 * @param  {String} path     The current file path
 * @return {String}          Processed content between each
 */
function flattenEach(fragment, path) {

  if (!Array.isArray(fragment)) return fragment;

  var result = '';
  for (var i = 0; i < fragment.length; i++) {
    if (Array.isArray(fragment[i])) {
      var _fragment$i = _slicedToArray(fragment[i], 2),
          data = _fragment$i[0],
          content = _fragment$i[1];

      result += processContent(content, path, data);
    } else result += fragment[i];
  }

  return result;
}

/**
 * When an #insert or #wrap/#endwrap parse runs it inserts an array into its
 * spot. Then it will flatten this out
 * @param  {[type]} fileInfo [description]
 * @return {[type]}          [description]
 */
function flattenInsertedContent(fileInfo) {
  var _fileInfo = _slicedToArray(fileInfo, 4),
      rawJson = _fileInfo[0],
      jsonParentPath = _fileInfo[1],
      tmpPath = _fileInfo[2],
      content = _fileInfo[3];

  return processContent(content, tmpPath, rawJson);
}

/***/ }),

/***/ "./src/tags/insert.js":
/*!****************************!*\
  !*** ./src/tags/insert.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = processInsert;

var _attributes = __webpack_require__(/*! ../attributes */ "./src/attributes/index.js");

var _json = __webpack_require__(/*! ../json */ "./src/json/index.js");

var _file = __webpack_require__(/*! ../util/file */ "./src/util/file.js");

var _config = __webpack_require__(/*! ../config */ "./src/config.js");

// <!--#insert path="" -->
function processInsert(file, jsonContext) {
  var filename = "";
  var content = file.content;

  var rawJson = (0, _attributes.hasTagAttribute)('rawJson', content) ? (0, _attributes.getTagAttribute)('rawJson', content) : "";

  var jsonParentPath = (0, _attributes.hasTagAttribute)(_config.jsonPathAttribute, content) ? (0, _attributes.getTagAttribute)(_config.jsonPathAttribute, content) : "";

  if ((0, _attributes.hasTagAttribute)(_config.filePathAttribute, content)) {
    filename = (0, _attributes.getTagAttribute)(_config.filePathAttribute, content);
    filename = (0, _file.buildPathFromRelativePath)(file.path, filename);
  } else if ((0, _attributes.hasTagAttribute)('absPath', content)) filename = (0, _attributes.getTagAttribute)("absPath", content);

  if (_config.insertFiles[filename]) content = _config.insertFiles[filename].content;else {
    console.error("ERROR: in file '" + file.path + "': insert file `" + filename + "` does not exist");
    return "";
  }

  return [rawJson, jsonParentPath, file.tmpPath, content];
}

/***/ }),

/***/ "./src/tags/jsonInsert.js":
/*!********************************!*\
  !*** ./src/tags/jsonInsert.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = processJsonInsert;

var _attributes = __webpack_require__(/*! ../attributes */ "./src/attributes/index.js");

var _parsing = __webpack_require__(/*! ../util/parsing */ "./src/util/parsing.js");

var _config = __webpack_require__(/*! ../config */ "./src/config.js");

// <!--#jsonInsert jsonPath="" default="" -->
function processJsonInsert(tag) {
  var defaultValue = (0, _attributes.hasTagAttribute)("default", tag) ? (0, _attributes.getTagAttribute)('default', tag) : "";

  var jsonPath = (0, _attributes.getTagAttribute)(_config.jsonPathAttribute, tag);
  var jsonData = (0, _parsing.getDataFromJsonPath)(jsonPath);

  if (jsonData || defaultValue) return jsonData || defaultValue;else {
    console.warn("ERROR: jsonPath `" + jsonPath + "` is undefined, and no default value");
    return "";
  }
}

/***/ }),

/***/ "./src/tags/wrap.js":
/*!**************************!*\
  !*** ./src/tags/wrap.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = processWraps;

var _attributes = __webpack_require__(/*! ../attributes */ "./src/attributes/index.js");

var _config = __webpack_require__(/*! ../config */ "./src/config.js");

var _json = __webpack_require__(/*! ../json */ "./src/json/index.js");

var _file = __webpack_require__(/*! ../util/file */ "./src/util/file.js");

var _parsing = __webpack_require__(/*! ../util/parsing */ "./src/util/parsing.js");

// <!--#wrap path="" jsonPath="" rawJson="" -->
// <!--#middle -->
// <!--#endwrap -->
function processWraps(file, ndx, arr, jsonContext) {
  var endNdx = -1,
      fpath = "",
      content = arr[ndx],
      filename = "",
      rawJson = "",
      jsonParentPath = "",
      pathPattern = 'path="',
      absPathPattern = 'absPath="',
      pattern = content.indexOf(pathPattern) > -1 ? pathPattern : absPathPattern;

  // see if we are loading a json path
  if ((0, _attributes.hasTagAttribute)(_config.jsonPathAttribute, content)) jsonParentPath = (0, _attributes.getTagAttribute)(_config.jsonPathAttribute, content);

  // see if we have raw json to load from
  if ((0, _attributes.hasTagAttribute)('rawJson', content)) rawJson = (0, _attributes.getTagAttribute)('rawJson', content);

  // get filepath (either relative or absolute)
  filename = pattern === pathPattern ? (0, _attributes.getTagAttribute)(_config.filePathAttribute, arr[ndx]) : (0, _attributes.getTagAttribute)("absPath", arr[ndx]);

  // build filepath if its relative
  fpath = pattern === pathPattern ? (0, _file.buildPathFromRelativePath)(file.path, filename) : filename;

  // find closing tag
  endNdx = (0, _parsing.findIndexOfClosingTag)('<!--#wrap', '<!--#endwrap', ndx, arr);

  // If we have no closing tag, then this is an error
  if (endNdx === -1) {
    console.error("ERROR: in file " + file.path + ": <!--#wrap . . . --> with no <!--#endwrap . . . -->");
    return "";
  }

  // Get the wrap file and split it in the middle
  if (_config.wrapFiles[fpath]) {
    content = _config.wrapFiles[fpath].content.split(/<!--#middle\s*-->/);
    if (content.length !== 2) {
      console.error("ERROR: in file " + file.path + ": wrap file has no <!--#middle--> or more than one <!--#middle--> tags");
      return "";
    }
  } else {
    console.error("ERROR: in file " + file.path + ": no wrapFile by the name `" + filename + "`");
    return "";
  }

  arr[ndx] = [rawJson, jsonParentPath, file.tmpPath, content[0]];
  arr[endNdx] = [rawJson, jsonParentPath, file.tmpPath, content[1]];
  return [ndx, endNdx];
}

/***/ }),

/***/ "./src/util/file.js":
/*!**************************!*\
  !*** ./src/util/file.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.File = File;
exports.buildPathFromRelativePath = buildPathFromRelativePath;
exports.updateRelativePaths = updateRelativePaths;

var _platform = __webpack_require__(/*! ./platform */ "./src/util/platform.js");

var _attributes = __webpack_require__(/*! ../attributes */ "./src/attributes/index.js");

var _parsing = __webpack_require__(/*! ./parsing */ "./src/util/parsing.js");

var _config = __webpack_require__(/*! ../config */ "./src/config.js");

function File(file) {
  var f = {
    name: '',
    path: file.path,
    content: file.contents.toString('utf8').trim(),
    processed: false,
    file: file
  };

  f.name = _platform.isWin ? file.path.split('\\') : file.path.split('/');
  f.name = f.name[f.name.length - 1];

  return f;
}

// overcome the difference in *nix/windows pathing
function fixFilePathForOS(path) {
  return _platform.isWin ? path.replace(/\//g, '\\') : path.replace(/\\/g, '/');
}

// given the current directory and a relative path, build the complete path
// to the relative path
function buildPathFromRelativePath(cdir, fdir) {
  var dir,
      dirChar = _platform.isWin ? '\\' : '/';

  dir = cdir.split(dirChar);

  fdir = fixFilePathForOS(fdir);
  dir.pop();

  fdir.split(dirChar).forEach(function (e) {
    e === '..' ? dir.pop() : e !== '.' && e !== '' ? dir.push(e) : void 0;
  });
  dir = dir.join(dirChar);
  if (_config.devOptions.printPaths) {
    console.log("********buildPathFromRelativePath********");
    console.log("cdir  : ", cdir);
    console.log("fdir  : ", fdir);
    console.log("result: ", dir);
    console.log("********end buildPathFromRelativePath********");
  }
  return dir;
}

// Updates the relative path with the parent's path so it can be resolved on the
// next turn
function updateRelativePaths(content, cdir) {
  var dir = "";
  content = (0, _parsing.splitContent)(content);

  content = content.map(function (fragment) {
    if (fragment.indexOf(_config.insertPattern) === 0 || fragment.indexOf('<!--#wrap') === 0) {
      dir = (0, _attributes.getTagAttribute)(_config.filePathAttribute, fragment);
      dir = buildPathFromRelativePath(cdir, dir);
      fragment = (0, _attributes.setTagAttribute)(_config.filePathAttribute, fragment, dir);
      fragment = (0, _attributes.changeTagAttributeName)(_config.filePathAttribute, fragment, "absPath");
    }
    return fragment;
  });

  content = content.join('');
  return content;
}

/***/ }),

/***/ "./src/util/parsing.js":
/*!*****************************!*\
  !*** ./src/util/parsing.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.getDataFromJsonPath = getDataFromJsonPath;
exports.getIndexOfClosingBrace = getIndexOfClosingBrace;
exports.splitContent = splitContent;
exports.findIndexOfClosingTag = findIndexOfClosingTag;

var _json = __webpack_require__(/*! ../json */ "./src/json/index.js");

var _config = __webpack_require__(/*! ../config */ "./src/config.js");

// given a jsonObject and a path, return the data pointed at
function getDataFromJsonPath(jsonPath, jsonObj) {
  var json = jsonObj || _config.options.jsonInput;
  var result;

  if (jsonPath === '*') return _config.options.jsonInput;
  if (jsonPath === 'this') return json;
  result = jsonPath.split('.').reduce(function (acc, cur) {
    return acc ? acc[cur] : '';
  }, json);

  if (Array.isArray(result)) ;else if ((typeof result === 'undefined' ? 'undefined' : _typeof(result)) === 'object') result = (0, _json.toSafeJsonString)(result);

  return result;
}

// Given some content (starting with a tag) find the index after the matching end tag
function getIndexOfClosingBrace(content, startPattern, endPattern) {
  var tagDepth = 0; // when this gets to 0 we are done
  var tmpContent = content.substr(1);

  // prime loop by finding next start tag
  var nextCloseNdx = tmpContent.indexOf(endPattern);
  var nextOpenNdx = tmpContent.indexOf(startPattern);

  if (nextCloseNdx === -1) console.trace('No Close tag for startPattern: ' + startPattern + ' and endPattern: ' + endPattern + ' and content: ' + content);

  // if there is a nextCloseNdx, but no openNdx, return the end of the tag.
  if (nextOpenNdx === -1 || nextOpenNdx > nextCloseNdx) return nextCloseNdx + 4; // 4 not 3 because we sliced off the '<' in content

  // add 1 so we will search past the tag
  nextOpenNdx += 1;
  nextCloseNdx += 1;

  // while current tag is not closed...
  do {
    var tmpOpen = void 0,
        tmpClosed = void 0;

    // start tag is before close tag, then
    // we can look to see if there is yet another tag nested between
    if (nextOpenNdx > -1 && nextOpenNdx < nextCloseNdx) {
      tmpOpen = tmpContent.substr(nextOpenNdx).indexOf(startPattern);
      // see if we found something, and add this new index to our accumulator
      if (tmpOpen > -1) {
        // add 1 because we need next search to be beyond this tag
        nextOpenNdx += tmpOpen + 2;
        tagDepth += 1;
      } else nextOpenNdx = -1;
    } else {
      // current close tag is before start tag
      tmpClosed = tmpContent.substr(nextCloseNdx).indexOf(endPattern);
      // see if we found something, and add this new index to our accumulator
      if (tmpClosed > -1) {
        // add 1 because we need next search to be beyond this tag
        nextCloseNdx += tmpClosed + 1;
        tagDepth -= 1;

        if (tagDepth === 0) return nextCloseNdx + 3;
      } else if (tagDepth > 0) {
        console.error('There is an unclosed tag', content);
        break;
      }
    }
  } while (tagDepth > 0);

  nextCloseNdx += 4;

  if (nextCloseNdx === -1) console.error("ERROR: no closing tag! you are missing a '" + endPattern + "'");

  return nextCloseNdx;
}

// Splits a string into an array where special tags are on their own
// can optionally only split it up based on a particular tag
function splitContent(content, tag) {
  var arr = [],
      openNdx = -1,
      closeNdx = -1,
      partial = "",
      startPattern = tag || '<!--#',
      endPattern = '-->';

  //prime the loop
  openNdx = content.indexOf(startPattern);

  if (openNdx === -1) return [content];

  while (openNdx > -1) {
    partial = content.slice(0, openNdx);
    if (partial) arr.push(partial);

    content = content.slice(openNdx);

    // get the closeNdx despite inner open tags
    // openNdx-><!-- <!-- --> <!-- <!-- --> --> --><-closeNdx
    var _closeNdx = getIndexOfClosingBrace(content, startPattern, endPattern);

    partial = content.slice(0, _closeNdx);
    arr.push(partial);
    content = content.slice(_closeNdx);

    // get ready for next iteration
    openNdx = content.indexOf(startPattern);

    // on final pass, push the remainer of the content string
    if (openNdx === -1) arr.push(content);
  }

  // Now we have an array of tags, and content
  return arr;
}

// ToDo. These should go to a better place, for now only one place was using a
// magic number
var RAW_JSON_NDX = 0;
var JSON_PATH_NDX = 1;
var FILE_PATH_NDX = 2;
var CONTENT_NDX = 3;

// returns the index of the closing tag for a given opening tag
function findIndexOfClosingTag(openTag, closeTag, startNdx, arr) {
  var endNdx = -1;
  var openCount = 1;

  for (var i = startNdx + 1; i < arr.length; i++) {
    var fragment = Array.isArray(arr[i]) ? arr[i][CONTENT_NDX] // [i] contains [rawJson, jsonPath, filePath, content]
    : arr[i];

    if (fragment.indexOf(openTag) === 0) openCount++;else if (fragment.indexOf(closeTag) === 0) {
      openCount--;
      if (openCount === 0) {
        endNdx = i;
        break;
      }
    }
  }
  return endNdx;
}

/***/ }),

/***/ "./src/util/platform.js":
/*!******************************!*\
  !*** ./src/util/platform.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var isWin = exports.isWin = /^win/.test(process.platform);

/***/ })

/******/ })));
//# sourceMappingURL=htmlincluder.js.map