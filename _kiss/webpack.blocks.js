const { addPlugins, createConfig, defineConstants, env, entryPoint, setOutput, sourceMaps } = require('@webpack-blocks/webpack2')
const babel = require('@webpack-blocks/babel6')
const devServer = require('@webpack-blocks/dev-server2')
const postcss = require('@webpack-blocks/postcss')
const sass = require('@webpack-blocks/sass')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const httpd = require('./httpd')

if (process.env['NODE_ENV'] === 'development') {
  httpd.run('8778', '../')
}

module.exports = createConfig([
  entryPoint('./src/blog.js'),
  setOutput('./build/[name].[hash:8].js'),
  babel(),
  sass(),
  addPlugins([new HtmlWebpackPlugin({
    inject: true,
    filename: '../../app.html',
    template: './src/template.html'
  })]),
  postcss([
    autoprefixer({ browsers: ['last 2 versions'] })
  ]),
  defineConstants({
    'process.env.NODE_ENV': process.env.NODE_ENV
  }),
  env('development', [
    devServer(),
    devServer.proxy({
      '/.site/': { target: 'http://localhost:8778/', host: 'localhost' }
    }),
    sourceMaps()
  ])
])
