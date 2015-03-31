require('canvas-testbed')(render, start)

var Point = require('verlet-point')
var array = require('array-range')
var random = require('randf')
var VerletSystem = require('verlet-system')
var vec = require('gl-vec2')
var accum = require('time-accumulator')
var touch = require('touches')
var fillCircle = require('fill-circle')
var rgb = require('color-style')
var lerp = require('lerp-array')

var bumper = accum(2500)
var toucher = accum(33)

var sys
var ps

var tp

function start(ctx, width, height) {
  //create a world where points stay within window bounds
  sys = VerletSystem({
    gravity: [0, 500],
    min: [0, 0],
    max: [width, height],
    friction: 0.98,
    bounce: 1.0
  })

  var minMass = 3
  var maxMass = 10
  var minRadius = 1
  var maxRadius = 3
  //create 500 points scattered around page
  ps = array(500).map(function() {
    var pos = [random(0, width), random(0, height)]
    var prev = vec.subtract([], pos, [random(-10, 10), random(-10, 10)])
    var m = random(minMass, 10)
    return Point({
      previous: prev,
      position: pos,
      mass: m,
      radius: minRadius+((m-minMass)*maxRadius/(maxMass-minMass)),
    })
  })

  //bind touch events
  tp = null
  touch(window, {filtered: true})
    .on('start', function(ev, pos) {
      tp = pos
    })
    .on('move', function(ev, pos) {
      if (tp)
        tp = pos
    })
    .on('end', function() {
      tp = null
    })
}

function render(ctx, width, height, elapsed) {
  //constrain the system within the window bounds
  sys.min = [0, 0]; sys.max = [width, height]
  //ocasionally rebump particles to keep things alive
  bumper(elapsed, bumpParticles)
  //interact with the touch
  toucher(elapsed, touchParticles)
  //step the physics
  sys.integrate(ps, elapsed/1000)

  //drawing
  ctx.clearRect(0, 0, width, height)
  drawPointsAsCircles(ps, ctx)
}

function drawPointsAsCircles(points, ctx) {
  ctx.fillStyle = rgb(0,0,0);
  points.forEach(function(p) {
    fillCircle(ctx, p.position[0], p.position[1], p.radius)
  })
  ctx.stroke()
}

function drawPointsAsLines(points, ctx) {
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath()
  points.forEach(function(point) {
    ctx.moveTo(point.previous[0], point.previous[1])
    ctx.lineTo(point.position[0], point.position[1])
  })
  ctx.stroke()
}

function bumpParticles() {
  ps.forEach(function(p) {
    p.addForce([random(-10, 10), random(-40, 40)])
  })
}

function touchParticles() {
  if (!tp) return;
  ps.forEach(function(p) {
    var d = vec.distance(p.position, tp)
    var f = [0,0]
    if (d < 150) {
      vec.subtract(f, p.position, tp)
      vec.divide(f, f, [d/2, d/10])
      p.addForce(f)
    }
  })
}

