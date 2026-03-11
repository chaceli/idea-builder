<template>
  <div class="settings-page">
    <div class="page-container">
      <h1 class="page-title">设置</h1>

      <el-row :gutter="24">
        <el-col :span="16" :xs="24">
          <!-- API Key 设置 -->
          <el-card class="settings-card">
            <template #header>
              <div class="card-header">
                <span>API 配置</span>
              </div>
            </template>
            
            <el-form label-position="top">
              <el-form-item label="MiniMax API Key">
                <el-input
                  v-model="apiKey"
                  type="password"
                  placeholder="请输入您的 MiniMax API Key"
                  show-password
                  clearable
                >
                  <template #prefix>
                    <el-icon><Key /></el-icon>
                  </template>
                </el-input>
                <div class="form-tip">
                  <el-link 
                    href="https://platform.minimax.com/" 
                    target="_blank"
                    type="primary"
                  >
                    获取 API Key
                  </el-link>
                  <span>（支持国内版 MiniMax API）</span>
                </div>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="saveApiKey" :loading="saving">
                  保存配置
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- 关于 -->
          <el-card class="settings-card">
            <template #header>
              <span>关于</span>
            </template>
            
            <div class="about-content">
              <div class="about-logo">
                <span class="logo-icon">💡</span>
                <span class="logo-text">IDEA Builder</span>
              </div>
              <p class="about-desc">
                每个人都能轻松生成专业专利的 AI 平台
              </p>
              <div class="about-info">
                <p>版本：1.0.0</p>
                <p>基于 Vue 3 + TypeScript + MiniMax API</p>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="8" :xs="24">
          <!-- 快捷操作 -->
          <el-card class="settings-card">
            <template #header>
              <span>快捷操作</span>
            </template>
            
            <div class="quick-actions">
              <el-button 
                type="primary" 
                class="action-btn"
                @click="router.push('/generate')"
              >
                <el-icon><MagicStick /></el-icon>
                生成专利
              </el-button>
              <el-button 
                class="action-btn"
                @click="router.push('/patents')"
              >
                <el-icon><Document /></el-icon>
                我的专利
              </el-button>
            </div>
          </el-card>

          <!-- 使用帮助 -->
          <el-card class="settings-card">
            <template #header>
              <span>使用帮助</span>
            </template>
            
            <el-collapse>
              <el-collapse-item title="如何获取 API Key？" name="1">
                <ol class="help-list">
                  <li>访问 <el-link href="https://platform.minimax.com/" target="_blank">MiniMax 开放平台</el-link></li>
                  <li>注册/登录账号</li>
                  <li>在控制台创建 API Key</li>
                  <li>复制 Key 并粘贴到上方输入框</li>
                </ol>
              </el-collapse-item>
              <el-collapse-item title="支持的专利类型？" name="2">
                <ul class="help-list">
                  <li><strong>发明专利</strong>：对产品、方法或者改进提出的新技术方案</li>
                  <li><strong>实用新型</strong>：对产品形状、构造提出的新技术方案</li>
                  <li><strong>外观设计</strong>：产品外观的新设计</li>
                </ul>
              </el-collapse-item>
              <el-collapse-item title="生成时间说明？" name="3">
                <p>首次生成约需 1-2 分钟，后续会缓存结果。生成时间取决于内容复杂度和 API 响应速度。</p>
              </el-collapse-item>
            </el-collapse>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Key, MagicStick, Document } from '@element-plus/icons-vue'
import { usePatentStore } from '@/stores/patent'

const router = useRouter()
const patentStore = usePatentStore()

const apiKey = ref('')
const saving = ref(false)

onMounted(() => {
  apiKey.value = patentStore.apiKey || ''
})

const saveApiKey = async () => {
  if (!apiKey.value.trim()) {
    ElMessage.warning('请输入 API Key')
    return
  }

  saving.value = true
  try {
    // 验证 API Key 格式
    if (!apiKey.value.startsWith('mmx-')) {
      ElMessage.warning('API Key 格式不正确')
      return
    }

    patentStore.setApiKey(apiKey.value.trim())
    ElMessage.success('API Key 保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped lang="scss">
.settings-page {
  min-height: calc(100vh - 60px);
  padding: 24px 0;
}

.settings-card {
  margin-bottom: 24px;
}

.card-header {
  font-weight: 600;
}

.form-tip {
  margin-top: 8px;
  font-size: 13px;
  color: #909399;
}

.about-content {
  text-align: center;
  padding: 16px 0;
}

.about-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
  
  .logo-icon {
    font-size: 32px;
  }
  
  .logo-text {
    font-size: 24px;
    font-weight: 600;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.about-desc {
  color: #606266;
  margin-bottom: 24px;
}

.about-info {
  font-size: 14px;
  color: #909399;
  
  p {
    margin: 4px 0;
  }
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  width: 100%;
  justify-content: flex-start;
  padding-left: 20px;
}

.help-list {
  padding-left: 20px;
  margin: 0;
  
  li {
    margin: 8px 0;
    color: #606266;
  }
  
  strong {
    color: #303133;
  }
}
</style>
