var gulp = require('gulp');
var includer = require('./index');

var paths = {
  html: './test/html/**/*.html',
  htmlBuild: './test/html-built',
}

function genericHtmlIncluder(path) {
  gulp.src(path)
    .pipe(includer({}))
    .pipe(gulp.dest(paths.htmlBuild))
}

gulp.task('simple', function() {
  genericHtmlIncluder([
    './test/html/simple.html',
    './test/html/wrappers/*.html',
    './test/html/components/*.html'
  ])
})

gulp.task('clipping', function() {
  genericHtmlIncluder([
    './test/html/clipping.html',
    './test/html/wrappers/*.html',
    './test/html/components/*.html'
  ])
})

gulp.task('complex', function() {
  genericHtmlIncluder([
    './test/html/complex.html',
    './test/html/wrappers/*.html',
    './test/html/components/*.html'
  ])
})

gulp.task('if', function() {
  genericHtmlIncluder([
    './test/html/if.html',
    './test/html/wrappers/*.html',
    './test/html/components/*.html'
  ])
})

gulp.task('each', function() {
  genericHtmlIncluder([
    './test/html/each.html',
    './test/html/wrappers/*.html',
    './test/html/components/*.html'
  ])
})

gulp.task('default', function() {
  let options = {
    jsonInput: {
      message: 'test message'
    }
  };
  gulp.src(paths.html)
    .pipe(includer(options))
    .pipe(gulp.dest(paths.htmlBuild))
});
