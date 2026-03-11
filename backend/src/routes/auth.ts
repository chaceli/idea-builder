// src/backend/src/routes/auth.ts

import { Router, Request, Response } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { UserService } from '../services/UserService';

const router = Router();
const userService = new UserService();

// 微信登录
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { code, userInfo } = req.body;

    if (!code) {
      return res.status(400).json({
        code: 400,
        message: '缺少 code 参数',
      });
    }

    // 调用微信 API 获取 openid
    const wxResponse = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
      params: {
        appid: config.wechat.appId,
        secret: config.wechat.appSecret,
        js_code: code,
        grant_type: 'authorization_code',
      },
    });

    const wxData = wxResponse.data as any;
    if (wxData.errcode) {
      return res.status(400).json({
        code: 400,
        message: '微信登录失败',
      });
    }

    const { openid } = wxData;

    // 查找或创建用户
    const user = await userService.findOrCreateByOpenId(openid, userInfo);

    // 生成 JWT
    const token = jwt.sign(
      {
        id: user.id,
        openid,
      },
      config.jwt.secret,
      { expiresIn: '7d' }
    );

    res.json({
      code: 0,
      data: {
        token,
        user: {
          id: user.id,
          nickname: user.nickname,
          avatar: user.avatar,
          personality: user.personality,
        },
      },
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({
      code: 500,
      message: '登录失败',
    });
  }
});

// 测试登录（跳过微信，直接创建测试用户）
router.post('/test-login', async (req: Request, res: Response) => {
  try {
    // 直接创建一个测试用户
    const testOpenId = 'test_user_' + Date.now();
    
    const user = await userService.findOrCreateByOpenId(testOpenId, {
      nickname: '测试用户',
      avatar: '',
    });

    // 生成 JWT
    const token = jwt.sign(
      {
        id: user.id,
        openid: testOpenId,
      },
      config.jwt.secret,
      { expiresIn: '7d' }
    );

    res.json({
      code: 0,
      data: {
        token,
        user: {
          id: user.id,
          nickname: user.nickname,
          avatar: user.avatar,
          personality: user.personality,
        },
      },
    });
  } catch (error) {
    console.error('测试登录失败:', error);
    res.status(500).json({
      code: 500,
      message: '测试登录失败',
    });
  }
});

export { router as authRouter };
