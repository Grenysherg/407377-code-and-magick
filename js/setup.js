'use strict';

var setup = document.querySelector('.setup');
var setupSubmit = setup.querySelector('.setup-submit');
var setupOpen = document.querySelector('.setup-open');
var setupClose = setup.querySelector('.setup-close');

var setupForm = document.querySelector('.setup-wizard-form');
var setupUserName = setupForm.querySelector('.setup-user-name');
var setupCoat = setupForm.querySelector('.wizard-coat');
var setupCoatColorInput = setupForm.querySelector('#coat-color');
var setupEyes = setupForm.querySelector('.wizard-eyes');
var setupEyesColorInput = setupForm.querySelector('#eyes-color');
var setupFireball = setupForm.querySelector('.setup-fireball');
var setupFireballColorInput = setupForm.querySelector('#fireball-color');

var similarWizardsList = setup.querySelector('.setup-similar-list');
var similarWizardTemplate = document.querySelector('#similar-wizard-template').content;

var keyCode = {};
keyCode.ENTER = 13;
keyCode.ESC = 27;


var wizardParameter = {};

wizardParameter.name = {};
wizardParameter.name.DEFAULT = setupUserName.getAttribute('value');
wizardParameter.name.MIN_LENGTH = 2;
wizardParameter.name.MAX_LENGTH = Number(setupUserName.getAttribute('maxLength'));

wizardParameter.coatColor = {};
wizardParameter.coatColor.VALUES = [
  'rgb(101, 137, 164)',
  'rgb(241, 43, 107)',
  'rgb(146, 100, 161)',
  'rgb(56, 159, 117)',
  'rgb(215, 210, 55)',
  'rgb(0, 0, 0)'
];
wizardParameter.coatColor.DEFAULT = setupCoatColorInput.getAttribute('value');

wizardParameter.eyesColor = {};
wizardParameter.eyesColor.VALUES = [
  'black',
  'red',
  'blue',
  'yellow',
  'green'
];
wizardParameter.eyesColor.DEFAULT = setupEyesColorInput.getAttribute('value');

wizardParameter.fireballColor = {};
wizardParameter.fireballColor.VALUES = [
  '#ee4830',
  '#30a8ee',
  '#5ce6c0',
  '#e848d5',
  '#e6e848'
];
wizardParameter.fireballColor.DEFAULT = setupFireballColorInput.getAttribute('value');


var currentNumber = {};
currentNumber.coatColor = 0;
currentNumber.eyesColor = 0;
currentNumber.fireballColor = 0;


var similarWizardParameters = {};
similarWizardParameters.AMOUNT = 4;
similarWizardParameters.COAT_COLORS = [
  'rgb(101, 137, 164)',
  'rgb(241, 43, 107)',
  'rgb(146, 100, 161)',
  'rgb(56, 159, 117)',
  'rgb(215, 210, 55)',
  'rgb(0, 0, 0)'
];
similarWizardParameters.EYES_COLORS = [
  'black',
  'red',
  'blue',
  'yellow',
  'green'
];
similarWizardParameters.FIRST_NAMES = [
  'Иван',
  'Хуан Себастьян',
  'Мария',
  'Кристоф',
  'Виктор',
  'Юлия',
  'Люпита',
  'Вашингтон'
];
similarWizardParameters.SECOND_NAMES = [
  'да Марья',
  'Верон',
  'Мирабелла',
  'Вальц',
  'Онопко',
  'Топольницкая',
  'Нионго',
  'Ирвинг'
];

var createRandomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getRandomArrayElement = function (array) {
  return array[createRandomInteger(0, array.length - 1)];
};

var createSimilarWizardElement = function (similarWizard) {
  var similarWizardElement = similarWizardTemplate.cloneNode(true);

  similarWizardElement.querySelector('.setup-similar-label').textContent = similarWizard.name;
  similarWizardElement.querySelector('.wizard-coat').style.fill = similarWizard.coatColor;
  similarWizardElement.querySelector('.wizard-eyes').style.fill = similarWizard.eyesColor;

  return similarWizardElement;
};

var createSimilarWizards = function () {
  var similarWizards = [];

  var fullNames = createWizardUniqueFullNames(similarWizardParameters.AMOUNT);
  var colorSchemes = createWizardUniqueColorSchemes(similarWizardParameters.AMOUNT);

  for (var i = 0; i < similarWizardParameters.AMOUNT; i++) {
    similarWizards[i] = createWizard(fullNames[i], colorSchemes[i]['coatColor'], colorSchemes[i]['eyesColor']);
  }

  return similarWizards;
};

