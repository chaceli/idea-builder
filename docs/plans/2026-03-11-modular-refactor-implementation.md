# IDEA Builder 模块化重构实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将单文件 HTML 重构为 ES Modules 模块化结构，修复 Safari 主题切换、硬编码文本等问题。

**Architecture:** 提取 CSS 到独立文件，JS 按功能拆分为 8 个模块（config、storage、theme、i18n、projects、ai、ui、main），使用 ES modules 导入导出。

**Tech Stack:** HTML5, CSS3 (CSS Variables), JavaScript ES Modules, localStorage, Fetch API

---

## Task 1: 创建目录结构

**Files:**
- Create: `css/` (directory)
- Create: `js/` (directory)
- Create: `assets/` (directory)

**Step 1: 创建目录**

Run: `mkdir -p css js assets`

Expected: 三个目录创建成功

**Step 2: 验证目录**

Run: `ls -la`

Expected: 看到 `css/`, `js/`, `assets/` 目录

**Step 3: Commit**

```bash
git add .
git commit -m "chore: create directory structure for modular refactor"
```

---

## Task 2: 提取 CSS 到独立文件

**Files:**
- Create: `css/styles.css`
- Modify: `index.html` (移除 `<style>` 标签)

**Step 1: 创建 CSS 文件**

从 `index.html` 中提取所有 `<style>` 标签内的内容到 `css/styles.css`，并在文件开头添加 Safari 兼容性修复：

```css
/* Safari 主题兼容：双写选择器 */
.dark,
[data-theme="dark"] {
  --bg: #0F172A;
  --bg-card: #1E293B;
  --bg-nav: rgba(30, 41, 59, 0.95);
  --text: #F1F5F9;
  --text-secondary: #CBD5E1;
  --text-muted: #64748B;
  --border: #334155;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
}
```

确保在现有的 `.dark` 规则后添加 `[data-theme="dark"]` 选择器。

**Step 2: 更新 index.html**

移除 `<style>...</style>` 标签，替换为：

```html
<link rel="stylesheet" href="css/styles.css">
```

**Step 3: 本地测试**

Run: `python3 -m http.server 8080`

Open: `http://localhost:8080`

Expected: 页面样式正常显示

**Step 4: Commit**

```bash
git add css/styles.css index.html
git commit -m "refactor: extract CSS to separate file with Safari theme fix"
```

---

## Task 3: 创建配置模块

**Files:**
- Create: `js/config.js`

**Step 1: 创建 config.js**

