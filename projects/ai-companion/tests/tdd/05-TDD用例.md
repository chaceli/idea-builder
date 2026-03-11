# AI 人格化陪伴助手 - TDD 用例开发

> **版本**：v1.0.0  
> **作者**：小桃 ✨  
> **日期**：2026-02-20  
> **状态**：初稿

---

## 1. 测试驱动开发概述

### 1.1 TDD 原则

```
Red (失败) → Green (通过) → Refactor (重构)
```

### 1.2 测试框架

| 层级 | 框架 |
|------|------|
| 后端单元测试 | Jest / Mocha |
| 后端集成测试 | Supertest |
| 前端单元测试 | Vitest / Jest |

---

## 2. 核心模块 TDD 用例

### 2.1 AI 对话服务 - AIService

#### 用例 1：processMessage - 正常对话

```typescript
// tests/tdd/AIService/processMessage.test.ts

import { AIService } from '../../src/services/AIService';
import { MemoryService } from '../../src/services/MemoryService';
import { EmotionService } from '../../src/services/EmotionService';

describe('AIService.processMessage', () => {
  let aiService: AIService;
  let mockMemoryService: jest.Mocked<MemoryService>;
  let mockEmotionService: jest.Mocked<EmotionService>;

  beforeEach(() => {
    mockMemoryService = {
      retrieve: jest.fn(),
      update: jest.fn(),
    } as any;

    mockEmotionService = {
      analyze: jest.fn().mockResolvedValue('neutral'),
    } as any;

    aiService = new AIService(mockMemoryService, mockEmotionService);
  });

  describe('正常对话流程', () => {
    it('应该返回 AI 回复', async () => {
      // Arrange
      const req = {
        userId: 'user_123',
        content: '你好',
        type: 'text',
      };

      mockMemoryService.retrieve.mockResolvedValue([]);

      // Act
      const result = await aiService.processMessage(req);

      // Assert
      expect(result).toBeDefined();
      expect(result.message).toBeDefined();
      expect(result.message.role).toBe('assistant');
      expect(result.message.content).toBeTruthy();
      expect(result.message.emotion).toBeDefined();
    });

    it('应该正确保存对话到记忆', async () => {
      // Arrange
      const req = {
        userId: 'user_123',
        content: '我叫小明',
        type: 'text',
      };

      mockMemoryService.retrieve.mockResolvedValue([]);

      // Act
      await aiService.processMessage(req);

      // Assert
      expect(mockMemoryService.update).toHaveBeenCalled();
    });

    it('应该分析用户情绪', async () => {
      // Arrange
      const req = {
        userId: 'user_123',
        content: '今天好开心！',
        type: 'text',
      };

      mockMemoryService.retrieve.mockResolvedValue([]);

      // Act
      await aiService.processMessage(req);

      // Assert
      expect(mockEmotionService.analyze).toHaveBeenCalled();
    });
  });

  describe('边界情况', () => {
    it('空消息应该返回提示', async () => {
      const req = {
        userId: 'user_123',
        content: '',
        type: 'text',
      };

      await expect(aiService.processMessage(req)).rejects.toThrow();
    });

    it('超长消息应该返回提示', async () => {
      const longContent = 'a'.repeat(5001);
      const req = {
        userId: 'user_123',
        content: longContent,
        type: 'text',
      };

      await expect(aiService.processMessage(req)).rejects.toThrow();
    });
  });
});
```

---

### 2.2 记忆服务 - MemoryService

```typescript
// tests/tdd/MemoryService/MemoryService.test.ts

import { MemoryService } from '../../src/services/MemoryService';
import { MemoryRepository } from '../../src/repositories/MemoryRepository';

describe('MemoryService', () => {
  let memoryService: MemoryService;
  let mockRepository: jest.Mocked<MemoryRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findByUserId: jest.fn(),
      delete: jest.fn(),
    } as any;

    memoryService = new MemoryService(mockRepository);
  });

  describe('retrieve - 记忆检索', () => {
    it('应该返回短期记忆', async () => {
      // Arrange
      const userId = 'user_123';
      const mockMemories = [
        { type: 'short-term', content: '昨天天气很好' },
      ];
      mockRepository.findByUserId.mockResolvedValue(mockMemories);

      // Act
      const result = await memoryService.retrieve(userId, '天气');

      // Assert
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('空查询应该返回最近记忆', async () => {
      const userId = 'user_123';
      mockRepository.findByUserId.mockResolvedValue([]);

      const result = await memoryService.retrieve(userId, '');

      expect(result).toEqual([]);
    });
  });

  describe('update - 记忆更新', () => {
    it('重要信息应该存长期记忆', async () => {
      const userId = 'user_123';
      const content = '我叫小明，我最喜欢吃苹果';

      // Act
      await memoryService.update(userId, content);

      // Assert
      expect(mockRepository.save).toHaveBeenCalled();
      const savedMemory = mockRepository.save.mock.calls[0][0];
      expect(savedMemory.type).toBe('long-term');
      expect(savedMemory.importance).toBeGreaterThanOrEqual(4);
    });

    it('日常对话应该存短期记忆', async () => {
      const userId = 'user_123';
      const content = '今天天气不错';

      await memoryService.update(userId, content);

      const savedMemory = mockRepository.save.mock.calls[0][0];
      expect(savedMemory.type).toBe('short-term');
    });
  });
});
```

