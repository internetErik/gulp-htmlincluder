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


var _config = __webpack_require__(/*! ./config */ "./src/config.js");

var _parse = __webpack_require__(/*! ./parse */ "./src/parse.js");

module.exports = {
  initialize: function initialize(options) {
    return (0, _config.setOptions)(options);
  },
  // puts files into hash maps
  hashFile: function hashFile(file) {
    var f = formatFile(file);

    // removing clip right away does no damage and speeds up later processing
    processClip(f);

    (0, _config.configureFiles)(f);
  },
  // map on page files and build them into strings
  buildFileResult: function buildFileResult(callback) {
    return _config.pageFiles.map(function (file) {
      var processedFile = (0, _parse.processFile)(file, _config.options.jsonInput || {});
      file.content = processedFile.content;

      file.processed = true;

      if (callback) callback(file);

      return file;
    });
  }
};

var isWin = /^win/.test(process.platform);

var formatFile = function formatFile(file) {
  var f = {
    path: file.path,
    content: file.contents.toString('utf8').trim(),
    processed: false,
    file: file
  };

  f.name = isWin ? file.path.split('\\') : file.path.split('/');
  f.name = f.name[f.name.length - 1];

  return f;
};

// This runs first, since all of the clipped areas will completely be removed
var processClip = function processClip(file) {
  // process clipbefore and clipafter
  if (file.content.indexOf('<!--#clipbefore') > -1) {
    file.content = file.content.split(/<!--#clipbefore\s*-->/).splice(1)[0].split('<!--#clipafter').splice(0, 1)[0];
  }

  // process clipbetween
  if (file.content.indexOf('<!--#clipbetween') > -1) {
    var tmp = file.content.split(/<!--#clipbetween\s*-->/);
    file.content = tmp[0] + tmp[1].split(/<!--#endclipbetween\s*-->/)[1];
  }
};

/***/ }),

/***/ "./src/parse.js":
/*!**********************!*\
  !*** ./src/parse.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processFile = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _config = __webpack_require__(/*! ./config */ "./src/config.js");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// shape of our AST nodes
var getDefaultNode = function getDefaultNode() {
  return {
    type: '',
    file: {},
    originalContent: '',
    content: '',
    parent: {},
    innerScope: null,
    children: [], // list of sequential nodes wrapped in tag (or at topNode)
    nestedNodes: [], // nested tags - these need to be resolved before this tag is resolved
    attributes: {} // attributes on tag
  };
};

// entry point for processing files
var processFile = exports.processFile = function processFile(file, json, parent, innerScope) {
  // convert string into object
  var topNode = _extends({}, getDefaultNode(), {
    type: 'topNode',
    file: file,
    originalContent: file.content,
    content: file.content
  }, parent ? { parent: parent } : {}, innerScope ? { innerScope: innerScope } : {});

  // don't do work if there are no tags in the file
  if (topNode.originalContent.indexOf('<!--#') === -1) return topNode;

  // process children of the node
  processNode(topNode, json);

  return topNode;
};

//
var processNode = function processNode(node, json) {
  if (node.type === 'textContent') return node;

  // the contents of a node may contain more nested nodes
  // break these up into an array of mixed textContent nodes and tags
  var contentArr = splitContent(node.content).filter(function (c) {
    return c !== '';
  });

  // convert array of strings to nodes
  node.nestedNodes = buildNodes(node, contentArr, json);

  return resolveNode(node, json);
};

