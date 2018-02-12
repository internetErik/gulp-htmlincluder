export const wrapFiles = {};
export const insertFiles = {};
export const pageFiles = [];

export let options = {};
export let devOptions = {};
export let insertPattern;
export let filePathAttribute;
export let jsonPathAttribute;

export const configureFiles = file => {
  if(file.name[0] === '_')
    wrapFiles[file.path] = file;
  else if(file.name[0] === '-')
    insertFiles[file.path] = file;
  else
    pageFiles.push(file);
}

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
}
