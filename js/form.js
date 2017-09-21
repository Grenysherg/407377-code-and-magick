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

  var wizard = {};
  wizard.coatColor = formCoatColorInput.getAttribute('value');
  wizard.eyesColor = formEyesColorInput.getAttribute('value');

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


  var updateSimilarWizards = function () {
    wizard.coatColor = formCoatColorInput.getAttribute('value');
    wizard.eyesColor = formEyesColorInput.getAttribute('value');

    window.similarWizard.sort(wizard);
  };

  var fillElement = function (domElement, color) {
    domElement.style.fill = color;
  };

  var changeElementBackground = function (domElement, color) {
    domElement.style.backgroundColor = color;
  };

  var changeInputColor = function (domElementInput, color) {
    domElementInput.setAttribute('value', color);
  };

  var getCurrentArrayElementNumber = function (number, array) {
    if (number < array.length - 1) {
      number++;
    } else {
      number = 0;
    }

    return number;
  };

  var changeCoatColor = function (color) {
    fillElement(formCoatDomElement, color);
    changeInputColor(formCoatColorInput, color);
  };

  var changeEyesColor = function (color) {
    fillElement(formEyesDomElement, color);
    changeInputColor(formEyesColorInput, color);
  };

  var changeFireballColor = function (color) {
    changeElementBackground(formFireballDomElement, color);
    changeInputColor(formFireballColorInput, color);
  };

  var onSetupCoatClick = function () {
    currentNumber.coatColor = getCurrentArrayElementNumber(currentNumber.coatColor, window.wizard.COAT_COLORS);

    window.colorizeElement(window.wizard.COAT_COLORS, currentNumber.coatColor, changeCoatColor);
    window.debounce(updateSimilarWizards);
  };

  var onSetupEyesClick = function () {
    currentNumber.eyesColor = getCurrentArrayElementNumber(currentNumber.eyesColor, window.wizard.EYES_COLORS);

    window.colorizeElement(window.wizard.EYES_COLORS, currentNumber.eyesColor, changeEyesColor);
    window.debounce(updateSimilarWizards);
  };

  var onSetupFireballClick = function () {
    currentNumber.fireballColor = getCurrentArrayElementNumber(currentNumber.fireballColor, window.wizard.FIREBALL_COLORS);

    window.colorizeElement(window.wizard.FIREBALL_COLORS, currentNumber.fireballColor, changeFireballColor);
    window.debounce(updateSimilarWizards);
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

  window.form.onSubmit = function () {
    window.backend.save(
        'https://1510.dump.academy/code-and-magick',
        new FormData(formDomElement),
        function () {
          window.util.showSystemMessage('Данные формы отправлены успешно', 'success');
        },
        function (errorMessage) {
          window.util.showSystemMessage(errorMessage, 'error');
        });
  };

  window.form.resetDefaultSetup = function () {
    formUserNameDomElement.value = defaultValue.name;

    changeCoatColor(defaultValue.coatColor);
    changeEyesColor(defaultValue.eyesColor);
    changeFireballColor(defaultValue.fireballColor);
  };
})();
