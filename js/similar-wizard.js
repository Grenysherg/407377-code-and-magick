'use strict';

(function () {
  var SIMILAR_WIZARD_AMOUNT = 4;

  var similarWizards = [];

  var similarWizardListDomElement = document.querySelector('.setup-similar-list');
  var similarWizardTemplate = document.querySelector('#similar-wizard-template').content;


  var renderWizard = function (wizard) {
    var domElement = similarWizardTemplate.cloneNode(true);

    domElement.querySelector('.setup-similar-label').textContent = wizard.name;
    domElement.querySelector('.wizard-coat').style.fill = wizard.colorCoat;
    domElement.querySelector('.wizard-eyes').style.fill = wizard.colorEyes;

    return domElement;
  };


  window.backend.load(
      'https://1510.dump.academy/code-and-magick/data',
      function (loadWizards) {
        similarWizards = loadWizards;

        window.similarWizard.renderCollection(window.util.sortArrayInRandomOrder(similarWizards).slice(0, SIMILAR_WIZARD_AMOUNT));
      },
      function (errorMessage) {
        window.util.showSystemMessage(errorMessage, 'error');
      }
  );


  window.similarWizard = {};

  window.similarWizard.createListDomElement = function () {
    var fragment = document.createDocumentFragment();
    window.backend.load(
        'https://1510.dump.academy/code-and-magick/data',
        function (loadWizards) {
          window.util.sortArrayInRandomOrder(loadWizards).slice(0, SIMILAR_WIZARD_AMOUNT).forEach(function (it) {
            fragment.appendChild(renderWizard(it));
          });
          similarWizardListDomElement.appendChild(fragment);
        },
        function (errorMessage) {
          window.util.showSystemMessage(errorMessage, 'error');
        }
    );
  };

  window.similarWizard.renderCollection = function (wizards) {
    var fragment = document.createDocumentFragment();


    wizards.forEach(function (it) {
      fragment.appendChild(renderWizard(it));
    });

    similarWizardListDomElement.innerHTML = '';
    similarWizardListDomElement.appendChild(fragment);
  };
})();
