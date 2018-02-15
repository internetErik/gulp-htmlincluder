var gulp = require('gulp');
var includer = require('./index');

var paths = {
  html: './test/html/**/*.html',
  htmlBuild: './test/html-built',
}

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
