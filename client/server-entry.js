import createApp from './create-app'

export default context => {
  // 这里接收的context等于在server-render.js中，
  // 使用renderer.renderToString(context)传入的那个context
  //  所以我们可以给context 赋很多值
  //  然后在使用vue整个应用渲染的时候，vue也会给它赋很多值

  //  这个方法，我们必须要给它 return 一个 new Promise
  //  因为我们要做一些异步操作，我们要让vue-server-render知道我们什么时候这个异步的操作结束了

  return new Promise((resolve, reject) => {
    // 创建app的操作要写在 return 里面
    const { app, router } = createApp()

    // 1.给路由推一条记录。
    router.push(context.url)
    // 浏览器会有默认的路由。但是在服务端，上面const {app, router}只是一个对象
    // 它们根本没有走真正的渲染这一步
    // 所以我们只有主动的去调用 router.push,它才会去执行这一部分的代码
    // 然后给我们匹配到我们要去调用的这些组件

    // 2.router.onReady()基本上只有在服务端渲染的时候才会被用到
    // 它其实是，在一个路由记录被推进去之后，它所有的一些异步操作，比如说我们在路由里面有异步加载组件的操作，它所有的异步操作都做完之后才会去调用onReady这个回调
    // 我们可以在这里做一些数据获取的操作
    router.onReady(() => {
      // router.getMatchedComponents 也只有在服务端渲染时才用到
      const matchedComponents = router.getMatchedComponents()
      if (!matchedComponents.length) {
        return reject(new Error('no component matched'))
      }
      resolve(app)
    })
  })
}
