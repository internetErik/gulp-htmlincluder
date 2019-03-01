import { splitContent } from '../util/parsing';
import { hasTagAttribute, getTagAttribute } from '../attributes';
import { processRawJson } from '../json';
import { buildPathFromRelativePath } from '../util/file';
import {
  jsonPathAttribute,
  filePathAttribute,
  insertFiles,
  wrapFiles
} from '../config';

/*

  string           - unparsed file
  object           - node
  array of objects - node list

  1) convert a file (string) to a node
  2) process the node
    1) parse contents of node into a list of content and tags - both strings
    2) resolve nested tags
      - treat the string contents of a tag as a file
    3) resolve tags to string
      - each tag has its own process of being resolved
  3) build string result by combining all child tags contents

 */

// const insertFiles = { '/Users/erik/projects/gulp-htmlincluder/test/html/components/-base-component.html':
//    { name: '-base-component.html',
//      path:
//       '/Users/erik/projects/gulp-htmlincluder/test/html/components/-base-component.html',
//      content:
//       '<div>\n  This is a base component that may inherit something\n  <!--#data jsonPath="inheritedProperty" default="" -->\n</div>',
//      processed: false,
//      file: {
//         cwd: '/Users/erik/projects/gulp-htmlincluder',
//         base:
//          '/Users/erik/projects/gulp-htmlincluder/test/html/components/',
//         },
//       },
//   '/Users/erik/projects/gulp-htmlincluder/test/html/components/-customized-component.html':
//    { name: '-customized-component.html',
//      path:
//       '/Users/erik/projects/gulp-htmlincluder/test/html/components/-customized-component.html',
//      content:
//       `<!--#insert\n  path="./-base-component.html"\n  rawJson="{\n    inheritedProperty: '<!--#data jsonPath="message" default="" -->',\n  }"\n-->`,
//      processed: false,
//      file: {
//         cwd: '/Users/erik/projects/gulp-htmlincluder',
//         base:
//          '/Users/erik/projects/gulp-htmlincluder/test/html/components/',
//         },
//       },
//   '/Users/erik/projects/gulp-htmlincluder/test/html/components/-list.html':
//    { name: '-list.html',
//      path:
//       '/Users/erik/projects/gulp-htmlincluder/test/html/components/-list.html',
//      content:
//       '<!--#each jsonPath="members" -->\n  <div>Name: <!--#data jsonPath="name" --></div>\n<!--#endeach -->',
//      processed: false,
//      file: {
//         cwd: '/Users/erik/projects/gulp-htmlincluder',
//         base:
//          '/Users/erik/projects/gulp-htmlincluder/test/html/components/',
//         },
//       },
//   '/Users/erik/projects/gulp-htmlincluder/test/html/components/-tab-collection.html':
//    { name: '-tab-collection.html',
//      path:
//       '/Users/erik/projects/gulp-htmlincluder/test/html/components/-tab-collection.html',
//      content:
//       '<div class="tab-collection <!--#data jsonPath="className" -->">\n  <div class="tab-collection__tabs">\n    <!--#each jsonPath="tabs" -->\n      <div class="tabs__tab <!--#data jsonPath="className" -->" data-tab-id="<!--#data jsonPath="tabId" -->">\n        <!--#data jsonPath="displayName" -->\n      </div>\n    <!--#endeach -->\n  </div>\n  <div class="tab-collection__contents">\n    <!--#each jsonPath="tabs" -->\n    <div class="contents__container" data-tab-id="<!--#data jsonPath="tabId" -->">\n      <!--#insert path="<!--#data jsonPath="filePath" -->" -->\n    </div>\n    <!--#endeach -->\n  </div>\n</div>',
//      processed: false,
//      file: {
//         cwd: '/Users/erik/projects/gulp-htmlincluder',
//         base:
//          '/Users/erik/projects/gulp-htmlincluder/test/html/components/',
//         },
//       },
//   '/Users/erik/projects/gulp-htmlincluder/test/html/components/-text-insert.html':
//    { name: '-text-insert.html',
//      path:
//       '/Users/erik/projects/gulp-htmlincluder/test/html/components/-text-insert.html',
//      content:
//       'This is just a simple block of text inserted from -test-insert.html',
//      processed: false,
//      file: {
//         cwd: '/Users/erik/projects/gulp-htmlincluder',
//         base:
//          '/Users/erik/projects/gulp-htmlincluder/test/html/components/',
//         },
//       },
//   '/Users/erik/projects/gulp-htmlincluder/test/html/components/-with-json.html':
//    { name: '-with-json.html',
//      path:
//       '/Users/erik/projects/gulp-htmlincluder/test/html/components/-with-json.html',
//      content: '<!--#data jsonPath="text" default="hello world!" -->',
//      processed: false,
//      file: {
//         cwd: '/Users/erik/projects/gulp-htmlincluder',
//         base:
//          '/Users/erik/projects/gulp-htmlincluder/test/html/components/',
//          } }
// };

