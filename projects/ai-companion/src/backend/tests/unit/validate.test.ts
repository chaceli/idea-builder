// src/backend/tests/unit/validate.test.ts

import { validate, validationRules } from '../src/middleware/validate';
import { Request, Response, NextFunction } from 'express';

describe('Validation Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  describe('validate - 验证中间件', () => {
    it('必填字段为空应该返回错误', () => {
      const middleware = validate([
        { field: 'content', type: 'string', required: true },
      ]);

      mockRequest.body = {};

      middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 400,
          message: '参数验证失败',
        })
      );
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('通过验证应该调用 next', () => {
      const middleware = validate([
        { field: 'content', type: 'string', required: true },
      ]);

      mockRequest.body = { content: '你好' };

      middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('类型不匹配应该返回错误', () => {
      const middleware = validate([
        { field: 'count', type: 'number', required: true },
      ]);

      mockRequest.body = { count: '不是数字' };

      middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('超过最大长度应该返回错误', () => {
      const middleware = validate([
        { field: 'content', type: 'string', required: true, maxLength: 10 },
      ]);

      mockRequest.body = { content: 'a'.repeat(11) };

      middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          errors: expect.arrayContaining([expect.stringContaining('长度不能超过')]),
        })
      );
    });

    it('枚举值不匹配应该返回错误', () => {
      const middleware = validate([
        { field: 'type', type: 'string', required: true, enum: ['text', 'voice'] },
      ]);

      mockRequest.body = { type: 'video' };

      middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('非必填字段为空应该通过验证', () => {
      const middleware = validate([
        { field: 'nickname', type: 'string', required: false },
      ]);

      mockRequest.body = {};

      middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
    });
  });

  describe('validationRules - 预定义验证规则', () => {
    it('chatMessage 规则应该包含 content 字段', () => {
      expect(validationRules.chatMessage).toBeDefined();
      expect(validationRules.chatMessage).toContainEqual(
        expect.objectContaining({ field: 'content' })
      );
    });

    it('schedule 规则应该包含必填字段', () => {
      expect(validationRules.schedule).toBeDefined();
      const titleRule = validationRules.schedule.find(r => r.field === 'title');
      expect(titleRule?.required).toBe(true);
    });
  });
});
