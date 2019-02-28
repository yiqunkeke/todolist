import Vue from 'vue'

const app = new Vue({
  // el: '#root',
  // template: '<div>{{text}}</div>',
  data: {
    text: 0
  },
  beforeCreate () {
    // undefined, 'beforeCreate'
    console.log(this.$el, 'beforeCreate')
  },
  created () {
    // undefined, 'created'
    console.log(this.$el, 'created')
  },
  // beforeMount 和 mounted 在用服务端渲染时，是不会被调用的
  beforeMount () {
    // <div id="root"></div>, 'beforeMount'
    console.log(this.$el, 'beforeMount')
  },
  mounted () {
    // <div>0</div>, 'mounted'
    console.log(this.$el, 'mounted')
  },
  // 数据更新时会执行 beforeUpdate 和 updated
  beforeUpdate () {
    console.log(this, 'beforeUpdate')
  },
  updated () {
    console.log(this, 'updated')
  },
  activated () { // 在组件章节讲解
    console.log(this, 'activated')
  },
  deactivated () { // 在组件章节讲解
    console.log(this, 'deactivated')
  },
  // 组件销毁时会执行 beforeDestroy 和 destroyed
  beforeDestroy () {
    console.log(this, 'beforeDestroy')
  },
  destroyed () {
    console.log(this, 'destroyed')
  },
  render: (h) => {
    // throw new TypeError('render error')
    console.log('render function invoked')
    // h 是 vue中createElement方法
    return h('div', {}, app.text)
  },
  renderError (h, err) {
    // 只能捕获本组件中 render方法中的错误
    // 不能捕获到子组件中 render方法的错误
    // return h('div', {}, err.stack)
  },
  errorCaptured () {
    // 会向上冒泡，并且正式环境可以使用，
    // 而且能捕获到子组件中的错误
  }
})

app.$mount('#root')

// setInterval(() => {
//   app.text += 1
// }, 1000)

setTimeout(() => {
  // 组件销毁时，会自动销毁事件监听和watch
  app.$destroy()
}, 1000)

// 注意：
// 1.这些生命周期函数，只会执行一次；
// 2.beforeMount() 和 mounted()在用服务端渲染时，不会被调用。被调用的只有beforeCreate() 和 created()

// 生命周期：
//   有哪些生命周期方法
//   生命周期方法的调用顺序
//   生命周期中vue实例有哪些区别
