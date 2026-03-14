# UI Bug Fixes Design Document

**Date:** 2026-03-14
**Status:** Approved
**Priority:** Critical - Blocks Production Release

## Overview

Three critical UI bugs discovered through systematic testing that prevent production deployment:

1. **Native confirm() usage** - Breaks custom modal system
2. **require() in browser** - Causes JavaScript errors
3. **Missing focus trap on edit modal** - Accessibility violation

## Bug #1: Native confirm() in Delete Action

### Problem

**File:** `js/projects.js` (lines 134-142)

The delete action has a fallback to native browser `confirm()`:

```javascript
async delete(id) {
  if (window.UI) {
    const confirmed = await UI.showConfirm(I18n.t('confirmDelete'));
    if (!confirmed) return;
  } else {
    if (!confirm(I18n.t('confirmDelete'))) return;  // BUG: native confirm
  }
  // ...
}
```

### Impact
- Breaks custom modal design consistency
- Bypasses focus trap system
- Creates jarring UX with browser native dialog

### Fix

Remove the else fallback. UI module is always available:

```javascript
async delete(id) {
  const confirmed = await UI.showConfirm(I18n.t('confirmDelete'));
  if (!confirmed) return;

  ProjectStorage.delete(id);
  this.render();
  UI.closeModal('detailModal');
  UI.showNotice(I18n.t('deleteSuccess'), 'success');
}
```

---

## Bug #2: require() in Browser Context

### Problem

**File:** `js/ui.js` (lines 688-689)

Duplicate imports using Node.js `require()` syntax in browser ES Module:

```javascript
const { ProjectStorage } = require('./storage.js');
const { PROJECT_ICONS } = require('./config.js');
```

### Impact
- `ReferenceError: require is not defined` in browser console
- Breaks JavaScript execution
- Blocks UI functionality

### Fix

Remove these lines entirely. The imports already exist at the top of the file:

```javascript
// Lines 1-3 of ui.js (already present)
import { PROJECT_ICONS, AI_PROVIDERS } from './config.js';
import { I18n } from './i18n.js';
import { Theme } from './theme.js';
import { ProjectStorage } from './storage.js';
```

---

## Bug #3: Edit Modal Missing Focus Trap

### Problem

**File:** `js/projects.js` (lines 127-131)

Edit modal uses direct class manipulation instead of `UI.openModal()`:

```javascript
setTimeout(() => {
  const editModal = document.getElementById('editModal');
  if (editModal) editModal.classList.add('active');  // Missing focus trap
}, 100);
```

### Impact
- No focus trap on edit modal
- Keyboard users can tab outside modal
- Screen reader accessibility broken
- Violates WCAG 2.1 Focus Management

### Fix

Use `UI.openModal()` which handles focus trap and aria-hidden:

```javascript
setTimeout(() => {
  UI.openModal('editModal');
}, 100);
```

---

## Files to Modify

| File | Lines | Change |
|------|-------|--------|
| `js/projects.js` | 134-152 | Remove native confirm fallback, simplify delete() |
| `js/ui.js` | 688-689 | Delete duplicate require() calls |
| `js/projects.js` | 127-131 | Replace classList.add with UI.openModal |

## Testing Checklist

After fixes:
- [ ] Delete project shows custom confirm modal
- [ ] Edit modal traps keyboard focus
- [ ] No console errors on page load
- [ ] AI modal opens correctly
- [ ] All modals close with Escape key
- [ ] Focus returns to trigger element after modal close

## Risk Assessment

**Risk Level:** Low

All fixes are simple code removals or replacements. No logic changes, no new features. The UI module is always loaded before projects.js runs.