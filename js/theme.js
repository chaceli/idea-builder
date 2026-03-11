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