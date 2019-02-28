module.exports = (isDev) => {
  return {
    preserveWhitespace: true // 默认值: true, 如果设置为 false，模版中 HTML 标签之间的空格将会被忽略。
    // extractCSS: !isDev,  // 使用 extract-text-webpack-plugin 自动提取 CSS , 这应当只用于生产环境，以便可以在开发过程中使用热重载。
    // hotReload: false,    // 根据环境变量process.env.NODE_ENV自动生成
    /* cssModules: {
            // 自定义生成的类名
            localIdentName: '[path]-[name]-[hash:base64:5]',
            camelCase: true
        } */
  }
}

/*
    （1） hotReload:
            类型: boolean
            默认值: 在开发环境下是 true，在生产环境下或 webpack 配置中有 target: 'node' 的时候是 false。
            允许的值: false (true 会强制热重载，即便是生产环境或 target: 'node' 时)
            是否使用 webpack 的模块热替换在浏览器中应用变更而不重载整个页面。 用这个选项 (值设为 false) 在开发环境下关闭热重载特性。

    （2） vue-loader中可以自定义vue模块：
            在.vue文件中，<template>、<script>、<style>这些都是不同的模块。
            .vue在处理这些不同的模块时，都是使用的不同的loader,比如 <script> 使用的是 babel-loader,
            <style> 使用的是 style-loader（或者 vue-style-loader）

            那么我们是否可以自定义模块呢？
               当然是可以的

*/
