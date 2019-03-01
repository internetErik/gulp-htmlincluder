# gulp-htmlincluder
[![NPM version][npm-image]][npm-url]  [![Dependency Status][depstat-image]][depstat-url]

> htmlincluder plugin for [gulp](https://github.com/wearefractal/gulp)

## What does this do?

At it's most basic level, this allows you to build files out of other files by marking up your files in a particular way. It also lets you insert data into these files from a json object provided from outside.

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

### Terminology

Basic tag structure

`<!--#tagName attributeName="attributeValue" -->`

### All Tags

Note: '*' means required attribute

* Wrapping a file with another file
  * `<!--#wrap path="*" jsonPath="" rawJson="" -->`
  * `<!--#middle -->` <-- the wrapped file gets inserted here
  * `<!--#endwrap -->`
* Inserting a file
  * `<!--#insert path="*" jsonPath="" rawJson="" -->`
* Inserting Json (passed in from parent component)
  * `<!--#data jsonPath="*" default="" rawJson="" -->`
* Inserting Json (from data input, or default value)
  * `<!--#jsonInsert jsonPath="*" default="" -->`
* Control Flow
  * If
    * `<!--#if jsonPath="*" rawJson="" -->`
    * `<!--#endif -->`
  * Each (repeater)
    * `<!--#each count="*" jsonPath="" rawJson="" -->`
    * `<!--#endeach -->`
* Clipping (Ignores parts of file)
  * `<!--#clipbefore -->`
  * `<!--#clipafter -->`
  * `<!--#clipbetween -->`
  * `<!--#endclipbetween -->`

### Attributes

#### path

A relative (to current file) path to a file.

#### jsonPath

A path to data in a json object. For example:

```
{
  a: {
    b: {
      c: 'hello world'
    }
  }
}
```

The path to `c` is `a.b.c`.

#### rawJson

A string that contains a json object.

*Warning*

Internally `eval` is used so beware. But also, you could technically write a script that generates an object if you need more complicated data.

For example:

`rawJson="(function(){ return {title: 'generated object?'} })()"`

#### count

On an #each you can tell it how many times to repeat the inner content with a count attribute

`<!--#each count="3" -->hello world<!--#endeach -->`


### Insert

This is the simplest use case.  Simply put the following html comment

`<!--#insert path="<relative-path-to-file.ext>" jsonPath="" rawJson="" -->`

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

`<!--#wrap path="<relative-path-to-file.ext>" jsonPath="" rawJson="" -->`

AND

`<!--#endwrap -->`

The middle tag must be placed in the wrap file so we know where to put the middle part of the other file

`<!--#middle -->`

#### Example

`file1.html`
```html
<!--#wrap path="_file2.html" -->
  hello world
<!--#endwrap -->
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

`<!--#data jsonPath="<path.to.json>" default="some text" rawJson="" -->`

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
<!-- JSON path passed down from above -->
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

`<!--#jsonInsert jsonPath="<path.to.json>" rawJson="" -->`

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

### Each

Each can be used to iterate over a json array, or just to repeat some data a number of times.

#### Just with a count

```
<!--#each jsonPath="this" count="5" -->
  <div>hello world</div>
<!--#endeach -->
```

Results:
```

  <div>hello world</div>

  <div>hello world</div>

  <div>hello world</div>

  <div>hello world</div>

  <div>hello world</div>


```

#### With an array of values in json input

json input:
```
{
  data : [1, 2, 3, 4]
}
```


```
<!--#each jsonPath="data" -->
  <div><!--#data --></div>
<!--#endeach -->
```

Results
```

  <div>1</div>

  <div>2</div>

  <div>3</div>

  <div>4</div>


```

#### With an array of values


```
<!--#each jsonPath="this" rawJson="[1, 2, 3, 4]" -->
  <div><!--#data --></div>
<!--#endeach -->
```

Results
```

  <div>1</div>

  <div>2</div>

  <div>3</div>

  <div>4</div>


```

#### With an array of values, limited by count


```
<!--#each jsonPath="this" rawJson="[1, 2, 3, 4]" count="2" -->
  <div><!--#data --></div>
<!--#endeach -->
```

Results
```

  <div>1</div>

  <div>2</div>


```

#### With an array of objects

**note: use single quotes in json objects, which means you'll need to escape**

```
<!--#each jsonPath="this" rawJson="[
    { name: 'Tom', age: 33, bio: 'Bio for Tom' },
    { name: 'Dick', age: 55, bio: 'Dick\'s bio' },
    { name: 'Jane', age: 28, bio: 'Bio for Jane' },
    { name: 'Harry', age: 27 },
  ]" -->
  <div>name: <!--#data jsonPath="name" --></div>
  <div>age: <!--#data jsonPath="age" --></div>
  <div>bio: <!--#data jsonPath="bio" default="nothing is known about them" --></div>
<!--#endeach -->
```

Results:
```

  <div>name: Tom</div>
  <div>age: 33</div>
  <div>bio: Bio for Tom</div>

  <div>name: Dick</div>
  <div>age: 55</div>
  <div>bio: Dick's bio</div>

  <div>name: Jane</div>
  <div>age: 28</div>
  <div>bio: Bio for Jane</div>

  <div>name: Harry</div>
  <div>age: 27</div>
  <div>bio: nothing is known about them</div>


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

## ToDo

* Support arbitrarily nested tagging (e.g., <!--# <!--# --> -->)
* Rewrite more recursively so the code is more managable and so extensible
* Implement some form of caching so only changed files need be processed

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
