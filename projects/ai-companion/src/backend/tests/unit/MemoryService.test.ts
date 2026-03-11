// src/backend/tests/unit/MemoryService.test.ts

import { MemoryService } from '../src/services/MemoryService';
import { Memory } from '../src/models/Memory';
import { Message } from '../src/models/Message';

// Mock sequelize models
jest.mock('../src/models/Memory', () => ({
  Memory: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('../src/models/Message', () => ({
  Message: {
    findAll: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('../src/db/redis', () => ({
  shortTermMemory: {
    push: jest.fn(),
    get: jest.fn(),
    clear: jest.fn(),
  },
}));

describe('MemoryService', () => {
  let memoryService: MemoryService;

  beforeEach(() => {
    jest.clearAllMocks();
    memoryService = new MemoryService();
  });

  describe('retrieve - 记忆检索', () => {
    it('应该返回长期记忆', async () => {
      const mockMemories = [
        { content: '用户叫小明', importance: 5 },
        { content: '用户喜欢编程', importance: 4 },
      ];

      (Memory.findAll as jest.Mock).mockResolvedValue(mockMemories);

      const result = await memoryService.retrieve('user_123', '编程');

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('空查询应该返回空数组', async () => {
      (Memory.findAll as jest.Mock).mockResolvedValue([]);

      const result = await memoryService.retrieve('user_123', '');

      expect(result).toEqual([]);
    });
  });

  describe('getRecentMessages - 获取最近消息', () => {
    it('应该返回最近消息', async () => {
      const mockMessages = [
        { role: 'user', content: '你好' },
        { role: 'assistant', content: '你好呀' },
      ];

      (Message.findAll as jest.Mock).mockResolvedValue(mockMessages);

      const result = await memoryService.getRecentMessages('user_123', 10);

      expect(result).toBeDefined();
    });
  });

  describe('update - 记忆更新', () => {
    it('名字信息应该存为长期记忆', async () => {
      (Memory.findOne as jest.Mock).mockResolvedValue(null);
      (Memory.create as jest.Mock).mockResolvedValue({});

      await memoryService.update('user_123', '我叫小明', '好的小明');

      expect(Memory.create).toHaveBeenCalled();
      const savedMemory = (Memory.create as jest.Mock).mock.calls[0][0];
      expect(savedMemory.type).toBe('fact');
      expect(savedMemory.importance).toBe(5);
    });

    it('已存在的信息不应该重复创建', async () => {
      (Memory.findOne as jest.Mock).mockResolvedValue({ id: 'existing' });

      await memoryService.update('user_123', '我叫小明', '好的');

      expect(Memory.create).not.toHaveBeenCalled();
    });

    it('日常对话应该存为短期记忆', async () => {
      (Memory.findOne as jest.Mock).mockResolvedValue(null);
      (Memory.create as jest.Mock).mockResolvedValue({});

      await memoryService.update('user_123', '今天天气不错', '是啊');

      const savedMemory = (Memory.create as jest.Mock).mock.calls[0][0];
      expect(savedMemory.type).toBe('short-term');
    });
  });

  describe('getUserProfile - 获取用户画像', () => {
    it('应该返回用户画像', async () => {
      const mockFacts = [
        { content: '用户叫小明' },
        { content: '用户喜欢编程' },
        { content: '用户生日是6月1日' },
      ];

      (Memory.findAll as jest.Mock).mockResolvedValue(mockFacts);

      const result = await memoryService.getUserProfile('user_123');

      expect(result).toBeDefined();
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('interests');
    });
  });
});