```javascript
// js/config.js - 配置常量和翻译数据

export const STORAGE_KEYS = {
  PROJECTS: 'idea-builder-projects',
  THEME: 'idea-builder-theme',
  LANG: 'idea-builder-lang',
  API_KEY: 'idea-builder-api-key'
};

export const PROJECT_ICONS = [
  '🏠', '🚗', '🏥', '📱', '🔋', '🎮', '🤖', '🛰️', '💊', '🎓', '🌾', '🏭'
];

export const PROJECT_TYPES = {
  invention: { name: 'Invention Project', class: 'tag-invention', icon: '💡' },
  utility: { name: 'Utility Project', class: 'tag-utility', icon: '🔧' },
  design: { name: 'Creative Design', class: 'tag-design', icon: '🎨' }
};

export const AI_CONFIG = {
  model: 'MiniMax-M2.5',
  maxTokens: 2000,
  apiUrl: 'https://api.minimaxi.com/anthropic/v1/messages'
};

export const translations = {
  zh: {
    // Navigation
    navFeatures: '功能',
    navProjects: '项目',
    navProcess: '流程',
    navGithub: 'GitHub',

    // Hero
    heroTitleHtml: '让每一个<span>灵机一动</span>的想法都能变成真正可实现的东西',
    heroDesc: 'AI 驱动的创意生成器，帮助你将创意想法快速转化为可实现的项目方案',
    exploreFeatures: '探索功能',
    viewDocs: '查看文档',

    // Features
    coreFeatures: '核心功能',
    featuresDesc: '强大的 AI 工具助你轻松完成创意项目',
    feature1Title: 'AI 提示词生成',
    feature1Desc: '智能分析你的想法，生成高质量的 AI 提示词，让 AI 更好地理解你的需求，提升交互效率',
    feature2Title: 'AI 项目生成',
    feature2Desc: '一键生成符合规范的项目方案，帮助你实现创意',
    feature3Title: 'AI 创意工具',
    feature3Desc: '更多创意工具持续更新，助力你的创新之旅，让每个想法都能得到专业的技术支持',

    // Projects
    myProjects: '我的项目',
    projectsDesc: '管理你的创意项目',
    emptyStateTitle: '还没有项目',
    emptyStateDesc: '点击"创建项目"开始你的创意之旅',
    createFirst: '✨ 创建第一个项目',
    noDesc: '暂无描述',

    // Process
    processTitle: '使用流程',
    processDesc: '简单的四步完成创意项目',
    step1: '输入你的想法',
    step2: 'AI 优化完善',
    step3: '生成项目方案',
    step4: '实现创意',

    // Form
    createProject: '✨ 创建项目',
    projectName: '项目名称',
    projectNamePlaceholder: '请输入项目名称',
    techField: '技术领域',
    techFieldPlaceholder: '请输入技术领域',
    projectType: '项目类型',
    selectType: '请选择项目类型',
    invention: '发明项目',
    utility: '实用项目',
    design: '创意设计',
    projectDesc: '项目描述',
    projectDescPlaceholder: '请描述您的创意想法...',
    create: '创建',
    cancel: '取消',

    // Edit Modal
    editProject: '编辑项目',
    edit: '编辑',
    delete: '删除',
    save: '保存',

    // Detail Modal
    projectDetail: '项目详情',

    // AI Modal
    aiGeneration: 'AI 智能生成',
    promptGeneration: '提示词生成',
    projectPlan: '项目方案生成',
    aiIdeaPlaceholder: '输入你的创意想法，AI 将帮你优化...',
    generatePrompt: '生成提示词',
    generatePlan: '生成项目方案',
    generating: '生成中...',
    saveToProject: '保存到项目',
    apiKeyNotice: '使用 AI 功能需要配置 API Key',
    apiKeySettings: '设置',
    enterApiKey: '请输入 API Key',
    saveApiKey: '保存',

    // Footer
    footerContact: '有问题或建议？联系我们',
    footerCopyright: '© 2024 IDEA Builder. 基于 AI 的创意生成工具。',

    // Messages
    confirmDelete: '确定要删除这个项目吗？',
    fillRequired: '请填写必填字段',
    createSuccess: '项目创建成功！',
    editSuccess: '项目修改成功！',
    deleteSuccess: '删除成功',
    notExist: '项目不存在',
    apiKeySaved: 'API Key 保存成功',
    apiKeyNotConfigured: 'API Key 未配置，请点击"设置"输入您的 MiniMax API Key',
    noResponse: '无响应',
    apiError: 'API 调用错误'
  },

  en: {
    // Navigation
    navFeatures: 'Features',
    navProjects: 'Projects',
    navProcess: 'Process',
    navGithub: 'GitHub',

    // Hero
    heroTitleHtml: 'Turn Every <span>Great Idea</span> Into Reality',
    heroDesc: 'AI-powered idea generator that transforms your creative ideas into actionable project plans',
    exploreFeatures: 'Explore Features',
    viewDocs: 'View Docs',

    // Features
    coreFeatures: 'Core Features',
    featuresDesc: 'Powerful AI tools to help you complete creative projects with ease',
    feature1Title: 'AI Prompt Generation',
    feature1Desc: 'Intelligently analyze your ideas and generate high-quality AI prompts for better understanding',
    feature2Title: 'AI Project Generation',
    feature2Desc: 'Generate standardized project plans with one click to bring your ideas to life',
    feature3Title: 'AI Creative Tools',
    feature3Desc: 'Continuous updates of creative tools to support your innovation journey',

    // Projects
    myProjects: 'My Projects',
    projectsDesc: 'Manage your creative projects',
    emptyStateTitle: 'No Projects Yet',
    emptyStateDesc: 'Click "Create Project" to start your creative journey',
    createFirst: '✨ Create First Project',
    noDesc: 'No description',

    // Process
    processTitle: 'How It Works',
    processDesc: 'Four simple steps to complete your creative project',
    step1: 'Input Your Idea',
    step2: 'AI Optimization',
    step3: 'Generate Plan',
    step4: 'Make It Real',

    // Form
    createProject: '✨ Create Project',
    projectName: 'Project Name',
    projectNamePlaceholder: 'Enter project name',
    techField: 'Tech Field',
    techFieldPlaceholder: 'Enter tech field',
    projectType: 'Project Type',
    selectType: 'Select type',
    invention: 'Invention Project',
    utility: 'Utility Project',
    design: 'Creative Design',
    projectDesc: 'Description',
    projectDescPlaceholder: 'Describe your creative idea...',
    create: 'Create',
    cancel: 'Cancel',

    // Edit Modal
    editProject: 'Edit Project',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',

    // Detail Modal
    projectDetail: 'Project Details',

    // AI Modal
    aiGeneration: 'AI Generation',
    promptGeneration: 'Prompt Generation',
    projectPlan: 'Project Plan',
    aiIdeaPlaceholder: 'Enter your creative idea, AI will help optimize...',
    generatePrompt: 'Generate Prompt',
    generatePlan: 'Generate Plan',
    generating: 'Generating...',
    saveToProject: 'Save to Project',
    apiKeyNotice: 'AI features require API Key configuration',
    apiKeySettings: 'Settings',
    enterApiKey: 'Enter API Key',
    saveApiKey: 'Save',

    // Footer
    footerContact: 'Questions or suggestions? Contact Us',
    footerCopyright: '© 2024 IDEA Builder. AI-powered Idea Generation Tool.',

    // Messages
    confirmDelete: 'Are you sure you want to delete this project?',
    fillRequired: 'Please fill in required fields',
    createSuccess: 'Project created successfully!',
    editSuccess: 'Project updated successfully!',
    deleteSuccess: 'Deleted successfully',
    notExist: 'Project not found',
    apiKeySaved: 'API Key saved successfully',
    apiKeyNotConfigured: 'API Key not configured. Please click "Settings" to enter your MiniMax API Key.',
    noResponse: 'No response',
    apiError: 'API Error'
  }
};
```

