# Translation Improvement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Update all Chinese and English translations in config.js to match the approved design document.

**Architecture:** Single-file modification to the `translations` object in `js/config.js`. No structural changes, only string updates.

**Tech Stack:** JavaScript ES modules, no external dependencies

---

## Task 1: Update Core Terminology

**Files:**
- Modify: `js/config.js:14-18` (PROJECT_TYPES)
- Modify: `js/config.js:122-215` (translations.en)

**Step 1: Update PROJECT_TYPES English names**

Change lines 14-18:

```javascript
export const PROJECT_TYPES = {
  invention: { name: 'Invention Patent', class: 'tag-invention', icon: '💡' },
  utility: { name: 'Utility Model', class: 'tag-utility', icon: '🔧' },
  design: { name: 'Design Patent', class: 'tag-design', icon: '🎨' }
};
```

**Step 2: Verify file loads without errors**

Run: `node --check js/config.js`
Expected: No output (success)

**Step 3: Commit**

```bash
git add js/config.js
git commit -m "feat: update project types to professional patent terminology"
```

---

## Task 2: Update Chinese Translations (zh)

**Files:**
- Modify: `js/config.js:27-120` (translations.zh)

**Step 1: Update Hero section**

Replace lines 35-38:

```javascript
    // Hero
    heroTitleHtml: '让每一个<span>灵感火花</span>，都变成现实',
    heroDesc: 'AI 驱动的创意孵化器，帮你把灵感变成专利、蓝图或提示词',
    exploreFeatures: '探索功能',
    viewDocs: '查看文档',
```

**Step 2: Update Features section**

Replace lines 41-48:

```javascript
    // Features
    coreFeatures: '核心功能',
    featuresDesc: '强大的 AI 工具助你轻松完成创意项目',
    feature1Title: 'AI 提示词生成',
    feature1Desc: '智能分析你的想法，生成高质量的提示词模板，可在其他AI平台生成图片、视频等',
    feature2Title: 'AI 蓝图生成',
    feature2Desc: '一键生成完整的项目蓝图，帮你把创意想法转化为可落地的执行方案',
    feature3Title: 'AI 专利生成',
    feature3Desc: '专业专利文档生成，支持发明专利、实用新型、外观设计三种类型',
```

**Step 3: Update Process section**

Replace lines 59-64:

```javascript
    // Process
    processTitle: '使用流程',
    processDesc: '简单四步，让灵感变成现实',
    step1: '输入你的灵感',
    step2: 'AI 优化完善',
    step3: '生成成果',
    step4: '付诸实践',
```

**Step 4: Update Form section**

Replace lines 68-76:

```javascript
    techField: '技术领域',
    techFieldPlaceholder: '请输入技术领域',
    projectType: '项目类型',
    selectType: '请选择项目类型',
    invention: '发明专利',
    utility: '实用新型',
    design: '外观设计',
```

**Step 5: Update AI Modal section**

Replace lines 92-99:

```javascript
    // AI Modal
    aiGeneration: 'AI 智能生成',
    promptGeneration: '提示词生成',
    projectPlan: '蓝图生成',
    aiIdeaPlaceholder: '输入你的灵感想法，AI 将帮你优化...',
    generatePrompt: '生成提示词',
    generatePlan: '生成蓝图',
    generating: '生成中...',
```

**Step 6: Update Footer section**

Replace line 107:

```javascript
    footerCopyright: '© 2026 IDEA Builder. 基于 AI 的创意孵化工具',
```

**Step 7: Verify file syntax**

Run: `node --check js/config.js`
Expected: No output (success)

**Step 8: Commit**

```bash
git add js/config.js
git commit -m "feat: update Chinese translations for core terminology"
```

---

## Task 3: Update English Translations (en)

**Files:**
- Modify: `js/config.js:122-215` (translations.en)

**Step 1: Update Hero section**

Replace lines 130-133:

```javascript
    // Hero
    heroTitleHtml: 'Turn Every <span>Spark of Inspiration</span> Into Reality',
    heroDesc: 'AI-powered creative incubator that transforms your spark into patents, blueprints, or prompt templates',
    exploreFeatures: 'Explore Features',
    viewDocs: 'View Docs',
```

