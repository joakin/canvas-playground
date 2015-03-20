require('canvas-testbed')(render, start)
var h = require('../../canvas-helpers')
var fillCircle = require('fill-circle')
var randf = require('randf')
var rgb = require('color-style')
var hsl = require('color-style').hsl
var touch = require('touches')
var lerp = require('lerp-array')

var mouse
var particles
var n
var minParticleSize
var maxParticleSize

function start(ctx, width, height) {
  document.body.style.backgroundColor = 'black'

  this.canvas.addEventListener('click', onClick);
  function onClick(e) {
    e.preventDefault();
    init(ctx, width, height)
  }

  touch(this.canvas, {filtered: true}).on('move', onMove)
  function onMove(e, pos) {
    e.preventDefault();
    mouse = pos
  }

  init(ctx, width, height)
}

function init(ctx, width, height) {
  n = Math.ceil(randf(50, 400))
  minParticleSize = randf(2, 30)
  maxParticleSize = randf(minParticleSize, 50)

  mouse = [width * 0.5, height * 0.5]

  particles = []
  var dim = Math.min(width, height)/(4+(4*maxParticleSize/30))
  for ( var i = 0; i < n; i++ ) {
    var a = angle(i, n)
    var p = pointFromCircle(mouse, dim, a)
    var p2 = pointFromCircle(mouse, dim, angle(i+1, n))
    particles[i] = new Particle(
      p[0], p[1],
      (p2[0]-p[0])*5, (p2[1]-p[1])*5,
      hsl(lerp(300, 0, i*1/n), 80, 40, randf(0.5, 0.8)),
      lerp(0.999, 0.985, i*1/n),
      randf(minParticleSize, maxParticleSize)
    )
  }
}

function pointFromCircle(c, r, a) {
  return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)]
}

// Returns an angle in radians for num i in total n
function angle(i, n) { return i*(360/n) * 2*Math.PI/360 }

var msg = 'Click to randomly regenerate particles'
function render(ctx, width, height) {
  ctx.clearRect(0, 0, width, height)
  h.drawFPS(this.fps, ctx)
  h.drawBottomCenteredText(msg, ctx, width, height)
  ctx.lineCap="round";
  for ( var i = 0; i < particles.length; i++ ) {
    particles[i].bounce(0, 0, width, height)
    particles[i].attract(mouse)
    particles[i].update()
    particles[i].draw(ctx)
  }
  drawPointer(mouse, ctx)
}

function drawPointer(mouse, ctx) {
  ctx.fillStyle = rgb(255, 255, 255)
  fillCircle(ctx, mouse[0], mouse[1], 5)
}

function Particle(x, y, vx, vy, color, friction, size) {
  this.x = this.oldx = x
  this.y = this.oldy = y
  this.vx = vx
  this.vy = vy
  this.color = color
  this.friction = friction
  this.size = size
}

Particle.prototype.update = function() {
  this.vx *= this.friction
  this.vy *= this.friction
  this.oldx = this.x
  this.oldy = this.y
  this.x += this.vx
  this.y += this.vy
}

Particle.prototype.draw = function(ctx) {
  ctx.strokeStyle = this.color
  h.line(ctx, this.oldx, this.oldy, this.x, this.y, this.size)
}

Particle.prototype.attract = function(to) {
  var dx = to[0] - this.x
  var dy = to[1] - this.y
  var distance = Math.sqrt(dx * dx + dy * dy)
  if (distance === 0) { distance = 1 }
  this.vx += dx / distance
  this.vy += dy / distance
}

Particle.prototype.bounce = function(x, y, w, h) {
  var slow = 0.3
  if (this.x <= x) this.vx = Math.abs(this.vx) * slow
  if (this.x >= w) this.vx = - Math.abs(this.vx) * slow
  if (this.y <= y) this.vy = Math.abs(this.vy) * slow
  if (this.y >= h) this.vy = - Math.abs(this.vy) * slow
}

