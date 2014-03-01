function File(file){
	var f = {
		name : '',
		path : file.path,
		content : file.contents.toString('utf8')
	};

	f.name = file.path.split('\\');
	f.name = f.name[filename.length-1];

	return f;
}

var fileParser = (function fileParser(){
	var parser = {};

	
	return parser;
})();

var fileBuilder = (function fileBuilder(){
	var builder = {};

	builder.clipFile = function clipFile() {

	};

	return builder;
})();

module.exports = (function htmlIncluder() {
	var includer = {};

	var wrapFiles = {},
		insertFiles = {},
		pageFiles = [];

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

	includer.buildHtml = function buildHtml() {
		return pageFiles.map(function(file) {

		});
	};

	return includer;
})();