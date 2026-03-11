# IDEA Builder i18n System Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rewrite the internationalization system using declarative data-i18n attributes and fix critical JavaScript bugs.

**Architecture:** Use `data-i18n` attributes on HTML elements for declarative translation. A single `applyTranslations()` function handles all text, placeholder, and HTML content translations. Remove all inline event handlers in favor of addEventListener.

**Tech Stack:** Vanilla JavaScript, localStorage for language persistence

---

## Task 1: Fix patentTypes Syntax Error

**Files:**
- Modify: `index.html:1755-1759`

**Step 1: Fix the patentTypes object definition**

Find the broken `patentTypes` definition and replace with complete object:

```javascript
// Project Type Mapping
const patentTypes = {
  'invention': { name: 'Invention Project', class: 'tag-invention', icon: '💡' },
  'utility': { name: 'Utility Project', class: 'tag-utility', icon: '🔧' },
  'design': { name: 'Creative Design', class: 'tag-design', icon: '🎨' }
};
```

**Step 2: Verify JavaScript runs without errors**

Open `index.html` in browser, check console for errors.
Expected: No "Unexpected token" or syntax errors.

**Step 3: Commit**

```bash
git add index.html
git commit -m "fix: complete patentTypes object definition"
```

---

## Task 2: Create Complete Translation Data Structure

**Files:**
- Modify: `index.html:1478-1604`

**Step 1: Replace existing translations object with complete version**

Replace the entire `translations` object with:

