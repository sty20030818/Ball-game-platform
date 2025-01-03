# 在线约球平台

## 项目概述
本项目是一个在线约球平台，旨在为球友提供便捷的约球、场地预约、赛事组织等功能。平台包含用户和管理员两种角色，支持用户注册、活动发布、场地预约、信用评分、积分奖励等功能。

## 主要功能
- 用户注册与登录
- 活动发布与参与
- 场地预约管理
- 信用评分系统
- 积分奖励机制
- 赛事记录统计
- 通知系统
- 会员管理
- 俱乐部系统

## 技术栈
### 前端
- Vue.js 3
- Vue Router
- Bulma CSS 框架
- Axios

### 后端
- Node.js
- Express.js
- RESTful API

### 数据库
- MongoDB

## 项目结构
```
.
├── src/
│   ├── backend/          # 后端代码
│   ├── frontend/         # 前端代码
│   └── database/         # 数据库相关
├── README.md             # 项目说明文档
└── package.json          # 项目依赖配置
```

## 安装与运行
### 前端
1. 进入前端目录
   ```bash
   cd src/frontend
   ```
2. 安装依赖
   ```bash
   npm install
   ```
3. 启动开发服务器
   ```bash
   npm run dev
   ```

### 后端
1. 进入后端目录
   ```bash
   cd src/backend
   ```
2. 安装依赖
   ```bash
   npm install
   ```
3. 启动服务器
   ```bash
   npm start
   ```

## 贡献指南
1. Fork 本项目
2. 创建新分支 (`git checkout -b feature/YourFeatureName`)
3. 提交更改 (`git commit -m 'Add some feature'`)
4. 推送分支 (`git push origin feature/YourFeatureName`)
5. 创建 Pull Request

## 许可证
MIT License
