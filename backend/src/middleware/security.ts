// src/backend/src/middleware/security.ts

import { Request, Response, NextFunction } from 'express';

// 安全响应头中间件
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // 防止 XSS
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // 防止点击劫持
  res.setHeader('X-Frame-Options', 'DENY');
  
  // 防止 MIME 类型嗅探
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Referrer 策略
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  );

  // HSTS（在 HTTPS 环境）
  if (req.protocol === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  next();
}

// 请求来源验证
export function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:8080',
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes('*')) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
}

// SQL 注入防护（基础）
export function sqlInjectionProtection(req: Request, res: Response, next: NextFunction) {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
    /(--|\/\*|\*\/|;--)/,
  ];

  const checkValue = (value: any): boolean => {
    if (typeof value === 'string') {
      return sqlPatterns.some(pattern => pattern.test(value));
    }
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(checkValue);
    }
    return false;
  };

  if (checkValue(req.body) || checkValue(req.query)) {
    return res.status(400).json({
      code: 400,
      message: '请求包含非法字符',
    });
  }

  next();
}

// 敏感信息过滤
export function sensitiveDataFilter(req: Request, res: Response, next: NextFunction) {
  const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'appSecret'];
  
  const filter = (obj: any): any => {
    if (!obj || typeof obj !== 'object') return obj;
    
    const result: any = Array.isArray(obj) ? [] : {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        result[key] = '***FILTERED***';
      } else if (typeof value === 'object') {
        result[key] = filter(value);
      } else {
        result[key] = value;
      }
    }
    
    return result;
  };

  // 记录请求时过滤敏感信息
  console.log('Request:', filter(req.body));
  
  next();
}
