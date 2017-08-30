'use strict';

window.renderStatistics = function (ctx, names, times) {
  var canvasDomElement = document.querySelector('canvas');

  var RESULT_MESSAGE = 'Ура вы победили!\nСписок результатов:';

  var text = {};
  text.LINE_HEIGHT = 20;
  text.COLOR = 'rgb(0, 0, 0)';

  var resultWindow = {};
  resultWindow.X = 100;
  resultWindow.Y = 10;
  resultWindow.WIDTH = 420;
  resultWindow.HEIGHT = 270;
  resultWindow.COLOR = 'rgb(255, 255, 255)';
  resultWindow.OFFSET = 10;
  resultWindow.PADDING = resultWindow.OFFSET + 5;

  var resultWindowShadow = {};
  resultWindowShadow.X = resultWindow.X + 10;
  resultWindowShadow.Y = resultWindow.Y + 10;
  resultWindowShadow.WIDTH = resultWindow.WIDTH;
  resultWindowShadow.HEIGHT = resultWindow.HEIGHT;
  resultWindowShadow.COLOR = 'rgba(0, 0, 0, 0.7)';
  resultWindowShadow.OFFSET = resultWindow.OFFSET;

  var inner = {};
  inner.X = resultWindow.X + resultWindow.PADDING;
  inner.Y = resultWindow.Y + resultWindow.PADDING;
  inner.WIDTH = resultWindow.WIDTH - 2 * resultWindow.PADDING;
  inner.HEIGHT = resultWindow.HEIGHT - 2 * resultWindow.PADDING;

  var histogram = {};
  histogram.WIDTH = 40;
  histogram.MAX_HEIGHT = 150;
  histogram.INDENT_BETWEEN = 50;
  histogram.AMOUNT_IN_GROUP = 4;

  var groupBox = {};
  groupBox.WIDTH = histogram.AMOUNT_IN_GROUP * histogram.WIDTH + (histogram.AMOUNT_IN_GROUP - 1) * histogram.INDENT_BETWEEN;
  groupBox.HEIGHT = histogram.MAX_HEIGHT + 2 * text.LINE_HEIGHT;
  groupBox.X = inner.X + window.arrow.getObject().WIDTH + (inner.WIDTH - 2 * window.arrow.getObject().WIDTH - groupBox.WIDTH) / 2;
  groupBox.Y = inner.Y + inner.HEIGHT - groupBox.HEIGHT;

  var arrowLocation = {};
  arrowLocation.LEFT_X = inner.X + window.arrow.getObject().WIDTH;
  arrowLocation.RIGHT_X = inner.X + inner.WIDTH - window.arrow.getObject().WIDTH;
  arrowLocation.Y = groupBox.Y + groupBox.HEIGHT / 2 - window.arrow.getObject().HEIGHT / 2;

  var currentArrow = {};
  currentArrow.isDrawingLeft = false;
  currentArrow.isDrawingRight = false;


  var drawContent = function () {
    clearContent();
    window.gamer.drawGroup(currentGroupIndex);
    window.arrow.drawIfFulfilledCondition(ctx, currentGroupIndex, arrowLocation, currentArrow);
  };

  var clearContent = function () {
    ctx.clearRect(inner.X, groupBox.Y, inner.WIDTH, groupBox.HEIGHT);

    ctx.fillStyle = resultWindow.COLOR;
    ctx.fillRect(inner.X, groupBox.Y, inner.WIDTH, groupBox.HEIGHT);
  };

  var enableCanvasClickEvent = function (isCurrentArrowLeft) {
    canvasDomElement.style.cursor = 'pointer';

    currentArrow.isSelectedLeft = isCurrentArrowLeft;
    canvasDomElement.addEventListener('click', onCanvasClick);
  };


  var onCanvasMousemove = function (evt) {
    canvasDomElement.removeEventListener('click', onCanvasClick);

    var canvasDomElementLocation = canvasDomElement.getBoundingClientRect();

    var mouseLocation = {};
    mouseLocation.x = evt.pageX - canvasDomElementLocation.left;
    mouseLocation.y = evt.pageY - canvasDomElementLocation.top;

    if (window.arrow.isCanvasElementArrow(ctx, arrowLocation, mouseLocation, currentArrow.isDrawingLeft, true)) {
      enableCanvasClickEvent(true);

      return;
    }

    if (window.arrow.isCanvasElementArrow(ctx, arrowLocation, mouseLocation, currentArrow.isDrawingRight, false)) {
      enableCanvasClickEvent(false);

      return;
    }

    canvasDomElement.style.cursor = 'default';
  };

  var onCanvasClick = function () {
    currentGroupIndex = currentArrow.isSelectedLeft ? currentGroupIndex - 1 : currentGroupIndex + 1;

    drawContent();

    if (currentGroupIndex === 0 || currentGroupIndex === window.gamer.getGroups().length - 1) {
      canvasDomElement.style.cursor = 'default';
      canvasDomElement.removeEventListener('click', onCanvasClick);
    }
  };

  var onDocumentLeftArrowPress = function (evt) {
    if (window.util.isLeftArrowPressed(evt) && currentArrow.isDrawingLeft) {
      currentGroupIndex--;
      drawContent();
    }
  };

  var onDocumentRightArrowPress = function (evt) {
    if (window.util.isRightArrowPressed(evt) && currentArrow.isDrawingRight) {
      currentGroupIndex++;
      drawContent();
    }
  };


  var addDocumentEvents = function () {
    document.addEventListener('keydown', onDocumentLeftArrowPress);
    document.addEventListener('keydown', onDocumentRightArrowPress);
  };


  ctx.font = '16px PT Mono';
  ctx.textBaseline = 'hanging';

  window.canvas.drawCloud(ctx, resultWindowShadow, false);
  window.canvas.drawCloud(ctx, resultWindow, true);

  window.canvas.drawLongMessageWithLineBreak(ctx, RESULT_MESSAGE, inner, text);

  window.gamer.createGroups(ctx, names, times, histogram, groupBox, inner, text);
  var currentGroupIndex = window.gamer.getGroupWithCurrentUser();

  drawContent();

  canvasDomElement.addEventListener('mousemove', onCanvasMousemove);
  addDocumentEvents();
};
