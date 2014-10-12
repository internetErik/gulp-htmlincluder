var through = require("through2"),
	gutil = require("gulp-util"),
	includer = require("./lib/htmlincluder");

//
// @insertText = (optional) the test looked for in order to insert files 
// 					(this is so ssi includes can be used instead)
//
module.exports = function (insertText) {
	"use strict";
	var that;

	includer.initialize();

	function htmlincluder() {
		includer.buildHtml(function(file) {
			var f = file.file;
			f.contents = new Buffer(file.content);

    		that.push(f);
		});
	}

	function aggregateFiles(file, enc, callback) {

		that = this; //defined in scope of module

		// Do nothing if no contents
		if (file.isNull()) {
			this.push(file);
			return callback();
		}

		if (file.isStream()) {
			this.emit("error",
				new gutil.PluginError("gulp-htmlincluder", "Stream content is not supported"));
			return callback();
		}

		if (file.isBuffer()) {
			includer.hashFile(file, insertText);
		}

		return callback();
	}

	return through.obj(aggregateFiles, htmlincluder);
};