// src/backend/src/routes/chat.ts

import { Router } from 'express';
import { ChatController } from '../controllers/chatController';
import { AIService } from '../services/AIService';
import { MemoryService } from '../services/MemoryService';
import { EmotionService } from '../services/EmotionService';
import { TTSService } from '../services/TTSService';
import { UserService } from '../services/UserService';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// 初始化服务
const memoryService = new MemoryService();
const emotionService = new EmotionService();
const ttsService = new TTSService();
const userService = new UserService();
const aiService = new AIService(memoryService, emotionService, ttsService);
const chatController = new ChatController(aiService, userService);

// 发送消息 - 需要鉴权
router.post('/message', authMiddleware, chatController.sendMessage.bind(chatController));

// 获取历史 - 需要鉴权
router.get('/history', authMiddleware, chatController.getHistory.bind(chatController));

export { router as chatRouter };
