import { hasTagAttribute, getTagAttribute } from '../attributes';
import { processRawJson } from '../json';
import { getDataFromJsonPath } from '../util/parsing';
import { jsonPathAttribute } from '../config';

// <!--#data jsonPath="" default="" -->
export default function processDataTag(tag, jsonContext) {
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
  else if(jsonContext)
    rawJson = processRawJson(jsonContext);

  jsonData = getDataFromJsonPath(jsonPath, rawJson);
  let result = jsonData || defaultValue;

  return (typeof(result) === 'string')
    ?  result
    : JSON.stringify(result).replace(/"/g, "'");
}
