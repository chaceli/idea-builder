// src/backend/src/controllers/patentController.ts

import { Request, Response } from 'express';
import { Patent } from '../models/Patent';
import { PatentVersion } from '../models/PatentVersion';
import { PatentService } from '../services/PatentService';
import { AIService } from '../services/AIService';
import { MemoryService } from '../services/MemoryService';
import { EmotionService } from '../services/EmotionService';
import { TTSService } from '../services/TTSService';

export class PatentController {
  private patentService: PatentService;
  private aiService: AIService;

  constructor() {
    const memoryService = new MemoryService();
    const emotionService = new EmotionService();
    const ttsService = new TTSService();
    this.aiService = new AIService(memoryService, emotionService, ttsService);
    this.patentService = new PatentService(this.aiService);
  }

  // 获取专利列表
  async list(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { page = 1, pageSize = 10, status, type } = req.query;

      const where: any = { userId };
      if (status) where.status = status;
      if (type) where.type = type;

      const patents = await Patent.findAndCountAll({
        where,
        order: [['createdAt', 'DESC']],
        limit: Number(pageSize),
        offset: (Number(page) - 1) * Number(pageSize)
      });

      res.json({
        code: 0,
        message: 'success',
        data: {
          list: patents.rows,
          total: patents.count,
          page: Number(page),
          pageSize: Number(pageSize)
        }
      });
    } catch (error: any) {
      res.status(500).json({
        code: 500,
        message: error.message || '获取专利列表失败'
      });
    }
  }

  // 创建专利
  async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { title, type, field, description } = req.body;

      if (!title || !type || !field || !description) {
        return res.status(400).json({
          code: 400,
          message: '缺少必要参数'
        });
      }

      const patent = await Patent.create({
        userId,
        title,
        type,
        field,
        description,
        status: 'draft'
      });

      res.json({
        code: 0,
        message: 'success',
        data: patent
      });
    } catch (error: any) {
      res.status(500).json({
        code: 500,
        message: error.message || '创建专利失败'
      });
    }
  }

  // 获取专利详情
  async get(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;

      const patent = await Patent.findOne({
        where: { id, userId }
      });

      if (!patent) {
        return res.status(404).json({
          code: 404,
          message: '专利不存在'
        });
      }

      res.json({
        code: 0,
        message: 'success',
        data: patent
      });
    } catch (error: any) {
      res.status(500).json({
        code: 500,
        message: error.message || '获取专利详情失败'
      });
    }
  }

  // 更新专利
  async update(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      const { title, type, field, description, content, claims, specification, abstract } = req.body;

      const patent = await Patent.findOne({
        where: { id, userId }
      });

      if (!patent) {
        return res.status(404).json({
          code: 404,
          message: '专利不存在'
        });
      }

      // 如果有内容更新，保存版本
      if (content || claims) {
        await PatentVersion.create({
          patentId: patent.id,
          version: (patent.getDataValue('tokensUsed') || 0) + 1,
          content: patent.content,
          claims: patent.claims,
          changeLog: '手动更新'
        });
      }

      await patent.update({
        ...(title && { title }),
        ...(type && { type }),
        ...(field && { field }),
        ...(description && { description }),
        ...(content && { content }),
        ...(claims && { claims }),
        ...(specification && { specification }),
        ...(abstract && { abstract })
      });

      res.json({
        code: 0,
        message: 'success',
        data: patent
      });
    } catch (error: any) {
      res.status(500).json({
        code: 500,
        message: error.message || '更新专利失败'
      });
    }
  }

  // 删除专利
  async delete(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;

      const patent = await Patent.findOne({
        where: { id, userId }
      });

      if (!patent) {
        return res.status(404).json({
          code: 404,
          message: '专利不存在'
        });
      }

      await patent.destroy();

      res.json({
        code: 0,
        message: 'success'
      });
    } catch (error: any) {
      res.status(500).json({
        code: 500,
        message: error.message || '删除专利失败'
      });
    }
  }

  // 生成专利内容
  async generate(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      const { apiKey, model = 'abab6.5s-chat' } = req.body;

      const patent = await Patent.findOne({
        where: { id, userId }
      });

      if (!patent) {
        return res.status(404).json({
          code: 404,
          message: '专利不存在'
        });
      }

      // 更新状态为生成中
      await patent.update({ status: 'generating' });

      // 调用AI生成专利
      const result = await this.patentService.generatePatent(patent, apiKey, model);

      // 更新专利内容
      await patent.update({
        ...result,
        status: 'completed',
        aiModel: model
      });

      // 保存版本
      await PatentVersion.create({
        patentId: patent.id,
        version: 1,
        content: result.content,
        claims: result.claims,
        changeLog: 'AI生成'
      });

      res.json({
        code: 0,
        message: 'success',
        data: patent
      });
    } catch (error: any) {
      // 更新状态为失败
      const patent = await Patent.findByPk(req.params.id);
      if (patent) {
        await patent.update({
          status: 'failed',
          errorMessage: error.message
        });
      }

      res.status(500).json({
        code: 500,
        message: error.message || '生成专利失败'
      });
    }
  }

  // 优化专利
  async optimize(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      const { apiKey, model = 'abab6.5s-chat', type = 'all' } = req.body;

      const patent = await Patent.findOne({
        where: { id, userId }
      });

      if (!patent) {
        return res.status(404).json({
          code: 404,
          message: '专利不存在'
        });
      }

      // 调用AI优化专利
      const result = await this.patentService.optimizePatent(patent, apiKey, model, type);

      // 保存当前版本
      await PatentVersion.create({
        patentId: patent.id,
        version: (patent.getDataValue('tokensUsed') || 0) + 1,
        content: patent.content,
        claims: patent.claims,
        changeLog: '优化前版本'
      });

      // 更新专利内容
      await patent.update({
        ...result,
        status: 'completed'
      });

      res.json({
        code: 0,
        message: 'success',
        data: patent
      });
    } catch (error: any) {
      res.status(500).json({
        code: 500,
        message: error.message || '优化专利失败'
      });
    }
  }

  // 专利查重
  async check(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      const { apiKey, model = 'abab6.5s-chat' } = req.body;

      const patent = await Patent.findOne({
        where: { id, userId }
      });

      if (!patent) {
        return res.status(404).json({
          code: 404,
          message: '专利不存在'
        });
      }

      // 调用AI进行查重
      const result = await this.patentService.checkPatent(patent, apiKey, model);

      res.json({
        code: 0,
        message: 'success',
        data: result
      });
    } catch (error: any) {
      res.status(500).json({
        code: 500,
        message: error.message || '专利查重失败'
      });
    }
  }

  // 获取版本列表
  async listVersions(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;

      const patent = await Patent.findOne({
        where: { id, userId }
      });

      if (!patent) {
        return res.status(404).json({
          code: 404,
          message: '专利不存在'
        });
      }

      const versions = await PatentVersion.findAll({
        where: { patentId: id },
        order: [['version', 'DESC']]
      });

      res.json({
        code: 0,
        message: 'success',
        data: versions
      });
    } catch (error: any) {
      res.status(500).json({
        code: 500,
        message: error.message || '获取版本列表失败'
      });
    }
  }

  // 恢复版本
  async restoreVersion(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { id, versionId } = req.params;

      const patent = await Patent.findOne({
        where: { id, userId }
      });

      if (!patent) {
        return res.status(404).json({
          code: 404,
          message: '专利不存在'
        });
      }

      const version = await PatentVersion.findOne({
        where: { id: versionId, patentId: id }
      });

      if (!version) {
        return res.status(404).json({
          code: 404,
          message: '版本不存在'
        });
      }

      // 保存当前版本
      await PatentVersion.create({
        patentId: patent.id,
        version: (patent.getDataValue('tokensUsed') || 0) + 1,
        content: patent.content,
        claims: patent.claims,
        changeLog: '恢复版本前'
      });

      // 恢复版本内容
      await patent.update({
        content: version.content,
        claims: version.claims
      });

      res.json({
        code: 0,
        message: 'success',
        data: patent
      });
    } catch (error: any) {
      res.status(500).json({
        code: 500,
        message: error.message || '恢复版本失败'
      });
    }
  }
}
