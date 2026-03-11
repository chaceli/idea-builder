// 专利类型
export type PatentType = 'invention' | 'utility' | 'design'

// 专利状态
export type PatentStatus = 'draft' | 'generating' | 'completed' | 'failed'

// 专利接口
export interface Patent {
  id: string
  title: string
  type: PatentType
  description: string
  abstract: string
  claims: string
  specification: string
  status: PatentStatus
  createdAt: string
  updatedAt: string
}

// 生成参数
export interface GenerateParams {
  type: PatentType
  title: string
  description: string
  field: string
  background?: string
}

// API 响应
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

// MiniMax 请求参数
export interface MiniMaxRequest {
  model: string
  messages: Array<{
    role: 'system' | 'user' | 'assistant'
    content: string
  }]
  temperature?: number
  max_tokens?: number
}

// MiniMax 响应
export interface MiniMaxResponse {
  id: string
  choices: Array<{
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}
