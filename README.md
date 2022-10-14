<p align="center">
<img src="https://6f6e-on-line-1gqban3ba49e3d35-1302613116.tcb.qcloud.la/broccoli.png?sign=7b6211e60087fd8fb1909cca697cb0a3&t=1612709339" alt="broccoli" width="100">
</p>
<h1 align="center">Kelp and Broccoli</h1>

[![](https://img.shields.io/badge/KelpAndBroccoli-green.svg)](https://github.com/cleves0315/kelp-and-broccoli)
[![npm](https://img.shields.io/npm/l/kelp-and-broccoli.svg)](https://github.com/cleves0315/kelp-and-broccoli/blob/master/LICENSE)

> 海带与西蓝花 uni-app 版

## 介绍

海带与西兰花是一款计划管理工具，方便你的日常管理。

使用原生微信小程序云开发.

<p>
<img src="https://6f6e-on-line-1gqban3ba49e3d35-1302613116.tcb.qcloud.la/broccoli_3.png?sign=259f4e7b88e911421cbeb63c842d11de&t=1640624761" alt="diagram-1" width="280">
</p>

## 功能

- 添加计划，输入计划名称
- 方便快速设定截止日期与重复周期
- 支持定时推送消息
- 计划类型分类（”我的一天“ 和 ”默认“类型计划）
  - “我的一天”列表可以看到特殊的背景图，显示在界面中心点 方便当天管理

## 预览

<img src="https://6f6e-on-line-1gqban3ba49e3d35-1302613116.tcb.qcloud.la/broccoli-logo.jpg?sign=20165c057e9630056a11128b1b740c08&t=1640626684" alt="diagram-1" width="150">


## 如何Diy这个项目
1. cd client
2. npm install or yarn (建议node >= 14)
3. yarn dev:weapp
4. 微信开发者工具选择运行目录 'client/dist'

### 常见问题
- .vue 文件语法爆红
步骤2. 安装成功后重启编辑器

- .vue 文件语法高亮，
vsCode 安装 (volar)

- 没有热更新？微信开发者工具 - 模拟器（上方） - 热重载（关）

- taro: command not found

```javascript
# 使用 npm 安装 CLI
$ npm install -g @tarojs/cli

# OR 使用 yarn 安装 CLI
$ yarn global add @tarojs/cli

# OR 安装了 cnpm，使用 cnpm 安装 CLI
$ cnpm install -g @tarojs/cli
```

- onTouchMove 卡顿问题 https://github.com/NervJS/taro/issues/10540

- 公用用具函数 requestSubscribeMessage 需要测试下自定义Promise函数逻辑