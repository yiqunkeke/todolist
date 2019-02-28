const Router = require('koa-router')
const axios = require('axios')
const path = require('path')
const fs = require('fs')
const MemoryFS = require('memory-fs')
const webpack = require('webpack')
const VueServerRenderer = require('vue-server-renderer')

// 大家可能会好奇，为什么我们在写nodejs的时候使用的是require而不是 import
// 因为在目前的node版本中，还不支持直接写 import
// 然后我们在写前端代码的时候，为什么可以使用 import?
// 因为我们的代码是经过 babel去编译的，那么babel它支持的语法是非常的高的，它编译出来的代码是可以在浏览器中正常执行的
// 但是服务端代码不希望经过babel处理，所以我们就直接写可以运行的代码就可以了，即直接使用 require

const serverRender = require('./server-render')
const serverConfig = require('../../build/webpack.config.server')
// 我们首先要做的第一步，是要在node环境里面去编译 webpack, 就是要把webpack给跑起来

// 我们通过 webpack直接调用，然后传入一个 webpack的配置，我们就可以拿到一个 server compiler
// 这个 compiler,我们在 nodejs 中，可以直接去 run 或者是 watch，然后它就可以帮我们生成一个我们在服务端渲染时的一个bundle
const serverCompiler = webpack(serverConfig)

// 然后我们要指定 serverCompiler 的 outputFileSystem 是 我们的MemoryFS
// memory-fs 是干嘛用的？
// memory-fs是 nodejs里面的 fs的 api 一模一样的，而且它会扩展一些 api
// 它跟 fs 的唯一区别是它不把我们的文件写入磁盘上面。而是直接写入内存里面。
// 因为我们知道，写入磁盘是一个非常浪费时间的事情，效率非常的低
// 那么我们webpack去编译文件，去读取文件，还有在输出文件，它如果都是从磁盘上去操作，那么它整个的效率会非常低
// 因为 webpack 依赖的文件非常多，所以我们把所有的文件输出都放在 memory-fs里面，
// 这样的话，我们读取文件和输出文件就变的非常的快。

// 声明一个 mfs 对象
const mfs = new MemoryFS()
// 指定 serverComipler 的 outputFileSystem 为 mfs
serverCompiler.outputFileSystem = mfs

// 声明一个 bundle ，用来记录我们webpack每次打包生成的新的文件
let bundle

// watch的好处：类似于webpack-dev-server一样，每次修改了一个文件，它都会重新执行一次打包，然后拿到新的文件 bundle
serverCompiler.watch({}, (err, stats) => {
  // 第一个参数是一个空对象
  // 第二个参数是一个回调，有两个参数，err, stats

  // 如果遇到了错误，直接抛出，eslint 的错误是不会在 err里面出现的
  if (err) throw err
  // eslint 错误要在 stats里面去发现
  stats = stats.toJson()
  stats.errors.forEach(err => console.log(err))
  stats.warnings.forEach(warn => console.warn(err))

  // 读取生成的bundle文件路径
  const bundlePath = path.join(
    serverConfig.output.path,
    // 这里vue-ssr-server-bundle.json是使用 VueServerPlugin插件时输出的文件名，可以使用默认的，也可以在使用VueServerPlugin插件时自定义
    'vue-ssr-server-bundle.json'
  )
  // 我们这里不是使用output时的filename,因为我们使用了 VueServerPlugin 这个插件，
  // 这个插件可以帮我们做很多服务端渲染相关的事情

  // 根据bundlePath，使用mfs.readFileSync获取 bundle文件
  bundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'))
  console.log(`new bundle generated`)
})

