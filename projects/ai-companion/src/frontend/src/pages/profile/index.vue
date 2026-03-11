<!-- src/frontend/src/pages/profile/index.vue -->
<template>
  <view class="profile-container">
    <!-- 用户信息 -->
    <view class="user-card">
      <image class="avatar" :src="userStore.profile?.avatar || '/static/default-avatar.png'" mode="aspectFill" @click="changeAvatar" />
      <view class="info">
        <text class="nickname">{{ userStore.profile?.nickname || '微信用户' }}</text>
        <text class="status">免费版</text>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="menu-list">
      <view class="menu-item" @click="navigateTo('/pages/chat/index')">
        <text class="icon">💬</text>
        <text class="label">与小桃聊天</text>
        <text class="arrow">›</text>
      </view>
      <view class="menu-item" @click="navigateTo('/pages/schedule/index')">
        <text class="icon">⏰</text>
        <text class="label">日程提醒</text>
        <text class="arrow">›</text>
      </view>
      <view class="menu-item" @click="showPersonalityModal = true">
        <text class="icon">🎭</text>
        <text class="label">AI 人格设置</text>
        <text class="arrow">›</text>
      </view>
      <view class="menu-item" @click="showModelModal = true">
        <text class="icon">🤖</text>
        <text class="label">AI 模型设置</text>
        <text class="current-model">{{ currentModelName }}</text>
        <text class="arrow">›</text>
      </view>
      <view class="menu-item">
        <text class="icon">❤️</text>
        <text class="label">主动关心</text>
        <switch :checked="settings.care" @change="settings.care = !settings.care" color="#4facfe" />
      </view>
    </view>

    <!-- 会员卡片 -->
    <view class="vip-card" @click="showVipModal = true">
      <view class="vip-info">
        <text class="vip-title">开通会员</text>
        <text class="vip-desc">解锁高级人格、深度记忆、家庭监护</text>
      </view>
      <view class="vip-btn">
        <text>¥9.9/月</text>
      </view>
    </view>

    <!-- 设置列表 -->
    <view class="menu-list">
      <view class="menu-item">
        <text class="icon">🔔</text>
        <text class="label">通知设置</text>
        <text class="arrow">›</text>
      </view>
      <view class="menu-item">
        <text class="icon">🔒</text>
        <text class="label">隐私政策</text>
        <text class="arrow">›</text>
      </view>
      <view class="menu-item">
        <text class="icon">📖</text>
        <text class="label">用户协议</text>
        <text class="arrow">›</text>
      </view>
      <view class="menu-item" @click="logout">
        <text class="icon">🚪</text>
        <text class="label">退出登录</text>
        <text class="arrow">›</text>
      </view>
    </view>

    <!-- 版本信息 -->
    <view class="version">
      <text>AI 陪伴助手 v1.0.0</text>
    </view>

    <!-- AI 人格设置弹窗 -->
    <view v-if="showPersonalityModal" class="modal-mask" @click="showPersonalityModal = false">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">选择 AI 人格</text>
          <text class="modal-close" @click="showPersonalityModal = false">✕</text>
        </view>
        
        <scroll-view scroll-y class="role-list">
          <view 
            v-for="role in roles" 
            :key="role.id" 
            class="role-item"
            :class="{ active: currentRole === role.id }"
            @click="selectRole(role)"
          >
            <text class="role-icon">{{ role.icon }}</text>
            <view class="role-info">
              <text class="role-name">{{ role.name }}</text>
              <text class="role-desc">{{ role.description }}</text>
            </view>
            <text v-if="currentRole === role.id" class="role-check">✓</text>
          </view>
        </scroll-view>
        
        <view class="modal-footer">
          <button class="btn-cancel" @click="showPersonalityModal = false">取消</button>
          <button class="btn-confirm" @click="confirmRole">确认</button>
        </view>
      </view>
    </view>

    <!-- AI 模型设置弹窗 -->
    <view v-if="showModelModal" class="modal-mask" @click="showModelModal = false">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">选择 AI 模型</text>
          <text class="modal-close" @click="showModelModal = false">✕</text>
        </view>
        
        <scroll-view scroll-y class="role-list">
          <view 
            v-for="model in aiModels" 
            :key="model.id" 
            class="role-item"
            :class="{ active: selectedModel === model.id }"
            @click="selectModel(model)"
          >
            <text class="role-icon">{{ getModelIcon(model.provider) }}</text>
            <view class="role-info">
              <text class="role-name">{{ model.name }}</text>
              <text class="role-desc">{{ model.description }}</text>
            </view>
            <text v-if="selectedModel === model.id" class="role-check">✓</text>
          </view>
        </scroll-view>
        
        <view class="api-key-section">
          <text class="api-key-label">自定义 API Key（可选）</text>
          <input 
            class="api-key-input" 
            type="text" 
            v-model="customApiKey" 
            placeholder="输入你的 API Key，使用自己的额度"
            password
          />
          <text class="api-key-hint">不填写则使用系统默认 API</text>
        </view>
        
        <view class="modal-footer">
          <button class="btn-cancel" @click="showModelModal = false">取消</button>
          <button class="btn-confirm" @click="confirmModel">确认</button>
        </view>
      </view>
    </view>

    <!-- VIP 弹窗 -->
    <view v-if="showVipModal" class="modal-mask" @click="showVipModal = false">
      <view class="modal-content vip-modal" @click.stop>
        <view class="modal-header">
          <text class="modal-title">开通会员</text>
          <text class="modal-close" @click="showVipModal = false">✕</text>
        </view>
        <view class="vip-features">
          <view class="vip-feature-item">
            <text>🎭</text>
            <text>解锁高级人格</text>
          </view>
          <view class="vip-feature-item">
            <text>🧠</text>
            <text>深度记忆</text>
          </view>
          <view class="vip-feature-item">
            <text>👨‍👩‍👧</text>
            <text>家庭监护</text>
          </view>
        </view>
        <view class="vip-price">
          <text class="price">¥9.9</text>
          <text class="period">/月</text>
        </view>
        <button class="btn-vip">立即开通</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useUserStore } from '@/stores/user';
