// src/backend/tests/integration/auth.test.ts

import request from 'supertest';
import express from 'express';
import { authRouter } from '../src/routes/auth';

// Mock dependencies
jest.mock('../src/services/UserService', () => ({
  UserService: jest.fn().mockImplementation(() => ({
    findOrCreateByOpenId: jest.fn().mockResolvedValue({
      id: 'user_1',
      openid: 'mock_openid',
      nickname: '测试用户',
      avatar: '',
      personality: {},
    }),
  })),
}));

jest.mock('axios');
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock_token'),
}));

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

describe('Auth API', () => {
  describe('POST /api/auth/login', () => {
    it('缺少 code 参数应该返回错误', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.code).toBe(400);
      expect(response.body.message).toContain('code');
    });

    it('有 code 参数应该返回成功', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ code: 'test_code' });

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(0);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
    });
  });
});
