// tests/e2e/profile.spec.ts

/**
 * E2E 测试：个人中心
 * 
 * 测试场景：
 * 1. 查看个人资料
 * 2. 修改头像
 * 3. 查看会员信息
 * 4. 退出登录
 */

import { test, expect } from '@playwright/test';

test.describe('个人中心 E2E', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/pages/profile/index');
  });

  test('应该显示用户信息', async ({ page }) => {
    // 验证头像存在
    const avatar = page.locator('.avatar');
    await expect(avatar).toBeVisible();
    
    // 验证昵称存在
    const nickname = page.locator('.nickname');
    await expect(nickname).toBeVisible();
  });

  test('应该能进入聊天页面', async ({ page }) => {
    // 点击聊天入口
    await page.locator('text=与小桃聊天').click();
    
    // 验证跳转
    await page.waitForURL('**/pages/chat/index');
  });

  test('应该能进入日程页面', async ({ page }) => {
    // 点击日程入口
    await page.locator('text=日程提醒').click();
    
    // 验证跳转
    await page.waitForURL('**/pages/schedule/index');
  });

  test('应该显示会员卡片', async ({ page }) => {
    const vipCard = page.locator('text=开通会员');
    await expect(vipCard).toBeVisible();
    
    const price = page.locator('text=¥9.9/月');
    await expect(price).toBeVisible();
  });
});