var createSimilarWizardsList = function () {
  var fragment = document.createDocumentFragment();

  similarWizards.forEach(function (similarWizardsElement) {
    fragment.appendChild(createSimilarWizardElement(similarWizardsElement));
  });

  similarWizardsList.appendChild(fragment);
  setup.querySelector('.setup-similar').classList.remove('hidden');
};

var createWizard = function (fullName, coatColor, eyesColor) {
  var wizard = {};

  wizard.name = fullName;
  wizard.coatColor = coatColor;
  wizard.eyesColor = eyesColor;

  return wizard;
};

var createWizardUniqueColorSchemes = function (amount) {
  var coatColor;
  var eyesColor;
  var colorScheme;
  var store = {};
  var uniqueColorSchemes = [];

  for (var i = 0; i < amount; i++) {
    do {
      coatColor = getRandomArrayElement(similarWizardParameters.COAT_COLORS);
      eyesColor = getRandomArrayElement(similarWizardParameters.EYES_COLORS);
      colorScheme = coatColor + ' ' + eyesColor;
    } while (store[colorScheme]);

    uniqueColorSchemes[i] = {};
    uniqueColorSchemes[i]['coatColor'] = coatColor;
    uniqueColorSchemes[i]['eyesColor'] = eyesColor;
    store[colorScheme] = true;
  }

  return uniqueColorSchemes;
};

var createWizardUniqueFullNames = function (amount) {
  var firstName;
  var secondName;
  var store = {};
  var uniqueFullNames = [];

  for (var i = 0; i < amount; i++) {
    firstName = createRandomInteger(0, 1) ? getRandomArrayElement(similarWizardParameters.FIRST_NAMES) : getRandomArrayElement(similarWizardParameters.SECOND_NAMES);

    do {
      secondName = createRandomInteger(0, 1) ? getRandomArrayElement(similarWizardParameters.FIRST_NAMES) : getRandomArrayElement(similarWizardParameters.SECOND_NAMES);
    } while (store[secondName] || firstName === secondName);

    uniqueFullNames[i] = firstName + ' ' + secondName;
    store[secondName] = true;
  }

  return uniqueFullNames;
};


/* Открытие/закрытие окна настройки персонажа */

var openSetup = function () {
  setup.classList.remove('hidden');

  removeEventsSetupOpen();
  addEventsSetupClose();
  addValidationEventsSetupUserName();
  addColorSetupEventsWizard();

  document.addEventListener('keydown', onDocumentEscPress);
};

var closeSetup = function () {
  setup.classList.add('hidden');

  addEventsSetupOpen();
  removeEventsSetupClose();
  removeEventsSetupSubmit();
  removeValidationEventsSetupUserName();
  removeColorSetupEventsWizard();

  document.removeEventListener('keydown', onDocumentEscPress);

  resetDefaultSetup();
};

var onSetupOpenClick = function () {
  openSetup();
};

var onSetupOpenEnterPress = function (evt) {
  if (evt.keyCode === keyCode.ENTER) {
    openSetup();
  }
};

var onSetupCloseClick = function () {
  closeSetup();
};

var onSetupCloseEnterPress = function (evt) {
  if (evt.keyCode === keyCode.ENTER) {
    closeSetup();
  }
};

var onSetupSubmitClick = function () {
  closeSetup();
};

var onSetupSubmitEnterPress = function (evt) {
  if (evt.keyCode === keyCode.ENTER) {
    closeSetup();
  }
};

var onDocumentEscPress = function (evt) {
  if (evt.keyCode === keyCode.ESC) {
    if (document.activeElement === setupUserName) {
      return;
    }

    closeSetup();
    resetDefaultSetup();
  }
};

var addEventsSetupOpen = function () {
  setupOpen.addEventListener('click', onSetupOpenClick);
  setupOpen.addEventListener('keydown', onSetupOpenEnterPress);
};

var removeEventsSetupOpen = function () {
  setupOpen.removeEventListener('click', onSetupOpenClick);
  setupOpen.removeEventListener('keydown', onSetupOpenEnterPress);
};

