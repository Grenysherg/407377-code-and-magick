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

  window.util.sortArrayInRandomOrder = function (array) {
    var arrayElementNewIndex = null;
    var arrayStoreElement = null;


    array.reverse().forEach(function (it, index) {
      arrayElementNewIndex = Math.floor(Math.random() * (index + 1));

      arrayStoreElement = array[arrayElementNewIndex];
      array[arrayElementNewIndex] = it;
      it = arrayStoreElement;
    });


    return array;
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

  window.util.showSystemMessage = function (text, stateString) {
    var domSystemMessage = document.querySelector('.system-message');
    var domSystemMessageClose = domSystemMessage.querySelector('.system-message__close');


    var onDomSystemMessageCloseClick = function () {
      domSystemMessage.classList.add('hidden');
      domSystemMessage.classList.remove('system-message--' + stateString);

      domSystemMessageClose.removeEventListener('click', onDomSystemMessageCloseClick);
    };


    domSystemMessage.classList.add('system-message--' + stateString);
    domSystemMessage.classList.remove('hidden');

    domSystemMessage.querySelector('.system-message__text').textContent = text;

    domSystemMessageClose.addEventListener('click', onDomSystemMessageCloseClick);
  };
})();
