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
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
/* 1 */
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.stripInnerTags = stripInnerTags;
exports.getDataFromJsonPath = getDataFromJsonPath;
exports.parseToClosingTag = parseToClosingTag;
exports.splitContent = splitContent;
exports.findIndexOfClosingTag = findIndexOfClosingTag;

var _json = __webpack_require__(3);

var _config = __webpack_require__(0);

function stripInnerTags(content) {
  // tmpContent = '!-- ... --';
  var tmpContent = content.substr(0, content.length - 1).substr(1);

  var startNdx = tmpContent.indexOf('<!--#');

  if (startNdx === -1) return content;

  while (startNdx !== -1) {
    var closeNdx = parseToClosingTag(tmpContent.substr(startNdx), '<!--#', '-->');
    if (closeNdx > -1) {
      tmpContent = tmpContent.substr(0, startNdx) + tmpContent.substr(closeNdx);
      startNdx = startNdx = tmpContent.indexOf('<!--#');
    } else {
      console.warn('stripInnerTags - No closing tag');
      break;
    }
  }

  return '<' + tmpContent + '>';
}

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

// Given some content (starting with a tag) find the index after the end tag
function parseToClosingTag(content, searchPattern, endPattern) {
  var lndx = content.indexOf(endPattern);
  var tagDepth = 1; // when this gets to 0 we are done
  var nextCloseNdx = lndx;

  // prime loop by finding next start tag
  var nextOpenNdx = content.substr(1).indexOf(searchPattern);
  // make sure that it is necessary to look for internal tags
  if (nextOpenNdx > -1 && nextOpenNdx < nextCloseNdx) {
    nextOpenNdx++;
    // while current tag is not closed...
    while (tagDepth > 0) {
      // start tag is before current close tag
      if (nextOpenNdx > -1 && nextOpenNdx < nextCloseNdx) {
        // Then we need to find the next lndx
        tagDepth++;
        // find an open tag between 0 and lndx
        var tmp = content.substr(nextOpenNdx + 1).indexOf(searchPattern);
        if (tmp === -1) nextOpenNdx = -1;else nextOpenNdx += tmp + 1;
      } else {
        // current close tag is before start tag
        var _tmp = content.substr(nextCloseNdx).indexOf(endPattern);
        if (_tmp === -1) nextCloseNdx = -1;else nextCloseNdx += _tmp + 1;

        tagDepth--;
        if (tagDepth > 0 && nextCloseNdx === -1) console.error('There is an unclosed tag', content);
      }
    }
    // should be the ndx of the last closing tag related to the current tag we are parsing
    lndx = nextCloseNdx;
  }

  if (lndx > -1) lndx += endPattern.length;else console.error("ERROR: no closing tag! you are missing a '" + endPattern + "'");

  return lndx;
}

// Splits a string into an array where special tags are on their own
// can optionally only split it up based on a particular tag
function splitContent(content, tag) {
  var arr = [],
      fndx = -1,
      lndx = -1,
      partial = "",
      searchPattern = tag || '<!--#',
      endPattern = '-->';

  //prime the loop
  fndx = content.indexOf(searchPattern);
  if (fndx === -1) arr.push(content);

  while (fndx > -1) {
    partial = content.slice(0, fndx);
    arr.push(partial);
    content = content.slice(fndx);

    // get the lndx despite inner open tags like <!-- <!-- --> -->
    var _lndx = parseToClosingTag(content, searchPattern, endPattern);

    partial = content.slice(0, _lndx);
    arr.push(partial);
    content = content.slice(_lndx);
    fndx = content.indexOf(searchPattern);

    // on final pass, push the remainer of the content string
    if (fndx === -1) arr.push(content);
  }

  return arr;
}

