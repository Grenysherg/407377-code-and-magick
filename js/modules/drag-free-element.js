'use strict';

(function () {
  window.dragFreeElement = function (evt, domElement, dragArea, additionalAction) {

    evt.preventDefault();

    var mouseStartCoordinate = {};
    mouseStartCoordinate.x = evt.clientX;
    mouseStartCoordinate.y = evt.clientY;

    var onDocumentMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {};
      shift.x = mouseStartCoordinate.x - moveEvt.clientX;
      shift.y = mouseStartCoordinate.y - moveEvt.clientY;

      var elementOffset = {};
      elementOffset.top = domElement.offsetTop - shift.y;
      elementOffset.left = domElement.offsetLeft - shift.x;

      if (dragArea) {
        if (elementOffset.top < dragArea.minY || elementOffset.top > dragArea.maxY ||
            elementOffset.left < dragArea.minX || elementOffset.left > dragArea.maxX) {
          return;
        }
      }

      mouseStartCoordinate.x = moveEvt.clientX;
      mouseStartCoordinate.y = moveEvt.clientY;

      domElement.style.top = elementOffset.top + 'px';
      domElement.style.left = elementOffset.left + 'px';

      additionalAction();
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

