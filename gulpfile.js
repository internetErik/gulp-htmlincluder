const { src, dest, watch, series } = require('gulp');
var includer = require('./index');

var paths = {
  html: './test/html/**/*.html',
  htmlBuild: './test/html-built',
}

function genericHtmlIncluder(path) {
  const jsonInput = { heading : 'hello world' };
  src(path)
  .pipe(includer({ jsonInput }))
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

exports.broken = function(cb) {
  genericHtmlIncluder([
    './test/html/broken.html',
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

exports.default = function(cb) {
  let options = {
    jsonInput: {
      message : 'test message',
      heading : 'hello world',
    }
  };
  src(paths.html)
  .pipe(includer(options))
  .pipe(dest(paths.htmlBuild))
  cb();
}
