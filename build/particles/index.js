(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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


},{"../../canvas-helpers":2,"canvas-testbed":3,"color-style":12,"fill-circle":13,"lerp-array":14,"randf":16,"touches":17}],2:[function(require,module,exports){
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

},{"color-style":12}],3:[function(require,module,exports){
var domready = require('domready');
require('raf.js');

var CanvasApp = require('canvas-app');

module.exports = function( render, start, options ) {
	domready(function() {
		//options were provided as the first argument, no render handler
		if (typeof render === "object" && render) {
			options = render;
			render = null;
			start = null;
		}
		//options were provided as the second argument
		else if (typeof start === "object" && start) {
			options = start;
			start = null;
		}
		//otherwise options were provided as the third argument...

		
		options = options||{};
		if (typeof options.onReady !== 'function')
			options.onReady = start;

		var runner = CanvasApp(render, options);

		runner.canvas.setAttribute("id", "canvas");
		document.body.appendChild(runner.canvas);
		document.body.style.margin = "0";
		document.body.style.overflow = "hidden";
		
		runner.start();
	});
};
},{"canvas-app":4,"domready":10,"raf.js":11}],4:[function(require,module,exports){
var isGL = require('is-webgl-context');
var getGL = require('webgl-context');
var debounce = require('debounce');
var addEvent = require('add-event-listener');

function isCanvasContext(obj) {
    var ctx2d = typeof CanvasRenderingContext2D !== 'undefined' && obj instanceof CanvasRenderingContext2D;
    return obj && (ctx2d || isGL(obj));
}

function CanvasApp(render, options) {
    if (!(this instanceof CanvasApp))
        return new CanvasApp(render, options);

    //allow options to be passed as first argument
    if (typeof render === 'object' && render) {
        options = render;
        render = null;
    }

    render = typeof render === 'function' ? render : options.onRender;

    options = options||{};
    options.retina = typeof options.retina === "boolean" ? options.retina : true;
    
    var hasWidth = typeof options.width === "number", 
        hasHeight = typeof options.height === "number";

    //if either width or height is specified, don't auto-resize to the window...
    if (hasWidth || hasHeight) 
        options.ignoreResize = true;

    options.width = hasWidth ? options.width : window.innerWidth;
    options.height = hasHeight ? options.height : window.innerHeight;

    var DPR = options.retina ? (window.devicePixelRatio||1) : 1; 

    //setup the canvas
    var canvas,
        context,
        attribs = options.contextAttributes||{};

    this.isWebGL = false;

    //if user provided a context object
    if (isCanvasContext(options.context)) {
        context = options.context;
        canvas = context.canvas;
    }

    //otherwise allow for a string to set one up
    if (!canvas)
        canvas = options.canvas || document.createElement("canvas");

    canvas.width = options.width * DPR;
    canvas.height = options.height * DPR;

    if (!context) {
        if (options.context === "webgl" || options.context === "experimental-webgl") {
            context = getGL({ canvas: canvas, attributes: attribs });
            if (!context) {
                throw "WebGL Context Not Supported -- try enabling it or using a different browser";
            }
        } else {
            context = canvas.getContext(options.context||"2d", attribs);
        }
    }

    this.isWebGL = isGL(context);

    if (options.retina) {
        canvas.style.width = options.width + 'px';
        canvas.style.height = options.height + 'px';
    }

    this.running = false;
    this.width = options.width;
    this.height = options.height;
    this.canvas = canvas;
    this.context = context;
    this.onResize = options.onResize;
    this._DPR = DPR;
    this._retina = options.retina;
    this._once = options.once;
    this._ignoreResize = options.ignoreResize;
    this._lastFrame = null;
    this._then = Date.now();
    this.maxDeltaTime = typeof options.maxDeltaTime === 'number' ? options.maxDeltaTime : 1000/24;

    //FPS counter
    this.fps = 60;
    this._frames = 0;
    this._prevTime = this._then;

    if (!this._ignoreResize) {
        options.resizeDebounce = typeof options.resizeDebounce === 'number'
                    ? options.resizeDebounce : 50;
        addEvent(window, "resize", debounce(function() {
            this.resize(window.innerWidth, window.innerHeight);
        }.bind(this), options.resizeDebounce, false));

        addEvent(window, "orientationchange", function() {
            this.resize(window.innerWidth, window.innerHeight);
        }.bind(this));
    }

    if (typeof render === "function") {
        this.onRender = render.bind(this);   
    } else {
        //dummy render function
        this.onRender = function (context, width, height, dt) { };
    }

    this.renderOnce = function() {
        var now = Date.now();
        var dt = Math.min(this.maxDeltaTime, (now-this._then));

        this._frames++;
        if (now > this._prevTime + 1000) {
            this.fps = Math.round((this._frames * 1000) / (now - this._prevTime));

            this._prevTime = now;
            this._frames = 0;
        }

        if (!this.isWebGL) {
            this.context.save();
            this.context.scale(this._DPR, this._DPR);
        } else {
            this.context.viewport(0, 0, this.width * this._DPR, this.height * this._DPR);
        }
        
        this.onRender(this.context, this.width, this.height, dt);

        if (!this.isWebGL)
            this.context.restore();

        this._then = now;
    };

    this._renderHandler = function() {
        if (!this.running) 
            return;
        
        if (!this._once) {
            this._lastFrame = requestAnimationFrame(this._renderHandler);
        }

        this.renderOnce();
    }.bind(this);

    if (typeof options.onReady === "function") {
        options.onReady.call(this, context, this.width, this.height);
    }
}

Object.defineProperty(CanvasApp.prototype, 'retinaEnabled', {

    set: function(v) {
        this._retina = v;
        this._DPR = this._retina ? (window.devicePixelRatio||1) : 1;
        this.resize(this.width, this.height);
    },

    get: function() {
        return this._retina;
    }
});

Object.defineProperty(CanvasApp.prototype, 'deviceWidth', {

    get: function() {
        return this.width * this._DPR;
    }
});

Object.defineProperty(CanvasApp.prototype, 'deviceHeight', {

    get: function() {
        return this.height * this._DPR;
    }
});

CanvasApp.prototype.resetFPS = function() {
    this._frames = 0;
    this._prevTime = Date.now();
    this._then = this._prevTime;
    this.fps = 60;
};

CanvasApp.prototype.start = function() {
    if (this.running)
        return;
    
    if (this._lastFrame) 
        cancelAnimationFrame(this._lastFrame);

    //reset FPS counter
    this.resetFPS();

    this.running = true;
    this._lastFrame = requestAnimationFrame(this._renderHandler);
};

CanvasApp.prototype.stop = function() {
    if (this._lastFrame) {
        cancelAnimationFrame(this._lastFrame);
        this._lastFrame = null;
    }
    this.running = false;
};

CanvasApp.prototype.resize = function(width, height) {
    var canvas = this.canvas;

    this.width = width;
    this.height = height;
    canvas.width = this.width * this._DPR;
    canvas.height = this.height * this._DPR;

    if (this._retina) {
        canvas.style.width = this.width + 'px';
        canvas.style.height = this.height + 'px';
    }

    if (this._once)
        requestAnimationFrame(this._renderHandler);
    if (typeof this.onResize === "function")
        this.onResize(this.width, this.height);
};

module.exports = CanvasApp;
},{"add-event-listener":5,"debounce":6,"is-webgl-context":8,"webgl-context":9}],5:[function(require,module,exports){
addEventListener.removeEventListener = removeEventListener
addEventListener.addEventListener = addEventListener

module.exports = addEventListener

var Events = null

function addEventListener(el, eventName, listener, useCapture) {
  Events = Events || (
    document.addEventListener ?
    {add: stdAttach, rm: stdDetach} :
    {add: oldIEAttach, rm: oldIEDetach}
  )
  
  return Events.add(el, eventName, listener, useCapture)
}

function removeEventListener(el, eventName, listener, useCapture) {
  Events = Events || (
    document.addEventListener ?
    {add: stdAttach, rm: stdDetach} :
    {add: oldIEAttach, rm: oldIEDetach}
  )
  
  return Events.rm(el, eventName, listener, useCapture)
}

function stdAttach(el, eventName, listener, useCapture) {
  el.addEventListener(eventName, listener, useCapture)
}

function stdDetach(el, eventName, listener, useCapture) {
  el.removeEventListener(eventName, listener, useCapture)
}

function oldIEAttach(el, eventName, listener, useCapture) {
  if(useCapture) {
    throw new Error('cannot useCapture in oldIE')
  }

  el.attachEvent('on' + eventName, listener)
}

function oldIEDetach(el, eventName, listener, useCapture) {
  el.detachEvent('on' + eventName, listener)
}

},{}],6:[function(require,module,exports){

/**
 * Module dependencies.
 */

var now = require('date-now');

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 *
 * @source underscore.js
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 * @param {Function} function to wrap
 * @param {Number} timeout in ms (`100`)
 * @param {Boolean} whether to execute at the beginning (`false`)
 * @api public
 */

module.exports = function debounce(func, wait, immediate){
  var timeout, args, context, timestamp, result;
  if (null == wait) wait = 100;

  function later() {
    var last = now() - timestamp;

    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function debounced() {
    context = this;
    args = arguments;
    timestamp = now();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
};

},{"date-now":7}],7:[function(require,module,exports){
module.exports = Date.now || now

function now() {
    return new Date().getTime()
}

},{}],8:[function(require,module,exports){
module.exports = function(ctx) {
	if (!ctx) return false
	var gl = ctx
	//compatibility with Chrome WebGL Inspector Addon
	if (typeof ctx.rawgl !== 'undefined')
		gl = ctx.rawgl
	if (typeof WebGLRenderingContext !== 'undefined' && gl instanceof WebGLRenderingContext)
		return true
	return false
}
},{}],9:[function(require,module,exports){
module.exports = function(opts) {
    opts = opts||{};
    var canvas = opts.canvas || document.createElement("canvas");
    if (typeof opts.width === "number")
        canvas.width = opts.width;
    if (typeof opts.height === "number")
        canvas.height = opts.height;
    
    var attribs = (opts.attributes || opts.attribs || {});
    try {
        gl = (canvas.getContext('webgl', attribs) || canvas.getContext('experimental-webgl', attribs));
    } catch (e) {
        gl = null;
    }
    return gl;
};
},{}],10:[function(require,module,exports){
/*!
  * domready (c) Dustin Diaz 2014 - License MIT
  */
!function (name, definition) {

  if (typeof module != 'undefined') module.exports = definition()
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
  else this[name] = definition()

}('domready', function () {

  var fns = [], listener
    , doc = document
    , hack = doc.documentElement.doScroll
    , domContentLoaded = 'DOMContentLoaded'
    , loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState)


  if (!loaded)
  doc.addEventListener(domContentLoaded, listener = function () {
    doc.removeEventListener(domContentLoaded, listener)
    loaded = 1
    while (listener = fns.shift()) listener()
  })

  return function (fn) {
    loaded ? fn() : fns.push(fn)
  }

});

},{}],11:[function(require,module,exports){
/*
 * raf.js
 * https://github.com/ngryman/raf.js
 *
 * original requestAnimationFrame polyfill by Erik Möller
 * inspired from paul_irish gist and post
 *
 * Copyright (c) 2013 ngryman
 * Licensed under the MIT license.
 */

(function(window) {
	var lastTime = 0,
		vendors = ['webkit', 'moz'],
		requestAnimationFrame = window.requestAnimationFrame,
		cancelAnimationFrame = window.cancelAnimationFrame,
		i = vendors.length;

	// try to un-prefix existing raf
	while (--i >= 0 && !requestAnimationFrame) {
		requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
		cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'];
	}

	// polyfill with setTimeout fallback
	// heavily inspired from @darius gist mod: https://gist.github.com/paulirish/1579671#comment-837945
	if (!requestAnimationFrame || !cancelAnimationFrame) {
		requestAnimationFrame = function(callback) {
			var now = +new Date(), nextTime = Math.max(lastTime + 16, now);
			return setTimeout(function() {
				callback(lastTime = nextTime);
			}, nextTime - now);
		};

		cancelAnimationFrame = clearTimeout;
	}

	// export to window
	window.requestAnimationFrame = requestAnimationFrame;
	window.cancelAnimationFrame = cancelAnimationFrame;
}(window));

},{}],12:[function(require,module,exports){
module.exports = getString.bind(this, formatRGBA);

module.exports.rgba = getString.bind(this, formatRGBA);
module.exports.rgb = module.exports.rgba;

module.exports.hsla = getString.bind(this, formatHSLA);
module.exports.hsl = module.exports.hsla;

function getString(format, r, g, b, a) {
	//first argument is a string, return immediately
	if (typeof r === 'string') {
		return r;
	}
	//first argument is array, assume format:
	//	rgba([r, g, b], a)
	//	rgba([r, g, b, a])
	//	rgba([r, g, b])
	else if (Array.isArray(r)) {
		var array = r;
		var second = g;
		r = array[0];
		g = array[1];
		b = array[2];
		//if alpha is specified in the array, use it
		//otherwise assume it's the second parameter
		a = typeof array[3] === 'number' ? array[3] : second;
	}
	//first argument is a number or undefined, assume format:
	//	rgba(r, g, b, a)
	//	rgba(r, g, b)
	//	rgba()  --> black
	
	//default values
	a = typeof a === 'number' ? a : 1.0;
	return format(r||0, g||0, b||0, a);
}

function formatRGBA(a, b, c, d) {
	return 'rgba('+ ~~(a) + //0 - 255
			',' + ~~(b)  + 
			',' + ~~(c) + 
			',' + d + ')';  //0.0 - 1.0
}

function formatHSLA(a, b, c, d) {
	return 'hsla('+ a + ',' + b + '%,' + c + '%,' + d + ')';
}
},{}],13:[function(require,module,exports){
module.exports = function(context, x, y, r) {
  context.beginPath()
  context.arc(x, y, r, 0, 2 * Math.PI)
  context.fill()
}

},{}],14:[function(require,module,exports){
var lerp = require('lerp')

module.exports = function lerpValues(value1, value2, t, out) {
    if (typeof value1 === 'number'
            && typeof value2 === 'number')
        return lerp(value1, value2, t)
    else { //assume array
        var len = Math.min(value1.length, value2.length)
        out = out||new Array(len)
        for (var i=0; i<len; i++) 
            out[i] = lerp(value1[i], value2[i], t)
        return out
    }
}
},{"lerp":15}],15:[function(require,module,exports){
function lerp(v0, v1, t) {
    return v0*(1-t)+v1*t
}
module.exports = lerp
},{}],16:[function(require,module,exports){
function random(start, end) {
    var n0 = typeof start === 'number',
        n1 = typeof end === 'number'

    if (n0 && !n1) {
        end = start
        start = 0
    } else if (!n0 && !n1) {
        start = 0
        end = 1
    }
    return start + Math.random() * (end - start)
}

module.exports = random
},{}],17:[function(require,module,exports){
var Emitter = require('events/')

var allEvents = [
    'touchstart', 'touchmove', 'touchend',
    'mousedown', 'mousemove', 'mouseup'
]

var ROOT = { left: 0, top: 0 }

module.exports = function handler(element, opt) {
    opt = opt||{}
    element = element || window
    
    var emitter = new Emitter()
    emitter.target = opt.target || element

    var touch = null, which = null
    var filtered = opt.filtered

    var events = allEvents

    //only a subset of events
    if (typeof opt.type === 'string') {
        events = allEvents.filter(function(type) {
            return type.indexOf(opt.type) === 0
        })
    }

    //grab the event functions
    var funcs = events.map(function(type) {
        var name = normalize(type)
        var fn = function(ev) {
            var client = ev
            if (/^touch/.test(type)) {
                if (filtered)
                    client = getFilteredTouch(ev, type)
                else
                    client = getTargetTouch(ev.changedTouches, emitter.target)
            }

            if (!client)
                return

            //get 2D position
            var pos = offset(client, emitter.target)
            
            //dispatch the normalized event to our emitter
            emitter.emit(name, ev, pos)
        }
        return { type: type, listener: fn }
    })
    
    emitter.enable = function enable() {
        funcs.forEach(listeners(element, true))

        return emitter
    }

    emitter.disable = function dispose() { 
        funcs.forEach(listeners(element, false))

        return emitter
    }

    //initially enabled
    emitter.enable() 
    return emitter

    function getFilteredTouch(ev, type) {
        var client

        //clear touch if it was lifted
        if (touch && /^touchend/.test(type)) {
            //allow end event to trigger on tracked touch
            client = getTouch(ev.changedTouches, touch.identifier||0)
            if (client)
                touch = null
        }
        //not yet tracking any touches, pick one from target
        else if (!touch && /^touchstart/.test(type)) {
            touch = client = getTargetTouch(ev.changedTouches, emitter.target)
        }
        //get the tracked touch
        else if (touch)
            client = getTouch(ev.changedTouches, touch.identifier||0)

        return client
    }
}

//get 2D client position of touch/mouse event
function offset(ev, target) {
    var cx = ev.clientX||0
    var cy = ev.clientY||0
    var rect = bounds(target)
    return [ cx - rect.left, cy - rect.top ]
}

//since we are adding events to a parent we can't rely on targetTouches
function getTargetTouch(touches, target) {
    return Array.prototype.slice.call(touches).filter(function(t) {
        return t.target === target
    })[0] || touches[0]
}

function getTouch(touches, id) {
    for (var i=0; i<touches.length; i++)
        if (touches[i].identifier === id)
            return touches[i]
    return null
}

function listeners(e, enabled) {
    return function(data) {
        if (enabled)
            e.addEventListener(data.type, data.listener)
        else
            e.removeEventListener(data.type, data.listener)
    }
}

//normalize touchstart/mousedown to "start" etc
function normalize(event) {
    return event.replace(/^(touch|mouse)/, '')
     .replace(/up$/, 'end')
     .replace(/down$/, 'start')
}

function bounds(element) {
    if (element===window
            ||element===document
            ||element===document.body)
        return ROOT
    else
        return element.getBoundingClientRect()
}
},{"events/":18}],18:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}]},{},[1]);
