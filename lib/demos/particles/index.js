require('canvas-testbed')(render, start)
var h = require('../../canvas-helpers')

var mouse
var particles
var numParticles = 200
var minParticleSize = 2
var maxParticleSize = 5
function start(context, width, height) {
  this.canvas.addEventListener('click', onClick);
  function onClick(e) {
    e.preventDefault();
    numParticles = 1 + Math.random()*400
    minParticleSize = 2 + Math.random()*10
    maxParticleSize = minParticleSize + Math.random()*20
    init(context, width, height)
  }

  this.canvas.addEventListener('mousemove', onMousemove);
  function onMousemove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }
  this.canvas.addEventListener('touchmove', onTouchMove);
  function onTouchMove(e) {
    e.preventDefault();
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
  }

  init(context, width, height)
}

function init(context, width, height) {
  mouse = { x: width * 0.5, y: height * 0.5 }

  particles = []
  var dim = Math.min(width, height)
  for ( var i = 0; i < numParticles; i++ ) {
    particles[i] = new Particle(
      mouse.x, mouse.y,
      (Math.random()*dim - dim/2)/14,
      (Math.random()*dim - dim/2)/14,
      'hsla('+(i*100/numParticles)+', 80%, 40%, 1)'
    )
  }
}

var msg = 'Click to randomly regenerate particles'
function render(context, width, height) {
  h.clear(0.2, context, width, height)
  h.drawFPS(this.fps, context)
  h.drawBottomCenteredText(msg, context, width, height)
  for ( var i = 0; i < particles.length; i++ ) {
    particles[i].bounce(0, 0, width, height)
    particles[i].attract(mouse)
    particles[i].update()
    particles[i].draw(context)
  }
  drawPointer(mouse, context)
}

function drawPointer(mouse, context) {
  context.fillStyle = 'rgba(255, 255, 255, 1)'
  h.fillCircle(context, mouse.x, mouse.y, 5)
}

function Particle(x, y, vx, vy, color) {
  this.x = this.oldx = x
  this.y = this.oldy = y
  this.vx = vx
  this.vy = vy
  this.color = color
  this.friction = 0.999
  this.size = minParticleSize+Math.random()*maxParticleSize
}

Particle.prototype.update = function() {
  this.vx *= this.friction
  this.vy *= this.friction
  this.oldx = this.x
  this.oldy = this.y
  this.x += this.vx
  this.y += this.vy
}

Particle.prototype.draw = function(context) {
  context.strokeStyle = this.color
  context.fillStyle = this.color
  h.line(context, this.oldx, this.oldy, this.x, this.y, this.size)
  h.fillCircle(context, this.x, this.y, this.size/2)
}

Particle.prototype.attract = function(to) {
  var dx = to.x - this.x
  var dy = to.y - this.y
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

