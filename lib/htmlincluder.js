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

var _parse = __webpack_require__(/*! ./parse */ "./src/parse/index.js");

module.exports = {
  initialize: function initialize(options) {
    return (0, _config.setOptions)(options);
  },
  // puts files into hash maps
  hashFile: function hashFile(file) {
    var f = File(file);

    // removing clip right away does no damage and speeds up later processing
    processClip(f);

    (0, _config.configureFiles)(f);
  },
  // builds string
  buildFileResult: function buildFileResult(callback) {
    return _config.pageFiles.map(function (file) {
      var AST = (0, _parse.processFile)(file, _config.options.jsonInput || {});
      file.content = AST.content;
      console.log(file.content);
      file.processed = true;

      if (callback) callback(file);

      return file;
    });
  }
};

var isWin = /^win/.test(process.platform);

function File(file) {
  var f = {
    name: '',
    path: file.path,
    content: file.contents.toString('utf8').trim(),
    processed: false,
    file: file
  };

  f.name = isWin ? file.path.split('\\') : file.path.split('/');
  f.name = f.name[f.name.length - 1];

  return f;
}

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
exports.processFile = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _config = __webpack_require__(/*! ../config */ "./src/config.js");

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
  if (node.type === 'textContent') return;

  // the contents of a node may contain more nested nodes
  // break these up into an array of mixed textContent nodes and tags
  var contentArr = splitContent(node.content).filter(function (c) {
    return c !== '';
  });

  // convert array of strings to nodes
  node.nestedNodes = buildNodes(node, contentArr, json);

  resolveNode(node, json);
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
    return;
  }

  // load and resolve attribute values
  node.attributes = loadNodeAttributes(node);

  processor(node, json);
};

// loads values for tags into node object
var loadNodeAttributes = function loadNodeAttributes(node) {
  var attrs = nodeAttributes[node.type] || [];
  return attrs.reduce(function (acc, attr) {
    if (hasTagAttribute(attr, node.originalContent)) {
      var value = getTagAttribute(attr, node.originalContent);
      acc[attr] = attr === 'rawJson' ? processRawJson(value) : value;
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
    return node.content = joinContent(node.nestedNodes);
  },
  //
  textContent: function textContent(node, json) {
    return console.warn('WARNING: Why are we processing a textContent?');
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
      return;
    }

    // get filename for inserted file
    var filename = buildPathFromRelativePath(file.path, path);

    // see if file we are loading exists
    if (!_config.insertFiles[filename]) {
      console.warn('WARNING while processing file \'' + file.path + '\': insert file \'' + filename + '\' does not exist');
      node.content = '';
      return;
    }

    // load contents from file
    var insertFile = _extends({}, _config.insertFiles[filename]);

    // set scope for inserted file
    var newInnerScope = rawJson && jsonPath ? getDataFromJsonPath(jsonPath, rawJson) : innerScope && jsonPath ? getDataFromJsonPath(jsonPath, innerScope) : rawJson ? rawJson : jsonPath ? getDataFromJsonPath(jsonPath, json) : void 0;

    var insertNode = processFile(insertFile, json, node, newInnerScope);

    // process contents to get children
    node.content = insertNode.content;
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
      return;
    }

    // get filename for inserted file
    var filename = buildPathFromRelativePath(file.path, path);

    // see if file we are loading exists
    if (!_config.wrapFiles[filename]) {
      console.warn('WARNING while processing file \'' + node.file.path + '\': wrap file \'' + filename + '\' does not exist');
      node.content = '';
      return;
    }

    // we need to process the children before we bring in the file

    // handle children content
    node.children.forEach(function (childNode) {
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
  },
  //
  middle: function middle(node, json) {
    return node.content = node.parent.parent.content;
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
      return;
    }
    var values = rawJson || innerScope;
    var data = getDataFromJsonPath(jsonPath, values);
    node.content = data || defaultVal || '';
  },
  //
  jsonInsert: function jsonInsert(node, json) {
    var jsonPath = node.attributes.jsonPath;

    var defaultVal = node.attributes.default;
    if (!jsonPath) {
      node.content = '';
      return;
    }
    var data = getDataFromJsonPath(jsonPath, json);
    node.content = data || defaultVal || '';
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
      return;
    }

    // determine what data we are using
    var values = rawJson || node.innerScope || json;
    var jsonData = jsonPath ? getDataFromJsonPath(jsonPath, values) : void 0;
    var data = Array.isArray(values) ? values : Array.isArray(jsonData) ? jsonData : void 0;

    if (!data && !count) {
      node.content = '';
      return;
    }

    // build up nodes and bind the correct data
    var tmpContent = [];

    var _loop = function _loop(i) {
      // clone children
      var tmpChildren = node.children.map(function (c) {
        return _extends({}, c, data ? {
          innerScope: _typeof(data[i]) === 'object' ? _extends({}, data[i]) : data[i]
        } : {});
      });
      // handle children content
      tmpChildren.forEach(function (childNode) {
        return processNode(childNode, json);
      });
      tmpContent.push(joinContent(tmpChildren));
    };

    for (var i = 0; (!count || count && i < count) && (!data || data && i < data.length); i++) {
      _loop(i);
    }

    node.content = tmpContent.join('');
  },
  //
  if: function _if(node, json) {
    var innerScope = node.innerScope;
    var _node$attributes5 = node.attributes,
        jsonPath = _node$attributes5.jsonPath,
        rawJson = _node$attributes5.rawJson;

    if (!jsonPath) {
      node.content = '';
      return;
    }

    var values = rawJson || innerScope || json;
    var jsonData = getDataFromJsonPath(jsonPath, values);

    if (!jsonData) {
      node.content = '';
      return;
    }

    node.children.forEach(function (childNode) {
      childNode.innerScope = _extends({}, node.innerScope);
      processNode(childNode, json);
    });
    node.content = joinContent(node.children);
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

  // Splits a string into an array where special tags are on their own
  // can optionally only split it up based on a particular tag
};var splitContent = function splitContent(content, tag) {
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
};

// Given some content (starting with a tag) find the index after the matching end tag
var getIndexOfClosingBrace = function getIndexOfClosingBrace(content, startPattern, endPattern) {
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
        console.error('ERROR: there is an unclosed tag - content is ' + content);
        break;
      }
    }
  } while (tagDepth > 0);

  nextCloseNdx += 4;

  if (nextCloseNdx === -1) console.error('ERROR: no closing tag! you are missing a \'' + endPattern + '\'');

  return nextCloseNdx;
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
var processRawJson = function processRawJson(jsonString) {
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