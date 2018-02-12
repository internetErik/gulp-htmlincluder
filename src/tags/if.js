import { hasTagAttribute, getTagAttribute } from '../attributes';
import { processRawJson } from '../json';
import { getDataFromJsonPath, findIndexOfClosingTag } from '../util/parsing';
import { jsonPathAttribute } from '../config';

// <!--#if jsonPath="" rawJson="" -->
// <!--#endif -->
export default function processIf(file, ndx, arr) {
  let endNdx = -1,
      content = arr[ndx],
      rawJson = "",
      jsonPath = "",
      jsonData;

  if(hasTagAttribute(jsonPathAttribute, content))
    jsonPath = getTagAttribute(jsonPathAttribute, content);

  if(hasTagAttribute('rawJson', content)) {
    rawJson = getTagAttribute('rawJson', content);
    rawJson = processRawJson(rawJson);
  }

  jsonData = getDataFromJsonPath(jsonPath, rawJson);

  // clear if statement
  arr[ndx] = "";

  endNdx = findIndexOfClosingTag('<!--#if', '<!--#endif', ndx, arr);

  // If we have no closing tag, then this is an error
  if(endNdx === -1) {
    console.error("ERROR: in file " + file.path + ": <!--#if . . . --> with no <!--#endif . . . -->");
    return;
  }

  // clear endif statement
  arr[endNdx] = "";

  // If there is no jsonPath we have no way to check the data ...
  if(!jsonPath) {
    console.error("ERROR: in file " + file.path + ": <!--#if --> with no jsonPath");
    return;
  }

  if(typeof(jsonData) === 'undefined' || jsonData == false) {
    for(var i = ndx; i < endNdx; i++)
      arr[i] = "";
  }
}
