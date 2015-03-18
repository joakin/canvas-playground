var sh = require('shelljs')
var path = require('path')
var browserify = require('browserify')
var fs = require('fs')

var buildFolder = 'build'
var indexHtml = sh.cat('demo.html')

sh.mkdir('-p', buildFolder)

var dirs = sh.ls('lib/demos/*')
dirs.forEach(function(dir) {
  if (sh.test('-d', dir)) {
    var buildPath = path.join(buildFolder, dir)
    console.log('Creating ', buildPath)
    sh.mkdir('-p', buildPath)
    indexHtml.to(path.join(buildPath, 'index.html'))
    var b = browserify()
    // Browserify needs a ./ in front of path
    b.add('./'+path.join(dir, 'index.js'))
    b.bundle().pipe(
      fs.createWriteStream(path.resolve(path.join(buildPath, 'index.js')))
    )
  }
})
