import { Patent } from '../models/Patent';
import { PatentVersion } from '../models/PatentVersion';
import { AIService } from '../services/AIService';
import { AdapterFactory } from '../ai/adapters';
import { config } from '../config';

export class PatentService {
  private aiService: AIService;

  constructor(aiService: AIService) {
    this.aiService = aiService;
  }

  // 创建专利
  async create(data: {
    userId: number;
    title: string;
    type: 'invention' | 'utility' | 'design';
    field: string;
    description: string;
  }): Promise<Patent> {
    return await Patent.create({
      ...data,
      status: 'draft',
    } as any);
  }

  // 生成专利内容
  async generate(patentId: number, prompt: string): Promise<Patent> {
    const patent = await Patent.findByPk(patentId);
    if (!patent) {
      throw new Error('专利不存在');
    }

    // 更新状态
    await patent.update({ status: 'generating' });

    try {
      // 调用 AI 生成内容
      const adapter = AdapterFactory.getAdapter(config.ai.model);
      const content = await adapter.chat(prompt, {
        maxTokens: 2048,
        temperature: 0.7,
      });

      // 保存内容
      await patent.update({
        content,
        status: 'completed',
      });

      // 创建版本记录
      await PatentVersion.create({
        patentId,
        version: 1,
        content,
      } as any);

      return patent;
    } catch (error: any) {
      await patent.update({
        status: 'failed',
        errorMessage: error.message,
      });
      throw error;
    }
  }

  // 获取专利详情
  async getById(id: number): Promise<Patent | null> {
    return await Patent.findByPk(id);
  }

  // 获取用户专利列表
  async getByUserId(userId: number): Promise<Patent[]> {
    return await Patent.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
  }

  // 删除专利
  async delete(id: number): Promise<void> {
    const patent = await Patent.findByPk(id);
    if (patent) {
      await patent.destroy();
    }
  }

  // 更新专利
  async update(id: number, data: Partial<Patent>): Promise<Patent> {
    const patent = await Patent.findByPk(id);
    if (!patent) {
      throw new Error('专利不存在');
    }
    await patent.update(data);
    return patent;
  }
}
