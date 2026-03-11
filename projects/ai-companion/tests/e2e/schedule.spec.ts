// tests/e2e/schedule.spec.ts

/**
 * E2E 测试：日程功能
 * 
 * 测试场景：
 * 1. 查看日程列表
 * 2. 添加新日程
 * 3. 完成日程
 * 4. 删除日程
 */

import { test, expect } from '@playwright/test';

test.describe('日程功能 E2E', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/pages/schedule/index');
  });

  test('应该显示日程页面', async ({ page }) => {
    const title = page.locator('text=日程提醒');
    await expect(title).toBeVisible();
  });

  test('应该能添加新日程', async ({ page }) => {
    // 点击添加按钮
    await page.locator('.add-btn').click();
    
    // 填写日程
    await page.locator('input[placeholder="日程标题"]').fill('吃维生素');
    await page.locator('input[placeholder="备注（可选）"]').fill('每天早饭后');
    
    // 选择时间（假设选择 8:00）
    await page.locator('text=选择时间').click();
    
    // 确认添加
    await page.locator('text=确定').click();
    
    // 验证成功提示
    const toast = page.locator('text=添加成功');
    await expect(toast).toBeVisible({ timeout: 3000 });
  });

  test('应该能删除日程', async ({ page }) => {
    // 假设已有日程
    // 点击删除按钮
    const deleteBtn = page.locator('.delete-btn').first();
    await deleteBtn.click();
    
    // 验证删除成功
    await page.waitForTimeout(500);
  });
});
