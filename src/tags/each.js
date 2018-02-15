import { hasTagAttribute, getTagAttribute, addTagAttribute } from '../attributes';
import { processRawJson, toSafeJsonString } from '../json';
import { getDataFromJsonPath, findIndexOfClosingTag } from '../util/parsing';
import { jsonPathAttribute } from '../config';

// <!--#each count="" jsonPath="" rawJson="" -->
// <!--#endeach -->
export default function processEach(file, ndx, arr, jsonContext) {
  let endNdx = -1,
      startNdx = ndx + 1,
      content = arr[ndx],
      jsonPath = "",
      rawJson = "",
      jsonData = "",
      count = false;

  // if there is an inner each, we do these first, so return
  for(let i = startNdx; i <= endNdx; i++)
    if(arr[i].indexOf('<!--#each') === 0)
      return;

  if(hasTagAttribute(jsonPathAttribute, content))
    jsonPath = getTagAttribute(jsonPathAttribute, content);

  if(hasTagAttribute('rawJson', content)) {
    rawJson = getTagAttribute('rawJson', content);
    rawJson = processRawJson(rawJson);
  }
  else if(jsonContext)
    rawJson = processRawJson(jsonContext);

  if(jsonPath)
    jsonData = getDataFromJsonPath(jsonPath, rawJson);

  if(hasTagAttribute('count', content))
    count = parseInt(getTagAttribute('count', content), 10);

  if(Array.isArray(jsonData)) {
    if(!count)
      count = jsonData.length;
    else if(count > jsonData.length) {
      console.warn("WARNING: in file " + file.path + ": <!--#each --> with count attribute higher than array input's length. Changing to length of array");
      count = jsonData.length;
    }
  }

  if(!count && !jsonPath) {
    console.error("ERROR: in file " + file.path + ": <!--#each --> with no count attribute, and no array as json object.");
    return;
  }

  endNdx = findIndexOfClosingTag('<!--#each', '<!--#endeach', ndx, arr);

  // If we have no closing tag, then this is an error
  if(endNdx === -1) {
    console.error("ERROR: in file " + file.path + ": <!--#each --> with no <!--#endeach -->");
    return;
  }

  if(endNdx === (ndx - 1))
    console.warn("WARNING: in file " + file.path + ": <!--#each --> with no content");

  // clear end tag
  arr[ndx] = "";
  arr[endNdx] = "";

  let middle = arr.splice(startNdx, endNdx - startNdx);

  content = [];

  // create all the duplicates of the data with the proper inserted data
  for(let i = 0; i < count; i++) {
    let tmp = [ ...middle ]; // clone the lines we are adding

    // if we have jsonData to insert ...
    if(jsonData && Array.isArray(jsonData)) {
      for(let j = 0; j < tmp.length; j++) {
        if(!hasTagAttribute('rawJson', tmp[j])) {
          if(tmp[j].indexOf('<!--#') === 0) {
            if(typeof(jsonData[i]) === 'object') {
              tmp[j] = [toSafeJsonString(jsonData[i]), jsonPath, file.path, tmp[j]];
            }
            else if(tmp[j].indexOf('<!--#data') === 0) {
              tmp[j] = '' + jsonData[i];
            }
          }
        }
      }
    }

    // add the new lines to the content
    content = content.concat(tmp);
  }

  arr.splice.apply(arr, [startNdx, 0].concat(content))
}
