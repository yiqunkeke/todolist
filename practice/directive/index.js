import Vue from 'vue'

new Vue({
  el: '#root',
  template: `
  <div>
    <div v-text="text" v-show="active"></div>
    <div v-html="html"></div>
    <p v-pre="">{{text}}</p>
    <ul>
      <li v-for="(item,index) in arr" :key="index">{{item}}---{{index}}</li>
    </ul>
    <ul>
      <li v-for="(value,key,index) in obj" :key="key">{{key}}---{{value}}---{{index}}</li>
    </ul>
    <input type="text" v-model.number="text"><br>
    <input type="checkbox" v-model="active"/><br>
    <div>
      <input type="checkbox" v-model="arr" :value="1"/>
      <input type="checkbox" v-model="arr" :value="2"/>
      <input type="checkbox" v-model="arr" :value="3"/>
    </div>
    <div>
      <input type="radio" v-model="picked" value="one"/>
      <input type="radio" v-model="picked" value="two"/>
    </div>
  </div>  
`,
  data: {
    text: 0,
    active: false,
    html: '<span>this is html</span>',
    arr: [1, 2, 3],
    obj: {
      a: '123',
      b: '456',
      c: '789'
    },
    picked: ''
  }
})

// 1.v-text
// 2.v-html
// 3.v-show
// 4.v-if v-else v-else-if
// 5.v-for
// 6.v-on:    @

// 7.v-model

// 7.1 v-model.number
// 把输入的内容，强制转换为数字类型。
// 同时，如果我们输入的值是01，当我们失焦时，input框里面的值会变成1，来显示一个正确的数值

// 7.2 v-model.trim
// 去除首尾的空格

// 7.3 v-model.lazy
// 只有 change 的时候才会触发改变

// 8. v-pre 把标签里面的内容转为原生的文本，而非绑定的变量等
// 9. v-cloak 基本用不到
// 10. v-once 数据绑定的内容只执行一次，当数据发生变化时，绑定的内容也不会变化。