```javascript
const translations = {
  zh: {
    // 导航
    navFeatures: '功能',
    navProjects: '项目',
    navProcess: '流程',
    navGithub: 'GitHub',

    // Hero 区域
    heroTitle: '让每一个灵机一动的想法都能变成真正可实现的东西',
    heroTitleHtml: '让每一个灵机一动的想法都能变成真正<span>可实现的东西</span>',
    heroDesc: 'AI 驱动的创意生成器，帮助你将创意想法快速转化为可实现的项目方案',
    exploreFeatures: '探索功能',
    viewDocs: '查看文档',

    // 功能卡片
    feature1Title: 'AI 提示词生成',
    feature1Desc: '智能分析你的想法，生成高质量的 AI 提示词，让 AI 更好地理解你的需求，提升交互效率',
    feature2Title: 'AI 项目生成',
    feature2Desc: '一键生成符合规范的项目方案，帮助你实现创意',
    feature3Title: 'AI 创意工具',
    feature3Desc: '更多创意工具持续更新，助力你的创新之旅，让每个想法都能得到专业的技术支持',

    // 项目区域
    myProjects: '我的项目',
    projectsDesc: '管理你的创意项目',
    emptyStateTitle: '还没有项目',
    emptyStateDesc: '点击"创建项目"开始你的创意之旅',
    createFirst: '✨ 创建第一个项目',

    // 流程步骤
    processTitle: '使用流程',
    processDesc: '简单的四步完成创意项目',
    step1: '输入你的想法',
    step2: 'AI 优化完善',
    step3: '生成项目方案',
    step4: '实现创意',

    // 创建项目表单
    createModalTitle: '✨ 创建新项目',
    projectName: '项目名称',
    projectNamePlaceholder: '例如：智能家居控制系统',
    techField: '技术领域',
    techFieldPlaceholder: '例如：物联网、人工智能、机械结构',
    projectType: '项目类型',
    selectType: '请选择项目类型',
    invention: '发明项目',
    utility: '实用项目',
    design: '创意设计',
    projectDesc: '项目描述',
    projectDescPlaceholder: '描述你的创意想法、技术方案等...',
    cancel: '取消',
    submit: '创建项目',

    // 项目详情
    detailModalTitle: '📄 项目详情',
    field: '技术领域',
    type: '项目类型',
    date: '创建日期',
    description: '项目描述',
    noDesc: '暂无描述',

    // 编辑项目
    editModalTitle: '✏️ 编辑项目',
    edit: '编辑',
    delete: '删除',
    save: '保存',
    confirmDelete: '确定要删除这个项目吗？此操作不可恢复。',

    // AI 生成
    aiModalTitle: '🤖 AI 生成',
    apiKeyNotice: '💡 配置你的 MiniMax API Key 以使用 AI 功能',
    apiKeySettings: '点击设置',
    apiKeyLabel: 'MiniMax API Key',
    apiKeyPlaceholder: '输入你的 MiniMax API Key',
    saveApiKey: '保存 API Key',
    promptGeneration: '提示词生成',
    promptGenDesc: '生成 AI 提示词',
    projectPlan: '项目计划',
    projectGenDesc: '生成完整项目',
    describeIdea: '描述你的想法',
    ideaPlaceholder: '例如：我想做一个智能家居系统，可以通过手机控制灯光、空调、窗帘',
    startGeneration: '🚀 开始生成',
    aiThinking: 'AI 正在思考...',
    generatedResult: '生成结果',
    copy: '📋 复制',
    saveToProject: '💾 保存到项目',

    // 键盘提示
    keyboardHint: '使用 Tab 键导航，Enter 键确认',

    // 提示信息
    notExist: '项目不存在',
    fillRequired: '请填写必填项',
    createSuccess: '项目创建成功！',
    createSuccessMsg: '现在你可以继续完善项目详情，或者生成项目方案。',
    editSuccess: '项目修改成功！',

    // Footer
    footerContact: '有问题或建议？联系我们',
    copyright: '© 2024 IDEA Builder. 基于 AI 的创意生成工具。'
  },
  en: {
    // Navigation
    navFeatures: 'Features',
    navProjects: 'Projects',
    navProcess: 'Process',
    navGithub: 'GitHub',

    // Hero Section
    heroTitle: 'Turn Every Great Idea Into Reality',
    heroTitleHtml: 'Turn Every <span>Great Idea</span> Into Reality',
    heroDesc: 'AI-powered idea generator that transforms your creative ideas into actionable project plans',
    exploreFeatures: 'Explore Features',
    viewDocs: 'View Docs',

    // Feature Cards
    feature1Title: 'AI Prompt Generation',
    feature1Desc: 'Intelligently analyze your ideas and generate high-quality AI prompts for better understanding',
    feature2Title: 'AI Project Generation',
    feature2Desc: 'Generate standardized project plans with one click to bring your ideas to life',
    feature3Title: 'AI Creative Tools',
    feature3Desc: 'Continuous updates of creative tools to support your innovation journey',

    // Projects Section
    myProjects: 'My Projects',
    projectsDesc: 'Manage your creative projects',
    emptyStateTitle: 'No Projects Yet',
    emptyStateDesc: 'Click "Create Project" to start your creative journey',
    createFirst: '✨ Create First Project',

    // Process Steps
    processTitle: 'How It Works',
    processDesc: 'Four simple steps to complete your creative project',
    step1: 'Input Your Idea',
    step2: 'AI Optimization',
    step3: 'Generate Plan',
    step4: 'Make It Real',

    // Create Project Form
    createModalTitle: '✨ Create New Project',
    projectName: 'Project Name',
    projectNamePlaceholder: 'e.g., Smart Home System',
    techField: 'Technology Field',
    techFieldPlaceholder: 'e.g., IoT, AI, Mechanical Design',
    projectType: 'Project Type',
    selectType: 'Select type',
    invention: 'Invention Project',
    utility: 'Utility Project',
    design: 'Creative Design',
    projectDesc: 'Description',
    projectDescPlaceholder: 'Describe your creative idea, technical solution...',
    cancel: 'Cancel',
    submit: 'Create Project',

    // Project Details
    detailModalTitle: '📄 Project Details',
    field: 'Field',
    type: 'Type',
    date: 'Created',
    description: 'Description',
    noDesc: 'No description',

    // Edit Project
    editModalTitle: '✏️ Edit Project',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    confirmDelete: 'Are you sure you want to delete this project? This cannot be undone.',

    // AI Generation
    aiModalTitle: '🤖 AI Generation',
    apiKeyNotice: '💡 Configure your MiniMax API Key to use AI features',
    apiKeySettings: 'Click to Settings',
    apiKeyLabel: 'MiniMax API Key',
    apiKeyPlaceholder: 'Enter your MiniMax API Key',
    saveApiKey: 'Save API Key',
    promptGeneration: 'Prompt Generation',
    promptGenDesc: 'Generate AI prompts',
    projectPlan: 'Project Plan',
    projectGenDesc: 'Generate complete project',
    describeIdea: 'Describe Your Idea',
    ideaPlaceholder: 'e.g., I want to build a smart home system that can control lights, AC, curtains via phone',
    startGeneration: '🚀 Start Generation',
    aiThinking: 'AI is thinking...',
    generatedResult: 'Generated Result',
    copy: '📋 Copy',
    saveToProject: '💾 Save to Project',

    // Keyboard Hint
    keyboardHint: 'Use Tab to navigate, Enter to confirm',

    // Messages
    notExist: 'Project not found',
    fillRequired: 'Please fill in required fields',
    createSuccess: 'Project created successfully!',
    createSuccessMsg: 'You can now continue to improve your project details.',
    editSuccess: 'Project updated successfully!',

    // Footer
    footerContact: 'Questions or suggestions? Contact Us',
    copyright: '© 2024 IDEA Builder. AI-powered Idea Generation Tool.'
  }
};
```

