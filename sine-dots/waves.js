
module.exports = function(now, context, width, height) {
  drawWave(now, 'sin', 'rgba(255,0,0,0.5)', context, width, height);
  drawWave(now, 'cos', 'rgba(0,255,0,0.5)', context, width, height);
}

function drawWave(now, wave, color, context, width, height) {
  var T = 200
  var t = now / T
  wave = Math[wave]

  drawLabel(t, context)

  var amp = 0.3
  var Y = function(n) { return (0.5+n/2)*amp+(1-amp)/2 }

  context.font = 'bold 12pt Courier'
  context.fillStyle = color || 'rgba(255,255,255,1)'
  for (var i = 0, N = Math.max(width/3, 200); i < N; ++i) {
    var val = wave(6*Math.PI*(t+i)/N)
    context.fillText('.', width * i/N, height * Y(val))
  }
}

function drawLabel(text, context) {
  context.font = 'bold 12pt Courier';
  context.textAlign = 'left'
  context.fillStyle = 'rgba(255,255,255,1)';
  context.fillText(text, 10, 50);
}

