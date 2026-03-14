// js/formatter.js - AI Result Formatting

export const ResultFormatter = {
  /**
   * Format AI result based on type
   * @param {string} text - Raw AI output
   * @param {string} type - 'prompt', 'blueprint', or 'patent'
   * @returns {string} - Formatted HTML
   */
  formatResult(text, type) {
    if (!text) return '';

    // Try to parse as sections first
    const sections = this.parseSections(text, type);
    if (sections) {
      return sections;
    }

    // Fall back to markdown parsing
    return this.parseMarkdown(text);
  },

  /**
   * Parse basic markdown to HTML
   */
  parseMarkdown(text) {
    if (!text) return '';

    let html = text
      // Escape HTML
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Headers
      .replace(/^### (.*$)/gm, '<h3 class="result-h3">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="result-h2">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="result-h1">$1</h1>')
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Lists
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      // Numbered lists
      .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
      // Wrap consecutive li elements in ul
      .replace(/(<li>.*<\/li>\n?)+/g, '<ul class="result-list">$&</ul>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="result-p">')
      // Line breaks
      .replace(/\n/g, '<br>');

    return `<div class="result-content"><p class="result-p">${html}</p></div>`;
  },

  /**
   * Parse structured sections for patent/blueprint
   */
  parseSections(text, type) {
    if (type === 'patent') {
      return this.parsePatentSections(text);
    }
    if (type === 'blueprint') {
      return this.parseBlueprintSections(text);
    }
    return null;
  },

  /**
   * Parse patent document sections
   */
  parsePatentSections(text) {
    const sections = [
      { pattern: /###?\s*技术领域|###?\s*Technical\s*Field/i, title: '技术领域', titleEn: 'Technical Field', icon: 'cpu' },
      { pattern: /###?\s*背景技术|###?\s*Background/i, title: '背景技术', titleEn: 'Background', icon: 'history' },
      { pattern: /###?\s*发明内容|###?\s*Invention\s*Summary|###?\s*Summary/i, title: '发明内容', titleEn: 'Invention Summary', icon: 'lightbulb' },
      { pattern: /###?\s*权利要求书|###?\s*Claims/i, title: '权利要求书', titleEn: 'Claims', icon: 'scale' },
      { pattern: /###?\s*说明书摘要|###?\s*Abstract/i, title: '说明书摘要', titleEn: 'Abstract', icon: 'file-text' }
    ];

    return this.buildSectionCards(text, sections);
  },

  /**
   * Parse blueprint sections
   */
  parseBlueprintSections(text) {
    const sections = [
      { pattern: /###?\s*阶段|###?\s*Phase|###?\s*第.*阶段/i, title: '阶段', titleEn: 'Phase', icon: 'layers' },
      { pattern: /###?\s*里程碑|###?\s*Milestone/i, title: '里程碑', titleEn: 'Milestone', icon: 'flag' },
      { pattern: /###?\s*时间线|###?\s*Timeline|###?\s*Week\s*\d+/i, title: '时间线', titleEn: 'Timeline', icon: 'calendar' },
      { pattern: /###?\s*资源|###?\s*Resources/i, title: '资源', titleEn: 'Resources', icon: 'package' },
      { pattern: /###?\s*关键|###?\s*Key/i, title: '关键点', titleEn: 'Key Points', icon: 'key' }
    ];

    return this.buildSectionCards(text, sections);
  },

  /**
   * Build section cards from text
   */
  buildSectionCards(text, sectionDefs) {
    const lines = text.split('\n');
    let html = '';
    let currentSection = null;
    let currentContent = [];
    let foundAnySection = false;

    for (const line of lines) {
      let matchedSection = null;

      for (const section of sectionDefs) {
        if (section.pattern.test(line)) {
          matchedSection = section;
          break;
        }
      }

      if (matchedSection) {
        // Save previous section
        if (currentSection && currentContent.length > 0) {
          html += this.renderSectionCard(currentSection, currentContent.join('\n'));
          foundAnySection = true;
        }
        currentSection = matchedSection;
        currentContent = [];
      } else if (currentSection) {
        currentContent.push(line);
      }
    }

    // Save last section
    if (currentSection && currentContent.length > 0) {
      html += this.renderSectionCard(currentSection, currentContent.join('\n'));
      foundAnySection = true;
    }

    return foundAnySection ? html : null;
  },

  /**
   * Render a single section card
   */
  renderSectionCard(section, content) {
    const formattedContent = this.parseMarkdown(content.trim());
    return `
      <div class="result-section">
        <div class="result-section-header">
          <i data-lucide="${section.icon}" class="section-icon"></i>
          <span class="section-title">${section.title}</span>
        </div>
        <div class="result-section-content">
          ${formattedContent}
        </div>
      </div>
    `;
  }
};