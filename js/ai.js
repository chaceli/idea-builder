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