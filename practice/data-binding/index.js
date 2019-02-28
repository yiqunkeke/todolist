import Vue from 'vue'

new Vue({
  el: '#root',
  template: `
    <div :id="idName" @click="handleClick" :class="{active: isActive}">
      <span :style="styles">{{isActive ? 'active': 'not active'}} </span><br/>
      <span :style="[styles, styles2]">{{arr.join(' ')}}</span><br/>
      <p v-html="html" :class="[isActive ? 'active' : '']"></p>
    </div>
  `,
  data: {
    isActive: false,
    arr: [1, 2, 3],
    html: `<span>111</span>`,
    idName: 'main',
    styles: {
      color: 'red',
      // vue 会自动给需要加前缀的属性，加上前缀
      appearance: 'none'
    },
    styles2: {
      color: 'blue'
    }
  },
  methods: {
    handleClick () {
      console.log('clicked')
    }
  }
})
