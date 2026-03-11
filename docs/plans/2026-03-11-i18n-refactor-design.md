# IDEA Builder i18n 系统重构设计

日期：2026-03-11

## 问题概述

在代码审查中发现以下问题：

### 关键问题

1. **语法错误**: `patentTypes` 对象定义不完整，缺少闭合括号和其他类型定义
2. **重复事件绑定**: `createProjectBtn` 同时使用内联 `onclick` 和 `addEventListener`
3. **重复点击处理**: Feature cards 同时有内联和 JavaScript 赋值的点击事件

### 国际化问题

1. 硬编码中文文本未使用翻译函数
2. 翻译键在英文版本中缺失
3. 混合语言文本（中英文混杂）
4. 拼写错误和缺失空格
5. Hero Title 翻译时丢失 `<span>` 样式

## 设计方案

### 核心架构：声明式 i18n 标记

使用 `data-i18n` 属性标记所有需要翻译的元素：

```html
<h1 class="hero-title" data-i18n="heroTitle">Turn Every Great Idea Into Reality</h1>
<input type="text" data-i18n-placeholder="projectNamePlaceholder" placeholder="...">
```

### 翻译函数

```javascript
function applyTranslations() {
  // 处理文本内容
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });

  // 处理占位符
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });

  // 处理带 HTML 的内容
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
}
```

### 翻译数据结构

按功能区域组织，确保每个键在中英文中都有对应值：

- 导航区域: `navFeatures`, `navProjects`, `navProcess`, `navGithub`
- Hero 区域: `heroTitle`, `heroDesc`, `exploreFeatures`, `viewDocs`
- 功能卡片: `feature1Title`, `feature1Desc`, ...
- 项目区域: `myProjects`, `emptyStateTitle`, `emptyStateDesc`, ...
- 表单: `projectName`, `techField`, `projectType`, ...
- AI Modal: `aiGeneration`, `promptGeneration`, `projectPlan`, ...
- 操作按钮: `create`, `edit`, `delete`, `cancel`, `save`, `copy`
- 提示信息: `confirmDelete`, `createSuccess`, `editSuccess`

### HTML 标记改动

1. 所有导航链接添加 `data-i18n`
2. Hero Title 使用 `data-i18n-html` 保留 `<span>` 样式
3. 表单输入框使用 `data-i18n-placeholder`
4. Select 选项由 JavaScript 动态渲染

### 关键问题修复

1. **patentTypes 补全**:
```javascript
const patentTypes = {
  'invention': { name: 'Invention Project', class: 'tag-invention', icon: '💡' },
  'utility': { name: 'Utility Project', class: 'tag-utility', icon: '🔧' },
  'design': { name: 'Creative Design', class: 'tag-design', icon: '🎨' }
};
```

2. **移除内联事件，统一使用 addEventListener**

3. **修正拼写错误**:
   - `InputYour` → `Input your`
   - `Saveto Project` → `Save to Project`

## 实现步骤

1. 定义完整的翻译数据结构
2. 实现新的 `applyTranslations()` 函数
3. 为所有需要翻译的元素添加 `data-i18n` 属性
4. 移除所有内联事件处理
5. 修复 `patentTypes` 语法错误
6. 测试中英文切换功能

## 预期结果

- 无 JavaScript 语法错误
- 中英文切换完全正常
- 所有文本正确翻译
- 事件处理无重复绑定
- 代码结构清晰易维护