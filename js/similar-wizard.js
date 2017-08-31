'use strict';

(function () {
  var similarWizardListDomElement = document.querySelector('.setup-similar-list');
  var similarWizardTemplate = document.querySelector('#similar-wizard-template').content;

  var similarWizard = {};
  similarWizard.AMOUNT = 4;
  similarWizard.FIRST_NAMES = [
    'Иван',
    'Хуан Себастьян',
    'Мария',
    'Кристоф',
    'Виктор',
    'Юлия',
    'Люпита',
    'Вашингтон'
  ];
  similarWizard.SECOND_NAMES = [
    'да Марья',
    'Верон',
    'Мирабелла',
    'Вальц',
    'Онопко',
    'Топольницкая',
    'Нионго',
    'Ирвинг'
  ];

  similarWizard.createUniqueFullNames = function () {
    var firstName;
    var secondName;
    var store = {};
    var array = [];

    for (var i = 0; i < this.AMOUNT; i++) {
      firstName = window.util.createRandomInteger(0, 1) ? window.util.getRandomArrayElement(this.FIRST_NAMES) : window.util.getRandomArrayElement(this.SECOND_NAMES);

      do {
        secondName = window.util.createRandomInteger(0, 1) ? window.util.getRandomArrayElement(this.FIRST_NAMES) : window.util.getRandomArrayElement(this.SECOND_NAMES);
      } while (store[secondName] || firstName === secondName);

      array[i] = firstName + ' ' + secondName;
      store[secondName] = true;
    }

    return array;
  };

  similarWizard.createUniqueColorSchemes = function () {
    var coatColor;
    var eyesColor;
    var colorScheme;
    var store = {};
    var array = [];

    for (var i = 0; i < this.AMOUNT; i++) {
      do {
        coatColor = window.util.getRandomArrayElement(window.wizard.COAT_COLORS);
        eyesColor = window.util.getRandomArrayElement(window.wizard.EYES_COLORS);
        colorScheme = coatColor + ' ' + eyesColor;
      } while (store[colorScheme]);

      array[i] = {};
      array[i].coatColor = coatColor;
      array[i].eyesColor = eyesColor;
      store[colorScheme] = true;
    }

    return array;
  };

  similarWizard.createArrayElement = function (name, coatColor, eyesColor) {
    var element = {};

    element.name = name;
    element.coatColor = coatColor;
    element.eyesColor = eyesColor;

    return element;
  };

  similarWizard.createArray = function () {
    var array = [];

    var fullNames = this.createUniqueFullNames();
    var colorSchemes = this.createUniqueColorSchemes();

    for (var i = 0; i < this.AMOUNT; i++) {
      array[i] = this.createArrayElement(fullNames[i], colorSchemes[i].coatColor, colorSchemes[i].eyesColor);
    }

    return array;
  };

  similarWizard.renderDomElement = function (wizard) {
    var domElement = similarWizardTemplate.cloneNode(true);

    domElement.querySelector('.setup-similar-label').textContent = wizard.name;
    domElement.querySelector('.wizard-coat').style.fill = wizard.coatColor;
    domElement.querySelector('.wizard-eyes').style.fill = wizard.eyesColor;

    return domElement;
  };


  window.similarWizard = {};

  window.similarWizard.createListDomElement = function () {
    var fragment = document.createDocumentFragment();
    var wizards = similarWizard.createArray();

    wizards.forEach(function (element) {
      fragment.appendChild(similarWizard.renderDomElement(element));
    });

    similarWizardListDomElement.appendChild(fragment);
  };
})();
