<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-badge">✨ AI 驱动</div>
        <h1 class="hero-title">
          专利生成器
          <span class="gradient-text">让创意变为现实</span>
        </h1>
        <p class="hero-desc">
          每个人都能轻松生成专业专利的 AI 平台<br>
          输入您的创意，AI 将为您生成完整的专利申请文件
        </p>
        <div class="hero-actions">
          <el-button type="primary" size="large" @click="startGenerate" class="hero-btn">
            <el-icon><Lightning /></el-icon>
            立即开始生成
          </el-button>
          <el-button size="large" @click="scrollToFeatures" class="hero-btn-outline">
            了解更多
          </el-button>
        </div>
      </div>
      <div class="hero-visual">
        <div class="visual-card">
          <div class="visual-header">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <div class="visual-content">
            <div class="code-line">
              <span class="keyword">输入</span>: 智能手表心率监测算法
            </div>
            <div class="code-line">
              <span class="keyword">AI 处理中</span>...
            </div>
            <div class="code-line success">✓ 专利名称生成完成</div>
            <div class="code-line success">✓ 摘要生成完成</div>
            <div class="code-line success">✓ 权利要求书生成完成</div>
            <div class="code-line success">✓ 说明书生成完成</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features">
      <div class="container">
        <h2 class="section-title">核心功能</h2>
        <div class="feature-grid">
          <div class="feature-card" v-for="feature in features" :key="feature.title">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Steps Section -->
    <section class="steps">
      <div class="container">
        <h2 class="section-title">使用流程</h2>
        <div class="step-list">
          <div class="step-item" v-for="(step, index) in steps" :key="index">
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-content">
              <h3>{{ step.title }}</h3>
              <p>{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="container">
        <h2>准备好生成您的专利了吗？</h2>
        <p>只需几分钟，AI 就能帮您完成专业的专利申请文件</p>
        <el-button type="primary" size="large" @click="startGenerate" class="cta-btn">
          开始生成专利
        </el-button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <p>© 2024 IDEA Builder. 让每个人都能成为发明家 💡</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Lightning } from '@element-plus/icons-vue'

const router = useRouter()

const features = [
  {
    icon: '💡',
    title: 'AI 专利构思',
    desc: '输入您的想法，AI 自动分析并生成专利创意'
  },
  {
    icon: '📝',
    title: '自动撰写',
    desc: '生成专利申请书、权利要求书、说明书等完整文件'
  },
  {
    icon: '🔍',
    title: '专利查重',
    desc: '智能检测相似专利，评估新颖性和创造性'
  },
  {
    icon: '⚡',
    title: '一键优化',
    desc: 'AI 智能优化专利内容，提升通过率'
  }
]

const steps = [
  {
    title: '输入 API Key',
    desc: '配置您的 MiniMax API 密钥（支持国内版）'
  },
  {
    title: '描述发明创意',
    desc: '用自然语言描述您的发明创意和技术方案'
  },
  {
    title: 'AI 自动生成',
    desc: 'AI 智能分析并生成完整的专利申请文件'
  },
  {
    title: 'AI 陪伴助手',
    icon: '✨',
    desc: '有灵魂的 AI 伙伴，情感陪伴+日程提醒',
    link: '/companion/chat'
  },
  {
    title: '查看与导出',
    desc: '查看生成的专利内容，支持导出 Word/PDF'
  }
]

const startGenerate = () => {
  router.push('/generate')
}

const scrollToFeatures = () => {
  const el = document.getElementById('features')
  el?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped lang="scss">
.home-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f0f2f5 0%, #ffffff 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

// Hero
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: calc(100vh - 60px);
  padding: 60px 24px;
  max-width: 1400px;
  margin: 0 auto;
  gap: 60px;

  @media (max-width: 900px) {
    flex-direction: column;
    text-align: center;
    padding: 40px 16px;
  }
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.hero-badge {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  margin-bottom: 20px;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    font-size: 36px;
  }
}

.gradient-text {
  display: block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-desc {
  font-size: 18px;
  color: #606266;
  margin-bottom: 32px;
  line-height: 1.8;

  @media (max-width: 768px) {
    font-size: 16px;
  }
}

.hero-actions {
  display: flex;
  gap: 16px;

  @media (max-width: 900px) {
    justify-content: center;
  }
}

.hero-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 16px 32px;
  font-size: 16px;
}

.hero-btn-outline {
  padding: 16px 32px;
  font-size: 16px;
}

// Hero Visual
.hero-visual {
  flex: 1;
  display: flex;
  justify-content: center;
}

.visual-card {
  background: #1e1e1e;
  border-radius: 12px;
  padding: 20px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.visual-header {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  
  &.red { background: #ff5f56; }
  &.yellow { background: #ffbd2e; }
  &.green { background: #27c93f; }
}

.visual-content {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  line-height: 2;
}

.code-line {
  color: #d4d4d4;
  
  .keyword {
    color: #c586c0;
  }
  
  &.success {
    color: #6a9955;
  }
}

// Features
.features {
  padding: 80px 0;
  background: white;
}

.section-title {
  text-align: center;
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 48px;
  color: #303133;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.feature-card {
  text-align: center;
  padding: 32px 24px;
  background: #f9fafc;
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  }
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.feature-card h3 {
  font-size: 18px;
  margin-bottom: 8px;
  color: #303133;
}

.feature-card p {
  color: #909399;
  font-size: 14px;
}

// Steps
.steps {
  padding: 80px 0;
  background: #f9fafc;
}

.step-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 24px;
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.step-number {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content h3 {
  font-size: 18px;
  margin-bottom: 4px;
  color: #303133;
}

.step-content p {
  color: #909399;
  font-size: 14px;
}

// CTA
.cta {
  padding: 80px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  text-align: center;
  color: white;
}

.cta h2 {
  font-size: 32px;
  margin-bottom: 16px;
}

.cta p {
  font-size: 18px;
  opacity: 0.9;
  margin-bottom: 32px;
}

.cta-btn {
  background: white;
  color: #667eea;
  border: none;
  padding: 16px 48px;
  font-size: 16px;
  font-weight: 600;

  &:hover {
    background: #f5f7fa;
  }
}

// Footer
.footer {
  padding: 24px 0;
  background: #1e1e1e;
  color: #909399;
  text-align: center;
  font-size: 14px;
}
</style>
