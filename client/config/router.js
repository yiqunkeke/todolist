import Router from 'vue-router'

import routes from './routes'

export default () => {
  return new Router({
    routes,
    // 依赖 HTML5 History API 和webpack-dev-server服务器配置
    mode: 'history',
    base: '/base/',
    // 配置全局链接被激活时的样式
    linkActiveClass: 'active-link', // 路径部分匹配
    linkExactActiveClass: 'extract-active-link', // 路径全部匹配
    // 自定义路由切换时页面如何滚动
    scrollBehavior (to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      } else {
        return { x: 0, y: 0 }
      }
    },
    // url?a=xxx&b=yyy
    // parseQuery (query) {
    //
    // },
    // stringifyQuery (obj) {
    //
    // },
    // 当浏览器不支持 history.pushState 控制路由是否应该回退到 hash 模式。默认值为 true
    fallback: true
  })
}

// 不推荐使用直接 export 一个 router
// 因为如果外部import时，用的都会是这一个同样的router
// 所以我们用上面的 export 一个 function
// 因为我们的项目，用到了服务器端渲染，如果只用到了同一个router,会导致内存溢出
// const router = new Router({
//    routes
// })
// export default router
