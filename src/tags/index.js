import { splitContent } from '../util/parsing';
import { buildPathFromRelativePath, updateRelativePaths } from '../util/file';
import { hasTagAttribute, getTagAttribute } from '../attributes';
import { addRawJsonWhereJsonPath, appendJsonParentPath } from '../json';

// all the different tags we are going to process
import processDataTag     from './data';
import processEach        from './each';
import processIf          from './if';
import processInsert      from './insert';
import processJsonInsert  from './jsonInsert';
import processWraps       from './wrap';

import {
  options,
  devOptions,
  insertPattern,
  filePathAttribute,
} from '../config';

/**
 * Recursive function that does the major systematic work of htmlincluder
 *
 * 1) split content into an array of tags and non-tags
 * 2) if there are any tags (array.length > 1) loop until the parsing is finished
 *
 * @param  {String} content The text that we are processing the tags of
 * @param  {String} path    The current file path
 * @return {String}         The content, now parsed and with all tags replaces
 */
export default function processContent(content, path, jsonContext) {
  let splitArr = [];
  let itterCount = 0;

  // create a tmp version of content to see if we actually do any work on it
  let contentBeforeProcessing = content;

  // prime loop: split content into all insertion points
  splitArr = splitContent(content); // '' => ['']

  // if we have an array larger than 1, then there is at least 1 insert to be made
  while(splitArr.length > 1) {
    let tempDirectory;
    let pathStack = path;

    // iterate through content
    for(let i = 0; i < splitArr.length; i++) {
      let fragment = splitArr[i];

      if(fragment.indexOf('<!--#') === 0) {
        // process any tags inside of this tag
        fragment = '<' + processContent(fragment.substr(0, fragment.length - 1).substr(1), path, jsonContext) + '>';

        //
        // At this point we can assume that the tag we are working with has no
        // embedded tags.
        //

        // See if this has a file path, or absolute file path. If we don't have
        // an absolute path, then we need to build one.
        let hasPath = hasTagAttribute(filePathAttribute, fragment);
        let hasAbsPath = hasTagAttribute("absPath", fragment);

        // get or build paths
        if(hasPath)
          tempDirectory = buildPathFromRelativePath(pathStack, getTagAttribute(filePathAttribute, fragment));
        else if(hasAbsPath) {
          tempDirectory = getTagAttribute("absPath", fragment);
          pathStack= tempDirectory;
        }

        let curFile = {
          content: fragment,
          path: pathStack,
          tmpPath: tempDirectory,
        };

        // handle loading each particular kind of tag
        if(fragment.indexOf('<!--#data') === 0) {
          // no look ahead
          // replaces itself with the value from the jsonPath it looks at
          splitArr[i] = processDataTag(fragment, jsonContext);
        }
        else if(fragment.indexOf('<!--#jsonInsert') === 0) {
          splitArr[i] = processJsonInsert(fragment);
        }
        else if(fragment.indexOf(insertPattern) === 0) {
          splitArr[i] = processInsert(curFile, jsonContext)
        }
        else if(fragment.indexOf('<!--#if') === 0) {
          // looks ahead to remove its closing tag
          // if the if check fails, it also turns the tags between into empty tags
          // the if tag doesn't create a new context
          processIf(curFile, i, splitArr, jsonContext)
        }
        else if(fragment.indexOf('<!--#each') === 0) {
          processEach(curFile, i, splitArr, jsonContext)
        }
        else if(fragment.indexOf('<!--#wrap') === 0) {
          processWraps(curFile, i, splitArr, jsonContext);
        }
        else {
          console.error('An unidentified tag is being used: ' + fragment);
          splitArr[i] = 'TAG REMOVED HERE';
        }

        pathStack = path;
      }
    }

    // flatten out sub-arrays
    splitArr = splitArr.map(flattenFragment);

    // re-join content into a string, and repeat
    content = splitArr.join(''); // [''] => ''

    // We split the string, so there should have been work. Was there?
    if(content === contentBeforeProcessing) {
      console.error('Content was split, but no change was made in it: ' + content);
      console.error('Something in your tagging may be making it impossible to process correctly')
      console.error('Returning the content without further processing')
      return content;
    }

    // split file into all insertion points
    splitArr = splitContent(content); // '' => ['']

    // debug features
    if(devOptions.printIterations)
      console.log(content);

    if(devOptions.limitIterations) {
      itterCount++;
      if(itterCount >= devOptions.limitIterations)
        break;
    }
  }

  if(devOptions.printResult)
    console.log(content);

  return content;
}

function flattenFragment(fragment, ndx, arr) {
  if(!Array.isArray(fragment))
    return fragment;

  let [ rawJson, jsonPath, path, content ] = fragment;

  // yet another recursive call to process content
  content = processContent(content, path, rawJson);

  if(rawJson)
    content = addRawJsonWhereJsonPath(content, rawJson);
  else if(jsonPath)
    content = appendJsonParentPath(content, jsonPath);

  if(path)
    content = updateRelativePaths(content, path);

  return content;
}
