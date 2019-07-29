# postcss-plugin-px2units

[![NPM version](https://badge.fury.io/js/postcss-plugin-px2units.svg)](http://badge.fury.io/js/postcss-plugin-px2units)

A plugin for [PostCSS](https://github.com/postcss/postcss) that generates viewport units (vw/wh/rem) from pixel units.

<img align="right" width="135" height="95"
     title="Philosopher’s stone, logo of PostCSS"
     src="http://postcss.github.io/postcss/logo-leftp.svg">

## Features
Use the Flex layout, Grid layout, viewport units rem ,vw and wh to adapt to multi-screen problem
## Installation

```bash
$ npm i --save postcss-plugin-px2units
```

## Usage

### input and output
```
//option
{
      viewportWidth: 3840, //  3840
      viewportHeight: 2304, // 2304
    }
```
```css
// input
html { font-size: 100wx;}//1:100 rem
/* 100px*100/1920 => vw */
body{
    padding: 0;
    margin: 0;
    display: flex;
    height: 100vh;
    flex-direction: column;
    justify-content: space-around;
    background: yellow;
    text-align: center;
}
div{
    border: 1px solid black;  
}
.top{
    height: 217hx;
    font-size: 84rx;/*/设计稿字体大小*/
}
.bottom{
    display: grid;
    grid-template-columns: 930fr 1768fr 930fr; /* //设计稿宽度 */
    font-size: 84wx;/*/设计稿字体大小*/
}
.left div,.right div,.center div{
    margin: 40wx;
}
.bottom {
    margin:80wx;
    flex: 1;
}
.left{
    display: grid;
    grid-template-rows: repeat(3, 640fr);
}

.center{
    display: grid;
    grid-template-rows: 1fr auto;
}

.right{
    display: grid;
    grid-template-rows: repeat(2, 984fr);
}


// output
html { font-size: 2.60417vw;}
/* 100/1920 */
body{
    padding: 0;
    margin: 0;
    display: flex;
    height: 100vh;
    flex-direction: column;
    justify-content: space-around;
    background: yellow;
    text-align: center;
    
}
div{
    border: 1px solid black;  
}
.top{
    height: 9.4184vh;
    font-size: 0.84rem;
}
.bottom{
    display: grid;
    grid-template-columns: 930fr 1768fr 930fr; /* //设计稿宽度 */
    font-size: 2.1875vw;
}
.left div,.right div,.center div{
    margin: 1.04167vw;
}
.bottom {
    margin:2.08333vw;
    flex: 1;
}
.left{
    display: grid;
    grid-template-rows: repeat(3, 640fr);
}

.center{
    display: grid;
    grid-template-rows: 1fr auto;
}

.right{
    display: grid;
    grid-template-rows: repeat(2, 984fr);
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
    viewportWidth: 1920, 
    viewportHeight: 1080,
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
- `viewportWidth` (Number) The width of the viewport.Default is 19.20. -viewportWidth = the width of UI design
- `viewportHeight` (Number) The height of the viewport.Default is 10.80.-viewportHeight = the height of UI design
- `rootValue` (Number) The root element font size. Default is 100. {html:100wx=100px*100/1920vw}
- `viewportwidthUnit` (Number)  a way to exclude some folder,eg. /(node_module)/.
- `viewportheightUnit` (Number) Expected height units.
- `unitPrecision` (Boolean/String)  The decimal numbers to allow the REM or VW OR VH units to grow to.
- `minPixelValue` (Number) Set the minimum pixel value to replace.
- `exclude` (Boolean|Reg)  a way to exclude some folder,eg. /(node_module)/.
- `mediaQuery` (Boolean) Allow px to be converted in media queries.
- `replace` (Boolean) replaces rules containing rems instead of adding fallbacks.

### License
Thanks postcss-plugin-pxtorem and postcss-px-to-viewport
