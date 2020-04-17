const fs = require('fs')
const path = require('path')
const VuePlugin = require('vue-loader/lib/plugin')

module.exports = {
  mode: 'development',
  entry: (function () {
    return fs.readdirSync(__dirname).reduce((entries, dir) => {
      const fullDir = path.join(__dirname, dir)
      const entry = path.join(fullDir, 'index.js')
      if (fs.statSync(fullDir).isDirectory()) {
        entries[dir] = entry
      }
      return entries
    }, {})
  })(),
  output: {
    filename: 'bundle.js',
    publicPath: '__build__'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
  },
  watch: true,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: 'babel-loader'
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" }
        ]
      }
    ]
  },
  plugins: [
    new VuePlugin()
  ]
}
