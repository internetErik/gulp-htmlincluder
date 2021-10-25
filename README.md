# gulp-htmlincluder
[![NPM version][npm-image]][npm-url]  [![Dependency Status][depstat-image]][depstat-url]

> htmlincluder plugin for [gulp](https://github.com/wearefractal/gulp)

## What does this do?

This allows you to insert a special markup into your files to do a number of things:
* insert files into other files
* wrap a file with another file
* clip off certain parts of a file
* inject data for use in adding text to files
* basic control flow (if and each) to use with data

## What to use this for?

This was written with the intention of working on static websites while still allowing for a component based development. It also was intended to let the individual components be testable by themselves by allowing the individual component files to include portions that would be removed on build.

It also can allow the inclusion of some dynamic content into these static sites, as long as you can wrangle said content into a json object and pass it in when you are building.

I'm sure this can be put to a much broader use than originally intended (and may do for a name change at some point, since there is no reason you couldn't include json files into json files, or do other things.)

## A Brief Warning

Certain features use `eval`. I have flagged these features below, but please use caution when using them so that you don't have any untrusted data that isn't unsanitized going into the system. It could lead to compromising the build environment or XSS attacks in the resulting html.

## Install and Setup


```shell
npm install --save-dev gulp gulp-htmlincluder
```

`gulpfile.js` (Using gulp 4):

```javascript
const { src, dest } = require('gulp');
const includer = require('gulp-htmlincluder');

// A simple method for making basic api requests.
const http = require('http');
const getApiData = url => new Promise((resolve, reject) => {
  http.get(url, resp => {
    let data = '';
    resp.on('data', chunk => data += chunk)
    resp.on('end', () => resolve(JSON.parse(data)))
  })
})

exports.includer = function(path) {
  // optional use of json data. options object is not required
  const jsonInput = require('./input-file.json');
  const rawJsonPlugins = { getApiData };
  src('./src/**/*.html')
  .pipe(includer({ jsonInput, rawJsonPlugins }))
  .pipe(dest('./dist/'))
}

```

you can then run this with `gulp includer`

`gulpfile.js` (using earlier versions of gulp):


```javascript
var gulp = require('gulp'),
	includer = require('gulp-htmlincluder');

gulp.task('htmlIncluder', function() {
  // optional use of json data. options object is not required
  var json = require('./input-file.json');
  var options = {
    jsonInput : json,
  };
  gulp.src('./src/**/*.html')
    .pipe(includer(options))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['htmlIncluder']);

gulp.task('watch', function() {
  gulp.watch(['files/*.html'], function(event) {
    gulp.start('default');
  });
});
```

## *File Naming Requirement*

htmlincluder *requires* files follow a particular naming convention.

Files that you want to include in other files begin with `-`.

Files that you want to wrap around other files begin with `_`.

Files that you want to use to build the resulting static pages can be named however you want, as long as they don't begin with `-` or `_`.

Right now this is necessary because the files that will ultimately exist in the build folder are those that don't start with `-` or `_`. I'd love to change this to determine this in another manner (for example, only files that aren't included are finally built).

## Includer Tags

It is probably best to learn from examples. These can be found in the `./test/html` folder of this repository. These can be run by cloning this repository, running `npm install` and then `npx gulp`. Check the `gulpfile.js` for specifics if you just want to try building single files.

### Terminology

Basic tag structure

`<!--#tagName attributeName="attributeValue" -->`

### All Tags

Note: `*` means required attribute

* Wrapping a file with another file
  * `<!--#wrap path="*" jsonPath="" rawJson="" -->`
  * `<!--#middle -->` <-- content wrapped replaces the `middle` tag
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

Example:
```
src
|- components
|  |- -header.html
|- index.html
```

in `index.html` the `path` for `-header.html` is:

`<!--#tagName path="./components/-header.html" -->`

#### jsonPath

A path to data in a json object.

Example:

```
{
  a: {
    b: {
      c: 'hello world'
    }
  }
}
```

The path to `c` is:

`<!--#tagName jsonPath="a.b.c" -->`

#### rawJson *(uses `eval`)*

A string that, when converted to JavaScript and executed, produces a json object. You can access this data using your jsonPath attribute.

For example:

`rawJson="{ sample : 'this is some data to use!' }"`

You can pass in a self-invoking function you can invoke this function with the arguments `json` and/or `plugins`.

`rawJson="((json, {}) => ({ title: 'generated object?'}))(json, plugins)"`

`json` represents the json object that you may pass in to the options for htmlincluder when invoking it in your gulp task. `plugins`

It would even be possible to use an async function to load data from a service or CMS:

`rawJson="(async ({ fetch }) => { const response = await fetch('https://cms.com/api'); return response.json(); })(plugins)"`

*Warning*

Internally `eval` is used so beware. But also, you could technically write a script that generates an object if you need more complicated data.

Of course, if you're loading data from an api it could be compromised. If it contains something like:

`<script>console.log('gotcha')</script>`

You may have compromised your users. So beware!

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

#### Configure insert to use other text

If you want to use ssi includes along with this, and so have the insert string follow that format there is an argument to pass into the htmlincluder in gulp.

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

```html
<!--#each count="5" -->
  <div>hello world</div>
<!--#endeach -->
```

Results:
```html
  <div>hello world</div>

  <div>hello world</div>

  <div>hello world</div>

  <div>hello world</div>

  <div>hello world</div>
```

#### each over other tags

```html
<!--#each count="5" -->
  <!--#insert path="./-insert-hello-world.html" -->
<!--#endeach -->
```

Results:
```html
  <div>hello world</div>

  <div>hello world</div>

  <div>hello world</div>

  <div>hello world</div>

  <div>hello world</div>
```

#### With an array of values in json input

```html
<!--#each jsonPath="data" rawJson="{ data : [1, 2, 3, 4] }" -->
  <div><!--#data --></div>
<!--#endeach -->
```

Results:
```html

  <div>1</div>

  <div>2</div>

  <div>3</div>

  <div>4</div>


```

#### With an array of values


```html
<!--#each rawJson="[1, 2, 3, 4]" -->
  <div><!--#data jsonPath="this" --></div>
<!--#endeach -->
```

Results:
```html
  <div>1</div>

  <div>2</div>

  <div>3</div>

  <div>4</div>
```

#### Array limited by count


```html
<!--#each jsonPath="this" rawJson="[1, 2, 3, 4]" count="2" -->
  <div><!--#data jsonPath="this" --></div>
<!--#endeach -->
```

Results:
```html
  <div>1</div>

  <div>2</div>
```

#### With an array of objects

**note: use single quotes in json objects, which means you'll need to escape**

```html
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
```html
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

## More Examples

Look in `./test/html`

## ToDo

* Build out more tests - consider more automated versions of them
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
