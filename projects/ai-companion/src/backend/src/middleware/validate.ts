// src/backend/src/middleware/validate.ts

import { Request, Response, NextFunction } from 'express';

// 验证规则
interface ValidationRule {
  field: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  enum?: string[];
  custom?: (value: any) => boolean | string;
}

// 验证中间件工厂
export function validate(rules: ValidationRule[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = [];

    for (const rule of rules) {
      const value = req.body[rule.field];

      // 必填检查
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(`字段 ${rule.field} 是必填的`);
        continue;
      }

      // 如果非必填且值为空，跳过其他验证
      if (!rule.required && (value === undefined || value === null || value === '')) {
        continue;
      }

      // 类型检查
      const actualType = Array.isArray(value) ? 'array' : typeof value;
      if (actualType !== rule.type) {
        errors.push(`字段 ${rule.field} 必须是 ${rule.type} 类型`);
        continue;
      }

      // 字符串长度检查
      if (rule.type === 'string') {
        if (rule.minLength && value.length < rule.minLength) {
          errors.push(`字段 ${rule.field} 长度不能少于 ${rule.minLength}`);
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          errors.push(`字段 ${rule.field} 长度不能超过 ${rule.maxLength}`);
        }
        if (rule.pattern && !rule.pattern.test(value)) {
          errors.push(`字段 ${rule.field} 格式不正确`);
        }
      }

      // 数字范围检查
      if (rule.type === 'number') {
        if (rule.min !== undefined && value < rule.min) {
          errors.push(`字段 ${rule.field} 不能小于 ${rule.min}`);
        }
        if (rule.max !== undefined && value > rule.max) {
          errors.push(`字段 ${rule.field} 不能大于 ${rule.max}`);
        }
      }

      // 枚举检查
      if (rule.enum && !rule.enum.includes(value)) {
        errors.push(`字段 ${rule.field} 必须是以下值之一: ${rule.enum.join(', ')}`);
      }

      // 自定义验证
      if (rule.custom) {
        const result = rule.custom(value);
        if (result !== true) {
          errors.push(typeof result === 'string' ? result : `字段 ${rule.field} 验证失败`);
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        code: 400,
        message: '参数验证失败',
        errors,
      });
    }

    next();
  };
}

// 常用验证规则
export const validationRules = {
  // 聊天消息
  chatMessage: [
    { field: 'content', type: 'string', required: true, minLength: 1, maxLength: 5000 },
    { field: 'type', type: 'string', required: false, enum: ['text', 'voice'] },
  ],

  // 日程
  schedule: [
    { field: 'title', type: 'string', required: true, minLength: 1, maxLength: 128 },
    { field: 'remindAt', type: 'string', required: true },
  ],

  // 用户资料
  profile: [
    { field: 'nickname', type: 'string', required: false, maxLength: 64 },
  ],
};
