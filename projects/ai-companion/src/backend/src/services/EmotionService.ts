// src/backend/src/services/EmotionService.ts

// 情感关键词映射
const EMOTION_KEYWORDS: Record<string, string[]> = {
  happy: ['开心', '高兴', '快乐', '太棒了', '好开心', '哈哈', '太好了', '兴奋', '激动', '棒', '完美'],
  sad: ['难过', '伤心', '悲伤', '哭', '郁闷', '不爽', '烦', '累', '失望', '沮丧', '忧伤', '心疼'],
  angry: ['生气', '愤怒', '讨厌', '烦死了', '气', '怒', '不爽', '凭什么', '可恶'],
  excited: ['超棒', '太赞了', '牛逼', '厉害', '牛', '震撼', '激动人心'],
  sympathy: ['心疼', '担心', '害怕', '焦虑', '压力', '紧张', '不安', '恐惧'],
};

export class EmotionService {
  // 分析情绪
  async analyze(text: string): Promise<string> {
    const lowerText = text.toLowerCase();

    // 检查各情绪关键词
    for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) {
          return emotion;
        }
      }
    }

    return 'neutral';
  }

  // 获取回应策略
  getResponseStrategy(emotion: string): { tone: string; actions: string[] } {
    const strategies: Record<string, { tone: string; actions: string[] }> = {
      happy: {
        tone: 'cheerful',
        actions: ['celebrate', 'encourage', 'share_joy'],
      },
      sad: {
        tone: 'comforting',
        actions: ['listen', 'comfort', 'support', 'distract'],
      },
      angry: {
        tone: 'calming',
        actions: ['understand', 'validate', 'calm_down'],
      },
      excited: {
        tone: 'enthusiastic',
        actions: ['match_energy', 'celebrate', 'encourage'],
      },
      sympathy: {
        tone: 'caring',
        actions: ['empathize', 'reassure', 'offer_help'],
      },
      neutral: {
        tone: 'warm',
        actions: ['engage', 'continue_conversation'],
      },
    };

    return strategies[emotion] || strategies.neutral;
  }

  // 根据情绪调整回复
  adjustReplyByEmotion(baseReply: string, emotion: string): string {
    const strategy = this.getResponseStrategy(emotion);

    // 前缀调整
    const prefixes: Record<string, string> = {
      happy: '太棒了！',
      sad: '我理解你的感受~',
      angry: '消消气啦~',
      excitement: '哇！',
      sympathy: '别担心，有我在~',
    };

    const prefix = prefixes[emotion] || '';

    if (prefix && !baseReply.startsWith(prefix)) {
      return prefix + baseReply;
    }

    return baseReply;
  }
}
