import processClip from './tags/clip';
import processContent from './tags';
import { configureFiles, setOptions, pageFiles, options } from './config';
import { File } from './util/file';

module.exports = {
  initialize : options => setOptions(options),
  // puts files into hash maps
  hashFile : file => {
    const f = File(file);

    processClip(f);

    configureFiles(f);
  },
  // builds string
  buildFileResult : callback => pageFiles.map(file => {
    file.content = processContent(file.content, file.path, options.jsonInput || {});

    // correct any unknown tags that were modified
    file.content = file.content.replace(/<!--!#/g, '<!--#');
    file.processed = true;

    if(callback)
      callback(file);

    return file;
  }),
};