**Step 2: Commit**

```bash
git add js/config.js
git commit -m "feat: add config module with translations"
```

---

## Task 4: 创建存储模块

**Files:**
- Create: `js/storage.js`

**Step 1: 创建 storage.js**

```javascript
// js/storage.js - localStorage 操作封装

import { STORAGE_KEYS } from './config.js';

// 通用存储操作
export const Storage = {
  get(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  clear() {
    localStorage.clear();
  }
};

// 项目数据专用方法
export const ProjectStorage = {
  getAll() {
    return Storage.get(STORAGE_KEYS.PROJECTS, []);
  },

  save(projects) {
    Storage.set(STORAGE_KEYS.PROJECTS, projects);
  },

  add(project) {
    const projects = this.getAll();
    projects.unshift(project);
    this.save(projects);
    return project;
  },

  update(id, data) {
    const projects = this.getAll();
    const index = projects.findIndex(p => p.id === id);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...data };
      this.save(projects);
      return projects[index];
    }
    return null;
  },

  delete(id) {
    const projects = this.getAll().filter(p => p.id !== id);
    this.save(projects);
  },

  getById(id) {
    return this.getAll().find(p => p.id === id);
  },

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
};
```

**Step 2: Commit**

```bash
git add js/storage.js
git commit -m "feat: add storage module with localStorage wrapper"
```

---

## Task 5: 创建主题模块

**Files:**
- Create: `js/theme.js`

**Step 1: 创建 theme.js**

```javascript
// js/theme.js - 主题切换逻辑

import { STORAGE_KEYS } from './config.js';
import { Storage } from './storage.js';

export const Theme = {
  isDark: false,

  init() {
    // 读取存储的主题或系统偏好
    const saved = Storage.get(STORAGE_KEYS.THEME);
    if (saved !== null) {
      this.isDark = saved === 'dark';
    } else if (window.matchMedia) {
      this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.applyTheme();
    this.bindSystemThemeChange();
  },

  toggle() {
    this.isDark = !this.isDark;
    Storage.set(STORAGE_KEYS.THEME, this.isDark ? 'dark' : 'light');
    this.applyTheme();
    console.log('Theme switched to:', this.isDark ? 'dark' : 'light');
  },

  applyTheme() {
    const html = document.documentElement;

    // 方案1: classList (Chrome, Firefox)
    html.classList.toggle('dark', this.isDark);

    // 方案2: data attribute (Safari 兼容)
    html.setAttribute('data-theme', this.isDark ? 'dark' : 'light');

    // 更新按钮图标
    this.updateToggleIcon();
  },

  updateToggleIcon() {
    const iconMoon = document.querySelector('.icon-moon');
    const iconSun = document.querySelector('.icon-sun');
    if (iconMoon && iconSun) {
      iconMoon.style.display = this.isDark ? 'none' : 'inline';
      iconSun.style.display = this.isDark ? 'inline' : 'none';
    }
  },

  bindSystemThemeChange() {
    if (!window.matchMedia) return;

    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        // 只有用户没有手动设置主题时才跟随系统
        if (Storage.get(STORAGE_KEYS.THEME) === null) {
          this.isDark = e.matches;
          this.applyTheme();
        }
      });
  }
};
```

