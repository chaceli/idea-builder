// src/frontend/src/services/api.ts

// ====== 配置区域 ======
// 开发环境：使用服务器 IP
// 生产环境：使用域名
const USE_DEV = true; // 开发环境设为 true
const SERVER_IP = '10.0.0.16'; // 替换为你的服务器内网 IP
const SERVER_PORT = '3000';
// =======================

const BASE_URL = USE_DEV ? `http://${SERVER_IP}:${SERVER_PORT}` : 'https://api.ai-companion.com';

interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: object;
  header?: Record<string, string>;
}

// 统一请求方法
async function request<T>(options: RequestOptions): Promise<T> {
  const token = uni.getStorageSync('token');

  const defaultHeader: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeader['Authorization'] = `Bearer ${token}`;
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data,
      header: { ...defaultHeader, ...options.header },
      success: (res) => {
        if (res.statusCode === 200) {
          if (res.data.code === 0) {
            resolve(res.data.data);
          } else {
            reject(new Error(res.data.message || '请求失败'));
          }
        } else if (res.statusCode === 401) {
          uni.removeStorageSync('token');
          reject(new Error('请先登录'));
        } else {
          reject(new Error('网络错误'));
        }
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
}

// ========== 认证 API ==========

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    nickname: string;
    avatar: string;
    personality: object;
  };
}

// 测试登录（跳过微信）
export function testLoginApi(): Promise<LoginResponse> {
  return request({
    url: '/api/auth/test-login',
    method: 'POST',
  });
}

export function loginApi(code: string): Promise<LoginResponse> {
  return request({
    url: '/api/auth/login',
    method: 'POST',
    data: { code },
  });
}

// ========== 用户 API ==========

export interface Profile {
  id: string;
  nickname: string;
  avatar: string;
  personality: object;
}

export function getProfileApi(): Promise<Profile> {
  return request({
    url: '/api/user/profile',
  });
}

export function updateProfileApi(data: { nickname?: string; avatar?: string }): Promise<Profile> {
  return request({
    url: '/api/user/profile',
    method: 'PUT',
    data,
  });
}

// ========== 聊天 API ==========

export interface ChatRequest {
  content: string;
  type: 'text' | 'voice';
  voiceUrl?: string;
}

export interface ChatResponse {
  message: {
    id: string;
    role: 'assistant';
    content: string;
    voiceUrl?: string;
    emotion: string;
  };
}

export function chatApi(data: ChatRequest): Promise<ChatResponse> {
  return request({
    url: '/api/chat/message',
    method: 'POST',
    data,
  });
}

export function getHistoryApi(params?: { limit?: number; offset?: number }): Promise<{ messages: any[]; hasMore: boolean }> {
  return request({
    url: '/api/chat/history',
    data: params,
  });
}

// ========== 日程 API ==========

export interface Schedule {
  id: string;
  title: string;
  content?: string;
  remindAt: string;
  repeat?: object;
  completed: boolean;
}

export function addScheduleApi(data: { title: string; content?: string; remindAt: string; repeat?: object }): Promise<{ id: string }> {
  return request({
    url: '/api/schedule/add',
    method: 'POST',
    data,
  });
}

export function getScheduleListApi(type: 'all' | 'today' = 'all'): Promise<{ schedules: Schedule[] }> {
  return request({
    url: '/api/schedule/list',
    data: { type },
  });
}

export function completeScheduleApi(id: string): Promise<void> {
  return request({
    url: `/api/schedule/complete/${id}`,
    method: 'POST',
  });
}

export function deleteScheduleApi(id: string): Promise<void> {
  return request({
    url: `/api/schedule/${id}`,
    method: 'DELETE',
  });
}

// ========== AI 模型配置 API ==========

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
}

export interface AIConfig {
  modelId: string;
  provider: string;
  hasApiKey: boolean;
}

// 获取支持的模型列表
export function getAIModelsApi(): Promise<AIModel[]> {
  return request({
    url: '/api/user/ai/models',
  });
}

// 获取用户 AI 配置
export function getAIConfigApi(): Promise<AIConfig> {
  return request({
    url: '/api/user/ai/config',
  });
}

// 更新用户 AI 配置
export function updateAIConfigApi(data: { modelId?: string; apiKey?: string; provider?: string }): Promise<AIConfig> {
  return request({
    url: '/api/user/ai/config',
    method: 'PUT',
    data,
  });
}
