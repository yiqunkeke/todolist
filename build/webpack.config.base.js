const path = require('path') // path 是 nodeJs 里面的一个基本包，它是用来处理路径的
const createVueLoaderOptions = require('./vue-loader.config')

const isDev = process.env.NODE_ENV === 'development'

const config = {
  target: 'web',
  mode: process.env.NODE_ENV || 'production',
  entry: path.join(__dirname, '../client/index.js'),
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, '../public'),
    // 为项目中的所有资源指定一个基础路径
    publicPath: 'http://127.0.0.1:8000/public/'
  },
  module: {
    rules: [
      /* {
                test:/\.(vue|js|jsx)$/,
                loader: 'eslint-loader',
                exclude: /node_modules/,
                enforce: 'pre'
            }, */
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: createVueLoaderOptions(isDev)
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader'
      },
      // 它会应用到普通的 '.js'文件
      // 以及'.vue'文件中的 <script>块
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: __dirname + 'node_modules',
        include: __dirname + 'client',
        options: {
          presets: ['env']
        }
      },
      // 它会应用到普通的 '.css'文件，
      // 以及 '.vue'文件中的 <style>块
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024, // 如果图片小于1024，则把图片转为base64写到代码里面去
              name: 'resources/[path][name].[hash:8].[ext]' // 指定输出的文件的名字
            }
          }
        ]
      }
    ]
  }
}
module.exports = config
