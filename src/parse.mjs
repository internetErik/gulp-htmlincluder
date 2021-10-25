import 'babel-polyfill';
import {
  jsonPathAttribute,
  filePathAttribute,
  insertFiles,
  wrapFiles,
  options,
  devOptions,
  insertPattern,
  rawJsonPlugins,
} from './config.mjs';

// shape of our AST nodes
const getDefaultNode = () => ({
  type            : '',
  file            : {},
  originalContent : '',
  content         : '',
  parent          : {},
  innerScope      : null,
  children        : [], // list of sequential nodes wrapped in tag (or at topNode)
  nestedNodes     : [], // nested tags - these need to be resolved before this tag is resolved
  attributes      : {}, // attributes on tag
})

// entry point for processing files
export const processFile = async (file, json, parent, innerScope) => {
  // convert string into object
  const topNode = {
    ...getDefaultNode(),
    type    : 'topNode',
    file,
    originalContent : file.content,
    content : file.content,
    ...(parent     ? { parent }     : {}),
    ...(innerScope ? { innerScope } : {}),
  };

  // don't do work if there are no tags in the file
  if(topNode.originalContent.indexOf('<!--#') === -1)
    return await topNode;

  // process children of the node
  await processNode(topNode, json);

  return await topNode;
}

//
const processNode = async (node, json) => {
  if(node.type === 'textContent') return node;

  // the contents of a node may contain more nested nodes
  // break these up into an array of mixed textContent nodes and tags
  const contentArr = splitContent(node.content).filter(c => c !== '');

  // convert array of strings to nodes
  node.nestedNodes = buildNodes(node, contentArr, json);

  node = await resolveNode(node, json);

  return node;
}