**Step 2: Update Features section**

Replace lines 136-143:

```javascript
    // Features
    coreFeatures: 'Core Features',
    featuresDesc: 'Powerful AI tools to help you complete creative projects with ease',
    feature1Title: 'AI Prompt Template Generator',
    feature1Desc: 'Intelligently analyze your ideas and generate high-quality prompt templates for images, videos, and more on other AI platforms',
    feature2Title: 'AI Blueprint Generator',
    feature2Desc: 'Generate complete project blueprints with one click, transforming creative ideas into actionable plans',
    feature3Title: 'AI Patent Generator',
    feature3Desc: 'Professional patent document generation supporting Invention Patents, Utility Models, and Design Patents',
```

**Step 3: Update Projects section**

Replace lines 148-151:

```javascript
    emptyStateTitle: 'No Projects Yet',
    emptyStateDesc: 'Click "Create Project" to start your inspiration journey',
    createFirst: '✨ Create First Project',
    noDesc: 'No description',
```

**Step 4: Update Process section**

Replace lines 154-159:

```javascript
    // Process
    processTitle: 'How It Works',
    processDesc: 'Four simple steps to bring your spark to reality',
    step1: 'Input Your Spark',
    step2: 'AI Refinement',
    step3: 'Generate Output',
    step4: 'Make It Real',
```

**Step 5: Update Form section**

Replace lines 165-171:

```javascript
    techField: 'Technical Field',
    techFieldPlaceholder: 'Enter technical field',
    projectType: 'Project Type',
    selectType: 'Select Project Type',
    invention: 'Invention Patent',
    utility: 'Utility Model',
    design: 'Design Patent',
```

**Step 6: Update AI Modal section**

Replace lines 187-194:

```javascript
    // AI Modal
    aiGeneration: 'AI Generation',
    promptGeneration: 'Generate Prompt Template',
    projectPlan: 'Generate Blueprint',
    aiIdeaPlaceholder: 'Enter your spark of inspiration, AI will help refine it...',
    generatePrompt: 'Generate Prompt Template',
    generatePlan: 'Generate Blueprint',
    generating: 'Generating...',
```

**Step 7: Update Footer section**

Replace line 202:

```javascript
    footerCopyright: '© 2026 IDEA Builder. AI-powered Creative Incubator',
```

**Step 8: Verify file syntax**

Run: `node --check js/config.js`
Expected: No output (success)

**Step 9: Commit**

```bash
git add js/config.js
git commit -m "feat: update English translations for core terminology"
```

---

## Task 4: Update HTML Slogan (if needed)

**Files:**
- Modify: `index.html:44-46`

**Step 1: Check if HTML has hardcoded slogan**

Run: `grep -n "Turn Every" index.html`

If found, update the hero section in index.html to match the new slogan.

**Step 2: Commit if changed**

```bash
git add index.html
git commit -m "feat: update hero slogan in HTML"
```

---

## Task 5: Visual Verification

**Files:**
- Test: Browser at `http://localhost:3001/`

**Step 1: Start local server**

Run: `npx serve -l 3001 &`

**Step 2: Open browser and test**

1. Verify Chinese translations display correctly
2. Switch to English using language toggle
3. Verify English translations display correctly
4. Check hero slogan shows "Turn Every Spark of Inspiration Into Reality"
5. Check project types show patent terminology

**Step 3: Take screenshot for documentation**

Save screenshots of both language versions.

---

## Task 6: Final Commit and Push

**Step 1: Review all changes**

Run: `git log --oneline -5`

**Step 2: Push to remote**

```bash
git push origin master
```

---

## Summary

| Task | Description | Files Changed |
|------|-------------|---------------|
| 1 | Update PROJECT_TYPES | js/config.js |
| 2 | Update Chinese translations | js/config.js |
| 3 | Update English translations | js/config.js |
| 4 | Update HTML slogan | index.html (optional) |
| 5 | Visual verification | None |
| 6 | Final commit and push | All |

**Total estimated time:** 20-30 minutes