import { getAIConfigApi, updateAIConfigApi, getAIModelsApi } from '@/services/api';

interface Role {
  id: string;
  name: string;
  icon: string;
  description: string;
  personality: {
    type: string;
    tone: string;
    greeting: string;
  };
}

const userStore = useUserStore();

const settings = ref({
  care: true,
});

const showVipModal = ref(false);
const showPersonalityModal = ref(false);
const showModelModal = ref(false);
const currentRole = ref('default');

// AI 模型相关状态
const aiModels = ref<any[]>([]);
const selectedModel = ref('MiniMax-M2.5');
const customApiKey = ref('');
const currentModelName = ref('MiniMax M2.5');

// AI 模型列表（备用，如果 API 失败）
const defaultModels = [
  { id: 'MiniMax-M2.5', name: 'MiniMax M2.5', provider: 'minimax', description: '中文效果优秀，默认免费' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', description: 'OpenAI 旗舰模型' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai', description: '性价比高' },
  { id: 'claude-sonnet-3-5', name: 'Claude 3.5 Sonnet', provider: 'anthropic', description: 'Anthropic Claude 模型' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'gemini', description: 'Google Gemini 旗舰模型' },
];

// 获取模型图标
const getModelIcon = (provider: string) => {
  const icons: Record<string, string> = {
    minimax: '🌸',
    openai: '💧',
    anthropic: '🧠',
    gemini: '✨',
  };
  return icons[provider] || '🤖';
};

// 加载 AI 模型配置
const loadAIConfig = async () => {
  try {
    // 获取模型列表
    try {
      const models = await getAIModelsApi();
      aiModels.value = models;
    } catch (e) {
      console.warn('获取模型列表失败，使用默认列表:', e);
      aiModels.value = defaultModels;
    }
    
    // 获取用户当前配置
    try {
      const config = await getAIConfigApi();
      selectedModel.value = config.modelId;
      const model = aiModels.value.find(m => m.id === config.modelId);
      currentModelName.value = model?.name || config.modelId;
    } catch (e) {
      console.warn('获取用户配置失败，使用默认配置:', e);
      selectedModel.value = 'MiniMax-M2.5';
      currentModelName.value = 'MiniMax M2.5';
    }
  } catch (e) {
    console.error('加载 AI 配置失败:', e);
    // 降级使用默认配置
    aiModels.value = defaultModels;
    selectedModel.value = 'MiniMax-M2.5';
    currentModelName.value = 'MiniMax M2.5';
  }
};

