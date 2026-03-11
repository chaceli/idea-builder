# 💡 IDEA Builder - AI 创意平台

> 每个人的 AI 创意伙伴

## 🚀 愿景

让每个人都能轻松实现自己的创意！

## 🎯 核心功能

### 1. AI 陪伴助手 ✨ (新增)
- **情感陪伴** - 有灵魂的 AI 伙伴，会记住你的喜好
- **多模型支持** - MiniMax / OpenAI / Claude / Gemini 自由切换
- **自定义 AI** - 支持配置自己的 API Key
- **日程提醒** - AI 贴心提醒你的重要事项
- **记忆系统** - 跨对话记住你的故事

### 2. AI 专利生成器
- **专利构思** - 输入领域，AI 自动生成专利想法
- **专利撰写** - 自动生成专利申请书、权利要求书
- **专利查重** - 检测相似专利
- **专利优化** - 提升专利质量和通过率

## 🏗️ 技术架构

### 前端 (Vue 3)
- Vue 3 + TypeScript + Vite
- Pinia 状态管理
- Vue Router

### 后端 (Node.js)
- Express + Koa
- MySQL + Redis
- 多模型 AI 支持 (MiniMax/OpenAI/Claude/Gemini)

## 📱 页面结构

### AI 陪伴助手
- `/companion/chat` - 与 AI 聊天
- `/companion/schedule` - 日程提醒
- `/companion/profile` - 个人中心（模型选择）

### 专利生成器
- `/` - 首页
- `/generate` - AI 专利生成
- `/patents` - 我的专利
- `/patent/:id` - 专利详情
- `/settings` - 设置

## 🤖 AI 模型支持

| 模型 | 提供商 | 状态 |
|------|--------|------|
| MiniMax M2.5 | MiniMax | ✅ 默认 |
| GPT-4o | OpenAI | ✅ |
| GPT-4o Mini | OpenAI | ✅ |
| Claude 3.5 Sonnet | Anthropic | ✅ |
| Gemini 1.5 Pro | Google | ✅ |

## 🚀 快速开始

```bash
# 安装依赖
cd frontend && npm install
cd ../backend && npm install

# 启动开发服务器
# 前端
cd frontend && npm run dev

# 后端
cd backend && npm run dev
```

## 📦 部署

支持 Docker 部署：

```bash
cd backend
docker-compose up -d
```

## 🤝 贡献

欢迎提交 Pull Request！

## 📄 许可证

MIT License

---

**让创意触手可及！** 💡✨

*Built with ❤️ by Team IDEA Builder*
