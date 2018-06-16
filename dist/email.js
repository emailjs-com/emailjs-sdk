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
(function (setImmediate){
'use strict';

var promiseFinally = function(callback) {
  var constructor = this.constructor;
  return this.then(
    function(value) {
      return constructor.resolve(callback()).then(function() {
        return value;
      });
    },
    function(reason) {
      return constructor.resolve(callback()).then(function() {
        return constructor.reject(reason);
      });
    }
  );
};

// Store setTimeout reference so promise-polyfill will be unaffected by
// other code modifying setTimeout (like sinon.useFakeTimers())
var setTimeoutFunc = setTimeout;

function noop() {}

// Polyfill for Function.prototype.bind
function bind(fn, thisArg) {
  return function() {
    fn.apply(thisArg, arguments);
  };
}

function Promise(fn) {
  if (!(this instanceof Promise))
    throw new TypeError('Promises must be constructed via new');
  if (typeof fn !== 'function') throw new TypeError('not a function');
  this._state = 0;
  this._handled = false;
  this._value = undefined;
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
  var prom = new this.constructor(noop);

  handle(this, new Handler(onFulfilled, onRejected, prom));
  return prom;
};

Promise.prototype['finally'] = promiseFinally;

Promise.all = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!arr || typeof arr.length === 'undefined')
      throw new TypeError('Promise.all accepts an array');
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

Promise.race = function(values) {
  return new Promise(function(resolve, reject) {
    for (var i = 0, len = values.length; i < len; i++) {
      values[i].then(resolve, reject);
    }
  });
};

// Use polyfill for setImmediate for performance gains
Promise._immediateFn =
  (typeof setImmediate === 'function' &&
    function(fn) {
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

module.exports = Promise;

}).call(this,require("timers").setImmediate)

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
var Promise = require("promise-polyfill");
var EmailJSResponseStatus_1 = require("./models/EmailJSResponseStatus");
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
        lib_version: '2.2.0',
        user_id: userID || _userID,
        service_id: serviceID,
        template_id: templateID,
        template_params: appendGoogleCaptcha(templatePrams)
    };
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
    formData.append('lib_version', '2.2.0');
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

},{"./models/EmailJSResponseStatus":5,"./services/ui/UI":6,"promise-polyfill":2}],5:[function(require,module,exports){
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

},{}]},{},[4])(4)
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3Byb21pc2UtcG9seWZpbGwvbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RpbWVycy1icm93c2VyaWZ5L21haW4uanMiLCJzcmMvaW5kZXgudHMiLCJzcmMvbW9kZWxzL0VtYWlsSlNSZXNwb25zZVN0YXR1cy50cyIsInNyYy9zZXJ2aWNlcy91aS9VSS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3BQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QkQsQUEyQkMsSUFBQTtBQTNCWSxnQkFBRSIsImZpbGUiOiJlbWFpbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcHJvbWlzZUZpbmFsbHkgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICB2YXIgY29uc3RydWN0b3IgPSB0aGlzLmNvbnN0cnVjdG9yO1xuICByZXR1cm4gdGhpcy50aGVuKFxuICAgIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gY29uc3RydWN0b3IucmVzb2x2ZShjYWxsYmFjaygpKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yLnJlc29sdmUoY2FsbGJhY2soKSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yLnJlamVjdChyZWFzb24pO1xuICAgICAgfSk7XG4gICAgfVxuICApO1xufTtcblxuLy8gU3RvcmUgc2V0VGltZW91dCByZWZlcmVuY2Ugc28gcHJvbWlzZS1wb2x5ZmlsbCB3aWxsIGJlIHVuYWZmZWN0ZWQgYnlcbi8vIG90aGVyIGNvZGUgbW9kaWZ5aW5nIHNldFRpbWVvdXQgKGxpa2Ugc2lub24udXNlRmFrZVRpbWVycygpKVxudmFyIHNldFRpbWVvdXRGdW5jID0gc2V0VGltZW91dDtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbi8vIFBvbHlmaWxsIGZvciBGdW5jdGlvbi5wcm90b3R5cGUuYmluZFxuZnVuY3Rpb24gYmluZChmbiwgdGhpc0FyZykge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgZm4uYXBwbHkodGhpc0FyZywgYXJndW1lbnRzKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gUHJvbWlzZShmbikge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgUHJvbWlzZSkpXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUHJvbWlzZXMgbXVzdCBiZSBjb25zdHJ1Y3RlZCB2aWEgbmV3Jyk7XG4gIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHRocm93IG5ldyBUeXBlRXJyb3IoJ25vdCBhIGZ1bmN0aW9uJyk7XG4gIHRoaXMuX3N0YXRlID0gMDtcbiAgdGhpcy5faGFuZGxlZCA9IGZhbHNlO1xuICB0aGlzLl92YWx1ZSA9IHVuZGVmaW5lZDtcbiAgdGhpcy5fZGVmZXJyZWRzID0gW107XG5cbiAgZG9SZXNvbHZlKGZuLCB0aGlzKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlKHNlbGYsIGRlZmVycmVkKSB7XG4gIHdoaWxlIChzZWxmLl9zdGF0ZSA9PT0gMykge1xuICAgIHNlbGYgPSBzZWxmLl92YWx1ZTtcbiAgfVxuICBpZiAoc2VsZi5fc3RhdGUgPT09IDApIHtcbiAgICBzZWxmLl9kZWZlcnJlZHMucHVzaChkZWZlcnJlZCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIHNlbGYuX2hhbmRsZWQgPSB0cnVlO1xuICBQcm9taXNlLl9pbW1lZGlhdGVGbihmdW5jdGlvbigpIHtcbiAgICB2YXIgY2IgPSBzZWxmLl9zdGF0ZSA9PT0gMSA/IGRlZmVycmVkLm9uRnVsZmlsbGVkIDogZGVmZXJyZWQub25SZWplY3RlZDtcbiAgICBpZiAoY2IgPT09IG51bGwpIHtcbiAgICAgIChzZWxmLl9zdGF0ZSA9PT0gMSA/IHJlc29sdmUgOiByZWplY3QpKGRlZmVycmVkLnByb21pc2UsIHNlbGYuX3ZhbHVlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHJldDtcbiAgICB0cnkge1xuICAgICAgcmV0ID0gY2Ioc2VsZi5fdmFsdWUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJlamVjdChkZWZlcnJlZC5wcm9taXNlLCBlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmVzb2x2ZShkZWZlcnJlZC5wcm9taXNlLCByZXQpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZShzZWxmLCBuZXdWYWx1ZSkge1xuICB0cnkge1xuICAgIC8vIFByb21pc2UgUmVzb2x1dGlvbiBQcm9jZWR1cmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9wcm9taXNlcy1hcGx1cy9wcm9taXNlcy1zcGVjI3RoZS1wcm9taXNlLXJlc29sdXRpb24tcHJvY2VkdXJlXG4gICAgaWYgKG5ld1ZhbHVlID09PSBzZWxmKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQSBwcm9taXNlIGNhbm5vdCBiZSByZXNvbHZlZCB3aXRoIGl0c2VsZi4nKTtcbiAgICBpZiAoXG4gICAgICBuZXdWYWx1ZSAmJlxuICAgICAgKHR5cGVvZiBuZXdWYWx1ZSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIG5ld1ZhbHVlID09PSAnZnVuY3Rpb24nKVxuICAgICkge1xuICAgICAgdmFyIHRoZW4gPSBuZXdWYWx1ZS50aGVuO1xuICAgICAgaWYgKG5ld1ZhbHVlIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICBzZWxmLl9zdGF0ZSA9IDM7XG4gICAgICAgIHNlbGYuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgIGZpbmFsZShzZWxmKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBkb1Jlc29sdmUoYmluZCh0aGVuLCBuZXdWYWx1ZSksIHNlbGYpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIHNlbGYuX3N0YXRlID0gMTtcbiAgICBzZWxmLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGZpbmFsZShzZWxmKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJlamVjdChzZWxmLCBlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZWplY3Qoc2VsZiwgbmV3VmFsdWUpIHtcbiAgc2VsZi5fc3RhdGUgPSAyO1xuICBzZWxmLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICBmaW5hbGUoc2VsZik7XG59XG5cbmZ1bmN0aW9uIGZpbmFsZShzZWxmKSB7XG4gIGlmIChzZWxmLl9zdGF0ZSA9PT0gMiAmJiBzZWxmLl9kZWZlcnJlZHMubGVuZ3RoID09PSAwKSB7XG4gICAgUHJvbWlzZS5faW1tZWRpYXRlRm4oZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIXNlbGYuX2hhbmRsZWQpIHtcbiAgICAgICAgUHJvbWlzZS5fdW5oYW5kbGVkUmVqZWN0aW9uRm4oc2VsZi5fdmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHNlbGYuX2RlZmVycmVkcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGhhbmRsZShzZWxmLCBzZWxmLl9kZWZlcnJlZHNbaV0pO1xuICB9XG4gIHNlbGYuX2RlZmVycmVkcyA9IG51bGw7XG59XG5cbmZ1bmN0aW9uIEhhbmRsZXIob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQsIHByb21pc2UpIHtcbiAgdGhpcy5vbkZ1bGZpbGxlZCA9IHR5cGVvZiBvbkZ1bGZpbGxlZCA9PT0gJ2Z1bmN0aW9uJyA/IG9uRnVsZmlsbGVkIDogbnVsbDtcbiAgdGhpcy5vblJlamVjdGVkID0gdHlwZW9mIG9uUmVqZWN0ZWQgPT09ICdmdW5jdGlvbicgPyBvblJlamVjdGVkIDogbnVsbDtcbiAgdGhpcy5wcm9taXNlID0gcHJvbWlzZTtcbn1cblxuLyoqXG4gKiBUYWtlIGEgcG90ZW50aWFsbHkgbWlzYmVoYXZpbmcgcmVzb2x2ZXIgZnVuY3Rpb24gYW5kIG1ha2Ugc3VyZVxuICogb25GdWxmaWxsZWQgYW5kIG9uUmVqZWN0ZWQgYXJlIG9ubHkgY2FsbGVkIG9uY2UuXG4gKlxuICogTWFrZXMgbm8gZ3VhcmFudGVlcyBhYm91dCBhc3luY2hyb255LlxuICovXG5mdW5jdGlvbiBkb1Jlc29sdmUoZm4sIHNlbGYpIHtcbiAgdmFyIGRvbmUgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICBmbihcbiAgICAgIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIGlmIChkb25lKSByZXR1cm47XG4gICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICByZXNvbHZlKHNlbGYsIHZhbHVlKTtcbiAgICAgIH0sXG4gICAgICBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgaWYgKGRvbmUpIHJldHVybjtcbiAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgIHJlamVjdChzZWxmLCByZWFzb24pO1xuICAgICAgfVxuICAgICk7XG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgaWYgKGRvbmUpIHJldHVybjtcbiAgICBkb25lID0gdHJ1ZTtcbiAgICByZWplY3Qoc2VsZiwgZXgpO1xuICB9XG59XG5cblByb21pc2UucHJvdG90eXBlWydjYXRjaCddID0gZnVuY3Rpb24ob25SZWplY3RlZCkge1xuICByZXR1cm4gdGhpcy50aGVuKG51bGwsIG9uUmVqZWN0ZWQpO1xufTtcblxuUHJvbWlzZS5wcm90b3R5cGUudGhlbiA9IGZ1bmN0aW9uKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSB7XG4gIHZhciBwcm9tID0gbmV3IHRoaXMuY29uc3RydWN0b3Iobm9vcCk7XG5cbiAgaGFuZGxlKHRoaXMsIG5ldyBIYW5kbGVyKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkLCBwcm9tKSk7XG4gIHJldHVybiBwcm9tO1xufTtcblxuUHJvbWlzZS5wcm90b3R5cGVbJ2ZpbmFsbHknXSA9IHByb21pc2VGaW5hbGx5O1xuXG5Qcm9taXNlLmFsbCA9IGZ1bmN0aW9uKGFycikge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgaWYgKCFhcnIgfHwgdHlwZW9mIGFyci5sZW5ndGggPT09ICd1bmRlZmluZWQnKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUHJvbWlzZS5hbGwgYWNjZXB0cyBhbiBhcnJheScpO1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJyKTtcbiAgICBpZiAoYXJncy5sZW5ndGggPT09IDApIHJldHVybiByZXNvbHZlKFtdKTtcbiAgICB2YXIgcmVtYWluaW5nID0gYXJncy5sZW5ndGg7XG5cbiAgICBmdW5jdGlvbiByZXMoaSwgdmFsKSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAodmFsICYmICh0eXBlb2YgdmFsID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgdmFsID09PSAnZnVuY3Rpb24nKSkge1xuICAgICAgICAgIHZhciB0aGVuID0gdmFsLnRoZW47XG4gICAgICAgICAgaWYgKHR5cGVvZiB0aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGVuLmNhbGwoXG4gICAgICAgICAgICAgIHZhbCxcbiAgICAgICAgICAgICAgZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICAgICAgcmVzKGksIHZhbCk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHJlamVjdFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYXJnc1tpXSA9IHZhbDtcbiAgICAgICAgaWYgKC0tcmVtYWluaW5nID09PSAwKSB7XG4gICAgICAgICAgcmVzb2x2ZShhcmdzKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgcmVqZWN0KGV4KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlcyhpLCBhcmdzW2ldKTtcbiAgICB9XG4gIH0pO1xufTtcblxuUHJvbWlzZS5yZXNvbHZlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUuY29uc3RydWN0b3IgPT09IFByb21pc2UpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgIHJlc29sdmUodmFsdWUpO1xuICB9KTtcbn07XG5cblByb21pc2UucmVqZWN0ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHJlamVjdCh2YWx1ZSk7XG4gIH0pO1xufTtcblxuUHJvbWlzZS5yYWNlID0gZnVuY3Rpb24odmFsdWVzKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdmFsdWVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB2YWx1ZXNbaV0udGhlbihyZXNvbHZlLCByZWplY3QpO1xuICAgIH1cbiAgfSk7XG59O1xuXG4vLyBVc2UgcG9seWZpbGwgZm9yIHNldEltbWVkaWF0ZSBmb3IgcGVyZm9ybWFuY2UgZ2FpbnNcblByb21pc2UuX2ltbWVkaWF0ZUZuID1cbiAgKHR5cGVvZiBzZXRJbW1lZGlhdGUgPT09ICdmdW5jdGlvbicgJiZcbiAgICBmdW5jdGlvbihmbikge1xuICAgICAgc2V0SW1tZWRpYXRlKGZuKTtcbiAgICB9KSB8fFxuICBmdW5jdGlvbihmbikge1xuICAgIHNldFRpbWVvdXRGdW5jKGZuLCAwKTtcbiAgfTtcblxuUHJvbWlzZS5fdW5oYW5kbGVkUmVqZWN0aW9uRm4gPSBmdW5jdGlvbiBfdW5oYW5kbGVkUmVqZWN0aW9uRm4oZXJyKSB7XG4gIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZSkge1xuICAgIGNvbnNvbGUud2FybignUG9zc2libGUgVW5oYW5kbGVkIFByb21pc2UgUmVqZWN0aW9uOicsIGVycik7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb21pc2U7XG4iLCJ2YXIgbmV4dFRpY2sgPSByZXF1aXJlKCdwcm9jZXNzL2Jyb3dzZXIuanMnKS5uZXh0VGljaztcbnZhciBhcHBseSA9IEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseTtcbnZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcbnZhciBpbW1lZGlhdGVJZHMgPSB7fTtcbnZhciBuZXh0SW1tZWRpYXRlSWQgPSAwO1xuXG4vLyBET00gQVBJcywgZm9yIGNvbXBsZXRlbmVzc1xuXG5leHBvcnRzLnNldFRpbWVvdXQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBUaW1lb3V0KGFwcGx5LmNhbGwoc2V0VGltZW91dCwgd2luZG93LCBhcmd1bWVudHMpLCBjbGVhclRpbWVvdXQpO1xufTtcbmV4cG9ydHMuc2V0SW50ZXJ2YWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBUaW1lb3V0KGFwcGx5LmNhbGwoc2V0SW50ZXJ2YWwsIHdpbmRvdywgYXJndW1lbnRzKSwgY2xlYXJJbnRlcnZhbCk7XG59O1xuZXhwb3J0cy5jbGVhclRpbWVvdXQgPVxuZXhwb3J0cy5jbGVhckludGVydmFsID0gZnVuY3Rpb24odGltZW91dCkgeyB0aW1lb3V0LmNsb3NlKCk7IH07XG5cbmZ1bmN0aW9uIFRpbWVvdXQoaWQsIGNsZWFyRm4pIHtcbiAgdGhpcy5faWQgPSBpZDtcbiAgdGhpcy5fY2xlYXJGbiA9IGNsZWFyRm47XG59XG5UaW1lb3V0LnByb3RvdHlwZS51bnJlZiA9IFRpbWVvdXQucHJvdG90eXBlLnJlZiA9IGZ1bmN0aW9uKCkge307XG5UaW1lb3V0LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9jbGVhckZuLmNhbGwod2luZG93LCB0aGlzLl9pZCk7XG59O1xuXG4vLyBEb2VzIG5vdCBzdGFydCB0aGUgdGltZSwganVzdCBzZXRzIHVwIHRoZSBtZW1iZXJzIG5lZWRlZC5cbmV4cG9ydHMuZW5yb2xsID0gZnVuY3Rpb24oaXRlbSwgbXNlY3MpIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuICBpdGVtLl9pZGxlVGltZW91dCA9IG1zZWNzO1xufTtcblxuZXhwb3J0cy51bmVucm9sbCA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuICBpdGVtLl9pZGxlVGltZW91dCA9IC0xO1xufTtcblxuZXhwb3J0cy5fdW5yZWZBY3RpdmUgPSBleHBvcnRzLmFjdGl2ZSA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuXG4gIHZhciBtc2VjcyA9IGl0ZW0uX2lkbGVUaW1lb3V0O1xuICBpZiAobXNlY3MgPj0gMCkge1xuICAgIGl0ZW0uX2lkbGVUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uIG9uVGltZW91dCgpIHtcbiAgICAgIGlmIChpdGVtLl9vblRpbWVvdXQpXG4gICAgICAgIGl0ZW0uX29uVGltZW91dCgpO1xuICAgIH0sIG1zZWNzKTtcbiAgfVxufTtcblxuLy8gVGhhdCdzIG5vdCBob3cgbm9kZS5qcyBpbXBsZW1lbnRzIGl0IGJ1dCB0aGUgZXhwb3NlZCBhcGkgaXMgdGhlIHNhbWUuXG5leHBvcnRzLnNldEltbWVkaWF0ZSA9IHR5cGVvZiBzZXRJbW1lZGlhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHNldEltbWVkaWF0ZSA6IGZ1bmN0aW9uKGZuKSB7XG4gIHZhciBpZCA9IG5leHRJbW1lZGlhdGVJZCsrO1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cy5sZW5ndGggPCAyID8gZmFsc2UgOiBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cbiAgaW1tZWRpYXRlSWRzW2lkXSA9IHRydWU7XG5cbiAgbmV4dFRpY2soZnVuY3Rpb24gb25OZXh0VGljaygpIHtcbiAgICBpZiAoaW1tZWRpYXRlSWRzW2lkXSkge1xuICAgICAgLy8gZm4uY2FsbCgpIGlzIGZhc3RlciBzbyB3ZSBvcHRpbWl6ZSBmb3IgdGhlIGNvbW1vbiB1c2UtY2FzZVxuICAgICAgLy8gQHNlZSBodHRwOi8vanNwZXJmLmNvbS9jYWxsLWFwcGx5LXNlZ3VcbiAgICAgIGlmIChhcmdzKSB7XG4gICAgICAgIGZuLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm4uY2FsbChudWxsKTtcbiAgICAgIH1cbiAgICAgIC8vIFByZXZlbnQgaWRzIGZyb20gbGVha2luZ1xuICAgICAgZXhwb3J0cy5jbGVhckltbWVkaWF0ZShpZCk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gaWQ7XG59O1xuXG5leHBvcnRzLmNsZWFySW1tZWRpYXRlID0gdHlwZW9mIGNsZWFySW1tZWRpYXRlID09PSBcImZ1bmN0aW9uXCIgPyBjbGVhckltbWVkaWF0ZSA6IGZ1bmN0aW9uKGlkKSB7XG4gIGRlbGV0ZSBpbW1lZGlhdGVJZHNbaWRdO1xufTsiLCJpbXBvcnQgKiBhcyBQcm9taXNlIGZyb20gJ3Byb21pc2UtcG9seWZpbGwnO1xyXG5pbXBvcnQge0VtYWlsSlNSZXNwb25zZVN0YXR1c30gZnJvbSAnLi9tb2RlbHMvRW1haWxKU1Jlc3BvbnNlU3RhdHVzJztcclxuaW1wb3J0IHtVSX0gZnJvbSAnLi9zZXJ2aWNlcy91aS9VSSc7XHJcblxyXG5sZXQgX3VzZXJJRDogc3RyaW5nID0gbnVsbDtcclxubGV0IF9vcmlnaW46IHN0cmluZyA9ICdodHRwczovL2FwaS5lbWFpbGpzLmNvbSc7XHJcblxyXG5mdW5jdGlvbiBzZW5kUG9zdCh1cmw6IHN0cmluZywgZGF0YTogc3RyaW5nIHwgRm9ybURhdGEsIGhlYWRlcnM6IE9iamVjdCA9IHt9KTogUHJvbWlzZTxFbWFpbEpTUmVzcG9uc2VTdGF0dXM+IHtcclxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgbGV0IHhocjogWE1MSHR0cFJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHJcbiAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChldmVudCkgPT4ge1xyXG4gICAgICBsZXQgcmVzcG9uc2VTdGF0dXM6IEVtYWlsSlNSZXNwb25zZVN0YXR1cyA9IG5ldyBFbWFpbEpTUmVzcG9uc2VTdGF0dXMoPFhNTEh0dHBSZXF1ZXN0PmV2ZW50LnRhcmdldCk7XHJcbiAgICAgIGlmIChyZXNwb25zZVN0YXR1cy5zdGF0dXMgPT09IDIwMCB8fCByZXNwb25zZVN0YXR1cy50ZXh0ID09PSAnT0snKSB7XHJcbiAgICAgICAgcmVzb2x2ZShyZXNwb25zZVN0YXR1cyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVqZWN0KHJlc3BvbnNlU3RhdHVzKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKGV2ZW50KSA9PiB7XHJcbiAgICAgIHJlamVjdChuZXcgRW1haWxKU1Jlc3BvbnNlU3RhdHVzKDxYTUxIdHRwUmVxdWVzdD5ldmVudC50YXJnZXQpKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHhoci5vcGVuKCdQT1NUJywgdXJsLCB0cnVlKTtcclxuXHJcbiAgICBmb3IgKGxldCBrZXkgaW4gaGVhZGVycykge1xyXG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgaGVhZGVyc1trZXldKTtcclxuICAgIH1cclxuXHJcbiAgICB4aHIuc2VuZChkYXRhKTtcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gYXBwZW5kR29vZ2xlQ2FwdGNoYSh0ZW1wbGF0ZVByYW1zPzogT2JqZWN0KTogT2JqZWN0IHtcclxuICBsZXQgZWxlbWVudDogSFRNTElucHV0RWxlbWVudCA9IDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnLXJlY2FwdGNoYS1yZXNwb25zZScpO1xyXG5cclxuICBpZiAoZWxlbWVudCAmJiBlbGVtZW50LnZhbHVlKSB7XHJcbiAgICB0ZW1wbGF0ZVByYW1zWydnLXJlY2FwdGNoYS1yZXNwb25zZSddID0gZWxlbWVudC52YWx1ZTtcclxuICB9XHJcblxyXG4gIGVsZW1lbnQgPSBudWxsO1xyXG4gIHJldHVybiB0ZW1wbGF0ZVByYW1zO1xyXG59XHJcblxyXG4vKipcclxuICogSW5pdGlhdGlvblxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdXNlcklEIC0gc2V0IHRoZSBFbWFpbEpTIHVzZXIgSURcclxuICogQHBhcmFtIHtzdHJpbmd9IG9yaWdpbiAtIHNldCB0aGUgRW1haWxKUyBvcmlnaW5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpbml0KHVzZXJJRDogc3RyaW5nLCBvcmlnaW4/OiBzdHJpbmcpOiB2b2lkIHtcclxuICBfdXNlcklEID0gdXNlcklEO1xyXG4gIF9vcmlnaW4gPSBvcmlnaW4gfHwgJ2h0dHBzOi8vYXBpLmVtYWlsanMuY29tJztcclxufVxyXG5cclxuLyoqXHJcbiAqIFNlbmQgYSB0ZW1wbGF0ZSB0byB0aGUgc3BlY2lmaWMgRW1haWxKUyBzZXJ2aWNlXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZXJ2aWNlSUQgLSB0aGUgRW1haWxKUyBzZXJ2aWNlIElEXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZW1wbGF0ZUlEIC0gdGhlIEVtYWlsSlMgdGVtcGxhdGUgSURcclxuICogQHBhcmFtIHtPYmplY3R9IHRlbXBsYXRlUHJhbXMgLSB0aGUgdGVtcGxhdGUgcGFyYW1zLCB3aGF0IHdpbGwgYmUgc2V0IHRvIHRoZSBFbWFpbEpTIHRlbXBsYXRlXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB1c2VySUQgLSB0aGUgRW1haWxKUyB1c2VyIElEXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlPEVtYWlsSlNSZXNwb25zZVN0YXR1cz59XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gc2VuZChzZXJ2aWNlSUQ6IHN0cmluZywgdGVtcGxhdGVJRDogc3RyaW5nLCB0ZW1wbGF0ZVByYW1zPzogT2JqZWN0LCB1c2VySUQ/OiBzdHJpbmcpOiBQcm9taXNlPEVtYWlsSlNSZXNwb25zZVN0YXR1cz4ge1xyXG4gIGxldCBwYXJhbXM6IE9iamVjdCA9IHtcclxuICAgIGxpYl92ZXJzaW9uOiAnPDxWRVJTSU9OPj4nLFxyXG4gICAgdXNlcl9pZDogdXNlcklEIHx8IF91c2VySUQsXHJcbiAgICBzZXJ2aWNlX2lkOiBzZXJ2aWNlSUQsXHJcbiAgICB0ZW1wbGF0ZV9pZDogdGVtcGxhdGVJRCxcclxuICAgIHRlbXBsYXRlX3BhcmFtczogYXBwZW5kR29vZ2xlQ2FwdGNoYSh0ZW1wbGF0ZVByYW1zKVxyXG4gIH07XHJcblxyXG4gIHJldHVybiBzZW5kUG9zdChfb3JpZ2luICsgJy9hcGkvdjEuMC9lbWFpbC9zZW5kJywgSlNPTi5zdHJpbmdpZnkocGFyYW1zKSwge1xyXG4gICAgJ0NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gIH0pO1xyXG59XHJcblxyXG4vKipcclxuICogU2VuZCBhIGZvcm0gdGhlIHNwZWNpZmljIEVtYWlsSlMgc2VydmljZVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VydmljZUlEIC0gdGhlIEVtYWlsSlMgc2VydmljZSBJRFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdGVtcGxhdGVJRCAtIHRoZSBFbWFpbEpTIHRlbXBsYXRlIElEXHJcbiAqIEBwYXJhbSB7c3RyaW5nIHwgSFRNTEZvcm1FbGVtZW50fSBmb3JtIC0gdGhlIGZvcm0gZWxlbWVudCBvciBzZWxlY3RvclxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdXNlcklEIC0gdGhlIEVtYWlsSlMgdXNlciBJRFxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxFbWFpbEpTUmVzcG9uc2VTdGF0dXM+fVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHNlbmRGb3JtKHNlcnZpY2VJRDogc3RyaW5nLCB0ZW1wbGF0ZUlEOiBzdHJpbmcsIGZvcm06IHN0cmluZyB8IEhUTUxGb3JtRWxlbWVudCwgdXNlcklEPzogc3RyaW5nKTogUHJvbWlzZTxFbWFpbEpTUmVzcG9uc2VTdGF0dXM+IHtcclxuICBpZiAodHlwZW9mIGZvcm0gPT09ICdzdHJpbmcnKSB7XHJcbiAgICBmb3JtID0gPEhUTUxGb3JtRWxlbWVudD5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKGZvcm0pO1xyXG4gIH1cclxuXHJcbiAgaWYgKCFmb3JtIHx8IGZvcm0ubm9kZU5hbWUgIT09ICdGT1JNJykge1xyXG4gICAgdGhyb3cgJ0V4cGVjdGVkIHRoZSBIVE1MIGZvcm0gZWxlbWVudCBvciB0aGUgc3R5bGUgc2VsZWN0b3Igb2YgZm9ybSc7XHJcbiAgfVxyXG5cclxuICBVSS5wcm9ncmVzc1N0YXRlKGZvcm0pO1xyXG4gIGxldCBmb3JtRGF0YTogRm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZm9ybSk7XHJcbiAgZm9ybURhdGEuYXBwZW5kKCdsaWJfdmVyc2lvbicsICc8PFZFUlNJT04+PicpO1xyXG4gIGZvcm1EYXRhLmFwcGVuZCgnc2VydmljZV9pZCcsIHNlcnZpY2VJRCk7XHJcbiAgZm9ybURhdGEuYXBwZW5kKCd0ZW1wbGF0ZV9pZCcsIHRlbXBsYXRlSUQpO1xyXG4gIGZvcm1EYXRhLmFwcGVuZCgndXNlcl9pZCcsIHVzZXJJRCB8fCBfdXNlcklEKTtcclxuXHJcbiAgcmV0dXJuIHNlbmRQb3N0KF9vcmlnaW4gKyAnL2FwaS92MS4wL2VtYWlsL3NlbmQtZm9ybScsIGZvcm1EYXRhKVxyXG4gICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgIFVJLnN1Y2Nlc3NTdGF0ZSg8SFRNTEZvcm1FbGVtZW50PmZvcm0pO1xyXG4gICAgICByZXR1cm4gcmVzcG9uc2U7XHJcbiAgICB9LCAoZXJyb3IpID0+IHtcclxuICAgICAgVUkuZXJyb3JTdGF0ZSg8SFRNTEZvcm1FbGVtZW50PmZvcm0pO1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xyXG4gICAgfSk7XHJcbn1cclxuIiwiZXhwb3J0IGNsYXNzIEVtYWlsSlNSZXNwb25zZVN0YXR1cyB7XHJcblxyXG4gIHB1YmxpYyBzdGF0dXM6IG51bWJlcjtcclxuICBwdWJsaWMgdGV4dDogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcihodHRwUmVzcG9uc2U6IFhNTEh0dHBSZXF1ZXN0KSB7XHJcbiAgICB0aGlzLnN0YXR1cyA9IGh0dHBSZXNwb25zZS5zdGF0dXM7XHJcbiAgICB0aGlzLnRleHQgPSBodHRwUmVzcG9uc2UucmVzcG9uc2VUZXh0O1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgY2xhc3MgVUkge1xyXG5cclxuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBQUk9HUkVTUzogc3RyaW5nID0gJ2VtYWlsanMtc2VuZGluZyc7XHJcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgRE9ORTogc3RyaW5nID0gJ2VtYWlsanMtc3VjY2Vzcyc7XHJcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgRVJST1I6IHN0cmluZyA9ICdlbWFpbGpzLWVycm9yJztcclxuXHJcbiAgcHVibGljIHN0YXRpYyBjbGVhckFsbChmb3JtOiBIVE1MRm9ybUVsZW1lbnQpOiB2b2lkIHtcclxuICAgIGZvcm0uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLlBST0dSRVNTKTtcclxuICAgIGZvcm0uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkRPTkUpO1xyXG4gICAgZm9ybS5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuRVJST1IpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyBwcm9ncmVzc1N0YXRlKGZvcm06IEhUTUxGb3JtRWxlbWVudCk6IHZvaWQge1xyXG4gICAgdGhpcy5jbGVhckFsbChmb3JtKTtcclxuICAgIGZvcm0uY2xhc3NMaXN0LmFkZCh0aGlzLlBST0dSRVNTKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgc3VjY2Vzc1N0YXRlKGZvcm06IEhUTUxGb3JtRWxlbWVudCk6IHZvaWQge1xyXG4gICAgZm9ybS5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuUFJPR1JFU1MpO1xyXG4gICAgZm9ybS5jbGFzc0xpc3QuYWRkKHRoaXMuRE9ORSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIGVycm9yU3RhdGUoZm9ybTogSFRNTEZvcm1FbGVtZW50KTogdm9pZCB7XHJcbiAgICBmb3JtLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5QUk9HUkVTUyk7XHJcbiAgICBmb3JtLmNsYXNzTGlzdC5hZGQodGhpcy5FUlJPUik7XHJcbiAgfVxyXG5cclxufVxyXG4iXSwicHJlRXhpc3RpbmdDb21tZW50IjoiLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW01dlpHVmZiVzlrZFd4bGN5OWljbTkzYzJWeUxYQmhZMnN2WDNCeVpXeDFaR1V1YW5NaUxDSnViMlJsWDIxdlpIVnNaWE12Y0hKdlkyVnpjeTlpY205M2MyVnlMbXB6SWl3aWJtOWtaVjl0YjJSMWJHVnpMM0J5YjIxcGMyVXRjRzlzZVdacGJHd3ZiR2xpTDJsdVpHVjRMbXB6SWl3aWJtOWtaVjl0YjJSMWJHVnpMM1JwYldWeWN5MWljbTkzYzJWeWFXWjVMMjFoYVc0dWFuTWlMQ0p6Y21NdmFXNWtaWGd1ZEhNaUxDSnpjbU12Ylc5a1pXeHpMMFZ0WVdsc1NsTlNaWE53YjI1elpWTjBZWFIxY3k1MGN5SXNJbk55WXk5elpYSjJhV05sY3k5MWFTOVZTUzUwY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFUdEJRMEZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN096dEJRM2hNUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenM3T3p0QlEzQlFRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdPenM3TzBGRE0wVkJMREJEUVVFMFF6dEJRVU0xUXl4M1JVRkJjVVU3UVVGRGNrVXNkVU5CUVc5RE8wRkJSWEJETEVsQlFVa3NUMEZCVHl4SFFVRlhMRWxCUVVrc1EwRkJRenRCUVVNelFpeEpRVUZKTEU5QlFVOHNSMEZCVnl4NVFrRkJlVUlzUTBGQlF6dEJRVVZvUkN4clFrRkJhMElzUjBGQlZ5eEZRVUZGTEVsQlFYVkNMRVZCUVVVc1QwRkJiMEk3U1VGQmNFSXNkMEpCUVVFc1JVRkJRU3haUVVGdlFqdEpRVU14UlN4UFFVRlBMRWxCUVVrc1QwRkJUeXhEUVVGRExGVkJRVU1zVDBGQlR5eEZRVUZGTEUxQlFVMDdVVUZEYWtNc1NVRkJTU3hIUVVGSExFZEJRVzFDTEVsQlFVa3NZMEZCWXl4RlFVRkZMRU5CUVVNN1VVRkZMME1zUjBGQlJ5eERRVUZETEdkQ1FVRm5RaXhEUVVGRExFMUJRVTBzUlVGQlJTeFZRVUZETEV0QlFVczdXVUZEYWtNc1NVRkJTU3hqUVVGakxFZEJRVEJDTEVsQlFVa3NOa05CUVhGQ0xFTkJRV2xDTEV0QlFVc3NRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJRenRaUVVOd1J5eEpRVUZKTEdOQlFXTXNRMEZCUXl4TlFVRk5MRXRCUVVzc1IwRkJSeXhKUVVGSkxHTkJRV01zUTBGQlF5eEpRVUZKTEV0QlFVc3NTVUZCU1N4RlFVRkZPMmRDUVVOcVJTeFBRVUZQTEVOQlFVTXNZMEZCWXl4RFFVRkRMRU5CUVVNN1lVRkRla0k3YVVKQlFVMDdaMEpCUTB3c1RVRkJUU3hEUVVGRExHTkJRV01zUTBGQlF5eERRVUZETzJGQlEzaENPMUZCUTBnc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRlNDeEhRVUZITEVOQlFVTXNaMEpCUVdkQ0xFTkJRVU1zVDBGQlR5eEZRVUZGTEZWQlFVTXNTMEZCU3p0WlFVTnNReXhOUVVGTkxFTkJRVU1zU1VGQlNTdzJRMEZCY1VJc1EwRkJhVUlzUzBGQlN5eERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRiRVVzUTBGQlF5eERRVUZETEVOQlFVTTdVVUZGU0N4SFFVRkhMRU5CUVVNc1NVRkJTU3hEUVVGRExFMUJRVTBzUlVGQlJTeEhRVUZITEVWQlFVVXNTVUZCU1N4RFFVRkRMRU5CUVVNN1VVRkZOVUlzUzBGQlN5eEpRVUZKTEVkQlFVY3NTVUZCU1N4UFFVRlBMRVZCUVVVN1dVRkRja0lzUjBGQlJ5eERRVUZETEdkQ1FVRm5RaXhEUVVGRExFZEJRVWNzUlVGQlJTeFBRVUZQTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNc1EwRkJRenRUUVVNelF6dFJRVVZFTEVkQlFVY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03U1VGRGFrSXNRMEZCUXl4RFFVRkRMRU5CUVVNN1FVRkRUQ3hEUVVGRE8wRkJSVVFzTmtKQlFUWkNMR0ZCUVhOQ08wbEJRMnBFTEVsQlFVa3NUMEZCVHl4SFFVRjFReXhSUVVGUkxFTkJRVU1zWTBGQll5eERRVUZETEhOQ1FVRnpRaXhEUVVGRExFTkJRVU03U1VGRmJFY3NTVUZCU1N4UFFVRlBMRWxCUVVrc1QwRkJUeXhEUVVGRExFdEJRVXNzUlVGQlJUdFJRVU0xUWl4aFFVRmhMRU5CUVVNc2MwSkJRWE5DTEVOQlFVTXNSMEZCUnl4UFFVRlBMRU5CUVVNc1MwRkJTeXhEUVVGRE8wdEJRM1pFTzBsQlJVUXNUMEZCVHl4SFFVRkhMRWxCUVVrc1EwRkJRenRKUVVObUxFOUJRVThzWVVGQllTeERRVUZETzBGQlEzWkNMRU5CUVVNN1FVRkZSRHM3T3p0SFFVbEhPMEZCUTBnc1kwRkJjVUlzVFVGQll5eEZRVUZGTEUxQlFXVTdTVUZEYkVRc1QwRkJUeXhIUVVGSExFMUJRVTBzUTBGQlF6dEpRVU5xUWl4UFFVRlBMRWRCUVVjc1RVRkJUU3hKUVVGSkxIbENRVUY1UWl4RFFVRkRPMEZCUTJoRUxFTkJRVU03UVVGSVJDeHZRa0ZIUXp0QlFVVkVPenM3T3pzN08wZEJUMGM3UVVGRFNDeGpRVUZ4UWl4VFFVRnBRaXhGUVVGRkxGVkJRV3RDTEVWQlFVVXNZVUZCYzBJc1JVRkJSU3hOUVVGbE8wbEJRMnBITEVsQlFVa3NUVUZCVFN4SFFVRlhPMUZCUTI1Q0xGZEJRVmNzUlVGQlJTeGhRVUZoTzFGQlF6RkNMRTlCUVU4c1JVRkJSU3hOUVVGTkxFbEJRVWtzVDBGQlR6dFJRVU14UWl4VlFVRlZMRVZCUVVVc1UwRkJVenRSUVVOeVFpeFhRVUZYTEVWQlFVVXNWVUZCVlR0UlFVTjJRaXhsUVVGbExFVkJRVVVzYlVKQlFXMUNMRU5CUVVNc1lVRkJZU3hEUVVGRE8wdEJRM0JFTEVOQlFVTTdTVUZGUml4UFFVRlBMRkZCUVZFc1EwRkJReXhQUVVGUExFZEJRVWNzYzBKQlFYTkNMRVZCUVVVc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eE5RVUZOTEVOQlFVTXNSVUZCUlR0UlFVTjRSU3hqUVVGakxFVkJRVVVzYTBKQlFXdENPMHRCUTI1RExFTkJRVU1zUTBGQlF6dEJRVU5NTEVOQlFVTTdRVUZhUkN4dlFrRlpRenRCUVVWRU96czdPenM3TzBkQlQwYzdRVUZEU0N4clFrRkJlVUlzVTBGQmFVSXNSVUZCUlN4VlFVRnJRaXhGUVVGRkxFbEJRVGhDTEVWQlFVVXNUVUZCWlR0SlFVTTNSeXhKUVVGSkxFOUJRVThzU1VGQlNTeExRVUZMTEZGQlFWRXNSVUZCUlR0UlFVTTFRaXhKUVVGSkxFZEJRVzlDTEZGQlFWRXNRMEZCUXl4aFFVRmhMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UzBGRGRFUTdTVUZGUkN4SlFVRkpMRU5CUVVNc1NVRkJTU3hKUVVGSkxFbEJRVWtzUTBGQlF5eFJRVUZSTEV0QlFVc3NUVUZCVFN4RlFVRkZPMUZCUTNKRExFMUJRVTBzT0VSQlFUaEVMRU5CUVVNN1MwRkRkRVU3U1VGRlJDeFBRVUZGTEVOQlFVTXNZVUZCWVN4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8wbEJRM1pDTEVsQlFVa3NVVUZCVVN4SFFVRmhMRWxCUVVrc1VVRkJVU3hEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzBsQlF6VkRMRkZCUVZFc1EwRkJReXhOUVVGTkxFTkJRVU1zWVVGQllTeEZRVUZGTEdGQlFXRXNRMEZCUXl4RFFVRkRPMGxCUXpsRExGRkJRVkVzUTBGQlF5eE5RVUZOTEVOQlFVTXNXVUZCV1N4RlFVRkZMRk5CUVZNc1EwRkJReXhEUVVGRE8wbEJRM3BETEZGQlFWRXNRMEZCUXl4TlFVRk5MRU5CUVVNc1lVRkJZU3hGUVVGRkxGVkJRVlVzUTBGQlF5eERRVUZETzBsQlF6TkRMRkZCUVZFc1EwRkJReXhOUVVGTkxFTkJRVU1zVTBGQlV5eEZRVUZGTEUxQlFVMHNTVUZCU1N4UFFVRlBMRU5CUVVNc1EwRkJRenRKUVVVNVF5eFBRVUZQTEZGQlFWRXNRMEZCUXl4UFFVRlBMRWRCUVVjc01rSkJRVEpDTEVWQlFVVXNVVUZCVVN4RFFVRkRPMU5CUXpkRUxFbEJRVWtzUTBGQlF5eFZRVUZETEZGQlFWRTdVVUZEWWl4UFFVRkZMRU5CUVVNc1dVRkJXU3hEUVVGclFpeEpRVUZKTEVOQlFVTXNRMEZCUXp0UlFVTjJReXhQUVVGUExGRkJRVkVzUTBGQlF6dEpRVU5zUWl4RFFVRkRMRVZCUVVVc1ZVRkJReXhMUVVGTE8xRkJRMUFzVDBGQlJTeERRVUZETEZWQlFWVXNRMEZCYTBJc1NVRkJTU3hEUVVGRExFTkJRVU03VVVGRGNrTXNUMEZCVHl4UFFVRlBMRU5CUVVNc1RVRkJUU3hEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETzBsQlF5OUNMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRMUFzUTBGQlF6dEJRWGhDUkN3MFFrRjNRa003T3pzN08wRkROMGRFTzBsQlMwVXNLMEpCUVZrc1dVRkJORUk3VVVGRGRFTXNTVUZCU1N4RFFVRkRMRTFCUVUwc1IwRkJSeXhaUVVGWkxFTkJRVU1zVFVGQlRTeERRVUZETzFGQlEyeERMRWxCUVVrc1EwRkJReXhKUVVGSkxFZEJRVWNzV1VGQldTeERRVUZETEZsQlFWa3NRMEZCUXp0SlFVTjRReXhEUVVGRE8wbEJRMGdzTkVKQlFVTTdRVUZCUkN4RFFWUkJMRUZCVTBNc1NVRkJRVHRCUVZSWkxITkVRVUZ4UWpzN096czdRVU5CYkVNN1NVRkJRVHRKUVRKQ1FTeERRVUZETzBsQmNrSmxMRmRCUVZFc1IwRkJkRUlzVlVGQmRVSXNTVUZCY1VJN1VVRkRNVU1zU1VGQlNTeERRVUZETEZOQlFWTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETzFGQlEzSkRMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU1zVFVGQlRTeERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRSUVVOcVF5eEpRVUZKTEVOQlFVTXNVMEZCVXl4RFFVRkRMRTFCUVUwc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdTVUZEY0VNc1EwRkJRenRKUVVWaExHZENRVUZoTEVkQlFUTkNMRlZCUVRSQ0xFbEJRWEZDTzFGQlF5OURMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdVVUZEY0VJc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eEhRVUZITEVOQlFVTXNTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRE8wbEJRM0JETEVOQlFVTTdTVUZGWVN4bFFVRlpMRWRCUVRGQ0xGVkJRVEpDTEVsQlFYRkNPMUZCUXpsRExFbEJRVWtzUTBGQlF5eFRRVUZUTEVOQlFVTXNUVUZCVFN4RFFVRkRMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6dFJRVU55UXl4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFZEJRVWNzUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1NVRkRhRU1zUTBGQlF6dEpRVVZoTEdGQlFWVXNSMEZCZUVJc1ZVRkJlVUlzU1VGQmNVSTdVVUZETlVNc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eE5RVUZOTEVOQlFVTXNTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRE8xRkJRM0pETEVsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1IwRkJSeXhEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXp0SlFVTnFReXhEUVVGRE8wbEJka0oxUWl4WFFVRlJMRWRCUVZjc2FVSkJRV2xDTEVOQlFVTTdTVUZEY2tNc1QwRkJTU3hIUVVGWExHbENRVUZwUWl4RFFVRkRPMGxCUTJwRExGRkJRVXNzUjBGQlZ5eGxRVUZsTEVOQlFVTTdTVUYxUWpGRUxGTkJRVU03UTBFelFrUXNRVUV5UWtNc1NVRkJRVHRCUVROQ1dTeG5Ra0ZCUlNJc0ltWnBiR1VpT2lKblpXNWxjbUYwWldRdWFuTWlMQ0p6YjNWeVkyVlNiMjkwSWpvaUlpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lLR1oxYm1OMGFXOXVLQ2w3Wm5WdVkzUnBiMjRnY2lobExHNHNkQ2w3Wm5WdVkzUnBiMjRnYnlocExHWXBlMmxtS0NGdVcybGRLWHRwWmlnaFpWdHBYU2w3ZG1GeUlHTTlYQ0ptZFc1amRHbHZibHdpUFQxMGVYQmxiMllnY21WeGRXbHlaU1ltY21WeGRXbHlaVHRwWmlnaFppWW1ZeWx5WlhSMWNtNGdZeWhwTENFd0tUdHBaaWgxS1hKbGRIVnliaUIxS0drc0lUQXBPM1poY2lCaFBXNWxkeUJGY25KdmNpaGNJa05oYm01dmRDQm1hVzVrSUcxdlpIVnNaU0FuWENJcmFTdGNJaWRjSWlrN2RHaHliM2NnWVM1amIyUmxQVndpVFU5RVZVeEZYMDVQVkY5R1QxVk9SRndpTEdGOWRtRnlJSEE5Ymx0cFhUMTdaWGh3YjNKMGN6cDdmWDA3WlZ0cFhWc3dYUzVqWVd4c0tIQXVaWGh3YjNKMGN5eG1kVzVqZEdsdmJpaHlLWHQyWVhJZ2JqMWxXMmxkV3pGZFczSmRPM0psZEhWeWJpQnZLRzU4ZkhJcGZTeHdMSEF1Wlhod2IzSjBjeXh5TEdVc2JpeDBLWDF5WlhSMWNtNGdibHRwWFM1bGVIQnZjblJ6ZldadmNpaDJZWElnZFQxY0ltWjFibU4wYVc5dVhDSTlQWFI1Y0dWdlppQnlaWEYxYVhKbEppWnlaWEYxYVhKbExHazlNRHRwUEhRdWJHVnVaM1JvTzJrckt5bHZLSFJiYVYwcE8zSmxkSFZ5YmlCdmZYSmxkSFZ5YmlCeWZTa29LU0lzSWk4dklITm9hVzBnWm05eUlIVnphVzVuSUhCeWIyTmxjM01nYVc0Z1luSnZkM05sY2x4dWRtRnlJSEJ5YjJObGMzTWdQU0J0YjJSMWJHVXVaWGh3YjNKMGN5QTlJSHQ5TzF4dVhHNHZMeUJqWVdOb1pXUWdabkp2YlNCM2FHRjBaWFpsY2lCbmJHOWlZV3dnYVhNZ2NISmxjMlZ1ZENCemJ5QjBhR0YwSUhSbGMzUWdjblZ1Ym1WeWN5QjBhR0YwSUhOMGRXSWdhWFJjYmk4dklHUnZiaWQwSUdKeVpXRnJJSFJvYVc1bmN5NGdJRUoxZENCM1pTQnVaV1ZrSUhSdklIZHlZWEFnYVhRZ2FXNGdZU0IwY25rZ1kyRjBZMmdnYVc0Z1kyRnpaU0JwZENCcGMxeHVMeThnZDNKaGNIQmxaQ0JwYmlCemRISnBZM1FnYlc5a1pTQmpiMlJsSUhkb2FXTm9JR1J2WlhOdUozUWdaR1ZtYVc1bElHRnVlU0JuYkc5aVlXeHpMaUFnU1hRbmN5QnBibk5wWkdVZ1lWeHVMeThnWm5WdVkzUnBiMjRnWW1WallYVnpaU0IwY25rdlkyRjBZMmhsY3lCa1pXOXdkR2x0YVhwbElHbHVJR05sY25SaGFXNGdaVzVuYVc1bGN5NWNibHh1ZG1GeUlHTmhZMmhsWkZObGRGUnBiV1Z2ZFhRN1hHNTJZWElnWTJGamFHVmtRMnhsWVhKVWFXMWxiM1YwTzF4dVhHNW1kVzVqZEdsdmJpQmtaV1poZFd4MFUyVjBWR2x0YjNWMEtDa2dlMXh1SUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2lnbmMyVjBWR2x0Wlc5MWRDQm9ZWE1nYm05MElHSmxaVzRnWkdWbWFXNWxaQ2NwTzF4dWZWeHVablZ1WTNScGIyNGdaR1ZtWVhWc2RFTnNaV0Z5VkdsdFpXOTFkQ0FvS1NCN1hHNGdJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLQ2RqYkdWaGNsUnBiV1Z2ZFhRZ2FHRnpJRzV2ZENCaVpXVnVJR1JsWm1sdVpXUW5LVHRjYm4xY2JpaG1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdkSEo1SUh0Y2JpQWdJQ0FnSUNBZ2FXWWdLSFI1Y0dWdlppQnpaWFJVYVcxbGIzVjBJRDA5UFNBblpuVnVZM1JwYjI0bktTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCallXTm9aV1JUWlhSVWFXMWxiM1YwSUQwZ2MyVjBWR2x0Wlc5MWREdGNiaUFnSUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUdOaFkyaGxaRk5sZEZScGJXVnZkWFFnUFNCa1pXWmhkV3gwVTJWMFZHbHRiM1YwTzF4dUlDQWdJQ0FnSUNCOVhHNGdJQ0FnZlNCallYUmphQ0FvWlNrZ2UxeHVJQ0FnSUNBZ0lDQmpZV05vWldSVFpYUlVhVzFsYjNWMElEMGdaR1ZtWVhWc2RGTmxkRlJwYlc5MWREdGNiaUFnSUNCOVhHNGdJQ0FnZEhKNUlIdGNiaUFnSUNBZ0lDQWdhV1lnS0hSNWNHVnZaaUJqYkdWaGNsUnBiV1Z2ZFhRZ1BUMDlJQ2RtZFc1amRHbHZiaWNwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJR05oWTJobFpFTnNaV0Z5VkdsdFpXOTFkQ0E5SUdOc1pXRnlWR2x0Wlc5MWREdGNiaUFnSUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUdOaFkyaGxaRU5zWldGeVZHbHRaVzkxZENBOUlHUmxabUYxYkhSRGJHVmhjbFJwYldWdmRYUTdYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQjlJR05oZEdOb0lDaGxLU0I3WEc0Z0lDQWdJQ0FnSUdOaFkyaGxaRU5zWldGeVZHbHRaVzkxZENBOUlHUmxabUYxYkhSRGJHVmhjbFJwYldWdmRYUTdYRzRnSUNBZ2ZWeHVmU0FvS1NsY2JtWjFibU4wYVc5dUlISjFibFJwYldWdmRYUW9ablZ1S1NCN1hHNGdJQ0FnYVdZZ0tHTmhZMmhsWkZObGRGUnBiV1Z2ZFhRZ1BUMDlJSE5sZEZScGJXVnZkWFFwSUh0Y2JpQWdJQ0FnSUNBZ0x5OXViM0p0WVd3Z1pXNTJhWEp2YldWdWRITWdhVzRnYzJGdVpTQnphWFIxWVhScGIyNXpYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQnpaWFJVYVcxbGIzVjBLR1oxYml3Z01DazdYRzRnSUNBZ2ZWeHVJQ0FnSUM4dklHbG1JSE5sZEZScGJXVnZkWFFnZDJGemJpZDBJR0YyWVdsc1lXSnNaU0JpZFhRZ2QyRnpJR3hoZEhSbGNpQmtaV1pwYm1Wa1hHNGdJQ0FnYVdZZ0tDaGpZV05vWldSVFpYUlVhVzFsYjNWMElEMDlQU0JrWldaaGRXeDBVMlYwVkdsdGIzVjBJSHg4SUNGallXTm9aV1JUWlhSVWFXMWxiM1YwS1NBbUppQnpaWFJVYVcxbGIzVjBLU0I3WEc0Z0lDQWdJQ0FnSUdOaFkyaGxaRk5sZEZScGJXVnZkWFFnUFNCelpYUlVhVzFsYjNWME8xeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2MyVjBWR2x0Wlc5MWRDaG1kVzRzSURBcE8xeHVJQ0FnSUgxY2JpQWdJQ0IwY25rZ2UxeHVJQ0FnSUNBZ0lDQXZMeUIzYUdWdUlIZG9aVzRnYzI5dFpXSnZaSGtnYUdGeklITmpjbVYzWldRZ2QybDBhQ0J6WlhSVWFXMWxiM1YwSUdKMWRDQnVieUJKTGtVdUlHMWhaR1J1WlhOelhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCallXTm9aV1JUWlhSVWFXMWxiM1YwS0daMWJpd2dNQ2s3WEc0Z0lDQWdmU0JqWVhSamFDaGxLWHRjYmlBZ0lDQWdJQ0FnZEhKNUlIdGNiaUFnSUNBZ0lDQWdJQ0FnSUM4dklGZG9aVzRnZDJVZ1lYSmxJR2x1SUVrdVJTNGdZblYwSUhSb1pTQnpZM0pwY0hRZ2FHRnpJR0psWlc0Z1pYWmhiR1ZrSUhOdklFa3VSUzRnWkc5bGMyNG5kQ0IwY25WemRDQjBhR1VnWjJ4dlltRnNJRzlpYW1WamRDQjNhR1Z1SUdOaGJHeGxaQ0J1YjNKdFlXeHNlVnh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUdOaFkyaGxaRk5sZEZScGJXVnZkWFF1WTJGc2JDaHVkV3hzTENCbWRXNHNJREFwTzF4dUlDQWdJQ0FnSUNCOUlHTmhkR05vS0dVcGUxeHVJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z2MyRnRaU0JoY3lCaFltOTJaU0JpZFhRZ2QyaGxiaUJwZENkeklHRWdkbVZ5YzJsdmJpQnZaaUJKTGtVdUlIUm9ZWFFnYlhWemRDQm9ZWFpsSUhSb1pTQm5iRzlpWVd3Z2IySnFaV04wSUdadmNpQW5kR2hwY3ljc0lHaHZjR1oxYkd4NUlHOTFjaUJqYjI1MFpYaDBJR052Y25KbFkzUWdiM1JvWlhKM2FYTmxJR2wwSUhkcGJHd2dkR2h5YjNjZ1lTQm5iRzlpWVd3Z1pYSnliM0pjYmlBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCallXTm9aV1JUWlhSVWFXMWxiM1YwTG1OaGJHd29kR2hwY3l3Z1puVnVMQ0F3S1R0Y2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JseHVYRzU5WEc1bWRXNWpkR2x2YmlCeWRXNURiR1ZoY2xScGJXVnZkWFFvYldGeWEyVnlLU0I3WEc0Z0lDQWdhV1lnS0dOaFkyaGxaRU5zWldGeVZHbHRaVzkxZENBOVBUMGdZMnhsWVhKVWFXMWxiM1YwS1NCN1hHNGdJQ0FnSUNBZ0lDOHZibTl5YldGc0lHVnVkbWx5YjIxbGJuUnpJR2x1SUhOaGJtVWdjMmwwZFdGMGFXOXVjMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdZMnhsWVhKVWFXMWxiM1YwS0cxaGNtdGxjaWs3WEc0Z0lDQWdmVnh1SUNBZ0lDOHZJR2xtSUdOc1pXRnlWR2x0Wlc5MWRDQjNZWE51SjNRZ1lYWmhhV3hoWW14bElHSjFkQ0IzWVhNZ2JHRjBkR1Z5SUdSbFptbHVaV1JjYmlBZ0lDQnBaaUFvS0dOaFkyaGxaRU5zWldGeVZHbHRaVzkxZENBOVBUMGdaR1ZtWVhWc2RFTnNaV0Z5VkdsdFpXOTFkQ0I4ZkNBaFkyRmphR1ZrUTJ4bFlYSlVhVzFsYjNWMEtTQW1KaUJqYkdWaGNsUnBiV1Z2ZFhRcElIdGNiaUFnSUNBZ0lDQWdZMkZqYUdWa1EyeGxZWEpVYVcxbGIzVjBJRDBnWTJ4bFlYSlVhVzFsYjNWME8xeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z1kyeGxZWEpVYVcxbGIzVjBLRzFoY210bGNpazdYRzRnSUNBZ2ZWeHVJQ0FnSUhSeWVTQjdYRzRnSUNBZ0lDQWdJQzh2SUhkb1pXNGdkMmhsYmlCemIyMWxZbTlrZVNCb1lYTWdjMk55WlhkbFpDQjNhWFJvSUhObGRGUnBiV1Z2ZFhRZ1luVjBJRzV2SUVrdVJTNGdiV0ZrWkc1bGMzTmNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHTmhZMmhsWkVOc1pXRnlWR2x0Wlc5MWRDaHRZWEpyWlhJcE8xeHVJQ0FnSUgwZ1kyRjBZMmdnS0dVcGUxeHVJQ0FnSUNBZ0lDQjBjbmtnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdMeThnVjJobGJpQjNaU0JoY21VZ2FXNGdTUzVGTGlCaWRYUWdkR2hsSUhOamNtbHdkQ0JvWVhNZ1ltVmxiaUJsZG1Gc1pXUWdjMjhnU1M1RkxpQmtiMlZ6YmlkMElDQjBjblZ6ZENCMGFHVWdaMnh2WW1Gc0lHOWlhbVZqZENCM2FHVnVJR05oYkd4bFpDQnViM0p0WVd4c2VWeHVJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJR05oWTJobFpFTnNaV0Z5VkdsdFpXOTFkQzVqWVd4c0tHNTFiR3dzSUcxaGNtdGxjaWs3WEc0Z0lDQWdJQ0FnSUgwZ1kyRjBZMmdnS0dVcGUxeHVJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z2MyRnRaU0JoY3lCaFltOTJaU0JpZFhRZ2QyaGxiaUJwZENkeklHRWdkbVZ5YzJsdmJpQnZaaUJKTGtVdUlIUm9ZWFFnYlhWemRDQm9ZWFpsSUhSb1pTQm5iRzlpWVd3Z2IySnFaV04wSUdadmNpQW5kR2hwY3ljc0lHaHZjR1oxYkd4NUlHOTFjaUJqYjI1MFpYaDBJR052Y25KbFkzUWdiM1JvWlhKM2FYTmxJR2wwSUhkcGJHd2dkR2h5YjNjZ1lTQm5iRzlpWVd3Z1pYSnliM0l1WEc0Z0lDQWdJQ0FnSUNBZ0lDQXZMeUJUYjIxbElIWmxjbk5wYjI1eklHOW1JRWt1UlM0Z2FHRjJaU0JrYVdabVpYSmxiblFnY25Wc1pYTWdabTl5SUdOc1pXRnlWR2x0Wlc5MWRDQjJjeUJ6WlhSVWFXMWxiM1YwWEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z1kyRmphR1ZrUTJ4bFlYSlVhVzFsYjNWMExtTmhiR3dvZEdocGN5d2diV0Z5YTJWeUtUdGNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lIMWNibHh1WEc1Y2JuMWNiblpoY2lCeGRXVjFaU0E5SUZ0ZE8xeHVkbUZ5SUdSeVlXbHVhVzVuSUQwZ1ptRnNjMlU3WEc1MllYSWdZM1Z5Y21WdWRGRjFaWFZsTzF4dWRtRnlJSEYxWlhWbFNXNWtaWGdnUFNBdE1UdGNibHh1Wm5WdVkzUnBiMjRnWTJ4bFlXNVZjRTVsZUhSVWFXTnJLQ2tnZTF4dUlDQWdJR2xtSUNnaFpISmhhVzVwYm1jZ2ZId2dJV04xY25KbGJuUlJkV1YxWlNrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200N1hHNGdJQ0FnZlZ4dUlDQWdJR1J5WVdsdWFXNW5JRDBnWm1Gc2MyVTdYRzRnSUNBZ2FXWWdLR04xY25KbGJuUlJkV1YxWlM1c1pXNW5kR2dwSUh0Y2JpQWdJQ0FnSUNBZ2NYVmxkV1VnUFNCamRYSnlaVzUwVVhWbGRXVXVZMjl1WTJGMEtIRjFaWFZsS1R0Y2JpQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0J4ZFdWMVpVbHVaR1Y0SUQwZ0xURTdYRzRnSUNBZ2ZWeHVJQ0FnSUdsbUlDaHhkV1YxWlM1c1pXNW5kR2dwSUh0Y2JpQWdJQ0FnSUNBZ1pISmhhVzVSZFdWMVpTZ3BPMXh1SUNBZ0lIMWNibjFjYmx4dVpuVnVZM1JwYjI0Z1pISmhhVzVSZFdWMVpTZ3BJSHRjYmlBZ0lDQnBaaUFvWkhKaGFXNXBibWNwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1TzF4dUlDQWdJSDFjYmlBZ0lDQjJZWElnZEdsdFpXOTFkQ0E5SUhKMWJsUnBiV1Z2ZFhRb1kyeGxZVzVWY0U1bGVIUlVhV05yS1R0Y2JpQWdJQ0JrY21GcGJtbHVaeUE5SUhSeWRXVTdYRzVjYmlBZ0lDQjJZWElnYkdWdUlEMGdjWFZsZFdVdWJHVnVaM1JvTzF4dUlDQWdJSGRvYVd4bEtHeGxiaWtnZTF4dUlDQWdJQ0FnSUNCamRYSnlaVzUwVVhWbGRXVWdQU0J4ZFdWMVpUdGNiaUFnSUNBZ0lDQWdjWFZsZFdVZ1BTQmJYVHRjYmlBZ0lDQWdJQ0FnZDJocGJHVWdLQ3NyY1hWbGRXVkpibVJsZUNBOElHeGxiaWtnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lnS0dOMWNuSmxiblJSZFdWMVpTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR04xY25KbGJuUlJkV1YxWlZ0eGRXVjFaVWx1WkdWNFhTNXlkVzRvS1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNCeGRXVjFaVWx1WkdWNElEMGdMVEU3WEc0Z0lDQWdJQ0FnSUd4bGJpQTlJSEYxWlhWbExteGxibWQwYUR0Y2JpQWdJQ0I5WEc0Z0lDQWdZM1Z5Y21WdWRGRjFaWFZsSUQwZ2JuVnNiRHRjYmlBZ0lDQmtjbUZwYm1sdVp5QTlJR1poYkhObE8xeHVJQ0FnSUhKMWJrTnNaV0Z5VkdsdFpXOTFkQ2gwYVcxbGIzVjBLVHRjYm4xY2JseHVjSEp2WTJWemN5NXVaWGgwVkdsamF5QTlJR1oxYm1OMGFXOXVJQ2htZFc0cElIdGNiaUFnSUNCMllYSWdZWEpuY3lBOUlHNWxkeUJCY25KaGVTaGhjbWQxYldWdWRITXViR1Z1WjNSb0lDMGdNU2s3WEc0Z0lDQWdhV1lnS0dGeVozVnRaVzUwY3k1c1pXNW5kR2dnUGlBeEtTQjdYRzRnSUNBZ0lDQWdJR1p2Y2lBb2RtRnlJR2tnUFNBeE95QnBJRHdnWVhKbmRXMWxiblJ6TG14bGJtZDBhRHNnYVNzcktTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCaGNtZHpXMmtnTFNBeFhTQTlJR0Z5WjNWdFpXNTBjMXRwWFR0Y2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JpQWdJQ0J4ZFdWMVpTNXdkWE5vS0c1bGR5QkpkR1Z0S0daMWJpd2dZWEpuY3lrcE8xeHVJQ0FnSUdsbUlDaHhkV1YxWlM1c1pXNW5kR2dnUFQwOUlERWdKaVlnSVdSeVlXbHVhVzVuS1NCN1hHNGdJQ0FnSUNBZ0lISjFibFJwYldWdmRYUW9aSEpoYVc1UmRXVjFaU2s3WEc0Z0lDQWdmVnh1ZlR0Y2JseHVMeThnZGpnZ2JHbHJaWE1nY0hKbFpHbGpkR2xpYkdVZ2IySnFaV04wYzF4dVpuVnVZM1JwYjI0Z1NYUmxiU2htZFc0c0lHRnljbUY1S1NCN1hHNGdJQ0FnZEdocGN5NW1kVzRnUFNCbWRXNDdYRzRnSUNBZ2RHaHBjeTVoY25KaGVTQTlJR0Z5Y21GNU8xeHVmVnh1U1hSbGJTNXdjbTkwYjNSNWNHVXVjblZ1SUQwZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIUm9hWE11Wm5WdUxtRndjR3g1S0c1MWJHd3NJSFJvYVhNdVlYSnlZWGtwTzF4dWZUdGNibkJ5YjJObGMzTXVkR2wwYkdVZ1BTQW5Zbkp2ZDNObGNpYzdYRzV3Y205alpYTnpMbUp5YjNkelpYSWdQU0IwY25WbE8xeHVjSEp2WTJWemN5NWxibllnUFNCN2ZUdGNibkJ5YjJObGMzTXVZWEpuZGlBOUlGdGRPMXh1Y0hKdlkyVnpjeTUyWlhKemFXOXVJRDBnSnljN0lDOHZJR1Z0Y0hSNUlITjBjbWx1WnlCMGJ5QmhkbTlwWkNCeVpXZGxlSEFnYVhOemRXVnpYRzV3Y205alpYTnpMblpsY25OcGIyNXpJRDBnZTMwN1hHNWNibVoxYm1OMGFXOXVJRzV2YjNBb0tTQjdmVnh1WEc1d2NtOWpaWE56TG05dUlEMGdibTl2Y0R0Y2JuQnliMk5sYzNNdVlXUmtUR2x6ZEdWdVpYSWdQU0J1YjI5d08xeHVjSEp2WTJWemN5NXZibU5sSUQwZ2JtOXZjRHRjYm5CeWIyTmxjM011YjJabUlEMGdibTl2Y0R0Y2JuQnliMk5sYzNNdWNtVnRiM1psVEdsemRHVnVaWElnUFNCdWIyOXdPMXh1Y0hKdlkyVnpjeTV5WlcxdmRtVkJiR3hNYVhOMFpXNWxjbk1nUFNCdWIyOXdPMXh1Y0hKdlkyVnpjeTVsYldsMElEMGdibTl2Y0R0Y2JuQnliMk5sYzNNdWNISmxjR1Z1WkV4cGMzUmxibVZ5SUQwZ2JtOXZjRHRjYm5CeWIyTmxjM011Y0hKbGNHVnVaRTl1WTJWTWFYTjBaVzVsY2lBOUlHNXZiM0E3WEc1Y2JuQnliMk5sYzNNdWJHbHpkR1Z1WlhKeklEMGdablZ1WTNScGIyNGdLRzVoYldVcElIc2djbVYwZFhKdUlGdGRJSDFjYmx4dWNISnZZMlZ6Y3k1aWFXNWthVzVuSUQwZ1puVnVZM1JwYjI0Z0tHNWhiV1VwSUh0Y2JpQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9KM0J5YjJObGMzTXVZbWx1WkdsdVp5QnBjeUJ1YjNRZ2MzVndjRzl5ZEdWa0p5azdYRzU5TzF4dVhHNXdjbTlqWlhOekxtTjNaQ0E5SUdaMWJtTjBhVzl1SUNncElIc2djbVYwZFhKdUlDY3ZKeUI5TzF4dWNISnZZMlZ6Y3k1amFHUnBjaUE5SUdaMWJtTjBhVzl1SUNoa2FYSXBJSHRjYmlBZ0lDQjBhSEp2ZHlCdVpYY2dSWEp5YjNJb0ozQnliMk5sYzNNdVkyaGthWElnYVhNZ2JtOTBJSE4xY0hCdmNuUmxaQ2NwTzF4dWZUdGNibkJ5YjJObGMzTXVkVzFoYzJzZ1BTQm1kVzVqZEdsdmJpZ3BJSHNnY21WMGRYSnVJREE3SUgwN1hHNGlMQ0luZFhObElITjBjbWxqZENjN1hHNWNiblpoY2lCd2NtOXRhWE5sUm1sdVlXeHNlU0E5SUdaMWJtTjBhVzl1S0dOaGJHeGlZV05yS1NCN1hHNGdJSFpoY2lCamIyNXpkSEoxWTNSdmNpQTlJSFJvYVhNdVkyOXVjM1J5ZFdOMGIzSTdYRzRnSUhKbGRIVnliaUIwYUdsekxuUm9aVzRvWEc0Z0lDQWdablZ1WTNScGIyNG9kbUZzZFdVcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCamIyNXpkSEoxWTNSdmNpNXlaWE52YkhabEtHTmhiR3hpWVdOcktDa3BMblJvWlc0b1puVnVZM1JwYjI0b0tTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQjJZV3gxWlR0Y2JpQWdJQ0FnSUgwcE8xeHVJQ0FnSUgwc1hHNGdJQ0FnWm5WdVkzUnBiMjRvY21WaGMyOXVLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdZMjl1YzNSeWRXTjBiM0l1Y21WemIyeDJaU2hqWVd4c1ltRmpheWdwS1M1MGFHVnVLR1oxYm1OMGFXOXVLQ2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnWTI5dWMzUnlkV04wYjNJdWNtVnFaV04wS0hKbFlYTnZiaWs3WEc0Z0lDQWdJQ0I5S1R0Y2JpQWdJQ0I5WEc0Z0lDazdYRzU5TzF4dVhHNHZMeUJUZEc5eVpTQnpaWFJVYVcxbGIzVjBJSEpsWm1WeVpXNWpaU0J6YnlCd2NtOXRhWE5sTFhCdmJIbG1hV3hzSUhkcGJHd2dZbVVnZFc1aFptWmxZM1JsWkNCaWVWeHVMeThnYjNSb1pYSWdZMjlrWlNCdGIyUnBabmxwYm1jZ2MyVjBWR2x0Wlc5MWRDQW9iR2xyWlNCemFXNXZiaTUxYzJWR1lXdGxWR2x0WlhKektDa3BYRzUyWVhJZ2MyVjBWR2x0Wlc5MWRFWjFibU1nUFNCelpYUlVhVzFsYjNWME8xeHVYRzVtZFc1amRHbHZiaUJ1YjI5d0tDa2dlMzFjYmx4dUx5OGdVRzlzZVdacGJHd2dabTl5SUVaMWJtTjBhVzl1TG5CeWIzUnZkSGx3WlM1aWFXNWtYRzVtZFc1amRHbHZiaUJpYVc1a0tHWnVMQ0IwYUdselFYSm5LU0I3WEc0Z0lISmxkSFZ5YmlCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNCbWJpNWhjSEJzZVNoMGFHbHpRWEpuTENCaGNtZDFiV1Z1ZEhNcE8xeHVJQ0I5TzF4dWZWeHVYRzVtZFc1amRHbHZiaUJRY205dGFYTmxLR1p1S1NCN1hHNGdJR2xtSUNnaEtIUm9hWE1nYVc1emRHRnVZMlZ2WmlCUWNtOXRhWE5sS1NsY2JpQWdJQ0IwYUhKdmR5QnVaWGNnVkhsd1pVVnljbTl5S0NkUWNtOXRhWE5sY3lCdGRYTjBJR0psSUdOdmJuTjBjblZqZEdWa0lIWnBZU0J1WlhjbktUdGNiaUFnYVdZZ0tIUjVjR1Z2WmlCbWJpQWhQVDBnSjJaMWJtTjBhVzl1SnlrZ2RHaHliM2NnYm1WM0lGUjVjR1ZGY25KdmNpZ25ibTkwSUdFZ1puVnVZM1JwYjI0bktUdGNiaUFnZEdocGN5NWZjM1JoZEdVZ1BTQXdPMXh1SUNCMGFHbHpMbDlvWVc1a2JHVmtJRDBnWm1Gc2MyVTdYRzRnSUhSb2FYTXVYM1poYkhWbElEMGdkVzVrWldacGJtVmtPMXh1SUNCMGFHbHpMbDlrWldabGNuSmxaSE1nUFNCYlhUdGNibHh1SUNCa2IxSmxjMjlzZG1Vb1ptNHNJSFJvYVhNcE8xeHVmVnh1WEc1bWRXNWpkR2x2YmlCb1lXNWtiR1VvYzJWc1ppd2daR1ZtWlhKeVpXUXBJSHRjYmlBZ2QyaHBiR1VnS0hObGJHWXVYM04wWVhSbElEMDlQU0F6S1NCN1hHNGdJQ0FnYzJWc1ppQTlJSE5sYkdZdVgzWmhiSFZsTzF4dUlDQjlYRzRnSUdsbUlDaHpaV3htTGw5emRHRjBaU0E5UFQwZ01Da2dlMXh1SUNBZ0lITmxiR1l1WDJSbFptVnljbVZrY3k1d2RYTm9LR1JsWm1WeWNtVmtLVHRjYmlBZ0lDQnlaWFIxY200N1hHNGdJSDFjYmlBZ2MyVnNaaTVmYUdGdVpHeGxaQ0E5SUhSeWRXVTdYRzRnSUZCeWIyMXBjMlV1WDJsdGJXVmthV0YwWlVadUtHWjFibU4wYVc5dUtDa2dlMXh1SUNBZ0lIWmhjaUJqWWlBOUlITmxiR1l1WDNOMFlYUmxJRDA5UFNBeElEOGdaR1ZtWlhKeVpXUXViMjVHZFd4bWFXeHNaV1FnT2lCa1pXWmxjbkpsWkM1dmJsSmxhbVZqZEdWa08xeHVJQ0FnSUdsbUlDaGpZaUE5UFQwZ2JuVnNiQ2tnZTF4dUlDQWdJQ0FnS0hObGJHWXVYM04wWVhSbElEMDlQU0F4SUQ4Z2NtVnpiMngyWlNBNklISmxhbVZqZENrb1pHVm1aWEp5WldRdWNISnZiV2x6WlN3Z2MyVnNaaTVmZG1Gc2RXVXBPMXh1SUNBZ0lDQWdjbVYwZFhKdU8xeHVJQ0FnSUgxY2JpQWdJQ0IyWVhJZ2NtVjBPMXh1SUNBZ0lIUnllU0I3WEc0Z0lDQWdJQ0J5WlhRZ1BTQmpZaWh6Wld4bUxsOTJZV3gxWlNrN1hHNGdJQ0FnZlNCallYUmphQ0FvWlNrZ2UxeHVJQ0FnSUNBZ2NtVnFaV04wS0dSbFptVnljbVZrTG5CeWIyMXBjMlVzSUdVcE8xeHVJQ0FnSUNBZ2NtVjBkWEp1TzF4dUlDQWdJSDFjYmlBZ0lDQnlaWE52YkhabEtHUmxabVZ5Y21Wa0xuQnliMjFwYzJVc0lISmxkQ2s3WEc0Z0lIMHBPMXh1ZlZ4dVhHNW1kVzVqZEdsdmJpQnlaWE52YkhabEtITmxiR1lzSUc1bGQxWmhiSFZsS1NCN1hHNGdJSFJ5ZVNCN1hHNGdJQ0FnTHk4Z1VISnZiV2x6WlNCU1pYTnZiSFYwYVc5dUlGQnliMk5sWkhWeVpUb2dhSFIwY0hNNkx5OW5hWFJvZFdJdVkyOXRMM0J5YjIxcGMyVnpMV0Z3YkhWekwzQnliMjFwYzJWekxYTndaV01qZEdobExYQnliMjFwYzJVdGNtVnpiMngxZEdsdmJpMXdjbTlqWldSMWNtVmNiaUFnSUNCcFppQW9ibVYzVm1Gc2RXVWdQVDA5SUhObGJHWXBYRzRnSUNBZ0lDQjBhSEp2ZHlCdVpYY2dWSGx3WlVWeWNtOXlLQ2RCSUhCeWIyMXBjMlVnWTJGdWJtOTBJR0psSUhKbGMyOXNkbVZrSUhkcGRHZ2dhWFJ6Wld4bUxpY3BPMXh1SUNBZ0lHbG1JQ2hjYmlBZ0lDQWdJRzVsZDFaaGJIVmxJQ1ltWEc0Z0lDQWdJQ0FvZEhsd1pXOW1JRzVsZDFaaGJIVmxJRDA5UFNBbmIySnFaV04wSnlCOGZDQjBlWEJsYjJZZ2JtVjNWbUZzZFdVZ1BUMDlJQ2RtZFc1amRHbHZiaWNwWEc0Z0lDQWdLU0I3WEc0Z0lDQWdJQ0IyWVhJZ2RHaGxiaUE5SUc1bGQxWmhiSFZsTG5Sb1pXNDdYRzRnSUNBZ0lDQnBaaUFvYm1WM1ZtRnNkV1VnYVc1emRHRnVZMlZ2WmlCUWNtOXRhWE5sS1NCN1hHNGdJQ0FnSUNBZ0lITmxiR1l1WDNOMFlYUmxJRDBnTXp0Y2JpQWdJQ0FnSUNBZ2MyVnNaaTVmZG1Gc2RXVWdQU0J1WlhkV1lXeDFaVHRjYmlBZ0lDQWdJQ0FnWm1sdVlXeGxLSE5sYkdZcE8xeHVJQ0FnSUNBZ0lDQnlaWFIxY200N1hHNGdJQ0FnSUNCOUlHVnNjMlVnYVdZZ0tIUjVjR1Z2WmlCMGFHVnVJRDA5UFNBblpuVnVZM1JwYjI0bktTQjdYRzRnSUNBZ0lDQWdJR1J2VW1WemIyeDJaU2hpYVc1a0tIUm9aVzRzSUc1bGQxWmhiSFZsS1N3Z2MyVnNaaWs3WEc0Z0lDQWdJQ0FnSUhKbGRIVnlianRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzRnSUNBZ2MyVnNaaTVmYzNSaGRHVWdQU0F4TzF4dUlDQWdJSE5sYkdZdVgzWmhiSFZsSUQwZ2JtVjNWbUZzZFdVN1hHNGdJQ0FnWm1sdVlXeGxLSE5sYkdZcE8xeHVJQ0I5SUdOaGRHTm9JQ2hsS1NCN1hHNGdJQ0FnY21WcVpXTjBLSE5sYkdZc0lHVXBPMXh1SUNCOVhHNTlYRzVjYm1aMWJtTjBhVzl1SUhKbGFtVmpkQ2h6Wld4bUxDQnVaWGRXWVd4MVpTa2dlMXh1SUNCelpXeG1MbDl6ZEdGMFpTQTlJREk3WEc0Z0lITmxiR1l1WDNaaGJIVmxJRDBnYm1WM1ZtRnNkV1U3WEc0Z0lHWnBibUZzWlNoelpXeG1LVHRjYm4xY2JseHVablZ1WTNScGIyNGdabWx1WVd4bEtITmxiR1lwSUh0Y2JpQWdhV1lnS0hObGJHWXVYM04wWVhSbElEMDlQU0F5SUNZbUlITmxiR1l1WDJSbFptVnljbVZrY3k1c1pXNW5kR2dnUFQwOUlEQXBJSHRjYmlBZ0lDQlFjbTl0YVhObExsOXBiVzFsWkdsaGRHVkdiaWhtZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0FnSUdsbUlDZ2hjMlZzWmk1ZmFHRnVaR3hsWkNrZ2UxeHVJQ0FnSUNBZ0lDQlFjbTl0YVhObExsOTFibWhoYm1Sc1pXUlNaV3BsWTNScGIyNUdiaWh6Wld4bUxsOTJZV3gxWlNrN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnZlNrN1hHNGdJSDFjYmx4dUlDQm1iM0lnS0haaGNpQnBJRDBnTUN3Z2JHVnVJRDBnYzJWc1ppNWZaR1ZtWlhKeVpXUnpMbXhsYm1kMGFEc2dhU0E4SUd4bGJqc2dhU3NyS1NCN1hHNGdJQ0FnYUdGdVpHeGxLSE5sYkdZc0lITmxiR1l1WDJSbFptVnljbVZrYzF0cFhTazdYRzRnSUgxY2JpQWdjMlZzWmk1ZlpHVm1aWEp5WldSeklEMGdiblZzYkR0Y2JuMWNibHh1Wm5WdVkzUnBiMjRnU0dGdVpHeGxjaWh2YmtaMWJHWnBiR3hsWkN3Z2IyNVNaV3BsWTNSbFpDd2djSEp2YldselpTa2dlMXh1SUNCMGFHbHpMbTl1Um5Wc1ptbHNiR1ZrSUQwZ2RIbHdaVzltSUc5dVJuVnNabWxzYkdWa0lEMDlQU0FuWm5WdVkzUnBiMjRuSUQ4Z2IyNUdkV3htYVd4c1pXUWdPaUJ1ZFd4c08xeHVJQ0IwYUdsekxtOXVVbVZxWldOMFpXUWdQU0IwZVhCbGIyWWdiMjVTWldwbFkzUmxaQ0E5UFQwZ0oyWjFibU4wYVc5dUp5QS9JRzl1VW1WcVpXTjBaV1FnT2lCdWRXeHNPMXh1SUNCMGFHbHpMbkJ5YjIxcGMyVWdQU0J3Y205dGFYTmxPMXh1ZlZ4dVhHNHZLaXBjYmlBcUlGUmhhMlVnWVNCd2IzUmxiblJwWVd4c2VTQnRhWE5pWldoaGRtbHVaeUJ5WlhOdmJIWmxjaUJtZFc1amRHbHZiaUJoYm1RZ2JXRnJaU0J6ZFhKbFhHNGdLaUJ2YmtaMWJHWnBiR3hsWkNCaGJtUWdiMjVTWldwbFkzUmxaQ0JoY21VZ2IyNXNlU0JqWVd4c1pXUWdiMjVqWlM1Y2JpQXFYRzRnS2lCTllXdGxjeUJ1YnlCbmRXRnlZVzUwWldWeklHRmliM1YwSUdGemVXNWphSEp2Ym5rdVhHNGdLaTljYm1aMWJtTjBhVzl1SUdSdlVtVnpiMngyWlNobWJpd2djMlZzWmlrZ2UxeHVJQ0IyWVhJZ1pHOXVaU0E5SUdaaGJITmxPMXh1SUNCMGNua2dlMXh1SUNBZ0lHWnVLRnh1SUNBZ0lDQWdablZ1WTNScGIyNG9kbUZzZFdVcElIdGNiaUFnSUNBZ0lDQWdhV1lnS0dSdmJtVXBJSEpsZEhWeWJqdGNiaUFnSUNBZ0lDQWdaRzl1WlNBOUlIUnlkV1U3WEc0Z0lDQWdJQ0FnSUhKbGMyOXNkbVVvYzJWc1ppd2dkbUZzZFdVcE8xeHVJQ0FnSUNBZ2ZTeGNiaUFnSUNBZ0lHWjFibU4wYVc5dUtISmxZWE52YmlrZ2UxeHVJQ0FnSUNBZ0lDQnBaaUFvWkc5dVpTa2djbVYwZFhKdU8xeHVJQ0FnSUNBZ0lDQmtiMjVsSUQwZ2RISjFaVHRjYmlBZ0lDQWdJQ0FnY21WcVpXTjBLSE5sYkdZc0lISmxZWE52YmlrN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnS1R0Y2JpQWdmU0JqWVhSamFDQW9aWGdwSUh0Y2JpQWdJQ0JwWmlBb1pHOXVaU2tnY21WMGRYSnVPMXh1SUNBZ0lHUnZibVVnUFNCMGNuVmxPMXh1SUNBZ0lISmxhbVZqZENoelpXeG1MQ0JsZUNrN1hHNGdJSDFjYm4xY2JseHVVSEp2YldselpTNXdjbTkwYjNSNWNHVmJKMk5oZEdOb0oxMGdQU0JtZFc1amRHbHZiaWh2YmxKbGFtVmpkR1ZrS1NCN1hHNGdJSEpsZEhWeWJpQjBhR2x6TG5Sb1pXNG9iblZzYkN3Z2IyNVNaV3BsWTNSbFpDazdYRzU5TzF4dVhHNVFjbTl0YVhObExuQnliM1J2ZEhsd1pTNTBhR1Z1SUQwZ1puVnVZM1JwYjI0b2IyNUdkV3htYVd4c1pXUXNJRzl1VW1WcVpXTjBaV1FwSUh0Y2JpQWdkbUZ5SUhCeWIyMGdQU0J1WlhjZ2RHaHBjeTVqYjI1emRISjFZM1J2Y2lodWIyOXdLVHRjYmx4dUlDQm9ZVzVrYkdVb2RHaHBjeXdnYm1WM0lFaGhibVJzWlhJb2IyNUdkV3htYVd4c1pXUXNJRzl1VW1WcVpXTjBaV1FzSUhCeWIyMHBLVHRjYmlBZ2NtVjBkWEp1SUhCeWIyMDdYRzU5TzF4dVhHNVFjbTl0YVhObExuQnliM1J2ZEhsd1pWc25abWx1WVd4c2VTZGRJRDBnY0hKdmJXbHpaVVpwYm1Gc2JIazdYRzVjYmxCeWIyMXBjMlV1WVd4c0lEMGdablZ1WTNScGIyNG9ZWEp5S1NCN1hHNGdJSEpsZEhWeWJpQnVaWGNnVUhKdmJXbHpaU2htZFc1amRHbHZiaWh5WlhOdmJIWmxMQ0J5WldwbFkzUXBJSHRjYmlBZ0lDQnBaaUFvSVdGeWNpQjhmQ0IwZVhCbGIyWWdZWEp5TG14bGJtZDBhQ0E5UFQwZ0ozVnVaR1ZtYVc1bFpDY3BYRzRnSUNBZ0lDQjBhSEp2ZHlCdVpYY2dWSGx3WlVWeWNtOXlLQ2RRY205dGFYTmxMbUZzYkNCaFkyTmxjSFJ6SUdGdUlHRnljbUY1SnlrN1hHNGdJQ0FnZG1GeUlHRnlaM01nUFNCQmNuSmhlUzV3Y205MGIzUjVjR1V1YzJ4cFkyVXVZMkZzYkNoaGNuSXBPMXh1SUNBZ0lHbG1JQ2hoY21kekxteGxibWQwYUNBOVBUMGdNQ2tnY21WMGRYSnVJSEpsYzI5c2RtVW9XMTBwTzF4dUlDQWdJSFpoY2lCeVpXMWhhVzVwYm1jZ1BTQmhjbWR6TG14bGJtZDBhRHRjYmx4dUlDQWdJR1oxYm1OMGFXOXVJSEpsY3locExDQjJZV3dwSUh0Y2JpQWdJQ0FnSUhSeWVTQjdYRzRnSUNBZ0lDQWdJR2xtSUNoMllXd2dKaVlnS0hSNWNHVnZaaUIyWVd3Z1BUMDlJQ2R2WW1wbFkzUW5JSHg4SUhSNWNHVnZaaUIyWVd3Z1BUMDlJQ2RtZFc1amRHbHZiaWNwS1NCN1hHNGdJQ0FnSUNBZ0lDQWdkbUZ5SUhSb1pXNGdQU0IyWVd3dWRHaGxianRjYmlBZ0lDQWdJQ0FnSUNCcFppQW9kSGx3Wlc5bUlIUm9aVzRnUFQwOUlDZG1kVzVqZEdsdmJpY3BJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIUm9aVzR1WTJGc2JDaGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ2RtRnNMRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQm1kVzVqZEdsdmJpaDJZV3dwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCeVpYTW9hU3dnZG1Gc0tUdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ2ZTeGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ2NtVnFaV04wWEc0Z0lDQWdJQ0FnSUNBZ0lDQXBPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1TzF4dUlDQWdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0JoY21kelcybGRJRDBnZG1Gc08xeHVJQ0FnSUNBZ0lDQnBaaUFvTFMxeVpXMWhhVzVwYm1jZ1BUMDlJREFwSUh0Y2JpQWdJQ0FnSUNBZ0lDQnlaWE52YkhabEtHRnlaM01wTzF4dUlDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNCOUlHTmhkR05vSUNobGVDa2dlMXh1SUNBZ0lDQWdJQ0J5WldwbFkzUW9aWGdwTzF4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJR1p2Y2lBb2RtRnlJR2tnUFNBd095QnBJRHdnWVhKbmN5NXNaVzVuZEdnN0lHa3JLeWtnZTF4dUlDQWdJQ0FnY21WektHa3NJR0Z5WjNOYmFWMHBPMXh1SUNBZ0lIMWNiaUFnZlNrN1hHNTlPMXh1WEc1UWNtOXRhWE5sTG5KbGMyOXNkbVVnUFNCbWRXNWpkR2x2YmloMllXeDFaU2tnZTF4dUlDQnBaaUFvZG1Gc2RXVWdKaVlnZEhsd1pXOW1JSFpoYkhWbElEMDlQU0FuYjJKcVpXTjBKeUFtSmlCMllXeDFaUzVqYjI1emRISjFZM1J2Y2lBOVBUMGdVSEp2YldselpTa2dlMXh1SUNBZ0lISmxkSFZ5YmlCMllXeDFaVHRjYmlBZ2ZWeHVYRzRnSUhKbGRIVnliaUJ1WlhjZ1VISnZiV2x6WlNobWRXNWpkR2x2YmloeVpYTnZiSFpsS1NCN1hHNGdJQ0FnY21WemIyeDJaU2gyWVd4MVpTazdYRzRnSUgwcE8xeHVmVHRjYmx4dVVISnZiV2x6WlM1eVpXcGxZM1FnUFNCbWRXNWpkR2x2YmloMllXeDFaU2tnZTF4dUlDQnlaWFIxY200Z2JtVjNJRkJ5YjIxcGMyVW9ablZ1WTNScGIyNG9jbVZ6YjJ4MlpTd2djbVZxWldOMEtTQjdYRzRnSUNBZ2NtVnFaV04wS0haaGJIVmxLVHRjYmlBZ2ZTazdYRzU5TzF4dVhHNVFjbTl0YVhObExuSmhZMlVnUFNCbWRXNWpkR2x2YmloMllXeDFaWE1wSUh0Y2JpQWdjbVYwZFhKdUlHNWxkeUJRY205dGFYTmxLR1oxYm1OMGFXOXVLSEpsYzI5c2RtVXNJSEpsYW1WamRDa2dlMXh1SUNBZ0lHWnZjaUFvZG1GeUlHa2dQU0F3TENCc1pXNGdQU0IyWVd4MVpYTXViR1Z1WjNSb095QnBJRHdnYkdWdU95QnBLeXNwSUh0Y2JpQWdJQ0FnSUhaaGJIVmxjMXRwWFM1MGFHVnVLSEpsYzI5c2RtVXNJSEpsYW1WamRDazdYRzRnSUNBZ2ZWeHVJQ0I5S1R0Y2JuMDdYRzVjYmk4dklGVnpaU0J3YjJ4NVptbHNiQ0JtYjNJZ2MyVjBTVzF0WldScFlYUmxJR1p2Y2lCd1pYSm1iM0p0WVc1alpTQm5ZV2x1YzF4dVVISnZiV2x6WlM1ZmFXMXRaV1JwWVhSbFJtNGdQVnh1SUNBb2RIbHdaVzltSUhObGRFbHRiV1ZrYVdGMFpTQTlQVDBnSjJaMWJtTjBhVzl1SnlBbUpseHVJQ0FnSUdaMWJtTjBhVzl1S0dadUtTQjdYRzRnSUNBZ0lDQnpaWFJKYlcxbFpHbGhkR1VvWm00cE8xeHVJQ0FnSUgwcElIeDhYRzRnSUdaMWJtTjBhVzl1S0dadUtTQjdYRzRnSUNBZ2MyVjBWR2x0Wlc5MWRFWjFibU1vWm00c0lEQXBPMXh1SUNCOU8xeHVYRzVRY205dGFYTmxMbDkxYm1oaGJtUnNaV1JTWldwbFkzUnBiMjVHYmlBOUlHWjFibU4wYVc5dUlGOTFibWhoYm1Sc1pXUlNaV3BsWTNScGIyNUdiaWhsY25JcElIdGNiaUFnYVdZZ0tIUjVjR1Z2WmlCamIyNXpiMnhsSUNFOVBTQW5kVzVrWldacGJtVmtKeUFtSmlCamIyNXpiMnhsS1NCN1hHNGdJQ0FnWTI5dWMyOXNaUzUzWVhKdUtDZFFiM056YVdKc1pTQlZibWhoYm1Sc1pXUWdVSEp2YldselpTQlNaV3BsWTNScGIyNDZKeXdnWlhKeUtUc2dMeThnWlhOc2FXNTBMV1JwYzJGaWJHVXRiR2x1WlNCdWJ5MWpiMjV6YjJ4bFhHNGdJSDFjYm4wN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdVSEp2YldselpUdGNiaUlzSW5aaGNpQnVaWGgwVkdsamF5QTlJSEpsY1hWcGNtVW9KM0J5YjJObGMzTXZZbkp2ZDNObGNpNXFjeWNwTG01bGVIUlVhV05yTzF4dWRtRnlJR0Z3Y0d4NUlEMGdSblZ1WTNScGIyNHVjSEp2ZEc5MGVYQmxMbUZ3Y0d4NU8xeHVkbUZ5SUhOc2FXTmxJRDBnUVhKeVlYa3VjSEp2ZEc5MGVYQmxMbk5zYVdObE8xeHVkbUZ5SUdsdGJXVmthV0YwWlVsa2N5QTlJSHQ5TzF4dWRtRnlJRzVsZUhSSmJXMWxaR2xoZEdWSlpDQTlJREE3WEc1Y2JpOHZJRVJQVFNCQlVFbHpMQ0JtYjNJZ1kyOXRjR3hsZEdWdVpYTnpYRzVjYm1WNGNHOXlkSE11YzJWMFZHbHRaVzkxZENBOUlHWjFibU4wYVc5dUtDa2dlMXh1SUNCeVpYUjFjbTRnYm1WM0lGUnBiV1Z2ZFhRb1lYQndiSGt1WTJGc2JDaHpaWFJVYVcxbGIzVjBMQ0IzYVc1a2IzY3NJR0Z5WjNWdFpXNTBjeWtzSUdOc1pXRnlWR2x0Wlc5MWRDazdYRzU5TzF4dVpYaHdiM0owY3k1elpYUkpiblJsY25aaGJDQTlJR1oxYm1OMGFXOXVLQ2tnZTF4dUlDQnlaWFIxY200Z2JtVjNJRlJwYldWdmRYUW9ZWEJ3YkhrdVkyRnNiQ2h6WlhSSmJuUmxjblpoYkN3Z2QybHVaRzkzTENCaGNtZDFiV1Z1ZEhNcExDQmpiR1ZoY2tsdWRHVnlkbUZzS1R0Y2JuMDdYRzVsZUhCdmNuUnpMbU5zWldGeVZHbHRaVzkxZENBOVhHNWxlSEJ2Y25SekxtTnNaV0Z5U1c1MFpYSjJZV3dnUFNCbWRXNWpkR2x2YmloMGFXMWxiM1YwS1NCN0lIUnBiV1Z2ZFhRdVkyeHZjMlVvS1RzZ2ZUdGNibHh1Wm5WdVkzUnBiMjRnVkdsdFpXOTFkQ2hwWkN3Z1kyeGxZWEpHYmlrZ2UxeHVJQ0IwYUdsekxsOXBaQ0E5SUdsa08xeHVJQ0IwYUdsekxsOWpiR1ZoY2tadUlEMGdZMnhsWVhKR2JqdGNibjFjYmxScGJXVnZkWFF1Y0hKdmRHOTBlWEJsTG5WdWNtVm1JRDBnVkdsdFpXOTFkQzV3Y205MGIzUjVjR1V1Y21WbUlEMGdablZ1WTNScGIyNG9LU0I3ZlR0Y2JsUnBiV1Z2ZFhRdWNISnZkRzkwZVhCbExtTnNiM05sSUQwZ1puVnVZM1JwYjI0b0tTQjdYRzRnSUhSb2FYTXVYMk5zWldGeVJtNHVZMkZzYkNoM2FXNWtiM2NzSUhSb2FYTXVYMmxrS1R0Y2JuMDdYRzVjYmk4dklFUnZaWE1nYm05MElITjBZWEowSUhSb1pTQjBhVzFsTENCcWRYTjBJSE5sZEhNZ2RYQWdkR2hsSUcxbGJXSmxjbk1nYm1WbFpHVmtMbHh1Wlhod2IzSjBjeTVsYm5KdmJHd2dQU0JtZFc1amRHbHZiaWhwZEdWdExDQnRjMlZqY3lrZ2UxeHVJQ0JqYkdWaGNsUnBiV1Z2ZFhRb2FYUmxiUzVmYVdSc1pWUnBiV1Z2ZFhSSlpDazdYRzRnSUdsMFpXMHVYMmxrYkdWVWFXMWxiM1YwSUQwZ2JYTmxZM003WEc1OU8xeHVYRzVsZUhCdmNuUnpMblZ1Wlc1eWIyeHNJRDBnWm5WdVkzUnBiMjRvYVhSbGJTa2dlMXh1SUNCamJHVmhjbFJwYldWdmRYUW9hWFJsYlM1ZmFXUnNaVlJwYldWdmRYUkpaQ2s3WEc0Z0lHbDBaVzB1WDJsa2JHVlVhVzFsYjNWMElEMGdMVEU3WEc1OU8xeHVYRzVsZUhCdmNuUnpMbDkxYm5KbFprRmpkR2wyWlNBOUlHVjRjRzl5ZEhNdVlXTjBhWFpsSUQwZ1puVnVZM1JwYjI0b2FYUmxiU2tnZTF4dUlDQmpiR1ZoY2xScGJXVnZkWFFvYVhSbGJTNWZhV1JzWlZScGJXVnZkWFJKWkNrN1hHNWNiaUFnZG1GeUlHMXpaV056SUQwZ2FYUmxiUzVmYVdSc1pWUnBiV1Z2ZFhRN1hHNGdJR2xtSUNodGMyVmpjeUErUFNBd0tTQjdYRzRnSUNBZ2FYUmxiUzVmYVdSc1pWUnBiV1Z2ZFhSSlpDQTlJSE5sZEZScGJXVnZkWFFvWm5WdVkzUnBiMjRnYjI1VWFXMWxiM1YwS0NrZ2UxeHVJQ0FnSUNBZ2FXWWdLR2wwWlcwdVgyOXVWR2x0Wlc5MWRDbGNiaUFnSUNBZ0lDQWdhWFJsYlM1ZmIyNVVhVzFsYjNWMEtDazdYRzRnSUNBZ2ZTd2diWE5sWTNNcE8xeHVJQ0I5WEc1OU8xeHVYRzR2THlCVWFHRjBKM01nYm05MElHaHZkeUJ1YjJSbExtcHpJR2x0Y0d4bGJXVnVkSE1nYVhRZ1luVjBJSFJvWlNCbGVIQnZjMlZrSUdGd2FTQnBjeUIwYUdVZ2MyRnRaUzVjYm1WNGNHOXlkSE11YzJWMFNXMXRaV1JwWVhSbElEMGdkSGx3Wlc5bUlITmxkRWx0YldWa2FXRjBaU0E5UFQwZ1hDSm1kVzVqZEdsdmJsd2lJRDhnYzJWMFNXMXRaV1JwWVhSbElEb2dablZ1WTNScGIyNG9abTRwSUh0Y2JpQWdkbUZ5SUdsa0lEMGdibVY0ZEVsdGJXVmthV0YwWlVsa0t5czdYRzRnSUhaaGNpQmhjbWR6SUQwZ1lYSm5kVzFsYm5SekxteGxibWQwYUNBOElESWdQeUJtWVd4elpTQTZJSE5zYVdObExtTmhiR3dvWVhKbmRXMWxiblJ6TENBeEtUdGNibHh1SUNCcGJXMWxaR2xoZEdWSlpITmJhV1JkSUQwZ2RISjFaVHRjYmx4dUlDQnVaWGgwVkdsamF5aG1kVzVqZEdsdmJpQnZiazVsZUhSVWFXTnJLQ2tnZTF4dUlDQWdJR2xtSUNocGJXMWxaR2xoZEdWSlpITmJhV1JkS1NCN1hHNGdJQ0FnSUNBdkx5Qm1iaTVqWVd4c0tDa2dhWE1nWm1GemRHVnlJSE52SUhkbElHOXdkR2x0YVhwbElHWnZjaUIwYUdVZ1kyOXRiVzl1SUhWelpTMWpZWE5sWEc0Z0lDQWdJQ0F2THlCQWMyVmxJR2gwZEhBNkx5OXFjM0JsY21ZdVkyOXRMMk5oYkd3dFlYQndiSGt0YzJWbmRWeHVJQ0FnSUNBZ2FXWWdLR0Z5WjNNcElIdGNiaUFnSUNBZ0lDQWdabTR1WVhCd2JIa29iblZzYkN3Z1lYSm5jeWs3WEc0Z0lDQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0JtYmk1allXeHNLRzUxYkd3cE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0x5OGdVSEpsZG1WdWRDQnBaSE1nWm5KdmJTQnNaV0ZyYVc1blhHNGdJQ0FnSUNCbGVIQnZjblJ6TG1Oc1pXRnlTVzF0WldScFlYUmxLR2xrS1R0Y2JpQWdJQ0I5WEc0Z0lIMHBPMXh1WEc0Z0lISmxkSFZ5YmlCcFpEdGNibjA3WEc1Y2JtVjRjRzl5ZEhNdVkyeGxZWEpKYlcxbFpHbGhkR1VnUFNCMGVYQmxiMllnWTJ4bFlYSkpiVzFsWkdsaGRHVWdQVDA5SUZ3aVpuVnVZM1JwYjI1Y0lpQS9JR05zWldGeVNXMXRaV1JwWVhSbElEb2dablZ1WTNScGIyNG9hV1FwSUh0Y2JpQWdaR1ZzWlhSbElHbHRiV1ZrYVdGMFpVbGtjMXRwWkYwN1hHNTlPeUlzSW1sdGNHOXlkQ0FxSUdGeklGQnliMjFwYzJVZ1puSnZiU0FuY0hKdmJXbHpaUzF3YjJ4NVptbHNiQ2M3WEhKY2JtbHRjRzl5ZENCN1JXMWhhV3hLVTFKbGMzQnZibk5sVTNSaGRIVnpmU0JtY205dElDY3VMMjF2WkdWc2N5OUZiV0ZwYkVwVFVtVnpjRzl1YzJWVGRHRjBkWE1uTzF4eVhHNXBiWEJ2Y25RZ2UxVkpmU0JtY205dElDY3VMM05sY25acFkyVnpMM1ZwTDFWSkp6dGNjbHh1WEhKY2JteGxkQ0JmZFhObGNrbEVPaUJ6ZEhKcGJtY2dQU0J1ZFd4c08xeHlYRzVzWlhRZ1gyOXlhV2RwYmpvZ2MzUnlhVzVuSUQwZ0oyaDBkSEJ6T2k4dllYQnBMbVZ0WVdsc2FuTXVZMjl0Snp0Y2NseHVYSEpjYm1aMWJtTjBhVzl1SUhObGJtUlFiM04wS0hWeWJEb2djM1J5YVc1bkxDQmtZWFJoT2lCemRISnBibWNnZkNCR2IzSnRSR0YwWVN3Z2FHVmhaR1Z5Y3pvZ1QySnFaV04wSUQwZ2UzMHBPaUJRY205dGFYTmxQRVZ0WVdsc1NsTlNaWE53YjI1elpWTjBZWFIxY3o0Z2UxeHlYRzRnSUhKbGRIVnliaUJ1WlhjZ1VISnZiV2x6WlNnb2NtVnpiMngyWlN3Z2NtVnFaV04wS1NBOVBpQjdYSEpjYmlBZ0lDQnNaWFFnZUdoeU9pQllUVXhJZEhSd1VtVnhkV1Z6ZENBOUlHNWxkeUJZVFV4SWRIUndVbVZ4ZFdWemRDZ3BPMXh5WEc1Y2NseHVJQ0FnSUhob2NpNWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtDZHNiMkZrSnl3Z0tHVjJaVzUwS1NBOVBpQjdYSEpjYmlBZ0lDQWdJR3hsZENCeVpYTndiMjV6WlZOMFlYUjFjem9nUlcxaGFXeEtVMUpsYzNCdmJuTmxVM1JoZEhWeklEMGdibVYzSUVWdFlXbHNTbE5TWlhOd2IyNXpaVk4wWVhSMWN5ZzhXRTFNU0hSMGNGSmxjWFZsYzNRK1pYWmxiblF1ZEdGeVoyVjBLVHRjY2x4dUlDQWdJQ0FnYVdZZ0tISmxjM0J2Ym5ObFUzUmhkSFZ6TG5OMFlYUjFjeUE5UFQwZ01qQXdJSHg4SUhKbGMzQnZibk5sVTNSaGRIVnpMblJsZUhRZ1BUMDlJQ2RQU3ljcElIdGNjbHh1SUNBZ0lDQWdJQ0J5WlhOdmJIWmxLSEpsYzNCdmJuTmxVM1JoZEhWektUdGNjbHh1SUNBZ0lDQWdmU0JsYkhObElIdGNjbHh1SUNBZ0lDQWdJQ0J5WldwbFkzUW9jbVZ6Y0c5dWMyVlRkR0YwZFhNcE8xeHlYRzRnSUNBZ0lDQjlYSEpjYmlBZ0lDQjlLVHRjY2x4dVhISmNiaUFnSUNCNGFISXVZV1JrUlhabGJuUk1hWE4wWlc1bGNpZ25aWEp5YjNJbkxDQW9aWFpsYm5RcElEMCtJSHRjY2x4dUlDQWdJQ0FnY21WcVpXTjBLRzVsZHlCRmJXRnBiRXBUVW1WemNHOXVjMlZUZEdGMGRYTW9QRmhOVEVoMGRIQlNaWEYxWlhOMFBtVjJaVzUwTG5SaGNtZGxkQ2twTzF4eVhHNGdJQ0FnZlNrN1hISmNibHh5WEc0Z0lDQWdlR2h5TG05d1pXNG9KMUJQVTFRbkxDQjFjbXdzSUhSeWRXVXBPMXh5WEc1Y2NseHVJQ0FnSUdadmNpQW9iR1YwSUd0bGVTQnBiaUJvWldGa1pYSnpLU0I3WEhKY2JpQWdJQ0FnSUNBZ2VHaHlMbk5sZEZKbGNYVmxjM1JJWldGa1pYSW9hMlY1TENCb1pXRmtaWEp6VzJ0bGVWMHBPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUhob2NpNXpaVzVrS0dSaGRHRXBPMXh5WEc0Z0lIMHBPMXh5WEc1OVhISmNibHh5WEc1bWRXNWpkR2x2YmlCaGNIQmxibVJIYjI5bmJHVkRZWEIwWTJoaEtIUmxiWEJzWVhSbFVISmhiWE0vT2lCUFltcGxZM1FwT2lCUFltcGxZM1FnZTF4eVhHNGdJR3hsZENCbGJHVnRaVzUwT2lCSVZFMU1TVzV3ZFhSRmJHVnRaVzUwSUQwZ1BFaFVUVXhKYm5CMWRFVnNaVzFsYm5RK1pHOWpkVzFsYm5RdVoyVjBSV3hsYldWdWRFSjVTV1FvSjJjdGNtVmpZWEIwWTJoaExYSmxjM0J2Ym5ObEp5azdYSEpjYmx4eVhHNGdJR2xtSUNobGJHVnRaVzUwSUNZbUlHVnNaVzFsYm5RdWRtRnNkV1VwSUh0Y2NseHVJQ0FnSUhSbGJYQnNZWFJsVUhKaGJYTmJKMmN0Y21WallYQjBZMmhoTFhKbGMzQnZibk5sSjEwZ1BTQmxiR1Z0Wlc1MExuWmhiSFZsTzF4eVhHNGdJSDFjY2x4dVhISmNiaUFnWld4bGJXVnVkQ0E5SUc1MWJHdzdYSEpjYmlBZ2NtVjBkWEp1SUhSbGJYQnNZWFJsVUhKaGJYTTdYSEpjYm4xY2NseHVYSEpjYmk4cUtseHlYRzRnS2lCSmJtbDBhV0YwYVc5dVhISmNiaUFxSUVCd1lYSmhiU0I3YzNSeWFXNW5mU0IxYzJWeVNVUWdMU0J6WlhRZ2RHaGxJRVZ0WVdsc1NsTWdkWE5sY2lCSlJGeHlYRzRnS2lCQWNHRnlZVzBnZTNOMGNtbHVaMzBnYjNKcFoybHVJQzBnYzJWMElIUm9aU0JGYldGcGJFcFRJRzl5YVdkcGJseHlYRzRnS2k5Y2NseHVaWGh3YjNKMElHWjFibU4wYVc5dUlHbHVhWFFvZFhObGNrbEVPaUJ6ZEhKcGJtY3NJRzl5YVdkcGJqODZJSE4wY21sdVp5azZJSFp2YVdRZ2UxeHlYRzRnSUY5MWMyVnlTVVFnUFNCMWMyVnlTVVE3WEhKY2JpQWdYMjl5YVdkcGJpQTlJRzl5YVdkcGJpQjhmQ0FuYUhSMGNITTZMeTloY0drdVpXMWhhV3hxY3k1amIyMG5PMXh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZ1UyVnVaQ0JoSUhSbGJYQnNZWFJsSUhSdklIUm9aU0J6Y0dWamFXWnBZeUJGYldGcGJFcFRJSE5sY25acFkyVmNjbHh1SUNvZ1FIQmhjbUZ0SUh0emRISnBibWQ5SUhObGNuWnBZMlZKUkNBdElIUm9aU0JGYldGcGJFcFRJSE5sY25acFkyVWdTVVJjY2x4dUlDb2dRSEJoY21GdElIdHpkSEpwYm1kOUlIUmxiWEJzWVhSbFNVUWdMU0IwYUdVZ1JXMWhhV3hLVXlCMFpXMXdiR0YwWlNCSlJGeHlYRzRnS2lCQWNHRnlZVzBnZTA5aWFtVmpkSDBnZEdWdGNHeGhkR1ZRY21GdGN5QXRJSFJvWlNCMFpXMXdiR0YwWlNCd1lYSmhiWE1zSUhkb1lYUWdkMmxzYkNCaVpTQnpaWFFnZEc4Z2RHaGxJRVZ0WVdsc1NsTWdkR1Z0Y0d4aGRHVmNjbHh1SUNvZ1FIQmhjbUZ0SUh0emRISnBibWQ5SUhWelpYSkpSQ0F0SUhSb1pTQkZiV0ZwYkVwVElIVnpaWElnU1VSY2NseHVJQ29nUUhKbGRIVnlibk1nZTFCeWIyMXBjMlU4UlcxaGFXeEtVMUpsYzNCdmJuTmxVM1JoZEhWelBuMWNjbHh1SUNvdlhISmNibVY0Y0c5eWRDQm1kVzVqZEdsdmJpQnpaVzVrS0hObGNuWnBZMlZKUkRvZ2MzUnlhVzVuTENCMFpXMXdiR0YwWlVsRU9pQnpkSEpwYm1jc0lIUmxiWEJzWVhSbFVISmhiWE0vT2lCUFltcGxZM1FzSUhWelpYSkpSRDg2SUhOMGNtbHVaeWs2SUZCeWIyMXBjMlU4UlcxaGFXeEtVMUpsYzNCdmJuTmxVM1JoZEhWelBpQjdYSEpjYmlBZ2JHVjBJSEJoY21GdGN6b2dUMkpxWldOMElEMGdlMXh5WEc0Z0lDQWdiR2xpWDNabGNuTnBiMjQ2SUNjOFBGWkZVbE5KVDA0K1BpY3NYSEpjYmlBZ0lDQjFjMlZ5WDJsa09pQjFjMlZ5U1VRZ2ZId2dYM1Z6WlhKSlJDeGNjbHh1SUNBZ0lITmxjblpwWTJWZmFXUTZJSE5sY25acFkyVkpSQ3hjY2x4dUlDQWdJSFJsYlhCc1lYUmxYMmxrT2lCMFpXMXdiR0YwWlVsRUxGeHlYRzRnSUNBZ2RHVnRjR3hoZEdWZmNHRnlZVzF6T2lCaGNIQmxibVJIYjI5bmJHVkRZWEIwWTJoaEtIUmxiWEJzWVhSbFVISmhiWE1wWEhKY2JpQWdmVHRjY2x4dVhISmNiaUFnY21WMGRYSnVJSE5sYm1SUWIzTjBLRjl2Y21sbmFXNGdLeUFuTDJGd2FTOTJNUzR3TDJWdFlXbHNMM05sYm1RbkxDQktVMDlPTG5OMGNtbHVaMmxtZVNod1lYSmhiWE1wTENCN1hISmNiaUFnSUNBblEyOXVkR1Z1ZEMxMGVYQmxKem9nSjJGd2NHeHBZMkYwYVc5dUwycHpiMjRuWEhKY2JpQWdmU2s3WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpQlRaVzVrSUdFZ1ptOXliU0IwYUdVZ2MzQmxZMmxtYVdNZ1JXMWhhV3hLVXlCelpYSjJhV05sWEhKY2JpQXFJRUJ3WVhKaGJTQjdjM1J5YVc1bmZTQnpaWEoyYVdObFNVUWdMU0IwYUdVZ1JXMWhhV3hLVXlCelpYSjJhV05sSUVsRVhISmNiaUFxSUVCd1lYSmhiU0I3YzNSeWFXNW5mU0IwWlcxd2JHRjBaVWxFSUMwZ2RHaGxJRVZ0WVdsc1NsTWdkR1Z0Y0d4aGRHVWdTVVJjY2x4dUlDb2dRSEJoY21GdElIdHpkSEpwYm1jZ2ZDQklWRTFNUm05eWJVVnNaVzFsYm5SOUlHWnZjbTBnTFNCMGFHVWdabTl5YlNCbGJHVnRaVzUwSUc5eUlITmxiR1ZqZEc5eVhISmNiaUFxSUVCd1lYSmhiU0I3YzNSeWFXNW5mU0IxYzJWeVNVUWdMU0IwYUdVZ1JXMWhhV3hLVXlCMWMyVnlJRWxFWEhKY2JpQXFJRUJ5WlhSMWNtNXpJSHRRY205dGFYTmxQRVZ0WVdsc1NsTlNaWE53YjI1elpWTjBZWFIxY3o1OVhISmNiaUFxTDF4eVhHNWxlSEJ2Y25RZ1puVnVZM1JwYjI0Z2MyVnVaRVp2Y20wb2MyVnlkbWxqWlVsRU9pQnpkSEpwYm1jc0lIUmxiWEJzWVhSbFNVUTZJSE4wY21sdVp5d2dabTl5YlRvZ2MzUnlhVzVuSUh3Z1NGUk5URVp2Y20xRmJHVnRaVzUwTENCMWMyVnlTVVEvT2lCemRISnBibWNwT2lCUWNtOXRhWE5sUEVWdFlXbHNTbE5TWlhOd2IyNXpaVk4wWVhSMWN6NGdlMXh5WEc0Z0lHbG1JQ2gwZVhCbGIyWWdabTl5YlNBOVBUMGdKM04wY21sdVp5Y3BJSHRjY2x4dUlDQWdJR1p2Y20wZ1BTQThTRlJOVEVadmNtMUZiR1Z0Wlc1MFBtUnZZM1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0lvWm05eWJTazdYSEpjYmlBZ2ZWeHlYRzVjY2x4dUlDQnBaaUFvSVdadmNtMGdmSHdnWm05eWJTNXViMlJsVG1GdFpTQWhQVDBnSjBaUFVrMG5LU0I3WEhKY2JpQWdJQ0IwYUhKdmR5QW5SWGh3WldOMFpXUWdkR2hsSUVoVVRVd2dabTl5YlNCbGJHVnRaVzUwSUc5eUlIUm9aU0J6ZEhsc1pTQnpaV3hsWTNSdmNpQnZaaUJtYjNKdEp6dGNjbHh1SUNCOVhISmNibHh5WEc0Z0lGVkpMbkJ5YjJkeVpYTnpVM1JoZEdVb1ptOXliU2s3WEhKY2JpQWdiR1YwSUdadmNtMUVZWFJoT2lCR2IzSnRSR0YwWVNBOUlHNWxkeUJHYjNKdFJHRjBZU2htYjNKdEtUdGNjbHh1SUNCbWIzSnRSR0YwWVM1aGNIQmxibVFvSjJ4cFlsOTJaWEp6YVc5dUp5d2dKenc4VmtWU1UwbFBUajQrSnlrN1hISmNiaUFnWm05eWJVUmhkR0V1WVhCd1pXNWtLQ2R6WlhKMmFXTmxYMmxrSnl3Z2MyVnlkbWxqWlVsRUtUdGNjbHh1SUNCbWIzSnRSR0YwWVM1aGNIQmxibVFvSjNSbGJYQnNZWFJsWDJsa0p5d2dkR1Z0Y0d4aGRHVkpSQ2s3WEhKY2JpQWdabTl5YlVSaGRHRXVZWEJ3Wlc1a0tDZDFjMlZ5WDJsa0p5d2dkWE5sY2tsRUlIeDhJRjkxYzJWeVNVUXBPMXh5WEc1Y2NseHVJQ0J5WlhSMWNtNGdjMlZ1WkZCdmMzUW9YMjl5YVdkcGJpQXJJQ2N2WVhCcEwzWXhMakF2WlcxaGFXd3ZjMlZ1WkMxbWIzSnRKeXdnWm05eWJVUmhkR0VwWEhKY2JpQWdJQ0F1ZEdobGJpZ29jbVZ6Y0c5dWMyVXBJRDArSUh0Y2NseHVJQ0FnSUNBZ1ZVa3VjM1ZqWTJWemMxTjBZWFJsS0R4SVZFMU1SbTl5YlVWc1pXMWxiblErWm05eWJTazdYSEpjYmlBZ0lDQWdJSEpsZEhWeWJpQnlaWE53YjI1elpUdGNjbHh1SUNBZ0lIMHNJQ2hsY25KdmNpa2dQVDRnZTF4eVhHNGdJQ0FnSUNCVlNTNWxjbkp2Y2xOMFlYUmxLRHhJVkUxTVJtOXliVVZzWlcxbGJuUStabTl5YlNrN1hISmNiaUFnSUNBZ0lISmxkSFZ5YmlCUWNtOXRhWE5sTG5KbGFtVmpkQ2hsY25KdmNpazdYSEpjYmlBZ0lDQjlLVHRjY2x4dWZWeHlYRzRpTENKbGVIQnZjblFnWTJ4aGMzTWdSVzFoYVd4S1UxSmxjM0J2Ym5ObFUzUmhkSFZ6SUh0Y2NseHVYSEpjYmlBZ2NIVmliR2xqSUhOMFlYUjFjem9nYm5WdFltVnlPMXh5WEc0Z0lIQjFZbXhwWXlCMFpYaDBPaUJ6ZEhKcGJtYzdYSEpjYmx4eVhHNGdJR052Ym5OMGNuVmpkRzl5S0doMGRIQlNaWE53YjI1elpUb2dXRTFNU0hSMGNGSmxjWFZsYzNRcElIdGNjbHh1SUNBZ0lIUm9hWE11YzNSaGRIVnpJRDBnYUhSMGNGSmxjM0J2Ym5ObExuTjBZWFIxY3p0Y2NseHVJQ0FnSUhSb2FYTXVkR1Y0ZENBOUlHaDBkSEJTWlhOd2IyNXpaUzV5WlhOd2IyNXpaVlJsZUhRN1hISmNiaUFnZlZ4eVhHNTlYSEpjYmlJc0ltVjRjRzl5ZENCamJHRnpjeUJWU1NCN1hISmNibHh5WEc0Z0lIQnlhWFpoZEdVZ2MzUmhkR2xqSUhKbFlXUnZibXg1SUZCU1QwZFNSVk5UT2lCemRISnBibWNnUFNBblpXMWhhV3hxY3kxelpXNWthVzVuSnp0Y2NseHVJQ0J3Y21sMllYUmxJSE4wWVhScFl5QnlaV0ZrYjI1c2VTQkVUMDVGT2lCemRISnBibWNnUFNBblpXMWhhV3hxY3kxemRXTmpaWE56Snp0Y2NseHVJQ0J3Y21sMllYUmxJSE4wWVhScFl5QnlaV0ZrYjI1c2VTQkZVbEpQVWpvZ2MzUnlhVzVuSUQwZ0oyVnRZV2xzYW5NdFpYSnliM0luTzF4eVhHNWNjbHh1SUNCd2RXSnNhV01nYzNSaGRHbGpJR05zWldGeVFXeHNLR1p2Y20wNklFaFVUVXhHYjNKdFJXeGxiV1Z1ZENrNklIWnZhV1FnZTF4eVhHNGdJQ0FnWm05eWJTNWpiR0Z6YzB4cGMzUXVjbVZ0YjNabEtIUm9hWE11VUZKUFIxSkZVMU1wTzF4eVhHNGdJQ0FnWm05eWJTNWpiR0Z6YzB4cGMzUXVjbVZ0YjNabEtIUm9hWE11UkU5T1JTazdYSEpjYmlBZ0lDQm1iM0p0TG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvZEdocGN5NUZVbEpQVWlrN1hISmNiaUFnZlZ4eVhHNWNjbHh1SUNCd2RXSnNhV01nYzNSaGRHbGpJSEJ5YjJkeVpYTnpVM1JoZEdVb1ptOXliVG9nU0ZSTlRFWnZjbTFGYkdWdFpXNTBLVG9nZG05cFpDQjdYSEpjYmlBZ0lDQjBhR2x6TG1Oc1pXRnlRV3hzS0dadmNtMHBPMXh5WEc0Z0lDQWdabTl5YlM1amJHRnpjMHhwYzNRdVlXUmtLSFJvYVhNdVVGSlBSMUpGVTFNcE8xeHlYRzRnSUgxY2NseHVYSEpjYmlBZ2NIVmliR2xqSUhOMFlYUnBZeUJ6ZFdOalpYTnpVM1JoZEdVb1ptOXliVG9nU0ZSTlRFWnZjbTFGYkdWdFpXNTBLVG9nZG05cFpDQjdYSEpjYmlBZ0lDQm1iM0p0TG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvZEdocGN5NVFVazlIVWtWVFV5azdYSEpjYmlBZ0lDQm1iM0p0TG1Oc1lYTnpUR2x6ZEM1aFpHUW9kR2hwY3k1RVQwNUZLVHRjY2x4dUlDQjlYSEpjYmx4eVhHNGdJSEIxWW14cFl5QnpkR0YwYVdNZ1pYSnliM0pUZEdGMFpTaG1iM0p0T2lCSVZFMU1SbTl5YlVWc1pXMWxiblFwT2lCMmIybGtJSHRjY2x4dUlDQWdJR1p2Y20wdVkyeGhjM05NYVhOMExuSmxiVzkyWlNoMGFHbHpMbEJTVDBkU1JWTlRLVHRjY2x4dUlDQWdJR1p2Y20wdVkyeGhjM05NYVhOMExtRmtaQ2gwYUdsekxrVlNVazlTS1R0Y2NseHVJQ0I5WEhKY2JseHlYRzU5WEhKY2JpSmRmUT09In0=
