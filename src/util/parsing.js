import { toSafeJsonString } from '../json';

export function stripInnerTags(content) {
  // tmpContent = '!-- ... --';
  let tmpContent = content.substr(0, content.length - 1).substr(1);

  let startNdx = tmpContent.indexOf('<!--#');

  if(startNdx === -1)
    return content;

  while(startNdx !== -1) {
    let closeNdx = parseToClosingTag(tmpContent.substr(startNdx), '<!--#', '-->');
    if(closeNdx > -1) {
      tmpContent = tmpContent.substr(0, startNdx) + tmpContent.substr(closeNdx);
      startNdx = startNdx = tmpContent.indexOf('<!--#');
    }
    else {
      console.warn('stripInnerTags - No closing tag');
      break;
    }
  }

  return '<' + tmpContent + '>';
}


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
export function parseToClosingTag(content, searchPattern, endPattern) {
  let lndx = content.indexOf(endPattern);
  let tagDepth = 1;// when this gets to 0 we are done
  let nextCloseNdx = lndx;

  // prime loop by finding next start tag
  let nextOpenNdx = content.substr(1).indexOf(searchPattern);
  // make sure that it is necessary to look for internal tags
  if(nextOpenNdx > -1 && nextOpenNdx < nextCloseNdx) {
    nextOpenNdx++;
    // while current tag is not closed...
    while(tagDepth > 0) {
      // start tag is before current close tag
      if(nextOpenNdx > -1 && nextOpenNdx < nextCloseNdx) { // Then we need to find the next lndx
        tagDepth++;
        // find an open tag between 0 and lndx
        let tmp = content.substr(nextOpenNdx + 1).indexOf(searchPattern);
        if(tmp === -1)
          nextOpenNdx = -1;
        else
          nextOpenNdx += tmp + 1;
      }
      else { // current close tag is before start tag
        let tmp = content.substr(nextCloseNdx).indexOf(endPattern);
        if(tmp === -1)
          nextCloseNdx = -1;
        else
          nextCloseNdx += tmp + 1;

        tagDepth--;
        if(tagDepth > 0 && nextCloseNdx === -1)
          console.error('There is an unclosed tag', content);
      }
    }
    // should be the ndx of the last closing tag related to the current tag we are parsing
    lndx = nextCloseNdx;
  }

  if(lndx > -1)
    lndx += endPattern.length;
  else
    console.error("ERROR: no closing tag! you are missing a '"+endPattern+"'");

  return lndx
}

// Splits a string into an array where special tags are on their own
// can optionally only split it up based on a particular tag
export function splitContent(content, tag) {
  let arr = [],
      fndx = -1,
      lndx = -1,
      partial = "",
      searchPattern = tag || '<!--#',
      endPattern = '-->';

  //prime the loop
  fndx = content.indexOf(searchPattern);
  if(fndx === -1)
    arr.push(content);

  while(fndx > -1) {
    partial = content.slice(0, fndx);
    arr.push(partial);
    content = content.slice(fndx);

    // get the lndx despite inner open tags like <!-- <!-- --> -->
    let lndx = parseToClosingTag(content, searchPattern, endPattern);

    partial = content.slice(0, lndx);
    arr.push(partial);
    content = content.slice(lndx);
    fndx = content.indexOf(searchPattern);

    // on final pass, push the remainer of the content string
    if(fndx === -1)
      arr.push(content);
  }

  return arr;
}

// returns the index of the closing tag for a given opening tag
export function findIndexOfClosingTag(openTag, closeTag, startNdx, arr) {
  var endNdx = -1;
  var openCount = 1;

  for(var i = startNdx + 1; i < arr.length; i++) {
    if(arr[i].indexOf(openTag) === 0)
      openCount++;
    else if(arr[i].indexOf(closeTag) === 0) {
      openCount--;
      if(openCount === 0) {
        endNdx = i;
        break;
      }
    }
  }
  return endNdx;
}
