# Missing Translations Fix Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add 17 missing translation keys to config.js to fix Chinese interface showing raw key names.

**Architecture:** Single-file modification to the `translations` object in `js/config.js`. Add missing keys to both `zh` and `en` sections.

**Tech Stack:** JavaScript ES modules

---

## Task 1: Add Missing Translations to Chinese (zh) Section

**Files:**
- Modify: `js/config.js` (translations.zh section)

**Step 1: Add modal title translations**

After the `createProject` line, add:

```javascript
    createModalTitle: '✨ 创建新项目',
    editModalTitle: '✏️ 编辑项目',
    detailModalTitle: '📋 项目详情',
    aiModalTitle: '🤖 AI 智能生成',
```

**Step 2: Add form and input translations**

Add after the `projectDescPlaceholder` line:

```javascript
    describeIdea: '描述你的灵感想法',
    ideaPlaceholder: '输入你的灵感想法，AI 将帮你优化...',
    apiKeyPlaceholder: '请输入您的 API Key',
    apiKeyLabel: 'API Key',
```

**Step 3: Add button and status translations**

Add after the `generating` line:

```javascript
    copy: '复制',
    submit: '提交',
    startGeneration: '开始生成',
    aiThinking: 'AI 正在思考中...',
    generatedResult: '生成结果',
```

**Step 4: Add hint translations**

Add after the `footerCopyright` line:

```javascript
    keyboardHint: '按 Enter 发送，Shift+Enter 换行',
    copyright: '© 2026 IDEA Builder. 基于 AI 的创意孵化工具',
    promptGenDesc: '生成高质量的提示词模板，可用于其他 AI 平台',
    projectGenDesc: '生成完整的项目蓝图，包含详细的执行方案',
```

**Step 5: Verify syntax**

Run: `node --check js/config.js`
Expected: No output (success)

**Step 6: Commit**

```bash
git add js/config.js
git commit -m "fix: add missing Chinese translations for modal titles and form labels"
```

---

## Task 2: Add Missing Translations to English (en) Section

**Files:**
- Modify: `js/config.js` (translations.en section)

**Step 1: Add modal title translations**

After the `createProject` line, add:

```javascript
    createModalTitle: '✨ Create New Project',
    editModalTitle: '✏️ Edit Project',
    detailModalTitle: '📋 Project Details',
    aiModalTitle: '🤖 AI Generation',
```

**Step 2: Add form and input translations**

Add after the `projectDescPlaceholder` line:

```javascript
    describeIdea: 'Describe Your Spark of Inspiration',
    ideaPlaceholder: 'Enter your spark of inspiration, AI will help refine it...',
    apiKeyPlaceholder: 'Enter your API Key',
    apiKeyLabel: 'API Key',
```

**Step 3: Add button and status translations**

Add after the `generating` line:

```javascript
    copy: 'Copy',
    submit: 'Submit',
    startGeneration: 'Start Generation',
    aiThinking: 'AI is thinking...',
    generatedResult: 'Generated Result',
```

**Step 4: Add hint translations**

Add after the `footerCopyright` line:

```javascript
    keyboardHint: 'Press Enter to send, Shift+Enter for new line',
    copyright: '© 2026 IDEA Builder. AI-powered Creative Incubator',
    promptGenDesc: 'Generate high-quality prompt templates for other AI platforms',
    projectGenDesc: 'Generate complete project blueprints with detailed execution plans',
```

**Step 5: Verify syntax**

Run: `node --check js/config.js`
Expected: No output (success)

**Step 6: Commit**

```bash
git add js/config.js
git commit -m "fix: add missing English translations for modal titles and form labels"
```

---

## Task 3: Visual Verification

**Files:**
- Test: Browser at `http://localhost:3001/`

**Step 1: Start local server**

Run: `npx serve -l 3001 &`

**Step 2: Test Chinese interface**

1. Open browser and switch to Chinese
2. Click "创建项目" - verify modal title shows "✨ 创建新项目"
3. Click on a project card - verify modal title shows "📋 项目详情"
4. Click "编辑" - verify modal title shows "✏️ 编辑项目"
5. Open AI modal - verify title shows "🤖 AI 智能生成"

**Step 3: Test English interface**

1. Switch to English
2. Verify all modal titles display correctly in English

---

## Task 4: Push to Remote

**Step 1: Review commits**

Run: `git log --oneline -5`

**Step 2: Push**

```bash
git push origin master
```

---

## Summary

| Task | Description | Files Changed |
|------|-------------|---------------|
| 1 | Add Chinese translations | js/config.js |
| 2 | Add English translations | js/config.js |
| 3 | Visual verification | None |
| 4 | Push to remote | All |

**Total estimated time:** 10-15 minutes