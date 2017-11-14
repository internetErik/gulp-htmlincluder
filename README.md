# gulp-htmlincluder
[![NPM version][npm-image]][npm-url]  [![Dependency Status][depstat-image]][depstat-url]

> htmlincluder plugin for [gulp](https://github.com/wearefractal/gulp)

## What does this do?

At it's most basic level, this allows you to build files out of other files by marking up your files in a particular way. It also lets you insert data into these files (from a json object).

## What was this intended to do?

htmlincluder was written with the intention of working on static websites while still allowing for a component based development. It also was intended to let the individual components be testable by themselves by allowing the individual component files to include portions that would be removed on build.

It also can allow the inclusion of some dynamic content into these static sites, as long as you can wrangle said content into a json object and pass it in when you are building.

I'm sure this can be put to a much broader use than originally intended (and may do for a name change at some point, since there is no reason you couldn't include json files into json files, or do other things.)

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

// and example using a json data file
gulp.task('htmlIncluderJson', function() {
  var json = require('./input-file.json');
  var options = {
    jsonInput    : json,
  };

  gulp.src('files/*.html')
    .pipe(includer(options))
    .pipe(gulp.dest('dist/'));
});


gulp.task('default', ['htmlIncluder']);

gulp.task('includeJson', ['htmlIncluderJson']);

gulp.task('watch', function() {
  gulp.watch(['files/*.html'], function(event) {
    gulp.start('default');
  });
});
```

## API

### *File Naming Requirement*
htmlincluder *requires* files follow a particular naming convention.

Files that you want to include in other files begin with `-`.

Files that you want to wrap around other files begin with `_`.

Files that you want to use to build the resulting static pages can be named however you want, as long as they don't begin with `-` or `_`.

Right now this is necessary because the files that will ultimately exist in the build folder are those that don't start with `-` or `_`. I'd love to change this to determine this in another manner (for example, only files that aren't included are finally built). Would love a pull request trying this since I'm not sure I'll get around to it soon.

### Insert

This is the simplest use case.  Simply put the following html comment

`<!--#insert path="filename" -->`

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
<!--#insert path="-file2.html" -->
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
  var options = {
    insertPattern: 'include virtual',
  };

  gulp.src('files/*.html')
//now looks for &lt;!--#include virtual, instead of &lt;!--#insert
    .pipe(includer(options))
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
`<!--#wrap path="filename" -->`
AND
`<!--#endwrap path="filename" -->`

The middle tag must be placed in the wrap file so we know where to put the middle part of the other file
`<!--#middle -->`

#### Example

`file1.html`
```html
<!--#wrap path="_file2.html" -->
  hello world
<!--#endwrap path="_file2.html" -->
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

### data

Inside of wrap and insert tags that you have used the `jsonPath` attribute on you can use use this tag to print data that has been passed down.

`<!--#data jsonPath="path.to.json" -->`

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
<!--#insert path="-insert.html" jsonPath="hello" -->
</body>
</html>
```

`-insert.html`
```html
<div>
  <!--#data jsonPath="world" -->
</div>
```

`file.json`
```json
  {
    "hello" : {
      "world" : "hello world"
    }
  }
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
  <div>
    hello world
  </div>
</body>
</html>
```



### jsonInsert

When using a json data file, you can pull data from it directly using this tag.

`<!--#jsonInsert jsonPath="path.to.json" -->`

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
<!--#jsonInsert jsonPath="hello.world" -->
</body>
</html>
```

`file.json`
```json
  {
    "hello" : {
      "world" : "hello world"
    }
  }
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

#### Inline json objects

Instead of using the data file, you can provide a raw json object

`<!--#jsonInsert jsonPath="path.to.json" rawJson="{ path: { to: { json: "hello world" } } }" -->`

Results

`hello world`

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
