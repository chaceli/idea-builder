// src/backend/src/routes/user.ts

import { Router, Response } from 'express';
import { UserService } from '../services/UserService';
import { AIService } from '../services/AIService';
import { MemoryService } from '../services/MemoryService';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { SUPPORTED_MODELS } from '../ai/adapters';

const router = Router();
const userService = new UserService();
const memoryService = new MemoryService();
// 创建一个临时的 AIService 实例用于获取模型列表
const aiService = new AIService(memoryService as any, {} as any, {} as any);

// 获取用户资料
router.get('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const user = await userService.getById(userId);

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在',
      });
    }

    res.json({
      code: 0,
      data: {
        id: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
        personality: user.personality,
      },
    });
  } catch (error) {
    console.error('获取资料失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取资料失败',
    });
  }
});

// 更新用户资料
router.put('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { nickname, avatar } = req.body;

    const user = await userService.updateProfile(userId, { nickname, avatar });

    res.json({
      code: 0,
      data: {
        id: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('更新资料失败:', error);
    res.status(500).json({
      code: 500,
      message: '更新资料失败',
    });
  }
});

// 获取用户画像
router.get('/profile/detail', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const profile = await memoryService.getUserProfile(userId);

    res.json({
      code: 0,
      data: profile,
    });
  } catch (error) {
    console.error('获取画像失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取画像失败',
    });
  }
});

// 更新人格设置
router.put('/personality', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { personality } = req.body;

    const user = await userService.updatePersonality(userId, personality);

    res.json({
      code: 0,
      data: {
        personality: user.personality,
      },
    });
  } catch (error) {
    console.error('更新人格失败:', error);
    res.status(500).json({
      code: 500,
      message: '更新人格失败',
    });
  }
});

// ======== AI 配置相关接口 ========

// 获取支持的模型列表
router.get('/ai/models', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const models = aiService.getSupportedModels();
    
    res.json({
      code: 0,
      data: models,
    });
  } catch (error) {
    console.error('获取模型列表失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取模型列表失败',
    });
  }
});

// 获取用户 AI 配置
router.get('/ai/config', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const config = await userService.getAIConfig(userId);

    res.json({
      code: 0,
      data: config,
    });
  } catch (error) {
    console.error('获取 AI 配置失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取 AI 配置失败',
    });
  }
});

// 更新用户 AI 配置
router.put('/ai/config', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { modelId, apiKey, provider } = req.body;

    const config = await userService.updateAIConfig(userId, { modelId, apiKey, provider });

    res.json({
      code: 0,
      data: config,
    });
  } catch (error: any) {
    console.error('更新 AI 配置失败:', error);
    res.status(400).json({
      code: 400,
      message: error.message || '更新 AI 配置失败',
    });
  }
});

export { router as userRouter };
