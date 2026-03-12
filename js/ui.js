// js/ui.js - UI 交互模块

import { PROJECT_ICONS } from './config.js';
import { I18n } from './i18n.js';
import { Theme } from './theme.js';
import { ProjectStorage } from './storage.js';
import { AI } from './ai.js';

// Import Projects at the end to minimize circular dependency issues
import { Projects } from './projects.js';

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

  // Toast 通知系统
  showNotice(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');

    // Add icon based on type
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    const iconSpan = document.createElement('span');
    iconSpan.textContent = icons[type] || 'ℹ️';
    const msgSpan = document.createElement('span');
    msgSpan.textContent = message;
    toast.appendChild(iconSpan);
    toast.appendChild(msgSpan);

    container.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
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
    this.bindAIGeneration();
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
  },

  bindAIGeneration() {
    const generateBtn = document.getElementById('generateBtn');
    const promptBtn = document.getElementById('generatePromptBtn');
    const planBtn = document.getElementById('generatePlanBtn');

    // Generate button (legacy)
    generateBtn?.addEventListener('click', async () => {
      const idea = document.getElementById('aiIdeaInput')?.value?.trim();
      if (!idea) {
        this.showNotice(I18n.t('enterIdea'), 'error');
        return;
      }
      generateBtn.disabled = true;
      generateBtn.textContent = I18n.t('generating');
      const result = await AI.generatePrompt(idea);
      generateBtn.disabled = false;
      generateBtn.textContent = I18n.t('generatePrompt');

      const output = document.getElementById('aiOutput');
      if (output) {
        output.value = result.error ? result.message : result.content;
      }
    });

    // Prompt generation button
    promptBtn?.addEventListener('click', async () => {
      const idea = document.getElementById('aiIdeaInput')?.value?.trim();
      if (!idea) {
        this.showNotice('Please enter your idea', 'error');
        return;
      }
      promptBtn.disabled = true;
      promptBtn.textContent = I18n.t('generating');
      const result = await AI.generatePrompt(idea);
      promptBtn.disabled = false;
      promptBtn.textContent = I18n.t('generatePrompt');

      const output = document.getElementById('aiOutput');
      if (output) {
        output.value = result.error ? result.message : result.content;
      }
    });

    // Plan generation button
    planBtn?.addEventListener('click', async () => {
      const idea = document.getElementById('aiIdeaInput')?.value?.trim();
      if (!idea) {
        this.showNotice('Please enter your idea', 'error');
        return;
      }
      planBtn.disabled = true;
      planBtn.textContent = I18n.t('generating');
      const result = await AI.generatePlan(idea);
      planBtn.disabled = false;
      planBtn.textContent = I18n.t('generatePlan');

      const output = document.getElementById('aiOutput');
      if (output) {
        output.value = result.error ? result.message : result.content;
      }
    });
  }
};