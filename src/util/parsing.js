import { toSafeJsonString } from '../json';
import { options } from '../config';

// given a jsonObject and a path, return the data pointed at
export function getDataFromJsonPath(jsonPath, jsonObj) {
  var json = jsonObj || options.jsonInput;
  var result;

  if(jsonPath === '*') return options.jsonInput;
  if(jsonPath === 'this') return json;
  result = jsonPath.split('.').reduce((acc, cur) => acc ? acc[cur] : '', json)

  if(Array.isArray(result));
  else if(typeof(result) === 'object')
    result = toSafeJsonString(result);

  return result;
}

// Given some content (starting with a tag) find the index after the end tag
export function getIndexOfClosingBrace(content, startPattern, endPattern) {
  let tagDepth = 0;// when this gets to 0 we are done
  let tmpContent = content.substr(1);

  // prime loop by finding next start tag
  let nextCloseNdx = tmpContent.indexOf(endPattern);
  let nextOpenNdx = tmpContent.indexOf(startPattern);

  if(nextCloseNdx ===  -1)
    console.error('No Close tag');

  // if there is a nextCloseNdx, but no openNdx, return the end of the tag.
  if(nextOpenNdx === -1 || nextOpenNdx > nextCloseNdx)
    return nextCloseNdx + 4;

  // Now we know that we have an inner tag ... or should if the syntax is correct

  // we found an open tag, so we need a close tag. Set depth to 1
  tagDepth = 1;

  // add 1 so we will search passed the tag
  nextOpenNdx += 1;
  nextCloseNdx += 1;

  // while current tag is not closed...
  do {
    let tmpOpen, tmpClosed;

    // start tag is before close tag, then
    // we can look to see if there is yet another tag nested between
    if(nextOpenNdx > -1 && nextOpenNdx < nextCloseNdx) {
      tmpOpen = tmpContent.substr(nextOpenNdx).indexOf(startPattern);
      // see if we found something, and add this new index to our accumulator
      if(tmpOpen > -1) {
        // add 1 because we need next search to be beyond this tag
        nextOpenNdx += tmpOpen + 2;
        tagDepth += 1;
      }
      else
        nextOpenNdx = -1;
    }
    else { // current close tag is before start tag
      tmpClosed = tmpContent.substr(nextCloseNdx).indexOf(endPattern);
      // see if we found something, and add this new index to our accumulator
      if(tmpClosed > -1) {
        // add 1 because we need next search to be beyond this tag
        nextCloseNdx += tmpClosed + 2;
        tagDepth -= 1;
      }
      else if(tagDepth > 0) {
        console.error('There is an unclosed tag', content);
        break;
      }
    }
  } while(tagDepth > 0)

  nextCloseNdx += 4;

  if(nextCloseNdx === -1)
    console.error("ERROR: no closing tag! you are missing a '" + endPattern + "'");

  return nextCloseNdx;
}

// Splits a string into an array where special tags are on their own
// can optionally only split it up based on a particular tag
export function splitContent(content, tag) {
  let arr = [],
      openNdx = -1,
      closeNdx = -1,
      partial = "",
      startPattern = tag || '<!--#',
      endPattern = '-->';

  //prime the loop
  openNdx = content.indexOf(startPattern);

  if(openNdx === -1)
    return [content];

  while(openNdx > -1) {
    partial = content.slice(0, openNdx);
    arr.push(partial);
    content = content.slice(openNdx);

    // get the closeNdx despite inner open tags
    // openNdx-><!-- <!-- --> <!-- <!-- --> --> --><-closeNdx
    let closeNdx = getIndexOfClosingBrace(content, startPattern, endPattern);

    partial = content.slice(0, closeNdx);
    arr.push(partial);
    content = content.slice(closeNdx);
    openNdx = content.indexOf(startPattern);

    // on final pass, push the remainer of the content string
    if(openNdx === -1)
      arr.push(content);
  }

  return arr;
}

// ToDo. These should go to a better place, for now only one place was using a
// magic number
const RAW_JSON_NDX  = 0;
const JSON_PATH_NDX = 1;
const FILE_PATH_NDX = 2;
const CONTENT_NDX   = 3;

// returns the index of the closing tag for a given opening tag
export function findIndexOfClosingTag(openTag, closeTag, startNdx, arr) {
  var endNdx = -1;
  var openCount = 1;

  for(var i = startNdx + 1; i < arr.length; i++) {
    let fragment = (Array.isArray(arr[i]))
      ? arr[i][CONTENT_NDX] // [i] contains [rawJson, jsonPath, filePath, content]
      : arr[i];

    if(fragment.indexOf(openTag) === 0)
      openCount++;
    else if(fragment.indexOf(closeTag) === 0) {
      openCount--;
      if(openCount === 0) {
        endNdx = i;
        break;
      }
    }
  }
  return endNdx;
}
