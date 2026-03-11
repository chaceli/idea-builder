// src/backend/src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from 'express';

// 统一错误类
export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 错误类型工厂
export const errorTypes = {
  BAD_REQUEST: (message = '请求参数错误') => new AppError(message, 400, 'BAD_REQUEST'),
  UNAUTHORIZED: (message = '未授权') => new AppError(message, 401, 'UNAUTHORIZED'),
  FORBIDDEN: (message = '没有权限') => new AppError(message, 403, 'FORBIDDEN'),
  NOT_FOUND: (message = '资源不存在') => new AppError(message, 404, 'NOT_FOUND'),
  CONFLICT: (message = '资源冲突') => new AppError(message, 409, 'CONFLICT'),
  TOO_MANY_REQUESTS: (message = '请求过于频繁') => new AppError(message, 429, 'TOO_MANY_REQUESTS'),
  INTERNAL_ERROR: (message = '服务器内部错误') => new AppError(message, 500, 'INTERNAL_ERROR'),
  SERVICE_UNAVAILABLE: (message = '服务不可用') => new AppError(message, 503, 'SERVICE_UNAVAILABLE'),
};

// 全局错误处理中间件
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  // 如果已经发送了响应，跳过
  if (res.headersSent) {
    return next(err);
  }

  // 区分 AppError 和普通错误
  const error = err instanceof AppError ? err : errorTypes.INTERNAL_ERROR(err.message);

  // 记录错误日志
  console.error('Error:', {
    code: error.code,
    message: error.message,
    stack: error.isOperational ? undefined : error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // 生产环境隐藏详细错误信息
  const responseMessage = process.env.NODE_ENV === 'production' && !error.isOperational
    ? '服务器内部错误'
    : error.message;

  res.status(error.statusCode).json({
    code: error.statusCode,
    message: responseMessage,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
  });
}

// 异步错误包装器
export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// 404 处理
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    code: 404,
    message: `路由 ${req.method} ${req.url} 不存在`,
  });
}

// 未捕获的 Promise 异常处理
export function setupUncaughtExceptionHandler() {
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // 记录日志后优雅退出
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });
}