**Step 2: Commit**

```bash
git add js/theme.js
git commit -m "feat: add theme module with Safari compatibility"
```

---

## Task 6: 创建国际化模块

**Files:**
- Create: `js/i18n.js`

**Step 1: 创建 i18n.js**

```javascript
// js/i18n.js - 国际化逻辑

import { STORAGE_KEYS, translations } from './config.js';
import { Storage } from './storage.js';

export const I18n = {
  currentLang: 'en',

  init() {
    this.currentLang = Storage.get(STORAGE_KEYS.LANG, 'en');
    this.applyTranslations();
    this.renderSelectOptions();
  },

  t(key) {
    return translations[this.currentLang]?.[key] || key;
  },

  setLang(lang) {
    this.currentLang = lang;
    Storage.set(STORAGE_KEYS.LANG, lang);
    this.applyTranslations();
    this.renderSelectOptions();
  },

  toggleLang() {
    this.setLang(this.currentLang === 'zh' ? 'en' : 'zh');
  },

  applyTranslations() {
    // 1. 文本内容
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (key) el.textContent = this.t(key);
    });

    // 2. 占位符
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      if (key) el.placeholder = this.t(key);
    });

    // 3. HTML 内容（保留 span 等标签）
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.dataset.i18nHtml;
      if (key) el.innerHTML = this.t(key);
    });

    // 4. 更新 HTML lang 属性
    document.documentElement.lang = this.currentLang;
    document.documentElement.classList.toggle('en', this.currentLang === 'en');
  },

  renderSelectOptions() {
    const selectIds = ['projectType', 'editProjectType'];
    selectIds.forEach(id => {
      const select = document.getElementById(id);
      if (select) {
        select.innerHTML = `
          <option value="">${this.t('selectType')}</option>
          <option value="invention">${this.t('invention')}</option>
          <option value="utility">${this.t('utility')}</option>
          <option value="design">${this.t('design')}</option>
        `;
      }
    });
  }
};
```

**Step 2: Commit**

```bash
git add js/i18n.js
git commit -m "feat: add i18n module with translation functions"
```

---

## Task 7: 创建项目管理模块

**Files:**
- Create: `js/projects.js`

**Step 1: 创建 projects.js**

