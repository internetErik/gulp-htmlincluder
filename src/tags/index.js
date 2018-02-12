import { splitContent } from '../util/parsing';
import { buildPathFromRelativePath } from '../util/file';
import { hasTagAttribute, getTagAttribute } from '../attributes';

// all the different tags we are going to process
import { processDataTag }     from './data';
import { processEach }        from './each';
import { processIf }          from './if';
import { processInsert }      from './insert';
import { processJsonInsert }  from './jsonInsert';
import { processWraps }       from './wrap';

import {
  options,
  devOptions,
  insertPattern,
  filePathAttribute,
} from '../config';

/**
 * Recursive function that does the major work of htmlincluder
 *
 * 1) split content into an array of tags and non-tags
 * 2) if there are any tags (array.length > 1) loop until the parsing is finished
 *
 * @param  {String} content The text that we are processing the tags of
 * @param  {String} path    The current file path
 * @return {String}         The content, now parsed and with all tags replaces
 */
export default function processContent(content, path) {
  let splitArr = [];
  let itterCount = 0;

  // prime loop: split content into all insertion points
  splitArr = splitContent(content); // '' => ['']

  // if we have an array larger than 1, then there is at least 1 insert to be made
  while(splitArr.length > 1) {
    let tempDirectory;
    let pathStack = path;

    // process content
    for(let i = 0; i < splitArr.length; i++) {
      let fragment = splitArr[i];

      if(fragment.indexOf('<!--#') === 0) {
        // process any tags inside of this
        fragment = '<' + processContent(fragment.substr(1), path);

        let hasPath = hasTagAttribute(filePathAttribute, fragment);
        let hasAbsPath = hasTagAttribute("absPath", fragment);

        if(hasPath)
          tempDirectory = buildPathFromRelativePath(pathStack, getTagAttribute(filePathAttribute, fragment));
        else if(hasAbsPath) {
          tempDirectory = getTagAttribute("absPath", fragment);
          pathStack= tempDirectory;
        }

        if(fragment.indexOf('<!--#if') === 0) {
          processIf({ ret: 'content', content: fragment, path: pathStack, tmpPath: tempDirectory  }, i, splitArr)
        }
        else if(fragment.indexOf('<!--#each') === 0) {
          processEach({ ret: 'content', content: fragment, path: pathStack, tmpPath: tempDirectory  }, i, splitArr)
        }
        else if(fragment.indexOf('<!--#wrap') === 0) {
          processWraps({ ret: 'content', content: fragment, path: pathStack, tmpPath: tempDirectory  }, i, splitArr);
        }
        else if(fragment.indexOf(insertPattern) === 0) {
          splitArr[i] = processInsert({ ret: 'content', content: fragment, path: pathStack, tmpPath: tempDirectory })
        }
        else if(fragment.indexOf('<!--#data') === 0) {
          splitArr[i] = processDataTag(fragment)
        }
        else if(fragment.indexOf('<!--#jsonInsert') === 0) {
          splitArr[i] = processJsonInsert(fragment);
        }

        pathStack = path;
      }
    }

    // re-join content into a string, and repeat
    content = splitArr.join('') // [''] => ''

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