//
var buildNodes = function buildNodes(parent, contentArr, json, closeTag) {
  var nodes = [];

  while (contentArr.length > 0) {
    var content = contentArr.shift();

    // if we find the close tag, then we are done with our search
    if (closeTag && content.indexOf(closeTag) === 0) return nodes;

    // lookup type of the tag
    var type = findNodeType(content);

    var node = _extends({}, getDefaultNode(), {
      type: type,
      parent: parent,
      file: parent.file,
      innerScope: parent.innerScope,
      originalContent: content,
      content: content
    });

    // if this is a text node, we're set
    if (type === 'textContent') {
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

  // We should never get here while looking for a closing tag
  if (closeTag) console.warn('WARNING while processing file \'' + parent.file.path + '\': there is a missing tag');

  return nodes;
};

//
var resolveNode = function resolveNode(node, json) {
  // resolve nested tags
  if (node.nestedNodes.length > 0) {
    node.nestedNodes.forEach(function (node) {
      return processNode(node, json);
    });
    node.content = joinContent(node.nestedNodes);
  }

  // process node so that content is resolved
  var processor = nodeProcessors[node.type];

  // There is a problem if we found no processor
  if (!processor) {
    console.warn('WARNING while processing file \'' + node.file.path + '\': there is no processor for type \'' + node.type + '\'');
    return node;
  }

  // load and resolve attribute values
  node.attributes = loadNodeAttributes(node, json);

  return processor(node, json);
};

// loads values for tags into node object
var loadNodeAttributes = function loadNodeAttributes(node, json) {
  var attrs = nodeAttributes[node.type] || [];
  return attrs.reduce(function (acc, attr) {
    if (hasTagAttribute(attr, node.content)) {
      var value = getTagAttribute(attr, node.content);
      acc[attr] = attr === 'rawJson' ? processRawJson(value, json) : value;
    }
    return acc;
  }, {});
};

// check for tag and return node type
var findNodeType = function findNodeType(content) {
  return content.indexOf('<!--#insert') === 0 ? 'insert' : content.indexOf('<!--#data') === 0 ? 'data' : content.indexOf('<!--#jsonInsert') === 0 ? 'jsonInsert' : content.indexOf('<!--#wrap') === 0 ? 'wrap' : content.indexOf('<!--#middle') === 0 ? 'middle' : content.indexOf('<!--#each') === 0 ? 'each' : content.indexOf('<!--#if') === 0 ? 'if' : 'textContent';
};

//
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
    return node;
  },
  //
  textContent: function textContent(node, json) {
    console.warn('WARNING: Why are we processing a textContent?');
    return node;
  },
  //
  insert: function insert(node, json) {
    var file = node.file,
        innerScope = node.innerScope;
    var _node$attributes = node.attributes,
        path = _node$attributes.path,
        jsonPath = _node$attributes.jsonPath,
        rawJson = _node$attributes.rawJson;

    if (!path) {
      console.warn('WARNING while processing file \'' + file.path + '\': insert tag with no path attribute');
      node.content = '';
      return node;
    }

    // get filename for inserted file
    var filename = buildPathFromRelativePath(file.path, path);

    // see if file we are loading exists
    if (!_config.insertFiles[filename]) {
      console.warn('WARNING while processing file \'' + file.path + '\': insert file \'' + filename + '\' does not exist');
      node.content = '';
      return node;
    }

    // load contents from file
    var insertFile = _extends({}, _config.insertFiles[filename]);

    // set scope for inserted file
    var newInnerScope = rawJson && jsonPath ? getDataFromJsonPath(jsonPath, rawJson) : innerScope && jsonPath ? getDataFromJsonPath(jsonPath, innerScope) : rawJson ? rawJson : jsonPath ? getDataFromJsonPath(jsonPath, json) : void 0;

    var insertNode = processFile(insertFile, json, node, newInnerScope);

    // process contents to get children
    node.content = insertNode.content;
    return node;
  },
  //
  wrap: function wrap(node, json) {
    var file = node.file,
        innerScope = node.innerScope;
    var _node$attributes2 = node.attributes,
        path = _node$attributes2.path,
        jsonPath = _node$attributes2.jsonPath,
        rawJson = _node$attributes2.rawJson;

    if (!path) {
      console.warn('WARNING while processing file \'' + node.file.path + '\': wrap tag with no path attribute');
      node.content = '';
      return node;
    }

    // get filename for inserted file
    var filename = buildPathFromRelativePath(file.path, path);

    // see if file we are loading exists
    if (!_config.wrapFiles[filename]) {
      console.warn('WARNING while processing file \'' + node.file.path + '\': wrap file \'' + filename + '\' does not exist');
      node.content = '';
      return node;
    }

    // we need to process the children before we bring in the file

    // handle children content
    node.children = node.children.map(function (childNode) {
      return processNode(childNode, json);
    });
    node.content = joinContent(node.children);

    // load contents from file
    var wrapFile = _extends({}, _config.wrapFiles[filename]);

    // set scope for inserted file
    var newInnerScope = rawJson && jsonPath ? getDataFromJsonPath(jsonPath, rawJson) : innerScope && jsonPath ? getDataFromJsonPath(jsonPath, innerScope) : rawJson ? rawJson : jsonPath ? getDataFromJsonPath(jsonPath, json) : void 0;

    var wrapNode = processFile(wrapFile, json, node, newInnerScope);

    // process contents to get children
    node.content = wrapNode.content;
    return node;
  },
  //
  middle: function middle(node, json) {
    node.content = node.parent.parent.content;
    return node;
  },
  //
  data: function data(node, json) {
    var innerScope = node.innerScope,
        file = node.file;
    var _node$attributes3 = node.attributes,
        jsonPath = _node$attributes3.jsonPath,
        rawJson = _node$attributes3.rawJson;

    var defaultVal = node.attributes.default;

    if (!jsonPath || !rawJson && !innerScope && !defaultVal) {
      console.warn('WARNING while processing file \'' + file.path + '\': data tag with no data to look up for content \'' + node.originalContent + '\'');
      node.content = '';
      return node;
    }
    var values = rawJson || innerScope;
    var data = getDataFromJsonPath(jsonPath, values);
    node.content = data || defaultVal || '';
    return node;
  },
  //
  jsonInsert: function jsonInsert(node, json) {
    var jsonPath = node.attributes.jsonPath;

    var defaultVal = node.attributes.default;
    if (!jsonPath) {
      node.content = '';
      return node;
    }
    var data = getDataFromJsonPath(jsonPath, json);
    node.content = data || defaultVal || '';
    return node;
  },
  //
  each: function each(node, json) {
    var file = node.file,
        innerScope = node.innerScope;
    var _node$attributes4 = node.attributes,
        count = _node$attributes4.count,
        jsonPath = _node$attributes4.jsonPath,
        rawJson = _node$attributes4.rawJson;

    if (!count && !jsonPath && !Array.isArray(rawJson) && !Array.isArray(innerScope)) {
      console.warn('WARNING while processing file \'' + file.path + '\': each tag with attribute problems: count, jsonPath and rawJson and innerScope are not arrays');
      node.content = '';
      return node;
    }

    // determine what data we are using
    var values = rawJson || node.innerScope || json;
    var jsonData = jsonPath ? getDataFromJsonPath(jsonPath, values) : void 0;
    var data = Array.isArray(values) ? values : Array.isArray(jsonData) ? jsonData : void 0;

    if (!data && !count) {
      node.content = '';
      return node;
    }

    // build up nodes and bind the correct data
    var tmpContent = [];

    var _loop = function _loop(i) {
      // clone children
      var tmpChildren = node.children.map(function (c) {
        return _extends({}, c, c.nestedNodes ? { nestedNodes: c.nestedNodes } : {}, c.children ? { children: c.children } : {}, data
        // ? { innerScope : (typeof(data[i]) === 'object') ? { ...data[i] } : data[i] }
        ? { innerScope: data[i] } : {});
      });
      // handle children content
      tmpChildren = tmpChildren.map(function (childNode) {
        return processNode(childNode, json);
      });
      tmpContent.push(joinContent(tmpChildren));
    };

    for (var i = 0; (!count || count && i < count) && (!data || data && i < data.length); i++) {
      _loop(i);
    }

    node.content = tmpContent.join('');
    return node;
  },
  //
  if: function _if(node, json) {
    var innerScope = node.innerScope;
    var _node$attributes5 = node.attributes,
        jsonPath = _node$attributes5.jsonPath,
        rawJson = _node$attributes5.rawJson;

    if (!jsonPath) {
      node.content = '';
      return node;
    }

    var values = rawJson || innerScope || json;
    var jsonData = getDataFromJsonPath(jsonPath, values);
    if (!jsonData) {
      node.content = '';
      return node;
    }
    node.children = node.children.map(function (childNode) {
      return processNode(_extends({}, childNode, {
        innerScope: _extends({}, node.innerScope)
      }), json);
    });
    node.content = joinContent(node.children);
    return node;
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
};

var getTagPositions = function getTagPositions(tag, content) {
  var lndx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var ndx = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : content.indexOf(tag);
  return ndx === -1 ? [] : [ndx + lndx].concat(_toConsumableArray(getTagPositions(tag, content.slice(ndx + 1), lndx + ndx + 1)));
};

var buildTagPairs = function buildTagPairs(open, close) {
  return open.length === 0 ? [] : open.length === 1 || open[1] > close[0] ? [[open.slice(0, 1)[0], close.slice(0, 1)[0]]].concat(_toConsumableArray(buildTagPairs(open.slice(1), close.slice(1)))) : [].concat(_toConsumableArray(buildTagPairs([].concat(_toConsumableArray(open.slice(0, 1)), _toConsumableArray(open.slice(2))), close.slice(1))));
};

var divideContent = function divideContent(content, _ref, pairs) {
  var _ref2 = _slicedToArray(_ref, 2),
      start = _ref2[0],
      end = _ref2[1];

  var cursor = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  return start === void 0 ? [content.slice(cursor)] : [content.slice(cursor, start), content.slice(start, end + 3)].concat(_toConsumableArray(divideContent(content, pairs.shift() || [], pairs, end + 3)));
};

var splitContent = function splitContent(content) {
  var openTags = getTagPositions('<!--#', content);
  var closeTags = getTagPositions('-->', content);

  if (openTags.length < closeTags.length) closeTags.pop();

  var pairs = buildTagPairs(openTags, closeTags);

  return divideContent(content, pairs.shift() || [], pairs).filter(function (c) {
    return c !== '';
  });
};

// given a jsonObject and a path, return the data pointed at
var getDataFromJsonPath = function getDataFromJsonPath(jsonPath, json) {
  if (jsonPath === 'this') return json;

  var result = jsonPath.split('.').reduce(function (acc, cur) {
    return acc ? acc[cur] : '';
  }, json);

  if (!Array.isArray(result) && (typeof result === 'undefined' ? 'undefined' : _typeof(result)) === 'object') result = toSafeJsonString(result);

  return result;
};

// are we on windows?
var isWin = /^win/.test(process.platform);

// overcome the difference in *nix/windows pathing
var fixFilePathForOS = function fixFilePathForOS(path) {
  return isWin ? path.replace(/\//g, '\\') : path.replace(/\\/g, '/');
};

// given the current directory and a relative path, build the complete path
// to the relative path
var buildPathFromRelativePath = function buildPathFromRelativePath(cdir, fdir) {
  var dirChar = isWin ? '\\' : '/';
  var dir = cdir.split(dirChar);
  dir.pop();

  fdir = fixFilePathForOS(fdir);

  fdir.split(dirChar).forEach(function (e) {
    e === '..' ? dir.pop() : e !== '.' && e !== '' ? dir.push(e) : void 0;
  });
  dir = dir.join(dirChar);

  return dir;
};

//
var toSafeJsonString = function toSafeJsonString(jsonObj) {
  return JSON.stringify(jsonObj).replace(/\'/g, "\\'").replace(/"/g, "'");
};

//
var processRawJson = function processRawJson(jsonString, json) {
  if ((typeof jsonString === 'undefined' ? 'undefined' : _typeof(jsonString)) === 'object') jsonString = toSafeJsonString(jsonString);

  var jsonData = {};
  try {
    eval('jsonData = ' + jsonString);
  } catch (e) {
    console.error('ERROR: Poorly formatted rawJson string:\n      ' + jsonString + '\n      This must be valid JavaScript.\n    ');
  }

  return jsonData;
};

// does a tag have an attribute? (attributeName="value")
var hasTagAttribute = function hasTagAttribute(attr, content) {
  return content.indexOf(attr + '="') > -1;
};

// get the value of an attribute (attributeName="value")
var getTagAttribute = function getTagAttribute(attr, content) {
  var fndx = -1,
      lndx = -1;

  fndx = content.indexOf(attr + '="');
  if (fndx === -1) {
    console.warn("Warning: no tag of name `" + attr + "` found in the following content: `" + content + "`");
    return '';
  }

  content = content.slice(fndx + attr.length + 2);
  lndx = content.indexOf('"');
  content = content.slice(0, lndx);
  return content;
};

/***/ })

/******/ })));
//# sourceMappingURL=htmlincluder.js.map