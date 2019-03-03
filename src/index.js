import { configureFiles, setOptions, pageFiles, options } from './config';
import { processFile } from './parse';

module.exports = {
  initialize : options => setOptions(options),
  // puts files into hash maps
  hashFile : file => {
    const f = File(file);

    // removing clip right away does no damage and speeds up later processing
    processClip(f);

    configureFiles(f);
  },
  // builds string
  buildFileResult : callback => pageFiles.map(file => {
    const AST = processFile(file, options.jsonInput || {});
    file.content = AST.content;
    console.log(file.content);
    file.processed = true;

    if(callback)
      callback(file);

    return file;
  }),
};

const isWin = /^win/.test(process.platform);

function File(file) {
  var f = {
    name : '',
    path : file.path,
    content : file.contents.toString('utf8').trim(),
    processed : false,
    file : file
  };

  f.name = (isWin) ? file.path.split('\\') : file.path.split('/');
  f.name = f.name[f.name.length-1];

  return f;
}

// <!--#clipbefore -->
// <!--#clipafter -->
// <!--#clipbetween -->
// <!--#endclipbetween -->
// This runs first, since all of the clipped areas will completely be removed
function processClip(file) {
  var tmp;

  if(file.content.indexOf('<!--#clipbefore') > -1) {

    file.content = file.content
            .split(/<!--#clipbefore\s*-->/)
            .splice(1)[0]
            .split('<!--#clipafter')
            .splice(0,1)[0];
  }

  if(file.content.indexOf('<!--#clipbetween') > -1) {

    tmp = file.content
        .split(/<!--#clipbetween\s*-->/);

    file.content = tmp[0] + tmp[1].split(/<!--#endclipbetween\s*-->/)[1];
  }
}
