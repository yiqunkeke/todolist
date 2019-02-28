<template>
    <div class="helper">
        <span class="left">
            {{unFinishedTodoLength}} items left
        </span>
        <span class="tabs">
            <span v-for="state in states"
                  :key="state"
                  :class="[state, filter === state ? 'actived':'']"
                  @click="toggleFilter(state)"
            >
                <!--它也是一个动态class，因为它有选中和未选中的状态 。那么它是否选中我们根据什么来判断呢？根据传入进来的一个标识,叫 filter -->
                <!--class默认是名字跟state一样的名字(all,active或者是completed)，
                其次是filter,代表我们正选中的是哪一个状态：
                如果filter跟当前循环中的state是一样的，给这个节点加个样式叫 actived,否则就不加任何class-->
                {{state}}
            </span>
        </span>
        <span class="clear" @click="clearAllCompleted">Clear completed</span>
    </div>
</template>

<script>
    export default {
        name: 'index',
        props:{
            filter:{
                type: String,
                required: true
            },
            todos: {
                type:Array,
                required: true
            }
        },
        data(){
            return {
                states: ['all', 'active', 'completed']
            }
        },
        computed: {
            // 来计算一下，每一次有数据变化的时候，它都会自动去计算
            // 我们可以拿到新的剩下来的所有没有完成的todos的长度，那么这个长度就是我们要显示的内容
            unFinishedTodoLength(){
                return this.todos.filter(todo => !todo.completed).length
                //  多少个节点剩下，其实就是筛选一下 todos 列表里面，有多少个 completed为 false的节点
            }
        },
        methods:{
            clearAllCompleted(){
                this.$emit('clearAllCompleted')
            },
            toggleFilter(state){
                this.$emit('toggle', state)
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .helper{
        font-weight 100
        display flex
        justify-content space-between
        padding 5px 0
        line-height 30px
        background-color #fff
        font-size 14px
        font-smoothing: antialiased
    }
    .left, .clear, .tabs{
        padding 0 10px
        box-sizing border-box
    }
    .left, .clear{
        width 150px
    }
    .left{
        text-align left
    }
    .clear{
        text-align right
        cursor pointer
    }
    .tabs{
        width 200px
        display flex
        justify-content space-around
        * {
            display inline-block
            padding 0 10px
            cursor pointer
            border 1px solid rgba(175,47,47,0)
            &.actived{
                border-color rgba(175,47,47,0.4)
                border-radius 5px
            }
        }
    }
</style>