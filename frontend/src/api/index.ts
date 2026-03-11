import axios from 'axios'
import type { Patent, GenerateParams } from '@/types'

const api = axios.create({
  baseURL: '/api',
  timeout: 120000 // 2分钟超时，因为AI生成需要时间
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const patentApi = {
  // 获取专利列表
  getPatents: () => {
    return api.get<{ success: boolean; data: Patent[] }>('/patents')
      .then(res => res.data.data)
  },

  // 获取专利详情
  getPatent: (id: string) => {
    return api.get<{ success: boolean; data: Patent }>(`/patents/${id}`)
      .then(res => res.data.data)
  },

  // 生成专利
  generatePatent: (params: GenerateParams & { apiKey: string }) => {
    return api.post<{ success: boolean; data: Patent }>('/patents/generate', params)
      .then(res => res.data.data)
  },

  // 更新专利
  updatePatent: (id: string, updates: Partial<Patent>) => {
    return api.put<{ success: boolean; data: Patent }>(`/patents/${id}`, updates)
      .then(res => res.data.data)
  },

  // 删除专利
  deletePatent: (id: string) => {
    return api.delete<{ success: boolean }>(`/patents/${id}`)
  },

  // 导出专利
  exportPatent: (id: string, format: 'docx' | 'pdf') => {
    return api.get(`/patents/${id}/export`, {
      params: { format },
      responseType: 'blob'
    })
  }
}

export default api
