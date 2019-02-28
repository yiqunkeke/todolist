export default {
  updateCount (state, data) {
    // 只能接收两个参数，不能传第三个参数
    // 如果有多个数据要传，可以把多个数据包装成一个对象
    // console.log(num2)
    state.count = data.num
  }
}
