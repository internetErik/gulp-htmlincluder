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
      jsonPath = '',
      rawJson = '',
      jsonData = '',
      count = false;

  // find the closing tag for this each
  endNdx = findIndexOfClosingTag('<!--#each', '<!--#endeach', ndx, arr);

  // If we have no closing tag, then this is an error
  if(endNdx === -1) {
    console.error("ERROR: in file " + file.path + ": <!--#each --> with no <!--#endeach -->");
    return;
  }

  // Maybe don't allow empty each tags
  if(endNdx === (ndx - 1))
    console.warn("WARNING: in file " + file.path + ": <!--#each --> with no content");

  // look up the jsonPath used for this
  if(hasTagAttribute(jsonPathAttribute, content))
    jsonPath = getTagAttribute(jsonPathAttribute, content);

  // see if there is rawJson on this, or get the jsonContext intead
  if(hasTagAttribute('rawJson', content)) {
    rawJson = getTagAttribute('rawJson', content);
    rawJson = processRawJson(rawJson);
  }
  else if(jsonContext)
    rawJson = processRawJson(jsonContext);

  // if we have a path to look up data with, then use it
  if(jsonPath)
    jsonData = getDataFromJsonPath(jsonPath, rawJson);

  // see if there is a hard coded loop count
  if(hasTagAttribute('count', content))
    count = parseInt(getTagAttribute('count', content), 10);

  // Check if the jsonData is an array, if it is we should use it for the count
  if(Array.isArray(jsonData)) {
    // if we don't have a count, set it to length,
    // else we will constrain how many items we will loop on
    if(!count)
      count = jsonData.length;
    else if(count > jsonData.length) {
      console.warn("WARNING: in file " + file.path + ": <!--#each --> with count attribute higher than array input's length. Changing to length of array");
      count = jsonData.length;
    }
  }

  // If there is no count and no jsonPath, then there is probably something forgotten
  if(!count && !jsonPath) {
    console.error("ERROR: in file " + file.path + ": <!--#each --> with no count attribute, and no array as json object.");
    return;
  }

  ///
  /// At this point we have the start and end indexes, and the data we are using
  /// to render the content between the statements.
  ///
  /// The strategy used is to get this content, and then to duplicate it as many
  /// times as the count. The content is all now within an array that replaces
  /// everything from the current index to the index of the ending each tag.
  ///

  // clear end tag
  arr[ndx] = '';
  arr[endNdx] = '';

  let middleMaster = arr.splice(startNdx, endNdx - startNdx).join('');

  content = [];

  // create all the duplicates of the data with the proper inserted data
  for(let i = 0; i < count; i++)
    if(jsonData)
      content.push([jsonData[i], middleMaster ])
    else
      content.push(middleMaster);

  // cut out original each, and replace with array
  arr.splice(ndx, 2, content);
}
