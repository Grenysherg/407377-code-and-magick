'use strict';

window.renderStatistics = function (ctx, names, times) {
  var resultMessage = 'Ура вы победили!\nСписок результатов:';

  var cloudX = 100;
  var cloudY = 10;
  var cloudWidth = 420;
  var cloudHeight = 270;
  var cloudOffset = 10;
  var cloudPadding = 5;
  var cloudColor = 'white';
  var cloudShadowColor = 'rgba(0, 0, 0, 0.7)';

  var lineHeight = 20;
  var textColor = 'black';

  var arrowWidth = 20;
  var arrowHeight = 20;
  var arrowColor = 'black';

  var histogramWidth = 40;
  var histogramMaxHeight = 150;
  var histogramIndent = 50;
  var histogramsInGroup = 4;

  var cloudShadowX = cloudX + 10;
  var cloudShadowY = cloudY + 10;

  var contentX = cloudX + cloudOffset + cloudPadding;
  var contentY = cloudY + cloudOffset + cloudPadding;
  var contentWidth = cloudWidth - 2 * (cloudOffset + cloudPadding);
  var contentHeight = cloudHeight - 2 * (cloudOffset + cloudPadding);

  var groupWidth = histogramsInGroup * histogramWidth + (histogramsInGroup - 1) * histogramIndent;
  var groupHeight = histogramMaxHeight + 2 * lineHeight;
  var groupX = contentX + arrowWidth + (contentWidth - 2 * arrowWidth - groupWidth) / 2;
  var groupY = contentY + contentHeight - groupHeight;

  var leftArrowX = contentX + arrowWidth;
  var rightArrowX = contentX + contentWidth - arrowWidth;
  var arrowY = groupY + groupHeight / 2 - arrowHeight / 2;

  var drawCloud = function (x, y, width, height, offset, color) {
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
    ctx.stroke();
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  };

  var drawArrow = function (x, y, width, height, color, isLeft) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + height);

    if (isLeft) {
      ctx.lineTo(x - width, y + height / 2);
    } else {
      ctx.lineTo(x + width, y + height / 2);
    }

    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  };

  ctx.font = '16px PT Mono';
  ctx.textBaseline = 'hanging';

  drawCloud(cloudShadowX, cloudShadowY, cloudWidth, cloudHeight, cloudOffset, cloudShadowColor);
  drawCloud(cloudX, cloudY, cloudWidth, cloudHeight, cloudOffset, cloudColor);

  resultMessage.split('\n').forEach(function (line, i) {
    var lineWidth = ctx.measureText(line).width;

    ctx.fillStyle = textColor;
    ctx.fillText(line, contentX + contentWidth / 2 - lineWidth / 2, contentY + lineHeight * i);
  });

  var i;
  var j;

  var gamers = [];

  for (i = 0; i < names.length; i++) {
    gamers[i] = {};
    gamers[i]['name'] = names[i];
    gamers[i]['time'] = times[i];
  }

  var sortedGamers = gamers.sort(function (a, b) {
    return a.time - b.time;
  });

  var maxTime = sortedGamers[sortedGamers.length - 1]['time'];

  var groupsNumber = Math.ceil(sortedGamers.length / histogramsInGroup);
  var groups = [];
  var currentGamerIndex = 0;
  var groupWithCurrentUser;

  var currentGroupElement;
  var currentGamer;
  var currentHistogramHeight;
  var currentHistogramX;
  var currentHistogramY;

  for (i = 0; i < groupsNumber; i++) {
    groups[i] = [];

    for (j = 0; j < histogramsInGroup && currentGamerIndex < sortedGamers.length; j++, currentGamerIndex++) {
      groups[i][j] = {};

      currentGroupElement = groups[i][j];
      currentGamer = sortedGamers[currentGamerIndex];
      currentHistogramHeight = currentGamer['time'] * histogramMaxHeight / maxTime;
      currentHistogramX = groupX + j * histogramWidth + j * histogramIndent;
      currentHistogramY = contentY + contentHeight - currentHistogramHeight - lineHeight;

      if (currentGamer['name'] === 'Вы') {
        groupWithCurrentUser = i;
      }

      currentGroupElement['name'] = {
        value: currentGamer['name'],
        x: currentHistogramX,
        y: contentY + contentHeight,
        color: textColor,
        show: function () {
          ctx.textBaseline = 'ideographic';
          ctx.fillStyle = this.color;
          ctx.fillText(this.value, this.x, this.y);
          ctx.textBaseline = 'hanging';
        }
      };

      currentGroupElement['histogram'] = {
        x: currentHistogramX,
        y: currentHistogramY,
        width: histogramWidth,
        height: currentHistogramHeight,
        color: (currentGamer['name'] === 'Вы') ? 'rgba(255, 0, 0, 1)' : 'hsl(240, ' + Math.ceil(Math.random() * 100) + '%, 50%)',
        show: function () {
          ctx.fillStyle = this.color;
          ctx.fillRect(this.x, this.y, this.width, this.height);
        }
      };

      currentGroupElement['time'] = {
        value: Math.ceil(currentGamer['time']).toString(),
        x: currentHistogramX,
        y: currentHistogramY - lineHeight,
        color: textColor,
        show: function () {
          ctx.fillStyle = this.color;
          ctx.fillText(this.value, this.x, this.y);
        }
      };
    }
  }

  var clearContent = function () {
    ctx.clearRect(contentX, groupY, contentWidth, groupHeight);

    ctx.fillStyle = 'white';
    ctx.fillRect(contentX, groupY, contentWidth, groupHeight);
  };

  var showGroup = function (group) {
    for (i = 0; i < group.length; i++) {
      group[i]['name']['show']();
      group[i]['histogram']['show']();
      group[i]['time']['show']();
    }
  };

  var isLeftArrow = false;
  var isRightArrow = false;

  var showArrows = function (index) {
    if (index > 0) {
      drawArrow(leftArrowX, arrowY, arrowWidth, arrowHeight, arrowColor, true);
      isLeftArrow = true;
    } else {
      isLeftArrow = false;
    }

    if (index < (groupsNumber - 1)) {
      drawArrow(rightArrowX, arrowY, arrowWidth, arrowHeight, arrowColor, false);
      isRightArrow = true;
    } else {
      isRightArrow = false;
    }
  };

  var currentGroupIndex = groupWithCurrentUser;
  var currentGroup = groups[currentGroupIndex];

  showGroup(currentGroup);
  showArrows(currentGroupIndex);

  var canvas = document.querySelector('canvas');
  var mouseXY;
  var mouseX;
  var mouseY;
  var isCurrentArrowLeft;

  var arrowClick = function () {
    currentGroup = isCurrentArrowLeft ? groups[--currentGroupIndex] : groups[++currentGroupIndex];

    clearContent();
    showGroup(currentGroup);
    showArrows(currentGroupIndex);

    canvas.style.cursor = (currentGroupIndex > 0 && currentGroupIndex < (groupsNumber - 1)) ? 'pointer' : 'default';
  };

  var arrowMousemove = function (event) {
    canvas.removeEventListener('click', arrowClick);

    mouseXY = canvas.getBoundingClientRect();
    mouseX = event.pageX - mouseXY.left;
    mouseY = event.pageY - mouseXY.top;

    drawArrow(leftArrowX, arrowY, arrowWidth, arrowHeight, 'transparent', true);

    if (ctx.isPointInPath(mouseX, mouseY) && isLeftArrow) {
      canvas.style.cursor = 'pointer';

      isCurrentArrowLeft = true;
      canvas.addEventListener('click', arrowClick);

      return;
    }

    drawArrow(rightArrowX, arrowY, arrowWidth, arrowHeight, 'transparent', false);

    if (ctx.isPointInPath(mouseX, mouseY) && isRightArrow) {
      canvas.style.cursor = 'pointer';

      isCurrentArrowLeft = false;
      canvas.addEventListener('click', arrowClick);

      return;
    }

    canvas.style.cursor = 'default';
  };

  canvas.addEventListener('mousemove', arrowMousemove);
};
