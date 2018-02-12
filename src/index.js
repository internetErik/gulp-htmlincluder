import processClip from './tags/clip';
import processContent from './tags';
import { configureFiles, setOptions } from './config';

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
    file.content = processContent(file.content, file.path);
    file.processed = true;

    if(callback)
      callback(file);

    return file;
  }),
};
