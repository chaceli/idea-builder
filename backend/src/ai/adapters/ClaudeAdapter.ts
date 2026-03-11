// src/backend/src/ai/adapters/ClaudeAdapter.ts

import axios from 'axios';
import { IAdapter, ChatOptions, ModelProvider } from './IAdapter';

/**
 * Anthropic Claude 适配器
 * 支持 Claude 3.5 Sonnet 等模型
 */
export class ClaudeAdapter implements IAdapter {
  name = 'Anthropic';
  modelId = 'claude-sonnet-3-5-20241022';
  private baseUrl = 'https://api.anthropic.com/v1';

  // 支持的模型列表
  static readonly SUPPORTED_MODELS = [
    'claude-sonnet-3-5-20241022',
    'claude-sonnet-3-5',
    'claude-3-opus-20240229',
    'claude-3-sonnet-20240229',
    'claude-3-haiku-20240307',
  ];

  setModel(modelId: string) {
    if (!ClaudeAdapter.SUPPORTED_MODELS.includes(modelId)) {
      throw new Error(`不支持的 Claude 模型: ${modelId}`);
    }
    this.modelId = modelId;
  }

  async chat(prompt: string, options?: ChatOptions): Promise<string> {
    const apiKey = options?.systemPrompt || process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      throw new Error('Anthropic API Key 未配置');
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/messages`,
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
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
        }
      );

      const content = (response.data as any).content;
      if (Array.isArray(content)) {
        const textBlock = content.find((block: any) => block.type === 'text');
        return textBlock?.text || '抱歉，我刚才走神了~';
      }

      return '抱歉，我刚才走神了~';
    } catch (error: any) {
      console.error('Claude API 调用失败:', error?.response?.data || error?.message);
      throw new Error(`Claude API 调用失败: ${error?.response?.data?.error?.message || error?.message}`);
    }
  }

  async validateKey(apiKey: string): Promise<boolean> {
    try {
      await axios.post(
        `${this.baseUrl}/messages`,
        {
          model: this.modelId,
          max_tokens: 10,
          messages: [{ role: 'user', content: 'Hi' }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
        }
      );
      return true;
    } catch {
      return false;
    }
  }
}
