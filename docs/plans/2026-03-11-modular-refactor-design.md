# IDEA Builder 模块化重构设计

日期：2026-03-11

## 问题概述

### 关键问题
1. **Safari 主题切换不工作** - CSS 选择器 `.dark` 在 Safari 中不生效
2. **硬编码中文 alert 文本** - 多处 `alert()` 使用中文，切换英文后仍显示中文
3. **缺少 favicon.ico** - 控制台报 404 错误

### UI/UX 问题
4. **硬编码颜色未跟随主题** - 渐变色、标签颜色等未使用 CSS 变量
5. **API Key 提示未翻译** - "Please enter your API Key" 等文本硬编码
6. **项目卡片数据属性硬编码** - `data-index` 使用硬编码数字，语义不明确

### 代码质量问题
7. **废弃方法 `substr()`** - 应改为 `substring()`
8. **重复的 DOM 查询** - 多次 `document.getElementById()` 可缓存
9. **魔法数字** - 如 `2000` (max_tokens) 未定义为常量
10. **错误处理不完善** - API 调用失败时仅返回字符串，无用户友好提示

## 设计方案

### 架构：ES Modules 模块化

将单文件 HTML 拆分为模块化的文件结构：

```
index.html
├── css/
│   └── styles.css          // 提取的样式文件
├── js/
│   ├── config.js           // 配置常量、翻译数据
│   ├── storage.js          // localStorage 操作封装
│   ├── theme.js            // 主题切换逻辑
│   ├── i18n.js             // 国际化逻辑
│   ├── projects.js         // 项目 CRUD 操作
│   ├── ai.js               // AI API 调用
│   ├── ui.js               // UI 交互（模态框、滚动、事件绑定）
│   └── main.js             // 初始化入口
└── assets/
    └── favicon.ico         // 网站图标
```

## 模块详细设计

### 1. `config.js` - 配置模块

```javascript
// 常量配置
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

// 完整翻译数据
export const translations = {
  zh: {
    navFeatures: '功能',
    navProjects: '项目',
    navProcess: '流程',
    // ... 所有翻译键
  },
  en: {
    navFeatures: 'Features',
    navProjects: 'Projects',
    navProcess: 'Process',
    // ... 所有翻译键
  }
};
```

### 2. `storage.js` - 存储模块

```javascript
import { STORAGE_KEYS } from './config.js';

// 通用 localStorage 封装
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

### 3. `theme.js` - 主题模块

```javascript
import { STORAGE_KEYS } from './config.js';
import { Storage } from './storage.js';

export const Theme = {
  isDark: false,

  init() {
    // 读取存储的主题或系统偏好
    const saved = Storage.get(STORAGE_KEYS.THEME);
    if (saved !== null) {
      this.isDark = saved === 'dark';
    } else {
      this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.applyTheme();
    this.bindSystemThemeChange();
  },

  toggle() {
    this.isDark = !this.isDark;
    Storage.set(STORAGE_KEYS.THEME, this.isDark ? 'dark' : 'light');
    this.applyTheme();
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
      iconMoon.style.display = this.isDark ? 'none' : 'block';
      iconSun.style.display = this.isDark ? 'block' : 'none';
    }
  },

  bindSystemThemeChange() {
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (Storage.get(STORAGE_KEYS.THEME) === null) {
          this.isDark = e.matches;
          this.applyTheme();
        }
      });
  }
};
```

### 4. `i18n.js` - 国际化模块

```javascript
import { STORAGE_KEYS, translations } from './config.js';
import { Storage } from './storage.js';