---

### 2.3 情感服务 - EmotionService

```typescript
// tests/tdd/EmotionService/EmotionService.test.ts

import { EmotionService } from '../../src/services/EmotionService';

describe('EmotionService', () => {
  let emotionService: EmotionService;

  beforeEach(() => {
    emotionService = new EmotionService();
  });

  describe('analyze - 情绪分析', () => {
    it('应该识别开心情绪', async () => {
      const content = '今天太开心了！太好了！';
      
      const result = await emotionService.analyze(content);
      
      expect(result).toBe('happy');
    });

    it('应该识别悲伤情绪', async () => {
      const content = '我很难过，感觉很伤心';
      
      const result = await emotionService.analyze(content);
      
      expect(result).toBe('sad');
    });

    it('应该识别愤怒情绪', async () => {
      const content = '我很生气，非常愤怒！';
      
      const result = await emotionService.analyze(content);
      
      expect(result).toBe('angry');
    });

    it('中性内容应该返回 neutral', async () => {
      const content = '今天几点了？';
      
      const result = await emotionService.analyze(content);
      
      expect(result).toBe('neutral');
    });

    it('空内容应该返回 neutral', async () => {
      const result = await emotionService.analyze('');
      
      expect(result).toBe('neutral');
    });
  });

  describe('getResponseStrategy - 获取回应策略', () => {
    it('happy 应该返回欢快策略', () => {
      const strategy = emotionService.getResponseStrategy('happy');
      expect(strategy.tone).toBe('cheerful');
    });

    it('sad 应该返回安慰策略', () => {
      const strategy = emotionService.getResponseStrategy('sad');
      expect(strategy.tone).toBe('comforting');
    });
  });
});
```

---

### 2.4 用户服务 - UserService

```typescript
// tests/tdd/UserService/UserService.test.ts

import { UserService } from '../../src/services/UserService';
import { UserRepository } from '../../src/repositories/UserRepository';

describe('UserService', () => {
  let userService: UserService;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findByOpenId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    userService = new UserService(mockRepository);
  });

  describe('register - 用户注册', () => {
    it('新用户应该创建成功', async () => {
      // Arrange
      const openId = 'mock_openid_123';
      mockRepository.findByOpenId.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue({
        id: 'user_1',
        openId,
        nickname: '微信用户',
      });

      // Act
      const result = await userService.register(openId);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe('user_1');
      expect(mockRepository.create).toHaveBeenCalled();
    });

    it('老用户应该返回已有信息', async () => {
      const existingUser = { id: 'user_1', openId: 'mock_openid_123' };
      mockRepository.findByOpenId.mockResolvedValue(existingUser);

      const result = await userService.register('mock_openid_123');

      expect(result).toEqual(existingUser);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('updateProfile - 更新资料', () => {
    it('应该更新用户资料', async () => {
      const userId = 'user_1';
      const updates = { nickname: '小明', avatar: 'http://xxx.jpg' };

      mockRepository.update.mockResolvedValue({ ...updates, id: userId });

      const result = await userService.updateProfile(userId, updates);

      expect(result.nickname).toBe('小明');
      expect(mockRepository.update).toHaveBeenCalledWith(userId, updates);
    });
  });
});
```

---

### 2.5 日程服务 - ScheduleService