```javascript
// js/projects.js - 项目 CRUD 操作

import { PROJECT_ICONS, PROJECT_TYPES } from './config.js';
import { ProjectStorage } from './storage.js';
import { I18n } from './i18n.js';
import { UI } from './ui.js';

export const Projects = {
  render() {
    const projects = ProjectStorage.getAll();
    const grid = document.getElementById('projectsGrid');
    const emptyState = document.getElementById('emptyState');

    if (!grid || !emptyState) return;

    if (!projects.length) {
      grid.innerHTML = '';
      grid.style.display = 'none';
      emptyState.style.display = 'block';
      return;
    }

    grid.style.display = 'grid';
    emptyState.style.display = 'none';

    grid.innerHTML = projects.map((project, index) => {
      const typeInfo = PROJECT_TYPES[project.type] || PROJECT_TYPES.invention;
      const icon = project.icon || PROJECT_ICONS[index % PROJECT_ICONS.length];

      return `
        <article class="project-card" data-id="${project.id}" tabindex="0">
          <div class="project-cover">${icon}</div>
          <div class="project-info">
            <h3 class="project-name">${this.escapeHtml(project.name)}</h3>
            <p class="project-desc">${this.escapeHtml(project.description || I18n.t('noDesc'))}</p>
            <div class="project-meta">
              <span class="project-tag ${typeInfo.class}">${I18n.t(project.type)}</span>
              <span class="project-date">${project.date || ''}</span>
            </div>
          </div>
        </article>
      `;
    }).join('');

    this.bindCardEvents();
  },

  bindCardEvents() {
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', () => {
        this.showDetail(card.dataset.id);
      });
    });
  },

  showDetail(id) {
    const project = ProjectStorage.getById(id);
    if (!project) {
      UI.showNotice(I18n.t('notExist'), 'error');
      return;
    }

    const typeInfo = PROJECT_TYPES[project.type] || PROJECT_TYPES.invention;
    const content = document.getElementById('detailContent');
    if (!content) return;

    content.innerHTML = `
      <div class="project-detail-icon">${project.icon || '📄'}</div>
      <h2 class="project-detail-name">${this.escapeHtml(project.name)}</h2>
      <div class="project-detail-meta">
        <span class="project-tag ${typeInfo.class}">${I18n.t(project.type)}</span>
        <span>${this.escapeHtml(project.field)}</span>
      </div>
      <p class="project-detail-desc">${this.escapeHtml(project.description || I18n.t('noDesc'))}</p>
      <div class="project-detail-actions">
        <button class="btn btn-secondary" onclick="Projects.openEdit('${id}')">${I18n.t('edit')}</button>
        <button class="btn btn-danger" onclick="Projects.delete('${id}')">${I18n.t('delete')}</button>
      </div>
    `;

    UI.openModal('detailModal');
  },

  openEdit(id) {
    const project = ProjectStorage.getById(id);
    if (!project) return;

    UI.closeAllModals();

    document.getElementById('editProjectId').value = project.id;
    document.getElementById('editProjectName').value = project.name;
    document.getElementById('editProjectField').value = project.field;
    document.getElementById('editProjectType').value = project.type;
    document.getElementById('editProjectDesc').value = project.description || '';

    setTimeout(() => UI.openModal('editModal'), 100);
  },

  delete(id) {
    if (!confirm(I18n.t('confirmDelete'))) return;

    ProjectStorage.delete(id);
    this.render();
    UI.closeAllModals();
    UI.showNotice(I18n.t('deleteSuccess'), 'success');
  },

  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};
```

**Step 2: Commit**

```bash
git add js/projects.js
git commit -m "feat: add projects module with CRUD operations"
```

---

## Task 8: 创建 AI 功能模块

**Files:**
- Create: `js/ai.js`

**Step 1: 创建 ai.js**

```javascript
// js/ai.js - AI API 调用

import { STORAGE_KEYS, AI_CONFIG } from './config.js';
import { Storage } from './storage.js';
import { I18n } from './i18n.js';

export const AI = {
  init() {
    const savedKey = Storage.get(STORAGE_KEYS.API_KEY);
    const apiKeyInput = document.getElementById('miniMaxApiKey');
    const notice = document.getElementById('apiKeyNotice');
    const settings = document.getElementById('apiKeySettings');

    if (savedKey && apiKeyInput) {
      apiKeyInput.value = savedKey;
      if (notice) notice.style.display = 'none';
      if (settings) settings.style.display = 'block';
    }
  },

  getApiKey() {
    return Storage.get(STORAGE_KEYS.API_KEY, '');
  },

  saveApiKey(key) {
    Storage.set(STORAGE_KEYS.API_KEY, key);
  },

  isConfigured() {
    const key = this.getApiKey();
    return key && key.trim().length > 0;
  },

  async callMiniMax(prompt) {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return { error: true, message: I18n.t('apiKeyNotConfigured') };
    }

    try {
      const response = await fetch(AI_CONFIG.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: AI_CONFIG.model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: AI_CONFIG.maxTokens
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        error: false,
        content: data.content?.[0]?.text || I18n.t('noResponse')
      };
    } catch (e) {
      return { error: true, message: I18n.t('apiError') + ': ' + e.message };
    }
  },

  async generatePrompt(idea) {
    const prompt = `Optimize this idea for AI interaction: ${idea}\n\nPlease provide an optimized prompt that will help AI better understand and work with this idea.`;
    return this.callMiniMax(prompt);
  },

  async generatePlan(idea) {
    const prompt = `Generate a detailed project plan for this idea: ${idea}\n\nPlease include:\n1. Project overview\n2. Key features\n3. Technical requirements\n4. Implementation steps\n5. Timeline estimates`;
    return this.callMiniMax(prompt);
  }
};
```

