var rgb = require('color-style')

module.exports = function(now, ctx, width, height) {
  drawWave(now, 'sin', rgb(255,0,0,0.5), ctx, width, height);
  drawWave(now, 'cos', rgb(0,255,0,0.5), ctx, width, height);
}

function drawWave(now, wave, color, ctx, width, height) {
  var T = 200
  var t = now / T
  wave = Math[wave]

  drawLabel(t, ctx)

  var amp = 0.3
  var Y = function(n) { return (0.5+n/2)*amp+(1-amp)/2 }

  ctx.font = 'bold 12pt Courier'
  ctx.fillStyle = color || rgb(255,255,255)
  for (var i = 0, N = Math.max(width/3, 200); i < N; ++i) {
    var val = wave(6*Math.PI*(t+i)/N)
    ctx.fillText('.', width * i/N, height * Y(val))
  }
}

function drawLabel(text, ctx) {
  ctx.font = 'bold 12pt Courier'
  ctx.textAlign = 'left'
  ctx.fillStyle = rgb(255,255,255)
  ctx.fillText(text, 10, 50)
}

