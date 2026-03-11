import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/generate',
    name: 'Generate',
    component: () => import('@/views/GenerateView.vue')
  },
  {
    path: '/patents',
    name: 'Patents',
    component: () => import('@/views/PatentsView.vue')
  },
  {
    path: '/patent/:id',
    name: 'PatentDetail',
    component: () => import('@/views/PatentDetailView.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/SettingsView.vue')
  },
  // AI 陪伴助手
  {
    path: '/companion',
    redirect: '/companion/chat'
  },
  {
    path: '/companion/chat',
    name: 'CompanionChat',
    component: () => import('@/views/companion/chat.vue')
  },
  {
    path: '/companion/schedule',
    name: 'CompanionSchedule',
    component: () => import('@/views/companion/schedule.vue')
  },
  {
    path: '/companion/profile',
    name: 'CompanionProfile',
    component: () => import('@/views/companion/profile.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
