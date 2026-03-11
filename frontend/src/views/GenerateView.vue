<template>
  <div class="generate-page">
    <div class="page-container">
      <h1 class="page-title">生成专利</h1>
      
      <el-row :gutter="24">
        <!-- 左侧：输入表单 -->
        <el-col :span="12" :xs="24">
          <el-card class="form-card">
            <template #header>
              <div class="card-header">
                <span>专利信息</span>
                <el-tag v-if="!hasApiKey" type="warning" size="small">请先配置 API Key</el-tag>
              </div>
            </template>
            
            <el-form 
              ref="formRef"
              :model="form" 
              :rules="rules" 
              label-position="top"
              size="large"
            >
              <el-form-item label="专利类型" prop="type">
                <el-radio-group v-model="form.type" class="type-radio-group">
                  <el-radio-button value="invention">
                    <div class="type-option">
                      <span class="type-icon">💡</span>
                      <span>发明专利</span>
                    </div>
                  </el-radio-button>
                  <el-radio-button value="utility">
                    <div class="type-option">
                      <span class="type-icon">⚙️</span>
                      <span>实用新型</span>
                    </div>
                  </el-radio-button>
                  <el-radio-button value="design">
                    <div class="type-option">
                      <span class="type-icon">🎨</span>
                      <span>外观设计</span>
                    </div>
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="技术领域" prop="field">
                <el-select 
                  v-model="form.field" 
                  placeholder="选择技术领域"
                  class="full-width"
                >
                  <el-option
                    v-for="field in techFields"
                    :key="field.value"
                    :label="field.label"
                    :value="field.value"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="发明名称" prop="title">
                <el-input 
                  v-model="form.title" 
                  placeholder="描述您的发明，例如：一种基于AI的智能推荐方法"
                  maxlength="50"
                  show-word-limit
                />
              </el-form-item>

              <el-form-item label="发明描述" prop="description">
                <el-input 
                  v-model="form.description"
                  type="textarea"
                  :rows="6"
                  placeholder="详细描述您的发明创意，包括：&#10;1. 发明要解决的技术问题&#10;2. 采用的技术方案&#10;3. 预期的技术效果"
                  maxlength="2000"
                  show-word-limit
                />
              </el-form-item>

              <el-form-item label="背景技术（可选）">
                <el-input 
                  v-model="form.background"
                  type="textarea"
                  :rows="4"
                  placeholder="描述现有技术的状况及存在的问题"
                  maxlength="1000"
                />
              </el-form-item>

              <el-form-item>
                <el-button 
                  type="primary" 
                  :loading="loading"
                  :disabled="!hasApiKey"
                  @click="handleGenerate"
                  class="generate-btn"
                >
                  <el-icon v-if="!loading"><MagicStick /></el-icon>
                  {{ loading ? '生成中...' : '开始生成专利' }}
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>

        <!-- 右侧：生成进度和结果 -->
        <el-col :span="12" :xs="24">
          <div class="result-section">
            <!-- 进度显示 -->
            <el-card v-if="loading || generatingSteps.length > 0" class="progress-card">
              <template #header>
                <span>生成进度</span>
              </template>
              <div class="progress-steps">
                <div 
                  v-for="(step, index) in generatingSteps" 
                  :key="index"
                  class="progress-step"
                  :class="{ completed: step.completed, active: step.active }"
                >
                  <el-icon v-if="step.completed" class="step-icon"><Check /></el-icon>
                  <el-icon v-else-if="step.active" class="step-icon loading"><Loading /></el-icon>
                  <span v-else class="step-dot"></span>
                  <span class="step-text">{{ step.label }}</span>
                </div>
              </div>
            </el-card>

            <!-- 生成结果 -->
            <el-card v-if="generatedPatent" class="result-card">
              <template #header>
                <div class="result-header">
                  <span>生成结果</span>
                  <div class="result-actions">
                    <el-button size="small" @click="viewDetail">
                      查看详情
                    </el-button>
                    <el-button size="small" type="primary" @click="goToPatentList">
                      我的专利
                    </el-button>
                  </div>
                </div>
              </template>
              
              <div class="result-preview">
                <h3>{{ generatedPatent.title }}</h3>
                <div class="patent-meta">
                  <el-tag :type="getTypeTag(generatedPatent.type)">
                    {{ getTypeName(generatedPatent.type) }}
                  </el-tag>
                  <el-tag type="success">已完成</el-tag>
                </div>
                <div class="patent-abstract">
                  <h4>摘要</h4>
                  <p>{{ generatedPatent.abstract }}</p>
                </div>
              </div>
            </el-card>

            <!-- 空白状态 -->
            <el-empty 
              v-if="!loading && generatingSteps.length === 0 && !generatedPatent"
              description="填写左侧表单，开始生成专利"
              :image-size="120"
            />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { MagicStick, Check, Loading } from '@element-plus/icons-vue'
import { usePatentStore } from '@/stores/patent'
import type { GenerateParams, PatentType } from '@/types'

const router = useRouter()
const patentStore = usePatentStore()

