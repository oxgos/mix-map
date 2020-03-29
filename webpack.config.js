const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './lib/index.js',
  output: {
    filename: 'mixMap.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
    library: 'mixMap', // 库名称
    libraryTarget: 'umd', // 兼容浏览器,es6,node导入方式
    umdNamedDefine: true
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    new UglifyJsPlugin()
  ]
}
