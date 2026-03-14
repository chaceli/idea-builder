// js/main.js - 应用入口

import { Theme } from './theme.js';
import { I18n } from './i18n.js';
import { Projects } from './projects.js';
import { AI } from './ai.js';
import { UI } from './ui.js';

// Initialize Lucide icons
if (typeof lucide !== 'undefined') {
  lucide.createIcons();
}

// 暴露到全局供 onclick 属性使用
window.Projects = Projects;
window.UI = UI;

// 应用初始化
document.addEventListener('DOMContentLoaded', () => {
  console.log('IDEA Builder initializing...');

  Theme.init();
  I18n.init();
  Projects.render();
  AI.init();
  UI.bindEvents();

  // Re-create icons after dynamic content
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  console.log('IDEA Builder initialized successfully');
});