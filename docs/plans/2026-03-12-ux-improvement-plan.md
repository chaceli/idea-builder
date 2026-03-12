# UX Improvement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve user experience by adding Toast notifications, Demo mode, feature differentiation tabs, and form validation.

**Architecture:** Enhance existing modules (ui.js, ai.js, styles.css) with new components. Toast system in UI module, Demo mode in AI module, tabs in HTML/CSS, validation in form handlers.

**Tech Stack:** Vanilla JavaScript ES Modules, CSS3 with CSS Variables, HTML5

---

## Task 1: Toast Notification Component (CSS)

**Files:**
- Modify: `css/styles.css` (append to end)

**Step 1: Add Toast CSS styles**

Add the following CSS to `css/styles.css` at the end of the file:

```css
/* ==================== Toast Notification Component ==================== */
.toast-container {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}

.toast {
  padding: 12px 24px;
  border-radius: 8px;
  background: var(--bg-card);
  box-shadow: var(--shadow-lg);
  animation: toastSlideIn 0.3s ease;
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  max-width: 400px;
}

.toast.success {
  border-left: 4px solid #10B981;
}

.toast.error {
  border-left: 4px solid #EF4444;
}

.toast.warning {
  border-left: 4px solid #F59E0B;
}

.toast.info {
  border-left: 4px solid #3B82F6;
}

.toast.hide {
  animation: toastSlideOut 0.3s ease forwards;
}

@keyframes toastSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes toastSlideOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
}
```

**Step 2: Commit**

```bash
git add css/styles.css
git commit -m "feat: add Toast notification CSS styles"
```

---

## Task 2: Toast Notification Component (JS)

**Files:**
- Modify: `js/ui.js:38-42` (replace showNotice method)

**Step 1: Add Toast container to HTML**

In `index.html`, add the toast container after the opening `<body>` tag (around line 15, after navbar):

```html
  <!-- Toast Notification Container -->
  <div class="toast-container" id="toastContainer"></div>
```

**Step 2: Replace showNotice method in ui.js**

Replace the existing `showNotice` method (lines 38-42) with the Toast implementation:

```javascript
  // Toast 通知系统
  showNotice(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // Add icon based on type
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
    container.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },
```

**Step 3: Commit**

```bash
git add index.html js/ui.js
git commit -m "feat: implement Toast notification component in JS"
```

---

## Task 3: Demo Mode (CSS)

**Files:**
- Modify: `css/styles.css` (append to end)

**Step 1: Add Demo mode CSS styles**

Add the following CSS to `css/styles.css`:

```css
/* ==================== Demo Mode Banner ==================== */
.demo-banner {
  background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
  border: 1px solid #F59E0B;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.demo-banner-icon {
  font-size: 24px;
}

.demo-banner-content {
  flex: 1;
}

.demo-banner-title {
  font-weight: 600;
  color: #92400E;
  margin-bottom: 2px;
}

.demo-banner-desc {
  font-size: 12px;
  color: #B45309;
}

.demo-banner a {
  color: #D97706;
  text-decoration: underline;
  font-size: 12px;
}

/* Dark mode demo banner */
html.dark .demo-banner,
html[data-theme="dark"] .demo-banner {
  background: linear-gradient(135deg, #78350F 0%, #92400E 100%);
  border-color: #B45309;
}

html.dark .demo-banner-title,
html[data-theme="dark"] .demo-banner-title {
  color: #FEF3C7;
}

html.dark .demo-banner-desc,
html[data-theme="dark"] .demo-banner-desc {
  color: #FDE68A;
}

html.dark .demo-banner a,
html[data-theme="dark"] .demo-banner a {
  color: #FBBF24;
}
```

**Step 2: Commit**

```bash
git add css/styles.css
git commit -m "feat: add Demo mode banner CSS styles"
```

---

## Task 4: Demo Mode (JS - Demo Response Generator)

**Files:**
- Modify: `js/ai.js` (add demo response methods)

**Step 1: Add demo response methods to AI module**

Add these methods to the AI object in `js/ai.js` (after the existing methods):

```javascript
  // Demo Mode - Check if should use demo mode
  shouldUseDemo() {
    return !this.isConfigured();
  },

  // Demo Mode - Generate demo prompt response
  getDemoPromptResponse(idea) {
    return `## 提示词模板：${idea}

### 英文提示词
A creative project featuring ${idea}, modern design, high quality, detailed, professional style.

### 中文提示词
一个创意项目，主题为${idea}，现代设计风格，高质量，细节丰富，专业呈现。

### 使用建议
1. 可根据具体需求调整风格关键词（如：minimalist, vintage, futuristic）
2. 添加具体场景描述以增强生成效果
3. 指定输出格式要求（如：4K, transparent background）
4. 结合其他 AI 工具（Midjourney、DALL-E）获得最佳效果

