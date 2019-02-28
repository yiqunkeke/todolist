// 关于 koa的内容，在这门课中我们不会详细去讲
// 可以查询koa 文档，非常地简单
// 我们要做服务端渲染，必须要启一个 nodejs server，因为只有 nodejs的 server才可以做服务端渲染，其它任何语言都没有办法去做。
const Koa = require('koa')

const pageRouter = require('./routers/dev-ssr')

const app = new Koa()

// 为什么要去拿到这个变量呢？
// 因为我们服务端渲染是分开发环境和正式环境两个不同的情况，所以我们要根据这个来判断
const isDev = process.env.NODE_ENV === 'development'

// 然后，我们先写一个中间键来记录我们所有服务端的请求，
// 以及去抓取一些错误，方便我们排查错误
app.use(async (ctx, next) => {
  // next就是我们执行下一个中间键的使用

  // 因为 koa 使用的是 async 和 await 的写法
  // 所以我们所有的之后的中间键的调用都可以在最外层 try catch 到错误，
  // 所以我们可以把所有的错误情况都放在最外层去处理
  try {
    console.log(`request with path ${ctx.path}`)
    await next()
  } catch (e) {
    console.log(e)
    ctx.status = 500
    if (isDev) {
      ctx.body = e.message
    } else {
      ctx.body = 'please try again later'
    }
  }
})
// 这些是 koa 的既定用法，不需要去关心它里面到底是什么逻辑
// 只需要知道它是这么用就可以了
// 如果想深入了解，可以去看它的官方文档，课程中不再深入讲解
app.use(pageRouter.routes()).use(pageRouter.allowedMethods())
const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || 3333

app.listen(PORT, HOST, () => {
  console.log(`server is listening on ${HOST} : ${PORT}`)
})

// 接下来我们就要处理服务端渲染，服务端渲染肯定要放在另一个别的文件中去处理
// 因为首先它们要分不同的情况，可以通过引用两个不同的文件来进行一个区分
// 再者，它的逻辑内容比较多，所以我们要把它放在其他的地方去处理

// 然后，要处理服务端渲染，我们要装一个 koa 的中间键,帮我们处理koa路由
// 还需要用到 axios 和 memory-fs
// axios 用来在 node端发送请求，也可以在浏览器端用
// memory-fs 具体怎么用，在后面会讲
// npm i koa-router axios -S
// npm i memory-fs -D

// 在 server目录下，新建 routers目录，新建 dev-ssr.js 和 ssr.js
// dev-ssr.js 用来处理开发时的 服务端渲染的情况
// ssr.js 就是我们处理在正式环境中的情况
