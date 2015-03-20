require('canvas-testbed')(render, start)

var Point = require('verlet-point')
var array = require('array-range')
var random = require('randf')
var VerletSystem = require('verlet-system')

var sys
var ps

function start(ctx, width, height) {
  //create a world where points stay within window bounds
  sys = VerletSystem({
    gravity: [0, 500],
    min: [0, 0],
    max: [width, height],
    friction: 0.98,
    bounce: 1.0
  })

  //create 500 points scattered around page
  ps = array(500).map(function() {
    return Point({
      position: [ random(0, width), random(0, height) ],
      mass: 10
    })
  })
}

function render(ctx, width, height, elapsed) {
  //constrain the system within the window bounds
  sys.min = [0, 0]; sys.max = [width, height]
  //step the physics
  sys.integrate(ps, elapsed/1000)
  ctx.clearRect(0, 0, width, height)
  drawPoints(ps, ctx)
}

function drawPoints(points, ctx) {
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath()
  points.forEach(function(point) {
    ctx.moveTo(point.previous[0], point.previous[1])
    ctx.lineTo(point.position[0], point.position[1])
  })
  ctx.stroke()
}
