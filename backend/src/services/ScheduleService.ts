// src/backend/src/services/ScheduleService.ts

import { Schedule } from '../models/Schedule';
import { Op } from 'sequelize';
import moment from 'moment';

export class ScheduleService {
  // 创建日程
  async create(data: {
    userId: string;
    title: string;
    content?: string;
    remindAt: Date;
    repeat?: object;
  }): Promise<Schedule> {
    // 验证提醒时间
    if (new Date(data.remindAt) < new Date()) {
      throw new Error('提醒时间不能是过去时间');
    }

    return await Schedule.create({
      ...data,
      completed: false,
    } as any);
  }

  // 获取用户所有日程
  async findByUserId(userId: string): Promise<Schedule[]> {
    return await Schedule.findAll({
      where: { userId },
      order: [['remindAt', 'ASC']],
    });
  }

  // 获取今日日程
  async getTodaySchedules(userId: string): Promise<Schedule[]> {
    const today = moment().startOf('day');
    const tomorrow = moment().endOf('day');

    return await Schedule.findAll({
      where: {
        userId,
        remindAt: {
          [Op.between]: [today.toDate(), tomorrow.toDate()],
        },
        completed: false,
      },
      order: [['remindAt', 'ASC']],
    });
  }

  // 获取待提醒日程（定时任务调用）
  async getPendingSchedules(): Promise<Schedule[]> {
    const now = new Date();
    const fiveMinutesLater = new Date(now.getTime() + 5 * 60 * 1000);

    return await Schedule.findAll({
      where: {
        remindAt: {
          [Op.between]: [now, fiveMinutesLater],
        },
        completed: false,
      },
    });
  }

  // 完成日程
  async complete(id: string): Promise<void> {
    const schedule = await Schedule.findByPk(id);
    if (!schedule) {
      throw new Error('日程不存在');
    }

    // 如果是重复日程，创建下一个
    if (schedule.repeat) {
      const repeat = schedule.repeat as { type: string; endDate?: Date };
      let nextRemindAt: Date;

      switch (repeat.type) {
        case 'daily':
          nextRemindAt = moment(schedule.remindAt).add(1, 'day').toDate();
          break;
        case 'weekly':
          nextRemindAt = moment(schedule.remindAt).add(1, 'week').toDate();
          break;
        case 'monthly':
          nextRemindAt = moment(schedule.remindAt).add(1, 'month').toDate();
          break;
        default:
          nextRemindAt = schedule.remindAt;
      }

      // 检查是否超过结束日期
      if (repeat.endDate && nextRemindAt > repeat.endDate) {
        // 不再创建
      } else {
        await Schedule.create({
          userId: schedule.userId,
          title: schedule.title,
          content: schedule.content,
          remindAt: nextRemindAt,
          repeat: schedule.repeat,
          completed: false,
        } as any);
      }
    }

    await schedule.update({ completed: true });
  }

  // 删除日程
  async delete(id: string): Promise<void> {
    const schedule = await Schedule.findByPk(id);
    if (!schedule) {
      throw new Error('日程不存在');
    }

    await schedule.destroy();
  }

  // 更新日程
  async update(id: string, updates: { title?: string; content?: string; remindAt?: Date }): Promise<Schedule> {
    const schedule = await Schedule.findByPk(id);
    if (!schedule) {
      throw new Error('日程不存在');
    }

    await schedule.update(updates);
    return schedule;
  }
}