export const I18n = {
  currentLang: 'zh',

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
    // 文本内容
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = this.t(el.dataset.i18n);
    });

    // 占位符
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = this.t(el.dataset.i18nPlaceholder);
    });

    // HTML 内容
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      el.innerHTML = this.t(el.dataset.i18nHtml);
    });

    // 更新 lang 属性
    document.documentElement.lang = this.currentLang;
  },

  renderSelectOptions() {
    ['projectType', 'editProjectType'].forEach(id => {
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

### 5. `projects.js` - 项目管理模块

```javascript
import { PROJECT_ICONS, PROJECT_TYPES, translations } from './config.js';
import { ProjectStorage } from './storage.js';
import { I18n } from './i18n.js';
import { UI } from './ui.js';

export const Projects = {
  render() {
    const projects = ProjectStorage.getAll();
    const grid = document.getElementById('projectsGrid');
    const emptyState = document.getElementById('emptyState');

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
      card.addEventListener('click', () => this.showDetail(card.dataset.id));
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

    content.innerHTML = `
      <div class="project-detail-icon">${project.icon || '📄'}</div>
      <h2 class="project-detail-name">${this.escapeHtml(project.name)}</h2>
      <div class="project-detail-meta">
        <span class="project-tag ${typeInfo.class}">${I18n.t(project.type)}</span>
        <span>${project.field}</span>
      </div>
      <p class="project-detail-desc">${this.escapeHtml(project.description || I18n.t('noDesc'))}</p>
      <div class="project-detail-actions">
        <button class="btn btn-secondary" onclick="Projects.openEdit('${id}')">${I18n.t('edit')}</button>
        <button class="btn btn-danger" onclick="Projects.delete('${id}')">${I18n.t('delete')}</button>
      </div>
    `;

    document.getElementById('detailModal').classList.add('active');
  },

  openEdit(id) {
    const project = ProjectStorage.getById(id);
    if (!project) return;

    document.getElementById('detailModal').classList.remove('active');

    document.getElementById('editProjectId').value = project.id;
    document.getElementById('editProjectName').value = project.name;
    document.getElementById('editProjectField').value = project.field;
    document.getElementById('editProjectType').value = project.type;
    document.getElementById('editProjectDesc').value = project.description || '';

    setTimeout(() => {
      document.getElementById('editModal').classList.add('active');
    }, 100);
  },

  delete(id) {
    if (!confirm(I18n.t('confirmDelete'))) return;

    ProjectStorage.delete(id);
    this.render();
    document.getElementById('detailModal').classList.remove('active');
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

### 6. `ai.js` - AI 功能模块

```javascript
import { STORAGE_KEYS, AI_CONFIG } from './config.js';
import { Storage } from './storage.js';
import { I18n } from './i18n.js';
import { UI } from './ui.js';

export const AI = {
  init() {
    const savedKey = Storage.get(STORAGE_KEYS.API_KEY);
    if (savedKey) {
      document.getElementById('miniMaxApiKey').value = savedKey;
      document.getElementById('apiKeyNotice').style.display = 'none';
      document.getElementById('apiKeySettings').style.display = 'block';
    }
  },

  getApiKey() {
    return Storage.get(STORAGE_KEYS.API_KEY, '');
  },

  saveApiKey(key) {
    Storage.set(STORAGE_KEYS.API_KEY, key);
  },

  isConfigured() {
    return !!this.getApiKey();
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
    return this.callMiniMax(`Optimize this idea for AI: ${idea}`);
  },

  async generatePlan(idea) {
    return this.callMiniMax(`Generate a project plan for this idea: ${idea}`);
  }
};
```

### 7. `ui.js` - UI 交互模块

```javascript
import { I18n } from './i18n.js';
import { Theme } from './theme.js';
import { Projects } from './projects.js';
import { ProjectStorage } from './storage.js';
import { PROJECT_ICONS } from './config.js';

export const UI = {
  // 模态框操作
  openModal(id) {
    document.getElementById(id).classList.add('active');
  },

  closeModal(id) {
    document.getElementById(id).classList.remove('active');
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

  // 显示通知（替代 alert）
  showNotice(message, type = 'info') {
    // 可扩展为 Toast 组件
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
  },

  bindThemeToggle() {
    document.getElementById('themeToggle').addEventListener('click', () => {
      Theme.toggle();
    });
  },

  bindLangToggle() {
    document.getElementById('langToggle').addEventListener('click', () => {
      I18n.toggleLang();
    });
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
  },

  bindFormEvents() {
    // 创建项目
    const createForm = document.getElementById('createForm');
    if (createForm) {
      createForm.addEventListener('submit', (e) => this.handleCreateSubmit(e));
    }

    // 编辑项目
    const editForm = document.getElementById('editForm');
    if (editForm) {
      editForm.addEventListener('submit', (e) => this.handleEditSubmit(e));
    }

    // 创建按钮
    document.getElementById('createProjectBtn')?.addEventListener('click', () => {
      this.openModal('createModal');
    });

    document.getElementById('emptyCreateBtn')?.addEventListener('click', () => {
      this.openModal('createModal');
    });

    // API Key 设置
    this.bindApiKeyEvents();
  },

  handleCreateSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('projectName').value.trim();
    const field = document.getElementById('projectField').value.trim();
    const type = document.getElementById('projectType').value;
    const description = document.getElementById('projectDesc').value.trim();

    if (!name || !field || !type) {
      this.showNotice(I18n.t('fillRequired'), 'error');
      return;
    }

    const projects = ProjectStorage.getAll();
    const newProject = {
      id: ProjectStorage.generateId(),
      name, field, type, description,
      date: new Date().toISOString().split('T')[0],
      icon: PROJECT_ICONS[projects.length % PROJECT_ICONS.length]
    };

    ProjectStorage.add(newProject);
    Projects.render();
    this.closeAllModals();
    document.getElementById('createForm').reset();

    setTimeout(() => this.smoothScrollTo('#projects'), 300);
    this.showNotice(I18n.t('createSuccess'), 'success');
  },

  handleEditSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('editProjectId').value;
    const name = document.getElementById('editProjectName').value.trim();
    const field = document.getElementById('editProjectField').value.trim();
    const type = document.getElementById('editProjectType').value;
    const description = document.getElementById('editProjectDesc').value.trim();

    if (!name || !field || !type) {
      this.showNotice(I18n.t('fillRequired'), 'error');
      return;
    }

    ProjectStorage.update(id, { name, field, type, description });
    Projects.render();
    this.closeAllModals();
    this.showNotice(I18n.t('editSuccess'), 'success');
  },

  bindApiKeyEvents() {
    document.getElementById('showApiKeySettings')?.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('apiKeyNotice').style.display = 'none';
      document.getElementById('apiKeySettings').style.display = 'block';
    });

    document.getElementById('saveApiKeyBtn')?.addEventListener('click', () => {
      const key = document.getElementById('miniMaxApiKey').value.trim();
      if (!key) {
        this.showNotice(I18n.t('enterApiKey'), 'error');
        return;
      }
      AI.saveApiKey(key);
      this.showNotice(I18n.t('apiKeySaved'), 'success');
      document.getElementById('apiKeySettings').style.display = 'none';
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
        this.smoothScrollTo(anchor.getAttribute('href'));
      });
    });
  }
};
```

### 8. `main.js` - 入口模块

```javascript
import { Theme } from './theme.js';
import { I18n } from './i18n.js';
import { Projects } from './projects.js';
import { AI } from './ai.js';
import { UI } from './ui.js';