**Step 2: Commit**

```bash
git add js/ai.js
git commit -m "feat: add AI module with MiniMax API integration"
```

---

## Task 9: 创建 UI 交互模块

**Files:**
- Create: `js/ui.js`

**Step 1: 创建 ui.js**

```javascript
// js/ui.js - UI 交互模块

import { PROJECT_ICONS } from './config.js';
import { I18n } from './i18n.js';
import { Theme } from './theme.js';
import { Projects } from './projects.js';
import { ProjectStorage } from './storage.js';
import { AI } from './ai.js';

export const UI = {
  // 模态框操作
  openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
  },

  closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
  },

  closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.classList.remove('active');
    });
  },

  // 平滑滚动
  smoothScrollTo(selector) {
    const target = document.querySelector(selector);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  // 显示通知
  showNotice(message, type = 'info') {
    // 目前使用 alert，可扩展为 Toast 组件
    alert(message);
  },

  // 绑定所有事件
  bindEvents() {
    this.bindThemeToggle();
    this.bindLangToggle();
    this.bindModalEvents();
    this.bindFormEvents();
    this.bindFeatureCards();
    this.bindSmoothScroll();
    this.bindKeyboardNav();
  },

  bindThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.addEventListener('click', () => Theme.toggle());
    }
  },

  bindLangToggle() {
    const btn = document.getElementById('langToggle');
    if (btn) {
      btn.addEventListener('click', () => I18n.toggleLang());
    }
  },

  bindModalEvents() {
    // 关闭按钮
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => this.closeAllModals());
    });

    // 取消按钮
    document.querySelectorAll('.modal-cancel-btn').forEach(btn => {
      btn.addEventListener('click', () => this.closeAllModals());
    });

    // 点击遮罩关闭
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.closeAllModals();
      });
    });

    // ESC 键关闭
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeAllModals();
    });
  },

  bindFormEvents() {
    // 创建项目表单
    this.bindCreateForm();

    // 编辑项目表单
    this.bindEditForm();

    // 创建按钮
    document.getElementById('createProjectBtn')?.addEventListener('click', () => {
      document.getElementById('createForm')?.reset();
      this.openModal('createModal');
    });

    document.getElementById('emptyCreateBtn')?.addEventListener('click', () => {
      document.getElementById('createForm')?.reset();
      this.openModal('createModal');
    });

    // API Key 设置
    this.bindApiKeyEvents();
  },

  bindCreateForm() {
    const form = document.getElementById('createForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('projectName')?.value.trim();
      const field = document.getElementById('projectField')?.value.trim();
      const type = document.getElementById('projectType')?.value;
      const description = document.getElementById('projectDesc')?.value.trim();

      if (!name || !field || !type) {
        this.showNotice(I18n.t('fillRequired'), 'error');
        return;
      }

      const projects = ProjectStorage.getAll();
      const newProject = {
        id: ProjectStorage.generateId(),
        name,
        field,
        type,
        description,
        date: new Date().toISOString().split('T')[0],
        icon: PROJECT_ICONS[projects.length % PROJECT_ICONS.length]
      };

      ProjectStorage.add(newProject);
      Projects.render();
      this.closeAllModals();
      form.reset();

      setTimeout(() => this.smoothScrollTo('#projects'), 300);
      this.showNotice(I18n.t('createSuccess'), 'success');
    });
  },

  bindEditForm() {
    const form = document.getElementById('editForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const id = document.getElementById('editProjectId')?.value;
      const name = document.getElementById('editProjectName')?.value.trim();
      const field = document.getElementById('editProjectField')?.value.trim();
      const type = document.getElementById('editProjectType')?.value;
      const description = document.getElementById('editProjectDesc')?.value.trim();

      if (!name || !field || !type) {
        this.showNotice(I18n.t('fillRequired'), 'error');
        return;
      }

      ProjectStorage.update(id, { name, field, type, description });
      Projects.render();
      this.closeAllModals();
      this.showNotice(I18n.t('editSuccess'), 'success');
    });
  },

  bindApiKeyEvents() {
    const showSettingsBtn = document.getElementById('showApiKeySettings');
    const saveBtn = document.getElementById('saveApiKeyBtn');

    showSettingsBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      const notice = document.getElementById('apiKeyNotice');
      const settings = document.getElementById('apiKeySettings');
      if (notice) notice.style.display = 'none';
      if (settings) settings.style.display = 'block';
    });

    saveBtn?.addEventListener('click', () => {
      const key = document.getElementById('miniMaxApiKey')?.value.trim();
      if (!key) {
        this.showNotice(I18n.t('enterApiKey'), 'error');
        return;
      }
      AI.saveApiKey(key);
      this.showNotice(I18n.t('apiKeySaved'), 'success');
      const settings = document.getElementById('apiKeySettings');
      if (settings) settings.style.display = 'none';
    });
  },

  bindFeatureCards() {
    document.querySelectorAll('.feature-card[data-feature="ai"]').forEach(card => {
      card.addEventListener('click', () => this.openModal('aiModal'));
    });
  },

  bindSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        if (href) this.smoothScrollTo(href);
      });
    });
  },

  bindKeyboardNav() {
    // 添加键盘导航类
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-nav');
    });
  }
};
```

