// npm i postcss-loader autoprefixer babel-loader babel-core
// postcss是帮我们后处理css的：我们的 stylus编译完成之后是 css文件，我们再通过 postcss 优化css代码
// 优化的过程：通过一系列组件优化，我们现在使用的是 autoprefixer

const autoprefixer = require('autoprefixer')

module.exports = {
    plugins: [
        autoprefixer() //我们需要用到一些需要加浏览器前缀的CSS属性，比如-webkit-, -ms-等，我们使用 autoprefixer，它可以自动帮我们加这些前缀
    ]
}