// 接下来，写一个方法，也是koa的一个中间键
// 它用来帮我们处理整个服务端渲染要返回的东西
// 我们只需要在context.body上面指定我们要返回的html内容，我们就可以真正的返回这部分内容
const handleSSR = async (ctx) => {
  // 首先要判断 bundle是否存在
  // 如果  bundle 不存在，直接去调用 vue-server-renderer 会报错
  // 什么时候会不存在？
  // 服务刚启的时候，webpack第一次打包，这个速度是比较慢的，可能服务刚启动的时候，它还没有打包好，这时候如果在浏览器中去访问的话，肯定就报错了
  // 所以在进行服务端渲染的时候，我们都会先判断下 bundle是否存在
  if (!bundle) {
    // 如果不存在
    ctx.body = '你等一会，别着急......'
    return
  }

  const clientManifestResp = await axios.get(
    // vue-ssr-client-manifest.json跟上面的 vue-ssr-server-bundle.json类似，是插件自动生成的文件
    // 同时，我们要去client的配置中把这个插件加进去 ---"VueClientPlugin"
    'http://127.0.0.1:8000/public/vue-ssr-client-manifest.json'
  )
  const clientManifest = clientManifestResp.data

  // 如果有了bundle之后，我们就进行服务端渲染的过程
  // 然后我们做服务端渲染，我们通过vue-server-render,它输出的内容只是<body>标签里面的html代码，
  // 那我们一个完整的html肯定要包含head,script,title,description,link,style之类的，但它都是没有的
  // 所以我们要先去写一个模板，帮助我们直接生成一个完整的html
  // 这个模板我们直接写在 server目录下 -> server.template.ejs
  // 我们直接使用ejs 模板引擎渲染我们的html

  // 1.声明好这个模板之后，我们要通过fs，就是我们的文件，去把模板的内容读进来
  // 因为我们这里需要使用 ejs ，所以我们还需要 npm i ejs -S
  // 同时，在最上面，引入fs:  const fs = require('fs')
  const template = fs.readFileSync(
    path.join(__dirname, '../server.template.ejs'),
    'utf-8'
  )

  // 2. 我们拿到template之后，第二步声明一个 renderer
  // 这个render 是通过 VueServerRenderer的createBundleRenderer去创建一个serverBundle
  // 我们传入我们的 bundle,它就会帮我们生成一个我们可以直接去调用的 renderer()的一个function
  const renderer = VueServerRenderer.createBundleRenderer(bundle, {
    // 因为 VueServerRenderer，它有一个办法，
    // 就是我们指定一个template,但是这个template 一定要按照 VueServerRenderer 官方提供的模板的形式去指定
    // 它会自动帮我们把一些我们需要的内容插入进去
    // 但是它这个限制会比较大，导致我们有一些功能没办法做，这些东西我们就不让它去注入，只需要把我们的 appString 给渲染出来，然后我们自己去处理剩下的部分内容，就ok了。
    // 所以我们要指定 inject: false, 它就不会帮我们执行一个注入的操作。
    inject: false,
    // 传入 clientManifest,它就会自动帮我们生成一个带有<script>标签的js文件引用的字符串
    // 我们可以直接把它填到ejs的内容里面
    clientManifest
  })

  //  3.最后我们这边还要做一个操作，去获取客户端的，即webpack-dev-server帮我们打包出来的javascript 文件的地址
  //  因为我们要拿到这个地址之后，才能去在我们拼接html的时候，把这个客户端的路径写在里面，这样的话我们把html 返回给浏览器之后，浏览器渲染出来才可以引用到这个客户端的js
  // 这样的话，它才能把整个应用在客户端也就是我们的浏览器里面正式的跑起来。
  // 不然的话，它只是一个空的html，我们虽然能看到内容，但它没有一个实际的效果

  // 那么这部分的东西怎么去拿到呢？
  // 我们这边它是一个单独的server,然后webpack-dev-server又是另一个单独的server
  // 我们好像没有办法通过两个进程去获取另外一个servre的东西。
  // 办法 ：通过 axios 向 webpack-dev-server 发送一个请求，把文件给拿过来就ok了。

  // 4.拿到 server-render.js，传入 ctx, renderer,template
  await serverRender(ctx, renderer, template)
}

// 最后要使用router 把handleSSR export 出去
const router = new Router()
// 我们把所有的请求，都使用 handleSSR 处理
router.get('*', handleSSR)
// 最后，
module.exports = router

// 现在我们只是走到了创建 render 这一步，那么下一节会讲如何把我们的bundle去渲染出实际的html内容，并填到template里面。
// 至此我们已经把一些基础的要创建的东西都弄好了，弄好了之后，我们接下去就是要做真正的服务端渲染的操作
// 那么服务端渲染的操作，我们给它放到另外一个单独的js里---server.render.js(因为这个逻辑在开发环境和正式环境里面，逻辑是一样的)