// returns the index of the closing tag for a given opening tag
function findIndexOfClosingTag(openTag, closeTag, startNdx, arr) {
  var endNdx = -1;
  var openCount = 1;

  for (var i = startNdx + 1; i < arr.length; i++) {
    var fragment = Array.isArray(arr[i]) ? arr[i][3] // [rawJson, jsonPath, filePath, content]
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
/* 3 */
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

var _parsing = __webpack_require__(2);

var _attributes = __webpack_require__(1);

var _config = __webpack_require__(0);

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
    console.error(e);
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.File = File;
exports.buildPathFromRelativePath = buildPathFromRelativePath;
exports.updateRelativePaths = updateRelativePaths;

var _platform = __webpack_require__(8);

var _attributes = __webpack_require__(1);

var _parsing = __webpack_require__(2);

var _config = __webpack_require__(0);

function File(file) {
  var f = {
    name: '',
    path: file.path,
    content: file.contents.toString('utf8'),
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _clip = __webpack_require__(6);

var _clip2 = _interopRequireDefault(_clip);

var _tags = __webpack_require__(7);

var _tags2 = _interopRequireDefault(_tags);

var _config = __webpack_require__(0);

var _file = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  initialize: function initialize(options) {
    return (0, _config.setOptions)(options);
  },
  // puts files into hash maps
  hashFile: function hashFile(file) {
    var f = (0, _file.File)(file);

    (0, _clip2.default)(f);

    (0, _config.configureFiles)(f);
  },
  // builds string
  buildFileResult: function buildFileResult(callback) {
    return _config.pageFiles.map(function (file) {
      file.content = (0, _tags2.default)(file.content, file.path, _config.options.jsonInput || {});
      file.processed = true;

      if (callback) callback(file);

      return file;
    });
  }
};

/***/ }),
/* 6 */
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// all the different tags we are going to process


exports.default = processContent;

var _parsing = __webpack_require__(2);

var _file = __webpack_require__(4);

var _attributes = __webpack_require__(1);

var _json = __webpack_require__(3);

var _data = __webpack_require__(9);

var _data2 = _interopRequireDefault(_data);

var _each = __webpack_require__(10);

var _each2 = _interopRequireDefault(_each);

var _if = __webpack_require__(11);

var _if2 = _interopRequireDefault(_if);

var _insert = __webpack_require__(12);

var _insert2 = _interopRequireDefault(_insert);

var _jsonInsert = __webpack_require__(13);

var _jsonInsert2 = _interopRequireDefault(_jsonInsert);

var _wrap = __webpack_require__(14);

var _wrap2 = _interopRequireDefault(_wrap);

var _config = __webpack_require__(0);

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

  // prime loop: split content into all insertion points
  splitArr = (0, _parsing.splitContent)(content); // '' => ['']

  // if we have an array larger than 1, then there is at least 1 insert to be made
  while (splitArr.length > 1) {
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

        // handle loading each particular kind of tag
        if (fragment.indexOf('<!--#if') === 0) {
          // looks ahead to remove its closing tag
          // if the if check fails, it also turns the tags between into empty tags
          // the if tag doesn't create a new context
          (0, _if2.default)({ ret: 'content', content: fragment, path: pathStack, tmpPath: tempDirectory }, i, splitArr);
        } else if (fragment.indexOf('<!--#data') === 0) {
          // no look ahead
          // replaces itself with the value from the jsonPath it looks at
          splitArr[i] = (0, _data2.default)(fragment, jsonContext);
        } else if (fragment.indexOf('<!--#jsonInsert') === 0) {
          splitArr[i] = (0, _jsonInsert2.default)(fragment);
        } else if (fragment.indexOf('<!--#each') === 0) {
          (0, _each2.default)({ ret: 'content', content: fragment, path: pathStack, tmpPath: tempDirectory }, i, splitArr);
        } else if (fragment.indexOf('<!--#wrap') === 0) {
          (0, _wrap2.default)({ ret: 'content', content: fragment, path: pathStack, tmpPath: tempDirectory }, i, splitArr);
        } else if (fragment.indexOf(_config.insertPattern) === 0) {
          splitArr[i] = (0, _insert2.default)({ ret: 'content', content: fragment, path: pathStack, tmpPath: tempDirectory });
        }

        pathStack = path;
      }
    }

    // flatten out sub-arrays
    splitArr = splitArr.map(flattenFragment);

    // re-join content into a string, and repeat
    content = splitArr.join(''); // [''] => ''
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

