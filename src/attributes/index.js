// does a tag have an attribute? (attributeName="value")
export function hasTagAttribute(attr, content) {
  // strip out inner tags
  // check attribute existence
  return content.indexOf(attr + '="') > -1;
}

// get the value of an attribute (attributeName="value")
export function getTagAttribute(attr, content) {
  var fndx = -1,
      lndx = -1;

  fndx = content.indexOf(attr + '="');
  if(fndx === -1) {
    console.warn("Warning: no tag of name `" + attr + "` found in the following content: `" + content + "`")
    return "";
  }

  content = content.slice(fndx + attr.length + 2);
  lndx = content.indexOf('"');
  content = content.slice(0, lndx);
  return content;
}

// set the value of an attribute (attributeName="value")
export function setTagAttribute(attr, content, value) {
  var fndx = -1,
      lndx = -1
      left = ""
      right = "";

  fndx = content.indexOf(attr + '="');
  left = content.slice(0, fndx + attr.length + 2);
  content = content.slice(fndx + attr.length + 2);
  lndx = content.indexOf('"');
  right = content.slice(lndx);
  content = left + value + right;
  return content;
}

// rename one attribute name to another (attributeName="value")
export function changeTagAttributeName(attr, content, newAttr) {
  var fndx = -1,
      lndx = -1
      left = ""
      right = "";

  fndx = content.indexOf(attr + '="');
  left = content.slice(0, fndx);
  right = content.slice(fndx + attr.length);
  return left + newAttr + right;
}

// removes an attribute from a tag along with its value (attributeName="value")
export function removeTagAttribute(attr, content) {
  var fndx = -1,
      lndx = -1,
      left = "",
      right = "",
      middle = content;

  if(hasTagAttribute(attr, middle)) {
    fndx = middle.indexOf(attr + '="');
    left = middle.slice(0, fndx);
    right = middle.slice(fndx + attr.length + 2);
    // really naive for now - just look for another '"'
    lndx = right.indexOf('"');
    if(lndx === -1) {
      console.error('ERROR: No close `"` in tag ' + content)
      return content;
    }
    else {
      right = right.slice(lndx + 1);
      middle = "";
    }
  }
  return left + middle + right;
}

// adds an attribute from a tag along with a value (attributeName="value")
export function addTagAttribute(attr, content, value) {
  var fndx = -1,
      lndx = -1,
      left = "",
      right = "",
      middle = content;

  lndx = middle.indexOf(" ");
  if(lndx > -1) {
    left = middle.slice(0, lndx);
    right = middle.slice(lndx);
    middle = ` ${attr}="${value}"`;
  }

  return left + middle + right;
}
