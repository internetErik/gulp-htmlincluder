import { isWin } from './platform';

function File(file) {
  var f = {
    name : '',
    path : file.path,
    content : file.contents.toString('utf8'),
    processed : false,
    file : file
  };

  f.name = (isWin) ? file.path.split('\\') : file.path.split('/');
  f.name = f.name[f.name.length-1];

  return f;
}

// overcome the difference in *nix/windows pathing
function fixFilePathForOS(path) {
  return (isWin) ? path.replace(/\//g, '\\') : path.replace(/\\/g, '/');
}

// given the current directory and a relative path, build the complete path
// to the relative path
export function buildPathFromRelativePath(cdir, fdir) {
  var dir,
      dirChar = (isWin) ? '\\' : '/';

  dir = cdir.split(dirChar);

  fdir = fixFilePathForOS(fdir);
  dir.pop();

  fdir.split(dirChar)
    .forEach(function(e) {
      (e === '..') ? dir.pop() : (e !== '.' && e !== '') ? dir.push(e) : void 0;
    });
  dir = dir.join(dirChar);
  if(devOptions.printPaths) {
    console.log("********buildPathFromRelativePath********")
    console.log("cdir  : ", cdir)
    console.log("fdir  : ", fdir)
    console.log("result: ", dir)
    console.log("********end buildPathFromRelativePath********")
  }
  return dir;
}

// Updates the relative path with the parent's path so it can be resolved on the
// next turn
export function updateRelativePaths(cdir, content) {
  var dir = "";
  content = splitContent(content);

  content = content.map(function(fragment) {
    if(fragment.indexOf(insertPattern)  === 0 ||
       fragment.indexOf('<!--#wrap')    === 0) {
      dir = getTagAttribute(filePathAttribute, fragment);
      dir = buildPathFromRelativePath(cdir, dir);
      fragment = setTagAttribute(filePathAttribute, fragment, dir);
      fragment = changeTagAttributeName(filePathAttribute, fragment, "absPath");
    }
    return fragment;
  })

  content = content.join('');
  return content;
}