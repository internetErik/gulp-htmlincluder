(PLUGIN AUTHOR: Please read [Plugin README conventions](https://github.com/wearefractal/gulp/wiki/Plugin-README-Conventions), then delete this line)

# gulp-htmlincluder
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]  [![Coverage Status](coveralls-image)](coveralls-url) [![Dependency Status][depstat-image]][depstat-url]

> htmlincluder plugin for [gulp](https://github.com/wearefractal/gulp)

## Usage

First, install `gulp-htmlincluder` as a development dependency:

```shell
npm install --save-dev gulp-htmlincluder
```

Then, add it to your `gulpfile.js`:

```javascript
var htmlincluder = require("gulp-htmlincluder");

gulp.src("./src/*.ext")
	.pipe(htmlincluder({
		msg: "Hello Gulp!"
	}))
	.pipe(gulp.dest("./dist"));
```

## API

### htmlincluder(options)

#### options.msg
Type: `String`  
Default: `Hello World`

The message you wish to attach to file.


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
