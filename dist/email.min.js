(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.emailjs = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
(function (global,setImmediate){
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

/**
 * @this {Promise}
 */
function finallyConstructor(callback) {
  var constructor = this.constructor;
  return this.then(
    function(value) {
      // @ts-ignore
      return constructor.resolve(callback()).then(function() {
        return value;
      });
    },
    function(reason) {
      // @ts-ignore
      return constructor.resolve(callback()).then(function() {
        // @ts-ignore
        return constructor.reject(reason);
      });
    }
  );
}

// Store setTimeout reference so promise-polyfill will be unaffected by
// other code modifying setTimeout (like sinon.useFakeTimers())
var setTimeoutFunc = setTimeout;

function isArray(x) {
  return Boolean(x && typeof x.length !== 'undefined');
}

function noop() {}

// Polyfill for Function.prototype.bind
function bind(fn, thisArg) {
  return function() {
    fn.apply(thisArg, arguments);
  };
}

/**
 * @constructor
 * @param {Function} fn
 */
function Promise(fn) {
  if (!(this instanceof Promise))
    throw new TypeError('Promises must be constructed via new');
  if (typeof fn !== 'function') throw new TypeError('not a function');
  /** @type {!number} */
  this._state = 0;
  /** @type {!boolean} */
  this._handled = false;
  /** @type {Promise|undefined} */
  this._value = undefined;
  /** @type {!Array<!Function>} */
  this._deferreds = [];

  doResolve(fn, this);
}

function handle(self, deferred) {
  while (self._state === 3) {
    self = self._value;
  }
  if (self._state === 0) {
    self._deferreds.push(deferred);
    return;
  }
  self._handled = true;
  Promise._immediateFn(function() {
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
      return;
    }
    var ret;
    try {
      ret = cb(self._value);
    } catch (e) {
      reject(deferred.promise, e);
      return;
    }
    resolve(deferred.promise, ret);
  });
}

function resolve(self, newValue) {
  try {
    // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
    if (newValue === self)
      throw new TypeError('A promise cannot be resolved with itself.');
    if (
      newValue &&
      (typeof newValue === 'object' || typeof newValue === 'function')
    ) {
      var then = newValue.then;
      if (newValue instanceof Promise) {
        self._state = 3;
        self._value = newValue;
        finale(self);
        return;
      } else if (typeof then === 'function') {
        doResolve(bind(then, newValue), self);
        return;
      }
    }
    self._state = 1;
    self._value = newValue;
    finale(self);
  } catch (e) {
    reject(self, e);
  }
}

function reject(self, newValue) {
  self._state = 2;
  self._value = newValue;
  finale(self);
}

function finale(self) {
  if (self._state === 2 && self._deferreds.length === 0) {
    Promise._immediateFn(function() {
      if (!self._handled) {
        Promise._unhandledRejectionFn(self._value);
      }
    });
  }

  for (var i = 0, len = self._deferreds.length; i < len; i++) {
    handle(self, self._deferreds[i]);
  }
  self._deferreds = null;
}

/**
 * @constructor
 */
function Handler(onFulfilled, onRejected, promise) {
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, self) {
  var done = false;
  try {
    fn(
      function(value) {
        if (done) return;
        done = true;
        resolve(self, value);
      },
      function(reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      }
    );
  } catch (ex) {
    if (done) return;
    done = true;
    reject(self, ex);
  }
}

Promise.prototype['catch'] = function(onRejected) {
  return this.then(null, onRejected);
};

Promise.prototype.then = function(onFulfilled, onRejected) {
  // @ts-ignore
  var prom = new this.constructor(noop);

  handle(this, new Handler(onFulfilled, onRejected, prom));
  return prom;
};

Promise.prototype['finally'] = finallyConstructor;

Promise.all = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!isArray(arr)) {
      return reject(new TypeError('Promise.all accepts an array'));
    }

    var args = Array.prototype.slice.call(arr);
    if (args.length === 0) return resolve([]);
    var remaining = args.length;

    function res(i, val) {
      try {
        if (val && (typeof val === 'object' || typeof val === 'function')) {
          var then = val.then;
          if (typeof then === 'function') {
            then.call(
              val,
              function(val) {
                res(i, val);
              },
              reject
            );
            return;
          }
        }
        args[i] = val;
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex);
      }
    }

    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.resolve = function(value) {
  if (value && typeof value === 'object' && value.constructor === Promise) {
    return value;
  }

  return new Promise(function(resolve) {
    resolve(value);
  });
};

Promise.reject = function(value) {
  return new Promise(function(resolve, reject) {
    reject(value);
  });
};

Promise.race = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!isArray(arr)) {
      return reject(new TypeError('Promise.race accepts an array'));
    }

    for (var i = 0, len = arr.length; i < len; i++) {
      Promise.resolve(arr[i]).then(resolve, reject);
    }
  });
};

// Use polyfill for setImmediate for performance gains
Promise._immediateFn =
  // @ts-ignore
  (typeof setImmediate === 'function' &&
    function(fn) {
      // @ts-ignore
      setImmediate(fn);
    }) ||
  function(fn) {
    setTimeoutFunc(fn, 0);
  };

Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
  if (typeof console !== 'undefined' && console) {
    console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
  }
};

/** @suppress {undefinedVars} */
var globalNS = (function() {
  // the only reliable means to get the global object is
  // `Function('return this')()`
  // However, this causes CSP violations in Chrome apps.
  if (typeof self !== 'undefined') {
    return self;
  }
  if (typeof window !== 'undefined') {
    return window;
  }
  if (typeof global !== 'undefined') {
    return global;
  }
  throw new Error('unable to locate global object');
})();

