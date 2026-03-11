# 多模型支持功能 - 任务清单

## 任务状态：🔄 进行中

---

## 阶段一：后端 AI 适配器架构

### 1.1 创建 AI 适配器接口
- [x] 创建 `src/backend/src/ai/adapters/IAdapter.ts` - 适配器接口定义
- [x] 创建 `src/backend/src/ai/adapters/MiniMaxAdapter.ts` - MiniMax 实现
- [x] 创建 `src/backend/src/ai/adapters/OpenAIAdapter.ts` - OpenAI 实现
- [x] 创建 `src/backend/src/ai/adapters/ClaudeAdapter.ts` - Claude 实现
- [x] 创建 `src/backend/src/ai/adapters/GeminiAdapter.ts` - Gemini 实现
- [x] 创建 `src/backend/src/ai/adapters/index.ts` - 统一导出

### 1.2 修改 AIService
- [x] 重构 `AIService.ts` 使用适配器模式
- [x] 添加用户模型配置支持
- [x] 更新配置表/字段支持多模型

### 1.3 用户配置 API
- [x] 添加用户 AI 配置模型 (UserAIConfig) - 已扩展 User 模型
- [x] 创建用户配置 CRUD 接口

---

## 阶段二：前端模型选择

### 2.1 模型选择组件
- [ ] 创建 `src/frontend/src/components/ModelSelector.vue`
- [ ] 添加模型列表配置

### 2.2 设置页面
- [ ] 在个人中心添加"AI 模型设置"入口
- [ ] 创建模型配置页面
- [ ] 支持用户输入自己的 API Key

### 2.3 API 对接
- [ ] 前端 API 添加模型配置接口
- [ ] 聊天时传递选择的模型

---

## 阶段三：测试验证

### 3.1 功能测试
- [ ] MiniMax 聊天测试
- [ ] OpenAI 聊天测试
- [ ] Claude 聊天测试
- [ ] Gemini 聊天测试

### 3.2 体验优化
- [ ] 模型切换无感刷新
- [ ] API Key 安全存储

---

## 支持的模型列表

| 提供商 | 模型 | 状态 | 备注 |
|--------|------|------|------|
| MiniMax | MiniMax-M2.5 | ✅ 已有 | 默认 |
| OpenAI | gpt-4o | 🔄 待添加 | |
| OpenAI | gpt-4o-mini | 🔄 待添加 | 免费额度多 |
| Anthropic | claude-sonnet-3.5 | 🔄 待添加 | |
| Google | gemini-1.5-pro | 🔄 待添加 | |

---

## 技术要点

1. **适配器模式**：每个模型独立实现，统一接口
2. **用户配置**：每个用户可配置自己的 API Key
3. **兼容性**：保持向后兼容，现有用户无感知
4. **安全性**：API Key 只存后端，不暴露
