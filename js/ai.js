// js/ai.js - AI API 调用

import { STORAGE_KEYS, AI_CONFIG } from './config.js';
import { Storage } from './storage.js';
import { I18n } from './i18n.js';

export const AI = {
  init() {
    const savedKey = Storage.get(STORAGE_KEYS.API_KEY);
    const apiKeyInput = document.getElementById('miniMaxApiKey');
    const notice = document.getElementById('apiKeyNotice');
    const settings = document.getElementById('apiKeySettings');

    if (savedKey && apiKeyInput) {
      apiKeyInput.value = savedKey;
      if (notice) notice.style.display = 'none';
      if (settings) settings.style.display = 'block';
    }
  },

  getApiKey() {
    return Storage.get(STORAGE_KEYS.API_KEY, '');
  },

  saveApiKey(key) {
    Storage.set(STORAGE_KEYS.API_KEY, key);
  },

  isConfigured() {
    const key = this.getApiKey();
    return key && key.trim().length > 0;
  },

  async callMiniMax(prompt) {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return { error: true, message: I18n.t('apiKeyNotConfigured') };
    }

    try {
      const response = await fetch(AI_CONFIG.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: AI_CONFIG.model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: AI_CONFIG.maxTokens
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        error: false,
        content: data.content?.[0]?.text || I18n.t('noResponse')
      };
    } catch (e) {
      return { error: true, message: I18n.t('apiError') + ': ' + e.message };
    }
  },

  async generatePrompt(idea) {
    const prompt = `Optimize this idea for AI interaction: ${idea}\n\nPlease provide an optimized prompt that will help AI better understand and work with this idea.`;
    return this.callMiniMax(prompt);
  },

  async generatePlan(idea) {
    const prompt = `Generate a detailed project plan for this idea: ${idea}\n\nPlease include:\n1. Project overview\n2. Key features\n3. Technical requirements\n4. Implementation steps\n5. Timeline estimates`;
    return this.callMiniMax(prompt);
  },

  async generatePatent(idea) {
    const prompt = `Generate a patent application draft for this idea: ${idea}\n\nPlease include:\n1. 技术领域 (Technical Field)\n2. 背景技术 (Background)\n3. 发明内容 (Invention Summary)\n4. 权利要求书 (Claims)\n5. 说明书摘要 (Abstract)`;
    return this.callMiniMax(prompt);
  },

  // Demo Mode - Check if should use demo mode
  shouldUseDemo() {
    return !this.isConfigured();
  },

  // Demo Mode - Generate demo prompt response
  getDemoPromptResponse(idea) {
    return `## 提示词模板：${idea}

### 英文提示词
A creative project featuring ${idea}, modern design, high quality, detailed, professional style.

### 中文提示词
一个创意项目，主题为${idea}，现代设计风格，高质量，细节丰富，专业呈现。

### 使用建议
1. 可根据具体需求调整风格关键词（如：minimalist, vintage, futuristic）
2. 添加具体场景描述以增强生成效果
3. 指定输出格式要求（如：4K, transparent background）
4. 结合其他 AI 工具（Midjourney、DALL-E）获得最佳效果

---
*此为演示输出，配置 API Key 后可获得真实 AI 生成内容*`;
  },

  // Demo Mode - Generate demo blueprint response
  getDemoBlueprintResponse(idea) {
    return `## 项目蓝图：${idea}

### 第一阶段：概念验证 (1-2周)
- **市场调研**：分析目标用户需求和竞品情况
- **技术可行性分析**：评估核心技术实现难度
- **原型设计**：制作低保真原型验证核心功能

### 第二阶段：产品开发 (4-6周)
- **核心功能开发**：实现 MVP 版本
- **UI/UX 设计**：打造用户友好的界面体验
- **测试与迭代**：收集反馈持续优化

### 第三阶段：市场推广 (2-3周)
- **营销材料准备**：产品介绍、演示视频
- **渠道建设**：选择合适的推广渠道
- **用户反馈收集**：建立反馈机制持续改进

### 关键里程碑
- Week 2: 原型完成
- Week 8: MVP 上线
- Week 11: 正式发布

---
*此为演示输出，配置 API Key 后可获得真实 AI 生成内容*`;
  },

  // Demo Mode - Generate demo patent response
  getDemoPatentResponse(idea) {
    return `## 专利申请书框架：${idea}

### 技术领域
本发明涉及${idea}相关的技术领域，具体涉及一种创新装置/方法。

### 背景技术
现有技术中存在以下不足：
1. 功能单一，无法满足多样化需求
2. 效率较低，用户体验有待提升
3. 成本较高，不利于大规模推广

### 发明内容
本发明针对上述问题，提供了一种创新的解决方案：
- 核心创新点 1：提高效率的关键技术
- 核心创新点 2：降低成本的设计方案
- 核心创新点 3：增强用户体验的优化措施

### 权利要求书
1. 一种${idea}装置，其特征在于包括：[核心组件A]、[核心组件B]和[核心组件C]。
2. 根据权利要求1所述的装置，其特征在于所述[组件A]采用[特定技术]实现。
3. 根据权利要求1所述的装置，其特征在于所述[组件B]配置为[特定功能]。

### 说明书摘要
本发明公开了一种${idea}装置及方法，通过[核心技术手段]解决[技术问题]，具有[有益效果]。

---
*此为演示输出，配置 API Key 后可获得真实 AI 生成内容*`;
  }
};