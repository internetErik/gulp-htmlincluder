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
      lndx = -1;
  left = "";
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
      lndx = -1;
  left = "";
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
  var json = jsonObj || options.jsonInput;
  var result;

  if (jsonPath === '*') return options.jsonInput;
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
    if (arr[i].indexOf(openTag) === 0) openCount++;else if (arr[i].indexOf(closeTag) === 0) {
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
      left = "";
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
      left = "";
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
exports.buildPathFromRelativePath = buildPathFromRelativePath;
exports.updateRelativePaths = updateRelativePaths;

var _platform = __webpack_require__(8);

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
  if (devOptions.printPaths) {
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
function updateRelativePaths(cdir, content) {
  var dir = "";
  content = splitContent(content);

  content = content.map(function (fragment) {
    if (fragment.indexOf(insertPattern) === 0 || fragment.indexOf('<!--#wrap') === 0) {
      dir = getTagAttribute(filePathAttribute, fragment);
      dir = buildPathFromRelativePath(cdir, dir);
      fragment = setTagAttribute(filePathAttribute, fragment, dir);
      fragment = changeTagAttributeName(filePathAttribute, fragment, "absPath");
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  initialize: function initialize(options) {
    return (0, _config.setOptions)(options);
  },
  // puts files into hash maps
  hashFile: function hashFile(file) {
    var f = File(file);

    (0, _clip2.default)(f);

    (0, _config.configureFiles)(f);
  },
  // builds string
  buildFileResult: function buildFileResult(callback) {
    return pageFiles.map(function (file) {
      file.content = (0, _tags2.default)(file.content, file.path);
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
exports.default = processContent;

var _parsing = __webpack_require__(2);

var _file = __webpack_require__(4);

var _attributes = __webpack_require__(1);

var _data = __webpack_require__(10);

var _each = __webpack_require__(11);

var _if = __webpack_require__(12);

var _insert = __webpack_require__(13);

var _jsonInsert = __webpack_require__(14);

var _wrap = __webpack_require__(15);

var _config = __webpack_require__(0);

/**
 * Recursive function that does the major work of htmlincluder
 *
 * 1) split content into an array of tags and non-tags
 * 2) if there are any tags (array.length > 1) loop until the parsing is finished
 *
 * @param  {String} content The text that we are processing the tags of
 * @param  {String} path    The current file path
 * @return {String}         The content, now parsed and with all tags replaces
 */
function processContent(content, path) {
  var splitArr = [];
  var itterCount = 0;

  // prime loop: split content into all insertion points
  splitArr = (0, _parsing.splitContent)(content); // '' => ['']

  // if we have an array larger than 1, then there is at least 1 insert to be made
  while (splitArr.length > 1) {
    var tempDirectory = void 0;
    var pathStack = path;

    // process content
    for (var i = 0; i < splitArr.length; i++) {
      var fragment = splitArr[i];

      if (fragment.indexOf('<!--#') === 0) {
        // process any tags inside of this
        fragment = '<' + processContent(fragment.substr(1), path);

        var hasPath = (0, _attributes.hasTagAttribute)(_config.filePathAttribute, fragment);
        var hasAbsPath = (0, _attributes.hasTagAttribute)("absPath", fragment);

        if (hasPath) tempDirectory = (0, _file.buildPathFromRelativePath)(pathStack, (0, _attributes.getTagAttribute)(_config.filePathAttribute, fragment));else if (hasAbsPath) {
          tempDirectory = (0, _attributes.getTagAttribute)("absPath", fragment);
          pathStack = tempDirectory;
        }

        if (fragment.indexOf('<!--#if') === 0) {
          (0, _if.processIf)({ ret: 'content', content: fragment, path: pathStack, tmpPath: tempDirectory }, i, splitArr);
        } else if (fragment.indexOf('<!--#each') === 0) {
          (0, _each.processEach)({ ret: 'content', content: fragment, path: pathStack, tmpPath: tempDirectory }, i, splitArr);
        } else if (fragment.indexOf('<!--#wrap') === 0) {
          (0, _wrap.processWraps)({ ret: 'content', content: fragment, path: pathStack, tmpPath: tempDirectory }, i, splitArr);
        } else if (fragment.indexOf(_config.insertPattern) === 0) {
          splitArr[i] = (0, _insert.processInsert)({ ret: 'content', content: fragment, path: pathStack, tmpPath: tempDirectory });
        } else if (fragment.indexOf('<!--#data') === 0) {
          splitArr[i] = (0, _data.processDataTag)(fragment);
        } else if (fragment.indexOf('<!--#jsonInsert') === 0) {
          splitArr[i] = (0, _jsonInsert.processJsonInsert)(fragment);
        }

        pathStack = path;
      }
    }

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

// all the different tags we are going to process

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
var isWin = exports.isWin = /^win/.test(process.platform);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ }),
/* 9 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 10 */
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
function processDataTag(tag) {
  var jsonPath = "",
      rawJson = "",
      defaultValue = "",
      jsonData = "";

  jsonPath = (0, _attributes.getTagAttribute)(_config.jsonPathAttribute, tag);

  if ((0, _attributes.hasTagAttribute)("default", tag)) defaultValue = (0, _attributes.getTagAttribute)('default', tag);

  if ((0, _attributes.hasTagAttribute)('rawJson', tag)) {
    rawJson = (0, _attributes.getTagAttribute)('rawJson', tag);
    rawJson = (0, _json.processRawJson)(rawJson);
  }

  jsonData = (0, _parsing.getDataFromJsonPath)(jsonPath, rawJson);

  return jsonData || defaultValue;
}

/***/ }),
/* 11 */
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
      middle = [],
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

  middle = arr.splice(startNdx, endNdx - startNdx);

  content = [];

  // create all the duplicates of the data with the proper inserted data
  for (var _i = 0; _i < count; _i++) {
    var tmp = [].concat(_toConsumableArray(middle)); // clone the lines we are adding

    // if we have jsonData to insert ...
    if (jsonData && Array.isArray(jsonData)) {
      for (var j = 0; j < tmp.length; j++) {
        if (tmp[j].indexOf('<!--#data') === 0 && !(0, _attributes.hasTagAttribute)('rawJson', tmp[j])) {
          if (Array.isArray(jsonData)) {
            tmp[j] = (0, _attributes.addTagAttribute)('rawJson', tmp[j], (0, _json.toSafeJsonString)(jsonData[_i]));
          }
          if (_typeof(jsonData[_i]) === 'object') {
            tmp[j] = (0, _attributes.addTagAttribute)('rawJson', tmp[j], (0, _json.toSafeJsonString)(jsonData[_i]));
          } else {
            tmp[j] = '' + jsonData[_i];
          }
        }
        if ((tmp[j].indexOf('<!--#wrap') === 0 || tmp[j].indexOf('<!--#insert') === 0) && !(0, _attributes.hasTagAttribute)('rawJson', tmp[j]) && _typeof(jsonData[_i]) === 'object') {
          tmp[j] = (0, _attributes.addTagAttribute)('rawJson', tmp[j], (0, _json.toSafeJsonString)(jsonData[_i]));
        }
      }
    }

    // add the new lines to the content
    content = content.concat(tmp);
  }

  arr.splice.apply(arr, [startNdx, 0].concat(content));
}

/***/ }),
/* 12 */
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
/* 13 */
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
  var filename = "",
      rawJson = "",
      jsonPath = "",
      jsonParentPath = "",
      content = file.content;

  if ((0, _attributes.hasTagAttribute)(_config.jsonPathAttribute, content)) jsonParentPath = (0, _attributes.getTagAttribute)(_config.jsonPathAttribute, content);

  if ((0, _attributes.hasTagAttribute)('rawJson', content)) rawJson = (0, _attributes.getTagAttribute)('rawJson', content);

  if ((0, _attributes.hasTagAttribute)(_config.filePathAttribute, content)) {
    filename = (0, _attributes.getTagAttribute)(_config.filePathAttribute, content);
    filename = (0, _file.buildPathFromRelativePath)(file.path, filename);
  } else if ((0, _attributes.hasTagAttribute)('absPath', content)) filename = (0, _attributes.getTagAttribute)("absPath", content);

  if (_config.insertFiles[filename]) content = _config.insertFiles[filename].content;else {
    console.error("ERROR: in file " + file.path + ": insert file `" + filename + "` does not exist");
    return "";
  }

  if (rawJson) content = (0, _json.addRawJsonWhereJsonPath)(content, rawJson);else if (jsonParentPath) content = (0, _json.appendJsonParentPath)(content, jsonParentPath);

  if (file.tmpPath) content = (0, _file.updateRelativePaths)(file.tmpPath, content);

  return content;
}

/***/ }),
/* 14 */
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
  var jsonPath = "",
      rawJson = "",
      defaultValue = "",
      jsonData = "";

  jsonPath = (0, _attributes.getTagAttribute)(_config.jsonPathAttribute, tag);

  if ((0, _attributes.hasTagAttribute)("default", tag)) defaultValue = (0, _attributes.getTagAttribute)('default', tag);

  jsonData = (0, _parsing.getDataFromJsonPath)(jsonPath);

  if (jsonData || defaultValue) return jsonData || defaultValue;else {
    console.warning("ERROR: jsonPath `" + jsonPath + "` is undefined, and no default value");
    return "";
  }
}

/***/ }),
/* 15 */
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
      absPathPattern = 'absPath="';
  pattern = content.indexOf(pathPattern) > -1 ? pathPattern : absPathPattern, pathTag = pattern === pathPattern ? 'path' : 'absPath';

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

  if (rawJson) {
    content[0] = (0, _json.addRawJsonWhereJsonPath)(content[0], rawJson, jsonParentPath);
    content[1] = (0, _json.addRawJsonWhereJsonPath)(content[1], rawJson, jsonParentPath);
  } else if (jsonParentPath) {
    content[0] = (0, _json.appendJsonParentPath)(content[0], jsonParentPath);
    content[1] = (0, _json.appendJsonParentPath)(content[1], jsonParentPath);
  }

  if (file.tmpPath) {
    content[0] = (0, _file.updateRelativePaths)(file.tmpPath, content[0]);
    content[1] = (0, _file.updateRelativePaths)(file.tmpPath, content[1]);
  }

  arr[ndx] = content[0];
  arr[endNdx] = content[1];
}

/***/ })
/******/ ]);
//# sourceMappingURL=htmlincluder.js.map