**Step 2: Verify translations object is valid JavaScript**

Open `index.html` in browser, check console.
Expected: No syntax errors.

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add complete translation data structure for zh and en"
```

---

## Task 3: Implement New applyTranslations Function

**Files:**
- Modify: `index.html:1616-1687`

**Step 1: Replace applyTranslations function with new implementation**

Replace the entire `applyTranslations` function with:

```javascript
// Translation Function
function t(key) {
  return translations[currentLang]?.[key] || key;
}

// Apply Translation using data-i18n attributes
function applyTranslations() {
  // 1. Handle text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });

  // 2. Handle placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });

  // 3. Handle HTML content (preserves <span> etc.)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });

  // 4. Update HTML lang attribute
  html.lang = currentLang;
  html.classList.toggle('en', currentLang === 'en');
}
```

**Step 2: Commit**

```bash
git add index.html
git commit -m "refactor: implement declarative data-i18n translation system"
```

---

## Task 4: Add data-i18n Attributes to Navigation

**Files:**
- Modify: `index.html:1159-1182`

**Step 1: Update navigation links with data-i18n attributes**

Replace the navigation section with:

```html
<div class="nav-links">
  <a href="#features" class="nav-link" data-i18n="navFeatures">Features</a>
  <a href="#projects" class="nav-link" data-i18n="navProjects">Projects</a>
  <a href="#process" class="nav-link" data-i18n="navProcess">Process</a>
  <a href="https://github.com/chaceli/idea-builder" target="_blank" class="nav-link" data-i18n="navGithub">GitHub</a>
</div>

<div class="nav-actions">
  <button class="lang-toggle" id="langToggle" aria-label="Switch Language" title="English/Chinese">
    <span class="lang-zh">中</span>
    <span class="lang-en">EN</span>
  </button>
  <button class="theme-toggle" id="themeToggle" aria-label="Switch Theme" title="Switch Light/Dark">
    <span class="icon-moon">🌙</span>
    <span class="icon-sun">☀️</span>
  </button>
  <button id="createProjectBtn" class="btn btn-primary" data-i18n="createProject">✨ Create Project</button>
  <a href="https://github.com/chaceli/idea-builder" target="_blank" class="btn btn-secondary" data-i18n="navGithub">GitHub</a>
</div>
```

**Step 2: Add createProject to translations (already done in Task 2)**

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add data-i18n attributes to navigation elements"
```

---

## Task 5: Add data-i18n Attributes to Hero Section

**Files:**
- Modify: `index.html:1188-1201`

**Step 1: Update Hero section with data-i18n attributes**

Replace the Hero section with:

```html
<section class="hero">
  <h1 class="hero-title" data-i18n-html="heroTitleHtml">
    Turn Every <span>Great Idea</span> Into Reality
  </h1>
  <p class="hero-desc" data-i18n="heroDesc">
    AI-powered idea generator that transforms your creative ideas into actionable project plans
  </p>
  <div class="hero-actions">
    <a href="#features" class="btn btn-primary btn-lg" data-i18n="exploreFeatures">Explore Features</a>
    <a href="https://github.com/chaceli/idea-builder" target="_blank" class="btn btn-secondary btn-lg" data-i18n="viewDocs">View Docs</a>
  </div>
</section>
```

**Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add data-i18n attributes to hero section"
```

---

## Task 6: Add data-i18n Attributes to Feature Cards

**Files:**
- Modify: `index.html:1204-1235`

**Step 1: Update Feature Cards section**

Replace the features section with:

```html
<section id="features" class="section">
  <div class="section-header">
    <h2 class="section-title" data-i18n="coreFeatures">Core Features</h2>
    <p class="section-desc" data-i18n="featuresDesc">Powerful AI tools to help you complete creative projects with ease</p>
  </div>

  <div class="features-grid">
    <article class="feature-card" tabindex="0" data-feature="ai">
      <div class="feature-icon">🎯</div>
      <h3 class="feature-title" data-i18n="feature1Title">AI Prompt Generation</h3>
      <p class="feature-desc" data-i18n="feature1Desc">Intelligently analyze your ideas and generate high-quality AI prompts for better understanding</p>
    </article>

    <article class="feature-card" tabindex="0" data-feature="ai">
      <div class="feature-icon">📔</div>
      <h3 class="feature-title" data-i18n="feature2Title">AI Project Generation</h3>
      <p class="feature-desc" data-i18n="feature2Desc">Generate standardized project plans with one click to bring your ideas to life</p>
    </article>

    <article class="feature-card" tabindex="0" data-feature="ai">
      <div class="feature-icon">✨</div>
      <h3 class="feature-title" data-i18n="feature3Title">AI Creative Tools</h3>
      <p class="feature-desc" data-i18n="feature3Desc">Continuous updates of creative tools to support your innovation journey</p>
    </article>
  </div>
</section>
```

**Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add data-i18n attributes to feature cards, remove inline onclick"
```

---

## Task 7: Add data-i18n Attributes to Projects Section

**Files:**
- Modify: `index.html:1237-1254`

**Step 1: Update Projects section**

Replace with:

```html
<section id="projects" class="section">
  <div class="section-header">
    <h2 class="section-title" data-i18n="myProjects">My Projects</h2>
    <p class="section-desc" data-i18n="projectsDesc">Manage your creative projects</p>
  </div>

  <div class="projects-grid" id="projectsGrid">
    <!-- Dynamic Load Projects -->
  </div>

  <div class="empty-state" id="emptyState" style="display: none;">
    <div class="empty-state-icon">📭</div>
    <h3 class="empty-state-title" data-i18n="emptyStateTitle">No projects yet</h3>
    <p class="empty-state-desc" data-i18n="emptyStateDesc">Click "Create Project" to start your creative journey</p>
    <button class="btn btn-primary" id="emptyCreateBtn" data-i18n="createFirst">✨ Create First Project</button>
  </div>
</section>
```

**Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add data-i18n attributes to projects section"
```

---

## Task 8: Add data-i18n Attributes to Process Steps

**Files:**
- Modify: `index.html:1257-1284`

**Step 1: Update Process section**

Replace with:

```html
<section id="process" class="section">
  <div class="section-header">
    <h2 class="section-title" data-i18n="processTitle">How It Works</h2>
    <p class="section-desc" data-i18n="processDesc">Four simple steps to complete your creative project</p>
  </div>

  <div class="process-steps">
    <div class="step" tabindex="0">
      <span class="step-num">1</span>
      <span class="step-text" data-i18n="step1">Input Your Idea</span>
    </div>
    <span class="step-arrow">→</span>
    <div class="step" tabindex="0">
      <span class="step-num">2</span>
      <span class="step-text" data-i18n="step2">AI Optimization</span>
    </div>
    <span class="step-arrow">→</span>
    <div class="step" tabindex="0">
      <span class="step-num">3</span>
      <span class="step-text" data-i18n="step3">Generate Project Plan</span>
    </div>
    <span class="step-arrow">→</span>
    <div class="step" tabindex="0">
      <span class="step-num">4</span>
      <span class="step-text" data-i18n="step4">Make It Real</span>
    </div>
  </div>
</section>
```

**Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add data-i18n attributes to process steps"
```

---

## Task 9: Update Footer with data-i18n

**Files:**
- Modify: `index.html:1288-1291`

**Step 1: Update Footer section**

Replace with:

```html
<footer class="footer">
  <p><span data-i18n="footerContact">Have questions or suggestions?</span> <a href="https://github.com/chaceli/idea-builder/issues" target="_blank" data-i18n="navGithub">GitHub</a></p>
  <p data-i18n="copyright">© 2024 IDEA Builder. AI-powered Idea Generation Tool.</p>
</footer>
```

**Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add data-i18n attributes to footer"
```

---

## Task 10: Update Create Project Modal

**Files:**
- Modify: `index.html:1294-1329`

**Step 1: Update Create Modal form**

Replace with:

```html
<div class="modal-overlay" id="createModal">
  <div class="modal" role="dialog" aria-labelledby="createModalTitle" aria-modal="true">
    <div class="modal-header">
      <h2 class="modal-title" id="createModalTitle" data-i18n="createModalTitle">✨ Create New Project</h2>
      <button class="modal-close" aria-label="Close">&times;</button>
    </div>
    <form id="createForm">
      <div class="form-group">
        <label class="form-label" for="projectName" data-i18n="projectName">Project Name *</label>
        <input type="text" class="form-input" id="projectName" name="name" required data-i18n-placeholder="projectNamePlaceholder" placeholder="e.g., Smart Home System">
      </div>
      <div class="form-group">
        <label class="form-label" for="projectField" data-i18n="techField">Technology Field *</label>
        <input type="text" class="form-input" id="projectField" name="field" required data-i18n-placeholder="techFieldPlaceholder" placeholder="e.g., IoT, AI, Mechanical Design">
      </div>
      <div class="form-group">
        <label class="form-label" for="projectType" data-i18n="projectType">Project Type *</label>
        <select class="form-input" id="projectType" name="type" required>
          <!-- Options rendered dynamically -->
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="projectDesc" data-i18n="projectDesc">Description</label>
        <textarea class="form-textarea" id="projectDesc" name="description" data-i18n-placeholder="projectDescPlaceholder" placeholder="Describe your creative idea..."></textarea>
      </div>
      <div class="modal-actions">
        <button type="button" class="btn btn-secondary modal-cancel-btn" data-i18n="cancel">Cancel</button>
        <button type="submit" class="btn btn-primary" data-i18n="submit">Create Project</button>
      </div>
    </form>
  </div>
</div>
```

**Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add data-i18n to create project modal, remove inline onclick"
```

---

## Task 11: Update Detail and Edit Modals

**Files:**
- Modify: `index.html:1331-1379`

**Step 1: Update Detail Modal**

Replace the detail modal header with:

```html
<div class="modal-overlay" id="detailModal">
  <div class="modal" role="dialog" aria-labelledby="detailModalTitle" aria-modal="true">
    <div class="modal-header">
      <h2 class="modal-title" id="detailModalTitle" data-i18n="detailModalTitle">📄 Project Details</h2>
      <button class="modal-close" aria-label="Close">&times;</button>
    </div>
    <div class="project-detail-content" id="detailContent">
      <!-- Dynamic Content -->
    </div>
  </div>
</div>
```

**Step 2: Update Edit Modal**

Replace the edit modal with:

