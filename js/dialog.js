'use strict';

(function () {
  var setupDomElement = document.querySelector('.setup');

  var offsetDefault = {};
  offsetDefault.TOP = getComputedStyle(setupDomElement).top;
  offsetDefault.LEFT = getComputedStyle(setupDomElement).left;


  window.dialog = {};

  window.dialog.onAvatarInputMouseDown = function (evt) {
    var setupDragArea = {};
    setupDragArea.minX = setupDomElement.clientWidth / 2;
    setupDragArea.maxX = document.documentElement.offsetWidth - setupDomElement.clientWidth / 2;
    setupDragArea.minY = 0;
    setupDragArea.maxY = window.innerHeight - setupDomElement.clientHeight;

    window.dragFreeElement(evt, setupDomElement, setupDragArea);
  };

  window.dialog.resetOffset = function () {
    setupDomElement.style.top = offsetDefault.TOP;
    setupDomElement.style.left = offsetDefault.LEFT;
  };
})();