//
const buildNodes = (parent, contentArr, json, closeTag) => {
  const nodes = [];

  while(contentArr.length > 0) {
    const content = contentArr.shift();

    // if we find the close tag, then we are done with our search
    if(closeTag && content.indexOf(closeTag) === 0)
      return nodes;

    // lookup type of the tag
    const type = findNodeType(content);

    const node = {
      ...getDefaultNode(),
      type,
      parent,
      file            : parent.file,
      innerScope      : parent.innerScope,
      originalContent : content,
      content,
    };

    // if this is a text node, we're set
    if(type === 'textContent') {
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

  // We should never get here while looking for a closing tag
  if(closeTag)
    console.warn(`WARNING while processing file '${parent.file.path}': there is a missing tag`);

  return nodes;
}

//
const resolveNode = async (node, json) => {
  // resolve nested tags
  if(node.nestedNodes.length > 0) {
    const promises = node.nestedNodes.map(async (node) => await processNode(node, json));
    await Promise.all(promises).then(() => {
      node.content = joinContent(node.nestedNodes);
    })
  }

  // process node so that content is resolved
  const processor = nodeProcessors[node.type];

  // There is a problem if we found no processor
  if(!processor) {
    console.warn(`WARNING while processing file '${node.file.path}': there is no processor for type '${node.type}'`);
    return node;
  }

  // load and resolve attribute values
  node.attributes = await loadNodeAttributes(node, json);

  return await processor(node, json);
}

// loads values for tags into node object
const loadNodeAttributes = async (node, json) => {
  const attrs = nodeAttributes[node.type] || [];
  const attributes = await attrs.reduce(async (acc, attr) => {
    acc = await acc;
    if(hasTagAttribute(attr, node.content)) {
      const value = getTagAttribute(attr, node.content);
      acc[attr] = (attr === 'rawJson') ? (await processRawJson(value, json)) : value;
    }
    return acc;
  }, {})

  return attributes;
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
    node.content = joinContent(node.nestedNodes)
    return node;
  },
  //
  textContent : (node, json) => {
    console.warn('WARNING: Why are we processing a textContent?');
    return node;
  },
  //
  insert : async (node, json) => {
    const { file, innerScope } = node;
    const { path, jsonPath, rawJson } = node.attributes;
    if(!path) {
      console.warn(`WARNING while processing file '${file.path}': insert tag with no path attribute`);
      node.content = '';
      return node;
    }

    // get filename for inserted file
    const filename = buildPathFromRelativePath(file.path, path);

    // see if file we are loading exists
    if(!insertFiles[filename]) {
      console.warn(`WARNING while processing file '${file.path}': insert file '${filename}' does not exist`);
      node.content = '';
      return node;
    }

    // load contents from file
    const insertFile = { ...insertFiles[filename] };

    // set scope for inserted file
    const newInnerScope = (
        rawJson    && jsonPath ? getDataFromJsonPath(jsonPath, rawJson)
      : innerScope && jsonPath ? getDataFromJsonPath(jsonPath, innerScope)
      : rawJson  ? rawJson
      : jsonPath ? getDataFromJsonPath(jsonPath, json)
      : void(0)
    );

    const insertNode = await processFile(insertFile, json, node, newInnerScope);

    // process contents to get children
    node.content = insertNode.content;
    return node;
  },
  //
  wrap : async (node, json) => {
    const { file, innerScope } = node;
    const { path, jsonPath, rawJson } = node.attributes;
    if(!path) {
      console.warn(`WARNING while processing file '${node.file.path}': wrap tag with no path attribute`);
      node.content = '';
      return node;
    }

    // get filename for inserted file
    const filename = buildPathFromRelativePath(file.path, path);

    // see if file we are loading exists
    if(!wrapFiles[filename]) {
      console.warn(`WARNING while processing file '${node.file.path}': wrap file '${filename}' does not exist`);
      node.content = '';
      return node;
    }

    // we need to process the children before we bring in the file

    // handle children content
    const promises = node.children.map(async (childNode) => await processNode(childNode, json))
    node.children = await Promise.all(promises).then(children => children);
    node.content = joinContent(node.children);

    // load contents from file
    const wrapFile = { ...wrapFiles[filename] };

    // set scope for inserted file
    const newInnerScope = (
        rawJson    && jsonPath ? getDataFromJsonPath(jsonPath, rawJson)
      : innerScope && jsonPath ? getDataFromJsonPath(jsonPath, innerScope)
      : rawJson  ? rawJson
      : jsonPath ? getDataFromJsonPath(jsonPath, json)
      : void(0)
    );

    const wrapNode = await processFile(wrapFile, json, node, newInnerScope);

    // process contents to get children
    node.content = wrapNode.content;
    return node;
  },
  //
  middle : (node, json) => {
    node.content = node.parent.parent.content
    return node;
  },
  //
  data : (node, json) => {
    const { innerScope, file } = node;
    const { jsonPath, rawJson } = node.attributes;
    const defaultVal = node.attributes.default;

    if(!jsonPath || (!rawJson && !innerScope && !defaultVal)) {
      console.warn(`WARNING while processing file '${file.path}': data tag with no data to look up for content '${node.originalContent}'`);
      node.content = '';
      return node;
    }
    const values = rawJson || innerScope;
    const data = getDataFromJsonPath(jsonPath, values);
    node.content = data || defaultVal || '';
    return node;
  },
  //
  jsonInsert : (node, json) => {
    const { jsonPath } = node.attributes;
    const defaultVal = node.attributes.default;
    if(!jsonPath) {
      node.content = '';
      return node;
    }
    const data = getDataFromJsonPath(jsonPath, json);
    node.content = data || defaultVal || '';
    return node;
  },
  //
  each : async (node, json) => {
    const { file, innerScope } = node;
    const { count, jsonPath, rawJson } = node.attributes;
    if(!count && !jsonPath && !Array.isArray(rawJson) && !Array.isArray(innerScope)) {
      console.warn(`WARNING while processing file '${file.path}': each tag with attribute problems: count, jsonPath and rawJson and innerScope are not arrays`);
      node.content = '';
      return node;
    }

    // determine what data we are using
    const values = rawJson || node.innerScope || json;
    const jsonData = jsonPath ? getDataFromJsonPath(jsonPath, values) : void(0);
    // prefer local data to data in passed in jsonObject
    const data = (
        Array.isArray(values)   ? values
      : Array.isArray(jsonData) ? jsonData
      : void(0)
    );

    // if there is nothing to loop on, then content is empty
    if(!data && !count) {
      node.content = '';
      return node;
    }

    // build up nodes and bind the correct data
    const tmpContent = [];
    for(
      let i = 0;
         (!count || (count && i < count))
      && (!data  || (data  && i < data.length));
      i++)
    {
      // clone children
      let tmpChildren = node.children.map(c => ({
        ...c,
        ...(c.nestedNodes ? { nestedNodes : c.nestedNodes} : { }),
        ...(c.children    ? { children : c.children } : { }),
        ...(data
              // ? { innerScope : (typeof(data[i]) === 'object') ? { ...data[i] } : data[i] }
              ? { innerScope : data[i] }
              : { }
           ),
      }))
      // handle children content
      const promises = tmpChildren.map(async (childNode) => await processNode(childNode, json))
      tmpChildren = await Promise.all(promises).then(children => children);
      tmpContent.push(joinContent(tmpChildren));
    }

    node.content = tmpContent.join('');
    return node;
  },
  //
  if : async (node, json) => {
    const { innerScope } = node;
    const { jsonPath, rawJson } = node.attributes;
    if(!jsonPath) {
      node.content = '';
      return node;
    }

    const values = rawJson || innerScope || json;
    const jsonData = getDataFromJsonPath(jsonPath, values);
    if(!jsonData) {
      node.content = '';
      return node;
    }
    const promises = node.children.map(async (childNode) =>
      await processNode({
        ...childNode,
        innerScope : { ...node.innerScope }
      }, json)
    )
    node.children = await Promise.all(promises).then(children => children);
    node.content = joinContent(node.children);
    return node;
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

const getTagPositions = (tag, content, lndx = 0, ndx = content.indexOf(tag)) => (
  (ndx === -1)
? []
: [ ndx + lndx, ...getTagPositions(tag, content.slice(ndx + 1), lndx + ndx + 1) ]
)

const buildTagPairs = (open, close) => (
    (open.length === 0) ? []
  : (open.length === 1 || open[1] > close[0]) ? [[open.slice(0, 1)[0], close.slice(0, 1)[0]], ...buildTagPairs(open.slice(1), close.slice(1))]
  : [ ...buildTagPairs([...open.slice(0,1), ...open.slice(2)], close.slice(1)) ]
)

const divideContent = (content, [start, end], pairs, cursor = 0) => (
  (start === void(0))
? [ content.slice(cursor) ]
: [
    content.slice(cursor, start),
    content.slice(start, end+3),
    ...divideContent(content, pairs.shift() || [], pairs, end+3),
  ]
)

const splitContent = content => {
  const openTags  = getTagPositions('<!--#', content);
  const closeTags = getTagPositions('-->', content);

  if(openTags.length < closeTags.length) closeTags.pop();

  const pairs = buildTagPairs(openTags, closeTags);

  return divideContent(content, pairs.shift() || [], pairs).filter(c => c !== '');
}

// given a jsonObject and a path, return the data pointed at
const getDataFromJsonPath = (jsonPath, json) => {
  if(jsonPath === 'this') return json;

  let result = jsonPath.split('.').reduce((acc, cur) => acc ? acc[cur] : '', json)

  if(!Array.isArray(result) && typeof(result) === 'object')
    result = toSafeJsonString(result);

  return result;
}

// are we on windows?
const isWin = /^win/.test(process.platform);

// overcome the difference in *nix/windows pathing
const fixFilePathForOS = path =>
  (isWin) ? path.replace(/\//g, '\\') : path.replace(/\\/g, '/')

// given the current directory and a relative path, build the complete path
// to the relative path
const buildPathFromRelativePath = (cdir, fdir) => {
  let dirChar = (isWin) ? '\\' : '/';
  let dir = cdir.split(dirChar);
  dir.pop();

  fdir = fixFilePathForOS(fdir);

  fdir.split(dirChar)
    .forEach(function(e) {
      (e === '..') ? dir.pop() : (e !== '.' && e !== '') ? dir.push(e) : void 0;
    });
  dir = dir.join(dirChar);

  return dir;
}

//
const toSafeJsonString = jsonObj =>
  JSON.stringify(jsonObj).replace(/\'/g, "\\'").replace(/"/g, "'")

//
const processRawJson = async (jsonString, json) => {
  if(typeof(jsonString) === 'object')
    jsonString = toSafeJsonString(jsonString);

  let jsonData = {};
  const plugins = rawJsonPlugins;
  try {
    jsonData = await eval(`(async () => await ${ jsonString })()`);
  }
  catch(e) {
    console.error(`ERROR: Poorly formatted rawJson string:
      ${jsonString}
      - This must be valid JavaScript.
      - Or perhaps there was an error in a function used for rawJson?
      Stack trace:
    `);
    console.error(e);
  }

  return jsonData;
}

// does a tag have an attribute? (attributeName="value")
const hasTagAttribute = (attr, content) => content.indexOf(attr + '="') > -1

// get the value of an attribute (attributeName="value")
const getTagAttribute = (attr, content) => {
  let fndx = -1,
      lndx = -1;

  fndx = content.indexOf(attr + '="');
  if(fndx === -1) {
    console.warn("Warning: no tag of name `" + attr + "` found in the following content: `" + content + "`")
    return '';
  }

  content = content.slice(fndx + attr.length + 2);
  lndx = content.indexOf('"');
  content = content.slice(0, lndx);
  return content;
}
