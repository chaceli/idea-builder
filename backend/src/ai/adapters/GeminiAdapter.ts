// src/backend/src/ai/adapters/GeminiAdapter.ts

import axios from 'axios';
import { IAdapter, ChatOptions, ModelProvider } from './IAdapter';

/**
 * Google Gemini 适配器
 * 支持 Gemini 1.5 Pro 等模型
 */
export class GeminiAdapter implements IAdapter {
  name = 'Google Gemini';
  modelId = 'gemini-1.5-pro';
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

  // 支持的模型列表
  static readonly SUPPORTED_MODELS = [
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
    'gemini-pro',
    'gemini-pro-vision',
  ];

  setModel(modelId: string) {
    if (!GeminiAdapter.SUPPORTED_MODELS.includes(modelId)) {
      throw new Error(`不支持的 Gemini 模型: ${modelId}`);
    }
    this.modelId = modelId;
  }

  async chat(prompt: string, options?: ChatOptions): Promise<string> {
    const apiKey = options?.systemPrompt || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Gemini API Key 未配置');
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/models/${this.modelId}:generateContent`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: options?.temperature || 0.7,
            maxOutputTokens: options?.maxTokens || 1024,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          params: {
            key: apiKey,
          },
        }
      );

      const candidate = (response.data as any).candidates?.[0];
      const content = candidate?.content?.parts?.[0]?.text;
      
      return content || '抱歉，我刚才走神了~';
    } catch (error: any) {
      console.error('Gemini API 调用失败:', error?.response?.data || error?.message);
      throw new Error(`Gemini API 调用失败: ${error?.response?.data?.error?.message || error?.message}`);
    }
  }

  async validateKey(apiKey: string): Promise<boolean> {
    try {
      await axios.get(
        `${this.baseUrl}/models`,
        {
          params: {
            key: apiKey,
          },
        }
      );
      return true;
    } catch {
      return false;
    }
  }
}
