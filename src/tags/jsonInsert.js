import { hasTagAttribute, getTagAttribute } from '../attributes';
import { getDataFromJsonPath } from '../util/parsing';
import { jsonPathAttribute } from '../config';

// <!--#jsonInsert jsonPath="" default="" -->
export default function processJsonInsert(tag) {
  let defaultValue = (hasTagAttribute("default", tag))
    ? getTagAttribute('default', tag)
    : "";
  let jsonPath = getTagAttribute(jsonPathAttribute, tag);
  let jsonData = getDataFromJsonPath(jsonPath);

  if(jsonData || defaultValue)
    return jsonData || defaultValue;
  else {
    console.warn("ERROR: jsonPath `" + jsonPath + "` is undefined, and no default value");
    return "";
  }
}
