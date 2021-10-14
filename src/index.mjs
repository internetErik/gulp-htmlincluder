import { configureFiles, setOptions, pageFiles, options } from './config.mjs';
import { processFile } from './parse.mjs';

module.exports = {
  initialize : options => setOptions(options),
  // puts files into hash maps
  hashFile : file => {
    const f = formatFile(file);

    // removing clip right away does no damage and speeds up later processing
    processClip(f);

    configureFiles(f);
  },
  // map on page files and build them into strings
  buildFileResult : callback => pageFiles.map(file => {
    const processedFile = processFile(file, options.jsonInput || {});
    file.content = processedFile.content;

    file.processed = true;

    if(callback)
      callback(file);

    return file;
  }),
};

const isWin = /^win/.test(process.platform);

const formatFile = file => {
  let f = {
    path : file.path,
    content : file.contents.toString('utf8').trim(),
    processed : false,
    file : file,
  };

  f.name = (isWin) ? file.path.split('\\') : file.path.split('/');
  f.name = f.name[f.name.length-1];

  return f;
}

// This runs first, since all of the clipped areas will completely be removed
const processClip = file => {
  // process clipbefore and clipafter
  if(file.content.indexOf('<!--#clipbefore') > -1) {
    file.content = file.content
      .split(/<!--#clipbefore\s*-->/)
      .splice(1)[0]
      .split('<!--#clipafter')
      .splice(0,1)[0];
  }

  // process clipbetween
  if(file.content.indexOf('<!--#clipbetween') > -1) {
    const tmp = file.content.split(/<!--#clipbetween\s*-->/);
    file.content = tmp[0] + tmp[1].split(/<!--#endclipbetween\s*-->/)[1];
  }
}
