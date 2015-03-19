exports.clear = function(alpha, context, width, height) {
  context.fillStyle = 'rgba(0,0,0,' + alpha || 0.5 + ')'
  context.fillRect(0, 0, width, height)
}

exports.drawFPS = function(fps, context) {
  context.font = 'bold 12pt Courier'
  context.textAlign = 'left'
  context.fillStyle = 'rgba(255,0,0,1)'
  context.fillText(fps + 'fps', 10, 20)
}

exports.drawBottomCenteredText = function(text, context, width, height) {
  context.font = 'bold 12pt sans-serif'
  context.textAlign = 'center'
  context.fillStyle = 'rgba(255,255,0,1)'
  context.fillText(text, width / 2, height - 20)
}

exports.fillCircle = function(context, x, y, r) {
  context.beginPath()
  context.arc(x, y, r, 0, 2 * Math.PI)
  context.fill()
}

exports.line = function(context, px, py, qx, qy, w) {
  context.lineWidth = w
  context.beginPath()
  context.moveTo(px, py)
  context.lineTo(qx, qy)
  context.stroke()
}
