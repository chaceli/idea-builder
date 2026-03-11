import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Patent, GenerateParams } from '@/types'
import { patentApi } from '@/api'

export const usePatentStore = defineStore('patent', () => {
  // 状态
  const patents = ref<Patent[]>([])
  const currentPatent = ref<Patent | null>(null)
  const loading = ref(false)
  const apiKey = ref(localStorage.getItem('apiKey') || '')

  // 计算属性
  const hasApiKey = computed(() => !!apiKey.value)

  // 方法
  const setApiKey = (key: string) => {
    apiKey.value = key
    localStorage.setItem('apiKey', key)
  }

  const fetchPatents = async () => {
    loading.value = true
    try {
      const data = await patentApi.getPatents()
      patents.value = data
    } catch (error) {
      console.error('获取专利列表失败:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchPatentById = async (id: string) => {
    loading.value = true
    try {
      const data = await patentApi.getPatent(id)
      currentPatent.value = data
    } catch (error) {
      console.error('获取专利详情失败:', error)
    } finally {
      loading.value = false
    }
  }

  const generatePatent = async (params: GenerateParams): Promise<Patent> => {
    loading.value = true
    try {
      const data = await patentApi.generatePatent({
        ...params,
        apiKey: apiKey.value
      })
      // 添加到列表
      patents.value.unshift(data)
      currentPatent.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  const updatePatent = async (id: string, updates: Partial<Patent>) => {
    try {
      const data = await patentApi.updatePatent(id, updates)
      const index = patents.value.findIndex(p => p.id === id)
      if (index !== -1) {
        patents.value[index] = data
      }
      if (currentPatent.value?.id === id) {
        currentPatent.value = data
      }
    } catch (error) {
      console.error('更新专利失败:', error)
    }
  }

  const deletePatent = async (id: string) => {
    try {
      await patentApi.deletePatent(id)
      patents.value = patents.value.filter(p => p.id !== id)
      if (currentPatent.value?.id === id) {
        currentPatent.value = null
      }
    } catch (error) {
      console.error('删除专利失败:', error)
    }
  }

  return {
    patents,
    currentPatent,
    loading,
    apiKey,
    hasApiKey,
    setApiKey,
    fetchPatents,
    fetchPatentById,
    generatePatent,
    updatePatent,
    deletePatent
  }
})
