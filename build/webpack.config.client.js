const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HTMLPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueClientPlugin = require('vue-server-renderer/client-plugin')

const baseConfig = require('./webpack.config.base')
const merge = require('webpack-merge')

const isDev = process.env.NODE_ENV === 'development'

const defaultPlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: isDev ? '"development"' : '"production"'
    }
  }),
  // 请确保引入这个插件来施展魔法
  // 这个插件是必须的！它的职责是：将你定义过的其它规则复制并应用到.vue文件里相应语言的块
  new VueLoaderPlugin(),
  new HTMLPlugin({
    template: path.join(__dirname, 'template.html')
  }),
  // dev-ssr.js 中会用到这个插件自动生成的文件名-- vue-ssr-client-manifest.json
  new VueClientPlugin()
]

const devServer = {
  port: 8000,
  host: '0.0.0.0',
  // 当出现编译器错误或警告时，在浏览器中显示全屏覆盖层。默认禁用。
  overlay: {
    errors: true
  },
  // vue-router中配置 mode:'history'，此处需要配合设置historyApiFallback
  historyApiFallback: {
    index: '/public/index.html'
  },
  // 注意，必须有 webpack.HotModuleReplacementPlugin 才能完全启用 HMR
  // 如果 webpack 或 webpack-dev-server 是通过 --hot 选项启动的，那么这个插件会被自动添加，所以你可能不需要把它添加到 webpack.config.js 中
  hot: true
}

let config

if (isDev) {
  config = merge(baseConfig, {
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
    plugins: defaultPlugins.concat([
      new webpack.HotModuleReplacementPlugin()
    ])
  })
} else {
  config = merge(baseConfig, {
    entry: {
      app: path.join(__dirname, '../client/index.js')
    },
    output: {
      filename: '[name].[chunkhash:8].js'
    },
    module: {
      rules: [
        {
          test: /\.styl/,
          use: [
            MiniCssExtractPlugin.loader,
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
    plugins: defaultPlugins.concat([
      new MiniCssExtractPlugin({
        filename: 'styles.[contentHash:8].css'
      })
    ]),
    // 第三方类库单独打包 vendors~app.xxxxxxxx.js
    optimization: {
      splitChunks: {
        chunks: 'all'
      },
      // 运行代码单独打包 runtime~app.xxxxxxxx.js
      runtimeChunk: true
    }
  })
}

module.exports = config
