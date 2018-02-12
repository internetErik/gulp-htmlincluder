import { hasTagAttribute, getTagAttribute } from '../attributes';
import { processRawJson } from '../json';
import { getDataFromJsonPath } from '../util/parsing';
import { jsonPathAttribute } from '../config';

// <!--#data jsonPath="" default="" -->
export default function processDataTag(tag) {
  let jsonPath = "",
      rawJson = "",
      defaultValue = "",
      jsonData = "";

  jsonPath = getTagAttribute(jsonPathAttribute, tag);

  if(hasTagAttribute("default", tag))
    defaultValue = getTagAttribute('default', tag);

  if(hasTagAttribute('rawJson', tag)) {
    rawJson = getTagAttribute('rawJson', tag);
    rawJson = processRawJson(rawJson);
  }

  jsonData = getDataFromJsonPath(jsonPath, rawJson);

  return jsonData || defaultValue;
}
