import { hasTagAttribute, getTagAttribute } from '../attributes';
import { jsonPathAttribute, filePathAttribute, wrapFiles } from '../config';
import { addRawJsonWhereJsonPath, appendJsonParentPath } from '../json';
import { buildPathFromRelativePath, updateRelativePaths } from '../util/file';
import { findIndexOfClosingTag } from '../util/parsing';

// <!--#wrap path="" jsonPath="" rawJson="" -->
// <!--#middle -->
// <!--#endwrap -->
export default function processWraps(file, ndx, arr) {
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
  filename = (pattern === pathPattern)
    ? getTagAttribute(filePathAttribute, arr[ndx])
    : getTagAttribute("absPath", arr[ndx]);

  // build filepath if its relative
  fpath = (pattern === pathPattern)
    ? buildPathFromRelativePath(file.path, filename)
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
