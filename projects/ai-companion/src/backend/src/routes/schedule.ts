// src/backend/src/routes/schedule.ts

import { Router, Response } from 'express';
import { ScheduleService } from '../services/ScheduleService';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const scheduleService = new ScheduleService();

// 添加日程
router.post('/add', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { title, content, remindAt, repeat } = req.body;

    if (!title || !remindAt) {
      return res.status(400).json({
        code: 400,
        message: '缺少必要参数',
      });
    }

    const schedule = await scheduleService.create({
      userId,
      title,
      content,
      remindAt: new Date(remindAt),
      repeat,
    });

    res.json({
      code: 0,
      data: {
        id: schedule.id,
        title: schedule.title,
        remindAt: schedule.remindAt,
      },
    });
  } catch (error) {
    console.error('添加日程失败:', error);
    res.status(500).json({
      code: 500,
      message: error instanceof Error ? error.message : '添加日程失败',
    });
  }
});

// 获取日程列表
router.get('/list', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { type = 'all' } = req.query;

    let schedules;
    if (type === 'today') {
      schedules = await scheduleService.getTodaySchedules(userId);
    } else {
      schedules = await scheduleService.findByUserId(userId);
    }

    res.json({
      code: 0,
      data: {
        schedules: schedules.map((s) => ({
          id: s.id,
          title: s.title,
          content: s.content,
          remindAt: s.remindAt,
          repeat: s.repeat,
          completed: s.completed,
        })),
      },
    });
  } catch (error) {
    console.error('获取日程失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取日程失败',
    });
  }
});

// 完成日程
router.post('/complete/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await scheduleService.complete(id);

    res.json({
      code: 0,
      message: '完成成功',
    });
  } catch (error) {
    console.error('完成日程失败:', error);
    res.status(500).json({
      code: 500,
      message: error instanceof Error ? error.message : '完成日程失败',
    });
  }
});

// 删除日程
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await scheduleService.delete(id);

    res.json({
      code: 0,
      message: '删除成功',
    });
  } catch (error) {
    console.error('删除日程失败:', error);
    res.status(500).json({
      code: 500,
      message: error instanceof Error ? error.message : '删除日程失败',
    });
  }
});

export { router as scheduleRouter };
