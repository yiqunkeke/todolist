const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const baseConfig = require('./webpack.config.base')
const merge = require('webpack-merge')
// 最后，我们要添加一个插件，这个插件是我们做vue的服务端渲染最重要的插件。
// 这个插件能帮我们生成一个单独的 json 文件
// 用于在服务端渲染里面，帮我们处理一些复杂的逻辑
// 所以 vue 的服务端渲染有这个插件的存在，让我们比去做 react 的服务端渲染要简单很多。
// 这个插件很好用，我们肯定要使用。
//  npm i vue-server-renderer
const VueServerPlugin = require('vue-server-renderer/server-plugin')

let config

config = merge(baseConfig, {
  // 因为打包出来的程序是运行在 node 端的，不是在浏览器端的，
  // 所以这里必须指定打包的目标 target 为 node 环境
  target: 'node',
  entry: path.join(__dirname, '../client/server-entry.js'),
  // 使用 source-map,给我们提供代码调试的功能
  devtool: 'source-map',
  output: {
    // 用来指定写的代码export出去，入口是怎么样的
    // 入口有很多形式：
    // 一般来说在 nodejs里面，使用的模块是 module.exports = XXX
    // 这就是我们使用 commonjs2 打包出来的整个应用的一个入口，就是通过 module.exports = ,给它放出去，给它引用出去。
    // 然后我们就可以在 nodejs 中直接引用打包出来的js
    // 因为 nodejs的模块系统就是 module.exports 以及 require。
    // 但是浏览器端输出的如果是 commonjs2类型的话，肯定是不行的。因为浏览器中是没有module模块的。它也不支持这种运行方式。
    libraryTarget: 'commonjs2',
    // filename 不需要指定哈希之类的，因为我们在node端是通过模块去加载这些文件的，
    // 不需要使用浏览器的缓存之类的功能。所以直接指定为 server-entry.js 就可以了。
    filename: 'server-entry.js',
    // 输出到一个新的目录 server-build
    path: path.join(__dirname, '../server-build')
  },
  // 我们知道webpack打包时，会把所有依赖的js文件都打包到同一个javascript文件里面
  // 这是在浏览器中执行的情况。
  // 因为浏览器没办法通过 require 这种方式去加载一个单独的文件。所以我们要把所有用到的js文件里面的内容都打包到一个新的javascript文件里面
  // 然后一次性加载到浏览器端，它需要的东西，都有了。

  // 但是 我们这个是要跑在 node 端的。
  // 然后 node端，如果我们依赖了 vue,我们只需要在导出的文件里面去require vue就可以了。
  // 我们 require vue之后，它是可以直接引用到我们 node modules 里面的文件的。
  // 所以我们没必要把vue里面的代码全部打包到我们输出的 server-entry.js里面去。
  // 这会导致我们打包出来的js里面有一份单独的vue代码。
  // 跟我们在 node modules里面的vue代码是两个独立的环境
  // 这会导致我们在 nodejs打包的时候出现一些问题，最容易想到的问题就是我们整个内存使用的浪费
  // 因为有两份的 vue 代码。
  // 同样的，有其它的依赖，都会有多份。
  // 这些依赖我们都是装在 node modules里面的，我们不需要它去打包出来，所以我们要声明 externals,让它不要去打包这部分的文件。
  // 这就是 externals的用处。
  externals: Object.keys(require('../package.json').dependencies),
  // 另外，我们使用 npm i xxx -S ，就是装在 dependencies 里面的。
  // 如果 -D 则装在 devDependencies。
  // devDependencies里面就是一些工具性的东西，在我们应用真正跑起来的时候，它是不需要的。它只有在我们进行打包或者工具化的操作时才需要。
  // 而 dependencies 是我们在应用跑起来时，需要的一起代码。
  module: {
    rules: [
      {
        // 我们的 stylus 文件，要单独提取到一个文件中去。
        // 不能使用 vue-style-loader。因为它里面会有dom操作
        // 如果我们把它打包进去，那么在 node 端执行的时候会报错
        // 因为 node 端，是没有 dom的执行环境的。
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
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.[contentHash:8].css'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      // 这是 vue 服务端渲染的官方建议我们去做的
      // 可能在 vue-server-render里面会用到这个属性
      'process.env.VUE_ENV': '"server"'
    }),
    // 使用了 vue-server-renderer 插件之后，
    // 我们这个整体的打包是不会有javascript文件的输出的。
    // 它输出的是一个json文件。那么这个json文件，我们可以直接通过vue-server-renderer这个包帮我们去做很多服务端渲染相关的内容。
    // 当然它不可能帮我们把所有的事情都做了，我们还是要做很多其它的事情，但是它会帮我们把一些复杂的逻辑都给它包含在里面。
    // 这个可以减轻我们开发的逻辑。
    // 默认输出的文件名为 vue-ssr-server-bundle.json，dev-ssr.js文件中会用到这个文件名
    new VueServerPlugin()
  ]
})

module.exports = config

// 有了这个配置文件以后，我们接下来再要去写的是我们的 node server
// 那么这个 node server 我们会使用现在比较流行的 koa---nodejs的服务端框架，帮我们去处理服务端的代码。
// npm i koa -S

// 新建 server目录  -> server.js 文件
