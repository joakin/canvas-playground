var rgb = require('color-style')

exports.clear = function(alpha, ctx, width, height) {
  ctx.fillStyle = rgb(0, 0, 0, alpha || 0.5)
  ctx.fillRect(0, 0, width, height)
}

exports.drawFPS = function(fps, ctx) {
  ctx.font = 'bold 12pt Courier'
  ctx.textAlign = 'left'
  ctx.fillStyle = rgb(255,0,0)
  ctx.fillText(fps + 'fps', 10, 20)
}

exports.drawBottomCenteredText = function(text, ctx, width, height) {
  ctx.font = 'bold 12pt sans-serif'
  ctx.textAlign = 'center'
  ctx.fillStyle = rgb(255,255,0)
  ctx.fillText(text, width / 2, height - 20)
}

exports.line = function(ctx, px, py, qx, qy, w) {
  ctx.lineWidth = w
  ctx.beginPath()
  ctx.moveTo(px, py)
  ctx.lineTo(qx, qy)
  ctx.stroke()
}