// const wrapFiles = { '/Users/erik/projects/gulp-htmlincluder/test/html/wrappers/_simple.html':
//    { name: '_simple.html',
//      path:
//       '/Users/erik/projects/gulp-htmlincluder/test/html/wrappers/_simple.html',
//      content:
//       '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Simple Wrapper</title>\n</head>\n<body>\n  <!--#middle -->\n</body>\n</html>',
//      processed: false,
//      file: {
//         cwd: '/Users/erik/projects/gulp-htmlincluder',
//         base: '/Users/erik/projects/gulp-htmlincluder/test/html/wrappers/',
//         },
//       },
//   '/Users/erik/projects/gulp-htmlincluder/test/html/wrappers/_with-json.html':
//    { name: '_with-json.html',
//      path:
//       '/Users/erik/projects/gulp-htmlincluder/test/html/wrappers/_with-json.html',
//      content:
//       '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title><!--#data jsonPath="title" default="Wrapper With JSON" --></title>\n</head>\n<body>\n  <!--#middle -->\n</body>\n</html>',
//      processed: false,
//      file: {
//         cwd: '/Users/erik/projects/gulp-htmlincluder',
//         base: '/Users/erik/projects/gulp-htmlincluder/test/html/wrappers/',
//          }
//        },
// };

// const fakeFile = {
//   name: 'simple.html',
//   path: '/Users/erik/projects/gulp-htmlincluder/test/html/simple.html',
//   content: `<!--#wrap path="./wrappers/_simple.html" -->\n  This is a simple file with a wrap and some inserts\n  <!--#data\n    jsonPath="<!--#jsonInsert jsonPath="hello" default="jarl" -->"\n    rawJson="{jarl : 'hello world'}"\n    default="jarlsense"\n  -->\n  <!--#insert path="./components/-text-insert.html" -->\n<!--#endwrap -->`,
//   processed: false,
//   file: {}
// }

// const fakeJson = {};

// shape of our AST nodes
const defaultNode = {
  type       : '',
  file       : {},
  content    : '',
  parent     : {},
  children   : [], // list of sequential nodes wrapped in tag (or at topNode)
  processed  : false,
  nestedNodes : [], // nested tags - these need to be resolved before this tag is resolved
  attributes : {}, // attributes on tag
  innerScope : {},
  jsonPath   : '',
  json       : {}, // json values used for this tag
};

// entry point for processing files
export const buildAST = (file, json) => {

  // convert string into object
  const topNode = {
    ...defaultNode,
    type    : 'topNode',
    file,
    content : file.content,
  };

  // process children of the node
  processNode(topNode, json);

  // console.log('==================================')
  // console.log(topNode.content);

  return topNode;
}