---
*此为演示输出，配置 API Key 后可获得真实 AI 生成内容*`;
  },

  // Demo Mode - Generate demo blueprint response
  getDemoBlueprintResponse(idea) {
    return `## 项目蓝图：${idea}

### 第一阶段：概念验证 (1-2周)
- **市场调研**：分析目标用户需求和竞品情况
- **技术可行性分析**：评估核心技术实现难度
- **原型设计**：制作低保真原型验证核心功能

### 第二阶段：产品开发 (4-6周)
- **核心功能开发**：实现 MVP 版本
- **UI/UX 设计**：打造用户友好的界面体验
- **测试与迭代**：收集反馈持续优化

### 第三阶段：市场推广 (2-3周)
- **营销材料准备**：产品介绍、演示视频
- **渠道建设**：选择合适的推广渠道
- **用户反馈收集**：建立反馈机制持续改进

### 关键里程碑
- Week 2: 原型完成
- Week 8: MVP 上线
- Week 11: 正式发布

---
*此为演示输出，配置 API Key 后可获得真实 AI 生成内容*`;
  },

  // Demo Mode - Generate demo patent response
  getDemoPatentResponse(idea) {
    return `## 专利申请书框架：${idea}

### 技术领域
本发明涉及${idea}相关的技术领域，具体涉及一种创新装置/方法。

### 背景技术
现有技术中存在以下不足：
1. 功能单一，无法满足多样化需求
2. 效率较低，用户体验有待提升
3. 成本较高，不利于大规模推广

### 发明内容
本发明针对上述问题，提供了一种创新的解决方案：
- 核心创新点 1：提高效率的关键技术
- 核心创新点 2：降低成本的设计方案
- 核心创新点 3：增强用户体验的优化措施

### 权利要求书
1. 一种${idea}装置，其特征在于包括：[核心组件A]、[核心组件B]和[核心组件C]。
2. 根据权利要求1所述的装置，其特征在于所述[组件A]采用[特定技术]实现。
3. 根据权利要求1所述的装置，其特征在于所述[组件B]配置为[特定功能]。

### 说明书摘要
本发明公开了一种${idea}装置及方法，通过[核心技术手段]解决[技术问题]，具有[有益效果]。

---
*此为演示输出，配置 API Key 后可获得真实 AI 生成内容*`;
  }
```

**Step 2: Commit**

```bash
git add js/ai.js
git commit -m "feat: add Demo mode response generators"
```

---

## Task 5: AI Tab Switching (CSS)

**Files:**
- Modify: `css/styles.css` (append to end)

**Step 1: Add AI tab styles**

Add the following CSS to `css/styles.css`:

```css
/* ==================== AI Generation Tabs ==================== */
.ai-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 8px;
}

.ai-tab {
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 6px 6px 0 0;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 6px;
}

.ai-tab:hover {
  color: var(--text);
  background: var(--bg);
}

.ai-tab.active {
  color: var(--primary);
  background: var(--bg-card);
  border-bottom: 2px solid var(--primary);
  margin-bottom: -9px;
}
```

**Step 2: Commit**

```bash
git add css/styles.css
git commit -m "feat: add AI generation tabs CSS styles"
```

---

## Task 6: AI Tab Switching (HTML + JS)

**Files:**
- Modify: `index.html:224-288` (aiModal section)
- Modify: `js/ui.js` (add tab switching logic)

**Step 1: Update AI Modal HTML structure**

Replace the AI modal content in `index.html` (lines 230-286) with tabbed version:

```html
      <div class="ai-modal-content">
        <!-- Demo Mode Banner -->
        <div class="demo-banner" id="demoBanner" style="display: none;">
          <div class="demo-banner-icon">🎯</div>
          <div class="demo-banner-content">
            <div class="demo-banner-title" data-i18n="demoMode">Demo Mode</div>
            <div class="demo-banner-desc" data-i18n="demoModeDesc">This is demo output. <a href="#" id="demoConfigLink">Configure API Key</a> for real AI generation.</div>
          </div>
        </div>

        <!-- API Key Tip -->
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

        <!-- AI Tabs -->
        <div class="ai-tabs" id="aiTabs">
          <button type="button" class="ai-tab active" data-tab="prompt">
            <span>🎯</span>
            <span data-i18n="promptGeneration">Prompt</span>
          </button>
          <button type="button" class="ai-tab" data-tab="blueprint">
            <span>📔</span>
            <span data-i18n="projectPlan">Blueprint</span>
          </button>
          <button type="button" class="ai-tab" data-tab="patent">
            <span>✨</span>
            <span data-i18n="patentGeneration">Patent</span>
          </button>
        </div>

        <!-- InputSection -->
        <div class="form-group">
          <label class="form-label" for="aiIdeaInput" data-i18n="describeIdea">Describe Your Idea *</label>
          <textarea class="form-textarea" id="aiIdeaInput" data-i18n-placeholder="ideaPlaceholder" placeholder="e.g., I want to build a smart home system..."></textarea>
        </div>

        <!-- GenerateButton -->
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
```

