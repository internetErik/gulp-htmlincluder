# gulp-htmlincluder
[![NPM version][npm-image]][npm-url]  [![Dependency Status][depstat-image]][depstat-url]

> htmlincluder plugin for [gulp](https://github.com/wearefractal/gulp)

## Introduction

htmlincluder allows you to break your html files into sepparate modules that can be tested on their own, and then built together.  

htmlincluder looks through your files for special html comments that it will use to parse them and do the insertions correctly.

## Usage


### Install
```shell
npm install --save-dev gulp-htmlincluder
```

### Sample `gulpfile.js`
Then, add it to your `gulpfile.js`:

```javascript
var gulp = require('gulp'),
	includer = require('gulp-htmlincluder');

gulp.task('htmlIncluder', function() {
    gulp.src('files/*.html')
    	.pipe(includer())
        .pipe(gulp.dest('dist/'));
});


gulp.task('default', ['htmlIncluder']);


gulp.task('watch', function() {
    gulp.watch(['files/*.html'], function(event) {
      gulp.start('default');
    });
});
```

## API

### File naming convention
htmlincluder requires files follow a particular naming convention.

Files that you want to include in other files begin with `-`.

Files that you want to wrap around other files begin with `_`.

Files that you want to use to build the resulting static pages can be named however you want, as long as they don't begin with `-` or `_`.

### Insert
This is the simplest use case.  Simply put the following html comment

`<!--#insert file="filename" -->`

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
<!--#insert file="-file2.html" -->
</body>
</html>
```

`-file2.html`
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

#### Configure insert to use other text

If you want to use ssi includes along with this, and so have the insert string follow that format there is an arguemtn to pass into the htmlincluder in gulp. 

Thanks to theSLY for suggesting this!

```javascript
var gulp = require('gulp'),
  includer = require('gulp-htmlincluder');

gulp.task('htmlIncluder', function() {
    gulp.src('files/*.html')
//now looks for &lt;!--#include virtual, instead of &lt;!--#insert  
      .pipe(includer('include virtual')) 
      .pipe(gulp.dest('dist/'));
});


gulp.task('default', ['htmlIncluder']);


gulp.task('watch', function() {
    gulp.watch(['files/*.html'], function(event) {
      gulp.start('default');
    });
});
```

### Wrap
`<!--#wrap file="filename" -->`
AND
`<!--#endwrap file="filename" -->`

The middle tag must be placed in the wrap file so we know where to put the middle part of the other file
`<!--#middle -->`

#### Example

`file1.html`
```html
<!--#wrap file="_file2.html" -->
  hello world
<!--#endwrap file="_file2.html" -->
```

`_file2.html`
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
<!--#middle -->
</body>
</html>
```

Results:
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

### Clip tops and bottoms off of files
`<!--#clipbefore -->`

`<!--#clipafter -->`

#### Example
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
<!--#clipbefore -->
blah
<!--#clipafter -->
</body>
</html>
```

Results:
```html
blah
```

### Clip between
`<!--#clipbetween -->`

`<!--#endclipbetween -->`

#### Example
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
something
<!--#clipbetween -->
a widget!
<!--#endclipbetween -->
something else
</body>
</html>
```

Results:
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
something
something else
</body>
</html>
```

## More Complicated Examples

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
