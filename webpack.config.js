/*
* webpack 是帮我们打包前端资源的
* 前端资源有很多不同的类型，如 javascript, css, 图片，字体等。
* 这些资源都需要通过 http 请求加载。
* 在开发 web、app过程中，我们是通过 js 加载到浏览器之后，然后把所有的内容渲染出来。所以很多时候，我们都可以以 js 文件作为我们的入口（entry）。
*
*
* webpack作用，就是我们输入 index.js 这个js文件，
 最终 webpack 会把我们输入的这个文件以及它里面所依赖的比如 Vue、App、css、图片，以及css里面的图片，都给打包成一个完整的 bundle.js,并且打包出来的是我们能够在浏览器里直接运行的js代码
*
* */
const path = require('path') // path 是 nodeJs 里面的一个基本包，它是用来处理路径的
const webpack = require('webpack') // 引入内部插件
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HTMLPlugin = require('html-webpack-plugin')
const ExtractPlugin = require('extract-text-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
/* 我们在启动脚本的时候设置的环境变量全部存在 process.env这个对象中的
 （所以我们可以在启动脚本时设置很多的变量名。在这边都可以使用 process.env读到） */

const config = {
  target: 'web', // 因为项目是运行在浏览器中的，所以webpack的编译目标是 web平台
  mode: process.env.NODE_ENV || 'production',
  entry: path.join(__dirname, 'client/index.js'),
  /* entry肯定不是app.vue。因为它是.vue文件
    __dirname 代表当前文件webpack.config.js所在的目录地址(即根目录)
    path.join()：把当前文件的路径和后面的路径拼接起来，形成一个绝对路径，以保证我们绝对可以访问到我们想要访问的文件 */
  output: {
    // 有了入口，要有出口， 我们要把文件输出
    filename: 'bundle.[hash:8].js', // 输出的文件名
    path: path.join(__dirname, 'dist') // 输出路径
  },
  plugins: [
    /* 1.想要使用一个插件，你只需要 require() 它，然后把它添加到 plugins 数组中
                插件目的在于解决 loader 无法实现的其他事。  插件是 webpack 的支柱功能。
        2.我们使用 vue,react这些框架的时候，我们一定要使用 webpack的一个plugin叫 webpack.DefinePlugin({  })
        我们要给DefinePlugin定义一个变量，这个变量跟我们在上面使用的变量名是一样的，叫 process.env */
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
      /* 这个东西的作用：给webpack在编译的过程中以及在我们自己写js代码时去判断这个环境，我们都可以去调用这个变量 process.env。就是说，我们在这里去定义了，我们在我们写的js代码中是是可以引用到的
            其次：现在的vue，react等是可以根据不同的环境区分打包：vue的dist目录下面有非常多的不同版本的vue的源代码。在开发环境中它是一个比较大的版本，里面包含了很多错误信息和提示功能，这些功能在正式环境中没必要去用，一方面它会加大文件的大小，另外一方面它会让整个代码的运行效率降低很多。
            所以我们在开发环境使用这个 development 有很多好处：比如一些vue提醒 */
    }),
    new VueLoaderPlugin(),
    new HTMLPlugin() // 这是一个最基础的配置，它里面有很多参数，具体可以看它的文档学习它如何去用
  ],
  /* webpack 原生只支持 js 文件类型的，并且只支持 ES5 语法所以我们需要使用 loader，让它支持 .vue文件, .css文件，图片等等这些非 js 文件
    （官方说明 ：
    loader 让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解 JavaScript）
    loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块
    重要的是要记得，在 webpack 配置中定义 loader 时，要定义在 module.rules 中，而不是 rules。否则，在定义错误时 webpack 会给出严重的警告。为了使你受益于此，如果没有按照正确方式去做，webpack 会“给出严重的警告”） */
  module: {
    rules: [
      // .vue文件
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      // jsx 文件
      {
        test: /\.jsx$/,
        loader: 'babel-loader'
      },
      /* 在前端运行时，css是需要作为一个外部文件去处理
            或者我们把css样式写在html内容里面，作为style标签，然后把里面的样式全部列出来
            所以我们有不同的处理方式，我们应该怎么声明它呢？这里换一种模式 use: */
      {
        test: /\.css$/,
        use: [
          'style-loader', // style-loader则是将css文件内容放在style标签内并插入head中
          'css-loader' // css-loader 的作用是处理css文件中 @import，url之类的语句
        ]
      },
      // CSS 预处理
      // {
      //     test: /\.styl$/,
      //     use: [
      //         'style-loader',
      //         'css-loader',
      //         {
      //             loader: 'postcss-loader',
      //             options: {
      //                 sourceMap: true,
      //             }
      //         },
      //         'stylus-loader'  // stylus-loader 是专门用来处理stylus 文件的，它处理完成之后是 css内容（所以css内容怎么处理？需要扔给上一级即 css-loader）
      //         // webpack的loader 就是这么一层一层往上扔的。
      //         // 往上扔的过程当中，其实就是代表每一个loader只处理它关心的那一部分
      //         // 这种方式的好处：无数的loader进行搭配，最终达到想要的结果
      //     ]
      // },
      // 这样的话，我们写好的 css 最终会在bundle.js中以一段js代码出现，把我们写好的样式写进html
      {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use: [
          {
            loader: 'url-loader',
            /* url-loader 作用：可以把我们的图片转换为 base64代码，直接写在js内容里面，而不用生成一个新的文件( url-loader 对于我们这种几kb的小图片作用挺大的，因为可以减少 http请求)
                        url-loader 其实是封装了 file-loader
                         --- 每一个loader 都可以进行选项配置
                        */
            options: {
              limit: 1024, // 如果图片小于1024，则把图片转为base64写到代码里面去
              name: '[name]-aaa.[ext]' // 指定输出的文件的名字
            }
          }
        ]
      }
      /* 上面这些loader配置完之后，需要我们npm i 安装才行：
             npm i style-loader url-loader file-loader
            url-loader 是依赖于 file-loader的，所以安装 url-loader的同时，需要也安装 file-loader
            重点：装完以后，我们就可以在js代码里面直接 import 这些非 js的内容（样式、图片、CSS预处理等）。 */
    ]
  }
}
// 这个配置文件要同时运行在“正式环境”（production）和“开发环境”(development)中的
// 所以这里的配置要根据不同的环境做一些判断
// 我们根据在运行package.json里的 script中的命令（build 和 dev）时，设置一个环境变量，来标识是开发环境还是正式环境
// 要设置这个变量，我们需要安装一个包：叫 cross-evn
// 这个包的作用：因为在不同的平台上，我们设置环境变量的方式是不一样的（在mac上我们设置 NODE_ENV = production 就能读取这个环境变量，在windows上要使用 set NODE_ENV = production ）,我们不想让不同的平台使用不同的命令，所以我们这里使用 cross-env
// 我们使用 cross-env NODE_ENV = production
if (isDev) {
  config.module.rules.push(
    {
      test: /\.styl$/,
      use: [
        'style-loader',
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
  )
  /* config.devtool = '#cheap-module-eval-source-map' // 最后再加一个新的配置devTool:
    帮助我们在页面上调试代码的。因为我们使用的是 .vue 文件的开发模式，而且我们写的都是ES6的代码 ，这些代码在浏览器中是不能直接运行的，所以我们如果直接去调试这个代码，这个代码是经过编译的，我们自己都看不懂。那么我们使用的方法是使用 source-map ,对写的代码进行映射，那么我们可以很快定位到我们自己写的代码，快速调试。
    devtool 这个功能 webpack4 已经帮我们提供了

    在 config 上加一个叫 devServer的配置。
    (devServer 这个配置是在 webpack2以后才加入的) */
  config.devServer = {
    port: 8000, // devServer是一个服务，需要监听一个端口
    host: '0.0.0.0', // 通过127.0.0.1:8000访问 或者使用 localhost:8000
    overlay: { // 在 webpack进行编译的过程中，如果有任何错误，我们都让它显示在网页上
      errors: true
    },
    hot: true // 修改了组件代码，只需要重新渲染组件，不需要刷新整个页面
    /* historyFallback:{

        }
        open: true // 启动时打开页面 */
  }
  // 启动 hot 功能需要用这个插件
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin()
    // new webpack.NoEmitOnErrorsPlugin()   // webpack4已经废弃了这个插件
  )

  /* 以上这些是基础的配置，我们来看一下，我们现在编译的东西，只有bundle.js 和图片这些，没有一个html 去容纳我们的文件，这个项目是跑不起来的，因为作为我们的前端项目，我们肯定需要一个html作为我们的入口
    那我们怎么做来让我们的 html来自动包含我们的 js 和 图片文件呢？在 webpack里有一个非常好用的插件： npm i html-webpack-plugin 安装完以后需要引入一下 */
} else {
  config.entry = {
    app: path.join(__dirname, 'client/index.js'),
    vendor: ['vue']
  }
  config.output.filename = '[name].[chunkhash:8].js'
  config.module.rules.push(
    {
      test: /\.styl$/,
      use: ExtractPlugin.extract({
        fallback: 'style-loader', // 既然使用了extract-text-webpack-plugin，按理说就没必要配置style-loader了
        use: [
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          'stylus-loader'
        ]
      })
    }
  )
  config.plugins.push(
    new ExtractPlugin('styles.[chunkhash:8].css')
  )
  config.optimization = {
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: true // webpack 的代码，打包成 runtime.xxx.js
  }
}

module.exports = config

/*  配置 webpack-dev-server:

* 这是一个非常方便和高效的开发模式，提高开发效率
*
* webpack-dev-server是什么东西呢？
*   它是一个 webpack的包，我们通过 npm i webpack-dev-server 进行安装
*
*   使用方法非常简单：
*
*   在 package.json 中，
*   "scripts": {
         "test": "echo \"Error: no test specified\" && exit 1",
         "build": "webpack --config webpack.config.js",   // 我们在 build命令时，用了 webpack 启用了 webpack.config.js这个文件
         "dev": "webpack-dev-server --config webpack.config.js"  // 那么我们在 dev时，用 webpack-dev-server 启用 webpack.config.js文件
       },

       我们用的是同一个 webpack.config.js配置文件，但是 webpack-dev-server 会给我们带来不一样的效果，它是专门用在开发环境的。
       同时我们也需要修改 webpack.config.js的一些配置，来专门适应 webpack-dev-server 的开发模式：
       target:'web'
* */
