### 使用sinopia 快速搭建本地NPM服务器

#### 为什么我们需要本地NPM服务器？
考虑到我们的架构是有多个不同的产品，每个产品都会有一些类似的功能，我们可以将其提取出来做成一套内部组建库，比如在JAVA环境中我们很多产品都需要使用上传组件，我们有如下几种办法来完成组件库的共享：

1. 拷贝
2. 在每个产品维护一套单独的副本
3. 使用版本管理系统(Maven, Bower, NPM)

在1, 2种模式种，都无法解决一个问题：如果A项目需要使用1.0版本的插件，但是B项目需要使用2.0版本的插件，那维护起来的成本会很高。

考虑到DRY和版本维护的便利，我们使用第三种维护方式。Maven是JAVA环境，Bower是额外的一套维护系统，我们无需加入额外的复杂度，NPM已经满足我们的需要。

#### Sinopai

Sinopai是目前功能功能比较全的NPM服务，淘宝CNPM不开源，无法搭建本地NPM，不考虑。

#### 安装Sinopai

nodejs版本必须为0.12.5以下，否则node-gyp会报错。

> npm init

完成服务器的基本信息的填写

> npm install -g sinopia --no-optional --no-shrinkwrap

注意请使用nvm(https://github.com/creationix/nvm), 来避免SUDO的问题.

> sinopia -c config.yaml

使用指定的配置文件启动服务器

> npm adduser --registry http://localhost:4873

添加可以发布包的用户名

> npm publish

#### 如何切换本地和远程仓库

> npm install -g nrm

> nrm add local http://localhost:4873

> nrm use local

如果你需要切换到远程仓库:

> nrm use npm

#### 如何架构在真实的服务器上:

> npm install -g forever

> forever start 'path/to/sinopia'

我们需要在服务器崩溃的情况下重启后立即可用

> crontab -e

@reboot /usr/bin/forever start /usr/lib/node_modules/sinopia/bin/sinopia

#### 如何提交公共库

一个符合CommonJS的要求的库必须满足如下目录要求

--dist // 暴露给外部使用的文件

--src // 源文件

--doc // 文档

--test // 测试文档

--lib // 第三方库

--example // 例子文件

--package.json

--README.md // 入口说明文件

对于package.json文件的要求:用于描述该包的一些包括包名、版本号、依赖等的信息，详情见http://wiki.commonjs.org/wiki/Packages/1.0。

确保满足如上要求后:

> npm set registry http://localhost:4873

> npm adduser --registry http://localhost:4873

这里我们要求内部的库必须以jzt-*开头，只有Admin用户有权限上传。
