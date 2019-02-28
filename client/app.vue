<template>
    <div id="app">
        <div id="cover"></div>
        <!--组件在调用时，如果内部没有内容，可以写成单标签形式-->
        <Header />
        <p>全局state中的count变量：---- {{count}}</p>
        <p>全局getters中的 fullName方法：---- {{fullName}}</p>
        <br>
        <p>模块a中的state中的text变量：---- {{textA}}</p>
        <p>模块a中的getters中的textPlus方法：---- {{textPlus}}</p>
        <br>
        <p>动态加载的store模块c中的getters中的text变量：---- {{textC}}</p>
        <!--<Todo/>-->
        <!--<router-link :to="{name:'app'}">app</router-link>-->
        <!--<router-link to="/app/123">app</router-link>-->
         <router-link to="/app/123">app123</router-link>
         <router-link to="/app/456">app456</router-link>
         <router-link to="/login">login</router-link>
        <!--路由切换动画-->
        <transition name="fade">
          <router-view></router-view>
        </transition>
        <Footer/>
    </div>
</template>

<script>
    import Header from './layout/header.vue'
    import Footer from './layout/footer.jsx'
    // import Todo from './views/todo/todo.vue'
    import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'

export default {
    components: {
        Header,
        Footer,
        // Todo
    },
    computed: {
      // 1.state---- 计算属性方式
      // count(){
      //   return this.$store.state.count;
      // },

      // 1.1. state---- 调用a模块中的state
//      textA(){
//        // 通过不同的模块名称调用专属的state中的变量
//        // return this.$store.state.a.text
//        return this.$store.state.b.text
//      },

      // 2.state---- mapState 数组方式
      // ...mapState(['count']),

      // 3.state---- mapState 对象方式
      ...mapState({
        count: state => state.count,
        // 调用 a 模块中的state中的变量，需通过：state.模块名.变量名
        textA: state => state.a.text,
        textC: state => state.c.text
      }),

      // 1.getters---- 计算属性
      // fullName(){
      //   return this.$store.getters.fullName
      // },

      // 2.getters---- mapGetters 数组
      // ...mapGetters(['fullName']),

      // 3.getters---- mapGetters 对象
      ...mapGetters({
          'fullName': 'fullName',
          // 访问模块a中的getters方法，需要通过：'模块名/方法名'
          'textPlus': 'a/textPlus'
      })
    },
    methods:{
        //模块b中没有声明 namespaced，所以不用加模块名
      ...mapActions(['updateCountAsync','a/add','testAction']),
      // 默认mutation的命名空间是全局的
      // 如果mutation加了 namespaced:true,则需要通过'模块名/mutation名'的方式访问mutation
      ...mapMutations(['updateCount','a/updateText'])
    },
    mounted(){
      // console.log(this.$route)
      // console.log(this.$store)

      // 调用模块a的 namespaced: true 中的mutation，需要通过以下方式
      // this['a/updateText']('456')

      // 调用模块a的 namespaced: true 中的actions，需要通过以下方式
      this['a/add']()
      this.testAction()

      // 使用 mapActions
       this.updateCountAsync({
         num: 5,
         time: 2000
       })

      // 使用 dispatch
      // this.$store.dispatch('updateCountAsync',{
      //   num: 5,
      //   time: 2000
      // })

      // 使用 mapMutations
//      let i=0;
//      setInterval(()=>{
//        this.updateCount({
//          num: i++,
//          num2: 2
//        })
//      },1000)


      // 使用 commit
      // let i=0;
      // setInterval(()=>{
      //   this.$store.commit('updateCount', {
      //     num: i++,
      //     num2: 2
      //   })
      // },1000)
    }
}
</script>

<style lang="stylus" scoped>
    #app{
        position absolute
        left 0
        right 0
        top 0
        bottom 0
    }
    #cover{
        position absolute
        left 0
        top 0
        right 0
        bottom 0
        background-color #999
        opacity .9
        z-index -1
    }
</style>
