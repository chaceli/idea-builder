// src/backend/tests/unit/EmotionService.test.ts

import { EmotionService } from '../src/services/EmotionService';

describe('EmotionService', () => {
  let emotionService: EmotionService;

  beforeEach(() => {
    emotionService = new EmotionService();
  });

  describe('analyze - 情绪分析', () => {
    it('应该识别开心情绪 - 开心关键词', async () => {
      const content = '今天太开心了！太好了！';
      const result = await emotionService.analyze(content);
      expect(result).toBe('happy');
    });

    it('应该识别开心情绪 - 高兴关键词', async () => {
      const content = '我今天很高兴';
      const result = await emotionService.analyze(content);
      expect(result).toBe('happy');
    });

    it('应该识别开心情绪 - 哈哈', async () => {
      const content = '哈哈，真好玩';
      const result = await emotionService.analyze(content);
      expect(result).toBe('happy');
    });

    it('应该识别悲伤情绪 - 难过', async () => {
      const content = '我很难过，感觉很伤心';
      const result = await emotionService.analyze(content);
      expect(result).toBe('sad');
    });

    it('应该识别悲伤情绪 - 郁闷', async () => {
      const content = '今天很郁闷';
      const result = await emotionService.analyze(content);
      expect(result).toBe('sad');
    });

    it('应该识别愤怒情绪 - 生气', async () => {
      const content = '我很生气，非常愤怒！';
      const result = await emotionService.analyze(content);
      expect(result).toBe('angry');
    });

    it('应该识别愤怒情绪 - 烦死了', async () => {
      const content = '烦死了';
      const result = await emotionService.analyze(content);
      expect(result).toBe('angry');
    });

    it('应该识别激动情绪', async () => {
      const content = '太棒了！太赞了！';
      const result = await emotionService.analyze(content);
      expect(result).toBe('excited');
    });

    it('应该识别同情情绪 - 担心', async () => {
      const content = '我担心考试';
      const result = await emotionService.analyze(content);
      expect(result).toBe('sympathy');
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
      expect(strategy.actions).toContain('celebrate');
    });

    it('sad 应该返回安慰策略', () => {
      const strategy = emotionService.getResponseStrategy('sad');
      expect(strategy.tone).toBe('comforting');
      expect(strategy.actions).toContain('listen');
    });

    it('angry 应该返回冷静策略', () => {
      const strategy = emotionService.getResponseStrategy('angry');
      expect(strategy.tone).toBe('calming');
      expect(strategy.actions).toContain('understand');
    });

    it('unknown 应该返回默认策略', () => {
      const strategy = emotionService.getResponseStrategy('unknown');
      expect(strategy.tone).toBe('warm');
    });
  });

  describe('adjustReplyByEmotion - 根据情绪调整回复', () => {
    it('happy 情绪应该添加前缀', () => {
      const reply = '今天天气很好';
      const result = emotionService.adjustReplyByEmotion(reply, 'happy');
      expect(result).toContain('太棒了');
    });

    it('sad 情绪应该添加前缀', () => {
      const reply = '没关系的';
      const result = emotionService.adjustReplyByEmotion(reply, 'sad');
      expect(result).toContain('理解你的感受');
    });

    it('neutral 不应该添加前缀', () => {
      const reply = '好的';
      const result = emotionService.adjustReplyByEmotion(reply, 'neutral');
      expect(result).toBe(reply);
    });
  });
});
