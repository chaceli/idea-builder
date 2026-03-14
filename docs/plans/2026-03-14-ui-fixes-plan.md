# UI Bug Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix 3 critical UI bugs that block production release: native confirm(), require() in browser, and missing focus trap.

**Architecture:** Frontend ES Modules app with custom modal system. Fixes involve removing fallback code and using existing UI module methods consistently.

**Tech Stack:** Vanilla JavaScript (ES Modules), Lucide Icons, CSS with CSS Variables

---

## Bug #1: Native confirm() in Delete Action

### Task 1: Fix Delete Confirmation

**Files:**
- Modify: `js/projects.js:134-142`

**Step 1: Edit the delete method**

Remove the native confirm() fallback. The code should go from:

```javascript
async delete(id) {
  // Use custom confirmation instead of native confirm (Issue #2)
  if (window.UI) {
    const confirmed = await UI.showConfirm(I18n.t('confirmDelete'));
    if (!confirmed) return;
  } else {
    // Fallback to native confirm if UI not available
    if (!confirm(I18n.t('confirmDelete'))) return;
  }

  ProjectStorage.delete(id);
  this.render();
  if (window.UI) {
    UI.closeModal('detailModal');
    UI.showNotice(I18n.t('deleteSuccess'), 'success');
  } else {
    const detailModal = document.getElementById('detailModal');
    if (detailModal) detailModal.classList.remove('active');
  }
}
```

To:

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

**Step 2: Verify in browser**

1. Open `index.html` in browser
2. Create a test project
3. Click the project card to open detail modal
4. Click Delete button
5. **Expected:** Custom confirm modal appears (not browser native dialog)
6. Click Confirm to delete

**Step 3: Commit**

```bash
git add js/projects.js
git commit -m "fix: remove native confirm() fallback, use UI.showConfirm()"
```

---

## Bug #2: require() in Browser Context

### Task 2: Remove Invalid require() Calls

**Files:**
- Modify: `js/ui.js:688-689`

**Step 1: Remove the require lines**

Lines 688-689 currently have:

```javascript
const { ProjectStorage } = require('./storage.js');
const { PROJECT_ICONS } = require('./config.js');
```

Delete these two lines entirely. The imports already exist at the top of the file:

```javascript
// Lines 1-4 of ui.js (already present)
import { PROJECT_ICONS, AI_PROVIDERS } from './config.js';
import { I18n } from './i18n.js';
import { Theme } from './theme.js';
import { ProjectStorage } from './storage.js';
```

**Step 2: Verify in browser console**

1. Open `index.html` in browser
2. Open DevTools Console (F12)
3. **Expected:** No `ReferenceError: require is not defined` error
4. Click "Create Project" button
5. **Expected:** Modal opens without console errors

**Step 3: Commit**

```bash
git add js/ui.js
git commit -m "fix: remove invalid require() calls, use ES module imports"
```

---

## Bug #3: Edit Modal Missing Focus Trap

### Task 3: Add Focus Trap to Edit Modal

**Files:**
- Modify: `js/projects.js:127-131`

**Step 1: Replace classList.add with UI.openModal**

Change from:

```javascript
// Open edit modal after a short delay
setTimeout(() => {
  const editModal = document.getElementById('editModal');
  if (editModal) editModal.classList.add('active');
}, 100);
```

To:

```javascript
// Open edit modal after a short delay
setTimeout(() => {
  UI.openModal('editModal');
}, 100);
```

**Step 2: Verify focus trap**

1. Open `index.html` in browser
2. Create a test project
3. Click project card to open detail modal
4. Click Edit button
5. Press Tab key multiple times
6. **Expected:** Focus cycles within edit modal only (doesn't escape to background)
7. Press Escape key
8. **Expected:** Modal closes

**Step 3: Commit**

```bash
git add js/projects.js
git commit -m "fix: use UI.openModal for edit modal focus trap"
```

---

## Final Verification

### Task 4: Comprehensive Browser Testing

**Files:**
- Test: All modals and interactions

**Step 1: Full workflow test**

1. Open `index.html` in browser
2. Open DevTools Console (F12) - verify no errors
3. Create a new project (fill form, submit)
4. View project detail
5. Edit project (verify focus trap with Tab key)
6. Delete project (verify custom confirm modal)
7. Open AI modal, test all three tabs
8. Toggle dark/light theme
9. Toggle language (EN/中文)

**Step 2: Accessibility check**

1. Navigate using Tab key only
2. Verify all interactive elements are focusable
3. Verify Escape key closes all modals
4. Verify focus returns to trigger element after modal close

**Step 3: Final commit**

```bash
git add docs/plans/2026-03-14-ui-fixes-design.md docs/plans/2026-03-14-ui-fixes-plan.md
git commit -m "docs: add UI bug fixes design and implementation plan"
```

---

## Summary

| Bug | File | Lines | Fix |
|-----|------|-------|-----|
| #1 Native confirm | js/projects.js | 134-152 | Remove fallback, use UI.showConfirm() |
| #2 require() error | js/ui.js | 688-689 | Delete lines (imports exist at top) |
| #3 Missing focus trap | js/projects.js | 127-131 | Use UI.openModal() |

**Risk Level:** Low - All fixes are simple code removals or single-line replacements.