**Step 2: Add tab switching methods to ui.js**

Add these methods to the UI object in `js/ui.js`:

```javascript
  // AI Tab 状态
  currentAITab: 'prompt',

  switchAITab(tabName) {
    this.currentAITab = tabName;

    // Update tab buttons
    document.querySelectorAll('.ai-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    // Update generate button text
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
      const labels = {
        prompt: I18n.t('generatePrompt'),
        blueprint: I18n.t('generatePlan'),
        patent: I18n.t('generatePatent') || 'Generate Patent'
      };
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
```

**Step 3: Update bindFeatureCards method**

Replace the `bindFeatureCards` method in `js/ui.js` (lines 204-208):

```javascript
  bindFeatureCards() {
    document.querySelectorAll('.feature-card[data-feature="ai"]').forEach((card, index) => {
      card.addEventListener('click', () => {
        // index 0 → prompt, index 1 → blueprint, index 2 → patent
        this.openAIModal(index);
      });
    });
  },
```

**Step 4: Update bindEvents to include bindAITabs**

Add `this.bindAITabs();` to the `bindEvents` method (around line 52):

```javascript
  bindEvents() {
    this.bindThemeToggle();
    this.bindLangToggle();
    this.bindModalEvents();
    this.bindFormEvents();
    this.bindFeatureCards();
    this.bindSmoothScroll();
    this.bindKeyboardNav();
    this.bindAITabs();  // Add this line
    this.bindAIGeneration();
  },
```

**Step 5: Commit**

```bash
git add index.html js/ui.js
git commit -m "feat: implement AI tab switching and openAIModal with tab index"
```

---

## Task 7: Update AI Generation Logic with Demo Mode

**Files:**
- Modify: `js/ui.js:233-293` (bindAIGeneration method)

**Step 1: Update bindAIGeneration to use demo mode and tabs**

Replace the `bindAIGeneration` method in `js/ui.js` with:

```javascript
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
      const labels = {
        prompt: I18n.t('generatePrompt'),
        blueprint: I18n.t('generatePlan'),
        patent: I18n.t('generatePatent') || 'Generate Patent'
      };
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
```

**Step 2: Add generatePatent method to AI module**

Add to `js/ai.js` after `generatePlan` method:

```javascript
  async generatePatent(idea) {
    const prompt = `Generate a patent application draft for this idea: ${idea}\n\nPlease include:\n1. 技术领域 (Technical Field)\n2. 背景技术 (Background)\n3. 发明内容 (Invention Summary)\n4. 权利要求书 (Claims)\n5. 说明书摘要 (Abstract)`;
    return this.callMiniMax(prompt);
  }
```

**Step 3: Commit**

```bash
git add js/ui.js js/ai.js
git commit -m "feat: integrate Demo mode and tab-aware AI generation"
```

---

## Task 8: Form Validation Enhancement (CSS)

**Files:**
- Modify: `css/styles.css` (append to end)

**Step 1: Add form validation styles**

Add the following CSS to `css/styles.css`:

```css
/* ==================== Form Validation Styles ==================== */
.form-label .required {
  color: #EF4444;
  margin-left: 2px;
}

.form-group.error .form-input,
.form-group.error .form-textarea,
.form-group.error .form-select {
  border-color: #EF4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
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

/* Required field indicator */
.form-label.required::after {
  content: ' *';
  color: #EF4444;
}
```

**Step 2: Commit**

```bash
git add css/styles.css
git commit -m "feat: add form validation CSS styles"
```

---

## Task 9: Form Validation Enhancement (HTML + JS)

**Files:**
- Modify: `index.html` (form labels)
- Modify: `js/ui.js` (add validation methods)

**Step 1: Update form labels with required indicator**

In `index.html`, update the form labels to include required markers:

