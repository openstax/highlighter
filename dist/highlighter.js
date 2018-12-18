(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["highlighter"] = factory();
	else
		root["highlighter"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 93);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(3);
var core = __webpack_require__(15);
var hide = __webpack_require__(7);
var redefine = __webpack_require__(8);
var ctx = __webpack_require__(26);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(32)('wks');
var uid = __webpack_require__(16);
var Symbol = __webpack_require__(3).Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(1)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(10);
var IE8_DOM_DEFINE = __webpack_require__(43);
var toPrimitive = __webpack_require__(25);
var dP = Object.defineProperty;

exports.f = __webpack_require__(4) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(5);
var createDesc = __webpack_require__(19);
module.exports = __webpack_require__(4) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(3);
var hide = __webpack_require__(7);
var has = __webpack_require__(11);
var SRC = __webpack_require__(16)('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__(15).inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var $iterators = __webpack_require__(34);
var getKeys = __webpack_require__(13);
var redefine = __webpack_require__(8);
var global = __webpack_require__(3);
var hide = __webpack_require__(7);
var Iterators = __webpack_require__(35);
var wks = __webpack_require__(2);
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(6);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(29);
var defined = __webpack_require__(20);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(51);
var enumBugKeys = __webpack_require__(37);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $forEach = __webpack_require__(28)(0);
var STRICT = __webpack_require__(22)([].forEach, true);

$export($export.P + $export.F * !STRICT, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: function forEach(callbackfn /* , thisArg */) {
    return $forEach(this, callbackfn, arguments[1]);
  }
});


/***/ }),
/* 15 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.7' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 16 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(20);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 18 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 20 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = false;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(1);

module.exports = function (method, arg) {
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call
    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
  });
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $indexOf = __webpack_require__(52)(false);
var $native = [].indexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !__webpack_require__(22)($native)), 'Array', {
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? $native.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments[1]);
  }
});


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(4), 'Object', { defineProperty: __webpack_require__(5).f });


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(6);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(45);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $filter = __webpack_require__(28)(2);

$export($export.P + $export.F * !__webpack_require__(22)([].filter, true), 'Array', {
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments[1]);
  }
});


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = __webpack_require__(26);
var IObject = __webpack_require__(29);
var toObject = __webpack_require__(17);
var toLength = __webpack_require__(46);
var asc = __webpack_require__(64);
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(30);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 30 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(30);
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(15);
var global = __webpack_require__(3);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__(21) ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var aFunction = __webpack_require__(45);
var toObject = __webpack_require__(17);
var fails = __webpack_require__(1);
var $sort = [].sort;
var test = [1, 2, 3];

$export($export.P + $export.F * (fails(function () {
  // IE8-
  test.sort(undefined);
}) || !fails(function () {
  // V8 bug
  test.sort(null);
  // Old WebKit
}) || !__webpack_require__(22)($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? $sort.call(toObject(this))
      : $sort.call(toObject(this), aFunction(comparefn));
  }
});


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(49);
var step = __webpack_require__(66);
var Iterators = __webpack_require__(35);
var toIObject = __webpack_require__(12);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(67)(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(32)('keys');
var uid = __webpack_require__(16);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),
/* 37 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(5).f;
var has = __webpack_require__(11);
var TAG = __webpack_require__(2)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.2.5.3 get RegExp.prototype.flags
var anObject = __webpack_require__(10);
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__(51);
var hiddenKeys = __webpack_require__(37).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var hide = __webpack_require__(7);
var redefine = __webpack_require__(8);
var fails = __webpack_require__(1);
var defined = __webpack_require__(20);
var wks = __webpack_require__(2);

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);
  var fns = exec(defined, SYMBOL, ''[KEY]);
  var strfn = fns[0];
  var rxfn = fns[1];
  if (fails(function () {
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  })) {
    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};


/***/ }),
/* 42 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(4) && !__webpack_require__(1)(function () {
  return Object.defineProperty(__webpack_require__(44)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(6);
var document = __webpack_require__(3).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(47);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 47 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = __webpack_require__(0);
var $find = __webpack_require__(28)(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__(49)(KEY);


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__(2)('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__(7)(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(10);
var dPs = __webpack_require__(69);
var enumBugKeys = __webpack_require__(37);
var IE_PROTO = __webpack_require__(36)('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(44)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(71).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(11);
var toIObject = __webpack_require__(12);
var arrayIndexOf = __webpack_require__(52)(false);
var IE_PROTO = __webpack_require__(36)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(12);
var toLength = __webpack_require__(46);
var toAbsoluteIndex = __webpack_require__(70);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__(77);
var anObject = __webpack_require__(10);
var $flags = __webpack_require__(39);
var DESCRIPTORS = __webpack_require__(4);
var TO_STRING = 'toString';
var $toString = /./[TO_STRING];

var define = function (fn) {
  __webpack_require__(8)(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if (__webpack_require__(1)(function () { return $toString.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
  define(function toString() {
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if ($toString.name != TO_STRING) {
  define(function toString() {
    return $toString.call(this);
  });
}


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

var DateProto = Date.prototype;
var INVALID_DATE = 'Invalid Date';
var TO_STRING = 'toString';
var $toString = DateProto[TO_STRING];
var getTime = DateProto.getTime;
if (new Date(NaN) + '' != INVALID_DATE) {
  __webpack_require__(8)(DateProto, TO_STRING, function toString() {
    var value = getTime.call(this);
    // eslint-disable-next-line no-self-compare
    return value === value ? $toString.call(this) : INVALID_DATE;
  });
}


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__(18);
var createDesc = __webpack_require__(19);
var toIObject = __webpack_require__(12);
var toPrimitive = __webpack_require__(25);
var has = __webpack_require__(11);
var IE8_DOM_DEFINE = __webpack_require__(43);
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(4) ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.8 IsRegExp(argument)
var isObject = __webpack_require__(6);
var cof = __webpack_require__(30);
var MATCH = __webpack_require__(2)('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

// @@replace logic
__webpack_require__(41)('replace', 2, function (defined, REPLACE, $replace) {
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return [function replace(searchValue, replaceValue) {
    'use strict';
    var O = defined(this);
    var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined
      ? fn.call(searchValue, O, replaceValue)
      : $replace.call(String(O), searchValue, replaceValue);
  }, $replace];
});


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(59)('asyncIterator');


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(3);
var core = __webpack_require__(15);
var LIBRARY = __webpack_require__(21);
var wksExt = __webpack_require__(60);
var defineProperty = __webpack_require__(5).f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(2);


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global = __webpack_require__(3);
var has = __webpack_require__(11);
var DESCRIPTORS = __webpack_require__(4);
var $export = __webpack_require__(0);
var redefine = __webpack_require__(8);
var META = __webpack_require__(82).KEY;
var $fails = __webpack_require__(1);
var shared = __webpack_require__(32);
var setToStringTag = __webpack_require__(38);
var uid = __webpack_require__(16);
var wks = __webpack_require__(2);
var wksExt = __webpack_require__(60);
var wksDefine = __webpack_require__(59);
var enumKeys = __webpack_require__(83);
var isArray = __webpack_require__(31);
var anObject = __webpack_require__(10);
var isObject = __webpack_require__(6);
var toIObject = __webpack_require__(12);
var toPrimitive = __webpack_require__(25);
var createDesc = __webpack_require__(19);
var _create = __webpack_require__(50);
var gOPNExt = __webpack_require__(84);
var $GOPD = __webpack_require__(55);
var $DP = __webpack_require__(5);
var $keys = __webpack_require__(13);
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  __webpack_require__(40).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(18).f = $propertyIsEnumerable;
  __webpack_require__(42).f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !__webpack_require__(21)) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(7)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = __webpack_require__(0);

$export($export.S, 'Array', { isArray: __webpack_require__(31) });


/***/ }),
/* 63 */
/***/ (function(module, exports) {

// restore the selection specified by the given state and reference node, and
// return the new selection object
function restore(state, referenceNode) {
  referenceNode = referenceNode || document.body

  var i
    , node
    , nextNodeCharIndex
    , currentNodeCharIndex = 0
    , nodes = [referenceNode]
    , sel = window.getSelection()
    , range = document.createRange()

  range.setStart(referenceNode, 0)
  range.collapse(true)

  while (node = nodes.pop()) {
    if (node.nodeType === 3) { // TEXT_NODE
      nextNodeCharIndex = currentNodeCharIndex + node.length

      // if this node contains the character at the start index, set this as the
      // starting node with the correct offset
      if (state.start >= currentNodeCharIndex && state.start <= nextNodeCharIndex) {
        range.setStart(node, state.start - currentNodeCharIndex)
      }

      // if this node contains the character at the end index, set this as the
      // ending node with the correct offset and stop looking
      if (state.end >= currentNodeCharIndex && state.end <= nextNodeCharIndex) {
        range.setEnd(node, state.end - currentNodeCharIndex)
        break
      }

      currentNodeCharIndex = nextNodeCharIndex
    } else {

      // get child nodes if the current node is not a text node
      i = node.childNodes.length
      while (i--) {
        nodes.push(node.childNodes[i])
      }
    }
  }

  sel.removeAllRanges()
  sel.addRange(range)
  return sel
}

// serialize the current selection offsets using given node as a reference point
function save(referenceNode) {
  referenceNode = referenceNode || document.body

  var sel = window.getSelection()
    , range = sel.rangeCount
        ? sel.getRangeAt(0).cloneRange()
        : document.createRange()
    , startContainer = range.startContainer
    , startOffset = range.startOffset
    , state = { content: range.toString() }

  // move the range to select the contents up to the selection
  // so we can find its character offset from the reference node
  range.selectNodeContents(referenceNode)
  range.setEnd(startContainer, startOffset)

  state.start = range.toString().length
  state.end = state.start + state.content.length

  // add a shortcut method to restore this selection
  state.restore = restore.bind(null, state, referenceNode)

  return state
}

module.exports = {
  save: save,
  restore: restore
}


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__(65);

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(6);
var isArray = __webpack_require__(31);
var SPECIES = __webpack_require__(2)('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};


/***/ }),
/* 66 */
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(21);
var $export = __webpack_require__(0);
var redefine = __webpack_require__(8);
var hide = __webpack_require__(7);
var Iterators = __webpack_require__(35);
var $iterCreate = __webpack_require__(68);
var setToStringTag = __webpack_require__(38);
var getPrototypeOf = __webpack_require__(72);
var ITERATOR = __webpack_require__(2)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__(50);
var descriptor = __webpack_require__(19);
var setToStringTag = __webpack_require__(38);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(7)(IteratorPrototype, __webpack_require__(2)('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(5);
var anObject = __webpack_require__(10);
var getKeys = __webpack_require__(13);

module.exports = __webpack_require__(4) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(47);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(3).document;
module.exports = document && document.documentElement;


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(11);
var toObject = __webpack_require__(17);
var IE_PROTO = __webpack_require__(36)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-values-entries
var $export = __webpack_require__(0);
var $values = __webpack_require__(74)(false);

$export($export.S, 'Object', {
  values: function values(it) {
    return $values(it);
  }
});


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

var getKeys = __webpack_require__(13);
var toIObject = __webpack_require__(12);
var isEnum = __webpack_require__(18).f;
module.exports = function (isEntries) {
  return function (it) {
    var O = toIObject(it);
    var keys = getKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) if (isEnum.call(O, key = keys[i++])) {
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(17);
var $keys = __webpack_require__(13);

__webpack_require__(76)('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(0);
var core = __webpack_require__(15);
var fails = __webpack_require__(1);
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

// 21.2.5.3 get RegExp.prototype.flags()
if (__webpack_require__(4) && /./g.flags != 'g') __webpack_require__(5).f(RegExp.prototype, 'flags', {
  configurable: true,
  get: __webpack_require__(39)
});


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(3);
var inheritIfRequired = __webpack_require__(79);
var dP = __webpack_require__(5).f;
var gOPN = __webpack_require__(40).f;
var isRegExp = __webpack_require__(56);
var $flags = __webpack_require__(39);
var $RegExp = global.RegExp;
var Base = $RegExp;
var proto = $RegExp.prototype;
var re1 = /a/g;
var re2 = /a/g;
// "new" creates a new object, old webkit buggy here
var CORRECT_NEW = new $RegExp(re1) !== re1;

if (__webpack_require__(4) && (!CORRECT_NEW || __webpack_require__(1)(function () {
  re2[__webpack_require__(2)('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))) {
  $RegExp = function RegExp(p, f) {
    var tiRE = this instanceof $RegExp;
    var piRE = isRegExp(p);
    var fiU = f === undefined;
    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p
      : inheritIfRequired(CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f)
      , tiRE ? this : proto, $RegExp);
  };
  var proxy = function (key) {
    key in $RegExp || dP($RegExp, key, {
      configurable: true,
      get: function () { return Base[key]; },
      set: function (it) { Base[key] = it; }
    });
  };
  for (var keys = gOPN(Base), i = 0; keys.length > i;) proxy(keys[i++]);
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  __webpack_require__(8)(global, 'RegExp', $RegExp);
}

__webpack_require__(81)('RegExp');


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(6);
var setPrototypeOf = __webpack_require__(80).set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__(6);
var anObject = __webpack_require__(10);
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = __webpack_require__(26)(Function.call, __webpack_require__(55).f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(3);
var dP = __webpack_require__(5);
var DESCRIPTORS = __webpack_require__(4);
var SPECIES = __webpack_require__(2)('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

var META = __webpack_require__(16)('meta');
var isObject = __webpack_require__(6);
var has = __webpack_require__(11);
var setDesc = __webpack_require__(5).f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !__webpack_require__(1)(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(13);
var gOPS = __webpack_require__(42);
var pIE = __webpack_require__(18);
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(12);
var gOPN = __webpack_require__(40).f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

// @@match logic
__webpack_require__(41)('match', 1, function (defined, MATCH, $match) {
  // 21.1.3.11 String.prototype.match(regexp)
  return [function match(regexp) {
    'use strict';
    var O = defined(this);
    var fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  }, $match];
});


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

// @@split logic
__webpack_require__(41)('split', 2, function (defined, SPLIT, $split) {
  'use strict';
  var isRegExp = __webpack_require__(56);
  var _split = $split;
  var $push = [].push;
  var $SPLIT = 'split';
  var LENGTH = 'length';
  var LAST_INDEX = 'lastIndex';
  if (
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ) {
    var NPCG = /()??/.exec('')[1] === undefined; // nonparticipating capturing group
    // based on es5-shim implementation, need to rework it
    $split = function (separator, limit) {
      var string = String(this);
      if (separator === undefined && limit === 0) return [];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) return _split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var separator2, match, lastIndex, lastLength, i;
      // Doesn't need flags gy, but they don't hurt
      if (!NPCG) separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
      while (match = separatorCopy.exec(string)) {
        // `separatorCopy.lastIndex` is not reliable cross-browser
        lastIndex = match.index + match[0][LENGTH];
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          // Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
          // eslint-disable-next-line no-loop-func
          if (!NPCG && match[LENGTH] > 1) match[0].replace(separator2, function () {
            for (i = 1; i < arguments[LENGTH] - 2; i++) if (arguments[i] === undefined) match[i] = undefined;
          });
          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if (output[LENGTH] >= splitLimit) break;
        }
        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if (lastLastIndex === string[LENGTH]) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
    $split = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : _split.call(this, separator, limit);
    };
  }
  // 21.1.3.17 String.prototype.split(separator, limit)
  return [function split(separator, limit) {
    var O = defined(this);
    var fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
  }, $split];
});


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.1.3.25 String.prototype.trim()
__webpack_require__(88)('trim', function ($trim) {
  return function trim() {
    return $trim(this, 3);
  };
});


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var defined = __webpack_require__(20);
var fails = __webpack_require__(1);
var spaces = __webpack_require__(89);
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;


/***/ }),
/* 89 */
/***/ (function(module, exports) {

module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

// 20.3.3.1 / 15.9.4.4 Date.now()
var $export = __webpack_require__(0);

$export($export.S, 'Date', { now: function () { return new Date().getTime(); } });


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(0);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(92) });


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__(13);
var gOPS = __webpack_require__(42);
var pIE = __webpack_require__(18);
var toObject = __webpack_require__(17);
var IObject = __webpack_require__(29);
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(1)(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ }),
/* 93 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.define-property.js
var es6_object_define_property = __webpack_require__(24);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.filter.js
var es6_array_filter = __webpack_require__(27);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.find.js
var es6_array_find = __webpack_require__(48);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.sort.js
var es6_array_sort = __webpack_require__(33);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.iterator.js
var es6_array_iterator = __webpack_require__(34);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es7.object.values.js
var es7_object_values = __webpack_require__(73);

// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom.iterable.js
var web_dom_iterable = __webpack_require__(9);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.for-each.js
var es6_array_for_each = __webpack_require__(14);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.keys.js
var es6_object_keys = __webpack_require__(75);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.to-string.js
var es6_regexp_to_string = __webpack_require__(53);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.date.to-string.js
var es6_date_to_string = __webpack_require__(54);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.constructor.js
var es6_regexp_constructor = __webpack_require__(78);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.replace.js
var es6_regexp_replace = __webpack_require__(57);

// CONCATENATED MODULE: ./src/dom.js





/**
 * Utility functions to make DOM manipulation easier.
 */
var NODE_TYPE = {
  ELEMENT_NODE: 1,
  TEXT_NODE: 3
};
function dom(el) {
  return {
    get el() {
      return el;
    },

    /**
     * Adds class to element.
     * @param {string} className
     */
    addClass: function addClass(className) {
      if (el.classList) {
        el.classList.add(className);
      } else {
        el.className += ' ' + className;
      }
    },

    /**
     * Removes class from element.
     * @param {string} className
     */
    removeClass: function removeClass(className) {
      if (el.classList) {
        el.classList.remove(className);
      } else {
        el.className = el.className.replace(new RegExp('(^|\\b)' + className + '(\\b|$)', 'gi'), ' ');
      }
    },

    /**
     * Prepends child nodes to base element.
     * @param {Node[]} nodesToPrepend
     */
    prepend: function prepend(nodesToPrepend) {
      var nodes = Array.prototype.slice.call(nodesToPrepend),
          i = nodes.length;

      while (i--) {
        el.insertBefore(nodes[i], el.firstChild);
      }
    },

    /**
     * Appends child nodes to base element.
     * @param {Node[]} nodesToAppend
     */
    append: function append(nodesToAppend) {
      var nodes = Array.prototype.slice.call(nodesToAppend);

      for (var i = 0, len = nodes.length; i < len; ++i) {
        el.appendChild(nodes[i]);
      }
    },

    /**
     * Inserts base element after refEl.
     * @param {Node} refEl - node after which base element will be inserted
     * @returns {Node} - inserted element
     */
    insertAfter: function insertAfter(refEl) {
      return refEl.parentNode.insertBefore(el, refEl.nextSibling);
    },

    /**
     * Inserts base element before refEl.
     * @param {Node} refEl - node before which base element will be inserted
     * @returns {Node} - inserted element
     */
    insertBefore: function insertBefore(refEl) {
      return refEl.parentNode.insertBefore(el, refEl);
    },

    /**
     * Removes base element from DOM.
     */
    remove: function remove() {
      el.parentNode.removeChild(el);
      el = null;
    },

    /**
     * Returns true if base element contains given child.
     * @param {Node|HTMLElement} child
     * @returns {boolean}
     */
    contains: function contains(child) {
      return el !== child && el.contains(child);
    },

    /**
     * Wraps base element in wrapper element.
     * @param {HTMLElement} wrapper
     * @returns {HTMLElement} wrapper element
     */
    wrap: function wrap(wrapper) {
      if (el.parentNode) {
        el.parentNode.insertBefore(wrapper, el);
      }

      wrapper.appendChild(el);
      return wrapper;
    },

    /**
     * Unwraps base element.
     * @returns {Node[]} - child nodes of unwrapped element.
     */
    unwrap: function unwrap() {
      var nodes = Array.prototype.slice.call(el.childNodes),
          wrapper;
      nodes.forEach(function (node) {
        wrapper = node.parentNode;
        dom(node).insertBefore(node.parentNode);
        dom(wrapper).remove();
      });
      return nodes;
    },

    /**
     * Returns array of base element parents.
     * @returns {HTMLElement[]}
     */
    parents: function parents() {
      var parent,
          path = [];

      while (parent = el.parentNode) {
        path.push(parent);
        el = parent;
      }

      return path;
    },

    /**
     * Normalizes text nodes within base element, ie. merges sibling text nodes and assures that every
     * element node has only one text node.
     * It should does the same as standard element.normalize, but IE implements it incorrectly.
     */
    normalizeTextNodes: function normalizeTextNodes() {
      if (!el) {
        return;
      }

      if (el.nodeType === NODE_TYPE.TEXT_NODE) {
        while (el.nextSibling && el.nextSibling.nodeType === NODE_TYPE.TEXT_NODE) {
          el.nodeValue += el.nextSibling.nodeValue;
          el.parentNode.removeChild(el.nextSibling);
        }
      } else {
        dom(el.firstChild).normalizeTextNodes();
      }

      dom(el.nextSibling).normalizeTextNodes();
    },

    /**
     * Creates dom element from given html string.
     * @param {string} html
     * @returns {NodeList}
     */
    fromHTML: function fromHTML(html) {
      var div = document.createElement('div');
      div.innerHTML = html;
      return div.childNodes;
    },

    /**
     * Returns first range of the window of base element.
     * @returns {Range}
     */
    getRange: function getRange() {
      var selection = dom(el).getSelection(),
          range;

      if (selection.rangeCount > 0) {
        range = selection.getRangeAt(0);
      }

      return range;
    },

    /**
     * Removes all ranges of the window of base element.
     */
    removeAllRanges: function removeAllRanges() {
      var selection = dom(el).getSelection();
      selection.removeAllRanges();
    },

    /**
     * Returns selection object of the window of base element.
     * @returns {Selection}
     */
    getSelection: function getSelection() {
      return dom(el).getWindow().getSelection();
    },

    /**
     * Returns window of the base element.
     * @returns {Window}
     */
    getWindow: function getWindow() {
      return dom(el).getDocument().defaultView;
    },

    /**
     * Returns document of the base element.
     * @returns {HTMLDocument}
     */
    getDocument: function getDocument() {
      // if ownerDocument is null then el is the document itself.
      return el.ownerDocument || el;
    },
    matches: function matches(selector) {
      var method = el.matches || el.mozMatchesSelector || el.msMatchesSelector || el.oMatchesSelector || el.webkitMatchesSelector;
      return method != null ? method.call(el, selector) : undefined;
    },
    isParent: function isParent(node, options) {
      if (options == null) {
        options = {
          matchSame: true
        };
      }

      if (!parent) {
        return false;
      }

      if (options.matchSame && node === el) {
        return true;
      }

      node = node.parentNode;

      while (node) {
        if (node === el) {
          return true;
        }

        node = node.parentNode;
      }

      return false;
    },
    closest: function closest(selector) {
      if (this.matches(selector)) {
        return el;
      } else {
        return el.parentNode ? dom(el.parentNode).closest(selector) : null;
      }
    },
    farthest: function farthest(selector) {
      var thisMatches = this.matches(selector);

      if (el.parentNode && thisMatches) {
        return dom(el.parentNode).farthest(selector) || el;
      } else if (el.parentNode) {
        return dom(el.parentNode).farthest(selector);
      } else {
        return thisMatches ? el : null;
      }
    }
  };
}
// EXTERNAL MODULE: ./node_modules/serialize-selection/index.js
var serialize_selection = __webpack_require__(63);
var serialize_selection_default = /*#__PURE__*/__webpack_require__.n(serialize_selection);

// CONCATENATED MODULE: ./src/serializationStrategies/TextPositionSelector/index.ts




var discriminator = 'TextPositionSelector';
function TextPositionSelector_serialize(range, referenceElement) {
  referenceElement = referenceElement || dom(range.commonAncestorContainer).closest('[id]');

  if (!referenceElement) {
    throw new Error('reference element not found');
  } // modified copy/paste out of 'serialize-selection' module


  var cloneRange = range.cloneRange();
  var startContainer = cloneRange.startContainer;
  var startOffset = cloneRange.startOffset;
  var contentLength = cloneRange.toString().length;
  cloneRange.selectNodeContents(referenceElement);
  cloneRange.setEnd(startContainer, startOffset);
  return {
    end: cloneRange.toString().length + contentLength,
    referenceElementId: referenceElement.id,
    start: cloneRange.toString().length,
    type: discriminator
  };
}
function TextPositionSelector_isLoadable(highlighter, data) {
  return !!highlighter.document.getElementById(data.referenceElementId);
}
function TextPositionSelector_load(highlighter, data) {
  var referenceElement = highlighter.getReferenceElement(data.referenceElementId);
  var selection = serialize_selection_default.a.restore(data, referenceElement);
  var range = selection.getRangeAt(0);
  selection.removeAllRanges();
  return range;
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es7.symbol.async-iterator.js
var es7_symbol_async_iterator = __webpack_require__(58);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.symbol.js
var es6_symbol = __webpack_require__(61);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.is-array.js
var es6_array_is_array = __webpack_require__(62);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.match.js
var es6_regexp_match = __webpack_require__(85);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.index-of.js
var es6_array_index_of = __webpack_require__(23);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.split.js
var es6_regexp_split = __webpack_require__(86);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.string.trim.js
var es6_string_trim = __webpack_require__(87);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.date.now.js
var es6_date_now = __webpack_require__(90);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.assign.js
var es6_object_assign = __webpack_require__(91);

// CONCATENATED MODULE: ./src/injectHighlightWrappers.js









var TIMESTAMP_ATTR = 'data-timestamp';
var DATA_ATTR = 'data-highlighted';
var injectHighlightWrappers_NODE_TYPE = {
  ELEMENT_NODE: 1,
  TEXT_NODE: 3
};
/**
 * Don't highlight content of these tags.
 * @type {string[]}
 */

var IGNORE_TAGS = ['SCRIPT', 'STYLE', 'SELECT', 'OPTION', 'BUTTON', 'OBJECT', 'APPLET', 'VIDEO', 'AUDIO', 'CANVAS', 'EMBED', 'PARAM', 'METER', 'PROGRESS'];
function injectHighlightWrappers(highlight) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var wrapper = createWrapper(Object.assign({
    id: highlight.id,
    timestamp: Date.now()
  }, options));
  var createdHighlights = highlightRange(highlight.range, wrapper);
  var normalizedHighlights = normalizeHighlights(createdHighlights);
  highlight.range.setStartBefore(normalizedHighlights[0]);
  highlight.range.setEndAfter(normalizedHighlights[normalizedHighlights.length - 1]);
  highlight.elements = normalizedHighlights;
}
/**
 * Normalizes highlights. Ensures that highlighting is done with use of the smallest possible number of
 * wrapping HTML elements.
 * Flattens highlights structure and merges sibling highlights. Normalizes text nodes within highlights.
 * @param {Array} highlights - highlights to normalize.
 * @returns {Array} - array of normalized highlights. Order and number of returned highlights may be different than
 * input highlights.
 */

function normalizeHighlights(highlights) {
  var normalizedHighlights;
  flattenNestedHighlights(highlights);
  mergeSiblingHighlights(highlights); // omit removed nodes

  normalizedHighlights = highlights.filter(function (hl) {
    return hl.parentElement ? hl : null;
  });
  normalizedHighlights = unique(normalizedHighlights);
  normalizedHighlights.sort(function (a, b) {
    if (!a.compareDocumentPosition) {
      // support for IE8 and below
      return a.sourceIndex - b.sourceIndex;
    }

    var position = a.compareDocumentPosition(b);

    if (position & Node.DOCUMENT_POSITION_FOLLOWING || position & Node.DOCUMENT_POSITION_CONTAINED_BY) {
      return -1;
    } else if (position & Node.DOCUMENT_POSITION_PRECEDING || position & Node.DOCUMENT_POSITION_CONTAINS) {
      return 1;
    } else {
      return 0;
    }
  });
  return normalizedHighlights;
}
/**
 * Highlights range.
 * Wraps text of given range object in wrapper element.
 * @param {Range} range
 * @param {HTMLElement} wrapper
 * @returns {Array} - array of created highlights.
 */


function highlightRange(range, wrapper) {
  if (!range || range.collapsed) {
    return [];
  }

  var result = refineRangeBoundaries(range),
      startContainer = result.startContainer,
      endContainer = result.endContainer,
      goDeeper = result.goDeeper,
      done = false,
      node = startContainer,
      highlights = [],
      highlight,
      wrapperClone;

  var highlightNode = function highlightNode(node) {
    wrapperClone = wrapper.cloneNode(true);
    wrapperClone.setAttribute(DATA_ATTR, true);
    highlight = dom(node).wrap(wrapperClone);
    highlights.push(highlight);
  };

  do {
    if (!node) {
      done = true;
    }

    if (dom(node).matches('.MathJax,img')) {
      highlightNode(node);
      goDeeper = false;
    }

    if (goDeeper && node.nodeType === injectHighlightWrappers_NODE_TYPE.TEXT_NODE) {
      if (IGNORE_TAGS.indexOf(node.parentNode.tagName) === -1 && node.nodeValue.trim() !== '') {
        highlightNode(node);
      }

      goDeeper = false;
    }

    if (node === endContainer && !(endContainer.hasChildNodes() && goDeeper)) {
      done = true;
    }

    if (node.tagName && IGNORE_TAGS.indexOf(node.tagName) > -1) {
      if (endContainer.parentNode === node) {
        done = true;
      }

      goDeeper = false;
    }

    if (goDeeper && node.hasChildNodes()) {
      node = node.firstChild;
    } else if (node.nextSibling) {
      node = node.nextSibling;
      goDeeper = true;
    } else {
      node = node.parentNode;
      goDeeper = false;
    }
  } while (!done);

  return highlights;
}
/**
 * Takes range object as parameter and refines it boundaries
 * @param range
 * @returns {object} refined boundaries and initial state of highlighting algorithm.
 */


function refineRangeBoundaries(range) {
  var startContainer = range.startContainer,
      endContainer = range.endContainer,
      ancestor = range.commonAncestorContainer,
      goDeeper = true;

  if (range.endOffset === 0) {
    while (!endContainer.previousSibling && endContainer.parentNode !== ancestor) {
      endContainer = endContainer.parentNode;
    }

    endContainer = endContainer.previousSibling;
  } else if (endContainer.nodeType === injectHighlightWrappers_NODE_TYPE.TEXT_NODE) {
    if (range.endOffset < endContainer.nodeValue.length) {
      endContainer.splitText(range.endOffset);
    }
  } else if (range.endOffset > 0) {
    endContainer = endContainer.childNodes.item(range.endOffset - 1);
  }

  if (startContainer.nodeType === injectHighlightWrappers_NODE_TYPE.TEXT_NODE) {
    if (range.startOffset === startContainer.nodeValue.length) {
      goDeeper = false;
    } else if (range.startOffset > 0) {
      startContainer = startContainer.splitText(range.startOffset);

      if (endContainer === startContainer.previousSibling) {
        endContainer = startContainer;
      }
    }
  } else if (range.startOffset < startContainer.childNodes.length) {
    startContainer = startContainer.childNodes.item(range.startOffset);
  } else {
    startContainer = startContainer.nextSibling;
  } // BEGIN this might not be necessary, test removing it


  var getMath = function getMath(node) {
    var mathjax = dom(node).farthest('.MathJax');

    if (mathjax) {
      return mathjax;
    }

    var mml = dom(node).farthest('script[type="math/mml"]');

    if (mml && mml.previousSibling.matches('.MathJax')) {
      return mml.previousSibling;
    }

    if (mml && mml.previousSibling.matches('.MathJax_Display')) {
      return mml.previousSibling.querySelector('.MathJax');
    }

    return null;
  };

  var endMath = getMath(endContainer);

  if (endMath) {
    endContainer = endMath;
  }

  var startMath = getMath(startContainer);

  if (startMath) {
    startContainer = startMath;
    goDeeper = false;
  } // END this might not be necessary, test removing it


  return {
    startContainer: startContainer,
    endContainer: endContainer,
    goDeeper: goDeeper
  };
}
/**
 * Flattens highlights structure.
 * Note: this method changes input highlights - their order and number after calling this method may change.
 * @param {Array} highlights - highlights to flatten.
 */


function flattenNestedHighlights(highlights) {
  var again;
  sortByDepth(highlights, true);

  function flattenOnce() {
    var again = false;
    highlights.forEach(function (hl, i) {
      var parent = hl.parentElement,
          parentPrev = parent.previousSibling,
          parentNext = parent.nextSibling;

      if (injectHighlightWrappers_isHighlight(parent)) {
        if (!haveSameColor(parent, hl)) {
          if (!hl.nextSibling) {
            dom(hl).insertBefore(parentNext || parent);
            again = true;
          }

          if (!hl.previousSibling) {
            dom(hl).insertAfter(parentPrev || parent);
            again = true;
          }

          if (!parent.hasChildNodes()) {
            dom(parent).remove();
          }
        } else {
          parent.replaceChild(hl.firstChild, hl);
          highlights[i] = parent;
          again = true;
        }
      }
    });
    return again;
  }

  do {
    again = flattenOnce();
  } while (again);
}
/**
 * Merges sibling highlights and normalizes descendant text nodes.
 * Note: this method changes input highlights - their order and number after calling this method may change.
 * @param highlights
 */


function mergeSiblingHighlights(highlights) {
  function shouldMerge(current, node) {
    return injectHighlightWrappers_isHighlight(current) && injectHighlightWrappers_isHighlight(node) && current.data && node.data && current.data.id === node.data.id;
  }

  highlights.forEach(function (highlight) {
    var prev = highlight.previousSibling,
        next = highlight.nextSibling;

    if (shouldMerge(highlight, prev)) {
      dom(highlight).prepend(prev.childNodes);
      dom(prev).remove();
    }

    if (shouldMerge(highlight, next)) {
      dom(highlight).append(next.childNodes);
      dom(next).remove();
    }

    dom(highlight).normalizeTextNodes();
  });
}
/**
 * Creates wrapper for highlights.
 */


function createWrapper(options) {
  var span = document.createElement('span');
  span.className = options.className || 'highlight';

  if (options.timestamp) {
    span.setAttribute(TIMESTAMP_ATTR, options.timestamp);
  }

  if (options.id) {
    span.setAttribute('data-id', options.id);
  }

  return span;
}

function injectHighlightWrappers_isHighlight(el) {
  return el && el.nodeType === injectHighlightWrappers_NODE_TYPE.ELEMENT_NODE && el.hasAttribute(DATA_ATTR);
}

function sortByDepth(arr, descending) {
  arr.sort(function (a, b) {
    return dom(descending ? b : a).parents().length - dom(descending ? a : b).parents().length;
  });
}

function haveSameColor() {
  return true;
}
/**
 * Returns array without duplicated values.
 * @param {Array} arr
 * @returns {Array}
 */


function unique(arr) {
  return arr.filter(function (value, idx, self) {
    return self.indexOf(value) === idx;
  });
}
// CONCATENATED MODULE: ./src/serializationStrategies/XpathRangeSelector/xpath.js










function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }



var findElementChild = function findElementChild(node) {
  return Array.prototype.find.call(node.childNodes, function (node) {
    return node.nodeType === 1;
  });
};

var xpath_isHighlight = function isHighlight(node) {
  return node && node.getAttribute && node.getAttribute(DATA_ATTR) !== null;
};

var isTextHighlight = function isTextHighlight(node) {
  return xpath_isHighlight(node) && !findElementChild(node);
};

var isText = function isText(node) {
  return node && node.nodeType === 3;
};

var isTextOrTextHighlight = function isTextOrTextHighlight(node) {
  return isText(node) || isTextHighlight(node);
};

var isElement = function isElement(node) {
  return node && node.nodeType === 1;
};

var isElementNotHighlight = function isElementNotHighlight(node) {
  return isElement(node) && !xpath_isHighlight(node);
};

var IS_PATH_PART_SELF = /^\.$/;
var IS_PATH_PART_TEXT = /^text\(\)\[(\d+)\]$/;
var IS_PATH_PART_ELEMENT = /\*\[name\(\)='(.+)'\]\[(\d+)\]/; // kinda copied from https://developer.mozilla.org/en-US/docs/Web/XPath/Snippets#getXPathForElement

function getXPathForElement(targetElement, offset, reference) {
  // if the range offset designates text or a text highlight we need to move the target
  // so text offset stuff will work
  if (isElement(targetElement) && isTextOrTextHighlight(targetElement.childNodes[offset])) {
    targetElement = targetElement.childNodes[offset];
    offset = 0;
  }

  var xpath = '';
  var pos,
      element = targetElement.previousSibling,
      focus = targetElement; // for a text target, highlights might have broken up the text node,
  // look for preceeding nodes that need to be combined into this one
  // and modify the range offset accordingly. only have to look at one
  // previous sibling because text nodes cannot be siblings

  if (isText(focus) && isTextHighlight(element)) {
    while (isText(element) || isTextHighlight(element)) {
      offset += element.textContent.length;
      element = element.previousSibling;
    } // if target is text highlight, treat it like its text

  } else if (isTextHighlight(focus) && isTextOrTextHighlight(element)) {
    offset = 0;

    while (isText(element) || isTextHighlight(element)) {
      offset += element.textContent.length;
      element = element.previousSibling;
    } // for element targets, highlight children might be artifically
    // inflating the range offset, fix.

  } else if (isElement(focus)) {
    var search = focus.childNodes[offset];

    while (search) {
      if (isTextOrTextHighlight(search)) {
        search = search.previousSibling;

        while (isTextOrTextHighlight(search)) {
          offset--;
          search = search.previousSibling;
        }
      }

      search = search ? search.previousSibling : null;
    }
  }

  while (focus !== reference) {
    pos = 1;

    while (element) {
      // highlights in text change the number of nodes in the nodelist,
      // compensate by gobbling adjacent highlights and text
      if (isTextOrTextHighlight(focus) && isTextOrTextHighlight(element)) {
        while (isTextOrTextHighlight(element)) {
          element = element.previousSibling;
        }

        pos += 1;
      } else {
        if (isElementNotHighlight(focus) && isElementNotHighlight(element) && element.nodeName === focus.nodeName) {
          pos += 1;
        }

        element = element.previousSibling;
      }
    }

    if (isText(focus) || isTextHighlight(focus)) {
      xpath = "text()[" + pos + ']' + '/' + xpath;
    } else {
      xpath = "*[name()='" + focus.nodeName.toLowerCase() + "'][" + pos + ']' + '/' + xpath;
    }

    focus = focus.parentNode;
    element = focus.previousSibling;
  }

  xpath = './' + xpath;
  xpath = xpath.replace(/\/$/, '');
  return [xpath, offset];
}
function getFirstByXPath(path, offset, referenceElement) {
  var parts = path.split('/');
  var node = referenceElement;
  var part = parts.shift();

  while (node && part) {
    node = followPart(node, part);
    part = parts.shift();
  } // the part following is greedy, so walk back to the first matching
  // textish node before computing offset


  while (isTextOrTextHighlight(node) && isTextOrTextHighlight(node.previousSibling)) {
    node = node.previousSibling;
  } // highligts split up text nodes that should be treated as one, iterate through
  // until we find the text node that the offset specifies, modifying the offset
  // as we go. prefer leaving highlights if we have the option to deal with
  // adjacent highlights.


  while (isTextHighlight(node) && offset >= node.textContent.length || isText(node) && offset > node.textContent.length) {
    offset -= node.textContent.length;
    node = isTextOrTextHighlight(node.nextSibling) ? node.nextSibling : null;
  }

  if (node && xpath_isHighlight(node)) {
    node = null;
  }

  if (isElement(node) && node.childNodes.length < offset) {
    node = null;
  }

  return [node, offset];
}

function followPart(node, part) {
  var findFirst = function findFirst(nodeList, predicate) {
    return Array.prototype.find.call(nodeList, function (node) {
      return predicate(node) && !xpath_isHighlight(node);
    });
  };

  var findFirstAfter = function findFirstAfter(nodeList, afterThis, predicate) {
    return findFirst(Array.prototype.slice.call(nodeList, Array.prototype.indexOf.call(nodeList, afterThis) + 1), predicate);
  };

  if (IS_PATH_PART_SELF.test(part)) {
    return node;
  }

  if (IS_PATH_PART_TEXT.test(part)) {
    var _part$match = part.match(IS_PATH_PART_TEXT),
        _part$match2 = _slicedToArray(_part$match, 2),
        index = _part$match2[1];

    var text = findFirst(node.childNodes, isText);

    while (text && index > 1) {
      var search = text;

      while (isTextOrTextHighlight(search)) {
        search = search.nextSibling;
      }

      index--;

      if (search) {
        text = findFirstAfter(node.childNodes, search, isText);
      } else {
        text = search;
      }
    }

    return text;
  }

  if (IS_PATH_PART_ELEMENT.test(part)) {
    var _part$match3 = part.match(IS_PATH_PART_ELEMENT),
        _part$match4 = _slicedToArray(_part$match3, 3),
        type = _part$match4[1],
        _index = _part$match4[2];

    var nodeMatches = function nodeMatches(node) {
      return isElement(node) && node.nodeName.toLowerCase() === type.toLowerCase();
    };

    var element = findFirst(node.childNodes, nodeMatches);

    while (element && _index > 1) {
      _index--;
      element = findFirstAfter(node.childNodes, element, nodeMatches);
    }

    return element;
  }
}
// CONCATENATED MODULE: ./src/serializationStrategies/XpathRangeSelector/index.ts





function XpathRangeSelector_slicedToArray(arr, i) { return XpathRangeSelector_arrayWithHoles(arr) || XpathRangeSelector_iterableToArrayLimit(arr, i) || XpathRangeSelector_nonIterableRest(); }

function XpathRangeSelector_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function XpathRangeSelector_iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function XpathRangeSelector_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }



var XpathRangeSelector_discriminator = 'XpathRangeSelector';
function XpathRangeSelector_serialize(range, referenceElement) {
  referenceElement = referenceElement || dom(range.commonAncestorContainer).closest('[id]');

  if (!referenceElement) {
    throw new Error('reference element not found');
  }

  var _getXPathForElement = getXPathForElement(range.endContainer, range.endOffset, referenceElement),
      _getXPathForElement2 = XpathRangeSelector_slicedToArray(_getXPathForElement, 2),
      endContainer = _getXPathForElement2[0],
      endOffset = _getXPathForElement2[1];

  var _getXPathForElement3 = getXPathForElement(range.startContainer, range.startOffset, referenceElement),
      _getXPathForElement4 = XpathRangeSelector_slicedToArray(_getXPathForElement3, 2),
      startContainer = _getXPathForElement4[0],
      startOffset = _getXPathForElement4[1];

  return {
    endContainer: endContainer,
    endOffset: endOffset,
    referenceElementId: referenceElement.id,
    startContainer: startContainer,
    startOffset: startOffset,
    type: XpathRangeSelector_discriminator
  };
}
function XpathRangeSelector_isLoadable(highlighter, data) {
  var referenceElement = highlighter.getReferenceElement(data.referenceElementId);

  if (!referenceElement) {
    return false;
  }

  var _getFirstByXPath = getFirstByXPath(data.startContainer, data.startOffset, referenceElement),
      _getFirstByXPath2 = XpathRangeSelector_slicedToArray(_getFirstByXPath, 1),
      startContainer = _getFirstByXPath2[0];

  var _getFirstByXPath3 = getFirstByXPath(data.endContainer, data.endOffset, referenceElement),
      _getFirstByXPath4 = XpathRangeSelector_slicedToArray(_getFirstByXPath3, 1),
      endContainer = _getFirstByXPath4[0];

  return !!startContainer && !!endContainer;
}
function XpathRangeSelector_load(highlighter, data) {
  var range = highlighter.document.createRange();
  var referenceElement = highlighter.getReferenceElement(data.referenceElementId);

  var _getFirstByXPath5 = getFirstByXPath(data.startContainer, data.startOffset, referenceElement),
      _getFirstByXPath6 = XpathRangeSelector_slicedToArray(_getFirstByXPath5, 2),
      startContainer = _getFirstByXPath6[0],
      startOffset = _getFirstByXPath6[1];

  var _getFirstByXPath7 = getFirstByXPath(data.endContainer, data.endOffset, referenceElement),
      _getFirstByXPath8 = XpathRangeSelector_slicedToArray(_getFirstByXPath7, 2),
      endContainer = _getFirstByXPath8[0],
      endOffset = _getFirstByXPath8[1];

  range.setStart(startContainer, startOffset);
  range.setEnd(endContainer, endOffset);
  return range;
}
// CONCATENATED MODULE: ./src/serializationStrategies/index.ts


function getDeserializer(data) {
  switch (data.type) {
    case discriminator:
      return {
        isLoadable: function isLoadable(highlighter) {
          return TextPositionSelector_isLoadable(highlighter, data);
        },
        load: function load(highlighter) {
          return TextPositionSelector_load(highlighter, data);
        }
      };

    case XpathRangeSelector_discriminator:
      return {
        isLoadable: function isLoadable(highlighter) {
          return XpathRangeSelector_isLoadable(highlighter, data);
        },
        load: function load(highlighter) {
          return XpathRangeSelector_load(highlighter, data);
        }
      };

    default:
      (function (bad) {
        throw new Error("not a valid serialization: ".concat(JSON.stringify(bad)));
        return null;
      })(data);

      return {
        isLoadable: function isLoadable() {
          return false;
        },
        load: function load(highlighter) {
          return highlighter.document.createRange();
        }
      };
  }
}
// CONCATENATED MODULE: ./src/SerializedHighlight.ts


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





var SerializedHighlight_SerializedHighlight =
/*#__PURE__*/
function () {
  function SerializedHighlight(data) {
    _classCallCheck(this, SerializedHighlight);

    _defineProperty(this, "_data", void 0);

    _defineProperty(this, "deserializer", void 0);

    this._data = data;
    this.deserializer = getDeserializer(data);
  }

  _createClass(SerializedHighlight, [{
    key: "isLoadable",
    value: function isLoadable(highlighter) {
      return this.deserializer.isLoadable(highlighter);
    }
  }, {
    key: "load",
    value: function load(highlighter) {
      var range = this.deserializer.load(highlighter);
      return new Highlight_Highlight(this.id, range, this.content);
    }
  }, {
    key: "data",
    get: function get() {
      return this._data;
    }
  }, {
    key: "id",
    get: function get() {
      return this.data.id;
    }
  }, {
    key: "content",
    get: function get() {
      return this.data.content;
    }
  }]);

  return SerializedHighlight;
}();

_defineProperty(SerializedHighlight_SerializedHighlight, "defaultSerializer", XpathRangeSelector_serialize);


// CONCATENATED MODULE: ./src/Highlight.ts









function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { Highlight_defineProperty(target, key, source[key]); }); } return target; }

function Highlight_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Highlight_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Highlight_createClass(Constructor, protoProps, staticProps) { if (protoProps) Highlight_defineProperties(Constructor.prototype, protoProps); if (staticProps) Highlight_defineProperties(Constructor, staticProps); return Constructor; }

function Highlight_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var FOCUS_CSS = 'focus';

var Highlight_Highlight =
/*#__PURE__*/
function () {
  function Highlight(arg, arg2, content) {
    Highlight_classCallCheck(this, Highlight);

    Highlight_defineProperty(this, "_id", void 0);

    Highlight_defineProperty(this, "_content", void 0);

    Highlight_defineProperty(this, "_range", void 0);

    Highlight_defineProperty(this, "_elements", []);

    if (arg instanceof Range) {
      // TODO - something more random here
      this._id = new Date().getTime().toString();
      this._range = arg;
      this._content = arg2;
    } else if (content) {
      this._id = arg;
      this._range = arg2;
      this._content = content;
    } else {
      throw new Error('invalid constructor arguments');
    }
  }

  Highlight_createClass(Highlight, [{
    key: "isAttached",
    value: function isAttached() {
      // TODO - check and see if these are in the dom
      return this.elements.length > 0;
    }
  }, {
    key: "scrollTo",
    value: function scrollTo(handler) {
      if (!this.isAttached()) {
        return this;
      } else if (handler) {
        handler(this.elements);
      } else {
        this.elements[0].scrollIntoView();
      }

      return this;
    }
  }, {
    key: "focus",
    value: function focus() {
      this.elements.forEach(function (el) {
        return el.classList.add(FOCUS_CSS);
      });
      return this;
    }
  }, {
    key: "intersects",
    value: function intersects(range) {
      if (!range) {
        return false;
      }

      return this.range.compareBoundaryPoints(Range.START_TO_END, range) !== -1 && this.range.compareBoundaryPoints(Range.END_TO_START, range) !== 1;
    }
  }, {
    key: "serialize",
    value: function serialize(referenceElement) {
      referenceElement = referenceElement || dom(this.range.commonAncestorContainer).closest('[id]');
      return new SerializedHighlight_SerializedHighlight(_objectSpread({
        content: this.content,
        id: this.id
      }, SerializedHighlight_SerializedHighlight.defaultSerializer(this.range, referenceElement)));
    }
  }, {
    key: "id",
    get: function get() {
      return this._id;
    }
  }, {
    key: "content",
    get: function get() {
      return this._content;
    }
  }, {
    key: "range",
    get: function get() {
      return this._range;
    }
  }, {
    key: "elements",
    set: function set(elements) {
      if (this.elements.length > 0) {
        throw new Error("Hightlight elements aren't reloadable");
      }

      this._elements = elements;
    },
    get: function get() {
      return this._elements;
    }
  }]);

  return Highlight;
}();


// CONCATENATED MODULE: ./src/rangeContents.ts




var rangeContentsString = function rangeContentsString(range) {
  var fragment = rangeContents_cloneRangeContents(range);
  var container = document.createElement('div');

  var removeAll = function removeAll(nodes) {
    return nodes.forEach(function (element) {
      return element.remove();
    });
  };

  container.appendChild(fragment);
  removeAll(container.querySelectorAll('.MathJax'));
  removeAll(container.querySelectorAll('.MathJax_Display'));
  removeAll(container.querySelectorAll('.MathJax_Preview'));
  removeAll(container.querySelectorAll('.MJX_Assistive_MathML'));
  container.querySelectorAll('script[type="math/mml"]').forEach(function (element) {
    var template = document.createElement('template');
    template.innerHTML = element.textContent || '';
    var math = template.content.firstChild;

    if (math && element.parentElement) {
      element.parentElement.insertBefore(math, element);
      element.remove();
    }
  });
  return container.innerHTML;
};
var rangeContents_cloneRangeContents = function cloneRangeContents(range) {
  var tableTags = ['TR', 'TBODY', 'TABLE'];
  var fragment = document.createDocumentFragment();

  var getStartNode = function getStartNode() {
    if (range.commonAncestorContainer.nodeType === 3
    /* #text */
    ) {
        return range.commonAncestorContainer.parentNode;
      } else if (tableTags.indexOf(range.commonAncestorContainer.nodeName) > -1) {
      return dom(range.commonAncestorContainer).closest('table').parentNode;
    } else {
      return range.commonAncestorContainer;
    }
  };

  cloneForRange(getStartNode(), range).childNodes.forEach(function (node) {
    return fragment.appendChild(node.cloneNode(true));
  });
  return fragment;
};

function cloneForRange(element, range) {
  var foundStart = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var isStart = function isStart(node) {
    return node.parentElement === range.startContainer && Array.prototype.indexOf.call(range.startContainer.childNodes, node) === range.startOffset;
  };

  var isEnd = function isEnd(node) {
    return node.parentElement === range.endContainer && Array.prototype.indexOf.call(range.endContainer.childNodes, node) === range.endOffset;
  };

  var result = element.cloneNode();

  if (element.nodeType === 3
  /* #text */
  ) {
      if (element === range.startContainer && element === range.endContainer) {
        result.textContent = (element.textContent || '').substring(range.startOffset, range.endOffset + 1);
      } else if (element === range.startContainer) {
        result.textContent = (element.textContent || '').substring(range.startOffset);
      } else if (element === range.endContainer) {
        result.textContent = (element.textContent || '').substring(0, range.endOffset);
      } else {
        result.textContent = element.textContent;
      }
    } else {
    var node = element.firstChild;
    var foundEnd;

    while (node && !isEnd(node) && !foundEnd) {
      foundStart = foundStart || isStart(node);
      foundEnd = dom(node).isParent(range.endContainer);

      if (foundStart && !foundEnd) {
        var copy = node.cloneNode(true);
        result.appendChild(copy);
      } else if (foundStart || dom(node).isParent(range.startContainer)) {
        var _copy = cloneForRange(node, range, foundStart);

        result.appendChild(_copy);
        foundStart = true;
      }

      node = node.nextSibling;
    }
  }

  return result;
}
// CONCATENATED MODULE: ./src/removeHighlightWrappers.js




var removeHighlightWrappers_DATA_ATTR = 'data-highlighted';
var removeHighlightWrappers_NODE_TYPE = {
  ELEMENT_NODE: 1,
  TEXT_NODE: 3
};
/**
 * Removes highlights from element. If element is a highlight itself, it is removed as well.
 * If no element is given, all highlights all removed.
 * @param {HTMLElement} [element] - element to remove highlights from
 */

/* harmony default export */ var removeHighlightWrappers = (function (highlight) {
  highlight.elements.forEach(removeHighlightElement);
});

function removeHighlightElement(element) {
  var container = element,
      highlights = getHighlights(container);

  function mergeSiblingTextNodes(textNode) {
    var prev = textNode.previousSibling,
        next = textNode.nextSibling;

    if (prev && prev.nodeType === removeHighlightWrappers_NODE_TYPE.TEXT_NODE) {
      textNode.nodeValue = prev.nodeValue + textNode.nodeValue;
      dom(prev).remove();
    }

    if (next && next.nodeType === removeHighlightWrappers_NODE_TYPE.TEXT_NODE) {
      textNode.nodeValue = textNode.nodeValue + next.nodeValue;
      dom(next).remove();
    }
  }

  function removeHighlight(highlight) {
    var textNodes = dom(highlight).unwrap();
    textNodes.forEach(function (node) {
      mergeSiblingTextNodes(node);
    });
  }

  removeHighlightWrappers_sortByDepth(highlights, true);
  highlights.forEach(removeHighlight);
}
/**
 * Returns highlights from given container.
 * @param {HTMLElement} container - return highlights from this element
 * @returns {Array} - array of highlights.
 */


function getHighlights(container) {
  var nodeList = container.querySelectorAll('[' + removeHighlightWrappers_DATA_ATTR + ']'),
      highlights = Array.prototype.slice.call(nodeList);

  if (container.hasAttribute(removeHighlightWrappers_DATA_ATTR)) {
    highlights.push(container);
  }

  return highlights;
}
/**
 * Sorts array of DOM elements by its depth in DOM tree.
 * @param {HTMLElement[]} arr - array to sort.
 * @param {boolean} descending - order of sort.
 */


function removeHighlightWrappers_sortByDepth(arr, descending) {
  arr.sort(function (a, b) {
    return dom(descending ? b : a).parents().length - dom(descending ? a : b).parents().length;
  });
}
// CONCATENATED MODULE: ./src/selection.ts


var getRange = function getRange(selection) {
  if (selection.rangeCount < 1) {
    throw new Error('selection had no ranges');
  } // set up range to modify


  var range = selection.getRangeAt(0).cloneRange();
  var endRange = selection.getRangeAt(selection.rangeCount - 1);
  range.setEnd(endRange.endContainer, endRange.endOffset);
  return range;
};
var selection_snapSelection = function snapSelection(selection, options) {
  var range = getRange(selection);

  if (!range) {
    return;
  }

  if (options.snapTableRows) {
    if (['TBODY', 'TR'].indexOf(range.commonAncestorContainer.nodeName) > -1) {
      var startRow = dom(range.startContainer).farthest('tr');
      var endRow = dom(range.endContainer).farthest('tr');

      if (startRow) {
        range.setStartBefore(startRow.firstElementChild.firstChild);
      }

      if (endRow) {
        range.setEndAfter(endRow.lastElementChild.lastChild);
      }
    }
  }

  if (options.snapMathJax) {
    var getMath = function getMath(node) {
      return dom(node).farthest('.MathJax,.MathJax_Display');
    };

    var startMath = getMath(range.startContainer.nodeType === 3
    /* #text */
    ? range.startContainer : range.startContainer.childNodes[range.startOffset] || range.startContainer);

    if (startMath) {
      range.setStartBefore(startMath);
    }

    var endMath = getMath(range.endContainer.nodeType === 3
    /* #text */
    ? range.endContainer : range.endContainer.childNodes[range.endOffset - 1] || range.endContainer);

    if (endMath) {
      var endElement = dom(endMath.nextSibling).matches('script[type="math/mml"]') ? endMath.nextSibling : endMath;
      var endContainer = endElement.parentNode;
      range.setEnd(endContainer, Array.prototype.indexOf.call(endContainer.childNodes, endElement) + 1);
    }
  }

  if (options.snapWords) {
    var shouldGobbleCharacter = function shouldGobbleCharacter(container, targetOffset) {
      return targetOffset >= 0 && container.length >= targetOffset && /\S/.test(container.substr(targetOffset, 1));
    };

    var shouldGobbleBackward = function shouldGobbleBackward() {
      return range.startContainer.textContent && shouldGobbleCharacter(range.startContainer.textContent, range.startOffset - 1);
    };

    var shouldGobbleForward = function shouldGobbleForward() {
      return range.endContainer.textContent && shouldGobbleCharacter(range.endContainer.textContent, range.endOffset);
    };

    var gobbleBackward = function gobbleBackward() {
      range.setStart(range.startContainer, range.startOffset - 1);
    };

    var gobbleForward = function gobbleForward() {
      range.setEnd(range.endContainer, range.endOffset + 1);
    };

    if (range.startContainer.nodeName === '#text') {
      while (shouldGobbleBackward()) {
        gobbleBackward();
      }
    }

    if (range.endContainer.nodeName === '#text') {
      while (shouldGobbleForward()) {
        gobbleForward();
      }
    }
  }

  selection.removeAllRanges();
  selection.addRange(range);
  return range;
};
// CONCATENATED MODULE: ./src/Highlighter.ts









function Highlighter_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Highlighter_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Highlighter_createClass(Constructor, protoProps, staticProps) { if (protoProps) Highlighter_defineProperties(Constructor.prototype, protoProps); if (staticProps) Highlighter_defineProperties(Constructor, staticProps); return Constructor; }

function Highlighter_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }








var Highlighter_Highlighter =
/*#__PURE__*/
function () {
  function Highlighter(container) {
    var _this = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    Highlighter_classCallCheck(this, Highlighter);

    Highlighter_defineProperty(this, "container", void 0);

    Highlighter_defineProperty(this, "highlights", {});

    Highlighter_defineProperty(this, "options", void 0);

    Highlighter_defineProperty(this, "onMouseup", function () {
      var selection = _this.document.getSelection();

      if (!selection) {
        return;
      }

      if (selection.isCollapsed) {
        _this.onClick(selection);
      } else {
        _this.onSelect(selection);
      }
    });

    this.container = container;
    this.options = options;
    this.container.addEventListener('mouseup', this.onMouseup);
  }

  Highlighter_createClass(Highlighter, [{
    key: "unmount",
    value: function unmount() {
      this.container.removeEventListener('mouseup', this.onMouseup);
    }
  }, {
    key: "erase",
    value: function erase(highlight) {
      removeHighlightWrappers(highlight);
      delete this.highlights[highlight.id];
    }
  }, {
    key: "highlight",
    value: function highlight(_highlight) {
      if (_highlight instanceof SerializedHighlight_SerializedHighlight && _highlight.isLoadable(this)) {
        return this.highlight(_highlight.load(this));
      } else if (_highlight instanceof Highlight_Highlight) {
        this.highlights[_highlight.id] = _highlight;
        injectHighlightWrappers(_highlight, this.options);
      }
    }
  }, {
    key: "getHighlight",
    value: function getHighlight(id) {
      return this.highlights[id];
    }
  }, {
    key: "getReferenceElement",
    value: function getReferenceElement(id) {
      return this.container.querySelector("[id=\"".concat(id, "\"]"));
    }
  }, {
    key: "clearFocus",
    value: function clearFocus() {
      this.container.querySelectorAll(".".concat(this.options.className, ".").concat(FOCUS_CSS)).forEach(function (el) {
        return el.classList.remove(FOCUS_CSS);
      });
    }
  }, {
    key: "getHighlights",
    value: function getHighlights() {
      var highlights = Object.values(this.highlights);
      highlights.sort(function (a, b) {
        return a.range.compareBoundaryPoints(Range.START_TO_START, b.range);
      });
      return highlights;
    }
  }, {
    key: "onClick",
    value: function onClick(selection) {
      var _this2 = this;

      var onClick = this.options.onClick;

      var clickedHighlight = function clickedHighlight() {
        if (selection.rangeCount < 1) {
          return;
        }

        var range = getRange(selection);
        return Object.values(_this2.highlights).find(function (other) {
          return other.intersects(range);
        });
      };

      if (onClick) {
        onClick(clickedHighlight());
      }
    }
  }, {
    key: "onSelect",
    value: function onSelect(selection) {
      var onSelect = this.options.onSelect;
      var range = selection_snapSelection(selection, this.options);

      if (onSelect && range) {
        var highlights = Object.values(this.highlights).filter(function (other) {
          return other.intersects(range);
        });

        if (highlights.length === 0) {
          var highlight = new Highlight_Highlight(range, rangeContentsString(range));
          onSelect(highlights, highlight);
        } else {
          onSelect(highlights);
        }
      }
    }
  }, {
    key: "document",
    get: function get() {
      if (!this.container.ownerDocument) {
        throw new Error('highlighter container is not mounted to a document!');
      }

      return this.container.ownerDocument;
    }
  }]);

  return Highlighter;
}();


// CONCATENATED MODULE: ./src/index.js
/* concated harmony reexport Highlight */__webpack_require__.d(__webpack_exports__, "Highlight", function() { return Highlight_Highlight; });
/* concated harmony reexport SerializedHighlight */__webpack_require__.d(__webpack_exports__, "SerializedHighlight", function() { return SerializedHighlight_SerializedHighlight; });



/* harmony default export */ var src = __webpack_exports__["default"] = (Highlighter_Highlighter);


/***/ })
/******/ ]);
});