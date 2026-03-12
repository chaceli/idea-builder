# Multi-Provider API Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix MiniMax API integration and add OpenAI provider support with dropdown selector.

**Architecture:** Replace single-provider config with multi-provider system. Both providers use OpenAI-compatible API format. Store provider selection in localStorage alongside API key.

**Tech Stack:** Vanilla JavaScript ES Modules, localStorage, Fetch API

---

## Task 1: Add Provider Configuration

**Files:**
- Modify: `js/config.js`

**Step 1: Add AI_PROVIDERS config and update STORAGE_KEYS**

Replace the `AI_CONFIG` export and update `STORAGE_KEYS` in `js/config.js`:

```javascript
export const STORAGE_KEYS = {
  PROJECTS: 'idea-builder-projects',
  THEME: 'idea-builder-theme',
  LANG: 'idea-builder-lang',
  API_KEY: 'idea-builder-api-key',
  API_PROVIDER: 'idea-builder-api-provider'
};

export const AI_PROVIDERS = {
  minimax: {
    name: 'MiniMax',
    model: 'MiniMax-M2',
    apiUrl: 'https://api.minimax.chat/v1/chat/completions',
    keyPlaceholder: 'Enter your MiniMax API Key'
  },
  openai: {
    name: 'OpenAI',
    model: 'gpt-4o',
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    keyPlaceholder: 'Enter your OpenAI API Key (sk-...)'
  }
};
```

**Step 2: Commit**

```bash
git add js/config.js
git commit -m "feat: add multi-provider API configuration"
```

---

## Task 2: Update AI Module

**Files:**
- Modify: `js/ai.js`

**Step 1: Update imports**

Change the import at the top of `js/ai.js`:

```javascript
import { STORAGE_KEYS, AI_PROVIDERS } from './config.js';
```

**Step 2: Add provider methods**

Add these methods to the AI object (after `isConfigured()` method):

```javascript
  getProvider() {
    const providerId = Storage.get(STORAGE_KEYS.API_PROVIDER, 'minimax');
    return AI_PROVIDERS[providerId] || AI_PROVIDERS.minimax;
  },

  getApiUrl() {
    return this.getProvider().apiUrl;
  },

  getModel() {
    return this.getProvider().model;
  },

  saveProvider(providerId) {
    Storage.set(STORAGE_KEYS.API_PROVIDER, providerId);
  },
```

**Step 3: Fix callMiniMax method**

Replace the entire `callMiniMax` method with:

```javascript
  async callMiniMax(prompt) {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return { error: true, message: I18n.t('apiKeyNotConfigured') };
    }

    try {
      const response = await fetch(this.getApiUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: this.getModel(),
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        error: false,
        content: data.choices?.[0]?.message?.content || I18n.t('noResponse')
      };
    } catch (e) {
      return { error: true, message: I18n.t('apiError') + ': ' + e.message };
    }
  },
```

**Step 4: Commit**

```bash
git add js/ai.js
git commit -m "fix: correct API endpoint and response parsing, add provider methods"
```

---

## Task 3: Update HTML for Provider Selection

**Files:**
- Modify: `index.html`

**Step 1: Update API Key Settings section**

Find the `apiKeySettings` div (around line 238) and replace with:

```html
        <!-- API Key Settings -->
        <div id="apiKeySettings" style="display: none; margin-bottom: 20px;">
          <div class="form-group">
            <label class="form-label" for="apiProvider">API Provider</label>
            <select class="form-input" id="apiProvider">
              <option value="minimax">MiniMax</option>
              <option value="openai">OpenAI</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="apiKeyInput" data-i18n="apiKeyLabel">API Key</label>
            <input type="password" class="form-input" id="apiKeyInput" data-i18n-placeholder="apiKeyPlaceholder" placeholder="Enter your API Key">
          </div>
          <button type="button" class="btn btn-primary" id="saveApiKeyBtn" style="width: 100%;" data-i18n="saveApiKey">Save API Key</button>
        </div>
```

**Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add API provider dropdown selector"
```

---

## Task 4: Update UI Module for Provider Events

**Files:**
- Modify: `js/ui.js`

**Step 1: Update imports**

Add `AI_PROVIDERS` to the import at the top:

```javascript
import { PROJECT_ICONS, AI_PROVIDERS } from './config.js';
```

**Step 2: Add provider event binding method**

Add this method to the UI object (after `bindApiKeyEvents`):

```javascript
  bindProviderEvents() {
    const providerSelect = document.getElementById('apiProvider');
    const apiKeyInput = document.getElementById('apiKeyInput');

    // Load saved provider
    const savedProvider = Storage.get(STORAGE_KEYS.API_PROVIDER, 'minimax');
    if (providerSelect) {
      providerSelect.value = savedProvider;
      this.updateApiKeyPlaceholder(savedProvider);
    }

    // Load saved API key
    const savedKey = AI.getApiKey();
    if (apiKeyInput && savedKey) {
      apiKeyInput.value = savedKey;
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
```

**Step 3: Update bindEvents**

Add `this.bindProviderEvents();` to the `bindEvents` method:

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
    this.bindFormValidation();
    this.bindProviderEvents();  // Add this line
    this.bindAIGeneration();
  },
```

**Step 4: Update bindApiKeyEvents**

Update the save button handler to use the new input ID:

```javascript
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
```

**Step 5: Add STORAGE_KEYS import**

Make sure `STORAGE_KEYS` is imported from config:

```javascript
import { PROJECT_ICONS, AI_PROVIDERS, STORAGE_KEYS } from './config.js';
```

**Step 6: Commit**

```bash
git add js/ui.js
git commit -m "feat: add provider selection event handling"
```

---

## Task 5: Update AI.init for New Input ID

**Files:**
- Modify: `js/ai.js`

**Step 1: Update init method**

Update the `init` method to use the new input ID:

```javascript
  init() {
    const savedKey = Storage.get(STORAGE_KEYS.API_KEY);
    const savedProvider = Storage.get(STORAGE_KEYS.API_PROVIDER, 'minimax');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const providerSelect = document.getElementById('apiProvider');
    const notice = document.getElementById('apiKeyNotice');
    const settings = document.getElementById('apiKeySettings');

    if (apiKeyInput && savedKey) {
      apiKeyInput.value = savedKey;
    }
    if (providerSelect && savedProvider) {
      providerSelect.value = savedProvider;
    }
    if (savedKey && notice) {
      notice.style.display = 'none';
    }
    if (savedKey && settings) {
      settings.style.display = 'block';
    }
  },
```

**Step 2: Commit**

```bash
git add js/ai.js
git commit -m "fix: update AI.init to use new input element IDs"
```

---

## Task 6: Final Integration Test

**Files:**
- None (testing only)

**Step 1: Test in browser**

1. Open `index.html` in browser
2. Click "Settings" in AI modal
3. Verify provider dropdown shows MiniMax and OpenAI
4. Select OpenAI, verify placeholder changes
5. Select MiniMax, verify placeholder changes
6. Enter a valid API Key
7. Test AI generation
8. Verify response displays correctly

**Step 2: Commit if all tests pass**

```bash
git add -A
git commit -m "feat: complete multi-provider API integration with MiniMax and OpenAI support"
```

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Add provider config | js/config.js |
| 2 | Update AI module | js/ai.js |
| 3 | Update HTML | index.html |
| 4 | Add UI binding | js/ui.js |
| 5 | Fix AI.init | js/ai.js |
| 6 | Integration test | None |