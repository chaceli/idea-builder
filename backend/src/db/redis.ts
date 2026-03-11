// src/backend/src/db/redis.ts

import { createClient } from 'redis';
import { config } from '../config';

const redisClient = createClient({
  socket: {
    host: config.redis.host,
    port: config.redis.port,
  },
  password: config.redis.password || undefined,
});

redisClient.on('error', (err) => console.error('❌ Redis 错误:', err));
redisClient.on('connect', () => console.log('✅ Redis 连接成功'));

export async function initRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

export { redisClient };

// 会话存储
export const sessionStore = {
  async get(key: string): Promise<string | null> {
    return await redisClient.get(`session:${key}`);
  },

  async set(key: string, value: string, ttl: number = 3600): Promise<void> {
    await redisClient.setEx(`session:${key}`, ttl, value);
  },

  async del(key: string): Promise<void> {
    await redisClient.del(`session:${key}`);
  },
};

// 短期记忆（最近20轮对话）
export const shortTermMemory = {
  async get(userId: string): Promise<string[]> {
    const key = `stm:${userId}`;
    const data = await redisClient.lRange(key, 0, -1);
    return data;
  },

  async push(userId: string, message: string): Promise<void> {
    const key = `stm:${userId}`;
    await redisClient.rPush(key, message);
    // 只保留最近20条
    await redisClient.lTrim(key, -20, -1);
  },

  async clear(userId: string): Promise<void> {
    const key = `stm:${userId}`;
    await redisClient.del(key);
  },
};
