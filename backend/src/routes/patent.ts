// src/backend/src/routes/patent.ts

import { Router } from 'express';
import { PatentController } from '../controllers/patentController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// 初始化控制器
const patentController = new PatentController();

// 专利列表 - 需要鉴权
router.get('/', authMiddleware, patentController.list.bind(patentController));

// 创建专利 - 需要鉴权
router.post('/', authMiddleware, patentController.create.bind(patentController));

// 获取专利详情 - 需要鉴权
router.get('/:id', authMiddleware, patentController.get.bind(patentController));

// 更新专利 - 需要鉴权
router.put('/:id', authMiddleware, patentController.update.bind(patentController));

// 删除专利 - 需要鉴权
router.delete('/:id', authMiddleware, patentController.delete.bind(patentController));

// 生成专利内容 - 需要鉴权
router.post('/:id/generate', authMiddleware, patentController.generate.bind(patentController));

// 优化专利 - 需要鉴权
router.post('/:id/optimize', authMiddleware, patentController.optimize.bind(patentController));

// 专利查重 - 需要鉴权
router.post('/:id/check', authMiddleware, patentController.check.bind(patentController));

// 获取专利版本列表 - 需要鉴权
router.get('/:id/versions', authMiddleware, patentController.listVersions.bind(patentController));

// 恢复版本 - 需要鉴权
router.post('/:id/versions/:versionId/restore', authMiddleware, patentController.restoreVersion.bind(patentController));

export { router as patentRouter };
