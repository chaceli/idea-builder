// src/frontend/src/stores/user.ts

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { loginApi, testLoginApi, getProfileApi, updateProfileApi } from '@/services/api';

export interface UserProfile {
  id: string;
  nickname: string;
  avatar: string;
  personality: {
    type: string;
    tone: string;
    greeting: string;
  };
}

// 测试模式配置
const USE_TEST_MODE = true; // 设置为 true 可以跳过微信登录直接测试

export const useUserStore = defineStore('user', () => {
  const token = ref<string>('');
  const profile = ref<UserProfile | null>(null);
  const isLoggedIn = ref(false);

  // 测试模式登录
  const testLogin = async () => {
    try {
      // 直接调用后端测试登录接口
      const response = await testLoginApi();
      
      token.value = response.token;
      profile.value = response.user;
      isLoggedIn.value = true;
      
      // 保存 token
      uni.setStorageSync('token', token.value);
      
      return response;
    } catch (error) {
      console.error('测试登录失败:', error);
      throw error;
    }
  };

  // 微信登录
  const login = async () => {
    // 如果是测试模式，直接用测试登录
    if (USE_TEST_MODE) {
      return testLogin();
    }
    
    try {
      // 获取微信 code
      const loginRes = await new Promise<UniApp.LoginRes>((resolve, reject) => {
        uni.login({
          provider: 'weixin',
          success: resolve,
          fail: reject,
        });
      });

      if (!loginRes.code) {
        throw new Error('获取 code 失败');
      }

      // 调用后端登录
      const response = await loginApi(loginRes.code);

      token.value = response.token;
      profile.value = response.user;
      isLoggedIn.value = true;

      // 保存 token
      uni.setStorageSync('token', token.value);

      return response;
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  };

  // 检查登录状态
  const checkLogin = async () => {
    const savedToken = uni.getStorageSync('token');
    if (savedToken) {
      token.value = savedToken;
      try {
        await fetchProfile();
        isLoggedIn.value = true;
      } catch {
        // token 过期，重新登录
        token.value = '';
        isLoggedIn.value = false;
      }
    }
  };

  // 获取用户资料
  const fetchProfile = async () => {
    const response = await getProfileApi();
    profile.value = response;
    return response;
  };

  // 更新用户资料
  const updateProfile = async (data: { nickname?: string; avatar?: string }) => {
    const response = await updateProfileApi(data);
    profile.value = response;
    return response;
  };

  // 登出
  const logout = () => {
    token.value = '';
    profile.value = null;
    isLoggedIn.value = false;
    uni.removeStorageSync('token');
  };

  return {
    token,
    profile,
    isLoggedIn,
    login,
    testLogin,
    checkLogin,
    fetchProfile,
    updateProfile,
    logout,
  };
});
