export default {
  // 异步的代码必须放在actions里面，mutations只能写同步代码
  updateCountAsync (ctx, data) {
    console.log(ctx)
    setTimeout(() => {
      ctx.commit('updateCount', {
        num: data.num
      })
    }, data.time)
  }
}
