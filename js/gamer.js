'use strict';

(function () {
  var gamerGroups = [];
  var groupWithCurrentUser;

  var currentUser = {};
  currentUser.NAME = 'Вы';
  currentUser.HISTOGRAM_COLOR = 'rgba(255, 0, 0, 1)';


  var createGamers = function (names, times) {
    var gamers = [];

    for (var i = 0; i < names.length; i++) {
      gamers[i] = {};
      gamers[i]['name'] = names[i];
      gamers[i]['time'] = times[i];
    }

    return gamers.sort(function (a, b) {
      return a.time - b.time ? a.time - b.time : a.name - b.name;
    });
  };

  var createGamerResult = function (ctx, gamerElement, gamerHistogram, text) {
    var gamerElementResult = {};

    gamerElementResult.name = {};
    gamerElementResult.name.value = gamerElement.name;
    gamerElementResult.name.x = gamerHistogram.x;
    gamerElementResult.name.y = gamerHistogram.y + gamerHistogram.height + text.LINE_HEIGHT;
    gamerElementResult.name.color = text.COLOR;
    gamerElementResult.name.draw = function () {
      ctx.textBaseline = 'ideographic';
      window.canvas.drawStringCenter(ctx, this.value, this.y, this.color, this.x + gamerHistogram.width / 2);
      ctx.textBaseline = 'hanging';
    };

    gamerElementResult.histogram = {};
    gamerElementResult.histogram.x = gamerHistogram.x;
    gamerElementResult.histogram.y = gamerHistogram.y;
    gamerElementResult.histogram.width = gamerHistogram.width;
    gamerElementResult.histogram.height = gamerHistogram.height;
    gamerElementResult.histogram.color = gamerElement.name === currentUser.NAME ? currentUser.HISTOGRAM_COLOR : window.util.createRandomRGBColor({red: 42, green: 42});
    gamerElementResult.histogram.draw = function () {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    };

    gamerElementResult.time = {};
    gamerElementResult.time.value = String(Math.round(gamerElement.time));
    gamerElementResult.time.x = gamerHistogram.x;
    gamerElementResult.time.y = gamerHistogram.y - text.LINE_HEIGHT;
    gamerElementResult.time.color = text.COLOR;
    gamerElementResult.time.draw = function () {
      window.canvas.drawStringCenter(ctx, this.value, this.y, this.color, this.x + gamerHistogram.width / 2);
    };

    return gamerElementResult;
  };


  window.gamer = {};

  window.gamer.getGroups = function () {
    return gamerGroups;
  };

  window.gamer.getGroupWithCurrentUser = function () {
    return groupWithCurrentUser;
  };

  window.gamer.createGroups = function (ctx, names, times, histogram, groupBox, inner, text) {
    var gamers = createGamers(names, times);
    var groupsLength = Math.ceil(gamers.length / histogram.AMOUNT_IN_GROUP);
    var gamerMaxTime = gamers[gamers.length - 1]['time'];
    var currentGamerIndex = 0;

    for (var i = 0; i < groupsLength; i++) {
      gamerGroups[i] = [];

      for (var j = 0; j < histogram.AMOUNT_IN_GROUP && currentGamerIndex < gamers.length; j++, currentGamerIndex++) {
        var currentGamer = gamers[currentGamerIndex];

        var currentGamerHistogram = {};
        currentGamerHistogram.width = histogram.WIDTH;
        currentGamerHistogram.height = currentGamer.time * histogram.MAX_HEIGHT / gamerMaxTime;
        currentGamerHistogram.x = groupBox.X + j * histogram.WIDTH + j * histogram.INDENT_BETWEEN;
        currentGamerHistogram.y = inner.Y + inner.HEIGHT - currentGamerHistogram.height - text.LINE_HEIGHT;

        gamerGroups[i][j] = createGamerResult(ctx, currentGamer, currentGamerHistogram, text);

        if (currentGamer.name === currentUser.NAME) {
          groupWithCurrentUser = i;
        }
      }
    }
  };

  window.gamer.drawGroup = function (currentGroupIndex) {
    var currentElement;

    for (var i = 0; i < gamerGroups[currentGroupIndex].length; i++) {
      currentElement = gamerGroups[currentGroupIndex][i];

      currentElement.name.draw();
      currentElement.histogram.draw();
      currentElement.time.draw();
    }
  };
})();

