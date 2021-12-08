const { src, dest, watch, series, parallel } = require('gulp');
const includer = require('./index');
const babel = require('gulp-babel');

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
  jsReact : './test/js-react/index.js',
  jsReactBuild : './test/html-built/js-react-built',
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


// This is for building react components that are used to test
// including individual react components in case you wanted to use this to generate
// style guides with react components
// to use this, you need to install npm install react and react-dom
function jsReact(cb) {
  src(paths.jsReact)
    .pipe(babel({
      presets: [
        '@babel/preset-env',
        { modules: false },
        '@babel/preset-react'
      ],
    }))
    .pipe(dest(paths.jsReactBuild))
  cb();
}

function htmlReact(cb) {
  genericHtmlIncluder([
    './test/html/react.html',
  ]);
  cb();
}

exports.react = parallel(htmlReact, jsReact);

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
