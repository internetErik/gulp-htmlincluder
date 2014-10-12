# gulp-html-ssi
[![NPM version][npm-image]][npm-url]  [![Dependency Status][depstat-image]][depstat-url]

> gulp-html-ssi plugin for [gulp](https://github.com/wearefractal/gulp)

## Introduction

gulp-html-ssi allows you to compile your html files with includes.

gulp-html-ssi looks through your files for special html comments that it will use to parse them and do the include correctly.

## Usage


### Install
```shell
npm install --save-dev gulp-html-ssi
```

### Sample `gulpfile.js`
Then, add it to your `gulpfile.js`:

```javascript
var gulp = require('gulp'),
	includer = require('gulp-html-ssi');

gulp.task('htmlSSI', function() {
	gulp.src('./source/**/*.html')
		.pipe(includer())
		.pipe(gulp.dest('./build/'));
});

gulp.task('default', ['htmlSSI']);

gulp.task('watch', function() {
	gulp.watch(['./source/**/*.html'], function(event) {
		gulp.start('default');
	});
});
```

## API

### File naming convention
 gulp-html-ssi requires files follow a particular naming convention.

Files that you want to include in other files begin with `_`.

Files that you want to use to build the resulting static pages can be named however you want, as long as they don't begin with `_`.

### Include
This is the simplest use case.  Simply put the following html comment

`<!--#include file="_filename" -->`

or

`<!--#include virtual="_filename" -->`

#### Example

`file1.html`
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
<!--#include file="__file2.html" -->
</body>
</html>
```

`__file2.html`
```html
  hello world
```

Results
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
  hello world
</body>
</html>
```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/gulp-htmlincluder
[npm-image]: https://badge.fury.io/js/gulp-htmlincluder.png

[travis-url]: http://travis-ci.org/internetErik/gulp-htmlincluder
[travis-image]: https://secure.travis-ci.org/internetErik/gulp-htmlincluder.png?branch=master

[coveralls-url]: https://coveralls.io/r/internetErik/gulp-htmlincluder
[coveralls-image]: https://coveralls.io/repos/internetErik/gulp-htmlincluder/badge.png

[depstat-url]: https://david-dm.org/internetErik/gulp-htmlincluder
[depstat-image]: https://david-dm.org/internetErik/gulp-htmlincluder.png