For Create Modal (around lines 175-195):
```html
        <div class="form-group">
          <label class="form-label" for="projectName" data-i18n="projectName">Project Name<span class="required">*</span></label>
          <input type="text" class="form-input" id="projectName" name="name" required>
          <div class="error-message" data-i18n="requiredField">This field is required</div>
        </div>
        <div class="form-group">
          <label class="form-label" for="projectField" data-i18n="techField">Tech Field<span class="required">*</span></label>
          <input type="text" class="form-input" id="projectField" name="field" required>
          <div class="error-message" data-i18n="requiredField">This field is required</div>
        </div>
        <div class="form-group">
          <label class="form-label" for="projectType" data-i18n="projectType">Project Type<span class="required">*</span></label>
          <select class="form-input" id="projectType" name="type" required>
            <!-- Options rendered dynamically -->
          </select>
          <div class="error-message" data-i18n="requiredField">This field is required</div>
        </div>
        <div class="form-group">
          <label class="form-label" for="projectDesc" data-i18n="projectDesc">Description</label>
          <textarea class="form-textarea" id="projectDesc" name="description"></textarea>
        </div>
```

For Edit Modal (around lines 200-215), apply similar changes.

**Step 2: Add inline validation to ui.js**

Add these validation methods to UI object in `js/ui.js`:

```javascript
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
```

**Step 3: Update bindEvents to include form validation**

Add `this.bindFormValidation();` to the `bindEvents` method:

```javascript
  bindEvents() {
    this.bindThemeToggle();
    this.bindLangToggle();
    this.bindModalEvents();
    this.bindFormEvents();
    this.bindFeatureCards();
    this.bindSmoothScroll();
    this.bindKeyboardNav();
    this.bindAITabs();
    this.bindFormValidation();  // Add this line
    this.bindAIGeneration();
  },
```

**Step 4: Update bindCreateForm to use validateForm**

Replace the validation check in `bindCreateForm`:

```javascript
      if (!this.validateForm(form)) {
        this.showNotice(I18n.t('fillRequired'), 'error');
        return;
      }
```

**Step 5: Commit**

```bash
git add index.html js/ui.js
git commit -m "feat: add inline form validation with required field indicators"
```

---

## Task 10: Add Translation Keys

**Files:**
- Modify: `js/config.js` (add new translations)

**Step 1: Add new translation keys to both zh and en sections**

Add these translations to the `translations` object in `js/config.js`:

For `zh` section (after `apiError`):
```javascript
    // Demo Mode
    demoMode: '🎯 演示模式',
    demoModeDesc: '此为演示输出，<a href="#" id="demoConfigLink">配置 API Key</a> 以使用真实 AI 生成',
    patentGeneration: '专利生成',

    // Form
    requiredField: '此字段为必填项',
    copied: '已复制到剪贴板',
    generatePatent: '生成专利'
```

For `en` section (after `apiError`):
```javascript
    // Demo Mode
    demoMode: '🎯 Demo Mode',
    demoModeDesc: 'This is demo output. <a href="#" id="demoConfigLink">Configure API Key</a> for real AI generation.',
    patentGeneration: 'Patent Generation',

    // Form
    requiredField: 'This field is required',
    copied: 'Copied to clipboard',
    generatePatent: 'Generate Patent'
```

**Step 2: Commit**

```bash
git add js/config.js
git commit -m "feat: add translation keys for new UX features"
```

---

## Task 11: Final Integration Test

**Files:**
- None (testing only)

**Step 1: Test Toast notifications**

Open the application and test:
1. Create a project without filling required fields → Should show error toast
2. Create a valid project → Should show success toast
3. Delete a project → Should show success toast

**Step 2: Test Demo mode**

1. Clear API Key from localStorage
2. Open AI modal → Should show Demo banner
3. Generate content → Should show demo response
4. Click demo config link → Should show API key settings

**Step 3: Test tab switching**

1. Click each feature card → Should open AI modal with correct tab selected
2. Switch between tabs → Button text should update
3. Generate with different tabs → Should call correct generator

**Step 4: Test form validation**

1. Try to submit empty form → Should show inline errors
2. Fill one field → Error should clear
3. Submit valid form → Should succeed

**Step 5: Commit final state**

```bash
git add -A
git commit -m "feat: complete UX improvement implementation

- Add Toast notification system
- Implement Demo mode for AI features
- Add tab switching for Prompt/Blueprint/Patent
- Add inline form validation
- Add all required translations"
```

---

## Execution Summary

| Task | Description | Files Changed |
|------|-------------|---------------|
| 1 | Toast CSS | css/styles.css |
| 2 | Toast JS + HTML | index.html, js/ui.js |
| 3 | Demo CSS | css/styles.css |
| 4 | Demo JS | js/ai.js |
| 5 | Tabs CSS | css/styles.css |
| 6 | Tabs HTML + JS | index.html, js/ui.js |
| 7 | AI Generation Logic | js/ui.js, js/ai.js |
| 8 | Form Validation CSS | css/styles.css |
| 9 | Form Validation HTML + JS | index.html, js/ui.js |
| 10 | Translations | js/config.js |
| 11 | Testing | None |