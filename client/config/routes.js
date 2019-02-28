// import Todo from '../views/todo/todo.vue'
// import Login from '../views/login/login.vue'

export default [
  {
    path: '/',
    redirect: '/app'
  },
  {
    // params传参 id
    // path: '/app/:id',
    path: '/app',
    // 把参数作为 props传给组件
    props: true,
    // props: {
    //   id: '456'
    // },
    // 异步路由
    // 通过 import引入，而非在一开始就全部引入
    // 需要 npm i babel-plugin-syntax-dynamic-import
    // 通过异步路由，首屏加载时，速度更快
    component: () => import('../views/todo/todo.vue'),
    // 命名路由,跟 path没有任何关系
    // 可以用 :to="{name:'app'}" 进行跳转
    name: 'app',
    // 保存路由信息，放在 this.$route 对象中
    meta: {
      title: 'this is app',
      description: 'this is app description'
    },
    // 路由独享的守卫
    beforeEnter (to, from, next) {
      console.log('router beforeEnter')
      next()
    }
    // 嵌套路由
    // children: [
    //   {
    //     path: 'test',
    //     component: Login
    //   }
    // ]
  },
  {
    path: '/login',
    component: () => import('../views/login/login.vue')
  }
]
