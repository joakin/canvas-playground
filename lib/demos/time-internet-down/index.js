require('canvas-testbed')(render, {
  once: true,
  onResize: resize
})

var rgb = require('color-style')

var pingData = [
  { "type": "Working", "value": 10.95 },
  { "type": "Broken",  "value": 2.92  },
  { "type": "Working", "value": 12.03 },
  { "type": "Broken",  "value": 0.38  },
  { "type": "Working", "value": 14.62 },
  { "type": "Broken",  "value": 0.57  },
  { "type": "Working", "value": 14.4  },
  { "type": "Broken",  "value": 3.08  },
  { "type": "Working", "value": 11.87 },
  { "type": "Broken",  "value": 1.13  },
  { "type": "Working", "value": 28.83 },
  { "type": "Broken",  "value": 1.23  },
  { "type": "Working", "value": 13.75 },
  { "type": "Broken",  "value": 1.3   },
  { "type": "Working", "value": 13.65 },
  { "type": "Broken",  "value": 1.63  },
  { "type": "Working", "value": 13.35 },
  { "type": "Broken",  "value": 4.17  }
]
var total = pingData.reduce(function (a, p) { return a + p.value }, 0)

var widthPad = 0.1
var ct = null

function resize (w, h) {
  if (ct) render(ct, w, h)
}

function render (ctx, width, height) {
  ct = ctx
  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = rgb(0, 0, 0)
  ctx.textAlign = 'center'
  ctx.font = 'bold 24pt sans-serif'
  ctx.fillText('internet session breakouts', width / 2, height * 0.2)
  var points = pingData.map(function (p) {
    p.width = p.value * ((1 - widthPad * 2) * width) / total
    return p
  })
  drawPointsAsLines(30, [widthPad * width, height / 2], points, ctx)
}

function drawPointsAsLines (lineWidth, initial, points, ctx) {
  var prev = initial
  ctx.lineWidth = lineWidth
  ctx.lineCap = 'butt'
  ctx.font = 'bold 12pt sans-serif'
  ctx.textAlign = 'center'
  points.forEach(function (point) {
    ctx.beginPath()
    ctx.moveTo(prev[0], prev[1] + (point.type === 'Working' ? 0 : 10))
    ctx.lineTo(prev[0] + point.width, prev[1] + (point.type === 'Working' ? 0 : 10))
    ctx.fillStyle = point.type === 'Working' ? rgb(0, 255, 0) : rgb(255, 0, 0)
    ctx.strokeStyle = point.type === 'Working' ? rgb(0, 255, 0) : rgb(255, 0, 0)
    ctx.stroke()
    ctx.fillText(point.value, prev[0] + (point.width / 2), prev[1] + lineWidth + 10 + (point.type === 'Working' ? 0 : 10))
    prev = [prev[0] + point.width, prev[1]]
  })
}

