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

  console.log(topNode.content);

  return topNode;
}

//
const processNode = (node, json) => {
  // the contents of a node may contain more nested nodes
  // break these up into an array of mixed textContent nodes and tags
  const contentArr = splitContent(node.content).filter(c => c !== '');

  // if the first item in the split content is the same as the content, there were no tags
  if(contentArr[0] === node.content) return;

  // convert array of strings to nodes
  node.nestedNodes = parseNodesToAst(node, contentArr, json);

  resolveNode(node, json);
}

//
const resolveNode = (node, json) => {
  if(node.type === 'textContent') return;

  if(node.nestedNodes.length > 0) {
    // resolve nested tags
    node.nestedNodes.forEach(node => resolveNode(node, json));
    node.content = node.nestedNodes.map(c => c.content).join('');
  }

  // load and resolve attribute values
  loadNodeAttributes(node);

  // process node so that content is resolved
  const processor = nodeProcessors[node.type] || (() =>{});
  processor(node, json);

  if(node.children.length > 0)
    node.content = node.children.map(c => c.content).join('');

  node.processed = true;
}

//
const parseNodesToAst = (parent, contentArr, json, closeTag) => {
  const nodes = [];

  while(contentArr.length > 0) {
    const content = contentArr.shift();

    // if we find the close tag, then close this
    if(closeTag && content.indexOf(closeTag) === 0) {
      return nodes;
    }

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

    // handle all nested node
    // skip if we are building up children
    if(!closeTag)
      processNode(node);

    // if this is a node that has children build them up, removing them
    // from the split up array
    node.children = (
        type === 'wrap' ? parseNodesToAst(node, contentArr, json, '<!--#endwrap')
      : type === 'each' ? parseNodesToAst(node, contentArr, json, '<!--#endeach')
      : type === 'if'   ? parseNodesToAst(node, contentArr, json, '<!--#endif')
      : []
    );

    nodes.push(node);
  }

  return nodes.length > 1 ? nodes : [];
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
    console.log(attr, node.content)
    if(hasTagAttribute(attr, node.content)) {
      const value = getTagAttribute(attr, node.content);
      node.attributes[attr] = attr === 'rawJson' ? processRawJson(value) : value;
    }
  })
}

// the functions that processes each node
// these assume that they have all their nested nodes resolved and attributes loaded
const nodeProcessors = {
  topNode : (node, json) => {
    node.content = node.nestedNodes.map(c => c.content).join('');
    node.processed = true;
  },
  textContent : (node, json) => node.processed = true,
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

    // load contents from file
    node.content = wrapFiles[filename].content;
    console.log(node.children)

    // process contents to get children
    processNode(node);
  },
  data : (node, json) => {
    const { jsonPath, rawJson } = node.attributes;
    const defaultVal = node.attributes.default;
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
    console.log('jsonInsert: ', json, jsonPath);
    const data = getDataFromJsonPath(jsonPath, json);
    node.content = data || defaultVal || '';
  },
  middle : (node, json) => {

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

