const { src, dest, watch, series } = require('gulp');
const includer = require('./index');

// const http = require('http');
const getApiData = url => new Promise((resolve, reject) => {
  // http.get(url, resp => {
  //   let data = '';
  //   resp.on('data', chunk => data += chunk)
  //   resp.on('end', () => resolve(JSON.parse(data)))
  // })
  resolve({ heading : 'This is async heading copy', bodyCopy : 'this is async body copy' })
})

const paths = {
  html: './test/html/**/*.html',
  htmlBuild: './test/html-built',
}

function genericHtmlIncluder(path) {
  const jsonInput = { heading : 'hello world' };
  const rawJsonPlugins = { getApiData };
  src(path)
  .pipe(includer({ jsonInput, rawJsonPlugins }))
  .pipe(dest(paths.htmlBuild))
}

exports.nested = function(cb) {
  genericHtmlIncluder([
    './test/html/nestedTags.html',
    './test/html/wrappers/*.html',
    './test/html/components/*.html'
  ])
  cb();
}

exports.simple = function(cb) {
  genericHtmlIncluder([
    './test/html/simple.html',
    './test/html/wrappers/*.html',
    './test/html/components/*.html'
  ])
  cb();
}

exports.clipping = function(cb) {
  genericHtmlIncluder([
    './test/html/clipping.html',
    './test/html/wrappers/*.html',
    './test/html/components/*.html'
  ])
  cb();
}

exports.complex = function(cb) {
  genericHtmlIncluder([
    './test/html/complex.html',
    './test/html/wrappers/*.html',
    './test/html/components/*.html'
  ])
  cb();
}

exports.if = function(cb) {
  genericHtmlIncluder([
    './test/html/if.html',
    './test/html/wrappers/*.html',
    './test/html/components/*.html'
  ])
  cb();
}

exports.each = function(cb) {
  genericHtmlIncluder([
    './test/html/each.html',
    './test/html/wrappers/*.html',
    './test/html/components/*.html'
  ])
  cb();
}

exports.rawJsonFunction = function(cb) {
  genericHtmlIncluder([
    './test/html/raw-json-function.html',
    './test/html/components/*.html',
  ])
  cb();
}

exports.rawJsonAsyncFunction = function(cb) {
  genericHtmlIncluder([
    './test/html/raw-json-async-function.html',
    './test/html/components/*.html',
  ])
  cb();
}

exports.default = function(cb) {
  let options = {
    jsonInput: {
      message : 'test message',
      heading : 'hello world',
    },
    rawJsonPlugins : {
      getApiData,
    },
  };
  src(paths.html)
  .pipe(includer(options))
  .pipe(dest(paths.htmlBuild))
  cb();
}
