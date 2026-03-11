<!-- src/frontend/src/pages/index/index.vue -->
<template>
  <view class="index-container">
    <!-- 欢迎页 -->
    <view v-if="!userStore.isLoggedIn" class="welcome">
      <image class="logo" src="/static/logo.png" mode="aspectFit" />
      <text class="title">AI 陪伴助手</text>
      <text class="subtitle">一个有灵魂的陪伴小伙伴</text>
      <button class="login-btn" @click="handleLogin">
        <text>微信授权登录</text>
      </button>
    </view>

    <!-- 已登录 - 跳转到聊天 -->
    <view v-else class="main">
      <navigator url="/pages/chat/index" open-type="switchTab">
        <view class="start-btn">
          <text>开始与小桃聊天</text>
        </view>
      </navigator>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const handleLogin = async () => {
  try {
    // 测试模式自动用测试登录
    await userStore.login();
    uni.switchTab({ url: '/pages/chat/index' });
  } catch (error) {
    uni.showToast({
      title: '登录失败，请重试',
      icon: 'none',
    });
  }
};

onMounted(async () => {
  // 自动检查登录状态
  await userStore.checkLogin();
  
  // 测试模式：自动登录
  if (!userStore.isLoggedIn) {
    try {
      await userStore.login();
      uni.switchTab({ url: '/pages/chat/index' });
    } catch (e) {
      // 测试登录失败，静默等待用户手动点击
    }
  }
});
</script>

<style lang="scss" scoped>
.index-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;

  .logo {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 40rpx;
  }

  .title {
    font-size: 48rpx;
    font-weight: bold;
    color: #fff;
    margin-bottom: 20rpx;
  }

  .subtitle {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 60rpx;
  }

  .login-btn {
    width: 400rpx;
    height: 80rpx;
    background-color: #fff;
    color: #667eea;
    border-radius: 40rpx;
    font-size: 30rpx;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.main {
  .start-btn {
    width: 500rpx;
    height: 100rpx;
    background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
    border-radius: 50rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 32rpx;
    font-weight: bold;
  }
}
</style>
