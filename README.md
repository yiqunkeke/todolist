# webpack

#### 项目介绍
使用 webpack + vue + vue-router + vuex + vue-ssr 实现 todo 应用

#### 软件架构
build目录

			webpack.config.base.js  // 基础webpack配置
	
			webpack.config.client.js  // 客户端
	
			webpack.config.server.js  // 服务端
	
client目录 

			index.js // 客户端入口文件
	
			server-entry.js // 服务端入口文件
	
			create-app.js // 服务端渲染每次都需要重新创建新的app
	
server 目录

			routers
	
					server-render.js // 将vue实例渲染为html
		
					dev-ssr.js // 处理开发时---服务端渲染情况
		
					ssr.js  // 处理正式环境
		
			server.js // 服务端文件
	
			server.template.ejs // 模板
	
  
#### 安装教程

1. npm install 
2. npm run dev:client   // 启动客户端
3. npm run dev:server   // 启动服务端

#### 使用说明

1. xxxx
2. xxxx
3. xxxx

#### 参与贡献

1. Fork 本项目
2. 新建 Feat_xxx 分支
3. 提交代码
4. 新建 Pull Request

