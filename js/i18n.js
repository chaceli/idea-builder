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