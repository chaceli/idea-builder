// src/backend/src/ai/adapters/OpenAIAdapter.ts

import axios from 'axios';
import { IAdapter, ChatOptions, ModelProvider } from './IAdapter';

/**
 * OpenAI 适配器
 * 支持 GPT-4o, GPT-4o-mini 等模型
 */
export class OpenAIAdapter implements IAdapter {
  name = 'OpenAI';
  modelId = 'gpt-4o';
  private baseUrl = 'https://api.openai.com/v1';

  // 支持的模型列表
  static readonly SUPPORTED_MODELS = ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'];

  setModel(modelId: string) {
    if (!OpenAIAdapter.SUPPORTED_MODELS.includes(modelId)) {
      throw new Error(`不支持的 OpenAI 模型: ${modelId}`);
    }
    this.modelId = modelId;
  }

  async chat(prompt: string, options?: ChatOptions): Promise<string> {
    const apiKey = options?.systemPrompt || process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenAI API Key 未配置');
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: this.modelId,
          max_tokens: options?.maxTokens || 1024,
          temperature: options?.temperature || 0.7,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
        }
      );

      const choice = (response.data as any).choices?.[0];
      return choice?.message?.content || '抱歉，我刚才走神了~';
    } catch (error: any) {
      console.error('OpenAI API 调用失败:', error?.response?.data || error?.message);
      throw new Error(`OpenAI API 调用失败: ${error?.response?.data?.error?.message || error?.message}`);
    }
  }

  async validateKey(apiKey: string): Promise<boolean> {
    try {
      await axios.post(
        `${this.baseUrl}/models`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        }
      );
      return true;
    } catch {
      return false;
    }
  }
}
