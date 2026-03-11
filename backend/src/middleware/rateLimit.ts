// src/backend/src/middleware/rateLimit.ts

import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../db/redis';

// 速率限制配置
interface RateLimitConfig {
  windowMs: number;  // 时间窗口（毫秒）
  maxRequests: number; // 最大请求数
}

// 内存存储（生产环境应使用 Redis）
const memoryStore: Map<string, { count: number; resetTime: number }> = new Map();

export function rateLimit(config: RateLimitConfig = { windowMs: 60000, maxRequests: 100 }) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `rate:${ip}`;
    
    try {
      // 尝试从 Redis 获取
      if (redisClient.isOpen) {
        const count = await redisClient.incr(key);
        
        if (count === 1) {
          await redisClient.expire(key, Math.floor(config.windowMs / 1000));
        }

        if (Number(count) > config.maxRequests) {
          return res.status(429).json({
            code: 429,
            message: '请求过于频繁，请稍后再试',
          });
        }
      } else {
        // 降级到内存存储
        const now = Date.now();
        const record = memoryStore.get(key);

        if (!record || now > record.resetTime) {
          memoryStore.set(key, {
            count: 1,
            resetTime: now + config.windowMs,
          });
        } else {
          record.count++;
          
          if (record.count > config.maxRequests) {
            return res.status(429).json({
              code: 429,
              message: '请求过于频繁，请稍后再试',
            });
          }
        }
      }

      next();
    } catch (error) {
      // Redis 故障时降级放行
      console.error('Rate limit error:', error);
      next();
    }
  };
}

// API 速率限制（更严格）
export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1分钟
  maxRequests: 60, // 每分钟 60 次
});

// 聊天速率限制
export const chatRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1分钟
  maxRequests: 10, // 每分钟 10 条消息
});

// 登录速率限制（防止暴力破解）
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  maxRequests: 5, // 每 15 分钟 5 次
});
