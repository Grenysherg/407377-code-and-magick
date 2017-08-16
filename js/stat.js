'use strict';

window.renderStatistics = function (ctx, names, times) {
  var i;
  var j;
  var currentElement;

  var isCurrentArrowLeft;
  var canvas = document.querySelector('canvas');

  var resultMessage = 'Ура вы победили!\nСписок результатов:';

  var cloud = {};
  cloud.X = 100;
  cloud.Y = 10;
  cloud.WIDTH = 420;
  cloud.HEIGHT = 270;
  cloud.COLOR = 'rgb(255, 255, 255)';
  cloud.OFFSET = 10;
  cloud.PADDING = cloud.OFFSET + 5;

  var cloudShadow = {};
  cloudShadow.X = cloud.X + 10;
  cloudShadow.Y = cloud.Y + 10;
  cloudShadow.WIDTH = cloud.WIDTH;
  cloudShadow.HEIGHT = cloud.HEIGHT;
  cloudShadow.COLOR = 'rgba(0, 0, 0, 0.7)';
  cloudShadow.OFFSET = cloud.OFFSET;

  var inner = {};
  inner.X = cloud.X + cloud.PADDING;
  inner.Y = cloud.Y + cloud.PADDING;
  inner.WIDTH = cloud.WIDTH - 2 * cloud.PADDING;
  inner.HEIGHT = cloud.HEIGHT - 2 * cloud.PADDING;

  var text = {};
  text.LINE_HEIGHT = 20;
  text.COLOR = 'rgb(0, 0, 0)';

  var histogram = {};
  histogram.WIDTH = 40;
  histogram.MAX_HEIGHT = 150;
  histogram.INDENT_BETWEEN = 50;
  histogram.AMOUNT_IN_GROUP = 4;

  var arrow = {};
  arrow.WIDTH = 20;
  arrow.HEIGHT = 20;
  arrow.LEFT_X = inner.X + arrow.WIDTH;
  arrow.RIGHT_X = inner.X + inner.WIDTH - arrow.WIDTH;
  arrow.COLOR = 'rgb(0, 0, 0)';
  arrow.isLeft = false;
  arrow.isRight = false;

  var groupBox = {};
  groupBox.WIDTH = histogram.AMOUNT_IN_GROUP * histogram.WIDTH + (histogram.AMOUNT_IN_GROUP - 1) * histogram.INDENT_BETWEEN;
  groupBox.HEIGHT = histogram.MAX_HEIGHT + 2 * text.LINE_HEIGHT;
  groupBox.X = inner.X + arrow.WIDTH + (inner.WIDTH - 2 * arrow.WIDTH - groupBox.WIDTH) / 2;
  groupBox.Y = inner.Y + inner.HEIGHT - groupBox.HEIGHT;

  var currentUser = {};
  currentUser.NAME = 'Вы';
  currentUser.HISTOGRAM_COLOR = 'rgba(255, 0, 0, 1)';

  arrow.Y = groupBox.Y + groupBox.HEIGHT / 2 - arrow.HEIGHT / 2;

  var createRandomNumber = function (min, max) {
    return Math.round(min - 0.5 + Math.random() * (max - min + 1));
  };

  var createRandomColor = function (object) { // object = {red(0 - 255), green(0 - 255), blue(0 - 255)}
    object.red = String(object.red) !== 'undefined' ? object.red : createRandomNumber(0, 255);
    object.green = String(object.green) + '' !== 'undefined' ? object.green : createRandomNumber(0, 255);
    object.blue = String(object.blue) + '' !== 'undefined' ? object.blue : createRandomNumber(0, 255);

    return 'rgb(' + object.red + ', ' + object.green + ', ' + object.blue + ')';
  };

  var drawCloud = function (object, isCloud) {
    ctx.beginPath();
    ctx.moveTo(object.X, object.Y);
    ctx.lineTo(object.X + object.OFFSET, object.Y + object.HEIGHT / 2);
    ctx.lineTo(object.X, object.Y + object.HEIGHT);
    ctx.lineTo(object.X + object.WIDTH / 2, object.Y + object.HEIGHT - object.OFFSET);
    ctx.lineTo(object.X + object.WIDTH, object.Y + object.HEIGHT);
    ctx.lineTo(object.X + object.WIDTH - object.OFFSET, object.Y + object.HEIGHT / 2);
    ctx.lineTo(object.X + object.WIDTH, object.Y);
    ctx.lineTo(object.X + object.WIDTH / 2, object.Y + object.OFFSET);
    ctx.lineTo(object.X, object.Y);

    if (isCloud) {
      ctx.stroke();
    }

    ctx.closePath();
    ctx.fillStyle = object.COLOR;
    ctx.fill();
  };

  var drawStringCenter = function (string, stringY, stringColor, centerX) {
    var stringWidth = ctx.measureText(string).width;

    ctx.fillStyle = stringColor;
    ctx.fillText(string, centerX - stringWidth / 2, stringY);
  };

  var drawLongMessage = function (message) {
    message.split('\n').forEach(function (string, index) {
      drawStringCenter(string, inner.Y + index * text.LINE_HEIGHT, text.COLOR, inner.X + inner.WIDTH / 2);
    });
  };

  var drawArrow = function (object, isLeft, isTransparent) {
    ctx.beginPath();

    if (isLeft) {
      ctx.moveTo(object.LEFT_X, object.Y);
      ctx.lineTo(object.LEFT_X, object.Y + object.HEIGHT);
      ctx.lineTo(object.LEFT_X - object.WIDTH, object.Y + object.HEIGHT / 2);
      ctx.lineTo(object.LEFT_X, object.Y);
    } else {
      ctx.moveTo(object.RIGHT_X, object.Y);
      ctx.lineTo(object.RIGHT_X, object.Y + object.HEIGHT);
      ctx.lineTo(object.RIGHT_X + object.WIDTH, object.Y + object.HEIGHT / 2);
      ctx.lineTo(object.RIGHT_X, object.Y);
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
    ctx.clearRect(inner.X, groupBox.Y, inner.WIDTH, groupBox.HEIGHT);

    ctx.fillStyle = cloud.COLOR;
    ctx.fillRect(inner.X, groupBox.Y, inner.WIDTH, groupBox.HEIGHT);
  };

  var gamer = {};
  gamer.values = [];
  gamer.createValues = function () {
    for (i = 0; i < names.length; i++) {
      this.values[i] = {};
      this.values[i]['name'] = names[i];
      this.values[i]['time'] = times[i];
    }

    this.values = this.values.sort(function (a, b) {
      return a.time - b.time ? a.time - b.time : a.name - b.name;
    });
  };

  var group = {};
  group.values = [];
  group.createValues = function () {
    var currentGamerIndex = 0;

    for (i = 0; i < this.amount; i++) {
      this.values[i] = [];

      for (j = 0; j < histogram.AMOUNT_IN_GROUP && currentGamerIndex < gamer.values.length; j++, currentGamerIndex++) {
        this.values[i][j] = {};
        currentElement = this.values[i][j];

        var currentGamer = gamer.values[currentGamerIndex];
        var currentHistogramHeight = currentGamer.time * histogram.MAX_HEIGHT / gamer.maxTime;
        var currentHistogramX = groupBox.X + j * histogram.WIDTH + j * histogram.INDENT_BETWEEN;
        var currentHistogramY = inner.Y + inner.HEIGHT - currentHistogramHeight - text.LINE_HEIGHT;

        if (currentGamer.name === currentUser.NAME) {
          this.currentIndex = i;
        }

        currentElement.name = {
          value: currentGamer.name,
          x: currentHistogramX,
          y: inner.Y + inner.HEIGHT,
          color: text.COLOR,
          draw: function () {
            ctx.textBaseline = 'ideographic';
            drawStringCenter(this.value, this.y, this.color, this.x + histogram.WIDTH / 2);
            ctx.textBaseline = 'hanging';
          }
        };

        currentElement.histogram = {
          x: currentHistogramX,
          y: currentHistogramY,
          width: histogram.WIDTH,
          height: currentHistogramHeight,
          color: currentGamer.name === currentUser.NAME ? currentUser.HISTOGRAM_COLOR : createRandomColor({red: 42, green: 42}),
          draw: function () {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
          }
        };

        currentElement.time = {
          value: String(Math.round(currentGamer.time)),
          x: currentHistogramX,
          y: currentHistogramY - text.LINE_HEIGHT,
          color: text.COLOR,
          draw: function () {
            drawStringCenter(this.value, this.y, this.color, this.x + histogram.WIDTH / 2);
          }
        };
      }
    }
  };
  group.draw = function () {
    for (i = 0; i < this.values[this.currentIndex].length; i++) {
      currentElement = this.values[this.currentIndex][i];

      currentElement.name.draw();
      currentElement.histogram.draw();
      currentElement.time.draw();
    }
  };

  var onArrowMousemove = function (event) {
    canvas.removeEventListener('click', onArrowClick);

    var mouseXY = canvas.getBoundingClientRect();
    var mouseX = event.pageX - mouseXY.left;
    var mouseY = event.pageY - mouseXY.top;

    drawArrow(arrow, true, true);

    if (ctx.isPointInPath(mouseX, mouseY) && arrow.isLeft) {
      canvas.style.cursor = 'pointer';

      isCurrentArrowLeft = true;
      canvas.addEventListener('click', onArrowClick);

      return;
    }

    drawArrow(arrow, false, true);

    if (ctx.isPointInPath(mouseX, mouseY) && arrow.isRight) {
      canvas.style.cursor = 'pointer';

      isCurrentArrowLeft = false;
      canvas.addEventListener('click', onArrowClick);

      return;
    }

    canvas.style.cursor = 'default';
  };

  var onArrowClick = function () {
    group.currentIndex = isCurrentArrowLeft ? group.currentIndex - 1 : group.currentIndex + 1;

    clearContent();
    group.draw();
    drawArrows(group);

    if (group.currentIndex === 0 || group.currentIndex === group.amount - 1) {
      canvas.style.cursor = 'default';
      canvas.removeEventListener('click', onArrowClick);
    }
  };

  var onArrowKeydown = function (event) {
    var keyCode = event.keyCode;

    if (keyCode === 37 && arrow.isLeft) {
      group.currentIndex--;
    } else if (keyCode === 39 && arrow.isRight) {
      group.currentIndex++;
    }

    clearContent();
    group.draw();
    drawArrows(group);
  };

  ctx.font = '16px PT Mono';
  ctx.textBaseline = 'hanging';

  drawCloud(cloudShadow, false);
  drawCloud(cloud, true);

  drawLongMessage(resultMessage);

  gamer.createValues();
  gamer.maxTime = gamer.values[gamer.values.length - 1]['time'];

  group.amount = Math.ceil(gamer.values.length / histogram.AMOUNT_IN_GROUP);
  group.createValues();
  group.draw();

  drawArrows(group);

  canvas.addEventListener('mousemove', onArrowMousemove);
  document.addEventListener('keydown', onArrowKeydown);
};
