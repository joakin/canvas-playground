require('canvas-testbed')(render, start)
var cycle = require('cycle-values')
var h = require('../../canvas-helpers')

var blr = 0.1
var speed = 1

var cycleDemo = cycle([
  require('./waves'),
  require('./original-dots')
])
var currentDemo = cycleDemo()

function start(/* ctx, width, height */) {
  var app = this
  var canvas = app.canvas
  canvas.onclick = function() {
    currentDemo = cycleDemo()
  }
  document.onkeydown = function(e) {
    switch(e.keyCode) {
      case 37: // Left, increase blur by decreasing alpha
        console.log(blr = Math.max(0, blr*0.8)); break
      case 39: // Right, decrease blur by increasing alpha
        console.log(blr = Math.min(1, blr*1.2)); break
      case 38: // Up, speed up time
        console.log(speed = speed*1.05); break
      case 40: // Down, slow down time
        console.log(speed = speed/1.05); break
      default:
        console.log(e.keyCode)
    }
  }
}

var msg = 'click to change demo. <left>/<right> for blur.'

function render(ctx, width, height) {
  h.clear(blr, ctx, width, height)
  h.drawFPS(this.fps, ctx)
  h.drawBottomCenteredText(msg, ctx, width, height)
  currentDemo(Date.now()/speed, ctx, width, height)
}

