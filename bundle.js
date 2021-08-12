(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
'use strict';

var objectAssign = require('object-assign');

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:
// NB: The URL to the CommonJS spec is kept just for tradition.
//     node-assert has evolved a lot since then, both in API and behavior.

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = require('util/');
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

// Expose a strict only variant of assert
function strict(value, message) {
  if (!value) fail(value, true, message, '==', strict);
}
assert.strict = objectAssign(strict, assert, {
  equal: assert.strictEqual,
  deepEqual: assert.deepStrictEqual,
  notEqual: assert.notStrictEqual,
  notDeepEqual: assert.notDeepStrictEqual
});
assert.strict.strict = assert.strict;

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"object-assign":5,"util/":4}],2:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],3:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],4:[function(require,module,exports){
(function (process,global){(function (){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":3,"_process":6,"inherits":2}],5:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],6:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],7:[function(require,module,exports){
var createPerspectiveCamera = require("pex-cam/perspective");
var createOrbiter = require("pex-cam/orbiter");

main();

function main() {
  const gl = createWebGLCanvas();
  if (gl === null) {
    console.log(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  var actors = [
    new RotatingCube(gl),
    new RotatingCubeNormalMapping(gl),
    new StaticCube(gl),
    new SkyBox(gl),
  ];
  actors[0].position = [-2, 0, 0];
  actors[1].position = [2, 0, 0];
  actors[2].position = [0, -3, 0];
  actors[2].scale = [10, 0.2, 10];
  actors[3].scale = [1000, 1000, 1000];

  var camera = createPerspectiveCamera({
    position: [0, 0, 5],
    target: [0, 0, 0],
    up: [0, 1, 0],
    fov: (45 * Math.PI) / 180,
    aspect: gl.canvas.clientWidth / gl.canvas.clientHeight,
    near: 0.1,
    far: 10000,
  });

  var orbiter = createOrbiter({
    camera: camera,
    element: gl.canvas,
    easing: 0.1,
    drag: true,
    zoom: true,
    pan: true,
  });

  // Draw the scene repeatedly
  var then = 0;
  function render(now) {
    now *= 0.001; // Convert to seconds
    const deltaTime = now - then;
    then = now;

    // Update all actors first
    for (let actor of actors) {
      actor.tick(deltaTime);
    }

    clearScene(gl);
    for (let actor of actors) {
      actor.draw(gl, camera.projectionMatrix, camera.viewMatrix);
    }
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

},{"pex-cam/orbiter":13,"pex-cam/perspective":14}],8:[function(require,module,exports){
var lerp = require('lerp');

var PI = Math.PI;
var TWO_PI = Math.PI * 2;

function interpolateAngle(fromAngle, toAngle, t) {
    fromAngle = (fromAngle + TWO_PI) % TWO_PI;
    toAngle = (toAngle + TWO_PI) % TWO_PI;

    var diff = Math.abs(fromAngle - toAngle);
    if (diff < PI) {
        return lerp(fromAngle, toAngle, t);
    }
    else {
        if (fromAngle > toAngle) {
            fromAngle = fromAngle - TWO_PI;
            return lerp(fromAngle, toAngle, t);
            return from;
        }
        else if (toAngle > fromAngle) {
            toAngle = toAngle - TWO_PI;
            return lerp(fromAngle, toAngle, t);
            return from;
        }
    }
}

module.exports = interpolateAngle;

},{"lerp":10}],9:[function(require,module,exports){
function latLonToXyz (lat, lon, out) {
  out = out || [0, 0, 0]
  const phi = (lon + 90) / 180 * Math.PI
  const theta = (90 - lat) / 180 * Math.PI

  out[0] = Math.sin(theta) * Math.sin(phi)
  out[1] = Math.cos(theta)
  out[2] = Math.sin(theta) * Math.cos(phi)

  return out
}

module.exports = latLonToXyz

},{}],10:[function(require,module,exports){
function lerp(v0, v1, t) {
    return v0*(1-t)+v1*t
}
module.exports = lerp
},{}],11:[function(require,module,exports){
var rootPosition = { left: 0, top: 0 }

module.exports = mouseEventOffset
function mouseEventOffset (ev, target, out) {
  target = target || ev.currentTarget || ev.srcElement
  if (!Array.isArray(out)) {
    out = [ 0, 0 ]
  }
  var cx = ev.clientX || 0
  var cy = ev.clientY || 0
  var rect = getBoundingClientOffset(target)
  out[0] = cx - rect.left
  out[1] = cy - rect.top
  return out
}

function getBoundingClientOffset (element) {
  if (element === window ||
      element === document ||
      element === document.body) {
    return rootPosition
  } else {
    return element.getBoundingClientRect()
  }
}

},{}],12:[function(require,module,exports){
(function (process){(function (){
// Generated by CoffeeScript 1.12.2
(function() {
  var getNanoSeconds, hrtime, loadTime, moduleLoadTime, nodeLoadTime, upTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - nodeLoadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    moduleLoadTime = getNanoSeconds();
    upTime = process.uptime() * 1e9;
    nodeLoadTime = moduleLoadTime - upTime;
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(this);



}).call(this)}).call(this,require('_process'))
},{"_process":6}],13:[function(require,module,exports){
'use strict'
const vec3 = require('pex-math/vec3')
const mat4 = require('pex-math/mat4')
const ray = require('pex-geom/ray')
const clamp = require('pex-math/utils').clamp
const raf = require('raf')
const interpolateAngle = require('interpolate-angle')
const lerp = require('pex-math/utils').lerp
const toRadians = require('pex-math/utils').toRadians
const toDegrees = require('pex-math/utils').toDegrees
const latLonToXyz = require('latlon-to-xyz')
const xyzToLatLon = require('xyz-to-latlon')
const eventOffset = require('mouse-event-offset')

function offset (e, target) {
  if (e.touches) return eventOffset(e.touches[0], target)
  else return eventOffset(e, target)
}

function Orbiter (opts) {
  // TODO: split into internal state and public state
  const initialState = {
    camera: opts.camera,
    invViewMatrix: mat4.create(),
    dragging: false,
    lat: 0, // Y
    minLat: -89.5,
    maxLat: 89.5,
    lon: 0, // XZ
    minLon: -Infinity,
    maxLon: Infinity,
    currentLat: 0,
    currentLon: 0,
    easing: 1,
    element: opts.element || window,
    width: 0,
    height: 0,
    clickPosWindow: [0, 0],
    dragPos: [0, 0, 0],
    dragPosWindow: [0, 0],
    distance: 1,
    currentDistance: 1,
    minDistance: 1,
    maxDistance: 1,
    zoomSlowdown: 400,
    zoom: true,
    pan: true,
    drag: true,
    dragSlowdown: 4,
    clickTarget: [0, 0, 0],
    clickPosPlane: [0, 0, 0],
    dragPosPlane: [0, 0, 0],
    clickPosWorld: [0, 0, 0],
    dragPosWorld: [0, 0, 0],
    panPlane: null,
    autoUpdate: true    
  }

  this.set(initialState)
  this.set(opts)
  this.setup()
}

Orbiter.prototype.set = function (opts) {
  if (opts.camera) {
    const distance = vec3.distance(opts.camera.position, opts.camera.target)
    const latLon = xyzToLatLon(vec3.normalize(vec3.sub(vec3.copy(opts.camera.position), opts.camera.target)))
    this.lat = latLon[0]
    this.lon = latLon[1]
    this.currentLat = this.lat
    this.currentLon = this.lon
    this.distance = distance
    this.currentDistance = this.distance
    this.minDistance = opts.minDistance || distance / 10
    this.maxDistance = opts.maxDistance || distance * 10
  }

  Object.assign(this, opts)
}

Orbiter.prototype.updateWindowSize = function () {
  const width = this.element.clientWidth || this.element.innerWidth
  const height = this.element.clientHeight || this.element.innerHeight
  if (width !== this.width) {
    this.width = width
    this.height = height
    this.radius = Math.min(this.width / 2, this.height / 2)
  }
}

Orbiter.prototype.updateCamera = function () {
  // instad of rotating the object we want to move camera around it
  // state.currRot[3] *= -1
  if (!this.camera) return

  const position = this.camera.position
  const target = this.camera.target

  this.lat = clamp(this.lat, this.minLat, this.maxLat)
  this.lon = clamp(this.lon, this.minLon, this.maxLon) % 360

  this.currentLat = toDegrees(
    interpolateAngle(
      (toRadians(this.currentLat) + 2 * Math.PI) % (2 * Math.PI),
      (toRadians(this.lat) + 2 * Math.PI) % (2 * Math.PI),
      this.easing
    )
  )
  this.currentLon = toDegrees(
    interpolateAngle(
      (toRadians(this.currentLon) + 2 * Math.PI) % (2 * Math.PI),
      (toRadians(this.lon) + 2 * Math.PI) % (2 * Math.PI),
      this.easing
    )
  )
  this.currentDistance = lerp(this.currentDistance, this.distance, this.easing)

  // set new camera position according to the current
  // rotation at distance relative to target
  latLonToXyz(this.currentLat, this.currentLon, position)
  vec3.scale(position, this.currentDistance)
  vec3.add(position, target)

  this.camera.set({
    position: position
  })
}

Orbiter.prototype.setup = function () {
  var orbiter = this

  function down (x, y, shift) {
    orbiter.dragging = true
    orbiter.dragPos[0] = x
    orbiter.dragPos[1] = y
    if (shift && orbiter.pan) {
      orbiter.clickPosWindow[0] = x
      orbiter.clickPosWindow[1] = y
      vec3.set(orbiter.clickTarget, orbiter.camera.target)
      const targetInViewSpace = vec3.multMat4(vec3.copy(orbiter.clickTarget), orbiter.camera.viewMatrix)
      orbiter.panPlane = [targetInViewSpace, [0, 0, 1]]
      ray.hitTestPlane(
        orbiter.camera.getViewRay(orbiter.clickPosWindow[0], orbiter.clickPosWindow[1], orbiter.width, orbiter.height),
        orbiter.panPlane[0],
        orbiter.panPlane[1],
        orbiter.clickPosPlane
      )
      ray.hitTestPlane(
        orbiter.camera.getViewRay(orbiter.dragPosWindow[0], orbiter.dragPosWindow[1], orbiter.width, orbiter.height),
        orbiter.panPlane[0],
        orbiter.panPlane[1],
        orbiter.dragPosPlane
      )
    } else {
      orbiter.panPlane = null
    }
  }

  function move (x, y, shift) {
    if (!orbiter.dragging) {
      return
    }
    if (shift && orbiter.panPlane) {
      orbiter.dragPosWindow[0] = x
      orbiter.dragPosWindow[1] = y
      ray.hitTestPlane(
        orbiter.camera.getViewRay(orbiter.clickPosWindow[0], orbiter.clickPosWindow[1], orbiter.width, orbiter.height),
        orbiter.panPlane[0],
        orbiter.panPlane[1],
        orbiter.clickPosPlane
      )
      ray.hitTestPlane(
        orbiter.camera.getViewRay(orbiter.dragPosWindow[0], orbiter.dragPosWindow[1], orbiter.width, orbiter.height),
        orbiter.panPlane[0],
        orbiter.panPlane[1],
        orbiter.dragPosPlane
      )
      mat4.set(orbiter.invViewMatrix, orbiter.camera.viewMatrix)
      mat4.invert(orbiter.invViewMatrix)
      vec3.multMat4(vec3.set(orbiter.clickPosWorld, orbiter.clickPosPlane), orbiter.invViewMatrix)
      vec3.multMat4(vec3.set(orbiter.dragPosWorld, orbiter.dragPosPlane), orbiter.invViewMatrix)
      const diffWorld = vec3.sub(vec3.copy(orbiter.dragPosWorld), orbiter.clickPosWorld)
      const target = vec3.sub(vec3.copy(orbiter.clickTarget), diffWorld)
      orbiter.camera.set({ target: target })
      orbiter.updateCamera()
    } else if (orbiter.drag) {
      const dx = x - orbiter.dragPos[0]
      const dy = y - orbiter.dragPos[1]
      orbiter.dragPos[0] = x
      orbiter.dragPos[1] = y

      orbiter.lat += dy / orbiter.dragSlowdown
      orbiter.lon -= dx / orbiter.dragSlowdown

      // TODO: how to have resolution independed scaling? will this code behave differently with retina/pixelRatio=2?
      orbiter.updateCamera()
    }
  }

  function up () {
    orbiter.dragging = false
    orbiter.panPlane = null
  }

  function scroll (dy) {
    if (!orbiter.zoom) {
      return false
    }
    orbiter.distance *= 1 + dy / orbiter.zoomSlowdown
    orbiter.distance = clamp(orbiter.distance, orbiter.minDistance, orbiter.maxDistance)
    orbiter.updateCamera()
    return true
  }

  function onMouseDown (e) {
    orbiter.updateWindowSize()
    const pos = offset(e, orbiter.element)
    down(
      pos[0],
      pos[1],
      e.shiftKey || (e.touches && e.touches.length === 2)
    )
  }

  function onMouseMove (e) {
    const pos = offset(e, orbiter.element)
    move(
      pos[0],
      pos[1],
      e.shiftKey || (e.touches && e.touches.length === 2)
    )
  }

  function onMouseUp (e) {
    up()
  }

  function onWheel (e) {
    if (scroll(e.deltaY) === true) {
      e.preventDefault()
      return false
    }
  }

  function onTouchStart (e) {
    e.preventDefault()
    onMouseDown(e)
  }

  this._onMouseDown = onMouseDown
  this._onTouchStart = onTouchStart
  this._onMouseMove = onMouseMove
  this._onMouseUp = onMouseUp
  this._onWheel = onWheel

  this.element.addEventListener('mousedown', onMouseDown)
  this.element.addEventListener('touchstart', onTouchStart)
  this.element.addEventListener('wheel', onWheel)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('touchmove', onMouseMove, { passive: false })
  window.addEventListener('mouseup', onMouseUp)
  window.addEventListener('touchend', onMouseUp)

  this.updateCamera()

  if (this.autoUpdate) {
    const self = this
    this._rafHandle = raf(function tick () {
      orbiter.updateCamera()
      self._rafHandle = raf(tick)
    })
  }
}

Orbiter.prototype.dispose = function () {
  this.element.removeEventListener('mousedown', this._onMouseDown)
  this.element.removeEventListener('touchstart', this._onTouchStart)
  this.element.removeEventListener('wheel', this._onWheel)
  window.removeEventListener('mousemove', this._onMouseMove)
  window.removeEventListener('touchmove', this._onMouseMove)
  window.removeEventListener('mouseup', this._onMouseUp)
  window.removeEventListener('touchend', this._onMouseUp)
  raf.cancel(this._rafHandle)
  this.camera = null
}

module.exports = function createOrbiter (opts) {
  return new Orbiter(opts)
}

},{"interpolate-angle":8,"latlon-to-xyz":9,"mouse-event-offset":11,"pex-geom/ray":15,"pex-math/mat4":16,"pex-math/utils":17,"pex-math/vec3":18,"raf":19,"xyz-to-latlon":20}],14:[function(require,module,exports){
const vec3 = require('pex-math/vec3')
const mat4 = require('pex-math/mat4')

function setFrustumOffset (camera, x, y, width, height, widthTotal, heightTotal) {
  // console.log('frustum', x, y, width, height, widthTotal, heightTotal)
  widthTotal = widthTotal === undefined ? width : widthTotal
  heightTotal = heightTotal === undefined ? height : heightTotal

  var near = camera.near
  var far = camera.far
  var fov = camera.fov

  var aspectRatio = widthTotal / heightTotal

  var top = Math.tan(fov * 0.5) * near
  var bottom = -top
  var left = aspectRatio * bottom
  var right = aspectRatio * top
  var width_ = Math.abs(right - left)
  var height_ = Math.abs(top - bottom)
  var widthNormalized = width_ / widthTotal
  var heightNormalized = height_ / heightTotal

  var l = left + x * widthNormalized
  var r = left + (x + width) * widthNormalized
  var b = top - (y + height) * heightNormalized
  var t = top - y * heightNormalized

  camera.aspect = aspectRatio
  mat4.frustum(camera.projectionMatrix, l, r, b, t, near, far)
}

function PerspectiveCamera (opts) {
  this.set({
    projectionMatrix: mat4.create(),
    invViewMatrix: mat4.create(),
    viewMatrix: mat4.create(),
    position: [0, 0, 3],
    target: [0, 0, 0],
    up: [0, 1, 0],
    fov: Math.PI / 3,
    aspect: 1,
    near: 0.1,
    far: 100
  })

  this.set(opts)
}

PerspectiveCamera.prototype.set = function (opts) {
  Object.assign(this, opts)

  if (opts.position || opts.target || opts.up) {
    mat4.lookAt(
      this.viewMatrix,
      this.position,
      this.target,
      this.up
    )
    mat4.set(this.invViewMatrix, this.viewMatrix)
    mat4.invert(this.invViewMatrix)
  }

  if (opts.fov || opts.aspect || opts.near || opts.far) {
    mat4.perspective(
      this.projectionMatrix,
      this.fov,
      this.aspect,
      this.near,
      this.far
    )
  }

  if (this.frustum) {
    setFrustumOffset(
      this,
      this.frustum.offset[0], this.frustum.offset[1],
      this.frustum.size[0], this.frustum.size[1],
      this.frustum.totalSize[0], this.frustum.totalSize[1]
    )
  }
}

PerspectiveCamera.prototype.getViewRay = function (x, y, windowWidth, windowHeight) {
  if (this.frustum) {
    x += this.frustum.offset[0]
    y += this.frustum.offset[1]
    windowWidth = this.frustum.totalSize[0]
    windowHeight = this.frustum.totalSize[1]
  }
  let nx = 2 * x / windowWidth - 1
  let ny = 1 - 2 * y / windowHeight

  let hNear = 2 * Math.tan(this.fov / 2) * this.near
  let wNear = hNear * this.aspect

  nx *= (wNear * 0.5)
  ny *= (hNear * 0.5)

  let origin = [0, 0, 0]
  let direction = vec3.normalize([nx, ny, -this.near])
  let ray = [origin, direction]

  return ray
}

PerspectiveCamera.prototype.getWorldRay = function (x, y, windowWidth, windowHeight) {
  let ray = this.getViewRay(x, y, windowWidth, windowHeight)
  let origin = ray[0]
  let direction = ray[1]

  vec3.multMat4(origin, this.invViewMatrix)
  // this is correct as origin is [0, 0, 0] so direction is also a point
  vec3.multMat4(direction, this.invViewMatrix)

  // is this necessary?
  vec3.normalize(vec3.sub(direction, origin))

  return ray
}

module.exports = function createPerspectiveCamera (opts) {
  return new PerspectiveCamera(opts)
}

},{"pex-math/mat4":16,"pex-math/vec3":18}],15:[function(require,module,exports){
var vec3 = require('pex-math/vec3')

var TEMP_VEC3_0 = vec3.create()
var TEMP_VEC3_1 = vec3.create()
var TEMP_VEC3_2 = vec3.create()
var TEMP_VEC3_3 = vec3.create()
var TEMP_VEC3_4 = vec3.create()
var TEMP_VEC3_5 = vec3.create()
var TEMP_VEC3_6 = vec3.create()
var TEMP_VEC3_7 = vec3.create()

var EPSILON = 0.000001
function create () {
  return [[0, 0, 0], [0, 0, 1]]
}

function hitTestTriangle (a, triangle, out) {
  var p0 = triangle[0]
  var p1 = triangle[1]
  var p2 = triangle[2]

  var origin = a[0]
  var direction = a[1]

  var u = vec3.sub(vec3.set(TEMP_VEC3_0, p1), p0)
  var v = vec3.sub(vec3.set(TEMP_VEC3_1, p2), p0)
  var n = vec3.cross(vec3.set(TEMP_VEC3_2, u), v)

  if (vec3.length(n) < EPSILON) {
    return -1
  }

  var w0 = vec3.sub(vec3.set(TEMP_VEC3_3, origin), p0)
  var a_ = -vec3.dot(n, w0)
  var b = vec3.dot(n, direction)

  if (Math.abs(b) < EPSILON) {
    if (a_ === 0) {
      return -2
    }
    return -3
  }

  var r = a_ / b
  if (r < -EPSILON) {
    return -4
  }

  var I = vec3.add(vec3.set(TEMP_VEC3_4, origin), vec3.scale(vec3.set(TEMP_VEC3_5, direction), r))

  var uu = vec3.dot(u, u)
  var uv = vec3.dot(u, v)
  var vv = vec3.dot(v, v)

  var w = vec3.sub(vec3.set(TEMP_VEC3_6, I), p0)

  var wu = vec3.dot(w, u)
  var wv = vec3.dot(w, v)

  var D = uv * uv - uu * vv

  var s = (uv * wv - vv * wu) / D

  if (s < -EPSILON || s > 1.0 + EPSILON) {
    return -5
  }

  var t = (uv * wu - uu * wv) / D

  if (t < -EPSILON || (s + t) > 1.0 + EPSILON) {
    return -6
  }

  out = out === undefined ? vec3.create() : out

  vec3.set(out, u)
  vec3.scale(out, s)
  vec3.add(out, vec3.scale(vec3.set(TEMP_VEC3_7, v), t))
  vec3.add(out, p0)

  return 1
}

function hitTestPlane (a, point, normal, out) {
  var origin = vec3.set(TEMP_VEC3_0, a[0])
  var direction = vec3.set(TEMP_VEC3_1, a[1])

  point = vec3.set(TEMP_VEC3_2, point)

  var dotDirectionNormal = vec3.dot(direction, normal)

  if (dotDirectionNormal === 0) {
    return -1
  }

  var t = vec3.dot(vec3.sub(point, origin), normal) / dotDirectionNormal

  if (t < 0) {
    return -2
  }

  out = out === undefined ? vec3.create() : out
  vec3.set(out, vec3.add(origin, vec3.scale(direction, t)))
  return 1
}

// http://gamedev.stackexchange.com/questions/18436/most-efficient-aabb-vs-ray-collision-algorithms
function intersectsAABB (a, aabb) {
  var origin = a[0]
  var direction = a[1]

  var dirFracx = 1.0 / direction[0]
  var dirFracy = 1.0 / direction[1]
  var dirFracz = 1.0 / direction[2]

  var min = aabb[0]
  var max = aabb[1]

  var minx = min[0]
  var miny = min[1]
  var minz = min[2]

  var maxx = max[0]
  var maxy = max[1]
  var maxz = max[2]

  var t1 = (minx - origin[0]) * dirFracx
  var t2 = (maxx - origin[0]) * dirFracx

  var t3 = (miny - origin[1]) * dirFracy
  var t4 = (maxy - origin[1]) * dirFracy

  var t5 = (minz - origin[2]) * dirFracz
  var t6 = (maxz - origin[2]) * dirFracz

  var tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)), Math.min(t5, t6))
  var tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)), Math.max(t5, t6))

  return !(tmax < 0 || tmin > tmax)
}

module.exports = {
  create: create,
  hitTestTriangle: hitTestTriangle,
  hitTestPlane: hitTestPlane,
  intersectsAABB: intersectsAABB
}


},{"pex-math/vec3":18}],16:[function(require,module,exports){
var assert = require('assert')

function create () {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]
}

function set (a, b) {
  a[0] = b[0]
  a[1] = b[1]
  a[2] = b[2]
  a[3] = b[3]
  a[4] = b[4]
  a[5] = b[5]
  a[6] = b[6]
  a[7] = b[7]
  a[8] = b[8]
  a[9] = b[9]
  a[10] = b[10]
  a[11] = b[11]
  a[12] = b[12]
  a[13] = b[13]
  a[14] = b[14]
  a[15] = b[15]
  return a
}

function equals (a, b) {
  return a[0] === b[0] &&
    a[1] === b[1] &&
    a[2] === b[2] &&
    a[3] === b[3] &&
    a[4] === b[4] &&
    a[5] === b[5] &&
    a[6] === b[6] &&
    a[7] === b[7] &&
    a[8] === b[8] &&
    a[9] === b[9] &&
    a[10] === b[10] &&
    a[11] === b[11] &&
    a[12] === b[12] &&
    a[13] === b[13] &&
    a[14] === b[14] &&
    a[15] === b[15]
}

function copy (a) {
  return a.slice(0)
}

function _mult16 (a, b00, b01, b02, b03,
                b10, b11, b12, b13,
                b20, b21, b22, b23,
                b30, b31, b32, b33) {
  var a00 = a[0]
  var a01 = a[1]
  var a02 = a[2]
  var a03 = a[3]
  var a10 = a[4]
  var a11 = a[5]
  var a12 = a[6]
  var a13 = a[7]
  var a20 = a[8]
  var a21 = a[9]
  var a22 = a[10]
  var a23 = a[11]
  var a30 = a[12]
  var a31 = a[13]
  var a32 = a[14]
  var a33 = a[15]

  a[0] = (b00 * a00) + (b01 * a10) + (b02 * a20) + (b03 * a30)
  a[1] = (b00 * a01) + (b01 * a11) + (b02 * a21) + (b03 * a31)
  a[2] = (b00 * a02) + (b01 * a12) + (b02 * a22) + (b03 * a32)
  a[3] = (b00 * a03) + (b01 * a13) + (b02 * a23) + (b03 * a33)

  a[4] = (b10 * a00) + (b11 * a10) + (b12 * a20) + (b13 * a30)
  a[5] = (b10 * a01) + (b11 * a11) + (b12 * a21) + (b13 * a31)
  a[6] = (b10 * a02) + (b11 * a12) + (b12 * a22) + (b13 * a32)
  a[7] = (b10 * a03) + (b11 * a13) + (b12 * a23) + (b13 * a33)

  a[8] = (b20 * a00) + (b21 * a10) + (b22 * a20) + (b23 * a30)
  a[9] = (b20 * a01) + (b21 * a11) + (b22 * a21) + (b23 * a31)
  a[10] = (b20 * a02) + (b21 * a12) + (b22 * a22) + (b23 * a32)
  a[11] = (b20 * a03) + (b21 * a13) + (b22 * a23) + (b23 * a33)

  a[12] = (b30 * a00) + (b31 * a10) + (b32 * a20) + (b33 * a30)
  a[13] = (b30 * a01) + (b31 * a11) + (b32 * a21) + (b33 * a31)
  a[14] = (b30 * a02) + (b31 * a12) + (b32 * a22) + (b33 * a32)
  a[15] = (b30 * a03) + (b31 * a13) + (b32 * a23) + (b33 * a33)

  return a
}

function mult (a, b) {
  var a00 = a[0]
  var a01 = a[1]
  var a02 = a[2]
  var a03 = a[3]
  var a10 = a[4]
  var a11 = a[5]
  var a12 = a[6]
  var a13 = a[7]
  var a20 = a[8]
  var a21 = a[9]
  var a22 = a[10]
  var a23 = a[11]
  var a30 = a[12]
  var a31 = a[13]
  var a32 = a[14]
  var a33 = a[15]

  var b00 = b[0]
  var b01 = b[1]
  var b02 = b[2]
  var b03 = b[3]
  var b10 = b[4]
  var b11 = b[5]
  var b12 = b[6]
  var b13 = b[7]
  var b20 = b[8]
  var b21 = b[9]
  var b22 = b[10]
  var b23 = b[11]
  var b30 = b[12]
  var b31 = b[13]
  var b32 = b[14]
  var b33 = b[15]

  a[0] = (b00 * a00) + (b01 * a10) + (b02 * a20) + (b03 * a30)
  a[1] = (b00 * a01) + (b01 * a11) + (b02 * a21) + (b03 * a31)
  a[2] = (b00 * a02) + (b01 * a12) + (b02 * a22) + (b03 * a32)
  a[3] = (b00 * a03) + (b01 * a13) + (b02 * a23) + (b03 * a33)

  a[4] = (b10 * a00) + (b11 * a10) + (b12 * a20) + (b13 * a30)
  a[5] = (b10 * a01) + (b11 * a11) + (b12 * a21) + (b13 * a31)
  a[6] = (b10 * a02) + (b11 * a12) + (b12 * a22) + (b13 * a32)
  a[7] = (b10 * a03) + (b11 * a13) + (b12 * a23) + (b13 * a33)

  a[8] = (b20 * a00) + (b21 * a10) + (b22 * a20) + (b23 * a30)
  a[9] = (b20 * a01) + (b21 * a11) + (b22 * a21) + (b23 * a31)
  a[10] = (b20 * a02) + (b21 * a12) + (b22 * a22) + (b23 * a32)
  a[11] = (b20 * a03) + (b21 * a13) + (b22 * a23) + (b23 * a33)

  a[12] = (b30 * a00) + (b31 * a10) + (b32 * a20) + (b33 * a30)
  a[13] = (b30 * a01) + (b31 * a11) + (b32 * a21) + (b33 * a31)
  a[14] = (b30 * a02) + (b31 * a12) + (b32 * a22) + (b33 * a32)
  a[15] = (b30 * a03) + (b31 * a13) + (b32 * a23) + (b33 * a33)

  return a
}

function invert (a) {
  var a00 = a[0]
  var a10 = a[1]
  var a20 = a[2]
  var a30 = a[3]
  var a01 = a[4]
  var a11 = a[5]
  var a21 = a[6]
  var a31 = a[7]
  var a02 = a[8]
  var a12 = a[9]
  var a22 = a[10]
  var a32 = a[11]
  var a03 = a[12]
  var a13 = a[13]
  var a23 = a[14]
  var a33 = a[15]

  // TODO: add caching

  a[0] = a11 * a22 * a33 - a11 * a32 * a23 - a12 * a21 * a33 + a12 * a31 * a23 + a13 * a21 * a32 - a13 * a31 * a22
  a[4] = -a01 * a22 * a33 + a01 * a32 * a23 + a02 * a21 * a33 - a02 * a31 * a23 - a03 * a21 * a32 + a03 * a31 * a22
  a[8] = a01 * a12 * a33 - a01 * a32 * a13 - a02 * a11 * a33 + a02 * a31 * a13 + a03 * a11 * a32 - a03 * a31 * a12
  a[12] = -a01 * a12 * a23 + a01 * a22 * a13 + a02 * a11 * a23 - a02 * a21 * a13 - a03 * a11 * a22 + a03 * a21 * a12

  a[1] = -a10 * a22 * a33 + a10 * a32 * a23 + a12 * a20 * a33 - a12 * a30 * a23 - a13 * a20 * a32 + a13 * a30 * a22
  a[5] = a00 * a22 * a33 - a00 * a32 * a23 - a02 * a20 * a33 + a02 * a30 * a23 + a03 * a20 * a32 - a03 * a30 * a22
  a[9] = -a00 * a12 * a33 + a00 * a32 * a13 + a02 * a10 * a33 - a02 * a30 * a13 - a03 * a10 * a32 + a03 * a30 * a12
  a[13] = a00 * a12 * a23 - a00 * a22 * a13 - a02 * a10 * a23 + a02 * a20 * a13 + a03 * a10 * a22 - a03 * a20 * a12

  a[2] = a10 * a21 * a33 - a10 * a31 * a23 - a11 * a20 * a33 + a11 * a30 * a23 + a13 * a20 * a31 - a13 * a30 * a21
  a[6] = -a00 * a21 * a33 + a00 * a31 * a23 + a01 * a20 * a33 - a01 * a30 * a23 - a03 * a20 * a31 + a03 * a30 * a21
  a[10] = a00 * a11 * a33 - a00 * a31 * a13 - a01 * a10 * a33 + a01 * a30 * a13 + a03 * a10 * a31 - a03 * a30 * a11
  a[14] = -a00 * a11 * a23 + a00 * a21 * a13 + a01 * a10 * a23 - a01 * a20 * a13 - a03 * a10 * a21 + a03 * a20 * a11

  a[3] = -a10 * a21 * a32 + a10 * a31 * a22 + a11 * a20 * a32 - a11 * a30 * a22 - a12 * a20 * a31 + a12 * a30 * a21
  a[7] = a00 * a21 * a32 - a00 * a31 * a22 - a01 * a20 * a32 + a01 * a30 * a22 + a02 * a20 * a31 - a02 * a30 * a21
  a[11] = -a00 * a11 * a32 + a00 * a31 * a12 + a01 * a10 * a32 - a01 * a30 * a12 - a02 * a10 * a31 + a02 * a30 * a11
  a[15] = a00 * a11 * a22 - a00 * a21 * a12 - a01 * a10 * a22 + a01 * a20 * a12 + a02 * a10 * a21 - a02 * a20 * a11

  var det = a00 * a[0] + a10 * a[4] + a20 * a[8] + a30 * a[12]

  if (det === 0) {
    return null
  }

  det = 1.0 / det

  a[0] *= det
  a[1] *= det
  a[2] *= det
  a[3] *= det
  a[4] *= det
  a[5] *= det
  a[6] *= det
  a[7] *= det
  a[8] *= det
  a[9] *= det
  a[10] *= det
  a[11] *= det
  a[12] *= det
  a[13] *= det
  a[14] *= det
  a[15] *= det

  return a
}

function transpose (a) {
  var a01 = a[1]
  var a02 = a[2]
  var a03 = a[3]
  var a12 = a[6]
  var a13 = a[7]
  var a20 = a[8]
  var a21 = a[9]
  var a23 = a[11]
  var a30 = a[12]
  var a31 = a[13]
  var a32 = a[14]

  // 1st row - keeping a00
  a[1] = a[4]
  a[2] = a20
  a[3] = a30
  // 2nd row - keeping a11
  a[4] = a01
  a[6] = a21
  a[7] = a31
  // 3rd row - keeping a22
  a[8] = a02
  a[9] = a12
  a[11] = a32
  // 4th row - keeping a33
  a[12] = a03
  a[13] = a13
  a[14] = a23

  return a
}

function identity (a) {
  a[0] = a[5] = a[10] = a[15] = 1
  a[1] = a[2] = a[3] = a[4] = a[6] = a[7] = a[8] = a[9] = a[11] = a[12] = a[13] = a[14] = 0
  return a
}

function _scale3 (a, x, y, z) {
  return _mult16(a, x, 0, 0, 0,
                0, y, 0, 0,
                0, 0, z, 0,
                0, 0, 0, 1)
}

function scale (a, v) {
  return _scale3(a, v[0], v[1], v[2])
}

function _translate3 (a, x, y, z) {
  return _mult16(a, 1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                x, y, z, 1)
}

function translate (a, v) {
  return _translate3(a, v[0], v[1], v[2])
}

function _rotate3 (a, r, x, y, z) {
  var len = Math.sqrt(x * x + y * y + z * z)

  if (len < 0.0001) {
    return null
  }

  var s, c, t
  var a00, a01, a02, a03
  var a10, a11, a12, a13
  var a20, a21, a22, a23
  var b00, b01, b02
  var b10, b11, b12
  var b20, b21, b22

  len = 1 / len

  x *= len
  y *= len
  z *= len

  s = Math.sin(r)
  c = Math.cos(r)
  t = 1 - c

  a00 = a11 = a22 = 1
  a01 = a02 = a03 = a10 = a12 = a13 = a20 = a21 = a23 = 0

  b00 = x * x * t + c
  b01 = y * x * t + z * s
  b02 = z * x * t - y * s
  b10 = x * y * t - z * s
  b11 = y * y * t + c
  b12 = z * y * t + x * s
  b20 = x * z * t + y * s
  b21 = y * z * t - x * s
  b22 = z * z * t + c

  var _a00 = a00 * b00 + a10 * b01 + a20 * b02
  var _a01 = a01 * b00 + a11 * b01 + a21 * b02
  var _a02 = a02 * b00 + a12 * b01 + a22 * b02
  var _a03 = a03 * b00 + a13 * b01 + a23 * b02
  var _a10 = a00 * b10 + a10 * b11 + a20 * b12
  var _a11 = a01 * b10 + a11 * b11 + a21 * b12
  var _a12 = a02 * b10 + a12 * b11 + a22 * b12
  var _a13 = a03 * b10 + a13 * b11 + a23 * b12
  var _a20 = a00 * b20 + a10 * b21 + a20 * b22
  var _a21 = a01 * b20 + a11 * b21 + a21 * b22
  var _a22 = a02 * b20 + a12 * b21 + a22 * b22
  var _a23 = a03 * b20 + a13 * b21 + a23 * b22

  return _mult16(a, _a00, _a01, _a02, _a03,
                _a10, _a11, _a12, _a13,
                _a20, _a21, _a22, _a23,
                0, 0, 0, 1)
}

function rotate (a, r, v) {
  return _rotate3(a, r, v[0], v[1], v[2])
}

function fromQuat (a, b) {
  var x = b[0]
  var y = b[1]
  var z = b[2]
  var w = b[3]

  var x2 = x + x
  var y2 = y + y
  var z2 = z + z

  var xx = x * x2
  var xy = x * y2
  var xz = x * z2

  var yy = y * y2
  var yz = y * z2
  var zz = z * z2

  var wx = w * x2
  var wy = w * y2
  var wz = w * z2

  a[0] = 1 - (yy + zz)
  a[4] = xy - wz
  a[8] = xz + wy

  a[1] = xy + wz
  a[5] = 1 - (xx + zz)
  a[9] = yz - wx

  a[2] = xz - wy
  a[6] = yz + wx
  a[10] = 1 - (xx + yy)

  a[3] = a[7] = a[11] = a[12] = a[13] = a[14] = 0
  a[15] = 1

  return a
}

function fromMat3 (a, b) {
  a[0] = b[0]
  a[1] = b[1]
  a[2] = b[2]

  a[4] = b[3]
  a[5] = b[4]
  a[6] = b[5]

  a[8] = b[6]
  a[9] = b[7]
  a[10] = b[8]

  a[3] = a[7] = a[11] =
    a[12] = a[13] = a[14] = 0
  a[15] = 1.0

  return a
}

function frustum (a, left, right, bottom, top, near, far) {
  var rl = 1.0 / (right - left)
  var tb = 1.0 / (top - bottom)
  var nf = 1.0 / (near - far)

  var near2 = near * 2

  a[0] = near2 * rl
  a[1] = a[2] = 0
  a[3] = 0
  a[4] = 0
  a[5] = near2 * tb
  a[6] = 0
  a[7] = 0
  a[8] = (right + left) * rl
  a[9] = (top + bottom) * tb
  a[10] = (far + near) * nf
  a[11] = -1
  a[12] = 0
  a[13] = 0
  a[14] = (far * near2) * nf
  a[15] = 0

  return a
}

function perspective (a, fovy, aspectRatio, near, far) {
  assert(fovy < Math.PI, 'mat4.perpsective: vertical field of view should be in radians (0 to PI)')

  var f = 1.0 / Math.tan(fovy * 0.5)
  var nf = 1.0 / (near - far)

  a[1] = a[2] = a[3] = a[4] = a[6] = a[7] = a[8] = a[9] = a[12] = a[13] = a[15] = 0

  a[0] = f / aspectRatio
  a[5] = f
  a[10] = (far + near) * nf
  a[11] = -1
  a[14] = (2 * far * near) * nf

  return a
}

function ortho (a, left, right, bottom, top, near, far) {
  var lr = left - right
  var bt = bottom - top
  var nf = near - far

  a[1] = a[2] = a[3] = a[4] = a[6] = a[7] = a[8] = a[9] = a[11] = 0

  a[0] = -2 / lr
  a[5] = -2 / bt
  a[10] = 2 / nf

  a[12] = (left + right) / lr
  a[13] = (top + bottom) / bt
  a[14] = (far + near) / nf
  a[15] = 1

  return a
}

function _lookAt9 (a, eyex, eyey, eyez, targetx, targety, targetz, upx, upy, upz) {
  var x0, x1, x2, y0, y1, y2, z0, z1, z2, len

  if (Math.abs(eyex - targetx) < 0.000001 &&
      Math.abs(eyey - targety) < 0.000001 &&
      Math.abs(eyez - targetz) < 0.000001) {
    a[0] = 1
    a[1] = a[2] = a[3] = 0
    a[5] = 1
    a[4] = a[6] = a[7] = 0
    a[10] = 1
    a[8] = a[9] = a[11] = 0
    a[15] = 1
    a[12] = a[13] = a[14] = 0

    return a
  }

  z0 = eyex - targetx
  z1 = eyey - targety
  z2 = eyez - targetz

  len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2)
  z0 *= len
  z1 *= len
  z2 *= len

  x0 = upy * z2 - upz * z1
  x1 = upz * z0 - upx * z2
  x2 = upx * z1 - upy * z0

  len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2)

  if (len) {
    len = 1.0 / len
    x0 *= len
    x1 *= len
    x2 *= len
  }

  y0 = z1 * x2 - z2 * x1
  y1 = z2 * x0 - z0 * x2
  y2 = z0 * x1 - z1 * x0

  len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2)

  if (len) {
    len = 1.0 / len
    x0 *= len
    x1 *= len
    x2 *= len
  }

  a[0] = x0
  a[1] = y0
  a[2] = z0
  a[3] = 0
  a[4] = x1
  a[5] = y1
  a[6] = z1
  a[7] = 0
  a[8] = x2
  a[9] = y2
  a[10] = z2
  a[11] = 0
  a[12] = -(x0 * eyex + x1 * eyey + x2 * eyez)
  a[13] = -(y0 * eyex + y1 * eyey + y2 * eyez)
  a[14] = -(z0 * eyex + z1 * eyey + z2 * eyez)
  a[15] = 1

  return a
}

function lookAt (a, from, to, up) {
  var eyex = from[0]
  var eyey = from[1]
  var eyez = from[2]

  var targetx = to[0]
  var targety = to[1]
  var targetz = to[2]

  var upx = up[0]
  var upy = up[1]
  var upz = up[2]

  var x0, x1, x2, y0, y1, y2, z0, z1, z2, len

  if (Math.abs(eyex - targetx) < 0.000001 &&
      Math.abs(eyey - targety) < 0.000001 &&
      Math.abs(eyez - targetz) < 0.000001) {
    a[0] = 1
    a[1] = a[2] = a[3] = 0
    a[5] = 1
    a[4] = a[6] = a[7] = 0
    a[10] = 1
    a[8] = a[9] = a[11] = 0
    a[15] = 1
    a[12] = a[13] = a[14] = 0

    return a
  }

  z0 = eyex - targetx
  z1 = eyey - targety
  z2 = eyez - targetz

  len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2)
  z0 *= len
  z1 *= len
  z2 *= len

  x0 = upy * z2 - upz * z1
  x1 = upz * z0 - upx * z2
  x2 = upx * z1 - upy * z0

  len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2)

  if (len) {
    len = 1.0 / len
    x0 *= len
    x1 *= len
    x2 *= len
  }

  y0 = z1 * x2 - z2 * x1
  y1 = z2 * x0 - z0 * x2
  y2 = z0 * x1 - z1 * x0

  len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2)

  if (len) {
    len = 1.0 / len
    x0 *= len
    x1 *= len
    x2 *= len
  }

  a[0] = x0
  a[1] = y0
  a[2] = z0
  a[3] = 0
  a[4] = x1
  a[5] = y1
  a[6] = z1
  a[7] = 0
  a[8] = x2
  a[9] = y2
  a[10] = z2
  a[11] = 0
  a[12] = -(x0 * eyex + x1 * eyey + x2 * eyez)
  a[13] = -(y0 * eyex + y1 * eyey + y2 * eyez)
  a[14] = -(z0 * eyex + z1 * eyey + z2 * eyez)
  a[15] = 1

  return a
}

