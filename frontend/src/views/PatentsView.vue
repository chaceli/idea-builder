<template>
  <div class="patents-page">
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">我的专利</h1>
        <el-button type="primary" @click="router.push('/generate')">
          <el-icon><Plus /></el-icon>
          生成新专利
        </el-button>
      </div>

      <!-- 搜索和筛选 -->
      <el-card class="filter-card">
        <el-row :gutter="16" align="middle">
          <el-col :span="8">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索专利名称"
              :prefix-icon="Search"
              clearable
            />
          </el-col>
          <el-col :span="6">
            <el-select v-model="filterType" placeholder="专利类型" clearable>
              <el-option label="发明专利" value="invention" />
              <el-option label="实用新型" value="utility" />
              <el-option label="外观设计" value="design" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="sortBy" placeholder="排序方式">
              <el-option label="最新创建" value="createdAt" />
              <el-option label="最近更新" value="updatedAt" />
            </el-select>
          </el-col>
        </el-row>
      </el-card>

      <!-- 专利列表 -->
      <div v-if="loading" class="loading-state">
        <el-skeleton :rows="5" animated />
      </div>

      <el-empty 
        v-else-if="filteredPatents.length === 0" 
        description="暂无专利记录"
      >
        <el-button type="primary" @click="router.push('/generate')">
          开始生成第一个专利
        </el-button>
      </el-empty>

      <div v-else class="patent-grid">
        <el-card 
          v-for="patent in filteredPatents" 
          :key="patent.id"
          class="patent-card"
          @click="viewPatent(patent.id)"
        >
          <div class="patent-header">
            <el-tag :type="getTypeTag(patent.type)" size="small">
              {{ getTypeName(patent.type) }}
            </el-tag>
            <el-dropdown trigger="click" @command="(cmd: string) => handleCommand(cmd, patent)">
              <el-button text @click.stop>
                <el-icon><MoreFilled /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="view">查看详情</el-dropdown-item>
                  <el-dropdown-item command="export">导出</el-dropdown-item>
                  <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          
          <h3 class="patent-title">{{ patent.title }}</h3>
          
          <p class="patent-abstract">
            {{ patent.abstract || '暂无摘要' }}
          </p>
          
          <div class="patent-footer">
            <span class="patent-date">
              <el-icon><Calendar /></el-icon>
              {{ formatDate(patent.createdAt) }}
            </span>
            <el-tag :type="getStatusTag(patent.status)" size="small">
              {{ getStatusName(patent.status) }}
            </el-tag>
          </div>
        </el-card>
      </div>

      <!-- 分页 -->
      <div v-if="filteredPatents.length > 0" class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, MoreFilled, Calendar } from '@element-plus/icons-vue'
import { usePatentStore } from '@/stores/patent'
import type { Patent, PatentType, PatentStatus } from '@/types'

const router = useRouter()
const patentStore = usePatentStore()

const searchKeyword = ref('')
const filterType = ref<PatentType | ''>('')
const sortBy = ref<'createdAt' | 'updatedAt'>('createdAt')
const currentPage = ref(1)
const pageSize = ref(10)

const loading = computed(() => patentStore.loading)

const filteredPatents = computed(() => {
  let list = [...patentStore.patents]
  
  // 搜索过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    list = list.filter(p => 
      p.title.toLowerCase().includes(keyword) ||
      p.abstract?.toLowerCase().includes(keyword)
    )
  }
  
  // 类型过滤
  if (filterType.value) {
    list = list.filter(p => p.type === filterType.value)
  }
  
  // 排序
  list.sort((a, b) => {
    const aVal = a[sortBy.value]
    const bVal = b[sortBy.value]
    return new Date(bVal).getTime() - new Date(aVal).getTime()
  })
  
  return list
})

const total = computed(() => filteredPatents.value.length)

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

const getStatusTag = (status: PatentStatus) => {
  const map: Record<PatentStatus, 'info' | 'warning' | 'success' | 'danger'> = {
    draft: 'info',
    generating: 'warning',
    completed: 'success',
    failed: 'danger'
  }
  return map[status]
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
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const viewPatent = (id: string) => {
  router.push(`/patent/${id}`)
}

const handleCommand = async (command: string, patent: Patent) => {
  switch (command) {
    case 'view':
      viewPatent(patent.id)
      break
    case 'export':
      // TODO: 导出功能
      ElMessage.info('导出功能开发中')
      break
    case 'delete':
      try {
        await ElMessageBox.confirm(
          `确定要删除专利"${patent.title}"吗？此操作不可恢复。`,
          '删除确认',
          { type: 'warning' }
        )
        await patentStore.deletePatent(patent.id)
        ElMessage.success('删除成功')
      } catch {
        // 用户取消
      }
      break
  }
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
}

onMounted(() => {
  patentStore.fetchPatents()
})
</script>

<style scoped lang="scss">
.patents-page {
  min-height: calc(100vh - 60px);
  padding: 24px 0;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-title {
  margin: 0;
}

.filter-card {
  margin-bottom: 24px;
}

.loading-state {
  background: white;
  padding: 24px;
  border-radius: 8px;
}

.patent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.patent-card {
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
}

.patent-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.patent-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.patent-abstract {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 16px;
  min-height: 66px;
}

.patent-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.patent-date {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #909399;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .patent-grid {
    grid-template-columns: 1fr;
  }
}
</style>
