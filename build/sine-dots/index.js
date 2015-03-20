(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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


},{"../../canvas-helpers":2,"./original-dots":3,"./waves":4,"canvas-testbed":5,"cycle-values":15}],2:[function(require,module,exports){
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

},{"color-style":14}],3:[function(require,module,exports){
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

},{"color-style":14}],4:[function(require,module,exports){
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


},{"color-style":14}],5:[function(require,module,exports){
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
},{"canvas-app":6,"domready":12,"raf.js":13}],6:[function(require,module,exports){
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
},{"add-event-listener":7,"debounce":8,"is-webgl-context":10,"webgl-context":11}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){

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

},{"date-now":9}],9:[function(require,module,exports){
module.exports = Date.now || now

function now() {
    return new Date().getTime()
}

},{}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
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
},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
var isNumber = require('isnumber')
var mod = require('mod-loop')

module.exports = function(values) {
  var pos = null
  return function(count) {
    count = count!=null && isNumber(count) ?
      parseInt(count, 10)
      : (pos == null? 0: 1)
    pos = mod((pos == null? 0: pos) + count, values.length)
    return values[pos]
  }
}

},{"isnumber":16,"mod-loop":17}],16:[function(require,module,exports){
module.exports = isNumber

/**
 * Determine if something is a non-infinite javascript number.
 * @param  {Number}  n A (potential) number to see if it is a number.
 * @return {Boolean}   True for non-infinite numbers, false for all else.
 */
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
},{}],17:[function(require,module,exports){
module.exports = loop

function loop(value, divisor) {
  var n = value % divisor;
  return n < 0 ? (divisor + n) : n
}

},{}]},{},[1]);
