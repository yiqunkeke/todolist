import Vuex from 'vuex'
import defaultState from './state/state'
import mutations from './mutations/mutations'
import getters from './getters/getters'
import actions from './actions/actions'

export default () => {
  return new Vuex.Store({
    state: defaultState,
    mutations,
    getters,
    actions,
    modules: {
      a: {
        // namespaced:true 使得每个模块有单独的命名空间
        namespaced: true,
        state: {
          text: 1
        },
        // vuex 默认会把 mutation 放入全局的命名空间当中
        mutations: {
          updateText (state, text) {
            // state为当前模块a中的state
            state.text = text
          }
        },
        getters: {
          textPlus (state, getters, rootState) {
            // 第一个参数state为：当前模块中的state
            // 第二个参数getters为：全局所有的getters
            // 第三个参数 rootState为：全局所有的state

            // return state.text + rootState.count
            // 通过 rootState.模块名.变量名， 访问 模块b中的变量
            return state.text + rootState.b.text
          }
        },
        actions: {
          add ({ state, commit, rootState }) {
            // ctx 为当前模块的context，里面包含state, commit, rootState
            // ctx等于{ state, commit, rootState }
            // commit 默认为当前模块中的mutation
            commit('updateText', rootState.count)
            // 调用全局的 mutation,需要在第三个参数加上 { root:true },代表调用的是全局的mutation
            commit('updateCount', { num: 56789999 }, { root: true })
          }
        }
      },
      b: {
        state: {
          text: 2
        },
        actions: {
          testAction ({ commit }) {
            // 模块b调用 a中的 mutations，也需要在第三个参数加上{root:true}
            commit('a/updateText', 'test text test text2', { root: true })
          }
        }
      }
    }
  })
}
