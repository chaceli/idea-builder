// src/backend/src/ai/adapters/index.ts

import { IAdapter, ModelProvider, SUPPORTED_MODELS, ModelInfo } from './IAdapter';
import { MiniMaxAdapter } from './MiniMaxAdapter';
import { OpenAIAdapter } from './OpenAIAdapter';
import { ClaudeAdapter } from './ClaudeAdapter';
import { GeminiAdapter } from './GeminiAdapter';

/**
 * AI 适配器工厂
 * 根据模型 ID 创建对应的适配器
 */
export class AdapterFactory {
  private static adapters: Map<string, IAdapter> = new Map();

  /**
   * 获取适配器实例
   */
  static getAdapter(modelId: string): IAdapter {
    // 尝试从缓存获取
    if (this.adapters.has(modelId)) {
      return this.adapters.get(modelId)!;
    }

    // 根据模型 ID 判断提供商并创建适配器
    const adapter = this.createAdapter(modelId);
    this.adapters.set(modelId, adapter);
    return adapter;
  }

  /**
   * 根据模型 ID 创建对应的适配器
   */
  private static createAdapter(modelId: string): IAdapter {
    if (modelId.startsWith('MiniMax')) {
      return new MiniMaxAdapter();
    }
    
    if (modelId.startsWith('gpt-')) {
      const adapter = new OpenAIAdapter();
      adapter.setModel(modelId);
      return adapter;
    }
    
    if (modelId.startsWith('claude-')) {
      const adapter = new ClaudeAdapter();
      adapter.setModel(modelId);
      return adapter;
    }
    
    if (modelId.startsWith('gemini-')) {
      const adapter = new GeminiAdapter();
      adapter.setModel(modelId);
      return adapter;
    }

    // 默认使用 MiniMax
    console.warn(`未知模型 ID: ${modelId}, 默认为 MiniMax`);
    return new MiniMaxAdapter();
  }

  /**
   * 获取所有支持的模型列表
   */
  static getSupportedModels(): ModelInfo[] {
    return SUPPORTED_MODELS;
  }

  /**
   * 根据提供商获取模型列表
   */
  static getModelsByProvider(provider: ModelProvider): ModelInfo[] {
    return SUPPORTED_MODELS.filter(m => m.provider === provider);
  }
}

// 导出所有适配器类和接口
export { IAdapter, ModelProvider, ModelInfo, SUPPORTED_MODELS } from './IAdapter';
export { MiniMaxAdapter } from './MiniMaxAdapter';
export { OpenAIAdapter } from './OpenAIAdapter';
export { ClaudeAdapter } from './ClaudeAdapter';
export { GeminiAdapter } from './GeminiAdapter';
