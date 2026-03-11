// src/backend/src/app.ts

import express, { Request, Response } from 'express';
import cors from 'cors';
import { config } from './config';
import { testConnection, syncDatabase } from './db/sequelize';
import { initRedis } from './db/redis';

// 中间件
import { loggerMiddleware, errorLogger } from './middleware/logger';
import { apiRateLimit } from './middleware/rateLimit';
import { securityHeaders, corsMiddleware, sqlInjectionProtection } from './middleware/security';
import { performanceMonitor, healthCheck } from './middleware/performance';
import { errorHandler, notFoundHandler, setupUncaughtExceptionHandler } from './middleware/errorHandler';

// 路由
import { authRouter } from './routes/auth';
import { chatRouter } from './routes/chat';
import { userRouter } from './routes/user';
import { scheduleRouter } from './routes/schedule';
import { patentRouter } from './routes/patent';

const app = express();

// 设置未捕获异常处理
setupUncaughtExceptionHandler();

// 安全中间件
app.use(securityHeaders);
app.use(corsMiddleware);

// 请求解析
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 性能监控
app.use(performanceMonitor);

// 请求日志
app.use(loggerMiddleware);

// SQL 注入防护
app.use(sqlInjectionProtection);

// 速率限制
app.use('/api', apiRateLimit);

// 路由
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
app.use('/api/user', userRouter);
app.use('/api/schedule', scheduleRouter);

// 健康检查（不需要鉴权）
app.get('/health', healthCheck);

// 错误处理
app.use(notFoundHandler);
app.use(errorLogger);
app.use(errorHandler);

// 启动服务
async function start() {
  try {
    // 连接数据库
    await testConnection();
    await syncDatabase();

    // 连接 Redis
    await initRedis();

    // 启动服务器
    app.listen(config.port, () => {
      console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🚀 AI 陪伴助手后端服务启动成功                  ║
║                                                   ║
║   本地:   http://localhost:${config.port}               ║
║   环境:   ${config.env.padEnd(36)}║
║                                                   ║
╚═══════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('启动失败:', error);
    process.exit(1);
  }
}

start();

export default app;
