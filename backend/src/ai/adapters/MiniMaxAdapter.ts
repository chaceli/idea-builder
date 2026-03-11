// src/backend/src/ai/adapters/MiniMaxAdapter.ts

import axios from 'axios';
import { IAdapter, ChatOptions, ModelProvider } from './IAdapter';

/**
 * MiniMax 适配器
 */
export class MiniMaxAdapter implements IAdapter {
  name = 'MiniMax';
  modelId = 'MiniMax-M2.5';
  private baseUrl = 'https://api.minimaxi.com/anthropic/v1';

  async chat(prompt: string, options?: ChatOptions): Promise<string> {
    const apiKey = options?.systemPrompt || process.env.AI_API_KEY;
    
    if (!apiKey) {
      throw new Error('MiniMax API Key 未配置');
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
      console.error('MiniMax API 调用失败:', error?.response?.data || error?.message);
      throw new Error(`MiniMax API 调用失败: ${error?.message}`);
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