```html
<div class="modal-overlay" id="editModal">
  <div class="modal" role="dialog" aria-labelledby="editModalTitle" aria-modal="true">
    <div class="modal-header">
      <h2 class="modal-title" id="editModalTitle" data-i18n="editModalTitle">✏️ Edit Project</h2>
      <button class="modal-close" aria-label="Close">&times;</button>
    </div>
    <form id="editForm">
      <input type="hidden" id="editProjectId" name="id">
      <div class="form-group">
        <label class="form-label" for="editProjectName" data-i18n="projectName">Project Name *</label>
        <input type="text" class="form-input" id="editProjectName" name="name" required>
      </div>
      <div class="form-group">
        <label class="form-label" for="editProjectField" data-i18n="techField">Technology Field *</label>
        <input type="text" class="form-input" id="editProjectField" name="field" required>
      </div>
      <div class="form-group">
        <label class="form-label" for="editProjectType" data-i18n="projectType">Project Type *</label>
        <select class="form-input" id="editProjectType" name="type" required>
          <!-- Options rendered dynamically -->
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="editProjectDesc" data-i18n="projectDesc">Description</label>
        <textarea class="form-textarea" id="editProjectDesc" name="description"></textarea>
      </div>
      <div class="modal-actions">
        <button type="button" class="btn btn-secondary modal-cancel-btn" data-i18n="cancel">Cancel</button>
        <button type="submit" class="btn btn-primary" data-i18n="save">Save Changes</button>
      </div>
    </form>
  </div>
</div>
```

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add data-i18n to detail and edit modals"
```

---

## Task 12: Update AI Generation Modal

**Files:**
- Modify: `index.html:1381-1450`

**Step 1: Update AI Modal with data-i18n**

Replace the AI modal with:

```html
<div class="modal-overlay" id="aiModal">
  <div class="modal" role="dialog" aria-labelledby="aiModalTitle" aria-modal="true" style="max-width: 560px;">
    <div class="modal-header">
      <h2 class="modal-title" id="aiModalTitle" data-i18n="aiModalTitle">🤖 AI Generation</h2>
      <button class="modal-close" aria-label="Close">&times;</button>
    </div>
    <div class="ai-modal-content">
      <!-- API Key Notice -->
      <div class="api-key-notice" id="apiKeyNotice">
        <span data-i18n="apiKeyNotice">💡 Configure your MiniMax API Key to use AI features</span>
        <a href="#" id="showApiKeySettings" data-i18n="apiKeySettings">Click to Settings</a>
      </div>

      <!-- API Key Settings -->
      <div id="apiKeySettings" style="display: none; margin-bottom: 20px;">
        <div class="form-group">
          <label class="form-label" for="miniMaxApiKey" data-i18n="apiKeyLabel">MiniMax API Key</label>
          <input type="password" class="form-input" id="miniMaxApiKey" data-i18n-placeholder="apiKeyPlaceholder" placeholder="Enter your MiniMax API Key">
        </div>
        <button type="button" class="btn btn-primary" id="saveApiKeyBtn" style="width: 100%;" data-i18n="saveApiKey">Save API Key</button>
      </div>

      <!-- Generation Type Selection -->
      <div class="ai-generation-type" id="generationType">
        <button type="button" class="ai-type-btn active" data-type="prompt">
          <div class="ai-type-btn-icon">🎯</div>
          <div class="ai-type-btn-text" data-i18n="promptGeneration">Prompt Generation</div>
          <div class="ai-type-btn-desc" data-i18n="promptGenDesc">Generate AI prompts</div>
        </button>
        <button type="button" class="ai-type-btn" data-type="project">
          <div class="ai-type-btn-icon">📔</div>
          <div class="ai-type-btn-text" data-i18n="projectPlan">Project Plan</div>
          <div class="ai-type-btn-desc" data-i18n="projectGenDesc">Generate complete project</div>
        </button>
      </div>

      <!-- Input Section -->
      <div class="form-group">
        <label class="form-label" for="aiIdeaInput" data-i18n="describeIdea">Describe Your Idea *</label>
        <textarea class="form-textarea" id="aiIdeaInput" data-i18n-placeholder="ideaPlaceholder" placeholder="e.g., I want to build a smart home system..."></textarea>
      </div>

      <!-- Generate Button -->
      <button type="button" class="btn btn-primary" id="generateBtn" style="width: 100%;" data-i18n="startGeneration">🚀 Start Generation</button>

      <!-- Loading Animation -->
      <div class="ai-loading" id="aiLoading" style="display: none;">
        <div class="ai-loading-spinner"></div>
        <div class="ai-loading-text" data-i18n="aiThinking">AI is thinking...</div>
      </div>

      <!-- AI Result -->
      <div class="ai-result" id="aiResult" style="display: none;">
        <div class="ai-result-header">
          <span class="ai-result-title" data-i18n="generatedResult">Generated Result</span>
          <button class="ai-result-copy" id="copyResultBtn" data-i18n="copy">📋 Copy</button>
        </div>
        <div class="ai-result-content" id="aiResultContent"></div>
      </div>

      <!-- Save to Project Button -->
      <button type="button" class="ai-save-btn" id="saveToProjectBtn" style="display: none;" data-i18n="saveToProject">💾 Save to Project</button>
    </div>
  </div>
</div>
```

**Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add data-i18n to AI generation modal"
```

---

## Task 13: Update Keyboard Hint

**Files:**
- Modify: `index.html:1452-1455`

**Step 1: Update keyboard hint**

Replace with:

```html
<div class="keyboard-hint" id="keyboardHint" data-i18n="keyboardHint">
  Use Tab to navigate, Enter to confirm
</div>
```

**Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add data-i18n to keyboard hint"
```

---

## Task 14: Refactor JavaScript Event Handlers

**Files:**
- Modify: `index.html:1904-1993`

**Step 1: Update modal close handlers**

Replace the modal close logic:

```javascript
// Open Create Project Modal
function openCreateModal() {
  document.getElementById('createForm').reset();
  renderSelectOptions('projectType');
  document.getElementById('createModal').classList.add('active');
}

// Close All Modals
function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.classList.remove('active');
  });
}

// Bind Create Project Button
const createBtn = document.getElementById('createProjectBtn');
if (createBtn) {
  createBtn.addEventListener('click', openCreateModal);
}

