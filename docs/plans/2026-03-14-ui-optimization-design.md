# UI Optimization Design Document

**Date:** 2026-03-14
**Status:** Approved
**Approach:** Incremental Enhancement

## Overview

Redesign the IDEA Builder UI with three core improvements:
1. Replace emoji icons with Lucide SVG icons
2. Add glassmorphism visual effects with accessibility guards
3. Implement formatted AI result display with section highlighting
4. Make modals responsive with fluid width breakpoints

## Icon System

### Lucide Icons Integration

**CDN:**
```html
<script src="https://unpkg.com/lucide@latest"></script>
```

**Icon Mappings:**

| Current Emoji | Lucide Icon | Usage |
|--------------|-------------|-------|
| 💡 | `lightbulb` | Brand logo, idea-related |
| 🎯 | `target` | Prompt generation tab |
| 📔 | `book-open` | Blueprint generation tab |
| ✨ | `sparkles` | Patent generation, create buttons |
| 🌙 | `moon` | Dark mode toggle |
| ☀️ | `sun` | Light mode toggle |
| 🤖 | `bot` | AI modal title |
| 📋 | `clipboard` | Copy button |
| 🚀 | `rocket` | Generate button |
| 📄 | `file-text` | Document icons |
| ✏️ | `pencil` | Edit actions |
| 🗑️ | `trash-2` | Delete actions |
| 📭 | `inbox` | Empty state |
| 🎓 | `graduation-cap` | Patent type - invention |
| 🔧 | `wrench` | Patent type - utility |
| 🎨 | `palette` | Patent type - design |

**Implementation:**
- Replace emojis with `<i data-lucide="icon-name" class="icon"></i>`
- Call `lucide.createIcons()` after DOM loads and after dynamic content updates
- Icons inherit text color, work with both themes automatically
- Default icon sizes: 16px (small), 20px (medium), 24px (large)

## Glassmorphism Design System

### Core CSS Utilities

```css
/* Glassmorphism base */
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.dark .glass {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Glass card variant */
.glass-card {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Glass modal variant */
.glass-modal {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
```

### Components to Update

| Component | Effect |
|-----------|--------|
| `.navbar` | Glass background, stronger blur |
| `.modal` | Glass modal with layered shadow |
| `.feature-card` | Glass card on hover |
| `.project-card` | Subtle glass effect |
| `.ai-result` | Glass container for output |

### Accessibility Guards

```css
@media (prefers-reduced-motion: reduce) {
  .glass {
    backdrop-filter: none;
    background: var(--bg-card);
  }
}

@media (prefers-contrast: high) {
  .glass {
    backdrop-filter: none;
    background: var(--bg-card);
    border-width: 2px;
  }
}
```

## AI Result Formatting

### ResultFormatter Module

New file: `js/formatter.js`

**Methods:**

```javascript
export const ResultFormatter = {
  // Main entry point
  formatResult(text, type) { /* ... */ },

  // Parse markdown basics
  parseMarkdown(text) { /* ... */ },

  // Detect and wrap structured sections
  parseSections(text, type) { /* ... */ },

  // Render a section card
  renderSection(section) { /* ... */ }
};
```

### Patent Section Detection

| Section (CN) | Section (EN) | Icon |
|--------------|--------------|------|
| 技术领域 | Technical Field | `cpu` |
| 背景技术 | Background | `history` |
| 发明内容 | Invention Summary | `lightbulb` |
| 权利要求书 | Claims | `scale` |
| 说明书摘要 | Abstract | `file-text` |

### Blueprint Section Detection

| Section | Icon |
|---------|------|
| Phase / 阶段 | `layers` |
| Milestone / 里程碑 | `flag` |
| Timeline / 时间线 | `calendar` |
| Resources / 资源 | `package` |

### Section Card CSS

```css
.result-section {
  background: rgba(99, 102, 241, 0.05);
  border-left: 3px solid var(--primary);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.result-section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-weight: 600;
  color: var(--text);
}

.result-section-content {
  color: var(--text-secondary);
  line-height: 1.7;
}
```

## Modal Responsiveness

### Fluid Width Breakpoints

```css
.modal {
  width: 90%;
  max-width: 480px;
  max-height: 85vh;
}

@media (min-width: 768px) {
  .modal { max-width: 600px; padding: 36px; }
}

@media (min-width: 1024px) {
  .modal { max-width: 800px; padding: 40px; }
  .modal.modal-ai { max-width: 900px; }
}

@media (min-width: 1440px) {
  .modal { max-width: 1000px; }
  .modal.modal-ai { max-width: 1100px; }
}
```

### AI Modal Two-Column Layout

```css
@media (min-width: 1024px) {
  .modal-ai .ai-modal-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  .modal-ai .ai-input-section { grid-column: 1; }
  .modal-ai .ai-result-section { grid-column: 2; }
}
```

## Files to Modify

| File | Changes |
|------|---------|
| `index.html` | Add Lucide CDN, replace emojis with icon placeholders, add modal classes |
| `css/styles.css` | Add glassmorphism utilities, modal breakpoints, result formatting styles |
| `js/main.js` | Initialize Lucide icons after DOM load |
| `js/ui.js` | Call `lucide.createIcons()` after dynamic content |
| `js/formatter.js` | New file - ResultFormatter class |

## Accessibility Checklist

- [ ] `prefers-reduced-motion` disables backdrop-blur
- [ ] `prefers-contrast: high` uses solid backgrounds
- [ ] Icons have `aria-hidden="true"` (decorative)
- [ ] Focus states remain visible on glass backgrounds
- [ ] Color contrast meets WCAG AA on glass surfaces

## Testing Priorities

1. Icon rendering on initial load
2. Icon rendering after project cards load
3. AI result formatting (prompt, blueprint, patent)
4. Modal sizing on different viewports
5. Reduced-motion preference
6. High-contrast mode