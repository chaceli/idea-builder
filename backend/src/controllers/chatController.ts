// src/backend/src/controllers/chatController.ts

import { Request, Response } from 'express';
import { AIService } from '../services/AIService';
import { UserService } from '../services/UserService';

export class ChatController {
  private aiService: AIService;
  private userService: UserService;

  constructor(aiService: AIService, userService: UserService) {
    this.aiService = aiService;
    this.userService = userService;
  }

  // 发送消息
  async sendMessage(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { content, type = 'text', voiceUrl, modelId } = req.body;

      if (!content || content.trim() === '') {
        return res.status(400).json({
          code: 400,
          message: '消息内容不能为空',
        });
      }

      if (content.length > 5000) {
        return res.status(400).json({
          code: 400,
          message: '消息内容过长',
        });
      }

      // 获取用户选择的模型（优先使用请求中的 modelId，否则使用用户配置）
      let useModelId = modelId;
      if (!useModelId) {
        useModelId = await this.userService.getUserModelId(userId);
      }

      // 获取用户的 API Key（如果用户配置了自定义 API Key）
      const userApiKey = await this.userService.getUserApiKey(userId);

      // 设置使用的模型
      this.aiService.setModel(useModelId);

      const result = await this.aiService.processMessage({
        userId,
        content,
        type,
        voiceUrl,
        modelId: useModelId,
      });

      res.json({
        code: 0,
        data: result,
      });
    } catch (error: any) {
      console.error('发送消息失败:', error);
      res.status(500).json({
        code: 500,
        message: error.message || 'AI 服务异常',
      });
    }
  }

  // 获取聊天历史
  async getHistory(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { limit = 50, offset = 0 } = req.query;

      // TODO: 实现获取历史消息逻辑

      res.json({
        code: 0,
        data: {
          messages: [],
          hasMore: false,
        },
      });
    } catch (error) {
      console.error('获取历史失败:', error);
      res.status(500).json({
        code: 500,
        message: '获取历史失败',
      });
    }
  }
}
