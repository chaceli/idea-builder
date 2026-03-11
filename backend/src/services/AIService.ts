// src/backend/src/services/AIService.ts

import { AdapterFactory, IAdapter, ModelProvider, SUPPORTED_MODELS } from '../ai/adapters';
import { MemoryService } from './MemoryService';
import { EmotionService } from './EmotionService';
import { TTSService } from './TTSService';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  userId: string;
  content: string;
  type: 'text' | 'voice';
  voiceUrl?: string;
  modelId?: string; // 可选：指定使用的模型
}

export interface ChatResponse {
  message: {
    id: string;
    role: 'assistant';
    content: string;
    voiceUrl?: string;
    emotion: string;
  };
  modelId: string; // 返回当前使用的模型
}

export class AIService {
  private memoryService: MemoryService;
  private emotionService: EmotionService;
  private ttsService: TTSService;
  private adapter: IAdapter;

  constructor(memoryService: MemoryService, emotionService: EmotionService, ttsService: TTSService) {
    this.memoryService = memoryService;
    this.emotionService = emotionService;
    this.ttsService = ttsService;
    
    // 默认使用 MiniMax 适配器
    this.adapter = AdapterFactory.getAdapter(config.ai.model);
  }

  /**
   * 切换使用的模型
   */
  setModel(modelId: string): void {
    this.adapter = AdapterFactory.getAdapter(modelId);
  }

  /**
   * 获取当前模型
   */
  getCurrentModel(): string {
    return this.adapter.modelId;
  }

  /**
   * 获取所有支持的模型
   */
  getSupportedModels() {
    return SUPPORTED_MODELS;
  }

  async processMessage(req: ChatRequest): Promise<ChatResponse> {
    const { userId, content, type, modelId } = req;

    // 如果指定了模型，切换适配器
    if (modelId && modelId !== this.adapter.modelId) {
      this.setModel(modelId);
    }

    // 1. 检索记忆
    const memories = await this.memoryService.retrieve(userId, content);
    const recentMessages = await this.memoryService.getRecentMessages(userId, 10);

    // 2. 构建 Prompt
    // 注意：不同模型的 Prompt 格式可能不同
    const prompt = this.buildPrompt(content, memories, recentMessages);

    // 3. 调用 AI
    const aiResponse = await this.adapter.chat(prompt, {
      maxTokens: 1024,
      temperature: 0.7,
    });

    // 4. 情感分析
    const emotion = await this.emotionService.analyze(aiResponse);

    // 5. 语音合成（可选）
    let voiceUrl: string | undefined;
    if (type === 'voice' || req.type === 'voice') {
      voiceUrl = await this.ttsService.synthesize(aiResponse);
    }

    // 6. 保存对话
    await this.memoryService.saveMessage(userId, 'user', content);
    await this.memoryService.saveMessage(userId, 'assistant', aiResponse);

    // 7. 更新记忆
    await this.memoryService.update(userId, content, aiResponse);

    return {
      message: {
        id: uuidv4(),
        role: 'assistant',
        content: aiResponse,
        voiceUrl,
        emotion,
      },
      modelId: this.adapter.modelId,
    };
  }

  /**
   * 构建提示词
   * 不同模型可能需要不同的格式
   */
  private buildPrompt(content: string, memories: any[], recentMessages: any[]): string {
    // 这里可以针对不同模型做优化
    // 目前使用通用格式
    let prompt = '';
    
    // 添加记忆上下文
    if (memories.length > 0) {
      prompt += '以下是之前对话的相关记忆：\n';
      memories.forEach(m => {
        prompt += `- ${m.content}\n`;
      });
      prompt += '\n';
    }

    // 添加最近对话
    if (recentMessages.length > 0) {
      prompt += '最近的对话：\n';
      recentMessages.forEach(m => {
        const role = m.role === 'user' ? '用户' : '助手';
        prompt += `${role}: ${m.content}\n`;
      });
      prompt += '\n';
    }

    // 添加当前消息
    prompt += `用户说：${content}\n\n请回复：`;

    return prompt;
  }
}
