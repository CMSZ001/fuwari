---
title: Umami部署至Serverless平台
published: 2025-11-25
description: Umami 是一个现代、注重隐私的 analytics 平台。它是 Google Analytics、Mixpanel 和 Amplitude 的开源替代方案。
image: ""
tags:
  - Serverless
  - Umami
draft: true
lang: ''

---

# 准备

1. 一个Serverless平台（[Vercel](https://vercel.com/)、[Netlify](https://www.netlify.com/)、[Render](https://render.com/)、[Northflank](https://northflank.com/)、[Railway](https://railway.app/)）
2. 一个[Github](https://github.com)账号，用于存储和同步Umami仓库文件

## 让我们开始吧

### Fork 仓库

1. 登录你的Github账号，并Fork [Umami](https://github.com/umami-software/umami/fork) 仓库

2. ![](./1.webp)，通过`Sync fork`同步仓库

### 部署到Serverless平台

#### Vercel篇

1. 登录你的Vercel

2. 导入仓库  ![](./2.webp)![](./3.webp)

3. 构建Umami![](./4.webp)，正常来说会报错

4. 点击`Go to Project`，再点击上方的`Storage`，点击`Create Database`，选择`Neon`或`Supabase`，这里以`Neon`做演示。继续点击`Continue`，在同意相关的政策后点击`Accept and Create`。 Region 保持默认即可，选择免费计划并点击`Continue`。上方的 Database Name 自己填一个名字，点击`Create`。出现`The <name> has been created successfully.`时，点击`Done`，这时它会让你连接数据库，点击`Cancel`。

5. `Settings` - `Environment Variables` 中进行设置环境变量，![](./5.webp)在`Key`中填入`DATABASE_URL`，`Value`中填入类似`postgresql://neondb_owner:xxx@ep-round-base-a49lcqo5-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require`（在主页的`Storage`的数据库内可以找到）