// entry point for processing files
export const buildWrapAST = (file, parent, json) => {

  // convert string into object
  const topNode = {
    ...defaultNode,
    type    : 'topNode',
    file,
    parent,
    content : file.content,
  };

  // process children of the node
  processNode(topNode, json);

  // console.log('==================================')
  // console.log(topNode.content);

  return topNode;
}

//
const processNode = (node, json) => {

  // the contents of a node may contain more nested nodes
  // break these up into an array of mixed textContent nodes and tags
  const contentArr = splitContent(node.content).filter(c => c !== '');

  // convert array of strings to nodes
  node.nestedNodes = (contentArr[0] !== node.content)
    ? parseNodesToAst(node, contentArr, json)
    : [];

// console.log('post nested: ', node.type)
  resolveNode(node, json);
}

//
const parseNodesToAst = (parent, contentArr, json, closeTag) => {
  const nodes = [];

  while(contentArr.length > 0) {
    const content = contentArr.shift();

    // if we find the close tag, then close this
    if(closeTag && content.indexOf(closeTag) === 0)
      return nodes;

    // lookup type of the tag
    const type = findNodeType(content);

    const node = {
      ...defaultNode,
      type,
      parent,
      file    : parent.file,
      content,
    };

    // if this is a text node, we're set
    if(type === 'textContent') {
      node.processed = true;
      nodes.push(node);
      continue;
    }

    // remove leading character ('<') so the inner contents can be parsed properly
    node.content = content.slice(1);

    // the contents inside a node can be treated like new little documents

    // if this is a node that has children build them up, removing them
    // from the split up array
    node.children = (
        type === 'wrap' ? parseNodesToAst(node, contentArr, json, '<!--#endwrap')
      : type === 'each' ? parseNodesToAst(node, contentArr, json, '<!--#endeach')
      : type === 'if'   ? parseNodesToAst(node, contentArr, json, '<!--#endif')
      : []
    );

    // handle all nested node
    // skip if we are building up children
    if(!closeTag)
      processNode(node, json);

    nodes.push(node);
  }

  return nodes;
}

//
const resolveNode = (node, json) => {
  if(node.type === 'textContent') return;

  if(node.children.length > 0) {
    
  }

  // resolve nested tags
  if(node.nestedNodes.length > 0) {
    node.nestedNodes.forEach(node => resolveNode(node, json));
    node.content = node.nestedNodes.map(c => c.content).join('');
  }

  // load and resolve attribute values
  loadNodeAttributes(node);

  // process node so that content is resolved
  const processor = nodeProcessors[node.type] || (() =>{});
  processor(node, json);

  node.processed = true;
}

// check for tag and return node type
const findNodeType = content => (
  content.indexOf('<!--#insert')     === 0 ? 'insert'
: content.indexOf('<!--#data')       === 0 ? 'data'
: content.indexOf('<!--#jsonInsert') === 0 ? 'jsonInsert'
: content.indexOf('<!--#wrap')       === 0 ? 'wrap'
: content.indexOf('<!--#middle')     === 0 ? 'middle'
: content.indexOf('<!--#each')       === 0 ? 'each'
: content.indexOf('<!--#if')         === 0 ? 'if'
: 'textContent'
)

// loads values for tags into node object
const loadNodeAttributes = node => {
  const attrs = nodeAttributes[node.type] || [];
  attrs.forEach(attr => {
    if(hasTagAttribute(attr, node.content)) {
      const value = getTagAttribute(attr, node.content);
      node.attributes[attr] = attr === 'rawJson' ? processRawJson(value) : value;
    }
  })
}

const joinContent = nodeList => nodeList.map(c => c.content).join('')

