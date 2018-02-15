var through = require("through2"),
		gutil = require("gulp-util"),
		includer = require("./lib/htmlincluder");

// @options = (optional) options for configuring htmlIncluder
// options.jsonInput         = A json object used to populate data in files
// options.insertPattern     = The test looked for in order to insert files
// 					(this is so ssi includes can be used instead)
// options.filePathAttribute = the name used for the file pathing for #insert
// 					and #wrap (default= 'path')
// options.jsonPathAttribute = the name used for the file pathing for #insert
// 					, #wrap, #data, #jsonInsert (default= 'jsonPath')
//
//
// options.dev.limitIterations = the number of times processFileWithJsonInput will loop
// options.dev.printIterations = console log each processFileWithJsonInput loop
// options.dev.printResult = console logs the final output
// options.dev.printPaths = console logs the output of buildPathFromRelativePath
//
module.exports = function (options) {
	"use strict";
	var that;

	includer.initialize(options);

	function htmlincluder() {
		includer.buildFileResult(function(file) {
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
			includer.hashFile(file);
		}

		return callback();
	}

	return through.obj(aggregateFiles, htmlincluder);
};