'use strict';

(function () {
  var rgb = {};
  rgb.MIN = 0;
  rgb.MAX = 255;

  var keyCode = {};
  keyCode.ENTER = 13;
  keyCode.ESC = 27;
  keyCode.LEFT_ARROW = 37;
  keyCode.RIGHT_ARROW = 39;


  window.util = {};

  window.util.createRandomInteger = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  window.util.getRandomArrayElement = function (array) {
    return array[this.createRandomInteger(0, array.length - 1)];
  };

  window.util.createRandomRGBColor = function (object) { // object = {red(0 - 255), green(0 - 255), blue(0 - 255)}
    object.red = object.red || this.createRandomInteger(rgb.MIN, rgb.MAX);
    object.green = object.green || this.createRandomInteger(rgb.MIN, rgb.MAX);
    object.blue = object.blue || this.createRandomInteger(rgb.MIN, rgb.MAX);

    return 'rgb(' + object.red + ', ' + object.green + ', ' + object.blue + ')';
  };

  window.util.isEnterPressed = function (evt) {
    return evt.keyCode === keyCode.ENTER;
  };

  window.util.isEscPressed = function (evt) {
    return evt.keyCode === keyCode.ESC;
  };

  window.util.isLeftArrowPressed = function (evt) {
    return evt.keyCode === keyCode.LEFT_ARROW;
  };

  window.util.isRightArrowPressed = function (evt) {
    return evt.keyCode === keyCode.RIGHT_ARROW;
  };
})();
