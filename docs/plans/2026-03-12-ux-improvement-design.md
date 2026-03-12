# 用户体验改进设计

## 概述

从用户视角发现多个体验问题，通过添加 Demo 模式、Toast 组件、功能区分和表单优化，全面提升用户体验。

## 发现的问题

### 🔴 严重问题
1. AI 功能需要 API Key 但没有引导用户获取
2. 三个功能卡片点击后打开同一个弹窗，功能未区分

### 🟡 中等问题
3. 提示信息使用原生 alert()，体验差
4. 没有实际生成功能演示，用户无法试用
5. 表单验证提示不够明确

---

## 解决方案

### 第一部分：Demo 模式

**目的：** 让用户无需配置 API Key 即可体验 AI 生成功能。

**实现方式：**

| 组件 | 描述 |
|------|------|
| **Demo Banner** | 在 AI 弹窗顶部显示 "🎯 Demo Mode" 横幅 |
| **模拟响应** | 根据输入内容返回预设的示例输出 |
| **切换提示** | 底部显示 "配置 API Key 以使用真实 AI" 链接 |

**Demo 响应内容：**

```javascript
// 提示词生成 Demo 响应
const demoPromptTemplate = `
## 提示词模板：[用户输入的创意名称]

### 英文提示词
A [product type] featuring [key features], [style], [mood], high quality, detailed...

### 中文提示词
一个[产品类型]，具有[核心特点]，[风格]，[氛围]，高质量，细节丰富...

### 使用建议
1. 可调整风格关键词
2. 添加具体场景描述
3. 指定输出格式要求
`;

// 蓝图生成 Demo 响应
const demoBlueprint = `
## 项目蓝图：[用户输入的创意名称]

### 第一阶段：概念验证 (1-2周)
- 市场调研
- 技术可行性分析
- 原型设计

### 第二阶段：产品开发 (4-6周)
- 核心功能开发
- UI/UX 设计
- 测试与迭代

### 第三阶段：市场推广 (2-3周)
- 营销材料准备
- 渠道建设
- 用户反馈收集
`;

// 专利生成 Demo 响应
const demoPatent = `
## 专利申请书框架

### 技术领域
[根据用户输入自动填充]

### 背景技术
现有技术的不足之处...

### 发明内容
本发明解决了...

### 权利要求书
1. 一种[产品名称]，其特征在于...
2. 根据权利要求1所述的[产品名称]，其特征在于...

### 说明书摘要
本发明公开了一种...
`;
```

---

### 第二部分：Toast 通知组件

**设计规格：**

| 属性 | 值 |
|------|------|
| **位置** | 页面顶部居中，fixed 定位 |
| **类型** | success / error / warning / info |
| **动画** | 从顶部滑入，3秒后自动消失 |
| **样式** | 带图标、圆角 8px、阴影 |

**CSS 样式：**

```css
.toast-container {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toast {
  padding: 12px 24px;
  border-radius: 8px;
  background: var(--bg-card);
  box-shadow: var(--shadow-lg);
  animation: slideIn 0.3s ease;
}

.toast.success { border-left: 4px solid #10B981; }
.toast.error { border-left: 4px solid #EF4444; }
.toast.warning { border-left: 4px solid #F59E0B; }
.toast.info { border-left: 4px solid #3B82F6; }
```

**替换场景：**

| 场景 | 类型 | 消息 |
|------|------|------|
| 项目创建成功 | success | "✅ 项目创建成功！" |
| 项目编辑成功 | success | "✅ 项目已更新！" |
| 项目删除成功 | success | "✅ 项目已删除" |
| 表单验证失败 | error | "❌ 请填写必填字段" |
| API Key 保存 | success | "✅ API Key 已保存" |

---

### 第三部分：功能区分

**当前问题：** 三个功能卡片点击后都打开同一个 AI 弹窗。

**解决方案：** 添加标签切换，卡片点击时自动选中对应标签。

**AI 弹窗结构：**

```
┌─────────────────────────────────┐
│ 🤖 AI 智能生成              ×  │
├─────────────────────────────────┤
│ [🎯 提示词] [📔 蓝图] [✨ 专利]  │  ← 标签切换
├─────────────────────────────────┤
│ 🎯 Demo 模式                    │  ← Demo 横幅
│ 此为演示输出，配置 API Key...   │
├─────────────────────────────────┤
│ 描述你的灵感想法...              │
│ ┌─────────────────────────────┐│
│ │                             ││
│ └─────────────────────────────┘│
│                                 │
│ [🎯 开始生成]                   │
└─────────────────────────────────┘
```

**标签切换逻辑：**

```javascript
// UI.bindFeatureCards() 修改
bindFeatureCards() {
  document.querySelectorAll('.feature-card[data-feature="ai"]').forEach((card, index) => {
    card.addEventListener('click', () => {
      // index 0 → 提示词, index 1 → 蓝图, index 2 → 专利
      this.openAIModal(index);
    });
  });
}

openAIModal(tabIndex = 0) {
  this.openModal('aiModal');
  this.switchAITab(tabIndex);
}
```

---

### 第四部分：表单优化

**必填字段标记：**

| 字段 | 必填 | 标签显示 |
|------|------|----------|
| 项目名称 | ✅ | `项目名称 *` |
| 技术领域 | ✅ | `技术领域 *` |
| 项目类型 | ✅ | `项目类型 *` |
| 项目描述 | ❌ | `项目描述` (可选) |

**CSS 样式：**

```css
.form-label .required {
  color: #EF4444;
  margin-left: 2px;
}

.form-group.error .form-input {
  border-color: #EF4444;
}

.form-group .error-message {
  color: #EF4444;
  font-size: 12px;
  margin-top: 4px;
  display: none;
}

.form-group.error .error-message {
  display: block;
}
```

**内联验证：**

```javascript
validateField(input) {
  const group = input.closest('.form-group');
  const isRequired = input.hasAttribute('required');
  const isEmpty = !input.value.trim();

  if (isRequired && isEmpty) {
    group.classList.add('error');
    return false;
  } else {
    group.classList.remove('error');
    return true;
  }
}
```

---

## 涉及文件

| 文件 | 改动 |
|------|------|
| `css/styles.css` | 添加 Toast 样式、标签切换样式、表单验证样式 |
| `js/ui.js` | 添加 Toast 组件、内联验证、标签切换 |
| `js/ai.js` | 添加 Demo 模式、模拟响应 |
| `index.html` | 添加 Toast 容器、必填标记、标签切换 HTML |

---

## 实施优先级

1. **Toast 组件** - 改善所有交互反馈
2. **Demo 模式** - 核心功能可用性
3. **功能区分** - 产品定位清晰
4. **表单优化** - 提升表单体验

---

## 设计批准

设计日期：2026-03-12
批准状态：✅ 已批准