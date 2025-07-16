# E-commerce 多功能单位转换器

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/hanyeweiyangs-projects/v0-e-commerce-unit-converter)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/LKOogpA2ml4)
[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-blue?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)

## 项目概述

多功能单位转换器是一个为电商领域设计的实用工具集合，帮助用户轻松完成各种计算和转换任务。项目采用现代化前端技术栈，提供直观友好的用户界面和多语言支持。

## 主要功能

### 1. 单位转换器

- **长度单位转换**：支持毫米(mm)、厘米(cm)、米(m)、英寸(in)、英尺(ft)、码(yd)等单位之间的相互转换
- **重量单位转换**：支持毫克(mg)、克(g)、千克(kg)、盎司(oz)、磅(lb)、吨(ton)等单位之间的相互转换
- **直观的结果展示**：实时计算，清晰展示所有单位的转换结果

![图片描述](./public/单位转化器.png)

### 2. 货币转换器

- **多币种支持**：支持人民币(CNY)、美元(USD)、欧元(EUR)、英镑(GBP)等主要货币
- **实时汇率**：提供最新汇率数据，支持手动更新和定时自动更新
- **直观的转换展示**：显示详细的汇率和转换金额

![图片描述](./public/货币转化器.png)

### 3. 亚马逊 FBA 费用计算器

- **费用估算**：计算亚马逊平台销售的产品成本、佣金、仓储费等
- **多品类支持**：支持电子产品、服装、图书等不同品类的费用计算
- **盈利分析**：自动计算毛利润、利润率、投资回报率和建议售价

![图片描述](./public/FBA计算器.png)
![图片描述](./public/利润计算器.png)

### 4. 亚马逊内容分析器

- 帮助卖家分析产品描述和内容质量

![图片描述](./public/内容分析器.png)

## 技术栈

- **前端框架**：Next.js 15.2.4, React 19
- **UI 组件**：Radix UI 组件库, Tailwind CSS
- **状态管理**：React Hooks
- **国际化**：自定义语言上下文

## 开发环境配置

### 前置要求

- Node.js 18.x 或更高版本
- pnpm (推荐) 或 npm, yarn

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/Hanyeweiyang/unit-converter.git
cd unit-converter

# 使用pnpm安装依赖
pnpm install
```

### 开发命令

```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 代码检查
pnpm lint
```

## 部署信息

项目已部署在 Vercel 平台：

**[https://zjh-unit-converter.vercel.app/](https://zjh-unit-converter.vercel.app/)**

## 项目结构说明

- `/app` - Next.js 应用程序主目录
- `/components` - UI 组件和自定义组件
- `/contexts` - React 上下文，包括语言设置
- `/hooks` - 自定义 React 钩子
- `/services` - 后端服务接口，如汇率服务
- `/public` - 静态资源文件
- `/styles` - 全局样式定义

## 贡献指南

欢迎对项目提出改进建议或贡献代码。请遵循以下步骤：

1. Fork 项目仓库
2. 创建新的分支 (`git checkout -b feature/your-feature`)
3. 提交更改 (`git commit -m "Add your feature"`)
4. 推送到分支 (`git push origin feature/your-feature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证
