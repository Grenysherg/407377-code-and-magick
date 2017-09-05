'use strict';

(function () {
  window.canvas = {};

  window.canvas.drawStringCenter = function (ctx, string, stringY, stringColor, centerX) {
    var stringWidth = ctx.measureText(string).width;

    ctx.fillStyle = stringColor;
    ctx.fillText(string, centerX - stringWidth / 2, stringY);
  };

  window.canvas.drawLongMessageWithLineBreak = function (ctx, message, messageContainer, text) {
    message.split('\n').forEach(function (string, index) {
      window.canvas.drawStringCenter(ctx, string, messageContainer.Y + index * text.LINE_HEIGHT, text.COLOR, messageContainer.X + messageContainer.WIDTH / 2);
    });
  };

  window.canvas.drawCloud = function (ctx, cloud, isCloud) {
    ctx.beginPath();
    ctx.moveTo(cloud.X, cloud.Y);
    ctx.lineTo(cloud.X + cloud.OFFSET, cloud.Y + cloud.HEIGHT / 2);
    ctx.lineTo(cloud.X, cloud.Y + cloud.HEIGHT);
    ctx.lineTo(cloud.X + cloud.WIDTH / 2, cloud.Y + cloud.HEIGHT - cloud.OFFSET);
    ctx.lineTo(cloud.X + cloud.WIDTH, cloud.Y + cloud.HEIGHT);
    ctx.lineTo(cloud.X + cloud.WIDTH - cloud.OFFSET, cloud.Y + cloud.HEIGHT / 2);
    ctx.lineTo(cloud.X + cloud.WIDTH, cloud.Y);
    ctx.lineTo(cloud.X + cloud.WIDTH / 2, cloud.Y + cloud.OFFSET);
    ctx.lineTo(cloud.X, cloud.Y);

    if (isCloud) {
      ctx.stroke();
    }

    ctx.closePath();
    ctx.fillStyle = cloud.COLOR;
    ctx.fill();
  };
})();
