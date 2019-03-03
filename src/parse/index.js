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

// shape of our AST nodes
const defaultNode = {
  type       : '',
  file       : {},
  originalContent: '',
  content    : '',
  parent     : {},
  innerScope : null,
  children   : [], // list of sequential nodes wrapped in tag (or at topNode)
  processed  : false,
  nestedNodes : [], // nested tags - these need to be resolved before this tag is resolved
  attributes : {}, // attributes on tag
  innerScope : {},
  jsonPath   : '',
  json       : {}, // json values used for this tag
};

// entry point for processing files
export const buildAST = (file, json, parent, innerScope) => {

  // convert string into object
  const topNode = {
    ...defaultNode,
    type    : 'topNode',
    file,
    originalContent: file.content,
    content : file.content,
    ...(parent     ? { parent }     : {}),
    ...(innerScope ? { innerScope } : {}),
  };

  // don't do work if there are no tags in the file
  if(topNode.originalContent.indexOf('<!--#') === -1) {
    topNode.processed = true;
    return topNode;
  }

  // process children of the node
  processNode(topNode, json);

  console.log('==================================')
  console.log(topNode.content);

  return topNode;
}

//
const processNode = (node, json) => {
  if(node.processed) return;

  console.log('processNode: type = ', node.type);

  // the contents of a node may contain more nested nodes
  // break these up into an array of mixed textContent nodes and tags
  const contentArr = splitContent(node.content).filter(c => c !== '');

  // convert array of strings to nodes
  node.nestedNodes = buildNodes(node, contentArr, json);

  resolveNode(node, json);
}

//
const buildNodes = (parent, contentArr, json, closeTag) => {
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
      file            : parent.file,
      innerScope      : parent.innerScope,
      originalContent : content,
      content,
    };

    // if this is a text node, we're set
    if(type === 'textContent') {
      node.processed = true;
      nodes.push(node);
      continue;
    }

    // remove leading character ('<') so the inner contents can be parsed properly
    node.content = node.originalContent.slice(1);

    // the contents inside a node can be treated like new little documents

    // if this is a node that has children build them up, removing them
    // from the split up array
    node.children = (
        type === 'wrap' ? buildNodes(node, contentArr, json, '<!--#endwrap')
      : type === 'each' ? buildNodes(node, contentArr, json, '<!--#endeach')
      : type === 'if'   ? buildNodes(node, contentArr, json, '<!--#endif')
      : []
    );

    nodes.push(node);
  }

  return nodes;
}

//
const resolveNode = (node, json) => {
  if(node.type === 'textContent') return;

  // resolve nested tags
  if(node.nestedNodes.length > 0) {
    node.nestedNodes.forEach(node => processNode(node, json));
    node.content = joinContent(node.nestedNodes);
  }

  // load and resolve attribute values
  loadNodeAttributes(node);

  // process node so that content is resolved
  const processor = nodeProcessors[node.type] || (() =>{});
  processor(node, json);

  node.processed = true;
}

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

