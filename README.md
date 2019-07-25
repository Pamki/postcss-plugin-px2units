# postcss-plugin-px2units

[![NPM version](https://badge.fury.io/js/postcss-plugin-px2units.svg)](http://badge.fury.io/js/postcss-plugin-px2units)

A plugin for [PostCSS](https://github.com/postcss/postcss) that generates viewport units (vw/wh/rem) from pixel units.

<img align="right" width="135" height="95"
     title="Philosopher’s stone, logo of PostCSS"
     src="http://postcss.github.io/postcss/logo-leftp.svg">

## Features
If your project involves a fixed width, this script will help to convert pixels into viewport units(vw/wh/rem).

## Installation

```bash
$ npm i --save postcss-plugin-px2units
```

## Usage

### input and output
```
//option
{
      viewportWidth: 38.40, //  3840/100
      viewportHeight: 23.04, // 2304/100
      rootValue: 200, //  3840*100/1920
    }
```
```css
// input
html { font-size: 100px;}
@media screen and (max-width: 3840px) {
    html { font-size: 200px;}
  }
@media screen and (max-width: 1920px) {
    html { font-size: 100px;}
}
.left{
   width: 930wx;  
   font-size: 36rx;
}
.right{
    width: 930wx;
    font-size: 36rx;
}
.center{
    width: 1768wx;
    font-size: 64rx; 
}

// output
html { font-size: 100px;}
@media screen and (max-width: 3840px) {
    html { font-size: 200px;}
  }
@media screen and (max-width: 1920px) {
    html { font-size: 100px;}
}
.left{
   width: 24.21875vw;  
   font-size: 0.18rem;
}
.right{
    width: 24.21875vw;
    font-size: 0.18rem;
}
.center{
    width: 46.04167vw;
    font-size: 0.32rem; 
}
```

### original

```javascript
import { writeFile, readFileSync } from 'fs';
import postcss from 'postcss';
import px2units from 'postcss-plugin-px2units';

const css = readFileSync('/path/to/test.css', 'utf8');
const options = {
  replace: false,
};
const processedCss = postcss(px2units(options)).process(css).css;

writeFile('/path/to/test.rem.css', processedCss, err => {
  if (err) throw err;
  console.log('Rem file written.');
});
```

### with gulp

```javascript
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var px2units = require('postcss-plugin-px2units');
gulp.task('css', function () {
  var processors = [
    px2units
  ];
  return gulp.src('./src/*.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('./dest'));
});
```

### with webpack

```javascript
import px2units from 'postcss-plugin-px2units';
const px2unitsOpts = {
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
  postcss: [px2units(px2unitsOpts)],
}
```

### with [atool-build](https://github.com/ant-tool/atool-build)

`webpack.connfig.js`

```javascript
import webpack from 'atool-build/lib/webpack';
import px2units from 'postcss-plugin-px2units';

export default webpackConfig => {
  const px2unitsOpts = {
    ......
  };
  webpackConfig.postcss.push(px2units(px2unitsOpts));

  return webpackConfig;
};
```

## Configuration

Default:
```js
{
    unitToConvert: {rem:"rx",vw:"wx",vh:"hx"},
    viewportWidth: 19.20, 
    viewportHeight: 10.80,
    rootValue:100,
    viewportwidthUnit:'vw',
    viewportheightUnit: 'vh', 
    viewportfontUnit: 'rem', 
    unitPrecision: 5,
    minPixelValue: 1,
    exclude:false,
    mediaQuery: false,
    replace:true
}
```


- `unitToConvert` (Object) unit lits to convert, by default, it is {rem:"rx",vw:"wx",vh:"hx"}
- `viewportWidth` (Number) The width of the viewport.Default is 19.20. -viewportWidth = the width of UI design /100
- `viewportHeight` (Number) The height of the viewport.Default is 10.80.-viewportHeight = the height of UI design/100
- `rootValue` (Number) The root element font size. Default is Default is 100. {html:100px}
   - pcweb:rootValue = the width of UI design*100/1920
   - mobileweb:rootValue = the width of UI design*100/750
- `viewportwidthUnit` (Number)  a way to exclude some folder,eg. /(node_module)/.
- `viewportheightUnit` (Number) Expected height units.
- `unitPrecision` (Boolean/String)  The decimal numbers to allow the REM or VW OR VH units to grow to.
- `minPixelValue` (Number) Set the minimum pixel value to replace.
- `exclude` (Boolean|Reg)  a way to exclude some folder,eg. /(node_module)/.
- `mediaQuery` (Boolean) Allow px to be converted in media queries.
- `replace` (Boolean) replaces rules containing rems instead of adding fallbacks.

### License
Thanks postcss-plugin-pxtorem and postcss-px-to-viewport
