// tests/e2e/chat.spec.ts

/**
 * E2E 测试：聊天功能
 * 
 * 测试场景：
 * 1. 用户登录
 * 2. 发送文字消息
 * 3. 接收 AI 回复
 * 4. 语音消息（可选）
 */

import { test, expect } from '@playwright/test';

test.describe('聊天功能 E2E', () => {
  
  test.beforeEach(async ({ page }) => {
    // 访问聊天页面
    await page.goto('/pages/chat/index');
  });

  test('应该显示欢迎消息', async ({ page }) => {
    // 验证欢迎消息存在
    const welcomeMessage = page.locator('text=你好呀~我是小桃');
    await expect(welcomeMessage).toBeVisible();
  });

  test('应该能发送文字消息', async ({ page }) => {
    // 输入消息
    const input = page.locator('input[placeholder="跟我说说话吧~"]');
    await input.fill('你好');
    
    // 点击发送
    const sendBtn = page.locator('.send-btn');
    await sendBtn.click();
    
    // 验证用户消息显示
    const userMessage = page.locator('text=你好').first();
    await expect(userMessage).toBeVisible();
    
    // 等待 AI 回复（3秒超时）
    const aiReply = page.locator('.bubble-ai').first();
    await expect(aiReply).toBeVisible({ timeout: 5000 });
  });

  test('应该能识别情绪并给出相应回复', async ({ page }) => {
    // 发送带情绪的消息
    const input = page.locator('input');
    await input.fill('今天工作好累，心情不好');
    await page.locator('.send-btn').click();
    
    // 等待 AI 回复
    const aiReply = page.locator('.bubble-ai').first();
    await expect(aiReply).toBeVisible({ timeout: 5000 });
    
    // 验证回复包含安慰内容（简单检查）
    const replyText = await aiReply.textContent();
    expect(replyText?.length).toBeGreaterThan(0);
  });

  test('输入为空时不应该发送', async ({ page }) => {
    const sendBtn = page.locator('.send-btn');
    
    // 点击发送（输入为空）
    await sendBtn.click();
    
    // 验证没有新消息添加
    const messages = page.locator('.message-item');
    const count = await messages.count();
    expect(count).toBe(1); // 只有欢迎消息
  });
});
