// src/backend/src/middleware/logger.ts

import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';

const LOG_DIR = process.env.LOG_DIR || './logs';

// 确保日志目录存在
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// 日志级别
enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

class Logger {
  private logFile: string;

  constructor(module: string) {
    const date = new Date().toISOString().split('T')[0];
    this.logFile = path.join(LOG_DIR, `${date}.log`);
  }

  private write(level: LogLevel, message: string, meta?: object) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta,
    };

    const logLine = JSON.stringify(logEntry) + '\n';
    
    // 写入文件
    fs.appendFileSync(this.logFile, logLine);

    // 开发环境同时输出到控制台
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${timestamp}] [${level}] ${message}`, meta || '');
    }
  }

  debug(message: string, meta?: object) {
    this.write(LogLevel.DEBUG, message, meta);
  }

  info(message: string, meta?: object) {
    this.write(LogLevel.INFO, message, meta);
  }

  warn(message: string, meta?: object) {
    this.write(LogLevel.WARN, message, meta);
  }

  error(message: string, meta?: object) {
    this.write(LogLevel.ERROR, message, meta);
  }
}

// 创建日志中间件
export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const logger = new Logger('http');
  const start = Date.now();

  // 请求开始
  logger.info('Request started', {
    method: req.method,
    url: req.url,
    ip: req.ip,
  });

  // 请求结束
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
}

// 错误日志中间件
export function errorLogger(err: Error, req: Request, res: Response, next: NextFunction) {
  const logger = new Logger('error');
  
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
  });

  next(err);
}

export { Logger };
