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

module.exports = (function htmlSSI() {
	var includer = {},
	    wrapFiles = {},
		insertFiles = {},
		pageFiles = [];

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
			.map(function(e) {
				(e === '..') ? dir.pop() : (e !== '.' && e !== '') ? dir.push(e) : void 0;
			});
			
		return dir.join(dirChar);
	}

	function processInserts(file) {
		var didWork  = false,
			top      = "",
			bottom   = "",
			filename = "",
			fndx     = -1,
			lndx     = -1,
			content  = file.content;

		fndx = content.indexOf('<!--#include');
		while(fndx > -1) {
			didWork = true;
			top = content.slice(0,fndx);
			content = content.slice(fndx);
			lndx = content.indexOf('-->') + 3;

			filename = content.slice(0, lndx).split('"')[1];
			bottom = content.slice(lndx);
			filename = buildPathFromRelativePath(file.path, filename);
			
			if(insertFiles[filename]) {
				processFile(insertFiles[filename]);
				content = top + insertFiles[filename].content + bottom;
			}
			else {
				console.log("ERROR in file " + file.path + ": insert file `" + filename + "` does not exist");
				return false;
			}

			fndx = content.indexOf('<!--#include');
		}

		file.content = content;
		return didWork;
	}

	//this function will be called within processWraps and processInserts
	function processFile(file) {
		var changed = true;

		while(changed && !file.processed) {
			changed = false;
			changed = processInserts(file);
		}
		file.processed = true;
	}

	includer.initialize = function initialize() {
		//reset vars in case these had kept their value in closure
	    wrapFiles = {};
		insertFiles = {};
		pageFiles = [];
	};

	includer.buildHtml = function buildHtml(callback) {
		return pageFiles.map(function(file) {
			processFile(file);

			if(callback) {
				callback(file);
			}

			return file;
		});
	};

	includer.hashFile = function hashFile(file) {
		var f = File(file);

		if(f.name[0] === '_')
			insertFiles[f.path] = f;
		else
			pageFiles.push(f);

	};

	return includer;
})();
