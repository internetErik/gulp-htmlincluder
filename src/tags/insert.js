import { hasTagAttribute, getTagAttribute } from '../attributes';
import { addRawJsonWhereJsonPath, appendJsonParentPath } from '../json';
import { buildPathFromRelativePath, updateRelativePaths } from '../util/file';
import { jsonPathAttribute, filePathAttribute, insertFiles } from '../config';

// <!--#insert path="" -->
export default function processInsert(file, jsonContext) {
  let filename = "";
  let content  = file.content;

  let rawJson = (hasTagAttribute('rawJson', content))
        ? getTagAttribute('rawJson', content)
        : "";

  let jsonParentPath = (hasTagAttribute(jsonPathAttribute, content))
    ? getTagAttribute(jsonPathAttribute, content)
    : "";

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

  return [rawJson, jsonParentPath, file.tmpPath, content];
}