// 选择模型
const selectModel = (model: any) => {
  selectedModel.value = model.id;
};

// 确认模型选择
const confirmModel = async () => {
  try {
    // 调用 API 保存配置
    const updateData: { modelId: string; apiKey?: string } = {
      modelId: selectedModel.value,
    };
    
    // 如果用户填写了自定义 API Key，则传递
    if (customApiKey.value && customApiKey.value.trim()) {
      updateData.apiKey = customApiKey.value.trim();
    }
    
    await updateAIConfigApi(updateData);
    
    const model = aiModels.value.find(m => m.id === selectedModel.value);
    currentModelName.value = model?.name || selectedModel.value;
    
    uni.showToast({
      title: `已切换为 ${currentModelName.value}`,
      icon: 'success',
    });
  } catch (e: any) {
    console.error('保存 AI 配置失败:', e);
    uni.showToast({
      title: e.message || '设置失败',
      icon: 'error',
    });
  }
  showModelModal.value = false;
};

// 页面加载时获取 AI 配置
onShow(() => {
  loadAIConfig();
});

// 预设角色列表
const roles: Role[] = [
  {
    id: 'default',
    name: '小桃',
    icon: '✨',
    description: '温柔可爱的小女生，活泼开朗',
    personality: {
      type: 'default',
      tone: 'warm',
      greeting: '你好呀~我是小桃！',
    },
  },
  {
    id: 'girlfriend',
    name: '贴心女友',
    icon: '💕',
    description: '温柔体贴，关心你的生活',
    personality: {
      type: 'girlfriend',
      tone: 'loving',
      greeting: '亲爱的~今天过得怎么样呀？',
    },
  },
  {
    id: 'teacher',
    name: 'AI 老师',
    icon: '📚',
    description: '知识渊博，耐心解答',
    personality: {
      type: 'teacher',
      tone: 'professional',
      greeting: '同学你好，有什么想学习的吗？',
    },
  },
  {
    id: 'coach',
    name: '健身教练',
    icon: '💪',
    description: '严格监督，帮你保持健康',
    personality: {
      type: 'coach',
      tone: 'strict',
      greeting: '今天运动了吗？坚持就是胜利！',
    },
  },
  {
    id: 'colleague',
    name: '职场同事',
    icon: '💼',
    description: '专业高效，协作解决问题',
    personality: {
      type: 'colleague',
      tone: 'professional',
      greeting: '早上好，今天有什么任务？',
    },
  },
  {
    id: 'friend',
    name: '知己朋友',
    icon: '👯',
    description: '懂你倾听，陪你聊天解闷',
    personality: {
      type: 'friend',
      tone: 'casual',
      greeting: '嘿！最近咋样？',
    },
  },
];

const navigateTo = (url: string) => {
  uni.navigateTo({ url });
};

const changeAvatar = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      // TODO: 上传头像到服务器
      console.log('选择头像:', res.tempFilePaths[0]);
      uni.showToast({
        title: '头像上传功能开发中',
        icon: 'none',
      });
    },
  });
};

const selectRole = (role: Role) => {
  currentRole.value = role.id;
};

const confirmRole = async () => {
  const role = roles.find((r) => r.id === currentRole.value);
  if (role) {
    try {
      // TODO: 调用后端 API 保存人格设置
      // await updatePersonalityApi(role.personality);
      uni.showToast({
        title: `已切换为${role.name}`,
        icon: 'success',
      });
    } catch (e) {
      uni.showToast({
        title: '设置失败',
        icon: 'error',
      });
    }
  }
  showPersonalityModal.value = false;
};

const logout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout();
        uni.reLaunch({ url: '/pages/index/index' });
      }
    },
  });
};
</script>

