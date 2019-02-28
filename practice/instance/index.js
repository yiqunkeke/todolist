import Vue from 'vue' // 引入 Vue 类库

const app = new Vue({
  // el: '#root',
  template: '<div>{{text}}----{{obj.a}}</div>',
  data: {
    text: 0,
    obj: {}
  }
  /* watch: {
    text (newVal, oldVal) {
      console.log(`${newVal} : ${oldVal}`)
    }
  } */
})

app.$mount('#root')

// app.text = 'test1'

// let i = 0
setInterval(() => {
  // i++

  app.text += 1
  // app.$options.data.text += 1 // 不起作用
  // app.$data.text += 1 // 等于 app.text += 1

  // 不建议使用$forceUpdate()强制渲染，因为耗费性能
  // console.log(app.obj.a)
  // app.obj.a = i
  // app.$forceUpdate()

  // 使用 $set()设置的值，是reactive响应式的
  // app.$set(app.obj, 'a', i)
  // app.$delete()
}, 1000)

// -----------以下是vue实例属性----------------
// console.log(app.$data)
// console.log(app.$props)
// console.log(app.$el)

// console.log(app.$options)
// render方法：等下一次值发生变化，重新渲染时才会生效
// app.$options.render = (h) => {
//   return h('div', {}, 'new render function')
// }

// console.log(app.$root === app) // true
// <item><div></div></item>
// console.log(app.$children) // 传入子组件中的 children

// 插槽的概念，在template里面书写调用
// console.log(app.$slots)
// console.log(app.$scopedSlots)

// 返回节点实例或者组件实例
// console.log(app.$refs)

// 在服务端渲染时，会用到
// console.log(app.$isServer)

// -----------以下是vue实例方法----------------
// $watch()其实跟写在上面options当中的watch一样
// 在options写watch的好处：
// app 注销时，自动会把watch注销掉
// 而 $watch() 这种方式，要自己注销掉watch
// const unWatch = app.$watch('text', (newVal, oldVal) => {
//   console.log(newVal + ':' + oldVal)
// })
// setTimeout(() => {
//   unWatch() // 调用方法即可注销watch
// }, 2000)

// 事件监听$on()
// app.$on('test', (a, b) => {
//   console.log(`test emited ${a} ${b}`) // 每隔1s打印一次
// })

// 触发事件并传值$emit()
// setInterval(() => {
// app.$emit('test', 1, 2)
// }, 1000)

// 只触发一次$once()
// app.$once('test', (a, b) => {
//   console.log(`test emited ${a} ${b}`) // 只打印了一次
// })
// setInterval(() => {
//   app.$emit('test', 1, 2)
// }, 1000)

// 强制组件重新渲染一次 $forceUpdate()
// 不建议使用$forceUpdate()强制渲染，因为耗费性能
// app.$forceUpdate()

// 设置/添加属性 $set()
// 使用 $set()设置的值，是reactive响应式的
// app.$set(app.obj, 'b', 'val')

// 删除属性 $delete()

// $nextTick()
