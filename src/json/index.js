import { splitContent, getDataFromJsonPath } from '../util/parsing.js';
import { hasTagAttribute, addTagAttribute } from '../attributes';
import { jsonPathAttribute } from '../config';

// given a jsonObj, we can convert it to a string for our purposes
export function toSafeJsonString(jsonObj) {
  return JSON.stringify(jsonObj).replace(/\'/g, "\\'").replace(/"/g, "'")
}

// Handles the string value inside of rawJson="" attributes
export function processRawJson(jsonString) {
  var jsonData = {};

  if(typeof(jsonString) === 'object')
    jsonString = toSafeJsonString(jsonString);

  try {
    eval('jsonData = ' + jsonString);
  }
  catch(e) {
    console.error(e);
  }
  return jsonData;
}

// add json paths together
export function appendJsonParentPath(content, jsonParentPath) {
  var fndx = -1,
      lndx = -1,
      left = ""
      right = "";

  // do nothing if there is no jsonParentPath
  if(jsonParentPath === '' || jsonParentPath === 'this')
    return content;

  content = splitContent(content, '<!--#data'); // '' => ['']

  // if we have an array larger than 1, then there is at least 1 insert to be made
  if(content.length > 1) {

    // process files
    content = content.map(function(fragment, ndx, arr) {
        if(fragment.indexOf('<!--#data') === 0) {
          fndx = fragment.indexOf(`${jsonPathAttribute}="`)
          if(fndx > -1) {
            left = fragment.slice(0, fndx + 10);
            fragment = left + jsonParentPath + '.' + fragment.slice(fndx + 10);
          }
          else {
            console.error("ERROR: '<!--#data' tag with no 'jsonPath'");
          }
        }
        return fragment;
      })

  }
  // re-join content into a string
  content = content.join('') // [''] => ''
  return content;
}

// splits up content into tags and puts rawJson in (if there isn't already a rawJson)
export function addRawJsonWhereJsonPath(content, rawJson, jsonParentPath) {
  var fndx = -1,
      lndx = -1,
      left = ""
      right = "";

  // if we have a parent path, then we need to grab a subset of the rawJson
  if(jsonParentPath && rawJson) {
    let data = processRawJson(rawJson);
    rawJson = getDataFromJsonPath(jsonParentPath, data);
  }

  content = bluntDataTagsInEaches(content);

  content = splitContent(content); // '' => ['']

  // if we have an array larger than 1, then there is at least 1 insert to be made
  if(content.length > 1) {

    // process files
    content = content.map(function(fragment, ndx, arr) {
        if(fragment.indexOf('<!--#') === 0 &&
           hasTagAttribute(jsonPathAttribute, fragment) &&
           !hasTagAttribute("rawJson", fragment)
          ) {
          fragment = addTagAttribute("rawJson", fragment, rawJson);
        }
        return fragment;
      })

  }
  // re-join content into a string
  content = content.join(''); // [''] => ''

  content = unbluntDataTagsInEaches(content);
  return content;
}

function bluntDataTagsInEaches(content) {
  let arr = splitContent(content);
  let eachLevel = 0;

  content = arr.map((fragment, ndx, arr) => {
    if(fragment.indexOf('<!--#each') === 0) eachLevel++;
    if(fragment.indexOf('<!--#endeach') === 0) eachLevel--;
    if(fragment.indexOf('<!--#data') === 0 && eachLevel > 0)
      fragment = fragment.replace('<!--#data', '<!--@#data');
    return fragment;
  }).join('');

  if(eachLevel > 0)
    console.error('Error: Mismatched number of each and endeach tags');

  return content;
}

function unbluntDataTagsInEaches(content) {
  content = content.replace(/<!--@#data/g, '<!--#data');
  return content;
}
