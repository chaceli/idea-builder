// src/backend/src/middleware/performance.ts

import { Request, Response, NextFunction } from 'express';

// 性能指标收集
interface PerformanceMetrics {
  requestCount: number;
  avgResponseTime: number;
  errorRate: number;
  memoryUsage: number;
  cpuUsage: number;
}

// 内存使用监控
export function memoryMonitor() {
  const used = process.memoryUsage();
  return {
    heapUsed: Math.round(used.heapUsed / 1024 / 1024), // MB
    heapTotal: Math.round(used.heapTotal / 1024 / 1024), // MB
    rss: Math.round(used.rss / 1024 / 1024), // MB
    external: Math.round(used.external / 1024 / 1024), // MB
  };
}

// 性能监控中间件
export function performanceMonitor(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();

  // 请求结束
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const status = res.statusCode;

    // 慢请求告警
    if (duration > 3000) {
      console.warn(`[SLOW REQUEST] ${req.method} ${req.url} took ${duration}ms`);
    }
  });

  next();
}

// 获取性能指标
export async function getPerformanceMetrics(): Promise<PerformanceMetrics> {
  const mem = memoryMonitor();
  
  return {
    requestCount: 0,
    avgResponseTime: 0,
    errorRate: 0,
    memoryUsage: mem.heapUsed,
    cpuUsage: 0,
  };
}

// 健康检查接口
export async function healthCheck(req: Request, res: Response) {
  const mem = memoryMonitor();
  
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: mem,
  };

  // 如果内存使用过高，返回警告
  if (mem.heapUsed > 500) {
    health.status = 'warning';
  }

  res.json(health);
}
