require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var trim = require('./trim');
var decap = require('./decapitalize');

module.exports = function camelize(str, decapitalize) {
  str = trim(str).replace(/[-_\s]+(.)?/g, function(match, c) {
    return c ? c.toUpperCase() : '';
  });

  if (decapitalize === true) {
    return decap(str);
  } else {
    return str;
  }
};

},{"./decapitalize":10,"./trim":64}],2:[function(require,module,exports){
var makeString = require('./helper/makeString');

module.exports = function capitalize(str, lowercaseRest) {
  str = makeString(str);
  var remainingChars = !lowercaseRest ? str.slice(1) : str.slice(1).toLowerCase();

  return str.charAt(0).toUpperCase() + remainingChars;
};

},{"./helper/makeString":20}],3:[function(require,module,exports){
var makeString = require('./helper/makeString');

module.exports = function chars(str) {
  return makeString(str).split('');
};

},{"./helper/makeString":20}],4:[function(require,module,exports){
module.exports = function chop(str, step) {
  if (str == null) return [];
  str = String(str);
  step = ~~step;
  return step > 0 ? str.match(new RegExp('.{1,' + step + '}', 'g')) : [str];
};

},{}],5:[function(require,module,exports){
var capitalize = require('./capitalize');
var camelize = require('./camelize');
var makeString = require('./helper/makeString');

module.exports = function classify(str) {
  str = makeString(str);
  return capitalize(camelize(str.replace(/[\W_]/g, ' ')).replace(/\s/g, ''));
};

},{"./camelize":1,"./capitalize":2,"./helper/makeString":20}],6:[function(require,module,exports){
var trim = require('./trim');

module.exports = function clean(str) {
  return trim(str).replace(/\s\s+/g, ' ');
};

},{"./trim":64}],7:[function(require,module,exports){

var makeString = require('./helper/makeString');

var from  = 'ąàáäâãåæăćčĉęèéëêĝĥìíïîĵłľńňòóöőôõðøśșşšŝťțţŭùúüűûñÿýçżźž',
  to    = 'aaaaaaaaaccceeeeeghiiiijllnnoooooooossssstttuuuuuunyyczzz';

from += from.toUpperCase();
to += to.toUpperCase();

to = to.split('');

// for tokens requireing multitoken output
from += 'ß';
to.push('ss');


module.exports = function cleanDiacritics(str) {
  return makeString(str).replace(/.{1}/g, function(c){
    var index = from.indexOf(c);
    return index === -1 ? c : to[index];
  });
};

},{"./helper/makeString":20}],8:[function(require,module,exports){
var makeString = require('./helper/makeString');

module.exports = function(str, substr) {
  str = makeString(str);
  substr = makeString(substr);

  if (str.length === 0 || substr.length === 0) return 0;
  
  return str.split(substr).length - 1;
};

},{"./helper/makeString":20}],9:[function(require,module,exports){
var trim = require('./trim');

module.exports = function dasherize(str) {
  return trim(str).replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();
};

},{"./trim":64}],10:[function(require,module,exports){
var makeString = require('./helper/makeString');

module.exports = function decapitalize(str) {
  str = makeString(str);
  return str.charAt(0).toLowerCase() + str.slice(1);
};

},{"./helper/makeString":20}],11:[function(require,module,exports){
var makeString = require('./helper/makeString');

function getIndent(str) {
  var matches = str.match(/^[\s\\t]*/gm);
  var indent = matches[0].length;
  
  for (var i = 1; i < matches.length; i++) {
    indent = Math.min(matches[i].length, indent);
  }

  return indent;
}

module.exports = function dedent(str, pattern) {
  str = makeString(str);
  var indent = getIndent(str);
  var reg;

  if (indent === 0) return str;

  if (typeof pattern === 'string') {
    reg = new RegExp('^' + pattern, 'gm');
  } else {
    reg = new RegExp('^[ \\t]{' + indent + '}', 'gm');
  }

  return str.replace(reg, '');
};

},{"./helper/makeString":20}],12:[function(require,module,exports){
var makeString = require('./helper/makeString');
var toPositive = require('./helper/toPositive');

module.exports = function endsWith(str, ends, position) {
  str = makeString(str);
  ends = '' + ends;
  if (typeof position == 'undefined') {
    position = str.length - ends.length;
  } else {
    position = Math.min(toPositive(position), str.length) - ends.length;
  }
  return position >= 0 && str.indexOf(ends, position) === position;
};

},{"./helper/makeString":20,"./helper/toPositive":22}],13:[function(require,module,exports){
var makeString = require('./helper/makeString');
var escapeChars = require('./helper/escapeChars');

var regexString = '[';
for(var key in escapeChars) {
  regexString += key;
}
regexString += ']';

var regex = new RegExp( regexString, 'g');

module.exports = function escapeHTML(str) {

  return makeString(str).replace(regex, function(m) {
    return '&' + escapeChars[m] + ';';
  });
};

},{"./helper/escapeChars":17,"./helper/makeString":20}],14:[function(require,module,exports){
module.exports = function() {
  var result = {};

  for (var prop in this) {
    if (!this.hasOwnProperty(prop) || prop.match(/^(?:include|contains|reverse|join|map|wrap)$/)) continue;
    result[prop] = this[prop];
  }

  return result;
};

},{}],15:[function(require,module,exports){
var makeString = require('./makeString');

module.exports = function adjacent(str, direction) {
  str = makeString(str);
  if (str.length === 0) {
    return '';
  }
  return str.slice(0, -1) + String.fromCharCode(str.charCodeAt(str.length - 1) + direction);
};

},{"./makeString":20}],16:[function(require,module,exports){
var escapeRegExp = require('./escapeRegExp');

module.exports = function defaultToWhiteSpace(characters) {
  if (characters == null)
    return '\\s';
  else if (characters.source)
    return characters.source;
  else
    return '[' + escapeRegExp(characters) + ']';
};

},{"./escapeRegExp":18}],17:[function(require,module,exports){
/* We're explicitly defining the list of entities we want to escape.
nbsp is an HTML entity, but we don't want to escape all space characters in a string, hence its omission in this map.

*/
var escapeChars = {
  '¢' : 'cent',
  '£' : 'pound',
  '¥' : 'yen',
  '€': 'euro',
  '©' :'copy',
  '®' : 'reg',
  '<' : 'lt',
  '>' : 'gt',
  '"' : 'quot',
  '&' : 'amp',
  '\'' : '#39'
};

module.exports = escapeChars;

},{}],18:[function(require,module,exports){
var makeString = require('./makeString');

module.exports = function escapeRegExp(str) {
  return makeString(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
};

},{"./makeString":20}],19:[function(require,module,exports){
/*
We're explicitly defining the list of entities that might see in escape HTML strings
*/
var htmlEntities = {
  nbsp: ' ',
  cent: '¢',
  pound: '£',
  yen: '¥',
  euro: '€',
  copy: '©',
  reg: '®',
  lt: '<',
  gt: '>',
  quot: '"',
  amp: '&',
  apos: '\''
};

module.exports = htmlEntities;

},{}],20:[function(require,module,exports){
/**
 * Ensure some object is a coerced to a string
 **/
module.exports = function makeString(object) {
  if (object == null) return '';
  return '' + object;
};

},{}],21:[function(require,module,exports){
module.exports = function strRepeat(str, qty){
  if (qty < 1) return '';
  var result = '';
  while (qty > 0) {
    if (qty & 1) result += str;
    qty >>= 1, str += str;
  }
  return result;
};

},{}],22:[function(require,module,exports){
module.exports = function toPositive(number) {
  return number < 0 ? 0 : (+number || 0);
};

},{}],23:[function(require,module,exports){
var capitalize = require('./capitalize');
var underscored = require('./underscored');
var trim = require('./trim');

module.exports = function humanize(str) {
  return capitalize(trim(underscored(str).replace(/_id$/, '').replace(/_/g, ' ')));
};

},{"./capitalize":2,"./trim":64,"./underscored":66}],24:[function(require,module,exports){
var makeString = require('./helper/makeString');

module.exports = function include(str, needle) {
  if (needle === '') return true;
  return makeString(str).indexOf(needle) !== -1;
};

},{"./helper/makeString":20}],25:[function(require,module,exports){
var splice = require('./splice');

module.exports = function insert(str, i, substr) {
  return splice(str, i, 0, substr);
};

},{"./splice":48}],26:[function(require,module,exports){
var makeString = require('./helper/makeString');

module.exports = function isBlank(str) {
  return (/^\s*$/).test(makeString(str));
};

},{"./helper/makeString":20}],27:[function(require,module,exports){
var makeString = require('./helper/makeString');
var slice = [].slice;

module.exports = function join() {
  var args = slice.call(arguments),
    separator = args.shift();

  return args.join(makeString(separator));
};

},{"./helper/makeString":20}],28:[function(require,module,exports){
var makeString = require('./helper/makeString');

/**
 * Based on the implementation here: https://github.com/hiddentao/fast-levenshtein
 */
module.exports = function levenshtein(str1, str2) {
  'use strict';
  str1 = makeString(str1);
  str2 = makeString(str2);

  // Short cut cases  
  if (str1 === str2) return 0;
  if (!str1 || !str2) return Math.max(str1.length, str2.length);

  // two rows
  var prevRow = new Array(str2.length + 1);

  // initialise previous row
  for (var i = 0; i < prevRow.length; ++i) {
    prevRow[i] = i;
  }

  // calculate current row distance from previous row
  for (i = 0; i < str1.length; ++i) {
    var nextCol = i + 1;

    for (var j = 0; j < str2.length; ++j) {
      var curCol = nextCol;

      // substution
      nextCol = prevRow[j] + ( (str1.charAt(i) === str2.charAt(j)) ? 0 : 1 );
      // insertion
      var tmp = curCol + 1;
      if (nextCol > tmp) {
        nextCol = tmp;
      }
      // deletion
      tmp = prevRow[j + 1] + 1;
      if (nextCol > tmp) {
        nextCol = tmp;
      }

      // copy current col value into previous (in preparation for next iteration)
      prevRow[j] = curCol;
    }

    // copy last col value into previous (in preparation for next iteration)
    prevRow[j] = nextCol;
  }

  return nextCol;
};

},{"./helper/makeString":20}],29:[function(require,module,exports){
module.exports = function lines(str) {
  if (str == null) return [];
  return String(str).split(/\r\n?|\n/);
};

},{}],30:[function(require,module,exports){
var pad = require('./pad');

module.exports = function lpad(str, length, padStr) {
  return pad(str, length, padStr);
};

},{"./pad":38}],31:[function(require,module,exports){
var pad = require('./pad');

module.exports = function lrpad(str, length, padStr) {
  return pad(str, length, padStr, 'both');
};

},{"./pad":38}],32:[function(require,module,exports){
var makeString = require('./helper/makeString');
var defaultToWhiteSpace = require('./helper/defaultToWhiteSpace');
var nativeTrimLeft = String.prototype.trimLeft;

module.exports = function ltrim(str, characters) {
  str = makeString(str);
  if (!characters && nativeTrimLeft) return nativeTrimLeft.call(str);
  characters = defaultToWhiteSpace(characters);
  return str.replace(new RegExp('^' + characters + '+'), '');
};

},{"./helper/defaultToWhiteSpace":16,"./helper/makeString":20}],33:[function(require,module,exports){
var makeString = require('./helper/makeString');

module.exports = function(str, callback) {
  str = makeString(str);

  if (str.length === 0 || typeof callback !== 'function') return str;

  return str.replace(/./g, callback);
};

},{"./helper/makeString":20}],34:[function(require,module,exports){
module.exports = function naturalCmp(str1, str2) {
  if (str1 == str2) return 0;
  if (!str1) return -1;
  if (!str2) return 1;

  var cmpRegex = /(\.\d+|\d+|\D+)/g,
    tokens1 = String(str1).match(cmpRegex),
    tokens2 = String(str2).match(cmpRegex),
    count = Math.min(tokens1.length, tokens2.length);

  for (var i = 0; i < count; i++) {
    var a = tokens1[i],
      b = tokens2[i];

    if (a !== b) {
      var num1 = +a;
      var num2 = +b;
      if (num1 === num1 && num2 === num2) {
        return num1 > num2 ? 1 : -1;
      }
      return a < b ? -1 : 1;
    }
  }

  if (tokens1.length != tokens2.length)
    return tokens1.length - tokens2.length;

  return str1 < str2 ? -1 : 1;
};

},{}],35:[function(require,module,exports){
(function(window) {
    var re = {
        not_string: /[^s]/,
        number: /[diefg]/,
        json: /[j]/,
        not_json: /[^j]/,
        text: /^[^\x25]+/,
        modulo: /^\x25{2}/,
        placeholder: /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijosuxX])/,
        key: /^([a-z_][a-z_\d]*)/i,
        key_access: /^\.([a-z_][a-z_\d]*)/i,
        index_access: /^\[(\d+)\]/,
        sign: /^[\+\-]/
    }

    function sprintf() {
        var key = arguments[0], cache = sprintf.cache
        if (!(cache[key] && cache.hasOwnProperty(key))) {
            cache[key] = sprintf.parse(key)
        }
        return sprintf.format.call(null, cache[key], arguments)
    }

    sprintf.format = function(parse_tree, argv) {
        var cursor = 1, tree_length = parse_tree.length, node_type = "", arg, output = [], i, k, match, pad, pad_character, pad_length, is_positive = true, sign = ""
        for (i = 0; i < tree_length; i++) {
            node_type = get_type(parse_tree[i])
            if (node_type === "string") {
                output[output.length] = parse_tree[i]
            }
            else if (node_type === "array") {
                match = parse_tree[i] // convenience purposes only
                if (match[2]) { // keyword argument
                    arg = argv[cursor]
                    for (k = 0; k < match[2].length; k++) {
                        if (!arg.hasOwnProperty(match[2][k])) {
                            throw new Error(sprintf("[sprintf] property '%s' does not exist", match[2][k]))
                        }
                        arg = arg[match[2][k]]
                    }
                }
                else if (match[1]) { // positional argument (explicit)
                    arg = argv[match[1]]
                }
                else { // positional argument (implicit)
                    arg = argv[cursor++]
                }

                if (get_type(arg) == "function") {
                    arg = arg()
                }

                if (re.not_string.test(match[8]) && re.not_json.test(match[8]) && (get_type(arg) != "number" && isNaN(arg))) {
                    throw new TypeError(sprintf("[sprintf] expecting number but found %s", get_type(arg)))
                }

                if (re.number.test(match[8])) {
                    is_positive = arg >= 0
                }

                switch (match[8]) {
                    case "b":
                        arg = arg.toString(2)
                    break
                    case "c":
                        arg = String.fromCharCode(arg)
                    break
                    case "d":
                    case "i":
                        arg = parseInt(arg, 10)
                    break
                    case "j":
                        arg = JSON.stringify(arg, null, match[6] ? parseInt(match[6]) : 0)
                    break
                    case "e":
                        arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential()
                    break
                    case "f":
                        arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg)
                    break
                    case "g":
                        arg = match[7] ? parseFloat(arg).toPrecision(match[7]) : parseFloat(arg)
                    break
                    case "o":
                        arg = arg.toString(8)
                    break
                    case "s":
                        arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg)
                    break
                    case "u":
                        arg = arg >>> 0
                    break
                    case "x":
                        arg = arg.toString(16)
                    break
                    case "X":
                        arg = arg.toString(16).toUpperCase()
                    break
                }
                if (re.json.test(match[8])) {
                    output[output.length] = arg
                }
                else {
                    if (re.number.test(match[8]) && (!is_positive || match[3])) {
                        sign = is_positive ? "+" : "-"
                        arg = arg.toString().replace(re.sign, "")
                    }
                    else {
                        sign = ""
                    }
                    pad_character = match[4] ? match[4] === "0" ? "0" : match[4].charAt(1) : " "
                    pad_length = match[6] - (sign + arg).length
                    pad = match[6] ? (pad_length > 0 ? str_repeat(pad_character, pad_length) : "") : ""
                    output[output.length] = match[5] ? sign + arg + pad : (pad_character === "0" ? sign + pad + arg : pad + sign + arg)
                }
            }
        }
        return output.join("")
    }

    sprintf.cache = {}

    sprintf.parse = function(fmt) {
        var _fmt = fmt, match = [], parse_tree = [], arg_names = 0
        while (_fmt) {
            if ((match = re.text.exec(_fmt)) !== null) {
                parse_tree[parse_tree.length] = match[0]
            }
            else if ((match = re.modulo.exec(_fmt)) !== null) {
                parse_tree[parse_tree.length] = "%"
            }
            else if ((match = re.placeholder.exec(_fmt)) !== null) {
                if (match[2]) {
                    arg_names |= 1
                    var field_list = [], replacement_field = match[2], field_match = []
                    if ((field_match = re.key.exec(replacement_field)) !== null) {
                        field_list[field_list.length] = field_match[1]
                        while ((replacement_field = replacement_field.substring(field_match[0].length)) !== "") {
                            if ((field_match = re.key_access.exec(replacement_field)) !== null) {
                                field_list[field_list.length] = field_match[1]
                            }
                            else if ((field_match = re.index_access.exec(replacement_field)) !== null) {
                                field_list[field_list.length] = field_match[1]
                            }
                            else {
                                throw new SyntaxError("[sprintf] failed to parse named argument key")
                            }
                        }
                    }
                    else {
                        throw new SyntaxError("[sprintf] failed to parse named argument key")
                    }
                    match[2] = field_list
                }
                else {
                    arg_names |= 2
                }
                if (arg_names === 3) {
                    throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported")
                }
                parse_tree[parse_tree.length] = match
            }
            else {
                throw new SyntaxError("[sprintf] unexpected placeholder")
            }
            _fmt = _fmt.substring(match[0].length)
        }
        return parse_tree
    }

    var vsprintf = function(fmt, argv, _argv) {
        _argv = (argv || []).slice(0)
        _argv.splice(0, 0, fmt)
        return sprintf.apply(null, _argv)
    }

    /**
     * helpers
     */
    function get_type(variable) {
        return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase()
    }

    function str_repeat(input, multiplier) {
        return Array(multiplier + 1).join(input)
    }

    /**
     * export to either browser or node.js
     */
    if (typeof exports !== "undefined") {
        exports.sprintf = sprintf
        exports.vsprintf = vsprintf
    }
    else {
        window.sprintf = sprintf
        window.vsprintf = vsprintf

        if (typeof define === "function" && define.amd) {
            define(function() {
                return {
                    sprintf: sprintf,
                    vsprintf: vsprintf
                }
            })
        }
    }
})(typeof window === "undefined" ? this : window);

},{}],36:[function(require,module,exports){
(function (global){

/**
 * Module exports.
 */

module.exports = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate (fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config (name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!global.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],37:[function(require,module,exports){
module.exports = function numberFormat(number, dec, dsep, tsep) {
  if (isNaN(number) || number == null) return '';

  number = number.toFixed(~~dec);
  tsep = typeof tsep == 'string' ? tsep : ',';

  var parts = number.split('.'),
    fnums = parts[0],
    decimals = parts[1] ? (dsep || '.') + parts[1] : '';

  return fnums.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + tsep) + decimals;
};

},{}],38:[function(require,module,exports){
var makeString = require('./helper/makeString');
var strRepeat = require('./helper/strRepeat');

module.exports = function pad(str, length, padStr, type) {
  str = makeString(str);
  length = ~~length;

  var padlen = 0;

  if (!padStr)
    padStr = ' ';
  else if (padStr.length > 1)
    padStr = padStr.charAt(0);

  switch (type) {
  case 'right':
    padlen = length - str.length;
    return str + strRepeat(padStr, padlen);
  case 'both':
    padlen = length - str.length;
    return strRepeat(padStr, Math.ceil(padlen / 2)) + str + strRepeat(padStr, Math.floor(padlen / 2));
  default: // 'left'
    padlen = length - str.length;
    return strRepeat(padStr, padlen) + str;
  }
};

},{"./helper/makeString":20,"./helper/strRepeat":21}],39:[function(require,module,exports){
var adjacent = require('./helper/adjacent');

module.exports = function succ(str) {
  return adjacent(str, -1);
};

},{"./helper/adjacent":15}],40:[function(require,module,exports){
/**
 * _s.prune: a more elegant version of truncate
 * prune extra chars, never leaving a half-chopped word.
 * @author github.com/rwz
 */
var makeString = require('./helper/makeString');
var rtrim = require('./rtrim');

module.exports = function prune(str, length, pruneStr) {
  str = makeString(str);
  length = ~~length;
  pruneStr = pruneStr != null ? String(pruneStr) : '...';

  if (str.length <= length) return str;

  var tmpl = function(c) {
      return c.toUpperCase() !== c.toLowerCase() ? 'A' : ' ';
    },
    template = str.slice(0, length + 1).replace(/.(?=\W*\w*$)/g, tmpl); // 'Hello, world' -> 'HellAA AAAAA'

  if (template.slice(template.length - 2).match(/\w\w/))
    template = template.replace(/\s*\S+$/, '');
  else
    template = rtrim(template.slice(0, template.length - 1));

  return (template + pruneStr).length > str.length ? str : str.slice(0, template.length) + pruneStr;
};

},{"./helper/makeString":20,"./rtrim":46}],41:[function(require,module,exports){
var surround = require('./surround');

module.exports = function quote(str, quoteChar) {
  return surround(str, quoteChar || '"');
};

},{"./surround":57}],42:[function(require,module,exports){
var makeString = require('./helper/makeString');
var strRepeat = require('./helper/strRepeat');

module.exports = function repeat(str, qty, separator) {
  str = makeString(str);

  qty = ~~qty;

  // using faster implementation if separator is not needed;
  if (separator == null) return strRepeat(str, qty);

  // this one is about 300x slower in Google Chrome
  /*eslint no-empty: 0*/
  for (var repeat = []; qty > 0; repeat[--qty] = str) {}
  return repeat.join(separator);
};

},{"./helper/makeString":20,"./helper/strRepeat":21}],43:[function(require,module,exports){
var makeString = require('./helper/makeString');

module.exports = function replaceAll(str, find, replace, ignorecase) {
  var flags = (ignorecase === true)?'gi':'g';
  var reg = new RegExp(find, flags);

  return makeString(str).replace(reg, replace);
};

},{"./helper/makeString":20}],44:[function(require,module,exports){
var chars = require('./chars');

module.exports = function reverse(str) {
  return chars(str).reverse().join('');
};

},{"./chars":3}],45:[function(require,module,exports){
var pad = require('./pad');

module.exports = function rpad(str, length, padStr) {
  return pad(str, length, padStr, 'right');
};

},{"./pad":38}],46:[function(require,module,exports){
var makeString = require('./helper/makeString');
var defaultToWhiteSpace = require('./helper/defaultToWhiteSpace');
var nativeTrimRight = String.prototype.trimRight;

module.exports = function rtrim(str, characters) {
  str = makeString(str);
  if (!characters && nativeTrimRight) return nativeTrimRight.call(str);
  characters = defaultToWhiteSpace(characters);
  return str.replace(new RegExp(characters + '+$'), '');
};

},{"./helper/defaultToWhiteSpace":16,"./helper/makeString":20}],47:[function(require,module,exports){
var trim = require('./trim');
var dasherize = require('./dasherize');
var cleanDiacritics = require('./cleanDiacritics');

module.exports = function slugify(str) {
  return trim(dasherize(cleanDiacritics(str).replace(/[^\w\s-]/g, '-').toLowerCase()), '-');
};

},{"./cleanDiacritics":7,"./dasherize":9,"./trim":64}],48:[function(require,module,exports){
var chars = require('./chars');

module.exports = function splice(str, i, howmany, substr) {
  var arr = chars(str);
  arr.splice(~~i, ~~howmany, substr);
  return arr.join('');
};

},{"./chars":3}],49:[function(require,module,exports){
var deprecate = require('util-deprecate');

module.exports = deprecate(require('sprintf-js').sprintf,
  'sprintf() will be removed in the next major release, use the sprintf-js package instead.');

},{"sprintf-js":35,"util-deprecate":36}],50:[function(require,module,exports){
var makeString = require('./helper/makeString');
var toPositive = require('./helper/toPositive');

module.exports = function startsWith(str, starts, position) {
  str = makeString(str);
  starts = '' + starts;
  position = position == null ? 0 : Math.min(toPositive(position), str.length);
  return str.lastIndexOf(starts, position) === position;
};

},{"./helper/makeString":20,"./helper/toPositive":22}],51:[function(require,module,exports){
var makeString = require('./helper/makeString');

module.exports = function strLeft(str, sep) {
  str = makeString(str);
  sep = makeString(sep);
  var pos = !sep ? -1 : str.indexOf(sep);
  return~ pos ? str.slice(0, pos) : str;
};

},{"./helper/makeString":20}],52:[function(require,module,exports){
var makeString = require('./helper/makeString');

module.exports = function strLeftBack(str, sep) {
  str = makeString(str);
  sep = makeString(sep);
  var pos = str.lastIndexOf(sep);
  return~ pos ? str.slice(0, pos) : str;
};

},{"./helper/makeString":20}],53:[function(require,module,exports){
var makeString = require('./helper/makeString');

module.exports = function strRight(str, sep) {
  str = makeString(str);
  sep = makeString(sep);
  var pos = !sep ? -1 : str.indexOf(sep);
  return~ pos ? str.slice(pos + sep.length, str.length) : str;
};

},{"./helper/makeString":20}],54:[function(require,module,exports){
var makeString = require('./helper/makeString');

module.exports = function strRightBack(str, sep) {
  str = makeString(str);
  sep = makeString(sep);
  var pos = !sep ? -1 : str.lastIndexOf(sep);
  return~ pos ? str.slice(pos + sep.length, str.length) : str;
};

},{"./helper/makeString":20}],55:[function(require,module,exports){
var makeString = require('./helper/makeString');

module.exports = function stripTags(str) {
  return makeString(str).replace(/<\/?[^>]+>/g, '');
};

},{"./helper/makeString":20}],56:[function(require,module,exports){
var adjacent = require('./helper/adjacent');

module.exports = function succ(str) {
  return adjacent(str, 1);
};

},{"./helper/adjacent":15}],57:[function(require,module,exports){
module.exports = function surround(str, wrapper) {
  return [wrapper, str, wrapper].join('');
};

},{}],58:[function(require,module,exports){
var makeString = require('./helper/makeString');

module.exports = function swapCase(str) {
  return makeString(str).replace(/\S/g, function(c) {
    return c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase();
  });
};

},{"./helper/makeString":20}],59:[function(require,module,exports){
var makeString = require('./helper/makeString');

module.exports = function titleize(str) {
  return makeString(str).toLowerCase().replace(/(?:^|\s|-)\S/g, function(c) {
    return c.toUpperCase();
  });
};

},{"./helper/makeString":20}],60:[function(require,module,exports){
var trim = require('./trim');

function boolMatch(s, matchers) {
  var i, matcher, down = s.toLowerCase();
  matchers = [].concat(matchers);
  for (i = 0; i < matchers.length; i += 1) {
    matcher = matchers[i];
    if (!matcher) continue;
    if (matcher.test && matcher.test(s)) return true;
    if (matcher.toLowerCase() === down) return true;
  }
}

module.exports = function toBoolean(str, trueValues, falseValues) {
  if (typeof str === 'number') str = '' + str;
  if (typeof str !== 'string') return !!str;
  str = trim(str);
  if (boolMatch(str, trueValues || ['true', '1'])) return true;
  if (boolMatch(str, falseValues || ['false', '0'])) return false;
};

},{"./trim":64}],61:[function(require,module,exports){
module.exports = function toNumber(num, precision) {
  if (num == null) return 0;
  var factor = Math.pow(10, isFinite(precision) ? precision : 0);
  return Math.round(num * factor) / factor;
};

},{}],62:[function(require,module,exports){
var rtrim = require('./rtrim');

module.exports = function toSentence(array, separator, lastSeparator, serial) {
  separator = separator || ', ';
  lastSeparator = lastSeparator || ' and ';
  var a = array.slice(),
    lastMember = a.pop();

  if (array.length > 2 && serial) lastSeparator = rtrim(separator) + lastSeparator;

  return a.length ? a.join(separator) + lastSeparator + lastMember : lastMember;
};

},{"./rtrim":46}],63:[function(require,module,exports){
var toSentence = require('./toSentence');

module.exports = function toSentenceSerial(array, sep, lastSep) {
  return toSentence(array, sep, lastSep, true);
};

},{"./toSentence":62}],64:[function(require,module,exports){
var makeString = require('./helper/makeString');
var defaultToWhiteSpace = require('./helper/defaultToWhiteSpace');
var nativeTrim = String.prototype.trim;

module.exports = function trim(str, characters) {
  str = makeString(str);
  if (!characters && nativeTrim) return nativeTrim.call(str);
  characters = defaultToWhiteSpace(characters);
  return str.replace(new RegExp('^' + characters + '+|' + characters + '+$', 'g'), '');
};

},{"./helper/defaultToWhiteSpace":16,"./helper/makeString":20}],65:[function(require,module,exports){
var makeString = require('./helper/makeString');

module.exports = function truncate(str, length, truncateStr) {
  str = makeString(str);
  truncateStr = truncateStr || '...';
  length = ~~length;
  return str.length > length ? str.slice(0, length) + truncateStr : str;
};

},{"./helper/makeString":20}],66:[function(require,module,exports){
var trim = require('./trim');

module.exports = function underscored(str) {
  return trim(str).replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
};

},{"./trim":64}],67:[function(require,module,exports){
var makeString = require('./helper/makeString');
var htmlEntities = require('./helper/htmlEntities');

module.exports = function unescapeHTML(str) {
  return makeString(str).replace(/\&([^;]+);/g, function(entity, entityCode) {
    var match;

    if (entityCode in htmlEntities) {
      return htmlEntities[entityCode];
    /*eslint no-cond-assign: 0*/
    } else if (match = entityCode.match(/^#x([\da-fA-F]+)$/)) {
      return String.fromCharCode(parseInt(match[1], 16));
    /*eslint no-cond-assign: 0*/
    } else if (match = entityCode.match(/^#(\d+)$/)) {
      return String.fromCharCode(~~match[1]);
    } else {
      return entity;
    }
  });
};

},{"./helper/htmlEntities":19,"./helper/makeString":20}],68:[function(require,module,exports){
module.exports = function unquote(str, quoteChar) {
  quoteChar = quoteChar || '"';
  if (str[0] === quoteChar && str[str.length - 1] === quoteChar)
    return str.slice(1, str.length - 1);
  else return str;
};

},{}],69:[function(require,module,exports){
var deprecate = require('util-deprecate');

module.exports = deprecate(require('sprintf-js').vsprintf,
  'vsprintf() will be removed in the next major release, use the sprintf-js package instead.');

},{"sprintf-js":35,"util-deprecate":36}],70:[function(require,module,exports){
var isBlank = require('./isBlank');
var trim = require('./trim');

module.exports = function words(str, delimiter) {
  if (isBlank(str)) return [];
  return trim(str, delimiter).split(delimiter || /\s+/);
};

},{"./isBlank":26,"./trim":64}],71:[function(require,module,exports){
// Wrap
// wraps a string by a certain width

var makeString = require('./helper/makeString');

module.exports = function wrap(str, options){
  str = makeString(str);
  
  options = options || {};
  
  var width = options.width || 75;
  var seperator = options.seperator || '\n';
  var cut = options.cut || false;
  var preserveSpaces = options.preserveSpaces || false;
  var trailingSpaces = options.trailingSpaces || false;
  
  var result;
  
  if(width <= 0){
    return str;
  }
  
  else if(!cut){
  
    var words = str.split(' ');
    var current_column = 0;
    result = '';
  
    while(words.length > 0){
      
      // if adding a space and the next word would cause this line to be longer than width...
      if(1 + words[0].length + current_column > width){
        //start a new line if this line is not already empty
        if(current_column > 0){
          // add a space at the end of the line is preserveSpaces is true
          if (preserveSpaces){
            result += ' ';
            current_column++;
          }
          // fill the rest of the line with spaces if trailingSpaces option is true
          else if(trailingSpaces){
            while(current_column < width){
              result += ' ';
              current_column++;
            }            
          }
          //start new line
          result += seperator;
          current_column = 0;
        }
      }
  
      // if not at the begining of the line, add a space in front of the word
      if(current_column > 0){
        result += ' ';
        current_column++;
      }
  
      // tack on the next word, update current column, a pop words array
      result += words[0];
      current_column += words[0].length;
      words.shift();
  
    }
  
    // fill the rest of the line with spaces if trailingSpaces option is true
    if(trailingSpaces){
      while(current_column < width){
        result += ' ';
        current_column++;
      }            
    }
  
    return result;
  
  }
  
  else {
  
    var index = 0;
    result = '';
  
    // walk through each character and add seperators where appropriate
    while(index < str.length){
      if(index % width == 0 && index > 0){
        result += seperator;
      }
      result += str.charAt(index);
      index++;
    }
  
    // fill the rest of the line with spaces if trailingSpaces option is true
    if(trailingSpaces){
      while(index % width > 0){
        result += ' ';
        index++;
      }            
    }
    
    return result;
  }
};

},{"./helper/makeString":20}],"Modernizr":[function(require,module,exports){
require("modernizr-dist");

Modernizr._config.classPrefix = "mod-";
Modernizr._config.enableClasses = false;
Modernizr._config.enableJSClasses = false;
Modernizr.addTest("weakmap", function() {
	return window.WeakMap !== void 0;
});
/* eslint-disable no-undef */
Modernizr.addTest("strictmode", function() {
	try { undeclaredVar = 1; } catch (e) { return true; }
	return false;
});
/* eslint-enable no-undef */

module.exports = window.Modernizr;

},{"modernizr-dist":"modernizr-dist"}],"cookies-js":[function(require,module,exports){
/*
 * Cookies.js - 1.2.3
 * https://github.com/ScottHamper/Cookies
 *
 * This is free and unencumbered software released into the public domain.
 */
(function (global, undefined) {
    'use strict';

    var factory = function (window) {
        if (typeof window.document !== 'object') {
            throw new Error('Cookies.js requires a `window` with a `document` object');
        }

        var Cookies = function (key, value, options) {
            return arguments.length === 1 ?
                Cookies.get(key) : Cookies.set(key, value, options);
        };

        // Allows for setter injection in unit tests
        Cookies._document = window.document;

        // Used to ensure cookie keys do not collide with
        // built-in `Object` properties
        Cookies._cacheKeyPrefix = 'cookey.'; // Hurr hurr, :)
        
        Cookies._maxExpireDate = new Date('Fri, 31 Dec 9999 23:59:59 UTC');

        Cookies.defaults = {
            path: '/',
            secure: false
        };

        Cookies.get = function (key) {
            if (Cookies._cachedDocumentCookie !== Cookies._document.cookie) {
                Cookies._renewCache();
            }
            
            var value = Cookies._cache[Cookies._cacheKeyPrefix + key];

            return value === undefined ? undefined : decodeURIComponent(value);
        };

        Cookies.set = function (key, value, options) {
            options = Cookies._getExtendedOptions(options);
            options.expires = Cookies._getExpiresDate(value === undefined ? -1 : options.expires);

            Cookies._document.cookie = Cookies._generateCookieString(key, value, options);

            return Cookies;
        };

        Cookies.expire = function (key, options) {
            return Cookies.set(key, undefined, options);
        };

        Cookies._getExtendedOptions = function (options) {
            return {
                path: options && options.path || Cookies.defaults.path,
                domain: options && options.domain || Cookies.defaults.domain,
                expires: options && options.expires || Cookies.defaults.expires,
                secure: options && options.secure !== undefined ?  options.secure : Cookies.defaults.secure
            };
        };

        Cookies._isValidDate = function (date) {
            return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
        };

        Cookies._getExpiresDate = function (expires, now) {
            now = now || new Date();

            if (typeof expires === 'number') {
                expires = expires === Infinity ?
                    Cookies._maxExpireDate : new Date(now.getTime() + expires * 1000);
            } else if (typeof expires === 'string') {
                expires = new Date(expires);
            }

            if (expires && !Cookies._isValidDate(expires)) {
                throw new Error('`expires` parameter cannot be converted to a valid Date instance');
            }

            return expires;
        };

        Cookies._generateCookieString = function (key, value, options) {
            key = key.replace(/[^#$&+\^`|]/g, encodeURIComponent);
            key = key.replace(/\(/g, '%28').replace(/\)/g, '%29');
            value = (value + '').replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent);
            options = options || {};

            var cookieString = key + '=' + value;
            cookieString += options.path ? ';path=' + options.path : '';
            cookieString += options.domain ? ';domain=' + options.domain : '';
            cookieString += options.expires ? ';expires=' + options.expires.toUTCString() : '';
            cookieString += options.secure ? ';secure' : '';

            return cookieString;
        };

        Cookies._getCacheFromString = function (documentCookie) {
            var cookieCache = {};
            var cookiesArray = documentCookie ? documentCookie.split('; ') : [];

            for (var i = 0; i < cookiesArray.length; i++) {
                var cookieKvp = Cookies._getKeyValuePairFromCookieString(cookiesArray[i]);

                if (cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] === undefined) {
                    cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] = cookieKvp.value;
                }
            }

            return cookieCache;
        };

        Cookies._getKeyValuePairFromCookieString = function (cookieString) {
            // "=" is a valid character in a cookie value according to RFC6265, so cannot `split('=')`
            var separatorIndex = cookieString.indexOf('=');

            // IE omits the "=" when the cookie value is an empty string
            separatorIndex = separatorIndex < 0 ? cookieString.length : separatorIndex;

            var key = cookieString.substr(0, separatorIndex);
            var decodedKey;
            try {
                decodedKey = decodeURIComponent(key);
            } catch (e) {
                if (console && typeof console.error === 'function') {
                    console.error('Could not decode cookie with key "' + key + '"', e);
                }
            }
            
            return {
                key: decodedKey,
                value: cookieString.substr(separatorIndex + 1) // Defer decoding value until accessed
            };
        };

        Cookies._renewCache = function () {
            Cookies._cache = Cookies._getCacheFromString(Cookies._document.cookie);
            Cookies._cachedDocumentCookie = Cookies._document.cookie;
        };

        Cookies._areEnabled = function () {
            var testKey = 'cookies.js';
            var areEnabled = Cookies.set(testKey, 1).get(testKey) === '1';
            Cookies.expire(testKey);
            return areEnabled;
        };

        Cookies.enabled = Cookies._areEnabled();

        return Cookies;
    };
    var cookiesExport = (global && typeof global.document === 'object') ? factory(global) : factory;

    // AMD support
    if (typeof define === 'function' && define.amd) {
        define(function () { return cookiesExport; });
    // CommonJS/Node.js support
    } else if (typeof exports === 'object') {
        // Support Node.js specific `module.exports` (which can be a function)
        if (typeof module === 'object' && typeof module.exports === 'object') {
            exports = module.exports = cookiesExport;
        }
        // But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
        exports.Cookies = cookiesExport;
    } else {
        global.Cookies = cookiesExport;
    }
})(typeof window === 'undefined' ? this : window);
},{}],"modernizr-dist":[function(require,module,exports){
/*!
 * modernizr v3.6.0
 * Build https://modernizr.com/download?-backgroundblendmode-backgroundcliptext-backgroundsize-bgpositionshorthand-bgpositionxy-bgrepeatspace_bgrepeatround-bgsizecover-bloburls-borderradius-boxshadow-boxsizing-canvas-canvasblending-canvastext-canvaswinding-classlist-contains-cssanimations-csscalc-csschunit-cssexunit-cssgradients-csspointerevents-csspositionsticky-csspseudoanimations-csspseudotransitions-cssremunit-cssresize-csstransforms-csstransforms3d-csstransitions-cssvhunit-cssvmaxunit-cssvminunit-cssvwunit-cubicbezierrange-datauri-devicemotion_deviceorientation-documentfragment-ellipsis-es6array-es6math-es6number-es6object-es6string-flexbox-flexwrap-fontface-fullscreen-generatedcontent-generators-hashchange-hiddenscroll-history-hsla-inlinesvg-json-lastchild-mediaqueries-multiplebgs-mutationobserver-nthchild-objectfit-opacity-pagevisibility-performance-pointerevents-postmessage-preserve3d-promises-queryselector-requestanimationframe-rgba-scriptasync-scriptdefer-siblinggeneral-sizes-smil-srcset-subpixelfont-supports-svg-svgasimg-svgclippaths-svgfilters-svgforeignobject-target-templatestrings-todataurljpeg_todataurlpng_todataurlwebp-userselect-video-videoautoplay-videoloop-videopreload-willchange-xhr2-xhrresponsetype-xhrresponsetypearraybuffer-xhrresponsetypeblob-hasevent-mq-prefixed-prefixedcss-dontmin-cssclassprefix:has-
 *
 * Copyright (c)
 *  Faruk Ates
 *  Paul Irish
 *  Alex Sexton
 *  Ryan Seddon
 *  Patrick Kettner
 *  Stu Cox
 *  Richard Herrera

 * MIT License
 */

/*
 * Modernizr tests which native CSS3 and HTML5 features are available in the
 * current UA and makes the results available to you in two ways: as properties on
 * a global `Modernizr` object, and as classes on the `<html>` element. This
 * information allows you to progressively enhance your pages with a granular level
 * of control over the experience.
*/

;(function(window, document, undefined){
  var tests = [];
  

  /**
   *
   * ModernizrProto is the constructor for Modernizr
   *
   * @class
   * @access public
   */

  var ModernizrProto = {
    // The current version, dummy
    _version: '3.6.0',

    // Any settings that don't work as separate modules
    // can go in here as configuration.
    _config: {
      'classPrefix': "has-",
      'enableClasses': true,
      'enableJSClass': true,
      'usePrefixes': true
    },

    // Queue of tests
    _q: [],

    // Stub these for people who are listening
    on: function(test, cb) {
      // I don't really think people should do this, but we can
      // safe guard it a bit.
      // -- NOTE:: this gets WAY overridden in src/addTest for actual async tests.
      // This is in case people listen to synchronous tests. I would leave it out,
      // but the code to *disallow* sync tests in the real version of this
      // function is actually larger than this.
      var self = this;
      setTimeout(function() {
        cb(self[test]);
      }, 0);
    },

    addTest: function(name, fn, options) {
      tests.push({name: name, fn: fn, options: options});
    },

    addAsyncTest: function(fn) {
      tests.push({name: null, fn: fn});
    }
  };

  

  // Fake some of Object.create so we can force non test results to be non "own" properties.
  var Modernizr = function() {};
  Modernizr.prototype = ModernizrProto;

  // Leak modernizr globally when you `require` it rather than force it here.
  // Overwrite name so constructor name is nicer :D
  Modernizr = new Modernizr();

  

  var classes = [];
  

  /**
   * is returns a boolean if the typeof an obj is exactly type.
   *
   * @access private
   * @function is
   * @param {*} obj - A thing we want to check the type of
   * @param {string} type - A string to compare the typeof against
   * @returns {boolean}
   */

  function is(obj, type) {
    return typeof obj === type;
  }
  ;

  /**
   * Run through all tests and detect their support in the current UA.
   *
   * @access private
   */

  function testRunner() {
    var featureNames;
    var feature;
    var aliasIdx;
    var result;
    var nameIdx;
    var featureName;
    var featureNameSplit;

    for (var featureIdx in tests) {
      if (tests.hasOwnProperty(featureIdx)) {
        featureNames = [];
        feature = tests[featureIdx];
        // run the test, throw the return value into the Modernizr,
        // then based on that boolean, define an appropriate className
        // and push it into an array of classes we'll join later.
        //
        // If there is no name, it's an 'async' test that is run,
        // but not directly added to the object. That should
        // be done with a post-run addTest call.
        if (feature.name) {
          featureNames.push(feature.name.toLowerCase());

          if (feature.options && feature.options.aliases && feature.options.aliases.length) {
            // Add all the aliases into the names list
            for (aliasIdx = 0; aliasIdx < feature.options.aliases.length; aliasIdx++) {
              featureNames.push(feature.options.aliases[aliasIdx].toLowerCase());
            }
          }
        }

        // Run the test, or use the raw value if it's not a function
        result = is(feature.fn, 'function') ? feature.fn() : feature.fn;


        // Set each of the names on the Modernizr object
        for (nameIdx = 0; nameIdx < featureNames.length; nameIdx++) {
          featureName = featureNames[nameIdx];
          // Support dot properties as sub tests. We don't do checking to make sure
          // that the implied parent tests have been added. You must call them in
          // order (either in the test, or make the parent test a dependency).
          //
          // Cap it to TWO to make the logic simple and because who needs that kind of subtesting
          // hashtag famous last words
          featureNameSplit = featureName.split('.');

          if (featureNameSplit.length === 1) {
            Modernizr[featureNameSplit[0]] = result;
          } else {
            // cast to a Boolean, if not one already
            if (Modernizr[featureNameSplit[0]] && !(Modernizr[featureNameSplit[0]] instanceof Boolean)) {
              Modernizr[featureNameSplit[0]] = new Boolean(Modernizr[featureNameSplit[0]]);
            }

            Modernizr[featureNameSplit[0]][featureNameSplit[1]] = result;
          }

          classes.push((result ? '' : 'no-') + featureNameSplit.join('-'));
        }
      }
    }
  }
  ;

  /**
   * docElement is a convenience wrapper to grab the root element of the document
   *
   * @access private
   * @returns {HTMLElement|SVGElement} The root element of the document
   */

  var docElement = document.documentElement;
  

  /**
   * A convenience helper to check if the document we are running in is an SVG document
   *
   * @access private
   * @returns {boolean}
   */

  var isSVG = docElement.nodeName.toLowerCase() === 'svg';
  

  /**
   * createElement is a convenience wrapper around document.createElement. Since we
   * use createElement all over the place, this allows for (slightly) smaller code
   * as well as abstracting away issues with creating elements in contexts other than
   * HTML documents (e.g. SVG documents).
   *
   * @access private
   * @function createElement
   * @returns {HTMLElement|SVGElement} An HTML or SVG element
   */

  function createElement() {
    if (typeof document.createElement !== 'function') {
      // This is the case in IE7, where the type of createElement is "object".
      // For this reason, we cannot call apply() as Object is not a Function.
      return document.createElement(arguments[0]);
    } else if (isSVG) {
      return document.createElementNS.call(document, 'http://www.w3.org/2000/svg', arguments[0]);
    } else {
      return document.createElement.apply(document, arguments);
    }
  }

  ;

  /**
   * Modernizr.hasEvent() detects support for a given event
   *
   * @memberof Modernizr
   * @name Modernizr.hasEvent
   * @optionName Modernizr.hasEvent()
   * @optionProp hasEvent
   * @access public
   * @function hasEvent
   * @param  {string|*} eventName - the name of an event to test for (e.g. "resize")
   * @param  {Element|string} [element=HTMLDivElement] - is the element|document|window|tagName to test on
   * @returns {boolean}
   * @example
   *  `Modernizr.hasEvent` lets you determine if the browser supports a supplied event.
   *  By default, it does this detection on a div element
   *
   * ```js
   *  hasEvent('blur') // true;
   * ```
   *
   * However, you are able to give an object as a second argument to hasEvent to
   * detect an event on something other than a div.
   *
   * ```js
   *  hasEvent('devicelight', window) // true;
   * ```
   *
   */

  var hasEvent = (function() {

    // Detect whether event support can be detected via `in`. Test on a DOM element
    // using the "blur" event b/c it should always exist. bit.ly/event-detection
    var needsFallback = !('onblur' in document.documentElement);

    function inner(eventName, element) {

      var isSupported;
      if (!eventName) { return false; }
      if (!element || typeof element === 'string') {
        element = createElement(element || 'div');
      }

      // Testing via the `in` operator is sufficient for modern browsers and IE.
      // When using `setAttribute`, IE skips "unload", WebKit skips "unload" and
      // "resize", whereas `in` "catches" those.
      eventName = 'on' + eventName;
      isSupported = eventName in element;

      // Fallback technique for old Firefox - bit.ly/event-detection
      if (!isSupported && needsFallback) {
        if (!element.setAttribute) {
          // Switch to generic element if it lacks `setAttribute`.
          // It could be the `document`, `window`, or something else.
          element = createElement('div');
        }

        element.setAttribute(eventName, '');
        isSupported = typeof element[eventName] === 'function';

        if (element[eventName] !== undefined) {
          // If property was created, "remove it" by setting value to `undefined`.
          element[eventName] = undefined;
        }
        element.removeAttribute(eventName);
      }

      return isSupported;
    }
    return inner;
  })();


  ModernizrProto.hasEvent = hasEvent;
  

  /**
   * getBody returns the body of a document, or an element that can stand in for
   * the body if a real body does not exist
   *
   * @access private
   * @function getBody
   * @returns {HTMLElement|SVGElement} Returns the real body of a document, or an
   * artificially created element that stands in for the body
   */

  function getBody() {
    // After page load injecting a fake body doesn't work so check if body exists
    var body = document.body;

    if (!body) {
      // Can't use the real body create a fake one.
      body = createElement(isSVG ? 'svg' : 'body');
      body.fake = true;
    }

    return body;
  }

  ;

  /**
   * injectElementWithStyles injects an element with style element and some CSS rules
   *
   * @access private
   * @function injectElementWithStyles
   * @param {string} rule - String representing a css rule
   * @param {function} callback - A function that is used to test the injected element
   * @param {number} [nodes] - An integer representing the number of additional nodes you want injected
   * @param {string[]} [testnames] - An array of strings that are used as ids for the additional nodes
   * @returns {boolean}
   */

  function injectElementWithStyles(rule, callback, nodes, testnames) {
    var mod = 'modernizr';
    var style;
    var ret;
    var node;
    var docOverflow;
    var div = createElement('div');
    var body = getBody();

    if (parseInt(nodes, 10)) {
      // In order not to give false positives we create a node for each test
      // This also allows the method to scale for unspecified uses
      while (nodes--) {
        node = createElement('div');
        node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
        div.appendChild(node);
      }
    }

    style = createElement('style');
    style.type = 'text/css';
    style.id = 's' + mod;

    // IE6 will false positive on some tests due to the style element inside the test div somehow interfering offsetHeight, so insert it into body or fakebody.
    // Opera will act all quirky when injecting elements in documentElement when page is served as xml, needs fakebody too. #270
    (!body.fake ? div : body).appendChild(style);
    body.appendChild(div);

    if (style.styleSheet) {
      style.styleSheet.cssText = rule;
    } else {
      style.appendChild(document.createTextNode(rule));
    }
    div.id = mod;

    if (body.fake) {
      //avoid crashing IE8, if background image is used
      body.style.background = '';
      //Safari 5.13/5.1.4 OSX stops loading if ::-webkit-scrollbar is used and scrollbars are visible
      body.style.overflow = 'hidden';
      docOverflow = docElement.style.overflow;
      docElement.style.overflow = 'hidden';
      docElement.appendChild(body);
    }

    ret = callback(div, rule);
    // If this is done after page load we don't want to remove the body so check if body exists
    if (body.fake) {
      body.parentNode.removeChild(body);
      docElement.style.overflow = docOverflow;
      // Trigger layout so kinetic scrolling isn't disabled in iOS6+
      // eslint-disable-next-line
      docElement.offsetHeight;
    } else {
      div.parentNode.removeChild(div);
    }

    return !!ret;

  }

  ;

  /**
   * Modernizr.mq tests a given media query, live against the current state of the window
   * adapted from matchMedia polyfill by Scott Jehl and Paul Irish
   * gist.github.com/786768
   *
   * @memberof Modernizr
   * @name Modernizr.mq
   * @optionName Modernizr.mq()
   * @optionProp mq
   * @access public
   * @function mq
   * @param {string} mq - String of the media query we want to test
   * @returns {boolean}
   * @example
   * Modernizr.mq allows for you to programmatically check if the current browser
   * window state matches a media query.
   *
   * ```js
   *  var query = Modernizr.mq('(min-width: 900px)');
   *
   *  if (query) {
   *    // the browser window is larger than 900px
   *  }
   * ```
   *
   * Only valid media queries are supported, therefore you must always include values
   * with your media query
   *
   * ```js
   * // good
   *  Modernizr.mq('(min-width: 900px)');
   *
   * // bad
   *  Modernizr.mq('min-width');
   * ```
   *
   * If you would just like to test that media queries are supported in general, use
   *
   * ```js
   *  Modernizr.mq('only all'); // true if MQ are supported, false if not
   * ```
   *
   *
   * Note that if the browser does not support media queries (e.g. old IE) mq will
   * always return false.
   */

  var mq = (function() {
    var matchMedia = window.matchMedia || window.msMatchMedia;
    if (matchMedia) {
      return function(mq) {
        var mql = matchMedia(mq);
        return mql && mql.matches || false;
      };
    }

    return function(mq) {
      var bool = false;

      injectElementWithStyles('@media ' + mq + ' { #modernizr { position: absolute; } }', function(node) {
        bool = (window.getComputedStyle ?
                window.getComputedStyle(node, null) :
                node.currentStyle).position == 'absolute';
      });

      return bool;
    };
  })();


  ModernizrProto.mq = mq;

  

  /**
   * If the browsers follow the spec, then they would expose vendor-specific styles as:
   *   elem.style.WebkitBorderRadius
   * instead of something like the following (which is technically incorrect):
   *   elem.style.webkitBorderRadius

   * WebKit ghosts their properties in lowercase but Opera & Moz do not.
   * Microsoft uses a lowercase `ms` instead of the correct `Ms` in IE8+
   *   erik.eae.net/archives/2008/03/10/21.48.10/

   * More here: github.com/Modernizr/Modernizr/issues/issue/21
   *
   * @access private
   * @returns {string} The string representing the vendor-specific style properties
   */

  var omPrefixes = 'Moz O ms Webkit';
  

  var cssomPrefixes = (ModernizrProto._config.usePrefixes ? omPrefixes.split(' ') : []);
  ModernizrProto._cssomPrefixes = cssomPrefixes;
  


  /**
   * contains checks to see if a string contains another string
   *
   * @access private
   * @function contains
   * @param {string} str - The string we want to check for substrings
   * @param {string} substr - The substring we want to search the first string for
   * @returns {boolean}
   */

  function contains(str, substr) {
    return !!~('' + str).indexOf(substr);
  }

  ;

  /**
   * Create our "modernizr" element that we do most feature tests on.
   *
   * @access private
   */

  var modElem = {
    elem: createElement('modernizr')
  };

  // Clean up this element
  Modernizr._q.push(function() {
    delete modElem.elem;
  });

  

  var mStyle = {
    style: modElem.elem.style
  };

  // kill ref for gc, must happen before mod.elem is removed, so we unshift on to
  // the front of the queue.
  Modernizr._q.unshift(function() {
    delete mStyle.style;
  });

  

  /**
   * domToCSS takes a camelCase string and converts it to kebab-case
   * e.g. boxSizing -> box-sizing
   *
   * @access private
   * @function domToCSS
   * @param {string} name - String name of camelCase prop we want to convert
   * @returns {string} The kebab-case version of the supplied name
   */

  function domToCSS(name) {
    return name.replace(/([A-Z])/g, function(str, m1) {
      return '-' + m1.toLowerCase();
    }).replace(/^ms-/, '-ms-');
  }
  ;


  /**
   * wrapper around getComputedStyle, to fix issues with Firefox returning null when
   * called inside of a hidden iframe
   *
   * @access private
   * @function computedStyle
   * @param {HTMLElement|SVGElement} - The element we want to find the computed styles of
   * @param {string|null} [pseudoSelector]- An optional pseudo element selector (e.g. :before), of null if none
   * @returns {CSSStyleDeclaration}
   */

  function computedStyle(elem, pseudo, prop) {
    var result;

    if ('getComputedStyle' in window) {
      result = getComputedStyle.call(window, elem, pseudo);
      var console = window.console;

      if (result !== null) {
        if (prop) {
          result = result.getPropertyValue(prop);
        }
      } else {
        if (console) {
          var method = console.error ? 'error' : 'log';
          console[method].call(console, 'getComputedStyle returning null, its possible modernizr test results are inaccurate');
        }
      }
    } else {
      result = !pseudo && elem.currentStyle && elem.currentStyle[prop];
    }

    return result;
  }

  ;

  /**
   * nativeTestProps allows for us to use native feature detection functionality if available.
   * some prefixed form, or false, in the case of an unsupported rule
   *
   * @access private
   * @function nativeTestProps
   * @param {array} props - An array of property names
   * @param {string} value - A string representing the value we want to check via @supports
   * @returns {boolean|undefined} A boolean when @supports exists, undefined otherwise
   */

  // Accepts a list of property names and a single value
  // Returns `undefined` if native detection not available
  function nativeTestProps(props, value) {
    var i = props.length;
    // Start with the JS API: http://www.w3.org/TR/css3-conditional/#the-css-interface
    if ('CSS' in window && 'supports' in window.CSS) {
      // Try every prefixed variant of the property
      while (i--) {
        if (window.CSS.supports(domToCSS(props[i]), value)) {
          return true;
        }
      }
      return false;
    }
    // Otherwise fall back to at-rule (for Opera 12.x)
    else if ('CSSSupportsRule' in window) {
      // Build a condition string for every prefixed variant
      var conditionText = [];
      while (i--) {
        conditionText.push('(' + domToCSS(props[i]) + ':' + value + ')');
      }
      conditionText = conditionText.join(' or ');
      return injectElementWithStyles('@supports (' + conditionText + ') { #modernizr { position: absolute; } }', function(node) {
        return computedStyle(node, null, 'position') == 'absolute';
      });
    }
    return undefined;
  }
  ;

  /**
   * cssToDOM takes a kebab-case string and converts it to camelCase
   * e.g. box-sizing -> boxSizing
   *
   * @access private
   * @function cssToDOM
   * @param {string} name - String name of kebab-case prop we want to convert
   * @returns {string} The camelCase version of the supplied name
   */

  function cssToDOM(name) {
    return name.replace(/([a-z])-([a-z])/g, function(str, m1, m2) {
      return m1 + m2.toUpperCase();
    }).replace(/^-/, '');
  }
  ;

  // testProps is a generic CSS / DOM property test.

  // In testing support for a given CSS property, it's legit to test:
  //    `elem.style[styleName] !== undefined`
  // If the property is supported it will return an empty string,
  // if unsupported it will return undefined.

  // We'll take advantage of this quick test and skip setting a style
  // on our modernizr element, but instead just testing undefined vs
  // empty string.

  // Property names can be provided in either camelCase or kebab-case.

  function testProps(props, prefixed, value, skipValueTest) {
    skipValueTest = is(skipValueTest, 'undefined') ? false : skipValueTest;

    // Try native detect first
    if (!is(value, 'undefined')) {
      var result = nativeTestProps(props, value);
      if (!is(result, 'undefined')) {
        return result;
      }
    }

    // Otherwise do it properly
    var afterInit, i, propsLength, prop, before;

    // If we don't have a style element, that means we're running async or after
    // the core tests, so we'll need to create our own elements to use

    // inside of an SVG element, in certain browsers, the `style` element is only
    // defined for valid tags. Therefore, if `modernizr` does not have one, we
    // fall back to a less used element and hope for the best.
    // for strict XHTML browsers the hardly used samp element is used
    var elems = ['modernizr', 'tspan', 'samp'];
    while (!mStyle.style && elems.length) {
      afterInit = true;
      mStyle.modElem = createElement(elems.shift());
      mStyle.style = mStyle.modElem.style;
    }

    // Delete the objects if we created them.
    function cleanElems() {
      if (afterInit) {
        delete mStyle.style;
        delete mStyle.modElem;
      }
    }

    propsLength = props.length;
    for (i = 0; i < propsLength; i++) {
      prop = props[i];
      before = mStyle.style[prop];

      if (contains(prop, '-')) {
        prop = cssToDOM(prop);
      }

      if (mStyle.style[prop] !== undefined) {

        // If value to test has been passed in, do a set-and-check test.
        // 0 (integer) is a valid property value, so check that `value` isn't
        // undefined, rather than just checking it's truthy.
        if (!skipValueTest && !is(value, 'undefined')) {

          // Needs a try catch block because of old IE. This is slow, but will
          // be avoided in most cases because `skipValueTest` will be used.
          try {
            mStyle.style[prop] = value;
          } catch (e) {}

          // If the property value has changed, we assume the value used is
          // supported. If `value` is empty string, it'll fail here (because
          // it hasn't changed), which matches how browsers have implemented
          // CSS.supports()
          if (mStyle.style[prop] != before) {
            cleanElems();
            return prefixed == 'pfx' ? prop : true;
          }
        }
        // Otherwise just return true, or the property name if this is a
        // `prefixed()` call
        else {
          cleanElems();
          return prefixed == 'pfx' ? prop : true;
        }
      }
    }
    cleanElems();
    return false;
  }

  ;

  /**
   * List of JavaScript DOM values used for tests
   *
   * @memberof Modernizr
   * @name Modernizr._domPrefixes
   * @optionName Modernizr._domPrefixes
   * @optionProp domPrefixes
   * @access public
   * @example
   *
   * Modernizr._domPrefixes is exactly the same as [_prefixes](#modernizr-_prefixes), but rather
   * than kebab-case properties, all properties are their Capitalized variant
   *
   * ```js
   * Modernizr._domPrefixes === [ "Moz", "O", "ms", "Webkit" ];
   * ```
   */

  var domPrefixes = (ModernizrProto._config.usePrefixes ? omPrefixes.toLowerCase().split(' ') : []);
  ModernizrProto._domPrefixes = domPrefixes;
  

  /**
   * fnBind is a super small [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) polyfill.
   *
   * @access private
   * @function fnBind
   * @param {function} fn - a function you want to change `this` reference to
   * @param {object} that - the `this` you want to call the function with
   * @returns {function} The wrapped version of the supplied function
   */

  function fnBind(fn, that) {
    return function() {
      return fn.apply(that, arguments);
    };
  }

  ;

  /**
   * testDOMProps is a generic DOM property test; if a browser supports
   *   a certain property, it won't return undefined for it.
   *
   * @access private
   * @function testDOMProps
   * @param {array.<string>} props - An array of properties to test for
   * @param {object} obj - An object or Element you want to use to test the parameters again
   * @param {boolean|object} elem - An Element to bind the property lookup again. Use `false` to prevent the check
   * @returns {false|*} returns false if the prop is unsupported, otherwise the value that is supported
   */
  function testDOMProps(props, obj, elem) {
    var item;

    for (var i in props) {
      if (props[i] in obj) {

        // return the property name as a string
        if (elem === false) {
          return props[i];
        }

        item = obj[props[i]];

        // let's bind a function
        if (is(item, 'function')) {
          // bind to obj unless overriden
          return fnBind(item, elem || obj);
        }

        // return the unbound function or obj or value
        return item;
      }
    }
    return false;
  }

  ;

  /**
   * testPropsAll tests a list of DOM properties we want to check against.
   * We specify literally ALL possible (known and/or likely) properties on
   * the element including the non-vendor prefixed one, for forward-
   * compatibility.
   *
   * @access private
   * @function testPropsAll
   * @param {string} prop - A string of the property to test for
   * @param {string|object} [prefixed] - An object to check the prefixed properties on. Use a string to skip
   * @param {HTMLElement|SVGElement} [elem] - An element used to test the property and value against
   * @param {string} [value] - A string of a css value
   * @param {boolean} [skipValueTest] - An boolean representing if you want to test if value sticks when set
   * @returns {false|string} returns the string version of the property, or false if it is unsupported
   */
  function testPropsAll(prop, prefixed, elem, value, skipValueTest) {

    var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1),
      props = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

    // did they call .prefixed('boxSizing') or are we just testing a prop?
    if (is(prefixed, 'string') || is(prefixed, 'undefined')) {
      return testProps(props, prefixed, value, skipValueTest);

      // otherwise, they called .prefixed('requestAnimationFrame', window[, elem])
    } else {
      props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
      return testDOMProps(props, prefixed, elem);
    }
  }

  // Modernizr.testAllProps() investigates whether a given style property,
  // or any of its vendor-prefixed variants, is recognized
  //
  // Note that the property names must be provided in the camelCase variant.
  // Modernizr.testAllProps('boxSizing')
  ModernizrProto.testAllProps = testPropsAll;

  

  /**
   * atRule returns a given CSS property at-rule (eg @keyframes), possibly in
   * some prefixed form, or false, in the case of an unsupported rule
   *
   * @memberof Modernizr
   * @name Modernizr.atRule
   * @optionName Modernizr.atRule()
   * @optionProp atRule
   * @access public
   * @function atRule
   * @param {string} prop - String name of the @-rule to test for
   * @returns {string|boolean} The string representing the (possibly prefixed)
   * valid version of the @-rule, or `false` when it is unsupported.
   * @example
   * ```js
   *  var keyframes = Modernizr.atRule('@keyframes');
   *
   *  if (keyframes) {
   *    // keyframes are supported
   *    // could be `@-webkit-keyframes` or `@keyframes`
   *  } else {
   *    // keyframes === `false`
   *  }
   * ```
   *
   */

  var atRule = function(prop) {
    var length = prefixes.length;
    var cssrule = window.CSSRule;
    var rule;

    if (typeof cssrule === 'undefined') {
      return undefined;
    }

    if (!prop) {
      return false;
    }

    // remove literal @ from beginning of provided property
    prop = prop.replace(/^@/, '');

    // CSSRules use underscores instead of dashes
    rule = prop.replace(/-/g, '_').toUpperCase() + '_RULE';

    if (rule in cssrule) {
      return '@' + prop;
    }

    for (var i = 0; i < length; i++) {
      // prefixes gives us something like -o-, and we want O_
      var prefix = prefixes[i];
      var thisRule = prefix.toUpperCase() + '_' + rule;

      if (thisRule in cssrule) {
        return '@-' + prefix.toLowerCase() + '-' + prop;
      }
    }

    return false;
  };

  ModernizrProto.atRule = atRule;

  

  /**
   * prefixed returns the prefixed or nonprefixed property name variant of your input
   *
   * @memberof Modernizr
   * @name Modernizr.prefixed
   * @optionName Modernizr.prefixed()
   * @optionProp prefixed
   * @access public
   * @function prefixed
   * @param {string} prop - String name of the property to test for
   * @param {object} [obj] - An object to test for the prefixed properties on
   * @param {HTMLElement} [elem] - An element used to test specific properties against
   * @returns {string|false} The string representing the (possibly prefixed) valid
   * version of the property, or `false` when it is unsupported.
   * @example
   *
   * Modernizr.prefixed takes a string css value in the DOM style camelCase (as
   * opposed to the css style kebab-case) form and returns the (possibly prefixed)
   * version of that property that the browser actually supports.
   *
   * For example, in older Firefox...
   * ```js
   * prefixed('boxSizing')
   * ```
   * returns 'MozBoxSizing'
   *
   * In newer Firefox, as well as any other browser that support the unprefixed
   * version would simply return `boxSizing`. Any browser that does not support
   * the property at all, it will return `false`.
   *
   * By default, prefixed is checked against a DOM element. If you want to check
   * for a property on another object, just pass it as a second argument
   *
   * ```js
   * var rAF = prefixed('requestAnimationFrame', window);
   *
   * raf(function() {
   *  renderFunction();
   * })
   * ```
   *
   * Note that this will return _the actual function_ - not the name of the function.
   * If you need the actual name of the property, pass in `false` as a third argument
   *
   * ```js
   * var rAFProp = prefixed('requestAnimationFrame', window, false);
   *
   * rafProp === 'WebkitRequestAnimationFrame' // in older webkit
   * ```
   *
   * One common use case for prefixed is if you're trying to determine which transition
   * end event to bind to, you might do something like...
   * ```js
   * var transEndEventNames = {
   *     'WebkitTransition' : 'webkitTransitionEnd', * Saf 6, Android Browser
   *     'MozTransition'    : 'transitionend',       * only for FF < 15
   *     'transition'       : 'transitionend'        * IE10, Opera, Chrome, FF 15+, Saf 7+
   * };
   *
   * var transEndEventName = transEndEventNames[ Modernizr.prefixed('transition') ];
   * ```
   *
   * If you want a similar lookup, but in kebab-case, you can use [prefixedCSS](#modernizr-prefixedcss).
   */

  var prefixed = ModernizrProto.prefixed = function(prop, obj, elem) {
    if (prop.indexOf('@') === 0) {
      return atRule(prop);
    }

    if (prop.indexOf('-') != -1) {
      // Convert kebab-case to camelCase
      prop = cssToDOM(prop);
    }
    if (!obj) {
      return testPropsAll(prop, 'pfx');
    } else {
      // Testing DOM property e.g. Modernizr.prefixed('requestAnimationFrame', window) // 'mozRequestAnimationFrame'
      return testPropsAll(prop, obj, elem);
    }
  };

  

  /**
   * prefixedCSS is just like [prefixed](#modernizr-prefixed), but the returned values are in
   * kebab-case (e.g. `box-sizing`) rather than camelCase (boxSizing).
   *
   * @memberof Modernizr
   * @name Modernizr.prefixedCSS
   * @optionName Modernizr.prefixedCSS()
   * @optionProp prefixedCSS
   * @access public
   * @function prefixedCSS
   * @param {string} prop - String name of the property to test for
   * @returns {string|false} The string representing the (possibly prefixed)
   * valid version of the property, or `false` when it is unsupported.
   * @example
   *
   * `Modernizr.prefixedCSS` is like `Modernizr.prefixed`, but returns the result
   * in hyphenated form
   *
   * ```js
   * Modernizr.prefixedCSS('transition') // '-moz-transition' in old Firefox
   * ```
   *
   * Since it is only useful for CSS style properties, it can only be tested against
   * an HTMLElement.
   *
   * Properties can be passed as both the DOM style camelCase or CSS style kebab-case.
   */

  var prefixedCSS = ModernizrProto.prefixedCSS = function(prop) {
    var prefixedProp = prefixed(prop);
    return prefixedProp && domToCSS(prefixedProp);
  };
  
/*!
{
  "name": "Canvas",
  "property": "canvas",
  "caniuse": "canvas",
  "tags": ["canvas", "graphics"],
  "polyfills": ["flashcanvas", "excanvas", "slcanvas", "fxcanvas"]
}
!*/
/* DOC
Detects support for the `<canvas>` element for 2D drawing.
*/

  // On the S60 and BB Storm, getContext exists, but always returns undefined
  // so we actually have to call getContext() to verify
  // github.com/Modernizr/Modernizr/issues/issue/97/
  Modernizr.addTest('canvas', function() {
    var elem = createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
  });

/*!
{
  "name": "canvas blending support",
  "property": "canvasblending",
  "tags": ["canvas"],
  "async" : false,
  "notes": [{
      "name": "HTML5 Spec",
      "href": "https://dvcs.w3.org/hg/FXTF/rawfile/tip/compositing/index.html#blending"
    },
    {
      "name": "Article",
      "href": "https://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas"
    }]
}
!*/
/* DOC
Detects if Photoshop style blending modes are available in canvas.
*/


  Modernizr.addTest('canvasblending', function() {
    if (Modernizr.canvas === false) {
      return false;
    }
    var ctx = createElement('canvas').getContext('2d');
    // firefox 3 throws an error when setting an invalid `globalCompositeOperation`
    try {
      ctx.globalCompositeOperation = 'screen';
    } catch (e) {}

    return ctx.globalCompositeOperation === 'screen';
  });


/*!
{
  "name": "canvas.toDataURL type support",
  "property": ["todataurljpeg", "todataurlpng", "todataurlwebp"],
  "tags": ["canvas"],
  "builderAliases": ["canvas_todataurl_type"],
  "async" : false,
  "notes": [{
    "name": "MDN article",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement.toDataURL"
  }]
}
!*/


  var canvas = createElement('canvas');

  Modernizr.addTest('todataurljpeg', function() {
    return !!Modernizr.canvas && canvas.toDataURL('image/jpeg').indexOf('data:image/jpeg') === 0;
  });
  Modernizr.addTest('todataurlpng', function() {
    return !!Modernizr.canvas && canvas.toDataURL('image/png').indexOf('data:image/png') === 0;
  });
  Modernizr.addTest('todataurlwebp', function() {
    var supports = false;

    // firefox 3 throws an error when you use an "invalid" toDataUrl
    try {
      supports = !!Modernizr.canvas && canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    } catch (e) {}

    return supports;
  });


/*!
{
  "name": "canvas winding support",
  "property": ["canvaswinding"],
  "tags": ["canvas"],
  "async" : false,
  "notes": [{
    "name": "Article",
    "href": "https://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/"
  }]
}
!*/
/* DOC
Determines if winding rules, which controls if a path can go clockwise or counterclockwise
*/


  Modernizr.addTest('canvaswinding', function() {
    if (Modernizr.canvas === false) {
      return false;
    }
    var ctx = createElement('canvas').getContext('2d');

    ctx.rect(0, 0, 10, 10);
    ctx.rect(2, 2, 6, 6);
    return ctx.isPointInPath(5, 5, 'evenodd') === false;
  });


/*!
{
  "name": "Canvas text",
  "property": "canvastext",
  "caniuse": "canvas-text",
  "tags": ["canvas", "graphics"],
  "polyfills": ["canvastext"]
}
!*/
/* DOC
Detects support for the text APIs for `<canvas>` elements.
*/

  Modernizr.addTest('canvastext',  function() {
    if (Modernizr.canvas  === false) {
      return false;
    }
    return typeof createElement('canvas').getContext('2d').fillText == 'function';
  });


  /**
   * testAllProps determines whether a given CSS property is supported in the browser
   *
   * @memberof Modernizr
   * @name Modernizr.testAllProps
   * @optionName Modernizr.testAllProps()
   * @optionProp testAllProps
   * @access public
   * @function testAllProps
   * @param {string} prop - String naming the property to test (either camelCase or kebab-case)
   * @param {string} [value] - String of the value to test
   * @param {boolean} [skipValueTest=false] - Whether to skip testing that the value is supported when using non-native detection
   * @example
   *
   * testAllProps determines whether a given CSS property, in some prefixed form,
   * is supported by the browser.
   *
   * ```js
   * testAllProps('boxSizing')  // true
   * ```
   *
   * It can optionally be given a CSS value in string form to test if a property
   * value is valid
   *
   * ```js
   * testAllProps('display', 'block') // true
   * testAllProps('display', 'penguin') // false
   * ```
   *
   * A boolean can be passed as a third parameter to skip the value check when
   * native detection (@supports) isn't available.
   *
   * ```js
   * testAllProps('shapeOutside', 'content-box', true);
   * ```
   */

  function testAllProps(prop, value, skipValueTest) {
    return testPropsAll(prop, undefined, undefined, value, skipValueTest);
  }
  ModernizrProto.testAllProps = testAllProps;
  
/*!
{
  "name": "CSS Animations",
  "property": "cssanimations",
  "caniuse": "css-animation",
  "polyfills": ["transformie", "csssandpaper"],
  "tags": ["css"],
  "warnings": ["Android < 4 will pass this test, but can only animate a single property at a time"],
  "notes": [{
    "name" : "Article: 'Dispelling the Android CSS animation myths'",
    "href": "https://goo.gl/OGw5Gm"
  }]
}
!*/
/* DOC
Detects whether or not elements can be animated using CSS
*/

  Modernizr.addTest('cssanimations', testAllProps('animationName', 'a', true));

/*!
{
  "name": "CSS Background Blend Mode",
  "property": "backgroundblendmode",
  "caniuse": "css-backgroundblendmode",
  "tags": ["css"],
  "notes": [
    {
      "name": "CSS Blend Modes could be the next big thing in Web Design",
      "href": " https://medium.com/@bennettfeely/css-blend-modes-could-be-the-next-big-thing-in-web-design-6b51bf53743a"
    }, {
      "name": "Demo",
      "href": "http://bennettfeely.com/gradients/"
    }
  ]
}
!*/
/* DOC
Detects the ability for the browser to composite backgrounds using blending modes similar to ones found in Photoshop or Illustrator.
*/

  Modernizr.addTest('backgroundblendmode', prefixed('backgroundBlendMode', 'text'));

/*!
{
  "name": "CSS Background Clip Text",
  "property": "backgroundcliptext",
  "authors": ["ausi"],
  "tags": ["css"],
  "notes": [
    {
      "name": "CSS Tricks Article",
      "href": "https://css-tricks.com/image-under-text/"
    },
    {
      "name": "MDN Docs",
      "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip"
    },
    {
      "name": "Related Github Issue",
      "href": "https://github.com/Modernizr/Modernizr/issues/199"
    }
  ]
}
!*/
/* DOC
Detects the ability to control specifies whether or not an element's background
extends beyond its border in CSS
*/

  Modernizr.addTest('backgroundcliptext', function() {
    return testAllProps('backgroundClip', 'text');
  });

/*!
{
  "name": "Background Position Shorthand",
  "property": "bgpositionshorthand",
  "tags": ["css"],
  "builderAliases": ["css_backgroundposition_shorthand"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en/CSS/background-position"
  }, {
    "name": "W3 Spec",
    "href": "https://www.w3.org/TR/css3-background/#background-position"
  }, {
    "name": "Demo",
    "href": "https://jsfiddle.net/Blink/bBXvt/"
  }]
}
!*/
/* DOC
Detects if you can use the shorthand method to define multiple parts of an
element's background-position simultaniously.

eg `background-position: right 10px bottom 10px`
*/

  Modernizr.addTest('bgpositionshorthand', function() {
    var elem = createElement('a');
    var eStyle = elem.style;
    var val = 'right 10px bottom 10px';
    eStyle.cssText = 'background-position: ' + val + ';';
    return (eStyle.backgroundPosition === val);
  });

/*!
{
  "name": "Background Position XY",
  "property": "bgpositionxy",
  "tags": ["css"],
  "builderAliases": ["css_backgroundposition_xy"],
  "authors": ["Allan Lei", "Brandom Aaron"],
  "notes": [{
    "name": "Demo",
    "href": "https://jsfiddle.net/allanlei/R8AYS/"
  }, {
    "name": "Adapted From",
    "href": "https://github.com/brandonaaron/jquery-cssHooks/blob/master/bgpos.js"
  }]
}
!*/
/* DOC
Detects the ability to control an element's background position using css
*/

  Modernizr.addTest('bgpositionxy', function() {
    return testAllProps('backgroundPositionX', '3px', true) && testAllProps('backgroundPositionY', '5px', true);
  });

/*!
{
  "name": "Background Repeat",
  "property": ["bgrepeatspace", "bgrepeatround"],
  "tags": ["css"],
  "builderAliases": ["css_backgroundrepeat"],
  "authors": ["Ryan Seddon"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/background-repeat"
  }, {
    "name": "Test Page",
    "href": "https://jsbin.com/uzesun/"
  }, {
    "name": "Demo",
    "href": "https://jsfiddle.net/ryanseddon/yMLTQ/6/"
  }]
}
!*/
/* DOC
Detects the ability to use round and space as properties for background-repeat
*/

  // Must value-test these
  Modernizr.addTest('bgrepeatround', testAllProps('backgroundRepeat', 'round'));
  Modernizr.addTest('bgrepeatspace', testAllProps('backgroundRepeat', 'space'));

/*!
{
  "name": "Background Size",
  "property": "backgroundsize",
  "tags": ["css"],
  "knownBugs": ["This will false positive in Opera Mini - https://github.com/Modernizr/Modernizr/issues/396"],
  "notes": [{
    "name": "Related Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/396"
  }]
}
!*/

  Modernizr.addTest('backgroundsize', testAllProps('backgroundSize', '100%', true));

/*!
{
  "name": "Background Size Cover",
  "property": "bgsizecover",
  "tags": ["css"],
  "builderAliases": ["css_backgroundsizecover"],
  "notes": [{
    "name" : "MDN Docs",
    "href": "https://developer.mozilla.org/en/CSS/background-size"
  }]
}
!*/

  // Must test value, as this specifically tests the `cover` value
  Modernizr.addTest('bgsizecover', testAllProps('backgroundSize', 'cover'));

/*!
{
  "name": "Border Radius",
  "property": "borderradius",
  "caniuse": "border-radius",
  "polyfills": ["css3pie"],
  "tags": ["css"],
  "notes": [{
    "name": "Comprehensive Compat Chart",
    "href": "https://muddledramblings.com/table-of-css3-border-radius-compliance"
  }]
}
!*/

  Modernizr.addTest('borderradius', testAllProps('borderRadius', '0px', true));

/*!
{
  "name": "Box Shadow",
  "property": "boxshadow",
  "caniuse": "css-boxshadow",
  "tags": ["css"],
  "knownBugs": [
    "WebOS false positives on this test.",
    "The Kindle Silk browser false positives"
  ]
}
!*/

  Modernizr.addTest('boxshadow', testAllProps('boxShadow', '1px 1px', true));

/*!
{
  "name": "Box Sizing",
  "property": "boxsizing",
  "caniuse": "css3-boxsizing",
  "polyfills": ["borderboxmodel", "boxsizingpolyfill", "borderbox"],
  "tags": ["css"],
  "builderAliases": ["css_boxsizing"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing"
  },{
    "name": "Related Github Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/248"
  }]
}
!*/

  Modernizr.addTest('boxsizing', testAllProps('boxSizing', 'border-box', true) && (document.documentMode === undefined || document.documentMode > 7));


  /**
   * List of property values to set for css tests. See ticket #21
   * http://git.io/vUGl4
   *
   * @memberof Modernizr
   * @name Modernizr._prefixes
   * @optionName Modernizr._prefixes
   * @optionProp prefixes
   * @access public
   * @example
   *
   * Modernizr._prefixes is the internal list of prefixes that we test against
   * inside of things like [prefixed](#modernizr-prefixed) and [prefixedCSS](#-code-modernizr-prefixedcss). It is simply
   * an array of kebab-case vendor prefixes you can use within your code.
   *
   * Some common use cases include
   *
   * Generating all possible prefixed version of a CSS property
   * ```js
   * var rule = Modernizr._prefixes.join('transform: rotate(20deg); ');
   *
   * rule === 'transform: rotate(20deg); webkit-transform: rotate(20deg); moz-transform: rotate(20deg); o-transform: rotate(20deg); ms-transform: rotate(20deg);'
   * ```
   *
   * Generating all possible prefixed version of a CSS value
   * ```js
   * rule = 'display:' +  Modernizr._prefixes.join('flex; display:') + 'flex';
   *
   * rule === 'display:flex; display:-webkit-flex; display:-moz-flex; display:-o-flex; display:-ms-flex; display:flex'
   * ```
   */

  // we use ['',''] rather than an empty array in order to allow a pattern of .`join()`ing prefixes to test
  // values in feature detects to continue to work
  var prefixes = (ModernizrProto._config.usePrefixes ? ' -webkit- -moz- -o- -ms- '.split(' ') : ['','']);

  // expose these for the plugin API. Look in the source for how to join() them against your input
  ModernizrProto._prefixes = prefixes;

  
/*!
{
  "name": "CSS Calc",
  "property": "csscalc",
  "caniuse": "calc",
  "tags": ["css"],
  "builderAliases": ["css_calc"],
  "authors": ["@calvein"]
}
!*/
/* DOC
Method of allowing calculated values for length units. For example:

```css
//lem {
  width: calc(100% - 3em);
}
```
*/

  Modernizr.addTest('csscalc', function() {
    var prop = 'width:';
    var value = 'calc(10px);';
    var el = createElement('a');

    el.style.cssText = prop + prefixes.join(value + prop);

    return !!el.style.length;
  });

/*!
{
  "name": "CSS Font ch Units",
  "authors": ["Ron Waldon (@jokeyrhyme)"],
  "property": "csschunit",
  "tags": ["css"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/css3-values/#font-relative-lengths"
  }]
}
!*/

  Modernizr.addTest('csschunit', function() {
    var elemStyle = modElem.elem.style;
    var supports;
    try {
      elemStyle.fontSize = '3ch';
      supports = elemStyle.fontSize.indexOf('ch') !== -1;
    } catch (e) {
      supports = false;
    }
    return supports;
  });

/*!
{
  "name": "CSS Cubic Bezier Range",
  "property": "cubicbezierrange",
  "tags": ["css"],
  "builderAliases": ["css_cubicbezierrange"],
  "doc" : null,
  "authors": ["@calvein"],
  "warnings": ["cubic-bezier values can't be > 1 for Webkit until [bug #45761](https://bugs.webkit.org/show_bug.cgi?id=45761) is fixed"],
  "notes": [{
    "name": "Comprehensive Compat Chart",
    "href": "http://muddledramblings.com/table-of-css3-border-radius-compliance"
  }]
}
!*/

  Modernizr.addTest('cubicbezierrange', function() {
    var el = createElement('a');
    el.style.cssText = prefixes.join('transition-timing-function:cubic-bezier(1,0,0,1.1); ');
    return !!el.style.length;
  });

/*!
{
  "name": "CSS text-overflow ellipsis",
  "property": "ellipsis",
  "caniuse": "text-overflow",
  "polyfills": [
    "text-overflow"
  ],
  "tags": ["css"]
}
!*/

  Modernizr.addTest('ellipsis', testAllProps('textOverflow', 'ellipsis'));

/*!
{
  "name": "CSS Font ex Units",
  "authors": ["Ron Waldon (@jokeyrhyme)"],
  "property": "cssexunit",
  "tags": ["css"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/css3-values/#font-relative-lengths"
  }]
}
!*/

  Modernizr.addTest('cssexunit', function() {
    var elemStyle = modElem.elem.style;
    var supports;
    try {
      elemStyle.fontSize = '3ex';
      supports = elemStyle.fontSize.indexOf('ex') !== -1;
    } catch (e) {
      supports = false;
    }
    return supports;
  });

/*!
{
  "name": "Flexbox",
  "property": "flexbox",
  "caniuse": "flexbox",
  "tags": ["css"],
  "notes": [{
    "name": "The _new_ flexbox",
    "href": "http://dev.w3.org/csswg/css3-flexbox"
  }],
  "warnings": [
    "A `true` result for this detect does not imply that the `flex-wrap` property is supported; see the `flexwrap` detect."
  ]
}
!*/
/* DOC
Detects support for the Flexible Box Layout model, a.k.a. Flexbox, which allows easy manipulation of layout order and sizing within a container.
*/

  Modernizr.addTest('flexbox', testAllProps('flexBasis', '1px', true));

/*!
{
  "name": "Flex Line Wrapping",
  "property": "flexwrap",
  "tags": ["css", "flexbox"],
  "notes": [{
    "name": "W3C Flexible Box Layout spec",
    "href": "http://dev.w3.org/csswg/css3-flexbox"
  }],
  "warnings": [
    "Does not imply a modern implementation – see documentation."
  ]
}
!*/
/* DOC
Detects support for the `flex-wrap` CSS property, part of Flexbox, which isn’t present in all Flexbox implementations (notably Firefox).

This featured in both the 'tweener' syntax (implemented by IE10) and the 'modern' syntax (implemented by others). This detect will return `true` for either of these implementations, as long as the `flex-wrap` property is supported. So to ensure the modern syntax is supported, use together with `Modernizr.flexbox`:

```javascript
if (Modernizr.flexbox && Modernizr.flexwrap) {
  // Modern Flexbox with `flex-wrap` supported
}
else {
  // Either old Flexbox syntax, or `flex-wrap` not supported
}
```
*/

  Modernizr.addTest('flexwrap', testAllProps('flexWrap', 'wrap', true));


  /**
   * testStyles injects an element with style element and some CSS rules
   *
   * @memberof Modernizr
   * @name Modernizr.testStyles
   * @optionName Modernizr.testStyles()
   * @optionProp testStyles
   * @access public
   * @function testStyles
   * @param {string} rule - String representing a css rule
   * @param {function} callback - A function that is used to test the injected element
   * @param {number} [nodes] - An integer representing the number of additional nodes you want injected
   * @param {string[]} [testnames] - An array of strings that are used as ids for the additional nodes
   * @returns {boolean}
   * @example
   *
   * `Modernizr.testStyles` takes a CSS rule and injects it onto the current page
   * along with (possibly multiple) DOM elements. This lets you check for features
   * that can not be detected by simply checking the [IDL](https://developer.mozilla.org/en-US/docs/Mozilla/Developer_guide/Interface_development_guide/IDL_interface_rules).
   *
   * ```js
   * Modernizr.testStyles('#modernizr { width: 9px; color: papayawhip; }', function(elem, rule) {
   *   // elem is the first DOM node in the page (by default #modernizr)
   *   // rule is the first argument you supplied - the CSS rule in string form
   *
   *   addTest('widthworks', elem.style.width === '9px')
   * });
   * ```
   *
   * If your test requires multiple nodes, you can include a third argument
   * indicating how many additional div elements to include on the page. The
   * additional nodes are injected as children of the `elem` that is returned as
   * the first argument to the callback.
   *
   * ```js
   * Modernizr.testStyles('#modernizr {width: 1px}; #modernizr2 {width: 2px}', function(elem) {
   *   document.getElementById('modernizr').style.width === '1px'; // true
   *   document.getElementById('modernizr2').style.width === '2px'; // true
   *   elem.firstChild === document.getElementById('modernizr2'); // true
   * }, 1);
   * ```
   *
   * By default, all of the additional elements have an ID of `modernizr[n]`, where
   * `n` is its index (e.g. the first additional, second overall is `#modernizr2`,
   * the second additional is `#modernizr3`, etc.).
   * If you want to have more meaningful IDs for your function, you can provide
   * them as the fourth argument, as an array of strings
   *
   * ```js
   * Modernizr.testStyles('#foo {width: 10px}; #bar {height: 20px}', function(elem) {
   *   elem.firstChild === document.getElementById('foo'); // true
   *   elem.lastChild === document.getElementById('bar'); // true
   * }, 2, ['foo', 'bar']);
   * ```
   *
   */

  var testStyles = ModernizrProto.testStyles = injectElementWithStyles;
  
/*!
{
  "name": "@font-face",
  "property": "fontface",
  "authors": ["Diego Perini", "Mat Marquis"],
  "tags": ["css"],
  "knownBugs": [
    "False Positive: WebOS https://github.com/Modernizr/Modernizr/issues/342",
    "False Postive: WP7 https://github.com/Modernizr/Modernizr/issues/538"
  ],
  "notes": [{
    "name": "@font-face detection routine by Diego Perini",
    "href": "http://javascript.nwbox.com/CSSSupport/"
  },{
    "name": "Filament Group @font-face compatibility research",
    "href": "https://docs.google.com/presentation/d/1n4NyG4uPRjAA8zn_pSQ_Ket0RhcWC6QlZ6LMjKeECo0/edit#slide=id.p"
  },{
    "name": "Filament Grunticon/@font-face device testing results",
    "href": "https://docs.google.com/spreadsheet/ccc?key=0Ag5_yGvxpINRdHFYeUJPNnZMWUZKR2ItMEpRTXZPdUE#gid=0"
  },{
    "name": "CSS fonts on Android",
    "href": "https://stackoverflow.com/questions/3200069/css-fonts-on-android"
  },{
    "name": "@font-face and Android",
    "href": "http://archivist.incutio.com/viewlist/css-discuss/115960"
  }]
}
!*/

  var blacklist = (function() {
    var ua = navigator.userAgent;
    var webos = ua.match(/w(eb)?osbrowser/gi);
    var wppre8 = ua.match(/windows phone/gi) && ua.match(/iemobile\/([0-9])+/gi) && parseFloat(RegExp.$1) >= 9;
    return webos || wppre8;
  }());
  if (blacklist) {
    Modernizr.addTest('fontface', false);
  } else {
    testStyles('@font-face {font-family:"font";src:url("https://")}', function(node, rule) {
      var style = document.getElementById('smodernizr');
      var sheet = style.sheet || style.styleSheet;
      var cssText = sheet ? (sheet.cssRules && sheet.cssRules[0] ? sheet.cssRules[0].cssText : sheet.cssText || '') : '';
      var bool = /src/i.test(cssText) && cssText.indexOf(rule.split(' ')[0]) === 0;
      Modernizr.addTest('fontface', bool);
    });
  }
;
/*!
{
  "name": "CSS Generated Content",
  "property": "generatedcontent",
  "tags": ["css"],
  "warnings": ["Android won't return correct height for anything below 7px #738"],
  "notes": [{
    "name": "W3C CSS Selectors Level 3 spec",
    "href": "https://www.w3.org/TR/css3-selectors/#gen-content"
  },{
    "name": "MDN article on :before",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/::before"
  },{
    "name": "MDN article on :after",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/::before"
  }]
}
!*/

  testStyles('#modernizr{font:0/0 a}#modernizr:after{content:":)";visibility:hidden;font:7px/1 a}', function(node) {
    // See bug report on why this value is 6 crbug.com/608142
    Modernizr.addTest('generatedcontent', node.offsetHeight >= 6);
  });

/*!
{
  "name": "CSS Gradients",
  "caniuse": "css-gradients",
  "property": "cssgradients",
  "tags": ["css"],
  "knownBugs": ["False-positives on webOS (https://github.com/Modernizr/Modernizr/issues/202)"],
  "notes": [{
    "name": "Webkit Gradient Syntax",
    "href": "https://webkit.org/blog/175/introducing-css-gradients/"
  },{
    "name": "Linear Gradient Syntax",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/linear-gradient"
  },{
    "name": "W3C Gradient Spec",
    "href": "https://drafts.csswg.org/css-images-3/#gradients"
  }]
}
!*/


  Modernizr.addTest('cssgradients', function() {

    var str1 = 'background-image:';
    var str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));';
    var css = '';
    var angle;

    for (var i = 0, len = prefixes.length - 1; i < len; i++) {
      angle = (i === 0 ? 'to ' : '');
      css += str1 + prefixes[i] + 'linear-gradient(' + angle + 'left top, #9f9, white);';
    }

    if (Modernizr._config.usePrefixes) {
    // legacy webkit syntax (FIXME: remove when syntax not in use anymore)
      css += str1 + '-webkit-' + str2;
    }

    var elem = createElement('a');
    var style = elem.style;
    style.cssText = css;

    // IE6 returns undefined so cast to string
    return ('' + style.backgroundImage).indexOf('gradient') > -1;
  });

/*!
{
  "name": "CSS HSLA Colors",
  "caniuse": "css3-colors",
  "property": "hsla",
  "tags": ["css"]
}
!*/

  Modernizr.addTest('hsla', function() {
    var style = createElement('a').style;
    style.cssText = 'background-color:hsla(120,40%,100%,.5)';
    return contains(style.backgroundColor, 'rgba') || contains(style.backgroundColor, 'hsla');
  });

/*!
{
  "name": "CSS :last-child pseudo-selector",
  "caniuse": "css-sel3",
  "property": "lastchild",
  "tags": ["css"],
  "builderAliases": ["css_lastchild"],
  "notes": [{
    "name": "Related Github Issue",
    "href": "https://github.com/Modernizr/Modernizr/pull/304"
  }]
}
!*/

  testStyles('#modernizr div {width:100px} #modernizr :last-child{width:200px;display:block}', function(elem) {
    Modernizr.addTest('lastchild', elem.lastChild.offsetWidth > elem.firstChild.offsetWidth);
  }, 2);

/*!
{
  "name": "CSS Media Queries",
  "caniuse": "css-mediaqueries",
  "property": "mediaqueries",
  "tags": ["css"],
  "builderAliases": ["css_mediaqueries"]
}
!*/

  Modernizr.addTest('mediaqueries', mq('only all'));

/*!
{
  "name": "CSS Multiple Backgrounds",
  "caniuse": "multibackgrounds",
  "property": "multiplebgs",
  "tags": ["css"]
}
!*/

  // Setting multiple images AND a color on the background shorthand property
  // and then querying the style.background property value for the number of
  // occurrences of "url(" is a reliable method for detecting ACTUAL support for this!

  Modernizr.addTest('multiplebgs', function() {
    var style = createElement('a').style;
    style.cssText = 'background:url(https://),url(https://),red url(https://)';

    // If the UA supports multiple backgrounds, there should be three occurrences
    // of the string "url(" in the return value for elemStyle.background
    return (/(url\s*\(.*?){3}/).test(style.background);
  });

/*!
{
  "name": "CSS :nth-child pseudo-selector",
  "caniuse": "css-sel3",
  "property": "nthchild",
  "tags": ["css"],
  "notes": [
    {
      "name": "Related Github Issue",
      "href": "https://github.com/Modernizr/Modernizr/pull/685"
    },
    {
      "name": "Sitepoint :nth-child documentation",
      "href": "http://reference.sitepoint.com/css/pseudoclass-nthchild"
    }
  ],
  "authors": ["@emilchristensen"],
  "warnings": ["Known false negative in Safari 3.1 and Safari 3.2.2"]
}
!*/
/* DOC
Detects support for the ':nth-child()' CSS pseudo-selector.
*/

  // 5 `<div>` elements with `1px` width are created.
  // Then every other element has its `width` set to `2px`.
  // A Javascript loop then tests if the `<div>`s have the expected width
  // using the modulus operator.
  testStyles('#modernizr div {width:1px} #modernizr div:nth-child(2n) {width:2px;}', function(elem) {
    var elems = elem.getElementsByTagName('div');
    var correctWidths = true;

    for (var i = 0; i < 5; i++) {
      correctWidths = correctWidths && elems[i].offsetWidth === i % 2 + 1;
    }
    Modernizr.addTest('nthchild', correctWidths);
  }, 5);

/*!
{
  "name": "CSS Object Fit",
  "caniuse": "object-fit",
  "property": "objectfit",
  "tags": ["css"],
  "builderAliases": ["css_objectfit"],
  "notes": [{
    "name": "Opera Article on Object Fit",
    "href": "https://dev.opera.com/articles/css3-object-fit-object-position/"
  }]
}
!*/

  Modernizr.addTest('objectfit', !!prefixed('objectFit'), {aliases: ['object-fit']});

/*!
{
  "name": "CSS Opacity",
  "caniuse": "css-opacity",
  "property": "opacity",
  "tags": ["css"]
}
!*/

  // Browsers that actually have CSS Opacity implemented have done so
  // according to spec, which means their return values are within the
  // range of [0.0,1.0] - including the leading zero.

  Modernizr.addTest('opacity', function() {
    var style = createElement('a').style;
    style.cssText = prefixes.join('opacity:.55;');

    // The non-literal . in this regex is intentional:
    // German Chrome returns this value as 0,55
    // github.com/Modernizr/Modernizr/issues/#issue/59/comment/516632
    return (/^0.55$/).test(style.opacity);
  });

/*!
{
  "name": "CSS Pointer Events",
  "caniuse": "pointer-events",
  "property": "csspointerevents",
  "authors": ["ausi"],
  "tags": ["css"],
  "builderAliases": ["css_pointerevents"],
  "notes": [
    {
      "name": "MDN Docs",
      "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events"
    },{
      "name": "Test Project Page",
      "href": "https://ausi.github.com/Feature-detection-technique-for-pointer-events/"
    },{
      "name": "Test Project Wiki",
      "href": "https://github.com/ausi/Feature-detection-technique-for-pointer-events/wiki"
    },
    {
      "name": "Related Github Issue",
      "href": "https://github.com/Modernizr/Modernizr/issues/80"
    }
  ]
}
!*/

  Modernizr.addTest('csspointerevents', function() {
    var style = createElement('a').style;
    style.cssText = 'pointer-events:auto';
    return style.pointerEvents === 'auto';
  });

/*!
{
  "name": "CSS position: sticky",
  "property": "csspositionsticky",
  "tags": ["css"],
  "builderAliases": ["css_positionsticky"],
  "notes": [{
    "name": "Chrome bug report",
    "href":"https://code.google.com/p/chromium/issues/detail?id=322972"
  }],
  "warnings": [ "using position:sticky on anything but top aligned elements is buggy in Chrome < 37 and iOS <=7+" ]
}
!*/

  // Sticky positioning - constrains an element to be positioned inside the
  // intersection of its container box, and the viewport.
  Modernizr.addTest('csspositionsticky', function() {
    var prop = 'position:';
    var value = 'sticky';
    var el = createElement('a');
    var mStyle = el.style;

    mStyle.cssText = prop + prefixes.join(value + ';' + prop).slice(0, -prop.length);

    return mStyle.position.indexOf(value) !== -1;
  });

/*!
{
  "name": "CSS Generated Content Animations",
  "property": "csspseudoanimations",
  "tags": ["css"]
}
!*/

  Modernizr.addTest('csspseudoanimations', function() {
    var result = false;

    if (!Modernizr.cssanimations || !window.getComputedStyle) {
      return result;
    }

    var styles = [
      '@', Modernizr._prefixes.join('keyframes csspseudoanimations { from { font-size: 10px; } }@').replace(/\@$/, ''),
      '#modernizr:before { content:" "; font-size:5px;',
      Modernizr._prefixes.join('animation:csspseudoanimations 1ms infinite;'),
      '}'
    ].join('');

    Modernizr.testStyles(styles, function(elem) {
      result = window.getComputedStyle(elem, ':before').getPropertyValue('font-size') === '10px';
    });

    return result;
  });

/*!
{
  "name": "CSS Transitions",
  "property": "csstransitions",
  "caniuse": "css-transitions",
  "tags": ["css"]
}
!*/

  Modernizr.addTest('csstransitions', testAllProps('transition', 'all', true));

/*!
{
  "name": "CSS Generated Content Transitions",
  "property": "csspseudotransitions",
  "tags": ["css"]
}
!*/

  Modernizr.addTest('csspseudotransitions', function() {
    var result = false;

    if (!Modernizr.csstransitions || !window.getComputedStyle) {
      return result;
    }

    var styles =
      '#modernizr:before { content:" "; font-size:5px;' + Modernizr._prefixes.join('transition:0s 100s;') + '}' +
      '#modernizr.trigger:before { font-size:10px; }';

    Modernizr.testStyles(styles, function(elem) {
      // Force rendering of the element's styles so that the transition will trigger
      window.getComputedStyle(elem, ':before').getPropertyValue('font-size');
      elem.className += 'trigger';
      result = window.getComputedStyle(elem, ':before').getPropertyValue('font-size') === '5px';
    });

    return result;
  });

/*!
{
  "name": "CSS Font rem Units",
  "caniuse": "rem",
  "authors": ["nsfmc"],
  "property": "cssremunit",
  "tags": ["css"],
  "builderAliases": ["css_remunit"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/css3-values/#relative0"
  },{
    "name": "Font Size with rem by Jonathan Snook",
    "href": "http://snook.ca/archives/html_and_css/font-size-with-rem"
  }]
}
!*/

  // "The 'rem' unit ('root em') is relative to the computed
  // value of the 'font-size' value of the root element."
  // you can test by checking if the prop was ditched

  Modernizr.addTest('cssremunit', function() {
    var style = createElement('a').style;
    try {
      style.fontSize = '3rem';
    }
    catch (e) {}
    return (/rem/).test(style.fontSize);
  });

/*!
{
  "name": "CSS UI Resize",
  "property": "cssresize",
  "caniuse": "css-resize",
  "tags": ["css"],
  "builderAliases": ["css_resize"],
  "notes": [{
    "name": "W3C Specification",
    "href": "https://www.w3.org/TR/css3-ui/#resize"
  },{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en/CSS/resize"
  }]
}
!*/
/* DOC
Test for CSS 3 UI "resize" property
*/

  Modernizr.addTest('cssresize', testAllProps('resize', 'both', true));

/*!
{
  "name": "CSS rgba",
  "caniuse": "css3-colors",
  "property": "rgba",
  "tags": ["css"],
  "notes": [{
    "name": "CSSTricks Tutorial",
    "href": "https://css-tricks.com/rgba-browser-support/"
  }]
}
!*/

  Modernizr.addTest('rgba', function() {
    var style = createElement('a').style;
    style.cssText = 'background-color:rgba(150,255,150,.5)';

    return ('' + style.backgroundColor).indexOf('rgba') > -1;
  });

/*!
{
  "name": "CSS general sibling selector",
  "caniuse": "css-sel3",
  "property": "siblinggeneral",
  "tags": ["css"],
  "notes": [{
    "name": "Related Github Issue",
    "href": "https://github.com/Modernizr/Modernizr/pull/889"
  }]
}
!*/

  Modernizr.addTest('siblinggeneral', function() {
    return testStyles('#modernizr div {width:100px} #modernizr div ~ div {width:200px;display:block}', function(elem) {
      return elem.lastChild.offsetWidth == 200;
    }, 2);
  });

/*!
{
  "name": "CSS Subpixel Fonts",
  "property": "subpixelfont",
  "tags": ["css"],
  "builderAliases": ["css_subpixelfont"],
  "authors": [
    "@derSchepp",
    "@gerritvanaaken",
    "@rodneyrehm",
    "@yatil",
    "@ryanseddon"
  ],
  "notes": [{
    "name": "Origin Test",
    "href": "https://github.com/gerritvanaaken/subpixeldetect"
  }]
}
!*/

  /*
   * (to infer if GDI or DirectWrite is used on Windows)
   */
  testStyles(
    '#modernizr{position: absolute; top: -10em; visibility:hidden; font: normal 10px arial;}#subpixel{float: left; font-size: 33.3333%;}',
  function(elem) {
    var subpixel = elem.firstChild;
    subpixel.innerHTML = 'This is a text written in Arial';
    Modernizr.addTest('subpixelfont', window.getComputedStyle ?
      window.getComputedStyle(subpixel, null).getPropertyValue('width') !== '44px'
    : false);
  }, 1, ['subpixel']);

/*!
{
  "name": "CSS Supports",
  "property": "supports",
  "caniuse": "css-featurequeries",
  "tags": ["css"],
  "builderAliases": ["css_supports"],
  "notes": [{
    "name": "W3 Spec",
    "href": "http://dev.w3.org/csswg/css3-conditional/#at-supports"
  },{
    "name": "Related Github Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/648"
  },{
    "name": "W3 Info",
    "href": "http://dev.w3.org/csswg/css3-conditional/#the-csssupportsrule-interface"
  }]
}
!*/

  var newSyntax = 'CSS' in window && 'supports' in window.CSS;
  var oldSyntax = 'supportsCSS' in window;
  Modernizr.addTest('supports', newSyntax || oldSyntax);

/*!
{
  "name": "CSS :target pseudo-class",
  "caniuse": "css-sel3",
  "property": "target",
  "tags": ["css"],
  "notes": [{
    "name": "MDN documentation",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/:target"
  }],
  "authors": ["@zachleat"],
  "warnings": ["Opera Mini supports :target but doesn't update the hash for anchor links."]
}
!*/
/* DOC
Detects support for the ':target' CSS pseudo-class.
*/

  // querySelector
  Modernizr.addTest('target', function() {
    var doc = window.document;
    if (!('querySelectorAll' in doc)) {
      return false;
    }

    try {
      doc.querySelectorAll(':target');
      return true;
    } catch (e) {
      return false;
    }
  });

/*!
{
  "name": "CSS Transforms",
  "property": "csstransforms",
  "caniuse": "transforms2d",
  "tags": ["css"]
}
!*/

  Modernizr.addTest('csstransforms', function() {
    // Android < 3.0 is buggy, so we sniff and blacklist
    // http://git.io/hHzL7w
    return navigator.userAgent.indexOf('Android 2.') === -1 &&
           testAllProps('transform', 'scale(1)', true);
  });

/*!
{
  "name": "CSS Transforms 3D",
  "property": "csstransforms3d",
  "caniuse": "transforms3d",
  "tags": ["css"],
  "warnings": [
    "Chrome may occassionally fail this test on some systems; more info: https://code.google.com/p/chromium/issues/detail?id=129004"
  ]
}
!*/

  Modernizr.addTest('csstransforms3d', function() {
    return !!testAllProps('perspective', '1px', true);
  });

/*!
{
  "name": "CSS Transform Style preserve-3d",
  "property": "preserve3d",
  "authors": ["denyskoch", "aFarkas"],
  "tags": ["css"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/transform-style"
  },{
    "name": "Related Github Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/1748"
  }]
}
!*/
/* DOC
Detects support for `transform-style: preserve-3d`, for getting a proper 3D perspective on elements.
*/

  Modernizr.addTest('preserve3d', function() {
    var outerAnchor, innerAnchor;
    var CSS = window.CSS;
    var result = false;

    if (CSS && CSS.supports && CSS.supports('(transform-style: preserve-3d)')) {
      return true;
    }

    outerAnchor = createElement('a');
    innerAnchor = createElement('a');

    outerAnchor.style.cssText = 'display: block; transform-style: preserve-3d; transform-origin: right; transform: rotateY(40deg);';
    innerAnchor.style.cssText = 'display: block; width: 9px; height: 1px; background: #000; transform-origin: right; transform: rotateY(40deg);';

    outerAnchor.appendChild(innerAnchor);
    docElement.appendChild(outerAnchor);

    result = innerAnchor.getBoundingClientRect();
    docElement.removeChild(outerAnchor);

    result = result.width && result.width < 4;
    return result;
  });

/*!
{
  "name": "CSS user-select",
  "property": "userselect",
  "caniuse": "user-select-none",
  "authors": ["ryan seddon"],
  "tags": ["css"],
  "builderAliases": ["css_userselect"],
  "notes": [{
    "name": "Related Modernizr Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/250"
  }]
}
!*/

  //https://github.com/Modernizr/Modernizr/issues/250
  Modernizr.addTest('userselect', testAllProps('userSelect', 'none', true));


  /**
   * roundedEquals takes two integers and checks if the first is within 1 of the second
   *
   * @access private
   * @function roundedEquals
   * @param {number} a
   * @param {number} b
   * @returns {boolean}
   */

  function roundedEquals(a, b) {
    return a - 1 === b || a === b || a + 1 === b;
  }

  ;
/*!
{
  "name": "CSS vh unit",
  "property": "cssvhunit",
  "caniuse": "viewport-units",
  "tags": ["css"],
  "builderAliases": ["css_vhunit"],
  "notes": [{
    "name": "Related Modernizr Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/572"
  },{
    "name": "Similar JSFiddle",
    "href": "https://jsfiddle.net/FWeinb/etnYC/"
  }]
}
!*/

  testStyles('#modernizr { height: 50vh; }', function(elem) {
    var height = parseInt(window.innerHeight / 2, 10);
    var compStyle = parseInt(computedStyle(elem, null, 'height'), 10);

    Modernizr.addTest('cssvhunit', roundedEquals(compStyle, height));
  });

/*!
{
  "name": "CSS vmax unit",
  "property": "cssvmaxunit",
  "caniuse": "viewport-units",
  "tags": ["css"],
  "builderAliases": ["css_vmaxunit"],
  "notes": [{
    "name": "Related Modernizr Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/572"
  },{
    "name": "JSFiddle Example",
    "href": "https://jsfiddle.net/glsee/JDsWQ/4/"
  }]
}
!*/

  testStyles('#modernizr1{width: 50vmax}#modernizr2{width:50px;height:50px;overflow:scroll}#modernizr3{position:fixed;top:0;left:0;bottom:0;right:0}', function(node) {
    var elem = node.childNodes[2];
    var scroller = node.childNodes[1];
    var fullSizeElem = node.childNodes[0];
    var scrollbarWidth = parseInt((scroller.offsetWidth - scroller.clientWidth) / 2, 10);

    var one_vw = fullSizeElem.clientWidth / 100;
    var one_vh = fullSizeElem.clientHeight / 100;
    var expectedWidth = parseInt(Math.max(one_vw, one_vh) * 50, 10);
    var compWidth = parseInt(computedStyle(elem, null, 'width'), 10);

    Modernizr.addTest('cssvmaxunit', roundedEquals(expectedWidth, compWidth) || roundedEquals(expectedWidth, compWidth - scrollbarWidth));
  }, 3);

/*!
{
  "name": "CSS vmin unit",
  "property": "cssvminunit",
  "caniuse": "viewport-units",
  "tags": ["css"],
  "builderAliases": ["css_vminunit"],
  "notes": [{
    "name": "Related Modernizr Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/572"
  },{
    "name": "JSFiddle Example",
    "href": "https://jsfiddle.net/glsee/JRmdq/8/"
  }]
}
!*/

  testStyles('#modernizr1{width: 50vm;width:50vmin}#modernizr2{width:50px;height:50px;overflow:scroll}#modernizr3{position:fixed;top:0;left:0;bottom:0;right:0}', function(node) {
    var elem = node.childNodes[2];
    var scroller = node.childNodes[1];
    var fullSizeElem = node.childNodes[0];
    var scrollbarWidth = parseInt((scroller.offsetWidth - scroller.clientWidth) / 2, 10);

    var one_vw = fullSizeElem.clientWidth / 100;
    var one_vh = fullSizeElem.clientHeight / 100;
    var expectedWidth = parseInt(Math.min(one_vw, one_vh) * 50, 10);
    var compWidth = parseInt(computedStyle(elem, null, 'width'), 10);

    Modernizr.addTest('cssvminunit', roundedEquals(expectedWidth, compWidth) || roundedEquals(expectedWidth, compWidth - scrollbarWidth));
  }, 3);

/*!
{
  "name": "CSS vw unit",
  "property": "cssvwunit",
  "caniuse": "viewport-units",
  "tags": ["css"],
  "builderAliases": ["css_vwunit"],
  "notes": [{
    "name": "Related Modernizr Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/572"
  },{
    "name": "JSFiddle Example",
    "href": "https://jsfiddle.net/FWeinb/etnYC/"
  }]
}
!*/

  testStyles('#modernizr { width: 50vw; }', function(elem) {
    var width = parseInt(window.innerWidth / 2, 10);
    var compStyle = parseInt(computedStyle(elem, null, 'width'), 10);

    Modernizr.addTest('cssvwunit', roundedEquals(compStyle, width));
  });

/*!
{
  "name": "will-change",
  "property": "willchange",
  "notes": [{
    "name": "Spec",
    "href": "https://drafts.csswg.org/css-will-change/"
  }]
}
!*/
/* DOC
Detects support for the `will-change` css property, which formally signals to the
browser that an element will be animating.
*/

  Modernizr.addTest('willchange', 'willChange' in docElement.style);

/*!
{
  "name": "classList",
  "caniuse": "classlist",
  "property": "classlist",
  "tags": ["dom"],
  "builderAliases": ["dataview_api"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en/DOM/element.classList"
  }]
}
!*/

  Modernizr.addTest('classlist', 'classList' in docElement);

/*!
{
  "name": "Document Fragment",
  "property": "documentfragment",
  "notes": [{
    "name": "W3C DOM Level 1 Reference",
    "href": "https://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-B63ED1A3"
  }, {
    "name": "SitePoint Reference",
    "href": "http://reference.sitepoint.com/javascript/DocumentFragment"
  }, {
    "name": "QuirksMode Compatibility Tables",
    "href": "http://www.quirksmode.org/m/w3c_core.html#t112"
  }],
  "authors": ["Ron Waldon (@jokeyrhyme)"],
  "knownBugs": ["false-positive on Blackberry 9500, see QuirksMode note"],
  "tags": []
}
!*/
/* DOC
Append multiple elements to the DOM within a single insertion.
*/

  Modernizr.addTest('documentfragment', function() {
    return 'createDocumentFragment' in document &&
      'appendChild' in docElement;
  });

/*!
{
  "name": "DOM4 MutationObserver",
  "property": "mutationobserver",
  "caniuse": "mutationobserver",
  "tags": ["dom"],
  "authors": ["Karel Sedláček (@ksdlck)"],
  "polyfills": ["mutationobservers"],
  "notes": [{
    "name": "MDN documentation",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver"
  }]
}
!*/
/* DOC

Determines if DOM4 MutationObserver support is available.

*/

  Modernizr.addTest('mutationobserver',
    !!window.MutationObserver || !!window.WebKitMutationObserver);

/*!
{
  "name": "ES6 Array",
  "property": "es6array",
  "notes": [{
    "name": "unofficial ECMAScript 6 draft specification",
    "href": "https://people.mozilla.org/~jorendorff/es6-draft.html"
  }],
  "polyfills": ["es6shim"],
  "authors": ["Ron Waldon (@jokeyrhyme)"],
  "warnings": ["ECMAScript 6 is still a only a draft, so this detect may not match the final specification or implementations."],
  "tags": ["es6"]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 Array per specification.
*/

  Modernizr.addTest('es6array', !!(Array.prototype &&
    Array.prototype.copyWithin &&
    Array.prototype.fill &&
    Array.prototype.find &&
    Array.prototype.findIndex &&
    Array.prototype.keys &&
    Array.prototype.entries &&
    Array.prototype.values &&
    Array.from &&
    Array.of));

/*!
{
  "name": "ES5 String.prototype.contains",
  "property": "contains",
  "authors": ["Robert Kowalski"],
  "tags": ["es6"]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 `String.prototype.contains` per specification.
*/

  Modernizr.addTest('contains', is(String.prototype.contains, 'function'));

/*!
{
  "name": "ES6 Generators",
  "property": "generators",
  "authors": ["Michael Kachanovskyi"],
  "tags": ["es6"]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 Generators per specification.
*/

  Modernizr.addTest('generators', function() {
    try {
      new Function('function* test() {}')();
    } catch (e) {
      return false;
    }
    return true;
  });

/*!
{
  "name": "ES6 Math",
  "property": "es6math",
  "notes": [{
    "name": "unofficial ECMAScript 6 draft specification",
    "href": "https://people.mozilla.org/~jorendorff/es6-draft.html"
  }],
  "polyfills": ["es6shim"],
  "authors": ["Ron Waldon (@jokeyrhyme)"],
  "warnings": ["ECMAScript 6 is still a only a draft, so this detect may not match the final specification or implementations."],
  "tags": ["es6"]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 Math per specification.
*/

  Modernizr.addTest('es6math', !!(Math &&
    Math.clz32 &&
    Math.cbrt &&
    Math.imul &&
    Math.sign &&
    Math.log10 &&
    Math.log2 &&
    Math.log1p &&
    Math.expm1 &&
    Math.cosh &&
    Math.sinh &&
    Math.tanh &&
    Math.acosh &&
    Math.asinh &&
    Math.atanh &&
    Math.hypot &&
    Math.trunc &&
    Math.fround));

/*!
{
  "name": "ES6 Number",
  "property": "es6number",
  "notes": [{
    "name": "unofficial ECMAScript 6 draft specification",
    "href": "https://people.mozilla.org/~jorendorff/es6-draft.html"
  }],
  "polyfills": ["es6shim"],
  "authors": ["Ron Waldon (@jokeyrhyme)"],
  "warnings": ["ECMAScript 6 is still a only a draft, so this detect may not match the final specification or implementations."],
  "tags": ["es6"]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 Number per specification.
*/

  Modernizr.addTest('es6number', !!(Number.isFinite &&
    Number.isInteger &&
    Number.isSafeInteger &&
    Number.isNaN &&
    Number.parseInt &&
    Number.parseFloat &&
    Number.isInteger(Number.MAX_SAFE_INTEGER) &&
    Number.isInteger(Number.MIN_SAFE_INTEGER) &&
    Number.isFinite(Number.EPSILON)));

/*!
{
  "name": "ES6 Object",
  "property": "es6object",
  "notes": [{
    "name": "unofficial ECMAScript 6 draft specification",
    "href": "https://people.mozilla.org/~jorendorff/es6-draft.html"
  }],
  "polyfills": ["es6shim"],
  "authors": ["Ron Waldon (@jokeyrhyme)"],
  "warnings": ["ECMAScript 6 is still a only a draft, so this detect may not match the final specification or implementations."],
  "tags": ["es6"]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 Object per specification.
*/

  Modernizr.addTest('es6object', !!(Object.assign &&
    Object.is &&
    Object.setPrototypeOf));

/*!
{
  "name": "ES6 Promises",
  "property": "promises",
  "caniuse": "promises",
  "polyfills": ["es6promises"],
  "authors": ["Krister Kari", "Jake Archibald"],
  "tags": ["es6"],
  "notes": [{
    "name": "The ES6 promises spec",
    "href": "https://github.com/domenic/promises-unwrapping"
  },{
    "name": "Chromium dashboard - ES6 Promises",
    "href": "https://www.chromestatus.com/features/5681726336532480"
  },{
    "name": "JavaScript Promises: There and back again - HTML5 Rocks",
    "href": "http://www.html5rocks.com/en/tutorials/es6/promises/"
  }]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 Promises per specification.
*/

  Modernizr.addTest('promises', function() {
    return 'Promise' in window &&
    // Some of these methods are missing from
    // Firefox/Chrome experimental implementations
    'resolve' in window.Promise &&
    'reject' in window.Promise &&
    'all' in window.Promise &&
    'race' in window.Promise &&
    // Older version of the spec had a resolver object
    // as the arg rather than a function
    (function() {
      var resolve;
      new window.Promise(function(r) { resolve = r; });
      return typeof resolve === 'function';
    }());
  });

/*!
{
  "name": "ES6 String",
  "property": "es6string",
  "notes": [{
    "name": "unofficial ECMAScript 6 draft specification",
    "href": "https://people.mozilla.org/~jorendorff/es6-draft.html"
  }],
  "polyfills": ["es6shim"],
  "authors": ["Ron Waldon (@jokeyrhyme)"],
  "warnings": ["ECMAScript 6 is still a only a draft, so this detect may not match the final specification or implementations."],
  "tags": ["es6"]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 String per specification.
*/

  Modernizr.addTest('es6string', !!(String.fromCodePoint &&
    String.raw &&
    String.prototype.codePointAt &&
    String.prototype.repeat &&
    String.prototype.startsWith &&
    String.prototype.endsWith &&
    String.prototype.includes));

/*!
{
  "name": "Orientation and Motion Events",
  "property": ["devicemotion", "deviceorientation"],
  "caniuse": "deviceorientation",
  "notes": [{
    "name": "W3C Editor's Draft",
    "href": "http://w3c.github.io/deviceorientation/spec-source-orientation.html"
  },{
    "name": "Implementation by iOS Safari (Orientation)",
    "href": "http://goo.gl/fhce3"
  },{
    "name": "Implementation by iOS Safari (Motion)",
    "href": "http://goo.gl/rLKz8"
  }],
  "authors": ["Shi Chuan"],
  "tags": ["event"],
  "builderAliases": ["event_deviceorientation_motion"]
}
!*/
/* DOC
Part of Device Access aspect of HTML5, same category as geolocation.

`devicemotion` tests for Device Motion Event support, returns boolean value true/false.

`deviceorientation` tests for Device Orientation Event support, returns boolean value true/false
*/

  Modernizr.addTest('devicemotion', 'DeviceMotionEvent' in window);
  Modernizr.addTest('deviceorientation', 'DeviceOrientationEvent' in window);

/*!
{
  "name": "Fullscreen API",
  "property": "fullscreen",
  "caniuse": "fullscreen",
  "notes": [{
    "name": "MDN documentation",
    "href": "https://developer.mozilla.org/en/API/Fullscreen"
  }],
  "polyfills": ["screenfulljs"],
  "builderAliases": ["fullscreen_api"]
}
!*/
/* DOC
Detects support for the ability to make the current website take over the user's entire screen
*/

  // github.com/Modernizr/Modernizr/issues/739
  Modernizr.addTest('fullscreen', !!(prefixed('exitFullscreen', document, false) || prefixed('cancelFullScreen', document, false)));

/*!
{
  "name": "Hashchange event",
  "property": "hashchange",
  "caniuse": "hashchange",
  "tags": ["history"],
  "notes": [{
    "name": "MDN documentation",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/window.onhashchange"
  }],
  "polyfills": [
    "jquery-hashchange",
    "moo-historymanager",
    "jquery-ajaxy",
    "hasher",
    "shistory"
  ]
}
!*/
/* DOC
Detects support for the `hashchange` event, fired when the current location fragment changes.
*/

  Modernizr.addTest('hashchange', function() {
    if (hasEvent('hashchange', window) === false) {
      return false;
    }

    // documentMode logic from YUI to filter out IE8 Compat Mode
    //   which false positives.
    return (document.documentMode === undefined || document.documentMode > 7);
  });

/*!
{
  "name": "Hidden Scrollbar",
  "property": "hiddenscroll",
  "authors": ["Oleg Korsunsky"],
  "tags": ["overlay"],
  "notes": [{
    "name": "Overlay Scrollbar description",
    "href": "https://developer.apple.com/library/mac/releasenotes/MacOSX/WhatsNewInOSX/Articles/MacOSX10_7.html#//apple_ref/doc/uid/TP40010355-SW39"
  },{
    "name": "Video example of overlay scrollbars",
    "href": "https://gfycat.com/FoolishMeaslyAtlanticsharpnosepuffer"
  }]
}
!*/
/* DOC
Detects overlay scrollbars (when scrollbars on overflowed blocks are visible). This is found most commonly on mobile and OS X.
*/

  Modernizr.addTest('hiddenscroll', function() {
    return testStyles('#modernizr {width:100px;height:100px;overflow:scroll}', function(elem) {
      return elem.offsetWidth === elem.clientWidth;
    });
  });

/*!
{
  "name": "History API",
  "property": "history",
  "caniuse": "history",
  "tags": ["history"],
  "authors": ["Hay Kranen", "Alexander Farkas"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/html51/browsers.html#the-history-interface"
  }, {
    "name": "MDN documentation",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/window.history"
  }],
  "polyfills": ["historyjs", "html5historyapi"]
}
!*/
/* DOC
Detects support for the History API for manipulating the browser session history.
*/

  Modernizr.addTest('history', function() {
    // Issue #733
    // The stock browser on Android 2.2 & 2.3, and 4.0.x returns positive on history support
    // Unfortunately support is really buggy and there is no clean way to detect
    // these bugs, so we fall back to a user agent sniff :(
    var ua = navigator.userAgent;

    // We only want Android 2 and 4.0, stock browser, and not Chrome which identifies
    // itself as 'Mobile Safari' as well, nor Windows Phone (issue #1471).
    if ((ua.indexOf('Android 2.') !== -1 ||
        (ua.indexOf('Android 4.0') !== -1)) &&
        ua.indexOf('Mobile Safari') !== -1 &&
        ua.indexOf('Chrome') === -1 &&
        ua.indexOf('Windows Phone') === -1 &&
    // Since all documents on file:// share an origin, the History apis are
    // blocked there as well
        location.protocol !== 'file:'
    ) {
      return false;
    }

    // Return the regular check
    return (window.history && 'pushState' in window.history);
  });


  /**
   * hasOwnProp is a shim for hasOwnProperty that is needed for Safari 2.0 support
   *
   * @author kangax
   * @access private
   * @function hasOwnProp
   * @param {object} object - The object to check for a property
   * @param {string} property - The property to check for
   * @returns {boolean}
   */

  // hasOwnProperty shim by kangax needed for Safari 2.0 support
  var hasOwnProp;

  (function() {
    var _hasOwnProperty = ({}).hasOwnProperty;
    /* istanbul ignore else */
    /* we have no way of testing IE 5.5 or safari 2,
     * so just assume the else gets hit */
    if (!is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined')) {
      hasOwnProp = function(object, property) {
        return _hasOwnProperty.call(object, property);
      };
    }
    else {
      hasOwnProp = function(object, property) { /* yes, this can give false positives/negatives, but most of the time we don't care about those */
        return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
      };
    }
  })();

  

  /**
   * setClasses takes an array of class names and adds them to the root element
   *
   * @access private
   * @function setClasses
   * @param {string[]} classes - Array of class names
   */

  // Pass in an and array of class names, e.g.:
  //  ['no-webp', 'borderradius', ...]
  function setClasses(classes) {
    var className = docElement.className;
    var classPrefix = Modernizr._config.classPrefix || '';

    if (isSVG) {
      className = className.baseVal;
    }

    // Change `no-js` to `js` (independently of the `enableClasses` option)
    // Handle classPrefix on this too
    if (Modernizr._config.enableJSClass) {
      var reJS = new RegExp('(^|\\s)' + classPrefix + 'no-js(\\s|$)');
      className = className.replace(reJS, '$1' + classPrefix + 'js$2');
    }

    if (Modernizr._config.enableClasses) {
      // Add the new classes
      className += ' ' + classPrefix + classes.join(' ' + classPrefix);
      if (isSVG) {
        docElement.className.baseVal = className;
      } else {
        docElement.className = className;
      }
    }

  }

  ;


   // _l tracks listeners for async tests, as well as tests that execute after the initial run
  ModernizrProto._l = {};

  /**
   * Modernizr.on is a way to listen for the completion of async tests. Being
   * asynchronous, they may not finish before your scripts run. As a result you
   * will get a possibly false negative `undefined` value.
   *
   * @memberof Modernizr
   * @name Modernizr.on
   * @access public
   * @function on
   * @param {string} feature - String name of the feature detect
   * @param {function} cb - Callback function returning a Boolean - true if feature is supported, false if not
   * @example
   *
   * ```js
   * Modernizr.on('flash', function( result ) {
   *   if (result) {
   *    // the browser has flash
   *   } else {
   *     // the browser does not have flash
   *   }
   * });
   * ```
   */

  ModernizrProto.on = function(feature, cb) {
    // Create the list of listeners if it doesn't exist
    if (!this._l[feature]) {
      this._l[feature] = [];
    }

    // Push this test on to the listener list
    this._l[feature].push(cb);

    // If it's already been resolved, trigger it on next tick
    if (Modernizr.hasOwnProperty(feature)) {
      // Next Tick
      setTimeout(function() {
        Modernizr._trigger(feature, Modernizr[feature]);
      }, 0);
    }
  };

  /**
   * _trigger is the private function used to signal test completion and run any
   * callbacks registered through [Modernizr.on](#modernizr-on)
   *
   * @memberof Modernizr
   * @name Modernizr._trigger
   * @access private
   * @function _trigger
   * @param {string} feature - string name of the feature detect
   * @param {function|boolean} [res] - A feature detection function, or the boolean =
   * result of a feature detection function
   */

  ModernizrProto._trigger = function(feature, res) {
    if (!this._l[feature]) {
      return;
    }

    var cbs = this._l[feature];

    // Force async
    setTimeout(function() {
      var i, cb;
      for (i = 0; i < cbs.length; i++) {
        cb = cbs[i];
        cb(res);
      }
    }, 0);

    // Don't trigger these again
    delete this._l[feature];
  };

  /**
   * addTest allows you to define your own feature detects that are not currently
   * included in Modernizr (under the covers it's the exact same code Modernizr
   * uses for its own [feature detections](https://github.com/Modernizr/Modernizr/tree/master/feature-detects)). Just like the offical detects, the result
   * will be added onto the Modernizr object, as well as an appropriate className set on
   * the html element when configured to do so
   *
   * @memberof Modernizr
   * @name Modernizr.addTest
   * @optionName Modernizr.addTest()
   * @optionProp addTest
   * @access public
   * @function addTest
   * @param {string|object} feature - The string name of the feature detect, or an
   * object of feature detect names and test
   * @param {function|boolean} test - Function returning true if feature is supported,
   * false if not. Otherwise a boolean representing the results of a feature detection
   * @example
   *
   * The most common way of creating your own feature detects is by calling
   * `Modernizr.addTest` with a string (preferably just lowercase, without any
   * punctuation), and a function you want executed that will return a boolean result
   *
   * ```js
   * Modernizr.addTest('itsTuesday', function() {
   *  var d = new Date();
   *  return d.getDay() === 2;
   * });
   * ```
   *
   * When the above is run, it will set Modernizr.itstuesday to `true` when it is tuesday,
   * and to `false` every other day of the week. One thing to notice is that the names of
   * feature detect functions are always lowercased when added to the Modernizr object. That
   * means that `Modernizr.itsTuesday` will not exist, but `Modernizr.itstuesday` will.
   *
   *
   *  Since we only look at the returned value from any feature detection function,
   *  you do not need to actually use a function. For simple detections, just passing
   *  in a statement that will return a boolean value works just fine.
   *
   * ```js
   * Modernizr.addTest('hasJquery', 'jQuery' in window);
   * ```
   *
   * Just like before, when the above runs `Modernizr.hasjquery` will be true if
   * jQuery has been included on the page. Not using a function saves a small amount
   * of overhead for the browser, as well as making your code much more readable.
   *
   * Finally, you also have the ability to pass in an object of feature names and
   * their tests. This is handy if you want to add multiple detections in one go.
   * The keys should always be a string, and the value can be either a boolean or
   * function that returns a boolean.
   *
   * ```js
   * var detects = {
   *  'hasjquery': 'jQuery' in window,
   *  'itstuesday': function() {
   *    var d = new Date();
   *    return d.getDay() === 2;
   *  }
   * }
   *
   * Modernizr.addTest(detects);
   * ```
   *
   * There is really no difference between the first methods and this one, it is
   * just a convenience to let you write more readable code.
   */

  function addTest(feature, test) {

    if (typeof feature == 'object') {
      for (var key in feature) {
        if (hasOwnProp(feature, key)) {
          addTest(key, feature[ key ]);
        }
      }
    } else {

      feature = feature.toLowerCase();
      var featureNameSplit = feature.split('.');
      var last = Modernizr[featureNameSplit[0]];

      // Again, we don't check for parent test existence. Get that right, though.
      if (featureNameSplit.length == 2) {
        last = last[featureNameSplit[1]];
      }

      if (typeof last != 'undefined') {
        // we're going to quit if you're trying to overwrite an existing test
        // if we were to allow it, we'd do this:
        //   var re = new RegExp("\\b(no-)?" + feature + "\\b");
        //   docElement.className = docElement.className.replace( re, '' );
        // but, no rly, stuff 'em.
        return Modernizr;
      }

      test = typeof test == 'function' ? test() : test;

      // Set the value (this is the magic, right here).
      if (featureNameSplit.length == 1) {
        Modernizr[featureNameSplit[0]] = test;
      } else {
        // cast to a Boolean, if not one already
        if (Modernizr[featureNameSplit[0]] && !(Modernizr[featureNameSplit[0]] instanceof Boolean)) {
          Modernizr[featureNameSplit[0]] = new Boolean(Modernizr[featureNameSplit[0]]);
        }

        Modernizr[featureNameSplit[0]][featureNameSplit[1]] = test;
      }

      // Set a single class (either `feature` or `no-feature`)
      setClasses([(!!test && test != false ? '' : 'no-') + featureNameSplit.join('-')]);

      // Trigger the event
      Modernizr._trigger(feature, test);
    }

    return Modernizr; // allow chaining.
  }

  // After all the tests are run, add self to the Modernizr prototype
  Modernizr._q.push(function() {
    ModernizrProto.addTest = addTest;
  });

  

/*!
{
  "name": "sizes attribute",
  "async": true,
  "property": "sizes",
  "tags": ["image"],
  "authors": ["Mat Marquis"],
  "notes": [{
    "name": "Spec",
    "href": "http://picture.responsiveimages.org/#parse-sizes-attr"
    },{
    "name": "Usage Details",
    "href": "http://ericportis.com/posts/2014/srcset-sizes/"
    }]
}
!*/
/* DOC
Test for the `sizes` attribute on images
*/

  Modernizr.addAsyncTest(function() {
    var width1, width2, test;
    var image = createElement('img');
    // in a perfect world this would be the test...
    var isSizes = 'sizes' in image;

    // ... but we need to deal with Safari 9...
    if (!isSizes && ('srcset' in  image)) {
      width2 = 'data:image/gif;base64,R0lGODlhAgABAPAAAP///wAAACH5BAAAAAAALAAAAAACAAEAAAICBAoAOw==';
      width1 = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

      test = function() {
        addTest('sizes', image.width == 2);
      };

      image.onload = test;
      image.onerror = test;
      image.setAttribute('sizes', '9px');

      image.srcset = width1 + ' 1w,' + width2 + ' 8w';
      image.src = width1;
    } else {
      addTest('sizes', isSizes);
    }
  });

/*!
{
  "name": "srcset attribute",
  "property": "srcset",
  "tags": ["image"],
  "notes": [{
    "name": "Smashing Magazine Article",
    "href": "https://en.wikipedia.org/wiki/APNG"
    },{
    "name": "Generate multi-resolution images for srcset with Grunt",
    "href": "https://addyosmani.com/blog/generate-multi-resolution-images-for-srcset-with-grunt/"
    }]
}
!*/
/* DOC
Test for the srcset attribute of images
*/

  Modernizr.addTest('srcset', 'srcset' in createElement('img'));

/*!
{
  "name": "JSON",
  "property": "json",
  "caniuse": "json",
  "notes": [{
    "name": "MDN documentation",
    "href": "https://developer.mozilla.org/en-US/docs/Glossary/JSON"
  }],
  "polyfills": ["json2"]
}
!*/
/* DOC
Detects native support for JSON handling functions.
*/

  // this will also succeed if you've loaded the JSON2.js polyfill ahead of time
  //   ... but that should be obvious. :)

  Modernizr.addTest('json', 'JSON' in window && 'parse' in JSON && 'stringify' in JSON);

/*!
{
  "name": "XHR responseType",
  "property": "xhrresponsetype",
  "tags": ["network"],
  "notes": [{
    "name": "XMLHttpRequest Living Standard",
    "href": "https://xhr.spec.whatwg.org/#the-responsetype-attribute"
  }]
}
!*/
/* DOC
Tests for XMLHttpRequest xhr.responseType.
*/

  Modernizr.addTest('xhrresponsetype', (function() {
    if (typeof XMLHttpRequest == 'undefined') {
      return false;
    }
    var xhr = new XMLHttpRequest();
    xhr.open('get', '/', true);
    return 'response' in xhr;
  }()));


  /**
   * http://mathiasbynens.be/notes/xhr-responsetype-json#comment-4
   *
   * @access private
   * @function testXhrType
   * @param {string} type - String name of the XHR type you want to detect
   * @returns {boolean}
   * @author Mathias Bynens
   */

  /* istanbul ignore next */
  var testXhrType = function(type) {
    if (typeof XMLHttpRequest == 'undefined') {
      return false;
    }
    var xhr = new XMLHttpRequest();
    xhr.open('get', '/', true);
    try {
      xhr.responseType = type;
    } catch (error) {
      return false;
    }
    return 'response' in xhr && xhr.responseType == type;
  };

  
/*!
{
  "name": "XHR responseType='arraybuffer'",
  "property": "xhrresponsetypearraybuffer",
  "tags": ["network"],
  "notes": [{
    "name": "XMLHttpRequest Living Standard",
    "href": "https://xhr.spec.whatwg.org/#the-responsetype-attribute"
  }]
}
!*/
/* DOC
Tests for XMLHttpRequest xhr.responseType='arraybuffer'.
*/

  Modernizr.addTest('xhrresponsetypearraybuffer', testXhrType('arraybuffer'));

/*!
{
  "name": "XHR responseType='blob'",
  "property": "xhrresponsetypeblob",
  "tags": ["network"],
  "notes": [{
    "name": "XMLHttpRequest Living Standard",
    "href": "https://xhr.spec.whatwg.org/#the-responsetype-attribute"
  }]
}
!*/
/* DOC
Tests for XMLHttpRequest xhr.responseType='blob'.
*/

  Modernizr.addTest('xhrresponsetypeblob', testXhrType('blob'));

/*!
{
  "name": "XML HTTP Request Level 2 XHR2",
  "property": "xhr2",
  "tags": ["network"],
  "builderAliases": ["network_xhr2"],
  "notes": [{
    "name": "W3 Spec",
    "href": "https://www.w3.org/TR/XMLHttpRequest2/"
  },{
    "name": "Details on Related Github Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/385"
  }]
}
!*/
/* DOC
Tests for XHR2.
*/

  // all three of these details report consistently across all target browsers:
  //   !!(window.ProgressEvent);
  //   'XMLHttpRequest' in window && 'withCredentials' in new XMLHttpRequest
  Modernizr.addTest('xhr2', 'XMLHttpRequest' in window && 'withCredentials' in new XMLHttpRequest());

/*!
{
  "name": "Page Visibility API",
  "property": "pagevisibility",
  "caniuse": "pagevisibility",
  "tags": ["performance"],
  "notes": [{
    "name": "MDN documentation",
    "href": "https://developer.mozilla.org/en-US/docs/DOM/Using_the_Page_Visibility_API"
  },{
    "name": "W3C spec",
    "href": "https://www.w3.org/TR/2011/WD-page-visibility-20110602/"
  },{
    "name": "HTML5 Rocks tutorial",
    "href": "http://www.html5rocks.com/en/tutorials/pagevisibility/intro/"
  }],
  "polyfills": ["visibilityjs", "visiblyjs", "jquery-visibility"]
}
!*/
/* DOC
Detects support for the Page Visibility API, which can be used to disable unnecessary actions and otherwise improve user experience.
*/

  Modernizr.addTest('pagevisibility', !!prefixed('hidden', document, false));

/*!
{
  "name": "Navigation Timing API",
  "property": "performance",
  "caniuse": "nav-timing",
  "tags": ["performance"],
  "authors": ["Scott Murphy (@uxder)"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/navigation-timing/"
  },{
    "name": "HTML5 Rocks article",
    "href": "http://www.html5rocks.com/en/tutorials/webperformance/basics/"
  }],
  "polyfills": ["perfnow"]
}
!*/
/* DOC
Detects support for the Navigation Timing API, for measuring browser and connection performance.
*/

  Modernizr.addTest('performance', !!prefixed('performance', window));

/*!
{
  "name": "DOM Pointer Events API",
  "property": "pointerevents",
  "tags": ["input"],
  "authors": ["Stu Cox"],
  "notes": [
    {
      "name": "W3C Pointer Events",
      "href": "https://www.w3.org/TR/pointerevents/"
    },{
      "name": "W3C Pointer Events Level 2",
      "href": "https://www.w3.org/TR/pointerevents2/"
    },{
    "name": "MDN documentation",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent"
  }],
  "warnings": ["This property name now refers to W3C DOM PointerEvents: https://github.com/Modernizr/Modernizr/issues/548#issuecomment-12812099"],
  "polyfills": ["pep"]
}
!*/
/* DOC
Detects support for the DOM Pointer Events API, which provides a unified event interface for pointing input devices, as implemented in IE10+, Edge and Blink.
*/

  // **Test name hijacked!**
  // Now refers to W3C DOM PointerEvents spec rather than the CSS pointer-events property.
  Modernizr.addTest('pointerevents', function() {
    // Cannot use `.prefixed()` for events, so test each prefix
    var bool = false,
      i = domPrefixes.length;

    // Don't forget un-prefixed...
    bool = Modernizr.hasEvent('pointerdown');

    while (i-- && !bool) {
      if (hasEvent(domPrefixes[i] + 'pointerdown')) {
        bool = true;
      }
    }
    return bool;
  });

/*!
{
  "name": "postMessage",
  "property": "postmessage",
  "caniuse": "x-doc-messaging",
  "notes": [{
    "name": "W3C Spec",
    "href": "http://www.w3.org/TR/html5/comms.html#posting-messages"
  }],
  "polyfills": ["easyxdm", "postmessage-jquery"]
}
!*/
/* DOC
Detects support for the `window.postMessage` protocol for cross-document messaging.
*/

  Modernizr.addTest('postmessage', 'postMessage' in window);

/*!
{
  "name": "QuerySelector",
  "property": "queryselector",
  "caniuse": "queryselector",
  "tags": ["queryselector"],
  "authors": ["Andrew Betts (@triblondon)"],
  "notes": [{
    "name" : "W3C Selectors reference",
    "href": "https://www.w3.org/TR/selectors-api/#queryselectorall"
  }],
  "polyfills": ["css-selector-engine"]
}
!*/
/* DOC
Detects support for querySelector.
*/

  Modernizr.addTest('queryselector', 'querySelector' in document && 'querySelectorAll' in document);

/*!
{
  "name": "requestAnimationFrame",
  "property": "requestanimationframe",
  "aliases": ["raf"],
  "caniuse": "requestanimationframe",
  "tags": ["animation"],
  "authors": ["Addy Osmani"],
  "notes": [{
    "name": "W3C spec",
    "href": "https://www.w3.org/TR/animation-timing/"
  }],
  "polyfills": ["raf"]
}
!*/
/* DOC
Detects support for the `window.requestAnimationFrame` API, for offloading animation repainting to the browser for optimized performance.
*/

  Modernizr.addTest('requestanimationframe', !!prefixed('requestAnimationFrame', window), {aliases: ['raf']});

/*!
{
  "name": "script[async]",
  "property": "scriptasync",
  "caniuse": "script-async",
  "tags": ["script"],
  "builderAliases": ["script_async"],
  "authors": ["Theodoor van Donge"]
}
!*/
/* DOC
Detects support for the `async` attribute on the `<script>` element.
*/

  Modernizr.addTest('scriptasync', 'async' in createElement('script'));

/*!
{
  "name": "script[defer]",
  "property": "scriptdefer",
  "caniuse": "script-defer",
  "tags": ["script"],
  "builderAliases": ["script_defer"],
  "authors": ["Theodoor van Donge"],
  "warnings": ["Browser implementation of the `defer` attribute vary: https://stackoverflow.com/questions/3952009/defer-attribute-chrome#answer-3982619"],
  "knownBugs": ["False positive in Opera 12"]
}
!*/
/* DOC
Detects support for the `defer` attribute on the `<script>` element.
*/

  Modernizr.addTest('scriptdefer', 'defer' in createElement('script'));

/*!
{
  "name": "SVG",
  "property": "svg",
  "caniuse": "svg",
  "tags": ["svg"],
  "authors": ["Erik Dahlstrom"],
  "polyfills": [
    "svgweb",
    "raphael",
    "amplesdk",
    "canvg",
    "svg-boilerplate",
    "sie",
    "dojogfx",
    "fabricjs"
  ]
}
!*/
/* DOC
Detects support for SVG in `<embed>` or `<object>` elements.
*/

  Modernizr.addTest('svg', !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect);

/*!
{
  "name": "SVG as an <img> tag source",
  "property": "svgasimg",
  "caniuse" : "svg-img",
  "tags": ["svg"],
  "aliases": ["svgincss"],
  "authors": ["Chris Coyier"],
  "notes": [{
    "name": "HTML5 Spec",
    "href": "http://www.w3.org/TR/html5/embedded-content-0.html#the-img-element"
  }]
}
!*/


  // Original Async test by Stu Cox
  // https://gist.github.com/chriscoyier/8774501

  // Now a Sync test based on good results here
  // http://codepen.io/chriscoyier/pen/bADFx

  // Note http://www.w3.org/TR/SVG11/feature#Image is *supposed* to represent
  // support for the `<image>` tag in SVG, not an SVG file linked from an `<img>`
  // tag in HTML – but it’s a heuristic which works
  Modernizr.addTest('svgasimg', document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Image', '1.1'));


  /**
   * Object.prototype.toString can be used with every object and allows you to
   * get its class easily. Abstracting it off of an object prevents situations
   * where the toString property has been overridden
   *
   * @access private
   * @function toStringFn
   * @returns {function} An abstracted toString function
   */

  var toStringFn = ({}).toString;
  
/*!
{
  "name": "SVG clip paths",
  "property": "svgclippaths",
  "tags": ["svg"],
  "notes": [{
    "name": "Demo",
    "href": "http://srufaculty.sru.edu/david.dailey/svg/newstuff/clipPath4.svg"
  }]
}
!*/
/* DOC
Detects support for clip paths in SVG (only, not on HTML content).

See [this discussion](https://github.com/Modernizr/Modernizr/issues/213) regarding applying SVG clip paths to HTML content.
*/

  Modernizr.addTest('svgclippaths', function() {
    return !!document.createElementNS &&
      /SVGClipPath/.test(toStringFn.call(document.createElementNS('http://www.w3.org/2000/svg', 'clipPath')));
  });

/*!
{
  "name": "SVG filters",
  "property": "svgfilters",
  "caniuse": "svg-filters",
  "tags": ["svg"],
  "builderAliases": ["svg_filters"],
  "authors": ["Erik Dahlstrom"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/SVG11/filters.html"
  }]
}
!*/

  // Should fail in Safari: https://stackoverflow.com/questions/9739955/feature-detecting-support-for-svg-filters.
  Modernizr.addTest('svgfilters', function() {
    var result = false;
    try {
      result = 'SVGFEColorMatrixElement' in window &&
        SVGFEColorMatrixElement.SVG_FECOLORMATRIX_TYPE_SATURATE == 2;
    }
    catch (e) {}
    return result;
  });

/*!
{
  "name": "SVG foreignObject",
  "property": "svgforeignobject",
  "tags": ["svg"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/SVG11/extend.html"
  }]
}
!*/
/* DOC
Detects support for foreignObject tag in SVG.
*/

  Modernizr.addTest('svgforeignobject', function() {
    return !!document.createElementNS &&
      /SVGForeignObject/.test(toStringFn.call(document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')));
  });

/*!
{
  "name": "Inline SVG",
  "property": "inlinesvg",
  "caniuse": "svg-html5",
  "tags": ["svg"],
  "notes": [{
    "name": "Test page",
    "href": "https://paulirish.com/demo/inline-svg"
  }, {
    "name": "Test page and results",
    "href": "https://codepen.io/eltonmesquita/full/GgXbvo/"
  }],
  "polyfills": ["inline-svg-polyfill"],
  "knownBugs": ["False negative on some Chromia browsers."]
}
!*/
/* DOC
Detects support for inline SVG in HTML (not within XHTML).
*/

  Modernizr.addTest('inlinesvg', function() {
    var div = createElement('div');
    div.innerHTML = '<svg/>';
    return (typeof SVGRect != 'undefined' && div.firstChild && div.firstChild.namespaceURI) == 'http://www.w3.org/2000/svg';
  });

/*!
{
  "name": "SVG SMIL animation",
  "property": "smil",
  "caniuse": "svg-smil",
  "tags": ["svg"],
  "notes": [{
  "name": "W3C Synchronised Multimedia spec",
  "href": "https://www.w3.org/AudioVideo/"
  }]
}
!*/

  // SVG SMIL animation
  Modernizr.addTest('smil', function() {
    return !!document.createElementNS &&
      /SVGAnimate/.test(toStringFn.call(document.createElementNS('http://www.w3.org/2000/svg', 'animate')));
  });

/*!
{
  "name": "Template strings",
  "property": "templatestrings",
  "notes": [{
    "name": "MDN Reference",
    "href": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/template_strings#Browser_compatibility"
  }]
}
!*/
/* DOC
Template strings are string literals allowing embedded expressions.
*/

  Modernizr.addTest('templatestrings', function() {
    var supports;
    try {
      // A number of tools, including uglifyjs and require, break on a raw "`", so
      // use an eval to get around that.
      // eslint-disable-next-line
      eval('``');
      supports = true;
    } catch (e) {}
    return !!supports;
  });

/*!
{
  "name": "Blob URLs",
  "property": "bloburls",
  "caniuse": "bloburls",
  "notes": [{
    "name": "W3C Working Draft",
    "href": "https://www.w3.org/TR/FileAPI/#creating-revoking"
  }],
  "tags": ["file", "url"],
  "authors": ["Ron Waldon (@jokeyrhyme)"]
}
!*/
/* DOC
Detects support for creating Blob URLs
*/

  var url = prefixed('URL', window, false);
  url = url && window[url];
  Modernizr.addTest('bloburls', url && 'revokeObjectURL' in url && 'createObjectURL' in url);

/*!
{
  "name": "Data URI",
  "property": "datauri",
  "caniuse": "datauri",
  "tags": ["url"],
  "builderAliases": ["url_data_uri"],
  "async": true,
  "notes": [{
    "name": "Wikipedia article",
    "href": "https://en.wikipedia.org/wiki/Data_URI_scheme"
  }],
  "warnings": ["Support in Internet Explorer 8 is limited to images and linked resources like CSS files, not HTML files"]
}
!*/
/* DOC
Detects support for data URIs. Provides a subproperty to report support for data URIs over 32kb in size:

```javascript
Modernizr.datauri           // true
Modernizr.datauri.over32kb  // false in IE8
```
*/

  // https://github.com/Modernizr/Modernizr/issues/14
  Modernizr.addAsyncTest(function() {

    // IE7 throw a mixed content warning on HTTPS for this test, so we'll
    // just blacklist it (we know it doesn't support data URIs anyway)
    // https://github.com/Modernizr/Modernizr/issues/362
    if (navigator.userAgent.indexOf('MSIE 7.') !== -1) {
      // Keep the test async
      setTimeout(function() {
        addTest('datauri', false);
      }, 10);
    }

    var datauri = new Image();

    datauri.onerror = function() {
      addTest('datauri', false);
    };
    datauri.onload = function() {
      if (datauri.width == 1 && datauri.height == 1) {
        testOver32kb();
      }
      else {
        addTest('datauri', false);
      }
    };

    datauri.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

    // Once we have datauri, let's check to see if we can use data URIs over
    // 32kb (IE8 can't). https://github.com/Modernizr/Modernizr/issues/321
    function testOver32kb() {

      var datauriBig = new Image();

      datauriBig.onerror = function() {
        addTest('datauri', true);
        Modernizr.datauri = new Boolean(true);
        Modernizr.datauri.over32kb = false;
      };
      datauriBig.onload = function() {
        addTest('datauri', true);
        Modernizr.datauri = new Boolean(true);
        Modernizr.datauri.over32kb = (datauriBig.width == 1 && datauriBig.height == 1);
      };

      var base64str = 'R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
      while (base64str.length < 33000) {
        base64str = '\r\n' + base64str;
      }
      datauriBig.src = 'data:image/gif;base64,' + base64str;
    }

  });

/*!
{
  "name": "HTML5 Video",
  "property": "video",
  "caniuse": "video",
  "tags": ["html5"],
  "knownBugs": [
    "Without QuickTime, `Modernizr.video.h264` will be `undefined`; https://github.com/Modernizr/Modernizr/issues/546"
  ],
  "polyfills": [
    "html5media",
    "mediaelementjs",
    "sublimevideo",
    "videojs",
    "leanbackplayer",
    "videoforeverybody"
  ]
}
!*/
/* DOC
Detects support for the video element, as well as testing what types of content it supports.

Subproperties are provided to describe support for `ogg`, `h264` and `webm` formats, e.g.:

```javascript
Modernizr.video         // true
Modernizr.video.ogg     // 'probably'
```
*/

  // Codec values from : github.com/NielsLeenheer/html5test/blob/9106a8/index.html#L845
  //                     thx to NielsLeenheer and zcorpan

  // Note: in some older browsers, "no" was a return value instead of empty string.
  //   It was live in FF3.5.0 and 3.5.1, but fixed in 3.5.2
  //   It was also live in Safari 4.0.0 - 4.0.4, but fixed in 4.0.5

  Modernizr.addTest('video', function() {
    var elem = createElement('video');
    var bool = false;

    // IE9 Running on Windows Server SKU can cause an exception to be thrown, bug #224
    try {
      bool = !!elem.canPlayType
      if (bool) {
        bool = new Boolean(bool);
        bool.ogg = elem.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, '');

        // Without QuickTime, this value will be `undefined`. github.com/Modernizr/Modernizr/issues/546
        bool.h264 = elem.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, '');

        bool.webm = elem.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, '');

        bool.vp9 = elem.canPlayType('video/webm; codecs="vp9"').replace(/^no$/, '');

        bool.hls = elem.canPlayType('application/x-mpegURL; codecs="avc1.42E01E"').replace(/^no$/, '');
      }
    } catch (e) {}

    return bool;
  });

/*!
{
  "name": "Video Autoplay",
  "property": "videoautoplay",
  "tags": ["video"],
  "async" : true,
  "warnings": ["This test is very large – only include it if you absolutely need it"],
  "knownBugs": ["crashes with an alert on iOS7 when added to homescreen"]
}
!*/
/* DOC
Checks for support of the autoplay attribute of the video element.
*/


  Modernizr.addAsyncTest(function() {
    var timeout;
    var waitTime = 200;
    var retries = 5;
    var currentTry = 0;
    var elem = createElement('video');
    var elemStyle = elem.style;

    function testAutoplay(arg) {
      currentTry++;
      clearTimeout(timeout);

      var result = arg && arg.type === 'playing' || elem.currentTime !== 0;

      if (!result && currentTry < retries) {
        //Detection can be flaky if the browser is slow, so lets retry in a little bit
        timeout = setTimeout(testAutoplay, waitTime);
        return;
      }

      elem.removeEventListener('playing', testAutoplay, false);
      addTest('videoautoplay', result);

      // Cleanup, but don't assume elem is still in the page -
      // an extension (eg Flashblock) may already have removed it.
      if (elem.parentNode) {
        elem.parentNode.removeChild(elem);
      }
    }

    //skip the test if video itself, or the autoplay
    //element on it isn't supported
    if (!Modernizr.video || !('autoplay' in elem)) {
      addTest('videoautoplay', false);
      return;
    }

    elemStyle.position = 'absolute';
    elemStyle.height = 0;
    elemStyle.width = 0;

    try {
      if (Modernizr.video.ogg) {
        elem.src = 'data:video/ogg;base64,T2dnUwACAAAAAAAAAABmnCATAAAAAHDEixYBKoB0aGVvcmEDAgEAAQABAAAQAAAQAAAAAAAFAAAAAQAAAAAAAAAAAGIAYE9nZ1MAAAAAAAAAAAAAZpwgEwEAAAACrA7TDlj///////////////+QgXRoZW9yYSsAAABYaXBoLk9yZyBsaWJ0aGVvcmEgMS4xIDIwMDkwODIyIChUaHVzbmVsZGEpAQAAABoAAABFTkNPREVSPWZmbXBlZzJ0aGVvcmEtMC4yOYJ0aGVvcmG+zSj3uc1rGLWpSUoQc5zmMYxSlKQhCDGMYhCEIQhAAAAAAAAAAAAAEW2uU2eSyPxWEvx4OVts5ir1aKtUKBMpJFoQ/nk5m41mUwl4slUpk4kkghkIfDwdjgajQYC8VioUCQRiIQh8PBwMhgLBQIg4FRba5TZ5LI/FYS/Hg5W2zmKvVoq1QoEykkWhD+eTmbjWZTCXiyVSmTiSSCGQh8PB2OBqNBgLxWKhQJBGIhCHw8HAyGAsFAiDgUCw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDAwPEhQUFQ0NDhESFRUUDg4PEhQVFRUOEBETFBUVFRARFBUVFRUVEhMUFRUVFRUUFRUVFRUVFRUVFRUVFRUVEAwLEBQZGxwNDQ4SFRwcGw4NEBQZHBwcDhATFhsdHRwRExkcHB4eHRQYGxwdHh4dGxwdHR4eHh4dHR0dHh4eHRALChAYKDM9DAwOExo6PDcODRAYKDlFOA4RFh0zV1A+EhYlOkRtZ00YIzdAUWhxXDFATldneXhlSFxfYnBkZ2MTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTEhIVGRoaGhoSFBYaGhoaGhUWGRoaGhoaGRoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhESFh8kJCQkEhQYIiQkJCQWGCEkJCQkJB8iJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQREhgvY2NjYxIVGkJjY2NjGBo4Y2NjY2MvQmNjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRISEhUXGBkbEhIVFxgZGxwSFRcYGRscHRUXGBkbHB0dFxgZGxwdHR0YGRscHR0dHhkbHB0dHR4eGxwdHR0eHh4REREUFxocIBERFBcaHCAiERQXGhwgIiUUFxocICIlJRcaHCAiJSUlGhwgIiUlJSkcICIlJSUpKiAiJSUlKSoqEBAQFBgcICgQEBQYHCAoMBAUGBwgKDBAFBgcICgwQEAYHCAoMEBAQBwgKDBAQEBgICgwQEBAYIAoMEBAQGCAgAfF5cdH1e3Ow/L66wGmYnfIUbwdUTe3LMRbqON8B+5RJEvcGxkvrVUjTMrsXYhAnIwe0dTJfOYbWrDYyqUrz7dw/JO4hpmV2LsQQvkUeGq1BsZLx+cu5iV0e0eScJ91VIQYrmqfdVSK7GgjOU0oPaPOu5IcDK1mNvnD+K8LwS87f8Jx2mHtHnUkTGAurWZlNQa74ZLSFH9oF6FPGxzLsjQO5Qe0edcpttd7BXBSqMCL4k/4tFrHIPuEQ7m1/uIWkbDMWVoDdOSuRQ9286kvVUlQjzOE6VrNguN4oRXYGkgcnih7t13/9kxvLYKQezwLTrO44sVmMPgMqORo1E0sm1/9SludkcWHwfJwTSybR4LeAz6ugWVgRaY8mV/9SluQmtHrzsBtRF/wPY+X0JuYTs+ltgrXAmlk10xQHmTu9VSIAk1+vcvU4ml2oNzrNhEtQ3CysNP8UeR35wqpKUBdGdZMSjX4WVi8nJpdpHnbhzEIdx7mwf6W1FKAiucMXrWUWVjyRf23chNtR9mIzDoT/6ZLYailAjhFlZuvPtSeZ+2oREubDoWmT3TguY+JHPdRVSLKxfKH3vgNqJ/9emeEYikGXDFNzaLjvTeGAL61mogOoeG3y6oU4rW55ydoj0lUTSR/mmRhPmF86uwIfzp3FtiufQCmppaHDlGE0r2iTzXIw3zBq5hvaTldjG4CPb9wdxAme0SyedVKczJ9AtYbgPOzYKJvZZImsN7ecrxWZg5dR6ZLj/j4qpWsIA+vYwE+Tca9ounMIsrXMB4Stiib2SPQtZv+FVIpfEbzv8ncZoLBXc3YBqTG1HsskTTotZOYTG+oVUjLk6zhP8bg4RhMUNtfZdO7FdpBuXzhJ5Fh8IKlJG7wtD9ik8rWOJxy6iQ3NwzBpQ219mlyv+FLicYs2iJGSE0u2txzed++D61ZWCiHD/cZdQVCqkO2gJpdpNaObhnDfAPrT89RxdWFZ5hO3MseBSIlANppdZNIV/Rwe5eLTDvkfWKzFnH+QJ7m9QWV1KdwnuIwTNtZdJMoXBf74OhRnh2t+OTGL+AVUnIkyYY+QG7g9itHXyF3OIygG2s2kud679ZWKqSFa9n3IHD6MeLv1lZ0XyduRhiDRtrNnKoyiFVLcBm0ba5Yy3fQkDh4XsFE34isVpOzpa9nR8iCpS4HoxG2rJpnRhf3YboVa1PcRouh5LIJv/uQcPNd095ickTaiGBnWLKVWRc0OnYTSyex/n2FofEPnDG8y3PztHrzOLK1xo6RAml2k9owKajOC0Wr4D5x+3nA0UEhK2m198wuBHF3zlWWVKWLN1CHzLClUfuoYBcx4b1llpeBKmbayaR58njtE9onD66lUcsg0Spm2snsb+8HaJRn4dYcLbCuBuYwziB8/5U1C1DOOz2gZjSZtrLJk6vrLF3hwY4Io9xuT/ruUFRSBkNtUzTOWhjh26irLEPx4jPZL3Fo3QrReoGTTM21xYTT9oFdhTUIvjqTkfkvt0bzgVUjq/hOYY8j60IaO/0AzRBtqkTS6R5ellZd5uKdzzhb8BFlDdAcrwkE0rbXTOPB+7Y0FlZO96qFL4Ykg21StJs8qIW7h16H5hGiv8V2Cflau7QVDepTAHa6Lgt6feiEvJDM21StJsmOH/hynURrKxvUpQ8BH0JF7BiyG2qZpnL/7AOU66gt+reLEXY8pVOCQvSsBtqZTNM8bk9ohRcwD18o/WVkbvrceVKRb9I59IEKysjBeTMmmbA21xu/6iHadLRxuIzkLpi8wZYmmbbWi32RVAUjruxWlJ//iFxE38FI9hNKOoCdhwf5fDe4xZ81lgREhK2m1j78vW1CqkuMu/AjBNK210kzRUX/B+69cMMUG5bYrIeZxVSEZISmkzbXOi9yxwIfPgdsov7R71xuJ7rFcACjG/9PzApqFq7wEgzNJm2suWESPuwrQvejj7cbnQxMkxpm21lUYJL0fKmogPPqywn7e3FvB/FCNxPJ85iVUkCE9/tLKx31G4CgNtWTTPFhMvlu8G4/TrgaZttTChljfNJGgOT2X6EqpETy2tYd9cCBI4lIXJ1/3uVUllZEJz4baqGF64yxaZ+zPLYwde8Uqn1oKANtUrSaTOPHkhvuQP3bBlEJ/LFe4pqQOHUI8T8q7AXx3fLVBgSCVpMba55YxN3rv8U1Dv51bAPSOLlZWebkL8vSMGI21lJmmeVxPRwFlZF1CpqCN8uLwymaZyjbXHCRytogPN3o/n74CNykfT+qqRv5AQlHcRxYrC5KvGmbbUwmZY/29BvF6C1/93x4WVglXDLFpmbapmF89HKTogRwqqSlGbu+oiAkcWFbklC6Zhf+NtTLFpn8oWz+HsNRVSgIxZWON+yVyJlE5tq/+GWLTMutYX9ekTySEQPLVNQQ3OfycwJBM0zNtZcse7CvcKI0V/zh16Dr9OSA21MpmmcrHC+6pTAPHPwoit3LHHqs7jhFNRD6W8+EBGoSEoaZttTCZljfduH/fFisn+dRBGAZYtMzbVMwvul/T/crK1NQh8gN0SRRa9cOux6clC0/mDLFpmbarmF8/e6CopeOLCNW6S/IUUg3jJIYiAcDoMcGeRbOvuTPjXR/tyo79LK3kqqkbxkkMRAOB0GODPItnX3Jnxro/25Ud+llbyVVSN4ySGIgHA6DHBnkWzr7kz410f7cqO/Syt5KqpFVJwn6gBEvBM0zNtZcpGOEPiysW8vvRd2R0f7gtjhqUvXL+gWVwHm4XJDBiMpmmZtrLfPwd/IugP5+fKVSysH1EXreFAcEhelGmbbUmZY4Xdo1vQWVnK19P4RuEnbf0gQnR+lDCZlivNM22t1ESmopPIgfT0duOfQrsjgG4tPxli0zJmF5trdL1JDUIUT1ZXSqQDeR4B8mX3TrRro/2McGeUvLtwo6jIEKMkCUXWsLyZROd9P/rFYNtXPBli0z398iVUlVKAjFlY437JXImUTm2r/4ZYtMy61hf16RPJIU9nZ1MABAwAAAAAAAAAZpwgEwIAAABhp658BScAAAAAAADnUFBQXIDGXLhwtttNHDhw5OcpQRMETBEwRPduylKVB0HRdF0A';
      }
      else if (Modernizr.video.h264) {
        elem.src = 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAs1tZGF0AAACrgYF//+q3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE0OCByMjYwMSBhMGNkN2QzIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxNSAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTMgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MzoweDExMyBtZT1oZXggc3VibWU9NyBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0xIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MSA4eDhkY3Q9MSBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0tMiB0aHJlYWRzPTEgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0zIGJfcHlyYW1pZD0yIGJfYWRhcHQ9MSBiX2JpYXM9MCBkaXJlY3Q9MSB3ZWlnaHRiPTEgb3Blbl9nb3A9MCB3ZWlnaHRwPTIga2V5aW50PTI1MCBrZXlpbnRfbWluPTEwIHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NDAgcmM9Y3JmIG1idHJlZT0xIGNyZj0yMy4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1heD02OSBxcHN0ZXA9NCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAD2WIhAA3//728P4FNjuZQQAAAu5tb292AAAAbG12aGQAAAAAAAAAAAAAAAAAAAPoAAAAZAABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAACGHRyYWsAAABcdGtoZAAAAAMAAAAAAAAAAAAAAAEAAAAAAAAAZAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAgAAAAIAAAAAACRlZHRzAAAAHGVsc3QAAAAAAAAAAQAAAGQAAAAAAAEAAAAAAZBtZGlhAAAAIG1kaGQAAAAAAAAAAAAAAAAAACgAAAAEAFXEAAAAAAAtaGRscgAAAAAAAAAAdmlkZQAAAAAAAAAAAAAAAFZpZGVvSGFuZGxlcgAAAAE7bWluZgAAABR2bWhkAAAAAQAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAAA+3N0YmwAAACXc3RzZAAAAAAAAAABAAAAh2F2YzEAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAgACAEgAAABIAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY//8AAAAxYXZjQwFkAAr/4QAYZ2QACqzZX4iIhAAAAwAEAAADAFA8SJZYAQAGaOvjyyLAAAAAGHN0dHMAAAAAAAAAAQAAAAEAAAQAAAAAHHN0c2MAAAAAAAAAAQAAAAEAAAABAAAAAQAAABRzdHN6AAAAAAAAAsUAAAABAAAAFHN0Y28AAAAAAAAAAQAAADAAAABidWR0YQAAAFptZXRhAAAAAAAAACFoZGxyAAAAAAAAAABtZGlyYXBwbAAAAAAAAAAAAAAAAC1pbHN0AAAAJal0b28AAAAdZGF0YQAAAAEAAAAATGF2ZjU2LjQwLjEwMQ==';
      }
      else {
        addTest('videoautoplay', false);
        return;
      }
    }

    catch (e) {
      addTest('videoautoplay', false);
      return;
    }

    elem.setAttribute('autoplay', '');
    elemStyle.cssText = 'display:none';
    docElement.appendChild(elem);
    // wait for the next tick to add the listener, otherwise the element may
    // not have time to play in high load situations (e.g. the test suite)
    setTimeout(function() {
      elem.addEventListener('playing', testAutoplay, false);
      timeout = setTimeout(testAutoplay, waitTime);
    }, 0);
  });

/*!
{
  "name": "Video Loop Attribute",
  "property": "videoloop",
  "tags": ["video", "media"]
}
!*/

  Modernizr.addTest('videoloop', 'loop' in createElement('video'));

/*!
{
  "name": "Video Preload Attribute",
  "property": "videopreload",
  "tags": ["video", "media"]
}
!*/

  Modernizr.addTest('videopreload', 'preload' in createElement('video'));


  // Run each test
  testRunner();

  delete ModernizrProto.addTest;
  delete ModernizrProto.addAsyncTest;

  // Run the things that are supposed to run after the tests
  for (var i = 0; i < Modernizr._q.length; i++) {
    Modernizr._q[i]();
  }

  // Leak Modernizr namespace
  window.Modernizr = Modernizr;


;

})(window, document);
},{}],"underscore.string":[function(require,module,exports){
/*
* Underscore.string
* (c) 2010 Esa-Matti Suuronen <esa-matti aet suuronen dot org>
* Underscore.string is freely distributable under the terms of the MIT license.
* Documentation: https://github.com/epeli/underscore.string
* Some code is borrowed from MooTools and Alexandru Marasteanu.
* Version '3.3.4'
* @preserve
*/

'use strict';

function s(value) {
  /* jshint validthis: true */
  if (!(this instanceof s)) return new s(value);
  this._wrapped = value;
}

s.VERSION = '3.3.4';

s.isBlank          = require('./isBlank');
s.stripTags        = require('./stripTags');
s.capitalize       = require('./capitalize');
s.decapitalize     = require('./decapitalize');
s.chop             = require('./chop');
s.trim             = require('./trim');
s.clean            = require('./clean');
s.cleanDiacritics  = require('./cleanDiacritics');
s.count            = require('./count');
s.chars            = require('./chars');
s.swapCase         = require('./swapCase');
s.escapeHTML       = require('./escapeHTML');
s.unescapeHTML     = require('./unescapeHTML');
s.splice           = require('./splice');
s.insert           = require('./insert');
s.replaceAll       = require('./replaceAll');
s.include          = require('./include');
s.join             = require('./join');
s.lines            = require('./lines');
s.dedent           = require('./dedent');
s.reverse          = require('./reverse');
s.startsWith       = require('./startsWith');
s.endsWith         = require('./endsWith');
s.pred             = require('./pred');
s.succ             = require('./succ');
s.titleize         = require('./titleize');
s.camelize         = require('./camelize');
s.underscored      = require('./underscored');
s.dasherize        = require('./dasherize');
s.classify         = require('./classify');
s.humanize         = require('./humanize');
s.ltrim            = require('./ltrim');
s.rtrim            = require('./rtrim');
s.truncate         = require('./truncate');
s.prune            = require('./prune');
s.words            = require('./words');
s.pad              = require('./pad');
s.lpad             = require('./lpad');
s.rpad             = require('./rpad');
s.lrpad            = require('./lrpad');
s.sprintf          = require('./sprintf');
s.vsprintf         = require('./vsprintf');
s.toNumber         = require('./toNumber');
s.numberFormat     = require('./numberFormat');
s.strRight         = require('./strRight');
s.strRightBack     = require('./strRightBack');
s.strLeft          = require('./strLeft');
s.strLeftBack      = require('./strLeftBack');
s.toSentence       = require('./toSentence');
s.toSentenceSerial = require('./toSentenceSerial');
s.slugify          = require('./slugify');
s.surround         = require('./surround');
s.quote            = require('./quote');
s.unquote          = require('./unquote');
s.repeat           = require('./repeat');
s.naturalCmp       = require('./naturalCmp');
s.levenshtein      = require('./levenshtein');
s.toBoolean        = require('./toBoolean');
s.exports          = require('./exports');
s.escapeRegExp     = require('./helper/escapeRegExp');
s.wrap             = require('./wrap');
s.map              = require('./map');

// Aliases
s.strip     = s.trim;
s.lstrip    = s.ltrim;
s.rstrip    = s.rtrim;
s.center    = s.lrpad;
s.rjust     = s.lpad;
s.ljust     = s.rpad;
s.contains  = s.include;
s.q         = s.quote;
s.toBool    = s.toBoolean;
s.camelcase = s.camelize;
s.mapChars  = s.map;


// Implement chaining
s.prototype = {
  value: function value() {
    return this._wrapped;
  }
};

function fn2method(key, fn) {
  if (typeof fn !== 'function') return;
  s.prototype[key] = function() {
    var args = [this._wrapped].concat(Array.prototype.slice.call(arguments));
    var res = fn.apply(null, args);
    // if the result is non-string stop the chain and return the value
    return typeof res === 'string' ? new s(res) : res;
  };
}

// Copy functions to instance methods for chaining
for (var key in s) fn2method(key, s[key]);

fn2method('tap', function tap(string, fn) {
  return fn(string);
});

function prototype2method(methodName) {
  fn2method(methodName, function(context) {
    var args = Array.prototype.slice.call(arguments, 1);
    return String.prototype[methodName].apply(context, args);
  });
}

var prototypeMethods = [
  'toUpperCase',
  'toLowerCase',
  'split',
  'replace',
  'slice',
  'substring',
  'substr',
  'concat'
];

for (var method in prototypeMethods) prototype2method(prototypeMethods[method]);


module.exports = s;

},{"./camelize":1,"./capitalize":2,"./chars":3,"./chop":4,"./classify":5,"./clean":6,"./cleanDiacritics":7,"./count":8,"./dasherize":9,"./decapitalize":10,"./dedent":11,"./endsWith":12,"./escapeHTML":13,"./exports":14,"./helper/escapeRegExp":18,"./humanize":23,"./include":24,"./insert":25,"./isBlank":26,"./join":27,"./levenshtein":28,"./lines":29,"./lpad":30,"./lrpad":31,"./ltrim":32,"./map":33,"./naturalCmp":34,"./numberFormat":37,"./pad":38,"./pred":39,"./prune":40,"./quote":41,"./repeat":42,"./replaceAll":43,"./reverse":44,"./rpad":45,"./rtrim":46,"./slugify":47,"./splice":48,"./sprintf":49,"./startsWith":50,"./strLeft":51,"./strLeftBack":52,"./strRight":53,"./strRightBack":54,"./stripTags":55,"./succ":56,"./surround":57,"./swapCase":58,"./titleize":59,"./toBoolean":60,"./toNumber":61,"./toSentence":62,"./toSentenceSerial":63,"./trim":64,"./truncate":65,"./underscored":66,"./unescapeHTML":67,"./unquote":68,"./vsprintf":69,"./words":70,"./wrap":71}]},{},["modernizr-dist","Modernizr"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvdW5kZXJzY29yZS5zdHJpbmcvY2FtZWxpemUuanMiLCJub2RlX21vZHVsZXMvdW5kZXJzY29yZS5zdHJpbmcvY2FwaXRhbGl6ZS5qcyIsIm5vZGVfbW9kdWxlcy91bmRlcnNjb3JlLnN0cmluZy9jaGFycy5qcyIsIm5vZGVfbW9kdWxlcy91bmRlcnNjb3JlLnN0cmluZy9jaG9wLmpzIiwibm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUuc3RyaW5nL2NsYXNzaWZ5LmpzIiwibm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUuc3RyaW5nL2NsZWFuLmpzIiwibm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUuc3RyaW5nL2NsZWFuRGlhY3JpdGljcy5qcyIsIm5vZGVfbW9kdWxlcy91bmRlcnNjb3JlLnN0cmluZy9jb3VudC5qcyIsIm5vZGVfbW9kdWxlcy91bmRlcnNjb3JlLnN0cmluZy9kYXNoZXJpemUuanMiLCJub2RlX21vZHVsZXMvdW5kZXJzY29yZS5zdHJpbmcvZGVjYXBpdGFsaXplLmpzIiwibm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUuc3RyaW5nL2RlZGVudC5qcyIsIm5vZGVfbW9kdWxlcy91bmRlcnNjb3JlLnN0cmluZy9lbmRzV2l0aC5qcyIsIm5vZGVfbW9kdWxlcy91bmRlcnNjb3JlLnN0cmluZy9lc2NhcGVIVE1MLmpzIiwibm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUuc3RyaW5nL2V4cG9ydHMuanMiLCJub2RlX21vZHVsZXMvdW5kZXJzY29yZS5zdHJpbmcvaGVscGVyL2FkamFjZW50LmpzIiwibm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUuc3RyaW5nL2hlbHBlci9kZWZhdWx0VG9XaGl0ZVNwYWNlLmpzIiwibm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUuc3RyaW5nL2hlbHBlci9lc2NhcGVDaGFycy5qcyIsIm5vZGVfbW9kdWxlcy91bmRlcnNjb3JlLnN0cmluZy9oZWxwZXIvZXNjYXBlUmVnRXhwLmpzIiwibm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUuc3RyaW5nL2hlbHBlci9odG1sRW50aXRpZXMuanMiLCJub2RlX21vZHVsZXMvdW5kZXJzY29yZS5zdHJpbmcvaGVscGVyL21ha2VTdHJpbmcuanMiLCJub2RlX21vZHVsZXMvdW5kZXJzY29yZS5zdHJpbmcvaGVscGVyL3N0clJlcGVhdC5qcyIsIm5vZGVfbW9kdWxlcy91bmRlcnNjb3JlLnN0cmluZy9oZWxwZXIvdG9Qb3NpdGl2ZS5qcyIsIm5vZGVfbW9kdWxlcy91bmRlcnNjb3JlLnN0cmluZy9odW1hbml6ZS5qcyIsIm5vZGVfbW9kdWxlcy91bmRlcnNjb3JlLnN0cmluZy9pbmNsdWRlLmpzIiwibm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUuc3RyaW5nL2luc2VydC5qcyIsIm5vZGVfbW9kdWxlcy91bmRlcnNjb3JlLnN0cmluZy9pc0JsYW5rLmpzIiwibm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUuc3RyaW5nL2pvaW4uanMiLCJub2RlX21vZHVsZXMvdW5kZXJzY29yZS5zdHJpbmcvbGV2ZW5zaHRlaW4uanMiLCJub2RlX21vZHVsZXMvdW5kZXJzY29yZS5zdHJpbmcvbGluZXMuanMiLCJub2RlX21vZHVsZXMvdW5kZXJzY29yZS5zdHJpbmcvbHBhZC5qcyIsIm5vZGVfbW9kdWxlcy91bmRlcnNjb3JlLnN0cmluZy9scnBhZC5qcyIsIm5vZGVfbW9kdWxlcy91bmRlcnNjb3JlLnN0cmluZy9sdHJpbS5qcyIsIm5vZGVfbW9kdWxlcy91bmRlcnNjb3JlLnN0cmluZy9tYXAuanMiLCJub2RlX21vZHVsZXMvdW5kZXJzY29yZS5zdHJpbmcvbmF0dXJhbENtcC5qcyIsIm5vZGVfbW9kdWxlcy91bmRlcnNjb3JlLnN0cmluZy9ub2RlX21vZHVsZXMvc3ByaW50Zi1qcy9zcmMvc3ByaW50Zi5qcyIsIm5vZGVfbW9kdWxlcy91bmRlcnNjb3JlLnN0cmluZy9ub2RlX21vZHVsZXMvdXRpbC1kZXByZWNhdGUvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy91bmRlcnNjb3JlLnN0cmluZy9udW1iZXJGb3JtYXQuanMiLCJub2RlX21vZHVsZXMvdW5kZXJzY29yZS5zdHJpbmcvcGFkLmpzIiwibm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUuc3RyaW5nL3ByZWQuanMiLCJub2RlX21vZHVsZXMvdW5kZXJzY29yZS5zdHJpbmcvcHJ1bmUuanMiLCJub2RlX21vZHVsZXMvdW5kZXJzY29yZS5zdHJpbmcvcXVvdGUuanMiLCJub2RlX21vZHVsZXMvdW5kZXJzY29yZS5zdHJpbmcvcmVwZWF0LmpzIiwibm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUuc3RyaW5nL3JlcGxhY2VBbGwuanMiLCJub2RlX21vZHVsZXMvdW5kZXJzY29yZS5zdHJpbmcvcmV2ZXJzZS5qcyIsIm5vZGVfbW9kdWxlcy91bmRlcnNjb3JlLnN0cmluZy9ycGFkLmpzIiwibm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUuc3RyaW5nL3J0cmltLmpzIiwibm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUuc3RyaW5nL3NsdWdpZnkuanMiLCJub2RlX21vZHVsZXMvdW5kZXJzY29yZS5zdHJpbmcvc3BsaWNlLmpzIiwibm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUuc3RyaW5nL3NwcmludGYuanMiLCJub2RlX21vZHVsZXMvdW5kZXJzY29yZS5zdHJpbmcvc3RhcnRzV2l0aC5qcyIsIm5vZGVfbW9kdWxlcy91bmRlcnNjb3JlLnN0cmluZy9zdHJMZWZ0LmpzIiwibm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUuc3RyaW5nL3N0ckxlZnRCYWNrLmpzIiwibm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUuc3RyaW5nL3N0clJpZ2h0LmpzIiwibm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUuc3RyaW5nL3N0clJpZ2h0QmFjay5qcyIsIm5vZGVfbW9kdWxlcy91bmRlcnNjb3JlLnN0cmluZy9zdHJpcFRhZ3MuanMiLCJub2RlX21vZHVsZXMvdW5kZXJzY29yZS5zdHJpbmcvc3VjYy5qcyIsIm5vZGVfbW9kdWxlcy91bmRlcnNjb3JlLnN0cmluZy9zdXJyb3VuZC5qcyIsIm5vZGVfbW9kdWxlcy91bmRlcnNjb3JlLnN0cmluZy9zd2FwQ2FzZS5qcyIsIm5vZGVfbW9kdWxlcy91bmRlcnNjb3JlLnN0cmluZy90aXRsZWl6ZS5qcyIsIm5vZGVfbW9kdWxlcy91bmRlcnNjb3JlLnN0cmluZy90b0Jvb2xlYW4uanMiLCJub2RlX21vZHVsZXMvdW5kZXJzY29yZS5zdHJpbmcvdG9OdW1iZXIuanMiLCJub2RlX21vZHVsZXMvdW5kZXJzY29yZS5zdHJpbmcvdG9TZW50ZW5jZS5qcyIsIm5vZGVfbW9kdWxlcy91bmRlcnNjb3JlLnN0cmluZy90b1NlbnRlbmNlU2VyaWFsLmpzIiwibm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUuc3RyaW5nL3RyaW0uanMiLCJub2RlX21vZHVsZXMvdW5kZXJzY29yZS5zdHJpbmcvdHJ1bmNhdGUuanMiLCJub2RlX21vZHVsZXMvdW5kZXJzY29yZS5zdHJpbmcvdW5kZXJzY29yZWQuanMiLCJub2RlX21vZHVsZXMvdW5kZXJzY29yZS5zdHJpbmcvdW5lc2NhcGVIVE1MLmpzIiwibm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUuc3RyaW5nL3VucXVvdGUuanMiLCJub2RlX21vZHVsZXMvdW5kZXJzY29yZS5zdHJpbmcvdnNwcmludGYuanMiLCJub2RlX21vZHVsZXMvdW5kZXJzY29yZS5zdHJpbmcvd29yZHMuanMiLCJub2RlX21vZHVsZXMvdW5kZXJzY29yZS5zdHJpbmcvd3JhcC5qcyIsInNyYy9qcy9zaGltcy9tb2Rlcm5penItc2hpbS5qcyIsImNvb2tpZXMtanMiLCJidWlsZC90YXJnZXQvbW9kZXJuaXpyLWJ1aWxkL21vZGVybml6ci1kaXN0LmpzIiwidW5kZXJzY29yZS5zdHJpbmciXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDaE5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNWlJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJ2YXIgdHJpbSA9IHJlcXVpcmUoJy4vdHJpbScpO1xudmFyIGRlY2FwID0gcmVxdWlyZSgnLi9kZWNhcGl0YWxpemUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjYW1lbGl6ZShzdHIsIGRlY2FwaXRhbGl6ZSkge1xuICBzdHIgPSB0cmltKHN0cikucmVwbGFjZSgvWy1fXFxzXSsoLik/L2csIGZ1bmN0aW9uKG1hdGNoLCBjKSB7XG4gICAgcmV0dXJuIGMgPyBjLnRvVXBwZXJDYXNlKCkgOiAnJztcbiAgfSk7XG5cbiAgaWYgKGRlY2FwaXRhbGl6ZSA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiBkZWNhcChzdHIpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdHI7XG4gIH1cbn07XG4iLCJ2YXIgbWFrZVN0cmluZyA9IHJlcXVpcmUoJy4vaGVscGVyL21ha2VTdHJpbmcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjYXBpdGFsaXplKHN0ciwgbG93ZXJjYXNlUmVzdCkge1xuICBzdHIgPSBtYWtlU3RyaW5nKHN0cik7XG4gIHZhciByZW1haW5pbmdDaGFycyA9ICFsb3dlcmNhc2VSZXN0ID8gc3RyLnNsaWNlKDEpIDogc3RyLnNsaWNlKDEpLnRvTG93ZXJDYXNlKCk7XG5cbiAgcmV0dXJuIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHJlbWFpbmluZ0NoYXJzO1xufTtcbiIsInZhciBtYWtlU3RyaW5nID0gcmVxdWlyZSgnLi9oZWxwZXIvbWFrZVN0cmluZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNoYXJzKHN0cikge1xuICByZXR1cm4gbWFrZVN0cmluZyhzdHIpLnNwbGl0KCcnKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNob3Aoc3RyLCBzdGVwKSB7XG4gIGlmIChzdHIgPT0gbnVsbCkgcmV0dXJuIFtdO1xuICBzdHIgPSBTdHJpbmcoc3RyKTtcbiAgc3RlcCA9IH5+c3RlcDtcbiAgcmV0dXJuIHN0ZXAgPiAwID8gc3RyLm1hdGNoKG5ldyBSZWdFeHAoJy57MSwnICsgc3RlcCArICd9JywgJ2cnKSkgOiBbc3RyXTtcbn07XG4iLCJ2YXIgY2FwaXRhbGl6ZSA9IHJlcXVpcmUoJy4vY2FwaXRhbGl6ZScpO1xudmFyIGNhbWVsaXplID0gcmVxdWlyZSgnLi9jYW1lbGl6ZScpO1xudmFyIG1ha2VTdHJpbmcgPSByZXF1aXJlKCcuL2hlbHBlci9tYWtlU3RyaW5nJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2xhc3NpZnkoc3RyKSB7XG4gIHN0ciA9IG1ha2VTdHJpbmcoc3RyKTtcbiAgcmV0dXJuIGNhcGl0YWxpemUoY2FtZWxpemUoc3RyLnJlcGxhY2UoL1tcXFdfXS9nLCAnICcpKS5yZXBsYWNlKC9cXHMvZywgJycpKTtcbn07XG4iLCJ2YXIgdHJpbSA9IHJlcXVpcmUoJy4vdHJpbScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNsZWFuKHN0cikge1xuICByZXR1cm4gdHJpbShzdHIpLnJlcGxhY2UoL1xcc1xccysvZywgJyAnKTtcbn07XG4iLCJcbnZhciBtYWtlU3RyaW5nID0gcmVxdWlyZSgnLi9oZWxwZXIvbWFrZVN0cmluZycpO1xuXG52YXIgZnJvbSAgPSAnxIXDoMOhw6TDosOjw6XDpsSDxIfEjcSJxJnDqMOpw6vDqsSdxKXDrMOtw6/DrsS1xYLEvsWExYjDssOzw7bFkcO0w7XDsMO4xZvImcWfxaHFncWlyJvFo8Wtw7nDusO8xbHDu8Oxw7/DvcOnxbzFusW+JyxcbiAgdG8gICAgPSAnYWFhYWFhYWFhY2NjZWVlZWVnaGlpaWlqbGxubm9vb29vb29vc3Nzc3N0dHR1dXV1dXVueXljenp6JztcblxuZnJvbSArPSBmcm9tLnRvVXBwZXJDYXNlKCk7XG50byArPSB0by50b1VwcGVyQ2FzZSgpO1xuXG50byA9IHRvLnNwbGl0KCcnKTtcblxuLy8gZm9yIHRva2VucyByZXF1aXJlaW5nIG11bHRpdG9rZW4gb3V0cHV0XG5mcm9tICs9ICfDnyc7XG50by5wdXNoKCdzcycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2xlYW5EaWFjcml0aWNzKHN0cikge1xuICByZXR1cm4gbWFrZVN0cmluZyhzdHIpLnJlcGxhY2UoLy57MX0vZywgZnVuY3Rpb24oYyl7XG4gICAgdmFyIGluZGV4ID0gZnJvbS5pbmRleE9mKGMpO1xuICAgIHJldHVybiBpbmRleCA9PT0gLTEgPyBjIDogdG9baW5kZXhdO1xuICB9KTtcbn07XG4iLCJ2YXIgbWFrZVN0cmluZyA9IHJlcXVpcmUoJy4vaGVscGVyL21ha2VTdHJpbmcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzdHIsIHN1YnN0cikge1xuICBzdHIgPSBtYWtlU3RyaW5nKHN0cik7XG4gIHN1YnN0ciA9IG1ha2VTdHJpbmcoc3Vic3RyKTtcblxuICBpZiAoc3RyLmxlbmd0aCA9PT0gMCB8fCBzdWJzdHIubGVuZ3RoID09PSAwKSByZXR1cm4gMDtcbiAgXG4gIHJldHVybiBzdHIuc3BsaXQoc3Vic3RyKS5sZW5ndGggLSAxO1xufTtcbiIsInZhciB0cmltID0gcmVxdWlyZSgnLi90cmltJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGFzaGVyaXplKHN0cikge1xuICByZXR1cm4gdHJpbShzdHIpLnJlcGxhY2UoLyhbQS1aXSkvZywgJy0kMScpLnJlcGxhY2UoL1stX1xcc10rL2csICctJykudG9Mb3dlckNhc2UoKTtcbn07XG4iLCJ2YXIgbWFrZVN0cmluZyA9IHJlcXVpcmUoJy4vaGVscGVyL21ha2VTdHJpbmcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWNhcGl0YWxpemUoc3RyKSB7XG4gIHN0ciA9IG1ha2VTdHJpbmcoc3RyKTtcbiAgcmV0dXJuIHN0ci5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKSArIHN0ci5zbGljZSgxKTtcbn07XG4iLCJ2YXIgbWFrZVN0cmluZyA9IHJlcXVpcmUoJy4vaGVscGVyL21ha2VTdHJpbmcnKTtcblxuZnVuY3Rpb24gZ2V0SW5kZW50KHN0cikge1xuICB2YXIgbWF0Y2hlcyA9IHN0ci5tYXRjaCgvXltcXHNcXFxcdF0qL2dtKTtcbiAgdmFyIGluZGVudCA9IG1hdGNoZXNbMF0ubGVuZ3RoO1xuICBcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBtYXRjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaW5kZW50ID0gTWF0aC5taW4obWF0Y2hlc1tpXS5sZW5ndGgsIGluZGVudCk7XG4gIH1cblxuICByZXR1cm4gaW5kZW50O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlZGVudChzdHIsIHBhdHRlcm4pIHtcbiAgc3RyID0gbWFrZVN0cmluZyhzdHIpO1xuICB2YXIgaW5kZW50ID0gZ2V0SW5kZW50KHN0cik7XG4gIHZhciByZWc7XG5cbiAgaWYgKGluZGVudCA9PT0gMCkgcmV0dXJuIHN0cjtcblxuICBpZiAodHlwZW9mIHBhdHRlcm4gPT09ICdzdHJpbmcnKSB7XG4gICAgcmVnID0gbmV3IFJlZ0V4cCgnXicgKyBwYXR0ZXJuLCAnZ20nKTtcbiAgfSBlbHNlIHtcbiAgICByZWcgPSBuZXcgUmVnRXhwKCdeWyBcXFxcdF17JyArIGluZGVudCArICd9JywgJ2dtJyk7XG4gIH1cblxuICByZXR1cm4gc3RyLnJlcGxhY2UocmVnLCAnJyk7XG59O1xuIiwidmFyIG1ha2VTdHJpbmcgPSByZXF1aXJlKCcuL2hlbHBlci9tYWtlU3RyaW5nJyk7XG52YXIgdG9Qb3NpdGl2ZSA9IHJlcXVpcmUoJy4vaGVscGVyL3RvUG9zaXRpdmUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlbmRzV2l0aChzdHIsIGVuZHMsIHBvc2l0aW9uKSB7XG4gIHN0ciA9IG1ha2VTdHJpbmcoc3RyKTtcbiAgZW5kcyA9ICcnICsgZW5kcztcbiAgaWYgKHR5cGVvZiBwb3NpdGlvbiA9PSAndW5kZWZpbmVkJykge1xuICAgIHBvc2l0aW9uID0gc3RyLmxlbmd0aCAtIGVuZHMubGVuZ3RoO1xuICB9IGVsc2Uge1xuICAgIHBvc2l0aW9uID0gTWF0aC5taW4odG9Qb3NpdGl2ZShwb3NpdGlvbiksIHN0ci5sZW5ndGgpIC0gZW5kcy5sZW5ndGg7XG4gIH1cbiAgcmV0dXJuIHBvc2l0aW9uID49IDAgJiYgc3RyLmluZGV4T2YoZW5kcywgcG9zaXRpb24pID09PSBwb3NpdGlvbjtcbn07XG4iLCJ2YXIgbWFrZVN0cmluZyA9IHJlcXVpcmUoJy4vaGVscGVyL21ha2VTdHJpbmcnKTtcbnZhciBlc2NhcGVDaGFycyA9IHJlcXVpcmUoJy4vaGVscGVyL2VzY2FwZUNoYXJzJyk7XG5cbnZhciByZWdleFN0cmluZyA9ICdbJztcbmZvcih2YXIga2V5IGluIGVzY2FwZUNoYXJzKSB7XG4gIHJlZ2V4U3RyaW5nICs9IGtleTtcbn1cbnJlZ2V4U3RyaW5nICs9ICddJztcblxudmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cCggcmVnZXhTdHJpbmcsICdnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZXNjYXBlSFRNTChzdHIpIHtcblxuICByZXR1cm4gbWFrZVN0cmluZyhzdHIpLnJlcGxhY2UocmVnZXgsIGZ1bmN0aW9uKG0pIHtcbiAgICByZXR1cm4gJyYnICsgZXNjYXBlQ2hhcnNbbV0gKyAnOyc7XG4gIH0pO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZXN1bHQgPSB7fTtcblxuICBmb3IgKHZhciBwcm9wIGluIHRoaXMpIHtcbiAgICBpZiAoIXRoaXMuaGFzT3duUHJvcGVydHkocHJvcCkgfHwgcHJvcC5tYXRjaCgvXig/OmluY2x1ZGV8Y29udGFpbnN8cmV2ZXJzZXxqb2lufG1hcHx3cmFwKSQvKSkgY29udGludWU7XG4gICAgcmVzdWx0W3Byb3BdID0gdGhpc1twcm9wXTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwidmFyIG1ha2VTdHJpbmcgPSByZXF1aXJlKCcuL21ha2VTdHJpbmcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhZGphY2VudChzdHIsIGRpcmVjdGlvbikge1xuICBzdHIgPSBtYWtlU3RyaW5nKHN0cik7XG4gIGlmIChzdHIubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIHJldHVybiBzdHIuc2xpY2UoMCwgLTEpICsgU3RyaW5nLmZyb21DaGFyQ29kZShzdHIuY2hhckNvZGVBdChzdHIubGVuZ3RoIC0gMSkgKyBkaXJlY3Rpb24pO1xufTtcbiIsInZhciBlc2NhcGVSZWdFeHAgPSByZXF1aXJlKCcuL2VzY2FwZVJlZ0V4cCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlZmF1bHRUb1doaXRlU3BhY2UoY2hhcmFjdGVycykge1xuICBpZiAoY2hhcmFjdGVycyA9PSBudWxsKVxuICAgIHJldHVybiAnXFxcXHMnO1xuICBlbHNlIGlmIChjaGFyYWN0ZXJzLnNvdXJjZSlcbiAgICByZXR1cm4gY2hhcmFjdGVycy5zb3VyY2U7XG4gIGVsc2VcbiAgICByZXR1cm4gJ1snICsgZXNjYXBlUmVnRXhwKGNoYXJhY3RlcnMpICsgJ10nO1xufTtcbiIsIi8qIFdlJ3JlIGV4cGxpY2l0bHkgZGVmaW5pbmcgdGhlIGxpc3Qgb2YgZW50aXRpZXMgd2Ugd2FudCB0byBlc2NhcGUuXG5uYnNwIGlzIGFuIEhUTUwgZW50aXR5LCBidXQgd2UgZG9uJ3Qgd2FudCB0byBlc2NhcGUgYWxsIHNwYWNlIGNoYXJhY3RlcnMgaW4gYSBzdHJpbmcsIGhlbmNlIGl0cyBvbWlzc2lvbiBpbiB0aGlzIG1hcC5cblxuKi9cbnZhciBlc2NhcGVDaGFycyA9IHtcbiAgJ8KiJyA6ICdjZW50JyxcbiAgJ8KjJyA6ICdwb3VuZCcsXG4gICfCpScgOiAneWVuJyxcbiAgJ+KCrCc6ICdldXJvJyxcbiAgJ8KpJyA6J2NvcHknLFxuICAnwq4nIDogJ3JlZycsXG4gICc8JyA6ICdsdCcsXG4gICc+JyA6ICdndCcsXG4gICdcIicgOiAncXVvdCcsXG4gICcmJyA6ICdhbXAnLFxuICAnXFwnJyA6ICcjMzknXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGVzY2FwZUNoYXJzO1xuIiwidmFyIG1ha2VTdHJpbmcgPSByZXF1aXJlKCcuL21ha2VTdHJpbmcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlc2NhcGVSZWdFeHAoc3RyKSB7XG4gIHJldHVybiBtYWtlU3RyaW5nKHN0cikucmVwbGFjZSgvKFsuKis/Xj0hOiR7fSgpfFtcXF1cXC9cXFxcXSkvZywgJ1xcXFwkMScpO1xufTtcbiIsIi8qXG5XZSdyZSBleHBsaWNpdGx5IGRlZmluaW5nIHRoZSBsaXN0IG9mIGVudGl0aWVzIHRoYXQgbWlnaHQgc2VlIGluIGVzY2FwZSBIVE1MIHN0cmluZ3NcbiovXG52YXIgaHRtbEVudGl0aWVzID0ge1xuICBuYnNwOiAnICcsXG4gIGNlbnQ6ICfCoicsXG4gIHBvdW5kOiAnwqMnLFxuICB5ZW46ICfCpScsXG4gIGV1cm86ICfigqwnLFxuICBjb3B5OiAnwqknLFxuICByZWc6ICfCricsXG4gIGx0OiAnPCcsXG4gIGd0OiAnPicsXG4gIHF1b3Q6ICdcIicsXG4gIGFtcDogJyYnLFxuICBhcG9zOiAnXFwnJ1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBodG1sRW50aXRpZXM7XG4iLCIvKipcbiAqIEVuc3VyZSBzb21lIG9iamVjdCBpcyBhIGNvZXJjZWQgdG8gYSBzdHJpbmdcbiAqKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbWFrZVN0cmluZyhvYmplY3QpIHtcbiAgaWYgKG9iamVjdCA9PSBudWxsKSByZXR1cm4gJyc7XG4gIHJldHVybiAnJyArIG9iamVjdDtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHN0clJlcGVhdChzdHIsIHF0eSl7XG4gIGlmIChxdHkgPCAxKSByZXR1cm4gJyc7XG4gIHZhciByZXN1bHQgPSAnJztcbiAgd2hpbGUgKHF0eSA+IDApIHtcbiAgICBpZiAocXR5ICYgMSkgcmVzdWx0ICs9IHN0cjtcbiAgICBxdHkgPj49IDEsIHN0ciArPSBzdHI7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRvUG9zaXRpdmUobnVtYmVyKSB7XG4gIHJldHVybiBudW1iZXIgPCAwID8gMCA6ICgrbnVtYmVyIHx8IDApO1xufTtcbiIsInZhciBjYXBpdGFsaXplID0gcmVxdWlyZSgnLi9jYXBpdGFsaXplJyk7XG52YXIgdW5kZXJzY29yZWQgPSByZXF1aXJlKCcuL3VuZGVyc2NvcmVkJyk7XG52YXIgdHJpbSA9IHJlcXVpcmUoJy4vdHJpbScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGh1bWFuaXplKHN0cikge1xuICByZXR1cm4gY2FwaXRhbGl6ZSh0cmltKHVuZGVyc2NvcmVkKHN0cikucmVwbGFjZSgvX2lkJC8sICcnKS5yZXBsYWNlKC9fL2csICcgJykpKTtcbn07XG4iLCJ2YXIgbWFrZVN0cmluZyA9IHJlcXVpcmUoJy4vaGVscGVyL21ha2VTdHJpbmcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmNsdWRlKHN0ciwgbmVlZGxlKSB7XG4gIGlmIChuZWVkbGUgPT09ICcnKSByZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuIG1ha2VTdHJpbmcoc3RyKS5pbmRleE9mKG5lZWRsZSkgIT09IC0xO1xufTtcbiIsInZhciBzcGxpY2UgPSByZXF1aXJlKCcuL3NwbGljZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluc2VydChzdHIsIGksIHN1YnN0cikge1xuICByZXR1cm4gc3BsaWNlKHN0ciwgaSwgMCwgc3Vic3RyKTtcbn07XG4iLCJ2YXIgbWFrZVN0cmluZyA9IHJlcXVpcmUoJy4vaGVscGVyL21ha2VTdHJpbmcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0JsYW5rKHN0cikge1xuICByZXR1cm4gKC9eXFxzKiQvKS50ZXN0KG1ha2VTdHJpbmcoc3RyKSk7XG59O1xuIiwidmFyIG1ha2VTdHJpbmcgPSByZXF1aXJlKCcuL2hlbHBlci9tYWtlU3RyaW5nJyk7XG52YXIgc2xpY2UgPSBbXS5zbGljZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBqb2luKCkge1xuICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzKSxcbiAgICBzZXBhcmF0b3IgPSBhcmdzLnNoaWZ0KCk7XG5cbiAgcmV0dXJuIGFyZ3Muam9pbihtYWtlU3RyaW5nKHNlcGFyYXRvcikpO1xufTtcbiIsInZhciBtYWtlU3RyaW5nID0gcmVxdWlyZSgnLi9oZWxwZXIvbWFrZVN0cmluZycpO1xuXG4vKipcbiAqIEJhc2VkIG9uIHRoZSBpbXBsZW1lbnRhdGlvbiBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vaGlkZGVudGFvL2Zhc3QtbGV2ZW5zaHRlaW5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBsZXZlbnNodGVpbihzdHIxLCBzdHIyKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgc3RyMSA9IG1ha2VTdHJpbmcoc3RyMSk7XG4gIHN0cjIgPSBtYWtlU3RyaW5nKHN0cjIpO1xuXG4gIC8vIFNob3J0IGN1dCBjYXNlcyAgXG4gIGlmIChzdHIxID09PSBzdHIyKSByZXR1cm4gMDtcbiAgaWYgKCFzdHIxIHx8ICFzdHIyKSByZXR1cm4gTWF0aC5tYXgoc3RyMS5sZW5ndGgsIHN0cjIubGVuZ3RoKTtcblxuICAvLyB0d28gcm93c1xuICB2YXIgcHJldlJvdyA9IG5ldyBBcnJheShzdHIyLmxlbmd0aCArIDEpO1xuXG4gIC8vIGluaXRpYWxpc2UgcHJldmlvdXMgcm93XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcHJldlJvdy5sZW5ndGg7ICsraSkge1xuICAgIHByZXZSb3dbaV0gPSBpO1xuICB9XG5cbiAgLy8gY2FsY3VsYXRlIGN1cnJlbnQgcm93IGRpc3RhbmNlIGZyb20gcHJldmlvdXMgcm93XG4gIGZvciAoaSA9IDA7IGkgPCBzdHIxLmxlbmd0aDsgKytpKSB7XG4gICAgdmFyIG5leHRDb2wgPSBpICsgMTtcblxuICAgIGZvciAodmFyIGogPSAwOyBqIDwgc3RyMi5sZW5ndGg7ICsraikge1xuICAgICAgdmFyIGN1ckNvbCA9IG5leHRDb2w7XG5cbiAgICAgIC8vIHN1YnN0dXRpb25cbiAgICAgIG5leHRDb2wgPSBwcmV2Um93W2pdICsgKCAoc3RyMS5jaGFyQXQoaSkgPT09IHN0cjIuY2hhckF0KGopKSA/IDAgOiAxICk7XG4gICAgICAvLyBpbnNlcnRpb25cbiAgICAgIHZhciB0bXAgPSBjdXJDb2wgKyAxO1xuICAgICAgaWYgKG5leHRDb2wgPiB0bXApIHtcbiAgICAgICAgbmV4dENvbCA9IHRtcDtcbiAgICAgIH1cbiAgICAgIC8vIGRlbGV0aW9uXG4gICAgICB0bXAgPSBwcmV2Um93W2ogKyAxXSArIDE7XG4gICAgICBpZiAobmV4dENvbCA+IHRtcCkge1xuICAgICAgICBuZXh0Q29sID0gdG1wO1xuICAgICAgfVxuXG4gICAgICAvLyBjb3B5IGN1cnJlbnQgY29sIHZhbHVlIGludG8gcHJldmlvdXMgKGluIHByZXBhcmF0aW9uIGZvciBuZXh0IGl0ZXJhdGlvbilcbiAgICAgIHByZXZSb3dbal0gPSBjdXJDb2w7XG4gICAgfVxuXG4gICAgLy8gY29weSBsYXN0IGNvbCB2YWx1ZSBpbnRvIHByZXZpb3VzIChpbiBwcmVwYXJhdGlvbiBmb3IgbmV4dCBpdGVyYXRpb24pXG4gICAgcHJldlJvd1tqXSA9IG5leHRDb2w7XG4gIH1cblxuICByZXR1cm4gbmV4dENvbDtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGxpbmVzKHN0cikge1xuICBpZiAoc3RyID09IG51bGwpIHJldHVybiBbXTtcbiAgcmV0dXJuIFN0cmluZyhzdHIpLnNwbGl0KC9cXHJcXG4/fFxcbi8pO1xufTtcbiIsInZhciBwYWQgPSByZXF1aXJlKCcuL3BhZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGxwYWQoc3RyLCBsZW5ndGgsIHBhZFN0cikge1xuICByZXR1cm4gcGFkKHN0ciwgbGVuZ3RoLCBwYWRTdHIpO1xufTtcbiIsInZhciBwYWQgPSByZXF1aXJlKCcuL3BhZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGxycGFkKHN0ciwgbGVuZ3RoLCBwYWRTdHIpIHtcbiAgcmV0dXJuIHBhZChzdHIsIGxlbmd0aCwgcGFkU3RyLCAnYm90aCcpO1xufTtcbiIsInZhciBtYWtlU3RyaW5nID0gcmVxdWlyZSgnLi9oZWxwZXIvbWFrZVN0cmluZycpO1xudmFyIGRlZmF1bHRUb1doaXRlU3BhY2UgPSByZXF1aXJlKCcuL2hlbHBlci9kZWZhdWx0VG9XaGl0ZVNwYWNlJyk7XG52YXIgbmF0aXZlVHJpbUxlZnQgPSBTdHJpbmcucHJvdG90eXBlLnRyaW1MZWZ0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGx0cmltKHN0ciwgY2hhcmFjdGVycykge1xuICBzdHIgPSBtYWtlU3RyaW5nKHN0cik7XG4gIGlmICghY2hhcmFjdGVycyAmJiBuYXRpdmVUcmltTGVmdCkgcmV0dXJuIG5hdGl2ZVRyaW1MZWZ0LmNhbGwoc3RyKTtcbiAgY2hhcmFjdGVycyA9IGRlZmF1bHRUb1doaXRlU3BhY2UoY2hhcmFjdGVycyk7XG4gIHJldHVybiBzdHIucmVwbGFjZShuZXcgUmVnRXhwKCdeJyArIGNoYXJhY3RlcnMgKyAnKycpLCAnJyk7XG59O1xuIiwidmFyIG1ha2VTdHJpbmcgPSByZXF1aXJlKCcuL2hlbHBlci9tYWtlU3RyaW5nJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc3RyLCBjYWxsYmFjaykge1xuICBzdHIgPSBtYWtlU3RyaW5nKHN0cik7XG5cbiAgaWYgKHN0ci5sZW5ndGggPT09IDAgfHwgdHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSByZXR1cm4gc3RyO1xuXG4gIHJldHVybiBzdHIucmVwbGFjZSgvLi9nLCBjYWxsYmFjayk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBuYXR1cmFsQ21wKHN0cjEsIHN0cjIpIHtcbiAgaWYgKHN0cjEgPT0gc3RyMikgcmV0dXJuIDA7XG4gIGlmICghc3RyMSkgcmV0dXJuIC0xO1xuICBpZiAoIXN0cjIpIHJldHVybiAxO1xuXG4gIHZhciBjbXBSZWdleCA9IC8oXFwuXFxkK3xcXGQrfFxcRCspL2csXG4gICAgdG9rZW5zMSA9IFN0cmluZyhzdHIxKS5tYXRjaChjbXBSZWdleCksXG4gICAgdG9rZW5zMiA9IFN0cmluZyhzdHIyKS5tYXRjaChjbXBSZWdleCksXG4gICAgY291bnQgPSBNYXRoLm1pbih0b2tlbnMxLmxlbmd0aCwgdG9rZW5zMi5sZW5ndGgpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgIHZhciBhID0gdG9rZW5zMVtpXSxcbiAgICAgIGIgPSB0b2tlbnMyW2ldO1xuXG4gICAgaWYgKGEgIT09IGIpIHtcbiAgICAgIHZhciBudW0xID0gK2E7XG4gICAgICB2YXIgbnVtMiA9ICtiO1xuICAgICAgaWYgKG51bTEgPT09IG51bTEgJiYgbnVtMiA9PT0gbnVtMikge1xuICAgICAgICByZXR1cm4gbnVtMSA+IG51bTIgPyAxIDogLTE7XG4gICAgICB9XG4gICAgICByZXR1cm4gYSA8IGIgPyAtMSA6IDE7XG4gICAgfVxuICB9XG5cbiAgaWYgKHRva2VuczEubGVuZ3RoICE9IHRva2VuczIubGVuZ3RoKVxuICAgIHJldHVybiB0b2tlbnMxLmxlbmd0aCAtIHRva2VuczIubGVuZ3RoO1xuXG4gIHJldHVybiBzdHIxIDwgc3RyMiA/IC0xIDogMTtcbn07XG4iLCIoZnVuY3Rpb24od2luZG93KSB7XG4gICAgdmFyIHJlID0ge1xuICAgICAgICBub3Rfc3RyaW5nOiAvW15zXS8sXG4gICAgICAgIG51bWJlcjogL1tkaWVmZ10vLFxuICAgICAgICBqc29uOiAvW2pdLyxcbiAgICAgICAgbm90X2pzb246IC9bXmpdLyxcbiAgICAgICAgdGV4dDogL15bXlxceDI1XSsvLFxuICAgICAgICBtb2R1bG86IC9eXFx4MjV7Mn0vLFxuICAgICAgICBwbGFjZWhvbGRlcjogL15cXHgyNSg/OihbMS05XVxcZCopXFwkfFxcKChbXlxcKV0rKVxcKSk/KFxcKyk/KDB8J1teJF0pPygtKT8oXFxkKyk/KD86XFwuKFxcZCspKT8oW2ItZ2lqb3N1eFhdKS8sXG4gICAgICAgIGtleTogL14oW2Etel9dW2Etel9cXGRdKikvaSxcbiAgICAgICAga2V5X2FjY2VzczogL15cXC4oW2Etel9dW2Etel9cXGRdKikvaSxcbiAgICAgICAgaW5kZXhfYWNjZXNzOiAvXlxcWyhcXGQrKVxcXS8sXG4gICAgICAgIHNpZ246IC9eW1xcK1xcLV0vXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3ByaW50ZigpIHtcbiAgICAgICAgdmFyIGtleSA9IGFyZ3VtZW50c1swXSwgY2FjaGUgPSBzcHJpbnRmLmNhY2hlXG4gICAgICAgIGlmICghKGNhY2hlW2tleV0gJiYgY2FjaGUuaGFzT3duUHJvcGVydHkoa2V5KSkpIHtcbiAgICAgICAgICAgIGNhY2hlW2tleV0gPSBzcHJpbnRmLnBhcnNlKGtleSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3ByaW50Zi5mb3JtYXQuY2FsbChudWxsLCBjYWNoZVtrZXldLCBhcmd1bWVudHMpXG4gICAgfVxuXG4gICAgc3ByaW50Zi5mb3JtYXQgPSBmdW5jdGlvbihwYXJzZV90cmVlLCBhcmd2KSB7XG4gICAgICAgIHZhciBjdXJzb3IgPSAxLCB0cmVlX2xlbmd0aCA9IHBhcnNlX3RyZWUubGVuZ3RoLCBub2RlX3R5cGUgPSBcIlwiLCBhcmcsIG91dHB1dCA9IFtdLCBpLCBrLCBtYXRjaCwgcGFkLCBwYWRfY2hhcmFjdGVyLCBwYWRfbGVuZ3RoLCBpc19wb3NpdGl2ZSA9IHRydWUsIHNpZ24gPSBcIlwiXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0cmVlX2xlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBub2RlX3R5cGUgPSBnZXRfdHlwZShwYXJzZV90cmVlW2ldKVxuICAgICAgICAgICAgaWYgKG5vZGVfdHlwZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIG91dHB1dFtvdXRwdXQubGVuZ3RoXSA9IHBhcnNlX3RyZWVbaV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG5vZGVfdHlwZSA9PT0gXCJhcnJheVwiKSB7XG4gICAgICAgICAgICAgICAgbWF0Y2ggPSBwYXJzZV90cmVlW2ldIC8vIGNvbnZlbmllbmNlIHB1cnBvc2VzIG9ubHlcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2hbMl0pIHsgLy8ga2V5d29yZCBhcmd1bWVudFxuICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmd2W2N1cnNvcl1cbiAgICAgICAgICAgICAgICAgICAgZm9yIChrID0gMDsgayA8IG1hdGNoWzJdLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWFyZy5oYXNPd25Qcm9wZXJ0eShtYXRjaFsyXVtrXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3Ioc3ByaW50ZihcIltzcHJpbnRmXSBwcm9wZXJ0eSAnJXMnIGRvZXMgbm90IGV4aXN0XCIsIG1hdGNoWzJdW2tdKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZ1ttYXRjaFsyXVtrXV1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChtYXRjaFsxXSkgeyAvLyBwb3NpdGlvbmFsIGFyZ3VtZW50IChleHBsaWNpdClcbiAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJndlttYXRjaFsxXV1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7IC8vIHBvc2l0aW9uYWwgYXJndW1lbnQgKGltcGxpY2l0KVxuICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmd2W2N1cnNvcisrXVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChnZXRfdHlwZShhcmcpID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmcoKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChyZS5ub3Rfc3RyaW5nLnRlc3QobWF0Y2hbOF0pICYmIHJlLm5vdF9qc29uLnRlc3QobWF0Y2hbOF0pICYmIChnZXRfdHlwZShhcmcpICE9IFwibnVtYmVyXCIgJiYgaXNOYU4oYXJnKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzcHJpbnRmKFwiW3NwcmludGZdIGV4cGVjdGluZyBudW1iZXIgYnV0IGZvdW5kICVzXCIsIGdldF90eXBlKGFyZykpKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChyZS5udW1iZXIudGVzdChtYXRjaFs4XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNfcG9zaXRpdmUgPSBhcmcgPj0gMFxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHN3aXRjaCAobWF0Y2hbOF0pIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImJcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZy50b1N0cmluZygyKVxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiY1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gU3RyaW5nLmZyb21DaGFyQ29kZShhcmcpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJkXCI6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJpXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBwYXJzZUludChhcmcsIDEwKVxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwialwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gSlNPTi5zdHJpbmdpZnkoYXJnLCBudWxsLCBtYXRjaFs2XSA/IHBhcnNlSW50KG1hdGNoWzZdKSA6IDApXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJlXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBtYXRjaFs3XSA/IGFyZy50b0V4cG9uZW50aWFsKG1hdGNoWzddKSA6IGFyZy50b0V4cG9uZW50aWFsKClcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImZcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IG1hdGNoWzddID8gcGFyc2VGbG9hdChhcmcpLnRvRml4ZWQobWF0Y2hbN10pIDogcGFyc2VGbG9hdChhcmcpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJnXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBtYXRjaFs3XSA/IHBhcnNlRmxvYXQoYXJnKS50b1ByZWNpc2lvbihtYXRjaFs3XSkgOiBwYXJzZUZsb2F0KGFyZylcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIm9cIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZy50b1N0cmluZyg4KVxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwic1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gKChhcmcgPSBTdHJpbmcoYXJnKSkgJiYgbWF0Y2hbN10gPyBhcmcuc3Vic3RyaW5nKDAsIG1hdGNoWzddKSA6IGFyZylcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInVcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZyA+Pj4gMFxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwieFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJnLnRvU3RyaW5nKDE2KVxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiWFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJnLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyZS5qc29uLnRlc3QobWF0Y2hbOF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dFtvdXRwdXQubGVuZ3RoXSA9IGFyZ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlLm51bWJlci50ZXN0KG1hdGNoWzhdKSAmJiAoIWlzX3Bvc2l0aXZlIHx8IG1hdGNoWzNdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2lnbiA9IGlzX3Bvc2l0aXZlID8gXCIrXCIgOiBcIi1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJnLnRvU3RyaW5nKCkucmVwbGFjZShyZS5zaWduLCBcIlwiKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2lnbiA9IFwiXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwYWRfY2hhcmFjdGVyID0gbWF0Y2hbNF0gPyBtYXRjaFs0XSA9PT0gXCIwXCIgPyBcIjBcIiA6IG1hdGNoWzRdLmNoYXJBdCgxKSA6IFwiIFwiXG4gICAgICAgICAgICAgICAgICAgIHBhZF9sZW5ndGggPSBtYXRjaFs2XSAtIChzaWduICsgYXJnKS5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgcGFkID0gbWF0Y2hbNl0gPyAocGFkX2xlbmd0aCA+IDAgPyBzdHJfcmVwZWF0KHBhZF9jaGFyYWN0ZXIsIHBhZF9sZW5ndGgpIDogXCJcIikgOiBcIlwiXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dFtvdXRwdXQubGVuZ3RoXSA9IG1hdGNoWzVdID8gc2lnbiArIGFyZyArIHBhZCA6IChwYWRfY2hhcmFjdGVyID09PSBcIjBcIiA/IHNpZ24gKyBwYWQgKyBhcmcgOiBwYWQgKyBzaWduICsgYXJnKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0cHV0LmpvaW4oXCJcIilcbiAgICB9XG5cbiAgICBzcHJpbnRmLmNhY2hlID0ge31cblxuICAgIHNwcmludGYucGFyc2UgPSBmdW5jdGlvbihmbXQpIHtcbiAgICAgICAgdmFyIF9mbXQgPSBmbXQsIG1hdGNoID0gW10sIHBhcnNlX3RyZWUgPSBbXSwgYXJnX25hbWVzID0gMFxuICAgICAgICB3aGlsZSAoX2ZtdCkge1xuICAgICAgICAgICAgaWYgKChtYXRjaCA9IHJlLnRleHQuZXhlYyhfZm10KSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBwYXJzZV90cmVlW3BhcnNlX3RyZWUubGVuZ3RoXSA9IG1hdGNoWzBdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICgobWF0Y2ggPSByZS5tb2R1bG8uZXhlYyhfZm10KSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBwYXJzZV90cmVlW3BhcnNlX3RyZWUubGVuZ3RoXSA9IFwiJVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICgobWF0Y2ggPSByZS5wbGFjZWhvbGRlci5leGVjKF9mbXQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmIChtYXRjaFsyXSkge1xuICAgICAgICAgICAgICAgICAgICBhcmdfbmFtZXMgfD0gMVxuICAgICAgICAgICAgICAgICAgICB2YXIgZmllbGRfbGlzdCA9IFtdLCByZXBsYWNlbWVudF9maWVsZCA9IG1hdGNoWzJdLCBmaWVsZF9tYXRjaCA9IFtdXG4gICAgICAgICAgICAgICAgICAgIGlmICgoZmllbGRfbWF0Y2ggPSByZS5rZXkuZXhlYyhyZXBsYWNlbWVudF9maWVsZCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZF9saXN0W2ZpZWxkX2xpc3QubGVuZ3RoXSA9IGZpZWxkX21hdGNoWzFdXG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoKHJlcGxhY2VtZW50X2ZpZWxkID0gcmVwbGFjZW1lbnRfZmllbGQuc3Vic3RyaW5nKGZpZWxkX21hdGNoWzBdLmxlbmd0aCkpICE9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChmaWVsZF9tYXRjaCA9IHJlLmtleV9hY2Nlc3MuZXhlYyhyZXBsYWNlbWVudF9maWVsZCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkX2xpc3RbZmllbGRfbGlzdC5sZW5ndGhdID0gZmllbGRfbWF0Y2hbMV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoKGZpZWxkX21hdGNoID0gcmUuaW5kZXhfYWNjZXNzLmV4ZWMocmVwbGFjZW1lbnRfZmllbGQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZF9saXN0W2ZpZWxkX2xpc3QubGVuZ3RoXSA9IGZpZWxkX21hdGNoWzFdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJbc3ByaW50Zl0gZmFpbGVkIHRvIHBhcnNlIG5hbWVkIGFyZ3VtZW50IGtleVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihcIltzcHJpbnRmXSBmYWlsZWQgdG8gcGFyc2UgbmFtZWQgYXJndW1lbnQga2V5XCIpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hbMl0gPSBmaWVsZF9saXN0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhcmdfbmFtZXMgfD0gMlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYXJnX25hbWVzID09PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIltzcHJpbnRmXSBtaXhpbmcgcG9zaXRpb25hbCBhbmQgbmFtZWQgcGxhY2Vob2xkZXJzIGlzIG5vdCAoeWV0KSBzdXBwb3J0ZWRcIilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcGFyc2VfdHJlZVtwYXJzZV90cmVlLmxlbmd0aF0gPSBtYXRjaFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiW3NwcmludGZdIHVuZXhwZWN0ZWQgcGxhY2Vob2xkZXJcIilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF9mbXQgPSBfZm10LnN1YnN0cmluZyhtYXRjaFswXS5sZW5ndGgpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhcnNlX3RyZWVcbiAgICB9XG5cbiAgICB2YXIgdnNwcmludGYgPSBmdW5jdGlvbihmbXQsIGFyZ3YsIF9hcmd2KSB7XG4gICAgICAgIF9hcmd2ID0gKGFyZ3YgfHwgW10pLnNsaWNlKDApXG4gICAgICAgIF9hcmd2LnNwbGljZSgwLCAwLCBmbXQpXG4gICAgICAgIHJldHVybiBzcHJpbnRmLmFwcGx5KG51bGwsIF9hcmd2KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGhlbHBlcnNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRfdHlwZSh2YXJpYWJsZSkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhcmlhYmxlKS5zbGljZSg4LCAtMSkudG9Mb3dlckNhc2UoKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN0cl9yZXBlYXQoaW5wdXQsIG11bHRpcGxpZXIpIHtcbiAgICAgICAgcmV0dXJuIEFycmF5KG11bHRpcGxpZXIgKyAxKS5qb2luKGlucHV0KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGV4cG9ydCB0byBlaXRoZXIgYnJvd3NlciBvciBub2RlLmpzXG4gICAgICovXG4gICAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGV4cG9ydHMuc3ByaW50ZiA9IHNwcmludGZcbiAgICAgICAgZXhwb3J0cy52c3ByaW50ZiA9IHZzcHJpbnRmXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB3aW5kb3cuc3ByaW50ZiA9IHNwcmludGZcbiAgICAgICAgd2luZG93LnZzcHJpbnRmID0gdnNwcmludGZcblxuICAgICAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgICAgIGRlZmluZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBzcHJpbnRmOiBzcHJpbnRmLFxuICAgICAgICAgICAgICAgICAgICB2c3ByaW50ZjogdnNwcmludGZcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxufSkodHlwZW9mIHdpbmRvdyA9PT0gXCJ1bmRlZmluZWRcIiA/IHRoaXMgOiB3aW5kb3cpO1xuIiwiXG4vKipcbiAqIE1vZHVsZSBleHBvcnRzLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZGVwcmVjYXRlO1xuXG4vKipcbiAqIE1hcmsgdGhhdCBhIG1ldGhvZCBzaG91bGQgbm90IGJlIHVzZWQuXG4gKiBSZXR1cm5zIGEgbW9kaWZpZWQgZnVuY3Rpb24gd2hpY2ggd2FybnMgb25jZSBieSBkZWZhdWx0LlxuICpcbiAqIElmIGBsb2NhbFN0b3JhZ2Uubm9EZXByZWNhdGlvbiA9IHRydWVgIGlzIHNldCwgdGhlbiBpdCBpcyBhIG5vLW9wLlxuICpcbiAqIElmIGBsb2NhbFN0b3JhZ2UudGhyb3dEZXByZWNhdGlvbiA9IHRydWVgIGlzIHNldCwgdGhlbiBkZXByZWNhdGVkIGZ1bmN0aW9uc1xuICogd2lsbCB0aHJvdyBhbiBFcnJvciB3aGVuIGludm9rZWQuXG4gKlxuICogSWYgYGxvY2FsU3RvcmFnZS50cmFjZURlcHJlY2F0aW9uID0gdHJ1ZWAgaXMgc2V0LCB0aGVuIGRlcHJlY2F0ZWQgZnVuY3Rpb25zXG4gKiB3aWxsIGludm9rZSBgY29uc29sZS50cmFjZSgpYCBpbnN0ZWFkIG9mIGBjb25zb2xlLmVycm9yKClgLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIC0gdGhlIGZ1bmN0aW9uIHRvIGRlcHJlY2F0ZVxuICogQHBhcmFtIHtTdHJpbmd9IG1zZyAtIHRoZSBzdHJpbmcgdG8gcHJpbnQgdG8gdGhlIGNvbnNvbGUgd2hlbiBgZm5gIGlzIGludm9rZWRcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gYSBuZXcgXCJkZXByZWNhdGVkXCIgdmVyc2lvbiBvZiBgZm5gXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGRlcHJlY2F0ZSAoZm4sIG1zZykge1xuICBpZiAoY29uZmlnKCdub0RlcHJlY2F0aW9uJykpIHtcbiAgICByZXR1cm4gZm47XG4gIH1cblxuICB2YXIgd2FybmVkID0gZmFsc2U7XG4gIGZ1bmN0aW9uIGRlcHJlY2F0ZWQoKSB7XG4gICAgaWYgKCF3YXJuZWQpIHtcbiAgICAgIGlmIChjb25maWcoJ3Rocm93RGVwcmVjYXRpb24nKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICAgIH0gZWxzZSBpZiAoY29uZmlnKCd0cmFjZURlcHJlY2F0aW9uJykpIHtcbiAgICAgICAgY29uc29sZS50cmFjZShtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS53YXJuKG1zZyk7XG4gICAgICB9XG4gICAgICB3YXJuZWQgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIHJldHVybiBkZXByZWNhdGVkO1xufVxuXG4vKipcbiAqIENoZWNrcyBgbG9jYWxTdG9yYWdlYCBmb3IgYm9vbGVhbiB2YWx1ZXMgZm9yIHRoZSBnaXZlbiBgbmFtZWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEByZXR1cm5zIHtCb29sZWFufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gY29uZmlnIChuYW1lKSB7XG4gIC8vIGFjY2Vzc2luZyBnbG9iYWwubG9jYWxTdG9yYWdlIGNhbiB0cmlnZ2VyIGEgRE9NRXhjZXB0aW9uIGluIHNhbmRib3hlZCBpZnJhbWVzXG4gIHRyeSB7XG4gICAgaWYgKCFnbG9iYWwubG9jYWxTdG9yYWdlKSByZXR1cm4gZmFsc2U7XG4gIH0gY2F0Y2ggKF8pIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHZhbCA9IGdsb2JhbC5sb2NhbFN0b3JhZ2VbbmFtZV07XG4gIGlmIChudWxsID09IHZhbCkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gU3RyaW5nKHZhbCkudG9Mb3dlckNhc2UoKSA9PT0gJ3RydWUnO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBudW1iZXJGb3JtYXQobnVtYmVyLCBkZWMsIGRzZXAsIHRzZXApIHtcbiAgaWYgKGlzTmFOKG51bWJlcikgfHwgbnVtYmVyID09IG51bGwpIHJldHVybiAnJztcblxuICBudW1iZXIgPSBudW1iZXIudG9GaXhlZCh+fmRlYyk7XG4gIHRzZXAgPSB0eXBlb2YgdHNlcCA9PSAnc3RyaW5nJyA/IHRzZXAgOiAnLCc7XG5cbiAgdmFyIHBhcnRzID0gbnVtYmVyLnNwbGl0KCcuJyksXG4gICAgZm51bXMgPSBwYXJ0c1swXSxcbiAgICBkZWNpbWFscyA9IHBhcnRzWzFdID8gKGRzZXAgfHwgJy4nKSArIHBhcnRzWzFdIDogJyc7XG5cbiAgcmV0dXJuIGZudW1zLnJlcGxhY2UoLyhcXGQpKD89KD86XFxkezN9KSskKS9nLCAnJDEnICsgdHNlcCkgKyBkZWNpbWFscztcbn07XG4iLCJ2YXIgbWFrZVN0cmluZyA9IHJlcXVpcmUoJy4vaGVscGVyL21ha2VTdHJpbmcnKTtcbnZhciBzdHJSZXBlYXQgPSByZXF1aXJlKCcuL2hlbHBlci9zdHJSZXBlYXQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYWQoc3RyLCBsZW5ndGgsIHBhZFN0ciwgdHlwZSkge1xuICBzdHIgPSBtYWtlU3RyaW5nKHN0cik7XG4gIGxlbmd0aCA9IH5+bGVuZ3RoO1xuXG4gIHZhciBwYWRsZW4gPSAwO1xuXG4gIGlmICghcGFkU3RyKVxuICAgIHBhZFN0ciA9ICcgJztcbiAgZWxzZSBpZiAocGFkU3RyLmxlbmd0aCA+IDEpXG4gICAgcGFkU3RyID0gcGFkU3RyLmNoYXJBdCgwKTtcblxuICBzd2l0Y2ggKHR5cGUpIHtcbiAgY2FzZSAncmlnaHQnOlxuICAgIHBhZGxlbiA9IGxlbmd0aCAtIHN0ci5sZW5ndGg7XG4gICAgcmV0dXJuIHN0ciArIHN0clJlcGVhdChwYWRTdHIsIHBhZGxlbik7XG4gIGNhc2UgJ2JvdGgnOlxuICAgIHBhZGxlbiA9IGxlbmd0aCAtIHN0ci5sZW5ndGg7XG4gICAgcmV0dXJuIHN0clJlcGVhdChwYWRTdHIsIE1hdGguY2VpbChwYWRsZW4gLyAyKSkgKyBzdHIgKyBzdHJSZXBlYXQocGFkU3RyLCBNYXRoLmZsb29yKHBhZGxlbiAvIDIpKTtcbiAgZGVmYXVsdDogLy8gJ2xlZnQnXG4gICAgcGFkbGVuID0gbGVuZ3RoIC0gc3RyLmxlbmd0aDtcbiAgICByZXR1cm4gc3RyUmVwZWF0KHBhZFN0ciwgcGFkbGVuKSArIHN0cjtcbiAgfVxufTtcbiIsInZhciBhZGphY2VudCA9IHJlcXVpcmUoJy4vaGVscGVyL2FkamFjZW50Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3VjYyhzdHIpIHtcbiAgcmV0dXJuIGFkamFjZW50KHN0ciwgLTEpO1xufTtcbiIsIi8qKlxuICogX3MucHJ1bmU6IGEgbW9yZSBlbGVnYW50IHZlcnNpb24gb2YgdHJ1bmNhdGVcbiAqIHBydW5lIGV4dHJhIGNoYXJzLCBuZXZlciBsZWF2aW5nIGEgaGFsZi1jaG9wcGVkIHdvcmQuXG4gKiBAYXV0aG9yIGdpdGh1Yi5jb20vcnd6XG4gKi9cbnZhciBtYWtlU3RyaW5nID0gcmVxdWlyZSgnLi9oZWxwZXIvbWFrZVN0cmluZycpO1xudmFyIHJ0cmltID0gcmVxdWlyZSgnLi9ydHJpbScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBydW5lKHN0ciwgbGVuZ3RoLCBwcnVuZVN0cikge1xuICBzdHIgPSBtYWtlU3RyaW5nKHN0cik7XG4gIGxlbmd0aCA9IH5+bGVuZ3RoO1xuICBwcnVuZVN0ciA9IHBydW5lU3RyICE9IG51bGwgPyBTdHJpbmcocHJ1bmVTdHIpIDogJy4uLic7XG5cbiAgaWYgKHN0ci5sZW5ndGggPD0gbGVuZ3RoKSByZXR1cm4gc3RyO1xuXG4gIHZhciB0bXBsID0gZnVuY3Rpb24oYykge1xuICAgICAgcmV0dXJuIGMudG9VcHBlckNhc2UoKSAhPT0gYy50b0xvd2VyQ2FzZSgpID8gJ0EnIDogJyAnO1xuICAgIH0sXG4gICAgdGVtcGxhdGUgPSBzdHIuc2xpY2UoMCwgbGVuZ3RoICsgMSkucmVwbGFjZSgvLig/PVxcVypcXHcqJCkvZywgdG1wbCk7IC8vICdIZWxsbywgd29ybGQnIC0+ICdIZWxsQUEgQUFBQUEnXG5cbiAgaWYgKHRlbXBsYXRlLnNsaWNlKHRlbXBsYXRlLmxlbmd0aCAtIDIpLm1hdGNoKC9cXHdcXHcvKSlcbiAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlLnJlcGxhY2UoL1xccypcXFMrJC8sICcnKTtcbiAgZWxzZVxuICAgIHRlbXBsYXRlID0gcnRyaW0odGVtcGxhdGUuc2xpY2UoMCwgdGVtcGxhdGUubGVuZ3RoIC0gMSkpO1xuXG4gIHJldHVybiAodGVtcGxhdGUgKyBwcnVuZVN0cikubGVuZ3RoID4gc3RyLmxlbmd0aCA/IHN0ciA6IHN0ci5zbGljZSgwLCB0ZW1wbGF0ZS5sZW5ndGgpICsgcHJ1bmVTdHI7XG59O1xuIiwidmFyIHN1cnJvdW5kID0gcmVxdWlyZSgnLi9zdXJyb3VuZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHF1b3RlKHN0ciwgcXVvdGVDaGFyKSB7XG4gIHJldHVybiBzdXJyb3VuZChzdHIsIHF1b3RlQ2hhciB8fCAnXCInKTtcbn07XG4iLCJ2YXIgbWFrZVN0cmluZyA9IHJlcXVpcmUoJy4vaGVscGVyL21ha2VTdHJpbmcnKTtcbnZhciBzdHJSZXBlYXQgPSByZXF1aXJlKCcuL2hlbHBlci9zdHJSZXBlYXQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByZXBlYXQoc3RyLCBxdHksIHNlcGFyYXRvcikge1xuICBzdHIgPSBtYWtlU3RyaW5nKHN0cik7XG5cbiAgcXR5ID0gfn5xdHk7XG5cbiAgLy8gdXNpbmcgZmFzdGVyIGltcGxlbWVudGF0aW9uIGlmIHNlcGFyYXRvciBpcyBub3QgbmVlZGVkO1xuICBpZiAoc2VwYXJhdG9yID09IG51bGwpIHJldHVybiBzdHJSZXBlYXQoc3RyLCBxdHkpO1xuXG4gIC8vIHRoaXMgb25lIGlzIGFib3V0IDMwMHggc2xvd2VyIGluIEdvb2dsZSBDaHJvbWVcbiAgLyplc2xpbnQgbm8tZW1wdHk6IDAqL1xuICBmb3IgKHZhciByZXBlYXQgPSBbXTsgcXR5ID4gMDsgcmVwZWF0Wy0tcXR5XSA9IHN0cikge31cbiAgcmV0dXJuIHJlcGVhdC5qb2luKHNlcGFyYXRvcik7XG59O1xuIiwidmFyIG1ha2VTdHJpbmcgPSByZXF1aXJlKCcuL2hlbHBlci9tYWtlU3RyaW5nJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcmVwbGFjZUFsbChzdHIsIGZpbmQsIHJlcGxhY2UsIGlnbm9yZWNhc2UpIHtcbiAgdmFyIGZsYWdzID0gKGlnbm9yZWNhc2UgPT09IHRydWUpPydnaSc6J2cnO1xuICB2YXIgcmVnID0gbmV3IFJlZ0V4cChmaW5kLCBmbGFncyk7XG5cbiAgcmV0dXJuIG1ha2VTdHJpbmcoc3RyKS5yZXBsYWNlKHJlZywgcmVwbGFjZSk7XG59O1xuIiwidmFyIGNoYXJzID0gcmVxdWlyZSgnLi9jaGFycycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHJldmVyc2Uoc3RyKSB7XG4gIHJldHVybiBjaGFycyhzdHIpLnJldmVyc2UoKS5qb2luKCcnKTtcbn07XG4iLCJ2YXIgcGFkID0gcmVxdWlyZSgnLi9wYWQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBycGFkKHN0ciwgbGVuZ3RoLCBwYWRTdHIpIHtcbiAgcmV0dXJuIHBhZChzdHIsIGxlbmd0aCwgcGFkU3RyLCAncmlnaHQnKTtcbn07XG4iLCJ2YXIgbWFrZVN0cmluZyA9IHJlcXVpcmUoJy4vaGVscGVyL21ha2VTdHJpbmcnKTtcbnZhciBkZWZhdWx0VG9XaGl0ZVNwYWNlID0gcmVxdWlyZSgnLi9oZWxwZXIvZGVmYXVsdFRvV2hpdGVTcGFjZScpO1xudmFyIG5hdGl2ZVRyaW1SaWdodCA9IFN0cmluZy5wcm90b3R5cGUudHJpbVJpZ2h0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHJ0cmltKHN0ciwgY2hhcmFjdGVycykge1xuICBzdHIgPSBtYWtlU3RyaW5nKHN0cik7XG4gIGlmICghY2hhcmFjdGVycyAmJiBuYXRpdmVUcmltUmlnaHQpIHJldHVybiBuYXRpdmVUcmltUmlnaHQuY2FsbChzdHIpO1xuICBjaGFyYWN0ZXJzID0gZGVmYXVsdFRvV2hpdGVTcGFjZShjaGFyYWN0ZXJzKTtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKG5ldyBSZWdFeHAoY2hhcmFjdGVycyArICcrJCcpLCAnJyk7XG59O1xuIiwidmFyIHRyaW0gPSByZXF1aXJlKCcuL3RyaW0nKTtcbnZhciBkYXNoZXJpemUgPSByZXF1aXJlKCcuL2Rhc2hlcml6ZScpO1xudmFyIGNsZWFuRGlhY3JpdGljcyA9IHJlcXVpcmUoJy4vY2xlYW5EaWFjcml0aWNzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2x1Z2lmeShzdHIpIHtcbiAgcmV0dXJuIHRyaW0oZGFzaGVyaXplKGNsZWFuRGlhY3JpdGljcyhzdHIpLnJlcGxhY2UoL1teXFx3XFxzLV0vZywgJy0nKS50b0xvd2VyQ2FzZSgpKSwgJy0nKTtcbn07XG4iLCJ2YXIgY2hhcnMgPSByZXF1aXJlKCcuL2NoYXJzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3BsaWNlKHN0ciwgaSwgaG93bWFueSwgc3Vic3RyKSB7XG4gIHZhciBhcnIgPSBjaGFycyhzdHIpO1xuICBhcnIuc3BsaWNlKH5+aSwgfn5ob3dtYW55LCBzdWJzdHIpO1xuICByZXR1cm4gYXJyLmpvaW4oJycpO1xufTtcbiIsInZhciBkZXByZWNhdGUgPSByZXF1aXJlKCd1dGlsLWRlcHJlY2F0ZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlcHJlY2F0ZShyZXF1aXJlKCdzcHJpbnRmLWpzJykuc3ByaW50ZixcbiAgJ3NwcmludGYoKSB3aWxsIGJlIHJlbW92ZWQgaW4gdGhlIG5leHQgbWFqb3IgcmVsZWFzZSwgdXNlIHRoZSBzcHJpbnRmLWpzIHBhY2thZ2UgaW5zdGVhZC4nKTtcbiIsInZhciBtYWtlU3RyaW5nID0gcmVxdWlyZSgnLi9oZWxwZXIvbWFrZVN0cmluZycpO1xudmFyIHRvUG9zaXRpdmUgPSByZXF1aXJlKCcuL2hlbHBlci90b1Bvc2l0aXZlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3RhcnRzV2l0aChzdHIsIHN0YXJ0cywgcG9zaXRpb24pIHtcbiAgc3RyID0gbWFrZVN0cmluZyhzdHIpO1xuICBzdGFydHMgPSAnJyArIHN0YXJ0cztcbiAgcG9zaXRpb24gPSBwb3NpdGlvbiA9PSBudWxsID8gMCA6IE1hdGgubWluKHRvUG9zaXRpdmUocG9zaXRpb24pLCBzdHIubGVuZ3RoKTtcbiAgcmV0dXJuIHN0ci5sYXN0SW5kZXhPZihzdGFydHMsIHBvc2l0aW9uKSA9PT0gcG9zaXRpb247XG59O1xuIiwidmFyIG1ha2VTdHJpbmcgPSByZXF1aXJlKCcuL2hlbHBlci9tYWtlU3RyaW5nJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3RyTGVmdChzdHIsIHNlcCkge1xuICBzdHIgPSBtYWtlU3RyaW5nKHN0cik7XG4gIHNlcCA9IG1ha2VTdHJpbmcoc2VwKTtcbiAgdmFyIHBvcyA9ICFzZXAgPyAtMSA6IHN0ci5pbmRleE9mKHNlcCk7XG4gIHJldHVybn4gcG9zID8gc3RyLnNsaWNlKDAsIHBvcykgOiBzdHI7XG59O1xuIiwidmFyIG1ha2VTdHJpbmcgPSByZXF1aXJlKCcuL2hlbHBlci9tYWtlU3RyaW5nJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3RyTGVmdEJhY2soc3RyLCBzZXApIHtcbiAgc3RyID0gbWFrZVN0cmluZyhzdHIpO1xuICBzZXAgPSBtYWtlU3RyaW5nKHNlcCk7XG4gIHZhciBwb3MgPSBzdHIubGFzdEluZGV4T2Yoc2VwKTtcbiAgcmV0dXJufiBwb3MgPyBzdHIuc2xpY2UoMCwgcG9zKSA6IHN0cjtcbn07XG4iLCJ2YXIgbWFrZVN0cmluZyA9IHJlcXVpcmUoJy4vaGVscGVyL21ha2VTdHJpbmcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzdHJSaWdodChzdHIsIHNlcCkge1xuICBzdHIgPSBtYWtlU3RyaW5nKHN0cik7XG4gIHNlcCA9IG1ha2VTdHJpbmcoc2VwKTtcbiAgdmFyIHBvcyA9ICFzZXAgPyAtMSA6IHN0ci5pbmRleE9mKHNlcCk7XG4gIHJldHVybn4gcG9zID8gc3RyLnNsaWNlKHBvcyArIHNlcC5sZW5ndGgsIHN0ci5sZW5ndGgpIDogc3RyO1xufTtcbiIsInZhciBtYWtlU3RyaW5nID0gcmVxdWlyZSgnLi9oZWxwZXIvbWFrZVN0cmluZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHN0clJpZ2h0QmFjayhzdHIsIHNlcCkge1xuICBzdHIgPSBtYWtlU3RyaW5nKHN0cik7XG4gIHNlcCA9IG1ha2VTdHJpbmcoc2VwKTtcbiAgdmFyIHBvcyA9ICFzZXAgPyAtMSA6IHN0ci5sYXN0SW5kZXhPZihzZXApO1xuICByZXR1cm5+IHBvcyA/IHN0ci5zbGljZShwb3MgKyBzZXAubGVuZ3RoLCBzdHIubGVuZ3RoKSA6IHN0cjtcbn07XG4iLCJ2YXIgbWFrZVN0cmluZyA9IHJlcXVpcmUoJy4vaGVscGVyL21ha2VTdHJpbmcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzdHJpcFRhZ3Moc3RyKSB7XG4gIHJldHVybiBtYWtlU3RyaW5nKHN0cikucmVwbGFjZSgvPFxcLz9bXj5dKz4vZywgJycpO1xufTtcbiIsInZhciBhZGphY2VudCA9IHJlcXVpcmUoJy4vaGVscGVyL2FkamFjZW50Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3VjYyhzdHIpIHtcbiAgcmV0dXJuIGFkamFjZW50KHN0ciwgMSk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzdXJyb3VuZChzdHIsIHdyYXBwZXIpIHtcbiAgcmV0dXJuIFt3cmFwcGVyLCBzdHIsIHdyYXBwZXJdLmpvaW4oJycpO1xufTtcbiIsInZhciBtYWtlU3RyaW5nID0gcmVxdWlyZSgnLi9oZWxwZXIvbWFrZVN0cmluZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHN3YXBDYXNlKHN0cikge1xuICByZXR1cm4gbWFrZVN0cmluZyhzdHIpLnJlcGxhY2UoL1xcUy9nLCBmdW5jdGlvbihjKSB7XG4gICAgcmV0dXJuIGMgPT09IGMudG9VcHBlckNhc2UoKSA/IGMudG9Mb3dlckNhc2UoKSA6IGMudG9VcHBlckNhc2UoKTtcbiAgfSk7XG59O1xuIiwidmFyIG1ha2VTdHJpbmcgPSByZXF1aXJlKCcuL2hlbHBlci9tYWtlU3RyaW5nJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGl0bGVpemUoc3RyKSB7XG4gIHJldHVybiBtYWtlU3RyaW5nKHN0cikudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC8oPzpefFxcc3wtKVxcUy9nLCBmdW5jdGlvbihjKSB7XG4gICAgcmV0dXJuIGMudG9VcHBlckNhc2UoKTtcbiAgfSk7XG59O1xuIiwidmFyIHRyaW0gPSByZXF1aXJlKCcuL3RyaW0nKTtcblxuZnVuY3Rpb24gYm9vbE1hdGNoKHMsIG1hdGNoZXJzKSB7XG4gIHZhciBpLCBtYXRjaGVyLCBkb3duID0gcy50b0xvd2VyQ2FzZSgpO1xuICBtYXRjaGVycyA9IFtdLmNvbmNhdChtYXRjaGVycyk7XG4gIGZvciAoaSA9IDA7IGkgPCBtYXRjaGVycy5sZW5ndGg7IGkgKz0gMSkge1xuICAgIG1hdGNoZXIgPSBtYXRjaGVyc1tpXTtcbiAgICBpZiAoIW1hdGNoZXIpIGNvbnRpbnVlO1xuICAgIGlmIChtYXRjaGVyLnRlc3QgJiYgbWF0Y2hlci50ZXN0KHMpKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAobWF0Y2hlci50b0xvd2VyQ2FzZSgpID09PSBkb3duKSByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRvQm9vbGVhbihzdHIsIHRydWVWYWx1ZXMsIGZhbHNlVmFsdWVzKSB7XG4gIGlmICh0eXBlb2Ygc3RyID09PSAnbnVtYmVyJykgc3RyID0gJycgKyBzdHI7XG4gIGlmICh0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykgcmV0dXJuICEhc3RyO1xuICBzdHIgPSB0cmltKHN0cik7XG4gIGlmIChib29sTWF0Y2goc3RyLCB0cnVlVmFsdWVzIHx8IFsndHJ1ZScsICcxJ10pKSByZXR1cm4gdHJ1ZTtcbiAgaWYgKGJvb2xNYXRjaChzdHIsIGZhbHNlVmFsdWVzIHx8IFsnZmFsc2UnLCAnMCddKSkgcmV0dXJuIGZhbHNlO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdG9OdW1iZXIobnVtLCBwcmVjaXNpb24pIHtcbiAgaWYgKG51bSA9PSBudWxsKSByZXR1cm4gMDtcbiAgdmFyIGZhY3RvciA9IE1hdGgucG93KDEwLCBpc0Zpbml0ZShwcmVjaXNpb24pID8gcHJlY2lzaW9uIDogMCk7XG4gIHJldHVybiBNYXRoLnJvdW5kKG51bSAqIGZhY3RvcikgLyBmYWN0b3I7XG59O1xuIiwidmFyIHJ0cmltID0gcmVxdWlyZSgnLi9ydHJpbScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRvU2VudGVuY2UoYXJyYXksIHNlcGFyYXRvciwgbGFzdFNlcGFyYXRvciwgc2VyaWFsKSB7XG4gIHNlcGFyYXRvciA9IHNlcGFyYXRvciB8fCAnLCAnO1xuICBsYXN0U2VwYXJhdG9yID0gbGFzdFNlcGFyYXRvciB8fCAnIGFuZCAnO1xuICB2YXIgYSA9IGFycmF5LnNsaWNlKCksXG4gICAgbGFzdE1lbWJlciA9IGEucG9wKCk7XG5cbiAgaWYgKGFycmF5Lmxlbmd0aCA+IDIgJiYgc2VyaWFsKSBsYXN0U2VwYXJhdG9yID0gcnRyaW0oc2VwYXJhdG9yKSArIGxhc3RTZXBhcmF0b3I7XG5cbiAgcmV0dXJuIGEubGVuZ3RoID8gYS5qb2luKHNlcGFyYXRvcikgKyBsYXN0U2VwYXJhdG9yICsgbGFzdE1lbWJlciA6IGxhc3RNZW1iZXI7XG59O1xuIiwidmFyIHRvU2VudGVuY2UgPSByZXF1aXJlKCcuL3RvU2VudGVuY2UnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b1NlbnRlbmNlU2VyaWFsKGFycmF5LCBzZXAsIGxhc3RTZXApIHtcbiAgcmV0dXJuIHRvU2VudGVuY2UoYXJyYXksIHNlcCwgbGFzdFNlcCwgdHJ1ZSk7XG59O1xuIiwidmFyIG1ha2VTdHJpbmcgPSByZXF1aXJlKCcuL2hlbHBlci9tYWtlU3RyaW5nJyk7XG52YXIgZGVmYXVsdFRvV2hpdGVTcGFjZSA9IHJlcXVpcmUoJy4vaGVscGVyL2RlZmF1bHRUb1doaXRlU3BhY2UnKTtcbnZhciBuYXRpdmVUcmltID0gU3RyaW5nLnByb3RvdHlwZS50cmltO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRyaW0oc3RyLCBjaGFyYWN0ZXJzKSB7XG4gIHN0ciA9IG1ha2VTdHJpbmcoc3RyKTtcbiAgaWYgKCFjaGFyYWN0ZXJzICYmIG5hdGl2ZVRyaW0pIHJldHVybiBuYXRpdmVUcmltLmNhbGwoc3RyKTtcbiAgY2hhcmFjdGVycyA9IGRlZmF1bHRUb1doaXRlU3BhY2UoY2hhcmFjdGVycyk7XG4gIHJldHVybiBzdHIucmVwbGFjZShuZXcgUmVnRXhwKCdeJyArIGNoYXJhY3RlcnMgKyAnK3wnICsgY2hhcmFjdGVycyArICcrJCcsICdnJyksICcnKTtcbn07XG4iLCJ2YXIgbWFrZVN0cmluZyA9IHJlcXVpcmUoJy4vaGVscGVyL21ha2VTdHJpbmcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0cnVuY2F0ZShzdHIsIGxlbmd0aCwgdHJ1bmNhdGVTdHIpIHtcbiAgc3RyID0gbWFrZVN0cmluZyhzdHIpO1xuICB0cnVuY2F0ZVN0ciA9IHRydW5jYXRlU3RyIHx8ICcuLi4nO1xuICBsZW5ndGggPSB+fmxlbmd0aDtcbiAgcmV0dXJuIHN0ci5sZW5ndGggPiBsZW5ndGggPyBzdHIuc2xpY2UoMCwgbGVuZ3RoKSArIHRydW5jYXRlU3RyIDogc3RyO1xufTtcbiIsInZhciB0cmltID0gcmVxdWlyZSgnLi90cmltJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdW5kZXJzY29yZWQoc3RyKSB7XG4gIHJldHVybiB0cmltKHN0cikucmVwbGFjZSgvKFthLXpcXGRdKShbQS1aXSspL2csICckMV8kMicpLnJlcGxhY2UoL1stXFxzXSsvZywgJ18nKS50b0xvd2VyQ2FzZSgpO1xufTtcbiIsInZhciBtYWtlU3RyaW5nID0gcmVxdWlyZSgnLi9oZWxwZXIvbWFrZVN0cmluZycpO1xudmFyIGh0bWxFbnRpdGllcyA9IHJlcXVpcmUoJy4vaGVscGVyL2h0bWxFbnRpdGllcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHVuZXNjYXBlSFRNTChzdHIpIHtcbiAgcmV0dXJuIG1ha2VTdHJpbmcoc3RyKS5yZXBsYWNlKC9cXCYoW147XSspOy9nLCBmdW5jdGlvbihlbnRpdHksIGVudGl0eUNvZGUpIHtcbiAgICB2YXIgbWF0Y2g7XG5cbiAgICBpZiAoZW50aXR5Q29kZSBpbiBodG1sRW50aXRpZXMpIHtcbiAgICAgIHJldHVybiBodG1sRW50aXRpZXNbZW50aXR5Q29kZV07XG4gICAgLyplc2xpbnQgbm8tY29uZC1hc3NpZ246IDAqL1xuICAgIH0gZWxzZSBpZiAobWF0Y2ggPSBlbnRpdHlDb2RlLm1hdGNoKC9eI3goW1xcZGEtZkEtRl0rKSQvKSkge1xuICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQobWF0Y2hbMV0sIDE2KSk7XG4gICAgLyplc2xpbnQgbm8tY29uZC1hc3NpZ246IDAqL1xuICAgIH0gZWxzZSBpZiAobWF0Y2ggPSBlbnRpdHlDb2RlLm1hdGNoKC9eIyhcXGQrKSQvKSkge1xuICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUofn5tYXRjaFsxXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBlbnRpdHk7XG4gICAgfVxuICB9KTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHVucXVvdGUoc3RyLCBxdW90ZUNoYXIpIHtcbiAgcXVvdGVDaGFyID0gcXVvdGVDaGFyIHx8ICdcIic7XG4gIGlmIChzdHJbMF0gPT09IHF1b3RlQ2hhciAmJiBzdHJbc3RyLmxlbmd0aCAtIDFdID09PSBxdW90ZUNoYXIpXG4gICAgcmV0dXJuIHN0ci5zbGljZSgxLCBzdHIubGVuZ3RoIC0gMSk7XG4gIGVsc2UgcmV0dXJuIHN0cjtcbn07XG4iLCJ2YXIgZGVwcmVjYXRlID0gcmVxdWlyZSgndXRpbC1kZXByZWNhdGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZXByZWNhdGUocmVxdWlyZSgnc3ByaW50Zi1qcycpLnZzcHJpbnRmLFxuICAndnNwcmludGYoKSB3aWxsIGJlIHJlbW92ZWQgaW4gdGhlIG5leHQgbWFqb3IgcmVsZWFzZSwgdXNlIHRoZSBzcHJpbnRmLWpzIHBhY2thZ2UgaW5zdGVhZC4nKTtcbiIsInZhciBpc0JsYW5rID0gcmVxdWlyZSgnLi9pc0JsYW5rJyk7XG52YXIgdHJpbSA9IHJlcXVpcmUoJy4vdHJpbScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHdvcmRzKHN0ciwgZGVsaW1pdGVyKSB7XG4gIGlmIChpc0JsYW5rKHN0cikpIHJldHVybiBbXTtcbiAgcmV0dXJuIHRyaW0oc3RyLCBkZWxpbWl0ZXIpLnNwbGl0KGRlbGltaXRlciB8fCAvXFxzKy8pO1xufTtcbiIsIi8vIFdyYXBcbi8vIHdyYXBzIGEgc3RyaW5nIGJ5IGEgY2VydGFpbiB3aWR0aFxuXG52YXIgbWFrZVN0cmluZyA9IHJlcXVpcmUoJy4vaGVscGVyL21ha2VTdHJpbmcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB3cmFwKHN0ciwgb3B0aW9ucyl7XG4gIHN0ciA9IG1ha2VTdHJpbmcoc3RyKTtcbiAgXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBcbiAgdmFyIHdpZHRoID0gb3B0aW9ucy53aWR0aCB8fCA3NTtcbiAgdmFyIHNlcGVyYXRvciA9IG9wdGlvbnMuc2VwZXJhdG9yIHx8ICdcXG4nO1xuICB2YXIgY3V0ID0gb3B0aW9ucy5jdXQgfHwgZmFsc2U7XG4gIHZhciBwcmVzZXJ2ZVNwYWNlcyA9IG9wdGlvbnMucHJlc2VydmVTcGFjZXMgfHwgZmFsc2U7XG4gIHZhciB0cmFpbGluZ1NwYWNlcyA9IG9wdGlvbnMudHJhaWxpbmdTcGFjZXMgfHwgZmFsc2U7XG4gIFxuICB2YXIgcmVzdWx0O1xuICBcbiAgaWYod2lkdGggPD0gMCl7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxuICBcbiAgZWxzZSBpZighY3V0KXtcbiAgXG4gICAgdmFyIHdvcmRzID0gc3RyLnNwbGl0KCcgJyk7XG4gICAgdmFyIGN1cnJlbnRfY29sdW1uID0gMDtcbiAgICByZXN1bHQgPSAnJztcbiAgXG4gICAgd2hpbGUod29yZHMubGVuZ3RoID4gMCl7XG4gICAgICBcbiAgICAgIC8vIGlmIGFkZGluZyBhIHNwYWNlIGFuZCB0aGUgbmV4dCB3b3JkIHdvdWxkIGNhdXNlIHRoaXMgbGluZSB0byBiZSBsb25nZXIgdGhhbiB3aWR0aC4uLlxuICAgICAgaWYoMSArIHdvcmRzWzBdLmxlbmd0aCArIGN1cnJlbnRfY29sdW1uID4gd2lkdGgpe1xuICAgICAgICAvL3N0YXJ0IGEgbmV3IGxpbmUgaWYgdGhpcyBsaW5lIGlzIG5vdCBhbHJlYWR5IGVtcHR5XG4gICAgICAgIGlmKGN1cnJlbnRfY29sdW1uID4gMCl7XG4gICAgICAgICAgLy8gYWRkIGEgc3BhY2UgYXQgdGhlIGVuZCBvZiB0aGUgbGluZSBpcyBwcmVzZXJ2ZVNwYWNlcyBpcyB0cnVlXG4gICAgICAgICAgaWYgKHByZXNlcnZlU3BhY2VzKXtcbiAgICAgICAgICAgIHJlc3VsdCArPSAnICc7XG4gICAgICAgICAgICBjdXJyZW50X2NvbHVtbisrO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBmaWxsIHRoZSByZXN0IG9mIHRoZSBsaW5lIHdpdGggc3BhY2VzIGlmIHRyYWlsaW5nU3BhY2VzIG9wdGlvbiBpcyB0cnVlXG4gICAgICAgICAgZWxzZSBpZih0cmFpbGluZ1NwYWNlcyl7XG4gICAgICAgICAgICB3aGlsZShjdXJyZW50X2NvbHVtbiA8IHdpZHRoKXtcbiAgICAgICAgICAgICAgcmVzdWx0ICs9ICcgJztcbiAgICAgICAgICAgICAgY3VycmVudF9jb2x1bW4rKztcbiAgICAgICAgICAgIH0gICAgICAgICAgICBcbiAgICAgICAgICB9XG4gICAgICAgICAgLy9zdGFydCBuZXcgbGluZVxuICAgICAgICAgIHJlc3VsdCArPSBzZXBlcmF0b3I7XG4gICAgICAgICAgY3VycmVudF9jb2x1bW4gPSAwO1xuICAgICAgICB9XG4gICAgICB9XG4gIFxuICAgICAgLy8gaWYgbm90IGF0IHRoZSBiZWdpbmluZyBvZiB0aGUgbGluZSwgYWRkIGEgc3BhY2UgaW4gZnJvbnQgb2YgdGhlIHdvcmRcbiAgICAgIGlmKGN1cnJlbnRfY29sdW1uID4gMCl7XG4gICAgICAgIHJlc3VsdCArPSAnICc7XG4gICAgICAgIGN1cnJlbnRfY29sdW1uKys7XG4gICAgICB9XG4gIFxuICAgICAgLy8gdGFjayBvbiB0aGUgbmV4dCB3b3JkLCB1cGRhdGUgY3VycmVudCBjb2x1bW4sIGEgcG9wIHdvcmRzIGFycmF5XG4gICAgICByZXN1bHQgKz0gd29yZHNbMF07XG4gICAgICBjdXJyZW50X2NvbHVtbiArPSB3b3Jkc1swXS5sZW5ndGg7XG4gICAgICB3b3Jkcy5zaGlmdCgpO1xuICBcbiAgICB9XG4gIFxuICAgIC8vIGZpbGwgdGhlIHJlc3Qgb2YgdGhlIGxpbmUgd2l0aCBzcGFjZXMgaWYgdHJhaWxpbmdTcGFjZXMgb3B0aW9uIGlzIHRydWVcbiAgICBpZih0cmFpbGluZ1NwYWNlcyl7XG4gICAgICB3aGlsZShjdXJyZW50X2NvbHVtbiA8IHdpZHRoKXtcbiAgICAgICAgcmVzdWx0ICs9ICcgJztcbiAgICAgICAgY3VycmVudF9jb2x1bW4rKztcbiAgICAgIH0gICAgICAgICAgICBcbiAgICB9XG4gIFxuICAgIHJldHVybiByZXN1bHQ7XG4gIFxuICB9XG4gIFxuICBlbHNlIHtcbiAgXG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICByZXN1bHQgPSAnJztcbiAgXG4gICAgLy8gd2FsayB0aHJvdWdoIGVhY2ggY2hhcmFjdGVyIGFuZCBhZGQgc2VwZXJhdG9ycyB3aGVyZSBhcHByb3ByaWF0ZVxuICAgIHdoaWxlKGluZGV4IDwgc3RyLmxlbmd0aCl7XG4gICAgICBpZihpbmRleCAlIHdpZHRoID09IDAgJiYgaW5kZXggPiAwKXtcbiAgICAgICAgcmVzdWx0ICs9IHNlcGVyYXRvcjtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCArPSBzdHIuY2hhckF0KGluZGV4KTtcbiAgICAgIGluZGV4Kys7XG4gICAgfVxuICBcbiAgICAvLyBmaWxsIHRoZSByZXN0IG9mIHRoZSBsaW5lIHdpdGggc3BhY2VzIGlmIHRyYWlsaW5nU3BhY2VzIG9wdGlvbiBpcyB0cnVlXG4gICAgaWYodHJhaWxpbmdTcGFjZXMpe1xuICAgICAgd2hpbGUoaW5kZXggJSB3aWR0aCA+IDApe1xuICAgICAgICByZXN1bHQgKz0gJyAnO1xuICAgICAgICBpbmRleCsrO1xuICAgICAgfSAgICAgICAgICAgIFxuICAgIH1cbiAgICBcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59O1xuIiwicmVxdWlyZShcIm1vZGVybml6ci1kaXN0XCIpO1xuXG5Nb2Rlcm5penIuX2NvbmZpZy5jbGFzc1ByZWZpeCA9IFwibW9kLVwiO1xuTW9kZXJuaXpyLl9jb25maWcuZW5hYmxlQ2xhc3NlcyA9IGZhbHNlO1xuTW9kZXJuaXpyLl9jb25maWcuZW5hYmxlSlNDbGFzc2VzID0gZmFsc2U7XG5Nb2Rlcm5penIuYWRkVGVzdChcIndlYWttYXBcIiwgZnVuY3Rpb24oKSB7XG5cdHJldHVybiB3aW5kb3cuV2Vha01hcCAhPT0gdm9pZCAwO1xufSk7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xuTW9kZXJuaXpyLmFkZFRlc3QoXCJzdHJpY3Rtb2RlXCIsIGZ1bmN0aW9uKCkge1xuXHR0cnkgeyB1bmRlY2xhcmVkVmFyID0gMTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gdHJ1ZTsgfVxuXHRyZXR1cm4gZmFsc2U7XG59KTtcbi8qIGVzbGludC1lbmFibGUgbm8tdW5kZWYgKi9cblxubW9kdWxlLmV4cG9ydHMgPSB3aW5kb3cuTW9kZXJuaXpyO1xuIiwiLypcclxuICogQ29va2llcy5qcyAtIDEuMi4zXHJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9TY290dEhhbXBlci9Db29raWVzXHJcbiAqXHJcbiAqIFRoaXMgaXMgZnJlZSBhbmQgdW5lbmN1bWJlcmVkIHNvZnR3YXJlIHJlbGVhc2VkIGludG8gdGhlIHB1YmxpYyBkb21haW4uXHJcbiAqL1xyXG4oZnVuY3Rpb24gKGdsb2JhbCwgdW5kZWZpbmVkKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIGZhY3RvcnkgPSBmdW5jdGlvbiAod2luZG93KSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cuZG9jdW1lbnQgIT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ29va2llcy5qcyByZXF1aXJlcyBhIGB3aW5kb3dgIHdpdGggYSBgZG9jdW1lbnRgIG9iamVjdCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIENvb2tpZXMgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSwgb3B0aW9ucykge1xyXG4gICAgICAgICAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA9PT0gMSA/XHJcbiAgICAgICAgICAgICAgICBDb29raWVzLmdldChrZXkpIDogQ29va2llcy5zZXQoa2V5LCB2YWx1ZSwgb3B0aW9ucyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gQWxsb3dzIGZvciBzZXR0ZXIgaW5qZWN0aW9uIGluIHVuaXQgdGVzdHNcclxuICAgICAgICBDb29raWVzLl9kb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcclxuXHJcbiAgICAgICAgLy8gVXNlZCB0byBlbnN1cmUgY29va2llIGtleXMgZG8gbm90IGNvbGxpZGUgd2l0aFxyXG4gICAgICAgIC8vIGJ1aWx0LWluIGBPYmplY3RgIHByb3BlcnRpZXNcclxuICAgICAgICBDb29raWVzLl9jYWNoZUtleVByZWZpeCA9ICdjb29rZXkuJzsgLy8gSHVyciBodXJyLCA6KVxyXG4gICAgICAgIFxyXG4gICAgICAgIENvb2tpZXMuX21heEV4cGlyZURhdGUgPSBuZXcgRGF0ZSgnRnJpLCAzMSBEZWMgOTk5OSAyMzo1OTo1OSBVVEMnKTtcclxuXHJcbiAgICAgICAgQ29va2llcy5kZWZhdWx0cyA9IHtcclxuICAgICAgICAgICAgcGF0aDogJy8nLFxyXG4gICAgICAgICAgICBzZWN1cmU6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIGlmIChDb29raWVzLl9jYWNoZWREb2N1bWVudENvb2tpZSAhPT0gQ29va2llcy5fZG9jdW1lbnQuY29va2llKSB7XHJcbiAgICAgICAgICAgICAgICBDb29raWVzLl9yZW5ld0NhY2hlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IENvb2tpZXMuX2NhY2hlW0Nvb2tpZXMuX2NhY2hlS2V5UHJlZml4ICsga2V5XTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLnNldCA9IGZ1bmN0aW9uIChrZXksIHZhbHVlLCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSBDb29raWVzLl9nZXRFeHRlbmRlZE9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICAgICAgICAgIG9wdGlvbnMuZXhwaXJlcyA9IENvb2tpZXMuX2dldEV4cGlyZXNEYXRlKHZhbHVlID09PSB1bmRlZmluZWQgPyAtMSA6IG9wdGlvbnMuZXhwaXJlcyk7XHJcblxyXG4gICAgICAgICAgICBDb29raWVzLl9kb2N1bWVudC5jb29raWUgPSBDb29raWVzLl9nZW5lcmF0ZUNvb2tpZVN0cmluZyhrZXksIHZhbHVlLCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBDb29raWVzO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuZXhwaXJlID0gZnVuY3Rpb24gKGtleSwgb3B0aW9ucykge1xyXG4gICAgICAgICAgICByZXR1cm4gQ29va2llcy5zZXQoa2V5LCB1bmRlZmluZWQsIG9wdGlvbnMpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuX2dldEV4dGVuZGVkT3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBwYXRoOiBvcHRpb25zICYmIG9wdGlvbnMucGF0aCB8fCBDb29raWVzLmRlZmF1bHRzLnBhdGgsXHJcbiAgICAgICAgICAgICAgICBkb21haW46IG9wdGlvbnMgJiYgb3B0aW9ucy5kb21haW4gfHwgQ29va2llcy5kZWZhdWx0cy5kb21haW4sXHJcbiAgICAgICAgICAgICAgICBleHBpcmVzOiBvcHRpb25zICYmIG9wdGlvbnMuZXhwaXJlcyB8fCBDb29raWVzLmRlZmF1bHRzLmV4cGlyZXMsXHJcbiAgICAgICAgICAgICAgICBzZWN1cmU6IG9wdGlvbnMgJiYgb3B0aW9ucy5zZWN1cmUgIT09IHVuZGVmaW5lZCA/ICBvcHRpb25zLnNlY3VyZSA6IENvb2tpZXMuZGVmYXVsdHMuc2VjdXJlXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5faXNWYWxpZERhdGUgPSBmdW5jdGlvbiAoZGF0ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGRhdGUpID09PSAnW29iamVjdCBEYXRlXScgJiYgIWlzTmFOKGRhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9nZXRFeHBpcmVzRGF0ZSA9IGZ1bmN0aW9uIChleHBpcmVzLCBub3cpIHtcclxuICAgICAgICAgICAgbm93ID0gbm93IHx8IG5ldyBEYXRlKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGV4cGlyZXMgPT09ICdudW1iZXInKSB7XHJcbiAgICAgICAgICAgICAgICBleHBpcmVzID0gZXhwaXJlcyA9PT0gSW5maW5pdHkgP1xyXG4gICAgICAgICAgICAgICAgICAgIENvb2tpZXMuX21heEV4cGlyZURhdGUgOiBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgZXhwaXJlcyAqIDEwMDApO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBpcmVzID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgZXhwaXJlcyA9IG5ldyBEYXRlKGV4cGlyZXMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZXhwaXJlcyAmJiAhQ29va2llcy5faXNWYWxpZERhdGUoZXhwaXJlcykpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignYGV4cGlyZXNgIHBhcmFtZXRlciBjYW5ub3QgYmUgY29udmVydGVkIHRvIGEgdmFsaWQgRGF0ZSBpbnN0YW5jZScpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZXhwaXJlcztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9nZW5lcmF0ZUNvb2tpZVN0cmluZyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlLCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGtleSA9IGtleS5yZXBsYWNlKC9bXiMkJitcXF5gfF0vZywgZW5jb2RlVVJJQ29tcG9uZW50KTtcclxuICAgICAgICAgICAga2V5ID0ga2V5LnJlcGxhY2UoL1xcKC9nLCAnJTI4JykucmVwbGFjZSgvXFwpL2csICclMjknKTtcclxuICAgICAgICAgICAgdmFsdWUgPSAodmFsdWUgKyAnJykucmVwbGFjZSgvW14hIyQmLStcXC0tOjwtXFxbXFxdLX5dL2csIGVuY29kZVVSSUNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cclxuICAgICAgICAgICAgdmFyIGNvb2tpZVN0cmluZyA9IGtleSArICc9JyArIHZhbHVlO1xyXG4gICAgICAgICAgICBjb29raWVTdHJpbmcgKz0gb3B0aW9ucy5wYXRoID8gJztwYXRoPScgKyBvcHRpb25zLnBhdGggOiAnJztcclxuICAgICAgICAgICAgY29va2llU3RyaW5nICs9IG9wdGlvbnMuZG9tYWluID8gJztkb21haW49JyArIG9wdGlvbnMuZG9tYWluIDogJyc7XHJcbiAgICAgICAgICAgIGNvb2tpZVN0cmluZyArPSBvcHRpb25zLmV4cGlyZXMgPyAnO2V4cGlyZXM9JyArIG9wdGlvbnMuZXhwaXJlcy50b1VUQ1N0cmluZygpIDogJyc7XHJcbiAgICAgICAgICAgIGNvb2tpZVN0cmluZyArPSBvcHRpb25zLnNlY3VyZSA/ICc7c2VjdXJlJyA6ICcnO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNvb2tpZVN0cmluZztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9nZXRDYWNoZUZyb21TdHJpbmcgPSBmdW5jdGlvbiAoZG9jdW1lbnRDb29raWUpIHtcclxuICAgICAgICAgICAgdmFyIGNvb2tpZUNhY2hlID0ge307XHJcbiAgICAgICAgICAgIHZhciBjb29raWVzQXJyYXkgPSBkb2N1bWVudENvb2tpZSA/IGRvY3VtZW50Q29va2llLnNwbGl0KCc7ICcpIDogW107XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvb2tpZXNBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvb2tpZUt2cCA9IENvb2tpZXMuX2dldEtleVZhbHVlUGFpckZyb21Db29raWVTdHJpbmcoY29va2llc0FycmF5W2ldKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY29va2llQ2FjaGVbQ29va2llcy5fY2FjaGVLZXlQcmVmaXggKyBjb29raWVLdnAua2V5XSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29va2llQ2FjaGVbQ29va2llcy5fY2FjaGVLZXlQcmVmaXggKyBjb29raWVLdnAua2V5XSA9IGNvb2tpZUt2cC52YWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNvb2tpZUNhY2hlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuX2dldEtleVZhbHVlUGFpckZyb21Db29raWVTdHJpbmcgPSBmdW5jdGlvbiAoY29va2llU3RyaW5nKSB7XHJcbiAgICAgICAgICAgIC8vIFwiPVwiIGlzIGEgdmFsaWQgY2hhcmFjdGVyIGluIGEgY29va2llIHZhbHVlIGFjY29yZGluZyB0byBSRkM2MjY1LCBzbyBjYW5ub3QgYHNwbGl0KCc9JylgXHJcbiAgICAgICAgICAgIHZhciBzZXBhcmF0b3JJbmRleCA9IGNvb2tpZVN0cmluZy5pbmRleE9mKCc9Jyk7XHJcblxyXG4gICAgICAgICAgICAvLyBJRSBvbWl0cyB0aGUgXCI9XCIgd2hlbiB0aGUgY29va2llIHZhbHVlIGlzIGFuIGVtcHR5IHN0cmluZ1xyXG4gICAgICAgICAgICBzZXBhcmF0b3JJbmRleCA9IHNlcGFyYXRvckluZGV4IDwgMCA/IGNvb2tpZVN0cmluZy5sZW5ndGggOiBzZXBhcmF0b3JJbmRleDtcclxuXHJcbiAgICAgICAgICAgIHZhciBrZXkgPSBjb29raWVTdHJpbmcuc3Vic3RyKDAsIHNlcGFyYXRvckluZGV4KTtcclxuICAgICAgICAgICAgdmFyIGRlY29kZWRLZXk7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBkZWNvZGVkS2V5ID0gZGVjb2RlVVJJQ29tcG9uZW50KGtleSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjb25zb2xlICYmIHR5cGVvZiBjb25zb2xlLmVycm9yID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignQ291bGQgbm90IGRlY29kZSBjb29raWUgd2l0aCBrZXkgXCInICsga2V5ICsgJ1wiJywgZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBrZXk6IGRlY29kZWRLZXksXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogY29va2llU3RyaW5nLnN1YnN0cihzZXBhcmF0b3JJbmRleCArIDEpIC8vIERlZmVyIGRlY29kaW5nIHZhbHVlIHVudGlsIGFjY2Vzc2VkXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fcmVuZXdDYWNoZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgQ29va2llcy5fY2FjaGUgPSBDb29raWVzLl9nZXRDYWNoZUZyb21TdHJpbmcoQ29va2llcy5fZG9jdW1lbnQuY29va2llKTtcclxuICAgICAgICAgICAgQ29va2llcy5fY2FjaGVkRG9jdW1lbnRDb29raWUgPSBDb29raWVzLl9kb2N1bWVudC5jb29raWU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fYXJlRW5hYmxlZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHRlc3RLZXkgPSAnY29va2llcy5qcyc7XHJcbiAgICAgICAgICAgIHZhciBhcmVFbmFibGVkID0gQ29va2llcy5zZXQodGVzdEtleSwgMSkuZ2V0KHRlc3RLZXkpID09PSAnMSc7XHJcbiAgICAgICAgICAgIENvb2tpZXMuZXhwaXJlKHRlc3RLZXkpO1xyXG4gICAgICAgICAgICByZXR1cm4gYXJlRW5hYmxlZDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLmVuYWJsZWQgPSBDb29raWVzLl9hcmVFbmFibGVkKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBDb29raWVzO1xyXG4gICAgfTtcclxuICAgIHZhciBjb29raWVzRXhwb3J0ID0gKGdsb2JhbCAmJiB0eXBlb2YgZ2xvYmFsLmRvY3VtZW50ID09PSAnb2JqZWN0JykgPyBmYWN0b3J5KGdsb2JhbCkgOiBmYWN0b3J5O1xyXG5cclxuICAgIC8vIEFNRCBzdXBwb3J0XHJcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XHJcbiAgICAgICAgZGVmaW5lKGZ1bmN0aW9uICgpIHsgcmV0dXJuIGNvb2tpZXNFeHBvcnQ7IH0pO1xyXG4gICAgLy8gQ29tbW9uSlMvTm9kZS5qcyBzdXBwb3J0XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIC8vIFN1cHBvcnQgTm9kZS5qcyBzcGVjaWZpYyBgbW9kdWxlLmV4cG9ydHNgICh3aGljaCBjYW4gYmUgYSBmdW5jdGlvbilcclxuICAgICAgICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBjb29raWVzRXhwb3J0O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBCdXQgYWx3YXlzIHN1cHBvcnQgQ29tbW9uSlMgbW9kdWxlIDEuMS4xIHNwZWMgKGBleHBvcnRzYCBjYW5ub3QgYmUgYSBmdW5jdGlvbilcclxuICAgICAgICBleHBvcnRzLkNvb2tpZXMgPSBjb29raWVzRXhwb3J0O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBnbG9iYWwuQ29va2llcyA9IGNvb2tpZXNFeHBvcnQ7XHJcbiAgICB9XHJcbn0pKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8gdGhpcyA6IHdpbmRvdyk7IiwiLyohXG4gKiBtb2Rlcm5penIgdjMuNi4wXG4gKiBCdWlsZCBodHRwczovL21vZGVybml6ci5jb20vZG93bmxvYWQ/LWJhY2tncm91bmRibGVuZG1vZGUtYmFja2dyb3VuZGNsaXB0ZXh0LWJhY2tncm91bmRzaXplLWJncG9zaXRpb25zaG9ydGhhbmQtYmdwb3NpdGlvbnh5LWJncmVwZWF0c3BhY2VfYmdyZXBlYXRyb3VuZC1iZ3NpemVjb3Zlci1ibG9idXJscy1ib3JkZXJyYWRpdXMtYm94c2hhZG93LWJveHNpemluZy1jYW52YXMtY2FudmFzYmxlbmRpbmctY2FudmFzdGV4dC1jYW52YXN3aW5kaW5nLWNsYXNzbGlzdC1jb250YWlucy1jc3NhbmltYXRpb25zLWNzc2NhbGMtY3NzY2h1bml0LWNzc2V4dW5pdC1jc3NncmFkaWVudHMtY3NzcG9pbnRlcmV2ZW50cy1jc3Nwb3NpdGlvbnN0aWNreS1jc3Nwc2V1ZG9hbmltYXRpb25zLWNzc3BzZXVkb3RyYW5zaXRpb25zLWNzc3JlbXVuaXQtY3NzcmVzaXplLWNzc3RyYW5zZm9ybXMtY3NzdHJhbnNmb3JtczNkLWNzc3RyYW5zaXRpb25zLWNzc3ZodW5pdC1jc3N2bWF4dW5pdC1jc3N2bWludW5pdC1jc3N2d3VuaXQtY3ViaWNiZXppZXJyYW5nZS1kYXRhdXJpLWRldmljZW1vdGlvbl9kZXZpY2VvcmllbnRhdGlvbi1kb2N1bWVudGZyYWdtZW50LWVsbGlwc2lzLWVzNmFycmF5LWVzNm1hdGgtZXM2bnVtYmVyLWVzNm9iamVjdC1lczZzdHJpbmctZmxleGJveC1mbGV4d3JhcC1mb250ZmFjZS1mdWxsc2NyZWVuLWdlbmVyYXRlZGNvbnRlbnQtZ2VuZXJhdG9ycy1oYXNoY2hhbmdlLWhpZGRlbnNjcm9sbC1oaXN0b3J5LWhzbGEtaW5saW5lc3ZnLWpzb24tbGFzdGNoaWxkLW1lZGlhcXVlcmllcy1tdWx0aXBsZWJncy1tdXRhdGlvbm9ic2VydmVyLW50aGNoaWxkLW9iamVjdGZpdC1vcGFjaXR5LXBhZ2V2aXNpYmlsaXR5LXBlcmZvcm1hbmNlLXBvaW50ZXJldmVudHMtcG9zdG1lc3NhZ2UtcHJlc2VydmUzZC1wcm9taXNlcy1xdWVyeXNlbGVjdG9yLXJlcXVlc3RhbmltYXRpb25mcmFtZS1yZ2JhLXNjcmlwdGFzeW5jLXNjcmlwdGRlZmVyLXNpYmxpbmdnZW5lcmFsLXNpemVzLXNtaWwtc3Jjc2V0LXN1YnBpeGVsZm9udC1zdXBwb3J0cy1zdmctc3ZnYXNpbWctc3ZnY2xpcHBhdGhzLXN2Z2ZpbHRlcnMtc3ZnZm9yZWlnbm9iamVjdC10YXJnZXQtdGVtcGxhdGVzdHJpbmdzLXRvZGF0YXVybGpwZWdfdG9kYXRhdXJscG5nX3RvZGF0YXVybHdlYnAtdXNlcnNlbGVjdC12aWRlby12aWRlb2F1dG9wbGF5LXZpZGVvbG9vcC12aWRlb3ByZWxvYWQtd2lsbGNoYW5nZS14aHIyLXhocnJlc3BvbnNldHlwZS14aHJyZXNwb25zZXR5cGVhcnJheWJ1ZmZlci14aHJyZXNwb25zZXR5cGVibG9iLWhhc2V2ZW50LW1xLXByZWZpeGVkLXByZWZpeGVkY3NzLWRvbnRtaW4tY3NzY2xhc3NwcmVmaXg6aGFzLVxuICpcbiAqIENvcHlyaWdodCAoYylcbiAqICBGYXJ1ayBBdGVzXG4gKiAgUGF1bCBJcmlzaFxuICogIEFsZXggU2V4dG9uXG4gKiAgUnlhbiBTZWRkb25cbiAqICBQYXRyaWNrIEtldHRuZXJcbiAqICBTdHUgQ294XG4gKiAgUmljaGFyZCBIZXJyZXJhXG5cbiAqIE1JVCBMaWNlbnNlXG4gKi9cblxuLypcbiAqIE1vZGVybml6ciB0ZXN0cyB3aGljaCBuYXRpdmUgQ1NTMyBhbmQgSFRNTDUgZmVhdHVyZXMgYXJlIGF2YWlsYWJsZSBpbiB0aGVcbiAqIGN1cnJlbnQgVUEgYW5kIG1ha2VzIHRoZSByZXN1bHRzIGF2YWlsYWJsZSB0byB5b3UgaW4gdHdvIHdheXM6IGFzIHByb3BlcnRpZXMgb25cbiAqIGEgZ2xvYmFsIGBNb2Rlcm5penJgIG9iamVjdCwgYW5kIGFzIGNsYXNzZXMgb24gdGhlIGA8aHRtbD5gIGVsZW1lbnQuIFRoaXNcbiAqIGluZm9ybWF0aW9uIGFsbG93cyB5b3UgdG8gcHJvZ3Jlc3NpdmVseSBlbmhhbmNlIHlvdXIgcGFnZXMgd2l0aCBhIGdyYW51bGFyIGxldmVsXG4gKiBvZiBjb250cm9sIG92ZXIgdGhlIGV4cGVyaWVuY2UuXG4qL1xuXG47KGZ1bmN0aW9uKHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCl7XG4gIHZhciB0ZXN0cyA9IFtdO1xuICBcblxuICAvKipcbiAgICpcbiAgICogTW9kZXJuaXpyUHJvdG8gaXMgdGhlIGNvbnN0cnVjdG9yIGZvciBNb2Rlcm5penJcbiAgICpcbiAgICogQGNsYXNzXG4gICAqIEBhY2Nlc3MgcHVibGljXG4gICAqL1xuXG4gIHZhciBNb2Rlcm5penJQcm90byA9IHtcbiAgICAvLyBUaGUgY3VycmVudCB2ZXJzaW9uLCBkdW1teVxuICAgIF92ZXJzaW9uOiAnMy42LjAnLFxuXG4gICAgLy8gQW55IHNldHRpbmdzIHRoYXQgZG9uJ3Qgd29yayBhcyBzZXBhcmF0ZSBtb2R1bGVzXG4gICAgLy8gY2FuIGdvIGluIGhlcmUgYXMgY29uZmlndXJhdGlvbi5cbiAgICBfY29uZmlnOiB7XG4gICAgICAnY2xhc3NQcmVmaXgnOiBcImhhcy1cIixcbiAgICAgICdlbmFibGVDbGFzc2VzJzogdHJ1ZSxcbiAgICAgICdlbmFibGVKU0NsYXNzJzogdHJ1ZSxcbiAgICAgICd1c2VQcmVmaXhlcyc6IHRydWVcbiAgICB9LFxuXG4gICAgLy8gUXVldWUgb2YgdGVzdHNcbiAgICBfcTogW10sXG5cbiAgICAvLyBTdHViIHRoZXNlIGZvciBwZW9wbGUgd2hvIGFyZSBsaXN0ZW5pbmdcbiAgICBvbjogZnVuY3Rpb24odGVzdCwgY2IpIHtcbiAgICAgIC8vIEkgZG9uJ3QgcmVhbGx5IHRoaW5rIHBlb3BsZSBzaG91bGQgZG8gdGhpcywgYnV0IHdlIGNhblxuICAgICAgLy8gc2FmZSBndWFyZCBpdCBhIGJpdC5cbiAgICAgIC8vIC0tIE5PVEU6OiB0aGlzIGdldHMgV0FZIG92ZXJyaWRkZW4gaW4gc3JjL2FkZFRlc3QgZm9yIGFjdHVhbCBhc3luYyB0ZXN0cy5cbiAgICAgIC8vIFRoaXMgaXMgaW4gY2FzZSBwZW9wbGUgbGlzdGVuIHRvIHN5bmNocm9ub3VzIHRlc3RzLiBJIHdvdWxkIGxlYXZlIGl0IG91dCxcbiAgICAgIC8vIGJ1dCB0aGUgY29kZSB0byAqZGlzYWxsb3cqIHN5bmMgdGVzdHMgaW4gdGhlIHJlYWwgdmVyc2lvbiBvZiB0aGlzXG4gICAgICAvLyBmdW5jdGlvbiBpcyBhY3R1YWxseSBsYXJnZXIgdGhhbiB0aGlzLlxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgY2Ioc2VsZlt0ZXN0XSk7XG4gICAgICB9LCAwKTtcbiAgICB9LFxuXG4gICAgYWRkVGVzdDogZnVuY3Rpb24obmFtZSwgZm4sIG9wdGlvbnMpIHtcbiAgICAgIHRlc3RzLnB1c2goe25hbWU6IG5hbWUsIGZuOiBmbiwgb3B0aW9uczogb3B0aW9uc30pO1xuICAgIH0sXG5cbiAgICBhZGRBc3luY1Rlc3Q6IGZ1bmN0aW9uKGZuKSB7XG4gICAgICB0ZXN0cy5wdXNoKHtuYW1lOiBudWxsLCBmbjogZm59KTtcbiAgICB9XG4gIH07XG5cbiAgXG5cbiAgLy8gRmFrZSBzb21lIG9mIE9iamVjdC5jcmVhdGUgc28gd2UgY2FuIGZvcmNlIG5vbiB0ZXN0IHJlc3VsdHMgdG8gYmUgbm9uIFwib3duXCIgcHJvcGVydGllcy5cbiAgdmFyIE1vZGVybml6ciA9IGZ1bmN0aW9uKCkge307XG4gIE1vZGVybml6ci5wcm90b3R5cGUgPSBNb2Rlcm5penJQcm90bztcblxuICAvLyBMZWFrIG1vZGVybml6ciBnbG9iYWxseSB3aGVuIHlvdSBgcmVxdWlyZWAgaXQgcmF0aGVyIHRoYW4gZm9yY2UgaXQgaGVyZS5cbiAgLy8gT3ZlcndyaXRlIG5hbWUgc28gY29uc3RydWN0b3IgbmFtZSBpcyBuaWNlciA6RFxuICBNb2Rlcm5penIgPSBuZXcgTW9kZXJuaXpyKCk7XG5cbiAgXG5cbiAgdmFyIGNsYXNzZXMgPSBbXTtcbiAgXG5cbiAgLyoqXG4gICAqIGlzIHJldHVybnMgYSBib29sZWFuIGlmIHRoZSB0eXBlb2YgYW4gb2JqIGlzIGV4YWN0bHkgdHlwZS5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqIEBmdW5jdGlvbiBpc1xuICAgKiBAcGFyYW0geyp9IG9iaiAtIEEgdGhpbmcgd2Ugd2FudCB0byBjaGVjayB0aGUgdHlwZSBvZlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSAtIEEgc3RyaW5nIHRvIGNvbXBhcmUgdGhlIHR5cGVvZiBhZ2FpbnN0XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuICBmdW5jdGlvbiBpcyhvYmosIHR5cGUpIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gdHlwZTtcbiAgfVxuICA7XG5cbiAgLyoqXG4gICAqIFJ1biB0aHJvdWdoIGFsbCB0ZXN0cyBhbmQgZGV0ZWN0IHRoZWlyIHN1cHBvcnQgaW4gdGhlIGN1cnJlbnQgVUEuXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cblxuICBmdW5jdGlvbiB0ZXN0UnVubmVyKCkge1xuICAgIHZhciBmZWF0dXJlTmFtZXM7XG4gICAgdmFyIGZlYXR1cmU7XG4gICAgdmFyIGFsaWFzSWR4O1xuICAgIHZhciByZXN1bHQ7XG4gICAgdmFyIG5hbWVJZHg7XG4gICAgdmFyIGZlYXR1cmVOYW1lO1xuICAgIHZhciBmZWF0dXJlTmFtZVNwbGl0O1xuXG4gICAgZm9yICh2YXIgZmVhdHVyZUlkeCBpbiB0ZXN0cykge1xuICAgICAgaWYgKHRlc3RzLmhhc093blByb3BlcnR5KGZlYXR1cmVJZHgpKSB7XG4gICAgICAgIGZlYXR1cmVOYW1lcyA9IFtdO1xuICAgICAgICBmZWF0dXJlID0gdGVzdHNbZmVhdHVyZUlkeF07XG4gICAgICAgIC8vIHJ1biB0aGUgdGVzdCwgdGhyb3cgdGhlIHJldHVybiB2YWx1ZSBpbnRvIHRoZSBNb2Rlcm5penIsXG4gICAgICAgIC8vIHRoZW4gYmFzZWQgb24gdGhhdCBib29sZWFuLCBkZWZpbmUgYW4gYXBwcm9wcmlhdGUgY2xhc3NOYW1lXG4gICAgICAgIC8vIGFuZCBwdXNoIGl0IGludG8gYW4gYXJyYXkgb2YgY2xhc3NlcyB3ZSdsbCBqb2luIGxhdGVyLlxuICAgICAgICAvL1xuICAgICAgICAvLyBJZiB0aGVyZSBpcyBubyBuYW1lLCBpdCdzIGFuICdhc3luYycgdGVzdCB0aGF0IGlzIHJ1bixcbiAgICAgICAgLy8gYnV0IG5vdCBkaXJlY3RseSBhZGRlZCB0byB0aGUgb2JqZWN0LiBUaGF0IHNob3VsZFxuICAgICAgICAvLyBiZSBkb25lIHdpdGggYSBwb3N0LXJ1biBhZGRUZXN0IGNhbGwuXG4gICAgICAgIGlmIChmZWF0dXJlLm5hbWUpIHtcbiAgICAgICAgICBmZWF0dXJlTmFtZXMucHVzaChmZWF0dXJlLm5hbWUudG9Mb3dlckNhc2UoKSk7XG5cbiAgICAgICAgICBpZiAoZmVhdHVyZS5vcHRpb25zICYmIGZlYXR1cmUub3B0aW9ucy5hbGlhc2VzICYmIGZlYXR1cmUub3B0aW9ucy5hbGlhc2VzLmxlbmd0aCkge1xuICAgICAgICAgICAgLy8gQWRkIGFsbCB0aGUgYWxpYXNlcyBpbnRvIHRoZSBuYW1lcyBsaXN0XG4gICAgICAgICAgICBmb3IgKGFsaWFzSWR4ID0gMDsgYWxpYXNJZHggPCBmZWF0dXJlLm9wdGlvbnMuYWxpYXNlcy5sZW5ndGg7IGFsaWFzSWR4KyspIHtcbiAgICAgICAgICAgICAgZmVhdHVyZU5hbWVzLnB1c2goZmVhdHVyZS5vcHRpb25zLmFsaWFzZXNbYWxpYXNJZHhdLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJ1biB0aGUgdGVzdCwgb3IgdXNlIHRoZSByYXcgdmFsdWUgaWYgaXQncyBub3QgYSBmdW5jdGlvblxuICAgICAgICByZXN1bHQgPSBpcyhmZWF0dXJlLmZuLCAnZnVuY3Rpb24nKSA/IGZlYXR1cmUuZm4oKSA6IGZlYXR1cmUuZm47XG5cblxuICAgICAgICAvLyBTZXQgZWFjaCBvZiB0aGUgbmFtZXMgb24gdGhlIE1vZGVybml6ciBvYmplY3RcbiAgICAgICAgZm9yIChuYW1lSWR4ID0gMDsgbmFtZUlkeCA8IGZlYXR1cmVOYW1lcy5sZW5ndGg7IG5hbWVJZHgrKykge1xuICAgICAgICAgIGZlYXR1cmVOYW1lID0gZmVhdHVyZU5hbWVzW25hbWVJZHhdO1xuICAgICAgICAgIC8vIFN1cHBvcnQgZG90IHByb3BlcnRpZXMgYXMgc3ViIHRlc3RzLiBXZSBkb24ndCBkbyBjaGVja2luZyB0byBtYWtlIHN1cmVcbiAgICAgICAgICAvLyB0aGF0IHRoZSBpbXBsaWVkIHBhcmVudCB0ZXN0cyBoYXZlIGJlZW4gYWRkZWQuIFlvdSBtdXN0IGNhbGwgdGhlbSBpblxuICAgICAgICAgIC8vIG9yZGVyIChlaXRoZXIgaW4gdGhlIHRlc3QsIG9yIG1ha2UgdGhlIHBhcmVudCB0ZXN0IGEgZGVwZW5kZW5jeSkuXG4gICAgICAgICAgLy9cbiAgICAgICAgICAvLyBDYXAgaXQgdG8gVFdPIHRvIG1ha2UgdGhlIGxvZ2ljIHNpbXBsZSBhbmQgYmVjYXVzZSB3aG8gbmVlZHMgdGhhdCBraW5kIG9mIHN1YnRlc3RpbmdcbiAgICAgICAgICAvLyBoYXNodGFnIGZhbW91cyBsYXN0IHdvcmRzXG4gICAgICAgICAgZmVhdHVyZU5hbWVTcGxpdCA9IGZlYXR1cmVOYW1lLnNwbGl0KCcuJyk7XG5cbiAgICAgICAgICBpZiAoZmVhdHVyZU5hbWVTcGxpdC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIE1vZGVybml6cltmZWF0dXJlTmFtZVNwbGl0WzBdXSA9IHJlc3VsdDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gY2FzdCB0byBhIEJvb2xlYW4sIGlmIG5vdCBvbmUgYWxyZWFkeVxuICAgICAgICAgICAgaWYgKE1vZGVybml6cltmZWF0dXJlTmFtZVNwbGl0WzBdXSAmJiAhKE1vZGVybml6cltmZWF0dXJlTmFtZVNwbGl0WzBdXSBpbnN0YW5jZW9mIEJvb2xlYW4pKSB7XG4gICAgICAgICAgICAgIE1vZGVybml6cltmZWF0dXJlTmFtZVNwbGl0WzBdXSA9IG5ldyBCb29sZWFuKE1vZGVybml6cltmZWF0dXJlTmFtZVNwbGl0WzBdXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIE1vZGVybml6cltmZWF0dXJlTmFtZVNwbGl0WzBdXVtmZWF0dXJlTmFtZVNwbGl0WzFdXSA9IHJlc3VsdDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjbGFzc2VzLnB1c2goKHJlc3VsdCA/ICcnIDogJ25vLScpICsgZmVhdHVyZU5hbWVTcGxpdC5qb2luKCctJykpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIDtcblxuICAvKipcbiAgICogZG9jRWxlbWVudCBpcyBhIGNvbnZlbmllbmNlIHdyYXBwZXIgdG8gZ3JhYiB0aGUgcm9vdCBlbGVtZW50IG9mIHRoZSBkb2N1bWVudFxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50fFNWR0VsZW1lbnR9IFRoZSByb290IGVsZW1lbnQgb2YgdGhlIGRvY3VtZW50XG4gICAqL1xuXG4gIHZhciBkb2NFbGVtZW50ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICBcblxuICAvKipcbiAgICogQSBjb252ZW5pZW5jZSBoZWxwZXIgdG8gY2hlY2sgaWYgdGhlIGRvY3VtZW50IHdlIGFyZSBydW5uaW5nIGluIGlzIGFuIFNWRyBkb2N1bWVudFxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuXG4gIHZhciBpc1NWRyA9IGRvY0VsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3N2Zyc7XG4gIFxuXG4gIC8qKlxuICAgKiBjcmVhdGVFbGVtZW50IGlzIGEgY29udmVuaWVuY2Ugd3JhcHBlciBhcm91bmQgZG9jdW1lbnQuY3JlYXRlRWxlbWVudC4gU2luY2Ugd2VcbiAgICogdXNlIGNyZWF0ZUVsZW1lbnQgYWxsIG92ZXIgdGhlIHBsYWNlLCB0aGlzIGFsbG93cyBmb3IgKHNsaWdodGx5KSBzbWFsbGVyIGNvZGVcbiAgICogYXMgd2VsbCBhcyBhYnN0cmFjdGluZyBhd2F5IGlzc3VlcyB3aXRoIGNyZWF0aW5nIGVsZW1lbnRzIGluIGNvbnRleHRzIG90aGVyIHRoYW5cbiAgICogSFRNTCBkb2N1bWVudHMgKGUuZy4gU1ZHIGRvY3VtZW50cykuXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKiBAZnVuY3Rpb24gY3JlYXRlRWxlbWVudFxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR8U1ZHRWxlbWVudH0gQW4gSFRNTCBvciBTVkcgZWxlbWVudFxuICAgKi9cblxuICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50KCkge1xuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gVGhpcyBpcyB0aGUgY2FzZSBpbiBJRTcsIHdoZXJlIHRoZSB0eXBlIG9mIGNyZWF0ZUVsZW1lbnQgaXMgXCJvYmplY3RcIi5cbiAgICAgIC8vIEZvciB0aGlzIHJlYXNvbiwgd2UgY2Fubm90IGNhbGwgYXBwbHkoKSBhcyBPYmplY3QgaXMgbm90IGEgRnVuY3Rpb24uXG4gICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChhcmd1bWVudHNbMF0pO1xuICAgIH0gZWxzZSBpZiAoaXNTVkcpIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMuY2FsbChkb2N1bWVudCwgJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgYXJndW1lbnRzWzBdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQuYXBwbHkoZG9jdW1lbnQsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgO1xuXG4gIC8qKlxuICAgKiBNb2Rlcm5penIuaGFzRXZlbnQoKSBkZXRlY3RzIHN1cHBvcnQgZm9yIGEgZ2l2ZW4gZXZlbnRcbiAgICpcbiAgICogQG1lbWJlcm9mIE1vZGVybml6clxuICAgKiBAbmFtZSBNb2Rlcm5penIuaGFzRXZlbnRcbiAgICogQG9wdGlvbk5hbWUgTW9kZXJuaXpyLmhhc0V2ZW50KClcbiAgICogQG9wdGlvblByb3AgaGFzRXZlbnRcbiAgICogQGFjY2VzcyBwdWJsaWNcbiAgICogQGZ1bmN0aW9uIGhhc0V2ZW50XG4gICAqIEBwYXJhbSAge3N0cmluZ3wqfSBldmVudE5hbWUgLSB0aGUgbmFtZSBvZiBhbiBldmVudCB0byB0ZXN0IGZvciAoZS5nLiBcInJlc2l6ZVwiKVxuICAgKiBAcGFyYW0gIHtFbGVtZW50fHN0cmluZ30gW2VsZW1lbnQ9SFRNTERpdkVsZW1lbnRdIC0gaXMgdGhlIGVsZW1lbnR8ZG9jdW1lbnR8d2luZG93fHRhZ05hbWUgdG8gdGVzdCBvblxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICogQGV4YW1wbGVcbiAgICogIGBNb2Rlcm5penIuaGFzRXZlbnRgIGxldHMgeW91IGRldGVybWluZSBpZiB0aGUgYnJvd3NlciBzdXBwb3J0cyBhIHN1cHBsaWVkIGV2ZW50LlxuICAgKiAgQnkgZGVmYXVsdCwgaXQgZG9lcyB0aGlzIGRldGVjdGlvbiBvbiBhIGRpdiBlbGVtZW50XG4gICAqXG4gICAqIGBgYGpzXG4gICAqICBoYXNFdmVudCgnYmx1cicpIC8vIHRydWU7XG4gICAqIGBgYFxuICAgKlxuICAgKiBIb3dldmVyLCB5b3UgYXJlIGFibGUgdG8gZ2l2ZSBhbiBvYmplY3QgYXMgYSBzZWNvbmQgYXJndW1lbnQgdG8gaGFzRXZlbnQgdG9cbiAgICogZGV0ZWN0IGFuIGV2ZW50IG9uIHNvbWV0aGluZyBvdGhlciB0aGFuIGEgZGl2LlxuICAgKlxuICAgKiBgYGBqc1xuICAgKiAgaGFzRXZlbnQoJ2RldmljZWxpZ2h0Jywgd2luZG93KSAvLyB0cnVlO1xuICAgKiBgYGBcbiAgICpcbiAgICovXG5cbiAgdmFyIGhhc0V2ZW50ID0gKGZ1bmN0aW9uKCkge1xuXG4gICAgLy8gRGV0ZWN0IHdoZXRoZXIgZXZlbnQgc3VwcG9ydCBjYW4gYmUgZGV0ZWN0ZWQgdmlhIGBpbmAuIFRlc3Qgb24gYSBET00gZWxlbWVudFxuICAgIC8vIHVzaW5nIHRoZSBcImJsdXJcIiBldmVudCBiL2MgaXQgc2hvdWxkIGFsd2F5cyBleGlzdC4gYml0Lmx5L2V2ZW50LWRldGVjdGlvblxuICAgIHZhciBuZWVkc0ZhbGxiYWNrID0gISgnb25ibHVyJyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpO1xuXG4gICAgZnVuY3Rpb24gaW5uZXIoZXZlbnROYW1lLCBlbGVtZW50KSB7XG5cbiAgICAgIHZhciBpc1N1cHBvcnRlZDtcbiAgICAgIGlmICghZXZlbnROYW1lKSB7IHJldHVybiBmYWxzZTsgfVxuICAgICAgaWYgKCFlbGVtZW50IHx8IHR5cGVvZiBlbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICBlbGVtZW50ID0gY3JlYXRlRWxlbWVudChlbGVtZW50IHx8ICdkaXYnKTtcbiAgICAgIH1cblxuICAgICAgLy8gVGVzdGluZyB2aWEgdGhlIGBpbmAgb3BlcmF0b3IgaXMgc3VmZmljaWVudCBmb3IgbW9kZXJuIGJyb3dzZXJzIGFuZCBJRS5cbiAgICAgIC8vIFdoZW4gdXNpbmcgYHNldEF0dHJpYnV0ZWAsIElFIHNraXBzIFwidW5sb2FkXCIsIFdlYktpdCBza2lwcyBcInVubG9hZFwiIGFuZFxuICAgICAgLy8gXCJyZXNpemVcIiwgd2hlcmVhcyBgaW5gIFwiY2F0Y2hlc1wiIHRob3NlLlxuICAgICAgZXZlbnROYW1lID0gJ29uJyArIGV2ZW50TmFtZTtcbiAgICAgIGlzU3VwcG9ydGVkID0gZXZlbnROYW1lIGluIGVsZW1lbnQ7XG5cbiAgICAgIC8vIEZhbGxiYWNrIHRlY2huaXF1ZSBmb3Igb2xkIEZpcmVmb3ggLSBiaXQubHkvZXZlbnQtZGV0ZWN0aW9uXG4gICAgICBpZiAoIWlzU3VwcG9ydGVkICYmIG5lZWRzRmFsbGJhY2spIHtcbiAgICAgICAgaWYgKCFlbGVtZW50LnNldEF0dHJpYnV0ZSkge1xuICAgICAgICAgIC8vIFN3aXRjaCB0byBnZW5lcmljIGVsZW1lbnQgaWYgaXQgbGFja3MgYHNldEF0dHJpYnV0ZWAuXG4gICAgICAgICAgLy8gSXQgY291bGQgYmUgdGhlIGBkb2N1bWVudGAsIGB3aW5kb3dgLCBvciBzb21ldGhpbmcgZWxzZS5cbiAgICAgICAgICBlbGVtZW50ID0gY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShldmVudE5hbWUsICcnKTtcbiAgICAgICAgaXNTdXBwb3J0ZWQgPSB0eXBlb2YgZWxlbWVudFtldmVudE5hbWVdID09PSAnZnVuY3Rpb24nO1xuXG4gICAgICAgIGlmIChlbGVtZW50W2V2ZW50TmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIC8vIElmIHByb3BlcnR5IHdhcyBjcmVhdGVkLCBcInJlbW92ZSBpdFwiIGJ5IHNldHRpbmcgdmFsdWUgdG8gYHVuZGVmaW5lZGAuXG4gICAgICAgICAgZWxlbWVudFtldmVudE5hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKGV2ZW50TmFtZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpc1N1cHBvcnRlZDtcbiAgICB9XG4gICAgcmV0dXJuIGlubmVyO1xuICB9KSgpO1xuXG5cbiAgTW9kZXJuaXpyUHJvdG8uaGFzRXZlbnQgPSBoYXNFdmVudDtcbiAgXG5cbiAgLyoqXG4gICAqIGdldEJvZHkgcmV0dXJucyB0aGUgYm9keSBvZiBhIGRvY3VtZW50LCBvciBhbiBlbGVtZW50IHRoYXQgY2FuIHN0YW5kIGluIGZvclxuICAgKiB0aGUgYm9keSBpZiBhIHJlYWwgYm9keSBkb2VzIG5vdCBleGlzdFxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICogQGZ1bmN0aW9uIGdldEJvZHlcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50fFNWR0VsZW1lbnR9IFJldHVybnMgdGhlIHJlYWwgYm9keSBvZiBhIGRvY3VtZW50LCBvciBhblxuICAgKiBhcnRpZmljaWFsbHkgY3JlYXRlZCBlbGVtZW50IHRoYXQgc3RhbmRzIGluIGZvciB0aGUgYm9keVxuICAgKi9cblxuICBmdW5jdGlvbiBnZXRCb2R5KCkge1xuICAgIC8vIEFmdGVyIHBhZ2UgbG9hZCBpbmplY3RpbmcgYSBmYWtlIGJvZHkgZG9lc24ndCB3b3JrIHNvIGNoZWNrIGlmIGJvZHkgZXhpc3RzXG4gICAgdmFyIGJvZHkgPSBkb2N1bWVudC5ib2R5O1xuXG4gICAgaWYgKCFib2R5KSB7XG4gICAgICAvLyBDYW4ndCB1c2UgdGhlIHJlYWwgYm9keSBjcmVhdGUgYSBmYWtlIG9uZS5cbiAgICAgIGJvZHkgPSBjcmVhdGVFbGVtZW50KGlzU1ZHID8gJ3N2ZycgOiAnYm9keScpO1xuICAgICAgYm9keS5mYWtlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gYm9keTtcbiAgfVxuXG4gIDtcblxuICAvKipcbiAgICogaW5qZWN0RWxlbWVudFdpdGhTdHlsZXMgaW5qZWN0cyBhbiBlbGVtZW50IHdpdGggc3R5bGUgZWxlbWVudCBhbmQgc29tZSBDU1MgcnVsZXNcbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqIEBmdW5jdGlvbiBpbmplY3RFbGVtZW50V2l0aFN0eWxlc1xuICAgKiBAcGFyYW0ge3N0cmluZ30gcnVsZSAtIFN0cmluZyByZXByZXNlbnRpbmcgYSBjc3MgcnVsZVxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIEEgZnVuY3Rpb24gdGhhdCBpcyB1c2VkIHRvIHRlc3QgdGhlIGluamVjdGVkIGVsZW1lbnRcbiAgICogQHBhcmFtIHtudW1iZXJ9IFtub2Rlc10gLSBBbiBpbnRlZ2VyIHJlcHJlc2VudGluZyB0aGUgbnVtYmVyIG9mIGFkZGl0aW9uYWwgbm9kZXMgeW91IHdhbnQgaW5qZWN0ZWRcbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gW3Rlc3RuYW1lc10gLSBBbiBhcnJheSBvZiBzdHJpbmdzIHRoYXQgYXJlIHVzZWQgYXMgaWRzIGZvciB0aGUgYWRkaXRpb25hbCBub2Rlc1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG5cbiAgZnVuY3Rpb24gaW5qZWN0RWxlbWVudFdpdGhTdHlsZXMocnVsZSwgY2FsbGJhY2ssIG5vZGVzLCB0ZXN0bmFtZXMpIHtcbiAgICB2YXIgbW9kID0gJ21vZGVybml6cic7XG4gICAgdmFyIHN0eWxlO1xuICAgIHZhciByZXQ7XG4gICAgdmFyIG5vZGU7XG4gICAgdmFyIGRvY092ZXJmbG93O1xuICAgIHZhciBkaXYgPSBjcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB2YXIgYm9keSA9IGdldEJvZHkoKTtcblxuICAgIGlmIChwYXJzZUludChub2RlcywgMTApKSB7XG4gICAgICAvLyBJbiBvcmRlciBub3QgdG8gZ2l2ZSBmYWxzZSBwb3NpdGl2ZXMgd2UgY3JlYXRlIGEgbm9kZSBmb3IgZWFjaCB0ZXN0XG4gICAgICAvLyBUaGlzIGFsc28gYWxsb3dzIHRoZSBtZXRob2QgdG8gc2NhbGUgZm9yIHVuc3BlY2lmaWVkIHVzZXNcbiAgICAgIHdoaWxlIChub2Rlcy0tKSB7XG4gICAgICAgIG5vZGUgPSBjcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgbm9kZS5pZCA9IHRlc3RuYW1lcyA/IHRlc3RuYW1lc1tub2Rlc10gOiBtb2QgKyAobm9kZXMgKyAxKTtcbiAgICAgICAgZGl2LmFwcGVuZENoaWxkKG5vZGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHN0eWxlID0gY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcbiAgICBzdHlsZS5pZCA9ICdzJyArIG1vZDtcblxuICAgIC8vIElFNiB3aWxsIGZhbHNlIHBvc2l0aXZlIG9uIHNvbWUgdGVzdHMgZHVlIHRvIHRoZSBzdHlsZSBlbGVtZW50IGluc2lkZSB0aGUgdGVzdCBkaXYgc29tZWhvdyBpbnRlcmZlcmluZyBvZmZzZXRIZWlnaHQsIHNvIGluc2VydCBpdCBpbnRvIGJvZHkgb3IgZmFrZWJvZHkuXG4gICAgLy8gT3BlcmEgd2lsbCBhY3QgYWxsIHF1aXJreSB3aGVuIGluamVjdGluZyBlbGVtZW50cyBpbiBkb2N1bWVudEVsZW1lbnQgd2hlbiBwYWdlIGlzIHNlcnZlZCBhcyB4bWwsIG5lZWRzIGZha2Vib2R5IHRvby4gIzI3MFxuICAgICghYm9keS5mYWtlID8gZGl2IDogYm9keSkuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgIGJvZHkuYXBwZW5kQ2hpbGQoZGl2KTtcblxuICAgIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG4gICAgICBzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBydWxlO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShydWxlKSk7XG4gICAgfVxuICAgIGRpdi5pZCA9IG1vZDtcblxuICAgIGlmIChib2R5LmZha2UpIHtcbiAgICAgIC8vYXZvaWQgY3Jhc2hpbmcgSUU4LCBpZiBiYWNrZ3JvdW5kIGltYWdlIGlzIHVzZWRcbiAgICAgIGJvZHkuc3R5bGUuYmFja2dyb3VuZCA9ICcnO1xuICAgICAgLy9TYWZhcmkgNS4xMy81LjEuNCBPU1ggc3RvcHMgbG9hZGluZyBpZiA6Oi13ZWJraXQtc2Nyb2xsYmFyIGlzIHVzZWQgYW5kIHNjcm9sbGJhcnMgYXJlIHZpc2libGVcbiAgICAgIGJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICAgIGRvY092ZXJmbG93ID0gZG9jRWxlbWVudC5zdHlsZS5vdmVyZmxvdztcbiAgICAgIGRvY0VsZW1lbnQuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICAgIGRvY0VsZW1lbnQuYXBwZW5kQ2hpbGQoYm9keSk7XG4gICAgfVxuXG4gICAgcmV0ID0gY2FsbGJhY2soZGl2LCBydWxlKTtcbiAgICAvLyBJZiB0aGlzIGlzIGRvbmUgYWZ0ZXIgcGFnZSBsb2FkIHdlIGRvbid0IHdhbnQgdG8gcmVtb3ZlIHRoZSBib2R5IHNvIGNoZWNrIGlmIGJvZHkgZXhpc3RzXG4gICAgaWYgKGJvZHkuZmFrZSkge1xuICAgICAgYm9keS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGJvZHkpO1xuICAgICAgZG9jRWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9IGRvY092ZXJmbG93O1xuICAgICAgLy8gVHJpZ2dlciBsYXlvdXQgc28ga2luZXRpYyBzY3JvbGxpbmcgaXNuJ3QgZGlzYWJsZWQgaW4gaU9TNitcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgICAgZG9jRWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpdi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRpdik7XG4gICAgfVxuXG4gICAgcmV0dXJuICEhcmV0O1xuXG4gIH1cblxuICA7XG5cbiAgLyoqXG4gICAqIE1vZGVybml6ci5tcSB0ZXN0cyBhIGdpdmVuIG1lZGlhIHF1ZXJ5LCBsaXZlIGFnYWluc3QgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIHdpbmRvd1xuICAgKiBhZGFwdGVkIGZyb20gbWF0Y2hNZWRpYSBwb2x5ZmlsbCBieSBTY290dCBKZWhsIGFuZCBQYXVsIElyaXNoXG4gICAqIGdpc3QuZ2l0aHViLmNvbS83ODY3NjhcbiAgICpcbiAgICogQG1lbWJlcm9mIE1vZGVybml6clxuICAgKiBAbmFtZSBNb2Rlcm5penIubXFcbiAgICogQG9wdGlvbk5hbWUgTW9kZXJuaXpyLm1xKClcbiAgICogQG9wdGlvblByb3AgbXFcbiAgICogQGFjY2VzcyBwdWJsaWNcbiAgICogQGZ1bmN0aW9uIG1xXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtcSAtIFN0cmluZyBvZiB0aGUgbWVkaWEgcXVlcnkgd2Ugd2FudCB0byB0ZXN0XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKiBAZXhhbXBsZVxuICAgKiBNb2Rlcm5penIubXEgYWxsb3dzIGZvciB5b3UgdG8gcHJvZ3JhbW1hdGljYWxseSBjaGVjayBpZiB0aGUgY3VycmVudCBicm93c2VyXG4gICAqIHdpbmRvdyBzdGF0ZSBtYXRjaGVzIGEgbWVkaWEgcXVlcnkuXG4gICAqXG4gICAqIGBgYGpzXG4gICAqICB2YXIgcXVlcnkgPSBNb2Rlcm5penIubXEoJyhtaW4td2lkdGg6IDkwMHB4KScpO1xuICAgKlxuICAgKiAgaWYgKHF1ZXJ5KSB7XG4gICAqICAgIC8vIHRoZSBicm93c2VyIHdpbmRvdyBpcyBsYXJnZXIgdGhhbiA5MDBweFxuICAgKiAgfVxuICAgKiBgYGBcbiAgICpcbiAgICogT25seSB2YWxpZCBtZWRpYSBxdWVyaWVzIGFyZSBzdXBwb3J0ZWQsIHRoZXJlZm9yZSB5b3UgbXVzdCBhbHdheXMgaW5jbHVkZSB2YWx1ZXNcbiAgICogd2l0aCB5b3VyIG1lZGlhIHF1ZXJ5XG4gICAqXG4gICAqIGBgYGpzXG4gICAqIC8vIGdvb2RcbiAgICogIE1vZGVybml6ci5tcSgnKG1pbi13aWR0aDogOTAwcHgpJyk7XG4gICAqXG4gICAqIC8vIGJhZFxuICAgKiAgTW9kZXJuaXpyLm1xKCdtaW4td2lkdGgnKTtcbiAgICogYGBgXG4gICAqXG4gICAqIElmIHlvdSB3b3VsZCBqdXN0IGxpa2UgdG8gdGVzdCB0aGF0IG1lZGlhIHF1ZXJpZXMgYXJlIHN1cHBvcnRlZCBpbiBnZW5lcmFsLCB1c2VcbiAgICpcbiAgICogYGBganNcbiAgICogIE1vZGVybml6ci5tcSgnb25seSBhbGwnKTsgLy8gdHJ1ZSBpZiBNUSBhcmUgc3VwcG9ydGVkLCBmYWxzZSBpZiBub3RcbiAgICogYGBgXG4gICAqXG4gICAqXG4gICAqIE5vdGUgdGhhdCBpZiB0aGUgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IG1lZGlhIHF1ZXJpZXMgKGUuZy4gb2xkIElFKSBtcSB3aWxsXG4gICAqIGFsd2F5cyByZXR1cm4gZmFsc2UuXG4gICAqL1xuXG4gIHZhciBtcSA9IChmdW5jdGlvbigpIHtcbiAgICB2YXIgbWF0Y2hNZWRpYSA9IHdpbmRvdy5tYXRjaE1lZGlhIHx8IHdpbmRvdy5tc01hdGNoTWVkaWE7XG4gICAgaWYgKG1hdGNoTWVkaWEpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihtcSkge1xuICAgICAgICB2YXIgbXFsID0gbWF0Y2hNZWRpYShtcSk7XG4gICAgICAgIHJldHVybiBtcWwgJiYgbXFsLm1hdGNoZXMgfHwgZmFsc2U7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbihtcSkge1xuICAgICAgdmFyIGJvb2wgPSBmYWxzZTtcblxuICAgICAgaW5qZWN0RWxlbWVudFdpdGhTdHlsZXMoJ0BtZWRpYSAnICsgbXEgKyAnIHsgI21vZGVybml6ciB7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgfSB9JywgZnVuY3Rpb24obm9kZSkge1xuICAgICAgICBib29sID0gKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlID9cbiAgICAgICAgICAgICAgICB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShub2RlLCBudWxsKSA6XG4gICAgICAgICAgICAgICAgbm9kZS5jdXJyZW50U3R5bGUpLnBvc2l0aW9uID09ICdhYnNvbHV0ZSc7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGJvb2w7XG4gICAgfTtcbiAgfSkoKTtcblxuXG4gIE1vZGVybml6clByb3RvLm1xID0gbXE7XG5cbiAgXG5cbiAgLyoqXG4gICAqIElmIHRoZSBicm93c2VycyBmb2xsb3cgdGhlIHNwZWMsIHRoZW4gdGhleSB3b3VsZCBleHBvc2UgdmVuZG9yLXNwZWNpZmljIHN0eWxlcyBhczpcbiAgICogICBlbGVtLnN0eWxlLldlYmtpdEJvcmRlclJhZGl1c1xuICAgKiBpbnN0ZWFkIG9mIHNvbWV0aGluZyBsaWtlIHRoZSBmb2xsb3dpbmcgKHdoaWNoIGlzIHRlY2huaWNhbGx5IGluY29ycmVjdCk6XG4gICAqICAgZWxlbS5zdHlsZS53ZWJraXRCb3JkZXJSYWRpdXNcblxuICAgKiBXZWJLaXQgZ2hvc3RzIHRoZWlyIHByb3BlcnRpZXMgaW4gbG93ZXJjYXNlIGJ1dCBPcGVyYSAmIE1veiBkbyBub3QuXG4gICAqIE1pY3Jvc29mdCB1c2VzIGEgbG93ZXJjYXNlIGBtc2AgaW5zdGVhZCBvZiB0aGUgY29ycmVjdCBgTXNgIGluIElFOCtcbiAgICogICBlcmlrLmVhZS5uZXQvYXJjaGl2ZXMvMjAwOC8wMy8xMC8yMS40OC4xMC9cblxuICAgKiBNb3JlIGhlcmU6IGdpdGh1Yi5jb20vTW9kZXJuaXpyL01vZGVybml6ci9pc3N1ZXMvaXNzdWUvMjFcbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2ZW5kb3Itc3BlY2lmaWMgc3R5bGUgcHJvcGVydGllc1xuICAgKi9cblxuICB2YXIgb21QcmVmaXhlcyA9ICdNb3ogTyBtcyBXZWJraXQnO1xuICBcblxuICB2YXIgY3Nzb21QcmVmaXhlcyA9IChNb2Rlcm5penJQcm90by5fY29uZmlnLnVzZVByZWZpeGVzID8gb21QcmVmaXhlcy5zcGxpdCgnICcpIDogW10pO1xuICBNb2Rlcm5penJQcm90by5fY3Nzb21QcmVmaXhlcyA9IGNzc29tUHJlZml4ZXM7XG4gIFxuXG5cbiAgLyoqXG4gICAqIGNvbnRhaW5zIGNoZWNrcyB0byBzZWUgaWYgYSBzdHJpbmcgY29udGFpbnMgYW5vdGhlciBzdHJpbmdcbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqIEBmdW5jdGlvbiBjb250YWluc1xuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyIC0gVGhlIHN0cmluZyB3ZSB3YW50IHRvIGNoZWNrIGZvciBzdWJzdHJpbmdzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdWJzdHIgLSBUaGUgc3Vic3RyaW5nIHdlIHdhbnQgdG8gc2VhcmNoIHRoZSBmaXJzdCBzdHJpbmcgZm9yXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuICBmdW5jdGlvbiBjb250YWlucyhzdHIsIHN1YnN0cikge1xuICAgIHJldHVybiAhIX4oJycgKyBzdHIpLmluZGV4T2Yoc3Vic3RyKTtcbiAgfVxuXG4gIDtcblxuICAvKipcbiAgICogQ3JlYXRlIG91ciBcIm1vZGVybml6clwiIGVsZW1lbnQgdGhhdCB3ZSBkbyBtb3N0IGZlYXR1cmUgdGVzdHMgb24uXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cblxuICB2YXIgbW9kRWxlbSA9IHtcbiAgICBlbGVtOiBjcmVhdGVFbGVtZW50KCdtb2Rlcm5penInKVxuICB9O1xuXG4gIC8vIENsZWFuIHVwIHRoaXMgZWxlbWVudFxuICBNb2Rlcm5penIuX3EucHVzaChmdW5jdGlvbigpIHtcbiAgICBkZWxldGUgbW9kRWxlbS5lbGVtO1xuICB9KTtcblxuICBcblxuICB2YXIgbVN0eWxlID0ge1xuICAgIHN0eWxlOiBtb2RFbGVtLmVsZW0uc3R5bGVcbiAgfTtcblxuICAvLyBraWxsIHJlZiBmb3IgZ2MsIG11c3QgaGFwcGVuIGJlZm9yZSBtb2QuZWxlbSBpcyByZW1vdmVkLCBzbyB3ZSB1bnNoaWZ0IG9uIHRvXG4gIC8vIHRoZSBmcm9udCBvZiB0aGUgcXVldWUuXG4gIE1vZGVybml6ci5fcS51bnNoaWZ0KGZ1bmN0aW9uKCkge1xuICAgIGRlbGV0ZSBtU3R5bGUuc3R5bGU7XG4gIH0pO1xuXG4gIFxuXG4gIC8qKlxuICAgKiBkb21Ub0NTUyB0YWtlcyBhIGNhbWVsQ2FzZSBzdHJpbmcgYW5kIGNvbnZlcnRzIGl0IHRvIGtlYmFiLWNhc2VcbiAgICogZS5nLiBib3hTaXppbmcgLT4gYm94LXNpemluZ1xuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICogQGZ1bmN0aW9uIGRvbVRvQ1NTXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gU3RyaW5nIG5hbWUgb2YgY2FtZWxDYXNlIHByb3Agd2Ugd2FudCB0byBjb252ZXJ0XG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBrZWJhYi1jYXNlIHZlcnNpb24gb2YgdGhlIHN1cHBsaWVkIG5hbWVcbiAgICovXG5cbiAgZnVuY3Rpb24gZG9tVG9DU1MobmFtZSkge1xuICAgIHJldHVybiBuYW1lLnJlcGxhY2UoLyhbQS1aXSkvZywgZnVuY3Rpb24oc3RyLCBtMSkge1xuICAgICAgcmV0dXJuICctJyArIG0xLnRvTG93ZXJDYXNlKCk7XG4gICAgfSkucmVwbGFjZSgvXm1zLS8sICctbXMtJyk7XG4gIH1cbiAgO1xuXG5cbiAgLyoqXG4gICAqIHdyYXBwZXIgYXJvdW5kIGdldENvbXB1dGVkU3R5bGUsIHRvIGZpeCBpc3N1ZXMgd2l0aCBGaXJlZm94IHJldHVybmluZyBudWxsIHdoZW5cbiAgICogY2FsbGVkIGluc2lkZSBvZiBhIGhpZGRlbiBpZnJhbWVcbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqIEBmdW5jdGlvbiBjb21wdXRlZFN0eWxlXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR8U1ZHRWxlbWVudH0gLSBUaGUgZWxlbWVudCB3ZSB3YW50IHRvIGZpbmQgdGhlIGNvbXB1dGVkIHN0eWxlcyBvZlxuICAgKiBAcGFyYW0ge3N0cmluZ3xudWxsfSBbcHNldWRvU2VsZWN0b3JdLSBBbiBvcHRpb25hbCBwc2V1ZG8gZWxlbWVudCBzZWxlY3RvciAoZS5nLiA6YmVmb3JlKSwgb2YgbnVsbCBpZiBub25lXG4gICAqIEByZXR1cm5zIHtDU1NTdHlsZURlY2xhcmF0aW9ufVxuICAgKi9cblxuICBmdW5jdGlvbiBjb21wdXRlZFN0eWxlKGVsZW0sIHBzZXVkbywgcHJvcCkge1xuICAgIHZhciByZXN1bHQ7XG5cbiAgICBpZiAoJ2dldENvbXB1dGVkU3R5bGUnIGluIHdpbmRvdykge1xuICAgICAgcmVzdWx0ID0gZ2V0Q29tcHV0ZWRTdHlsZS5jYWxsKHdpbmRvdywgZWxlbSwgcHNldWRvKTtcbiAgICAgIHZhciBjb25zb2xlID0gd2luZG93LmNvbnNvbGU7XG5cbiAgICAgIGlmIChyZXN1bHQgIT09IG51bGwpIHtcbiAgICAgICAgaWYgKHByb3ApIHtcbiAgICAgICAgICByZXN1bHQgPSByZXN1bHQuZ2V0UHJvcGVydHlWYWx1ZShwcm9wKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGNvbnNvbGUpIHtcbiAgICAgICAgICB2YXIgbWV0aG9kID0gY29uc29sZS5lcnJvciA/ICdlcnJvcicgOiAnbG9nJztcbiAgICAgICAgICBjb25zb2xlW21ldGhvZF0uY2FsbChjb25zb2xlLCAnZ2V0Q29tcHV0ZWRTdHlsZSByZXR1cm5pbmcgbnVsbCwgaXRzIHBvc3NpYmxlIG1vZGVybml6ciB0ZXN0IHJlc3VsdHMgYXJlIGluYWNjdXJhdGUnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQgPSAhcHNldWRvICYmIGVsZW0uY3VycmVudFN0eWxlICYmIGVsZW0uY3VycmVudFN0eWxlW3Byb3BdO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICA7XG5cbiAgLyoqXG4gICAqIG5hdGl2ZVRlc3RQcm9wcyBhbGxvd3MgZm9yIHVzIHRvIHVzZSBuYXRpdmUgZmVhdHVyZSBkZXRlY3Rpb24gZnVuY3Rpb25hbGl0eSBpZiBhdmFpbGFibGUuXG4gICAqIHNvbWUgcHJlZml4ZWQgZm9ybSwgb3IgZmFsc2UsIGluIHRoZSBjYXNlIG9mIGFuIHVuc3VwcG9ydGVkIHJ1bGVcbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqIEBmdW5jdGlvbiBuYXRpdmVUZXN0UHJvcHNcbiAgICogQHBhcmFtIHthcnJheX0gcHJvcHMgLSBBbiBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lc1xuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIHdlIHdhbnQgdG8gY2hlY2sgdmlhIEBzdXBwb3J0c1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbnx1bmRlZmluZWR9IEEgYm9vbGVhbiB3aGVuIEBzdXBwb3J0cyBleGlzdHMsIHVuZGVmaW5lZCBvdGhlcndpc2VcbiAgICovXG5cbiAgLy8gQWNjZXB0cyBhIGxpc3Qgb2YgcHJvcGVydHkgbmFtZXMgYW5kIGEgc2luZ2xlIHZhbHVlXG4gIC8vIFJldHVybnMgYHVuZGVmaW5lZGAgaWYgbmF0aXZlIGRldGVjdGlvbiBub3QgYXZhaWxhYmxlXG4gIGZ1bmN0aW9uIG5hdGl2ZVRlc3RQcm9wcyhwcm9wcywgdmFsdWUpIHtcbiAgICB2YXIgaSA9IHByb3BzLmxlbmd0aDtcbiAgICAvLyBTdGFydCB3aXRoIHRoZSBKUyBBUEk6IGh0dHA6Ly93d3cudzMub3JnL1RSL2NzczMtY29uZGl0aW9uYWwvI3RoZS1jc3MtaW50ZXJmYWNlXG4gICAgaWYgKCdDU1MnIGluIHdpbmRvdyAmJiAnc3VwcG9ydHMnIGluIHdpbmRvdy5DU1MpIHtcbiAgICAgIC8vIFRyeSBldmVyeSBwcmVmaXhlZCB2YXJpYW50IG9mIHRoZSBwcm9wZXJ0eVxuICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICBpZiAod2luZG93LkNTUy5zdXBwb3J0cyhkb21Ub0NTUyhwcm9wc1tpXSksIHZhbHVlKSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIE90aGVyd2lzZSBmYWxsIGJhY2sgdG8gYXQtcnVsZSAoZm9yIE9wZXJhIDEyLngpXG4gICAgZWxzZSBpZiAoJ0NTU1N1cHBvcnRzUnVsZScgaW4gd2luZG93KSB7XG4gICAgICAvLyBCdWlsZCBhIGNvbmRpdGlvbiBzdHJpbmcgZm9yIGV2ZXJ5IHByZWZpeGVkIHZhcmlhbnRcbiAgICAgIHZhciBjb25kaXRpb25UZXh0ID0gW107XG4gICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGNvbmRpdGlvblRleHQucHVzaCgnKCcgKyBkb21Ub0NTUyhwcm9wc1tpXSkgKyAnOicgKyB2YWx1ZSArICcpJyk7XG4gICAgICB9XG4gICAgICBjb25kaXRpb25UZXh0ID0gY29uZGl0aW9uVGV4dC5qb2luKCcgb3IgJyk7XG4gICAgICByZXR1cm4gaW5qZWN0RWxlbWVudFdpdGhTdHlsZXMoJ0BzdXBwb3J0cyAoJyArIGNvbmRpdGlvblRleHQgKyAnKSB7ICNtb2Rlcm5penIgeyBwb3NpdGlvbjogYWJzb2x1dGU7IH0gfScsIGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgcmV0dXJuIGNvbXB1dGVkU3R5bGUobm9kZSwgbnVsbCwgJ3Bvc2l0aW9uJykgPT0gJ2Fic29sdXRlJztcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIDtcblxuICAvKipcbiAgICogY3NzVG9ET00gdGFrZXMgYSBrZWJhYi1jYXNlIHN0cmluZyBhbmQgY29udmVydHMgaXQgdG8gY2FtZWxDYXNlXG4gICAqIGUuZy4gYm94LXNpemluZyAtPiBib3hTaXppbmdcbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqIEBmdW5jdGlvbiBjc3NUb0RPTVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIFN0cmluZyBuYW1lIG9mIGtlYmFiLWNhc2UgcHJvcCB3ZSB3YW50IHRvIGNvbnZlcnRcbiAgICogQHJldHVybnMge3N0cmluZ30gVGhlIGNhbWVsQ2FzZSB2ZXJzaW9uIG9mIHRoZSBzdXBwbGllZCBuYW1lXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGNzc1RvRE9NKG5hbWUpIHtcbiAgICByZXR1cm4gbmFtZS5yZXBsYWNlKC8oW2Etel0pLShbYS16XSkvZywgZnVuY3Rpb24oc3RyLCBtMSwgbTIpIHtcbiAgICAgIHJldHVybiBtMSArIG0yLnRvVXBwZXJDYXNlKCk7XG4gICAgfSkucmVwbGFjZSgvXi0vLCAnJyk7XG4gIH1cbiAgO1xuXG4gIC8vIHRlc3RQcm9wcyBpcyBhIGdlbmVyaWMgQ1NTIC8gRE9NIHByb3BlcnR5IHRlc3QuXG5cbiAgLy8gSW4gdGVzdGluZyBzdXBwb3J0IGZvciBhIGdpdmVuIENTUyBwcm9wZXJ0eSwgaXQncyBsZWdpdCB0byB0ZXN0OlxuICAvLyAgICBgZWxlbS5zdHlsZVtzdHlsZU5hbWVdICE9PSB1bmRlZmluZWRgXG4gIC8vIElmIHRoZSBwcm9wZXJ0eSBpcyBzdXBwb3J0ZWQgaXQgd2lsbCByZXR1cm4gYW4gZW1wdHkgc3RyaW5nLFxuICAvLyBpZiB1bnN1cHBvcnRlZCBpdCB3aWxsIHJldHVybiB1bmRlZmluZWQuXG5cbiAgLy8gV2UnbGwgdGFrZSBhZHZhbnRhZ2Ugb2YgdGhpcyBxdWljayB0ZXN0IGFuZCBza2lwIHNldHRpbmcgYSBzdHlsZVxuICAvLyBvbiBvdXIgbW9kZXJuaXpyIGVsZW1lbnQsIGJ1dCBpbnN0ZWFkIGp1c3QgdGVzdGluZyB1bmRlZmluZWQgdnNcbiAgLy8gZW1wdHkgc3RyaW5nLlxuXG4gIC8vIFByb3BlcnR5IG5hbWVzIGNhbiBiZSBwcm92aWRlZCBpbiBlaXRoZXIgY2FtZWxDYXNlIG9yIGtlYmFiLWNhc2UuXG5cbiAgZnVuY3Rpb24gdGVzdFByb3BzKHByb3BzLCBwcmVmaXhlZCwgdmFsdWUsIHNraXBWYWx1ZVRlc3QpIHtcbiAgICBza2lwVmFsdWVUZXN0ID0gaXMoc2tpcFZhbHVlVGVzdCwgJ3VuZGVmaW5lZCcpID8gZmFsc2UgOiBza2lwVmFsdWVUZXN0O1xuXG4gICAgLy8gVHJ5IG5hdGl2ZSBkZXRlY3QgZmlyc3RcbiAgICBpZiAoIWlzKHZhbHVlLCAndW5kZWZpbmVkJykpIHtcbiAgICAgIHZhciByZXN1bHQgPSBuYXRpdmVUZXN0UHJvcHMocHJvcHMsIHZhbHVlKTtcbiAgICAgIGlmICghaXMocmVzdWx0LCAndW5kZWZpbmVkJykpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBPdGhlcndpc2UgZG8gaXQgcHJvcGVybHlcbiAgICB2YXIgYWZ0ZXJJbml0LCBpLCBwcm9wc0xlbmd0aCwgcHJvcCwgYmVmb3JlO1xuXG4gICAgLy8gSWYgd2UgZG9uJ3QgaGF2ZSBhIHN0eWxlIGVsZW1lbnQsIHRoYXQgbWVhbnMgd2UncmUgcnVubmluZyBhc3luYyBvciBhZnRlclxuICAgIC8vIHRoZSBjb3JlIHRlc3RzLCBzbyB3ZSdsbCBuZWVkIHRvIGNyZWF0ZSBvdXIgb3duIGVsZW1lbnRzIHRvIHVzZVxuXG4gICAgLy8gaW5zaWRlIG9mIGFuIFNWRyBlbGVtZW50LCBpbiBjZXJ0YWluIGJyb3dzZXJzLCB0aGUgYHN0eWxlYCBlbGVtZW50IGlzIG9ubHlcbiAgICAvLyBkZWZpbmVkIGZvciB2YWxpZCB0YWdzLiBUaGVyZWZvcmUsIGlmIGBtb2Rlcm5penJgIGRvZXMgbm90IGhhdmUgb25lLCB3ZVxuICAgIC8vIGZhbGwgYmFjayB0byBhIGxlc3MgdXNlZCBlbGVtZW50IGFuZCBob3BlIGZvciB0aGUgYmVzdC5cbiAgICAvLyBmb3Igc3RyaWN0IFhIVE1MIGJyb3dzZXJzIHRoZSBoYXJkbHkgdXNlZCBzYW1wIGVsZW1lbnQgaXMgdXNlZFxuICAgIHZhciBlbGVtcyA9IFsnbW9kZXJuaXpyJywgJ3RzcGFuJywgJ3NhbXAnXTtcbiAgICB3aGlsZSAoIW1TdHlsZS5zdHlsZSAmJiBlbGVtcy5sZW5ndGgpIHtcbiAgICAgIGFmdGVySW5pdCA9IHRydWU7XG4gICAgICBtU3R5bGUubW9kRWxlbSA9IGNyZWF0ZUVsZW1lbnQoZWxlbXMuc2hpZnQoKSk7XG4gICAgICBtU3R5bGUuc3R5bGUgPSBtU3R5bGUubW9kRWxlbS5zdHlsZTtcbiAgICB9XG5cbiAgICAvLyBEZWxldGUgdGhlIG9iamVjdHMgaWYgd2UgY3JlYXRlZCB0aGVtLlxuICAgIGZ1bmN0aW9uIGNsZWFuRWxlbXMoKSB7XG4gICAgICBpZiAoYWZ0ZXJJbml0KSB7XG4gICAgICAgIGRlbGV0ZSBtU3R5bGUuc3R5bGU7XG4gICAgICAgIGRlbGV0ZSBtU3R5bGUubW9kRWxlbTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwcm9wc0xlbmd0aCA9IHByb3BzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgcHJvcHNMZW5ndGg7IGkrKykge1xuICAgICAgcHJvcCA9IHByb3BzW2ldO1xuICAgICAgYmVmb3JlID0gbVN0eWxlLnN0eWxlW3Byb3BdO1xuXG4gICAgICBpZiAoY29udGFpbnMocHJvcCwgJy0nKSkge1xuICAgICAgICBwcm9wID0gY3NzVG9ET00ocHJvcCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChtU3R5bGUuc3R5bGVbcHJvcF0gIT09IHVuZGVmaW5lZCkge1xuXG4gICAgICAgIC8vIElmIHZhbHVlIHRvIHRlc3QgaGFzIGJlZW4gcGFzc2VkIGluLCBkbyBhIHNldC1hbmQtY2hlY2sgdGVzdC5cbiAgICAgICAgLy8gMCAoaW50ZWdlcikgaXMgYSB2YWxpZCBwcm9wZXJ0eSB2YWx1ZSwgc28gY2hlY2sgdGhhdCBgdmFsdWVgIGlzbid0XG4gICAgICAgIC8vIHVuZGVmaW5lZCwgcmF0aGVyIHRoYW4ganVzdCBjaGVja2luZyBpdCdzIHRydXRoeS5cbiAgICAgICAgaWYgKCFza2lwVmFsdWVUZXN0ICYmICFpcyh2YWx1ZSwgJ3VuZGVmaW5lZCcpKSB7XG5cbiAgICAgICAgICAvLyBOZWVkcyBhIHRyeSBjYXRjaCBibG9jayBiZWNhdXNlIG9mIG9sZCBJRS4gVGhpcyBpcyBzbG93LCBidXQgd2lsbFxuICAgICAgICAgIC8vIGJlIGF2b2lkZWQgaW4gbW9zdCBjYXNlcyBiZWNhdXNlIGBza2lwVmFsdWVUZXN0YCB3aWxsIGJlIHVzZWQuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIG1TdHlsZS5zdHlsZVtwcm9wXSA9IHZhbHVlO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHt9XG5cbiAgICAgICAgICAvLyBJZiB0aGUgcHJvcGVydHkgdmFsdWUgaGFzIGNoYW5nZWQsIHdlIGFzc3VtZSB0aGUgdmFsdWUgdXNlZCBpc1xuICAgICAgICAgIC8vIHN1cHBvcnRlZC4gSWYgYHZhbHVlYCBpcyBlbXB0eSBzdHJpbmcsIGl0J2xsIGZhaWwgaGVyZSAoYmVjYXVzZVxuICAgICAgICAgIC8vIGl0IGhhc24ndCBjaGFuZ2VkKSwgd2hpY2ggbWF0Y2hlcyBob3cgYnJvd3NlcnMgaGF2ZSBpbXBsZW1lbnRlZFxuICAgICAgICAgIC8vIENTUy5zdXBwb3J0cygpXG4gICAgICAgICAgaWYgKG1TdHlsZS5zdHlsZVtwcm9wXSAhPSBiZWZvcmUpIHtcbiAgICAgICAgICAgIGNsZWFuRWxlbXMoKTtcbiAgICAgICAgICAgIHJldHVybiBwcmVmaXhlZCA9PSAncGZ4JyA/IHByb3AgOiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBPdGhlcndpc2UganVzdCByZXR1cm4gdHJ1ZSwgb3IgdGhlIHByb3BlcnR5IG5hbWUgaWYgdGhpcyBpcyBhXG4gICAgICAgIC8vIGBwcmVmaXhlZCgpYCBjYWxsXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGNsZWFuRWxlbXMoKTtcbiAgICAgICAgICByZXR1cm4gcHJlZml4ZWQgPT0gJ3BmeCcgPyBwcm9wIDogdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBjbGVhbkVsZW1zKCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIEphdmFTY3JpcHQgRE9NIHZhbHVlcyB1c2VkIGZvciB0ZXN0c1xuICAgKlxuICAgKiBAbWVtYmVyb2YgTW9kZXJuaXpyXG4gICAqIEBuYW1lIE1vZGVybml6ci5fZG9tUHJlZml4ZXNcbiAgICogQG9wdGlvbk5hbWUgTW9kZXJuaXpyLl9kb21QcmVmaXhlc1xuICAgKiBAb3B0aW9uUHJvcCBkb21QcmVmaXhlc1xuICAgKiBAYWNjZXNzIHB1YmxpY1xuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBNb2Rlcm5penIuX2RvbVByZWZpeGVzIGlzIGV4YWN0bHkgdGhlIHNhbWUgYXMgW19wcmVmaXhlc10oI21vZGVybml6ci1fcHJlZml4ZXMpLCBidXQgcmF0aGVyXG4gICAqIHRoYW4ga2ViYWItY2FzZSBwcm9wZXJ0aWVzLCBhbGwgcHJvcGVydGllcyBhcmUgdGhlaXIgQ2FwaXRhbGl6ZWQgdmFyaWFudFxuICAgKlxuICAgKiBgYGBqc1xuICAgKiBNb2Rlcm5penIuX2RvbVByZWZpeGVzID09PSBbIFwiTW96XCIsIFwiT1wiLCBcIm1zXCIsIFwiV2Via2l0XCIgXTtcbiAgICogYGBgXG4gICAqL1xuXG4gIHZhciBkb21QcmVmaXhlcyA9IChNb2Rlcm5penJQcm90by5fY29uZmlnLnVzZVByZWZpeGVzID8gb21QcmVmaXhlcy50b0xvd2VyQ2FzZSgpLnNwbGl0KCcgJykgOiBbXSk7XG4gIE1vZGVybml6clByb3RvLl9kb21QcmVmaXhlcyA9IGRvbVByZWZpeGVzO1xuICBcblxuICAvKipcbiAgICogZm5CaW5kIGlzIGEgc3VwZXIgc21hbGwgW2JpbmRdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0Z1bmN0aW9uL2JpbmQpIHBvbHlmaWxsLlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICogQGZ1bmN0aW9uIGZuQmluZFxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmbiAtIGEgZnVuY3Rpb24geW91IHdhbnQgdG8gY2hhbmdlIGB0aGlzYCByZWZlcmVuY2UgdG9cbiAgICogQHBhcmFtIHtvYmplY3R9IHRoYXQgLSB0aGUgYHRoaXNgIHlvdSB3YW50IHRvIGNhbGwgdGhlIGZ1bmN0aW9uIHdpdGhcbiAgICogQHJldHVybnMge2Z1bmN0aW9ufSBUaGUgd3JhcHBlZCB2ZXJzaW9uIG9mIHRoZSBzdXBwbGllZCBmdW5jdGlvblxuICAgKi9cblxuICBmdW5jdGlvbiBmbkJpbmQoZm4sIHRoYXQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9XG5cbiAgO1xuXG4gIC8qKlxuICAgKiB0ZXN0RE9NUHJvcHMgaXMgYSBnZW5lcmljIERPTSBwcm9wZXJ0eSB0ZXN0OyBpZiBhIGJyb3dzZXIgc3VwcG9ydHNcbiAgICogICBhIGNlcnRhaW4gcHJvcGVydHksIGl0IHdvbid0IHJldHVybiB1bmRlZmluZWQgZm9yIGl0LlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICogQGZ1bmN0aW9uIHRlc3RET01Qcm9wc1xuICAgKiBAcGFyYW0ge2FycmF5LjxzdHJpbmc+fSBwcm9wcyAtIEFuIGFycmF5IG9mIHByb3BlcnRpZXMgdG8gdGVzdCBmb3JcbiAgICogQHBhcmFtIHtvYmplY3R9IG9iaiAtIEFuIG9iamVjdCBvciBFbGVtZW50IHlvdSB3YW50IHRvIHVzZSB0byB0ZXN0IHRoZSBwYXJhbWV0ZXJzIGFnYWluXG4gICAqIEBwYXJhbSB7Ym9vbGVhbnxvYmplY3R9IGVsZW0gLSBBbiBFbGVtZW50IHRvIGJpbmQgdGhlIHByb3BlcnR5IGxvb2t1cCBhZ2Fpbi4gVXNlIGBmYWxzZWAgdG8gcHJldmVudCB0aGUgY2hlY2tcbiAgICogQHJldHVybnMge2ZhbHNlfCp9IHJldHVybnMgZmFsc2UgaWYgdGhlIHByb3AgaXMgdW5zdXBwb3J0ZWQsIG90aGVyd2lzZSB0aGUgdmFsdWUgdGhhdCBpcyBzdXBwb3J0ZWRcbiAgICovXG4gIGZ1bmN0aW9uIHRlc3RET01Qcm9wcyhwcm9wcywgb2JqLCBlbGVtKSB7XG4gICAgdmFyIGl0ZW07XG5cbiAgICBmb3IgKHZhciBpIGluIHByb3BzKSB7XG4gICAgICBpZiAocHJvcHNbaV0gaW4gb2JqKSB7XG5cbiAgICAgICAgLy8gcmV0dXJuIHRoZSBwcm9wZXJ0eSBuYW1lIGFzIGEgc3RyaW5nXG4gICAgICAgIGlmIChlbGVtID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybiBwcm9wc1tpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGl0ZW0gPSBvYmpbcHJvcHNbaV1dO1xuXG4gICAgICAgIC8vIGxldCdzIGJpbmQgYSBmdW5jdGlvblxuICAgICAgICBpZiAoaXMoaXRlbSwgJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgICAvLyBiaW5kIHRvIG9iaiB1bmxlc3Mgb3ZlcnJpZGVuXG4gICAgICAgICAgcmV0dXJuIGZuQmluZChpdGVtLCBlbGVtIHx8IG9iaik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZXR1cm4gdGhlIHVuYm91bmQgZnVuY3Rpb24gb3Igb2JqIG9yIHZhbHVlXG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICA7XG5cbiAgLyoqXG4gICAqIHRlc3RQcm9wc0FsbCB0ZXN0cyBhIGxpc3Qgb2YgRE9NIHByb3BlcnRpZXMgd2Ugd2FudCB0byBjaGVjayBhZ2FpbnN0LlxuICAgKiBXZSBzcGVjaWZ5IGxpdGVyYWxseSBBTEwgcG9zc2libGUgKGtub3duIGFuZC9vciBsaWtlbHkpIHByb3BlcnRpZXMgb25cbiAgICogdGhlIGVsZW1lbnQgaW5jbHVkaW5nIHRoZSBub24tdmVuZG9yIHByZWZpeGVkIG9uZSwgZm9yIGZvcndhcmQtXG4gICAqIGNvbXBhdGliaWxpdHkuXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKiBAZnVuY3Rpb24gdGVzdFByb3BzQWxsXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wIC0gQSBzdHJpbmcgb2YgdGhlIHByb3BlcnR5IHRvIHRlc3QgZm9yXG4gICAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gW3ByZWZpeGVkXSAtIEFuIG9iamVjdCB0byBjaGVjayB0aGUgcHJlZml4ZWQgcHJvcGVydGllcyBvbi4gVXNlIGEgc3RyaW5nIHRvIHNraXBcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudHxTVkdFbGVtZW50fSBbZWxlbV0gLSBBbiBlbGVtZW50IHVzZWQgdG8gdGVzdCB0aGUgcHJvcGVydHkgYW5kIHZhbHVlIGFnYWluc3RcbiAgICogQHBhcmFtIHtzdHJpbmd9IFt2YWx1ZV0gLSBBIHN0cmluZyBvZiBhIGNzcyB2YWx1ZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtza2lwVmFsdWVUZXN0XSAtIEFuIGJvb2xlYW4gcmVwcmVzZW50aW5nIGlmIHlvdSB3YW50IHRvIHRlc3QgaWYgdmFsdWUgc3RpY2tzIHdoZW4gc2V0XG4gICAqIEByZXR1cm5zIHtmYWxzZXxzdHJpbmd9IHJldHVybnMgdGhlIHN0cmluZyB2ZXJzaW9uIG9mIHRoZSBwcm9wZXJ0eSwgb3IgZmFsc2UgaWYgaXQgaXMgdW5zdXBwb3J0ZWRcbiAgICovXG4gIGZ1bmN0aW9uIHRlc3RQcm9wc0FsbChwcm9wLCBwcmVmaXhlZCwgZWxlbSwgdmFsdWUsIHNraXBWYWx1ZVRlc3QpIHtcblxuICAgIHZhciB1Y1Byb3AgPSBwcm9wLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcHJvcC5zbGljZSgxKSxcbiAgICAgIHByb3BzID0gKHByb3AgKyAnICcgKyBjc3NvbVByZWZpeGVzLmpvaW4odWNQcm9wICsgJyAnKSArIHVjUHJvcCkuc3BsaXQoJyAnKTtcblxuICAgIC8vIGRpZCB0aGV5IGNhbGwgLnByZWZpeGVkKCdib3hTaXppbmcnKSBvciBhcmUgd2UganVzdCB0ZXN0aW5nIGEgcHJvcD9cbiAgICBpZiAoaXMocHJlZml4ZWQsICdzdHJpbmcnKSB8fCBpcyhwcmVmaXhlZCwgJ3VuZGVmaW5lZCcpKSB7XG4gICAgICByZXR1cm4gdGVzdFByb3BzKHByb3BzLCBwcmVmaXhlZCwgdmFsdWUsIHNraXBWYWx1ZVRlc3QpO1xuXG4gICAgICAvLyBvdGhlcndpc2UsIHRoZXkgY2FsbGVkIC5wcmVmaXhlZCgncmVxdWVzdEFuaW1hdGlvbkZyYW1lJywgd2luZG93WywgZWxlbV0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHByb3BzID0gKHByb3AgKyAnICcgKyAoZG9tUHJlZml4ZXMpLmpvaW4odWNQcm9wICsgJyAnKSArIHVjUHJvcCkuc3BsaXQoJyAnKTtcbiAgICAgIHJldHVybiB0ZXN0RE9NUHJvcHMocHJvcHMsIHByZWZpeGVkLCBlbGVtKTtcbiAgICB9XG4gIH1cblxuICAvLyBNb2Rlcm5penIudGVzdEFsbFByb3BzKCkgaW52ZXN0aWdhdGVzIHdoZXRoZXIgYSBnaXZlbiBzdHlsZSBwcm9wZXJ0eSxcbiAgLy8gb3IgYW55IG9mIGl0cyB2ZW5kb3ItcHJlZml4ZWQgdmFyaWFudHMsIGlzIHJlY29nbml6ZWRcbiAgLy9cbiAgLy8gTm90ZSB0aGF0IHRoZSBwcm9wZXJ0eSBuYW1lcyBtdXN0IGJlIHByb3ZpZGVkIGluIHRoZSBjYW1lbENhc2UgdmFyaWFudC5cbiAgLy8gTW9kZXJuaXpyLnRlc3RBbGxQcm9wcygnYm94U2l6aW5nJylcbiAgTW9kZXJuaXpyUHJvdG8udGVzdEFsbFByb3BzID0gdGVzdFByb3BzQWxsO1xuXG4gIFxuXG4gIC8qKlxuICAgKiBhdFJ1bGUgcmV0dXJucyBhIGdpdmVuIENTUyBwcm9wZXJ0eSBhdC1ydWxlIChlZyBAa2V5ZnJhbWVzKSwgcG9zc2libHkgaW5cbiAgICogc29tZSBwcmVmaXhlZCBmb3JtLCBvciBmYWxzZSwgaW4gdGhlIGNhc2Ugb2YgYW4gdW5zdXBwb3J0ZWQgcnVsZVxuICAgKlxuICAgKiBAbWVtYmVyb2YgTW9kZXJuaXpyXG4gICAqIEBuYW1lIE1vZGVybml6ci5hdFJ1bGVcbiAgICogQG9wdGlvbk5hbWUgTW9kZXJuaXpyLmF0UnVsZSgpXG4gICAqIEBvcHRpb25Qcm9wIGF0UnVsZVxuICAgKiBAYWNjZXNzIHB1YmxpY1xuICAgKiBAZnVuY3Rpb24gYXRSdWxlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wIC0gU3RyaW5nIG5hbWUgb2YgdGhlIEAtcnVsZSB0byB0ZXN0IGZvclxuICAgKiBAcmV0dXJucyB7c3RyaW5nfGJvb2xlYW59IFRoZSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSAocG9zc2libHkgcHJlZml4ZWQpXG4gICAqIHZhbGlkIHZlcnNpb24gb2YgdGhlIEAtcnVsZSwgb3IgYGZhbHNlYCB3aGVuIGl0IGlzIHVuc3VwcG9ydGVkLlxuICAgKiBAZXhhbXBsZVxuICAgKiBgYGBqc1xuICAgKiAgdmFyIGtleWZyYW1lcyA9IE1vZGVybml6ci5hdFJ1bGUoJ0BrZXlmcmFtZXMnKTtcbiAgICpcbiAgICogIGlmIChrZXlmcmFtZXMpIHtcbiAgICogICAgLy8ga2V5ZnJhbWVzIGFyZSBzdXBwb3J0ZWRcbiAgICogICAgLy8gY291bGQgYmUgYEAtd2Via2l0LWtleWZyYW1lc2Agb3IgYEBrZXlmcmFtZXNgXG4gICAqICB9IGVsc2Uge1xuICAgKiAgICAvLyBrZXlmcmFtZXMgPT09IGBmYWxzZWBcbiAgICogIH1cbiAgICogYGBgXG4gICAqXG4gICAqL1xuXG4gIHZhciBhdFJ1bGUgPSBmdW5jdGlvbihwcm9wKSB7XG4gICAgdmFyIGxlbmd0aCA9IHByZWZpeGVzLmxlbmd0aDtcbiAgICB2YXIgY3NzcnVsZSA9IHdpbmRvdy5DU1NSdWxlO1xuICAgIHZhciBydWxlO1xuXG4gICAgaWYgKHR5cGVvZiBjc3NydWxlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAoIXByb3ApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyByZW1vdmUgbGl0ZXJhbCBAIGZyb20gYmVnaW5uaW5nIG9mIHByb3ZpZGVkIHByb3BlcnR5XG4gICAgcHJvcCA9IHByb3AucmVwbGFjZSgvXkAvLCAnJyk7XG5cbiAgICAvLyBDU1NSdWxlcyB1c2UgdW5kZXJzY29yZXMgaW5zdGVhZCBvZiBkYXNoZXNcbiAgICBydWxlID0gcHJvcC5yZXBsYWNlKC8tL2csICdfJykudG9VcHBlckNhc2UoKSArICdfUlVMRSc7XG5cbiAgICBpZiAocnVsZSBpbiBjc3NydWxlKSB7XG4gICAgICByZXR1cm4gJ0AnICsgcHJvcDtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAvLyBwcmVmaXhlcyBnaXZlcyB1cyBzb21ldGhpbmcgbGlrZSAtby0sIGFuZCB3ZSB3YW50IE9fXG4gICAgICB2YXIgcHJlZml4ID0gcHJlZml4ZXNbaV07XG4gICAgICB2YXIgdGhpc1J1bGUgPSBwcmVmaXgudG9VcHBlckNhc2UoKSArICdfJyArIHJ1bGU7XG5cbiAgICAgIGlmICh0aGlzUnVsZSBpbiBjc3NydWxlKSB7XG4gICAgICAgIHJldHVybiAnQC0nICsgcHJlZml4LnRvTG93ZXJDYXNlKCkgKyAnLScgKyBwcm9wO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBNb2Rlcm5penJQcm90by5hdFJ1bGUgPSBhdFJ1bGU7XG5cbiAgXG5cbiAgLyoqXG4gICAqIHByZWZpeGVkIHJldHVybnMgdGhlIHByZWZpeGVkIG9yIG5vbnByZWZpeGVkIHByb3BlcnR5IG5hbWUgdmFyaWFudCBvZiB5b3VyIGlucHV0XG4gICAqXG4gICAqIEBtZW1iZXJvZiBNb2Rlcm5penJcbiAgICogQG5hbWUgTW9kZXJuaXpyLnByZWZpeGVkXG4gICAqIEBvcHRpb25OYW1lIE1vZGVybml6ci5wcmVmaXhlZCgpXG4gICAqIEBvcHRpb25Qcm9wIHByZWZpeGVkXG4gICAqIEBhY2Nlc3MgcHVibGljXG4gICAqIEBmdW5jdGlvbiBwcmVmaXhlZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcCAtIFN0cmluZyBuYW1lIG9mIHRoZSBwcm9wZXJ0eSB0byB0ZXN0IGZvclxuICAgKiBAcGFyYW0ge29iamVjdH0gW29ial0gLSBBbiBvYmplY3QgdG8gdGVzdCBmb3IgdGhlIHByZWZpeGVkIHByb3BlcnRpZXMgb25cbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gW2VsZW1dIC0gQW4gZWxlbWVudCB1c2VkIHRvIHRlc3Qgc3BlY2lmaWMgcHJvcGVydGllcyBhZ2FpbnN0XG4gICAqIEByZXR1cm5zIHtzdHJpbmd8ZmFsc2V9IFRoZSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSAocG9zc2libHkgcHJlZml4ZWQpIHZhbGlkXG4gICAqIHZlcnNpb24gb2YgdGhlIHByb3BlcnR5LCBvciBgZmFsc2VgIHdoZW4gaXQgaXMgdW5zdXBwb3J0ZWQuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIE1vZGVybml6ci5wcmVmaXhlZCB0YWtlcyBhIHN0cmluZyBjc3MgdmFsdWUgaW4gdGhlIERPTSBzdHlsZSBjYW1lbENhc2UgKGFzXG4gICAqIG9wcG9zZWQgdG8gdGhlIGNzcyBzdHlsZSBrZWJhYi1jYXNlKSBmb3JtIGFuZCByZXR1cm5zIHRoZSAocG9zc2libHkgcHJlZml4ZWQpXG4gICAqIHZlcnNpb24gb2YgdGhhdCBwcm9wZXJ0eSB0aGF0IHRoZSBicm93c2VyIGFjdHVhbGx5IHN1cHBvcnRzLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgaW4gb2xkZXIgRmlyZWZveC4uLlxuICAgKiBgYGBqc1xuICAgKiBwcmVmaXhlZCgnYm94U2l6aW5nJylcbiAgICogYGBgXG4gICAqIHJldHVybnMgJ01vekJveFNpemluZydcbiAgICpcbiAgICogSW4gbmV3ZXIgRmlyZWZveCwgYXMgd2VsbCBhcyBhbnkgb3RoZXIgYnJvd3NlciB0aGF0IHN1cHBvcnQgdGhlIHVucHJlZml4ZWRcbiAgICogdmVyc2lvbiB3b3VsZCBzaW1wbHkgcmV0dXJuIGBib3hTaXppbmdgLiBBbnkgYnJvd3NlciB0aGF0IGRvZXMgbm90IHN1cHBvcnRcbiAgICogdGhlIHByb3BlcnR5IGF0IGFsbCwgaXQgd2lsbCByZXR1cm4gYGZhbHNlYC5cbiAgICpcbiAgICogQnkgZGVmYXVsdCwgcHJlZml4ZWQgaXMgY2hlY2tlZCBhZ2FpbnN0IGEgRE9NIGVsZW1lbnQuIElmIHlvdSB3YW50IHRvIGNoZWNrXG4gICAqIGZvciBhIHByb3BlcnR5IG9uIGFub3RoZXIgb2JqZWN0LCBqdXN0IHBhc3MgaXQgYXMgYSBzZWNvbmQgYXJndW1lbnRcbiAgICpcbiAgICogYGBganNcbiAgICogdmFyIHJBRiA9IHByZWZpeGVkKCdyZXF1ZXN0QW5pbWF0aW9uRnJhbWUnLCB3aW5kb3cpO1xuICAgKlxuICAgKiByYWYoZnVuY3Rpb24oKSB7XG4gICAqICByZW5kZXJGdW5jdGlvbigpO1xuICAgKiB9KVxuICAgKiBgYGBcbiAgICpcbiAgICogTm90ZSB0aGF0IHRoaXMgd2lsbCByZXR1cm4gX3RoZSBhY3R1YWwgZnVuY3Rpb25fIC0gbm90IHRoZSBuYW1lIG9mIHRoZSBmdW5jdGlvbi5cbiAgICogSWYgeW91IG5lZWQgdGhlIGFjdHVhbCBuYW1lIG9mIHRoZSBwcm9wZXJ0eSwgcGFzcyBpbiBgZmFsc2VgIGFzIGEgdGhpcmQgYXJndW1lbnRcbiAgICpcbiAgICogYGBganNcbiAgICogdmFyIHJBRlByb3AgPSBwcmVmaXhlZCgncmVxdWVzdEFuaW1hdGlvbkZyYW1lJywgd2luZG93LCBmYWxzZSk7XG4gICAqXG4gICAqIHJhZlByb3AgPT09ICdXZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnIC8vIGluIG9sZGVyIHdlYmtpdFxuICAgKiBgYGBcbiAgICpcbiAgICogT25lIGNvbW1vbiB1c2UgY2FzZSBmb3IgcHJlZml4ZWQgaXMgaWYgeW91J3JlIHRyeWluZyB0byBkZXRlcm1pbmUgd2hpY2ggdHJhbnNpdGlvblxuICAgKiBlbmQgZXZlbnQgdG8gYmluZCB0bywgeW91IG1pZ2h0IGRvIHNvbWV0aGluZyBsaWtlLi4uXG4gICAqIGBgYGpzXG4gICAqIHZhciB0cmFuc0VuZEV2ZW50TmFtZXMgPSB7XG4gICAqICAgICAnV2Via2l0VHJhbnNpdGlvbicgOiAnd2Via2l0VHJhbnNpdGlvbkVuZCcsICogU2FmIDYsIEFuZHJvaWQgQnJvd3NlclxuICAgKiAgICAgJ01velRyYW5zaXRpb24nICAgIDogJ3RyYW5zaXRpb25lbmQnLCAgICAgICAqIG9ubHkgZm9yIEZGIDwgMTVcbiAgICogICAgICd0cmFuc2l0aW9uJyAgICAgICA6ICd0cmFuc2l0aW9uZW5kJyAgICAgICAgKiBJRTEwLCBPcGVyYSwgQ2hyb21lLCBGRiAxNSssIFNhZiA3K1xuICAgKiB9O1xuICAgKlxuICAgKiB2YXIgdHJhbnNFbmRFdmVudE5hbWUgPSB0cmFuc0VuZEV2ZW50TmFtZXNbIE1vZGVybml6ci5wcmVmaXhlZCgndHJhbnNpdGlvbicpIF07XG4gICAqIGBgYFxuICAgKlxuICAgKiBJZiB5b3Ugd2FudCBhIHNpbWlsYXIgbG9va3VwLCBidXQgaW4ga2ViYWItY2FzZSwgeW91IGNhbiB1c2UgW3ByZWZpeGVkQ1NTXSgjbW9kZXJuaXpyLXByZWZpeGVkY3NzKS5cbiAgICovXG5cbiAgdmFyIHByZWZpeGVkID0gTW9kZXJuaXpyUHJvdG8ucHJlZml4ZWQgPSBmdW5jdGlvbihwcm9wLCBvYmosIGVsZW0pIHtcbiAgICBpZiAocHJvcC5pbmRleE9mKCdAJykgPT09IDApIHtcbiAgICAgIHJldHVybiBhdFJ1bGUocHJvcCk7XG4gICAgfVxuXG4gICAgaWYgKHByb3AuaW5kZXhPZignLScpICE9IC0xKSB7XG4gICAgICAvLyBDb252ZXJ0IGtlYmFiLWNhc2UgdG8gY2FtZWxDYXNlXG4gICAgICBwcm9wID0gY3NzVG9ET00ocHJvcCk7XG4gICAgfVxuICAgIGlmICghb2JqKSB7XG4gICAgICByZXR1cm4gdGVzdFByb3BzQWxsKHByb3AsICdwZngnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGVzdGluZyBET00gcHJvcGVydHkgZS5nLiBNb2Rlcm5penIucHJlZml4ZWQoJ3JlcXVlc3RBbmltYXRpb25GcmFtZScsIHdpbmRvdykgLy8gJ21velJlcXVlc3RBbmltYXRpb25GcmFtZSdcbiAgICAgIHJldHVybiB0ZXN0UHJvcHNBbGwocHJvcCwgb2JqLCBlbGVtKTtcbiAgICB9XG4gIH07XG5cbiAgXG5cbiAgLyoqXG4gICAqIHByZWZpeGVkQ1NTIGlzIGp1c3QgbGlrZSBbcHJlZml4ZWRdKCNtb2Rlcm5penItcHJlZml4ZWQpLCBidXQgdGhlIHJldHVybmVkIHZhbHVlcyBhcmUgaW5cbiAgICoga2ViYWItY2FzZSAoZS5nLiBgYm94LXNpemluZ2ApIHJhdGhlciB0aGFuIGNhbWVsQ2FzZSAoYm94U2l6aW5nKS5cbiAgICpcbiAgICogQG1lbWJlcm9mIE1vZGVybml6clxuICAgKiBAbmFtZSBNb2Rlcm5penIucHJlZml4ZWRDU1NcbiAgICogQG9wdGlvbk5hbWUgTW9kZXJuaXpyLnByZWZpeGVkQ1NTKClcbiAgICogQG9wdGlvblByb3AgcHJlZml4ZWRDU1NcbiAgICogQGFjY2VzcyBwdWJsaWNcbiAgICogQGZ1bmN0aW9uIHByZWZpeGVkQ1NTXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wIC0gU3RyaW5nIG5hbWUgb2YgdGhlIHByb3BlcnR5IHRvIHRlc3QgZm9yXG4gICAqIEByZXR1cm5zIHtzdHJpbmd8ZmFsc2V9IFRoZSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSAocG9zc2libHkgcHJlZml4ZWQpXG4gICAqIHZhbGlkIHZlcnNpb24gb2YgdGhlIHByb3BlcnR5LCBvciBgZmFsc2VgIHdoZW4gaXQgaXMgdW5zdXBwb3J0ZWQuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIGBNb2Rlcm5penIucHJlZml4ZWRDU1NgIGlzIGxpa2UgYE1vZGVybml6ci5wcmVmaXhlZGAsIGJ1dCByZXR1cm5zIHRoZSByZXN1bHRcbiAgICogaW4gaHlwaGVuYXRlZCBmb3JtXG4gICAqXG4gICAqIGBgYGpzXG4gICAqIE1vZGVybml6ci5wcmVmaXhlZENTUygndHJhbnNpdGlvbicpIC8vICctbW96LXRyYW5zaXRpb24nIGluIG9sZCBGaXJlZm94XG4gICAqIGBgYFxuICAgKlxuICAgKiBTaW5jZSBpdCBpcyBvbmx5IHVzZWZ1bCBmb3IgQ1NTIHN0eWxlIHByb3BlcnRpZXMsIGl0IGNhbiBvbmx5IGJlIHRlc3RlZCBhZ2FpbnN0XG4gICAqIGFuIEhUTUxFbGVtZW50LlxuICAgKlxuICAgKiBQcm9wZXJ0aWVzIGNhbiBiZSBwYXNzZWQgYXMgYm90aCB0aGUgRE9NIHN0eWxlIGNhbWVsQ2FzZSBvciBDU1Mgc3R5bGUga2ViYWItY2FzZS5cbiAgICovXG5cbiAgdmFyIHByZWZpeGVkQ1NTID0gTW9kZXJuaXpyUHJvdG8ucHJlZml4ZWRDU1MgPSBmdW5jdGlvbihwcm9wKSB7XG4gICAgdmFyIHByZWZpeGVkUHJvcCA9IHByZWZpeGVkKHByb3ApO1xuICAgIHJldHVybiBwcmVmaXhlZFByb3AgJiYgZG9tVG9DU1MocHJlZml4ZWRQcm9wKTtcbiAgfTtcbiAgXG4vKiFcbntcbiAgXCJuYW1lXCI6IFwiQ2FudmFzXCIsXG4gIFwicHJvcGVydHlcIjogXCJjYW52YXNcIixcbiAgXCJjYW5pdXNlXCI6IFwiY2FudmFzXCIsXG4gIFwidGFnc1wiOiBbXCJjYW52YXNcIiwgXCJncmFwaGljc1wiXSxcbiAgXCJwb2x5ZmlsbHNcIjogW1wiZmxhc2hjYW52YXNcIiwgXCJleGNhbnZhc1wiLCBcInNsY2FudmFzXCIsIFwiZnhjYW52YXNcIl1cbn1cbiEqL1xuLyogRE9DXG5EZXRlY3RzIHN1cHBvcnQgZm9yIHRoZSBgPGNhbnZhcz5gIGVsZW1lbnQgZm9yIDJEIGRyYXdpbmcuXG4qL1xuXG4gIC8vIE9uIHRoZSBTNjAgYW5kIEJCIFN0b3JtLCBnZXRDb250ZXh0IGV4aXN0cywgYnV0IGFsd2F5cyByZXR1cm5zIHVuZGVmaW5lZFxuICAvLyBzbyB3ZSBhY3R1YWxseSBoYXZlIHRvIGNhbGwgZ2V0Q29udGV4dCgpIHRvIHZlcmlmeVxuICAvLyBnaXRodWIuY29tL01vZGVybml6ci9Nb2Rlcm5penIvaXNzdWVzL2lzc3VlLzk3L1xuICBNb2Rlcm5penIuYWRkVGVzdCgnY2FudmFzJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIGVsZW0gPSBjcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICByZXR1cm4gISEoZWxlbS5nZXRDb250ZXh0ICYmIGVsZW0uZ2V0Q29udGV4dCgnMmQnKSk7XG4gIH0pO1xuXG4vKiFcbntcbiAgXCJuYW1lXCI6IFwiY2FudmFzIGJsZW5kaW5nIHN1cHBvcnRcIixcbiAgXCJwcm9wZXJ0eVwiOiBcImNhbnZhc2JsZW5kaW5nXCIsXG4gIFwidGFnc1wiOiBbXCJjYW52YXNcIl0sXG4gIFwiYXN5bmNcIiA6IGZhbHNlLFxuICBcIm5vdGVzXCI6IFt7XG4gICAgICBcIm5hbWVcIjogXCJIVE1MNSBTcGVjXCIsXG4gICAgICBcImhyZWZcIjogXCJodHRwczovL2R2Y3MudzMub3JnL2hnL0ZYVEYvcmF3ZmlsZS90aXAvY29tcG9zaXRpbmcvaW5kZXguaHRtbCNibGVuZGluZ1wiXG4gICAgfSxcbiAgICB7XG4gICAgICBcIm5hbWVcIjogXCJBcnRpY2xlXCIsXG4gICAgICBcImhyZWZcIjogXCJodHRwczovL2Jsb2dzLmFkb2JlLmNvbS93ZWJwbGF0Zm9ybS8yMDEzLzAxLzI4L2JsZW5kaW5nLWZlYXR1cmVzLWluLWNhbnZhc1wiXG4gICAgfV1cbn1cbiEqL1xuLyogRE9DXG5EZXRlY3RzIGlmIFBob3Rvc2hvcCBzdHlsZSBibGVuZGluZyBtb2RlcyBhcmUgYXZhaWxhYmxlIGluIGNhbnZhcy5cbiovXG5cblxuICBNb2Rlcm5penIuYWRkVGVzdCgnY2FudmFzYmxlbmRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICBpZiAoTW9kZXJuaXpyLmNhbnZhcyA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIGN0eCA9IGNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpLmdldENvbnRleHQoJzJkJyk7XG4gICAgLy8gZmlyZWZveCAzIHRocm93cyBhbiBlcnJvciB3aGVuIHNldHRpbmcgYW4gaW52YWxpZCBgZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uYFxuICAgIHRyeSB7XG4gICAgICBjdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ3NjcmVlbic7XG4gICAgfSBjYXRjaCAoZSkge31cblxuICAgIHJldHVybiBjdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID09PSAnc2NyZWVuJztcbiAgfSk7XG5cblxuLyohXG57XG4gIFwibmFtZVwiOiBcImNhbnZhcy50b0RhdGFVUkwgdHlwZSBzdXBwb3J0XCIsXG4gIFwicHJvcGVydHlcIjogW1widG9kYXRhdXJsanBlZ1wiLCBcInRvZGF0YXVybHBuZ1wiLCBcInRvZGF0YXVybHdlYnBcIl0sXG4gIFwidGFnc1wiOiBbXCJjYW52YXNcIl0sXG4gIFwiYnVpbGRlckFsaWFzZXNcIjogW1wiY2FudmFzX3RvZGF0YXVybF90eXBlXCJdLFxuICBcImFzeW5jXCIgOiBmYWxzZSxcbiAgXCJub3Rlc1wiOiBbe1xuICAgIFwibmFtZVwiOiBcIk1ETiBhcnRpY2xlXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0hUTUxDYW52YXNFbGVtZW50LnRvRGF0YVVSTFwiXG4gIH1dXG59XG4hKi9cblxuXG4gIHZhciBjYW52YXMgPSBjcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcblxuICBNb2Rlcm5penIuYWRkVGVzdCgndG9kYXRhdXJsanBlZycsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAhIU1vZGVybml6ci5jYW52YXMgJiYgY2FudmFzLnRvRGF0YVVSTCgnaW1hZ2UvanBlZycpLmluZGV4T2YoJ2RhdGE6aW1hZ2UvanBlZycpID09PSAwO1xuICB9KTtcbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ3RvZGF0YXVybHBuZycsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAhIU1vZGVybml6ci5jYW52YXMgJiYgY2FudmFzLnRvRGF0YVVSTCgnaW1hZ2UvcG5nJykuaW5kZXhPZignZGF0YTppbWFnZS9wbmcnKSA9PT0gMDtcbiAgfSk7XG4gIE1vZGVybml6ci5hZGRUZXN0KCd0b2RhdGF1cmx3ZWJwJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN1cHBvcnRzID0gZmFsc2U7XG5cbiAgICAvLyBmaXJlZm94IDMgdGhyb3dzIGFuIGVycm9yIHdoZW4geW91IHVzZSBhbiBcImludmFsaWRcIiB0b0RhdGFVcmxcbiAgICB0cnkge1xuICAgICAgc3VwcG9ydHMgPSAhIU1vZGVybml6ci5jYW52YXMgJiYgY2FudmFzLnRvRGF0YVVSTCgnaW1hZ2Uvd2VicCcpLmluZGV4T2YoJ2RhdGE6aW1hZ2Uvd2VicCcpID09PSAwO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG5cbiAgICByZXR1cm4gc3VwcG9ydHM7XG4gIH0pO1xuXG5cbi8qIVxue1xuICBcIm5hbWVcIjogXCJjYW52YXMgd2luZGluZyBzdXBwb3J0XCIsXG4gIFwicHJvcGVydHlcIjogW1wiY2FudmFzd2luZGluZ1wiXSxcbiAgXCJ0YWdzXCI6IFtcImNhbnZhc1wiXSxcbiAgXCJhc3luY1wiIDogZmFsc2UsXG4gIFwibm90ZXNcIjogW3tcbiAgICBcIm5hbWVcIjogXCJBcnRpY2xlXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly9ibG9ncy5hZG9iZS5jb20vd2VicGxhdGZvcm0vMjAxMy8wMS8zMC93aW5kaW5nLXJ1bGVzLWluLWNhbnZhcy9cIlxuICB9XVxufVxuISovXG4vKiBET0NcbkRldGVybWluZXMgaWYgd2luZGluZyBydWxlcywgd2hpY2ggY29udHJvbHMgaWYgYSBwYXRoIGNhbiBnbyBjbG9ja3dpc2Ugb3IgY291bnRlcmNsb2Nrd2lzZVxuKi9cblxuXG4gIE1vZGVybml6ci5hZGRUZXN0KCdjYW52YXN3aW5kaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgaWYgKE1vZGVybml6ci5jYW52YXMgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciBjdHggPSBjcmVhdGVFbGVtZW50KCdjYW52YXMnKS5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgY3R4LnJlY3QoMCwgMCwgMTAsIDEwKTtcbiAgICBjdHgucmVjdCgyLCAyLCA2LCA2KTtcbiAgICByZXR1cm4gY3R4LmlzUG9pbnRJblBhdGgoNSwgNSwgJ2V2ZW5vZGQnKSA9PT0gZmFsc2U7XG4gIH0pO1xuXG5cbi8qIVxue1xuICBcIm5hbWVcIjogXCJDYW52YXMgdGV4dFwiLFxuICBcInByb3BlcnR5XCI6IFwiY2FudmFzdGV4dFwiLFxuICBcImNhbml1c2VcIjogXCJjYW52YXMtdGV4dFwiLFxuICBcInRhZ3NcIjogW1wiY2FudmFzXCIsIFwiZ3JhcGhpY3NcIl0sXG4gIFwicG9seWZpbGxzXCI6IFtcImNhbnZhc3RleHRcIl1cbn1cbiEqL1xuLyogRE9DXG5EZXRlY3RzIHN1cHBvcnQgZm9yIHRoZSB0ZXh0IEFQSXMgZm9yIGA8Y2FudmFzPmAgZWxlbWVudHMuXG4qL1xuXG4gIE1vZGVybml6ci5hZGRUZXN0KCdjYW52YXN0ZXh0JywgIGZ1bmN0aW9uKCkge1xuICAgIGlmIChNb2Rlcm5penIuY2FudmFzICA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHR5cGVvZiBjcmVhdGVFbGVtZW50KCdjYW52YXMnKS5nZXRDb250ZXh0KCcyZCcpLmZpbGxUZXh0ID09ICdmdW5jdGlvbic7XG4gIH0pO1xuXG5cbiAgLyoqXG4gICAqIHRlc3RBbGxQcm9wcyBkZXRlcm1pbmVzIHdoZXRoZXIgYSBnaXZlbiBDU1MgcHJvcGVydHkgaXMgc3VwcG9ydGVkIGluIHRoZSBicm93c2VyXG4gICAqXG4gICAqIEBtZW1iZXJvZiBNb2Rlcm5penJcbiAgICogQG5hbWUgTW9kZXJuaXpyLnRlc3RBbGxQcm9wc1xuICAgKiBAb3B0aW9uTmFtZSBNb2Rlcm5penIudGVzdEFsbFByb3BzKClcbiAgICogQG9wdGlvblByb3AgdGVzdEFsbFByb3BzXG4gICAqIEBhY2Nlc3MgcHVibGljXG4gICAqIEBmdW5jdGlvbiB0ZXN0QWxsUHJvcHNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHByb3AgLSBTdHJpbmcgbmFtaW5nIHRoZSBwcm9wZXJ0eSB0byB0ZXN0IChlaXRoZXIgY2FtZWxDYXNlIG9yIGtlYmFiLWNhc2UpXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbdmFsdWVdIC0gU3RyaW5nIG9mIHRoZSB2YWx1ZSB0byB0ZXN0XG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3NraXBWYWx1ZVRlc3Q9ZmFsc2VdIC0gV2hldGhlciB0byBza2lwIHRlc3RpbmcgdGhhdCB0aGUgdmFsdWUgaXMgc3VwcG9ydGVkIHdoZW4gdXNpbmcgbm9uLW5hdGl2ZSBkZXRlY3Rpb25cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogdGVzdEFsbFByb3BzIGRldGVybWluZXMgd2hldGhlciBhIGdpdmVuIENTUyBwcm9wZXJ0eSwgaW4gc29tZSBwcmVmaXhlZCBmb3JtLFxuICAgKiBpcyBzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIuXG4gICAqXG4gICAqIGBgYGpzXG4gICAqIHRlc3RBbGxQcm9wcygnYm94U2l6aW5nJykgIC8vIHRydWVcbiAgICogYGBgXG4gICAqXG4gICAqIEl0IGNhbiBvcHRpb25hbGx5IGJlIGdpdmVuIGEgQ1NTIHZhbHVlIGluIHN0cmluZyBmb3JtIHRvIHRlc3QgaWYgYSBwcm9wZXJ0eVxuICAgKiB2YWx1ZSBpcyB2YWxpZFxuICAgKlxuICAgKiBgYGBqc1xuICAgKiB0ZXN0QWxsUHJvcHMoJ2Rpc3BsYXknLCAnYmxvY2snKSAvLyB0cnVlXG4gICAqIHRlc3RBbGxQcm9wcygnZGlzcGxheScsICdwZW5ndWluJykgLy8gZmFsc2VcbiAgICogYGBgXG4gICAqXG4gICAqIEEgYm9vbGVhbiBjYW4gYmUgcGFzc2VkIGFzIGEgdGhpcmQgcGFyYW1ldGVyIHRvIHNraXAgdGhlIHZhbHVlIGNoZWNrIHdoZW5cbiAgICogbmF0aXZlIGRldGVjdGlvbiAoQHN1cHBvcnRzKSBpc24ndCBhdmFpbGFibGUuXG4gICAqXG4gICAqIGBgYGpzXG4gICAqIHRlc3RBbGxQcm9wcygnc2hhcGVPdXRzaWRlJywgJ2NvbnRlbnQtYm94JywgdHJ1ZSk7XG4gICAqIGBgYFxuICAgKi9cblxuICBmdW5jdGlvbiB0ZXN0QWxsUHJvcHMocHJvcCwgdmFsdWUsIHNraXBWYWx1ZVRlc3QpIHtcbiAgICByZXR1cm4gdGVzdFByb3BzQWxsKHByb3AsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB2YWx1ZSwgc2tpcFZhbHVlVGVzdCk7XG4gIH1cbiAgTW9kZXJuaXpyUHJvdG8udGVzdEFsbFByb3BzID0gdGVzdEFsbFByb3BzO1xuICBcbi8qIVxue1xuICBcIm5hbWVcIjogXCJDU1MgQW5pbWF0aW9uc1wiLFxuICBcInByb3BlcnR5XCI6IFwiY3NzYW5pbWF0aW9uc1wiLFxuICBcImNhbml1c2VcIjogXCJjc3MtYW5pbWF0aW9uXCIsXG4gIFwicG9seWZpbGxzXCI6IFtcInRyYW5zZm9ybWllXCIsIFwiY3Nzc2FuZHBhcGVyXCJdLFxuICBcInRhZ3NcIjogW1wiY3NzXCJdLFxuICBcIndhcm5pbmdzXCI6IFtcIkFuZHJvaWQgPCA0IHdpbGwgcGFzcyB0aGlzIHRlc3QsIGJ1dCBjYW4gb25seSBhbmltYXRlIGEgc2luZ2xlIHByb3BlcnR5IGF0IGEgdGltZVwiXSxcbiAgXCJub3Rlc1wiOiBbe1xuICAgIFwibmFtZVwiIDogXCJBcnRpY2xlOiAnRGlzcGVsbGluZyB0aGUgQW5kcm9pZCBDU1MgYW5pbWF0aW9uIG15dGhzJ1wiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vZ29vLmdsL09HdzVHbVwiXG4gIH1dXG59XG4hKi9cbi8qIERPQ1xuRGV0ZWN0cyB3aGV0aGVyIG9yIG5vdCBlbGVtZW50cyBjYW4gYmUgYW5pbWF0ZWQgdXNpbmcgQ1NTXG4qL1xuXG4gIE1vZGVybml6ci5hZGRUZXN0KCdjc3NhbmltYXRpb25zJywgdGVzdEFsbFByb3BzKCdhbmltYXRpb25OYW1lJywgJ2EnLCB0cnVlKSk7XG5cbi8qIVxue1xuICBcIm5hbWVcIjogXCJDU1MgQmFja2dyb3VuZCBCbGVuZCBNb2RlXCIsXG4gIFwicHJvcGVydHlcIjogXCJiYWNrZ3JvdW5kYmxlbmRtb2RlXCIsXG4gIFwiY2FuaXVzZVwiOiBcImNzcy1iYWNrZ3JvdW5kYmxlbmRtb2RlXCIsXG4gIFwidGFnc1wiOiBbXCJjc3NcIl0sXG4gIFwibm90ZXNcIjogW1xuICAgIHtcbiAgICAgIFwibmFtZVwiOiBcIkNTUyBCbGVuZCBNb2RlcyBjb3VsZCBiZSB0aGUgbmV4dCBiaWcgdGhpbmcgaW4gV2ViIERlc2lnblwiLFxuICAgICAgXCJocmVmXCI6IFwiIGh0dHBzOi8vbWVkaXVtLmNvbS9AYmVubmV0dGZlZWx5L2Nzcy1ibGVuZC1tb2Rlcy1jb3VsZC1iZS10aGUtbmV4dC1iaWctdGhpbmctaW4td2ViLWRlc2lnbi02YjUxYmY1Mzc0M2FcIlxuICAgIH0sIHtcbiAgICAgIFwibmFtZVwiOiBcIkRlbW9cIixcbiAgICAgIFwiaHJlZlwiOiBcImh0dHA6Ly9iZW5uZXR0ZmVlbHkuY29tL2dyYWRpZW50cy9cIlxuICAgIH1cbiAgXVxufVxuISovXG4vKiBET0NcbkRldGVjdHMgdGhlIGFiaWxpdHkgZm9yIHRoZSBicm93c2VyIHRvIGNvbXBvc2l0ZSBiYWNrZ3JvdW5kcyB1c2luZyBibGVuZGluZyBtb2RlcyBzaW1pbGFyIHRvIG9uZXMgZm91bmQgaW4gUGhvdG9zaG9wIG9yIElsbHVzdHJhdG9yLlxuKi9cblxuICBNb2Rlcm5penIuYWRkVGVzdCgnYmFja2dyb3VuZGJsZW5kbW9kZScsIHByZWZpeGVkKCdiYWNrZ3JvdW5kQmxlbmRNb2RlJywgJ3RleHQnKSk7XG5cbi8qIVxue1xuICBcIm5hbWVcIjogXCJDU1MgQmFja2dyb3VuZCBDbGlwIFRleHRcIixcbiAgXCJwcm9wZXJ0eVwiOiBcImJhY2tncm91bmRjbGlwdGV4dFwiLFxuICBcImF1dGhvcnNcIjogW1wiYXVzaVwiXSxcbiAgXCJ0YWdzXCI6IFtcImNzc1wiXSxcbiAgXCJub3Rlc1wiOiBbXG4gICAge1xuICAgICAgXCJuYW1lXCI6IFwiQ1NTIFRyaWNrcyBBcnRpY2xlXCIsXG4gICAgICBcImhyZWZcIjogXCJodHRwczovL2Nzcy10cmlja3MuY29tL2ltYWdlLXVuZGVyLXRleHQvXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIFwibmFtZVwiOiBcIk1ETiBEb2NzXCIsXG4gICAgICBcImhyZWZcIjogXCJodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9DU1MvYmFja2dyb3VuZC1jbGlwXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIFwibmFtZVwiOiBcIlJlbGF0ZWQgR2l0aHViIElzc3VlXCIsXG4gICAgICBcImhyZWZcIjogXCJodHRwczovL2dpdGh1Yi5jb20vTW9kZXJuaXpyL01vZGVybml6ci9pc3N1ZXMvMTk5XCJcbiAgICB9XG4gIF1cbn1cbiEqL1xuLyogRE9DXG5EZXRlY3RzIHRoZSBhYmlsaXR5IHRvIGNvbnRyb2wgc3BlY2lmaWVzIHdoZXRoZXIgb3Igbm90IGFuIGVsZW1lbnQncyBiYWNrZ3JvdW5kXG5leHRlbmRzIGJleW9uZCBpdHMgYm9yZGVyIGluIENTU1xuKi9cblxuICBNb2Rlcm5penIuYWRkVGVzdCgnYmFja2dyb3VuZGNsaXB0ZXh0JywgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRlc3RBbGxQcm9wcygnYmFja2dyb3VuZENsaXAnLCAndGV4dCcpO1xuICB9KTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIkJhY2tncm91bmQgUG9zaXRpb24gU2hvcnRoYW5kXCIsXG4gIFwicHJvcGVydHlcIjogXCJiZ3Bvc2l0aW9uc2hvcnRoYW5kXCIsXG4gIFwidGFnc1wiOiBbXCJjc3NcIl0sXG4gIFwiYnVpbGRlckFsaWFzZXNcIjogW1wiY3NzX2JhY2tncm91bmRwb3NpdGlvbl9zaG9ydGhhbmRcIl0sXG4gIFwibm90ZXNcIjogW3tcbiAgICBcIm5hbWVcIjogXCJNRE4gRG9jc1wiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0NTUy9iYWNrZ3JvdW5kLXBvc2l0aW9uXCJcbiAgfSwge1xuICAgIFwibmFtZVwiOiBcIlczIFNwZWNcIixcbiAgICBcImhyZWZcIjogXCJodHRwczovL3d3dy53My5vcmcvVFIvY3NzMy1iYWNrZ3JvdW5kLyNiYWNrZ3JvdW5kLXBvc2l0aW9uXCJcbiAgfSwge1xuICAgIFwibmFtZVwiOiBcIkRlbW9cIixcbiAgICBcImhyZWZcIjogXCJodHRwczovL2pzZmlkZGxlLm5ldC9CbGluay9iQlh2dC9cIlxuICB9XVxufVxuISovXG4vKiBET0NcbkRldGVjdHMgaWYgeW91IGNhbiB1c2UgdGhlIHNob3J0aGFuZCBtZXRob2QgdG8gZGVmaW5lIG11bHRpcGxlIHBhcnRzIG9mIGFuXG5lbGVtZW50J3MgYmFja2dyb3VuZC1wb3NpdGlvbiBzaW11bHRhbmlvdXNseS5cblxuZWcgYGJhY2tncm91bmQtcG9zaXRpb246IHJpZ2h0IDEwcHggYm90dG9tIDEwcHhgXG4qL1xuXG4gIE1vZGVybml6ci5hZGRUZXN0KCdiZ3Bvc2l0aW9uc2hvcnRoYW5kJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIGVsZW0gPSBjcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgdmFyIGVTdHlsZSA9IGVsZW0uc3R5bGU7XG4gICAgdmFyIHZhbCA9ICdyaWdodCAxMHB4IGJvdHRvbSAxMHB4JztcbiAgICBlU3R5bGUuY3NzVGV4dCA9ICdiYWNrZ3JvdW5kLXBvc2l0aW9uOiAnICsgdmFsICsgJzsnO1xuICAgIHJldHVybiAoZVN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9PT0gdmFsKTtcbiAgfSk7XG5cbi8qIVxue1xuICBcIm5hbWVcIjogXCJCYWNrZ3JvdW5kIFBvc2l0aW9uIFhZXCIsXG4gIFwicHJvcGVydHlcIjogXCJiZ3Bvc2l0aW9ueHlcIixcbiAgXCJ0YWdzXCI6IFtcImNzc1wiXSxcbiAgXCJidWlsZGVyQWxpYXNlc1wiOiBbXCJjc3NfYmFja2dyb3VuZHBvc2l0aW9uX3h5XCJdLFxuICBcImF1dGhvcnNcIjogW1wiQWxsYW4gTGVpXCIsIFwiQnJhbmRvbSBBYXJvblwiXSxcbiAgXCJub3Rlc1wiOiBbe1xuICAgIFwibmFtZVwiOiBcIkRlbW9cIixcbiAgICBcImhyZWZcIjogXCJodHRwczovL2pzZmlkZGxlLm5ldC9hbGxhbmxlaS9SOEFZUy9cIlxuICB9LCB7XG4gICAgXCJuYW1lXCI6IFwiQWRhcHRlZCBGcm9tXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2JyYW5kb25hYXJvbi9qcXVlcnktY3NzSG9va3MvYmxvYi9tYXN0ZXIvYmdwb3MuanNcIlxuICB9XVxufVxuISovXG4vKiBET0NcbkRldGVjdHMgdGhlIGFiaWxpdHkgdG8gY29udHJvbCBhbiBlbGVtZW50J3MgYmFja2dyb3VuZCBwb3NpdGlvbiB1c2luZyBjc3NcbiovXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ2JncG9zaXRpb254eScsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0ZXN0QWxsUHJvcHMoJ2JhY2tncm91bmRQb3NpdGlvblgnLCAnM3B4JywgdHJ1ZSkgJiYgdGVzdEFsbFByb3BzKCdiYWNrZ3JvdW5kUG9zaXRpb25ZJywgJzVweCcsIHRydWUpO1xuICB9KTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIkJhY2tncm91bmQgUmVwZWF0XCIsXG4gIFwicHJvcGVydHlcIjogW1wiYmdyZXBlYXRzcGFjZVwiLCBcImJncmVwZWF0cm91bmRcIl0sXG4gIFwidGFnc1wiOiBbXCJjc3NcIl0sXG4gIFwiYnVpbGRlckFsaWFzZXNcIjogW1wiY3NzX2JhY2tncm91bmRyZXBlYXRcIl0sXG4gIFwiYXV0aG9yc1wiOiBbXCJSeWFuIFNlZGRvblwiXSxcbiAgXCJub3Rlc1wiOiBbe1xuICAgIFwibmFtZVwiOiBcIk1ETiBEb2NzXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQ1NTL2JhY2tncm91bmQtcmVwZWF0XCJcbiAgfSwge1xuICAgIFwibmFtZVwiOiBcIlRlc3QgUGFnZVwiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vanNiaW4uY29tL3V6ZXN1bi9cIlxuICB9LCB7XG4gICAgXCJuYW1lXCI6IFwiRGVtb1wiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vanNmaWRkbGUubmV0L3J5YW5zZWRkb24veU1MVFEvNi9cIlxuICB9XVxufVxuISovXG4vKiBET0NcbkRldGVjdHMgdGhlIGFiaWxpdHkgdG8gdXNlIHJvdW5kIGFuZCBzcGFjZSBhcyBwcm9wZXJ0aWVzIGZvciBiYWNrZ3JvdW5kLXJlcGVhdFxuKi9cblxuICAvLyBNdXN0IHZhbHVlLXRlc3QgdGhlc2VcbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ2JncmVwZWF0cm91bmQnLCB0ZXN0QWxsUHJvcHMoJ2JhY2tncm91bmRSZXBlYXQnLCAncm91bmQnKSk7XG4gIE1vZGVybml6ci5hZGRUZXN0KCdiZ3JlcGVhdHNwYWNlJywgdGVzdEFsbFByb3BzKCdiYWNrZ3JvdW5kUmVwZWF0JywgJ3NwYWNlJykpO1xuXG4vKiFcbntcbiAgXCJuYW1lXCI6IFwiQmFja2dyb3VuZCBTaXplXCIsXG4gIFwicHJvcGVydHlcIjogXCJiYWNrZ3JvdW5kc2l6ZVwiLFxuICBcInRhZ3NcIjogW1wiY3NzXCJdLFxuICBcImtub3duQnVnc1wiOiBbXCJUaGlzIHdpbGwgZmFsc2UgcG9zaXRpdmUgaW4gT3BlcmEgTWluaSAtIGh0dHBzOi8vZ2l0aHViLmNvbS9Nb2Rlcm5penIvTW9kZXJuaXpyL2lzc3Vlcy8zOTZcIl0sXG4gIFwibm90ZXNcIjogW3tcbiAgICBcIm5hbWVcIjogXCJSZWxhdGVkIElzc3VlXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL01vZGVybml6ci9Nb2Rlcm5penIvaXNzdWVzLzM5NlwiXG4gIH1dXG59XG4hKi9cblxuICBNb2Rlcm5penIuYWRkVGVzdCgnYmFja2dyb3VuZHNpemUnLCB0ZXN0QWxsUHJvcHMoJ2JhY2tncm91bmRTaXplJywgJzEwMCUnLCB0cnVlKSk7XG5cbi8qIVxue1xuICBcIm5hbWVcIjogXCJCYWNrZ3JvdW5kIFNpemUgQ292ZXJcIixcbiAgXCJwcm9wZXJ0eVwiOiBcImJnc2l6ZWNvdmVyXCIsXG4gIFwidGFnc1wiOiBbXCJjc3NcIl0sXG4gIFwiYnVpbGRlckFsaWFzZXNcIjogW1wiY3NzX2JhY2tncm91bmRzaXplY292ZXJcIl0sXG4gIFwibm90ZXNcIjogW3tcbiAgICBcIm5hbWVcIiA6IFwiTUROIERvY3NcIixcbiAgICBcImhyZWZcIjogXCJodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9DU1MvYmFja2dyb3VuZC1zaXplXCJcbiAgfV1cbn1cbiEqL1xuXG4gIC8vIE11c3QgdGVzdCB2YWx1ZSwgYXMgdGhpcyBzcGVjaWZpY2FsbHkgdGVzdHMgdGhlIGBjb3ZlcmAgdmFsdWVcbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ2Jnc2l6ZWNvdmVyJywgdGVzdEFsbFByb3BzKCdiYWNrZ3JvdW5kU2l6ZScsICdjb3ZlcicpKTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIkJvcmRlciBSYWRpdXNcIixcbiAgXCJwcm9wZXJ0eVwiOiBcImJvcmRlcnJhZGl1c1wiLFxuICBcImNhbml1c2VcIjogXCJib3JkZXItcmFkaXVzXCIsXG4gIFwicG9seWZpbGxzXCI6IFtcImNzczNwaWVcIl0sXG4gIFwidGFnc1wiOiBbXCJjc3NcIl0sXG4gIFwibm90ZXNcIjogW3tcbiAgICBcIm5hbWVcIjogXCJDb21wcmVoZW5zaXZlIENvbXBhdCBDaGFydFwiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vbXVkZGxlZHJhbWJsaW5ncy5jb20vdGFibGUtb2YtY3NzMy1ib3JkZXItcmFkaXVzLWNvbXBsaWFuY2VcIlxuICB9XVxufVxuISovXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ2JvcmRlcnJhZGl1cycsIHRlc3RBbGxQcm9wcygnYm9yZGVyUmFkaXVzJywgJzBweCcsIHRydWUpKTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIkJveCBTaGFkb3dcIixcbiAgXCJwcm9wZXJ0eVwiOiBcImJveHNoYWRvd1wiLFxuICBcImNhbml1c2VcIjogXCJjc3MtYm94c2hhZG93XCIsXG4gIFwidGFnc1wiOiBbXCJjc3NcIl0sXG4gIFwia25vd25CdWdzXCI6IFtcbiAgICBcIldlYk9TIGZhbHNlIHBvc2l0aXZlcyBvbiB0aGlzIHRlc3QuXCIsXG4gICAgXCJUaGUgS2luZGxlIFNpbGsgYnJvd3NlciBmYWxzZSBwb3NpdGl2ZXNcIlxuICBdXG59XG4hKi9cblxuICBNb2Rlcm5penIuYWRkVGVzdCgnYm94c2hhZG93JywgdGVzdEFsbFByb3BzKCdib3hTaGFkb3cnLCAnMXB4IDFweCcsIHRydWUpKTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIkJveCBTaXppbmdcIixcbiAgXCJwcm9wZXJ0eVwiOiBcImJveHNpemluZ1wiLFxuICBcImNhbml1c2VcIjogXCJjc3MzLWJveHNpemluZ1wiLFxuICBcInBvbHlmaWxsc1wiOiBbXCJib3JkZXJib3htb2RlbFwiLCBcImJveHNpemluZ3BvbHlmaWxsXCIsIFwiYm9yZGVyYm94XCJdLFxuICBcInRhZ3NcIjogW1wiY3NzXCJdLFxuICBcImJ1aWxkZXJBbGlhc2VzXCI6IFtcImNzc19ib3hzaXppbmdcIl0sXG4gIFwibm90ZXNcIjogW3tcbiAgICBcIm5hbWVcIjogXCJNRE4gRG9jc1wiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0NTUy9ib3gtc2l6aW5nXCJcbiAgfSx7XG4gICAgXCJuYW1lXCI6IFwiUmVsYXRlZCBHaXRodWIgSXNzdWVcIixcbiAgICBcImhyZWZcIjogXCJodHRwczovL2dpdGh1Yi5jb20vTW9kZXJuaXpyL01vZGVybml6ci9pc3N1ZXMvMjQ4XCJcbiAgfV1cbn1cbiEqL1xuXG4gIE1vZGVybml6ci5hZGRUZXN0KCdib3hzaXppbmcnLCB0ZXN0QWxsUHJvcHMoJ2JveFNpemluZycsICdib3JkZXItYm94JywgdHJ1ZSkgJiYgKGRvY3VtZW50LmRvY3VtZW50TW9kZSA9PT0gdW5kZWZpbmVkIHx8IGRvY3VtZW50LmRvY3VtZW50TW9kZSA+IDcpKTtcblxuXG4gIC8qKlxuICAgKiBMaXN0IG9mIHByb3BlcnR5IHZhbHVlcyB0byBzZXQgZm9yIGNzcyB0ZXN0cy4gU2VlIHRpY2tldCAjMjFcbiAgICogaHR0cDovL2dpdC5pby92VUdsNFxuICAgKlxuICAgKiBAbWVtYmVyb2YgTW9kZXJuaXpyXG4gICAqIEBuYW1lIE1vZGVybml6ci5fcHJlZml4ZXNcbiAgICogQG9wdGlvbk5hbWUgTW9kZXJuaXpyLl9wcmVmaXhlc1xuICAgKiBAb3B0aW9uUHJvcCBwcmVmaXhlc1xuICAgKiBAYWNjZXNzIHB1YmxpY1xuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBNb2Rlcm5penIuX3ByZWZpeGVzIGlzIHRoZSBpbnRlcm5hbCBsaXN0IG9mIHByZWZpeGVzIHRoYXQgd2UgdGVzdCBhZ2FpbnN0XG4gICAqIGluc2lkZSBvZiB0aGluZ3MgbGlrZSBbcHJlZml4ZWRdKCNtb2Rlcm5penItcHJlZml4ZWQpIGFuZCBbcHJlZml4ZWRDU1NdKCMtY29kZS1tb2Rlcm5penItcHJlZml4ZWRjc3MpLiBJdCBpcyBzaW1wbHlcbiAgICogYW4gYXJyYXkgb2Yga2ViYWItY2FzZSB2ZW5kb3IgcHJlZml4ZXMgeW91IGNhbiB1c2Ugd2l0aGluIHlvdXIgY29kZS5cbiAgICpcbiAgICogU29tZSBjb21tb24gdXNlIGNhc2VzIGluY2x1ZGVcbiAgICpcbiAgICogR2VuZXJhdGluZyBhbGwgcG9zc2libGUgcHJlZml4ZWQgdmVyc2lvbiBvZiBhIENTUyBwcm9wZXJ0eVxuICAgKiBgYGBqc1xuICAgKiB2YXIgcnVsZSA9IE1vZGVybml6ci5fcHJlZml4ZXMuam9pbigndHJhbnNmb3JtOiByb3RhdGUoMjBkZWcpOyAnKTtcbiAgICpcbiAgICogcnVsZSA9PT0gJ3RyYW5zZm9ybTogcm90YXRlKDIwZGVnKTsgd2Via2l0LXRyYW5zZm9ybTogcm90YXRlKDIwZGVnKTsgbW96LXRyYW5zZm9ybTogcm90YXRlKDIwZGVnKTsgby10cmFuc2Zvcm06IHJvdGF0ZSgyMGRlZyk7IG1zLXRyYW5zZm9ybTogcm90YXRlKDIwZGVnKTsnXG4gICAqIGBgYFxuICAgKlxuICAgKiBHZW5lcmF0aW5nIGFsbCBwb3NzaWJsZSBwcmVmaXhlZCB2ZXJzaW9uIG9mIGEgQ1NTIHZhbHVlXG4gICAqIGBgYGpzXG4gICAqIHJ1bGUgPSAnZGlzcGxheTonICsgIE1vZGVybml6ci5fcHJlZml4ZXMuam9pbignZmxleDsgZGlzcGxheTonKSArICdmbGV4JztcbiAgICpcbiAgICogcnVsZSA9PT0gJ2Rpc3BsYXk6ZmxleDsgZGlzcGxheTotd2Via2l0LWZsZXg7IGRpc3BsYXk6LW1vei1mbGV4OyBkaXNwbGF5Oi1vLWZsZXg7IGRpc3BsYXk6LW1zLWZsZXg7IGRpc3BsYXk6ZmxleCdcbiAgICogYGBgXG4gICAqL1xuXG4gIC8vIHdlIHVzZSBbJycsJyddIHJhdGhlciB0aGFuIGFuIGVtcHR5IGFycmF5IGluIG9yZGVyIHRvIGFsbG93IGEgcGF0dGVybiBvZiAuYGpvaW4oKWBpbmcgcHJlZml4ZXMgdG8gdGVzdFxuICAvLyB2YWx1ZXMgaW4gZmVhdHVyZSBkZXRlY3RzIHRvIGNvbnRpbnVlIHRvIHdvcmtcbiAgdmFyIHByZWZpeGVzID0gKE1vZGVybml6clByb3RvLl9jb25maWcudXNlUHJlZml4ZXMgPyAnIC13ZWJraXQtIC1tb3otIC1vLSAtbXMtICcuc3BsaXQoJyAnKSA6IFsnJywnJ10pO1xuXG4gIC8vIGV4cG9zZSB0aGVzZSBmb3IgdGhlIHBsdWdpbiBBUEkuIExvb2sgaW4gdGhlIHNvdXJjZSBmb3IgaG93IHRvIGpvaW4oKSB0aGVtIGFnYWluc3QgeW91ciBpbnB1dFxuICBNb2Rlcm5penJQcm90by5fcHJlZml4ZXMgPSBwcmVmaXhlcztcblxuICBcbi8qIVxue1xuICBcIm5hbWVcIjogXCJDU1MgQ2FsY1wiLFxuICBcInByb3BlcnR5XCI6IFwiY3NzY2FsY1wiLFxuICBcImNhbml1c2VcIjogXCJjYWxjXCIsXG4gIFwidGFnc1wiOiBbXCJjc3NcIl0sXG4gIFwiYnVpbGRlckFsaWFzZXNcIjogW1wiY3NzX2NhbGNcIl0sXG4gIFwiYXV0aG9yc1wiOiBbXCJAY2FsdmVpblwiXVxufVxuISovXG4vKiBET0Ncbk1ldGhvZCBvZiBhbGxvd2luZyBjYWxjdWxhdGVkIHZhbHVlcyBmb3IgbGVuZ3RoIHVuaXRzLiBGb3IgZXhhbXBsZTpcblxuYGBgY3NzXG4vL2xlbSB7XG4gIHdpZHRoOiBjYWxjKDEwMCUgLSAzZW0pO1xufVxuYGBgXG4qL1xuXG4gIE1vZGVybml6ci5hZGRUZXN0KCdjc3NjYWxjJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIHByb3AgPSAnd2lkdGg6JztcbiAgICB2YXIgdmFsdWUgPSAnY2FsYygxMHB4KTsnO1xuICAgIHZhciBlbCA9IGNyZWF0ZUVsZW1lbnQoJ2EnKTtcblxuICAgIGVsLnN0eWxlLmNzc1RleHQgPSBwcm9wICsgcHJlZml4ZXMuam9pbih2YWx1ZSArIHByb3ApO1xuXG4gICAgcmV0dXJuICEhZWwuc3R5bGUubGVuZ3RoO1xuICB9KTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIkNTUyBGb250IGNoIFVuaXRzXCIsXG4gIFwiYXV0aG9yc1wiOiBbXCJSb24gV2FsZG9uIChAam9rZXlyaHltZSlcIl0sXG4gIFwicHJvcGVydHlcIjogXCJjc3NjaHVuaXRcIixcbiAgXCJ0YWdzXCI6IFtcImNzc1wiXSxcbiAgXCJub3Rlc1wiOiBbe1xuICAgIFwibmFtZVwiOiBcIlczQyBTcGVjXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly93d3cudzMub3JnL1RSL2NzczMtdmFsdWVzLyNmb250LXJlbGF0aXZlLWxlbmd0aHNcIlxuICB9XVxufVxuISovXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ2Nzc2NodW5pdCcsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBlbGVtU3R5bGUgPSBtb2RFbGVtLmVsZW0uc3R5bGU7XG4gICAgdmFyIHN1cHBvcnRzO1xuICAgIHRyeSB7XG4gICAgICBlbGVtU3R5bGUuZm9udFNpemUgPSAnM2NoJztcbiAgICAgIHN1cHBvcnRzID0gZWxlbVN0eWxlLmZvbnRTaXplLmluZGV4T2YoJ2NoJykgIT09IC0xO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHN1cHBvcnRzID0gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBzdXBwb3J0cztcbiAgfSk7XG5cbi8qIVxue1xuICBcIm5hbWVcIjogXCJDU1MgQ3ViaWMgQmV6aWVyIFJhbmdlXCIsXG4gIFwicHJvcGVydHlcIjogXCJjdWJpY2JlemllcnJhbmdlXCIsXG4gIFwidGFnc1wiOiBbXCJjc3NcIl0sXG4gIFwiYnVpbGRlckFsaWFzZXNcIjogW1wiY3NzX2N1YmljYmV6aWVycmFuZ2VcIl0sXG4gIFwiZG9jXCIgOiBudWxsLFxuICBcImF1dGhvcnNcIjogW1wiQGNhbHZlaW5cIl0sXG4gIFwid2FybmluZ3NcIjogW1wiY3ViaWMtYmV6aWVyIHZhbHVlcyBjYW4ndCBiZSA+IDEgZm9yIFdlYmtpdCB1bnRpbCBbYnVnICM0NTc2MV0oaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTQ1NzYxKSBpcyBmaXhlZFwiXSxcbiAgXCJub3Rlc1wiOiBbe1xuICAgIFwibmFtZVwiOiBcIkNvbXByZWhlbnNpdmUgQ29tcGF0IENoYXJ0XCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cDovL211ZGRsZWRyYW1ibGluZ3MuY29tL3RhYmxlLW9mLWNzczMtYm9yZGVyLXJhZGl1cy1jb21wbGlhbmNlXCJcbiAgfV1cbn1cbiEqL1xuXG4gIE1vZGVybml6ci5hZGRUZXN0KCdjdWJpY2JlemllcnJhbmdlJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIGVsID0gY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGVsLnN0eWxlLmNzc1RleHQgPSBwcmVmaXhlcy5qb2luKCd0cmFuc2l0aW9uLXRpbWluZy1mdW5jdGlvbjpjdWJpYy1iZXppZXIoMSwwLDAsMS4xKTsgJyk7XG4gICAgcmV0dXJuICEhZWwuc3R5bGUubGVuZ3RoO1xuICB9KTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIkNTUyB0ZXh0LW92ZXJmbG93IGVsbGlwc2lzXCIsXG4gIFwicHJvcGVydHlcIjogXCJlbGxpcHNpc1wiLFxuICBcImNhbml1c2VcIjogXCJ0ZXh0LW92ZXJmbG93XCIsXG4gIFwicG9seWZpbGxzXCI6IFtcbiAgICBcInRleHQtb3ZlcmZsb3dcIlxuICBdLFxuICBcInRhZ3NcIjogW1wiY3NzXCJdXG59XG4hKi9cblxuICBNb2Rlcm5penIuYWRkVGVzdCgnZWxsaXBzaXMnLCB0ZXN0QWxsUHJvcHMoJ3RleHRPdmVyZmxvdycsICdlbGxpcHNpcycpKTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIkNTUyBGb250IGV4IFVuaXRzXCIsXG4gIFwiYXV0aG9yc1wiOiBbXCJSb24gV2FsZG9uIChAam9rZXlyaHltZSlcIl0sXG4gIFwicHJvcGVydHlcIjogXCJjc3NleHVuaXRcIixcbiAgXCJ0YWdzXCI6IFtcImNzc1wiXSxcbiAgXCJub3Rlc1wiOiBbe1xuICAgIFwibmFtZVwiOiBcIlczQyBTcGVjXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly93d3cudzMub3JnL1RSL2NzczMtdmFsdWVzLyNmb250LXJlbGF0aXZlLWxlbmd0aHNcIlxuICB9XVxufVxuISovXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ2Nzc2V4dW5pdCcsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBlbGVtU3R5bGUgPSBtb2RFbGVtLmVsZW0uc3R5bGU7XG4gICAgdmFyIHN1cHBvcnRzO1xuICAgIHRyeSB7XG4gICAgICBlbGVtU3R5bGUuZm9udFNpemUgPSAnM2V4JztcbiAgICAgIHN1cHBvcnRzID0gZWxlbVN0eWxlLmZvbnRTaXplLmluZGV4T2YoJ2V4JykgIT09IC0xO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHN1cHBvcnRzID0gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBzdXBwb3J0cztcbiAgfSk7XG5cbi8qIVxue1xuICBcIm5hbWVcIjogXCJGbGV4Ym94XCIsXG4gIFwicHJvcGVydHlcIjogXCJmbGV4Ym94XCIsXG4gIFwiY2FuaXVzZVwiOiBcImZsZXhib3hcIixcbiAgXCJ0YWdzXCI6IFtcImNzc1wiXSxcbiAgXCJub3Rlc1wiOiBbe1xuICAgIFwibmFtZVwiOiBcIlRoZSBfbmV3XyBmbGV4Ym94XCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cDovL2Rldi53My5vcmcvY3Nzd2cvY3NzMy1mbGV4Ym94XCJcbiAgfV0sXG4gIFwid2FybmluZ3NcIjogW1xuICAgIFwiQSBgdHJ1ZWAgcmVzdWx0IGZvciB0aGlzIGRldGVjdCBkb2VzIG5vdCBpbXBseSB0aGF0IHRoZSBgZmxleC13cmFwYCBwcm9wZXJ0eSBpcyBzdXBwb3J0ZWQ7IHNlZSB0aGUgYGZsZXh3cmFwYCBkZXRlY3QuXCJcbiAgXVxufVxuISovXG4vKiBET0NcbkRldGVjdHMgc3VwcG9ydCBmb3IgdGhlIEZsZXhpYmxlIEJveCBMYXlvdXQgbW9kZWwsIGEuay5hLiBGbGV4Ym94LCB3aGljaCBhbGxvd3MgZWFzeSBtYW5pcHVsYXRpb24gb2YgbGF5b3V0IG9yZGVyIGFuZCBzaXppbmcgd2l0aGluIGEgY29udGFpbmVyLlxuKi9cblxuICBNb2Rlcm5penIuYWRkVGVzdCgnZmxleGJveCcsIHRlc3RBbGxQcm9wcygnZmxleEJhc2lzJywgJzFweCcsIHRydWUpKTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIkZsZXggTGluZSBXcmFwcGluZ1wiLFxuICBcInByb3BlcnR5XCI6IFwiZmxleHdyYXBcIixcbiAgXCJ0YWdzXCI6IFtcImNzc1wiLCBcImZsZXhib3hcIl0sXG4gIFwibm90ZXNcIjogW3tcbiAgICBcIm5hbWVcIjogXCJXM0MgRmxleGlibGUgQm94IExheW91dCBzcGVjXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cDovL2Rldi53My5vcmcvY3Nzd2cvY3NzMy1mbGV4Ym94XCJcbiAgfV0sXG4gIFwid2FybmluZ3NcIjogW1xuICAgIFwiRG9lcyBub3QgaW1wbHkgYSBtb2Rlcm4gaW1wbGVtZW50YXRpb24g4oCTIHNlZSBkb2N1bWVudGF0aW9uLlwiXG4gIF1cbn1cbiEqL1xuLyogRE9DXG5EZXRlY3RzIHN1cHBvcnQgZm9yIHRoZSBgZmxleC13cmFwYCBDU1MgcHJvcGVydHksIHBhcnQgb2YgRmxleGJveCwgd2hpY2ggaXNu4oCZdCBwcmVzZW50IGluIGFsbCBGbGV4Ym94IGltcGxlbWVudGF0aW9ucyAobm90YWJseSBGaXJlZm94KS5cblxuVGhpcyBmZWF0dXJlZCBpbiBib3RoIHRoZSAndHdlZW5lcicgc3ludGF4IChpbXBsZW1lbnRlZCBieSBJRTEwKSBhbmQgdGhlICdtb2Rlcm4nIHN5bnRheCAoaW1wbGVtZW50ZWQgYnkgb3RoZXJzKS4gVGhpcyBkZXRlY3Qgd2lsbCByZXR1cm4gYHRydWVgIGZvciBlaXRoZXIgb2YgdGhlc2UgaW1wbGVtZW50YXRpb25zLCBhcyBsb25nIGFzIHRoZSBgZmxleC13cmFwYCBwcm9wZXJ0eSBpcyBzdXBwb3J0ZWQuIFNvIHRvIGVuc3VyZSB0aGUgbW9kZXJuIHN5bnRheCBpcyBzdXBwb3J0ZWQsIHVzZSB0b2dldGhlciB3aXRoIGBNb2Rlcm5penIuZmxleGJveGA6XG5cbmBgYGphdmFzY3JpcHRcbmlmIChNb2Rlcm5penIuZmxleGJveCAmJiBNb2Rlcm5penIuZmxleHdyYXApIHtcbiAgLy8gTW9kZXJuIEZsZXhib3ggd2l0aCBgZmxleC13cmFwYCBzdXBwb3J0ZWRcbn1cbmVsc2Uge1xuICAvLyBFaXRoZXIgb2xkIEZsZXhib3ggc3ludGF4LCBvciBgZmxleC13cmFwYCBub3Qgc3VwcG9ydGVkXG59XG5gYGBcbiovXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ2ZsZXh3cmFwJywgdGVzdEFsbFByb3BzKCdmbGV4V3JhcCcsICd3cmFwJywgdHJ1ZSkpO1xuXG5cbiAgLyoqXG4gICAqIHRlc3RTdHlsZXMgaW5qZWN0cyBhbiBlbGVtZW50IHdpdGggc3R5bGUgZWxlbWVudCBhbmQgc29tZSBDU1MgcnVsZXNcbiAgICpcbiAgICogQG1lbWJlcm9mIE1vZGVybml6clxuICAgKiBAbmFtZSBNb2Rlcm5penIudGVzdFN0eWxlc1xuICAgKiBAb3B0aW9uTmFtZSBNb2Rlcm5penIudGVzdFN0eWxlcygpXG4gICAqIEBvcHRpb25Qcm9wIHRlc3RTdHlsZXNcbiAgICogQGFjY2VzcyBwdWJsaWNcbiAgICogQGZ1bmN0aW9uIHRlc3RTdHlsZXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJ1bGUgLSBTdHJpbmcgcmVwcmVzZW50aW5nIGEgY3NzIHJ1bGVcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBBIGZ1bmN0aW9uIHRoYXQgaXMgdXNlZCB0byB0ZXN0IHRoZSBpbmplY3RlZCBlbGVtZW50XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbbm9kZXNdIC0gQW4gaW50ZWdlciByZXByZXNlbnRpbmcgdGhlIG51bWJlciBvZiBhZGRpdGlvbmFsIG5vZGVzIHlvdSB3YW50IGluamVjdGVkXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IFt0ZXN0bmFtZXNdIC0gQW4gYXJyYXkgb2Ygc3RyaW5ncyB0aGF0IGFyZSB1c2VkIGFzIGlkcyBmb3IgdGhlIGFkZGl0aW9uYWwgbm9kZXNcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIGBNb2Rlcm5penIudGVzdFN0eWxlc2AgdGFrZXMgYSBDU1MgcnVsZSBhbmQgaW5qZWN0cyBpdCBvbnRvIHRoZSBjdXJyZW50IHBhZ2VcbiAgICogYWxvbmcgd2l0aCAocG9zc2libHkgbXVsdGlwbGUpIERPTSBlbGVtZW50cy4gVGhpcyBsZXRzIHlvdSBjaGVjayBmb3IgZmVhdHVyZXNcbiAgICogdGhhdCBjYW4gbm90IGJlIGRldGVjdGVkIGJ5IHNpbXBseSBjaGVja2luZyB0aGUgW0lETF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9Nb3ppbGxhL0RldmVsb3Blcl9ndWlkZS9JbnRlcmZhY2VfZGV2ZWxvcG1lbnRfZ3VpZGUvSURMX2ludGVyZmFjZV9ydWxlcykuXG4gICAqXG4gICAqIGBgYGpzXG4gICAqIE1vZGVybml6ci50ZXN0U3R5bGVzKCcjbW9kZXJuaXpyIHsgd2lkdGg6IDlweDsgY29sb3I6IHBhcGF5YXdoaXA7IH0nLCBmdW5jdGlvbihlbGVtLCBydWxlKSB7XG4gICAqICAgLy8gZWxlbSBpcyB0aGUgZmlyc3QgRE9NIG5vZGUgaW4gdGhlIHBhZ2UgKGJ5IGRlZmF1bHQgI21vZGVybml6cilcbiAgICogICAvLyBydWxlIGlzIHRoZSBmaXJzdCBhcmd1bWVudCB5b3Ugc3VwcGxpZWQgLSB0aGUgQ1NTIHJ1bGUgaW4gc3RyaW5nIGZvcm1cbiAgICpcbiAgICogICBhZGRUZXN0KCd3aWR0aHdvcmtzJywgZWxlbS5zdHlsZS53aWR0aCA9PT0gJzlweCcpXG4gICAqIH0pO1xuICAgKiBgYGBcbiAgICpcbiAgICogSWYgeW91ciB0ZXN0IHJlcXVpcmVzIG11bHRpcGxlIG5vZGVzLCB5b3UgY2FuIGluY2x1ZGUgYSB0aGlyZCBhcmd1bWVudFxuICAgKiBpbmRpY2F0aW5nIGhvdyBtYW55IGFkZGl0aW9uYWwgZGl2IGVsZW1lbnRzIHRvIGluY2x1ZGUgb24gdGhlIHBhZ2UuIFRoZVxuICAgKiBhZGRpdGlvbmFsIG5vZGVzIGFyZSBpbmplY3RlZCBhcyBjaGlsZHJlbiBvZiB0aGUgYGVsZW1gIHRoYXQgaXMgcmV0dXJuZWQgYXNcbiAgICogdGhlIGZpcnN0IGFyZ3VtZW50IHRvIHRoZSBjYWxsYmFjay5cbiAgICpcbiAgICogYGBganNcbiAgICogTW9kZXJuaXpyLnRlc3RTdHlsZXMoJyNtb2Rlcm5penIge3dpZHRoOiAxcHh9OyAjbW9kZXJuaXpyMiB7d2lkdGg6IDJweH0nLCBmdW5jdGlvbihlbGVtKSB7XG4gICAqICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGVybml6cicpLnN0eWxlLndpZHRoID09PSAnMXB4JzsgLy8gdHJ1ZVxuICAgKiAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2Rlcm5penIyJykuc3R5bGUud2lkdGggPT09ICcycHgnOyAvLyB0cnVlXG4gICAqICAgZWxlbS5maXJzdENoaWxkID09PSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kZXJuaXpyMicpOyAvLyB0cnVlXG4gICAqIH0sIDEpO1xuICAgKiBgYGBcbiAgICpcbiAgICogQnkgZGVmYXVsdCwgYWxsIG9mIHRoZSBhZGRpdGlvbmFsIGVsZW1lbnRzIGhhdmUgYW4gSUQgb2YgYG1vZGVybml6cltuXWAsIHdoZXJlXG4gICAqIGBuYCBpcyBpdHMgaW5kZXggKGUuZy4gdGhlIGZpcnN0IGFkZGl0aW9uYWwsIHNlY29uZCBvdmVyYWxsIGlzIGAjbW9kZXJuaXpyMmAsXG4gICAqIHRoZSBzZWNvbmQgYWRkaXRpb25hbCBpcyBgI21vZGVybml6cjNgLCBldGMuKS5cbiAgICogSWYgeW91IHdhbnQgdG8gaGF2ZSBtb3JlIG1lYW5pbmdmdWwgSURzIGZvciB5b3VyIGZ1bmN0aW9uLCB5b3UgY2FuIHByb3ZpZGVcbiAgICogdGhlbSBhcyB0aGUgZm91cnRoIGFyZ3VtZW50LCBhcyBhbiBhcnJheSBvZiBzdHJpbmdzXG4gICAqXG4gICAqIGBgYGpzXG4gICAqIE1vZGVybml6ci50ZXN0U3R5bGVzKCcjZm9vIHt3aWR0aDogMTBweH07ICNiYXIge2hlaWdodDogMjBweH0nLCBmdW5jdGlvbihlbGVtKSB7XG4gICAqICAgZWxlbS5maXJzdENoaWxkID09PSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZm9vJyk7IC8vIHRydWVcbiAgICogICBlbGVtLmxhc3RDaGlsZCA9PT0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhcicpOyAvLyB0cnVlXG4gICAqIH0sIDIsIFsnZm9vJywgJ2JhciddKTtcbiAgICogYGBgXG4gICAqXG4gICAqL1xuXG4gIHZhciB0ZXN0U3R5bGVzID0gTW9kZXJuaXpyUHJvdG8udGVzdFN0eWxlcyA9IGluamVjdEVsZW1lbnRXaXRoU3R5bGVzO1xuICBcbi8qIVxue1xuICBcIm5hbWVcIjogXCJAZm9udC1mYWNlXCIsXG4gIFwicHJvcGVydHlcIjogXCJmb250ZmFjZVwiLFxuICBcImF1dGhvcnNcIjogW1wiRGllZ28gUGVyaW5pXCIsIFwiTWF0IE1hcnF1aXNcIl0sXG4gIFwidGFnc1wiOiBbXCJjc3NcIl0sXG4gIFwia25vd25CdWdzXCI6IFtcbiAgICBcIkZhbHNlIFBvc2l0aXZlOiBXZWJPUyBodHRwczovL2dpdGh1Yi5jb20vTW9kZXJuaXpyL01vZGVybml6ci9pc3N1ZXMvMzQyXCIsXG4gICAgXCJGYWxzZSBQb3N0aXZlOiBXUDcgaHR0cHM6Ly9naXRodWIuY29tL01vZGVybml6ci9Nb2Rlcm5penIvaXNzdWVzLzUzOFwiXG4gIF0sXG4gIFwibm90ZXNcIjogW3tcbiAgICBcIm5hbWVcIjogXCJAZm9udC1mYWNlIGRldGVjdGlvbiByb3V0aW5lIGJ5IERpZWdvIFBlcmluaVwiLFxuICAgIFwiaHJlZlwiOiBcImh0dHA6Ly9qYXZhc2NyaXB0Lm53Ym94LmNvbS9DU1NTdXBwb3J0L1wiXG4gIH0se1xuICAgIFwibmFtZVwiOiBcIkZpbGFtZW50IEdyb3VwIEBmb250LWZhY2UgY29tcGF0aWJpbGl0eSByZXNlYXJjaFwiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vZG9jcy5nb29nbGUuY29tL3ByZXNlbnRhdGlvbi9kLzFuNE55RzR1UFJqQUE4em5fcFNRX0tldDBSaGNXQzZRbFo2TE1qS2VFQ28wL2VkaXQjc2xpZGU9aWQucFwiXG4gIH0se1xuICAgIFwibmFtZVwiOiBcIkZpbGFtZW50IEdydW50aWNvbi9AZm9udC1mYWNlIGRldmljZSB0ZXN0aW5nIHJlc3VsdHNcIixcbiAgICBcImhyZWZcIjogXCJodHRwczovL2RvY3MuZ29vZ2xlLmNvbS9zcHJlYWRzaGVldC9jY2M/a2V5PTBBZzVfeUd2eHBJTlJkSEZZZVVKUE5uWk1XVVpLUjJJdE1FcFJUWFpQZFVFI2dpZD0wXCJcbiAgfSx7XG4gICAgXCJuYW1lXCI6IFwiQ1NTIGZvbnRzIG9uIEFuZHJvaWRcIixcbiAgICBcImhyZWZcIjogXCJodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zMjAwMDY5L2Nzcy1mb250cy1vbi1hbmRyb2lkXCJcbiAgfSx7XG4gICAgXCJuYW1lXCI6IFwiQGZvbnQtZmFjZSBhbmQgQW5kcm9pZFwiLFxuICAgIFwiaHJlZlwiOiBcImh0dHA6Ly9hcmNoaXZpc3QuaW5jdXRpby5jb20vdmlld2xpc3QvY3NzLWRpc2N1c3MvMTE1OTYwXCJcbiAgfV1cbn1cbiEqL1xuXG4gIHZhciBibGFja2xpc3QgPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHVhID0gbmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgICB2YXIgd2Vib3MgPSB1YS5tYXRjaCgvdyhlYik/b3Nicm93c2VyL2dpKTtcbiAgICB2YXIgd3BwcmU4ID0gdWEubWF0Y2goL3dpbmRvd3MgcGhvbmUvZ2kpICYmIHVhLm1hdGNoKC9pZW1vYmlsZVxcLyhbMC05XSkrL2dpKSAmJiBwYXJzZUZsb2F0KFJlZ0V4cC4kMSkgPj0gOTtcbiAgICByZXR1cm4gd2Vib3MgfHwgd3BwcmU4O1xuICB9KCkpO1xuICBpZiAoYmxhY2tsaXN0KSB7XG4gICAgTW9kZXJuaXpyLmFkZFRlc3QoJ2ZvbnRmYWNlJywgZmFsc2UpO1xuICB9IGVsc2Uge1xuICAgIHRlc3RTdHlsZXMoJ0Bmb250LWZhY2Uge2ZvbnQtZmFtaWx5OlwiZm9udFwiO3NyYzp1cmwoXCJodHRwczovL1wiKX0nLCBmdW5jdGlvbihub2RlLCBydWxlKSB7XG4gICAgICB2YXIgc3R5bGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc21vZGVybml6cicpO1xuICAgICAgdmFyIHNoZWV0ID0gc3R5bGUuc2hlZXQgfHwgc3R5bGUuc3R5bGVTaGVldDtcbiAgICAgIHZhciBjc3NUZXh0ID0gc2hlZXQgPyAoc2hlZXQuY3NzUnVsZXMgJiYgc2hlZXQuY3NzUnVsZXNbMF0gPyBzaGVldC5jc3NSdWxlc1swXS5jc3NUZXh0IDogc2hlZXQuY3NzVGV4dCB8fCAnJykgOiAnJztcbiAgICAgIHZhciBib29sID0gL3NyYy9pLnRlc3QoY3NzVGV4dCkgJiYgY3NzVGV4dC5pbmRleE9mKHJ1bGUuc3BsaXQoJyAnKVswXSkgPT09IDA7XG4gICAgICBNb2Rlcm5penIuYWRkVGVzdCgnZm9udGZhY2UnLCBib29sKTtcbiAgICB9KTtcbiAgfVxuO1xuLyohXG57XG4gIFwibmFtZVwiOiBcIkNTUyBHZW5lcmF0ZWQgQ29udGVudFwiLFxuICBcInByb3BlcnR5XCI6IFwiZ2VuZXJhdGVkY29udGVudFwiLFxuICBcInRhZ3NcIjogW1wiY3NzXCJdLFxuICBcIndhcm5pbmdzXCI6IFtcIkFuZHJvaWQgd29uJ3QgcmV0dXJuIGNvcnJlY3QgaGVpZ2h0IGZvciBhbnl0aGluZyBiZWxvdyA3cHggIzczOFwiXSxcbiAgXCJub3Rlc1wiOiBbe1xuICAgIFwibmFtZVwiOiBcIlczQyBDU1MgU2VsZWN0b3JzIExldmVsIDMgc3BlY1wiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vd3d3LnczLm9yZy9UUi9jc3MzLXNlbGVjdG9ycy8jZ2VuLWNvbnRlbnRcIlxuICB9LHtcbiAgICBcIm5hbWVcIjogXCJNRE4gYXJ0aWNsZSBvbiA6YmVmb3JlXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQ1NTLzo6YmVmb3JlXCJcbiAgfSx7XG4gICAgXCJuYW1lXCI6IFwiTUROIGFydGljbGUgb24gOmFmdGVyXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQ1NTLzo6YmVmb3JlXCJcbiAgfV1cbn1cbiEqL1xuXG4gIHRlc3RTdHlsZXMoJyNtb2Rlcm5penJ7Zm9udDowLzAgYX0jbW9kZXJuaXpyOmFmdGVye2NvbnRlbnQ6XCI6KVwiO3Zpc2liaWxpdHk6aGlkZGVuO2ZvbnQ6N3B4LzEgYX0nLCBmdW5jdGlvbihub2RlKSB7XG4gICAgLy8gU2VlIGJ1ZyByZXBvcnQgb24gd2h5IHRoaXMgdmFsdWUgaXMgNiBjcmJ1Zy5jb20vNjA4MTQyXG4gICAgTW9kZXJuaXpyLmFkZFRlc3QoJ2dlbmVyYXRlZGNvbnRlbnQnLCBub2RlLm9mZnNldEhlaWdodCA+PSA2KTtcbiAgfSk7XG5cbi8qIVxue1xuICBcIm5hbWVcIjogXCJDU1MgR3JhZGllbnRzXCIsXG4gIFwiY2FuaXVzZVwiOiBcImNzcy1ncmFkaWVudHNcIixcbiAgXCJwcm9wZXJ0eVwiOiBcImNzc2dyYWRpZW50c1wiLFxuICBcInRhZ3NcIjogW1wiY3NzXCJdLFxuICBcImtub3duQnVnc1wiOiBbXCJGYWxzZS1wb3NpdGl2ZXMgb24gd2ViT1MgKGh0dHBzOi8vZ2l0aHViLmNvbS9Nb2Rlcm5penIvTW9kZXJuaXpyL2lzc3Vlcy8yMDIpXCJdLFxuICBcIm5vdGVzXCI6IFt7XG4gICAgXCJuYW1lXCI6IFwiV2Via2l0IEdyYWRpZW50IFN5bnRheFwiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vd2Via2l0Lm9yZy9ibG9nLzE3NS9pbnRyb2R1Y2luZy1jc3MtZ3JhZGllbnRzL1wiXG4gIH0se1xuICAgIFwibmFtZVwiOiBcIkxpbmVhciBHcmFkaWVudCBTeW50YXhcIixcbiAgICBcImhyZWZcIjogXCJodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9DU1MvbGluZWFyLWdyYWRpZW50XCJcbiAgfSx7XG4gICAgXCJuYW1lXCI6IFwiVzNDIEdyYWRpZW50IFNwZWNcIixcbiAgICBcImhyZWZcIjogXCJodHRwczovL2RyYWZ0cy5jc3N3Zy5vcmcvY3NzLWltYWdlcy0zLyNncmFkaWVudHNcIlxuICB9XVxufVxuISovXG5cblxuICBNb2Rlcm5penIuYWRkVGVzdCgnY3NzZ3JhZGllbnRzJywgZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgc3RyMSA9ICdiYWNrZ3JvdW5kLWltYWdlOic7XG4gICAgdmFyIHN0cjIgPSAnZ3JhZGllbnQobGluZWFyLGxlZnQgdG9wLHJpZ2h0IGJvdHRvbSxmcm9tKCM5ZjkpLHRvKHdoaXRlKSk7JztcbiAgICB2YXIgY3NzID0gJyc7XG4gICAgdmFyIGFuZ2xlO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHByZWZpeGVzLmxlbmd0aCAtIDE7IGkgPCBsZW47IGkrKykge1xuICAgICAgYW5nbGUgPSAoaSA9PT0gMCA/ICd0byAnIDogJycpO1xuICAgICAgY3NzICs9IHN0cjEgKyBwcmVmaXhlc1tpXSArICdsaW5lYXItZ3JhZGllbnQoJyArIGFuZ2xlICsgJ2xlZnQgdG9wLCAjOWY5LCB3aGl0ZSk7JztcbiAgICB9XG5cbiAgICBpZiAoTW9kZXJuaXpyLl9jb25maWcudXNlUHJlZml4ZXMpIHtcbiAgICAvLyBsZWdhY3kgd2Via2l0IHN5bnRheCAoRklYTUU6IHJlbW92ZSB3aGVuIHN5bnRheCBub3QgaW4gdXNlIGFueW1vcmUpXG4gICAgICBjc3MgKz0gc3RyMSArICctd2Via2l0LScgKyBzdHIyO1xuICAgIH1cblxuICAgIHZhciBlbGVtID0gY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIHZhciBzdHlsZSA9IGVsZW0uc3R5bGU7XG4gICAgc3R5bGUuY3NzVGV4dCA9IGNzcztcblxuICAgIC8vIElFNiByZXR1cm5zIHVuZGVmaW5lZCBzbyBjYXN0IHRvIHN0cmluZ1xuICAgIHJldHVybiAoJycgKyBzdHlsZS5iYWNrZ3JvdW5kSW1hZ2UpLmluZGV4T2YoJ2dyYWRpZW50JykgPiAtMTtcbiAgfSk7XG5cbi8qIVxue1xuICBcIm5hbWVcIjogXCJDU1MgSFNMQSBDb2xvcnNcIixcbiAgXCJjYW5pdXNlXCI6IFwiY3NzMy1jb2xvcnNcIixcbiAgXCJwcm9wZXJ0eVwiOiBcImhzbGFcIixcbiAgXCJ0YWdzXCI6IFtcImNzc1wiXVxufVxuISovXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ2hzbGEnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3R5bGUgPSBjcmVhdGVFbGVtZW50KCdhJykuc3R5bGU7XG4gICAgc3R5bGUuY3NzVGV4dCA9ICdiYWNrZ3JvdW5kLWNvbG9yOmhzbGEoMTIwLDQwJSwxMDAlLC41KSc7XG4gICAgcmV0dXJuIGNvbnRhaW5zKHN0eWxlLmJhY2tncm91bmRDb2xvciwgJ3JnYmEnKSB8fCBjb250YWlucyhzdHlsZS5iYWNrZ3JvdW5kQ29sb3IsICdoc2xhJyk7XG4gIH0pO1xuXG4vKiFcbntcbiAgXCJuYW1lXCI6IFwiQ1NTIDpsYXN0LWNoaWxkIHBzZXVkby1zZWxlY3RvclwiLFxuICBcImNhbml1c2VcIjogXCJjc3Mtc2VsM1wiLFxuICBcInByb3BlcnR5XCI6IFwibGFzdGNoaWxkXCIsXG4gIFwidGFnc1wiOiBbXCJjc3NcIl0sXG4gIFwiYnVpbGRlckFsaWFzZXNcIjogW1wiY3NzX2xhc3RjaGlsZFwiXSxcbiAgXCJub3Rlc1wiOiBbe1xuICAgIFwibmFtZVwiOiBcIlJlbGF0ZWQgR2l0aHViIElzc3VlXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL01vZGVybml6ci9Nb2Rlcm5penIvcHVsbC8zMDRcIlxuICB9XVxufVxuISovXG5cbiAgdGVzdFN0eWxlcygnI21vZGVybml6ciBkaXYge3dpZHRoOjEwMHB4fSAjbW9kZXJuaXpyIDpsYXN0LWNoaWxke3dpZHRoOjIwMHB4O2Rpc3BsYXk6YmxvY2t9JywgZnVuY3Rpb24oZWxlbSkge1xuICAgIE1vZGVybml6ci5hZGRUZXN0KCdsYXN0Y2hpbGQnLCBlbGVtLmxhc3RDaGlsZC5vZmZzZXRXaWR0aCA+IGVsZW0uZmlyc3RDaGlsZC5vZmZzZXRXaWR0aCk7XG4gIH0sIDIpO1xuXG4vKiFcbntcbiAgXCJuYW1lXCI6IFwiQ1NTIE1lZGlhIFF1ZXJpZXNcIixcbiAgXCJjYW5pdXNlXCI6IFwiY3NzLW1lZGlhcXVlcmllc1wiLFxuICBcInByb3BlcnR5XCI6IFwibWVkaWFxdWVyaWVzXCIsXG4gIFwidGFnc1wiOiBbXCJjc3NcIl0sXG4gIFwiYnVpbGRlckFsaWFzZXNcIjogW1wiY3NzX21lZGlhcXVlcmllc1wiXVxufVxuISovXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ21lZGlhcXVlcmllcycsIG1xKCdvbmx5IGFsbCcpKTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIkNTUyBNdWx0aXBsZSBCYWNrZ3JvdW5kc1wiLFxuICBcImNhbml1c2VcIjogXCJtdWx0aWJhY2tncm91bmRzXCIsXG4gIFwicHJvcGVydHlcIjogXCJtdWx0aXBsZWJnc1wiLFxuICBcInRhZ3NcIjogW1wiY3NzXCJdXG59XG4hKi9cblxuICAvLyBTZXR0aW5nIG11bHRpcGxlIGltYWdlcyBBTkQgYSBjb2xvciBvbiB0aGUgYmFja2dyb3VuZCBzaG9ydGhhbmQgcHJvcGVydHlcbiAgLy8gYW5kIHRoZW4gcXVlcnlpbmcgdGhlIHN0eWxlLmJhY2tncm91bmQgcHJvcGVydHkgdmFsdWUgZm9yIHRoZSBudW1iZXIgb2ZcbiAgLy8gb2NjdXJyZW5jZXMgb2YgXCJ1cmwoXCIgaXMgYSByZWxpYWJsZSBtZXRob2QgZm9yIGRldGVjdGluZyBBQ1RVQUwgc3VwcG9ydCBmb3IgdGhpcyFcblxuICBNb2Rlcm5penIuYWRkVGVzdCgnbXVsdGlwbGViZ3MnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3R5bGUgPSBjcmVhdGVFbGVtZW50KCdhJykuc3R5bGU7XG4gICAgc3R5bGUuY3NzVGV4dCA9ICdiYWNrZ3JvdW5kOnVybChodHRwczovLyksdXJsKGh0dHBzOi8vKSxyZWQgdXJsKGh0dHBzOi8vKSc7XG5cbiAgICAvLyBJZiB0aGUgVUEgc3VwcG9ydHMgbXVsdGlwbGUgYmFja2dyb3VuZHMsIHRoZXJlIHNob3VsZCBiZSB0aHJlZSBvY2N1cnJlbmNlc1xuICAgIC8vIG9mIHRoZSBzdHJpbmcgXCJ1cmwoXCIgaW4gdGhlIHJldHVybiB2YWx1ZSBmb3IgZWxlbVN0eWxlLmJhY2tncm91bmRcbiAgICByZXR1cm4gKC8odXJsXFxzKlxcKC4qPyl7M30vKS50ZXN0KHN0eWxlLmJhY2tncm91bmQpO1xuICB9KTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIkNTUyA6bnRoLWNoaWxkIHBzZXVkby1zZWxlY3RvclwiLFxuICBcImNhbml1c2VcIjogXCJjc3Mtc2VsM1wiLFxuICBcInByb3BlcnR5XCI6IFwibnRoY2hpbGRcIixcbiAgXCJ0YWdzXCI6IFtcImNzc1wiXSxcbiAgXCJub3Rlc1wiOiBbXG4gICAge1xuICAgICAgXCJuYW1lXCI6IFwiUmVsYXRlZCBHaXRodWIgSXNzdWVcIixcbiAgICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9Nb2Rlcm5penIvTW9kZXJuaXpyL3B1bGwvNjg1XCJcbiAgICB9LFxuICAgIHtcbiAgICAgIFwibmFtZVwiOiBcIlNpdGVwb2ludCA6bnRoLWNoaWxkIGRvY3VtZW50YXRpb25cIixcbiAgICAgIFwiaHJlZlwiOiBcImh0dHA6Ly9yZWZlcmVuY2Uuc2l0ZXBvaW50LmNvbS9jc3MvcHNldWRvY2xhc3MtbnRoY2hpbGRcIlxuICAgIH1cbiAgXSxcbiAgXCJhdXRob3JzXCI6IFtcIkBlbWlsY2hyaXN0ZW5zZW5cIl0sXG4gIFwid2FybmluZ3NcIjogW1wiS25vd24gZmFsc2UgbmVnYXRpdmUgaW4gU2FmYXJpIDMuMSBhbmQgU2FmYXJpIDMuMi4yXCJdXG59XG4hKi9cbi8qIERPQ1xuRGV0ZWN0cyBzdXBwb3J0IGZvciB0aGUgJzpudGgtY2hpbGQoKScgQ1NTIHBzZXVkby1zZWxlY3Rvci5cbiovXG5cbiAgLy8gNSBgPGRpdj5gIGVsZW1lbnRzIHdpdGggYDFweGAgd2lkdGggYXJlIGNyZWF0ZWQuXG4gIC8vIFRoZW4gZXZlcnkgb3RoZXIgZWxlbWVudCBoYXMgaXRzIGB3aWR0aGAgc2V0IHRvIGAycHhgLlxuICAvLyBBIEphdmFzY3JpcHQgbG9vcCB0aGVuIHRlc3RzIGlmIHRoZSBgPGRpdj5gcyBoYXZlIHRoZSBleHBlY3RlZCB3aWR0aFxuICAvLyB1c2luZyB0aGUgbW9kdWx1cyBvcGVyYXRvci5cbiAgdGVzdFN0eWxlcygnI21vZGVybml6ciBkaXYge3dpZHRoOjFweH0gI21vZGVybml6ciBkaXY6bnRoLWNoaWxkKDJuKSB7d2lkdGg6MnB4O30nLCBmdW5jdGlvbihlbGVtKSB7XG4gICAgdmFyIGVsZW1zID0gZWxlbS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZGl2Jyk7XG4gICAgdmFyIGNvcnJlY3RXaWR0aHMgPSB0cnVlO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCA1OyBpKyspIHtcbiAgICAgIGNvcnJlY3RXaWR0aHMgPSBjb3JyZWN0V2lkdGhzICYmIGVsZW1zW2ldLm9mZnNldFdpZHRoID09PSBpICUgMiArIDE7XG4gICAgfVxuICAgIE1vZGVybml6ci5hZGRUZXN0KCdudGhjaGlsZCcsIGNvcnJlY3RXaWR0aHMpO1xuICB9LCA1KTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIkNTUyBPYmplY3QgRml0XCIsXG4gIFwiY2FuaXVzZVwiOiBcIm9iamVjdC1maXRcIixcbiAgXCJwcm9wZXJ0eVwiOiBcIm9iamVjdGZpdFwiLFxuICBcInRhZ3NcIjogW1wiY3NzXCJdLFxuICBcImJ1aWxkZXJBbGlhc2VzXCI6IFtcImNzc19vYmplY3RmaXRcIl0sXG4gIFwibm90ZXNcIjogW3tcbiAgICBcIm5hbWVcIjogXCJPcGVyYSBBcnRpY2xlIG9uIE9iamVjdCBGaXRcIixcbiAgICBcImhyZWZcIjogXCJodHRwczovL2Rldi5vcGVyYS5jb20vYXJ0aWNsZXMvY3NzMy1vYmplY3QtZml0LW9iamVjdC1wb3NpdGlvbi9cIlxuICB9XVxufVxuISovXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ29iamVjdGZpdCcsICEhcHJlZml4ZWQoJ29iamVjdEZpdCcpLCB7YWxpYXNlczogWydvYmplY3QtZml0J119KTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIkNTUyBPcGFjaXR5XCIsXG4gIFwiY2FuaXVzZVwiOiBcImNzcy1vcGFjaXR5XCIsXG4gIFwicHJvcGVydHlcIjogXCJvcGFjaXR5XCIsXG4gIFwidGFnc1wiOiBbXCJjc3NcIl1cbn1cbiEqL1xuXG4gIC8vIEJyb3dzZXJzIHRoYXQgYWN0dWFsbHkgaGF2ZSBDU1MgT3BhY2l0eSBpbXBsZW1lbnRlZCBoYXZlIGRvbmUgc29cbiAgLy8gYWNjb3JkaW5nIHRvIHNwZWMsIHdoaWNoIG1lYW5zIHRoZWlyIHJldHVybiB2YWx1ZXMgYXJlIHdpdGhpbiB0aGVcbiAgLy8gcmFuZ2Ugb2YgWzAuMCwxLjBdIC0gaW5jbHVkaW5nIHRoZSBsZWFkaW5nIHplcm8uXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ29wYWNpdHknLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3R5bGUgPSBjcmVhdGVFbGVtZW50KCdhJykuc3R5bGU7XG4gICAgc3R5bGUuY3NzVGV4dCA9IHByZWZpeGVzLmpvaW4oJ29wYWNpdHk6LjU1OycpO1xuXG4gICAgLy8gVGhlIG5vbi1saXRlcmFsIC4gaW4gdGhpcyByZWdleCBpcyBpbnRlbnRpb25hbDpcbiAgICAvLyBHZXJtYW4gQ2hyb21lIHJldHVybnMgdGhpcyB2YWx1ZSBhcyAwLDU1XG4gICAgLy8gZ2l0aHViLmNvbS9Nb2Rlcm5penIvTW9kZXJuaXpyL2lzc3Vlcy8jaXNzdWUvNTkvY29tbWVudC81MTY2MzJcbiAgICByZXR1cm4gKC9eMC41NSQvKS50ZXN0KHN0eWxlLm9wYWNpdHkpO1xuICB9KTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIkNTUyBQb2ludGVyIEV2ZW50c1wiLFxuICBcImNhbml1c2VcIjogXCJwb2ludGVyLWV2ZW50c1wiLFxuICBcInByb3BlcnR5XCI6IFwiY3NzcG9pbnRlcmV2ZW50c1wiLFxuICBcImF1dGhvcnNcIjogW1wiYXVzaVwiXSxcbiAgXCJ0YWdzXCI6IFtcImNzc1wiXSxcbiAgXCJidWlsZGVyQWxpYXNlc1wiOiBbXCJjc3NfcG9pbnRlcmV2ZW50c1wiXSxcbiAgXCJub3Rlc1wiOiBbXG4gICAge1xuICAgICAgXCJuYW1lXCI6IFwiTUROIERvY3NcIixcbiAgICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0NTUy9wb2ludGVyLWV2ZW50c1wiXG4gICAgfSx7XG4gICAgICBcIm5hbWVcIjogXCJUZXN0IFByb2plY3QgUGFnZVwiLFxuICAgICAgXCJocmVmXCI6IFwiaHR0cHM6Ly9hdXNpLmdpdGh1Yi5jb20vRmVhdHVyZS1kZXRlY3Rpb24tdGVjaG5pcXVlLWZvci1wb2ludGVyLWV2ZW50cy9cIlxuICAgIH0se1xuICAgICAgXCJuYW1lXCI6IFwiVGVzdCBQcm9qZWN0IFdpa2lcIixcbiAgICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9hdXNpL0ZlYXR1cmUtZGV0ZWN0aW9uLXRlY2huaXF1ZS1mb3ItcG9pbnRlci1ldmVudHMvd2lraVwiXG4gICAgfSxcbiAgICB7XG4gICAgICBcIm5hbWVcIjogXCJSZWxhdGVkIEdpdGh1YiBJc3N1ZVwiLFxuICAgICAgXCJocmVmXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL01vZGVybml6ci9Nb2Rlcm5penIvaXNzdWVzLzgwXCJcbiAgICB9XG4gIF1cbn1cbiEqL1xuXG4gIE1vZGVybml6ci5hZGRUZXN0KCdjc3Nwb2ludGVyZXZlbnRzJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0eWxlID0gY3JlYXRlRWxlbWVudCgnYScpLnN0eWxlO1xuICAgIHN0eWxlLmNzc1RleHQgPSAncG9pbnRlci1ldmVudHM6YXV0byc7XG4gICAgcmV0dXJuIHN0eWxlLnBvaW50ZXJFdmVudHMgPT09ICdhdXRvJztcbiAgfSk7XG5cbi8qIVxue1xuICBcIm5hbWVcIjogXCJDU1MgcG9zaXRpb246IHN0aWNreVwiLFxuICBcInByb3BlcnR5XCI6IFwiY3NzcG9zaXRpb25zdGlja3lcIixcbiAgXCJ0YWdzXCI6IFtcImNzc1wiXSxcbiAgXCJidWlsZGVyQWxpYXNlc1wiOiBbXCJjc3NfcG9zaXRpb25zdGlja3lcIl0sXG4gIFwibm90ZXNcIjogW3tcbiAgICBcIm5hbWVcIjogXCJDaHJvbWUgYnVnIHJlcG9ydFwiLFxuICAgIFwiaHJlZlwiOlwiaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTMyMjk3MlwiXG4gIH1dLFxuICBcIndhcm5pbmdzXCI6IFsgXCJ1c2luZyBwb3NpdGlvbjpzdGlja3kgb24gYW55dGhpbmcgYnV0IHRvcCBhbGlnbmVkIGVsZW1lbnRzIGlzIGJ1Z2d5IGluIENocm9tZSA8IDM3IGFuZCBpT1MgPD03K1wiIF1cbn1cbiEqL1xuXG4gIC8vIFN0aWNreSBwb3NpdGlvbmluZyAtIGNvbnN0cmFpbnMgYW4gZWxlbWVudCB0byBiZSBwb3NpdGlvbmVkIGluc2lkZSB0aGVcbiAgLy8gaW50ZXJzZWN0aW9uIG9mIGl0cyBjb250YWluZXIgYm94LCBhbmQgdGhlIHZpZXdwb3J0LlxuICBNb2Rlcm5penIuYWRkVGVzdCgnY3NzcG9zaXRpb25zdGlja3knLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgcHJvcCA9ICdwb3NpdGlvbjonO1xuICAgIHZhciB2YWx1ZSA9ICdzdGlja3knO1xuICAgIHZhciBlbCA9IGNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICB2YXIgbVN0eWxlID0gZWwuc3R5bGU7XG5cbiAgICBtU3R5bGUuY3NzVGV4dCA9IHByb3AgKyBwcmVmaXhlcy5qb2luKHZhbHVlICsgJzsnICsgcHJvcCkuc2xpY2UoMCwgLXByb3AubGVuZ3RoKTtcblxuICAgIHJldHVybiBtU3R5bGUucG9zaXRpb24uaW5kZXhPZih2YWx1ZSkgIT09IC0xO1xuICB9KTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIkNTUyBHZW5lcmF0ZWQgQ29udGVudCBBbmltYXRpb25zXCIsXG4gIFwicHJvcGVydHlcIjogXCJjc3Nwc2V1ZG9hbmltYXRpb25zXCIsXG4gIFwidGFnc1wiOiBbXCJjc3NcIl1cbn1cbiEqL1xuXG4gIE1vZGVybml6ci5hZGRUZXN0KCdjc3Nwc2V1ZG9hbmltYXRpb25zJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlc3VsdCA9IGZhbHNlO1xuXG4gICAgaWYgKCFNb2Rlcm5penIuY3NzYW5pbWF0aW9ucyB8fCAhd2luZG93LmdldENvbXB1dGVkU3R5bGUpIHtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgdmFyIHN0eWxlcyA9IFtcbiAgICAgICdAJywgTW9kZXJuaXpyLl9wcmVmaXhlcy5qb2luKCdrZXlmcmFtZXMgY3NzcHNldWRvYW5pbWF0aW9ucyB7IGZyb20geyBmb250LXNpemU6IDEwcHg7IH0gfUAnKS5yZXBsYWNlKC9cXEAkLywgJycpLFxuICAgICAgJyNtb2Rlcm5penI6YmVmb3JlIHsgY29udGVudDpcIiBcIjsgZm9udC1zaXplOjVweDsnLFxuICAgICAgTW9kZXJuaXpyLl9wcmVmaXhlcy5qb2luKCdhbmltYXRpb246Y3NzcHNldWRvYW5pbWF0aW9ucyAxbXMgaW5maW5pdGU7JyksXG4gICAgICAnfSdcbiAgICBdLmpvaW4oJycpO1xuXG4gICAgTW9kZXJuaXpyLnRlc3RTdHlsZXMoc3R5bGVzLCBmdW5jdGlvbihlbGVtKSB7XG4gICAgICByZXN1bHQgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtLCAnOmJlZm9yZScpLmdldFByb3BlcnR5VmFsdWUoJ2ZvbnQtc2l6ZScpID09PSAnMTBweCc7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9KTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIkNTUyBUcmFuc2l0aW9uc1wiLFxuICBcInByb3BlcnR5XCI6IFwiY3NzdHJhbnNpdGlvbnNcIixcbiAgXCJjYW5pdXNlXCI6IFwiY3NzLXRyYW5zaXRpb25zXCIsXG4gIFwidGFnc1wiOiBbXCJjc3NcIl1cbn1cbiEqL1xuXG4gIE1vZGVybml6ci5hZGRUZXN0KCdjc3N0cmFuc2l0aW9ucycsIHRlc3RBbGxQcm9wcygndHJhbnNpdGlvbicsICdhbGwnLCB0cnVlKSk7XG5cbi8qIVxue1xuICBcIm5hbWVcIjogXCJDU1MgR2VuZXJhdGVkIENvbnRlbnQgVHJhbnNpdGlvbnNcIixcbiAgXCJwcm9wZXJ0eVwiOiBcImNzc3BzZXVkb3RyYW5zaXRpb25zXCIsXG4gIFwidGFnc1wiOiBbXCJjc3NcIl1cbn1cbiEqL1xuXG4gIE1vZGVybml6ci5hZGRUZXN0KCdjc3Nwc2V1ZG90cmFuc2l0aW9ucycsIGZ1bmN0aW9uKCkge1xuICAgIHZhciByZXN1bHQgPSBmYWxzZTtcblxuICAgIGlmICghTW9kZXJuaXpyLmNzc3RyYW5zaXRpb25zIHx8ICF3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSkge1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICB2YXIgc3R5bGVzID1cbiAgICAgICcjbW9kZXJuaXpyOmJlZm9yZSB7IGNvbnRlbnQ6XCIgXCI7IGZvbnQtc2l6ZTo1cHg7JyArIE1vZGVybml6ci5fcHJlZml4ZXMuam9pbigndHJhbnNpdGlvbjowcyAxMDBzOycpICsgJ30nICtcbiAgICAgICcjbW9kZXJuaXpyLnRyaWdnZXI6YmVmb3JlIHsgZm9udC1zaXplOjEwcHg7IH0nO1xuXG4gICAgTW9kZXJuaXpyLnRlc3RTdHlsZXMoc3R5bGVzLCBmdW5jdGlvbihlbGVtKSB7XG4gICAgICAvLyBGb3JjZSByZW5kZXJpbmcgb2YgdGhlIGVsZW1lbnQncyBzdHlsZXMgc28gdGhhdCB0aGUgdHJhbnNpdGlvbiB3aWxsIHRyaWdnZXJcbiAgICAgIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW0sICc6YmVmb3JlJykuZ2V0UHJvcGVydHlWYWx1ZSgnZm9udC1zaXplJyk7XG4gICAgICBlbGVtLmNsYXNzTmFtZSArPSAndHJpZ2dlcic7XG4gICAgICByZXN1bHQgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtLCAnOmJlZm9yZScpLmdldFByb3BlcnR5VmFsdWUoJ2ZvbnQtc2l6ZScpID09PSAnNXB4JztcbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0pO1xuXG4vKiFcbntcbiAgXCJuYW1lXCI6IFwiQ1NTIEZvbnQgcmVtIFVuaXRzXCIsXG4gIFwiY2FuaXVzZVwiOiBcInJlbVwiLFxuICBcImF1dGhvcnNcIjogW1wibnNmbWNcIl0sXG4gIFwicHJvcGVydHlcIjogXCJjc3NyZW11bml0XCIsXG4gIFwidGFnc1wiOiBbXCJjc3NcIl0sXG4gIFwiYnVpbGRlckFsaWFzZXNcIjogW1wiY3NzX3JlbXVuaXRcIl0sXG4gIFwibm90ZXNcIjogW3tcbiAgICBcIm5hbWVcIjogXCJXM0MgU3BlY1wiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vd3d3LnczLm9yZy9UUi9jc3MzLXZhbHVlcy8jcmVsYXRpdmUwXCJcbiAgfSx7XG4gICAgXCJuYW1lXCI6IFwiRm9udCBTaXplIHdpdGggcmVtIGJ5IEpvbmF0aGFuIFNub29rXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cDovL3Nub29rLmNhL2FyY2hpdmVzL2h0bWxfYW5kX2Nzcy9mb250LXNpemUtd2l0aC1yZW1cIlxuICB9XVxufVxuISovXG5cbiAgLy8gXCJUaGUgJ3JlbScgdW5pdCAoJ3Jvb3QgZW0nKSBpcyByZWxhdGl2ZSB0byB0aGUgY29tcHV0ZWRcbiAgLy8gdmFsdWUgb2YgdGhlICdmb250LXNpemUnIHZhbHVlIG9mIHRoZSByb290IGVsZW1lbnQuXCJcbiAgLy8geW91IGNhbiB0ZXN0IGJ5IGNoZWNraW5nIGlmIHRoZSBwcm9wIHdhcyBkaXRjaGVkXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ2Nzc3JlbXVuaXQnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3R5bGUgPSBjcmVhdGVFbGVtZW50KCdhJykuc3R5bGU7XG4gICAgdHJ5IHtcbiAgICAgIHN0eWxlLmZvbnRTaXplID0gJzNyZW0nO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge31cbiAgICByZXR1cm4gKC9yZW0vKS50ZXN0KHN0eWxlLmZvbnRTaXplKTtcbiAgfSk7XG5cbi8qIVxue1xuICBcIm5hbWVcIjogXCJDU1MgVUkgUmVzaXplXCIsXG4gIFwicHJvcGVydHlcIjogXCJjc3NyZXNpemVcIixcbiAgXCJjYW5pdXNlXCI6IFwiY3NzLXJlc2l6ZVwiLFxuICBcInRhZ3NcIjogW1wiY3NzXCJdLFxuICBcImJ1aWxkZXJBbGlhc2VzXCI6IFtcImNzc19yZXNpemVcIl0sXG4gIFwibm90ZXNcIjogW3tcbiAgICBcIm5hbWVcIjogXCJXM0MgU3BlY2lmaWNhdGlvblwiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vd3d3LnczLm9yZy9UUi9jc3MzLXVpLyNyZXNpemVcIlxuICB9LHtcbiAgICBcIm5hbWVcIjogXCJNRE4gRG9jc1wiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0NTUy9yZXNpemVcIlxuICB9XVxufVxuISovXG4vKiBET0NcblRlc3QgZm9yIENTUyAzIFVJIFwicmVzaXplXCIgcHJvcGVydHlcbiovXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ2Nzc3Jlc2l6ZScsIHRlc3RBbGxQcm9wcygncmVzaXplJywgJ2JvdGgnLCB0cnVlKSk7XG5cbi8qIVxue1xuICBcIm5hbWVcIjogXCJDU1MgcmdiYVwiLFxuICBcImNhbml1c2VcIjogXCJjc3MzLWNvbG9yc1wiLFxuICBcInByb3BlcnR5XCI6IFwicmdiYVwiLFxuICBcInRhZ3NcIjogW1wiY3NzXCJdLFxuICBcIm5vdGVzXCI6IFt7XG4gICAgXCJuYW1lXCI6IFwiQ1NTVHJpY2tzIFR1dG9yaWFsXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly9jc3MtdHJpY2tzLmNvbS9yZ2JhLWJyb3dzZXItc3VwcG9ydC9cIlxuICB9XVxufVxuISovXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ3JnYmEnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3R5bGUgPSBjcmVhdGVFbGVtZW50KCdhJykuc3R5bGU7XG4gICAgc3R5bGUuY3NzVGV4dCA9ICdiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMTUwLDI1NSwxNTAsLjUpJztcblxuICAgIHJldHVybiAoJycgKyBzdHlsZS5iYWNrZ3JvdW5kQ29sb3IpLmluZGV4T2YoJ3JnYmEnKSA+IC0xO1xuICB9KTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIkNTUyBnZW5lcmFsIHNpYmxpbmcgc2VsZWN0b3JcIixcbiAgXCJjYW5pdXNlXCI6IFwiY3NzLXNlbDNcIixcbiAgXCJwcm9wZXJ0eVwiOiBcInNpYmxpbmdnZW5lcmFsXCIsXG4gIFwidGFnc1wiOiBbXCJjc3NcIl0sXG4gIFwibm90ZXNcIjogW3tcbiAgICBcIm5hbWVcIjogXCJSZWxhdGVkIEdpdGh1YiBJc3N1ZVwiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9Nb2Rlcm5penIvTW9kZXJuaXpyL3B1bGwvODg5XCJcbiAgfV1cbn1cbiEqL1xuXG4gIE1vZGVybml6ci5hZGRUZXN0KCdzaWJsaW5nZ2VuZXJhbCcsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0ZXN0U3R5bGVzKCcjbW9kZXJuaXpyIGRpdiB7d2lkdGg6MTAwcHh9ICNtb2Rlcm5penIgZGl2IH4gZGl2IHt3aWR0aDoyMDBweDtkaXNwbGF5OmJsb2NrfScsIGZ1bmN0aW9uKGVsZW0pIHtcbiAgICAgIHJldHVybiBlbGVtLmxhc3RDaGlsZC5vZmZzZXRXaWR0aCA9PSAyMDA7XG4gICAgfSwgMik7XG4gIH0pO1xuXG4vKiFcbntcbiAgXCJuYW1lXCI6IFwiQ1NTIFN1YnBpeGVsIEZvbnRzXCIsXG4gIFwicHJvcGVydHlcIjogXCJzdWJwaXhlbGZvbnRcIixcbiAgXCJ0YWdzXCI6IFtcImNzc1wiXSxcbiAgXCJidWlsZGVyQWxpYXNlc1wiOiBbXCJjc3Nfc3VicGl4ZWxmb250XCJdLFxuICBcImF1dGhvcnNcIjogW1xuICAgIFwiQGRlclNjaGVwcFwiLFxuICAgIFwiQGdlcnJpdHZhbmFha2VuXCIsXG4gICAgXCJAcm9kbmV5cmVobVwiLFxuICAgIFwiQHlhdGlsXCIsXG4gICAgXCJAcnlhbnNlZGRvblwiXG4gIF0sXG4gIFwibm90ZXNcIjogW3tcbiAgICBcIm5hbWVcIjogXCJPcmlnaW4gVGVzdFwiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9nZXJyaXR2YW5hYWtlbi9zdWJwaXhlbGRldGVjdFwiXG4gIH1dXG59XG4hKi9cblxuICAvKlxuICAgKiAodG8gaW5mZXIgaWYgR0RJIG9yIERpcmVjdFdyaXRlIGlzIHVzZWQgb24gV2luZG93cylcbiAgICovXG4gIHRlc3RTdHlsZXMoXG4gICAgJyNtb2Rlcm5penJ7cG9zaXRpb246IGFic29sdXRlOyB0b3A6IC0xMGVtOyB2aXNpYmlsaXR5OmhpZGRlbjsgZm9udDogbm9ybWFsIDEwcHggYXJpYWw7fSNzdWJwaXhlbHtmbG9hdDogbGVmdDsgZm9udC1zaXplOiAzMy4zMzMzJTt9JyxcbiAgZnVuY3Rpb24oZWxlbSkge1xuICAgIHZhciBzdWJwaXhlbCA9IGVsZW0uZmlyc3RDaGlsZDtcbiAgICBzdWJwaXhlbC5pbm5lckhUTUwgPSAnVGhpcyBpcyBhIHRleHQgd3JpdHRlbiBpbiBBcmlhbCc7XG4gICAgTW9kZXJuaXpyLmFkZFRlc3QoJ3N1YnBpeGVsZm9udCcsIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlID9cbiAgICAgIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHN1YnBpeGVsLCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKCd3aWR0aCcpICE9PSAnNDRweCdcbiAgICA6IGZhbHNlKTtcbiAgfSwgMSwgWydzdWJwaXhlbCddKTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIkNTUyBTdXBwb3J0c1wiLFxuICBcInByb3BlcnR5XCI6IFwic3VwcG9ydHNcIixcbiAgXCJjYW5pdXNlXCI6IFwiY3NzLWZlYXR1cmVxdWVyaWVzXCIsXG4gIFwidGFnc1wiOiBbXCJjc3NcIl0sXG4gIFwiYnVpbGRlckFsaWFzZXNcIjogW1wiY3NzX3N1cHBvcnRzXCJdLFxuICBcIm5vdGVzXCI6IFt7XG4gICAgXCJuYW1lXCI6IFwiVzMgU3BlY1wiLFxuICAgIFwiaHJlZlwiOiBcImh0dHA6Ly9kZXYudzMub3JnL2Nzc3dnL2NzczMtY29uZGl0aW9uYWwvI2F0LXN1cHBvcnRzXCJcbiAgfSx7XG4gICAgXCJuYW1lXCI6IFwiUmVsYXRlZCBHaXRodWIgSXNzdWVcIixcbiAgICBcImhyZWZcIjogXCJodHRwczovL2dpdGh1Yi5jb20vTW9kZXJuaXpyL01vZGVybml6ci9pc3N1ZXMvNjQ4XCJcbiAgfSx7XG4gICAgXCJuYW1lXCI6IFwiVzMgSW5mb1wiLFxuICAgIFwiaHJlZlwiOiBcImh0dHA6Ly9kZXYudzMub3JnL2Nzc3dnL2NzczMtY29uZGl0aW9uYWwvI3RoZS1jc3NzdXBwb3J0c3J1bGUtaW50ZXJmYWNlXCJcbiAgfV1cbn1cbiEqL1xuXG4gIHZhciBuZXdTeW50YXggPSAnQ1NTJyBpbiB3aW5kb3cgJiYgJ3N1cHBvcnRzJyBpbiB3aW5kb3cuQ1NTO1xuICB2YXIgb2xkU3ludGF4ID0gJ3N1cHBvcnRzQ1NTJyBpbiB3aW5kb3c7XG4gIE1vZGVybml6ci5hZGRUZXN0KCdzdXBwb3J0cycsIG5ld1N5bnRheCB8fCBvbGRTeW50YXgpO1xuXG4vKiFcbntcbiAgXCJuYW1lXCI6IFwiQ1NTIDp0YXJnZXQgcHNldWRvLWNsYXNzXCIsXG4gIFwiY2FuaXVzZVwiOiBcImNzcy1zZWwzXCIsXG4gIFwicHJvcGVydHlcIjogXCJ0YXJnZXRcIixcbiAgXCJ0YWdzXCI6IFtcImNzc1wiXSxcbiAgXCJub3Rlc1wiOiBbe1xuICAgIFwibmFtZVwiOiBcIk1ETiBkb2N1bWVudGF0aW9uXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQ1NTLzp0YXJnZXRcIlxuICB9XSxcbiAgXCJhdXRob3JzXCI6IFtcIkB6YWNobGVhdFwiXSxcbiAgXCJ3YXJuaW5nc1wiOiBbXCJPcGVyYSBNaW5pIHN1cHBvcnRzIDp0YXJnZXQgYnV0IGRvZXNuJ3QgdXBkYXRlIHRoZSBoYXNoIGZvciBhbmNob3IgbGlua3MuXCJdXG59XG4hKi9cbi8qIERPQ1xuRGV0ZWN0cyBzdXBwb3J0IGZvciB0aGUgJzp0YXJnZXQnIENTUyBwc2V1ZG8tY2xhc3MuXG4qL1xuXG4gIC8vIHF1ZXJ5U2VsZWN0b3JcbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ3RhcmdldCcsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBkb2MgPSB3aW5kb3cuZG9jdW1lbnQ7XG4gICAgaWYgKCEoJ3F1ZXJ5U2VsZWN0b3JBbGwnIGluIGRvYykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoJzp0YXJnZXQnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0pO1xuXG4vKiFcbntcbiAgXCJuYW1lXCI6IFwiQ1NTIFRyYW5zZm9ybXNcIixcbiAgXCJwcm9wZXJ0eVwiOiBcImNzc3RyYW5zZm9ybXNcIixcbiAgXCJjYW5pdXNlXCI6IFwidHJhbnNmb3JtczJkXCIsXG4gIFwidGFnc1wiOiBbXCJjc3NcIl1cbn1cbiEqL1xuXG4gIE1vZGVybml6ci5hZGRUZXN0KCdjc3N0cmFuc2Zvcm1zJywgZnVuY3Rpb24oKSB7XG4gICAgLy8gQW5kcm9pZCA8IDMuMCBpcyBidWdneSwgc28gd2Ugc25pZmYgYW5kIGJsYWNrbGlzdFxuICAgIC8vIGh0dHA6Ly9naXQuaW8vaEh6TDd3XG4gICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignQW5kcm9pZCAyLicpID09PSAtMSAmJlxuICAgICAgICAgICB0ZXN0QWxsUHJvcHMoJ3RyYW5zZm9ybScsICdzY2FsZSgxKScsIHRydWUpO1xuICB9KTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIkNTUyBUcmFuc2Zvcm1zIDNEXCIsXG4gIFwicHJvcGVydHlcIjogXCJjc3N0cmFuc2Zvcm1zM2RcIixcbiAgXCJjYW5pdXNlXCI6IFwidHJhbnNmb3JtczNkXCIsXG4gIFwidGFnc1wiOiBbXCJjc3NcIl0sXG4gIFwid2FybmluZ3NcIjogW1xuICAgIFwiQ2hyb21lIG1heSBvY2Nhc3Npb25hbGx5IGZhaWwgdGhpcyB0ZXN0IG9uIHNvbWUgc3lzdGVtczsgbW9yZSBpbmZvOiBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9MTI5MDA0XCJcbiAgXVxufVxuISovXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ2Nzc3RyYW5zZm9ybXMzZCcsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAhIXRlc3RBbGxQcm9wcygncGVyc3BlY3RpdmUnLCAnMXB4JywgdHJ1ZSk7XG4gIH0pO1xuXG4vKiFcbntcbiAgXCJuYW1lXCI6IFwiQ1NTIFRyYW5zZm9ybSBTdHlsZSBwcmVzZXJ2ZS0zZFwiLFxuICBcInByb3BlcnR5XCI6IFwicHJlc2VydmUzZFwiLFxuICBcImF1dGhvcnNcIjogW1wiZGVueXNrb2NoXCIsIFwiYUZhcmthc1wiXSxcbiAgXCJ0YWdzXCI6IFtcImNzc1wiXSxcbiAgXCJub3Rlc1wiOiBbe1xuICAgIFwibmFtZVwiOiBcIk1ETiBEb2NzXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQ1NTL3RyYW5zZm9ybS1zdHlsZVwiXG4gIH0se1xuICAgIFwibmFtZVwiOiBcIlJlbGF0ZWQgR2l0aHViIElzc3VlXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL01vZGVybml6ci9Nb2Rlcm5penIvaXNzdWVzLzE3NDhcIlxuICB9XVxufVxuISovXG4vKiBET0NcbkRldGVjdHMgc3VwcG9ydCBmb3IgYHRyYW5zZm9ybS1zdHlsZTogcHJlc2VydmUtM2RgLCBmb3IgZ2V0dGluZyBhIHByb3BlciAzRCBwZXJzcGVjdGl2ZSBvbiBlbGVtZW50cy5cbiovXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ3ByZXNlcnZlM2QnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgb3V0ZXJBbmNob3IsIGlubmVyQW5jaG9yO1xuICAgIHZhciBDU1MgPSB3aW5kb3cuQ1NTO1xuICAgIHZhciByZXN1bHQgPSBmYWxzZTtcblxuICAgIGlmIChDU1MgJiYgQ1NTLnN1cHBvcnRzICYmIENTUy5zdXBwb3J0cygnKHRyYW5zZm9ybS1zdHlsZTogcHJlc2VydmUtM2QpJykpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIG91dGVyQW5jaG9yID0gY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGlubmVyQW5jaG9yID0gY3JlYXRlRWxlbWVudCgnYScpO1xuXG4gICAgb3V0ZXJBbmNob3Iuc3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5OiBibG9jazsgdHJhbnNmb3JtLXN0eWxlOiBwcmVzZXJ2ZS0zZDsgdHJhbnNmb3JtLW9yaWdpbjogcmlnaHQ7IHRyYW5zZm9ybTogcm90YXRlWSg0MGRlZyk7JztcbiAgICBpbm5lckFuY2hvci5zdHlsZS5jc3NUZXh0ID0gJ2Rpc3BsYXk6IGJsb2NrOyB3aWR0aDogOXB4OyBoZWlnaHQ6IDFweDsgYmFja2dyb3VuZDogIzAwMDsgdHJhbnNmb3JtLW9yaWdpbjogcmlnaHQ7IHRyYW5zZm9ybTogcm90YXRlWSg0MGRlZyk7JztcblxuICAgIG91dGVyQW5jaG9yLmFwcGVuZENoaWxkKGlubmVyQW5jaG9yKTtcbiAgICBkb2NFbGVtZW50LmFwcGVuZENoaWxkKG91dGVyQW5jaG9yKTtcblxuICAgIHJlc3VsdCA9IGlubmVyQW5jaG9yLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGRvY0VsZW1lbnQucmVtb3ZlQ2hpbGQob3V0ZXJBbmNob3IpO1xuXG4gICAgcmVzdWx0ID0gcmVzdWx0LndpZHRoICYmIHJlc3VsdC53aWR0aCA8IDQ7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSk7XG5cbi8qIVxue1xuICBcIm5hbWVcIjogXCJDU1MgdXNlci1zZWxlY3RcIixcbiAgXCJwcm9wZXJ0eVwiOiBcInVzZXJzZWxlY3RcIixcbiAgXCJjYW5pdXNlXCI6IFwidXNlci1zZWxlY3Qtbm9uZVwiLFxuICBcImF1dGhvcnNcIjogW1wicnlhbiBzZWRkb25cIl0sXG4gIFwidGFnc1wiOiBbXCJjc3NcIl0sXG4gIFwiYnVpbGRlckFsaWFzZXNcIjogW1wiY3NzX3VzZXJzZWxlY3RcIl0sXG4gIFwibm90ZXNcIjogW3tcbiAgICBcIm5hbWVcIjogXCJSZWxhdGVkIE1vZGVybml6ciBJc3N1ZVwiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9Nb2Rlcm5penIvTW9kZXJuaXpyL2lzc3Vlcy8yNTBcIlxuICB9XVxufVxuISovXG5cbiAgLy9odHRwczovL2dpdGh1Yi5jb20vTW9kZXJuaXpyL01vZGVybml6ci9pc3N1ZXMvMjUwXG4gIE1vZGVybml6ci5hZGRUZXN0KCd1c2Vyc2VsZWN0JywgdGVzdEFsbFByb3BzKCd1c2VyU2VsZWN0JywgJ25vbmUnLCB0cnVlKSk7XG5cblxuICAvKipcbiAgICogcm91bmRlZEVxdWFscyB0YWtlcyB0d28gaW50ZWdlcnMgYW5kIGNoZWNrcyBpZiB0aGUgZmlyc3QgaXMgd2l0aGluIDEgb2YgdGhlIHNlY29uZFxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICogQGZ1bmN0aW9uIHJvdW5kZWRFcXVhbHNcbiAgICogQHBhcmFtIHtudW1iZXJ9IGFcbiAgICogQHBhcmFtIHtudW1iZXJ9IGJcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuXG4gIGZ1bmN0aW9uIHJvdW5kZWRFcXVhbHMoYSwgYikge1xuICAgIHJldHVybiBhIC0gMSA9PT0gYiB8fCBhID09PSBiIHx8IGEgKyAxID09PSBiO1xuICB9XG5cbiAgO1xuLyohXG57XG4gIFwibmFtZVwiOiBcIkNTUyB2aCB1bml0XCIsXG4gIFwicHJvcGVydHlcIjogXCJjc3N2aHVuaXRcIixcbiAgXCJjYW5pdXNlXCI6IFwidmlld3BvcnQtdW5pdHNcIixcbiAgXCJ0YWdzXCI6IFtcImNzc1wiXSxcbiAgXCJidWlsZGVyQWxpYXNlc1wiOiBbXCJjc3Nfdmh1bml0XCJdLFxuICBcIm5vdGVzXCI6IFt7XG4gICAgXCJuYW1lXCI6IFwiUmVsYXRlZCBNb2Rlcm5penIgSXNzdWVcIixcbiAgICBcImhyZWZcIjogXCJodHRwczovL2dpdGh1Yi5jb20vTW9kZXJuaXpyL01vZGVybml6ci9pc3N1ZXMvNTcyXCJcbiAgfSx7XG4gICAgXCJuYW1lXCI6IFwiU2ltaWxhciBKU0ZpZGRsZVwiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vanNmaWRkbGUubmV0L0ZXZWluYi9ldG5ZQy9cIlxuICB9XVxufVxuISovXG5cbiAgdGVzdFN0eWxlcygnI21vZGVybml6ciB7IGhlaWdodDogNTB2aDsgfScsIGZ1bmN0aW9uKGVsZW0pIHtcbiAgICB2YXIgaGVpZ2h0ID0gcGFyc2VJbnQod2luZG93LmlubmVySGVpZ2h0IC8gMiwgMTApO1xuICAgIHZhciBjb21wU3R5bGUgPSBwYXJzZUludChjb21wdXRlZFN0eWxlKGVsZW0sIG51bGwsICdoZWlnaHQnKSwgMTApO1xuXG4gICAgTW9kZXJuaXpyLmFkZFRlc3QoJ2Nzc3ZodW5pdCcsIHJvdW5kZWRFcXVhbHMoY29tcFN0eWxlLCBoZWlnaHQpKTtcbiAgfSk7XG5cbi8qIVxue1xuICBcIm5hbWVcIjogXCJDU1Mgdm1heCB1bml0XCIsXG4gIFwicHJvcGVydHlcIjogXCJjc3N2bWF4dW5pdFwiLFxuICBcImNhbml1c2VcIjogXCJ2aWV3cG9ydC11bml0c1wiLFxuICBcInRhZ3NcIjogW1wiY3NzXCJdLFxuICBcImJ1aWxkZXJBbGlhc2VzXCI6IFtcImNzc192bWF4dW5pdFwiXSxcbiAgXCJub3Rlc1wiOiBbe1xuICAgIFwibmFtZVwiOiBcIlJlbGF0ZWQgTW9kZXJuaXpyIElzc3VlXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL01vZGVybml6ci9Nb2Rlcm5penIvaXNzdWVzLzU3MlwiXG4gIH0se1xuICAgIFwibmFtZVwiOiBcIkpTRmlkZGxlIEV4YW1wbGVcIixcbiAgICBcImhyZWZcIjogXCJodHRwczovL2pzZmlkZGxlLm5ldC9nbHNlZS9KRHNXUS80L1wiXG4gIH1dXG59XG4hKi9cblxuICB0ZXN0U3R5bGVzKCcjbW9kZXJuaXpyMXt3aWR0aDogNTB2bWF4fSNtb2Rlcm5penIye3dpZHRoOjUwcHg7aGVpZ2h0OjUwcHg7b3ZlcmZsb3c6c2Nyb2xsfSNtb2Rlcm5penIze3Bvc2l0aW9uOmZpeGVkO3RvcDowO2xlZnQ6MDtib3R0b206MDtyaWdodDowfScsIGZ1bmN0aW9uKG5vZGUpIHtcbiAgICB2YXIgZWxlbSA9IG5vZGUuY2hpbGROb2Rlc1syXTtcbiAgICB2YXIgc2Nyb2xsZXIgPSBub2RlLmNoaWxkTm9kZXNbMV07XG4gICAgdmFyIGZ1bGxTaXplRWxlbSA9IG5vZGUuY2hpbGROb2Rlc1swXTtcbiAgICB2YXIgc2Nyb2xsYmFyV2lkdGggPSBwYXJzZUludCgoc2Nyb2xsZXIub2Zmc2V0V2lkdGggLSBzY3JvbGxlci5jbGllbnRXaWR0aCkgLyAyLCAxMCk7XG5cbiAgICB2YXIgb25lX3Z3ID0gZnVsbFNpemVFbGVtLmNsaWVudFdpZHRoIC8gMTAwO1xuICAgIHZhciBvbmVfdmggPSBmdWxsU2l6ZUVsZW0uY2xpZW50SGVpZ2h0IC8gMTAwO1xuICAgIHZhciBleHBlY3RlZFdpZHRoID0gcGFyc2VJbnQoTWF0aC5tYXgob25lX3Z3LCBvbmVfdmgpICogNTAsIDEwKTtcbiAgICB2YXIgY29tcFdpZHRoID0gcGFyc2VJbnQoY29tcHV0ZWRTdHlsZShlbGVtLCBudWxsLCAnd2lkdGgnKSwgMTApO1xuXG4gICAgTW9kZXJuaXpyLmFkZFRlc3QoJ2Nzc3ZtYXh1bml0Jywgcm91bmRlZEVxdWFscyhleHBlY3RlZFdpZHRoLCBjb21wV2lkdGgpIHx8IHJvdW5kZWRFcXVhbHMoZXhwZWN0ZWRXaWR0aCwgY29tcFdpZHRoIC0gc2Nyb2xsYmFyV2lkdGgpKTtcbiAgfSwgMyk7XG5cbi8qIVxue1xuICBcIm5hbWVcIjogXCJDU1Mgdm1pbiB1bml0XCIsXG4gIFwicHJvcGVydHlcIjogXCJjc3N2bWludW5pdFwiLFxuICBcImNhbml1c2VcIjogXCJ2aWV3cG9ydC11bml0c1wiLFxuICBcInRhZ3NcIjogW1wiY3NzXCJdLFxuICBcImJ1aWxkZXJBbGlhc2VzXCI6IFtcImNzc192bWludW5pdFwiXSxcbiAgXCJub3Rlc1wiOiBbe1xuICAgIFwibmFtZVwiOiBcIlJlbGF0ZWQgTW9kZXJuaXpyIElzc3VlXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL01vZGVybml6ci9Nb2Rlcm5penIvaXNzdWVzLzU3MlwiXG4gIH0se1xuICAgIFwibmFtZVwiOiBcIkpTRmlkZGxlIEV4YW1wbGVcIixcbiAgICBcImhyZWZcIjogXCJodHRwczovL2pzZmlkZGxlLm5ldC9nbHNlZS9KUm1kcS84L1wiXG4gIH1dXG59XG4hKi9cblxuICB0ZXN0U3R5bGVzKCcjbW9kZXJuaXpyMXt3aWR0aDogNTB2bTt3aWR0aDo1MHZtaW59I21vZGVybml6cjJ7d2lkdGg6NTBweDtoZWlnaHQ6NTBweDtvdmVyZmxvdzpzY3JvbGx9I21vZGVybml6cjN7cG9zaXRpb246Zml4ZWQ7dG9wOjA7bGVmdDowO2JvdHRvbTowO3JpZ2h0OjB9JywgZnVuY3Rpb24obm9kZSkge1xuICAgIHZhciBlbGVtID0gbm9kZS5jaGlsZE5vZGVzWzJdO1xuICAgIHZhciBzY3JvbGxlciA9IG5vZGUuY2hpbGROb2Rlc1sxXTtcbiAgICB2YXIgZnVsbFNpemVFbGVtID0gbm9kZS5jaGlsZE5vZGVzWzBdO1xuICAgIHZhciBzY3JvbGxiYXJXaWR0aCA9IHBhcnNlSW50KChzY3JvbGxlci5vZmZzZXRXaWR0aCAtIHNjcm9sbGVyLmNsaWVudFdpZHRoKSAvIDIsIDEwKTtcblxuICAgIHZhciBvbmVfdncgPSBmdWxsU2l6ZUVsZW0uY2xpZW50V2lkdGggLyAxMDA7XG4gICAgdmFyIG9uZV92aCA9IGZ1bGxTaXplRWxlbS5jbGllbnRIZWlnaHQgLyAxMDA7XG4gICAgdmFyIGV4cGVjdGVkV2lkdGggPSBwYXJzZUludChNYXRoLm1pbihvbmVfdncsIG9uZV92aCkgKiA1MCwgMTApO1xuICAgIHZhciBjb21wV2lkdGggPSBwYXJzZUludChjb21wdXRlZFN0eWxlKGVsZW0sIG51bGwsICd3aWR0aCcpLCAxMCk7XG5cbiAgICBNb2Rlcm5penIuYWRkVGVzdCgnY3Nzdm1pbnVuaXQnLCByb3VuZGVkRXF1YWxzKGV4cGVjdGVkV2lkdGgsIGNvbXBXaWR0aCkgfHwgcm91bmRlZEVxdWFscyhleHBlY3RlZFdpZHRoLCBjb21wV2lkdGggLSBzY3JvbGxiYXJXaWR0aCkpO1xuICB9LCAzKTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIkNTUyB2dyB1bml0XCIsXG4gIFwicHJvcGVydHlcIjogXCJjc3N2d3VuaXRcIixcbiAgXCJjYW5pdXNlXCI6IFwidmlld3BvcnQtdW5pdHNcIixcbiAgXCJ0YWdzXCI6IFtcImNzc1wiXSxcbiAgXCJidWlsZGVyQWxpYXNlc1wiOiBbXCJjc3Nfdnd1bml0XCJdLFxuICBcIm5vdGVzXCI6IFt7XG4gICAgXCJuYW1lXCI6IFwiUmVsYXRlZCBNb2Rlcm5penIgSXNzdWVcIixcbiAgICBcImhyZWZcIjogXCJodHRwczovL2dpdGh1Yi5jb20vTW9kZXJuaXpyL01vZGVybml6ci9pc3N1ZXMvNTcyXCJcbiAgfSx7XG4gICAgXCJuYW1lXCI6IFwiSlNGaWRkbGUgRXhhbXBsZVwiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vanNmaWRkbGUubmV0L0ZXZWluYi9ldG5ZQy9cIlxuICB9XVxufVxuISovXG5cbiAgdGVzdFN0eWxlcygnI21vZGVybml6ciB7IHdpZHRoOiA1MHZ3OyB9JywgZnVuY3Rpb24oZWxlbSkge1xuICAgIHZhciB3aWR0aCA9IHBhcnNlSW50KHdpbmRvdy5pbm5lcldpZHRoIC8gMiwgMTApO1xuICAgIHZhciBjb21wU3R5bGUgPSBwYXJzZUludChjb21wdXRlZFN0eWxlKGVsZW0sIG51bGwsICd3aWR0aCcpLCAxMCk7XG5cbiAgICBNb2Rlcm5penIuYWRkVGVzdCgnY3Nzdnd1bml0Jywgcm91bmRlZEVxdWFscyhjb21wU3R5bGUsIHdpZHRoKSk7XG4gIH0pO1xuXG4vKiFcbntcbiAgXCJuYW1lXCI6IFwid2lsbC1jaGFuZ2VcIixcbiAgXCJwcm9wZXJ0eVwiOiBcIndpbGxjaGFuZ2VcIixcbiAgXCJub3Rlc1wiOiBbe1xuICAgIFwibmFtZVwiOiBcIlNwZWNcIixcbiAgICBcImhyZWZcIjogXCJodHRwczovL2RyYWZ0cy5jc3N3Zy5vcmcvY3NzLXdpbGwtY2hhbmdlL1wiXG4gIH1dXG59XG4hKi9cbi8qIERPQ1xuRGV0ZWN0cyBzdXBwb3J0IGZvciB0aGUgYHdpbGwtY2hhbmdlYCBjc3MgcHJvcGVydHksIHdoaWNoIGZvcm1hbGx5IHNpZ25hbHMgdG8gdGhlXG5icm93c2VyIHRoYXQgYW4gZWxlbWVudCB3aWxsIGJlIGFuaW1hdGluZy5cbiovXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ3dpbGxjaGFuZ2UnLCAnd2lsbENoYW5nZScgaW4gZG9jRWxlbWVudC5zdHlsZSk7XG5cbi8qIVxue1xuICBcIm5hbWVcIjogXCJjbGFzc0xpc3RcIixcbiAgXCJjYW5pdXNlXCI6IFwiY2xhc3NsaXN0XCIsXG4gIFwicHJvcGVydHlcIjogXCJjbGFzc2xpc3RcIixcbiAgXCJ0YWdzXCI6IFtcImRvbVwiXSxcbiAgXCJidWlsZGVyQWxpYXNlc1wiOiBbXCJkYXRhdmlld19hcGlcIl0sXG4gIFwibm90ZXNcIjogW3tcbiAgICBcIm5hbWVcIjogXCJNRE4gRG9jc1wiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0RPTS9lbGVtZW50LmNsYXNzTGlzdFwiXG4gIH1dXG59XG4hKi9cblxuICBNb2Rlcm5penIuYWRkVGVzdCgnY2xhc3NsaXN0JywgJ2NsYXNzTGlzdCcgaW4gZG9jRWxlbWVudCk7XG5cbi8qIVxue1xuICBcIm5hbWVcIjogXCJEb2N1bWVudCBGcmFnbWVudFwiLFxuICBcInByb3BlcnR5XCI6IFwiZG9jdW1lbnRmcmFnbWVudFwiLFxuICBcIm5vdGVzXCI6IFt7XG4gICAgXCJuYW1lXCI6IFwiVzNDIERPTSBMZXZlbCAxIFJlZmVyZW5jZVwiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vd3d3LnczLm9yZy9UUi9SRUMtRE9NLUxldmVsLTEvbGV2ZWwtb25lLWNvcmUuaHRtbCNJRC1CNjNFRDFBM1wiXG4gIH0sIHtcbiAgICBcIm5hbWVcIjogXCJTaXRlUG9pbnQgUmVmZXJlbmNlXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cDovL3JlZmVyZW5jZS5zaXRlcG9pbnQuY29tL2phdmFzY3JpcHQvRG9jdW1lbnRGcmFnbWVudFwiXG4gIH0sIHtcbiAgICBcIm5hbWVcIjogXCJRdWlya3NNb2RlIENvbXBhdGliaWxpdHkgVGFibGVzXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cDovL3d3dy5xdWlya3Ntb2RlLm9yZy9tL3czY19jb3JlLmh0bWwjdDExMlwiXG4gIH1dLFxuICBcImF1dGhvcnNcIjogW1wiUm9uIFdhbGRvbiAoQGpva2V5cmh5bWUpXCJdLFxuICBcImtub3duQnVnc1wiOiBbXCJmYWxzZS1wb3NpdGl2ZSBvbiBCbGFja2JlcnJ5IDk1MDAsIHNlZSBRdWlya3NNb2RlIG5vdGVcIl0sXG4gIFwidGFnc1wiOiBbXVxufVxuISovXG4vKiBET0NcbkFwcGVuZCBtdWx0aXBsZSBlbGVtZW50cyB0byB0aGUgRE9NIHdpdGhpbiBhIHNpbmdsZSBpbnNlcnRpb24uXG4qL1xuXG4gIE1vZGVybml6ci5hZGRUZXN0KCdkb2N1bWVudGZyYWdtZW50JywgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICdjcmVhdGVEb2N1bWVudEZyYWdtZW50JyBpbiBkb2N1bWVudCAmJlxuICAgICAgJ2FwcGVuZENoaWxkJyBpbiBkb2NFbGVtZW50O1xuICB9KTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIkRPTTQgTXV0YXRpb25PYnNlcnZlclwiLFxuICBcInByb3BlcnR5XCI6IFwibXV0YXRpb25vYnNlcnZlclwiLFxuICBcImNhbml1c2VcIjogXCJtdXRhdGlvbm9ic2VydmVyXCIsXG4gIFwidGFnc1wiOiBbXCJkb21cIl0sXG4gIFwiYXV0aG9yc1wiOiBbXCJLYXJlbCBTZWRsw6HEjWVrIChAa3NkbGNrKVwiXSxcbiAgXCJwb2x5ZmlsbHNcIjogW1wibXV0YXRpb25vYnNlcnZlcnNcIl0sXG4gIFwibm90ZXNcIjogW3tcbiAgICBcIm5hbWVcIjogXCJNRE4gZG9jdW1lbnRhdGlvblwiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9NdXRhdGlvbk9ic2VydmVyXCJcbiAgfV1cbn1cbiEqL1xuLyogRE9DXG5cbkRldGVybWluZXMgaWYgRE9NNCBNdXRhdGlvbk9ic2VydmVyIHN1cHBvcnQgaXMgYXZhaWxhYmxlLlxuXG4qL1xuXG4gIE1vZGVybml6ci5hZGRUZXN0KCdtdXRhdGlvbm9ic2VydmVyJyxcbiAgICAhIXdpbmRvdy5NdXRhdGlvbk9ic2VydmVyIHx8ICEhd2luZG93LldlYktpdE11dGF0aW9uT2JzZXJ2ZXIpO1xuXG4vKiFcbntcbiAgXCJuYW1lXCI6IFwiRVM2IEFycmF5XCIsXG4gIFwicHJvcGVydHlcIjogXCJlczZhcnJheVwiLFxuICBcIm5vdGVzXCI6IFt7XG4gICAgXCJuYW1lXCI6IFwidW5vZmZpY2lhbCBFQ01BU2NyaXB0IDYgZHJhZnQgc3BlY2lmaWNhdGlvblwiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sXCJcbiAgfV0sXG4gIFwicG9seWZpbGxzXCI6IFtcImVzNnNoaW1cIl0sXG4gIFwiYXV0aG9yc1wiOiBbXCJSb24gV2FsZG9uIChAam9rZXlyaHltZSlcIl0sXG4gIFwid2FybmluZ3NcIjogW1wiRUNNQVNjcmlwdCA2IGlzIHN0aWxsIGEgb25seSBhIGRyYWZ0LCBzbyB0aGlzIGRldGVjdCBtYXkgbm90IG1hdGNoIHRoZSBmaW5hbCBzcGVjaWZpY2F0aW9uIG9yIGltcGxlbWVudGF0aW9ucy5cIl0sXG4gIFwidGFnc1wiOiBbXCJlczZcIl1cbn1cbiEqL1xuLyogRE9DXG5DaGVjayBpZiBicm93c2VyIGltcGxlbWVudHMgRUNNQVNjcmlwdCA2IEFycmF5IHBlciBzcGVjaWZpY2F0aW9uLlxuKi9cblxuICBNb2Rlcm5penIuYWRkVGVzdCgnZXM2YXJyYXknLCAhIShBcnJheS5wcm90b3R5cGUgJiZcbiAgICBBcnJheS5wcm90b3R5cGUuY29weVdpdGhpbiAmJlxuICAgIEFycmF5LnByb3RvdHlwZS5maWxsICYmXG4gICAgQXJyYXkucHJvdG90eXBlLmZpbmQgJiZcbiAgICBBcnJheS5wcm90b3R5cGUuZmluZEluZGV4ICYmXG4gICAgQXJyYXkucHJvdG90eXBlLmtleXMgJiZcbiAgICBBcnJheS5wcm90b3R5cGUuZW50cmllcyAmJlxuICAgIEFycmF5LnByb3RvdHlwZS52YWx1ZXMgJiZcbiAgICBBcnJheS5mcm9tICYmXG4gICAgQXJyYXkub2YpKTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIkVTNSBTdHJpbmcucHJvdG90eXBlLmNvbnRhaW5zXCIsXG4gIFwicHJvcGVydHlcIjogXCJjb250YWluc1wiLFxuICBcImF1dGhvcnNcIjogW1wiUm9iZXJ0IEtvd2Fsc2tpXCJdLFxuICBcInRhZ3NcIjogW1wiZXM2XCJdXG59XG4hKi9cbi8qIERPQ1xuQ2hlY2sgaWYgYnJvd3NlciBpbXBsZW1lbnRzIEVDTUFTY3JpcHQgNiBgU3RyaW5nLnByb3RvdHlwZS5jb250YWluc2AgcGVyIHNwZWNpZmljYXRpb24uXG4qL1xuXG4gIE1vZGVybml6ci5hZGRUZXN0KCdjb250YWlucycsIGlzKFN0cmluZy5wcm90b3R5cGUuY29udGFpbnMsICdmdW5jdGlvbicpKTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIkVTNiBHZW5lcmF0b3JzXCIsXG4gIFwicHJvcGVydHlcIjogXCJnZW5lcmF0b3JzXCIsXG4gIFwiYXV0aG9yc1wiOiBbXCJNaWNoYWVsIEthY2hhbm92c2t5aVwiXSxcbiAgXCJ0YWdzXCI6IFtcImVzNlwiXVxufVxuISovXG4vKiBET0NcbkNoZWNrIGlmIGJyb3dzZXIgaW1wbGVtZW50cyBFQ01BU2NyaXB0IDYgR2VuZXJhdG9ycyBwZXIgc3BlY2lmaWNhdGlvbi5cbiovXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ2dlbmVyYXRvcnMnLCBmdW5jdGlvbigpIHtcbiAgICB0cnkge1xuICAgICAgbmV3IEZ1bmN0aW9uKCdmdW5jdGlvbiogdGVzdCgpIHt9JykoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9KTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIkVTNiBNYXRoXCIsXG4gIFwicHJvcGVydHlcIjogXCJlczZtYXRoXCIsXG4gIFwibm90ZXNcIjogW3tcbiAgICBcIm5hbWVcIjogXCJ1bm9mZmljaWFsIEVDTUFTY3JpcHQgNiBkcmFmdCBzcGVjaWZpY2F0aW9uXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWxcIlxuICB9XSxcbiAgXCJwb2x5ZmlsbHNcIjogW1wiZXM2c2hpbVwiXSxcbiAgXCJhdXRob3JzXCI6IFtcIlJvbiBXYWxkb24gKEBqb2tleXJoeW1lKVwiXSxcbiAgXCJ3YXJuaW5nc1wiOiBbXCJFQ01BU2NyaXB0IDYgaXMgc3RpbGwgYSBvbmx5IGEgZHJhZnQsIHNvIHRoaXMgZGV0ZWN0IG1heSBub3QgbWF0Y2ggdGhlIGZpbmFsIHNwZWNpZmljYXRpb24gb3IgaW1wbGVtZW50YXRpb25zLlwiXSxcbiAgXCJ0YWdzXCI6IFtcImVzNlwiXVxufVxuISovXG4vKiBET0NcbkNoZWNrIGlmIGJyb3dzZXIgaW1wbGVtZW50cyBFQ01BU2NyaXB0IDYgTWF0aCBwZXIgc3BlY2lmaWNhdGlvbi5cbiovXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ2VzNm1hdGgnLCAhIShNYXRoICYmXG4gICAgTWF0aC5jbHozMiAmJlxuICAgIE1hdGguY2JydCAmJlxuICAgIE1hdGguaW11bCAmJlxuICAgIE1hdGguc2lnbiAmJlxuICAgIE1hdGgubG9nMTAgJiZcbiAgICBNYXRoLmxvZzIgJiZcbiAgICBNYXRoLmxvZzFwICYmXG4gICAgTWF0aC5leHBtMSAmJlxuICAgIE1hdGguY29zaCAmJlxuICAgIE1hdGguc2luaCAmJlxuICAgIE1hdGgudGFuaCAmJlxuICAgIE1hdGguYWNvc2ggJiZcbiAgICBNYXRoLmFzaW5oICYmXG4gICAgTWF0aC5hdGFuaCAmJlxuICAgIE1hdGguaHlwb3QgJiZcbiAgICBNYXRoLnRydW5jICYmXG4gICAgTWF0aC5mcm91bmQpKTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIkVTNiBOdW1iZXJcIixcbiAgXCJwcm9wZXJ0eVwiOiBcImVzNm51bWJlclwiLFxuICBcIm5vdGVzXCI6IFt7XG4gICAgXCJuYW1lXCI6IFwidW5vZmZpY2lhbCBFQ01BU2NyaXB0IDYgZHJhZnQgc3BlY2lmaWNhdGlvblwiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sXCJcbiAgfV0sXG4gIFwicG9seWZpbGxzXCI6IFtcImVzNnNoaW1cIl0sXG4gIFwiYXV0aG9yc1wiOiBbXCJSb24gV2FsZG9uIChAam9rZXlyaHltZSlcIl0sXG4gIFwid2FybmluZ3NcIjogW1wiRUNNQVNjcmlwdCA2IGlzIHN0aWxsIGEgb25seSBhIGRyYWZ0LCBzbyB0aGlzIGRldGVjdCBtYXkgbm90IG1hdGNoIHRoZSBmaW5hbCBzcGVjaWZpY2F0aW9uIG9yIGltcGxlbWVudGF0aW9ucy5cIl0sXG4gIFwidGFnc1wiOiBbXCJlczZcIl1cbn1cbiEqL1xuLyogRE9DXG5DaGVjayBpZiBicm93c2VyIGltcGxlbWVudHMgRUNNQVNjcmlwdCA2IE51bWJlciBwZXIgc3BlY2lmaWNhdGlvbi5cbiovXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ2VzNm51bWJlcicsICEhKE51bWJlci5pc0Zpbml0ZSAmJlxuICAgIE51bWJlci5pc0ludGVnZXIgJiZcbiAgICBOdW1iZXIuaXNTYWZlSW50ZWdlciAmJlxuICAgIE51bWJlci5pc05hTiAmJlxuICAgIE51bWJlci5wYXJzZUludCAmJlxuICAgIE51bWJlci5wYXJzZUZsb2F0ICYmXG4gICAgTnVtYmVyLmlzSW50ZWdlcihOdW1iZXIuTUFYX1NBRkVfSU5URUdFUikgJiZcbiAgICBOdW1iZXIuaXNJbnRlZ2VyKE51bWJlci5NSU5fU0FGRV9JTlRFR0VSKSAmJlxuICAgIE51bWJlci5pc0Zpbml0ZShOdW1iZXIuRVBTSUxPTikpKTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIkVTNiBPYmplY3RcIixcbiAgXCJwcm9wZXJ0eVwiOiBcImVzNm9iamVjdFwiLFxuICBcIm5vdGVzXCI6IFt7XG4gICAgXCJuYW1lXCI6IFwidW5vZmZpY2lhbCBFQ01BU2NyaXB0IDYgZHJhZnQgc3BlY2lmaWNhdGlvblwiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sXCJcbiAgfV0sXG4gIFwicG9seWZpbGxzXCI6IFtcImVzNnNoaW1cIl0sXG4gIFwiYXV0aG9yc1wiOiBbXCJSb24gV2FsZG9uIChAam9rZXlyaHltZSlcIl0sXG4gIFwid2FybmluZ3NcIjogW1wiRUNNQVNjcmlwdCA2IGlzIHN0aWxsIGEgb25seSBhIGRyYWZ0LCBzbyB0aGlzIGRldGVjdCBtYXkgbm90IG1hdGNoIHRoZSBmaW5hbCBzcGVjaWZpY2F0aW9uIG9yIGltcGxlbWVudGF0aW9ucy5cIl0sXG4gIFwidGFnc1wiOiBbXCJlczZcIl1cbn1cbiEqL1xuLyogRE9DXG5DaGVjayBpZiBicm93c2VyIGltcGxlbWVudHMgRUNNQVNjcmlwdCA2IE9iamVjdCBwZXIgc3BlY2lmaWNhdGlvbi5cbiovXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ2VzNm9iamVjdCcsICEhKE9iamVjdC5hc3NpZ24gJiZcbiAgICBPYmplY3QuaXMgJiZcbiAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YpKTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIkVTNiBQcm9taXNlc1wiLFxuICBcInByb3BlcnR5XCI6IFwicHJvbWlzZXNcIixcbiAgXCJjYW5pdXNlXCI6IFwicHJvbWlzZXNcIixcbiAgXCJwb2x5ZmlsbHNcIjogW1wiZXM2cHJvbWlzZXNcIl0sXG4gIFwiYXV0aG9yc1wiOiBbXCJLcmlzdGVyIEthcmlcIiwgXCJKYWtlIEFyY2hpYmFsZFwiXSxcbiAgXCJ0YWdzXCI6IFtcImVzNlwiXSxcbiAgXCJub3Rlc1wiOiBbe1xuICAgIFwibmFtZVwiOiBcIlRoZSBFUzYgcHJvbWlzZXMgc3BlY1wiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9kb21lbmljL3Byb21pc2VzLXVud3JhcHBpbmdcIlxuICB9LHtcbiAgICBcIm5hbWVcIjogXCJDaHJvbWl1bSBkYXNoYm9hcmQgLSBFUzYgUHJvbWlzZXNcIixcbiAgICBcImhyZWZcIjogXCJodHRwczovL3d3dy5jaHJvbWVzdGF0dXMuY29tL2ZlYXR1cmVzLzU2ODE3MjYzMzY1MzI0ODBcIlxuICB9LHtcbiAgICBcIm5hbWVcIjogXCJKYXZhU2NyaXB0IFByb21pc2VzOiBUaGVyZSBhbmQgYmFjayBhZ2FpbiAtIEhUTUw1IFJvY2tzXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cDovL3d3dy5odG1sNXJvY2tzLmNvbS9lbi90dXRvcmlhbHMvZXM2L3Byb21pc2VzL1wiXG4gIH1dXG59XG4hKi9cbi8qIERPQ1xuQ2hlY2sgaWYgYnJvd3NlciBpbXBsZW1lbnRzIEVDTUFTY3JpcHQgNiBQcm9taXNlcyBwZXIgc3BlY2lmaWNhdGlvbi5cbiovXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ3Byb21pc2VzJywgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICdQcm9taXNlJyBpbiB3aW5kb3cgJiZcbiAgICAvLyBTb21lIG9mIHRoZXNlIG1ldGhvZHMgYXJlIG1pc3NpbmcgZnJvbVxuICAgIC8vIEZpcmVmb3gvQ2hyb21lIGV4cGVyaW1lbnRhbCBpbXBsZW1lbnRhdGlvbnNcbiAgICAncmVzb2x2ZScgaW4gd2luZG93LlByb21pc2UgJiZcbiAgICAncmVqZWN0JyBpbiB3aW5kb3cuUHJvbWlzZSAmJlxuICAgICdhbGwnIGluIHdpbmRvdy5Qcm9taXNlICYmXG4gICAgJ3JhY2UnIGluIHdpbmRvdy5Qcm9taXNlICYmXG4gICAgLy8gT2xkZXIgdmVyc2lvbiBvZiB0aGUgc3BlYyBoYWQgYSByZXNvbHZlciBvYmplY3RcbiAgICAvLyBhcyB0aGUgYXJnIHJhdGhlciB0aGFuIGEgZnVuY3Rpb25cbiAgICAoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVzb2x2ZTtcbiAgICAgIG5ldyB3aW5kb3cuUHJvbWlzZShmdW5jdGlvbihyKSB7IHJlc29sdmUgPSByOyB9KTtcbiAgICAgIHJldHVybiB0eXBlb2YgcmVzb2x2ZSA9PT0gJ2Z1bmN0aW9uJztcbiAgICB9KCkpO1xuICB9KTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIkVTNiBTdHJpbmdcIixcbiAgXCJwcm9wZXJ0eVwiOiBcImVzNnN0cmluZ1wiLFxuICBcIm5vdGVzXCI6IFt7XG4gICAgXCJuYW1lXCI6IFwidW5vZmZpY2lhbCBFQ01BU2NyaXB0IDYgZHJhZnQgc3BlY2lmaWNhdGlvblwiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sXCJcbiAgfV0sXG4gIFwicG9seWZpbGxzXCI6IFtcImVzNnNoaW1cIl0sXG4gIFwiYXV0aG9yc1wiOiBbXCJSb24gV2FsZG9uIChAam9rZXlyaHltZSlcIl0sXG4gIFwid2FybmluZ3NcIjogW1wiRUNNQVNjcmlwdCA2IGlzIHN0aWxsIGEgb25seSBhIGRyYWZ0LCBzbyB0aGlzIGRldGVjdCBtYXkgbm90IG1hdGNoIHRoZSBmaW5hbCBzcGVjaWZpY2F0aW9uIG9yIGltcGxlbWVudGF0aW9ucy5cIl0sXG4gIFwidGFnc1wiOiBbXCJlczZcIl1cbn1cbiEqL1xuLyogRE9DXG5DaGVjayBpZiBicm93c2VyIGltcGxlbWVudHMgRUNNQVNjcmlwdCA2IFN0cmluZyBwZXIgc3BlY2lmaWNhdGlvbi5cbiovXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ2VzNnN0cmluZycsICEhKFN0cmluZy5mcm9tQ29kZVBvaW50ICYmXG4gICAgU3RyaW5nLnJhdyAmJlxuICAgIFN0cmluZy5wcm90b3R5cGUuY29kZVBvaW50QXQgJiZcbiAgICBTdHJpbmcucHJvdG90eXBlLnJlcGVhdCAmJlxuICAgIFN0cmluZy5wcm90b3R5cGUuc3RhcnRzV2l0aCAmJlxuICAgIFN0cmluZy5wcm90b3R5cGUuZW5kc1dpdGggJiZcbiAgICBTdHJpbmcucHJvdG90eXBlLmluY2x1ZGVzKSk7XG5cbi8qIVxue1xuICBcIm5hbWVcIjogXCJPcmllbnRhdGlvbiBhbmQgTW90aW9uIEV2ZW50c1wiLFxuICBcInByb3BlcnR5XCI6IFtcImRldmljZW1vdGlvblwiLCBcImRldmljZW9yaWVudGF0aW9uXCJdLFxuICBcImNhbml1c2VcIjogXCJkZXZpY2VvcmllbnRhdGlvblwiLFxuICBcIm5vdGVzXCI6IFt7XG4gICAgXCJuYW1lXCI6IFwiVzNDIEVkaXRvcidzIERyYWZ0XCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cDovL3czYy5naXRodWIuaW8vZGV2aWNlb3JpZW50YXRpb24vc3BlYy1zb3VyY2Utb3JpZW50YXRpb24uaHRtbFwiXG4gIH0se1xuICAgIFwibmFtZVwiOiBcIkltcGxlbWVudGF0aW9uIGJ5IGlPUyBTYWZhcmkgKE9yaWVudGF0aW9uKVwiLFxuICAgIFwiaHJlZlwiOiBcImh0dHA6Ly9nb28uZ2wvZmhjZTNcIlxuICB9LHtcbiAgICBcIm5hbWVcIjogXCJJbXBsZW1lbnRhdGlvbiBieSBpT1MgU2FmYXJpIChNb3Rpb24pXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cDovL2dvby5nbC9yTEt6OFwiXG4gIH1dLFxuICBcImF1dGhvcnNcIjogW1wiU2hpIENodWFuXCJdLFxuICBcInRhZ3NcIjogW1wiZXZlbnRcIl0sXG4gIFwiYnVpbGRlckFsaWFzZXNcIjogW1wiZXZlbnRfZGV2aWNlb3JpZW50YXRpb25fbW90aW9uXCJdXG59XG4hKi9cbi8qIERPQ1xuUGFydCBvZiBEZXZpY2UgQWNjZXNzIGFzcGVjdCBvZiBIVE1MNSwgc2FtZSBjYXRlZ29yeSBhcyBnZW9sb2NhdGlvbi5cblxuYGRldmljZW1vdGlvbmAgdGVzdHMgZm9yIERldmljZSBNb3Rpb24gRXZlbnQgc3VwcG9ydCwgcmV0dXJucyBib29sZWFuIHZhbHVlIHRydWUvZmFsc2UuXG5cbmBkZXZpY2VvcmllbnRhdGlvbmAgdGVzdHMgZm9yIERldmljZSBPcmllbnRhdGlvbiBFdmVudCBzdXBwb3J0LCByZXR1cm5zIGJvb2xlYW4gdmFsdWUgdHJ1ZS9mYWxzZVxuKi9cblxuICBNb2Rlcm5penIuYWRkVGVzdCgnZGV2aWNlbW90aW9uJywgJ0RldmljZU1vdGlvbkV2ZW50JyBpbiB3aW5kb3cpO1xuICBNb2Rlcm5penIuYWRkVGVzdCgnZGV2aWNlb3JpZW50YXRpb24nLCAnRGV2aWNlT3JpZW50YXRpb25FdmVudCcgaW4gd2luZG93KTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIkZ1bGxzY3JlZW4gQVBJXCIsXG4gIFwicHJvcGVydHlcIjogXCJmdWxsc2NyZWVuXCIsXG4gIFwiY2FuaXVzZVwiOiBcImZ1bGxzY3JlZW5cIixcbiAgXCJub3Rlc1wiOiBbe1xuICAgIFwibmFtZVwiOiBcIk1ETiBkb2N1bWVudGF0aW9uXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vQVBJL0Z1bGxzY3JlZW5cIlxuICB9XSxcbiAgXCJwb2x5ZmlsbHNcIjogW1wic2NyZWVuZnVsbGpzXCJdLFxuICBcImJ1aWxkZXJBbGlhc2VzXCI6IFtcImZ1bGxzY3JlZW5fYXBpXCJdXG59XG4hKi9cbi8qIERPQ1xuRGV0ZWN0cyBzdXBwb3J0IGZvciB0aGUgYWJpbGl0eSB0byBtYWtlIHRoZSBjdXJyZW50IHdlYnNpdGUgdGFrZSBvdmVyIHRoZSB1c2VyJ3MgZW50aXJlIHNjcmVlblxuKi9cblxuICAvLyBnaXRodWIuY29tL01vZGVybml6ci9Nb2Rlcm5penIvaXNzdWVzLzczOVxuICBNb2Rlcm5penIuYWRkVGVzdCgnZnVsbHNjcmVlbicsICEhKHByZWZpeGVkKCdleGl0RnVsbHNjcmVlbicsIGRvY3VtZW50LCBmYWxzZSkgfHwgcHJlZml4ZWQoJ2NhbmNlbEZ1bGxTY3JlZW4nLCBkb2N1bWVudCwgZmFsc2UpKSk7XG5cbi8qIVxue1xuICBcIm5hbWVcIjogXCJIYXNoY2hhbmdlIGV2ZW50XCIsXG4gIFwicHJvcGVydHlcIjogXCJoYXNoY2hhbmdlXCIsXG4gIFwiY2FuaXVzZVwiOiBcImhhc2hjaGFuZ2VcIixcbiAgXCJ0YWdzXCI6IFtcImhpc3RvcnlcIl0sXG4gIFwibm90ZXNcIjogW3tcbiAgICBcIm5hbWVcIjogXCJNRE4gZG9jdW1lbnRhdGlvblwiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS93aW5kb3cub25oYXNoY2hhbmdlXCJcbiAgfV0sXG4gIFwicG9seWZpbGxzXCI6IFtcbiAgICBcImpxdWVyeS1oYXNoY2hhbmdlXCIsXG4gICAgXCJtb28taGlzdG9yeW1hbmFnZXJcIixcbiAgICBcImpxdWVyeS1hamF4eVwiLFxuICAgIFwiaGFzaGVyXCIsXG4gICAgXCJzaGlzdG9yeVwiXG4gIF1cbn1cbiEqL1xuLyogRE9DXG5EZXRlY3RzIHN1cHBvcnQgZm9yIHRoZSBgaGFzaGNoYW5nZWAgZXZlbnQsIGZpcmVkIHdoZW4gdGhlIGN1cnJlbnQgbG9jYXRpb24gZnJhZ21lbnQgY2hhbmdlcy5cbiovXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ2hhc2hjaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICBpZiAoaGFzRXZlbnQoJ2hhc2hjaGFuZ2UnLCB3aW5kb3cpID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIGRvY3VtZW50TW9kZSBsb2dpYyBmcm9tIFlVSSB0byBmaWx0ZXIgb3V0IElFOCBDb21wYXQgTW9kZVxuICAgIC8vICAgd2hpY2ggZmFsc2UgcG9zaXRpdmVzLlxuICAgIHJldHVybiAoZG9jdW1lbnQuZG9jdW1lbnRNb2RlID09PSB1bmRlZmluZWQgfHwgZG9jdW1lbnQuZG9jdW1lbnRNb2RlID4gNyk7XG4gIH0pO1xuXG4vKiFcbntcbiAgXCJuYW1lXCI6IFwiSGlkZGVuIFNjcm9sbGJhclwiLFxuICBcInByb3BlcnR5XCI6IFwiaGlkZGVuc2Nyb2xsXCIsXG4gIFwiYXV0aG9yc1wiOiBbXCJPbGVnIEtvcnN1bnNreVwiXSxcbiAgXCJ0YWdzXCI6IFtcIm92ZXJsYXlcIl0sXG4gIFwibm90ZXNcIjogW3tcbiAgICBcIm5hbWVcIjogXCJPdmVybGF5IFNjcm9sbGJhciBkZXNjcmlwdGlvblwiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vZGV2ZWxvcGVyLmFwcGxlLmNvbS9saWJyYXJ5L21hYy9yZWxlYXNlbm90ZXMvTWFjT1NYL1doYXRzTmV3SW5PU1gvQXJ0aWNsZXMvTWFjT1NYMTBfNy5odG1sIy8vYXBwbGVfcmVmL2RvYy91aWQvVFA0MDAxMDM1NS1TVzM5XCJcbiAgfSx7XG4gICAgXCJuYW1lXCI6IFwiVmlkZW8gZXhhbXBsZSBvZiBvdmVybGF5IHNjcm9sbGJhcnNcIixcbiAgICBcImhyZWZcIjogXCJodHRwczovL2dmeWNhdC5jb20vRm9vbGlzaE1lYXNseUF0bGFudGljc2hhcnBub3NlcHVmZmVyXCJcbiAgfV1cbn1cbiEqL1xuLyogRE9DXG5EZXRlY3RzIG92ZXJsYXkgc2Nyb2xsYmFycyAod2hlbiBzY3JvbGxiYXJzIG9uIG92ZXJmbG93ZWQgYmxvY2tzIGFyZSB2aXNpYmxlKS4gVGhpcyBpcyBmb3VuZCBtb3N0IGNvbW1vbmx5IG9uIG1vYmlsZSBhbmQgT1MgWC5cbiovXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ2hpZGRlbnNjcm9sbCcsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0ZXN0U3R5bGVzKCcjbW9kZXJuaXpyIHt3aWR0aDoxMDBweDtoZWlnaHQ6MTAwcHg7b3ZlcmZsb3c6c2Nyb2xsfScsIGZ1bmN0aW9uKGVsZW0pIHtcbiAgICAgIHJldHVybiBlbGVtLm9mZnNldFdpZHRoID09PSBlbGVtLmNsaWVudFdpZHRoO1xuICAgIH0pO1xuICB9KTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIkhpc3RvcnkgQVBJXCIsXG4gIFwicHJvcGVydHlcIjogXCJoaXN0b3J5XCIsXG4gIFwiY2FuaXVzZVwiOiBcImhpc3RvcnlcIixcbiAgXCJ0YWdzXCI6IFtcImhpc3RvcnlcIl0sXG4gIFwiYXV0aG9yc1wiOiBbXCJIYXkgS3JhbmVuXCIsIFwiQWxleGFuZGVyIEZhcmthc1wiXSxcbiAgXCJub3Rlc1wiOiBbe1xuICAgIFwibmFtZVwiOiBcIlczQyBTcGVjXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly93d3cudzMub3JnL1RSL2h0bWw1MS9icm93c2Vycy5odG1sI3RoZS1oaXN0b3J5LWludGVyZmFjZVwiXG4gIH0sIHtcbiAgICBcIm5hbWVcIjogXCJNRE4gZG9jdW1lbnRhdGlvblwiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS93aW5kb3cuaGlzdG9yeVwiXG4gIH1dLFxuICBcInBvbHlmaWxsc1wiOiBbXCJoaXN0b3J5anNcIiwgXCJodG1sNWhpc3RvcnlhcGlcIl1cbn1cbiEqL1xuLyogRE9DXG5EZXRlY3RzIHN1cHBvcnQgZm9yIHRoZSBIaXN0b3J5IEFQSSBmb3IgbWFuaXB1bGF0aW5nIHRoZSBicm93c2VyIHNlc3Npb24gaGlzdG9yeS5cbiovXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ2hpc3RvcnknLCBmdW5jdGlvbigpIHtcbiAgICAvLyBJc3N1ZSAjNzMzXG4gICAgLy8gVGhlIHN0b2NrIGJyb3dzZXIgb24gQW5kcm9pZCAyLjIgJiAyLjMsIGFuZCA0LjAueCByZXR1cm5zIHBvc2l0aXZlIG9uIGhpc3Rvcnkgc3VwcG9ydFxuICAgIC8vIFVuZm9ydHVuYXRlbHkgc3VwcG9ydCBpcyByZWFsbHkgYnVnZ3kgYW5kIHRoZXJlIGlzIG5vIGNsZWFuIHdheSB0byBkZXRlY3RcbiAgICAvLyB0aGVzZSBidWdzLCBzbyB3ZSBmYWxsIGJhY2sgdG8gYSB1c2VyIGFnZW50IHNuaWZmIDooXG4gICAgdmFyIHVhID0gbmF2aWdhdG9yLnVzZXJBZ2VudDtcblxuICAgIC8vIFdlIG9ubHkgd2FudCBBbmRyb2lkIDIgYW5kIDQuMCwgc3RvY2sgYnJvd3NlciwgYW5kIG5vdCBDaHJvbWUgd2hpY2ggaWRlbnRpZmllc1xuICAgIC8vIGl0c2VsZiBhcyAnTW9iaWxlIFNhZmFyaScgYXMgd2VsbCwgbm9yIFdpbmRvd3MgUGhvbmUgKGlzc3VlICMxNDcxKS5cbiAgICBpZiAoKHVhLmluZGV4T2YoJ0FuZHJvaWQgMi4nKSAhPT0gLTEgfHxcbiAgICAgICAgKHVhLmluZGV4T2YoJ0FuZHJvaWQgNC4wJykgIT09IC0xKSkgJiZcbiAgICAgICAgdWEuaW5kZXhPZignTW9iaWxlIFNhZmFyaScpICE9PSAtMSAmJlxuICAgICAgICB1YS5pbmRleE9mKCdDaHJvbWUnKSA9PT0gLTEgJiZcbiAgICAgICAgdWEuaW5kZXhPZignV2luZG93cyBQaG9uZScpID09PSAtMSAmJlxuICAgIC8vIFNpbmNlIGFsbCBkb2N1bWVudHMgb24gZmlsZTovLyBzaGFyZSBhbiBvcmlnaW4sIHRoZSBIaXN0b3J5IGFwaXMgYXJlXG4gICAgLy8gYmxvY2tlZCB0aGVyZSBhcyB3ZWxsXG4gICAgICAgIGxvY2F0aW9uLnByb3RvY29sICE9PSAnZmlsZTonXG4gICAgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIHRoZSByZWd1bGFyIGNoZWNrXG4gICAgcmV0dXJuICh3aW5kb3cuaGlzdG9yeSAmJiAncHVzaFN0YXRlJyBpbiB3aW5kb3cuaGlzdG9yeSk7XG4gIH0pO1xuXG5cbiAgLyoqXG4gICAqIGhhc093blByb3AgaXMgYSBzaGltIGZvciBoYXNPd25Qcm9wZXJ0eSB0aGF0IGlzIG5lZWRlZCBmb3IgU2FmYXJpIDIuMCBzdXBwb3J0XG4gICAqXG4gICAqIEBhdXRob3Iga2FuZ2F4XG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKiBAZnVuY3Rpb24gaGFzT3duUHJvcFxuICAgKiBAcGFyYW0ge29iamVjdH0gb2JqZWN0IC0gVGhlIG9iamVjdCB0byBjaGVjayBmb3IgYSBwcm9wZXJ0eVxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHkgLSBUaGUgcHJvcGVydHkgdG8gY2hlY2sgZm9yXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuICAvLyBoYXNPd25Qcm9wZXJ0eSBzaGltIGJ5IGthbmdheCBuZWVkZWQgZm9yIFNhZmFyaSAyLjAgc3VwcG9ydFxuICB2YXIgaGFzT3duUHJvcDtcblxuICAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIF9oYXNPd25Qcm9wZXJ0eSA9ICh7fSkuaGFzT3duUHJvcGVydHk7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAvKiB3ZSBoYXZlIG5vIHdheSBvZiB0ZXN0aW5nIElFIDUuNSBvciBzYWZhcmkgMixcbiAgICAgKiBzbyBqdXN0IGFzc3VtZSB0aGUgZWxzZSBnZXRzIGhpdCAqL1xuICAgIGlmICghaXMoX2hhc093blByb3BlcnR5LCAndW5kZWZpbmVkJykgJiYgIWlzKF9oYXNPd25Qcm9wZXJ0eS5jYWxsLCAndW5kZWZpbmVkJykpIHtcbiAgICAgIGhhc093blByb3AgPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7XG4gICAgICAgIHJldHVybiBfaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTtcbiAgICAgIH07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaGFzT3duUHJvcCA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgLyogeWVzLCB0aGlzIGNhbiBnaXZlIGZhbHNlIHBvc2l0aXZlcy9uZWdhdGl2ZXMsIGJ1dCBtb3N0IG9mIHRoZSB0aW1lIHdlIGRvbid0IGNhcmUgYWJvdXQgdGhvc2UgKi9cbiAgICAgICAgcmV0dXJuICgocHJvcGVydHkgaW4gb2JqZWN0KSAmJiBpcyhvYmplY3QuY29uc3RydWN0b3IucHJvdG90eXBlW3Byb3BlcnR5XSwgJ3VuZGVmaW5lZCcpKTtcbiAgICAgIH07XG4gICAgfVxuICB9KSgpO1xuXG4gIFxuXG4gIC8qKlxuICAgKiBzZXRDbGFzc2VzIHRha2VzIGFuIGFycmF5IG9mIGNsYXNzIG5hbWVzIGFuZCBhZGRzIHRoZW0gdG8gdGhlIHJvb3QgZWxlbWVudFxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICogQGZ1bmN0aW9uIHNldENsYXNzZXNcbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gY2xhc3NlcyAtIEFycmF5IG9mIGNsYXNzIG5hbWVzXG4gICAqL1xuXG4gIC8vIFBhc3MgaW4gYW4gYW5kIGFycmF5IG9mIGNsYXNzIG5hbWVzLCBlLmcuOlxuICAvLyAgWyduby13ZWJwJywgJ2JvcmRlcnJhZGl1cycsIC4uLl1cbiAgZnVuY3Rpb24gc2V0Q2xhc3NlcyhjbGFzc2VzKSB7XG4gICAgdmFyIGNsYXNzTmFtZSA9IGRvY0VsZW1lbnQuY2xhc3NOYW1lO1xuICAgIHZhciBjbGFzc1ByZWZpeCA9IE1vZGVybml6ci5fY29uZmlnLmNsYXNzUHJlZml4IHx8ICcnO1xuXG4gICAgaWYgKGlzU1ZHKSB7XG4gICAgICBjbGFzc05hbWUgPSBjbGFzc05hbWUuYmFzZVZhbDtcbiAgICB9XG5cbiAgICAvLyBDaGFuZ2UgYG5vLWpzYCB0byBganNgIChpbmRlcGVuZGVudGx5IG9mIHRoZSBgZW5hYmxlQ2xhc3Nlc2Agb3B0aW9uKVxuICAgIC8vIEhhbmRsZSBjbGFzc1ByZWZpeCBvbiB0aGlzIHRvb1xuICAgIGlmIChNb2Rlcm5penIuX2NvbmZpZy5lbmFibGVKU0NsYXNzKSB7XG4gICAgICB2YXIgcmVKUyA9IG5ldyBSZWdFeHAoJyhefFxcXFxzKScgKyBjbGFzc1ByZWZpeCArICduby1qcyhcXFxcc3wkKScpO1xuICAgICAgY2xhc3NOYW1lID0gY2xhc3NOYW1lLnJlcGxhY2UocmVKUywgJyQxJyArIGNsYXNzUHJlZml4ICsgJ2pzJDInKTtcbiAgICB9XG5cbiAgICBpZiAoTW9kZXJuaXpyLl9jb25maWcuZW5hYmxlQ2xhc3Nlcykge1xuICAgICAgLy8gQWRkIHRoZSBuZXcgY2xhc3Nlc1xuICAgICAgY2xhc3NOYW1lICs9ICcgJyArIGNsYXNzUHJlZml4ICsgY2xhc3Nlcy5qb2luKCcgJyArIGNsYXNzUHJlZml4KTtcbiAgICAgIGlmIChpc1NWRykge1xuICAgICAgICBkb2NFbGVtZW50LmNsYXNzTmFtZS5iYXNlVmFsID0gY2xhc3NOYW1lO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZG9jRWxlbWVudC5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG4gICAgICB9XG4gICAgfVxuXG4gIH1cblxuICA7XG5cblxuICAgLy8gX2wgdHJhY2tzIGxpc3RlbmVycyBmb3IgYXN5bmMgdGVzdHMsIGFzIHdlbGwgYXMgdGVzdHMgdGhhdCBleGVjdXRlIGFmdGVyIHRoZSBpbml0aWFsIHJ1blxuICBNb2Rlcm5penJQcm90by5fbCA9IHt9O1xuXG4gIC8qKlxuICAgKiBNb2Rlcm5penIub24gaXMgYSB3YXkgdG8gbGlzdGVuIGZvciB0aGUgY29tcGxldGlvbiBvZiBhc3luYyB0ZXN0cy4gQmVpbmdcbiAgICogYXN5bmNocm9ub3VzLCB0aGV5IG1heSBub3QgZmluaXNoIGJlZm9yZSB5b3VyIHNjcmlwdHMgcnVuLiBBcyBhIHJlc3VsdCB5b3VcbiAgICogd2lsbCBnZXQgYSBwb3NzaWJseSBmYWxzZSBuZWdhdGl2ZSBgdW5kZWZpbmVkYCB2YWx1ZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIE1vZGVybml6clxuICAgKiBAbmFtZSBNb2Rlcm5penIub25cbiAgICogQGFjY2VzcyBwdWJsaWNcbiAgICogQGZ1bmN0aW9uIG9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmZWF0dXJlIC0gU3RyaW5nIG5hbWUgb2YgdGhlIGZlYXR1cmUgZGV0ZWN0XG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNiIC0gQ2FsbGJhY2sgZnVuY3Rpb24gcmV0dXJuaW5nIGEgQm9vbGVhbiAtIHRydWUgaWYgZmVhdHVyZSBpcyBzdXBwb3J0ZWQsIGZhbHNlIGlmIG5vdFxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBgYGBqc1xuICAgKiBNb2Rlcm5penIub24oJ2ZsYXNoJywgZnVuY3Rpb24oIHJlc3VsdCApIHtcbiAgICogICBpZiAocmVzdWx0KSB7XG4gICAqICAgIC8vIHRoZSBicm93c2VyIGhhcyBmbGFzaFxuICAgKiAgIH0gZWxzZSB7XG4gICAqICAgICAvLyB0aGUgYnJvd3NlciBkb2VzIG5vdCBoYXZlIGZsYXNoXG4gICAqICAgfVxuICAgKiB9KTtcbiAgICogYGBgXG4gICAqL1xuXG4gIE1vZGVybml6clByb3RvLm9uID0gZnVuY3Rpb24oZmVhdHVyZSwgY2IpIHtcbiAgICAvLyBDcmVhdGUgdGhlIGxpc3Qgb2YgbGlzdGVuZXJzIGlmIGl0IGRvZXNuJ3QgZXhpc3RcbiAgICBpZiAoIXRoaXMuX2xbZmVhdHVyZV0pIHtcbiAgICAgIHRoaXMuX2xbZmVhdHVyZV0gPSBbXTtcbiAgICB9XG5cbiAgICAvLyBQdXNoIHRoaXMgdGVzdCBvbiB0byB0aGUgbGlzdGVuZXIgbGlzdFxuICAgIHRoaXMuX2xbZmVhdHVyZV0ucHVzaChjYik7XG5cbiAgICAvLyBJZiBpdCdzIGFscmVhZHkgYmVlbiByZXNvbHZlZCwgdHJpZ2dlciBpdCBvbiBuZXh0IHRpY2tcbiAgICBpZiAoTW9kZXJuaXpyLmhhc093blByb3BlcnR5KGZlYXR1cmUpKSB7XG4gICAgICAvLyBOZXh0IFRpY2tcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIE1vZGVybml6ci5fdHJpZ2dlcihmZWF0dXJlLCBNb2Rlcm5penJbZmVhdHVyZV0pO1xuICAgICAgfSwgMCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBfdHJpZ2dlciBpcyB0aGUgcHJpdmF0ZSBmdW5jdGlvbiB1c2VkIHRvIHNpZ25hbCB0ZXN0IGNvbXBsZXRpb24gYW5kIHJ1biBhbnlcbiAgICogY2FsbGJhY2tzIHJlZ2lzdGVyZWQgdGhyb3VnaCBbTW9kZXJuaXpyLm9uXSgjbW9kZXJuaXpyLW9uKVxuICAgKlxuICAgKiBAbWVtYmVyb2YgTW9kZXJuaXpyXG4gICAqIEBuYW1lIE1vZGVybml6ci5fdHJpZ2dlclxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICogQGZ1bmN0aW9uIF90cmlnZ2VyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmZWF0dXJlIC0gc3RyaW5nIG5hbWUgb2YgdGhlIGZlYXR1cmUgZGV0ZWN0XG4gICAqIEBwYXJhbSB7ZnVuY3Rpb258Ym9vbGVhbn0gW3Jlc10gLSBBIGZlYXR1cmUgZGV0ZWN0aW9uIGZ1bmN0aW9uLCBvciB0aGUgYm9vbGVhbiA9XG4gICAqIHJlc3VsdCBvZiBhIGZlYXR1cmUgZGV0ZWN0aW9uIGZ1bmN0aW9uXG4gICAqL1xuXG4gIE1vZGVybml6clByb3RvLl90cmlnZ2VyID0gZnVuY3Rpb24oZmVhdHVyZSwgcmVzKSB7XG4gICAgaWYgKCF0aGlzLl9sW2ZlYXR1cmVdKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGNicyA9IHRoaXMuX2xbZmVhdHVyZV07XG5cbiAgICAvLyBGb3JjZSBhc3luY1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaSwgY2I7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgY2JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNiID0gY2JzW2ldO1xuICAgICAgICBjYihyZXMpO1xuICAgICAgfVxuICAgIH0sIDApO1xuXG4gICAgLy8gRG9uJ3QgdHJpZ2dlciB0aGVzZSBhZ2FpblxuICAgIGRlbGV0ZSB0aGlzLl9sW2ZlYXR1cmVdO1xuICB9O1xuXG4gIC8qKlxuICAgKiBhZGRUZXN0IGFsbG93cyB5b3UgdG8gZGVmaW5lIHlvdXIgb3duIGZlYXR1cmUgZGV0ZWN0cyB0aGF0IGFyZSBub3QgY3VycmVudGx5XG4gICAqIGluY2x1ZGVkIGluIE1vZGVybml6ciAodW5kZXIgdGhlIGNvdmVycyBpdCdzIHRoZSBleGFjdCBzYW1lIGNvZGUgTW9kZXJuaXpyXG4gICAqIHVzZXMgZm9yIGl0cyBvd24gW2ZlYXR1cmUgZGV0ZWN0aW9uc10oaHR0cHM6Ly9naXRodWIuY29tL01vZGVybml6ci9Nb2Rlcm5penIvdHJlZS9tYXN0ZXIvZmVhdHVyZS1kZXRlY3RzKSkuIEp1c3QgbGlrZSB0aGUgb2ZmaWNhbCBkZXRlY3RzLCB0aGUgcmVzdWx0XG4gICAqIHdpbGwgYmUgYWRkZWQgb250byB0aGUgTW9kZXJuaXpyIG9iamVjdCwgYXMgd2VsbCBhcyBhbiBhcHByb3ByaWF0ZSBjbGFzc05hbWUgc2V0IG9uXG4gICAqIHRoZSBodG1sIGVsZW1lbnQgd2hlbiBjb25maWd1cmVkIHRvIGRvIHNvXG4gICAqXG4gICAqIEBtZW1iZXJvZiBNb2Rlcm5penJcbiAgICogQG5hbWUgTW9kZXJuaXpyLmFkZFRlc3RcbiAgICogQG9wdGlvbk5hbWUgTW9kZXJuaXpyLmFkZFRlc3QoKVxuICAgKiBAb3B0aW9uUHJvcCBhZGRUZXN0XG4gICAqIEBhY2Nlc3MgcHVibGljXG4gICAqIEBmdW5jdGlvbiBhZGRUZXN0XG4gICAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gZmVhdHVyZSAtIFRoZSBzdHJpbmcgbmFtZSBvZiB0aGUgZmVhdHVyZSBkZXRlY3QsIG9yIGFuXG4gICAqIG9iamVjdCBvZiBmZWF0dXJlIGRldGVjdCBuYW1lcyBhbmQgdGVzdFxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufGJvb2xlYW59IHRlc3QgLSBGdW5jdGlvbiByZXR1cm5pbmcgdHJ1ZSBpZiBmZWF0dXJlIGlzIHN1cHBvcnRlZCxcbiAgICogZmFsc2UgaWYgbm90LiBPdGhlcndpc2UgYSBib29sZWFuIHJlcHJlc2VudGluZyB0aGUgcmVzdWx0cyBvZiBhIGZlYXR1cmUgZGV0ZWN0aW9uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIFRoZSBtb3N0IGNvbW1vbiB3YXkgb2YgY3JlYXRpbmcgeW91ciBvd24gZmVhdHVyZSBkZXRlY3RzIGlzIGJ5IGNhbGxpbmdcbiAgICogYE1vZGVybml6ci5hZGRUZXN0YCB3aXRoIGEgc3RyaW5nIChwcmVmZXJhYmx5IGp1c3QgbG93ZXJjYXNlLCB3aXRob3V0IGFueVxuICAgKiBwdW5jdHVhdGlvbiksIGFuZCBhIGZ1bmN0aW9uIHlvdSB3YW50IGV4ZWN1dGVkIHRoYXQgd2lsbCByZXR1cm4gYSBib29sZWFuIHJlc3VsdFxuICAgKlxuICAgKiBgYGBqc1xuICAgKiBNb2Rlcm5penIuYWRkVGVzdCgnaXRzVHVlc2RheScsIGZ1bmN0aW9uKCkge1xuICAgKiAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xuICAgKiAgcmV0dXJuIGQuZ2V0RGF5KCkgPT09IDI7XG4gICAqIH0pO1xuICAgKiBgYGBcbiAgICpcbiAgICogV2hlbiB0aGUgYWJvdmUgaXMgcnVuLCBpdCB3aWxsIHNldCBNb2Rlcm5penIuaXRzdHVlc2RheSB0byBgdHJ1ZWAgd2hlbiBpdCBpcyB0dWVzZGF5LFxuICAgKiBhbmQgdG8gYGZhbHNlYCBldmVyeSBvdGhlciBkYXkgb2YgdGhlIHdlZWsuIE9uZSB0aGluZyB0byBub3RpY2UgaXMgdGhhdCB0aGUgbmFtZXMgb2ZcbiAgICogZmVhdHVyZSBkZXRlY3QgZnVuY3Rpb25zIGFyZSBhbHdheXMgbG93ZXJjYXNlZCB3aGVuIGFkZGVkIHRvIHRoZSBNb2Rlcm5penIgb2JqZWN0LiBUaGF0XG4gICAqIG1lYW5zIHRoYXQgYE1vZGVybml6ci5pdHNUdWVzZGF5YCB3aWxsIG5vdCBleGlzdCwgYnV0IGBNb2Rlcm5penIuaXRzdHVlc2RheWAgd2lsbC5cbiAgICpcbiAgICpcbiAgICogIFNpbmNlIHdlIG9ubHkgbG9vayBhdCB0aGUgcmV0dXJuZWQgdmFsdWUgZnJvbSBhbnkgZmVhdHVyZSBkZXRlY3Rpb24gZnVuY3Rpb24sXG4gICAqICB5b3UgZG8gbm90IG5lZWQgdG8gYWN0dWFsbHkgdXNlIGEgZnVuY3Rpb24uIEZvciBzaW1wbGUgZGV0ZWN0aW9ucywganVzdCBwYXNzaW5nXG4gICAqICBpbiBhIHN0YXRlbWVudCB0aGF0IHdpbGwgcmV0dXJuIGEgYm9vbGVhbiB2YWx1ZSB3b3JrcyBqdXN0IGZpbmUuXG4gICAqXG4gICAqIGBgYGpzXG4gICAqIE1vZGVybml6ci5hZGRUZXN0KCdoYXNKcXVlcnknLCAnalF1ZXJ5JyBpbiB3aW5kb3cpO1xuICAgKiBgYGBcbiAgICpcbiAgICogSnVzdCBsaWtlIGJlZm9yZSwgd2hlbiB0aGUgYWJvdmUgcnVucyBgTW9kZXJuaXpyLmhhc2pxdWVyeWAgd2lsbCBiZSB0cnVlIGlmXG4gICAqIGpRdWVyeSBoYXMgYmVlbiBpbmNsdWRlZCBvbiB0aGUgcGFnZS4gTm90IHVzaW5nIGEgZnVuY3Rpb24gc2F2ZXMgYSBzbWFsbCBhbW91bnRcbiAgICogb2Ygb3ZlcmhlYWQgZm9yIHRoZSBicm93c2VyLCBhcyB3ZWxsIGFzIG1ha2luZyB5b3VyIGNvZGUgbXVjaCBtb3JlIHJlYWRhYmxlLlxuICAgKlxuICAgKiBGaW5hbGx5LCB5b3UgYWxzbyBoYXZlIHRoZSBhYmlsaXR5IHRvIHBhc3MgaW4gYW4gb2JqZWN0IG9mIGZlYXR1cmUgbmFtZXMgYW5kXG4gICAqIHRoZWlyIHRlc3RzLiBUaGlzIGlzIGhhbmR5IGlmIHlvdSB3YW50IHRvIGFkZCBtdWx0aXBsZSBkZXRlY3Rpb25zIGluIG9uZSBnby5cbiAgICogVGhlIGtleXMgc2hvdWxkIGFsd2F5cyBiZSBhIHN0cmluZywgYW5kIHRoZSB2YWx1ZSBjYW4gYmUgZWl0aGVyIGEgYm9vbGVhbiBvclxuICAgKiBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBib29sZWFuLlxuICAgKlxuICAgKiBgYGBqc1xuICAgKiB2YXIgZGV0ZWN0cyA9IHtcbiAgICogICdoYXNqcXVlcnknOiAnalF1ZXJ5JyBpbiB3aW5kb3csXG4gICAqICAnaXRzdHVlc2RheSc6IGZ1bmN0aW9uKCkge1xuICAgKiAgICB2YXIgZCA9IG5ldyBEYXRlKCk7XG4gICAqICAgIHJldHVybiBkLmdldERheSgpID09PSAyO1xuICAgKiAgfVxuICAgKiB9XG4gICAqXG4gICAqIE1vZGVybml6ci5hZGRUZXN0KGRldGVjdHMpO1xuICAgKiBgYGBcbiAgICpcbiAgICogVGhlcmUgaXMgcmVhbGx5IG5vIGRpZmZlcmVuY2UgYmV0d2VlbiB0aGUgZmlyc3QgbWV0aG9kcyBhbmQgdGhpcyBvbmUsIGl0IGlzXG4gICAqIGp1c3QgYSBjb252ZW5pZW5jZSB0byBsZXQgeW91IHdyaXRlIG1vcmUgcmVhZGFibGUgY29kZS5cbiAgICovXG5cbiAgZnVuY3Rpb24gYWRkVGVzdChmZWF0dXJlLCB0ZXN0KSB7XG5cbiAgICBpZiAodHlwZW9mIGZlYXR1cmUgPT0gJ29iamVjdCcpIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiBmZWF0dXJlKSB7XG4gICAgICAgIGlmIChoYXNPd25Qcm9wKGZlYXR1cmUsIGtleSkpIHtcbiAgICAgICAgICBhZGRUZXN0KGtleSwgZmVhdHVyZVsga2V5IF0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcblxuICAgICAgZmVhdHVyZSA9IGZlYXR1cmUudG9Mb3dlckNhc2UoKTtcbiAgICAgIHZhciBmZWF0dXJlTmFtZVNwbGl0ID0gZmVhdHVyZS5zcGxpdCgnLicpO1xuICAgICAgdmFyIGxhc3QgPSBNb2Rlcm5penJbZmVhdHVyZU5hbWVTcGxpdFswXV07XG5cbiAgICAgIC8vIEFnYWluLCB3ZSBkb24ndCBjaGVjayBmb3IgcGFyZW50IHRlc3QgZXhpc3RlbmNlLiBHZXQgdGhhdCByaWdodCwgdGhvdWdoLlxuICAgICAgaWYgKGZlYXR1cmVOYW1lU3BsaXQubGVuZ3RoID09IDIpIHtcbiAgICAgICAgbGFzdCA9IGxhc3RbZmVhdHVyZU5hbWVTcGxpdFsxXV07XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgbGFzdCAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAvLyB3ZSdyZSBnb2luZyB0byBxdWl0IGlmIHlvdSdyZSB0cnlpbmcgdG8gb3ZlcndyaXRlIGFuIGV4aXN0aW5nIHRlc3RcbiAgICAgICAgLy8gaWYgd2Ugd2VyZSB0byBhbGxvdyBpdCwgd2UnZCBkbyB0aGlzOlxuICAgICAgICAvLyAgIHZhciByZSA9IG5ldyBSZWdFeHAoXCJcXFxcYihuby0pP1wiICsgZmVhdHVyZSArIFwiXFxcXGJcIik7XG4gICAgICAgIC8vICAgZG9jRWxlbWVudC5jbGFzc05hbWUgPSBkb2NFbGVtZW50LmNsYXNzTmFtZS5yZXBsYWNlKCByZSwgJycgKTtcbiAgICAgICAgLy8gYnV0LCBubyBybHksIHN0dWZmICdlbS5cbiAgICAgICAgcmV0dXJuIE1vZGVybml6cjtcbiAgICAgIH1cblxuICAgICAgdGVzdCA9IHR5cGVvZiB0ZXN0ID09ICdmdW5jdGlvbicgPyB0ZXN0KCkgOiB0ZXN0O1xuXG4gICAgICAvLyBTZXQgdGhlIHZhbHVlICh0aGlzIGlzIHRoZSBtYWdpYywgcmlnaHQgaGVyZSkuXG4gICAgICBpZiAoZmVhdHVyZU5hbWVTcGxpdC5sZW5ndGggPT0gMSkge1xuICAgICAgICBNb2Rlcm5penJbZmVhdHVyZU5hbWVTcGxpdFswXV0gPSB0ZXN0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gY2FzdCB0byBhIEJvb2xlYW4sIGlmIG5vdCBvbmUgYWxyZWFkeVxuICAgICAgICBpZiAoTW9kZXJuaXpyW2ZlYXR1cmVOYW1lU3BsaXRbMF1dICYmICEoTW9kZXJuaXpyW2ZlYXR1cmVOYW1lU3BsaXRbMF1dIGluc3RhbmNlb2YgQm9vbGVhbikpIHtcbiAgICAgICAgICBNb2Rlcm5penJbZmVhdHVyZU5hbWVTcGxpdFswXV0gPSBuZXcgQm9vbGVhbihNb2Rlcm5penJbZmVhdHVyZU5hbWVTcGxpdFswXV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgTW9kZXJuaXpyW2ZlYXR1cmVOYW1lU3BsaXRbMF1dW2ZlYXR1cmVOYW1lU3BsaXRbMV1dID0gdGVzdDtcbiAgICAgIH1cblxuICAgICAgLy8gU2V0IGEgc2luZ2xlIGNsYXNzIChlaXRoZXIgYGZlYXR1cmVgIG9yIGBuby1mZWF0dXJlYClcbiAgICAgIHNldENsYXNzZXMoWyghIXRlc3QgJiYgdGVzdCAhPSBmYWxzZSA/ICcnIDogJ25vLScpICsgZmVhdHVyZU5hbWVTcGxpdC5qb2luKCctJyldKTtcblxuICAgICAgLy8gVHJpZ2dlciB0aGUgZXZlbnRcbiAgICAgIE1vZGVybml6ci5fdHJpZ2dlcihmZWF0dXJlLCB0ZXN0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gTW9kZXJuaXpyOyAvLyBhbGxvdyBjaGFpbmluZy5cbiAgfVxuXG4gIC8vIEFmdGVyIGFsbCB0aGUgdGVzdHMgYXJlIHJ1biwgYWRkIHNlbGYgdG8gdGhlIE1vZGVybml6ciBwcm90b3R5cGVcbiAgTW9kZXJuaXpyLl9xLnB1c2goZnVuY3Rpb24oKSB7XG4gICAgTW9kZXJuaXpyUHJvdG8uYWRkVGVzdCA9IGFkZFRlc3Q7XG4gIH0pO1xuXG4gIFxuXG4vKiFcbntcbiAgXCJuYW1lXCI6IFwic2l6ZXMgYXR0cmlidXRlXCIsXG4gIFwiYXN5bmNcIjogdHJ1ZSxcbiAgXCJwcm9wZXJ0eVwiOiBcInNpemVzXCIsXG4gIFwidGFnc1wiOiBbXCJpbWFnZVwiXSxcbiAgXCJhdXRob3JzXCI6IFtcIk1hdCBNYXJxdWlzXCJdLFxuICBcIm5vdGVzXCI6IFt7XG4gICAgXCJuYW1lXCI6IFwiU3BlY1wiLFxuICAgIFwiaHJlZlwiOiBcImh0dHA6Ly9waWN0dXJlLnJlc3BvbnNpdmVpbWFnZXMub3JnLyNwYXJzZS1zaXplcy1hdHRyXCJcbiAgICB9LHtcbiAgICBcIm5hbWVcIjogXCJVc2FnZSBEZXRhaWxzXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cDovL2VyaWNwb3J0aXMuY29tL3Bvc3RzLzIwMTQvc3Jjc2V0LXNpemVzL1wiXG4gICAgfV1cbn1cbiEqL1xuLyogRE9DXG5UZXN0IGZvciB0aGUgYHNpemVzYCBhdHRyaWJ1dGUgb24gaW1hZ2VzXG4qL1xuXG4gIE1vZGVybml6ci5hZGRBc3luY1Rlc3QoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHdpZHRoMSwgd2lkdGgyLCB0ZXN0O1xuICAgIHZhciBpbWFnZSA9IGNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIC8vIGluIGEgcGVyZmVjdCB3b3JsZCB0aGlzIHdvdWxkIGJlIHRoZSB0ZXN0Li4uXG4gICAgdmFyIGlzU2l6ZXMgPSAnc2l6ZXMnIGluIGltYWdlO1xuXG4gICAgLy8gLi4uIGJ1dCB3ZSBuZWVkIHRvIGRlYWwgd2l0aCBTYWZhcmkgOS4uLlxuICAgIGlmICghaXNTaXplcyAmJiAoJ3NyY3NldCcgaW4gIGltYWdlKSkge1xuICAgICAgd2lkdGgyID0gJ2RhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEFnQUJBUEFBQVAvLy93QUFBQ0g1QkFBQUFBQUFMQUFBQUFBQ0FBRUFBQUlDQkFvQU93PT0nO1xuICAgICAgd2lkdGgxID0gJ2RhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEFRQUJBQUFBQUNINUJBRUtBQUVBTEFBQUFBQUJBQUVBQUFJQ1RBRUFPdz09JztcblxuICAgICAgdGVzdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBhZGRUZXN0KCdzaXplcycsIGltYWdlLndpZHRoID09IDIpO1xuICAgICAgfTtcblxuICAgICAgaW1hZ2Uub25sb2FkID0gdGVzdDtcbiAgICAgIGltYWdlLm9uZXJyb3IgPSB0ZXN0O1xuICAgICAgaW1hZ2Uuc2V0QXR0cmlidXRlKCdzaXplcycsICc5cHgnKTtcblxuICAgICAgaW1hZ2Uuc3Jjc2V0ID0gd2lkdGgxICsgJyAxdywnICsgd2lkdGgyICsgJyA4dyc7XG4gICAgICBpbWFnZS5zcmMgPSB3aWR0aDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFkZFRlc3QoJ3NpemVzJywgaXNTaXplcyk7XG4gICAgfVxuICB9KTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcInNyY3NldCBhdHRyaWJ1dGVcIixcbiAgXCJwcm9wZXJ0eVwiOiBcInNyY3NldFwiLFxuICBcInRhZ3NcIjogW1wiaW1hZ2VcIl0sXG4gIFwibm90ZXNcIjogW3tcbiAgICBcIm5hbWVcIjogXCJTbWFzaGluZyBNYWdhemluZSBBcnRpY2xlXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQVBOR1wiXG4gICAgfSx7XG4gICAgXCJuYW1lXCI6IFwiR2VuZXJhdGUgbXVsdGktcmVzb2x1dGlvbiBpbWFnZXMgZm9yIHNyY3NldCB3aXRoIEdydW50XCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly9hZGR5b3NtYW5pLmNvbS9ibG9nL2dlbmVyYXRlLW11bHRpLXJlc29sdXRpb24taW1hZ2VzLWZvci1zcmNzZXQtd2l0aC1ncnVudC9cIlxuICAgIH1dXG59XG4hKi9cbi8qIERPQ1xuVGVzdCBmb3IgdGhlIHNyY3NldCBhdHRyaWJ1dGUgb2YgaW1hZ2VzXG4qL1xuXG4gIE1vZGVybml6ci5hZGRUZXN0KCdzcmNzZXQnLCAnc3Jjc2V0JyBpbiBjcmVhdGVFbGVtZW50KCdpbWcnKSk7XG5cbi8qIVxue1xuICBcIm5hbWVcIjogXCJKU09OXCIsXG4gIFwicHJvcGVydHlcIjogXCJqc29uXCIsXG4gIFwiY2FuaXVzZVwiOiBcImpzb25cIixcbiAgXCJub3Rlc1wiOiBbe1xuICAgIFwibmFtZVwiOiBcIk1ETiBkb2N1bWVudGF0aW9uXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9HbG9zc2FyeS9KU09OXCJcbiAgfV0sXG4gIFwicG9seWZpbGxzXCI6IFtcImpzb24yXCJdXG59XG4hKi9cbi8qIERPQ1xuRGV0ZWN0cyBuYXRpdmUgc3VwcG9ydCBmb3IgSlNPTiBoYW5kbGluZyBmdW5jdGlvbnMuXG4qL1xuXG4gIC8vIHRoaXMgd2lsbCBhbHNvIHN1Y2NlZWQgaWYgeW91J3ZlIGxvYWRlZCB0aGUgSlNPTjIuanMgcG9seWZpbGwgYWhlYWQgb2YgdGltZVxuICAvLyAgIC4uLiBidXQgdGhhdCBzaG91bGQgYmUgb2J2aW91cy4gOilcblxuICBNb2Rlcm5penIuYWRkVGVzdCgnanNvbicsICdKU09OJyBpbiB3aW5kb3cgJiYgJ3BhcnNlJyBpbiBKU09OICYmICdzdHJpbmdpZnknIGluIEpTT04pO1xuXG4vKiFcbntcbiAgXCJuYW1lXCI6IFwiWEhSIHJlc3BvbnNlVHlwZVwiLFxuICBcInByb3BlcnR5XCI6IFwieGhycmVzcG9uc2V0eXBlXCIsXG4gIFwidGFnc1wiOiBbXCJuZXR3b3JrXCJdLFxuICBcIm5vdGVzXCI6IFt7XG4gICAgXCJuYW1lXCI6IFwiWE1MSHR0cFJlcXVlc3QgTGl2aW5nIFN0YW5kYXJkXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly94aHIuc3BlYy53aGF0d2cub3JnLyN0aGUtcmVzcG9uc2V0eXBlLWF0dHJpYnV0ZVwiXG4gIH1dXG59XG4hKi9cbi8qIERPQ1xuVGVzdHMgZm9yIFhNTEh0dHBSZXF1ZXN0IHhoci5yZXNwb25zZVR5cGUuXG4qL1xuXG4gIE1vZGVybml6ci5hZGRUZXN0KCd4aHJyZXNwb25zZXR5cGUnLCAoZnVuY3Rpb24oKSB7XG4gICAgaWYgKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCA9PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgeGhyLm9wZW4oJ2dldCcsICcvJywgdHJ1ZSk7XG4gICAgcmV0dXJuICdyZXNwb25zZScgaW4geGhyO1xuICB9KCkpKTtcblxuXG4gIC8qKlxuICAgKiBodHRwOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy94aHItcmVzcG9uc2V0eXBlLWpzb24jY29tbWVudC00XG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKiBAZnVuY3Rpb24gdGVzdFhoclR5cGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgLSBTdHJpbmcgbmFtZSBvZiB0aGUgWEhSIHR5cGUgeW91IHdhbnQgdG8gZGV0ZWN0XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKiBAYXV0aG9yIE1hdGhpYXMgQnluZW5zXG4gICAqL1xuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIHZhciB0ZXN0WGhyVHlwZSA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICBpZiAodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ID09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB4aHIub3BlbignZ2V0JywgJy8nLCB0cnVlKTtcbiAgICB0cnkge1xuICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9IHR5cGU7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuICdyZXNwb25zZScgaW4geGhyICYmIHhoci5yZXNwb25zZVR5cGUgPT0gdHlwZTtcbiAgfTtcblxuICBcbi8qIVxue1xuICBcIm5hbWVcIjogXCJYSFIgcmVzcG9uc2VUeXBlPSdhcnJheWJ1ZmZlcidcIixcbiAgXCJwcm9wZXJ0eVwiOiBcInhocnJlc3BvbnNldHlwZWFycmF5YnVmZmVyXCIsXG4gIFwidGFnc1wiOiBbXCJuZXR3b3JrXCJdLFxuICBcIm5vdGVzXCI6IFt7XG4gICAgXCJuYW1lXCI6IFwiWE1MSHR0cFJlcXVlc3QgTGl2aW5nIFN0YW5kYXJkXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly94aHIuc3BlYy53aGF0d2cub3JnLyN0aGUtcmVzcG9uc2V0eXBlLWF0dHJpYnV0ZVwiXG4gIH1dXG59XG4hKi9cbi8qIERPQ1xuVGVzdHMgZm9yIFhNTEh0dHBSZXF1ZXN0IHhoci5yZXNwb25zZVR5cGU9J2FycmF5YnVmZmVyJy5cbiovXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ3hocnJlc3BvbnNldHlwZWFycmF5YnVmZmVyJywgdGVzdFhoclR5cGUoJ2FycmF5YnVmZmVyJykpO1xuXG4vKiFcbntcbiAgXCJuYW1lXCI6IFwiWEhSIHJlc3BvbnNlVHlwZT0nYmxvYidcIixcbiAgXCJwcm9wZXJ0eVwiOiBcInhocnJlc3BvbnNldHlwZWJsb2JcIixcbiAgXCJ0YWdzXCI6IFtcIm5ldHdvcmtcIl0sXG4gIFwibm90ZXNcIjogW3tcbiAgICBcIm5hbWVcIjogXCJYTUxIdHRwUmVxdWVzdCBMaXZpbmcgU3RhbmRhcmRcIixcbiAgICBcImhyZWZcIjogXCJodHRwczovL3hoci5zcGVjLndoYXR3Zy5vcmcvI3RoZS1yZXNwb25zZXR5cGUtYXR0cmlidXRlXCJcbiAgfV1cbn1cbiEqL1xuLyogRE9DXG5UZXN0cyBmb3IgWE1MSHR0cFJlcXVlc3QgeGhyLnJlc3BvbnNlVHlwZT0nYmxvYicuXG4qL1xuXG4gIE1vZGVybml6ci5hZGRUZXN0KCd4aHJyZXNwb25zZXR5cGVibG9iJywgdGVzdFhoclR5cGUoJ2Jsb2InKSk7XG5cbi8qIVxue1xuICBcIm5hbWVcIjogXCJYTUwgSFRUUCBSZXF1ZXN0IExldmVsIDIgWEhSMlwiLFxuICBcInByb3BlcnR5XCI6IFwieGhyMlwiLFxuICBcInRhZ3NcIjogW1wibmV0d29ya1wiXSxcbiAgXCJidWlsZGVyQWxpYXNlc1wiOiBbXCJuZXR3b3JrX3hocjJcIl0sXG4gIFwibm90ZXNcIjogW3tcbiAgICBcIm5hbWVcIjogXCJXMyBTcGVjXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly93d3cudzMub3JnL1RSL1hNTEh0dHBSZXF1ZXN0Mi9cIlxuICB9LHtcbiAgICBcIm5hbWVcIjogXCJEZXRhaWxzIG9uIFJlbGF0ZWQgR2l0aHViIElzc3VlXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL01vZGVybml6ci9Nb2Rlcm5penIvaXNzdWVzLzM4NVwiXG4gIH1dXG59XG4hKi9cbi8qIERPQ1xuVGVzdHMgZm9yIFhIUjIuXG4qL1xuXG4gIC8vIGFsbCB0aHJlZSBvZiB0aGVzZSBkZXRhaWxzIHJlcG9ydCBjb25zaXN0ZW50bHkgYWNyb3NzIGFsbCB0YXJnZXQgYnJvd3NlcnM6XG4gIC8vICAgISEod2luZG93LlByb2dyZXNzRXZlbnQpO1xuICAvLyAgICdYTUxIdHRwUmVxdWVzdCcgaW4gd2luZG93ICYmICd3aXRoQ3JlZGVudGlhbHMnIGluIG5ldyBYTUxIdHRwUmVxdWVzdFxuICBNb2Rlcm5penIuYWRkVGVzdCgneGhyMicsICdYTUxIdHRwUmVxdWVzdCcgaW4gd2luZG93ICYmICd3aXRoQ3JlZGVudGlhbHMnIGluIG5ldyBYTUxIdHRwUmVxdWVzdCgpKTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIlBhZ2UgVmlzaWJpbGl0eSBBUElcIixcbiAgXCJwcm9wZXJ0eVwiOiBcInBhZ2V2aXNpYmlsaXR5XCIsXG4gIFwiY2FuaXVzZVwiOiBcInBhZ2V2aXNpYmlsaXR5XCIsXG4gIFwidGFnc1wiOiBbXCJwZXJmb3JtYW5jZVwiXSxcbiAgXCJub3Rlc1wiOiBbe1xuICAgIFwibmFtZVwiOiBcIk1ETiBkb2N1bWVudGF0aW9uXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9ET00vVXNpbmdfdGhlX1BhZ2VfVmlzaWJpbGl0eV9BUElcIlxuICB9LHtcbiAgICBcIm5hbWVcIjogXCJXM0Mgc3BlY1wiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vd3d3LnczLm9yZy9UUi8yMDExL1dELXBhZ2UtdmlzaWJpbGl0eS0yMDExMDYwMi9cIlxuICB9LHtcbiAgICBcIm5hbWVcIjogXCJIVE1MNSBSb2NrcyB0dXRvcmlhbFwiLFxuICAgIFwiaHJlZlwiOiBcImh0dHA6Ly93d3cuaHRtbDVyb2Nrcy5jb20vZW4vdHV0b3JpYWxzL3BhZ2V2aXNpYmlsaXR5L2ludHJvL1wiXG4gIH1dLFxuICBcInBvbHlmaWxsc1wiOiBbXCJ2aXNpYmlsaXR5anNcIiwgXCJ2aXNpYmx5anNcIiwgXCJqcXVlcnktdmlzaWJpbGl0eVwiXVxufVxuISovXG4vKiBET0NcbkRldGVjdHMgc3VwcG9ydCBmb3IgdGhlIFBhZ2UgVmlzaWJpbGl0eSBBUEksIHdoaWNoIGNhbiBiZSB1c2VkIHRvIGRpc2FibGUgdW5uZWNlc3NhcnkgYWN0aW9ucyBhbmQgb3RoZXJ3aXNlIGltcHJvdmUgdXNlciBleHBlcmllbmNlLlxuKi9cblxuICBNb2Rlcm5penIuYWRkVGVzdCgncGFnZXZpc2liaWxpdHknLCAhIXByZWZpeGVkKCdoaWRkZW4nLCBkb2N1bWVudCwgZmFsc2UpKTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIk5hdmlnYXRpb24gVGltaW5nIEFQSVwiLFxuICBcInByb3BlcnR5XCI6IFwicGVyZm9ybWFuY2VcIixcbiAgXCJjYW5pdXNlXCI6IFwibmF2LXRpbWluZ1wiLFxuICBcInRhZ3NcIjogW1wicGVyZm9ybWFuY2VcIl0sXG4gIFwiYXV0aG9yc1wiOiBbXCJTY290dCBNdXJwaHkgKEB1eGRlcilcIl0sXG4gIFwibm90ZXNcIjogW3tcbiAgICBcIm5hbWVcIjogXCJXM0MgU3BlY1wiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vd3d3LnczLm9yZy9UUi9uYXZpZ2F0aW9uLXRpbWluZy9cIlxuICB9LHtcbiAgICBcIm5hbWVcIjogXCJIVE1MNSBSb2NrcyBhcnRpY2xlXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cDovL3d3dy5odG1sNXJvY2tzLmNvbS9lbi90dXRvcmlhbHMvd2VicGVyZm9ybWFuY2UvYmFzaWNzL1wiXG4gIH1dLFxuICBcInBvbHlmaWxsc1wiOiBbXCJwZXJmbm93XCJdXG59XG4hKi9cbi8qIERPQ1xuRGV0ZWN0cyBzdXBwb3J0IGZvciB0aGUgTmF2aWdhdGlvbiBUaW1pbmcgQVBJLCBmb3IgbWVhc3VyaW5nIGJyb3dzZXIgYW5kIGNvbm5lY3Rpb24gcGVyZm9ybWFuY2UuXG4qL1xuXG4gIE1vZGVybml6ci5hZGRUZXN0KCdwZXJmb3JtYW5jZScsICEhcHJlZml4ZWQoJ3BlcmZvcm1hbmNlJywgd2luZG93KSk7XG5cbi8qIVxue1xuICBcIm5hbWVcIjogXCJET00gUG9pbnRlciBFdmVudHMgQVBJXCIsXG4gIFwicHJvcGVydHlcIjogXCJwb2ludGVyZXZlbnRzXCIsXG4gIFwidGFnc1wiOiBbXCJpbnB1dFwiXSxcbiAgXCJhdXRob3JzXCI6IFtcIlN0dSBDb3hcIl0sXG4gIFwibm90ZXNcIjogW1xuICAgIHtcbiAgICAgIFwibmFtZVwiOiBcIlczQyBQb2ludGVyIEV2ZW50c1wiLFxuICAgICAgXCJocmVmXCI6IFwiaHR0cHM6Ly93d3cudzMub3JnL1RSL3BvaW50ZXJldmVudHMvXCJcbiAgICB9LHtcbiAgICAgIFwibmFtZVwiOiBcIlczQyBQb2ludGVyIEV2ZW50cyBMZXZlbCAyXCIsXG4gICAgICBcImhyZWZcIjogXCJodHRwczovL3d3dy53My5vcmcvVFIvcG9pbnRlcmV2ZW50czIvXCJcbiAgICB9LHtcbiAgICBcIm5hbWVcIjogXCJNRE4gZG9jdW1lbnRhdGlvblwiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Qb2ludGVyRXZlbnRcIlxuICB9XSxcbiAgXCJ3YXJuaW5nc1wiOiBbXCJUaGlzIHByb3BlcnR5IG5hbWUgbm93IHJlZmVycyB0byBXM0MgRE9NIFBvaW50ZXJFdmVudHM6IGh0dHBzOi8vZ2l0aHViLmNvbS9Nb2Rlcm5penIvTW9kZXJuaXpyL2lzc3Vlcy81NDgjaXNzdWVjb21tZW50LTEyODEyMDk5XCJdLFxuICBcInBvbHlmaWxsc1wiOiBbXCJwZXBcIl1cbn1cbiEqL1xuLyogRE9DXG5EZXRlY3RzIHN1cHBvcnQgZm9yIHRoZSBET00gUG9pbnRlciBFdmVudHMgQVBJLCB3aGljaCBwcm92aWRlcyBhIHVuaWZpZWQgZXZlbnQgaW50ZXJmYWNlIGZvciBwb2ludGluZyBpbnB1dCBkZXZpY2VzLCBhcyBpbXBsZW1lbnRlZCBpbiBJRTEwKywgRWRnZSBhbmQgQmxpbmsuXG4qL1xuXG4gIC8vICoqVGVzdCBuYW1lIGhpamFja2VkISoqXG4gIC8vIE5vdyByZWZlcnMgdG8gVzNDIERPTSBQb2ludGVyRXZlbnRzIHNwZWMgcmF0aGVyIHRoYW4gdGhlIENTUyBwb2ludGVyLWV2ZW50cyBwcm9wZXJ0eS5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ3BvaW50ZXJldmVudHMnLCBmdW5jdGlvbigpIHtcbiAgICAvLyBDYW5ub3QgdXNlIGAucHJlZml4ZWQoKWAgZm9yIGV2ZW50cywgc28gdGVzdCBlYWNoIHByZWZpeFxuICAgIHZhciBib29sID0gZmFsc2UsXG4gICAgICBpID0gZG9tUHJlZml4ZXMubGVuZ3RoO1xuXG4gICAgLy8gRG9uJ3QgZm9yZ2V0IHVuLXByZWZpeGVkLi4uXG4gICAgYm9vbCA9IE1vZGVybml6ci5oYXNFdmVudCgncG9pbnRlcmRvd24nKTtcblxuICAgIHdoaWxlIChpLS0gJiYgIWJvb2wpIHtcbiAgICAgIGlmIChoYXNFdmVudChkb21QcmVmaXhlc1tpXSArICdwb2ludGVyZG93bicpKSB7XG4gICAgICAgIGJvb2wgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYm9vbDtcbiAgfSk7XG5cbi8qIVxue1xuICBcIm5hbWVcIjogXCJwb3N0TWVzc2FnZVwiLFxuICBcInByb3BlcnR5XCI6IFwicG9zdG1lc3NhZ2VcIixcbiAgXCJjYW5pdXNlXCI6IFwieC1kb2MtbWVzc2FnaW5nXCIsXG4gIFwibm90ZXNcIjogW3tcbiAgICBcIm5hbWVcIjogXCJXM0MgU3BlY1wiLFxuICAgIFwiaHJlZlwiOiBcImh0dHA6Ly93d3cudzMub3JnL1RSL2h0bWw1L2NvbW1zLmh0bWwjcG9zdGluZy1tZXNzYWdlc1wiXG4gIH1dLFxuICBcInBvbHlmaWxsc1wiOiBbXCJlYXN5eGRtXCIsIFwicG9zdG1lc3NhZ2UtanF1ZXJ5XCJdXG59XG4hKi9cbi8qIERPQ1xuRGV0ZWN0cyBzdXBwb3J0IGZvciB0aGUgYHdpbmRvdy5wb3N0TWVzc2FnZWAgcHJvdG9jb2wgZm9yIGNyb3NzLWRvY3VtZW50IG1lc3NhZ2luZy5cbiovXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ3Bvc3RtZXNzYWdlJywgJ3Bvc3RNZXNzYWdlJyBpbiB3aW5kb3cpO1xuXG4vKiFcbntcbiAgXCJuYW1lXCI6IFwiUXVlcnlTZWxlY3RvclwiLFxuICBcInByb3BlcnR5XCI6IFwicXVlcnlzZWxlY3RvclwiLFxuICBcImNhbml1c2VcIjogXCJxdWVyeXNlbGVjdG9yXCIsXG4gIFwidGFnc1wiOiBbXCJxdWVyeXNlbGVjdG9yXCJdLFxuICBcImF1dGhvcnNcIjogW1wiQW5kcmV3IEJldHRzIChAdHJpYmxvbmRvbilcIl0sXG4gIFwibm90ZXNcIjogW3tcbiAgICBcIm5hbWVcIiA6IFwiVzNDIFNlbGVjdG9ycyByZWZlcmVuY2VcIixcbiAgICBcImhyZWZcIjogXCJodHRwczovL3d3dy53My5vcmcvVFIvc2VsZWN0b3JzLWFwaS8jcXVlcnlzZWxlY3RvcmFsbFwiXG4gIH1dLFxuICBcInBvbHlmaWxsc1wiOiBbXCJjc3Mtc2VsZWN0b3ItZW5naW5lXCJdXG59XG4hKi9cbi8qIERPQ1xuRGV0ZWN0cyBzdXBwb3J0IGZvciBxdWVyeVNlbGVjdG9yLlxuKi9cblxuICBNb2Rlcm5penIuYWRkVGVzdCgncXVlcnlzZWxlY3RvcicsICdxdWVyeVNlbGVjdG9yJyBpbiBkb2N1bWVudCAmJiAncXVlcnlTZWxlY3RvckFsbCcgaW4gZG9jdW1lbnQpO1xuXG4vKiFcbntcbiAgXCJuYW1lXCI6IFwicmVxdWVzdEFuaW1hdGlvbkZyYW1lXCIsXG4gIFwicHJvcGVydHlcIjogXCJyZXF1ZXN0YW5pbWF0aW9uZnJhbWVcIixcbiAgXCJhbGlhc2VzXCI6IFtcInJhZlwiXSxcbiAgXCJjYW5pdXNlXCI6IFwicmVxdWVzdGFuaW1hdGlvbmZyYW1lXCIsXG4gIFwidGFnc1wiOiBbXCJhbmltYXRpb25cIl0sXG4gIFwiYXV0aG9yc1wiOiBbXCJBZGR5IE9zbWFuaVwiXSxcbiAgXCJub3Rlc1wiOiBbe1xuICAgIFwibmFtZVwiOiBcIlczQyBzcGVjXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly93d3cudzMub3JnL1RSL2FuaW1hdGlvbi10aW1pbmcvXCJcbiAgfV0sXG4gIFwicG9seWZpbGxzXCI6IFtcInJhZlwiXVxufVxuISovXG4vKiBET0NcbkRldGVjdHMgc3VwcG9ydCBmb3IgdGhlIGB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lYCBBUEksIGZvciBvZmZsb2FkaW5nIGFuaW1hdGlvbiByZXBhaW50aW5nIHRvIHRoZSBicm93c2VyIGZvciBvcHRpbWl6ZWQgcGVyZm9ybWFuY2UuXG4qL1xuXG4gIE1vZGVybml6ci5hZGRUZXN0KCdyZXF1ZXN0YW5pbWF0aW9uZnJhbWUnLCAhIXByZWZpeGVkKCdyZXF1ZXN0QW5pbWF0aW9uRnJhbWUnLCB3aW5kb3cpLCB7YWxpYXNlczogWydyYWYnXX0pO1xuXG4vKiFcbntcbiAgXCJuYW1lXCI6IFwic2NyaXB0W2FzeW5jXVwiLFxuICBcInByb3BlcnR5XCI6IFwic2NyaXB0YXN5bmNcIixcbiAgXCJjYW5pdXNlXCI6IFwic2NyaXB0LWFzeW5jXCIsXG4gIFwidGFnc1wiOiBbXCJzY3JpcHRcIl0sXG4gIFwiYnVpbGRlckFsaWFzZXNcIjogW1wic2NyaXB0X2FzeW5jXCJdLFxuICBcImF1dGhvcnNcIjogW1wiVGhlb2Rvb3IgdmFuIERvbmdlXCJdXG59XG4hKi9cbi8qIERPQ1xuRGV0ZWN0cyBzdXBwb3J0IGZvciB0aGUgYGFzeW5jYCBhdHRyaWJ1dGUgb24gdGhlIGA8c2NyaXB0PmAgZWxlbWVudC5cbiovXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ3NjcmlwdGFzeW5jJywgJ2FzeW5jJyBpbiBjcmVhdGVFbGVtZW50KCdzY3JpcHQnKSk7XG5cbi8qIVxue1xuICBcIm5hbWVcIjogXCJzY3JpcHRbZGVmZXJdXCIsXG4gIFwicHJvcGVydHlcIjogXCJzY3JpcHRkZWZlclwiLFxuICBcImNhbml1c2VcIjogXCJzY3JpcHQtZGVmZXJcIixcbiAgXCJ0YWdzXCI6IFtcInNjcmlwdFwiXSxcbiAgXCJidWlsZGVyQWxpYXNlc1wiOiBbXCJzY3JpcHRfZGVmZXJcIl0sXG4gIFwiYXV0aG9yc1wiOiBbXCJUaGVvZG9vciB2YW4gRG9uZ2VcIl0sXG4gIFwid2FybmluZ3NcIjogW1wiQnJvd3NlciBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgYGRlZmVyYCBhdHRyaWJ1dGUgdmFyeTogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzk1MjAwOS9kZWZlci1hdHRyaWJ1dGUtY2hyb21lI2Fuc3dlci0zOTgyNjE5XCJdLFxuICBcImtub3duQnVnc1wiOiBbXCJGYWxzZSBwb3NpdGl2ZSBpbiBPcGVyYSAxMlwiXVxufVxuISovXG4vKiBET0NcbkRldGVjdHMgc3VwcG9ydCBmb3IgdGhlIGBkZWZlcmAgYXR0cmlidXRlIG9uIHRoZSBgPHNjcmlwdD5gIGVsZW1lbnQuXG4qL1xuXG4gIE1vZGVybml6ci5hZGRUZXN0KCdzY3JpcHRkZWZlcicsICdkZWZlcicgaW4gY3JlYXRlRWxlbWVudCgnc2NyaXB0JykpO1xuXG4vKiFcbntcbiAgXCJuYW1lXCI6IFwiU1ZHXCIsXG4gIFwicHJvcGVydHlcIjogXCJzdmdcIixcbiAgXCJjYW5pdXNlXCI6IFwic3ZnXCIsXG4gIFwidGFnc1wiOiBbXCJzdmdcIl0sXG4gIFwiYXV0aG9yc1wiOiBbXCJFcmlrIERhaGxzdHJvbVwiXSxcbiAgXCJwb2x5ZmlsbHNcIjogW1xuICAgIFwic3Znd2ViXCIsXG4gICAgXCJyYXBoYWVsXCIsXG4gICAgXCJhbXBsZXNka1wiLFxuICAgIFwiY2FudmdcIixcbiAgICBcInN2Zy1ib2lsZXJwbGF0ZVwiLFxuICAgIFwic2llXCIsXG4gICAgXCJkb2pvZ2Z4XCIsXG4gICAgXCJmYWJyaWNqc1wiXG4gIF1cbn1cbiEqL1xuLyogRE9DXG5EZXRlY3RzIHN1cHBvcnQgZm9yIFNWRyBpbiBgPGVtYmVkPmAgb3IgYDxvYmplY3Q+YCBlbGVtZW50cy5cbiovXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ3N2ZycsICEhZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TICYmICEhZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdzdmcnKS5jcmVhdGVTVkdSZWN0KTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIlNWRyBhcyBhbiA8aW1nPiB0YWcgc291cmNlXCIsXG4gIFwicHJvcGVydHlcIjogXCJzdmdhc2ltZ1wiLFxuICBcImNhbml1c2VcIiA6IFwic3ZnLWltZ1wiLFxuICBcInRhZ3NcIjogW1wic3ZnXCJdLFxuICBcImFsaWFzZXNcIjogW1wic3ZnaW5jc3NcIl0sXG4gIFwiYXV0aG9yc1wiOiBbXCJDaHJpcyBDb3lpZXJcIl0sXG4gIFwibm90ZXNcIjogW3tcbiAgICBcIm5hbWVcIjogXCJIVE1MNSBTcGVjXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cDovL3d3dy53My5vcmcvVFIvaHRtbDUvZW1iZWRkZWQtY29udGVudC0wLmh0bWwjdGhlLWltZy1lbGVtZW50XCJcbiAgfV1cbn1cbiEqL1xuXG5cbiAgLy8gT3JpZ2luYWwgQXN5bmMgdGVzdCBieSBTdHUgQ294XG4gIC8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2NocmlzY295aWVyLzg3NzQ1MDFcblxuICAvLyBOb3cgYSBTeW5jIHRlc3QgYmFzZWQgb24gZ29vZCByZXN1bHRzIGhlcmVcbiAgLy8gaHR0cDovL2NvZGVwZW4uaW8vY2hyaXNjb3lpZXIvcGVuL2JBREZ4XG5cbiAgLy8gTm90ZSBodHRwOi8vd3d3LnczLm9yZy9UUi9TVkcxMS9mZWF0dXJlI0ltYWdlIGlzICpzdXBwb3NlZCogdG8gcmVwcmVzZW50XG4gIC8vIHN1cHBvcnQgZm9yIHRoZSBgPGltYWdlPmAgdGFnIGluIFNWRywgbm90IGFuIFNWRyBmaWxlIGxpbmtlZCBmcm9tIGFuIGA8aW1nPmBcbiAgLy8gdGFnIGluIEhUTUwg4oCTIGJ1dCBpdOKAmXMgYSBoZXVyaXN0aWMgd2hpY2ggd29ya3NcbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ3N2Z2FzaW1nJywgZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uaGFzRmVhdHVyZSgnaHR0cDovL3d3dy53My5vcmcvVFIvU1ZHMTEvZmVhdHVyZSNJbWFnZScsICcxLjEnKSk7XG5cblxuICAvKipcbiAgICogT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyBjYW4gYmUgdXNlZCB3aXRoIGV2ZXJ5IG9iamVjdCBhbmQgYWxsb3dzIHlvdSB0b1xuICAgKiBnZXQgaXRzIGNsYXNzIGVhc2lseS4gQWJzdHJhY3RpbmcgaXQgb2ZmIG9mIGFuIG9iamVjdCBwcmV2ZW50cyBzaXR1YXRpb25zXG4gICAqIHdoZXJlIHRoZSB0b1N0cmluZyBwcm9wZXJ0eSBoYXMgYmVlbiBvdmVycmlkZGVuXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKiBAZnVuY3Rpb24gdG9TdHJpbmdGblxuICAgKiBAcmV0dXJucyB7ZnVuY3Rpb259IEFuIGFic3RyYWN0ZWQgdG9TdHJpbmcgZnVuY3Rpb25cbiAgICovXG5cbiAgdmFyIHRvU3RyaW5nRm4gPSAoe30pLnRvU3RyaW5nO1xuICBcbi8qIVxue1xuICBcIm5hbWVcIjogXCJTVkcgY2xpcCBwYXRoc1wiLFxuICBcInByb3BlcnR5XCI6IFwic3ZnY2xpcHBhdGhzXCIsXG4gIFwidGFnc1wiOiBbXCJzdmdcIl0sXG4gIFwibm90ZXNcIjogW3tcbiAgICBcIm5hbWVcIjogXCJEZW1vXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cDovL3NydWZhY3VsdHkuc3J1LmVkdS9kYXZpZC5kYWlsZXkvc3ZnL25ld3N0dWZmL2NsaXBQYXRoNC5zdmdcIlxuICB9XVxufVxuISovXG4vKiBET0NcbkRldGVjdHMgc3VwcG9ydCBmb3IgY2xpcCBwYXRocyBpbiBTVkcgKG9ubHksIG5vdCBvbiBIVE1MIGNvbnRlbnQpLlxuXG5TZWUgW3RoaXMgZGlzY3Vzc2lvbl0oaHR0cHM6Ly9naXRodWIuY29tL01vZGVybml6ci9Nb2Rlcm5penIvaXNzdWVzLzIxMykgcmVnYXJkaW5nIGFwcGx5aW5nIFNWRyBjbGlwIHBhdGhzIHRvIEhUTUwgY29udGVudC5cbiovXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ3N2Z2NsaXBwYXRocycsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAhIWRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyAmJlxuICAgICAgL1NWR0NsaXBQYXRoLy50ZXN0KHRvU3RyaW5nRm4uY2FsbChkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ2NsaXBQYXRoJykpKTtcbiAgfSk7XG5cbi8qIVxue1xuICBcIm5hbWVcIjogXCJTVkcgZmlsdGVyc1wiLFxuICBcInByb3BlcnR5XCI6IFwic3ZnZmlsdGVyc1wiLFxuICBcImNhbml1c2VcIjogXCJzdmctZmlsdGVyc1wiLFxuICBcInRhZ3NcIjogW1wic3ZnXCJdLFxuICBcImJ1aWxkZXJBbGlhc2VzXCI6IFtcInN2Z19maWx0ZXJzXCJdLFxuICBcImF1dGhvcnNcIjogW1wiRXJpayBEYWhsc3Ryb21cIl0sXG4gIFwibm90ZXNcIjogW3tcbiAgICBcIm5hbWVcIjogXCJXM0MgU3BlY1wiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vd3d3LnczLm9yZy9UUi9TVkcxMS9maWx0ZXJzLmh0bWxcIlxuICB9XVxufVxuISovXG5cbiAgLy8gU2hvdWxkIGZhaWwgaW4gU2FmYXJpOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy85NzM5OTU1L2ZlYXR1cmUtZGV0ZWN0aW5nLXN1cHBvcnQtZm9yLXN2Zy1maWx0ZXJzLlxuICBNb2Rlcm5penIuYWRkVGVzdCgnc3ZnZmlsdGVycycsIGZ1bmN0aW9uKCkge1xuICAgIHZhciByZXN1bHQgPSBmYWxzZTtcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gJ1NWR0ZFQ29sb3JNYXRyaXhFbGVtZW50JyBpbiB3aW5kb3cgJiZcbiAgICAgICAgU1ZHRkVDb2xvck1hdHJpeEVsZW1lbnQuU1ZHX0ZFQ09MT1JNQVRSSVhfVFlQRV9TQVRVUkFURSA9PSAyO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge31cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9KTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIlNWRyBmb3JlaWduT2JqZWN0XCIsXG4gIFwicHJvcGVydHlcIjogXCJzdmdmb3JlaWdub2JqZWN0XCIsXG4gIFwidGFnc1wiOiBbXCJzdmdcIl0sXG4gIFwibm90ZXNcIjogW3tcbiAgICBcIm5hbWVcIjogXCJXM0MgU3BlY1wiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vd3d3LnczLm9yZy9UUi9TVkcxMS9leHRlbmQuaHRtbFwiXG4gIH1dXG59XG4hKi9cbi8qIERPQ1xuRGV0ZWN0cyBzdXBwb3J0IGZvciBmb3JlaWduT2JqZWN0IHRhZyBpbiBTVkcuXG4qL1xuXG4gIE1vZGVybml6ci5hZGRUZXN0KCdzdmdmb3JlaWdub2JqZWN0JywgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICEhZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TICYmXG4gICAgICAvU1ZHRm9yZWlnbk9iamVjdC8udGVzdCh0b1N0cmluZ0ZuLmNhbGwoZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdmb3JlaWduT2JqZWN0JykpKTtcbiAgfSk7XG5cbi8qIVxue1xuICBcIm5hbWVcIjogXCJJbmxpbmUgU1ZHXCIsXG4gIFwicHJvcGVydHlcIjogXCJpbmxpbmVzdmdcIixcbiAgXCJjYW5pdXNlXCI6IFwic3ZnLWh0bWw1XCIsXG4gIFwidGFnc1wiOiBbXCJzdmdcIl0sXG4gIFwibm90ZXNcIjogW3tcbiAgICBcIm5hbWVcIjogXCJUZXN0IHBhZ2VcIixcbiAgICBcImhyZWZcIjogXCJodHRwczovL3BhdWxpcmlzaC5jb20vZGVtby9pbmxpbmUtc3ZnXCJcbiAgfSwge1xuICAgIFwibmFtZVwiOiBcIlRlc3QgcGFnZSBhbmQgcmVzdWx0c1wiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vY29kZXBlbi5pby9lbHRvbm1lc3F1aXRhL2Z1bGwvR2dYYnZvL1wiXG4gIH1dLFxuICBcInBvbHlmaWxsc1wiOiBbXCJpbmxpbmUtc3ZnLXBvbHlmaWxsXCJdLFxuICBcImtub3duQnVnc1wiOiBbXCJGYWxzZSBuZWdhdGl2ZSBvbiBzb21lIENocm9taWEgYnJvd3NlcnMuXCJdXG59XG4hKi9cbi8qIERPQ1xuRGV0ZWN0cyBzdXBwb3J0IGZvciBpbmxpbmUgU1ZHIGluIEhUTUwgKG5vdCB3aXRoaW4gWEhUTUwpLlxuKi9cblxuICBNb2Rlcm5penIuYWRkVGVzdCgnaW5saW5lc3ZnJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIGRpdiA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5pbm5lckhUTUwgPSAnPHN2Zy8+JztcbiAgICByZXR1cm4gKHR5cGVvZiBTVkdSZWN0ICE9ICd1bmRlZmluZWQnICYmIGRpdi5maXJzdENoaWxkICYmIGRpdi5maXJzdENoaWxkLm5hbWVzcGFjZVVSSSkgPT0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJztcbiAgfSk7XG5cbi8qIVxue1xuICBcIm5hbWVcIjogXCJTVkcgU01JTCBhbmltYXRpb25cIixcbiAgXCJwcm9wZXJ0eVwiOiBcInNtaWxcIixcbiAgXCJjYW5pdXNlXCI6IFwic3ZnLXNtaWxcIixcbiAgXCJ0YWdzXCI6IFtcInN2Z1wiXSxcbiAgXCJub3Rlc1wiOiBbe1xuICBcIm5hbWVcIjogXCJXM0MgU3luY2hyb25pc2VkIE11bHRpbWVkaWEgc3BlY1wiLFxuICBcImhyZWZcIjogXCJodHRwczovL3d3dy53My5vcmcvQXVkaW9WaWRlby9cIlxuICB9XVxufVxuISovXG5cbiAgLy8gU1ZHIFNNSUwgYW5pbWF0aW9uXG4gIE1vZGVybml6ci5hZGRUZXN0KCdzbWlsJywgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICEhZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TICYmXG4gICAgICAvU1ZHQW5pbWF0ZS8udGVzdCh0b1N0cmluZ0ZuLmNhbGwoZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdhbmltYXRlJykpKTtcbiAgfSk7XG5cbi8qIVxue1xuICBcIm5hbWVcIjogXCJUZW1wbGF0ZSBzdHJpbmdzXCIsXG4gIFwicHJvcGVydHlcIjogXCJ0ZW1wbGF0ZXN0cmluZ3NcIixcbiAgXCJub3Rlc1wiOiBbe1xuICAgIFwibmFtZVwiOiBcIk1ETiBSZWZlcmVuY2VcIixcbiAgICBcImhyZWZcIjogXCJodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS90ZW1wbGF0ZV9zdHJpbmdzI0Jyb3dzZXJfY29tcGF0aWJpbGl0eVwiXG4gIH1dXG59XG4hKi9cbi8qIERPQ1xuVGVtcGxhdGUgc3RyaW5ncyBhcmUgc3RyaW5nIGxpdGVyYWxzIGFsbG93aW5nIGVtYmVkZGVkIGV4cHJlc3Npb25zLlxuKi9cblxuICBNb2Rlcm5penIuYWRkVGVzdCgndGVtcGxhdGVzdHJpbmdzJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN1cHBvcnRzO1xuICAgIHRyeSB7XG4gICAgICAvLyBBIG51bWJlciBvZiB0b29scywgaW5jbHVkaW5nIHVnbGlmeWpzIGFuZCByZXF1aXJlLCBicmVhayBvbiBhIHJhdyBcImBcIiwgc29cbiAgICAgIC8vIHVzZSBhbiBldmFsIHRvIGdldCBhcm91bmQgdGhhdC5cbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgICAgZXZhbCgnYGAnKTtcbiAgICAgIHN1cHBvcnRzID0gdHJ1ZTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICAgIHJldHVybiAhIXN1cHBvcnRzO1xuICB9KTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIkJsb2IgVVJMc1wiLFxuICBcInByb3BlcnR5XCI6IFwiYmxvYnVybHNcIixcbiAgXCJjYW5pdXNlXCI6IFwiYmxvYnVybHNcIixcbiAgXCJub3Rlc1wiOiBbe1xuICAgIFwibmFtZVwiOiBcIlczQyBXb3JraW5nIERyYWZ0XCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly93d3cudzMub3JnL1RSL0ZpbGVBUEkvI2NyZWF0aW5nLXJldm9raW5nXCJcbiAgfV0sXG4gIFwidGFnc1wiOiBbXCJmaWxlXCIsIFwidXJsXCJdLFxuICBcImF1dGhvcnNcIjogW1wiUm9uIFdhbGRvbiAoQGpva2V5cmh5bWUpXCJdXG59XG4hKi9cbi8qIERPQ1xuRGV0ZWN0cyBzdXBwb3J0IGZvciBjcmVhdGluZyBCbG9iIFVSTHNcbiovXG5cbiAgdmFyIHVybCA9IHByZWZpeGVkKCdVUkwnLCB3aW5kb3csIGZhbHNlKTtcbiAgdXJsID0gdXJsICYmIHdpbmRvd1t1cmxdO1xuICBNb2Rlcm5penIuYWRkVGVzdCgnYmxvYnVybHMnLCB1cmwgJiYgJ3Jldm9rZU9iamVjdFVSTCcgaW4gdXJsICYmICdjcmVhdGVPYmplY3RVUkwnIGluIHVybCk7XG5cbi8qIVxue1xuICBcIm5hbWVcIjogXCJEYXRhIFVSSVwiLFxuICBcInByb3BlcnR5XCI6IFwiZGF0YXVyaVwiLFxuICBcImNhbml1c2VcIjogXCJkYXRhdXJpXCIsXG4gIFwidGFnc1wiOiBbXCJ1cmxcIl0sXG4gIFwiYnVpbGRlckFsaWFzZXNcIjogW1widXJsX2RhdGFfdXJpXCJdLFxuICBcImFzeW5jXCI6IHRydWUsXG4gIFwibm90ZXNcIjogW3tcbiAgICBcIm5hbWVcIjogXCJXaWtpcGVkaWEgYXJ0aWNsZVwiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0RhdGFfVVJJX3NjaGVtZVwiXG4gIH1dLFxuICBcIndhcm5pbmdzXCI6IFtcIlN1cHBvcnQgaW4gSW50ZXJuZXQgRXhwbG9yZXIgOCBpcyBsaW1pdGVkIHRvIGltYWdlcyBhbmQgbGlua2VkIHJlc291cmNlcyBsaWtlIENTUyBmaWxlcywgbm90IEhUTUwgZmlsZXNcIl1cbn1cbiEqL1xuLyogRE9DXG5EZXRlY3RzIHN1cHBvcnQgZm9yIGRhdGEgVVJJcy4gUHJvdmlkZXMgYSBzdWJwcm9wZXJ0eSB0byByZXBvcnQgc3VwcG9ydCBmb3IgZGF0YSBVUklzIG92ZXIgMzJrYiBpbiBzaXplOlxuXG5gYGBqYXZhc2NyaXB0XG5Nb2Rlcm5penIuZGF0YXVyaSAgICAgICAgICAgLy8gdHJ1ZVxuTW9kZXJuaXpyLmRhdGF1cmkub3ZlcjMya2IgIC8vIGZhbHNlIGluIElFOFxuYGBgXG4qL1xuXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9Nb2Rlcm5penIvTW9kZXJuaXpyL2lzc3Vlcy8xNFxuICBNb2Rlcm5penIuYWRkQXN5bmNUZXN0KGZ1bmN0aW9uKCkge1xuXG4gICAgLy8gSUU3IHRocm93IGEgbWl4ZWQgY29udGVudCB3YXJuaW5nIG9uIEhUVFBTIGZvciB0aGlzIHRlc3QsIHNvIHdlJ2xsXG4gICAgLy8ganVzdCBibGFja2xpc3QgaXQgKHdlIGtub3cgaXQgZG9lc24ndCBzdXBwb3J0IGRhdGEgVVJJcyBhbnl3YXkpXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL01vZGVybml6ci9Nb2Rlcm5penIvaXNzdWVzLzM2MlxuICAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ01TSUUgNy4nKSAhPT0gLTEpIHtcbiAgICAgIC8vIEtlZXAgdGhlIHRlc3QgYXN5bmNcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGFkZFRlc3QoJ2RhdGF1cmknLCBmYWxzZSk7XG4gICAgICB9LCAxMCk7XG4gICAgfVxuXG4gICAgdmFyIGRhdGF1cmkgPSBuZXcgSW1hZ2UoKTtcblxuICAgIGRhdGF1cmkub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgYWRkVGVzdCgnZGF0YXVyaScsIGZhbHNlKTtcbiAgICB9O1xuICAgIGRhdGF1cmkub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoZGF0YXVyaS53aWR0aCA9PSAxICYmIGRhdGF1cmkuaGVpZ2h0ID09IDEpIHtcbiAgICAgICAgdGVzdE92ZXIzMmtiKCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgYWRkVGVzdCgnZGF0YXVyaScsIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZGF0YXVyaS5zcmMgPSAnZGF0YTppbWFnZS9naWY7YmFzZTY0LFIwbEdPRGxoQVFBQkFJQUFBQUFBQVAvLy95d0FBQUFBQVFBQkFBQUNBVXdBT3c9PSc7XG5cbiAgICAvLyBPbmNlIHdlIGhhdmUgZGF0YXVyaSwgbGV0J3MgY2hlY2sgdG8gc2VlIGlmIHdlIGNhbiB1c2UgZGF0YSBVUklzIG92ZXJcbiAgICAvLyAzMmtiIChJRTggY2FuJ3QpLiBodHRwczovL2dpdGh1Yi5jb20vTW9kZXJuaXpyL01vZGVybml6ci9pc3N1ZXMvMzIxXG4gICAgZnVuY3Rpb24gdGVzdE92ZXIzMmtiKCkge1xuXG4gICAgICB2YXIgZGF0YXVyaUJpZyA9IG5ldyBJbWFnZSgpO1xuXG4gICAgICBkYXRhdXJpQmlnLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgYWRkVGVzdCgnZGF0YXVyaScsIHRydWUpO1xuICAgICAgICBNb2Rlcm5penIuZGF0YXVyaSA9IG5ldyBCb29sZWFuKHRydWUpO1xuICAgICAgICBNb2Rlcm5penIuZGF0YXVyaS5vdmVyMzJrYiA9IGZhbHNlO1xuICAgICAgfTtcbiAgICAgIGRhdGF1cmlCaWcub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGFkZFRlc3QoJ2RhdGF1cmknLCB0cnVlKTtcbiAgICAgICAgTW9kZXJuaXpyLmRhdGF1cmkgPSBuZXcgQm9vbGVhbih0cnVlKTtcbiAgICAgICAgTW9kZXJuaXpyLmRhdGF1cmkub3ZlcjMya2IgPSAoZGF0YXVyaUJpZy53aWR0aCA9PSAxICYmIGRhdGF1cmlCaWcuaGVpZ2h0ID09IDEpO1xuICAgICAgfTtcblxuICAgICAgdmFyIGJhc2U2NHN0ciA9ICdSMGxHT0RsaEFRQUJBSUFBQUFBQUFQLy8veXdBQUFBQUFRQUJBQUFDQVV3QU93PT0nO1xuICAgICAgd2hpbGUgKGJhc2U2NHN0ci5sZW5ndGggPCAzMzAwMCkge1xuICAgICAgICBiYXNlNjRzdHIgPSAnXFxyXFxuJyArIGJhc2U2NHN0cjtcbiAgICAgIH1cbiAgICAgIGRhdGF1cmlCaWcuc3JjID0gJ2RhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCwnICsgYmFzZTY0c3RyO1xuICAgIH1cblxuICB9KTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIkhUTUw1IFZpZGVvXCIsXG4gIFwicHJvcGVydHlcIjogXCJ2aWRlb1wiLFxuICBcImNhbml1c2VcIjogXCJ2aWRlb1wiLFxuICBcInRhZ3NcIjogW1wiaHRtbDVcIl0sXG4gIFwia25vd25CdWdzXCI6IFtcbiAgICBcIldpdGhvdXQgUXVpY2tUaW1lLCBgTW9kZXJuaXpyLnZpZGVvLmgyNjRgIHdpbGwgYmUgYHVuZGVmaW5lZGA7IGh0dHBzOi8vZ2l0aHViLmNvbS9Nb2Rlcm5penIvTW9kZXJuaXpyL2lzc3Vlcy81NDZcIlxuICBdLFxuICBcInBvbHlmaWxsc1wiOiBbXG4gICAgXCJodG1sNW1lZGlhXCIsXG4gICAgXCJtZWRpYWVsZW1lbnRqc1wiLFxuICAgIFwic3VibGltZXZpZGVvXCIsXG4gICAgXCJ2aWRlb2pzXCIsXG4gICAgXCJsZWFuYmFja3BsYXllclwiLFxuICAgIFwidmlkZW9mb3JldmVyeWJvZHlcIlxuICBdXG59XG4hKi9cbi8qIERPQ1xuRGV0ZWN0cyBzdXBwb3J0IGZvciB0aGUgdmlkZW8gZWxlbWVudCwgYXMgd2VsbCBhcyB0ZXN0aW5nIHdoYXQgdHlwZXMgb2YgY29udGVudCBpdCBzdXBwb3J0cy5cblxuU3VicHJvcGVydGllcyBhcmUgcHJvdmlkZWQgdG8gZGVzY3JpYmUgc3VwcG9ydCBmb3IgYG9nZ2AsIGBoMjY0YCBhbmQgYHdlYm1gIGZvcm1hdHMsIGUuZy46XG5cbmBgYGphdmFzY3JpcHRcbk1vZGVybml6ci52aWRlbyAgICAgICAgIC8vIHRydWVcbk1vZGVybml6ci52aWRlby5vZ2cgICAgIC8vICdwcm9iYWJseSdcbmBgYFxuKi9cblxuICAvLyBDb2RlYyB2YWx1ZXMgZnJvbSA6IGdpdGh1Yi5jb20vTmllbHNMZWVuaGVlci9odG1sNXRlc3QvYmxvYi85MTA2YTgvaW5kZXguaHRtbCNMODQ1XG4gIC8vICAgICAgICAgICAgICAgICAgICAgdGh4IHRvIE5pZWxzTGVlbmhlZXIgYW5kIHpjb3JwYW5cblxuICAvLyBOb3RlOiBpbiBzb21lIG9sZGVyIGJyb3dzZXJzLCBcIm5vXCIgd2FzIGEgcmV0dXJuIHZhbHVlIGluc3RlYWQgb2YgZW1wdHkgc3RyaW5nLlxuICAvLyAgIEl0IHdhcyBsaXZlIGluIEZGMy41LjAgYW5kIDMuNS4xLCBidXQgZml4ZWQgaW4gMy41LjJcbiAgLy8gICBJdCB3YXMgYWxzbyBsaXZlIGluIFNhZmFyaSA0LjAuMCAtIDQuMC40LCBidXQgZml4ZWQgaW4gNC4wLjVcblxuICBNb2Rlcm5penIuYWRkVGVzdCgndmlkZW8nLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgZWxlbSA9IGNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJyk7XG4gICAgdmFyIGJvb2wgPSBmYWxzZTtcblxuICAgIC8vIElFOSBSdW5uaW5nIG9uIFdpbmRvd3MgU2VydmVyIFNLVSBjYW4gY2F1c2UgYW4gZXhjZXB0aW9uIHRvIGJlIHRocm93biwgYnVnICMyMjRcbiAgICB0cnkge1xuICAgICAgYm9vbCA9ICEhZWxlbS5jYW5QbGF5VHlwZVxuICAgICAgaWYgKGJvb2wpIHtcbiAgICAgICAgYm9vbCA9IG5ldyBCb29sZWFuKGJvb2wpO1xuICAgICAgICBib29sLm9nZyA9IGVsZW0uY2FuUGxheVR5cGUoJ3ZpZGVvL29nZzsgY29kZWNzPVwidGhlb3JhXCInKS5yZXBsYWNlKC9ebm8kLywgJycpO1xuXG4gICAgICAgIC8vIFdpdGhvdXQgUXVpY2tUaW1lLCB0aGlzIHZhbHVlIHdpbGwgYmUgYHVuZGVmaW5lZGAuIGdpdGh1Yi5jb20vTW9kZXJuaXpyL01vZGVybml6ci9pc3N1ZXMvNTQ2XG4gICAgICAgIGJvb2wuaDI2NCA9IGVsZW0uY2FuUGxheVR5cGUoJ3ZpZGVvL21wNDsgY29kZWNzPVwiYXZjMS40MkUwMUVcIicpLnJlcGxhY2UoL15ubyQvLCAnJyk7XG5cbiAgICAgICAgYm9vbC53ZWJtID0gZWxlbS5jYW5QbGF5VHlwZSgndmlkZW8vd2VibTsgY29kZWNzPVwidnA4LCB2b3JiaXNcIicpLnJlcGxhY2UoL15ubyQvLCAnJyk7XG5cbiAgICAgICAgYm9vbC52cDkgPSBlbGVtLmNhblBsYXlUeXBlKCd2aWRlby93ZWJtOyBjb2RlY3M9XCJ2cDlcIicpLnJlcGxhY2UoL15ubyQvLCAnJyk7XG5cbiAgICAgICAgYm9vbC5obHMgPSBlbGVtLmNhblBsYXlUeXBlKCdhcHBsaWNhdGlvbi94LW1wZWdVUkw7IGNvZGVjcz1cImF2YzEuNDJFMDFFXCInKS5yZXBsYWNlKC9ebm8kLywgJycpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHt9XG5cbiAgICByZXR1cm4gYm9vbDtcbiAgfSk7XG5cbi8qIVxue1xuICBcIm5hbWVcIjogXCJWaWRlbyBBdXRvcGxheVwiLFxuICBcInByb3BlcnR5XCI6IFwidmlkZW9hdXRvcGxheVwiLFxuICBcInRhZ3NcIjogW1widmlkZW9cIl0sXG4gIFwiYXN5bmNcIiA6IHRydWUsXG4gIFwid2FybmluZ3NcIjogW1wiVGhpcyB0ZXN0IGlzIHZlcnkgbGFyZ2Ug4oCTIG9ubHkgaW5jbHVkZSBpdCBpZiB5b3UgYWJzb2x1dGVseSBuZWVkIGl0XCJdLFxuICBcImtub3duQnVnc1wiOiBbXCJjcmFzaGVzIHdpdGggYW4gYWxlcnQgb24gaU9TNyB3aGVuIGFkZGVkIHRvIGhvbWVzY3JlZW5cIl1cbn1cbiEqL1xuLyogRE9DXG5DaGVja3MgZm9yIHN1cHBvcnQgb2YgdGhlIGF1dG9wbGF5IGF0dHJpYnV0ZSBvZiB0aGUgdmlkZW8gZWxlbWVudC5cbiovXG5cblxuICBNb2Rlcm5penIuYWRkQXN5bmNUZXN0KGZ1bmN0aW9uKCkge1xuICAgIHZhciB0aW1lb3V0O1xuICAgIHZhciB3YWl0VGltZSA9IDIwMDtcbiAgICB2YXIgcmV0cmllcyA9IDU7XG4gICAgdmFyIGN1cnJlbnRUcnkgPSAwO1xuICAgIHZhciBlbGVtID0gY3JlYXRlRWxlbWVudCgndmlkZW8nKTtcbiAgICB2YXIgZWxlbVN0eWxlID0gZWxlbS5zdHlsZTtcblxuICAgIGZ1bmN0aW9uIHRlc3RBdXRvcGxheShhcmcpIHtcbiAgICAgIGN1cnJlbnRUcnkrKztcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcblxuICAgICAgdmFyIHJlc3VsdCA9IGFyZyAmJiBhcmcudHlwZSA9PT0gJ3BsYXlpbmcnIHx8IGVsZW0uY3VycmVudFRpbWUgIT09IDA7XG5cbiAgICAgIGlmICghcmVzdWx0ICYmIGN1cnJlbnRUcnkgPCByZXRyaWVzKSB7XG4gICAgICAgIC8vRGV0ZWN0aW9uIGNhbiBiZSBmbGFreSBpZiB0aGUgYnJvd3NlciBpcyBzbG93LCBzbyBsZXRzIHJldHJ5IGluIGEgbGl0dGxlIGJpdFxuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dCh0ZXN0QXV0b3BsYXksIHdhaXRUaW1lKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBlbGVtLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BsYXlpbmcnLCB0ZXN0QXV0b3BsYXksIGZhbHNlKTtcbiAgICAgIGFkZFRlc3QoJ3ZpZGVvYXV0b3BsYXknLCByZXN1bHQpO1xuXG4gICAgICAvLyBDbGVhbnVwLCBidXQgZG9uJ3QgYXNzdW1lIGVsZW0gaXMgc3RpbGwgaW4gdGhlIHBhZ2UgLVxuICAgICAgLy8gYW4gZXh0ZW5zaW9uIChlZyBGbGFzaGJsb2NrKSBtYXkgYWxyZWFkeSBoYXZlIHJlbW92ZWQgaXQuXG4gICAgICBpZiAoZWxlbS5wYXJlbnROb2RlKSB7XG4gICAgICAgIGVsZW0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvL3NraXAgdGhlIHRlc3QgaWYgdmlkZW8gaXRzZWxmLCBvciB0aGUgYXV0b3BsYXlcbiAgICAvL2VsZW1lbnQgb24gaXQgaXNuJ3Qgc3VwcG9ydGVkXG4gICAgaWYgKCFNb2Rlcm5penIudmlkZW8gfHwgISgnYXV0b3BsYXknIGluIGVsZW0pKSB7XG4gICAgICBhZGRUZXN0KCd2aWRlb2F1dG9wbGF5JywgZmFsc2UpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGVsZW1TdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgZWxlbVN0eWxlLmhlaWdodCA9IDA7XG4gICAgZWxlbVN0eWxlLndpZHRoID0gMDtcblxuICAgIHRyeSB7XG4gICAgICBpZiAoTW9kZXJuaXpyLnZpZGVvLm9nZykge1xuICAgICAgICBlbGVtLnNyYyA9ICdkYXRhOnZpZGVvL29nZztiYXNlNjQsVDJkblV3QUNBQUFBQUFBQUFBQm1uQ0FUQUFBQUFIREVpeFlCS29CMGFHVnZjbUVEQWdFQUFRQUJBQUFRQUFBUUFBQUFBQUFGQUFBQUFRQUFBQUFBQUFBQUFHSUFZRTluWjFNQUFBQUFBQUFBQUFBQVpwd2dFd0VBQUFBQ3JBN1REbGovLy8vLy8vLy8vLy8vLy8rUWdYUm9aVzl5WVNzQUFBQllhWEJvTGs5eVp5QnNhV0owYUdWdmNtRWdNUzR4SURJd01Ea3dPREl5SUNoVWFIVnpibVZzWkdFcEFRQUFBQm9BQUFCRlRrTlBSRVZTUFdabWJYQmxaekowYUdWdmNtRXRNQzR5T1lKMGFHVnZjbUcrelNqM3VjMXJHTFdwU1VvUWM1em1NWXhTbEtRaENER01ZaENFSVFoQUFBQUFBQUFBQUFBQUVXMnVVMmVTeVB4V0V2eDRPVnRzNWlyMWFLdFVLQk1wSkZvUS9uazVtNDFtVXdsNHNsVXBrNGtrZ2hrSWZEd2RqZ2FqUVlDOFZpb1VDUVJpSVFoOFBCd01oZ0xCUUlnNEZSYmE1VFo1TEkvRllTL0hnNVcyem1LdlZvcTFRb0V5a2tXaEQrZVRtYmpXWlRDWGl5VlNtVGlTU0NHUWg4UEIyT0JxTkJnTHhXS2hRSkJHSWhDSHc4SEF5R0FzRkFpRGdVQ3c4UER3OFBEdzhQRHc4UER3OFBEdzhQRHc4UER3OFBEdzhQRHc4UER3OFBEdzhQRHc4UER3OFBEdzhQRHc4UER3OFBEdzhQRHc4UER3OFBEdzhQRHc4UERBd1BFaFFVRlEwTkRoRVNGUlVVRGc0UEVoUVZGUlVPRUJFVEZCVVZGUkFSRkJVVkZSVVZFaE1VRlJVVkZSVVVGUlVWRlJVVkZSVVZGUlVWRlJVVkVBd0xFQlFaR3h3TkRRNFNGUndjR3c0TkVCUVpIQndjRGhBVEZoc2RIUndSRXhrY0hCNGVIUlFZR3h3ZEhoNGRHeHdkSFI0ZUhoNGRIUjBkSGg0ZUhSQUxDaEFZS0RNOURBd09FeG82UERjT0RSQVlLRGxGT0E0UkZoMHpWMUErRWhZbE9rUnRaMDBZSXpkQVVXaHhYREZBVGxkbmVYaGxTRnhmWW5Ca1oyTVRFeE1URXhNVEV4TVRFeE1URXhNVEV4TVRFeE1URXhNVEV4TVRFeE1URXhNVEV4TVRFeE1URXhNVEV4TVRFeE1URXhNVEV4TVRFeE1URXhNVEV4TVRFaElWR1JvYUdob1NGQllhR2hvYUdoVVdHUm9hR2hvYUdSb2FHaG9hR2hvYUdob2FHaG9hR2hvYUdob2FHaG9hR2hvYUdob2FHaG9hR2hvYUdob2FHaEVTRmg4a0pDUWtFaFFZSWlRa0pDUVdHQ0VrSkNRa0pCOGlKQ1FrSkNRa0pDUWtKQ1FrSkNRa0pDUWtKQ1FrSkNRa0pDUWtKQ1FrSkNRa0pDUWtKQ1FSRWhndlkyTmpZeElWR2tKalkyTmpHQm80WTJOalkyTXZRbU5qWTJOalkyTmpZMk5qWTJOalkyTmpZMk5qWTJOalkyTmpZMk5qWTJOalkyTmpZMk5qRlJVVkZSVVZGUlVWRlJVVkZSVVZGUlVWRlJVVkZSVVZGUlVWRlJVVkZSVVZGUlVWRlJVVkZSVVZGUlVWRlJVVkZSVVZGUlVWRlJVVkZSVVZGUlVWRlJJU0VoVVhHQmtiRWhJVkZ4Z1pHeHdTRlJjWUdSc2NIUlVYR0JrYkhCMGRGeGdaR3h3ZEhSMFlHUnNjSFIwZEhoa2JIQjBkSFI0ZUd4d2RIUjBlSGg0UkVSRVVGeG9jSUJFUkZCY2FIQ0FpRVJRWEdod2dJaVVVRnhvY0lDSWxKUmNhSENBaUpTVWxHaHdnSWlVbEpTa2NJQ0lsSlNVcEtpQWlKU1VsS1NvcUVCQVFGQmdjSUNnUUVCUVlIQ0FvTUJBVUdCd2dLREJBRkJnY0lDZ3dRRUFZSENBb01FQkFRQndnS0RCQVFFQmdJQ2d3UUVCQVlJQW9NRUJBUUdDQWdBZkY1Y2RIMWUzT3cvTDY2d0dtWW5mSVVid2RVVGUzTE1SYnFPTjhCKzVSSkV2Y0d4a3ZyVlVqVE1yc1hZaEFuSXdlMGRUSmZPWWJXckRZeXFVcno3ZHcvSk80aHBtVjJMc1FRdmtVZUdxMUJzWkx4K2N1NWlWMGUwZVNjSjkxVklRWXJtcWZkVlNLN0dnak9VMG9QYVBPdTVJY0RLMW1Odm5EK0s4THdTODdmOEp4Mm1IdEhuVWtUR0F1cldabE5RYTc0WkxTRkg5b0Y2RlBHeHpMc2pRTzVRZTBlZGNwdHRkN0JYQlNxTUNMNGsvNHRGckhJUHVFUTdtMS91SVdrYkRNV1ZvRGRPU3VSUTkyODZrdlZVbFFqek9FNlZyTmd1TjRvUlhZR2tnY25paDd0MTMvOWt4dkxZS1FlendMVHJPNDRzVm1NUGdNcU9SbzFFMHNtMS85U2x1ZGtjV0h3Zkp3VFN5YlI0TGVBejZ1Z1dWZ1JhWThtVi85U2x1UW10SHJ6c0J0UkYvd1BZK1gwSnVZVHMrbHRnclhBbWxrMTB4UUhtVHU5VlNJQWsxK3ZjdlU0bWwyb056ck5oRXRRM0N5c05QOFVlUjM1d3FwS1VCZEdkWk1Talg0V1ZpOG5KcGRwSG5iaHpFSWR4N213ZjZXMUZLQWl1Y01YcldVV1ZqeVJmMjNjaE50UjltSXpEb1QvNlpMWWFpbEFqaEZsWnV2UHRTZVorMm9SRXViRG9XbVQzVGd1WStKSFBkUlZTTEt4ZktIM3ZnTnFKLzllbWVFWWlrR1hERk56YUxqdlRlR0FMNjFtb2dPb2VHM3k2b1U0clc1NXlkb2owbFVUU1IvbW1SaFBtRjg2dXdJZnpwM0Z0aXVmUUNtcHBhSERsR0UwcjJpVHpYSXczekJxNWh2YVRsZGpHNENQYjl3ZHhBbWUwU3llZFZLY3pKOUF0WWJnUE96WUtKdlpaSW1zTjdlY3J4V1pnNWRSNlpMai9qNHFwV3NJQSt2WXdFK1RjYTlvdW5NSXNyWE1CNFN0aWliMlNQUXRaditGVklwZkVienY4bmNab0xCWGMzWUJxVEcxSHNza1RUb3RaT1lURytvVlVqTGs2emhQOGJnNFJoTVVOdGZaZE83RmRwQnVYemhKNUZoOElLbEpHN3d0RDlpazhyV09KeHk2aVEzTnd6QnBRMjE5bWx5ditGTGljWXMyaUpHU0UwdTJ0eHplZCsrRDYxWldDaUhEL2NaZFFWQ3FrTzJnSnBkcE5hT2JobkRmQVByVDg5UnhkV0ZaNWhPM01zZUJTSWxBTnBwZFpOSVYvUndlNWVMVER2a2ZXS3pGbkgrUUo3bTlRV1YxS2R3bnVJd1ROdFpkSk1vWEJmNzRPaFJuaDJ0K09UR0wrQVZVbklreVlZK1FHN2c5aXRIWHlGM09JeWdHMnMya3VkNjc5WldLcVNGYTluM0lIRDZNZUx2MWxaMFh5ZHVSaGlEUnRyTm5Lb3lpRlZMY0JtMGJhNVl5M2ZRa0RoNFhzRkUzNGlzVnBPenBhOW5SOGlDcFM0SG94RzJySnBuUmhmM1lib1ZhMVBjUm91aDVMSUp2L3VRY1BOZDA5NWlja1RhaUdCbldMS1ZXUmMwT25ZVFN5ZXgvbjJGb2ZFUG5ERzh5M1B6dEhyek9MSzF4bzZSQW1sMms5b3dLYWpPQzBXcjRENXgrM25BMFVFaEsybTE5OHd1QkhGM3psV1dWS1dMTjFDSHpMQ2xVZnVvWUJjeDRiMWxscGVCS21iYXlhUjU4bmp0RTlvbkQ2NmxVY3NnMFNwbTJzbnNiKzhIYUpSbjRkWWNMYkN1QnVZd3ppQjgvNVUxQzFET096MmdaalNadHJMSms2dnJMRjNod1k0SW85eHVUL3J1VUZSU0JrTnRVelRPV2hqaDI2aXJMRVB4NGpQWkwzRm8zUXJSZW9HVFRNMjF4WVRUOW9GZGhUVUl2anFUa2ZrdnQwYnpnVlVqcS9oT1lZOGo2MElhTy8wQXpSQnRxa1RTNlI1ZWxsWmQ1dUtkenpoYjhCRmxEZEFjcndrRTByYlhUT1BCKzdZMEZsWk85NnFGTDRZa2cyMVN0SnM4cUlXN2gxNkg1aEdpdjhWMkNmbGF1N1FWRGVwVEFIYTZMZ3Q2ZmVpRXZKRE0yMVN0SnNtT0gvaHluVVJyS3h2VXBROEJIMEpGN0JpeUcycVpwbkwvN0FPVTY2Z3QrcmVMRVhZOHBWT0NRdlNzQnRxWlROTThiazlvaFJjd0QxOG8vV1ZrYnZyY2VWS1JiOUk1OUlFS3lzakJlVE1tbWJBMjF4dS82aUhhZExSeHVJemtMcGk4d1pZbW1iYldpMzJSVkFVanJ1eFdsSi8vaUZ4RTM4Rkk5aE5LT29DZGh3ZjVmRGU0eFo4MWxnUkVoSzJtMWo3OHZXMUNxa3VNdS9BakJOSzIxMGt6UlVYL0IrNjljTU1VRzViWXJJZVp4VlNFWklTbWt6YlhPaTl5eHdJZlBnZHNvdjdSNzF4dUo3ckZjQUNqRy85UHpBcHFGcTd3RWd6TkptMnN1V0VTUHV3clF2ZWpqN2NiblF4TWt4cG0yMWxVWUpMMGZLbW9nUFBxeXduN2UzRnZCL0ZDTnhQSjg1aVZVa0NFOS90TEt4MzFHNENnTnRXVFRQRmhNdmx1OEc0L1RyZ2FadHRUQ2hsamZOSkdnT1QyWDZFcXBFVHkydFlkOWNDQkk0bElYSjEvM3VWVWxsWkVKejRiYXFHRjY0eXhhWit6UExZd2RlOFVxbjFvS0FOdFVyU2FUT1BIa2h2dVFQM2JCbEVKL0xGZTRwcVFPSFVJOFQ4cTdBWHgzZkxWQmdTQ1ZwTWJhNTVZeE4zcnY4VTFEdjUxYkFQU09MbFpXZWJrTDh2U01HSTIxbEptbWVWeFBSd0ZsWkYxQ3BxQ044dUx3eW1hWnlqYlhIQ1J5dG9nUE4zby9uNzRDTnlrZlQrcXFSdjVBUWxIY1J4WXJDNUt2R21iYlV3bVpZLzI5QnZGNkMxLzkzeDRXVmdsWERMRnBtYmFwbUY4OUhLVG9nUndxcVNsR2J1K29pQWtjV0Zia2xDNlpoZitOdFRMRnBuOG9XeitIc05SVlNnSXhaV09OK3lWeUpsRTV0cS8rR1dMVE11dFlYOWVrVHlTRVFQTFZOUVEzT2Z5Y3dKQk0wek50WmNzZTdDdmNLSTBWL3poMTZEcjlPU0EyMU1wbW1jckhDKzZwVEFQSFB3b2l0M0xISHFzN2poRk5SRDZXOCtFQkdvU0VvYVp0dFRDWmxqZmR1SC9mRmlzbitkUkJHQVpZdE16YlZNd3Z1bC9UL2NySzFOUWg4Z04wU1JSYTljT3V4NmNsQzAvbURMRnBtYmFybUY4L2U2Q29wZU9MQ05XNlMvSVVVZzNqSklZaUFjRG9NY0dlUmJPdnVUUGpYUi90eW83OUxLM2txcWtieGtrTVJBT0IwR09EUEl0blgzSm54cm8vMjVVZCtsbGJ5VlZTTjR5U0dJZ0hBNkRIQm5rV3pyN2t6NDEwZjdjcU8vU3l0NUtxcEZWSnduNmdCRXZCTTB6TnRaY3BHT0VQaXlzVzh2dlJkMlIwZjdndGpocVV2WEwrZ1dWd0htNFhKREJpTXBtbVp0ckxmUHdkL0l1Z1A1K2ZLVlN5c0gxRVhyZUZBY0VoZWxHbWJiVW1aWTRYZG8xdlFXVm5LMTlQNFJ1RW5iZjBnUW5SK2xEQ1psaXZOTTIydDFFU21vcFBJZ2ZUMGR1T2ZRcnNqZ0c0dFB4bGkwekptRjV0cmRMMUpEVUlVVDFaWFNxUURlUjRCOG1YM1RyUnJvLzJNY0dlVXZMdHdvNmpJRUtNa0NVWFdzTHlaUk9kOVAvckZZTnRYUEJsaTB6Mzk4aVZVbFZLQWpGbFk0MzdKWEltVVRtMnIvNFpZdE15NjFoZjE2UlBKSVU5bloxTUFCQXdBQUFBQUFBQUFacHdnRXdJQUFBQmhwNjU4QlNjQUFBQUFBQURuVUZCUVhJREdYTGh3dHR0TkhEaHc1T2NwUVJNRVRCRXdSUGR1eWxLVkIwSFJkRjBBJztcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKE1vZGVybml6ci52aWRlby5oMjY0KSB7XG4gICAgICAgIGVsZW0uc3JjID0gJ2RhdGE6dmlkZW8vbXA0O2Jhc2U2NCxBQUFBSUdaMGVYQnBjMjl0QUFBQ0FHbHpiMjFwYzI4eVlYWmpNVzF3TkRFQUFBQUlabkpsWlFBQUFzMXRaR0YwQUFBQ3JnWUYvLytxM0VYcHZlYlpTTGVXTE5nZzJTUHU3M2d5TmpRZ0xTQmpiM0psSURFME9DQnlNall3TVNCaE1HTmtOMlF6SUMwZ1NDNHlOalF2VFZCRlJ5MDBJRUZXUXlCamIyUmxZeUF0SUVOdmNIbHNaV1owSURJd01ETXRNakF4TlNBdElHaDBkSEE2THk5M2QzY3VkbWxrWlc5c1lXNHViM0puTDNneU5qUXVhSFJ0YkNBdElHOXdkR2x2Ym5NNklHTmhZbUZqUFRFZ2NtVm1QVE1nWkdWaWJHOWphejB4T2pBNk1DQmhibUZzZVhObFBUQjRNem93ZURFeE15QnRaVDFvWlhnZ2MzVmliV1U5TnlCd2MzazlNU0J3YzNsZmNtUTlNUzR3TURvd0xqQXdJRzFwZUdWa1gzSmxaajB4SUcxbFgzSmhibWRsUFRFMklHTm9jbTl0WVY5dFpUMHhJSFJ5Wld4c2FYTTlNU0E0ZURoa1kzUTlNU0JqY1cwOU1DQmtaV0ZrZW05dVpUMHlNU3d4TVNCbVlYTjBYM0J6YTJsd1BURWdZMmh5YjIxaFgzRndYMjltWm5ObGREMHRNaUIwYUhKbFlXUnpQVEVnYkc5dmEyRm9aV0ZrWDNSb2NtVmhaSE05TVNCemJHbGpaV1JmZEdoeVpXRmtjejB3SUc1eVBUQWdaR1ZqYVcxaGRHVTlNU0JwYm5SbGNteGhZMlZrUFRBZ1lteDFjbUY1WDJOdmJYQmhkRDB3SUdOdmJuTjBjbUZwYm1Wa1gybHVkSEpoUFRBZ1ltWnlZVzFsY3oweklHSmZjSGx5WVcxcFpEMHlJR0pmWVdSaGNIUTlNU0JpWDJKcFlYTTlNQ0JrYVhKbFkzUTlNU0IzWldsbmFIUmlQVEVnYjNCbGJsOW5iM0E5TUNCM1pXbG5hSFJ3UFRJZ2EyVjVhVzUwUFRJMU1DQnJaWGxwYm5SZmJXbHVQVEV3SUhOalpXNWxZM1YwUFRRd0lHbHVkSEpoWDNKbFpuSmxjMmc5TUNCeVkxOXNiMjlyWVdobFlXUTlOREFnY21NOVkzSm1JRzFpZEhKbFpUMHhJR055WmoweU15NHdJSEZqYjIxd1BUQXVOakFnY1hCdGFXNDlNQ0J4Y0cxaGVEMDJPU0J4Y0hOMFpYQTlOQ0JwY0Y5eVlYUnBiejB4TGpRd0lHRnhQVEU2TVM0d01BQ0FBQUFBRDJXSWhBQTMvLzcyOFA0Rk5qdVpRUUFBQXU1dGIyOTJBQUFBYkcxMmFHUUFBQUFBQUFBQUFBQUFBQUFBQUFQb0FBQUFaQUFCQUFBQkFBQUFBQUFBQUFBQUFBQUFBUUFBQUFBQUFBQUFBQUFBQUFBQUFBRUFBQUFBQUFBQUFBQUFBQUFBQUVBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUNBQUFDR0hSeVlXc0FBQUJjZEd0b1pBQUFBQU1BQUFBQUFBQUFBQUFBQUFFQUFBQUFBQUFBWkFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQVFBQUFBQUFBQUFBQUFBQUFBQUFBQUVBQUFBQUFBQUFBQUFBQUFBQUFFQUFBQUFBQWdBQUFBSUFBQUFBQUNSbFpIUnpBQUFBSEdWc2MzUUFBQUFBQUFBQUFRQUFBR1FBQUFBQUFBRUFBQUFBQVpCdFpHbGhBQUFBSUcxa2FHUUFBQUFBQUFBQUFBQUFBQUFBQUNnQUFBQUVBRlhFQUFBQUFBQXRhR1JzY2dBQUFBQUFBQUFBZG1sa1pRQUFBQUFBQUFBQUFBQUFBRlpwWkdWdlNHRnVaR3hsY2dBQUFBRTdiV2x1WmdBQUFCUjJiV2hrQUFBQUFRQUFBQUFBQUFBQUFBQUFKR1JwYm1ZQUFBQWNaSEpsWmdBQUFBQUFBQUFCQUFBQURIVnliQ0FBQUFBQkFBQUErM04wWW13QUFBQ1hjM1J6WkFBQUFBQUFBQUFCQUFBQWgyRjJZekVBQUFBQUFBQUFBUUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBZ0FDQUVnQUFBQklBQUFBQUFBQUFBRUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBWS8vOEFBQUF4WVhaalF3RmtBQXIvNFFBWVoyUUFDcXpaWDRpSWhBQUFBd0FFQUFBREFGQThTSlpZQVFBR2FPdmp5eUxBQUFBQUdITjBkSE1BQUFBQUFBQUFBUUFBQUFFQUFBUUFBQUFBSEhOMGMyTUFBQUFBQUFBQUFRQUFBQUVBQUFBQkFBQUFBUUFBQUJSemRITjZBQUFBQUFBQUFzVUFBQUFCQUFBQUZITjBZMjhBQUFBQUFBQUFBUUFBQURBQUFBQmlkV1IwWVFBQUFGcHRaWFJoQUFBQUFBQUFBQ0ZvWkd4eUFBQUFBQUFBQUFCdFpHbHlZWEJ3YkFBQUFBQUFBQUFBQUFBQUFDMXBiSE4wQUFBQUphbDBiMjhBQUFBZFpHRjBZUUFBQUFFQUFBQUFUR0YyWmpVMkxqUXdMakV3TVE9PSc7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgYWRkVGVzdCgndmlkZW9hdXRvcGxheScsIGZhbHNlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNhdGNoIChlKSB7XG4gICAgICBhZGRUZXN0KCd2aWRlb2F1dG9wbGF5JywgZmFsc2UpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGVsZW0uc2V0QXR0cmlidXRlKCdhdXRvcGxheScsICcnKTtcbiAgICBlbGVtU3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5Om5vbmUnO1xuICAgIGRvY0VsZW1lbnQuYXBwZW5kQ2hpbGQoZWxlbSk7XG4gICAgLy8gd2FpdCBmb3IgdGhlIG5leHQgdGljayB0byBhZGQgdGhlIGxpc3RlbmVyLCBvdGhlcndpc2UgdGhlIGVsZW1lbnQgbWF5XG4gICAgLy8gbm90IGhhdmUgdGltZSB0byBwbGF5IGluIGhpZ2ggbG9hZCBzaXR1YXRpb25zIChlLmcuIHRoZSB0ZXN0IHN1aXRlKVxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXlpbmcnLCB0ZXN0QXV0b3BsYXksIGZhbHNlKTtcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KHRlc3RBdXRvcGxheSwgd2FpdFRpbWUpO1xuICAgIH0sIDApO1xuICB9KTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIlZpZGVvIExvb3AgQXR0cmlidXRlXCIsXG4gIFwicHJvcGVydHlcIjogXCJ2aWRlb2xvb3BcIixcbiAgXCJ0YWdzXCI6IFtcInZpZGVvXCIsIFwibWVkaWFcIl1cbn1cbiEqL1xuXG4gIE1vZGVybml6ci5hZGRUZXN0KCd2aWRlb2xvb3AnLCAnbG9vcCcgaW4gY3JlYXRlRWxlbWVudCgndmlkZW8nKSk7XG5cbi8qIVxue1xuICBcIm5hbWVcIjogXCJWaWRlbyBQcmVsb2FkIEF0dHJpYnV0ZVwiLFxuICBcInByb3BlcnR5XCI6IFwidmlkZW9wcmVsb2FkXCIsXG4gIFwidGFnc1wiOiBbXCJ2aWRlb1wiLCBcIm1lZGlhXCJdXG59XG4hKi9cblxuICBNb2Rlcm5penIuYWRkVGVzdCgndmlkZW9wcmVsb2FkJywgJ3ByZWxvYWQnIGluIGNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJykpO1xuXG5cbiAgLy8gUnVuIGVhY2ggdGVzdFxuICB0ZXN0UnVubmVyKCk7XG5cbiAgZGVsZXRlIE1vZGVybml6clByb3RvLmFkZFRlc3Q7XG4gIGRlbGV0ZSBNb2Rlcm5penJQcm90by5hZGRBc3luY1Rlc3Q7XG5cbiAgLy8gUnVuIHRoZSB0aGluZ3MgdGhhdCBhcmUgc3VwcG9zZWQgdG8gcnVuIGFmdGVyIHRoZSB0ZXN0c1xuICBmb3IgKHZhciBpID0gMDsgaSA8IE1vZGVybml6ci5fcS5sZW5ndGg7IGkrKykge1xuICAgIE1vZGVybml6ci5fcVtpXSgpO1xuICB9XG5cbiAgLy8gTGVhayBNb2Rlcm5penIgbmFtZXNwYWNlXG4gIHdpbmRvdy5Nb2Rlcm5penIgPSBNb2Rlcm5penI7XG5cblxuO1xuXG59KSh3aW5kb3csIGRvY3VtZW50KTsiLCIvKlxuKiBVbmRlcnNjb3JlLnN0cmluZ1xuKiAoYykgMjAxMCBFc2EtTWF0dGkgU3V1cm9uZW4gPGVzYS1tYXR0aSBhZXQgc3V1cm9uZW4gZG90IG9yZz5cbiogVW5kZXJzY29yZS5zdHJpbmcgaXMgZnJlZWx5IGRpc3RyaWJ1dGFibGUgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBNSVQgbGljZW5zZS5cbiogRG9jdW1lbnRhdGlvbjogaHR0cHM6Ly9naXRodWIuY29tL2VwZWxpL3VuZGVyc2NvcmUuc3RyaW5nXG4qIFNvbWUgY29kZSBpcyBib3Jyb3dlZCBmcm9tIE1vb1Rvb2xzIGFuZCBBbGV4YW5kcnUgTWFyYXN0ZWFudS5cbiogVmVyc2lvbiAnMy4zLjQnXG4qIEBwcmVzZXJ2ZVxuKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBzKHZhbHVlKSB7XG4gIC8qIGpzaGludCB2YWxpZHRoaXM6IHRydWUgKi9cbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIHMpKSByZXR1cm4gbmV3IHModmFsdWUpO1xuICB0aGlzLl93cmFwcGVkID0gdmFsdWU7XG59XG5cbnMuVkVSU0lPTiA9ICczLjMuNCc7XG5cbnMuaXNCbGFuayAgICAgICAgICA9IHJlcXVpcmUoJy4vaXNCbGFuaycpO1xucy5zdHJpcFRhZ3MgICAgICAgID0gcmVxdWlyZSgnLi9zdHJpcFRhZ3MnKTtcbnMuY2FwaXRhbGl6ZSAgICAgICA9IHJlcXVpcmUoJy4vY2FwaXRhbGl6ZScpO1xucy5kZWNhcGl0YWxpemUgICAgID0gcmVxdWlyZSgnLi9kZWNhcGl0YWxpemUnKTtcbnMuY2hvcCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vY2hvcCcpO1xucy50cmltICAgICAgICAgICAgID0gcmVxdWlyZSgnLi90cmltJyk7XG5zLmNsZWFuICAgICAgICAgICAgPSByZXF1aXJlKCcuL2NsZWFuJyk7XG5zLmNsZWFuRGlhY3JpdGljcyAgPSByZXF1aXJlKCcuL2NsZWFuRGlhY3JpdGljcycpO1xucy5jb3VudCAgICAgICAgICAgID0gcmVxdWlyZSgnLi9jb3VudCcpO1xucy5jaGFycyAgICAgICAgICAgID0gcmVxdWlyZSgnLi9jaGFycycpO1xucy5zd2FwQ2FzZSAgICAgICAgID0gcmVxdWlyZSgnLi9zd2FwQ2FzZScpO1xucy5lc2NhcGVIVE1MICAgICAgID0gcmVxdWlyZSgnLi9lc2NhcGVIVE1MJyk7XG5zLnVuZXNjYXBlSFRNTCAgICAgPSByZXF1aXJlKCcuL3VuZXNjYXBlSFRNTCcpO1xucy5zcGxpY2UgICAgICAgICAgID0gcmVxdWlyZSgnLi9zcGxpY2UnKTtcbnMuaW5zZXJ0ICAgICAgICAgICA9IHJlcXVpcmUoJy4vaW5zZXJ0Jyk7XG5zLnJlcGxhY2VBbGwgICAgICAgPSByZXF1aXJlKCcuL3JlcGxhY2VBbGwnKTtcbnMuaW5jbHVkZSAgICAgICAgICA9IHJlcXVpcmUoJy4vaW5jbHVkZScpO1xucy5qb2luICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9qb2luJyk7XG5zLmxpbmVzICAgICAgICAgICAgPSByZXF1aXJlKCcuL2xpbmVzJyk7XG5zLmRlZGVudCAgICAgICAgICAgPSByZXF1aXJlKCcuL2RlZGVudCcpO1xucy5yZXZlcnNlICAgICAgICAgID0gcmVxdWlyZSgnLi9yZXZlcnNlJyk7XG5zLnN0YXJ0c1dpdGggICAgICAgPSByZXF1aXJlKCcuL3N0YXJ0c1dpdGgnKTtcbnMuZW5kc1dpdGggICAgICAgICA9IHJlcXVpcmUoJy4vZW5kc1dpdGgnKTtcbnMucHJlZCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vcHJlZCcpO1xucy5zdWNjICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9zdWNjJyk7XG5zLnRpdGxlaXplICAgICAgICAgPSByZXF1aXJlKCcuL3RpdGxlaXplJyk7XG5zLmNhbWVsaXplICAgICAgICAgPSByZXF1aXJlKCcuL2NhbWVsaXplJyk7XG5zLnVuZGVyc2NvcmVkICAgICAgPSByZXF1aXJlKCcuL3VuZGVyc2NvcmVkJyk7XG5zLmRhc2hlcml6ZSAgICAgICAgPSByZXF1aXJlKCcuL2Rhc2hlcml6ZScpO1xucy5jbGFzc2lmeSAgICAgICAgID0gcmVxdWlyZSgnLi9jbGFzc2lmeScpO1xucy5odW1hbml6ZSAgICAgICAgID0gcmVxdWlyZSgnLi9odW1hbml6ZScpO1xucy5sdHJpbSAgICAgICAgICAgID0gcmVxdWlyZSgnLi9sdHJpbScpO1xucy5ydHJpbSAgICAgICAgICAgID0gcmVxdWlyZSgnLi9ydHJpbScpO1xucy50cnVuY2F0ZSAgICAgICAgID0gcmVxdWlyZSgnLi90cnVuY2F0ZScpO1xucy5wcnVuZSAgICAgICAgICAgID0gcmVxdWlyZSgnLi9wcnVuZScpO1xucy53b3JkcyAgICAgICAgICAgID0gcmVxdWlyZSgnLi93b3JkcycpO1xucy5wYWQgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9wYWQnKTtcbnMubHBhZCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vbHBhZCcpO1xucy5ycGFkICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9ycGFkJyk7XG5zLmxycGFkICAgICAgICAgICAgPSByZXF1aXJlKCcuL2xycGFkJyk7XG5zLnNwcmludGYgICAgICAgICAgPSByZXF1aXJlKCcuL3NwcmludGYnKTtcbnMudnNwcmludGYgICAgICAgICA9IHJlcXVpcmUoJy4vdnNwcmludGYnKTtcbnMudG9OdW1iZXIgICAgICAgICA9IHJlcXVpcmUoJy4vdG9OdW1iZXInKTtcbnMubnVtYmVyRm9ybWF0ICAgICA9IHJlcXVpcmUoJy4vbnVtYmVyRm9ybWF0Jyk7XG5zLnN0clJpZ2h0ICAgICAgICAgPSByZXF1aXJlKCcuL3N0clJpZ2h0Jyk7XG5zLnN0clJpZ2h0QmFjayAgICAgPSByZXF1aXJlKCcuL3N0clJpZ2h0QmFjaycpO1xucy5zdHJMZWZ0ICAgICAgICAgID0gcmVxdWlyZSgnLi9zdHJMZWZ0Jyk7XG5zLnN0ckxlZnRCYWNrICAgICAgPSByZXF1aXJlKCcuL3N0ckxlZnRCYWNrJyk7XG5zLnRvU2VudGVuY2UgICAgICAgPSByZXF1aXJlKCcuL3RvU2VudGVuY2UnKTtcbnMudG9TZW50ZW5jZVNlcmlhbCA9IHJlcXVpcmUoJy4vdG9TZW50ZW5jZVNlcmlhbCcpO1xucy5zbHVnaWZ5ICAgICAgICAgID0gcmVxdWlyZSgnLi9zbHVnaWZ5Jyk7XG5zLnN1cnJvdW5kICAgICAgICAgPSByZXF1aXJlKCcuL3N1cnJvdW5kJyk7XG5zLnF1b3RlICAgICAgICAgICAgPSByZXF1aXJlKCcuL3F1b3RlJyk7XG5zLnVucXVvdGUgICAgICAgICAgPSByZXF1aXJlKCcuL3VucXVvdGUnKTtcbnMucmVwZWF0ICAgICAgICAgICA9IHJlcXVpcmUoJy4vcmVwZWF0Jyk7XG5zLm5hdHVyYWxDbXAgICAgICAgPSByZXF1aXJlKCcuL25hdHVyYWxDbXAnKTtcbnMubGV2ZW5zaHRlaW4gICAgICA9IHJlcXVpcmUoJy4vbGV2ZW5zaHRlaW4nKTtcbnMudG9Cb29sZWFuICAgICAgICA9IHJlcXVpcmUoJy4vdG9Cb29sZWFuJyk7XG5zLmV4cG9ydHMgICAgICAgICAgPSByZXF1aXJlKCcuL2V4cG9ydHMnKTtcbnMuZXNjYXBlUmVnRXhwICAgICA9IHJlcXVpcmUoJy4vaGVscGVyL2VzY2FwZVJlZ0V4cCcpO1xucy53cmFwICAgICAgICAgICAgID0gcmVxdWlyZSgnLi93cmFwJyk7XG5zLm1hcCAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL21hcCcpO1xuXG4vLyBBbGlhc2VzXG5zLnN0cmlwICAgICA9IHMudHJpbTtcbnMubHN0cmlwICAgID0gcy5sdHJpbTtcbnMucnN0cmlwICAgID0gcy5ydHJpbTtcbnMuY2VudGVyICAgID0gcy5scnBhZDtcbnMucmp1c3QgICAgID0gcy5scGFkO1xucy5sanVzdCAgICAgPSBzLnJwYWQ7XG5zLmNvbnRhaW5zICA9IHMuaW5jbHVkZTtcbnMucSAgICAgICAgID0gcy5xdW90ZTtcbnMudG9Cb29sICAgID0gcy50b0Jvb2xlYW47XG5zLmNhbWVsY2FzZSA9IHMuY2FtZWxpemU7XG5zLm1hcENoYXJzICA9IHMubWFwO1xuXG5cbi8vIEltcGxlbWVudCBjaGFpbmluZ1xucy5wcm90b3R5cGUgPSB7XG4gIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fd3JhcHBlZDtcbiAgfVxufTtcblxuZnVuY3Rpb24gZm4ybWV0aG9kKGtleSwgZm4pIHtcbiAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuO1xuICBzLnByb3RvdHlwZVtrZXldID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBbdGhpcy5fd3JhcHBlZF0uY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuICAgIHZhciByZXMgPSBmbi5hcHBseShudWxsLCBhcmdzKTtcbiAgICAvLyBpZiB0aGUgcmVzdWx0IGlzIG5vbi1zdHJpbmcgc3RvcCB0aGUgY2hhaW4gYW5kIHJldHVybiB0aGUgdmFsdWVcbiAgICByZXR1cm4gdHlwZW9mIHJlcyA9PT0gJ3N0cmluZycgPyBuZXcgcyhyZXMpIDogcmVzO1xuICB9O1xufVxuXG4vLyBDb3B5IGZ1bmN0aW9ucyB0byBpbnN0YW5jZSBtZXRob2RzIGZvciBjaGFpbmluZ1xuZm9yICh2YXIga2V5IGluIHMpIGZuMm1ldGhvZChrZXksIHNba2V5XSk7XG5cbmZuMm1ldGhvZCgndGFwJywgZnVuY3Rpb24gdGFwKHN0cmluZywgZm4pIHtcbiAgcmV0dXJuIGZuKHN0cmluZyk7XG59KTtcblxuZnVuY3Rpb24gcHJvdG90eXBlMm1ldGhvZChtZXRob2ROYW1lKSB7XG4gIGZuMm1ldGhvZChtZXRob2ROYW1lLCBmdW5jdGlvbihjb250ZXh0KSB7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIHJldHVybiBTdHJpbmcucHJvdG90eXBlW21ldGhvZE5hbWVdLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICB9KTtcbn1cblxudmFyIHByb3RvdHlwZU1ldGhvZHMgPSBbXG4gICd0b1VwcGVyQ2FzZScsXG4gICd0b0xvd2VyQ2FzZScsXG4gICdzcGxpdCcsXG4gICdyZXBsYWNlJyxcbiAgJ3NsaWNlJyxcbiAgJ3N1YnN0cmluZycsXG4gICdzdWJzdHInLFxuICAnY29uY2F0J1xuXTtcblxuZm9yICh2YXIgbWV0aG9kIGluIHByb3RvdHlwZU1ldGhvZHMpIHByb3RvdHlwZTJtZXRob2QocHJvdG90eXBlTWV0aG9kc1ttZXRob2RdKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IHM7XG4iXX0=
