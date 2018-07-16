(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
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
    var timeout = setTimeout(cleanUpNextTick);
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
    clearTimeout(timeout);
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
        setTimeout(drainQueue, 0);
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

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
'use strict';

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _handlebarsBase = require('./handlebars/base');

var base = _interopRequireWildcard(_handlebarsBase);

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)

var _handlebarsSafeString = require('./handlebars/safe-string');

var _handlebarsSafeString2 = _interopRequireDefault(_handlebarsSafeString);

var _handlebarsException = require('./handlebars/exception');

var _handlebarsException2 = _interopRequireDefault(_handlebarsException);

var _handlebarsUtils = require('./handlebars/utils');

var Utils = _interopRequireWildcard(_handlebarsUtils);

var _handlebarsRuntime = require('./handlebars/runtime');

var runtime = _interopRequireWildcard(_handlebarsRuntime);

var _handlebarsNoConflict = require('./handlebars/no-conflict');

var _handlebarsNoConflict2 = _interopRequireDefault(_handlebarsNoConflict);

// For compatibility and usage outside of module systems, make the Handlebars object a namespace
function create() {
  var hb = new base.HandlebarsEnvironment();

  Utils.extend(hb, base);
  hb.SafeString = _handlebarsSafeString2['default'];
  hb.Exception = _handlebarsException2['default'];
  hb.Utils = Utils;
  hb.escapeExpression = Utils.escapeExpression;

  hb.VM = runtime;
  hb.template = function (spec) {
    return runtime.template(spec, hb);
  };

  return hb;
}

var inst = create();
inst.create = create;

_handlebarsNoConflict2['default'](inst);

inst['default'] = inst;

exports['default'] = inst;
module.exports = exports['default'];


},{"./handlebars/base":3,"./handlebars/exception":6,"./handlebars/no-conflict":16,"./handlebars/runtime":17,"./handlebars/safe-string":18,"./handlebars/utils":19}],3:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.HandlebarsEnvironment = HandlebarsEnvironment;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utils = require('./utils');

var _exception = require('./exception');

var _exception2 = _interopRequireDefault(_exception);

var _helpers = require('./helpers');

var _decorators = require('./decorators');

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var VERSION = '4.0.5';
exports.VERSION = VERSION;
var COMPILER_REVISION = 7;

exports.COMPILER_REVISION = COMPILER_REVISION;
var REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '== 1.x.x',
  5: '== 2.0.0-alpha.x',
  6: '>= 2.0.0-beta.1',
  7: '>= 4.0.0'
};

exports.REVISION_CHANGES = REVISION_CHANGES;
var objectType = '[object Object]';

function HandlebarsEnvironment(helpers, partials, decorators) {
  this.helpers = helpers || {};
  this.partials = partials || {};
  this.decorators = decorators || {};

  _helpers.registerDefaultHelpers(this);
  _decorators.registerDefaultDecorators(this);
}

HandlebarsEnvironment.prototype = {
  constructor: HandlebarsEnvironment,

  logger: _logger2['default'],
  log: _logger2['default'].log,

  registerHelper: function registerHelper(name, fn) {
    if (_utils.toString.call(name) === objectType) {
      if (fn) {
        throw new _exception2['default']('Arg not supported with multiple helpers');
      }
      _utils.extend(this.helpers, name);
    } else {
      this.helpers[name] = fn;
    }
  },
  unregisterHelper: function unregisterHelper(name) {
    delete this.helpers[name];
  },

  registerPartial: function registerPartial(name, partial) {
    if (_utils.toString.call(name) === objectType) {
      _utils.extend(this.partials, name);
    } else {
      if (typeof partial === 'undefined') {
        throw new _exception2['default']('Attempting to register a partial called "' + name + '" as undefined');
      }
      this.partials[name] = partial;
    }
  },
  unregisterPartial: function unregisterPartial(name) {
    delete this.partials[name];
  },

  registerDecorator: function registerDecorator(name, fn) {
    if (_utils.toString.call(name) === objectType) {
      if (fn) {
        throw new _exception2['default']('Arg not supported with multiple decorators');
      }
      _utils.extend(this.decorators, name);
    } else {
      this.decorators[name] = fn;
    }
  },
  unregisterDecorator: function unregisterDecorator(name) {
    delete this.decorators[name];
  }
};

var log = _logger2['default'].log;

exports.log = log;
exports.createFrame = _utils.createFrame;
exports.logger = _logger2['default'];


},{"./decorators":4,"./exception":6,"./helpers":7,"./logger":15,"./utils":19}],4:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.registerDefaultDecorators = registerDefaultDecorators;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _decoratorsInline = require('./decorators/inline');

var _decoratorsInline2 = _interopRequireDefault(_decoratorsInline);

function registerDefaultDecorators(instance) {
  _decoratorsInline2['default'](instance);
}


},{"./decorators/inline":5}],5:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('../utils');

exports['default'] = function (instance) {
  instance.registerDecorator('inline', function (fn, props, container, options) {
    var ret = fn;
    if (!props.partials) {
      props.partials = {};
      ret = function (context, options) {
        // Create a new partials stack frame prior to exec.
        var original = container.partials;
        container.partials = _utils.extend({}, original, props.partials);
        var ret = fn(context, options);
        container.partials = original;
        return ret;
      };
    }

    props.partials[options.args[0]] = options.fn;

    return ret;
  });
};

module.exports = exports['default'];


},{"../utils":19}],6:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

function Exception(message, node) {
  var loc = node && node.loc,
      line = undefined,
      column = undefined;
  if (loc) {
    line = loc.start.line;
    column = loc.start.column;

    message += ' - ' + line + ':' + column;
  }

  var tmp = Error.prototype.constructor.call(this, message);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }

  /* istanbul ignore else */
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, Exception);
  }

  if (loc) {
    this.lineNumber = line;
    this.column = column;
  }
}

Exception.prototype = new Error();

exports['default'] = Exception;
module.exports = exports['default'];


},{}],7:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.registerDefaultHelpers = registerDefaultHelpers;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _helpersBlockHelperMissing = require('./helpers/block-helper-missing');

var _helpersBlockHelperMissing2 = _interopRequireDefault(_helpersBlockHelperMissing);

var _helpersEach = require('./helpers/each');

var _helpersEach2 = _interopRequireDefault(_helpersEach);

var _helpersHelperMissing = require('./helpers/helper-missing');

var _helpersHelperMissing2 = _interopRequireDefault(_helpersHelperMissing);

var _helpersIf = require('./helpers/if');

var _helpersIf2 = _interopRequireDefault(_helpersIf);

var _helpersLog = require('./helpers/log');

var _helpersLog2 = _interopRequireDefault(_helpersLog);

var _helpersLookup = require('./helpers/lookup');

var _helpersLookup2 = _interopRequireDefault(_helpersLookup);

var _helpersWith = require('./helpers/with');

var _helpersWith2 = _interopRequireDefault(_helpersWith);

function registerDefaultHelpers(instance) {
  _helpersBlockHelperMissing2['default'](instance);
  _helpersEach2['default'](instance);
  _helpersHelperMissing2['default'](instance);
  _helpersIf2['default'](instance);
  _helpersLog2['default'](instance);
  _helpersLookup2['default'](instance);
  _helpersWith2['default'](instance);
}


},{"./helpers/block-helper-missing":8,"./helpers/each":9,"./helpers/helper-missing":10,"./helpers/if":11,"./helpers/log":12,"./helpers/lookup":13,"./helpers/with":14}],8:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('../utils');

exports['default'] = function (instance) {
  instance.registerHelper('blockHelperMissing', function (context, options) {
    var inverse = options.inverse,
        fn = options.fn;

    if (context === true) {
      return fn(this);
    } else if (context === false || context == null) {
      return inverse(this);
    } else if (_utils.isArray(context)) {
      if (context.length > 0) {
        if (options.ids) {
          options.ids = [options.name];
        }

        return instance.helpers.each(context, options);
      } else {
        return inverse(this);
      }
    } else {
      if (options.data && options.ids) {
        var data = _utils.createFrame(options.data);
        data.contextPath = _utils.appendContextPath(options.data.contextPath, options.name);
        options = { data: data };
      }

      return fn(context, options);
    }
  });
};

module.exports = exports['default'];


},{"../utils":19}],9:[function(require,module,exports){
'use strict';

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utils = require('../utils');

var _exception = require('../exception');

var _exception2 = _interopRequireDefault(_exception);

exports['default'] = function (instance) {
  instance.registerHelper('each', function (context, options) {
    if (!options) {
      throw new _exception2['default']('Must pass iterator to #each');
    }

    var fn = options.fn,
        inverse = options.inverse,
        i = 0,
        ret = '',
        data = undefined,
        contextPath = undefined;

    if (options.data && options.ids) {
      contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]) + '.';
    }

    if (_utils.isFunction(context)) {
      context = context.call(this);
    }

    if (options.data) {
      data = _utils.createFrame(options.data);
    }

    function execIteration(field, index, last) {
      if (data) {
        data.key = field;
        data.index = index;
        data.first = index === 0;
        data.last = !!last;

        if (contextPath) {
          data.contextPath = contextPath + field;
        }
      }

      ret = ret + fn(context[field], {
        data: data,
        blockParams: _utils.blockParams([context[field], field], [contextPath + field, null])
      });
    }

    if (context && typeof context === 'object') {
      if (_utils.isArray(context)) {
        for (var j = context.length; i < j; i++) {
          if (i in context) {
            execIteration(i, i, i === context.length - 1);
          }
        }
      } else {
        var priorKey = undefined;

        for (var key in context) {
          if (context.hasOwnProperty(key)) {
            // We're running the iterations one step out of sync so we can detect
            // the last iteration without have to scan the object twice and create
            // an itermediate keys array.
            if (priorKey !== undefined) {
              execIteration(priorKey, i - 1);
            }
            priorKey = key;
            i++;
          }
        }
        if (priorKey !== undefined) {
          execIteration(priorKey, i - 1, true);
        }
      }
    }

    if (i === 0) {
      ret = inverse(this);
    }

    return ret;
  });
};

module.exports = exports['default'];


},{"../exception":6,"../utils":19}],10:[function(require,module,exports){
'use strict';

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _exception = require('../exception');

var _exception2 = _interopRequireDefault(_exception);

exports['default'] = function (instance) {
  instance.registerHelper('helperMissing', function () /* [args, ]options */{
    if (arguments.length === 1) {
      // A missing field in a {{foo}} construct.
      return undefined;
    } else {
      // Someone is actually trying to call something, blow up.
      throw new _exception2['default']('Missing helper: "' + arguments[arguments.length - 1].name + '"');
    }
  });
};

module.exports = exports['default'];


},{"../exception":6}],11:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('../utils');

exports['default'] = function (instance) {
  instance.registerHelper('if', function (conditional, options) {
    if (_utils.isFunction(conditional)) {
      conditional = conditional.call(this);
    }

    // Default behavior is to render the positive path if the value is truthy and not empty.
    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
    if (!options.hash.includeZero && !conditional || _utils.isEmpty(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });

  instance.registerHelper('unless', function (conditional, options) {
    return instance.helpers['if'].call(this, conditional, { fn: options.inverse, inverse: options.fn, hash: options.hash });
  });
};

module.exports = exports['default'];


},{"../utils":19}],12:[function(require,module,exports){
'use strict';

exports.__esModule = true;

exports['default'] = function (instance) {
  instance.registerHelper('log', function () /* message, options */{
    var args = [undefined],
        options = arguments[arguments.length - 1];
    for (var i = 0; i < arguments.length - 1; i++) {
      args.push(arguments[i]);
    }

    var level = 1;
    if (options.hash.level != null) {
      level = options.hash.level;
    } else if (options.data && options.data.level != null) {
      level = options.data.level;
    }
    args[0] = level;

    instance.log.apply(instance, args);
  });
};

module.exports = exports['default'];


},{}],13:[function(require,module,exports){
'use strict';

exports.__esModule = true;

exports['default'] = function (instance) {
  instance.registerHelper('lookup', function (obj, field) {
    return obj && obj[field];
  });
};

module.exports = exports['default'];


},{}],14:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('../utils');

exports['default'] = function (instance) {
  instance.registerHelper('with', function (context, options) {
    if (_utils.isFunction(context)) {
      context = context.call(this);
    }

    var fn = options.fn;

    if (!_utils.isEmpty(context)) {
      var data = options.data;
      if (options.data && options.ids) {
        data = _utils.createFrame(options.data);
        data.contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]);
      }

      return fn(context, {
        data: data,
        blockParams: _utils.blockParams([context], [data && data.contextPath])
      });
    } else {
      return options.inverse(this);
    }
  });
};

module.exports = exports['default'];


},{"../utils":19}],15:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('./utils');

var logger = {
  methodMap: ['debug', 'info', 'warn', 'error'],
  level: 'info',

  // Maps a given level value to the `methodMap` indexes above.
  lookupLevel: function lookupLevel(level) {
    if (typeof level === 'string') {
      var levelMap = _utils.indexOf(logger.methodMap, level.toLowerCase());
      if (levelMap >= 0) {
        level = levelMap;
      } else {
        level = parseInt(level, 10);
      }
    }

    return level;
  },

  // Can be overridden in the host environment
  log: function log(level) {
    level = logger.lookupLevel(level);

    if (typeof console !== 'undefined' && logger.lookupLevel(logger.level) <= level) {
      var method = logger.methodMap[level];
      if (!console[method]) {
        // eslint-disable-line no-console
        method = 'log';
      }

      for (var _len = arguments.length, message = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        message[_key - 1] = arguments[_key];
      }

      console[method].apply(console, message); // eslint-disable-line no-console
    }
  }
};

exports['default'] = logger;
module.exports = exports['default'];


},{"./utils":19}],16:[function(require,module,exports){
(function (global){
/* global window */
'use strict';

exports.__esModule = true;

exports['default'] = function (Handlebars) {
  /* istanbul ignore next */
  var root = typeof global !== 'undefined' ? global : window,
      $Handlebars = root.Handlebars;
  /* istanbul ignore next */
  Handlebars.noConflict = function () {
    if (root.Handlebars === Handlebars) {
      root.Handlebars = $Handlebars;
    }
    return Handlebars;
  };
};

module.exports = exports['default'];


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],17:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.checkRevision = checkRevision;
exports.template = template;
exports.wrapProgram = wrapProgram;
exports.resolvePartial = resolvePartial;
exports.invokePartial = invokePartial;
exports.noop = noop;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _utils = require('./utils');

var Utils = _interopRequireWildcard(_utils);

var _exception = require('./exception');

var _exception2 = _interopRequireDefault(_exception);

var _base = require('./base');

function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
      currentRevision = _base.COMPILER_REVISION;

  if (compilerRevision !== currentRevision) {
    if (compilerRevision < currentRevision) {
      var runtimeVersions = _base.REVISION_CHANGES[currentRevision],
          compilerVersions = _base.REVISION_CHANGES[compilerRevision];
      throw new _exception2['default']('Template was precompiled with an older version of Handlebars than the current runtime. ' + 'Please update your precompiler to a newer version (' + runtimeVersions + ') or downgrade your runtime to an older version (' + compilerVersions + ').');
    } else {
      // Use the embedded version info since the runtime doesn't know about this revision yet
      throw new _exception2['default']('Template was precompiled with a newer version of Handlebars than the current runtime. ' + 'Please update your runtime to a newer version (' + compilerInfo[1] + ').');
    }
  }
}

function template(templateSpec, env) {
  /* istanbul ignore next */
  if (!env) {
    throw new _exception2['default']('No environment passed to template');
  }
  if (!templateSpec || !templateSpec.main) {
    throw new _exception2['default']('Unknown template object: ' + typeof templateSpec);
  }

  templateSpec.main.decorator = templateSpec.main_d;

  // Note: Using env.VM references rather than local var references throughout this section to allow
  // for external users to override these as psuedo-supported APIs.
  env.VM.checkRevision(templateSpec.compiler);

  function invokePartialWrapper(partial, context, options) {
    if (options.hash) {
      context = Utils.extend({}, context, options.hash);
      if (options.ids) {
        options.ids[0] = true;
      }
    }

    partial = env.VM.resolvePartial.call(this, partial, context, options);
    var result = env.VM.invokePartial.call(this, partial, context, options);

    if (result == null && env.compile) {
      options.partials[options.name] = env.compile(partial, templateSpec.compilerOptions, env);
      result = options.partials[options.name](context, options);
    }
    if (result != null) {
      if (options.indent) {
        var lines = result.split('\n');
        for (var i = 0, l = lines.length; i < l; i++) {
          if (!lines[i] && i + 1 === l) {
            break;
          }

          lines[i] = options.indent + lines[i];
        }
        result = lines.join('\n');
      }
      return result;
    } else {
      throw new _exception2['default']('The partial ' + options.name + ' could not be compiled when running in runtime-only mode');
    }
  }

  // Just add water
  var container = {
    strict: function strict(obj, name) {
      if (!(name in obj)) {
        throw new _exception2['default']('"' + name + '" not defined in ' + obj);
      }
      return obj[name];
    },
    lookup: function lookup(depths, name) {
      var len = depths.length;
      for (var i = 0; i < len; i++) {
        if (depths[i] && depths[i][name] != null) {
          return depths[i][name];
        }
      }
    },
    lambda: function lambda(current, context) {
      return typeof current === 'function' ? current.call(context) : current;
    },

    escapeExpression: Utils.escapeExpression,
    invokePartial: invokePartialWrapper,

    fn: function fn(i) {
      var ret = templateSpec[i];
      ret.decorator = templateSpec[i + '_d'];
      return ret;
    },

    programs: [],
    program: function program(i, data, declaredBlockParams, blockParams, depths) {
      var programWrapper = this.programs[i],
          fn = this.fn(i);
      if (data || depths || blockParams || declaredBlockParams) {
        programWrapper = wrapProgram(this, i, fn, data, declaredBlockParams, blockParams, depths);
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = wrapProgram(this, i, fn);
      }
      return programWrapper;
    },

    data: function data(value, depth) {
      while (value && depth--) {
        value = value._parent;
      }
      return value;
    },
    merge: function merge(param, common) {
      var obj = param || common;

      if (param && common && param !== common) {
        obj = Utils.extend({}, common, param);
      }

      return obj;
    },

    noop: env.VM.noop,
    compilerInfo: templateSpec.compiler
  };

  function ret(context) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var data = options.data;

    ret._setup(options);
    if (!options.partial && templateSpec.useData) {
      data = initData(context, data);
    }
    var depths = undefined,
        blockParams = templateSpec.useBlockParams ? [] : undefined;
    if (templateSpec.useDepths) {
      if (options.depths) {
        depths = context !== options.depths[0] ? [context].concat(options.depths) : options.depths;
      } else {
        depths = [context];
      }
    }

    function main(context /*, options*/) {
      return '' + templateSpec.main(container, context, container.helpers, container.partials, data, blockParams, depths);
    }
    main = executeDecorators(templateSpec.main, main, container, options.depths || [], data, blockParams);
    return main(context, options);
  }
  ret.isTop = true;

  ret._setup = function (options) {
    if (!options.partial) {
      container.helpers = container.merge(options.helpers, env.helpers);

      if (templateSpec.usePartial) {
        container.partials = container.merge(options.partials, env.partials);
      }
      if (templateSpec.usePartial || templateSpec.useDecorators) {
        container.decorators = container.merge(options.decorators, env.decorators);
      }
    } else {
      container.helpers = options.helpers;
      container.partials = options.partials;
      container.decorators = options.decorators;
    }
  };

  ret._child = function (i, data, blockParams, depths) {
    if (templateSpec.useBlockParams && !blockParams) {
      throw new _exception2['default']('must pass block params');
    }
    if (templateSpec.useDepths && !depths) {
      throw new _exception2['default']('must pass parent depths');
    }

    return wrapProgram(container, i, templateSpec[i], data, 0, blockParams, depths);
  };
  return ret;
}

function wrapProgram(container, i, fn, data, declaredBlockParams, blockParams, depths) {
  function prog(context) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var currentDepths = depths;
    if (depths && context !== depths[0]) {
      currentDepths = [context].concat(depths);
    }

    return fn(container, context, container.helpers, container.partials, options.data || data, blockParams && [options.blockParams].concat(blockParams), currentDepths);
  }

  prog = executeDecorators(fn, prog, container, depths, data, blockParams);

  prog.program = i;
  prog.depth = depths ? depths.length : 0;
  prog.blockParams = declaredBlockParams || 0;
  return prog;
}

function resolvePartial(partial, context, options) {
  if (!partial) {
    if (options.name === '@partial-block') {
      partial = options.data['partial-block'];
    } else {
      partial = options.partials[options.name];
    }
  } else if (!partial.call && !options.name) {
    // This is a dynamic partial that returned a string
    options.name = partial;
    partial = options.partials[partial];
  }
  return partial;
}

function invokePartial(partial, context, options) {
  options.partial = true;
  if (options.ids) {
    options.data.contextPath = options.ids[0] || options.data.contextPath;
  }

  var partialBlock = undefined;
  if (options.fn && options.fn !== noop) {
    options.data = _base.createFrame(options.data);
    partialBlock = options.data['partial-block'] = options.fn;

    if (partialBlock.partials) {
      options.partials = Utils.extend({}, options.partials, partialBlock.partials);
    }
  }

  if (partial === undefined && partialBlock) {
    partial = partialBlock;
  }

  if (partial === undefined) {
    throw new _exception2['default']('The partial ' + options.name + ' could not be found');
  } else if (partial instanceof Function) {
    return partial(context, options);
  }
}

function noop() {
  return '';
}

function initData(context, data) {
  if (!data || !('root' in data)) {
    data = data ? _base.createFrame(data) : {};
    data.root = context;
  }
  return data;
}

function executeDecorators(fn, prog, container, depths, data, blockParams) {
  if (fn.decorator) {
    var props = {};
    prog = fn.decorator(prog, props, container, depths && depths[0], data, blockParams, depths);
    Utils.extend(prog, props);
  }
  return prog;
}


},{"./base":3,"./exception":6,"./utils":19}],18:[function(require,module,exports){
// Build out our basic SafeString type
'use strict';

exports.__esModule = true;
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = SafeString.prototype.toHTML = function () {
  return '' + this.string;
};

exports['default'] = SafeString;
module.exports = exports['default'];


},{}],19:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.extend = extend;
exports.indexOf = indexOf;
exports.escapeExpression = escapeExpression;
exports.isEmpty = isEmpty;
exports.createFrame = createFrame;
exports.blockParams = blockParams;
exports.appendContextPath = appendContextPath;
var escape = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

var badChars = /[&<>"'`=]/g,
    possible = /[&<>"'`=]/;

function escapeChar(chr) {
  return escape[chr];
}

function extend(obj /* , ...source */) {
  for (var i = 1; i < arguments.length; i++) {
    for (var key in arguments[i]) {
      if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
        obj[key] = arguments[i][key];
      }
    }
  }

  return obj;
}

var toString = Object.prototype.toString;

exports.toString = toString;
// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
/* eslint-disable func-style */
var isFunction = function isFunction(value) {
  return typeof value === 'function';
};
// fallback for older versions of Chrome and Safari
/* istanbul ignore next */
if (isFunction(/x/)) {
  exports.isFunction = isFunction = function (value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}
exports.isFunction = isFunction;

/* eslint-enable func-style */

/* istanbul ignore next */
var isArray = Array.isArray || function (value) {
  return value && typeof value === 'object' ? toString.call(value) === '[object Array]' : false;
};

exports.isArray = isArray;
// Older IE versions do not directly support indexOf so we must implement our own, sadly.

function indexOf(array, value) {
  for (var i = 0, len = array.length; i < len; i++) {
    if (array[i] === value) {
      return i;
    }
  }
  return -1;
}

function escapeExpression(string) {
  if (typeof string !== 'string') {
    // don't escape SafeStrings, since they're already safe
    if (string && string.toHTML) {
      return string.toHTML();
    } else if (string == null) {
      return '';
    } else if (!string) {
      return string + '';
    }

    // Force a string conversion as this will be done by the append regardless and
    // the regex test will do this transparently behind the scenes, causing issues if
    // an object's to string has escaped characters in it.
    string = '' + string;
  }

  if (!possible.test(string)) {
    return string;
  }
  return string.replace(badChars, escapeChar);
}

function isEmpty(value) {
  if (!value && value !== 0) {
    return true;
  } else if (isArray(value) && value.length === 0) {
    return true;
  } else {
    return false;
  }
}

function createFrame(object) {
  var frame = extend({}, object);
  frame._parent = object;
  return frame;
}

function blockParams(params, ids) {
  params.path = ids;
  return params;
}

function appendContextPath(contextPath, id) {
  return (contextPath ? contextPath + '.' : '') + id;
}


},{}],20:[function(require,module,exports){
// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = require('./dist/cjs/handlebars.runtime')['default'];

},{"./dist/cjs/handlebars.runtime":2}],21:[function(require,module,exports){
module.exports = require("handlebars/runtime")["default"];

},{"handlebars/runtime":20}],22:[function(require,module,exports){
(function (process,global){
(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"_process":1}],23:[function(require,module,exports){
var trim = require('./trim');

module.exports = function dasherize(str) {
  return trim(str).replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();
};

},{"./trim":31}],24:[function(require,module,exports){
var escapeRegExp = require('./escapeRegExp');

module.exports = function defaultToWhiteSpace(characters) {
  if (characters == null)
    return '\\s';
  else if (characters.source)
    return characters.source;
  else
    return '[' + escapeRegExp(characters) + ']';
};

},{"./escapeRegExp":25}],25:[function(require,module,exports){
var makeString = require('./makeString');

module.exports = function escapeRegExp(str) {
  return makeString(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
};

},{"./makeString":26}],26:[function(require,module,exports){
/**
 * Ensure some object is a coerced to a string
 **/
module.exports = function makeString(object) {
  if (object == null) return '';
  return '' + object;
};

},{}],27:[function(require,module,exports){
module.exports = function strRepeat(str, qty){
  if (qty < 1) return '';
  var result = '';
  while (qty > 0) {
    if (qty & 1) result += str;
    qty >>= 1, str += str;
  }
  return result;
};

},{}],28:[function(require,module,exports){
var pad = require('./pad');

module.exports = function lpad(str, length, padStr) {
  return pad(str, length, padStr);
};

},{"./pad":29}],29:[function(require,module,exports){
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

},{"./helper/makeString":26,"./helper/strRepeat":27}],30:[function(require,module,exports){
var pad = require('./pad');

module.exports = function rpad(str, length, padStr) {
  return pad(str, length, padStr, 'right');
};

},{"./pad":29}],31:[function(require,module,exports){
var makeString = require('./helper/makeString');
var defaultToWhiteSpace = require('./helper/defaultToWhiteSpace');
var nativeTrim = String.prototype.trim;

module.exports = function trim(str, characters) {
  str = makeString(str);
  if (!characters && nativeTrim) return nativeTrim.call(str);
  characters = defaultToWhiteSpace(characters);
  return str.replace(new RegExp('^' + characters + '+|' + characters + '+$', 'g'), '');
};

},{"./helper/defaultToWhiteSpace":24,"./helper/makeString":26}],32:[function(require,module,exports){
(function (DEBUG){
/**
/* @module app/App
/*/
"use strict";

console.info("Portfolio App started");

if (!DEBUG) {
	window.addEventListener("error", function(ev) {
		console.error("Uncaught Error", ev);
	});
}

require("Modernizr");
require("es6-promise").polyfill();
require("classlist-polyfill");
require("raf-polyfill");
require("matches-polyfill");
require("fullscreen-polyfill");
require("math-sign-polyfill");
require("setimmediate");

require("backbone").$ = require("backbone.native");
require("backbone.babysitter");
require("Backbone.Mutators");
require("hammerjs");

// document.addEventListener('DOMContentLoaded', function(ev) {
// 	console.log("%s:[event %s]", ev.target, ev.type);
// });

window.addEventListener("load", function(ev) {
	console.log("%s:[event %s]", ev.target, ev.type);

	// process bootstrap data, let errors go up the stack
	try {
		require("app/model/helper/bootstrap")(window.bootstrap);
	} catch (err) {
		var el = document.selectQuery(".app");
		el.classList.remove("app-initial");
		el.classList.add("app-error");
		throw new Error("bootstrap data error (" + err.message + ")", err.fileName, err.lineNumber);
	} finally { // detele global var
		delete window.bootstrap;
	}

	require("app/view/template/_helpers");
	// require("app/view/template/_partials");
	/** @type {module:app/view/helper/createColorStyleSheet} */
	require("app/view/helper/createColorStyleSheet").call();

	/** @type {module:app/view/AppView} */
	var AppView = require("app/view/AppView");

	/** @type {module:webfontloader} */
	var WebFont = require("webfontloader");
	WebFont.load({
		async: true,
		classes: false,
		custom: {
			families: [
				// "Franklin Gothic FS:n4,n7",
				"Franklin Gothic FS:n4,i4,n7,i7",
				"FolioFigures:n4",
			],
			testStrings: {
				"FolioFigures": "hms"
			},
		},
		active: function() {
			console.info("WebFont::active");
			// AppView.getInstance();
		},
		fontactive: function(familyName, variantFvd) {
			console.info("WebFont::fontactive '%s' (%s)", familyName, variantFvd);
		},
		inactive: function() {
			console.warn("WebFont::inactive");
			// AppView.getInstance();
		},
		fontinactive: function(familyName, variantFvd) {
			console.warn("WebFont::fontinactive '%s' (%s)", familyName, variantFvd);
		},
		// loading: function() {
		// 	console.log("WebFont::loading");
		// },
		// fontloading: function(familyName, variantDesc) {
		// 	console.log("WebFont::fontloading", familyName, JSON.stringify(variantDesc, null, " "));
		// },
	});
	AppView.getInstance();
});


if (DEBUG) {
	// /** @type {module:underscore} */
	// var _ = require("underscore");

	// var isFF = /Firefox/.test(window.navigator.userAgent);
	// var isIOS = /iPad|iPhone/.test(window.navigator.userAgent);
	/*
	if (/Firefox/.test(window.navigator.userAgent)) {
		console.prefix = "# ";
		var shift = [].shift;
		var logWrapFn = function() {
			if (typeof arguments[1] == "string") arguments[1] = console.prefix + arguments[1];
			return shift.apply(arguments).apply(console, arguments);
		};
		console.group = _.wrap(console.group, logWrapFn);
		console.log = _.wrap(console.log, logWrapFn);
		console.info = _.wrap(console.info, logWrapFn);
		console.warn = _.wrap(console.warn, logWrapFn);
		console.error = _.wrap(console.error, logWrapFn);
	}
	*/
	/*
	var saveLogs = function() {
		var logWrapFn = function(name, fn, msg) {
			document.documentElement.appendChild(
				document.createComment("[" + name + "] " + msg));
		};
		console.group = _.wrap(console.group, _.partial(logWrapFn, "group"));
		console.log = _.wrap(console.log, _.partial(logWrapFn, "log"));
		console.info = _.wrap(console.info, _.partial(logWrapFn, "info"));
		console.warn = _.wrap(console.warn, _.partial(logWrapFn, "warn"));
		console.error = _.wrap(console.error, _.partial(logWrapFn, "error"));
	};
	*/

	// handle error events on some platforms and production
	/*
	if (isIOS) {
		// saveLogs();
		window.addEventListener("error", function() {
			var args = Array.prototype.slice.apply(arguments),
				el = document.createElement("div"),
				html = "";
			_.extend(el.style, {
				fontfamily: "monospace",
				display: "block",
				position: "absolute",
				zIndex: "999",
				backgroundColor: "white",
				color: "black",
				width: "calc(100% - 3em)",
				bottom: "0",
				margin: "1em 1.5em",
				padding: "1em 1.5em",
				outline: "0.5em solid red",
				outlineOffset: "0.5em",
				boxSizing: "border-box",
				overflow: "hidden",
			});
			html += "<pre><b>location:<b> " + window.location + "</pre>";
			html += "<pre><b>event:<b> " + JSON.stringify(args.shift(), null, " ") + "</pre>";
			if (args.length) html += "<pre><b>rest:<b> " + JSON.stringify(args, null, " ") + "</pre>";
			el.innerHTML = html;
			document.body.appendChild(el);
		});
	}*/
}
}).call(this,true)

},{"Backbone.Mutators":"Backbone.Mutators","Modernizr":"Modernizr","app/model/helper/bootstrap":42,"app/view/AppView":49,"app/view/helper/createColorStyleSheet":72,"app/view/template/_helpers":101,"backbone":"backbone","backbone.babysitter":"backbone.babysitter","backbone.native":"backbone.native","classlist-polyfill":"classlist-polyfill","es6-promise":"es6-promise","fullscreen-polyfill":"fullscreen-polyfill","hammerjs":"hammerjs","matches-polyfill":"matches-polyfill","math-sign-polyfill":"math-sign-polyfill","raf-polyfill":"raf-polyfill","setimmediate":22,"webfontloader":"webfontloader"}],33:[function(require,module,exports){
(function (DEBUG){
/**
/* @module app/control/Controller
/*/

/** @type {module:underscore} */
var _ = require("underscore");
/** @type {module:backbone} */
var Backbone = require("backbone");

// /** @type {module:app/model/collection/TypeCollection} */
// var types = require("app/model/collection/TypeCollection");
// /** @type {module:app/model/collection/KeywordCollection} */
// var keywords = require("app/model/collection/KeywordCollection");
/** @type {module:app/model/collection/ArticleCollection} */
var articles = require("app/model/collection/ArticleCollection");
/** @type {module:app/model/collection/BundleCollection} */
var bundles = require("app/model/collection/BundleCollection");

/* --------------------------- *
/* Static private
/* --------------------------- */

/**
/* @constructor
/* @type {module:app/control/Controller}
/*/
var Controller = Backbone.Router.extend({

	// /** @override */
	// routes: {},

	/** @override */
	initialize: function(options) {
		this._routeNames = [];

		if (DEBUG) {
			this.on("route", function(routeName, args) {
				console.log("controller:[route] %s [%s]", routeName, args.join());
			});
		}

		/*
		 * Prefixed article regexp: /^article(?:\/([^\/]+))\/?$/
		 * Single bundle regexp: /^bundles(?:\/([^\/]+)(?:\/(\d+))?)?\/?$/
		 */
		this.route(/(.*)/,
			"notfound", this.toNotFound);
		this.route(/^([a-z][a-z0-9\-]*)\/?$/,
			"article-item", this.toArticleItem);
		this.route(/^(?:bundles)?\/?$/,
			"root", this.toRoot);
		// this.route(/^bundles\/?$/,
		// 	"bundle-list", this.toBundleList);
		this.route(/^bundles\/([^\/]+)\/?$/,
			"bundle-item", this.toBundleItem);
		this.route(/^bundles\/([^\/]+)\/(\d+)\/?$/,
			"media-item", this.toMediaItem);

		console.log("%s::initialize routes: %o", "controller", this._routeNames);
	},

	route: function(route, name, callback) {
		this._routeNames.push(_.isString(name) ? name : '');
		return Backbone.Router.prototype.route.apply(this, arguments);
	},

	/* ---------------------------
	/* JS to URL: public command methods
	/* --------------------------- */

	selectMedia: function(media) {
		this._goToLocation(media.get("bundle"), media);
	},

	selectBundle: function(bundle) {
		this._goToLocation(bundle);
	},

	deselectMedia: function() {
		this._goToLocation(bundles.selected);
	},

	deselectBundle: function() {
		this._goToLocation();
	},

	selectArticle: function(article) {
		this.navigate(article.get("handle"), { trigger: true });
	},

	deselectArticle: function() {
		this.navigate("", { trigger: true });
	},

	/* ---------------------------
	/* JS to URL: private helpers
	/* --------------------------- */

	/** Update location when navigation happens internally */
	_updateLocation: function() {
		var bundle, media;
		bundle = bundles.selected;
		if (bundle) {
			media = bundle.get("media").selected;
		}
		this.navigate(this._getLocation(bundle, media), {
			trigger: false
		});
	},

	_getLocation: function(bundle, media) {
		var mediaIndex, location = [];
		if (bundle) {
			location.push("bundles");
			location.push(bundle.get("handle"));
			if (media) {
				mediaIndex = bundle.get("media").indexOf(media);
				if (mediaIndex >= 0) {
					location.push(mediaIndex);
				}
			}
		}
		// location.push("");
		return location.join("/");
	},

	_goToLocation: function(bundle, media) {
		this.navigate(this._getLocation(bundle, media), {
			trigger: true
		});
	},

	/* --------------------------- *
	/* URL to JS: router handlers
	/* --------------------------- */

	toRoot: function() {
		this.trigger("change:before");
		if (bundles.selected) {
			bundles.selected.get("media").deselect();
			bundles.deselect();
		}
		// keywords.deselect();
		articles.deselect();
		this.trigger("change:after");
	},

	toNotFound: function(slug) {
		console.info("route:[*:%s]", slug);
	},

	// toBundleList: function() {
	// 	this.navigate("", {
	// 		trigger: true,
	// 		replace: true
	// 	});
	// },

	toBundleItem: function(bundleHandle) {
		var bundle = bundles.findWhere({
			handle: bundleHandle
		});
		if (!bundle) {
			throw new Error("Cannot find bundle with handle \"" + bundleHandle + "\"");
		}
		this._changeSelection(bundle);
	},

	toMediaItem: function(bundleHandle, mediaIndex) {
		var bundle, media;
		// if (bundleHandle) {
		bundle = bundles.findWhere({ handle: bundleHandle });
		if (!bundle) {
			throw new Error("No bundle with handle \"" + bundleHandle + "\" found");
		}
		// if (mediaIndex) {
		media = bundle.get("media").at(mediaIndex);
		if (!media) {
			throw new Error("No media at index " + mediaIndex + " in bundle with handle \"" + bundleHandle + "\" found");
		}
		// }
		// }
		this._changeSelection(bundle, media);
	},

	toArticleItem: function(articleHandle) {
		var article = articles.findWhere({ handle: articleHandle });
		if (!article) {
			throw new Error("Cannot find article with handle \"" + articleHandle + "\"");
		}
		this.trigger("change:before", article);
		bundles.deselect();
		articles.select(article);
		this.trigger("change:after", article);
	},

	/* -------------------------------
	/* URL to JS: private helpers
	/* ------------------------------- */

	/*
	/* NOTE: Selection order
	/* - Apply media selection to *incoming bundle*, as not to trigger
	/*	unneccesary events on an outgoing bundle. Outgoing bundle media selection
	/*	remains untouched.
	/* - Apply media selection *before* selecting the incoming bundle. Views
	/*	normally listen to the selected bundle only, so if the bundle is changing,
	/*	they will not be listening to media selection changes yet.
	/*/
	_changeSelection: function(bundle, media) {
		var lastBundle, lastMedia;
		if (bundle === void 0) bundle = null;
		if (media === void 0) media = null;

		lastBundle = bundles.selected;
		lastMedia = lastBundle ? lastBundle.get("media").selected : null;
		console.log("controller::_changeSelection bundle:[%s -> %s] media:[%s -> %s]",
			(lastBundle ? lastBundle.cid : lastBundle), (bundle ? bundle.cid : bundle),
			(lastMedia ? lastMedia.cid : lastMedia), (media ? media.cid : media)
		);

		if (!articles.selected && (lastBundle === bundle) && (lastMedia === media)) {
			return;
		}

		this.trigger("change:before", bundle, media);
		bundle && bundle.get("media").select(media);
		bundles.select(bundle);
		articles.deselect();
		this.trigger("change:after", bundle, media);
	},
});


module.exports = new Controller();
}).call(this,true)

},{"app/model/collection/ArticleCollection":38,"app/model/collection/BundleCollection":39,"backbone":"backbone","underscore":"underscore"}],34:[function(require,module,exports){
(function (DEBUG){
/**
/* @module app/control/Globals
/*/
/** @type {module:underscore} */
var _ = require("underscore");

module.exports = (function() {
	// reusable vars
	var o, s, so;
	// global hash
	var g = {};
	// SASS <--> JS shared hash
	var sass = require("../../../sass/variables.json");

	// JUNK FIRST: Some app-wide defaults
	// - - - - - - - - - - - - - - - - -
	g.VPAN_DRAG = 0.95; // as factor of pointer delta
	g.HPAN_OUT_DRAG = 0.4; // factor
	g.VPAN_OUT_DRAG = 0.1; // factor
	g.PAN_THRESHOLD = 15; // px
	g.COLLAPSE_THRESHOLD = 75; // px
	g.COLLAPSE_OFFSET = parseInt(sass.temp["collapse_offset"]);

	// breakpoints
	// - - - - - - - - - - - - - - - - -
	g.BREAKPOINTS = {};
	for (s in sass.breakpoints) {
		o = sass.breakpoints[s];
		/*if (Array.isArray(o)) {
			g.BREAKPOINTS[s] = Object.defineProperties({}, {
				"matches": {
					get: _.partial(_.some, o.map(window.matchMedia), _.property("matches"))
				},
				"media": {
					value: o.join(", ")
				},
				"queries": {
					value: o.map(window.matchMedia)
				},
			});
		} else {
			g.BREAKPOINTS[s] = window.matchMedia(o);
		}*/
		o = Array.isArray(o) ? o.join(", ") : o;
		o = o.replace(/[\'\"]/g, "");
		o = window.matchMedia(o);
		o.className = s;
		g.BREAKPOINTS[s] = o;
	}
	if (DEBUG) {
		console.group("Breakpoints");
		for (s in g.BREAKPOINTS) {
			// console.log("%s: %o %o", s, g.BREAKPOINTS[s], sass.breakpoints[s] + '');
			console.log("%s: %o", s, g.BREAKPOINTS[s].media);
		}
		console.groupEnd();
	}

	// base colors, dimensions
	// - - - - - - - - - - - - - - - - -
	g.DEFAULT_COLORS = _.clone(sass.default_colors);
	g.HORIZONTAL_STEP = parseFloat(sass.units["hu_px"]);
	g.VERTICAL_STEP = parseFloat(sass.units["vu_px"]);


	// paths, networking
	// - - - - - - - - - - - - - - - - -
	// var toAbsoluteURL = (function() {
	// 	var a = null;
	// 	return function(url) {
	// 		a = a || document.createElement('a');
	// 		a.href = url;
	// 		return a.href;
	// 	};
	// })();
	// g.APP_ROOT = toAbsoluteURL(window.approot);
	// g.MEDIA_DIR = toAbsoluteURL(window.mediadir);

	g.APP_ROOT = window.approot;
	g.MEDIA_DIR = window.mediadir;

	delete window.approot;
	delete window.mediadir;

	// hardcoded font data
	// - - - - - - - - - - - - - - - - -
	g.FONT_METRICS = {
		"Franklin Gothic FS": {
			"unitsPerEm": 1000,
			"ascent": 827,
			"descent": -173
		},
		"ITCFranklinGothicStd": {
			"unitsPerEm": 1000,
			"ascent": 686,
			"descent": -314
		},
		"FolioFigures": {
			"unitsPerEm": 1024,
			"ascent": 939,
			"descent": -256
		},
	};

	g.PAUSE_CHAR = String.fromCharCode(0x23F8);
	g.PLAY_CHAR = String.fromCharCode(0x23F5);
	g.STOP_CHAR = String.fromCharCode(0x23F9);

	// translate common template

	g.TRANSLATE_TEMPLATE = function(x, y) {
		return "translate(" + x + "px, " + y + "px)";
		// return "translate3d(" + x + "px, " + y + "px ,0px)";
	};
	// timing, easing
	// - - - - - - - - - - - - - - - - -
	var ease = g.TRANSITION_EASE = sass.transitions["ease"];
	var duration = g.TRANSITION_DURATION = parseFloat(sass.transitions["duration_ms"]);
	var delayInterval = g.TRANSITION_DELAY_INTERVAL = parseFloat(sass.transitions["delay_interval_ms"]);
	var minDelay = g.TRANSITION_MIN_DELAY = parseFloat(sass.transitions["min_delay_ms"]);
	var delay = g.TRANSITION_DELAY = g.TRANSITION_DURATION + g.TRANSITION_DELAY_INTERVAL;

	// css transition presets
	// TODO: get rid of this
	// - - - - - - - - - - - - - - - - -

	// var tx = function(txo, durationCount, delayCount) {
	// 	txo.duration = (duration * durationCount)
	// 		+ (delayInterval * (durationCount - 1));
	// 	txo.delay = (delay * delayCount) + minDelay;
	// };

	o = {};

	o.NONE = {
		delay: 0,
		duration: 0,
		easing: "step-start"
	};
	o.NOW = {
		delay: 0,
		duration: duration,
		easing: ease
	};
	o.UNSET = _.defaults({
		cssText: ""
	}, o.NONE);

	var txAligned = _.defaults({
		duration: duration - minDelay
	}, o.NOW);
	o.FIRST = _.defaults({
		delay: delay * 0.0 + minDelay
	}, txAligned);
	o.BETWEEN = _.defaults({
		delay: delay * 1.0 + minDelay
	}, txAligned);
	o.LAST = _.defaults({
		delay: delay * 2.0 + minDelay
	}, txAligned);
	o.AFTER = _.defaults({
		delay: delay * 2.0 + minDelay
	}, txAligned);

	o.BETWEEN_EARLY = _.defaults({
		delay: delay * 1.0 + minDelay - 60
	}, txAligned);
	o.BETWEEN_LATE = _.defaults({
		delay: delay * 1.0 + minDelay + 60
	}, txAligned);

	o.FIRST_LATE = _.defaults({
		delay: delay * 0.5 + minDelay
	}, txAligned);
	o.LAST_EARLY = _.defaults({
		delay: delay * 1.5 + minDelay
	}, txAligned);
	// o.FIRST_LATE = 		_.defaults({delay: txDelay*0.0 + txMinDelay*2}, txAligned);
	// o.LAST_EARLY = 		_.defaults({delay: txDelay*2.0 + txMinDelay*0}, txAligned);
	// o.AFTER = 			_.defaults({delay: txDelay*2.0 + txMinDelay}, txAligned);

	console.groupCollapsed("Transitions");
	for (s in o) {
		so = o[s];
		so.name = s;
		so.className = "tx-" + s.replace("_", "-").toLowerCase();
		if (!so.hasOwnProperty("cssText")) {
			so.cssText = so.duration / 1000 + "s " + so.easing + " " + so.delay / 1000 + "s";
		}
		console.log("%s: %s", so.name, so.cssText);
	}
	console.groupEnd();
	g.transitions = o;

	return g;
}());
}).call(this,true)

},{"../../../sass/variables.json":120,"underscore":"underscore"}],35:[function(require,module,exports){
/**
 * @module app/model/BaseItem
 * @requires module:backbone
 */

/** @type {module:backbone} */
var Backbone = require("backbone");

var defaults = {
	routeName: "initial",
	collapsed: false,
	article: null,
	withArticle: false,
	bundle: null,
	withBundle: false,
	media: null,
	withMedia: false,
};

var AppState = Backbone.Model.extend({
	defaults: defaults,
	// getters: Object.keys(defaults),
});

module.exports = AppState;
},{"backbone":"backbone"}],36:[function(require,module,exports){
/**
 * @module app/model/BaseItem
 * @requires module:backbone
 */

/** @type {module:backbone} */
var Model = require("backbone").Model;
/** @type {module:underscore} */
var _ = require("underscore");

// /** @type {module:app/control/Globals} */
// var Globals = require("app/control/Globals");
// /** @type {module:app/utils/strings/stripTags} */
// var stripTags = require("utils/strings/stripTags");
// /** @type {module:app/model/parseSymAttrs} */
//var parseSymAttrs = require("app/model/parseSymAttrs");

var parseSymAttrs = function(s) {
	return s.replace(/(\,|\;)/g, function(m) {
		return (m == ",") ? ";" : ",";
	});
};
var toAttrsHash = function(obj, attr) {
	if (_.isString(attr)) {
		var idx = attr.indexOf(":");
		if (idx > 0) {
			obj[attr.substring(0, idx)] = parseSymAttrs(attr.substring(idx + 1));
		} else {
			obj[attr] = attr; // to match HTML5<>XHTML valueless attributes
		}
	} // else ignore non-string values
	return obj;
};

var BaseItemProto = {

	_domPrefix: "_",

	/** @type {Object} */
	defaults: {
		// attrs: function() { return {}; },
		get attrs() {
			return {};
		},
	},

	getters: ["domid"],

	mutators: {
		domid: function() {
			if (!this.hasOwnProperty("_domId"))
				this._domId = this._domPrefix + this.id;
			return this._domId;
		},
		attrs: {
			set: function(key, value, options, set) {
				if (Array.isArray(value)) {
					value = value.reduce(toAttrsHash, {});
				}
				if (!_.isObject(value)) {
					console.error("%s::attrs value not an object or string array", this.cid, value);
					value = {};
				}
				set(key, value, options);
			}
		},
	},

	attr: function(attr) {
		return this.attrs()[attr];
	},

	attrs: function() {
		return this.get("attrs");
	},

	toString: function() {
		return this.get("domid");
	}
};

var BaseItem = {
	extend: function(proto, obj) {
		var constr, propName; //, propDef;
		for (propName in proto) {
			if (proto.hasOwnProperty(propName) && _.isObject(proto[propName])) { //(Object.getPrototypeOf(proto[propName]) === Object.prototype)) {
				_.defaults(proto[propName], BaseItemProto[propName]);
				// console.log("BaseItem::extend '%s:%s' is Object\n%s", proto._domPrefix, p, JSON.stringify(proto[p]));
			}
		}
		// if (proto.properties && this.prototype.properties) {
		// 	_.defaults(proto.properties, this.prototype.properties);
		// }
		constr = Model.extend.apply(this, arguments);

		if (Array.isArray(constr.prototype.getters)) {
			constr.prototype.getters.forEach(function(getterName) {
				Object.defineProperty(constr.prototype, getterName, {
					enumerable: true,
					get: function() {
						return this.get(getterName);
					}
				});
			});
		}
		// if (_.isObject(proto.properties)) {
		// 	for (propName in proto.properties) {
		// 		if (proto.properties.hasOwnProperty(propName)) {
		// 			propDef = proto.properties[propName];
		// 			if (_.isFunction(propDef)) {
		// 				proto.properties[propName] = {
		// 					enumerable: true, get: propDef
		// 				};
		// 			} else if (_.isObject(propDef)){
		// 				propDef.enumerable = true;
		// 			} else {
		// 				delete proto.properties[propName];
		// 			}
		// 		}
		// 	}
		// 	Object.defineProperties(proto, proto.properties);
		// 	delete proto.properties;
		// }
		return constr;
	}
};

/**
 * @constructor
 * @type {module:app/model/BaseItem}
 */
module.exports = BaseItem.extend.call(Model, BaseItemProto, BaseItem);
// module.exports = Model.extend(BaseItemProto, BaseItem);

},{"backbone":"backbone","underscore":"underscore"}],37:[function(require,module,exports){
/**
 * @module app/model/SelectableCollection
 */

/** @type {module:underscore} */
var _ = require("underscore");
/** @type {module:backbone} */
var Backbone = require("backbone");

/**
 * @constructor
 * @type {module:app/model/SelectableCollection}
 */
var SelectableCollection = Backbone.Collection.extend({

	initialize: function(models, options) {
		options = _.defaults({}, options, {
			initialSelection: "none",
			silentInitial: true
		});
		this.initialSelection = options.initialSelection;
		this.initialOptions = {
			silent: options.silentInitial
		};
	},

	reset: function(models, options) {
		this.deselect(this.initialOptions);
		Backbone.Collection.prototype.reset.apply(this, arguments);
		if (this.initialSelection === "first" && this.length) {
			this.select(this.at(0), this.initialOptions);
		}
	},

	select: function(newModel, options) {
		if (newModel === void 0) {
			newModel = null;
		}
		if (this.selected === newModel) {
			return;
		}
		var triggerEvents = !(options && options.silent);
		var oldModel = this.selected;

		this.lastSelected = this.selected;
		this.lastSelectedIndex = this.selectedIndex;
		this.selected = newModel;
		this.selectedIndex = this.indexOf(newModel);

		if (oldModel) {
			if (_.isFunction(oldModel.deselect)) {
				oldModel.deselect(options);
			} else if (triggerEvents) {
				oldModel.selected = void 0;
				oldModel.trigger("deselected", newModel, oldModel);
			}
			if (triggerEvents) this.trigger("deselect:one", oldModel);
		} else {
			if (triggerEvents) this.trigger("deselect:none", null);
		}

		if (newModel) {
			if (_.isFunction(newModel.select)) {
				newModel.select(options);
			} else if (triggerEvents) {
				newModel.selected = true;
				newModel.trigger("selected", newModel, oldModel);
			}
			if (triggerEvents) this.trigger("select:one", newModel);
		} else {
			if (triggerEvents) this.trigger("select:none", null);
		}
	},

	deselect: function(options) {
		this.select(null, options);
	},

	selectAt: function(index, options) {
		if (0 > index || index >= this.length) {
			new RangeError("index is out of bounds");
		}
		this.select(this.at(index), options);
	},

	distance: function(a, b) {
		var aIdx, bIdx;

		if (!a) return NaN;
		aIdx = this.indexOf(a);
		if (aIdx == -1) return NaN;

		if (arguments.length == 1) {
			bIdx = this.selectedIndex;
		} else {
			if (!b) return NaN;
			bIdx = this.indexOf(b);
			if (bIdx == -1) return NaN;
		}
		return Math.abs(bIdx - aIdx);
	},

	/* TODO: MOVE INTO MIXIN */

	/** @return boolean	/*/
	hasFollowing: function(model) {
		model || (model = this.selected);
		return this.indexOf(model) < (this.length - 1);
	},

	/** @return next model	*/
	following: function(model) {
		model || (model = this.selected);
		return this.hasFollowing(model) ? this.at(this.indexOf(model) + 1) : null;
	},

	/** @return next model or the beginning if at the end */
	followingOrFirst: function(model) {
		model || (model = this.selected);
		return this.at((this.indexOf(model) + 1) % this.length);
	},

	/** @return boolean	/*/
	hasPreceding: function(model) {
		model || (model = this.selected);
		return this.indexOf(model) > 0;
	},

	/** @return the previous model */
	preceding: function(model) {
		model || (model = this.selected);
		return this.hasPreceding(model) ? this.at(this.indexOf(model) - 1) : null;
	},

	/** @return the previous model or the end if at the beginning */
	precedingOrLast: function(model) {
		model || (model = this.selected);
		var index = this.indexOf(model) - 1;
		return this.at(index > -1 ? index : this.length - 1);
	},

});

module.exports = SelectableCollection;

},{"backbone":"backbone","underscore":"underscore"}],38:[function(require,module,exports){
/**
 * @module app/model/collection/ArticleCollection
 */

/** @type {module:app/model/SelectableCollection} */
var SelectableCollection = require("app/model/SelectableCollection");

/** @type {module:app/model/item/ArticleItem} */
var ArticleItem = require("app/model/item/ArticleItem");

/**
 * @constructor
 * @type {module:app/model/collection/ArticleCollection}
 */
var ArticleCollection = SelectableCollection.extend({

	/** @type {Backbone.Model} */
	model: ArticleItem

});

module.exports = new ArticleCollection();
},{"app/model/SelectableCollection":37,"app/model/item/ArticleItem":43}],39:[function(require,module,exports){
/**
 * @module app/model/collection/BundleCollection
 */

/** @type {module:app/model/SelectableCollection} */
var SelectableCollection = require("app/model/SelectableCollection");

/** @type {module:app/model/item/BundleItem} */
var BundleItem = require("app/model/item/BundleItem");

/**
 * @constructor
 * @type {module:app/model/collection/BundleCollection}
 */
var BundleCollection = SelectableCollection.extend({

	/** @type {Backbone.Model} */
	model: BundleItem,

	/** @type {Function} */
	comparator: function(oa, ob) {
		var a = oa.get("completed");
		var b = ob.get("completed");
		if (a > b) {
			return -1;
		} else if (a < b) {
			return 1;
		} else {
			return 0;
		}
	},

	/** @type {String} */
	url: "/json/bundles/",

});

module.exports = new BundleCollection();

},{"app/model/SelectableCollection":37,"app/model/item/BundleItem":44}],40:[function(require,module,exports){
/**
 * @module app/model/collection/KeywordCollection
 * @requires module:backbone
 */

/** @type {module:app/model/SelectableCollection} */
var SelectableCollection = require("app/model/SelectableCollection");

/** @type {module:app/model/item/KeywordItem} */
var KeywordItem = require("app/model/item/KeywordItem");

/**
 * @constructor
 * @type {module:app/model/collection/KeywordCollection}
 */
var KeywordCollection = SelectableCollection.extend({

	/** @type {Backbone.Model} */
	model: KeywordItem

});

module.exports = new KeywordCollection();

},{"app/model/SelectableCollection":37,"app/model/item/KeywordItem":45}],41:[function(require,module,exports){
/**
 * @module app/model/collection/TypeCollection
 * @requires module:backbone
 */

/** @type {module:backbone} */
var Backbone = require("backbone");

/** @type {module:app/model/item/TypeItem} */
var TypeItem = require("app/model/item/TypeItem");

/**
 * @constructor
 * @type {module:app/model/collection/TypeCollection}
 */
var TypeCollection = Backbone.Collection.extend({

	/** @type {Backbone.Model} */
	model: TypeItem

});

module.exports = new TypeCollection();

},{"app/model/item/TypeItem":48,"backbone":"backbone"}],42:[function(require,module,exports){
/** @type {module:underscore} */
var _ = require("underscore");

module.exports = function(bootstrap) {

	/** @type {module:app/control/Globals} */
	var Globals = require("app/control/Globals");

	// Globals.GA_TAGS = bootstrap["ga-tags"];
	// Globals.PARAMS = bootstrap["params"];
	// Globals.APP_ROOT = bootstrap["params"]["root"];
	// Globals.MEDIA_DIR = bootstrap["params"]["uploads"];
	Globals.APP_NAME = bootstrap["params"]["website-name"];

	/** @type {module:app/model/collection/TypeCollection} */
	var typeList = require("app/model/collection/TypeCollection");
	/** @type {module:app/model/collection/KeywordCollection} */
	var keywordList = require("app/model/collection/KeywordCollection");
	/** @type {module:app/model/collection/BundleCollection} */
	var bundleList = require("app/model/collection/BundleCollection");
	/** @type {module:app/model/collection/ArticleCollection} */
	var articleList = require("app/model/collection/ArticleCollection");

	// Fix-ups to bootstrap data.
	var articles = bootstrap["articles-all"];
	var types = bootstrap["types-all"];
	var keywords = bootstrap["keywords-all"];
	var bundles = bootstrap["bundles-all"];
	var media = bootstrap["media-all"];

	// Attach media to their bundles
	var mediaByBundle = _.groupBy(media, "bId");

	// Fill-in back-references:
	// Create Keyword.bundleIds from existing Bundle.keywordIds,
	// then Bundle.typeIds from unique Keyword.typeId

	// _.each(bundles, function (bo, bi, ba) {
	bundles.forEach(function(bo, bi, ba) {
		bo.tIds = [];
		bo.media = mediaByBundle[bo.id];
		// _.each(keywords, function (ko, ki, ka) {
		keywords.forEach(function(ko, ki, ka) {
			if (bi === 0) {
				ko.bIds = [];
			}
			// if (_.contains(bo.kIds, ko.id)) {
			if (bo.kIds.indexOf(ko.id) != -1) {
				ko.bIds.push(bo.id);
				// if (!_.contains(bo.tIds, ko.tId)) {
				if (bo.tIds.indexOf(ko.tId) == -1) {
					bo.tIds.push(ko.tId);
				}
			}
		});
	});

	// Fill collection singletons
	articleList.reset(articles);
	typeList.reset(types);
	keywordList.reset(keywords);
	bundleList.reset(bundles);

	// bootstrap["params"] = bootstrap["articles-all"] = bootstrap["types-all"] = bootstrap["keywords-all"] = bootstrap["bundles-all"] = bootstrap["media-all"] = null;
};
},{"app/control/Globals":34,"app/model/collection/ArticleCollection":38,"app/model/collection/BundleCollection":39,"app/model/collection/KeywordCollection":40,"app/model/collection/TypeCollection":41,"underscore":"underscore"}],43:[function(require,module,exports){
/**
 * @module app/model/item/ArticleItem
 */

// /** @type {module:backbone} */
// var Backbone = require("backbone");
/** @type {module:app/model/item/SourceItem} */
var BaseItem = require("app/model/BaseItem");

/**
 * @constructor
 * @type {module:app/model/item/ArticleItem}
 */
module.exports = BaseItem.extend({

	_domPrefix: "a",

	/** @type {Object} */
	defaults: {
		name: "",
		handle: "",
		text: ""
	},

});
},{"app/model/BaseItem":36}],44:[function(require,module,exports){
/**
 * @module app/model/item/BundleItem
 * @requires module:backbone
 */

// /** @type {module:backbone} */
// var Backbone = require("backbone");
/** @type {module:underscore} */
var _ = require("underscore");
/** @type {Function} */
var Color = require("color");

/** @type {module:app/model/item/SourceItem} */
var BaseItem = require("app/model/BaseItem");
/** @type {module:app/model/item/MediaItem} */
var MediaItem = require("app/model/item/MediaItem");
/** @type {module:app/model/SelectableCollection} */
var SelectableCollection = require("app/model/SelectableCollection");

/** @type {module:app/control/Globals} */
var Globals = require("app/control/Globals");
/** @type {module:app/utils/strings/stripTags} */
var stripTags = require("utils/strings/stripTags");
// /** @type {module:app/utils/strings/parseTaglist} */
// var parseSymAttrs = require("app/model/parseSymAttrs");

// /** @type {module:app/model/collection/KeywordCollection} */
// var keywords = require("app/model/collection/KeywordCollection");

// Globals.DEFAULT_COLORS["color"];
// Globals.DEFAULT_COLORS["background-color"];
var attrsDefault = _.defaults({
	"has-colors": "defaults"
}, Globals.DEFAULT_COLORS);

/** @private */
var MediaCollection = SelectableCollection.extend({
	model: MediaItem,
	comparator: "o"
});

/**
 * @constructor
 * @type {module:app/model/item/BundleItem}
 */
module.exports = BaseItem.extend({

	_domPrefix: "b",

	/** @type {Object|Function} */
	// defaults: function() {
	// 	return {
	// 		name: "",
	// 		handle: "",
	// 		desc: "",
	// 		completed: 0,
	// 		kIds: [],
	// 	};
	// },
	defaults: {
		name: "",
		handle: "",
		desc: "",
		completed: 0,
		get kIds() {
			return [];
		},
		// get keywords() { return []; },
	},

	getters: ["name", "media"],

	mutators: {
		text: function() {
			return stripTags(this.get("desc"));
		},
		// kIds: {
		// 	set: function (key, value, options, set) {
		// 		if (Array.isArray(value)) {
		// 			set("keywords", value.map(function(id) {
		// 				var obj = keywords.get(id);
		// 				return obj;
		// 			}, this), options;
		// 		}
		// 		set(key, value, options);
		// 	},
		// },
		media: {
			transient: true,
			set: function(key, value, options, set) {
				if (Array.isArray(value)) {
					value.forEach(function(o) {
						o.bundle = this;
					}, this);
					value = new MediaCollection(value);
				}
				set(key, value, options);
			},
		},
	},

	initialize: function(attrs, options) {
		this.colors = {
			fgColor: new Color(this.attr("color")),
			bgColor: new Color(this.attr("background-color")),
			lnColor: new Color(this.attr("--link-color")),
		};
		this.colors.hasDarkBg = this.colors.fgColor.luminosity() > this.colors.bgColor.luminosity();
	},

	attrs: function() {
		return this._attrs || (this._attrs = _.defaults({}, this.get("attrs"), attrsDefault));
	},
});

},{"app/control/Globals":34,"app/model/BaseItem":36,"app/model/SelectableCollection":37,"app/model/item/MediaItem":46,"color":"color","underscore":"underscore","utils/strings/stripTags":118}],45:[function(require,module,exports){
/**
 * @module app/model/item/KeywordItem
 * @requires module:app/model/BaseItem
 */

/** @type {module:app/model/BaseItem} */
var BaseItem = require("app/model/BaseItem");

// /** @type {module:app/model/collection/TypeCollection} */
// var types = require("app/model/collection/TypeCollection");

/**
 * @constructor
 * @type {module:app/model/item/KeywordItem}
 */
module.exports = BaseItem.extend({

	_domPrefix: "k",

	/** @type {Object} */
	defaults: {
		name: "",
		handle: "",
		tId: -1,
	},

	// mutators: {
	// 	tId: {
	// 		set: function (key, value, options, set) {
	// 			var type = types.get(value);
	// 			if (type) {
	// 				type.get("keywords").push(this);
	// 				set("type", type, options);
	// 			}
	// 			set(key, value, options);
	// 		}
	// 	},
	// }
});

},{"app/model/BaseItem":36}],46:[function(require,module,exports){
/**
 * @module app/model/item/MediaItem
 * @requires module:backbone
 */

// /** @type {module:backbone} */
// var Backbone = require("backbone");
/** @type {module:underscore} */
var _ = require("underscore");
/** @type {Function} */
var Color = require("color");

/** @type {module:app/model/item/SourceItem} */
var BaseItem = require("app/model/BaseItem");
/** @type {module:app/model/item/SourceItem} */
var SourceItem = require("app/model/item/SourceItem");
/** @type {module:app/model/SelectableCollection} */
var SelectableCollection = require("app/model/SelectableCollection");

/** @type {module:app/control/Globals} */
var Globals = require("app/control/Globals");
/** @type {module:app/utils/strings/stripTags} */
var stripTags = require("utils/strings/stripTags");
// /** @type {module:app/model/parseSymAttrs} */
// var parseSymAttrs = require("app/model/parseSymAttrs");

// console.log(Globals.PARAMS);

var urlTemplates = {
	"original": _.template(Globals.MEDIA_DIR + "/<%= src %>"),
	"constrain-width": _.template(Globals.APP_ROOT + "image/1/<%= width %>/0/uploads/<%= src %>"),
	"constrain-height": _.template(Globals.APP_ROOT + "image/1/0/<%= height %>/uploads/<%= src %>"),
	"debug-bandwidth": _.template(Globals.MEDIA_DIR.replace(/(https?\:\/\/[^\/]+)/, "$1/slow/<%= kbps %>") + "/<%= src %>"),
};

/**
 * @constructor
 * @type {module:app/model/item/MediaItem.SourceCollection}
 */
var SourceCollection = SelectableCollection.extend({
	model: SourceItem
});

/**
 * @constructor
 * @type {module:app/model/item/MediaItem}
 */
module.exports = BaseItem.extend({

	_domPrefix: "m",

	/** @type {Object} */
	defaults: {
		name: "<p><em>Untitled</em></p>",
		sub: "",
		o: 0,
		bId: -1,
		srcIdx: 0,
		get srcset() {
			return [];
		},
		get sources() {
			return new SourceCollection();
		},
	},

	getters: ["name", "bundle", "source", "sources"],

	mutators: {
		// desc: function() {
		// 	return this.get("name");
		// },
		handle: function() {
			return this.get("src");
		},
		text: function() {
			if (!this.hasOwnProperty("_text"))
				this._text = _.unescape(stripTags(this.get("name")));
			return this._text;
		},
		attrs: {
			set: function(key, value, opts, set) {
				this._attrs = null;
				BaseItem.prototype.mutators.attrs.set.apply(this, arguments);
				this._updateSources();
			}
		},
		srcset: {
			set: function(key, value, opts, set) {
				set(key, value, opts);
				this.get("sources").reset(value, opts);
				this._updateSources();
			}
		},
		source: {
			transient: true,
			get: function() {
				return this.get("sources").at(this.get("srcIdx"));
			},
		},
	},

	initialize: function() {
		this._updateColors();
		this.listenTo(this, "change:attrs change:bundle", function() {
			this._attrs = null;
		});
	},

	attrs: function() {
		return this._attrs || (this._attrs = _.defaults({}, this.get("bundle").attrs(), this.get("attrs")));
	},

	_updateColors: function() {
		this.colors = {
			fgColor: new Color(this.attr("color")),
			bgColor: new Color(this.attr("background-color"))
		};
		this.colors.hasDarkBg = this.colors.fgColor.luminosity() > this.colors.bgColor.luminosity();
	},

	_updateSources: function() {
		var srcObj = {
			kbps: this.attr("@debug-bandwidth")
		};
		var srcTpl = urlTemplates[srcObj.kbps ? "debug-bandwidth" : "original"];
		this.get("sources").forEach(function(item) {
			srcObj.src = item.get("src");
			item.set("original", srcTpl(srcObj));
		});
	},

	// _updateSourcesArr: function() {
	// 	var srcset = this.get("srcset");
	// 	if (Array.isArray(srcset)) {
	// 		var srcObj = { kbps: this.attr("@debug-bandwidth") };
	// 		var srcTpl = Globals.MEDIA_SRC_TPL[srcObj.kbps? "debug-bandwidth" : "original"];
	// 		srcset.forEach(function(o) {
	// 			srcObj.src = o.src;
	// 			o.original = srcTpl(srcObj);
	// 		}, this);
	// 	}
	// 	this.get("sources").reset(srcset);
	// },

});
},{"app/control/Globals":34,"app/model/BaseItem":36,"app/model/SelectableCollection":37,"app/model/item/SourceItem":47,"color":"color","underscore":"underscore","utils/strings/stripTags":118}],47:[function(require,module,exports){
(function (DEBUG){
/**
 * @module app/model/item/SourceItem
 * @requires module:backbone
 */

// /** @type {module:backbone} */
// var Backbone = require("backbone");
// /** @type {module:app/control/Globals} */
// var Globals = require("app/control/Globals");
/** @type {module:app/model/item/SourceItem} */
var BaseItem = require("app/model/BaseItem");

/** @type {String} */
var noCacheSuffix = "?" + Date.now();

/**
 * @constructor
 * @type {module:app/model/item/SourceItem}
 */
// module.exports = Backbone.Model.extend({
module.exports = BaseItem.extend({

	/** @type {Object} */
	defaults: {
		src: null,
		mime: null,
		w: null,
		h: null,
	},

	getters: ["src", "original"],

	mutators: {
		src: {
			set: function(key, value, options, set) {
				if (DEBUG) {
					value += noCacheSuffix;
				}
				set(key, value, options);
			}
		},
		// original: { 
		// 	transient: true,
		// 	get: function (key, value, options, set) {
		// 		return this.attributes.original || (this.attributes.original = this._composeOriginalSrc());
		// 	},
		// },
		// media: {
		// 	transient: true,
		// 	get: function () {
		// 		var retval;
		// 		if (this._noRecusion) {
		// 			console.log("%s::media returning null", this.cid);
		// 			retval = null;//this.id;
		// 		} else {
		// 			console.log("%s::media returning Object", this.cid);
		// 			this._noRecusion = true;
		// 			retval = this.attributes.media;
		// 			this._noRecusion = false;
		// 		}
		// 		return retval;
		// 	},
		// 	set: function (key, value, options, set) {
		// 		if (value instanceof BaseItem) {
		// 			set(key, value, options);
		// 		}
		// 	},
		// },
	},

	// initialize: function() {
	// 	if (DEBUG) {
	// 		var cb = function() {
	// 			// console.log("@debug-bandwidth:", JSON.stringify(this.get("media").attr("@debug-bandwidth")));
	// 			console.log("media:", JSON.stringify(this.toJSON()));
	// 			// if ((this.get("media") instanceof BaseItem) && this.get("media").attr("@debug-bandwidth")) {
	// 			// 	console.log("original", this.get("original"));
	// 			// 	console.log("media:", JSON.stringify(this.get("media").toJSON()));
	// 			// }
	// 		}.bind(this);
	// 		window.requestAnimationFrame(cb);
	// 	}
	// },
	// 
	// _composeOriginalSrc: function() {
	// 	var values = { src: this.get("src") };
	// 	if (this.has("media") && (values.kbps = this.get("media").attr("@debug-bandwidth"))) {
	// 	// if (this.has("media") && this.get("media").attrs().hasOwnProperty("@debug-bandwidth")) {
	// 	// 	values.kbps = this.get("media").attrs()["@debug-bandwidth"];
	// 		return Globals.MEDIA_SRC_TPL["debug-bandwidth"](values);
	// 	}
	// 	return Globals.MEDIA_SRC_TPL["original"](values);
	// },
});

}).call(this,true)

},{"app/model/BaseItem":36}],48:[function(require,module,exports){
/**
 * @module app/model/item/TypeItem
 */

// /** @type {module:backbone} */
// var Backbone = require("backbone");
/** @type {module:app/model/item/SourceItem} */
var BaseItem = require("app/model/BaseItem");

/**
 * @constructor
 * @type {module:app/model/item/TypeItem}
 */
module.exports = BaseItem.extend({

	_domPrefix: "t",

	/** @type {Object} */
	defaults: {
		name: "",
		handle: "",
		// get kIds() { return []; },
		// get keywords() { return []; },
	},

});

},{"app/model/BaseItem":36}],49:[function(require,module,exports){
(function (DEBUG){
/**
/* @module app/view/AppView
/*/

/** @type {module:underscore} */
var _ = require("underscore");
/** @type {module:backbone} */
var Backbone = require("backbone");
// /** @type {Function} */
// var Color = require("color");

/** @type {module:app/utils/debug/traceArgs} */
var stripTags = require("utils/strings/stripTags");
// /** @type {Function} */
// var prefixedProperty = require("utils/prefixedProperty");
// /** @type {Function} */
// var prefixedEvent = require("utils/prefixedEvent");

/** @type {module:app/control/Globals} */
var Globals = require("app/control/Globals");
/** @type {module:app/view/base/TouchManager} */
var TouchManager = require("app/view/base/TouchManager");
/** @type {module:app/control/Controller} */
var controller = require("app/control/Controller");
/** @type {module:app/model/AppState} */
var AppState = require("app/model/AppState");
/** @type {module:app/model/collection/BundleCollection} */
var bundles = require("app/model/collection/BundleCollection");
/** @type {module:app/model/collection/ArticleCollection} */
var articles = require("app/model/collection/ArticleCollection");

/** @type {module:app/view/base/View} */
var View = require("app/view/base/View");
/** @type {module:app/view/NavigationView} */
var NavigationView = require("app/view/NavigationView");
/** @type {module:app/view/ContentView} */
var ContentView = require("app/view/ContentView");

var AppView = {
	getInstance: function() {
		if (!(window.app instanceof this)) {
			window.app = new(this)({
				model: new AppState()
			});
		}
		return window.app;
	}
};

var AppViewProto = {

	/** @override */
	cidPrefix: "app",
	/** @override */
	el: "html",
	// /** @override */
	className: "app without-bundle without-media without-article",
	/** @override */
	model: AppState,

	/** @override */
	events: {
		"visibilitychange": function(ev) {
			console.log(ev.type);
		},
		"fullscreenchange": function(ev) {
			console.log(ev.type);
		},
		// "scroll #container": function(ev) {
		// 	console.log(ev.type, ev);
		// }
	},

	properties: {
		container: {
			get: function() {
				return this._container || (this._container =
					// document.getElementById("container")
					document.body
				);
			}
		}
	},

	/** @override */
	initialize: function(options) {
		/* create single hammerjs manager */
		this.touch = TouchManager.init(this.container);
		this.touch.set({
			enable: (function() {
				return this.el.scrollHeight == this.el.clientHeight;
				// return this.el.scrollTop === 0;
				// return this.container.scrollTop === 0;
				// return this.model.get("collapsed") && this.model.get("withBundle");
			}).bind(this)
		});

		// this._afterRender = this._afterRender.bind(this);
		this._onResize = this._onResize.bind(this);

		/* render on resize, onorientationchange, visibilitychange */
		window.addEventListener("orientationchange", this._onResize, false);
		window.addEventListener("resize", _.debounce(this._onResize, 100, false /* immediate? */ ), false);

		// var h = function(ev) { console.log(ev.type, ev) };
		// window.addEventListener("scroll", h, false);
		// window.addEventListener("wheel", h, false);

		/* TODO: replace resize w/ mediaquery listeners. Caveat: some components
		(vg. Carousel) require update on resize */
		// this._onBreakpointChange = this._onBreakpointChange.bind(this);
		// Object.keys(Globals.BREAKPOINTS).forEach(function(s) {
		// 	Globals.BREAKPOINTS[s].addListener(this._onBreakpointChange);
		// }, this);

		/* initialize controller/model listeners BEFORE views register their own */
		this.listenTo(controller, "route", this._onRoute);
		// this.listenTo(controller, "change:after", this._afterControllerChanged);
		this.listenTo(this.model, "change", this._onModelChange); /* FIXME */

		/* initialize views */
		this.navigationView = new NavigationView({
			el: "#navigation",
			model: this.model
		});
		this.contentView = new ContentView({
			el: "#content",
			model: this.model
		});

		/* Google Analytics */
		if (window.ga && window.GA_ID) {
			controller
				.once("route", function() {
					window.ga("create", window.GA_ID, "auto");
					// if localhost or dummy ID, disable analytics
					if (/(?:(localhost|\.local))$/.test(location.hostname)
						|| window.GA_ID == "UA-9123564-8") {
						window.ga("set", "sendHitTask", null);
					}
				})
				.on("route", function(name) {
					var page = Backbone.history.getFragment();
					// Add a slash if neccesary
					page.replace(/^(?!\/)/, "/");
					window.ga("set", "page", page);
					window.ga("send", "pageview");
				});
		}

		/* Startup listener, added last */
		this.listenToOnce(controller, "route", this._appStart);

		/* start router, which will request appropiate state */
		Backbone.history.start({
			pushState: false,
			hashChange: true,
		});
	},

	/* -------------------------------
	/* _appStart
	/* ------------------------------- */

	_appStart: function() {
		console.info("%s::_appStart", this.cid, arguments[0]);
		this._appStartChanged = true;
		this.requestRender(View.MODEL_INVALID | View.SIZE_INVALID);
	},

	/* --------------------------- *
	/* model changed
	/* --------------------------- */

	_onRoute: function(name, args) {
		var o = _.defaults({ routeName: name }, AppState.prototype.defaults);
		switch (name) {
			case "media-item":
				o.bundle = bundles.selected;
				o.withBundle = true;
				o.media = o.bundle.media.selected;
				o.withMedia = true;
				o.collapsed = true;
				break;
			case "bundle-item":
				o.bundle = bundles.selected;
				o.withBundle = true;
				o.collapsed = true;
				break;
			case "article-item":
				o.article = articles.selected;
				o.withArticle = true;
				o.collapsed = true;
				break;
			case "bundle-list":
			case "notfound":
			case "root":
			default:
				o.collapsed = false;
				break;
		}
		console.info("%s::_onRoute %o -> %o", this.cid, this.model.get("routeName"), name);
		// console.log("%s::_onRoute args: %o", this.cid, name, args);
		this.model.set(o);
	},

	/* --------------------------- *
	/* model changed
	/* --------------------------- */

	_onModelChange: function() {
		// console.log("%s::_onModelChange [START]", this.cid);
		console.group(this.cid + "::_onModelChange [render request]");
		this.requestRender(View.MODEL_INVALID)
			.once("view:render:after", function(view, flags) {
				console.info("%s::_onModelChange [render complete]", view.cid);
				console.groupEnd();
				// .whenRendered().then(function(view) {
				// this.requestAnimationFrame(function() {
				// 	console.log("%s::_onModelChange [next frame]", view.cid);
				// });
			});
	},

	/* -------------------------------
	/* resize
	/* ------------------------------- */

	_onResize: function() {
		// console.log("%s::_onResize [START]", this.cid);
		console.group(this.cid + "::_onResize [render request]");
		this.el.classList.add("skip-transitions");
		this.skipTransitions = true;

		// this.requestRender(View.SIZE_INVALID).renderNow();
		// this.requestAnimationFrame(function() {
		// 	this.el.classList.remove("skip-transitions");
		// }.bind(this));

		this.requestRender(View.SIZE_INVALID)
			.once("view:render:after", function(view, flags) {
				console.info("%s::_onResize [render complete]", view.cid);
				// .whenRendered().then(function(view) {
				this.requestAnimationFrame(function() {
					view.el.classList.remove("skip-transitions");
					this.skipTransitions = false;
					console.info("%s::_onResize [removed skip-tx]", view.cid);
					console.groupEnd();
				})
			});
	},

	// _onBreakpointChange: function(ev) {
	// 	console.log("%s::_onBreakpointChange", this.cid, ev.matches, ev.media, ev.target.className);
	// 	this.requestRender(View.SIZE_INVALID).renderNow();
	// },

	/* -------------------------------
	/* render
	/* ------------------------------- */

	renderFrame: function(tstamp, flags) {
		console.log("%s::renderFrame [%s]", this.cid, View.flagsToString(flags));
		if (flags & View.MODEL_INVALID) {
			this.renderModelChange(flags);
		}
		if (flags & View.SIZE_INVALID) {
			this.renderResize(flags);
			// this.requestChildrenRender(flags, true);
		}
		// request children render
		// set 'now' flag if size is invalid
		this.requestChildrenRender(flags, true);
		// this.requestChildrenRender(flags, flags & View.SIZE_INVALID);


		if (this._appStartChanged) {
			this._appStartChanged = false;
			this.requestAnimationFrame(this.renderAppStart);
		}
		if (flags & (View.MODEL_INVALID | View.SIZE_INVALID)) {
			this.requestAnimationFrame(function() {
				document.body.scrollTop = 0;
				window.scroll({ top: 0, behavior: "smooth" });
			});
		}
	},

	// _afterRender: function() {
	// 	document.body.scrollTop = 0;
	// },

	renderAppStart: function() {
		console.log("%s::renderAppStart", this.cid);
		this.el.classList.remove("app-initial");
		if (this.el.classList.contains("route-initial")) {
			this.el.classList.remove("route-initial");
			console.warn("'route-initial' was still present");
		}
	},

	renderResize: function(flags) {
		// document.body.scrollTop = 0;
		// window.scroll({ top: 0, behavior: "smooth" });

		_.each(Globals.BREAKPOINTS, function(o, s) {
			this.toggle(s, o.matches);
		}, document.documentElement.classList);

		// var bb = _.filter(_.keys(Globals.BREAKPOINTS), function(s) {
		// 	return this.contains(s);
		// }, document.body.classList).join();
		// console.log("%s::renderResize matches: %s", this.cid, bb);

		// this.requestChildrenRender(View.SIZE_INVALID, true);
		// this.requestChildrenRender(flags, true);
	},

	/* -------------------------------
	/* body classes etc
	/* ------------------------------- */

	// _controllerChanged: true,

	renderModelChange: function() {
		console.log("%s::renderModelChange", this.cid);

		var article = this.model.get("article");
		var bundle = this.model.get("bundle");
		var media = this.model.get("media");

		var docTitle = []
		docTitle.push(Globals.APP_NAME);
		if (bundle) {
			docTitle.push(stripTags(bundle.get("name")));
			if (media) {
				docTitle.push(stripTags(media.get("name")));
			}
		} else if (article) {
			docTitle.push(stripTags(article.get("name")));
		}
		document.title = _.unescape(docTitle.join(" / "));

		var cls = this.el.classList;
		var prevAttr = null;

		// Set article class
		if (this.model.hasChanged("article")) {
			prevAttr = this.model.previous("article");
			if (prevAttr) {
				cls.remove(prevAttr.get("domid"));
			}
			if (article) {
				cls.add(article.get("domid"));
			}
		}
		cls.toggle("with-article", !!article);
		cls.toggle("without-article", !article);

		// Set bundle class
		if (this.model.hasChanged("bundle")) {
			prevAttr = this.model.previous("bundle");
			if (prevAttr) {
				cls.remove(prevAttr.get("domid"));
			}
			if (bundle) {
				cls.add(bundle.get("domid"));
			}
		}
		cls.toggle("with-bundle", !!bundle);
		cls.toggle("without-bundle", !bundle);

		// Set media class
		if (this.model.hasChanged("media")) {
			prevAttr = this.model.previous("media");
			if (prevAttr) {
				cls.remove(prevAttr.get("domid"));
			}
			if (media) {
				cls.add(media.get("domid"));
			}
		}
		cls.toggle("with-media", !!media);
		cls.toggle("without-media", !media);

		// Set state classes
		if (this.model.hasChanged("routeName")) {
			prevAttr = this.model.previous("routeName");
			if (prevAttr) {
				cls.remove("route-" + prevAttr);
			}
			cls.add("route-" + this.model.get("routeName"));
		}

		// Set color-dark class
		// cls.toggle("color-dark", hasDarkBg);
		cls.toggle("color-dark",
			(media && media.colors.hasDarkBg) ||
			(bundle && bundle.colors.hasDarkBg));
	},
};

if (DEBUG) {
	/** @type {module:app/view/DebugToolbar} */
	var DebugToolbar = require("app/view/DebugToolbar");

	AppViewProto._onModelChange = (function(fn) {
		return function() {
			var retval;
			console.group(this.cid + "::_onModelChange");
			Object.keys(this.model.changedAttributes()).forEach(function(key) {
				var prev = this.model.previous(key),
					curr = this.model.get(key);
				console.info("%s::_onModelChange %s: %s -> %s", this.cid, key,
					prev && prev.toString(),
					curr && curr.toString());
			}, this);
			console.groupEnd();

			retval = fn.apply(this, arguments);
			return retval;
		};
	})(AppViewProto._onModelChange);

	AppViewProto.initialize = (function(fn) {
		return function() {
			// var ret = fn.apply(this, arguments);
			var view = new DebugToolbar({
				id: "debug-toolbar",
				model: this.model
			});
			document.body.appendChild(view.render().el);
			// this.listenTo(this.model, "change:layoutName", function() {
			// 	this.requestRender(View.SIZE_INVALID); //.renderNow();
			// });
			// return ret;
			return fn.apply(this, arguments);
		};
	})(AppViewProto.initialize);
}

/**
/* @constructor
/* @type {module:app/view/AppView}
/*/
module.exports = View.extend(AppViewProto, AppView);
}).call(this,true)

},{"app/control/Controller":33,"app/control/Globals":34,"app/model/AppState":35,"app/model/collection/ArticleCollection":38,"app/model/collection/BundleCollection":39,"app/view/ContentView":50,"app/view/DebugToolbar":51,"app/view/NavigationView":52,"app/view/base/TouchManager":57,"app/view/base/View":58,"backbone":"backbone","underscore":"underscore","utils/strings/stripTags":118}],50:[function(require,module,exports){
/**
 * @module app/view/NavigationView
 */

/** @type {module:underscore} */
var _ = require("underscore");

/** @type {module:app/control/Globals} */
var Globals = require("app/control/Globals");
/** @type {module:utils/TransformHelper} */
var TransformHelper = require("utils/TransformHelper");
/** @type {module:app/view/base/TouchManager} */
var TouchManager = require("app/view/base/TouchManager");

/** @type {module:app/control/Controller} */
var controller = require("app/control/Controller");
/** @type {module:app/model/collection/BundleCollection} */
var bundles = require("app/model/collection/BundleCollection");
/** @type {module:app/model/collection/ArticleCollection} */
var articles = require("app/model/collection/ArticleCollection");

// /** @type {module:app/model/collection/BundleItem} */
// var BundleItem = require("app/model/item/BundleItem");

/** @type {module:app/view/base/View} */
var View = require("app/view/base/View");
/** @type {module:app/view/component/ArticleView} */
var ArticleView = require("app/view/component/ArticleView");
/** @type {module:app/view/component/CollectionStack} */
var CollectionStack = require("app/view/component/CollectionStack");
/** @type {module:app/view/component/CollectionStack} */
var SelectableListView = require("app/view/component/SelectableListView");
/** @type {module:app/view/render/DotNavigationRenderer} */
var DotNavigationRenderer = require("app/view/render/DotNavigationRenderer");
/** @type {module:app/view/component/Carousel} */
var Carousel = require("app/view/component/Carousel");

/** @type {module:app/view/render/CarouselRenderer} */
var CarouselRenderer = require("app/view/render/CarouselRenderer");
/** @type {module:app/view/render/ImageRenderer} */
var ImageRenderer = require("app/view/render/ImageRenderer");
/** @type {module:app/view/render/VideoRenderer} */
var VideoRenderer = require("app/view/render/VideoRenderer");
/** @type {module:app/view/render/SequenceRenderer} */
var SequenceRenderer = require("app/view/render/SequenceRenderer");
// /** @type {module:app/view/component/ProgressMeter} */
// var ProgressMeter = require("app/view/component/ProgressMeter");

/** @type {Function} */
var carouselEmptyTemplate = require("./template/Carousel.EmptyRenderer.Bundle.hbs");
/** @type {Function} */
var mediaStackTemplate = require("./template/CollectionStack.Media.hbs");

// var transitionEnd = View.prefixedEvent("transitionend");
var transformProp = View.prefixedProperty("transform");
var transitionProp = View.prefixedProperty("transition");

var tx = Globals.transitions;


// var clickEvent = window.hasOwnProperty("onpointerup") ? "pointerup" : "mouseup",

/**
 * @constructor
 * @type {module:app/view/ContentView}
 */
var ContentView = View.extend({

	/** @override */
	cidPrefix: "contentView",

	/** @override */
	className: "container-x container-expanded",

	/** @override */
	events: {
		"transitionend .adding-child": "_onAddedTransitionEnd",
		"transitionend .removing-child": "_onRemovedTransitionEnd",
		// "transitionend": "_onTransitionEnd",
	},

	/** @override */
	initialize: function(options) {
		_.bindAll(this, "_onVPanStart", "_onVPanMove", "_onVPanFinal", "_onCollapsedEvent");

		this.transforms = new TransformHelper();
		this.touch = TouchManager.getInstance();

		this.listenTo(this.model, "change", this._onModelChange);

		// disconnect children before last change
		// this.listenTo(bundles, "deselect:one", this._onDeselectOneBundle);

		this.skipTransitions = true;
		this.itemViews = [];

		// this.progressWrapper = this.createProgressWrapper(),
		// this.el.appendChild(this.progressWrapper.el);
	},

	/* --------------------------- *
	/* Render
	/* --------------------------- */

	renderFrame: function(tstamp, flags) {
		// values
		var collapsed = this.model.get("collapsed");
		var collapsedChanged = (flags & View.MODEL_INVALID)
			&& this.model.hasChanged("collapsed");
		var childrenChanged = (flags & View.MODEL_INVALID)
			&& (this.model.hasChanged("bundle") || this.model.hasChanged("article"));

		// flags
		var sizeChanged = !!(flags & View.SIZE_INVALID);
		var transformsChanged = !!(flags & (View.MODEL_INVALID | View.SIZE_INVALID | View.LAYOUT_INVALID));
		transformsChanged = transformsChanged || this._transformsChanged || this.skipTransitions;

		// debug
		// - - - - - - - - - - - - - - - - -
		// if (flags & View.MODEL_INVALID) {
		// 	console.group(this.cid + "::renderFrame model changed:");
		// 	Object.keys(this.model.changed).forEach(function(key) {
		// 		console.log("\t%s: %s -> %s", key, this.model._previousAttributes[key], this.model.changed[key]);
		// 	}, this);
		// 	console.groupEnd();
		// }

		// model:children
		// - - - - - - - - - - - - - - - - -
		if (childrenChanged) {
			this.removeChildren();
			if (bundles.selected) {
				this.createChildren(bundles.selected);
			} else
			if (articles.selected) {
				this.createChildren(articles.selected);
			}
		}

		// model:collapsed
		// - - - - - - - - - - - - - - - - -
		if (collapsedChanged) {
			this.el.classList.toggle("container-collapsed", collapsed);
			this.el.classList.toggle("container-expanded", !collapsed);
		}

		// size
		// - - - - - - - - - - - - - - - - -
		if (sizeChanged) {
			this.transforms.clearAllCaptures();
		}

		// transforms
		// - - - - - - - - - - - - - - - - -
		if (transformsChanged) {
			this.el.classList.remove("container-changing");
			if (this.skipTransitions) {
				this.transforms.stopAllTransitions();
				this.el.classList.remove("container-changed");
				if (!childrenChanged) {
					// this.transforms.clearAllOffsets();
					if (collapsedChanged) {
						this._setChildrenEnabled(collapsed);
					}
				}
			} else {
				if (!childrenChanged) {
					if (collapsedChanged) {
						var afterTransitionsFn;
						this.el.classList.add("container-changed");
						// this.transforms.clearAllOffsets();
						if (collapsed) {
							// container-collapsed, enable last
							afterTransitionsFn = function() {
								this._setChildrenEnabled(true);
								this.el.classList.remove("container-changed");
							};
							this.transforms.runAllTransitions(tx.LAST);
						} else {
							// container-expanded, disable first
							afterTransitionsFn = function() {
								this.el.classList.remove("container-changed");
							};
							this._setChildrenEnabled(false);
							this.transforms.runAllTransitions(tx.FIRST);
						}
						afterTransitionsFn = afterTransitionsFn.bind(this);
						this.transforms.whenAllTransitionsEnd().then(afterTransitionsFn, afterTransitionsFn);
					} else {
						this.transforms.items.forEach(function(o) {
							if (o.hasOffset) {
								o.runTransition(tx.NOW);
								// o.clearOffset();
							}
						});
					}
				}
			}
			if (!childrenChanged) {
				this.transforms.clearAllOffsets();
			}
			this.transforms.validate();
		}
		if (sizeChanged) {
			this.itemViews.forEach(function(view) {
				view.skipTransitions = this.skipTransitions;
				// view.invalidateSize();
				// view.renderNow();
				view.requestRender(View.SIZE_INVALID).renderNow();
			}, this);
		}
		this.skipTransitions = this._transformsChanged = false;
	},

	_setChildrenEnabled: function(enabled) {
		// if (enabled) {
		// 	this.el.removeEventListener("click", this._onCollapsedClick, false);
		// } else {
		// 	this.el.addEventListener("click", this._onCollapsedClick, false);
		// }
		this.itemViews.forEach(function(view) {
			view.setEnabled(enabled);
		});
	},

	_onCollapsedEvent: function(ev) {
		console.log("%s:[%s -> _onCollapsedEvent] target: %s", this.cid, ev.type, ev.target);
		if (!ev.defaultPrevented && this.model.get("withBundle") && !this.model.get("collapsed") && !this.enabled) {
			// this.setImmediate(function() {
			// if (ev.type == "click") ev.stopPropagation();
			ev.preventDefault();
			this.setImmediate(function() {
				// if (ev.type == "click") ev.stopPropagation();
				this.model.set("collapsed", true);
			});
			// });
		}
	},
	/* --------------------------- *
	/* model changed
	/* --------------------------- */

	_onModelChange: function() {
		if (this.model.hasChanged("withBundle")) {
			if (this.model.get("withBundle")) {
				this.touch.on("vpanstart", this._onVPanStart);
			} else {
				this.touch.off("vpanstart", this._onVPanStart);
			}
		}
		if (this.model.hasChanged("collapsed") || this.model.hasChanged("withBundle")) {
			if (this.model.get("withBundle") && !this.model.get("collapsed")) {
				this.touch.on("hpanleft hpanright", this._onCollapsedEvent);
				this.el.addEventListener("click", this._onCollapsedEvent, false);
			} else {
				this.touch.off("hpanleft hpanright", this._onCollapsedEvent);
				this.el.removeEventListener("click", this._onCollapsedEvent, false);
			}
		}
		this.requestRender(View.MODEL_INVALID);
	},

	/* -------------------------------
	/* Vertical touch/move (_onVPan*)
	/* ------------------------------- */

	_collapsedOffsetY: Globals.COLLAPSE_OFFSET,

	_onVPanStart: function(ev) {
		this.touch.on("vpanmove", this._onVPanMove);
		this.touch.on("vpanend vpancancel", this._onVPanFinal);

		this.transforms.stopAllTransitions();
		// this.transforms.clearAllOffsets();
		// this.transforms.validate();
		this.transforms.clearAllCaptures();

		this.el.classList.add("container-changing");
		this._onVPanMove(ev);
	},

	_onVPanMove: function(ev) {
		var collapsed = this.model.get("collapsed");
		var delta = ev.deltaY; //ev.thresholdDeltaY;
		var maxDelta = this._collapsedOffsetY; // + Math.abs(ev.thresholdOffsetY);

		// check if direction is aligned with collapsed/expand
		var isValidDir = collapsed ? (delta > 0) : (delta < 0);
		var moveFactor = collapsed ? Globals.VPAN_DRAG : 1 - Globals.VPAN_DRAG;

		delta = Math.abs(delta); // remove sign
		delta *= moveFactor;
		maxDelta *= moveFactor;

		if (isValidDir) {
			if (delta > maxDelta) { // overshooting
				delta = ((delta - maxDelta) * Globals.VPAN_OUT_DRAG) + maxDelta;
			} else { // no overshooting
				// delta = delta;
			}
		} else {
			delta = (-delta) * Globals.VPAN_OUT_DRAG; // delta is opposite
		}
		delta *= collapsed ? 1 : -1; // reapply sign

		this.transforms.offsetAll(0, delta);
		this.transforms.validate();
	},

	_onVPanFinal: function(ev) {
		this.touch.off("vpanmove", this._onVPanMove);
		this.touch.off("vpanend vpancancel", this._onVPanFinal);

		// FIXME: model.collapsed may have already changed, _onVPanMove would run with wrong values:
		// model.collapsed is changed in a setImmediate callback from NavigationView.

		this._onVPanMove(ev);
		this.setImmediate(function() {
			this._transformsChanged = true;
			this.requestRender();
		});
	},

	// willCollapsedChange: function(ev) {
	// 	var collapsed = this.model.get("collapsed");
	// 	return ev.type == "vpanend"? collapsed?
	// 		ev.thresholdDeltaY > Globals.COLLAPSE_THRESHOLD :
	// 		ev.thresholdDeltaY < -Globals.COLLAPSE_THRESHOLD :
	// 		false;
	// },

	/* -------------------------------
	/* create/remove children on bundle selection
	/* ------------------------------- */

	/** Create children on bundle select */
	createChildren: function(model) {
		var view;
		if (model.__proto__.constructor === bundles.model) {
			// will be attached to dom in this order
			view = this.createMediaCaptionStack(model);
			this.itemViews.push(view);
			this.transforms.add(view.el);
			view = this.createMediaCarousel(model);
			this.itemViews.push(view);
			this.transforms.add(view.el);
			view = this.createMediaDotNavigation(model);
			this.itemViews.push(view);
		} else
		if (model.__proto__.constructor === articles.model) {
			view = this.createArticleView(model);
			this.itemViews.push(view);
		}

		this.itemViews.forEach(function(view) {
			if (!this.skipTransitions) {
				view.el.classList.add("adding-child");
				view.el.style.opacity = 0;
			}
			this.el.appendChild(view.el);
			view.render();
		}, this);

		if (!this.skipTransitions) {
			this.requestAnimationFrame(function() {
				console.log("%s::createChildren::[callback:requestAnimationFrame]", this.cid);
				this.itemViews.forEach(function(view) {
					if (!this.skipTransitions) {
						view.el.style[transitionProp] = "opacity " + tx.LAST.cssText;
					}
					view.el.style.removeProperty("opacity");
				}, this);
			});
		}
	},

	removeChildren: function() {
		this.itemViews.forEach(function(view, i, arr) {
			this.transforms.remove(view.el);
			if (this.skipTransitions) {
				view.remove();
			} else {
				var s = window.getComputedStyle(view.el);
				if (s.opacity == "0" || s.visibility == "hidden") {
					console.log("%s::removeChildren [view:%s] removed immediately (invisible)", this.cid, view.cid);
					view.remove();
				} else {
					view.el.classList.add("removing-child");
					if (s[transformProp]) view.el.style[transformProp] = s[transformProp];
					view.el.style[transitionProp] = "opacity " + tx.FIRST.cssText;
					view.el.style.opacity = 0;
				}
			}
			arr[i] = null;
		}, this);
		this.itemViews.length = 0;
	},

	_onAddedTransitionEnd: function(ev) {
		if (ev.target.cid && this.childViews.hasOwnProperty(ev.target.cid)) {
			console.log("%s::_onAddedTransitionEnd [view:%s] [prop:%s] [ev:%s]", this.cid, ev.target.cid, ev.propertyName, ev.type);
			var view = this.childViews[ev.target.cid];
			view.el.classList.remove("adding-child");
			view.el.style.removeProperty(transitionProp);
		}
	},

	_onRemovedTransitionEnd: function(ev) {
		if (ev.target.cid && this.childViews.hasOwnProperty(ev.target.cid)) {
			console.log("%s::_onRemovedTransitionEnd [view:%s] [prop:%s] [ev:%s]", this.cid, ev.target.cid, ev.propertyName, ev.type);
			var view = this.childViews[ev.target.cid];
			view.el.classList.remove("removing-child");
			view.remove();
		}
	},

	// purgeChildren: function() {
	// 	var i, el, els = this.el.querySelectorAll(".removing-child");
	// 	for (i = 0; i < els.length; i++) {
	// 		el = els.item(i);
	// 		if (el.parentElement === this.el) {
	// 			try {
	// 				console.error("%s::purgeChildren", this.cid, el.getAttribute("data-cid"));
	// 				View.findByElement(el).remove();
	// 			} catch (err) {
	// 				console.error("s::purgeChildren", this.cid, "orphaned element", err);
	// 				this.el.removeChild(el);
	// 			}
	// 		}
	// 	}
	// },

	/* -------------------------------
	/* Components
	/* ------------------------------- */


	/**
	 * media-carousel
	 */
	createMediaCarousel: function(bundle) {
		// Create carousel
		var EmptyRenderer = CarouselRenderer.extend({
			className: "carousel-item empty-item",
			model: bundle,
			template: carouselEmptyTemplate,
		});
		var rendererFunction = function(item, index, arr) {
			if (index === -1) {
				return EmptyRenderer;
			}
			switch (item.attr("@renderer")) {
				case "video":
					return VideoRenderer;
				case "sequence":
					return SequenceRenderer;
				case "image":
					return ImageRenderer;
				default:
					return ImageRenderer;
			}
		};
		var view = new Carousel({
			className: "media-carousel " + bundle.get("domid"),
			collection: bundle.get("media"),
			rendererFunction: rendererFunction,
			requireSelection: false,
			direction: Carousel.DIRECTION_HORIZONTAL,
			touch: this.touch,
		});
		controller.listenTo(view, {
			"view:select:one": controller.selectMedia,
			"view:select:none": controller.deselectMedia,
			// "view:removed": controller.stopListening
		});
		view.listenTo(bundle, "deselected", function() {
			this.stopListening(this.collection);
			controller.stopListening(this);
		});
		return view;
	},

	/**
	 * media-caption-stack
	 */
	createMediaCaptionStack: function(bundle) {
		var view = new CollectionStack({
			className: "media-caption-stack",
			collection: bundle.get("media"),
			template: mediaStackTemplate
		});
		view.listenTo(bundle, "deselected", function() {
			this.stopListening(this.collection);
		});
		return view;
	},

	/**
	 * media-dotnav
	 */
	createMediaDotNavigation: function(bundle) {
		var view = new SelectableListView({
			className: "media-dotnav dots-fontface color-fg05",
			collection: bundle.get("media"),
			renderer: DotNavigationRenderer
		});
		controller.listenTo(view, {
			"view:select:one": controller.selectMedia,
			"view:select:none": controller.deselectMedia,
			// "view:removed": controller.stopListening
		});
		view.listenTo(bundle, "deselected", function() {
			this.stopListening(this.collection);
			controller.stopListening(this);
		});
		return view;
	},

	/**
	 * @param el {module:app/model/item/ArticleView}
	 * @return {module:app/view/base/View}
	 */
	createArticleView: function(article) {
		var view = new ArticleView({
			model: article,
		});
		return view;
	},

	// createProgressWrapper: function() {
	// 	// var view = new ProgressMeter({
	// 	// 	id: "media-progress-wrapper",
	// 	// 	// className: "color-bg color-fg05",
	// 	// 	useOpaque: false,
	// 	// 	labelFn: function() { return "0%"; }
	// 	// });
	// 	// this.el.appendChild(this.progressWrapper.el);
	// 	// return view;
	// 	return null;
	// },
});

module.exports = ContentView;
},{"./template/Carousel.EmptyRenderer.Bundle.hbs":96,"./template/CollectionStack.Media.hbs":97,"app/control/Controller":33,"app/control/Globals":34,"app/model/collection/ArticleCollection":38,"app/model/collection/BundleCollection":39,"app/view/base/TouchManager":57,"app/view/base/View":58,"app/view/component/ArticleView":62,"app/view/component/Carousel":63,"app/view/component/CollectionStack":65,"app/view/component/SelectableListView":70,"app/view/render/CarouselRenderer":81,"app/view/render/DotNavigationRenderer":86,"app/view/render/ImageRenderer":88,"app/view/render/SequenceRenderer":93,"app/view/render/VideoRenderer":95,"underscore":"underscore","utils/TransformHelper":103}],51:[function(require,module,exports){
/**
 * @module app/view/DebugToolbar
 */

/** @type {module:underscore} */
var _ = require("underscore");
// /** @type {module:backbone} */
// var Backbone = require("backbone");
/** @type {module:cookies-js} */
var Cookies = require("cookies-js");
// /** @type {module:modernizr} */
// var Modernizr = require("Modernizr");

/** @type {module:app/control/Globals} */
var Globals = require("app/control/Globals");
// /** @type {module:app/control/Controller} */
// var controller = require("app/control/Controller");

/** @type {module:app/view/base/View} */
var View = require("app/view/base/View");

/** @type {Function} */
var viewTemplate = require("./template/DebugToolbar.hbs");

/** @type {Function} */
var gridTemplate = require("./template/DebugToolbar.SVGGrid.hbs");

/** @type {Function} */
var sizeTemplate = _.template("<%= w %> \u00D7 <%= h %>");

// var appStateSymbols = { withBundle: "b", withMedia: "m", collapsed: "c"};
// var appStateKeys = Object.keys(appStateSymbols);

var DebugToolbar = View.extend({

	/** @override */
	cidPrefix: "debugToolbar",
	/** @override */
	tagName: "div",
	/** @override */
	className: "toolbar",
	/** @override */
	template: viewTemplate,

	/** @override */
	properties: {
		grid: {
			get: function() {
				return this._grid || (this._grid = this.createGridElement());
			}
		}
	},

	initialize: function(options) {
		Cookies.defaults = {
			expires: new Date(0x7fffffff * 1e3),
			domain: String(window.location)
				.match(/^https?\:\/\/([^\/:?#]+)(?:[\/:?#]|$)/i)[1]
		};

		this.el.innerHTML = this.template({
			tests: Modernizr,
			navigator: window.navigator
		});

		/* toggle's target: container
		/* - - - - - - - - - - - - - - - - */
		var container = document.body; //.querySelector("#container");

		/* create/attach svg grid element
		/* - - - - - - - - - - - - - - - - */
		container.insertBefore(this.createGridElement(), container.firstElementChild);

		/* info elements
		/* - - - - - - - - - - - - - - - - */
		this.backendEl = this.el.querySelector("#edit-backend a");
		this.mediaInfoEl = this.el.querySelector("#media-info span");
		this.appStateEl = this.el.querySelector("#app-state");

		/* toggle visibility
		/* - - - - - - - - - - - - - - - - */
		this.initializeClassToggle("show-links", this.el.querySelector(".debug-links #links-toggle"), this.el,
			function(key, value) {
				this.el.classList.toggle("not-" + key, !value);
				// console.log("%s:initializeClassToggle:[callback] %o", this.cid, arguments);
			}
		);
		this.initializeClassToggle("show-tests", this.el.querySelector("#toggle-tests a"), this.el);
		this.initializeClassToggle("hide-passed", this.el.querySelector("#toggle-passed"), this.el);

		/* toggle container classes
		/* - - - - - - - - - - - - - - - - */
		this.initializeClassToggle("debug-grid-bg", this.el.querySelector("#toggle-grid-bg a"), document.body);
		this.initializeClassToggle("debug-blocks", this.el.querySelector("#toggle-blocks a"), container);
		this.initializeClassToggle("debug-mdown", this.el.querySelector("#toggle-mdown a"), container);
		this.initializeClassToggle("debug-logs", this.el.querySelector("#toggle-logs a"), container);
		this.initializeClassToggle("debug-tx", this.el.querySelector("#toggle-tx a"), container,
			function(key, value) {
				this.el.classList.toggle("show-tx", value);
				this.el.classList.toggle("not-show-tx", !value);
			}
		);

		this.initializeViewportInfo();

		// this.initializeLayoutSelect();

		this.listenTo(this.model, "change", this._onModelChange);
		this._onModelChange();
	},

	initializeViewportInfo: function() {
		var viewportInfoEl = this.el.querySelector("#viewport-info span");
		var callback = function() {
			viewportInfoEl.textContent = sizeTemplate({ w: window.innerWidth, h: window.innerHeight });
		};
		callback.call();
		window.addEventListener("resize", _.debounce(callback, 100, false, false));
	},

	initializeToggle: function(key, toggleEl, callback) {
		var ctx = this;
		var toggleValue = Cookies.get(key) === "true";
		callback.call(ctx, key, toggleValue);

		toggleEl.addEventListener("click", function(ev) {
			if (ev.defaultPrevented) return;
			else ev.preventDefault();
			toggleValue = !toggleValue;
			Cookies.set(key, toggleValue ? "true" : "");
			callback.call(ctx, key, toggleValue);
		}, false);
	},

	initializeClassToggle: function(key, toggleEl, targetEl, callback) {
		var hasCallback = _.isFunction(callback);

		this.initializeToggle(key, toggleEl, function(key, toggleValue) {
			targetEl.classList.toggle(key, toggleValue);
			toggleEl.classList.toggle("toggle-enabled", toggleValue);
			toggleEl.classList.toggle("color-reverse", toggleValue);
			hasCallback && callback.apply(this, arguments);
		});
	},

	_onModelChange: function() {
		console.log("%s::_onModelChange changedAttributes: %o", this.cid, this.model.changedAttributes());
		var i, ii, prop, el, els = this.appStateEl.children;
		for (i = 0, ii = els.length; i < ii; i++) {
			el = els[i];
			prop = el.getAttribute("data-prop");
			el.classList.toggle("has-value", this.model.get(prop));
			el.classList.toggle("has-changed", this.model.hasChanged(prop));
			el.classList.toggle("color-reverse", this.model.hasChanged(prop));
		}

		// NOTE: Always but rewrite CMS href.
		// Only collapsed may have changed, but not worth all the logic
		var attrVal = Globals.APP_ROOT + "symphony/";
		switch (this.model.get("routeName")) {
			case "article-item":
				attrVal += "publish/articles/edit/" + this.model.get("article").id;
				break;
			case "bundle-item":
				attrVal += "publish/bundles/edit/" + this.model.get("bundle").id;
				break;
			case "media-item":
				attrVal += "publish/media/edit/" + this.model.get("media").id;
				break;
			case "root":
				attrVal += "publish/bundles";
				break;
		}
		this.backendEl.setAttribute("href", attrVal);

		if (this.model.hasChanged("media")) {
			if (this.model.has("media")) {
				this.mediaInfoEl.textContent = sizeTemplate(this.model.get("media").get("source").toJSON());
				this.mediaInfoEl.style.display = "";
			} else {
				this.mediaInfoEl.textContent = "";
				this.mediaInfoEl.style.display = "none";
			}
		}
	},

	createGridElement: function() {
		var el = document.createElement("div");
		el.id = "grid-wrapper";
		el.innerHTML = gridTemplate();
		return el;
	},
});

module.exports = DebugToolbar;
},{"./template/DebugToolbar.SVGGrid.hbs":98,"./template/DebugToolbar.hbs":99,"app/control/Globals":34,"app/view/base/View":58,"cookies-js":"cookies-js","underscore":"underscore"}],52:[function(require,module,exports){
/* global MutationObserver */
/**
/* @module app/view/NavigationView
/*/

/** @type {module:underscore} */
var _ = require("underscore");
// /** @type {module:backbone} */
// var Backbone = require("backbone");
/** @type {module:hammerjs} */
var Hammer = require("hammerjs");

/** @type {module:app/control/Globals} */
var Globals = require("app/control/Globals");
/** @type {module:utils/TransformHelper} */
var TransformHelper = require("utils/TransformHelper");
/** @type {module:app/view/base/TouchManager} */
var TouchManager = require("app/view/base/TouchManager");

/** @type {module:app/control/Controller} */
var controller = require("app/control/Controller");
/** @type {module:app/model/collection/TypeCollection} */
var types = require("app/model/collection/TypeCollection");
/** @type {module:app/model/collection/KeywordCollection} */
var keywords = require("app/model/collection/KeywordCollection");
/** @type {module:app/model/collection/BundleCollection} */
var bundles = require("app/model/collection/BundleCollection");
/** @type {module:app/model/collection/ArticleCollection} */
var articles = require("app/model/collection/ArticleCollection");

/** @type {module:app/view/base/View} */
var View = require("app/view/base/View");
/** @type {module:app/view/component/FilterableListView} */
var FilterableListView = require("app/view/component/FilterableListView");
/** @type {module:app/view/component/GroupingListView} */
var GroupingListView = require("app/view/component/GroupingListView");
// /** @type {module:app/view/component/CollectionPager} */
// var CollectionPager = require("app/view/component/CollectionPager");
/** @type {module:app/view/component/GraphView} */
var GraphView = require("app/view/component/GraphView");
/** @type {module:app/view/component/ArticleButton} */
var ArticleButton = require("app/view/component/ArticleButton");

// /** @type {module:utils/prefixedProperty} */
// var prefixedProperty = require("utils/prefixedProperty");

var tx = Globals.transitions;

/**
/* @constructor
/* @type {module:app/view/NavigationView}
/*/
var NavigationView = View.extend({

	/** @override */
	cidPrefix: "navigationView",

	/** @override */
	className: "container-expanded",

	/** @override */
	initialize: function(options) {
		_.bindAll(this, "_onVPanStart", "_onVPanMove", "_onVPanFinal");
		_.bindAll(this, "_onHPanStart", "_onHPanMove", "_onHPanFinal");
		_.bindAll(this, "_whenTransitionsEnd", "_whenTransitionsAbort");
		_.bindAll(this, "_onNavigationClick");

		// this._metrics = {
		// 	minHeight: 0
		// };
		this.itemViews = [];
		this.transforms = new TransformHelper();
		this.touch = TouchManager.getInstance();

		this.listenTo(this.model, "change", this._onModelChange);

		this.keywordList = this.createKeywordList();
		/* NOTE: .list-group .label moves horizontally (cf. sass/layouts/*.scss) */
		this.hGroupings = this.keywordList.el.querySelectorAll(".list-group .label");
		this.transforms.add(this.hGroupings, this.keywordList.el, this.keywordList.wrapper);
		this.itemViews.push(this.keywordList);

		this.bundleList = this.createBundleList();
		this.transforms.add(this.bundleList.el, this.bundleList.wrapper);
		this.itemViews.push(this.bundleList);

		this.sitename = this.createSitenameButton();
		this.transforms.add(this.sitename.wrapper, this.sitename.el);
		// this.transforms.add(this.sitename.el.firstElementChild, this.sitename.el);

		this.about = this.createArticleButton(articles.findWhere({ handle: "about" }));
		this.transforms.add(this.about.wrapper, this.about.el);

		this.graph = this.createGraphView(this.bundleList, this.keywordList);
		// this.transforms.add(this.graph.el);
		// this.itemViews.push(this.graph);
		// this.listenTo(this.graph, {
		// 	"canvas:update": this._onGraphUpdate,
		// 	"canvas:redraw": this._onGraphRedraw,
		// });

		this.listenTo(this.graph, "view:render:before", function(view, flags) {
			var vmax;
			if (flags & (View.SIZE_INVALID | View.MODEL_INVALID)) {
				// if ((this.bundleList.renderFlags | View.SIZE_INVALID) ||
				// 	(this.keywordList.renderFlags | View.SIZE_INVALID)) {
				// 	view.el.style.height = "";
				// } else {
				vmax = Math.max(
					this.bundleList._metrics.height,
					this.keywordList._metrics.height
				);
				if (vmax) {
					view.el.style.height = vmax + "px";
				}
				// }
				console.log("%s:%s[view:render:before] [%s] h: %s, %s maxh: %o",
					this.cid, view.cid, View.flagsToString(flags),
					this.bundleList._metrics.height,
					this.keywordList._metrics.height,
					vmax || 'invalid');
			}
		});
		// this.listenTo(this.bundleList, "view:render:after", function(view, flags) {
		// 	console.info("%s:[view:render:after %s]", this.cid, view.cid, View.flagsToString(flags & View.SIZE_INVALID));
		// 		if (flags & View.SIZE_INVALID) {
		// 			// console.info("%s:[%s view:render:after] bundleList height", this.cid, view.cid, this.bundleList.el.style.height);
		// 			// this.graph.el.style.height = this.bundleList.el.style.height;
		// 			this.graph.el.style.opacity = this.bundleList.collapsed? 0 : 1;
		// 			this.graph.requestRender(View.SIZE_INVALID).renderNow();
		// 	// 	}
		// });
		// this.listenTo(this.bundleList, "view:render:after", this._onListResize);
		// this.listenTo(this.keywordList, "view:render:after", this._onListResize);
	},

	/* --------------------------- *
	/* Render
	/* --------------------------- */

	renderFrame: function(tstamp, flags) {
		if (flags & View.MODEL_INVALID) {
			if (this.model.hasChanged("collapsed")) {
				this.el.classList.toggle("container-collapsed", this.model.get("collapsed"));
				this.el.classList.toggle("container-expanded", !this.model.get("collapsed"));
			}
			if (this.model.hasChanged("collapsed")
				|| this.model.hasChanged("withBundle")) {
				this.el.classList.add("container-changing");
			}
			// if (this.bundleList.invalidated) {
			// 	this.bundleList.invalidate(View.SIZE_INVALID);
			// }
			// if (this.model.hasChanged("bundle")) {
			if (this.model.hasChanged("routeName")) {
				this.bundleList.requestRender(View.SIZE_INVALID | View.LAYOUT_INVALID);
				this.keywordList.requestRender(View.SIZE_INVALID | View.LAYOUT_INVALID);
			}
		}

		// transforms
		// - - - - - - - - - - - - - - - - -
		if (this.skipTransitions ||
			(flags & (View.MODEL_INVALID | View.SIZE_INVALID | View.LAYOUT_INVALID))) {
			// if (transformsChanged) {
			if (this.skipTransitions) {
				this.transforms.stopAllTransitions();
				this.transforms.validate();
				this.transforms.clearAllOffsets();
			} else {
				this.renderTransitions(flags);
			}
			this.transforms.validate();
			// console.log("%s::renderFrame %o", this.cid,
			// 	this.transforms.items.map(function(o) {
			// 		return [o.hasTransition, o.el.localName, o.el.id || o.el.className].join(" : ");
			// 	})
			// );
		}

		if (flags & View.MODEL_INVALID) {
			// if (this.model.hasChanged("collapsed")) {
			//if ((this.model.hasChanged("collapsed") && !this.model.get("collapsed")) || (this.model.hasChanged("withBundle") && !this.model.get("withBundle"))) {
			if (this.model.hasChanged("collapsed")
				|| this.model.hasChanged("withBundle")
				|| this.model.hasChanged("withArticle")) {
				this.transforms.promise().then(this._whenTransitionsEnd, this._whenTransitionsAbort);
			}
		}

		// children loop
		// - - - - - - - - - - - - - - - - -
		this.itemViews.forEach(function(view) {
			view.skipTransitions = view.skipTransitions || this.skipTransitions;
			if (flags & View.SIZE_INVALID) {
				view.requestRender(View.SIZE_INVALID);
			}
			if (!view.skipTransitions) {
				view.renderNow();
			}
		}, this);

		// if ((flags & View.SIZE_INVALID) || (this.model.hasChanged("collapsed") && (flags | View.MODEL_INVALID))) {
		// 	// if (this.model.get("collapsed")) {
		// 	// 	this.el.style.minHeight = "";
		// 	// } else {
		Promise.all([
			this.bundleList.whenRendered(),
			this.keywordList.whenRendered()
		]).then((function(arr) {
			var vmax = arr.reduce(function(a, o) {
				return Math.max(a, o._metrics.height);
			}, 0);
			console.log("%s:[whenRendered flags: %s] height: %o",
				this.cid, View.flagsToString(flags), vmax);
			// if (vmax !== this._metrics.minHeight) {
			// 	this._metrics.minHeight = vmax;
			// this.el.style.minHeight = vmax + "px";
			// }
			this.graph.el.style.height = vmax + "px";
			this.el.style.minHeight = vmax + "px";
			// document.body.scrollTop = 0;
			// window.scrollTo(0, 1)
			// this.requestAnimationFrame(function() {
			// 	window.scrollTo(0, 0);
			// });
		}).bind(this));
		// 	// }
		// }

		// graph
		// - - - - - - - - - - - - - - - - -
		/* collapsed has not changed, no bundle selected */
		if ((flags & (View.SIZE_INVALID | ~View.MODEL_INVALID))
			&& !this.model.hasChanged("collapsed")
			&& !this.model.get("withBundle")) {
			this.graph.requestRender(View.SIZE_INVALID | View.LAYOUT_INVALID);
			if (!this.skipTransitions) {
				this.graph.renderNow();
			}
		}
		/* NavigationView has resized while uncollapsed,
		   but model is unchanged */
		else if ((flags & View.SIZE_INVALID) && !this.model.get("collapsed")) {
			// console.info("%s::renderFrame", this.cid, "NavigationView has resized");
			this.graph.requestRender(View.SIZE_INVALID | View.LAYOUT_INVALID);
		}
		this.skipTransitions = false;
	},

	_whenTransitionsEnd: function(result) {
		console.info("%s::_whenTransitionsEnd", this.cid);
		this.el.classList.remove("container-changing");
		if (Globals.BREAKPOINTS["desktop-small"].matches
			|| !this.model.get("collapsed")) {
			this.graph.requestRender(View.SIZE_INVALID | View.LAYOUT_INVALID).renderNow();
		}
	},

	_whenTransitionsAbort: function(reason) {
		console.warn("%s::_whenTransitionsAbort %o", this.cid, reason);
		this.el.classList.remove("container-changing");
		if (Globals.BREAKPOINTS["desktop-small"].matches
			|| !this.model.get("collapsed")) {
			this.graph.requestRender(View.SIZE_INVALID | View.LAYOUT_INVALID).renderNow();
		}
	},

	/* -------------------------------
	/* renderTransitions
	/* ------------------------------- */

	renderTransitions: function(flags) {
		var fromRoute = this.model.previous("routeName");
		var toRoute = this.model.get("routeName");

		var modelChanged = (flags & View.MODEL_INVALID);
		/* bundle */
		var withBundle = this.model.get("withBundle");
		var withBundleChanged = modelChanged && this.model.hasChanged("withBundle");
		var bundleChanged = modelChanged && this.model.hasChanged("bundle");
		/* media */
		var withMedia = this.model.get("withMedia");
		var withMediaChanged = modelChanged && this.model.hasChanged("withMedia");
		//var mediaChanged = modelChanged && this.model.hasChanged("media");
		/* collapsed */
		var collapsed = this.model.get("collapsed");
		var collapsedChanged = modelChanged && this.model.hasChanged("collapsed");
		/* article */
		// var withArticle = this.model.get("withArticle");
		var withArticleChanged = modelChanged && this.model.hasChanged("withArticle");

		var tf;
		/* this.bundleList.el */
		tf = this.transforms.get(this.bundleList.el);
		if (tf.hasOffset) {
			tf.runTransition(collapsedChanged ? tx.BETWEEN : tx.NOW);
		}
		/* this.keywordList.el */
		tf = this.transforms.get(this.keywordList.el);
		if (tf.hasOffset) {
			tf.runTransition(collapsedChanged ? tx.BETWEEN : tx.NOW);
		}
		/* this.graph.el */
		tf = this.transforms.get(this.graph.el);
		if (tf && tf.hasOffset) {
			tf.runTransition(collapsedChanged ? tx.BETWEEN : tx.NOW);
			tf.clearOffset();
		}

		/*
		 * NOTE:
		 * Vertical:
		 *		site-name-wrapper,
		 *		article-list-wrapper
		 * Horizontal:
		 *		site-name,
		 *		article-buttons,
		 *		keywordList.wrapper,
		 *		bundleList.wrapper,
		 *		hGroupings
		 */
		if (Globals.BREAKPOINTS["desktop-small"].matches) {
			/* HORIZONTAL */
			tf = this.transforms.get(this.keywordList.wrapper);
			if (collapsedChanged && !withArticleChanged) {
				// if (collapsedChanged) {
				if (withBundleChanged) {
					if (withMediaChanged)
						tf.runTransition(withBundle ? tx.LAST : tx.FIRST);
				} else {
					if (withMedia)
						tf.runTransition(collapsed ? tx.LAST : tx.FIRST);
				}
			} else {
				if (!withBundleChanged && withMediaChanged)
					tf.runTransition(bundleChanged ? tx.BETWEEN : tx.NOW);
			}
			if (collapsedChanged ^ withArticleChanged) {
				this.transforms.runTransition(collapsed ? tx.LAST : tx.FIRST,
					this.sitename.el, this.about.el, this.bundleList.wrapper, this.hGroupings);
			}
			/* VERTICAL */
			if (fromRoute == 'root' || toRoute == 'root') {
				this.transforms.runTransition(tx.BETWEEN,
					this.sitename.wrapper, this.about.wrapper);
			}
			/* this.hGroupings */
			// if (collapsedChanged ^ withArticleChanged) {
			// 	// if (collapsedChanged && !withArticleChanged) {
			// 	this.transforms.runTransition(collapsed ? tx.LAST : tx.FIRST, this.hGroupings);
			// }
			// if (collapsedChanged) {
			// 	if (!withArticleChanged) {
			// 		// if (fromRoute == 'root' || toRoute == 'root') {
			// 		this.transforms.runTransition(collapsed ? tx.LAST : tx.FIRST, this.bundleList.wrapper);
			// 	}
			// } else {
			// 	if (withArticleChanged && withBundleChanged) {
			// 		this.transforms.runTransition(withArticle ? tx.BETWEEN : tx.LAST, this.bundleList.wrapper);
			// 	}
			// }
		} else if (Globals.BREAKPOINTS["fullwidth"].matches) {
			// if (collapsedChanged ) {
			if (collapsedChanged ^ withArticleChanged) {
				this.transforms.runTransition(tx.BETWEEN,
					this.sitename.el, this.about.el);
			}
		} else {
			if (withBundleChanged) {
				this.transforms.runTransition(tx.BETWEEN,
					this.sitename.el, this.about.el);
			}
		}
		this.transforms.clearOffset(this.bundleList.el, this.keywordList.el,
			this.keywordList.wrapper);
	},

	/* --------------------------- *
	/* own model changed
	/* --------------------------- */

	_onModelChange: function() {
		this.requestRender(View.MODEL_INVALID);
		// keywords.deselect();
		if (this.model.hasChanged("collapsed")) {
			if (this.model.get("collapsed")) {
				// clear keyword selection
				keywords.deselect();
				// this.touch.on("tap", this._onNavigationClick);
			} else {
				// this.touch.off("tap", this._onNavigationClick);
			}
			this.keywordList.collapsed = this.model.get("collapsed");
			this.bundleList.collapsed = this.model.get("collapsed");
		}
		if (this.model.hasChanged("bundle")) {
			this.bundleList.selectedItem = this.model.get("bundle");
			this.keywordList.refresh();
			// keywords.deselect();
			// this.graph && this.graph.requestRender(View.SIZE_INVALID);
		}
		if (this.model.hasChanged("withBundle")) {
			// this.keywordList.refresh()
			if (this.model.get("withBundle")) {
				this.touch.on("vpanstart", this._onVPanStart);
				this.touch.on("hpanstart", this._onHPanStart);
				// this.touch.on("tap", this._onTap);
			} else {
				this.touch.off("vpanstart", this._onVPanStart);
				this.touch.off("hpanstart", this._onHPanStart);
				keywords.deselect();
				// this.touch.off("tap", this._onTap);
			}
			// this.graph.valueTo()
		}
	},

	/* --------------------------- *
	/* keyword collection changed
	/* --------------------------- */

	_onKeywordSelect: function(keyword) {
		// use collection listener to avoid redundant refresh calls
		this.bundleList.refresh();
		if (!this.model.get("collapsed") && this.graph) {
			this.listenToOnce(this.bundleList, "view:render:after", function(view, flags) {
				console.log("%s::_onKeywordSelect -> %s:[view:render:after] flags:%s", this.cid, view.cid, View.flagsToString(flags));
				this.graph.valueTo(0, 0, "amount");
				// this.graph.renderNow();
				this.graph.valueTo(1, Globals.TRANSITION_DURATION, "amount");
			});
		}
	},

	/* --------------------------- *
	/* UI Events: bundleList keywordList buttons
	/* --------------------------- */

	_onNavigationClick: function(ev) {
		this._changeCollapsed(false);
	},

	_onArticleClick: function(item) {
		switch (this.model.get("routeName")) {
			case "article-item":
				controller.deselectArticle();
				break;
			case "root":
			default:
				controller.selectArticle(item);
				break;
		}
	},

	_onSitenameClick: function() {
		switch (this.model.get("routeName")) {
			case "media-item":
			case "bundle-item":
				if (this.model.get("collapsed")) {
					this._changeCollapsed(false);
				} else {
					controller.deselectBundle();
				}
				break;
			case "article-item":
				controller.deselectArticle();
				break;
		}
	},

	_onBundleListSame: function(bundle) {
		this._changeCollapsed(!this.model.get("collapsed"));
	},

	_onKeywordListChange: function(keyword) {
		if (!this.model.get("collapsed")) {
			keywords.select(keyword);
		}
	},

	_changeCollapsed: function(value) {
		if (value !== this.model.get("collapsed")) {
			this.transforms.offset(0, 1, this.graph.el);
			this.transforms.validate();
			this.setImmediate(function() {
				console.log("%s::_changeCollapsed", this.cid);
				this.model.set("collapsed", !this.model.get("collapsed"));
			});
		}
	},

	/* -------------------------------
	/* Horizontal touch/move (HammerJS)
	/* ------------------------------- */

	_onHPanStart: function(ev) {
		this.transforms.get(this.keywordList.wrapper)
			.stopTransition()
			.clearOffset()
			.validate();
		// if (this.model.get("layoutName") != "left-layout"
		// 	&& this.model.get("layoutName") != "default-layout") {
		// 	return;
		// }
		if (Globals.BREAKPOINTS["desktop-small"].matches
			&& this.model.get("bundle").get("media").selectedIndex <= 0
			&& this.model.get("collapsed")) {
			this.transforms.get(this.keywordList.wrapper).clearCapture();
			this._onHPanMove(ev);

			this.touch.on("hpanmove", this._onHPanMove);
			this.touch.on("hpanend hpancancel", this._onHPanFinal);
		}
	},

	_onHPanMove: function(ev) {
		// var HPAN_DRAG = 1;
		// var HPAN_DRAG = 0.75;
		var HPAN_DRAG = 720 / 920;
		var delta = ev.deltaX; //ev.thresholdDeltaX;
		// var mediaItems = this.model.get("bundle").get("media");

		if (this.model.get("withMedia")) {
			// if (this.model.get("withMedia") ^ (this._renderFlags & View.MODEL_INVALID)) {
			// if (mediaItems.selected !== null) {
			delta *= (ev.offsetDirection & Hammer.DIRECTION_LEFT) ?
				0.0 : HPAN_DRAG;
			// if (bundles.selected.get("media").selectedIndex == -1) {
		} else { //if (media.selectedIndex == 0) {
			delta *= (ev.offsetDirection & Hammer.DIRECTION_LEFT) ?
				HPAN_DRAG : Globals.HPAN_OUT_DRAG;
		}
		this.transforms.offset(delta, void 0, this.keywordList.wrapper);
		this.transforms.validate();
	},

	_onHPanFinal: function(ev) {
		this.touch.off("hpanmove", this._onHPanMove);
		this.touch.off("hpanend hpancancel", this._onHPanFinal);

		/* NOTE: if there is no model change, set tx here. Otherwise just wait for render */
		var kTf = this.transforms.get(this.keywordList.wrapper);
		if (!(this._renderFlags & View.MODEL_INVALID) && kTf.hasOffset) {
			if (kTf.offsetX != 0) {
				kTf.runTransition(tx.NOW);
			}
			kTf.clearOffset().validate();
			// kTf.clearOffset().runTransition(tx.NOW).validate();
			// this.transforms.clearOffset(this.keywordList.wrapper);
			// this.transforms.runTransition(tx.NOW, this.keywordList.wrapper);
			// this.transforms.validate();
		}
	},

	/* -------------------------------
	/* Vertical touch/move (_onVPan*)
	/* ------------------------------- */

	_collapsedOffsetY: Globals.COLLAPSE_OFFSET,

	_onVPanStart: function(ev) {
		this.touch.on("vpanmove", this._onVPanMove);
		this.touch.on("vpanend vpancancel", this._onVPanFinal);

		this.transforms.stopTransition(this.bundleList.el, this.keywordList.el); //, this.graph.el);
		// this.transforms.clearOffset(this.bundleList.el, this.keywordList.el);
		// this.transforms.validate();
		this.transforms.clearCapture(this.bundleList.el, this.keywordList.el); //, this.graph.el);

		if (!this.model.get("collapsed")) {
			this.transforms.stopTransition(this.graph.el);
			this.transforms.clearCapture(this.graph.el);
		}
		// this.el.classList.add("container-changing");
		this._onVPanMove(ev);
	},

	_onVPanMove: function(ev) {
		var collapsed = this.model.get("collapsed");
		var delta = ev.deltaY; //ev.thresholdDeltaY;
		var maxDelta = this._collapsedOffsetY; // + Math.abs(ev.thresholdOffsetY);

		// check if direction is aligned with collapsed/expand
		var isValidDir = collapsed ? (delta > 0) : (delta < 0);
		var moveFactor = collapsed ? 1 - Globals.VPAN_DRAG : Globals.VPAN_DRAG;

		delta = Math.abs(delta); // remove sign
		delta *= moveFactor;
		maxDelta *= moveFactor;

		if (isValidDir) {
			if (delta > maxDelta) { // overshooting
				delta = ((delta - maxDelta) * Globals.VPAN_OUT_DRAG) + maxDelta;
			} else { // no overshooting
				// delta = delta;
			}
		} else {
			delta = (-delta) * Globals.VPAN_OUT_DRAG; // delta is opposite
		}
		delta *= collapsed ? 0.5 : -1; // reapply sign

		this.transforms.offset(0, delta, this.bundleList.el, this.keywordList.el); //, this.graph.el);
		if (!collapsed)
			this.transforms.offset(0, delta, this.graph.el)
		this.transforms.validate();
	},

	_onVPanFinal: function(ev) {
		this.touch.off("vpanmove", this._onVPanMove);
		this.touch.off("vpanend vpancancel", this._onVPanFinal);

		this._onVPanMove(ev);
		this.setImmediate(function() {
			if (this.willCollapsedChange(ev)) {
				this.model.set("collapsed", !this.model.get("collapsed"));
			} else {
				this.requestRender(View.LAYOUT_INVALID);
			}
		});
	},

	willCollapsedChange: function(ev) {
		return ev.type == "vpanend" ? this.model.get("collapsed") ?
			ev.deltaY > Globals.COLLAPSE_THRESHOLD :
			ev.deltaY < -Globals.COLLAPSE_THRESHOLD :
			false;
	},

	/* -------------------------------
	/* Components
	/* ------------------------------- */

	createSitenameButton: function() {
		var view = new View({
			el: "#site-name",
			events: {
				"click a": function(domev) {
					domev.defaultPrevented || domev.preventDefault();
					this.trigger("view:click");
				}
			}
		});
		this.listenTo(view, "view:click", this._onSitenameClick);
		view.wrapper = view.el.parentElement;
		return view;
	},

	createArticleButton: function(articleItem) {
		var view = new ArticleButton({
			el: ".article-button[data-handle='about']",
			model: articleItem
		}).render();
		this.listenTo(view, "view:click", this._onArticleClick);
		view.wrapper = view.el.parentElement;
		return view;
	},

	// createArticleButton2: function(articleItem) {
	// 	var view = new View({
	// 		el: "#about",
	// 		className: "article-button",
	// 		// tag: "h2",
	// 		model: articleItem,
	// 	});
	// 	// this.listenTo(view, "view:click", this._onAboutClick);
	// 	view.label = view.el.querySelector("a");
	// 	view.label.innerHTML = articleItem.get("name");
	// 	view.wrapper = view.el.parentElement;
	// 	return view;
	// },

	/**
	 * bundle-list
	 */
	createBundleList: function() {
		var view = new FilterableListView({
			el: "#bundle-list",
			collection: bundles,
			collapsed: false,
			filterFn: function(bundle, index, arr) {
				return keywords.selected ?
					bundle.get("kIds").indexOf(keywords.selected.id) !== -1 : false;
			},
		});
		controller.listenTo(view, {
			"view:select:one": controller.selectBundle,
			"view:select:none": controller.deselectBundle
		});
		// view.listenTo(bundles, "select:one select:none", function(item) {
		// 	view.selectedItem = item;
		// });
		this.listenTo(view, "view:select:same", this._onBundleListSame);
		this.listenTo(keywords, "select:one select:none", this._onKeywordSelect);
		view.wrapper = view.el.parentElement;
		return view;
	},

	/**
	 * keyword-list
	 */
	createKeywordList: function() {
		var view = new GroupingListView({
			el: "#keyword-list",
			collection: keywords,
			collapsed: false,
			filterFn: function(item, idx, arr) {
				// return !!(item.get("bundle").selected);
				return bundles.selected ?
					(bundles.selected.get("kIds").indexOf(item.id) !== -1) : false;
			},
			groupingFn: function(item, idx, arr) {
				// return item.get("type");
				return types.get(item.get("tId"));
			},
		});
		view.listenTo(keywords, "select:one select:none", function(item) {
			view.selectedItem = item;
		});
		this.listenTo(view, "view:select:one view:select:none", this._onKeywordListChange);
		view.wrapper = view.el.parentElement;
		return view;
	},

	/**
	 * nav-graph
	 */
	createGraphView: function(listA, listB) {
		var view = new GraphView({
			id: "nav-graph",
			listA: listA,
			listB: listB,
			model: this.model,
			useOpaque: false
		});
		// this.el.appendChild(view.el);
		this.el.insertBefore(view.el, this.el.firstElementChild);
		return view;
	},

	/* -------------------------------
	/* Horizontal touch/move (MutationObserver)
	/* ------------------------------- */

	/*
	_beginTransformObserve: function() {
		if (!(Globals.BREAKPOINTS["desktop-small"].matches && this.model.get("bundle").get("media").selectedIndex <= 0 && this.model.get("collapsed"))) {
			return;
		}
		var target = document.querySelector(".carousel > .empty-item");
		if (target === null) {
			return;
		}
		if (!this._transformObserver) {
			this._transformObserver = new MutationObserver(this._onTransformMutation);
		}
		this._transformObserver.observe(target, { attributes: true, attributeFilter: ["style"] });
		this.touch.on("hpanend hpancancel", this._endTransformObserve);
		this.transforms.get(this.keywordList.wrapper)
			.stopTransition()
			.clearOffset()
			.clearCapture()
			.validate();
	},

	_endTransformObserve: function() {
		this._transformObserver.disconnect();
		this.touch.off("hpanend hpancancel", this._endTransformObserve);
		this.transforms.get(this.keywordList.wrapper)
			.clearOffset()
			.runTransition(tx.NOW)
			.validate();
	},

	_onTransformMutation: function(mutations) {
		var tView, tMetrics, tCss, dTxObj, pos;

		// this.keywordList.wrapper.style[prefixedProperty("transform")];
		// transform = mutations[0].target.style.getPropertyValue(prefixedProperty("transform"));

		tView = View.findByElement(mutations[0].target);
		if (tView) {
			tMetrics = tView.metrics;
			dTxObj = this.transforms.get(this.keywordList.wrapper);
			console.log("%s::_onTransformMutation [withMedia: %s] target: (%f\+%f) %f wrapper: (%f) %f", this.cid,
				this.model.has("media"),
				tMetrics.translateX, tMetrics.width, tMetrics.translateX + tMetrics.width,
				dTxObj.capturedX, tMetrics.translateX - dTxObj.capturedX,
				tMetrics
			);

			this.transforms.offset(tMetrics.translateX - dTxObj.capturedX, void 0, this.keywordList.wrapper);
			this.transforms.validate();
		}
	},
	*/
});

module.exports = NavigationView;
},{"app/control/Controller":33,"app/control/Globals":34,"app/model/collection/ArticleCollection":38,"app/model/collection/BundleCollection":39,"app/model/collection/KeywordCollection":40,"app/model/collection/TypeCollection":41,"app/view/base/TouchManager":57,"app/view/base/View":58,"app/view/component/ArticleButton":61,"app/view/component/FilterableListView":66,"app/view/component/GraphView":67,"app/view/component/GroupingListView":68,"hammerjs":"hammerjs","underscore":"underscore","utils/TransformHelper":103}],53:[function(require,module,exports){
(function (DEBUG){
/* global Path2D */
/**
 * @module app/view/component/progress/CanvasView
 */

/** @type {module:underscore} */
var _ = require("underscore");
// /** @type {module:color} */
// var Color = require("color");

/** @type {module:app/view/base/View} */
var View = require("app/view/base/View");
/** @type {module:app/control/Globals} */
var Globals = require("app/control/Globals");
/** @type {module:app/view/base/Interpolator} */
var Interpolator = require("app/view/base/Interpolator");
/** @type {module:utils/css/getBoxEdgeStyles} */
var getBoxEdgeStyles = require("utils/css/getBoxEdgeStyles");

var MIN_CANVAS_RATIO = 2; // /Firefox/.test(window.navigator.userAgent)? 2 : 1;

/**
 * @constructor
 * @type {module:app/view/component/progress/CanvasView}
 */
var CanvasView = View.extend({

	/** @type {string} */
	cidPrefix: "canvasView",
	/** @type {string} */
	tagName: "canvas",
	/** @type {string} */
	className: "canvas-view",

	properties: {
		context: {
			get: function() {
				return this._ctx;
			}
		},
		interpolator: {
			get: function() {
				return this._interpolator;
			}
		},
		canvasRatio: {
			get: function() {
				return this._canvasRatio;
			}
		},
	},

	/** @type {Object} */
	defaults: {
		values: {
			value: 0
		},
		maxValues: {
			value: 1
		},
		useOpaque: true,
	},

	/* --------------------------- *
	/* children/layout
	/* --------------------------- */

	/** @override */
	initialize: function(options) {
		// TODO: cleanup this options mess
		options = _.defaults(options, this.defaults);
		options.values = _.defaults(options.values, this.defaults.values);
		options.maxValues = _.defaults(options.maxValues, this.defaults.maxValues);

		this._interpolator = new Interpolator(options.values, options.maxValues);
		this._useOpaque = options.useOpaque;
		this._options = _.pick(options, "color", "backgroundColor");

		// opaque background
		// --------------------------------
		var ctxOpts = {};
		// if (this._useOpaque) {
		// 	this._opaqueProp = Modernizr.prefixed("opaque", this.el, false);
		// 	if (this._opaqueProp) {
		// 		this.el[this._opaqueProp] = true;
		// 	} else {
		// 		ctxOpts.alpha = true;
		// 	}
		// 	this.el.classList.add("color-bg");
		// }

		// canvas' context init
		// --------------------------------
		this._ctx = this.el.getContext("2d", ctxOpts);

		// adjust canvas size to pixel ratio
		// upscale the canvas if the two ratios don't match
		// --------------------------------
		var ratio = MIN_CANVAS_RATIO;
		var ctxRatio = this._ctx.webkitBackingStorePixelRatio || 1;
		if (window.devicePixelRatio !== ctxRatio) {
			// ratio = Math.max(window.devicePixelRatio / ctxRatio, MIN_CANVAS_RATIO);
			ratio = window.devicePixelRatio / ctxRatio;
			ratio = Math.max(ratio, MIN_CANVAS_RATIO);
		}
		this._canvasRatio = ratio;
		// console.log("%s::init canvasRatio: %f", this.cid, this._canvasRatio);

		this.listenTo(this, "view:attached", function() {
			// this.invalidateSize();
			// this.renderNow();
			this.requestRender(View.SIZE_INVALID | View.LAYOUT_INVALID).renderNow();
		});
	},

	// _computeCanvasRatio: function() {
	// 	var ratio = MIN_CANVAS_RATIO;
	// 	var ctxRatio = this._ctx.webkitBackingStorePixelRatio || 1;
	// 	if (window.devicePixelRatio !== ctxRatio) {
	// 		// ratio = Math.max(window.devicePixelRatio / ctxRatio, MIN_CANVAS_RATIO);
	// 		ratio = window.devicePixelRatio / ctxRatio;
	// 		ratio = Math.max(ratio, MIN_CANVAS_RATIO);
	// 	}
	// 	this._canvasRatio = ratio;
	// },

	_updateCanvas: function() {
		// adjust canvas size to pixel ratio
		// upscale the canvas if the two ratios don't match
		// --------------------------------

		var s = getComputedStyle(this.el);

		this._canvasWidth = this.el.offsetWidth;
		this._canvasHeight = this.el.offsetHeight;

		if (s.boxSizing === "border-box") {
			var m = getBoxEdgeStyles(s);
			this._canvasWidth -= m.paddingLeft + m.paddingRight + m.borderLeftWidth + m.borderRightWidth;
			this._canvasHeight -= m.paddingTop + m.paddingBottom + m.borderTopWidth + m.borderBottomWidth;
		}

		this._canvasWidth *= this._canvasRatio;
		this._canvasHeight *= this._canvasRatio;

		this.measureCanvas(this._canvasWidth, this._canvasHeight);
		this.el.width = this._canvasWidth;
		this.el.height = this._canvasHeight;
		// this.el.style.height = h + "px";
		// this.el.style.width = w + "px";

		// colors
		// --------------------------------
		this._color = this._options.color ||
			s.color || Globals.DEFAULT_COLORS["color"];
		this._backgroundColor = this._options.backgroundColor ||
			s.backgroundColor || Globals.DEFAULT_COLORS["background-color"];

		// mozOpaque
		// --------------------------------
		if (this._useOpaque && this._opaqueProp) {
			// this.el.style.backgroundColor = this._backgroundColor;
			this.el[this._opaqueProp] = true;
		}

		// fontSize
		// --------------------------------
		this._fontSize = parseFloat(s.fontSize) * this._canvasRatio;
		this._fontFamily = s.fontFamily;

		// prepare canvas context
		// --------------------------------
		this._ctx.restore();

		this._ctx.font = [s.fontWeight, s.fontStyle, this._fontSize + "px/1", s.fontFamily].join(" ");
		this._ctx.textAlign = "left";
		this._ctx.lineCap = "butt";
		this._ctx.lineJoin = "miter";
		this._ctx.strokeStyle = this._color;
		this._ctx.fillStyle = this._color;

		this.updateCanvas(this._ctx);
		this._ctx.save();

		// console.group(this.cid+"::_updateCanvas");
		// console.log("ratio:    %f (min: %f, device: %f, context: %s)", this._canvasRatio, MIN_CANVAS_RATIO, window.devicePixelRatio, this._ctx.webkitBackingStorePixelRatio || "(webkit-only)");
		// console.log("colors:   fg: %s bg: %s", this._color, this._backgroundColor);
		// console.log("style:    %s, %s, padding: %s (%s)", s.width, s.height, s.padding, s.boxSizing);
		// console.log("box:      %f x %f px", m.width, m.height);
		// console.log("measured: %f x %f px", w, h);
		// console.log("canvas:   %f x %f px", this._canvasWidth, this._canvasHeight);
		// console.groupEnd();
	},

	updateCanvas: function() {
		/* abstract */
	},

	measureCanvas: function() {
		/* abstract */
	},

	_getFontMetrics: function(str) {
		var key, idx, mObj, mIdx = str.length;
		for (key in Globals.FONT_METRICS) {
			idx = str.indexOf(key);
			if (idx !== -1 && idx < mIdx) {
				mIdx = idx;
				mObj = Globals.FONT_METRICS[key];
			}
		}
		return mObj;
	},

	_clearCanvas: function(x, y, w, h) {
		this._ctx.clearRect(x, y, w, h);
		if (this._useOpaque) {
			this._ctx.save();
			this._ctx.fillStyle = this._backgroundColor;
			this._ctx.fillRect(x, y, w, h);
			this._ctx.restore();
		}
	},

	_setStyle: function(s) {
		CanvasView.setStyle(this._ctx, s);
	},

	/* --------------------------- *
	/* render
	/* --------------------------- */

	/** @override */
	render: function() {
		if (this.attached) {
			return this.renderNow();
		}
		return this;
	},

	/** @override */
	renderFrame: function(tstamp, flags) {
		if (!this.attached) {
			return flags;
		}
		if (flags & View.SIZE_INVALID) {
			this._updateCanvas();
		}
		if (this._interpolator.valuesChanged) {
			flags |= View.LAYOUT_INVALID;
			this._interpolator.interpolate(tstamp);
		}
		if (flags & (View.LAYOUT_INVALID | View.SIZE_INVALID)) {
			this.redraw(this._ctx, this._interpolator);
			if (this._interpolator.valuesChanged) {
				this.requestRender();
			}
		}
	},

	/* --------------------------- *
	/* public
	/* --------------------------- */

	getValue: function(key) {
		return this._interpolator.getValue(key);
	},

	getRenderedValue: function(key) {
		return this._interpolator.getRenderedValue(key);
	},

	valueTo: function(value, duration, key) {
		this._interpolator.valueTo(value, duration, key);
		this.requestRender(View.MODEL_INVALID | View.LAYOUT_INVALID);
	},

	// updateValue: function(key) {
	// 	return this._interpolator.updateValue(key || this.defaultKey);
	// },

	/* --------------------------- *
	/* redraw
	/* --------------------------- */

	redraw: function(context, changed) {},

}, {
	setStyle: function(ctx, s) {
		if (typeof s != "object") return;
		for (var p in s) {
			switch (typeof ctx[p]) {
				case "undefined":
					break;
				case "function":
					if (Array.isArray(s[p])) ctx[p].apply(ctx, s[p]);
					else ctx[p].call(ctx, s[p]);
					break;
				default:
					ctx[p] = s[p];
			}
		}
	}
});

if (DEBUG) {
	CanvasView.prototype._skipLog = true;
}

module.exports = CanvasView;
}).call(this,true)

},{"app/control/Globals":34,"app/view/base/Interpolator":55,"app/view/base/View":58,"underscore":"underscore","utils/css/getBoxEdgeStyles":107}],54:[function(require,module,exports){
(function (DEBUG){
// /** @type {module:utils/setImmediate} */
// var setImmediate = require("utils/setImmediate");

// function sortByPriority(a, b) {
// 	if (a.priority > b.priority)
// 		return 1;
// 	if (a.priority < b.priority)
// 		return -1;
// 	return 0;
// }

function RequestQueue(offset) {
	this._offset = offset | 0;
	this._items = [];
	this._priorities = [];
	this._numItems = 0;
}

RequestQueue.prototype = Object.create({
	enqueue: function(item, priority) {
		var i = this._items.length;
		this._items[i] = item;
		this._priorities[i] = {
			priority: (priority | 0),
			index: i
		};
		this._numItems++;
		// console.log("FrameQueue::RequestQueue::enqueue() [numItems:%i] ID:%i", this._numItems, this._offset + i);
		return this._offset + i;
	},

	contains: function(index) {
		index -= this.offset;
		return 0 <= index && index < this._items.length;
	},

	skip: function(index) {
		var i, item;
		i = index - this._offset;
		if (0 > i || i >= this._items.length) {
			// 	console.warn("FrameQueue::RequestQueue::skip(id:%i) out of range (%i-%i)", index, this._offset, this._offset + (this._numItems - 1));
			return void 0;
		}
		item = this._items[i];
		if (item !== null) {
			// if (item = this._items[i]) {
			this._items[i] = null;
			this._numItems--;

			// if (this._numItems == 0) {
			// 	this._empty(this._offset + this._items.length);
			// }
			// console.log("FrameQueue::RequestQueue::skip(id:%i) [numItems:%i] skipping", index, this._numItems);
		}
		// else {
		// 	console.warn("FrameQueue::RequestQueue::skip(id:%i) [numItems:%i] item is null", index, this._numItems);
		// }
		return item;
	},

	// forEach: function(fn, context) {
	// 	return this.items.forEach(fn, context);
	// },

	indexes: function() {
		// .map(function(o, i, a) {
		// 	return this[o.index];
		// }, this._items);
		var items = this._priorities.concat();
		items.sort(function(a, b) {
			if (a.priority > b.priority)
				return 1;
			if (a.priority < b.priority)
				return -1;
			return 0;
		});
		items.forEach(function(o, i, a) {
			a[i] = o.index;
		}, this);
		return items;
	},

	items: function() {
		// .map(function(o, i, a) {
		// 	return this[o.index];
		// }, this._items);
		var items = this._priorities.concat();
		items.sort(function(a, b) {
			if (a.priority > b.priority)
				return 1;
			if (a.priority < b.priority)
				return -1;
			return 0;
		});
		items.forEach(function(o, i, a) {
			a[i] = this._items[o.index];
		}, this);
		return items;
	},

	_empty: function(offset) {
		this._offset = offset;
		this._items.length = 0;
		this._priorities.length = 0;
		this._numItems = 0;
	}
}, {

	offset: {
		get: function() {
			return this._offset;
		}
	},

	length: {
		get: function() {
			return this._items.length;
		}
	},

	numItems: {
		get: function() {
			return this._numItems;
		}
	},
});

var _nextQueue = new RequestQueue(0);
var _currQueue = null;

var _pending = false;
var _running = false;
var _rafId = -1;

/**
/* @param tstamp {int}
/*/
var _runQueue = function(tstamp) {
	if (_running) throw new Error("wtf!!!");

	_rafId = -1;
	_running = true;
	_currQueue = _nextQueue;
	_nextQueue = new RequestQueue(_currQueue.offset + _currQueue.length);

	// _currQueue.items().forEach(function(fn, i, a) {
	// 	if (fn !== null) {
	// 		fn(tstamp);
	// 	}
	// });
	_currQueue.indexes().forEach(function(index, i, a) {
		var fn = _currQueue._items[index];
		if (fn !== null) {
			fn(tstamp);
		}
	});
	_running = false;
	_currQueue = null;

	if (_nextQueue.numItems > 0) {
		_rafId = window.requestAnimationFrame(_runQueue);
	}
};

var FrameQueue = Object.create({
	/**
	/* @param fn {Function}
	/* @param priority {int}
	/* @return {int}
	/*/
	request: function(fn, priority) {
		// if (!_running && !_pending) {
		// 	_pending = true;
		// 	console.warn("FrameQueue::request setImmediate: pending");
		// 	setImmediate(function() {
		// 		_pending = false;
		// 		if (_nextQueue.numItems > 0) {
		// 			_rafId = window.requestAnimationFrame(_runQueue);
		// 			console.warn("FrameQueue::request setImmediate: raf:%i for %i items", _rafId, _nextQueue.numItems);
		// 		} else {
		// 			console.warn("FrameQueue::request setImmediate: no items");
		// 		}
		// 	});
		// }
		if (!_running && _rafId === -1) {
			_rafId = window.requestAnimationFrame(_runQueue);
		}
		return _nextQueue.enqueue(fn, priority);
	},

	/**
	/* @param id {int}
	/* @return {Function?}
	/*/
	cancel: function(id) {
		var fn;
		if (_running) {
			fn = _currQueue.skip(id) || _nextQueue.skip(id);
		} else {
			fn = _nextQueue.skip(id);
			if ((_rafId !== -1) && (_nextQueue.numItems === 0)) {
				window.cancelAnimationFrame(_rafId);
				_rafId = -1;
			}
		}
		return fn;
	},
}, {
	running: {
		get: function() {
			return _running;
		}
	}
});

if (DEBUG) {
	/** @type {module:underscore} */
	var _ = require("underscore");

	// console.info("Using app/view/base/FrameQueue");

	// 	// // log frame exec time
	// 	// var _now = window.performance?
	// 	// 	window.performance.now.bind(window.performance) :
	// 	// 	Date.now.bind(Date);
	// 	// _runQueue = _.wrap(_runQueue, function(fn, tstamp) {
	// 	// 	var retval, tframe;
	// 	// 	console.log("[FRAME BEGIN] [%ims] %i items [ids:%i-%i]", tstamp, _nextQueue.numItems, _nextQueue.offset, _nextQueue.offset + _nextQueue.length);
	// 	// 	tframe = _now();
	// 	// 	retval = fn(tstamp);
	// 	// 	tframe = _now() - tframe;
	// 	// 	console.log("[FRAME ENDED] [%ims] took %ims\n---\n", tstamp + tframe, tframe);
	// 	// 	if (_nextQueue.numItems != 0) console.info("[FRAME ENDED] %i items scheduled for [raf:%i]", _nextQueue.numItems, _rafId);
	// 	// 	return retval;
	// 	// });

	// log frame end
	_runQueue = _.wrap(_runQueue, function(fn, tstamp) {
		var retval;
		console.group("FrameQueue " + _rafId);
		// console.log("FrameQueue::_runQueue %i items (ID range:%i-%i)", _nextQueue.numItems, _nextQueue.offset, _nextQueue.offset + _nextQueue.length - 1);
		retval = fn(tstamp);
		// console.log("[Frame exit]\n---\n");
		console.groupEnd();
		return retval;
	});

	// // use log prefix
	// if (console.prefix) {
	// 	_runQueue = _.wrap(_runQueue, function(fn, tstamp) {
	// 		var retval, logprefix;
	// 		logprefix = console.prefix;
	// 		console.prefix += "[raf:" + _rafId + "] ";
	// 		retval = fn(tstamp);
	// 		console.prefix = logprefix;
	// 		return retval;
	// 	});
	// }

	// FrameQueue.cancel = _.wrap(FrameQueue.cancel, function(fn, id) {
	// 	if ((_currQueue !== null) && (_currQueue.offset >= id) && (id < _nextQueue.offset)) {
	// 		console.info("FrameQueue::cancel ID:%i in running range (%i-%i)", id, _currQueue.offset, _nextQueue.offset - 1);
	// 	}
	// 	var rafId = _rafId;
	// 	var retval = fn(id);
	// 	if (retval === void 0) {
	// 		console.warn("FrameQueue::cancel ID:%i not found", id);
	// 	} else if (retval === null) {
	// 		console.warn("FrameQueue::cancel ID:%i already cancelled", id);
	// 	} else {
	// 		if (!_running && _nextQueue.numItems == 0) {
	// 			console.info("FrameQueue::cancel raf:%i cancelled (ID:%i cancelled, empty queue)", rafId, id);
	// 		}
	// 	}
	// 	return retval;
	// });
}


module.exports = FrameQueue;
}).call(this,true)

},{"underscore":"underscore"}],55:[function(require,module,exports){
/**
 * @module app/view/base/Interpolator
 */

// /** @type {module:underscore} */
// var _ = require("underscore");
/** @type {module:utils/ease/linear} */
var linear = require("utils/ease/linear");

/**
 * @constructor
 * @type {module:app/view/base/Interpolator}
 */
function Interpolator(values, maxValues) {
	this._valueData = {};
	this._maxValues = {};
	this._renderableKeys = [];

	var key, val, maxVal;
	for (key in values) {
		val = values[key];
		maxVal = maxValues[key] || null;
		// create value object and store it
		this._valueData[key] = this._initValue(val, 0, maxVal);
		// add maxValue to store
		this._maxValues[key] = maxVal;
		// add to next render list
		this._renderableKeys.push(key);
	}
	this._valuesChanged = this._renderableKeys.length > 0;
}

Interpolator.prototype = Object.create({

	/* --------------------------- *
	/* public interface
	/* --------------------------- */

	isAtTarget: function(key) {
		return this._renderableKeys.indexOf(key) === -1;
	},

	getValue: function(key) {
		return this._valueData[key]._value;
	},

	getRenderedValue: function(key) {
		return this._valueData[key]._renderedValue;
	},

	valueTo: function(value, duration, key) {
		var changed, dataObj = this._valueData[key];
		// console.log("%s::valueTo [%s]", "[interpolator]", key, value);
		if (Array.isArray(dataObj)) {
			changed = value.reduce(function(prevChanged, itemValue, i) {
				if (dataObj[i]) {
					dataObj[i] = this._initNumber(itemValue, duration, this._maxValues[key]);
					return true;
				} else {
					return this._setValue(itemValue, duration, dataObj[i]) || prevChanged;
				}
			}.bind(this), changed);
		} else {
			changed = this._setValue(value, duration, dataObj);
		}
		if (changed) {
			this._renderableKeys.indexOf(key) !== -1 || this._renderableKeys.push(key);
			this._valuesChanged = true;
			// this.render();
			// this.requestRender();
		}
		return this;
	},

	updateValue: function(key) {
		// Call _interpolateValue only if needed. _interpolateValue() returns false
		// once interpolation is done, in which case remove key from _renderableKeys.
		var kIndex = this._renderableKeys.indexOf(key);
		if (kIndex !== -1 && !this._interpolateValue(key)) {
			this._renderableKeys.splice(kIndex, 1);
			this._valuesChanged = this._renderableKeys.length > 0;
		}
		return this;
	},

	/* --------------------------- *
	/* private: valueData
	/* --------------------------- */

	_initValue: function(value, duration, maxVal) {
		if (Array.isArray(value)) {
			return value.map(function(val) {
				return this._initNumber(val, 0, maxVal);
			}, this);
		} else {
			return this._initNumber(value, 0, maxVal);
		}
	},

	// _initArray: function(value, duration, maxVal) {
	// 	return val.map(function(val) {
	// 		return this._initNumber(val, 0, maxVal);
	// 	}, this);
	// },

	_initNumber: function(value, duration, maxVal) {
		var o = {};
		o._value = value;
		o._startValue = value;
		o._valueDelta = 0;

		o._duration = duration || 0;
		o._startTime = -1;
		o._elapsedTime = 0;

		o._lastRenderedValue = o._renderedValue = null;

		o._maxVal = maxVal;
		// if (maxVal !== void 0) o._maxVal = maxVal;
		// o._maxVal = this._maxValues[key];
		// o._maxVal = this._maxVal;// FIXME
		return o;
	},

	_setValue: function(value, duration, o) {
		if (o._value != value) {
			o._startValue = o._value;
			o._valueDelta = value - o._value;
			o._value = value;

			o._duration = duration || 0;
			o._startTime = -1;
			o._elapsedTime = 0;

			o._lastRenderedValue = o._renderedValue;

			return true;
		}
		return false;
	},

	/* --------------------------- *
	/* private: interpolate
	/* --------------------------- */

	/** @override */
	interpolate: function(tstamp) {
		if (this._valuesChanged) {
			this._valuesChanged = false;

			var changedKeys = this._renderableKeys;
			this._tstamp = tstamp;
			this._renderableKeys = changedKeys.filter(this._interpolateValue, this);
			this._renderedKeys = changedKeys;

			if (this._renderableKeys.length !== 0) {
				this._valuesChanged = true;
				// 	// this.requestRender();
			}
		}
		// console.log("%s::interpolate valuesChanged:%s tstamp:%f", "[interpolator]", this._valuesChanged, tstamp);
		// return this._valuesChanged;
		// return this.valuesChanged;

		return this;
	},

	_interpolateValue: function(key) {
		var dataObj = this._valueData[key];
		if (Array.isArray(dataObj)) {
			return dataObj.reduce(function(continueNext, o, index, arr) {
				return this._interpolateNumber(this._tstamp, o) || continueNext;
			}.bind(this), false);
		} else {
			return this._interpolateNumber(this._tstamp, dataObj);
		}
	},

	_interpolateNumber: function(tstamp, o) {
		if (o._startTime < 0) {
			o._startTime = tstamp;
		}
		var elapsed = tstamp - o._startTime;
		o._elapsedTime = elapsed;
		o._lastRenderedValue = o._renderedValue;
		if (elapsed < o._duration) {
			if (o._maxVal && o._valueDelta < 0) {
				// upper-bound values
				o._renderedValue = linear(elapsed, o._startValue,
					o._valueDelta + o._maxVal, o._duration) - o._maxVal;
			} else {
				// unbound values
				o._renderedValue = linear(elapsed, o._startValue,
					o._valueDelta, o._duration);
			}
			return true;
		} else {
			o._renderedValue = o._value;
			return false;
		}
	},
}, {
	valuesChanged: {
		get: function() {
			return this._valuesChanged;
		}
	},
	renderableKeys: {
		get: function() {
			return this._renderableKeys;
		}
	},
	renderedKeys: {
		get: function() {
			return this._renderedKeys;
		}
	},
});

module.exports = Interpolator;

},{"utils/ease/linear":109}],56:[function(require,module,exports){
(function (DEBUG){
/** @type {module:utils/prefixedEvent} */
var prefixedEvent = require("utils/prefixedEvent");

var eventMap = {
	"transitionend": prefixedEvent("transitionend"),
	"fullscreenchange": prefixedEvent("fullscreenchange", document),
	"fullscreenerror": prefixedEvent("fullscreenerror", document),
	"visibilitychange": prefixedEvent("visibilitychange", document, "hidden")
};

var eventNum = 0;
for (var eventName in eventMap) {
	if (eventName === eventMap[eventName]) {
		delete eventMap[eventName];
	} else {
		Object.defineProperty(eventMap, eventName, {
			value: eventMap[eventName],
			enumerable: true
		});
		Object.defineProperty(eventMap, eventNum, {
			value: eventName,
			enumerable: false
		});
		eventNum++;
	}
}
Object.defineProperty(eventMap, "length", {
	value: eventNum
});

if (DEBUG) {
	console.log("prefixes enabled for %i events", eventMap.length, Object.keys(eventMap));
}

module.exports = eventMap;

// module.exports = eventNum > 0? eventMap : null;

}).call(this,true)

},{"utils/prefixedEvent":112}],57:[function(require,module,exports){
/**
 * @module app/view/base/TouchManager
 */

// /** @type {module:underscore} */
// var _ = require("underscore");
/** @type {module:hammerjs} */
var Hammer = require("hammerjs");
/** @type {module:app/control/Globals} */
var Globals = require("app/control/Globals");

/** @type {module:hammerjs.Tap} */
var Tap = Hammer.Tap;
/** @type {module:utils/touch/SmoothPanRecognizer} */
var Pan = require("utils/touch/SmoothPanRecognizer");
// /** @type {module:hammerjs.Pan} */
// var Pan = Hammer.Pan;

/* -------------------------------
/* Static private
/* ------------------------------- */

/**
 * @param el HTMLElement
 * @return {Hammer.Manager}
 */
function createInstance(el) {
	var manager, hpan, vpan, tap;
	hpan = new Pan({
		// threshold: Globals.PAN_THRESHOLD,
		direction: Hammer.DIRECTION_HORIZONTAL,
		event: "hpan",
	});
	vpan = new Pan({
		// threshold: Globals.PAN_THRESHOLD,
		direction: Hammer.DIRECTION_VERTICAL,
		event: "vpan",
	});
	tap = new Tap({
		// threshold: Globals.PAN_THRESHOLD - 1
	});
	manager = new Hammer.Manager(el);
	manager.add([tap, hpan, vpan]);
	vpan.requireFailure(hpan);
	// manager.set({ domevents: true });
	return manager;
}

// function createInstance(el) {
// 	return new Hammer(el, {
// 		recognizers: [
// 			[Tap],
// 			[Pan, {
// 				event: 'hpan',
// 				direction: Hammer.DIRECTION_HORIZONTAL,
// 				threshold: Globals.THRESHOLD
// 			}],
// 			[Pan, {
// 				event: 'vpan',
// 				direction: Hammer.DIRECTION_VERTICAL,
// 				threshold: Globals.THRESHOLD
// 			}, ['hpan']]
// 		]
// 	});
// }

// function createInstance(el) {
// 	var recognizers = [];
// 	var manager = new Hammer.Manager(el);
//
// 	var hpan = new Pan({
// 		event: "hpan",
// 		threshold: Globals.THRESHOLD,
// 		direction: Hammer.DIRECTION_HORIZONTAL
// 	});
//
// 	var vpan = new Pan({
// 		event: "vpan",
// 		threshold: Globals.THRESHOLD,
// 		direction: Hammer.DIRECTION_VERTICAL
// 	});
//
// 	var tap = new Hammer.Tap();
// 	// var tap = new Hammer.Tap({
// 	// 	threshold: Globals.THRESHOLD - 1,
// 	// 	interval: 50,
// 	// 	time: 200
// 	// });
// 	recognizers.push(vpan);
// 	recognizers.push(hpan);
// 	recognizers.push(tap);
// 	manager.add(recognizers);
//
// 	hpan.recognizeWith([vpan]);
// 	hpan.requireFailure([vpan]);
// 	tap.recognizeWith([vpan, hpan]);
//
// 	// tap.requireFailure(vpan);
//
// 	// manager.set({ domevents: true });
// 	return manager;
// }

/*https://gist.githubusercontent.com/jtangelder/361052976f044200ea17/raw/f54c2cef78d59da3f38286fad683471e1c976072/PreventGhostClick.js*/

// function	logEvent(message) {
// 	console.log(message, domev.type,
// 		"panSessionOpened: " + panSessionOpened,
// 		"defaultPrevented: " + domev.defaultPrevented
// 	);
// }

var lastTimeStamp = -1;
var panSessionOpened = false;
var upEventName = window.hasOwnProperty("onpointerup") ? "pointerup" : "mouseup";

var touchHandlers = {};
touchHandlers["vpanstart vpanend vpancancel hpanstart hpanend hpancancel"] = function(hev) {
	// console.log("TouchManager:[%s]", hev.srcEvent.type);
	panSessionOpened = !hev.isFinal;
	if (hev.isFinal)
		lastTimeStamp = hev.srcEvent.timeStamp;
};
// touchHandlers["hammer.input tap vpanmove hpanmove"] = function(hev) {
// 	console.log("TouchManager:[%s -> %s]", hev.srcEvent.type, hev.type);
// };

var captureHandlers = {};
captureHandlers["click"] = function(domev) {
	if (lastTimeStamp == domev.timeStamp) {
		lastTimeStamp = -1;
		domev.defaultPrevented || domev.preventDefault();
		domev.stopPropagation();
	}
};
captureHandlers["dragstart"] = function(domev) {
	if (domev.target.nodeName == "IMG") {
		domev.defaultPrevented || domev.preventDefault();
	}
};
captureHandlers[upEventName] = function(domev) {
	panSessionOpened && domev.preventDefault();
};

var bubblingHandlers = {};

// -------------------------------
//
// -------------------------------

function addHandlers() {
	var eventName, el = instance.element;
	for (eventName in touchHandlers)
		if (touchHandlers.hasOwnProperty(eventName))
			instance.on(eventName, touchHandlers[eventName]);
	for (eventName in captureHandlers)
		if (captureHandlers.hasOwnProperty(eventName))
			el.addEventListener(eventName, captureHandlers[eventName], true);
	for (eventName in bubblingHandlers)
		if (bubblingHandlers.hasOwnProperty(eventName))
			el.addEventListener(eventName, bubblingHandlers[eventName], false);
}

function removeHandlers() {
	var eventName, el = instance.element;
	for (eventName in captureHandlers)
		if (captureHandlers.hasOwnProperty(eventName))
			el.removeEventListener(eventName, captureHandlers[eventName], true);
	for (eventName in bubblingHandlers)
		if (captureHandlers.hasOwnProperty(eventName))
			el.removeEventListener(eventName, bubblingHandlers[eventName], true);
}

/** @type {Hammer.Manager} */
var instance = null;

/* -------------------------------
/* Static public
/* ------------------------------- */

var TouchManager = {
	init: function(target) {
		if (instance === null) {
			instance = createInstance(target);
			addHandlers();
		} else if (instance.element !== target) {
			console.warn("TouchManager already initialized with another element");
		}
		return instance;
	},

	destroy: function() {
		if (instance !== null) {
			removeHandlers();
			instance.destroy();
			instance = null;
		} else {
			console.warn("no instance to destroy");
		}
	},

	getInstance: function() {
		if (instance === null) {
			console.error("TouchManager has not been initialized");
		}
		return instance;
	}
};

module.exports = TouchManager;
},{"app/control/Globals":34,"hammerjs":"hammerjs","utils/touch/SmoothPanRecognizer":119}],58:[function(require,module,exports){
(function (DEBUG){
/* global HTMLElement, MutationObserver */
/**
 * @module app/view/base/View
 */

/** @type {module:backbone} */
var Backbone = require("backbone");
/** @type {module:underscore} */
var _ = require("underscore");

/* -------------------------------
/* MutationObserver
/* ------------------------------- */

var _cidSeed = 1;
var _viewsByCid = {};

function addChildViews(el) {
	var view, els = el.querySelectorAll("*[data-cid]");
	for (var i = 0, ii = els.length; i < ii; i++) {
		view = View.findByElement(els.item(i));
		if (view) {
			if (!view.attached) {
				// console.log("View::[attached (parent)] %s", view.cid);
				view._elementAttached();
				// } else {
				// 	console.warn("View::[attached (parent)] %s (ignored)", view.cid);
			}
		}
	}
}

function removeChildViews(el) {
	var view, els = el.querySelectorAll("*[data-cid]");
	for (var i = 0, ii = els.length; i < ii; i++) {
		view = View.findByElement(els.item(i));
		if (view) {
			if (view.attached) {
				console.log("View::[detached (parent)] %s", view.cid);
				view._elementDetached();
			} else {
				console.warn("View::[detached (parent)] %s (ignored)", view.cid);
			}
		}
	}
}

var observer = new MutationObserver(function(mm) {
	// console.log("View::mutations %s", JSON.stringify(mm, null, " "));
	var i, ii, m;
	var j, jj, e;
	var view;
	for (i = 0, ii = mm.length; i < ii; i++) {
		m = mm[i];
		if (m.type == "childList") {
			for (j = 0, jj = m.addedNodes.length; j < jj; j++) {
				e = m.addedNodes.item(j);
				view = View.findByElement(e);
				if (view) {
					if (!view.attached) {
						// console.log("View::[attached (childList)] %s", view.cid);
						view._elementAttached();
						// } else {
						// 	console.warn("View::[attached (childList)] %s (ignored)", view.cid);
					}
				}
				if (e instanceof HTMLElement) addChildViews(e);
			}
			for (j = 0, jj = m.removedNodes.length; j < jj; j++) {
				e = m.removedNodes.item(j);
				// console.log("View::[detached (childList)] %s", e.cid);
				view = View.findByElement(e);
				if (view) {
					if (view.attached) {
						console.log("View::[detached (childList)] %s", view.cid, view.attached);
						view._elementDetached();
					} else {
						console.warn("View::[detached (childList)] %s (ignored)", view.cid, view.attached);
					}
				}
				if (e instanceof HTMLElement) removeChildViews(e);
			}
		} else if (m.type == "attributes") {
			view = View.findByElement(m.target);
			if (view) {
				if (!view.attached) {
					// console.log("View::[attached (attribute)] %s", view.cid);
					view._elementAttached();
					// } else {
					// 	console.warn("View::[attached (attribute)] %s (ignored)", view.cid);
				}
			}
			// else {
			// 	console.warn("View::[attributes] target has no cid (%s='%s')", m.attributeName, m.target.getAttribute(m.attributeName), m);
			// }
		}
	}
});

observer.observe(document.body, {
	attributes: true,
	childList: true,
	subtree: true,
	attributeFilter: ["data-cid"]
});

/* -------------------------------
/* static private
/* ------------------------------- */

/** @type {module:app/view/base/FrameQueue} */
var FrameQueue = require("app/view/base/FrameQueue");

/** @type {module:app/view/base/PrefixedEvents} */
var PrefixedEvents = require("app/view/base/PrefixedEvents");

var _now = window.performance ?
	window.performance.now.bind(window.performance) :
	Date.now.bind(Date);
// var _now = window.performance?
// 	function() { return window.performance.now(); }:
// 	function() { return Date.now(); };

var applyEventPrefixes = function(events) {
	var selector, unprefixed;
	for (selector in events) {
		unprefixed = selector.match(/^\w+/i)[0];
		if (PrefixedEvents.hasOwnProperty(unprefixed)) {
			events[selector.replace(unprefixed, PrefixedEvents[unprefixed])] = events[selector];
			// console.log("applyEventPrefixes", unprefixed, prefixedEvents[unprefixed]);
			delete events[selector];
		}
	}
	return events;
};

var getViewDepth = function(view) {
	if (!view) {
		return null;
	}
	if (!view.attached) {
		return NaN;
	}
	if (view.parentView === null) {
		return 0;
	}
	return view.parentView.viewDepth + 1;
};

function logAttachInfo(view, name, level) {
	if (["log", "info", "warn", "error"].indexOf(level) != -1) {
		level = "log";
	}
	console[level].call(console, "%s::%s [parent:%s %s %s depth:%s]", view.cid, name, view.parentView && view.parentView.cid, view.attached ? "attached" : "detached", view._viewPhase, view.viewDepth);
}

/* -------------------------------
/* static public
/* ------------------------------- */


var View = {

	/** @const */
	NONE_INVALID: 0,
	/** @const */
	CHILDREN_INVALID: 1,

	/** @const */
	MODEL_INVALID: 2,
	/** @const */
	STYLES_INVALID: 4,
	/** @const */
	SIZE_INVALID: 8,
	/** @const */
	LAYOUT_INVALID: 16,

	/** @const */
	// RENDER_INVALID: 8 | 16,

	/** @type {module:app/view/base/ViewError} */
	ViewError: require("app/view/base/ViewError"),

	/** @type {module:utils/prefixedProperty} */
	prefixedProperty: require("utils/prefixedProperty"),

	/** @type {module:utils/prefixedStyleName} */
	prefixedStyleName: require("utils/prefixedStyleName"),

	/** @type {module:utils/prefixedEvent} */
	prefixedEvent: require("utils/prefixedEvent"),

	// /** @type {module:utils/setImmediate} */
	// setImmediate: require("utils/setImmediate"),

	/** @type {module:app/view/promise/whenViewIsAttached} */
	whenViewIsAttached: require("app/view/promise/whenViewIsAttached"),


	/** @type {module:app/view/promise/whenViewIsRendered} */
	whenViewIsRendered: require("app/view/promise/whenViewIsRendered"),

	/**
	/* @param el {HTMLElement}
	/* @return {module:app/view/base/View}
	/*/
	findByElement: function(el) {
		if (_viewsByCid[el.cid]) {
			return _viewsByCid[el.cid];
		}
		return null;
	},

	/**
	/* @param el {HTMLElement}
	/* @return {module:app/view/base/View}
	/*/
	findByDescendant: function(el) {
		do {
			if (_viewsByCid[el.cid]) {
				return _viewsByCid[el.cid];
			}
		} while ((el = el.parentElement || el.parentNode));
		return null;
	},

	/** @override */
	extend: function(proto, obj) {
		if (PrefixedEvents.length && proto.events) {
			if (_.isFunction(proto.events)) {
				proto.events = _.wrap(proto.events, function(fn) {
					return applyEventPrefixes(fn.apply(this));
				});
			} else
			if (_.isObject(proto.events)) {
				proto.events = applyEventPrefixes(proto.events);
			}
		}
		if (proto.properties && this.prototype.properties) {
			_.defaults(proto.properties, this.prototype.properties);
		}
		return Backbone.View.extend.apply(this, arguments);
	},

	_flagsToStrings: ["-"],

	flagsToString: function(flags) {
		var s = View._flagsToStrings[flags | 0];
		if (!s) {
			s = [];
			if (flags & View.CHILDREN_INVALID) s.push("children");
			if (flags & View.MODEL_INVALID) s.push("model");
			if (flags & View.STYLES_INVALID) s.push("styles");
			if (flags & View.SIZE_INVALID) s.push("size");
			if (flags & View.LAYOUT_INVALID) s.push("layout");
			View._flagsToStrings[flags] = s = s.join(" ");
		}
		return s;
		// return (flags | 0).toString(2);
	},
};

Object.defineProperty(View, "instances", {
	value: _viewsByCid,
	enumerable: true
});

/* -------------------------------
/* prototype
/* ------------------------------- */

var ViewProto = {

	/** @type {string} */
	cidPrefix: "view",
	/** @type {Boolean} */
	_attached: false,
	/** @type {HTMLElement|null} */
	_parentView: null,
	/** @type {int|null} */
	_viewDepth: null,
	/** @type {string} initializing > initialized > disposing > disposed */
	_viewPhase: "initializing",
	/** @type {int} */
	_frameQueueId: -1,
	/** @type {int} */
	_renderFlags: 0,

	/** @type {object} */
	properties: {
		cid: {
			get: function() {
				return this._cid || (this._cid = this.cidPrefix + _cidSeed++);
			}
		},
		attached: {
			get: function() {
				return this._attached;
			}
		},
		parentView: {
			get: function() {
				return this._parentView;
			}
		},
		viewDepth: {
			get: function() {
				return this._getViewDepth();
			}
		},
		invalidated: {
			get: function() {
				return this._frameQueueId !== -1;
			}
		},
		enabled: {
			get: function() {
				return this._enabled;
			},
			set: function(enabled) {
				this.setEnabled(enabled);
			}
		},
		renderFlags: {
			get: function() {
				return this._renderFlags;
			}
		}
	},

	/**
	 * @constructor
	 * @type {module:app/view/base/View}
	 */
	constructor: function(options) {
		this.transform = {};
		this.childViews = {};
		this._applyRender = this._applyRender.bind(this);

		if (this.properties) {
			// Object.defineProperties(this, getPrototypeChainValue(this, "properties", Backbone.View));
			Object.defineProperties(this, this.properties);
		}
		if (options && options.className && this.className) {
			options.className += " " + _.result(this, "className");
		}
		if (options && options.parentView) {
			this._setParentView(options.parentView, true);
		}
		Backbone.View.apply(this, arguments);

		// console.log("%s::initialize viewPhase:[%s => initialized]", this.cid, this._viewPhase);
		this._viewPhase = "initialized";

		if (this.parentView !== null) {
			this.trigger("view:parentChange", this.parentView, null);
		}
		if (this.attached) {
			this.trigger("view:attached", this);
		}
	},

	/* -------------------------------
	/* remove
	/* ------------------------------- */

	/** @override */
	remove: function() {
		if (this._viewPhase == "disposing") {
			logAttachInfo(this, "remove", "warn");
		} else {
			// logAttachInfo(this, "remove", "log");
		}

		// before removal
		this._viewPhase = "disposing";
		this._cancelRender();

		// call Backbone impl
		// Backbone.View.prototype.remove.apply(this, arguments);

		// NOTE: from Backbone impl
		this.$el.remove(); // from Backbone impl

		this._attached = false;
		this.trigger("view:removed", this);

		// remove parent/child references
		this._setParentView(null);

		// NOTE: from Backbone impl. No more events after this
		this.stopListening();

		// check for invalidations that may have been triggered by "view:removed"
		if (this.invalidated) {
			console.warn("%s::remove invalidated after remove()", this.cid);
			this._cancelRender();
		}
		// // check for children still here
		// var ccids = Object.keys(this.childViews);
		// if (ccids.length) {
		// 	console.warn("%s::remove %i children not removed [%s]", this.cid, ccids.length, ccids.join(", "), this.childViews);
		// }
		// // remove childViews
		// for (var cid in this.childViews) {
		// 	this.childViews[cid].remove();
		// }
		// clear reference in view map
		delete _viewsByCid[this.cid];
		// delete this.el.cid;
		// update phase
		this._viewPhase = "disposed";
		return this;
	},

	/* -------------------------------
	/* _elementAttached _elementDetached
	/* ------------------------------- */

	_elementAttached: function() {
		// this._addToParentView();
		this._attached = true;
		this._viewDepth = null;
		this._setParentView(View.findByDescendant(this.el.parentElement));

		// if (this.parentView) {
		// 	console.log("[attach] [%i] %s > %s::_elementAttached", this.viewDepth, this.parentView.cid, this.cid);
		// } else {
		// 	console.log("[attach] [%i] %s::_elementAttached", this.viewDepth, this.cid);
		// }

		// if (this._viewPhase == "initializing") {
		// 	// this.trigger("view:attached", this);
		// } else
		if (this._viewPhase == "initialized") {
			this.trigger("view:attached", this);
		} else
		if (this._viewPhase == "replacing") {
			this._viewPhase = "initialized";
			this.trigger("view:replaced", this);
		}
	},

	_elementDetached: function() {
		if (!this.attached || (this._viewPhase == "disposing") || (this._viewPhase == "disposed")) {
			logAttachInfo(this, "_elementDetached", "error");
			// } else {
			// 	logAttachInfo(this, "_elementDetached", "log");
		}
		this._attached = false;
		this._viewDepth = null;

		if (this._viewPhase != "disposing" || this._viewPhase == "disposed") {
			this.remove();
		}
	},

	/* -------------------------------
	/* parentView
	/* ------------------------------- */

	_setParentView: function(newParent, silent) {
		if (newParent === void 0) {
			console.warn("$s::_setParentView invalid value '%s'", this.cid, newParent);
			newParent = null;
		}
		var oldParent = this._parentView;
		this._parentView = newParent;

		// force update of _viewDepth
		this._viewDepth = null; //getViewDepth(this);

		// skip the rest if arg is the same
		if (newParent === oldParent) {
			return;
		}
		if (oldParent !== null) {
			if (this.cid in oldParent.childViews) {
				delete oldParent.childViews[this.cid];
			}
		}
		if (newParent !== null) {
			newParent.childViews[this.cid] = this;
		}
		if (!silent)
			this.trigger("view:parentChange", this, newParent, oldParent);
	},

	whenAttached: function() {
		return View.whenViewIsAttached(this);
	},

	_getViewDepth: function() {
		if (this._viewDepth === null) {
			this._viewDepth = getViewDepth(this);
		}
		return this._viewDepth;
	},

	/* -------------------------------
	/* Backbone.View overrides
	/* ------------------------------- */

	/** @override */
	setElement: function(element, delegate) {
		// setElement always initializes this.el, so check it to be non-null before calling super
		if (this.el) {
			if (this.el !== element && this.el.parentElement) {
				// Element is being replaced
				if (this.attached) {
					// Since old element is attached to document tree, _elementAttached will be
					// triggered by replaceChild: set _viewPhase = "replacing" to flag this
					// change and trigger 'view:replaced' instead of 'view:added'.
					this._viewPhase = "replacing";
				}
				this.el.parentElement.replaceChild(element, this.el);
			}
			Backbone.View.prototype.setElement.apply(this, arguments);
			// Merge classes specified by this view with the ones already in the element,
			// as backbone will not:
			if (this.className) {
				_.result(this, "className").split(" ").forEach(function(item) {
					this.el.classList.add(item);
				}, this);
			}
		} else {
			Backbone.View.prototype.setElement.apply(this, arguments);
		}

		if (this.el === void 0) {
			throw new Error("Backbone view has no element");
		}
		_viewsByCid[this.cid] = this;
		this.el.cid = this.cid;
		this.el.setAttribute("data-cid", this.cid);

		return this;
	},

	/* -------------------------------
	/* requestAnimationFrame
	/* ------------------------------- */

	requestAnimationFrame: function(callback, priority, ctx) {
		return FrameQueue.request(callback.bind(ctx || this), priority);
	},

	cancelAnimationFrame: function(id) {
		return FrameQueue.cancel(id);
	},

	setImmediate: function(callback, ctx) {
		window.setImmediate(callback.bind(ctx || this));
	},

	/* -------------------------------
	/* deferred render: private methods
	/* ------------------------------- */

	/** @private */
	_applyRender: function(tstamp) {
		if (DEBUG) {
			if (!this._skipLog) {
				console.log("%s::_applyRender [%s] [%s, %s, %s]", this.cid,
					View.flagsToString(this._renderFlags),
					(this._frameQueueId != -1 ? "async #" + this._frameQueueId : "sync"),
					(this.attached ? "attached" : "detached"),
					(this.skipTransitions ? "skip" : "run") + " tx"
				);
			}
		}

		var flags = this._renderFlags;
		this.trigger("view:render:before", this, flags);
		this._renderFlags = 0;
		this._frameQueueId = -1;
		this._renderFlags |= this.renderFrame(tstamp, flags);
		this.trigger("view:render:after", this, flags);

		if (this._renderFlags != 0) {
			console.warn("%s::_applyRender [returned] flags: %s", this.cid, View.flagsToString(this._renderFlags), this._renderFlags);
		}
	},

	_cancelRender: function() {
		if (this._frameQueueId != -1) {
			var cancelId, cancelFn;

			cancelId = this._frameQueueId;
			this._frameQueueId = -1;
			cancelFn = FrameQueue.cancel(cancelId);

			if (cancelFn === void 0) {
				console.warn("%s::_cancelRender ID:%i not found", this.cid, cancelId);
			} else if (cancelFn === null) {
				console.warn("%s::_cancelRender ID:%i already cancelled", this.cid, cancelId);
				// } else {
				// 	if (!this._skipLog && !FrameQueue.running)
				// 		console.log("%s::_cancelRender ID:%i cancelled", this.cid, cancelId);
			}
		}
	},

	_requestRender: function() {
		if (FrameQueue.running) {
			this._cancelRender();
			if (DEBUG) {
				if (!this._skipLog) {
					console.info("%s::_requestRender rescheduled [%s (%s)]", this.cid, View.flagsToString(this._renderFlags), this._renderFlags);
				}
			}
		}
		if (this._frameQueueId == -1) {
			this._frameQueueId = FrameQueue.request(this._applyRender, isNaN(this.viewDepth) ? Number.MAX_VALUE : this.viewDepth);
		}
	},

	/* -------------------------------
	/* render: public / abstract methods
	/* ------------------------------- */

	invalidate: function(flags) {
		if (flags !== void 0) {
			if (DEBUG) {
				if (!this._skipLog) {
					if (this._renderFlags > 0) {
						console.log("%s::invalidate [%s (%s)] + [%s (%s)]", this.cid, View.flagsToString(this._renderFlags), this._renderFlags, View.flagsToString(flags), flags);
					} else {
						console.log("%s::invalidate [%s (%s)]", this.cid, View.flagsToString(flags), flags);
					}
				}
			}
			this._renderFlags |= flags;
		}
		return this;
	},

	requestRender: function(flags) {
		// if (flags !== void 0) {
		// 	this._renderFlags |= flags;
		// }
		this.invalidate(flags);
		this._requestRender();
		return this;
	},

	/** @abstract */
	renderFrame: function(tstamp, flags) {
		// subclasses should override this method
		return View.NONE_INVALID;
	},

	renderNow: function(alwaysRun) {
		if (this._frameQueueId != -1) {
			this._cancelRender();
			alwaysRun = true;
		}
		// if (alwaysRun === true) {
		if (alwaysRun) {
			this._applyRender(_now());
		}
		return this;
	},

	whenRendered: function() {
		return View.whenViewIsRendered(this);
	},

	/* -------------------------------
	/* render bitwise flags
	/* - check: this._renderFlags & flags
	/* - add: this._renderFlags |= flags
	/* - remove: this._renderFlags &= ~flags
	/* ------------------------------- */

	/* helpers ------------------ */

	requestChildrenRender: function(flags, now, force) {
		var ccid, view;
		for (ccid in this.childViews) {
			view = this.childViews[ccid];
			view.skipTransitions = !!(flags & View.SIZE_INVALID);
			view.requestRender(flags);
			if (now) {
				view.renderNow(force);
			}
		}
	},

	render: function() {
		return this.renderNow(true);
	},

	/* -------------------------------
	/* common abstract
	/* ------------------------------- */

	/** @private */
	_enabled: undefined,

	/**
	/* @param {Boolean}
	/*/
	setEnabled: function(enable) {
		this._enabled = enable;
	},
};

module.exports = Backbone.View.extend(ViewProto, View);
}).call(this,true)

},{"app/view/base/FrameQueue":54,"app/view/base/PrefixedEvents":56,"app/view/base/ViewError":59,"app/view/promise/whenViewIsAttached":79,"app/view/promise/whenViewIsRendered":80,"backbone":"backbone","underscore":"underscore","utils/prefixedEvent":112,"utils/prefixedProperty":113,"utils/prefixedStyleName":114}],59:[function(require,module,exports){
function ViewError(view, err) {
	this.view = view;
	this.err = err;
	this.message = err.message;
}
ViewError.prototype = Object.create(Error.prototype);
ViewError.prototype.constructor = ViewError;
ViewError.prototype.name = "ViewError";

module.exports = ViewError;

},{}],60:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "<a href=\""
    + alias3((helpers.global || (depth0 && depth0.global) || alias2).call(alias1,"APP_ROOT",{"name":"global","hash":{},"data":data}))
    + "#"
    + alias3(((helper = (helper = helpers.handle || (depth0 != null ? depth0.handle : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"handle","hash":{},"data":data}) : helper)))
    + "\">"
    + ((stack1 = ((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</a>\n";
},"useData":true});

},{"hbsfy/runtime":21}],61:[function(require,module,exports){
/**
/* @module app/view/component/ArticleView
/*/

/** @type {module:app/view/base/View} */
var View = require("app/view/base/View");
/** @type {Function} */
var viewTemplate = require("./ArticleButton.hbs");

/**
/* @constructor
/* @type {module:app/view/component/ArticleButton}
/*/
var ArticleButton = View.extend({

	/** @type {string} */
	cidPrefix: "articleButton",
	/** @override */
	tagName: "h2",
	/** @override */
	className: "article-button",
	/** @type {Function} */
	template: viewTemplate,

	events: {
		"click a": function(domev) {
			domev.defaultPrevented || domev.preventDefault();
			this.trigger("view:click", this.model);
		}
	},

	// /** @override */
	// initialize: function(options) {},

	/* --------------------------- *
	/* Render
	/* --------------------------- */

	renderFrame: function(tstamp, flags) {
		this.el.innerHTML = this.template(this.model.toJSON());
	},
});
module.exports = ArticleButton;
},{"./ArticleButton.hbs":60,"app/view/base/View":58}],62:[function(require,module,exports){
/**
/* @module app/view/component/ArticleView
/*/

/** @type {module:app/view/base/View} */
var View = require("app/view/base/View");

// /** @type {module:utils/net/toAbsoluteURL} */
// var toAbsoluteURL = require("utils/net/toAbsoluteURL");
//
// /** @type {string} */
// var ABS_APP_ROOT = toAbsoluteURL(require("app/control/Globals").APP_ROOT);

/**
/* @constructor
/* @type {module:app/view/component/ArticleView}
/*/
var ArticleView = View.extend({

	/** @type {string} */
	cidPrefix: "articleView",
	/** @override */
	tagName: "article",
	/** @override */
	className: "article-view mdown",

	/** @override */
	initialize: function(options) {},

	/* --------------------------- *
	/* Render
	/* --------------------------- */

	renderFrame: function(tstamp, flags) {
		this.el.innerHTML = this.model.get("text");
		// FIXME: now done in xslt
		// this.el.querySelectorAll("a[href]").forEach(function(el) {
		// 	var url = toAbsoluteURL(el.getAttribute("href"));
		// 	if (url.indexOf(ABS_APP_ROOT) !== 0) {
		// 		el.setAttribute("target", "_blank");
		// 	}
		// });
	},
});
module.exports = ArticleView;
},{"app/view/base/View":58}],63:[function(require,module,exports){
/**
/* @module app/view/component/Carousel
/*/

/** @type {module:underscore} */
var _ = require("underscore");
// /** @type {module:backbone} */
// var Backbone = require("backbone");
/** @type {module:hammerjs} */
var Hammer = require("hammerjs");
/** @type {module:backbone.babysitter} */
var Container = require("backbone.babysitter");

/** @type {module:app/control/Globals} */
var Globals = require("app/control/Globals");
/** @type {module:app/view/base/View} */
var View = require("app/view/base/View");
// /** @type {module:app/view/base/DeferredView} */
// var View = require("app/view/base/DeferredView");

/** @type {module:app/view/render/CarouselRenderer} */
var CarouselRenderer = require("app/view/render/CarouselRenderer");

/** @type {module:utils/prefixedProperty} */
var prefixedProperty = require("utils/prefixedProperty");
/** @type {module:utils/prefixedStyleName} */
var prefixedStyleName = require("utils/prefixedStyleName");

var transformStyleName = prefixedStyleName("transform");
var transformProperty = prefixedProperty("transform");
var translateTemplate = Globals.TRANSLATE_TEMPLATE;

// var cssToPx = function(cssVal, el) {
// 	return parseInt(cssVal);
// };

// var defaultRendererFunction = (function() {
// 	var defaultRenderer = CarouselRenderer.extend({ className: "carousel-item default-renderer"}),
// 		emptyRenderer = CarouselRenderer.extend({ className: "carousel-item empty-renderer"});
// 	return function(item, index, arr) {
// 		return (index === -1)? emptyRenderer: defaultRenderer;
// 	};
// })();

/** @const */
var MAX_SELECT_THRESHOLD = 20;

// /** @const */
// var CHILDREN_INVALID = View.CHILDREN_INVALID,
// 	STYLES_INVALID = View.STYLES_INVALID,
// 	MODEL_INVALID = View.MODEL_INVALID,
// 	SIZE_INVALID = View.SIZE_INVALID,
// 	LAYOUT_INVALID = View.LAYOUT_INVALID;

var VERTICAL = Hammer.DIRECTION_VERTICAL,
	HORIZONTAL = Hammer.DIRECTION_HORIZONTAL;

// x: ["x", "y"],
// y: ["y", "x"],
// offsetLeft: ["offsetLeft", "offsetTop"],
// offsetTop: ["offsetTop", "offsetLeft"],
// offsetWidth: ["offsetWidth", "offsetHeight"],
// offsetHeight: ["offsetHeight", "offsetWidth"],
// width: ["width","height"],
// height: ["height","width"],
// marginLeft: ["marginLeft","marginTop"],
// marginRight: ["marginRight","marginBottom"],

/*
var HORIZONTAL_PROPS = {
	pos: "x",
	size: "width",
	offsetPos: "offsetLeft",
	offsetSize: "offsetWidth",
	marginBefore: "marginLeft",
	marginAfter: "marginRight",
};
var VERTICAL_PROPS = {
	pos: "y",
	size: "height",
	offsetPos: "offsetTop",
	offsetSize: "offsetHeight",
	marginBefore: "marginTop",
	marginAfter: "marginBottom",
};
*/

// var DIRECTION_NONE = 1;
// var DIRECTION_LEFT = 2;
// var DIRECTION_RIGHT = 4;
// var DIRECTION_UP = 8;
// var DIRECTION_DOWN = 16;

// function dirToStr(dir) {
// 	if (dir === Hammer.DIRECTION_NONE) return 'NONE';
// 	if (dir === Hammer.DIRECTION_LEFT) return 'LEFT';
// 	if (dir === Hammer.DIRECTION_RIGHT) return 'RIGHT';
// 	if (dir === Hammer.DIRECTION_UP) return 'UP';
// 	if (dir === Hammer.DIRECTION_DOWN) return 'DOWN';
// 	if (dir === Hammer.DIRECTION_HORIZONTAL) return 'HORIZONTAL';
// 	if (dir === Hammer.DIRECTION_VERTICAL) return 'VERTICAL';
// 	if (dir === Hammer.DIRECTION_ALL) return 'ALL';
// 	return 'UNRECOGNIZED';
// }

var isValidTouchManager = function(touch, direction) {
	// var retval;
	try {
		return touch.get("hpan").options.direction == direction;
	} catch (err) {
		return false;
	}
	// return retval;
};

// /** @type {int} In pixels */
// var panThreshold: 15;

var createTouchManager = function(el, dir, thres) {
	var touch = new Hammer.Manager(el);
	var pan = new Hammer.Pan({
		threshold: 15,
		direction: dir,
	});
	var tap = new Hammer.Tap({
		threshold: thres - 1,
		interval: 50,
		time: 200,
	});
	tap.recognizeWith(pan);
	touch.add([pan, tap]);
	return touch;
};


var Carousel = {
	/** const */
	ANIMATED: false,
	/** const */
	IMMEDIATE: true,

	/** copy of Hammer.DIRECTION_VERTICAL */
	DIRECTION_VERTICAL: VERTICAL,
	/** copy of Hammer.DIRECTION_HORIZONTAL */
	DIRECTION_HORIZONTAL: HORIZONTAL,
	/** @type {Object} */
	defaults: {
		/** @type {boolean} */
		selectOnScrollEnd: false,
		/** @type {boolean} */
		requireSelection: false,
		/** @type {int} */
		direction: HORIZONTAL,
		/** @type {int} In pixels */
		selectThreshold: 20,
		/** @type {Function} */
		rendererFunction: (function() {
			var defaultRenderer = CarouselRenderer.extend({
					className: "carousel-item default-renderer"
				}),
				emptyRenderer = CarouselRenderer.extend({
					className: "carousel-item empty-renderer"
				});
			return function(item, index, arr) {
				return (index === -1) ? emptyRenderer : defaultRenderer;
			};
		})(),
	},
};
Carousel.validOptions = _.keys(Carousel.defaults);

/**
/* @constructor
/* @type {module:app/view/component/Carousel}
/*/
var CarouselProto = {

	/** @override */
	cidPrefix: "carousel",
	/** @override */
	tagName: "div",
	/** @override */
	className: "carousel skip-transitions",

	/* --------------------------- *
	/* properties
	/* --------------------------- */

	properties: {
		scrolling: {
			get: function() {
				return this._scrolling;
			}
		},
		selectedItem: {
			get: function() {
				return this._selectedView.model;
			},
			set: function(value) {
				if (value)
					this._onSelectOne(value)
				else
					this._onSelectNone();
			}
		},
	},

	events: {
		// "mousedown": "_onMouseDown", "mouseup": "_onMouseUp",
		"transitionend .carousel-item.selected": "_onScrollTransitionEnd",
	},

	/** @override */
	initialize: function(options) {
		_.bindAll(this, "_onTouchEvent");

		this.itemViews = new Container();
		this.metrics = {};

		_.extend(this, _.defaults(_.pick(options, Carousel.validOptions), Carousel.defaults));

		// this.childGap = 0; //this.dirProp(20, 18);
		this._precedingDir = (Hammer.DIRECTION_LEFT | Hammer.DIRECTION_UP) & this.direction;
		this._followingDir = (Hammer.DIRECTION_RIGHT | Hammer.DIRECTION_DOWN) & this.direction;

		// use supplied touch mgr or create private
		if (isValidTouchManager(options.touch, this.direction)) {
			this.touch = options.touch;
		} else {
			console.warn("%s::initializeHammer using private Hammer instance", this.cid);
			this.touch = createTouchManager(this.el, this.direction);
			// this.on("view:removed", this.touch.destroy, this.touch);
			this.listenTo(this, "view:removed", function() {
				this.touch.destroy();
			});
		}

		/* create children and props */
		this.setEnabled(true);
		this.skipTransitions = true;
		this._renderFlags = View.CHILDREN_INVALID;
		// this.invalidateChildren();

		this.listenTo(this, "view:attached", function() {
			this.skipTransitions = true;
			// this.invalidateSize();
			// this.renderNow();
			// this.requestRender();
			this.requestRender(View.SIZE_INVALID | View.LAYOUT_INVALID);
		});

		/* collection listeners */
		this.listenTo(this.collection, {
			"reset": this._onReset,
			"select:one": this._onSelectOne,
			"select:none": this._onSelectNone,
			"deselect:one": this._onDeselectAny,
			"deselect:none": this._onDeselectAny,
		});
	},
	/* --------------------------- *
	/* Hammer init
	/* --------------------------- */

	// validateTouchManager: function(touch, direction) {
	// 	try {
	// 		return touch.get("pan").options.direction === direction);
	// 	} catch (err) {
	// 		return false;
	// 	}
	// },

	// initializeHammer: function(options) {
	// 	// direction from opts/defaults
	// 	if (options.direction === VERTICAL) {
	// 		this.direction = VERTICAL;
	// 	} // do nothing: the default is horizontal
	//
	// 	// validate hammer instance or create local
	// 	if ((touch = options.touch) && (pan = touch.get("pan"))) {
	// 		// Override direction only if specific
	// 		if (pan.options.direction !== Hammer.DIRECTION_ALL) {
	// 			this.direction = pan.options.direction;
	// 		}
	// 		this.panThreshold = pan.options.threshold;
	// 	} else {
	// 		console.warn("%s::initializeHammer using private Hammer instance", this.cid);
	// 		touch = createHammerInstance(this.el, this.panThreshold, this.direction);
	// 		this.on("view:removed", touch.destroy, touch);
	// 	}
	// 	this.touch = touch;
	// },

	remove: function() {
		// this._scrollPendingAction && this._scrollPendingAction(true);
		// if (this._enabled) {
		// 	this.touch.off("tap", this._onTap);
		// 	this.touch.off("hpanstart hpanmove hpanend hpancancel", this._onPan);
		// }
		this._toggleTouchEvents(false);
		this.removeChildren();
		View.prototype.remove.apply(this, arguments);
		return this;
	},


	/* --------------------------- *
	/* helper functions
	/* --------------------------- */

	dirProp: function(hProp, vProp) {
		return (this.direction & HORIZONTAL) ? hProp : vProp;
	},

	/* --------------------------- *
	/* Render
	/* --------------------------- */

	// render: function() {
	// 	if (this.attached) {
	// 		this.skipTransitions = true;
	// 		// this.invalidateSize();
	// 		this.renderNow(true);
	// 	}
	// },

	// /** @override */
	// render: function () {
	// 	if (!this.attached) {
	// 		if (!this._renderPending) {
	// 			this._renderPending = true;
	// 			this.listenTo(this, "view:attached", this.render);
	// 		}
	// 	} else {
	// 		if (this._renderPending) {
	// 			this._renderPending = false;
	// 			this.stopListening(this, "view:attached", this.render);
	// 		}
	// 		this._delta = 0;
	// 		this.skipTransitions = true;
	// 		this.invalidateSize();
	// 		// this.invalidateLayout();
	// 		this.renderNow();
	// 	}
	// 	return this;
	// },

	// render: function () {
	// 	this.measureLater();
	// 	this.scrollBy(0, Carousel.IMMEDIATE);
	//
	// 	if (this.el.parentElement) {
	// 		this.renderNow();
	// 	}
	// 	return this;
	// },

	/** @override */
	renderFrame: function(tstamp, flags) {
		if (flags & View.CHILDREN_INVALID) {
			this._createChildren();
			// clear this flag now: render may be deferred until attached
			flags &= ~View.CHILDREN_INVALID;
		}
		if (this.attached) {
			if (flags & View.SIZE_INVALID) {
				this._measure();
			}
			if (flags & (View.LAYOUT_INVALID | View.SIZE_INVALID)) {
				this._scrollBy(this._delta, this.skipTransitions);
			}
		} else if (flags) {
			this.listenToOnce(this, "view:attached", function() {
				this.requestRender(flags);
			});
		}
	},

	/* --------------------------- *
	/* enabled
	/* --------------------------- */

	/** @override */
	_enabled: undefined,

	/** @override */
	setEnabled: function(enabled) {
		if (this._enabled !== enabled) {
			this._enabled = enabled;
			// toggle events immediately
			this._toggleTouchEvents(enabled);
			// dom manipulation on render (_renderEnabled)
			// this._renderFlags |= View.STYLES_INVALID;
			// this.requestRender();

			this.el.classList.toggle("disabled", !this.enabled);
			this.itemViews.each(function(view) {
				view.setEnabled(this.enabled);
			}, this);
		}
	},

	_renderEnabled: function() {
		this.el.classList.toggle("disabled", !this.enabled);
		this.itemViews.each(function(view) {
			view.setEnabled(this.enabled);
		}, this);
	},

	/* --------------------------- *
	/* Create children
	/* --------------------------- */

	_createChildren: function() {
		// var sIndex;
		var buffer, renderer, view, viewOpts;

		this.removeChildren();

		if (this.collection.length) {
			viewOpts = {
				// viewDepth: this.viewDepth + 1,
				// parentView: this,
				enabled: this.enabled
			};
			buffer = document.createDocumentFragment();
			// buffer = this.el;

			if (!this.requireSelection) {
				renderer = this.rendererFunction(null, -1, this.collection);
				view = new renderer(viewOpts);
				this.itemViews.add(view);
				buffer.appendChild(view.el);
				this.emptyView = view;
			}

			this.collection.each(function(item, index, arr) {
				viewOpts.model = item;
				renderer = this.rendererFunction(item, index, arr);
				view = new renderer(viewOpts);
				this.itemViews.add(view);
				buffer.appendChild(view.el);
			}, this);

			// if (!this.requireSelection) {
			// 	buffer = this.appendItemView(buffer, this.model, -1, this.collection);
			// 	this.emptyView = this.itemViews.first();
			// }
			// buffer = this.collection.reduce(this.appendItemView, buffer, this);

			this.adjustToSelection();
			this._selectedView.el.classList.add("selected");

			this.el.appendChild(buffer);
		}
	},

	// appendItemView: function (parentEl, model, index, arr) {
	// 	var renderer = this.rendererFunction(model, index, arr);
	// 	var view = new renderer({
	// 		model: model,
	// 		parentView: this,
	// 		enabled: this.enabled
	// 	});
	// 	this.itemViews.add(view);
	// 	parentEl.appendChild(view.el);
	// 	return parentEl;
	// },

	// createItemView: function (renderer, opts) {
	// 	var view = new renderer(opts);
	// 	this.itemViews.add(view);
	// 	return view;
	// },

	removeChildren: function() {
		this.itemViews.each(this.removeItemView, this);
		this.emptyView = void 0;
	},

	removeItemView: function(view) {
		this.itemViews.remove(view);
		view.remove();
		return view;
	},

	/* --------------------------- *
	/* measure
	/* --------------------------- */

	_measure: function() {
		var m, mm;
		var pos = 0,
			posInner = 0;
		var maxAcross = 0,
			maxOuter = 0;
		var maxOuterView, maxAcrossView;

		maxOuterView = maxAcrossView = this.emptyView || this.itemViews.first();

		// chidren metrics
		this.itemViews.each(function(view) {
			view.render();
		});

		this.itemViews.each(function(view) {
			m = this.measureItemView(view);
			m.pos = pos;
			pos += m.outer; // + this.childGap;
			m.posInner = posInner;
			posInner += m.inner; //+ this.childGap;
			if (view !== this.emptyView) {
				if (m.across > maxAcross) {
					maxAcross = m.across;
					maxAcrossView = view;
				}
				if (m.outer > maxOuter) {
					maxOuter = m.outer;
					maxOuterView = view;
				}
			}
		}, this);

		// measure self + max child metrics
		mm = this.metrics[this.cid] || (this.metrics[this.cid] = {});
		mm.outer = this.el[this.dirProp("offsetWidth", "offsetHeight")];
		mm.before = maxOuterView.el[this.dirProp("offsetLeft", "offsetTop")];
		mm.inner = maxOuterView.el[this.dirProp("offsetWidth", "offsetHeight")];
		mm.after = mm.outer - (mm.inner + mm.before);
		mm.across = maxAcross;

		// m = this.metrics[maxOuterView.cid];
		// mm.inner = m.inner;

		// tap area
		this._tapAcrossBefore = maxAcrossView.el[this.dirProp("offsetTop", "offsetLeft")];
		this._tapAcrossAfter = this._tapAcrossBefore + maxAcross;
		this._tapBefore = mm.before + this._tapGrow;
		this._tapAfter = mm.before + mm.inner - this._tapGrow;

		this.selectThreshold = Math.min(MAX_SELECT_THRESHOLD, mm.outer * 0.1);
	},

	measureItemView: function(view) {
		var m, viewEl;
		// var s, sizeEl;

		viewEl = view.el;
		m = this.metrics[view.cid] || (this.metrics[view.cid] = {});

		m.outer = viewEl[this.dirProp("offsetWidth", "offsetHeight")];
		m.across = viewEl[this.dirProp("offsetHeight", "offsetWidth")];

		if (view.metrics) {
			m.before = view.metrics[this.dirProp("marginLeft", "marginTop")];
			m.outer += m.before;
			m.outer += view.metrics[this.dirProp("marginRight", "marginBottom")];
			m.inner = view.metrics.content[this.dirProp("width", "height")];
			m.before += view.metrics.content[this.dirProp("x", "y")];
			m.after = m.outer - (m.inner + m.before);

			// var marginBefore = view.metrics[this.dirProp("marginLeft","marginTop")];
			// var marginAfter = view.metrics[this.dirProp("marginRight","marginBottom")];
			// var pos = view.metrics.content[this.dirProp("x","y")];
			//
			// m.inner = view.metrics.content[this.dirProp("width","height")];
			// m.before = marginBefore + pos;
			// m.outer += marginBefore + marginAfter;
			// m.after = m.outer - (m.inner + m.before);
		} else {
			// throw new Error("renderer has no metrics");
			console.warn("%s::measureItemView view '%s' has no metrics", this.cid, view.cid);
			m.inner = m.outer;
			m.after = m.before = 0;
		}

		return m;
	},

	/* --------------------------- *
	/* scrolling property
	/* --------------------------- */

	_delta: 0,

	_scrolling: false,

	_setScrolling: function(scrolling) {
		// console.warn("_setScrolling current/requested", this._scrolling, scrolling);
		if (this._scrolling != scrolling) {
			this._scrolling = scrolling;
			this.el.classList.toggle("scrolling", scrolling);
			this.trigger(scrolling ? "view:scrollstart" : "view:scrollend");
		}
	},

	/* --------------------------- *
	/* Scroll/layout
	/* --------------------------- */

	scrollBy: function(delta, skipTransitions) {
		this._delta = delta || 0;
		this.skipTransitions = !!skipTransitions;
		// this.invalidateLayout();
		this.requestRender(View.LAYOUT_INVALID);
	},

	_scrollBy: function(delta, skipTransitions) {
		var sMetrics, metrics, pos;

		sMetrics = this.metrics[(this._scrollCandidateView || this._selectedView).cid];
		this.itemViews.each(function(view) {
			metrics = this.metrics[view.cid];
			pos = Math.floor(this._getScrollOffset(delta, metrics, sMetrics));
			view.metrics.translateX = (this.direction & HORIZONTAL) ? pos : 0;
			view.metrics.translateY = (this.direction & HORIZONTAL) ? 0 : pos;
			view.metrics._transform = translateTemplate(view.metrics.translateX, view.metrics.translateY);
			view.el.style[transformProperty] = view.metrics._transform;
			// view.el.style[transformProperty] = (this.direction & HORIZONTAL)?
			// 	"translate3d(" + pos + "px,0,0)":
			// 	"translate3d(0," + pos + "px,0)";
		}, this);

		this.el.classList.toggle("skip-transitions", skipTransitions);
		this.selectFromView();
	},

	_getScrollOffset: function(delta, mCurr, mSel) {
		var pos, offset = 0;

		pos = mCurr.pos - mSel.pos + delta;
		if (pos < 0) {
			if (Math.abs(pos) < mCurr.outer) {
				offset += (-mCurr.after) / mCurr.outer * pos;
			} else {
				offset += mCurr.after;
			}
		} else
		if (0 <= pos) {
			if (Math.abs(pos) < mCurr.outer) {
				offset -= mCurr.before / mCurr.outer * pos;
			} else {
				offset -= mCurr.before;
			}
		}
		return pos + offset;
	},

	_onScrollTransitionEnd: function(ev) {
		if (ev.propertyName === transformStyleName && this.scrolling) {
			console.log("%s::_onScrollTransitionEnd selected: %s", this.cid, ev.target.cid);
			this._setScrolling(false);
		}
	},

	/* --------------------------- *
	/* toggle touch events
	/* --------------------------- */

	_toggleTouchEvents: function(enable) {
		// console.log("%s::_toggleTouchEvents", this.cid, enable);
		if (this._touchEventsEnabled !== enable) {
			this._touchEventsEnabled = enable;
			if (enable) {
				this.touch.on("hpanstart hpanmove hpanend hpancancel tap", this._onTouchEvent);
			} else {
				this.touch.off("hpanstart hpanmove hpanend hpancancel tap", this._onTouchEvent);
			}
		}
	},

	_onTouchEvent: function(ev) {
		// console.log("%s::_onTouchEvent", this.cid, ev.type);
		switch (ev.type) {
			case "tap":
				return this._onTap(ev);
			case "hpanstart":
				return this._onPanStart(ev);
			case "hpanmove":
				return this._onPanMove(ev);
			case "hpanend":
				return this._onPanFinal(ev);
			case "hpancancel":
				return this._onPanFinal(ev);
		}
	},

	/* --------------------------- *
	/* touch event: pan
	/* --------------------------- */

	// _panCapturedOffset: 0,

	/** @param {Object} ev */
	_onPanStart: function(ev) {
		this.selectFromView();
		this.el.classList.add("panning");
		this._setScrolling(true);
	},

	/** @param {Object} ev */
	_onPanMove: function(ev) {
		var view = this.getViewAtPanDir(ev.offsetDirection);
		var delta = (this.direction & HORIZONTAL) ? ev.thresholdDeltaX : ev.thresholdDeltaY;
		// var delta = (this.direction & HORIZONTAL) ? ev.deltaX : ev.deltaY;

		if (this._panCandidateView !== view) {
			this._panCandidateView && this._panCandidateView.el.classList.remove("candidate");
			this._panCandidateView = view;
			this._panCandidateView && this._panCandidateView.el.classList.add("candidate");
		}
		if (this._panCandidateView === void 0) {
			delta *= Globals.HPAN_OUT_DRAG;
		}

		if (this._renderRafId !== -1) {
			this.scrollBy(delta, Carousel.IMMEDIATE);
			this.renderNow();
		} else {
			this._scrollBy(delta, Carousel.IMMEDIATE);
		}
	},

	/** @param {Object} ev */
	_onPanFinal: function(ev) {
		var scrollCandidate;
		// NOTE: this delta is used for determining selection, NOT for layout
		var delta = (this.direction & HORIZONTAL) ? ev.thresholdDeltaX : ev.thresholdDeltaY;
		// var delta = (this.direction & HORIZONTAL) ? ev.deltaX : ev.deltaY;

		if ((ev.type == "hpanend")
			/* pan direction (current event) and offsetDirection (whole gesture) must match */
			&& (ev.direction ^ ev.offsetDirection ^ this.direction)
			// && (ev.direction & ev.offsetDirection & this.direction)
			/* gesture must overshoot selectThreshold */
			&& (Math.abs(delta) > this.selectThreshold)) {
			/* choose next scroll target */
			scrollCandidate = this.getViewAtPanDir(ev.offsetDirection);
		}
		this._scrollCandidateView = scrollCandidate || void 0;

		if (this._panCandidateView && (this._panCandidateView !== scrollCandidate)) {
			this._panCandidateView.el.classList.remove("candidate");
		}
		this._panCandidateView = void 0;
		this.el.classList.remove("panning");

		this.scrollBy(0, Carousel.ANIMATED);
		this.selectFromView();

		// if (this._renderRafId !== -1) {
		// 	this.scrollBy(0, Carousel.ANIMATED);
		// 	this.renderNow();
		// } else {
		// 	this._scrollBy(0, Carousel.ANIMATED);
		// }
	},

	/* --------------------------- *
	/* touch event: tap
	/* --------------------------- */

	getViewAtPanDir: function(dir) {
		// return (dir & this._precedingDir) ? this._precedingView : this._followingView;
		return (dir & this._followingDir) ? this._precedingView : this._followingView;
	},

	/** @type {int} In pixels */
	_tapGrow: 10,

	getViewAtTapPos: function(pos, posAcross) {
		if (this._tapAcrossBefore < posAcross && posAcross < this._tapAcrossAfter) {
			if (pos < this._tapBefore) {
				return this._precedingView;
			} else if (pos > this._tapAfter) {
				return this._followingView;
			}
		}
		return void 0;
	},

	_onTap: function(ev) {
		var targetView = View.findByDescendant(ev.target);
		// if (!this.itemViews.contains(targetView)) {
		// 	return;
		// }
		do {
			if (this._selectedView === targetView) {
				// console.log("%s tap ocurred on selected: %o", this.cid, targetView);
				return;
			} else if (this === targetView) {
				// console.log("%s tap ocurred on carousel: %o", this.cid, targetView);
				break;
			}
		} while ((targetView = targetView.parentView))

		// this.selectFromView();

		var bounds = this.el.getBoundingClientRect();
		var tapX = ev.center.x - bounds.left;
		var tapY = ev.center.y - bounds.top;
		var tapCandidate = this.getViewAtTapPos(
			this.dirProp(tapX, tapY),
			this.dirProp(tapY, tapX)
		);

		if (tapCandidate) {
			console.log("%s::_onTap %o", this.cid, ev);
			ev.preventDefault();
			// ev.stopPropagation();

			// this._scrollCandidateView = tapCandidate;
			// this._setScrolling(true);
			// this.scrollBy(0, Carousel.ANIMATED);
			// this._scrollCandidateView.el.classList.add("candidate");
			// this.selectFromView();

			//// NOT using internalSelection
			// this.triggerSelectionEvents(tapCandidate, false);

			// using internalSelection
			this._scrollCandidateView = tapCandidate;
			this._setScrolling(true);
			this.scrollBy(0, Carousel.ANIMATED);

			this.triggerSelectionEvents(tapCandidate, true);
			// this.renderNow();
		}
	},

	/* --------------------------- *
	/* Private
	/* --------------------------- */

	triggerSelectionEvents: function(view, internal) {
		if (view === void 0 || this._internalSelection) {
			return;
		}

		this._internalSelection = !!internal;
		if (view === this.emptyView) {
			this.trigger("view:select:none");
		} else {
			this.trigger("view:select:one", view.model);
		}
		this._internalSelection = false;
	},

	selectFromView: function() {
		if (this._scrollCandidateView === void 0) {
			return;
		}
		var view = this._scrollCandidateView;
		this._scrollCandidateView = void 0;
		view.el.classList.remove("candidate");

		this.triggerSelectionEvents(view, true);
	},

	adjustToSelection: function() {
		var m, i = this.collection.selectedIndex;
		// assume -1 < index < this.collection.length
		if (this.requireSelection) {
			(i == -1) && i++; // if selection is null (index -1), set _selectedView to first item (index 0)
			this._selectedView = (m = this.collection.at(i)) && this.itemViews.findByModel(m);
			this._precedingView = (m = this.collection.at(i - 1)) && this.itemViews.findByModel(m);
			this._followingView = (m = this.collection.at(i + 1)) && this.itemViews.findByModel(m);
		} else {
			this._selectedView = (m = this.collection.at(i)) ? this.itemViews.findByModel(m) : this.emptyView;
			this._precedingView = m && ((m = this.collection.at(i - 1)) ? this.itemViews.findByModel(m) : this.emptyView);
			this._followingView = (m = this.collection.at(i + 1)) && this.itemViews.findByModel(m);
		}
	},

	/* --------------------------- *
	/* Model listeners
	/* --------------------------- */

	/** @private */
	_onSelectOne: function(model) {
		if (model === this._selectedView.model) {
			// console.info("INTERNAL");
			return;
		}
		this._onSelectAny(model);
	},

	/** @private */
	_onSelectNone: function() {
		if ((this.requireSelection ? this.itemViews.first() : this.emptyView) === this._selectedView) {
			// console.info("INTERNAL");
			return;
		}
		this._onSelectAny();
	},

	/** @private */
	_onSelectAny: function(model) {
		this._selectedView.el.classList.remove("selected");
		this.adjustToSelection();
		this._selectedView.el.classList.add("selected");

		if (!this._internalSelection) {
			this._setScrolling(true);
			this.scrollBy(0, Carousel.ANIMATED);
		}
	},

	// _onDeselectAny: function (model) {},

	/** @private */
	_onReset: function() {
		// this._createChildren();
		// this.invalidateChildren();
		this.requestRender(View.CHILDREN_INVALID | View.MODEL_INVALID);
	},


	/* --------------------------- *
	/* TEMP
	/* --------------------------- */

	// _scrollBy2: function (delta, skipTransitions) {
	// 	var metrics, pos;
	// 	var sMetrics = this.metrics[(this._scrollCandidateView || this._selectedView).cid];
	// 	var cMetrics = this.metrics[(this._panCandidateView || this._selectedView).cid];
	//
	// 	this.itemViews.each(function (view) {
	// 		metrics = this.metrics[view.cid];
	// 		pos = Math.floor(this._getScrollOffset(delta, metrics, sMetrics, cMetrics));
	// 		view.el.style[transformProperty] = (this.direction & HORIZONTAL)?
	// 				"translate3d(" + pos + "px,0,0)" : "translate3d(0," + pos + "px,0)";
	// 				// "translate(" + pos + "px,0)" : "translate(0," + pos + "px)";
	// 				// "translateX(" + pos + "px)" : "translateY(" + pos + "px)";
	// 	}, this);
	// 	this.el.classList.toggle("skip-transitions", skipTransitions);
	// 	this.selectFromView();
	// },

	// _getScrollOffset2: function (delta, mCurr, mSel, mCan) {
	// 	var offset = 0;
	// 	var posInner = mCurr.posInner - mSel.posInner + delta;
	//
	// 	if (posInner < -mSel.inner) {
	// 		offset = -(mCurr.before);
	// 	} else if (posInner > mSel.inner) {
	// 		offset = (mSel.after);
	// 	} else {
	// 		if (posInner < 0) {
	// 			offset = (mCurr.before) / (mCurr.inner) * posInner;
	// 		} else {
	// 			offset = (mSel.after) / (mCan.inner) * posInner;
	// 		}
	// 	}
	// 	return posInner + offset;
	// },

	// captureSelectedOffset: function() {
	// 	var val, view, cssval, m, mm;
	//
	// 	val = 0;
	// 	view = this._scrollCandidateView || this._selectedView;
	// 	cssval = getComputedStyle(view.el)[transformProperty];
	//
	// 	mm = cssval.match(/(matrix|matrix3d)\(([^\)]+)\)/);
	// 	if (mm) {
	// 		m = mm[2].split(",");
	// 		if (this.direction & HORIZONTAL) {
	// 			val = m[mm[1]=="matrix"? 4 : 12];
	// 		} else {
	// 			val = m[mm[1]=="matrix"? 5 : 13];
	// 		}
	// 		val = parseFloat(val);
	// 	}
	//
	// 	console.log("%s::captureSelectedOffset", this.cid, cssval, val, cssval.match(/matrix\((?:\d\,){3}(\d)\,(\d)|matrix3d\((?:\d\,){11}(\d)\,(\d)/));
	//
	// 	return val;
	// },

	// _onScrollEnd: function(exec) {
	// 	this._scrollEndCancellable = void 0;
	// 	// this.el.classList.remove("disabled-changing");
	// 	if (exec) {
	// 		this._setScrolling(false);
	// 		// this.el.classList.remove("scrolling");
	// 		// this.trigger("view:scrollend");
	// 		console.log("%s::_onScrollEnd", this.cid);
	// 	}
	// },
	// _onMouseDown: function(ev) {
	// 	if (this._scrolling) {
	// 		this._panCapturedOffset = this.captureSelectedOffset();
	// 		console.log("%s::events[mousedown] scrolling interrupted (pos %f)", this.cid, this._panCapturedOffset);
	// 	}
	// },
	// _onMouseUp:function(ev) {
	// 	this._panCapturedOffset = 0;
	// },

};

module.exports = Carousel = View.extend(CarouselProto, Carousel);
},{"app/control/Globals":34,"app/view/base/View":58,"app/view/render/CarouselRenderer":81,"backbone.babysitter":"backbone.babysitter","hammerjs":"hammerjs","underscore":"underscore","utils/prefixedProperty":113,"utils/prefixedStyleName":114}],64:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"id","hash":{},"data":data}) : helper)));
},"useData":true});

},{"hbsfy/runtime":21}],65:[function(require,module,exports){
/**
 * @module app/view/component/CollectionStack
 */

// /** @type {module:underscore} */
// var _ = require("underscore");
// /** @type {module:backbone} */
// var Backbone = require("backbone");

// /** @type {module:app/control/Globals} */
// var Globals = require("app/control/Globals");
/** @type {module:app/view/base/View} */
var View = require("app/view/base/View");
// /** @type {Function} */
// var transitionEnd = require("utils/event/transitionEnd");
/** @type {Function} */
var setImmediate = require("utils/setImmediate");

/** @type {string} */
var viewTemplate = require("./CollectionStack.hbs");

/**
 * @constructor
 * @type {module:app/component/CollectionStack}
 */
module.exports = View.extend({

	/** @override */
	cidPrefix: "stack",
	/** @override */
	tagName: "div",
	/** @override */
	className: "stack",
	/** @override */
	template: viewTemplate,

	events: {
		"transitionend": function(ev) {
			// console.log("%s::transitionend [invalid: %s] [transition: %s]", this.cid, this._contentInvalid, (this._skipTransitions? "skip": "run"), ev.target.id, ev.target.className);
			this._renderContent();
		}
	},

	initialize: function(options) {
		this._enabled = true;
		this._skipTransitions = true;
		this._contentInvalid = true;

		options.template && (this.template = options.template);
		this.content = document.createElement("div");
		this.content.className = "stack-item";
		this.el.appendChild(this.content);

		this.listenTo(this.collection, "select:one select:none", this._onSelectChange);
	},

	setEnabled: function(enabled) {
		if (this._enabled !== enabled) {
			this._enabled = enabled;
			this.el.classList.toggle("disabled", !this._enabled);
		}
	},

	_onSelectChange: function(item) {
		if (this._renderedItem === this.collection.selected) {
			throw new Error("change event received but item is identical");
		}
		this._renderedItem = this.collection.selected;

		this._contentInvalid = true;
		this.render();
	},

	/* --------------------------- *
	/* render
	/* --------------------------- */

	render: function() {
		if (this._skipTransitions) {
			// execute even if content has not changed to apply styles immediately
			this._skipTransitions = false;
			this.el.classList.add("skip-transitions");
			setImmediate(function() {
				this.el.classList.remove("skip-transitions");
			}.bind(this));

			// render changed content immediately
			if (this._contentInvalid) {
				this._renderContent();
			}
		} else {
			// else remove 'current' class and render on transitionend
			if (this._contentInvalid) {
				this.content.classList.remove("current");
				// this.content.className = "stack-item";
			}
		}
		return this;
	},

	_renderContent: function() {
		if (this._contentInvalid) {
			this._contentInvalid = false;
			var item = this.collection.selected;
			this.content.innerHTML = item ? this.template(item.toJSON()) : "";
			this.content.classList.add("current");
			// this.content.className = "stack-item current";
		}
	},
});

},{"./CollectionStack.hbs":64,"app/view/base/View":58,"utils/setImmediate":116}],66:[function(require,module,exports){
(function (DEBUG){
/**
/* @module app/view/component/FilterableListView
/*/

/** @type {module:underscore} */
var _ = require("underscore");
// /** @type {module:backbone} */
// var Backbone = require("backbone");
/** @type {module:backbone.babysitter} */
var Container = require("backbone.babysitter");

/** @type {module:app/view/base/View} */
var View = require("app/view/base/View");
/** @type {module:app/view/component/ClickableRenderer} */
var ClickableRenderer = require("app/view/render/ClickableRenderer");
/** @type {module:utils/prefixedProperty} */
var prefixedProperty = require("utils/prefixedProperty");
/** @type {module:utils/css/getBoxEdgeStyles} */
var getBoxEdgeStyles = require("utils/css/getBoxEdgeStyles");

var diff = function(a1, a2, dest) {
	return a1.reduce(function(res, o, i, a) {
		if (a2.indexOf(o) == -1) res.push(o);
		return res;
	}, dest || []);
};

/** @type {module:app/control/Globals.TRANSLATE_TEMPLATE} */
var translateCssValue = require("app/control/Globals").TRANSLATE_TEMPLATE;

/** @const */
var transformProp = prefixedProperty("transform");

/**
/* @constructor
/* @type {module:app/view/component/FilterableListView}
/*/
var FilterableListView = View.extend({

	/** @type {string} */
	cidPrefix: "filterableList",
	/** @override */
	tagName: "ul",
	/** @override */
	className: "list selectable filterable",

	/** @override */
	defaults: {
		collapsed: true,
		filterFn: function() {
			return true;
		},
		renderer: ClickableRenderer.extend({
			/** @override */
			cidPrefix: "listItem",
		}),
	},

	/** @override */
	properties: {
		collapsed: {
			get: function() {
				return this._collapsed;
			},
			set: function(value) {
				this._setCollapsed(value);
			}
		},
		selectedItem: {
			get: function() {
				return this._selectedItem;
			},
			set: function(value) {
				this._setSelection(value);
			}
		},
		filteredItems: {
			get: function() {
				return this._filteredItems;
			}
		}
	},

	/** @override */
	events: {
		"transitionend .list-item": function(ev) {
			if (this._collapsedTransitioning && ev.propertyName === "visibility" /*&& this.el.classList.contains("collapsed-changed")*/ ) {
				this._collapsedTransitioning = false;
				this.el.classList.remove("collapsed-changed");
				console.log("%s::events[transitionend .list-item] collapsed-changed end", this.cid);
			}
		},
	},

	/** @override */
	initialize: function(options) {
		this._metrics = {};
		this._itemMetrics = [];
		this.itemViews = new Container();

		_.defaults(options, this.defaults);
		this.renderer = options.renderer;
		this._filterFn = options.filterFn;
		this._filteredItems = [];

		this.collection.each(this.createItemView, this);
		this.refresh();
		this._setSelection(this.collection.selected);
		this._setCollapsed(options.collapsed);

		// will trigger on return if this.el is already attached
		// this.skipTransitions = true;
		this.listenTo(this, "view:attached", function() {
			this.skipTransitions = true;
			this.requestRender(View.SIZE_INVALID | View.LAYOUT_INVALID); //.renderNow();
		});

		// this.listenTo(this.collection, "select:one select:none", this._setSelection);
		this.listenTo(this.collection, "reset", function() {
			this._allItems = null;
			throw new Error("not implemented");
		});
	},

	/* --------------------------- *
	/* Render
	/* --------------------------- */

	/** @override */
	renderFrame: function(tstamp, flags) {
		if (DEBUG) {
			var changed = [];
			this._collapsedChanged && changed.push("collapsed");
			this._selectionChanged && changed.push("selection");
			this._filterChanged && changed.push("filter");
			console.log("%s::renderFrame [%s]", this.cid, changed.join(" "));
		}

		// collapsed transition flag
		if (this._collapsedTransitioning) {
			console.warn("%s::renderFrame collapsed tx interrupted", this.cid);
		}

		this._collapsedTransitioning = !this.skipTransitions && this._collapsedChanged;

		// this.el.classList.toggle("animate", !this.skipTransitions);
		this.el.classList.toggle("collapsed-changed", this._collapsedTransitioning);
		this.el.classList.toggle("skip-transitions", this.skipTransitions);
		if (this.skipTransitions) {
			this.skipTransitions = false;
			// Invalidate again after frame render loop to reapply transforms:
			// that should kill any running transitions.
			this.setImmediate(function() {
				this.requestRender(View.LAYOUT_INVALID);
			});
		}
		if (this._collapsedChanged) {
			flags |= (View.SIZE_INVALID);
			this.el.classList.toggle("collapsed", this._collapsed);
		}
		if (this._selectionChanged) {
			flags |= View.LAYOUT_INVALID;
			this.renderSelection(this.collection.selected, this.collection.lastSelected);
		}
		if (this._filterChanged) {
			flags |= View.LAYOUT_INVALID;
			this.renderFilterFn();
		}
		if (flags & View.SIZE_INVALID) {
			this.measure();
		}
		if (flags & (View.LAYOUT_INVALID | View.SIZE_INVALID)) {
			this.renderLayout();
		}
		this._collapsedChanged = this._selectionChanged = this._filterChanged = false;
	},

	measure: function() {
		// var i, ii, el, els, m, mm;
		// els = this.el.children;
		// ii = els.length;
		// mm = this._itemMetrics;
		// for (i = 0; i < ii; i++) {
		// 	mm[i] = _.pick(els[i], "offsetTop", "offsetHeight");
		// }

		this._metrics = getBoxEdgeStyles(this.el, this._metrics);

		// var itemEl, itemView, baseline = 0;
		// if (itemEl = this.el.querySelector(".list-item:not(.excluded) .label")) {
		// 	// itemView = this.itemViews.findByCid(itemEl.cid);
		// 	var elA = itemEl, elB = itemEl.parentElement;
		// 	var yA = elA.offsetTop,
		// 		hA = elA.offsetHeight,
		// 		yB = elB.offsetTop,
		// 		hB = elB.offsetHeight;
		// 	baseline = ((yA + hA) - (yB + hB));
		// 	console.log("%s::measure fontSize: %spx (%s+%s)-(%s+%s)=%s", this.cid, this._metrics.fontSize,
		// 		yA, hA, yB, hB, baseline
		// 	);
		// }

		this.itemViews.forEach(function(view) {
			if (!view._metrics) view._metrics = {};
			// view._metrics.baseline = this._metrics.fontSize - baseline;
			view._metrics.offsetTop = view.el.offsetTop;
			view._metrics.offsetHeight = view.el.offsetHeight;
			view._metrics.offsetLeft = view.el.offsetLeft;
			view._metrics.offsetWidth = view.el.offsetWidth;
			if (!this._collapsed && view.label) {
				view._metrics.textLeft = view.label.offsetLeft;
				view._metrics.textWidth = view.label.offsetWidth;
			} else {
				view._metrics.textLeft = view._metrics.offsetLeft;
				view._metrics.textWidth = view._metrics.offsetWidth;
			}
		}, this);

		// this._metrics.baseline = this._metrics.fontSize - baseline;
	},

	renderLayout: function() {
		var posX, posY;
		posX = this._metrics.paddingLeft;
		posY = this._metrics.paddingTop;

		for (var i = 0, ii = this.el.children.length; i < ii; i++) {
			var view = this.itemViews.findByCid(this.el.children[i].cid);
			if (((this.collection.selected && !view.model.selected) ||
					view.el.classList.contains("excluded")) && this._collapsed) {
				view.transform.tx = posX;
				view.transform.ty = posY;
			} else {
				if (view._metrics.offsetHeight == 0)
					posY -= view._metrics.offsetTop;
				view.transform.tx = posX;
				view.transform.ty = posY;
				posY += view._metrics.offsetHeight + view._metrics.offsetTop;
			}
			view.el.style[transformProp] = translateCssValue(view.transform.tx, view.transform.ty);
		}

		// posY += this._metrics.paddingBottom;
		this._metrics.height = Math.max(0, posY + this._metrics.paddingBottom);
		this.el.style.height = this._metrics.height + "px";
		// this.el.style.height = (posY > 0) ? posY + "px" : "";
	},

	/* --------------------------- *
	/* Child views
	/* --------------------------- */

	/** @private */
	createItemView: function(item, index) {
		var view = new this.renderer({
			model: item,
			el: this.el.querySelector(".list-item[data-id=\"" + item.id + "\"]")
		});
		item.set("excluded", false, { silent: true });
		this.listenTo(view, "renderer:click", this._onRendererClick);
		view.listenTo(item, "change:excluded", function(item, newVal) {
			// console.log(arguments);
			if (this.el.classList.contains("excluded") !== newVal) {
				console.warn("%s:[change:excluded] m:%o css: %o", this.cid, newVal, this.el.classList.contains("excluded"));
			}
			// this.el.classList.toggle("excluded", excluded);
		});
		this.itemViews.add(view);
		return view;
	},

	/** @private */
	_onRendererClick: function(item, ev) {
		if (this._collapsedTransitioning
			|| (this._collapsed && item.get("excluded"))) {
			return;
		}
		if (this.collection.selected !== item) {
			this.trigger("view:select:one", item);
		} else {
			if (ev.altKey) {
				this.trigger("view:select:none");
			} else {
				this.trigger("view:select:same", item);
			}
			// this.trigger("view:select:none");
		}
	},

	/* --------------------------- *
	/* Collapsed
	/* --------------------------- */

	/** @private */
	_collapsed: undefined,

	/**
	/* @param {Boolean}
	/*/
	_setCollapsed: function(collapsed) {
		if (collapsed !== this._collapsed) {
			this._collapsed = collapsed;
			this._collapsedChanged = true;
			this.requestRender();
		}
	},

	/* --------------------------- *
	/* Selection
	/* --------------------------- */

	/** @private */
	_selectedItem: undefined,

	/** @param {Backbone.Model|null} */
	_setSelection: function(item) {
		if (item !== this._selectedItem) {
			this._selectedItem = item;
			this._selectionChanged = true;
			this.requestRender(View.MODEL_INVALID);
		}
	},

	/** @private */
	renderSelection: function(newItem, oldItem) {
		var view;
		if (oldItem) {
			view = this.itemViews.findByModel(oldItem);
			view.el.classList.remove("selected");
			// view.label.classList.remove("color-fg");
			// view.label.classList.remove("color-reverse");
		}
		if (newItem) {
			view = this.itemViews.findByModel(newItem);
			view.el.classList.add("selected");
			// view.label.classList.add("color-fg");
			// view.label.classList.add("color-reverse");
		}
	},

	/* --------------------------- *
	/* Filter
	/* --------------------------- */

	refresh: function() {
		if (this._filterFn) {
			this._filterChanged = true;
			this.requestRender(View.MODEL_INVALID);
		}
	},

	renderFilterFn: function() {
		var items = this._filterFn ? this.collection.filter(this._filterFn, this) : this._getAllItems();
		this.renderFilters(items, this._filteredItems);
		this._filteredItems = items;
	},

	renderFilters: function(newItems, oldItems) {
		var hasNew = !!(newItems && newItems.length);
		var hasOld = !!(oldItems && oldItems.length);

		// console.log("%s::renderFilterFn", this.cid, newItems);

		if (hasNew) {
			diff((hasOld ? oldItems : this._getAllItems()), newItems).forEach(function(item) {
				this.itemViews.findByModel(item).el.classList.add("excluded");
				item.set("excluded", true);
			}, this);
		}
		if (hasOld) {
			diff((hasNew ? newItems : this._getAllItems()), oldItems).forEach(function(item) {
				this.itemViews.findByModel(item).el.classList.remove("excluded");
				item.set("excluded", false);
			}, this);
		}
		this.el.classList.toggle("has-excluded", hasNew);
	},

	_getAllItems: function() {
		return this._allItems || (this._allItems = this.collection.slice());
	},

	/* --------------------------- *
	/* Filter 2
	/* --------------------------- */

	// computeFiltered: function() {
	// 	this._filterResult = this.collection.map(this._filterFn, this);
	// },
	//
	// renderFiltered: function() {
	// 	this.collection.forEach(function(item, index) {
	// 		this.itemViews.findByModel(item).el.classList.toggle("excluded", !this._filterResult[index]);
	// 	}, this);
	// },

});

module.exports = FilterableListView;
}).call(this,true)

},{"app/control/Globals":34,"app/view/base/View":58,"app/view/render/ClickableRenderer":82,"backbone.babysitter":"backbone.babysitter","underscore":"underscore","utils/css/getBoxEdgeStyles":107,"utils/prefixedProperty":113}],67:[function(require,module,exports){
(function (DEBUG){
/**
 * @module app/view/component/GraphView
 */

/** @type {module:underscore} */
var _ = require("underscore");

/** @type {Function} */
var Color = require("color");

/** @type {module:app/view/base/CanvasView} */
var CanvasView = require("app/view/base/CanvasView");

/** @type {module:app/control/Globals} */
var Globals = require("app/control/Globals");

/** @type {module:utils/canvas/calcArcHConnector} */
var calcArcHConnector = require("utils/canvas/calcArcHConnector");

/** @type {module:utils/canvas/CanvasHelper} */
var CanvasHelper = require("utils/canvas/CanvasHelper");

/** @type {module:utils/geom/inflateRect} */
var inflateRect = require("utils/geom/inflateRect");

/** @type {module:utils/dom/getAbsoluteClientRect} */
var getAbsoluteClientRect = require("utils/dom/getAbsoluteClientRect");


// var BEZIER_CIRCLE = 0.551915024494;
// var MIN_CANVAS_RATIO = 2;
// var PI2 = Math.PI * 2;

var styleBase = {
	lineCap: "butt", // round, butt, square
	lineWidth: 0.75,
	lineDashOffset: 0,
	setLineDash: [[]],
	radiusBase: 0.75,
	/* factored to rem unit */ //6,
	radiusIncrement: 0.21, //3, //0.25,
	/* uses lineWidth multiplier */
	outlineWidth: 1.5,
	arrowSize: 0.3
};

if (DEBUG) {
	/* eslint-disable no-unused-vars */
	var _dStyles = {};
	_dStyles["defaults"] = {
		lineWidth: 0,
		fillStyle: "transparent",
		strokeStyle: "transparent",
		lineDashOffset: 0,
		setLineDash: [[]]
	};

	/* Stroke */
	[
		"red", "salmon", "sienna",
		"green", "yellowgreen", "olive",
		"blue", "lightskyblue", "midnightblue",
		"grey", "silver"
	]
	.forEach(function(colorName) {
		var rgbaValue = Color(colorName).alpha(0.75).rgbaString();

		_dStyles[colorName] = _.defaults({
			lineWidth: 0.75,
			strokeStyle: rgbaValue
		}, _dStyles["defaults"]);

		_dStyles[colorName + "_fill"] = _.defaults({
			fillStyle: rgbaValue
		}, _dStyles["defaults"]);
	})
	/* eslint-enable no-unused-vars */
}

/**
 * @constructor
 * @type {module:app/view/component/GraphView}
 */
var GraphView = CanvasView.extend({

	/** @type {string} */
	cidPrefix: "graph",
	/** @override */
	tagName: "canvas",
	/** @override */
	className: "graph",
	// /** @override */
	// model: Backbone.Model,

	defaultKey: "amount",

	defaults: {
		values: {
			amount: 0,
			// available: 0,
			// _loop: 0,
		},
		maxValues: {
			amount: 1,
			// available: 1,
		},
		// useOpaque: true,
		// labelFn: function(value, max) {
		// 	return ((value / max) * 100) | 0;
		// },
	},

	/** @override */
	initialize: function(options) {
		CanvasView.prototype.initialize.apply(this, arguments);

		this._listA = options.listA;
		this._listB = options.listB;
		this._a2b = {
			srcView: options.listA,
			destView: options.listB,
			s: _.defaults({
				lineWidth: 1.25
				// radiusIncrement: 0.25,
			}, styleBase),
			strokeStyleFn: function(fg, bg, ln) {
				return Color(ln).mix(bg, 0.9).hexString();
				// return Color(fg).mix(bg, 0.9).hexString();
			}
		};
		this._b2a = {
			srcView: options.listB,
			destView: options.listA,
			s: _.defaults({
				lineWidth: 0.7,
				// arrowSize: 0.25,
				// radiusIncrement: 0,
				// outlineWidth: 0,
			}, styleBase),
			strokeStyleFn: function(fg, bg, ln) {
				return Color(fg).mix(bg, 0.6).hexString();
			}
		};
		this.listenTo(this, "view:render:before", this._beforeViewRender);

		var viewportChanged = function(ev) {
			// this.requestRender(CanvasView.SIZE_INVALID);
			// this.requestRender(CanvasView.LAYOUT_INVALID);
			console.log("%s:[%s]: window.scrollY:%s body.scrollTop:%s html.scrollTop:%s",
				this.cid, ev.type,
				window.scrollY,
				document.body.scrollTop,
				document.documentElement.scrollTop);
			console.log("%s:[%s]: body.scrollHeight:%s body.clientHeight:%s html.scrollHeight:%s html.clientHeight:%s",
				this.cid, ev.type,
				document.body.scrollHeight, document.body.clientHeight,
				document.documentElement.scrollHeight, document.documentElement.clientHeight);
			this._groupRects = null;
		}.bind(this);

		// viewportChanged = _.debounce(viewportChanged, 100, false);
		window.addEventListener("scroll", _.debounce(viewportChanged, 100, false), false);
		window.addEventListener("wheel", _.debounce(viewportChanged, 100, false), false);

		// this._addListListeners(this._a2b);
		// this._addListListeners(this._b2a);
	},

	// _addListListeners: function(d) {
	// 	this.listenTo(d.srcView, {
	// 		"select:one": function(model) {
	// 			this.listenToOnce(d.destView, "view:render:after",
	// 				function(view) {
	// 					d.srcItem = d.srcView.collection.selected;
	// 					d.destItems = d.destView.filteredItems;
	// 				});
	// 		},
	// 		"select:none": function() {
	// 			d.srcItem = d.destItems = null;
	// 		}
	// 	});
	// },

	/** @override */
	measureCanvas: function(w, h) {
		console.log("%s::measureCanvas style:%o offset:%o arg:%o", this.cid,
			parseInt(this.el.style.height), this.el.offsetHeight, h);
	},

	/** @override */
	updateCanvas: function() {
		this._updateMetrics();
		this._updateStyles();
	},

	/* --------------------------- *
	/* styles
	/* --------------------------- */

	_updateStyles: function() {
		var b, bgColor, lnColor;
		if (this.model.get("withBundle")) {
			b = this.model.get("bundle");
			lnColor = b.colors.lnColor.clone();
			bgColor = b.colors.bgColor.clone();
		} else {
			bgColor = Color(Globals.DEFAULT_COLORS["background-color"]);
			lnColor = Color(Globals.DEFAULT_COLORS["--link-color"]);
		}

		this._a2b.s.strokeStyle = this._a2b.s.fillStyle =
			this._a2b.strokeStyleFn(this._color, bgColor, lnColor);
		this._b2a.s.strokeStyle = this._b2a.s.fillStyle =
			this._b2a.strokeStyleFn(this._color, bgColor, lnColor)
	},

	_setStyle: function(s) {
		if (typeof s == "string") {
			s = this._styleData[s];
		}
		CanvasView.setStyle(this._ctx, s);
	},

	/* --------------------------- *
	/* metrics
	/* --------------------------- */

	_updateMetrics: function() {
		var bounds;
		var i, ii, els;
		var aRect, bRect;
		var aMin, bMin;

		this._rootFontSize = parseFloat(
			getComputedStyle(document.documentElement).fontSize);

		bounds = this.el.getBoundingClientRect();
		// bounds = getAbsoluteClientRect(this.el);
		this._ctx.setTransform(this._canvasRatio, 0, 0, this._canvasRatio,
			(-bounds.left * this._canvasRatio) - 0.5,
			(-bounds.top * this._canvasRatio) - 0.5
		);

		aRect = this._listA.el.getBoundingClientRect();
		aMin = aRect.left;
		els = this._listA.el.querySelectorAll(".label");
		for (i = 0, ii = els.length; i < ii; i++) {
			aMin = Math.max(aMin,
				els[i].getBoundingClientRect().right);
		}

		bRect = this._listB.el.getBoundingClientRect();
		bMin = bRect.left;
		els = this._listB.el.querySelectorAll(".label");
		for (i = 0, ii = els.length; i < ii; i++) {
			bMin = Math.min(bMin,
				els[i].getBoundingClientRect().left);
		}
		this._b2a.destRect = this._a2b.rect = aRect;
		this._b2a.destMinX = this._a2b.xMin = aMin;
		this._a2b.destRect = this._b2a.rect = bRect;
		this._a2b.destMinX = this._b2a.xMin = bMin;

		// var s = getComputedStyle(document.documentElement);
		// this._rootFontSize = parseFloat(s.fontSize); // * this._canvasRatio;
		// console.log("%s::_updateMetrics _rootFontSize: %s %o", this.cid, this._rootFontSize, s);

		// var c = Math.abs(sData.xMin - dData.xMin) / 6;
		// sMin = sData.xMin + c * qx;
		// dMin = dData.xMin - c * qx;

		// this._a2b.targets = this._measureListItems(listView);
		// this._b2a.targets = this._measureListItems(listView);

		// // connector minimum branch x2
		// listView = this._listB;
		// for (i = 0, ii = listView.groups.length; i < ii; i++) {
		// 	itemView = listView.itemViews.findByModel(listView.groups[i]);
		// 	itemRect = (itemView.label || itemView.el).getBoundingClientRect();
		// 	this._b2a.xMin = Math.min(this._b2a.xMin, itemRect.left);
		// 	// if (itemView._metrics) this._b2a.rect.left + itemView.transform.tx + itemView._metrics.textLeft;
		// }
	},

	/* --------------------------- *
	/* redraw
	/* --------------------------- */

	_beforeViewRender: function(view, flags) {
		if (flags & (CanvasView.SIZE_INVALID | CanvasView.MODEL_INVALID)) {
			console.log("%s::_beforeViewRender [flags: %s]", this.cid, CanvasView.flagsToString(flags));

			this._a2b.pointsOut = this._a2b.points;
			this._a2b.rootOut = this._a2b.root;
			this._a2b.points = null;
			this._a2b.root = null;

			this._b2a.pointsOut = this._b2a.points;
			this._b2a.rootOut = this._b2a.root;
			this._b2a.points = null;
			this._b2a.root = null;

			this._groupRects = null;
		}
	},

	redraw: function(ctx, interpolator) {
		// console.log("%s::redraw [valuesChanged: %s]", this.cid, interpolator.valuesChanged);
		this._clearCanvas(0, 0, this._canvasWidth, this._canvasHeight);
		ctx.save();
		this._redraw_fromElements(ctx, interpolator);
		// this._redraw_fromViews(ctx, interpolator);
		ctx.restore();
	},

	_redraw_fromElements: function(ctx, interpolator) {
		// b2a: keyword to bundles, right to left
		// a2b: bundle to keywords, left to right
		if (this._b2a.points === null) {
			this._computeConnectors(this._b2a); //, this._listB, this._listA);
		}
		if (this._a2b.points === null) {
			this._computeConnectors(this._a2b); //, this._listA, this._listB);
		}

		/* line dash value interpolation */
		var lVal = interpolator._valueData["amount"]._renderedValue / interpolator._valueData["amount"]._maxVal;

		/* draw */
		this._drawConnectors(this._b2a.root, this._b2a.points, this._b2a.s, lVal, 1);
		this._drawConnectors(this._b2a.rootOut, this._b2a.pointsOut, this._b2a.s, 1 - lVal, 1);
		this._drawConnectors(this._a2b.root, this._a2b.points, this._a2b.s, 1, 2);

		// this._drawOverlays(this._a2b.destView, this._a2b.destRect);

		// clear some label backgrounds
		if (this._groupRects === null) {
			this._groupRects = [];
			var els = this._listB.el.querySelectorAll(".list-group .label span");
			for (var i = 0, ii = els.length; i < ii; i++) {
				this._groupRects[i] = els[i].getBoundingClientRect(els[i]);
			}
		}
		if (lVal === 1) {
			console.log("%s::_redraw " +
				"window.scrollY: %s " +
				"window.pageYOffset: %s " +
				"body.scrollTop: %s " +
				"html.scrollTop: %s " +
				"#container.scrollTop: %s",
				this.cid,
				window.scrollY,
				window.pageYOffset,
				document.documentElement.scrollTop,
				document.body.scrollTop,
				document.documentElement.firstElementChild.scrollTop
			);
		}

		this._groupRects.forEach(function(r) {
			// TODO: implement DOMRect.inflate()
			// CanvasHelper.drawRect(this._ctx, _dStyles["red_fill"],
			// 	r.left + document.body.scrollLeft,
			// 	r.top + document.body.scrollTop,
			// 	r.width, r.height);
			// r = inflateRect(r, -8.5, -4.5);
			this._ctx.clearRect(
				r.left + document.body.scrollLeft,
				r.top + document.body.scrollTop,
				r.width, r.height);

		}, this);
	},

	_drawOverlays: function(list, rect) {
		var items = list.groups;
		for (var i = 0, num = items.length, item; i < num; i++) {
			item = list.itemViews.findByModel(items[i]);
			if (item._metrics && item.transform) {
				console.log("list.filteredGroups.length[%o] %o", i,
					item._metrics, item.transform);
				this._ctx.clearRect(
					rect.left + item.transform.tx + item._metrics.offsetLeft,
					rect.top + item.transform.ty + item._metrics.offsetTop - 5,
					item._metrics.offsetWidth,
					10 // item._metrics.offsetHeight
				);
				// CanvasHelper.drawRect(this._ctx, _dStyles["red_fill"],
				// 	rect.left + item.transform.tx + item._metrics.offsetLeft,
				// 	rect.top + item.transform.ty + item._metrics.offsetTop - 5,
				// 	item._metrics.offsetWidth, 10
				// );
			}
		}
	},

	_computeConnectors: function(d) {
		var sMin = d.xMin;
		var dMin = d.destMinX;

		var root = {};
		var p, points = [];
		var qx, x1, y1, tx;
		var rBase, rInc;

		rBase = this._roundTo(d.s.radiusBase * this._rootFontSize, 0.5);
		rInc = this._roundTo(d.s.radiusIncrement * this._rootFontSize, 0.5);

		if (d.rect.right < d.destRect.left) {
			qx = 1;
		} else if (d.destRect.right < d.rect.left) {
			qx = -1;
		} else {
			qx = 0;
		}

		var sView, ddView, ddItems, ddNum, i;
		if (d.srcView.collection.selected && d.destView.filteredItems) {
			sView = d.srcView.itemViews.findByModel(d.srcView.collection.selected);

			// var rect = sView.label.getBoundingClientRect();
			// x1 = rect.left;
			// y1 = rect.top + rect.height / 2;
			// if (qx > 0) x1 += rect.width;
			// x1 += document.body.scrollLeft;
			// y1 += document.body.scrollTop;
			if (!sView._metrics) return;

			x1 = d.rect.left + sView.transform.tx
				+ sView._metrics.textLeft;
			y1 = d.rect.top + sView.transform.ty
				+ sView._metrics.offsetHeight / 2;
			if (qx > 0) x1 += sView._metrics.textWidth;

			ddItems = d.destView.filteredItems;
			ddNum = d.destView.filteredItems.length;

			for (i = 0; i < ddNum; i++) {
				p = {};
				ddView = d.destView.itemViews.findByModel(ddItems[i]);

				// rect = ddView.label.getBoundingClientRect();
				// p.x2 = rect.left;
				// p.y2 = rect.top + rect.height / 2;
				// if (qx < 0) p.x2 += rect.width;
				// p.x2 += document.body.scrollLeft;
				// p.y2 += document.body.scrollTop;

				p.x2 = d.destRect.left + ddView.transform.tx
					+ ddView._metrics.textLeft;
				p.y2 = d.destRect.top + ddView.transform.ty
					+ ddView._metrics.offsetHeight / 2;
				if (qx < 0) p.x2 += ddView._metrics.textWidth;

				p.x1 = x1;
				p.y1 = y1;
				p.qx = qx;
				points[i] = p;
			}
			points.sort(function(a, b) {
				return a.y2 - b.y2;
			});
			var si = 0; // ssEl's number of items above in the Y axis
			var rMax0 = ddNum * 0.5 * rInc; // first arc (r0) max radius (cx0)
			var a; // cy1 offset from y1

			for (i = 0; i < ddNum; i++) {
				p = points[i];

				a = (i - (ddNum - 1) / 2) * rInc;
				p.cy1 = p.y1 + a;
				p.cy2 = p.y2;

				a = Math.abs(a);
				p.r0 = a;
				p.cx0 = p.x1 + (rMax0 - a) * qx;

				// p.dx = x1 - p.x2;
				// p.dy = y1 - p.y2;

				p.di = ((p.cy1 - p.y2) > 0) ? i : ddNum - (i + 1);
				si = Math.max(si, p.di);
			}

			// NOTE
			//sMin = p.x1 + (rMax0 * qx);

			for (i = 0; i < ddNum; i++) {
				p = points[i];
				p.r1 = p.di * rInc + rBase;
				p.r2 = rBase;
				// p.r2 = rBase + (si - p.di) * rInc;

				p.cx1 = sMin + (rMax0 * qx);
				p.cx2 = dMin - ((si - p.di) * rInc) * qx;
				// p.cx2 = dMin;

				tx = calcArcHConnector(p.cx1, p.cy1, p.r1, p.cx2, p.cy2, p.r2, 0.9);
				if (tx) {
					p.tx1 = tx[0];
					p.tx2 = tx[1];
				} else {
					p.tx1 = p.cx1;
					p.tx2 = p.cx2;
				}
				p.length = Math.abs(p.x1 - p.x2) + Math.abs(p.cy1 - p.cy2);

				// Find out longest node connection for setLineDash
				root.maxLength = Math.max(root.maxLength, p.length);
			}
			points.sort(function(a, b) {
				return a.di - b.di; // Sort by distance to selected view
			});

			root.x = x1;
			root.y = y1;
			root.qx = qx;
			root.r0 = si * rInc;
		}
		d.points = points;
		d.root = root;
	},

	_drawConnectors: function(root, pp, s, lVal, dir) {
		var i, ii, p;
		var ow, ra1, ra2, ta;

		if (!(pp && pp.length && lVal)) return;

		ii = pp.length;

		/* outline width */
		// ow = s.lineWidth + s.outlineWidth;
		ow = Math.min(
			this._roundTo(s.radiusIncrement * this._rootFontSize, 0.5),
			this._roundTo(s.lineWidth * (1 + s.outlineWidth), 0.5)
		);

		/* arrow radiuses, direction */
		// ra1 = (s.radiusIncrement * this._rootFontSize) + s.lineWidth;
		ra1 = s.arrowSize * this._rootFontSize;
		ra2 = ra1 + (ow - s.lineWidth);
		ta = Math.PI * dir;

		this._setStyle(s);

		// if (lVal < 1) {
		// 	this._ctx.lineDashOffset = lMax * (1 + lVal);
		// 	this._ctx.setLineDash([lMax, lMax])
		// 	// this._ctx.lineDashOffset = lMax * (1 + lVal);;
		// 	// this._ctx.setLineDash([lMax * (1 - lVal), lMax]);
		// }

		// for (i = 0; i < ii; i++) {
		// p = pp[i];
		if (s.outlineWidth) {
			this._ctx.save();
			this._ctx.globalCompositeOperation = "destination-out";
			this._ctx.lineWidth = ow;
			for (i = 0; i < ii; i++) {
				p = pp[i];

				if (lVal < 1) {
					this._ctx.lineDashOffset = p.length * (1 + lVal);
					this._ctx.setLineDash([p.length, p.length])
				}
				this._drawConnector(p, i, pp);
				if (lVal == 1) {
					CanvasHelper.arrowhead(this._ctx, p.x2, p.y2, ra2, ta);
					this._ctx.fill();
				}
			}
			this._ctx.restore();
		}

		for (i = 0; i < ii; i++) {
			p = pp[i];
			if (lVal < 1) {
				this._ctx.lineDashOffset = p.length * (1 + lVal);
				this._ctx.setLineDash([p.length, p.length])
			}
			this._drawConnector(p, i, pp);
			if (lVal == 1) {
				CanvasHelper.arrowhead(this._ctx, p.x2, p.y2, ra1, ta);
				this._ctx.fill();
			}
		}
	},

	_drawConnector: function(p, i, pp) {

		this._ctx.beginPath();
		this._ctx.moveTo(p.x2, p.cy2);
		this._ctx.arcTo(p.tx2, p.cy2, p.tx1, p.cy1, p.r2);
		this._ctx.arcTo(p.tx1, p.cy1, p.cx1, p.cy1, p.r1);
		this._ctx.arcTo(p.cx0, p.cy1, p.cx0, p.y1, p.r0);

		// p.cx00 = p.x1 + ((p.r0 + p.di) * p.qx);
		// p.cy00 = (p.cy1 + p.y1) / 2;
		// this._ctx.arcTo(p.cx00, p.cy1, p.cx00, p.cy00, p.r0 / 2);
		// this._ctx.arcTo(p.cx00, p.y1, p.x1, p.y1, p.r0 / 2);
		// this._ctx.lineTo(p.x1, p.y1);

		// p.cx00 = p.x1 + (p.r0 * p.qx * 2);
		// this._ctx.lineTo(p.cx00, p.cy1);
		// this._ctx.quadraticCurveTo(p.cx0, p.cy1, p.cx0, p.y1);

		// this._ctx.lineTo(p.cx0, p.y1);

		this._ctx.stroke();

		// if (DEBUG) {
		// 	CanvasHelper.drawCrosshair(this._ctx, _dStyles["blue"],
		// 		p.x1 + ((p.r0 + p.di) * p.qx), p.cy1, 3);
		// 	if (i === 0) {
		// 		CanvasHelper.drawVGuide(this._ctx, _dStyles["blue"], p.x1);
		// 		CanvasHelper.drawCircle(this._ctx, _dStyles["midnightblue"], p.x1, p.y1, 10);
		// 		CanvasHelper.drawVGuide(this._ctx, _dStyles["lightskyblue"], p.cx1);
		// 		CanvasHelper.drawHGuide(this._ctx, _dStyles["grey"], p.y1);
		// 	}
		// 	CanvasHelper.drawHGuide(this._ctx, _dStyles["silver"], p.cy2);
		// 	// _dStyles[p.dy > 0 ? "lightgreen" : "salmon"], p.cy2);
		// 	CanvasHelper.drawSquare(this._ctx, _dStyles["midnightblue"], p.cx0, p.cy1, 2);
		// 	CanvasHelper.drawCircle(this._ctx, _dStyles["blue"], p.cx1, p.cy1, 1);
		// 	CanvasHelper.drawSquare(this._ctx, _dStyles["blue"], p.tx1, p.cy1, 2);
		// 	CanvasHelper.drawSquare(this._ctx, _dStyles["green"], p.tx2, p.cy2, 2);
		// 	CanvasHelper.drawCircle(this._ctx, _dStyles["green"], p.cx2, p.cy2, 1);
		//
		// 	CanvasHelper.drawVGuide(this._ctx, _dStyles["yellowgreen"], p.cx2);
		// 	CanvasHelper.drawCircle(this._ctx, _dStyles["olive"], p.x2, p.cy2, 3);
		// 	CanvasHelper.drawCrosshair(this._ctx, _dStyles["olive"], p.x2, p.y2, 6);
		// }
	},

	_roundTo: function(n, p) {
		if (p > 1) p = 1 / p;
		return Math.round(n / p) * p;
	},

	/* _computeConnectors: function(d) {
		var rBase = d.s.radiusBase;
		var rInc = d.s.radiusIncrement;
		var sMin = d.xMin;
		var dMin = d.destMinX;

		var lMax = 0;
		var p, points = [];
		var qx, x1, y1, tx;
		var si; // ssEl's number of items above in the Y axis

		if (d.rect.right < d.destRect.left) {
			qx = 1;
		} else if (d.destRect.right < d.rect.left) {
			qx = -1;
		} else {
			qx = 0;
		}

		var ssEl, ddEls, ddNum, ssRect, ddRect, i;
		ssEl = d.srcView.el.querySelector(".list-item.selected .label");
		if (ssEl) {
			ssRect = ssEl.getBoundingClientRect();
			x1 = ssRect.left;
			if (qx > 0) x1 += ssRect.width;
			y1 = ssRect.top + ssRect.height / 2;
			// r2 = rBase;
			// cx1 = d.xMin;

			si = 0;
			ddEls = d.destView.el.querySelectorAll(".list-item:not(.excluded) .label");
			ddNum = ddEls.length;
			// dx = Math.abs(d.xMin - dData.xMin);

			for (i = 0; i < ddNum; i++) {
				p = {};
				ddRect = ddEls[i].getBoundingClientRect();
				p.x2 = ddRect.left;
				if (qx < 0) p.x2 += ddRect.width;
				p.y2 = ddRect.top + ddRect.height / 2;
				p.x1 = x1;
				p.y1 = y1;
				p.dx = p.x1 - p.x2;
				p.dy = p.y1 - p.y2;
				p.qx = qx;
				p.qy = Math.sign(p.dy);
				// p.dLength = Math.abs(p.x) + Math.abs(p.y);
				p.di = p.dy > 0 ? i : ddNum - (i + 1);
				si = Math.max(si, p.di);
				points[i] = p;
			}

			var a, rMax0 = ddNum * 0.5 * rInc;
			for (i = 0; i < ddNum; i++) {
				p = points[i];
				p.r1 = p.di * rInc + rBase;
				p.r2 = rBase;
				// p.r2 = (si - p.di) * rInc + rBase;

				p.cx1 = sMin;
				p.cx2 = dMin - ((si - p.di) * rInc) * qx;
				// p.cx2 = dMin;

				a = (i - (ddNum - 1) / 2) * rInc;
				p.cy1 = p.y1 + a;
				p.cy2 = p.y2;

				a = Math.abs(a);
				p.r0 = a;
				p.cx0 = p.x1 + (rMax0 - a) * qx;

				tx = calcArcHConnector(p.cx1, p.cy1, p.r1, p.cx2, p.cy2, p.r2, 0.8);
				p.tx1 = tx[0];
				p.tx2 = tx[1];

				// Find out longest node connection for setLineDash
				lMax = Math.max(lMax, Math.abs(p.x1 - p.x2) + Math.abs(p.cy1 - p.cy2));
			}
			// Sort by distance y1 (original) > cy1 (rInc offset) distance
			points.sort(function(a, b) {
				// return Math.abs(b.y1 - b.cy1) - Math.abs(a.y1 - a.cy1);
				// return a.r0 - b.r0;
				return b.di - a.di;
			});
		}
		d.points = points;
		d.maxLength = lMax;
		d.maxLength = qx;
	}, */

});

if (DEBUG) {
	GraphView.prototype._skipLog = false;

	var debouncedLog = _.debounce(_.bind(console.log, console), 500, true);
	var applyMethod = function(context, args) {
		return Array.prototype.shift.apply(args).apply(context, args);
	}
	if (!GraphView.prototype._skipLog) {
		// GraphView.prototype._requestRender = _.wrap(CanvasView.prototype._requestRender, function(fn) {
		// 	debouncedLog("%s::_requestRender", this.cid);
		// 	return applyMethod(this, arguments);
		// });
		GraphView.prototype._applyRender = _.wrap(CanvasView.prototype._applyRender, function(fn) {
			this._skipLog = true;
			debouncedLog("%s::_applyRender [debounced]", this.cid);
			var retval = applyMethod(this, arguments);
			this._skipLog = false;
			return retval;

		});
	}
}

module.exports = GraphView;
}).call(this,true)

},{"app/control/Globals":34,"app/view/base/CanvasView":53,"color":"color","underscore":"underscore","utils/canvas/CanvasHelper":105,"utils/canvas/calcArcHConnector":106,"utils/dom/getAbsoluteClientRect":108,"utils/geom/inflateRect":111}],68:[function(require,module,exports){
/**
 * @module app/view/component/GroupingListView
 */

/** @type {module:underscore} */
var _ = require("underscore");
// /** @type {module:backbone} */
// var Backbone = require("backbone");
// /** @type {module:backbone.babysitter} */
// var Container = require("backbone.babysitter");
// /** @type {module:app/view/base/View} */
// var View = require("app/view/base/View");
/** @type {module:app/view/component/FilterableListView} */
var FilterableListView = require("app/view/component/FilterableListView");
/** @type {module:app/view/component/ClickableRenderer} */
var ClickableRenderer = require("app/view/render/ClickableRenderer");
/** @type {module:app/view/render/LabelRenderer} */
var LabelRenderer = require("app/view/render/LabelRenderer");

/**
 * @constructor
 * @type {module:app/view/component/GroupingListView}
 */
var GroupingListView = FilterableListView.extend({

	/** @type {string} */
	cidPrefix: "groupingList",

	/** @override */
	tagName: "dl",

	/** @override */
	className: "grouped",

	/** @type {Function|null} empty array */
	_groupingFn: null, //function() { return null; },

	/** @override */
	defaults: _.defaults({
		// defaults: {
		renderer: ClickableRenderer.extend({
			/** @override */
			cidPrefix: "groupingListItem",
			/** @override */
			tagName: "dl",
			/** @override */
			className: "list-item list-label",
		}),
		groupingRenderer: LabelRenderer.extend({
			/** @override */
			cidPrefix: "groupingListGroup",
			/** @override */
			tagName: "dt",
			/** @override */
			className: "list-group list-label",
		}),
		groupingFn: null,
		// },
	}, FilterableListView.prototype.defaults),

	properties: {
		groups: {
			get: function() {
				return this._groups;
			}
		},
		filteredGroups: {
			get: function() {
				return this._filteredGroups;
			}
		},
	},

	/** @override */
	initialize: function(options) {
		FilterableListView.prototype.initialize.apply(this, arguments);

		this._groups = [];
		this._filteredGroups = [];

		this._groupsByItemCid = {};
		this._groupingFn = options.groupingFn;
		this.groupingRenderer = options.groupingRenderer;

		this._refreshGroups();
		if (this._groupingFn) {
			this._groups.forEach(this.createGroupingView, this);
		}
	},

	_refreshGroups: function() {
		// this._groups = _.uniq(this.collection.map(this._groupingFn, this));
		this._groups.length = 0;
		// this._groupItems.length = 0;
		if (this._groupingFn) {
			this.collection.forEach(function(item) {
				var gIdx, gObj = this._groupingFn.apply(null, arguments);
				if (gObj) {
					gIdx = this._groups.indexOf(gObj);
					if (gIdx == -1) {
						gIdx = this._groups.length;
						this._groups[gIdx] = gObj;
						// this._groupItems[gIdx] = [];
					}
					// this._groupItems[gIdx].push(item);
				}
				this._groupsByItemCid[item.cid] = gObj;
			}, this);
		} else {
			this.collection.forEach(function(item) {
				this._groupsByItemCid[item.cid] = null;
			}, this);
		}
	},

	renderFilterFn: function() {
		FilterableListView.prototype.renderFilterFn.apply(this, arguments);

		if (this._groupingFn) {
			if (this._filteredItems.length == 0) {
				this._filteredGroups = [];
				this._groups.forEach(function(group) {
					this.itemViews.findByModel(group).el.classList.remove("excluded");
				}, this);
			} else {
				this._filteredGroups = _.uniq(this._filteredItems.map(function(item) {
					return this._groupsByItemCid[item.cid];
				}, this));
				this._groups.forEach(function(group) {
					this.itemViews.findByModel(group).el.classList.toggle("excluded", this._filteredGroups.indexOf(group) == -1);
				}, this);
			}
			// this._groupsExclusionIndex = this._groups.map(function (group) {
			// 	return groups.indexOf(group) == -1);
			// }, this);
		}
	},

	/** @private Create children views */
	createGroupingView: function(item) {
		var view = new this.groupingRenderer({
			model: item,
			el: this.el.querySelector(".list-group[data-id=\"" + item.id + "\"]")
		});
		this.itemViews.add(view);
		return view;
	},

	/* --------------------------- *
	/* Filter 2
	/* --------------------------- */

	// computeFiltered: function() {
	// 	FilterableListView.prototype.computeFiltered.apply(this, arguments);
	// },
	//
	// renderFiltered: function() {
	// 	FilterableListView.prototype.renderFiltered.apply(this, arguments);
	// },

});

module.exports = GroupingListView;
},{"app/view/component/FilterableListView":66,"app/view/render/ClickableRenderer":82,"app/view/render/LabelRenderer":89,"underscore":"underscore"}],69:[function(require,module,exports){
/** @type {module:app/view/component/progress/CanvasProgressMeter} */
module.exports = require("app/view/component/progress/CanvasProgressMeter3");
/** @type {module:app/view/component/progress/SVGPathProgressMeter} */
// module.exports = require("app/view/component/progress/SVGPathProgressMeter");
/** @type {module:app/view/component/progress/SVGCircleProgressMeter} */
// module.exports = require("app/view/component/progress/SVGCircleProgressMeter");

},{"app/view/component/progress/CanvasProgressMeter3":71}],70:[function(require,module,exports){
/**
 * @module app/view/component/SelectableListView
 */

// /** @type {module:underscore} */
// var _ = require("underscore");
// /** @type {module:backbone} */
// var Backbone = require("backbone");
/** @type {module:backbone.babysitter} */
var Container = require("backbone.babysitter");
/** @type {module:app/view/base/View} */
var View = require("app/view/base/View");
/** @type {module:app/view/component/DefaultSelectableRenderer} */
var DefaultSelectableRenderer = require("app/view/render/DefaultSelectableRenderer");
/** @type {module:app/view/component/ClickableRenderer} */
var ClickableRenderer = require("app/view/render/ClickableRenderer");

var SelectableListView = View.extend({

	/** @type {string} */
	cidPrefix: "selectableList",

	/** @override */
	tagName: "ul",

	/** @override */
	className: "list selectable",

	/** @type {module:app/view/component/DefaultSelectableRenderer} */
	renderer: DefaultSelectableRenderer,

	/** @override */
	initialize: function(options) {
		this._enabled = true;
		this._childrenInvalid = true;

		options.renderer && (this.renderer = options.renderer);
		this.showEmpty = !!options.showEmpty;
		this.itemViews = new Container();

		this.listenTo(this.collection, "add remove reset", this._onCollectionChange);
	},

	/** @override */
	remove: function() {
		this.removeChildren();
		View.prototype.remove.apply(this, arguments);
		return this;
	},

	_onCollectionChange: function(ev) {
		this._childrenInvalid = true;
		this.render();
	},

	/** @override */
	render: function() {
		if (this._childrenInvalid) {
			this._childrenInvalid = false;
			this.createChildren();
		}
		return this;
	},

	/** @override */
	setEnabled: function(enabled) {
		if (this._enabled !== enabled) {
			this._enabled = enabled;
			this.el.classList.toggle("disabled", !this._enabled);
		}
	},

	/* --------------------------- *
	/* Child views
	/* --------------------------- */

	createChildren: function() {
		var eltBuffer, view;

		this.removeChildren();
		this.el.innerHTML = "";

		if (this.collection.length) {
			eltBuffer = document.createDocumentFragment();
			if (this.showEmpty) {
				view = this.createEmptyView();
				eltBuffer.appendChild(view.render().el);
			}
			this.collection.each(function(model, index, arr) {
				view = this.createItemView(model, index);
				eltBuffer.appendChild(view.render().el);
			}, this);
			this.el.appendChild(eltBuffer);
		}
	},

	createItemView: function(model, index) {
		var view = new(this.renderer)({
			model: model
		});
		this.itemViews.add(view);
		this.listenTo(view, "renderer:click", this.onItemViewClick);
		return view;
	},

	removeChildren: function() {
		this.itemViews.each(this.removeItemView, this);
	},

	removeItemView: function(view) {
		this.stopListening(view);
		this.itemViews.remove(view);
		view.remove();
		return view;
	},

	/* --------------------------- *
	/* Child event handlers
	/* --------------------------- */

	/** @private */
	onItemViewClick: function(item) {
		if (this.collection.selected !== item && this._enabled) {
			this.trigger("view:select:one", item);
		}
	},

	/* --------------------------- *
	/* Empty view
	/* --------------------------- */

	createEmptyView: function() {
		var view = new SelectableListView.EmptyRenderer({
			model: this.collection
		});
		this.itemViews.add(view);
		this.listenTo(view, "renderer:click", function() {
			this._enabled && this.trigger("view:select:none");
		});
		return view;
	},
}, {
	EmptyRenderer: ClickableRenderer.extend({

		/** @override */
		tagName: "li",
		/** @override */
		className: "list-item empty-item",

		/** @override */
		initialize: function(options) {
			this.listenTo(this.model, "selected deselected", this.renderClassList);
			this.renderClassList();
		},

		/** @override */
		render: function() {
			this.el.innerHTML = "<a href=\"#clear\"><b> </b></a>";
			this.renderClassList();
			return this;
		},

		renderClassList: function() {
			this.el.classList.toggle("selected", this.model.selectedIndex === -1);
		},
	})
});

module.exports = SelectableListView;

},{"app/view/base/View":58,"app/view/render/ClickableRenderer":82,"app/view/render/DefaultSelectableRenderer":84,"backbone.babysitter":"backbone.babysitter"}],71:[function(require,module,exports){
(function (DEBUG){
/**
 * @module app/view/component/progress/CanvasProgressMeter
 */

// /** @type {module:underscore} */
// var _ = require("underscore");

// /** @type {module:app/control/Globals} */
// var Globals = require("app/control/Globals");
/** @type {module:app/view/base/CanvasView} */
var CanvasView = require("app/view/base/CanvasView");
// /** @type {module:app/view/base/Interpolator} */
// var Interpolator = require("app/view/base/Interpolator");

// var ARC_ERR = 0.00001;
// var ARC_ERR = 0.0;
// var PI = Math.PI;
var PI2 = Math.PI * 2;

var GAP_ARC = PI2 / 48;
// var CAP_SCALE = 2; // cap arc = GAP_ARC * CAP_SCALE
// var WAIT_CYCLE_VALUE = 1;
// var WAIT_CYCLE_MS = 300; // milliseconds per interpolation loop

var ARC_DEFAULTS = {
	"amount": {
		lineWidth: 0.8,
		radiusOffset: 0
	},
	"not-available": {
		lineWidth: 1.0,
		lineDash: [0.3, 0.7]
	},
	"available": {
		lineWidth: 0.8,
		inverse: "not-available"
	},
};

/**
 * @constructor
 * @type {module:app/view/component/progress/CanvasProgressMeter}
 */
var CanvasProgressMeter = CanvasView.extend({

	/** @type {string} */
	cidPrefix: "canvasProgressMeter",
	/** @type {string} */
	className: "progress-meter canvas-progress-meter",

	defaultKey: "amount",

	defaults: {
		values: {
			amount: 0,
			available: 0,
			_loop: 0,
		},
		maxValues: {
			amount: 1,
			available: 1,
		},
		useOpaque: true,
		labelFn: function(value, max) {
			return ((value / max) * 100) | 0;
		},
	},

	/* --------------------------- *
	/* children/layout
	/* --------------------------- */

	/** @override */
	initialize: function(options) {
		// TODO: cleanup options mess in CanvasView
		CanvasView.prototype.initialize.apply(this, arguments);
		// options = _.defaults(options, this.defaults);

		this._labelFn = options.labelFn;
		this._valueStyles = {};
		this._canvasSize = null;
		this._canvasOrigin = null;
	},

	measureCanvas: function(w, h) {
		this._canvasHeight = this._canvasWidth = Math.min(this._canvasWidth, this._canvasHeight);
	},

	_updateCanvas: function() {
		CanvasView.prototype._updateCanvas.apply(this, arguments);

		// size, lines, gaps, dashes (this._valueStyles, GAP_ARC, this._arcRadius)
		// --------------------------------
		var arcName, arcObj, arcDefault;
		var mapLineDash = function(n) {
			return n * this.radius * GAP_ARC;
		};
		var sumFn = function(s, n) {
			return s + n;
		};

		this._canvasSize = Math.min(this._canvasWidth, this._canvasHeight); // / this._canvasRatio;
		this._maxDashArc = 0;

		for (arcName in ARC_DEFAULTS) {
			arcDefault = ARC_DEFAULTS[arcName];
			arcObj = this._valueStyles[arcName] = {};
			arcObj.inverse = arcDefault.inverse; // copy inverse key
			// arcObj.inverse2 = arcDefault.inverse2;
			arcObj.lineWidth = arcDefault.lineWidth * this._canvasRatio;
			arcObj.radius = (this._canvasSize - arcObj.lineWidth) / 2;
			if (arcDefault.radiusOffset) {
				arcObj.radius += arcDefault.radiusOffset * this._canvasRatio;
			}
			if (arcDefault.lineDash && arcDefault.lineDash.length) {
				arcObj.lineDash = arcDefault.lineDash.map(mapLineDash, arcObj);
				arcObj.lineDashArc = arcDefault.lineDash[0] * GAP_ARC;
				arcObj.lineDashLength = arcObj.lineDash.reduce(sumFn);
				this._maxDashArc = Math.max(this._maxDashArc, arcObj.lineDashArc);
			} else {
				arcObj.lineDashArc = 0;
			}
		}

		// baselineShift
		// --------------------------------
		// NOTE: Center baseline: use ascent data to center to x-height, or sort-of.
		// with ascent/descent values (0.7, -0.3), x-height is 0.4
		var mObj = this._getFontMetrics(this._fontFamily);
		this._baselineShift = mObj ? (mObj.ascent + mObj.descent) / mObj.unitsPerEm : 0.7; // default value
		this._baselineShift *= this._fontSize * 0.5; // apply to font-size, halve it
		this._baselineShift = Math.round(this._baselineShift);

		// save canvas context
		// --------------------------------
		// reset matrix and translate 0,0 to center
		this._ctx.restore();
		this._ctx.setTransform(1, 0, 0, 1, this._canvasWidth / 2, this._canvasHeight / 2);
		this._ctx.save();
	},

	/* --------------------------- *
	/* private
	/* --------------------------- */

	/** @override */
	redraw: function(context, interpolator) {
		this._clearCanvas(-this._canvasWidth / 2, -this._canvasHeight / 2, this._canvasWidth, this._canvasHeight);

		var loopValue = interpolator._valueData["_loop"]._renderedValue || 0;
		var amountData = interpolator._valueData["amount"];
		var availableData = interpolator._valueData["available"];

		var amountStyle = this._valueStyles["amount"];
		var availableStyle = this._valueStyles["available"];

		// amount label
		// --------------------------------
		this.drawLabel(this._labelFn(amountData._renderedValue, amountData._maxVal));

		// save ctx before drawing arcs
		this._ctx.save();

		// loop rotation
		// --------------------------------
		// if (interpolator.renderedKeys && (interpolator.renderedKeys.indexOf("amount") !== -1)) {
		// 	console.log("%s::redraw (_loop) max: %s last: %s curr: %s", this.cid,
		// 		amountData._maxVal,
		// 		amountData._lastRenderedValue,
		// 		amountData._renderedValue
		// 	);
		// }
		if (interpolator.renderedKeys && (interpolator.renderedKeys.indexOf("amount") !== -1) && (amountData._lastRenderedValue > amountData._renderedValue)) {
			// trigger loop
			interpolator.valueTo(1, 0, "_loop");
			interpolator.valueTo(0, 750, "_loop");
			interpolator.updateValue("_loop");
		}
		this._ctx.rotate(PI2 * ((1 - loopValue) - 0.25));

		// amount arc
		// --------------------------------
		var amountGapArc = GAP_ARC;
		var amountEndArc = 0;
		var amountValue = loopValue + amountData._renderedValue / amountData._maxVal;

		if (amountValue > 0) {
			amountEndArc = this.drawArc(amountStyle, amountValue, amountGapArc, PI2 - amountGapArc);
			this.drawEndCap(amountStyle, amountEndArc);
			amountEndArc = amountEndArc + amountGapArc * 2;
		}

		// available arc
		// --------------------------------
		var stepsNum = availableData.length || 1;
		var stepBaseArc = PI2 / stepsNum;
		var stepAdjustArc = stepBaseArc % GAP_ARC;
		var stepGapArc = GAP_ARC + (stepAdjustArc - availableStyle.lineDashArc) / 2;

		if (Array.isArray(availableData)) {
			for (var o, i = 0; i < stepsNum; i++) {
				o = availableData[i];
				this.drawArc(availableStyle, o._renderedValue / (o._maxVal / stepsNum), (i * stepBaseArc) + stepGapArc, ((i + 1) * stepBaseArc) - stepGapArc, amountEndArc);
			}
		} else {
			this.drawArc(availableStyle, availableData._renderedValue / availableData._maxVal, stepGapArc, PI2 - stepGapArc, amountEndArc);
		}
		// restore ctx after drawing arcs
		this._ctx.restore();
	},

	drawArc: function(valueStyle, value, startArc, endArc, prevArc) {
		var valArc, invStyle,
			valStartArc, valEndArc,
			invStartArc, invEndArc;
		prevArc || (prevArc = 0);

		valArc = endArc - startArc;
		valEndArc = startArc + (valArc * value);
		valStartArc = Math.max(startArc, prevArc);
		if (valEndArc > valStartArc) {
			this._ctx.save();
			this.applyValueStyle(valueStyle);
			this._ctx.beginPath();
			this._ctx.arc(0, 0, valueStyle.radius, valEndArc, valStartArc, true);
			this._ctx.stroke();
			this._ctx.restore();
		}
		// if there's valueStyle, draw rest of span, minus prevArc overlap too
		if (valueStyle.inverse !== void 0) {
			invStyle = this._valueStyles[valueStyle.inverse];
			invEndArc = valEndArc + (valArc * (1 - value));
			invStartArc = Math.max(valEndArc, prevArc);
			if (invEndArc > invStartArc) {
				this._ctx.save();
				this.applyValueStyle(invStyle);
				this._ctx.beginPath();
				this._ctx.arc(0, 0, invStyle.radius, invEndArc, invStartArc, true);
				this._ctx.stroke();
				this._ctx.restore();
			}
		}
		return valEndArc;
	},

	applyValueStyle: function(styleObj) {
		this._ctx.lineWidth = styleObj.lineWidth;
		if (styleObj.lineDash) {
			this._ctx.setLineDash(styleObj.lineDash);
		}
		if (styleObj.lineDashOffset) {
			this._ctx.lineDashOffset = styleObj.lineDashOffset;
		}
	},

	drawLabel: function(labelString) {
		var labelWidth = this._ctx.measureText(labelString).width;
		this._ctx.fillText(labelString,
			labelWidth * -0.5,
			this._baselineShift, labelWidth);
	},

	drawEndCap: function(valueStyle, arcPos) {
		var radius = valueStyle.radius;
		this._ctx.save();
		this._ctx.lineWidth = valueStyle.lineWidth;

		this._ctx.rotate(arcPos - GAP_ARC * 1.5);
		this._ctx.beginPath();
		this._ctx.arc(0, 0, radius, GAP_ARC * 0.5, GAP_ARC * 2, false);
		this._ctx.lineTo(radius - (GAP_ARC * radius), 0);
		this._ctx.closePath();

		this._ctx.fill();
		this._ctx.stroke();
		this._ctx.restore();
	},
});

if (DEBUG) {
	CanvasProgressMeter.prototype._skipLog = true;
}

module.exports = CanvasProgressMeter;

}).call(this,true)

},{"app/view/base/CanvasView":53}],72:[function(require,module,exports){
/** @type {module:underscore} */
var _ = require("underscore");
/** @type {Function} */
var Color = require("color");
/** @type {module:app/control/Globals} */
var Globals = require("app/control/Globals");
/** @type {module:app/model/collection/BundleCollection} */
var bundles = require("app/model/collection/BundleCollection");

// - - - - - - - - - - - - - - - -
//  utils
// - - - - - - - - - - - - - - - -

function insertCSSRule(sheet, selector, style) {
	var cssText = "";
	for (var prop in style) {
		cssText += prop + ":" + style[prop] + ";";
	}
	sheet.insertRule(selector + "{" + cssText + "}", sheet.cssRules.length);
}

function selfAndDescendant(selfCls, cls) {
	return selfCls + " " + cls + ", " + selfCls + cls;
}

// - - - - - - - - - - - - - - - -
//  root rules
// - - - - - - - - - - - - - - - -

var rootStyles = ["background", "background-color", "color", "--link-color"];

function initRootStyles(sheet, rootSelector, attrs, fgColor, bgColor, lnColor, hasDarkBg) {
	var s, revSelector, fgColorVal, bgColorVal;
	// var revFgColorVal, revBgColorVal;

	s = _.pick(attrs, rootStyles);
	s["-webkit-font-smoothing"] = (hasDarkBg ? "antialiased" : "auto");
	/* NOTE: In Firefox '-moz-osx-font-smoothing: grayscale;'
	/* works both in light over dark and dark over light, hardcoded in _base.scss */
	//s["-moz-osx-font-smoothing"] = (hasDarkBg? "grayscale" : "auto");
	insertCSSRule(sheet, rootSelector, s);

	// A element
	// - - - - - - - - - - - - - - - -
	s = {}
	s["color"] = lnColor.rgbString();
	insertCSSRule(sheet, rootSelector + " a", s);
	insertCSSRule(sheet, rootSelector + " .color-ln", s);

	// .color-fg05
	// - - - - - - - - - - - - - - - -
	s = {};
	s["color"] = fgColor.clone().mix(bgColor, 0.5).rgbString();
	s["border-color"] = fgColor.clone().mix(bgColor, 0.7).rgbString();
	insertCSSRule(sheet, rootSelector + " .color-fg05", s);

	fgColorVal = fgColor.rgbString();
	bgColorVal = bgColor.rgbString();
	// revFgColorVal = bgColor.clone().mix(fgColor, 0.9).rgbString();
	// revBgColorVal = fgColor.clone().mix(bgColor, 0.6).rgbString();
	revSelector = rootSelector + " .color-reverse";

	// .color-fg .color-bg
	// - - - - - - - - - - - - - - - -
	s = {
		"color": fgColorVal
	};
	insertCSSRule(sheet, rootSelector + " .color-fg", s);
	s = {
		"background-color": bgColorVal
	};
	insertCSSRule(sheet, rootSelector + " .color-bg", s);
	// html inverted text/background
	s = {
		"color": bgColorVal
	}; // s = { "color" : revFgColorVal };
	s["-webkit-font-smoothing"] = (hasDarkBg ? "auto" : "antialiased");
	// insertCSSRule(sheet, revSelector + " .color-fg", s);
	// insertCSSRule(sheet, revSelector + ".color-fg", s);
	insertCSSRule(sheet, selfAndDescendant(revSelector, ".color-fg"), s);

	s = {
		"background-color": fgColorVal
	};
	// s = { "background-color" : revBgColorVal };
	// insertCSSRule(sheet, revSelector + " .color-bg", s);
	// insertCSSRule(sheet, revSelector + ".color-bg", s);
	insertCSSRule(sheet, selfAndDescendant(revSelector, ".color-bg"), s);

	// .color-stroke .color-fill (SVG)
	// - - - - - - - - - - - - - - - -
	s = {
		"stroke": fgColorVal
	};
	insertCSSRule(sheet, rootSelector + " .color-stroke", s);
	s = {
		"fill": bgColorVal
	};
	insertCSSRule(sheet, rootSelector + " .color-fill", s);
	// svg inverted fill/stroke
	s = {
		"stroke": bgColorVal
	};
	// insertCSSRule(sheet, revSelector + " .color-stroke", s);
	// insertCSSRule(sheet, revSelector + ".color-stroke", s);
	insertCSSRule(sheet, selfAndDescendant(revSelector, ".color-stroke"), s);
	s = {
		"fill": fgColorVal
	};
	// insertCSSRule(sheet, revSelector + " .color-fill", s);
	// insertCSSRule(sheet, revSelector + ".color-fill", s);
	insertCSSRule(sheet, selfAndDescendant(revSelector, ".color-fill"), s);

	// .text-outline
	// - - - - - - - - - - - - - - - -
	// s = {
	// 	"text-shadow": "-1px -1px 0 " + bgColorVal +
	// 		", 1px -1px 0 " + bgColorVal +
	// 		", -1px 1px 0 " + bgColorVal +
	// 		", 1px 1px 0 " + bgColorVal
	// };
	// insertCSSRule(sheet, rootSelector + " :not(.collapsed-changed) .text-outline-bg", s);

}

// - - - - - - - - - - - - - - - -
// carousel styles
// - - - - - - - - - - - - - - - -

var carouselStyles = ["box-shadow", "border", "border-radius"];

function initCarouselStyles(sheet, carouselSelector, attrs, fgColor, bgColor, lnColor, hasDarkBg) {
	var s = _.pick(attrs, carouselStyles); //, "background-color"]);
	insertCSSRule(sheet, carouselSelector + " .media-item .content", s);

	// .media-item .color-bg09
	// - - - - - - - - - - - - - - - -
	s = {};
	s["background-color"] = bgColor.clone().mix(fgColor, 0.95).rgbString();
	// s["background-color"] = bgColor.clone()[hasDarkBg ? "darken" : "lighten"](0.045).rgbString();
	// s["background-color"] = bgColor.clone()[hasDarkBg ? "lighten" : "darken"](0.03).rgbString();
	insertCSSRule(sheet, carouselSelector + " .media-item .color-bg09", s);

	// .media-item .placeholder
	// - - - - - - - - - - - - - - - -
	s = {};
	s["-webkit-font-smoothing"] = (hasDarkBg ? "auto" : "antialiased");
	// text color luminosity is inverse from body, apply oposite rendering mode
	s["color"] = bgColor.rgbString();
	// s["color"] = bgColor.clone()[hasDarkBg ? "darken" : "lighten"](0.045).rgbString();
	s["background-color"] = bgColor.clone().mix(fgColor, 0.95).rgbString();
	// s["background-color"] = bgColor.clone().mix(fgColor, 0.8).alpha(0.3).rgbaString();
	// s["background-color"] = bgColor.clone()[hasDarkBg ? "lighten" : "darken"](0.03).rgbString();
	("border-radius" in attrs) && (s["border-radius"] = attrs["border-radius"]);
	insertCSSRule(sheet, carouselSelector + " .media-item .placeholder", s);

	// .empty-item A
	// - - - - - - - - - - - - - - - -
	s = {};
	s["text-decoration-color"] = fgColor.clone().mix(bgColor, 0.3).rgbString();
	insertCSSRule(sheet, carouselSelector + " .empty-item A", s);
	// // .color-gradient
	// // - - - - - - - - - - - - - - - -
	// s = {};
	// s["background-color"] = "transparent";
	// s["background"] = "linear-gradient(to bottom, " +
	// 		bgColor.clone().alpha(0.00).rgbaString() + " 0%, " +
	// 		bgColor.clone().alpha(0.11).rgbaString() + " 100%)";
	// insertCSSRule(sheet, rootSelector + " .color-gradient", s);
	// s = {};
	// s["background-color"] = "transparent";
	// s["background"] = "linear-gradient(to bottom, " +
	// 		fgColor.clone().alpha(0.00).rgbaString() + " 0%, " +
	// 		fgColor.clone().alpha(0.11).rgbaString() + " 100%)";
	// insertCSSRule(sheet, revSelector + " .color-gradient", s);
	// insertCSSRule(sheet, revSelector + ".color-gradient", s);
}

module.exports = function() {
	var attrs, fgColor, bgColor, lnColor, hasDarkBg;

	attrs = Globals.DEFAULT_COLORS;
	fgColor = new Color(Globals.DEFAULT_COLORS["color"]);
	bgColor = new Color(Globals.DEFAULT_COLORS["background-color"]);
	lnColor = new Color(Globals.DEFAULT_COLORS["--link-color"])
	hasDarkBg = fgColor.luminosity() > bgColor.luminosity();

	var colorStyles = document.createElement("style");
	colorStyles.id = "colors";
	colorStyles.type = "text/css";
	document.head.appendChild(colorStyles);
	// var colorStyles = document.querySelector("link#folio");

	initRootStyles(colorStyles.sheet, ".app",
		attrs, fgColor, bgColor, lnColor, hasDarkBg);
	initCarouselStyles(colorStyles.sheet, ".carousel",
		attrs, fgColor, bgColor, lnColor, hasDarkBg);

	// - - - - - - - - - - - - - - - -
	// per-bundle rules
	// - - - - - - - - - - - - - - - -
	bundles.each(function(bundle) {
		attrs = bundle.attrs(); //get("attrs");
		fgColor = bundle.colors.fgColor;
		bgColor = bundle.colors.bgColor;
		lnColor = bundle.colors.lnColor;
		hasDarkBg = bundle.colors.hasDarkBg;

		initRootStyles(colorStyles.sheet,
			".app." + bundle.get("domid"),
			attrs, fgColor, bgColor, lnColor, hasDarkBg);
		initCarouselStyles(colorStyles.sheet,
			".carousel." + bundle.get("domid"),
			attrs, fgColor, bgColor, lnColor, hasDarkBg);
	});
};
},{"app/control/Globals":34,"app/model/collection/BundleCollection":39,"color":"color","underscore":"underscore"}],73:[function(require,module,exports){
/*global XMLHttpRequest */

// var _ = require("underscore");
// /** @type {module:underscore.string/lpad} */
// var classify = require("underscore.string/classify");

// var statusMsg = _.template("<%= status %> received from <%= url %> (<%= statusText %>)");
// var errMsg = _.template("'<%= errName %>' ocurred during request <%= url %>");

if (window.XMLHttpRequest && window.URL && window.Blob) {
	module.exports = function(url, progressFn) {
		return new Promise(function(resolve, reject) {
			var request = new XMLHttpRequest();
			request.open("GET", url, true);
			// request.timeout = 10000; // in milliseconds
			request.responseType = "blob";

			// if progressFn is supplied
			// - - - - - - - - - - - - - - - - - -
			if (progressFn) {
				request.onprogress = function(ev) {
					progressFn(ev.loaded / ev.total);
				};
			}
			// resolved/success
			// - - - - - - - - - - - - - - - - - -
			request.onload = function(ev) {
				// When the request loads, check whether it was successful
				if (request.status == 200) {
					// If successful, resolve the promise by passing back a reference url
					resolve(URL.createObjectURL(request.response));
				} else {
					var err = new Error(("http_" + request.statusText.replace(/\s/g, "_")).toUpperCase());
					err.infoCode = request.status;
					err.infoSrc = url;
					err.logEvent = ev;
					err.logMessage = "_loadImageAsObjectURL::" + ev.type + " [reject]";
					reject(err);
				}
			};
			// reject/failure
			// - - - - - - - - - - - - - - - - - -
			request.onerror = function(ev) {
				var err = new Error((ev.type + "_event").toUpperCase());
				err.infoCode = -1;
				err.infoSrc = url;
				err.logEvent = ev;
				err.logMessage = "_loadImageAsObjectURL::" + ev.type + " [reject]";
				reject(err);
			};
			request.onabort = request.ontimeout = request.onerror;
			// finally
			// - - - - - - - - - - - - - - - - - -
			request.onloadend = function() {
				request.onabort = request.ontimeout = request.onerror = void 0;
				request.onload = request.onloadend = void 0;
				if (progressFn) {
					request.onprogress = void 0;
				}
			};

			request.send();
		});
	};
} else {
	module.exports = function(url) {
		return Promise.resolve(url);
	};
}
},{}],74:[function(require,module,exports){
module.exports = function(image, resolveEmpty) {
	return new Promise(function(resolve, reject) {
		if (!(image instanceof window.HTMLImageElement)) {
			//reject(new Error("not an HTMLImageElement"));
			reject("Error: not an HTMLImageElement");
		} else if (image.complete && (image.src.length > 0 || resolveEmpty)) {
			// if (image.src === "") console.warn("_whenImageLoads resolved with empty src");
			// else console.log("_whenImageLoads resolve-sync", image.src);
			resolve(image);
		} else {
			var handlers = {
				load: function(ev) {
					// console.log("_whenImageLoads_dom resolve-async", ev.type, image.src);
					removeEventListeners();
					resolve(image);
				},
				error: function(ev) {
					var err = new Error("Loading failed (" + ev.type + " event)");
					err.infoCode = -1;
					err.infoSrc = image.src;
					err.logEvent = ev;
					err.logMessage = "_whenImageLoads::" + ev.type + " [reject]";
					removeEventListeners();
					reject(err);
				}
			};
			handlers.abort = handlers.error;
			var removeEventListeners = function() {
				for (var event in handlers) {
					if (handlers.hasOwnProperty(event)) {
						image.removeEventListener(event, handlers[event], false);
					}
				}
			};
			for (var event in handlers) {
				if (handlers.hasOwnProperty(event)) {
					image.addEventListener(event, handlers[event], false);
				}
			}
		}
	});
};

},{}],75:[function(require,module,exports){
/** @type {module:underscore} */
var _ = require("underscore");
/** @type {module:app/view/promise/_whenImageLoads} */
var _whenImageLoads = require("app/view/promise/_whenImageLoads");
/** @type {module:app/view/promise/_loadImageAsObjectURL} */
var _loadImageAsObjectURL = require("app/view/promise/_loadImageAsObjectURL");

// var isBlobRE = /^blob\:.*/;

// var logMessage = "%s::whenDefaultImageLoads [%s]: %s";

module.exports = function(view) {
	return new Promise(function(resolve, reject) {
		var source = view.model.get("source");
		if (source.has("prefetched")) {
			view.defaultImage.src = source.get("prefetched");
			_whenImageLoads(view.defaultImage)
				.then(
					function(targetEl) {
						// console.log(logMessage, view.cid, "resolved", "prefetched");
						resolve(view);
					});
		} else {
			view.mediaState = "pending";

			var sUrl = source.get("original");
			var progressFn = function(progress) {
				// console.log(logMessage, view.cid, "progress", progress);
				view.updateMediaProgress(progress, sUrl);
			};
			progressFn = _.throttle(progressFn, 100, {
				leading: true,
				trailing: false
			});
			_loadImageAsObjectURL(sUrl, progressFn)
				.then(
					function(url) {
						if (/^blob\:.*/.test(url)) {
							source.set("prefetched", url);
						}
						view.defaultImage.src = url;
						// URL.revokeObjectURL(url);
						return view.defaultImage;
					})
				.then(_whenImageLoads)
				.then(
					function(targetEl) {
						// console.log(logMessage, view.cid, "resolved", targetEl.src);
						view.on("view:removed", function() {
							var prefetched = source.get("prefetched");
							if (prefetched && /^blob\:/.test(prefetched)) {
								source.unset("prefetched", {
									silent: true
								});
								URL.revokeObjectURL(prefetched);
							}
						});
						// view.placeholder.removeAttribute("data-progress");
						// view.updateMediaProgress(imageUrl, "complete");
						resolve(view);
					},
					// 	})
					// .catch(
					function(err) {
						// console.warn(logMessage, view.cid, "rejected", err.message);
						// view.placeholder.removeAttribute("data-progress");
						// view.updateMediaProgress(imageUrl, progress);
						reject(err);
					});
		}
	});
};
},{"app/view/promise/_loadImageAsObjectURL":73,"app/view/promise/_whenImageLoads":74,"underscore":"underscore"}],76:[function(require,module,exports){
/* global Promise */
/** @type {module:app/view/base/ViewError} */
var ViewError = require("app/view/base/ViewError");

/** @type {module:app/view/base/ViewError} */
var whenViewIsAttached = require("app/view/promise/whenViewIsAttached");

function whenScrollingEnds(view) {
	return new Promise(function(resolve, reject) {
		var parent = view.parentView;
		if (parent === null) {
			console.error("%s::whenScrollingEnds [%s] (sync)", view.cid, "rejected", view.attached);
			reject(new ViewError(view, new Error("whenScrollingEnds: view has no parent")));
		} else if (!parent.scrolling) {
			// console.log("%s::whenScrollingEnds [%s] (sync)", view.cid, "resolved", view.attached);
			resolve(view);
		} else {
			var cleanup = function() {
				parent.off("view:scrollend", onScrollend);
				parent.off("view:remove", onRemove);
			};
			var onScrollend = function() {
				// console.log("%s::whenScrollingEnds [%s]", view.cid, "resolved", view.attached);
				cleanup();
				resolve(view);
			};
			var onRemove = function() {
				// console.log("%s::whenScrollingEnds [%s]", view.cid, "rejected", view.attached);
				cleanup();
				reject(new ViewError(view, new Error("whenScrollingEnds: view was removed")));
			};
			parent.on("view:scrollend", onScrollend);
			parent.on("view:remove", onRemove);
		}
	});
}

module.exports = function(view) {
	return Promise.resolve(view)
		.then(whenViewIsAttached)
		.then(whenScrollingEnds);
};

/*
module.exports = function(view) {
	return Promise.resolve(view)
		.then(function(view) {
			if (view.attached) {
				return view;
			} else {
				return new Promise(function(resolve, reject) {
					view.once("view:attached", function(view) {
						resolve(view);
					});
				});
			}
		})
		.then(function(view) {
			if (!view.parentView.scrolling) {
				return view;
			} else {
				return new Promise(function(resolve, reject) {
					var resolveOnScrollend = function() {
						// console.log("%s::whenScrollingEnds [%s]", view.cid, "resolved");
						view.off("view:remove", rejectOnRemove);
						resolve(view);
					};
					var rejectOnRemove = function(view) {
						// console.log("%s::whenScrollingEnds [%s]", view.cid, "rejected");
						view.parentView.off("view:scrollend", resolveOnScrollend);
						reject(new ViewError(view,
							new Error("whenSelectScrollingEnds: view was removed ("+ view.cid +")")));
					};
					view.parentView.once("view:scrollend", resolveOnScrollend);
					view.once("view:remove", rejectOnRemove);
				});
			}
		});
};
*/

},{"app/view/base/ViewError":59,"app/view/promise/whenViewIsAttached":79}],77:[function(require,module,exports){
/** @type {module:app/view/base/ViewError} */
var ViewError = require("app/view/base/ViewError");

// var logMessage = "%s::whenSelectionDistanceIs [%s]: %s";

/**
 * @param {module:app/view/base/View}
 * @param {number} distance
 */
module.exports = function(view, distance) {
	return new Promise(function(resolve, reject) {
		// if (!(view.model && view.model.collection)) {
		// 	reject(new ViewError(view, new Error("whenSelectionIsContiguous: model.collection is empty")));
		// }
		var model = view.model;
		var collection = model.collection;

		var check = function(n) { // Check indices for contiguity
			return Math.abs(collection.indexOf(model) - collection.selectedIndex) <= distance;
		};

		if (check()) {
			// console.log(logMessage, view.cid, "resolve", "sync");
			resolve(view);
		} else {
			var cleanupOnSettle = function() {
				// console.log(logMessage, view.cid, "cleanup", "async");
				collection.off("select:one select:none", resolveOnSelect);
				view.off("view:removed", rejectOnRemove);
			};
			var resolveOnSelect = function(model) {
				if (check()) {
					// console.log(logMessage, view.cid, "resolve", "async");
					cleanupOnSettle();
					resolve(view);
				}
			};
			var rejectOnRemove = function(view) {
				cleanupOnSettle();
				reject(new ViewError(view, new Error("whenSelectionDistanceIs: view was removed")));
			};
			collection.on("select:one select:none", resolveOnSelect);
			view.on("view:removed", rejectOnRemove);
		}
	});
};

},{"app/view/base/ViewError":59}],78:[function(require,module,exports){
// /** @type {module:app/view/base/ViewError} */
// var ViewError = require("app/view/base/ViewError");

/** @type {module:app/view/promise/whenSelectionDistanceIs} */
var whenSelectionDistanceIs = require("app/view/promise/whenSelectionDistanceIs");

/** @param {module:app/view/base/View} */
module.exports = function(view) {
	return whenSelectionDistanceIs(view, 1);
};
},{"app/view/promise/whenSelectionDistanceIs":77}],79:[function(require,module,exports){
module.exports = function(view) {
	return new Promise(function(resolve, reject) {
		if (view.attached) {
			resolve(view);
		} else {
			view.on("view:attached", function(view) {
				resolve(view);
			});
		}
	});
};

},{}],80:[function(require,module,exports){
module.exports = function(view) {
	return new Promise(function(resolve, reject) {
		if (!view.invalidated) {
			resolve(view);
		} else {
			view.once("view:render:after", function(view, flags) {
				resolve(view);
			});
		}
	});
};
},{}],81:[function(require,module,exports){
/**
 * @module app/view/render/CarouselRenderer
 */

/** @type {module:underscore} */
var _ = require("underscore");
// /** @type {module:backbone} */
// var Backbone = require("backbone");
/** @type {module:app/view/base/View} */
var View = require("app/view/base/View");
/** @type {module:underscore} */
var getBoxEdgeStyles = require("utils/css/getBoxEdgeStyles");

// FIXME: this fixup should not be done here
// /** @type {module:utils/net/toAbsoluteURL} */
// var toAbsoluteURL = require("utils/net/toAbsoluteURL");
// /** @type {string} */
// var ABS_APP_ROOT = toAbsoluteURL(require("app/control/Globals").APP_ROOT);

/**
 * @constructor
 * @type {module:app/view/render/CarouselRenderer}
 */
var CarouselRenderer = View.extend({

	/** @type {string} */
	cidPrefix: "carouselRenderer",
	/** @override */
	tagName: "div",
	/** @override */
	className: "carousel-item",
	/** @override */
	template: _.template("<div class=\"content sizing\"><%= name %></div>"),

	properties: {
		content: {
			get: function() {
				return this._content || (this._content = this.el.querySelector(".content"));
			},
		},
		sizing: {
			get: function() {
				return this._sizing || (this._sizing = this.el.querySelector(".sizing"));
			},
		}
	},

	/** @override */
	initialize: function(options) {
		if (this.model.attr("@classname") !== void 0) {
			var clsAttr = this.model.attr("@classname").split(" ");
			for (var i = 0; i < clsAttr.length; i++) {
				this.el.classList.add(clsAttr[i]);
			}
		}
		options.parentView && (this.parentView = options.parentView);
		this.metrics = {};
		this.metrics.content = {};
		this.createChildren();
		// this.enabled = !!options.enabled; // force bool
		this.setEnabled(!!options.enabled);
	},

	createChildren: function() {
		this.el.innerHTML = this.template(this.model.toJSON());
		// FIXME: this fixup should not be done here
		// FIXED: now done in xslt
		/*this.el.querySelectorAll("a[href]").forEach(function(el) {
			var url = toAbsoluteURL(el.getAttribute("href"));
			if (url.indexOf(ABS_APP_ROOT) !== 0) {
				el.setAttribute("target", "_blank");
			}
		});*/
	},

	/** @return {HTMLElement} */
	getSizingEl: function() {
		return this._sizing || (this._sizing = this.el.querySelector(".sizing"));
	},

	/** @return {HTMLElement} */
	getContentEl: function() {
		return this._content || (this._content = this.el.querySelector(".content"));
	},

	/** @return {this} */
	measure: function() {
		var sizing = this.getSizingEl();

		this.metrics = getBoxEdgeStyles(this.el, this.metrics);
		this.metrics.content = getBoxEdgeStyles(this.getContentEl(), this.metrics.content);

		sizing.style.maxWidth = "";
		sizing.style.maxHeight = "";

		this.metrics.content.x = sizing.offsetLeft + sizing.clientLeft;
		this.metrics.content.y = sizing.offsetTop + sizing.clientTop;
		this.metrics.content.width = sizing.clientWidth;
		this.metrics.content.height = sizing.clientHeight;

		return this;
	},

	/** @override */
	render: function() {
		this.measure();
		return this;
	},

	getSelectionDistance: function() {
		return Math.abs(this.model.collection.indexOf(this.model) - this.model.collection.selectedIndex);
	},
});

module.exports = CarouselRenderer;
},{"app/view/base/View":58,"underscore":"underscore","utils/css/getBoxEdgeStyles":107}],82:[function(require,module,exports){
/**
 * @module app/view/render/ClickableRenderer
 */

/** @type {module:app/view/render/LabelRenderer} */
var LabelRenderer = require("app/view/render/LabelRenderer");

/**
 * @constructor
 * @type {module:app/view/render/ClickableRenderer}
 */
var ClickableRenderer = LabelRenderer.extend({

	/** @type {string} */
	cidPrefix: "clickableRenderer",

	/** @override */
	events: {
		"click": function(ev) {
			this.trigger("renderer:click", this.model, ev);
		},
		"click a": function(ev) {
			ev.defaultPrevented || ev.preventDefault();
		}
	},
});

module.exports = ClickableRenderer;

},{"app/view/render/LabelRenderer":89}],83:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function";

  return "<a href=\"#"
    + container.escapeExpression(((helper = (helper = helpers.domid || (depth0 != null ? depth0.domid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"domid","hash":{},"data":data}) : helper)))
    + "\"><span class=\"label\">"
    + ((stack1 = ((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</span></a>";
},"useData":true});

},{"hbsfy/runtime":21}],84:[function(require,module,exports){
/**
 * @module app/view/render/DefaultSelectableRenderer
 */

/** @type {module:app/view/component/ClickableRenderer} */
var ClickableRenderer = require("app/view/render/ClickableRenderer");

/**
 * @constructor
 * @type {module:app/view/render/DefaultSelectableRenderer}
 */
var DefaultSelectableRenderer = ClickableRenderer.extend({

	/** @override */
	tagName: "li",
	/** @override */
	className: "list-item",
	/** @override */
	template: require("./DefaultSelectableRenderer.hbs"),

	initialize: function(options) {
		this.listenTo(this.model, "selected deselected", this._renderClassList);
		this._renderClassList();
	},

	/** @override */
	render: function() {
		this.el.innerHTML = this.template(this.model.toJSON());
		this._renderClassList();
		return this;
	},

	_renderClassList: function() {
		this.el.classList.toggle("selected", this.model.selected);
	},
});

module.exports = DefaultSelectableRenderer;

},{"./DefaultSelectableRenderer.hbs":83,"app/view/render/ClickableRenderer":82}],85:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<span class=\"label\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</span><a href=\"#"
    + alias4(((helper = (helper = helpers.domid || (depth0 != null ? depth0.domid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"domid","hash":{},"data":data}) : helper)))
    + "\"><b> </b></a>";
},"useData":true});

},{"hbsfy/runtime":21}],86:[function(require,module,exports){
/**
 * @module app/view/render/DotNavigationRenderer
 */

// /** @type {module:underscore} */
// var _ = require("underscore");
// /** @type {module:backbone} */
// var Backbone = require("backbone");
/** @type {string} */
var viewTemplate = require("./DotNavigationRenderer.hbs");
/** @type {module:app/view/component/ClickableRenderer} */
var ClickableRenderer = require("app/view/render/ClickableRenderer");

/**
 * @constructor
 * @type {module:app/view/render/DotNavigationRenderer}
 */
var DotNavigationRenderer = ClickableRenderer.extend({

	/** @type {string} */
	cidPrefix: "dotRenderer",
	/** @override */
	tagName: "li",
	/** @override */
	className: "list-item",
	/** @override */
	template: viewTemplate,

	/** @override */
	initialize: function(options) {
		this.listenTo(this.model, "selected deselected", this.renderClassList);
		this.renderClassList();
	},

	/** @override */
	render: function() {
		this.el.innerHTML = this.template(this.model.toJSON());
		this.renderClassList();
		return this;
	},

	renderClassList: function() {
		this.el.classList.toggle("selected", this.model.selected);
	},
});

module.exports = DotNavigationRenderer;

},{"./DotNavigationRenderer.hbs":85,"app/view/render/ClickableRenderer":82}],87:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"placeholder sizing\"></div>\n<img class=\"content media-border default\" alt=\""
    + alias4(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"text","hash":{},"data":data}) : helper)))
    + "\" longdesc=\"#desc_m"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" />\n";
},"useData":true});

},{"hbsfy/runtime":21}],88:[function(require,module,exports){
/**
 * @module app/view/render/ImageRenderer
 */

// /** @type {module:underscore} */
// var _ = require("underscore");
// /** @type {module:backbone} */
// var Backbone = require("backbone");

// /** @type {module:app/control/Globals} */
// var Globals = require("app/control/Globals");
// /** @type {module:app/model/item/MediaItem} */
// var MediaItem = require("app/model/item/MediaItem");

/** @type {module:app/view/MediaRenderer} */
var MediaRenderer = require("./MediaRenderer");

/** @type {Function} */
var viewTemplate = require("./ImageRenderer.hbs");

/**
 * @constructor
 * @type {module:app/view/render/ImageRenderer}
 */
var ImageRenderer = MediaRenderer.extend({

	/** @type {string} */
	cidPrefix: "imageRenderer",
	/** @type {string} */
	className: MediaRenderer.prototype.className + " image-renderer",
	/** @type {Function} */
	template: viewTemplate,

	/** @override */
	initialize: function(opts) {
		MediaRenderer.prototype.initialize.apply(this, arguments);
		// this.createChildren();
		// this.initializeAsync();
	},

	/* --------------------------- *
	/* children/layout
	/* --------------------------- */

	/** @override */
	createChildren: function() {
		MediaRenderer.prototype.createChildren.apply(this, arguments);
		// this.el.innerHTML = this.template(this.model.toJSON());
		this.placeholder = this.el.querySelector(".placeholder");
	},

	/** @override */
	render: function() {
		MediaRenderer.prototype.render.apply(this, arguments);

		// this.measure();

		var img = this.getDefaultImage();
		img.setAttribute("width", this.metrics.media.width);
		img.setAttribute("height", this.metrics.media.height);

		var content = this.getContentEl();
		content.style.left = this.metrics.content.x + "px";
		content.style.top = this.metrics.content.y + "px";

		// var sizing = this.getSizingEl();
		// sizing.style.maxWidth = this.metrics.content.width + "px";
		// sizing.style.maxHeight = this.metrics.content.height + "px";

		return this;
	},

	/* --------------------------- *
	/* initializeAsync
	/* --------------------------- */

	initializeAsync: function() {
		return MediaRenderer.prototype.initializeAsync.apply(this, arguments)
		// return MediaRenderer.whenSelectionIsContiguous(this)
		// // return Promise.resolve(this)
		// // 	.then(MediaRenderer.whenSelectionIsContiguous)
		// 	.then(MediaRenderer.whenSelectTransitionEnds)
		// 	.then(MediaRenderer.whenDefaultImageLoads)
		// .then(
		// 	function(view) {
		// 		view.mediaState = "ready";
		// 	})
		// .catch(
		// 	function(err) {
		// 		if (err instanceof ViewError) {
		// 			// NOTE: ignore ViewError type
		// 			// console.log(err.view.cid, err.view.model.cid, "ImageRenderer: " + err.message);
		// 		} else {
		// 			console.error(this.cid, err.name, err);
		// 			this.placeholder.innerHTML = "<p class=\"color-fg\" style=\"position:absolute;bottom:0;padding:3rem;\"><strong>" + err.name + "</strong> " + err.message + "</p>";
		// 			this.mediaState = "error";
		// 		}
		// 	}.bind(this))
		;
	},
});

module.exports = ImageRenderer;

},{"./ImageRenderer.hbs":87,"./MediaRenderer":90}],89:[function(require,module,exports){
/**
 * @module app/view/render/LabelRenderer
 */

/** @type {module:app/view/base/View} */
var View = require("app/view/base/View");

/**
 * @constructor
 * @type {module:app/view/render/LabelRenderer}
 */
var LabelRenderer = View.extend({

	/** @type {string} */
	cidPrefix: "labelRenderer",

	properties: {
		label: {
			get: function() {
				return this._label || (this._label = this.el.querySelector(".label"));
			}
		}
		// measuredWidth: {
		// 	get: function() {
		// 		return this._measuredWidth;
		// 	}
		// },
		// measuredHeight: {
		// 	get: function() {
		// 		return this._measuredHeight;
		// 	}
		// },
	},

	/* -------------------------------
	/* measure
	/* ------------------------------- */

	// _measuredWidth: null,
	// _measuredHeight: null,
	// measure: function() {},
});

module.exports = LabelRenderer;

},{"app/view/base/View":58}],90:[function(require,module,exports){
(function (DEBUG){
/*global XMLHttpRequest, HTMLMediaElement, MediaError*/
/**
 * @module app/view/render/MediaRenderer
 */

/** @type {module:underscore} */
var _ = require("underscore");
/** @type {module:underscore.strings/lpad} */
var lpad = require("underscore.string/lpad");
// /** @type {module:utils/css/getBoxEdgeStyles} */
// var getBoxEdgeStyles = require("utils/css/getBoxEdgeStyles");

/** @type {module:app/model/item/MediaItem} */
var MediaItem = require("app/model/item/MediaItem");
/** @type {module:app/view/CarouselRenderer} */
var CarouselRenderer = require("app/view/render/CarouselRenderer");

var errorTemplate = require("../template/ErrorBlock.hbs");

var MediaRenderer = CarouselRenderer.extend({

	/** @type {string} */
	cidPrefix: "mediaRenderer",
	/** @type {string} */
	className: CarouselRenderer.prototype.className + " media-item",
	/** @type {module:app/model/MediaItem} */
	model: MediaItem,

	properties: {
		defaultImage: {
			get: function() {
				return this._defaultImage || (this._defaultImage = this.el.querySelector("img.default"));
			}
		},
		mediaState: {
			get: function() {
				return this._mediaState;
			},
			set: function(state) {
				this._setMediaState(state);
			}
		}
	},

	/** @override */
	initialize: function(opts) {
		// if (this.model.attrs().hasOwnProperty("@classname")) {
		// 	this.el.className += " " + this.model.attr("@classname");
		// }

		// NOTE: @classname attr handling moved to CarouselRenderer
		// if (this.model.attr("@classname") !== void 0) {
		// 	var clsAttr = this.model.attr("@classname").split(" ");
		// 	for (var i = 0; i < clsAttr.length; i++) {
		// 		this.el.classList.add(clsAttr[i]);
		// 	}
		// }
		CarouselRenderer.prototype.initialize.apply(this, arguments);

		this.metrics.media = {};
		this.mediaState = "idle";

		this.initializeAsync()
			.then(this.whenInitialized)
			.catch(this.whenInitializeError.bind(this));
	},

	initializeAsync: function() {
		// var MediaRenderer = Object.getPrototypeOf(this).constructor;
		return Promise.resolve(this)
			.then(MediaRenderer.whenSelectionIsContiguous)
			.then(MediaRenderer.whenScrollingEnds)
			.then(MediaRenderer.whenDefaultImageLoads);
	},

	whenInitialized: function(view) {
		// console.log("%s::whenInitialized [%s]", view.cid, "resolved");
		view.mediaState = "ready";
		view.placeholder.removeAttribute("data-progress");
		return view;
	},

	whenInitializeError: function(err) {
		if (err instanceof CarouselRenderer.ViewError) {
			// NOTE: ignore ViewError type
			// console.log("%s::whenInitializeError", err.view.cid, err.message);
			return;
		} else if (err instanceof Error) {
			console.error(err.stack);
		}
		this.renderMediaError(err);
		this.placeholder.removeAttribute("data-progress");
		this.mediaState = "error";
		// this.placeholder.innerHTML = errorTemplate(err);
		// this.placeholder.removeAttribute("data-progress");
		// this.mediaState = "error";

		console.error("%s::initializeAsync [%s (caught)]: %s", this.cid, err.name,
			(err.info && err.info.logMessage) || err.message);
		err.logEvent && console.log(err.logEvent);
	},

	renderMediaError: function(err) {
		this.placeholder.innerHTML = err ? errorTemplate(err) : "";
	},

	updateMediaProgress: function(progress, id) {
		if (_.isNumber(progress)) {
			this.placeholder.setAttribute("data-progress", lpad(Math.floor(progress * 100), 2, '0'));
		}
		// else if (progress === "complete") {
		// 	this.placeholder.removeAttribute("data-progress");
		// }
	},

	// whenMediaIsReady: function(view) {
	// 	return MediaRenderer.whenDefaultImageLoads(this, this.updateMediaProgress.bind(this));
	// },

	/* --------------------------- *
	/* child getters
	/* --------------------------- */

	/** @return {HTMLElement} */
	getDefaultImage: function() {
		return this.defaultImage;
	},

	/* --------------------------- *
	/* children/layout
	/* --------------------------- */

	createChildren: function() {
		this.el.innerHTML = this.template(this.model.toJSON());
	},

	/** @override */
	measure: function() {
		CarouselRenderer.prototype.measure.apply(this, arguments);

		var sw, sh; // source dimensions
		var pcw, pch; // measured values
		var cx, cy, cw, ch, cs; // computed values
		var ew, eh; // content edge totals
		var cm; // content metrics

		cm = this.metrics.content;
		cx = cm.x;
		cy = cm.y;
		pcw = cm.width;
		pch = cm.height;

		ew = (cm.paddingLeft + cm.paddingRight + cm.borderLeftWidth + cm.borderRightWidth);
		eh = (cm.paddingTop + cm.paddingBottom + cm.borderTopWidth + cm.borderBottomWidth);
		pcw -= ew;
		pch -= eh;

		sw = this.model.get("source").get("w");
		sh = this.model.get("source").get("h");

		// Unless both client dimensions are larger than the source's
		// choose constraint direction by aspect ratio
		if (sw < pcw && sh < pch) {
			cs = 1;
			cw = sw;
			ch = sh;
			this.metrics.fitDirection = "both";
		} else if ((pcw / pch) < (sw / sh)) {
			// fit width
			cw = pcw;
			cs = cw / sw;
			// ch = cs * sh;
			ch = Math.round(cs * sh);
			this.metrics.fitDirection = "width";
		} else {
			// fit height
			ch = pch;
			cs = ch / sh;
			// cw = cs * sw;
			cw = Math.round(cs * sw);
			this.metrics.fitDirection = "height";
		}

		this.metrics.content.x = cx;
		this.metrics.content.y = cy;
		this.metrics.content.width = cw + ew;
		this.metrics.content.height = ch + eh;

		this.metrics.media.x = cx + cm.paddingLeft + cm.borderLeftWidth;
		this.metrics.media.y = cy + cm.paddingTop + cm.borderTopWidth;
		this.metrics.media.width = cw;
		this.metrics.media.height = ch;
		this.metrics.media.scale = cs;

		// console.log("%s::measure constraint: %s metrics: %o", this.cid, this.metrics.constraint, this.metrics);
		// var sizing = this.getSizingEl();
		// sizing.style.maxWidth = (cw + ew) + "px";
		// sizing.style.maxHeight = (ch + eh) + "px";

		return this;
	},

	render: function() {
		// NOTE: not calling super.render, calling measure ourselves
		this.measure();

		var sizing = this.getSizingEl();
		sizing.style.maxWidth = this.metrics.content.width + "px";
		sizing.style.maxHeight = this.metrics.content.height + "px";

		this.el.setAttribute("data-fit-dir", this.metrics.fitDirection);

		return this;
	},

	/* --------------------------- *
	/* mediaState
	/* --------------------------- */

	_mediaStateEnum: ["idle", "pending", "ready", "error"],

	_setMediaState: function(key) {
		if (this._mediaStateEnum.indexOf(key) === -1) {
			throw new Error("Argument " + key + " invalid. Must be one of: " + this._mediaStateEnum.join(", "));
		}
		if (this._mediaState !== key) {
			if (this._mediaState) {
				this.el.classList.remove(this._mediaState);
			}
			this.el.classList.add(key);
			this._mediaState = key;
			this.trigger("media:" + key);
		}
	},
}, {
	LOG_TO_SCREEN: true,

	/** @type {module:app/view/promise/whenSelectionIsContiguous} */
	whenSelectionIsContiguous: require("app/view/promise/whenSelectionIsContiguous"),

	// /** @type {module:app/view/promise/whenSelectTransitionEnds} */
	// whenSelectTransitionEnds: require("app/view/promise/whenSelectTransitionEnds"),

	/** @type {module:app/view/promise/whenScrollingEnds} */
	whenScrollingEnds: require("app/view/promise/whenScrollingEnds"),

	/** @type {module:app/view/promise/whenDefaultImageLoads} */
	whenDefaultImageLoads: require("app/view/promise/whenDefaultImageLoads"),
});

/* ---------------------------
/* log to screen
/* --------------------------- */
if (DEBUG) {

	MediaRenderer = (function(MediaRenderer) {
		if (!MediaRenderer.LOG_TO_SCREEN) return MediaRenderer;

		/** @type {Function} */
		var Color = require("color");
		// /** @type {module:underscore.string/lpad} */
		// var lpad = require("underscore.string/lpad");
		// /** @type {module:underscore.string/rpad} */
		// var rpad = require("underscore.string/rpad");

		return MediaRenderer.extend({

			/** @override */
			initialize: function() {
				MediaRenderer.prototype.initialize.apply(this, arguments);

				var fgColor = new Color(this.model.attr("color"));
				var bgColor = new Color(this.model.attr("background-color"));
				this.__logColors = {
					normal: fgColor.clone().mix(bgColor, 0.75).hslString(),
					ignored: fgColor.clone().mix(bgColor, 0.25).hslString(),
					error: "brown",
					abort: "orange"
				};
				this.__logFrameStyle = "1px dashed " + fgColor.clone().mix(bgColor, 0.5).hslString();
				this.__logStartTime = Date.now();
				this.__rafId = -1;
				this.__onFrame = this.__onFrame.bind(this);
			},

			initializeAsync: function() {
				return MediaRenderer.prototype.initializeAsync.apply(this, arguments).catch(function(err) {
					if (!(err instanceof MediaRenderer.ViewError)) {
						this.__logMessage(err.message, err.name, this.__logColors["error"]);
					}
					return Promise.reject(err);
				}.bind(this));
			},

			/** @override */
			createChildren: function() {
				var ret = MediaRenderer.prototype.createChildren.apply(this, arguments);

				this.__logElement = document.createElement("div");
				this.__logElement.className = "debug-log";
				this.__logHeaderEl = document.createElement("pre");
				this.__logHeaderEl.className = "log-header color-bg";
				// this.model.colors.fgColor.clone().mix(fgColor, 0.9).rgbString()
				// this.model.colors.fgColor.clone().alpha
				this.__logHeaderEl.textContent = this.__getHeaderText();
				this.__logElement.appendChild(this.__logHeaderEl);
				this.el.insertBefore(this.__logElement, this.el.firstElementChild);
				return ret;
			},

			/** @override */
			render: function() {
				MediaRenderer.prototype.render.apply(this, arguments);

				this.__logElement.style.marginTop = "3rem";
				this.__logElement.style.maxHeight = "calc(100% - " + (this.metrics.media.height) + "px - 3rem)";
				//this.__logElement.style.width = this.metrics.media.width + "px";
				this.__logElement.scrollTop = this.__logElement.scrollHeight;

				return this;
			},

			__logMessage: function(msg, logtype, color) {
				var logEntryEl = document.createElement("pre");

				logEntryEl.textContent = this.__getTStamp() + " " + msg;
				logEntryEl.setAttribute("data-logtype", logtype || "-");
				logEntryEl.style.color = color || this.__logColors[logtype] || this.__logColors.normal;

				this.__logElement.appendChild(logEntryEl);
				this.__logElement.scrollTop = this.__logElement.scrollHeight;

				if (this.__rafId == -1) {
					this.__rafId = this.requestAnimationFrame(this.__onFrame);
				}
			},

			__onFrame: function(tstamp) {
				this.__rafId = -1;
				this.__logElement.lastElementChild.style.borderBottom = this.__logFrameStyle;
				this.__logElement.lastElementChild.style.paddingBottom = "2px";
				this.__logElement.lastElementChild.style.marginBottom = "2px";
			},

			__getTStamp: function() {
				// return new Date(Date.now() - this.__logStartTime).toISOString().substr(11, 12);
				return lpad(((Date.now() - this.__logStartTime) / 1000).toFixed(3), 8, "0");
			},

			__getHeaderText: function() {
				return '';
			},
		});
	})(MediaRenderer);

} // end debug

/**
 * @constructor
 * @type {module:app/view/render/MediaRenderer}
 */
module.exports = MediaRenderer;
}).call(this,true)

},{"../template/ErrorBlock.hbs":100,"app/model/item/MediaItem":46,"app/view/promise/whenDefaultImageLoads":75,"app/view/promise/whenScrollingEnds":76,"app/view/promise/whenSelectionIsContiguous":78,"app/view/render/CarouselRenderer":81,"color":"color","underscore":"underscore","underscore.string/lpad":28}],91:[function(require,module,exports){
(function (GA){
/**
 * @module app/view/render/PlayableRenderer
 */

/** @type {module:underscore} */
var _ = require("underscore");
/** @type {Function} */
// var Color = require("color");

/** @type {module:app/view/MediaRenderer} */
var MediaRenderer = require("app/view/render/MediaRenderer");
// /** @type {module:app/view/component/ProgressMeter} */
// var ProgressMeter = require("app/view/component/ProgressMeter");

/** @type {Function} */
var prefixedProperty = require("utils/prefixedProperty");
/** @type {Function} */
var prefixedEvent = require("utils/prefixedEvent");

// var visibilityHiddenProp = prefixedProperty("hidden", document);
/** @type {String} */
var visibilityStateProp = prefixedProperty("visibilityState", document);
/** @type {String} */
var visibilityChangeEvent = prefixedEvent("visibilitychange", document, "hidden");

/** @type {Function} */
// var duotone = require("utils/canvas/bitmap/duotone");
// var stackBlurRGB = require("utils/canvas/bitmap/stackBlurRGB");
// var stackBlurMono = require("utils/canvas/bitmap/stackBlurMono");
// var getAverageRGBA = require("utils/canvas/bitmap/getAverageRGBA");
// var getAverageRGB = require("utils/canvas/bitmap/getAverageRGB");

// /** @type {HTMLCanvasElement} */
// var _sharedCanvas = null;
// /** @return {HTMLCanvasElement} */
// var getSharedCanvas = function() {
// 	if (_sharedCanvas === null) {
// 		_sharedCanvas = document.createElement("canvas");
// 	}
// 	return _sharedCanvas;
// };

// function logAttachInfo(view, name, level) {
// 	if (["log", "info", "warn", "error"].indexOf(level) != -1) {
// 		level = "log";
// 	}
// 	console[level].call(console, "%s::%s [parent:%s %s %s depth:%s]", view.cid, name, view.parentView && view.parentView.cid, view.attached ? "attached" : "detached", view._viewPhase, view.viewDepth);
// }

/**
 * @constructor
 * @type {module:app/view/render/PlayableRenderer}
 */
var PlayableRenderer = MediaRenderer.extend({

	/** @type {string} */
	cidPrefix: "playableRenderer",

	/** @type {string|Function} */
	className: MediaRenderer.prototype.className + " playable-renderer",

	properties: {
		paused: {
			/** @return {Boolean} */
			get: function() {
				return this._isMediaPaused();
			}
		},
		playbackRequested: {
			/** @return {Boolean} */
			get: function() {
				return this._playbackRequested;
			},
			set: function(value) {
				this._setPlaybackRequested(value);
			}
		},
		playToggle: {
			/** @return {HTMLElement} */
			get: function() {
				return this._playToggle || (this._playToggle = this.el.querySelector(".play-toggle"));
			}
		},
		overlay: {
			/** @return {HTMLElement} */
			get: function() {
				return this._overlay || (this._overlay = this.el.querySelector(".overlay"));
			}
		}
	},

	/** @override */
	initialize: function(opts) {
		MediaRenderer.prototype.initialize.apply(this, arguments);
		_.bindAll(this,
			"_onPlaybackToggle",
			"_onVisibilityChange"
		);
		this._setPlaybackRequested(this._playbackRequested);
		// this.listenTo(this, "view:parentChange", function(childView, newParent, oldParent) {
		// 	// logAttachInfo(this, "[view:parentChange]", "info");
		// 	console.info("%s::[view:parentChange] '%s' to '%s'", this.cid, oldParent && oldParent.cid, newParent && newParent.cid);
		// });
	},

	// /** @override */
	// initializeAsync: function() {
	// 	return MediaRenderer.prototype.initialize.initializeAsync.apply(this, arguments);
	// },

	// /** @override */
	// remove: function() {
	// 	MediaRenderer.prototype.remove.apply(this, arguments);
	// 	return this;
	// },

	/* --------------------------- *
	/* children/layout
	/* --------------------------- */

	// createChildren: function() {
	// 	this.el.innerHTML = this.template(this.model.toJSON());
	// 	this.placeholder = this.el.querySelector(".placeholder");
	// 	this.content = this.el.querySelector(".content");
	// 	this.image = this.content.querySelector("img.current");
	// },

	/* --------------------------- *
	/* setEnabled
	/* --------------------------- */

	/** @override */
	setEnabled: function(enabled) {
		MediaRenderer.prototype.setEnabled.apply(this, arguments);
		// this._validatePlayback(enabled);
		// if (enabled) {
		this._validatePlayback();
		// } else {
		// 	// if selected, pause media
		// 	this.model.selected && this.togglePlayback(false);
		// 	// this.togglePlayback(false);
		// }
	},

	/* ---------------------------
	/* selection handlers
	/* --------------------------- */

	addSelectionListeners: function() {
		if (this._viewPhase != "initialized")
			throw new Error(this.cid + "::addSelectionListeners called while " + this._viewPhase);

		// logAttachInfo(this, "addSelectionListeners", "log");
		// this.listenTo(this, "view:removed", this.removeSelectionListeners);
		this.listenTo(this.model, "selected", this._onModelSelected);
		this.listenTo(this.model, "deselected", this._onModelDeselected);
		if (this.model.selected) {
			this._onModelSelected();
		}
	},

	// removeSelectionListeners: function() {
	// 	// logAttachInfo(this, "removeSelectionListeners", "log");
	// 	this.stopListening(this, "view:removed", this.removeSelectionListeners);
	// 	this.stopListening(this.model, "selected", this._onModelSelected);
	// 	this.stopListening(this.model, "deselected", this._onModelDeselected);
	// 	if (this.model.selected) {
	// 		this._onModelDeselected();
	// 	}
	// },

	/* model selected handlers:
	/* model selection toggles playback
	/* --------------------------- */

	_onModelSelected: function() {
		console.log("%s::_onModelSelected _playbackRequested: %s, event: %s", this.cid, this._playbackRequested, this._toggleEvent);
		// logAttachInfo(this, "_onModelSelected", "log");
		// this._addParentListeners();
		this.listenTo(this, "view:parentChange", this._onParentChange);
		if (this.parentView) this._onParentChange(this, this.parentView, null);

		this._addDOMListeners();
		this._validatePlayback();
	},

	_onModelDeselected: function() {
		// logAttachInfo(this, "_onModelDeselected", "log");
		// this._removeParentListeners();
		this.stopListening(this, "view:parentChange", this._onParentChange);
		if (this.parentView) this._onParentChange(this, null, this.parentView);

		this._removeDOMListeners();
		this.togglePlayback(false);
		// this._validatePlayback(this.model.selected);
		// this._validatePlayback();
	},

	/* view:parentChange handlers 3
	/* --------------------------- */

	_onParentChange: function(childView, newParent, oldParent) {
		// console.log("[scroll] %s::_onParentChange '%s' to '%s'", this.cid, oldParent && oldParent.cid, newParent && newParent.cid);
		if (oldParent) this.stopListening(oldParent, "view:scrollstart view:scrollend", this._onScrollChange);
		if (newParent) this.listenTo(newParent, "view:scrollstart view:scrollend", this._onScrollChange);
	},

	_onScrollChange: function() {
		if (this.parentView === null) {
			this.togglePlayback(false);
			throw new Error(this.cid + "::_onScrollChange parentView is null");
		}
		// console.log("[scroll] %s::_onScrollChange %s.scrolling: %s", this.cid, this.parentView.cid, this.parentView.scrolling);

		// this._validatePlayback(!this.parentView.scrolling);
		// if (!this.parentView.scrolling) {
		this._validatePlayback();
		// } else {
		// 	this.togglePlayback(false);
		// }
	},

	/* view:parentChange handlers
	/* --------------------------- */

	/*_addParentListeners: function() {
		if (!this.parentView) {
			logAttachInfo(this, "_addParentListeners", "error");
			return;
		}
		this.listenTo(this, "view:remove", this._removeParentListeners);
		this.listenTo(this.parentView, "view:remove", this._removeParentListeners);
		this.listenTo(this.parentView, "view:scrollstart", this._onScrollStart);
		this.listenTo(this.parentView, "view:scrollend", this._onScrollEnd);
	},

	_removeParentListeners: function(view) {
		if (!this.parentView) {
			logAttachInfo(this, "_removeParentListeners", "error");
			return;
		}
		if (view !== void 0) {
			logAttachInfo(this, "_removeParentListeners [event source view]", "info");
			// console.info("%s[playable]::_removeParentListeners event source view: %s", this.cid, view && view.cid);
		}

		this.stopListening(this, "view:remove", this._removeParentListeners);
		this.stopListening(this.parentView, "view:remove", this._removeParentListeners);
		this.stopListening(this.parentView, "view:scrollstart", this._onScrollStart);
		this.stopListening(this.parentView, "view:scrollend", this._onScrollEnd);
	},*/

	/* view:scrollstart view:scrollend
	/* --------------------------- */

	/*_onScrollStart: function() {
		this.togglePlayback(false);
	},

	_onScrollEnd: function() {
		this._validatePlayback();
	},*/

	/* listen to DOM events
	/* --------------------------- */

	_addDOMListeners: function() {
		this.listenTo(this, "view:removed", this._removeDOMListeners);
		document.addEventListener(visibilityChangeEvent, this._onVisibilityChange, false);
		this.playToggle.addEventListener(this._toggleEvent, this._onPlaybackToggle, true);
	},

	_removeDOMListeners: function() {
		this.stopListening(this, "view:removed", this._removeDOMListeners);
		document.removeEventListener(visibilityChangeEvent, this._onVisibilityChange, false);
		this.playToggle.removeEventListener(this._toggleEvent, this._onPlaybackToggle, true);
	},

	/* visibility dom event
	/* --------------------------- */
	_onVisibilityChange: function(ev) {
		// this._validatePlayback(!document[visibilityHiddenProp]);
		// this._validatePlayback(document[visibilityStateProp] != "hidden");
		// if (document[visibilityStateProp] != "hidden") {
		this._validatePlayback();
		// } else {
		// 	this.togglePlayback(false);
		// }
	},

	/* --------------------------- *
	/* play-toggle
	/* --------------------------- */

	/** @type {String} */
	_toggleEvent: window.hasOwnProperty("onpointerup") ? "pointerup" : "mouseup",

	_onPlaybackToggle: function(ev) {
		console.log("%s[%sabled]::_onPlaybackToggle[%s] defaultPrevented: %s", this.cid, this.enabled ? "en" : "dis", ev.type, ev.defaultPrevented);
		// NOTE: Perform action if MouseEvent.button is 0 or undefined (0: left-button)
		if (this.enabled && !ev.defaultPrevented && !ev.button) {
			ev.preventDefault();
			this.playbackRequested = !this.playbackRequested;
		}
	},

	/* --------------------------- *
	/* playbackRequested
	/* --------------------------- */

	/** @type {Boolean?} */
	_playbackRequested: null,

	_setPlaybackRequested: function(value) {
		this._playbackRequested = value;

		var classList = this.content.classList;
		classList.toggle("playing", value === true);
		classList.toggle("paused", value === false);
		classList.toggle("requested", value === true || value === false);

		// this._validatePlayback(this.playbackRequested);
		// if (this.playbackRequested) {
		this._validatePlayback();
		// } else {
		// 	this.togglePlayback(false);
		// }
	},

	/* --------------------------- *
	/* togglePlayback
	/* --------------------------- */

	/** @override */
	togglePlayback: function(newPlayState) {
		// console.log("[scroll] %s::togglePlayback [%s -> %s] (requested: %s)", this.cid,
		// 		(this._isMediaPaused()? "pause" : "play"),
		// 		(newPlayState? "play" : "pause"),
		// 		this.playbackRequested
		// 	);
		if (_.isBoolean(newPlayState) && newPlayState !== this._isMediaPaused()) {
			return; // requested state is current, do nothing
		} else {
			newPlayState = this._isMediaPaused();
		}
		if (newPlayState) { // changing to what?
			this._playMedia();
		} else {
			this._pauseMedia();
		}
	},

	_canResumePlayback: function() {
		return !!(
			this.enabled &&
			this.model.selected &&
			this.playbackRequested &&
			(this.mediaState === "ready") &&
			this.attached &&
			(this.parentView !== null) &&
			(!this.parentView.scrolling) &&
			(document[visibilityStateProp] != "hidden")
		);
	},

	_validatePlayback: function(shortcircuit) {
		// a 'shortcircuit' boolean argument can be passed, and if false,
		// skip _canResumePlayback and pause playback right away
		if (arguments.length != 0 && !shortcircuit) {
			this.togglePlayback(false);
		} else {
			this.togglePlayback(this._canResumePlayback());
		}
	},

	/* --------------------------- *
	/* abstract
	/* --------------------------- */

	_isMediaPaused: function() {
		console.warn("%s::_isMediaPaused Not implemented", this.cid);
		return true;
	},

	_playMedia: function() {
		console.warn("%s::_playMedia Not implemented", this.cid);
	},

	_pauseMedia: function() {
		console.warn("%s::_pauseMedia Not implemented", this.cid);
	},

	/* --------------------------- *
	/* util
	/* --------------------------- */

	updateOverlay: function(mediaEl, targetEl, rectEl) {
		// // this method is not critical, just catch and log all errors
		// try {
		// 	this._updateOverlay(mediaEl, targetEl, rectEl)
		// } catch (err) {
		// 	console.error("%s::updateOverlay", this.cid, err);
		// }
	},

	_drawMediaElement: function(context, mediaEl, dest) {
		// destination rect
		// NOTE: mediaEl is expected to have the same dimensions in this.metrics.media
		mediaEl || (mediaEl = this.defaultImage);
		dest || (dest = {
			x: 0,
			y: 0,
			width: this.metrics.media.width,
			height: this.metrics.media.height
		});

		// native/display scale
		var sW = this.model.get("source").get("w"),
			sH = this.model.get("source").get("h"),
			rsX = sW / this.metrics.media.width,
			rsY = sH / this.metrics.media.height;

		// dest, scaled to native
		var src = {
			x: Math.max(0, dest.x * rsX),
			y: Math.max(0, dest.y * rsY),
			width: Math.min(sW, dest.width * rsX),
			height: Math.min(sH, dest.height * rsY)
		};

		// resize canvas
		// var canvas = context.canvas;
		// if (canvas.width !== dest.width || canvas.height !== dest.height) {
		// 	canvas.width = dest.width;
		// 	canvas.height = dest.height;
		// }
		context.canvas.width = dest.width;
		context.canvas.height = dest.height;

		// copy image to canvas
		context.clearRect(0, 0, dest.width, dest.height);
		context.drawImage(mediaEl,
			src.x, src.y, src.width, src.height,
			0, 0, dest.width, dest.height // destination rect
		);

		return context;
	},

	/*
	_updateOverlay: function(mediaEl, targetEl, rectEl) {
		// src/dest rects
		// ------------------------------
		rectEl || (rectEl = targetEl);

		// NOTE: does not work with svg element
		// var tRect = rectEl.getBoundingClientRect();
		// var cRect = mediaEl.getBoundingClientRect();
		// var tX = tRect.x - cRect.x,
		// 	tY = tRect.y - cRect.y,
		// 	tW = tRect.width,
		// 	tH = tRect.height;

		// target bounds
		var tX = rectEl.offsetLeft,
			tY = rectEl.offsetTop,
			tW = rectEl.offsetWidth,
			tH = rectEl.offsetHeight;

		if (tX === void 0 || tY === void 0 || tW === void 0 || tH === void 0) {
			return;
		}

		// destination rect
		var RECT_GROW = 20;
		var dest = {
			x: tX - RECT_GROW,
			y: tY - RECT_GROW,
			width: tW + RECT_GROW * 2,
			height: tH + RECT_GROW * 2
		};

		// native/display scale
		var sW = this.model.get("w"),
			sH = this.model.get("h"),
			rsX = sW/this.metrics.media.width,
			rsY = sH/this.metrics.media.height;

		// dest, scaled to native
		var src = {
			x: Math.max(0, dest.x * rsX),
			y: Math.max(0, dest.y * rsY),
			width: Math.min(sW, dest.width * rsX),
			height: Math.min(sH, dest.height * rsY)
		};

		// Copy image to canvas
		// ------------------------------
		var canvas, context, imageData;

		// canvas = document.createElement("canvas");
		// canvas.style.width  = dest.width + "px";
		// canvas.style.height = dest.height + "px";

		canvas = getSharedCanvas();
		if (canvas.width !== dest.width || canvas.height !== dest.height) {
			canvas.width = dest.width;
			canvas.height = dest.height;
		}
		context = canvas.getContext("2d");
		context.clearRect(0, 0, dest.width, dest.height);
		context.drawImage(mediaEl,
			src.x, src.y, src.width, src.height,
			0, 0, dest.width, dest.height // destination rect
		);
		imageData = context.getImageData(0, 0, dest.width, dest.height);

		var avgColor = Color().rgb(getAverageRGB(imageData));
		// var avgHex = avgColor.hexString(), els = this.el.querySelectorAll("img, video");
		// for (var i = 0; i < els.length; i++) {
		// 	els.item(i).style.backgroundColor = avgHex;
		// }

		targetEl.classList.toggle("over-dark", avgColor.dark());

		// console.log("%s::updateOverlay() avgColor:%s (%s)", this.cid, avgColor.rgbString(), avgColor.dark()?"dark":"light", targetEl);

		// Color, filter opts
		// ------------------------------

		// this.fgColor || (this.fgColor = new Color(this.model.attr("color")));
		// this.bgColor || (this.bgColor = new Color(this.model.attr("background-color")));
		//
		// var opts = { radius: 20 };
		// var isFgDark = this.fgColor.luminosity() < this.bgColor.luminosity();
		// opts.x00 = isFgDark? this.fgColor.clone().lighten(0.5) : this.bgColor.clone().darken(0.5);
		// opts.xFF = isFgDark? this.bgColor.clone().lighten(0.5) : this.fgColor.clone().darken(0.5);
		//
		// stackBlurMono(imageData, opts);
		// duotone(imageData, opts);
		// stackBlurRGB(imageData, { radius: 20 });
		//
		// context.putImageData(imageData, 0, 0);
		// targetEl.style.backgroundImage = "url(" + canvas.toDataURL() + ")";
	}*/
});

/* ---------------------------
/* Google Analytics
/* --------------------------- */
if (GA) {
	PlayableRenderer = (function(PlayableRenderer) {

		/** @type {module:underscore.strings/dasherize} */
		var dasherize = require("underscore.string/dasherize");

		// var readyEvents = ["playing", "waiting", "ended"];
		// var userEvents = ["play", "pause"];


		return PlayableRenderer.extend({

			/** @override */
			initialize: function() {
				var retval = PlayableRenderer.prototype.initialize.apply(this, arguments);
				this._playbackRequestedDefault = this.playbackRequested;
				return retval;
			},

			_onPlaybackToggle: function(ev) {
				var retval = PlayableRenderer.prototype._onPlaybackToggle.apply(this, arguments);
				var o = {
					hitType: "event",
					eventCategory: dasherize(this.cidPrefix),
					eventAction: this.playbackRequested ? "play" : "pause",
					eventLabel: this.model.get("text"),
				};
				if (this._playbackRequestedDefault)
					o.eventAction += "-autoplay";
				window.ga("send", o);
				return retval;
			},

			// /** @override */
			// togglePlayback: function(newPlayState) {
			// 	var retval = PlayableRenderer.prototype.togglePlayback.apply(this, arguments);
			// 	window.ga("send", {
			// 		hitType: "event",
			// 		eventCategory: "Playable",
			// 		eventAction: this.playbackRequested ? "play" : "pause",
			// 		eventLabel: this.model.get("text"),
			// 	});
			// 	return retval;
			// },
		});
	})(PlayableRenderer);
}

// if (DEBUG) {
//
// PlayableRenderer = (function(PlayableRenderer) {
// 	if (!PlayableRenderer.LOG_TO_SCREEN) return PlayableRenderer;
//
// 	/** @type {module:underscore.strings/lpad} */
// 	var lpad = require("underscore.string/lpad");
//
// 	return PlayableRenderer.extend({
// 		_canResumePlayback: function() {
// 			var retval = PlayableRenderer.prototype._canResumePlayback.apply(this.arguments);
// 			console.log("[scroll] %s::_canResumePlayback():%s", this.cid, retval,
// 			{
// 				"enabled": this.enabled,
// 				"selected": (!!this.model.selected),
// 				"playbackRequested": this.playbackRequested,
// 				"attached": this.attached,
// 				"parentView": (this.parentView && this.parentView.cid),
// 				"!scrolling": (this.parentView && !this.parentView.scrolling),
// 				"mediaState": this.mediaState,
// 				// "!document.hidden": !document[visibilityHiddenProp],
// 				"visibilityState": document[visibilityStateProp]
// 			});
// 			return retval;
// 		},
// 	});
// })(PlayableRenderer);
//
// }

module.exports = PlayableRenderer;
}).call(this,true)

},{"app/view/render/MediaRenderer":90,"underscore":"underscore","underscore.string/dasherize":23,"utils/prefixedEvent":112,"utils/prefixedProperty":113}],92:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"placeholder sizing\"></div>\n<div class=\"content\">\n	<div class=\"media-border content-size\"></div>\n	<div class=\"controls content-size\">\n		<canvas class=\"progress-meter\"></canvas>\n	</div>\n	<div class=\"sequence media-size\">\n		<img class=\"sequence-step current default\" alt=\""
    + alias4(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"text","hash":{},"data":data}) : helper)))
    + "\" longdesc=\"#desc_m"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" />\n	</div>\n	<div class=\"overlay media-size\">\n		<div class=\"play-toggle-hitarea play-toggle\">\n		</div>\n	</div>\n</div>\n";
},"useData":true});

},{"hbsfy/runtime":21}],93:[function(require,module,exports){
(function (DEBUG){
/**
 * @module app/view/render/SequenceRenderer
 */

/* --------------------------- *
/* Imports
/* --------------------------- */

/** @type {module:underscore} */
var _ = require("underscore");
// /** @type {module:backbone} */
// var Backbone = require("backbone");
/** @type {module:backbone.babysitter} */
var Container = require("backbone.babysitter");

/** @type {module:app/view/base/View} */
var View = require("app/view/base/View");
/** @type {module:app/view/render/PlayableRenderer} */
var PlayableRenderer = require("app/view/render/PlayableRenderer");
// /** @type {module:app/model/SelectableCollection} */
// var SelectableCollection = require("app/model/SelectableCollection");
/** @type {module:app/control/Globals} */
var Globals = require("app/control/Globals");

/** @type {module:app/view/component/ProgressMeter} */
var ProgressMeter = require("app/view/component/ProgressMeter");

/** @type {module:utils/Timer} */
var Timer = require("utils/Timer");
// /** @type {Function} */
// var transitionEnd = require("utils/event/transitionEnd");
// /** @type {module:utils/prefixedProperty} */
// var prefixed = require("utils/prefixedProperty");

/** @type {Function} */
var _whenImageLoads = require("app/view/promise/_whenImageLoads");
/** @type {module:app/view/promise/_loadImageAsObjectURL} */
var _loadImageAsObjectURL = require("app/view/promise/_loadImageAsObjectURL");
/** @type {Function} */
var whenSelectionDistanceIs = require("app/view/promise/whenSelectionDistanceIs");
// var whenSelectTransitionEnds = require("app/view/promise/whenSelectTransitionEnds");
// var whenDefaultImageLoads = require("app/view/promise/whenDefaultImageLoads");

// /** @type {Function} */
// var Color = require("color");
// var duotone = require("utils/canvas/bitmap/duotone");
// var stackBlurRGB = require("utils/canvas/bitmap/stackBlurRGB");
// var stackBlurMono = require("utils/canvas/bitmap/stackBlurMono");
// var getAverageRGBA = require("utils/canvas/bitmap/getAverageRGBA");

var errorTemplate = require("../template/ErrorBlock.hbs");

var MIN_STEP_INTERVAL = 2 * Globals.TRANSITION_DURATION + Globals.TRANSITION_DELAY_INTERVAL;
var DEFAULT_STEP_INTERVAL = 6 * Globals.TRANSITION_DURATION + Globals.TRANSITION_DELAY_INTERVAL;


/* --------------------------- *
/* Private classes
/* --------------------------- */

// /**
// * @constructor
// * @type {module:app/view/render/SequenceRenderer.SourceCollection}
// */
// var SourceCollection = SelectableCollection.extend({
// 	model: Backbone.Model
// });

/**
 * @constructor
 * @type {module:app/view/render/SequenceRenderer.PrefetechedSourceRenderer}
 */
var PrefetechedSourceRenderer = View.extend({

	cidPrefix: "sequenceStepRenderer",
	/** @type {string} */
	className: "sequence-step",
	/** @type {string} */
	tagName: "img",

	properties: {
		ready: {
			get: function() {
				return this._ready;
			}
		}
	},

	/** @override */
	initialize: function(options) {
		!this.el.hasAttribute("alt") && this.el.setAttribute("alt", this.model.get("src"));
		// this.el.setAttribute("longdesc", this.model.get("original"));

		if (this.model.has("prefetched")) {
			this._renderPrefetched();
		} else {
			this.listenTo(this.model, "change:prefetched", this._renderPrefetched);
		}
		this.listenTo(this.model, "selected deselected", this._renderSelection);
		this._renderSelection();
	},

	_renderSelection: function() {
		this.el.classList.toggle("current", !!this.model.selected);
	},

	_renderPrefetched: function() {
		var prefetched = this.model.get("prefetched");
		if (prefetched !== this.el.src) {
			this.el.src = prefetched;
		}
		_whenImageLoads(this.el).then(
			function(el) {
				this.requestAnimationFrame(function(tstamp) {
					this._setReady(true);
				});
			}.bind(this),
			function(err) {
				// this._setReady(false);
				(err instanceof Error) || (err = new Error("cannot load prefetched url"));
				throw err;
			}.bind(this)
		);
	},

	/** @type {boolean} */
	_ready: false,

	_setReady: function(ready) {
		if (this._ready === ready) return;
		this._ready = !!(ready); // make bool
		this.trigger("renderer:ready", this);
	},

	render: function() {
		// if (this.model.has("prefetched")) {
		// 	this._renderPrefetched();
		// }
		// this.el.classList.toggle("current", !!this.model.selected);
		console.log("%s::render", this.cid);
		return this;
	},
});

/**
 * @constructor
 * @type {module:app/view/render/SequenceRenderer.SimpleSourceRenderer}
 */
// var SimpleSourceRenderer = View.extend({
//
// 	cidPrefix: "sequenceStepRenderer",
// 	/** @type {string} */
// 	className: "sequence-step",
// 	/** @type {string} */
// 	tagName: "img",
//
// 	/** @override */
// 	initialize: function (options) {
// 		// this.el.classList.toggle("current", this.model.hasOwnProperty("selected"));
// 		this.el.classList.toggle("current", !!this.model.selected);
// 		this.listenTo(this.model, {
// 			"selected": function () {
// 				this.el.classList.add("current");
// 			},
// 			"deselected": function () {
// 				this.el.classList.remove("current");
// 			}
// 		});
// 		if (this.el.src === "") {
// 			this.el.src = Globals.MEDIA_DIR + "/" + this.model.get("src");
// 		}
//
// 		if (this.model.has("error")) {
// 			this._onModelError();
// 		} else {
// 			this.listenToOnce(this.model, "change:error", this._onModelError);
// 			// this.listenToOnce(this.model, {
// 			// 	"change:source": this._onModelSource,
// 			// 	"change:error": this._onModelError,
// 			// });
// 		}
// 	},
//
// 	// _onModelSource: function() {
// 	// 	this.el.src = Globals.MEDIA_DIR + "/" + this.model.get("src");
// 	// 	// console.log("%s::change:src", this.cid, this.model.get("src"));
// 	// },
//
// 	_onModelError: function() {
// 		var err = this.model.get("error");
// 		var errEl = document.createElement("div");
// 		errEl.className = "error color-bg" + (this.model.selected? " current" : "");
// 		errEl.innerHTML = errorTemplate(err);
// 		this.setElement(errEl, true);
// 		console.log("%s::change:error", this.cid, err.message, err.infoSrc);
// 	},
// });

var SourceErrorRenderer = View.extend({

	/** @type {string} */
	className: "sequence-step error",
	/** @override */
	cidPrefix: "sourceErrorRenderer",
	/** @override */
	template: errorTemplate,
	/** @type {boolean} */
	ready: true,

	initialize: function(options) {
		// var handleSelectionChange = function onSelectionChange () {
		// 	this.el.classList.toggle("current", !!this.model.selected);
		// };
		// this.listenTo(this.model, "selected deselected", handleSelectionChange);
		// // this.el.classList.toggle("current", !!this.model.selected);
		// handleSelectionChange.call(this);
		this.listenTo(this.model, "selected deselected", function() {
			this.el.classList.toggle("current", !!this.model.selected);
		});
	},

	render: function() {
		this.el.classList.toggle("current", !!this.model.selected);
		this.el.innerHTML = this.template(this.model.get("error"));
		return this;
	},
});

var SequenceStepRenderer = PrefetechedSourceRenderer;
// var SequenceStepRenderer = SimpleSourceRenderer;

/**
 * @constructor
 * @type {module:app/view/render/SequenceRenderer}
 */
var SequenceRenderer = PlayableRenderer.extend({

	/** @type {string} */
	cidPrefix: "sequenceRenderer",
	/** @type {string} */
	className: PlayableRenderer.prototype.className + " sequence-renderer",
	/** @type {Function} */
	template: require("./SequenceRenderer.hbs"),

	/* --------------------------- *
	/* initialize
	/* --------------------------- */

	initialize: function() {
		this.sources = this.model.get("sources");
		PlayableRenderer.prototype.initialize.apply(this, arguments);
	},

	initializeAsync: function() {
		return PlayableRenderer.prototype.initializeAsync.apply(this, arguments)
			.then(
				function(view) {
					return view.whenAttached();
				})
			.then(function(view) {
				view.initializePlayable();
				view.updateOverlay(view.defaultImage, view.overlay);
				view.addSelectionListeners();
				return view;
			});
	},

	whenInitialized: function(view) {
		var retval = PlayableRenderer.prototype.whenInitialized.apply(this, arguments);
		view._validatePlayback();
		return retval;
	},

	/* --------------------------- *
	/* children
	/* --------------------------- */

	/** @override */
	createChildren: function() {
		PlayableRenderer.prototype.createChildren.apply(this, arguments);

		this.placeholder = this.el.querySelector(".placeholder");
		this.sequence = this.content.querySelector(".sequence");

		this.content.classList.add("started");

		// styles
		// ---------------------------------
		var s, attrs = this.model.attrs();
		// var s, attrs = this.model.get("attrs");
		s = _.pick(attrs, "box-shadow", "border", "border-radius");
		_.extend(this.content.querySelector(".media-border").style, s);
		s = _.pick(attrs, "border-radius");
		_.extend(this.sequence.style, s);
		_.extend(this.placeholder.style, s);

		// model
		// ---------------------------------
		this.sources.select(this.model.get("source"));

		// itemViews
		// ---------------------------------
		this.itemViews = new Container();
		// add default image as renderer (already in DOM)
		this.itemViews.add(new SequenceStepRenderer({
			el: this.getDefaultImage(),
			model: this.sources.selected
		}));
	},

	/* --------------------------- *
	/* layout
	/* --------------------------- */

	/** @override */
	render: function() {
		PlayableRenderer.prototype.render.apply(this, arguments);

		var els, el, i, cssW, cssH;
		var content = this.content;

		// media-size
		// ---------------------------------
		cssW = this.metrics.media.width + "px";
		cssH = this.metrics.media.height + "px";

		els = this.el.querySelectorAll(".media-size");
		for (i = 0; i < els.length; i++) {
			el = els.item(i);
			el.style.width = cssW;
			el.style.height = cssH;
		}
		content.style.width = cssW;
		content.style.height = cssH;

		// content-position
		// ---------------------------------
		var cssX, cssY;
		cssX = this.metrics.content.x + "px";
		cssY = this.metrics.content.y + "px";
		content.style.left = cssX;
		content.style.top = cssY;

		el = this.el.querySelector(".controls");
		// el.style.left = cssX;
		// el.style.top = cssY;
		el.style.width = this.metrics.content.width + "px";
		el.style.height = this.metrics.content.height + "px";

		// // content-size
		// // ---------------------------------
		// cssW = this.metrics.content.width + "px";
		// cssH = this.metrics.content.height + "px";
		//
		// els = this.el.querySelectorAll(".content-size");
		// for (i = 0; i < els.length; i++) {
		// 	el = els.item(i);
		// 	el.style.width = cssW;
		// 	el.style.height = cssH;
		// }

		return this;
	},

	initializePlayable: function() {
		// Sequence model
		// ---------------------------------
		// this.sources = this._createSourceCollection(this.model);
		whenSelectionDistanceIs(this, 0).then(this._preloadAllItems, function(err) {
			if (err instanceof View.ViewError) { // Ignore ViewError
				// console.warn(err.name, err.message);//, err.view.cid);
				return;
			}
			return err;
		});

		// timer
		// ---------------------------------
		this._sequenceInterval = Math.max(parseInt(this.model.attr("@sequence-interval")), MIN_STEP_INTERVAL) || DEFAULT_STEP_INTERVAL;

		this.timer = new Timer();
		this.listenTo(this, "view:removed", function() {
			this.timer.stop();
			this.stopListening(this.timer);
		});
		this.listenTo(this.timer, {
			"start": this._onTimerStart,
			"resume": this._onTimerResume,
			"pause": this._onTimerPause,
			"end": this._onTimerEnd,
			// "stop": function () { // stop is only called on view remove},
		});

		// progress-meter model
		// ---------------------------------
		this._sourceProgressByIdx = this.sources.map(function() {
			return 0;
		});
		this._sourceProgressByIdx[0] = 1; // first item is already loaded

		// progress-meter
		// ---------------------------------
		this.progressMeter = new ProgressMeter({
			el: this.el.querySelector(".progress-meter"),
			values: {
				available: this._sourceProgressByIdx.concat(),
			},
			maxValues: {
				amount: this.sources.length,
				available: this.sources.length,
			},
			color: this.model.attr("color"),
			backgroundColor: this.model.attr("background-color"),
			labelFn: this._progressLabelFn.bind(this)
		});

		// this.el.querySelector(".top-bar")
		//		.appendChild(this.progressMeter.render().el);
	},

	_progressLabelFn: function() {
		if (this.playbackRequested === false) return Globals.PAUSE_CHAR;
		return (this.sources.selectedIndex + 1) + "/" + this.sources.length;
	},

	_preloadAllItems: function(view) {
		view.once("view:remove", function() {
			var silent = {
				silent: true
			};
			view.sources.forEach(function(item, index, sources) {
				var prefetched = item.get("prefetched");
				if (prefetched && /^blob\:/.test(prefetched)) {
					item.unset("prefetched", silent);
					item.set("progress", 0, silent);
					URL.revokeObjectURL(prefetched);
				}
			});
		});
		return view.sources.reduce(function(lastPromise, item, index, sources) {
			return lastPromise.then(function(view) {
				if (item.has("prefetched")) {
					view._updateItemProgress(1, index);
					return view;
				} else {
					return _loadImageAsObjectURL(item.get("original"),
							function(progress) {
								view._updateItemProgress(progress, index);
								item.set("progress", progress);
							})
						.then(
							function(pUrl) {
								view._updateItemProgress(1, index);
								item.set({
									prefetched: pUrl,
									progress: 1
								});
								// item.set("prefetched", pUrl);
								return view;
							},
							function(err) {
								view._updateItemProgress(0, index);
								item.set({
									error: err,
									progress: 0
								});
								// item.set("error", err);
								return view;
							}
						);
				}
			});
		}, Promise.resolve(view));
	},

	// _preloadAllItems2: function(view) {
	// 	return view.sources.reduce(function(lastPromise, item, index, sources) {
	// 		return lastPromise.then(function(view) {
	// 			var itemView = view._getItemRenderer(item);
	// 			return _whenImageLoads(itemView.el).then(function(url){
	// 				view._updateItemProgress(1, index);
	// 				return view;
	// 			}, function(err) {
	// 				view._updateItemProgress(0, index);
	// 				item.set("error", err);
	// 				return view;
	// 			});
	// 		});
	// 	}, Promise.resolve(view));
	// },

	// _getItemRenderer: function(item) {}

	_updateItemProgress: function(progress, index) {
		this._sourceProgressByIdx[index] = progress;
		if (this.progressMeter) {
			this.progressMeter.valueTo(this._sourceProgressByIdx, 300, "available");
		}
	},

	/* ---------------------------
	/* PlayableRenderer implementation
	/* --------------------------- */

	/** @override initial value */
	_playbackRequested: true,

	/** @type {Boolean} internal store */
	_paused: true,

	/** @override */
	_isMediaPaused: function() {
		return this._paused;
	},

	/** @override */
	_playMedia: function() {
		if (!this._paused) return;
		this._paused = false;
		if (this.timer.status == Timer.PAUSED) {
			this.timer.start(); // resume, actually
		} else {
			this.timer.start(this._sequenceInterval);
		}
	},

	/** @override */
	_pauseMedia: function() {
		if (this._paused) return;
		this._paused = true;
		if (this.timer.status == Timer.STARTED) {
			this.timer.pause();
		}
	},

	/* --------------------------- *
	/* sequence private
	/* --------------------------- */

	_onTimerStart: function(duration) {
		this.progressMeter.valueTo(this.sources.selectedIndex + 1, duration, "amount");
		// init next renderer now to have smooth transitions
		this._getItemRenderer(this.sources.followingOrFirst());
	},

	_onTimerResume: function(duration) {
		this.progressMeter.valueTo(this.sources.selectedIndex + 1, duration, "amount");
	},

	_onTimerPause: function(duration) {
		// var meterDur = this.progressMeter._valueData["amount"]._duration - this.progressMeter._valueData["amount"]._elapsedTime;
		// var meterVal = this.progressMeter.getRenderedValue("amount");
		// var timerVal = (this._sequenceInterval - duration) / this._sequenceInterval + this.sources.selectedIndex;
		//
		// console.log("%s::_onTimerPause [interval:%sms]\n\tmeter:%s (%sms)\n\ttimer:%s (%sms)\n\tdiffs:%s (%sms)",
		// 		this.cid, this._sequenceInterval,
		// 		meterVal, meterDur,
		// 		timerVal, duration,
		// 		Math.abs(meterVal-timerVal), Math.abs(meterDur-duration));

		// this.progressMeter.valueTo(timerVal);
		// this.progressMeter.valueTo(meterVal);

		this.progressMeter.valueTo(this.progressMeter.getRenderedValue("amount"), 0, "amount");
	},

	_onTimerEnd: function() {
		var context = this;
		var nextSource, nextView;

		nextSource = this.sources.followingOrFirst();
		// init next renderer
		nextView = this._getItemRenderer(nextSource);
		// init second next renderer
		// this._getItemRenderer(this.sources.followingOrFirst(nextSource));

		var showNextView = function() {
			context.requestAnimationFrame(function() {
				context.content.classList.remove("waiting");
				if (!context._paused) {
					// if (context.playbackRequested) {
					context.content.classList.toggle("playback-error", nextSource.has("error"));
					context.sources.select(nextSource); // NOTE: step increase done here
					// view.updateOverlay(nextView.el, view.overlay);
					context.timer.start(context._sequenceInterval);
					// console.log("%s::showNextView %sms %s", context.cid, context._sequenceInterval, nextSource.cid)
				}
			});
		};

		if (nextSource.has("prefetched")) {
			// nextView = context._getItemRenderer(nextSource).el;
			_whenImageLoads(nextView.el).then(showNextView, showNextView);
		} else if (nextSource.has("error")) {
			showNextView();
		} else {
			this.content.classList.add("waiting");
			/* TODO: add ga event 'media-waiting' */
			// console.log("%s:[waiting] %sms %s", context.cid, nextSource.cid);
			window.ga("send", "event", "sequence-renderer", "waiting", this.model.get("text"));
			this.listenTo(nextSource, "change:prefetched change:error",
				function() {
					this.stopListening(nextSource, "change:prefetched change:error");
					/* TODO: add ga event 'media-playing' */
					// console.log("%s:[playing] %sms %s", context.cid, nextSource.cid);
					window.ga("send", "event", "sequence-renderer", "playing", this.model.get("text"));
					_whenImageLoads(nextView.el).then(showNextView, showNextView);
					// context.content.classList.remove("waiting");
					// nextView = context._getItemRenderer(nextSource).el;
				});
		}
	},

	_getItemRenderer: function(item) {
		var view = this.itemViews.findByModel(item);
		if (!view) {
			var renderer = item.has("error") ? SourceErrorRenderer : SequenceStepRenderer;
			view = new renderer({
				model: item
			});
			// view = new SequenceStepRenderer({ model: item });
			this.itemViews.add(view);
			this.sequence.appendChild(view.render().el);
		}
		return view;
	},

	/* --------------------------- *
	/* progress meter
	/* --------------------------- */

	// _createDefaultItemData: function() {
	// 	var canvas = document.createElement("canvas");
	// 	var context = canvas.getContext("2d");
	// 	var imageData = this._drawMediaElement(context).getImageData(0, 0, canvas.width, canvas.height);
	//
	// 	var opts = { radius: 20 };
	// 	var fgColor = new Color(this.model.attr("color"));
	// 	var bgColor = new Color(this.model.attr("background-color"));
	// 	var isFgDark = fgColor.luminosity() < bgColor.luminosity();
	// 	opts.x00 = isFgDark? fgColor.clone().lighten(0.33) : bgColor.clone().darken(0.33);
	// 	opts.xFF = isFgDark? bgColor.clone().lighten(0.33) : fgColor.clone().darken(0.33);
	//
	// 	stackBlurMono(imageData, opts);
	// 	duotone(imageData, opts);
	// 	// stackBlurRGB(imageData, opts);
	//
	// 	context.putImageData(imageData, 0, 0);
	// 	return canvas.toDataURL();
	// },
});

if (DEBUG) {

	SequenceRenderer = (function(SequenceRenderer) {
		if (!SequenceRenderer.LOG_TO_SCREEN) return SequenceRenderer;

		/** @type {module:underscore.strings/lpad} */
		var lpad = require("underscore.string/lpad");

		return SequenceRenderer.extend({
			__logTimerEvent: function(evname, msg) {
				var logMsg = [
				"source: ", lpad(this.sources.selectedIndex, 2),
				"duration:", lpad(this.timer.getDuration(), 4),
				"paused:", this.paused,
				"requested:", this.playbackRequested,
				"status:", this.timer.getStatus(),
			];
				msg && logMsg.push(msg);
				logMsg = logMsg.join(" ");

				this.__logMessage(logMsg, evname);
				// console.log("%s::[%s] %s", this.cid, evname, logMsg);
			},
			_playMedia: function() {
				this.__logTimerEvent("playback");
				SequenceRenderer.prototype._playMedia.apply(this, arguments);
				// console.log("%s::_playMedia()", this.cid);
			},
			_pauseMedia: function() {
				this.__logTimerEvent("playback");
				SequenceRenderer.prototype._pauseMedia.apply(this, arguments);
				// console.log("%s::_pauseMedia()", this.cid);
			},

			_onTimerStart: function() {
				this.__logTimerEvent("timer:start");
				SequenceRenderer.prototype._onTimerStart.apply(this, arguments);
			},
			_onTimerResume: function() {
				this.__logTimerEvent("timer:resume");
				SequenceRenderer.prototype._onTimerStart.apply(this, arguments);
			},
			_onTimerPause: function() {
				this.__logTimerEvent("timer:pause");
				SequenceRenderer.prototype._onTimerPause.apply(this, arguments);
			},
			_onTimerEnd: function() {
				this.__logTimerEvent("timer:end");
				SequenceRenderer.prototype._onTimerEnd.apply(this, arguments);
			},

			_updateItemProgress: function(progress, srcIdx) {
				if (progress == 1) {
					this.__logMessage("idx:" + srcIdx + " progress:" + progress, "load:progress");
				}
				SequenceRenderer.prototype._updateItemProgress.apply(this, arguments);
			},

			_preloadAllItems: function(view) {
				view.__logMessage(view.cid + "::_preloadAllItems", "load:start");
				SequenceRenderer.prototype._preloadAllItems.apply(view, arguments);
			},
		});
	})(SequenceRenderer);
}

module.exports = SequenceRenderer;
}).call(this,true)

},{"../template/ErrorBlock.hbs":100,"./SequenceRenderer.hbs":92,"app/control/Globals":34,"app/view/base/View":58,"app/view/component/ProgressMeter":69,"app/view/promise/_loadImageAsObjectURL":73,"app/view/promise/_whenImageLoads":74,"app/view/promise/whenSelectionDistanceIs":77,"app/view/render/PlayableRenderer":91,"backbone.babysitter":"backbone.babysitter","underscore":"underscore","underscore.string/lpad":28,"utils/Timer":102}],94:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"placeholder sizing\"></div>\n<div class=\"content media-border\">\n	<div class=\"controls content-size\">\n			<canvas class=\"progress-meter\"></canvas>\n			<a class=\"fullscreen-toggle\" href=\"javascript:(void 0)\">\n				<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" preserveAspectRatio=\"xMidYMid meet\" viewBox=\"-21 -21 42 42\" style=\"max-width:14px;max-height:14px\">\n					<path d=\"M-5,5 L-20,20 M-7,20 L-20,20 L-20,7 M5,-5 L20,-20 M7,-20 L20,-20 L20,-7\" class=\"color-stroke\" style=\"stroke-width:1;fill:none;\" vector-effect=\"non-scaling-stroke\" />\n				</svg>\n			</a>\n	</div>\n	<div class=\"crop-box media-size\">\n		<video preload=\"none\" width=\"240\" height=\"180\"></video>\n		<img class=\"poster default\" alt=\""
    + container.escapeExpression(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"text","hash":{},"data":data}) : helper)))
    + "\" width=\"240\" height=\"180\" />\n	</div>\n	<div class=\"overlay media-size\">\n		<div class=\"play-toggle-hitarea play-toggle\">\n		</div>\n	</div>\n</div>\n";
},"useData":true});

},{"hbsfy/runtime":21}],95:[function(require,module,exports){
(function (DEBUG){
/*global HTMLMediaElement, MediaError*/
/**
 * @module app/view/render/VideoRenderer
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
 * @see https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
 * @see https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_HTML5_audio_and_video
 */

/* --------------------------- *
/* Imports
/* --------------------------- */

/** @type {module:underscore} */
var _ = require("underscore");
// /** @type {module:backbone} */
// var Backbone = require("backbone");
/** @type {module:app/control/Globals} */
var Globals = require("app/control/Globals");
/** @type {module:app/view/render/PlayableRenderer} */
var PlayableRenderer = require("app/view/render/PlayableRenderer");
/** @type {module:app/view/component/ProgressMeter} */
var ProgressMeter = require("app/view/component/ProgressMeter");
// /** @type {module:utils/prefixedStyleName} */
// var prefixedStyleName = require("utils/prefixedStyleName");
/** @type {module:utils/prefixedEvent} */
var prefixedEvent = require("utils/prefixedEvent");

/* --------------------------- *
/* private static
/* --------------------------- */

// var whenViewIsAttached = require("app/view/promise/whenViewIsAttached");

var fullscreenChangeEvent = prefixedEvent("fullscreenchange", document);
// var fullscreenErrorEvent = prefixedEvent("fullscreenerror", document);

var formatTimecode = function(value) {
	if (isNaN(value)) return ""; //value = 0;
	if (value >= 3600) return ((value / 3600) | 0) + "H";
	if (value >= 60) return ((value / 60) | 0) + "M";
	// if (value >= 10) return "0" + (value | 0) + "S";
	return (value | 0) + "S";
};

/**
 * @constructor
 * @type {module:app/view/render/VideoRenderer}
 */
var VideoRenderer = PlayableRenderer.extend({

	/** @type {string} */
	cidPrefix: "videoRenderer",
	/** @type {string} */
	className: PlayableRenderer.prototype.className + " video-renderer",
	/** @type {Function} */
	template: require("./VideoRenderer.hbs"),

	events: (function() {
		return window.hasOwnProperty("onpointerup")
			? { "pointerup .fullscreen-toggle": "_onFullscreenToggle" }
			: { "mouseup .fullscreen-toggle": "_onFullscreenToggle" }
	}()),

	// events: {
	// 	"click .fullscreen-toggle": "_onFullscreenToggle",
	// },

	// properties: {
	// 	paused: {
	// 		get: function() {
	// 			return this.video.paused;
	// 		}
	// 	},
	// },

	/** @override */
	initialize: function(opts) {
		PlayableRenderer.prototype.initialize.apply(this, arguments);

		_.bindAll(this,
			"_updatePlaybackState",
			"_updatePlayedValue",
			"_updateBufferedValue",
			"_onMediaError",
			"_onMediaEnded",
			"_onMediaPlayingOnce",
			"_onFullscreenChange"
		);
		// var onPeerSelect = function() {
		// 	this.content.style.display = (this.getSelectionDistance() > 1)? "none": "";
		// };
		// this.listenTo(this.model.collection, "select:one select:none", onPeerSelect);
		// onPeerSelect();
	},

	/* --------------------------- *
	/* children/layout
	/* --------------------------- */

	/** @override */
	createChildren: function() {
		PlayableRenderer.prototype.createChildren.apply(this, arguments);

		this.placeholder = this.el.querySelector(".placeholder");
		// this.overlay = this.content.querySelector(".overlay");
		this.video = this.content.querySelector("video");
		// this.video.loop = this.model.attrs().hasOwnProperty("@video-loop");
		this.video.loop = this.model.attr("@video-loop") !== void 0;
		this.video.src = this.findPlayableSource(this.video);
	},

	measure: function() {
		PlayableRenderer.prototype.measure.apply(this, arguments);

		// NOTE: Top/bottom 1px video crop
		// - Cropped in CSS: video, .poster { margin-top: -1px; margin-bottom: -1px;}
		// - Cropped height is adjusted in metrics obj
		// - Crop amount added back to actual video on render()
		this.metrics.media.height -= 2;
		this.metrics.content.height -= 2;
	},

	/** @override */
	render: function() {
		PlayableRenderer.prototype.render.apply(this, arguments);

		var els, el, i, cssW, cssH;
		var img = this.defaultImage;
		var content = this.content;

		// media-size
		// ---------------------------------
		cssW = this.metrics.media.width + "px";
		cssH = this.metrics.media.height + "px";

		els = this.el.querySelectorAll(".media-size");
		for (i = 0; i < els.length; i++) {
			el = els.item(i);
			el.style.width = cssW;
			el.style.height = cssH;
		}

		content.style.width = cssW;
		content.style.height = (this.metrics.media.height - 1) + "px";

		// content-position
		// ---------------------------------
		var cssX, cssY;
		cssX = this.metrics.content.x + "px";
		cssY = this.metrics.content.y + "px";
		content.style.left = cssX;
		content.style.top = cssY;

		el = this.el.querySelector(".controls");
		// el.style.left = cssX;
		// controls.style.top = cssY;
		el.style.width = this.metrics.content.width + "px";
		el.style.height = this.metrics.content.height + "px";

		// // content-size
		// // ---------------------------------
		// cssW = this.metrics.content.width + "px";
		// cssH = this.metrics.content.height + "px";
		//
		// els = this.el.querySelectorAll(".content-size");
		// for (i = 0; i < els.length; i++) {
		// 	el = els.item(i);
		// 	el.style.width = cssW;
		// 	el.style.height = cssH;
		// }

		// NOTE: elements below must use video's UNCROPPED height, so +2px
		this.video.setAttribute("width", this.metrics.media.width);
		this.video.setAttribute("height", this.metrics.media.height + 2);
		img.setAttribute("width", this.metrics.media.width);
		img.setAttribute("height", this.metrics.media.height + 2);

		return this;
	},

	/* --------------------------- *
	/* initializeAsync
	/* --------------------------- */

	initializeAsync: function() {
		return Promise.resolve(this)
			.then(PlayableRenderer.whenSelectionIsContiguous)
			.then(PlayableRenderer.whenScrollingEnds)
			.then(
				function(view) {
					return Promise.all([
						view.whenVideoHasMetadata(view),
						PlayableRenderer.whenDefaultImageLoads(view),
					]).then(
						function(arr) {
							return Promise.resolve(view);
						},
						function(err) {
							return Promise.reject(err);
						}
					);
				})
			.then(
				function(view) {
					return view.whenAttached();
				})
			.then(
				function(view) {
					view.initializePlayable();
					view.updateOverlay(view.defaultImage, view.overlay);
					view.addSelectionListeners();
					return view;
				});
	},

	initializePlayable: function() {
		// video
		// ---------------------------------
		this.addMediaListeners();

		// progress-meter
		// ---------------------------------
		this.progressMeter = new ProgressMeter({
			el: this.el.querySelector(".progress-meter"),
			maxValues: {
				amount: this.video.duration,
				available: this.video.duration,
			},
			color: this.model.attr("color"),
			backgroundColor: this.model.attr("background-color"),
			labelFn: this._progressLabelFn.bind(this)
		});
		// var parentEl = this.el.querySelector(".top-bar");
		// parentEl.insertBefore(this.progressMeter.render().el, parentEl.firstChild);
	},

	_progressLabelFn: function(value, total) {
		if (!this._started || this.video.ended || isNaN(value)) {
			return formatTimecode(total);
		} else if (!this.playbackRequested) {
			return Globals.PAUSE_CHAR;
		} else {
			return formatTimecode(total - value);
		}
	},

	/* ---------------------------
	/* whenVideoHasMetadata promise
	/* --------------------------- */

	whenVideoHasMetadata: function(view) {
		// NOTE: not pretty !!!
		return new Promise(function(resolve, reject) {
			var mediaEl = view.video;
			var eventHandlers = {
				loadedmetadata: function(ev) {
					if (ev) removeEventListeners();
					// console.log("%s::whenVideoHasMetadata [%s] %s", view.cid, "resolved", ev? ev.type : "sync");
					resolve(view);
				},
				abort: function(ev) {
					if (ev) removeEventListeners();
					reject(new PlayableRenderer.ViewError(view, new Error("whenVideoHasMetadata: view was removed")));
				},
				error: function(ev) {
					if (ev) removeEventListeners();
					var err;
					if (mediaEl.error) {
						err = new Error(_.invert(MediaError)[mediaEl.error.code]);
						err.infoCode = mediaEl.error.code;
					} else {
						err = new Error("Unspecified error");
					}
					err.infoSrc = mediaEl.src;
					err.logMessage = "whenVideoHasMetadata: " + err.name + " " + err.infoSrc;
					err.logEvent = ev;
					reject(err);
				},
			};
			//  (mediaEl.preload == "auto" && mediaEl.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA)
			// 	(mediaEl.preload == "metadata" && mediaEl.readyState >= HTMLMediaElement.HAVE_METADATA)
			if (mediaEl.error) {
				eventHandlers.error();
			} else if (mediaEl.readyState >= HTMLMediaElement.HAVE_METADATA) {
				eventHandlers.loadedmetadata();
			} else {
				var sources = mediaEl.querySelectorAll("source");
				var errTarget = sources.length > 0 ? sources.item(sources.length - 1) : mediaEl;
				var errCapture = errTarget === mediaEl; // use capture with HTMLMediaElement

				var removeEventListeners = function() {
					errTarget.removeEventListener("error", eventHandlers.error, errCapture);
					for (var ev in eventHandlers) {
						if (ev !== "error" && eventHandlers.hasOwnProperty(ev)) {
							mediaEl.removeEventListener(ev, eventHandlers[ev], false);
						}
					}
				};
				errTarget.addEventListener("error", eventHandlers.error, errCapture);
				for (var ev in eventHandlers) {
					if (ev !== "error" && eventHandlers.hasOwnProperty(ev)) {
						mediaEl.addEventListener(ev, eventHandlers[ev], false);
					}
				}
				mediaEl.preload = "metadata";
			}
		});
	},

	findPlayableSource: function(video) {
		var playable = this.model.get("sources").find(function(source) {
			return /^video\//.test(source.get("mime")) && video.canPlayType(source.get("mime")) != "";
		});
		return playable ? playable.get("original") : "";
	},

	/* ---------------------------
	/* PlayableRenderer implementation
	/* --------------------------- */

	/** @override initial value */
	_playbackRequested: false,

	/** @override */
	_isMediaPaused: function() {
		return this.video.paused;
	},

	/** @override */
	_playMedia: function() {
		if (this.video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && this.video.seekable.length == 0) {
			console.warn(this.cid, "WTF! got video data, but cannot seek, calling load()");
			// this._logMessage("call:load", "got video data, but cannot seek, calling load()", "orange");
			this.video.load();
			// this.video.currentTime = 0;
		} else if (this.video.ended) {
			this.video.currentTime = this.video.seekable.start(0);
		}
		this.video.play();
	},

	/** @override */
	_pauseMedia: function() {
		this.video.pause();
	},

	/* ---------------------------
	/* media events
	/* --------------------------- */

	// updatePlaybackEvents: "play playing waiting pause seeking seeked ended",
	// updateBufferedEvents: "progress canplay canplaythrough playing timeupdate",//loadeddata
	updatePlaybackEvents: "playing waiting pause",
	updateBufferedEvents: "progress canplay canplaythrough play playing",
	updatePlayedEvents: "timeupdate seeked",

	addMediaListeners: function() {
		if (!this._started) this.video.addEventListener("playing", this._onMediaPlayingOnce, false);
		this.addListener(this.video, this.updatePlaybackEvents, this._updatePlaybackState);
		this.addListener(this.video, this.updateBufferedEvents, this._updateBufferedValue);
		this.addListener(this.video, this.updatePlayedEvents, this._updatePlayedValue);
		this.video.addEventListener("ended", this._onMediaEnded, false);
		this.video.addEventListener("error", this._onMediaError, true);

		this.on("view:removed", this.removeMediaListeners, this);
	},

	removeMediaListeners: function() {
		this.off("view:removed", this.removeMediaListeners, this);

		if (!this._started) this.video.removeEventListener("playing", this._onMediaPlayingOnce, false);
		this.removeListener(this.video, this.updatePlaybackEvents, this._updatePlaybackState);
		this.removeListener(this.video, this.updateBufferedEvents, this._updateBufferedValue);
		this.removeListener(this.video, this.updatePlayedEvents, this._updatePlayedValue);
		this.video.removeEventListener("ended", this._onMediaEnded, false);
		this.video.removeEventListener("error", this._onMediaError, true);
	},

	/* ---------------------------
	/* media event handlers
	/* --------------------------- */

	_onMediaError: function(ev) {
		this.removeMediaListeners();
		this.removeSelectionListeners();

		this._onMediaEnded(ev);
		this.content.classList.remove("ended");
		this.content.classList.remove("waiting");
		this.content.classList.remove("started");
		this._started = false;

		this.mediaState = "error";
	},

	_onMediaPlayingOnce: function(ev) {
		this.video.removeEventListener("playing", this._onMediaPlayingOnce, false);
		if (!this._started) {
			this._started = true;
			this.content.classList.add("started");
		}
	},

	_onMediaEnded: function(ev) {
		this.playbackRequested = false;
		if (this.video.webkitDisplayingFullscreen) {
			this.video.webkitExitFullscreen();
		}
		if (document.fullscreenElement === this.video) {
			this.video.exitFullscreen();
		}
	},

	_updatePlaybackState: function(ev) {
		var classList = this.content.classList;
		if (this.playbackRequested) {
			switch (ev.type) {
				case "pause":
				case "playing":
					classList.remove("waiting");
					break;
				case "waiting":
					classList.add("waiting");
					break;
			}
		} else {
			classList.remove("waiting");
		}
		classList.toggle("ended", this.video.ended);

		this._updatePlayedValue(ev);
	},

	_updatePlayedValue: function(ev) {
		this._currentTimeValue = this.video.currentTime;
		if (this.progressMeter) {
			this.progressMeter.valueTo(this._currentTimeValue, 0, "amount");
		}
	},

	_updateBufferedValue: function(ev) {
		var bRanges = this.video.buffered;
		if (bRanges.length > 0) {
			this._bufferedValue = bRanges.end(bRanges.length - 1);
			if (this.progressMeter && ((this.video.readyState == HTMLMediaElement.HAVE_ENOUGH_DATA) /*|| (this.video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && this.video.networkState == HTMLMediaElement.NETWORK_LOADING)*/ )) {
				this.progressMeter.valueTo(this._bufferedValue, 300, "available");
				// this.progressMeter.valueTo(this._bufferedValue, Math.max(0, 1000 * (this._bufferedValue - (this.progressMeter.getValue("available") | 0))), "available");
			}
		}
	},

	/* ---------------------------
	/* fullscreen api
	/* --------------------------- */

	_onFullscreenToggle: function(ev) {
		// NOTE: Ignore if MouseEvent.button is 0 or undefined (0: left-button)
		if (!ev.defaultPrevented && !ev.button && this.model.selected) {
			// ev.preventDefault();
			try {
				if (document.hasOwnProperty("fullscreenElement") &&
					document.fullscreenElement !== this.video) {
					document.addEventListener(fullscreenChangeEvent, this._onFullscreenChange, false);
					this.video.requestFullscreen();
				} else
				if (this.video.webkitSupportsFullscreen && !this.video.webkitDisplayingFullscreen) {
					this.video.addEventListener("webkitbeginfullscreen", this._onFullscreenChange, false);
					this.video.webkitEnterFullScreen();
				}
			} catch (err) {
				this.video.controls = false;
				console.error(err);
			}
		}
	},

	_onFullscreenChange: function(ev) {
		switch (ev.type) {
			case fullscreenChangeEvent:
				// var isOwnFullscreen = Modernizr.prefixed("fullscreenElement", document) === this.video;
				var isOwnFullscreen = document.fullscreenElement === this.video;
				this.video.controls = isOwnFullscreen;
				if (!isOwnFullscreen) {
					document.removeEventListener(fullscreenChangeEvent, this._onFullscreenChange, false);
				}
				break;
			case "webkitbeginfullscreen":
				this.video.controls = true;
				this.video.removeEventListener("webkitbeginfullscreen", this._onFullscreenChange, false);
				this.video.addEventListener("webkitendfullscreen", this._onFullscreenChange, false);
				break;
			case "webkitendfullscreen":
				this.video.controls = false;
				this.video.removeEventListener("webkitendfullscreen", this._onFullscreenChange, false);
				break;
		}
	},

	/* ---------------------------
	/* event helpers
	/* --------------------------- */

	addListener: function(target, events, handler, useCapture) {
		(typeof events === "string") && (events = events.split(" "));
		for (var i = 0; i < events.length; i++) {
			target.addEventListener(events[i], handler, !!useCapture);
		}
	},

	removeListener: function(target, events, handler, useCapture) {
		(typeof events === "string") && (events = events.split(" "));
		for (var i = 0; i < events.length; i++) {
			target.removeEventListener(events[i], handler, !!useCapture);
		}
	},
});

/* ---------------------------
/* log to screen
/* --------------------------- */
if (DEBUG) {

	VideoRenderer = (function(VideoRenderer) {
		if (!VideoRenderer.LOG_TO_SCREEN) return VideoRenderer;

		/** @type {Function} */
		var Color = require("color");
		/** @type {module:underscore.strings/lpad} */
		var lpad = require("underscore.string/lpad");
		/** @type {module:underscore.strings/rpad} */
		var rpad = require("underscore.string/rpad");

		// var fullscreenEvents = [
		// 	fullscreenChangeEvent, fullscreenErrorEvent,
		// 	"webkitbeginfullscreen", "webkitendfullscreen",
		// ];

		var mediaEvents = require("utils/event/mediaEventsEnum");
		var updatePlaybackStateEvents, updateBufferedEvents, updatePlayedEvents;

		// updatePlaybackStateEvents = ["playing", "waiting", "ended", "pause", "seeking", "seeked"];
		// updateBufferedEvents = ["progress", "durationchange", "canplay", "play"];
		// updatePlayedEvents = ["playing", "timeupdate"];

		updatePlaybackStateEvents = [
			"loadstart",
			"progress",
			"suspend",
			"abort",
			"error",
			"emptied",
			"stalled",
		];
		updateBufferedEvents = [
			"loadedmetadata",
			"loadeddata",
			"canplay",
			"canplaythrough",
			"playing",
			"waiting",
			"seeking", // seeking changed to true
			"seeked", // seeking changed to false
			"ended", // ended is true
		];
		updatePlayedEvents = ["play", "pause"];

		// Exclude some events from log
		mediaEvents = _.without(mediaEvents, "resize", "error");
		// Make sure event subsets exist in the main set
		updatePlaybackStateEvents = _.intersection(mediaEvents, updatePlaybackStateEvents);
		updateBufferedEvents = _.intersection(mediaEvents, updateBufferedEvents);
		updatePlayedEvents = _.intersection(mediaEvents, updatePlayedEvents);

		var readyStateSymbols = _.invert(_.pick(HTMLMediaElement,
			function(val, key, obj) {
				return /^HAVE_/.test(key);
			}));
		var readyStateToString = function(el) {
			return readyStateSymbols[el.readyState] + "(" + el.readyState + ")";
		};

		var networkStateSymbols = _.invert(_.pick(HTMLMediaElement,
			function(val, key, obj) {
				return /^NETWORK_/.test(key);
			}));
		var networkStateToString = function(el) {
			return networkStateSymbols[el.networkState] + "(" + el.networkState + ")";
		};

		var mediaErrorSymbols = _.invert(MediaError);
		var mediaErrorToString = function(el) {
			return el.error ? mediaErrorSymbols[el.error.code] + "(" + el.error.code + ")" : "[MediaError null]";
		};

		var findRangeIndex = function(range, currTime) {
			for (var i = 0, ii = range.length; i < ii; i++) {
				if (range.start(i) <= currTime && currTime <= range.end(i)) {
					return i;
				}
			}
			return -1;
		};

		var formatVideoError = function(video) {
			return [
				mediaErrorToString(video),
				networkStateToString(video),
				readyStateToString(video),
			].join(" ");
		};

		var getVideoStatsCols = function() {
			return "0000.000 [Current/Total] [Seekable   ] [Buffered   ] networkState readyState      Playing";
			// return "0000.620 [t:  0.0  27.4] [s: 27.4 0/1] [b:  0.5 0/1] LOADING(2)   FUTURE_DATA(3)  :: (::)";
		}

		var formatVideoStats = function(video) {
			var currTime = video.currentTime,
				durTime = video.duration,
				bRanges = video.buffered,
				bRangeIdx,
				sRanges = video.seekable,
				sRangeIdx;

			bRangeIdx = findRangeIndex(bRanges, currTime);
			sRangeIdx = findRangeIndex(sRanges, currTime);
			return [
				"[t:" + lpad(currTime.toFixed(1), 5) +
					" " + lpad((!isNaN(durTime) ? durTime.toFixed(1) : "-"), 5) + "]",
				"[s:" + lpad((sRangeIdx >= 0 ? sRanges.end(sRangeIdx).toFixed(1) : "-"), 5) +
					" " + (sRangeIdx >= 0 ? sRangeIdx : "-") + "/" + sRanges.length + "]",
				"[b:" + lpad((bRangeIdx >= 0 ? bRanges.end(bRangeIdx).toFixed(1) : "-"), 5) +
					" " + (bRangeIdx >= 0 ? bRangeIdx : "-") + "/" + bRanges.length + "]",
				rpad(networkStateToString(video).substr(8), 12),
				rpad(readyStateToString(video).substr(5), 15),
				(video.ended ? ">:" : (video.paused ? "::" : ">>")),
			].join(" ");
		};

		return VideoRenderer.extend({

			/** @override */
			initialize: function() {
				VideoRenderer.prototype.initialize.apply(this, arguments);

				_.bindAll(this, "__handleMediaEvent");

				var fgColor = this.model.attr("color"),
					red = new Color("red"),
					blue = new Color("blue"),
					green = new Color("green");

				for (var i = 0; i < mediaEvents.length; i++) {
					var ev = mediaEvents[i];
					this.video.addEventListener(ev, this.__handleMediaEvent, false);

					var c = new Color(fgColor),
						cc = 1;
					if (updateBufferedEvents.indexOf(ev) != -1) c.mix(green, (cc /= 2));
					if (updatePlayedEvents.indexOf(ev) != -1) c.mix(red, (cc /= 2));
					if (updatePlaybackStateEvents.indexOf(ev) != -1) c.mix(blue, (cc /= 2));
					this.__logColors[ev] = c.rgbString();
				}
				this.video.addEventListener("error", this.__handleMediaEvent, true);
			},

			/** @override */
			remove: function() {
				VideoRenderer.prototype.remove.apply(this, arguments);
				for (var i = 0; i < mediaEvents.length; i++) {
					if (mediaEvents[i] == "error") continue;
					this.video.removeEventListener(mediaEvents[i], this.__handleMediaEvent, false);
				}
				this.video.removeEventListener("error", this.__handleMediaEvent, true);
			},

			/** @override */
			_onVisibilityChange: function(ev) {
				VideoRenderer.prototype._onVisibilityChange.apply(this, arguments);
				var stateVal = Modernizr.prefixed("visibilityState", document);
				this.__logEvent("visibilityState:" + stateVal, ev.type + ":" + stateVal);
			},

			/** @override */
			_onFullscreenChange: function(ev) {
				VideoRenderer.prototype._onFullscreenChange.apply(this, arguments);
				var logtype = (document.fullscreenElement === this.video ? "enter:" : "exit:") + ev.type;
				this.__logEvent("document.fullscreenElement: " + this.cid, logtype);
			},

			/** @override */
			_onFullscreenToggle: function(ev) {
				VideoRenderer.prototype._onFullscreenToggle.apply(this, arguments);
				if (!ev.defaultPrevented && this.model.selected) {
					this.__logEvent("fullscreen-toggle", ev.type);
				}
			},

			__handleMediaEvent: function(ev) {
				var evmsg; //, errmsg;
				// evmsg = formatVideoStats(this.video) + " " + rpad(this._lastPlaybackStates || "-", 9);
				evmsg = formatVideoStats(this.video);
				if (this.playbackRequested === true) {
					evmsg += " (>>)";
				} else if (this.playbackRequested === false) {
					evmsg += " (::)";
				} else {
					evmsg += " (--)";
				}
				this.__logEvent(evmsg, ev.type);
				if (ev.type === "error" || ev.type === "abort") {
					this.__logMessage(formatVideoError(this.video), ev.type);
				}
			},

			__logEvent: function(msg, logtype, color) {
				var logEntryEl = this.__logElement.lastElementChild;
				if ((logEntryEl && logEntryEl.getAttribute("data-logtype") == logtype) &&
					((logtype === "timeupdate") || (logtype === "progress"))) {
					var logRepeatVal = parseInt(logEntryEl.getAttribute("data-logrepeat"));
					logEntryEl.textContent = this.__getTStamp() + " " + msg;
					logEntryEl.setAttribute("data-logrepeat", isNaN(logRepeatVal) ? 2 : ++logRepeatVal);
				} else {
					this.__logMessage(msg, logtype, color);
				}
			},

			__getHeaderText: function() {
				return getVideoStatsCols();
			},
		});
	})(VideoRenderer);

}

module.exports = VideoRenderer;
}).call(this,true)

},{"./VideoRenderer.hbs":94,"app/control/Globals":34,"app/view/component/ProgressMeter":69,"app/view/render/PlayableRenderer":91,"color":"color","underscore":"underscore","underscore.string/lpad":28,"underscore.string/rpad":30,"utils/event/mediaEventsEnum":110,"utils/prefixedEvent":112}],96:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function";

  return "<div id=\"desc_b"
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"content sizing mdown\">"
    + ((stack1 = ((helper = (helper = helpers.desc || (depth0 != null ? depth0.desc : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"desc","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</div>\n";
},"useData":true});

},{"hbsfy/runtime":21}],97:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function";

  return "<div id=\"desc_m"
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"content sizing\"><p>"
    + ((stack1 = ((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</p>"
    + ((stack1 = ((helper = (helper = helpers.sub || (depth0 != null ? depth0.sub : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"sub","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</div>\n";
},"useData":true});

},{"hbsfy/runtime":21}],98:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<svg id=\"debug-grid\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" preserveAspectRatio=\"xMaxYMid slice\" viewport-fill=\"hsl(0,0%,100%)\" viewport-fill-opacity=\"1\" style=\"fill:none;stroke:none;stroke-width:1px;fill:none;fill-rule:evenodd;\">\n<defs>\n	<pattern id=\"pat-baseline-12px\" class=\"baseline base12\" x=\"0\" y=\"0\" width=\"20\" height=\"12\" patternUnits=\"userSpaceOnUse\">\n		<line x1=\"0\" x2=\"100%\" y1=\"0\" y2=\"0\" stroke-opacity=\"1.0\"/>\n		<line x1=\"0\" x2=\"100%\" y1=\"3\" y2=\"3\" stroke-opacity=\"0.125\"/>\n		<line x1=\"0\" x2=\"100%\" y1=\"6\" y2=\"6\" stroke-opacity=\"0.375\"/>\n		<line x1=\"0\" x2=\"100%\" y1=\"9\" y2=\"9\" stroke-opacity=\"0.125\"/>\n	</pattern>\n\n	<pattern id=\"pat-baseline-24px\" class=\"baseline base12\" x=\"0\" y=\"0\" width=\"20\" height=\"24\" patternUnits=\"userSpaceOnUse\">\n		<line x1=\"0\" x2=\"100%\" y1=\"0\" y2=\"0\" stroke-opacity=\"1.0\"/>\n	</pattern>\n\n	<pattern id=\"pat-baseline-10px\" class=\"baseline base10\" x=\"0\" y=\"0\" width=\"20\" height=\"10\" patternUnits=\"userSpaceOnUse\">\n		<line x1=\"0\" x2=\"100%\" y1=\"0\" y2=\"0\" stroke-opacity=\"1.00\"/>\n		<line x1=\"0\" x2=\"100%\" y1=\"5\" y2=\"5\" stroke-opacity=\"0.75\"/>\n	</pattern>\n	<pattern id=\"pat-baseline-20px\" class=\"baseline base10\" x=\"0\" y=\"0\" width=\"20\" height=\"20\" patternUnits=\"userSpaceOnUse\">\n		<line x1=\"0\" x2=\"100%\" y1=\"0\" y2=\"0\" stroke-opacity=\"1.0\"/>\n	</pattern>\n	<pattern id=\"pat-cols-220px\" x=\"0\" y=\"0\" width=\"220\" height=\"36\" patternUnits=\"userSpaceOnUse\">\n		<rect transform=\"translate(0,0)\" x=\"0\" y=\"0\" width=\"20\" height=\"100%\" fill=\"hsl(336,50%,40%)\" fill-opacity=\"0.1\"/>\n		<rect transform=\"translate(200,0)\" x=\"0\" y=\"0\" width=\"20\" height=\"100%\" fill=\"hsl(336,50%,40%)\" fill-opacity=\"0.1\"/>\n		<line transform=\"translate(20 0)\" x1=\"0\" x2=\"0\" y1=\"0\" y2=\"100%\" stroke=\"hsl(336,50%,60%)\" stroke-opacity=\"0.2\"/>\n		<line transform=\"translate(200 0)\" x1=\"0\" x2=\"0\" y1=\"0\" y2=\"100%\" stroke=\"hsl(336,50%,40%)\" stroke-opacity=\"0.2\"/>\n\n		<line transform=\"translate(140 0)\" x1=\"0\" x2=\"0\" y1=\"0\" y2=\"100%\" stroke=\"hsl(336,50%,40%)\" stroke-opacity=\"0.3\"/>\n		<line transform=\"translate(80 0)\" x1=\"0\" x2=\"0\" y1=\"0\" y2=\"100%\" stroke=\"hsl(336,50%,40%)\" stroke-opacity=\"0.3\"/>\n\n		<line transform=\"translate(0 0)\" x1=\"0\" x2=\"0\" y1=\"0\" y2=\"100%\" stroke=\"hsl(236,50%,40%)\" stroke-opacity=\"0.4\" stroke-width=\"1\"/>\n		<line transform=\"translate(220 0)\" x1=\"0\" x2=\"0\" y1=\"0\" y2=\"100%\" stroke=\"hsl(236,50%,40%)\" stroke-opacity=\"0.4\" stroke-width=\"1\"/>\n	</pattern>\n</defs>\n<g id=\"debug-grid-body\" transform=\"translate(0 0.5)\">\n	<rect id=\"baseline\" x=\"0\" y=\"0\" width=\"100%\" height=\"100%\"/>\n	<g id=\"debug-grid-container\">\n		<g id=\"debug-grid-content\">\n			<rect id=\"baseline-content\" x=\"0\" y=\"0\" width=\"100%\" height=\"100%\"/>\n			<line id=\"gct0\" class=\"hguide\" x1=\"0\" x2=\"100%\" y1=\"0\" y2=\"0\"/>\n			<line id=\"gct1\" class=\"hguide\" x1=\"0\" x2=\"100%\" y1=\"0\" y2=\"0\"/>\n		</g>\n		<line id=\"gnv0\" class=\"hguide\" x1=\"0\" x2=\"100%\" y1=\"0\" y2=\"0\"/>\n		<line id=\"gnv1\" class=\"hguide\" x1=\"0\" x2=\"100%\" y1=\"0\" y2=\"0\"/>\n	</g>\n	<rect id=\"columns\" x=\"0\" y=\"0\" width=\"100%\" height=\"100%\"/>\n	<line id=\"gl0\" class=\"vguide\" x1=\"0\" x2=\"0\" y1=\"0\" y2=\"100%\"/>\n	<line id=\"gl1\" class=\"vguide gutter lgap\" x1=\"0\" x2=\"0\" y1=\"0\" y2=\"100%\"/>\n	<line id=\"gr0\" class=\"vguide\" x1=\"100%\" x2=\"100%\" y1=\"0\" y2=\"100%\"/>\n	<line id=\"gr1\" class=\"vguide gutter rgap\" x1=\"100%\" x2=\"100%\" y1=\"0\" y2=\"100%\"/>\n</g>\n</svg>\n";
},"useData":true});

},{"hbsfy/runtime":21}],99:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "	<dd id=\"select-layout\">\n		<select size=1>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.layouts : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "		</select>\n	</dd>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "			<option value=\""
    + alias2(alias1(depth0, depth0))
    + "\">"
    + alias2(alias1(depth0, depth0))
    + "</option>\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "		<li class=\""
    + ((stack1 = helpers["if"].call(alias1,depth0,{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + "\">"
    + container.escapeExpression(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "</li>\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "passed";
},"7":function(container,depth0,helpers,partials,data) {
    return "failed";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=container.escapeExpression;

  return "<dl class=\"debug-links color-bg\">\n	<dt id=\"links-toggle\">\n		<svg class=\"icon\" viewBox=\"-100 -100 200 200\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" preserveAspectRatio=\"xMidYMid meet\">\n			<path id=\"cog\" d=\"M11.754,-99.307c-7.809,-0.924 -15.699,-0.924 -23.508,0l-3.73,20.82c-6.254,1.234 -12.338,3.21 -18.123,5.888l-15.255,-14.651c-6.861,3.842 -13.244,8.48 -19.018,13.818l9.22,19.036c-4.335,4.674 -8.095,9.849 -11.201,15.416l-20.953,-2.886c-3.292,7.141 -5.731,14.645 -7.265,22.357l18.648,9.981c-0.759,6.329 -0.759,12.727 0,19.056l-18.648,9.981c1.534,7.712 3.973,15.216 7.265,22.357l20.953,-2.886c3.106,5.567 6.866,10.742 11.201,15.416l-9.22,19.036c5.774,5.338 12.157,9.976 19.018,13.818l15.255,-14.651c5.785,2.678 11.869,4.654 18.123,5.888l3.73,20.82c7.809,0.924 15.699,0.924 23.508,0l3.73,-20.82c6.254,-1.234 12.338,-3.21 18.123,-5.888l15.255,14.651c6.861,-3.842 13.244,-8.48 19.018,-13.818l-9.22,-19.036c4.335,-4.674 8.095,-9.849 11.201,-15.416l20.953,2.886c3.292,-7.141 5.731,-14.645 7.265,-22.357l-18.648,-9.981c0.759,-6.329 0.759,-12.727 0,-19.056l18.648,-9.981c-1.534,-7.712 -3.973,-15.216 -7.265,-22.357l-20.953,2.886c-3.106,-5.567 -6.866,-10.742 -11.201,-15.416l9.22,-19.036c-5.774,-5.338 -12.157,-9.976 -19.018,-13.818l-15.255,14.651c-5.785,-2.678 -11.869,-4.654 -18.123,-5.888l-3.73,-20.82ZM0,-33c18.213,0 33,14.787 33,33c0,18.213 -14.787,33 -33,33c-18.213,0 -33,-14.787 -33,-33c0,-18.213 14.787,-33 33,-33Z\" style=\"fill:currentColor;fill-rule:evenodd;\"/>\n		</svg>\n	</dt>\n	<dt id=\"app-state\">\n		<span class=\"color-fg color-bg\" data-prop=\"collapsed\">c</span><span class=\"color-fg color-bg\" data-prop=\"withBundle\">b</span><span class=\"color-fg color-bg\" data-prop=\"withMedia\">m</span><span class=\"color-fg color-bg\" data-prop=\"withArticle\">a</span>\n	</dt>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.layouts : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "	<dd id=\"edit-backend\">\n		<a href=\""
    + alias2((helpers.global || (depth0 && depth0.global) || helpers.helperMissing).call(alias1,"APP_ROOT",{"name":"global","hash":{},"data":data}))
    + "symphony/\" class=\"color-fg color-bg\" target=\"_blank\">CMS</a>\n	</dd>\n	<dd id=\"toggle-tests\">\n		<a href=\"#toggle-tests\" class=\"color-fg color-bg\">Tests</a>\n	</dd>\n	<dd id=\"toggle-blocks\">\n		<a href=\"#toggle-blocks\" class=\"color-fg color-bg\">Blocks</a>\n	</dd>\n	<dd id=\"toggle-tx\">\n		<a href=\"#toggle-blocks\" class=\"color-fg color-bg\">TX/FX</a>\n	</dd>\n	<dd id=\"toggle-grid-bg\">\n		<a href=\"#toggle-grid-bg\" class=\"color-fg color-bg\">Grid</a>\n	</dd>\n	<dd id=\"toggle-mdown\">\n		<a href=\"#toggle-mdown\" class=\"color-fg color-bg\">Markdown</a>\n	</dd>\n	<dd id=\"toggle-logs\">\n		<a href=\"#toggle-logs\" class=\"color-fg color-bg\">Logs</a>\n	</dd>\n	<dd id=\"media-info\">\n		<span></span>\n	</dd>\n	<dd id=\"viewport-info\">\n		<span></span>\n	</dd>\n</dl>\n<div id=\"test-results\">\n	<h6>Tests <a id=\"toggle-passed\" href=\"#toggle-passed\">Passed</a></h6>\n	<p>"
    + alias2(container.lambda(((stack1 = (depth0 != null ? depth0.navigator : depth0)) != null ? stack1.userAgent : stack1), depth0))
    + "</p>\n	<ul>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.tests : depth0),{"name":"each","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "	</ul>\n</div>\n";
},"useData":true});

},{"hbsfy/runtime":21}],100:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "		<p><code>"
    + container.escapeExpression(((helper = (helper = helpers.infoSrc || (depth0 != null ? depth0.infoSrc : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"infoSrc","hash":{},"data":data}) : helper)))
    + "</code></p>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"error-message color-fg\">\n	<p><strong>"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</strong> <code>"
    + alias4(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"message","hash":{},"data":data}) : helper)))
    + "</code></p>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.infoSrc : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
},"useData":true});

},{"hbsfy/runtime":21}],101:[function(require,module,exports){
// var Handlebars = require("handlebars")["default"];
var Handlebars = require("hbsfy/runtime");
/** @type {Function} */
var Color = require("color");
/** @type {module:app/control/Globals} */
var Globals = require("app/control/Globals");

// (function() {
var helpers = {
	/*
	/* Arithmetic helpers
	/*/
	add: function(value, addition) {
		return value + addition;
	},
	subtract: function(value, substraction) {
		return value - substraction;
	},
	divide: function(value, divisor) {
		return value / divisor;
	},
	multiply: function(value, multiplier) {
		return value * multiplier;
	},
	floor: function(value) {
		return Math.floor(value);
	},
	ceil: function(value) {
		return Math.ceil(value);
	},
	round: function(value) {
		return Math.round(value);
	},
	global: function(value) {
		return Globals[value];
	},

	/*
	/* Flow control helpers
	/*/
	is: function(a, b, opts) {
		return (a === b) ? opts.fn(this) : opts.inverse(this);
	},
	isnot: function(a, b, opts) {
		return (a !== b) ? opts.fn(this) : opts.inverse(this);
	},
	isany: function(value) {
		var i = 0,
			ii = arguments.length - 2,
			opts = arguments[ii + 1];
		do
			if (value === arguments[++i]) {
				return opts.fn(this);
			}
		while (i < ii);
		return opts.inverse(this);
	},
	contains: function(a, b, opts) {
		return (a.indexOf(b) !== -1) ? opts.fn(this) : opts.inverse(this);
	},
	ignore: function() {
		return "";
	},

	/*
	/* Color helpers
	/*/
	mix: function(colora, colorb, amount) {
		return new Color(colora).mix(new Color(colorb), amount).rgbString();
	},
	lighten: function(color, amount) {
		return new Color(color).lighten(amount).rgbString();
	},
	darken: function(color, amount) {
		return new Color(color).darken(amount).rgbString();
	},
	// colorFormat: function(color, fmt) {
	// 	switch (fmt) {
	// 		case "rgb":
	// 			return new Color(color).rgbString();
	// 		case "hsl":
	// 			return new Color(color).hslString();
	// 		case "hex": default:
	// 			return new Color(color).hexString();
	// 	}
	// },
};
for (var helper in helpers) {
	if (helpers.hasOwnProperty(helper)) {
		Handlebars.registerHelper(helper, helpers[helper]);
	}
}
// })();

// module.exports = Handlebars;

},{"app/control/Globals":34,"color":"color","hbsfy/runtime":21}],102:[function(require,module,exports){
/** @type {module:underscore} */
var _ = require("underscore");
/** @type {module:backbone} */
var Events = require("backbone").Events;


// var defaultOptions = {
// 	tick: 1,
// 	onstart: null,
// 	ontick: null,
// 	onpause: null,
// 	onstop: null,
// 	onend: null
// }
var idSeed = 0;

var Timer = function(options) {
	// if (!(this instanceof Timer)) {
	// 	return new Timer(options);
	// }
	this._id = idSeed++;
	// this._options = {};
	this._duration = 0;
	this._status = "initialized";
	this._start = 0;
	// this._measures = [];

	// for (var prop in defaultOptions) {
	// 	this._options[prop] = defaultOptions[prop];
	// }
	// this.options(options);
};

_.extend(Timer.prototype, Events, {

	start: function(duration) {
		if (!_.isNumber(duration) && !this._duration) {
			return this;
		}
		// duration && (duration *= 1000)
		if (this._timeout && this._status === "started") {
			return this;
		}
		var evName = (this._status === "stopped") ? "start" : "resume";
		this._duration = duration || this._duration;
		this._timeout = window.setTimeout(end.bind(this), this._duration);
		// if (typeof this._options.ontick === "function") {
		// 	this._interval = setInterval(function() {
		// 		this.trigger("tick", this.getDuration())
		// 	}.bind(this), +this._options.tick * 1000)
		// }
		this._start = _now();
		this._status = "started";
		this.trigger(evName, this.getDuration());
		return this;
	},

	pause: function() {
		if (this._status !== "started") {
			return this;
		}
		this._duration -= (_now() - this._start);
		clear.call(this, false);
		this._status = "paused";
		this.trigger("pause", this.getDuration());
		return this;
	},

	stop: function() {
		if (!/started|paused/.test(this._status)) {
			return this;
		}
		clear.call(this, true);
		this._status = "stopped";
		this.trigger("stop");
		return this;
	},

	getDuration: function() {
		if (this._status === "started") {
			return this._duration - (_now() - this._start);
		}
		if (this._status === "paused") {
			return this._duration;
		}
		return 0;
	},

	getStatus: function() {
		return this._status;
	},
});

var _now = window.performance ?
	window.performance.now.bind(window.performance) :
	Date.now.bind(Date);

function end() {
	clear.call(this);
	this._status = "stopped";
	this.trigger("end");
}

function clear(clearDuration) {
	window.clearTimeout(this._timeout);
	// window.clearInterval(this._interval);
	if (clearDuration === true) {
		this._duration = 0;
	}
}

Object.defineProperties(Timer.prototype, {
	duration: {
		enumerable: true,
		get: function() {
			return this.getDuration();
		}
	},
	status: {
		enumerable: true,
		get: function() {
			return this.getStatus();
		}
	}
});

Object.defineProperties(Timer, {
	STOPPED: {
		enumerable: true,
		value: "stopped"
	},
	STARTED: {
		enumerable: true,
		value: "started"
	},
	PAUSED: {
		enumerable: true,
		value: "paused"
	},
});

module.exports = Timer;

},{"backbone":"backbone","underscore":"underscore"}],103:[function(require,module,exports){
/* -------------------------------
/* Imports
/* ------------------------------- */


/** @type {module:underscore} */
var _ = require("underscore");

/** @type {module:utils/TransformItem} */
var TransformItem = require("./TransformItem");

var idSeed = 0;
var cidSeed = 100;
var slice = Array.prototype.slice;

/**
 * @constructor
 * @type {module:app/helper/TransformHelper}
 */
function TransformHelper() {
	this.id = idSeed++;
	this._items = [];
	this._itemsById = {};
}

TransformHelper.prototype = Object.create({

	/* -------------------------------
	/* Private
	/* ------------------------------- */

	_get: function(el) {
		if (this.has(el)) {
			return this._itemsById[el.eid];
		} else {
			return this._add(el);
		}
	},

	_add: function(el) {
		var item, id;
		// id = el.eid || el.cid || el.id;
		// if (!id || (this._itemsById[id] && (this._itemsById[id].el !== el))) {
		// 	id = "elt" + cidSeed++;
		// }
		// if (!el.eid) {
		// 	id = el.eid || el.cid || ("elt" + cidSeed++);
		// }
		id = el.eid || el.cid || ("elt" + cidSeed++);
		item = new TransformItem(el, id);
		this._itemsById[id] = item;
		this._items.push(item);
		return item;
	},

	_remove: function(el) {
		if (this.has(el)) {
			var o = this._itemsById[el.eid];
			this._items.splice(this._items.indexOf(o), 1);
			o.destroy();
			delete this._itemsById[el.eid];
		}
	},

	_invoke: function(funcName, args, startIndex) {
		var i, ii, j, jj, el, o, rr;
		var funcArgs = null;
		if (startIndex !== void 0) {
			funcArgs = slice.call(args, 0, startIndex);
		} else {
			startIndex = 0;
		}
		for (i = startIndex, ii = args.length, rr = []; i < ii; ++i) {
			el = args[i];
			// iterate on NodeList, Arguments, Array...
			if (el.length) {
				for (j = 0, jj = el.length; j < jj; ++j) {
					o = this._get(el[j]);
					rr.push(o[funcName].apply(o, funcArgs));
				}
			} else {
				o = this._get(el);
				rr.push(o[funcName].apply(o, funcArgs));
			}
		}
		return rr;
	},

	/* -------------------------------
	/* Public
	/* ------------------------------- */

	has: function(el) {
		return el.eid && this._itemsById[el.eid] !== void 0;
	},

	getItems: function() {
		var i, j, el, ret = [];
		for (i = 0; i < arguments.length; ++i) {
			el = arguments[i];
			if (el.length) {
				for (j = 0; j < el.length; ++j) {
					ret.push(this._get(el[j]));
				}
			} else {
				ret.push(this._get(el));
			}
		}
		return ret;
	},

	get: function(el) {
		return this._get(el);
	},

	add: function() {
		var i, j, el;
		for (i = 0; i < arguments.length; ++i) {
			el = arguments[i];
			if (el.length) {
				for (j = 0; j < el.length; ++j) {
					this._get(el[j]);
				}
			} else {
				this._get(el);
			}
		}
	},

	remove: function() {
		var i, j, el;
		for (i = 0; i < arguments.length; ++i) {
			el = arguments[i];
			if (el.length) {
				for (j = 0; j < el.length; ++j) {
					this._remove(el[j]);
				}
			} else {
				this._remove(el);
			}
		}
	},

	/* --------------------------------
	/* public
	/* -------------------------------- */

	/* public: single arg
	/* - - - - - - - - - - - - - - - - */

	hasOffset: function(el) {
		return this.has(el) ? this._itemsById[el.eid].hasOffset : (void 0);
	},

	/* public: capture
	/* - - - - - - - - - - - - - - - - */

	capture: function() {
		this._invoke("capture", arguments);
	},
	captureAll: function() {
		for (var i = 0, ii = this._items.length; i < ii; i++) {
			this._items[i].capture();
		}
	},

	clearCapture: function() {
		this._invoke("clearCapture", arguments);
	},
	clearAllCaptures: function() {
		for (var i = 0, ii = this._items.length; i < ii; i++) {
			this._items[i].clearCapture();
		}
	},

	/* public: offset
	/* - - - - - - - - - - - - - - - - */
	offset: function(x, y) {
		this._invoke("offset", arguments, 2);
	},
	offsetAll: function(x, y) {
		for (var i = 0, ii = this._items.length; i < ii; i++) {
			this._items[i].offset(x, y);
		}
	},

	clearOffset: function() {
		this._invoke("clearOffset", arguments);
	},
	clearAllOffsets: function() {
		for (var i = 0, ii = this._items.length; i < ii; i++) {
			this._items[i].clearOffset();
		}
	},

	/* public: transitions
	/* - - - - - - - - - - - - - - - - */

	runTransition: function(transition) {
		this._invoke("runTransition", arguments, 1);
	},
	runAllTransitions: function(transition) {
		for (var i = 0, ii = this._items.length; i < ii; i++) {
			this._items[i].runTransition(transition);
		}
	},

	clearTransition: function() {
		this._invoke("clearTransition", arguments);
	},
	clearAllTransitions: function() {
		for (var i = 0, ii = this._items.length; i < ii; i++) {
			this._items[i].clearTransition();
		}
	},

	stopTransition: function() {
		this._invoke("stopTransition", arguments);
	},
	stopAllTransitions: function() {
		for (var i = 0, ii = this._items.length; i < ii; i++) {
			this._items[i].stopTransition();
		}
	},

	whenTransitionEnds: function() {
		var res = this._invoke("whenTransitionEnds", arguments);
		return res.length != 0 ?
			Promise.all(res) :
			Promise.resolve(null);
	},
	whenAllTransitionsEnd: function() {
		return (this._items.length != 0) ? Promise.all(this._items.map(function(o) {
			return o.whenTransitionEnds();
		})) : Promise.resolve(null);
	},

	promise: function() {
		return arguments.length == 0 ?
			this.whenAllTransitionsEnd() :
			this.whenTransitionEnds.call(this, arguments);
	},

	/* -------------------------------
	/* validation
	/* ------------------------------- */

	validate: function() {
		for (var i = 0, ii = this._items.length; i < ii; i++) {
			this._items[i].validate();
		}
	},
}, {
	items: {
		get: function() {
			return this._items;
		}
	}
});

module.exports = TransformHelper;

},{"./TransformItem":104,"underscore":"underscore"}],104:[function(require,module,exports){
/* -------------------------------
 * Imports
 * ------------------------------- */

/** @type {module:underscore} */
var _ = require("underscore");

/** @type {module:utils/prefixedProperty} */
var prefixedProperty = require("utils/prefixedProperty");
/** @type {module:utils/prefixedStyleName} */
var prefixedStyleName = require("utils/prefixedStyleName");
/** @type {module:utils/prefixedEvent} */
var prefixedEvent = require("utils/prefixedEvent");

/** @type {String} */
var transitionEnd = prefixedEvent("transitionend"); //require("utils/event/transitionEnd");
// /** @type {Function} */// var slice = Array.prototype.slice;

// /** @type {module:utils/debug/traceElement} */
// var traceElt = require("./debug/traceElement");
// var traceEltCache = {};
// var log = function() {
// 	var logFn = "log";
// 	var args = slice.apply(arguments);
// 	switch(args[0]) {
// 		case "error":
// 		case "warn":
// 		case "info":
// 			logFn = args.shift();
// 			break;
// 		default:
// 			// break;
// 			return;
// 	}
// 	var el, txId;
// 	if ((el = args[0]) && (txId = el.eid)) {
// 		args[0] = traceEltCache[txId] || (traceEltCache[txId] = el);
// 	}
// 	args[0] = "\t" + args[0];
// 	console[logFn].apply(console, args);
// };

/* jshint -W079 */
// var console = (function(target) {
// 	return Object.getOwnPropertyNames(target).reduce(function(proxy, prop) {
// 		if ((typeof target[prop]) == "function") {
// 			switch (prop) {
// 				case "error":
// 				case "warn":
// 				case "info":
// 					proxy[prop] = function () {
// 						var args = slice.apply(arguments);
// 						if (typeof args[0] == "string") {
// 							args[0] = prop + "::" + args[0];
// 						}
// 						return target[prop].apply(target, args);
// 					};
// 					break;
// 				case "log":
// 					proxy[prop] = function() {};
// 					break;
// 				default:
// 					proxy[prop] = target[prop].bind(target);
// 					break;
// 			}
// 		} else {
// 			Object.defineProperty(proxy, prop, {
// 				get: function() { return target[prop]; },
// 				set: function(val) { target[prop] = val; }
// 			});
// 		}
// 		return proxy;
// 	}, {});
// })(window.console);
/* jshint +W079 */

/* -------------------------------
/* Private static
/* ------------------------------- */

var NO_TRANSITION = "none 0s step-start 0s";


// var translateTemplate = function(o) {
// 	// return "translate(" + o._renderedX + "px, " + o._renderedY + "px)";
// 	// return "translate3d(" + o._renderedX + "px, " + o._renderedY + "px, 0px)";
// };

var translateTemplate = (function() {
	var fn = require("app/control/Globals").TRANSLATE_TEMPLATE;
	return function(o) {
		return fn(o._renderedX, o._renderedY);
	};
}());

var transitionTemplate = function(o) {
	return o.property + " " + o.duration / 1000 + "s " + o.easing + " " + o.delay / 1000 + "s";
};

var UNSET_TRANSITION = {
	name: "unset",
	className: "tx-unset",
	property: "none",
	easing: "ease",
	delay: 0,
	duration: 0,
	cssText: "unset",
};

// var transitionTemplate = _.template("<%= property %> <% duration/1000 %>s <%= easing %> <% delay/1000 %>s");
// var NO_TRANSITION = "all 0.001s step-start 0.001s";

var propDefaults = {
	"opacity": "1",
	"visibility": "visible",
	"transform": "matrix(1, 0, 0, 1, 0, 0)",
	"transformStyle": "",
	"transition": "",
	// "willChange": "",
	// "transitionDuration": "0s",
	// "transitionDelay": "0s",
	// "transitionProperty": "none",
	// "transitionTimingFunction": "ease"
};
var propKeys = Object.keys(propDefaults);
var propNames = propKeys.reduce(function(obj, propName) {
	obj[propName] = prefixedProperty(propName);
	return obj;
}, {});

/** @type {module:utils/strings/camelToDashed} */
var camelToDashed = require("utils/strings/camelToDashed");
var styleNames = propKeys.map(camelToDashed).reduce(function(obj, propName) {
	obj[propName] = prefixedStyleName(propName);
	return obj;
}, {});

var resolveAll = function(pp, result) {
	if (pp.length != 0) {
		pp.forEach(function(p, i, a) {
			p.resolve(result);
			a[i] = null;
		});
		pp.length = 0;
	}
	return pp;
};

var rejectAll = function(pp, reason) {
	if (pp.length != 0) {
		pp.forEach(function(p, i, a) {
			p.reject(reason);
			a[i] = null;
		});
		pp.length = 0;
	}
	return pp;
};

/* -------------------------------
 * TransformItem
 * ------------------------------- */

/**
 * @constructor
 */
function TransformItem(el, id) {
	_.bindAll(this, "_onTransitionEnd");

	this.el = el;
	this.id = id;
	this.el.eid = id;
	this.el.addEventListener(transitionEnd, this._onTransitionEnd, false);

	this._captureInvalid = false;
	this._capturedChanged = false;
	this._capturedX = null;
	this._capturedY = null;
	this._currCapture = {};
	this._lastCapture = {};

	this._hasOffset = false;
	this._offsetInvalid = false;
	this._offsetX = null;
	this._offsetY = null;

	this._renderedX = null;
	this._renderedY = null;

	this._hasTransition = false;
	this._transitionInvalid = false;
	this._transitionRunning = false;
	this._transition = _.extend({}, UNSET_TRANSITION); //{};

	this._promises = [];
	this._pendingPromises = [];
}

TransformItem.prototype = Object.create({

	/* -------------------------------
	/* Public
	/* ------------------------------- */

	/* destroy
	/* - - - - - - - - - - - - - - - - */
	destroy: function() {
		// NOTE: style property may have been modified; clearOffset(element) should
		// be called explicitly if clean up is required.
		this.el.removeEventListener(transitionEnd, this._onTransitionEnd, false);
		rejectAll(this._pendingPromises, this.el);
		rejectAll(this._promises, this.el);
		// delete this.el.eid;
	},

	/* capture
	/* - - - - - - - - - - - - - - - - */
	capture: function() {
		// console.log("tx[%s]::capture", this.id);
		this._validateCapture();
		return this;
	},

	clearCapture: function() {
		// console.log("tx[%s]::clearCapture", this.id);
		// this._hasOffset = false;
		this._captureInvalid = true;
		return this;
	},

	/* offset/clear
	/* - - - - - - - - - - - - - - - - */
	offset: function(x, y) {
		// console.log("tx[%s]::offset", this.id);

		this._hasOffset = true;
		this._offsetInvalid = true;
		this._offsetX = x || 0;
		this._offsetY = y || 0;
		// if (this.immediate) this._validateOffset();
		return this;
	},

	clearOffset: function() {
		if (this._hasOffset) {
			// console.log("tx[%s]::clearOffset", this.id);

			this._hasOffset = false;
			this._offsetInvalid = true;
			this._offsetX = null;
			this._offsetY = null;
			// if (this.immediate) this._validateOffset();
		} else {
			// console.log("tx[%s]::clearOffset no offset to clear", this.id);
		}
		return this;
	},

	/* transitions
	/* - - - - - - - - - - - - - - - - */
	runTransition: function(transition) {
		if (!transition) { // || (transition.duration + transition.delay) == 0) {
			return this.clearTransition();
		}
		var lastValue = this._transitionValue;
		var lastName = this._transition.name;
		this._transition.property = styleNames["transform"];
		this._transition = _.extend(this._transition, transition);
		this._transitionValue = transitionTemplate(this._transition);

		if (this._transitionInvalid) {
			console.warn("tx[%s]::runTransition set over (%s:'%s' => %s:'%s')", this.id,
				lastName, lastValue, this._transition.name, this._transitionValue);
		}

		this._hasTransition = true;
		this._transitionInvalid = true;
		// if (this.immediate) this._validateTransition();
		return this;
	},

	clearTransition: function() {
		this._transition = _.extend(this._transition, UNSET_TRANSITION);
		this._transitionValue = NO_TRANSITION;

		this._hasTransition = false;
		this._transitionInvalid = true;
		// if (this.immediate) this._validateTransition();
		return this;
	},

	stopTransition: function() {
		// this._transition.name = "[none]";
		// this._transition.property = "none";
		this._transition = _.extend(this._transition, UNSET_TRANSITION);
		this._transitionValue = NO_TRANSITION;

		this._hasTransition = false;
		this._transitionInvalid = true;
		// if (this.immediate) this._validateTransition();
		return this;
	},

	whenTransitionEnds: function() {
		var d, p, pp;
		if (this._transitionInvalid || this._transitionRunning) {
			d = {};
			p = new Promise(function(resolve, reject) {
				d.resolve = resolve;
				d.reject = reject;
			});
			pp = this._transitionInvalid ? this._pendingPromises : this._promises;
			pp.push(d);
		} else {
			p = Promise.resolve(this.el);
		}
		return p;
	},

	/* validation
	/* - - - - - - - - - - - - - - - - */
	validate: function() {
		// this.el.removeEventListener(transitionEnd, this._onTransitionEnd, false);
		this._ignoreEvent = true;

		if (this._captureInvalid) {
			var lastX = (this._renderedX !== null ? this._renderedX : this._capturedX),
				lastY = (this._renderedY !== null ? this._renderedY : this._capturedY);

			// this._validateTransition();
			this._validateCapture();
			this._validateOffset();

			var currX = (this._renderedX !== null ? this._renderedX : this._capturedX),
				currY = (this._renderedY !== null ? this._renderedY : this._capturedY);

			if (lastX === currX && lastY === currY) {
				this._hasTransition && console.warn("tx[%s]::validate unchanged: last:[%i,%i] curr:[%i,%i]", this.el.id || this.id, lastX, lastY, currX, currY);
				// console.info("tx[%s]::validate unchanged: last:[%f,%f] curr:[%f,%f] render:[%f,%f] captured[%f,%f]", this.el.id || this.id, lastX, lastY, currX, currY, this._renderedX, this._renderedY, this._capturedX, this._capturedY);
				this.clearTransition();
				// this._validateTransition();
			}
			this._validateTransition();
		} else {
			// this._validateCapture();
			this._validateTransition();
			this._validateOffset();
		}

		// this.el.addEventListener(transitionEnd, this._onTransitionEnd, false);
		this._ignoreEvent = false;

		// if (this._capturedChanged) {
		// 	console.error("tx[%s]::validate capture changed: [%f,%f]", this.id, this._capturedX, this._capturedY);
		// }
		this._capturedChanged = false;
		return this;
	},

	/* -------------------------------
	/* Private
	/* ------------------------------- */

	_validateCapture: function() {
		if (!this._captureInvalid) {
			return;
		}
		// var computed, capturedValues;
		var transformValue = null;

		if (this._hasOffset && !this._offsetInvalid) {
			// this is an explicit call to capture() instead of a subcall from _validateOffset()
			transformValue = this._getCSSProp("transform");
			if (transformValue === "") {
				console.error("tx[%s]::_capture valid offset (%i,$i) but transformValue=\"\"", this.id, this._offsetX, this._offsetY);
			}
			this._removeCSSProp("transform");
		}

		// NOTE: reusing object, all props will be overwritten
		this._lastCapture = this._currCapture;
		this._currCapture = this._getComputedCSSProps();

		if (this._currCapture.transform !== this._lastCapture.transform) {
			var m, mm; //, ret = {};
			mm = this._currCapture.transform.match(/(matrix|matrix3d)\(([^\)]+)\)/);
			if (mm) {
				m = mm[2].split(",");
				if (mm[1] === "matrix") {
					this._capturedX = parseFloat(m[4]);
					this._capturedY = parseFloat(m[5]);
				} else {
					this._capturedX = parseFloat(m[12]);
					this._capturedY = parseFloat(m[13]);
				}
			} else {
				this._capturedX = 0;
				this._capturedY = 0;
			}
			this._capturedChanged = true;
		}
		if (transformValue !== null) {
			console.log("tx[%s]::_capture reapplying '%s'", this.id, transformValue);
			this._setCSSProp("transform", transformValue);
		}
		this._captureInvalid = false;
	},

	_validateOffset: function() {
		if (this._offsetInvalid) {
			// this._validateCapture();
			this._offsetInvalid = false;
			if (this._hasOffset) {
				var tx = this._offsetX + this._capturedX;
				var ty = this._offsetY + this._capturedY;
				if (tx !== this._renderedX || ty !== this._renderedY) {
					this._renderedX = tx;
					this._renderedY = ty;
					this._setCSSProp("transform", translateTemplate(this));
				}
			} else {
				this._renderedX = null;
				this._renderedY = null;
				this._removeCSSProp("transform");
			}
		}
	},

	_validateTransition: function() {
		if (this._transitionInvalid) {
			// this._validateCapture();
			this._transitionInvalid = false;

			// save promises made while invalid
			var reject = this._promises;
			// prepare _promises and push in new ones
			this._promises = this._pendingPromises;
			// whatever still here is to be rejected. reuse array
			this._pendingPromises = rejectAll(reject, this.el);

			this._transitionRunning = this._hasTransition;
			this._setCSSProp("transition", this._transitionValue);

			if (!this._hasTransition) {
				// no transition, resolve now
				resolveAll(this._promises, this.el);
			}
		}
	},

	_onTransitionEnd: function(ev) {
		if (this._ignoreEvent) {
			return;
		}
		if (this._transitionRunning && (this.el === ev.target) &&
			(this._transition.property == ev.propertyName)) {
			this._hasTransition = false;
			this._transitionRunning = false;
			this._removeCSSProp("transition");
			resolveAll(this._promises, this.el);
		}
	},

	/* -------------------------------
	/* CSS
	/* ------------------------------- */

	_getCSSProp: function(prop) {
		return this.el.style[propNames[prop]];
		// return this.el.style[prefixedProperty(prop)];
		// return this.el.style.getPropertyValue(styleNames[prop]);
	},

	_setCSSProp: function(prop, value) {
		if (prop === "transition" && value == NO_TRANSITION) {
			value = "";
		}
		if (value === null || value === void 0 || value === "") {
			this._removeCSSProp(prop);
		} else {
			this.el.style[propNames[prop]] = value;
			// this.el.style.setProperty(styleNames[prop], value);
		}
	},

	_removeCSSProp: function(prop) {
		this.el.style[propNames[prop]] = "";
		// this.el.style.removeProperty(styleNames[prop]);
	},

	_getComputedCSSProps: function() {
		var values = {};
		var computed = window.getComputedStyle(this.el);
		for (var p in propNames) {
			values[p] = computed[propNames[p]];
		}
		return values;
	},
}, {
	transition: {
		get: function() {
			return this._transition;
		}
	},
	hasTransition: {
		get: function() {
			return this._hasTransition;
		}
	},
	capturedChanged: {
		get: function() {
			return this._capturedChanged;
		}
	},
	capturedX: {
		get: function() {
			return this._capturedX;
		}
	},
	capturedY: {
		get: function() {
			return this._capturedY;
		}
	},

	hasOffset: {
		get: function() {
			return this._hasOffset;
		}
	},
	offsetX: {
		get: function() {
			return this._offsetX;
		}
	},
	offsetY: {
		get: function() {
			return this._offsetY;
		}
	},
});

module.exports = TransformItem;
},{"app/control/Globals":34,"underscore":"underscore","utils/prefixedEvent":112,"utils/prefixedProperty":113,"utils/prefixedStyleName":114,"utils/strings/camelToDashed":117}],105:[function(require,module,exports){
var PI2 = Math.PI * 2;

var splice = Array.prototype.splice;
// var concat = Array.prototype.concat;

var setStyle = function(ctx, s) {
	if (typeof s != "object") return;
	for (var p in s) {
		switch (typeof ctx[p]) {
			case "undefined":
				break;
			case "function":
				if (Array.isArray(s[p])) ctx[p].apply(ctx, s[p]);
				else ctx[p].call(ctx, s[p]);
				break;
			default:
				ctx[p] = s[p];
		}
	}
};

var _drawShape = function(fn, s, ctx) {
	ctx.save();
	if (s) setStyle(ctx, s);
	fn.apply(null, splice.call(arguments, 2));
	if (ctx.lineWidth !== "transparent") ctx.stroke();
	if (ctx.fillStyle !== "transparent") ctx.fill();
	ctx.restore();
};

module.exports = {
	setStyle: setStyle,

	vGuide: function(ctx, x) {
		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, ctx.canvas.height);
	},
	drawVGuide: function(ctx, s, x) {
		_drawShape(this.vGuide, s, ctx, x);
	},

	hGuide: function(ctx, y) {
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(ctx.canvas.width, y);
	},
	drawHGuide: function(ctx, s, y) {
		_drawShape(this.hGuide, s, ctx, y);
	},

	crosshair: function(ctx, x, y, r) {
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(Math.PI / 4);
		ctx.beginPath();
		ctx.moveTo(0, -r);
		ctx.lineTo(0, r);
		ctx.moveTo(-r, 0);
		ctx.lineTo(r, 0);
		ctx.restore();
	},
	drawCrosshair: function(ctx, s, x, y, r) {
		_drawShape(this.crosshair, s, ctx, x, y, r);
	},

	circle: function(ctx, x, y, r) {
		ctx.beginPath();
		ctx.arc(x, y, r, 0, PI2);
	},
	drawCircle: function(ctx, s, x, y, r) {
		_drawShape(this.circle, s, ctx, x, y, r);
	},

	square: function(ctx, x, y, r) {
		r = Math.floor(r / 2) * 2;
		ctx.beginPath();
		ctx.rect(x - r, y - r, r * 2, r * 2);
	},
	drawSquare: function(ctx, s, x, y, r) {
		_drawShape(this.square, s, ctx, x, y, r);
	},

	arrowhead: function(ctx, x, y, r, t) {
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(t); // - Math.PI * 0.5);
		ctx.translate(r * 0.5, 0);
		ctx.beginPath();
		ctx.moveTo(0, 0);
		// ctx.lineTo(-r, r * Math.SQRT1_2);
		// ctx.lineTo(-r, -r * Math.SQRT1_2);
		ctx.lineTo(-r * Math.SQRT2, r * Math.SQRT1_2);
		ctx.arcTo(0, 0, -r * Math.SQRT2, -r * Math.SQRT1_2, r);
		// ctx.quadraticCurveTo(0, 0, -r * Math.SQRT2, -r * Math.SQRT1_2);
		ctx.lineTo(0, 0);
		ctx.closePath();
		ctx.restore();
	},
	drawArrowhead: function(ctx, s, x, y, r, t) {
		_drawShape(this.arrowhead, s, ctx, x, y, r, t);
	},

	rect: function(ctx, a1, a2, a3, a4) {

		ctx.beginPath();
		if (isNaN(a1)) {
			ctx.rect(a1.left, a1.top, a1.width, a1.height);
		} else {
			ctx.rect(a1, a2, a3, a4);
		}
	},
	drawRect: function(ctx, s, a1, a2, a3, a4) {
		_drawShape(this.rect, s, ctx, a1, a2, a3, a4);
	},
};
},{}],106:[function(require,module,exports){
/**
 * @module utils/canvas/calcArcHConnector
 */

module.exports = function(x1, y1, r1, x2, y2, r2, ro) {
	var qx = x2 > x1 ? 1 : -1;
	var qy = y2 > y1 ? 1 : -1;
	var dy = Math.abs(y2 - y1);
	var dx = Math.abs(x2 - x1);
	var rr = r1 + r2;
	var tx1, tx2, c, tx, ty;

	if (dy < 1) {
		// points are aligned horizontally, no arcs needed
		tx1 = 0;
		tx2 = dx
		// return [x1, x2];
	}

	if (dy >= rr && dx >= rr) {
		// arcs fit horizontally:
		// second circle center is r1+r2, tangent intersect at x=r1
		c = rr;
		tx1 = r1;
		tx2 = r1;
	} else {
		// arcs overlap horizontally:
		// find second circle center
		c = Math.sqrt(dy * r2 * 2 + dy * r1 * 2 - dy * dy);

		// circles tangent point
		tx = (c * r1) / rr;
		ty = (dy * r1) / rr;

		if (r1 < ty || c > dx) {
			return;
		}

		// tangent perpendicular slope
		var slope = (rr - dy) / c;
		// tangent intersections
		tx1 = tx - (ty * slope);
		tx2 = (dy * slope) + tx1;

		/*
		// circle centers
		var ccx1, ccy1, ccx2, ccy2;
		ccx1 = 0;
		ccy1 = r1;
		ccx2 = c;
		ccy2 = dy - r2;
		// tangent perpendicular slope
		var slope = (ccy1 - ccy2) / (ccx2 - ccx1);
		var xSec = tx - (ty * slope);
		// tangent intersections
		tx1 = xSec;
		tx2 = (dy * slope) + xSec;
		*/
	}

	// offset arcTo's in x-axis
	if (ro > 0) {
		if (ro > 1) {
			ro = Math.min(dx - rr, ro);
		} else {
			ro *= dx - rr;
		}
		tx1 += ro;
		tx2 += ro;
	}

	return [tx1 * qx + x1, tx2 * qx + x1, tx1, tx2];
};

/*
var drawArcConnector = function(ctx, x1, y1, x2, y2, r) {
	var dx, dy, hx, hy, gx, gy;

	hx = 0;
	hy = 0;
	gx = (x1 + x2) / 2;
	gy = (y1 + y2) / 2;
	dx = Math.abs(x1 - gx);
	dy = Math.abs(y1 - gy);

	if (dx < r && dy < r) {
		r = Math.min(dx * Math.SQRT1_2, dy * Math.SQRT1_2);
	} else {
		if (dx < r) {
			hy = Math.acos(dx / r) * r * 0.5;
			if (y1 > y2) hy *= -1;
		}
		if (dy < r) {
			hx = Math.acos(dy / r) * r * 0.5;
			if (x1 > x2) hx *= -1;
		}
	}
	ctx.arcTo(gx - hx, y1, gx + hx, y2, r);
	ctx.arcTo(gx + hx, y2, x2, y2, r);
};

var drawArcConnector2 = function(ctx, x1, y1, x2, y2, r) {
	var dx, dy, hx, hy, cx1, cx2;

	hx = 0;
	hy = 0;
	dx = Math.abs(x2 - x1) / 2;
	dy = Math.abs(y1 - y2) / 2;

	if (dx < r && dy < r) {
		r = Math.min(dx * Math.SQRT1_2, dy * Math.SQRT1_2);
	} else {
		if (dx < r) {
			hy = Math.acos(dx / r) * r;
		}
		if (dy < r) {
			hx = Math.acos(dy / r) * r;
		}
	}
	cx1 = x1 + dx;
	cx2 = x2 - (dx - hx / 2);
	ctx.arcTo(cx1, y1, cx2, y2, r);
	ctx.arcTo(cx2, y2, x2, y2, r);
};

var drawArcConnector1 = function(ctx, x1, y1, x2, y2, r) {
	var dx, dy, cx;

	dx = Math.abs(x2 - x1) / 2;
	dy = Math.abs(y1 - y2) / 2;
	r = Math.min(r, dy * Math.SQRT1_2);
	if (x1 < x2) {
		cx = x1 + dx + r;
	} else {
		cx = x2 - dx - r;
	}
	// cx = (x2 + x1) / 2;
	// cx += x1 < x2 ? r : -r;

	ctx.arcTo(cx, y1, cx, y2, r);
	ctx.arcTo(cx, y2, x2, y2, r);
};
*/

},{}],107:[function(require,module,exports){
(function (DEBUG){
/* global HTMLElement, CSSStyleDeclaration */

// var parseSize = require("./parseSize");

var CSS_BOX_PROPS = [
	"boxSizing", "position", "objectFit"
];
var CSS_EDGE_PROPS = [
	"marginTop", "marginBottom", "marginLeft", "marginRight",
	"borderTopWidth", "borderBottomWidth", "borderLeftWidth", "borderRightWidth",
	"paddingTop", "paddingBottom", "paddingLeft", "paddingRight",
];
var CSS_POS_PROPS = ["top", "bottom", "left", "right"];
var CSS_SIZE_PROPS = ["width", "height", "minWidth", "minHeight", "maxWidth", "maxHeight"];
var CSS_ALL_PROPS = CSS_EDGE_PROPS.concat(CSS_SIZE_PROPS, CSS_POS_PROPS);

// var COMPUTED_PROPS = [
// 	"clientLeft", "clientTop", "clientWidth", "clientHeight",
// 	"offsetLeft", "offsetTop", "offsetWidth", "offsetHeight"
// ];
// var o = _.pick(element, function(val) {
// 	return /^(offset|client)(Left|Top|Width|Height)/.test(val);
// });

var cssDimensionRE = /^(-?[\d\.]+)(px|em|rem)$/;
// var cssDimRe = /^([-\.0-9]+)([rem]+)$/;

module.exports = function(s, m, includeSizePos) {
	if (s instanceof HTMLElement) {
		s = getComputedStyle(s);
	}
	if (DEBUG) {
		if (!(s instanceof CSSStyleDeclaration)) {
			throw new Error("Not a CSSStyleDeclaration nor HTMLElement");
		}
	}
	var v, p, i, ii, emPx, remPx;
	m || (m = {});

	emPx = m.fontSize = parseFloat(s.fontSize);

	for (i = 0, ii = CSS_BOX_PROPS.length; i < ii; i++) {
		p = CSS_BOX_PROPS[i];
		if (p in s) {
			m[p] = s[p];
		}
	}
	var cssProps = includeSizePos ? CSS_EDGE_PROPS : CSS_ALL_PROPS;
	for (i = 0, ii = cssProps.length; i < ii; i++) {
		p = cssProps[i];
		m["_" + p] = s[p];
		if (s[p] && (v = cssDimensionRE.exec(s[p]))) {
			if (v[2] === "px") {
				m[p] = parseFloat(v[1]);
			} else if (v[2] === "em") {
				m[p] = parseFloat(v[1]) * emPx;
			} else if (v[2] === "rem") {
				remPx || (remPx = parseFloat(getComputedStyle(document.documentElement).fontSize));
				m[p] = parseFloat(v[1]) * remPx;
			} else {
				console.warn("Ignoring value", p, v[1], v[2]);
				m[p] = null;
			}
		} // else {
		//	console.warn("Ignoring unitless value", p, v);
		//}
	}
	return m;
};

}).call(this,true)

},{}],108:[function(require,module,exports){
/**
Returns a bounding rect for _el_ with absolute coordinates corrected for
scroll positions.

The native `getBoundingClientRect()` returns coordinates for an element's
visual position relative to the top left of the viewport, so if the element
is part of a scrollable region that has been scrolled, its coordinates will
be different than if the region hadn't been scrolled.

This method corrects for scroll offsets all the way up the node tree, so the
returned bounding rect will represent an absolute position on a virtual
canvas, regardless of scrolling.

@method getAbsoluteClientRect
@param {HTMLElement} el HTML element.
@return {Object} Absolute bounding rect for _el_.
**/

module.exports = function(el) {
	var doc = document,
		win = window,
		body = doc.body,

		// pageXOffset and pageYOffset work everywhere except IE <9.
		offsetX = win.pageXOffset !== undefined ? win.pageXOffset :
		(doc.documentElement || body.parentNode || body).scrollLeft,
		offsetY = win.pageYOffset !== undefined ? win.pageYOffset :
		(doc.documentElement || body.parentNode || body).scrollTop,

		rect = el.getBoundingClientRect();

	if (el !== body) {
		var parent = el.parentNode;

		// The element's rect will be affected by the scroll positions of
		// *all* of its scrollable parents, not just the window, so we have
		// to walk up the tree and collect every scroll offset. Good times.
		while (parent !== null && parent !== body) {
			offsetX += parent.scrollLeft;
			offsetY += parent.scrollTop;
			parent = parent.parentNode;
		}
	}

	return {
		_src: rect,
		bottom: rect.bottom + offsetY,
		height: rect.height,
		left: rect.left + offsetX,
		right: rect.right + offsetX,
		top: rect.top + offsetY,
		width: rect.width
	};
};
},{}],109:[function(require,module,exports){
/**
 * @param {number} i current iteration
 * @param {number} s start value
 * @param {number} d change in value
 * @param {number} t total iterations
 * @return {number}
 */
var linear = function(i, s, d, t) {
	return d * i / t + s;
};

module.exports = linear;

},{}],110:[function(require,module,exports){
/* https://html.spec.whatwg.org/multipage/media.html#event-media-canplay
 */
module.exports = [
	// networkState
	"loadstart",
	"progress",
	"suspend",
	"abort",
	"error",
	"emptied",
	"stalled",
	// readyState
	"loadedmetadata",
	"loadeddata",
	"canplay",
	"canplaythrough",
	"playing",
	"waiting",
	//
	"seeking", // seeking changed to true
	"seeked", // seeking changed to false
	"ended", // ended is true
	//
	"durationchange", // duration updated
	"timeupdate", // currentTime updated
	"play", // paused is false
	"pause", // paused is false
	"paused", // ??
	"ratechange",
	//
	"resize",
	"volumechange",
];
},{}],111:[function(require,module,exports){
/**
 * @module app/view/component/GraphView
 */

// /** @type {module:underscore} */
// var _ = require("underscore");

module.exports = function(rect, dx, dy) {
	dy || (dy = dx);
	var r = {
		width: rect.width + dx * 2,
		height: rect.height + dy * 2
	};
	if (r.width >= 0) {
		r.left = rect.left - dx;
		r.right = r.left + r.width;
		r.x = r.left;
	} else {
		r.right = rect.right + dx;
		r.left = rect.right - r.width;
		r.y = r.right;
	}
	if (r.height >= 0) {
		r.top = rect.top - dy;
		r.bottom = r.top + r.height;
		r.y = r.top;
	} else {
		r.bottom = rect.bottom + dy;
		r.top = rect.bottom - r.height;
		r.y = r.bottom;
	}

	return r;
};

},{}],112:[function(require,module,exports){
/** @type {Array} lowercase prefixes */
var lcPrefixes = [""].concat(require("./prefixes"));

/** @type {Array} capitalized prefixes */
var ucPrefixes = lcPrefixes.map(function(s) {
	return (s === "") ? s : s.charAt(0).toUpperCase() + s.substr(1);
});

/** @type {Object} specific event solvers */
var _solvers = {};

/** @type {Object} cached values */
var _cache = {};

/**
 * @param {String} name Unprefixed event name
 * @param {?Object} obj Prefix test target
 * @param {?String} testProp Proxy property to test prefixes
 * @return {String|null}
 */
var _prefixedEvent = function(name, obj, testProp) {
	var prefixes = /^[A-Z]/.test(name) ? ucPrefixes : lcPrefixes;
	obj || (obj = document);
	for (var i = 0; i < prefixes.length; i++) {
		if (testProp) {
			if ((prefixes[i] + testProp) in obj) {
				return prefixes[i] + name;
			}
		}
		if (("on" + prefixes[i] + name) in obj) {
			return prefixes[i] + name;
		}
	}
	return null;
};

// transitionend
_solvers["transitionend"] = function() {
	var prop, style = document.body.style,
		map = {
			"transition": "transitionend",
			"WebkitTransition": "webkitTransitionEnd",
			"MozTransition": "transitionend",
			// "msTransition" : "MSTransitionEnd",
			"OTransition": "oTransitionEnd"
		};
	for (prop in map) {
		if (prop in style) {
			return map[prop];
		}
	}
	return null;
};

/**
 * get the prefixed property
 * @param {String} property name
 * @param {Object} look-up object
 * @returns {String|null} prefixed
 */
module.exports = function(evName) {
	if (!_cache.hasOwnProperty(evName)) {
		_cache[evName] = _solvers.hasOwnProperty(evName) ? _solvers[evName]() : _prefixedEvent.apply(null, arguments);
		if (_cache[evName] === null) {
			console.warn("Event '%s' not found", evName);
		} else {
			console.log("Event '%s' found as '%s'", evName, _cache[evName]);
		}
	}
	return _cache[evName];
	// return _cache[evName] || (_cache[evName] = _solvers[evName]? _solvers[evName].call() : _prefixedProperty.apply(null, arguments));
};

/*
var defaultTest = function(name, obj) {
	var prefixes = /^[A-Z]/.test(name)? ucPrefixes : lcPrefixes;
	for (var i = 0; i < prefixes.length; i++) {
		if (("on" + prefixes[i] + name) in obj) {
			console.log("Event '%s' found as '%s'", name, prefixes[i] + name);
			return prefixes[i] + name;
		}
	}
	return null;
};

var proxyTest = function(name, obj, testProp) {
	var prefixes = /^[A-Z]/.test(name)? ucPrefixes : lcPrefixes;
	for (var i = 0; i < prefixes.length; i++) {
		if ((prefixes[i] + testProp) in obj) {
			console.log("Event %s inferred as '%s' from property '%s'", name, prefixes[i] + name, testProp);
			return prefixes[i] + name;
		}
	}
	return null;
};
*/

},{"./prefixes":115}],113:[function(require,module,exports){
/**
/* @module utils/prefixedProperty
/*/

/** @type {module:utils/prefixes} */
var prefixes = require("./prefixes");
/** @type {Number} prefix count */
var _prefixNum = prefixes.length;
/** @type {Array} cached values */
var _cache = {};

var _prefixedProperty = function(prop, obj) {
	var prefixedProp, camelProp;

	if (prop in obj) {
		console.log("Property '%s' found unprefixed", prop);
		return prop;
	}
	camelProp = prop[0].toUpperCase() + prop.slice(1);
	for (var i = 0; i < _prefixNum; i++) {
		prefixedProp = prefixes[i] + camelProp;
		if (prefixedProp in obj) {
			console.log("Property '%s' found as '%s'", prop, prefixedProp);
			return prefixedProp;
		}
	}
	console.error("Property '%s' not found", prop);
	return null;
};

/**
 * get the prefixed property
 * @param {String} property name
 * @param {Object} look-up object
 * @returns {String|null} prefixed
 */
module.exports = function(prop, obj) {
	return _cache[prop] || (_cache[prop] = _prefixedProperty(prop, obj || document.body.style));
};

},{"./prefixes":115}],114:[function(require,module,exports){
/**
/* @module utils/prefixedStyleName
/*/

/** @type {module:utils/prefixes} */
var prefixes = require("./prefixes"); //.map(function(prefix) { return "-" + prefix + "-"; });
/** @type {Number} prefix count */
var _prefixNum = prefixes.length;
/** @type {Array} cached values */
var _cache = {};

var _prefixedStyleName = function(style, styleObj) {
	var prefixedStyle;

	if (style in styleObj) {
		console.log("CSS style '%s' found unprefixed", style);
		return style;
	}
	for (var i = 0; i < _prefixNum; i++) {
		prefixedStyle = "-" + prefixes[i] + "-" + style;
		// prefixedStyle = prefixes[i] + style;
		if (prefixedStyle in styleObj) {
			console.log("CSS style '%s' found as '%s'", style, prefixedStyle);
			return prefixedStyle;
		}
	}
	console.warn("CSS style '%s' not found", style);
	return null;
};

/**
 * get the prefixed style name
 * @param {String} style name
 * @param {Object} look-up style object
 * @returns {String|Undefined} prefixed
 */
module.exports = function(style, styleObj) {
	// return _cache[style] || (_cache[style] = _prefixedStyleName_reverse(style, styleObj || document.body.style));
	return _cache[style] || (_cache[style] = _prefixedStyleName(style, styleObj || document.body.style));
};

// /** @type {module:utils/strings/camelToDashed} */
// var camelToDashed = require("./strings/camelToDashed");
// /** @type {module:utils/prefixedProperty} */
// var prefixedProperty = require("./prefixedProperty");
// /** @type {module:utils/strings/dashedToCamel} */
// var dashedToCamel = require("./strings/dashedToCamel");
//
// var _prefixedStyleName_reverse = function (style, styleObj) {
// 	var camelProp, prefixedProp;
// 	camelProp = dashedToCamel(style);
// 	prefixedProp = prefixedProperty(camelProp, styleObj);
// 	return prefixedProp? (camelProp === prefixedProp? "" : "-") + camelToDashed(prefixedProp) : null;
// };

},{"./prefixes":115}],115:[function(require,module,exports){
module.exports = ["webkit", "moz", "ms", "o"];

},{}],116:[function(require,module,exports){
/* jshint ignore:start */
/*
Taken from:
https://github.com/webcomponents/webcomponentsjs/blob/master/src/MutationObserver/MutationObserver.js
*/
/*
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

var setImmediate;

// As much as we would like to use the native implementation, IE
// (all versions) suffers a rather annoying bug where it will drop or defer
// callbacks when heavy DOM operations are being performed concurrently.
//
// For a thorough discussion on this, see:
// http://codeforhire.com/2013/09/21/setimmediate-and-messagechannel-broken-on-internet-explorer-10/
if (/Trident|Edge/.test(navigator.userAgent)) {
	// Sadly, this bug also affects postMessage and MessageQueues.
	//
	// We would like to use the onreadystatechange hack for IE <= 10, but it is
	// dangerous in the polyfilled environment due to requiring that the
	// observed script element be in the document.
	setImmediate = setTimeout;

	// If some other browser ever implements it, let's prefer their native
	// implementation:
} else if (window.setImmediate) {
	setImmediate = window.setImmediate;

	// Otherwise, we fall back to postMessage as a means of emulating the next
	// task semantics of setImmediate.
} else {
	var setImmediateQueue = [];
	var sentinel = String(Math.random());
	window.addEventListener("message", function(e) {
		if (e.data === sentinel) {
			var queue = setImmediateQueue;
			setImmediateQueue = [];
			queue.forEach(function(func) {
				func();
			});
		}
	});
	setImmediate = function(func) {
		setImmediateQueue.push(func);
		window.postMessage(sentinel, "*");
	};
}

module.exports = setImmediate;
/* jshint ignore:end */

},{}],117:[function(require,module,exports){
module.exports = function(str) {
	return str.replace(/[A-Z]/g, function($0) {
		return "-" + $0.toLowerCase();
	});
};

},{}],118:[function(require,module,exports){
module.exports = function(s) {
	return s.replace(/<[^>]+>/g, "");
};

},{}],119:[function(require,module,exports){
/** @type {module:hammerjs} */
var Hammer = require("hammerjs");

// /**
//  * get a usable string, used as event postfix
//  * @param {Const} state
//  * @returns {String} state
//  */
// function stateStr(state) {
// 	if (state & Hammer.STATE_CANCELLED) {
// 		return "cancel";
// 	} else if (state & Hammer.STATE_ENDED) {
// 		return "end";
// 	} else if (state & Hammer.STATE_CHANGED) {
// 		return "move";
// 	} else if (state & Hammer.STATE_BEGAN) {
// 		return "start";
// 	}
// 	return "";
// }

/**
 * direction cons to string
 * @param {Const} direction
 * @returns {String}
 */
function dirStr(direction) {
	if (direction == Hammer.DIRECTION_DOWN) {
		return "down";
	} else if (direction == Hammer.DIRECTION_UP) {
		return "up";
	} else if (direction == Hammer.DIRECTION_LEFT) {
		return "left";
	} else if (direction == Hammer.DIRECTION_RIGHT) {
		return "right";
	}
	return "";
}

///**
// * Pan
// * Recognized when the pointer is down and moved in the allowed direction.
// * @constructor
// * @extends AttrRecognizer
// */
//function PanRecognizer() {
//	Hammer.AttrRecognizer.apply(this, arguments);
//
//	this.pX = null;
//	this.pY = null;
//}
//
//inherit(PanRecognizer, Hammer.AttrRecognizer, {
//	/**
//	/* @namespace
//	/* @memberof PanRecognizer
//	/*/
//	defaults: {
//		event: "pan",
//		threshold: 10,
//		pointers: 1,
//		direction: DIRECTION_ALL
//	},
//
//	getTouchAction: function() {
//		var direction = this.options.direction;
//		var actions = [];
//		if (direction & DIRECTION_HORIZONTAL) {
//			actions.push(TOUCH_ACTION_PAN_Y);
//		}
//		if (direction & DIRECTION_VERTICAL) {
//			actions.push(TOUCH_ACTION_PAN_X);
//		}
//		return actions;
//	},
//
//	directionTest: function(input) {
//		var options = this.options;
//		var hasMoved = true;
//		var distance = input.distance;
//		var direction = input.direction;
//		var x = input.deltaX;
//		var y = input.deltaY;
//
//		// lock to axis?
//		if (!(direction & options.direction)) {
//			if (options.direction & DIRECTION_HORIZONTAL) {
//				direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
//				hasMoved = x != this.pX;
//				distance = Math.abs(input.deltaX);
//			} else {
//				direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
//				hasMoved = y != this.pY;
//				distance = Math.abs(input.deltaY);
//			}
//		}
//		input.direction = direction;
//		return hasMoved && distance > options.threshold && direction & options.direction;
//	},
//
//	attrTest: function(input) {
//		return AttrRecognizer.prototype.attrTest.call(this, input) &&
//			(this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
//	},
//
//	emit: function(input) {
//		this.pX = input.deltaX;
//		this.pY = input.deltaY;
//
//		var direction = dirStr(input.direction);
//		if (direction) {
//			this.manager.emit(this.options.event + direction, input);
//		}
//
//		this._super.emit.call(this, input);
//	}
//});

/**
 * SmoothPan
 * @constructor
 * @extends Hammer.Pan
 */
function SmoothPan() {
	var ret = Hammer.Pan.apply(this, arguments);
	this.thresholdOffsetX = null;
	this.thresholdOffsetY = null;
	this.thresholdOffset = null;
	return ret;
}

Hammer.inherit(SmoothPan, Hammer.Pan, {
	emit: function(input) {
		// Inheritance breaks, so this code is taken from PanRecognizer.emit
		//	this._super.emit.call(this, input); // Triggers infinite recursion
		//	Hammer.Pan.prototype.emit.apply(this, arguments); // This breaks too

		var threshold = this.options.threshold;
		var direction = input.direction;

		if (this.state == Hammer.STATE_BEGAN) {
			this.thresholdOffsetX = (direction & Hammer.DIRECTION_HORIZONTAL) ? ((direction & Hammer.DIRECTION_LEFT) ? threshold : -threshold) : 0;
			this.thresholdOffsetY = (direction & Hammer.DIRECTION_VERTICAL) ? ((direction & Hammer.DIRECTION_UP) ? threshold : -threshold) : 0;
			// this.thresholdOffset = (direction & Hammer.DIRECTION_HORIZONTAL)? input.thresholdOffsetX : input.thresholdOffsetY;
			// console.log("RECOGNIZER STATE", dirStr(direction), stateStr(this.state), this.thresholdOffsetX);
		}
		input.thresholdOffsetX = this.thresholdOffsetX;
		input.thresholdOffsetY = this.thresholdOffsetY;
		input.thresholdDeltaX = input.deltaX + this.thresholdOffsetX;
		input.thresholdDeltaY = input.deltaY + this.thresholdOffsetY;

		this.pX = input.deltaX;
		this.pY = input.deltaY;

		direction = dirStr(direction);
		if (direction) {
			this.manager.emit(this.options.event + direction, input);
		}
		return Hammer.Recognizer.prototype.emit.apply(this, arguments);
	}
});

module.exports = SmoothPan;

},{"hammerjs":"hammerjs"}],120:[function(require,module,exports){
module.exports={
	"units": {
		"hu_px": "20",
		"vu_px": "12"
	},
	"transitions": {
		"min_delay_ms": "34",
		"delay_interval_ms": "134",
		"duration_ms": "400",
		"ease": "ease"
	},
	"breakpoints": {
		"fullwidth-small": "'not screen and (min-width: 460px)'",
		"fullwidth": "'not screen and (min-width: 704px), not screen and (min-height: 540px)'",
		"desktop-small": "'only screen and (min-width: 1024px) and (min-height: 540px)'",
		"desktop-medium": "'only screen and (min-width: 1224px) and (min-height: 704px)'",
		"desktop-large": "'only screen and (min-width: 1824px) and (min-height: 1024px)'"
	},
	"default_colors": {
		"color": "hsl(47, 5%, 15%)",
		"background-color": "hsl(47, 5%, 95%)",
		"--link-color": "hsl(10, 80%, 50%)"
	},
	"temp": {
		"collapse_offset": "360"
	},
	"_ignore": {

		"breakpoints": {
			"mobile": "'not screen and (min-width: 704px), not screen and (min-height: 540px)'",
			"unsupported": "'not screen and (min-width: 704px)'",
			"unquoted": "only screen and (min-width: 1824px)",
			"unquoted_neg": "not screen and (min-width: 704px)",
			"quoted_combined": "'not screen and (min-width: 704px), not screen and (min-height: 540px)'",
			"array": [
				"only screen and (min-width: 704px)",
				"not screen and (min-width: 704px)",
				"not screen and (min-height: 540px)"
			]
		},
		"default_colors": {
			"--alt-background-color": "unset"
		}
	}
}

},{}]},{},[32])
//# sourceMappingURL=folio-debug-client.js.map