// Empty State Create Button
const emptyCreateBtn = document.getElementById('emptyCreateBtn');
if (emptyCreateBtn) {
  emptyCreateBtn.addEventListener('click', openCreateModal);
}

// Modal Close Buttons
document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', closeAllModals);
});

// Cancel Buttons
document.querySelectorAll('.modal-cancel-btn').forEach(btn => {
  btn.addEventListener('click', closeAllModals);
});

// Click Overlay to Close
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', function(e) {
    if (e.target === this) {
      closeAllModals();
    }
  });
});
```

**Step 2: Add select options renderer**

Add this function before `applyTranslations()`:

```javascript
// Render select options dynamically
function renderSelectOptions(selectId) {
  const select = document.getElementById(selectId);
  if (!select) return;

  select.innerHTML = `
    <option value="">${t('selectType')}</option>
    <option value="invention">${t('invention')}</option>
    <option value="utility">${t('utility')}</option>
    <option value="design">${t('design')}</option>
  `;
}
```

**Step 3: Commit**

```bash
git add index.html
git commit -m "refactor: remove inline event handlers, use addEventListener"
```

---

## Task 15: Update Feature Card Click Handler

**Files:**
- Modify: `index.html:2127-2133`

**Step 1: Update feature card click handler**

Replace the existing handler with:

```javascript
// Feature Card Click - Open AI Generate Modal
document.querySelectorAll('.feature-card[data-feature="ai"]').forEach(card => {
  card.addEventListener('click', () => {
    document.getElementById('aiModal').classList.add('active');
  });
});
```

**Step 2: Commit**

```bash
git add index.html
git commit -m "refactor: unify feature card click handler"
```

---

## Task 16: Update renderProjects Function

**Files:**
- Modify: `index.html:1778-1819`

**Step 1: Update renderProjects to use translation function**

Update the project type display:

```javascript
// Render Project List
function renderProjects() {
  const projects = getProjects();
  const grid = document.getElementById('projectsGrid');
  const emptyState = document.getElementById('emptyState');

  if (!projects || projects.length === 0) {
    grid.innerHTML = '';
    grid.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  grid.style.display = 'grid';
  emptyState.style.display = 'none';

  grid.innerHTML = projects.map((project, index) => {
    const typeInfo = patentTypes[project.type] || patentTypes['invention'];
    const icon = project.icon || projectIcons[index % projectIcons.length];

    return `
      <article class="project-card" data-index="${index % 8}" data-id="${project.id}" tabindex="0">
        <div class="project-cover">${icon}</div>
        <div class="project-info">
          <h3 class="project-name">${escapeHtml(project.name)}</h3>
          <p class="project-desc">${escapeHtml(project.description || t('noDesc'))}</p>
          <div class="project-meta">
            <span class="project-tag ${typeInfo.class}">${t(project.type)}</span>
            <span class="project-date">${project.date || ''}</span>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Bind Click Event
  grid.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.dataset.id;
      showProjectDetail(projectId);
    });
  });
}
```

**Step 2: Commit**

```bash
git add index.html
git commit -m "refactor: use t() function in renderProjects"
```

---

## Task 17: Final Verification and Testing

**Step 1: Open index.html in browser**

Test the following scenarios:

1. **Language Toggle**: Click the 中/EN button
   - Verify all text switches between Chinese and English
   - Verify Hero title keeps the `<span>` gradient styling

2. **Theme Toggle**: Click the 🌙/☀️ button
   - Verify dark/light mode switches correctly

3. **Create Project**: Click "Create Project" button
   - Modal opens
   - Form labels and placeholders are translated
   - Project type select options are translated

4. **Feature Cards**: Click any feature card
   - AI modal opens
   - All text is translated

5. **Console Check**: Open browser console
   - Verify no JavaScript errors

**Step 2: Final commit**

```bash
git add index.html
git commit -m "fix: final verification - all i18n and interaction issues resolved"
```

---

## Summary

This plan fixes:
1. ✅ `patentTypes` syntax error
2. ✅ Missing translations in both languages
3. ✅ Hardcoded Chinese text
4. ✅ Mixed language text
5. ✅ Spelling errors and missing spaces
6. ✅ Duplicate event bindings
7. ✅ Inline onclick handlers replaced with addEventListener
8. ✅ Hero title `<span>` styling preserved during translation