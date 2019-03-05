import {
  jsonPathAttribute,
  filePathAttribute,
  insertFiles,
  wrapFiles,
  options,
  devOptions,
  insertPattern,
} from './config';

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
export const processFile = (file, json, parent, innerScope) => {
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
    return topNode;

  // process children of the node
  processNode(topNode, json);

  return topNode;
}

//
const processNode = (node, json) => {
  if(node.type === 'textContent') return node;

  // the contents of a node may contain more nested nodes
  // break these up into an array of mixed textContent nodes and tags
  const contentArr = splitContent(node.content).filter(c => c !== '');

  // convert array of strings to nodes
  node.nestedNodes = buildNodes(node, contentArr, json);

  return resolveNode(node, json);
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
const resolveNode = (node, json) => {
  // resolve nested tags
  if(node.nestedNodes.length > 0) {
    node.nestedNodes.forEach(node => processNode(node, json));
    node.content = joinContent(node.nestedNodes);
  }

  // process node so that content is resolved
  const processor = nodeProcessors[node.type];

  // There is a problem if we found no processor
  if(!processor) {
    console.warn(`WARNING while processing file '${node.file.path}': there is no processor for type '${node.type}'`);
    return node;
  }

  // load and resolve attribute values
  node.attributes = loadNodeAttributes(node);

  return processor(node, json);
}

// loads values for tags into node object
const loadNodeAttributes = node => {
  const attrs = nodeAttributes[node.type] || [];
  return attrs.reduce((acc, attr) => {
    if(hasTagAttribute(attr, node.content)) {
      const value = getTagAttribute(attr, node.content);
      acc[attr] = (attr === 'rawJson') ? processRawJson(value) : value;
    }
    return acc;
  }, {})
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
  insert : (node, json) => {
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

    const insertNode = processFile(insertFile, json, node, newInnerScope);

    // process contents to get children
    node.content = insertNode.content;
    return node;
  },
  //
  wrap : (node, json) => {
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
    node.children = node.children.map(childNode => processNode(childNode, json))
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

    const wrapNode = processFile(wrapFile, json, node, newInnerScope);

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
  each : (node, json) => {
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
    const data = (
        Array.isArray(values)   ? values
      : Array.isArray(jsonData) ? jsonData
      : void(0)
    );

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
      tmpChildren = tmpChildren.map(childNode => processNode(childNode, json))
      tmpContent.push(joinContent(tmpChildren));
    }

    node.content = tmpContent.join('');
    return node;
  },
  //
  if : (node, json) => {
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
    node.children = node.children.map(childNode => {
      return processNode({
        ...childNode,
        innerScope : { ...node.innerScope }
      }, json);
    })
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
const processRawJson = jsonString => {
  if(typeof(jsonString) === 'object')
    jsonString = toSafeJsonString(jsonString);

  let jsonData = {};
  try {
    eval('jsonData = ' + jsonString);
  }
  catch(e) {
    console.error(`ERROR: Poorly formatted rawJson string:
      ${jsonString}
      This must be valid JavaScript.
    `);
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