// 暴露到全局供 onclick 使用
window.Projects = Projects;

// 应用初始化
document.addEventListener('DOMContentLoaded', () => {
  Theme.init();
  I18n.init();
  Projects.render();
  AI.init();
  UI.bindEvents();
});
```

### 9. `styles.css` - 样式修改

**Safari 主题兼容修复：**
```css
/* 双写选择器，兼容 Safari */
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

### 10. `index.html` - 入口文件

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IDEA Builder - Creative Idea Generator</title>
  <link rel="icon" href="assets/favicon.ico" type="image/x-icon">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <!-- HTML 内容保持不变 -->

  <script type="module" src="js/main.js"></script>
</body>
</html>
```

## 新增翻译键

为解决硬编码文本问题，新增以下翻译键：

```javascript
// 提示信息
enterApiKey: { zh: '请输入 API Key', en: 'Please enter your API Key' },
apiKeySaved: { zh: 'API Key 保存成功', en: 'API Key saved successfully' },
apiKeyNotConfigured: { zh: 'API Key 未配置，请点击"设置"输入您的 MiniMax API Key', en: 'API Key not configured. Please click "Settings" to enter your MiniMax API Key.' },
noResponse: { zh: '无响应', en: 'No response' },
apiError: { zh: 'API 调用错误', en: 'API Error' },
deleteSuccess: { zh: '删除成功', en: 'Deleted successfully' },
```

## 实现步骤

1. 创建目录结构 `css/`, `js/`, `assets/`
2. 提取 CSS 到 `css/styles.css`，修复 Safari 兼容性
3. 创建 `js/config.js` - 配置和翻译数据
4. 创建 `js/storage.js` - 存储模块
5. 创建 `js/theme.js` - 主题模块
6. 创建 `js/i18n.js` - 国际化模块
7. 创建 `js/projects.js` - 项目管理模块
8. 创建 `js/ai.js` - AI 功能模块
9. 创建 `js/ui.js` - UI 交互模块
10. 创建 `js/main.js` - 入口模块
11. 创建 `assets/favicon.ico` - 网站图标
12. 重构 `index.html` - 引入模块
13. 本地测试所有功能
14. 提交并部署

## 预期结果

- Safari 主题切换正常工作
- 所有文本支持中英文切换
- 无控制台错误（favicon 404）
- 代码结构清晰，易于维护
- 每个模块职责单一，便于测试