import Vue from 'vue'

const component = {
  // template: `
  //   <div :style="style">
  //     <slot></slot>
  //   </div>
  // `,
  props: ['props1'],
  render (createElement) {
    return createElement(
      'div',
      {
        style: this.style
      },
      // 默认插槽调用
      // this.$slots.default
      [
        this.$slots.default,
        this.props1
      ]
    )
  },
  data () {
    return {
      style: {
        width: '200px',
        height: '200px',
        border: '1px solid red'
      },
      text: ' this is component data'
    }
  }
}

new Vue({
  el: '#root',
  components: {
    CompOne: component
  },
  data () {
    return {
      value: '123'
    }
  },
  template: `
    <div>
      <comp-one ref="comp">
        <span ref="span">{{value}}</span>
      </comp-one>
    </div>
  `,
  // vue 会把template块，编译成了js中的render函数
  render (createElement) {
    // 参数createElement为创建节点的函数
    // 此函数有三个参数：
    // 第一个是创建节点的名字，可以是组件，也可以是普通的dom节点
    // 第二个是节点上属性，
    // 第三个是节点内容(如果是另一个节点，则必须是作为一个数组进行传递。如果是字符串，就不需要使用数组)
    return createElement(
      'comp-one',
      {
        ref: 'comp'
      },
      [ // 节点内容是另一个节点----用数组
        createElement(
          'span',
          {
            ref: 'span',
            props: {
              props1: this.value
            }
          },
          this.value // 节点内容是字符串---不用数组
        )
      ]
    )
  }
})
