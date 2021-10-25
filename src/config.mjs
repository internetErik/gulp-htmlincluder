export const wrapFiles = {};
export const insertFiles = {};
export const pageFiles = [];

export let options = {};
export let devOptions = {};
export let insertPattern;
export let filePathAttribute;
export let jsonPathAttribute;
export let rawJsonPlugins;

export const configureFiles = file => {
  if(file.name[0] === '_')
    wrapFiles[file.path] = file;
  else if(file.name[0] === '-')
    insertFiles[file.path] = file;
  else
    pageFiles.push(file);
}

// @options = (optional) options for configuring htmlIncluder
// options.jsonInput         = A json object used to populate data in files
// options.insertPattern     = The test looked for in order to insert files
//          (this is so ssi includes can be used instead)
// options.filePathAttribute = the name used for the file pathing for #insert
//          and #wrap (default= 'path')
// options.jsonPathAttribute = the name used for the file pathing for #insert
//          , #wrap, #data, #jsonInsert (default= 'jsonPath')
// options.rawJsonPlugins = list of functions passed in to be used in processRawJson call
//
//
// options.dev.limitIterations = the number of times processFileWithJsonInput will loop
// options.dev.printIterations = console log each processFileWithJsonInput loop
// options.dev.printResult = console logs the final output
// options.dev.printPaths = console logs the output of buildPathFromRelativePath
export const setOptions = ops => {
  devOptions = ops.dev || {};
  options = ops;

  //set text value for insert tags, or default
  insertPattern = (options.insertPattern)
    ? '<!--#' + options.insertPattern
    : '<!--#insert';

  filePathAttribute = (options.filePathAttribute)
    ? options.filePathAttribute
    : 'path';

  jsonPathAttribute = (options.jsonPathAttribute)
    ? options.jsonPathAttribute
    : 'jsonPath';

  rawJsonPlugins = (options.rawJsonPlugins)
  ? options.rawJsonPlugins
  : {};
}
