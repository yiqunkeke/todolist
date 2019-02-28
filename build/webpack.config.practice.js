const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HTMLPlugin = require('html-webpack-plugin')
const baseConfig = require('./webpack.config.base')
const merge = require('webpack-merge')

const defaultPlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"development"'
    }
  }),
  new VueLoaderPlugin(),
  new HTMLPlugin({
    template: path.join(__dirname, 'template.html')
  })
]

const devServer = {
  port: 8080,
  host: '0.0.0.0',
  overlay: {
    errors: true
  },
  hot: true
}

let config

config = merge(baseConfig, {
  entry: path.join(__dirname, '../practice/index.js'),
  module: {
    rules: [
      {
        test: /\.styl/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          'stylus-loader'
        ]
      }
    ]
  },
  devServer,
  // import Vue from 'vue'
  // 正式环境默认使用的是 vue.runtime.xxx.js
  // 开发环境默认使用 vue.runtime.esm.js
  // runtime和没有runtime区别：
  // 无 runtime,可以这么写 template:"<div>test</div>"，否则 报错
  // 所以要配置成无runtime的
  resolve: {
    alias: {
      'vue': path.join(__dirname, '../node_modules/vue/dist/vue.esm.js')
    }
  },
  plugins: defaultPlugins.concat([
    new webpack.HotModuleReplacementPlugin()
  ])
})

module.exports = config
