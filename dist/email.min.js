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

Promise.prototype['finally'] = function(callback) {
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
        lib_version: '2.2.1',
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
    formData.append('lib_version', '2.2.1');
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3Byb21pc2UtcG9seWZpbGwvbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RpbWVycy1icm93c2VyaWZ5L21haW4uanMiLCJzcmMvaW5kZXgudHMiLCJzcmMvbW9kZWxzL0VtYWlsSlNSZXNwb25zZVN0YXR1cy50cyIsInNyYy9zZXJ2aWNlcy91aS9VSS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDbFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUFBO0FBM0JZLGdCQUFFIiwiZmlsZSI6ImVtYWlsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIFN0b3JlIHNldFRpbWVvdXQgcmVmZXJlbmNlIHNvIHByb21pc2UtcG9seWZpbGwgd2lsbCBiZSB1bmFmZmVjdGVkIGJ5XG4vLyBvdGhlciBjb2RlIG1vZGlmeWluZyBzZXRUaW1lb3V0IChsaWtlIHNpbm9uLnVzZUZha2VUaW1lcnMoKSlcbnZhciBzZXRUaW1lb3V0RnVuYyA9IHNldFRpbWVvdXQ7XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG4vLyBQb2x5ZmlsbCBmb3IgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmRcbmZ1bmN0aW9uIGJpbmQoZm4sIHRoaXNBcmcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGZuLmFwcGx5KHRoaXNBcmcsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIFByb21pc2UoZm4pIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFByb21pc2UpKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Byb21pc2VzIG11c3QgYmUgY29uc3RydWN0ZWQgdmlhIG5ldycpO1xuICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdub3QgYSBmdW5jdGlvbicpO1xuICB0aGlzLl9zdGF0ZSA9IDA7XG4gIHRoaXMuX2hhbmRsZWQgPSBmYWxzZTtcbiAgdGhpcy5fdmFsdWUgPSB1bmRlZmluZWQ7XG4gIHRoaXMuX2RlZmVycmVkcyA9IFtdO1xuXG4gIGRvUmVzb2x2ZShmbiwgdGhpcyk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZShzZWxmLCBkZWZlcnJlZCkge1xuICB3aGlsZSAoc2VsZi5fc3RhdGUgPT09IDMpIHtcbiAgICBzZWxmID0gc2VsZi5fdmFsdWU7XG4gIH1cbiAgaWYgKHNlbGYuX3N0YXRlID09PSAwKSB7XG4gICAgc2VsZi5fZGVmZXJyZWRzLnB1c2goZGVmZXJyZWQpO1xuICAgIHJldHVybjtcbiAgfVxuICBzZWxmLl9oYW5kbGVkID0gdHJ1ZTtcbiAgUHJvbWlzZS5faW1tZWRpYXRlRm4oZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNiID0gc2VsZi5fc3RhdGUgPT09IDEgPyBkZWZlcnJlZC5vbkZ1bGZpbGxlZCA6IGRlZmVycmVkLm9uUmVqZWN0ZWQ7XG4gICAgaWYgKGNiID09PSBudWxsKSB7XG4gICAgICAoc2VsZi5fc3RhdGUgPT09IDEgPyByZXNvbHZlIDogcmVqZWN0KShkZWZlcnJlZC5wcm9taXNlLCBzZWxmLl92YWx1ZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciByZXQ7XG4gICAgdHJ5IHtcbiAgICAgIHJldCA9IGNiKHNlbGYuX3ZhbHVlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZWplY3QoZGVmZXJyZWQucHJvbWlzZSwgZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlc29sdmUoZGVmZXJyZWQucHJvbWlzZSwgcmV0KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHJlc29sdmUoc2VsZiwgbmV3VmFsdWUpIHtcbiAgdHJ5IHtcbiAgICAvLyBQcm9taXNlIFJlc29sdXRpb24gUHJvY2VkdXJlOiBodHRwczovL2dpdGh1Yi5jb20vcHJvbWlzZXMtYXBsdXMvcHJvbWlzZXMtc3BlYyN0aGUtcHJvbWlzZS1yZXNvbHV0aW9uLXByb2NlZHVyZVxuICAgIGlmIChuZXdWYWx1ZSA9PT0gc2VsZilcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0EgcHJvbWlzZSBjYW5ub3QgYmUgcmVzb2x2ZWQgd2l0aCBpdHNlbGYuJyk7XG4gICAgaWYgKFxuICAgICAgbmV3VmFsdWUgJiZcbiAgICAgICh0eXBlb2YgbmV3VmFsdWUgPT09ICdvYmplY3QnIHx8IHR5cGVvZiBuZXdWYWx1ZSA9PT0gJ2Z1bmN0aW9uJylcbiAgICApIHtcbiAgICAgIHZhciB0aGVuID0gbmV3VmFsdWUudGhlbjtcbiAgICAgIGlmIChuZXdWYWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgc2VsZi5fc3RhdGUgPSAzO1xuICAgICAgICBzZWxmLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICBmaW5hbGUoc2VsZik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZG9SZXNvbHZlKGJpbmQodGhlbiwgbmV3VmFsdWUpLCBzZWxmKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICBzZWxmLl9zdGF0ZSA9IDE7XG4gICAgc2VsZi5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBmaW5hbGUoc2VsZik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZWplY3Qoc2VsZiwgZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVqZWN0KHNlbGYsIG5ld1ZhbHVlKSB7XG4gIHNlbGYuX3N0YXRlID0gMjtcbiAgc2VsZi5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgZmluYWxlKHNlbGYpO1xufVxuXG5mdW5jdGlvbiBmaW5hbGUoc2VsZikge1xuICBpZiAoc2VsZi5fc3RhdGUgPT09IDIgJiYgc2VsZi5fZGVmZXJyZWRzLmxlbmd0aCA9PT0gMCkge1xuICAgIFByb21pc2UuX2ltbWVkaWF0ZUZuKGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCFzZWxmLl9oYW5kbGVkKSB7XG4gICAgICAgIFByb21pc2UuX3VuaGFuZGxlZFJlamVjdGlvbkZuKHNlbGYuX3ZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBzZWxmLl9kZWZlcnJlZHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBoYW5kbGUoc2VsZiwgc2VsZi5fZGVmZXJyZWRzW2ldKTtcbiAgfVxuICBzZWxmLl9kZWZlcnJlZHMgPSBudWxsO1xufVxuXG5mdW5jdGlvbiBIYW5kbGVyKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkLCBwcm9taXNlKSB7XG4gIHRoaXMub25GdWxmaWxsZWQgPSB0eXBlb2Ygb25GdWxmaWxsZWQgPT09ICdmdW5jdGlvbicgPyBvbkZ1bGZpbGxlZCA6IG51bGw7XG4gIHRoaXMub25SZWplY3RlZCA9IHR5cGVvZiBvblJlamVjdGVkID09PSAnZnVuY3Rpb24nID8gb25SZWplY3RlZCA6IG51bGw7XG4gIHRoaXMucHJvbWlzZSA9IHByb21pc2U7XG59XG5cbi8qKlxuICogVGFrZSBhIHBvdGVudGlhbGx5IG1pc2JlaGF2aW5nIHJlc29sdmVyIGZ1bmN0aW9uIGFuZCBtYWtlIHN1cmVcbiAqIG9uRnVsZmlsbGVkIGFuZCBvblJlamVjdGVkIGFyZSBvbmx5IGNhbGxlZCBvbmNlLlxuICpcbiAqIE1ha2VzIG5vIGd1YXJhbnRlZXMgYWJvdXQgYXN5bmNocm9ueS5cbiAqL1xuZnVuY3Rpb24gZG9SZXNvbHZlKGZuLCBzZWxmKSB7XG4gIHZhciBkb25lID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgZm4oXG4gICAgICBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBpZiAoZG9uZSkgcmV0dXJuO1xuICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgcmVzb2x2ZShzZWxmLCB2YWx1ZSk7XG4gICAgICB9LFxuICAgICAgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAgIGlmIChkb25lKSByZXR1cm47XG4gICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICByZWplY3Qoc2VsZiwgcmVhc29uKTtcbiAgICAgIH1cbiAgICApO1xuICB9IGNhdGNoIChleCkge1xuICAgIGlmIChkb25lKSByZXR1cm47XG4gICAgZG9uZSA9IHRydWU7XG4gICAgcmVqZWN0KHNlbGYsIGV4KTtcbiAgfVxufVxuXG5Qcm9taXNlLnByb3RvdHlwZVsnY2F0Y2gnXSA9IGZ1bmN0aW9uKG9uUmVqZWN0ZWQpIHtcbiAgcmV0dXJuIHRoaXMudGhlbihudWxsLCBvblJlamVjdGVkKTtcbn07XG5cblByb21pc2UucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuICB2YXIgcHJvbSA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKG5vb3ApO1xuXG4gIGhhbmRsZSh0aGlzLCBuZXcgSGFuZGxlcihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCwgcHJvbSkpO1xuICByZXR1cm4gcHJvbTtcbn07XG5cblByb21pc2UucHJvdG90eXBlWydmaW5hbGx5J10gPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICB2YXIgY29uc3RydWN0b3IgPSB0aGlzLmNvbnN0cnVjdG9yO1xuICByZXR1cm4gdGhpcy50aGVuKFxuICAgIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gY29uc3RydWN0b3IucmVzb2x2ZShjYWxsYmFjaygpKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yLnJlc29sdmUoY2FsbGJhY2soKSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yLnJlamVjdChyZWFzb24pO1xuICAgICAgfSk7XG4gICAgfVxuICApO1xufTtcblxuUHJvbWlzZS5hbGwgPSBmdW5jdGlvbihhcnIpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIGlmICghYXJyIHx8IHR5cGVvZiBhcnIubGVuZ3RoID09PSAndW5kZWZpbmVkJylcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Byb21pc2UuYWxsIGFjY2VwdHMgYW4gYXJyYXknKTtcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFycik7XG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAwKSByZXR1cm4gcmVzb2x2ZShbXSk7XG4gICAgdmFyIHJlbWFpbmluZyA9IGFyZ3MubGVuZ3RoO1xuXG4gICAgZnVuY3Rpb24gcmVzKGksIHZhbCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHZhbCAmJiAodHlwZW9mIHZhbCA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgICB2YXIgdGhlbiA9IHZhbC50aGVuO1xuICAgICAgICAgIGlmICh0eXBlb2YgdGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhlbi5jYWxsKFxuICAgICAgICAgICAgICB2YWwsXG4gICAgICAgICAgICAgIGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgICAgIHJlcyhpLCB2YWwpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICByZWplY3RcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGFyZ3NbaV0gPSB2YWw7XG4gICAgICAgIGlmICgtLXJlbWFpbmluZyA9PT0gMCkge1xuICAgICAgICAgIHJlc29sdmUoYXJncyk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgIHJlamVjdChleCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICByZXMoaSwgYXJnc1tpXSk7XG4gICAgfVxuICB9KTtcbn07XG5cblByb21pc2UucmVzb2x2ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlLmNvbnN0cnVjdG9yID09PSBQcm9taXNlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICByZXNvbHZlKHZhbHVlKTtcbiAgfSk7XG59O1xuXG5Qcm9taXNlLnJlamVjdCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICByZWplY3QodmFsdWUpO1xuICB9KTtcbn07XG5cblByb21pc2UucmFjZSA9IGZ1bmN0aW9uKHZhbHVlcykge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHZhbHVlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgdmFsdWVzW2ldLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICB9XG4gIH0pO1xufTtcblxuLy8gVXNlIHBvbHlmaWxsIGZvciBzZXRJbW1lZGlhdGUgZm9yIHBlcmZvcm1hbmNlIGdhaW5zXG5Qcm9taXNlLl9pbW1lZGlhdGVGbiA9XG4gICh0eXBlb2Ygc2V0SW1tZWRpYXRlID09PSAnZnVuY3Rpb24nICYmXG4gICAgZnVuY3Rpb24oZm4pIHtcbiAgICAgIHNldEltbWVkaWF0ZShmbik7XG4gICAgfSkgfHxcbiAgZnVuY3Rpb24oZm4pIHtcbiAgICBzZXRUaW1lb3V0RnVuYyhmbiwgMCk7XG4gIH07XG5cblByb21pc2UuX3VuaGFuZGxlZFJlamVjdGlvbkZuID0gZnVuY3Rpb24gX3VuaGFuZGxlZFJlamVjdGlvbkZuKGVycikge1xuICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGNvbnNvbGUpIHtcbiAgICBjb25zb2xlLndhcm4oJ1Bvc3NpYmxlIFVuaGFuZGxlZCBQcm9taXNlIFJlamVjdGlvbjonLCBlcnIpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9taXNlO1xuIiwidmFyIG5leHRUaWNrID0gcmVxdWlyZSgncHJvY2Vzcy9icm93c2VyLmpzJykubmV4dFRpY2s7XG52YXIgYXBwbHkgPSBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHk7XG52YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG52YXIgaW1tZWRpYXRlSWRzID0ge307XG52YXIgbmV4dEltbWVkaWF0ZUlkID0gMDtcblxuLy8gRE9NIEFQSXMsIGZvciBjb21wbGV0ZW5lc3NcblxuZXhwb3J0cy5zZXRUaW1lb3V0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgVGltZW91dChhcHBseS5jYWxsKHNldFRpbWVvdXQsIHdpbmRvdywgYXJndW1lbnRzKSwgY2xlYXJUaW1lb3V0KTtcbn07XG5leHBvcnRzLnNldEludGVydmFsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgVGltZW91dChhcHBseS5jYWxsKHNldEludGVydmFsLCB3aW5kb3csIGFyZ3VtZW50cyksIGNsZWFySW50ZXJ2YWwpO1xufTtcbmV4cG9ydHMuY2xlYXJUaW1lb3V0ID1cbmV4cG9ydHMuY2xlYXJJbnRlcnZhbCA9IGZ1bmN0aW9uKHRpbWVvdXQpIHsgdGltZW91dC5jbG9zZSgpOyB9O1xuXG5mdW5jdGlvbiBUaW1lb3V0KGlkLCBjbGVhckZuKSB7XG4gIHRoaXMuX2lkID0gaWQ7XG4gIHRoaXMuX2NsZWFyRm4gPSBjbGVhckZuO1xufVxuVGltZW91dC5wcm90b3R5cGUudW5yZWYgPSBUaW1lb3V0LnByb3RvdHlwZS5yZWYgPSBmdW5jdGlvbigpIHt9O1xuVGltZW91dC5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fY2xlYXJGbi5jYWxsKHdpbmRvdywgdGhpcy5faWQpO1xufTtcblxuLy8gRG9lcyBub3Qgc3RhcnQgdGhlIHRpbWUsIGp1c3Qgc2V0cyB1cCB0aGUgbWVtYmVycyBuZWVkZWQuXG5leHBvcnRzLmVucm9sbCA9IGZ1bmN0aW9uKGl0ZW0sIG1zZWNzKSB7XG4gIGNsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtcbiAgaXRlbS5faWRsZVRpbWVvdXQgPSBtc2Vjcztcbn07XG5cbmV4cG9ydHMudW5lbnJvbGwgPSBmdW5jdGlvbihpdGVtKSB7XG4gIGNsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtcbiAgaXRlbS5faWRsZVRpbWVvdXQgPSAtMTtcbn07XG5cbmV4cG9ydHMuX3VucmVmQWN0aXZlID0gZXhwb3J0cy5hY3RpdmUgPSBmdW5jdGlvbihpdGVtKSB7XG4gIGNsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtcblxuICB2YXIgbXNlY3MgPSBpdGVtLl9pZGxlVGltZW91dDtcbiAgaWYgKG1zZWNzID49IDApIHtcbiAgICBpdGVtLl9pZGxlVGltZW91dElkID0gc2V0VGltZW91dChmdW5jdGlvbiBvblRpbWVvdXQoKSB7XG4gICAgICBpZiAoaXRlbS5fb25UaW1lb3V0KVxuICAgICAgICBpdGVtLl9vblRpbWVvdXQoKTtcbiAgICB9LCBtc2Vjcyk7XG4gIH1cbn07XG5cbi8vIFRoYXQncyBub3QgaG93IG5vZGUuanMgaW1wbGVtZW50cyBpdCBidXQgdGhlIGV4cG9zZWQgYXBpIGlzIHRoZSBzYW1lLlxuZXhwb3J0cy5zZXRJbW1lZGlhdGUgPSB0eXBlb2Ygc2V0SW1tZWRpYXRlID09PSBcImZ1bmN0aW9uXCIgPyBzZXRJbW1lZGlhdGUgOiBmdW5jdGlvbihmbikge1xuICB2YXIgaWQgPSBuZXh0SW1tZWRpYXRlSWQrKztcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoIDwgMiA/IGZhbHNlIDogc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gIGltbWVkaWF0ZUlkc1tpZF0gPSB0cnVlO1xuXG4gIG5leHRUaWNrKGZ1bmN0aW9uIG9uTmV4dFRpY2soKSB7XG4gICAgaWYgKGltbWVkaWF0ZUlkc1tpZF0pIHtcbiAgICAgIC8vIGZuLmNhbGwoKSBpcyBmYXN0ZXIgc28gd2Ugb3B0aW1pemUgZm9yIHRoZSBjb21tb24gdXNlLWNhc2VcbiAgICAgIC8vIEBzZWUgaHR0cDovL2pzcGVyZi5jb20vY2FsbC1hcHBseS1zZWd1XG4gICAgICBpZiAoYXJncykge1xuICAgICAgICBmbi5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZuLmNhbGwobnVsbCk7XG4gICAgICB9XG4gICAgICAvLyBQcmV2ZW50IGlkcyBmcm9tIGxlYWtpbmdcbiAgICAgIGV4cG9ydHMuY2xlYXJJbW1lZGlhdGUoaWQpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGlkO1xufTtcblxuZXhwb3J0cy5jbGVhckltbWVkaWF0ZSA9IHR5cGVvZiBjbGVhckltbWVkaWF0ZSA9PT0gXCJmdW5jdGlvblwiID8gY2xlYXJJbW1lZGlhdGUgOiBmdW5jdGlvbihpZCkge1xuICBkZWxldGUgaW1tZWRpYXRlSWRzW2lkXTtcbn07IiwiaW1wb3J0ICogYXMgUHJvbWlzZSBmcm9tICdwcm9taXNlLXBvbHlmaWxsJztcclxuaW1wb3J0IHtFbWFpbEpTUmVzcG9uc2VTdGF0dXN9IGZyb20gJy4vbW9kZWxzL0VtYWlsSlNSZXNwb25zZVN0YXR1cyc7XHJcbmltcG9ydCB7VUl9IGZyb20gJy4vc2VydmljZXMvdWkvVUknO1xyXG5cclxubGV0IF91c2VySUQ6IHN0cmluZyA9IG51bGw7XHJcbmxldCBfb3JpZ2luOiBzdHJpbmcgPSAnaHR0cHM6Ly9hcGkuZW1haWxqcy5jb20nO1xyXG5cclxuZnVuY3Rpb24gc2VuZFBvc3QodXJsOiBzdHJpbmcsIGRhdGE6IHN0cmluZyB8IEZvcm1EYXRhLCBoZWFkZXJzOiBPYmplY3QgPSB7fSk6IFByb21pc2U8RW1haWxKU1Jlc3BvbnNlU3RhdHVzPiB7XHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgIGxldCB4aHI6IFhNTEh0dHBSZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG4gICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZXZlbnQpID0+IHtcclxuICAgICAgbGV0IHJlc3BvbnNlU3RhdHVzOiBFbWFpbEpTUmVzcG9uc2VTdGF0dXMgPSBuZXcgRW1haWxKU1Jlc3BvbnNlU3RhdHVzKDxYTUxIdHRwUmVxdWVzdD5ldmVudC50YXJnZXQpO1xyXG4gICAgICBpZiAocmVzcG9uc2VTdGF0dXMuc3RhdHVzID09PSAyMDAgfHwgcmVzcG9uc2VTdGF0dXMudGV4dCA9PT0gJ09LJykge1xyXG4gICAgICAgIHJlc29sdmUocmVzcG9uc2VTdGF0dXMpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlamVjdChyZXNwb25zZVN0YXR1cyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHhoci5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIChldmVudCkgPT4ge1xyXG4gICAgICByZWplY3QobmV3IEVtYWlsSlNSZXNwb25zZVN0YXR1cyg8WE1MSHR0cFJlcXVlc3Q+ZXZlbnQudGFyZ2V0KSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB4aHIub3BlbignUE9TVCcsIHVybCwgdHJ1ZSk7XHJcblxyXG4gICAgZm9yIChsZXQga2V5IGluIGhlYWRlcnMpIHtcclxuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihrZXksIGhlYWRlcnNba2V5XSk7XHJcbiAgICB9XHJcblxyXG4gICAgeGhyLnNlbmQoZGF0YSk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFwcGVuZEdvb2dsZUNhcHRjaGEodGVtcGxhdGVQcmFtcz86IE9iamVjdCk6IE9iamVjdCB7XHJcbiAgbGV0IGVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQgPSA8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZy1yZWNhcHRjaGEtcmVzcG9uc2UnKTtcclxuXHJcbiAgaWYgKGVsZW1lbnQgJiYgZWxlbWVudC52YWx1ZSkge1xyXG4gICAgdGVtcGxhdGVQcmFtc1snZy1yZWNhcHRjaGEtcmVzcG9uc2UnXSA9IGVsZW1lbnQudmFsdWU7XHJcbiAgfVxyXG5cclxuICBlbGVtZW50ID0gbnVsbDtcclxuICByZXR1cm4gdGVtcGxhdGVQcmFtcztcclxufVxyXG5cclxuLyoqXHJcbiAqIEluaXRpYXRpb25cclxuICogQHBhcmFtIHtzdHJpbmd9IHVzZXJJRCAtIHNldCB0aGUgRW1haWxKUyB1c2VyIElEXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBvcmlnaW4gLSBzZXQgdGhlIEVtYWlsSlMgb3JpZ2luXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaW5pdCh1c2VySUQ6IHN0cmluZywgb3JpZ2luPzogc3RyaW5nKTogdm9pZCB7XHJcbiAgX3VzZXJJRCA9IHVzZXJJRDtcclxuICBfb3JpZ2luID0gb3JpZ2luIHx8ICdodHRwczovL2FwaS5lbWFpbGpzLmNvbSc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZW5kIGEgdGVtcGxhdGUgdG8gdGhlIHNwZWNpZmljIEVtYWlsSlMgc2VydmljZVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VydmljZUlEIC0gdGhlIEVtYWlsSlMgc2VydmljZSBJRFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdGVtcGxhdGVJRCAtIHRoZSBFbWFpbEpTIHRlbXBsYXRlIElEXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSB0ZW1wbGF0ZVByYW1zIC0gdGhlIHRlbXBsYXRlIHBhcmFtcywgd2hhdCB3aWxsIGJlIHNldCB0byB0aGUgRW1haWxKUyB0ZW1wbGF0ZVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdXNlcklEIC0gdGhlIEVtYWlsSlMgdXNlciBJRFxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxFbWFpbEpTUmVzcG9uc2VTdGF0dXM+fVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHNlbmQoc2VydmljZUlEOiBzdHJpbmcsIHRlbXBsYXRlSUQ6IHN0cmluZywgdGVtcGxhdGVQcmFtcz86IE9iamVjdCwgdXNlcklEPzogc3RyaW5nKTogUHJvbWlzZTxFbWFpbEpTUmVzcG9uc2VTdGF0dXM+IHtcclxuICBsZXQgcGFyYW1zOiBPYmplY3QgPSB7XHJcbiAgICBsaWJfdmVyc2lvbjogJzw8VkVSU0lPTj4+JyxcclxuICAgIHVzZXJfaWQ6IHVzZXJJRCB8fCBfdXNlcklELFxyXG4gICAgc2VydmljZV9pZDogc2VydmljZUlELFxyXG4gICAgdGVtcGxhdGVfaWQ6IHRlbXBsYXRlSUQsXHJcbiAgICB0ZW1wbGF0ZV9wYXJhbXM6IGFwcGVuZEdvb2dsZUNhcHRjaGEodGVtcGxhdGVQcmFtcylcclxuICB9O1xyXG5cclxuICByZXR1cm4gc2VuZFBvc3QoX29yaWdpbiArICcvYXBpL3YxLjAvZW1haWwvc2VuZCcsIEpTT04uc3RyaW5naWZ5KHBhcmFtcyksIHtcclxuICAgICdDb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNlbmQgYSBmb3JtIHRoZSBzcGVjaWZpYyBFbWFpbEpTIHNlcnZpY2VcclxuICogQHBhcmFtIHtzdHJpbmd9IHNlcnZpY2VJRCAtIHRoZSBFbWFpbEpTIHNlcnZpY2UgSURcclxuICogQHBhcmFtIHtzdHJpbmd9IHRlbXBsYXRlSUQgLSB0aGUgRW1haWxKUyB0ZW1wbGF0ZSBJRFxyXG4gKiBAcGFyYW0ge3N0cmluZyB8IEhUTUxGb3JtRWxlbWVudH0gZm9ybSAtIHRoZSBmb3JtIGVsZW1lbnQgb3Igc2VsZWN0b3JcclxuICogQHBhcmFtIHtzdHJpbmd9IHVzZXJJRCAtIHRoZSBFbWFpbEpTIHVzZXIgSURcclxuICogQHJldHVybnMge1Byb21pc2U8RW1haWxKU1Jlc3BvbnNlU3RhdHVzPn1cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzZW5kRm9ybShzZXJ2aWNlSUQ6IHN0cmluZywgdGVtcGxhdGVJRDogc3RyaW5nLCBmb3JtOiBzdHJpbmcgfCBIVE1MRm9ybUVsZW1lbnQsIHVzZXJJRD86IHN0cmluZyk6IFByb21pc2U8RW1haWxKU1Jlc3BvbnNlU3RhdHVzPiB7XHJcbiAgaWYgKHR5cGVvZiBmb3JtID09PSAnc3RyaW5nJykge1xyXG4gICAgZm9ybSA9IDxIVE1MRm9ybUVsZW1lbnQ+ZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihmb3JtKTtcclxuICB9XHJcblxyXG4gIGlmICghZm9ybSB8fCBmb3JtLm5vZGVOYW1lICE9PSAnRk9STScpIHtcclxuICAgIHRocm93ICdFeHBlY3RlZCB0aGUgSFRNTCBmb3JtIGVsZW1lbnQgb3IgdGhlIHN0eWxlIHNlbGVjdG9yIG9mIGZvcm0nO1xyXG4gIH1cclxuXHJcbiAgVUkucHJvZ3Jlc3NTdGF0ZShmb3JtKTtcclxuICBsZXQgZm9ybURhdGE6IEZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGZvcm0pO1xyXG4gIGZvcm1EYXRhLmFwcGVuZCgnbGliX3ZlcnNpb24nLCAnPDxWRVJTSU9OPj4nKTtcclxuICBmb3JtRGF0YS5hcHBlbmQoJ3NlcnZpY2VfaWQnLCBzZXJ2aWNlSUQpO1xyXG4gIGZvcm1EYXRhLmFwcGVuZCgndGVtcGxhdGVfaWQnLCB0ZW1wbGF0ZUlEKTtcclxuICBmb3JtRGF0YS5hcHBlbmQoJ3VzZXJfaWQnLCB1c2VySUQgfHwgX3VzZXJJRCk7XHJcblxyXG4gIHJldHVybiBzZW5kUG9zdChfb3JpZ2luICsgJy9hcGkvdjEuMC9lbWFpbC9zZW5kLWZvcm0nLCBmb3JtRGF0YSlcclxuICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICBVSS5zdWNjZXNzU3RhdGUoPEhUTUxGb3JtRWxlbWVudD5mb3JtKTtcclxuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gICAgfSwgKGVycm9yKSA9PiB7XHJcbiAgICAgIFVJLmVycm9yU3RhdGUoPEhUTUxGb3JtRWxlbWVudD5mb3JtKTtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcclxuICAgIH0pO1xyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBFbWFpbEpTUmVzcG9uc2VTdGF0dXMge1xyXG5cclxuICBwdWJsaWMgc3RhdHVzOiBudW1iZXI7XHJcbiAgcHVibGljIHRleHQ6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IoaHR0cFJlc3BvbnNlOiBYTUxIdHRwUmVxdWVzdCkge1xyXG4gICAgdGhpcy5zdGF0dXMgPSBodHRwUmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgdGhpcy50ZXh0ID0gaHR0cFJlc3BvbnNlLnJlc3BvbnNlVGV4dDtcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGNsYXNzIFVJIHtcclxuXHJcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgUFJPR1JFU1M6IHN0cmluZyA9ICdlbWFpbGpzLXNlbmRpbmcnO1xyXG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IERPTkU6IHN0cmluZyA9ICdlbWFpbGpzLXN1Y2Nlc3MnO1xyXG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEVSUk9SOiBzdHJpbmcgPSAnZW1haWxqcy1lcnJvcic7XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgY2xlYXJBbGwoZm9ybTogSFRNTEZvcm1FbGVtZW50KTogdm9pZCB7XHJcbiAgICBmb3JtLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5QUk9HUkVTUyk7XHJcbiAgICBmb3JtLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5ET05FKTtcclxuICAgIGZvcm0uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkVSUk9SKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgcHJvZ3Jlc3NTdGF0ZShmb3JtOiBIVE1MRm9ybUVsZW1lbnQpOiB2b2lkIHtcclxuICAgIHRoaXMuY2xlYXJBbGwoZm9ybSk7XHJcbiAgICBmb3JtLmNsYXNzTGlzdC5hZGQodGhpcy5QUk9HUkVTUyk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIHN1Y2Nlc3NTdGF0ZShmb3JtOiBIVE1MRm9ybUVsZW1lbnQpOiB2b2lkIHtcclxuICAgIGZvcm0uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLlBST0dSRVNTKTtcclxuICAgIGZvcm0uY2xhc3NMaXN0LmFkZCh0aGlzLkRPTkUpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyBlcnJvclN0YXRlKGZvcm06IEhUTUxGb3JtRWxlbWVudCk6IHZvaWQge1xyXG4gICAgZm9ybS5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuUFJPR1JFU1MpO1xyXG4gICAgZm9ybS5jbGFzc0xpc3QuYWRkKHRoaXMuRVJST1IpO1xyXG4gIH1cclxuXHJcbn1cclxuIl0sInByZUV4aXN0aW5nQ29tbWVudCI6Ii8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltNXZaR1ZmYlc5a2RXeGxjeTlpY205M2MyVnlMWEJoWTJzdlgzQnlaV3gxWkdVdWFuTWlMQ0p1YjJSbFgyMXZaSFZzWlhNdmNISnZZMlZ6Y3k5aWNtOTNjMlZ5TG1weklpd2libTlrWlY5dGIyUjFiR1Z6TDNCeWIyMXBjMlV0Y0c5c2VXWnBiR3d2YkdsaUwybHVaR1Y0TG1weklpd2libTlrWlY5dGIyUjFiR1Z6TDNScGJXVnljeTFpY205M2MyVnlhV1o1TDIxaGFXNHVhbk1pTENKemNtTXZhVzVrWlhndWRITWlMQ0p6Y21NdmJXOWtaV3h6TDBWdFlXbHNTbE5TWlhOd2IyNXpaVk4wWVhSMWN5NTBjeUlzSW5OeVl5OXpaWEoyYVdObGN5OTFhUzlWU1M1MGN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRVHRCUTBGQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPenRCUTNoTVFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3T3pzN08wRkRiRkJCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenM3T3pzN1FVTXpSVUVzTUVOQlFUUkRPMEZCUXpWRExIZEZRVUZ4UlR0QlFVTnlSU3gxUTBGQmIwTTdRVUZGY0VNc1NVRkJTU3hQUVVGUExFZEJRVmNzU1VGQlNTeERRVUZETzBGQlF6TkNMRWxCUVVrc1QwRkJUeXhIUVVGWExIbENRVUY1UWl4RFFVRkRPMEZCUldoRUxHdENRVUZyUWl4SFFVRlhMRVZCUVVVc1NVRkJkVUlzUlVGQlJTeFBRVUZ2UWp0SlFVRndRaXgzUWtGQlFTeEZRVUZCTEZsQlFXOUNPMGxCUXpGRkxFOUJRVThzU1VGQlNTeFBRVUZQTEVOQlFVTXNWVUZCUXl4UFFVRlBMRVZCUVVVc1RVRkJUVHRSUVVOcVF5eEpRVUZKTEVkQlFVY3NSMEZCYlVJc1NVRkJTU3hqUVVGakxFVkJRVVVzUTBGQlF6dFJRVVV2UXl4SFFVRkhMRU5CUVVNc1owSkJRV2RDTEVOQlFVTXNUVUZCVFN4RlFVRkZMRlZCUVVNc1MwRkJTenRaUVVOcVF5eEpRVUZKTEdOQlFXTXNSMEZCTUVJc1NVRkJTU3cyUTBGQmNVSXNRMEZCYVVJc1MwRkJTeXhEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZETzFsQlEzQkhMRWxCUVVrc1kwRkJZeXhEUVVGRExFMUJRVTBzUzBGQlN5eEhRVUZITEVsQlFVa3NZMEZCWXl4RFFVRkRMRWxCUVVrc1MwRkJTeXhKUVVGSkxFVkJRVVU3WjBKQlEycEZMRTlCUVU4c1EwRkJReXhqUVVGakxFTkJRVU1zUTBGQlF6dGhRVU42UWp0cFFrRkJUVHRuUWtGRFRDeE5RVUZOTEVOQlFVTXNZMEZCWXl4RFFVRkRMRU5CUVVNN1lVRkRlRUk3VVVGRFNDeERRVUZETEVOQlFVTXNRMEZCUXp0UlFVVklMRWRCUVVjc1EwRkJReXhuUWtGQlowSXNRMEZCUXl4UFFVRlBMRVZCUVVVc1ZVRkJReXhMUVVGTE8xbEJRMnhETEUxQlFVMHNRMEZCUXl4SlFVRkpMRFpEUVVGeFFpeERRVUZwUWl4TFFVRkxMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU1zUTBGQlF6dFJRVU5zUlN4RFFVRkRMRU5CUVVNc1EwRkJRenRSUVVWSUxFZEJRVWNzUTBGQlF5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RlFVRkZMRWRCUVVjc1JVRkJSU3hKUVVGSkxFTkJRVU1zUTBGQlF6dFJRVVUxUWl4TFFVRkxMRWxCUVVrc1IwRkJSeXhKUVVGSkxFOUJRVThzUlVGQlJUdFpRVU55UWl4SFFVRkhMRU5CUVVNc1owSkJRV2RDTEVOQlFVTXNSMEZCUnl4RlFVRkZMRTlCUVU4c1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF5eERRVUZETzFOQlF6TkRPMUZCUlVRc1IwRkJSeXhEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0SlFVTnFRaXhEUVVGRExFTkJRVU1zUTBGQlF6dEJRVU5NTEVOQlFVTTdRVUZGUkN3MlFrRkJOa0lzWVVGQmMwSTdTVUZEYWtRc1NVRkJTU3hQUVVGUExFZEJRWFZETEZGQlFWRXNRMEZCUXl4alFVRmpMRU5CUVVNc2MwSkJRWE5DTEVOQlFVTXNRMEZCUXp0SlFVVnNSeXhKUVVGSkxFOUJRVThzU1VGQlNTeFBRVUZQTEVOQlFVTXNTMEZCU3l4RlFVRkZPMUZCUXpWQ0xHRkJRV0VzUTBGQlF5eHpRa0ZCYzBJc1EwRkJReXhIUVVGSExFOUJRVThzUTBGQlF5eExRVUZMTEVOQlFVTTdTMEZEZGtRN1NVRkZSQ3hQUVVGUExFZEJRVWNzU1VGQlNTeERRVUZETzBsQlEyWXNUMEZCVHl4aFFVRmhMRU5CUVVNN1FVRkRka0lzUTBGQlF6dEJRVVZFT3pzN08wZEJTVWM3UVVGRFNDeGpRVUZ4UWl4TlFVRmpMRVZCUVVVc1RVRkJaVHRKUVVOc1JDeFBRVUZQTEVkQlFVY3NUVUZCVFN4RFFVRkRPMGxCUTJwQ0xFOUJRVThzUjBGQlJ5eE5RVUZOTEVsQlFVa3NlVUpCUVhsQ0xFTkJRVU03UVVGRGFFUXNRMEZCUXp0QlFVaEVMRzlDUVVkRE8wRkJSVVE3T3pzN096czdSMEZQUnp0QlFVTklMR05CUVhGQ0xGTkJRV2xDTEVWQlFVVXNWVUZCYTBJc1JVRkJSU3hoUVVGelFpeEZRVUZGTEUxQlFXVTdTVUZEYWtjc1NVRkJTU3hOUVVGTkxFZEJRVmM3VVVGRGJrSXNWMEZCVnl4RlFVRkZMR0ZCUVdFN1VVRkRNVUlzVDBGQlR5eEZRVUZGTEUxQlFVMHNTVUZCU1N4UFFVRlBPMUZCUXpGQ0xGVkJRVlVzUlVGQlJTeFRRVUZUTzFGQlEzSkNMRmRCUVZjc1JVRkJSU3hWUVVGVk8xRkJRM1pDTEdWQlFXVXNSVUZCUlN4dFFrRkJiVUlzUTBGQlF5eGhRVUZoTEVOQlFVTTdTMEZEY0VRc1EwRkJRenRKUVVWR0xFOUJRVThzVVVGQlVTeERRVUZETEU5QlFVOHNSMEZCUnl4elFrRkJjMElzUlVGQlJTeEpRVUZKTEVOQlFVTXNVMEZCVXl4RFFVRkRMRTFCUVUwc1EwRkJReXhGUVVGRk8xRkJRM2hGTEdOQlFXTXNSVUZCUlN4clFrRkJhMEk3UzBGRGJrTXNRMEZCUXl4RFFVRkRPMEZCUTB3c1EwRkJRenRCUVZwRUxHOUNRVmxETzBGQlJVUTdPenM3T3pzN1IwRlBSenRCUVVOSUxHdENRVUY1UWl4VFFVRnBRaXhGUVVGRkxGVkJRV3RDTEVWQlFVVXNTVUZCT0VJc1JVRkJSU3hOUVVGbE8wbEJRemRITEVsQlFVa3NUMEZCVHl4SlFVRkpMRXRCUVVzc1VVRkJVU3hGUVVGRk8xRkJRelZDTEVsQlFVa3NSMEZCYjBJc1VVRkJVU3hEUVVGRExHRkJRV0VzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0TFFVTjBSRHRKUVVWRUxFbEJRVWtzUTBGQlF5eEpRVUZKTEVsQlFVa3NTVUZCU1N4RFFVRkRMRkZCUVZFc1MwRkJTeXhOUVVGTkxFVkJRVVU3VVVGRGNrTXNUVUZCVFN3NFJFRkJPRVFzUTBGQlF6dExRVU4wUlR0SlFVVkVMRTlCUVVVc1EwRkJReXhoUVVGaExFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdTVUZEZGtJc1NVRkJTU3hSUVVGUkxFZEJRV0VzU1VGQlNTeFJRVUZSTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1NVRkROVU1zVVVGQlVTeERRVUZETEUxQlFVMHNRMEZCUXl4aFFVRmhMRVZCUVVVc1lVRkJZU3hEUVVGRExFTkJRVU03U1VGRE9VTXNVVUZCVVN4RFFVRkRMRTFCUVUwc1EwRkJReXhaUVVGWkxFVkJRVVVzVTBGQlV5eERRVUZETEVOQlFVTTdTVUZEZWtNc1VVRkJVU3hEUVVGRExFMUJRVTBzUTBGQlF5eGhRVUZoTEVWQlFVVXNWVUZCVlN4RFFVRkRMRU5CUVVNN1NVRkRNME1zVVVGQlVTeERRVUZETEUxQlFVMHNRMEZCUXl4VFFVRlRMRVZCUVVVc1RVRkJUU3hKUVVGSkxFOUJRVThzUTBGQlF5eERRVUZETzBsQlJUbERMRTlCUVU4c1VVRkJVU3hEUVVGRExFOUJRVThzUjBGQlJ5d3lRa0ZCTWtJc1JVRkJSU3hSUVVGUkxFTkJRVU03VTBGRE4wUXNTVUZCU1N4RFFVRkRMRlZCUVVNc1VVRkJVVHRSUVVOaUxFOUJRVVVzUTBGQlF5eFpRVUZaTEVOQlFXdENMRWxCUVVrc1EwRkJReXhEUVVGRE8xRkJRM1pETEU5QlFVOHNVVUZCVVN4RFFVRkRPMGxCUTJ4Q0xFTkJRVU1zUlVGQlJTeFZRVUZETEV0QlFVczdVVUZEVUN4UFFVRkZMRU5CUVVNc1ZVRkJWU3hEUVVGclFpeEpRVUZKTEVOQlFVTXNRMEZCUXp0UlFVTnlReXhQUVVGUExFOUJRVThzUTBGQlF5eE5RVUZOTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNN1NVRkRMMElzUTBGQlF5eERRVUZETEVOQlFVTTdRVUZEVUN4RFFVRkRPMEZCZUVKRUxEUkNRWGRDUXpzN096czdRVU0zUjBRN1NVRkxSU3dyUWtGQldTeFpRVUUwUWp0UlFVTjBReXhKUVVGSkxFTkJRVU1zVFVGQlRTeEhRVUZITEZsQlFWa3NRMEZCUXl4TlFVRk5MRU5CUVVNN1VVRkRiRU1zU1VGQlNTeERRVUZETEVsQlFVa3NSMEZCUnl4WlFVRlpMRU5CUVVNc1dVRkJXU3hEUVVGRE8wbEJRM2hETEVOQlFVTTdTVUZEU0N3MFFrRkJRenRCUVVGRUxFTkJWRUVzUVVGVFF5eEpRVUZCTzBGQlZGa3NjMFJCUVhGQ096czdPenRCUTBGc1F6dEpRVUZCTzBsQk1rSkJMRU5CUVVNN1NVRnlRbVVzVjBGQlVTeEhRVUYwUWl4VlFVRjFRaXhKUVVGeFFqdFJRVU14UXl4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFMUJRVTBzUTBGQlF5eEpRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNN1VVRkRja01zU1VGQlNTeERRVUZETEZOQlFWTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzFGQlEycERMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU1zVFVGQlRTeERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenRKUVVOd1F5eERRVUZETzBsQlJXRXNaMEpCUVdFc1IwRkJNMElzVlVGQk5FSXNTVUZCY1VJN1VVRkRMME1zU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRSUVVOd1FpeEpRVUZKTEVOQlFVTXNVMEZCVXl4RFFVRkRMRWRCUVVjc1EwRkJReXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTTdTVUZEY0VNc1EwRkJRenRKUVVWaExHVkJRVmtzUjBGQk1VSXNWVUZCTWtJc1NVRkJjVUk3VVVGRE9VTXNTVUZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhOUVVGTkxFTkJRVU1zU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMUZCUTNKRExFbEJRVWtzUTBGQlF5eFRRVUZUTEVOQlFVTXNSMEZCUnl4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dEpRVU5vUXl4RFFVRkRPMGxCUldFc1lVRkJWU3hIUVVGNFFpeFZRVUY1UWl4SlFVRnhRanRSUVVNMVF5eEpRVUZKTEVOQlFVTXNVMEZCVXl4RFFVRkRMRTFCUVUwc1EwRkJReXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTTdVVUZEY2tNc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eEhRVUZITEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRE8wbEJRMnBETEVOQlFVTTdTVUYyUW5WQ0xGZEJRVkVzUjBGQlZ5eHBRa0ZCYVVJc1EwRkJRenRKUVVOeVF5eFBRVUZKTEVkQlFWY3NhVUpCUVdsQ0xFTkJRVU03U1VGRGFrTXNVVUZCU3l4SFFVRlhMR1ZCUVdVc1EwRkJRenRKUVhWQ01VUXNVMEZCUXp0RFFUTkNSQ3hCUVRKQ1F5eEpRVUZCTzBGQk0wSlpMR2RDUVVGRklpd2labWxzWlNJNkltZGxibVZ5WVhSbFpDNXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUlvWm5WdVkzUnBiMjRvS1h0bWRXNWpkR2x2YmlCeUtHVXNiaXgwS1h0bWRXNWpkR2x2YmlCdktHa3NaaWw3YVdZb0lXNWJhVjBwZTJsbUtDRmxXMmxkS1h0MllYSWdZejFjSW1aMWJtTjBhVzl1WENJOVBYUjVjR1Z2WmlCeVpYRjFhWEpsSmlaeVpYRjFhWEpsTzJsbUtDRm1KaVpqS1hKbGRIVnliaUJqS0drc0lUQXBPMmxtS0hVcGNtVjBkWEp1SUhVb2FTd2hNQ2s3ZG1GeUlHRTlibVYzSUVWeWNtOXlLRndpUTJGdWJtOTBJR1pwYm1RZ2JXOWtkV3hsSUNkY0lpdHBLMXdpSjF3aUtUdDBhSEp2ZHlCaExtTnZaR1U5WENKTlQwUlZURVZmVGs5VVgwWlBWVTVFWENJc1lYMTJZWElnY0QxdVcybGRQWHRsZUhCdmNuUnpPbnQ5ZlR0bFcybGRXekJkTG1OaGJHd29jQzVsZUhCdmNuUnpMR1oxYm1OMGFXOXVLSElwZTNaaGNpQnVQV1ZiYVYxYk1WMWJjbDA3Y21WMGRYSnVJRzhvYm54OGNpbDlMSEFzY0M1bGVIQnZjblJ6TEhJc1pTeHVMSFFwZlhKbGRIVnliaUJ1VzJsZExtVjRjRzl5ZEhOOVptOXlLSFpoY2lCMVBWd2lablZ1WTNScGIyNWNJajA5ZEhsd1pXOW1JSEpsY1hWcGNtVW1KbkpsY1hWcGNtVXNhVDB3TzJrOGRDNXNaVzVuZEdnN2FTc3JLVzhvZEZ0cFhTazdjbVYwZFhKdUlHOTljbVYwZFhKdUlISjlLU2dwSWl3aUx5OGdjMmhwYlNCbWIzSWdkWE5wYm1jZ2NISnZZMlZ6Y3lCcGJpQmljbTkzYzJWeVhHNTJZWElnY0hKdlkyVnpjeUE5SUcxdlpIVnNaUzVsZUhCdmNuUnpJRDBnZTMwN1hHNWNiaTh2SUdOaFkyaGxaQ0JtY205dElIZG9ZWFJsZG1WeUlHZHNiMkpoYkNCcGN5QndjbVZ6Wlc1MElITnZJSFJvWVhRZ2RHVnpkQ0J5ZFc1dVpYSnpJSFJvWVhRZ2MzUjFZaUJwZEZ4dUx5OGdaRzl1SjNRZ1luSmxZV3NnZEdocGJtZHpMaUFnUW5WMElIZGxJRzVsWldRZ2RHOGdkM0poY0NCcGRDQnBiaUJoSUhSeWVTQmpZWFJqYUNCcGJpQmpZWE5sSUdsMElHbHpYRzR2THlCM2NtRndjR1ZrSUdsdUlITjBjbWxqZENCdGIyUmxJR052WkdVZ2QyaHBZMmdnWkc5bGMyNG5kQ0JrWldacGJtVWdZVzU1SUdkc2IySmhiSE11SUNCSmRDZHpJR2x1YzJsa1pTQmhYRzR2THlCbWRXNWpkR2x2YmlCaVpXTmhkWE5sSUhSeWVTOWpZWFJqYUdWeklHUmxiM0IwYVcxcGVtVWdhVzRnWTJWeWRHRnBiaUJsYm1kcGJtVnpMbHh1WEc1MllYSWdZMkZqYUdWa1UyVjBWR2x0Wlc5MWREdGNiblpoY2lCallXTm9aV1JEYkdWaGNsUnBiV1Z2ZFhRN1hHNWNibVoxYm1OMGFXOXVJR1JsWm1GMWJIUlRaWFJVYVcxdmRYUW9LU0I3WEc0Z0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtDZHpaWFJVYVcxbGIzVjBJR2hoY3lCdWIzUWdZbVZsYmlCa1pXWnBibVZrSnlrN1hHNTlYRzVtZFc1amRHbHZiaUJrWldaaGRXeDBRMnhsWVhKVWFXMWxiM1YwSUNncElIdGNiaUFnSUNCMGFISnZkeUJ1WlhjZ1JYSnliM0lvSjJOc1pXRnlWR2x0Wlc5MWRDQm9ZWE1nYm05MElHSmxaVzRnWkdWbWFXNWxaQ2NwTzF4dWZWeHVLR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IwY25rZ2UxeHVJQ0FnSUNBZ0lDQnBaaUFvZEhsd1pXOW1JSE5sZEZScGJXVnZkWFFnUFQwOUlDZG1kVzVqZEdsdmJpY3BJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lHTmhZMmhsWkZObGRGUnBiV1Z2ZFhRZ1BTQnpaWFJVYVcxbGIzVjBPMXh1SUNBZ0lDQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRmphR1ZrVTJWMFZHbHRaVzkxZENBOUlHUmxabUYxYkhSVFpYUlVhVzF2ZFhRN1hHNGdJQ0FnSUNBZ0lIMWNiaUFnSUNCOUlHTmhkR05vSUNobEtTQjdYRzRnSUNBZ0lDQWdJR05oWTJobFpGTmxkRlJwYldWdmRYUWdQU0JrWldaaGRXeDBVMlYwVkdsdGIzVjBPMXh1SUNBZ0lIMWNiaUFnSUNCMGNua2dlMXh1SUNBZ0lDQWdJQ0JwWmlBb2RIbHdaVzltSUdOc1pXRnlWR2x0Wlc5MWRDQTlQVDBnSjJaMWJtTjBhVzl1SnlrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnWTJGamFHVmtRMnhsWVhKVWFXMWxiM1YwSUQwZ1kyeGxZWEpVYVcxbGIzVjBPMXh1SUNBZ0lDQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRmphR1ZrUTJ4bFlYSlVhVzFsYjNWMElEMGdaR1ZtWVhWc2RFTnNaV0Z5VkdsdFpXOTFkRHRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJSDBnWTJGMFkyZ2dLR1VwSUh0Y2JpQWdJQ0FnSUNBZ1kyRmphR1ZrUTJ4bFlYSlVhVzFsYjNWMElEMGdaR1ZtWVhWc2RFTnNaV0Z5VkdsdFpXOTFkRHRjYmlBZ0lDQjlYRzU5SUNncEtWeHVablZ1WTNScGIyNGdjblZ1VkdsdFpXOTFkQ2htZFc0cElIdGNiaUFnSUNCcFppQW9ZMkZqYUdWa1UyVjBWR2x0Wlc5MWRDQTlQVDBnYzJWMFZHbHRaVzkxZENrZ2UxeHVJQ0FnSUNBZ0lDQXZMMjV2Y20xaGJDQmxiblpwY205dFpXNTBjeUJwYmlCellXNWxJSE5wZEhWaGRHbHZibk5jYmlBZ0lDQWdJQ0FnY21WMGRYSnVJSE5sZEZScGJXVnZkWFFvWm5WdUxDQXdLVHRjYmlBZ0lDQjlYRzRnSUNBZ0x5OGdhV1lnYzJWMFZHbHRaVzkxZENCM1lYTnVKM1FnWVhaaGFXeGhZbXhsSUdKMWRDQjNZWE1nYkdGMGRHVnlJR1JsWm1sdVpXUmNiaUFnSUNCcFppQW9LR05oWTJobFpGTmxkRlJwYldWdmRYUWdQVDA5SUdSbFptRjFiSFJUWlhSVWFXMXZkWFFnZkh3Z0lXTmhZMmhsWkZObGRGUnBiV1Z2ZFhRcElDWW1JSE5sZEZScGJXVnZkWFFwSUh0Y2JpQWdJQ0FnSUNBZ1kyRmphR1ZrVTJWMFZHbHRaVzkxZENBOUlITmxkRlJwYldWdmRYUTdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQnpaWFJVYVcxbGIzVjBLR1oxYml3Z01DazdYRzRnSUNBZ2ZWeHVJQ0FnSUhSeWVTQjdYRzRnSUNBZ0lDQWdJQzh2SUhkb1pXNGdkMmhsYmlCemIyMWxZbTlrZVNCb1lYTWdjMk55WlhkbFpDQjNhWFJvSUhObGRGUnBiV1Z2ZFhRZ1luVjBJRzV2SUVrdVJTNGdiV0ZrWkc1bGMzTmNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHTmhZMmhsWkZObGRGUnBiV1Z2ZFhRb1puVnVMQ0F3S1R0Y2JpQWdJQ0I5SUdOaGRHTm9LR1VwZTF4dUlDQWdJQ0FnSUNCMGNua2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0x5OGdWMmhsYmlCM1pTQmhjbVVnYVc0Z1NTNUZMaUJpZFhRZ2RHaGxJSE5qY21sd2RDQm9ZWE1nWW1WbGJpQmxkbUZzWldRZ2MyOGdTUzVGTGlCa2IyVnpiaWQwSUhSeWRYTjBJSFJvWlNCbmJHOWlZV3dnYjJKcVpXTjBJSGRvWlc0Z1kyRnNiR1ZrSUc1dmNtMWhiR3g1WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z1kyRmphR1ZrVTJWMFZHbHRaVzkxZEM1allXeHNLRzUxYkd3c0lHWjFiaXdnTUNrN1hHNGdJQ0FnSUNBZ0lIMGdZMkYwWTJnb1pTbDdYRzRnSUNBZ0lDQWdJQ0FnSUNBdkx5QnpZVzFsSUdGeklHRmliM1psSUdKMWRDQjNhR1Z1SUdsMEozTWdZU0IyWlhKemFXOXVJRzltSUVrdVJTNGdkR2hoZENCdGRYTjBJR2hoZG1VZ2RHaGxJR2RzYjJKaGJDQnZZbXBsWTNRZ1ptOXlJQ2QwYUdsekp5d2dhRzl3Wm5Wc2JIa2diM1Z5SUdOdmJuUmxlSFFnWTI5eWNtVmpkQ0J2ZEdobGNuZHBjMlVnYVhRZ2QybHNiQ0IwYUhKdmR5QmhJR2RzYjJKaGJDQmxjbkp2Y2x4dUlDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlHTmhZMmhsWkZObGRGUnBiV1Z2ZFhRdVkyRnNiQ2gwYUdsekxDQm1kVzRzSURBcE8xeHVJQ0FnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVYRzVjYm4xY2JtWjFibU4wYVc5dUlISjFia05zWldGeVZHbHRaVzkxZENodFlYSnJaWElwSUh0Y2JpQWdJQ0JwWmlBb1kyRmphR1ZrUTJ4bFlYSlVhVzFsYjNWMElEMDlQU0JqYkdWaGNsUnBiV1Z2ZFhRcElIdGNiaUFnSUNBZ0lDQWdMeTl1YjNKdFlXd2daVzUyYVhKdmJXVnVkSE1nYVc0Z2MyRnVaU0J6YVhSMVlYUnBiMjV6WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJqYkdWaGNsUnBiV1Z2ZFhRb2JXRnlhMlZ5S1R0Y2JpQWdJQ0I5WEc0Z0lDQWdMeThnYVdZZ1kyeGxZWEpVYVcxbGIzVjBJSGRoYzI0bmRDQmhkbUZwYkdGaWJHVWdZblYwSUhkaGN5QnNZWFIwWlhJZ1pHVm1hVzVsWkZ4dUlDQWdJR2xtSUNnb1kyRmphR1ZrUTJ4bFlYSlVhVzFsYjNWMElEMDlQU0JrWldaaGRXeDBRMnhsWVhKVWFXMWxiM1YwSUh4OElDRmpZV05vWldSRGJHVmhjbFJwYldWdmRYUXBJQ1ltSUdOc1pXRnlWR2x0Wlc5MWRDa2dlMXh1SUNBZ0lDQWdJQ0JqWVdOb1pXUkRiR1ZoY2xScGJXVnZkWFFnUFNCamJHVmhjbFJwYldWdmRYUTdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQmpiR1ZoY2xScGJXVnZkWFFvYldGeWEyVnlLVHRjYmlBZ0lDQjlYRzRnSUNBZ2RISjVJSHRjYmlBZ0lDQWdJQ0FnTHk4Z2QyaGxiaUIzYUdWdUlITnZiV1ZpYjJSNUlHaGhjeUJ6WTNKbGQyVmtJSGRwZEdnZ2MyVjBWR2x0Wlc5MWRDQmlkWFFnYm04Z1NTNUZMaUJ0WVdSa2JtVnpjMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdZMkZqYUdWa1EyeGxZWEpVYVcxbGIzVjBLRzFoY210bGNpazdYRzRnSUNBZ2ZTQmpZWFJqYUNBb1pTbDdYRzRnSUNBZ0lDQWdJSFJ5ZVNCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0F2THlCWGFHVnVJSGRsSUdGeVpTQnBiaUJKTGtVdUlHSjFkQ0IwYUdVZ2MyTnlhWEIwSUdoaGN5QmlaV1Z1SUdWMllXeGxaQ0J6YnlCSkxrVXVJR1J2WlhOdUozUWdJSFJ5ZFhOMElIUm9aU0JuYkc5aVlXd2diMkpxWldOMElIZG9aVzRnWTJGc2JHVmtJRzV2Y20xaGJHeDVYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnWTJGamFHVmtRMnhsWVhKVWFXMWxiM1YwTG1OaGJHd29iblZzYkN3Z2JXRnlhMlZ5S1R0Y2JpQWdJQ0FnSUNBZ2ZTQmpZWFJqYUNBb1pTbDdYRzRnSUNBZ0lDQWdJQ0FnSUNBdkx5QnpZVzFsSUdGeklHRmliM1psSUdKMWRDQjNhR1Z1SUdsMEozTWdZU0IyWlhKemFXOXVJRzltSUVrdVJTNGdkR2hoZENCdGRYTjBJR2hoZG1VZ2RHaGxJR2RzYjJKaGJDQnZZbXBsWTNRZ1ptOXlJQ2QwYUdsekp5d2dhRzl3Wm5Wc2JIa2diM1Z5SUdOdmJuUmxlSFFnWTI5eWNtVmpkQ0J2ZEdobGNuZHBjMlVnYVhRZ2QybHNiQ0IwYUhKdmR5QmhJR2RzYjJKaGJDQmxjbkp2Y2k1Y2JpQWdJQ0FnSUNBZ0lDQWdJQzh2SUZOdmJXVWdkbVZ5YzJsdmJuTWdiMllnU1M1RkxpQm9ZWFpsSUdScFptWmxjbVZ1ZENCeWRXeGxjeUJtYjNJZ1kyeGxZWEpVYVcxbGIzVjBJSFp6SUhObGRGUnBiV1Z2ZFhSY2JpQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQmpZV05vWldSRGJHVmhjbFJwYldWdmRYUXVZMkZzYkNoMGFHbHpMQ0J0WVhKclpYSXBPMXh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdmVnh1WEc1Y2JseHVmVnh1ZG1GeUlIRjFaWFZsSUQwZ1cxMDdYRzUyWVhJZ1pISmhhVzVwYm1jZ1BTQm1ZV3h6WlR0Y2JuWmhjaUJqZFhKeVpXNTBVWFZsZFdVN1hHNTJZWElnY1hWbGRXVkpibVJsZUNBOUlDMHhPMXh1WEc1bWRXNWpkR2x2YmlCamJHVmhibFZ3VG1WNGRGUnBZMnNvS1NCN1hHNGdJQ0FnYVdZZ0tDRmtjbUZwYm1sdVp5QjhmQ0FoWTNWeWNtVnVkRkYxWlhWbEtTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJqdGNiaUFnSUNCOVhHNGdJQ0FnWkhKaGFXNXBibWNnUFNCbVlXeHpaVHRjYmlBZ0lDQnBaaUFvWTNWeWNtVnVkRkYxWlhWbExteGxibWQwYUNrZ2UxeHVJQ0FnSUNBZ0lDQnhkV1YxWlNBOUlHTjFjbkpsYm5SUmRXVjFaUzVqYjI1allYUW9jWFZsZFdVcE8xeHVJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUhGMVpYVmxTVzVrWlhnZ1BTQXRNVHRjYmlBZ0lDQjlYRzRnSUNBZ2FXWWdLSEYxWlhWbExteGxibWQwYUNrZ2UxeHVJQ0FnSUNBZ0lDQmtjbUZwYmxGMVpYVmxLQ2s3WEc0Z0lDQWdmVnh1ZlZ4dVhHNW1kVzVqZEdsdmJpQmtjbUZwYmxGMVpYVmxLQ2tnZTF4dUlDQWdJR2xtSUNoa2NtRnBibWx1WnlrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200N1hHNGdJQ0FnZlZ4dUlDQWdJSFpoY2lCMGFXMWxiM1YwSUQwZ2NuVnVWR2x0Wlc5MWRDaGpiR1ZoYmxWd1RtVjRkRlJwWTJzcE8xeHVJQ0FnSUdSeVlXbHVhVzVuSUQwZ2RISjFaVHRjYmx4dUlDQWdJSFpoY2lCc1pXNGdQU0J4ZFdWMVpTNXNaVzVuZEdnN1hHNGdJQ0FnZDJocGJHVW9iR1Z1S1NCN1hHNGdJQ0FnSUNBZ0lHTjFjbkpsYm5SUmRXVjFaU0E5SUhGMVpYVmxPMXh1SUNBZ0lDQWdJQ0J4ZFdWMVpTQTlJRnRkTzF4dUlDQWdJQ0FnSUNCM2FHbHNaU0FvS3l0eGRXVjFaVWx1WkdWNElEd2diR1Z1S1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0JwWmlBb1kzVnljbVZ1ZEZGMVpYVmxLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWTNWeWNtVnVkRkYxWlhWbFczRjFaWFZsU1c1a1pYaGRMbkoxYmlncE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lIRjFaWFZsU1c1a1pYZ2dQU0F0TVR0Y2JpQWdJQ0FnSUNBZ2JHVnVJRDBnY1hWbGRXVXViR1Z1WjNSb08xeHVJQ0FnSUgxY2JpQWdJQ0JqZFhKeVpXNTBVWFZsZFdVZ1BTQnVkV3hzTzF4dUlDQWdJR1J5WVdsdWFXNW5JRDBnWm1Gc2MyVTdYRzRnSUNBZ2NuVnVRMnhsWVhKVWFXMWxiM1YwS0hScGJXVnZkWFFwTzF4dWZWeHVYRzV3Y205alpYTnpMbTVsZUhSVWFXTnJJRDBnWm5WdVkzUnBiMjRnS0daMWJpa2dlMXh1SUNBZ0lIWmhjaUJoY21keklEMGdibVYzSUVGeWNtRjVLR0Z5WjNWdFpXNTBjeTVzWlc1bmRHZ2dMU0F4S1R0Y2JpQWdJQ0JwWmlBb1lYSm5kVzFsYm5SekxteGxibWQwYUNBK0lERXBJSHRjYmlBZ0lDQWdJQ0FnWm05eUlDaDJZWElnYVNBOUlERTdJR2tnUENCaGNtZDFiV1Z1ZEhNdWJHVnVaM1JvT3lCcEt5c3BJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lHRnlaM05iYVNBdElERmRJRDBnWVhKbmRXMWxiblJ6VzJsZE8xeHVJQ0FnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVJQ0FnSUhGMVpYVmxMbkIxYzJnb2JtVjNJRWwwWlcwb1puVnVMQ0JoY21kektTazdYRzRnSUNBZ2FXWWdLSEYxWlhWbExteGxibWQwYUNBOVBUMGdNU0FtSmlBaFpISmhhVzVwYm1jcElIdGNiaUFnSUNBZ0lDQWdjblZ1VkdsdFpXOTFkQ2hrY21GcGJsRjFaWFZsS1R0Y2JpQWdJQ0I5WEc1OU8xeHVYRzR2THlCMk9DQnNhV3RsY3lCd2NtVmthV04wYVdKc1pTQnZZbXBsWTNSelhHNW1kVzVqZEdsdmJpQkpkR1Z0S0daMWJpd2dZWEp5WVhrcElIdGNiaUFnSUNCMGFHbHpMbVoxYmlBOUlHWjFianRjYmlBZ0lDQjBhR2x6TG1GeWNtRjVJRDBnWVhKeVlYazdYRzU5WEc1SmRHVnRMbkJ5YjNSdmRIbHdaUzV5ZFc0Z1BTQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdkR2hwY3k1bWRXNHVZWEJ3Ykhrb2JuVnNiQ3dnZEdocGN5NWhjbkpoZVNrN1hHNTlPMXh1Y0hKdlkyVnpjeTUwYVhSc1pTQTlJQ2RpY205M2MyVnlKenRjYm5CeWIyTmxjM011WW5KdmQzTmxjaUE5SUhSeWRXVTdYRzV3Y205alpYTnpMbVZ1ZGlBOUlIdDlPMXh1Y0hKdlkyVnpjeTVoY21kMklEMGdXMTA3WEc1d2NtOWpaWE56TG5abGNuTnBiMjRnUFNBbkp6c2dMeThnWlcxd2RIa2djM1J5YVc1bklIUnZJR0YyYjJsa0lISmxaMlY0Y0NCcGMzTjFaWE5jYm5CeWIyTmxjM011ZG1WeWMybHZibk1nUFNCN2ZUdGNibHh1Wm5WdVkzUnBiMjRnYm05dmNDZ3BJSHQ5WEc1Y2JuQnliMk5sYzNNdWIyNGdQU0J1YjI5d08xeHVjSEp2WTJWemN5NWhaR1JNYVhOMFpXNWxjaUE5SUc1dmIzQTdYRzV3Y205alpYTnpMbTl1WTJVZ1BTQnViMjl3TzF4dWNISnZZMlZ6Y3k1dlptWWdQU0J1YjI5d08xeHVjSEp2WTJWemN5NXlaVzF2ZG1WTWFYTjBaVzVsY2lBOUlHNXZiM0E3WEc1d2NtOWpaWE56TG5KbGJXOTJaVUZzYkV4cGMzUmxibVZ5Y3lBOUlHNXZiM0E3WEc1d2NtOWpaWE56TG1WdGFYUWdQU0J1YjI5d08xeHVjSEp2WTJWemN5NXdjbVZ3Wlc1a1RHbHpkR1Z1WlhJZ1BTQnViMjl3TzF4dWNISnZZMlZ6Y3k1d2NtVndaVzVrVDI1alpVeHBjM1JsYm1WeUlEMGdibTl2Y0R0Y2JseHVjSEp2WTJWemN5NXNhWE4wWlc1bGNuTWdQU0JtZFc1amRHbHZiaUFvYm1GdFpTa2dleUJ5WlhSMWNtNGdXMTBnZlZ4dVhHNXdjbTlqWlhOekxtSnBibVJwYm1jZ1BTQm1kVzVqZEdsdmJpQW9ibUZ0WlNrZ2UxeHVJQ0FnSUhSb2NtOTNJRzVsZHlCRmNuSnZjaWduY0hKdlkyVnpjeTVpYVc1a2FXNW5JR2x6SUc1dmRDQnpkWEJ3YjNKMFpXUW5LVHRjYm4wN1hHNWNibkJ5YjJObGMzTXVZM2RrSUQwZ1puVnVZM1JwYjI0Z0tDa2dleUJ5WlhSMWNtNGdKeThuSUgwN1hHNXdjbTlqWlhOekxtTm9aR2x5SUQwZ1puVnVZM1JwYjI0Z0tHUnBjaWtnZTF4dUlDQWdJSFJvY205M0lHNWxkeUJGY25KdmNpZ25jSEp2WTJWemN5NWphR1JwY2lCcGN5QnViM1FnYzNWd2NHOXlkR1ZrSnlrN1hHNTlPMXh1Y0hKdlkyVnpjeTUxYldGemF5QTlJR1oxYm1OMGFXOXVLQ2tnZXlCeVpYUjFjbTRnTURzZ2ZUdGNiaUlzSWlkMWMyVWdjM1J5YVdOMEp6dGNibHh1THk4Z1UzUnZjbVVnYzJWMFZHbHRaVzkxZENCeVpXWmxjbVZ1WTJVZ2MyOGdjSEp2YldselpTMXdiMng1Wm1sc2JDQjNhV3hzSUdKbElIVnVZV1ptWldOMFpXUWdZbmxjYmk4dklHOTBhR1Z5SUdOdlpHVWdiVzlrYVdaNWFXNW5JSE5sZEZScGJXVnZkWFFnS0d4cGEyVWdjMmx1YjI0dWRYTmxSbUZyWlZScGJXVnljeWdwS1Z4dWRtRnlJSE5sZEZScGJXVnZkWFJHZFc1aklEMGdjMlYwVkdsdFpXOTFkRHRjYmx4dVpuVnVZM1JwYjI0Z2JtOXZjQ2dwSUh0OVhHNWNiaTh2SUZCdmJIbG1hV3hzSUdadmNpQkdkVzVqZEdsdmJpNXdjbTkwYjNSNWNHVXVZbWx1WkZ4dVpuVnVZM1JwYjI0Z1ltbHVaQ2htYml3Z2RHaHBjMEZ5WnlrZ2UxeHVJQ0J5WlhSMWNtNGdablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdabTR1WVhCd2JIa29kR2hwYzBGeVp5d2dZWEpuZFcxbGJuUnpLVHRjYmlBZ2ZUdGNibjFjYmx4dVpuVnVZM1JwYjI0Z1VISnZiV2x6WlNobWJpa2dlMXh1SUNCcFppQW9JU2gwYUdseklHbHVjM1JoYm1ObGIyWWdVSEp2YldselpTa3BYRzRnSUNBZ2RHaHliM2NnYm1WM0lGUjVjR1ZGY25KdmNpZ25VSEp2YldselpYTWdiWFZ6ZENCaVpTQmpiMjV6ZEhKMVkzUmxaQ0IyYVdFZ2JtVjNKeWs3WEc0Z0lHbG1JQ2gwZVhCbGIyWWdabTRnSVQwOUlDZG1kVzVqZEdsdmJpY3BJSFJvY205M0lHNWxkeUJVZVhCbFJYSnliM0lvSjI1dmRDQmhJR1oxYm1OMGFXOXVKeWs3WEc0Z0lIUm9hWE11WDNOMFlYUmxJRDBnTUR0Y2JpQWdkR2hwY3k1ZmFHRnVaR3hsWkNBOUlHWmhiSE5sTzF4dUlDQjBhR2x6TGw5MllXeDFaU0E5SUhWdVpHVm1hVzVsWkR0Y2JpQWdkR2hwY3k1ZlpHVm1aWEp5WldSeklEMGdXMTA3WEc1Y2JpQWdaRzlTWlhOdmJIWmxLR1p1TENCMGFHbHpLVHRjYm4xY2JseHVablZ1WTNScGIyNGdhR0Z1Wkd4bEtITmxiR1lzSUdSbFptVnljbVZrS1NCN1hHNGdJSGRvYVd4bElDaHpaV3htTGw5emRHRjBaU0E5UFQwZ015a2dlMXh1SUNBZ0lITmxiR1lnUFNCelpXeG1MbDkyWVd4MVpUdGNiaUFnZlZ4dUlDQnBaaUFvYzJWc1ppNWZjM1JoZEdVZ1BUMDlJREFwSUh0Y2JpQWdJQ0J6Wld4bUxsOWtaV1psY25KbFpITXVjSFZ6YUNoa1pXWmxjbkpsWkNrN1hHNGdJQ0FnY21WMGRYSnVPMXh1SUNCOVhHNGdJSE5sYkdZdVgyaGhibVJzWldRZ1BTQjBjblZsTzF4dUlDQlFjbTl0YVhObExsOXBiVzFsWkdsaGRHVkdiaWhtZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0IyWVhJZ1kySWdQU0J6Wld4bUxsOXpkR0YwWlNBOVBUMGdNU0EvSUdSbFptVnljbVZrTG05dVJuVnNabWxzYkdWa0lEb2daR1ZtWlhKeVpXUXViMjVTWldwbFkzUmxaRHRjYmlBZ0lDQnBaaUFvWTJJZ1BUMDlJRzUxYkd3cElIdGNiaUFnSUNBZ0lDaHpaV3htTGw5emRHRjBaU0E5UFQwZ01TQS9JSEpsYzI5c2RtVWdPaUJ5WldwbFkzUXBLR1JsWm1WeWNtVmtMbkJ5YjIxcGMyVXNJSE5sYkdZdVgzWmhiSFZsS1R0Y2JpQWdJQ0FnSUhKbGRIVnlianRjYmlBZ0lDQjlYRzRnSUNBZ2RtRnlJSEpsZER0Y2JpQWdJQ0IwY25rZ2UxeHVJQ0FnSUNBZ2NtVjBJRDBnWTJJb2MyVnNaaTVmZG1Gc2RXVXBPMXh1SUNBZ0lIMGdZMkYwWTJnZ0tHVXBJSHRjYmlBZ0lDQWdJSEpsYW1WamRDaGtaV1psY25KbFpDNXdjbTl0YVhObExDQmxLVHRjYmlBZ0lDQWdJSEpsZEhWeWJqdGNiaUFnSUNCOVhHNGdJQ0FnY21WemIyeDJaU2hrWldabGNuSmxaQzV3Y205dGFYTmxMQ0J5WlhRcE8xeHVJQ0I5S1R0Y2JuMWNibHh1Wm5WdVkzUnBiMjRnY21WemIyeDJaU2h6Wld4bUxDQnVaWGRXWVd4MVpTa2dlMXh1SUNCMGNua2dlMXh1SUNBZ0lDOHZJRkJ5YjIxcGMyVWdVbVZ6YjJ4MWRHbHZiaUJRY205alpXUjFjbVU2SUdoMGRIQnpPaTh2WjJsMGFIVmlMbU52YlM5d2NtOXRhWE5sY3kxaGNHeDFjeTl3Y205dGFYTmxjeTF6Y0dWakkzUm9aUzF3Y205dGFYTmxMWEpsYzI5c2RYUnBiMjR0Y0hKdlkyVmtkWEpsWEc0Z0lDQWdhV1lnS0c1bGQxWmhiSFZsSUQwOVBTQnpaV3htS1Z4dUlDQWdJQ0FnZEdoeWIzY2dibVYzSUZSNWNHVkZjbkp2Y2lnblFTQndjbTl0YVhObElHTmhibTV2ZENCaVpTQnlaWE52YkhabFpDQjNhWFJvSUdsMGMyVnNaaTRuS1R0Y2JpQWdJQ0JwWmlBb1hHNGdJQ0FnSUNCdVpYZFdZV3gxWlNBbUpseHVJQ0FnSUNBZ0tIUjVjR1Z2WmlCdVpYZFdZV3gxWlNBOVBUMGdKMjlpYW1WamRDY2dmSHdnZEhsd1pXOW1JRzVsZDFaaGJIVmxJRDA5UFNBblpuVnVZM1JwYjI0bktWeHVJQ0FnSUNrZ2UxeHVJQ0FnSUNBZ2RtRnlJSFJvWlc0Z1BTQnVaWGRXWVd4MVpTNTBhR1Z1TzF4dUlDQWdJQ0FnYVdZZ0tHNWxkMVpoYkhWbElHbHVjM1JoYm1ObGIyWWdVSEp2YldselpTa2dlMXh1SUNBZ0lDQWdJQ0J6Wld4bUxsOXpkR0YwWlNBOUlETTdYRzRnSUNBZ0lDQWdJSE5sYkdZdVgzWmhiSFZsSUQwZ2JtVjNWbUZzZFdVN1hHNGdJQ0FnSUNBZ0lHWnBibUZzWlNoelpXeG1LVHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVPMXh1SUNBZ0lDQWdmU0JsYkhObElHbG1JQ2gwZVhCbGIyWWdkR2hsYmlBOVBUMGdKMloxYm1OMGFXOXVKeWtnZTF4dUlDQWdJQ0FnSUNCa2IxSmxjMjlzZG1Vb1ltbHVaQ2gwYUdWdUxDQnVaWGRXWVd4MVpTa3NJSE5sYkdZcE8xeHVJQ0FnSUNBZ0lDQnlaWFIxY200N1hHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dUlDQWdJSE5sYkdZdVgzTjBZWFJsSUQwZ01UdGNiaUFnSUNCelpXeG1MbDkyWVd4MVpTQTlJRzVsZDFaaGJIVmxPMXh1SUNBZ0lHWnBibUZzWlNoelpXeG1LVHRjYmlBZ2ZTQmpZWFJqYUNBb1pTa2dlMXh1SUNBZ0lISmxhbVZqZENoelpXeG1MQ0JsS1R0Y2JpQWdmVnh1ZlZ4dVhHNW1kVzVqZEdsdmJpQnlaV3BsWTNRb2MyVnNaaXdnYm1WM1ZtRnNkV1VwSUh0Y2JpQWdjMlZzWmk1ZmMzUmhkR1VnUFNBeU8xeHVJQ0J6Wld4bUxsOTJZV3gxWlNBOUlHNWxkMVpoYkhWbE8xeHVJQ0JtYVc1aGJHVW9jMlZzWmlrN1hHNTlYRzVjYm1aMWJtTjBhVzl1SUdacGJtRnNaU2h6Wld4bUtTQjdYRzRnSUdsbUlDaHpaV3htTGw5emRHRjBaU0E5UFQwZ01pQW1KaUJ6Wld4bUxsOWtaV1psY25KbFpITXViR1Z1WjNSb0lEMDlQU0F3S1NCN1hHNGdJQ0FnVUhKdmJXbHpaUzVmYVcxdFpXUnBZWFJsUm00b1puVnVZM1JwYjI0b0tTQjdYRzRnSUNBZ0lDQnBaaUFvSVhObGJHWXVYMmhoYm1Sc1pXUXBJSHRjYmlBZ0lDQWdJQ0FnVUhKdmJXbHpaUzVmZFc1b1lXNWtiR1ZrVW1WcVpXTjBhVzl1Um00b2MyVnNaaTVmZG1Gc2RXVXBPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lIMHBPMXh1SUNCOVhHNWNiaUFnWm05eUlDaDJZWElnYVNBOUlEQXNJR3hsYmlBOUlITmxiR1l1WDJSbFptVnljbVZrY3k1c1pXNW5kR2c3SUdrZ1BDQnNaVzQ3SUdrckt5a2dlMXh1SUNBZ0lHaGhibVJzWlNoelpXeG1MQ0J6Wld4bUxsOWtaV1psY25KbFpITmJhVjBwTzF4dUlDQjlYRzRnSUhObGJHWXVYMlJsWm1WeWNtVmtjeUE5SUc1MWJHdzdYRzU5WEc1Y2JtWjFibU4wYVc5dUlFaGhibVJzWlhJb2IyNUdkV3htYVd4c1pXUXNJRzl1VW1WcVpXTjBaV1FzSUhCeWIyMXBjMlVwSUh0Y2JpQWdkR2hwY3k1dmJrWjFiR1pwYkd4bFpDQTlJSFI1Y0dWdlppQnZia1oxYkdacGJHeGxaQ0E5UFQwZ0oyWjFibU4wYVc5dUp5QS9JRzl1Um5Wc1ptbHNiR1ZrSURvZ2JuVnNiRHRjYmlBZ2RHaHBjeTV2YmxKbGFtVmpkR1ZrSUQwZ2RIbHdaVzltSUc5dVVtVnFaV04wWldRZ1BUMDlJQ2RtZFc1amRHbHZiaWNnUHlCdmJsSmxhbVZqZEdWa0lEb2diblZzYkR0Y2JpQWdkR2hwY3k1d2NtOXRhWE5sSUQwZ2NISnZiV2x6WlR0Y2JuMWNibHh1THlvcVhHNGdLaUJVWVd0bElHRWdjRzkwWlc1MGFXRnNiSGtnYldselltVm9ZWFpwYm1jZ2NtVnpiMngyWlhJZ1puVnVZM1JwYjI0Z1lXNWtJRzFoYTJVZ2MzVnlaVnh1SUNvZ2IyNUdkV3htYVd4c1pXUWdZVzVrSUc5dVVtVnFaV04wWldRZ1lYSmxJRzl1YkhrZ1kyRnNiR1ZrSUc5dVkyVXVYRzRnS2x4dUlDb2dUV0ZyWlhNZ2JtOGdaM1ZoY21GdWRHVmxjeUJoWW05MWRDQmhjM2x1WTJoeWIyNTVMbHh1SUNvdlhHNW1kVzVqZEdsdmJpQmtiMUpsYzI5c2RtVW9abTRzSUhObGJHWXBJSHRjYmlBZ2RtRnlJR1J2Ym1VZ1BTQm1ZV3h6WlR0Y2JpQWdkSEo1SUh0Y2JpQWdJQ0JtYmloY2JpQWdJQ0FnSUdaMWJtTjBhVzl1S0haaGJIVmxLU0I3WEc0Z0lDQWdJQ0FnSUdsbUlDaGtiMjVsS1NCeVpYUjFjbTQ3WEc0Z0lDQWdJQ0FnSUdSdmJtVWdQU0IwY25WbE8xeHVJQ0FnSUNBZ0lDQnlaWE52YkhabEtITmxiR1lzSUhaaGJIVmxLVHRjYmlBZ0lDQWdJSDBzWEc0Z0lDQWdJQ0JtZFc1amRHbHZiaWh5WldGemIyNHBJSHRjYmlBZ0lDQWdJQ0FnYVdZZ0tHUnZibVVwSUhKbGRIVnlianRjYmlBZ0lDQWdJQ0FnWkc5dVpTQTlJSFJ5ZFdVN1hHNGdJQ0FnSUNBZ0lISmxhbVZqZENoelpXeG1MQ0J5WldGemIyNHBPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lDazdYRzRnSUgwZ1kyRjBZMmdnS0dWNEtTQjdYRzRnSUNBZ2FXWWdLR1J2Ym1VcElISmxkSFZ5Ymp0Y2JpQWdJQ0JrYjI1bElEMGdkSEoxWlR0Y2JpQWdJQ0J5WldwbFkzUW9jMlZzWml3Z1pYZ3BPMXh1SUNCOVhHNTlYRzVjYmxCeWIyMXBjMlV1Y0hKdmRHOTBlWEJsV3lkallYUmphQ2RkSUQwZ1puVnVZM1JwYjI0b2IyNVNaV3BsWTNSbFpDa2dlMXh1SUNCeVpYUjFjbTRnZEdocGN5NTBhR1Z1S0c1MWJHd3NJRzl1VW1WcVpXTjBaV1FwTzF4dWZUdGNibHh1VUhKdmJXbHpaUzV3Y205MGIzUjVjR1V1ZEdobGJpQTlJR1oxYm1OMGFXOXVLRzl1Um5Wc1ptbHNiR1ZrTENCdmJsSmxhbVZqZEdWa0tTQjdYRzRnSUhaaGNpQndjbTl0SUQwZ2JtVjNJSFJvYVhNdVkyOXVjM1J5ZFdOMGIzSW9ibTl2Y0NrN1hHNWNiaUFnYUdGdVpHeGxLSFJvYVhNc0lHNWxkeUJJWVc1a2JHVnlLRzl1Um5Wc1ptbHNiR1ZrTENCdmJsSmxhbVZqZEdWa0xDQndjbTl0S1NrN1hHNGdJSEpsZEhWeWJpQndjbTl0TzF4dWZUdGNibHh1VUhKdmJXbHpaUzV3Y205MGIzUjVjR1ZiSjJacGJtRnNiSGtuWFNBOUlHWjFibU4wYVc5dUtHTmhiR3hpWVdOcktTQjdYRzRnSUhaaGNpQmpiMjV6ZEhKMVkzUnZjaUE5SUhSb2FYTXVZMjl1YzNSeWRXTjBiM0k3WEc0Z0lISmxkSFZ5YmlCMGFHbHpMblJvWlc0b1hHNGdJQ0FnWm5WdVkzUnBiMjRvZG1Gc2RXVXBJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQmpiMjV6ZEhKMVkzUnZjaTV5WlhOdmJIWmxLR05oYkd4aVlXTnJLQ2twTG5Sb1pXNG9ablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUIyWVd4MVpUdGNiaUFnSUNBZ0lIMHBPMXh1SUNBZ0lIMHNYRzRnSUNBZ1puVnVZM1JwYjI0b2NtVmhjMjl1S1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnWTI5dWMzUnlkV04wYjNJdWNtVnpiMngyWlNoallXeHNZbUZqYXlncEtTNTBhR1Z1S0daMWJtTjBhVzl1S0NrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z1kyOXVjM1J5ZFdOMGIzSXVjbVZxWldOMEtISmxZWE52YmlrN1hHNGdJQ0FnSUNCOUtUdGNiaUFnSUNCOVhHNGdJQ2s3WEc1OU8xeHVYRzVRY205dGFYTmxMbUZzYkNBOUlHWjFibU4wYVc5dUtHRnljaWtnZTF4dUlDQnlaWFIxY200Z2JtVjNJRkJ5YjIxcGMyVW9ablZ1WTNScGIyNG9jbVZ6YjJ4MlpTd2djbVZxWldOMEtTQjdYRzRnSUNBZ2FXWWdLQ0ZoY25JZ2ZId2dkSGx3Wlc5bUlHRnljaTVzWlc1bmRHZ2dQVDA5SUNkMWJtUmxabWx1WldRbktWeHVJQ0FnSUNBZ2RHaHliM2NnYm1WM0lGUjVjR1ZGY25KdmNpZ25VSEp2YldselpTNWhiR3dnWVdOalpYQjBjeUJoYmlCaGNuSmhlU2NwTzF4dUlDQWdJSFpoY2lCaGNtZHpJRDBnUVhKeVlYa3VjSEp2ZEc5MGVYQmxMbk5zYVdObExtTmhiR3dvWVhKeUtUdGNiaUFnSUNCcFppQW9ZWEpuY3k1c1pXNW5kR2dnUFQwOUlEQXBJSEpsZEhWeWJpQnlaWE52YkhabEtGdGRLVHRjYmlBZ0lDQjJZWElnY21WdFlXbHVhVzVuSUQwZ1lYSm5jeTVzWlc1bmRHZzdYRzVjYmlBZ0lDQm1kVzVqZEdsdmJpQnlaWE1vYVN3Z2RtRnNLU0I3WEc0Z0lDQWdJQ0IwY25rZ2UxeHVJQ0FnSUNBZ0lDQnBaaUFvZG1Gc0lDWW1JQ2gwZVhCbGIyWWdkbUZzSUQwOVBTQW5iMkpxWldOMEp5QjhmQ0IwZVhCbGIyWWdkbUZzSUQwOVBTQW5ablZ1WTNScGIyNG5LU2tnZTF4dUlDQWdJQ0FnSUNBZ0lIWmhjaUIwYUdWdUlEMGdkbUZzTG5Sb1pXNDdYRzRnSUNBZ0lDQWdJQ0FnYVdZZ0tIUjVjR1Z2WmlCMGFHVnVJRDA5UFNBblpuVnVZM1JwYjI0bktTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMGFHVnVMbU5oYkd3b1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUhaaGJDeGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ1puVnVZM1JwYjI0b2RtRnNLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnY21WektHa3NJSFpoYkNrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUgwc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUhKbGFtVmpkRnh1SUNBZ0lDQWdJQ0FnSUNBZ0tUdGNiaUFnSUNBZ0lDQWdJQ0FnSUhKbGRIVnlianRjYmlBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdZWEpuYzF0cFhTQTlJSFpoYkR0Y2JpQWdJQ0FnSUNBZ2FXWWdLQzB0Y21WdFlXbHVhVzVuSUQwOVBTQXdLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2NtVnpiMngyWlNoaGNtZHpLVHRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnZlNCallYUmphQ0FvWlhncElIdGNiaUFnSUNBZ0lDQWdjbVZxWldOMEtHVjRLVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQm1iM0lnS0haaGNpQnBJRDBnTURzZ2FTQThJR0Z5WjNNdWJHVnVaM1JvT3lCcEt5c3BJSHRjYmlBZ0lDQWdJSEpsY3locExDQmhjbWR6VzJsZEtUdGNiaUFnSUNCOVhHNGdJSDBwTzF4dWZUdGNibHh1VUhKdmJXbHpaUzV5WlhOdmJIWmxJRDBnWm5WdVkzUnBiMjRvZG1Gc2RXVXBJSHRjYmlBZ2FXWWdLSFpoYkhWbElDWW1JSFI1Y0dWdlppQjJZV3gxWlNBOVBUMGdKMjlpYW1WamRDY2dKaVlnZG1Gc2RXVXVZMjl1YzNSeWRXTjBiM0lnUFQwOUlGQnliMjFwYzJVcElIdGNiaUFnSUNCeVpYUjFjbTRnZG1Gc2RXVTdYRzRnSUgxY2JseHVJQ0J5WlhSMWNtNGdibVYzSUZCeWIyMXBjMlVvWm5WdVkzUnBiMjRvY21WemIyeDJaU2tnZTF4dUlDQWdJSEpsYzI5c2RtVW9kbUZzZFdVcE8xeHVJQ0I5S1R0Y2JuMDdYRzVjYmxCeWIyMXBjMlV1Y21WcVpXTjBJRDBnWm5WdVkzUnBiMjRvZG1Gc2RXVXBJSHRjYmlBZ2NtVjBkWEp1SUc1bGR5QlFjbTl0YVhObEtHWjFibU4wYVc5dUtISmxjMjlzZG1Vc0lISmxhbVZqZENrZ2UxeHVJQ0FnSUhKbGFtVmpkQ2gyWVd4MVpTazdYRzRnSUgwcE8xeHVmVHRjYmx4dVVISnZiV2x6WlM1eVlXTmxJRDBnWm5WdVkzUnBiMjRvZG1Gc2RXVnpLU0I3WEc0Z0lISmxkSFZ5YmlCdVpYY2dVSEp2YldselpTaG1kVzVqZEdsdmJpaHlaWE52YkhabExDQnlaV3BsWTNRcElIdGNiaUFnSUNCbWIzSWdLSFpoY2lCcElEMGdNQ3dnYkdWdUlEMGdkbUZzZFdWekxteGxibWQwYURzZ2FTQThJR3hsYmpzZ2FTc3JLU0I3WEc0Z0lDQWdJQ0IyWVd4MVpYTmJhVjB1ZEdobGJpaHlaWE52YkhabExDQnlaV3BsWTNRcE8xeHVJQ0FnSUgxY2JpQWdmU2s3WEc1OU8xeHVYRzR2THlCVmMyVWdjRzlzZVdacGJHd2dabTl5SUhObGRFbHRiV1ZrYVdGMFpTQm1iM0lnY0dWeVptOXliV0Z1WTJVZ1oyRnBibk5jYmxCeWIyMXBjMlV1WDJsdGJXVmthV0YwWlVadUlEMWNiaUFnS0hSNWNHVnZaaUJ6WlhSSmJXMWxaR2xoZEdVZ1BUMDlJQ2RtZFc1amRHbHZiaWNnSmlaY2JpQWdJQ0JtZFc1amRHbHZiaWhtYmlrZ2UxeHVJQ0FnSUNBZ2MyVjBTVzF0WldScFlYUmxLR1p1S1R0Y2JpQWdJQ0I5S1NCOGZGeHVJQ0JtZFc1amRHbHZiaWhtYmlrZ2UxeHVJQ0FnSUhObGRGUnBiV1Z2ZFhSR2RXNWpLR1p1TENBd0tUdGNiaUFnZlR0Y2JseHVVSEp2YldselpTNWZkVzVvWVc1a2JHVmtVbVZxWldOMGFXOXVSbTRnUFNCbWRXNWpkR2x2YmlCZmRXNW9ZVzVrYkdWa1VtVnFaV04wYVc5dVJtNG9aWEp5S1NCN1hHNGdJR2xtSUNoMGVYQmxiMllnWTI5dWMyOXNaU0FoUFQwZ0ozVnVaR1ZtYVc1bFpDY2dKaVlnWTI5dWMyOXNaU2tnZTF4dUlDQWdJR052Ym5OdmJHVXVkMkZ5YmlnblVHOXpjMmxpYkdVZ1ZXNW9ZVzVrYkdWa0lGQnliMjFwYzJVZ1VtVnFaV04wYVc5dU9pY3NJR1Z5Y2lrN0lDOHZJR1Z6YkdsdWRDMWthWE5oWW14bExXeHBibVVnYm04dFkyOXVjMjlzWlZ4dUlDQjlYRzU5TzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlGQnliMjFwYzJVN1hHNGlMQ0oyWVhJZ2JtVjRkRlJwWTJzZ1BTQnlaWEYxYVhKbEtDZHdjbTlqWlhOekwySnliM2R6WlhJdWFuTW5LUzV1WlhoMFZHbGphenRjYm5aaGNpQmhjSEJzZVNBOUlFWjFibU4wYVc5dUxuQnliM1J2ZEhsd1pTNWhjSEJzZVR0Y2JuWmhjaUJ6YkdsalpTQTlJRUZ5Y21GNUxuQnliM1J2ZEhsd1pTNXpiR2xqWlR0Y2JuWmhjaUJwYlcxbFpHbGhkR1ZKWkhNZ1BTQjdmVHRjYm5aaGNpQnVaWGgwU1cxdFpXUnBZWFJsU1dRZ1BTQXdPMXh1WEc0dkx5QkVUMDBnUVZCSmN5d2dabTl5SUdOdmJYQnNaWFJsYm1WemMxeHVYRzVsZUhCdmNuUnpMbk5sZEZScGJXVnZkWFFnUFNCbWRXNWpkR2x2YmlncElIdGNiaUFnY21WMGRYSnVJRzVsZHlCVWFXMWxiM1YwS0dGd2NHeDVMbU5oYkd3b2MyVjBWR2x0Wlc5MWRDd2dkMmx1Wkc5M0xDQmhjbWQxYldWdWRITXBMQ0JqYkdWaGNsUnBiV1Z2ZFhRcE8xeHVmVHRjYm1WNGNHOXlkSE11YzJWMFNXNTBaWEoyWVd3Z1BTQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ2NtVjBkWEp1SUc1bGR5QlVhVzFsYjNWMEtHRndjR3g1TG1OaGJHd29jMlYwU1c1MFpYSjJZV3dzSUhkcGJtUnZkeXdnWVhKbmRXMWxiblJ6S1N3Z1kyeGxZWEpKYm5SbGNuWmhiQ2s3WEc1OU8xeHVaWGh3YjNKMGN5NWpiR1ZoY2xScGJXVnZkWFFnUFZ4dVpYaHdiM0owY3k1amJHVmhja2x1ZEdWeWRtRnNJRDBnWm5WdVkzUnBiMjRvZEdsdFpXOTFkQ2tnZXlCMGFXMWxiM1YwTG1Oc2IzTmxLQ2s3SUgwN1hHNWNibVoxYm1OMGFXOXVJRlJwYldWdmRYUW9hV1FzSUdOc1pXRnlSbTRwSUh0Y2JpQWdkR2hwY3k1ZmFXUWdQU0JwWkR0Y2JpQWdkR2hwY3k1ZlkyeGxZWEpHYmlBOUlHTnNaV0Z5Um00N1hHNTlYRzVVYVcxbGIzVjBMbkJ5YjNSdmRIbHdaUzUxYm5KbFppQTlJRlJwYldWdmRYUXVjSEp2ZEc5MGVYQmxMbkpsWmlBOUlHWjFibU4wYVc5dUtDa2dlMzA3WEc1VWFXMWxiM1YwTG5CeWIzUnZkSGx3WlM1amJHOXpaU0E5SUdaMWJtTjBhVzl1S0NrZ2UxeHVJQ0IwYUdsekxsOWpiR1ZoY2tadUxtTmhiR3dvZDJsdVpHOTNMQ0IwYUdsekxsOXBaQ2s3WEc1OU8xeHVYRzR2THlCRWIyVnpJRzV2ZENCemRHRnlkQ0IwYUdVZ2RHbHRaU3dnYW5WemRDQnpaWFJ6SUhWd0lIUm9aU0J0WlcxaVpYSnpJRzVsWldSbFpDNWNibVY0Y0c5eWRITXVaVzV5YjJ4c0lEMGdablZ1WTNScGIyNG9hWFJsYlN3Z2JYTmxZM01wSUh0Y2JpQWdZMnhsWVhKVWFXMWxiM1YwS0dsMFpXMHVYMmxrYkdWVWFXMWxiM1YwU1dRcE8xeHVJQ0JwZEdWdExsOXBaR3hsVkdsdFpXOTFkQ0E5SUcxelpXTnpPMXh1ZlR0Y2JseHVaWGh3YjNKMGN5NTFibVZ1Y205c2JDQTlJR1oxYm1OMGFXOXVLR2wwWlcwcElIdGNiaUFnWTJ4bFlYSlVhVzFsYjNWMEtHbDBaVzB1WDJsa2JHVlVhVzFsYjNWMFNXUXBPMXh1SUNCcGRHVnRMbDlwWkd4bFZHbHRaVzkxZENBOUlDMHhPMXh1ZlR0Y2JseHVaWGh3YjNKMGN5NWZkVzV5WldaQlkzUnBkbVVnUFNCbGVIQnZjblJ6TG1GamRHbDJaU0E5SUdaMWJtTjBhVzl1S0dsMFpXMHBJSHRjYmlBZ1kyeGxZWEpVYVcxbGIzVjBLR2wwWlcwdVgybGtiR1ZVYVcxbGIzVjBTV1FwTzF4dVhHNGdJSFpoY2lCdGMyVmpjeUE5SUdsMFpXMHVYMmxrYkdWVWFXMWxiM1YwTzF4dUlDQnBaaUFvYlhObFkzTWdQajBnTUNrZ2UxeHVJQ0FnSUdsMFpXMHVYMmxrYkdWVWFXMWxiM1YwU1dRZ1BTQnpaWFJVYVcxbGIzVjBLR1oxYm1OMGFXOXVJRzl1VkdsdFpXOTFkQ2dwSUh0Y2JpQWdJQ0FnSUdsbUlDaHBkR1Z0TGw5dmJsUnBiV1Z2ZFhRcFhHNGdJQ0FnSUNBZ0lHbDBaVzB1WDI5dVZHbHRaVzkxZENncE8xeHVJQ0FnSUgwc0lHMXpaV056S1R0Y2JpQWdmVnh1ZlR0Y2JseHVMeThnVkdoaGRDZHpJRzV2ZENCb2IzY2dibTlrWlM1cWN5QnBiWEJzWlcxbGJuUnpJR2wwSUdKMWRDQjBhR1VnWlhod2IzTmxaQ0JoY0drZ2FYTWdkR2hsSUhOaGJXVXVYRzVsZUhCdmNuUnpMbk5sZEVsdGJXVmthV0YwWlNBOUlIUjVjR1Z2WmlCelpYUkpiVzFsWkdsaGRHVWdQVDA5SUZ3aVpuVnVZM1JwYjI1Y0lpQS9JSE5sZEVsdGJXVmthV0YwWlNBNklHWjFibU4wYVc5dUtHWnVLU0I3WEc0Z0lIWmhjaUJwWkNBOUlHNWxlSFJKYlcxbFpHbGhkR1ZKWkNzck8xeHVJQ0IyWVhJZ1lYSm5jeUE5SUdGeVozVnRaVzUwY3k1c1pXNW5kR2dnUENBeUlEOGdabUZzYzJVZ09pQnpiR2xqWlM1allXeHNLR0Z5WjNWdFpXNTBjeXdnTVNrN1hHNWNiaUFnYVcxdFpXUnBZWFJsU1dSelcybGtYU0E5SUhSeWRXVTdYRzVjYmlBZ2JtVjRkRlJwWTJzb1puVnVZM1JwYjI0Z2IyNU9aWGgwVkdsamF5Z3BJSHRjYmlBZ0lDQnBaaUFvYVcxdFpXUnBZWFJsU1dSelcybGtYU2tnZTF4dUlDQWdJQ0FnTHk4Z1ptNHVZMkZzYkNncElHbHpJR1poYzNSbGNpQnpieUIzWlNCdmNIUnBiV2w2WlNCbWIzSWdkR2hsSUdOdmJXMXZiaUIxYzJVdFkyRnpaVnh1SUNBZ0lDQWdMeThnUUhObFpTQm9kSFJ3T2k4dmFuTndaWEptTG1OdmJTOWpZV3hzTFdGd2NHeDVMWE5sWjNWY2JpQWdJQ0FnSUdsbUlDaGhjbWR6S1NCN1hHNGdJQ0FnSUNBZ0lHWnVMbUZ3Y0d4NUtHNTFiR3dzSUdGeVozTXBPMXh1SUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdabTR1WTJGc2JDaHVkV3hzS1R0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0FnSUM4dklGQnlaWFpsYm5RZ2FXUnpJR1p5YjIwZ2JHVmhhMmx1WjF4dUlDQWdJQ0FnWlhod2IzSjBjeTVqYkdWaGNrbHRiV1ZrYVdGMFpTaHBaQ2s3WEc0Z0lDQWdmVnh1SUNCOUtUdGNibHh1SUNCeVpYUjFjbTRnYVdRN1hHNTlPMXh1WEc1bGVIQnZjblJ6TG1Oc1pXRnlTVzF0WldScFlYUmxJRDBnZEhsd1pXOW1JR05zWldGeVNXMXRaV1JwWVhSbElEMDlQU0JjSW1aMWJtTjBhVzl1WENJZ1B5QmpiR1ZoY2tsdGJXVmthV0YwWlNBNklHWjFibU4wYVc5dUtHbGtLU0I3WEc0Z0lHUmxiR1YwWlNCcGJXMWxaR2xoZEdWSlpITmJhV1JkTzF4dWZUc2lMQ0pwYlhCdmNuUWdLaUJoY3lCUWNtOXRhWE5sSUdaeWIyMGdKM0J5YjIxcGMyVXRjRzlzZVdacGJHd25PMXh5WEc1cGJYQnZjblFnZTBWdFlXbHNTbE5TWlhOd2IyNXpaVk4wWVhSMWMzMGdabkp2YlNBbkxpOXRiMlJsYkhNdlJXMWhhV3hLVTFKbGMzQnZibk5sVTNSaGRIVnpKenRjY2x4dWFXMXdiM0owSUh0VlNYMGdabkp2YlNBbkxpOXpaWEoyYVdObGN5OTFhUzlWU1NjN1hISmNibHh5WEc1c1pYUWdYM1Z6WlhKSlJEb2djM1J5YVc1bklEMGdiblZzYkR0Y2NseHViR1YwSUY5dmNtbG5hVzQ2SUhOMGNtbHVaeUE5SUNkb2RIUndjem92TDJGd2FTNWxiV0ZwYkdwekxtTnZiU2M3WEhKY2JseHlYRzVtZFc1amRHbHZiaUJ6Wlc1a1VHOXpkQ2gxY213NklITjBjbWx1Wnl3Z1pHRjBZVG9nYzNSeWFXNW5JSHdnUm05eWJVUmhkR0VzSUdobFlXUmxjbk02SUU5aWFtVmpkQ0E5SUh0OUtUb2dVSEp2YldselpUeEZiV0ZwYkVwVFVtVnpjRzl1YzJWVGRHRjBkWE0rSUh0Y2NseHVJQ0J5WlhSMWNtNGdibVYzSUZCeWIyMXBjMlVvS0hKbGMyOXNkbVVzSUhKbGFtVmpkQ2tnUFQ0Z2UxeHlYRzRnSUNBZ2JHVjBJSGhvY2pvZ1dFMU1TSFIwY0ZKbGNYVmxjM1FnUFNCdVpYY2dXRTFNU0hSMGNGSmxjWFZsYzNRb0tUdGNjbHh1WEhKY2JpQWdJQ0I0YUhJdVlXUmtSWFpsYm5STWFYTjBaVzVsY2lnbmJHOWhaQ2NzSUNobGRtVnVkQ2tnUFQ0Z2UxeHlYRzRnSUNBZ0lDQnNaWFFnY21WemNHOXVjMlZUZEdGMGRYTTZJRVZ0WVdsc1NsTlNaWE53YjI1elpWTjBZWFIxY3lBOUlHNWxkeUJGYldGcGJFcFRVbVZ6Y0c5dWMyVlRkR0YwZFhNb1BGaE5URWgwZEhCU1pYRjFaWE4wUG1WMlpXNTBMblJoY21kbGRDazdYSEpjYmlBZ0lDQWdJR2xtSUNoeVpYTndiMjV6WlZOMFlYUjFjeTV6ZEdGMGRYTWdQVDA5SURJd01DQjhmQ0J5WlhOd2IyNXpaVk4wWVhSMWN5NTBaWGgwSUQwOVBTQW5UMHNuS1NCN1hISmNiaUFnSUNBZ0lDQWdjbVZ6YjJ4MlpTaHlaWE53YjI1elpWTjBZWFIxY3lrN1hISmNiaUFnSUNBZ0lIMGdaV3h6WlNCN1hISmNiaUFnSUNBZ0lDQWdjbVZxWldOMEtISmxjM0J2Ym5ObFUzUmhkSFZ6S1R0Y2NseHVJQ0FnSUNBZ2ZWeHlYRzRnSUNBZ2ZTazdYSEpjYmx4eVhHNGdJQ0FnZUdoeUxtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb0oyVnljbTl5Snl3Z0tHVjJaVzUwS1NBOVBpQjdYSEpjYmlBZ0lDQWdJSEpsYW1WamRDaHVaWGNnUlcxaGFXeEtVMUpsYzNCdmJuTmxVM1JoZEhWektEeFlUVXhJZEhSd1VtVnhkV1Z6ZEQ1bGRtVnVkQzUwWVhKblpYUXBLVHRjY2x4dUlDQWdJSDBwTzF4eVhHNWNjbHh1SUNBZ0lIaG9jaTV2Y0dWdUtDZFFUMU5VSnl3Z2RYSnNMQ0IwY25WbEtUdGNjbHh1WEhKY2JpQWdJQ0JtYjNJZ0tHeGxkQ0JyWlhrZ2FXNGdhR1ZoWkdWeWN5a2dlMXh5WEc0Z0lDQWdJQ0FnSUhob2NpNXpaWFJTWlhGMVpYTjBTR1ZoWkdWeUtHdGxlU3dnYUdWaFpHVnljMXRyWlhsZEtUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0I0YUhJdWMyVnVaQ2hrWVhSaEtUdGNjbHh1SUNCOUtUdGNjbHh1ZlZ4eVhHNWNjbHh1Wm5WdVkzUnBiMjRnWVhCd1pXNWtSMjl2WjJ4bFEyRndkR05vWVNoMFpXMXdiR0YwWlZCeVlXMXpQem9nVDJKcVpXTjBLVG9nVDJKcVpXTjBJSHRjY2x4dUlDQnNaWFFnWld4bGJXVnVkRG9nU0ZSTlRFbHVjSFYwUld4bGJXVnVkQ0E5SUR4SVZFMU1TVzV3ZFhSRmJHVnRaVzUwUG1SdlkzVnRaVzUwTG1kbGRFVnNaVzFsYm5SQ2VVbGtLQ2RuTFhKbFkyRndkR05vWVMxeVpYTndiMjV6WlNjcE8xeHlYRzVjY2x4dUlDQnBaaUFvWld4bGJXVnVkQ0FtSmlCbGJHVnRaVzUwTG5aaGJIVmxLU0I3WEhKY2JpQWdJQ0IwWlcxd2JHRjBaVkJ5WVcxeld5ZG5MWEpsWTJGd2RHTm9ZUzF5WlhOd2IyNXpaU2RkSUQwZ1pXeGxiV1Z1ZEM1MllXeDFaVHRjY2x4dUlDQjlYSEpjYmx4eVhHNGdJR1ZzWlcxbGJuUWdQU0J1ZFd4c08xeHlYRzRnSUhKbGRIVnliaUIwWlcxd2JHRjBaVkJ5WVcxek8xeHlYRzU5WEhKY2JseHlYRzR2S2lwY2NseHVJQ29nU1c1cGRHbGhkR2x2Ymx4eVhHNGdLaUJBY0dGeVlXMGdlM04wY21sdVozMGdkWE5sY2tsRUlDMGdjMlYwSUhSb1pTQkZiV0ZwYkVwVElIVnpaWElnU1VSY2NseHVJQ29nUUhCaGNtRnRJSHR6ZEhKcGJtZDlJRzl5YVdkcGJpQXRJSE5sZENCMGFHVWdSVzFoYVd4S1V5QnZjbWxuYVc1Y2NseHVJQ292WEhKY2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCcGJtbDBLSFZ6WlhKSlJEb2djM1J5YVc1bkxDQnZjbWxuYVc0L09pQnpkSEpwYm1jcE9pQjJiMmxrSUh0Y2NseHVJQ0JmZFhObGNrbEVJRDBnZFhObGNrbEVPMXh5WEc0Z0lGOXZjbWxuYVc0Z1BTQnZjbWxuYVc0Z2ZId2dKMmgwZEhCek9pOHZZWEJwTG1WdFlXbHNhbk11WTI5dEp6dGNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSUZObGJtUWdZU0IwWlcxd2JHRjBaU0IwYnlCMGFHVWdjM0JsWTJsbWFXTWdSVzFoYVd4S1V5QnpaWEoyYVdObFhISmNiaUFxSUVCd1lYSmhiU0I3YzNSeWFXNW5mU0J6WlhKMmFXTmxTVVFnTFNCMGFHVWdSVzFoYVd4S1V5QnpaWEoyYVdObElFbEVYSEpjYmlBcUlFQndZWEpoYlNCN2MzUnlhVzVuZlNCMFpXMXdiR0YwWlVsRUlDMGdkR2hsSUVWdFlXbHNTbE1nZEdWdGNHeGhkR1VnU1VSY2NseHVJQ29nUUhCaGNtRnRJSHRQWW1wbFkzUjlJSFJsYlhCc1lYUmxVSEpoYlhNZ0xTQjBhR1VnZEdWdGNHeGhkR1VnY0dGeVlXMXpMQ0IzYUdGMElIZHBiR3dnWW1VZ2MyVjBJSFJ2SUhSb1pTQkZiV0ZwYkVwVElIUmxiWEJzWVhSbFhISmNiaUFxSUVCd1lYSmhiU0I3YzNSeWFXNW5mU0IxYzJWeVNVUWdMU0IwYUdVZ1JXMWhhV3hLVXlCMWMyVnlJRWxFWEhKY2JpQXFJRUJ5WlhSMWNtNXpJSHRRY205dGFYTmxQRVZ0WVdsc1NsTlNaWE53YjI1elpWTjBZWFIxY3o1OVhISmNiaUFxTDF4eVhHNWxlSEJ2Y25RZ1puVnVZM1JwYjI0Z2MyVnVaQ2h6WlhKMmFXTmxTVVE2SUhOMGNtbHVaeXdnZEdWdGNHeGhkR1ZKUkRvZ2MzUnlhVzVuTENCMFpXMXdiR0YwWlZCeVlXMXpQem9nVDJKcVpXTjBMQ0IxYzJWeVNVUS9PaUJ6ZEhKcGJtY3BPaUJRY205dGFYTmxQRVZ0WVdsc1NsTlNaWE53YjI1elpWTjBZWFIxY3o0Z2UxeHlYRzRnSUd4bGRDQndZWEpoYlhNNklFOWlhbVZqZENBOUlIdGNjbHh1SUNBZ0lHeHBZbDkyWlhKemFXOXVPaUFuUER4V1JWSlRTVTlPUGo0bkxGeHlYRzRnSUNBZ2RYTmxjbDlwWkRvZ2RYTmxja2xFSUh4OElGOTFjMlZ5U1VRc1hISmNiaUFnSUNCelpYSjJhV05sWDJsa09pQnpaWEoyYVdObFNVUXNYSEpjYmlBZ0lDQjBaVzF3YkdGMFpWOXBaRG9nZEdWdGNHeGhkR1ZKUkN4Y2NseHVJQ0FnSUhSbGJYQnNZWFJsWDNCaGNtRnRjem9nWVhCd1pXNWtSMjl2WjJ4bFEyRndkR05vWVNoMFpXMXdiR0YwWlZCeVlXMXpLVnh5WEc0Z0lIMDdYSEpjYmx4eVhHNGdJSEpsZEhWeWJpQnpaVzVrVUc5emRDaGZiM0pwWjJsdUlDc2dKeTloY0drdmRqRXVNQzlsYldGcGJDOXpaVzVrSnl3Z1NsTlBUaTV6ZEhKcGJtZHBabmtvY0dGeVlXMXpLU3dnZTF4eVhHNGdJQ0FnSjBOdmJuUmxiblF0ZEhsd1pTYzZJQ2RoY0hCc2FXTmhkR2x2Ymk5cWMyOXVKMXh5WEc0Z0lIMHBPMXh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZ1UyVnVaQ0JoSUdadmNtMGdkR2hsSUhOd1pXTnBabWxqSUVWdFlXbHNTbE1nYzJWeWRtbGpaVnh5WEc0Z0tpQkFjR0Z5WVcwZ2UzTjBjbWx1WjMwZ2MyVnlkbWxqWlVsRUlDMGdkR2hsSUVWdFlXbHNTbE1nYzJWeWRtbGpaU0JKUkZ4eVhHNGdLaUJBY0dGeVlXMGdlM04wY21sdVozMGdkR1Z0Y0d4aGRHVkpSQ0F0SUhSb1pTQkZiV0ZwYkVwVElIUmxiWEJzWVhSbElFbEVYSEpjYmlBcUlFQndZWEpoYlNCN2MzUnlhVzVuSUh3Z1NGUk5URVp2Y20xRmJHVnRaVzUwZlNCbWIzSnRJQzBnZEdobElHWnZjbTBnWld4bGJXVnVkQ0J2Y2lCelpXeGxZM1J2Y2x4eVhHNGdLaUJBY0dGeVlXMGdlM04wY21sdVozMGdkWE5sY2tsRUlDMGdkR2hsSUVWdFlXbHNTbE1nZFhObGNpQkpSRnh5WEc0Z0tpQkFjbVYwZFhKdWN5QjdVSEp2YldselpUeEZiV0ZwYkVwVFVtVnpjRzl1YzJWVGRHRjBkWE0rZlZ4eVhHNGdLaTljY2x4dVpYaHdiM0owSUdaMWJtTjBhVzl1SUhObGJtUkdiM0p0S0hObGNuWnBZMlZKUkRvZ2MzUnlhVzVuTENCMFpXMXdiR0YwWlVsRU9pQnpkSEpwYm1jc0lHWnZjbTA2SUhOMGNtbHVaeUI4SUVoVVRVeEdiM0p0Uld4bGJXVnVkQ3dnZFhObGNrbEVQem9nYzNSeWFXNW5LVG9nVUhKdmJXbHpaVHhGYldGcGJFcFRVbVZ6Y0c5dWMyVlRkR0YwZFhNK0lIdGNjbHh1SUNCcFppQW9kSGx3Wlc5bUlHWnZjbTBnUFQwOUlDZHpkSEpwYm1jbktTQjdYSEpjYmlBZ0lDQm1iM0p0SUQwZ1BFaFVUVXhHYjNKdFJXeGxiV1Z1ZEQ1a2IyTjFiV1Z1ZEM1eGRXVnllVk5sYkdWamRHOXlLR1p2Y20wcE8xeHlYRzRnSUgxY2NseHVYSEpjYmlBZ2FXWWdLQ0ZtYjNKdElIeDhJR1p2Y20wdWJtOWtaVTVoYldVZ0lUMDlJQ2RHVDFKTkp5a2dlMXh5WEc0Z0lDQWdkR2h5YjNjZ0owVjRjR1ZqZEdWa0lIUm9aU0JJVkUxTUlHWnZjbTBnWld4bGJXVnVkQ0J2Y2lCMGFHVWdjM1I1YkdVZ2MyVnNaV04wYjNJZ2IyWWdabTl5YlNjN1hISmNiaUFnZlZ4eVhHNWNjbHh1SUNCVlNTNXdjbTluY21WemMxTjBZWFJsS0dadmNtMHBPMXh5WEc0Z0lHeGxkQ0JtYjNKdFJHRjBZVG9nUm05eWJVUmhkR0VnUFNCdVpYY2dSbTl5YlVSaGRHRW9abTl5YlNrN1hISmNiaUFnWm05eWJVUmhkR0V1WVhCd1pXNWtLQ2RzYVdKZmRtVnljMmx2Ymljc0lDYzhQRlpGVWxOSlQwNCtQaWNwTzF4eVhHNGdJR1p2Y20xRVlYUmhMbUZ3Y0dWdVpDZ25jMlZ5ZG1salpWOXBaQ2NzSUhObGNuWnBZMlZKUkNrN1hISmNiaUFnWm05eWJVUmhkR0V1WVhCd1pXNWtLQ2QwWlcxd2JHRjBaVjlwWkNjc0lIUmxiWEJzWVhSbFNVUXBPMXh5WEc0Z0lHWnZjbTFFWVhSaExtRndjR1Z1WkNnbmRYTmxjbDlwWkNjc0lIVnpaWEpKUkNCOGZDQmZkWE5sY2tsRUtUdGNjbHh1WEhKY2JpQWdjbVYwZFhKdUlITmxibVJRYjNOMEtGOXZjbWxuYVc0Z0t5QW5MMkZ3YVM5Mk1TNHdMMlZ0WVdsc0wzTmxibVF0Wm05eWJTY3NJR1p2Y20xRVlYUmhLVnh5WEc0Z0lDQWdMblJvWlc0b0tISmxjM0J2Ym5ObEtTQTlQaUI3WEhKY2JpQWdJQ0FnSUZWSkxuTjFZMk5sYzNOVGRHRjBaU2c4U0ZSTlRFWnZjbTFGYkdWdFpXNTBQbVp2Y20wcE8xeHlYRzRnSUNBZ0lDQnlaWFIxY200Z2NtVnpjRzl1YzJVN1hISmNiaUFnSUNCOUxDQW9aWEp5YjNJcElEMCtJSHRjY2x4dUlDQWdJQ0FnVlVrdVpYSnliM0pUZEdGMFpTZzhTRlJOVEVadmNtMUZiR1Z0Wlc1MFBtWnZjbTBwTzF4eVhHNGdJQ0FnSUNCeVpYUjFjbTRnVUhKdmJXbHpaUzV5WldwbFkzUW9aWEp5YjNJcE8xeHlYRzRnSUNBZ2ZTazdYSEpjYm4xY2NseHVJaXdpWlhod2IzSjBJR05zWVhOeklFVnRZV2xzU2xOU1pYTndiMjV6WlZOMFlYUjFjeUI3WEhKY2JseHlYRzRnSUhCMVlteHBZeUJ6ZEdGMGRYTTZJRzUxYldKbGNqdGNjbHh1SUNCd2RXSnNhV01nZEdWNGREb2djM1J5YVc1bk8xeHlYRzVjY2x4dUlDQmpiMjV6ZEhKMVkzUnZjaWhvZEhSd1VtVnpjRzl1YzJVNklGaE5URWgwZEhCU1pYRjFaWE4wS1NCN1hISmNiaUFnSUNCMGFHbHpMbk4wWVhSMWN5QTlJR2gwZEhCU1pYTndiMjV6WlM1emRHRjBkWE03WEhKY2JpQWdJQ0IwYUdsekxuUmxlSFFnUFNCb2RIUndVbVZ6Y0c5dWMyVXVjbVZ6Y0c5dWMyVlVaWGgwTzF4eVhHNGdJSDFjY2x4dWZWeHlYRzRpTENKbGVIQnZjblFnWTJ4aGMzTWdWVWtnZTF4eVhHNWNjbHh1SUNCd2NtbDJZWFJsSUhOMFlYUnBZeUJ5WldGa2IyNXNlU0JRVWs5SFVrVlRVem9nYzNSeWFXNW5JRDBnSjJWdFlXbHNhbk10YzJWdVpHbHVaeWM3WEhKY2JpQWdjSEpwZG1GMFpTQnpkR0YwYVdNZ2NtVmhaRzl1YkhrZ1JFOU9SVG9nYzNSeWFXNW5JRDBnSjJWdFlXbHNhbk10YzNWalkyVnpjeWM3WEhKY2JpQWdjSEpwZG1GMFpTQnpkR0YwYVdNZ2NtVmhaRzl1YkhrZ1JWSlNUMUk2SUhOMGNtbHVaeUE5SUNkbGJXRnBiR3B6TFdWeWNtOXlKenRjY2x4dVhISmNiaUFnY0hWaWJHbGpJSE4wWVhScFl5QmpiR1ZoY2tGc2JDaG1iM0p0T2lCSVZFMU1SbTl5YlVWc1pXMWxiblFwT2lCMmIybGtJSHRjY2x4dUlDQWdJR1p2Y20wdVkyeGhjM05NYVhOMExuSmxiVzkyWlNoMGFHbHpMbEJTVDBkU1JWTlRLVHRjY2x4dUlDQWdJR1p2Y20wdVkyeGhjM05NYVhOMExuSmxiVzkyWlNoMGFHbHpMa1JQVGtVcE8xeHlYRzRnSUNBZ1ptOXliUzVqYkdGemMweHBjM1F1Y21WdGIzWmxLSFJvYVhNdVJWSlNUMUlwTzF4eVhHNGdJSDFjY2x4dVhISmNiaUFnY0hWaWJHbGpJSE4wWVhScFl5QndjbTluY21WemMxTjBZWFJsS0dadmNtMDZJRWhVVFV4R2IzSnRSV3hsYldWdWRDazZJSFp2YVdRZ2UxeHlYRzRnSUNBZ2RHaHBjeTVqYkdWaGNrRnNiQ2htYjNKdEtUdGNjbHh1SUNBZ0lHWnZjbTB1WTJ4aGMzTk1hWE4wTG1Ga1pDaDBhR2x6TGxCU1QwZFNSVk5US1R0Y2NseHVJQ0I5WEhKY2JseHlYRzRnSUhCMVlteHBZeUJ6ZEdGMGFXTWdjM1ZqWTJWemMxTjBZWFJsS0dadmNtMDZJRWhVVFV4R2IzSnRSV3hsYldWdWRDazZJSFp2YVdRZ2UxeHlYRzRnSUNBZ1ptOXliUzVqYkdGemMweHBjM1F1Y21WdGIzWmxLSFJvYVhNdVVGSlBSMUpGVTFNcE8xeHlYRzRnSUNBZ1ptOXliUzVqYkdGemMweHBjM1F1WVdSa0tIUm9hWE11UkU5T1JTazdYSEpjYmlBZ2ZWeHlYRzVjY2x4dUlDQndkV0pzYVdNZ2MzUmhkR2xqSUdWeWNtOXlVM1JoZEdVb1ptOXliVG9nU0ZSTlRFWnZjbTFGYkdWdFpXNTBLVG9nZG05cFpDQjdYSEpjYmlBZ0lDQm1iM0p0TG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvZEdocGN5NVFVazlIVWtWVFV5azdYSEpjYmlBZ0lDQm1iM0p0TG1Oc1lYTnpUR2x6ZEM1aFpHUW9kR2hwY3k1RlVsSlBVaWs3WEhKY2JpQWdmVnh5WEc1Y2NseHVmVnh5WEc0aVhYMD0ifQ==