var addEventsSetupClose = function () {
  setupClose.addEventListener('click', onSetupCloseClick);
  setupClose.addEventListener('keydown', onSetupCloseEnterPress);
};

var removeEventsSetupClose = function () {
  setupClose.removeEventListener('click', onSetupCloseClick);
  setupClose.removeEventListener('keydown', onSetupCloseEnterPress);
};

var addEventsSetupSubmit = function () {
  setupSubmit.addEventListener('click', onSetupSubmitClick);
  setupSubmit.addEventListener('keydown', onSetupSubmitEnterPress);
};

var removeEventsSetupSubmit = function () {
  setupSubmit.removeEventListener('click', onSetupSubmitClick);
  setupSubmit.removeEventListener('keydown', onSetupSubmitEnterPress);
};


/* Валидация ввода имени персонажа */

var onSetupUserNameInput = function (evt) {
  var target = evt.target;

  if (target.value.length < wizardParameter.name.MIN_LENGTH) {
    setupUserName.setCustomValidity('Минимально возможное количество символов: ' + wizardParameter.name.MIN_LENGTH);
  } else {
    setupUserName.setCustomValidity('');
  }
};

var onSetupUserNameInvalid = function () {
  if (!setupUserName.validity.valid) {
    if (setupUserName.validity.valueMissing) {
      setupUserName.setCustomValidity('Обязательное поле');
    } else if (setupUserName.validity.tooLong) {
      setupUserName.setCustomValidity('Максимально возможное количество символов: ' + wizardParameter.name.MAX_LENGTH);
    }
  } else {
    setupUserName.setCustomValidity('');
    addEventsSetupSubmit();
  }
};

var addValidationEventsSetupUserName = function () {
  setupUserName.addEventListener('input', onSetupUserNameInput);
  setupUserName.addEventListener('invalid', onSetupUserNameInvalid);
};

var removeValidationEventsSetupUserName = function () {
  setupUserName.removeEventListener('input', onSetupUserNameInput);
  setupUserName.removeEventListener('invalid', onSetupUserNameInvalid);
};


/* Изменение цвета мантии, глаз и фаербола персонажа по нажатию */

var setElementColor = function (color, element, elementColorStyle, elementInput) {
  element.setAttribute('style', elementColorStyle + ': ' + color + ';');
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
  currentNumber.coatColor = getCurrentArrayElementNumber(currentNumber.coatColor, wizardParameter.coatColor.VALUES);

  setElementColor(wizardParameter.coatColor.VALUES[currentNumber.coatColor], setupCoat, 'fill', setupCoatColorInput);
};

var onSetupEyesClick = function () {
  currentNumber.eyesColor = getCurrentArrayElementNumber(currentNumber.eyesColor, wizardParameter.eyesColor.VALUES);

  setElementColor(wizardParameter.eyesColor.VALUES[currentNumber.eyesColor], setupEyes, 'fill', setupEyesColorInput);
};

var onSetupFireballClick = function () {
  currentNumber.fireballColor = getCurrentArrayElementNumber(currentNumber.fireballColor, wizardParameter.fireballColor.VALUES);

  setElementColor(wizardParameter.fireballColor.VALUES[currentNumber.fireballColor], setupFireball, 'backgroundColor', setupFireballColorInput);
};

var addColorSetupEventsWizard = function () {
  setupCoat.addEventListener('click', onSetupCoatClick);
  setupEyes.addEventListener('click', onSetupEyesClick);
  setupFireball.addEventListener('click', onSetupFireballClick);
};

var removeColorSetupEventsWizard = function () {
  setupCoat.removeEventListener('click', onSetupCoatClick);
  setupEyes.removeEventListener('click', onSetupEyesClick);
  setupFireball.removeEventListener('click', onSetupFireballClick);
};


/* Сброс настроек по умолчанию */

var resetDefaultSetup = function () {
  setupUserName.value = wizardParameter.name.DEFAULT;

  setElementColor(wizardParameter.coatColor.DEFAULT, setupCoat, 'fill', setupCoatColorInput);
  setElementColor(wizardParameter.eyesColor.DEFAULT, setupEyes, 'fill', setupEyesColorInput);
  setElementColor(wizardParameter.fireballColor.DEFAULT, setupFireball, 'backgroundColor', setupFireballColorInput);
};


addEventsSetupOpen();
var similarWizards = createSimilarWizards();
createSimilarWizardsList();