**Step 2: Commit**

```bash
git add js/ui.js
git commit -m "feat: add UI module with event bindings"
```

---

## Task 10: 创建入口模块

**Files:**
- Create: `js/main.js`

**Step 1: 创建 main.js**

```javascript
// js/main.js - 应用入口

import { Theme } from './theme.js';
import { I18n } from './i18n.js';
import { Projects } from './projects.js';
import { AI } from './ai.js';
import { UI } from './ui.js';

// 暴露到全局供 onclick 属性使用
window.Projects = Projects;

// 应用初始化
document.addEventListener('DOMContentLoaded', () => {
  console.log('IDEA Builder initializing...');

  Theme.init();
  I18n.init();
  Projects.render();
  AI.init();
  UI.bindEvents();

  console.log('IDEA Builder initialized successfully');
});
```

**Step 2: Commit**

```bash
git add js/main.js
git commit -m "feat: add main entry module"
```

---

## Task 11: 创建 favicon

**Files:**
- Create: `assets/favicon.ico`

**Step 1: 创建简单 SVG favicon**

创建 `assets/favicon.svg`：

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <text y=".9em" font-size="90">💡</text>
</svg>
```

**Step 2: 更新 index.html head**

在 `<head>` 中添加：

```html
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
```

**Step 3: Commit**

```bash
git add assets/favicon.svg index.html
git commit -m "feat: add favicon to prevent 404 error"
```

---

## Task 12: 重构 index.html

**Files:**
- Modify: `index.html`

**Step 1: 移除内联 JavaScript**

删除 `<script>` 标签中的所有 JavaScript 代码。

**Step 2: 添加模块引用**

在 `</body>` 前添加：

```html
<script type="module" src="js/main.js"></script>
```

**Step 3: 确保 HTML 结构正确**

检查所有 `data-i18n` 属性是否正确设置。

**Step 4: 本地测试**

Run: `python3 -m http.server 8080`

Open: `http://localhost:8080`

测试清单：
- [ ] 页面样式正常
- [ ] 主题切换（Safari + Chrome）
- [ ] 语言切换
- [ ] 创建项目
- [ ] 编辑项目
- [ ] 删除项目
- [ ] AI 模态框

**Step 5: Commit**

```bash
git add index.html
git commit -m "refactor: convert to ES modules architecture"
```

---

## Task 13: 更新部署工作流

**Files:**
- Modify: `.github/workflows/deploy.yml`

**Step 1: 更新工作流以支持多文件部署**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "fix: update deploy workflow for ES modules"
```

---

## Task 14: 最终测试和部署

**Step 1: 本地完整测试**

Run: `python3 -m http.server 8080`

测试所有功能：
- Safari 主题切换
- Chrome 主题切换
- 语言切换
- 项目 CRUD
- AI 功能

**Step 2: 推送到 GitHub**

```bash
git push origin master
```

**Step 3: 验证部署**

Open: `https://chaceli.github.io/idea-builder/`

验证所有功能正常。

**Step 4: 最终 Commit（如有修复）**

```bash
git add .
git commit -m "fix: final adjustments for production"
git push origin master
```

---

## 预期结果

- ✅ Safari 主题切换正常工作
- ✅ 所有文本支持中英文切换
- ✅ 无控制台错误
- ✅ 代码模块化，易于维护
- ✅ 部署成功