// the functions that processes each node
// these assume that they have all their nested nodes resolved and attributes loaded
const nodeProcessors = {
  //
  topNode : (node, json) => {
    node.content = joinContent(node.nestedNodes);
  },
  //
  textContent : (node, json) => { console.warn('WARNING: Why are we processing a textContent?') },
  //
  insert : (node, json) => {
    const { file } = node;
    const { path, jsonPath, rawJson } = node.attributes;
    if(!path) {
      console.warn(`WARNING while processing file '${file.path}': insert tag with no path attribute`);
      node.content = '';
      return;
    }
    // set scope for inserted file
    node.innerScope = (
        jsonPath ? getDataFromJsonPath(jsonPath, json)
      : rawJson  ? rawJson
      : {}
    );

    // get filename for inserted file
    const filename = buildPathFromRelativePath(file.path, path);

    // see if file we are loading exists
    if(!insertFiles[filename]) {
      console.warn(`WARNING while processing file '${file.path}': insert file '${filename}' does not exist`);
      node.content = '';
      return;
    }

    // load contents from file
    node.content = insertFiles[filename].content;

    // process contents to get children
    processNode(node, json);
  },
  //
  wrap : (node, json) => {
    const { file } = node;
    const { path, jsonPath, rawJson } = node.attributes;
    if(!path) {
      console.warn(`WARNING while processing file '${file.path}': wrap tag with no path attribute`);
      node.content = '';
      return;
    }

    // set scope for inserted file
    node.innerScope = (
        jsonPath ? getDataFromJsonPath(jsonPath, json)
      : rawJson  ? rawJson
      : {}
    );

    // get filename for inserted file
    const filename = buildPathFromRelativePath(file.path, path);

    // see if file we are loading exists
    if(!wrapFiles[filename]) {
      console.warn(`WARNING while processing file '${file.path}': wrap file '${filename}' does not exist`);
      node.content = '';
      return;
    }

console.log(joinContent(node.children));
    // handle children content
    node.children.forEach(childNode => processNode(childNode, json))

    node.content = joinContent(node.children);

    // load contents from file
    const wrapFile = wrapFiles[filename];
    const wrapNode = buildWrapAST(wrapFile, node, json);
// console.log(wrapNode);
fdd +sdfds;

    // process contents to get children
    processNode(node, json);
  },
  //
  middle : (node, json) => {
    console.log(joinContent(node.parent.parent.children));
  },
  data : (node, json) => {
    const { jsonPath, rawJson } = node.attributes;
    const defaultVal = node.attributes.default;
    console.log('processing data');
    if(!rawJson || !jsonPath) {
      node.content = '';
      return;
    }
    const data = getDataFromJsonPath(jsonPath, rawJson);
    node.content = data || defaultVal || '';
  },
  jsonInsert : (node, json) => {
    const { jsonPath } = node.attributes;
    const defaultVal = node.attributes.default;
    if(!jsonPath) {
      node.content = '';
      return;
    }
    const data = getDataFromJsonPath(jsonPath, json);
    node.content = data || defaultVal || '';
  },
  each : (node, json) => {

  },
  if : (node, json) => {

  },
}

// the legal attributes for each element
const nodeAttributes = {
  insert      : [ 'path', 'jsonPath', 'rawJson' ],
  data        : [ 'jsonPath', 'rawJson', 'default' ],
  jsonInsert  : [ 'jsonPath', 'default' ],
  wrap        : [ 'path', 'jsonPath', 'rawJson' ],
  middle      : [  ],
  each        : [ 'count', 'jsonPath', 'rawJson' ],
  if          : [ 'jsonPath', 'rawJson' ],
  textContent : [  ],
}

// given a jsonObject and a path, return the data pointed at
const getDataFromJsonPath = (jsonPath, json) => {
  if(jsonPath === 'this') return json;

  let result = jsonPath.split('.').reduce((acc, cur) => acc ? acc[cur] : '', json)

  if(!Array.isArray(result) && typeof(result) === 'object')
    result = toSafeJsonString(result);

  return result;
}

//
const toSafeJsonString = jsonObj =>
  JSON.stringify(jsonObj).replace(/\'/g, "\\'").replace(/"/g, "'")
