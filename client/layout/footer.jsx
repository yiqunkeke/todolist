import '../assets/styles/footer.styl'
// jsx 就是把html代码写在 javascript 代码里面
// jsx 本身也是使用的 javascript 语法
export default {
  data () {
    return {
      author: 'Jokcy'
    }
  },
  render () {
    return (
    // 把 html 写在 render 方法里
      <div id="footer">
        <span>Written by {this.author}</span>
      </div>
    )
  }
}
// .vue 文件和 .jsx 文件其实最终都会转化为一个 render 方法
