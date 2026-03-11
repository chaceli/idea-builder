// src/backend/src/services/MemoryService.ts

import { Op } from 'sequelize';
import { Memory } from '../models/Memory';
import { Message } from '../models/Message';
import { shortTermMemory } from '../db/redis';

export class MemoryService {
  // 检索记忆
  async retrieve(userId: string, query: string): Promise<string[]> {
    // 获取长期记忆（fact 类型）
    const longTermMemories = await Memory.findAll({
      where: {
        userId,
        type: 'long-term',
      },
      order: [['importance', 'DESC'], ['createdAt', 'DESC']],
      limit: 10,
    });

    return longTermMemories.map((m) => m.content);
  }

  // 获取最近消息
  async getRecentMessages(userId: string, limit: number = 10): Promise<string[]> {
    const messages = await Message.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit,
    });

    return messages.reverse().map((m) => {
      const prefix = m.role === 'user' ? '用户' : '小桃';
      return `${prefix}: ${m.content}`;
    });
  }

  // 保存消息到数据库
  async saveMessage(userId: string, role: 'user' | 'assistant', content: string): Promise<void> {
    await Message.create({
      userId,
      role,
      content,
    });

    // 同时存到 Redis 短期记忆
    const prefix = role === 'user' ? '用户' : '小桃';
    await shortTermMemory.push(userId, `${prefix}: ${content}`);
  }

  // 更新记忆
  async update(userId: string, userMessage: string, aiResponse: string): Promise<void> {
    // 提取关键信息（简化版 - 实际可以用 NLP）
    const keyInfo = this.extractKeyInfo(userMessage);

    for (const info of keyInfo) {
      // 检查是否已存在
      const existing = await Memory.findOne({
        where: {
          userId,
          content: info.content,
        },
      });

      if (!existing) {
        await Memory.create({
          userId,
          type: info.type,
          content: info.content,
          importance: info.importance,
        });
      }
    }
  }

  // 提取关键信息（简化版）
  private extractKeyInfo(message: string): Array<{ type: 'short-term' | 'long-term' | 'fact'; content: string; importance: number }> {
    const results: Array<{ type: 'short-term' | 'long-term' | 'fact'; content: string; importance: number }> = [];

    // 名字
    if (message.includes('我叫') || message.includes('我叫')) {
      const match = message.match(/我叫[叫]?(.+)/);
      if (match) {
        results.push({
          type: 'fact',
          content: `用户叫${match[1]}`,
          importance: 5,
        });
      }
    }

    // 喜好
    if (message.includes('喜欢') || message.includes('讨厌')) {
      const match = message.match(/喜欢(.+?)[，。]?/);
      if (match) {
        results.push({
          type: 'fact',
          content: `用户喜欢${match[1]}`,
          importance: 4,
        });
      }
    }

    // 重要日期
    if (message.includes('生日') || message.includes('纪念日')) {
      results.push({
        type: 'fact',
        content: message,
        importance: 5,
      });
    }

    // 默认存入短期记忆
    if (results.length === 0) {
      results.push({
        type: 'short-term',
        content: message.substring(0, 200),
        importance: 1,
      });
    }

    return results;
  }

  // 获取用户画像
  async getUserProfile(userId: string): Promise<object> {
    const facts = await Memory.findAll({
      where: {
        userId,
        type: 'fact',
      },
      order: [['importance', 'DESC']],
    });

    const profile: Record<string, any> = {
      interests: [],
      importantDates: [],
      preferences: {},
    };

    facts.forEach((f) => {
      const content = f.content;
      if (content.includes('喜欢')) {
        profile.interests.push(content);
      } else if (content.includes('叫')) {
        profile.name = content.replace('用户叫', '');
      } else if (content.includes('生日') || content.includes('纪念日')) {
        profile.importantDates.push(content);
      }
    });

    return profile;
  }
}
