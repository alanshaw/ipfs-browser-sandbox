const path = require('path')

module.exports = {
  mode: 'development',
  entry: './lib/renderer.js',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'renderer.bundle.js'
  }
}
