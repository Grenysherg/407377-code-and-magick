'use strict';

window.renderStatistics = function (ctx, names, times) {
  var resultMessage = 'Ура вы победили!\nСписок результатов:';

  var cloud = {};
  cloud.X = 100;
  cloud.Y = 10;
  cloud.WIDTH = 420;
  cloud.HEIGHT = 270;
  cloud.COLOR = '#ffffff';
  cloud.OFFSET = 10;
  cloud.padding = cloud.OFFSET + 5;

  var cloudShadow = {};
  cloudShadow.COLOR = 'rgba(0, 0, 0, 0.7)';
  cloudShadow.x = cloud.X + 10;
  cloudShadow.y = cloud.Y + 10;
  cloudShadow.width = cloud.WIDTH;
  cloudShadow.height = cloud.HEIGHT;
  cloudShadow.offset = cloud.OFFSET;

  var inner = {};
  inner.x = cloud.X + cloud.padding;
  inner.y = cloud.Y + cloud.padding;
  inner.width = cloud.WIDTH - 2 * cloud.padding;
  inner.height = cloud.HEIGHT - 2 * cloud.padding;

  var text = {};
  text.LINE_HEIGHT = 20;
  text.COLOR = '#000000';

  var histogram = {};
  histogram.WIDTH = 40;
  histogram.MAX_HEIGHT = 150;
  histogram.INDENT_BETWEEN = 50;
  histogram.AMOUNT_IN_GROUP = 4;
  histogram.CURRENT_USER_COLOR = 'rgba(255, 0, 0, 1)';

  var arrow = {};
  arrow.WIDTH = 20;
  arrow.HEIGHT = 20;
  arrow.COLOR = '#000000';
  arrow.leftX = inner.x + arrow.WIDTH;
  arrow.rightX = inner.x + inner.width - arrow.WIDTH;
  arrow.isLeft = false;
  arrow.isRight = false;

  var groupBox = {};
  groupBox.width = histogram.AMOUNT_IN_GROUP * histogram.WIDTH + (histogram.AMOUNT_IN_GROUP - 1) * histogram.INDENT_BETWEEN;
  groupBox.height = histogram.MAX_HEIGHT + 2 * text.LINE_HEIGHT;
  groupBox.x = inner.x + arrow.WIDTH + (inner.width - 2 * arrow.WIDTH - groupBox.width) / 2;
  groupBox.y = inner.y + inner.height - groupBox.height;

  arrow.y = groupBox.y + groupBox.height / 2 - arrow.HEIGHT / 2;

  var drawCloud = function (x, y, width, height, offset, color, isCloud) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + offset, y + height / 2);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x + width / 2, y + height - offset);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x + width - offset, y + height / 2);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x + width / 2, y + offset);
    ctx.lineTo(x, y);

    if (isCloud) {
      ctx.stroke();
    }

    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  };

  var drawStringCenter = function (string, stringY, stringColor, centerX) {
    var stringWidth = ctx.measureText(string).width;

    ctx.fillStyle = stringColor;
    ctx.fillText(string, centerX - stringWidth / 2, stringY);
  };

  var drawLongMessage = function (message) {
    message.split('\n').forEach(function (string, index) {
      drawStringCenter(string, inner.y + index * text.LINE_HEIGHT, text.COLOR, inner.x + inner.width / 2);
    });
  };

  var drawArrow = function (object, isLeft, isTransparent) {
    ctx.beginPath();

    if (isLeft) {
      ctx.moveTo(object.leftX, object.y);
      ctx.lineTo(object.leftX, object.y + object.HEIGHT);
      ctx.lineTo(object.leftX - object.WIDTH, object.y + object.HEIGHT / 2);
      ctx.lineTo(object.leftX, object.y);
    } else {
      ctx.moveTo(object.rightX, object.y);
      ctx.lineTo(object.rightX, object.y + object.HEIGHT);
      ctx.lineTo(object.rightX + object.WIDTH, object.y + object.HEIGHT / 2);
      ctx.lineTo(object.rightX, object.y);
    }

    ctx.closePath();
    ctx.fillStyle = isTransparent ? 'transparent' : object.COLOR;
    ctx.fill();
  };

  var drawArrows = function (object) {
    if (object.currentIndex > 0) {
      drawArrow(arrow, true, false);
      arrow.isLeft = true;
    } else {
      arrow.isLeft = false;
    }

    if (object.currentIndex < object.amount - 1) {
      drawArrow(arrow, false, false);
      arrow.isRight = true;
    } else {
      arrow.isRight = false;
    }
  };

  var clearContent = function () {
    ctx.clearRect(inner.x, groupBox.y, inner.width, groupBox.height);

    ctx.fillStyle = cloud.COLOR;
    ctx.fillRect(inner.x, groupBox.y, inner.width, groupBox.height);
  };

  var i;
  var j;

  var gamers = [];
  for (i = 0; i < names.length; i++) {
    gamers[i] = {};
    gamers[i]['name'] = names[i];
    gamers[i]['time'] = times[i];
  }

  var sortedGamers = gamers.sort(function (a, b) {
    return a.time - b.time ? a.time - b.time : a.name - b.name;
  });
  var maxTime = sortedGamers[sortedGamers.length - 1]['time'];
  var currentGamerIndex = 0;

  var group = {};
  group.values = [];
  group.amount = Math.ceil(sortedGamers.length / histogram.AMOUNT_IN_GROUP);

  var currentGroupElement;
  for (i = 0; i < group.amount; i++) {
    group['values'][i] = [];

    for (j = 0; j < histogram.AMOUNT_IN_GROUP && currentGamerIndex < sortedGamers.length; j++, currentGamerIndex++) {
      group['values'][i][j] = {};
      currentGroupElement = group['values'][i][j];

      var currentGamer = sortedGamers[currentGamerIndex];
      var currentHistogramHeight = currentGamer.time * histogram.MAX_HEIGHT / maxTime;
      var currentHistogramX = groupBox.x + j * histogram.WIDTH + j * histogram.INDENT_BETWEEN;
      var currentHistogramY = inner.y + inner.height - currentHistogramHeight - text.LINE_HEIGHT;

      if (currentGamer.name === 'Вы') {
        group.currentIndex = i;
      }

      currentGroupElement.name = {
        value: currentGamer.name,
        x: currentHistogramX,
        y: inner.y + inner.height,
        color: text.COLOR,
        draw: function () {
          ctx.textBaseline = 'ideographic';
          drawStringCenter(this.value, this.y, this.color, this.x + histogram.WIDTH / 2);
          ctx.textBaseline = 'hanging';
        }
      };

      currentGroupElement.histogram = {
        x: currentHistogramX,
        y: currentHistogramY,
        width: histogram.WIDTH,
        height: currentHistogramHeight,
        color: currentGamer.name === 'Вы' ? histogram.CURRENT_USER_COLOR : 'hsl(240, ' + Math.ceil(Math.random() * 100) + '%, 50%)',
        draw: function () {
          ctx.fillStyle = this.color;
          ctx.fillRect(this.x, this.y, this.width, this.height);
        }
      };

      currentGroupElement.time = {
        value: Math.ceil(currentGamer.time).toString(),
        x: currentHistogramX,
        y: currentHistogramY - text.LINE_HEIGHT,
        color: text.COLOR,
        draw: function () {
          drawStringCenter(this.value, this.y, this.color, this.x + histogram.WIDTH / 2);
        }
      };
    }
  }

  group.draw = function () {
    for (i = 0; i < this.values[this.currentIndex].length; i++) {
      currentGroupElement = this.values[this.currentIndex][i];

      currentGroupElement.name.draw();
      currentGroupElement.histogram.draw();
      currentGroupElement.time.draw();
    }
  };

  var canvas = document.querySelector('canvas');
  var mouseXY;
  var mouseX;
  var mouseY;
  var isCurrentArrowLeft;

  var arrowClick = function () {
    group.currentIndex = isCurrentArrowLeft ? group.currentIndex - 1 : group.currentIndex + 1;

    clearContent();
    group.draw();
    drawArrows(group);

    canvas.style.cursor = group.currentIndex > 0 && group.currentIndex < group.amount - 1 ? 'pointer' : 'default';
  };

  var arrowMousemove = function (event) {
    canvas.removeEventListener('click', arrowClick);

    mouseXY = canvas.getBoundingClientRect();
    mouseX = event.pageX - mouseXY.left;
    mouseY = event.pageY - mouseXY.top;

    drawArrow(arrow, true, true);

    if (ctx.isPointInPath(mouseX, mouseY) && arrow.isLeft) {
      canvas.style.cursor = 'pointer';

      isCurrentArrowLeft = true;
      canvas.addEventListener('click', arrowClick);

      return;
    }

    drawArrow(arrow, false, true);

    if (ctx.isPointInPath(mouseX, mouseY) && arrow.isRight) {
      canvas.style.cursor = 'pointer';

      isCurrentArrowLeft = false;
      canvas.addEventListener('click', arrowClick);

      return;
    }

    canvas.style.cursor = 'default';
  };

  ctx.font = '16px PT Mono';
  ctx.textBaseline = 'hanging';

  drawCloud(cloudShadow.x, cloudShadow.y, cloudShadow.width, cloudShadow.height, cloudShadow.offset, cloudShadow.COLOR, false);
  drawCloud(cloud.X, cloud.Y, cloud.WIDTH, cloud.HEIGHT, cloud.OFFSET, cloud.COLOR, true);

  drawLongMessage(resultMessage);

  group.draw();
  drawArrows(group);

  canvas.addEventListener('mousemove', arrowMousemove);
};
