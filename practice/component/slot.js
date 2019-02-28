import Vue from 'vue'

const component = {
  template:`
    <div :style="style">
      <!--所谓作用域插槽：是说 slot 上面是有它自己的作用域的。
          我们可以使用它这个作用域里面传出去的任何值（如 text 和 text2）。
      -->
      <slot name="header" :text="text" :text2="text2"></slot>
      <slot name="body"></slot>
    </div>
  `,
  data(){
    return {
      style: {
        width: '200px',
        height: '200px',
        border: '1px solid red'
      },
      text: ' this is component data',
      text2: ' another text '
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
      <comp-one>
        <!--子组件内部传过来的'text'和'text2'，都放在 props 这个对象中-->
        <p slot="header" slot-scope="props">
          {{props.text}}
          <br/>
          <br/>
          {{props.text2}}
        </p>
        <h4 slot="body">{{value}}</h4>
      </comp-one>
    </div>
  `,
  data () {
    return {
      value: '123'
    }
  }
})

// 使用场景：需要用到组件内部定义的变量（如 text 和 text2），而不仅仅是我们在引用这个组件时用到的变量 （如value）
