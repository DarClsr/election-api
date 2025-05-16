# 在线投票系统

## 项目介绍
这是一个基于 Node.js 的在线投票系统，包含管理后台和投票前台两个界面。系统支持创建多个投票活动，通过选举码进行访问和投票。

## 技术栈
- 前端：Vue.js + Vite
- 后端：Nest.js 
- 数据库：mongodb
- 部署：Docker + Nginx

## 项目结构
```
├── admin/              # 管理后台
│   ├── src/           # 源代码目录
│   ├── public/        # 静态资源
│   ├── dist/          # 构建输出目录
│   └── Dockerfile     # Docker构建文件
├── server/            # 服务端
│   ├── src/           # 源代码目录
│   ├── test/          # 测试文件
│   ├── public/        # 静态资源
│   └── Dockerfile     # Docker构建文件
└── docker-compose.yml # Docker编排文件
```

## 功能特性
- 管理后台
  - 投票活动管理
  - 选举码生成
  - 投票数据统计
- 投票前台
  - 选举码验证
  - 投票界面

## 开发指南

### 管理后台开发
```bash
cd admin 
npm install
npm run dev
```

### 服务端开发
```bash
cd server
npm install
npm run start:dev
```

### 开发访问地址
- 后台管理界面：http://localhost:5050
- 服务端API：http://localhost:8889/api
- API文档：http://localhost:8889/docs
- 投票界面：http://localhost:8889?code=选举码

## 部署说明

### Docker部署
- 后台构建运行：`docker compose up --build -d`
- 直接启动：`docker compose up -d`

## 部署后访问地址
- 后台管理界面：http://localhost:5353
- 服务端API：http://localhost:8888/api
- API文档：http://localhost:8888/docs
- 投票界面：http://localhost:8888?code=选举码



## 默认账户
- 用户名：admin@admin.com
- 密码：admin

## 注意事项
1. 后台管理系统暂未开放注册功能，使用默认账户登录
2. 选举码可在后台管理界面获取
3. API文档支持在线调试
4. 为了方便测试 env文件就提了上去 （实际是不能的）

## 数据库

### vote-system

## 测试

## npm run test 测试所有文件
## npm run vote.service 测试单个文件




