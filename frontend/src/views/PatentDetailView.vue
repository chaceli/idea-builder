<template>
  <div class="patent-detail-page">
    <div class="page-container">
      <!-- 顶部操作栏 -->
      <div class="detail-header">
        <el-button @click="router.push('/patents')">
          <el-icon><ArrowLeft /></el-icon>
          返回列表
        </el-button>
        <div class="header-actions">
          <el-button @click="handleCopy">
            <el-icon><CopyDocument /></el-icon>
            复制
          </el-button>
          <el-button @click="handleExport">
            <el-icon><Download /></el-icon>
            导出
          </el-button>
        </div>
      </div>

      <el-skeleton v-if="loading" :rows="10" animated />
      
      <template v-else-if="patent">
        <!-- 基本信息 -->
        <el-card class="info-card">
          <div class="patent-info">
            <div class="info-header">
              <h1 class="patent-title">{{ patent.title }}</h1>
              <div class="info-tags">
                <el-tag :type="getTypeTag(patent.type)">
                  {{ getTypeName(patent.type) }}
                </el-tag>
                <el-tag type="success">
                  {{ getStatusName(patent.status) }}
                </el-tag>
              </div>
            </div>
            <div class="info-meta">
              <span>创建时间：{{ formatDate(patent.createdAt) }}</span>
              <span>更新时间：{{ formatDate(patent.updatedAt) }}</span>
            </div>
          </div>
        </el-card>

        <!-- Tab 切换 -->
        <el-tabs v-model="activeTab" class="detail-tabs">
          <!-- 摘要 -->
          <el-tab-pane label="摘要" name="abstract">
            <el-card>
              <div class="content-section">
                <h3>专利摘要</h3>
                <div class="content-text" v-html="formatContent(patent.abstract)"></div>
              </div>
            </el-card>
          </el-tab-pane>

          <!-- 权利要求书 -->
          <el-tab-pane label="权利要求书" name="claims">
            <el-card>
              <div class="content-section">
                <h3>权利要求书</h3>
                <div class="content-text" v-html="formatContent(patent.claims)"></div>
              </div>
            </el-card>
          </el-tab-pane>

          <!-- 说明书 -->
          <el-tab-pane label="说明书" name="specification">
            <el-card>
              <div class="content-section">
                <h3>说明书</h3>
                <div class="content-text" v-html="formatContent(patent.specification)"></div>
              </div>
            </el-card>
          </el-tab-pane>

          <!-- 原始描述 -->
          <el-tab-pane label="原始描述" name="description">
            <el-card>
              <div class="content-section">
                <h3>发明描述</h3>
                <div class="content-text" v-html="formatContent(patent.description)"></div>
              </div>
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </template>

      <el-empty v-else description="专利不存在" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, CopyDocument, Download } from '@element-plus/icons-vue'
import { usePatentStore } from '@/stores/patent'
import type { PatentType, PatentStatus } from '@/types'

const route = useRoute()
const router = useRouter()
const patentStore = usePatentStore()

const activeTab = ref('abstract')

const loading = computed(() => patentStore.loading)
const patent = computed(() => patentStore.currentPatent)

const getTypeTag = (type: PatentType) => {
  const map: Record<PatentType, '' | 'success' | 'warning'> = {
    invention: '',
    utility: 'success',
    design: 'warning'
  }
  return map[type]
}

const getTypeName = (type: PatentType) => {
  const map: Record<PatentType, string> = {
    invention: '发明专利',
    utility: '实用新型',
    design: '外观设计'
  }
  return map[type]
}

const getStatusName = (status: PatentStatus) => {
  const map: Record<PatentStatus, string> = {
    draft: '草稿',
    generating: '生成中',
    completed: '已完成',
    failed: '失败'
  }
  return map[status]
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatContent = (content: string) => {
  if (!content) return '<p>暂无内容</p>'
  // 简单格式化：段落分隔
  return content
    .split('\n')
    .filter(p => p.trim())
    .map(p => `<p>${p}</p>`)
    .join('')
}

const handleCopy = async () => {
  const content = getCurrentTabContent()
  try {
    await navigator.clipboard.writeText(content)
    ElMessage.success('复制成功')
  } catch {
    ElMessage.error('复制失败')
  }
}

const getCurrentTabContent = () => {
  switch (activeTab.value) {
    case 'abstract':
      return patent.value?.abstract || ''
    case 'claims':
      return patent.value?.claims || ''
    case 'specification':
      return patent.value?.specification || ''
    case 'description':
      return patent.value?.description || ''
    default:
      return ''
  }
}

const handleExport = () => {
  ElMessage.info('导出功能开发中')
}

onMounted(() => {
  const id = route.params.id as string
  if (id) {
    patentStore.fetchPatentById(id)
  }
})
</script>

<style scoped lang="scss">
.patent-detail-page {
  min-height: calc(100vh - 60px);
  padding: 24px 0;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.info-card {
  margin-bottom: 24px;
}

.patent-info {
  .info-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 16px;
    
    @media (max-width: 600px) {
      flex-direction: column;
      gap: 12px;
    }
  }
  
  .patent-title {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
    margin: 0;
    line-height: 1.4;
  }
  
  .info-tags {
    display: flex;
    gap: 8px;
  }
  
  .info-meta {
    display: flex;
    gap: 24px;
    font-size: 14px;
    color: #909399;
    
    @media (max-width: 600px) {
      flex-direction: column;
      gap: 8px;
    }
  }
}

.detail-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 24px;
  }
  
  :deep(.el-tabs__item) {
    font-size: 16px;
    padding: 0 24px;
  }
}

.content-section {
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
  }
}

.content-text {
  font-size: 15px;
  line-height: 2;
  color: #606266;
  
  :deep(p) {
    margin-bottom: 16px;
    text-indent: 2em;
  }
}
</style>
