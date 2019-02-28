import Vue from 'vue'

const component = {
  template: `
    <div :style="style">
      <slot name="header" :text="text"></slot>
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

new Vue({
  el: '#root',
  components: {
    CompOne: component
  },
  template: `
    <div>
      <comp-one ref="comp">
        <p slot="header" slot-scope="props" ref="p">{{props.text}}</p>
      </comp-one>
    </div>
  `,
  data () {
    return {
      value: '123'
    }
  },
  mounted () {
    // console.log(this.$refs.comp)  // 组件本身
    console.log(this.$refs.comp.text) // 组件上的数据text
    console.log(this.$refs.p) // 节点本身
  }
})