function flattenFragment(fragment, ndx, arr) {
  if (!Array.isArray(fragment)) return fragment;

  var _fragment = _slicedToArray(fragment, 4),
      rawJson = _fragment[0],
      jsonPath = _fragment[1],
      path = _fragment[2],
      content = _fragment[3];

  // yet another recursive call to process content


  content = processContent(content, path, rawJson);

  if (rawJson) content = (0, _json.addRawJsonWhereJsonPath)(content, rawJson);else if (jsonPath) content = (0, _json.appendJsonParentPath)(content, jsonPath);

  if (path) content = (0, _file.updateRelativePaths)(content, path);

  return content;
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var isWin = exports.isWin = /^win/.test(process.platform);

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = processDataTag;

var _attributes = __webpack_require__(1);

var _json = __webpack_require__(3);

var _parsing = __webpack_require__(2);

var _config = __webpack_require__(0);

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

  return jsonData || defaultValue;
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = processEach;

var _attributes = __webpack_require__(1);

var _json = __webpack_require__(3);

var _parsing = __webpack_require__(2);

var _config = __webpack_require__(0);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// <!--#each count="" jsonPath="" rawJson="" -->
// <!--#endeach -->
function processEach(file, ndx, arr) {
  var endNdx = -1,
      startNdx = ndx + 1,
      content = arr[ndx],
      jsonPath = "",
      rawJson = "",
      jsonData = "",
      count = false;

  // if there is an inner each, we do these first, so return
  for (var i = startNdx; i <= endNdx; i++) {
    if (arr[i].indexOf('<!--#each') === 0) return;
  }if ((0, _attributes.hasTagAttribute)(_config.jsonPathAttribute, content)) jsonPath = (0, _attributes.getTagAttribute)(_config.jsonPathAttribute, content);

  if ((0, _attributes.hasTagAttribute)('rawJson', content)) {
    rawJson = (0, _attributes.getTagAttribute)('rawJson', content);
    rawJson = (0, _json.processRawJson)(rawJson);
  }

  if (jsonPath) jsonData = (0, _parsing.getDataFromJsonPath)(jsonPath, rawJson);

  if ((0, _attributes.hasTagAttribute)('count', content)) count = parseInt((0, _attributes.getTagAttribute)('count', content), 10);

  if (Array.isArray(jsonData)) {
    if (!count) count = jsonData.length;else if (count > jsonData.length) {
      console.warn("WARNING: in file " + file.path + ": <!--#each --> with count attribute higher than array input's length. Changing to length of array");
      count = jsonData.length;
    }
  }

  if (!count && !jsonPath) {
    console.error("ERROR: in file " + file.path + ": <!--#each --> with no count attribute, and no array as json object.");
    return;
  }

  endNdx = (0, _parsing.findIndexOfClosingTag)('<!--#each', '<!--#endeach', ndx, arr);

  // If we have no closing tag, then this is an error
  if (endNdx === -1) {
    console.error("ERROR: in file " + file.path + ": <!--#each --> with no <!--#endeach -->");
    return;
  }

  if (endNdx === ndx - 1) console.warn("WARNING: in file " + file.path + ": <!--#each --> with no content");

  // clear end tag
  arr[ndx] = "";
  arr[endNdx] = "";

  var middle = arr.splice(startNdx, endNdx - startNdx);

  content = [];

  // create all the duplicates of the data with the proper inserted data
  for (var _i = 0; _i < count; _i++) {
    var tmp = [].concat(_toConsumableArray(middle)); // clone the lines we are adding

    // if we have jsonData to insert ...
    if (jsonData && Array.isArray(jsonData)) {
      for (var j = 0; j < tmp.length; j++) {
        if (!(0, _attributes.hasTagAttribute)('rawJson', tmp[j])) {
          if (tmp[j].indexOf('<!--#') === 0) {
            if (_typeof(jsonData[_i]) === 'object') {
              tmp[j] = [(0, _json.toSafeJsonString)(jsonData[_i]), '', '', tmp[j]];
            } else if (tmp[j].indexOf('<!--#data') === 0) {
              tmp[j] = '' + jsonData[_i];
            }
          }
        }
      }
    }

    // add the new lines to the content
    content = content.concat(tmp);
  }

  arr.splice.apply(arr, [startNdx, 0].concat(content));
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = processIf;

var _attributes = __webpack_require__(1);

var _json = __webpack_require__(3);

var _parsing = __webpack_require__(2);

var _config = __webpack_require__(0);

// <!--#if jsonPath="" rawJson="" -->
// <!--#endif -->
function processIf(file, ndx, arr) {
  var endNdx = -1,
      content = arr[ndx],
      rawJson = "",
      jsonPath = "",
      jsonData = void 0;

  if ((0, _attributes.hasTagAttribute)(_config.jsonPathAttribute, content)) jsonPath = (0, _attributes.getTagAttribute)(_config.jsonPathAttribute, content);

  if ((0, _attributes.hasTagAttribute)('rawJson', content)) {
    rawJson = (0, _attributes.getTagAttribute)('rawJson', content);
    rawJson = (0, _json.processRawJson)(rawJson);
  }

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

  if (typeof jsonData === 'undefined' || jsonData == false) {
    for (var i = ndx; i < endNdx; i++) {
      arr[i] = "";
    }
  }
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = processInsert;

var _attributes = __webpack_require__(1);

var _json = __webpack_require__(3);

var _file = __webpack_require__(4);

var _config = __webpack_require__(0);

// <!--#insert path="" -->
function processInsert(file) {
  var filename = "";
  var content = file.content;

  var rawJson = (0, _attributes.hasTagAttribute)('rawJson', content) ? (0, _attributes.getTagAttribute)('rawJson', content) : "";

  var jsonParentPath = (0, _attributes.hasTagAttribute)(_config.jsonPathAttribute, content) ? (0, _attributes.getTagAttribute)(_config.jsonPathAttribute, content) : "";

  if ((0, _attributes.hasTagAttribute)(_config.filePathAttribute, content)) {
    filename = (0, _attributes.getTagAttribute)(_config.filePathAttribute, content);
    filename = (0, _file.buildPathFromRelativePath)(file.path, filename);
  } else if ((0, _attributes.hasTagAttribute)('absPath', content)) filename = (0, _attributes.getTagAttribute)("absPath", content);

  if (_config.insertFiles[filename]) content = _config.insertFiles[filename].content;else {
    console.error("ERROR: in file " + file.path + ": insert file `" + filename + "` does not exist");
    return "";
  }

  return [rawJson, jsonParentPath, file.tmpPath, content];
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = processJsonInsert;

var _attributes = __webpack_require__(1);

var _parsing = __webpack_require__(2);

var _config = __webpack_require__(0);

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
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = processWraps;

var _attributes = __webpack_require__(1);

var _config = __webpack_require__(0);

var _json = __webpack_require__(3);

var _file = __webpack_require__(4);

var _parsing = __webpack_require__(2);

// <!--#wrap path="" jsonPath="" rawJson="" -->
// <!--#middle -->
// <!--#endwrap -->
function processWraps(file, ndx, arr) {
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
}

/***/ })
/******/ ])));
//# sourceMappingURL=htmlincluder.js.map