require('canvas-testbed')(render, start)

var blur = 0.1
var speed = 1

var demos = [
  require('./waves'),
  require('./original-dots')
]
var currentDemoIndex = 0
var currentDemo = demos[currentDemoIndex]

function start(/* context, width, height */) {
  var app = this
  var canvas = app.canvas
  canvas.onclick = function() {
    currentDemoIndex = (currentDemoIndex+1) % demos.length
    currentDemo = demos[currentDemoIndex]
  }
  document.onkeydown = function(e) {
    switch(e.keyCode) {
      case 37: // Left
        console.log(blur = Math.max(0, blur*0.8)); break
      case 38: // Up
        console.log(speed = speed*1.05); break
      case 39: // Right
        console.log(blur = Math.min(1, blur*1.2)); break
      case 40: // Down
        console.log(speed = speed/1.05); break
      default:
        console.log(e.keyCode)
    }
  }
}

function render(context, width, height) {
  clear(blur, context, width, height)
  drawFPS(this.fps, context)
  drawMessage(context, width, height)
  currentDemo(Date.now()/speed, context, width, height)
}

function clear(alpha, context, width, height) {
  context.fillStyle = 'rgba(0,0,0,'+alpha||0.5+')'
  context.fillRect(0, 0, width, height)
}

function drawFPS(fps, context) {
  context.font = 'bold 12pt Courier'
  context.textAlign = 'left'
  context.fillStyle = 'rgba(255,0,0,1)'
  context.fillText(fps+'fps', 10, 20)
}

var msg = 'click to change demo. <left>/<right> for blur.'

function drawMessage(context, width, height) {
  context.font = 'bold 12pt sans-serif'
  context.textAlign = 'center'
  context.fillStyle = 'rgba(255,255,0,1)'
  context.fillText(msg, width/2, height - 20)
}




