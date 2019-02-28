const ejs = require('ejs') // 因为我们要用ejs 去渲染我们的 template

module.exports = async (ctx, renderer, template) => {
  // 这个function也是async的，因为它是一个异步的方法
  // 参数ctx 是肯定要的，因为我们要把返回的html内容写到ctx.body里面
  // renderer,因为在开发时和正式环境它创建的流程不一样，所以我们要在外部进行传入
  // template 也是一样的，我们就从外部传入就可以了

  // 我们拿到 ctx 之后 ，首先要 给headers里面的'Content-Type'指定为 html，因为我们要返回的是html
  ctx.headers['Content-Type'] = 'text/html'

  // 然后,声明context对象，用在我们服务端渲染时，把它传入进去的，传入到我们的vue-server-renderer里面去的
  // vue-server-renderer里面拿到这个context之后，它渲染完成之后，会在上面插入一堆的属性让我们可以方便的拿来去渲染我们的html
  // 它里面会包括javascript的路径，css的路径，
  // 如果使用了vue-style-loader并且没有把vue文件里面的css进行单独提取的话，它会在里面生成一个<style>标签，
  // 里面会有我们当前路由下需要用到的样式的内容,我们可以直接把它渲染到html上面。
  // 然后还包括 html的title,description之类的，我们都可以通过context给它拿出来
  // 所以这个context 对象是非常重要的。
  const context = { url: ctx.path }

  try {
    // 1.把 context 传入 renderer,生成 appString
    // renderer.renderToString()方法直接返回一个Promise，所以我们可以直接使用 await来调用它
    const appString = await renderer.renderToString(context)

    // 2.渲染html内容---通过ejs.render()方法
    // render方法，第一个参数传入我们的 template
    // 第二个传入渲染这个template要用到的哪些变量
    const html = ejs.render(template, {
      appString,
      // 可以直接拿到带有<style>标签的整个字符串，直接把它扔到html里面去就可以了
      // 我们不需要自己写<style>标签，然后再去把它渲染出来
      style: context.renderStyles(),
      scripts: context.renderScripts()
      // 在这里我们先做这几个东西最基础要用到的东西，这里还可以做其它的内容，到我们真正要用的时候，我们再来讲
    })

    // 3.下一步，我们把ctx.body设置成html
    // 这样的话，我们就返回给我们的客户端想要的html内容了
    ctx.body = html
  } catch (err) {
    console.log(`render error`, err)
    throw err
  }

  // 到这一步，我们的服务端渲染，在nodejs里面的基础的流程我们就已经做完了。
  //  这是只是我们一些最基本的东西
  //  最后，还差一步，我们要去server.template.ejs里面把内容补齐
  //  我们这里传入了三个参数，是 appString, style, scripts

  // 补齐之后，我们要去写我们的 server-entry.js
  //  在写 server-entry.js之前，我们先去创建create-app.js，这个文件的作用：
  //  我们每一次的服务端渲染都需要渲染新的app,不能用上一次渲染过的app对象再去进行下一次渲染
  // 因为这个app对象已经包含了上一次渲染的一些状态，会影响我们下一次渲染的内容
//  所以我们每一次都要去给它创建一个新的app
//  我们的create-app会跟我们的index.js比较像
}
