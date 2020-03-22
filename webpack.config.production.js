const path = require('path')

module.exports = {
  mode: 'production',
  entry: './lib/renderer.js',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'renderer.bundle.js'
  }
}
