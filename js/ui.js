// js/ui.js - UI 交互模块

import { PROJECT_ICONS, AI_PROVIDERS } from './config.js';
import { I18n } from './i18n.js';
import { Theme } from './theme.js';
import { ProjectStorage } from './storage.js';
import { AI } from './ai.js';
import { ResultFormatter } from './formatter.js';

// Import Projects at the end to minimize circular dependency issues
import { Projects } from './projects.js';

export const UI = {
  // Focus trap handler reference
  _focusTrapHandler: null,
  _previousActiveElement: null,

  // 模态框操作
  openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    // Fix Issue #12: Set aria-hidden on background
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.setAttribute('aria-hidden', 'true');
    }

    // Store the currently focused element to restore later
    this._previousActiveElement = document.activeElement;

    modal.classList.add('active');

    // Fix Issue #11: Add focus trap
    this._setupFocusTrap(modal);

    // Focus the first focusable element in the modal
    const firstFocusable = modal.querySelector('input, button, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
      setTimeout(() => firstFocusable.focus(), 50);
    }
  },

  closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove('active');
    }
    this._cleanupAfterModalClose();
  },

  closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.classList.remove('active');
    });
    this._cleanupAfterModalClose();
  },

  // Fix Issue #11: Focus trap implementation
  _setupFocusTrap(modal) {
    this._removeFocusTrap();

    this._focusTrapHandler = (e) => {
      if (e.key !== 'Tab') return;

      const focusableElements = modal.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', this._focusTrapHandler);
  },

  _removeFocusTrap() {
    if (this._focusTrapHandler) {
      document.removeEventListener('keydown', this._focusTrapHandler);
      this._focusTrapHandler = null;
    }
  },

  _cleanupAfterModalClose() {
    // Remove focus trap
    this._removeFocusTrap();

    // Fix Issue #12: Remove aria-hidden from background
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.removeAttribute('aria-hidden');
    }

    // Restore focus to previous element
    if (this._previousActiveElement) {
      this._previousActiveElement.focus();
      this._previousActiveElement = null;
    }
  },

  // Custom confirm modal - replaces native confirm()
  showConfirm(message) {
    return new Promise((resolve) => {
      const modal = document.getElementById('confirmModal');
      const messageEl = document.getElementById('confirmMessage');
      const confirmBtn = document.getElementById('confirmOkBtn');
      const cancelBtn = document.getElementById('confirmCancelBtn');

      if (!modal || !messageEl || !confirmBtn || !cancelBtn) {
        // Fallback to native confirm if modal not found
        resolve(confirm(message));
        return;
      }

      // Set message
      messageEl.textContent = message;

      // Store resolve function for button handlers
      this._confirmResolve = resolve;

      // Open modal using standard method
      this.openModal('confirmModal');

      // One-time event handlers
      const handleConfirm = () => {
        this.closeAllModals();
        resolve(true);
        cleanup();
      };

      const handleCancel = () => {
        this.closeAllModals();
        resolve(false);
        cleanup();
      };

      const cleanup = () => {
        confirmBtn.removeEventListener('click', handleConfirm);
        cancelBtn.removeEventListener('click', handleCancel);
        this._confirmResolve = null;
      };

      confirmBtn.addEventListener('click', handleConfirm);
      cancelBtn.addEventListener('click', handleCancel);
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

    // Update generate button text (preserve Lucide icon structure)
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
      const labels = this.getTabLabels();
      const span = generateBtn.querySelector('span[data-i18n="startGeneration"]');
      if (span) {
        span.textContent = labels[tabName] || I18n.t('startGeneration');
      }
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
    // Fix Issue #2: Validate selector before querySelector
    if (!selector || selector === '#') return;
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
    this.bindHamburgerMenu();
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

  // Fix Issue #10: Mobile Hamburger Menu Toggle
  bindHamburgerMenu() {
    const hamburger = document.getElementById('navHamburger');
    const mobileMenu = document.getElementById('navMobileMenu');

    if (!hamburger || !mobileMenu) return;

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', () => {
      const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('active');
      mobileMenu.setAttribute('aria-hidden', isExpanded);
    });

    // Close menu when clicking mobile links
    mobileMenu.querySelectorAll('.nav-mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('active');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('active');
        mobileMenu.setAttribute('aria-hidden', 'true');
      }
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
      this.clearFormErrors('createForm'); // Fix Issue #20: Clear validation errors on reset
      this.openModal('createModal');
    });

    document.getElementById('emptyCreateBtn')?.addEventListener('click', () => {
      document.getElementById('createForm')?.reset();
      this.clearFormErrors('createForm'); // Fix Issue #20: Clear validation errors on reset
      this.openModal('createModal');
    });

    // API Key 设置
    this.bindApiKeyEvents();
  },

  // Fix Issue #20: Clear form validation errors
  clearFormErrors(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.querySelectorAll('.form-group.error').forEach(group => {
      group.classList.remove('error');
    });
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
    const keyboardHint = document.getElementById('keyboardHint');

    // 添加键盘导航类
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
        // Fix Issue #6: Show keyboard hint on Tab press
        if (keyboardHint) {
          keyboardHint.classList.add('visible');
          // Hide after 3 seconds
          clearTimeout(this._keyboardHintTimeout);
          this._keyboardHintTimeout = setTimeout(() => {
            keyboardHint.classList.remove('visible');
          }, 3000);
        }
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-nav');
      // Hide keyboard hint on mouse click
      if (keyboardHint) {
        keyboardHint.classList.remove('visible');
      }
    });
  },

  bindAIGeneration() {
    const generateBtn = document.getElementById('generateBtn');

    generateBtn?.addEventListener('click', async () => {
      const idea = document.getElementById('aiIdeaInput')?.value?.trim();
      if (!idea) {
        // Fix Issue #5: Use existing translation key instead of missing 'enterIdea'
        this.showNotice(I18n.t('fillRequired'), 'error');
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
      // Restore button with Lucide icon (preserve icon structure)
      generateBtn.innerHTML = `<i data-lucide="rocket" class="icon"></i> <span data-i18n="startGeneration">${labels[this.currentAITab] || I18n.t('startGeneration')}</span>`;
      // Re-initialize Lucide icons
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }

      // Fix Issue #3, #14: Removed dead aiOutput code, result is displayed via aiResultContent

      // Show result section
      const aiResult = document.getElementById('aiResult');
      const aiResultContent = document.getElementById('aiResultContent');
      const saveToProjectBtn = document.getElementById('saveToProjectBtn');
      if (aiResult && aiResultContent) {
        if (!result.error) {
          aiResultContent.innerHTML = ResultFormatter.formatResult(result.content, this.currentAITab);
          aiResult.style.display = 'block';
          // Show save button when result is successful
          if (saveToProjectBtn) saveToProjectBtn.style.display = 'flex';
          // Re-create Lucide icons for section headers
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
        } else {
          aiResultContent.innerHTML = `<p class="result-p" style="color: #EF4444;">${result.message}</p>`;
          aiResult.style.display = 'block';
          if (saveToProjectBtn) saveToProjectBtn.style.display = 'none';
        }
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

    // Fix Issue #5/14: Save to Project button handler
    const saveToProjectBtn = document.getElementById('saveToProjectBtn');
    saveToProjectBtn?.addEventListener('click', () => {
      const content = document.getElementById('aiResultContent')?.textContent;
      const ideaInput = document.getElementById('aiIdeaInput');
      const idea = ideaInput?.value?.trim() || '';

      if (content) {
        // Create a new project with the AI result
        const name = idea.substring(0, 50) + (idea.length > 50 ? '...' : '');

        // Dynamically import to avoid circular dependency
        import('./storage.js').then(module => {
          const projects = module.ProjectStorage.getAll();
          const newProject = {
            id: module.ProjectStorage.generateId(),
            name: name || 'AI Generated Content',
            field: 'AI Generated',
            type: 'invention',
            description: content.substring(0, 500),
            date: new Date().toISOString().split('T')[0],
            icon: PROJECT_ICONS[projects.length % PROJECT_ICONS.length]
          };
          module.ProjectStorage.add(newProject);
          this.showNotice(I18n.t('createSuccess'), 'success');
          // Re-render projects
          import('./projects.js').then(p => p.Projects.render());
        });
      }
    });
  }
};