```typescript
// tests/tdd/ScheduleService/ScheduleService.test.ts

import { ScheduleService } from '../../src/services/ScheduleService';
import { ScheduleRepository } from '../../src/repositories/ScheduleRepository';

describe('ScheduleService', () => {
  let scheduleService: ScheduleService;
  let mockRepository: jest.Mocked<ScheduleRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findByUserId: jest.fn(),
      findPending: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    scheduleService = new ScheduleService(mockRepository);
  });

  describe('create - 创建日程', () => {
    it('应该成功创建日程', async () => {
      const schedule = {
        userId: 'user_1',
        title: '吃维生素',
        remindAt: new Date('2026-02-21T08:00:00Z'),
        repeat: null,
      };

      mockRepository.create.mockResolvedValue({ ...schedule, id: 'sched_1' });

      const result = await scheduleService.create(schedule);

      expect(result.id).toBe('sched_1');
      expect(mockRepository.create).toHaveBeenCalled();
    });

    it('提醒时间已过应该报错', async () => {
      const schedule = {
        userId: 'user_1',
        title: '测试',
        remindAt: new Date('2020-01-01T08:00:00Z'), // 过去时间
        repeat: null,
      };

      await expect(scheduleService.create(schedule)).rejects.toThrow();
    });
  });

  describe('getTodaySchedules - 获取今日日程', () => {
    it('应该返回今日待办日程', async () => {
      const userId = 'user_1';
      const today = new Date();
      const schedules = [
        { id: '1', title: '吃维生素', remindAt: today, completed: false },
      ];

      mockRepository.findByUserId.mockResolvedValue(schedules);

      const result = await scheduleService.getTodaySchedules(userId);

      expect(result.length).toBeGreaterThanOrEqual(1);
    });

    it('已完成的日程不应该返回', async () => {
      const userId = 'user_1';
      const schedules = [
        { id: '1', title: '测试', remindAt: new Date(), completed: true },
      ];

      mockRepository.findByUserId.mockResolvedValue(schedules);

      const result = await scheduleService.getTodaySchedules(userId);

      expect(result).toEqual([]);
    });
  });

  describe('complete - 完成日程', () => {
    it('应该标记日程为已完成', async () => {
      const scheduleId = 'sched_1';

      await scheduleService.complete(scheduleId);

      expect(mockRepository.update).toHaveBeenCalledWith(scheduleId, {
        completed: true,
      });
    });
  });
});
```

---

### 2.6 API 控制器测试

```typescript
// tests/tdd/controllers/chatController.test.ts

import { ChatController } from '../../src/controllers/chatController';
import { AIService } from '../../src/services/AIService';

describe('ChatController', () => {
  let controller: ChatController;
  let mockAIService: jest.Mocked<AIService>;

  beforeEach(() => {
    mockAIService = {
      processMessage: jest.fn(),
    } as any;

    controller = new ChatController(mockAIService);
  });

  describe('sendMessage - 发送消息', () => {
    it('应该返回 AI 回复', async () => {
      // Arrange
      const mockReq = {
        user: { id: 'user_1' },
        body: { content: '你好', type: 'text' },
      } as any;

      const mockRes = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as any;

      mockAIService.processMessage.mockResolvedValue({
        message: {
          id: 'msg_1',
          role: 'assistant',
          content: '你好呀~',
          emotion: 'happy',
        },
      });

      // Act
      await controller.sendMessage(mockReq, mockRes);

      // Assert
      expect(mockRes.json).toHaveBeenCalledWith({
        code: 0,
        data: expect.objectContaining({
          message: expect.objectContaining({
            content: '你好呀~',
          }),
        }),
      });
    });

    it('服务异常应该返回错误', async () => {
      const mockReq = {
        user: { id: 'user_1' },
        body: { content: 'test', type: 'text' },
      } as any;

      const mockRes = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as any;

      mockAIService.processMessage.mockRejectedValue(new Error('AI Error'));

      await controller.sendMessage(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        code: 500,
        message: 'AI 服务异常',
      });
    });
  });
});
```

---

## 3. 测试覆盖率目标

| 模块 | 目标覆盖率 |
|------|------------|
| AIService | ≥ 80% |
| MemoryService | ≥ 85% |
| EmotionService | ≥ 80% |
| UserService | ≥ 80% |
| ScheduleService | ≥ 80% |
| Controllers | ≥ 70% |

---

## 4. 测试数据准备

```typescript
// tests/fixtures/index.ts

export const mockUsers = {
  newUser: {
    id: 'user_new',
    openId: 'openid_new_123',
    nickname: '新用户',
  },
  existingUser: {
    id: 'user_existing',
    openId: 'openid_existing_456',
    nickname: '老用户',
  },
};

export const mockMessages = {
  userMessage: {
    role: 'user',
    content: '你好',
  },
  aiMessage: {
    role: 'assistant',
    content: '你好呀~我是小桃',
  },
};

export const mockSchedules = {
  today: {
    id: 'sched_1',
    userId: 'user_1',
    title: '吃维生素',
    remindAt: new Date(),
    completed: false,
  },
  tomorrow: {
    id: 'sched_2',
    userId: 'user_1',
    title: '开会',
    remindAt: new Date(Date.now() + 86400000),
    completed: false,
  },
};
```

---

**文档版本历史**

| 版本 | 日期 | 修改人 | 修改内容 |
|------|------|--------|----------|
| v1.0.0 | 2026-02-20 | 小桃 | 初稿创建 |
