'use strict';

(function () {
  var arrow = {};
  arrow.WIDTH = 20;
  arrow.HEIGHT = 20;
  arrow.COLOR = 'rgb(0, 0, 0)';

  arrow.draw = function (ctx, arrowLocation, isLeft, isTransparent) {
    ctx.beginPath();

    if (isLeft) {
      ctx.moveTo(arrowLocation.LEFT_X, arrowLocation.Y);
      ctx.lineTo(arrowLocation.LEFT_X, arrowLocation.Y + arrow.HEIGHT);
      ctx.lineTo(arrowLocation.LEFT_X - arrow.WIDTH, arrowLocation.Y + arrow.HEIGHT / 2);
      ctx.lineTo(arrowLocation.LEFT_X, arrowLocation.Y);
    } else {
      ctx.moveTo(arrowLocation.RIGHT_X, arrowLocation.Y);
      ctx.lineTo(arrowLocation.RIGHT_X, arrowLocation.Y + arrow.HEIGHT);
      ctx.lineTo(arrowLocation.RIGHT_X + arrow.WIDTH, arrowLocation.Y + arrow.HEIGHT / 2);
      ctx.lineTo(arrowLocation.RIGHT_X, arrowLocation.Y);
    }

    ctx.closePath();
    ctx.fillStyle = isTransparent ? 'transparent' : arrow.COLOR;
    ctx.fill();
  };


  window.arrow = {};

  window.arrow.getObject = function () {
    return arrow;
  };

  window.arrow.drawIfFulfilledCondition = function (ctx, currentGroupIndex, arrowLocation, currentArrow) {
    if (currentGroupIndex > 0) {
      arrow.draw(ctx, arrowLocation, true, false);
      currentArrow.isDrawingLeft = true;
    } else {
      currentArrow.isDrawingLeft = false;
    }

    if (currentGroupIndex < window.gamer.getGroups().length - 1) {
      arrow.draw(ctx, arrowLocation, false, false);
      currentArrow.isDrawingRight = true;
    } else {
      currentArrow.isDrawingRight = false;
    }
  };

  window.arrow.isCanvasElementArrow = function (ctx, arrowLocation, mouseLocation, isCurrentArrow, isCurrentArrowLeft) {
    arrow.draw(ctx, arrowLocation, isCurrentArrowLeft, true);

    return ctx.isPointInPath(mouseLocation.x, mouseLocation.y) && isCurrentArrow;
  };
})();
