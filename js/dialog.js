'use strict';

(function () {
  var setupDomElement = document.querySelector('.setup');

  var offsetDefault = {};
  offsetDefault.TOP = getComputedStyle(setupDomElement).top;
  offsetDefault.LEFT = getComputedStyle(setupDomElement).left;


  window.dialog = {};

  window.dialog.onAvatarInputMouseDown = function (evt) {
    var setupDisplacementArea = {};
    setupDisplacementArea.minX = setupDomElement.clientWidth / 2;
    setupDisplacementArea.maxX = document.documentElement.offsetWidth - setupDomElement.clientWidth / 2;
    setupDisplacementArea.minY = 0;
    setupDisplacementArea.maxY = window.innerHeight - setupDomElement.clientWidth;

    window.globalModuleDragFreeElement(evt, setupDomElement, setupDisplacementArea);
  };

  window.dialog.resetOffset = function () {
    setupDomElement.style.top = offsetDefault.TOP;
    setupDomElement.style.left = offsetDefault.LEFT;
  };
})();
