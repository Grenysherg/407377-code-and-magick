'use strict';

var setup = document.querySelector('.setup');

var similarWizardsList = setup.querySelector('.setup-similar-list');
var similarWizardTemplate = document.querySelector('#similar-wizard-template').content;

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

var returnRandomArrayElement = function (array) {
  return array[createRandomInteger(0, array.length - 1)];
};

var returnRandomUniqueArrayElements = function (array, newLength) {
  var element;
  var uniqueElements = [];
  var store = {};

  newLength = newLength || createRandomInteger(0, array.length - 1);

  for (var i = 0; i < newLength; i++) {
    do {
      element = returnRandomArrayElement(array);
    } while (store[String(element)]);

    uniqueElements[i] = element;
    store[String(element)] = true;
  }

  return uniqueElements;
};

var sortArrayElementsRandomOrder = function (array) {
  var number;
  var store;

  for (var i = array.length - 1; i > 0; i--) {
    number = Math.floor(Math.random() * (i + 1));
    store = array[number];
    array[number] = array[i];
    array[i] = store;
  }

  return array;
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

  var firstNames = sortArrayElementsRandomOrder(returnRandomUniqueArrayElements(similarWizardParameters.FIRST_NAMES.concat(), similarWizardParameters.AMOUNT));
  var secondNames = sortArrayElementsRandomOrder(returnRandomUniqueArrayElements(similarWizardParameters.SECOND_NAMES.concat(), similarWizardParameters.AMOUNT));
  var coatColors = sortArrayElementsRandomOrder(returnRandomUniqueArrayElements(similarWizardParameters.COAT_COLORS.concat(), similarWizardParameters.AMOUNT));
  var eyesColors = sortArrayElementsRandomOrder(returnRandomUniqueArrayElements(similarWizardParameters.EYES_COLORS.concat(), similarWizardParameters.AMOUNT));

  for (var i = 0; i < similarWizardParameters.AMOUNT; i++) {
    similarWizards[i] = createWizard(firstNames[i], secondNames[i], coatColors[i], eyesColors[i]);
  }

  return similarWizards;
};

var createSimilarWizardsList = function () {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < similarWizards.length; i++) {
    fragment.appendChild(createSimilarWizardElement(similarWizards[i]));
  }

  similarWizardsList.appendChild(fragment);
  setup.querySelector('.setup-similar').classList.remove('hidden');
};

var createWizard = function (firstName, secondName, coatColor, eyesColor) {
  var wizard = {};

  wizard.name = createWizardFullName(firstName, secondName);
  wizard.coatColor = coatColor;
  wizard.eyesColor = eyesColor;

  return wizard;
};

var createWizardFullName = function (firstName, secondName) {
  return createRandomInteger(0, 1) ? firstName + ' ' + secondName : secondName + ' ' + firstName;
};

setup.classList.remove('hidden');
var similarWizards = createSimilarWizards();
createSimilarWizardsList();
