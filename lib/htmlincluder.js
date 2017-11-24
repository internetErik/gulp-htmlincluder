
var isWin = /^win/.test(process.platform);

function File(file) {
	var f = {
		name : '',
		path : file.path,
		content : file.contents.toString('utf8'),
		processed : false,
		file : file
	};

	f.name = (isWin) ? file.path.split('\\') : file.path.split('/');
	f.name = f.name[f.name.length-1];

	return f;
}

module.exports = (function htmlIncluder() {
	var includer = {},
	    wrapFiles = {},
			insertFiles = {},
			pageFiles = [],
			pageTree = [],
			insertPattern,
			filePathAttribute,
			jsonPathAttribute,
			options,
			devOptions;

	// overcome the difference in *nix/windows pathing
	function fixFilePathForOS(path) {
		return (isWin) ? path.replace(/\//g, '\\') : path.replace(/\\/g, '/');
	}

	// given the current directory and a relative path, build the complete path
	// to the relative path
	function buildPathFromRelativePath(cdir, fdir) {
		var dir,
				dirChar = (isWin) ? '\\' : '/';

		dir = cdir.split(dirChar);

		fdir = fixFilePathForOS(fdir);
		dir.pop();

		fdir.split(dirChar)
			.forEach(function(e) {
				(e === '..') ? dir.pop() : (e !== '.' && e !== '') ? dir.push(e) : void 0;
			});
		dir = dir.join(dirChar);
		if(devOptions.printPaths) {
			console.log("********buildPathFromRelativePath********")
			console.log("cdir  : ", cdir)
			console.log("fdir  : ", fdir)
			console.log("result: ", dir)
			console.log("********end buildPathFromRelativePath********")
		}
		return dir;
	}

	// does a tag have an attribute? (attributeName="value")
	function hasTagAttribute(attr, content) {
		return content.indexOf(attr) > -1;
	}

	// get the value of an attribute (attributeName="value")
	function getTagAttribute(attr, content) {
		var fndx = -1,
				lndx = -1;

		fndx = content.indexOf(attr + '="');
		if(fndx === -1) {
			console.warn("Warning: no tag of name `" + attr + "` found in the following content: `" + content + "`")
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
				lndx = -1
				left = ""
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
				lndx = -1
				left = ""
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

		if(hasTagAttribute(attr, middle)) {
			fndx = middle.indexOf(attr + '="');
			left = middle.slice(0, fndx);
			right = middle.slice(fndx + attr.length + 2);
			// really naive for now - just look for another '"'
			lndx = right.indexOf('"');
			if(lndx === -1) {
				console.error('ERROR: No close `"` in tag ' + content)
				return content;
			}
			else {
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
		if(lndx > -1) {
			left = middle.slice(0, lndx);
			right = middle.slice(lndx);
			middle = ` ${attr}="${value}"`;
		}

		return left + middle + right;
	}

	// given a jsonObject and a path, return the data pointed at
	function getDataFromJsonPath(jsonPath, jsonObj) {
		var json = jsonObj || options.jsonInput;
		var result;

		if(jsonPath === '*') return options.jsonInput;
		if(jsonPath === '' || jsonPath === 'this') return json;
		result = jsonPath.split('.').reduce((acc, cur) => acc ? acc[cur] : '', json)

		if(typeof(result) === 'object')
			result = toSafeJsonString(result);

		return result;
	}

	// given a jsonObj, we can convert it to a string for our purposes
	function toSafeJsonString(jsonObj) {
		return JSON.stringify(jsonObj).replace(/\'/g, "\\'").replace(/"/g, "'")
	}

	// Handles the string value inside of rawJson="" attributes
	function processRawJson(jsonString) {
		var jsonData = {};

		if(typeof(jsonString) === 'object')
			jsonString = toSafeJsonString(jsonString);

		try {
			eval('jsonData = ' + jsonString);
		}
		catch(e) {
			console.error(e);
		}
		return jsonData;
	}

	// Splits a string into an array where special tags are on their own
	// can optionally only split it up based on a particular tag
	function splitContent(content, tag) {
		var arr = [],
				fndx = -1,
				lndx = -1,
				partial = "",
				searchPattern = tag || '<!--#';

		//prime the loop
		fndx = content.indexOf(searchPattern);
		if(fndx === -1)
			arr.push(content);

		while(fndx > -1) {
			partial = content.slice(0, fndx);
			arr.push(partial);
			content = content.slice(fndx);
			lndx = content.indexOf('-->');

			if(lndx > -1)
				lndx += 3;
			else
				console.error("ERROR: no closing tag! you are missing a '-->'");

			partial = content.slice(0, lndx);
			arr.push(partial);
			content = content.slice(lndx);
			fndx = content.indexOf(searchPattern);

			// on final pass, push the remainer of the content string
			if(fndx === -1)
				arr.push(content);
		}

		return arr;
	}

	// splits up content into tags and puts rawJson in (if there isn't already a rawJson)
	function addRawJsonWhereJsonPath(content, rawJson, jsonParentPath) {
		var fndx = -1,
				lndx = -1,
				left = ""
				right = "";

		// if we have a parent path, then we need to grab a subset of the rawJson
		if(jsonParentPath && rawJson) {
			let data = processRawJson(rawJson);
			rawJson = getDataFromJsonPath(jsonParentPath, data);
		}

		content = splitContent(content); // '' => ['']

		// if we have an array larger than 1, then there is at least 1 insert to be made
		if(content.length > 1) {

			// process files
			content = content.map(function(fragment, ndx, arr) {
					if(fragment.indexOf('<!--#') === 0 &&
						 hasTagAttribute(jsonPathAttribute, fragment) &&
						 !hasTagAttribute("rawJson", fragment)) {
						fragment = addTagAttribute("rawJson", fragment, rawJson);
					}
					return fragment;
				})

		}
		// re-join content into a string
		content = content.join(''); // [''] => ''
		return content;
	}

	// add json paths together
	function appendJsonParentPath(content, jsonParentPath) {
		var fndx = -1,
				lndx = -1,
				left = ""
				right = "";

		// do nothing if there is no jsonParentPath
		if(jsonParentPath === '' || jsonParentPath === 'this')
			return content;

		content = splitContent(content, '<!--#data'); // '' => ['']

		// if we have an array larger than 1, then there is at least 1 insert to be made
		if(content.length > 1) {

			// process files
			content = content.map(function(fragment, ndx, arr) {
					if(fragment.indexOf('<!--#data') === 0) {
						fndx = fragment.indexOf(`${jsonPathAttribute}="`)
						if(fndx > -1) {
							left = fragment.slice(0, fndx + 10);
							fragment = left + jsonParentPath + '.' + fragment.slice(fndx + 10);
						}
						else {
							console.error("ERROR: '<!--#data' tag with no 'jsonPath'");
						}
					}
					return fragment;
				})

		}
		// re-join content into a string
		content = content.join('') // [''] => ''
		return content;
	}

	// Updates the relative path with the parent's path so it can be resolved on the
	// next turn
	function updateRelativePaths(cdir, content) {
		var dir = "";
		content = splitContent(content);

		content = content.map(function(fragment) {
			if(fragment.indexOf(insertPattern)  === 0 ||
				 fragment.indexOf('<!--#wrap')    === 0) {
				dir = getTagAttribute(filePathAttribute, fragment);
				dir = buildPathFromRelativePath(cdir, dir);
				fragment = setTagAttribute(filePathAttribute, fragment, dir);
				fragment = changeTagAttributeName(filePathAttribute, fragment, "absPath");
			}
			return fragment;
		})

		content = content.join('');
		return content;
	}

	// returns the index of the closing tag for a given opening tag
	function findIndexOfClosingTag(openTag, closeTag, startNdx, arr) {
		var endNdx = -1;
		var openCount = 1;

		for(var i = startNdx + 1; i < arr.length; i++) {
			if(arr[i].indexOf(openTag) === 0)
				openCount++;
			else if(arr[i].indexOf(closeTag) === 0) {
				openCount--;
				if(openCount === 0) {
					endNdx = i;
					break;
				}
			}
		}
		return endNdx;
	}

	// <!--#if jsonPath="" rawJson="" -->
	// <!--#endif -->
	function processIf(file, ndx, arr) {
		var endNdx = -1,
				content = arr[ndx],
				rawJson = "",
				jsonPath = "",
				jsonData;

		if(hasTagAttribute(jsonPathAttribute, content))
			jsonPath = getTagAttribute(jsonPathAttribute, content);

		if(hasTagAttribute('rawJson', content)) {
			rawJson = getTagAttribute('rawJson', content);
			rawJson = processRawJson(rawJson);
		}

		jsonData = getDataFromJsonPath(jsonPath, rawJson);

		// clear if statement
		arr[ndx] = "";

		endNdx = findIndexOfClosingTag('<!--#if', '<!--#endif', ndx, arr);

		// If we have no closing tag, then this is an error
		if(endNdx === -1) {
			console.error("ERROR: in file " + file.path + ": <!--#if . . . --> with no <!--#endif . . . -->");
			return;
		}

		// clear endif statement
		arr[endNdx] = "";

		// If there is no jsonPath we have no way to check the data ...
		if(!jsonPath) {
			console.error("ERROR: in file " + file.path + ": <!--#if --> with no jsonPath");
			return;
		}

		if(typeof(jsonData) === 'undefined' || jsonData == false) {
			for(var i = ndx; i < endNdx; i++)
				arr[i] = "";
		}
	}

	// <!--#each count="" -->
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
		for(let i = startNdx; i <= endNdx; i++)
			if(arr[i].indexOf('<!--#each') === 0)
				return;

		if(hasTagAttribute(jsonPathAttribute, content))
			jsonPath = getTagAttribute(jsonPathAttribute, content);

		if(hasTagAttribute('rawJson', content)) {
			rawJson = getTagAttribute('rawJson', content);
			rawJson = processRawJson(rawJson);
		}

		if(jsonPath)
			jsonData = getDataFromJsonPath(jsonPath, rawJson);

		if(hasTagAttribute('count', content))
			count = parseInt(getTagAttribute('count', content), 10);


		if(Array.isArray(jsonData)) {
			if(!count)
				count = jsonData.length;
			else if(count > jsonData.length) {
				console.warn("WARNING: in file " + file.path + ": <!--#each --> with count attribute higher than array input's length. Changing to length of array");
				count = jsonData.length;
			}
		}

		if(!count) {
			console.error("ERROR: in file " + file.path + ": <!--#each --> with no count attribute, and no array as json object.");
			return;
		}

		endNdx = findIndexOfClosingTag('<!--#each', '<!--#endeach', ndx, arr);

		// If we have no closing tag, then this is an error
		if(endNdx === -1) {
			console.error("ERROR: in file " + file.path + ": <!--#each --> with no <!--#endeach -->");
			return;
		}

		if(endNdx === (ndx - 1))
			console.warn("WARNING: in file " + file.path + ": <!--#each --> with no content");

		// clear end tag
		arr[ndx] = "";
		arr[endNdx] = "";

		middle = arr.splice(startNdx, endNdx - startNdx)

		content = [];

		for(let i = 0; i < count; i++) {

			let tmp = [ ...middle ];
			if(jsonData && Array.isArray(jsonData)) {
				for(let j = 0; j < tmp.length; j++) {
					if(tmp[j].indexOf('<!--#data') === 0 && !hasTagAttribute('rawJson', tmp[j])) {
						if(typeof(jsonData[i]) === 'object') {
							tmp[j] = addTagAttribute('rawJson', tmp[j], toSafeJsonString(jsonData[i]))
						}
						else {
							tmp[j] = '' + jsonData[i];
						}
					}
				}
			}

			content = content.concat(tmp);
		}

		arr.splice.apply(arr, [startNdx, 0].concat(content))
	}

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
				absPathPattern = 'absPath="'
				pattern = (content.indexOf(pathPattern) > -1) ? pathPattern : absPathPattern,
				pathTag = (pattern === pathPattern) ? 'path' : 'absPath';

		// see if we are loading a json path
		if(hasTagAttribute(jsonPathAttribute, content))
			jsonParentPath = getTagAttribute(jsonPathAttribute, content);

		// see if we have raw json to load from
		if(hasTagAttribute('rawJson', content))
			rawJson = getTagAttribute('rawJson', content);

		// get filepath (either relative or absolute)
		filename = (pattern === pathPattern) ?
				getTagAttribute(filePathAttribute, arr[ndx])
			: getTagAttribute("absPath", arr[ndx]);

		// build filepath if its relative
		fpath = (pattern === pathPattern) ?
				buildPathFromRelativePath(file.path, filename)
			: filename;

		// find closing tag
		endNdx = findIndexOfClosingTag('<!--#wrap', '<!--#endwrap', ndx, arr);

		// If we have no closing tag, then this is an error
		if(endNdx === -1) {
			console.error("ERROR: in file " + file.path + ": <!--#wrap . . . --> with no <!--#endwrap . . . -->");
			return "";
		}

		// Get the wrap file and split it in the middle
		if(wrapFiles[fpath]) {
			content = wrapFiles[fpath].content.split(/<!--#middle\s*-->/);
			if(content.length !== 2) {
				console.error("ERROR: in file " + file.path + ": wrap file has no <!--#middle--> or more than one <!--#middle--> tags");
				return "";
			}
		}
		else {
			console.error("ERROR: in file " + file.path + ": no wrapFile by the name `" + filename + "`");
			return "";
		}

		if(rawJson) {
			content[0] = addRawJsonWhereJsonPath(content[0], rawJson, jsonParentPath);
			content[1] = addRawJsonWhereJsonPath(content[1], rawJson, jsonParentPath);
		}
		else if(jsonParentPath) {
			content[0] = appendJsonParentPath(content[0], jsonParentPath);
			content[1] = appendJsonParentPath(content[1], jsonParentPath);
		}

		if(file.tmpPath) {
			content[0] = updateRelativePaths(file.tmpPath, content[0]);
			content[1] = updateRelativePaths(file.tmpPath, content[1]);
		}

		arr[ndx] = content[0];
		arr[endNdx] = content[1];
	}

	// <!--#insert path="" -->
	function processInserts(file) {
		var filename = "",
				rawJson = "",
				jsonPath = "",
				jsonParentPath = "",
				content  = file.content;

		if(hasTagAttribute(jsonPathAttribute, content))
			jsonParentPath = getTagAttribute(jsonPathAttribute, content);

		if(hasTagAttribute('rawJson', content))
			rawJson = getTagAttribute('rawJson', content);

		if(hasTagAttribute(filePathAttribute, content)) {
			filename = getTagAttribute(filePathAttribute, content);
			filename = buildPathFromRelativePath(file.path, filename);
		}
		else if(hasTagAttribute('absPath', content))
			filename = getTagAttribute("absPath", content)

		if(insertFiles[filename])
			content = insertFiles[filename].content;
		else {
			console.error("ERROR: in file " + file.path + ": insert file `" + filename + "` does not exist");
			return "";
		}

		if(rawJson)
			content = addRawJsonWhereJsonPath(content, rawJson);
		else if(jsonParentPath)
			content = appendJsonParentPath(content, jsonParentPath);

		if(file.tmpPath)
			content = updateRelativePaths(file.tmpPath, content);

		return content;
	}

	// <!--#data jsonPath="" default="" -->
	function processJsonData(tag) {
		var jsonPath = "",
				rawJson = "",
				defaultValue = "",
				jsonData = "";

		jsonPath = getTagAttribute(jsonPathAttribute, tag);

		if(hasTagAttribute("default", tag))
			defaultValue = getTagAttribute('default', tag);

		if(hasTagAttribute('rawJson', tag)) {
			rawJson = getTagAttribute('rawJson', tag);
			rawJson = processRawJson(rawJson);
		}

		jsonData = getDataFromJsonPath(jsonPath, rawJson);

		return jsonData || defaultValue;
	}

	// <!--#jsonInsert jsonPath="" default="" -->
	function processJsonInsert(tag) {
		var jsonPath = "",
				rawJson  = "",
				defaultValue = "",
				jsonData = "";

		jsonPath = getTagAttribute(jsonPathAttribute, tag);

		if(hasTagAttribute("default", tag))
			defaultValue = getTagAttribute('default', tag);

		if(hasTagAttribute('rawJson', tag)) {
			rawJson = getTagAttribute('rawJson', tag);
			rawJson = processRawJson(rawJson);
		}

		jsonData = getDataFromJsonPath(jsonPath, rawJson);

		if(jsonData || defaultValue)
			return jsonData || defaultValue;
		else {
			console.error("ERROR: jsonPath `" + jsonPath + "` is undefined");
			return "";
		}
	}

	function processFileWithJsonInput(file) {
		var content = file.content;
		var pathStack = file.path;
		var tempDirectory = "";
		var splitArr = [];
		var itterCount = 0;

		// prime loop: split file into all insertion points
		splitArr = splitContent(content); // '' => ['']

		// if we have an array larger than 1, then there is at least 1 insert to be made
		while(splitArr.length > 1) {
			pathStack = file.path;

			// process files
			for(let i = 0; i < splitArr.length; i++) {
				let fragment = splitArr[i];
				let hasPath = hasTagAttribute(filePathAttribute, fragment);
				let hasAbsPath = hasTagAttribute("absPath", fragment);

				if(hasPath)
					tempDirectory = buildPathFromRelativePath(pathStack, getTagAttribute(filePathAttribute, fragment));
				else if(hasAbsPath) {
					tempDirectory = getTagAttribute("absPath", fragment);
					pathStack= tempDirectory;
				}

				if(fragment.indexOf('<!--#if') === 0) {
					processIf({ ret: 'content', content: fragment, path: pathStack, tmpPath: tempDirectory  }, i, splitArr)
				}
				else if(fragment.indexOf('<!--#each') === 0) {
					processEach({ ret: 'content', content: fragment, path: pathStack, tmpPath: tempDirectory  }, i, splitArr)
				}
				else if(fragment.indexOf('<!--#wrap') === 0) {
					processWraps({ ret: 'content', content: fragment, path: pathStack, tmpPath: tempDirectory  }, i, splitArr);
				}
				else if(fragment.indexOf(insertPattern) === 0) {
					splitArr[i] = processInserts({ ret: 'content', content: fragment, path: pathStack, tmpPath: tempDirectory })
				}
				else if(fragment.indexOf('<!--#data') === 0) {
					splitArr[i] = processJsonData(fragment)
				}
				else if(fragment.indexOf('<!--#jsonInsert') === 0) {
					splitArr[i] = processJsonInsert(fragment);
				}
				pathStack = file.path;
			}

			// re-join content into a string, and repeat
			content = splitArr.join('') // [''] => ''

			// split file into all insertion points
			splitArr = splitContent(content); // '' => ['']

			// debug features
			if(devOptions.printIterations)
				console.log(content);

			if(devOptions.limitIterations) {
				itterCount++;
				if(itterCount >= devOptions.limitIterations)
					break;
			}
		}

		if(devOptions.printResult)
			console.log(content);

		return content;
	}

	//this function will be called within processWraps and processInserts
	function processFile(file) {
		file.content = processFileWithJsonInput(file);
		file.processed = true;
	}


	// <!--#clipbefore -->
	// <!--#clipafter -->
	// <!--#clipbetween -->
	// <!--#endclipbetween -->
	// This runs first, since all of the clipped areas will completely be removed
	function processClip(file) {
		var tmp;

		if(file.content.indexOf('<!--#clipbefore') > -1) {

			file.content = file.content
							.split(/<!--#clipbefore\s*-->/)
							.splice(1)[0]
							.split('<!--#clipafter')
							.splice(0,1)[0];
		}

		if(file.content.indexOf('<!--#clipbetween') > -1) {

			tmp = file.content
					.split(/<!--#clipbetween\s*-->/);

			file.content = tmp[0] + tmp[1].split(/<!--#endclipbetween\s*-->/)[1];
		}
	}

	includer.initialize = function initialize(ops) {
		//reset vars in case these had kept their value in closure
	  wrapFiles = {};
		insertFiles = {};
		pageFiles = [];
		devOptions = ops.dev || {};
		options = ops;

		//set text value for insert tags, or default
		insertPattern = (options.insertPattern) ?
				'<!--#' + options.insertPattern
			: '<!--#insert';

		filePathAttribute = (options.filePathAttribute) ?
				options.filePathAttribute
			: 'path';

		jsonPathAttribute = (options.jsonPathAttribute) ?
				options.jsonPathAttribute
			: 'jsonPath';
	};

	// builds string
	includer.buildFileResult = function buildFileResult(callback) {

		return pageFiles.map(function(file) {
			processFile(file);

			if(callback) {
				callback(file);
			}

			return file;
		});
	};

	// puts files into hash maps
	includer.hashFile = function hashFile(file) {
		var f = File(file);

		processClip(f);

		if(f.name[0] === '_')
			wrapFiles[f.path] = f;
		else if(f.name[0] === '-')
			insertFiles[f.path] = f;
		else
			pageFiles.push(f);
	};

	return includer;
})();
