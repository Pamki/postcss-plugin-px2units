# postcss-plugin-autoview

[![NPM version](https://badge.fury.io/js/postcss-px-to-autoview.svg)](http://badge.fury.io/js/postcss-px-to-autoview)

A plugin for [PostCSS](https://github.com/postcss/postcss) that generates viewport units (vw/wh/rem) from pixel units.

<img align="right" width="135" height="95"
     title="Philosopher’s stone, logo of PostCSS"
     src="http://postcss.github.io/postcss/logo-leftp.svg">

## Features
If your project involves a fixed width, this script will help to convert pixels into viewport units(vw/wh/rem).

## Installation

```bash
$ npm i --save postcss-plugin-autoview
```

## Usage

### input and output

```css
// input
h1 {
    width: 100wx;
    height: 100hx;
    font-size: 12rx;
}

// output
h1 {
    width: 0.09259vw;
    height: 0.05208vh;
    font-size: 0.04688rem;
}
```

### original

```javascript
import { writeFile, readFileSync } from 'fs';
import postcss from 'postcss';
import autoview from 'postcss-plugin-autoview';

const css = readFileSync('/path/to/test.css', 'utf8');
const options = {
  replace: false,
};
const processedCss = postcss(autoview(options)).process(css).css;

writeFile('/path/to/test.rem.css', processedCss, err => {
  if (err) throw err;
  console.log('Rem file written.');
});
```

### with gulp

```javascript
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var autoview = require('postcss-plugin-autoview');
gulp.task('css', function () {
  var processors = [
    autoview
  ];
  return gulp.src('./src/*.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('./dest'));
});
```

### with webpack

```javascript
import autoview from 'postcss-plugin-autoview';
const autoviewOpts = {
  ......
};
 
export default {
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader',
      },
    ],
  },
  postcss: [autoview(autoviewOpts)],
}
```

### with [atool-build](https://github.com/ant-tool/atool-build)

`webpack.connfig.js`

```javascript
import webpack from 'atool-build/lib/webpack';
import autoview from 'postcss-plugin-autoview';

export default webpackConfig => {
  const autoviewOpts = {
    ......
  };
  webpackConfig.postcss.push(autoview(autoviewOpts));

  return webpackConfig;
};
```

## Configuration

Default:
```js
{
    unitToConvert: {rem:"rx",vw:"wx",vh:"hx"},
    viewportWidth: 1920, 
    viewportHeight: 1080,
    rootValue:256,
    viewportwidthUnit:'vh',
    viewportheightUnit: 'vw', 
    viewportfontUnit: 'rem', 
    unitPrecision: 5,
    minPixelValue: 1,
    exclude:false,
    mediaQuery: false,
    replace:true
}
```


- `unitToConvert` (Object) unit lits to convert, by default, it is {rem:"rx",vw:"wx",vh:"hx"}
- `viewportWidth` (Number) The width of the viewport.Default is 1920.
- `viewportHeight` (Number) The height of the viewport.Default is 1080.
- `rootValue` (Number) The root element font size. Default is 256. rootValue = viewportWidth*100/750
- `viewportwidthUnit` (Number)  a way to exclude some folder,eg. /(node_module)/.
- `viewportheightUnit` (Number) Expected height units.
- `unitPrecision` (Boolean/String)  The decimal numbers to allow the REM or VW OR VH units to grow to.
- `minPixelValue` (Number) Set the minimum pixel value to replace.
- `exclude` (Boolean|Reg)  a way to exclude some folder,eg. /(node_module)/.
- `mediaQuery` (Boolean) Allow px to be converted in media queries.
- `replace` (Boolean) replaces rules containing rems instead of adding fallbacks.
### License
Thanks postcss-plugin-pxtorem and postcss-px-to-viewport
