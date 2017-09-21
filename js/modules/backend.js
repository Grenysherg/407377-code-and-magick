'use strict';

(function () {
  var status = {};
  status['OK'] = 200;


  var setupXhr = function (onActionSuccess, onActionError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = 1000;


    var onXhrLoad = function () {
      if (xhr.status === status['OK']) {
        onActionSuccess(xhr.response);
      } else {
        onActionError('Ошибка. Статус: ' + xhr.status + ' (' + xhr.statusText + ')');
      }

      removeXhrEvents();
    };

    var onXhrError = function () {
      onActionError('Произошла ошибка соединения');

      removeXhrEvents();
    };

    var onXhrTimeout = function () {
      onActionError('Запрос не успел выполниться за ' + xhr.timeout + ' мс');

      removeXhrEvents();
    };

    var addXhrEvents = function () {
      xhr.addEventListener('load', onXhrLoad);
      xhr.addEventListener('error', onXhrError);
      xhr.addEventListener('timeout', onXhrTimeout);
    };

    var removeXhrEvents = function () {
      xhr.removeEventListener('load', onXhrLoad);
      xhr.removeEventListener('error', onXhrError);
      xhr.removeEventListener('timeout', onXhrTimeout);
    };


    addXhrEvents();


    return xhr;
  };


  window.backend = {};

  window.backend.load = function (urlString, onLoadSuccess, onLoadError) {
    var xhr = setupXhr(onLoadSuccess, onLoadError);
    xhr.open('GET', urlString);
    xhr.send();
  };

  window.backend.save = function (urlString, data, onSaveSuccess, onSaveError) {
    var xhr = setupXhr(onSaveSuccess, onSaveError);
    xhr.open('POST', urlString);
    xhr.send(data);
  };
})();
