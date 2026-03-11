<!-- src/frontend/src/pages/chat/index.vue -->
<template>
  <view class="chat-container">
    <!-- 聊天消息列表 -->
    <scroll-view
      class="message-list"
      scroll-y
      :scroll-top="scrollTop"
      :scroll-with-animation="true"
    >
      <view v-for="msg in chatStore.messages" :key="msg.id" class="message-item">
        <!-- AI 消息 -->
        <view v-if="msg.role === 'assistant'" class="message-ai">
          <image class="avatar" src="/static/avatar-xiaotao.png" mode="aspectFill" />
          <view class="bubble bubble-ai">
            <text>{{ msg.content }}</text>
            <!-- 语音播放按钮 -->
            <view v-if="msg.voiceUrl" class="voice-btn" @click="playVoice(msg.voiceUrl)">
              <text class="iconfont">🔊</text>
            </view>
          </view>
        </view>

        <!-- 用户消息 -->
        <view v-else class="message-user">
          <view class="bubble bubble-user">
            <text>{{ msg.content }}</text>
          </view>
          <image class="avatar" :src="userStore.profile?.avatar || '/static/default-avatar.png'" mode="aspectFill" />
        </view>
      </view>

      <!-- 加载中 -->
      <view v-if="chatStore.isLoading" class="message-ai loading">
        <image class="avatar" src="/static/avatar-xiaotao.png" mode="aspectFill" />
        <view class="bubble bubble-ai">
          <text class="loading-text">正在输入...</text>
        </view>
      </view>
    </scroll-view>

    <!-- 输入区域 -->
    <view class="input-area">
      <view class="input-wrapper">
        <input
          v-model="inputText"
          class="input"
          type="text"
          placeholder="跟我说说话吧~"
          :adjust-position="true"
          @confirm="sendTextMessage"
        />
        <!-- 语音按钮 -->
        <view class="voice-btn" @click="startVoice">
          <text>🎤</text>
        </view>
        <!-- 发送按钮 -->
        <view class="send-btn" @click="sendTextMessage">
          <text>发送</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue';
import { useChatStore } from '@/stores/chat';
import { useUserStore } from '@/stores/user';

const chatStore = useChatStore();
const userStore = useUserStore();

const inputText = ref('');
const scrollTop = ref(0);

// 发送文字消息
const sendTextMessage = async () => {
  const text = inputText.value.trim();
  if (!text) return;

  inputText.value = '';
  await chatStore.sendMessage(text, 'text');

  // 滚动到底部
  nextTick(() => {
    scrollTop.value = scrollTop.value + 100;
  });
};

// 播放语音
const playVoice = (url: string) => {
  const innerAudioContext = uni.createInnerAudioContext();
  innerAudioContext.src = url;
  innerAudioContext.play();
};

// 开始语音输入
const startVoice = () => {
  // #ifdef MP-WEIXIN
  const recorderManager = uni.getRecorderManager();

  recorderManager.onStop((res) => {
    console.log('录音结束:', res.tempFilePath);
    // TODO: 上传语音文件，获取文字
  });

  recorderManager.start({ format: 'mp3' });
  // #endif
};

onMounted(() => {
  chatStore.initWelcome();
});
</script>

<style lang="scss" scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.message-list {
  flex: 1;
  padding: 20rpx;
  padding-bottom: 140rpx;
}

.message-item {
  margin-bottom: 30rpx;

  &.message-ai,
  &.message-user {
    display: flex;
    align-items: flex-start;
  }

  &.message-user {
    flex-direction: row-reverse;
  }
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.bubble {
  max-width: 500rpx;
  padding: 20rpx 28rpx;
  border-radius: 20rpx;
  font-size: 28rpx;
  line-height: 1.5;
  word-break: break-all;

  &.bubble-ai {
    margin-left: 20rpx;
    background-color: #ffffff;
    color: #333;
  }

  &.bubble-user {
    margin-right: 20rpx;
    background-color: #4facfe;
    color: #ffffff;
  }
}

.voice-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 10rpx;
  font-size: 32rpx;
}

.loading {
  opacity: 0.7;

  .loading-text {
    color: #999;
    font-size: 24rpx;
  }
}

.input-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  padding: 20rpx;
  border-top: 1rpx solid #eee;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 40rpx;
  padding: 10rpx 20rpx;
}

.input {
  flex: 1;
  height: 70rpx;
  font-size: 28rpx;
}

.send-btn {
  margin-left: 20rpx;
  padding: 10rpx 30rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 30rpx;
  color: #ffffff;
  font-size: 26rpx;
}
</style>
