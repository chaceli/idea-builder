// src/backend/src/ai/adapters/IAdapter.ts

/**
 * AI 适配器接口
 * 所有模型适配器都需要实现这个接口
 */
export interface IAdapter {
  /** 适配器名称 */
  name: string;
  
  /** 模型 ID */
  modelId: string;

  /**
   * 调用 AI 生成回复
   * @param prompt 完整的提示词
   * @param options 额外选项
   */
  chat(prompt: string, options?: ChatOptions): Promise<string>;

  /**
   * 检查 API Key 是否有效
   */
  validateKey(apiKey: string): Promise<boolean>;
}

export interface ChatOptions {
  /** 最大输出 token 数 */
  maxTokens?: number;
  /** 温度参数 */
  temperature?: number;
  /** 系统提示词 */
  systemPrompt?: string;
}

/** 支持的模型提供商 */
export enum ModelProvider {
  MINIMAX = 'minimax',
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic', // Claude
  GEMINI = 'gemini',
}

/** 模型信息 */
export interface ModelInfo {
  id: string;
  name: string;
  provider: ModelProvider;
  description: string;
  supportsVision?: boolean; // 是否支持图片输入
  supportsFunctionCall?: boolean; // 是否支持函数调用
}

/** 可用模型列表 */
export const SUPPORTED_MODELS: ModelInfo[] = [
  {
    id: 'MiniMax-M2.5',
    name: 'MiniMax M2.5',
    provider: ModelProvider.MINIMAX,
    description: 'MiniMax 最新模型，中文效果优秀',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: ModelProvider.OPENAI,
    description: 'OpenAI 最新旗舰模型',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: ModelProvider.OPENAI,
    description: 'OpenAI 性价比最高的模型',
  },
  {
    id: 'claude-sonnet-3.5',
    name: 'Claude 3.5 Sonnet',
    provider: ModelProvider.ANTHROPIC,
    description: 'Anthropic Claude 模型',
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: ModelProvider.GEMINI,
    description: 'Google Gemini 旗舰模型',
  },
];

/** 根据模型 ID 获取提供商 */
export function getProviderByModel(modelId: string): ModelProvider | null {
  const model = SUPPORTED_MODELS.find(m => m.id === modelId);
  return model?.provider || null;
}
