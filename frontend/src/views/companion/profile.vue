<template>
  <div class="profile-page">
    <div class="profile-container">
      <h1>👤 个人中心</h1>

      <!-- 用户信息卡片 -->
      <div class="user-card">
        <div class="avatar">👤</div>
        <div class="info">
          <div class="nickname">微信用户</div>
          <div class="status">免费版</div>
        </div>
      </div>

      <!-- AI 模型设置 -->
      <div class="settings-section">
        <h2>🤖 AI 模型设置</h2>
        <div class="setting-item" @click="showModelModal = true">
          <span class="label">当前模型</span>
          <span class="value">{{ currentModel }} ›</span>
        </div>
        <div class="setting-item" @click="showApiKeyModal = true">
          <span class="label">自定义 API Key</span>
          <span class="value">{{ hasApiKey ? '已设置' : '未设置' }} ›</span>
        </div>
      </div>

      <!-- 功能菜单 -->
      <div class="menu-section">
        <div class="menu-item" @click="$router.push('/companion/chat')">
          <span class="icon">💬</span>
          <span class="label">与 AI 聊天</span>
          <span class="arrow">›</span>
        </div>
        <div class="menu-item" @click="$router.push('/companion/schedule')">
          <span class="icon">📅</span>
          <span class="label">日程提醒</span>
          <span class="arrow">›</span>
        </div>
      </div>

      <!-- 模型选择弹窗 -->
      <div v-if="showModelModal" class="modal-mask" @click="showModelModal = false">
        <div class="modal" @click.stop>
          <h3>选择 AI 模型</h3>
          <div class="model-list">
            <div 
              v-for="model in models" 
              :key="model.id"
              class="model-item"
              :class="{ active: selectedModel === model.id }"
              @click="selectedModel = model.id"
            >
              <span class="model-icon">{{ model.icon }}</span>
              <div class="model-info">
                <div class="model-name">{{ model.name }}</div>
                <div class="model-desc">{{ model.desc }}</div>
              </div>
              <span v-if="selectedModel === model.id" class="check">✓</span>
            </div>
          </div>
          <div class="modal-actions">
            <button @click="showModelModal = false">取消</button>
            <button class="primary" @click="saveModel">保存</button>
          </div>
        </div>
      </div>

      <!-- API Key 弹窗 -->
      <div v-if="showApiKeyModal" class="modal-mask" @click="showApiKeyModal = false">
        <div class="modal" @click.stop>
          <h3>设置 API Key</h3>
          <p class="hint">输入你的 API Key，使用自己的额度</p>
          <input 
            v-model="apiKey" 
            type="password" 
            placeholder="sk-xxx..." 
            class="api-input"
          />
          <div class="modal-actions">
            <button @click="showApiKeyModal = false">取消</button>
            <button class="primary" @click="saveApiKey">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const currentModel = ref('MiniMax M2.5')
const hasApiKey = ref(false)
const showModelModal = ref(false)
const showApiKeyModal = ref(false)
const selectedModel = ref('MiniMax-M2.5')
const apiKey = ref('')

const models = [
  { id: 'MiniMax-M2.5', name: 'MiniMax M2.5', icon: '🌸', desc: '中文效果优秀，默认免费' },
  { id: 'gpt-4o', name: 'GPT-4o', icon: '💧', desc: 'OpenAI 旗舰模型' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', icon: '💧', desc: '性价比高' },
  { id: 'claude-sonnet-3-5', name: 'Claude 3.5 Sonnet', icon: '🧠', desc: 'Anthropic Claude 模型' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', icon: '✨', desc: 'Google Gemini 旗舰模型' },
]

const saveModel = () => {
  const model = models.find(m => m.id === selectedModel.value)
  currentModel.value = model?.name || 'MiniMax M2.5'
  showModelModal.value = false
}

const saveApiKey = () => {
  if (apiKey.value) {
    hasApiKey.value = true
  }
  showApiKeyModal.value = false
}
</script>

<style scoped lang="scss">
.profile-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
}

.profile-container {
  max-width: 600px;
  margin: 0 auto;

  h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }
}

.user-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  color: #fff;
  margin-bottom: 20px;

  .avatar {
    width: 60px;
    height: 60px;
    background: rgba(255,255,255,0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    margin-right: 16px;
  }

  .info {
    .nickname {
      font-size: 18px;
      font-weight: bold;
    }

    .status {
      font-size: 14px;
      opacity: 0.8;
    }
  }
}

.settings-section, .menu-section {
  background: #fff;
  border-radius: 12px;
  margin-bottom: 20px;
  overflow: hidden;

  h2 {
    font-size: 16px;
    padding: 16px;
    margin: 0;
    border-bottom: 1px solid #f0f0f0;
  }
}

.setting-item, .menu-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  .label {
    flex: 1;
    font-size: 15px;
  }

  .value {
    color: #999;
    font-size: 14px;
  }

  .icon {
    font-size: 20px;
    margin-right: 12px;
  }

  .arrow {
    color: #ccc;
  }
}

.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;

  h3 {
    margin: 0 0 16px;
  }

  .hint {
    font-size: 14px;
    color: #999;
    margin-bottom: 12px;
  }

  .api-input {
    width: 100%;
    padding: 12px;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    box-sizing: border-box;
  }
}

.model-list {
  .model-item {
    display: flex;
    align-items: center;
    padding: 12px;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    margin-bottom: 10px;
    cursor: pointer;

    &.active {
      border-color: #667eea;
      background: #f8f4ff;
    }

    .model-icon {
      font-size: 24px;
      margin-right: 12px;
    }

    .model-info {
      flex: 1;

      .model-name {
        font-size: 15px;
        font-weight: bold;
      }

      .model-desc {
        font-size: 12px;
        color: #999;
      }
    }

    .check {
      color: #667eea;
      font-weight: bold;
    }
  }
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;

  button {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;

    &.primary {
      background: #667eea;
      color: #fff;
    }
  }
}
</style>
