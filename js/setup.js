'use strict';

(function () {
  var setupDomElement = document.querySelector('.setup');
  var setupSubmitDomElement = setupDomElement.querySelector('.setup-submit');
  var setupOpenDomElement = document.querySelector('.setup-open');
  var setupCloseDomElement = setupDomElement.querySelector('.setup-close');

  var avatarInput = setupDomElement.querySelector('#avatar');

  var setupUserNameDomElement = setupDomElement.querySelector('.setup-user-name');


  var openSetup = function () {
    setupDomElement.classList.remove('hidden');

    removeEventsSetupOpen();
    addEventsSetupClose();
    addEventsSetupSubmit();
    window.form.addValidatingEventsFormUserName();
    window.form.addColorEventsFormWizard();
    avatarInput.addEventListener('mousedown', window.dialog.onAvatarInputMouseDown);

    document.addEventListener('keydown', onDocumentEscPress);
  };

  var closeSetup = function () {
    setupDomElement.classList.add('hidden');

    addEventsSetupOpen();
    removeEventsSetupClose();
    removeEventsSetupSubmit();
    window.form.removeValidatingEventsFormUserName();
    window.form.removeColorEventsFormWizard();
    avatarInput.removeEventListener('mousedown', window.dialog.onAvatarInputMouseDown);

    document.removeEventListener('keydown', onDocumentEscPress);

    window.form.resetDefaultSetup();
    window.dialog.resetOffset();
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


  /* магазин */

  var DOM_DRAGGED_THING_TAG_NAME = 'img';

  var domShop = document.querySelector('.setup-artifacts-shop');
  var domArtifactBox = document.querySelector('.setup-artifacts');
  var domArtifactCells = domArtifactBox.querySelectorAll('.setup-artifacts-cell');

  var domDraggedThing = null;

  var addStyleOutlineDomArtifactCells = function () {
    for (var i = 0; i < domArtifactCells.length; i++) {
      domArtifactCells[i].style.outline = '2px dashed red';
    }
  };

  var removeStyleOutlineDomArtifactCells = function () {
    for (var i = 0; i < domArtifactCells.length; i++) {
      domArtifactCells[i].style.outline = 'none';
    }
  };

  domShop.addEventListener('dragstart', function (evt) {
    if (evt.target.tagName.toLowerCase() === DOM_DRAGGED_THING_TAG_NAME) {
      domDraggedThing = evt.target;
      addStyleOutlineDomArtifactCells();
      evt.dataTransfer.setData('text/plain', evt.target.alt);
    }
  });

  domShop.addEventListener('dragend', function () {
    removeStyleOutlineDomArtifactCells();
  });

  domArtifactBox.addEventListener('dragover', function (evt) {
    evt.preventDefault();
    addStyleOutlineDomArtifactCells();
    return false;
  });

  domArtifactBox.addEventListener('drop', function (evt) {
    evt.target.style.backgroundColor = '';
    evt.target.appendChild(domDraggedThing);
    evt.preventDefault();
  });

  domArtifactBox.addEventListener('dragenter', function (evt) {
    evt.target.style.backgroundColor = 'yellow';
    evt.preventDefault();
  });

  domArtifactBox.addEventListener('dragleave', function (evt) {
    evt.target.style.backgroundColor = '';
    evt.preventDefault();
  });

  domArtifactBox.addEventListener('dragend', function () {
    removeStyleOutlineDomArtifactCells();
  });


  addEventsSetupOpen();
  window.similarWizard.createListDomElement();
  setupDomElement.querySelector('.setup-similar').classList.remove('hidden');
})();
