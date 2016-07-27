## BOSS 静态化 ##

本项目是用来将BOPS的老BOSS系统从Java(jsp)转换为HTML5，内部称为静态化。

### 架构实现 ###

我们都知道，前端的架构主要目的就是为了提高软件生产率和提高软件质量。

前端架构的组成部分：

项目整体共有3种角色的服务器：

1. 构建服务器(持续集成服务器)
2. 仓库(公共包，模块版本管理)
3. 测试服务器(作为发布前的堡垒)

架构完成的目标为:

1. 框架选型
2. 构建。
3. 开发模式，开发规范。

#### 框架选型
基于我们3种角色的服务器：

在构建方面：开发端我们使用webpack, 服务端我们使用CircleCI做为持续集成平台。

在开发模式方面：数据绑定使用MVVM，页面交互使用Native Javascript或是jQuery，使用Node作为模块化工具，这三者作为我们的技术盏。

开发规范：基于业界已有的JS，CSS规范。

共有模块：使用NPM的方式管理，基于版本的发布机制（类似于Maven）。

##### 构建
构建活动是软件开发的主要组成部分。构建活动在整个项目开发期中占据了30%~80%的时间，提高构建的质量就是直接提高了程序员的工作效率。

由于项目整体使用了前后端分离的开发模式，所以前端部分我们使用了**webpack**作为前端的构建框架。

webpack在构建方面我们做了如下工作：

1. 精简资源
	1. 压缩、合并CSS，JS文件。
	2. 对图片文件进行精简优化，方式：OptiPNG工具无损优化PNG图片。
2. 减少http请求次数
	1. 合并css, js文件。
3. 延迟加载，模块化
	1. 使用nodejs按需加载JS模块。

此外我们需要解决程序员开发和测试的需要：

我们定制了4条快捷命令： **publish**, **watch**, **server**，**develop**

**publish**:是发布到线上环境的时候需要做的事情，程序员基本不太用这条命令，但是需要知道背后的原理，我会在后面讲解。

**watch**:开发需要打开监听模式，好让webpack可以监视改动后实时编译修改后的代码。

**server**:本地调试需要的浏览器环境，会开启一个Web Server。

**develop**:开启本地开发环境，实际上就是server+watch2个任务都开启。

>本地开发调试的时候只需要执行**npm run develop**就可以。

>此外我们的服务器端构建服务器也就是持续集成服务器会额外进行JSHINT的代码质量检查，单元测试内容.


### 如何部署开发环境 ###

首先从git或svn上拉取代码到本地后，进入当前仓库根目录下，打开CMD或是Terminal：

**npm set registry http://localhost:4873(此处的loaclhost会替换为服务器真实地址)**

**npm install**, **npm install -g webpack**


如果是window环境: 

请使用 **npm run develop**

如果是Linux或Mac:

请使用 **npm run watch && npm run server**

然后打开 http://localhost:8080/login.html


### 结构 ###

-**app** // 主要工作目录，业务逻辑代码都在此处

--|**common** // 公共样式或公共的工具类

--|**libs** // 第三方库，此处放置的是无法托管给NPM管理的包

--|**modules** //开发的模块

-**node_modules** //node环境依赖的库

-**public** // 集成完成后的文件，也是WEB Server监听的目录

-**typings** // visual studio 环境下的自动完成和文档辅助文档

--**jsconfig.json** // visual studio code 环境下的IDE辅助选项

--**webpack.config.js** // webpack配置文件


### 日常开发步骤 ###

1. 进入public目录, 找到pages目录，你需要建立自己模块的HTML文件。
2. 然后进入APP目录，找到modules目录，建议你自己模块的文件夹，包括图片，JS，SCSS文件。