//
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
    console.log('processing insert');
    const { file, innerScope } = node;
    const { path, jsonPath, rawJson } = node.attributes;
    if(!path) {
      console.warn(`WARNING while processing file '${file.path}': insert tag with no path attribute`);
      node.content = '';
      return;
    }

    // get filename for inserted file
    const filename = buildPathFromRelativePath(file.path, path);

    // see if file we are loading exists
    if(!insertFiles[filename]) {
      console.warn(`WARNING while processing file '${file.path}': insert file '${filename}' does not exist`);
      node.content = '';
      return;
    }

    // load contents from file
    const insertFile = insertFiles[filename];

    // set scope for inserted file
    const newInnerScope = (
        rawJson    && jsonPath ? getDataFromJsonPath(jsonPath, rawJson)
      : innerScope && jsonPath ? getDataFromJsonPath(jsonPath, innerScope)
      : rawJson  ? rawJson
      : jsonPath ? getDataFromJsonPath(jsonPath, json)
      : void(0)
    );

    const insertNode = buildAST(insertFile, json, node, newInnerScope);

    // process contents to get children
    node.content = insertNode.content;
  },
  //
  wrap : (node, json) => {
    console.log('processing wrap');
    const { file, innerScope } = node;
    const { path, jsonPath, rawJson } = node.attributes;
    if(!path) {
      console.warn(`WARNING while processing file '${file.path}': wrap tag with no path attribute`);
      node.content = '';
      return;
    }

    // get filename for inserted file
    const filename = buildPathFromRelativePath(file.path, path);

    // see if file we are loading exists
    if(!wrapFiles[filename]) {
      console.warn(`WARNING while processing file '${file.path}': wrap file '${filename}' does not exist`);
      node.content = '';
      return;
    }

    // we need to process the children before we bring in the file

    // handle children content
    node.children.forEach(childNode => processNode(childNode, json))
    node.content = joinContent(node.children);

    // load contents from file
    const wrapFile = wrapFiles[filename];

    // set scope for inserted file
    const newInnerScope = (
        rawJson    && jsonPath ? getDataFromJsonPath(jsonPath, rawJson)
      : innerScope && jsonPath ? getDataFromJsonPath(jsonPath, innerScope)
      : rawJson  ? rawJson
      : jsonPath ? getDataFromJsonPath(jsonPath, json)
      : void(0)
    );

    const wrapNode = buildAST(wrapFile, json, node, newInnerScope);

    // process contents to get children
    node.content = wrapNode.content;
  },
  //
  middle : (node, json) => {
    console.log('processing middle');
    node.content = node.parent.parent.content;
  },
  data : (node, json) => {
    const { innerScope } = node;
    console.log('processing data', innerScope);
    const { jsonPath, rawJson } = node.attributes;
    const defaultVal = node.attributes.default;
    if(!jsonPath || (!rawJson && !innerScope)) {
      console.warn(`WARNING while processing file '${file.path}': data tag with no data to look up`);
      node.content = '';
      return;
    }
    const values = rawJson || innerScope;
    console.log('VALUES: ', values)
    const data = getDataFromJsonPath(jsonPath, values);
    node.content = data || defaultVal || '';
  },
  jsonInsert : (node, json) => {
    console.log('processing jsonInsert')
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
    console.log('processing each');
    const { file } = node;
    const { count, jsonPath, rawJson } = node.attributes;
    if(!count && !jsonPath && !Array.isArray(rawJson)) {
      console.warn(`WARNING while processing file '${file.path}': each tag with attribute problems: count, jsonPath and rawJsonnot array`);
      node.content = '';
      return;
    }

    // determine what data we are using
    const values = rawJson || json;
    const jsonData = jsonPath ? getDataFromJsonPath(jsonPath, values) : void(0);
    const data = (
        Array.isArray(values)   ? values
      : Array.isArray(jsonData) ? jsonData
      : void(0)
    );

    // build up nodes and bind the correct data
    const tmpContent = [];
    for(
      let i = 0;
         (!count || (count && i < count))
      && (!data || (data && i < data.length));
      i++)
    {
      // clone children
      const tmpChildren = node.children.map(c => ({
        ...c,
        attributes : {},
        ...(data ? { innerScope : data[i] } : {}),
      }))
      // handle children content
      tmpChildren.forEach(childNode => processNode(childNode, json))
      tmpContent.push(joinContent(tmpChildren));
    }
    node.content = tmpContent.join('');

  },
  if : (node, json) => {
    console.log('processing if');
    const { jsonPath, rawJson } = node.attributes;
    if(!jsonPath) {
      node.content = '';
      return;
    }

    const values = rawJson || json;
    const jsonData = getDataFromJsonPath(jsonPath, values);

    if(!jsonData) {
      node.content = '';
      return;
    }

    node.children.forEach(childNode => processNode(childNode, json))
    node.content = joinContent(node.children);
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
