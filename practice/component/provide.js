import Vue from 'vue'

// 孙组件
const childComponent = {
  template: `
      <div>This is childComponent: {{value}}</div>
  `,
  // 在孙组件中，inject 进来父级或者祖父级 provide 的数据 (通过 this.value或者 {{value}} )
  // 但是默认 inject 进来的数据，是非响应的
  inject: ['yeye','value'],
  mounted () {
    // 通过 this.$parent 可以获取对父组件的引用
    console.log(this.$parent.$options.name) // comp

    // 使用 inject 进来的数据
    console.log(this.yeye, this.value)
  }
}

// 子组件
const component = {
  name: 'comp',
  components: {
    childComponent
  },
  template: `
    <div :style="style">
      <slot name="header" :text="text"></slot>
      <child-component></child-component>
    </div>
  `,
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

// 父组件
new Vue({
  el: '#root',
  components: {
    CompOne: component
  },
  // 使用 provide 暴露数据给子组件和孙组件
  provide () {
    return {
      yeye: this,
      value: this.value
    }
  },
  template: `
    <div>
      <comp-one>
        <p slot="header" slot-scope="props">{{props.text}}</p>
      </comp-one>
      <input type="text" v-model="value" />
    </div>
  `,
  data () {
    return {
      value: '123'
    }
  }
})
// vue 官方不推荐使用 provide 和 reject ，因为将来可能被废弃
