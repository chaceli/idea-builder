// src/backend/tests/unit/UserService.test.ts

import { UserService } from '../src/services/UserService';
import { User } from '../src/models/User';

// Mock sequelize
jest.mock('../src/models/User', () => ({
  User: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  },
}));

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    jest.clearAllMocks();
    userService = new UserService();
  });

  describe('findOrCreateByOpenId - 通过 OpenID 查找或创建用户', () => {
    it('新用户应该创建成功', async () => {
      const mockUser = {
        id: 'user_1',
        openid: 'openid_123',
        nickname: '微信用户',
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.findOrCreateByOpenId('openid_123');

      expect(result).toBeDefined();
      expect(User.create).toHaveBeenCalled();
    });

    it('老用户应该返回已有信息', async () => {
      const existingUser = {
        id: 'user_1',
        openid: 'openid_123',
        nickname: '老用户',
      };

      (User.findOne as jest.Mock).mockResolvedValue(existingUser);

      const result = await userService.findOrCreateByOpenId('openid_123');

      expect(result).toEqual(existingUser);
      expect(User.create).not.toHaveBeenCalled();
    });
  });

  describe('getById - 通过 ID 获取用户', () => {
    it('用户存在应该返回用户', async () => {
      const mockUser = { id: 'user_1', nickname: '测试用户' };
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.getById('user_1');

      expect(result).toEqual(mockUser);
    });

    it('用户不存在应该返回 null', async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await userService.getById('invalid_id');

      expect(result).toBeNull();
    });
  });

  describe('updateProfile - 更新用户资料', () => {
    it('应该成功更新用户资料', async () => {
      const mockUser = {
        id: 'user_1',
        nickname: '旧昵称',
        update: jest.fn().mockResolvedValue({
          id: 'user_1',
          nickname: '新昵称',
        }),
      };

      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.updateProfile('user_1', { nickname: '新昵称' });

      expect(mockUser.update).toHaveBeenCalledWith({ nickname: '新昵称' });
    });

    it('用户不存在应该报错', async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(userService.updateProfile('invalid_id', { nickname: '新昵称' })).rejects.toThrow('用户不存在');
    });
  });

  describe('updatePersonality - 更新人格设置', () => {
    it('应该成功更新人格设置', async () => {
      const personality = { type: 'gentle', tone: 'warm' };
      const mockUser = {
        id: 'user_1',
        personality: {},
        update: jest.fn().mockResolvedValue({
          id: 'user_1',
          personality,
        }),
      };

      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.updatePersonality('user_1', personality);

      expect(mockUser.update).toHaveBeenCalledWith({ personality });
    });
  });

  describe('getPersonality - 获取人格设置', () => {
    it('应该返回人格设置', async () => {
      const personality = { type: 'default', tone: 'warm' };
      const mockUser = { id: 'user_1', personality };

      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.getPersonality('user_1');

      expect(result).toEqual(personality);
    });

    it('用户不存在应该报错', async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(userService.getPersonality('invalid_id')).rejects.toThrow('用户不存在');
    });
  });
});
