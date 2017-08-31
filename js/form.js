'use strict';

(function () {
  var formDomElement = document.querySelector('.setup-wizard-form');
  var formUserNameDomElement = formDomElement.querySelector('.setup-user-name');
  var formCoatDomElement = formDomElement.querySelector('.wizard-coat');
  var formCoatColorInput = formDomElement.querySelector('#coat-color');
  var formEyesDomElement = formDomElement.querySelector('.wizard-eyes');
  var formEyesColorInput = formDomElement.querySelector('#eyes-color');
  var formFireballDomElement = formDomElement.querySelector('.setup-fireball');
  var formFireballColorInput = formDomElement.querySelector('#fireball-color');

  var currentNumber = {};
  currentNumber.coatColor = 0;
  currentNumber.eyesColor = 0;
  currentNumber.fireballColor = 0;

  var defaultValue = {};
  defaultValue.name = formUserNameDomElement.getAttribute('value');
  defaultValue.coatColor = formCoatColorInput.getAttribute('value');
  defaultValue.eyesColor = formEyesColorInput.getAttribute('value');
  defaultValue.fireballColor = formFireballColorInput.getAttribute('value');

  var formUserName = {};
  formUserName.MIN_LENGTH = 2;
  formUserName.MAX_LENGTH = Number(formUserNameDomElement.getAttribute('maxLength'));

  var isEnableSetupSubmitEvents = true;


  /* Валидация ввода имени персонажа */

  var onFormUserNameInput = function (evt) {
    var target = evt.target;

    if (target.value.length < formUserName.MIN_LENGTH) {
      formUserNameDomElement.setCustomValidity('Минимально возможное количество символов: ' + formUserName.MIN_LENGTH);
    } else {
      formUserNameDomElement.setCustomValidity('');
    }
  };

  var onFormUserNameInvalid = function () {
    if (!formUserNameDomElement.validity.valid) {
      isEnableSetupSubmitEvents = false;

      if (formUserNameDomElement.validity.valueMissing) {
        formUserNameDomElement.setCustomValidity('Обязательное поле');
      } else if (formUserNameDomElement.validity.tooLong) {
        formUserNameDomElement.setCustomValidity('Максимально возможное количество символов: ' + formUserName.MAX_LENGTH);
      }
    } else {
      formUserNameDomElement.setCustomValidity('');
      isEnableSetupSubmitEvents = true;
    }
  };


  /* Изменение цвета мантии, глаз и фаербола персонажа по нажатию */

  var setElementColor = function (color, element, elementColorStyle, elementInput) {
    element.style[elementColorStyle] = color;
    elementInput.setAttribute('value', color);
  };

  var getCurrentArrayElementNumber = function (number, array) {
    if (number < array.length - 1) {
      number++;
    } else {
      number = 0;
    }

    return number;
  };

  var onSetupCoatClick = function () {
    currentNumber.coatColor = getCurrentArrayElementNumber(currentNumber.coatColor, window.wizard.COAT_COLORS);

    setElementColor(window.wizard.COAT_COLORS[currentNumber.coatColor], formCoatDomElement, 'fill', formCoatColorInput);
  };

  var onSetupEyesClick = function () {
    currentNumber.eyesColor = getCurrentArrayElementNumber(currentNumber.eyesColor, window.wizard.EYES_COLORS);

    setElementColor(window.wizard.EYES_COLORS[currentNumber.eyesColor], formEyesDomElement, 'fill', formEyesColorInput);
  };

  var onSetupFireballClick = function () {
    currentNumber.fireballColor = getCurrentArrayElementNumber(currentNumber.fireballColor, window.wizard.FIREBALL_COLORS);

    setElementColor(window.wizard.FIREBALL_COLORS[currentNumber.fireballColor], formFireballDomElement, 'backgroundColor', formFireballColorInput);
  };


  window.form = {};

  window.form.getIsEnableSetupSubmitEvents = function () {
    return isEnableSetupSubmitEvents;
  };

  window.form.addValidatingEventsFormUserName = function () {
    formUserNameDomElement.addEventListener('input', onFormUserNameInput);
    formUserNameDomElement.addEventListener('invalid', onFormUserNameInvalid);
  };

  window.form.removeValidatingEventsFormUserName = function () {
    formUserNameDomElement.removeEventListener('input', onFormUserNameInput);
    formUserNameDomElement.removeEventListener('invalid', onFormUserNameInvalid);
  };

  window.form.addColorEventsFormWizard = function () {
    formCoatDomElement.addEventListener('click', onSetupCoatClick);
    formEyesDomElement.addEventListener('click', onSetupEyesClick);
    formFireballDomElement.addEventListener('click', onSetupFireballClick);
  };

  window.form.removeColorEventsFormWizard = function () {
    formCoatDomElement.removeEventListener('click', onSetupCoatClick);
    formEyesDomElement.removeEventListener('click', onSetupEyesClick);
    formFireballDomElement.removeEventListener('click', onSetupFireballClick);
  };

  window.form.resetDefaultSetup = function () {
    formUserNameDomElement.value = defaultValue.name;

    setElementColor(defaultValue.coatColor, formCoatDomElement, 'fill', formCoatColorInput);
    setElementColor(defaultValue.eyesColor, formEyesDomElement, 'fill', formEyesColorInput);
    setElementColor(defaultValue.fireballColor, formFireballDomElement, 'backgroundColor', formFireballColorInput);
  };
})();
