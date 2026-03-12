# 多服务商 API 集成设计

## 概述

修复 MiniMax API 调用问题，并扩展支持 OpenAI 等多服务商，让用户可以选择自己喜欢的 AI 服务商。

## 问题分析

### 当前问题

1. **API 端点错误**: 使用 `api.minimaxi.com/anthropic/v1/messages`，该端点不存在或格式不对
2. **响应解析错误**: 使用 `data.content[0].text`，但实际应该是 `data.choices[0].message.content`
3. **单服务商限制**: 只支持 MiniMax，用户无法选择其他服务商

### 正确的 API 格式

MiniMax 和 OpenAI 都使用 OpenAI 兼容格式：

**请求:**
```json
{
  "model": "MiniMax-M2",
  "messages": [{ "role": "user", "content": "..." }],
  "max_tokens": 2000
}
```

**响应:**
```json
{
  "choices": [{
    "message": { "content": "..." }
  }]
}
```

---

## 解决方案

### 支持的服务商

| Provider | Model | API Endpoint |
|----------|-------|--------------|
| MiniMax | MiniMax-M2 | `https://api.minimax.chat/v1/chat/completions` |
| OpenAI | gpt-4o | `https://api.openai.com/v1/chat/completions` |

### 配置结构

```javascript
// js/config.js
export const AI_PROVIDERS = {
  minimax: {
    name: 'MiniMax',
    model: 'MiniMax-M2',
    apiUrl: 'https://api.minimax.chat/v1/chat/completions',
    keyPlaceholder: 'Enter your MiniMax API Key'
  },
  openai: {
    name: 'OpenAI',
    model: 'gpt-4o',
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    keyPlaceholder: 'Enter your OpenAI API Key (sk-...)'
  }
};

export const STORAGE_KEYS = {
  // ... existing keys ...
  API_KEY: 'idea-builder-api-key',
  API_PROVIDER: 'idea-builder-api-provider'  // 新增
};
```

---

## UI 变更

### AI Modal 结构

```
┌─────────────────────────────────────────┐
│ 🤖 AI Generation                     ×  │
├─────────────────────────────────────────┤
│ API Provider                            │
│ ┌─────────────────────────────────────┐│
│ │ MiniMax                        ▼   ││
│ └─────────────────────────────────────┘│
│                                         │
│ API Key                                 │
│ ┌─────────────────────────────────────┐│
│ │ ••••••••••••••••••                 ││
│ └─────────────────────────────────────┘│
│                                         │
│ [Save API Key]                          │
├─────────────────────────────────────────┤
│ [🎯 提示词] [📔 蓝图] [✨ 专利]          │
│ ...                                     │
└─────────────────────────────────────────┘
```

### HTML 变更

```html
<!-- API Provider Selection -->
<div class="form-group">
  <label class="form-label" for="apiProvider">API Provider</label>
  <select class="form-input" id="apiProvider">
    <option value="minimax">MiniMax</option>
    <option value="openai">OpenAI</option>
  </select>
</div>

<!-- API Key Input -->
<div class="form-group">
  <label class="form-label" for="apiKeyInput">API Key</label>
  <input type="password" class="form-input" id="apiKeyInput"
         placeholder="Enter your API Key">
</div>
```

---

## JS 逻辑变更

### js/ai.js

**新增方法:**

```javascript
// 获取当前服务商配置
getProvider() {
  const providerId = Storage.get(STORAGE_KEYS.API_PROVIDER, 'minimax');
  return AI_PROVIDERS[providerId] || AI_PROVIDERS.minimax;
},

// 获取 API URL
getApiUrl() {
  return this.getProvider().apiUrl;
},

// 获取模型名称
getModel() {
  return this.getProvider().model;
},

// 保存服务商选择
saveProvider(providerId) {
  Storage.set(STORAGE_KEYS.API_PROVIDER, providerId);
},
```

**更新 callMiniMax 方法:**

```javascript
async callMiniMax(prompt) {
  const apiKey = this.getApiKey();
  if (!apiKey) {
    return { error: true, message: I18n.t('apiKeyNotConfigured') };
  }

  try {
    const response = await fetch(this.getApiUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: this.getModel(),
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return {
      error: false,
      content: data.choices?.[0]?.message?.content || I18n.t('noResponse')
    };
  } catch (e) {
    return { error: true, message: I18n.t('apiError') + ': ' + e.message };
  }
}
```

### js/ui.js

**新增方法:**

```javascript
bindProviderEvents() {
  const providerSelect = document.getElementById('apiProvider');

  // 加载已保存的服务商
  const savedProvider = Storage.get(STORAGE_KEYS.API_PROVIDER, 'minimax');
  if (providerSelect) {
    providerSelect.value = savedProvider;
    this.updateApiKeyPlaceholder(savedProvider);
  }

  // 处理服务商切换
  providerSelect?.addEventListener('change', (e) => {
    const providerId = e.target.value;
    AI.saveProvider(providerId);
    this.updateApiKeyPlaceholder(providerId);
  });
},

updateApiKeyPlaceholder(providerId) {
  const apiKeyInput = document.getElementById('apiKeyInput');
  const provider = AI_PROVIDERS[providerId];
  if (apiKeyInput && provider) {
    apiKeyInput.placeholder = provider.keyPlaceholder;
  }
}
```

---

## 涉及文件

| 文件 | 改动 |
|------|------|
| `js/config.js` | 添加 `AI_PROVIDERS` 配置，添加 `API_PROVIDER` 存储键 |
| `js/ai.js` | 添加服务商相关方法，修复 API URL 和响应解析 |
| `js/ui.js` | 添加服务商选择绑定事件 |
| `index.html` | 添加服务商下拉选择框，更新 API Key 输入框 |

---

## 测试计划

1. 在浏览器打开 `index.html`
2. 从下拉框选择服务商 (MiniMax/OpenAI)
3. 输入有效的 API Key
4. 测试 AI 生成功能
5. 验证响应正确显示
6. 切换服务商再次测试

---

## 安全注意

- API Key 存储在 localStorage，仅客户端
- 不要硬编码 API Key 到源代码
- 不要将 API Key 提交到 GitHub

---

## 设计批准

设计日期：2026-03-12
批准状态：✅ 已批准