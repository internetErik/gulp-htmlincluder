import { hasTagAttribute, getTagAttribute } from '../attributes';
import { getDataFromJsonPath } from '../util/parsing';
import { jsonPathAttribute } from '../config';

// <!--#jsonInsert jsonPath="" default="" -->
export default function processJsonInsert(tag) {
  var jsonPath = "",
      rawJson  = "",
      defaultValue = "",
      jsonData = "";

  jsonPath = getTagAttribute(jsonPathAttribute, tag);

  if(hasTagAttribute("default", tag))
    defaultValue = getTagAttribute('default', tag);

  jsonData = getDataFromJsonPath(jsonPath);

  if(jsonData || defaultValue)
    return jsonData || defaultValue;
  else {
    console.warning("ERROR: jsonPath `" + jsonPath + "` is undefined, and no default value");
    return "";
  }
}