const formRef = ref()
const loading = ref(false)
const generatedPatent = ref<any>(null)

const form = reactive({
  type: 'invention' as PatentType,
  field: '',
  title: '',
  description: '',
  background: ''
})

const hasApiKey = computed(() => patentStore.hasApiKey)

const techFields = [
  { label: '人工智能', value: '人工智能' },
  { label: '计算机技术', value: '计算机技术' },
  { label: '电子通信', value: '电子通信' },
  { label: '机械工程', value: '机械工程' },
  { label: '生物医药', value: '生物医药' },
  { label: '新能源', value: '新能源' },
  { label: '材料科学', value: '材料科学' },
  { label: '其他', value: '其他' }
]

const rules = {
  type: [{ required: true, message: '请选择专利类型', trigger: 'change' }],
  field: [{ required: true, message: '请选择技术领域', trigger: 'change' }],
  title: [
    { required: true, message: '请输入发明名称', trigger: 'blur' },
    { min: 5, max: 50, message: '长度在 5 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入发明描述', trigger: 'blur' },
    { min: 20, message: '描述至少 20 个字符', trigger: 'blur' }
  ]
}

const generatingSteps = ref<Array<{ label: string; completed: boolean; active: boolean }>>([])

const initSteps = () => {
  generatingSteps.value = [
    { label: '生成专利标题', completed: false, active: false },
    { label: '生成专利摘要', completed: false, active: false },
    { label: '生成权利要求书', completed: false, active: false },
    { label: '生成说明书', completed: false, active: false }
  ]
}

const updateStep = (index: number, completed: boolean, active: boolean) => {
  generatingSteps.value[index] = { ...generatingSteps.value[index], completed, active }
}

const handleGenerate = async () => {
  if (!hasApiKey.value) {
    ElMessage.warning('请先在设置页面配置 API Key')
    router.push('/settings')
    return
  }

  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  generatedPatent.value = null
  initSteps()

  try {
    // 步骤1: 生成标题
    updateStep(0, false, true)
    const params: GenerateParams = {
      type: form.type,
      title: form.title,
      description: form.description,
      field: form.field,
      background: form.background
    }
    
    const patent = await patentStore.generatePatent(params)
    
    // 模拟步骤完成（实际由后端返回进度）
    updateStep(0, true, false)
    updateStep(1, true, false)
    updateStep(2, true, false)
    updateStep(3, true, false)
    
    generatedPatent.value = patent
    ElMessage.success('专利生成成功！')
  } catch (error: any) {
    console.error('生成失败:', error)
    ElMessage.error(error.message || '生成失败，请重试')
  } finally {
    loading.value = false
  }
}

const getTypeTag = (type: PatentType) => {
  const map = { invention: '', utility: 'success', design: 'warning' }
  return map[type]
}

const getTypeName = (type: PatentType) => {
  const map = { invention: '发明专利', utility: '实用新型', design: '外观设计' }
  return map[type]
}

const viewDetail = () => {
  if (generatedPatent.value) {
    router.push(`/patent/${generatedPatent.value.id}`)
  }
}

const goToPatentList = () => {
  router.push('/patents')
}
</script>

<style scoped lang="scss">
.generate-page {
  min-height: calc(100vh - 60px);
  padding: 24px 0;
}

.form-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.type-radio-group {
  display: flex;
  width: 100%;
  
  :deep(.el-radio-button) {
    flex: 1;
  }
  
  :deep(.el-radio-button__inner) {
    width: 100%;
    padding: 12px;
  }
}

.type-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  
  .type-icon {
    font-size: 24px;
  }
}

.full-width {
  width: 100%;
}

.generate-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  margin-top: 16px;
}

.result-section {
  position: sticky;
  top: 24px;
}

.progress-card {
  margin-bottom: 24px;
}

.progress-steps {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.progress-step {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &.completed {
    background: #f0f9eb;
    
    .step-icon {
      color: #67c23a;
    }
    
    .step-text {
      color: #67c23a;
    }
  }
  
  &.active {
    background: #ecf5ff;
    
    .step-icon {
      color: #409eff;
    }
    
    .step-text {
      color: #409eff;
    }
  }
}

.step-icon {
  font-size: 18px;
  
  &.loading {
    animation: rotate 1s linear infinite;
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.step-dot {
  width: 18px;
  height: 18px;
  border: 2px solid #dcdfe6;
  border-radius: 50%;
}

.step-text {
  font-size: 14px;
  color: #606266;
}

.result-card {
  .result-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .result-actions {
    display: flex;
    gap: 8px;
  }
}

.result-preview {
  h3 {
    font-size: 18px;
    margin-bottom: 12px;
    color: #303133;
  }
  
  .patent-meta {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }
  
  .patent-abstract {
    h4 {
      font-size: 14px;
      color: #909399;
      margin-bottom: 8px;
    }
    
    p {
      font-size: 14px;
      color: #606266;
      line-height: 1.8;
      max-height: 200px;
      overflow-y: auto;
    }
  }
}

// 响应式
@media (max-width: 768px) {
  .result-section {
    position: static;
    margin-top: 24px;
  }
}
</style>
