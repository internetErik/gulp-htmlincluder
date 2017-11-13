
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
			options;

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

	function fixFilePathForOS(path) {
		return (isWin) ? path.replace(/\//g, '\\') : path.replace(/\\/g, '/');
	}

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

		return dir.join(dirChar);
	}

	function hasTagAttribute(attr, content) {
		return content.indexOf(attr) > -1;
	}

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

	function getDataFromJsonPath(jsonPath, jsonObj) {
		var json = jsonObj ? jsonObj : options.jsonInput;
		var result = jsonPath.split('.').reduce(function(acc, cur){
				return acc ? acc[cur] : json[cur]
			}, void(0))

		return result;
	}

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

			if(lndx > -1) {
				lndx += 3;
			}
			else {
				console.error("ERROR: no closing tag! you are missing a '-->'");
			}

			partial = content.slice(0, lndx);
			arr.push(partial);
			content = content.slice(lndx);
			fndx = content.indexOf(searchPattern);

			// on final pass, push the remainer of the content string
			if(fndx === -1) {
				arr.push(content);
			}
		}

		return arr;
	}

	// <!--#wrap path="" -->
	// <!--#middle -->
	// <!--#endwrap path="" -->
	function processWrapsJson(file, ndx, arr) {
		var endNdx = -1,
				fpath = "",
				content = arr[ndx],
				filename = "",
				pathPattern = 'path="',
				absPathPattern = 'absPath="'
				pattern = (content.indexOf(pathPattern) > -1) ? pathPattern : absPathPattern,
				pathTag = (pattern === pathPattern) ? 'path' : 'absPath';

		filename = (pattern === pathPattern) ?
				getTagAttribute(filePathAttribute, arr[ndx])
			: getTagAttribute("absPath", arr[ndx]);

		fpath = (pattern === pathPattern) ?
				buildPathFromRelativePath(file.path, filename)
			: filename;

		// lookup index of <!--#endwrap in array
		for(var i = ndx + 1; i < arr.length; i++) {
			var tmp = arr[i].indexOf('<!--#endwrap');
			if(tmp === 0 && filename === getTagAttribute(pathTag, arr[i])) {
				endNdx = i;
				break;
			}
		}

		// If we have no closing tag, then this is an error
		if(endNdx === -1) {
			console.error("ERROR: in file " + file.path + ": <!--#wrap . . . --> with no <!--#endwrap . . . -->");
			return "";
		}

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

		arr[endNdx] = content[1];
		return content[0];
	}

	function updateRelativePaths(cdir, content) {
		var dir = "";
		content = splitContent(content);

		content = content.map(function(fragment) {
			if(fragment.indexOf(insertPattern)  === 0 ||
				 fragment.indexOf('<!--#wrap')    === 0 ||
				 fragment.indexOf('<!--#endwrap') === 0) {
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

	// add json paths together
	function appendJsonParentPath(content, jsonParentPath) {
		var fndx = -1,
				lndx = -1,
				left = ""
				right = "";
		// do nothing if there is no jsonParentPath
		if(jsonParentPath === '')
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
		// re-join content into a string, and repeat
		content = content.join('') // [''] => ''
		return content;
	}

	// <!--#insert path="" -->
	function processInsertsJson(file) {
		var filename = "",
				jsonPath = "",
				jsonParentPath = "",
				content  = file.content;

		if(hasTagAttribute(jsonPathAttribute, content))
			jsonParentPath = getTagAttribute(jsonPathAttribute, content);


		if(hasTagAttribute(filePathAttribute, content)) {
			filename = getTagAttribute(filePathAttribute, content);
			filename = buildPathFromRelativePath(file.path, filename);
		}
		else if(hasTagAttribute("absPath", content)) {
			filename = getTagAttribute("absPath", content)
		}

		if(insertFiles[filename]) {
			content = insertFiles[filename].content;
		}
		else {
			console.error("ERROR: in file " + file.path + ": insert file `" + filename + "` does not exist");
				return "";
		}

		if(jsonParentPath)
			content = appendJsonParentPath(content, jsonParentPath);

		if(file.tmpPath)
			content = updateRelativePaths(file.tmpPath, content);

		return content;
	}

	// <!--#data jsonPath="" -->
	function processJsonData(tag) {
		var jsonPath = "",
				jsonData = "";

		jsonPath = getTagAttribute(jsonPathAttribute, tag);
		jsonData = getDataFromJsonPath(jsonPath)

		return jsonData ? jsonData : "";
	}

	// <!--#jsonInsert jsonPath="" -->
	function processJsonInsert(tag) {
		var jsonPath = "",
				rawJson  = "",
				jsonData = "";

		jsonPath = getTagAttribute(jsonPathAttribute, tag);
		rawJson = getTagAttribute('rawJson', tag);

		if(rawJson)
			eval('rawJson = ' + rawJson);

		jsonData = getDataFromJsonPath(jsonPath, rawJson);

		if(jsonData)
			return jsonData;
		else {
			console.error("ERROR: jsonPath `" + jsonPath + "` is undefined");
			return "";
		}
	}

	function processFileWithJsonInput(file) {
		var changed = true;
		var content = file.content;
		var tempDirectory = "";
		var i = 0;
		while(changed) {
			changed = false;
			// split file into all insertion points
			content = splitContent(content); // '' => ['']

			// if we have an array larger than 1, then there is at least 1 insert to be made
			if(content.length > 1) {
				changed = true;

				// process files
				content = content.map(function(fragment, ndx, arr) {
						var hasPath = hasTagAttribute(filePathAttribute, fragment);
						var hasAbsPath = hasTagAttribute("absPath", fragment);

						if(hasPath)
							tempDirectory = buildPathFromRelativePath(file.path, getTagAttribute(filePathAttribute, fragment));
						else if(hasAbsPath)
							tempDirectory = getTagAttribute("absPath", fragment);

						if(fragment.indexOf('<!--#jsonInsert') === 0) {
							fragment = processJsonInsert(fragment);
						}
						else if(fragment.indexOf(insertPattern) === 0) {
							fragment = processInsertsJson({ ret: 'content', content: fragment, path: file.path, tmpPath: tempDirectory })
						}
						else if(fragment.indexOf('<!--#data') === 0) {
							fragment = processJsonData(fragment)
						}
						else if(fragment.indexOf('<!--#wrap') === 0) {
							// we update the top here, and the bottom inside of processWrapsJson
							fragment = processWrapsJson({ ret: 'content', content: fragment, path: file.path, tmpPath: tempDirectory  }, ndx, arr);
						}

						return fragment;
					})
			}
			// re-join content into a string, and repeat
			content = content.join('') // [''] => ''
			if(i > 6) break;
			i++
		}
		return content;
	}

	//this function will be called within processWraps and processInserts
	function processFile(file) {
		var changed = true;
		if(options.jsonInput) {
			file.content = processFileWithJsonInput(file);
		}
		else {
			// this legacy approach only supports basic json inserting, but is faster (in theory)
			while(changed && !file.processed) {
				changed = false;
				changed = processWraps(file);
				changed = processInserts(file);
			}
		}

		file.processed = true;
	}

	// <!--#wrap path="" -->
	// <!--#middle -->
	// <!--#endwrap path="" -->
	function processWraps(file) {
		var aboveWrap  = "",
			topWrap    = "",
			middle     = "",
			bottomWrap = "",
			belowWrap  = "",
			filename   = "",
			fpath      = "",
	    fndx       = -1
	    lndx       = -1,
	    didWork    = false,
			content    = file.content;

		//prime the loop
		fndx = content.indexOf('<!--#wrap');
		while(fndx > -1) {
			didWork = true;
			//first goal is to get the file broken into three parts.
				//1) the part above the wrap tag
				//2) the part between the wrap tags
				//3) the part below the endwrap tag

			aboveWrap = content.slice(0, fndx);
			middle    = content.slice(fndx);
			lndx = middle.indexOf('-->')+3;

			filename = middle.slice(0, lndx).split('"')[1];
			fpath = buildPathFromRelativePath(file.path, filename);

			middle = middle.slice(lndx);
			fndx =  middle.indexOf('<!--#endwrap path="'+ filename);

			if(fndx > -1) {
				belowWrap = middle.slice(fndx);
				middle = middle.slice(0,fndx);
				lndx = belowWrap.indexOf('-->')+3;
				belowWrap = belowWrap.slice(lndx);
			}
			else {
				console.error("ERROR: in file " + file.path + ": <!--#wrap . . . --> with no <!--#endwrap . . . -->");
				return false;
			}

			if(wrapFiles[fpath]) {
				processFile(wrapFiles[fpath]);
				topWrap = wrapFiles[fpath].content;
				topWrap = topWrap.split(/<!--#middle\s*-->/);
				if(topWrap.length === 2) {
					bottomWrap = topWrap[1];
					topWrap = topWrap[0];
				}
				else {
					console.error("ERROR: in file " + file.path + ": wrap file has no <!--#middle--> or more than one <!--#middle--> tags");
					return false;
				}
			}
			else {
				console.error("ERROR: in file " + file.path + ": no wrapFile by the name `" + filename + "`");
				return false;
			}

			content = aboveWrap + topWrap + middle + bottomWrap + belowWrap;

			fndx = content.indexOf('<!--#wrap');
		}

		file.content = content;
		return didWork;
	}

	// <!--#insert path="" -->
	function processInserts(file) {
		var didWork  = false,
			top      = "",
			bottom   = "",
			filename = "",
			jsonPath = "",
			fndx     = -1,
			lndx     = -1,
			content  = file.content;


		fndx = content.indexOf(insertPattern);
		while(fndx > -1) {
			didWork = true;
			top = content.slice(0,fndx);
			content = content.slice(fndx);
			lndx = content.indexOf('-->') + 3;

			filename = getTagAttribute(filePathAttribute, content);
			filename = buildPathFromRelativePath(file.path, filename);

			bottom = content.slice(lndx);

			if(insertFiles[filename]) {
				processFile(insertFiles[filename]);
				content = top + insertFiles[filename].content + bottom;
			}
			else {
				console.error("ERROR: in file " + file.path + ": insert file `" + filename + "` does not exist");
				if(file.ret === 'content') {
					return "";
				}
				else {
					return false;
				}
			}

			fndx = content.indexOf(insertPattern);
		}

		file.content = content;
		return didWork;
	}

	includer.initialize = function initialize(ops) {
		//reset vars in case these had kept their value in closure
	  wrapFiles = {};
		insertFiles = {};
		pageFiles = [];
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
