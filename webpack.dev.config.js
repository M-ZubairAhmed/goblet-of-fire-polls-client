const webpack = require('webpack')
const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const dotenv = require('dotenv')

const environmentalVars = dotenv.config({
  path: path.resolve(__dirname, '.env.dev'),
})

module.exports = {
  mode: 'DEVELOPMENT',
  entry: path.resolve(__dirname, 'src', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'dist-[hash].js',
    publicPath: '/',
    pathinfo: true,
  },
  resolve: {
    modules: [path.resolve('src'), path.resolve('node_modules')],
  },
  devtool: 'inline-source-map',
  devServer: {
    compress: false,
    historyApiFallback: true,
    host: 'localhost',
    open: true,
    stats: 'errors-only',
    port: 8000,
    disableHostCheck: true,
  },
  plugins: [
    new htmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
      favicon: path.resolve(__dirname, 'src', 'favicon.ico'),
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(environmentalVars.parsed),
    }),
  ],
}