<style lang="scss" scoped>
.profile-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 30rpx;
}

.user-card {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 30rpx;

  .avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    border: 4rpx solid #fff;
  }

  .info {
    margin-left: 30rpx;
    flex: 1;

    .nickname {
      font-size: 36rpx;
      color: #fff;
      font-weight: bold;
      display: block;
    }

    .status {
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.8);
      margin-top: 10rpx;
      display: block;
    }
  }
}

.menu-list {
  background-color: #fff;
  border-radius: 20rpx;
  margin-bottom: 30rpx;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  .icon {
    font-size: 36rpx;
    margin-right: 20rpx;
  }

  .label {
    flex: 1;
    font-size: 28rpx;
    color: #333;
  }

  .arrow {
    font-size: 32rpx;
    color: #ccc;
  }

  .current-model {
    font-size: 24rpx;
    color: #666;
    margin-right: 10rpx;
  }
}

.vip-card {
  background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .vip-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #fff;
    display: block;
  }

  .vip-desc {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.8);
    margin-top: 10rpx;
    display: block;
  }

  .vip-btn {
    background-color: #fff;
    color: #ff8c00;
    padding: 15rpx 30rpx;
    border-radius: 30rpx;
    font-size: 24rpx;
    font-weight: bold;
  }
}

.version {
  text-align: center;
  color: #ccc;
  font-size: 24rpx;
  margin-top: 40rpx;
}

// 弹窗样式
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  width: 100%;
  max-height: 80vh;
  border-radius: 30rpx 30rpx 0 0;
  padding: 30rpx;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;

  .modal-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }

  .modal-close {
    font-size: 40rpx;
    color: #999;
    padding: 10rpx;
  }
}

.role-list {
  max-height: 60vh;
}

.role-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  border-radius: 15rpx;
  margin-bottom: 20rpx;
  background-color: #f8f8f8;

  &.active {
    background-color: #e8f4ff;
    border: 2rpx solid #4facfe;
  }

  .role-icon {
    font-size: 48rpx;
    margin-right: 20rpx;
  }

  .role-info {
    flex: 1;

    .role-name {
      font-size: 28rpx;
      color: #333;
      font-weight: bold;
      display: block;
    }

    .role-desc {
      font-size: 24rpx;
      color: #999;
      margin-top: 8rpx;
      display: block;
    }
  }

  .role-check {
    font-size: 32rpx;
    color: #4facfe;
    font-weight: bold;
  }
}

.api-key-section {
  margin-top: 30rpx;
  padding: 20rpx;
  background: #f9f9f9;
  border-radius: 10rpx;
  
  .api-key-label {
    font-size: 26rpx;
    color: #666;
    display: block;
    margin-bottom: 10rpx;
  }
  
  .api-key-input {
    width: 100%;
    height: 70rpx;
    background: #fff;
    border: 1rpx solid #ddd;
    border-radius: 10rpx;
    padding: 0 20rpx;
    font-size: 26rpx;
  }
  
  .api-key-hint {
    font-size: 22rpx;
    color: #999;
    margin-top: 10rpx;
    display: block;
  }
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 30rpx;

  .btn-cancel,
  .btn-confirm {
    flex: 1;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    font-size: 28rpx;
  }

  .btn-cancel {
    background-color: #f5f5f5;
    color: #666;
    margin-right: 20rpx;
  }

  .btn-confirm {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
  }
}

// VIP 弹窗
.vip-modal {
  text-align: center;
  padding: 50rpx;

  .vip-features {
    display: flex;
    justify-content: space-around;
    margin: 40rpx 0;

    .vip-feature-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 24rpx;
      color: #666;

      text:first-child {
        font-size: 48rpx;
        margin-bottom: 10rpx;
      }
    }
  }

  .vip-price {
    margin: 40rpx 0;

    .price {
      font-size: 60rpx;
      font-weight: bold;
      color: #ff8c00;
    }

    .period {
      font-size: 28rpx;
      color: #999;
    }
  }

  .btn-vip {
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
    color: #fff;
    border-radius: 40rpx;
    font-size: 28rpx;
    font-weight: bold;
  }
}
</style>
