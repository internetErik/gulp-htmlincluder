function File(file){
	var f = {
		name : '',
		path : file.path,
		content : file.contents.toString('utf8'),
		file : file
	};

	f.name = file.path.split('\\');
	f.name = f.name[f.name.length-1];

	return f;
}

module.exports = (function htmlIncluder() {
	var includer = {};

	var wrapFiles = {},
		insertFiles = {},
		pageFiles = [];

	function processClip(file) {

		if(file.content.indexOf('<!--#clipbefore') > -1) {

			file.content    = file.content
							.split('<!--#clipbefore -->')
							.splice(1)[0]
							.split('<!--#clipafter')
							.splice(0,1)[0];
		}
	}

	function processWraps(file) {			
		var aboveWrap  = "",
			topWrap    = "",
			middle     = "",
			bottomWrap = "",
			belowWrap  = "",
			filename   = "",
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

			middle = middle.slice(lndx);
			fndx =  middle.indexOf('<!--#endwrap file="'+ filename); 
			
			if(fndx > -1) {
				belowWrap = middle.slice(fndx);
				middle = middle.slice(0,fndx);
				lndx = belowWrap.indexOf('-->')+3;
				belowWrap = belowWrap.slice(lndx);
			}
			else {
				console.log("ERROR in file " + file.path + ": <!--#wrap --> with no <!--#endwrap -->");
				break;
			}

			if(wrapFiles[filename]) {
				processClip(wrapFiles[filename]);
				topWrap = wrapFiles[filename].content;
				topWrap = topWrap.split('<!--#middle-->');
				if(topWrap.length === 2) {
					bottomWrap = topWrap[1];
					topWrap = topWrap[0];
				}
				else {
					console.log("ERROR in file " + file.path + ": wrap file has no <!--#middle--> or more than one <!--#middle--> tags");
					break;
				}
			}
			else {
				console.log("ERROR in file " + file.path + ": no wrapFile by the name `" + filename + "`");
				break;
			}

			content = aboveWrap + topWrap + middle + bottomWrap + belowWrap;

			fndx = content.indexOf('<!--#wrap');
		}
		file.content = content;
		return didWork;
	}

	function processInserts(file) {
		var didWork  = false,
			top      = "",
			bottom   = "",
			filename = "",
			fndx     = -1,
			lndx     = -1,
			content  = file.content;

		fndx = content.indexOf('<!--#insert');
		while(fndx > -1) {
			didWork = true;
			top = content.slice(0,fndx);
			content = content.slice(fndx);
			lndx = content.indexOf('-->') + 3;

			filename = content.slice(0, lndx).split('"')[1];
			bottom = content.slice(lndx);

			if(insertFiles[filename]) {
				processClip(insertFiles[filename]);
				content = top + insertFiles[filename].content + bottom;
			}
			else {
				console.log("ERROR in file " + file.path + ": insert file `"+filename+"` does not exist");
				break;
			}

			fndx = content.indexOf('<!--#insert');
		}

		file.content = content;
		return didWork;
	}

	includer.hashFile = function hashFile(file) {
		var f = File(file);

		if(f.name[0] === '_') {
			wrapFiles[f.name] = f;
		}
		else if(f.name[0] === '-') {
			insertFiles[f.name] = f;
		}
		else {
			pageFiles.push(f);
		}
	};

	includer.buildHtml = function buildHtml(callback) {
		var files = pageFiles.map(function(file) {
			var loop = true;

			processClip(file);
			
			while(loop) {	
				loop = processWraps(file);
				loop = processInserts(file);
			}

			console.log(file.content);
			
			if(callback) {
				callback(file);
			}

			return file;
		});

		return files;

	};

	return includer;
})();