# 缺失翻译修复设计

## 概述

HTML 中使用了多个 `data-i18n` 属性引用翻译 key，但 `js/config.js` 中的 `translations` 对象缺少这些 key 的定义，导致中文界面下直接显示英文 key 名称（如 `createModalTitle`、`aiModalTitle` 等）。

## 问题根源

i18n.js 的 `t()` 方法在找不到翻译时会返回 key 本身：
```javascript
t(key) {
  return translations[this.currentLang]?.[key] || key;
}
```

当 key 不存在时，用户看到的是原始 key 名称。

## 缺失的 17 个翻译 Key

### 第一部分：弹窗标题（4个）

| Key | 中文 | 英文 |
|-----|------|------|
| `createModalTitle` | ✨ 创建新项目 | ✨ Create New Project |
| `editModalTitle` | ✏️ 编辑项目 | ✏️ Edit Project |
| `detailModalTitle` | 📋 项目详情 | 📋 Project Details |
| `aiModalTitle` | 🤖 AI 智能生成 | 🤖 AI Generation |

### 第二部分：表单和输入框（4个）

| Key | 中文 | 英文 |
|-----|------|------|
| `describeIdea` | 描述你的灵感想法 | Describe Your Spark of Inspiration |
| `ideaPlaceholder` | 输入你的灵感想法，AI 将帮你优化... | Enter your spark of inspiration, AI will help refine it... |
| `apiKeyPlaceholder` | 请输入您的 API Key | Enter your API Key |
| `apiKeyLabel` | API Key | API Key |

### 第三部分：操作按钮和状态（5个）

| Key | 中文 | 英文 |
|-----|------|------|
| `copy` | 复制 | Copy |
| `submit` | 提交 | Submit |
| `startGeneration` | 开始生成 | Start Generation |
| `aiThinking` | AI 正在思考中... | AI is thinking... |
| `generatedResult` | 生成结果 | Generated Result |

### 第四部分：提示信息（4个）

| Key | 中文 | 英文 |
|-----|------|------|
| `keyboardHint` | 按 Enter 发送，Shift+Enter 换行 | Press Enter to send, Shift+Enter for new line |
| `copyright` | © 2026 IDEA Builder. 基于 AI 的创意孵化工具 | © 2026 IDEA Builder. AI-powered Creative Incubator |
| `promptGenDesc` | 生成高质量的提示词模板，可用于其他 AI 平台 | Generate high-quality prompt templates for other AI platforms |
| `projectGenDesc` | 生成完整的项目蓝图，包含详细的执行方案 | Generate complete project blueprints with detailed execution plans |

## 实施范围

**修改文件：** `js/config.js`

**变更位置：**
- `translations.zh` 对象：添加 17 个中文翻译
- `translations.en` 对象：添加 17 个英文翻译

## 设计批准

设计日期：2026-03-12
批准状态：✅ 已批准