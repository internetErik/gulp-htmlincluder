import { hasTagAttribute, getTagAttribute } from '../attributes';
import { addRawJsonWhereJsonPath, appendJsonParentPath } from '../json';
import { buildPathFromRelativePath, updateRelativePaths } from '../util/file';
import { jsonPathAttribute, filePathAttribute, insertFiles } from '../config';

// <!--#insert path="" -->
export default function processInsert(file) {
  var filename = "",
      rawJson = "",
      jsonPath = "",
      jsonParentPath = "",
      content  = file.content;

  if(hasTagAttribute(jsonPathAttribute, content))
    jsonParentPath = getTagAttribute(jsonPathAttribute, content);

  if(hasTagAttribute('rawJson', content))
    rawJson = getTagAttribute('rawJson', content);

  if(hasTagAttribute(filePathAttribute, content)) {
    filename = getTagAttribute(filePathAttribute, content);
    filename = buildPathFromRelativePath(file.path, filename);
  }
  else if(hasTagAttribute('absPath', content))
    filename = getTagAttribute("absPath", content)

  if(insertFiles[filename])
    content = insertFiles[filename].content;
  else {
    console.error("ERROR: in file " + file.path + ": insert file `" + filename + "` does not exist");
    return "";
  }

  if(rawJson)
    content = addRawJsonWhereJsonPath(content, rawJson);
  else if(jsonParentPath)
    content = appendJsonParentPath(content, jsonParentPath);

  if(file.tmpPath)
    content = updateRelativePaths(file.tmpPath, content);

  return content;
}
