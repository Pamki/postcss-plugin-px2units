/**
 * @param {object} unitToConvert unit lits to convert, by default, it is {rem:"rx",vw:"wx",vh:"hx"}
 * @param {Number} viewportWidth The width of the viewport.Default is 19.20. -viewportWidth = the width of UI design/100
 * @param {Number} viewportHeight The height of the viewport.Default is 10.80.-viewportHeight = the height of UI design/100
 * @param {Number} rootValue The root element font size. Default is 100. {html:100px}
 * -pcweb：rootValue = the width of UI design*100/1920
 * -mobileweb：rootValue = the width of UI design*100/750
 * @param {object} viewportwidthUnit Expected with units.
 * @param {object} viewportheightUnit Expected height units.
 * @param {object} viewportfontUnit Expected units for font.
 * @param {Number} unitPrecision  The decimal numbers to allow the REM or VW OR VH units to grow to.
 * @param {Number} minPixelValue Set the minimum pixel value to replace.
 * @param {Number} exclude (Reg)  a way to exclude some folder,eg. /(node_module)/.
 * @param {Number} mediaQuery Allow unit(rx\wx\hx) to be converted in media queries
 * @param {Number} replace replaces rules containing unit(rx\wx\hx) instead of adding fallbacks.
 * 
 */
var postcss = require('postcss');
var defaultOpts = {
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
};
/**
 * @param {Object} number 
 * @param {Number} precision //defaultOpts.unitPrecision
 */
const toFixed = (number, precision) => {
    const multiplier = Math.pow(10, precision + 1);
    const wholeNumber = Math.floor(number * multiplier);
    return Math.round(wholeNumber / 10) * 10 / multiplier;
  };
//Round To -Infinite

const isObject = o => typeof o === 'object' && o !== null;

/**
 * @param {String} unit(rx\wx\hx)
 */
const getUnitRegexp = unit => {
    const pattern = `"[^"]+"|\'[^\']+\'|url\\([^\\)]+\\)|(\\d*\\.?\\d+)(${unit})`;
    return new RegExp(pattern, 'ig');
}//正则匹配符合条件css

/**
 * @param {Object} decls //Special style
 * @param {String} prop //Style properties
 * @param {String} value //Style value
 */
const declarationExists = (decls, prop, value) => decls.some(decl =>
    decl.prop === prop && decl.value === value
);

/** unit(rx/vw/vh) to unit(rem/vw/vh)
 * @param {Object} opts //defaultOpts
 * @param {String} defunit //unit
 */
const createPxReplace = (opts,defunit) => (m, $1) => {
    if (!$1) return m;
    const pixels = parseFloat($1);
    if (pixels < opts.minPixelValue) return m;
    let baseValue;
    switch(defunit) {
        case opts.viewportfontUnit:
            baseValue = opts.rootValue
           break;
        case opts.viewportwidthUnit:
            baseValue = opts.viewportWidth
           break;
        case opts.viewportheightUnit:
            baseValue = opts.viewportHeight
            break;
        default:
            baseValue = opts.rootValue
   }
    const fixedVal = toFixed((pixels / baseValue), opts.unitPrecision);
    return `${fixedVal}${defunit}`;
  };
/**The recursive single subunit of a CSS file transformed by postcss Parser
 * root(css),rule, nodes, decl, prop, value
 * @param {object} root  //the entire CSS snippet, which contains multiple rules
 * @param {object} rule //the snippet within the scope of a CSS
 * @param {object} nodes //Refers to multiple decl parts in the middle of {} in the rule
 * @param {object} decl //Special style,
 * @param {String} prop //Style properties
 * @param {String} value //Style value
 */
module.exports = postcss.plugin('postcss-plugin-px2units', options => {
  const opts = { ...defaultOpts, ...options };
  return css => {
        for (let defunit in opts.unitToConvert) {
            let unit = opts.unitToConvert[defunit]
            const pxReplace = createPxReplace(opts,defunit);
            css.walkDecls((decl, i) => {
                const _decl = decl;
                // 1st check exclude
                if (opts.exclude && css.source.input.file && css.source.input.file.match(opts.exclude) !== null) return;
                
                // 2st check 'rx\wx\hx' unit
                if (_decl.value.indexOf(unit) === -1) return;
                const value = _decl.value.replace(getUnitRegexp(unit), pxReplace);

                // if rem unit already exists, do not add or replace
                if (declarationExists(_decl.parent, _decl.prop, value)) return;

                if (opts.replace) {
                    _decl.value = value;
                  } else {
                    _decl.parent.insertAfter(i, _decl.clone({
                      value,
                    }));
                  }
            
            });

            if (opts.mediaQuery) {
                css.walkAtRules('media', rule => {
                const _rule = rule;
                if (_rule.params.indexOf(unit) === -1) return;
                _rule.params = _rule.params.replace(getUnitRegexp(unit), pxReplace);
                });
            }
        }
  };
});