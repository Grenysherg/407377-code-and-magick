'use strict';

(function () {
  window.globalModuleDragFreeElement = function (evt, element, displacementArea) {

    evt.preventDefault();

    var startCoordinate = {};
    startCoordinate.x = evt.clientX;
    startCoordinate.y = evt.clientY;

    var onDocumentMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {};
      shift.x = startCoordinate.x - moveEvt.clientX;
      shift.y = startCoordinate.y - moveEvt.clientY;

      var elementNewCoordinate = {};
      elementNewCoordinate.top = element.offsetTop - shift.y;
      elementNewCoordinate.left = element.offsetLeft - shift.x;

      if (displacementArea) {
        if (elementNewCoordinate.top < displacementArea.minY || elementNewCoordinate.top > displacementArea.maxY || elementNewCoordinate.left < displacementArea.minX || elementNewCoordinate.left > displacementArea.maxX) {
          return;
        }
      }

      startCoordinate.x = moveEvt.clientX;
      startCoordinate.y = moveEvt.clientY;

      element.style.top = elementNewCoordinate.top + 'px';
      element.style.left = elementNewCoordinate.left + 'px';
    };

    var onDocumentMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onDocumentMouseMove);
      document.removeEventListener('mouseup', onDocumentMouseUp);
    };

    document.addEventListener('mousemove', onDocumentMouseMove);
    document.addEventListener('mouseup', onDocumentMouseUp);
  };
})();
