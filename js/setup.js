'use strict';

(function () {
  var setupDomElement = document.querySelector('.setup');
  var setupSubmitDomElement = setupDomElement.querySelector('.setup-submit');
  var setupOpenDomElement = document.querySelector('.setup-open');
  var setupCloseDomElement = setupDomElement.querySelector('.setup-close');

  var setupUserNameDomElement = setupDomElement.querySelector('.setup-user-name');


  var openSetup = function () {
    setupDomElement.classList.remove('hidden');

    removeEventsSetupOpen();
    addEventsSetupClose();
    addEventsSetupSubmit();
    window.form.addValidatingEventsFormUserName();
    window.form.addColorEventsFormWizard();

    document.addEventListener('keydown', onDocumentEscPress);
  };

  var closeSetup = function () {
    setupDomElement.classList.add('hidden');

    addEventsSetupOpen();
    removeEventsSetupClose();
    removeEventsSetupSubmit();
    window.form.removeValidatingEventsFormUserName();
    window.form.removeColorEventsFormWizard();

    document.removeEventListener('keydown', onDocumentEscPress);

    window.form.resetDefaultSetup();
  };


  var onSetupOpenClick = function () {
    openSetup();
  };

  var onSetupOpenEnterPress = function (evt) {
    if (window.util.isEnterPressed(evt)) {
      openSetup();
    }
  };

  var onSetupCloseClick = function () {
    closeSetup();
  };

  var onSetupCloseEnterPress = function (evt) {
    if (window.util.isEnterPressed(evt)) {
      closeSetup();
    }
  };

  var onSetupSubmitClick = function () {
    if (window.form.getIsEnableSetupSubmitEvents) {
      return;
    }

    closeSetup();
  };

  var onSetupSubmitEnterPress = function (evt) {
    if (window.util.isEnterPressed(evt)) {
      if (window.form.getIsEnableSetupSubmitEvents) {
        return;
      }

      closeSetup();
    }
  };

  var onDocumentEscPress = function (evt) {
    if (window.util.isEscPressed(evt)) {
      if (document.activeElement === setupUserNameDomElement) {
        return;
      }

      closeSetup();
    }
  };


  var addEventsSetupOpen = function () {
    setupOpenDomElement.addEventListener('click', onSetupOpenClick);
    setupOpenDomElement.addEventListener('keydown', onSetupOpenEnterPress);
  };

  var removeEventsSetupOpen = function () {
    setupOpenDomElement.removeEventListener('click', onSetupOpenClick);
    setupOpenDomElement.removeEventListener('keydown', onSetupOpenEnterPress);
  };

  var addEventsSetupClose = function () {
    setupCloseDomElement.addEventListener('click', onSetupCloseClick);
    setupCloseDomElement.addEventListener('keydown', onSetupCloseEnterPress);
  };

  var removeEventsSetupClose = function () {
    setupCloseDomElement.removeEventListener('click', onSetupCloseClick);
    setupCloseDomElement.removeEventListener('keydown', onSetupCloseEnterPress);
  };

  var addEventsSetupSubmit = function () {
    setupSubmitDomElement.addEventListener('click', onSetupSubmitClick);
    setupSubmitDomElement.addEventListener('keydown', onSetupSubmitEnterPress);
  };

  var removeEventsSetupSubmit = function () {
    setupSubmitDomElement.removeEventListener('click', onSetupSubmitClick);
    setupSubmitDomElement.removeEventListener('keydown', onSetupSubmitEnterPress);
  };


  addEventsSetupOpen();
  window.similarWizard.createListDomElement();
  setupDomElement.querySelector('.setup-similar').classList.remove('hidden');
})();
