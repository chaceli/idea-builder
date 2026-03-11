// src/frontend/src/stores/chat.ts

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { chatApi, getHistoryApi } from '@/services/api';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  voiceUrl?: string;
  emotion?: string;
  createdAt: string;
}

export const useChatStore = defineStore('chat', () => {
  const messages = ref<Message[]>([]);
  const isLoading = ref(false);
  const isSpeaking = ref(false);

  // 初始化欢迎消息
  const initWelcome = () => {
    messages.value = [
      {
        id: 'welcome',
        role: 'assistant',
        content: '你好呀~我是小桃！✨\n\n以后就是你的陪伴小伙伴啦~有什么心事都可以跟我说哦~',
        createdAt: new Date().toISOString(),
      },
    ];
  };

  // 发送消息
  const sendMessage = async (content: string, type: 'text' | 'voice' = 'text') => {
    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };
    messages.value.push(userMessage);

    isLoading.value = true;

    try {
      const response = await chatApi({
        content,
        type,
      });

      // 添加 AI 消息
      const aiMessage: Message = {
        id: response.message.id,
        role: 'assistant',
        content: response.message.content,
        voiceUrl: response.message.voiceUrl,
        emotion: response.message.emotion,
        createdAt: new Date().toISOString(),
      };
      messages.value.push(aiMessage);
    } catch (error) {
      console.error('发送消息失败:', error);
      uni.showToast({
        title: '发送失败，请重试',
        icon: 'none',
      });
    } finally {
      isLoading.value = false;
    }
  };

  // 加载历史消息
  const loadHistory = async () => {
    try {
      const response = await getHistoryApi();
      if (response.messages && response.messages.length > 0) {
        messages.value = response.messages;
      }
    } catch (error) {
      console.error('加载历史失败:', error);
    }
  };

  // 清空对话
  const clearChat = () => {
    messages.value = [];
    initWelcome();
  };

  return {
    messages,
    isLoading,
    isSpeaking,
    initWelcome,
    sendMessage,
    loadHistory,
    clearChat,
  };
});