if (!('Promise' in globalNS)) {
  globalNS['Promise'] = Promise;
} else if (!globalNS.Promise.prototype['finally']) {
  globalNS.Promise.prototype['finally'] = finallyConstructor;
}

})));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("timers").setImmediate)

},{"timers":3}],3:[function(require,module,exports){
(function (setImmediate,clearImmediate){
var nextTick = require('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this,require("timers").setImmediate,require("timers").clearImmediate)

},{"process/browser.js":1,"timers":3}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EmailJSResponseStatus_1 = require("./models/EmailJSResponseStatus");
exports.EmailJSResponseStatus = EmailJSResponseStatus_1.EmailJSResponseStatus;
var UI_1 = require("./services/ui/UI");
var _userID = null;
var _origin = 'https://api.emailjs.com';
function sendPost(url, data, headers) {
    if (headers === void 0) { headers = {}; }
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('load', function (event) {
            var responseStatus = new EmailJSResponseStatus_1.EmailJSResponseStatus(event.target);
            if (responseStatus.status === 200 || responseStatus.text === 'OK') {
                resolve(responseStatus);
            }
            else {
                reject(responseStatus);
            }
        });
        xhr.addEventListener('error', function (event) {
            reject(new EmailJSResponseStatus_1.EmailJSResponseStatus(event.target));
        });
        xhr.open('POST', url, true);
        for (var key in headers) {
            xhr.setRequestHeader(key, headers[key]);
        }
        xhr.send(data);
    });
}
function appendGoogleCaptcha(templatePrams) {
    var element = document.getElementById('g-recaptcha-response');
    if (element && element.value) {
        templatePrams['g-recaptcha-response'] = element.value;
    }
    element = null;
    return templatePrams;
}
/**
 * Initiation
 * @param {string} userID - set the EmailJS user ID
 * @param {string} origin - set the EmailJS origin
 */
function init(userID, origin) {
    _userID = userID;
    _origin = origin || 'https://api.emailjs.com';
}
exports.init = init;
/**
 * Send a template to the specific EmailJS service
 * @param {string} serviceID - the EmailJS service ID
 * @param {string} templateID - the EmailJS template ID
 * @param {Object} templatePrams - the template params, what will be set to the EmailJS template
 * @param {string} userID - the EmailJS user ID
 * @returns {Promise<EmailJSResponseStatus>}
 */
function send(serviceID, templateID, templatePrams, userID) {
    var params = {
        lib_version: '2.4.1',
        user_id: userID || _userID,
        service_id: serviceID,
        template_id: templateID,
        template_params: templatePrams
    };
    if (typeof (document) !== 'undefined') {
        params["template_params"] = appendGoogleCaptcha(templatePrams);
    }
    return sendPost(_origin + '/api/v1.0/email/send', JSON.stringify(params), {
        'Content-type': 'application/json'
    });
}
exports.send = send;
/**
 * Send a form the specific EmailJS service
 * @param {string} serviceID - the EmailJS service ID
 * @param {string} templateID - the EmailJS template ID
 * @param {string | HTMLFormElement} form - the form element or selector
 * @param {string} userID - the EmailJS user ID
 * @returns {Promise<EmailJSResponseStatus>}
 */
function sendForm(serviceID, templateID, form, userID) {
    if (typeof form === 'string') {
        form = document.querySelector(form);
    }
    if (!form || form.nodeName !== 'FORM') {
        throw 'Expected the HTML form element or the style selector of form';
    }
    UI_1.UI.progressState(form);
    var formData = new FormData(form);
    formData.append('lib_version', '2.4.1');
    formData.append('service_id', serviceID);
    formData.append('template_id', templateID);
    formData.append('user_id', userID || _userID);
    return sendPost(_origin + '/api/v1.0/email/send-form', formData)
        .then(function (response) {
        UI_1.UI.successState(form);
        return response;
    }, function (error) {
        UI_1.UI.errorState(form);
        return Promise.reject(error);
    });
}
exports.sendForm = sendForm;
exports.default = {
    init: init,
    send: send,
    sendForm: sendForm
};

},{"./models/EmailJSResponseStatus":5,"./services/ui/UI":6}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EmailJSResponseStatus = /** @class */ (function () {
    function EmailJSResponseStatus(httpResponse) {
        this.status = httpResponse.status;
        this.text = httpResponse.responseText;
    }
    return EmailJSResponseStatus;
}());
exports.EmailJSResponseStatus = EmailJSResponseStatus;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UI = /** @class */ (function () {
    function UI() {
    }
    UI.clearAll = function (form) {
        form.classList.remove(this.PROGRESS);
        form.classList.remove(this.DONE);
        form.classList.remove(this.ERROR);
    };
    UI.progressState = function (form) {
        this.clearAll(form);
        form.classList.add(this.PROGRESS);
    };
    UI.successState = function (form) {
        form.classList.remove(this.PROGRESS);
        form.classList.add(this.DONE);
    };
    UI.errorState = function (form) {
        form.classList.remove(this.PROGRESS);
        form.classList.add(this.ERROR);
    };
    UI.PROGRESS = 'emailjs-sending';
    UI.DONE = 'emailjs-success';
    UI.ERROR = 'emailjs-error';
    return UI;
}());
exports.UI = UI;

},{}]},{},[4,2])(4)
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3Byb21pc2UtcG9seWZpbGwvZGlzdC9wb2x5ZmlsbC5qcyIsIm5vZGVfbW9kdWxlcy90aW1lcnMtYnJvd3NlcmlmeS9tYWluLmpzIiwic3JjL2luZGV4LnRzIiwic3JjL21vZGVscy9FbWFpbEpTUmVzcG9uc2VTdGF0dXMudHMiLCJzcmMvc2VydmljZXMvdWkvVUkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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LENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFYSxlQUFZLEdBQTFCLFVBQTJCLElBQXFCO1FBQzlDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVhLGFBQVUsR0FBeEIsVUFBeUIsSUFBcUI7UUFDNUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBdkJ1QixXQUFRLEdBQVcsaUJBQWlCLENBQUM7SUFDckMsT0FBSSxHQUFXLGlCQUFpQixDQUFDO0lBQ2pDLFFBQUssR0FBVyxlQUFlLENBQUM7SUF1QjFELFNBQUM7Q0EzQkQsQUEyQkMsSUFBQTtBQTNCWSxnQkFBRSIsImZpbGUiOiJlbWFpbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcblx0dHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gZmFjdG9yeSgpIDpcblx0dHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcblx0KGZhY3RvcnkoKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAdGhpcyB7UHJvbWlzZX1cbiAqL1xuZnVuY3Rpb24gZmluYWxseUNvbnN0cnVjdG9yKGNhbGxiYWNrKSB7XG4gIHZhciBjb25zdHJ1Y3RvciA9IHRoaXMuY29uc3RydWN0b3I7XG4gIHJldHVybiB0aGlzLnRoZW4oXG4gICAgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHJldHVybiBjb25zdHJ1Y3Rvci5yZXNvbHZlKGNhbGxiYWNrKCkpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICByZXR1cm4gY29uc3RydWN0b3IucmVzb2x2ZShjYWxsYmFjaygpKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHJldHVybiBjb25zdHJ1Y3Rvci5yZWplY3QocmVhc29uKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgKTtcbn1cblxuLy8gU3RvcmUgc2V0VGltZW91dCByZWZlcmVuY2Ugc28gcHJvbWlzZS1wb2x5ZmlsbCB3aWxsIGJlIHVuYWZmZWN0ZWQgYnlcbi8vIG90aGVyIGNvZGUgbW9kaWZ5aW5nIHNldFRpbWVvdXQgKGxpa2Ugc2lub24udXNlRmFrZVRpbWVycygpKVxudmFyIHNldFRpbWVvdXRGdW5jID0gc2V0VGltZW91dDtcblxuZnVuY3Rpb24gaXNBcnJheSh4KSB7XG4gIHJldHVybiBCb29sZWFuKHggJiYgdHlwZW9mIHgubGVuZ3RoICE9PSAndW5kZWZpbmVkJyk7XG59XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG4vLyBQb2x5ZmlsbCBmb3IgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmRcbmZ1bmN0aW9uIGJpbmQoZm4sIHRoaXNBcmcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGZuLmFwcGx5KHRoaXNBcmcsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5cbi8qKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICovXG5mdW5jdGlvbiBQcm9taXNlKGZuKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBQcm9taXNlKSlcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdQcm9taXNlcyBtdXN0IGJlIGNvbnN0cnVjdGVkIHZpYSBuZXcnKTtcbiAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykgdGhyb3cgbmV3IFR5cGVFcnJvcignbm90IGEgZnVuY3Rpb24nKTtcbiAgLyoqIEB0eXBlIHshbnVtYmVyfSAqL1xuICB0aGlzLl9zdGF0ZSA9IDA7XG4gIC8qKiBAdHlwZSB7IWJvb2xlYW59ICovXG4gIHRoaXMuX2hhbmRsZWQgPSBmYWxzZTtcbiAgLyoqIEB0eXBlIHtQcm9taXNlfHVuZGVmaW5lZH0gKi9cbiAgdGhpcy5fdmFsdWUgPSB1bmRlZmluZWQ7XG4gIC8qKiBAdHlwZSB7IUFycmF5PCFGdW5jdGlvbj59ICovXG4gIHRoaXMuX2RlZmVycmVkcyA9IFtdO1xuXG4gIGRvUmVzb2x2ZShmbiwgdGhpcyk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZShzZWxmLCBkZWZlcnJlZCkge1xuICB3aGlsZSAoc2VsZi5fc3RhdGUgPT09IDMpIHtcbiAgICBzZWxmID0gc2VsZi5fdmFsdWU7XG4gIH1cbiAgaWYgKHNlbGYuX3N0YXRlID09PSAwKSB7XG4gICAgc2VsZi5fZGVmZXJyZWRzLnB1c2goZGVmZXJyZWQpO1xuICAgIHJldHVybjtcbiAgfVxuICBzZWxmLl9oYW5kbGVkID0gdHJ1ZTtcbiAgUHJvbWlzZS5faW1tZWRpYXRlRm4oZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNiID0gc2VsZi5fc3RhdGUgPT09IDEgPyBkZWZlcnJlZC5vbkZ1bGZpbGxlZCA6IGRlZmVycmVkLm9uUmVqZWN0ZWQ7XG4gICAgaWYgKGNiID09PSBudWxsKSB7XG4gICAgICAoc2VsZi5fc3RhdGUgPT09IDEgPyByZXNvbHZlIDogcmVqZWN0KShkZWZlcnJlZC5wcm9taXNlLCBzZWxmLl92YWx1ZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciByZXQ7XG4gICAgdHJ5IHtcbiAgICAgIHJldCA9IGNiKHNlbGYuX3ZhbHVlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZWplY3QoZGVmZXJyZWQucHJvbWlzZSwgZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlc29sdmUoZGVmZXJyZWQucHJvbWlzZSwgcmV0KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHJlc29sdmUoc2VsZiwgbmV3VmFsdWUpIHtcbiAgdHJ5IHtcbiAgICAvLyBQcm9taXNlIFJlc29sdXRpb24gUHJvY2VkdXJlOiBodHRwczovL2dpdGh1Yi5jb20vcHJvbWlzZXMtYXBsdXMvcHJvbWlzZXMtc3BlYyN0aGUtcHJvbWlzZS1yZXNvbHV0aW9uLXByb2NlZHVyZVxuICAgIGlmIChuZXdWYWx1ZSA9PT0gc2VsZilcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0EgcHJvbWlzZSBjYW5ub3QgYmUgcmVzb2x2ZWQgd2l0aCBpdHNlbGYuJyk7XG4gICAgaWYgKFxuICAgICAgbmV3VmFsdWUgJiZcbiAgICAgICh0eXBlb2YgbmV3VmFsdWUgPT09ICdvYmplY3QnIHx8IHR5cGVvZiBuZXdWYWx1ZSA9PT0gJ2Z1bmN0aW9uJylcbiAgICApIHtcbiAgICAgIHZhciB0aGVuID0gbmV3VmFsdWUudGhlbjtcbiAgICAgIGlmIChuZXdWYWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgc2VsZi5fc3RhdGUgPSAzO1xuICAgICAgICBzZWxmLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICBmaW5hbGUoc2VsZik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZG9SZXNvbHZlKGJpbmQodGhlbiwgbmV3VmFsdWUpLCBzZWxmKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICBzZWxmLl9zdGF0ZSA9IDE7XG4gICAgc2VsZi5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBmaW5hbGUoc2VsZik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZWplY3Qoc2VsZiwgZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVqZWN0KHNlbGYsIG5ld1ZhbHVlKSB7XG4gIHNlbGYuX3N0YXRlID0gMjtcbiAgc2VsZi5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgZmluYWxlKHNlbGYpO1xufVxuXG5mdW5jdGlvbiBmaW5hbGUoc2VsZikge1xuICBpZiAoc2VsZi5fc3RhdGUgPT09IDIgJiYgc2VsZi5fZGVmZXJyZWRzLmxlbmd0aCA9PT0gMCkge1xuICAgIFByb21pc2UuX2ltbWVkaWF0ZUZuKGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCFzZWxmLl9oYW5kbGVkKSB7XG4gICAgICAgIFByb21pc2UuX3VuaGFuZGxlZFJlamVjdGlvbkZuKHNlbGYuX3ZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBzZWxmLl9kZWZlcnJlZHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBoYW5kbGUoc2VsZiwgc2VsZi5fZGVmZXJyZWRzW2ldKTtcbiAgfVxuICBzZWxmLl9kZWZlcnJlZHMgPSBudWxsO1xufVxuXG4vKipcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBIYW5kbGVyKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkLCBwcm9taXNlKSB7XG4gIHRoaXMub25GdWxmaWxsZWQgPSB0eXBlb2Ygb25GdWxmaWxsZWQgPT09ICdmdW5jdGlvbicgPyBvbkZ1bGZpbGxlZCA6IG51bGw7XG4gIHRoaXMub25SZWplY3RlZCA9IHR5cGVvZiBvblJlamVjdGVkID09PSAnZnVuY3Rpb24nID8gb25SZWplY3RlZCA6IG51bGw7XG4gIHRoaXMucHJvbWlzZSA9IHByb21pc2U7XG59XG5cbi8qKlxuICogVGFrZSBhIHBvdGVudGlhbGx5IG1pc2JlaGF2aW5nIHJlc29sdmVyIGZ1bmN0aW9uIGFuZCBtYWtlIHN1cmVcbiAqIG9uRnVsZmlsbGVkIGFuZCBvblJlamVjdGVkIGFyZSBvbmx5IGNhbGxlZCBvbmNlLlxuICpcbiAqIE1ha2VzIG5vIGd1YXJhbnRlZXMgYWJvdXQgYXN5bmNocm9ueS5cbiAqL1xuZnVuY3Rpb24gZG9SZXNvbHZlKGZuLCBzZWxmKSB7XG4gIHZhciBkb25lID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgZm4oXG4gICAgICBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBpZiAoZG9uZSkgcmV0dXJuO1xuICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgcmVzb2x2ZShzZWxmLCB2YWx1ZSk7XG4gICAgICB9LFxuICAgICAgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAgIGlmIChkb25lKSByZXR1cm47XG4gICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICByZWplY3Qoc2VsZiwgcmVhc29uKTtcbiAgICAgIH1cbiAgICApO1xuICB9IGNhdGNoIChleCkge1xuICAgIGlmIChkb25lKSByZXR1cm47XG4gICAgZG9uZSA9IHRydWU7XG4gICAgcmVqZWN0KHNlbGYsIGV4KTtcbiAgfVxufVxuXG5Qcm9taXNlLnByb3RvdHlwZVsnY2F0Y2gnXSA9IGZ1bmN0aW9uKG9uUmVqZWN0ZWQpIHtcbiAgcmV0dXJuIHRoaXMudGhlbihudWxsLCBvblJlamVjdGVkKTtcbn07XG5cblByb21pc2UucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuICAvLyBAdHMtaWdub3JlXG4gIHZhciBwcm9tID0gbmV3IHRoaXMuY29uc3RydWN0b3Iobm9vcCk7XG5cbiAgaGFuZGxlKHRoaXMsIG5ldyBIYW5kbGVyKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkLCBwcm9tKSk7XG4gIHJldHVybiBwcm9tO1xufTtcblxuUHJvbWlzZS5wcm90b3R5cGVbJ2ZpbmFsbHknXSA9IGZpbmFsbHlDb25zdHJ1Y3RvcjtcblxuUHJvbWlzZS5hbGwgPSBmdW5jdGlvbihhcnIpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIGlmICghaXNBcnJheShhcnIpKSB7XG4gICAgICByZXR1cm4gcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ1Byb21pc2UuYWxsIGFjY2VwdHMgYW4gYXJyYXknKSk7XG4gICAgfVxuXG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcnIpO1xuICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHJlc29sdmUoW10pO1xuICAgIHZhciByZW1haW5pbmcgPSBhcmdzLmxlbmd0aDtcblxuICAgIGZ1bmN0aW9uIHJlcyhpLCB2YWwpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICh2YWwgJiYgKHR5cGVvZiB2YWwgPT09ICdvYmplY3QnIHx8IHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicpKSB7XG4gICAgICAgICAgdmFyIHRoZW4gPSB2YWwudGhlbjtcbiAgICAgICAgICBpZiAodHlwZW9mIHRoZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoZW4uY2FsbChcbiAgICAgICAgICAgICAgdmFsLFxuICAgICAgICAgICAgICBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgICAgICByZXMoaSwgdmFsKTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgcmVqZWN0XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBhcmdzW2ldID0gdmFsO1xuICAgICAgICBpZiAoLS1yZW1haW5pbmcgPT09IDApIHtcbiAgICAgICAgICByZXNvbHZlKGFyZ3MpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICByZWplY3QoZXgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgcmVzKGksIGFyZ3NbaV0pO1xuICAgIH1cbiAgfSk7XG59O1xuXG5Qcm9taXNlLnJlc29sdmUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZS5jb25zdHJ1Y3RvciA9PT0gUHJvbWlzZSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgcmVzb2x2ZSh2YWx1ZSk7XG4gIH0pO1xufTtcblxuUHJvbWlzZS5yZWplY3QgPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgcmVqZWN0KHZhbHVlKTtcbiAgfSk7XG59O1xuXG5Qcm9taXNlLnJhY2UgPSBmdW5jdGlvbihhcnIpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIGlmICghaXNBcnJheShhcnIpKSB7XG4gICAgICByZXR1cm4gcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ1Byb21pc2UucmFjZSBhY2NlcHRzIGFuIGFycmF5JykpO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcnIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIFByb21pc2UucmVzb2x2ZShhcnJbaV0pLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICB9XG4gIH0pO1xufTtcblxuLy8gVXNlIHBvbHlmaWxsIGZvciBzZXRJbW1lZGlhdGUgZm9yIHBlcmZvcm1hbmNlIGdhaW5zXG5Qcm9taXNlLl9pbW1lZGlhdGVGbiA9XG4gIC8vIEB0cy1pZ25vcmVcbiAgKHR5cGVvZiBzZXRJbW1lZGlhdGUgPT09ICdmdW5jdGlvbicgJiZcbiAgICBmdW5jdGlvbihmbikge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgc2V0SW1tZWRpYXRlKGZuKTtcbiAgICB9KSB8fFxuICBmdW5jdGlvbihmbikge1xuICAgIHNldFRpbWVvdXRGdW5jKGZuLCAwKTtcbiAgfTtcblxuUHJvbWlzZS5fdW5oYW5kbGVkUmVqZWN0aW9uRm4gPSBmdW5jdGlvbiBfdW5oYW5kbGVkUmVqZWN0aW9uRm4oZXJyKSB7XG4gIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZSkge1xuICAgIGNvbnNvbGUud2FybignUG9zc2libGUgVW5oYW5kbGVkIFByb21pc2UgUmVqZWN0aW9uOicsIGVycik7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICB9XG59O1xuXG4vKiogQHN1cHByZXNzIHt1bmRlZmluZWRWYXJzfSAqL1xudmFyIGdsb2JhbE5TID0gKGZ1bmN0aW9uKCkge1xuICAvLyB0aGUgb25seSByZWxpYWJsZSBtZWFucyB0byBnZXQgdGhlIGdsb2JhbCBvYmplY3QgaXNcbiAgLy8gYEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKClgXG4gIC8vIEhvd2V2ZXIsIHRoaXMgY2F1c2VzIENTUCB2aW9sYXRpb25zIGluIENocm9tZSBhcHBzLlxuICBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIHNlbGY7XG4gIH1cbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIHdpbmRvdztcbiAgfVxuICBpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZ2xvYmFsO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcigndW5hYmxlIHRvIGxvY2F0ZSBnbG9iYWwgb2JqZWN0Jyk7XG59KSgpO1xuXG5pZiAoISgnUHJvbWlzZScgaW4gZ2xvYmFsTlMpKSB7XG4gIGdsb2JhbE5TWydQcm9taXNlJ10gPSBQcm9taXNlO1xufSBlbHNlIGlmICghZ2xvYmFsTlMuUHJvbWlzZS5wcm90b3R5cGVbJ2ZpbmFsbHknXSkge1xuICBnbG9iYWxOUy5Qcm9taXNlLnByb3RvdHlwZVsnZmluYWxseSddID0gZmluYWxseUNvbnN0cnVjdG9yO1xufVxuXG59KSkpO1xuIiwidmFyIG5leHRUaWNrID0gcmVxdWlyZSgncHJvY2Vzcy9icm93c2VyLmpzJykubmV4dFRpY2s7XG52YXIgYXBwbHkgPSBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHk7XG52YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG52YXIgaW1tZWRpYXRlSWRzID0ge307XG52YXIgbmV4dEltbWVkaWF0ZUlkID0gMDtcblxuLy8gRE9NIEFQSXMsIGZvciBjb21wbGV0ZW5lc3NcblxuZXhwb3J0cy5zZXRUaW1lb3V0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgVGltZW91dChhcHBseS5jYWxsKHNldFRpbWVvdXQsIHdpbmRvdywgYXJndW1lbnRzKSwgY2xlYXJUaW1lb3V0KTtcbn07XG5leHBvcnRzLnNldEludGVydmFsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgVGltZW91dChhcHBseS5jYWxsKHNldEludGVydmFsLCB3aW5kb3csIGFyZ3VtZW50cyksIGNsZWFySW50ZXJ2YWwpO1xufTtcbmV4cG9ydHMuY2xlYXJUaW1lb3V0ID1cbmV4cG9ydHMuY2xlYXJJbnRlcnZhbCA9IGZ1bmN0aW9uKHRpbWVvdXQpIHsgdGltZW91dC5jbG9zZSgpOyB9O1xuXG5mdW5jdGlvbiBUaW1lb3V0KGlkLCBjbGVhckZuKSB7XG4gIHRoaXMuX2lkID0gaWQ7XG4gIHRoaXMuX2NsZWFyRm4gPSBjbGVhckZuO1xufVxuVGltZW91dC5wcm90b3R5cGUudW5yZWYgPSBUaW1lb3V0LnByb3RvdHlwZS5yZWYgPSBmdW5jdGlvbigpIHt9O1xuVGltZW91dC5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fY2xlYXJGbi5jYWxsKHdpbmRvdywgdGhpcy5faWQpO1xufTtcblxuLy8gRG9lcyBub3Qgc3RhcnQgdGhlIHRpbWUsIGp1c3Qgc2V0cyB1cCB0aGUgbWVtYmVycyBuZWVkZWQuXG5leHBvcnRzLmVucm9sbCA9IGZ1bmN0aW9uKGl0ZW0sIG1zZWNzKSB7XG4gIGNsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtcbiAgaXRlbS5faWRsZVRpbWVvdXQgPSBtc2Vjcztcbn07XG5cbmV4cG9ydHMudW5lbnJvbGwgPSBmdW5jdGlvbihpdGVtKSB7XG4gIGNsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtcbiAgaXRlbS5faWRsZVRpbWVvdXQgPSAtMTtcbn07XG5cbmV4cG9ydHMuX3VucmVmQWN0aXZlID0gZXhwb3J0cy5hY3RpdmUgPSBmdW5jdGlvbihpdGVtKSB7XG4gIGNsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtcblxuICB2YXIgbXNlY3MgPSBpdGVtLl9pZGxlVGltZW91dDtcbiAgaWYgKG1zZWNzID49IDApIHtcbiAgICBpdGVtLl9pZGxlVGltZW91dElkID0gc2V0VGltZW91dChmdW5jdGlvbiBvblRpbWVvdXQoKSB7XG4gICAgICBpZiAoaXRlbS5fb25UaW1lb3V0KVxuICAgICAgICBpdGVtLl9vblRpbWVvdXQoKTtcbiAgICB9LCBtc2Vjcyk7XG4gIH1cbn07XG5cbi8vIFRoYXQncyBub3QgaG93IG5vZGUuanMgaW1wbGVtZW50cyBpdCBidXQgdGhlIGV4cG9zZWQgYXBpIGlzIHRoZSBzYW1lLlxuZXhwb3J0cy5zZXRJbW1lZGlhdGUgPSB0eXBlb2Ygc2V0SW1tZWRpYXRlID09PSBcImZ1bmN0aW9uXCIgPyBzZXRJbW1lZGlhdGUgOiBmdW5jdGlvbihmbikge1xuICB2YXIgaWQgPSBuZXh0SW1tZWRpYXRlSWQrKztcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoIDwgMiA/IGZhbHNlIDogc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gIGltbWVkaWF0ZUlkc1tpZF0gPSB0cnVlO1xuXG4gIG5leHRUaWNrKGZ1bmN0aW9uIG9uTmV4dFRpY2soKSB7XG4gICAgaWYgKGltbWVkaWF0ZUlkc1tpZF0pIHtcbiAgICAgIC8vIGZuLmNhbGwoKSBpcyBmYXN0ZXIgc28gd2Ugb3B0aW1pemUgZm9yIHRoZSBjb21tb24gdXNlLWNhc2VcbiAgICAgIC8vIEBzZWUgaHR0cDovL2pzcGVyZi5jb20vY2FsbC1hcHBseS1zZWd1XG4gICAgICBpZiAoYXJncykge1xuICAgICAgICBmbi5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZuLmNhbGwobnVsbCk7XG4gICAgICB9XG4gICAgICAvLyBQcmV2ZW50IGlkcyBmcm9tIGxlYWtpbmdcbiAgICAgIGV4cG9ydHMuY2xlYXJJbW1lZGlhdGUoaWQpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGlkO1xufTtcblxuZXhwb3J0cy5jbGVhckltbWVkaWF0ZSA9IHR5cGVvZiBjbGVhckltbWVkaWF0ZSA9PT0gXCJmdW5jdGlvblwiID8gY2xlYXJJbW1lZGlhdGUgOiBmdW5jdGlvbihpZCkge1xuICBkZWxldGUgaW1tZWRpYXRlSWRzW2lkXTtcbn07IiwiaW1wb3J0IHtFbWFpbEpTUmVzcG9uc2VTdGF0dXN9IGZyb20gJy4vbW9kZWxzL0VtYWlsSlNSZXNwb25zZVN0YXR1cyc7XG5pbXBvcnQge1VJfSBmcm9tICcuL3NlcnZpY2VzL3VpL1VJJztcblxubGV0IF91c2VySUQ6IHN0cmluZyA9IG51bGw7XG5sZXQgX29yaWdpbjogc3RyaW5nID0gJ2h0dHBzOi8vYXBpLmVtYWlsanMuY29tJztcblxuZnVuY3Rpb24gc2VuZFBvc3QodXJsOiBzdHJpbmcsIGRhdGE6IHN0cmluZyB8IEZvcm1EYXRhLCBoZWFkZXJzOiBPYmplY3QgPSB7fSk6IFByb21pc2U8RW1haWxKU1Jlc3BvbnNlU3RhdHVzPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgbGV0IHhocjogWE1MSHR0cFJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgIHhoci5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGV2ZW50KSA9PiB7XG4gICAgICBsZXQgcmVzcG9uc2VTdGF0dXM6IEVtYWlsSlNSZXNwb25zZVN0YXR1cyA9IG5ldyBFbWFpbEpTUmVzcG9uc2VTdGF0dXMoPFhNTEh0dHBSZXF1ZXN0PmV2ZW50LnRhcmdldCk7XG4gICAgICBpZiAocmVzcG9uc2VTdGF0dXMuc3RhdHVzID09PSAyMDAgfHwgcmVzcG9uc2VTdGF0dXMudGV4dCA9PT0gJ09LJykge1xuICAgICAgICByZXNvbHZlKHJlc3BvbnNlU3RhdHVzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlamVjdChyZXNwb25zZVN0YXR1cyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoZXZlbnQpID0+IHtcbiAgICAgIHJlamVjdChuZXcgRW1haWxKU1Jlc3BvbnNlU3RhdHVzKDxYTUxIdHRwUmVxdWVzdD5ldmVudC50YXJnZXQpKTtcbiAgICB9KTtcblxuICAgIHhoci5vcGVuKCdQT1NUJywgdXJsLCB0cnVlKTtcblxuICAgIGZvciAobGV0IGtleSBpbiBoZWFkZXJzKSB7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgaGVhZGVyc1trZXldKTtcbiAgICB9XG5cbiAgICB4aHIuc2VuZChkYXRhKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGFwcGVuZEdvb2dsZUNhcHRjaGEodGVtcGxhdGVQcmFtcz86IE9iamVjdCk6IE9iamVjdCB7XG4gIGxldCBlbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50ID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ctcmVjYXB0Y2hhLXJlc3BvbnNlJyk7XG5cbiAgaWYgKGVsZW1lbnQgJiYgZWxlbWVudC52YWx1ZSkge1xuICAgIHRlbXBsYXRlUHJhbXNbJ2ctcmVjYXB0Y2hhLXJlc3BvbnNlJ10gPSBlbGVtZW50LnZhbHVlO1xuICB9XG5cbiAgZWxlbWVudCA9IG51bGw7XG4gIHJldHVybiB0ZW1wbGF0ZVByYW1zO1xufVxuXG4vKipcbiAqIEluaXRpYXRpb25cbiAqIEBwYXJhbSB7c3RyaW5nfSB1c2VySUQgLSBzZXQgdGhlIEVtYWlsSlMgdXNlciBJRFxuICogQHBhcmFtIHtzdHJpbmd9IG9yaWdpbiAtIHNldCB0aGUgRW1haWxKUyBvcmlnaW5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQodXNlcklEOiBzdHJpbmcsIG9yaWdpbj86IHN0cmluZyk6IHZvaWQge1xuICBfdXNlcklEID0gdXNlcklEO1xuICBfb3JpZ2luID0gb3JpZ2luIHx8ICdodHRwczovL2FwaS5lbWFpbGpzLmNvbSc7XG59XG5cbi8qKlxuICogU2VuZCBhIHRlbXBsYXRlIHRvIHRoZSBzcGVjaWZpYyBFbWFpbEpTIHNlcnZpY2VcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZXJ2aWNlSUQgLSB0aGUgRW1haWxKUyBzZXJ2aWNlIElEXG4gKiBAcGFyYW0ge3N0cmluZ30gdGVtcGxhdGVJRCAtIHRoZSBFbWFpbEpTIHRlbXBsYXRlIElEXG4gKiBAcGFyYW0ge09iamVjdH0gdGVtcGxhdGVQcmFtcyAtIHRoZSB0ZW1wbGF0ZSBwYXJhbXMsIHdoYXQgd2lsbCBiZSBzZXQgdG8gdGhlIEVtYWlsSlMgdGVtcGxhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSB1c2VySUQgLSB0aGUgRW1haWxKUyB1c2VyIElEXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxFbWFpbEpTUmVzcG9uc2VTdGF0dXM+fVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2VuZChzZXJ2aWNlSUQ6IHN0cmluZywgdGVtcGxhdGVJRDogc3RyaW5nLCB0ZW1wbGF0ZVByYW1zPzogT2JqZWN0LCB1c2VySUQ/OiBzdHJpbmcpOiBQcm9taXNlPEVtYWlsSlNSZXNwb25zZVN0YXR1cz4ge1xuICBsZXQgcGFyYW1zOiBPYmplY3QgPSB7XG4gICAgbGliX3ZlcnNpb246ICc8PFZFUlNJT04+PicsXG4gICAgdXNlcl9pZDogdXNlcklEIHx8IF91c2VySUQsXG4gICAgc2VydmljZV9pZDogc2VydmljZUlELFxuICAgIHRlbXBsYXRlX2lkOiB0ZW1wbGF0ZUlELFxuICAgIHRlbXBsYXRlX3BhcmFtczogdGVtcGxhdGVQcmFtc1xuICB9O1xuXG4gIGlmKHR5cGVvZihkb2N1bWVudCkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHBhcmFtc1tcInRlbXBsYXRlX3BhcmFtc1wiXSA9IGFwcGVuZEdvb2dsZUNhcHRjaGEodGVtcGxhdGVQcmFtcyk7XG4gIH1cblxuICByZXR1cm4gc2VuZFBvc3QoX29yaWdpbiArICcvYXBpL3YxLjAvZW1haWwvc2VuZCcsIEpTT04uc3RyaW5naWZ5KHBhcmFtcyksIHtcbiAgICAnQ29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gIH0pO1xufVxuXG4vKipcbiAqIFNlbmQgYSBmb3JtIHRoZSBzcGVjaWZpYyBFbWFpbEpTIHNlcnZpY2VcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZXJ2aWNlSUQgLSB0aGUgRW1haWxKUyBzZXJ2aWNlIElEXG4gKiBAcGFyYW0ge3N0cmluZ30gdGVtcGxhdGVJRCAtIHRoZSBFbWFpbEpTIHRlbXBsYXRlIElEXG4gKiBAcGFyYW0ge3N0cmluZyB8IEhUTUxGb3JtRWxlbWVudH0gZm9ybSAtIHRoZSBmb3JtIGVsZW1lbnQgb3Igc2VsZWN0b3JcbiAqIEBwYXJhbSB7c3RyaW5nfSB1c2VySUQgLSB0aGUgRW1haWxKUyB1c2VyIElEXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxFbWFpbEpTUmVzcG9uc2VTdGF0dXM+fVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2VuZEZvcm0oc2VydmljZUlEOiBzdHJpbmcsIHRlbXBsYXRlSUQ6IHN0cmluZywgZm9ybTogc3RyaW5nIHwgSFRNTEZvcm1FbGVtZW50LCB1c2VySUQ/OiBzdHJpbmcpOiBQcm9taXNlPEVtYWlsSlNSZXNwb25zZVN0YXR1cz4ge1xuICBpZiAodHlwZW9mIGZvcm0gPT09ICdzdHJpbmcnKSB7XG4gICAgZm9ybSA9IDxIVE1MRm9ybUVsZW1lbnQ+ZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihmb3JtKTtcbiAgfVxuXG4gIGlmICghZm9ybSB8fCBmb3JtLm5vZGVOYW1lICE9PSAnRk9STScpIHtcbiAgICB0aHJvdyAnRXhwZWN0ZWQgdGhlIEhUTUwgZm9ybSBlbGVtZW50IG9yIHRoZSBzdHlsZSBzZWxlY3RvciBvZiBmb3JtJztcbiAgfVxuXG4gIFVJLnByb2dyZXNzU3RhdGUoZm9ybSk7XG4gIGxldCBmb3JtRGF0YTogRm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZm9ybSk7XG4gIGZvcm1EYXRhLmFwcGVuZCgnbGliX3ZlcnNpb24nLCAnPDxWRVJTSU9OPj4nKTtcbiAgZm9ybURhdGEuYXBwZW5kKCdzZXJ2aWNlX2lkJywgc2VydmljZUlEKTtcbiAgZm9ybURhdGEuYXBwZW5kKCd0ZW1wbGF0ZV9pZCcsIHRlbXBsYXRlSUQpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ3VzZXJfaWQnLCB1c2VySUQgfHwgX3VzZXJJRCk7XG5cbiAgcmV0dXJuIHNlbmRQb3N0KF9vcmlnaW4gKyAnL2FwaS92MS4wL2VtYWlsL3NlbmQtZm9ybScsIGZvcm1EYXRhKVxuICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgVUkuc3VjY2Vzc1N0YXRlKDxIVE1MRm9ybUVsZW1lbnQ+Zm9ybSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSwgKGVycm9yKSA9PiB7XG4gICAgICBVSS5lcnJvclN0YXRlKDxIVE1MRm9ybUVsZW1lbnQ+Zm9ybSk7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgIH0pO1xufVxuXG5leHBvcnQge0VtYWlsSlNSZXNwb25zZVN0YXR1c307XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdCxcbiAgc2VuZCxcbiAgc2VuZEZvcm1cbn07XG4iLCJleHBvcnQgY2xhc3MgRW1haWxKU1Jlc3BvbnNlU3RhdHVzIHtcblxuICBwdWJsaWMgc3RhdHVzOiBudW1iZXI7XG4gIHB1YmxpYyB0ZXh0OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoaHR0cFJlc3BvbnNlOiBYTUxIdHRwUmVxdWVzdCkge1xuICAgIHRoaXMuc3RhdHVzID0gaHR0cFJlc3BvbnNlLnN0YXR1cztcbiAgICB0aGlzLnRleHQgPSBodHRwUmVzcG9uc2UucmVzcG9uc2VUZXh0O1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgVUkge1xuXG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFBST0dSRVNTOiBzdHJpbmcgPSAnZW1haWxqcy1zZW5kaW5nJztcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgRE9ORTogc3RyaW5nID0gJ2VtYWlsanMtc3VjY2Vzcyc7XG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEVSUk9SOiBzdHJpbmcgPSAnZW1haWxqcy1lcnJvcic7XG5cbiAgcHVibGljIHN0YXRpYyBjbGVhckFsbChmb3JtOiBIVE1MRm9ybUVsZW1lbnQpOiB2b2lkIHtcbiAgICBmb3JtLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5QUk9HUkVTUyk7XG4gICAgZm9ybS5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuRE9ORSk7XG4gICAgZm9ybS5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuRVJST1IpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBwcm9ncmVzc1N0YXRlKGZvcm06IEhUTUxGb3JtRWxlbWVudCk6IHZvaWQge1xuICAgIHRoaXMuY2xlYXJBbGwoZm9ybSk7XG4gICAgZm9ybS5jbGFzc0xpc3QuYWRkKHRoaXMuUFJPR1JFU1MpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBzdWNjZXNzU3RhdGUoZm9ybTogSFRNTEZvcm1FbGVtZW50KTogdm9pZCB7XG4gICAgZm9ybS5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuUFJPR1JFU1MpO1xuICAgIGZvcm0uY2xhc3NMaXN0LmFkZCh0aGlzLkRPTkUpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBlcnJvclN0YXRlKGZvcm06IEhUTUxGb3JtRWxlbWVudCk6IHZvaWQge1xuICAgIGZvcm0uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLlBST0dSRVNTKTtcbiAgICBmb3JtLmNsYXNzTGlzdC5hZGQodGhpcy5FUlJPUik7XG4gIH1cblxufVxuIl0sInByZUV4aXN0aW5nQ29tbWVudCI6Ii8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltNXZaR1ZmYlc5a2RXeGxjeTlpY205M2MyVnlMWEJoWTJzdlgzQnlaV3gxWkdVdWFuTWlMQ0p1YjJSbFgyMXZaSFZzWlhNdmNISnZZMlZ6Y3k5aWNtOTNjMlZ5TG1weklpd2libTlrWlY5dGIyUjFiR1Z6TDNCeWIyMXBjMlV0Y0c5c2VXWnBiR3d2WkdsemRDOXdiMng1Wm1sc2JDNXFjeUlzSW01dlpHVmZiVzlrZFd4bGN5OTBhVzFsY25NdFluSnZkM05sY21sbWVTOXRZV2x1TG1weklpd2ljM0pqTDJsdVpHVjRMblJ6SWl3aWMzSmpMMjF2WkdWc2N5OUZiV0ZwYkVwVFVtVnpjRzl1YzJWVGRHRjBkWE11ZEhNaUxDSnpjbU12YzJWeWRtbGpaWE12ZFdrdlZVa3VkSE1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFN1FVTkJRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3pzN1FVTjRURUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN096czdRVU0zVTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3T3pzN096dEJRek5GUVN4M1JVRkJjVVU3UVVGclNEZEVMR2REUVd4SVFTdzJRMEZCY1VJc1EwRnJTRUU3UVVGcVNEZENMSFZEUVVGdlF6dEJRVVZ3UXl4SlFVRkpMRTlCUVU4c1IwRkJWeXhKUVVGSkxFTkJRVU03UVVGRE0wSXNTVUZCU1N4UFFVRlBMRWRCUVZjc2VVSkJRWGxDTEVOQlFVTTdRVUZGYUVRc1UwRkJVeXhSUVVGUkxFTkJRVU1zUjBGQlZ5eEZRVUZGTEVsQlFYVkNMRVZCUVVVc1QwRkJiMEk3U1VGQmNFSXNkMEpCUVVFc1JVRkJRU3haUVVGdlFqdEpRVU14UlN4UFFVRlBMRWxCUVVrc1QwRkJUeXhEUVVGRExGVkJRVU1zVDBGQlR5eEZRVUZGTEUxQlFVMDdVVUZEYWtNc1NVRkJTU3hIUVVGSExFZEJRVzFDTEVsQlFVa3NZMEZCWXl4RlFVRkZMRU5CUVVNN1VVRkZMME1zUjBGQlJ5eERRVUZETEdkQ1FVRm5RaXhEUVVGRExFMUJRVTBzUlVGQlJTeFZRVUZETEV0QlFVczdXVUZEYWtNc1NVRkJTU3hqUVVGakxFZEJRVEJDTEVsQlFVa3NOa05CUVhGQ0xFTkJRV2xDTEV0QlFVc3NRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJRenRaUVVOd1J5eEpRVUZKTEdOQlFXTXNRMEZCUXl4TlFVRk5MRXRCUVVzc1IwRkJSeXhKUVVGSkxHTkJRV01zUTBGQlF5eEpRVUZKTEV0QlFVc3NTVUZCU1N4RlFVRkZPMmRDUVVOcVJTeFBRVUZQTEVOQlFVTXNZMEZCWXl4RFFVRkRMRU5CUVVNN1lVRkRla0k3YVVKQlFVMDdaMEpCUTB3c1RVRkJUU3hEUVVGRExHTkJRV01zUTBGQlF5eERRVUZETzJGQlEzaENPMUZCUTBnc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRlNDeEhRVUZITEVOQlFVTXNaMEpCUVdkQ0xFTkJRVU1zVDBGQlR5eEZRVUZGTEZWQlFVTXNTMEZCU3p0WlFVTnNReXhOUVVGTkxFTkJRVU1zU1VGQlNTdzJRMEZCY1VJc1EwRkJhVUlzUzBGQlN5eERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRiRVVzUTBGQlF5eERRVUZETEVOQlFVTTdVVUZGU0N4SFFVRkhMRU5CUVVNc1NVRkJTU3hEUVVGRExFMUJRVTBzUlVGQlJTeEhRVUZITEVWQlFVVXNTVUZCU1N4RFFVRkRMRU5CUVVNN1VVRkZOVUlzUzBGQlN5eEpRVUZKTEVkQlFVY3NTVUZCU1N4UFFVRlBMRVZCUVVVN1dVRkRja0lzUjBGQlJ5eERRVUZETEdkQ1FVRm5RaXhEUVVGRExFZEJRVWNzUlVGQlJTeFBRVUZQTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNc1EwRkJRenRUUVVNelF6dFJRVVZFTEVkQlFVY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03U1VGRGFrSXNRMEZCUXl4RFFVRkRMRU5CUVVNN1FVRkRUQ3hEUVVGRE8wRkJSVVFzVTBGQlV5eHRRa0ZCYlVJc1EwRkJReXhoUVVGelFqdEpRVU5xUkN4SlFVRkpMRTlCUVU4c1IwRkJkVU1zVVVGQlVTeERRVUZETEdOQlFXTXNRMEZCUXl4elFrRkJjMElzUTBGQlF5eERRVUZETzBsQlJXeEhMRWxCUVVrc1QwRkJUeXhKUVVGSkxFOUJRVThzUTBGQlF5eExRVUZMTEVWQlFVVTdVVUZETlVJc1lVRkJZU3hEUVVGRExITkNRVUZ6UWl4RFFVRkRMRWRCUVVjc1QwRkJUeXhEUVVGRExFdEJRVXNzUTBGQlF6dExRVU4yUkR0SlFVVkVMRTlCUVU4c1IwRkJSeXhKUVVGSkxFTkJRVU03U1VGRFppeFBRVUZQTEdGQlFXRXNRMEZCUXp0QlFVTjJRaXhEUVVGRE8wRkJSVVE3T3pzN1IwRkpSenRCUVVOSUxGTkJRV2RDTEVsQlFVa3NRMEZCUXl4TlFVRmpMRVZCUVVVc1RVRkJaVHRKUVVOc1JDeFBRVUZQTEVkQlFVY3NUVUZCVFN4RFFVRkRPMGxCUTJwQ0xFOUJRVThzUjBGQlJ5eE5RVUZOTEVsQlFVa3NlVUpCUVhsQ0xFTkJRVU03UVVGRGFFUXNRMEZCUXp0QlFVaEVMRzlDUVVkRE8wRkJSVVE3T3pzN096czdSMEZQUnp0QlFVTklMRk5CUVdkQ0xFbEJRVWtzUTBGQlF5eFRRVUZwUWl4RlFVRkZMRlZCUVd0Q0xFVkJRVVVzWVVGQmMwSXNSVUZCUlN4TlFVRmxPMGxCUTJwSExFbEJRVWtzVFVGQlRTeEhRVUZYTzFGQlEyNUNMRmRCUVZjc1JVRkJSU3hoUVVGaE8xRkJRekZDTEU5QlFVOHNSVUZCUlN4TlFVRk5MRWxCUVVrc1QwRkJUenRSUVVNeFFpeFZRVUZWTEVWQlFVVXNVMEZCVXp0UlFVTnlRaXhYUVVGWExFVkJRVVVzVlVGQlZUdFJRVU4yUWl4bFFVRmxMRVZCUVVVc1lVRkJZVHRMUVVNdlFpeERRVUZETzBsQlJVWXNTVUZCUnl4UFFVRk5MRU5CUVVNc1VVRkJVU3hEUVVGRExFdEJRVXNzVjBGQlZ5eEZRVUZGTzFGQlF5OUNMRTFCUVUwc1EwRkJReXhwUWtGQmFVSXNRMEZCUXl4SFFVRkhMRzFDUVVGdFFpeERRVUZETEdGQlFXRXNRMEZCUXl4RFFVRkRPMHRCUTNCRk8wbEJSVVFzVDBGQlR5eFJRVUZSTEVOQlFVTXNUMEZCVHl4SFFVRkhMSE5DUVVGelFpeEZRVUZGTEVsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1RVRkJUU3hEUVVGRExFVkJRVVU3VVVGRGVFVXNZMEZCWXl4RlFVRkZMR3RDUVVGclFqdExRVU51UXl4RFFVRkRMRU5CUVVNN1FVRkRUQ3hEUVVGRE8wRkJhRUpFTEc5Q1FXZENRenRCUVVWRU96czdPenM3TzBkQlQwYzdRVUZEU0N4VFFVRm5RaXhSUVVGUkxFTkJRVU1zVTBGQmFVSXNSVUZCUlN4VlFVRnJRaXhGUVVGRkxFbEJRVGhDTEVWQlFVVXNUVUZCWlR0SlFVTTNSeXhKUVVGSkxFOUJRVThzU1VGQlNTeExRVUZMTEZGQlFWRXNSVUZCUlR0UlFVTTFRaXhKUVVGSkxFZEJRVzlDTEZGQlFWRXNRMEZCUXl4aFFVRmhMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UzBGRGRFUTdTVUZGUkN4SlFVRkpMRU5CUVVNc1NVRkJTU3hKUVVGSkxFbEJRVWtzUTBGQlF5eFJRVUZSTEV0QlFVc3NUVUZCVFN4RlFVRkZPMUZCUTNKRExFMUJRVTBzT0VSQlFUaEVMRU5CUVVNN1MwRkRkRVU3U1VGRlJDeFBRVUZGTEVOQlFVTXNZVUZCWVN4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8wbEJRM1pDTEVsQlFVa3NVVUZCVVN4SFFVRmhMRWxCUVVrc1VVRkJVU3hEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzBsQlF6VkRMRkZCUVZFc1EwRkJReXhOUVVGTkxFTkJRVU1zWVVGQllTeEZRVUZGTEdGQlFXRXNRMEZCUXl4RFFVRkRPMGxCUXpsRExGRkJRVkVzUTBGQlF5eE5RVUZOTEVOQlFVTXNXVUZCV1N4RlFVRkZMRk5CUVZNc1EwRkJReXhEUVVGRE8wbEJRM3BETEZGQlFWRXNRMEZCUXl4TlFVRk5MRU5CUVVNc1lVRkJZU3hGUVVGRkxGVkJRVlVzUTBGQlF5eERRVUZETzBsQlF6TkRMRkZCUVZFc1EwRkJReXhOUVVGTkxFTkJRVU1zVTBGQlV5eEZRVUZGTEUxQlFVMHNTVUZCU1N4UFFVRlBMRU5CUVVNc1EwRkJRenRKUVVVNVF5eFBRVUZQTEZGQlFWRXNRMEZCUXl4UFFVRlBMRWRCUVVjc01rSkJRVEpDTEVWQlFVVXNVVUZCVVN4RFFVRkRPMU5CUXpkRUxFbEJRVWtzUTBGQlF5eFZRVUZETEZGQlFWRTdVVUZEWWl4UFFVRkZMRU5CUVVNc1dVRkJXU3hEUVVGclFpeEpRVUZKTEVOQlFVTXNRMEZCUXp0UlFVTjJReXhQUVVGUExGRkJRVkVzUTBGQlF6dEpRVU5zUWl4RFFVRkRMRVZCUVVVc1ZVRkJReXhMUVVGTE8xRkJRMUFzVDBGQlJTeERRVUZETEZWQlFWVXNRMEZCYTBJc1NVRkJTU3hEUVVGRExFTkJRVU03VVVGRGNrTXNUMEZCVHl4UFFVRlBMRU5CUVVNc1RVRkJUU3hEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETzBsQlF5OUNMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRMUFzUTBGQlF6dEJRWGhDUkN3MFFrRjNRa003UVVGSlJDeHJRa0ZCWlR0SlFVTmlMRWxCUVVrc1RVRkJRVHRKUVVOS0xFbEJRVWtzVFVGQlFUdEpRVU5LTEZGQlFWRXNWVUZCUVR0RFFVTlVMRU5CUVVNN096czdPMEZEZUVoR08wbEJTMFVzSzBKQlFWa3NXVUZCTkVJN1VVRkRkRU1zU1VGQlNTeERRVUZETEUxQlFVMHNSMEZCUnl4WlFVRlpMRU5CUVVNc1RVRkJUU3hEUVVGRE8xRkJRMnhETEVsQlFVa3NRMEZCUXl4SlFVRkpMRWRCUVVjc1dVRkJXU3hEUVVGRExGbEJRVmtzUTBGQlF6dEpRVU40UXl4RFFVRkRPMGxCUTBnc05FSkJRVU03UVVGQlJDeERRVlJCTEVGQlUwTXNTVUZCUVR0QlFWUlpMSE5FUVVGeFFqczdPenM3UVVOQmJFTTdTVUZCUVR0SlFUSkNRU3hEUVVGRE8wbEJja0psTEZkQlFWRXNSMEZCZEVJc1ZVRkJkVUlzU1VGQmNVSTdVVUZETVVNc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eE5RVUZOTEVOQlFVTXNTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRE8xRkJRM0pETEVsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1RVRkJUU3hEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0UlFVTnFReXhKUVVGSkxFTkJRVU1zVTBGQlV5eERRVUZETEUxQlFVMHNRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU03U1VGRGNFTXNRMEZCUXp0SlFVVmhMR2RDUVVGaExFZEJRVE5DTEZWQlFUUkNMRWxCUVhGQ08xRkJReTlETEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03VVVGRGNFSXNTVUZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhIUVVGSExFTkJRVU1zU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMGxCUTNCRExFTkJRVU03U1VGRllTeGxRVUZaTEVkQlFURkNMRlZCUVRKQ0xFbEJRWEZDTzFGQlF6bERMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU1zVFVGQlRTeERRVUZETEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenRSUVVOeVF5eEpRVUZKTEVOQlFVTXNVMEZCVXl4RFFVRkRMRWRCUVVjc1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdTVUZEYUVNc1EwRkJRenRKUVVWaExHRkJRVlVzUjBGQmVFSXNWVUZCZVVJc1NVRkJjVUk3VVVGRE5VTXNTVUZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhOUVVGTkxFTkJRVU1zU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMUZCUTNKRExFbEJRVWtzUTBGQlF5eFRRVUZUTEVOQlFVTXNSMEZCUnl4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF6dEpRVU5xUXl4RFFVRkRPMGxCZGtKMVFpeFhRVUZSTEVkQlFWY3NhVUpCUVdsQ0xFTkJRVU03U1VGRGNrTXNUMEZCU1N4SFFVRlhMR2xDUVVGcFFpeERRVUZETzBsQlEycERMRkZCUVVzc1IwRkJWeXhsUVVGbExFTkJRVU03U1VGMVFqRkVMRk5CUVVNN1EwRXpRa1FzUVVFeVFrTXNTVUZCUVR0QlFUTkNXU3huUWtGQlJTSXNJbVpwYkdVaU9pSm5aVzVsY21GMFpXUXVhbk1pTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpS0daMWJtTjBhVzl1S0NsN1puVnVZM1JwYjI0Z2NpaGxMRzRzZENsN1puVnVZM1JwYjI0Z2J5aHBMR1lwZTJsbUtDRnVXMmxkS1h0cFppZ2haVnRwWFNsN2RtRnlJR005WENKbWRXNWpkR2x2Ymx3aVBUMTBlWEJsYjJZZ2NtVnhkV2x5WlNZbWNtVnhkV2x5WlR0cFppZ2haaVltWXlseVpYUjFjbTRnWXlocExDRXdLVHRwWmloMUtYSmxkSFZ5YmlCMUtHa3NJVEFwTzNaaGNpQmhQVzVsZHlCRmNuSnZjaWhjSWtOaGJtNXZkQ0JtYVc1a0lHMXZaSFZzWlNBblhDSXJhU3RjSWlkY0lpazdkR2h5YjNjZ1lTNWpiMlJsUFZ3aVRVOUVWVXhGWDA1UFZGOUdUMVZPUkZ3aUxHRjlkbUZ5SUhBOWJsdHBYVDE3Wlhod2IzSjBjenA3ZlgwN1pWdHBYVnN3WFM1allXeHNLSEF1Wlhod2IzSjBjeXhtZFc1amRHbHZiaWh5S1h0MllYSWdiajFsVzJsZFd6RmRXM0pkTzNKbGRIVnliaUJ2S0c1OGZISXBmU3h3TEhBdVpYaHdiM0owY3l4eUxHVXNiaXgwS1gxeVpYUjFjbTRnYmx0cFhTNWxlSEJ2Y25SemZXWnZjaWgyWVhJZ2RUMWNJbVoxYm1OMGFXOXVYQ0k5UFhSNWNHVnZaaUJ5WlhGMWFYSmxKaVp5WlhGMWFYSmxMR2s5TUR0cFBIUXViR1Z1WjNSb08ya3JLeWx2S0hSYmFWMHBPM0psZEhWeWJpQnZmWEpsZEhWeWJpQnlmU2tvS1NJc0lpOHZJSE5vYVcwZ1ptOXlJSFZ6YVc1bklIQnliMk5sYzNNZ2FXNGdZbkp2ZDNObGNseHVkbUZ5SUhCeWIyTmxjM01nUFNCdGIyUjFiR1V1Wlhod2IzSjBjeUE5SUh0OU8xeHVYRzR2THlCallXTm9aV1FnWm5KdmJTQjNhR0YwWlhabGNpQm5iRzlpWVd3Z2FYTWdjSEpsYzJWdWRDQnpieUIwYUdGMElIUmxjM1FnY25WdWJtVnljeUIwYUdGMElITjBkV0lnYVhSY2JpOHZJR1J2YmlkMElHSnlaV0ZySUhSb2FXNW5jeTRnSUVKMWRDQjNaU0J1WldWa0lIUnZJSGR5WVhBZ2FYUWdhVzRnWVNCMGNua2dZMkYwWTJnZ2FXNGdZMkZ6WlNCcGRDQnBjMXh1THk4Z2QzSmhjSEJsWkNCcGJpQnpkSEpwWTNRZ2JXOWtaU0JqYjJSbElIZG9hV05vSUdSdlpYTnVKM1FnWkdWbWFXNWxJR0Z1ZVNCbmJHOWlZV3h6TGlBZ1NYUW5jeUJwYm5OcFpHVWdZVnh1THk4Z1puVnVZM1JwYjI0Z1ltVmpZWFZ6WlNCMGNua3ZZMkYwWTJobGN5QmtaVzl3ZEdsdGFYcGxJR2x1SUdObGNuUmhhVzRnWlc1bmFXNWxjeTVjYmx4dWRtRnlJR05oWTJobFpGTmxkRlJwYldWdmRYUTdYRzUyWVhJZ1kyRmphR1ZrUTJ4bFlYSlVhVzFsYjNWME8xeHVYRzVtZFc1amRHbHZiaUJrWldaaGRXeDBVMlYwVkdsdGIzVjBLQ2tnZTF4dUlDQWdJSFJvY205M0lHNWxkeUJGY25KdmNpZ25jMlYwVkdsdFpXOTFkQ0JvWVhNZ2JtOTBJR0psWlc0Z1pHVm1hVzVsWkNjcE8xeHVmVnh1Wm5WdVkzUnBiMjRnWkdWbVlYVnNkRU5zWldGeVZHbHRaVzkxZENBb0tTQjdYRzRnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0NkamJHVmhjbFJwYldWdmRYUWdhR0Z6SUc1dmRDQmlaV1Z1SUdSbFptbHVaV1FuS1R0Y2JuMWNiaWhtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnZEhKNUlIdGNiaUFnSUNBZ0lDQWdhV1lnS0hSNWNHVnZaaUJ6WlhSVWFXMWxiM1YwSUQwOVBTQW5ablZ1WTNScGIyNG5LU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQmpZV05vWldSVFpYUlVhVzFsYjNWMElEMGdjMlYwVkdsdFpXOTFkRHRjYmlBZ0lDQWdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lHTmhZMmhsWkZObGRGUnBiV1Z2ZFhRZ1BTQmtaV1poZFd4MFUyVjBWR2x0YjNWME8xeHVJQ0FnSUNBZ0lDQjlYRzRnSUNBZ2ZTQmpZWFJqYUNBb1pTa2dlMXh1SUNBZ0lDQWdJQ0JqWVdOb1pXUlRaWFJVYVcxbGIzVjBJRDBnWkdWbVlYVnNkRk5sZEZScGJXOTFkRHRjYmlBZ0lDQjlYRzRnSUNBZ2RISjVJSHRjYmlBZ0lDQWdJQ0FnYVdZZ0tIUjVjR1Z2WmlCamJHVmhjbFJwYldWdmRYUWdQVDA5SUNkbWRXNWpkR2x2YmljcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUdOaFkyaGxaRU5zWldGeVZHbHRaVzkxZENBOUlHTnNaV0Z5VkdsdFpXOTFkRHRjYmlBZ0lDQWdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lHTmhZMmhsWkVOc1pXRnlWR2x0Wlc5MWRDQTlJR1JsWm1GMWJIUkRiR1ZoY2xScGJXVnZkWFE3WEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0I5SUdOaGRHTm9JQ2hsS1NCN1hHNGdJQ0FnSUNBZ0lHTmhZMmhsWkVOc1pXRnlWR2x0Wlc5MWRDQTlJR1JsWm1GMWJIUkRiR1ZoY2xScGJXVnZkWFE3WEc0Z0lDQWdmVnh1ZlNBb0tTbGNibVoxYm1OMGFXOXVJSEoxYmxScGJXVnZkWFFvWm5WdUtTQjdYRzRnSUNBZ2FXWWdLR05oWTJobFpGTmxkRlJwYldWdmRYUWdQVDA5SUhObGRGUnBiV1Z2ZFhRcElIdGNiaUFnSUNBZ0lDQWdMeTl1YjNKdFlXd2daVzUyYVhKdmJXVnVkSE1nYVc0Z2MyRnVaU0J6YVhSMVlYUnBiMjV6WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJ6WlhSVWFXMWxiM1YwS0daMWJpd2dNQ2s3WEc0Z0lDQWdmVnh1SUNBZ0lDOHZJR2xtSUhObGRGUnBiV1Z2ZFhRZ2QyRnpiaWQwSUdGMllXbHNZV0pzWlNCaWRYUWdkMkZ6SUd4aGRIUmxjaUJrWldacGJtVmtYRzRnSUNBZ2FXWWdLQ2hqWVdOb1pXUlRaWFJVYVcxbGIzVjBJRDA5UFNCa1pXWmhkV3gwVTJWMFZHbHRiM1YwSUh4OElDRmpZV05vWldSVFpYUlVhVzFsYjNWMEtTQW1KaUJ6WlhSVWFXMWxiM1YwS1NCN1hHNGdJQ0FnSUNBZ0lHTmhZMmhsWkZObGRGUnBiV1Z2ZFhRZ1BTQnpaWFJVYVcxbGIzVjBPMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdjMlYwVkdsdFpXOTFkQ2htZFc0c0lEQXBPMXh1SUNBZ0lIMWNiaUFnSUNCMGNua2dlMXh1SUNBZ0lDQWdJQ0F2THlCM2FHVnVJSGRvWlc0Z2MyOXRaV0p2WkhrZ2FHRnpJSE5qY21WM1pXUWdkMmwwYUNCelpYUlVhVzFsYjNWMElHSjFkQ0J1YnlCSkxrVXVJRzFoWkdSdVpYTnpYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQmpZV05vWldSVFpYUlVhVzFsYjNWMEtHWjFiaXdnTUNrN1hHNGdJQ0FnZlNCallYUmphQ2hsS1h0Y2JpQWdJQ0FnSUNBZ2RISjVJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDOHZJRmRvWlc0Z2QyVWdZWEpsSUdsdUlFa3VSUzRnWW5WMElIUm9aU0J6WTNKcGNIUWdhR0Z6SUdKbFpXNGdaWFpoYkdWa0lITnZJRWt1UlM0Z1pHOWxjMjRuZENCMGNuVnpkQ0IwYUdVZ1oyeHZZbUZzSUc5aWFtVmpkQ0IzYUdWdUlHTmhiR3hsWkNCdWIzSnRZV3hzZVZ4dUlDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlHTmhZMmhsWkZObGRGUnBiV1Z2ZFhRdVkyRnNiQ2h1ZFd4c0xDQm1kVzRzSURBcE8xeHVJQ0FnSUNBZ0lDQjlJR05oZEdOb0tHVXBlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0x5OGdjMkZ0WlNCaGN5QmhZbTkyWlNCaWRYUWdkMmhsYmlCcGRDZHpJR0VnZG1WeWMybHZiaUJ2WmlCSkxrVXVJSFJvWVhRZ2JYVnpkQ0JvWVhabElIUm9aU0JuYkc5aVlXd2diMkpxWldOMElHWnZjaUFuZEdocGN5Y3NJR2h2Y0daMWJHeDVJRzkxY2lCamIyNTBaWGgwSUdOdmNuSmxZM1FnYjNSb1pYSjNhWE5sSUdsMElIZHBiR3dnZEdoeWIzY2dZU0JuYkc5aVlXd2daWEp5YjNKY2JpQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQmpZV05vWldSVFpYUlVhVzFsYjNWMExtTmhiR3dvZEdocGN5d2dablZ1TENBd0tUdGNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lIMWNibHh1WEc1OVhHNW1kVzVqZEdsdmJpQnlkVzVEYkdWaGNsUnBiV1Z2ZFhRb2JXRnlhMlZ5S1NCN1hHNGdJQ0FnYVdZZ0tHTmhZMmhsWkVOc1pXRnlWR2x0Wlc5MWRDQTlQVDBnWTJ4bFlYSlVhVzFsYjNWMEtTQjdYRzRnSUNBZ0lDQWdJQzh2Ym05eWJXRnNJR1Z1ZG1seWIyMWxiblJ6SUdsdUlITmhibVVnYzJsMGRXRjBhVzl1YzF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnWTJ4bFlYSlVhVzFsYjNWMEtHMWhjbXRsY2lrN1hHNGdJQ0FnZlZ4dUlDQWdJQzh2SUdsbUlHTnNaV0Z5VkdsdFpXOTFkQ0IzWVhOdUozUWdZWFpoYVd4aFlteGxJR0oxZENCM1lYTWdiR0YwZEdWeUlHUmxabWx1WldSY2JpQWdJQ0JwWmlBb0tHTmhZMmhsWkVOc1pXRnlWR2x0Wlc5MWRDQTlQVDBnWkdWbVlYVnNkRU5zWldGeVZHbHRaVzkxZENCOGZDQWhZMkZqYUdWa1EyeGxZWEpVYVcxbGIzVjBLU0FtSmlCamJHVmhjbFJwYldWdmRYUXBJSHRjYmlBZ0lDQWdJQ0FnWTJGamFHVmtRMnhsWVhKVWFXMWxiM1YwSUQwZ1kyeGxZWEpVYVcxbGIzVjBPMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdZMnhsWVhKVWFXMWxiM1YwS0cxaGNtdGxjaWs3WEc0Z0lDQWdmVnh1SUNBZ0lIUnllU0I3WEc0Z0lDQWdJQ0FnSUM4dklIZG9aVzRnZDJobGJpQnpiMjFsWW05a2VTQm9ZWE1nYzJOeVpYZGxaQ0IzYVhSb0lITmxkRlJwYldWdmRYUWdZblYwSUc1dklFa3VSUzRnYldGa1pHNWxjM05jYmlBZ0lDQWdJQ0FnY21WMGRYSnVJR05oWTJobFpFTnNaV0Z5VkdsdFpXOTFkQ2h0WVhKclpYSXBPMXh1SUNBZ0lIMGdZMkYwWTJnZ0tHVXBlMXh1SUNBZ0lDQWdJQ0IwY25rZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z1YyaGxiaUIzWlNCaGNtVWdhVzRnU1M1RkxpQmlkWFFnZEdobElITmpjbWx3ZENCb1lYTWdZbVZsYmlCbGRtRnNaV1FnYzI4Z1NTNUZMaUJrYjJWemJpZDBJQ0IwY25WemRDQjBhR1VnWjJ4dlltRnNJRzlpYW1WamRDQjNhR1Z1SUdOaGJHeGxaQ0J1YjNKdFlXeHNlVnh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUdOaFkyaGxaRU5zWldGeVZHbHRaVzkxZEM1allXeHNLRzUxYkd3c0lHMWhjbXRsY2lrN1hHNGdJQ0FnSUNBZ0lIMGdZMkYwWTJnZ0tHVXBlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0x5OGdjMkZ0WlNCaGN5QmhZbTkyWlNCaWRYUWdkMmhsYmlCcGRDZHpJR0VnZG1WeWMybHZiaUJ2WmlCSkxrVXVJSFJvWVhRZ2JYVnpkQ0JvWVhabElIUm9aU0JuYkc5aVlXd2diMkpxWldOMElHWnZjaUFuZEdocGN5Y3NJR2h2Y0daMWJHeDVJRzkxY2lCamIyNTBaWGgwSUdOdmNuSmxZM1FnYjNSb1pYSjNhWE5sSUdsMElIZHBiR3dnZEdoeWIzY2dZU0JuYkc5aVlXd2daWEp5YjNJdVhHNGdJQ0FnSUNBZ0lDQWdJQ0F2THlCVGIyMWxJSFpsY25OcGIyNXpJRzltSUVrdVJTNGdhR0YyWlNCa2FXWm1aWEpsYm5RZ2NuVnNaWE1nWm05eUlHTnNaV0Z5VkdsdFpXOTFkQ0IyY3lCelpYUlVhVzFsYjNWMFhHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdZMkZqYUdWa1EyeGxZWEpVYVcxbGIzVjBMbU5oYkd3b2RHaHBjeXdnYldGeWEyVnlLVHRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dVhHNWNibjFjYm5aaGNpQnhkV1YxWlNBOUlGdGRPMXh1ZG1GeUlHUnlZV2x1YVc1bklEMGdabUZzYzJVN1hHNTJZWElnWTNWeWNtVnVkRkYxWlhWbE8xeHVkbUZ5SUhGMVpYVmxTVzVrWlhnZ1BTQXRNVHRjYmx4dVpuVnVZM1JwYjI0Z1kyeGxZVzVWY0U1bGVIUlVhV05yS0NrZ2UxeHVJQ0FnSUdsbUlDZ2haSEpoYVc1cGJtY2dmSHdnSVdOMWNuSmxiblJSZFdWMVpTa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNDdYRzRnSUNBZ2ZWeHVJQ0FnSUdSeVlXbHVhVzVuSUQwZ1ptRnNjMlU3WEc0Z0lDQWdhV1lnS0dOMWNuSmxiblJSZFdWMVpTNXNaVzVuZEdncElIdGNiaUFnSUNBZ0lDQWdjWFZsZFdVZ1BTQmpkWEp5Wlc1MFVYVmxkV1V1WTI5dVkyRjBLSEYxWlhWbEtUdGNiaUFnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNCeGRXVjFaVWx1WkdWNElEMGdMVEU3WEc0Z0lDQWdmVnh1SUNBZ0lHbG1JQ2h4ZFdWMVpTNXNaVzVuZEdncElIdGNiaUFnSUNBZ0lDQWdaSEpoYVc1UmRXVjFaU2dwTzF4dUlDQWdJSDFjYm4xY2JseHVablZ1WTNScGIyNGdaSEpoYVc1UmRXVjFaU2dwSUh0Y2JpQWdJQ0JwWmlBb1pISmhhVzVwYm1jcElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdU8xeHVJQ0FnSUgxY2JpQWdJQ0IyWVhJZ2RHbHRaVzkxZENBOUlISjFibFJwYldWdmRYUW9ZMnhsWVc1VmNFNWxlSFJVYVdOcktUdGNiaUFnSUNCa2NtRnBibWx1WnlBOUlIUnlkV1U3WEc1Y2JpQWdJQ0IyWVhJZ2JHVnVJRDBnY1hWbGRXVXViR1Z1WjNSb08xeHVJQ0FnSUhkb2FXeGxLR3hsYmlrZ2UxeHVJQ0FnSUNBZ0lDQmpkWEp5Wlc1MFVYVmxkV1VnUFNCeGRXVjFaVHRjYmlBZ0lDQWdJQ0FnY1hWbGRXVWdQU0JiWFR0Y2JpQWdJQ0FnSUNBZ2QyaHBiR1VnS0NzcmNYVmxkV1ZKYm1SbGVDQThJR3hsYmlrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tHTjFjbkpsYm5SUmRXVjFaU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdOMWNuSmxiblJSZFdWMVpWdHhkV1YxWlVsdVpHVjRYUzV5ZFc0b0tUdGNiaUFnSUNBZ0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQnhkV1YxWlVsdVpHVjRJRDBnTFRFN1hHNGdJQ0FnSUNBZ0lHeGxiaUE5SUhGMVpYVmxMbXhsYm1kMGFEdGNiaUFnSUNCOVhHNGdJQ0FnWTNWeWNtVnVkRkYxWlhWbElEMGdiblZzYkR0Y2JpQWdJQ0JrY21GcGJtbHVaeUE5SUdaaGJITmxPMXh1SUNBZ0lISjFia05zWldGeVZHbHRaVzkxZENoMGFXMWxiM1YwS1R0Y2JuMWNibHh1Y0hKdlkyVnpjeTV1WlhoMFZHbGpheUE5SUdaMWJtTjBhVzl1SUNobWRXNHBJSHRjYmlBZ0lDQjJZWElnWVhKbmN5QTlJRzVsZHlCQmNuSmhlU2hoY21kMWJXVnVkSE11YkdWdVozUm9JQzBnTVNrN1hHNGdJQ0FnYVdZZ0tHRnlaM1Z0Wlc1MGN5NXNaVzVuZEdnZ1BpQXhLU0I3WEc0Z0lDQWdJQ0FnSUdadmNpQW9kbUZ5SUdrZ1BTQXhPeUJwSUR3Z1lYSm5kVzFsYm5SekxteGxibWQwYURzZ2FTc3JLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQmhjbWR6VzJrZ0xTQXhYU0E5SUdGeVozVnRaVzUwYzF0cFhUdGNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lIMWNiaUFnSUNCeGRXVjFaUzV3ZFhOb0tHNWxkeUJKZEdWdEtHWjFiaXdnWVhKbmN5a3BPMXh1SUNBZ0lHbG1JQ2h4ZFdWMVpTNXNaVzVuZEdnZ1BUMDlJREVnSmlZZ0lXUnlZV2x1YVc1bktTQjdYRzRnSUNBZ0lDQWdJSEoxYmxScGJXVnZkWFFvWkhKaGFXNVJkV1YxWlNrN1hHNGdJQ0FnZlZ4dWZUdGNibHh1THk4Z2RqZ2diR2xyWlhNZ2NISmxaR2xqZEdsaWJHVWdiMkpxWldOMGMxeHVablZ1WTNScGIyNGdTWFJsYlNobWRXNHNJR0Z5Y21GNUtTQjdYRzRnSUNBZ2RHaHBjeTVtZFc0Z1BTQm1kVzQ3WEc0Z0lDQWdkR2hwY3k1aGNuSmhlU0E5SUdGeWNtRjVPMXh1ZlZ4dVNYUmxiUzV3Y205MGIzUjVjR1V1Y25WdUlEMGdablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFJvYVhNdVpuVnVMbUZ3Y0d4NUtHNTFiR3dzSUhSb2FYTXVZWEp5WVhrcE8xeHVmVHRjYm5CeWIyTmxjM011ZEdsMGJHVWdQU0FuWW5KdmQzTmxjaWM3WEc1d2NtOWpaWE56TG1KeWIzZHpaWElnUFNCMGNuVmxPMXh1Y0hKdlkyVnpjeTVsYm5ZZ1BTQjdmVHRjYm5CeWIyTmxjM011WVhKbmRpQTlJRnRkTzF4dWNISnZZMlZ6Y3k1MlpYSnphVzl1SUQwZ0p5YzdJQzh2SUdWdGNIUjVJSE4wY21sdVp5QjBieUJoZG05cFpDQnlaV2RsZUhBZ2FYTnpkV1Z6WEc1d2NtOWpaWE56TG5abGNuTnBiMjV6SUQwZ2UzMDdYRzVjYm1aMWJtTjBhVzl1SUc1dmIzQW9LU0I3ZlZ4dVhHNXdjbTlqWlhOekxtOXVJRDBnYm05dmNEdGNibkJ5YjJObGMzTXVZV1JrVEdsemRHVnVaWElnUFNCdWIyOXdPMXh1Y0hKdlkyVnpjeTV2Ym1ObElEMGdibTl2Y0R0Y2JuQnliMk5sYzNNdWIyWm1JRDBnYm05dmNEdGNibkJ5YjJObGMzTXVjbVZ0YjNabFRHbHpkR1Z1WlhJZ1BTQnViMjl3TzF4dWNISnZZMlZ6Y3k1eVpXMXZkbVZCYkd4TWFYTjBaVzVsY25NZ1BTQnViMjl3TzF4dWNISnZZMlZ6Y3k1bGJXbDBJRDBnYm05dmNEdGNibkJ5YjJObGMzTXVjSEpsY0dWdVpFeHBjM1JsYm1WeUlEMGdibTl2Y0R0Y2JuQnliMk5sYzNNdWNISmxjR1Z1WkU5dVkyVk1hWE4wWlc1bGNpQTlJRzV2YjNBN1hHNWNibkJ5YjJObGMzTXViR2x6ZEdWdVpYSnpJRDBnWm5WdVkzUnBiMjRnS0c1aGJXVXBJSHNnY21WMGRYSnVJRnRkSUgxY2JseHVjSEp2WTJWemN5NWlhVzVrYVc1bklEMGdablZ1WTNScGIyNGdLRzVoYldVcElIdGNiaUFnSUNCMGFISnZkeUJ1WlhjZ1JYSnliM0lvSjNCeWIyTmxjM011WW1sdVpHbHVaeUJwY3lCdWIzUWdjM1Z3Y0c5eWRHVmtKeWs3WEc1OU8xeHVYRzV3Y205alpYTnpMbU4zWkNBOUlHWjFibU4wYVc5dUlDZ3BJSHNnY21WMGRYSnVJQ2N2SnlCOU8xeHVjSEp2WTJWemN5NWphR1JwY2lBOUlHWjFibU4wYVc5dUlDaGthWElwSUh0Y2JpQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9KM0J5YjJObGMzTXVZMmhrYVhJZ2FYTWdibTkwSUhOMWNIQnZjblJsWkNjcE8xeHVmVHRjYm5CeWIyTmxjM011ZFcxaGMyc2dQU0JtZFc1amRHbHZiaWdwSUhzZ2NtVjBkWEp1SURBN0lIMDdYRzRpTENJb1puVnVZM1JwYjI0Z0tHZHNiMkpoYkN3Z1ptRmpkRzl5ZVNrZ2UxeHVYSFIwZVhCbGIyWWdaWGh3YjNKMGN5QTlQVDBnSjI5aWFtVmpkQ2NnSmlZZ2RIbHdaVzltSUcxdlpIVnNaU0FoUFQwZ0ozVnVaR1ZtYVc1bFpDY2dQeUJtWVdOMGIzSjVLQ2tnT2x4dVhIUjBlWEJsYjJZZ1pHVm1hVzVsSUQwOVBTQW5ablZ1WTNScGIyNG5JQ1ltSUdSbFptbHVaUzVoYldRZ1B5QmtaV1pwYm1Vb1ptRmpkRzl5ZVNrZ09seHVYSFFvWm1GamRHOXllU2dwS1R0Y2JuMG9kR2hwY3l3Z0tHWjFibU4wYVc5dUlDZ3BJSHNnSjNWelpTQnpkSEpwWTNRbk8xeHVYRzR2S2lwY2JpQXFJRUIwYUdseklIdFFjbTl0YVhObGZWeHVJQ292WEc1bWRXNWpkR2x2YmlCbWFXNWhiR3g1UTI5dWMzUnlkV04wYjNJb1kyRnNiR0poWTJzcElIdGNiaUFnZG1GeUlHTnZibk4wY25WamRHOXlJRDBnZEdocGN5NWpiMjV6ZEhKMVkzUnZjanRjYmlBZ2NtVjBkWEp1SUhSb2FYTXVkR2hsYmloY2JpQWdJQ0JtZFc1amRHbHZiaWgyWVd4MVpTa2dlMXh1SUNBZ0lDQWdMeThnUUhSekxXbG5ibTl5WlZ4dUlDQWdJQ0FnY21WMGRYSnVJR052Ym5OMGNuVmpkRzl5TG5KbGMyOXNkbVVvWTJGc2JHSmhZMnNvS1NrdWRHaGxiaWhtZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUhaaGJIVmxPMXh1SUNBZ0lDQWdmU2s3WEc0Z0lDQWdmU3hjYmlBZ0lDQm1kVzVqZEdsdmJpaHlaV0Z6YjI0cElIdGNiaUFnSUNBZ0lDOHZJRUIwY3kxcFoyNXZjbVZjYmlBZ0lDQWdJSEpsZEhWeWJpQmpiMjV6ZEhKMVkzUnZjaTV5WlhOdmJIWmxLR05oYkd4aVlXTnJLQ2twTG5Sb1pXNG9ablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdJQ0FnSUM4dklFQjBjeTFwWjI1dmNtVmNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHTnZibk4wY25WamRHOXlMbkpsYW1WamRDaHlaV0Z6YjI0cE8xeHVJQ0FnSUNBZ2ZTazdYRzRnSUNBZ2ZWeHVJQ0FwTzF4dWZWeHVYRzR2THlCVGRHOXlaU0J6WlhSVWFXMWxiM1YwSUhKbFptVnlaVzVqWlNCemJ5QndjbTl0YVhObExYQnZiSGxtYVd4c0lIZHBiR3dnWW1VZ2RXNWhabVpsWTNSbFpDQmllVnh1THk4Z2IzUm9aWElnWTI5a1pTQnRiMlJwWm5scGJtY2djMlYwVkdsdFpXOTFkQ0FvYkdsclpTQnphVzV2Ymk1MWMyVkdZV3RsVkdsdFpYSnpLQ2twWEc1MllYSWdjMlYwVkdsdFpXOTFkRVoxYm1NZ1BTQnpaWFJVYVcxbGIzVjBPMXh1WEc1bWRXNWpkR2x2YmlCcGMwRnljbUY1S0hncElIdGNiaUFnY21WMGRYSnVJRUp2YjJ4bFlXNG9lQ0FtSmlCMGVYQmxiMllnZUM1c1pXNW5kR2dnSVQwOUlDZDFibVJsWm1sdVpXUW5LVHRjYm4xY2JseHVablZ1WTNScGIyNGdibTl2Y0NncElIdDlYRzVjYmk4dklGQnZiSGxtYVd4c0lHWnZjaUJHZFc1amRHbHZiaTV3Y205MGIzUjVjR1V1WW1sdVpGeHVablZ1WTNScGIyNGdZbWx1WkNobWJpd2dkR2hwYzBGeVp5a2dlMXh1SUNCeVpYUjFjbTRnWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnWm00dVlYQndiSGtvZEdocGMwRnlaeXdnWVhKbmRXMWxiblJ6S1R0Y2JpQWdmVHRjYm4xY2JseHVMeW9xWEc0Z0tpQkFZMjl1YzNSeWRXTjBiM0pjYmlBcUlFQndZWEpoYlNCN1JuVnVZM1JwYjI1OUlHWnVYRzRnS2k5Y2JtWjFibU4wYVc5dUlGQnliMjFwYzJVb1ptNHBJSHRjYmlBZ2FXWWdLQ0VvZEdocGN5QnBibk4wWVc1alpXOW1JRkJ5YjIxcGMyVXBLVnh1SUNBZ0lIUm9jbTkzSUc1bGR5QlVlWEJsUlhKeWIzSW9KMUJ5YjIxcGMyVnpJRzExYzNRZ1ltVWdZMjl1YzNSeWRXTjBaV1FnZG1saElHNWxkeWNwTzF4dUlDQnBaaUFvZEhsd1pXOW1JR1p1SUNFOVBTQW5ablZ1WTNScGIyNG5LU0IwYUhKdmR5QnVaWGNnVkhsd1pVVnljbTl5S0NkdWIzUWdZU0JtZFc1amRHbHZiaWNwTzF4dUlDQXZLaW9nUUhSNWNHVWdleUZ1ZFcxaVpYSjlJQ292WEc0Z0lIUm9hWE11WDNOMFlYUmxJRDBnTUR0Y2JpQWdMeW9xSUVCMGVYQmxJSHNoWW05dmJHVmhibjBnS2k5Y2JpQWdkR2hwY3k1ZmFHRnVaR3hsWkNBOUlHWmhiSE5sTzF4dUlDQXZLaW9nUUhSNWNHVWdlMUJ5YjIxcGMyVjhkVzVrWldacGJtVmtmU0FxTDF4dUlDQjBhR2x6TGw5MllXeDFaU0E5SUhWdVpHVm1hVzVsWkR0Y2JpQWdMeW9xSUVCMGVYQmxJSHNoUVhKeVlYazhJVVoxYm1OMGFXOXVQbjBnS2k5Y2JpQWdkR2hwY3k1ZlpHVm1aWEp5WldSeklEMGdXMTA3WEc1Y2JpQWdaRzlTWlhOdmJIWmxLR1p1TENCMGFHbHpLVHRjYm4xY2JseHVablZ1WTNScGIyNGdhR0Z1Wkd4bEtITmxiR1lzSUdSbFptVnljbVZrS1NCN1hHNGdJSGRvYVd4bElDaHpaV3htTGw5emRHRjBaU0E5UFQwZ015a2dlMXh1SUNBZ0lITmxiR1lnUFNCelpXeG1MbDkyWVd4MVpUdGNiaUFnZlZ4dUlDQnBaaUFvYzJWc1ppNWZjM1JoZEdVZ1BUMDlJREFwSUh0Y2JpQWdJQ0J6Wld4bUxsOWtaV1psY25KbFpITXVjSFZ6YUNoa1pXWmxjbkpsWkNrN1hHNGdJQ0FnY21WMGRYSnVPMXh1SUNCOVhHNGdJSE5sYkdZdVgyaGhibVJzWldRZ1BTQjBjblZsTzF4dUlDQlFjbTl0YVhObExsOXBiVzFsWkdsaGRHVkdiaWhtZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0IyWVhJZ1kySWdQU0J6Wld4bUxsOXpkR0YwWlNBOVBUMGdNU0EvSUdSbFptVnljbVZrTG05dVJuVnNabWxzYkdWa0lEb2daR1ZtWlhKeVpXUXViMjVTWldwbFkzUmxaRHRjYmlBZ0lDQnBaaUFvWTJJZ1BUMDlJRzUxYkd3cElIdGNiaUFnSUNBZ0lDaHpaV3htTGw5emRHRjBaU0E5UFQwZ01TQS9JSEpsYzI5c2RtVWdPaUJ5WldwbFkzUXBLR1JsWm1WeWNtVmtMbkJ5YjIxcGMyVXNJSE5sYkdZdVgzWmhiSFZsS1R0Y2JpQWdJQ0FnSUhKbGRIVnlianRjYmlBZ0lDQjlYRzRnSUNBZ2RtRnlJSEpsZER0Y2JpQWdJQ0IwY25rZ2UxeHVJQ0FnSUNBZ2NtVjBJRDBnWTJJb2MyVnNaaTVmZG1Gc2RXVXBPMXh1SUNBZ0lIMGdZMkYwWTJnZ0tHVXBJSHRjYmlBZ0lDQWdJSEpsYW1WamRDaGtaV1psY25KbFpDNXdjbTl0YVhObExDQmxLVHRjYmlBZ0lDQWdJSEpsZEhWeWJqdGNiaUFnSUNCOVhHNGdJQ0FnY21WemIyeDJaU2hrWldabGNuSmxaQzV3Y205dGFYTmxMQ0J5WlhRcE8xeHVJQ0I5S1R0Y2JuMWNibHh1Wm5WdVkzUnBiMjRnY21WemIyeDJaU2h6Wld4bUxDQnVaWGRXWVd4MVpTa2dlMXh1SUNCMGNua2dlMXh1SUNBZ0lDOHZJRkJ5YjIxcGMyVWdVbVZ6YjJ4MWRHbHZiaUJRY205alpXUjFjbVU2SUdoMGRIQnpPaTh2WjJsMGFIVmlMbU52YlM5d2NtOXRhWE5sY3kxaGNHeDFjeTl3Y205dGFYTmxjeTF6Y0dWakkzUm9aUzF3Y205dGFYTmxMWEpsYzI5c2RYUnBiMjR0Y0hKdlkyVmtkWEpsWEc0Z0lDQWdhV1lnS0c1bGQxWmhiSFZsSUQwOVBTQnpaV3htS1Z4dUlDQWdJQ0FnZEdoeWIzY2dibVYzSUZSNWNHVkZjbkp2Y2lnblFTQndjbTl0YVhObElHTmhibTV2ZENCaVpTQnlaWE52YkhabFpDQjNhWFJvSUdsMGMyVnNaaTRuS1R0Y2JpQWdJQ0JwWmlBb1hHNGdJQ0FnSUNCdVpYZFdZV3gxWlNBbUpseHVJQ0FnSUNBZ0tIUjVjR1Z2WmlCdVpYZFdZV3gxWlNBOVBUMGdKMjlpYW1WamRDY2dmSHdnZEhsd1pXOW1JRzVsZDFaaGJIVmxJRDA5UFNBblpuVnVZM1JwYjI0bktWeHVJQ0FnSUNrZ2UxeHVJQ0FnSUNBZ2RtRnlJSFJvWlc0Z1BTQnVaWGRXWVd4MVpTNTBhR1Z1TzF4dUlDQWdJQ0FnYVdZZ0tHNWxkMVpoYkhWbElHbHVjM1JoYm1ObGIyWWdVSEp2YldselpTa2dlMXh1SUNBZ0lDQWdJQ0J6Wld4bUxsOXpkR0YwWlNBOUlETTdYRzRnSUNBZ0lDQWdJSE5sYkdZdVgzWmhiSFZsSUQwZ2JtVjNWbUZzZFdVN1hHNGdJQ0FnSUNBZ0lHWnBibUZzWlNoelpXeG1LVHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVPMXh1SUNBZ0lDQWdmU0JsYkhObElHbG1JQ2gwZVhCbGIyWWdkR2hsYmlBOVBUMGdKMloxYm1OMGFXOXVKeWtnZTF4dUlDQWdJQ0FnSUNCa2IxSmxjMjlzZG1Vb1ltbHVaQ2gwYUdWdUxDQnVaWGRXWVd4MVpTa3NJSE5sYkdZcE8xeHVJQ0FnSUNBZ0lDQnlaWFIxY200N1hHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dUlDQWdJSE5sYkdZdVgzTjBZWFJsSUQwZ01UdGNiaUFnSUNCelpXeG1MbDkyWVd4MVpTQTlJRzVsZDFaaGJIVmxPMXh1SUNBZ0lHWnBibUZzWlNoelpXeG1LVHRjYmlBZ2ZTQmpZWFJqYUNBb1pTa2dlMXh1SUNBZ0lISmxhbVZqZENoelpXeG1MQ0JsS1R0Y2JpQWdmVnh1ZlZ4dVhHNW1kVzVqZEdsdmJpQnlaV3BsWTNRb2MyVnNaaXdnYm1WM1ZtRnNkV1VwSUh0Y2JpQWdjMlZzWmk1ZmMzUmhkR1VnUFNBeU8xeHVJQ0J6Wld4bUxsOTJZV3gxWlNBOUlHNWxkMVpoYkhWbE8xeHVJQ0JtYVc1aGJHVW9jMlZzWmlrN1hHNTlYRzVjYm1aMWJtTjBhVzl1SUdacGJtRnNaU2h6Wld4bUtTQjdYRzRnSUdsbUlDaHpaV3htTGw5emRHRjBaU0E5UFQwZ01pQW1KaUJ6Wld4bUxsOWtaV1psY25KbFpITXViR1Z1WjNSb0lEMDlQU0F3S1NCN1hHNGdJQ0FnVUhKdmJXbHpaUzVmYVcxdFpXUnBZWFJsUm00b1puVnVZM1JwYjI0b0tTQjdYRzRnSUNBZ0lDQnBaaUFvSVhObGJHWXVYMmhoYm1Sc1pXUXBJSHRjYmlBZ0lDQWdJQ0FnVUhKdmJXbHpaUzVmZFc1b1lXNWtiR1ZrVW1WcVpXTjBhVzl1Um00b2MyVnNaaTVmZG1Gc2RXVXBPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lIMHBPMXh1SUNCOVhHNWNiaUFnWm05eUlDaDJZWElnYVNBOUlEQXNJR3hsYmlBOUlITmxiR1l1WDJSbFptVnljbVZrY3k1c1pXNW5kR2c3SUdrZ1BDQnNaVzQ3SUdrckt5a2dlMXh1SUNBZ0lHaGhibVJzWlNoelpXeG1MQ0J6Wld4bUxsOWtaV1psY25KbFpITmJhVjBwTzF4dUlDQjlYRzRnSUhObGJHWXVYMlJsWm1WeWNtVmtjeUE5SUc1MWJHdzdYRzU5WEc1Y2JpOHFLbHh1SUNvZ1FHTnZibk4wY25WamRHOXlYRzRnS2k5Y2JtWjFibU4wYVc5dUlFaGhibVJzWlhJb2IyNUdkV3htYVd4c1pXUXNJRzl1VW1WcVpXTjBaV1FzSUhCeWIyMXBjMlVwSUh0Y2JpQWdkR2hwY3k1dmJrWjFiR1pwYkd4bFpDQTlJSFI1Y0dWdlppQnZia1oxYkdacGJHeGxaQ0E5UFQwZ0oyWjFibU4wYVc5dUp5QS9JRzl1Um5Wc1ptbHNiR1ZrSURvZ2JuVnNiRHRjYmlBZ2RHaHBjeTV2YmxKbGFtVmpkR1ZrSUQwZ2RIbHdaVzltSUc5dVVtVnFaV04wWldRZ1BUMDlJQ2RtZFc1amRHbHZiaWNnUHlCdmJsSmxhbVZqZEdWa0lEb2diblZzYkR0Y2JpQWdkR2hwY3k1d2NtOXRhWE5sSUQwZ2NISnZiV2x6WlR0Y2JuMWNibHh1THlvcVhHNGdLaUJVWVd0bElHRWdjRzkwWlc1MGFXRnNiSGtnYldselltVm9ZWFpwYm1jZ2NtVnpiMngyWlhJZ1puVnVZM1JwYjI0Z1lXNWtJRzFoYTJVZ2MzVnlaVnh1SUNvZ2IyNUdkV3htYVd4c1pXUWdZVzVrSUc5dVVtVnFaV04wWldRZ1lYSmxJRzl1YkhrZ1kyRnNiR1ZrSUc5dVkyVXVYRzRnS2x4dUlDb2dUV0ZyWlhNZ2JtOGdaM1ZoY21GdWRHVmxjeUJoWW05MWRDQmhjM2x1WTJoeWIyNTVMbHh1SUNvdlhHNW1kVzVqZEdsdmJpQmtiMUpsYzI5c2RtVW9abTRzSUhObGJHWXBJSHRjYmlBZ2RtRnlJR1J2Ym1VZ1BTQm1ZV3h6WlR0Y2JpQWdkSEo1SUh0Y2JpQWdJQ0JtYmloY2JpQWdJQ0FnSUdaMWJtTjBhVzl1S0haaGJIVmxLU0I3WEc0Z0lDQWdJQ0FnSUdsbUlDaGtiMjVsS1NCeVpYUjFjbTQ3WEc0Z0lDQWdJQ0FnSUdSdmJtVWdQU0IwY25WbE8xeHVJQ0FnSUNBZ0lDQnlaWE52YkhabEtITmxiR1lzSUhaaGJIVmxLVHRjYmlBZ0lDQWdJSDBzWEc0Z0lDQWdJQ0JtZFc1amRHbHZiaWh5WldGemIyNHBJSHRjYmlBZ0lDQWdJQ0FnYVdZZ0tHUnZibVVwSUhKbGRIVnlianRjYmlBZ0lDQWdJQ0FnWkc5dVpTQTlJSFJ5ZFdVN1hHNGdJQ0FnSUNBZ0lISmxhbVZqZENoelpXeG1MQ0J5WldGemIyNHBPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lDazdYRzRnSUgwZ1kyRjBZMmdnS0dWNEtTQjdYRzRnSUNBZ2FXWWdLR1J2Ym1VcElISmxkSFZ5Ymp0Y2JpQWdJQ0JrYjI1bElEMGdkSEoxWlR0Y2JpQWdJQ0J5WldwbFkzUW9jMlZzWml3Z1pYZ3BPMXh1SUNCOVhHNTlYRzVjYmxCeWIyMXBjMlV1Y0hKdmRHOTBlWEJsV3lkallYUmphQ2RkSUQwZ1puVnVZM1JwYjI0b2IyNVNaV3BsWTNSbFpDa2dlMXh1SUNCeVpYUjFjbTRnZEdocGN5NTBhR1Z1S0c1MWJHd3NJRzl1VW1WcVpXTjBaV1FwTzF4dWZUdGNibHh1VUhKdmJXbHpaUzV3Y205MGIzUjVjR1V1ZEdobGJpQTlJR1oxYm1OMGFXOXVLRzl1Um5Wc1ptbHNiR1ZrTENCdmJsSmxhbVZqZEdWa0tTQjdYRzRnSUM4dklFQjBjeTFwWjI1dmNtVmNiaUFnZG1GeUlIQnliMjBnUFNCdVpYY2dkR2hwY3k1amIyNXpkSEoxWTNSdmNpaHViMjl3S1R0Y2JseHVJQ0JvWVc1a2JHVW9kR2hwY3l3Z2JtVjNJRWhoYm1Sc1pYSW9iMjVHZFd4bWFXeHNaV1FzSUc5dVVtVnFaV04wWldRc0lIQnliMjBwS1R0Y2JpQWdjbVYwZFhKdUlIQnliMjA3WEc1OU8xeHVYRzVRY205dGFYTmxMbkJ5YjNSdmRIbHdaVnNuWm1sdVlXeHNlU2RkSUQwZ1ptbHVZV3hzZVVOdmJuTjBjblZqZEc5eU8xeHVYRzVRY205dGFYTmxMbUZzYkNBOUlHWjFibU4wYVc5dUtHRnljaWtnZTF4dUlDQnlaWFIxY200Z2JtVjNJRkJ5YjIxcGMyVW9ablZ1WTNScGIyNG9jbVZ6YjJ4MlpTd2djbVZxWldOMEtTQjdYRzRnSUNBZ2FXWWdLQ0ZwYzBGeWNtRjVLR0Z5Y2lrcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCeVpXcGxZM1FvYm1WM0lGUjVjR1ZGY25KdmNpZ25VSEp2YldselpTNWhiR3dnWVdOalpYQjBjeUJoYmlCaGNuSmhlU2NwS1R0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0IyWVhJZ1lYSm5jeUE5SUVGeWNtRjVMbkJ5YjNSdmRIbHdaUzV6YkdsalpTNWpZV3hzS0dGeWNpazdYRzRnSUNBZ2FXWWdLR0Z5WjNNdWJHVnVaM1JvSUQwOVBTQXdLU0J5WlhSMWNtNGdjbVZ6YjJ4MlpTaGJYU2s3WEc0Z0lDQWdkbUZ5SUhKbGJXRnBibWx1WnlBOUlHRnlaM011YkdWdVozUm9PMXh1WEc0Z0lDQWdablZ1WTNScGIyNGdjbVZ6S0drc0lIWmhiQ2tnZTF4dUlDQWdJQ0FnZEhKNUlIdGNiaUFnSUNBZ0lDQWdhV1lnS0haaGJDQW1KaUFvZEhsd1pXOW1JSFpoYkNBOVBUMGdKMjlpYW1WamRDY2dmSHdnZEhsd1pXOW1JSFpoYkNBOVBUMGdKMloxYm1OMGFXOXVKeWtwSUh0Y2JpQWdJQ0FnSUNBZ0lDQjJZWElnZEdobGJpQTlJSFpoYkM1MGFHVnVPMXh1SUNBZ0lDQWdJQ0FnSUdsbUlDaDBlWEJsYjJZZ2RHaGxiaUE5UFQwZ0oyWjFibU4wYVc5dUp5a2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RHaGxiaTVqWVd4c0tGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCMllXd3NYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lHWjFibU4wYVc5dUtIWmhiQ2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhKbGN5aHBMQ0IyWVd3cE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCOUxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCeVpXcGxZM1JjYmlBZ0lDQWdJQ0FnSUNBZ0lDazdYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTQ3WEc0Z0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQWdJR0Z5WjNOYmFWMGdQU0IyWVd3N1hHNGdJQ0FnSUNBZ0lHbG1JQ2d0TFhKbGJXRnBibWx1WnlBOVBUMGdNQ2tnZTF4dUlDQWdJQ0FnSUNBZ0lISmxjMjlzZG1Vb1lYSm5jeWs3WEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUgwZ1kyRjBZMmdnS0dWNEtTQjdYRzRnSUNBZ0lDQWdJSEpsYW1WamRDaGxlQ2s3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1WEc0Z0lDQWdabTl5SUNoMllYSWdhU0E5SURBN0lHa2dQQ0JoY21kekxteGxibWQwYURzZ2FTc3JLU0I3WEc0Z0lDQWdJQ0J5WlhNb2FTd2dZWEpuYzF0cFhTazdYRzRnSUNBZ2ZWeHVJQ0I5S1R0Y2JuMDdYRzVjYmxCeWIyMXBjMlV1Y21WemIyeDJaU0E5SUdaMWJtTjBhVzl1S0haaGJIVmxLU0I3WEc0Z0lHbG1JQ2gyWVd4MVpTQW1KaUIwZVhCbGIyWWdkbUZzZFdVZ1BUMDlJQ2R2WW1wbFkzUW5JQ1ltSUhaaGJIVmxMbU52Ym5OMGNuVmpkRzl5SUQwOVBTQlFjbTl0YVhObEtTQjdYRzRnSUNBZ2NtVjBkWEp1SUhaaGJIVmxPMXh1SUNCOVhHNWNiaUFnY21WMGRYSnVJRzVsZHlCUWNtOXRhWE5sS0daMWJtTjBhVzl1S0hKbGMyOXNkbVVwSUh0Y2JpQWdJQ0J5WlhOdmJIWmxLSFpoYkhWbEtUdGNiaUFnZlNrN1hHNTlPMXh1WEc1UWNtOXRhWE5sTG5KbGFtVmpkQ0E5SUdaMWJtTjBhVzl1S0haaGJIVmxLU0I3WEc0Z0lISmxkSFZ5YmlCdVpYY2dVSEp2YldselpTaG1kVzVqZEdsdmJpaHlaWE52YkhabExDQnlaV3BsWTNRcElIdGNiaUFnSUNCeVpXcGxZM1FvZG1Gc2RXVXBPMXh1SUNCOUtUdGNibjA3WEc1Y2JsQnliMjFwYzJVdWNtRmpaU0E5SUdaMWJtTjBhVzl1S0dGeWNpa2dlMXh1SUNCeVpYUjFjbTRnYm1WM0lGQnliMjFwYzJVb1puVnVZM1JwYjI0b2NtVnpiMngyWlN3Z2NtVnFaV04wS1NCN1hHNGdJQ0FnYVdZZ0tDRnBjMEZ5Y21GNUtHRnljaWtwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJ5WldwbFkzUW9ibVYzSUZSNWNHVkZjbkp2Y2lnblVISnZiV2x6WlM1eVlXTmxJR0ZqWTJWd2RITWdZVzRnWVhKeVlYa25LU2s3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdabTl5SUNoMllYSWdhU0E5SURBc0lHeGxiaUE5SUdGeWNpNXNaVzVuZEdnN0lHa2dQQ0JzWlc0N0lHa3JLeWtnZTF4dUlDQWdJQ0FnVUhKdmJXbHpaUzV5WlhOdmJIWmxLR0Z5Y2x0cFhTa3VkR2hsYmloeVpYTnZiSFpsTENCeVpXcGxZM1FwTzF4dUlDQWdJSDFjYmlBZ2ZTazdYRzU5TzF4dVhHNHZMeUJWYzJVZ2NHOXNlV1pwYkd3Z1ptOXlJSE5sZEVsdGJXVmthV0YwWlNCbWIzSWdjR1Z5Wm05eWJXRnVZMlVnWjJGcGJuTmNibEJ5YjIxcGMyVXVYMmx0YldWa2FXRjBaVVp1SUQxY2JpQWdMeThnUUhSekxXbG5ibTl5WlZ4dUlDQW9kSGx3Wlc5bUlITmxkRWx0YldWa2FXRjBaU0E5UFQwZ0oyWjFibU4wYVc5dUp5QW1KbHh1SUNBZ0lHWjFibU4wYVc5dUtHWnVLU0I3WEc0Z0lDQWdJQ0F2THlCQWRITXRhV2R1YjNKbFhHNGdJQ0FnSUNCelpYUkpiVzFsWkdsaGRHVW9abTRwTzF4dUlDQWdJSDBwSUh4OFhHNGdJR1oxYm1OMGFXOXVLR1p1S1NCN1hHNGdJQ0FnYzJWMFZHbHRaVzkxZEVaMWJtTW9abTRzSURBcE8xeHVJQ0I5TzF4dVhHNVFjbTl0YVhObExsOTFibWhoYm1Sc1pXUlNaV3BsWTNScGIyNUdiaUE5SUdaMWJtTjBhVzl1SUY5MWJtaGhibVJzWldSU1pXcGxZM1JwYjI1R2JpaGxjbklwSUh0Y2JpQWdhV1lnS0hSNWNHVnZaaUJqYjI1emIyeGxJQ0U5UFNBbmRXNWtaV1pwYm1Wa0p5QW1KaUJqYjI1emIyeGxLU0I3WEc0Z0lDQWdZMjl1YzI5c1pTNTNZWEp1S0NkUWIzTnphV0pzWlNCVmJtaGhibVJzWldRZ1VISnZiV2x6WlNCU1pXcGxZM1JwYjI0Nkp5d2daWEp5S1RzZ0x5OGdaWE5zYVc1MExXUnBjMkZpYkdVdGJHbHVaU0J1YnkxamIyNXpiMnhsWEc0Z0lIMWNibjA3WEc1Y2JpOHFLaUJBYzNWd2NISmxjM01nZTNWdVpHVm1hVzVsWkZaaGNuTjlJQ292WEc1MllYSWdaMnh2WW1Gc1RsTWdQU0FvWm5WdVkzUnBiMjRvS1NCN1hHNGdJQzh2SUhSb1pTQnZibXg1SUhKbGJHbGhZbXhsSUcxbFlXNXpJSFJ2SUdkbGRDQjBhR1VnWjJ4dlltRnNJRzlpYW1WamRDQnBjMXh1SUNBdkx5QmdSblZ1WTNScGIyNG9KM0psZEhWeWJpQjBhR2x6Snlrb0tXQmNiaUFnTHk4Z1NHOTNaWFpsY2l3Z2RHaHBjeUJqWVhWelpYTWdRMU5RSUhacGIyeGhkR2x2Ym5NZ2FXNGdRMmh5YjIxbElHRndjSE11WEc0Z0lHbG1JQ2gwZVhCbGIyWWdjMlZzWmlBaFBUMGdKM1Z1WkdWbWFXNWxaQ2NwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdjMlZzWmp0Y2JpQWdmVnh1SUNCcFppQW9kSGx3Wlc5bUlIZHBibVJ2ZHlBaFBUMGdKM1Z1WkdWbWFXNWxaQ2NwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdkMmx1Wkc5M08xeHVJQ0I5WEc0Z0lHbG1JQ2gwZVhCbGIyWWdaMnh2WW1Gc0lDRTlQU0FuZFc1a1pXWnBibVZrSnlrZ2UxeHVJQ0FnSUhKbGRIVnliaUJuYkc5aVlXdzdYRzRnSUgxY2JpQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtDZDFibUZpYkdVZ2RHOGdiRzlqWVhSbElHZHNiMkpoYkNCdlltcGxZM1FuS1R0Y2JuMHBLQ2s3WEc1Y2JtbG1JQ2doS0NkUWNtOXRhWE5sSnlCcGJpQm5iRzlpWVd4T1V5a3BJSHRjYmlBZ1oyeHZZbUZzVGxOYkoxQnliMjFwYzJVblhTQTlJRkJ5YjIxcGMyVTdYRzU5SUdWc2MyVWdhV1lnS0NGbmJHOWlZV3hPVXk1UWNtOXRhWE5sTG5CeWIzUnZkSGx3WlZzblptbHVZV3hzZVNkZEtTQjdYRzRnSUdkc2IySmhiRTVUTGxCeWIyMXBjMlV1Y0hKdmRHOTBlWEJsV3lkbWFXNWhiR3g1SjEwZ1BTQm1hVzVoYkd4NVEyOXVjM1J5ZFdOMGIzSTdYRzU5WEc1Y2JuMHBLU2s3WEc0aUxDSjJZWElnYm1WNGRGUnBZMnNnUFNCeVpYRjFhWEpsS0Nkd2NtOWpaWE56TDJKeWIzZHpaWEl1YW5NbktTNXVaWGgwVkdsamF6dGNiblpoY2lCaGNIQnNlU0E5SUVaMWJtTjBhVzl1TG5CeWIzUnZkSGx3WlM1aGNIQnNlVHRjYm5aaGNpQnpiR2xqWlNBOUlFRnljbUY1TG5CeWIzUnZkSGx3WlM1emJHbGpaVHRjYm5aaGNpQnBiVzFsWkdsaGRHVkpaSE1nUFNCN2ZUdGNiblpoY2lCdVpYaDBTVzF0WldScFlYUmxTV1FnUFNBd08xeHVYRzR2THlCRVQwMGdRVkJKY3l3Z1ptOXlJR052YlhCc1pYUmxibVZ6YzF4dVhHNWxlSEJ2Y25SekxuTmxkRlJwYldWdmRYUWdQU0JtZFc1amRHbHZiaWdwSUh0Y2JpQWdjbVYwZFhKdUlHNWxkeUJVYVcxbGIzVjBLR0Z3Y0d4NUxtTmhiR3dvYzJWMFZHbHRaVzkxZEN3Z2QybHVaRzkzTENCaGNtZDFiV1Z1ZEhNcExDQmpiR1ZoY2xScGJXVnZkWFFwTzF4dWZUdGNibVY0Y0c5eWRITXVjMlYwU1c1MFpYSjJZV3dnUFNCbWRXNWpkR2x2YmlncElIdGNiaUFnY21WMGRYSnVJRzVsZHlCVWFXMWxiM1YwS0dGd2NHeDVMbU5oYkd3b2MyVjBTVzUwWlhKMllXd3NJSGRwYm1SdmR5d2dZWEpuZFcxbGJuUnpLU3dnWTJ4bFlYSkpiblJsY25aaGJDazdYRzU5TzF4dVpYaHdiM0owY3k1amJHVmhjbFJwYldWdmRYUWdQVnh1Wlhod2IzSjBjeTVqYkdWaGNrbHVkR1Z5ZG1Gc0lEMGdablZ1WTNScGIyNG9kR2x0Wlc5MWRDa2dleUIwYVcxbGIzVjBMbU5zYjNObEtDazdJSDA3WEc1Y2JtWjFibU4wYVc5dUlGUnBiV1Z2ZFhRb2FXUXNJR05zWldGeVJtNHBJSHRjYmlBZ2RHaHBjeTVmYVdRZ1BTQnBaRHRjYmlBZ2RHaHBjeTVmWTJ4bFlYSkdiaUE5SUdOc1pXRnlSbTQ3WEc1OVhHNVVhVzFsYjNWMExuQnliM1J2ZEhsd1pTNTFibkpsWmlBOUlGUnBiV1Z2ZFhRdWNISnZkRzkwZVhCbExuSmxaaUE5SUdaMWJtTjBhVzl1S0NrZ2UzMDdYRzVVYVcxbGIzVjBMbkJ5YjNSdmRIbHdaUzVqYkc5elpTQTlJR1oxYm1OMGFXOXVLQ2tnZTF4dUlDQjBhR2x6TGw5amJHVmhja1p1TG1OaGJHd29kMmx1Wkc5M0xDQjBhR2x6TGw5cFpDazdYRzU5TzF4dVhHNHZMeUJFYjJWeklHNXZkQ0J6ZEdGeWRDQjBhR1VnZEdsdFpTd2dhblZ6ZENCelpYUnpJSFZ3SUhSb1pTQnRaVzFpWlhKeklHNWxaV1JsWkM1Y2JtVjRjRzl5ZEhNdVpXNXliMnhzSUQwZ1puVnVZM1JwYjI0b2FYUmxiU3dnYlhObFkzTXBJSHRjYmlBZ1kyeGxZWEpVYVcxbGIzVjBLR2wwWlcwdVgybGtiR1ZVYVcxbGIzVjBTV1FwTzF4dUlDQnBkR1Z0TGw5cFpHeGxWR2x0Wlc5MWRDQTlJRzF6WldOek8xeHVmVHRjYmx4dVpYaHdiM0owY3k1MWJtVnVjbTlzYkNBOUlHWjFibU4wYVc5dUtHbDBaVzBwSUh0Y2JpQWdZMnhsWVhKVWFXMWxiM1YwS0dsMFpXMHVYMmxrYkdWVWFXMWxiM1YwU1dRcE8xeHVJQ0JwZEdWdExsOXBaR3hsVkdsdFpXOTFkQ0E5SUMweE8xeHVmVHRjYmx4dVpYaHdiM0owY3k1ZmRXNXlaV1pCWTNScGRtVWdQU0JsZUhCdmNuUnpMbUZqZEdsMlpTQTlJR1oxYm1OMGFXOXVLR2wwWlcwcElIdGNiaUFnWTJ4bFlYSlVhVzFsYjNWMEtHbDBaVzB1WDJsa2JHVlVhVzFsYjNWMFNXUXBPMXh1WEc0Z0lIWmhjaUJ0YzJWamN5QTlJR2wwWlcwdVgybGtiR1ZVYVcxbGIzVjBPMXh1SUNCcFppQW9iWE5sWTNNZ1BqMGdNQ2tnZTF4dUlDQWdJR2wwWlcwdVgybGtiR1ZVYVcxbGIzVjBTV1FnUFNCelpYUlVhVzFsYjNWMEtHWjFibU4wYVc5dUlHOXVWR2x0Wlc5MWRDZ3BJSHRjYmlBZ0lDQWdJR2xtSUNocGRHVnRMbDl2YmxScGJXVnZkWFFwWEc0Z0lDQWdJQ0FnSUdsMFpXMHVYMjl1VkdsdFpXOTFkQ2dwTzF4dUlDQWdJSDBzSUcxelpXTnpLVHRjYmlBZ2ZWeHVmVHRjYmx4dUx5OGdWR2hoZENkeklHNXZkQ0JvYjNjZ2JtOWtaUzVxY3lCcGJYQnNaVzFsYm5SeklHbDBJR0oxZENCMGFHVWdaWGh3YjNObFpDQmhjR2tnYVhNZ2RHaGxJSE5oYldVdVhHNWxlSEJ2Y25SekxuTmxkRWx0YldWa2FXRjBaU0E5SUhSNWNHVnZaaUJ6WlhSSmJXMWxaR2xoZEdVZ1BUMDlJRndpWm5WdVkzUnBiMjVjSWlBL0lITmxkRWx0YldWa2FXRjBaU0E2SUdaMWJtTjBhVzl1S0dadUtTQjdYRzRnSUhaaGNpQnBaQ0E5SUc1bGVIUkpiVzFsWkdsaGRHVkpaQ3NyTzF4dUlDQjJZWElnWVhKbmN5QTlJR0Z5WjNWdFpXNTBjeTVzWlc1bmRHZ2dQQ0F5SUQ4Z1ptRnNjMlVnT2lCemJHbGpaUzVqWVd4c0tHRnlaM1Z0Wlc1MGN5d2dNU2s3WEc1Y2JpQWdhVzF0WldScFlYUmxTV1J6VzJsa1hTQTlJSFJ5ZFdVN1hHNWNiaUFnYm1WNGRGUnBZMnNvWm5WdVkzUnBiMjRnYjI1T1pYaDBWR2xqYXlncElIdGNiaUFnSUNCcFppQW9hVzF0WldScFlYUmxTV1J6VzJsa1hTa2dlMXh1SUNBZ0lDQWdMeThnWm00dVkyRnNiQ2dwSUdseklHWmhjM1JsY2lCemJ5QjNaU0J2Y0hScGJXbDZaU0JtYjNJZ2RHaGxJR052YlcxdmJpQjFjMlV0WTJGelpWeHVJQ0FnSUNBZ0x5OGdRSE5sWlNCb2RIUndPaTh2YW5Od1pYSm1MbU52YlM5allXeHNMV0Z3Y0d4NUxYTmxaM1ZjYmlBZ0lDQWdJR2xtSUNoaGNtZHpLU0I3WEc0Z0lDQWdJQ0FnSUdadUxtRndjR3g1S0c1MWJHd3NJR0Z5WjNNcE8xeHVJQ0FnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUNBZ1ptNHVZMkZzYkNodWRXeHNLVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQWdJQzh2SUZCeVpYWmxiblFnYVdSeklHWnliMjBnYkdWaGEybHVaMXh1SUNBZ0lDQWdaWGh3YjNKMGN5NWpiR1ZoY2tsdGJXVmthV0YwWlNocFpDazdYRzRnSUNBZ2ZWeHVJQ0I5S1R0Y2JseHVJQ0J5WlhSMWNtNGdhV1E3WEc1OU8xeHVYRzVsZUhCdmNuUnpMbU5zWldGeVNXMXRaV1JwWVhSbElEMGdkSGx3Wlc5bUlHTnNaV0Z5U1cxdFpXUnBZWFJsSUQwOVBTQmNJbVoxYm1OMGFXOXVYQ0lnUHlCamJHVmhja2x0YldWa2FXRjBaU0E2SUdaMWJtTjBhVzl1S0dsa0tTQjdYRzRnSUdSbGJHVjBaU0JwYlcxbFpHbGhkR1ZKWkhOYmFXUmRPMXh1ZlRzaUxDSnBiWEJ2Y25RZ2UwVnRZV2xzU2xOU1pYTndiMjV6WlZOMFlYUjFjMzBnWm5KdmJTQW5MaTl0YjJSbGJITXZSVzFoYVd4S1UxSmxjM0J2Ym5ObFUzUmhkSFZ6Snp0Y2JtbHRjRzl5ZENCN1ZVbDlJR1p5YjIwZ0p5NHZjMlZ5ZG1salpYTXZkV2t2VlVrbk8xeHVYRzVzWlhRZ1gzVnpaWEpKUkRvZ2MzUnlhVzVuSUQwZ2JuVnNiRHRjYm14bGRDQmZiM0pwWjJsdU9pQnpkSEpwYm1jZ1BTQW5hSFIwY0hNNkx5OWhjR2t1WlcxaGFXeHFjeTVqYjIwbk8xeHVYRzVtZFc1amRHbHZiaUJ6Wlc1a1VHOXpkQ2gxY213NklITjBjbWx1Wnl3Z1pHRjBZVG9nYzNSeWFXNW5JSHdnUm05eWJVUmhkR0VzSUdobFlXUmxjbk02SUU5aWFtVmpkQ0E5SUh0OUtUb2dVSEp2YldselpUeEZiV0ZwYkVwVFVtVnpjRzl1YzJWVGRHRjBkWE0rSUh0Y2JpQWdjbVYwZFhKdUlHNWxkeUJRY205dGFYTmxLQ2h5WlhOdmJIWmxMQ0J5WldwbFkzUXBJRDArSUh0Y2JpQWdJQ0JzWlhRZ2VHaHlPaUJZVFV4SWRIUndVbVZ4ZFdWemRDQTlJRzVsZHlCWVRVeElkSFJ3VW1WeGRXVnpkQ2dwTzF4dVhHNGdJQ0FnZUdoeUxtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb0oyeHZZV1FuTENBb1pYWmxiblFwSUQwK0lIdGNiaUFnSUNBZ0lHeGxkQ0J5WlhOd2IyNXpaVk4wWVhSMWN6b2dSVzFoYVd4S1UxSmxjM0J2Ym5ObFUzUmhkSFZ6SUQwZ2JtVjNJRVZ0WVdsc1NsTlNaWE53YjI1elpWTjBZWFIxY3lnOFdFMU1TSFIwY0ZKbGNYVmxjM1ErWlhabGJuUXVkR0Z5WjJWMEtUdGNiaUFnSUNBZ0lHbG1JQ2h5WlhOd2IyNXpaVk4wWVhSMWN5NXpkR0YwZFhNZ1BUMDlJREl3TUNCOGZDQnlaWE53YjI1elpWTjBZWFIxY3k1MFpYaDBJRDA5UFNBblQwc25LU0I3WEc0Z0lDQWdJQ0FnSUhKbGMyOXNkbVVvY21WemNHOXVjMlZUZEdGMGRYTXBPMXh1SUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdjbVZxWldOMEtISmxjM0J2Ym5ObFUzUmhkSFZ6S1R0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5S1R0Y2JseHVJQ0FnSUhob2NpNWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtDZGxjbkp2Y2ljc0lDaGxkbVZ1ZENrZ1BUNGdlMXh1SUNBZ0lDQWdjbVZxWldOMEtHNWxkeUJGYldGcGJFcFRVbVZ6Y0c5dWMyVlRkR0YwZFhNb1BGaE5URWgwZEhCU1pYRjFaWE4wUG1WMlpXNTBMblJoY21kbGRDa3BPMXh1SUNBZ0lIMHBPMXh1WEc0Z0lDQWdlR2h5TG05d1pXNG9KMUJQVTFRbkxDQjFjbXdzSUhSeWRXVXBPMXh1WEc0Z0lDQWdabTl5SUNoc1pYUWdhMlY1SUdsdUlHaGxZV1JsY25NcElIdGNiaUFnSUNBZ0lDQWdlR2h5TG5ObGRGSmxjWFZsYzNSSVpXRmtaWElvYTJWNUxDQm9aV0ZrWlhKelcydGxlVjBwTzF4dUlDQWdJSDFjYmx4dUlDQWdJSGhvY2k1elpXNWtLR1JoZEdFcE8xeHVJQ0I5S1R0Y2JuMWNibHh1Wm5WdVkzUnBiMjRnWVhCd1pXNWtSMjl2WjJ4bFEyRndkR05vWVNoMFpXMXdiR0YwWlZCeVlXMXpQem9nVDJKcVpXTjBLVG9nVDJKcVpXTjBJSHRjYmlBZ2JHVjBJR1ZzWlcxbGJuUTZJRWhVVFV4SmJuQjFkRVZzWlcxbGJuUWdQU0E4U0ZSTlRFbHVjSFYwUld4bGJXVnVkRDVrYjJOMWJXVnVkQzVuWlhSRmJHVnRaVzUwUW5sSlpDZ25aeTF5WldOaGNIUmphR0V0Y21WemNHOXVjMlVuS1R0Y2JseHVJQ0JwWmlBb1pXeGxiV1Z1ZENBbUppQmxiR1Z0Wlc1MExuWmhiSFZsS1NCN1hHNGdJQ0FnZEdWdGNHeGhkR1ZRY21GdGMxc25aeTF5WldOaGNIUmphR0V0Y21WemNHOXVjMlVuWFNBOUlHVnNaVzFsYm5RdWRtRnNkV1U3WEc0Z0lIMWNibHh1SUNCbGJHVnRaVzUwSUQwZ2JuVnNiRHRjYmlBZ2NtVjBkWEp1SUhSbGJYQnNZWFJsVUhKaGJYTTdYRzU5WEc1Y2JpOHFLbHh1SUNvZ1NXNXBkR2xoZEdsdmJseHVJQ29nUUhCaGNtRnRJSHR6ZEhKcGJtZDlJSFZ6WlhKSlJDQXRJSE5sZENCMGFHVWdSVzFoYVd4S1V5QjFjMlZ5SUVsRVhHNGdLaUJBY0dGeVlXMGdlM04wY21sdVozMGdiM0pwWjJsdUlDMGdjMlYwSUhSb1pTQkZiV0ZwYkVwVElHOXlhV2RwYmx4dUlDb3ZYRzVsZUhCdmNuUWdablZ1WTNScGIyNGdhVzVwZENoMWMyVnlTVVE2SUhOMGNtbHVaeXdnYjNKcFoybHVQem9nYzNSeWFXNW5LVG9nZG05cFpDQjdYRzRnSUY5MWMyVnlTVVFnUFNCMWMyVnlTVVE3WEc0Z0lGOXZjbWxuYVc0Z1BTQnZjbWxuYVc0Z2ZId2dKMmgwZEhCek9pOHZZWEJwTG1WdFlXbHNhbk11WTI5dEp6dGNibjFjYmx4dUx5b3FYRzRnS2lCVFpXNWtJR0VnZEdWdGNHeGhkR1VnZEc4Z2RHaGxJSE53WldOcFptbGpJRVZ0WVdsc1NsTWdjMlZ5ZG1salpWeHVJQ29nUUhCaGNtRnRJSHR6ZEhKcGJtZDlJSE5sY25acFkyVkpSQ0F0SUhSb1pTQkZiV0ZwYkVwVElITmxjblpwWTJVZ1NVUmNiaUFxSUVCd1lYSmhiU0I3YzNSeWFXNW5mU0IwWlcxd2JHRjBaVWxFSUMwZ2RHaGxJRVZ0WVdsc1NsTWdkR1Z0Y0d4aGRHVWdTVVJjYmlBcUlFQndZWEpoYlNCN1QySnFaV04wZlNCMFpXMXdiR0YwWlZCeVlXMXpJQzBnZEdobElIUmxiWEJzWVhSbElIQmhjbUZ0Y3l3Z2QyaGhkQ0IzYVd4c0lHSmxJSE5sZENCMGJ5QjBhR1VnUlcxaGFXeEtVeUIwWlcxd2JHRjBaVnh1SUNvZ1FIQmhjbUZ0SUh0emRISnBibWQ5SUhWelpYSkpSQ0F0SUhSb1pTQkZiV0ZwYkVwVElIVnpaWElnU1VSY2JpQXFJRUJ5WlhSMWNtNXpJSHRRY205dGFYTmxQRVZ0WVdsc1NsTlNaWE53YjI1elpWTjBZWFIxY3o1OVhHNGdLaTljYm1WNGNHOXlkQ0JtZFc1amRHbHZiaUJ6Wlc1a0tITmxjblpwWTJWSlJEb2djM1J5YVc1bkxDQjBaVzF3YkdGMFpVbEVPaUJ6ZEhKcGJtY3NJSFJsYlhCc1lYUmxVSEpoYlhNL09pQlBZbXBsWTNRc0lIVnpaWEpKUkQ4NklITjBjbWx1WnlrNklGQnliMjFwYzJVOFJXMWhhV3hLVTFKbGMzQnZibk5sVTNSaGRIVnpQaUI3WEc0Z0lHeGxkQ0J3WVhKaGJYTTZJRTlpYW1WamRDQTlJSHRjYmlBZ0lDQnNhV0pmZG1WeWMybHZiam9nSnp3OFZrVlNVMGxQVGo0K0p5eGNiaUFnSUNCMWMyVnlYMmxrT2lCMWMyVnlTVVFnZkh3Z1gzVnpaWEpKUkN4Y2JpQWdJQ0J6WlhKMmFXTmxYMmxrT2lCelpYSjJhV05sU1VRc1hHNGdJQ0FnZEdWdGNHeGhkR1ZmYVdRNklIUmxiWEJzWVhSbFNVUXNYRzRnSUNBZ2RHVnRjR3hoZEdWZmNHRnlZVzF6T2lCMFpXMXdiR0YwWlZCeVlXMXpYRzRnSUgwN1hHNWNiaUFnYVdZb2RIbHdaVzltS0dSdlkzVnRaVzUwS1NBaFBUMGdKM1Z1WkdWbWFXNWxaQ2NwSUh0Y2JpQWdJQ0FnSUNBZ2NHRnlZVzF6VzF3aWRHVnRjR3hoZEdWZmNHRnlZVzF6WENKZElEMGdZWEJ3Wlc1a1IyOXZaMnhsUTJGd2RHTm9ZU2gwWlcxd2JHRjBaVkJ5WVcxektUdGNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQnpaVzVrVUc5emRDaGZiM0pwWjJsdUlDc2dKeTloY0drdmRqRXVNQzlsYldGcGJDOXpaVzVrSnl3Z1NsTlBUaTV6ZEhKcGJtZHBabmtvY0dGeVlXMXpLU3dnZTF4dUlDQWdJQ2REYjI1MFpXNTBMWFI1Y0dVbk9pQW5ZWEJ3YkdsallYUnBiMjR2YW5OdmJpZGNiaUFnZlNrN1hHNTlYRzVjYmk4cUtseHVJQ29nVTJWdVpDQmhJR1p2Y20wZ2RHaGxJSE53WldOcFptbGpJRVZ0WVdsc1NsTWdjMlZ5ZG1salpWeHVJQ29nUUhCaGNtRnRJSHR6ZEhKcGJtZDlJSE5sY25acFkyVkpSQ0F0SUhSb1pTQkZiV0ZwYkVwVElITmxjblpwWTJVZ1NVUmNiaUFxSUVCd1lYSmhiU0I3YzNSeWFXNW5mU0IwWlcxd2JHRjBaVWxFSUMwZ2RHaGxJRVZ0WVdsc1NsTWdkR1Z0Y0d4aGRHVWdTVVJjYmlBcUlFQndZWEpoYlNCN2MzUnlhVzVuSUh3Z1NGUk5URVp2Y20xRmJHVnRaVzUwZlNCbWIzSnRJQzBnZEdobElHWnZjbTBnWld4bGJXVnVkQ0J2Y2lCelpXeGxZM1J2Y2x4dUlDb2dRSEJoY21GdElIdHpkSEpwYm1kOUlIVnpaWEpKUkNBdElIUm9aU0JGYldGcGJFcFRJSFZ6WlhJZ1NVUmNiaUFxSUVCeVpYUjFjbTV6SUh0UWNtOXRhWE5sUEVWdFlXbHNTbE5TWlhOd2IyNXpaVk4wWVhSMWN6NTlYRzRnS2k5Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCelpXNWtSbTl5YlNoelpYSjJhV05sU1VRNklITjBjbWx1Wnl3Z2RHVnRjR3hoZEdWSlJEb2djM1J5YVc1bkxDQm1iM0p0T2lCemRISnBibWNnZkNCSVZFMU1SbTl5YlVWc1pXMWxiblFzSUhWelpYSkpSRDg2SUhOMGNtbHVaeWs2SUZCeWIyMXBjMlU4UlcxaGFXeEtVMUpsYzNCdmJuTmxVM1JoZEhWelBpQjdYRzRnSUdsbUlDaDBlWEJsYjJZZ1ptOXliU0E5UFQwZ0ozTjBjbWx1WnljcElIdGNiaUFnSUNCbWIzSnRJRDBnUEVoVVRVeEdiM0p0Uld4bGJXVnVkRDVrYjJOMWJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtHWnZjbTBwTzF4dUlDQjlYRzVjYmlBZ2FXWWdLQ0ZtYjNKdElIeDhJR1p2Y20wdWJtOWtaVTVoYldVZ0lUMDlJQ2RHVDFKTkp5a2dlMXh1SUNBZ0lIUm9jbTkzSUNkRmVIQmxZM1JsWkNCMGFHVWdTRlJOVENCbWIzSnRJR1ZzWlcxbGJuUWdiM0lnZEdobElITjBlV3hsSUhObGJHVmpkRzl5SUc5bUlHWnZjbTBuTzF4dUlDQjlYRzVjYmlBZ1ZVa3VjSEp2WjNKbGMzTlRkR0YwWlNobWIzSnRLVHRjYmlBZ2JHVjBJR1p2Y20xRVlYUmhPaUJHYjNKdFJHRjBZU0E5SUc1bGR5QkdiM0p0UkdGMFlTaG1iM0p0S1R0Y2JpQWdabTl5YlVSaGRHRXVZWEJ3Wlc1a0tDZHNhV0pmZG1WeWMybHZiaWNzSUNjOFBGWkZVbE5KVDA0K1BpY3BPMXh1SUNCbWIzSnRSR0YwWVM1aGNIQmxibVFvSjNObGNuWnBZMlZmYVdRbkxDQnpaWEoyYVdObFNVUXBPMXh1SUNCbWIzSnRSR0YwWVM1aGNIQmxibVFvSjNSbGJYQnNZWFJsWDJsa0p5d2dkR1Z0Y0d4aGRHVkpSQ2s3WEc0Z0lHWnZjbTFFWVhSaExtRndjR1Z1WkNnbmRYTmxjbDlwWkNjc0lIVnpaWEpKUkNCOGZDQmZkWE5sY2tsRUtUdGNibHh1SUNCeVpYUjFjbTRnYzJWdVpGQnZjM1FvWDI5eWFXZHBiaUFySUNjdllYQnBMM1l4TGpBdlpXMWhhV3d2YzJWdVpDMW1iM0p0Snl3Z1ptOXliVVJoZEdFcFhHNGdJQ0FnTG5Sb1pXNG9LSEpsYzNCdmJuTmxLU0E5UGlCN1hHNGdJQ0FnSUNCVlNTNXpkV05qWlhOelUzUmhkR1VvUEVoVVRVeEdiM0p0Uld4bGJXVnVkRDVtYjNKdEtUdGNiaUFnSUNBZ0lISmxkSFZ5YmlCeVpYTndiMjV6WlR0Y2JpQWdJQ0I5TENBb1pYSnliM0lwSUQwK0lIdGNiaUFnSUNBZ0lGVkpMbVZ5Y205eVUzUmhkR1VvUEVoVVRVeEdiM0p0Uld4bGJXVnVkRDVtYjNKdEtUdGNiaUFnSUNBZ0lISmxkSFZ5YmlCUWNtOXRhWE5sTG5KbGFtVmpkQ2hsY25KdmNpazdYRzRnSUNBZ2ZTazdYRzU5WEc1Y2JtVjRjRzl5ZENCN1JXMWhhV3hLVTFKbGMzQnZibk5sVTNSaGRIVnpmVHRjYmx4dVpYaHdiM0owSUdSbFptRjFiSFFnZTF4dUlDQnBibWwwTEZ4dUlDQnpaVzVrTEZ4dUlDQnpaVzVrUm05eWJWeHVmVHRjYmlJc0ltVjRjRzl5ZENCamJHRnpjeUJGYldGcGJFcFRVbVZ6Y0c5dWMyVlRkR0YwZFhNZ2UxeHVYRzRnSUhCMVlteHBZeUJ6ZEdGMGRYTTZJRzUxYldKbGNqdGNiaUFnY0hWaWJHbGpJSFJsZUhRNklITjBjbWx1Wnp0Y2JseHVJQ0JqYjI1emRISjFZM1J2Y2lob2RIUndVbVZ6Y0c5dWMyVTZJRmhOVEVoMGRIQlNaWEYxWlhOMEtTQjdYRzRnSUNBZ2RHaHBjeTV6ZEdGMGRYTWdQU0JvZEhSd1VtVnpjRzl1YzJVdWMzUmhkSFZ6TzF4dUlDQWdJSFJvYVhNdWRHVjRkQ0E5SUdoMGRIQlNaWE53YjI1elpTNXlaWE53YjI1elpWUmxlSFE3WEc0Z0lIMWNibjFjYmlJc0ltVjRjRzl5ZENCamJHRnpjeUJWU1NCN1hHNWNiaUFnY0hKcGRtRjBaU0J6ZEdGMGFXTWdjbVZoWkc5dWJIa2dVRkpQUjFKRlUxTTZJSE4wY21sdVp5QTlJQ2RsYldGcGJHcHpMWE5sYm1ScGJtY25PMXh1SUNCd2NtbDJZWFJsSUhOMFlYUnBZeUJ5WldGa2IyNXNlU0JFVDA1Rk9pQnpkSEpwYm1jZ1BTQW5aVzFoYVd4cWN5MXpkV05qWlhOekp6dGNiaUFnY0hKcGRtRjBaU0J6ZEdGMGFXTWdjbVZoWkc5dWJIa2dSVkpTVDFJNklITjBjbWx1WnlBOUlDZGxiV0ZwYkdwekxXVnljbTl5Snp0Y2JseHVJQ0J3ZFdKc2FXTWdjM1JoZEdsaklHTnNaV0Z5UVd4c0tHWnZjbTA2SUVoVVRVeEdiM0p0Uld4bGJXVnVkQ2s2SUhadmFXUWdlMXh1SUNBZ0lHWnZjbTB1WTJ4aGMzTk1hWE4wTG5KbGJXOTJaU2gwYUdsekxsQlNUMGRTUlZOVEtUdGNiaUFnSUNCbWIzSnRMbU5zWVhOelRHbHpkQzV5WlcxdmRtVW9kR2hwY3k1RVQwNUZLVHRjYmlBZ0lDQm1iM0p0TG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvZEdocGN5NUZVbEpQVWlrN1hHNGdJSDFjYmx4dUlDQndkV0pzYVdNZ2MzUmhkR2xqSUhCeWIyZHlaWE56VTNSaGRHVW9abTl5YlRvZ1NGUk5URVp2Y20xRmJHVnRaVzUwS1RvZ2RtOXBaQ0I3WEc0Z0lDQWdkR2hwY3k1amJHVmhja0ZzYkNobWIzSnRLVHRjYmlBZ0lDQm1iM0p0TG1Oc1lYTnpUR2x6ZEM1aFpHUW9kR2hwY3k1UVVrOUhVa1ZUVXlrN1hHNGdJSDFjYmx4dUlDQndkV0pzYVdNZ2MzUmhkR2xqSUhOMVkyTmxjM05UZEdGMFpTaG1iM0p0T2lCSVZFMU1SbTl5YlVWc1pXMWxiblFwT2lCMmIybGtJSHRjYmlBZ0lDQm1iM0p0TG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvZEdocGN5NVFVazlIVWtWVFV5azdYRzRnSUNBZ1ptOXliUzVqYkdGemMweHBjM1F1WVdSa0tIUm9hWE11UkU5T1JTazdYRzRnSUgxY2JseHVJQ0J3ZFdKc2FXTWdjM1JoZEdsaklHVnljbTl5VTNSaGRHVW9abTl5YlRvZ1NGUk5URVp2Y20xRmJHVnRaVzUwS1RvZ2RtOXBaQ0I3WEc0Z0lDQWdabTl5YlM1amJHRnpjMHhwYzNRdWNtVnRiM1psS0hSb2FYTXVVRkpQUjFKRlUxTXBPMXh1SUNBZ0lHWnZjbTB1WTJ4aGMzTk1hWE4wTG1Ga1pDaDBhR2x6TGtWU1VrOVNLVHRjYmlBZ2ZWeHVYRzU5WEc0aVhYMD0ifQ==
