const webpack = require('webpack')
const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const dotenv = require('dotenv')

const envVars = dotenv.config({
  path: path.resolve(__dirname, '.env'),
})

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'src', '_routes', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'dist.bundle-[hash].js',
    pathinfo: true,
    publicPath: '/',
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [require('tailwindcss')],
              },
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  resolve: {
    modules: [path.resolve('src'), path.resolve('node_modules')],
  },
  plugins: [
    new htmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', '_static', 'index.html'),
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(envVars.parsed),
    }),
  ],
  devServer: {
    compress: false,
    historyApiFallback: true,
    host: 'localhost',
    open: false,
    stats: 'errors-only',
    port: 8000,
    disableHostCheck: true,
  },
}
