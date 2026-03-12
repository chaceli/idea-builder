// js/ui.js - UI 交互模块

import { PROJECT_ICONS, AI_PROVIDERS } from './config.js';
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

  // AI Tab 状态
  currentAITab: 'prompt',

  getTabLabels() {
    return {
      prompt: I18n.t('generatePrompt'),
      blueprint: I18n.t('generatePlan'),
      patent: I18n.t('generatePatent') || 'Generate Patent'
    };
  },

  switchAITab(tabName) {
    this.currentAITab = tabName;

    // Update tab buttons
    document.querySelectorAll('.ai-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    // Update generate button text
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
      const labels = this.getTabLabels();
      generateBtn.textContent = `🚀 ${labels[tabName] || I18n.t('startGeneration')}`;
    }
  },

  openAIModal(tabIndex = 0) {
    const tabs = ['prompt', 'blueprint', 'patent'];
    this.openModal('aiModal');

    // Update demo banner visibility
    const demoBanner = document.getElementById('demoBanner');
    if (demoBanner) {
      demoBanner.style.display = AI.shouldUseDemo() ? 'flex' : 'none';
    }

    // Switch to specified tab
    this.switchAITab(tabs[tabIndex] || 'prompt');
  },

  bindAITabs() {
    document.querySelectorAll('.ai-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.switchAITab(tab.dataset.tab);
      });
    });

    // Demo config link
    const demoConfigLink = document.getElementById('demoConfigLink');
    if (demoConfigLink) {
      demoConfigLink.addEventListener('click', (e) => {
        e.preventDefault();
        const notice = document.getElementById('apiKeyNotice');
        const settings = document.getElementById('apiKeySettings');
        if (notice) notice.style.display = 'block';
        if (settings) settings.style.display = 'block';
      });
    }
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
    this.bindAITabs();
    this.bindFormValidation();
    this.bindProviderEvents();
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

      if (!this.validateForm(form)) {
        this.showNotice(I18n.t('fillRequired'), 'error');
        return;
      }

      const name = document.getElementById('projectName')?.value.trim();
      const field = document.getElementById('projectField')?.value.trim();
      const type = document.getElementById('projectType')?.value;
      const description = document.getElementById('projectDesc')?.value.trim();

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

      if (!this.validateForm(form)) {
        this.showNotice(I18n.t('fillRequired'), 'error');
        return;
      }

      const id = document.getElementById('editProjectId')?.value;
      const name = document.getElementById('editProjectName')?.value.trim();
      const field = document.getElementById('editProjectField')?.value.trim();
      const type = document.getElementById('editProjectType')?.value;
      const description = document.getElementById('editProjectDesc')?.value.trim();

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
      const key = document.getElementById('apiKeyInput')?.value.trim();
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

  bindProviderEvents() {
    const providerSelect = document.getElementById('apiProvider');

    // Update placeholder on load (AI.init already loaded the saved provider)
    if (providerSelect) {
      this.updateApiKeyPlaceholder(providerSelect.value);
    }

    // Handle provider change
    providerSelect?.addEventListener('change', (e) => {
      const providerId = e.target.value;
      AI.saveProvider(providerId);
      this.updateApiKeyPlaceholder(providerId);
    });
  },

  updateApiKeyPlaceholder(providerId) {
    const apiKeyInput = document.getElementById('apiKeyInput');
    const provider = AI_PROVIDERS[providerId];
    if (apiKeyInput && provider) {
      apiKeyInput.placeholder = provider.keyPlaceholder;
    }
  },

  bindFeatureCards() {
    document.querySelectorAll('.feature-card[data-feature="ai"]').forEach((card, index) => {
      card.addEventListener('click', () => {
        // index 0 → prompt, index 1 → blueprint, index 2 → patent
        this.openAIModal(index);
      });
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

  // Form validation
  validateField(input) {
    const group = input.closest('.form-group');
    if (!group) return true;

    const isRequired = input.hasAttribute('required');
    const isEmpty = !input.value.trim();

    if (isRequired && isEmpty) {
      group.classList.add('error');
      return false;
    } else {
      group.classList.remove('error');
      return true;
    }
  },

  validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  },

  bindFormValidation() {
    // Real-time validation on blur
    document.querySelectorAll('input[required], select[required], textarea[required]').forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));

      // Clear error on input
      input.addEventListener('input', () => {
        const group = input.closest('.form-group');
        if (group && group.classList.contains('error')) {
          if (input.value.trim()) {
            group.classList.remove('error');
          }
        }
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

    generateBtn?.addEventListener('click', async () => {
      const idea = document.getElementById('aiIdeaInput')?.value?.trim();
      if (!idea) {
        this.showNotice(I18n.t('enterIdea') || 'Please enter your idea', 'error');
        return;
      }

      generateBtn.disabled = true;
      generateBtn.textContent = I18n.t('generating');

      let result;

      // Check if using demo mode
      if (AI.shouldUseDemo()) {
        // Use demo response based on current tab
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
        switch (this.currentAITab) {
          case 'blueprint':
            result = { error: false, content: AI.getDemoBlueprintResponse(idea) };
            break;
          case 'patent':
            result = { error: false, content: AI.getDemoPatentResponse(idea) };
            break;
          default:
            result = { error: false, content: AI.getDemoPromptResponse(idea) };
        }
      } else {
        // Use real AI
        switch (this.currentAITab) {
          case 'blueprint':
            result = await AI.generatePlan(idea);
            break;
          case 'patent':
            result = await AI.generatePatent(idea);
            break;
          default:
            result = await AI.generatePrompt(idea);
        }
      }

      generateBtn.disabled = false;
      const labels = this.getTabLabels();
      generateBtn.textContent = `🚀 ${labels[this.currentAITab] || I18n.t('startGeneration')}`;

      const output = document.getElementById('aiOutput');
      if (output) {
        output.value = result.error ? result.message : result.content;
      }

      // Show result section
      const aiResult = document.getElementById('aiResult');
      const aiResultContent = document.getElementById('aiResultContent');
      if (aiResult && aiResultContent && !result.error) {
        aiResultContent.textContent = result.content;
        aiResult.style.display = 'block';
      }
    });

    // Copy result button
    const copyResultBtn = document.getElementById('copyResultBtn');
    copyResultBtn?.addEventListener('click', () => {
      const content = document.getElementById('aiResultContent')?.textContent;
      if (content) {
        navigator.clipboard.writeText(content);
        this.showNotice(I18n.t('copied') || 'Copied to clipboard', 'success');
      }
    });
  }
};