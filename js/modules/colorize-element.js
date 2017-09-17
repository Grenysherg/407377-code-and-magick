'use strict';

(function () {
  window.colorizeElement = function (colors, colorsElementIndex, onColorChange) {
    var color = colors[colorsElementIndex] || window.util.getRandomArrayElement(colors);


    onColorChange(color);
  };
})();
