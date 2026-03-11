// src/backend/src/services/UserService.ts

import { User } from '../models/User';
import { SUPPORTED_MODELS } from '../ai/adapters';

export class UserService {
  // 通过 OpenID 查找或创建用户
  async findOrCreateByOpenId(openid: string, userInfo?: { nickname?: string; avatar?: string }): Promise<User> {
    let user = await User.findOne({ where: { openid } });

    if (!user) {
      user = await User.create({
        openid,
        nickname: userInfo?.nickname || '微信用户',
        avatar: userInfo?.avatar || '',
        personality: {
          type: 'default',
          tone: 'warm',
          greeting: '你好呀~我是小桃！',
        },
        aiModelId: 'MiniMax-M2.5',
        aiProvider: 'minimax',
      } as any);
    }

    return user;
  }

  // 通过 ID 获取用户
  async getById(id: string): Promise<User | null> {
    return await User.findByPk(id);
  }

  // 更新用户资料
  async updateProfile(id: string, updates: { nickname?: string; avatar?: string; personality?: object }): Promise<User> {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('用户不存在');
    }

    await user.update(updates);
    return user;
  }

  // 更新人格设置
  async updatePersonality(id: string, personality: object): Promise<User> {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('用户不存在');
    }

    await user.update({ personality });
    return user;
  }

  // 获取用户人格设置
  async getPersonality(id: string): Promise<object> {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('用户不存在');
    }

    return user.personality;
  }

  // ======== AI 配置相关 ========

  /**
   * 获取用户 AI 配置
   */
  async getAIConfig(id: string): Promise<{
    modelId: string;
    provider: string;
    hasApiKey: boolean;
  }> {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('用户不存在');
    }

    return {
      modelId: user.aiModelId || 'MiniMax-M2.5',
      provider: user.aiProvider || 'minimax',
      hasApiKey: !!user.aiApiKey,
    };
  }

  /**
   * 更新用户 AI 配置
   */
  async updateAIConfig(
    id: string, 
    config: { modelId?: string; apiKey?: string; provider?: string }
  ): Promise<{ modelId: string; provider: string; hasApiKey: boolean }> {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('用户不存在');
    }

    // 验证模型是否支持
    if (config.modelId) {
      const supportedModel = SUPPORTED_MODELS.find(m => m.id === config.modelId);
      if (!supportedModel) {
        throw new Error(`不支持的模型: ${config.modelId}`);
      }
    }

    const updateData: any = {};
    if (config.modelId) updateData.aiModelId = config.modelId;
    if (config.apiKey) updateData.aiApiKey = config.apiKey;
    if (config.provider) updateData.aiProvider = config.provider;

    await user.update(updateData);

    return {
      modelId: user.aiModelId || 'MiniMax-M2.5',
      provider: user.aiProvider || 'minimax',
      hasApiKey: !!user.aiApiKey,
    };
  }

  /**
   * 获取用户的 API Key（用于调用 AI）
   * 优先级：用户自定义 > 系统默认
   */
  async getUserApiKey(id: string): Promise<string | null> {
    const user = await User.findByPk(id);
    if (!user) {
      return null;
    }
    return user.aiApiKey || null;
  }

  /**
   * 获取用户当前的模型 ID
   */
  async getUserModelId(id: string): Promise<string> {
    const user = await User.findByPk(id);
    if (!user || !user.aiModelId) {
      return 'MiniMax-M2.5'; // 默认模型
    }
    return user.aiModelId;
  }
}
