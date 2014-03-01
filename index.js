var through = require("through2"),
	gutil = require("gulp-util"),
	includer = require("./lib/htmlincluder");

module.exports = function (param) {
	"use strict";

	function htmlincluder() {
		includer.buildHtml();
	}

	function aggregateFiles(file, enc, callback) {
		var filename = "";

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
			includer.hashFile(file);
		}

		return callback();
	}
	
	return through.obj(aggregateFiles, htmlincluder);
};
