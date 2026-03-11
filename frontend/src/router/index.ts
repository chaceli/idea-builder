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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
