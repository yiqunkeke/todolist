<template>
    <section class="real-app">
        <input type="text"
               class="add-input"
               autofocus="autofocus"
               placeholder="接下去要做什么？"
               @keyup.enter="addTodo"
               >
        <Item :todo="todo"
                v-for="todo in filteredTodos"
                :key="todo.id"
                @del="deleteTodo"/>
        <!--注意这里循环的是组件。我之前一般在组件内循环！！！-->
        <Tabs :filter="filter"
              :todos="todos"
              @toggle="toggleFilter"
              @clearAllCompleted="clearAllCompleted"
        />
      <!--<router-view></router-view>-->
    </section>
</template>

<script>
    import Item from './item.vue'
    import Tabs from './tabs.vue'
    let id = 0;
    export default {
        name: 'todo',
         props:['id'],
        // mounted(){
        //     console.log(this.id);
        // },
        // 组件内的守卫
        beforeRouteEnter (to, from, next) {
          // 在渲染该组件的对应路由被 confirm 前调用
          // 不！能！获取组件实例 `this`
          // 因为当守卫执行前，组件实例还没被创建
          console.log('component beforeRouteEnter')
          next()
        },
      beforeRouteUpdate (to, from, next) {
        // 在当前路由改变，但是该组件被复用时调用，此时不会调用beforeRouteEnter
        // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
        // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
        // 可以访问组件实例 `this`
        console.log('component beforeRouteUpdate')
        next()
      },
      beforeRouteLeave (to, from, next) {
        // 导航离开该组件的对应路由时调用
        // 可以访问组件实例 `this`
        console.log('component beforeRouteLeave')
        next()
      },
      mounted(){
            // 如果该组件被复用时调用，不会执行mounted
            console.log('component mounted')
      },
        data() {
            return{
                // 数据都尽量放在顶层组件上，子组件tabs.vue和item.vue中的数据从顶层组件传进去 ，方便数据统一管理
                todos:[],
                filter: 'all'
            }
        },
        components: {
            Item,
            Tabs
        },
        computed: {
            filteredTodos(){
                if(this.filter ==='all') {
                    return this.todos
                }
                const completed = this.filter === 'completed'
                // 如果 this.filter等于'completed'，则 completed 变量为 true。否则为 false。
                // 那么我们就可以用 completed 这个变量来做filter操作了
                return this.todos.filter(todo => completed === todo.completed)
                // filter()函数，如果返回结果为true，则代表会显示，如果为false则不会显示
            }
        },
        methods: {
            addTodo(e){
                // todos有一个基本的数据结构，我们在这个方法里面写
                this.todos.unshift({
                    id: id++,
                    content: e.target.value.trim(),
                    completed: false
                })
                e.target.value = ''
            },
            deleteTodo(id){
                this.todos.splice(this.todos.findIndex(todo => todo.id === id), 1)
                // findIndex() 遍历数组，todo为数组中的单元项。如果todo.id 与传过来的id相等，则返回此项的下标
            },
            toggleFilter(state){
                this.filter = state;
                // 点击 active 应该只显示没有被勾掉的项:
                // 怎么做呢？我们循环的列表是 todos, 应该显示 filteredTodos,所以我们定义了一个computed计算属性，来过滤 todos
            },
            clearAllCompleted() {
                this.todos = this.todos.filter( todo => !todo.completed)
                // 把没有完成的，也就是checked为false没选中（todo.completed为false）的filter显示出来
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .real-app{
        width 600px
        margin 0 auto
        box-shadow 0 0 5px #666
    }
    .add-input{
        position: relative;
        margin: 0;
        width: 100%;
        font-size: 24px;
        font-family: inherit;
        font-weight: inherit;
        line-height: 1.4em;
        border: 0;
        outline: none;
        color: inherit;
        padding: 6px;
        border: 1px solid #999;
        box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
        box-sizing: border-box;
        font-smoothing: antialiased;
        padding: 16px 16px 16px 60px;
        border: none;
        box-shadow: inset 0 -2px 1px rgba(0,0,0,0.03);
    }
</style>
