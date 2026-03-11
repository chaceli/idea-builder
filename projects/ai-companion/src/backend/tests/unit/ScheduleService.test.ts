// src/backend/tests/unit/ScheduleService.test.ts

import { ScheduleService } from '../src/services/ScheduleService';
import { Schedule } from '../src/models/Schedule';

// Mock sequelize
jest.mock('../src/models/Schedule', () => ({
  Schedule: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe('ScheduleService', () => {
  let scheduleService: ScheduleService;

  beforeEach(() => {
    jest.clearAllMocks();
    scheduleService = new ScheduleService();
  });

  describe('create - 创建日程', () => {
    it('应该成功创建日程', async () => {
      const scheduleData = {
        userId: 'user_1',
        title: '吃维生素',
        remindAt: new Date(Date.now() + 86400000), // 明天
        repeat: null,
      };

      (Schedule.create as jest.Mock).mockResolvedValue({
        ...scheduleData,
        id: 'sched_1',
      });

      const result = await scheduleService.create(scheduleData);

      expect(result).toBeDefined();
      expect(Schedule.create).toHaveBeenCalled();
    });

    it('提醒时间已过应该报错', async () => {
      const scheduleData = {
        userId: 'user_1',
        title: '测试',
        remindAt: new Date('2020-01-01T08:00:00Z'),
        repeat: null,
      };

      await expect(scheduleService.create(scheduleData)).rejects.toThrow('提醒时间不能是过去时间');
    });
  });

  describe('getTodaySchedules - 获取今日日程', () => {
    it('应该返回今日待办日程', async () => {
      const today = new Date();
      const schedules = [
        { id: '1', title: '吃维生素', remindAt: today, completed: false },
      ];

      (Schedule.findAll as jest.Mock).mockResolvedValue(schedules);

      const result = await scheduleService.getTodaySchedules('user_1');

      expect(result.length).toBeGreaterThanOrEqual(1);
    });

    it('已完成的日程不应该返回', async () => {
      const schedules = [
        { id: '1', title: '测试', remindAt: new Date(), completed: true },
      ];

      (Schedule.findAll as jest.Mock).mockResolvedValue(schedules);

      const result = await scheduleService.getTodaySchedules('user_1');

      expect(result).toEqual([]);
    });
  });

  describe('complete - 完成日程', () => {
    it('应该标记日程为已完成', async () => {
      const mockSchedule = {
        id: 'sched_1',
        update: jest.fn(),
      };

      (Schedule.findByPk as jest.Mock).mockResolvedValue(mockSchedule);

      await scheduleService.complete('sched_1');

      expect(mockSchedule.update).toHaveBeenCalledWith({ completed: true });
    });

    it('日程不存在应该报错', async () => {
      (Schedule.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(scheduleService.complete('invalid_id')).rejects.toThrow('日程不存在');
    });
  });

  describe('delete - 删除日程', () => {
    it('应该成功删除日程', async () => {
      const mockSchedule = {
        id: 'sched_1',
        destroy: jest.fn(),
      };

      (Schedule.findByPk as jest.Mock).mockResolvedValue(mockSchedule);

      await scheduleService.delete('sched_1');

      expect(mockSchedule.destroy).toHaveBeenCalled();
    });

    it('日程不存在应该报错', async () => {
      (Schedule.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(scheduleService.delete('invalid_id')).rejects.toThrow('日程不存在');
    });
  });

  describe('findByUserId - 获取用户所有日程', () => {
    it('应该返回用户日程列表', async () => {
      const schedules = [
        { id: '1', title: '日程1' },
        { id: '2', title: '日程2' },
      ];

      (Schedule.findAll as jest.Mock).mockResolvedValue(schedules);

      const result = await scheduleService.findByUserId('user_1');

      expect(result).toEqual(schedules);
    });
  });
});
