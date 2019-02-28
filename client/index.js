import Vue from 'vue'
import Router from 'vue-router'
import Vuex from 'vuex'
import App from './app.vue'

import './assets/styles/global.styl'
import createRouter from './config/router'
import createStore from './store/store'

Vue.use(Router)
Vue.use(Vuex)

const router = createRouter()
const store = createStore()

// 异步加载store模块
store.registerModule('c', {
  state: {
    text: 3
  }
})

const root = document.createElement('div')
document.body.appendChild(root)

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // to: -Route  即将要进入的目标
  // from: -Route 当前导航正要离开的路由
  // next: -Function   一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数
  console.log('global beforeEach')
  // if (to.fullPath === '/app'){
  //   next('/login')
  // } else {
  //   next()
  // }
  // 确保要调用 next 方法，否则钩子就不会被 resolved。
  next()
})
// 全局解析守卫
router.beforeResolve((to, from, next) => {
  console.log('global beforeResolve')
  next()
})
// 全局后置钩子
router.afterEach((to, from) => {
  // 不会接受 next 函数也不会改变导航本身
  console.log('global afterEach')
})

// new 一个 Vue 对象
new Vue({
  router,
  store,
  render: h => h(App) // 通过render，声明需要展示的内容为App
}).$mount(root) // 把App挂载到html里面
