'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;

  var currentTimeoutId = null;


  window.debounce = function (cb) {
    if (currentTimeoutId) {
      window.clearTimeout(currentTimeoutId);
    }

    currentTimeoutId = window.setTimeout(cb, DEBOUNCE_INTERVAL);
  };
})();
