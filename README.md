# RedisKit

### 概述

RedisKit是一款基于Electron、Vue、NodeJS开发的Redis GUI客户端，前端使用了ElementUI组件库，redis相关功能依赖于开源项目 [ioredis](https://github.com/luin/ioredis) 。



### 版本

##### v1.0.0

基本的服务器管理、数据的增删改查功能。



### 截图

![image-20190215151900019](https://ws1.sinaimg.cn/large/006tKfTcgy1g074ua9psrj31ce0u0q5n.jpg)



![image-20190215151924349](https://ws2.sinaimg.cn/large/006tKfTcgy1g074unut09j31ce0u00vu.jpg)



![image-20190215151955248](https://ws1.sinaimg.cn/large/006tKfTcgy1g074v70sk4j31ce0u041g.jpg)



![image-20190215152018360](https://ws4.sinaimg.cn/large/006tKfTcgy1g074vljf2rj31ce0u0tbl.jpg)



### 安装程序

- [Mac OS](https://github.com/tyrival/RedisKit/releases/download/v1.0.0/RedisKit-1.0.0.dmg)

- Windows (暂不提供，可自行编译)
- Linux (暂不提供，可自行编译)



### 编译

首先需要安装新版的NodeJS，进入工程安装依赖包 `npm install` ，然后可使用如下命令：

```bash
# 生成安装程序
npm run build

# 生成绿色可执行文件
npm run build:dir

# 删除构建文件
npm run build:clean
```



