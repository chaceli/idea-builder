<template>
  <div id="app">
    <el-container class="app-container">
      <el-header v-if="showHeader" class="app-header">
        <div class="header-content">
          <router-link to="/" class="logo">
            <span class="logo-icon">💡</span>
            <span class="logo-text">IDEA Builder</span>
          </router-link>
          <el-menu
            mode="horizontal"
            :router="true"
            :default-active="currentRoute"
            class="header-menu"
          >
            <el-menu-item index="/">首页</el-menu-item>
            <el-menu-item index="/generate">生成专利</el-menu-item>
            <el-menu-item index="/patents">我的专利</el-menu-item>
            <el-menu-item index="/settings">设置</el-menu-item>
          </el-menu>
        </div>
      </el-header>
      <el-main class="app-main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const currentRoute = computed(() => route.path)

const showHeader = computed(() => {
  return !['/'].includes(route.path)
})
</script>

<style scoped>
.app-container {
  min-height: 100vh;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
}

.logo-icon {
  font-size: 28px;
  margin-right: 8px;
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
}

.header-menu {
  background: transparent;
  border: none;
}

:deep(.el-menu--horizontal > .el-menu-item) {
  color: rgba(255, 255, 255, 0.8);
  border: none;
}

:deep(.el-menu--horizontal > .el-menu-item:hover),
:deep(.el-menu--horizontal > .el-menu-item.is-active) {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.app-main {
  background: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
