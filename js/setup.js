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

setup.classList.remove('hidden');
var similarWizards = createSimilarWizards();
createSimilarWizardsList();
