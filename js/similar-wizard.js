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

  var getRank = function (wizard, similarWizard) {
    var rank = 0;


    if (similarWizard.colorCoat === wizard.coatColor) {
      rank += 2;
    }

    if (similarWizard.colorEyes === wizard.eyesColor) {
      rank += 1;
    }


    return rank;
  };


  window.backend.load(
      'https://1510.dump.academy/code-and-magick/data',
      function (loadWizards) {
        similarWizards = loadWizards;

        window.similarWizard.renderCollection(window.util.sortArrayInRandomOrder(loadWizards).slice(0, SIMILAR_WIZARD_AMOUNT));
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

  window.similarWizard.sort = function (wizard) {
    similarWizards.sort(function (left, right) {
      var rankDiff = getRank(wizard, right) - getRank(wizard, left);


      if (rankDiff === 0) {
        rankDiff = similarWizards.indexOf(left) - similarWizards.indexOf(right);
      }


      return rankDiff;
    });

    window.similarWizard.renderCollection(similarWizards.slice(0, SIMILAR_WIZARD_AMOUNT));
  };
})();
