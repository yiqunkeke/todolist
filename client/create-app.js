import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

import App from './app.vue'
import createStore from './store/store'
import createRouter from './config/router'

import './assets/styles/global.styl'

Vue.use(VueRouter)
Vue.use(Vuex)

// 每一次渲染都要去创建这些新的东西，这是必须要做的
// 不然的话，可能导致应用在node端出现内存溢出的情况
// 所以我们这里export 一个 function
export default () => {
  const router = createRouter()
  const store = createStore()

  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })

  return { app, router, store }
}
// 这些都创建好之后，我们开始打开server-entry，开始进入正题