var Mat4 = {
  _mult16: _mult16,
  _scale3: _scale3,
  _translate3: _translate3,
  _rotate3: _rotate3,
  _lookAt9: _lookAt9,
  // documented
  fromMat3: fromMat3,
  fromQuat: fromQuat,
  translate: translate,
  scale: scale,
  rotate: rotate,
  identity: identity,
  mult: mult,
  invert: invert,
  transpose: transpose,
  equals: equals,
  copy: copy,
  create: create,
  set: set,
  frustum: frustum,
  perspective: perspective,
  ortho: ortho,
  lookAt: lookAt
}

module.exports = Mat4

},{"assert":1}],17:[function(require,module,exports){
function lerp (a, b, n) {
  return a + (b - a) * n
}

function clamp (n, min, max) {
  return Math.max(min, Math.min(n, max))
}

function smoothstep (n, min, max) {
  n = clamp((n - min) / (max - min), 0.0, 1.0)
  return n * n * (3 - 2 * n)
}

function map (n, inStart, inEnd, outStart, outEnd) {
  return outStart + (outEnd - outStart) * (n - inStart) / (inEnd - inStart)
}

function toRadians (degrees) {
  return degrees * Math.PI / 180.0
}

function toDegrees (radians) {
  return radians * 180 / Math.PI
}

function sign (n) {
  return n / Math.abs(n)
}

function isPowerOfTwo (a) {
  return (a & (a - 1)) === 0
}

function nextPowerOfTwo (n) {
  if (n === 0) return 1
  n--
  n |= n >> 1
  n |= n >> 2
  n |= n >> 4
  n |= n >> 8
  n |= n >> 16
  return n + 1
}

var Utils = {
  lerp: lerp,
  clamp: clamp,
  smoothstep: smoothstep,
  map: map,
  toRadians: toRadians,
  toDegrees: toDegrees,
  sign: sign,
  isPowerOfTwo: isPowerOfTwo,
  nextPowerOfTwo: nextPowerOfTwo
}

module.exports = Utils

},{}],18:[function(require,module,exports){
function create () {
  return [0, 0, 0]
}

function equals (a, b) {
  return a[0] === b[0] &&
    a[1] === b[1] &&
    a[2] === b[2]
}

function set (a, b) {
  a[0] = b[0]
  a[1] = b[1]
  a[2] = b[2]
  return a
}

function add (a, b) {
  a[0] += b[0]
  a[1] += b[1]
  a[2] += b[2]
  return a
}

function sub (a, b) {
  a[0] -= b[0]
  a[1] -= b[1]
  a[2] -= b[2]
  return a
}

function scale (a, n) {
  a[0] *= n
  a[1] *= n
  a[2] *= n
  return a
}

function multMat4 (a, m) {
  var x = a[0]
  var y = a[1]
  var z = a[2]

  a[0] = m[0] * x + m[4] * y + m[8] * z + m[12]
  a[1] = m[1] * x + m[5] * y + m[9] * z + m[13]
  a[2] = m[2] * x + m[6] * y + m[10] * z + m[14]

  return a
}

function multQuat (a, q) {
  var x = a[0]
  var y = a[1]
  var z = a[2]

  var qx = q[0]
  var qy = q[1]
  var qz = q[2]
  var qw = q[3]

  var ix = qw * x + qy * z - qz * y
  var iy = qw * y + qz * x - qx * z
  var iz = qw * z + qx * y - qy * x
  var iw = -qx * x - qy * y - qz * z

  a[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy
  a[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz
  a[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx

  return a
}

function dot (a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

function cross (a, b) {
  var x = a[0]
  var y = a[1]
  var z = a[2]
  var vx = b[0]
  var vy = b[1]
  var vz = b[2]

  a[0] = y * vz - vy * z
  a[1] = z * vx - vz * x
  a[2] = x * vy - vx * y
  return a
}

function length (a) {
  var x = a[0]
  var y = a[1]
  var z = a[2]
  return Math.sqrt(x * x + y * y + z * z)
}

function lengthSq (a) {
  var x = a[0]
  var y = a[1]
  var z = a[2]
  return x * x + y * y + z * z
}

function normalize (a) {
  var x = a[0]
  var y = a[1]
  var z = a[2]
  var l = Math.sqrt(x * x + y * y + z * z)

  l = 1.0 / (l || 1)
  a[0] *= l
  a[1] *= l
  a[2] *= l
  return a
}

function distance (a, b) {
  var dx = b[0] - a[0]
  var dy = b[1] - a[1]
  var dz = b[2] - a[2]
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

function distanceSq (a, b) {
  var dx = b[0] - a[0]
  var dy = b[1] - a[1]
  var dz = b[2] - a[2]
  return dx * dx + dy * dy + dz * dz
}

function limit (a, n) {
  var x = a[0]
  var y = a[1]
  var z = a[2]

  var dsq = x * x + y * y + z * z
  var lsq = n * n

  if (lsq > 0 && dsq > lsq) {
    var nd = n / Math.sqrt(dsq)
    a[0] *= nd
    a[1] *= nd
    a[2] *= nd
  }

  return a
}

function lerp (a, b, n) {
  var x = a[0]
  var y = a[1]
  var z = a[2]

  a[0] = x + (b[0] - x) * n
  a[1] = y + (b[1] - y) * n
  a[2] = z + (b[2] - z) * n

  return a
}

function toString (a, precision) {
  var scale = Math.pow(10, precision !== undefined ? precision : 4)
  var s = '['
  s += Math.floor(a[0] * scale) / scale + ', '
  s += Math.floor(a[1] * scale) / scale + ', '
  s += Math.floor(a[2] * scale) / scale + ']'
  return s
}

function copy (a) {
  return a.slice(0)
}

function addScaled (v, w, n) {
  v[0] += w[0] * n
  v[1] += w[1] * n
  v[2] += w[2] * n

  return v
}

var Vec3 = {
  create: create,
  set: set,
  copy: copy,
  equals: equals,
  add: add,
  addScaled: addScaled,
  sub: sub,
  scale: scale,
  multMat4: multMat4,
  multQuat: multQuat,
  dot: dot,
  cross: cross,
  length: length,
  lengthSq: lengthSq,
  normalize: normalize,
  distance: distance,
  distanceSq: distanceSq,
  limit: limit,
  lerp: lerp,
  toString: toString
}

module.exports = Vec3

},{}],19:[function(require,module,exports){
(function (global){(function (){
var now = require('performance-now')
  , root = typeof window === 'undefined' ? global : window
  , vendors = ['moz', 'webkit']
  , suffix = 'AnimationFrame'
  , raf = root['request' + suffix]
  , caf = root['cancel' + suffix] || root['cancelRequest' + suffix]

for(var i = 0; !raf && i < vendors.length; i++) {
  raf = root[vendors[i] + 'Request' + suffix]
  caf = root[vendors[i] + 'Cancel' + suffix]
      || root[vendors[i] + 'CancelRequest' + suffix]
}

// Some versions of FF have rAF but not cAF
if(!raf || !caf) {
  var last = 0
    , id = 0
    , queue = []
    , frameDuration = 1000 / 60

  raf = function(callback) {
    if(queue.length === 0) {
      var _now = now()
        , next = Math.max(0, frameDuration - (_now - last))
      last = next + _now
      setTimeout(function() {
        var cp = queue.slice(0)
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0
        for(var i = 0; i < cp.length; i++) {
          if(!cp[i].cancelled) {
            try{
              cp[i].callback(last)
            } catch(e) {
              setTimeout(function() { throw e }, 0)
            }
          }
        }
      }, Math.round(next))
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    })
    return id
  }

  caf = function(handle) {
    for(var i = 0; i < queue.length; i++) {
      if(queue[i].handle === handle) {
        queue[i].cancelled = true
      }
    }
  }
}

module.exports = function(fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  return raf.call(root, fn)
}
module.exports.cancel = function() {
  caf.apply(root, arguments)
}
module.exports.polyfill = function(object) {
  if (!object) {
    object = root;
  }
  object.requestAnimationFrame = raf
  object.cancelAnimationFrame = caf
}

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"performance-now":12}],20:[function(require,module,exports){
function xyzToLatLon (normalizedPosition, out) {
  out = out || [0, 0]
  out[0] = 90 - Math.acos(normalizedPosition[1]) / Math.PI * 180
  out[1] = -Math.atan2(normalizedPosition[2], normalizedPosition[0]) / Math.PI * 180
  return out
}

module.exports = xyzToLatLon

},{}]},{},[7]);
