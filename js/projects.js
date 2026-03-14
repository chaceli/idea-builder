// js/projects.js - 项目 CRUD 操作

import { PROJECT_ICONS, PROJECT_TYPES } from './config.js';
import { ProjectStorage } from './storage.js';
import { I18n } from './i18n.js';

// Note: UI is imported dynamically to avoid circular dependency issues
// The UI module imports Projects, so we reference window.UI at runtime

export const Projects = {
  // Helper to create Lucide icon HTML
  createIcon(iconName, className = 'icon') {
    return `<i data-lucide="${iconName}" class="${className}"></i>`;
  },

  render() {
    const projects = ProjectStorage.getAll();
    const grid = document.getElementById('projectsGrid');
    const emptyState = document.getElementById('emptyState');

    if (!grid || !emptyState) return;

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
      const iconName = project.icon || PROJECT_ICONS[index % PROJECT_ICONS.length];

      return `
        <article class="project-card" data-id="${project.id}" tabindex="0">
          <div class="project-cover">${this.createIcon(iconName)}</div>
          <div class="project-info">
            <h3 class="project-name">${this.escapeHtml(project.name)}</h3>
            <p class="project-desc">${this.escapeHtml(project.description || I18n.t('noDesc'))}</p>
            <div class="project-meta">
              <span class="project-tag ${typeInfo.class}">${this.createIcon(typeInfo.icon, 'icon-sm')} ${I18n.t(project.type)}</span>
              <span class="project-date">${project.date || ''}</span>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Initialize Lucide icons for the new content
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    this.bindCardEvents();
  },

  bindCardEvents() {
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', () => {
        this.showDetail(card.dataset.id);
      });
    });
  },

  showDetail(id) {
    const project = ProjectStorage.getById(id);
    if (!project) {
      alert(I18n.t('notExist'));
      return;
    }

    const typeInfo = PROJECT_TYPES[project.type] || PROJECT_TYPES.invention;
    const content = document.getElementById('detailContent');
    if (!content) return;

    content.innerHTML = `
      <div class="project-detail-icon">${this.createIcon(project.icon || 'file-text')}</div>
      <h2 class="project-detail-name">${this.escapeHtml(project.name)}</h2>
      <div class="project-detail-meta">
        <span class="project-tag ${typeInfo.class}">${this.createIcon(typeInfo.icon, 'icon-sm')} ${I18n.t(project.type)}</span>
        <span>${this.escapeHtml(project.field)}</span>
      </div>
      <p class="project-detail-desc">${this.escapeHtml(project.description || I18n.t('noDesc'))}</p>
      <div class="project-detail-actions">
        <button class="btn btn-secondary" onclick="Projects.openEdit('${id}')">${this.createIcon('pencil', 'icon-sm')} ${I18n.t('edit')}</button>
        <button class="btn btn-danger" onclick="Projects.delete('${id}')">${this.createIcon('trash-2', 'icon-sm')} ${I18n.t('delete')}</button>
      </div>
    `;

    // Initialize Lucide icons for the new content
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Open modal
    const modal = document.getElementById('detailModal');
    if (modal) modal.classList.add('active');
  },

  openEdit(id) {
    const project = ProjectStorage.getById(id);
    if (!project) return;

    // Close detail modal
    const detailModal = document.getElementById('detailModal');
    if (detailModal) detailModal.classList.remove('active');

    // Fill edit form
    document.getElementById('editProjectId').value = project.id;
    document.getElementById('editProjectName').value = project.name;
    document.getElementById('editProjectField').value = project.field;
    document.getElementById('editProjectType').value = project.type;
    document.getElementById('editProjectDesc').value = project.description || '';

    // Open edit modal after a short delay
    setTimeout(() => {
      const editModal = document.getElementById('editModal');
      if (editModal) editModal.classList.add('active');
    }, 100);
  },

  delete(id) {
    if (!confirm(I18n.t('confirmDelete'))) return;

    ProjectStorage.delete(id);
    this.render();

    // Close detail modal
    const detailModal = document.getElementById('detailModal');
    if (detailModal) detailModal.classList.remove('active');

    alert(I18n.t('deleteSuccess'));
  },

  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};