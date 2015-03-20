var rgb = require('color-style')

module.exports = function (now, ctx, width, height) {
  var X = function (a) { return (0.5 + Math.sin(2*a) / 3); }
  var Y = function (a) { return (0.5 + Math.sin(3*a) / 3); }
  var Z = function (a) { return (0.5 + Math.sin(8*a) / 2); }
  var T = 200
  t = (now % T) / T

  ctx.font = 'bold 64pt Courier'
  for (var i = 0, N = 179; i < N; ++i) {
    var a = 2 * Math.PI * (i + t) / N
    // ctx.font = 'bold '+(12+Y(a)*52)+'pt Courier'
    ctx.fillStyle = rgb(255,255,255,Z(a))
    ctx.fillText('.', width * X(a), height * Y(a))
  }
}
